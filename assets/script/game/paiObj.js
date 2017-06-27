var GameDefine = require("GameDefine");
var utils = require("utils");
var log = utils.log;
var gameManager = require("gameManager");
// /*
// 	牌的数据结构
// */
var paiObjCls =function(startPaiList){
	this.pengCount        = 0; //碰的牌
	this.shouShangPai     = startPaiList; //手上没有碰和杠的牌
	this.pengGangPai      = {};
	this.pengGangPai.all  = []; //碰和杠出去的牌
	this.pengGangPai.peng = []; //碰出去的牌
	this.pengGangPai.gang = []; //杠出去的牌
	this.daPaiOutList     = []; //打出去没有被人吃的牌
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
			return a.id - b.id;
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
	this.addPai = function(pai){
		this.shouShangPai.push(pai);
		// this.refreshPaiData();
	}

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
	this.chuPai = function(udid){
		var spliceIndex  = 0;
		for(let i = 0; i < this.shouShangPai.length; i++){
			if(this.shouShangPai[i].udid == udid){
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