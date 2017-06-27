var utils = require("utils");
var gameManager = require("gameManager");
var GameDefine  = require("GameDefine");
var playerSys   = require("player");
var log = utils.log;

cc.Class({
    extends: cc.Component,

    properties: {
        shangPaiN         : cc.Node, //上面玩家的牌
        xiaPaiN           : cc.Node,   //下面玩家的牌
        zuoPaiN           : cc.Node,   //左边玩家的牌
        youPaiN           : cc.Node,   //右边玩家的牌
        paiAltas          : cc.SpriteAtlas,
        paiPrefab         : cc.Prefab,
        eatEffectPrefab   : cc.Prefab,
        readyLogicN       : cc.Node, //准备游戏UI的脚本节点,
        lunpanN           : cc.Node, //中间的东南西北
        overallEffN       : cc.Node, //全局特效
        eatOptN           : cc.Node,
        chiPaiPrefab      : cc.Prefab,
        pengPaiPrefab     : cc.Prefab,
        gangPaiPrefab     : cc.Prefab,
        hupaiPrefab       : cc.Prefab,
        EndUI             : cc.Node,
        eatPaiDetailPrefab: cc.Prefab,
        eatMoreOptN       : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.initGameManager(); 
        this.showReadyNode();
        this.caiShenN        = this.lunpanN.getChildByName("pai");
        this.caiShenN.active = false;
        this.shengPaiEffN    = this.overallEffN.getChildByName("shengPaiEff")
        this.reduceLabel     = this.lunpanN.getChildByName("residue").getComponent(cc.Label);
        this.initEatListPrefab();
    },

    onDestroy : function(){
        gameManager.onDestroy();
    },

    setCaiShenPai : function(paiID){
        this.caiShenN.active = true;
        var contentN         = this.caiShenN.getChildByName("content");
        var spriteName       = "pj_"+utils.getLocalPaiID(paiID);
        this.setNodeSprite(contentN, spriteName);
        contentN.scale = 0.5;
    },

//     //
    initGameManager : function(){
        var deskType   = GameDefine.DESKPOS_TYPE
        var playerList = {};
        var self = this;
        var initUI     = function(deskType, uiNode){
            var player           = playerSys.new()
            var playerUI         = uiNode.getComponent("playerUI")
            player.init(playerUI, deskType, self);
            playerList[deskType] = player;
        }
        initUI(deskType.SHANG, this.shangPaiN);
        initUI(deskType.XIA, this.xiaPaiN);
        initUI(deskType.ZUO, this.zuoPaiN);
        initUI(deskType.YOU, this.youPaiN);
        gameManager.initGame(playerList, this);
    },

    //设置手上牌图像资源
    setHandPaiSprite : function(paiNode, deskType, paiID, nodeScale){
        var bgFrameName = "pj_shou"+deskType;
        var mainNode    = paiNode.getChildByName("main")
        var bgNode      = mainNode.getChildByName("bg");
        var bgRect      = this.setNodeSprite(bgNode, bgFrameName);
        if(deskType === GameDefine.DESKPOS_TYPE.XIA){
            this.checkCaiShenBG(bgNode, paiID);
            var contentNode  = mainNode.getChildByName("content");
            var contentName  = "pj_"+utils.getLocalPaiID(paiID);
            this.setNodeSprite(contentNode, contentName);
            contentNode.setPosition(cc.p(0, -10))
            contentNode.scale = 0.9;
        }
        paiNode.width  = bgRect.width;
        paiNode.height = bgRect.height;
        paiNode.scale  = nodeScale;
    },


    setNodeSprite : function(spriteNode, spriteName){
        var spriteFrame = this.paiAltas.getSpriteFrame(spriteName);
        spriteNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        var frameRect     = spriteFrame.getRect();
        spriteNode.width  = frameRect.width;
        spriteNode.height = frameRect.height;
        return frameRect;
    },

    getBgFreme : function(deskType, isShangXia, isRotate){
        var isZhipeng        = ((isShangXia && !isRotate) || (!isShangXia && isRotate))
        var bgFrameName      = isZhipeng ? "pj_zhipeng" : "pj_hengpeng";
        return bgFrameName;
    },

    checkCaiShenBG : function(bgNode, paiID){
        var caishenID  = require("gameManager").CaiShenPai;
        var paiColor   = caishenID === paiID ? GameDefine.CAISHENCOLOR : GameDefine.WHITECOLOR
        bgNode.color   = paiColor;
    },

    //设置碰杠牌图像资源
    setPengGangPaiSprite : function(paiNode, deskType, pai, nodeScale){
        var isRotate         = pai.rotate !== 0;
        var paiID            = pai.id;
        var mainNode         = paiNode.getChildByName("main")
        var DeskTp           = GameDefine.DESKPOS_TYPE;
        var isShangXia       = (deskType === DeskTp.XIA || deskType === DeskTp.SHANG);
        var bgFrameName      = this.getBgFreme(deskType, isShangXia, isRotate);
        var bgNode           = mainNode.getChildByName("bg");
        this.checkCaiShenBG(bgNode, paiID);
        var bgRect           = this.setNodeSprite(bgNode, bgFrameName);
        var contentNode      = mainNode.getChildByName("content");
        var contentName      = "pj_"+utils.getLocalPaiID(paiID);
        this.setNodeSprite(contentNode, contentName);
        paiNode.width        = bgRect.width;
        paiNode.height       = bgRect.height;        
        paiNode.scale        = nodeScale;
        var roAngle          = isShangXia ? 0 : 90;
        roAngle              = (deskType === DeskTp.YOU) ? -90 : roAngle; 
        contentNode.rotation = roAngle + pai.rotate;
        if(isShangXia){
            var pos           = isRotate ? cc.p(0, 8) : cc.p(0, 12);
            contentNode.setPosition(pos);
            contentNode.scale = isRotate ? 0.4 : 0.7
            paiNode.scale     = isRotate ? paiNode.scale * 1.6 : paiNode.scale;
        }else {
            contentNode.setPosition(cc.p(0, 8));
            contentNode.scale = isRotate ? 0.6 : 0.4
            paiNode.scale     = isRotate ? paiNode.scale * 0.66 : paiNode.scale;
        }
    },
    //开始打麻将
    gameStart : function(){
        this.changPlayerIcon(0.8);
        this.lunpanN.active = true;
    },

//     //新的一轮
//     onNewRoundClicked() {
//         gameManager.newRound();
//     },

    //隐藏所有亮的的方向
    hideAllDiection : function(){
        var directionN = this.lunpanN.getChildByName("curDirection");
        directionN.children.forEach(function(item, index){
            item.active = false;
        })
        //背景框要显示
        directionN.getChildByName("border").active = true;
    },

    //旋转中间的轮盘
    roDirectionNode : function(rota){
        var directionN = this.lunpanN.getChildByName("curDirection");
        directionN.rotation = rota;
    },

    //获取当前方向Node
    getCurDirectionN : function(curDirName){
        var directionN = this.lunpanN.getChildByName("curDirection");
        return directionN.getChildByName(curDirName);
    },

    showReadyNode : function(){
        this.lunpanN.active = false;
        var readyScript = this.readyLogicN.getComponent("readyUI");
        readyScript.refreReadyData();
        readyScript.showIn();
    },

    //放大缩小玩家icon
    changPlayerIcon : function(tarScale){
        var changeFunc = function(tarNode){
            tarNode.getChildByName("info").scale    = tarScale;
        }
        changeFunc(this.shangPaiN);
        changeFunc(this.xiaPaiN);
        changeFunc(this.zuoPaiN);
        changeFunc(this.youPaiN);
    },

    //播放生牌阶段特效
    playShengPaiAnim : function(){
        this.shengPaiEffN.active = true;
        var content = this.shengPaiEffN.getChildByName("content");
        content.opacity = 0;
        content.scale = 0.1;
        var self = this;
        var spawnAct = cc.spawn(cc.fadeIn(0.6), cc.scaleTo(0.6, 1.2))
        var act = cc.sequence(spawnAct, cc.scaleTo(0.2,1). cc.callFunc(function(){
            setTimeout(function(){
                self.shengPaiEffN.active = false;
            }, 2000)
        }))
        content.runAction(act);
    },

    //过牌
    onBtnGuoChilcked : function(){
        cc.log("-//过牌----")
        this.hideEatPaiN();
        gameManager.guoPaiToServer();
    },

    hideMoreChiUI : function(eatData){
        this.eatMoreOptN.removeAllChildren();
        this.eatMoreOptN.active = false;
        gameManager.chiPaiToServer(this.curChiObj, eatData);
    },


    //have more eat pai choice
    showMoreChiUI : function(eatobj, eatPaiData){
        this.curChiObj = eatobj;
        this.eatMoreOptN.active = true;
        for(let i =0; i< eatPaiData.Data.length; i++){
            var paiGroupN = cc.instantiate(this.eatPaiDetailPrefab);
            this.eatMoreOptN.addChild(paiGroupN);
            paiGroupN.setPosition(cc.p(i * -220 - 100, 0))
            paiGroupN.getComponent("eatDetailUI").init(this, eatPaiData.Data[i], eatPaiData.Atile);
        }
    },

    //吃牌
    onBtnChiChilcked : function(eatobj){
        this.hideEatPaiN();
        if(gameManager.eatPaiData.Data.length > 1){
            this.showMoreChiUI(eatobj, gameManager.eatPaiData);
        }else {
            gameManager.chiPaiToServer(eatobj, gameManager.eatPaiData.Data[0]);
        }
        
    },
    
    //碰杠胡牌
    onBtnEatChilcked : function(eatobj){
        log("-//碰碰杠胡牌牌----", eatobj);
        this.hideEatPaiN();
        gameManager.eatPaiToServer(eatobj);
    },
    cleanResidue : function(){
        this.totalReduce = 0;
    },

    //refresh the rest of pai count
    refreResidue : function(reduce){
        this.totalReduce += reduce;
        var left = utils.getChannelInfo().totalPai - this.totalReduce;
        this.reduceLabel.string = left;
    },

    showEatPaiN : function(){
        this.eatOptN.active = true;
        this.cleanEatNodeList();
    },

    cleanEatNodeList : function(){
        this.addEatNodeList.forEach(function(item){
            item.removeFromParent();
        })
        this.addEatNodeList = [];
    },

    hideEatPaiN : function(){
        log("-hideEatPaiN-----")
        this.eatOptN.active = false;
        this.cleanEatNodeList();
    },


    //初始化吃牌UI
    initEatListPrefab : function(){
        this.EatPaiObj = {};
        this.addEatNodeList = [];
        var DEFINE_EAT = GameDefine.EAT_TYPE;
        var self = this;
        var initEat = function(defineIndex, prefab, chilckedCB, msName){
            var key = DEFINE_EAT[defineIndex]
            self.EatPaiObj[key]        = {};
            self.EatPaiObj[key].prefab = prefab;
            self.EatPaiObj[key].cb     = chilckedCB;
            self.EatPaiObj[key].dataIndex = defineIndex;
            self.EatPaiObj[key].msName = msName; //message Name
        }
        this.hideEatPaiN();
        //PuTongHu  = 0
        //MingGang2 = 1
        //PengPai   = 2
        //ChiPai    = 3
        //ZiMoHu    = 4
        //AnGang    = 5
        //MingGang1 = 6
        initEat(0, this.hupaiPrefab, this.onBtnEatChilcked, "PuTongHuPaiMessageNum");
        initEat(1, this.gangPaiPrefab, this.onBtnEatChilcked, "MingGang2PaiMessageNum");
        initEat(2, this.pengPaiPrefab, this.onBtnEatChilcked, "PengPaiMessageNum");
        initEat(3, this.chiPaiPrefab, this.onBtnChiChilcked, "ChiPaiMessageNum");
        initEat(4, this.hupaiPrefab, this.onBtnEatChilcked, "ZiMoHuPaiMessageNum");
        initEat(5, this.gangPaiPrefab, this.onBtnEatChilcked, "AnGangPaiMessageNum");
        initEat(6, this.gangPaiPrefab, this.onBtnEatChilcked, "MingGang1PaiMessageNum");
    },

    // 显示玩家对当前牌局上打的牌的课操作列表
    showCanEatUI : function(eatList, optData){
        log("-eatList---", eatList)
        this.showEatPaiN();
        for(let i = 0; i < eatList.length; i++){
            var eatName = eatList[i];
            var eatObj  = this.EatPaiObj[eatName];
            var eatNode = cc.instantiate( eatObj.prefab ); 
            this.eatOptN.addChild(eatNode);
            eatNode.setPosition(cc.p((i+1) * -200 - 80, 0));
            eatNode.getComponent("btnChiUI").init(this, eatObj);
            this.addEatNodeList.push(eatNode);
        }
    },

    cleanEatUI : function(){
        log("-cleanEatUI-----")
        this.hideEatPaiN();
    },

    //显示抢杠提示
    showQiangGang : function(){
        log("-eatList---", eatList)
        this.showEatPaiN();
        var eatNode   = cc.instantiate(this.gangPaiPrefab); 
        var eatObj    = {}
        eatobj.cb     = this.onBtnEatChilcked;
        eatobj.msName = "QiangGangMessageNum"
        this.eatOptN.addChild(eatNode);
        eatNode.setPosition(cc.p(1 * -200 - 80, 0));
        eatNode.getComponent("btnChiUI").init(this, eatObj);
        this.addEatNodeList.push(eatNode);
    },


    //显示结算信息
    showRoundReport : function(reportData, nameList) {
        this.EndUI.getComponent("endUI").showRoundReport(reportData, nameList);
    },

    //show curent round report data
    showSingleReport : function(reportData){
        this.EndUI.getComponent("endUI").setSingleReportData(reportData, this);
        this.EndUI.getComponent("endUI").showSingleReport();
    },

});
