export let fetchMixin = {
    methods: {
        mutate(mutation, variables) {//声明手动修改的方法
            return this.$apollo.mutate({
                mutation: mutation,
                variables: variables,
            });
        },
        //便利方法，供在apollo:配置块中使用。设置好默认值，只要给一个query对象或者gql字符串即可
        //只限于list列表等需要分页的模块使用，且同一组件只能用一个
        gqlMutate(graphql, variables, sCallback) {//便利方法，用于手动修改数据的请求
            this.mutate(graphql, variables).then((data) => {
                if (data.errors) {   //未通过服务端的表单验证
                    this.$message.error(`${error}`);
                }
                else {//通过后返回数据，使用者可执行自定义处理数据
                    sCallback.call(this, data);
                }
            }).catch((error) => {
                this.$message.error(`${error}`);
            })
        }
    },
};
