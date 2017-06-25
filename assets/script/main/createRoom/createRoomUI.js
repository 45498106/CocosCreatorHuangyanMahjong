var NetMessageMgr   = require("NetMessageMgr");
var GameDataMgr     = require("GameDataMgr");
var NetProtocolList = require("NetProtocolList");

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
        this.initFunc();
    },

    initFunc : function(){

    },

    onBtnCreateRoomClicked : function(){
        var data = {};
        var nameArray = new Array();
        nameArray[0] = "intelligent";
        nameArray[1] = "profession";
        nameArray[2] = "4局";
        nameArray[3] = "8局";
        nameArray[4] = "16局";
        nameArray[5] = "房主支付";
        nameArray[6] = "平均支付";
        nameArray[7] = "冠军支付";

        data.mode = mode;
        var mode; //选择模式
        for(let i=1; i<3; i++){
            var tsCheckmark = this.tishiTG.getChildByName("toggle"+i).getChildByName("checkmark");
            if(tsCheckmark.active == true)
                mode = nameArray[i-1];
        }
        data.mode = mode;

        var number; //选择局数
        for(let i=1; i<4; i++){
            var jsCheckmark = this.jushuTG.getChildByName("toggle"+i).getChildByName("checkmark");
            if(jsCheckmark.active == true)
                number = nameArray[i+1];
        }
        data.num = number;

        var fee; //选择手续费支付方式
        for(let i=1; i<4; i++){
            var sxfCheckmark = this.shouxufeiTG.getChildByName("toggle"+i).getChildByName("checkmark");
            if(sxfCheckmark.active == true)
                fee = nameArray[i+4];
        }
        data.fee = fee;

        var isOnlook; //是否允许旁观
        isOnlook = this.pangguanTG.getChildByName("toggle").getChildByName("checkmark").active;
        data.isOnlook = isOnlook;

        this.createRoomInfo(data);
    },

    createRoomInfo : function(data){
        var roomInfo = {
                NoticeType : 2,
                GameNum : 1,
                PaymentMethod : 1,
                data : data,
        }
        GameDataMgr.setRoomInfo(roomInfo);
        var sendData = {
            PlayerID : GameDataMgr.getUserID(),//玩家帐号
            RoomInformation   : roomInfo,//房间信息
        }
        cc.log("send NetProtocolList", NetProtocolList)
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
