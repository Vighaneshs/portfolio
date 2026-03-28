import React from 'react'

const About = () => {
  return (
    <div>
      <div className='inline-block bg-orange-200 border-2 border-orange-950 px-4 py-1 mb-2 font-bold text-2xl shadow-sm'>ABOUT</div>
        <div className='text-l text-left px-2 pt-4 space-y-3 pb-8'>
          <p className='text-xl font-bold underline underline-offset-4 decoration-orange-800/50 pb-2'>Welcome to my portfolio!</p>
          <ul className="space-y-2 list-none mb-6">
            <li><span className="text-orange-800 mr-2">▶</span>Software Engineer with 3+ years of industry experience building full-stack and intelligent systems at Sony PlayStation and GE HealthCare, with a focus on LLM applications, Agents and RAG pipelines.</li>
            <li><span className="text-orange-800 mr-2">▶</span>IIT alumnus graduating with an MS CS from UT Dallas in May 2026.</li>
            <li><span className="text-orange-800 mr-2">▶</span>Looking back on my <span className="text-blue-700 font-extrabold">programming</span> journey from around ten years ago, I made the decision to craft my portfolio as a game, symbolizing my initial steps into the world of programming.</li>
          </ul>

          <p className='text-xl font-bold underline underline-offset-4 decoration-orange-800/50 pb-2 pt-2'>Technical Skills</p>
          <ul className="space-y-2 list-none mb-6">
            <li><span className="text-orange-800 mr-2">▶</span><span className="font-semibold">Languages:</span> Python, Golang, C/C++, JavaScript, Java</li>
            <li><span className="text-orange-800 mr-2">▶</span><span className="font-semibold">Cloud & Devops:</span> AWS, GCP, Kubernetes, Docker, Linux, Git, Grafana, Prometheus</li>
            <li><span className="text-orange-800 mr-2">▶</span><span className="font-semibold">Frameworks/Technologies:</span> PyTorch, TensorFlow, LangChain, LangGraph, Hugging Face, Scikit-learn, Pandas, NumPy, REST, React, Angular</li>
            <li><span className="text-orange-800 mr-2">▶</span><span className="font-semibold">Databases:</span> ChromaDB, Neo4j, PostgreSQL, MongoDB, NoSQL</li>
          </ul>

          <p className='text-xl font-bold underline underline-offset-4 decoration-orange-800/50 pt-4 pb-2'>Controls</p>
          <ul className="space-y-2 list-none">
            <li><span className="text-orange-800 mr-2">▶</span>Touch/Click on the floor to move the character.</li>
            <li><span className="text-orange-800 mr-2">▶</span>You can also use <span className="text-green-700 font-extrabold">Arrow Keys</span>.</li>
          </ul>
          <div className="pt-6 space-y-2">
            <p className='text-2xl font-bold text-orange-950'>Enter the rooms!</p>
            <p className='text-l font-bold italic opacity-80'>And Feedback is appreciated.</p>
          </div>
        </div>
    </div>
  )
}

export default About