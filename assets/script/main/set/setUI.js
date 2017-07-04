var UserLocalData = require("UserLocalData");
var Audio         = require("Audio");
var NetMessageMgr   = require("NetMessageMgr");
var NetProtocolList = require("NetProtocolList");

cc.Class({
    extends: cc.Component,

    properties: {
       setNode            : cc.Node,
       languageLayerNode  : cc.Node,
       bindPhoneLayerNode : cc.Node,
       writeOffBtnNode    : cc.Node,
       biankuang          : cc.Node,
       getVCBnt           : cc.Node,
       getVCBntIng        : cc.Node,
       alertPrefab        : cc.Prefab,
       toastPrefab        : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this.setInitFunc();
    },

    setInitFunc : function(){
        var soundToggle = this.biankuang.getChildByName("switchBox").getChildByName("soundToggle");
        var musicToggle = this.biankuang.getChildByName("switchBox").getChildByName("musicToggle");
        soundToggle.getComponent(cc.Toggle).isChecked = UserLocalData.getSoundSwitch();
        musicToggle.getComponent(cc.Toggle).isChecked = UserLocalData.getMusicSwitch();
        this.btnStatusChanged(UserLocalData.getAudioKind());
    },

    //检查哪些语言资源文件存在
    checkLanguageEixt : function(){
        var isFileExist;
        var ua = navigator.userAgent.toLowerCase();
        if(/iphone|ipad|ipod/.test(ua) || /android/.test(ua)){
            isFileExist = jsb.fileUtils.isFileExist(path);
        }
        // cc.log("=== isFileExist:", isFileExist)
    },

    //进入选择语言界面
    onBtnChooseLanguageClicked : function(){
        UserLocalData.setSex("female");
        Audio.playSound("zimo.mp3", false, 1);
        this.languageLayerNode.active = true;
        this.writeOffBtnNode.opacity = 150;
        this.checkLanguageEixt();
    },

    //选择或下载某种语言
    onBtnLanguageListClicked : function(event, kind){
        UserLocalData.setAudioKind(kind);
        this.btnStatusChanged(kind);
    },
    //选择语言按钮状态变化
    btnStatusChanged : function(lanKind){
        var scrollView = this.languageLayerNode.getChildByName("scrollView");
        var lanListAll = scrollView.getChildByName("view").getChildByName("content")
        var lanListArr = new Array();
        for(let i=0; i<4; i++)
            lanListArr[i] = lanListAll.getChildByName("langList"+(i+1));
        var num;
        if(lanKind == "mandarin") num = 1;
        else if(lanKind == "hyDialect") num = 2;
        else if(lanKind == "papiJ") num = 3;
        else if(lanKind == "xiaozhi") num = 4;
        for(let i=1; i<5; i++){
            var list = lanListArr[i-1];
            list.getChildByName("langBtn").getChildByName("label").getComponent(cc.Label).string = "使   用";
            list.getChildByName("langBtnUsed").active = false;
            list.getChildByName("langBtn").active = true;
        }
        lanListArr[num-1].getChildByName("langBtnUsed").active = true;
        lanListArr[num-1].getChildByName("langBtn").active = false;
    },

    //进入手机绑定界面
    onBtnBindPhoneClicked : function(){
        this.bindPhoneLayerNode.active = true;
        this.writeOffBtnNode.opacity = 150;
        var phoneNumber = this.bindPhoneLayerNode.getChildByName("phoneNumber");
        var phoneBox = this.biankuang.getChildByName("bindphoneBox").getChildByName("phoneBox");
        var bindLabel = phoneBox.getChildByName("bindLabel").getComponent(cc.Label);
        var phoneNumLabel = phoneNumber.getChildByName("phoneNum").getComponent(cc.Label);
        var btnBindPhone = this.bindPhoneLayerNode.getChildByName("associatedPhoneBtn").getChildByName("label");
        if(bindLabel.string == "未绑定手机"){
            this.isBindPhone = true;
            phoneNumLabel.string = "";
            phoneNumber.getChildByName("pEditBox").active = true;
            btnBindPhone.getComponent(cc.Label).string = "绑定手机";
        } else {
            this.isBindPhone = false;
            phoneNumLabel.string = this.phoneNum;
            phoneNumber.getChildByName("pEditBox").active = false;
            btnBindPhone.getComponent(cc.Label).string = "解除绑定";
        }
    },

    //发送验证码按钮
    onBtnSendVerificationCode : function(){
        var phoneNumber = this.bindPhoneLayerNode.getChildByName("phoneNumber")
        var phoneNum = phoneNumber.getChildByName("pEditBox").getComponent(cc.EditBox).string;
        this.phoneNum = phoneNum;
        // !isNaN(Number(phoneNum)) 判断字符串中所以字符是否都为数字
        //判断手机是否合法
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(phoneNum.length === 11 && myreg.test(phoneNum)){
            this.getVCBnt.active = false;
            this.getVCBntIng.active = true;
            this.verificationCodeSchedule();
            //向服务器发送手机验证码请求
            // NetMessageMgr.send(NetProtocolList.验证码请求.netID, xxx);
        } else {
            this.alertPrefabFunc(this.alertPrefab, "please_enter_valid_phone_number");
        }
    },

    //手机获取验证码的计时器
    verificationCodeSchedule : function(){
        var time = 60;
        var label = this.getVCBnt.getChildByName("label");
        var labeling = this.getVCBntIng.getChildByName("label");
        labeling.getComponent(cc.Label).string = time;
        this.vcSchedule = function(){
            time--;
            if(time >= 0)
                labeling.getComponent(cc.Label).string = time;
            else {
                this.getVCBnt.active = true;
                this.getVCBntIng.active = false;
                label.getComponent(cc.Label).string = "重新获取";
                this.unschedule(this.vcSchedule);
            }
        }
        this.schedule(this.vcSchedule, 1);
    },

    //服务器返回的验证码信息
    getCodeByNet : function(code){
        cc.log("----- 服务器返回的验证码信息：", code)
        this.verCode = code;
    } ,

    //绑定手机或者解绑手机
    onBtnAssociatedPhone : function(){
        var verificationCode = this.bindPhoneLayerNode.getChildByName("verificationCode");
        var verEditBox = verificationCode.getChildByName("pEditBox").getComponent(cc.EditBox);
        var bindphoneBox = this.biankuang.getChildByName("bindphoneBox");
        var bindLabel = bindphoneBox.getChildByName("phoneBox").getChildByName("bindLabel").getComponent(cc.Label);
        var btnBindLabel = bindphoneBox.getChildByName("bindBtn").getChildByName("name").getComponent(cc.Label);
        if(verEditBox.string === "")
            this.alertPrefabFunc(this.alertPrefab, "please_enter_verification_code");
        else if(verEditBox.string == this.verCode){
            if(this.isBindPhone == true){
                this.alertPrefabFunc(this.toastPrefab, "绑定成功");
                bindLabel.string = this.phoneNum;
                btnBindLabel.string = "解 绑";
            } else {
                this.alertPrefabFunc(this.toastPrefab, "取消绑定成功");
                bindLabel.string = "未绑定手机";
                btnBindLabel.string = "绑 定";
            }
            this.unschedule(this.vcSchedule);
            this.onBtnCloseBindPhoneClicked();
            this.getVCBnt.active = true;
            this.getVCBntIng.active = false;
            this.getVCBnt.getChildByName("label").getComponent(cc.Label).string = "获取验证码";
            verEditBox.string = "";
        }
        else
            this.alertPrefabFunc(this.alertPrefab, "please_enter_correct_verification_code");
    },

    //音效音乐开关设置
    onBtnSoundMusicSet : function(event, num){
        var soundToggle = this.biankuang.getChildByName("switchBox").getChildByName("soundToggle");
        var musicToggle = this.biankuang.getChildByName("switchBox").getChildByName("musicToggle");
        if(num === "sound"){
            var mark = soundToggle.getComponent(cc.Toggle).isChecked;
            if(mark){
                UserLocalData.setSoundSwitch(true);
                Audio.resumeSound();
            }else{
                UserLocalData.setSoundSwitch(false);
                Audio.stopSound();
            }
        } else {
            var mark = musicToggle.getComponent(cc.Toggle).isChecked;
            if(mark){
                UserLocalData.setMusicSwitch(true);
                Audio.resumeMusic();
            }else{
                UserLocalData.setMusicSwitch(false);
                Audio.pauseMusic();
            }
        }
    },

    //注销账号
    onBtnLogoutUser : function(){
        cc.director.loadScene("login");
    },

    //弹出提示框
    alertPrefabFunc : function(prefab, msg, cs) {
        this.setNode.active = true;
        var promptBox = cc.instantiate(prefab);
        promptBox.setPosition(cc.p(0, 0));
        this.setNode.addChild(promptBox);
        if(prefab.name == "alertPrefab") {
            if (msg || cs) promptBox.getComponent("alertUI").getMessageFrom(msg, cs);
        } else if (prefab.name == "toastPrefab") {
            if (msg || cs) promptBox.getComponent("toastPrefab").getMessageFrom(msg);
        }
    },

    //以下是关闭按钮执行函数
    onBtnCloseLanguageClicked : function(){
        this.languageLayerNode.active = false;
        this.writeOffBtnNode.opacity = 255;
    },

    onBtnCloseBindPhoneClicked : function(){
        this.bindPhoneLayerNode.active = false;
        this.writeOffBtnNode.opacity = 255;
        this.getVCBnt.getChildByName("label").getComponent(cc.Label).string = "获取验证码";
    },

    onBtnCloseClicked : function(){
        var self = this;
        var outTime = 0.5;
        var outAction = cc.sequence( cc.spawn(cc.fadeOut(outTime), cc.scaleTo(outTime, 0.2)), 
            cc.callFunc( function(){
                self.setNode.active = false;
            }) )
        this.setNode.runAction(outAction);
    },
});
