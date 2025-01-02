

const tiles = new Image();
tiles.src = "./assets/tiles.png"

let rows = 7;
let cols = 6;

var wdt = 1200;
var hgh = 800;
var speed = 50;
var tileSz = 150;
var inSpin = false;
var reelEls = 10;

/*
game.x; game.y; game.wdt; game.hgh
canvasSz; gameSz; tileSz
gameSz / tileSz
*/

var canvas = document.querySelector('canvas');
canvas.width = wdt;
canvas.height = hgh;
const ctx1 = canvas.getContext("2d");

class Game {
    reels = [];
    constructor(x, y, wdt, hgh) {
        this.x = x;
        this.y = y;
        this.wdt = wdt;
        this.hgh = hgh;
    }
    genReels() {
        let num = this.calcScreen(tileSz);
        for (let i = 0; i < num; i++) {
            let reel = new Reel(reelEls, ctx1);
            this.reels.push(reel);
        }
    }
    drawGame(ctx) {
        let num = this.calcScreen(tileSz); // TODO UPDATE HOW TILE SIZE IS PASSED
        for (let i = 0, tx = 0; i < num; i++, tx+=tileSz) {
            this.reels[i].drawReel(tx, this.y, ctx);
        }
    }
    calcScreen(tSz) {
        let numReels = Math.floor(this.wdt/tSz);
        return numReels;
    }
}

class Tile {
    isDisplayed = false;
    isWin = false;
    isOld = false;
    #types = {
        "cherry": [0, 0],
        "tnt": [150, 0],
        "coin": [300, 0]
    }
    constructor(ctx) {
        this.ctx = ctx;
        let keys = Object.keys(this.#types);
        this.type = keys[keys.length * Math.random() << 0];
    }
    drawTile(x, y) {
        this.ctx.drawImage(tiles, this.#types[this.type][0], this.#types[this.type][1], 150, 150, x, y, 150, 150);
        this.x = x;
        this.y = y;
        if (this.y <= hgh) {
            this.isDisplayed = true;
        } else {
            this.isDisplayed = false;
        }
    }
    mvDown(speed, ctx) {
        ctx.clearRect(this.x, this.y, tileSz, tileSz);
        this.y += speed;
        this.drawTile(this.x, this.y);     
    }
    clear() {
        this.ctx.clearRect(this.x, this.y, 150, 150)
    }
}

class Reel {
    elements = []
    constructor(eNum, ctx) {
        this.ctx = ctx;
        this.eNum = eNum;
        this.elements.length = this.eNum;
        for (let i = 0; i < this.eNum; i++) {
            this.elements[i] = new Tile(this.ctx);
        }
    }
    drawReel(x, y, ctx) {
        this.x = x;
        this.y = y;
        for (let i = 0; i < this.eNum; i++, y+=150) {
            this.elements[(this.eNum-1)-i].drawTile(x, y, ctx);
        }
    }
    clear() {
        for (let i = 0; i < this.eNum; i++) {
            this.elements[i].clear();
        }
    }
    spin(speed, ctx) {
        for (let i = 0; i < this.eNum; i++) {
            this.elements[i].mvDown(speed, ctx);
            if (this.elements[i].isDisplayed == false) {
                console.log("test");
                let tmp = this.elements.pop();
                tmp.y = this.elements[0].y - tileSz;
                this.elements.unshift(tmp);
            }
        }
    }
}

let game = new Game(50, 50, wdt, hgh);
tiles.onload = function () {
    game.genReels();
    game.drawGame(ctx1);
    document.getElementById("spin").addEventListener("click", spinReel);
}

function spinReel() {
    for (let i = 0; i < game.reels.length; i++) {
        game.reels[i].spin(10, ctx1);
    }

    requestAnimationFrame(spinReel);
}