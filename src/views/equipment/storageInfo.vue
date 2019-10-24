<template>
    <div>
        <el-card shadow="never" :body-style="{ padding:'0'}">
            <div slot="header" class="header">
                <span class="_card-title">{{title}}</span>
                <div class="black" @click="black">
                <svg-icon icon-class="返回" class="svg-info"></svg-icon>
                <span v-text="'返回'"></span>
            </div>
            </div>
            <div>

                <!--装备参数-->
                <el-card class="box-card" shadow="never">
                    <div slot="header">
                        <span>装备参数</span>

                        <el-button type="text" class="topIcon" @click="$refs.copyRfidDialog.show()"
                                   v-if="title.includes('装备查看')">
                            <svg-icon icon-class="加"/>
                            复制RFID
                        </el-button>


                        <el-button type="text" class="topIcon" @click="edit=!edit" v-if="title.includes('装备查看')">
                            <svg-icon icon-class="编辑"/>
                            {{edit?'编辑':'取消编辑'}}
                        </el-button>


                        <el-button type="text" class="topIcon" @click="editClick"
                                   v-if="title.includes('信息查看')">
                            <svg-icon icon-class="编辑"/>
                            {{edit?'编辑':'取消编辑'}}
                        </el-button>
                    </div>
                    <div class="box-body">
                        <div class="imgUp">
                            <imgUp @success="successUp" :disabled="disabled"
                                   :image="imageUrl" :upload="title.includes('入库')?false:true" :noimg="noimg"></imgUp>

                        </div>
                        <form-container ref="form" :model="form" class="formList">
                            <field-cascader label="装备名称" :options="options" v-model="form.nameId" prop="nameId"
                                            width="3" :rules="r(true).all(R.require)"
                                            v-if="title.includes('入库')"
                                            @change="getEquipInfo(form.nameId[2])">
                            </field-cascader>

                            <field-input v-model="form.price" label="装备单价" width="3"
                                         :rules="r(true).all(R.digital)" prop="price"
                                         v-if="title.includes('入库')"></field-input>


                            <field-input v-model="form.eqBig" label="装备类型" width="3" :disabled="disabled||edit"
                                         name="大类"
                                         v-if="title.includes('装备查看')||(title.includes('信息查看')&&edit)"></field-input>

                            <field-input v-model="form.price" label="装备单价" width="3"
                                         :disabled="disabled"
                                         :rules="r(true).all(R.digital)" prop="price"
                                         v-if="title.includes('装备查看')"></field-input>


                            <field-input v-model="form.eqSmall" label="装备小类" width="3" :disabled="disabled||edit"
                                         name="小类"
                                         v-if="title.includes('装备查看')||(title.includes('信息查看')&&edit)"></field-input>


                            <field-input v-model="form.name" label="装备名称" width="3" :disabled="disabled||edit"
                                         :rules="r(true).all(R.require)" prop="name"></field-input>

                            <field-input v-model="form.model" label="装备型号" width="3" :disabled="disabled||edit"
                                         :rules="r(true).all(R.require)" prop="model"></field-input>

                             <field-input v-model="form.serial" label="装备序号" width="3" :disabled="disabled||edit"   
                                        v-if="title.includes('装备查看')"
                                        :rules="form.serial!==null?r(true).all(R.integer):''" prop="serial"></field-input>
                            

                            <field-input v-model="form.upkeepCycle" label="保养周期/天" width="3"
                                         :rules="r(true).all(R.integer)" prop="upkeepCycle"
                                         :disabled="disabled||edit"
                            ></field-input>
                            <field-input v-model="form.chargeCycle" label="充电周期/天" width="3"
                                         :rules="r(true).all(R.integer)" prop="chargeCycle"
                                         :disabled="disabled||edit"
                            ></field-input>

                            <!--M标识第三层-->
                            <field-cascader label="装备小类" :options="options" v-model="form.nameId" prop="nameId"
                                            width="3" :rules="r(true).all(R.require)" name="小类"
                                            :disabled="edit"
                                            v-if="title.includes('新增')||(title.includes('信息查看')&&!edit)">
                            </field-cascader>


                            <field-select label="供应商" v-model="form.vendorId" width="3" name="供应商"
                                          :rules="r(true).all(R.require)"
                                          prop="vendorId"
                                          @change="vendor(form.vendorId)"
                                          :disabled="disabled||edit"
                                          :list="vendorId"></field-select>

                            <field-input v-model="form.personM" label="联系人" width="3" :disabled="true"
                                         :rules="r(true).all(R.require)" prop="personM"></field-input>
                            <field-input v-model="form.phoneM" label="联系电话" width="3" :disabled="true"
                                         :rules="r(true).all(R.require)" prop="phoneM"></field-input>
                        </form-container>
                        <!--<el-button type="primary" class="button" @click="pushForm" v-if="!equipId">提交</el-button>-->
                    </div>

                </el-card>

                <!--扩展信息-->

                <el-card class="box-card" shadow="never" v-if="!title.includes('新增')&&!title.includes('信息查看')">
                    <div slot="header">
                        <span>扩展信息</span>
                    </div>
                    <div>
                        <form-container ref="zbForm" :model="zbForm">


                            <field-input v-model="zbForm.numberL" label="架体编号" width="2.5"
                                         :disabled="edit"></field-input>

                            <field-select label="架体AB面" v-model="zbForm.surfaceL" width="2.5"
                                          :disabled="edit"
                                          :list="[{val:'A_SURFACE',key:'A面'},{val:'B_SURFACE',key:'B面'}]"></field-select>

                            <field-input v-model="zbForm.floorL" label="架体层号" width="2.5"
                                         :disabled="edit"></field-input>

                            <field-input v-model="zbForm.sectionL" label="架体节号" width="2.5"
                                         :disabled="edit"></field-input>


                            <field-input v-model="zbForm.shelfLifeQ" label="保质期" width="2.5" :disabled="edit"
                                         :rules="r(true).all(R.integer)" prop="shelfLifeQ"></field-input>
                            <field-date-picker v-model="zbForm.productDateQ" label="生产日期" width="2.5" :disabled="edit"
                                               :rules="r(true).all(R.require)" prop="productDateQ"></field-date-picker>
                        </form-container>
                        <!--<el-button type="primary" class="button" @click="pushzbForm" v-if="!equipId">提交</el-button>-->
                    </div>
                </el-card>

                <!--教学视频-->

                <el-card class="box-card" shadow="never" v-if="title.includes('新增')||title.includes('信息查看')">
                    <div slot="header">
                        <span>教学视频路径</span>
                    </div>
                    <div class="box-body">
                        <div class="video" v-for="(item,index) in 3" @click="videoUp(index)">
                            <input type="file" ref="fileVideo" @change="videoFileChange(index)" accept="video/*">
                            <svg-icon icon-class="影片" class="icon"/>
                            <div>
                                {{form.videoAddresses[index]||'空'}}
                            </div>
                        </div>
                    </div>
                </el-card>

                <!--文档信息-->

                <el-card class="box-card" shadow="never" v-if="title.includes('新增')||title.includes('信息查看')">
                    <div slot="header">
                        <span>说明书</span>
                    </div>
                    <div class="box-body">
                        <div class="video" v-for="(item,index) in 3" @click="pdfUp(index)">
                            <input type="file" ref="filePdf" @change="pdfFileChange(index)" accept=".pdf">
                            <svg-icon icon-class="pdf" class="icon"/>
                            <div>
                                {{form.documentAddresses[index]||'空'}}
                            </div>
                        </div>
                    </div>
                </el-card>

                <!--绑定序号-->

                <el-card class="box-card" shadow="never" v-if="title.includes('入库')">
                    <div slot="header">
                        <span>绑定序号</span>
                    </div>
                    <div>
                        <el-table :data="list" fit height="360" class="list" :row-class-name="tableRowClassName">
                            <el-table-column label="序号" align="center">
                                <template scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>

                            <el-table-column label="RFID" align="center">
                                <template scope="scope">
                                    <el-input size="small" v-model="scope.row.rfid"
                                              :disabled="true"
                                              style="width:100px"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="装备序号" align="center">
                                <template scope="scope">
                                    <el-input size="small" v-model="scope.row.serial"
                                              style="width:100px"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template scope="scope">
                                    <el-button type="danger" @click="delqaq(scope)">删除</el-button>
                                </template>
                            </el-table-column>

                        </el-table>
                    </div>
                </el-card>


                <div class="_box-bottom">
                    <el-button type="primary" @click="addEquipArg" :disabled="isClick" v-if="!edit">提交</el-button>
                </div>
            </div>
        </el-card>

        <field-dialog title="提示" ref="dialog" @confirm="dialogConfirm">
            <div class="_dialogDiv">
                您确定要放弃本次操作吗?
            </div>
        </field-dialog>


        <serviceDialog title="复制RFID" ref="copyRfidDialog" @confirm="copyRfid">
            <form-container ref="copyRfid" :model="copyRfidList" style="text-align: center">
                <field-input v-model="copyRfidList.rfid" label="RFID" width="4"
                             :disabled="true"></field-input>
            </form-container>
        </serviceDialog>


    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/eqList.gql'
    import {scrappedUp} from "api/workflow";
    import {getCategoryAndGenre,getSuppliers} from "api/storage"
    import imgUp from 'components/base/axiosImgUp';
    import axios from 'axios';
    import {imgUpUrl, pdfUpUrl, videoUpUrl, imgBaseUrl, pdfBaseUrl, videoBaseUrl} from "api/config";
    import {delFile} from "api/basic";
    import serviceDialog from 'components/base/serviceDialog/index'
    import {transformMixin} from "common/js/transformMixin";
    import { start, startOne, killProcess } from 'common/js/rfidReader'
    import request from 'common/js/request'
    // const cmdPath = 'C:\\Users\\Administrator';
    //const exec = window.require('child_process').exec;
    //const spawn = window.require('child_process').spawn;
    // import {killProcess, killProcessSync} from "common/js/kill";

    export default {
        data() {
            return {
                form: {
                    videoAddresses: [],
                    documentAddresses: [],
                    imageAddress: 'noImg.jpg',
                },
                zbForm: {},
                list: [{rfid: null, serial: null}],
                formRes: '',
                inlineForm: {},
                leadershipList: [],
                noimg:false,
                unitId: JSON.parse(localStorage.getItem('user')).unitId,
                options: [],
                vendorId: [],
                edit: false,
                disabled: false,
                imageUrl: '',
                rfids: [],
                serialList: [],
                pid: '',
                index: 0,
                com: 0,
                copyRfidList: {},
                judgeEdit: { // 判断是否对数据进行修改
                    form: null,
                    zbForm: null
                },
                isClick: false // 避免提交按钮快速点击
            }
        },
        mixins: [formRulesMixin, transformMixin],
        components: {
            imgUp,
            serviceDialog
        },
        props: {
            commonHouseId: {
                type: String,
                default: '',
            },
            equipId: {
                type: String,
                default: null,
            },
            equipArgId: {
                type: String,
                default: null,
            },

            title: {
                type: String,
                default: null,
            }
        },


        methods: {

            //离开页面以后为父组件抛出black 杀死进程
            black() {
                if(this.isEqual()) {
                    killProcess(this.pid)
                    this.$emit('black', true);
                } else {
                    this.$refs.dialog.show();
                }
                //killProcess();
            },

            /* 判断两次数据是否相等 */
            isEqual() {
                let flag1 = JSON.stringify(this.form) == JSON.stringify(this.judgeEdit.form)
                let flag2 = JSON.stringify(this.zbForm) == JSON.stringify(this.judgeEdit.zbForm)
                return flag1&&flag2;
            },

            //点击提交后 根据从什么入口进入的执行对应的  新增  入库  装备基础信息修改 装备入库信息修改
            addEquipArg() {
                this.isClick = true;
                setTimeout(() => {this.isClick = false}, 1600);
                if (this.title.includes('新增')) {
                    this.form.videoAddresses ? this.form.videoAddresses = this.form.videoAddresses.join(',') : '';
                    this.form.documentAddresses ? this.form.documentAddresses = this.form.documentAddresses.join(',') : '';
                    let newData = JSON.parse(JSON.stringify(this.form));
                    newData.upkeepCycle = this.dayToMilli(JSON.parse(JSON.stringify(this.form.upkeepCycle)));
                    newData.chargeCycle = this.dayToMilli(JSON.parse(JSON.stringify(this.form.chargeCycle)));
                    // this.$refs.form.gqlValidate(api.category_addEquipArg, {
                    //     supplierId: this.form.vendorId ? this.form.vendorId : '',
                    //     categoryId: this.form.nameId ? this.form.nameId[1] : '',
                    //     equipArg: newData
                    // }, (res) => {
                    //     this.dialogConfirm();
                    //     this.callback('添加成功!');
                    // });

                    this.$refs.form.ajaxValidate({
                        url: '/equip-args',
                        method: 'post',
                        params:{
                                supplierId: this.form.vendorId ? this.form.vendorId : '',
                                categoryId: this.form.nameId ? this.form.nameId[1] : '',
                            },
                        data:newData
                    }, (res) => {
                        // console.log('aaaa',res)
                        console.log('res',res);
                        this.$message.success('添加成功!');
                        this.dialogConfirm();
                        // this.callback('添加成功!');
                    },(err)=>{
                        this.$message.error('添加失败!');
                        console.log(err);
                    });
                } else if (this.title.includes('信息查看')) {
                    this.form.videoAddresses ? this.form.videoAddresses = this.form.videoAddresses.join(',') : '';
                    this.form.documentAddresses ? this.form.documentAddresses = this.form.documentAddresses.join(',') : '';
                    this.form.supplier.id ? this.form.supplier.id = this.form.vendorId : '';


                    let newData = JSON.parse(JSON.stringify(this.form));

                    newData.upkeepCycle = this.dayToMilli(JSON.parse(JSON.stringify(this.form.upkeepCycle)));
                    newData.chargeCycle = this.dayToMilli(JSON.parse(JSON.stringify(this.form.chargeCycle)));

                    this.$refs.form.ajaxValidate({
                        url: '/equip-args',
                        method: 'put',
                        data:{
                            categoryId: this.form.nameId ? this.form.nameId[1] : '',
                            equipArg: newData
                        }
                    }, (res) => {
                        // console.log('aaaa',res)
                        this.dialogConfirm();
                        this.$message.sucess('添加成功!');
                        // this.callback('添加成功!');
                    },(err)=>{
                        console.log(err);
                    });
                    // this.$refs.form.gqlValidate(api.category_saveEquipArg, {
                    //     categoryId: this.form.nameId ? this.form.nameId[1] : '',
                    //     equipArg: newData
                    // }, (res) => {
                    //     console.log(res);
                    //     this.dialogConfirm();
                    //     this.callback('添加成功!');
                    // })
                } else if (this.title.includes('入库')) {
                    if(this.list[0].rfid == null) {
                        this.$message.error("请扫入RFID");
                        return
                    }
                    this.$refs.form.validate.then((res1) => {
                        this.zbForm['location'] = {
                            number: Number(this.zbForm.numberL),
                            surface: this.zbForm.surfaceL,
                            floor: Number(this.zbForm.floorL),
                            section: Number(this.zbForm.sectionL),
                        };
                        this.zbForm['quality'] = {
                            shelfLife: this.zbForm.shelfLifeQ * 24 * 60 * 60 * 1000,
                            productDate: this.zbForm.productDateQ,
                        };
                        this.$refs.form.ajaxValidate({
                            url: '/equips/import',
                            method: 'post',
                            params:{
                                rfids: this.list.map((item) => {
                                    return item['rfid'];
                                }),
                                serialList: this.list.map((item) => {
                                    return item['serial'] == '' ? null : item['serial'];
                                }),
                                location: this.zbForm.location,
                                equipArgId: this.form.nameId[2],
                                quality: this.zbForm.quality,
                                price: this.form.price * 100,
                            }
                        }, (res) => {
                            // this.callback(`成功`);
                            this.$message.sucess('成功');
                            //spawn("taskkill", ["/PID", this.pid, "/T", "/F"]);
                            killProcess(this.pid)
                            this.$emit('black', true);
                        }, (errs) => {
                            console.log('errs', errs);
                            let newData = [],
                                oldData = String(errs).split('[');
                            for (let j = 1; j < oldData.length; j++) {
                                if (oldData[j].includes(']')) {
                                    newData = oldData[j].split(']')[0].split(',').map(res => {
                                        return res.trim();
                                    });
                                }
                            }
                            newData.forEach(value => {
                                this.list.some(value1 => {
                                    if (value === value1['rfid']) {
                                        this.$set(value1, 'style', true);
                                        return true
                                    }
                                })
                            });
                        });
                        // this.$refs.zbForm.gqlValidateErr(api.admin_importEquips, {
                        //     rfids: this.list.map((item) => {
                        //         return item['rfid'];
                        //     }),
                        //     serialList: this.list.map((item) => {
                        //         return item['serial'] == '' ? null : item['serial'];
                        //     }),
                        //     location: this.zbForm.location,
                        //     equipArgId: this.form.nameId[2],
                        //     quality: this.zbForm.quality,
                        //     price: this.form.price * 100,
                        // }, (res) => {
                        //     this.callback(`成功`);
                        //     //spawn("taskkill", ["/PID", this.pid, "/T", "/F"]);
                        //     killProcess(this.pid)
                        //     this.$emit('black', true);
                        // }, (errs) => {
                        //     console.log('errs', errs);
                        //     let newData = [],
                        //         oldData = String(errs).split('[');
                        //     for (let j = 1; j < oldData.length; j++) {
                        //         if (oldData[j].includes(']')) {
                        //             newData = oldData[j].split(']')[0].split(',').map(res => {
                        //                 return res.trim();
                        //             });
                        //         }
                        //     }
                        //     newData.forEach(value => {
                        //         this.list.some(value1 => {
                        //             if (value === value1['rfid']) {
                        //                 this.$set(value1, 'style', true);
                        //                 return true
                        //             }
                        //         })
                        //     });
                        //     //console.log(newData);
                        //     //console.log(this.list);
                        // })

                    }).catch(err => {
                        this.$message.error('未通过检验');
                    })

                } else if (this.title.includes('装备查看')) {
                    this.zbForm['location'] = {
                        number: Number(this.zbForm.numberL),
                        surface: this.zbForm.surfaceL,
                        floor: Number(this.zbForm.floorL),
                        section: Number(this.zbForm.sectionL),
                    };
                    this.zbForm['quality'] = {
                        shelfLife: this.zbForm.shelfLifeQ * 24 * 60 * 60 * 1000,
                        productDate: this.zbForm.productDateQ,
                    };
                    this.$refs.zbForm.ajaxValidate({
                        url: '/equip-args',
                        method: 'put',
                        data:{
                            equipId: this.equipId,
                            location: this.zbForm.location,
                            quality: this.zbForm.quality,
                        }
                    }, (res) => {
                        // console.log('aaaa',res)
                        this.$message.sucess('成功');
                        this.$emit('black', true);
                    },(err)=>{
                        console.log(err);
                    });
                    // this.$refs.zbForm.gqlValidate(api.admin_saveEquipInfo, {
                    //     equipId: this.equipId,
                    //     location: this.zbForm.location,
                    //     quality: this.zbForm.quality,
                    // }, (res) => {
                    //     this.callback(`成功`);
                    //     this.$emit('black', true);
                    // })
                }
            },
            tableRowClassName({row, rowIndex}) {
                if (row.style) {
                    return 'err-row';
                }
                return '';
            },

            dialogConfirm() {
                // killProcess(this.pid)
                this.$emit('black', true);
            },

            //点击图标执行input的上传click事件
            pdfUp(data) {
                if (!this.edit) {
                    this.$refs.filePdf[data].click();
                }
            },

            //点击图标执行input的上传click事件
            videoUp(data) {
                if (!this.edit) {
                    this.$refs.fileVideo[data].click();
                }
            },

            //上传video类
            videoFileChange(index) {
                if (this.form.videoAddresses.length > 0) {
                    delFile({
                        filename: this.form.videoAddresses[index],
                        category: 'video',
                    }).then(res => {
                        console.log(res);
                    })
                }

                let files = this.$refs.fileVideo[index].files[0];

                let fileFormData = new FormData();
                fileFormData.append('file', files, files.name);
                let requestConfig = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                };
                const instance = axios.create({
                    withCredentials: true
                });
                const loading = this.$loading({
                    lock: true,
                    text: '正在上传请稍等!',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                instance.post(videoUpUrl, fileFormData, requestConfig).then(res => {
                    loading.close();
                    this.form.videoAddresses[index] = res.data;
                    this.form.videoAddresses.reverse();
                    this.form.videoAddresses.reverse();
                }).catch(err => {
                    loading.close();
                    this.$message.error('上传失败');
                });
            },

            //上传pdf
            pdfFileChange(index) {
                if (this.form.documentAddresses.length > 0) {
                    delFile({
                        filename: this.form.documentAddresses[index],
                        category: 'pdf',
                    }).then(res => {
                        console.log(res);
                    })
                }


                let files = this.$refs.filePdf[index].files[0];
                let fileFormData = new FormData();
                fileFormData.append('file', files, files.name);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
                let requestConfig = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                };
                const instance = axios.create({
                    withCredentials: true
                });

                instance.post(pdfUpUrl, fileFormData, requestConfig).then(res => {
                    console.log(res.data);
                    this.form.documentAddresses[index] = res.data;
                    this.form.documentAddresses.reverse();
                    this.form.documentAddresses.reverse();
                }).catch(err => {
                    console.log(err);
                    this.$message.error('上传失败');
                    this.$refs.filePdf[index].value = null;
                });


            },

            //选择供应商后更新 对应信息
            vendor(data) {
                console.log(data);
                this.vendorId.some(item => {
                    if (item.val === data) {
                        this.form.personM = item.data.person;
                        this.form.phoneM = item.data.phone;
                        return true
                    }
                })
            },

            //图片上传成功暴露的方法
            successUp(data) {
                console.log(data);

                this.form.imageAddress = data;
            },

            //选择完装备后执行 显示对应数据 和开启读卡器的使用
            getEquipInfo(data) {
                this.gqlQuery(api.getEquipArg, {
                    id: data
                }, (res) => {
                    this.index = 0;
                    let a = JSON.parse(JSON.stringify(res.data.EquipArg));
                    
                    this.form['name'] = a.name;
                    this.form['upkeepCycle'] = this.milliToDay(a.upkeepCycle);
                    this.form['chargeCycle'] = this.milliToDay(a.chargeCycle);
                    this.form.vendorId = a.supplier.id;
                    this.$set(this.form, 'model', a.model);
                   
                    this.$set(this.form, 'personM', a.supplier.person);
                    this.$set(this.form, 'phoneM', a.supplier.phone);
                    this.$set(this.form, 'eqBig', a.category.genre.name);
                    this.$set(this.form, 'eqSmall', a.category.name);
                    if (a.imageAddress) {
                        this.imageUrl = `${imgBaseUrl}${a.imageAddress}`
                    } else {
                        this.imageUrl = '';
                        this.noimg=true;
                    }

                });

                start("java -jar scan.jar", (data) => {
                    if (this.index > 0) {
                        if (this.index == 1) {
                            this.list[0] = {rfid: data};
                        } else {
                            this.list.push({rfid: data});
                        }
                        this.index = this.index + 1;
                    } else {
                        let newData = JSON.parse(data);

                        newData.status === 'succeed' ? this.index = 1 : this.index = 0;
                    }
                }, (fail) => {
                    this.index = 1;
                    this.$message.error(fail)
                }, (pid, err) => {pid?this.pid=pid:this.$message.error(err);})

                // const process = exec(`java -jar scan.jar ${this.com}`, {cwd: cmdPath});

                // this.pid = process.pid;

                // process.stderr.on('data', (err) => {
                //     console.log(err);
                //     this.$message.error('设备故障请重新插拔!插入后请重新选择装备');
                //     this.index = 1;
                //     killProcess();
                // });

                // process.stdout.on('data', (data) => {
                //     console.log(data);
                //     if (this.index > 0) {
                //         if (this.index == 1) {
                //             this.list[0].rfid = data;
                //         } else {
                //             this.list.push({rfid: data});
                //         }
                //         this.index = this.index + 1;
                //     } else {
                //         let newData = JSON.parse(data);
                //         newData.status === 'succeed' ? this.index = 1 : this.index = 0;
                //     }
                // });

                // process.on('exit', (code) => {
                //     if (this.index === 0) {
                //         this.$message.error('设备未插入或串口号错误,插入后请重新选择装备!');
                //     }
                //     console.log(`子进程退出，退出码 ${code}`);
                // });

            },

            //点击编辑后状态改变
            editClick() {
                this.edit = !this.edit;
                this.disabled = !this.disabled;
            },

            // qaq(row) {
            //     if (row.$index === this.list.length - 1) {
            //         this.list.push({id: this.list.length});
            //     }
            // },

            //删除读卡后的当前选择数据
            delqaq(row) {
                this.list.splice(row.$index, 1);
                // if (this.list.length > 1) {
                //     this.list.splice(row.$index, 1);
                // } else {
                //     this.$message.error('不能删除最后一个');
                // }
            },

            // 复制RFID
            copyRfid() {
                console.log("SprWu");
                startOne("java -jar writing.jar", (data) => {
                    if (data.includes('succeed')) {
                        this.$message.success('复制成功!');
                        this.$refs.copyRfidDialog.hide();
                    } else {
                        this.$message.error('复制失败!');
                    }
                }, this.copyRfidList.rfid)
                // exec(`java -jar writing.jar ${this.com} ${this.copyRfidList.rfid}`, {cwd: cmdPath}, (err, data) => {
                //     console.log(data);
                //     if (data.includes('succeed')) {
                //         this.$message.success('复制成功!');
                //         this.$refs.copyRfidDialog.hide();
                //     } else {
                //         this.$message.error('复制失败!');
                //     }
                // })
            },

            //进入页面获取数据
            getList() {
                if (this.equipId) {
                    this.gqlQuery(api.getEquip, {
                        id: this.equipId
                    }, (res) => {
                        
                        let eqData = JSON.parse(JSON.stringify(res.data.Equip));
                     
                        this.zb = eqData;
                        this.form = eqData.equipArg;
                       
                        this.form.vendorId = eqData.equipArg.supplier.id;
                        eqData.equipArg.imageAddress ? this.imageUrl = `${imgBaseUrl}${eqData.equipArg.imageAddress}` : '';
                        this.$set(this.form, 'eqBig', eqData.equipArg.category.genre.name);
                        this.$set(this.form, 'eqSmall', eqData.equipArg.category.name);
                        this.$set(this.form, 'serial',eqData.serial);
                        this.$set(this.form, 'upkeepCycle', this.milliToDay(eqData.equipArg.upkeepCycle));
                        this.$set(this.form, 'chargeCycle', this.milliToDay(eqData.equipArg.chargeCycle));
                        this.$set(this.form, 'price', eqData.price / 100);
                  

                        this.zb['shelfLifeQ'] = Math.round(eqData.quality.shelfLife / 24 / 60 / 60 / 1000);
                        this.zb['productDateQ'] = eqData.quality.productDate;
                        this.zb['floorL'] = eqData.location ? eqData.location.floor : '';
                        this.zb['numberL'] = eqData.location ? eqData.location.number : '';
                        this.zb['surfaceL'] = eqData.location ? eqData.location.surface : '';
                        this.zb['sectionL'] = eqData.location ? eqData.location.section : '';
                        this.$set(this.form, 'personM', eqData.equipArg.supplier.person);
                        this.$set(this.form, 'phoneM', eqData.equipArg.supplier.phone);

                        this.$set(this.copyRfidList, 'rfid', eqData.rfid);

                        this.zbForm = this.zb;
                    });
                }

                if (this.equipArgId) {
                    this.gqlQuery(api.getEquipArg, {
                        id: this.equipArgId
                    }, (res) => {
                        let zb = {};
                        let eqData = JSON.parse(JSON.stringify(res.data.EquipArg));
                        this.form = eqData;
                        this.form.vendorId = eqData.supplier.id;
                        eqData.imageAddress ? this.imageUrl = `${imgBaseUrl}${eqData.imageAddress}` : '';
                        this.form.videoAddresses = eqData.videoAddresses ? eqData.videoAddresses.split(",") : [];
                        this.form.documentAddresses = eqData.documentAddresses ? eqData.documentAddresses.split(",") : [];

                        this.$set(this.form, 'upkeepCycle', this.milliToDay(eqData.upkeepCycle));
                        this.$set(this.form, 'chargeCycle', this.milliToDay(eqData.chargeCycle));

                        this.form.nameId = [eqData.category.genre.id, eqData.category.id];
                        this.$set(this.form, 'eqBig', eqData.category.genre.name);
                        this.$set(this.form, 'eqSmall', eqData.category.name);
                        this.$set(this.form, 'personM', eqData.supplier.person);
                        this.$set(this.form, 'phoneM', eqData.supplier.phone);
                    });
                }
                getCategoryAndGenre().then(res => {
                        let data = JSON.parse(JSON.stringify(res));
                        let newData = [];
                        if (data) {
                            console.log(data);
                            data.forEach((item) => {
                                if (item.categories.length > 0) {
                                    item.categories.forEach((item1, index1) => {
                                        if (item1.equipArgs.length > 0) {
                                            item1.equipArgs.forEach((item2, index2) => {
                                                item1.equipArgs[index2] = {
                                                    value: item2.id,
                                                    label: item2.name,
                                                };
                                            })
                                        }
                                        item.categories[index1] = {
                                            value: item1.id,
                                            label: item1.name,
                                            children: !this.title.includes('新增') && !this.title.includes('信息查看') ? item1.equipArgs : null
                                        };
                                    })
                                }
                                newData.push(
                                    {
                                        value: item.id,
                                        label: item.name,
                                        children: item.categories
                                    }
                                )
                            });
                            this.options = newData;
                        }
                }).catch(err => {
                    console.log(err);
                });

                // this.gqlQuery(api.getGenreList, {}, (res) => {
                //     let data = JSON.parse(JSON.stringify(res.data.GenreList.content));
                //     let newData = [];
                //     if (data) {
                //         data.forEach((item) => {
                //             if (item.categories.length > 0) {
                //                 item.categories.forEach((item1, index1) => {
                //                     if (item1.equipArgs.length > 0) {
                //                         item1.equipArgs.forEach((item2, index2) => {
                //                             item1.equipArgs[index2] = {
                //                                 value: item2.id,
                //                                 label: item2.name,
                //                             };
                //                         })
                //                     }
                //                     item.categories[index1] = {
                //                         value: item1.id,
                //                         label: item1.name,
                //                         children: !this.title.includes('新增') && !this.title.includes('信息查看') ? item1.equipArgs : null
                //                     };
                //                 })
                //             }
                //             newData.push(
                //                 {
                //                     value: item.id,
                //                     label: item.name,
                //                     children: item.categories
                //                 }
                //             )
                //         });
                //         this.options = newData;
                //     }
                // });
                getSuppliers().then(res => {
                    this.vendorId = res.map(item => {
                        return {
                            val: item.id,
                            key: item.name,
                            data: {
                                person: item.person,
                                phone: item.phone,
                            }
                        }
                    });
                    this.judgeEdit.form = JSON.parse(JSON.stringify(this.form))
                    this.judgeEdit.zbForm = JSON.parse(JSON.stringify(this.zbForm))
                }).catch(err => {
                    console.log(err);
                });
                // this.gqlQuery(api.getSupplierList, {}, (res) => {
                //     this.vendorId = res.data.SupplierList.content.map(item => {
                //         return {
                //             val: item.id,
                //             key: item.name,
                //             data: {
                //                 person: item.person,
                //                 phone: item.phone,
                //             }
                //         }
                //     });
                //     this.judgeEdit.form = JSON.parse(JSON.stringify(this.form))
                //     this.judgeEdit.zbForm = JSON.parse(JSON.stringify(this.zbForm))
                // });
            }
        },

        created() {
            this.com = JSON.parse(localStorage.getItem('deploy'))['UHF_READ_COM'];//获取到串口号
            //killProcess();
        },
        mounted() {

            //不同的入口进入的展示不同页面

            if (this.title.includes('入库')) {
                this.disabled = true;
            } else if (this.title.includes('装备查看')) {
                this.edit = true;
                this.disabled = true;
            } else if (this.title.includes('信息查看')) {
                this.edit = true;
                this.disabled = true;
            }

            this.getList();
        },
        beforeDestroy() {
            console.log("页面退出");
            killProcess(this.pid)
        }

    }
