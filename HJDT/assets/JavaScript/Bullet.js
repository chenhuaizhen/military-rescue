cc.Class({
    extends: cc.Component,

    properties: {
        attack:"",
    },

    // use this for initialization
    onLoad: function () {
        this.isStart = false;
        this.dir = 0;
    },
    
    init: function(player) {
        this.player = player;
    },

    despawn: function() {
        this.player.despawnBullet(this.node);
    },

    play: function (dir) {
        this.dir = dir;
        if(dir<0)
            this.getComponent(cc.Animation).play('bulletL');
        else
            this.getComponent(cc.Animation).play('bulletR');
        this.vx = Math.cos(this.node.rotation*3.14/180)*dir;
        this.vy = Math.sin(-1*dir*this.node.rotation*3.14/180);
        this.isStart = true;
    },
    
    isHit : function(){
        for(var i=0;i<this.player.enemyArray.length;i++){
            var e=this.player.enemyArray[i];
            if(e!=0){
                var width = e.node.width/2;
                var height = e.node.height;
                if(this.node.x>e.node.x-width && this.node.x<e.node.x+width && this.node.y<e.node.y+height && this.node.y>e.node.y){
                    this.player.enemyArray[i].life -= this.attack;
                    return true;
                }   
            }
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
            this.node.x += 20*this.vx;
            this.node.y += 20*this.vy;
            if(this.isHit()){
                this.isStart = false;
                if(this.dir<0)
                    this.getComponent(cc.Animation).play('bulletKnockonL');
                else
                    this.getComponent(cc.Animation).play('bulletKnockonR');
            }
            else if(this.node.x< -1 * this.player.node.width || this.node.x > this.player.node.width || this.node.y > this.player.node.height || this.node.y < -1 * this.player.node.height){
                this.isStart = false;
                this.despawn();
            }
        }else{
            this.despawn();
        }
    },
});
