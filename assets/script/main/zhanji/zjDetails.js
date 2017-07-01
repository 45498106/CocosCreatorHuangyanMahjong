var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    getRecordByNet : function(record){
        cc.log("----- 服务器返回的战绩信息：", record)
        cc.log(record)
        this.onRecordShow(record);
    },

});
