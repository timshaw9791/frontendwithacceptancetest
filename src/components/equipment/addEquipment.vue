<template>
    <div>
        <el-card class="box-card">
            <div slot="header">
                <span>装备基础信息</span>
            </div>
            <div>
                <form-container ref="form" :model="form" v-if="equipId">
                    <field-input v-model="form.name" label="装备名" width="2.5" :disabled="equipId"
                                 :rules="r(true).all(R.require)" prop="name"></field-input>
                    <field-input v-model="form.model" label="装备类型" width="2.5" :disabled="equipId"
                                 :rules="r(true).all(R.require)" prop="model"></field-input>
                    <field-input v-model="form.upkeepCycle" label="保养周期" width="2.5" :disabled="equipId"
                                 :rules="r(true).all(R.require)" prop="upkeepCycle"></field-input>
                    <field-input v-model="form.chargeCycle" label="充电周期" width="2.5" :disabled="equipId"
                                 :rules="r(true).all(R.require)" prop="chargeCycle"></field-input>

                    <!--M标识第三层-->

                    <field-input v-model="form.manufacturerM" label="制造厂家" width="2.5"
                                 :rules="r(true).all(R.require)" prop="manufacturerM"></field-input>
                    <field-input v-model="form.personM" label="联系人" width="2.5"
                                 :rules="r(true).all(R.require)" prop="personM"></field-input>
                    <field-input v-model="form.phoneM" label="联系电话" width="2.5"
                                 :rules="r(true).all(R.require)" prop="phoneM"></field-input>
                </form-container>

                <form-container ref="form" :model="form" v-if="!equipId">
                    <field-cascader label="装备名称" :options="options" v-model="form.nameId" prop="nameId"
                                    width="2.5" :rules="r(true).all(R.require)">
                    </field-cascader>

                    <field-select label="制造厂商" v-model="form.vendorId" width="2.5"
                                  :rules="r(true).all(R.require)"
                                  prop="vendorId"
                                  :list="vendorId"></field-select>
                </form-container>

                <!--<el-button type="primary" class="button" @click="pushForm" v-if="!equipId">提交</el-button>-->

            </div>

        </el-card>
        <el-card class="box-card">
            <div slot="header">
                <span>扩展信息</span>
            </div>
            <div>
                <form-container ref="zbForm" :model="zbForm">
                    <field-input v-model="zbForm.serial" label="装备序号" width="2.5"
                                 :rules="r(true).all(R.require)" prop="serial"></field-input>
                    <field-input v-model="zbForm.rfid" label="装备rfid" width="2.5"
                                 :rules="r(true).all(R.require)" prop="rfid"></field-input>

                    <field-input v-model="zbForm.numberL" label="架体编号" width="2.5"
                                 :rules="r(true).all(R.require)" prop="numberL"></field-input>

                    <field-select label="架体AB面" v-model="zbForm.surfaceL" width="2.5"
                                  :rules="r(true).all(R.require)"
                                  prop="surfaceL"
                                  :list="[{val:'A_SURFACE',key:'A面'},{val:'B_SURFACE',key:'B面'},{val:'ALL',key:'C面'}]"></field-select>

                    <field-input v-model="zbForm.floorL" label="架体层号" width="2.5"
                                 :rules="r(true).all(R.require)" prop="floorL"></field-input>

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
        <el-card class="box-card" v-if="equipId">
            <div slot="header">
                <span>装备操作</span>
            </div>
            <div class="operating">
                <el-button type="primary" @click="control('receive')">领取</el-button>
                <el-button type="primary" @click="control('return')">归还</el-button>
                <el-button type="primary" @click="control('maintenance')">保养</el-button>
                <el-button type="primary" @click="control('service')">维修</el-button>
                <el-button @click="control('scrapped')" type="primary">报废</el-button>
            </div>
        </el-card>

        <div class="box-bottom">
            <el-button>返回</el-button>
            <el-button type="primary" @click="pushzbForm">确认</el-button>
        </div>

        <field-dialog :title="title" ref="dialog" @confirm="dialogConfirm">
            <form-container ref="inlineForm" :model="inlineForm">
                <field-input v-model="inlineForm.reason" label="原因" width="10" type="textarea"
                             :rules="r(true).all(R.require)" prop="reason"></field-input>
                <field-input v-model="inlineForm.auditor" label="操作人" width="10"
                             :rules="r(true).all(R.require)" prop="auditor"></field-input>

                <field-select label="领导" v-model="inlineForm.leader" width="10"
                              :rules="r(true).all(R.require)"
                              prop="leader"
                              v-if="title==='报废'"
                              :list="leadershipList"></field-select>
            </form-container>
        </field-dialog>

    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/eqList.gql'
    import {scrappedUp} from "api/workflow";

    export default {
        data() {
            return {
                form: {},
                zbForm: {},
                formRes: '',
                inlineForm: {},
                title: '',
                leadershipList: [],
                unitId: JSON.parse(localStorage.getItem('user')).unitId,
                options: [],
                vendorId: [],

            }
        },
        mixins: [formRulesMixin],
        props: {
            commonHouseId: {
                type: String,
                default: '',
            },
            equipId: {
                type: String,
                default: null,
            },
        },


        methods: {
            // pushForm() {
            //     this.form['manufacturer'] = {
            //         manufacturer: this.form.manufacturerM,
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
                    number: this.zbForm.numberL,
                    surface: this.zbForm.surfaceL,
                    floor: this.zbForm.floorL,
                    section: this.zbForm.section,
                };
                this.zbForm['quality'] = {
                    shelfLife: this.zbForm.shelfLifeQ * 24 * 60 * 60 * 1000,
                    productDate: this.zbForm.productDateQ,
                };

                this.$refs.form.validate.then(() => {
                    try {
                        this.$refs.zbForm.gqlValidate(api.admin_importEquip, {
                            serial: this.zbForm.serial,
                            rfid: this.zbForm.rfid,
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
                let API = '';
                switch (this.title) {
                    case '保养':
                        API = api.admin_upkeepEquips;
                        break;
                    case '维修':
                        API = api.admin_maintainEquips;
                        break;
                    case '报废':
                        this.$refs.inlineForm.axiosData(
                            scrappedUp({
                                equipIdList: [this.equipId],
                                leaderId: this.inlineForm.leader,
                                reason: this.inlineForm.reason,
                            }).then((res) => {
                                console.log(res);
                            })
                        );
                        break;
                }
                if (this.title !== '报废') {
                    this.$refs.inlineForm.gqlValidate(API,
                        {
                            equipIdList: [this.equipId],
                            reason: this.inlineForm.reason,
                            auditor: this.inlineForm.auditor,
                        }, () => {
                            this.callback(`申请${this.title}成功`);
                            this.$refs.dialog.hide();
                            this.$emit('confirm', true);
                        });
                }

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

        },
        mounted() {
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
                    this.$set(this.form, 'manufacturerM', eqData.equipArg.manufacturer.manufacturer);
                    this.$set(this.form, 'personM', eqData.equipArg.manufacturer.person);
                    this.$set(this.form, 'phoneM', eqData.equipArg.manufacturer.phone);
                    this.zbForm = this.zb;
                    // this.form['manufacturerM'] = eqData.equipArg.manufacturer.manufacturer;
                    // this.form['personM'] = eqData.equipArg.manufacturer.person;
                    // this.form['phoneM'] = eqData.equipArg.manufacturer.phone;
                });
                this.leadList();
            } else {
                this.gqlQuery(api.getCategoryList, {
                    houseId: this.commonHouseId
                }, (res) => {
                    let data = JSON.parse(JSON.stringify(res.data.CategoryList.content));
                    let newData = [];
                    if (data) {
                        data.forEach((item) => {
                            if (item.categoryItems.length > 0) {
                                item.categoryItems.forEach((item1, index1) => {
                                    if (item1.equipArgs.length > 0) {
                                        item1.equipArgs.forEach((item2, index2) => {
                                            item1.equipArgs[index2] = {
                                                value: item2.id,
                                                label: item2.name,
                                            };
                                        })
                                    }
                                    item.categoryItems[index1] = {
                                        value: item1.id,
                                        label: item1.name,
                                        children: item1.equipArgs
                                    };
                                })
                            }
                            newData.push(
                                {
                                    value: item.id,
                                    label: item.name,
                                    children: item.categoryItems
                                }
                            )
                        });
                        console.log(newData);
                        this.options = Array.from(new Set(newData));
                    }
                });
                this.gqlQuery(api.getSupplierList, {}, (res) => {
                    console.log(res.data.SupplierList.content);
                    this.vendorId = res.data.SupplierList.content.map(item => {
                        return {
                            val: item.id,
                            key: item.name,
                        }
                    })
                })
            }
        },


    }
</script>

<style lang="scss" scoped>
    @import "common/css/mixin.scss";

    .box-card {
        .button {
            float: right;
            margin-bottom: 1%;
        }

        .operating {
            display: flex;
            justify-content: center;
        }
    }

    .box-bottom {
        @include center;
        margin: 3% 0;

    }


</style>