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
GameDefine.EATPAI_TYPE = {
	PuTongHu : 0,
	MingGang2: 1,
	PengPai  : 2,
	ChiPai   : 3,
	ZiMoHu   : 4,
	AnGang   : 5,
	MingGang1: 6,
	QiangGang: 7,
	GuoPai   : 8,
}

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
		liujupai  : 14,  //当剩余牌数为这个数目的时候就是流局
	}
}

//胡数 localText
GameDefine.HSTEXT = {
        dh :"底胡",
        dz :"门风对",
        yk :"硬张刻",
        rk :"软张刻",
        yak :"硬张暗刻",
        rak :"软张暗刻",
        ymg  :"硬张明杠",
        rmg  :"软张明杠",
        yag 　:"硬张暗杠",
        rag 　:"软张暗杠",
        zm :"自摸",
        zmqd :"嵌档",
        ddh :"对对胡",
        gsh :"杠上花",
}

GameDefine.FSTEXT = {
	//翻数，未胡牌/已胡牌翻数
    zfbk :"中发白刻",
    zfbg :"中发白杠",
    sfk :"门风刻",
    sfg :"门风杠",
    //翻数，已胡牌翻数
    wcs :"无财神",
    cshy :"财神还原",
    hys :"混一色",
    qys :"清一色",
}	 // ZIMOCOUNT 
        // HUPAICOUNT
        // LAZICOUNT
        // BAOYUANCOUNT
        // TIANHUCOUNT
        // DIHUCOUNT
        // XIANGDUIHUSU
        // ZHANJIINFOCOUNT
GameDefine.TOTALREPORT = [
	"自摸次数:",
	"胡牌次数:", 
	"辣子次数:",
	"包圆次数:",
	"天胡次数:",
	"地胡次数:",
	"总战绩:",
];

GameDefine.CAISHENCOLOR = new cc.Color(155, 255, 131);
GameDefine.WHITECOLOR = new cc.Color(255, 255, 255);


module.exports = GameDefine;