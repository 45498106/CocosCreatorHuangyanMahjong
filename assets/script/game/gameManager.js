var majiangSys      = require("majiangSys");
var GameDefine      = require("GameDefine");
var utils           = require("utils");
var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");
var GamePlayDataMgr = require("GamePlayDataMgr");
var log             = utils.log;
var GameManager     = {};

//初始化数据
GameManager.initGame = function(playerList, gameUICB){
	this.playerList = playerList;
	this.gameUICB   = gameUICB;
	this.init();
	this.setBtnBackVisi();
}

GameManager.init = function(){
	this.initDirectionNodeList();
	this.initPlayerData(); 
	this.cleanData();
	var mmgr    = NetMessageMgr;
	var netList = NetProtocolList;
	mmgr.addMessageCB(netList.EnterRoomNoticeNum.netID, this.onUserEnterRoom, this);
	mmgr.addMessageCB(netList.PrepareNoticeNum.netID, this.prepareNoticeMessage, this);
	mmgr.addMessageCB(netList.ExitRoomNoticeNum.netID, this.exitRoomNotice, this);
	mmgr.addMessageCB(netList.DissolveRoomNoticeNum.netID,this.DissolveRoomNotice, this);
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
	mmgr.addMessageCB(netList.QiangGangHuPaiAckMessageNum.netID, this.ZiMoHuPaiAckMessage, this);
	mmgr.addMessageCB(netList.MingGang1PaiAckMessageNum.netID, this.MingGang1PaiAckMessage, this);
	mmgr.addMessageCB(netList.AnGangPaiAckMessageNum.netID, this.AnGangPaiAckMessage, this);
	mmgr.addMessageCB(netList.ZiMoHuPaiAckMessageNum.netID, this.ZiMoHuPaiAckMessage, this);
	mmgr.addMessageCB(netList.MoPaiZuHeReminderNum.netID, this.MoPaiZuHeReminder, this);
	mmgr.addMessageCB(netList.RestoreListenReminderNum.netID, this.RestoreListenReminder, this);
	mmgr.addMessageCB(netList.VotingReminderNum.netID, this.VotingReminder, this);
	mmgr.addMessageCB(netList.VotingRstNoticeNum.netID, this.VotingRstNotice, this);
}

GameManager.onDestroy  = function(){
	this.cleanData();
	GamePlayDataMgr.cleanGameData();
	var mmgr    = NetMessageMgr;
	var netList = NetProtocolList;
	mmgr.rmMessageCB(netList.EnterRoomNoticeNum.netID,this.onUserEnterRoom);
	mmgr.rmMessageCB(netList.PrepareNoticeNum.netID, this.prepareNoticeMessage);
	mmgr.rmMessageCB(netList.DissolveRoomNoticeNum.netID,this.DissolveRoomNotice);
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
	mmgr.rmMessageCB(netList.VotingReminderNum.netID, this.VotingReminder);
	mmgr.rmMessageCB(netList.VotingRstNoticeNum.netID, this.VotingRstNotice)
}

//新一轮
GameManager.newRound = function(paiData){
	this.isRoundIsOver = false;
	this.isPlaying     = true;
	this.totalReduce   = 0;
 	this.bindUserDirection();
	this.setStartPaiData();
	this.gameUICB.gameStart();  
    this.hideAllReadyData();
    this.liujupaiCount = utils.getChannelInfo().zhuangPaiCount;
    this.setBtnBackVisi();
}

GameManager.cleanData = function(){
	this.startPaiData     = undefined;
	this.meDirection      = undefined;
	this.CaiShenPai       = undefined;
	this.DeskPosIdxs      = undefined;
	this.curChuPaiUdid    = undefined;
	this.lastChuPaiDir    = undefined;
	this.rounAnimFinished = undefined;
	this.isPlaying        = undefined;
	this.isXiaDesk        = undefined;
}

