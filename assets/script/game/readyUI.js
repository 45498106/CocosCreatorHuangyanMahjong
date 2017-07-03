var GameDataMgr     = require("GameDataMgr");
var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");
var gameManager     = require("gameManager");
var GameDefine      = require("GameDefine");
var log             = require("utils").log;
cc.Class({
    extends: cc.Component,

    properties: {
        readyN : cc.Node, 
        reportN : cc.Node,
        btnBack : cc.Node,
    },

    onLoad : function(){
        this.initUI();
        this.registerMessage();
        this.btnBack.active = false;
        this.readyN.getChildByName('btnUnReady').active = false;
        gameManager.addDestoryCB(this.meDestory, this);
    },

    meDestory : function(){
        this.unRegisterMesage();
    },

    initUI : function(){
        var isMaster = GameDataMgr.getRoomMaster();
        this.readyN.getChildByName("btnDissolve").active = isMaster;
        this.readyN.getChildByName("btnOut").active = !isMaster;
    },

    // use this for initialization
    registerMessage: function () {
        var nmm = NetMessageMgr;
        var npl = NetProtocolList; 
        nmm.addMessageCB(npl.PrepareAckMessageNum.netID, this.prepareCallback, this);
        nmm.addMessageCB(npl.DissolveRoomAckMessageNum.netID, this.DissolveRoomAckMessage, this);
        nmm.addMessageCB(npl.ExitRoomAckMessageNum.netID, this.ExitRoomAckMessage, this);
        nmm.addMessageCB(npl.FaPaiMessageNum.netID,this.startFaPai, this);
    },

    unRegisterMesage : function () {
        var nmm = NetMessageMgr;
        var npl = NetProtocolList;
        nmm.rmMessageCB(npl.PrepareAckMessageNum.netID, this.prepareCallback);
        nmm.rmMessageCB(npl.DissolveRoomAckMessageNum.netID, this.DissolveRoomAckMessage);
        nmm.rmMessageCB(npl.ExitRoomAckMessageNum.netID, this.ExitRoomAckMessage);
        nmm.rmMessageCB(npl.FaPaiMessageNum.netID, this.startFaPai)
    },

    onEveryOneReady : function(){
        var self = this;
        var moveAct = cc.moveTo(0.3, cc.p(0, -800));
        this.readyN.runAction(cc.sequence(moveAct, cc.callFunc(function(){
            self.readyN.active = false;
            gameManager.rounAnimFinished = true;
            gameManager.checkPaiDataReady();

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
        this.btnBack.active = true;
    },

    //准备
    onBtnReadyClicked : function(){
        // this.readyN.getChildByName('btnUnReady').active = true;
        this.prepareToPlay();
    }, 

    //取消准备
    onBtnUnReadyClicked : function(){
        this.unPrepareToPlay();
    }, 

    refreRoomData : function(){
        var roomInfo = GameDataMgr.getRoomInfo();
        var centerN  = this.readyN.getChildByName("center");
        var roomIdN  = centerN.getChildByName("roomNumber").getChildByName('content');
        var roomInfoN= centerN.getChildByName("info");
         roomIdN.getComponent(cc.Label).string = roomInfo.RoomID;
        var tipsContent   = roomInfoN.getChildByName("tips").getChildByName("content");
        var countContent  = roomInfoN.getChildByName("playCount").getChildByName("content");
        var chargeContent = roomInfoN.getChildByName("charge").getChildByName("content");
        var localDefine   = GameDefine.CREATROOM_TYPE;
        var roomTypeName  = localDefine.NoticeType[roomInfo.NoticeType].name;
        var gameNumName   = localDefine.GameNum[roomInfo.GameNum].name;
        var payTypeName   = localDefine.PaymentMethod[roomInfo.PaymentMethod].name;
        tipsContent.getComponent(cc.Label).string   = roomTypeName
        countContent.getComponent(cc.Label).string  = gameNumName
        chargeContent.getComponent(cc.Label).string = payTypeName
        this.refreBtnReady();
    },

    refreBtnReady : function(){
        var mePlayerData = GameDataMgr.getSelfPlayerData();
        var isReady      = (mePlayerData.Status === GameDefine.PLAYER_READY.READY)
        this.readyN.getChildByName('btnReady').active = !isReady; 
    },

    /*-----------------------------  Server Message -------------------------*/
    prepareToPlay : function (argument) {
        var content = {};
        content.PlayerID = GameDataMgr.getUserID();
        NetMessageMgr.send(NetProtocolList.PrepareMessageNum.netID, content);
    },

    prepareCallback : function (content) {
        this.reportN.active = false;
        GameDataMgr.getSelfPlayerData().Status = GameDefine.PLAYER_READY.READY;
        gameManager.refreshDeskPlayersData();
        this.refreBtnReady();
    },

    dissolvedRoom : function () {
        var content    = {}
        content.roomID = GameDataMgr.getRoomInfo().RoomID;
        NetMessageMgr.send(NetProtocolList.DissolveRoomMessageNum.netID, content);
    },

    exitOutRoom : function(){
        var content    = {}
        content.roomID = GameDataMgr.getRoomInfo().RoomID;
        NetMessageMgr.send(NetProtocolList.ExitRoomMessageNum.netID, content);
    },

    ExitRoomAckMessage : function(data){
        gameManager.exiteRoom();
    },

    DissolveRoomAckMessage : function(){
       gameManager.exiteRoom();
    },

    //取消准备
    unPrepareToPlay : function(argument) {

    },

    /*-----------------------------  End -----------------------------------*/

});
