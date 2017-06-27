var UserLocalData = require("UserLocalData");
var Audio         = require("Audio");

cc.Class({
    extends: cc.Component,

    properties: {
       setNode : cc.Node,
       languageLayerNode  : cc.Node,
       bindPhoneLayerNode : cc.Node,
       writeOffBtnNode    : cc.Node,
       soundToggleNode    : cc.Node,
       musicToggleNode    : cc.Node,
       languageList1      : cc.Node,
       languageList2      : cc.Node,
       languageList3      : cc.Node,
       languageList4      : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.setInitFunc();
    },

    setInitFunc : function(){
        this.soundToggleNode.getChildByName("checkmark").active = UserLocalData.getSoundSwitch();
        this.musicToggleNode.getChildByName("checkmark").active = UserLocalData.getMusicSwitch();
        this.btnStatusChanged(UserLocalData.getAudioKind());
    },

    //检查哪些语言资源文件存在
    checkLanguageEixt : function(){
        var isFileExist;
        var ua = navigator.userAgent.toLowerCase();
        if(/iphone|ipad|ipod/.test(ua) || /android/.test(ua)){
            isFileExist = jsb.fileUtils.isFileExist(path);
        }
        // cc.log("=== isFileExist:", isFileExist)
    },

    //进入选择语言界面
    onBtnChooseLanguageClicked : function(){
        Audio.playSound("_close.wav", false, 1);
        this.languageLayerNode.active = true;
        this.writeOffBtnNode.opacity = 150;
        this.checkLanguageEixt();
    },

    //选择或下载某种语言
    onBtnLanguageListClicked : function(event, kind){
        UserLocalData.setAudioKind(kind);
        this.btnStatusChanged(kind);
    },
    //选择语言按钮状态变化
    btnStatusChanged : function(lanKind){
        var num;
        if(lanKind == "mandarin") num = 1;
        else if(lanKind == "hyDialect") num = 2;
        else if(lanKind == "papiJ") num = 3;
        else if(lanKind == "xiaozhi") num = 4;
        for(let i=1; i<5; i++){
            var list = this["languageList"+i];
            list.getChildByName("langBtn").getChildByName("label").getComponent(cc.Label).string = "使  用";
            list.getChildByName("langBtnUsed").active = false;
            list.getChildByName("langBtn").active = true;
        }
        this["languageList"+num].getChildByName("langBtnUsed").active = true;
        this["languageList"+num].getChildByName("langBtn").active = false;
    },

    //进入手机绑定界面
    onBtnBindPhoneClicked : function(){
        this.bindPhoneLayerNode.active = true;
        this.writeOffBtnNode.opacity = 150;
    },




    //以下是关闭按钮执行函数
    onBtnCloseLanguageClicked : function(){
        this.languageLayerNode.active = false;
        this.writeOffBtnNode.opacity = 255;
    },

    onBtnCloseBindPhoneClicked : function(){
        this.bindPhoneLayerNode.active = false;
        this.writeOffBtnNode.opacity = 255;
    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.setNode.active = false;
            }) )
        this.setNode.runAction(outAction);

        UserLocalData.setSoundSwitch(this.soundToggleNode.getChildByName("checkmark").active);
        UserLocalData.setMusicSwitch(this.musicToggleNode.getChildByName("checkmark").active);
    },
});
