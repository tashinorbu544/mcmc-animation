let person;              // Single person
let step = 0;            // Current step
let steps = 300;         // Total steps
let running = false;     // Play/pause state
let trace = [];          // Path trace

// Room sizes (small → medium → large)
let roomSizes = [
  {xMin: 50, xMax: 150, yMin: 50, yMax: 150},  // small
  {xMin: 50, xMax: 350, yMin: 50, yMax: 350},  // medium
  {xMin: 20, xMax: 380, yMin: 20, yMax: 380}   // large
];

function setup() {
  createCanvas(400, 400);
  initializePerson();
  frameRate(10);
}

function draw() {
  background(220);

  // Select room based on step
  let roomIndex = Math.floor(step / 100);
  let room = roomSizes[roomIndex % roomSizes.length];

  // Draw room
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(room.xMin, room.yMin, room.xMax - room.xMin, room.yMax - room.yMin);

  // Move person if running
  if(running && step < steps){
    step++;
    document.getElementById("stepSlider").value = step;
    movePerson(room);
  }

  // Draw trace
  noFill();
  stroke('red');
  strokeWeight(2);
  beginShape();
  for(let p of trace){
    vertex(p.x, p.y);
  }
  endShape();

  // Draw person
  fill('blue');
  noStroke();
  circle(person.x, person.y, 15);
}

// Initialize person in center of first room
function initializePerson(){
  let firstRoom = roomSizes[0];
  let centerX = (firstRoom.xMin + firstRoom.xMax)/2;
  let centerY = (firstRoom.yMin + firstRoom.yMax)/2;
  person = createVector(centerX, centerY);
  trace = [person.copy()];
}

// Move person with MCMC-style random step
function movePerson(room){
  let proposal = person.copy().add(p5.Vector.random2D().mult(10));
  // Accept only if inside current room
  if(proposal.x > room.xMin && proposal.x < room.xMax &&
     proposal.y > room.yMin && proposal.y < room.yMax){
       person.set(proposal);
       trace.push(person.copy());
  }
}

// Button functions
function play(){ running = true; }
function pause(){ running = false; }
function reset(){
  running = false;
  step = 0;
  document.getElementById("stepSlider").value = step;
  initializePerson();
}

function goToStep(val){
  step = parseInt(val);
  // Reset person and trace according to step
  initializePerson();
  for(let i = 0; i < step; i++){
    let roomIndex = Math.floor(i / 100);
    let room = roomSizes[roomIndex % roomSizes.length];
    movePerson(room);
  }
}
