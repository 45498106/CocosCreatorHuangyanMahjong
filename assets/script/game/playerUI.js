var utils      = require("utils");
var log        = utils.log;
var GameDefine = require("GameDefine");


cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.paiListNode        = this.node.getChildByName("paiNode");
        this.btnInvite          = this.node.getChildByName('btnInvite');
        this.btnInvite.active   = false;
        this.playerInfoN        = this.node.getChildByName("info");
        this.playerInfoN.active = false;
        this.btnInvite.on("touchend", this.onBtnInviteCliicked, this);
        this.playerInfoN.on("touchend", this.onPlayerInfoClicked, this);
        this.readyTagN          = this.playerInfoN.getChildByName("status");
        this.zhuangN            = this.playerInfoN.getChildByName("zhuang");
        this.readyTagN.active   = false;
        this.zhuangN.active     = false;
        this.outPaiDis          = 30;
        this.paiEndActTime      = 0.4;
        this.paiOldctTime       = 0.5;
    },

    //初始化玩家的座位
    initDeskPosType (deskType, gameUI, player){
        this.deskType        = deskType;
        this.gameUI          = gameUI;
        this.paiPrefab       = gameUI.paiPrefab;
        this.paiEffectPrefab = gameUI.eatEffectPrefab;
        this.UIControl       = require("playerUIData").new(deskType);
        this.player          = player;
        
    },

    setIsZhuang (isZhuang){
        this.zhuangN.active = isZhuang;
    },

    //刷新玩家的信息
    refreshPlayerData : function(playerData){
        this.btnInvite.active   = !playerData;
        this.playerInfoN.active = playerData;
        if(!playerData) {return};
        var nameNode = this.playerInfoN.getChildByName("name");
        nameNode.getComponent(cc.Label).string = playerData.Name;
        // playerData.imgUrl = utils.testPICByID[playerData.UserId]
        var imgNode = this.playerInfoN.getChildByName("icon");
        imgNode.getChildByName("id").getComponent(cc.Label).string = playerData.UserId;
        if(playerData.imgUrl){
            var iconW = imgNode.width;
            var iconH = imgNode.height;
            cc.loader.load({url:playerData.imgUrl, type : "png"}, function(err, texture) {
                if(err){
                    log("---load img err", err);
                    return
                }
                var sF = new cc.SpriteFrame();
                sF.setTexture(texture);
                imgNode.getComponent(cc.Sprite).spriteFrame = sF;
                imgNode.setContentSize(iconW, iconH);
            })
        }
    },

    newRoundPaiAnim(paiObjData){
    	this.paiObjData = paiObjData;
    	this.setStartPai();	
    },

    //设置拍得响应图案
    setStartPai : function(){
        this.paiListNode.removeAllChildren();
        this.refreShouPaiPos()
        this.refreCaiShenColor();
    },

    refreShouPaiPos : function(){
        var shouPaiList = this.paiObjData.shouShangPai;
        for (var k = 0; k < shouPaiList.length; k++) {
            let pai         = shouPaiList[k]
            var paiChildN   = this.paiListNode.getChildByName(pai.udid);
            if(!paiChildN){
                paiChildN   = this.createPaiNode(pai)
                this.paiListNode.addChild(paiChildN);
            }
            paiChildN.setPosition(this.UIControl.getShouPaiPos(k));
            paiChildN.setLocalZOrder(this.UIControl.getShouZorder(k));
        }
    },

    createPaiNode : function(pai){
        var paiNode = this.createPengGangNode(pai);
        if(this.deskType === GameDefine.DESKPOS_TYPE.XIA){
            var self = this;
            paiNode.on("touchend", function(event){
                self.onPaiNodeClicked(paiNode);
            }, paiNode)
        }
        this.gameUI.setHandPaiSprite(paiNode, this.deskType, pai.id, this.UIControl.nodeScale);
        return paiNode
    },

    createPengGangNode : function(pai){
        var paiNode     = cc.instantiate(this.paiPrefab);
        paiNode.anchorX = this.UIControl.nodeAnchorX;
        paiNode.anchorY = this.UIControl.nodeAnchorY;
        paiNode.pai     = pai
        paiNode.name    = pai.udid;
        return paiNode
    },

    //碰杠牌 
    pengGangPaiUI : function(paiObjData){
        this.paiObjData = paiObjData;
        this.refreGangPai();
        this.refrePengPai();
        this.refreShouPaiPos();
        this.refreCaiShenColor();
    },

    refreCaiShenColor : function(){
        var caishenID = require("gameManager").CaiShenPai;
        var children = this.paiListNode.children;
        for (var i = 0; i < children.length; ++i) {
            var item = children[i]
            var main = item.getChildByName("main");
            if(!main){continue}
            var bg   = main.getChildByName("bg");
            if(bg){
                var isCaiShen = (item.pai && item.pai.id == caishenID)
                var pColor    = isCaiShen ? new cc.Color(155, 255, 131) : new cc.Color(255, 255, 255);
                bg.color      = pColor
            }
        }
    },

    creatEffectTag : function(){
        this.tagCount = this.tagCount || 1;
        var tag = "effect_"+this.tagCount;
        this.tagCount += 1;
        return tag;
    },

    removeEffectByTag : function(effectTag){
        var child  = this.paiListNode.getChildByName(effectTag);
        this.paiListNode.removeChild(child);
    },


    addEffect : function(){
        this.animNode = cc.instantiate(this.paiEffectPrefab);
        this.animNode.setPosition(this.UIControl.eatTagPos);
        this.animNode.scale = (this.deskType === GameDefine.DESKPOS_TYPE.XIA) ? 0.8 : 0.5;
        var effectTag = this.creatEffectTag();
        this.animNode.name = effectTag;
        this.paiListNode.addChild(this.animNode, 999, effectTag);
        this.animNode.getComponent("AnimHelper").init(effectTag, this);
    },

    showPengAnim : function(){
        this.addEffect();
        this.animNode.getComponent("AnimHelper").playPeng();
    },

    showGangAnim : function(){
        this.addEffect();
        this.animNode.getComponent("AnimHelper").playGang();
    },

    showHuAnim : function(){
        this.addEffect();
        this.animNode.getComponent("AnimHelper").playHu();
    },

    showChiAnim : function(){
        this.addEffect();
        this.animNode.getComponent("AnimHelper").playChi();
    },


