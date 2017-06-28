var utils      = require("utils");
var GameDefine = require("GameDefine");
var gameManager = require("gameManager");
var log = utils.log;

var playerCls  = function () {

}

playerCls.prototype.setUserData = function (playerData) {
    this.playerData = playerData;
    this.playerUI.refreshPlayerData(playerData);
    this.setReadyData(playerData.Status === GameDefine.PLAYER_READY.READY);
}

playerCls.prototype.setDirectNode = function(directionN, direction){
    this.directionN = directionN;
    this.direction  = direction;
}

playerCls.prototype.setIsZhuang = function(isZhuang){
    this.isZhuang = isZhuang;
    this.playerUI.setIsZhuang(isZhuang);
    if(this.isZhuang){
        this.lightDirection();
    }else {
        this.darkDirection();
    }
}

playerCls.prototype.setPlayStatus = function(status) {
    this.dapaiStatus = status;
}

playerCls.prototype.lightDirection = function() {
    this.directionN.active = true;
     this.setPlayStatus(GameDefine.PLAYERSTATUS.DAING);
}

playerCls.prototype.darkDirection = function() {
    this.directionN.active = false;
    this.setPlayStatus(GameDefine.PLAYERSTATUS.WAITING);
}

playerCls.prototype.refreCaiShenColor = function(){
    this.playerUI.refreCaiShenColor();
}

//刷新打出去的牌最终去向
playerCls.prototype.checkPaiEnd = function() {
    var ChuPaiType = GameDefine.CHUPAI_STATUS;
    if(gameManager.ChuPaiStatus !== ChuPaiType.START && this.isDaAnimEnd){
        this.setPaiEnd(gameManager.ChuPaiStatus)
        gameManager.ChuPaiStatus = ChuPaiType.START;
        this.isDaAnimEnd      = false;
        
    }
}



playerCls.prototype.init = function(playerUI, desPosType, gameUI){
    this.udidTag    = 0;
    this.playerUI   = playerUI;
    this.desPosType = desPosType;
    this.playerUI.initDeskPosType(desPosType, gameUI, this);
    if(this.desPosType === GameDefine.DESKPOS_TYPE.XIA){
        this.chuPai = this.selfChuPai;
    }
    this.IsSelfPlayer = (this.desPosType === GameDefine.DESKPOS_TYPE.XIA);
    // this.testPos();
}

//设置开局发的牌
playerCls.prototype.setStartPaiData = function(paiData){
    var paiObjList = []
    var addCount = this.isZhuang ? paiData.length -1 : paiData.length;
    for(let i = 0; i < addCount; i++){
        paiObjList[i] = this.getPaiObj(paiData[i]);
    }
    this.paiDataObj = require("paiObj").new(paiObjList);
    this.paiDataObj.sortMajiang();
    this.playerUI.newRoundPaiAnim(this.paiDataObj);
    if(this.isZhuang){
        this.mopai(paiData[paiData.length -1]);   
    }
}

playerCls.prototype.testPos = function(){
    var paiObjLi = [];
    this.paiDataObj = require("paiObj").new(paiObjLi);
    var self = this;
    setTimeout(function(){
        var gang = [];
            for(let i = 0; i<2; i++){
                gang[i] = [];
                for(let k = 0; k<4; k++){
                    gang[i].push(self.getPaiObj(13));
                }
                
            }
            gang[0][0].rotate = -90;
            gang[1][2].rotate = 90;
            var peng = [];
            for(let i = 0; i<2; i++){
                peng[i] = [];
                for(let k = 0; k<3; k++){
                    peng[i].push(self.getPaiObj(11 + i));
                }
            }
            peng[0][0].rotate = -90;
            peng[1][2].rotate = 90;
            var shouShangPai = [];
            for (var i = 0; i < 2; i++) {
                shouShangPai.push(self.getPaiObj(21 + i));
            }
        self.paiDataObj.pengGangPai.gang = gang;
        self.paiDataObj.pengGangPai.peng = peng;
        self.paiDataObj.shouShangPai = shouShangPai;
        self.playerUI.newRoundPaiAnim(self.paiDataObj);
        self.playerUI.pengGangPaiUI(self.paiDataObj);
    }, 1000);
    this.playerUI.pengGangPaiUI(this.paiDataObj);
}

