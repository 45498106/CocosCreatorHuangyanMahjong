var utils = require("utils");
var log = utils.log;
var GameDefine = require("GameDefine");
var robot = function(attrData, context){
    this.thinkTime =  attrData.thinkTime * 1000;
    this.gangPentTime = attrData.gangPentTime * 1000;
    this.context = context;
}

//打牌出去
robot.prototype.playPai = function(paiObj){
    var self = this;
    this.daPaiIndex = this.getSmallHuaseIndex(paiObj);
    setTimeout(function() {
        self.context.chuPaiCallback(self.daPaiIndex);
    }, this.thinkTime);
}

robot.prototype.getSmallHuaseIndex = function(paiObj) {
	var pareList = [];
	if(paiObj.TongziCount !== 0){
		pareList.push({count: paiObj.TongziCount, type : GameDefine.HUASE.TONG})
	}
	if(paiObj.TiaoTiaoCount !== 0){
		pareList.push({count: paiObj.TiaoTiaoCount, type : GameDefine.HUASE.TIAO})
	}
	if(paiObj.WangCount !== 0){
		pareList.push({count: paiObj.WangCount, type : GameDefine.HUASE.WANG})
	}
	var huaseType, outIndex;
	var pareCount = 99;
	pareList.forEach(function(item, index){
		if(item.count < pareCount){
			pareCount = item.count;
			huaseType = item.type;
		}
	})
	var isFind = false;
	paiObj.shouShangPai.forEach(function(item, index){
		if(item.huase === huaseType && !isFind){
			outIndex = index;
			isFind = true;
		}		
	})
	return outIndex
}

robot.prototype.canEatPai = function(eatTypeList, pai){
	var self = this;
	setTimeout(function(){
		//随机杠牌碰牌
		if(Math.random() > 0.02) {
			self.huGangPengPai(eatTypeList, pai);
		}else {
			self.context.nextGangPeng();
		}
		
	}, this.gangPentTime);
}

robot.prototype.huGangPengPai  = function(eatTypeList, pai){
	//只操作第一个
	var opearType = eatTypeList[0];
	this.context.eatPai(opearType, pai);
}

module.exports = {
	new : function(robotData, playerContext){
		return new robot(robotData, playerContext);
	}
};