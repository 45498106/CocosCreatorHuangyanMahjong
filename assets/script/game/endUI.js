var utils      = require("utils");
var GameDefine = require("GameDefine");
var log        = utils.log;
cc.Class({
    extends: cc.Component,

    properties: {
        endRoundN    : cc.Node,
        singleRoundN : cc.Node,
        paiPrefab    : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this.initDirectData();
        this.initSingleReport();
        this.paiScale     = 0.62;
        this.shuWidth     = 32;
        this.hengWidth    = 41;
        this.huPaiScale   = 0.6;        
    },

    onDestroy : function(){
        this.singleRoundN.cleanData();
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

    initSingleReport : function(){
        var self = this;
        this.singleRoundN.refreshData = function(data){
            for(let i= 0; i < 4; i++){
                let playerNode = self.singleRoundN.getChildByName("player_"+i);
                let itemData   = data[i];
                let iconN      = playerNode.getChildByName("icon");
                iconN.getComponent(cc.Label).string = itemData.player.playerData.UserId;
                let nameN = playerNode.getChildByName("name");
                nameN.getComponent(cc.Label).string = itemData.player.playerData.Name
                let paiListN = playerNode.getChildByName("paiList");
                let dirNode  = playerNode.getChildByName("direct");
                self.setDirectData(dirNode, i);
                playerNode.getChildByName("bg_1").active = !itemData.player.IsSelfPlayer;
                playerNode.getChildByName("bg_2").active = itemData.player.IsSelfPlayer;

                self.setHuCountData(playerNode, itemData);
                self.setPaiData(paiListN, itemData);
                self.setPaiFengScore(playerNode, itemData); 
                self.setFanAndHuCount(playerNode, itemData);

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

    //fanshu  and hushu
    setFanAndHuCount(playerNode, data){
        var fanNode = playerNode.getChildByName("fanCount");
        var huNode  = playerNode.getChildByName("huCount");
        var fanData = "翻数: "
        var huData  = "胡数: " 
        for(let k in data.hsxq){
            if(GameDefine.FSTEXT[k]){
                fanData += (GameDefine.FSTEXT[k] + data.hsxq[k] + " ");
            }
            if(GameDefine.HSTEXT[k]){
                huData += (GameDefine.HSTEXT[k] + data.hsxq[k]+ " ");
            }
        }
        fanNode.getComponent(cc.Label).string = fanData;
        huNode.getComponent(cc.Label).string = huData;
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
    setPaiData : function(paiListNode, data) {
        var pengGangPai = data.player.paiDataObj.pengGangPai;
        var shouPai     = data.sp;
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
                let pai        = peng[i];
                var paiNode    = cc.instantiate(this.paiPrefab);
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
    setPaiFengScore : function(playerNode, data){
        log("setPaiFengScore", playerNode, data)
        var startIndex  = 0;
        var addColor    = new cc.Color(255, 255, 0);
        var reduceColor = new cc.Color(100, 255, 237);
        var getFengData = function(index){
            for(let i=0; i<2;i++){
                if(data.pxdhs[index] !== undefined){
                    break;
                }
                index +=1;
                startIndex += 1;
            }
            return data.pxdhs[index];
        }
        for(i=0; i<3;i++){
            let fengNode = playerNode.getChildByName("feng_"+i);
            let nameNode = fengNode.getChildByName("name");
            let scoreNode= fengNode.getChildByName("content");
            var fengData = getFengData(startIndex);
            nameNode.getComponent(cc.Label).string  = this.directNodeName[startIndex].localText;
            scoreNode.getComponent(cc.Label).string = (fengData > 0 ? "+" : "") + fengData;
            scoreNode.color = (fengData > 0) ? addColor : reduceColor
            startIndex += 1;
        }
    },

    showSingleReport(){
        this.endRoundN.active    = true;
        this.singleRoundN.active = true;
    },

    

    //cur round report data
    setSingleReportData : function(reportData, gameUI){
        this.gameUI = gameUI;
        this.singleRoundN.refreshData(reportData.info);
    },

    //显示结算信息
    showRoundReport : function(reportData, nameList) {
        this.endRoundN.active = true;
        var pointN    = this.endRoundN.getChildByName("pointList");
        var nameNode  = pointN.getChildByName("id");
        var totalNode = pointN.getChildByName("total");
        var curNode   = pointN.getChildByName("cur");
        var btnReady  = this.endRoundN.getChildByName("btnReady");
        var btnOut    = this.endRoundN.getChildByName("btnOut");
        reportData.endPlayCount = 0;
        btnOut.active = reportData.endPlayCount < 1;
        btnReady.active = reportData.endPlayCount > 0;
        var setData = function(index, data, parentNode){
            var setN = parentNode.getChildByName("point_" + index);
            setN.getComponent(cc.Label).string = data;
        }
        for(let i =1; i<5; i++){
            // setData(i, reportData.totalRoundReport[i-1], totalNode);
            // setData(i, reportData.curRoundReport[i-1], curNode);
            // setData(i, nameList[i-1], nameNode);
        }
    },


    onBtnReadyToPlay : function () {
        cc.director.loadScene("main");
    },

    onBtnEndToPlay : function () {
        
    },

    onBtnContiuneClicked : function(){

    },



   
});
