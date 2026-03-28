import React from 'react'
import AIChat from './AIChat'
import CombatUI from './CombatUI'
import SDKShowcase from './SDKShowcase'

const Ai = ({ setShow, inCombat, setInCombat }) => {
  return (
    <div>
      <p className=' font-bold text-2xl border-2 border-orange-800 pl-4 align-middle'>AI </p>
        <div className='text-l text-left px-2 pt-4 space-y-2'>
          {inCombat && <CombatUI onCombatEnd={() => setInCombat(false)} />}
          <SDKShowcase />
          <AIChat setShow={setShow} />
        </div>
    </div>
  )
}

export default Ai
