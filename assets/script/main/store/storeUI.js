cc.Class({
    extends: cc.Component,

    properties: {
       storeNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.storeNode.active = false;
            }) )
        this.storeNode.runAction(outAction);
    },
});
