import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';
import './index.css';
import Nav from './components/Nav';
import ContentBox from './components/ContentBox';
import { EventBus } from './game/EventBus';

function App ()
{
    // The sprite can only be moved in the MainMenu Scene
    const [show, setShow] = useState("about")
    let [open, setOpen]= useState(true)
    const phaserRef = useRef();

    // Event emitted from the PhaserGame component
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
    return (
        <>
        <Nav show={show} setShow={handleShow}/>
        <div id="app" className='bg-orange-300 h-screen w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-x-44'>
                <div className='h-screen content-center justify-self-center py-5 md:ml-48'>
                    <PhaserGame ref={phaserRef} currentActiveScene={currentScene}/>
                </div>
                <div className={`h-3/4 w-11/12 ml-6 md:ml-0 md:h-[576px] top-[84px] md:top-[78px] ${open ? 'z-[100]' : 'z-[-1]' } justify-self-center absolute left-0 p-4 md:relative shadow-md bg-yellow-100 md:z-auto items-center`}>
                    <ContentBox show={show} setShow={handleShow} open={open} setOpen={handleSetOpen}/>
                </div>
            </div>
        </div>
        </>
    )
}

export default App
