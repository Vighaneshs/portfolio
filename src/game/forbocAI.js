import { CreateMLCEngine } from '@mlc-ai/web-llm';
import { updateNPCStateLocally } from 'forbocai';

// Soul functions removed in forbocai v0.6+ — implemented locally
const createSoul = (id, name, description, state, memories = []) => ({
    id,
    name,
    description,
    state,
    memories,
    createdAt: Date.now(),
});
const serializeSoul = (soul) => JSON.stringify(soul);
const deserializeSoul = (json) => JSON.parse(json);
const validateSoul = (soul) => {
    const errors = [];
    if (!soul?.id) errors.push('Soul missing id');
    if (!soul?.name) errors.push('Soul missing name');
    if (!soul?.state) errors.push('Soul missing state');
    return { valid: errors.length === 0, errors };
};

// Local implementations of bridge/presets removed from forbocai v0.6+
const RPG_MOODS = {
    hostile: 'hostile',
    suspicious: 'suspicious',
    neutral: 'neutral',
    friendly: 'friendly',
    loyal: 'loyal',
};

const createRPGState = (partial) => ({
    inventory: partial?.inventory ?? [],
    hp: partial?.hp ?? 100,
    mana: partial?.mana ?? 100,
    skills: partial?.skills ?? {},
    relationships: partial?.relationships ?? {},
    mood: partial?.mood ?? 'neutral',
    ...partial,
});

const rpgFallbackStrategy = (state) => {
    if ((state.hp || 100) < 20) {
        return { instruction: 'FLEE', directive: 'CRITICAL (Fallback): Low Health detected.' };
    }
    return { instruction: 'IDLE', directive: 'Autonomous' };
};

const resourceRule = {
    id: 'core.resources',
    name: 'Resource Validation',
    description: 'Ensures agent has required resources for action',
    actionTypes: ['ATTACK', 'CAST', 'USE_ITEM'],
    validate: (action, context) => {
        const agent = context?.agentState || {};
        const hp = agent.hp ?? 100;
        const mana = agent.mana ?? 100;
        if (hp <= 0) {
            return { valid: false, reason: 'Agent is dead and cannot perform actions', correctedAction: { ...action, type: 'IDLE', reason: 'Agent dead' } };
        }
        if (action.type === 'CAST') {
            const manaCost = action.payload?.manaCost || 10;
            if (mana < manaCost) {
                return { valid: false, reason: `Insufficient mana: need ${manaCost}, have ${mana}`, correctedAction: { ...action, type: 'IDLE', reason: 'Not enough mana' } };
            }
        }
        return { valid: true };
    }
};

const attackRule = {
    id: 'core.attack',
    name: 'Attack Validation',
    description: 'Ensures ATTACK actions have valid targetId',
    actionTypes: ['ATTACK', 'attack'],
    validate: (action, context) => {
        if (!action.target && !action.payload?.targetId) {
            return { valid: false, reason: 'ATTACK action must have a target or targetId', correctedAction: { ...action, type: 'IDLE', reason: 'Invalid ATTACK - no target specified' } };
        }
        const entities = context?.worldState?.entities || [];
        const targetId = action.target || action.payload?.targetId;
        if (entities.length > 0 && !entities.includes(targetId)) {
            return { valid: false, reason: `ATTACK target '${targetId}' does not exist in world`, correctedAction: { ...action, type: 'IDLE', reason: 'Target not found' } };
        }
        return { valid: true };
    }
};

const speakRule = {
    id: 'core.speak',
    name: 'Speak Validation',
    description: 'Ensures SPEAK actions have non-empty text',
    actionTypes: ['SPEAK', 'speak'],
    validate: (action, context) => {
        const text = action.payload?.text;
        if (!text || text.trim().length === 0) {
            return { valid: false, reason: 'SPEAK action must have non-empty text', correctedAction: { ...action, type: 'IDLE', reason: 'Empty speech' } };
        }
        const maxLength = context?.constraints?.maxSpeechLength || 1000;
        if (text.length > maxLength) {
            return { valid: true, reason: `Speech truncated to ${maxLength} characters`, correctedAction: { ...action, payload: { ...action.payload, text: text.substring(0, maxLength) } } };
        }
        return { valid: true };
    }
};

const validateAction = (action, rules, context = {}) => {
    for (const rule of rules) {
        if (rule.actionTypes.some(t => t.toLowerCase() === action.type.toLowerCase())) {
            const result = rule.validate(action, context);
            if (!result.valid) return result;
        }
    }
    return { valid: true };
};

