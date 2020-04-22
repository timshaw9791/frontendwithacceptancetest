<template>
    <div class="supplier-select-container">
        <div class="table">
            <define-table height="3.6458rem" :havePage="false" :highLightCurrent="true"
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
    import serviceDialog from "../base/serviceDialog/index"
    import defineTable from '@/componentized/entity/defineTable'
    import defineColumn from '@/componentized/entity/defineColumn'
    import textInput from '@/componentized/textBox/textInput.vue'

    export default {
        name: "supplierSelect",
        data() {
            return {
                supplierList: [{
                    name: "华安",
                    person: "陈晓红",
                    phone: "18122332222"
                }, {
                    name: "华安",
                    person: "陈晓红",
                    phone: "18122332222"
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
                this.$emit('select', {data: this.selected, ref: 'supplierSelect'});
            },
        },
        components: {
            serviceDialog,
            defineTable,
            defineColumn,
            textInput
        }
    }
</script>

<style lang="scss" scoped>
    .table {
        margin-top: 10px;
    }
    .footer {
        text-align: center;
    }
</style>