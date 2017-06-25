var utils = {};
utils.isDebug = true;
utils.log = function (argument) {
	if(!utils.isDebug){return};
	for(var k in arguments) {
        cc.log(new Date());
        cc.log(arguments[k]);
    }
}

utils.spliceArray = function(rmArray, itemValue){
    if(!rmArray || !(rmArray instanceof Array)){
        this.log("spliceArray not a array")
        return
    }
    for(let i = 0; i<rmArray.length; i++){
        if(rmArray[i] === itemValue){
            rmArray.splice(i, 1);
            break;
        }
    }
}

//get random int of [min - max] 
utils.intRandom  = function(min, max) {
    min = parseFloat(min);
    max = parseFloat(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

utils.cloneData = function(fa) {
        var cloneObj;
        if (fa.constructor == Object) {
            cloneObj = new fa.constructor();
        }else if (fa.constructor == Array) { 
        	cloneObj = [];
        }
        else
        {
            cloneObj = new fa.constructor(fa.valueOf());
        }
        for(var key in fa) {
            if(cloneObj[key] !== fa[key]) {
                if(typeof(fa[key]) === "object") {
                    cloneObj[key] = this.cloneData(fa[key]);
                }else {
                    cloneObj[key] = fa[key];
                }
            }
        }
        return cloneObj;
}

utils.setChannelInfo = function(gameChannel){
	this.gameChannel = gameChannel;
}

utils.getChannelInfo = function(){
	return this.gameChannel
}

utils.getLocalPaiID  = function(id){
    var GameDefine = require("GameDefine");
    var localID    = GameDefine.TeSuPaiID[id];
    if(localID){
       return localID;
    }
    var serverType = Math.floor(id/10);
    var num        = id - serverType* 10;
    var localType  = GameDefine.ServerToLocalType[serverType];
    localID        = num * 10 + localType; 
    return localID;
}

//是不是白板
utils.isBaiBan = function(id){
    return (parseInt(id) === 43);
}

utils.testPICByID = {
    1 : "http://img.hb.aicdn.com/accd5ab30ab6c883a5b60341cf98525db7838f4112d9a-iyhkOn_fw658",
    2 : "http://img.hb.aicdn.com/036bb2585a43f0a9fdcc8c50220453b751d3816670bd-U779o3_fw658",
    3 : "http://img.hb.aicdn.com/dc1a8e2efcd560a49b6da6b084cd747952939b8d7517-AUOR6S_fw658",
    4 : "http://img.hb.aicdn.com/88899902d7ce1ad53c9a62e625cc0c5ac5a9b3b36729-MM8G1x_fw658",
}

module.exports = utils;