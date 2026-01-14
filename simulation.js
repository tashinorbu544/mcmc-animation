let people = [];
let steps = 300;
let running = false;
let step = 0;

// Define initial room size
let room = {xMin: 50, xMax: 350, yMin: 50, yMax: 350};

function setup() {
  createCanvas(400, 400);
  // Initialize 10 people randomly in room
  for (let i = 0; i < 10; i++) {
    people.push(createVector(random(room.xMin, room.xMax), random(room.yMin, room.yMax)));
  }
  frameRate(10);
}

function draw() {
  background(220);
  rect(room.xMin, room.yMin, room.xMax-room.xMin, room.yMax-room.yMin);

  if (running && step < steps) {
    step++;
    document.getElementById("stepSlider").value = step;
    movePeople();
  }

  // Draw people
  for (let p of people) {
    fill('blue');
    circle(p.x, p.y, 10);
  }
}

function movePeople() {
  for (let p of people){
    let proposal = p.copy().add(p5.Vector.random2D().mult(10));
    // Accept if inside room
    if (proposal.x > room.xMin && proposal.x < room.xMax &&
        proposal.y > room.yMin && proposal.y < room.yMax) {
      p.set(proposal);
    }
  }
}

// Button functions
function play(){ running = true; }
function pause(){ running = false; }
function reset(){
  running = false;
  step = 0;
  people = [];
  for (let i = 0; i < 10; i++) {
    people.push(createVector(random(room.xMin, room.xMax), random(room.yMin, room.yMax)));
  }
  document.getElementById("stepSlider").value = step;
}

function goToStep(val){
  step = parseInt(val);
}
