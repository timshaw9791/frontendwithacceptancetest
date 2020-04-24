<template>
    <div>
        <div>
            <div class="equip-args-edit">
                <text-input label="装备名称" v-model="equipArgs.name"></text-input>
                <text-input label="装备型号" v-model="equipArgs.model"></text-input>
                <text-input label="装备供应商" v-model="equipArgs.supplier.name"></text-input>
                <text-input label="装备供应商" v-model="equipArgs.supplier.name"></text-input>
                <text-input label="质保期" v-model="equipArgs.shelfLife"></text-input>
                <text-input label="充电周期" v-model="equipArgs.chargeCycle"></text-input>
                <text-input label="保养周期" v-model="equipArgs.upkeepCycle"></text-input>
            </div>
        </div>
        <div class="_box-bottom">
            <base-button @click="clear()"> 取消</base-button>
            <base-button @click="submit()"> 提交</base-button>
        </div>
    </div>
</template>


<script>
    import serviceDialog from "../../components/base/serviceDialog/index"
    import entityInput from "../../componentized/entity/entityInput";
    import textInput from "../../componentized/textBox/textInput";
    import imgUp from './imgUp';
    import defineInput from "../../componentized/textBox/defineInput";
    import saveEquipArg from ""

    export default {
        name: "editEquipArgs",
        data() {
            return {
                equipArgs: {},
                supplier: {},
                form: {},
                tempImage: false
            }
        },
        components: {
            textInput,
            serviceDialog,
            entityInput,
            imgUp,
            defineInput
        },
        methods: {
            equipNameSelected() {

            },
            equipSelected() {

            },
            successUp() {

            },
            clear() {

            },
            submit() {
                let tempForm = this.equipArgs
                this.restValidate(saveEquipArg, tempForm, (res) => {
                    this.$message.success("新增成功")
                    this.$emit('black', {
                        name: tempForm.name,
                        model: tempForm.model
                    })
                })
            },
            restValidate(func, variables, sCallback) {
                this.validate.then(() => {
                    let data = JSON.parse(JSON.stringify(variables));
                    func(data).then(res => {
                        sCallback(true)
                    }).catch(err => {
                        this.$message.error(err.response.data.message)
                    })
                }).catch(error => {
                    console.log("未通过检测");
                    this.$message.error("未通过检测")
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .equip-args-edit {
        wdith:60px,
    }
</style>