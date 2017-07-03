var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");

cc.Class({
    extends: cc.Component,

    properties: {
        zhanjiNode     : cc.Node,
        bgNode         : cc.Node,
        detailsNode    : cc.Node,
        playBackBox    : cc.Node,
        titleBoxNode   : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.box = this.playBackBox;
        this.playBackBox.removeFromParent();

        this.initFunc();
        this.onRecordShow();
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
        var contentB = this.zhanjiNode.getChildByName("scrollView").getChildByName("view").getChildByName("content");
        var box = contentB.getChildByName("box");
        this.scrollViewArray = new Array();
        for(let i=0; i<4; i++){
            var cloneZJ = cc.instantiate(box);
            cloneZJ.setPositionY(cloneZJ.getPositionY() - 155*i);
            contentB.addChild(cloneZJ);
            this.scrollViewArray[i] = cloneZJ;
            this.clickEventHandleFunc(cloneZJ, i, "onBtnDetailsClicked");
        }
        contentB.height = (box.getContentSize().height + 5) * this.scrollViewArray.length + 20;
        box.removeFromParent();

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
                    var title = svBox.getChildByName("title").getComponent(cc.Label).string = "2017年6月30日  16局";
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

    //复制的按钮 传递 customEventData 值
    clickEventHandleFunc : function(cloneBox, i, func){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        eventHandler.component = "zhanjiUI"; //这个是代码文件名
        eventHandler.handler = func;
        eventHandler.customEventData = i+1;
        var button = cloneBox.getChildByName("btn").getComponent(cc.Button);
        button.clickEvents.push(eventHandler);
    },

    //进入战绩详情界面
    onBtnDetailsClicked : function(event, customEventData){
        this.bgNode.active = false;
        this.detailsNode.active = true;
        this.zhanjiDetailsShow(customEventData);
    },

    //战绩详情界面
    zhanjiDetailsShow : function(custom){
        cc.log("customEventData = ", custom)
        var self = this;
        //标题显示
        var title = this.detailsNode.getChildByName("title").getChildByName("label");
        title.getComponent("cc.Label").string = "2017年7月2日  8局";
        //内容 scrollView 显示
        var contentB = this.detailsNode.getChildByName("scrollView").getChildByName("view").getChildByName("content");
        contentB.removeAllChildren();
        var box = this.box;
        this.scrollViewArr = new Array();
        for(let i=0; i<8; i++){
            var cloneBox = cc.instantiate(box);
            cloneBox.setPositionY(cloneBox.getPositionY() - (cloneBox.getContentSize().height+5)*i);            
            contentB.addChild(cloneBox);
            this.scrollViewArr[i] = cloneBox;
            cloneBox.getChildByName("btn").opacity = 100;
            this.clickEventHandleFunc(cloneBox, i, "onBtnPalyBackFunc");
        }
        contentB.height = (box.height + 5) * this.scrollViewArr.length + 20;
        box.removeFromParent();

        var fenshu = new Array();
        fenshu[0] = 12;
        fenshu[1] = 5;
        fenshu[2] = -12;
        fenshu[3] = -5;
        cc.loader.loadRes('UI/zhanji/head', cc.SpriteFrame, function(err, spriteFrame){
            if(err){cc.error(err.message || err); return;}
            for(let k=0; k<self.scrollViewArr.length; k++)
            {
                var svBox = self.scrollViewArr[k];
                for(let i=0; i<4; i++){
                    var head = svBox.getChildByName("head"+(i+1));
                    head.getChildByName("name").getComponent(cc.Label).string = "李四";
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

    //录像回放按钮执行函数
    onBtnPalyBackFunc : function(event, customEventData){
        cc.log("----- customEventData = ", customEventData)
    },


    //以下是关闭按钮执行函数
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
