cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {

    },
    
    init: function(startF){
        this.startF = startF;
    },
    
    changeWin: function(){
        this.startF.military.active = false;
        this.startF.rescue.active = false;
        this.startF.welcome.active = false;
        this.startF.welcome1.active = false;
        this.startF.welcome2.active = false;
        this.startF.welcome3.active = false;
        this.startF.welcome4.active = false;
        this.startF.btn.active = false;
        
        this.startF.welcomeNext.active = true;
        this.startF.military2.active = true;
        this.startF.rescue2.active = true;
        this.startF.nextBtn.active = true;
        this.startF.pvpBtn.active = true;
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
