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
        //PuTongHu  = 0
        //MingGang2 = 1
        //PengPai   = 2
        //ChiPai    = 3
        //ZiMoHu    = 4
        //AnGang    = 5
        //MingGang1 = 6
        //qianggang = 7;
        //guo       = 8;
        var tagList = [];
        tagList[0]  = "btnHu";//
        tagList[1]  = "btnGang";//
        tagList[2]  = "btnPeng";//
        tagList[3]  = "btnChi";//
        tagList[4]  = "btnHu";//
        tagList[5]  = "btnGang";//
        tagList[6]  = "btnGang";//
        tagList[7]  = "btnHu";//
        tagList[8]  = "btnGuo";//
        this.ShowTagNodeList = tagList


    },

    onDestroy : function(){
        cc.log(" this opts prefab ui  destroy ")
    },
    
    init : function(gameUI, eatObj, showTag){
        this.gameUI  = gameUI;
        this.eatObj  = eatObj;
        var childName = this.ShowTagNodeList[showTag]
        this.node.getChildByName(childName).active = true;
    },
    
    onMeChilcked : function(){
        this.eatObj.cb.call(this.gameUI, this.eatObj);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
