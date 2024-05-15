import { Boot } from './scenes/Boot';
import { MainGame } from './scenes/MainGame';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 832,
    height: 576,
    parent: 'game-container',
    backgroundColor: '#fdba74',
    scale:{
        scaleMode: Phaser.Scale.ScaleManager.AUTO
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [
        Boot,
        Preloader,
        MainGame
    ]
};
const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
