/* 枚举数据 */
import { bosEnums, bosEnumsPlatform } from "api/basic";

function fixEnums(enums) {
    let choice = enums.map(enumItem=>({name:enumItem.name,values:enumItem.values.map(item=>({value:item.chinese,key:item.name}))}))
            .reduce((res, cur) => Object.assign(res, {[cur.name]: cur.values}), {}),
        render = {};
    for (let key in choice) {
        render[key] = choice[key].reduce((res, cur) => Object.assign(res, {[cur.key]: cur.value}), {})
    }
    return {choice, render}
}
// 默认的枚举数据
const initEnums = [{
        gender: [{value: '男', key: '男'}, {value: '女', key: '女'}]
    }, {
        device: [{value: '读写器', key: 'reader'}, {value: '手持机', key: 'handheld'}]
    }];
// 此处避免多次判断+访问localStorage导致性能问题
var platformEnums = localStorage.getItem('platformEnums'),
    platformEnumsObj = localStorage.getItem('platformEnumsObj'),
    enums = localStorage.getItem('enums'),
    enumsObj = localStorage.getItem('enumsObj');

export default {
    state: {
        platformEnums: platformEnums && JSON.parse(platformEnums) || {}, // 平台枚举数据
        platformEnumsObj: platformEnumsObj && JSON.parse(platformEnumsObj) || {}, // 可直接通过key获取value
        enums: enums && JSON.parse(enums) || {}, // 库房枚举数据
        enumsObj: enumsObj && JSON.parse(enumsObj) || {}
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
                commit('setPlatformEnums', tmp.choice)
                commit('setPlatformEnumsObj', tmp.render)
                localStorage.setItem('platformEnums', JSON.stringify(tmp.choice))
                localStorage.setItem('platformEnumsObj', JSON.stringify(tmp.render))
                tmp = null
            })
            bosEnums().then(res => {
                let tmp = fixEnums(res)
                tmp.choice = Object.assign(tmp.choice, ...initEnums) // 加入默认的枚举数据
                commit('setEnums', tmp.choice)
                commit('setEnumsObj', tmp.render)
                localStorage.setItem('enums', JSON.stringify(tmp.choice))
                localStorage.setItem('enumsObj', JSON.stringify(tmp.render))
                tmp = null
            })
        }
    }
}