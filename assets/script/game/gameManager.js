var majiangSys      = require("majiangSys");
var GameDefine      = require("GameDefine");
var utils           = require("utils");
var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");
var GameDataMgr     = require("GameDataMgr");
var log             = utils.log;
var GameManager     = {};

//初始化数据
GameManager.initGame = function(playerList, gameUICB){
	this.playerList = playerList;
	this.gameUICB   = gameUICB;
	this.reportData = {};
	this.init();
}

GameManager.init = function(){
	this.initDirectionNodeList();
	this.setDeskPlayersData(); 
	var mmgr    = NetMessageMgr;
	var netList = NetProtocolList;
	mmgr.addMessageCB(netList.EnterRoomNoticeNum.netID, this.onUserEnterRoom, this);
	mmgr.addMessageCB(netList.PrepareNoticeNum.netID, this.prepareNoticeMessage, this);
	mmgr.addMessageCB(netList.ExitRoomNoticeNum.netID, this.exitRoomNotice, this);
	mmgr.addMessageCB(netList.FaPaiMessageNum.netID,this.startFaPai, this);
	mmgr.addMessageCB(netList.CaiShengPaiNoticeNum.netID, this.caiShengPai, this)
	mmgr.addMessageCB(netList.BenMenFengReminderNum.netID, this.benmenFengNotice, this)
	mmgr.addMessageCB(netList.ShengPaiStageNoticeNum.netID, this.ShengPaiNotice, this)
	mmgr.addMessageCB(netList.MoPaiNoticeNum.netID, this.MoPaiNotice, this);
	mmgr.addMessageCB(netList.ChuPaiNoticeNum.netID, this.ChuPaiNotice, this);
	mmgr.addMessageCB(netList.MoPaiMessageNum.netID, this.MoPaiNotice, this);
	mmgr.addMessageCB(netList.ChuPaiZuHeReminderNum.netID, this.ChuPaiZuHeReminder, this);
	mmgr.addMessageCB(netList.PengPaiAckMessageNum.netID, this.PengPaiAckMessage, this);
	mmgr.addMessageCB(netList.MoPaiZuHeNoticeNum.netID, this.ChuPaiZuHeNotice, this);
	mmgr.addMessageCB(netList.ChuPaiZuHeNoticeNum.netID, this.ChuPaiZuHeNotice, this);
	mmgr.addMessageCB(netList.ChiPaiAckMessageNum.netID, this.ChiPaiAckMessage, this);
	mmgr.addMessageCB(netList.ZhanJiNoticeNum.netID, this.ZhanJiNotice, this);
	mmgr.addMessageCB(netList.TotalZhanJiNoticeNum.netID, this.TotalZhanJiNotice, this);
	mmgr.addMessageCB(netList.MingGang2PaiAckMessageNum.netID, this.MingGang2PaiAckMessage, this);
	mmgr.addMessageCB(netList.QiangGangReminderNum.netID, this.QiangGangReminder, this);
	mmgr.addMessageCB(netList.QiangGangNoticeNum.netID, this.QiangGangNotice, this);
	mmgr.addMessageCB(netList.QiangGangHuPaiAckMessageNum.netID, this.MingGang2PaiAckMessage, this);
	mmgr.addMessageCB(netList.MingGang1PaiAckMessageNum.netID, this.MingGang1PaiAckMessage, this);
	mmgr.addMessageCB(netList.AnGangPaiAckMessageNum.netID, this.AnGangPaiAckMessage, this);
	mmgr.addMessageCB(netList.ZiMoHuPaiAckMessageNum.netID, this.ZiMoHuPaiAckMessage, this);
	mmgr.addMessageCB(netList.MoPaiZuHeReminderNum.netID, this.MoPaiZuHeReminder, this);
	mmgr.addMessageCB(netList.RestoreListenReminderNum.netID, this.RestoreListenReminder, this);
}

