class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 1500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1200;
        this.JUMP_VELOCITY = -400;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.WALL_SLIDE_SPEED = 100;
    }
     preload() {
  this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
     }

    create() {
        this.restarting = false;

         this.bgmusic = this.sound.add('bgmusic', { loop: true, volume: 0.5 });
this.bgmusic.play();

     

        this.runSound = this.sound.add("runs");
this.runSoundPlaying = false;
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is

        this.dash=true;
        this.doublejump=true;
          this.dashSpeed = 300;
          this.hittime=true;
        this.m=true;
        this.sinactive=false;
        
          
           
        this.hp=1;
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 100, 75);
        this.myScore=0;

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.ctileset=this.map.addTilesetImage("candy_titlemap_packed","candytile");
        this.itileset=this.map.addTilesetImage("itilemap_packed","itilemap_tiles");
        this.characterset=this.map.addTilesetImage("tilemap-characters-packed","character");
        this.backgroundset=this.map.addTilesetImage("tilemap-backgrounds_packed","background");

        // Create a layer
         this.backgroundlayer=this.map.createLayer("background", this.backgroundset,0,0);
       this.groundLayer = this.map.createLayer("Ground-n-Platforms", [this.tileset, this.ctileset,this.itileset, this.characterset], 0, 0);
    
        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true,
            water:true,
            hitbox:true,
            wall:true,
            final:true,
            death:true,
            fallcollides:true,
            reddoor:true
        });


        // TODO: Add createFromObjects here
           // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

         this.dia = this.map.createFromObjects("Objects", {
            name: "dia",
            key: "tilemap_sheet",
            frame: 67
        });
         this.en1 = this.map.createFromObjects("Objects", {
            name: "entrance1",
            key: "tilemap_sheet",
            frame: 132
        });
          this.en2 = this.map.createFromObjects("Objects", {
            name: "entrance2",
            key: "tilemap_sheet",
            frame: 134
        });
        this.door=this.map.createFromObjects("Objects", {
            name: "door",
            key: "tilemap_sheet",
            frame: 150
        });
        this.switch=this.map.createFromObjects("Objects", {
            name: "switch",
            key: "tilemap_sheet",
            frame: 64
        });
        
        this.spawnPoint=this.map.createFromObjects("Objects",{
            name:"spawn",
            key:"tilemap_sheet",
            frame:111
        })[0];
this.cottons = this.map.createFromObjects("Objects", {
    name: "cotton",
    key:  "candy_tilemap_sheet",
    frame: 25
});

//敌人1精灵
this.ene1 = this.map.createFromObjects("Objects", {
    name: "enemy",
    key:"character1_sheet",
    frame:20
});


this.enemyGroup = this.physics.add.group();



//掉落平台
this.fallPlatforms = this.map.createFromObjects("Objects", {
    name: "fallplatform"
});