const createBridge = (config = {}) => {
    const strictMode = config.strictMode ?? false;
    const rules = new Map();
    if (config.customRules) {
        config.customRules.forEach(rule => rules.set(rule.id, rule));
    }
    return {
        registerRule(rule) { rules.set(rule.id, rule); },
        async validate(action, context = {}) {
            const applicableRules = [...rules.values()].filter(
                rule => rule.actionTypes.some(t => t.toLowerCase() === action.type.toLowerCase())
            );
            if (strictMode && applicableRules.length === 0) {
                const safeTypes = ['IDLE', 'idle', 'WAIT', 'wait'];
                if (!safeTypes.includes(action.type)) {
                    return { valid: false, reason: `Unknown action type '${action.type}' in strict mode`, correctedAction: { ...action, type: 'IDLE', reason: 'Unknown action type' } };
                }
            }
            let currentAction = action;
            for (const rule of applicableRules) {
                const result = rule.validate(currentAction, context);
                if (!result.valid) return result;
                if (result.correctedAction) currentAction = result.correctedAction;
            }
            return { valid: true };
        }
    };
};

let engine = null;
let bridge = null;
let npcSoul = null;
let ready = false;
let initializing = false;
let error = null;
let conversationHistory = [];
const validationLog = [];

const MODEL_ID = 'SmolLM2-135M-Instruct-q0f16-MLC';

const PERSONA = `You are a friendly AI guide to Vighanesh's portfolio website. This portfolio is built as a retro game where each room represents a section:
- WORK room: work experience and career history
- PROJECTS room: personal projects
- EDUCATION room: academic background
- CONTACT room: ways to reach Vighanesh
- ABOUT room: general info about the portfolio

Keep responses concise (2-3 sentences max). You can suggest the visitor explore specific rooms by mentioning them naturally. If recommending a room, end your response with [NAVIGATE:roomname] where roomname is one of: work, projects, education, contact, about.`;

const NAVIGATION_RULE = {
    id: 'navigation',
    name: 'Room Navigation',
    description: 'Validates navigation actions to portfolio rooms',
    actionTypes: ['NAVIGATE'],
    validate: (action) => {
        const validRooms = ['work', 'projects', 'education', 'contact', 'about'];
        if (validRooms.includes(action.target)) {
            return { valid: true };
        }
        return { valid: false, reason: `Unknown room: ${action.target}` };
    }
};

// Custom combat rules (extend SDK presets)
const COMBAT_DEFEND_RULE = {
    id: 'combat-defend',
    name: 'Defend Validation',
    description: 'Can only defend if alive',
    actionTypes: ['DEFEND'],
    validate: (_action, context) => {
        const hp = context?.agentState?.hp ?? 1;
        return hp > 0 ? { valid: true } : { valid: false, reason: 'Cannot defend while defeated' };
    }
};
const COMBAT_HEAL_RULE = {
    id: 'combat-heal',
    name: 'Heal Validation',
    description: 'Requires 10 mana to heal',
    actionTypes: ['HEAL'],
    validate: (_action, context) => {
        const mana = context?.agentState?.mana ?? 0;
        return mana >= 10 ? { valid: true } : { valid: false, reason: 'Not enough mana (need 10)' };
    }
};
const COMBAT_FLEE_RULE = {
    id: 'combat-flee',
    name: 'Flee Validation',
    description: 'Flee is always valid',
    actionTypes: ['FLEE'],
    validate: () => ({ valid: true })
};
const COMBAT_SUPER_RULE = {
    id: 'combat-super',
    name: 'Super Attack Validation',
    description: 'Super attack valid when alive',
    actionTypes: ['SUPER_ATTACK'],
    validate: (_action, context) => {
        const hp = context?.agentState?.hp ?? 1;
        return hp > 0 ? { valid: true } : { valid: false, reason: 'Cannot attack while defeated' };
    }
};

