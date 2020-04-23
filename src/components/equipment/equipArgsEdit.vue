<template>
    <div class="edit-equipArgs-container">
        <service-dialog ref="equipArgs">
            <form-container>
                <div class="equipArgs-info">
                    <text-input label="装备名称" v-model="equipArgs.name"></text-input>
                    <text-input label="装备型号" v-model="equipArgs.model"></text-input>
                    <text-input label="质保期" v-model="equipArgs.shelfLife"></text-input>
                </div>
                <div class="equipArgs-info">
                    <text-input label="充电周期" v-model="equipArgs.chargeCycle"></text-input>
                    <text-input label="保养周期" v-model="equipArgs.chargeCycle"></text-input>
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
        name: "editequipArgs",
        data() {
            return {
                equipArgs: {},
                supplier: {}
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
                this.$refs.equipArgs.show()
            },

        }
    }
</script>

<style lang="scss" scoped>
    .equipArgs-info {
        padding: 16px 7px;
        overflow: hidden;
    }

</style>