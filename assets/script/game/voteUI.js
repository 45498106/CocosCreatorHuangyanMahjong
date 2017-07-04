var log             = require("utils").log;
var gameManager     = require("gameManager");
var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");


cc.Class({
    extends: cc.Component,

    properties: {
        votingNode : cc.Node,
        btnAgree   : cc.Node,
        btnDisagree: cc.Node,
        leftTimeL   : cc.Label,
    },
    // use this for initialization

    onLoad: function () {
        this.initVoting()
    },

    onDestroy : function(){
        
    },

    initVoting : function(){
        this.votingNode.active = false;
        var self = this;
        this.votingNode.refreshData = function(data){
            var mainN = self.votingNode.getChildByName("main");
            var titleLable = mainN.getChildByName("title").getComponent(cc.RichText);
            var titleStr = "玩家 <color=#00ff00>"+data.PlayerName+"</c> 申请退出房间，请投票"
            titleLable.string = titleStr;
            self.updateLeftTime = function(){
                self.allTime -= 1;
                if(self.allTime < 1){
                    self.leftTimeL.unschedule(self.updateLeftTime);
                }
                self.leftTimeL.string = self.getDisplayTime(self.allTime);
            },
            self.allTime = data.VotingTime;
            self.leftTimeL.string = self.getDisplayTime(data.VotingTime)
            self.leftTimeL.schedule(self.updateLeftTime, 1);
        }
    },


    getDisplayTime : function(timeCount){
        var min = Math.floor(timeCount / 60);
        var sec = timeCount % 60;
        min     = min < 10 ? "0"+min : min;
        sec     = sec < 10 ? "0"+sec : sec;
        return min + ":" + sec;
    },

    hideClickBtn : function(){
        this.btnAgree.active    = false;
        this.btnDisagree.active = false;
    },

    onBtnAgreeClicked : function(){
        this.sendVoteResulteToServer(true);
        this.hideClickBtn();
    },

    onBtnDisagreeClicked : function(){
        this.sendVoteResulteToServer(false);
        this.hideClickBtn();
    },

    sendVoteResulteToServer : function(isAgree) {
        var content = {};
        content.VotingRst = isAgree;
        NetMessageMgr.send(NetProtocolList.VotingMessageNum.netID, content);
    },

    showVoteNode : function() {
        this.votingNode.active  = true;
        this.btnAgree.active    = true;
        this.btnDisagree.active = true;
    },

    hideVoteNode : function(){
        this.votingNode.active = false;
    },

    setVoteData : function(data){
        log("-setVoteData--data", data)
        this.votingNode.refreshData(data);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
