var GameDefine = require("GameDefine");
var log = require("utils").log;
var getDisTime = function(newPos, curPos){
    var Dist    = cc.pDistance(newPos, curPos);
    Dist        = Dist < 300 ? 300 : Dist;
    Dist        = 300 + (Dist-300)/2
    var hTime   = Dist / 1000+ 0.1;
    return hTime
}

/////////////////////////////// start  //////////////////////////////////////////////////////////

/////////////////////////////// 上方玩家 //////////////////////////////////////////////////////////

var shangControl = function(){
    this.nodeScale     = 1.3;
   
    this.daPaiScale    = 1;
    this.paiEndSacale  = 0.7;
    this.eatTagPos     = cc.p(-300, -50);    
    this.endPaiHeight  = 44;

    this.endPaiWidth   = 36;
    this.showPaiWidth  = 49;
    this.pengGangScale = 0.70;
    this.pengGangHeng  = 35;
    this.pengGangZhi   = 48;
    this.childDis      = 4;
    this.groupDis      = 12;
    this.direction     = -1;
    this.nodeAnchorX    = 1;
    this.nodeAnchorY    = 0.5;

   //peng pai  list'len and posList
    this.refrePengLen  = function(pengData){
        this.PengLen = this.GangLen;
        this.PengPos = {};
        for(let gIndex =0; gIndex < pengData.length; gIndex++){
            var curLen = 0;
            for(let i = 0; i< 3; i++){
                var isRotate               = (pengData[gIndex][i].rotate !== 0);
                var rotateDiff             = (isRotate) ? 21.6 : 0;
                this.PengPos[gIndex+"+"+i] = cc.p((this.PengLen + curLen + rotateDiff)* this.direction, 0);
                var addLen                 = 0;
                if(isRotate){
                    addLen += this.pengGangZhi;
                    this.PengPos[gIndex+"+"+i].y -= 6;
                }else{
                    addLen += this.pengGangHeng;
                }
                curLen += addLen;
            }
            this.PengLen += curLen + this.childDis;
        }
        this.PengLen = this.PengLen > 0 ? this.PengLen + 30 : this.PengLen;
    }

    //gang pai  list'len and posList
    this.refreGangLen  = function(gangData){
        this.GangLen = 0;
        this.GangPos = {};
        for(let gIndex =0; gIndex < gangData.length; gIndex++){
            var curLen = 0;
            var fourX  = this.pengGangHeng/2;
            for(let i = 0; i< 3; i++){
                var isRotate               = (gangData[gIndex][i].rotate !== 0);
                var rotateDiff             = (isRotate) ? 22 : 0;
                this.GangPos[gIndex+"+"+i] = cc.p((this.GangLen + curLen + rotateDiff) * this.direction , 0);
                var addLen                 = 0;
                if(isRotate){
                    addLen += this.pengGangZhi;
                    this.GangPos[gIndex+"+"+i].y -= 6;
                    fourX = (i===0) ? this.pengGangHeng/2 + this.pengGangZhi : this.pengGangHeng/2;
                }else{
                    addLen += this.pengGangHeng;
                }
                curLen += addLen;
            }
            //让第四张牌重贴在牌之间上面
            this.GangPos[gIndex+"+"+3] = cc.p((this.GangLen + fourX)*this.direction, -6);
            // 每个gang牌组合之间的间距
            this.GangLen += curLen + this.childDis;
        }
        this.GangLen = this.GangLen > 0 ? this.GangLen  : this.GangLen;
    }

    this.getShouPaiPos = function(index){
        return cc.p((index * this.showPaiWidth + this.PengLen) * this.direction, 0);
    }
    
    this.getNewShowPaiPos = function(index){
        var pos = this.getShouPaiPos(index);
        pos.x -= 10;
        return pos;
    }
    this.moveOutAction = cc.moveTo(0.4, cc.p(-300, -120));
    //获取新牌移动的动画
    this.getNewMoveAction = function(newPos, curPos){
        //距离
        var moveX   = newPos.x - curPos.x;
        var action1 = cc.moveBy(0.1, cc.p(0, -20));
        var action2 = cc.moveBy(getDisTime(newPos, curPos), cc.p(moveX, 0));
        var action3 = cc.moveBy(0.1, cc.p(0, 20));
        return cc.sequence(action1, action2, action3);
    }
    this.getDaPaiEndData = function(index){
        index = parseInt(index);
        var heightIndex = Math.floor(index /10);
        var widthIndex   = index % 10;
        var xPos = -40 - widthIndex * this.endPaiWidth;
        var yPos = -80 - heightIndex * this.endPaiHeight
        var paiData = {};
        paiData.pos = cc.p(xPos, yPos);
        paiData.zOrder = index
        return paiData;
    }
};

/////////////////////////////// 左方玩家 //////////////////////////////////////////////////////////

