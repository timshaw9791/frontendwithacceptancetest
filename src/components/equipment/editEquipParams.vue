<template>
    <div class="edit-equipParams-container">
        <service-dialog ref="equipParams">
            <form-container>
                <div class="equipParams-info">
                    <text-input label="装备名称" v-model="equipParams.name"></text-input>
                    <text-input label="装备型号" v-model="equipParams.model"></text-input>
                    <text-input label="质保期" v-model="equipParams.shelfLife"></text-input>
                </div>
                <div class="equipParams-info">
                    <text-input label="充电周期" v-model="equipParams.chargeCycle"></text-input>
                    <text-input label="保养周期" v-model="equipParams.chargeCycle"></text-input>
                    <entity-input v-model="supplier" format="{name}{person}"
                                  :options=" {search:'supplierSelect'}"></entity-input>
                </div>
            </form-container>
        </service-dialog>
    </div>
</template>


<script>

    import serviceDialog from "../../components/base/serviceDialog"
    import entityInput from "../../componentized/entity/entityInput";
    import TextInput from "../../componentized/textBox/textInput";
    import upFile from "../../componentized/upFile"

    export default {
        name: "editEquipParams",
        data() {
            return {
                equipParams: {
                    name: "",
                    model: "",
                    supplier: "",
                    shelfLife: "",
                    chargeCycle: ""
                },
                supplier: {
                    name: "",
                    person: "",
                    phone: ""
                }
            }
        },
        components: {
            TextInput,
            serviceDialog,
            entityInput,
            upFile,

        },
        methods: {
            show() {
                this.$refs.equipParams.show()
            },

        }
    }
</script>

<style lang="scss" scoped>
    .equipParams-info {
        padding: 16px 7px;
        overflow: hidden;
    }

</style>