<template>
    <div>
        <form-container ref="form">
            <div class="equip-args-edit">
                <text-input label="装备名称" v-model="equipArgs.name"></text-input>
                <text-input label="装备型号" v-model="equipArgs.model"></text-input>
                <entity-input label="供应商" v-model="equipArgs.supplier"
                              :options="{search:'supplierSelect'}"
                              format="{name}"></entity-input>
                <text-input label="质保期" v-model="equipArgs.shelfLife"></text-input>
                <text-input label="充电周期" v-model="equipArgs.chargeCycle"></text-input>
                <text-input label="保养周期" v-model="equipArgs.upkeepCycle"></text-input>
            </div>
            <img-up @success="setImg" ></img-up>
            <div class="_box-bottom">
                <base-button label="取消" @click="clear()"></base-button>
                <base-button label="提交" @click="submit()"></base-button>
            </div>
        </form-container>
        <service-dialog @clear="showFun">

        </service-dialog>
    </div>
</template>


<script>
    import serviceDialog from "../../components/base/serviceDialog/index"
    import entityInput from "../../componentized/entity/entityInput";
    import textInput from "../../componentized/textBox/textInput";
    import imgUp from './imgUp';
    import defineInput from "../../componentized/textBox/defineInput";
    import {saveEquipArg} from "../../api/equipArgs"

    export default {
        name: "editEquipArgs",
        data() {
            return {
                equipArgs: {
                    name: '',
                    model: '',
                    supplier: {},
                    shelfLife: '',
                    chargeCycle: '',
                    upkeepCycle: '',
                    image:'',
                }
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
            setImg(data){
                this.equipArgs.image=data
            },
            clear() {

            },
            showFun() {
                this.$emit('showFun', {
                    title: "装备参数",
                    isEdit: false,
                    haveBack: false,
                    equipArgs: {}
                })
            },
            submit() {
                let tempForm = this.equipArgs
                this.$refs.form.restValidate(saveEquipArg, tempForm, (res) => {
                    this.$message.success("新增成功")
                    this.$emit('showFun', {
                        name: tempForm.name,
                        model: tempForm.model
                    })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .equip-args-edit {
        wdith: 60px,
    }
</style>