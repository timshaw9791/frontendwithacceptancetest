<template>
    <div>
        <form-container ref="form">
            <div class="equip-args-edit"  disabled="isEdit">
                <define-input label="装备名称" v-model="equipArgs.name" :disabled="isInfo" margin="10px 10px 10px 10px"></define-input>
                <define-input label="装备型号" v-model="equipArgs.model" :disabled="isInfo" margin="10px 10px 10px 10px"></define-input>
                <entity-input label="供应商" v-model="equipArgs.supplier"
                              :options="{search:'supplierSelect'}"
                              format="{name}" :disabled="isInfo"
                              margin="10px 10px 10px 10px"></entity-input>
                <define-input label="质保期" v-model="equipArgs.shelfLife" :disabled="isInfo" margin="10px 10px 10px 10px"></define-input>
                <define-input label="充电周期" v-model="equipArgs.chargeCycle" :disabled="isInfo" margin="10px 10px 10px 10px"></define-input>
                <define-input label="保养周期" v-model="equipArgs.upkeepCycle" :disabled="isInfo" margin="10px 10px 10px 10px"></define-input>
            </div>
            <img-up @success="setImg" :disabled="isInfo" :src="equipArgs.image"></img-up>
            <div class="_box-bottom">
                <base-button label="取消" :class="isInfo?'button':''"  @click="clear()" ></base-button>
                <base-button label="提交" :class="isInfo?'button':''" @click="submit()" ></base-button>
            </div>
        </form-container>
    </div>
</template>


<script>
    import serviceDialog from "../../components/base/serviceDialog/index"
    import entityInput from "../../componentized/entity/entityInput";
    import textInput from "../../componentized/textBox/textInput";
    import imgUp from './imgUp';
    import defineInput from "../../componentized/textBox/defineInput";
    import {saveEquipArg,editEquipArg} from "../../api/equipArgs"

    export default {
        name: "editEquipArgs",
        data() {
            return {
                equipArgs: {},
                isEdit: false,
                isInfo: false
            }
        },
        props: {
            showData: {
                type: Object,
                default: {
                    operation: "add",
                    data: null
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
            setImg(data) {
                this.equipArgs.image = data
            },
            showFun() {
                this.$emit('showFun', {operation: "list"})
            },
            submit() {
                let tempForm = this.equipArgs
                let equipArgsFun ;
                //通过isEdit判断是添加，还是编辑
                equipArgsFun=this.isEdit?editEquipArg:saveEquipArg
                this.$refs.form.restValidate(equipArgsFun, tempForm, (res) => {
                    this.$message.success("操作成功")
                    this.$emit('showFun', {
                        name: tempForm.name,
                        model: tempForm.model
                    })
                })
                this.showFun()
            }
        },
        mounted() {
            if (this.$props.showData.data !== undefined) {
                this.equipArgs = this.$props.showData.data
            }
            switch (this.$props.showData.operation) {
                case "info":
                    this.isInfo = true;
                    this.isEdit = false;
                    break
                case "edit": {
                    this.isEdit = true;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .equip-args-edit {
        wdith: 60px,
    }
    .button{
        display: none;
    }
</style>