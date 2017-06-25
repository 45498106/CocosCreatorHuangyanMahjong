var GameDataMgr = require("GameDataMgr");
var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");

cc.Class({
    extends: cc.Component,

    properties: {
        readyN : cc.Node, 
        reportN : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        NetMessageMgr.addMessageCB(NetProtocolList.PrepareAckMessageNum.netID, 
            this.prepareCallback, this);
        NetMessageMgr.addMessageCB(NetProtocolList.DissolveRoomAckMessageNum.netID, 
            this.dissolveRoomCallback, this);
        NetMessageMgr.addMessageCB(NetProtocolList.ExitRoomAckMessageNum.netID, 
            this.exitRoomCallback, this);
        NetMessageMgr.addMessageCB(NetProtocolList.FaPaiMessageNum.netID,
            this.startFaPai, this);
    },

    onDestory : function () {
        NetMessageMgr.rmMessageCB(NetProtocolList.PrepareAckMessageNum.netID, 
            this.prepareCallback);
        NetMessageMgr.rmMessageCB(NetProtocolList.DissolveRoomAckMessageNum.netID, 
            this.dissolveRoomCallback);
        NetMessageMgr.rmMessageCB(NetProtocolList.ExitRoomAckMessageNum.netID, 
            this.exitRoomCallback);
        NetMessageMgr.rmMessageCB(NetProtocolList.FaPaiMessageNum.netID,
            this.startFaPai)
    },


    showIn : function() {
        this.readyN.active = true;
        this.readyN.getChildByName('btnUnReady').active = false;
    },

    onEveryOneReady : function(){
        var self = this;
        var moveAct = cc.moveTo(0.3, cc.p(0, -800));
        this.readyN.runAction(cc.sequence(moveAct, cc.callFunc(function(){
            self.readyN.active = false;
        })))
    },

    onBtnDissolveClicked : function () {
        this.dissolvedRoom();
    },

    onBtnExitClicked : function () {
        this.exitOutRoom();  
    },

    startFaPai : function(){
        this.onEveryOneReady();
    },

    //准备
    onBtnReadyClicked : function(){
        // this.readyN.getChildByName('btnUnReady').active = true;
        this.prepareToPlay();
    }, 

    //取消准备
    onBtnUnReadyClicked : function(){
        this.readyN.getChildByName('btnReady').active = true;
        this.readyN.getChildByName('btnUnReady').active = false;
        this.unPrepareToPlay();
    }, 

    refreReadyData : function(){
        var roomInfo = GameDataMgr.getRoomInfo();
        var centerN  = this.readyN.getChildByName("center");
        var roomIdN  = centerN.getChildByName("roomNumber").getChildByName('content');
        roomIdN.getComponent(cc.Label).string = roomInfo.RoomID;
    },

    /*-----------------------------  Server Message -------------------------*/
    prepareToPlay : function (argument) {
        var content = {};
        content.PlayerID = GameDataMgr.getUserID();
        NetMessageMgr.send(NetProtocolList.PrepareMessageNum.netID, content);
    },

    prepareCallback : function (content) {
        this.reportN.active = false;
        this.readyN.getChildByName('btnReady').active = false; 
        require("gameManager").selfReadToPlay(true);
    },

    dissolvedRoom : function () {
        var content    = {}
        content.roomID = "11111";
        NetMessageMgr.send(NetProtocolList.DissolveRoomMessageNum.netID, content);
    },

    exitOutRoom : function(){
        var content    = {}
        content.roomID = "11111";
        NetMessageMgr.send(NetProtocolList.ExitRoomMessageNum.netID, content);
    },

    exitRoomCallback : function(data){
        require("gameManager").exiteRoom();
    },

    dissolveRoomCallback : function(){
        require("gameManager").exiteRoom()
    },

    //取消准备
    unPrepareToPlay : function(argument) {

    },

    /*-----------------------------  End -----------------------------------*/

});
