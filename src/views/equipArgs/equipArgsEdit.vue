<template>
    <div class="equip-args-edit-container">
        <my-header title="装备参数编辑" :have-black="true" @h_black=back></my-header>
        <div class="body">
            <form-container ref="form">
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
                                  margin="10px 10px 10px 10px" ></date-input>
                    <date-input label="充电周期（天）" v-model="formData.chargeCycle"
                                  margin="10px 10px 10px 10px" ></date-input>
                    <date-input label="保养周期（天）" v-model="formData.upkeepCycle"
                                  margin="10px 10px 10px 10px" ></date-input>
                </div>
                <div class="img">
                    <img-up @success="setImg" :src="formData.image"></img-up>
                </div>
                <div class="_box-bottom">
                    <base-button label="取消" @click="clear()"></base-button>
                    <base-button label="提交" @click="submit()"></base-button>
                </div>
            </form-container>

        </div>
    </div>
</template>


<script>
    import serviceDialog from "../../components/base/serviceDialog/index"
    import entityInput from "../../componentized/entity/entityInput";
    import textInput from "../../componentized/textBox/textInput";
    import imgUp from './imgUp';
    import defineInput from "../../componentized/textBox/defineInput";
    import {editEquipArgs, saveEquipArgs} from "@/api/equipArgs"
    import {getBosEntity} from "@/api/basic";
    import myHeader from "../../components/base/header/header"
    import colorSelector from "../../components/base/colorSelector";

    export default {
        name: "editEquipArgs",
        data() {
            return {
                formData: {},
                equipArgsID: ""
            }
        },

        components: {
            textInput,
            serviceDialog,
            entityInput,
            imgUp,
            defineInput,
            myHeader
        },
        methods: {
            back() {
                this.$router.back()
            },
            setImg(data) {
                this.formData.image = data
            },
            clear() {
                this.$router.push({path: "equipArgsList"})
            },
            submit() {
                if (this.isEdit) {
                    editEquipArgs(this.formData).then((res) => {
                        this.$router.push({path: "equipArgsList"})
                    })
                } else {
                    saveEquipArgs(this.formData).then((res) => {
                        this.$router.push({path: "equipArgsList"})
                    })
                }
            },
            fetchData() {
                if (this.equipArgsID !== "") {
                    getBosEntity(this.equipArgsID).then(res => {
                        this.formData = res
                    });
                }
            },
            initData() {
                this.equipArgsID = this.$route.query.id
            }
        },
        created() {
            this.initData();
            this.fetchData()
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


</style>