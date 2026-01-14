let rooms = [0.05, 0.15, 0.4, 0.1, 0.15];
let n_rooms = rooms.length;
let steps = 300;
let positions = [];
let step = 0;
let running = false;
let position = 2; // start in middle room

// Precompute positions using MCMC logic
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
  createCanvas(600, 300);
  frameRate(10);
  drawFrame(0);
}

function draw() {
  if(running && step < steps){
    drawFrame(step);
    step++;
    document.getElementById("stepSlider").value = step;
  }
}

function drawFrame(frame){
  background(255);

  // Draw rooms as bars
  let barWidth = width / n_rooms;
  for(let i = 0; i < n_rooms; i++){
    fill('lightgray');
    stroke(0);
    rect(i*barWidth, height - rooms[i]*height, barWidth-2, rooms[i]*height);
  }

  // Draw person
  fill('red');
  noStroke();
  let px = positions[frame]*barWidth + barWidth/2;
  let py = height - rooms[positions[frame]]*height - 10;
  ellipse(px, py, 20, 20);
}

// Buttons
function play(){ running = true; }
function pause(){ running = false; }
function reset(){ step = 0; drawFrame(0); document.getElementById("stepSlider").value = 0; }

// Optional: link slider
let slider = document.getElementById("stepSlider");
slider.oninput = function(){
  step = parseInt(this.value);
  drawFrame(step);
}
