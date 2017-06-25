cc.Class({
    extends: cc.Component,

    properties: {
       setNode : cc.Node,
       languageLayerNode : cc.Node,
       bindPhoneLayerNode : cc.Node,
       writeOffBtnNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onBtnChooseLanguageClicked : function(){
        this.languageLayerNode.active = true;
        this.writeOffBtnNode.opacity = 150;
    },

    onBtnBindPhoneClicked : function(){
        this.bindPhoneLayerNode.active = true;
        this.writeOffBtnNode.opacity = 150;
    },

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
    },
});
