var utils           = require("utils");
var log             = utils.log;
var NetMessageMgr   = require("NetMessageMgr");
var GameDataMgr     = require("GameDataMgr");
var NetProtocolList = require("NetProtocolList");
var mainUI = cc.Class({
    extends: cc.Component,

    properties: {
        canvasNode      : cc.Node, //场景节点
        storeNode       : cc.Node, //商店
        setNode         : cc.Node, //设置
        enterRoomN      : cc.Node, //输入房间号码
        testN           : cc.Node, //测试
        newsNode        : cc.Node, //消息
        zhanjiNode      : cc.Node, //战绩
        craeteRoomNode  : cc.Node, //创建房间
    },

    // use this for initialization
    onLoad: function () {
        this.startIsClicked = false;
        this.regisgerNetMessage();
        this.refreUserID();

        this.onDeviceFunc();
    },

    onDestroy : function(){
        this.unRegisgerNetMessage();
    },

    // test
    onJavaToJavascript : function (){
        log("===== this is java to javascript.");
    },
    // 不同设备区分
    onDeviceFunc : function(){
        var ua = navigator.userAgent.toLowerCase();
        if(/iphone|ipad|ipod/.test(ua)){
            log("=== 这是ios设备. ===");
        } else if(/android/.test(ua)){
            log("=== 这是android设备. ===");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "test", "(Ljava/lang/String;)V", "cocos creator.");
            var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "returnJsSum", "(I)I", 3);
            log("===== result", result);
        }else{
            log("=== 这是windows设备. ===");
        }
    },
    
    //创建房间
    onBtnStartClicked : function(){
        // if(this.startIsClicked){return}
        // this.startIsClicked = true;    
        this.creatGameRoomToServer();

    },

    //进入牌桌开始打麻将
    gotoGameRoom : function(){
        this.canvasNode.runAction(cc.fadeOut(0.8));
        cc.director.loadScene("game");
    },

    //进入商店
    onBtnStoreClicked : function(){
        this.actionFunc(this.storeNode);
    },

    //进入设置
    onBtnSetClicked : function(){
        this.actionFunc(this.setNode);
    },

    //进入消息
    onBtnNewsClicked : function(){
        this.actionFunc(this.newsNode);
    },

    //进入战绩
    onBtnZhanjiClicked : function(){
        this.actionFunc(this.zhanjiNode);
    },
    onBtnCreateRoomClicked : function(){
        this.actionFunc(this.craeteRoomNode);
    },
    //进入场景的动作
    actionFunc : function(node){
        node.active = true;
        node.scale = 1;
        node.opactiy = 0;
        node.runAction(cc.fadeIn(0.5));
    },

    //清空输入的房间号码
    cleanEnterNumber : function () {
        this.enterNumList = [];
        this.refreEnterNumber();
    },

    //刷新输入的房间号码数字
    refreEnterNumber : function () {
        var numberNode = this.enterRoomN.getChildByName("enterNumber");
        for(let i = 1; i<7; i++){
            let numN = numberNode.getChildByName("num_"+i);
            let content = numN.getChildByName("content");
            content.getComponent(cc.Label).string = this.enterNumList[i-1] || "";
        }
    },
    

    //显示输入房间号
    onBtnEnterRoomShow : function () {
        this.cleanEnterNumber();
        this.enterRoomN.active = true;
    },

    //关闭输入房间号
    onBtnEnterRoomClose : function () {
        this.enterRoomN.active = false;  
    },

    //输入号码
    onBtnEnterRoomEnter : function (event, enterNumber) {
        //输入号码满了 进入房间
        if(this.enterNumList.length === 6){
            this.sendRoomNumToServer();
        } else if(this.enterNumList.length < 6) {
            this.enterNumList.push(enterNumber);
            this.refreEnterNumber();
        }
    },

    onChangeUserID : function(event, id) {
        GameDataMgr.setUserID(parseInt(id));
        this.refreUserID();
    },

    refreUserID : function(){
        var idLabel = this.testN.getChildByName("name").getComponent(cc.Label);
        var contentStr = "您的用户ID是 " + GameDataMgr.getUserID(); 
        idLabel.string = contentStr;
    },

    //删除输入的号码
    onBtnEnterRoomDelete : function (event, enterNumber) {
        this.enterNumList.pop();
        this.refreEnterNumber();
    },

    //清空输入的号码
    onBtnEnterRoomClear : function (event, enterNumber) {
        this.enterNumList.splice(0, this.enterNumList.length);
        this.refreEnterNumber();
    },


    //--------------To Server ----------------
    regisgerNetMessage : function () {
        //输入房间号码放回的信息
        NetMessageMgr.addMessageCB(NetProtocolList.EnterRoomAckMessageNum.netID, 
            this.onRoomMessageAck, this)
        //创建房间返回的信息
        NetMessageMgr.addMessageCB(NetProtocolList.CreateRoomAckMessageNum.netID, 
            this.onCreatRoomAck, this)
    },

    unRegisgerNetMessage : function(){
        NetMessageMgr.rmMessageCB(NetProtocolList.EnterRoomAckMessageNum.netID, 
            this.onRoomMessageAck)
        NetMessageMgr.addMessageCB(NetProtocolList.CreateRoomAckMessageNum.netID, 
            this.onCreatRoomAck)
    },

    sendRoomNumToServer : function () {
        var roomNumber = "";
        this.enterNumList.forEach(function(num){
            roomNumber += num; 
        })
        var roomID = parseInt(roomNumber);
        GameDataMgr.getRoomInfo().RoomID = roomID;
        var sendData = {
            PlayerID : GameDataMgr.getUserID(),//玩家帐号
            RoomID   : roomID,//房间id
        }
        NetMessageMgr.send(NetProtocolList.EnterRoomMessageNum.netID, sendData);
    },

    creatGameRoomToServer : function(){
        var roomInfo = {
                NoticeType : 2,
                GameNum : 1,
                PaymentMethod : 1,
        }
        GameDataMgr.setRoomInfo(roomInfo);
        var sendData = {
            PlayerID : GameDataMgr.getUserID(),//玩家帐号
            RoomInformation   : roomInfo,//房间信息
        }
        log("send NetProtocolList", NetProtocolList)
        NetMessageMgr.send(NetProtocolList.CreateRoomMessageNum.netID, sendData);
    },

    //返回房间信息
    onRoomMessageAck : function(data){
        log("-onRoomMessageAck---", data)
        data.RoomInformation.RoomID = GameDataMgr.getRoomInfo().RoomID;
        GameDataMgr.setRoomInfo(data.RoomInformation);
        GameDataMgr.setRoomPlayers(data.PlayersInfo);
        this.gotoGameRoom();
    },

    //创建房间信息
    onCreatRoomAck : function(data){
        log("-onCreatRoomAck-创建房间信息--", data)
        var roomInfo = GameDataMgr.getRoomInfo();
        var PlayersInfo = GameDataMgr.getRoomPlayers();
        PlayersInfo.push(data.PlayerInfo)
        GameDataMgr.setRoomPlayers(PlayersInfo);
        roomInfo.RoomID = data.RoomID;
        this.gotoGameRoom();
    },

    //--------------End Server ----------------

});
