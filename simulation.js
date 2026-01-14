let rooms = [0.05, 0.15, 0.4, 0.1, 0.15];
let n_rooms = rooms.length;
let steps = 300;
let positions = [];
let step = 0;
let running = false;
let position = 2; // start in middle room

function precomputePositions() {
  positions = [];
  let current = position;
  for(let i = 0; i < steps; i++){
    let proposal = current + (Math.random() < 0.5 ? -1 : 1);
    proposal = Math.max(0, Math.min(n_rooms - 1, proposal));
    let accept_ratio = rooms[proposal] / rooms[current];
    if(Math.random() < Math.min(1, accept_ratio)){
      current = proposal;
    }
    positions.push(current);
  }
}

precomputePositions();

function setup() {
  createCanvas(700, 400);
  frameRate(20);
  drawFrame(0);
}

function draw() {
  if(running && step < steps){
    drawFrame(step);
    step++;
    document.getElementById("stepSlider").value = step;
  }
}

// Draw animation + wiggle
function drawFrame(frame){
  background(255);

  let roomWidth = width / n_rooms;

  // Draw rooms as light gray bars
  for(let i = 0; i < n_rooms; i++){
    fill(230);
    stroke(180);
    rect(i*roomWidth, 0, roomWidth, height);
  }

  // Draw wiggle trace at bottom
  stroke('red');
  strokeWeight(2);
  noFill();
  beginShape();
  for(let i = 0; i <= frame; i++){
    let x = map(i, 0, steps-1, 0, width);
    let y = map(positions[i], 0, n_rooms-1, height-50, 50); // wiggle vertically
    vertex(x, y);
  }
  endShape();

  // Draw current position as red dot
  fill('blue');
  noStroke();
  let px = map(frame, 0, steps-1, 0, width);
  let py = map(positions[frame], 0, n_rooms-1, height-50, 50);
  ellipse(px, py, 12, 12);
}

// Buttons
function play(){ running = true; }
function pause(){ running = false; }
function reset(){ step = 0; drawFrame(0); document.getElementById("stepSlider").value = 0; }

// Slider
let slider = document.getElementById("stepSlider");
slider.oninput = function(){
  step = parseInt(this.value);
  drawFrame(step);
}

