import React, { useState } from 'react';
import menuLogo from './icons/menuIcon.png';
import closeLogo from './icons/closeIcon.png';

const Nav = ({show, setShow}) => {
  let Links = [
    {name:"ABOUT", showKey:"about"},
    {name:"WORK-EX", showKey:"work"},
    {name:"PROJECTS", showKey:"projects"},
    {name:"EDUCATION", showKey:"education"},
    {name:"CONTACT", showKey:"contact"},
  ];
  let [open, setOpen]= useState(false);

  return (
    <div className='shadow-md w-full fixed top-0 left-0 z-50'>
        <div className='md:flex items-center justify-between py-4 md:px-10 px-7  bg-yellow-100'>
            <div className='font-mono font-bold text-2xl cursor-pointer text-orange-800 flex items-center text-justify '>
            Vighanesh Sharma
            </div>
            <div onClick={()=> setOpen(!open)} className="h-auto absolute right-8 top-5 cursor-pointer md:hidden">
              <img src={open ? closeLogo:menuLogo} />
            </div>
        <ul className={`md:flex md:items-center md:pb-0 pb-4 absolute md:static bg-yellow-100 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-250 ease-in  ${open ? 'top-16': 'top-[-290px]'} `}>
          {
            Links.map((Link)=>(
              <li key={Link.name} className='ml-8 font-mono text-xl text-orange-800'>
                <a onClick={()=>{setShow(Link.showKey); setOpen(!open);}} className='cursor-pointer text-orange-800 hover:text-orange-400 duration-500'>{Link.name}</a>  
              </li>
            ))
          }
        </ul>
        </div>
    </div>
  )

}

export default Nav