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
        this.player.despawnEBullet(this.node);
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
        var e = this.player.body;
        if(this.node.x>e.x-e.width/2 && this.node.x<e.x+e.width/2 && this.node.y<e.y && this.node.y>e.y - e.height){
            this.player.life -= this.attack;
            return true;
        }   
        if(this.node.y <= this.player.floor)
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
