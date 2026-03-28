import React, { useState, useEffect, useRef } from 'react';
import { initCombat, getCombatState, resolveAction, advanceTurn, endCombat } from '../../game/combat';
import { EventBus } from '../../game/EventBus';

const MOOD_COLORS = {
    hostile: 'text-red-600',
    suspicious: 'text-yellow-700',
    neutral: 'text-gray-500',
    friendly: 'text-green-600',
    loyal: 'text-blue-600',
};

const CombatUI = ({ onCombatEnd, aiReady, aiDownloading, aiProgress, onDownloadAI }) => {
    const [state, setState] = useState(null);
    const [npcThinking, setNpcThinking] = useState(false);
    const logContainerRef = useRef(null);

    useEffect(() => {
        setState(initCombat());
    }, []);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [state?.log]);

    useEffect(() => {
        if (!state || state.status !== 'active' || state.turn !== 'npc') return;

        setNpcThinking(true);
        const doNpcTurn = async () => {
            try {
                const sdk = await import('../../game/forbocAI');
                const result = await sdk.npcCombatAction(state);
                const action = typeof result === 'object' ? result.action : result;
                const usedFallback = typeof result === 'object' ? result.usedFallback : false;
                const fallbackReason = typeof result === 'object' ? result.fallbackReason : null;

                const afterNpc = resolveAction('npc', action);

                if (usedFallback && fallbackReason) {
                    afterNpc.log = [...(afterNpc.log || []).slice(-3), `[SDK Fallback] ${fallbackReason}`];
                }

                setState({ ...afterNpc });

                if (afterNpc.status === 'active') {
                    advanceTurn();
                    setState({ ...getCombatState() });
                }
            } catch {
                const afterNpc = resolveAction('npc', 'ATTACK');
                setState({ ...afterNpc });
                if (afterNpc.status === 'active') {
                    advanceTurn();
                    setState({ ...getCombatState() });
                }
            } finally {
                setNpcThinking(false);
            }
        };

        const timer = setTimeout(doNpcTurn, 800);
        return () => clearTimeout(timer);
    }, [state?.turn, state?.round]);

    const handlePlayerAction = async (action) => {
        if (!state || state.turn !== 'player' || state.status !== 'active') return;

        try {
            const sdk = await import('../../game/forbocAI');
            const result = await sdk.validateCombatAction(action, {
                hp: state.player.hp,
                mana: state.player.mana
            });
            if (!result.valid) {
                setState(prev => ({
                    ...prev,
                    log: [...prev.log.slice(-4), `[Bridge] ${action} blocked: ${result.reason}`]
                }));
                return;
            }
        } catch {}

        const afterPlayer = resolveAction('player', action);
        setState({ ...afterPlayer });

        if (afterPlayer.status === 'active') {
            advanceTurn();
            setState({ ...getCombatState() });
        }
    };

    const handleEndCombat = async () => {
        // Persist NPC Soul
        try {
            const sdk = await import('../../game/forbocAI');
            const memories = state.log.slice(-5).map(l => ({ text: l, timestamp: Date.now() }));
            sdk.persistNpcSoul(state.status, memories);
        } catch {}

        endCombat();
        EventBus.emit('combat-ended');
        if (onCombatEnd) onCombatEnd();
    };

    if (!state) return null;

    const isOver = state.status !== 'active';
    const playerTurn = state.turn === 'player' && !isOver;
    const npcMood = state.npc?.mood || 'neutral';

    return (
        <div className="border-2 border-red-800 rounded-md mb-4 overflow-hidden">
            <div className="bg-red-800 text-yellow-100 px-3 py-1.5">
                <span className="font-bold text-sm">
                    Combat — Round {state.round}
                    {npcThinking && <span className="ml-2 text-xs font-normal animate-pulse">NPC thinking...</span>}
                </span>
            </div>

            {!aiReady && (
                <div className="bg-yellow-50 border-b border-orange-300 px-3 py-2 text-xs">
                    <p className="text-orange-800 font-bold mb-1">⚠ You are fighting a basic rule-based AI.</p>
                    {aiDownloading ? (
                        <p className="text-orange-600 animate-pulse">{aiProgress || 'Downloading...'}</p>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-orange-700">Download the LLM to fight an intelligent NPC.</span>
                            <button
                                onClick={onDownloadAI}
                                className="shrink-0 bg-orange-800 text-yellow-100 px-2 py-0.5 rounded hover:bg-orange-700"
                            >
                                Download AI (~100MB)
                            </button>
                        </div>
                    )}
                </div>
            )}

            {aiReady && (
                <div className="bg-green-50 border-b border-green-300 px-3 py-1.5 text-xs text-green-800 font-bold">
                    ✓ Fighting LLM-powered AI
                </div>
            )}

            <div className="bg-orange-50 p-3 space-y-3">
                {/* HP/Mana Bars */}
                <div className="space-y-2">
                    <div>
                        <div className="flex justify-between text-xs font-bold text-orange-900">
                            <span>You</span>
                            <span>HP {state.player.hp}/{state.playerMaxHP} | Mana {state.player.mana}/{state.playerMaxMana}</span>
                        </div>
                        <div className="flex gap-1 mt-0.5">
                            <div className="flex-1 h-3 bg-gray-300 rounded overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(state.player.hp / state.playerMaxHP) * 100}%` }}></div>
                            </div>
                            <div className="w-12 h-3 bg-gray-300 rounded overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(state.player.mana / state.playerMaxMana) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-bold text-red-800">
                            <span>NPC <span className={`font-normal ${MOOD_COLORS[npcMood] || 'text-gray-500'}`}>({npcMood})</span></span>
                            <span>HP {state.npc.hp}/{state.npcMaxHP} | Mana {state.npc.mana}/{state.npcMaxMana}</span>
                        </div>
                        <div className="flex gap-1 mt-0.5">
                            <div className="flex-1 h-3 bg-gray-300 rounded overflow-hidden">
                                <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${(state.npc.hp / state.npcMaxHP) * 100}%` }}></div>
                            </div>
                            <div className="w-12 h-3 bg-gray-300 rounded overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(state.npc.mana / state.npcMaxMana) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Combat Log */}
                <div ref={logContainerRef} className="max-h-24 overflow-y-auto bg-yellow-100 border border-orange-300 rounded p-2">
                    {state.log.map((entry, i) => (
                        <p key={i} className={`text-xs ${entry.startsWith('[Bridge]') || entry.startsWith('[SDK') ? 'text-purple-700 font-bold' : 'text-orange-900'}`}>{entry}</p>
                    ))}
                </div>

                {/* Action Buttons or End State */}
                {isOver ? (
                    <div className="text-center space-y-2">
                        <p className="font-bold text-lg text-orange-900">
                            {state.status === 'victory' && 'Victory!'}
                            {state.status === 'defeat' && 'Defeated!'}
                            {state.status === 'fled' && 'Escaped!'}
                        </p>
                        <p className="text-xs text-purple-700">Soul will be updated on continue</p>
                        <button onClick={handleEndCombat} className="text-sm bg-orange-800 text-yellow-100 px-4 py-1.5 rounded">
                            Continue
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-1">
                        <button
                            onClick={() => handlePlayerAction('ATTACK')}
                            disabled={!playerTurn}
                            className="text-xs font-bold bg-red-700 text-yellow-100 py-1.5 rounded disabled:opacity-40"
                        >
                            Attack
                        </button>
                        <button
                            onClick={() => handlePlayerAction('SUPER_ATTACK')}
                            disabled={!playerTurn || state.playerSuperCooldown > 0}
                            className="text-xs font-bold bg-orange-500 text-yellow-100 py-1.5 rounded disabled:opacity-40"
                        >
                            {state.playerSuperCooldown > 0 ? `Super (${state.playerSuperCooldown})` : 'Super Attack'}
                        </button>
                        <button
                            onClick={() => handlePlayerAction('DEFEND')}
                            disabled={!playerTurn}
                            className="text-xs font-bold bg-blue-700 text-yellow-100 py-1.5 rounded disabled:opacity-40"
                        >
                            Defend
                        </button>
                        <button
                            onClick={() => handlePlayerAction('HEAL')}
                            disabled={!playerTurn}
                            className="text-xs font-bold bg-green-700 text-yellow-100 py-1.5 rounded disabled:opacity-40"
                        >
                            Heal
                        </button>
                        <button
                            onClick={() => handlePlayerAction('FLEE')}
                            disabled={!playerTurn}
                            className="col-span-2 text-xs font-bold bg-gray-700 text-yellow-100 py-1.5 rounded disabled:opacity-40"
                        >
                            Flee
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CombatUI;
