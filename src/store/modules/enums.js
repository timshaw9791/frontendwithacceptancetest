/* 枚举数据 */
import { bosEnumsPlatform } from "api/basic";

export default {
    state: {
        platformEnums: JSON.parse(localStorage.getItem('platformEnums')) || [], // 平台枚举数据
        enums: [], // 库房枚举数据
        platformEnumsObj: [], // 可直接通过key获取value
        enumsObj: []
    },
    mutations: {
        setPlatformEnums(state, enums) {
            state.platformEnums = enums
        },
        setEnums(state, enums) {
            state.enums = enums
        }
    },
    actions: {
        getAllEnums({commit}) {
            bosEnumsPlatform().then(res => {
                let tmp = res.map(enumItem=>({name:enumItem.name,values:enumItem.values.map(item=>({value:item.chinese,key:item.name}))}))
                commit('setPlatformEnums', tmp)
                localStorage.setItem('platformEnums', JSON.stringify(tmp))
            })
        }
    }
}