this.fallGroup = this.add.group();
this.fallPlatforms.forEach(platformObj => {
    // 创建一个新的 container 来组合三个 tile 图块
    const x = platformObj.x;
    const y = platformObj.y;

    // 你可以用 group 或 container 包含3块 tile
    const group = this.add.container(x, y);

    // 添加三块tile sprite，根据 tile size 调整位置
    const tile1 = this.add.sprite(0, 0, "itilemap_sheet", 20);
    const tile2 = this.add.sprite(-18, 0, "itilemap_sheet", 21);
    const tile3 = this.add.sprite(18, 0, "itilemap_sheet", 22);

    group.add([tile1, tile2, tile3]);

    // 设置 container 的位置 anchor
    group.setSize(54, 18); // 18x3
    this.physics.add.existing(group);
    group.body.setImmovable(true);
    group.body.allowGravity = false;

    // 存进数组或 group 方便后续访问
      this.fallGroup.add(group);
});


         this.waterTiles = this.groundLayer.filterTiles(tile => {
            return tile.properties.water == true;
        });

        this.moveTiles= this.groundLayer.filterTiles(tile => {
            return tile.properties.moveplate == true;
        });
       


       
        // TODO: Add turn into Arcade Physics here
         // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
         this.physics.world.enable(this.dia, Phaser.Physics.Arcade.STATIC_BODY);
           this.physics.world.enable(this.en1, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.en2, Phaser.Physics.Arcade.STATIC_BODY);
         this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);
          this.physics.world.enable(this.switch, Phaser.Physics.Arcade.STATIC_BODY);
          this.physics.world.enable(this.cottons, Phaser.Physics.Arcade.STATIC_BODY);

          this.ene1.forEach(enemy => {
    this.physics.world.enable(enemy);  // 转换为 physics 精灵
    enemy.body.setCollideWorldBounds(true);
      this.physics.add.collider(enemy, this.groundLayer); 
      enemy.startX = enemy.x;
enemy.moveDistance = 18;  // 中心左右各 18 像素
enemy.speed = 0.4;
enemy.direction = 1;

       
});
           



        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.cottonGroup = this.add.group(this.cottons);//棉花group
        this.doorgroup = this.add.group(this.door); //
        this.coinGroup = this.add.group(this.coins);
        this.enemyGroup=this.physics.add.group(this.ene1);
       for(let coin of this.coinGroup.getChildren() ){
            coin.anims.play('coins',true);

        }
         //water bubble effect

         my.vfx.bubble = this.add.particles(0, 0, "kenny-particles", {
            frame: ['circle_01.png', 'ircle_02.png'],
            random: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 500,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
             quantity: 3,
               frequency: 500,
                speed: { min: 100, max: 200 },  // 粒子速度
                angle: { min: 0, max: 360 }, 
            
        });
         my.vfx.bubble .stop();

         //硬币特效
        my.vfx.coinsaffect = this.add.particles(400, 250, "kenny-particles", {
            
            frame: ['star_05.png'],
             tint: [0xfacc22, 0xf83600, 0x9f0404],
              lifespan: 400,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false,
            scale:0.03
        });

        //dash特效
        my.vfx.dash = this.add.particles(0, 0, "kenny-particles", {
    frame: ["square_01.png", "square_02.png", "square_03.png"],  
    speedX: { min: -400, max: -200 },
    lifespan: 250,
    scale: { start: 0.3, end: 0 },
    alpha: { start: 1, end: 0 },
    quantity: 4,
    frequency: 30,
    gravityY: 0,
    blendMode: "ADD",
    emitting: false 
});


        // 玩家
        my.sprite.player = this.physics.add.sprite(18, 792, "platformer_characters", "tile_0000.png");
        my.sprite.player.setMaxVelocity(300, 500);
        my.sprite.player.setCollideWorldBounds(true);



        /*
        this.tweens.add({
    targets: my.sprite.player,
    alpha: { from: 1, to: 0.1 },
    duration: 200,
    yoyo: true,
    repeat: -1
    
});
  if (!this.invincibleAura) {
        this.invincibleAura = this.add.particles(0, 0, "kenny-particles", {
            frame: ["star_07.png", "star_08.png"],
            scale: { start: 0.05, end: 0 },
            speed: 50,
            lifespan: 400,
            quantity: 2,
            frequency: 100,
            blendMode: "ADD"
        });
    }
    this.invincibleAura.startFollow(my.sprite.player);
*/

        //怪物
        
        my.sprite.monster=this.physics.add.sprite(504,345, "platformer_characters","ile_0020.png");
         my.sprite.monster.setCollideWorldBounds(true); 
            my.sprite.monster.setBounceX(0); 
            my.sprite.monster.setBounceY(0);
             my.sprite.monster.setImmovable(true);
         this.physics.add.collider(my.sprite.monster,this.groundLayer);
           this.physics.add.collider(my.sprite.player, my.sprite.monster, (player, monster) =>{
                if(monster.body.touching.up || (player.body.velocity.y > 0 && player.y < monster.y)){
                    monster.destroy();
                    player.setVelocityY(-500);
                      this.sound.play("coinc");
                }
                else{
                     this.sound.play("death");
                    player.setPosition(this.spawnPoint.x, this.spawnPoint.y); 

                }

           });



        // Enable collision handling



        this.physics.add.collider(my.sprite.player, this.groundLayer, (player, tile) => {

  if(tile.properties.final && !this.restarting){
     this.restarting = true;
    this.time.delayedCall(100, () => {
        this.bgmusic.stop();
        this.scene.start("endscene");
    });
    
    }


            if(tile.properties.collides){
                if(player.body.blocked.down){
            this.doublejump=true;
            this.dash=true;
            }
            if(my.sprite.player.body.blocked.left||my.sprite.player.body.blocked.right){
                this.dash=true;
            }
        }
            

    if (tile.properties.water||tile.properties.death) {

          this.resetFallPlatforms();
          this.sound.play("death");
         my.vfx.bubble.x=player.x;
          my.vfx.bubble.y=player.y;
        my.vfx.bubble.start();
        this.time.delayedCall(1000, () => {
   my.vfx.bubble.stop();
}, [], this);
        if(player.y<396){
        player.setPosition(54, 306); 
        }
        else if(player.y>396&&player.y<864){
             player.setPosition(36,792); 
        }
        else{
             player.setPosition(54,1242);
        }
    }
    if(tile.properties.reddoor){
         player.setPosition(54, 306);

    }

    if (tile.properties.hitbox&&this.hittime==true) {
    if(player.body.blocked.up){
     const worldX = tile.pixelX;  // 或 tile.getLeft()
    const worldY = tile.pixelY;  // 或 tile.getTop()
    this.mushroom=this.physics.add.sprite(worldX+8, worldY - 36, "tilemap_sheet", 128);
     this.mushroom.setCollideWorldBounds(true);
     this.hittime=false;
     this.physics.world.enable(this.mushroom); 
      this.physics.add.collider( this.mushroom,this.groundLayer);
      this.physics.add.collider(my.sprite.player,this.mushroom, (player, mushroom) => {

    player.setScale(0.5);
    mushroom.destroy();
});
    }
}

});
//平台碰撞
this.physics.add.collider(my.sprite.player, this.fallGroup, (player, platform) => {
    this.doublejump=true;
    this.dash=true;
    this.time.delayedCall(300, () => {
        platform.body.allowGravity = true;
        platform.body.setImmovable(false);
    });
});
this.physics.add.collider(my.sprite.player,this.enemyGroup,(player, enemy) => {
        
  if(enemy.body.touching.up || (player.body.velocity.y > 0 && player.y < enemy.y)){
                    enemy.destroy();
                    player.setVelocityY(-500);
                      this.sound.play("coinc");
                }
                else{
                     this.sound.play("death");
                    player.setPosition(36,792); 

                }




    });




