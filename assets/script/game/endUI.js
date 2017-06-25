cc.Class({
    extends: cc.Component,

    properties: {
        endRoundN : cc.Node,
        GameUI    : cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },

    //显示结算信息
    showRoundReport : function(reportData, nameList) {
        this.endRoundN.active = true;
        var pointN    = this.endRoundN.getChildByName("pointList");
        var nameNode  = pointN.getChildByName("id");
        var totalNode = pointN.getChildByName("total");
        var curNode   = pointN.getChildByName("cur");
        var btnReady  = this.endRoundN.getChildByName("btnReady");
        var btnOut    = this.endRoundN.getChildByName("btnOut");
        reportData.endPlayCount = 0;
        btnOut.active = reportData.endPlayCount < 1;
        btnReady.active = reportData.endPlayCount > 0;
        var setData = function(index, data, parentNode){
            var setN = parentNode.getChildByName("point_" + index);
            setN.getComponent(cc.Label).string = data;
        }
        for(let i =1; i<5; i++){
            // setData(i, reportData.totalRoundReport[i-1], totalNode);
            // setData(i, reportData.curRoundReport[i-1], curNode);
            // setData(i, nameList[i-1], nameNode);
        }
    },


    onBtnReadyToPlay : function () {
        cc.director.loadScene("main");
    },

    onBtnEndToPlay : function () {
        
    },



   
});
