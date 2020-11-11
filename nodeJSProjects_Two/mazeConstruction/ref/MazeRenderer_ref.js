renderMaze(context, maze);

var canvas, context;

function renderMaze(context, maze) {

    // var grid = JSON.parse(JSON.stringify(maze.grid));
    var grid = maze.grid;
    var canvasWidth = 800,
        canvasHeight = 600;
    var padding = 10;
    var wallWidth = 2;

    var cellSize = (canvasWidth - padding * 2) / maze.width;
    cellSize = Math.min(cellSize, (canvasHeight - padding * 2) / maze.height) >> 0;
    var x = padding,
        y = padding;

    var cellW = cellSize;
    var cellH = cellSize;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.fillStyle = "#eeeeee";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#334466";
    context.strokeStyle = "#334466";
    context.font = "12px Arial";
    context.lineWidth = wallWidth;

    var cellY = y;
    var mazeHeight = 0;
    for (var r = 0; r < grid.length; r++) {
        var row = grid[r];

        // cellH=cellSize-5+(Math.random()*20>>0);
        cellH = cellSize;

        for (var c = 0; c < row.length; c++) {
            var node = row[c];
            var cx = c * cellW + x;
            var cy = cellY;
            if (!node.value) {
                context.fillRect(cx, cy, cellW, cellH);
                continue;
            }

            if (node == maze.startNode) {
                context.fillStyle = "#f3bbaa";
                context.fillRect(cx, cy, cellW, cellH);
                context.fillStyle = "#334466";
                context.fillText("S", cx + cellW * 1 / 3, cy + cellH - 2);
            } else if (node == maze.endNode) {
                context.fillStyle = "#f3bbaa";
                context.fillRect(cx, cy, cellW, cellH);
                context.fillStyle = "#334466";
                context.fillText("E", cx + cellW * 1 / 3, cy + cellH - 2);
            } else {
                // var text = maze.traceInfo[node.x + "-" + node.y];
                // context.fillText(text, cx + cellW * 1 / 3, cy + cellH - 2);
            }

            var left = (node.value & Maze.Direction.W) !== Maze.Direction.W;
            var top = (node.value & Maze.Direction.N) !== Maze.Direction.N;
            if (left && top) {
                context.fillRect(cx, cy, wallWidth, cellH);
                context.fillRect(cx, cy, cellW, wallWidth);
            } else if (left) {
                context.fillRect(cx, cy, wallWidth, cellH);
            } else if (top) {
                context.fillRect(cx, cy, cellW, wallWidth);
            } else {
                var w = false;
                if (r > 0) {
                    w = (grid[r - 1][c].value & Maze.Direction.W) !== Maze.Direction.W;
                }
                if (w && c > 0) {
                    w = (grid[r][c - 1].value & Maze.Direction.N) !== Maze.Direction.N;
                }
                var ltc = w ? 1 : 0;
                if (ltc) {
                    context.fillRect(cx, cy, wallWidth, wallWidth);
                }
            }
        }
        cellY += cellH;
        mazeHeight += cellH;
    }

    context.fillRect(x, mazeHeight + y, cellW * maze.width, wallWidth);
    context.fillRect(cellW * maze.width + x, y, wallWidth, mazeHeight + wallWidth);
}
