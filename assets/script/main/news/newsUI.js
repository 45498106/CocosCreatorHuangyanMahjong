cc.Class({
    extends: cc.Component,

    properties: {
        newsNode   : cc.Node,
        scrollView : cc.Node,
        contentBox : cc.Node,
        box        : cc.Node,
    },

    onLoad: function () {
        this.cloneBox = this.box;
        this.box.removeFromParent();

        this.updateNews = false;
        this.newsShow();    
    },

    //消息显示
    newsShow : function(){
        this.scrollViewArr = new Array();
        for(let i=0; i<6; i++){
            var cloneBox = cc.instantiate(this.cloneBox);
            cloneBox.setPositionY(cloneBox.getPositionY() - (cloneBox.height + 5) * i);
            this.contentBox.addChild(cloneBox);
            this.scrollViewArr[i] = cloneBox;

            cloneBox.getChildByName("title").getComponent(cc.Label).string = "2017年7月2日"
            var content = cloneBox.getChildByName("dikuang").getChildByName("content");
            content.getComponent(cc.Label).string = "这是系统消息...";
            
        }
        this.contentBox.height = (this.cloneBox.height+5)*this.scrollViewArr.length + 20;
    },

    //滑动条滑动监听
    scrollBarListener : function(sender, event){
        if(event === 0)
            this.updateNews = true;
        if(this.contentBox.getPositionY() <= 140 && this.updateNews){
            cc.log(event);
            this.scheduleFunc();
            this.updateNews = false;
        }
    },

    scheduleFunc : function(){
        this.mySchedule = function(){
            cc.log(this.contentBox.getPositionY())
            if(this.contentBox.getPositionY() >= 279){
                this.unschedule(this.mySchedule);
                this.updateNewsFunc();
            }
        }
        this.schedule(this.mySchedule, 0.5);
    },

    //刷新邮件消息
    updateNewsFunc : function(){
        cc.log("----- updateNewsFunc -----");
        var arrLen = this.scrollViewArr.length;
        for(let i=0; i<1; i++){
            var cloneBox = cc.instantiate(this.cloneBox);
            cloneBox.setPositionY(cloneBox.getPositionY() - (cloneBox.height + 5) * (arrLen+i));
            this.contentBox.addChild(cloneBox);
            this.scrollViewArr[arrLen+i] = cloneBox;
        }
        this.contentBox.height = (this.cloneBox.height + 5) * this.scrollViewArr.length + 20;
    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.newsNode.active = false;
            }) )
        this.newsNode.runAction(outAction);
    }
});
