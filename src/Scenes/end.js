class endscene extends Phaser.Scene {
    constructor(){
        super("endscene");
        this.my={spirit:{}};
    }
    preload(){
        this.load.setPath("./assets/");
        this.load.image("end", "ending.png");
        this.load.audio("endm","end.mp3")
      //  this.load.bitmapFont("minecraft", "dsd.png", "dsd.fnt");

    }
    create(){
        this.endmusic = this.sound.add('endm', { loop: true, volume: 0.5 });
        this.endmusic.play();
        this.startkey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.map=this.add.image(700,400,"end");

        this.thanks=this.add.text(250,200,"Mission complete — now for dessert!").setScale(3);
        this.make=this.add.text(250,300,"make by Enming Li,Feng lijin").setScale(3);


        this.starttext=this.add.text(300,400,"click here to restart",{
            font:"50px minecraft",
            fill:'#ffffff'
        }).setScale(2);
        
        this.starttext.setInteractive();
        this.starttext.on('pointerover', () => {
            this.starttext.setScale(1.2); 
            this.starttext.setColor('#ffff00'); 
        });

        this.starttext.on('pointerout', () => {
            this.starttext.setScale(2);
            this.starttext.setColor('#ffffff'); 
        });

        this.starttext.on('pointerdown', () => {
            this.endmusic.stop();
           this.scene.start("startscene"); 
        });
    }
    update(){
       
            if (Phaser.Input.Keyboard.JustDown(this.startkey)) {
                //this.scene.start("firstwave");
            }
    
            
        }



}