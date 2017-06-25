var GameDefine = {};



GameDefine.DESKPOS_TYPE = {
	SHANG : 0, //上 0123
	ZUO   : 1, //左
	XIA   : 2, //下
	YOU   : 3, //右
};

GameDefine.HUASE = {
	TONG : 1, //筒子 1-9 eg: 91九筒 92九万 93九条 94秋
	WANG : 2, //万 1-9
	TIAO : 3, //条子1-9
	TESHU : 4, //特殊 1白板2东3南4西5北6发7春8夏9秋10冬11中12竹13兰14梅15菊
};

//玩家准备状态
GameDefine.PLAYER_READY = {
	NO_CARD : 1,//无房卡 
	NO_READY: 2,//未准备
	READY   : 3,//已经准备
}

//server 筒1条2万3字4风5
//本地筒1万2条3特殊4
GameDefine.ServerToLocalType = {
	1 : 1,
	2 : 3,
	3 : 2,
	4 : 4,
	5 : 4,
}


GameDefine.TeSuPaiID = {
	41 : 114,//中
	42 : 64, //發
	43 : 14, //白
	51 : 24, //东
	52 : 34, //南
	53 : 44, //西
	54 : 54, //北
}

GameDefine.TeSuPaiName = {
	41 : "中",//中
	42 : "發", //發
	43 : "白", //白
	51 : "东", //东
	52 : "南", //南
	53 : "西", //西
	54 : "北", //北
}

GameDefine.PLAYERSTATUS = {
	DAING : 1, //打牌中
	WAITING  : 2, //等待打牌中
}


GameDefine.DIRECTION_TYPE = {
	DONG : 51, //东
	NAN  : 52, //南
	XI   : 53, //西
	BEI  : 54, //北
};
//PuTongHu  = 0
//MingGang2 = 1 //手上有三张一样且未碰出去的牌，杠别人打出来的
//PengPai   = 2
//ChiPai    = 3
//ZiMoHu    = 4
//AnGang    = 5
//MingGang1 = 6 //手上有三张碰出去的牌，杠自己摸的
//吃牌类型
GameDefine.EAT_TYPE    = [];
GameDefine.EAT_TYPE[0] = "PuTongHu";
GameDefine.EAT_TYPE[1] = "MingGang2";
GameDefine.EAT_TYPE[2] = "PengPai";
GameDefine.EAT_TYPE[3] = "ChiPai";
GameDefine.EAT_TYPE[4] = "ZiMoHu";
GameDefine.EAT_TYPE[5] = "AnGang";
GameDefine.EAT_TYPE[6] = "MingGang1";


//出牌状态
GameDefine.CHUPAI_STATUS = {
	START : 1,//开始
	NEW   : 2,//下一个玩家摸牌
	EATED : 3,//被某人吃掉了
}

GameDefine.GAME_TYPE = {
	//黄岩
	HUANGYAN : {
		type : 1,
		resUrl : "UI/huangyan/majiang",
		serverAddr : "192.168.1.70:9999/websocket",
		zhuangPaiCount : 14, //庄家牌的数量 
		totalPai  : 136, //总共好多张牌
	}
}


module.exports = GameDefine;