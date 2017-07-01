cc.Class({
    extends: cc.Component,

    properties: {
        onBtnDetails  : cc.Node,
    },

    onLoad: function () {

    },

    setBtnNum : function(num){
        this.num = num;
    },

    onBtnDetailsClicked : function(){
        cc.log(this.num)
        
    }

});
