const tiles = new Image();
tiles.src = "./assets/tiles.png"

let rows = 7;
let cols = 6;
//var reels = Array.from({length: rows}, () => Array(cols).fill(0));
var reels = [];

var wdt = 1200;
var hgh = 800;
var speed = 50;
var stPos = [20, 0];
var tileSz = 150;

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
    constructor() {
        let keys = Object.keys(this.types);
        this.type = keys[keys.length * Math.random() << 0];
    }
    draw(x, y) {
        ctx.drawImage(tiles, this.types[this.type][0], this.types[this.type][1], 150, 150, x, y, 150, 150);
        this.x = x;
        this.y = y;
    }
}

class Reel {
    arr = []
    constructor(eNum) {
        this.eNum = eNum;
        this.arr.length = this.eNum;
        for (let i = 0; i < this.eNum; i++) {
            this.arr[i] = new Tile();
        }
    }
    draw(x, y) {
        for (let i = 0; i < this.arr.length; i++, y+=150) {
            this.arr[i].draw(x, y);
        }
    }
    genTile() {
        this.arr.unshift(new Tile());
    }
    spin(speed) {
        let arr = this.arr, len = this.eNum;
        ctx.clearRect(0, 0, wdt, hgh);
        for (let i = 0; i < len; i++) {
            arr[i].draw(arr[i].x, arr[i].y);
            arr[i].y += speed;
            if (arr[len - 1].y > 800) {
                this.genTile();
                this.arr.length -= 1;
            }
        }
    }
}


tiles.onload = function () {
    function initSqc() {
        for (let i = 0, x = 20; x < wdt; x+=200, i++) {
            let reel = new Reel(5);
            reel.draw(x, 0);
            reels.push(reel);
        }
    }


    initSqc();
    document.getElementById("spin").addEventListener("click", spinReel);
}

function spinReel() {
    for (let i = 0; i < reels.length; i++) {
        reels[i].spin(50);
    }
    requestAnimationFrame(spinReel);
}



// function genTile(col, x, y) {
//     reels[col].unshift(new Tile(x, y));
// }

// function spinReel() {

//     let sTime = performance.now();
//     function animate() {
//         const reel =  reels[0];
    
//         ctx.clearRect(0, 0, 200, hgh);
//         for (let i = 0; i < reel.length; i++) {
//             reel[i].draw(reel[i].x, reel[i].y);
//             reel[i].y += speed;
//             if (reel[reel.length - 1].y > 800) {
//                 genTile(0, reel[0].x, reel[0].y - 150);
//                 reel.length -= 1;
//             }
//         }

//         speed -= 5 * (performance.now() - sTime);

//         if (speed <= 0) {

//             speed = 50;
//             return;
//         }

//         requestAnimationFrame(spinReel);
//     }
//     animate();
// }

// tiles.onload = function () {
//     function initSqc() {
//         for (let i = 0, x = 20; x < 1200; x+=200, i++) {
//             for (let j = 0, y = -300; y < 650; y+=150, j++) {
//                 let tile = new Tile();
//                 tile.draw(x, y);
//                 reels[i][j] = tile;
//             }
//         }
//     }


//     initSqc();
//     document.getElementById("spin").addEventListener("click", spinReel);
// }