const ML = require('./MazeLib');

function renderMaze(maze) {
    let grid = maze.grid;

    for (let r = 0; r < grid.length; r++) {
        let row = grid[r];

        for (let c = 0; c < row.length; c++) {
            let node = row[c];
            if (!node.value) {
                continue;
            }

            if (node == maze.startNode) {
                console.log('Start Node', node);
            } else if (node == maze.endNode) {
                console.log('End Node', node);
            }

            let left = (node.value & ML.Maze.Direction.W) !== ML.Maze.Direction.W;
            let top = (node.value & ML.Maze.Direction.N) !== ML.Maze.Direction.N;
            if (left && top) {
                console.log('Left & Top', node);
            } else if (left) {
                console.log('Left Only', node);
            } else if (top) {
                console.log('Top Only', node);
            } else {
                let w = false;
                if (r > 0) {
                    w = (grid[r - 1][c].value & ML.Maze.Direction.W) !== ML.Maze.Direction.W;
                }
                if (w && c > 0) {
                    w = (grid[r][c - 1].value & ML.Maze.Direction.N) !== ML.Maze.Direction.N;
                }
                let ltc = w ? 1 : 0;
                if (ltc) {
                    // context.fillRect(cx, cy, wallWidth, wallWidth);
                    console.log("LTC", node, {a: grid[r - 1][c].value, b: ML.Maze.Direction.W});
                }
            }
        }
    }
}

module.exports = {
    renderMaze
}