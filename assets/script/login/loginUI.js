var utils      = require("utils");
var GameDefine = require("GameDefine");
var log        = utils.log;
var UserLocalData = require("UserLocalData");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.SysInit();
        this.UserInfoInit();
    },

    onBtnLoginClicked : function () {
        log("--onBtnLoginClicked-");
        cc.director.loadScene("main");
    },

    onDestroy : function () {
        log("--onDestroy-");
    },

    //玩家信息初始化
    UserInfoInit : function () {
        var data = JSON.parse(cc.sys.localStorage.getItem("huangyanMahjongData20170626"));
        if(data === null)
            UserLocalData.setUserID("20170626"); //如果本地没有数据则创建新用户
        else
            UserLocalData.updateLocalData(data); //如果本地有数据则将其替换成本地的数据
    },


    //环境初始化
    SysInit : function(){
        utils.setChannelInfo(GameDefine.GAME_TYPE.HUANGYAN);     
        require("NetProtocolList").init();
        this.ws  = require("NetMessageMgr");
        this.ws.init(utils.getChannelInfo().serverAddr);
        this.ws.connect();
    },

});
