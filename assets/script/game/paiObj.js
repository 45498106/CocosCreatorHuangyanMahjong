var GameDefine = require("GameDefine");
var utils = require("utils");
var log = utils.log;
var gameManager = require("gameManager");
// /*
// 	牌的数据结构，如果有多少万万字, 多少拖拉机
// */
var paiObjCls =function(startPaiList){
// 	this.TongziCount      = 0; //筒子数目
// 	this.WangCount        = 0; //万子数目
// 	this.TiaoTiaoCount    = 0; //条子叔
// 	this.tuolaji          = 0; //拖拉机
// 	this.xiaoduizi        = 0;//小对子
// 	this.daduizi          = 0; //大对子
// 	this.gangCount        = 0; //杠的牌
	this.pengCount        = 0; //碰的牌
	this.shouShangPai     = startPaiList; //手上没有碰和杠的牌
	this.pengGangPai      = {};
	this.pengGangPai.all  = []; //碰和杠出去的牌
	this.pengGangPai.peng = []; //碰出去的牌
	this.pengGangPai.gang = []; //杠出去的牌
	this.daPaiOutList     = []; //打出去没有被人吃的牌
// 	this.udidTag          = [];
// 	//刷新花色数目
// 	this.refreHuaseCount = function(){
// 		var allPai = this.shouShangPai.concat(this.pengGangPai.all);
// 		var huaseType = GameDefine.HUASE
// 		var wangCount = 0;
// 		var tongCount = 0;
// 		var tiaoCount = 0;
// 		for (var k = 0; k < allPai.length; k++) {
// 			let pai = allPai[k];
// 			if(pai.huase === huaseType.WANG){
// 				wangCount+=1;
// 			}
// 			if(pai.huase === huaseType.TONG){
// 				tongCount+=1;
// 			}
// 			if(pai.huase === huaseType.TIAO){
// 				tiaoCount+=1;
// 			}
// 		}
// 		this.WangCount     = wangCount;
// 		this.TongziCount   = tongCount;
// 		this.TiaoTiaoCount = tiaoCount;
// 	}
// 	//刷新拖拉机
// 	this.refreTuolaji = function(){
// 		//复制数组
// 		var refreList = this.shouShangPai.slice();
// 		this.tuolaji = 0;
// 		for (var k = 0; k < refreList.length; k++) {
// 			var pai = refreList[k];
// 			if(pai.paiNumber < 7 && !pai.isUsed){
// 				if(this.isInTuolaji(pai, refreList)){
// 					this.tuolaji++;
// 				}
// 			}
// 		}
// 	}


// 	this.refreXiaoDuizi = function(){
// 		var self       = this;
// 		var checkArray = this.shouShangPai.slice();
// 		var xiaoDui    = {};
// 		this.xiaoduizi = 0;
// 		checkArray.forEach(function(item, index){
// 			xiaoDui[item.huaseCN] = xiaoDui[item.huaseCN] || [];
// 			xiaoDui[item.huaseCN].push(item)
// 			if(xiaoDui[item.huaseCN].length === 2){
// 				self.xiaoduizi++;
// 			}
// 		})
			
// 	}

// 	this.refreDaDuizi = function(){
// 		var checkArray = this.shouShangPai.slice();
// 		var daDui      = {};
// 		this.daduizi   = 0;
// 		var self       = this;
// 		checkArray.forEach(function(item, index){
// 			daDui[item.huaseCN] = daDui[item.huaseCN] || [];
// 			daDui[item.huaseCN].push(item)
// 			if(daDui[item.huaseCN].length === 3){
// 				self.daduizi++;
// 			}
// 		})
// 	}

// 	//是否存在和目标牌同一起的拖拉机组合
// 	this.isInTuolaji = function(pai, paiList){
// 		var isTuolaji = false;
// 		var secPai, thirdPai;
// 		paiList.forEach(function(item, index){
// 			if(item.huase === pai.huase && !item.isUsed){
// 				if(item.paiNumber - pai.paiNumber === 1){
// 					secPai = paiList[index];
// 				}
// 				if(item.paiNumber - pai.paiNumber === 2){
// 					thirdPai = paiList[index];
// 				}
// 			}
// 		})
// 		if(secPai && thirdPai){
// 			secPai.isUsed   = true;
// 			thirdPai.isUsed = true;
// 			isTuolaji       = true;
// 		}
// 		return isTuolaji;
// 	}

// 	this.refreshPaiData = function(){
// 		this.refreHuaseCount();
// 		this.refreTuolaji();
// 		this.refreXiaoDuizi();
// 		this.refreDaDuizi();
// 	}

	this.spliceShouShangPai = function(targetID){
		var splicePai;
		for(var i = this.shouShangPai.length -1; i > -1; i--){
			let curPai = this.shouShangPai[i];
			if(curPai.id === targetID){
				splicePai = curPai;
				this.shouShangPai.splice(i, 1);
				return splicePai;
			}
		}
	}

	//碰牌
	this.chi = function(pai, chiData, isSelf, rotateData){
		var pengList = []; 
		this.pengGangPai.all.push(pai);
		for(let i = 0; i < 2; i++){
			var spliceID = isSelf ? chiData[i] : 0 ;
			let splicePai = this.spliceShouShangPai(spliceID);
			splicePai.id = chiData[i];
			this.pengGangPai.all.push(splicePai);
			pengList.push(splicePai);
		}
		if(rotateData.index == 0){
			pengList.unshift(pai);
		}else {
			pengList.push(pai);
		}
		pengList.sort(function(a, b){
			return a.sortId - b.sortId;
		})
		pengList[rotateData.index].rotate = rotateData.rotate;
		this.pengGangPai.peng.push(pengList);
	},

	//碰牌
	this.peng = function(pai, isSelf, rotateData){
		var pengList = [pai]; 
		var targetID = isSelf ? pai.id : 0;
		this.pengGangPai.all.push(pai);
		for(let i = 0 ; i < 2; i++){
			let curPai = this.spliceShouShangPai(targetID);
			curPai.id = pai.id;
			pengList.push(curPai);
			this.pengGangPai.all.push(curPai);
		}
		pengList[rotateData.index].rotate = rotateData.rotate;
		this.pengGangPai.peng.push(pengList);
		this.pengCount += 1;
	},

	

	//杠牌， 从碰的拍上杠牌
	this.gang_0 = function(pai, isSelf){
		var gangList = []; 
		this.pengGangPai.all.push(pai);
		for(let i = 0; i < this.pengGangPai.peng.length; i++) {
			var pengList = this.pengGangPai.peng[i];
			if(pengList[0].id === pai.id){
				gangList     = pengList;
				var targetID = isSelf ? pai.id : 0;
				var curPai   = this.spliceShouShangPai(targetID);
				curPai.id    = pai.id;
				gangList.push(curPai);
				this.pengGangPai.peng.splice(i, 1);
			}
		}
		this.pengGangPai.gang.push(gangList);
	},

	//暗杠
	this.gang_1 = function(pai, isSelf){
		var gangList = []; 
		var targetID = isSelf ? pai.id : 0;
		for(let i = 0 ; i < 4; i++){
			let curPai = this.spliceShouShangPai(targetID);
			curPai.id  = pai.id;
			gangList.push(curPai);
			this.pengGangPai.all.push(curPai);
		}
		this.pengGangPai.gang.push(gangList);
	},

	//杠牌， 自己手中有三张 杠别人打出来的牌 
	this.gang_2 = function(pai, isSelf, rotateData){
		var gangList = [pai]; 
		var targetID = isSelf ? pai.id : 0;
		this.pengGangPai.all.push(pai);
		for(let i = 0 ; i < 3; i++){
			let curPai = this.spliceShouShangPai(targetID);
			curPai.id = pai.id;
			gangList.push(curPai);
			this.pengGangPai.all.push(curPai);
		}
		gangList[rotateData.index].rotate = rotateData.rotate;
		this.pengGangPai.gang.push(gangList);
	},

// 	//从自己碰的牌中杠牌
// 	this.gangPaiFromPeng = function(pai){
// 		var addList = [];
// 		for (var k = 0; k < this.pengGangPai.peng.length; k++) {
// 			if(this.pengGangPai.peng[k][0].huaseCN === pai.huaseCN){
// 				addList = this.pengGangPai.peng[k];
// 				addList.push(pai);
// 				this.pengGangPai.all.push(pai);
// 				this.pengGangPai.peng.splice(k, 1);
// 				break;
// 			}
// 		}
// 		this.pengGangPai.gang.push(addList);
// 	}

// 	//杠牌
// 	this.gangPai = function(pai){
// 		var gangList = [pai];
// 		for(var i = this.shouShangPai.length -1; i > -1; i--){
// 			let curPai = this.shouShangPai[i];
// 			if(curPai.huaseCN === pai.huaseCN ){
// 				gangList.push(curPai);
// 				this.pengGangPai.all.push(curPai);
// 				this.shouShangPai.splice(i, 1);
// 			}
// 		}
// 		this.pengGangPai.all.push(pai);
// 		this.pengGangPai.gang.push(gangList);
// 		this.gangCount = this.pengGangPai.peng.length;
// 	}

// 	this.canGangRromPeng = function (pai) {
// 		var pengList = this.pengGangPai.peng;
// 		var isCanGang = false; 
// 		for (var k = 0; k < pengList.length; k++) {
// 			if(pengList[k][0].huaseCN === pai.huaseCN){
// 				isCanGang = true;
// 				break;
// 			}
// 		}
// 		return isCanGang;
// 	}

// 	this.isCanGangPai = function(pai){
// 		var exitCount = 0;
// 		this.shouShangPai.forEach(function(item, index){
// 			if(item.huaseCN === pai.huaseCN){
// 				exitCount++;
// 			}
// 		})
// 		return(exitCount === 3)
// 	}

// 	this.isCanPengPai = function(pai){
// 		var exitCount = 0;
// 		this.shouShangPai.forEach(function(item, index){
// 			if(item.huaseCN === pai.huaseCN){
// 				exitCount++;
// 			}
// 		})
// 		return(exitCount === 2)
// 	}

// 	//是否可以胡牌
// 	this.isCanHuPai = function(pai){
// 		var oldShouPai = this.shouShangPai.slice();
// 		this.addPai(pai);
// 		var huResult = require("huleSys").isHule(this);
// 		this.shouShangPai = oldShouPai;
// 		this.refreshPaiData();
// 		return huResult.isHu;
// 	}


// 	this.canEatPai = function(pai){
// 		var eatTypeList = [];
// 		if(this.isCanHuPai(pai)){
// 			eatTypeList.push(GameDefine.EAT_TYPE.HU)
// 		}
// 		if(this.isCanGangPai(pai)){
// 			eatTypeList.push(GameDefine.EAT_TYPE.GANG)
// 		}
// 		if(this.isCanPengPai(pai)){
// 			eatTypeList.push(GameDefine.EAT_TYPE.PENG);
// 		}
// 		return eatTypeList;
// 	}

	this.addPai = function(pai){
		this.shouShangPai.push(pai);
		// this.refreshPaiData();
	}

// 	this.isCanSelfGang = function(pai){
// 		var canGang = false;
// 		if(this.isCanGangPai(pai)){
// 			this.gangPai(pai);
// 			canGang = true;
// 		}
// 		if(this.canGangRromPeng(pai)){
// 			require("utils").isDebug = true;
// 			this.gangPaiFromPeng(pai);
// 			canGang = true;
// 		}
// 		return canGang;
// 	}
// 	this.eatPai = function(eatType, pai){
// 		if(eatType === GameDefine.EAT_TYPE.GANG){
// 			this.gangPai(pai);
// 		}
// 		if(eatType === GameDefine.EAT_TYPE.PENG){
// 			this.pengPai(pai);
// 		}
// 	}

	this.checkPai   = function(pai){
		pai        = pai || {};
		pai.id     = pai.id || 0;
		pai.sortId = pai.sortId || 0;
	}, 
	//手上的牌排序
	this.sortMajiang = function() {
		var self = this;
		this.shouShangPai.sort(function(a, b){
			self.checkPai(a);
			self.checkPai(b);
			return a.sortId - b.sortId;
		})
	}
	//从pai obj中移出pai
	this.chuPai = function(paiID){
		var spliceIndex  = 0;
		for(let i = 0; i < this.shouShangPai.length; i++){
			if(this.shouShangPai[i].id == paiID){
				spliceIndex = i;
				break;
			}
		}
		var chuPai = this.shouShangPai.splice(spliceIndex, 1)[0];
		return chuPai;
	}

	//其他玩家出牌
	this.otherChupai = function(){
		var chuPai = this.shouShangPai.splice(0, 1)[0];
		return chuPai;
	}



}

module.exports = {
	new : function(paiList){
		return new paiObjCls(paiList);
	}
}