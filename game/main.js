var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render:render});
//320, 240
function preload() {
  game.load.tilemap('objects', 'assets/level1-1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/Tileset.png');
  game.load.spritesheet('ninja', 'assets/Spritesheet.png', 80, 80, 20);
  game.load.image("background", "assets/0.png");
}

var map;
var layer1, layer2;
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
  game.scale.scaleMode = Phaser.scaleManager.SOW_ALL;
  game.scale.pageAlignVertically = true;
  game.scale.pageAlignHorizontally = true;
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#5C94FC';
  game.add.tileSprite(0, 0, 768, 432, 'background');

  map = game.add.tilemap('objects');
  map.addTilesetImage('Tileset', 'tiles');

  layer1 = map.createLayer('Calque de Tile 1');
  layer1.resizeWorld();
  layer1.wrap = true;

  layer2 = map.createLayer('Calque 2');

  game.physics.arcade.enable(layer2);
  map.setCollisionBetween(0, 255, true, layer2);

  ninja.sprite = game.add.sprite(180, 405, 'ninja');
  ninja.sprite.scale.setTo(0.47, 0.47);
  ninja.sprite.anchor.x=0.5;
  ninja.sprite.anchor.y=0.5;

  game.physics.enable(ninja.sprite);
  game.physics.arcade.gravity.y = 700;
  ninja.sprite.body.bounce.y = 0;
  ninja.sprite.body.linearDamping = 1;
  ninja.sprite.body.collideWorldBounds = true;

  ninja.sprite.animations.add('idle', [0, 1, 2, 3], 10, true);
  ninja.sprite.animations.add('jump', [5], 10, true);
  ninja.sprite.animations.add('left', [10, 11, 12], 10, true);

  ninja.sprite.body.fixedRotation = true;

  game.camera.follow(ninja.sprite);
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
}


function update(){
  game.physics.arcade.collide(ninja.sprite, layer2);

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
