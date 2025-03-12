const CONFIG = {
    CANVAS_WIDTH:1200,
    CANVAS_HEIGHT: 800,
    TILE_SIZE: 150,
    SPRITE_OFFSETS: {
        cherry: 0,
        tnt: 150,
        coin: 300,
    }
}

const tiles = new Image();
tiles.src = "./assets/tiles.png"

var canvas = document.querySelector('canvas');
canvas.width = CONFIG.CANVAS_WIDTH;
canvas.height = CONFIG.CANVAS_HEIGHT;
const ctx1 = canvas.getContext("2d");

/**
 * Responsible for managing a collection of reels
 * @class
 */
class Game {
    /**
     * Stores objects of type Reel
     */
    reels = [];
    
    /**
     * Represents the entire game area
     * @constructor
     * @param {number} x 
     * @param {number} y 
     * @param {number} wdt - the width of the game area
     * @param {number} hgh - the height of the game area
     */
    constructor(x, y, wdt, hgh) {
        this.x = x;
        this.y = y;
        this.wdt = wdt;
        this.hgh = hgh;
        // The number of reels depends on the size of the game space.
        this.numReels = Math.floor(this.wdt/CONFIG.TILE_SIZE);
    }

    /**
     * Called once during initial game setup to populate the array
     */
    genReels() {
        let num = this.numReels;
        for (let i = 0; i < num; i++) {
            let reel = new Reel(ctx1, this.y, this.hgh);
            this.reels.push(reel);
        }
    }

    /**
     * Called once during initial game setup to draw the initial game state
     * (Could probably be merged with genReels)
     * @param {CanvasRenderingContext2D} ctx - the context for canvas operations
     */
    drawGame(ctx) {
        let num = this.numReels;
        for (let i = 0, tx = 0; i < num; i++, tx+=CONFIG.TILE_SIZE) {
            this.reels[i].drawReel(tx, this.y, ctx);
        }
    }
}

/**
 * Responsible for managing tiles individually
 * @class
 */
class Tile {
    isDisplayed = false;
    #tSz = CONFIG.TILE_SIZE;

    /**
     * Represents a single tile
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - the context for canvas operations
     * @param {number} gTop - The top limit of the game (px)
     * @param {number} gBot - The bottom limit of the game (px)
     */
    constructor(ctx, gTop, gBot) {
        this.gTop = gTop;
        this.gBot = gBot;
        this.ctx = ctx;
        let types = Object.keys(CONFIG.SPRITE_OFFSETS);
        this.type = types[types.length * Math.random() << 0];
    }

    /**
     * Tiles are drawn with dynamic sizing based on vertical position.
     * Handles rendering and state.
     * @param {number} x - Horizontal position (px)
     * @param {number} y - Vertical position (px)
     */
    drawTile(x, y) {
        this.x = x;
        this.y = y;
        
        this.ctx.drawImage(
            tiles,                              // Image
            CONFIG.SPRITE_OFFSETS[this.type],   // Source x from sprite sheet
            0,                                  // Source y (for now only one row of tiles)
            CONFIG.TILE_SIZE,                   // Source width
            CONFIG.TILE_SIZE,                   // Source height
            x,                                  // Destination x
            y,                                  // Destination y
            CONFIG.TILE_SIZE,                   // Render width
            CONFIG.TILE_SIZE                    // Render height
        );
        
        // Used by Reel.spin() to recycle offscreen tiles
        this.isDisplayed = this.y + CONFIG.TILE_SIZE > this.gTop &&
                            this.y < this.gBot;
    }

    /**
     * Movement is based on framerate (needs to be updated)
     * @param {number} speed - Pixels per frame
     * @param {CanvasRenderingContext2D} ctx - the context for canvas operations
     */
    mvDown(speed, ctx) {
        ctx.clearRect(this.x, this.y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        this.y += speed;
        this.drawTile(this.x, this.y);     
    }
    clear() {
        this.ctx.clearRect(this.x, this.y, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE)
    }
}

/**
 * Responsible for managing tiles within a single reel
 * @class
 */
class Reel {
    elements = []
    /**
     * Represents a single reel
     * @constructor
     * @param {CanvasRenderingContext2D} ctx - the context for canvas operations
     * @param {number} gTop - The top limit of the game (px)
     * @param {number} gBot - The bottom limit of the game (px)
     */
    constructor(ctx, gTop, gBot) {
        this.gTop = gTop;
        this.gBot = gBot;
        this.ctx = ctx;
        this.tileCount = Math.floor((gBot - gTop) / CONFIG.TILE_SIZE);
        this.elements.length = this.tileCount;

        for (let i = 0; i < this.tileCount; i++) {
            this.elements[i] = new Tile(this.ctx, gTop, gBot);
        }
    }

    /**
     * Represents a single reel
     * @param {CanvasRenderingContext2D} ctx - the context for canvas operations
     * @param {number} gTop - The top limit of the game (px)
     * @param {number} gBot - The bottom limit of the game (px)
     */
    drawReel(x, y, ctx) {
        this.x = x;
        this.y = y;
        for (let i = 0; i < this.tileCount; i++, y+=150) {
            this.elements[i].drawTile(x, y, ctx);
        }
    }

    /**
     * Clearing is handled per reel to allow for reels to move independent from one another
     */
    clear() {
        for (let i = 0; i < this.tileCount; i++) {
            this.elements[i].clear();
        }
    }

    /**
     * Only handles logic relies on tile.mvDown() for rendering
     * @param {number} speed - pixels per frame
     * @param {CanvasRenderingContext2D} ctx - the context for canvas operations
     */
    spin(speed, ctx) {
        let needsRecycle = false;

        for (const tile of this.elements) {
            tile.mvDown(speed, ctx);
            if (!tile.isDisplayed) needsRecycle = true;
        }

        if (needsRecycle) {
            const lastTile = this.elements.pop();
            lastTile.y = this.elements[0].y - CONFIG.TILE_SIZE;
            this.elements.unshift(lastTile);
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
        game.reels[i].spin(10, ctx1);
    }

    requestAnimationFrame(spinReel);
}