//     showPaiAim : function(eatType) {
//         var animNode = cc.instantiate(this.paiEffectPrefab);
//         animNode.setPosition(this.UIControl.eatTagPos);
//         this.paiListNode.addChild(animNode, 999);
//         animNode.scale = (this.deskType === GameDefine.DESKPOS_TYPE.XIA) ? 0.8 : 0.5;
//        
//     },

    
    refreGangPai : function(){
        var gangList = this.paiObjData.pengGangPai.gang;
        this.UIControl.refreGangLen(gangList);
        for (var grounpIndex = 0; grounpIndex < gangList.length; grounpIndex++) {
            let gang = gangList[grounpIndex];
            // let gangPosList = this.UIControl.getGangPosList(grounpIndex, gang);
           for (var index = 0; index < gang.length; index++) {
                let pai = gang[index];
                let paiNode = this.paiListNode.getChildByName(pai.udid);
                if(!paiNode){
                    paiNode = this.createPengGangNode(pai);
                    this.paiListNode.addChild(paiNode);
                }
                if(!paiNode.isPengGangFrame){
                    this.gameUI.setPengGangPaiSprite(paiNode, this.deskType, pai, 
                        this.UIControl.pengGangScale);
                    paiNode.isPengGangFrame = true;
                }
                paiNode.setLocalZOrder(this.UIControl.getZorder(grounpIndex, index));
                paiNode.setPosition(this.UIControl.getGangPos(grounpIndex, index));
            }
        }
        if(this.deskType === GameDefine.DESKPOS_TYPE.SHANG){
            log("this is is deskType" , this.paiListNode)
        }
        
    },

    refrePengPai : function(){
        var pengList = this.paiObjData.pengGangPai.peng;
        this.UIControl.refrePengLen(pengList);
        for (var grounpIndex = 0; grounpIndex < pengList.length; grounpIndex++) {
            let peng = pengList[grounpIndex];
            for (var index = 0; index < peng.length; index++) {
                let pai = peng[index];
                let paiNode = this.paiListNode.getChildByName(pai.udid);
                if(!paiNode){
                    paiNode = this.createPengGangNode(pai);
                    this.paiListNode.addChild(paiNode);
                }
                if(!paiNode.isPengGangFrame){
                    this.gameUI.setPengGangPaiSprite(paiNode, this.deskType, pai, 
                        this.UIControl.pengGangScale);
                    paiNode.isPengGangFrame = true;
                }
                paiNode.setLocalZOrder(this.UIControl.getZorder(grounpIndex, index));
                paiNode.setPosition(this.UIControl.getPengPos(grounpIndex, index))
            }
        }
    },

    //摸牌
    addPai : function(pai){
        var curPaiLen   = this.paiObjData.shouShangPai.length;
        var paiNode     = this.createPaiNode(pai);
        paiNode.setPosition(this.UIControl.getNewShowPaiPos(curPaiLen))
        this.paiListNode.addChild(paiNode, 99);
        this.addPaiNode = paiNode;
        this.refreCaiShenColor();
    },




    //打出去的牌
    daPai : function(pai, paiObjData){
        this.paiObjData   = paiObjData;
        var targetNode    = this.paiListNode.getChildByName(pai.udid);
        //设置pai的资源图片
        this.gameUI.setPengGangPaiSprite(targetNode, this.deskType, pai,
            this.UIControl.daPaiScale);
        targetNode.setLocalZOrder(999);
        var action = cc.sequence(this.UIControl.moveOutAction, cc.callFunc(function(){
            // this.sortMajiangAnim(pai);
            this.refreShouPaiPos();
            this.player.daPaiAnimEnd();
            
        }, this))
        targetNode.runAction(action);
        this.refreCaiShenColor();
    },

    sortMajiangAnim : function(pai){
        //摸的牌就是打的牌
        /*
        if(pai.udid === this.addPaiUdid){return}
        if( GameDefine.DESKPOS_TYPE.XIA !== this.deskType){return}
        var targetData  = this.setPaiNewPos();
        if(targetData && this.addPaiNode){
            var oldAction = cc.moveTo(this.paiOldctTime, targetData.pos)
            var act       = this.UIControl.getNewMoveAction(targetData.pos, this.addPaiNode.getPosition())
            this.addPaiNode.runAction(cc.sequence(act, cc.callFunc(function(){
                this.addPaiNode.setLocalZOrder(targetData.zOrder);
            }, this)));
        }*/
    },

