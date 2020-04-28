<template>
    <div>
        <div class="equipArgs-container">
            <my-header :title=title :have-black="title!=='装备参数列表'" @h_black="back"></my-header>
            <div class="equipArgs-body">
                <equip-args-list v-if="showData.operation==='list'" :showData="showData"
                                 @showFun="showFun"></equip-args-list>
                <equip-args-edit v-else :showData=showData @showFun="showFun"></equip-args-edit>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from "../../components/base/header/header"
    import equipArgsEdit from "./equipArgsEdit";
    import equipArgsList from "./equipArgsList";
    import {getEquipArgs} from "../../api/equipArgs";

    export default {
        name: "equipArgs",
        components: {
            myHeader,
            equipArgsEdit,
            equipArgsList
        },
        data() {
            return {
                showData: {
                    operation: "list",
                    data: {}
                },
                title: "装备参数列表"
            }
        },
        methods: {
            //通过监听showFun对List还是Edit界面进行切换
            showFun(data) {
                this.showData = data
                switch (data.operation) {
                    case "add":
                        this.title = "新增装备参数"
                        break
                    case "edit": {
                        this.title = "编辑装备参数"
                        break
                    }
                    case "list": {
                        this.title = "装备参数列表"
                        break
                    }
                    case "info": {
                        this.title = '装备参数详情'
                        break
                    }
                }
            },
            back() {
                this.title = "装备参数列表"
                this.showData.operation = "list"
            },
        },
    }
</script>
<style lang="scss" scoped>
    .equipArgs-container {
        color: #707070FF;
        font-size: 16px;
    }
</style>