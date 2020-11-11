const {ccclass, property} = cc._decorator;

const ML = require('./MazeInit');

@ccclass
export default class SpawnMazes extends cc.Component {

    @property(cc.SpriteFrame)
    splashSprite: cc.SpriteFrame = null;

    @property(cc.Node)
    parentNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let mazeNode = new cc.Node("maze");

        mazeNode.color = new cc.Color(255, 0, 0);

        let sp = mazeNode.addComponent(cc.Sprite);
        sp.spriteFrame = this.splashSprite;
    
        mazeNode.parent = this.parentNode;
        mazeNode.position = new cc.Vec3(10, 10, 10);
        mazeNode.width = 200;
        mazeNode.height = 200;

        ML.createPerfectMaze(5, 5);
    }

    start () {

    }

    // update (dt) {}
}