GameManager.onDestroy  = function(){
	var mmgr    = NetMessageMgr;
	var netList = NetProtocolList;
	mmgr.rmMessageCB(netList.EnterRoomNoticeNum.netID,this.onUserEnterRoom);
	mmgr.rmMessageCB(netList.PrepareNoticeNum.netID, this.prepareNoticeMessage);
	mmgr.rmMessageCB(netList.ExitRoomNoticeNum.netID, this.exitRoomNotice);
	mmgr.rmMessageCB(netList.FaPaiMessageNum.netID,this.startFaPai);
	mmgr.rmMessageCB(netList.CaiShengPaiNoticeNum.netID, this.caiShengPai)
	mmgr.rmMessageCB(netList.BenMenFengReminderNum.netID, this.benmenFengNotice)
	mmgr.rmMessageCB(netList.ShengPaiStageNoticeNum.netID, this.ShengPaiNotice)
	mmgr.rmMessageCB(netList.MoPaiNoticeNum.netID, this.MoPaiNotice);
	mmgr.rmMessageCB(netList.ChuPaiNoticeNum.netID, this.ChuPaiNotice);
	mmgr.rmMessageCB(netList.MoPaiMessageNum.netID, this.MoPaiNotice);
	mmgr.rmMessageCB(netList.ChuPaiZuHeReminderNum.netID, this.ChuPaiZuHeReminder);
	mmgr.rmMessageCB(netList.PengPaiAckMessageNum.netID, this.PengPaiAckMessage)
	mmgr.addMessageCB(netList.MoPaiZuHeNoticeNum.netID, this.ChuPaiZuHeNotice);
	mmgr.rmMessageCB(netList.ChuPaiZuHeNoticeNum.netID, this.ChuPaiZuHeNotice);
	mmgr.rmMessageCB(netList.ChiPaiAckMessageNum.netID, this.ChiPaiAckMessage);
	mmgr.rmMessageCB(netList.ZhanJiNoticeNum.netID, this.ZhanJiNotice);
	mmgr.rmMessageCB(netList.TotalZhanJiNoticeNum.netID, this.TotalZhanJiNotice);
	mmgr.rmMessageCB(netList.MingGang2PaiAckMessageNum.netID, this.MingGang2PaiAckMessage)
	mmgr.rmMessageCB(netList.QiangGangReminderNum.netID, this.QiangGangReminder);
	mmgr.rmMessageCB(netList.QiangGangNoticeNum.netID, this.QiangGangNotice);
	mmgr.rmMessageCB(netList.QiangGangHuPaiAckMessageNum.netID, this.MingGang2PaiAckMessage);
	mmgr.rmMessageCB(netList.MingGang1PaiAckMessageNum.netID, this.MingGang1PaiAckMessage);
	mmgr.rmMessageCB(netList.AnGangPaiAckMessageNum.netID, this.AnGangPaiAckMessage);
	mmgr.rmMessageCB(netList.ZiMoHuPaiAckMessageNum.netID, this.ZiMoHuPaiAckMessage);
	mmgr.rmMessageCB(netList.MoPaiZuHeReminderNum.netID, this.MoPaiZuHeReminder);
	mmgr.rmMessageCB(netList.RestoreListenReminderNum.netID, this.RestoreListenReminder);
}

//新一轮
GameManager.newRound = function(paiData){
	this.isRoundIsOver = false;
}


//设置中间的轮盘
GameManager.bindUserDirection = function(){
	var myDirection   = this.meDirection;
	var DirectType    = GameDefine.DIRECTION_TYPE;
	var meDirIndex    = 0;
	var directionList = [];
	directionList.push(DirectType.NAN);
	directionList.push(DirectType.XI);
	directionList.push(DirectType.BEI);
	directionList.push(DirectType.DONG);
	for(let index =0; index < directionList.length; index++){
		let compreDirect = directionList[index];
		if(compreDirect === myDirection){
			meDirIndex = index;
			break;
		}
	}
	this.gameUICB.hideAllDiection();
	this.gameUICB.roDirectionNode(meDirIndex * 90);
	var deskType = GameDefine.DESKPOS_TYPE
	var self = this;
	var setPlayerDirNode = function(curDeskType, dirIndex){
		var direction = directionList[dirIndex % 4];
		var player    = self.playerList[curDeskType];
		var directN   = self.directionNodeList[direction]
		player.setDirectNode(directN);
	}
	setPlayerDirNode(deskType.XIA, meDirIndex);
	setPlayerDirNode(deskType.YOU, meDirIndex+1);
	setPlayerDirNode(deskType.SHANG, meDirIndex+2);
	setPlayerDirNode(deskType.ZUO, meDirIndex+3);
}