var zuoControl = function(){
    this.nodeScale     = 1;
    this.pengGangScale = 1;
    this.daPaiScale    = 1.6;
    this.paiEndSacale  = 1;
    this.eatTagPos     = cc.p(100, -200);
    this.showPaiWidth  = 30;
    

    this.endPaiWidth   = 41;
    this.endPaiHeight  = 28;
    this.pengGangScale = 1;
    this.pengGangHeng= 28;
    this.pengGangZhi = 41;
    this.childDis    = 8;
    this.groupDis    = 15;
    this.nodeAnchorX    = 0.5;
    this.nodeAnchorY    = 1;
    this.direction   = -1;


    //peng pai  list'len and posList
    this.refrePengLen  = function(pengData){
        this.PengLen = this.GangLen;
        this.PengPos = {};
        for(let gIndex =0; gIndex < pengData.length; gIndex++){
            var curLen = 0;
            for(let i = 0; i< 3; i++){
                var isRotate               = (pengData[gIndex][i].rotate !== 0);
                var rotateDiff             = (isRotate) ? 7 : 0;
                this.PengPos[gIndex+"+"+i] = cc.p(0, (this.PengLen + curLen + rotateDiff)*this.direction);
                var addLen                 = 0;
                if(isRotate){
                    addLen += this.pengGangZhi;
                    this.PengPos[gIndex+"+"+i].x += 8.6;
                }else{
                    addLen += this.pengGangHeng;
                }
                curLen += addLen;
            }
            // 每个peng牌组合之间的间距是4 
            this.PengLen += curLen + this.childDis;
        }
        this.PengLen = this.PengLen > 0 ? this.PengLen + this.groupDis : this.PengLen;
    }

    //gang pai  list'len and posList
    this.refreGangLen  = function(gangData){
        this.GangLen = 0;
        this.GangPos = {};
        for(let gIndex =0; gIndex < gangData.length; gIndex++){
            var curLen = 0;
            var fourY  = this.pengGangHeng/2;
            for(let i = 0; i< 3; i++){
                var isRotate               = (gangData[gIndex][i].rotate !== 0);
                var rotateDiff             = (isRotate) ? 7: 0;
                this.GangPos[gIndex+"+"+i] = cc.p(0, (this.GangLen + curLen + rotateDiff)*this.direction);
                var addLen                 = 0;
                if(isRotate){
                    addLen += this.pengGangZhi;
                    this.GangPos[gIndex+"+"+i].x += 8.6;
                    fourY = (i===0) ? this.pengGangHeng/2 + this.pengGangZhi : this.pengGangHeng/2;
                }else{
                    addLen += this.pengGangHeng;
                }
                curLen += addLen;
            }
            //让第四张牌重贴在牌之间上面
            this.GangPos[gIndex+"+"+3] = cc.p(10, (this.GangLen + fourY)*this.direction);
            // 每个gang牌组合之间的间距
            this.GangLen += curLen + this.childDis;
        }
        this.GangLen = this.GangLen > 0 ? this.GangLen + this.groupDis : this.GangLen;
    }
    

    this.getShouPaiPos = function(index){
        return cc.p(0, (index * this.showPaiWidth + this.PengLen)* this.direction);
    }

    this.getNewShowPaiPos = function(index){
        var pos = this.getShouPaiPos(index);
        pos.y -= 2;
        return pos;
    }
    this.moveOutAction = cc.moveTo(0.4, cc.p(100, -240));
    //获取新牌移动的动画
    this.getNewMoveAction = function(newPos, curPos){
        //距离
        var moveY   = newPos.y - curPos.y;
        var action1 = cc.moveBy(0.1, cc.p(20, 0));
        var action2 = cc.moveBy(getDisTime(newPos, curPos), cc.p(0, moveY));
        var action3 = cc.moveBy(0.1, cc.p(-20, 0));
        return cc.sequence(action1, action2, action3);
    }

    this.getDaPaiEndData = function(index){
        index = parseInt(index);
        var heightIndex = Math.floor(index /10);
        var widthIndex   = index % 10;
        var xPos = 120 + heightIndex * this.endPaiWidth;
        var yPos = -100 - widthIndex * this.endPaiHeight
        var paiData = {};
        paiData.pos = cc.p(xPos, yPos);
        paiData.zOrder = index
        return paiData;
    }
};

/////////////////////////////// 右方玩家 //////////////////////////////////////////////////////////

