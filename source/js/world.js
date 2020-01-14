

var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        // imports background
        this.load.image('sky', 'assets/sky.png');
        
        // enemy spritesheets
        this.load.spritesheet("merc", "assets/MercSS.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("archer", "assets/ArcherSS.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("fire", "assets/fire.png", { frameWidth: 16, frameHeight: 16 });
        
        // character spritesheets
        this.load.spritesheet('player', 'assets/PlayerSS.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('flavia', 'assets/FlaviaSS.png', { frameWidth: 32, frameHeight: 32 });
    },

    create: function ()
    {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
});

var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {
        // Adds background
        this.add.image(400, 300, 'sky');
        
        // Player Animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7}),
            frameRate: 10,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });
        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11}),
            frameRate: 10,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 19}),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15}),
            frameRate: 10,
            yoyo: true,
            repeat: -1
        });
        // Merc Animations
        this.anims.create({
            key: 'idleMerc',
            frames: this.anims.generateFrameNumbers('merc', { start: 0, end: 3 }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 100, 'player', 6);
        
        // don't go out of the map
        this.player.setCollideWorldBounds(true);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    
        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
                
        this.ghost = this.physics.add.sprite(100, 100, 'merc', 1);
        this.ghost.anims.play('idleMerc', true);
        // add collider
        this.physics.add.overlap(this.player, this.ghost, this.onMeetEnemy, false, this);
        // we listen for 'wake' event
        this.sys.events.on('wake', this.wake, this);
    },
    wake: function() {
        this.cursors.left.reset();
        this.cursors.right.reset();
        this.cursors.up.reset();
        this.cursors.down.reset();
    },
    onMeetEnemy: function(player, zone) {        
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        // shake the world
        this.cameras.main.shake(300);
        
        this.input.stopPropagation();
        // start battle 
        this.scene.switch('BattleScene');                
    },
    update: function (time, delta)
    {             
        this.player.body.setVelocity(0);
        
        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }
        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
        }        

        // For Animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.play('idle', true);
        }
    }
    
});