GameManager.initDirectionNodeList = function(){
	var DirectionType            = GameDefine.DIRECTION_TYPE;
	var nodeList                 = {};
	nodeList[DirectionType.DONG] = this.gameUICB.getCurDirectionN("dong");
	nodeList[DirectionType.XI]   = this.gameUICB.getCurDirectionN("xi");
	nodeList[DirectionType.NAN]  = this.gameUICB.getCurDirectionN("nan");
	nodeList[DirectionType.BEI]  = this.gameUICB.getCurDirectionN("bei");
	this.directionNodeList       = nodeList;
}


// GameManager.getPlayerByDestType = function(desPosType){
// 	return this.playerList[desPosType]
// }

GameManager.selfReadToPlay = function(isReady){
	this.playerList[GameDefine.DESKPOS_TYPE.XIA].setReadyData(isReady);
},


// //庄家
// GameManager.setPlayerZhuangjia = function(deskType){
// 	this.zhuangIndex= deskIndex;
// }




// GameManager.logMajiang = function(){
// 	this.playerList.forEach(function(item, index){
// 		log(item.name + item.toString())
// 	})
// }


// GameManager.turnToNextPlayer = function(){
// 	/*
// 	if(this.curPlayer){
// 		this.curPlayer.darkDirection();
// 	}
// 	this.curPlayer = this.playerList[this.curPlayerIndex];
// 	this.curPlayer.lightDirection();
// 	*/
// }

// GameManager.endMajiang = function(){
// 	this.isRoundIsOver = true;
// 	log("----某人胡了")
// 	this.logMajiang();
// }

//设置座位上的玩家数据
GameManager.setDeskPlayersData = function () {
	var roomPlayers =  GameDataMgr.getRoomPlayers();
	for(let i = 0; i < roomPlayers.length; i++){
		var playerInfo = roomPlayers[i];
		playerInfo.deskType = this.getDeskTypeByPos(playerInfo.PlayerIdx);
		this.setPlayerData(playerInfo);
	}
}

//给玩家设置数据
GameManager.setPlayerData = function (playerInfo) {
	var player = this.playerList[playerInfo.deskType];
	player.setUserData(playerInfo);
}

//获取玩家在本地显示的方位
//PlayerIdx 座位索引 数据为 0 1 2 3
GameManager.getDeskTypeByPos = function(PlayerIdx){
	if(!this.DeskPosIdxs){
		var meIdx = GameDataMgr.getDeskPosIndex();
		this.DeskPosIdxs                = [];
		this.DeskPosIdxs[meIdx]         = GameDefine.DESKPOS_TYPE.XIA;
		this.DeskPosIdxs[(meIdx + 1)%4] = GameDefine.DESKPOS_TYPE.YOU;
		this.DeskPosIdxs[(meIdx + 2)%4] = GameDefine.DESKPOS_TYPE.SHANG;
		this.DeskPosIdxs[(meIdx + 3)%4] = GameDefine.DESKPOS_TYPE.ZUO;
	}
	return this.DeskPosIdxs[PlayerIdx]
}


// /* ---------------- Start Net Message --------------------------*/
//当玩家进入房间
GameManager.onUserEnterRoom = function(data){
	var playerInfo      = data.PlayerInformation;
	playerInfo.deskType = this.getDeskTypeByPos(playerInfo.PlayerIdx)
	var roomPlayers     =  GameDataMgr.getRoomPlayers();
	roomPlayers.push(playerInfo);
	this.setPlayerData(playerInfo);
}

