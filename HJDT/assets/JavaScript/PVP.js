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
        enhand: {
            default: null,
            type: cc.Node
        },
        enbody: {
            default: null,
            type: cc.Node
        },
        enfoot: {
            default: null,
            type: cc.Node
        },
        bullet: {
            default: null,
            type: cc.Prefab
        },
        ebullet: {
            default: null,
            type: cc.Prefab
        },
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        lifeBar: {
            default: null,
            type: cc.Node
        },
        enlifeBar: {
            default: null,
            type: cc.Node
        },
        wholeLife : "",
        enwholelife:"",
        deadAudio: {
            default: null,
            url: cc.AudioClip
        },
        gameover:{
            default:null,
            type:cc.Node
        },
        gameoverLabel: {
            default:null,
            type:cc.Label
        },
        gameoverBtn: {
            default:null,
            type:cc.Node
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
        var self = this;
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
            return b.getComponent('PVPBullet');
        } else {
            b = cc.instantiate(this.bullet).getComponent('PVPBullet');
            return b;
        }
    },

    despawnBullet: function (bullet) {
        this.bulletPool.put(bullet);
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
    
    enDoAction : function(dir,action){
        if(this.enisDead)
            return;
        if(action == 'S'){
            this.enfoot.getComponent(cc.Animation).play(this.AnimName + dir + action);
            this.enxSpeed = 0;
            return;
        }
        if(dir == 'J'){
            if(this.enJumpLock != 0&&this.enfoot.y == this.floor){
                this.enfoot.getComponent(cc.Animation).play(this.AnimName + this.enlastDir + action);
                this.enySpeed = 250;
                this.enJumpLock = 0;
                return;
            }
        }
        else if(this.enlastAction == 'S' || dir != this.enlastDir){
            if(this.enJumpLock != 0)
                this.enfoot.getComponent(cc.Animation).play(this.AnimName + dir + action);

            this.enlastDir = dir;
            this.enlastAction = 'W';
            var dirN = dir == 'L'?1:-1;
            this.enxSpeed = dirN * -300;
        }
    },
    
    enrotateAngle : function(po){
        var anchor = cc.p(this.enhand.x+this.Xchange,this.enhand.y+this.Ychange);
        var tempAngle = 0;
        if(po.x<=anchor.x){
            if(this.enlastScale != 1){
                this.enhand.runAction(cc.scaleTo(0.005, 1,1));
                this.enbody.runAction(cc.scaleTo(0.005,1,1));
                this.enlastScale = 1;
            }
            tempAngle = cc.pAngleSigned(cc.p(po.x-anchor.x,po.y-anchor.y),cc.p(-50,0))*180/3.14;
            if(tempAngle<-90){
                tempAngle = 0;
            }else{
                tempAngle += 25;
            }
        }else{
            if(this.enlastScale != -1){
                this.enhand.runAction(cc.scaleTo(0.005, -1,1));
                this.enbody.runAction(cc.scaleTo(0.005,-1,1));
                this.enlastScale = -1;
            }
            tempAngle = cc.pAngleSigned(cc.p(50,0),cc.p(po.x-anchor.x,po.y-anchor.y))*180/3.14;
            if(tempAngle<-90)
                tempAngle = 0;
            else
                tempAngle = -25-tempAngle;
        }
        return tempAngle;
    },
    
    enshoot: function(po){
        if(this.enisDead)
            return;
        var anchor = cc.p(this.enhand.x+this.Xchange,this.enhand.y+this.Ychange);
        var p = 0;
        var dir = 1;
        var b = this.spawnEBulllet();
        this.node.addChild(b.node);
        if(po.x<=anchor.x){
            var tempAngle = cc.pAngleSigned(cc.p(po.x-anchor.x,po.y-anchor.y),cc.p(-50,0))*180/3.14;
            if(tempAngle<-90){
                tempAngle = 0;
            }else{
                tempAngle += 25;
            }
            tempAngle += this.handSita;
            p = cc.p(this.enhand.x - this.enhandR * Math.sin(tempAngle*3.14/180),this.enhand.y - this.enhandR*Math.cos(tempAngle*3.14/180));
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
            p = cc.p(this.enhand.x + this.enhandR * Math.sin(tempAngle*3.14/180),this.enhand.y - this.enhandR*Math.cos(tempAngle*3.14/180));
            dir = 1;
            b.node.setPosition(p);
            b.node.rotation = 90 - tempAngle;
        }

        b.init(this);
        b.play(dir);
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },
    
    spawnEBulllet: function () {
        var b;
        if (this.ebulletPool.size() > 0) {
            b = this.ebulletPool.get();
            return b.getComponent('PVPEbullet');
        } else {
            b = cc.instantiate(this.ebullet).getComponent('PVPEbullet');
            return b;
        }
    },

    despawnEBullet: function (ebullet) {
        this.ebulletPool.put(ebullet);
    },
    
    isEnDead : function(){
        if(this.enlife >= 0)
            this.enlifeBar.width = this.enlife/this.enwholelife * this.lbw;
        if(this.enlife <= 0){
            this.enbody.x = 9000;
            this.enhand.x = 9000;
            this.enfoot.y = this.floor;
            this.enfoot.getComponent(cc.Animation).play('heroLDie');
            cc.audioEngine.playEffect(this.deadAudio, false);
            this.enisDead = true;
        }
    },
 
    // use this for initialization
    onLoad: function () {
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
        this.floor = this.foot.y;
        this.JumpLock = 1;
        this.keyArray = new Array(0,0,0);
        this.downLock = 0;
        this.downSwitch = 1;
        this.downReal = 0;
        this.bulletPool = new cc.NodePool('pvpbullet');
        for (var i = 0; i < 10; ++i) {
            var blt = cc.instantiate(this.bullet);
            this.bulletPool.put(blt); 
        }
        this.handSita = Math.atan(((this.hand.anchorX-0.1)*this.hand.width)/((this.hand.anchorY-0.15)*this.hand.height))*180/3.14;
        this.handR = (this.hand.anchorX-0.1)*this.hand.width/Math.sin(this.handSita*3.14/180)-10;
        //this.enConn = false;
        //this.connect();
        //this.enconnect();
        this.enlife = this.enwholelife;
        this.enisDead = false;
        this.enlastDir = 'L';
        this.enlastAction = 'S';
        this.enlastScale = 1;
        this.enJumpLock = 1;
        this.enySpeed = 0;
        this.enxSpeed = 0;
        this.enfoot.y = this.floor;
        this.ebulletPool = new cc.NodePool('pvpebullet');
        this.enhandR = (this.enhand.anchorX-0.1)*this.enhand.width/Math.sin(this.handSita*3.14/180)+10;
        for (var i = 0; i < 10; ++i) {
            var blt = cc.instantiate(this.ebullet);
            this.ebulletPool.put(blt); 
        }
        this.enshoottime = 0;
    },
    /*
    connect: function(){
        var self = this;
        self.socket = io.connect('http://localhost:3000');
        self.socket.on('connected',function(id){
            self.id = id;
        });
    },
    
    enconnect: function(){
        var self = this;
        self.socket.on('Enconnected',function(id){
            if(id!=0){
                self.enConn = true;
                self.enmove();
            }
            else
                self.enConn = false;
        });
    },
    
    enmove: function(){
        
    },
    */
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(!this.isDead&&!this.enisDead){
            if(this.releaseTime!=0){
                this.releaseTime += dt;
                if(this.releaseTime>0.5){
                    this.foot.getComponent(cc.Animation).play(this.AnimName + this.lastDir + 'S');
                    this.releaseTime = 0;
                    this.lastAction = 'S';
                    this.xSpeed = 0;
                }
            }
            if((this.foot.x + this.xSpeed*dt <= this.node.width/2) && (this.foot.x + this.xSpeed*dt >= -1*this.node.width/2)){
                this.hand.x += this.xSpeed * dt;
                this.foot.x += this.xSpeed * dt;
                this.body.x += this.xSpeed * dt;
            }
            if(this.foot.y + this.ySpeed * 0.08 > this.floor){
                this.hand.y += this.ySpeed * 0.08;
                this.foot.y += this.ySpeed * 0.08;
                this.body.y += this.ySpeed * 0.08;
            }
            
            var an = this.enrotateAngle(cc.p(this.body.x + this.Xchange,this.body.y+this.Ychange - this.body.height/2));
            this.enhand.runAction(cc.rotateTo(dt/2, an));
            
            if(this.JumpLock == 0){
               if(this.foot.y==this.floor){
                    this.ySpeed = 0;
                    this.JumpLock = 1;
                    this.foot.getComponent(cc.Animation).play(this.AnimName + this.lastDir + 'S');
                    this.lastAction = 'S';
                }
                else if(this.ySpeed<0&&this.foot.y + this.ySpeed*0.08 <= this.floor&&this.foot.y>this.floor){
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
            }
            if(this.keyArray[1]!=0){
                if(this.JumpLock == 0)
                    this.foot.getComponent(cc.Animation).play(this.AnimName + 'RJ');
                if(this.keyArray[2]!=0)
                    this.doAction('R','D');
                else
                    this.doAction('R','W');
            }
            if(this.downLock != 0)
                this.doAction('','DS');
            
            this.isHeroDead();
        }
        if(!this.isDead&&!this.enisDead){
            
            if((this.enfoot.x + this.enxSpeed*dt <= this.node.width/2) && (this.enfoot.x + this.enxSpeed*dt >= -1*this.node.width/2)){
                this.enhand.x += this.enxSpeed * dt;
                this.enfoot.x += this.enxSpeed * dt;
                this.enbody.x += this.enxSpeed * dt;
            }
            if(this.enfoot.y + this.enySpeed * 0.08 > this.floor){
                this.enhand.y += this.enySpeed * 0.08;
                this.enfoot.y += this.enySpeed * 0.08;
                this.enbody.y += this.enySpeed * 0.08;
            }

            if(this.enJumpLock == 0){
               if(this.enfoot.y==this.floor){
                    this.enySpeed = 0;
                    this.enJumpLock = 1;
                    this.enfoot.getComponent(cc.Animation).play(this.AnimName + this.lastDir + 'S');
                    this.enlastAction = 'S';
                }
                else if(this.enySpeed<0&&this.enfoot.y + this.enySpeed*0.08 <= this.floor&&this.enfoot.y>this.floor){
                    this.enhand.y += this.floor - this.enfoot.y;
                    this.enbody.y += this.floor - this.enfoot.y;
                    this.enfoot.y += this.floor - this.enfoot.y;
                    this.enySpeed = 0;
                    this.enJumpLock = 1;
                    this.enfoot.getComponent(cc.Animation).play(this.AnimName + this.enlastDir + 'S');
                    this.enlastAction = 'S';
                }else{
                    this.enySpeed -= 10;
                } 
            }
            if(!this.isDead){
                //var an = this.enrotateAngle(cc.p(this.body.x + this.Xchange,this.body.y+this.Ychange));
                //this.enhand.runAction(cc.rotateTo(dt/2, an));
                this.enshoottime += 0.03;
                if(this.enshoottime > Math.random()+0.3){
                    if(Math.random()<0.2)
                        this.enDoAction('J','J');
                    else
                        this.enDoAction(this.body.x < this.enbody.x ? 'L' : 'R', Math.random()>0.5?'W':'S');
                    this.enshoot(cc.p(this.body.x + this.Xchange,this.body.y+this.Ychange - this.body.height/2));
                    this.enshoottime = 0;
                }
            }        
            this.isEnDead();
        }
        if(this.isDead || this.enisDead){
            if(this.isDead)
                this.gameoverLabel.string = "You Dead!";
            else
                this.gameoverLabel.string = "You Win!";
            this.hand.active = false;
            this.body.active = false;
            this.foot.active = false;
            this.enhand.active = false;
            this.enbody.active = false;
            this.enfoot.active = false;
            this.lifeBar.active = false;
            this.enlifeBar.active = false;
            this.gameover.active = true;
            this.gameoverLabel.node.active = true;
            this.gameoverBtn.active = true;
        }
    },
});
