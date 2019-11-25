<template>
    <div class="plan">
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
                                    <svg-icon icon-class="编辑" style="margin-right: 0.0625rem;font-size: 0.0833rem"/>
                                </el-button>
                                <span>预案名称:</span>
                                <span style="margin-left: 0.0521rem">{{item.name}}</span>
                            </div>
                            <el-button type="text" icon="el-icon-close" @click="delList(item)"
                                       style="color: #7f7f7f;font-size: 0.1042rem">
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

                    <!-- <div class="_box-bottom" v-if="this.list!=''">1111
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :page-size="4"
                                @current-change="paginationChange"
                                :total="total">
                        </el-pagination>
                    </div> -->
                <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>

                </div>
            </div>
        </el-card>

        <servicedialog :title="title" ref="dialog" @confirm="submit" width="900px">
            <form-container ref="form" :model="form" class="formList">
                <field-input v-model="form.name" label="预案名称 :" width="4" :rules="r(true).all(R.require)"
                             prop="name"></field-input>

                <el-table :data="form.planEquips" fit class="dialogList" height="360">
                     <el-table-column label="序号" align="center">
                        <template scope="scope">
                            <span>001</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="装备名称" align="center">
                        <template scope="scope">
                            <el-select v-model="scope.row.equipName" value-key="id" > 
                                <el-option
                                v-for="item in nameList"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                     <el-table-column label="装备型号" align="center" >
                        <template scope="scope">
                          <el-select v-model="scope.row.equipModel" value-key="id" @change="qaq(scope,$event)">
                                <el-option
                                v-for="item in modelList"
                                :key="item.id"
                                :label="item.model"
                                :value="item">
                                </el-option>
                            </el-select>
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
    import {getPlanList, savePlan, delectPlan, searchPlan, getEquipList} from "api/plan"
    import api from 'gql/home.gql'

    export default {
        data() {
            return {
                inquire: '',
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                list: [],
                form: {
                    planEquips: [{equipModel: '', location: {}}]
                },
                restaurants: [],
                title: '',
                delId: '',
                equipList:[],
                value:'',
                modelValue:'',
                nameList:[],
                modelList:[]
            }
        },
        mixins: [formRulesMixin, transformMixin],
        components: {
            servicedialog
        },
        methods: {
            changePage(page) {
                this.paginator.page = page
                this.getSupplierList()
            },

            qaq(row, data) {
                let tempData = JSON.parse(JSON.stringify(data))
                //this.form.planEquips[row] = data.key;
                this.form.planEquips[row.$index].equipModel = data.key.equipModel
                this.form.planEquips[row.$index].equipName = data.key.equipName
                this.form.planEquips[row.$index].location = data.key.location
                
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
                    this.form.planEquips.push({equipModel: '', location: {}});
                }
                this.getEquipInfo();

                this.$refs.dialog.show();
            },
            getList() {
                let params = {page: this.paginator.page, size: this.paginator.size}
                getPlanList(params).then(res => {
                    this.list = res.content;
                    this.total = res.totalElements;
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                }).catch(err => {
                    console.log(err);
                })
            },
            changeModel(data){
               this.modelList=[]
               this.equipList.forEach(item=>{
                   if(this.value==item.name)
                   {
                       this.modelList.push(item)
                       console.log("this.modelList");
                       console.log(this.modelList);
                   }
               })
            },
            getEquipInfo() {
                getEquipList().then(res => {
                    this.equipList=res;
                    res.forEach(item=>{
                        let flag=false;
                        for(var i=0;i<this.nameList.length;i++)
                        {
                            if(item.name==this.nameList[i])
                            {
                                flag=true
                            }
                        }
                        if(!flag)
                        {
                        this.nameList.push(item.name)
                        }
                        
                    })
                    console.log("this.equipList");
                    console.log(this.equipList);
                    console.log("this.nameList");
                    console.log(this.nameList);
                    let newData =res.content;
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
            value(newVal){
               this.changeModel(newVal)
            },
            // modelValue()
            // {
            //   this.qaq()
            // },
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
    .plan {
        font-size: 0.0833rem;
    }

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
        height: 0.2292rem;
    }

    .bodyContent {
        height: 3.55rem;
        padding: 0 0.3125rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .pieceList {
            width: 3.6979rem;
            height: 1.7865rem;
            background: rgb(255, 255, 255);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            margin-top: 0.1406rem;

            .top {
                padding: 0.1042rem;
                height: 0.2083rem;
                width: 100%;
                display: flex;
                align-items: center;
                font-size: 0.0833rem;
                color: rgba(112, 112, 112, 1);
            }

            .list {
                .scroll-bar {
                    max-height: 1.3021rem;
                    min-height: 1.3021rem;
                    width: 100%;
                    padding: 0 8%;
                }
            }

            .bottom {
                display: flex;
                margin-top: 0.0521rem;
                height: 0.2083rem;
                padding: 0 0.2604rem;
                color: rgba(112, 112, 112, 1);

                .bottomInfo {
                    width: 80%;
                    height: 0.1979rem;
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