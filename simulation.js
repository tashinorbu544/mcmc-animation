let rooms = [0.05, 0.15, 0.4, 0.1, 0.15];
let n_rooms = rooms.length;
let steps = 300;
let burnIn = 60;

let positions = [];
let visitCounts = Array(n_rooms).fill(0);

let step = 0;
let running = false;
let position = 2; // start in middle room

// ---------------- MCMC ----------------
function precomputePositions() {
  positions = [];
  visitCounts = Array(n_rooms).fill(0);

  let current = position;
  for (let i = 0; i < steps; i++) {
    let proposal = current + (Math.random() < 0.5 ? -1 : 1);
    proposal = Math.max(0, Math.min(n_rooms - 1, proposal));

    let accept_ratio = rooms[proposal] / rooms[current];
    if (Math.random() < Math.min(1, accept_ratio)) {
      current = proposal;
    }
    positions.push(current);
  }
}

precomputePositions();

// ---------------- p5 ----------------
function setup() {
  createCanvas(900, 500);
  frameRate(20);
  drawFrame(0);
}

function draw() {
  if (running && step < steps - 1) {
    step++;
    drawFrame(step);
    document.getElementById("stepSlider").value = step;
  }
}

// ---------------- DRAW ----------------
function drawFrame(frame) {
  background(255);

  let topH = 180;
  let bottomH = height - topH;

  drawRooms(topH, frame);
  drawWiggle(topH, bottomH, frame);
  drawBarChart(topH, bottomH, frame);
}

// --------- TOP: Rooms + person ---------
function drawRooms(h, frame) {
  let roomW = width / n_rooms;
  let maxProb = Math.max(...rooms);

  for (let i = 0; i < n_rooms; i++) {
    let barH = map(rooms[i], 0, maxProb, 20, h - 40);

    fill(220);
    stroke(120);
    rect(i * roomW, h - barH, roomW - 4, barH);

    fill(60);
    noStroke();
    textAlign(CENTER);
    text(`Room ${i + 1}`, i * roomW + roomW / 2, h - 5);
  }

  let currentRoom = positions[frame];
  let personX = currentRoom * roomW + roomW / 2;
  let personY =
    h -
    map(rooms[currentRoom], 0, maxProb, 20, h - 40) -
    12;

  fill("red");
  ellipse(personX, personY, 18, 18);

  fill(50);
  textAlign(CENTER);
  text("Room sizes (target distribution)", width / 2, 15);
}

// --------- BOTTOM LEFT: Wiggle + burn-in ---------
function drawWiggle(topH, bottomH, frame) {
  let x0 = 0;
  let y0 = topH;
  let w = width / 2;
  let h = bottomH;

  stroke(200);
  noFill();
  rect(x0, y0, w, h);

  // Burn-in trajectory (gray)
  stroke(180);
  strokeWeight(1.5);
  noFill();
  beginShape();
  for (let i = 0; i <= Math.min(frame, burnIn); i++) {
    let x = map(i, 0, steps - 1, x0 + 10, x0 + w - 10);
    let y = map(positions[i], 0, n_rooms - 1, y0 + h - 20, y0 + 20);
    vertex(x, y);
  }
  endShape();

  // Post burn-in trajectory (blue)
  stroke("#2563eb");
  strokeWeight(2);
  beginShape();
  for (let i = burnIn; i <= frame; i++) {
    let x = map(i, 0, steps - 1, x0 + 10, x0 + w - 10);
    let y = map(positions[i], 0, n_rooms - 1, y0 + h - 20, y0 + 20);
    vertex(x, y);
  }
  endShape();

  // Current point
  fill("#1e40af");
  noStroke();
  let cx = map(frame, 0, steps - 1, x0 + 10, x0 + w - 10);
  let cy = map(positions[frame], 0, n_rooms - 1, y0 + h - 20, y0 + 20);
  ellipse(cx, cy, 10, 10);

  // Burn-in marker
  stroke(150);
  let bx = map(burnIn, 0, steps - 1, x0 + 10, x0 + w - 10);
  line(bx, y0 + 10, bx, y0 + h - 10);

  fill(60);
  noStroke();
  text("Burn-in", bx + 20, y0 + 25);

  fill(60);
  textAlign(CENTER);
  text("MCMC trajectory (wiggle)", x0 + w / 2, y0 + 15);
}

// --------- BOTTOM RIGHT: Bar chart (FIXED) ---------
function drawBarChart(topH, bottomH, frame) {
  let x0 = width / 2;
  let y0 = topH;
  let w = width / 2;
  let h = bottomH;

  stroke(200);
  noFill();
  rect(x0, y0, w, h);

  visitCounts = Array(n_rooms).fill(0);
  for (let i = burnIn; i <= frame; i++) {
    visitCounts[positions[i]]++;
  }

  let barW = (w - 40) / n_rooms;

  for (let i = 0; i < n_rooms; i++) {
    let barH = map(visitCounts[i], 0, steps - burnIn, 0, h - 40);

    fill("#60a5fa");
    rect(
      x0 + 20 + i * barW,
      y0 + h - 20 - barH,
      barW - 10,
      barH
    );

    // True probability reference
    stroke("#ef4444");
    let trueH = map(rooms[i], 0, 1, 0, h - 40);
    line(
      x0 + 20 + i * barW,
      y0 + h - 20 - trueH,
      x0 + 20 + i * barW + barW - 10,
      y0 + h - 20 - trueH
    );

    noStroke();
    fill(60);
    textAlign(CENTER);
    text(i + 1, x0 + 20 + i * barW + barW / 2 - 5, y0 + h - 5);
  }

  fill(60);
  textAlign(CENTER);
  text("Visit frequency (post burn-in)", x0 + w / 2, y0 + 15);
}

// ---------------- Controls ----------------
function play() { running = true; }
function pause() { running = false; }
function reset() {
  step = 0;
  drawFrame(0);
  document.getElementById("stepSlider").value = 0;
}

let slider = document.getElementById("stepSlider");
slider.oninput = function () {
  step = parseInt(this.value);
  drawFrame(step);
};
