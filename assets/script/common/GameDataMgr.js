var log = require("utils").log;
var gameData = {
    userId : 4,
    roomInfo : {},
    roomPlayers : [],
};

module.exports = {
    cleanGameData : function(){
        gameData = {};
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
    setDeskPosIndex : function(roomPlayers){
        roomPlayers.forEach(function(item){
            if(item.UserId == gameData.userId){
                gameData.deskPosIndex = item.PlayerIdx;
            }
        })
    },
    getDeskPosIndex : function(){
        return gameData.deskPosIndex;
    },
    setRoomPlayers : function(roomPlayers){
    	gameData.roomPlayers = roomPlayers;
        if(!gameData.deskPosIndex){
            this.setDeskPosIndex(roomPlayers);
        }
    },
    getRoomPlayers : function(){
    	return gameData.roomPlayers;  
    },


    
};