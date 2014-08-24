(function () {
  'use strict';

  function Boot() {}

  Boot.prototype = {
    
    preload: function () {
      this.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
    },

    create: function () {
      this.game.input.maxPointers = 1;
      this.game.antialias = false;

      if (this.game.device.desktop) {
        this.game.scale.pageAlignHorizontally = true;
      } else {
        this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.minWidth =  426;
        this.game.scale.minHeight = 240;
        this.game.scale.maxWidth = 852;
        this.game.scale.maxHeight = 480;
        this.game.scale.forceLandscape = true;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.setScreenSize(true);
      }
      this.game.state.start('preloader');
    }
  };

  window['ld48'] = window['ld48'] || {};
  window['ld48'].Boot = Boot;

}());