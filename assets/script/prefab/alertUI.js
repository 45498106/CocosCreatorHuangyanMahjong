cc.Class({
    extends: cc.Component,

    properties: {
        content          : cc.Label,
        titleLabel       : cc.Label,
        btnClose   : cc.Node,
        btnOK  : cc.Node,
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
    
    show : function(title, contentStr, okCB, cancelCB, env){
        title                  = title || "";
        this.content.string    = contentStr;
        this.titleLabel.string = title;
        this.okCB              = okCB;
        this.cancelCB          = cancelCB;
        this.env               = env;
        
    },

    hideBtnClose : function(){
        this.btnClose.active = false
    },

    hideBtnOK : function(){
        this.btnOK.active = false;
    },

    onBtnSureClicked : function(){
        if(this.okCB){
            this.okCB.call(this.env);
        }
        this.node.removeFromParent();
        
    },

    onBtnCloseClicked : function(){
        if(this.cancelCB){
            this.cancelCB.call(this.env);
        }
        this.node.removeFromParent();
    }
});

