<template>
    <div>
        <div class="equipArgs-info">
            <text-input label="装备名称" placeholder="请输入装备名称"></text-input>
            <base-button label="查询"></base-button>
            <base-button label="新增教学培训" @click="showFun('add')"></base-button>
        </div>
        <define-table :data="equipArgsList" >
            <define-column label="操作" v-slot="{data}">
                <span @click="showFun('info',data.row)">详情</span>
                <span @click="showFun('edit',data.row)">编辑</span>
            </define-column>
            <define-column label="装备名称" field="name"></define-column>
            <define-column label="装备型号" field="model"></define-column>
            <define-column label="教学视频" field="model"></define-column>
            <define-column label="教学文档" field="model"></define-column>
        </define-table>
    </div>
</template>

<script>
    import {getEquipArgs} from "../../api/equipArgs";
    import textInput from "../../componentized/textBox/textInput";
    import myHeader from "../../components/base/header/header"
    import {imgBaseUrl} from "../../api/config"

    export default {
        name: "equipArgsList",
        components: {
            textInput,
            myHeader
        },
        props:{
            showData:{
                type:Object
            }
        },
        data() {
            return {
                equipArgsList:[],
                imgBaseUrl: imgBaseUrl,
            }

        },
        methods: {
            showFun(operation, data) {
                this.$emit('showFun', {
                    operation: operation, data: data
                })
            }
        },
        //监听数据、自动刷新
        watch:{
            showData:{
                deep:true,
                function () {
                    this.equipArgsList = this.$props.showData.data
                }
            }
        },
        mounted() {
            getEquipArgs().then(res => {
                this.equipArgsList = res.content
            })
        }
    }
</script>

<style lang="scss" scoped>
    .equipArgs-info {
        padding: 16px 7px;
        overflow: hidden;
    }

    .img {
        height: 30px;
        width: 30px;
    }
</style>