playerCls.prototype.getPaiObj = function(id){
    var pai    = {};
    pai.id     = id || 0;
    pai.rotate = 0;
    pai.sortId = utils.isBaiBan(id) ? gameManager.CaiShenPai : id;
    //cai shen pai  put left, so  sortID is 0;
    pai.sortId = gameManager.CaiShenPai == id ? -1 : pai.sortId;
    pai.udid   = "pai_" + this.udidTag++;
    return pai;
}

// //设置打牌机器人
// playerCls.prototype.setRobotPlayer = function(robotData){
//     this.robotPlayer = require("robotPlayer").new(robotData, this);
// }

//摸到新牌
playerCls.prototype.mopai = function(id){

    /*
    this.setCurMoPaiUdid(pai);
    this.playerUI.addPai(pai);
    if(this.paiDataObj.isCanSelfGang(pai)){
        var gangType = GameDefine.EAT_TYPE.GANG;
        this.playerUI.pengGangPaiUI(gangType, this.paiDataObj);
        gameManager.mopai();
    }else {        
        this.paiDataObj.addPai(pai);    
        this.checkIsHu();
        this.turnToChupai();
    }
    */
    var pai = this.getPaiObj(id);
    this.curMoPaiUdid = pai.udid;
    this.paiDataObj.addPai(pai); 
    this.playerUI.addPai(pai);
}


playerCls.prototype.setReadyData = function(isReady) {
    this.isReady = isReady;
    this.playerUI.setIsReady(this.isReady);
}


// playerCls.prototype.checkIsHu = function(){
//     var huleResult = require("huleSys").isHule(this.paiDataObj);
//     if(huleResult.isHu){
//         log(this.name + ":" + this.toString());
//         gameManager.endMajiang();
//     }
// }

// //该玩家出牌了
// playerCls.prototype.turnToChupai = function(){
//     if(gameManager.isRoundIsOver){return}
// }

//出牌
playerCls.prototype.chuPai = function(paiID, paiUdid){
    var pai = this.paiDataObj.otherChupai(paiID);
    pai.id = paiID;
    this.curDaPai = pai;
    this.paiDataObj.sortMajiang(); 
    this.playerUI.daPai(pai, this.paiDataObj);
}

playerCls.prototype.selfChuPai = function(paiID, paiUdid) {
    var pai  = this.paiDataObj.chuPai(paiUdid);
    this.curDaPai    = pai;
    this.isDaAnimEnd = false;
    this.paiDataObj.sortMajiang(); 
    this.playerUI.daPai(pai, this.paiDataObj);
}

playerCls.prototype.daPaiAnimEnd = function(){
    this.isDaAnimEnd = true;
    this.checkPaiEnd();
}

// playerCls.prototype.isZhuangjia = function(){
//     return gameManager.zhuangIndex === this.desPosType;
// }

//玩家打出去牌的最终结果
playerCls.prototype.setPaiEnd = function(ChuPaiStatus){
    var isNoOneEat  = ChuPaiStatus === GameDefine.CHUPAI_STATUS.NEW;
    if(isNoOneEat){
        this.paiDataObj.daPaiOutList.push(this.curDaPai);
    }
    this.playerUI.setPaiEnd(isNoOneEat, this.paiDataObj, this.curDaPai.udid);
}

// playerCls.prototype.eatPai = function(opearType, pai){
//     gameManager.eatPai(true);
//     this.paiDataObj.eatPai(opearType, pai);
//     if(opearType === GameDefine.EAT_TYPE.HU) {
//         log("---有人给 " + this.name + "点炮 牌是: " + pai.huaseCN)
//         gameManager.endMajiang();
//     }else {
//         this.turnToChupai();
//     }
//     this.playerUI.pengGangPaiUI(opearType, this.paiDataObj);
// }
playerCls.prototype.peng = function(paiID, isSelf){
    var pai = this.getPaiObj(paiID);
    var rotateData = gameManager.getEatPaiRotate(this.desPosType);
    this.paiDataObj.peng(pai, isSelf, rotateData);
    this.playerUI.pengGangPaiUI(this.paiDataObj);
    this.playerUI.showPengAnim();
}

