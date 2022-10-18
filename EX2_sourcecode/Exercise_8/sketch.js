var mySound;
var playStopButton;
var sliderVolume;
var sliderRate;

var analyzer;

var rectSize;
var rectColour;
var rectSpeed;
var rectAngle;
let angle = 0;
let speechRec;
let lang;

let changeShape;

let bGround = 100;

function preload() {
  soundFormats('wav', 'mp3');
  mySound = loadSound('/sounds/Kalte_Ohren_(_Remix_).mp3');
}

function setup() {
  createCanvas(600, 600);
  background(180);
    rectSize = 0;

    var foo = new p5.Speech();
    lang = navigator.language || 'en-US';
    speechRec = new p5.SpeechRec(lang, parseResult);
    let continuous = true;
    let interimResults = false;
    speechRec.start(continuous, interimResults);
    
  playStopButton = createButton('play');
  playStopButton.position(20, 20);
  playStopButton.mousePressed(playStopSound);


  sliderVolume = createSlider(0, 1, 1, 0.01);
  sliderVolume.position(80,25);
  
    
    if (typeof Meyda === "undefined") {
        console.log("Meyda could not be found");
    } else {
        analyzer = Meyda.createMeydaAnalyzer ({
            "audioContext": getAudioContext(),
            "source": mySound,
            "bufferSize": 512,
            "featureExtractors": ["rms", "zcr", "spectralFlatness", "spectralKurtosis"],
            "callback": features => {
            console.log(features);
            rectSize = features.rms * 1000;
            rectSpeed = features.zcr;
            rectColour = features.spectralFlatness * 999;
            rectAngle = features.spectralKurtosis;
            }
        });
    }
}



function draw() {
  background(bGround);

  fill(0);
  text('volume:', 80,20);
  
  let vol = Math.pow(sliderVolume.value(), 3);                  
  mySound.setVolume(vol);
    
    push();
    fill(30, 30, 255, 200);
    rectMode(CENTER);
    rect(300, 300, rectSize);
    pop();
    
    push();
    
    if (changeShape = 2){
        fill(255,0,0);
        polygon(this.x, this.y, this.width, 7)
    }
    
    else if (changeShape == 1) {
        fill(0, rectColour, 0);
        ellipse(300,200,70,10);
    }
    
    else if (changeShape == 3) {
        fill (0, rectColour,0);
        triangle(300,270,70,10);
    }
    
    else if (changeShape == 4) {
        fill(0,rectColour,0);
        rect(300,270,70,10);
    }
    
    fill(0, rectColour, 0);
    rectMode(CENTER);
    rect(300, 200, 70, 100);
    pop();
    
    push();
    translate(width/2, height/2);
    rotate(angle);
    fill(rectAngle * 25, 0, 0);
    noStroke();
    rectMode(CENTER);
    square(100,0,50);
    pop();
    
    for (let a=0; a<radians(360); a+=radians(30)){
        push();
        translate(width/2, height/2);
        rotate(a);
        translate(0,200);
        rotate(-rectSpeed/100);
        rectMode(CENTER);
        fill(255,255,255)
        square(0,0,50);
        pop();
    }
    
    angle += radians(2);
    

}
// drawing a pentagon shape
function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function playStopSound() {
  if (mySound.isPlaying())
    {
      mySound.stop();
        analyzer.stop();
      //mySound.pause();
      playStopButton.html('play');
      background(180);
    } else {
      //mySound.play();
      mySound.loop();
        analyzer.start();
      playStopButton.html('stop');
    }  
}

function parseResult() {
        let speech = speechRec.resultString.split(' ').pop().toUpperCase();
    
    if(speechRec.resultValue) {
     if(speech=="WHITE"||speech=="RED"||speech=="ORANGE"||speech=="YELLOW"||speech=="GREEN"||speech=="BLUE"||speech=="PURPLE"||speech=="PINK") {
            bGround = speechRec.resultString;
            console.log(speechRec.resultString);
        }

        else if(speech="CIRCLE") {
            changeShape = 1;
            }
        else if(speech="PENTAGON") {
            changeShape = 2;
            }
        else if(speech="TRIANGLE") {
            changeShape = 3;
            }
        else if(speech="SQUARE") {
            changeShape = 4;
            }
        }
}
