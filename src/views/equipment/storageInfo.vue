<template>
    <div>
        <el-card shadow="never" :body-style="{ padding:'0'}">
            <div slot="header">
                <span class="_card-title">{{title}}</span>
            </div>
            <div>

                <el-card class="box-card" shadow="never">
                    <div slot="header">
                        <span>装备参数</span>
                    </div>
                    <div class="box-body">
                        <div class="imgUp">
                            <imgUp @success="successUp"></imgUp>
                        </div>
                        <form-container ref="form" :model="form" class="formList">
                            <field-cascader label="装备名称" :options="options" v-model="form.nameId" prop="nameId"
                                            width="3" :rules="r(true).all(R.require)" v-if="!title.includes('新增')"
                                            @change="getEquipInfo(form.nameId[2])"
                            >
                            </field-cascader>

                            <field-input v-model="form.name" label="装备名" width="3" :disabled="disabled"
                                         :rules="r(true).all(R.require)" prop="name"></field-input>

                            <field-input v-model="form.model" label="装备型号" width="3" :disabled="disabled"
                                         :rules="r(true).all(R.require)" prop="model"></field-input>

                            <field-input v-model="form.upkeepCycle" label="保养周期/天" width="3"
                                         :rules="r(true).all(R.integer)" prop="upkeepCycle"
                                         :disabled="disabled"
                            ></field-input>
                            <field-input v-model="form.chargeCycle" label="充电周期/天" width="3"
                                         :rules="r(true).all(R.integer)" prop="chargeCycle"
                                         :disabled="disabled"
                            ></field-input>

                            <!--M标识第三层-->
                            <field-cascader label="装备类别" :options="options" v-model="form.nameId" prop="nameId"
                                            width="3" :rules="r(true).all(R.require)"
                                            v-if="title.includes('新增')"
                            >
                            </field-cascader>


                            <field-select label="供应商" v-model="form.vendorId" width="3"
                                          :rules="r(true).all(R.require)"
                                          prop="vendorId"
                                          @change="vendor(form.vendorId)"
                                          :list="vendorId"></field-select>

                            <field-input v-model="form.personM" label="联系人" width="3" :disabled="true"
                                         :rules="r(true).all(R.require)" prop="personM"></field-input>
                            <field-input v-model="form.phoneM" label="联系电话" width="3" :disabled="true"
                                         :rules="r(true).all(R.require)" prop="phoneM"></field-input>
                        </form-container>


                        <!--<el-button type="primary" class="button" @click="pushForm" v-if="!equipId">提交</el-button>-->

                    </div>

                </el-card>

                <el-card class="box-card" shadow="never" v-if="!title.includes('新增')">
                    <div slot="header">
                        <span>扩展信息</span>
                    </div>
                    <div>
                        <form-container ref="zbForm" :model="zbForm">

                            <field-input v-model="zbForm.numberL" label="架体编号" width="2.5"
                                         :rules="r(true).all(R.integer)" prop="numberL"></field-input>

                            <field-select label="架体AB面" v-model="zbForm.surfaceL" width="2.5"
                                          :rules="r(true).all(R.require)"
                                          prop="surfaceL"
                                          :list="[{val:'A_SURFACE',key:'A面'},{val:'B_SURFACE',key:'B面'},{val:'ALL',key:'C面'}]"></field-select>

                            <field-input v-model="zbForm.floorL" label="架体层号" width="2.5"
                                         :rules="r(true).all(R.integer)" prop="floorL"></field-input>

                            <field-input v-model="zbForm.sectionL" label="架体节号" width="2.5"
                                         :rules="r(true).all(R.require)" prop="sectionL"></field-input>


                            <field-input v-model="zbForm.shelfLifeQ" label="保质期" width="2.5"
                                         :rules="r(true).all(R.require)" prop="shelfLifeQ"></field-input>
                            <field-date-picker v-model="zbForm.productDateQ" label="生产日期" width="2.5"
                                               :rules="r(true).all(R.require)" prop="productDateQ"></field-date-picker>
                        </form-container>
                        <!--<el-button type="primary" class="button" @click="pushzbForm" v-if="!equipId">提交</el-button>-->

                    </div>
                </el-card>

                <el-card class="box-card" shadow="never" v-if="title.includes('新增')">
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

                <el-card class="box-card" shadow="never" v-if="title.includes('新增')">
                    <div slot="header">
                        <span>文档信息</span>
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

                <el-card class="box-card" shadow="never" v-if="!title.includes('新增')">
                    <div slot="header">
                        <span>绑定序号</span>
                    </div>
                    <div>
                        <el-scrollbar wrap-class="list">
                            <div class="list">
                                <el-table :data="list" fit>
                                    <bos-table-column lable="序号" field="id"></bos-table-column>

                                    <el-table-column label="RFID">
                                        <template scope="scope">
                                            <el-input size="small" v-model="scope.row.id"
                                                      style="width:100px"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="装备序号">
                                        <template scope="scope">
                                            <el-input size="small" v-model="scope.row.id"
                                                      style="width:100px"></el-input>
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </div>
                        </el-scrollbar>
                    </div>
                </el-card>


                <div class="_box-bottom">
                    <el-button @click="black">返回</el-button>
                    <el-button type="primary" @click="addEquipArg">确认</el-button>
                </div>
            </div>
        </el-card>

        <field-dialog title="提示" ref="dialog" @confirm="dialogConfirm">
            <div class="_dialogDiv">
                您确定要放弃本次操作吗?
            </div>
        </field-dialog>


    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/eqList.gql'
    import {scrappedUp} from "api/workflow";
    import imgUp from 'components/base/axiosImgUp';

    export default {
        data() {
            return {
                form: {
                    videoAddresses: [],
                    documentAddresses: [],
                    imageAddress: '',
                },
                zbForm: {},
                list: [{id: 1}, {id: 2}],
                formRes: '',
                inlineForm: {},
                leadershipList: [],
                unitId: JSON.parse(localStorage.getItem('user')).unitId,
                options: [],
                vendorId: [],
                disabled: false,

            }
        },
        mixins: [formRulesMixin],
        components: {
            imgUp
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
            title: {
                type: String,
                default: null,
            }
        },


        methods: {
            black() {
                this.$refs.dialog.show();
            },
            // pushForm() {
            //     this.form['manufacturer'] = {
            //         person: this.form.personM,
            //         phone: this.form.phoneM
            //     };
            //     console.log(this.form);
            //     this.$refs.form.gqlValidate(api.admin_saveEquipArg, {
            //         equipArg: this.form
            //     }, (res) => {
            //         console.log(res.data.admin_saveEquipArg.id);
            //         this.formRes = res.data.admin_saveEquipArg.id;
            //         this.callback(`成功`);
            //     })
            // },
            pushzbForm() {
                // this.commonHouseId = 'VDGT11wlFluGgO9Uw0xf30Com';
                // this.formRes = 'ldcFUKCQE3_epG09XGBf81EqA';

                this.zbForm['location'] = {
                    number: Number(this.zbForm.numberL),
                    surface: this.zbForm.surfaceL,
                    floor: Number(this.zbForm.floorL),
                    section: this.zbForm.sectionL,
                };
                this.zbForm['quality'] = {
                    shelfLife: this.zbForm.shelfLifeQ * 24 * 60 * 60 * 1000,
                    productDate: this.zbForm.productDateQ,
                };

                this.$refs.form.validate.then(() => {
                    try {
                        this.$refs.zbForm.gqlValidate(api.admin_importEquip, {
                            location: this.zbForm.location,
                            equipArgId: this.form.nameId[2],
                            quality: this.zbForm.quality,
                            houseId: this.commonHouseId,
                            supplierId: this.form.vendorId
                        }, (res) => {
                            console.log(res);
                            this.callback(`成功`);
                            this.$emit('confirm', true)
                        })
                    } catch (err) {
                        this.$message.error('未通过检验');
                    }
                });
            },


            addEquipArg() {
                this.$refs.form.gqlValidate(api.category_addEquipArg, {
                    supplierId: this.form.vendorId,
                    categoryId: this.form.nameId[1],
                    equipArg: this.form
                }, (res) => {
                    console.log(res);
                    this.dialogConfirm();
                    this.callback('添加成功!');
                });
            },

            control(data) {
                switch (data) {
                    case 'receive':
                        console.log(data);
                        this.gqlMutate(api.houseUser_receiveEquip, {
                            equipIds: [this.equipId]
                        }, (res) => {
                            console.log(res);
                            this.callback(`操作成功`);
                            this.$emit('confirm', true);
                        });
                        break;
                    case 'return':
                        this.gqlMutate(api.houseUser_returnEquip, {
                            equipIds: [this.equipId]
                        }, (res) => {
                            console.log(res);
                            this.callback(`操作成功`);
                            this.$emit('confirm', true);
                        });
                        break;
                    case 'maintenance':
                        this.title = '保养';
                        this.$refs.dialog.show();
                        this.inlineForm = {};
                        break;
                    case 'service':
                        this.title = '维修';
                        this.$refs.dialog.show();
                        this.inlineForm = {};
                        break;
                    case 'scrapped':
                        this.title = '报废';
                        this.$refs.dialog.show();
                        this.inlineForm = {};
                        break;
                }

            },
            dialogConfirm() {
                this.$emit('black', true)
                // let API = '';
                // switch (this.title) {
                //     case '保养':
                //         API = api.admin_upkeepEquips;
                //         break;
                //     case '维修':
                //         API = api.admin_maintainEquips;
                //         break;
                //     case '报废':
                //         this.$refs.inlineForm.axiosData(
                //             scrappedUp({
                //                 equipIdList: [this.equipId],
                //                 leaderId: this.inlineForm.leader,
                //                 reason: this.inlineForm.reason,
                //             }).then((res) => {
                //                 console.log(res);
                //             })
                //         );
                //         break;
                // }
                // if (this.title !== '报废') {
                //     this.$refs.inlineForm.gqlValidate(API,
                //         {
                //             equipIdList: [this.equipId],
                //             reason: this.inlineForm.reason,
                //             auditor: this.inlineForm.auditor,
                //         }, () => {
                //             this.callback(`申请${this.title}成功`);
                //             this.$refs.dialog.hide();
                //             this.$emit('confirm', true);
                //         });
                // }

            },
            leadList() {
                this.gqlQuery(api.getUserList, {
                    "qfilter": {
                        "key": "roleItems.roleEnum",
                        "value": "LEADER",
                        "operator": "EQUEAL",
                        "combinator": "AND",
                        "next": {
                            "key": "organUnit.id",
                            "value": this.unitId,
                            "operator": "EQUEAL",
                            "combinator": "OR",
                            "next": {
                                "key": "organUnit.organUnit.id",
                                "value": this.unitId,
                                "operator": "EQUEAL"
                            }
                        }
                    }
                }, (res) => {
                    let data = JSON.parse(JSON.stringify(res.data.UserList.content));
                    this.leadershipList = data.map((item) => {
                        return {key: item.name, val: item.id}
                    });
                })
            },
            pdfUp(data) {
                this.$refs.filePdf[data].click();
            },
            videoUp(data) {
                this.$refs.fileVideo[data].click();
            },

            videoFileChange(index) {
                console.log(this.$refs.fileVideo[index].files[0].name);
                this.form.videoAddresses[index] = this.$refs.fileVideo[index].files[0].name;
                this.form.videoAddresses.reverse();
                this.form.videoAddresses.reverse();

            },
            pdfFileChange(index) {
                console.log(this.$refs.filePdf[index].files[0].name)
                this.form.documentAddresses[index] = this.$refs.filePdf[index].files[0].name;
                this.form.documentAddresses.reverse();
                this.form.documentAddresses.reverse();
            },

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
            successUp(data) {
                console.log(data)
            },
            getEquipInfo(data) {
                console.log(data);
                this.gqlQuery(api.getEquipArg, {
                    id: data
                }, (res) => {
                    console.log(res.data.EquipArg);
                    let a = JSON.parse(JSON.stringify(res.data.EquipArg));

                    this.$set(this.form, 'model', a.model);
                    this.form['name'] = a.name;
                    this.form['upkeepCycle'] = a.upkeepCycle;
                    this.form['chargeCycle'] = a.chargeCycle;

                })
            }
        },

        mounted() {
            if (this.title.includes('入库')) {
                this.disabled = true;
            }

            if (this.equipId) {
                this.gqlQuery(api.getEquip, {
                    id: this.equipId
                }, (res) => {
                    let zb = {};
                    let eqData = JSON.parse(JSON.stringify(res.data.Equip));
                    this.zb = eqData;
                    this.form = eqData.equipArg;
                    this.zb['shelfLifeQ'] = (eqData.quality.shelfLife / 24 / 60 / 60 / 1000);
                    this.zb['productDateQ'] = eqData.quality.productDate;

                    this.zb['floorL'] = eqData.location.floor;
                    this.zb['numberL'] = eqData.location.number;
                    this.zb['surfaceL'] = eqData.location.surface;
                    this.zb['sectionL'] = eqData.location.section;


                    this.$set(this.form, 'personM', eqData.supplier.person);
                    this.$set(this.form, 'phoneM', eqData.supplier.phone);

                    this.zbForm = this.zb;


                    // this.form['personM'] = eqData.equipArg.manufacturer.person;
                    // this.form['phoneM'] = eqData.equipArg.manufacturer.phone;
                });
                // this.leadList();
            } else {
                this.gqlQuery(api.getGenreList, {}, (res) => {
                    console.log(res);
                    let data = JSON.parse(JSON.stringify(res.data.GenreList.content));
                    let newData = [];
                    if (data) {
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
                                        children: !this.title.includes('新增') ? item1.equipArgs : null
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
                        console.log(newData);
                        this.options = newData;
                    }
                });
                this.gqlQuery(api.getSupplierList, {}, (res) => {
                    console.log(res.data.SupplierList.content);
                    this.vendorId = res.data.SupplierList.content.map(item => {
                        return {
                            val: item.id,
                            key: item.name,
                            data: {
                                person: item.person,
                                phone: item.phone,
                            }
                        }
                    })
                })
            }
        },


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


    .box-card {

        .box-body {
            display: flex;

            .imgUp {
                margin-left: 45px;
            }

            .formList {
                width: 80%;
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
            min-height: 40vh;
            max-height: 40vh;
            border: 1px solid #EBEEF5;
        }

    }


</style>