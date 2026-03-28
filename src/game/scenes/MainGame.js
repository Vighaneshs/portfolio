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
    isMovingWithPointer = false;
    isSmallScreen = false;
    combatTriggered = false;

    playerSpeed = 125;
    constructor ()
    {
        super('MainGame');
    }

    
    create ()
    {
        this.initMap();
        this.initMCAnim();
        this.initNPC();
        this.initPlayer();
        


        this.showDebugWalls()

        this.mainCollider = this.physics.add.collider(this.player, this.wallsLayer);
        
        this.workexBox = this.physics.add.sprite(160, 244);  this.workexBox.setScale(3,1.25)
        this.educationBox = this.physics.add.sprite(160, 410); this.educationBox.setScale(3, 1.25);
        this.projectBox = this.physics.add.sprite(640, 244); this.projectBox.setScale(3, 1.25);
        this.contactsBox = this.physics.add.sprite(350, 444); this.contactsBox.setScale(3, 1.25);
        this.aboutBox = this.physics.add.sprite(690, 448); this.aboutBox.setScale(6, 5);

        this.leftNullBox = this.physics.add.sprite(160, 327); this.leftNullBox.setScale(2, 2.65);
        this.rightNullbox = this.physics.add.sprite(690, 318); this.rightNullbox.setScale(6, 2);
        this.middleNullBox = this.physics.add.sprite(352, 370); this.middleNullBox.setScale(2);


        

        this.input.on('pointerdown', ()=>{
            const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
            const start = { x: this.player.body.x, y: this.player.body.y };
            let newPath = this.navMesh.findPath(start, { x: worldPoint.x, y: worldPoint.y });
            if(newPath == null){
                this.target = this.rectangleCoordFinder(worldPoint.x, worldPoint.y);
                newPath = this.navMesh.findPath(start, { x: this.target.x, y: this.target.y });
                if(newPath == null){
                    newPath = this.navMesh.findPath({x: start.x-15, y: start.y }, { x: this.target.x, y: this.target.y });
                    if(newPath == null){
                        newPath = this.navMesh.findPath({x: start.x, y: start.y-15 }, { x: this.target.x, y: this.target.y });
                        if(newPath == null){
                            newPath = this.navMesh.findPath({x: start.x-15, y: start.y-15 }, { x: this.target.x, y: this.target.y });
                        }
                    }
                }
            }
            if(newPath != null){
                this.currentPath = newPath;
                this.player.body.setVelocity(0);
                this.currPathIndex = 0;
                if(this.mainCollider) this.mainCollider.active = false;
            }
        }, this);
        this.cursors = this.input.keyboard.createCursorKeys()
        
        EventBus.emit('current-scene-ready', this);
    }

    update (time, delta)
    {
        this.moveAndAnimate();
        this.moveWithClick();
        this.checkOverlapsRooms();
        if(window.innerWidth < 800 || window.innerHeight < 550) {
            this.cameras.main.startFollow(this.player);
            this.isSmallScreen = true;
        } else {
            this.cameras.main.stopFollow(this.player);
            this.cameras.main.centerOn(416,288);
            this.isSmallScreen = false;
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

        this.navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh", this.map, [this.wallsLayer], undefined, 4);

        const workexText = this.add.text(234, 228, 'WORK', { fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff' });
        workexText.setStroke('#000000', 4);

        const projectText = this.add.text(508, 228, 'PROJECTS', { fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff' });
        projectText.setStroke('#000000', 4);

        const eduText = this.add.text(198, 352, 'EDUCATION', { fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff' });
        eduText.setStroke('#000000', 4);

        const contactsText = this.add.text(410, 400, 'CONTACT', { fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff' });
        contactsText.setStroke('#000000', 4);

        const aboutText = this.add.text(664, 440, 'ABOUT', { fontFamily: 'Arial Black', fontSize: 12, color: '#ffffff' });
        aboutText.setStroke('#000000', 4);

        const aiLabel = this.add.text(670, 418, 'AI', { fontFamily: 'Arial Black', fontSize: 10, color: '#ffffff', backgroundColor: '#9a3412', padding: { x: 4, y: 2 } });
        aiLabel.setStroke('#000000', 2);
        this.tweens.add({
            targets: aiLabel,
            y: aiLabel.y - 4,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });


        const npcLabel = this.add.text(740, 468, 'NPC', { fontFamily: 'Arial Black', fontSize: 8, color: '#ffffff', backgroundColor: '#dc2626', padding: { x: 2, y: 1 } });
        npcLabel.setStroke('#000000', 2);

        const fightLabel = this.add.text(736, 456, 'FIGHT', { fontFamily: 'Arial Black', fontSize: 7, color: '#fef08a', backgroundColor: '#7c2d12', padding: { x: 2, y: 1 } });
        fightLabel.setStroke('#000000', 1);
        this.tweens.add({
            targets: fightLabel,
            y: fightLabel.y - 3,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        EventBus.on('combat-ended', () => { this.combatTriggered = false; });

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
        //this.player.body.setOffset(4, 70);
        this.player.body.setOffset(23, 83);
    }

    initNPC()
    {
        this.npcBody = this.physics.add.image(780, 260, 'monster_npc');
        this.npcBody.setScale(0.15);
        this.npcBody.body.setImmovable(true);
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
        if (this.cursors.left.isUp
            && this.cursors.right.isUp
            && this.cursors.down.isUp
            && this.cursors.up.isUp
            && !this.isMovingWithPointer)
        {
            this.player.body.setVelocity(0);
            this.player.anims.play('idle', true);
        }
        if (this.isMovingWithKeyboard()){
            this.mainCollider.active = true;
            this.player.body.setOffset(4, 70);
        } else{
            this.player.body.setOffset(23, 83);
        }
        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.isMovingWithPointer = false;
            if (this.cursors.up.isDown){
                this.player.body.setVelocityY(-1*this.playerSpeed*Math.sin((45*Math.PI)/180));
                this.player.body.setVelocityX(-1*this.playerSpeed*Math.sin((45*Math.PI)/180));
            }
            else if (this.cursors.down.isDown){
                this.player.body.setVelocityY(this.playerSpeed*Math.sin((45*Math.PI)/180));
                this.player.body.setVelocityX(-1*this.playerSpeed*Math.sin((45*Math.PI)/180));
            }
            else{
                this.player.body.setVelocityY(0);
                this.player.body.setVelocityX(-1*this.playerSpeed);
            }
        }
        else if (this.cursors.right.isDown)
        {
            this.isMovingWithPointer = false;
            if (this.cursors.up.isDown){
                this.player.body.setVelocityY(-1*this.playerSpeed*Math.sin((45*Math.PI)/180));
                this.player.body.setVelocityX(this.playerSpeed*Math.sin((45*Math.PI)/180));
            }
            else if (this.cursors.down.isDown){
                this.player.body.setVelocityY(this.playerSpeed*Math.sin((45*Math.PI)/180));
                this.player.body.setVelocityX(this.playerSpeed*Math.sin((45*Math.PI)/180));
            }
            else{
                this.player.body.setVelocityY(0);
                this.player.body.setVelocityX(this.playerSpeed);
            }
        } else  if (this.cursors.up.isDown)
        {
            this.isMovingWithPointer = false;
            this.player.body.setVelocityY(-1*this.playerSpeed);
        }
        else if (this.cursors.down.isDown)
        {
            this.isMovingWithPointer = false;
            this.player.body.setVelocityY(this.playerSpeed);
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
    }

    moveWithClick(){
        if (this.currentPath && this.currPathIndex < this.currentPath.length){
            if( Math.abs(this.player.body.x - this.currentPath[this.currPathIndex].x) < 5 && Math.abs(this.player.body.y - this.currentPath[this.currPathIndex].y) < 5){
                this.currPathIndex += 1;
                this.isMoving = false;
                this.player.body.setVelocity(0);
                this.isMovingWithPointer = false;
            } else if (!this.isMoving) {
                this.isMovingWithPointer = true;
                const dx = this.currentPath[this.currPathIndex].x - this.player.body.x;
                const dy = this.currentPath[this.currPathIndex].y - this.player.body.y;
                const magnitude = Math.sqrt(dx*dx + dy*dy);
                if (magnitude < 1) {
                    this.currPathIndex += 1;
                    this.isMoving = false;
                    return;
                }
                const ratioX = Math.abs(dx) / magnitude;
                const ratioY = Math.abs(dy) / magnitude;
                if (ratioX >= ratioY) {
                    this.player.anims.play({key: dx > 0 ? 'walkRight' : 'walkLeft', repeat:-1});
                } else {
                    this.player.anims.play({key: dy > 0 ? 'walkDown' : 'walkUp', repeat:-1});
                }
                this.player.body.setVelocityX((dx / magnitude) * this.playerSpeed);
                this.player.body.setVelocityY((dy / magnitude) * this.playerSpeed);
                this.isMoving = true;
            }
        } else if (!this.isMovingWithKeyboard()) {
            this.isMovingWithPointer = false;
            this.player.anims.play('idle', true);
            this.player.body.setVelocity(0);
        }
    }

    checkOverlapsRooms(){
        if (!this.combatTriggered && this.physics.overlap(this.player, this.npcBody)) {
            this.combatTriggered = true;
            EventBus.emit('start-combat');
        }
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

    isMovingWithKeyboard(){
        if (this.cursors.left.isDown
            ||this.cursors.right.isDown
            ||this.cursors.up.isDown
            ||this.cursors.down.isDown)
            {
                return true
            }
    }
    //For path correction
    rectangleCoordFinder(initPointerX, initPointerY ){
        if(0 <= initPointerX && initPointerX <= 304 &&  0<= initPointerY && initPointerY <= 224){
            //Work ex room
            if (42 <= initPointerX <= 278) return new pMath.Vector2(initPointerX, 184);
            if (initPointerX <= 42)  return new pMath.Vector2(42, 184);
            return new pMath.Vector2(278, 184);
        }else if(initPointerX >= 0 && initPointerY > 224 && initPointerX <= 304 && initPointerY <= 350){
            //Path between workex and education
            if (42 <= initPointerX <= 278) return new pMath.Vector2(initPointerX, 302);
            return new pMath.Vector2(200, 302);
        }else if(initPointerX >= 0 && initPointerY > 350 && initPointerX <= 304 && initPointerY <= 576){
            //Education room
            return new pMath.Vector2(158, 454);
        }else if(initPointerX > 304 && initPointerY >= 0 && initPointerX <= 492 && initPointerY <= 92){
            //Path between work and projects
            return new pMath.Vector2(initPointerX, 104);
        }else if(initPointerX > 304 && initPointerY >= 374 && initPointerX <= 558 && initPointerY <= 556){
            //Contacts room
            return new pMath.Vector2(451, 469);
        } else if(initPointerX > 558 && initPointerY >= 374 && initPointerX <= 810 && initPointerY <= 556){
            //About room
            return new pMath.Vector2(684, 472);
        }else if(initPointerX >= 492 && initPointerY > 224 && initPointerX <= 810 && initPointerY <= 374){
            //Path between about and projects
            return new pMath.Vector2(initPointerX, 302);
        }else if(492 <= initPointerX && initPointerX <= 810 &&  0<= initPointerY && initPointerY <= 224){
            //Work ex room
            if (524 <= initPointerX <= 792) return new pMath.Vector2(initPointerX, 184);
            if (initPointerX <= 524)  return new pMath.Vector2(524, 184);
            return new pMath.Vector2(792, 184);
        }
        else {
            return new pMath.Vector2(initPointerX, initPointerY);
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
