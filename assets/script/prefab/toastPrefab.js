cc.Class({
    extends: cc.Component,

    properties: {
        toastPrefabNode  : cc.Node,
        contentNode      : cc.Node,
        backNode         : cc.Node,
    },

    // use this for initialization
    getMessageFrom: function (msg, cs) {
        this.msg = msg;
        this.cs = cs;
        this.updateContent();
        this.removeNode();
    },

    updateContent : function(){
        var content = this.contentNode.getComponent(cc.Label);
        if(this.msg == "success_bind_phone")
            content.string = "绑定成功"
        if(this.msg == "success_cancel_bind_phone")
            content.string = "取消绑定成功";

        //设置背景的宽度跟随文字长度变化
        var backHeight = this.backNode.getContentSize().height
        this.backNode.setContentSize(cc.size(this.contentNode.getContentSize().width + 40, backHeight))
    },

    removeNode : function(){
        var self = this;
        var action = cc.sequence( cc.delayTime(1), cc.fadeOut(1),
            cc.callFunc( function(){
                self.toastPrefabNode.removeFromParent();
            }) );
        this.toastPrefabNode.runAction(action);
    }
});
