import React, { useState, useEffect } from 'react'
import AIChat from './AIChat'
import CombatUI from './CombatUI'

const Ai = ({ setShow, inCombat, setInCombat }) => {
  const [aiReady, setAiReady] = useState(false);
  const [aiDownloading, setAiDownloading] = useState(false);
  const [aiProgress, setAiProgress] = useState('');

  useEffect(() => {
    import('../../game/forbocAI').then((sdk) => {
      if (sdk.isReady()) setAiReady(true);
    });
  }, []);

  const handleDownloadAI = async () => {
    if (aiDownloading || aiReady) return;
    setAiDownloading(true);
    setAiProgress('');
    try {
      const sdk = await import('../../game/forbocAI');
      await sdk.initForbocAI((progress) => setAiProgress(progress));
      setAiReady(true);
    } catch (err) {
      setAiProgress('Failed: ' + (err?.message || 'unknown error'));
    } finally {
      setAiDownloading(false);
    }
  };

  return (
    <div>
      <p className=' font-bold text-2xl border-2 border-orange-800 pl-4 align-middle'>AI </p>
        <div className='text-l text-left px-2 pt-4 space-y-2'>
          {inCombat && (
            <CombatUI
              onCombatEnd={() => setInCombat(false)}
              aiReady={aiReady}
              aiDownloading={aiDownloading}
              aiProgress={aiProgress}
              onDownloadAI={handleDownloadAI}
            />
          )}
          <AIChat
            setShow={setShow}
            aiReady={aiReady}
            aiDownloading={aiDownloading}
            aiProgress={aiProgress}
            onDownloadAI={handleDownloadAI}
          />
        </div>
    </div>
  )
}

export default Ai
