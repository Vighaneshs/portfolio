import React, { useState } from 'react';
import Work from './content/Work';
import Projects from './content/Projects';
import Education from './content/Education';
import About from './content/About';
import Contact from './content/Contact';
import closeLogo from './icons/closeIcon.png';
import AIChat from './content/AIChat';
import Ai from './content/AIFeats'

const ContentBox = ({show, setShow, open, setOpen, inCombat, setInCombat}) => {

  const contentMap = new Map([
                                ["work", <Work />],
                                ["projects", <Projects />],
                                ["contact", <Contact />],
                                ["education", <Education/>],
                                ["about", <About />],
                                ["AI", <Ai setShow={setShow} inCombat={inCombat} setInCombat={setInCombat} />]
                             ]);
  return (
    <>
    
      <div onClick={()=> setOpen()} className="h-auto absolute right-8 top-5 cursor-pointer md:hidden z-20">
        <img src={closeLogo} />
      </div>
      <div className='relative min-h-[500px] overflow-hidden'>
        {/* Subtle aurora blobs — low opacity so text stays readable */}
        <div className="absolute pointer-events-none rounded-full" style={{ left: '-8%', top: '-5%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(234,88,12,0.13) 0%, transparent 70%)', filter: 'blur(60px)', willChange: 'transform', animation: 'blob-cb-1 28s ease-in-out 0s infinite alternate' }} />
        <div className="absolute pointer-events-none rounded-full" style={{ right: '-5%', top: '20%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 70%)', filter: 'blur(60px)', willChange: 'transform', animation: 'blob-cb-2 24s ease-in-out 6s infinite alternate' }} />
        <div className="absolute pointer-events-none rounded-full" style={{ left: '25%', bottom: '-10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', filter: 'blur(70px)', willChange: 'transform', animation: 'blob-cb-3 32s ease-in-out 12s infinite alternate' }} />
        <div className='relative z-10 font-mono text-orange-900'>
          {contentMap.get(show)}
        </div>
      </div>
      <div className="absolute font-mono text-orange-900 bottom-6 right-8 animate-pulse text-xl">
        ▼
      </div>
    </>
  )
}

export default ContentBox