
const socket = {
    state: {
        message: null
    },
    mutations: {
        SET_MESSAGE: (state, message) => {
            state.message = message
        },
    }
};



export default socket

