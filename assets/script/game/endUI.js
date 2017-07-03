var utils      = require("utils");
var GameDefine = require("GameDefine");
var gameManager= require("gameManager");
var log        = utils.log;
cc.Class({
    extends: cc.Component,

    properties: {
        endRoundN    : cc.Node,
        singleRoundN : cc.Node,
        totalRoundN  : cc.Node,
        paiPrefab    : cc.Prefab,
        reportTagPb  : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this.initDirectData();
        this.initSingleReport();
        this.initTotalReporte();
        this.paiScale     = 0.62;
        this.shuWidth     = 32;
        this.hengWidth    = 41;
        this.huPaiScale   = 0.6;
        this.endRoundN.active    = false;
        this.singleRoundN.active = false;
        this.totalRoundN.active  = false;        
    },

    initDirectData : function(){
        var DirectType     = GameDefine.DIRECTION_TYPE;
        var directNodeName = {};
        directNodeName[0]  = {nodeName :"dong", localText : "东风"};
        directNodeName[1]  = {nodeName :"nan", localText : "南风"};
        directNodeName[2]  = {nodeName :"xi", localText : "西风"};
        directNodeName[3]  = {nodeName :"bei", localText : "北风"};
        this.directNodeName             = directNodeName;
    },

    initTotalReporte : function(){
        var self = this;
        
        this.totalRoundN.refreshData = function(data){
            var maxWinCount = 0;
            var maxWinerNode; 
            for(let i=0;i<4;i++){
                var itemData = data[i];
                var playerNode = self.totalRoundN.getChildByName("player_"+i);
                self.setPlayerInfo(playerNode, i)
                var detailN = playerNode.getChildByName("detail")
                for(let k = 0; k<6;k++){
                    let itemNode    = detailN.getChildByName("item_"+k);
                    var nameNode    = itemNode.getChildByName("name");
                    var contentNode = itemNode.getChildByName("content");
                    nameNode.getComponent(cc.Label).string = GameDefine.TOTALREPORT[k];
                    contentNode.getComponent(cc.Label).string = itemData[k];
                }
                var scoreAddNode = playerNode.getChildByName("score_add");
                var scoreRedNode = playerNode.getChildByName("score_red");
                var disScore     = itemData[6] > 0 ? "+" + itemData[6] : itemData[6];
                scoreAddNode.getComponent(cc.Label).string = disScore;
                scoreRedNode.getComponent(cc.Label).string = disScore;
                scoreAddNode.active = itemData[6] > 0;
                scoreRedNode.active = !(itemData[6] > 0);
                var winerNode  = playerNode.getChildByName("winer");
                winerNode.active = false;
                if(itemData[6] > maxWinCount){
                    maxWinCount = itemData[6];
                    maxWinerNode = winerNode;
                }
            }
            maxWinerNode.active = true;
        }
    },

    initSingleReport : function(){
        var self = this;
        this.singleRoundN.refreshData = function(data){
            for(let i= 0; i < 4; i++){
                let playerNode = self.singleRoundN.getChildByName("player_"+i);
                let itemData   = data[i];
                let paiListN   = playerNode.getChildByName("paiList");
                let dirNode    = playerNode.getChildByName("direct");
                self.setPlayerInfo(playerNode, i)
                self.setDirectData(dirNode, i);
                self.setHuCountData(playerNode, itemData);
                self.setPaiData(paiListN, itemData, i);
                self.setPaiFengScore(playerNode, itemData, i); 
                self.setFanAndHuCount(playerNode, itemData);
                self.setReportTag(paiListN, itemData);
                playerNode.getChildByName("byTips").active = itemData.isby;
            }
        }
        this.singleRoundN.cleanData = function(){
             for(let i= 0; i < 4; i++){
                let playerNode = self.singleRoundN.getChildByName("player_"+i);
                let paiListN   = playerNode.getChildByName("paiList");
                paiListN.removeAllChildren();
             }
        }
    },

    //player base info, icon/name/direction
    setPlayerInfo : function(playerNode, pos){
        var playerInfo = gameManager.getPlayerByDeskPos(pos)
        let iconN = playerNode.getChildByName("icon");
        iconN.getComponent(cc.Label).string = playerInfo.playerData.UserId;
        let nameN = playerNode.getChildByName("name");
        nameN.getComponent(cc.Label).string = playerInfo.playerData.Name
        playerNode.getChildByName("bg_1").active = !playerInfo.IsSelfPlayer;
        playerNode.getChildByName("bg_2").active = playerInfo.IsSelfPlayer;
        
    },

    //hupai  dianpao  baoyuan lazi
    setReportTag : function(paiListN, data){
        var leftPos  = cc.p(-86, -10);
        var rightPos = cc.p(690, -10);
        var self     = this;
        var addTag   = function(pos, showTagName){
            var tagNode = cc.instantiate(self.reportTagPb);
            paiListN.addChild(tagNode);
            tagNode.setPosition(pos);
            tagNode.getChildByName(showTagName).active = true;
        }
        if(data.ishu){
            addTag(leftPos, "hu");
        }
        if(data.iszm){
             addTag(leftPos, "zm");
        }
        if(data.islz){
            addTag(rightPos, "lazi");
        }
        if(data.isby){
            addTag(leftPos, "by");
        }
        if(!data.isby && data.isdp){
            addTag(leftPos, "dp");
        }

    },

    //fanshu  and hushu
    setFanAndHuCount(playerNode, data){
        var fanNode = playerNode.getChildByName("fanCount");
        var huNode  = playerNode.getChildByName("huCount");
        var fanData = ""
        var huData  = "" 
        for(let k in data.hsxq){
            if(GameDefine.FSTEXT[k]){
                fanData += (GameDefine.FSTEXT[k] +"+"+data.hsxq[k] + " ");
            }
            if(GameDefine.HSTEXT[k]){
                huData += (GameDefine.HSTEXT[k] +"+"+data.hsxq[k]+ " ");
            }
        }
        if(fanData.length > 0){
            fanNode.getComponent(cc.Label).string = "翻数: " + fanData;
            huNode.getComponent(cc.Label).string  = "胡数: " + huData;
        }else {
            fanNode.getComponent(cc.Label).string = "胡数: " + huData;
            huNode.getComponent(cc.Label).string  = "";
        }
    },

    //xiangdui hushu  and  juedui hushu
    setHuCountData : function (playerNode, data) {
        let jdHuNode = playerNode.getChildByName("totalCount");
        jdHuNode.getComponent(cc.Label).string = "总胡数:" + data.jdhs;
        let xdHuNodeAdd    = playerNode.getChildByName("score_add"); //add 
        let xdHuNodeRed    = playerNode.getChildByName("score_red");//reduce
        var disXdhs        = data.xdhs > 0 ? "+" + data.xdhs : data.xdhs;
        xdHuNodeAdd.active = data.xdhs > 0;
        xdHuNodeRed.active = !(data.xdhs > 0);
        xdHuNodeAdd.getComponent(cc.Label).string = disXdhs
        xdHuNodeRed.getComponent(cc.Label).string = disXdhs
    },

    //set current player direction data
    setDirectData : function(dirNode, direction){
        //hide all node
        for(let i = 0; i < dirNode.children.length; i++){
            dirNode.children[i].active = false;
        } 
        var nodeName = this.directNodeName[direction].nodeName;
        dirNode.getChildByName(nodeName).active = true;
    },
    //set current player pai data
    setPaiData : function(paiListNode, data, pos) {
        var player = gameManager.getPlayerByDeskPos(pos)
        var pengGangPai = player.paiDataObj.pengGangPai;
        var shouPai     = data.sp;
        shouPai.sort();
        //every player's pai display as like xia player  
        var destType    = GameDefine.DESKPOS_TYPE.XIA;
        var gangPaiList = pengGangPai.gang;
        var pengPaiList = pengGangPai.peng;
        var gangLen     = 0;
        var pengLen     = 0;
        var shouLen     = 0;
        //gang
        for(let gIndex =0; gIndex<gangPaiList.length; gIndex ++){
            let gang  = gangPaiList[gIndex];
            let curLen = 0;
            for(let i =0; i < gang.length; i++){
                let pai     = gang[i];
                pai.rotate  = 0;
                var paiNode = cc.instantiate(this.paiPrefab);
                this.gameUI.setPengGangPaiSprite(paiNode, destType, pai, this.paiScale)
                var yPos    = (pai.rotate !== 0) ? -6 : 0; 
                var rotateDiff = (pai.rotate !== 0) ? -9.3 : 0;
                paiNode.setPosition(cc.p(gangLen+curLen + rotateDiff, yPos));
                paiListNode.addChild(paiNode)
                var addLen  = (pai.rotate !== 0) ? this.hengWidth : this.shuWidth; 
                curLen     += addLen;
            }
            gangLen += curLen + 4; 
        }
        gangLen = gangLen > 0 ? gangLen + 10 : gangLen;
        //peng  chi
        for(let gIndex =0; gIndex<pengPaiList.length; gIndex ++){
           let peng  = pengPaiList[gIndex];
           let curLen = 0;
            for(let i =0; i < peng.length; i++){
                let pai     = peng[i];
                pai.rotate  = 0;
                var paiNode = cc.instantiate(this.paiPrefab);
                this.gameUI.setPengGangPaiSprite(paiNode, destType, pai, this.paiScale)
                var yPos       = (pai.rotate !== 0) ? -6 : 0; 
                var rotateDiff = (pai.rotate !== 0) ? -9.3 : 0;
                paiNode.setPosition(cc.p(gangLen + pengLen + curLen + rotateDiff, yPos));
                paiListNode.addChild(paiNode)
                var addLen     = (pai.rotate !== 0) ? this.hengWidth : this.shuWidth; 
                curLen         += addLen;
            } 
            pengLen += curLen + 4; 
        }
        pengLen = pengLen > 0 ? pengLen + 10 : pengLen;
        //shou shang pai 
        for(let i =0; i<shouPai.length; i++){
            if(shouPai[i] && shouPai[i] > 0){
                var pai = {id : shouPai[i], rotate : 0};
                let paiNode = cc.instantiate(this.paiPrefab);
                this.gameUI.setPengGangPaiSprite(paiNode, destType, pai, this.paiScale)
                paiNode.setPosition(cc.p(gangLen + pengLen + shouLen, 0));
                paiListNode.addChild(paiNode)
                shouLen     += this.shuWidth;
            }
        }   
        //hupai
        if(data.ishu){
            let paiNode = cc.instantiate(this.paiPrefab);
            var pai = {id : data.hp, rotate : 0};
            this.gameUI.setPengGangPaiSprite(paiNode, destType, pai, this.huPaiScale)
            paiNode.setPosition(cc.p(gangLen + pengLen + shouLen + 20, 0));
            paiListNode.addChild(paiNode)
            paiNode.getChildByName("main").getChildByName("bg").color = new cc.Color(255, 255, 0);
        }
    },

    //和其他风玩家的分数
    setPaiFengScore : function(playerNode, data, pIndex){
        var addColor    = new cc.Color(255, 255, 0);
        var reduceColor = new cc.Color(100, 255, 237);
        var playerFengData = [];
        for(let i = 0; i < 4; i++){
            if(i === pIndex){
                continue;
            }
            let score = data.pxdhs[i];
            score = score || 0;
            playerFengData.push({sp: score, index : i})
        }
        for(i=0; i<3;i++){
            let fengNode = playerNode.getChildByName("feng_"+i);
            let nameNode = fengNode.getChildByName("name");
            let scoreNode= fengNode.getChildByName("content");
            var fengData = playerFengData[i];
            nameNode.getComponent(cc.Label).string  = this.directNodeName[fengData.index].localText;
            scoreNode.getComponent(cc.Label).string = (fengData.sp > 0 ? "+" : "") + fengData.sp;
            scoreNode.color = (fengData.sp > 0 > 0) ? addColor : reduceColor
        }
    },

    showSingleReport(){
        this.endRoundN.active    = true;
        this.singleRoundN.active = true;
    },

    hideSingleReport(){
        this.singleRoundN.active = false;
        this.singleRoundN.cleanData();
    },

    showTotalReporte : function(){
        this.totalRoundN.active = true;
    },

    

    //cur round report data
    setSingleReportData : function(reportData, gameUI){
        this.gameUI = gameUI;
        this.singleRoundN.refreshData(reportData.info);
    },

    setTotalReportData : function(reportData, gameUI){
        this.gameUI          = gameUI;
        this.totalReportData = reportData; 
        this.totalRoundN.refreshData(reportData.TotalInfos);
    },

    onBtnExitClicked : function () {
        this.endRoundN.active    = false;
    },

    //share single report to other
    onBtnSingleShare : function () {
        
    },

    //share total report to other
    onBtnTotalShare : function () {
        
    },

    onBtnContiuneClicked : function(){
        this.hideSingleReport();
        if(this.isCanContinue()){
            this.gotoReadyUI();
        }else {
            this.showTotalReporte();
        }
    },

    gotoReadyUI : function(){
        gameManager.cleanData();
        gameManager.cleanPlayerPaiData();
        this.gameUI.showReadyNode();
        this.endRoundN.active    = false;
        this.singleRoundN.active = false;
        this.totalRoundN.active  = false;
    },

    //是否还能继续打牌
    isCanContinue : function(){
        return (this.totalReportData === undefined);
    },
   
});
