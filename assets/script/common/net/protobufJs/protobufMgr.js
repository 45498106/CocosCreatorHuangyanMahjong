var log = require("utils").log;
var protobuf = require("protobuf");
var protobufPath = "protobufRes"
var protobufMgr = {};

protobufMgr.init = function( ){
	var self = this;
	cc.loader.loadResAll(protobufPath, function(err, assets){
		if(err){
			log("-- load proto file error --",err)
			return;
		}
		for(let k =0; k< assets.length; k++){
			var asset    = assets[k];
			var builder  = protobuf.loadProto(asset);
			self.protoMsg = builder.build("protoMsg");
		}
	})    
}


protobufMgr.encodeObj = function(objName, obj){
	if(!this.checkProtobufOk()){return};
	try{
		var msgObj = new this.protoMsg[objName](obj);
		var buffer = msgObj.encode().toBuffer();
		return buffer
	}catch(e){
		log("--encodeObj error--", e);
	}
} 


protobufMgr.decodeBuffer = function(msgName, buffer){
	if(!this.checkProtobufOk()){return};
	try{
		var message = this.protoMsg[msgName].decode(buffer)
        return message;
	}catch(e){
		log("--encodeObj error--", e);
	}
}

protobufMgr.checkProtobufOk = function(){
	if(!this.protoMsg){
		log("--- proto file not loaded ");
		return false;
	}
	return true;
} 





module.exports = protobufMgr;