export default {
    state: {
        config: {}
    },
    getters: {
        getConfig(state) {
            return state.config
        }
    },
    mutations: {
        setConfig(state, config) {
            state.config = Object.assign(state.config, config);
        }
    }
}