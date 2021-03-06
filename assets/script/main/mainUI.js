var utils           = require("utils");
var log             = utils.log;
var NetMessageMgr   = require("NetMessageMgr");
var GamePlayDataMgr     = require("GamePlayDataMgr");
var NetProtocolList = require("NetProtocolList");
var Audio           = require("Audio");

var mainUI = cc.Class({
    extends: cc.Component,

    properties: {
        canvasNode      : cc.Node,    //场景节点
        storeNode       : cc.Node,    //商店
        setPrefab       : cc.Prefab,  //设置
        enterRoomN      : cc.Node,    //输入房间号码
        testN           : cc.Node,    //测试
        newsNode        : cc.Node,    //消息
        zhanjiNode      : cc.Node,    //战绩
        craeteRoomNode  : cc.Node,    //创建房间
        bulletinNode    : cc.Node,    //系统公告
        activityNode    : cc.Node,    //活动
        webview         : cc.WebView, //活动网址
        alertPrefab     : cc.Prefab,  //提示框
        toastPrefab     : cc.Prefab,  //提示
    },

    // use this for initialization
    onLoad: function () {
        this.startIsClicked = false;
        this.regisgerNetMessage();
        this.refreUserID();

        this.onDeviceFunc();
        this.getAnnouncementNum();

        Audio.playMusic("BGM-mainUI.mp3");
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
        // var ua = navigator.userAgent.toLowerCase();
        // var data;
        // if(/iphone|ipad|ipod/.test(ua)){
        //     log("=== 这是ios设备 ===");
        // } else if(/android/.test(ua)){
        //     log("=== 这是android设备 ===");
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "test", "(Ljava/lang/String;)V", "cocos creator.");
        //     var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "returnJsSum", "(I)I", 1, 5);
        //     cc.log("----- result = ", result)
        //     // data = "这是android设备 + " + result;
        //     // this.alertPrefabFunc(this.alertPrefab, data);
        // }else{
        //     log("=== 这是开发设备 ===");
        //     data = "这是android设备 + " + "result";
        //     cc.log(data)
        //     this.alertPrefabFunc(this.toastPrefab, data)
        // }

        // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "test", "(Ljava/lang/String;)V", "cocos creator.");
        // var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "returnJsSum", "(I)I", 1, 5);
        // cc.log("----- result = ", result)

        cc.log("---- this is 2017.7.4 ----")
    },

    //弹出提示框
    alertPrefabFunc : function(prefab, msg, cs) {
        var promptBox = cc.instantiate(prefab);
        promptBox.setPosition(cc.p(0, 0));
        this.canvasNode.addChild(promptBox);
        if(prefab.name == "alertPrefab") {
            if (msg || cs) promptBox.getComponent("alertUI").getMessageFrom(msg, cs);
        } else if (prefab.name == "toastPrefab") {
            if (msg || cs) promptBox.getComponent("toastPrefab").getMessageFrom(msg, cs);
        }
    },


    //向服务器请求公告信息
    getAnnouncementNum : function(){
        var ScrollNewsID = {};
        ScrollNewsID.id = [];
        NetMessageMgr.send(NetProtocolList.GetScrollNewsNum.netID, ScrollNewsID);
    },
    
    //创建房间
    onBtnStartClicked : function(){
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
        // this.actionFunc(this.setNode);
        this.copySetPrefab = cc.instantiate(this.setPrefab);
        this.canvasNode.addChild(this.copySetPrefab);
        this.onGetVerificationCodeAck(); //可删除
    },

    //进入消息
    onBtnNewsClicked : function(){
        this.actionFunc(this.newsNode);
    },

    //进入战绩
    onBtnZhanjiClicked : function(){
        this.actionFunc(this.zhanjiNode);
    },

    //创建房间
    onBtnCreateRoomClicked : function(){
        this.actionFunc(this.craeteRoomNode);
    },

    //进入活动
    onBtnActivityClicked : function(){
        this.actionFunc(this.activityNode);
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
        if(this.enterNumList.length === 6)
            return;
        this.enterNumList.push(enterNumber);
        this.refreEnterNumber();
        if(this.enterNumList.length === 6){
            this.sendRoomNumToServer();
        }
    },

    onChangeUserID : function() {
        var id = this.testN.getChildByName("editBox").getComponent(cc.EditBox).string
        GamePlayDataMgr.setUserID(parseInt(id));
        this.refreUserID();
    },

    refreUserID : function(){
        var idLabel = this.testN.getChildByName("layer").getChildByName("name").getComponent(cc.Label);
        var contentStr = "您的用户ID是: " + GamePlayDataMgr.getUserID(); 
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
        //系统滚动公告信息
        NetMessageMgr.addMessageCB(NetProtocolList.GetScrollNewsAckNum.netID, 
            this.onGetScrollNewsAck, this)
        //系统活动公告信息
        NetMessageMgr.addMessageCB(NetProtocolList.GetAnnouncementAckNum.netID, 
            this.onGetAnnouncementAck, this)
        //查看战绩返回的信息
        NetMessageMgr.addMessageCB(NetProtocolList.QueryPanZhanJiAckMessageNum.netID,
            this.onQueryPanZhanJiAck, this)
    },

    unRegisgerNetMessage : function(){
        NetMessageMgr.rmMessageCB(NetProtocolList.EnterRoomAckMessageNum.netID, 
            this.onRoomMessageAck)
        NetMessageMgr.rmMessageCB(NetProtocolList.CreateRoomAckMessageNum.netID, 
            this.onCreatRoomAck)
        NetMessageMgr.rmMessageCB(NetProtocolList.GetScrollNewsAckNum.netID,
            this.onGetScrollNewsAck)
        NetMessageMgr.rmMessageCB(NetProtocolList.GetAnnouncementAckNum.netID,
            this.onGetAnnouncementAck)
        NetMessageMgr.rmMessageCB(NetProtocolList.QueryPanZhanJiAckMessageNum.netID,
            this.onQueryPanZhanJiAck, this)
    },

    sendRoomNumToServer : function () {
        var roomNumber = "";
        this.enterNumList.forEach(function(num){
            roomNumber += num; 
        })
        var roomID = parseInt(roomNumber);
        GamePlayDataMgr.getRoomInfo().RoomID = roomID;
        var sendData = {
            PlayerID : GamePlayDataMgr.getUserID(),//玩家帐号
            RoomID   : roomID,//房间id
        }
        require("GamePlayDataMgr").setRoomMaster(false);
        NetMessageMgr.send(NetProtocolList.EnterRoomMessageNum.netID, sendData);
    },

    //返回房间信息
    onRoomMessageAck : function(data){
        log("-onRoomMessageAck---", data)
        data.RoomInformation.RoomID = GamePlayDataMgr.getRoomInfo().RoomID;
        GamePlayDataMgr.setRoomInfo(data.RoomInformation);
        GamePlayDataMgr.initRoomPlayers(data.PlayersInfo);
        this.gotoGameRoom();
    },
    //创建房间信息
    onCreatRoomAck : function(data){
        log("-onCreatRoomAck-创建房间信息--", data)
        GamePlayDataMgr.getRoomInfo().RoomID = data.RoomID;       
        var playInfoList = [data.PlayerInfo];
        GamePlayDataMgr.initRoomPlayers(playInfoList);
        this.gotoGameRoom();
    },

    //监听系统滚动公告消息
    onGetScrollNewsAck : function(data){
        log("-onGetScrollNewsAck-系统公告--", data)
        var self = this;
        var posX = this.bulletinNode.getPositionX();
        var posY = this.bulletinNode.getPositionY();
        this.bulletinNode.getComponent(cc.Label).string = data.addId[0].cont;
        var length = this.bulletinNode.getContentSize().width + 600;
        var time = length/68;
        var action = cc.repeatForever( cc.sequence( cc.moveBy(time, cc.p(-length, 0)), 
            cc.callFunc( function(){
                self.bulletinNode.setPosition(cc.p(posX, posY));
            }) ));
        this.bulletinNode.runAction(action);
    },

    //监听系统活动公告消息
    onGetAnnouncementAck : function(data){
        if(data != undefined)
            this.webview.url = data.addId[0].addr;
        else
            this.webview.url = "https://www.baidu.com/";
    },

    //监听手机验证码消息
    onGetVerificationCodeAck : function(data){
        this.copySetPrefab.getComponent("setUI").getCodeByNet("0000");
    },

    //查看战绩返回信息
    onQueryPanZhanJiAck : function(data){
        cc.log("----- 战绩 -----")
        cc.log(data)
        cc.log("----- 战绩 -----")
        this.node.getChildByName("zhanjiUI").getComponent("zhanjiUI").getRecordByNet(data);
    }

    //--------------End Server ----------------

});
