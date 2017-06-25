var utils      = require("utils");
var GameDefine = require("GameDefine");
var log        = utils.log;

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.SysInit();
    },

    onBtnLoginClicked : function () {
        log("--onBtnLoginClicked-");
        cc.director.loadScene("main");
    },

    onDestroy : function () {
        log("--onDestroy-");
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
