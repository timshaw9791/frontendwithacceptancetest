const message = {
    state: {
        unreadCount: 0
    },
    mutations: {
        setUnreadCount(state, count) {
            state.unreadCount = count;
        }
    }
}

export default message