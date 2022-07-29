const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var corda, corda2, fruta, solo;
var fruta_con, fruta_con2;
var coelho;

var fundo, fruta_img, coelho_img;

var botao, botao2,botao_mudo;
var piscar, comer, triste;

var musica, som_corte, som_triste, som_mastigar, som_ar;

function preload() {
  fundo = loadImage('background.png');
  fruta_img = loadImage('melon.png');
  coelho_img = loadImage('Rabbit-01.png');

  musica = loadSound('sound1.mp3');
  som_triste = loadSound("sad.wav")
  som_corte = loadSound('rope_cut.mp3');
  som_mastigar = loadSound('eating_sound.mp3');
  som_ar = loadSound('air.wav');

  piscar = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  comer = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  triste = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");


  piscar.playing = true;
  comer.playing = true;
  triste.playing = true;
  triste.looping = false;
  comer.looping = false;
}

function setup() {
  createCanvas(500, 700);
  frameRate(80);

  musica.play();
  musica.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //botão 1
  botao = createImg('cut_btn.png');
  botao.position(180, 90);
  botao.size(50, 50);
  botao.mouseClicked(cair);

  //botão 2
  botao2 = createImg('cut_btn.png');
  botao2.position(390, 90);
  botao2.size(50, 50);
  botao2.mouseClicked(cair2);

  corda = new Corda(7, {x: 200,y: 90});
  corda2 = new Corda(7, {x: 400,y: 90});


  botao_mudo = createImg('mute.png');
  botao_mudo.position(width - 50, 20);
  botao_mudo.size(50, 50);
  botao_mudo.mouseClicked(mutar);

  solo = new Solo(250, height, width, 20);
  piscar.frameDelay = 20;
  comer.frameDelay = 20;

  coelho = createSprite(120, 620, 100, 100);
  coelho.scale = 0.2;

  coelho.addAnimation('blinking', piscar);
  coelho.addAnimation('eating', comer);
  coelho.addAnimation('crying', triste);
  coelho.changeAnimation('blinking');


  fruta = Bodies.circle(300, 300, 20);
  Matter.Composite.add(corda.body, fruta);

  fruta_con = new Link(corda, fruta);
  fruta_con2 = new Link(corda2, fruta);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

}

function draw() {
  background(51);
  image(fundo, 0, 0, width, height);

  push();
  imageMode(CENTER);
  if (fruta != null) {
    image(fruta_img, fruta.position.x, fruta.position.y, 70, 70);
  }
  pop();

  corda.mostrar();
  corda2.mostrar();

  Engine.update(engine);
  solo.mostrar();

  drawSprites();

  if (colisao(fruta, coelho) == true) {
    World.remove(engine.world, fruta);
    fruta = null;
    coelho.changeAnimation('eating');
    som_mastigar.play();
  }

  if (fruta != null && fruta.position.y >= 650) {
    coelho.changeAnimation('crying');
    musica.stop();
    som_triste.play();
    fruta = null;
  }

}

function cair() {
  som_corte.play();
  corda.cortar();
  fruta_con.soltar();
  fruta_con = null;
}

function cair2() {
  som_corte.play();
  corda2.cortar();
  fruta_con2.soltar();
  fruta_con2 = null;
}

function colisao(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      return true;
    } else {
      return false;
    }
  }
}


function mutar() {
  if (musica.isPlaying()) {
    musica.stop();
  } else {
    musica.play();
  }
}