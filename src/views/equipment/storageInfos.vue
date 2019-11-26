<template>
    <div class="storage-info">
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
                                   v-if="title.includes('装备信息详情')">
                            <svg-icon icon-class="加"/>
                            复制RFID
                        </el-button>


                        <el-button type="text" class="topIcon" @click="edit=!edit" v-if="title.includes('装备参数详情')">
                            <svg-icon icon-class="编辑"/>
                            {{edit?'编辑':'取消编辑'}}
                        </el-button>


                        <el-button type="text" class="topIcon" @click="extendEdit=!extendEdit"
                                   v-if="title.includes('装备信息详情')">
                            <svg-icon icon-class="编辑"/>
                            {{extendEdit?'编辑':'取消编辑'}}
                        </el-button>
                    </div>
                    <div class="box-body">
                        <form-container ref="form" :model="form" class="formList">
                           <field-input v-model="form.name" label="装备名称" width="3" name="装备名称"
                                         :rules="r(true).all(R.require)" prop="name"
                                         v-if="['新增装备信息', '装备参数详情', '装备信息详情'].includes(title)"
                                         :disabled="edit"
                            ></field-input>
                            <field-select label="装备名称" v-model="form.name" width="3" name="装备名称"
                                          :list="equipment.name" :rules="r(true).all(R.require)"
                                          @change="equipNameSelected" placeholder="请选择" prop="name"
                                          v-else></field-select>
            
                            <field-input v-model="form.model" label="装备型号" width="3"
                                         :rules="r(true).all(R.require)" prop="model"
                                         v-if="['新增装备信息', '装备参数详情', '装备信息详情'].includes(title)"
                                         :disabled="edit" :class="{'occupy-position': !title.includes('装备信息详情')}"
                            ></field-input>
                            <field-select label="装备型号" v-model="form.model" width="3" name="装备型号" prop="model"
                                          :list="equipment.model" :rules="r(true).all(R.require)"
                                          @change="equipSelected" placeholder="请选择"
                                          :class="{'occupy-position': !title.includes('装备信息详情')}" v-else></field-select>

                            <field-input v-model="form.serial" label="装备序号" width="3" :disabled="true"
                                        :rules="r(true).all(R.require)"
                                        v-if="title.includes('装备信息详情')"
                                      prop="serial"></field-input>
                            
                            <field-input v-model="form.shelfLifeQ" label="保质期" width="3" :disabled="edit"
                                         :rules="r(true).all(R.integer)" prop="shelfLifeQ"></field-input>

                            <field-input v-model="form.chargeCycle" label="充电周期" width="3"
                                         :rules="r(true).all(R.integer)" prop="chargeCycle"
                                         :disabled="edit"
                            ></field-input>

                            <field-input v-model="form.upkeepCycle" label="保养周期" width="3"
                                         :rules="r(true).all(R.integer)" prop="upkeepCycle"
                                         :disabled="edit"
                            ></field-input>

                            <field-input v-model="form.vendorId" label="供应商" width="3"
                                         :rules="r(true).all(R.require)" prop="vendorId"
                                         :disabled="true" v-if="['入库装备', '装备信息详情'].includes(title)"
                            ></field-input>
                            <field-select label="供应商" v-model="form.vendorId" width="3" name="供应商"
                                          :rules="r(true).all(R.require)"
                                          prop="vendorId" @change="vendor(form.vendorId)"
                                          :disabled="edit" :list="supplierArr"
                                          v-else></field-select>

                            <field-input v-model="form.personM" label="联系人员" width="3" :disabled="true"
                                         :rules="r(true).all(R.require)" prop="personM"></field-input>
                                         
                            <field-input v-model="form.phoneM" label="联系方式" width="3" :disabled="true"
                                         :rules="r(true).all(R.require)" prop="phoneM"></field-input>

                        </form-container>


                        <!--<el-button type="primary" class="button" @click="pushForm" v-if="!equipId">提交</el-button>-->
                        <div class="imgUp">
                            <imgUp @success="successUp" :disabled="edit"
                                   :image="form.image" :upload="title.includes('入库')?false:true" :noimg="noimg"></imgUp>
                        </div>
                    </div>

                </el-card>

                <!--扩展信息-->

                <el-card class="box-card" shadow="never" v-if="['入库装备', '装备信息详情'].includes(title)">
                    <div slot="header">
                        <span>扩展信息</span>
                    </div>
                    <div>
                        <form-container ref="zbForm" :model="zbForm">


                            <field-input v-model="zbForm.numberL" label="架体编号" width="2.5"
                                        :rules="r(true).all(R.integer)" prop="numberL"
                                         :disabled="extendEdit"></field-input>

                            <field-select label="架体AB面" v-model="zbForm.surfaceL" width="2.5"
                                          :disabled="extendEdit"  :rules="r(true).all(R.require)"
                                          :list="[{val:'A',key:'A面'},{val:'B',key:'B面'}]"></field-select>

                            <field-input v-model="zbForm.sectionL" label="架体节号" width="2.5"
                                        :rules="r(true).all(R.integer)" prop="sectionL"
                                         :disabled="extendEdit"></field-input>

                            <field-input v-model="zbForm.floorL" label="架体层号" width="2.5"
                                        :rules="r(true).all(R.integer)" prop="floorL"
                                         :disabled="extendEdit"></field-input>

                            <field-date-picker v-model="zbForm.productDateQ" label="生产日期" width="2.5" :disabled="extendEdit"
                                               :rules="r(true).all(R.require)" prop="productDateQ"></field-date-picker>

                            <field-input v-model="zbForm.price" label="装备单价" width="2.5" :disabled="extendEdit"
                                         :rules="r(true).all(R.integer)" prop="price"
                                         ></field-input>
                        </form-container>
                        <!--<el-button type="primary" class="button" @click="pushzbForm" v-if="!equipId">提交</el-button>-->

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
                    <el-button type="primary" @click="addEquipArg" :disabled="isClick" v-if="!extendEdit&&title.includes('装备信息详情')">提交</el-button>
                    <el-button type="primary" @click="addEquipArg" :disabled="isClick" v-if="edit == submitShow">提交</el-button>
                </div>
            </div>
        </el-card>

        <field-dialog title="提示" ref="dialog" @confirm="dialogConfirm">
            <div class="_dialogDiv">
                您确定要放弃本次操作吗?
            </div>
        </field-dialog>


        <serviceDialog title="复制RFID" ref="copyRfidDialog" @confirm="copyRfid" confirmInfo="写入">
            <form-container ref="copyRfid" :model="copyRfidList" style="text-align: center">
                <field-input v-model="copyRfidList.rfid" label="RFID：" width="4"
                             :disabled="true"></field-input>
            </form-container>
        </serviceDialog>


    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import {scrappedUp} from "api/workflow";
    import imgUp from 'components/base/axiosImgUp';
    import axios from 'axios';
    import {imgUpUrl, pdfUpUrl, videoUpUrl, imgBaseUrl, pdfBaseUrl, videoBaseUrl} from "api/config";
    import {delFile} from "api/basic";
    import { equipArgsByName, inHouse, findEquip, updateEquipArg, getAllSupplier, saveEquipArg, updateEquip} from "api/storage"
    import serviceDialog from 'components/base/serviceDialog/index'
    import {transformMixin} from "common/js/transformMixin";
    import { start, startOne, killProcess } from 'common/js/rfidReader'
    import request from 'common/js/request'
    // const cmdPath = 'C:\\Users\\Administrator';
    // const exec = window.require('child_process').exec;
    // const spawn = window.require('child_process').spawn;
    // import {killProcess, killProcessSync} from "common/js/kill";

    export default {
        data() {
            return {
                form: {
                    name: '', // 装备名称
                    model: '', // 装备型号
                    shelfLifeQ: '', // 装备保质期
                    chargeCycle: '', // 装备充电周期
                    upkeepCycle: '', // 装备保养周期
                    vendorId: '' , // 装备供应商
                    personM: '', // 装备联系人员
                    phoneM: '', // 装备联系方式
                    id: '',
                    image: null, // 图片
                },
                equipment: {
                    name: [],
                    model: [],
                    allEquip: []
                },
                zbForm: {
                    numberL: '', // 架体编号
                    surfaceL: '', // 架体AB面
                    sectionL: '', // 架体节号
                    extendEdit: '', // 架体层号
                    productDateQ: '', // 生产日期
                    price: '', // 装备单价
                },
                list: [{rfid: null, serial: null}],
                tempImage: '', // 用以保存图片的名字
                formRes: '',
                inlineForm: {},
                leadershipList: [],
                noimg:false,
                unitId: JSON.parse(localStorage.getItem('user')).unitId,
                options: [],
                supplierArr: [], // 供应商列表
                allSupplier: [], // 供应商所有数据列表
                edit: true, // 装备参数详情的编辑
                extendEdit: true, // 装备信息详情的编辑
                submitShow: false, // 提交按钮是否显示
                hardwareOpen: false, // 硬件是否启动
                imageUrl: '',
                rfids: [],
                serialList: [],
                pid: '',
                index: 0, // 标识当前扫入是否是第一件装备
                com: 0,
                copyRfidList: {},
                judgeEdit: { // 判断是否对数据进行修改
                    form: {
                        videoAddresses: [],
                        documentAddresses: [],
                        imageAddress: 'noImg.jpg',
                    },
                    zbForm: {}
                },
                isClick: false, // 避免提交按钮快速点击
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
            equipName: {
                type: String,
                default: null
            },
            title: {
                type: String,
                default: null,
            },
            equipList: {
                type: Object,
                default() {
                    return {}
                }
            }
        },


        methods: {
            init() {
                this.form = Object.assign(this.form, {
                    model: '', 
                    shelfLifeQ: '',
                    chargeCycle: '',
                    upkeepCycle: '',
                    vendorId: '' ,
                    personM: '',
                    phoneM: '',
                })
                this.zbForm = {
                    numberL: '', 
                    surfaceL: '',
                    sectionL: '', 
                    extendEdit: '', 
                    productDateQ: '', 
                    price: '', 
                }
                this.list = [{rfid: null, serial: null}]
                this.pid = ''
                this.index = 0
                this.hardwareOpen = false
            },
            //离开页面以后为父组件抛出black 杀死进程
            black() {
                // let flag = this.isEqual();
                // if(flag) {
                //     // killProcess(this.pid)
                //     this.judgeEdit = {
                //         form: {
                //             videoAddresses: [],
                //             documentAddresses: [],
                //             imageAddress: 'noImg.jpg',
                //         },
                //         zbForm: {}
                //     };
                    
                    if(this.title.includes('入库装备')) {
                        killProcess(this.pid)
                    }
                    this.$emit('black', true);
                // } else {
                //     this.$refs.dialog.show();
                // }
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
                if(this.title.includes('入库装备')) {
                    if(this.list.length == 0 || this.list[0].rfid == null || this.list[0].rfid == undefined) {
                        this.$message.error("未扫入装备")
                        return
                    }
                    let tempForm = JSON.parse(JSON.stringify(this.form)),
                        tempZbForm = JSON.parse(JSON.stringify(this.zbForm)),
                        requestBody = {
                        equipArg: {
                            chargeCycle: tempForm.chargeCycle*1000*3600*24,
                            upkeepCycle: tempForm.upkeepCycle*1000*3600*24,
                            id: tempForm.id,
                            model: tempForm.model,
                            name: tempForm.name,
                            shelfLife: tempForm.shelfLifeQ*1000*3600*24,
                        },
                        location: {
                            floor: tempZbForm.floorL,
                            number: tempZbForm.numberL,
                            section: tempZbForm.sectionL,
                            surface: tempZbForm.surfaceL
                        },
                        price: tempZbForm.price * 100,
                        productDate: tempZbForm.productDateQ
                    },
                    rfidList = [],
                    serialList = [];
                    this.list.forEach(equip => {
                        rfidList.push(equip.rfid)
                        serialList.push(equip.serial)
                    })
                    this.$refs.form.postValidate(inHouse, {
                        rfids: rfidList,
                        serials: serialList
                    }, requestBody, (state, res) => {
                        killProcess(this.pid)
                        this.pid = ''
                        this.hardwareOpen = false
                        this.$message.success("入库成功")
                        this.$emit('black')
                        // 关闭硬件
                    })
                } else if(this.title.includes('装备参数详情')) {
                    let tempForm =  {
                        id: this.form.id,
                        name: this.form.name,
                        model: this.form.model,
                        chargeCycle: this.form.chargeCycle*1000*3600*24,
                        shelfLife: this.form.shelfLifeQ*1000*3600*24,
                        upkeepCycle: this.form.upkeepCycle*1000*3600*24,
                        image: this.form.imageAddress,
                        supplier: {
                            name: this.form.vendorId,
                            person: this.form.personM,
                            phone: this.form.phoneM,
                            id: this.form.supplierId
                        }
                    }
                    this.$refs.form.restValidate(updateEquipArg, JSON.parse(JSON.stringify(tempForm)), (res) => {
                        this.edit = true;
                        this.$message.success("更新成功")
                        this.$emit('black')
                    })
                } else if(this.title.includes('新增装备信息')) {
                    let tempForm = {
                        name: this.form.name,
                        model: this.form.model,
                        shelfLife: this.form.shelfLifeQ*1000*3600*24,
                        chargeCycle: this.form.chargeCycle*1000*3600*24,
                        upkeepCycle: this.form.upkeepCycle*1000*3600*24,
                        supplier: {
                            id: this.form.supplierId,
                            name: this.form.vendorId,
                            person: this.form.personM,
                            phone: this.form.phoneM
                        }
                    }
                    this.$refs.form.restValidate(saveEquipArg, tempForm, (res) => {
                        this.$message.success("新增成功")
                        this.$emit('black')
                    })
                } else if(this.title.includes('装备信息详情')) {
                    let tempForm = {
                        equipArg: {
                            id: this.form.equipId,
                            name: this.form.name,
                            model: this.form.model,
                            image: this.tempImage,
                            shelfLife: this.form.shelfLifeQ*1000*3600*24,
                            chargeCycle: this.form.chargeCycle*1000*3600*24,
                            upkeepCycle: this.form.upkeepCycle*1000*3600*24,
                            supplier: {
                                id: this.form.supplierId,
                                name: this.form.vendorId,
                                person: this.form.personM,
                                phone: this.form.phoneM
                            }
                        },
                        location: {
                            number: this.zbForm.numberL,
                            surface: this.zbForm.surfaceL,
                            section: this.zbForm.sectionL,
                            floor: this.zbForm.floorL
                        },
                        id: this.form.id,
                        productDate: this.zbForm.productDateQ,
                        price: this.zbForm.price*100,
                        rfid: this.form.rfid,
                        serial: this.form.serial
                    }
                    // updateEquip
                    this.$refs.form.validate.then(() => {
                        this.$refs.zbForm.restValidate(updateEquip, tempForm, (res) => {
                            this.$message.success("更新成功")
                            this.$emit('black')
                        })
                    }).catch(err => {
                        this.$message.error('未通过检验');
                    })
                }
                // if (this.title.includes('新增')) {
                //     this.form.videoAddresses ? this.form.videoAddresses = this.form.videoAddresses.join(',') : '';
                //     this.form.documentAddresses ? this.form.documentAddresses = this.form.documentAddresses.join(',') : '';
                //     this.form.name = this.form.name.trim()
                //     this.form.model = this.form.model.trim()
                //     let newData = JSON.parse(JSON.stringify(this.form));
                //     newData.upkeepCycle = this.dayToMilli(JSON.parse(JSON.stringify(this.form.upkeepCycle)));
                //     newData.chargeCycle = this.dayToMilli(JSON.parse(JSON.stringify(this.form.chargeCycle)));
                //     this.$refs.form.ajaxValidate({
                //         url: '/equip-args',
                //         method: 'post',
                //         params:{
                //             supplierId: this.form.vendorId ? this.form.vendorId : '',
                //             categoryId: this.form.nameId ? this.form.nameId[1] : '',
                //         },
                //         data:newData
                //     }, (res) => {
                //         this.dialogConfirm();
                //         this.$message.success("添加成功")
                //     },(err)=>{
                //         this.$message.error(err.response.data.message);
                //     });

                // } else if (this.title.includes('信息查看')) {
                //     let modifyForm = JSON.parse(JSON.stringify(this.form));
                //     modifyForm.videoAddresses ? modifyForm.videoAddresses = modifyForm.videoAddresses.join(',') : '';
                //     modifyForm.documentAddresses ? modifyForm.documentAddresses = modifyForm.documentAddresses.join(',') : '';
                //     modifyForm.supplier.id ? this.form.supplier.id = this.form.vendorId : '';
                //     modifyForm.name = modifyForm.name.trim();
                //     modifyForm.model = modifyForm.model.trim();


                //     let newData = JSON.parse(JSON.stringify(modifyForm));

                //     newData.upkeepCycle = this.dayToMilli(JSON.parse(JSON.stringify(modifyForm.upkeepCycle)));
                //     newData.chargeCycle = this.dayToMilli(JSON.parse(JSON.stringify(modifyForm.chargeCycle)));


                //     this.$refs.form.ajaxValidate({
                //         url: '/equip-args',
                //         method: 'put',
                //         params:{
                //             categoryId: this.form.nameId ? this.form.nameId[1] : '',
                //         },
                //         data:newData
                //     },  (res) => {
                //         console.log(res);
                //         this.$message.success('修改成功')
                //         this.dialogConfirm();

                //         // this.callback('添加成功!');
                //     },
                //         (err)=>{
                //             this.$message.error(err.response.data.message);
                //         })
                // } else if (this.title.includes('入库')) {
                //     if(this.list[0].rfid == null) {
                //         this.$message.error("请扫入RFID")
                //         return
                //     }


                //     this.$refs.form.validate.then((res1) => {
                //         this.zbForm['location'] = {
                //             number: Number(this.zbForm.numberL),
                //             surface: this.zbForm.surfaceL,
                //             floor: Number(this.zbForm.floorL),
                //             section: Number(this.zbForm.sectionL),
                //         };
                //         this.zbForm['quality'] = {
                //             shelfLife: this.zbForm.shelfLifeQ * 24 * 60 * 60 * 1000,
                //             productDate: this.zbForm.productDateQ,
                //         };
                //         let equipList=[];
                //         this.list.forEach(item=>{
                //             equipList.push({
                //                 rfid: item['rfid'],
                //                 serial: item['serial'] == '' ? null : item['serial'],
                //                 location: this.zbForm.location,
                //                 quality: this.zbForm.quality,
                //                 price: this.form.price * 100
                //             })
                //         });
                //         this.$refs.zbForm.ajaxValidate({
                //             url: '/equips/import',
                //             method: 'post',
                //             params:{
                //                 equipArgId: this.form.nameId[2]
                //             },
                //             data:equipList
                //         }, (res) => {
                //             this.$message.success('入库成功');
                //             //spawn("taskkill", ["/PID", this.pid, "/T", "/F"]);
                //             killProcess(this.pid);
                //             this.$emit('black', true);
                //         }, (errs) => {
                //             console.log('errs', errs);
                //             let newData = [],
                //                 oldData = String(errs).split('[');
                //             for (let j = 1; j < oldData.length; j++) {
                //                 if (oldData[j].includes(']')) {
                //                     newData = oldData[j].split(']')[0].split(',').map(res => {
                //                         return res.trim();
                //                     });
                //                 }
                //             }
                //             newData.forEach(value => {
                //                 this.list.some(value1 => {
                //                     if (value === value1['rfid']) {
                //                         this.$set(value1, 'style', true);
                //                         return true
                //                     }
                //                 })
                //             });
                //             //console.log(newData);
                //             //console.log(this.list);
                //         })

                //     }).catch(err => {
                //         this.$message.error('未通过检验');
                //     })

                // } else if (this.title.includes('装备查看')) {
                //     this.zbForm['location'] = {
                //         number: Number(this.zbForm.numberL),
                //         surface: this.zbForm.surfaceL,
                //         floor: Number(this.zbForm.floorL),
                //         section: Number(this.zbForm.sectionL),
                //     };
                //     this.zbForm['quality'] = {
                //         shelfLife: this.zbForm.shelfLifeQ * 24 * 60 * 60 * 1000,
                //         productDate: this.zbForm.productDateQ,
                //     };
                //     this.$refs.zbForm.ajax(api.admin_saveEquipInfo, {
                //         equipId: this.equipId,
                //         location: this.zbForm.location,
                //         quality: this.zbForm.quality,
                //     }, (res) => {
                //         this.$message.success('修改成功');
                //         this.$emit('black', true);
                //     })
                // }
            },


            tableRowClassName({row, rowIndex}) {
                if (row.style) {
                    return 'err-row';
                }
                return '';
            },

            dialogConfirm() {
                console.log(this.$route);
               if(this.$route.name=='warehouse/info'){

               }else {
                  killProcess(this.pid);
               }
                this.judgeEdit = {
                    form: {
                        videoAddresses: [],
                        documentAddresses: [],
                        imageAddress: 'noImg.jpg',
                    },
                    zbForm: {}
                },
                this.$emit('black', true);
            },


            //选择供应商后更新 对应信息
            vendor(data) {
                this.allSupplier.some(item => {
                    if (item.id === data) {
                        this.form.personM = item.person;
                        this.form.phoneM = item.phone;
                        this.form.vendorId = item.name,
                        this.form.supplierId = item.id
                        return true
                    }
                })
            },

            //图片上传成功暴露的方法
            successUp(data) {
                this.form.imageAddress = data;
            },

            //选择完装备后执行 显示对应数据 和开启读卡器的使用

            //点击编辑后状态改变
            editClick() {
                
            },

            // qaq(row) {
            //     if (row.$index === this.list.length - 1) {
            //         this.list.push({id: this.list.length});
            //     }
            // },


            // 复制RFID
            copyRfid() {
                startOne("java -jar writing.jar", (data) => {
                    if (data.includes('succeed')) {
                        this.$message.success('复制成功!');
                        this.$refs.copyRfidDialog.hide();
                    } else {
                        this.$message.error('复制失败!');
                    }
                }, this.copyRfidList.rfid)
            },
            // 装备实体扫描列表点击删除
            delqaq(row) {
                this.list.splice(row.$index, 1);
                // if (this.list.length > 1) {
                //     this.list.splice(row.$index, 1);
                // } else {
                //     this.$message.error('不能删除最后一个');
                // }
            },
            // 装备名称选择完成
            equipNameSelected() {
                if(this.pid != '' || this.pid != 0) {
                    killProcess(this.pid)
                    this.pid = ''
                }
                this.getEquipInfo()
            },
            // 选择型号完成，显示对应装备参数
            equipSelected() {
                let temp = this.equipment.allEquip.find(equip => equip.model == this.form.model)
                this.form = Object.assign(this.form, {
                    shelfLifeQ: temp.shelfLife/1000/3600/24,
                    chargeCycle: temp.chargeCycle/1000/3600/24,
                    upkeepCycle: temp.upkeepCycle/1000/3600/24,
                    vendorId: temp.supplier.name,
                    personM: temp.supplier.person,
                    phoneM: temp.supplier.phone,
                    id: temp.id
                })
                // 硬件开启 hardwareOpen
                if(!this.hardwareOpen) {
                    start("java -jar scan.jar", (data) => {
                        if(this.index == 0) {
                            this.list[0].rfid = data;
                        } else {
                            this.list.push({ rfid: data });
                        }
                        this.index = this.index + 1
                        this.hardwareOpen = true
                    }, (fail) => {
                        this.index = 1;
                        this.$message.error(fail);
                    }, (pid, err) => { pid? this.pid = pid: this.$message.error(err)})
                }
            },
            //进入页面获取数据
            getEquipInfo() {
                this.init()
                // 获取供应商列表
                getAllSupplier().then(res => {
                        let result = JSON.parse(JSON.stringify(res.content)), arr = [];
                        result.forEach(supplier => {
                            arr.push({key: supplier.name, val: supplier.id})
                        })
                        this.supplierArr = arr
                        this.allSupplier = result
                })
                if(this.title.includes('入库装备')) {
                    equipArgsByName({name: this.form.name}).then(res => {
                        let result = JSON.parse(JSON.stringify(res)), nameArr = [], modelArr = [];
                        result.forEach(equip => {
                            nameArr.push(equip.name)
                            modelArr.push(equip.model)
                        })
                        if(this.equipment.name != "") {
                            this.equipment.model = Array.from(new Set(modelArr))
                            this.equipment.allEquip = res
                        } else {
                            this.equipment.name = Array.from(new Set(nameArr))
                        }
                    })
                } else if(this.title.includes('装备信息详情')) {
                    findEquip(this.equipId).then(res => {
                        let result = JSON.parse(JSON.stringify(res))
                        this.tempImage = result.image
                        this.copyRfidList.rfid = result.rfid
                        this.form = {
                            id: result.id,
                            equipId: result.equipArg.id,
                            name: result.equipArg.name,
                            model: result.equipArg.model,
                            serial: result.serial,
                            image: `${imgBaseUrl}${result.image}`,
                            shelfLifeQ: result.equipArg.shelfLife/1000/3600/24,
                            chargeCycle: result.equipArg.chargeCycle/1000/3600/24,
                            upkeepCycle: result.equipArg.upkeepCycle/1000/3600/24,
                            supplierId: result.equipArg.supplier.id,
                            vendorId: result.equipArg.supplier.name,
                            personM: result.equipArg.supplier.person,
                            phoneM: result.equipArg.supplier.phone,
                            rfid: result.rfid,
                            serial: result.serial
                        }
                        this.zbForm = {
                            numberL: result.location.number,
                            surfaceL: result.location.surface,
                            sectionL: result.location.section,
                            floorL: result.location.floor,
                            productDateQ: result.productDate,
                            price: result.price/100
                        }
                    })
                } else if(this.title.includes('装备参数详情')) {
                    let tempForm = JSON.parse(JSON.stringify(this.equipList))
                    this.tempImage = tempForm.image
                    this.form = {
                        id: tempForm.id,
                        name: tempForm.name,
                        model: tempForm.model,
                        image: `${imgBaseUrl}${tempForm.image}`,
                        shelfLifeQ: tempForm.shelfLife/1000/3600/24,
                        upkeepCycle: tempForm.upkeepCycle/1000/3600/24,
                        chargeCycle: tempForm.chargeCycle/1000/3600/24,
                        vendorId: tempForm.supplier.name,
                        personM: tempForm.supplier.person,
                        phoneM: tempForm.supplier.phone,
                        supplierId: tempForm.supplier.id
                    }
                    // equipArgsByName({name: this.equipName}).then(res => {
                    //     let result = JSON.parse(JSON.stringify(res[0]))
                    //     this.form = {
                    //         id: result.id,
                    //         name: result.name,
                    //         model: result.model,
                    //         image: `${imgBaseUrl}${result.image}`,
                    //         shelfLifeQ: result.shelfLife/1000/3600/24,
                    //         chargeCycle: result.chargeCycle/1000/3600/24,
                    //         upkeepCycle: result.upkeepCycle/1000/3600/24,
                    //         vendorId: result.supplier.name,
                    //         personM: result.supplier.person,
                    //         phoneM: result.supplier.phone,
                    //         supplierId: result.supplier.id
                    //     }
                    // })
                }
                // if (this.equipId) {
                //     getEquipById(this.equipId).then(res=>{
                //         let eqData = JSON.parse(JSON.stringify(res));

                //         this.zb = eqData;
                //         this.form = eqData.equipArg;

                //         this.form.vendorId = eqData.equipArg.supplier.id;
                //         eqData.equipArg.imageAddress ? this.imageUrl = `${imgBaseUrl}${eqData.equipArg.imageAddress}` : '';
                //         this.$set(this.form, 'eqBig', eqData.equipArg.category.genre.name);
                //         this.$set(this.form, 'eqSmall', eqData.equipArg.category.name);
                //         this.$set(this.form, 'serial',eqData.serial)
                //         this.$set(this.form, 'upkeepCycle', this.milliToDay(eqData.equipArg.upkeepCycle));
                //         this.$set(this.form, 'chargeCycle', this.milliToDay(eqData.equipArg.chargeCycle));
                //         this.$set(this.form, 'price', eqData.price / 100);


                //         this.zb['shelfLifeQ'] = Math.round(eqData.quality.shelfLife / 24 / 60 / 60 / 1000);
                //         this.zb['productDateQ'] = eqData.quality.productDate;
                //         this.zb['floorL'] = eqData.location ? eqData.location.floor : '';
                //         this.zb['numberL'] = eqData.location ? eqData.location.number : '';
                //         this.zb['surfaceL'] = eqData.location ? eqData.location.surface : '';
                //         this.zb['sectionL'] = eqData.location ? eqData.location.section : '';
                //         this.$set(this.form, 'personM', eqData.equipArg.supplier.person);
                //         this.$set(this.form, 'phoneM', eqData.equipArg.supplier.phone);

                //         this.$set(this.copyRfidList, 'rfid', eqData.rfid);
                //         this.zbForm = this.zb;
                //         this.judgeEdit.form = JSON.parse(JSON.stringify(this.form));
                //         this.judgeEdit.zbForm = JSON.parse(JSON.stringify(this.zbForm))
                //     })
                // }

                // if (this.equipArgId) {
                //     this.gqlQuery(api.getEquipArg, {
                //         id: this.equipArgId
                //     }, (res) => {
                //         let zb = {};
                //         let eqData = JSON.parse(JSON.stringify(res.data.EquipArg));
                //         this.form = eqData;
                //         this.form.vendorId = eqData.supplier.id;
                //         eqData.imageAddress ? this.imageUrl = `${imgBaseUrl}${eqData.imageAddress}` : '';

                //         this.form.videoAddresses = eqData.videoAddresses ? eqData.videoAddresses.split(",") : [];
                //         this.form.documentAddresses = eqData.documentAddresses ? eqData.documentAddresses.split(",") : [];

                //         this.$set(this.form, 'upkeepCycle', this.milliToDay(eqData.upkeepCycle));
                //         this.$set(this.form, 'chargeCycle', this.milliToDay(eqData.chargeCycle));

                //         this.form.nameId = [eqData.category.genre.id, eqData.category.id];
                //         this.$set(this.form, 'eqBig', eqData.category.genre.name);
                //         this.$set(this.form, 'eqSmall', eqData.category.name);
                //         this.$set(this.form, 'personM', eqData.supplier.person);
                //         this.$set(this.form, 'phoneM', eqData.supplier.phone);
                //         this.judgeEdit.form = JSON.parse(JSON.stringify(this.form))
                //         this.judgeEdit.zbForm = JSON.parse(JSON.stringify(this.zbForm))
                //     });
                // };
                // getGenreList().then(res => {
                //         let data = JSON.parse(JSON.stringify(res));
                //         let newData = [];
                //         if (data) {
                //             data.forEach((item) => {
                //                 if (item.categories.length > 0) {
                //                     item.categories.forEach((item1, index1) => {
                //                         if (item1.equipArgs.length > 0) {
                //                             item1.equipArgs.forEach((item2, index2) => {
                //                                 item1.equipArgs[index2] = {
                //                                     value: item2.id,
                //                                     label: item2.name,
                //                                     model: item2.model,
                //                                 };
                //                             })
                //                         }
                //                         item.categories[index1] = {
                //                             value: item1.id,
                //                             label: item1.name,
                //                             model: item1.model,
                //                             children: !this.title.includes('新增') && !this.title.includes('信息查看') ? item1.equipArgs : null
                //                         };
                //                     })
                //                 }
                //                 newData.push(
                //                     {
                //                         value: item.id,
                //                         label: item.name,
                //                         model: item.model,
                //                         children: item.categories
                //                     }
                //                 )
                //             });
                //             this.options = newData;
                //         }
                // });

                // getSuppliers().then(res=>{
                //     this.vendorId = res.map(item => {
                //         return {
                //             val: item.id,
                //             key: item.name,
                //             data: {
                //                 person: item.person,
                //                 phone: item.phone,
                //             }
                //         }
                //     });
                //     this.judgeEdit.form = JSON.parse(JSON.stringify(this.form));
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
            if (this.title.includes('入库装备')) {
                this.submitShow = true; // edit与submitShow同 则按钮显示
                this.extendEdit = false;
            } else if(this.title.includes('装备信息详情')) {
                
            } else if (this.title.includes('新增装备信息')) {
                this.edit = false;
            } else if (this.title.includes('装备参数详情')) {
                
            }
            this.getEquipInfo();
        },
        beforeDestroy() {
            if(this.hardwareOpen || this.pid != '') {
                killProcess(this.pid)
            }
        }

    }
</script>

<style lang="scss" scoped>
    @import "common/css/mixin.scss";
    @import "common/css/variables.scss";

    .storage-info {
        /* 可调整 */
        font-size: 16px;
        // ._box-bottom {
        //  position: absolute;
        //  bottom: 0;
        // }
    }

    .el-card:not(:nth-last-child(2)) {
        border-bottom: none !important;
    }

    .el-card:first-child {

        border-top: none !important;
    }

    /* 可调整 */
    // ._card-title {
    //     font-size: 0.0938rem;
    // }

    .black {
        /* 可调整 */
        font-size: 20px;
        display: flex;
        align-items: center;
        float: right;
    }

    .black .svg-info {
        height: 20px;
        width: 20px;
        margin-right: 0.0521rem;
    }

    .box-card {
        .topIcon {
            /* 可调整 */
            // font-size: 0.0833rem;
            margin-left: 0.2604rem;
        }

        .box-body {
            display: flex;

            .imgUp {
                margin-left: 0.2344rem;
            }

            .formList {
                width: 974px;
                margin: 0 auto;
            }

            .video {
                margin: 0 0.2604rem 0.1042rem 0.2604rem;
                cursor: pointer;
                text-align: center;

                input {
                    display: none;
                }

                .icon {
                    font-size: 0.2604rem;
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
    .occupy-position {
        margin-right: 1.0417rem
    }

</style>
