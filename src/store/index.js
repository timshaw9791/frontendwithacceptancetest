import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger';
import app from './modules/app'
import user from './modules/user'
import customer from './modules/customer'
import getters from './getters'
import message from './modules/message'
import warehouse from './modules/warehouse'
import device from './modules/device'
import matchRouter from "./modules/matchRouter";
import enums from "./modules/enums"

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    modules: {
        app,
        user,
        customer,
        message,
        warehouse,
        device,
        matchRouter,
        enums
    },
    getters,
    // strict:debug,
    // plugins: debug ? [createLogger()] : []
});

export default store
