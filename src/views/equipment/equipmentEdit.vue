<template>
    <view-container>
            <div class="edit-equip">
                <div class="equip-params">
                    <define-input label="装备名称" v-model="editList.equipArg.name" :disabled="true" margin="0 0"
                                  :column="6" align="left"/>
                    <define-input label="装备型号" v-model="editList.equipArg.model" :disabled="true" margin="0 0"
                                  :column="6" align="right"></define-input>
                    <define-input label="质保期(天)" v-model='editList.equipArg.shelfLife' margin="15px 0" :disabled="true"
                                  :column="6" align="left"></define-input>
                    <define-input label="充电周期(天)" v-model='editList.equipArg.chargeCycle' margin="15px 0"
                                  :disabled="true" :column="6" align="right"></define-input>
                    <define-input label="保养周期(天)" v-model='editList.equipArg.upkeepCycle' margin="15px 0"
                                  :disabled="true" :column="6" align="left"></define-input>
                    <define-input label="供应商" v-model="editList.equipArg.supplier.name" margin="15px 0" :disabled="true"
                                  :column="6" align="right"></define-input>
                    <define-input label="RFID" v-model="editList.rfid" :disabled="true" margin="15px 0" :column="6"
                                  align="left"></define-input>
                    <define-input label="装备序号" v-model="editList.serial" :disabled="true" margin="15px 0" :column="6"
                                  align="right"></define-input>
                    <entity-input label="装备位置" v-model="editList.location" :column="6" margin="0 0"
                                  :options="{search:'locationSelect'}" :formatFunc="$formatFuncLoc" :disabled="true"
                                  align="left"></entity-input>
                    <define-input label="装备单价" v-model="editList.price" type="Number" :disabled="false" margin="15px 0"
                                  :column="6" align="right"></define-input>
                    <date-select label="生产日期" v-model="editList.productDate" :column="6" margin="15px 0"
                                 align="left"></date-select>
                </div>
                <div class="img-box">
                    <img :src="imageUrl" style="width:200px;height:200px" >
                    <!-- <imgUp @success="successUp" :disabled="true" :image="imageUrl"
                                   :noImg="noImg"  ></imgUp> -->
                </div>

            </div>
            <tool-bar >
                <base-button label="取消" type="text" slot="button"
                             @click="cancel"></base-button>
                <base-button label="提交" type="text" slot="button"
                             @click="confirm"></base-button>
            </tool-bar>

    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import {imgUpUrl, pdfUpUrl, videoUpUrl, imgBaseUrl, pdfBaseUrl, videoBaseUrl} from "api/config";
    import imgUp from 'components/base/axiosImgUp';
    import {getInhouseNumber, equipsToNew} from "api/storage"

    export default {
        components: {
            myHeader,
            defineInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            bosTabs,
            imgUp
        },
        data() {
            return {
                requestBody: '',
                noImg: false,
                imageUrl: '',
                editList: {},
                noImgUrl: "'this.src='"+ require('@/assets/noImg.png')+"'"
            }
        },
        methods: {
            cancel() {
                this.$router.back()
            },
            successUp(data) {
                this.editList.equipArg.image = data
            },
            confirm() {//提交装备信息
                console.log(this.editList.location);
                this.editList.location.location != null ? this.editList.location = this.editList.location.location : this.editList.location = this.editList.location
                equipsToNew(this.editList.id, this.editList).then(res => {
                    this.$message.success('编辑装备信息成功')
                    this.cancel()
                }).catch(err => {
                    this.$message.error(err.response.data.message)
                })
            },
        },
        created() {
            this.requestBody = this.$route.query.data
            this.editList = this.$route.query.data
            if (this.editList.equipArg.image) {
                this.imageUrl = `${imgBaseUrl}${this.editList.equipArg.image}`;
            } else {
                this.imageUrl = '';
                this.noimg = true;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .edit-equip {
        height: 400px;
        width: 7rem;
        border: 1px solid rgba(112, 112, 112, 0.13);
        margin-left: 100px;

        .equip-params {
            width: 5rem;
            height: 400px;
            float: left;
        }

        .img-box {
            width: 200px;
            float: left;
            margin-top: 50px;
            margin-left: 0.325rem;
        }

    }
</style>