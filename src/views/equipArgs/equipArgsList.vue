<template>
    <div>
        <div class="equipArgs-info">
            <text-input label="装备名称" placeholder="请输入装备名称"></text-input>
            <base-button label="查询"></base-button>
            <base-button label="新增装备参数" @click="showFun()"></base-button>
        </div>
        <define-table :data="equipArgsList">
            <define-column label="操作" v-slot="{data}">
                <span @click="showFun(data.row)">详情</span>
                <span @click="showFun(data.row)">编辑</span>
            </define-column>
            <define-column label="装备名称" field="name"></define-column>
            <define-column label="装备型号" field="model"></define-column>
            <define-column label="供应商" field="supplier.name"></define-column>
            <define-column label="质保期" field="shelfLife"></define-column>
            <define-column label="充电周期" field="chargeCycle"></define-column>
            <define-column label="保养周期" field="upkeepCycle"></define-column>
        </define-table>
    </div>
</template>

<script>
    import {getEquipArgs} from "../../api/equipArgs";
    import textInput from "../../componentized/textBox/textInput";
    import myHeader from "../../components/base/header/header"
    export default {
        name: "equipArgsList",
        components:{
            textInput,
            myHeader
        },
        data(){
            return{
                equipArgsList:[],
            }
        },
        methods: {
            showFun(data){
                this.$emit('showFun',{
                    title:"新增装备参数",
                    isEdit:true,
                    haveBack:true,
                    equipArgs:data
                })
            }
        },
        created() {
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

</style>