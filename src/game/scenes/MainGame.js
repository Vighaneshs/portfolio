import { EventBus } from '../EventBus';
import { Scene, Math as pMath } from 'phaser';


export class MainGame extends Scene
{
    player;
    showDebugW = false;
    inbox = false;
    startMoving = false;
    isMoving = false;
    currPathIndex = 0;

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
        this.aboutBox = this.physics.add.sprite(690, 448); this.aboutBox.setScale(6, 5);

        this.leftNullBox = this.physics.add.sprite(160, 327); this.leftNullBox.setScale(1.25, 2.65);
        this.rightNullbox = this.physics.add.sprite(690, 318); this.rightNullbox.setScale(6, 2);
        this.middleNullBox = this.physics.add.sprite(350, 380); this.middleNullBox.setScale(1.25);

        this.target = new pMath.Vector2();

        this.input.on('pointerdown', (pointer)=>{
            this.currentPath = this.navMesh.findPath({x: this.player.body.x, y: this.player.body.y }, { x: pointer.x, y: pointer.y });
            console.log(this.currentPath)
            // this.target.x = 670
            // this.target.y = 312
            // this.physics.moveToObject(this.player, this.target, 1000);
            this.player.body.setVelocity(0);
            this.currPathIndex = 0;
        }, this);
        this.cursors = this.input.keyboard.createCursorKeys()
        
        EventBus.emit('current-scene-ready', this);
    }

    update (time, delta)
    {
        //this.moveAndAnimate();
        this.checkOverlapsRooms();
        //if(this.startMoving) this.movePlayerOnClick();

        //console.log(this.pathPoint && this.currPathIndex < this.pathPoints.length)
        if (this.currentPath && this.currPathIndex < this.currentPath.length){
            if( Math.abs(this.player.body.x - this.currentPath[this.currPathIndex].x) < 1 && Math.abs(this.player.body.y - this.currentPath[this.currPathIndex].y) < 1){
                this.currPathIndex += 1;
                this.isMoving = false;
                this.player.body.setVelocity(0);
            } else if (!this.isMoving) {
                // this.target.x =  this.currentPath[this.currPathIndex].x;
                // this.target.y =  this.currentPath[this.currPathIndex].y;
                // console.log(this.target.x, this.target.y)
                // this.physics.moveToObject(this.player, this.target, 100);
                let dirX =  (this.currentPath[this.currPathIndex].x - this.player.body.x)/Math.abs((this.currentPath[this.currPathIndex].x - this.player.body.x));
                let dirY =  (this.currentPath[this.currPathIndex].y - this.player.body.y)/Math.abs((this.currentPath[this.currPathIndex].y - this.player.body.y));
                let ratioX = ( Math.abs(this.currentPath[this.currPathIndex].x - this.player.body.x))/ (( Math.abs(this.currentPath[this.currPathIndex].x - this.player.body.x)) + ( Math.abs(this.currentPath[this.currPathIndex].y - this.player.body.y)));
                let ratioY = ( Math.abs(this.currentPath[this.currPathIndex].y - this.player.body.y))/ (( Math.abs(this.currentPath[this.currPathIndex].x - this.player.body.x)) + ( Math.abs(this.currentPath[this.currPathIndex].y - this.player.body.y)));
                this.player.body.setVelocityX(ratioX*dirX*100);
                this.player.body.setVelocityY(ratioY*dirY*100);
                this.isMoving = true;
            }
        } else {
            this.player.body.setVelocity(0);
        }
    
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

        this.navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh", this.map, [this.wallsLayer]);
        // const path = navMesh.findPath({ x: 10, y: 10 }, { x: 392, y: 323 });
        // this.navMesh.enableDebug();
        // this.navMesh.debugDrawClear(); // Clears the overlay
        // this.navMesh.debugDrawMesh({
        // drawCentroid: true,
        // drawBounds: false,
        // drawNeighbors: true,
        // drawPortals: true
        // });
        // navMesh.debugDrawPath(path, 0xffd900);
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

    
    initMov(pointer){
        this.pathPoints = this.navMesh.findPath({x:this.player.x, y:this.player.y}, {x:pointer.x, y:pointer.y});
        if(this.pathPoints && this.pathPoints.length > 1) {
            this.currPathIndex = 0;
            this.startMoving = true
        }
    }

    movePlayerOnClick(){
        
        if (this.currPathIndex < this.pathPoints.length-1) {
            this.currPos = {x:this.player.body.x, y:this.player.body.y};
            let dirX =  (this.pathPoints[this.currPathIndex].x - this.currPos.x)/Math.abs((this.pathPoints[this.currPathIndex].x - this.currPos.x));
            let dirY =  (this.pathPoints[this.currPathIndex].y - this.currPos.y)/Math.abs((this.pathPoints[this.currPathIndex].y - this.currPos.y));
            this.player.body.setVelocityX(100*dirX);
            this.player.body.setVelocityY(100*dirY);
            if (!dirX && !dirY) {
                this.currPathIndex += 1;
            }
        } else {
            this.player.body.setVelocity(0);
            this.startMoving = false;
        }
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
        if(this.physics.overlap(this.player, this.leftNullBox)
           || this.physics.overlap(this.player, this.rightNullbox)
           || this.physics.overlap(this.player, this.middleNullBox)){
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
