(function() {
  'use strict';
  /*jslint bitwise: true */

  var playerA
    , playerB
    , playerAStartPoint = {}
    , playerBStartPoint = {}
    , cursors
    , spacebar
    , esc
    , stars
    , enemies
    , map
    , layer
    , foregroundLayer
    , objectLayer
    //labels
    // , fpsLabel
    // , scoreLabel
    // , starsLabel
    , timerLabel
    , timer = 0
    , score = 0
    , restartSfx
    , starSfx
    , jumpSfx;
    // , gameover = false;

  function Game() {
    
  }

  Game.prototype = {

    preload: function () {
      
    },

    create: function () {
      timer = score = 0;
      this.game.time.advancedTiming = true;

      this.physics.startSystem(Phaser.Physics.ARCADE);
   
      this.add.sprite(0, 0, 'background').fixedToCamera = true;

      map = this.add.tilemap('level');
      map.addTilesetImage('tileset');

      layer = map.createLayer('Tile Layer 1');
      
      objectLayer = map.objects['Object Layer 1'];
      layer.resizeWorld();
      map.setCollisionBetween(2, 200);

      map.setTileIndexCallback(12, this.onEnemyHit, layer);
      map.setTileIndexCallback(13, this.onEnemyHit, layer);
      map.setTileIndexCallback(14, this.onEnemyHit, layer);
      map.setTileIndexCallback(7,  this.onPlayerFinish, layer);

      enemies = this.add.group();
      enemies.enableBody = true;

      stars = this.add.group();
      stars.enableBody = true;

      objectLayer.forEach(function(element/*, index, array*/){

        if (element.name === 'player_start'){

          if (element.properties.player === 'a'){
            playerAStartPoint.x = element.x;
            playerAStartPoint.y = element.y;
          } else 

          if (element.properties.player === 'b'){
            playerBStartPoint.x = element.x;
            playerBStartPoint.y = element.y;

          } else {
            throw 'ERROR';
          }

        } else

        if (element.name === 'ball'){
          var ball = enemies.create(element.x , element.y + element.height, 'ball');
          ball.anchor.setTo(0.5, 1.0);
          ball.body.gravity.y = 64;
   
          ball.body.bounce.y = 1.0;
        } else

        if (element.name === 'saw'){

          var saw = enemies.create(element.x + 16, element.y + 16, 'saw');
          saw.anchor.setTo(0.5, 0.5);
          saw.update = function(){
            this.angle += 32; 
          };
        } else

        if (element.name === 'anvil'){

          var anvil = enemies.create(element.x + 16, -100, 'anvil');
          anvil.anchor.setTo(0.5, 0.5);
          this.game.add.tween(anvil).to( { y: 500 }, 3000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);
        } else

        if (element.name === 'star'){
          var star = stars.create(element.x + 16, element.y + 16, 'star');
          star.anchor.setTo(0.5, 0.5);
        } else {
          throw 'ERROR';
        }

        

      }.bind(this));
      // layer.debug = true;



      // PLAYER A
      playerA = this.add.sprite(playerAStartPoint.x, playerAStartPoint.y, 'player');
      playerA.anchor.setTo(0.5, 0.5);
      this.physics.arcade.enable(playerA);
   
      playerA.body.gravity.y = 300;
      playerA.body.collideWorldBounds = true;
   
      playerA.animations.add('walk', [1, 2], 10, true);

       // PLAYER B
      playerB = this.add.sprite(playerBStartPoint.x, playerBStartPoint.y, 'player');
      playerB.anchor.setTo(0.5, 0.5);
      this.physics.arcade.enable(playerB);
   
      playerB.body.gravity.y = 300;
      playerB.body.collideWorldBounds = true;
   
      playerB.animations.add('walk', [1, 2], 10, true);

      playerA.active = true;
      playerB.active = true;

      playerA.jumps = 2;
      playerB.jumps = 2;

      playerA.done = false;
      playerB.done = false;

      foregroundLayer = map.createLayer('Foreground');

      cursors = this.input.keyboard.createCursorKeys();
      spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      esc = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
      this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.SPACEBAR,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.ESC,
        Phaser.Keyboard.Z,
        Phaser.Keyboard.X
        ]);

      this.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.pauseGame, this);

      // fpsLabel = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
      // fpsLabel.fixedToCamera = true;

      // scoreLabel = this.add.text(64, 64, 'Score: 0', { fontSize: '32px', fill: '#000' });
      // scoreLabel.fixedToCamera = true;

      // starsLabel = this.add.text(128, 128, 'Stars: 0', { fontSize: '32px', fill: '#000' });
      // starsLabel.fixedToCamera = true;

      timerLabel = this.game.add.bitmapText(this.game.width / 2 - 100, this.game.height / 2 - 20, 'font','', 32);
      timerLabel.fixedToCamera = true;
      

      //CAMERA
      this.camera.follow(playerA);

      //SFX
      restartSfx = this.add.audio('restart_sfx');
      jumpSfx    = this.add.audio('jump_sfx');
      starSfx    = this.add.audio('star_sfx');

    },

    update: function () {

      // fpsLabel.text = this.game.time.fps;

      this.updateTimer();

      if (playerA.x >= this.camera.x + this.camera.width){
        if (playerA.done === false){ 
          this.camera.follow(playerA); 
        }
      }

      if (playerB.x >= this.camera.x + this.camera.width){
        if (playerB.done === false){
          this.camera.follow(playerB);
        }
      }

      if (playerA.x < this.camera.x || playerA.x > this.camera.x + this.camera.width){
        playerA.active = false;
      } else {
        playerA.active = true;
      }

      

      this.physics.arcade.collide(stars, layer);
      this.physics.arcade.collide(enemies, layer);

      this.physics.arcade.collide(playerA, layer);
      this.physics.arcade.collide(playerB, layer);

      this.physics.arcade.overlap(playerA, enemies, this.onEnemyHit, this.checkCollision, this);
      this.physics.arcade.overlap(playerB, enemies, this.onEnemyHit, this.checkCollision, this);

      this.physics.arcade.overlap(playerA, stars, this.collectStar, null, this);
      this.physics.arcade.overlap(playerB, stars, this.collectStar, null, this);

      this.updatePlayer(playerA);
      this.updatePlayer(playerB);
      
      if (playerA.done === true && playerB.done === true){

        if(this.game.device.localStorage){
          if (localStorage.highScore){
            if (localStorage.highScore > timer){
              localStorage.highScore = timer;    
            }  
          } else {
            localStorage.highScore = timer;
          }
          
        }

       this.game.state.start('menu');
      }
      
    },

    updateTimer: function(){

      timer += this.game.time.elapsed;

      var millis = (timer % 1000) | 0;
      if (millis <= 999) { millis = ('00'+millis).slice(-3);  }

      var secs = (timer / 1000 % 60) | 0;
      if (secs <= 99) { secs = ('0'+secs).slice(-2);  }

      var mins = (timer / (1000 * 60) % 60) | 0;
      if (mins <= 99) { mins = ('0'+mins).slice(-2);  }

      timerLabel.text =  mins + ':' + secs + ':' + millis;

    },

    updatePlayer: function(player){

      if (player.done === true){
        return;
      }

      player.body.velocity.x = 0;

      

      if (player.body.blocked.down){
        player.jumps = 2;
      }
   
      if (cursors.left.isDown)
      {
          if (player.active === true){
            player.body.velocity.x = -150;
            player.scale.x = -1;
            player.animations.play('walk');
          }

      }
      else if (cursors.right.isDown)
      {
          if (player.active === true){
          player.body.velocity.x = 150;
          player.scale.x = 1;
          player.animations.play('walk');
        }
      }
      else
      {
          if (player.active === true){
          player.animations.stop();
          player.frame = 0;
        }
      }
      
      if ((this.input.keyboard.justPressed(Phaser.Keyboard.X, 10) || this.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR, 10)) && player.jumps > 0)
      {
        if (player.active === true){
          if (player.jumps === 2){
            player.body.velocity.y = -280;
            jumpSfx.play();
          } else if (player.jumps === 1){
            player.body.velocity.y = -160;
            jumpSfx.play();
          }
          
          player.jumps = player.jumps - 1;
        }
      }

    },

    collectStar: function(player, star){

      // score += 1;
      // scoreLabel.text = 'Score: ' + score;

      star.kill();
      starSfx.play();
    },

    reduceBoundingBox: function(body){

      var boundingBox    = new PIXI.Rectangle();

      boundingBox.x      = body.x + 16;
      boundingBox.y      = body.y + 16; 
      boundingBox.width  = body.width / 3;
      boundingBox.height = body.height / 3;

      return boundingBox;

    },

    checkCollision: function(player, enemy){

      var boundsPlayer = this.reduceBoundingBox(player.body);
      var boundsEnemy    = new PIXI.Rectangle();

      boundsEnemy.x      = enemy.body.x;
      boundsEnemy.y      = enemy.body.y; 
      boundsEnemy.width  = enemy.body.width;
      boundsEnemy.height = enemy.body.height;

      return Phaser.Rectangle.intersects(boundsPlayer, boundsEnemy);

    },

    onEnemyHit: function(player){

      if (player === playerA || player === playerB){

        restartSfx.play();

        timer = score = 0;

        stars.forEachDead(function(star){
          star.revive();
        }, this);

        playerA.reset(playerAStartPoint.x, playerAStartPoint.y);
        playerB.reset(playerBStartPoint.x, playerBStartPoint.y);
      }
    },

    onPlayerFinish: function(player){

      if (player === playerA && player.done !== true){

        playerA.done = true;
        this.game.camera.follow(playerB);

      } else if (player === playerB && player.done !== true){

        playerB.done = true;
        this.game.camera.follow(playerA);

      }

    },

    pauseGame: function(){

      this.game.paused = !this.game.paused;

      if (this.game.paused){
        timerLabel.text = 'PAUSE';
      }

    },

    render: function(){
      // this.game.debug.body(playerA);
      // this.game.debug.body(playerB);

      // this.game.debug.geom(this.reduceBoundingBox(playerA.body));
      // this.game.debug.geom(this.reduceBoundingBox(playerB.body));
    }

  };

  window['ld48'] = window['ld48'] || {};
  window['ld48'].Game = Game;

}());