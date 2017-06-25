/*
    麻将胡牌规则
*/

var GameDefine = require("GameDefine");

var Hule = {};
Hule.isHule = function(paiData){
    // var paiData = this.refrePaiData(paiList);
	var result  = {};
    result.isHu = false;
    result.mulriple = 1;
    /*
    if(this.isXiaoDui(paiData)) {
    	result.isHu = true;
    	result.mulriple = result.mulriple * 2;
    }
    if(this.isQingYiSe(paiData)){
        result.isHu     = true;
        result.mulriple = result.mulriple * 4;
    }
    if(this.isNormalHu(paiData)){
    	result.isHu = true;
    	result.mulriple = result.mulriple + 1;
    }*/
    

    if(this.isDaDui(paiData)){
        result.isHu = true;
        result.mulriple = result.mulriple * 2;
    }

    if(paiData.gang > 0) {
    	result.mulriple = result.mulriple * (paiData.gang + 1);
    }
    return result;
}


//小对子  翻2翻
Hule.isXiaoDui = function(paiData) {
    return (paiData.xiaoduizi === 7);
}

//大对子  翻2翻
Hule.isDaDui = function(paiData) {
    return ((paiData.daduizi + paiData.gang === 4) && paiData.xiaoduizi === 1);
}

//清一色
Hule.isQingYiSe = function(paiData){
    var isOnlyWang = paiData.TongziCount === 0 && paiData.TiaoTiaoCount === 0;
    var isOnlyTong = paiData.WangCount === 0 && paiData.TiaoTiaoCount === 0
    var isOnlyTiao = paiData.WangCount === 0 && paiData.TongziCount === 0
	return (isOnlyTiao || isOnlyWang || isOnlyTong);
}

//普通胡
Hule.isNormalHu = function(paiData){
	return ((paiData.tuolaji + paiData.daduizi) === 4 && paiData.xiaoduizi === 1); 
}



module.exports = Hule;