/* 枚举数据 */
import { bosEnumsPlatform } from "api/basic";

export default {
    state: {
        platformEnums: JSON.parse(localStorage.getItem('platformEnums')) || [], // 平台枚举数据
        platformEnumsObj: JSON.parse(localStorage.getItem('platformEnumsObj')) || [], // 可直接通过key获取value
        enums: [], // 库房枚举数据
        enumsObj: []
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
                let tmp = res.map(enumItem=>({name:enumItem.name,values:enumItem.values.map(item=>({value:item.chinese,key:item.name}))})),
                    tmpObj = tmp.map(enumItem=>({name:enumItem.name,values:enumItem.values.reduce((result,now)=>{
                            result[now.key] = now.value
                            return result
                        }, {})}))
                commit('setPlatformEnums', tmp)
                commit('setPlatformEnumsObj', tmpObj)
                localStorage.setItem('platformEnums', JSON.stringify(tmp))
                localStorage.setItem('platformEnumsObj', JSON.stringify(tmpObj))
                tmp = tmpObj = null
            })
        }
    }
}