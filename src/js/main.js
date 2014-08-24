window.onload = function () {
  'use strict';

  var game
    , ns = window['ld48'];

  game = new Phaser.Game(852, 480, Phaser.AUTO, 'ld48-game');
  game.data = {'level': 1};
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);

  game.state.start('boot');
};