var youControl = function(){
    this.nodeScale     = 1;
    this.daPaiScale    = 1.6;
    this.paiEndSacale  = 1;
    this.eatTagPos     = cc.p(-100, 200);
    this.showPaiWidth  = 30;
    this.endPaiWidth   = 41;
    this.endPaiHeight  = 28;


    this.pengGangScale = 1;
    this.pengGangHeng= 28;
    this.pengGangZhi = 41;
    this.childDis    = 8;
    this.groupDis    = 15;
    this.nodeAnchorX    = 0.5;
    this.nodeAnchorY    = 0;

    //peng pai  list'len and posList
    this.refrePengLen  = function(pengData){
        this.PengLen = this.GangLen;
        this.PengPos = {};
        for(let gIndex =0; gIndex < pengData.length; gIndex++){
            var curLen = 0;
            for(let i = 0; i< 3; i++){
                var isRotate               = (pengData[gIndex][i].rotate !== 0);
                var rotateDiff             = (isRotate) ? 6 : 0;
                this.PengPos[gIndex+"+"+i] = cc.p(0, this.PengLen + curLen + rotateDiff);
                var addLen                 = 0;
                if(isRotate){
                    addLen += this.pengGangZhi;
                    this.PengPos[gIndex+"+"+i].x += 15;
                }else{
                    addLen += this.pengGangHeng;
                }
                curLen += addLen;
            }
            // 每个peng牌组合之间的间距是4 
            this.PengLen += curLen + this.childDis;
        }
        this.PengLen = this.PengLen > 0 ? this.PengLen + this.groupDis : this.PengLen;
    }

    //gang pai  list'len and posList
    this.refreGangLen  = function(gangData){
        this.GangLen = 0;
        this.GangPos = {};
        for(let gIndex =0; gIndex < gangData.length; gIndex++){
            var curLen = 0;
            var fourY  = this.pengGangHeng;
            for(let i = 0; i< 3; i++){
                var isRotate               = (gangData[gIndex][i].rotate !== 0);
                var rotateDiff             = (isRotate) ? 6 : 0;
                this.GangPos[gIndex+"+"+i] = cc.p(0, this.GangLen + curLen + rotateDiff);
                var addLen                 = 0;
                if(isRotate){
                    addLen += this.pengGangZhi;
                    this.GangPos[gIndex+"+"+i].x += 15;
                    fourY = (i===0) ? this.pengGangHeng + this.pengGangZhi : this.pengGangHeng;
                }else{
                    addLen += this.pengGangHeng;
                }
                curLen += addLen;
            }
            //让第四张牌重贴在牌之间上面
            this.GangPos[gIndex+"+"+3] = cc.p(-10, this.GangLen + fourY);
            // 每个gang牌组合之间的间距
            this.GangLen += curLen + this.childDis;
        }
        this.GangLen = this.GangLen > 0 ? this.GangLen + this.groupDis : this.GangLen;
    }
    

    this.getShouPaiPos = function(index){
        return cc.p(0, index * this.showPaiWidth + this.PengLen);
    }
    this.getShouZorder  = function(index){
        return  20  - parseInt(index);
    }
    this.getZorder  = function(gIndex, index){
        index = parseInt(index);
        index = index === 3 ? -1 : index; 
        return 100 - gIndex * 10 - index;
    }
    this.getNewShowPaiPos = function(index){
        var pos = this.getShouPaiPos(index);
        pos.y -= 2;
        return pos;
    }
    this.moveOutAction = cc.moveTo(0.4, cc.p(-100, 240));
    //获取新牌移动的动画
    this.getNewMoveAction = function(newPos, curPos){
        //距离
        var moveY   = newPos.y - curPos.y;
        var action1 = cc.moveBy(0.1, cc.p(-20, 0));
        var action2 = cc.moveBy(getDisTime(newPos, curPos), cc.p(0, moveY));
        var action3 = cc.moveBy(0.1, cc.p(20, 0));
        return cc.sequence(action1, action2, action3);
    }
    this.getDaPaiEndData = function(index){
        index = parseInt(index);
        var heightIndex = Math.floor(index /10);
        var widthIndex   = index % 10;
        var xPos = -120 - heightIndex * this.endPaiWidth;
        var yPos = 40 + widthIndex * this.endPaiHeight
        var paiData = {};
        paiData.pos = cc.p(xPos, yPos);
        paiData.zOrder = 100 - index
        return paiData;
    }
};








/////////////////////////////// 下方玩家 //////////////////////////////////////////////////////////


var UIControlData = function(){
    this.GangLen     = 0;
    this.PengLen     = 0;
    this.getPengPos = function(gIndex, index){
        return this.PengPos[gIndex +"+"+ index];
    }
    this.getGangPos = function(gIndex, index){
        return this.GangPos[gIndex +"+"+ index];
    }
    this.getZorder  = function(gIndex, index){
        return gIndex * 10 + parseInt(index) + 1;
    }
    this.getShouZorder = function(index){
        return 50 + parseInt(index);
    }
}








