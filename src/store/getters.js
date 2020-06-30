const getters = {
    customerList: state => state.customer.list,
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    matchRouters: state => state.matchRouter.routers,
    userId: state => state.user.userId,
    userInfo: state => state.user.userInfo,
    unreadCount: state => state.message.unreadCount,
    warehouse: state => state.warehouse.warehouse,
    organUnit: state => state.warehouse.organUnit,
    platformEnums: state => state.enums.platformEnums,
    platformEnumsObj: state => state.enums.platformEnumsObj,
    enums: state => state.enums.enums,
    enumsObj: state => state.enums.enumsObj
}
export default getters
