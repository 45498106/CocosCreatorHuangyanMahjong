var NetMessageMgr   = require("NetMessageMgr");
var GameDataMgr     = require("GameDataMgr");
var GameDefine      = require("GameDefine");
var NetProtocolList = require("NetProtocolList");
var log             = require("utils").log;

cc.Class({
    extends: cc.Component,

    properties: {
        createRoomNode : cc.Node,
        tishiTG        : cc.Node,
        jushuTG        : cc.Node,
        shouxufeiBox   : cc.Node,
        shouxufeiTG    : cc.Node,
        pangguanTG     : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.initUI();
    },

    initUI : function(){
        var creatRoomData = GameDefine.CREATROOM_TYPE;
        this.setUIData(this.tishiTG, creatRoomData.NoticeType);
        this.setUIData(this.jushuTG, creatRoomData.GameNum);
        this.setUIData(this.shouxufeiTG, creatRoomData.PaymentMethod);

    },

    setUIData : function(modeNode, modeData){
        var startIndex = 0;
        for(let k in modeData){
            startIndex += 1;
            var childN = modeNode.getChildByName("toggle" + startIndex);
            var content = childN.getChildByName("content");
            content.getComponent(cc.Label).string = modeData[k].name;
            childN.chooseData = modeData[k];
        }

    },




    onBtnCreateRoomClicked : function(){
        var roomInfo = {
                NoticeType : 2,
                GameNum : 1,
                PaymentMethod : 1,
        }
        for(let i=1; i<3; i++){
            var tsCheckmark = this.tishiTG.getChildByName("toggle"+i).getChildByName("checkmark");
            if(tsCheckmark.active == true){
                roomInfo.NoticeType = tsCheckmark.parent.chooseData.id;
            }
               
        }

        for(let i=1; i<4; i++){
            var jsCheckmark = this.jushuTG.getChildByName("toggle"+i).getChildByName("checkmark");
            if(jsCheckmark.active == true){
                roomInfo.GameNum = jsCheckmark.parent.chooseData.id;
            }
        }

        for(let i=1; i<4; i++){
            var sxfCheckmark = this.shouxufeiTG.getChildByName("toggle"+i).getChildByName("checkmark");
            if(sxfCheckmark.active == true){
                roomInfo.PaymentMethod = sxfCheckmark.parent.chooseData.id;
            }
        }

        // var isOnlook; //是否允许旁观
        // isOnlook = this.pangguanTG.getChildByName("toggle").getChildByName("checkmark").active;
        // data.isOnlook = isOnlook;

        this.creatGameRoomToServer(roomInfo);
    },

    creatGameRoomToServer : function(roomInfo){
        log("this  is roomInfo", roomInfo)
        GameDataMgr.setRoomMaster(true);
        GameDataMgr.setRoomInfo(roomInfo);
        var sendData = {
            PlayerID : GameDataMgr.getUserID(),//玩家帐号
            RoomInformation   : roomInfo,//房间信息
        }
        NetMessageMgr.send(NetProtocolList.CreateRoomMessageNum.netID, sendData);
    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.createRoomNode.active = false;
            }) )
        this.createRoomNode.runAction(outAction);
    },
});
