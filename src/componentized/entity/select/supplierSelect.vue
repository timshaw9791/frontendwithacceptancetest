<template>
    <div class="supplier-select-container">
        <div class="table">
            <define-table height="400px" :havePage="false" :highLightCurrent="true"
                          :data="supplierList" @changeCurrent="changeCurrent">
                <define-column label="供应商名称" field="name"></define-column>
                <define-column label="联系人" field="person"></define-column>
                <define-column label="联系方式" field="phone"></define-column>
            </define-table>
        </div>

        <div class="footer">
            <base-button label="取消" type="none" @click="cancel"></base-button>
            <base-button label="确定" @click="select"></base-button>
        </div>
    </div>
</template>

<script>
    import textInput from '@/componentized/textBox/textInput.vue'
    import {getSupplier} from "api/supplier";

    export default {
        name: "supplierSelect",
        components: {
            textInput
        },
        data() {
            return {
                supplierList: [],
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
                this.$emit('select', {data: this.selected, ref: 'supplierSelect'});
            },
        },
        mounted() {
            getSupplier().then((res)=>{
               this.supplierList = res.content
            })
        }

    }
</script>

<style lang="scss" scoped>
    .table {
        margin-top: 10px;
    }
    .footer {
        margin-top: 20px;
        text-align: center;
    }
</style>