var GameDefine = require("GameDefine");
var utils      = require("utils");
var log = utils.log;
var majiang = {};

majiang.Pai = [];
//生成牌
majiang.init = function(){
	this.Pai       =  [];
	var totalCount = 108;
	var huaseType  = GameDefine.HUASE;
    for(var i =0; i < totalCount; i++){
		let paiData       = {};
		paiData.huase     = huaseType.WANG;
		paiData.huase     = (i > 35) ? huaseType.TONG : paiData.huase;
		paiData.huase     = (i > 71) ? huaseType.TIAO : paiData.huase;
		paiData.paiNumber = ((i + 1) % 9);
		paiData.paiNumber = (paiData.paiNumber === 0) ? 9 : paiData.paiNumber;
		paiData.sortPoint = (paiData.huase + 1) * 20 + paiData.paiNumber;
		paiData.udid      = "pai_" + (i+1);
		paiData.huaseCN   = paiData.paiNumber + this.getHuaseCNName(paiData.huase);
        this.Pai.push(paiData)
    }
}

//洗牌 
//deskMajiang当前牌局中未打出去的牌
majiang.xipai = function() {
	//
	this.deskMajiang = this.Pai.slice();
	for(var k = 0; k < this.Pai.length; k++){
		//随机交换牌
		let changIndex = utils.intRandom(0, this.Pai.length - 1);
		let oldValue = this.deskMajiang[k];
		this.deskMajiang[k] = this.deskMajiang[changIndex];
		this.deskMajiang[changIndex] = oldValue;
	}
}

majiang.getStartIndex = function()
{	
	//这里暂时这样做
	return utils.intRandom(0, this.deskMajiang.length - 30);
}

//发牌
majiang.faPai = function() {
	var startIndex   = this.getStartIndex();
	var spliceArray  = this.deskMajiang.splice(0, startIndex);
	this.deskMajiang = this.deskMajiang.concat(spliceArray);
	var faPaiList    = [];
	faPaiList[0]     = new Array();
	faPaiList[1]     = new Array();
	faPaiList[2]     = new Array();
	faPaiList[3]     = new Array();
	//第一个是庄家 先每人摸四张
	for (var turnIndex = 0; turnIndex < 3; turnIndex++) {
		for (let pIndex = 0; pIndex < faPaiList.length; pIndex++) {
			let deletData     = this.deskMajiang.splice(0, 4)
			faPaiList[pIndex] = faPaiList[pIndex].concat(deletData);
		}
	}
	//再跳牌
	faPaiList[0] = faPaiList[0].concat(this.deskMajiang.splice(2, 1));
	for (var k = 0; k < faPaiList.length; k++) {
		faPaiList[k] = faPaiList[k].concat(this.deskMajiang.splice(0, 1));
	}
	return faPaiList;
}

//摸下一张牌
majiang.nextPai = function(){
	var nextPai = this.deskMajiang.splice(0, 1);
	var paiObj = nextPai ? nextPai[0] : undefined;
	return paiObj;
}

majiang.getHuaseCNName = function(paiType){
	var huaseType = GameDefine.HUASE; 
	var cnName = "万";
	cnName = paiType === huaseType.TONG ? "筒" : cnName
	cnName = paiType === huaseType.TIAO ? "条" : cnName
	return cnName;
}

module.exports = majiang;