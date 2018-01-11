cc.Class({
    extends: cc.Component,

    properties: {
        AnimName : '',
        hand: {
            default: null,
            type: cc.Node
        },
        body: {
            default: null,
            type: cc.Node
        },
        foot: {
            default: null,
            type: cc.Node
        },
        bullet: {
            default: null,
            type: cc.Prefab
        },
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        enemy: {
            default: null,
            type: cc.Prefab
        },
        background: {
            default: null,
            type: cc.Node
        },
        barrier1: {
            default: null,
            type: cc.Node
        },
        barrier2: {
            default: null,
            type: cc.Node
        },
        lifeBar: {
            default: null,
            type: cc.Node
        },
        wholeLife : "",
        deadAudio: {
            default: null,
            url: cc.AudioClip
        },
        gameover:{
            default: null,
            type: cc.Node
        },
        gameoverWin:{
            default: null,
            type: cc.Label
        },
        reBtn:{
            default: null,
            type: cc.Node
        },
    },

    doAction : function(dir,action){
        if(this.isDead)
            return;
        if(dir == 'J'){
            if(this.JumpLock != 0&&this.foot.y == this.floor){
                this.foot.getComponent(cc.Animation).play(this.AnimName + this.lastDir + action);
                this.ySpeed = 250;
                this.JumpLock = 0;
                return;
            }
        }
        else if(this.downLock != 0 || this.lastAction == 'S' || dir != this.lastDir){
            if(this.JumpLock != 0 && this.downLock == 0)
                this.foot.getComponent(cc.Animation).play(this.AnimName + dir + action);
            if(this.JumpLock != 0 && this.downLock != 0){
                this.foot.getComponent(cc.Animation).play(this.AnimName + this.lastDir + action);
                this.body.y -= 7;
                this.hand.y -= 7;
                this.downReal = 1;
                this.downLock = 0;
                if(this.keyArray[0]!=0)
                    this.xSpeed = -150;
                else if(this.keyArray[1]!=0)
                    this.xSpeed = 150;
            }
            else if(this.downLock == 0 ){
                this.lastDir = dir;
                this.lastAction = 'W';
                var dirN = dir == 'L'?1:-1;
                //this.body.runAction(cc.scaleTo(0.005,dirN,1));
                if(this.keyArray[2]==0)
                    this.xSpeed = dirN * -300;
                else
                    this.xSpeed = dirN * -150;
            }
        }
            
    },
    
    eventListen : function(){
        let self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // set a flag when key pressed
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.keyArray[0] = 1;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.keyArray[1] = 1;
                        break;
                    case cc.KEY.w:
                    case cc.KEY.up:
                        self.doAction('J' , 'J');
                        break;
                    case cc.KEY.s:
                    case cc.KEY.down:
                        if(self.JumpLock != 0){
                           self.keyArray[2] = 1;
                            if(self.downSwitch == 1){
                                self.downSwitch = 0;
                                self.downLock = 1;
                            } 
                        }
                        break;
                }
            },
            // unset a flag when key released
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.releaseTime = 1;
                        self.lastDir = 'L';
                        self.keyArray[0] = 0;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.releaseTime = 1;
                        self.lastDir = 'R';
                        self.keyArray[1] = 0;
                        break;
                    case cc.KEY.s:
                    case cc.KEY.down:
                        if(self.JumpLock != 0&&self.downReal == 1&&!self.isDead){
                            self.keyArray[2] = 0;
                            self.downLock = 0;
                            self.downSwitch = 1;
                            self.body.y += 7;
                            self.hand.y += 7;
                            self.downReal = 0;
                            self.foot.getComponent(cc.Animation).play(self.AnimName + self.lastDir + 'S');
                            self.lastAction = 'S';
                        }
                        break;
                }
            }
        }, self.node);  
        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                self.rotateLock = 0;
                self.keyLoc = touch.getLocation();
                if(self.lastKeylocate != self.keyLoc){
                    self.lastKeylocate = self.keyLoc;
                    self.rotateLock = 1;
                }
                self.shoot(self.keyLoc);
                return true;
            },
            onTouchMoved: function(touch, event) {
                self.rotateLock = 0;
                self.keyLoc = touch.getLocation();
                if(self.lastKeylocate != self.keyLoc){
                    self.lastKeylocate = self.keyLoc;
                    self.rotateLock = 1;
                }
            },
            onTouchEnded: function(touch, event) {
                //self.keyLoc = touch.getLocation();
                self.rotateLock = 0;
                return true;
            }
        }, self.node);
        
    },
    
    rotateAngle : function(po){
        var anchor = cc.p(this.hand.getPosition().x+this.Xchange,this.hand.getPosition().y+this.Ychange);
        var tempAngle = 0;
        if(po.x<=anchor.x){
            if(this.lastScale != 1){
                this.hand.runAction(cc.scaleTo(0.005, 1,1));
                this.body.runAction(cc.scaleTo(0.005,1,1));
                this.lastScale = 1;
            }
            tempAngle = cc.pAngleSigned(cc.p(po.x-anchor.x,po.y-anchor.y),cc.p(-50,0))*180/3.14;
            if(tempAngle<-90){
                tempAngle = 0;
            }else{
                tempAngle += 25;
            }
        }else{
            if(this.lastScale != -1){
                this.hand.runAction(cc.scaleTo(0.005, -1,1));
                this.body.runAction(cc.scaleTo(0.005,-1,1));
                this.lastScale = -1;
            }
            tempAngle = cc.pAngleSigned(cc.p(50,0),cc.p(po.x-anchor.x,po.y-anchor.y))*180/3.14;
            if(tempAngle<-90)
                tempAngle = 0;
            else
                tempAngle = -25-tempAngle;
        }
        return tempAngle;
    },
    
    shoot: function(po){
        if(this.isDead)
            return;
        var anchor = cc.p(this.hand.x+this.Xchange,this.hand.y+this.Ychange);
        var p = 0;
        var dir = 1;
        var b = this.spawnBulllet();
        this.node.addChild(b.node);
        if(po.x<=anchor.x){
            var tempAngle = cc.pAngleSigned(cc.p(po.x-anchor.x,po.y-anchor.y),cc.p(-50,0))*180/3.14;
            if(tempAngle<-90){
                tempAngle = 0;
            }else{
                tempAngle += 25;
            }
            tempAngle += this.handSita;
            p = cc.p(this.hand.x - this.handR * Math.sin(tempAngle*3.14/180),this.hand.y - this.handR*Math.cos(tempAngle*3.14/180));
            dir = -1;
            b.node.setPosition(p);
            b.node.rotation = tempAngle - 90;
        }else{
            var tempAngle = cc.pAngleSigned(cc.p(50,0),cc.p(po.x-anchor.x,po.y-anchor.y))*180/3.14;
            if(tempAngle<-90)
                tempAngle = 0;
            else
                tempAngle = 25+tempAngle;
            tempAngle += this.handSita;
            p = cc.p(this.hand.x + this.handR * Math.sin(tempAngle*3.14/180),this.hand.y - this.handR*Math.cos(tempAngle*3.14/180));
            dir = 1;
            b.node.setPosition(p);
            b.node.rotation = 90 - tempAngle;
        }

        b.init(this);
        b.play(dir);
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },
    
    spawnBulllet: function () {
        var b;
        if (this.bulletPool.size() > 0) {
            b = this.bulletPool.get();
            return b.getComponent('Bullet');
        } else {
            b = cc.instantiate(this.bullet).getComponent('Bullet');
            return b;
        }
    },

    despawnBullet: function (bullet) {
        this.bulletPool.put(bullet);
    },
    
    spawnEnemy: function () {
        var e;
        if (this.enemyPool.size() > 0) {
            e = this.enemyPool.get();
            return e.getComponent('Enemy');
        } else {
            e = cc.instantiate(this.enemy).getComponent('Enemy');
            return e;
        }
    },

    despawnEnemy: function (enemy) {
        for(var i=0;i<10;i++){
            if(this.enemyArray[i]!=0&&this.enemyArray[i].node.x==enemy.x&&this.enemyArray[i].node.y==enemy.y){
                this.enemyArray[i] = 0;
                break;
            }
        }
        this.enemyPool.put(enemy);
    },
    
    mapFloor: function(x){
        var rx = x - this.background.x;
        if(rx < this.barrier1.x - this.background.x)
            return 0.23 * this.background.height - this.node.height/2;
        else if(rx < this.barrier1.x - this.background.x + this.barrier1.width * 7 / 8)
            return this.barrier1.y - 2;
        else if(rx < this.barrier1.x - this.background.x + this.barrier1.width * 4 / 3)
            return 0.23 * this.background.height - this.node.height/2;
        else if(rx < this.barrier2.x - this.background.x)
            return 0.1 * this.background.height - this.node.height/2;
        else if(rx < this.barrier2.x - this.background.x + this.barrier2.width)
            return this.barrier2.y;
        else
            return 0.1 * this.background.height - this.node.height/2;
    },
    
    isHeroDead : function(){
        if(this.life >= 0)
            this.lifeBar.width = this.life/this.wholeLife * this.lbw;
        if(this.life <= 0){
            this.body.x = 9000;
            this.hand.x = 9000;
            this.foot.y = this.floor;
            this.foot.getComponent(cc.Animation).play('heroLDie');
            cc.audioEngine.playEffect(this.deadAudio, false);
            this.isDead = true;
        }
    },
    
    canMove: function(){
        for(var i=0;i<this.enemyArray.length;i++){
            if(this.enemyArray[i] != 0)
                return false;
        }
        return true;
    },
    
    // use this for initialization
    onLoad: function () {console.log(this.node.width +","+ this.background.width + "," + this.background.x);
        this.lbw = this.lifeBar.width;
        this.life = this.wholeLife;
        this.isDead = false;
        this.lastDir = 'L';
        this.lastAction = 'S';
        this.releaseTime = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.keyLoc = 0;
        this.lastkeyAngle = 0;
        this.lastScale = 1;
        this.eventListen();
        this.rotateLock = 0;
        this.lastKeylocate = 0;
        this.Xchange = this.node.width/2;
        this.Ychange = this.node.height/2;
        this.floor = this.mapFloor(this.foot.x);
        this.JumpLock = 1;
        this.keyArray = new Array(0,0,0);
        this.downLock = 0;
        this.downSwitch = 1;
        this.downReal = 0;
        this.bulletPool = new cc.NodePool('bullet');
        for (let i = 0; i < 10; ++i) {
            let blt = cc.instantiate(this.bullet);
            this.bulletPool.put(blt); 
        }
        this.handSita = Math.atan(((this.hand.anchorX-0.1)*this.hand.width)/((this.hand.anchorY-0.15)*this.hand.height))*180/3.14;
        this.handR = (this.hand.anchorX-0.1)*this.hand.width/Math.sin(this.handSita*3.14/180)-10;
        //this.dropLock = 1;
        this.enemyPool = new cc.NodePool('enemy');
        for (let i = 0; i < 10; ++i) {
            let enm = cc.instantiate(this.enemy);
            this.enemyPool.put(enm); 
        }
        
        this.enemyArray = new Array();
        this.enemyXArray = new Array();
        for(var i=0;i<10;i++){
            this.enemyArray.push(0);
        }
        this.createEnemy(400);
        this.ce = 0;
        this.ctime = 0;
        
        this.isGameover = false;
    },

    createEnemy : function(x){
        var e = this.spawnEnemy();
        this.node.addChild(e.node);
        var ep = cc.p(x,this.mapFloor(x));
        e.node.setPosition(ep);
        e.init(this);
        e.play('enemyR');
        for(var i=0;i<10;i++){
            if(this.enemyArray[i]==0){
                this.enemyArray[i] = e;
                e.initILoc(i);
                break;
            }
        }
    },
    
    gameoverW: function(){
        this.hand.active = false;
        this.body.active = false;
        this.foot.active = false;
        this.background.active = false;
        this.barrier1.active = false;
        this.barrier2.active = false;
        this.lifeBar.active = false;
        for(var i=0;i<this.enemyArray.length;i++){
            if(this.enemyArray[i] != 0)
                this.enemyArray[i].node.active = false;
        }
        this.gameover.active = true;
        this.gameoverWin.node.active = true;
        this.reBtn.active = true;
        this.isGameover = true;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(!this.isDead&&!this.isGameover){
            if(this.releaseTime!=0){
                this.releaseTime += dt;
                if(this.releaseTime>0.5){
                    this.foot.getComponent(cc.Animation).play(this.AnimName + this.lastDir + 'S');
                    this.releaseTime = 0;
                    this.lastAction = 'S';
                    this.xSpeed = 0;
                }
            }
            if((this.JumpLock == 0 && this.foot.y > this.mapFloor(this.foot.x + this.xSpeed * dt)) || (this.JumpLock != 0 && this.mapFloor(this.foot.x + this.xSpeed * dt) <= this.floor)){
                this.hand.x += this.xSpeed * dt;
                this.foot.x += this.xSpeed * dt;
                this.body.x += this.xSpeed * dt;
                if(this.foot.x > this.barrier2.x+this.barrier2.width && this.foot.x >= this.node.width/2 + 5){
                    this.gameoverWin.string = 'You Win!';
                    this.gameoverW();
                    return;
                }
            }
            if(this.foot.y + this.ySpeed * 0.08 > this.mapFloor(this.foot.x)){
                this.hand.y += this.ySpeed * 0.08;
                this.foot.y += this.ySpeed * 0.08;
                this.body.y += this.ySpeed * 0.08;
            }
            this.floor = this.mapFloor(this.foot.x);
            if(this.JumpLock == 0){
               if(this.foot.y==this.floor){
                    this.ySpeed = 0;
                    this.JumpLock = 1;
                    this.foot.getComponent(cc.Animation).play(this.AnimName + this.lastDir + 'S');
                    this.lastAction = 'S';
                }
                else if(this.ySpeed<0&&this.foot.y <= -1*this.ySpeed*0.08+this.floor&&this.foot.y>this.floor){
                    this.hand.y += this.floor - this.foot.y;
                    this.body.y += this.floor - this.foot.y;
                    this.foot.y += this.floor - this.foot.y;
                    this.ySpeed = 0;
                    this.JumpLock = 1;
                    this.foot.getComponent(cc.Animation).play(this.AnimName + this.lastDir + 'S');
                    this.lastAction = 'S';
                }else{
                    this.ySpeed -= 10;
                } 
            }
            if(this.rotateLock != 0){
                var an = 0;
                if(this.keyLoc!=0)
                    an = this.rotateAngle(this.keyLoc);
                if(this.lastkeyAngle != an){
                    this.hand.runAction(cc.rotateTo(dt/2, an));
                    this.lastkeyAngle = an;
                }
            }
            if(this.keyArray[0]!=0&&this.keyArray[1]!=0){
                this.xSpeed = 0;
                return;
            }
            if(this.keyArray[0]!=0){
                if(this.JumpLock == 0)
                    this.foot.getComponent(cc.Animation).play(this.AnimName + 'LJ');
                if(this.keyArray[2]!=0)
                    this.doAction('L', 'D');
                else
                    this.doAction('L','W');
                if(this.foot.x + this.Xchange < 0)
                    this.xSpeed = 0;
            }
            if(this.keyArray[1]!=0){
                if(this.JumpLock == 0)
                    this.foot.getComponent(cc.Animation).play(this.AnimName + 'RJ');
                if(this.keyArray[2]!=0)
                    this.doAction('R','D');
                else
                    this.doAction('R','W');
                if(this.canMove()&&(this.foot.y == this.floor||this.JumpLock ==0) && this.foot.x + this.Xchange > this.node.width/2 && this.background.x + this.Xchange > this.node.width - this.background.width){
                    this.xSpeed = 0;
                    this.background.x -= 300 * dt;
                    this.barrier1.x -= 300 * dt;
                    this.barrier2.x -= 300 * dt;
                    for(var i=0;i<10;i++){
                        if(this.enemyArray[i]!=0){
                            this.enemyArray[i].node.x -= 300 * dt;
                        }
                    }
                }else if((this.foot.y == this.floor||this.JumpLock ==0) && this.foot.x + this.Xchange > this.node.width/2 && (this.background.x <= this.node.width - this.background.width)||!this.canMove())
                    this.xSpeed = 300;
            }
            if(this.downLock != 0)
                this.doAction('','DS');
            if(this.JumpLock != 0&&this.foot.y > this.floor)
                this.JumpLock = 0;
            if(this.barrier1.x < -1 * this.node.width/2 && this.ce <= 5 && this.ctime > Math.random()*5){
                this.ce ++;
                this.createEnemy(this.node.width/2);
                this.ctime = 0;
            }
            if(this.barrier2.x < this.node.width/2 && this.ce <= 10 && this.ctime > Math.random()*5){
                this.ce ++;
                this.createEnemy(Math.random() > 0.5 ? this.node.width/2 : -1 * this.node.width/2);
                this.ctime = 0;
            }
            this.ctime += dt;
            this.isHeroDead();
        }else if(this.isDead){
            this.gameoverWin.string = 'You Dead!';
            this.gameoverW();
        }
    },
});
