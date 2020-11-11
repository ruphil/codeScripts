const ML = require('./MazeLib');

function renderMaze(maze, InfoNToolsObj) {
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
                drawMazeLeftWall(node, InfoNToolsObj);
                drawMazeTopWall(node, InfoNToolsObj);
                console.log('Left & Top', node);
            } else if (left) {
                drawMazeLeftWall(node, InfoNToolsObj);
                console.log('Left Only', node);
            } else if (top) {
                drawMazeTopWall(node, InfoNToolsObj);
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

    // putOuterMazeWall(InfoNToolsObj);
}

function drawMazeLeftWall(node, InfoNToolsObj){
    let x = node.x;
    let y = node.y;
    let mazeWallWidth = InfoNToolsObj.mazeWallParams.mazeWallWidth;
    let mazeWallHeight = 2 * InfoNToolsObj.mazeWallParams.screenExtentsY / InfoNToolsObj.mazeDimensions.mazeRows;

    let mazeWallX = -InfoNToolsObj.mazeWallParams.screenExtentsX + 2 * InfoNToolsObj.mazeWallParams.screenExtentsX / (InfoNToolsObj.mazeDimensions.mazeColumns - 1) * x;
    let mazeWallY = -InfoNToolsObj.mazeWallParams.screenExtentsY + 2 * InfoNToolsObj.mazeWallParams.screenExtentsY / (InfoNToolsObj.mazeDimensions.mazeRows - 1) * y;

    mazeWallX -= InfoNToolsObj.mazeWallParams.screenExtentsX / (InfoNToolsObj.mazeDimensions.mazeColumns - 1);
    mazeWallX += mazeWallWidth;

    let mazeNode = new cc.Node("maze");

    mazeNode.color = new cc.Color(255, 255, 0);
    mazeNode.position = new cc.Vec3(mazeWallX, mazeWallY, 0);

    let sp = mazeNode.addComponent(cc.Sprite);
    sp.spriteFrame = InfoNToolsObj.splashSprite;

    mazeNode.parent = InfoNToolsObj.parentNode;
    mazeNode.width = mazeWallWidth;
    mazeNode.height = mazeWallHeight;
}

function drawMazeTopWall(node, InfoNToolsObj){
    let x = node.x;
    let y = node.y;
    let mazeWallWidth = InfoNToolsObj.mazeWallParams.mazeWallWidth;
    let mazeWallHeight = 2 * InfoNToolsObj.mazeWallParams.screenExtentsX / InfoNToolsObj.mazeDimensions.mazeColumns;

    let mazeWallX = -InfoNToolsObj.mazeWallParams.screenExtentsX + 2 * InfoNToolsObj.mazeWallParams.screenExtentsX / (InfoNToolsObj.mazeDimensions.mazeColumns - 1) * x;
    let mazeWallY = -InfoNToolsObj.mazeWallParams.screenExtentsY + 2 * InfoNToolsObj.mazeWallParams.screenExtentsY / (InfoNToolsObj.mazeDimensions.mazeRows - 1) * y;

    mazeWallY -= InfoNToolsObj.mazeWallParams.screenExtentsY / (InfoNToolsObj.mazeDimensions.mazeRows - 1);

    let mazeNode = new cc.Node("maze");

    mazeNode.color = new cc.Color(255, 255, 0);
    mazeNode.position = new cc.Vec3(mazeWallX, mazeWallY, 0);

    let sp = mazeNode.addComponent(cc.Sprite);
    sp.spriteFrame = InfoNToolsObj.splashSprite;

    mazeNode.parent = InfoNToolsObj.parentNode;
    mazeNode.width = mazeWallHeight;
    mazeNode.height = mazeWallWidth;
}

function putOuterMazeWall(InfoNToolsObj){
    // Left Outer Wall
    drawLeftRightOuterMazeWall(-InfoNToolsObj.mazeWallParams.screenExtentsX, 0, InfoNToolsObj, 'left');

    // Right Outer Wall
    drawLeftRightOuterMazeWall(InfoNToolsObj.mazeWallParams.screenExtentsX, 0, InfoNToolsObj, 'right');
    
    // Top Outer Wall
    drawTopBottomOuterMazeWall(0, InfoNToolsObj.mazeWallParams.screenExtentsY, InfoNToolsObj, 'top');
    
    // Bottom Outer Wall
    drawTopBottomOuterMazeWall(0, -InfoNToolsObj.mazeWallParams.screenExtentsY, InfoNToolsObj, 'bottom');
}

function drawLeftRightOuterMazeWall(mazeWallX, mazeWallY, InfoNToolsObj, rightOrleft){
    let mazeWallWidth = InfoNToolsObj.mazeWallParams.mazeWallWidth;
    let mazeWallHeight = 2 * InfoNToolsObj.mazeWallParams.screenExtentsY;

    if(rightOrleft == 'left'){
        mazeWallX -= InfoNToolsObj.mazeWallParams.screenExtentsX / (InfoNToolsObj.mazeDimensions.mazeColumns - 1);
    } else {
        mazeWallX += InfoNToolsObj.mazeWallParams.screenExtentsX / (InfoNToolsObj.mazeDimensions.mazeColumns - 1);
    }

    let mazeNode = new cc.Node("maze");

    mazeNode.color = new cc.Color(255, 255, 0);
    mazeNode.position = new cc.Vec3(mazeWallX, mazeWallY, 0);

    let sp = mazeNode.addComponent(cc.Sprite);
    sp.spriteFrame = InfoNToolsObj.splashSprite;

    mazeNode.parent = InfoNToolsObj.parentNode;
    mazeNode.width = mazeWallWidth;
    mazeNode.height = mazeWallHeight + 8 * mazeWallWidth;
}

function drawTopBottomOuterMazeWall(mazeWallX, mazeWallY, InfoNToolsObj, topOrBottom){
    let mazeWallWidth = InfoNToolsObj.mazeWallParams.mazeWallWidth;
    let mazeWallHeight = 2 * InfoNToolsObj.mazeWallParams.screenExtentsX;

    if(topOrBottom == 'top'){
        mazeWallY += InfoNToolsObj.mazeWallParams.screenExtentsY / (InfoNToolsObj.mazeDimensions.mazeRows - 1);
    } else {
        mazeWallY -= InfoNToolsObj.mazeWallParams.screenExtentsY / (InfoNToolsObj.mazeDimensions.mazeRows - 1);
    }

    let mazeNode = new cc.Node("maze");

    mazeNode.color = new cc.Color(255, 255, 0);
    mazeNode.position = new cc.Vec3(mazeWallX, mazeWallY, 0);

    let sp = mazeNode.addComponent(cc.Sprite);
    sp.spriteFrame = InfoNToolsObj.splashSprite;

    mazeNode.parent = InfoNToolsObj.parentNode;
    mazeNode.width = mazeWallHeight + 8 * mazeWallWidth;
    mazeNode.height = mazeWallWidth;
}

module.exports = {
    renderMaze
}