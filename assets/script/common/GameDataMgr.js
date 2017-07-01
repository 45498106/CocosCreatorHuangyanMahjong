var log = require("utils").log;
var gameData = {
    userId : 4,
    roomInfo : {},
    roomPlayers : {},
    isRoomMaster : false,
};

module.exports = {
    cleanGameData : function(){
        gameData = {};
    },
    setRoomMaster : function(master){
        gameData.isRoomMaster = master
    },
    getRoomMaster : function(){
        return gameData.isRoomMaster;
    },
    setUserID : function(userId){
        gameData.userId = userId;
    }, 
    getUserID : function(){
        return gameData.userId;  
    },
    setRoomInfo : function(roomInfo){
    	gameData.roomInfo = roomInfo;
    },
    getRoomInfo : function(){
    	return gameData.roomInfo;  
    },
    setDeskPosIndex : function(pos){
        gameData.deskPosIndex = pos
    },
    getDeskPosIndex : function(){
        return gameData.deskPosIndex;
    },
    initRoomPlayers : function(playerArray){
        for(let i = 0; i < playerArray.length; i++){
            var playerData = playerArray[i];
            if(playerData.UserId === this.getUserID()){
                this.setDeskPosIndex(playerData.PlayerIdx);
            }
            gameData.roomPlayers[playerData.PlayerIdx] = playerData;
        }
    },
    getSelfPlayerData : function(){
        return gameData.roomPlayers[gameData.deskPosIndex];
    },
    getRoomPlayers : function(){
    	return gameData.roomPlayers;  
    },


    
};