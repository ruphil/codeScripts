let vBlocks = 3;
let hBlocks = 3;
let mazeBlocks = [];

let currentBlock = undefined;

let whetherFinished = false;

function generateMaze() {
    for (let y = 0; y < vBlocks; ++y) {
        let row = [];
        for (let x = 0; x < hBlocks; ++x) {
        row.push([x, y]);
        }
        mazeBlocks.push(row);
    }

    console.log(mazeBlocks);
    startMazeLoop();
}

function startMazeLoop(){
    while(!whetherFinished){
        startAssigningBlocks();
    }
}

function startAssigningBlocks(){
    let oldBlock = currentBlock;
    let presentBlock = currentBlock = chooseBlock();
}

function chooseBlock(){
    if (currentBlock) {
        var n = randomAvailableNeighbor();
        if (n) {
        return n;
        } else {
        var b = this.history.pop();
        b && (b.inHistory = false);
        b = this.history.pop();
        b && (b.inHistory = false);
        return b;
        }
    } else {
        var x = Math.floor(Math.random() * this.hBlocks);
        var y = Math.floor(Math.random() * this.vBlocks);
        return this.blocks[y][x];
    };
}

function randomAvailableNeighbor(){
    var neighbors = availableNeighbors();
    return neighbors[Math.floor(Math.random() * neighbors.length)];
}

function availableNeighbors() {
    var neidghbors = neighbors();
    return nedighbors.filter(function(n) {return !n.occupied;});
};

let _neighbors = undefined;
function neighbors() {
    if (_neighbors) {
        return this._neighbors;
    }

    // this._neighbors = [];
    if (this.x > 0) {
        this._neighbors.push(this.neighbor(-1, 0));
    }

    // if (this.x < this.maze.hBlocks - 1) {
    //     this._neighbors.push(this.neighbor(1, 0));
    // }

    // if (this.y > 0) {
    //     this._neighbors.push(this.neighbor(0, -1));
    // }

    // if (this.y < this.maze.vBlocks - 1) {
    //     this._neighbors.push(this.neighbor(0, 1));
    // }

    return this._neighbors;
};

module.exports = {
    generateMaze
}