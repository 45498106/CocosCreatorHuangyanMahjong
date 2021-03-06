var localDataPath    = "huangyanMahjongData";

var userLocalData = {
	userID 		: -1,
	soundSwitch : true,  		// 1-开, 0-关
	musicSwitch : true,  		// 1-开, 0-关
	language	: "mandarin",   // mandarin-普通话(默认)
	sex 		: "male",       // 性别 默认男-male 女-female
};

module.exports = {
    cleanUserLocalData : function(){
        userLocalData = {};
    },

    //设置用户ID
    setUserID : function(id){
		userLocalData.userID = id;
		this.setLocalData(id);
	},

	getUserID : function(){
		return userLocalData.userID;
	},

	//刷新数据
	updateLocalData : function(data){
		userLocalData = data;
	},

	//保存数据到本地
	setLocalData : function(id){
		cc.sys.localStorage.setItem(localDataPath + id, JSON.stringify(userLocalData));
	},

	getLocalData : function(id){
		return JSON.parse(cc.sys.localStorage.getItem(localDataPath + id));
	},

	//设置声音是否打开
	setSoundSwitch : function(isOn){
		userLocalData.soundSwitch = isOn;
		this.setLocalData(userLocalData.userID);
	},

	getSoundSwitch : function(){
		return userLocalData.soundSwitch;
	},

	setMusicSwitch : function(isOn){
		userLocalData.musicSwitch = isOn;
		this.setLocalData(userLocalData.userID);
	},

	getMusicSwitch : function(){
		return userLocalData.musicSwitch;
	},

	//设置语音类型
	setAudioKind : function(kind){
		userLocalData.language = kind;
		this.setLocalData(userLocalData.userID);
	},

	getAudioKind : function(){
		return userLocalData.language;
	},

	setSex : function(sex){
		userLocalData.sex = sex;
		this.setLocalData(userLocalData.userID);
	},

	getSex : function(){
		return userLocalData.sex;
	}

};