import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';
import './index.css';
import Nav from './components/Nav';
import ContentBox from './components/ContentBox';
import { EventBus } from './game/EventBus';

function AuroraBlob({ left, top, width, height, color, xKF, yKF, duration, delay = 0 }) {
    return (
        <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
                left, top, width, height,
                background: color,
                filter: 'blur(90px)',
                willChange: 'transform',
            }}
            animate={{ x: xKF, y: yKF, scale: [1, 1.12, 0.94, 1.08, 1] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        />
    );
}

function App ()
{
    const [show, setShow] = useState("about")
    let [open, setOpen]= useState(true)
    const [inCombat, setInCombat] = useState(false)
    const phaserRef = useRef();

    const currentScene = (scene) => {}
    function handleShow(whatShow){
        if(show != whatShow) {setShow(whatShow);}
        setOpen(true)
    }
    function handleSetOpen(){
        setOpen(!open);
    }
    EventBus.on('show-work-ex', ()=>{handleShow("work")})
    EventBus.on('show-projects', ()=>{handleShow("projects")})
    EventBus.on('show-contacts', ()=>{handleShow("contact")})
    EventBus.on('show-education', ()=>{handleShow("education")})
    EventBus.on('show-about', ()=>{handleShow("about")})
    EventBus.on('start-combat', ()=>{ handleShow("AI"); setInCombat(true); })

    return (
        <>
        <Nav show={show} setShow={handleShow}/>
        <div id="app" className='relative bg-orange-300 h-screen w-full overflow-hidden'>

            {/* Aurora gradient background */}
            <div className="absolute inset-0 z-0 pointer-events-none">

                {/* Large anchor blobs — slow, wide drift */}
                <AuroraBlob
                    left="-10%" top="-20%" width={700} height={700}
                    color="radial-gradient(circle, rgba(234,88,12,0.75) 0%, transparent 70%)"
                    xKF={[0, 60, 20, 0]} yKF={[0, 40, 80, 0]}
                    duration={22} delay={0}
                />
                <AuroraBlob
                    left="55%" top="40%" width={650} height={650}
                    color="radial-gradient(circle, rgba(220,38,38,0.6) 0%, transparent 70%)"
                    xKF={[0, -50, -20, 0]} yKF={[0, -60, 20, 0]}
                    duration={26} delay={3}
                />
                <AuroraBlob
                    left="30%" top="50%" width={550} height={550}
                    color="radial-gradient(circle, rgba(245,158,11,0.55) 0%, transparent 70%)"
                    xKF={[0, 40, -30, 0]} yKF={[0, 30, -50, 0]}
                    duration={20} delay={6}
                />

                {/* Mid-size accent blobs — slightly faster */}
                <AuroraBlob
                    left="65%" top="-15%" width={420} height={420}
                    color="radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%)"
                    xKF={[0, -40, 10, 0]} yKF={[0, 60, 30, 0]}
                    duration={18} delay={2}
                />
                <AuroraBlob
                    left="-5%" top="55%" width={380} height={380}
                    color="radial-gradient(circle, rgba(194,65,12,0.65) 0%, transparent 70%)"
                    xKF={[0, 50, 20, 0]} yKF={[0, -30, -60, 0]}
                    duration={16} delay={8}
                />
                <AuroraBlob
                    left="40%" top="-5%" width={320} height={320}
                    color="radial-gradient(circle, rgba(253,186,116,0.7) 0%, transparent 70%)"
                    xKF={[0, -30, 40, 0]} yKF={[0, 50, 20, 0]}
                    duration={14} delay={4}
                />

                {/* Dot grid overlay — retro pixel texture */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(120,40,0,0.6) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />
            </div>

            <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 md:gap-x-44'>
                <div className='h-screen content-center justify-self-center py-5 md:ml-48'>
                    <PhaserGame ref={phaserRef} currentActiveScene={currentScene}/>
                </div>
                <div className={`h-5/6 w-11/12 ml-6 md:ml-0 top-[84px] md:top-[78px] ${open ? 'z-[40]' : 'z-[-1]' } justify-self-center absolute left-0 p-6 md:p-8 md:relative border-4 border-orange-950 outline outline-4 outline-orange-800 bg-yellow-100 md:z-auto items-center overflow-scroll`}>
                    <ContentBox show={show} setShow={handleShow} open={open} setOpen={handleSetOpen} inCombat={inCombat} setInCombat={setInCombat}/>
                </div>
            </div>
        </div>
        </>
    )
}

export default App
