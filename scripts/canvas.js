const tiles = new Image();
tiles.src = "./assets/tiles.png"

var CANVAS_WIDTH = 1200;
var CANVAS_HEIGHT = 800;
var tileSz = 150;

var canvas = document.querySelector('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
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
            let reel = new Reel(ctx1, this.y, this.hgh);
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
    #tSz = tileSz;
    #types = {
        "cherry": [0, 0],
        "tnt": [150, 0],
        "coin": [300, 0]
    }
    constructor(ctx, gTop, gBot) {
        this.gTop = gTop;
        this.gBot = gBot;
        this.ctx = ctx;
        let keys = Object.keys(this.#types);
        this.type = keys[keys.length * Math.random() << 0];
    }
    drawTile(x, y) {
        this.x = x;
        this.y = y;
        if (y + this.#tSz >= this.gBot) {
            if (this.#tSz <= 0) {
                this.#tSz = 0;
            }
            else {
                this.#tSz -= 1;
            }
        }
        else {
            this.#tSz = tileSz;
        }
        this.ctx.drawImage(tiles, this.#types[this.type][0], this.#types[this.type][1], 150, this.#tSz, x, y, 150, this.#tSz);
        
        
        if (this.y <= this.gBot) {
            this.isDisplayed = true;
        } else {
            this.isDisplayed = false;
            //this.clear();

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
    constructor(ctx, gTop, gBot) {
        this.gTop = gTop;
        this.gBot = gBot;
        this.ctx = ctx;
        //this.eNum = eNum;
        this.eNum = this.calcElements(tileSz, this.gTop, this.gBot);
        this.elements.length = this.eNum;
        for (let i = 0; i < this.eNum; i++) {
            this.elements[i] = new Tile(this.ctx, gTop, gBot);
        }
    }
    calcElements(tSz, gTop, gBot) {
        return Math.floor((gBot - gTop) / tSz);
    }
    drawReel(x, y, ctx) {
        this.x = x;
        this.y = y;
        for (let i = 0; i < this.eNum; i++, y+=150) {
            //this.elements[(this.eNum-1)-i].drawTile(x, y, ctx);
            this.elements[i].drawTile(x, y, ctx);
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
                let tmp = this.elements.pop();
                tmp.y = this.elements[0].y - tileSz;
                this.elements.unshift(tmp);
            }
        }
    }
}

let game = new Game(50, -300, 1200, 800);
tiles.onload = function () {
    game.genReels();
    game.drawGame(ctx1);
    document.getElementById("spin").addEventListener("click", spinReel);
}

async function spinReel() {
    for (let i = 0; i < game.reels.length; i++) {
        game.reels[0].spin(10, ctx1);
    }

    requestAnimationFrame(spinReel);
}