//     setPaiNewPos(){
//         var targetData;
//         var shouPaiData = this.paiObjData.shouShangPai
//         for (var k = 0; k < shouPaiData.length; k++) {
//             let pai         = shouPaiData[k]
//             var paiChildN   = this.paiListNode.getChildByName(pai.udid);
//             let pos = this.UIControl.getShouPaiPos(k)
//             let zOrder = parseInt(k) + 1
//             if(this.addPaiUdid && this.addPaiUdid === pai.udid){
//                 targetData = {};
//                 targetData.pos = pos;
//                 targetData.zOrder = zOrder;
//             }else{
//                 paiChildN.setPosition(pos);
//                 paiChildN.setLocalZOrder(zOrder)
//             }
        
//         }
//         return targetData;
//     },

    //设置打出去的牌最终去向
    setPaiEnd : function(isNoOneEat, paiDataObj, paiUdid){
        this.paiDataObj = paiDataObj;
        var targetNode = this.paiListNode.getChildByName(paiUdid);
        if(!isNoOneEat){
            this.paiListNode.removeChild(targetNode);
            return
        }
        targetNode.scale = this.UIControl.paiEndSacale;
        var paiIndex     = paiDataObj.daPaiOutList.length - 1;
        var paiPosData   = this.UIControl.getDaPaiEndData(paiIndex);
        var moveAct      = cc.sequence(cc.moveTo(this.paiEndActTime, paiPosData.pos), 
            cc.callFunc(function(){
                targetNode.setLocalZOrder(paiPosData.zOrder);
        }))
        targetNode.runAction(moveAct);
    },

    //邀请玩家
    onBtnInviteCliicked : function () {
        
    },
    //显示玩家详情
    onPlayerInfoClicked : function () {
          
    },


    //设置准备信息
    setIsReady : function (isReady) {
        this.readyTagN.active = isReady;
    },

    onPaiNodeClicked : function(paiNode) {
        //不是该你出牌
        if( !(this.player.dapaiStatus === GameDefine.PLAYERSTATUS.DAING)){return}
        //不是手上的牌
        if(paiNode.isPengGangFrame){return}
        if(!this.lastPaiNode){
            this.lastPaiNode = paiNode;
            paiNode.y += this.outPaiDis;
            return;
        }
        if(paiNode.name === this.lastPaiNode.name){
            this.player.turnToDaPai(paiNode.pai);
            this.lastPaiNode = undefined;
        }else {
            this.lastPaiNode.y -= this.outPaiDis;
            this.lastPaiNode = paiNode;
            paiNode.y += this.outPaiDis;
        }
    },
});



