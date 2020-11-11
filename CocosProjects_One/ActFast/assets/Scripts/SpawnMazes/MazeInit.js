const ML = require('./MazeLib');
const MR = require('./MazeRenderer');

var maze = new ML.Maze({
    width: 5,
    height: 5,

    perfect: true,
    braid: false,
    checkOver: false,

    onInit: function() {
        this.checkOver = false;
        this.checkCount = {};
        // this.traceInfo = {};
        this.foundEndNode = false;
    },

    getNeighbor: function() {
        // if (this.currentDirCount < 6 && this.neighbors[this.currentDir]) {
        //     return this.neighbors[this.currentDir];
        // }
        var list = this.neighbors.list;
        var n = list[list.length * Math.random() >> 0];
        return n;
    },

    isValid: function(nearNode, node, dir) {
        if (!nearNode || nearNode.value === null) {
            return false;
        }
        if (nearNode.value === 0) {
            return true;
        }
        if (this.perfect || this.braid) {
            return false;
        }
        var c = nearNode.x,
            r = nearNode.y;
        // Used to generate a non-perfect maze
        this.checkCount[c + "-" + r] = this.checkCount[c + "-" + r] || 0;
        var count = ++this.checkCount[c + "-" + r];
        return Math.random() < 0.3 && count < 3;
    },

    beforeBacktrace: function() {
        // if (!this.braid || Math.random() < 0.5) {
        if (!this.braid) {
            return;
        }
        var n = [];
        var node = this.currentNode;
        var c = node.x;
        var r = node.y;
        var nearNode, dir, op;

        var first = null;
        var currentDir = this.currentDir;
        var updateNear = function() {
            op = Maze.Direction.opposite[dir];
            if (nearNode && nearNode.value !== null && (nearNode.value & op) !== op) {
                n.push([nearNode, dir]);
                if (dir == currentDir) {
                    first = [nearNode, dir];
                }
            }
        };

        dir = Maze.Direction.N;
        nearNode = r > 0 ? this.grid[r - 1][c] : null;
        updateNear();

        if (!first) {
            dir = Maze.Direction.E;
            nearNode = this.grid[r][c + 1];
            updateNear();
        }

        if (!first) {
            dir = Maze.Direction.S;
            nearNode = r < this.height - 1 ? this.grid[r + 1][c] : null;
            updateNear();
        }

        if (!first) {
            dir = Maze.Direction.W;
            nearNode = this.grid[r][c - 1];
            updateNear();
        }

        n = first || n[n.length * Math.random() >> 0];
        this.moveTo(n[0], n[1]);
    },

    updateCurrent: function() {
        // this.traceInfo[this.currentNode.x + "-" + this.currentNode.y] = this.stepCount;
        if (this.braid) {
            return;
        }
        // Each step has a 10% probability of backtracking
        if (Math.random() <= 0.10) {
            this.backtrace();
        }
    },

    getTraceIndex: function() {
        var len = this.trace.length;

        if (this.braid) {
            return len - 1;
        }

        // Randomly choose a backtracking strategy with a certain probability
        var r = Math.random();
        var idx = 0;
        if (r < 0.5) {
            idx = len - 1;
        } else if (r < 0.7) {
            idx = len >> 1;
        } else if (r < 0.8) {
            idx = len * Math.random() >> 0;
        }
        return idx;
    },

    afterGenrate: function() {
        if (this.braid && this.getRoadCount(this.startNode)<2) {
            this.currentDirCount = 1000;
            this.setCurrent(this.startNode);
            this.nextStep();
        }
    },

    isOver: function() {
        if (!this.checkOver) {
            return false;
        }
        if (this.currentNode == this.endNode) {
            this.foundEndNode = true;
        }
        // When the end of the maze is explored, and at least half of the area has been explored, the generation of the maze is terminated
        if (this.foundEndNode && this.stepCount >= this.size / 2) {
            return true;
        }
        return false;
    }
});

function createPerfectMaze(InfoNToolsObj) {
    createMaze(true, false, InfoNToolsObj);
}

// function createBraidMaze() {
//     createMaze(false, true, rows, columns);
// }

function createMaze(perfect, braid, InfoNToolsObj) {
    let rows = InfoNToolsObj.mazeDimensions.mazeRows;
    let columns = InfoNToolsObj.mazeDimensions.mazeColumns;

    maze.height = rows;
    maze.width = columns;

    maze.perfect = perfect || false;
    maze.braid = braid || false;

    maze.init();

    // maze.setStart(0, 0);
    // maze.setEnd(4, 4);

    maze.startNode = maze.getRandomNode();
    do {
        maze.endNode = maze.getRandomNode();
    } while (maze.startNode == maze.endNode);

    // maze.setBlock(15, 15, 6, 5);
    // maze.setRoom(5, 5, 6, 5);
    maze.generate();
    // console.log(maze.grid);
    // console.log(maze);
    MR.renderMaze(maze, InfoNToolsObj);
}

module.exports = {
    createPerfectMaze
}