cc.Class({
    extends: cc.Component,

    properties: {
        welcome:{
            default:null,
            type: cc.Node
        },
        welcome1:{
            default:null,
            type: cc.Node
        },
        welcome2:{
            default:null,
            type: cc.Node
        },
        welcome3:{
            default:null,
            type: cc.Node
        },
        welcome4:{
            default:null,
            type: cc.Node
        },
        btn:{
            default:null,
            type: cc.Node
        },
        audio: {
            default: null,
            url: cc.AudioClip
        },
        military:{
            default:null,
            type: cc.Node
        },
        rescue: {
            default: null,
            type: cc.Node
        },
        welcomeNext: {
            default: null,
            type: cc.Node
        },
        military2: {
            default: null,
            type: cc.Node
        },
        rescue2: {
            default: null,
            type: cc.Node
        },
        nextBtn: {
            default: null,
            type: cc.Node
        },
        pvpBtn: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        this.st = true;
        this.m = 0;
        this.r = 0;
        this.w1 = 0;
        this.w2 = 0;
        this.w3 = 0;
        this.w4 = 0;
        this.btnt = 0;
        this.btn.getComponent("StartBtn").init(this);
    },
    
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.st){
            if(this.m > 0.5){
                this.military.active = true;
                this.m = -1000;
            }
            if(this.r > 1){
                this.rescue.active = true;
                this.r = -1000;
            }
            if(this.w1 > 1.25){
                this.welcome1.active = true;
                cc.audioEngine.playEffect(this.audio, false); 
                this.w1 = -1000;
            }
            if(this.w2 > 1.5){
                this.welcome2.active = true;
                cc.audioEngine.playEffect(this.audio, false); 
                this.w2 = -1000;
            }
            if(this.w3 > 1.75){
                this.welcome3.active = true;
                cc.audioEngine.playEffect(this.audio, false); 
                this.w3 = -1000;
            }
            if(this.w4 > 2){
                this.welcome4.active = true;
                cc.audioEngine.playEffect(this.audio, false); 
                this.w4 = -1000;
            }
            if(this.btnt > 2.5){
                this.btn.active = true;
                this.st = false;
            }
            this.m += dt;
            this.r += dt;
            this.w1 += dt;
            this.w2 += dt;
            this.w3 += dt;
            this.w4 += dt;
            this.btnt += dt;
        }
        
    },
});
