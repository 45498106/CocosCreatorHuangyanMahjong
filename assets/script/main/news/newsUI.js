cc.Class({
    extends: cc.Component,

    properties: {
        newsNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.newsNode.active = false;
            }) )
        this.newsNode.runAction(outAction);
    },
});
