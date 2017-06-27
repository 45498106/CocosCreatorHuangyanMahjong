cc.Class({
    extends: cc.Component,

    properties: {
       storeNode    : cc.Node,
       shopListNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    onBtnBuyRoomCardClicked : function(event, customEventData){
        cc.log("--- customEventData:", customEventData)
        
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
