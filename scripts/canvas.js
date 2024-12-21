const tiles = new Image();
tiles.src = "./assets/tiles.png"

let rows = 7;
let cols = 6;
var reels = Array.from({length: rows}, () => Array(cols).fill(0));

var wdt = 1200;
var hgh = 800;
var speed = 50;
var stPos = [20, 0];

var canvas = document.querySelector('canvas');
canvas.width = wdt;
canvas.height = hgh;
const ctx = canvas.getContext("2d");


class Tile {
    types = {
        "cherry": [0, 0],
        "tnt": [150, 0],
        "coin": [300, 0]
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let keys = Object.keys(this.types);
        this.type = keys[keys.length * Math.random() << 0];
    }
    draw(x, y) {
        ctx.drawImage(tiles, this.types[this.type][0], this.types[this.type][1], 150, 150, x, y, 150, 150);
    }
}

function spinReel() {

    let sTime = performance.now();
    function animate() {
        const reel =  reels[0];
    
        ctx.clearRect(0, 0, 200, hgh);
        for (let i = 0; i < reel.length; i++) {
            reel[i].draw(reel[i].x, reel[i].y);
            reel[i].y += speed;
            if (reel[reel.length - 1].y > 800) {
                genTile(0, reel[0].x, reel[0].y - 150);
                reel.length -= 1;
            }
        }

        speed -= 5 * (performance.now() - sTime);

        if (speed <= 0) {

            speed = 50;
            return;
        }

        requestAnimationFrame(spinReel);
    }
    animate();
}



function genTile(col, x, y) {
    reels[col].unshift(new Tile(x, y));
}

tiles.onload = function () {
    function initSqc() {
        for (let i = 0, x = 20; x < 1200; x+=200, i++) {
            for (let j = 0, y = -300; y < 650; y+=150, j++) {
                let tile = new Tile(x, y);
                tile.draw(x, y);
                reels[i][j] = tile;
            }
        }
    }


    initSqc();
    document.getElementById("spin").addEventListener("click", spinReel);
}