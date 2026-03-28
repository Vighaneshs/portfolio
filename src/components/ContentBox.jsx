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
    
      <div onClick={()=> setOpen()} className="h-auto absolute right-8 top-5 cursor-pointer md:hidden">
        <img src={closeLogo} />
      </div>
      <div className='relative min-h-[500px]'>
        <div className='font-mono text-orange-900'>
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