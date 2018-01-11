cc.Class({
    extends: cc.Component,

    properties: {
        ebullet : {
            default: null,
            type: cc.Prefab
        },
        deadAudio: {
            default: null,
            url: cc.AudioClip
        },
        wholelife:"",
    },

    // use this for initialization
    onLoad: function () {
        this.isRun = false;
        this.isDead = false;
        this.deadTime = 0;
    },

    init: function(player) {
        this.player = player;
        this.isRun = false;
        this.isDead = false;
        this.deadTime = 0;
        this.isShoot = false;
        this.shootTime = 0;
        this.life = this.wholelife;
        this.ebulletPool = new cc.NodePool('ebullet');
        for (let i = 0; i < 10; ++i) {
            let eblt = cc.instantiate(this.ebullet);
            this.ebulletPool.put(eblt); 
        }
        this.dir = 1;
    },
    
    initILoc:function(i){
        this.Iloc = i;
    },
    
    spawnEBulllet: function () {
        var eb;
        if (this.ebulletPool.size() > 0) {
            eb = this.ebulletPool.get();
            return eb.getComponent('Ebullet');
        } else {
            eb = cc.instantiate(this.ebullet).getComponent('Ebullet');
            return eb;
        }
    },

    despawnEBullet: function (ebullet) {
        this.ebulletPool.put(ebullet);
    },
    
    despawn: function() {
        this.player.despawnEnemy(this.node);
    },

    play: function (action) {
        this.getComponent(cc.Animation).play(action);
        switch(action){
            case 'enemyR':
                this.isRun = true;
                this.isShoot = false;
                break;
            case 'enemyD':
                this.isRun = false;
                this.isDead = true;
                this.isShoot = false;
                break;
            case 'enemyS':
                this.isRun = false;
                this.isShoot = true;
                break;
            default:
                break;
        }
    },
    
    isEnemyDead: function(){
        if(this.life <= 0){
            this.play('enemyD');
            cc.audioEngine.playEffect(this.deadAudio, false);
        }
    },
    
    isEnemyHear: function(x){
        for(var i=0;i<this.player.enemyArray.length;i++){
            if(i == this.Iloc)
                continue;
            if(this.player.enemyArray[i]!=0){
                if(Math.abs(this.player.enemyArray[i].node.x-x)<10)
                    return false;
            }
        }
        return true;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.isRun){
            if(this.player.mapFloor(this.node.x - 4*this.dir)==this.node.y)
                this.node.x -= 4*this.dir;
            else if(this.player.mapFloor(this.node.x - 4*this.dir) < this.node.y){
                this.node.x -= 4*this.dir;
                this.node.y = this.player.mapFloor(this.node.x);
            }
            if(Math.abs(this.node.x - this.player.body.x) < 100 && this.isEnemyHear(this.node.x - 4*this.dir)){
                this.play('enemyS');
            }
            if(this.node.x > this.player.node.width/2+200 || this.node.x < -1*this.player.node.width/2-200 || (this.node.x > this.player.body.x && this.dir != 1) || (this.node.x < this.player.body.x && this.dir != -1)){
                this.dir = -1*this.dir;
                this.node.runAction(cc.scaleTo(0.005, this.dir,1));
            }
        }
        if(this.isDead){
            this.deadTime += dt;
            if(this.deadTime>1){
                this.despawn();
            }
        }else{
            this.isEnemyDead();
        }
        if(this.isShoot&&!this.player.isDead){
            this.shootTime += dt;
            if(this.shootTime > Math.random() + 0.5){
                this.shootTime = 0;
                if((this.node.x > this.player.body.x && this.dir != 1) || (this.node.x < this.player.body.x && this.dir != -1)){
                    this.dir = -1*this.dir;
                    this.node.runAction(cc.scaleTo(0.005, this.dir,1));
                }
                var e = this.spawnEBulllet();
                this.player.node.addChild(e.node);
                var ep = cc.p(this.node.x,this.node.y+this.node.height*0.625);
                e.node.setPosition(ep);
                e.init(this,this.player);
                e.play(this.dir);
            }
        }
    },
});
