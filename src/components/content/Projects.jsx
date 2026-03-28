import React from 'react'

const Projects = () => {
  return (
    <div>
      <div className='inline-block bg-orange-200 border-2 border-orange-950 px-4 py-1 mb-2 font-bold text-2xl shadow-sm'>PROJECTS</div>
        <div className='text-l text-left px-2 pt-4 space-y-4 pb-8'>
          
          <ul className="space-y-4 list-none">
            {/* New Resume Projects */}
            <li>
              <div className="flex items-start">
                <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                <div>
                  <a className="after:content-['_↗'] hover:text-orange-600 font-bold text-xl decoration-orange-800/50 underline underline-offset-2" href="https://github.com/Vighaneshs" target="_blank">
                    Autonomous Multi-Agent Research System
                  </a>
                  <p className="mt-1">Built a system with 4 specialized agents (Planner, Search, Code, Synthesis), reducing research time by 70% through coordinated tool orchestration using LangGraph and LangChain.</p>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start">
                <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                <div>
                  <a className="after:content-['_↗'] hover:text-orange-600 font-bold text-xl decoration-orange-800/50 underline underline-offset-2" href="https://github.com/Vighaneshs/portfolio" target="_blank">
                    Interactive 2D Portfolio (This Website!)
                  </a>
                  <p className="mt-1">Built a Pokémon-style 2D interactive portfolio in React and Phaser 3 where visitors navigate a game world and interact with an LLM-powered NPC agent that retains conversation history across sessions.</p>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start">
                <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                <div>
                   <span className="font-bold text-xl text-orange-950 decoration-orange-800/50 underline underline-offset-2">GraphRAG Knowledge System</span>
                  <p className="mt-1">Combined Neo4j knowledge graphs with ChromaDB vector search, enabling multi-hop reasoning across 1k+ documents with 31% improved query accuracy.</p>
                </div>
              </div>
            </li>

            {/* Existing Projects */}
            <li>
              <div className="flex items-start">
                <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                <div>
                  <a className="after:content-['_↗'] hover:text-orange-600 font-bold text-xl decoration-orange-800/50 underline underline-offset-2" href="https://github.com/Vighaneshs/VCS-BTP" target="_blank">
                    Visual Cryptography
                  </a>
                  <p className="mt-1">Researched and Implemented different Visual Secret Sharing Schemes and compiled all the results to synthesize Coloured Visual Secret Sharing Scheme for General Access Structures in Python.</p>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start">
                <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                <div>
                   <span className="font-bold text-xl text-orange-950 decoration-orange-800/50 underline underline-offset-2">Prediction of Fetal Acidosis using CTG data</span>
                  <p className="mt-1">Created and trained a CNN model using PyTorch, which predicts Fetal Acidosis using Cardiotocography (CTG) data.</p>
                </div>
              </div>
            </li>
            
            <li>
              <div className="flex items-start">
                <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                <div>
                  <a className="after:content-['_↗'] hover:text-orange-600 font-bold text-xl decoration-orange-800/50 underline underline-offset-2" href="https://github.com/Vighaneshs/penfightlatest" target="_blank">
                    A 3D Multiplayer Game
                  </a>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start">
                <span className="text-orange-800 mr-2 flex-shrink-0 mt-1">▶</span>
                <div>
                  <a className="after:content-['_↗'] hover:text-orange-600 font-bold text-xl decoration-orange-800/50 underline underline-offset-2" href="https://github.com/Vighaneshs/BasketBallGame" target="_blank">
                    Newtonian physics / Raytracing Hoops Game
                  </a>
                </div>
              </div>
            </li>
          </ul>

        </div>    
    </div>
  )
}

export default Projects