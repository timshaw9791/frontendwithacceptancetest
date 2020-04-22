<template>
    <div class="equipSelect-select-container">
        <div class="table">
            <define-table height="3.6458rem" :havePage="false" :highLightCurrent="true"
                          :data="equipParams" @changeCurrent="changeCurrent">
                <define-column label="装备名称" field="name"></define-column>
                <define-column label="装备型号" field="model"></define-column>
                <define-column label="供应商" field="supplier.name"></define-column>
                <define-column label="质保期" field="shelfLife"></define-column>
                <define-column label="充电周期" field="chargeCycle"></define-column>
                <define-column label="保养周期" field="upkeepCycle"></define-column>
            </define-table>
        </div>

        <div class="footer">
            <base-button label="取消" type="none" @click="cancel"></base-button>
            <base-button label="确定" @click="select"></base-button>
        </div>
    </div>
</template>

<script>
    import serviceDialog from "../base/serviceDialog/index";
    import textInput from "../../componentized/textBox/textInput";
    export default {
        name: "equipParamSelect",
        data() {
            return {
                equipParams:[{
                    id:"1",
                    name:"手电筒",
                    model:"model1",
                    supplier:{
                        id:"a",
                        name:"a",
                        person:"a",
                        phone:"a",
                    },
                    shelfLife:"2",
                    chargeCycle:"2",
                    upkeepCycle:"1"
                }],
                selected:""
            }
        },
        methods: {
            changeCurrent(data) {
                this.selected = data
            },
            cancel() {
                this.$emit('cancel');
            },
            select() {
                this.$emit('select', {data: this.selected, ref: 'equipParamSelect'});
            },
        },
        components: {

        }
    }
</script>

<style scoped>

</style>

