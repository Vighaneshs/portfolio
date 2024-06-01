import React from 'react'

const About = () => {
  return (
    <div>
      <p className=' font-bold text-2xl border-2 border-orange-800 pl-4 align-middle'>ABOUT </p>
        <div className='text-l text-left px-2 pt-4 space-y-2'>
          <p  className='text-xl font-bold underline underline-offset-2'>Welcome to my portfolio!</p>
          <li>Each room in this house reflects a part of my personal story.</li>
          <li>Explore the rooms through the character to discover more about me.</li>
          <li>Looking back on my programming journey from around ten years ago, I made the decision to craft my portfolio as a game, symbolizing my initial steps into the world of programming.
          </li>
            
          <p className='text-lg font-bold underline underline-offset-2'>Controls</p>
          <li>Touch/Click on the floor to move the character.</li>
          <li>You can also use Arrow Keys.</li>
          <p className='text-xl font-bold pt-5'>Feedback is appreciated!</p>
        </div>    
    </div>
  )
}

export default About