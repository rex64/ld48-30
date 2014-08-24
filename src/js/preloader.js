(function() {
  'use strict';

  function Preloader() {
    this.percentageLabel = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {

      this.percentageLabel = this.add.bitmapText(this.game.width / 2, this.game.height / 2, 'font', '0%' );
      this.percentageLabel.align = 'center';
      this.percentageLabel.x = this.game.width / 2 - this.percentageLabel.textWidth / 2;

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

      this.load.image('background', 'assets/background.png');
      this.load.image('star', 'assets/star.png');
      this.load.spritesheet('player', 'assets/player.png', 49, 40);
      this.load.image('ball', 'assets/ball.png');
      this.load.image('saw', 'assets/saw.png');
      this.load.image('anvil', 'assets/anvil.png');

      this.load.image('tileset', 'assets/tileset.png');
      this.load.tilemap('level', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);

      this.load.image('black', 'assets/black.png');

      this.load.audio('intro_sfx', 'assets/intro.wav');
      this.load.audio('jump_sfx', 'assets/jump.wav');
      this.load.audio('restart_sfx', 'assets/restart.wav');
      this.load.audio('star_sfx', 'assets/star.wav');


      this.load.onFileComplete.add(this.fileLoaded, this);
    },

    create: function () {

    },

    update: function () {

      if (!!this.ready) {
        this.game.state.start('menu');
      }

    },

    fileLoaded: function (progress) {
      this.percentageLabel.text = progress + '%';
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['ld48'] = window['ld48'] || {};
  window['ld48'].Preloader = Preloader;

}());