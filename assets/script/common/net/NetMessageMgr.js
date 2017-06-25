var utils           = require("utils");
var log             = utils.log;
var NetProtocolList = require("NetProtocolList");

var NetMessageMgr = {
    openCBList    : {},
    closeCBList   : {},
    messageCBList : {},
    errorCBList   : {},
    socket        : null,
    conUrl        : "",
    adapterArr    : [],
    delayedTimePer: 200, //200毫秒, 
    delayedTime   : -200, //消息处理延后
    heartTime     : 50,
    heartBeat     : function() {
        log(" hti  ")
        NetMessageMgr.send(NetProtocolList.HeartbeatMessageNum.netID, {});
    },
    startHeartBeat : function(){
        this.heartTag = setInterval(this.heartBeat,this.heartTime * 1000);
    },

    addOpenCB : function(protocolID,func, funcEnv){
        this.openCBList[protocolID] = this.openCBList[protocolID] || [];
        this.openCBList[protocolID].push({cb : func, env : funcEnv});
    },

    rmOpenCB : function(protocolID, func){
        this.spliceMessage(this.openCBList[protocolID], func);
    },
    
    addCloseCB : function(protocolID,func, funcEnv){
        this.closeCBList[protocolID] = this.closeCBList[protocolID] || [];
        this.closeCBList[protocolID].push({cb : func, env : funcEnv});
    },
    rmCloseCB : function(protocolID, func){
        this.spliceMessage(this.closeCBList[protocolID], func);
    },
    
    addMessageCB : function(protocolID,func, funcEnv){
        this.messageCBList[protocolID] = this.messageCBList[protocolID] || [];
        this.messageCBList[protocolID].push({cb : func, env : funcEnv});
    },
    rmMessageCB : function(protocolID,func){
        this.spliceMessage(this.messageCBList[protocolID], func);
    },
    
    addErrorCB : function(protocolID,func, funcEnv){
        this.errorCBList[protocolID] = this.errorCBList[protocolID] || [];
        this.errorCBList[protocolID].push({cb : func, env : funcEnv});
    },
    
    rmErrorCB : function(protocolID,func){
        this.spliceMessage(this.errorCBList[protocolID], func);
    },

    spliceMessage : function(rmArray, cbFunc){
        if(!rmArray || !(rmArray instanceof Array)){
            this.log("spliceArray not a array")
            return
        }
        for(let i = 0; i<rmArray.length; i++){
            if(rmArray[i].cb === cbFunc){
                rmArray.splice(i, 1);
                break;
            }
        }
    },
   
    init : function(url){
       this.conUrl = "ws://" + url; 
    },

    connect: function () {
        cc.log("connect: function" );
        if(this.conUrl === ""){
            cc.log("Url is empty. Can not connect.");
            return false;
        }
        if(this.socket !== null){
            if(this.socket.readyState === 0 || this.socket.readyState == 1){//正在连接中，或者已连接
                return true;
            }else if(this.socket.readyState == 2){ //连接正在断开
                return false;
            }
        }
        //其他情况，包括尚未连接，或者连接已经断开
        this.socket = new WebSocket(this.conUrl);
        this.socket.binaryType="arraybuffer";
        var self = this;
        this.socket.onopen = function(event){self.onOpen(event);}; 
        this.socket.onclose = function(event){self.onClose(event);};
        this.socket.onerror = function(event){self.onError(event);};
        this.socket.onmessage = function(event){self.onMessage(event);};
        return true;
    },
    
    isConnected : function(){
        return this.socket !== null && this.socket.readyState === 1;
    },
    
    isConnecting : function(){
        return this.socket !== null && this.socket.readyState === 0;
    },
    
    send: function(netID, message){
        if(netID !== 761){
            log("------send,", this.socket.readyState , this.isConnected())
            log("send")
            log(netID, message);
        }
       
        
        var messStr      = JSON.stringify(message);
        /*
        //服务器当把消息的前四个字节来当成netID
        //将netID转为二进制
        var idStr_2 = netID.toString(2);
        var idLen = idStr_2.length;
        //id的Uint8Array数组
        var idMessList = [];
        //从右开始 每八位二进制为一单位
        for(let i = 0; i<4; i++){
            let str_2 ="";
            for(let k =7; k > -1; k--){
                var index = i*8 + k;
                //当前八位中从左边开始截取
                str_2 += index < idLen ? idStr_2.charAt(idLen - index - 1) : 0;
            }
            //将截取的二进制转换为十进制
            idMessList.push(parseInt(str_2, 2));
        }
        var sendMess     = new Uint8Array(4 + messStr.length);
        sendMess[0]      = idMessList[0];
        sendMess[1]      = idMessList[1];
        sendMess[2]      = idMessList[2];
        sendMess[3]      = idMessList[3];
        for(let i = 0; i<messStr.length; i++){
            sendMess[i+4] = messStr.charCodeAt(i);
        }*/
        if(this.isConnected()){
           this.socket.send(netID+messStr);
        }
    },

    onOpen : function(event){
        log("--------onOpen--")
        log(event)
        this.startHeartBeat();
    },
    
    onClose : function(event){
        log("--------onClose--")
        log(event)
        clearInterval(this.heartTag);
    },

    onMessage : function(event){
        var netID = event.data.substr(0, 3);
        if(parseInt(netID) !== 761){
            log("--------onMessage--")
            log(event)
        }
        
       
        //heart beat 
        if(netID == NetProtocolList.HeartbeatMessageNum.netID){return}
        var jsonData = event.data.substr(3, event.data.length);
        if(jsonData && jsonData.length > 0){
             jsonData = JSON.parse(jsonData)
             if(jsonData.Error){
                log("---Error ---" + jsonData.Error);
                return;
            }
        }       
        var cbList = this.messageCBList[netID]
        if(cbList){
            var self = this;
            this.delayedTime += this.delayedTimePer;
            setTimeout(function(){
                self.delayedTime -= self.delayedTimePer;
                cbList.forEach(function(item, index){
                    item.cb.call(item.env, jsonData)
                })
            }, this.delayedTime)
            
        }else{
            log("Error this " + netID + " not have  handler");
        }
        

    },
    
    onError : function(){
        log("--------onError--")
        log(arguments)
    },

};


module.exports = NetMessageMgr;