GameManager.cleanPlayerPaiData = function(){
	for(let k in this.playerList){
		let player = this.playerList[k];
		player.cleanPaiData();
	}
	this.isPlaying = false;
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
		player.setDirectNode(directN, direction);
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

//设置座位上的玩家数据
GameManager.initPlayerData = function () {
	var roomPlayers =  GamePlayDataMgr.getRoomPlayers();
	for(let destPos =0; destPos <4; destPos++){
		var deskType   = GamePlayDataMgr.getDeskType(destPos);
		var player     = this.playerList[deskType];
		player.setPlayerIDX(destPos);
		player.refreshData();
	}
}

GameManager.refreshPlayer = function(destPos){
	var deskType   = GamePlayDataMgr.getDeskType(destPos);
	var player     = this.playerList[deskType];
	player.refreshData();
}

GameManager.refreshPlayerReady = function(destPos){
	var deskType   = GamePlayDataMgr.getDeskType(destPos);
	var player     = this.playerList[deskType];
	player.refresReadyTag();
}

GameManager.sortEatPaiData = function(eatData){
	for(let i =0; i<eatData.length; i++){
		eatData[i].sort();
	}
	eatData.sort(function(a, b){
		return b[0] - a[0];
	})
	return eatData;
}


// /* ---------------- Start Net Message --------------------------*/
//当玩家进入房间
GameManager.onUserEnterRoom = function(data){
	var playerInfo = data.PlayerInformation;
	GamePlayDataMgr.setPlayerData(playerInfo, playerInfo.PlayerIdx);
	this.refreshPlayer(playerInfo.PlayerIdx);
}

//解散房间
GameManager.DissolveRoomNotice = function(){
	var self = this;
	var cb = function(){
		self.exiteRoom();
	}
	this.gameUICB.showDissolved(cb)
}

//退出房间通知
GameManager.exitRoomNotice = function (data) {
	var PlayerIdx = data.PlayerIdx;
	GamePlayDataMgr.setPlayerData(undefined, PlayerIdx);
	this.refreshPlayer(PlayerIdx);
}

GameManager.prepareNoticeMessage = function (data) {
	var playerData    = GamePlayDataMgr.getPlayerData(data.PlayerIdx); 
	playerData.Status = GameDefine.PLAYER_READY.READY;
	this.refreshPlayerReady(data.PlayerIdx);
}


//新的一局开始发牌
GameManager.startFaPai = function(paiData) {
	this.startPaiData = paiData;
	this.checkPaiDataReady();
}

//隐藏所有的
GameManager.hideAllReadyData = function(){
	let roomPlayers = GamePlayDataMgr.getRoomPlayers();
	for(let k in roomPlayers){
		var playerData = roomPlayers[k];
		playerData.Status = GameDefine.PLAYER_READY.NO_READY;
		this.refreshPlayerReady(k);
	}

}

GameManager.isCaiShenPai = function(paiID){
	return (this.CaiShenPai === paiID);
}

GameManager.checkPaiDataReady = function(){
	var paiDataIsOk = false;
	if(this.startPaiData && this.meDirection  && this.CaiShenPai){
		paiDataIsOk = true;
	}
	if(this.rounAnimFinished && paiDataIsOk) {
		this.rounAnimFinished = undefined;
		this.newRound();
	}
	
}

GameManager.setStartPaiData = function(){
	var paiData    = this.startPaiData;
	var mePaiList  = paiData.Tiles;
	var totalList  = paiData.TileCount;
	var fapaiCount = 0;
	var DefineDesk = GameDefine.DESKPOS_TYPE;
	for(var i = 0; i < 4; i++){
		var dType    = GamePlayDataMgr.getDeskType(i);
		var paiCount = totalList[i];
		fapaiCount   += paiCount;
		var player   = this.playerList[dType];
		if(player.isZhuangJia()) {
			this.curPlayer = player;
		}
		if(dType !== DefineDesk.XIA){			
			player.setStartPaiData(new Array(paiCount));
		}else {
			player.setStartPaiData(mePaiList);
		}
	}
	this.refreResidue(fapaiCount);
	// cai shen pai
	this.refreResidue(1);
}

GameManager.refreResidue = function(reduce){
	this.totalReduce += reduce;
    this.leftPai = utils.getChannelInfo().totalPai - this.totalReduce;
    this.gameUICB.refreResidue(this.leftPai);
}

GameManager.addLiujuCount = function(){
	this.liujupaiCount += 1;
}


//摸牌
GameManager.MoPaiNotice = function(data){
	this.refreResidue(1);
	this.ChuPaiStatus = GameDefine.CHUPAI_STATUS.NEW;
	var deskType = GamePlayDataMgr.getDeskType(data.PlayerIdx)
	//netID 102 没有推送PlayerIdx数据过来 102是自己摸牌
	if(deskType === undefined){
		deskType = GameDefine.DESKPOS_TYPE.XIA; 
	}
	this.turnToNextPlayer(this.playerList[deskType])
	this.curPlayer.mopai(data.Atile);
}



//离开房间
GameManager.exiteRoom = function(){
	log("--GameManager.exiteRoom---")
	cc.director.loadScene("main");
}

//定财神通知
GameManager.caiShengPai = function(data){
	this.CaiShenPai = data.Atile
	this.gameUICB.setCaiShenPai(data.Atile);
	for(let k in this.playerList){
		var player = this.playerList[k];
		player.refreCaiShenColor();
	}
	this.checkPaiDataReady();
}

//玩家出牌
GameManager.turnToChupai = function(pai){
	var content        = {};
	content.Atile      = pai.id;
	this.curChuPaiUdid = pai.udid;
	this.ChuPaiStatus  = GameDefine.CHUPAI_STATUS.START;
	NetMessageMgr.send(NetProtocolList.ChuPaiMessageNum.netID, content);
}

//本门风提示
GameManager.benmenFengNotice = function(data) {
	this.meDirection = data.Atile
	this.checkPaiDataReady();
}

////生牌阶段通知
GameManager.ShengPaiNotice = function(data){
	this.gameUICB.playShengPaiAnim();
}


//出牌提示
GameManager.ChuPaiNotice = function(data){
	var deskType = GamePlayDataMgr.getDeskType(data.PlayerIdx);
	this.lastChuPaiDir = deskType;
	var player   = this.playerList[deskType];
	player.chuPai(data.Atile, this.curChuPaiUdid);
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
	// rotate        = (meIsShang) ? 0 - rotate : rotate;
	var index     = rotate > 0 ? 2 : 0;
	// index         = (meIsYou) ? 2 - index : index;
	return {rotate : rotate, index : index};
}

//别的玩家出牌后，你可以对此牌进行的操作
GameManager.ChuPaiZuHeReminder = function(data){
	var eatTypeList = this.getEatTypeList(data.Opts, this.isShowGuo());
	this.gameUICB.showCanEatUI(eatTypeList, data.Data);
	this.eatPaiData = data;
	this.eatTag     = "chuPai";
}

GameManager.MoPaiZuHeReminder = function(data) {
	this.ChuPaiZuHeReminder(data);
	this.eatTag     = "moPai";
}

GameManager.getEatTypeList = function(Opts, isPushGuo){
	var optList     = Opts.toString(2)+"";
	var totaLen     = optList.length;
	var startIndex  = 0;
	var eatTypeList = [];
	if(isPushGuo){
		eatTypeList.push(8); //guo pai
	}
	
	for(let i = totaLen; i > 0; i--){
		if(optList.charAt(i-1) == 1){
			eatTypeList.push(startIndex);
		}
		startIndex += 1;
	}
	return eatTypeList;
}
GameManager.playerWantToOut = function(){
	var content = {};
	var netID   = NetProtocolList.VotingStartMessageNum.netID;
	NetMessageMgr.send(netID, content);
}

//show votiing window
GameManager.VotingReminder = function(data){
	var playersInfo   = {};
	var votePlayerIdx = 0;
	var votePlayer    = {};
	var roomPlayers = GamePlayDataMgr.getRoomPlayers();
	for(let idx in roomPlayers){
		log("---idx" + idx)
		var player = roomPlayers[idx];
		log("--player", player)
		if(idx != data.PlayerIdx){
			playersInfo[idx] = {};
			playersInfo[idx].name = player.name;
			playersInfo[idx].voteStatus = GameDefine.VOTESTATUS.NOVOTE;
			playersInfo[idx].id = player.UserId;
		}
	}
	data.playersInfo = playersInfo;
	data.votePlayer  = votePlayer;
	this.gameUICB.showVoting(data)
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
	var deskType = GamePlayDataMgr.getDeskType(data.PlayerIdx);
	var player   = this.playerList[deskType];
	this.ChuPaiStatus = GameDefine.CHUPAI_STATUS.EATED;
	this.turnToNextPlayer(player);
	//碰牌
	if(eatType === GameDefine.EATPAI_TYPE.PengPai){
		player.peng(data.Atile, false);
	}
	if(eatType === GameDefine.EATPAI_TYPE.ChiPai){
		player.chi(data.Data, false);
	}
	//min gang
	if(eatType === GameDefine.EATPAI_TYPE.MingGang2 || 
		eatType === GameDefine.EATPAI_TYPE.AnGang ||
		eatType === GameDefine.EATPAI_TYPE.MingGang1){
		player.gang(data.Atile, false, eatType);
	}
	this.lastChuPaiData = data;
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
		this.gangPaiAck(GameDefine.EATPAI_TYPE.MingGang2);
	}
}

