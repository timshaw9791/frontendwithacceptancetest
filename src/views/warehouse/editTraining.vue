<template>
    <view-container>
        <div style="margin:15px auto">
            <entity-input v-if="!this.$route.params.info.edit" v-model="order.equipArg" format="{name}({model})"
                          :options="{search:'equipArgsSelect'}"></entity-input>
            <entity-input v-else v-model="order.equipArg" format="{name}({model})" :disabled="true"
                          :options="{detail:'equipArgDetail'}"></entity-input>
        </div>
        <div>
            <upload-file label="文档" type="pdf" v-model="order.pdf.fileName[0]" margin="15px"></upload-file>
            <upload-file label="文档" type="pdf" v-model="order.pdf.fileName[1]" margin="15px"></upload-file>
            <upload-file label="文档" type="pdf" v-model="order.pdf.fileName[2]" margin="15px"></upload-file>
        </div>
        <div>
            <upload-file label="视频" type="video" v-model="order.video.fileName[0]" margin="15px"></upload-file>
            <upload-file label="视频" type="video" v-model="order.video.fileName[1]" margin="15px"></upload-file>
            <upload-file label="视频" type="video" v-model="order.video.fileName[2]" margin="15px"></upload-file>
        </div>
        <div class="buttom">
            <base-button label="提交" align="right" size="large" @click="submit"></base-button>
            <base-button label="取消" align="right" size="large" type="danger" @click="cansle"></base-button>
        </div>
    </view-container>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import uploadFile from '@/componentized/uploadFile'
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import {addTraining, editTraining} from "api/training";

    var _ = require("lodash");
    export default {
        name: "editTraining",
        data() {
            return {
                order: [],
                editflag: false,
                file: {
                    pdf: [],
                    video: []
                }
            };
        },
        methods: {
            cansle() {
                this.$router.go(-1)
            },
            submit() {
                if (JSON.stringify(this.order.equipArg) == "{}") {
                    this.$message.error("请选择装备参数")
                    return
                }
                let params = {
                    equipArg: this.order.equipArg,
                    fileName: "",
                    type: ""
                }
                Promise.all([this.video(), this.pdf()]).then(res => {
                    this.$router.go(-1)
                })

            },
            async video() {
                let params = {
                    equipArg: this.order.equipArg,
                    fileName: "",
                    type: ""
                }
                for (let i in this.order.video.fileName) {
                    if (this.order.video.fileName[i] != "") {
                        params.fileName = this.order.video.fileName[i]
                        params.type = "MP4"
                        if (this.$route.params.info.edit) {
                            if (i < this.order.video.id.length && this.order.pdf.id != []) {
                                await editTraining(this.order.video.id[i], params)
                            } else {
                                await addTraining(params)
                            }
                        } else {
                            await addTraining(params)
                        }
                    }
                }
            },
            async pdf() {
                let params = {
                    equipArg: this.order.equipArg,
                    fileName: "",
                    type: ""
                }
                for (let i in this.order.pdf.fileName) {
                    if (this.order.pdf.fileName[i] != "") {
                        params.fileName = this.order.pdf.fileName[i]
                        params.type = "pdf"
                        if (this.$route.params.info.edit) {
                            if (i < this.order.pdf.id.length && this.order.pdf.id != []) {
                                await editTraining(this.order.pdf.id[i], params)
                            } else {
                                await addTraining(params)
                            }
                        } else {
                            await addTraining(params)
                        }
                    }
                }
            }
        },
        created() {
            if (this.$route.params.info == undefined) {
                this.$message.info("数据丢失，返回教学培训");
                this.$router.push({name: 'warehouse/training'});
                return
            }
            this.order = this.$route.params.info.data
        },
        components: {
            myHeader,
            baseButton,
            entityInput,
            bosTabs,
            defineInput,
            serviceDialog,
            uploadFile
        },
    };
</script>

<style lang="scss" scoped>

    .editTraining-body {
        padding: 0 7px;
        widows: 100%;
    }

    .buttom {
        height: 72px;
        width: 100%;
        margin-top: 25px;
    }
</style>
