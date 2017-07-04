var utils = require("utils");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.canCilcked = false;
    },
    
    onSelfCilcked : function(){
        if(!this.canCilcked){return}
        this.gameUI.hideMoreChiUI();
        this.gameUI.sendEatPaiToSerever(this.eatObj, this.eatData);
    },
    
    init : function(gameUI, eatData, chiID, eatObj){
        var self = this;
        setTimeout(function(){
            self.canCilcked = true;
        }, 1000)
        this.gameUI      = gameUI;
        this.eatObj      = eatObj;
        this.eatData     = eatData;
        this.disPlayList = [chiID];
        this.disPlayList = eatData.concat(this.disPlayList);
        this.disPlayList.sort();
        for(let i = 0; i<3; i++){
            var id          = this.disPlayList[i];
            var contentName = "pj_"+utils.getLocalPaiID(id);
            var paiNode     = this.node.getChildByName("pai_"+i);
            var spriteNode = paiNode.getChildByName("content")
            this.gameUI.setNodeSprite(spriteNode, contentName);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
