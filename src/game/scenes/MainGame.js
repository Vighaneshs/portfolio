import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainGame extends Scene
{
    player;
    showDebugW = false;
    inbox = false;
    constructor ()
    {
        super('MainGame');
    }
    
    create ()
    {
        this.initMap();
        this.initMCAnim();

        this.initPlayer();
        if(window.innerWidth < 800 || window.innerHeight < 550) {this.cameras.main.startFollow(this.player);}
        
        this.showDebugWalls()

        this.physics.add.collider(this.player, this.wallsLayer);
        
        this.workexBox = this.physics.add.sprite(160, 244);  this.workexBox.setScale(1.25);
        this.educationBox = this.physics.add.sprite(160, 410); this.educationBox.setScale(1.25);
        this.projectBox = this.physics.add.sprite(640, 244); this.projectBox.setScale(1.25);
        this.contactsBox = this.physics.add.sprite(350, 444); this.contactsBox.setScale(1.25);
        this.aboutBox = this.physics.add.sprite(690, 440); this.aboutBox.setScale(5);

        this.leftNullBox = this.physics.add.sprite(160, 327); this.leftNullBox.setScale(1.25, 2.65);

        this.cursors = this.input.keyboard.createCursorKeys()
        
        EventBus.emit('current-scene-ready', this);
    }

    update (time, delta)
    {
        this.moveAndAnimate();
        this.checkOverlapsRooms();
        
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }


    initMap()
    {
        this.map = this.make.tilemap({ key: 'portmap', height:18, width:26 });
        //this.map.
        this.tileset = this.map.addTilesetImage('portmap', 'Ground');
        this.imageOfImageLayer = this.map.images.find(
            (layer) => layer.name == 'Ground'
        );
        
        this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0);
        this.add.image(this.imageOfImageLayer.x, this.imageOfImageLayer.y, this.imageOfImageLayer.name).setOrigin(0,0);
        this.wallsLayer.setCollisionByProperty({ collided: true });
    }
    initPlayer()
    {
        this.player = this.physics.add.sprite(this.cameras.main.worldView.x + this.cameras.main.width / 2, this.cameras.main.worldView.y + this.cameras.main.height / 2);
        this.player.setScale(0.6);
        this.player.play('idle');
        this.player.body.setSize(38, 28);
        this.player.body.setOffset(4, 70);
    }
    initMCAnim()
    {   
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('mychar', { frames: [1]}),
            frameRate: 0,
            repeat: 1
        });
        this.anims.create({
            key: 'walkDown',
            frames: this.anims.generateFrameNumbers('mychar', { frames: [ 0, 1, 2]}),
            frameRate: 6,
            repeat: 2
        });
        this.anims.create({
            key: 'walkLeft',
            frames: this.anims.generateFrameNumbers('mychar', { frames: [ 3, 4, 5]}),
            frameRate: 6,
            repeat: 0
        });
        this.anims.create({
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('mychar', { frames: [ 6, 7, 8] }),
            frameRate: 6,
            repeat: 0
        });
        this.anims.create({
            key: 'walkUp',
            frames: this.anims.generateFrameNumbers('mychar', { frames: [ 9, 10, 11] }),
            frameRate: 6,
            repeat: 0
        });
    }

    

    moveAndAnimate(){
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-100);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(100);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-100);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(100);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('walkLeft', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('walkRight', true);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play({key:'walkUp', end:10}, true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('walkDown', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }

    checkOverlapsRooms(){
        if(!this.inbox && (this.physics.overlap(this.player, this.workexBox, ()=>{EventBus.emit('show-work-ex', this)})
        || this.physics.overlap(this.player, this.projectBox, ()=>{EventBus.emit('show-projects', this)})
        || this.physics.overlap(this.player, this.contactsBox, ()=>{EventBus.emit('show-contacts', this)})
        || this.physics.overlap(this.player, this.educationBox, ()=>{EventBus.emit('show-education', this)})
        || this.physics.overlap(this.player, this.aboutBox, ()=>{EventBus.emit('show-about', this)}))){
            this.inbox = true;
        }
        if(this.physics.overlap(this.player, this.leftNullBox)){
            this.inbox = false;
        }
    }
    

    showDebugWalls() {
        if(this.showDebugW)
        {
            const debugGraphics = this.add.graphics().setAlpha(0.7);
            this.wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
            });
        }
    }
}