GameManager.prepareNoticeMessage = function (data) {
	var self = this;
	var roomPlayers = GameDataMgr.getRoomPlayers();
	roomPlayers.forEach(function(item){
		if(item.PlayerIdx == data.PlayerIdx){
			var player = self.playerList[item.deskType];
			player.setReadyData(true);
		}
	})
	
}

//退出房间通知
GameManager.exitRoomNotice = function (data) {
	var playerID    = data.PlayerIdx;
	var roomPlayers = GameDataMgr.getRoomPlayers();
	for(var i = 0; i <roomPlayers.length; i++){
		if(roomPlayers[i].playerID === playerID){
			var deskType = roomPlayers[i].deskType;
			this.setPlayerData(deskType)
			roomPlayers.splice(i, 1);
			break;
		}
	}
}


//新的一局开始发牌
GameManager.startFaPai = function(paiData) {
 	this.newRound();
 	this.gameUICB.gameStart();
 	this.startPaiData = paiData;
 	this.checkPaiData();
 	this.hideAllReadyNode();
}

//隐藏所有的
GameManager.hideAllReadyNode = function(){
	for(let k in this.playerList){
		let player = this.playerList[k]
		player.setReadyData(false);
	}

}

GameManager.checkPaiData = function(){
	if(!this.startPaiData || !this.meDirection){
		return;		
	}
	this.bindUserDirection();
	this.gameUICB.cleanResidue();
	this.setStartPaiData();
}

GameManager.setStartPaiData = function(){
	var paiData    = this.startPaiData;
	var mePaiList  = paiData.Tiles;
	var totalList  = paiData.TileCount;
	var fapaiCount = 0;
	var DefineDesk = GameDefine.DESKPOS_TYPE;
	for(var i = 0; i < 4; i++){
		var dType    = this.getDeskTypeByPos(i);
		var paiCount = totalList[i];
		fapaiCount   += paiCount;
		var isZhuang = utils.getChannelInfo().zhuangPaiCount === paiCount;
		var player   = this.playerList[dType];
		player.setIsZhuang(isZhuang);
		if(isZhuang) {
			this.curPlayer = player;
		}
		if(dType !== DefineDesk.XIA){			
			player.setStartPaiData(new Array(paiCount));
		}else {
			player.setStartPaiData(mePaiList);
		}
	}
	this.gameUICB.refreResidue(fapaiCount);
	// cai shen pai
	this.gameUICB.refreResidue(1);
}

//摸牌
GameManager.MoPaiNotice = function(data){
	this.ChuPaiStatus = GameDefine.CHUPAI_STATUS.NEW;
	var deskType = this.getDeskTypeByPos(data.PlayerIdx)
	//netID 102 没有推送PlayerIdx数据过来 102是自己摸牌
	if(deskType === undefined){
		deskType = GameDefine.DESKPOS_TYPE.XIA; 
	}
	this.turnToNextPlayer(this.playerList[deskType])
	this.curPlayer.mopai(data.Atile);
	this.gameUICB.refreResidue(1);
}



// //离开房间
// GameManager.exiteRoom = function(){

// }

//定财神通知
GameManager.caiShengPai = function(data){
	this.CaiShenPai = data.Atile
	this.gameUICB.setCaiShenPai(data.Atile);
	for(let k in this.playerList){
		var player = this.playerList[k];
		player.refreCaiShenColor();
	}
}

//玩家出牌
GameManager.turnToChupai = function(data){
	this.ChuPaiStatus = GameDefine.CHUPAI_STATUS.START;
	NetMessageMgr.send(NetProtocolList.ChuPaiMessageNum.netID, data);
}

//本门风提示
GameManager.benmenFengNotice = function(data) {
	this.meDirection = data.Atile
	this.checkPaiData();
}

////生牌阶段通知
GameManager.ShengPaiNotice = function(data){
	this.gameUICB.playShengPaiAnim();
}


