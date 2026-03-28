import { updateNPCStateLocally } from 'forbocai';

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

let state = null;
const sdkFeatureLog = [];

function logSDKFeature(feature, detail) {
    sdkFeatureLog.push({ feature, detail, timestamp: Date.now() });
    if (sdkFeatureLog.length > 20) sdkFeatureLog.shift();
}

export function getSDKFeatureLog() {
    return [...sdkFeatureLog];
}

function createCombatState() {
    const player = createRPGState({ hp: 100, mana: 30, mood: RPG_MOODS.hostile });
    logSDKFeature('createRPGState', 'Created player state (hp:100, mana:30)');
    const npc = createRPGState({ hp: 100, mana: 30, mood: RPG_MOODS.neutral });
    logSDKFeature('createRPGState', 'Created NPC state (hp:100, mana:30)');
    return {
        player,
        playerMaxHP: 100,
        playerMaxMana: 30,
        npc,
        npcMaxHP: 100,
        npcMaxMana: 30,
        playerDefending: false,
        npcDefending: false,
        turn: 'player',
        round: 1,
        log: [],
        status: 'active',
    };
}

export function initCombat() {
    state = createCombatState();
    state.log = ['Combat started! Your turn.'];
    return { ...state };
}

export function getCombatState() {
    return state ? { ...state } : null;
}

export function isInCombat() {
    return state !== null && state.status === 'active';
}

function rollDamage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addLog(msg) {
    state.log = [...state.log.slice(-4), msg];
}

export function resolveAction(actor, action) {
    if (!state || state.status !== 'active') return { ...state };

    const isPlayer = actor === 'player';
    const actorKey = isPlayer ? 'player' : 'npc';
    const defenderKey = isPlayer ? 'npc' : 'player';
    const defenderDefKey = isPlayer ? 'npcDefending' : 'playerDefending';
    const actorDefKey = isPlayer ? 'playerDefending' : 'npcDefending';
    const actorMaxHP = isPlayer ? 'playerMaxHP' : 'npcMaxHP';
    const actorName = isPlayer ? 'You' : 'NPC';

    switch (action) {
        case 'ATTACK': {
            let dmg = rollDamage(10, 20);
            if (state[defenderDefKey]) {
                dmg = Math.floor(dmg * 0.5);
                state[defenderDefKey] = false;
            }
            const newHP = Math.max(0, state[defenderKey].hp - dmg);
            state[defenderKey] = updateNPCStateLocally(state[defenderKey], { hp: newHP });
            logSDKFeature('updateNPCStateLocally', `${defenderKey}.hp → ${newHP}`);

            if (newHP < 20 && newHP > 0) {
                state[defenderKey] = updateNPCStateLocally(state[defenderKey], { mood: RPG_MOODS.hostile });
                logSDKFeature('RPG_MOODS', `${defenderKey} mood → hostile (low HP)`);
            }
            addLog(`${actorName} attacked for ${dmg} damage!`);
            break;
        }
        case 'DEFEND': {
            state[actorDefKey] = true;
            state[actorKey] = updateNPCStateLocally(state[actorKey], { mood: RPG_MOODS.suspicious });
            logSDKFeature('updateNPCStateLocally', `${actorKey} defending, mood → suspicious`);
            addLog(`${actorName} is defending! (50% damage reduction)`);
            break;
        }
        case 'HEAL': {
            if (state[actorKey].mana < 10) {
                addLog(`${actorName} tried to heal but not enough mana!`);
                break;
            }
            const newMana = state[actorKey].mana - 10;
            const healAmt = 15;
            const newHP = Math.min(state[actorMaxHP], state[actorKey].hp + healAmt);
            state[actorKey] = updateNPCStateLocally(state[actorKey], { hp: newHP, mana: newMana });
            logSDKFeature('updateNPCStateLocally', `${actorKey}.hp → ${newHP}, mana → ${newMana}`);
            addLog(`${actorName} healed for ${healAmt} HP! (-10 mana)`);
            break;
        }
        case 'FLEE': {
            state.status = 'fled';
            addLog(`${actorName} fled from combat!`);
            return { ...state };
        }
    }

    if (state.npc.hp <= 0) {
        state.status = 'victory';
        state.npc = updateNPCStateLocally(state.npc, { mood: RPG_MOODS.friendly });
        logSDKFeature('RPG_MOODS', 'NPC mood → friendly (defeated)');
        addLog('You won the battle!');
    } else if (state.player.hp <= 0) {
        state.status = 'defeat';
        state.npc = updateNPCStateLocally(state.npc, { mood: RPG_MOODS.loyal });
        logSDKFeature('RPG_MOODS', 'NPC mood → loyal (victorious)');
        addLog('You were defeated!');
    }

    return { ...state };
}

export function advanceTurn() {
    if (!state || state.status !== 'active') return;
    if (state.turn === 'player') {
        state.turn = 'npc';
    } else {
        state.turn = 'player';
        state.round += 1;
    }
}

export function endCombat() {
    state = null;
}