playerCls.prototype.gang = function(paiID, isSelf, gangType){
    var pai = this.getPaiObj(paiID);
    var rotateData = gameManager.getEatPaiRotate(this.desPosType);
    if(gangType === GameDefine.EAT_TYPE[6]){
        this.paiDataObj.gang_0(pai, isSelf);
    }else if(gangType === GameDefine.EAT_TYPE[5]){
        this.paiDataObj.gang_1(pai, isSelf), rotateData;
    }else {
        this.paiDataObj.gang_2(pai, isSelf, rotateData);
    }
    this.playerUI.pengGangPaiUI(this.paiDataObj);

    this.playerUI.showGangAnim();
}


playerCls.prototype.chi = function(chiData, isSelf){
    //最后一个是刚刚push进去的
    //如果是别人吃牌，后面代码则会继续处理前面两个
    var rotateData = gameManager.getEatPaiRotate(this.desPosType);
    var pai = this.getPaiObj(chiData[2]);
    this.paiDataObj.chi(pai, chiData, isSelf, rotateData);
    log(this.paiDataObj);
    this.playerUI.pengGangPaiUI(this.paiDataObj);
    this.playerUI.showChiAnim();
}


// //当前玩家是否可以牌
// playerCls.prototype.canEatPai = function(pai){
//     var eatTypeList = this.paiDataObj.canEatPai(pai);
//     if(eatTypeList.length === 0) {
//         this.nextGangPeng();
//         return
//     }
// }

// playerCls.prototype.nextGangPeng = function(){
// }


playerCls.prototype.turnToDaPai = function(pai){
    this.setPlayStatus(GameDefine.PLAYERSTATUS.WAITING);
    gameManager.turnToChupai(pai);
}


playerCls.prototype.toString = function(){
    var self = this;
    var paiStr  = "碰杠的牌: ";
    this.paiDataObj.pengGangPai.all.forEach(function(item){
        var cnName = item ? self.getCNName(item.id) : "" 
            paiStr +=  cnName+ " ";
    })
    paiStr += " 手上的牌: " + " "
    this.paiDataObj.shouShangPai.forEach(function(item){
        var cnName = item ? self.getCNName(item.id) : "" 
            paiStr +=  cnName+ " ";
    })
    return paiStr;
}

playerCls.prototype.toGangString = function(){
    var self = this;
    var paiStr  = "杠的牌: ";
    for (let k in this.paiDataObj.pengGangPai.gang) {
        var gangPaiList = this.paiDataObj.pengGangPai.gang[k];
        gangPaiList.forEach(function(item){
            var cnName = item ? self.getCNName(item.id) : "" 
            paiStr +=  cnName+ " ";
        })
    }
    
    paiStr  += " ,peng的牌: ";
    for (let k in this.paiDataObj.pengGangPai.peng) {
        var pengPaiList = this.paiDataObj.pengGangPai.peng[k];
        pengPaiList.forEach(function(item ){
            var cnName = item ? self.getCNName(item.id) : "" 
            paiStr +=  cnName+ " ";
        })
    }
    return paiStr;
}

playerCls.prototype.getCNName = function(id){
    if(!id){return}
    id = parseInt(id);
    var idEnd =  "(" + id + ")";
    if(GameDefine.TeSuPaiName[id]){
        return GameDefine.TeSuPaiName[id] + idEnd ;
    }
    var type  = Math.floor(id / 10);
    var count = (id % 10);
    if(type === 1){
        type = "条"
    }
    if(type === 2){
        type = "筒"
    }
    if(type === 3){
        type = "万"
    }
    return count + type + idEnd;
}

module.exports = {
    new : function(){
        return new playerCls();
    }
}
