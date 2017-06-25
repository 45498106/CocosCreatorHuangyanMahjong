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
    this.pengGangScale = 0.7;
    this.daPaiScale    = 1;
    this.paiEndSacale  = 0.7;
    this.startPos      = 0;
    this.shouStartPos  = this.startPos;
    this.eatTagPos     = cc.p(300, -50);
    this.pengGroupLen  = 0;
    this.gangGroupLen  = 0;
    this.showPaiWidth  = 49;
    this.pengPaiWidth  = 36;
    this.endPaiWidth   = 36;
    this.endPaiHeight  = 44;
    this.getShouPaiPos = function(index){
        return cc.p(index * this.showPaiWidth + this.shouStartPos, 0);
    }
    this.getNewShowPaiPos = function(index){
        var pos = this.getShouPaiPos(index);
        pos.x -= 10;
        return pos;
    }
    this.moveOutAction = cc.moveTo(0.4, cc.p(300, -120));
    //获取新牌移动的动画
    this.getNewMoveAction = function(newPos, curPos){
        //距离
        var moveX   = newPos.x - curPos.x;
        var action1 = cc.moveBy(0.1, cc.p(0, -20));
        var action2 = cc.moveBy(getDisTime(newPos, curPos), cc.p(moveX, 0));
        var action3 = cc.moveBy(0.1, cc.p(0, 20));
        return cc.sequence(action1, action2, action3);
    }
    this.refreStartPos = function(pengGangData){
        this.pengGroupLen = pengGangData.peng.length * this.pengPaiWidth * 3.4 
        this.gangGroupLen = pengGangData.gang.length * this.pengPaiWidth * 3.4;
        this.shouStartPos = this.pengGroupLen + this.gangGroupLen + this.startPos + 10
    },

    this.getGangPosList = function(groupIndex, gangPai){
        var gangPosList = [];
        var curGangLen  = groupIndex * this.pengPaiWidth * 3.5 + this.startPos;
        var addLen      = 0;
        var isFrist     = false;//旋转的是否第一个
        for(let i = 0; i< 3; i++){
            var pai = gangPai[i];
            var yPos= 0;
            var xPos= curGangLen - addLen;
            if(pai.rotate !== 0){
                isFrist     = (i === 0);
                var moveDis = isFrist ? 2 : 4
                xPos        += moveDis;
                yPos        -= 6;
                addLen      += this.pengPaiWidth * 1.2
            }else {
                addLen += this.pengPaiWidth;
            }
            gangPosList.push(cc.p(xPos, yPos));
        }
        //让第四张牌重贴在牌之间上面
        var cpIndex    = isFrist ? 1 : 0;
        var temPos     = gangPosList[cpIndex];
        gangPosList[3] = cc.p(temPos.x - 20, temPos.y - 6)
        return gangPosList;
    }
    this.getPengPaiPos = function(groupIndex, index, pai){
        if(index === 0){
            this.curPenLen = groupIndex * this.pengPaiWidth *3.5;
        }
        var xPos = this.startPos + this.gangGroupLen + this.curPenLen;
        var yPos = 0;
        if(pai.rotate !== 0){
            var addLen = (index == 0) ? 2 : 4
            xPos += addLen;
            yPos -= 6;
            this.curPenLen += this.pengPaiWidth * 1.2;
        }else {
            this.curPenLen += this.pengPaiWidth
        }
        return cc.p(xPos, yPos);
    }
    this.getDaPaiEndData = function(index){
        index = parseInt(index);
        var heightIndex = Math.floor(index /10);
        var widthIndex   = index % 10;
        var xPos = 120 + widthIndex * this.endPaiWidth;
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
    this.startPos      = 0;
    this.eatTagPos     = cc.p(100, -200);
    this.shouStartPos  = this.startPos;
    this.showPaiWidth  = 30;
    this.pengPaiWidth  = 28;
    this.endPaiWidth   = 41;
    this.endPaiHeight  = 28;
    this.getShouPaiPos = function(index){
        return cc.p(0, -index * this.showPaiWidth +  this.shouStartPos);
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
    this.refreStartPos = function(pengGangData){
        this.pengGroupLen = pengGangData.peng.length * this.pengPaiWidth * 3.5 
        this.gangGroupLen = pengGangData.gang.length * this.pengPaiWidth * 3.5 + 20;
        this.shouStartPos = 0 - this.pengGroupLen - this.gangGroupLen - 30 + this.startPos
    },
    this.getGangPosList = function(groupIndex, gangPai){
        var gangPosList = [];
        var curGangLen  = -groupIndex * this.pengPaiWidth * 3.5 + this.startPos;
        var addLen      = 0;
        var isFrist     = false;//旋转的是否第一个
        for(let i = 0; i< 3; i++){
            var pai = gangPai[i];
            var yPos= curGangLen - addLen;
            var xPos=0;
            if(pai.rotate !== 0){
                isFrist     = (i === 0);
                var moveDis = isFrist ? -2 : 4
                yPos        -= moveDis;
                xPos        -= 2;
                addLen      += this.pengPaiWidth * 1.2
            }else {
                addLen += this.pengPaiWidth;
            }
            gangPosList.push(cc.p(xPos, yPos));
        }
        //让第四张牌重贴在牌之间上面
        var cpIndex    = isFrist ? 1 : 0;
        var temPos     = gangPosList[cpIndex];
        gangPosList[3] = cc.p(temPos.x + 6, temPos.y - 18)
        return gangPosList;
    }

    this.getPengPaiPos = function(groupIndex, index, pai){
        if(index === 0){
            this.curPenLen = -groupIndex * this.pengPaiWidth * 3.5;
        }
        var yPos = this.startPos - this.gangGroupLen + this.curPenLen;
        var xPos = 0;
        if(pai.rotate !== 0){
            var addLen = (index == 0) ? -2 : 6
            yPos -= addLen;
            xPos -= 2;
            this.curPenLen -= this.pengPaiWidth * 1.2
        }else {
            this.curPenLen -= this.pengPaiWidth;
        }
        return cc.p(xPos, yPos);
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
    this.pengGangScale = 1;
    this.daPaiScale    = 1.6;
    this.paiEndSacale  = 1;
    this.eatTagPos     = cc.p(-100, -200);
    this.startPos      = 0;
    this.shouStartPos  = this.startPos;
    this.pengGroupLen  = 0;
    this.gangGroupLen  = 0;
    this.showPaiWidth  = 30;
    this.pengPaiWidth  = 28;
    this.endPaiWidth   = 41;
    this.endPaiHeight  = 28;
    this.getShouPaiPos = function(index){
        return cc.p(0, -index * this.showPaiWidth +  this.shouStartPos);
    }
    this.getNewShowPaiPos = function(index){
        var pos = this.getShouPaiPos(index);
        pos.y -= 2;
        return pos;
    }
    this.moveOutAction = cc.moveTo(0.4, cc.p(-100, -240));
    //获取新牌移动的动画
    this.getNewMoveAction = function(newPos, curPos){
        //距离
        var moveY   = newPos.y - curPos.y;
        var action1 = cc.moveBy(0.1, cc.p(-20, 0));
        var action2 = cc.moveBy(getDisTime(newPos, curPos), cc.p(0, moveY));
        var action3 = cc.moveBy(0.1, cc.p(20, 0));
        return cc.sequence(action1, action2, action3);
    }
    this.refreStartPos = function(pengGangData){
        this.pengGroupLen = pengGangData.peng.length * this.pengPaiWidth * 3.5 
        this.gangGroupLen = pengGangData.gang.length * this.pengPaiWidth * 3.5 + 20
        this.shouStartPos = 0 - this.pengGroupLen - this.gangGroupLen - 30 + this.startPos
    },

    this.getGangPosList = function(groupIndex, gangPai){
        var gangPosList = [];
        var curGangLen  = -groupIndex * this.pengPaiWidth * 3.5 + this.startPos;
        var addLen      = 0;
        var isFrist     = false;//旋转的是否第一个
        for(let i = 0; i< 3; i++){
            var pai = gangPai[i];
            var yPos= curGangLen - addLen;
            var xPos=0;
            if(pai.rotate !== 0){
                isFrist = (i === 0);
                var moveDis = isFrist ? -2 : 8
                yPos        -= moveDis;
                xPos        += 2;
                addLen      += this.pengPaiWidth * 1.2
            }else {
                addLen += this.pengPaiWidth;
            }
            gangPosList.push(cc.p(xPos, yPos));
        }
        //让第四张牌重贴在牌之间上面
        var cpIndex    = isFrist ? 1 : 0;
        var temPos     = gangPosList[cpIndex];
        gangPosList[3] = cc.p(temPos.x - 8, temPos.y - 10);
        return gangPosList;
    }

    this.getPengPaiPos = function(groupIndex, index, pai){
        if(index === 0){
            this.curPenLen =  -groupIndex * this.pengPaiWidth *3.5;
        }
        var yPos = this.startPos - this.gangGroupLen + this.curPenLen;
        var xPos = 0;
        if(pai.rotate !== 0){
            var addLen = (index == 0) ? -2 : 8
            yPos -= addLen;
            xPos += 2;
           this.curPenLen -= this.pengPaiWidth * 1.2
        }else {
            this.curPenLen -= this.pengPaiWidth;
        }
        return cc.p(xPos, yPos);
    }
    this.getDaPaiEndData = function(index){
        index = parseInt(index);
        var heightIndex = Math.floor(index /10);
        var widthIndex   = index % 10;
        var xPos = -120 - heightIndex * this.endPaiWidth;
        var yPos = -100 - widthIndex * this.endPaiHeight
        var paiData = {};
        paiData.pos = cc.p(xPos, yPos);
        paiData.zOrder = index
        return paiData;
    }
};

/////////////////////////////// 下方玩家 //////////////////////////////////////////////////////////

var xiaControl = function(){
    this.nodeScale     = 0.88;
    this.pengGangScale = 0.8;
    this.paiEndSacale  = 0.7;
    this.daPaiScale    = 1;
    this.startPos      = 40;
    this.eatTagPos     = cc.p(400, 100);
    this.shouStartPos  = this.startPos;
    this.pengGroupLen  = 0;
    this.gangGroupLen  = 0;
    this.showPaiWidth  = 59;
    this.pengPaiWidth  = 40;
    this.endPaiWidth   = 36;
    this.endPaiHeight  = 44;
    this.getShouPaiPos = function(index){
        return cc.p(index * this.showPaiWidth + this.shouStartPos, 0);
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
    this.refreStartPos = function(pengGangData){
        this.pengGroupLen = pengGangData.peng.length * this.pengPaiWidth * 3.5 
        this.gangGroupLen = pengGangData.gang.length * this.pengPaiWidth * 3.5
        this.shouStartPos = this.pengGroupLen + this.gangGroupLen + this.startPos + 10
    },

    this.getGangPosList = function(groupIndex, gangPai){
        var gangPosList = [];
        var curGangLen  = groupIndex * this.pengPaiWidth * 3.5 + this.startPos;
        var addLen      = 0;
        var isFrist     = false;//旋转的是否第一个
        for(let i = 0; i< 3; i++){
            var pai = gangPai[i];
            var yPos= 0;
            var xPos=curGangLen - addLen;
            if(pai.rotate !== 0){
                isFrist     = (i === 0);
                var moveDis = isFrist ? 0 : 6
                xPos        += moveDis;
                yPos        -= 7;
                addLen      += this.pengPaiWidth * 1.2
            }else {
                addLen += this.pengPaiWidth;
            }
            gangPosList.push(cc.p(xPos, yPos));
        }
        //让第四张牌重贴在牌之间上面
        var cpIndex    = isFrist ? 1 : 0;
        var temPos     = gangPosList[cpIndex];
        gangPosList[3] = cc.p(temPos.x - 20, temPos.y + 6)
        return gangPosList;
    }
    this.getPengPaiPos = function(groupIndex, index, pai){
        if(index === 0){
            this.curPenLen = groupIndex * this.pengPaiWidth *3.5;
        }
        var xPos = this.startPos + this.gangGroupLen + this.curPenLen// index * this.pengPaiWidth;
        var yPos = 0;
        if(pai.rotate !== 0){
            var addLen = (index == 0) ? 0 : 6
            xPos += addLen;
            yPos -= 7;
            this.curPenLen += this.pengPaiWidth * 1.2; 
        }else {
            this.curPenLen += this.pengPaiWidth; 
        }
        xPos =  xPos;
        return cc.p(xPos, yPos);
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
};


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