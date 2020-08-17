<template>
    <div class="equip-args-edit-container">
        <my-header :title="equipArgsID?'装备参数编辑':'装备参数新增'" :have-black="true" @h_black=back></my-header>
        <div class="body">
            <div class="equip-args-edit" disabled="isEdit">
                <define-input label="装备名称" v-model="formData.name"
                              margin="10px 10px 10px 10px"></define-input>
                <define-input label="装备型号" v-model="formData.model"
                              margin="10px 10px 10px 10px"></define-input>
                <entity-input label="供应商" v-model="formData.supplier"
                              :options="{search:'supplierSelect'}"
                              format="{name}"
                              margin="10px 10px 10px 10px"></entity-input>
                <date-input label="质保期（天）" v-model="formData.shelfLife"
                            margin="10px 10px 10px 10px"></date-input>
                <date-input label="充电周期（天）" v-model="formData.chargeCycle"
                            margin="10px 10px 10px 10px"></date-input>
                <date-input label="保养周期（天）" v-model="formData.upkeepCycle"
                            margin="10px 10px 10px 10px"></date-input>
            </div>
            <div class="img">
                <upload-file v-model="formData.image"></upload-file>
            </div>
            <div class="_box-bottom">
                <base-button label="取消" @click="back"></base-button>
                <base-button label="提交" @click="submit"></base-button>
            </div>
        </div>
    </div>
</template>


<script>
    // import serviceDialog from "../../components/base/serviceDialog/index"
    import entityInput from "../../componentized/entity/entityInput";
    import textInput from "../../componentized/textBox/textInput";
    // import defineInput from "../../componentized/textBox/defineInput";
    import {editEquipArgs, saveEquipArgs} from "@/api/equipArgs"
    import {getBosEntity} from "@/api/basic";
    import myHeader from "../../components/base/header/header"
    // import uploadFile from "../../componentized/uploadFile";

    export default {
        name: "editEquipArgs",
        data() {
            return {
                formData: {},
                equipArgsID:'',
            }
        },
        components: {
            textInput,
            // serviceDialog,
            entityInput,
            // defineInput,
            myHeader,
            // uploadFile
        },
        methods: {
            back() {
                this.$router.back()
            },
            submit() {
                if (this.isEdit) {
                    editEquipArgs(this.formData)
                } else {
                    saveEquipArgs(this.formData)
                }
                this.back()
            },
            fetchData() {
                getBosEntity(this.equipArgsID).then(res => {
                    this.formData = res
                })
            },
        },
        created() {
            let {id} = this.$route.query
            console.log(id)
            if (id) {
                this.equipArgsID = id
                this.isEdit = true
                this.fetchData()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .equip-args-edit {
        width: 80%;
        float: left;
    }

    .button {
        display: none;
    }

    .img {
        float: left;
    }

    .equip-args-edit-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 7px;
    }

</style>