//棉花碰撞
this.physics.add.overlap(my.sprite.player, this.cottonGroup, (player, cotton) => {
    this.tweens.add({
        targets: cotton,
        scale: 1.8,         
        duration: 100,
        yoyo: true,         
        ease: 'Sine.easeInOut'
    });

   
    player.body.setVelocityY(-600);  
    this.dash=true;
    this.doublejump=true;
   
    // cotton.destroy();
    // this.myScore += 10;
});



//水沟门口碰撞
 this.physics.add.collider(my.sprite.player,this.doorgroup);
  this.physics.add.overlap(my.sprite.player, this.switch, (obj1, obj2) => {
     this.sound.play("dopen");
     if (this.sinactive == false) {
        obj2.setFrame(66);
        this.sinactive = true;    
        this.doorgroup.getChildren().forEach(door => {
        door.destroy();
});
    }
    
        });

        
    this.waterEmitters = [];
    this.waterTiles.forEach(tile => {
        let emitter =this.add.particles(tile.pixelX,tile.pixelY,"kenny-particles",{
                 frame: [`circle_01.png`],
            // TODO: Try: add random: true
            scale:0.015,
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 1000,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0}, 
             quantity: 1,
             speedY: { min: -30, max: -60 },
             frequency: 500,



        })
          
        this.waterEmitters.push(emitter);
    });





        // TODO: Add coin collision handler
        
        
          this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.sound.play("coinc");
            obj2.destroy(); // remove coin on overlap
            my.vfx.coinsaffect.x=obj2.x;
             my.vfx.coinsaffect.y=obj2.y;
             my.vfx.coinsaffect.explode(16);
            this.myScore+=10;
        });
         this.physics.add.overlap(my.sprite.player, this.dia, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
           my.sprite.player.setScale(1.0);
        });
       this.physics.add.overlap(my.sprite.player, this.en1, (obj1, obj2) => {
            obj1.setPosition(54,1242);
            
        });
         this.physics.add.overlap(my.sprite.player, this.en2, (obj1, obj2) => {
            obj1.setPosition(936,378);
            
        });


        
        

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.keyf=this.input.keyboard.addKey('f');

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

       




        // TODO: Add movement vfx here
           my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();


         this.score=this.add.text(500,0,"score"+this.myScore,{
            color: '#ffffff'

         }).setScale(3);
        

        // TODO: add camera code here
         this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
         this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
         this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
         this.animatedTiles.init(this.map);

    }

    update() {

       this.ene1.forEach(enemy => {
    if (!enemy.body) return;

    enemy.x += enemy.speed * enemy.direction;

    if (enemy.x > enemy.startX + enemy.moveDistance) {
        enemy.x = enemy.startX + enemy.moveDistance;
        enemy.direction = -1;
    } else if (enemy.x < enemy.startX - enemy.moveDistance) {
        enemy.x = enemy.startX - enemy.moveDistance;
        enemy.direction = 1;
    }

   // enemy.body.updateFromGameObject(); // 同步物理位置
});
      


        //怪物行动
        if(my.sprite.monster.x<=432){
           this.m=true;
        }
        if(my.sprite.monster.x>=558){
           this.m=false;
        }
        if(this.m==true){
           my.sprite.monster.x+=1;
        }
        if(this.m==false){
          my.sprite.monster.x-=1;

        }
        this.score.x=this.cameras.main.width / 2; ;
        this.score.y= this.cameras.main.height / 2;

    
        this.score.setText("Score"+this.myScore);
        if(cursors.left.isDown) {

            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
               my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {
                if(!this.runSound.isPlaying){
                     this.runSound.play();
                }
                my.vfx.walking.start();

            }

        } else if(cursors.right.isDown) {
             
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
              my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();
                  if(!this.runSound.isPlaying){
                     this.runSound.play();
                }

            }


        } else {
            // Set acceleration to 0 and have DRAG take over
           
            my.sprite.player.anims.play('idle');
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
              if (this.runSound.isPlaying) {
        this.runSound.stop();
    }
               my.vfx.walking.stop();
        }


        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
      if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
    this.sound.play("jumps");
} 
else if (my.sprite.player.body.blocked.right && Phaser.Input.Keyboard.JustDown(cursors.up)) {
    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
 
    my.sprite.player.anims.play('jump');
    this.sound.play("jumps");
     this.doublejump = true;
}
else if (my.sprite.player.body.blocked.left && Phaser.Input.Keyboard.JustDown(cursors.up)) {
    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
   
    my.sprite.player.anims.play('jump');
    this.sound.play("jumps");
     this.doublejump = true;
}
else if (!my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up) && this.doublejump == true) {
    my.sprite.player.anims.play('jump');
    this.sound.play("jumps");
    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
    this.doublejump = false;
}