var xiaControl = function(){
    this.nodeScale     = 0.88;
    this.paiEndSacale  = 0.7;
    this.daPaiScale    = 1;
    this.eatTagPos     = cc.p(400, 100);
    this.showPaiWidth  = 59;
    this.endPaiWidth   = 36;
    this.endPaiHeight  = 44;
    this.pengGangScale = 0.82;
    this.pengGangHeng  = 41;
    this.pengGangZhi   = 56;
    this.childDis      = 4;
    this.groupDis      = 10;
    this.nodeAnchorX   = 0;
    this.nodeAnchorY   = 0.5;

    //peng pai  list'len and posList
    this.refrePengLen  = function(pengData){
        this.PengLen = this.GangLen;
        this.PengPos = {};
        for(let gIndex =0; gIndex < pengData.length; gIndex++){
            var curLen = 0;
            for(let i = 0; i< 3; i++){
                var isRotate               = (pengData[gIndex][i].rotate !== 0);
                var rotateDiff             = (isRotate) ? -10.2 : 0;
                this.PengPos[gIndex+"+"+i] = cc.p(this.PengLen + curLen + rotateDiff, 0);
                var addLen                 = 0;
                if(isRotate){
                    addLen += this.pengGangZhi;
                    this.PengPos[gIndex+"+"+i].y -= 7;
                }else{
                    addLen += this.pengGangHeng;
                }
                curLen += addLen;
            }
            // 每个peng牌组合之间的间距是4 
            this.PengLen += curLen + this.childDis;
        }
        this.PengLen = this.PengLen > 0 ? this.PengLen + this.groupDis : this.PengLen;
    }

    //gang pai  list'len and posList
    this.refreGangLen  = function(gangData){
        this.GangLen = 0;
        this.GangPos = {};
        for(let gIndex =0; gIndex < gangData.length; gIndex++){
            var curLen = 0;
            var fourX  = this.pengGangHeng/2;
            for(let i = 0; i< 3; i++){
                var isRotate               = (gangData[gIndex][i].rotate !== 0);
                var rotateDiff             = (isRotate) ? -10.2 : 0;
                this.GangPos[gIndex+"+"+i] = cc.p(this.GangLen + curLen + rotateDiff, 0);
                var addLen                 = 0;
                if(isRotate){
                    addLen += this.pengGangZhi;
                    this.GangPos[gIndex+"+"+i].y -= 7;
                    fourX = (i===0) ? this.pengGangHeng/2 + this.pengGangZhi : this.pengGangHeng/2;
                }else{
                    addLen += this.pengGangHeng;
                }
                curLen += addLen;
            }
            //让第四张牌重贴在牌之间上面
            this.GangPos[gIndex+"+"+3] = cc.p(this.GangLen + fourX, 20);
            // 每个gang牌组合之间的间距
            this.GangLen += curLen + this.childDis;
        }
        this.GangLen = this.GangLen > 0 ? this.GangLen + this.groupDis : this.GangLen;
    }
    

    this.getShouPaiPos = function(index){
        return cc.p(index * this.showPaiWidth + this.PengLen, 0);
    }
    this.getNewShowPaiPos = function(index, iconNode){
        var pos = this.getShouPaiPos(index, iconNode);
        pos.x -= 10;
        return pos;
    }
    this.moveOutAction = cc.moveTo(0.4, cc.p(400, 100));
    //获取新牌移动的动画
    this.getNewMoveAction = function(newPos, curPos){
        //距离
        var moveX   = newPos.x - curPos.x;
        var action1 = cc.moveBy(0.1, cc.p(0, 70));
        var action2 = cc.moveBy(getDisTime(newPos, curPos), cc.p(moveX, 0));
        var action3 = cc.moveBy(0.1, cc.p(0, -70));
        return cc.sequence(action1, action2, action3);
    }

    this.getDaPaiEndData = function(index){
        index = parseInt(index);
        var heightIndex = Math.floor(index /10);
        var widthIndex   = index % 10;
        var xPos = 120 + widthIndex * this.endPaiWidth;
        var yPos = 80 + heightIndex * this.endPaiHeight
        var paiData = {};
        paiData.pos = cc.p(xPos, yPos);
        paiData.zOrder = 100 - index
        return paiData;
    }
}

//inherit from UIControlData
xiaControl.prototype   = new UIControlData();
shangControl.prototype = new UIControlData();
youControl.prototype   = new UIControlData();
zuoControl.prototype   = new UIControlData();


/////////////////////////////// end  //////////////////////////////////////////////////////////

module.exports = {
    new : function(deskType){
        if(deskType === GameDefine.DESKPOS_TYPE.SHANG){
            return new shangControl();
        }else if(deskType === GameDefine.DESKPOS_TYPE.ZUO){
            return new zuoControl();
        }else if(deskType === GameDefine.DESKPOS_TYPE.XIA){
            return new xiaControl();
        }else if(deskType === GameDefine.DESKPOS_TYPE.YOU){
            return new youControl();
        }
    }
}