//出牌提示
GameManager.ChuPaiNotice = function(data){
	var deskType = this.getDeskTypeByPos(data.PlayerIdx);
	this.lastChuPaiDir = deskType;
	var player   = this.playerList[deskType];
	var pai      = data.Atile;
	player.chuPai(pai);
}

//获取吃牌的旋转角度
GameManager.getEatPaiRotate = function(meDeskType){
	var rotate = 90;
	for(let i =1; i < 4; i++){
		var targetDest = (meDeskType + i) % 4;
		if(targetDest == this.lastChuPaiDir) {
			break;
		}
		rotate -= 90;
	}	
	var meIsShang = (meDeskType === GameDefine.DESKPOS_TYPE.SHANG);
	var meIsYou   = (meDeskType === GameDefine.DESKPOS_TYPE.YOU);
	rotate        = (meIsShang) ? 0 - rotate : rotate;
	var index     = rotate > 0 ? 2 : 0;
	index         = (meIsYou) ? 2 - index : index;
	return {rotate : rotate, index : index};
}

//别的玩家出牌后，你可以对此牌进行的操作
GameManager.ChuPaiZuHeReminder = function(data){
	var eatTypeList = this.getEatTypeList(data.Opts);
	this.gameUICB.showCanEatUI(eatTypeList, data.Data);
	this.eatPaiData = data;
	this.eatTag     = "chuPai";
}

GameManager.MoPaiZuHeReminder = function(data) {
	this.ChuPaiZuHeReminder(data);
	this.eatTag     = "moPai";
}

GameManager.getEatTypeList = function(Opts){
	var optList = Opts.toString(2);
	optList = optList + "";
	var totaLen = optList.length;
	var startIndex = 0;
	var eatTypeList = [];
	for(let i = totaLen; i > 0; i--){
		if(optList.charAt(i-1) == 1){
			eatTypeList.push(GameDefine.EAT_TYPE[startIndex])
		}
		startIndex += 1;
	}
	return eatTypeList;
}
//过牌
GameManager.guoPaiToServer = function(){
	var netID;
	if(this.eatTag === "chuPai"){
		netID = NetProtocolList.GuoChuPaiMessageNum.netID;
	}else if(this.eatTag === "QiangGang"){
		netID = NetProtocolList.GuoQiangGangMessageNum.netID;
	}else {
		netID = NetProtocolList.GuoMoPaiMessageNum.netID;
	}
	var content = {
		Atile : this.eatPaiData.Atile,
	};
	NetMessageMgr.send(netID, content);
}
//吃牌
GameManager.chiPaiToServer = function(eatObj, eatData){
	var content = {
		Atile : this.eatPaiData.Atile,
		Data  : eatData,
	};
	this.eatPaiData.finalEatData = content.Data;
	NetMessageMgr.send(NetProtocolList[eatObj.msName].netID, content);
}
 //碰杠胡牌
GameManager.eatPaiToServer = function(eatObj){
	log("-eatPaiToServer---", eatObj, "this eatPaiData", this.eatPaiData);
	var sendAtile
	if(this.eatTag === "moPai"){
		sendAtile = this.eatPaiData.Data ? this.eatPaiData.Data[eatObj.dataIndex] : undefined;
		sendAtile = sendAtile !== undefined ? sendAtile[0] : this.eatPaiData.Atile;
	}else {
		sendAtile = this.eatPaiData.Atile;
	}
	this.eatPaiData.Atile = sendAtile;
	log("---sendAtile", sendAtile);
	var content = {
		Atile : sendAtile,
	}
	log("---content---", content);
	NetMessageMgr.send(NetProtocolList[eatObj.msName].netID, content);
}
// 碰牌 AcK
GameManager.PengPaiAckMessage = function(data){
	if(data.Rst == true){
		var player = this.playerList[GameDefine.DESKPOS_TYPE.XIA]
		player.peng(this.eatPaiData.Atile, true);
		this.ChuPaiStatus = GameDefine.CHUPAI_STATUS.EATED;
		this.turnToNextPlayer(player);
	}
}



