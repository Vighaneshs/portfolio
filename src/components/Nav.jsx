import React, { useState } from 'react';
import { motion } from 'framer-motion';
import menuLogo from './icons/menuIcon.png';
import closeLogo from './icons/closeIcon.png';

const Nav = ({show, setShow, musicOn, toggleMusic}) => {
  let Links = [
    {name:"ABOUT", showKey:"about"},
    {name:"WORK-EX", showKey:"work"},
    {name:"PROJECTS", showKey:"projects"},
    {name:"EDUCATION", showKey:"education"},
    {name:"CONTACT", showKey:"contact"},
    {name:"AI", showKey:"AI"},
  ];
  let [open, setOpen]= useState(false);

  return (
    <div className='border-b-4 border-orange-950 w-full fixed top-0 left-0 z-50'>
        <div className='relative overflow-hidden md:flex items-center justify-between py-4 md:px-10 px-7 bg-yellow-100'>
            <motion.div className="absolute pointer-events-none rounded-full" style={{ left: '-5%', top: '-120%', width: 260, height: 260, background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} animate={{ x: [0, 40, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }} />
            <motion.div className="absolute pointer-events-none rounded-full" style={{ left: '40%', top: '-150%', width: 220, height: 220, background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} animate={{ x: [0, -30, 20, 0], scale: [1, 1.08, 1] }} transition={{ duration: 20, delay: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }} />
            <motion.div className="absolute pointer-events-none rounded-full" style={{ right: '-2%', top: '-100%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} animate={{ x: [0, -25, 0], scale: [1, 1.12, 1] }} transition={{ duration: 22, delay: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }} />
            <div className='font-mono font-bold text-2xl cursor-pointer text-orange-800 flex items-center text-justify '>
            Vighanesh Sharma
            </div>
            <button
              onClick={toggleMusic}
              title={musicOn ? 'Turn music off' : 'Turn music on'}
              className="hidden md:flex items-center gap-1 font-mono text-sm text-orange-800 hover:text-orange-950 border-2 border-orange-800 hover:border-orange-950 px-2 py-1 cursor-pointer bg-transparent duration-200"
            >
              {musicOn ? '🔊' : '🔇'} <span>{musicOn ? 'MUSIC OFF' : 'MUSIC ON'}</span>
            </button>
            <div onClick={()=> setOpen(!open)} className="h-auto absolute right-8 top-5 cursor-pointer md:hidden">
              <img src={open ? closeLogo:menuLogo} />
            </div>
        <ul className={`md:flex md:items-center md:pb-0 pb-4 absolute md:static bg-yellow-100 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-250 ease-in  ${open ? 'top-16': 'top-[-290px]'} `}>
          {
            Links.map((Link)=>(
              <li key={Link.name} className='ml-8 font-mono text-xl text-orange-800 my-4 md:my-0'>
                <a onClick={()=>{setShow(Link.showKey); setOpen(!open);}} className='cursor-pointer text-orange-800 hover:text-orange-950 duration-200 group relative flex items-center'>
                  <span className="opacity-0 group-hover:opacity-100 group-hover:animate-bounce-x absolute -left-5 text-orange-950">▶</span>
                  {Link.name}
                </a>
              </li>
            ))
          }
          <li className='ml-8 font-mono text-xl text-orange-800 my-4 md:my-0 md:hidden'>
            <button onClick={toggleMusic} className='cursor-pointer text-orange-800 hover:text-orange-950 duration-200 bg-transparent border-none flex items-center gap-1'>
              {musicOn ? '🔊 MUSIC OFF' : '🔇 MUSIC ON'}
            </button>
          </li>
        </ul>
        </div>
    </div>
  )

}

export default Nav