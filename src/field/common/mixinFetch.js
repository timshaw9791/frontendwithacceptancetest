export let fetchMixin = {
    methods: {
        query(query, variables) {
            return this.$apollo.query({//声明手动查询的方法
                query: query,
                variables: variables,
            });
        },
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
                    this.$message.error(`${data.errors}`);
                }
                else {//通过后返回数据，使用者可执行自定义处理数据
                    sCallback.call(this, data);
                }
            }).catch((error) => {
                this.$message.error(`${error}`);
            })
        },
        gqlMutateLoad(graphql, variables, sCallback, failCallback) {
            this.mutate(graphql, variables).then(data => sCallback(data)).catch(err => failCallback())
        },
        gqlQuery(graphql, variables, sCallback, defult) {//便利方法，用于手动修改数据的请求
            this.query(graphql, variables).then((data) => {
                if (data.errors) {   //未通过服务端的表单验证
                    /*this.$message.error(`${data.errors}`);*/
                }
                else {
                    let defultData = data;
                    if (defult) {//判断是否使用默认格式数据，否或不输defult则为使用原始数据
                        //将数据处理为默认格式,即返回content里的数据
                        var deepclonedata = JSON.parse(JSON.stringify(data.data));
                        var jqlname = Object.keys(deepclonedata)[0];
                        var result = deepclonedata[jqlname];
                        defultData = !result ? null : (result.hasOwnProperty('content') ? result.content : result);
                    }
                    sCallback.call(this, defultData);//返回数据使用者可执行自定义处理数据
                }
            }).catch((error) => {//服务器错误或者网络状态问题
                this.$message.error(`${error}`);
            })
        },
        getQuery(api,value,name){
            let promise=new Promise((resolve)=>{
                this.gqlQuery(api, value, (res) => {
                    if (res.data[name].content.length > 0) {
                        resolve(
                            JSON.parse(JSON.stringify(res.data[name].content))
                        );
                    }
                });
            });
            return promise
        }
    }
};
