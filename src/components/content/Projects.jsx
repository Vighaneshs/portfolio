import React from 'react'

const Projects = () => {
  return (
    <div>
      <p className=' font-bold text-2xl border-2 border-orange-800 pl-4 align-middle'>PROJECTS </p>
        <div className='text-l text-left px-2 pt-4 space-y-2'>
          <li>
            <a className="after:content-['_↗']" href="https://github.com/Vighaneshs/portfolio" target="_blank">
              <span className='text-xl font-semibold'>This Portfolio Website,</span><span className='text-l pl-4'>Source Code</span>
            </a>
            <p>
            This website is built using React and Tailwind for the web app part and Phaser 3 for the game development. I made the graphics using Tiled and Gimp. 
            </p>
          </li>
          <li>
            <a className="after:content-['_↗']" href="https://github.com/Vighaneshs/VCS-BTP" target="_blank">
              <span className='text-xl font-semibold'>Visual Cryptography,</span><span className='text-l pl-4'>Source Code</span>
            </a>
            <p>
            Researched and Implemented different Visual Secret Sharing Schemes and compiled
            all the results to synthesize Coloured Visual Secret Sharing Scheme for General Access Structures in Python. 
            </p>
          </li>
          <li>
            <span className='text-xl font-semibold'>Prediction of Fetal Acidosis using CTG data</span>
            <p>
            Created and trained a CNN model using PyTorch, which predicts Fetal Acidosis using Cardiotocography (CTG) data.
            </p>
          </li>
          <li>
            <a className="after:content-['_↗']" href="https://github.com/Vighaneshs/VCS-BTP" target="_blank">
              <span className='text-xl font-semibold'>Visual Cryptography,</span><span className='text-l pl-4'>Source Code</span>
            </a>
            <p>
            Researched and Implemented different Visual Secret Sharing Schemes and compiled
            all the results to synthesize Coloured Visual Secret Sharing Scheme for General Access Structures in Python. 
            </p>
          </li>
          <li>
            <a className="after:content-['_↗']" href="https://github.com/Vighaneshs/penfightlatest" target="_blank">
              <span className='text-xl font-semibold'>A 3D Multiplayer Game</span><span className='text-l pl-4'>Source Code</span>
            </a>
          </li>
          <li>
            <a className="after:content-['_↗']" href="https://github.com/Vighaneshs/BasketBallGame" target="_blank">
              <span className='text-xl font-semibold'>A Hoops Game which uses Newtonian physics and Raytracing for collision detection</span><span className='text-l pl-4'>Source Code</span>
            </a>
          </li>
          <li>
            <span className='text-xl font-semibold'>Spam SMS Filter in C Language</span>
          </li>
          <li>
            <span className='text-xl font-semibold'>Developed a game on an FPGA using Verilog</span>
          </li>
        </div>    
    </div>
  )
}

export default Projects