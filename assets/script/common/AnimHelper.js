var log = require("utils").log;
var GameDefine = require("GameDefine");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.spAnim = this.node.getComponent(sp.Skeleton);
        var self = this;
        var completeFunc = function(event){
            self.onAnimFinish(event)
        }
        this.spAnim.setCompleteListener(completeFunc);
    },

    onAnimFinish : function(event){
        log("--onAnimFinish----")
        this.playerUI.removeEffectByTag(this.nameTag);
    },

    init : function(nameTag, playerUI){
        this.nameTag  = nameTag;
        this.playerUI = playerUI;
    },

    playGang : function(){
        this.spAnim.setAnimation(0, "Gang", false);
    },

    playPeng : function(){
        this.spAnim.setAnimation(0, "Peng", false);
    },

    playChi : function(){
        this.spAnim.setAnimation(0, "Chi", false);
    },


    playHu : function(){
        this.spAnim.setAnimation(0, "Hu", false);
    },


    progress : function(){
       // cc.Component.EventHandler.emitEvents([this.fireHandler]);
    },
    
    
    onFinish : function(){
        cc.Component.EventHandler.emitEvents([this.finishHandler]);
    },
});
