cc.Class({
    extends: cc.Component,

    properties: {
        zhanjiNode : cc.Node,
        bgNode : cc.Node,
        detailsNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onBtnDetailsClicked : function(){
        this.bgNode.active = false;
        this.detailsNode.active = true;
    },

    onBtnDetailsCloseClicked : function(){
        this.bgNode.active = true;
        this.detailsNode.active = false;
    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.zhanjiNode.active = false;
            }) )
        this.zhanjiNode.runAction(outAction);
    },
});
