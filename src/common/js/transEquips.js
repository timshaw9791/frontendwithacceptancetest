import {formatFunc} from './index'
/*
* 
* equip 需要分组的装备列表
* groupRules 分组的规则数组类型 'state-locationInfo','state','locationInfo',''
*
* 返回 equipItems
*/
export  function transEquips(equips, groupRules='') {
    let rfids = [], tempEquipItems, equipItems
    // 添加equipName、equipModel、locationInfo 以便统一
    equips.forEach(item => {
        rfids.push(item.rfid)
        if (item.equipArg) {
            item.equipName = item.equipArg.name
            item.equipModel = item.equipArg.model
            item.locationInfo = item.location
        }
    })
    //  优化
    debugger
    console.log(equips)
    if(groupRules===''){
        tempEquipItems = _.groupBy(equips, item =>
            `${item.equipName}${item.equipModel}${item.state}`
        )
        equipItems = _.map(tempEquipItems, item => {
            return {
                equipArg: item[0].equipName + "(" + item[0].equipModel + ")",
                items: item,
                count: item.length,
            }
        })
    } else if (groupRules === 'state') {
        tempEquipItems = _.groupBy(equips, item =>
            `${item.equipName}${item.equipModel}${item.state}`
        )
        equipItems = _.map(tempEquipItems, item => {
            return {
                equipArg: item[0].equipName + "(" + item[0].equipModel + ")",
                state: item[0].state,
                items: item,
                count: item.length,
            }
        })
    } else if (groupRules === 'locationInfo') {
        tempEquipItems = _.groupBy(equips, item =>
            `${item.equipName}${item.equipModel}${item.locationInfo.frameNumber}${item.locationInfo.surface}${item.locationInfo.section}${item.locationInfo.floor}`
        )
        equipItems = _.map(tempEquipItems, item => {
            return {
                equipArg: item[0].equipName + "(" + item[0].equipModel + ")",
                locationInfo: formatFunc(item[0].locationInfo),
                items: item,
                count: item.length,
            }
        })
    } else {

        tempEquipItems = _.groupBy(equips, item =>
            `${item.equipName}${item.equipModel}${item.state}${item.locationInfo.frameNumber}${item.locationInfo.surface}${item.locationInfo.section}${item.locationInfo.floor}`
        )
        equipItems = _.map(tempEquipItems, item => {
                let tempLocation = formatFunc(item[0].locationInfo)
                return {
                    equipArg: item[0].equipName + "(" + item[0].equipModel + ")",
                    state: item[0].state,
                    locationInfo: tempLocation,
                    items: item,
                    count: item.length,
                }
            }
        )
    }
    return {
        equipItems: equipItems,
        rfids: rfids,
    }
}
