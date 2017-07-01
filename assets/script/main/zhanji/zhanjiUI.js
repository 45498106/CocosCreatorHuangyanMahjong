var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");

cc.Class({
    extends: cc.Component,

    properties: {
        zhanjiNode     : cc.Node,
        bgNode         : cc.Node,
        detailsNode    : cc.Node,
        titleBoxNode   : cc.Node,
        scrollViewNode : cc.Node,
        zhanjiPrefab   : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        if(this.bgNode != undefined){
            this.initFunc();
            this.onRecordShow();
        }
    },

    initFunc : function(){
        var zhanji = {}
        zhanji.UserId = 4;
        zhanji.Page = 1;
        zhanji.Count = 1;
        NetMessageMgr.send(NetProtocolList.QueryPanZhanJiMessageNum.netID, zhanji)
    },

    //服务器返回的战绩信息
    getRecordByNet : function(record){
        cc.log("----- 服务器返回的战绩信息：", record)
        cc.log(record)
        this.onRecordShow(record);
    },

    //战绩显示
    onRecordShow : function(record){
        var self = this;
        //战绩总统计
        var curIntegral = this.titleBoxNode.getChildByName("jifen");
        curIntegral.getComponent(cc.Label).string = "当前积分：" + 12;
        var totalNum = this.titleBoxNode.getChildByName("jushu");
        totalNum.getComponent(cc.Label).string = "总局数：" + 10;
        var winRate = this.titleBoxNode.getChildByName("shenglv");
        winRate.getComponent(cc.Label).string = "胜率：" + 92 + "%";
        //战绩ListView显示
        var contentB = this.scrollViewNode.getChildByName("view").getChildByName("content");
        this.scrollViewArray = new Array();
        for(let i=0; i<4; i++){
            var cloneZJ = cc.instantiate(this.zhanjiPrefab);
            cloneZJ.setPositionY(cloneZJ.getPositionY() - 155*i);
            contentB.addChild(cloneZJ);
            cloneZJ.getComponent("zhanjiPrefab").setBtnNum(i);
            this.scrollViewArray[i] = cloneZJ;
        }
        contentB.height = 155 * this.scrollViewArray.length + 20;
        var fenshu = new Array();
        fenshu[0] = 12;
        fenshu[1] = 5;
        fenshu[2] = -12;
        fenshu[3] = -5;
        cc.loader.loadRes('UI/zhanji/head', cc.SpriteFrame, function(err, spriteFrame){
            if(err){cc.error(err.message || err); return;}
            for(let k=0; k<self.scrollViewArray.length; k++)
            {
                var svBox = self.scrollViewArray[k];
                for(let i=0; i<4; i++){
                    var title = svBox.getChildByName("title").getComponent(cc.Label).string = "2017年6月3.日  16局";
                    var head = svBox.getChildByName("head"+(i+1));
                    head.getChildByName("name").getComponent(cc.Label).string = "张三";
                    head.getChildByName("fenshu").getComponent(cc.Label).string = fenshu[i];
                    if(parseInt(fenshu[i]) < 0)
                        head.getChildByName("fenshu").color = new cc.Color(0, 255, 252);
                    else
                        head.getChildByName("fenshu").color = new cc.Color(226, 223, 106);
                    head.getChildByName("img").getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            }
        });
    },

    onBtnDetailsClicked : function(btnNum){
        this.bgNode.active = false;
        this.detailsNode.active = true;

        cc.log("btnNum = ", btnNum)
    },

    onBtnDetailsCloseClicked : function(){
        this.bgNode.active = true;
        this.detailsNode.active = false;
    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.zhanjiNode.active = false;
            }) )
        this.zhanjiNode.runAction(outAction);
    }
});
