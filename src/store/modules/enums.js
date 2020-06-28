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

export default {
    state: {
        platformEnums: JSON.parse(localStorage.getItem('platformEnums')) || [], // 平台枚举数据
        platformEnumsObj: JSON.parse(localStorage.getItem('platformEnumsObj')) || [], // 可直接通过key获取value
        enums: JSON.parse(localStorage.getItem('enums')) || [], // 库房枚举数据
        enumsObj: JSON.parse(localStorage.getItem('enumsObj')) || []
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
                commit('setEnums', tmp.arr)
                commit('setEnumsObj', tmp.obj)
                localStorage.setItem('enums', JSON.stringify(tmp.arr))
                localStorage.setItem('enumsObj', JSON.stringify(tmp.obj))
                tmp = null
            })
        }
    }
}