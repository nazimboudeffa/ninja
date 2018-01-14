var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render:render});
//320, 240
function preload() {
  game.load.tilemap('objects', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/Tileset.png');
  game.load.spritesheet('ninja', 'assets/Spritesheet.png', 128, 104, 11);
  game.load.image("background", "assets/0.png");
}

var map;
var layer;
var cursors;
var jumpButton;
var runButton;
var result;

var ninja = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
};

function init() {
  game.scale.scaleMode = Phaser.scaleManager.RESIZE;
  //game.scale.pageAlignVertically = true;
  //game.scale.pageAlignHorizontally = true;
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#5C94FC';
  game.add.tileSprite(0, 0, 768, 432, 'background');

  map = game.add.tilemap('objects');
  map.addTilesetImage('Tileset', 'tiles');
  layer = map.createLayer('Calque de Tile 1');
  layer.resizeWorld();
  layer.wrap = true;
  map.setCollisionByIndex(35);
  map.setCollisionByIndex(54);
  map.setCollisionByIndex(70);
  map.setCollisionByIndex(86);
  map.setCollisionByIndex(109);
  map.setCollisionByIndex(110);
  map.setCollisionByIndex(126);
  map.setCollisionByIndex(142);
  map.setCollisionByIndex(193);
  map.setCollisionByIndex(177);
  map.setCollisionByIndex(162);
  map.setCollisionByIndex(167);

  ninja.sprite = game.add.sprite(300, 200, 'ninja');
  ninja.sprite.scale.setTo(0.47, 0.47);
  ninja.sprite.anchor.x=0.5;
  ninja.sprite.anchor.y=0.5;

  game.physics.enable(ninja.sprite);
  game.physics.arcade.gravity.y = 700;
  ninja.sprite.body.bounce.y = 0;
  ninja.sprite.body.linearDamping = 1;
  ninja.sprite.body.collideWorldBounds = true;

  ninja.sprite.animations.add('idle', [0, 1, 2, 3], 10, true);
  ninja.sprite.animations.add('jump', [4], 10, true);
  ninja.sprite.animations.add('left', [8, 9, 10], 10, true);

  ninja.sprite.body.fixedRotation = true;

  game.camera.follow(ninja.sprite);
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
}


function update(){
  game.physics.arcade.collide(ninja.sprite, layer);
  ninja.doNothing = true;
  if (cursors.left.isDown){
    if(ninja.direction!='left'){
      ninja.sprite.scale.x *= -1;
      ninja.direction = 'left';
    }
    if(ninja.sprite.body.velocity.x==0 ||
      (ninja.sprite.animations.currentAnim.name!='left' && ninja.sprite.body.onFloor())){
      ninja.sprite.animations.play('left', 10, true);
    }

    ninja.sprite.body.velocity.x -= 5;
    if(runButton.isDown){
      if(ninja.sprite.body.velocity.x<-200){
        ninja.sprite.body.velocity.x = -200;
      }
    }else{
      if(ninja.sprite.body.velocity.x<-120){
        ninja.sprite.body.velocity.x = -120;
      }
    }
    ninja.doNothing = false;
  }else if (cursors.right.isDown){
    if(ninja.direction!='right'){
      ninja.sprite.scale.x *= -1;
      ninja.direction = 'right';
    }
    if(ninja.sprite.body.velocity.x==0 ||
      (ninja.sprite.animations.currentAnim.name!='left' && ninja.sprite.body.onFloor())){
      ninja.sprite.animations.play('left', 10, true);
    }
    ninja.sprite.body.velocity.x += 5;
    if(runButton.isDown){
      if(ninja.sprite.body.velocity.x>200){
        ninja.sprite.body.velocity.x = 200;
      }
    }else{
      if(ninja.sprite.body.velocity.x>120){
        ninja.sprite.body.velocity.x = 120;
      }
    }
    ninja.doNothing = false;
  }
  if (cursors.up.justDown){
    if(ninja.sprite.body.onFloor()){
      ninja.sprite.body.velocity.y = -310;
      ninja.sprite.animations.play('jump', 10, true);
      ninja.doNothing = false;
    }
  }
  if(ninja.doNothing){
    if(ninja.sprite.body.velocity.x>10){
      ninja.sprite.body.velocity.x -= 10;
    }else if(ninja.sprite.body.velocity.x<-10){
      ninja.sprite.body.velocity.x += 10;
    }else{
      ninja.sprite.body.velocity.x = 0;
    }
    if(ninja.sprite.body.onFloor()){
      ninja.sprite.animations.play('idle', 10, true);
    }
  }

}

function render() {
  //game.debug.bodyInfo(ninja.sprite, 32, 32);
}
