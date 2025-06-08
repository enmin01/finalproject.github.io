class Startscene extends Phaser.Scene {
    constructor(){
        super("startscene");
        this.my={spirit:{}};
    }
    preload(){
        this.load.setPath("./assets/");
        this.load.image("open", "open.png");
      //  this.load.bitmapFont("minecraft", "dsd.png", "dsd.fnt");

    }
    create(){
        this.startkey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.map=this.add.image(700,400,"open");
        this.add.text(500,200,"ken's adventure").setScale(4);
        document.getElementById('description').innerHTML = '<h2>Start</h2><br>click start // f to dash// you could double jump // wall slide  '
        this.starttext=this.add.text(700,400,"start",{
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
           this.scene.start("platformerScene"); 
        });
    }
    update(){
       
            if (Phaser.Input.Keyboard.JustDown(this.startkey)) {
                this.scene.start("platformerScene");
            }
    
            
        }



}