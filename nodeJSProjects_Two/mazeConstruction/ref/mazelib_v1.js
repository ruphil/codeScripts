let mazeArry = [];
let dirs = ['n', 's', 'e', 'w'];
let modDir = {
    'n' : { y : -1, x : 0, o : 's' },
    's' : { y : 1, x : 0, o : 'n' },
    'e' : { y : 0, x : -1, o : 'w' },
    'w' : { y : 0, x : 1, o : 'e' }
};

let w = 3;
let h = 3;

let gridMap = [];
let gridW = 0, gridH = 0;

function GenerateMaze(width, height) {
    w = width;
    h = height;

	for(let mh = 0; mh < h; ++mh) {
        let tempArry = [];
        for(let mw = 0; mw < w; ++mw) { 
            tempArry.push({
                'n' : 0,
                's' : 0,
                'e' : 0,
                'w' : 0,
                'v' : 0
            }); 
        }
        mazeArry.push(tempArry);
    }

    // console.log(mazeArry);
	startBuildingMaze(0, 0);
}

function startBuildingMaze(x, y) {
    startExplorer(x, y);
    
    assembleToGrid();
    
    console.log(gridMap);
    // console.log(gridW, gridH);
    return gridMap;
}

function startExplorer(ex, ey) {
    let dirs_sorted = sortRand(dirs);
    // console.log(dirs_sorted);

	for(d in dirs_sorted)
	{
		let nx = ex + modDir[dirs[d]].x;
		let ny = ey + modDir[dirs[d]].y;

		if(nx >= 0 && nx < w && ny >= 0 && ny < h && mazeArry[ny][nx].v == 0)
		{
			mazeArry[ey][ex][dirs[d]] = 1;
			mazeArry[ey][ex].v = 1;
			mazeArry[ny][nx][modDir[dirs[d]].o] = 1;

			startExplorer(nx, ny);
		}
    }
}

function sortRand(a) {
	let out = new Array();
	let l = a.length;
    let p = Math.floor(Math.random() * (l * 1000)) % l;

	for(x in a)
	{
		do { 
            p = Math.floor(Math.random() * (l * 1000)) % l; 
        } while(typeof out[p]!='undefined');

		out[p] = a[x];
	}

	return out;
}

function assembleToGrid() {
	let grid = [];
	for(let mh = 0; mh < (h * 2 + 1); ++mh) { 
        let tempArry = []; 
        for(let mw = 0; mw < (w * 2 + 1); ++mw) { 
            tempArry.push(0); 
        }
        grid.push(tempArry);
    }

	for(let y = 0; y < h; ++y) {
		let py = (y * 2) + 1;

		for(let x = 0; x < w; ++x)
		{
			let px = (x * 2) + 1;

			if(mazeArry[y][x].v == 1) { 
                grid[py][px] = 1; 
            }

			for(d in dirs)
			{
				if(mazeArry[y][x][dirs[d]] == 1) { 
                    grid[(py + modDir[dirs[d]].y)][(px + modDir[dirs[d]].x)] = 1; 
                }
			}
		}
    }

	gridMap = grid;
	gridW	= grid.length;
	gridH	= grid[0].length;
}

module.exports = {
    GenerateMaze
}