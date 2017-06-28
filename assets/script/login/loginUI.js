var utils      = require("utils");
var GameDefine = require("GameDefine");
var log        = utils.log;
var UserLocalData = require("UserLocalData");

cc.Class({
    extends: cc.Component,

    properties: {
        progressBarNode : cc.Node,
        btnLoginNode    : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.SysInit();
        this.UserInfoInit();

        this.isUpdate = true;
        this.onProgressBar();
    },

    //进度条
    onProgressBar : function(){
        if(!this.isUpdate) { this.btnLoginNode.active = true; return; }
        this.progressBarNode.active = true;
        var progressBar = this.progressBarNode.getComponent(cc.ProgressBar);
        cc.log("progressBar.progress = ", progressBar.progress)

        var length = 0;
        this.barSchedule = function(){
            length = length + Math.random()*10;
            if (length/100 >= 1){
                progressBar.progress = length/100;
                this.progressBarNode.active = false;
                this.btnLoginNode.active = true;
                this.unschedule(this.barSchedule);
            }
            progressBar.progress = length/100;
        }
        this.schedule(this.barSchedule, 0.3);
    },

    //微信登陆
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
