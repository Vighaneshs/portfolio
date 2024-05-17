import React from 'react'

const Work = () => {
  return (
    <div>
      <p className='font-bold text-2xl border-2 border-orange-800 pl-4 align-middle'> WORK EXPERIENCE </p>
      <ul className='indent-4 list-disc px-4 pt-4'> 
        <li>
          <p className='text-xl font-semibold border-2 border-orange-800'> Software Engineer, GE HealthCare</p>
          <ul className='indent-4 list-disc px-4 pt-4'>
            <li>
              <p className='grid grid-cols-2'> <div className='text-lg font-semibold underline underline-offset-4'>PaaS</div> <div className='italic'>July 2023 - July 2024</div></p>
              <p className='text-l font-normal text-left'>I am designing, building and enhancing components for Edison HealthLink compute platform. I
    am engineering micro-services for logging, monitoring and connectivity in a high-availability cluster.
              </p>
            </li>
            <li>
              <p className='grid grid-cols-2'> <div className='text-lg font-semibold underline underline-offset-4'>Cybersecurity (EEDP)</div> <div className='italic'>July 2021 - July 2023</div></p>
              <p className='text-l font-normal text-left'> Developed micro-services in Go and Angular to enable Secure Service Access for service users.
               I have filed a Patent, worked on the micro-services for
              RBAC (Role Based Access Control) Software.
              </p>
            </li>
          </ul>
        </li>
        <li className='pt-4'>
          <p className='text-xl font-semibold border-2 border-orange-800'> Software Intern, GE HealthCare</p>
          <ul className='indent-4 list-disc px-4 pt-4'>
            <li>
              <p className='grid grid-cols-2'> <div className='text-lg font-semibold underline underline-offset-4'>Imaging Visualisation</div> <div className='italic'>June 2022 - August 2022</div></p>
              <p className='text-l font-normal text-left'>Developed a Web Based CT Scan Viewer using VTK.js, Cornerstone.js and HTML.
              </p>
            </li>
          </ul>
        </li>
        
      </ul>

    </div>
  )
}

export default Work