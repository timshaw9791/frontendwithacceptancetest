/* 枚举数据 */
import { bosEnums, bosEnumsPlatform } from "api/basic";

function fixEnums(enums) {
    let arr = enums.map(enumItem=>({name:enumItem.name,values:enumItem.values.map(item=>({value:item.chinese,key:item.name}))})),
        obj = arr.map(enumItem=>({name:enumItem.name,values:enumItem.values.reduce((result,now)=>{
                result[now.key] = now.value
                return result
            }, {})}))
    return {arr, obj}
}
// 默认的枚举数据
const initEnums = [{
        name: 'gender',
        values: [{value: '男', key: '男'}, {value: '女', key: '女'}]
    }, {
        name: 'device',
        values: [{value: '读写器', key: 'reader'}, {value: '手持机', key: 'handheld'}]
    }];
// 此处避免多次判断+访问localStorage导致性能问题
var platformEnums = localStorage.getItem('platformEnums'),
    platformEnumsObj = localStorage.getItem('platformEnumsObj'),
    enums = localStorage.getItem('enums'),
    enumsObj = localStorage.getItem('enumsObj');

export default {
    state: {
        platformEnums: platformEnums && JSON.parse(platformEnums) || [], // 平台枚举数据
        platformEnumsObj: platformEnumsObj && JSON.parse(platformEnumsObj) || [], // 可直接通过key获取value
        enums: enums && JSON.parse(enums) || [], // 库房枚举数据
        enumsObj: enumsObj && JSON.parse(enumsObj) || []
    },
    mutations: {
        setPlatformEnums(state, enums) {
            state.platformEnums = enums
        },
        setPlatformEnumsObj(state, enums) {
            state.platformEnumsObj = enums
        },
        setEnums(state, enums) {
            state.enums = enums
        },
        setEnumsObj(state, enums) {
            state.enumsObj = enums
        }
    },
    actions: {
        getAllEnums({commit}) {
            bosEnumsPlatform().then(res => {
                let tmp = fixEnums(res)
                commit('setPlatformEnums', tmp.arr)
                commit('setPlatformEnumsObj', tmp.obj)
                localStorage.setItem('platformEnums', JSON.stringify(tmp.arr))
                localStorage.setItem('platformEnumsObj', JSON.stringify(tmp.obj))
                tmp = null
            })
            bosEnums().then(res => {
                let tmp = fixEnums(res)
                tmp.arr = tmp.arr.concat(initEnums) // 加入默认的枚举数据
                commit('setEnums', tmp.arr)
                commit('setEnumsObj', tmp.obj)
                localStorage.setItem('enums', JSON.stringify(tmp.arr))
                localStorage.setItem('enumsObj', JSON.stringify(tmp.obj))
                tmp = null
            })
        }
    }
}