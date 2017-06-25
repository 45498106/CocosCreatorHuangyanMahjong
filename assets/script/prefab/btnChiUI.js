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

    onDestroy : function(){
        cc.log(" thi sis btn ui  destroy ")
    },
    
    init : function(gameUI, eatObj){
        this.gameUI  = gameUI;
        this.eatObj  = eatObj;
        cc.log(this.eatObj);
    },
    
    onMeChilcked : function(){
        cc.log("---this is onMeChilcked");
        this.eatObj.cb.call(this.gameUI, this.eatObj);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