// In-browser memory store (replaces LanceDB-based SDK memory)
const memoryStore = {
    items: [],
    store(text, type = 'observation', importance = 0.5) {
        const item = {
            id: `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            text,
            timestamp: Date.now(),
            type,
            importance
        };
        this.items.push(item);
        if (this.items.length > 50) this.items.shift();
        return item;
    },
    recall(query, limit = 5) {
        const queryLower = query.toLowerCase();
        return this.items
            .map(item => ({
                ...item,
                score: item.text.toLowerCase().includes(queryLower) ? 1 : 0
            }))
            .sort((a, b) => b.score - a.score || b.timestamp - a.timestamp)
            .slice(0, limit);
    }
};

function logValidation(action, result, rule) {
    validationLog.push({ action, result: { valid: result.valid, reason: result.reason }, rule, timestamp: Date.now() });
    if (validationLog.length > 8) validationLog.shift();
}

export function getValidationLog() {
    return [...validationLog];
}

export function getNpcSoul() {
    return npcSoul ? { ...npcSoul } : null;
}

function initSoul() {
    const saved = localStorage.getItem('npc-soul');
    if (saved) {
        try {
            const restored = deserializeSoul(saved);
            const validation = validateSoul(restored);
            if (validation.valid) {
                npcSoul = restored;
                logValidation('SOUL_RESTORE', { valid: true }, 'validateSoul');
                return;
            }
            logValidation('SOUL_RESTORE', { valid: false, reason: validation.errors.join(', ') }, 'validateSoul');
        } catch (e) {
            logValidation('SOUL_RESTORE', { valid: false, reason: e.message }, 'deserializeSoul');
        }
    }
    // Create fresh soul
    npcSoul = createSoul(
        'arena-guardian',
        'Arena Guardian',
        'A battle-hardened NPC that guards the about room and challenges visitors to combat.',
        createRPGState({ hp: 80, mana: 20, mood: RPG_MOODS.neutral }),
        []
    );
    logValidation('SOUL_CREATE', { valid: true }, 'createSoul');
}

export function persistNpcSoul(combatResult, combatMemories = []) {
    if (!npcSoul) return;
    const isNpcWin = combatResult === 'defeat';
    npcSoul = {
        ...npcSoul,
        state: updateNPCStateLocally(npcSoul.state, {
            mood: isNpcWin ? RPG_MOODS.loyal : RPG_MOODS.friendly,
            wins: (npcSoul.state.wins || 0) + (isNpcWin ? 1 : 0),
            losses: (npcSoul.state.losses || 0) + (isNpcWin ? 0 : 1),
        }),
        memories: [...npcSoul.memories, ...combatMemories].slice(-20),
    };
    const json = serializeSoul(npcSoul);
    localStorage.setItem('npc-soul', json);
    logValidation('SOUL_PERSIST', { valid: true }, 'serializeSoul');
}

export function resetNpcSoul() {
    localStorage.removeItem('npc-soul');
    npcSoul = createSoul(
        'arena-guardian',
        'Arena Guardian',
        'A battle-hardened NPC that guards the about room and challenges visitors to combat.',
        createRPGState({ hp: 80, mana: 20, mood: RPG_MOODS.neutral }),
        []
    );
    logValidation('SOUL_RESET', { valid: true }, 'createSoul');
}

export function checkWebGPU() {
    return !!navigator.gpu;
}

export async function initForbocAI(onProgress) {
    if (initializing || ready) return;
    initializing = true;
    error = null;

    try {
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported in this browser. Please use Chrome 113+ or Edge 113+.');
        }

        if (onProgress) onProgress('Downloading AI model (~100MB)...');

        engine = await CreateMLCEngine(MODEL_ID, {
            initProgressCallback: (report) => {
                if (onProgress) onProgress(report.text);
            }
        });

        if (onProgress) onProgress('Setting up action bridge...');
        bridge = createBridge({ strictMode: true });

        // SDK preset rules
        bridge.registerRule(resourceRule);
        bridge.registerRule(attackRule);

        // Custom game-specific rules
        bridge.registerRule(NAVIGATION_RULE);
        bridge.registerRule(COMBAT_DEFEND_RULE);
        bridge.registerRule(COMBAT_HEAL_RULE);
        bridge.registerRule(COMBAT_FLEE_RULE);
        bridge.registerRule(COMBAT_SUPER_RULE);

        if (onProgress) onProgress('Initializing NPC Soul...');
        initSoul();

        ready = true;
        if (onProgress) onProgress('Ready!');
    } catch (err) {
        error = err.message;
        throw err;
    } finally {
        initializing = false;
    }
}

function parseNavigationAction(text) {
    const match = text.match(/\[NAVIGATE:(\w+)\]/);
    if (match) {
        return { type: 'NAVIGATE', target: match[1].toLowerCase() };
    }
    return null;
}

function cleanResponse(text) {
    return text.replace(/\[NAVIGATE:\w+\]/g, '').trim();
}

export async function chat(message) {
    if (!ready || !engine) {
        throw new Error('ForbocAI is not initialized yet');
    }

    memoryStore.store(`Visitor: ${message}`, 'observation', 0.7);

    const recentMemories = memoryStore.recall(message, 3);
    const memoryContext = recentMemories.length > 0
        ? `\nRecent conversation context: ${recentMemories.map(m => m.text).join('; ')}`
        : '';

    conversationHistory.push({ role: 'user', content: message });

    if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
    }

    const messages = [
        { role: 'system', content: PERSONA + memoryContext },
        ...conversationHistory
    ];

    const reply = await engine.chat.completions.create({
        messages,
        max_tokens: 150,
        temperature: 0.7,
    });

    const rawText = reply.choices[0]?.message?.content || "I'm not sure how to respond to that.";

    const action = parseNavigationAction(rawText);
    const dialogue = cleanResponse(rawText);

    // Validate chat response with SDK's standalone validateAction + speakRule
    const speakValidation = validateAction(
        { type: 'SPEAK', payload: { text: dialogue } },
        [speakRule],
        { constraints: { maxSpeechLength: 500 } }
    );
    logValidation('SPEAK', speakValidation, 'speakRule (preset)');

    memoryStore.store(`Guide: ${dialogue}`, 'observation', 0.6);
    conversationHistory.push({ role: 'assistant', content: rawText });

    // Validate navigation action through Bridge
    let validatedAction = null;
    if (action) {
        const result = await bridge.validate(action, {
            agentState: { mood: 'friendly' },
            worldState: { currentRoom: 'about' }
        });
        logValidation('NAVIGATE', result, 'navigationRule');
        if (result.valid) {
            validatedAction = action;
        }
    }

    return {
        dialogue,
        action: validatedAction,
        thought: null
    };
}

export function isReady() {
    return ready;
}

export function isInitializing() {
    return initializing;
}

export function getError() {
    return error;
}

export async function validateCombatAction(action, actorState) {
    if (!bridge) return { valid: true };
    const result = await bridge.validate(
        { type: action, target: 'combat' },
        { agentState: actorState }
    );
    logValidation(action, result, 'Bridge');
    return result;
}

export async function npcCombatAction(combatState) {
    if (!engine) {
        // Use SDK's rpgFallbackStrategy
        const fallback = rpgFallbackStrategy(
            { hp: combatState.npc.hp, mana: combatState.npc.mana },
            { round: combatState.round }
        );
        logValidation('NPC_FALLBACK', { valid: true, reason: fallback.directive }, 'rpgFallbackStrategy');
        if (fallback.instruction === 'FLEE') return { action: 'FLEE', usedFallback: true, fallbackReason: fallback.directive };
        const actions = ['ATTACK', 'ATTACK', 'DEFEND'];
        if (combatState.npc.mana >= 10 && combatState.npc.hp < 40) actions.push('HEAL');
        return { action: actions[Math.floor(Math.random() * actions.length)], usedFallback: true, fallbackReason: fallback.directive };
    }

    const combatMemories = memoryStore.items
        .filter(m => m.type === 'combat')
        .slice(-3)
        .map(m => m.text)
        .join('; ');

    const superReady = (combatState.npcSuperCooldown ?? 0) === 0;
    const prompt = `You are an NPC fighter in a turn-based game. Choose ONE action.

Your HP: ${combatState.npc.hp}/${combatState.npcMaxHP}
Your MP: ${combatState.npc.mana}/${combatState.npcMaxMana}
Enemy HP: ${combatState.player.hp}/${combatState.playerMaxHP}
Round: ${combatState.round}
${combatMemories ? `Past actions: ${combatMemories}` : ''}

Actions:
- ATTACK: 10-20 dmg, 30% miss chance
- SUPER_ATTACK: 20-30 dmg, 20% miss chance, 3-turn cooldown (${superReady ? 'READY' : 'ON COOLDOWN'})
- DEFEND: reduce next hit by 50%
- HEAL: restore 15 HP, costs 10 mana
- FLEE: escape combat, 10% chance of failing

Respond with ONLY one word: ATTACK, SUPER_ATTACK, DEFEND, HEAL, or FLEE.`;

    try {
        const reply = await engine.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 10,
            temperature: 0.8,
        });

        const raw = (reply.choices[0]?.message?.content || '').toUpperCase().trim();
        const validActions = ['SUPER_ATTACK', 'ATTACK', 'DEFEND', 'HEAL', 'FLEE'];
        const chosen = validActions.find(a => raw.includes(a));

        if (chosen) {
            const result = await validateCombatAction(chosen, {
                hp: combatState.npc.hp,
                mana: combatState.npc.mana
            });
            if (result.valid) {
                memoryStore.store(`NPC chose ${chosen} (Round ${combatState.round})`, 'combat', 0.8);
                return { action: chosen, usedFallback: false };
            }
            memoryStore.store(`NPC tried ${chosen} but was invalid, attacking instead`, 'combat', 0.7);
            return { action: 'ATTACK', usedFallback: false };
        }
    } catch (err) {
        console.warn('NPC AI decision failed, using rpgFallbackStrategy:', err);
    }

    // Fallback using SDK's rpgFallbackStrategy
    const fallback = rpgFallbackStrategy(
        { hp: combatState.npc.hp, mana: combatState.npc.mana },
        { round: combatState.round }
    );
    logValidation('NPC_FALLBACK', { valid: true, reason: fallback.directive }, 'rpgFallbackStrategy');
    if (fallback.instruction === 'FLEE') return { action: 'FLEE', usedFallback: true, fallbackReason: fallback.directive };
    return { action: 'ATTACK', usedFallback: true, fallbackReason: fallback.directive };
}