//dash
if (Phaser.Input.Keyboard.JustDown(this.keyf) && this.dash) {
    let direction = my.sprite.player.flipX ? 1 : -1;

    my.sprite.player.body.setVelocityX(this.dashSpeed * direction);
    my.sprite.player.body.setVelocityY(0);
    my.sprite.player.body.allowGravity = false;
    this.dash = false;
    this.isDashing = true;


    // ✅ 触发 dash 粒子尾迹
    my.vfx.dash.startFollow(my.sprite.player, -direction * 10, 0);
    my.vfx.dash.start();

    // dash 结束后恢复
    this.time.delayedCall(200, () => {
        this.isDashing = false;
        my.sprite.player.body.allowGravity = true;
        my.vfx.dash.stop();  // 停止发射粒子
    });
}

        

       //wallslide
        let touchingWall = my.sprite.player.body.blocked.left || my.sprite.player.body.blocked.right;
let onGround = my.sprite.player.body.blocked.down;

if (touchingWall && !onGround && my.sprite.player.body.velocity.y > this.WALL_SLIDE_SPEED) {
    my.sprite.player.body.setVelocityY(this.WALL_SLIDE_SPEED);
    // 可选动画
    my.sprite.player.anims.play("wallslide", true);
}

 if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            my.vfx.bubble.destroy();
    my.vfx.dash.destroy();
    my.vfx.walking.destroy();

    // 2. 停止所有声音
    this.sound.stopAll();

    // 3. 清理物理系统
    this.physics.world.shutdown();

    // 4. 重启场景（使用 start 而非 restart）
    this.scene.start("platformerScene");
        }
    }
resetFallPlatforms() {
    this.fallGroup.clear(true, true);  // 删除原来的平台

    // 重新创建平台
    this.fallPlatforms.forEach(platformObj => {
        const x = platformObj.x;
        const y = platformObj.y;

        const group = this.add.container(x, y);
        const tile1 = this.add.sprite(0, 0, "itilemap_sheet", 20);
        const tile2 = this.add.sprite(-18, 0, "itilemap_sheet", 21);
        const tile3 = this.add.sprite(18, 0, "itilemap_sheet", 22);

        group.add([tile1, tile2, tile3]);
        group.setSize(54, 18);
        this.physics.add.existing(group);
        group.body.setImmovable(true);
        group.body.allowGravity = false;

        group.startX = x;
        group.startY = y;

        this.fallGroup.add(group);
    });

    // 恢复平台与玩家碰撞
    this.physics.add.collider(my.sprite.player, this.fallGroup);
}


    
}