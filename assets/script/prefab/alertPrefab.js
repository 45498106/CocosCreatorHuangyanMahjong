cc.Class({
    extends: cc.Component,

    properties: {
        alertPrefabNode  : cc.Node,
        content          : cc.Label,
    },

    // use this for initialization
    getMessageFrom: function (msg, cs) {
        this.msg = msg;
        this.cs = cs;
        this.updateContent();
    },

    updateContent : function(){
        if(this.msg == "please_enter_verification_code")
            this.content.string = "请输入验证码！"
        if(this.msg == "please_enter_correct_verification_code")
            this.content.string = "请输入正确的验证码！";
        if(this.msg == "please_enter_valid_phone_number")
            this.content.string = "请输入正确的手机号码！"
    },

    onBtnSureClicked : function(){
        this.alertPrefabNode.removeFromParent();
    },

    onBtnCloseClicked : function(){
        this.alertPrefabNode.removeFromParent();
    }
});
