<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <div class="secondaryTitle">
                    <el-button type="text" class="_textBt" @click="dialogShow('add')">
                        <svg-icon icon-class="加"/>
                        新增预案
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                placeholder="预案名"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </div>
                <div class="bodyContent">

                    <div class="pieceList" v-for="(item,index) in list" :key="index">
                        <div class="top">
                            <div style="width: 96%;display: flex;align-items: center;">
                                <el-button type="text" @click="dialogShow('up',item)">
                                    <svg-icon icon-class="编辑" style="margin-right: 12px;font-size: 16px"/>
                                </el-button>
                                <span>预案名称:</span>
                                <span style="margin-left: 10px">{{item.name}}</span>
                            </div>
                            <el-button type="text" icon="el-icon-close" @click="delList(item)"
                                       style="color: #7f7f7f;font-size: 20px">
                            </el-button>
                        </div>

                        <div class="list">
                            <el-scrollbar wrap-class="scroll-bar">
                                <div class="scroll-bar">
                                    <el-table :data="item.planEquips" fit>
                                        <bos-table-column lable="装备型号"
                                                          :filter="(row)=>row.equipModel"></bos-table-column>
                                        <bos-table-column lable="装备名称"
                                                          :filter="(row)=>row.equipName"></bos-table-column>
                                        <bos-table-column lable="架体编号"
                                                          :filter="(row)=>row.location?row.location.number:'暂无'"></bos-table-column>
                                        <bos-table-column lable="架体AB面"
                                                          :filter="(row)=>surface(row.location?row.location.surface:'暂无')"
                                        ></bos-table-column>
                                    </el-table>
                                </div>
                            </el-scrollbar>
                        </div>
                        <div class="bottom">
                            预案备注：
                            <div class="bottomInfo">
                                {{item.note}}
                            </div>
                        </div>
                    </div>

                    <div class="_box-bottom">
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :page-size="4"
                                @current-change="paginationChange"
                                :total="total">
                        </el-pagination>
                    </div>

                </div>
            </div>
        </el-card>

        <servicedialog :title="title" ref="dialog" @confirm="submit">
            <form-container ref="form" :model="form" class="formList">
                <field-input v-model="form.name" label="预案名称 :" width="4" :rules="r(true).all(R.require)"
                             prop="name"></field-input>

                <el-table :data="form.planEquips" fit class="dialogList" height="360">
                    <el-table-column label="装备型号" align="center">
                        <template scope="scope">
                            <field-input-query size="small" v-model="scope.row.equipModel"
                                               :inputList="restaurants"
                                               @select="qaq(scope,$event)"></field-input-query>
                        </template>
                    </el-table-column>

                    <el-table-column label="装备名称" align="center">
                        <template scope="scope">
                            {{scope.row.equipName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="架体编号" align="center">
                        <template scope="scope">
                            {{scope.row.location? scope.row.location.number:'暂无'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="架体AB面" align="center">
                        <template scope="scope">
                            {{surface(scope.row.location?scope.row.location.surface:'暂无')}}
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="120">
                        <template scope="scope">
                            <el-button type="danger" @click="delqaq(scope)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <field-input v-model="form.note" label="预案备注 :" width="9.6" type="textarea"></field-input>
            </form-container>


        </servicedialog>

        <servicedialog title="提示" ref="dialog1" @confirm="submit1">
            <div class="_dialogDiv">
                您确定要删除此条预案信息吗!?
            </div>
        </servicedialog>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import {transformMixin} from 'common/js/transformMixin'
    import servicedialog from 'components/base/serviceDialog'
    import {getPlanList, savePlan, delectPlan, searchPlan} from "api/plan"
    import api from 'gql/home.gql'

    export default {
        data() {
            return {
                inquire: '',
                list: [],
                page: 1,
                size: 4,
                total: 10,
                form: {
                    planEquips: [{equipModel: '', location: {}}]
                },
                restaurants: [{value: 'wdnm', key: '2'}],
                title: '',
                delId: '',
            }
        },
        mixins: [formRulesMixin, transformMixin],
        components: {
            servicedialog
        },
        methods: {
            paginationChange(val) {
                console.log(val);
                this.page = val;
                this.getList();
            },

            qaq(row, data) {
                this.form.planEquips[row.$index] = JSON.parse(JSON.stringify(data.key));

                if (row.$index === this.form.planEquips.length - 1) {
                    this.form.planEquips.push({equipModel: '', location: {}});
                }
            },

            delqaq(row) {
                if (this.form.planEquips.length > 1) {
                    this.form.planEquips.splice(row.$index, 1);
                } else {
                    this.$message.error('不能删除最后一个');
                }
            },
            dialogShow(type, item) {
                if (type === 'add') {
                    this.title = '新增预案';
                    this.$set(this.form,'name','');
                    this.$set(this.form,'note','');
                    this.form['planEquips'] = [{equipModel: '', location: {}}];

                } else if (type === 'up') {
                    this.title = '编辑预案';
                    console.log(item);
                    this.form = JSON.parse(JSON.stringify(item));
                }
                this.getEquipInfo();

                this.$refs.dialog.show();
            },
            getList() {
                getPlanList(this.getPagination(this.page, this.size)).then(res => {
                    this.list = res.content;
                    this.total = res.totalElements;
                }).catch(err => {
                    console.log(err);
                })
            },
            getPagination(page, size) {
                return {
                    size: size,
                    page: page
                }
            },
            getEquipInfo() {
                this.gqlQuery(api.getEquipList1, {}, (res) => {
                    let newData = JSON.parse(JSON.stringify(res.data.EquipList.content));
                    let eqName = newData.map(res => {
                        return res.equipArg.model
                    });
                    let endData = [];
                    eqName = Array.from(new Set(eqName));
                    eqName.forEach(item => {
                        newData.some(item1 => {
                            if (item === item1.equipArg.model) {
                                endData.push({
                                    value: item1.equipArg.model,
                                    key: {
                                        location: {
                                            number: item1.location != null ? item1.location.number : null,
                                            surface: item1.location != null ? item1.location.surface : null,
                                        },
                                        equipName: item1.name,
                                        equipModel: item1.equipArg.model,
                                    }
                                });
                                return true
                            }
                        })
                    });
                    this.restaurants = endData;
                })
            },
            submit() {
                this.$refs.form.validate.then(res => {
                    if (this.form.planEquips[this.form.planEquips.length - 1].equipModel === ''&&this.form.planEquips.length!=1) {
                        this.form.planEquips.splice(this.form.planEquips.length - 1, 1);
                    }
                    if (this.title === '新增预案' && this.form.planEquips[0]) {
                        this.form.planEquips = this.form.planEquips.map(res1 => {
                            console.log(res1);
                            if (res1.equipModel) {
                                return {equipModel: res1.equipModel}
                            }
                        });
                        savePlan(this.form).then(item => {
                            this.$refs.dialog.hide();
                            this.getList();
                            this.$message.success('新增成功');
                        }).catch(err => {
                            this.$message.error(err.message);
                        })

                    } else if (this.title === '编辑预案' && this.form.planEquips[0]) {
                        savePlan(this.form).then(item => {
                            this.$refs.dialog.hide();
                            this.getList();
                            this.$message.success('编辑成功');
                        }).catch(err => {
                            this.$message.error(err.message);
                        })
                    } else {
                        this.$message.error('请选择装备');
                    }
                }).catch(err => {
                    this.$message.error('未通过检验');
                })
            },
            submit1() {
                delectPlan(this.delId).then(res => {
                    this.$refs.dialog1.hide();
                    this.$message.success('删除成功');
                    this.getList();
                }).catch(err => {
                    this.$message.error(err.message);
                })
            },
            delList(row) {
                console.log(row);
                this.delId = row.id;
                this.$refs.dialog1.show();
            }
        },
        mounted() {
            this.getList();
        },
        watch: {
            inquire(newVal, oldVal) {
                this.param.namelike = newVal;
                console.log(newVal);
                if (newVal === '%%') {
                    this.getList();
                } else {
                    searchPlan({name: newVal}).then(res => {
                        console.log(res);
                        this.list = res;
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

    .dialogList {
        width: 90%;
        margin: 3% auto;
        max-height: 40vh;
        border: 1px solid #EBEEF5;
        border-bottom: none !important;
    }


    .secondaryTitle {
        position: relative;
        border-bottom: 1px solid #EBEEF5;
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        height: 44px;
    }

    .bodyContent {
        padding: 0 60px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .pieceList {
            width: 710px;
            height: 343px;
            background: rgb(255, 255, 255);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            margin-top: 27px;

            .top {
                padding: 20px;
                height: 40px;
                width: 100%;
                display: flex;
                align-items: center;
                font-size: 16px;
                color: rgba(112, 112, 112, 1);
            }

            .list {
                .scroll-bar {
                    max-height: 250px;
                    min-height: 250px;
                    width: 100%;
                    padding: 0 8%;
                }
            }

            .bottom {
                display: flex;
                margin-top: 10px;
                height: 40px;
                padding: 0 50px;
                color: rgba(112, 112, 112, 1);

                .bottomInfo {
                    width: 80%;
                    height: 38px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
            }
        }
    }
</style>