let video;
let handpose;
let predictions = [];

let balloon;
let balloonImg;

function preload() {
  balloonImg = loadImage('images/balon.png');
}

function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelLoaded);
  handpose.on('predict', function(results) {
    predictions = results;
  });

  video.hide();

  createBalloon();
}

function modelLoaded() {
  console.log('Model Loaded!');
}

function createBalloon() {
  let margin = 50; // Marge van de randen van de canvas, zodat de balon niet te dicht bij de randen komt.
  let x = random(margin, width - margin);
  let y = random(margin, height - margin);

  balloon = {
    x: x,
    y: y,
    size: 100,
    popped: false
  };
}

function draw() {
  image(video, 0, 0, width, height);

  for (let i = 0; i < predictions.length; i++) {
    let hand = predictions[i];
    let indexFinger = hand.annotations.indexFinger[3];

    let d = dist(indexFinger[0], indexFinger[1], balloon.x + balloon.size / 2, balloon.y + balloon.size / 2);
    
    if (d < balloon.size / 2 && !balloon.popped) {
      balloon.popped = true;
      console.log('Balloon Popped!');
      setTimeout(createBalloon, 1000); 
    }
  }

  if (!balloon.popped) {
    image(balloonImg, balloon.x, balloon.y, balloon.size, balloon.size);
  }
}