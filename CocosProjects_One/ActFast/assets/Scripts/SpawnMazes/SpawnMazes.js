const ML = require('./MazeInit');

cc.Class({
    extends: cc.Component,

    properties: {
        splashSprite: {
            default: null,   
            type: cc.SpriteFrame,
            serializable: true,
        },
        parentNode: {
            default: null,  
            type: cc.Node,
            serializable: true,
        },
    },

    onLoad () {
        let mazeRows = 5;
        let mazeColumns = 5;
        let screenExtentsX = 200;
        let screenExtentsY = 200;
        let mazeWallWidth = 10;

        let InfoNToolsObj = {
            splashSprite: this.splashSprite,
            parentNode: this.parentNode,
            mazeDimensions: {
                mazeRows: mazeRows,
                mazeColumns: mazeColumns
            },
            mazeWallParams: {
                screenExtentsX: screenExtentsX,
                screenExtentsY: screenExtentsY,
                mazeWallWidth: mazeWallWidth
            },
        };
        
        console.log(InfoNToolsObj);

        ML.createPerfectMaze(InfoNToolsObj);
    },

    start () {

    },

    // update (dt) {},
});
