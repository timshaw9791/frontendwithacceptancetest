/*
function outPutInfo(flag) {
    return flag ? true : "%s格式不正确";
}
export let extendRules = function (rules = {}) {
    if (Object.prototype.toString.call(rules) !== '[object Object]') throw new Error('extendRule variable need Object');
    __RULES__ = Object.assign({}, __RULES__, rules);
};
let __RULES__ = {
    //验证对象，如果通过则返回bool型的true，否则返回验证不通过的提示字符串，其中可以带%s，以便进一步处理。
    email(value) {
        return outPutInfo(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value));
    },
    mobile(value) {  //手机号码验证
        return outPutInfo(/^[1][3578]\d{9}$/.test(value))
    },
    tel(value) {   //座机号码验证
        return outPutInfo(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value))
    },
    cardId(value) {   //身份证验证
        return outPutInfo(/(^\d{15}$)|(^\d{17}(\d|x|X)$)/i.test(value))
    },
    integer(value) {  //整数验证
        return outPutInfo(/^-?[0-9]\d*$/.test(value))
    },
    decimal(value) {  //小数验证
        return outPutInfo(/^\d+\.*\d*$/.test(value))
    },
    require(value) {  //空字符串验证
        return outPutInfo(value && value !== '')
    },

};
*/


export let formRulesMixin = {
    data() {
        return {
            //设置分页参数，和默认值
            partialPiginator: {totalPages: 5, totalElements: 5},//默认值
            param: {paginator: {size: 10, page: 1}},//分页参数,
            copyNameLike: '',
            historyPage: 'History-Page',//存放当前页数
        }
    },
    computed: {
        paginator() {//获取分页信息
            return Object.assign({},
                this.partialPiginator,
                this.param.paginator
            );
        }
    },
    created() {
        this._initPage();
    },
    methods: {
       /* r(required) {//规则组合器
            var context = this;
            var add = function (trigger, checkerandtiparray) {
                var addItem = function (rule, errormsg, trigger) {
                    this.rules.push({checker: rule, required: this.defaultRequired, context, errormsg, trigger});
                }

                var tip = null, checker = null;
                for (var i = 0; i < checkerandtiparray.length; i++) {

                    if (typeof (checkerandtiparray[i]) == 'function') {
                        checker = checkerandtiparray[i];
                    } else {
                        tip = checkerandtiparray[i];
                    }
                    if (checker != null) {
                        addItem.call(this, checker, tip, trigger);
                        tip = null, checker = null;
                    }
                }
            };

            var ruler = {
                defaultRequired: false,//默认是不做必须校验要求
                rules: [],
                blur: function () {
                    add.call(this, 'blur', arguments);
                    return this
                },
                change: function () {
                    add.call(this, 'change', arguments);
                    return this
                },
                all: function () {
                    add.call(this, '', arguments);
                    return this
                },
                r: function (required) {
                    this.defaultRequired = !!required;
                    return this;
                }
            };
            return ruler.r(required);
        },*/
        _initPage() {
            //监听param变化，如果发生变化,刷新
            this.$watch("param",  ()=> {
                if (this.nameLike != this.copyNameLike && this.nameLike != ''){
                    if (this.param.paginator.page != 1) {
                        this.setHistoryPage(this.param.paginator.page);
                        this.param.paginator.page = 1
                    }
                } else if (this.nameLike != this.copyNameLike && this.nameLike == ''){
                    this.param.paginator.page = Number(this.getHistoryPage());
                }
                this.refetch();
                // console.log('11111',this.param)
                // if (this.param.namelike != this.copyNameLike && this.param.namelike == '%%') {
                //     this.param.paginator.page = Number(this.getHistoryPage());
                // }
            }, {deep: true});
        },
        getHistoryPage() {
            return sessionStorage.getItem(this.historyPage);
        },

        setHistoryPage(page) {
            sessionStorage.setItem(this.historyPage, page);
        },

        removeHistoryPage() {
            sessionStorage.setItem(this.historyPage, 1);
        },
        //路由处理信息
        routerPush(path, queryObject) {
            this.$router.push({path: path, query: queryObject});
        },
        routerBack() {
            this.$router.back();
        },
        changePage(page) {
            this.param.paginator.page = page;
            this.setHistoryPage(page);
        },
        callback(message) {
            this.$message.success(message);
            this.refetch();
        },
    },
};
