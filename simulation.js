let person;
let step = 0;
let stepsPerRoom = 50;  // number of steps person spends in a room
let running = false;
let trace = [];
let currentRoomIndex = 0;
let movingToNextRoom = false; // flag for transition

// Rooms arranged in a line
let roomSizes = [
  {x: 50, y: 150, width: 100, height: 100},  // small
  {x: 200, y: 100, width: 150, height: 150}, // medium
  {x: 400, y: 50, width: 200, height: 200}   // large
];

function setup() {
  createCanvas(700, 400);
  initializePerson();
  frameRate(10);
}

function draw() {
  background(220);

  // Draw all rooms
  stroke(0);
  strokeWeight(2);
  noFill();
  for(let r of roomSizes){
    rect(r.x, r.y, r.width, r.height);
  }

  let room = roomSizes[currentRoomIndex];

  if(running){
    if(!movingToNextRoom){
      // Move person inside current room
      movePerson(room);
      step++;
      if(step >= stepsPerRoom){
        movingToNextRoom = true; // start transition to next room
        step = 0;
      }
    } else {
      // Move to center of next room
      let nextRoomIndex = currentRoomIndex + 1;
      if(nextRoomIndex < roomSizes.length){
        let target = createVector(
          roomSizes[nextRoomIndex].x + roomSizes[nextRoomIndex].width/2,
          roomSizes[nextRoomIndex].y + roomSizes[nextRoomIndex].height/2
        );
        let dir = p5.Vector.sub(target, person);
        if(dir.mag() < 5){
          currentRoomIndex = nextRoomIndex;
          movingToNextRoom = false;
          step = 0;
        } else {
          dir.setMag(5);
          person.add(dir);
          trace.push(person.copy());
        }
      }
    }
  }

  // Draw trace
  stroke('red');
  strokeWeight(2);
  noFill();
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

// Initialize person at center of first room
function initializePerson(){
  let firstRoom = roomSizes[0];
  let centerX = firstRoom.x + firstRoom.width/2;
  let centerY = firstRoom.y + firstRoom.height/2;
  person = createVector(centerX, centerY);
  trace = [person.copy()];
  currentRoomIndex = 0;
  step = 0;
  movingToNextRoom = false;
}

// Move person randomly inside room (MCMC-style)
function movePerson(room){
  let proposal = person.copy().add(p5.Vector.random2D().mult(10));
  if(proposal.x > room.x && proposal.x < room.x + room.width &&
     proposal.y > room.y && proposal.y < room.y + room.height){
       person.set(proposal);
       trace.push(person.copy());
  }
}

// Buttons
function play(){ running = true; }
function pause(){ running = false; }
function reset(){
  running = false;
  initializePerson();
}