//明杠牌 ACK
GameManager.MingGang1PaiAckMessage = function(data){
	if(data.Rst == true){
		this.gangPaiAck(GameDefine.EATPAI_TYPE.MingGang1);
	}
}

GameManager.AnGangPaiAckMessage = function(data){
	if(data.Rst == true){
		this.gangPaiAck(GameDefine.EATPAI_TYPE.AnGang);
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
	this.isXiaDesk = this.curPlayer.isXiaDesk();
	this.setBtnBackVisi();
}

GameManager.setBtnBackVisi = function(){
	var isVisi = this.isPlaying && this.isXiaDesk;
	this.gameUICB.setBtnBackVisi(isVisi);
}

//抢杠提示
GameManager.QiangGangReminder = function(){
	var data        = {};
	data.Atile      = this.lastChuPaiData.Atile;
	data.Opts       = 128; //2^7 就是128， index是7
	var eatTypeList = this.getEatTypeList(data.Opts, this.isShowGuo());
	this.eatPaiData = data;
	this.eatTag     = "QiangGang";
	this.gameUICB.showCanEatUI(eatTypeList, data.Data);
}
GameManager.isShowGuo = function(){
	var ishaveNext  = this.leftPai > this.liujupaiCount;
	return ishaveNext;
}

GameManager.QiangGangNotice = function(data){
	log("--GameManager.QiangGangNotice----", data)
	data.Opts = 1;
	this.ChuPaiZuHeNotice(data);
}

GameManager.RestoreListenReminder = function (data) {
	this.gameUICB.cleanEatUI();
}

/*  结算战绩  */
GameManager.ZhanJiNotice = function(data){
	this.gameUICB.showSingleReport(data);
}

GameManager.TotalZhanJiNotice = function(data){
	this.gameUICB.setTotalReport(data);
}

GameManager.VotingRstNotice = function(data){
	this.gameUICB.hideVoting();
	if(data.VotingRst){
		var self = this;
		var cb = function(){
			self.exiteRoom();
		}
		this.gameUICB.showDissolved(cb)
	}else {
		var player = GamePlayDataMgr.getPlayerData(data.PlayerRefused);
		this.gameUICB.showVoteFaile(player.Name);
	}

}


// /* ---------------- End Net Message --------------------------*/


module.exports = GameManager;