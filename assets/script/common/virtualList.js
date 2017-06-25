var log = require("utils").log;

var VirtualList = {
    New : function(mcList, isHorizontal, startIndex, touchZone, curIndex) {
        var action = {}; 
        //元件列表
        action._freeList = [];
        //是否横向滑动
        action._isHor = isHorizontal;
        //当前的索引
        action._curIndex = curIndex || 0;
        //所有的数据
        action._allItemList = [];
        //焦点位置
        action._startIndex = startIndex;
        //滑动速度
        action._moveSpeed = 0.5;
        //触摸区域
        action._touchZone = touchZone;
        //移动的相对距离 
        action._movingDis = 0
        //总共移动距离， 来的距离算回的距离也算
        action._allDis = 0;
        action._isMovedOnce = false;
        //当前dalet移动的距离
        action._curDtDis = 0;
        //item间的距离
        action._itemDis = 0;
        //右边能滑动到的最大索引
        action._rightMaxIndex = 0;
        //左边能滑动到的最小索引
        action._leftMinxIndex = 0;

        action._initAllItemList = function (len) {
            for (var i = 0; i < len; i++ ) {
                var item = {};
                item.obj = {};
                item._index = i;
                action._allItemList.push(item);
            }
        };
        
        action._initFreddList = function () {
            for (var i = 0; i < mcList.length; i++) {
                var item = {obj:mcList[i], _index:0 };
                action._freeList.push(item)
            }
        }();

        //绑定freelist对应的index 
        action._bindList = function() {
            action._curIndex = action._curIndex > (action._allItemList.length - 1) ? (action._allItemList.length - 1) : action._curIndex; //不越界
            action._curIndex = (action._curIndex < 0) ? 0 : action._curIndex;
           for(var index in action._freeList) {
            action._freeList[index]._index = action._curIndex -  action._startIndex  + parseInt(index)
                //action._freeList[index]._index 在 0 和 (action._allItemList.length - 1)的区间显示为true
                var isActive = (action._freeList[index]._index >= 0) ? 
                    ((action._freeList[index]._index > (action._allItemList.length - 1) ) ? false : true ) : false;
                action._freeList[index].obj.active = isActive;
                if (isActive === true && action.updateListItem !== undefined) {
                    //#1是显示的节点， #2在数据中对应的索引 #3在node中得索引
                    action.updateListItem(action._freeList[index].obj, action._freeList[index]._index + 1, index);
                }
           }
        };


        //求每个item之间的距离
        action._initItemDis = function () {
            var nextIndex = (action._startIndex == action._freeList.length) ? action._startIndex - 1 : action._startIndex + 1
            action._itemDis = (action._isHor === true) ? 
            (action._freeList[nextIndex].obj.x - action._freeList[action._startIndex].obj.x) : 
            (action._freeList[nextIndex].obj.y - action._freeList[action._startIndex].obj.y);
            action._itemDis = Math.abs(action._itemDis) * 0.8;
        }();

        //item点击事件
        action._initListTouch = function () {
            var registerItem = function(index) {
                action._freeList[index].obj.on("touchend", function (event) {
                    if (action.onListTouched !== undefined)  {
                        if (action._allDis < 20) {
                            action.onListTouched(action._freeList[index]._index);
                        }
                    }
                });

            }
            for (var i = 0; i < action._freeList.length; i++) {
                registerItem(i);
            };
        }();
        
        //回弹事件
        action._springback = function () {
            log("-_springback----");
            action.isSpringback = true;
            var backDis  = this._movingDis;
            

            var actDurtion = 0.3;
            for (let i = 0; i < action._freeList.length; i++) {
                    action.setObjPosByAnim(i, -backDis, actDurtion);
            };
            var callback = function() {
                if (action.onSpringBacked !== undefined) {
                    action.onSpringBacked();
                }
                
                action.isSpringback = false;
            }
            setTimeout(callback, actDurtion * 1000);
        }

        //移动事件
        action._initMoving = function() {
            var self = this;
            action._touchZone.on("touchmove", function (event) {
                action.movingList(event.touch.getDelta())
            });

            action._touchZone.on("touchend", function (event) {
                action.judeIsMoveOnceEnd(event);
                if (action.onTouchHitzoneEnd !== undefined) {
                    action.onTouchHitzoneEnd();
                }
            });

            action._touchZone.on("touchstart", function (event) {
                action._isMovedOnce = false;
                if (action.onTouchHitzoneStart !== undefined) {
                    action.onTouchHitzoneStart();
                    event.stopPropagationImmediate();
                }
            });

            action._touchZone.on("touchcancel", function(event) {
                action.judeIsMoveOnceEnd(event);
                if (action.onTouchHitzoneEnd !== undefined) {
                    action.onTouchHitzoneEnd();
                }
            } );
        }();
       
        
        //判断
        action.judeIsMoveOnceEnd = function(event) {
            if (Math.abs(action._movingDis) > 70 && !action._isMovedOnce) {
                if (action._movingDis < 0) {
                    action.gotoNextItem()
                }else {
                        action.gotPreItem()
                }
            }
            action._allDis = 0;
            action._movingDis = 0;
            
        }

        action.init = function (len, left, right) {
            action._initAllItemList(len);
            this._leftMinxIndex = (left !== undefined) ? left : 0
            this._rightMaxIndex = (right !== undefined) ? right : (this._allItemList.length - 1) 
            action._bindList();
        }

        action.gotoNextItem = function () {
            if (!action.isFootIndex()) {
                action._curIndex += 1;
                action._isMovedOnce = true;
                action._bindList();
            }
            
        }

        action.gotPreItem = function() {
            if (!action.isHeadIndex()) {
                action._curIndex -= 1;
                action._isMovedOnce = true;
                action._bindList();
            }
        }

        action.getCanMoveMaxDis = function() {
            return this._itemDis;
        }

        action.movingList = function(delat) {
            if (action.isSpringback ) {return};
            var dt = 0
            if (action._isHor) {
                dt = delat.x
            }else {
                dt = delat.y
            };
            action._allDis += Math.abs(dt);
            dt *= action._moveSpeed; 
            action._movingDis += dt;
            action._curDtDis = dt;
            if (!action.canMoveNext(dt)) {
                return
            }
            if (action.isCanChangeItem()) {
                if (this._movingDis < 0) {
                    this.gotoNextItem()
                }else {
                    this.gotPreItem()
                }
                this.moveAllItem(-action._movingDis + action._curDtDis);
                action._movingDis = 0;
            }else
            {
                this.moveAllItem(action._curDtDis);
            }
            
        }

        action.setSpeed = function (speed) {
            this._moveSpeed = speed;
        }
        action.moveAllItem = function(dis) {
            for (var i = 0; i < action._freeList.length; i++) {
                action.setObjPos(i, dis)
            };
        }
                
        //重置滑动数据
        action.resetMoveData = function(dt) {
            action._movingDis -= dt;
            action._curDtDis = 0;
        }

        //是否可以移动
        action.canMoveNext = function (dt) { 
            if (action.isHeadIndex() && 
                action._movingDis > 0  ) {
                action.resetMoveData(dt);
                return false
            } 
            if (action.isFootIndex() && 
                action._movingDis < 0) {
                action.resetMoveData(dt);
                return false
            }  
            return true;
        }

        //当前移动的距离是否达到切换item
        action.isCanChangeItem = function () {
            return (Math.abs(this._movingDis) > this._itemDis)
        }

        action.getCurIndex = function() {
            return action._curIndex;
        }

        action.isHeadIndex = function() {
            return (this._curIndex === this._leftMinxIndex);
        }

        action.isFootIndex = function() {
            return (this._curIndex === (this._rightMaxIndex - 1));
        }
        
        action.setObjPos = function (objIndex, dt) {
            action._freeList[objIndex].obj.x += dt;
        }

        action.setObjPosByAnim = function(objIndex, dt, actDurtion) {
            //Node 不在ative时 不会执行moveAnim
            if (action._freeList[objIndex].obj.active) {
                var moveAnim = cc.moveBy(actDurtion, cc.p(dt, 0));
                //moveAnim.easing(cc.easeQuinticActionIn());
                action._freeList[objIndex].obj.runAction(moveAnim);
            }else {
                 action.setObjPos(objIndex, dt);
            }
            
        }

        return action; 
    },
}

module.exports = VirtualList;