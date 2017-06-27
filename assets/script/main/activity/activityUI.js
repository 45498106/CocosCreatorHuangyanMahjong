var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");

cc.Class({
    extends: cc.Component,

    properties: {
        activityNode : cc.Node,
        leftBoxNode  : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.isFirstIn = false;
    },

    update: function(){
        if(this.activityNode.active && !this.isFirstIn){
            this.onBtnActivityClicked(null, 1);
            this.isFirstIn = true;
        }
    },

    onBtnActivityClicked : function(event, btn){
        for(let i=1; i<4; i++){
            this.leftBoxNode.getChildByName("btnActivity"+i).active = true;
            this.leftBoxNode.getChildByName("btnDown"+i).active = false;
        }  
        this.leftBoxNode.getChildByName("btnActivity"+btn).active = false;
        this.leftBoxNode.getChildByName("btnDown"+btn).active = true;
        var AnnouncementID = {};
        // AnnouncementID.id = new Array();
        // AnnouncementID.id[btn-1] = btn;
        AnnouncementID.id = [];
        NetMessageMgr.send(NetProtocolList.GetAnnouncementNum.netID, AnnouncementID);
    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.activityNode.active = false;
            }) )
        this.activityNode.runAction(outAction);

        this.isFirstIn = false;
    },

});
