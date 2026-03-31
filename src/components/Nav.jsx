import React, { useState } from 'react';
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
        {/* Nav bar row — overflow-hidden only here to contain aurora blobs */}
        <div className='relative overflow-hidden md:flex items-center justify-between py-4 md:px-10 px-7 bg-yellow-100'>
            <div className="absolute pointer-events-none rounded-full" style={{ left: '-5%', top: '-120%', width: 260, height: 260, background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)', filter: 'blur(40px)', willChange: 'transform', animation: 'blob-nav-1 25s ease-in-out 0s infinite alternate' }} />
            <div className="absolute pointer-events-none rounded-full" style={{ left: '40%', top: '-150%', width: 220, height: 220, background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)', filter: 'blur(40px)', willChange: 'transform', animation: 'blob-nav-2 20s ease-in-out 4s infinite alternate' }} />
            <div className="absolute pointer-events-none rounded-full" style={{ right: '-2%', top: '-100%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)', filter: 'blur(40px)', willChange: 'transform', animation: 'blob-nav-3 22s ease-in-out 8s infinite alternate' }} />
            <div className='font-mono font-bold text-2xl cursor-pointer text-orange-800 flex items-center text-justify '>
            Vighanesh Sharma
            </div>
            {/* Desktop nav links */}
            <ul className='hidden md:flex md:items-center md:pl-0'>
              {Links.map((Link)=>(
                <li key={Link.name} className='ml-8 font-mono text-xl text-orange-800'>
                  <a onClick={()=>setShow(Link.showKey)} className='cursor-pointer text-orange-800 hover:text-orange-950 duration-200 group relative flex items-center'>
                    <span className="opacity-0 group-hover:opacity-100 group-hover:animate-bounce-x absolute -left-5 text-orange-950">▶</span>
                    {Link.name}
                  </a>
                </li>
              ))}
            </ul>
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
        </div>
        {/* Mobile dropdown — outside overflow-hidden so it isn't clipped */}
        <ul className={`${open ? 'block' : 'hidden'} md:hidden bg-yellow-100 pb-4 pl-9 border-t-2 border-orange-200`}>
          {Links.map((Link)=>(
            <li key={Link.name} className='font-mono text-xl text-orange-800 my-4'>
              <a onClick={()=>{setShow(Link.showKey); setOpen(false);}} className='cursor-pointer text-orange-800 hover:text-orange-950 duration-200 group relative flex items-center'>
                <span className="opacity-0 group-hover:opacity-100 group-hover:animate-bounce-x absolute -left-5 text-orange-950">▶</span>
                {Link.name}
              </a>
            </li>
          ))}
          <li className='font-mono text-xl text-orange-800 my-4'>
            <button onClick={toggleMusic} className='cursor-pointer text-orange-800 hover:text-orange-950 duration-200 bg-transparent border-none flex items-center gap-1'>
              {musicOn ? '🔊 MUSIC OFF' : '🔇 MUSIC ON'}
            </button>
          </li>
        </ul>
    </div>
  )

}

export default Nav