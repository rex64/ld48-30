(function() {
  'use strict';
  /*jslint bitwise: true */

  function Menu() {
    this.titleTxt = null;
    this.subTitleTxt = null;
    this.timerTxt = null;
    this.pressTxt = null;
    this.creditsTxt = null;
    this.timer    = null;
    this.sfc      = null;
  }

  Menu.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 3;

      if(this.game.device.localStorage){
         if (localStorage.highScore){
           this.timer = localStorage.highScore;
         }
          
      }

      this.titleTxt = this.add.bitmapText(x, y - 80, 'font', 'YGGDRASIL', 48);
      this.titleTxt.align = 'center';
      this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;
      y = y + this.titleTxt.height + 5;

      this.subTitleTxt = this.add.bitmapText(x, y - 70, 'font', 'a LD48#30 Game', 18 );
      this.subTitleTxt.align = 'center';
      this.subTitleTxt.x = this.game.width / 2 - this.subTitleTxt.textWidth / 2;
      y = y + this.subTitleTxt.height + 5;

      if (this.timer){

        this.timerTxt = this.add.bitmapText(x, y-40, 'font', this.calcScore(), 24 );
        this.timerTxt.align = 'center';
        this.timerTxt.x = this.game.width / 2 - this.timerTxt.textWidth / 2;

        y = y + this.timerTxt.height + 5;

      }

      this.pressTxt = this.add.bitmapText(x, y, 'font', 'PRESS SPACEBAR', 24);
      this.pressTxt.align = 'center';
      this.pressTxt.x = this.game.width / 2 - this.pressTxt.textWidth / 2;

      y = y + this.pressTxt.height + 5;

      this.creditsTxt = this.add.bitmapText(x, y+60, 'font', 'created by @rex64_', 18 );
      this.creditsTxt.align = 'center';
      this.creditsTxt.x = this.game.width / 2 - this.subTitleTxt.textWidth / 2;

      this.add.sprite(200, 100, 'player');
      this.add.sprite(640, 100, 'player').scale.x = -1;

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

      this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.startGame, this);

      this.sfx = this.add.audio('intro_sfx');
      this.sfx.play();
    },

    update: function () {

    },

    startGame: function () {
      this.game.state.start('game');
    },

    calcScore: function(){

      var millis = (this.timer % 1000) | 0;
      if (millis <= 999) { millis = ('00'+millis).slice(-3);  }

      var secs = (this.timer / 1000 % 60) | 0;
      if (secs <= 99) { secs = ('0'+secs).slice(-2);  }

      var mins = (this.timer / (1000 * 60) % 60) | 0;
      if (mins <= 99) { mins = ('0'+mins).slice(-2);  }

      return 'Hi-Score: ' + mins + ':' + secs + ':' + millis;

    }
  };

  window['ld48'] = window['ld48'] || {};
  window['ld48'].Menu = Menu;

}());