</script>

<style lang="scss" scoped>
    @import "common/css/mixin.scss";
    @import "common/css/variables.scss";

    .el-card:not(:nth-last-child(2)) {
        border-bottom: none !important;
    }

    .el-card:first-child {

        border-top: none !important;
    }

    .black {
        font-size: 20px;
        display: flex;
        align-items: center;
        float: right;
    }

    .black .svg-info {
        height: 20px;
        width: 20px;
        margin-right: 10px;
    }

    .box-card {
        .topIcon {
            font-size: 16px;
            margin-left: 50px;
        }

        .box-body {
            display: flex;

            .imgUp {
                margin-left: 45px;
            }

            .formList {
                width: 974px;
                margin: 0 auto;
            }

            .video {
                margin: 0 50px 20px 50px;
                cursor: pointer;
                text-align: center;

                input {
                    display: none;
                }

                .icon {
                    font-size: 50px;
                    color: #2f2f76;
                }

                div {
                    text-align: center;
                    word-wrap: break-word;
                }
            }
        }

        .path {
            ._form-item {
                display: block !important;
            }
        }

        .list {
            width: 80%;
            margin: 3% auto;
            max-height: 40vh;
            border: 1px solid #EBEEF5;
            border-bottom: none !important;
        }

    }


</style>
