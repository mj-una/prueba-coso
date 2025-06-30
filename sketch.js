let MIN_W = 5;
let MAX_W = 80;
let colorA;
let colorB;
let flagInit = true;
let flagTuto = false;
let flagCero = true;
let flagPrim = false;
let flagOtro = false;
let lastPoint = { x: 0, y: 0, r: MIN_W };
let audio;
let dejavu_normal;
let dejavu_italic;

//________________
function preload() {
  audio = loadSound("coso.mp3");
  dejavu_normal = loadFont("fonts/DejaVuSerifCondensed.ttf");
  dejavu_italic = loadFont("fonts/DejaVuSerifCondensed-Italic.ttf");
}

//________________
function setup() {
  createCanvas(...getSize());
  displayMode(MAXED);
  colorMode(HSB);
  shadowBox(0, 0, 12)
  textAlign(CENTER, TOP);
  textFont(dejavu_italic);
  textSize(54);
  noStroke();
  cursor(HAND);
  audio.stop();

  const hue = random(260, 390) % 360;
  colorB = [hue, 100, 80];
  colorA = [(colorB[0] + 180) % 360, 80, 90];
  background(...colorB);
}

//________________
function getPoint(ref) {
  const vel_xy = dist(ref.x, ref.y, mouseX, mouseY);
  const radius = constrain(MIN_W, vel_xy * 2, MAX_W);
  return {
    x: lerp(mouseX, ref.x, 0.5),
    y: lerp(mouseY, ref.y, 0.5),
    r: lerp(radius, ref.r, 0.9),
  }
}

//________________
function draw() {
  background(...colorB, 0.006);

  if (flagInit) {
    push();
    fill(0, 0, 100, 0.5);
    shadowBox(0, 0, 3);
    shadow(0, 0, 100);
    text("presiona", halfWidth, halfHeight * 0.3);
    pop();
    return;
  }

  if (flagTuto && !mouseIsPressed) {
    push();
    fill(0, 0, 100, 0.5);
    shadowBox(0, 0, 3);
    shadow(0, 0, 100);
    text("mantene\npresionado", halfWidth, halfHeight * 0.3);
    pop();
  }

  if (!mouseIsPressed) {
    cursor(HAND);
    return;
  }
  cursor(CROSS);

  const hue = flagOtro ? random(120, 260) : random(310, 430) % 360;
  colorB = [hue, 100, 100];
  colorA = [(colorB[0] + 180) % 360, 80, 90];

  const newPoint = getPoint(lastPoint);
  if (!flagCero) {
    const x1 = width - lastPoint.x;
    const y1 = height - lastPoint.y;
    const x2 = width - newPoint.x;
    const y2 = height - newPoint.y;
    fill(...colorA);
    shadow(...colorB);
    capsule(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, lastPoint.r);
    fill(...colorB);
    shadow(...colorA);
    capsule(x1, y1, x2, y2, lastPoint.r);
    push();
    noShadow();
    for (let i = 0.9; i > 0.2; i -= 0.05) {
      fill(colorA[0], colorA[1] * i, colorA[2]);
      const inR = lastPoint.r * i;
      capsule(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, inR);
      fill(colorB[0], colorB[1] * i, colorB[2]);
      capsule(x1, y1, x2, y2, inR);
    }
    pop();
  }

  lastPoint = { ...newPoint }; // save pointS

  const maxSize = max(width, height);
  const colide = maxSize * 0.04;

  if (dist(mouseX, mouseY, halfWidth, halfHeight) < colide || flagPrim) {
    noShadow();
    fill(0, 0, 100, 0.006);
    for (let i = 30; i > 1; i--) {
      circle(halfWidth, halfHeight, colide * i);
    }
  }
  
  if (dist(mouseX, mouseY, halfWidth, halfHeight) < MIN_W || flagPrim) {
    filter(INVERT);
  }

  push();
  fill(0, 0, 100, 0.5);
  shadowBox(0, 0, 3);
  shadow(0, 0, 100);
  text("hago cosos", halfWidth, halfHeight * 0.3);
  pop();
}

//________________
function mousePressed() {
  if (flagTuto) {
    flagTuto = false;
    flagPrim = true;
    setTimeout(() => flagCero = false, 100);
    setTimeout(() => flagPrim = false, 150);
    audio.play();
    if (document.documentElement.requestFullscreen) { // CHR (estandar)
      document.documentElement.requestFullscreen();
    }
    else if (document.documentElement.webkitRequestFullscreen) { // SFI
      document.documentElement.webkitRequestFullscreen();
    }
    else if (document.documentElement.mozRequestFullScreen) { // FFX
      document.documentElement.mozRequestFullScreen();
    }
    return;
  }

  lastPoint.x = mouseX;
  lastPoint.y = mouseY;
  lastPoint.r = 0;
}

//________________
function mouseReleased() {
  if (flagInit) {
    flagInit = false;
    flagTuto = true;
    push();
    filter(INVERT);
    background(0, 0, 100, 0.5);
    noShadow();
    fill(0, 0, 100, 0.04);
    const coso = max(width, height) * 0.04;
    for (let i = 20; i > 1; i--) {
      circle(halfWidth, halfHeight, coso * i);
    }
    pop();
    return;
  }
  
  flagOtro = !flagOtro;
  let newPoint = { ...lastPoint };
  const delta = {
    x: mouseX - lastPoint.x,
    y: mouseY - lastPoint.y,
    r: lastPoint.r,
  }
  
  // final tail
  for (let i = 0; i < 55; i++) {
    let tailX = map(newPoint.r, 0, MAX_W, newPoint.x, newPoint.x + delta.x);
    let tailY = map(newPoint.r, 0, MAX_W, newPoint.y, newPoint.y + delta.y);
    const hue = flagOtro ? random(120, 260) : random(310, 430) % 360;
    colorB = [hue, 100, 100];
    shadow(...colorA);
    colorA = [(colorB[0] + 180) % 360, 80, 90];
    fill(...colorB);
    capsule(tailX, tailY, newPoint.x, newPoint.y, newPoint.r);
    shadow(...colorB);
    fill(...colorA);
    const x1 = width - tailX;
    const y1 = height - tailY;
    const x2 = width - newPoint.x;
    const y2 = height - newPoint.y;
    capsule(x1, y1, x2, y2, newPoint.r);
    delta.x *= 0.97;
    delta.y *= 0.97;
    newPoint.x = tailX;
    newPoint.y = tailY;
    newPoint.r = newPoint.r * 0.94;
  }
}

//________________
function windowResized() {
  resizeCanvas(...getSize());
  background(...colorB);
}

//________________
function getSize() {
  const minSize = 400;
  const vw = window.visualViewport.width ?? window.innerWidth;
  const vh = window.visualViewport.height ?? window.innerHeight;
  const prp = vw / vh;
  const isVert = prp < 1;
  const maxSize = isVert
    ? minSize * vh / vw
    : minSize * prp;
  return isVert
    ? [minSize, maxSize]
    : [maxSize, minSize];
}