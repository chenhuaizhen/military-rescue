cc.Class({
    extends: cc.Component,

    properties: {
        attack: "",
    },

    // use this for initialization
    onLoad: function () {

    },
    
    init: function(enemy,player) {
        this.enemy = enemy;
        this.player = player;
        this.dir = 1;
    },

    despawn: function() {
        this.enemy.despawnEBullet(this.node);
    },

    play: function (dir) {
        this.dir = dir;
        this.isStart = true;
        this.getComponent(cc.Animation).play('ebullet');
    },
    
    isHit : function(){
        if(this.node.x>this.player.foot.x-this.player.foot.width/2 && this.node.x<this.player.foot.x+this.player.foot.width/2 && this.node.y<this.player.body.y && this.node.y>this.player.foot.y){
            this.player.life -= this.attack;
            return true;
        }
        if(this.node.x>this.player.barrier1.x && this.node.x<this.player.barrier1.x+this.player.barrier1.width && this.node.y<this.player.barrier1.y && this.node.y>this.player.barrier1.y - this.player.barrier1.height){
            return true;
        }
        if(this.node.x>this.player.barrier2.x && this.node.x<this.player.barrier2.x+this.player.barrier2.width && this.node.y<this.player.barrier2.y && this.node.y>this.player.barrier2.y - this.player.barrier2.height){
            return true;
        }
        if(this.node.y <= this.player.mapFloor(this.node.x))
            return true;
        return false;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.isStart){
            this.node.x -= 5*this.dir;
            if(this.player.isDead){
                this.isStart = false;
            }
            else if(this.node.x< -1 * this.player.node.width || this.node.x > this.player.node.width || this.node.y > this.player.node.height || this.node.y < -1 * this.player.node.height){
                this.isStart = false;
            }else if(this.isHit()){
                this.isStart = false;
                this.getComponent(cc.Animation).play('ebulletKnockon');
            }
        }else{
            this.despawn();
        }
    },
});
