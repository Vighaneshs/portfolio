import React, { useState } from 'react';
import Work from './content/Work';
import Projects from './content/Projects';
import Education from './content/Education';
import About from './content/About';
import Contact from './content/Contact';
import closeLogo from './icons/closeIcon.png';

const ContentBox = ({show, setShow, open, setOpen}) => {

  const contentMap = new Map([
                                ["work", <Work />],
                                ["projects", <Projects />],
                                ["contact", <Contact />],
                                ["education", <Education/>],
                                ["about", <About />]
                             ]);
  return (
    <>
    
      <div onClick={()=> setOpen()} className="h-auto absolute right-8 top-5 cursor-pointer md:hidden">
        <img src={closeLogo} />
      </div>
      <div className='font-mono text-orange-900'>
        {contentMap.get(show)}
      </div>
    
    </>
  )
}

export default ContentBox