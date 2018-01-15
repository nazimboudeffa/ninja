var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render:render});
//320, 240
function preload() {
  game.load.tilemap('objects', 'assets/level-1-1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/Tileset.png');
  //game.load.spritesheet('ninja', 'assets/Spritesheet.png', 140, 80, 25);
  game.load.atlasJSONHash('ninja', 'assets/Spritesheet.png', 'assets/sprites.json');
  game.load.image("background", "assets/0.png");
  game.load.image("smb-1-1", "assets/mario-1-1.png");
  game.load.image('shuriken', 'assets/shuriken.png');
  game.load.spritesheet('sprite', 'assets/1.png', 16, 16);
}

var map;
var layer1, layer2;
var cursors;
var result;
var shuriken;
var enemy;
var runButton;
var fireButton;
var slashButton;

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
  game.stage.backgroundColor = '#000099';
  //game.add.tileSprite(0, 0, 768, 432, 'background');
  //game.add.tileSprite(0, 0, 6784, 512, 'smb-1-1');
  map = game.add.tilemap('objects');
  map.addTilesetImage('Tileset', 'tiles');

  layer1 = map.createLayer('Calque de Tile 1');
  layer1.resizeWorld();
  layer1.wrap = true;

  layer2 = map.createLayer('Calque 2');

  game.physics.arcade.enable(layer2);
  //map.setCollisionBetween(0, 255, true, layer2);
  map.setCollisionBetween(0, 4095, true, layer2);//because it's an 8 px map

  ninja.sprite = game.add.sprite(140, 360, 'ninja');
  //ninja.sprite.scale.setTo(0.5, 0.5);
  ninja.sprite.anchor.x=0.5;
  ninja.sprite.anchor.y=0.5;

  enemy = game.add.sprite(1000, 405, 'sprite');

  game.physics.enable(ninja.sprite);
  game.physics.arcade.gravity.y = 700;
  ninja.sprite.body.bounce.y = 0;
  ninja.sprite.body.linearDamping = 1;
  ninja.sprite.body.collideWorldBounds = true;

  //ninja.sprite.animations.add('idle', [0, 1, 2, 3], 10, true);
  ninja.sprite.animations.add('idle', ['sprite1', 'sprite2', 'sprite3', 'sprite4'], 10, true);
  //ninja.sprite.animations.add('jump', [5], 10, true);
  ninja.sprite.animations.add('jump', ['sprite5'], 10, true);
  //ninja.sprite.animations.add('left', [10, 11, 12], 10, true);
  ninja.sprite.animations.add('left', ['sprite6', 'sprite7', 'sprite8'], 10, true);
  //ninja.sprite.animations.add('throw', [15, 16, 17, 18, 19], 10, true);
  ninja.sprite.animations.add('throw', ['sprite9', 'sprite10', 'sprite11', 'sprite12', 'sprite13'], 10, true);
  //ninja.sprite.animations.add('slash', [20, 21, 22, 23], 10, true);
  ninja.sprite.animations.add('slash', ['sprite14', 'sprite15', 'sprite17', 'sprite16'], 10, true);

  ninja.sprite.body.fixedRotation = true;

  game.camera.follow(ninja.sprite);

  shuriken = game.add.weapon( 1, 'shuriken');
  shuriken.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  shuriken.bulletSpeed = 500;

  shuriken.trackSprite(ninja.sprite, 14, 0, false);



  cursors = game.input.keyboard.createCursorKeys();
  runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  slashButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
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
  } else if (cursors.up.justDown){
    if(ninja.sprite.body.onFloor()){
      ninja.sprite.body.velocity.y = -380;//old is 310 but it's not suffisant
      ninja.sprite.animations.play('jump', 10, true);
      ninja.doNothing = false;
    }
  }

  if(fireButton.isDown){
    ninja.sprite.animations.play('throw', 12, true);
    if (ninja.direction == 'right'){
      shuriken.fireAngle = Phaser.ANGLE_RIGHT;
    } else {
      shuriken.fireAngle = Phaser.ANGLE_LEFT;
    }
    shuriken.fire();
    ninja.doNothing = false;
  }
  if(slashButton.isDown){
    ninja.sprite.animations.play('slash', 10, true);
    ninja.doNothing = false;
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
