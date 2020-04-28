<template>
    <div>


            <div class="equipArgs-body">
                <receive-order-list v-if="showData.operation==='list'" :showData="showData"
                                    @showFun="showFun"></receive-order-list>
                <receive-order-info v-else :showData=showData @showFun="showFun"></receive-order-info>
            </div>
        </div>
    </div>
</template>

<script>
    import receiveOrderList from "./receiveOrderList"
    import myHeader from "../../../components/base/header/header"
    import receiveOrderInfo from "./receiveOrderInfo"
    import {getEquipArgs} from "../../../api/equipArgs";

    export default {
        name: "receiveOrder",
        components: {receiveOrderList, receiveOrderInfo,myHeader},
        data() {
            return {
                showData: {
                    operation: "list",
                    data
                }
            }
        },
        methods: {
            //通过监听showFun对List还是Edit、Info界面进行切换
            showFun(data) {
                this.showData = data
                switch (data.operation) {
                    case "list": {
                        this.title = "领取单列表"
                        getEquipArgs().then(res => {
                            console.log(this)
                            this.showData.data = res.content
                        })
                        break
                    }
                    case "info": {
                        this.title = '领取单详情'
                        break
                    }
                }

            },
            back() {
                this.title = "领取单列表"
                this.showData.operation = "list"
                getEquipArgs().then(res => {
                    console.log(this)
                    this.showData.data = res.content
                })
            }
        }
    }
</script>

<style scoped>

</style>