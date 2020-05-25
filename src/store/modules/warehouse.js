export default {
    state: {
        organUnit: {},
        warehouse: {}
    },
    mutations: {
        setOrganUnit(state, info) {
            state.organUnit = info;
        },
        setWarehouse(state, info) {
            state.warehouse = info;
        }
    }
}