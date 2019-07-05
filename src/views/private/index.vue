<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs>
                    <el-button type="text" class="_textBt" @click="disabled=!disabled">
                        <svg-icon icon-class="编辑"/>
                        {{disabled?'编辑':'取消编辑'}}
                    </el-button>
                </tabs>
                <div class="privateInfo">
                    <div class="imgUp">
                        <imgUp :disabled="true" :image="imageUrl"></imgUp>
                    </div>
                    <form-container ref="form" :model="form" class="formList">
                        <field-input v-model="form.name" label="姓名 :" width="3" :disabled="true"></field-input>
                        <br/>
                        <field-input type="password" v-model="form.password" label="密码 :" width="3" :disabled="disabled"
                                     :rules="r(true).all(R.require)" prop="password"
                        ></field-input>
                        <br/>
                        <field-input v-model="form.phone" label="联系方式 :" width="3" :disabled="disabled"
                                     :rules="r(true).all(R.integer)" prop="phone"
                        ></field-input>
                    </form-container>
                </div>

                <div class="_box-bottom" v-if="!disabled">
                    <el-button @click="disabled=!disabled">取消</el-button>
                    <el-button type="primary" @click="pushButton">提交</el-button>
                </div>

            </div>
        </el-card>

    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import imgUp from 'components/base/axiosImgUp';
    import {imgBaseUrl} from "api/config";
    import {formRulesMixin} from "field/common/mixinComponent";

    export default {
        components: {
            tabs,
            imgUp
        },
        data() {
            return {
                form: {},
                disabled: true,
                imageUrl: '',
            }
        },
        mixins: [formRulesMixin],
        methods: {
            getList() {
                let data = JSON.parse(localStorage.getItem('user'));
                console.log(data);
                this.form = data;
                this.imageUrl = `${imgBaseUrl}${data.faceInformation}`;
            },
            pushButton() {

            }
        },
        mounted() {
            this.getList();
        }

    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

    .privateInfo {
        margin-top: 60px;
        display: flex;

        .imgUp {
            margin-left: 92px;
        }

        .formList {
            width: 80%;
            margin: 0 auto;
        }
    }
</style>