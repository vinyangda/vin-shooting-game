//canvas setting

let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

document.body.appendChild(canvas);

let backgroundImg, spaceshipImg, enemyImg, ammoImg, gameOverImg;
let gameOver = false;

let spaceshipX = canvas.width / 2 - 25;
let spaceshipY = canvas.height - 50;

let score = 0;
let ammoList = [];
function ammo() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX;
    this.y = spaceshipY;
    this.alive = true;
    ammoList.push(this);
  };
  this.update = function () {
    this.y -= 7;
    // if (this.y < 0) {
    //   ammoList.shift(this); //if it dosen't this the data keep stacking
    // }
  };
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x < enemyList[i].x + 25 &&
        this.x > enemyList[i].x - 25
      ) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 50);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 1;

    if (this.y >= canvas.height - 50) {
      gameOver = true;
      console.log("Game Over");
    }
  };
}

function loadImg() {
  backgroundImg = new Image();
  backgroundImg.src = "images/background-image.png";

  spaceshipImg = new Image();
  spaceshipImg.src = "images/jet.png";

  enemyImg = new Image();
  enemyImg.src = "images/enemy.png";

  ammoImg = new Image();
  ammoImg.src = "images/ammo.png";
}

let keysDown = {}; //press button
function setupKeyboardListener() {
  //function for handdle the keys
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];

    if (event.keyCode == 32) {
      createAmmo(); //create ammo
    }
  });
}

function createAmmo() {
  let b = new ammo();
  b.init();
  console.log("list", ammoList);
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5;
  } //move on to right way
  if (37 in keysDown) {
    spaceshipX -= 5;
  } // move to lefft way
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }
  if (38 in keysDown) {
    spaceshipY -= 5;
  }
  if (40 in keysDown) {
    spaceshipY += 5;
  }
  if (spaceshipY <= 0) {
    spaceshipY = 0;
  }
  if (spaceshipY >= canvas.height - 60) {
    spaceshipY = canvas.height - 60;
  }

  for (let i = 0; i < ammoList.length; i++) {
    if (ammoList[i].alive) {
      ammoList[i].update();
      ammoList[i].checkHit();
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY);
  ctx.fillText(`Score: ${score}`, 20, 20);
  ctx.fillStyle = "white";
  for (let i = 0; i < ammoList.length; i++) {
    if (ammoList[i].alive) {
      ctx.drawImage(ammoImg, ammoList[i].x, ammoList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImg, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  // 재귀함수로 메인을 계속 렌더링 해준다. >> 프레임 효과를 나타냄
  if (!gameOver) {
    update();
    render();
    console.log("animation");
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImg, 10, 100, 380, 380);
  }
}

loadImg();
setupKeyboardListener();
createEnemy();
main();

// shooting a ammo if you press space bar
// start the bullet point is smae as like space ship
// shooted ammo are saveing in array
//every ammo are has position x,y
//render by use ammo render
