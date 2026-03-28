import React, { useState, useEffect } from 'react';

const SDK_FEATURES = [
    { name: 'Bridge', desc: 'Validates combat actions and navigation through registered rules', module: 'createBridge' },
    { name: 'Soul', desc: 'NPC identity persists across sessions via localStorage', module: 'createSoul / serializeSoul' },
    { name: 'Presets', desc: 'Built-in attackRule, resourceRule, speakRule from SDK', module: 'presets.rpgRules' },
    { name: 'State Mgmt', desc: 'Immutable state updates for combat HP/mana/mood', module: 'createRPGState / updateAgentState' },
    { name: 'Validation', desc: 'Chat responses validated with standalone validateAction', module: 'validateAction + speakRule' },
    { name: 'Fallback', desc: 'NPC uses rpgFallbackStrategy when AI inference fails', module: 'rpgFallbackStrategy' },
];

const SDKShowcase = () => {
    const [expanded, setExpanded] = useState(false);
    const [soul, setSoul] = useState(null);
    const [validationLog, setValidationLog] = useState([]);

    const refresh = async () => {
        try {
            const sdk = await import('../../game/forbocAI');
            setSoul(sdk.getNpcSoul());
            setValidationLog(sdk.getValidationLog());
        } catch {}
    };

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleResetSoul = async () => {
        try {
            const sdk = await import('../../game/forbocAI');
            sdk.resetNpcSoul();
            refresh();
        } catch {}
    };

    return (
        <div className="border-2 border-orange-800 rounded-md mb-4 overflow-hidden">
            <div
                className="bg-orange-800 text-yellow-100 px-3 py-1.5 cursor-pointer flex justify-between items-center"
                onClick={() => setExpanded(!expanded)}
            >
                <span className="font-bold text-sm">ForbocAI SDK Features</span>
                <span className="text-xs">{expanded ? '▲' : '▼'}</span>
            </div>

            {expanded && (
                <div className="bg-orange-50 p-3 space-y-3 text-xs">
                    {/* Active Features */}
                    <div>
                        <p className="font-bold text-orange-900 mb-1">Active SDK Modules</p>
                        <div className="space-y-1">
                            {SDK_FEATURES.map((f) => (
                                <div key={f.name} className="flex items-start gap-1.5">
                                    <span className="text-green-500 mt-0.5">●</span>
                                    <div>
                                        <span className="font-bold text-orange-900">{f.name}</span>
                                        <span className="text-orange-700 ml-1">— {f.desc}</span>
                                        <span className="text-purple-600 ml-1 font-mono text-[10px]">({f.module})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NPC Soul Card */}
                    {soul && (
                        <div className="border border-orange-300 rounded p-2 bg-yellow-100">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-bold text-orange-900">NPC Soul</p>
                                <button
                                    onClick={handleResetSoul}
                                    className="text-[10px] bg-red-700 text-yellow-100 px-2 py-0.5 rounded"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-orange-800">
                                <span>Name: <b>{soul.name}</b></span>
                                <span>ID: <span className="font-mono">{soul.id}</span></span>
                                <span>Mood: <b>{soul.state?.mood || 'neutral'}</b></span>
                                <span>Version: {soul.version}</span>
                                <span>Wins: <b>{soul.state?.wins || 0}</b></span>
                                <span>Losses: <b>{soul.state?.losses || 0}</b></span>
                                <span>Memories: <b>{soul.memories?.length || 0}</b></span>
                                <span>Persisted: <b>{localStorage.getItem('npc-soul') ? 'Yes' : 'No'}</b></span>
                            </div>
                        </div>
                    )}

                    {/* Validation Log */}
                    <div>
                        <p className="font-bold text-orange-900 mb-1">Live Validation Log</p>
                        {validationLog.length === 0 ? (
                            <p className="text-orange-600 italic">No validations yet — interact with combat or chat</p>
                        ) : (
                            <div className="space-y-0.5 max-h-24 overflow-y-auto">
                                {validationLog.slice(-5).reverse().map((entry, i) => (
                                    <div key={i} className="flex gap-1 items-baseline">
                                        <span className={entry.result.valid ? 'text-green-600' : 'text-red-600'}>
                                            {entry.result.valid ? '✓' : '✗'}
                                        </span>
                                        <span className="font-mono font-bold text-orange-900">{entry.action}</span>
                                        <span className="text-purple-600">via {entry.rule}</span>
                                        {entry.result.reason && (
                                            <span className="text-orange-600">— {entry.result.reason}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SDKShowcase;
