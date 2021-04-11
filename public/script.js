const canvas = document.querySelector("#canvas1");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

const mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

c.fillStyle = "white";
c.font = "30px Verdana";
c.fillText("ABE", 0, 40);
const textCoor = c.getImageData(0, 0, 100, 100);

particleAnimate = function () {
  class Particle {
    constructor(x, y) {
      this.x = x + 100;
      this.y = y;
      this.size = 3;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 30 + 1;
      this.blueGreen = 255;
    }
    draw() {
      c.fillStyle = `rgb(255,${this.blueGreen},${this.blueGreen})`;
      c.beginPath();
      c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      c.closePath();
      c.fill();
    }
    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx ** 2 + dy ** 2);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
        this.blueGreen -= 25;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
        if (this.blueGreen <= 255) {
          this.blueGreen += 15;
        }
      }
    }
  }

  function init() {
    particleArray = [];
    for (let y = 0; y < textCoor.height; y++) {
      for (let x = 0; x < textCoor.width; x++) {
        if (textCoor.data[y * 4 * textCoor.width + x * 4 + 3] > 128) {
          particleArray.push(new Particle(x * 20, y * 20));
        }
      }
    }
  }
  console.log(textCoor.data);
  init();
  console.log(particleArray);

  function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].draw();
      particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }
  animate();

  function connect() {
    // let lineOpacity = 1;
    for (let a = 0; a < particleArray.length; a++) {
      for (let b = a; b < particleArray.length; b++) {
        let distance = Math.sqrt(
          (particleArray[a].x - particleArray[b].x) ** 2 +
            (particleArray[a].y - particleArray[b].y) ** 2
        );

        if (distance < 50) {
          lineOpacity = 1 - distance / 50;
          c.strokeStyle = `rgba(255,255,255,${lineOpacity})`;
          // c.strokeStyle = `white`;
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(particleArray[a].x, particleArray[a].y);
          c.lineTo(particleArray[b].x, particleArray[b].y);
          c.stroke();
        }
      }
    }
  }
};
particleAnimate();
