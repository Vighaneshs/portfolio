import React, { useState, useEffect, useRef } from 'react';

const ROOM_EVENT_MAP = {
    work: 'show-work-ex',
    projects: 'show-projects',
    education: 'show-education',
    contact: 'show-contacts',
    about: 'show-about'
};

const AIChat = ({ setShow }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Checking browser support...');
    const [collapsed, setCollapsed] = useState(false);
    const [hasWebGPU, setHasWebGPU] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const messagesEndRef = useRef(null);
    const sdkRef = useRef(null);

    useEffect(() => {
        const gpuAvailable = !!navigator.gpu;
        setHasWebGPU(gpuAvailable);

        if (!gpuAvailable) {
            setStatus('no-webgpu');
            return;
        }

        setStatus('Loading ForbocAI SDK...');

        import('../../game/forbocAI')
            .then(async (sdk) => {
                sdkRef.current = sdk;

                if (sdk.isReady()) {
                    setStatus('ready');
                    setMessages([{
                        role: 'npc',
                        text: "Hey! I'm an AI guide powered by ForbocAI, running locally in your browser. Ask me anything about this portfolio!"
                    }]);
                    return;
                }

                if (sdk.isInitializing()) {
                    setStatus('Initializing...');
                    return;
                }

                await sdk.initForbocAI((progress) => setStatus(progress));
                setStatus('ready');
                setMessages([{
                    role: 'npc',
                    text: "Hey! I'm an AI guide powered by ForbocAI, running locally in your browser. Ask me anything about this portfolio!"
                }]);
            })
            .catch((err) => {
                console.error('ForbocAI init error:', err);
                setErrorMsg(err?.message || String(err));
                setStatus('error');
            });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const sdk = sdkRef.current;
        const trimmed = input.trim();
        if (!trimmed || loading || !sdk?.isReady()) return;

        const userMsg = { role: 'user', text: trimmed };
        setMessages(prev => [...prev.slice(-18), userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await sdk.chat(trimmed);
            const npcMsg = {
                role: 'npc',
                text: response.dialogue,
                action: response.action
            };
            setMessages(prev => [...prev, npcMsg]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'npc',
                text: "Sorry, I had trouble processing that. Could you try again?"
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (room) => {
        if (setShow) {
            setShow(room === 'work' ? 'work' : room);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleRetry = () => {
        setStatus('Loading ForbocAI SDK...');
        setErrorMsg('');
        import('../../game/forbocAI')
            .then(async (sdk) => {
                sdkRef.current = sdk;
                await sdk.initForbocAI((progress) => setStatus(progress));
                setStatus('ready');
                setMessages([{
                    role: 'npc',
                    text: "Hey! I'm an AI guide powered by ForbocAI, running locally in your browser. Ask me anything about this portfolio!"
                }]);
            })
            .catch((err) => {
                console.error('ForbocAI retry error:', err);
                setErrorMsg(err?.message || String(err));
                setStatus('error');
            });
    };

    if (!hasWebGPU) {
        return (
            <div className="border-2 border-orange-800 rounded-md p-3 mb-4 bg-orange-50">
                <p className="font-bold text-sm">AI Guide (ForbocAI)</p>
                <p className="text-sm mt-1">
                    This demo requires WebGPU support (Chrome 113+ or Edge 113+).
                    The AI runs entirely in your browser using{' '}
                    <a href="https://github.com/ForbocAI/sdk" target="_blank" rel="noopener noreferrer" className="underline font-bold">
                        ForbocAI SDK
                    </a>.
                </p>
            </div>
        );
    }

    return (
        <div className="border-2 border-orange-800 rounded-md mb-4 overflow-hidden">
            <div
                className="flex items-center justify-between bg-orange-800 text-yellow-100 px-3 py-1.5 cursor-pointer"
                onClick={() => setCollapsed(!collapsed)}
            >
                <span className="font-bold text-sm">
                    AI Guide
                    {status === 'ready' && <span className="ml-2 inline-block w-2 h-2 bg-green-400 rounded-full"></span>}
                    {status !== 'ready' && status !== 'error' && <span className="ml-2 text-xs font-normal opacity-75">loading...</span>}
                </span>
                <span className="text-xs">{collapsed ? '+' : '-'}</span>
            </div>

            {!collapsed && (
                <div className="bg-orange-50 p-2">
                    {status !== 'ready' && status !== 'error' && (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin w-5 h-5 border-2 border-orange-800 border-t-transparent rounded-full mb-2"></div>
                            <p className="text-xs text-orange-700">{status}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center py-3">
                            <p className="text-sm text-red-700">{errorMsg}</p>
                            <button
                                onClick={handleRetry}
                                className="mt-2 text-xs bg-orange-800 text-yellow-100 px-3 py-1 rounded"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {status === 'ready' && (
                        <>
                            <div className="max-h-48 overflow-y-auto space-y-2 mb-2">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        <span className={`inline-block px-2 py-1 rounded-md max-w-[85%] ${
                                            msg.role === 'user'
                                                ? 'bg-orange-200 text-orange-900'
                                                : 'bg-yellow-200 text-orange-900'
                                        }`}>
                                            {msg.text}
                                        </span>
                                        {msg.action && msg.action.type === 'NAVIGATE' && (
                                            <div className="mt-1">
                                                <button
                                                    onClick={() => handleNavigate(msg.action.target)}
                                                    className="text-xs bg-orange-700 text-yellow-100 px-2 py-0.5 rounded hover:bg-orange-600"
                                                >
                                                    Go to {msg.action.target.charAt(0).toUpperCase() + msg.action.target.slice(1)} room
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="text-left text-sm">
                                        <span className="inline-block px-2 py-1 rounded-md bg-yellow-200 text-orange-900 animate-pulse">
                                            thinking...
                                        </span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => { e.stopPropagation(); handleKeyDown(e); }}
                                    onKeyUp={(e) => e.stopPropagation()}
                                    placeholder="Ask about the portfolio..."
                                    className="flex-1 text-sm px-2 py-1 border border-orange-300 rounded bg-white focus:outline-none focus:border-orange-600"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading || !input.trim()}
                                    className="text-sm bg-orange-800 text-yellow-100 px-3 py-1 rounded disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    )}

                    <div className="mt-2 text-center">
                        <a
                            href="https://github.com/ForbocAI/sdk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-orange-500 hover:text-orange-700"
                        >
                            Powered by ForbocAI SDK
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChat;
