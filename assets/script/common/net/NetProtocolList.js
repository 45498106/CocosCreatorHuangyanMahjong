var netProtoList = require("netProtoList");

module.exports = {
	init : function(){
        for(let i =0; i < netProtoList.length; i++){
			var messageData              = netProtoList[i];
			this[messageData.name]       = messageData
			this[messageData.name].netID = parseInt(messageData.netID);
        }
    },    
}