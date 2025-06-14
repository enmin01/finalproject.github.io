class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("candytile","candy_titlemap_packed.png");
         this.load.image("itilemap_tiles", "itilemap_packed.png"); 
         this.load.image("character","tilemap-characters-packed.png");
         this.load.image("background","tilemap-backgrounds_packed.png");
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("candy_tilemap_sheet", "candy_titlemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
         this.load.spritesheet("itilemap_sheet", "itilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        this.load.spritesheet("character_sheet","tilemap-characters-packed.png",{
             frameWidth: 24,
            frameHeight: 24

        });
        this.load.spritesheet("background_sheet","tilemap-backgrounds_packed.png",{
              frameWidth: 18,
            frameHeight: 18


        });
        this.load.spritesheet("character1_sheet","tilemap-characters.png",{
            frameWidth: 24,
            frameHeight: 24


        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
        this.load.audio("coinc","collect-ring-15982.mp3");
        this.load.audio("runs","running-14658.mp3");
        this.load.audio("jumps","cartoon-jump-6462.mp3");
        this.load.audio("dopen","door-open-46756.mp3");
        this.load.audio("death","086398_game-die-81356.mp3");
        this.load.audio("bgmusic","bgm.mp3");


    }

    create() {

        
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

        this.anims.create({
        key:'coins',
        frames:this.anims.generateFrameNames("tilemap_sheet",{frames:[151,152]}),
            frameRate:4,
            repeat:-1

        })





         // ...and pass to the next Scene
         this.scene.start("startscene");
    }
    

    // Never get here since a new scene is started in create()
    update() {
    }
}