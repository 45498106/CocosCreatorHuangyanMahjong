var log = require("utils").log;

//因为兼容item是否可以点开，所有prefab Item 分为两层， 一层为unChecked 一层为checked 
//如果不能展开, checked可以没有
var BoxList = {
    New : function (listNode,  prefab, isHorizontal, totalCount, screenItemCount, isCanExtend) {
        var list = {};
        //显示list的scrollview node
        list._listNode         = listNode;
                               //每一个item的prefab
        list.prefab            = prefab;
                               //总共的item数
        list.totalLen          = totalCount;
        list.content           = list._listNode.content;
        list.minContentHeight  = isHorizontal ? list.content.width : list._listNode.node.height;
        list.minContentHeight  += 20;
        list.bufferZone        = isHorizontal ? list._listNode.node.width : list._listNode.node.height;
        list.items             = [];
                               //每一个item的空隔
        list.itemSpace         = 20;
        list.updateTime        = 0;
        list.updateInterval    = 0.1;
        list.isCanExtend       = isCanExtend;
        list.lastContentPosY   = 0;
        list.offset            = 0;
                               //扩展items列表
        list.extendItemList    = [];
                               //扩展的高度
        list.itemExtendHeight  = 0;
                               //默认的高度
        list.itemDefaultHeight = 0;
                               //是否进行了移动
                               //触摸移动的距离 
        //列表方向
        var isHorizontal = isHorizontal;

        list.updateItem = function (itemPre) {
            log(itemPre)
            if (this.updateItemData !== undefined) {
                this.updateItemData(itemPre)
            }
            if (list.isCanExtend) {
                itemPre.obj.getChildByName("checked").active = list.extendItemList[itemPre._dataIndex];
                itemPre.obj.getChildByName("unChecked").active = !(list.extendItemList[itemPre._dataIndex]);
            }
        }

        list._initExtendItemList = function() {
            for (var i = 0; i < list.totalLen; i++) {
                list.extendItemList[i] = false;   
            }
        }();

        list.clearAllItem  =  function() {
            if (!list.content) {return}
            for(var key in list.content.children) {
                if (list.content.children[key]) {
                    list.content.children[key].destroy();
                }
            }
        }

        list.getTargetObj = function(index) {
            if (!list.items[index]) {return}
            return list.items[index].obj;
        }

        list.initItems = function () {
            //content的总长度
           // var prefabDefaultHeigth = list.prefab.getChild
            list.clearAllItem();
            var itemDefaultHeight = 0;
            for (let index = 0; index < list.totalLen; ++index) { 
                let i = index;
                let item = cc.instantiate(list.prefab);
                itemDefaultHeight = itemDefaultHeight || 
                    (isHorizontal ? item.getChildByName("unChecked").width : item.getChildByName("unChecked").height)
                list.content.addChild(item);
                if (isHorizontal) {
                    item.setPosition( -itemDefaultHeight * (i + 0.5) - list.itemSpace * (i + 1), 0);
                }
                else {
                    item.setPosition(0, -itemDefaultHeight * (i ) - list.itemSpace * (i + 1));
                }
                
                item.on("touchend", function(event) {
                    if (list.onItemSelected !== undefined) {
                        list.onItemSelected(list.items[i]);
                        
                    }
                });
                let childItem = {obj:item, _dataIndex:i}
                this.updateItem(childItem);
                list.items.push(childItem)

            }
            if(list.isCanExtend) {
                list.itemExtendHeight = isHorizontal ? list.items[0].obj.getChildByName("checked").width : 
                    list.items[0].obj.getChildByName("checked").height
            }
            else
            {
                list.itemExtendHeight = itemDefaultHeight
            }
            list.itemDefaultHeight = itemDefaultHeight
            list.setContentHeight();
        };

        list.extendItems = function (_extendIndex) {
            //不能支持展开
            if (!list.isCanExtend) {return}
            //此项已经是展开状态
            if (list.extendItemList[_extendIndex]) {return}
            list.extendItemList[_extendIndex] = true;
            log(list.extendItemList)
            for (let i = 0; i < list.items.length; i++) {
                if(list.items[i]._dataIndex > _extendIndex) {
                    list.items[i].obj.y -= (list.itemExtendHeight - list.itemDefaultHeight); 
                }
                if (list.items[i]._dataIndex == _extendIndex) {
                    let obj = list.items[i].obj;
                    obj.getChildByName("checked").active = true;
                    obj.getChildByName("unChecked").active = false;
                }
            };
            list.setContentHeight();
        }

        list.setContentHeight = function () {
            var totalHeight = 0;
            for (let i = 0; i < list.extendItemList.length; i++) {
                if (list.extendItemList[i]) {
                    totalHeight += list.itemExtendHeight;
                }
                else{
                    totalHeight += list.itemDefaultHeight;
                }
            }
            var curHeight = (list.totalLen + 1) * list.itemSpace  + totalHeight;
            curHeight = list.minContentHeight > curHeight  ? list.minContentHeight : curHeight;
            if (isHorizontal) { 
                list.content.width = curHeight;
            }else {
                list.content.height = curHeight;
            }
            var offset = 0
            for (let i = 0; i < list.items.length; i++) {
                if (list.extendItemList[list.items[i]._dataIndex]) {
                    offset += list.itemExtendHeight ;
                }
                else {
                    offset += list.itemDefaultHeight;
                }
            }
            list.offset = list.items.length * list.itemSpace + offset;
        }
        
        list.refreTargeIndex = function(index) {
            list.updateItem(list.items[index]);
        }

        list.getPositionInView =  function(item) {
            let worldPos = item.parent.convertToWorldSpaceAR(item.position);
            let viewPos = list._listNode.node.convertToNodeSpaceAR(worldPos);
            return viewPos
        }
        //更新数据
        list.update = function(dt) {

            list.updateTime += dt;
            if (list.updateTime < list.updateInterval) {return;}
            list.updateTime = 0;
           //能展开就不能使用循环
           if (list.isCanExtend) {return}
            let items = list.items;
            let buffer = list.bufferZone;
           //let buffer = 900;
            let isDown = list._listNode.content.y < list.lastContentPosY; // scrolling direction
            for (let i = 0; i < items.length; ++i) {
                let viewPos = list.getPositionInView(items[i].obj);
                if (isDown) {
                    // if away from buffer zone and not reaching top of content
                    if (viewPos.y < -buffer ) {
                        if (items[i]._dataIndex - items.length >= 0) {
                            items[i]._dataIndex -= items.length;
                            if(isHorizontal) {
                                items[i].obj.setPositionX(items[i].obj.x + list.offset );
                            }else {
                                items[i].obj.setPositionY(items[i].obj.y + list.offset );
                            }
                            list.updateItem(items[i])
                        }
                    }
                } else {
                    // if away from buffer zone and not reaching bottom of content
                    if (viewPos.y > buffer ) {
                        if (items[i]._dataIndex + items.length < list.totalLen ) {
                            if (isHorizontal) {
                                items[i].obj.setPositionX(items[i].obj.x - list.offset );
                            }else {
                                items[i].obj.setPositionY(items[i].obj.y -list.offset );
                            }
                            items[i]._dataIndex += items.length;
                            list.updateItem(items[i])
                        } 
                    }
                }
                
            }
            list.lastContentPosY = isHorizontal ? list._listNode.content.x : list._listNode.content.y;
        }
        return list;
    }, 
}

module.exports = BoxList; 