//某人碰||杠||胡||吃牌了
GameManager.ChuPaiZuHeNotice = function(data){
	var eatType = this.getEatTypeList(data.Opts)[0];
	var deskType = this.getDeskTypeByPos(data.PlayerIdx);
	var player   = this.playerList[deskType];
	this.ChuPaiStatus = GameDefine.CHUPAI_STATUS.EATED;
	this.turnToNextPlayer(player);
	//碰牌
	if(eatType === GameDefine.EAT_TYPE[2]){
		player.peng(data.Atile, false);
	}
	if(eatType === GameDefine.EAT_TYPE[3]){
		player.chi(data.Data, false);
	}
	//min gang
	if(eatType === GameDefine.EAT_TYPE[1] || 
		eatType === GameDefine.EAT_TYPE[5] ||
		eatType === GameDefine.EAT_TYPE[6]){
		player.gang(data.Atile, false, eatType);
	}
}

//吃牌的 ACK
GameManager.ChiPaiAckMessage = function(data){
	if(data.Rst == true){
		var player = this.playerList[GameDefine.DESKPOS_TYPE.XIA]
		this.eatPaiData.finalEatData.push(this.eatPaiData.Atile)
		player.chi(this.eatPaiData.finalEatData, true);
		this.ChuPaiStatus = GameDefine.CHUPAI_STATUS.EATED;
		this.turnToNextPlayer(player);
	}
}

//明杠牌 ACK
GameManager.MingGang2PaiAckMessage = function(data){
	if(data.Rst == true){
		this.gangPaiAck(GameDefine.EAT_TYPE[1]);
	}
}

//明杠牌 ACK
GameManager.MingGang1PaiAckMessage = function(data){
	if(data.Rst == true){
		this.gangPaiAck(GameDefine.EAT_TYPE[6]);
	}
}

GameManager.AnGangPaiAckMessage = function(data){
	if(data.Rst == true){
		this.gangPaiAck(GameDefine.EAT_TYPE[5]);
	}
}

GameManager.gangPaiAck = function(eatType){
	var player = this.playerList[GameDefine.DESKPOS_TYPE.XIA]
	player.gang(this.eatPaiData.Atile, true, eatType);
	this.ChuPaiStatus = GameDefine.CHUPAI_STATUS.EATED;
	this.turnToNextPlayer(player);
}

GameManager.ZiMoHuPaiAckMessage = function(data){
	if(data.Rst){

	}
}


GameManager.turnToNextPlayer = function(player){
	this.curPlayer.darkDirection();
	this.curPlayer.checkPaiEnd()
	this.curPlayer = player;
	this.curPlayer.lightDirection();
}

//抢杠提示
GameManager.QiangGangReminder = function(data){
	this.eatTag     = "QiangGang";
	this.eatPaiData = data;
	this.gameUICB.showQiangGang();
}

GameManager.QiangGangNotice = function(data){
	data.Opts = 1;
	this.ChuPaiZuHeNotice(data);
}

GameManager.RestoreListenReminder = function (data) {
	log("-----RestoreListenReminder------------")
	this.gameUICB.cleanEatUI();
}

/*  结算战绩  */
GameManager.ZhanJiNotice = function(data){
	this.reportData.curRoundReport = data.HuSus;
	this.reportData.roudReady = true;
	this.showRoundReport();
}

GameManager.TotalZhanJiNotice = function(data){
	this.reportData.totalRoundReport = data.HuSus;
	this.reportData.totalReady = true;
	this.showRoundReport();
},

GameManager.showRoundReport = function(){
	if(this.reportData.totalReady && this.reportData.roudReady){
		this.reportData.roudReady = false;
		this.reportData.totalReady = false;
		var nameList  = [];
		for(let i = 0; i < 4; i ++){
			var deskType = this.getDeskTypeByPos(i);
			var player   = this.playerList[deskType];
			var UserId   = player.playerData.UserId;
			nameList.push(UserId);
		}
		this.gameUICB.showRoundReport(this.reportData, nameList);
	}
}


// /* ---------------- End Net Message --------------------------*/


module.exports = GameManager;