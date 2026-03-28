import React from 'react'

const Education = () => {
  return (
    <div>
      <div className='inline-block bg-orange-200 border-2 border-orange-950 px-4 py-1 mb-2 font-bold text-2xl shadow-sm'>EDUCATION</div>
      <div className='text-l text-left px-2 pt-4 space-y-6 pb-8'> 
        
        <div>
          <p className='text-xl font-bold border-2 border-orange-950 bg-orange-100 pl-2 shadow-sm'>University of Texas at Dallas</p>
          <div className='pt-4 pl-2'>
              <p className='grid grid-cols-2'> <span className='text-lg font-bold underline underline-offset-4 decoration-orange-800/50'>M.S. in Computer Science</span> <span className='italic font-semibold text-right'>Aug 2024 - May 2026</span></p>
              <ul className='space-y-1 list-none pt-2'>
                <li><span className="text-orange-800 mr-2">▶</span><span className="font-semibold">Concentration:</span> Intelligent Systems</li>
                <li><span className="text-orange-800 mr-2">▶</span><span className="font-semibold">GPA:</span> 3.74</li>
                <li><span className="text-orange-800 mr-2">▶</span><span className="font-semibold">Location:</span> Dallas, TX</li>
              </ul>
          </div>
        </div>
        
        <div>
          <p className='text-xl font-bold border-2 border-orange-950 bg-orange-100 pl-2 shadow-sm'>Indian Institute of Technology (IIT), Ropar</p>
          <div className='pt-4 pl-2'>
              <p className='grid grid-cols-2'> <span className='text-lg font-bold underline underline-offset-4 decoration-orange-800/50'>B.Tech in Computer Science and Engineering</span> <span className='italic font-semibold text-right'>Aug 2017 - Jun 2021</span></p>
              <ul className='space-y-1 list-none pt-2'>
                <li><span className="text-orange-800 mr-2">▶</span><span className="font-semibold">Location:</span> Ropar, India</li>
              </ul>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="pt-2">
          <p className='text-xl font-bold border-2 border-orange-950 bg-orange-100 pl-2 shadow-sm'>Achievements</p>
          <div className='pt-4 pl-2'>
              <ul className='space-y-3 list-none'>
                <li>
                  <div className="flex items-start">
                    <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                    <div>
                      <span>Secured top-25 national standing and team ranks of 9 and 11 (out of thousands) in 2024 CTF competitions by solving advanced cryptography challenges for the UTD CTF Team (CSG). Writeups: - HackTheVote2024, Patriot2024</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start">
                    <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                    <div>
                      <span>Secured a Rank of 2029, 99.8 Percentile (out of 1 million+ candidates) in IIT-JEE 2017.</span>
                    </div>
                  </div>
                </li>
              </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Education