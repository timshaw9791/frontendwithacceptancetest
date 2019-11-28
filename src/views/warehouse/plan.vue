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
                                    <el-table :data="item.equipArgItemList" fit>
                                        <!-- <bos-table-column lable="序号" 
                                                          ></bos-table-column>
                                        <bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>
                                        <bos-table-column lable="装备型号"
                                                          field="equipArg.model"
                                                          ></bos-table-column> -->
                            <el-table-column label="序号" align="center"  min-width="'3.75rem'" >
                                <template slot-scope="scope">
                                 {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="装备名称" align="center"  min-width="'3.75rem'" >
                                <template slot-scope="scope">
                                <span>{{scope.row.equipArg.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="装备型号" align="center"  min-width="'3.75rem'" >
                                <template slot-scope="scope">
                                <span>{{scope.row.equipArg.model}}</span>
                                </template>
                            </el-table-column>    
                                    </el-table>
                                </div>
                            </el-scrollbar>
                        </div>
                        <div class="bottom">
                            预案备注：
                            <div class="bottomInfo">
                                {{item.remark}}
                            </div>
                        </div>
                    </div>       

                </div>
                <div class="page">
                        <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
                    </div>
            </div>
        </el-card>

        <servicedialog :title="title" ref="dialog" @confirm="submit" width="900px">
            <form-container ref="form" :model="form" class="formList">
                <field-input v-model="form.name" label="预案名称 :" width="4" :rules="r(true).all(R.require)"
                             prop="name"></field-input>

                <el-table :data="form.equipArgItemList" fit class="dialogList" height="360">
                     <el-table-column label="序号" align="center">
                        <template scope="scope">
                            <span>{{scope.$index+1}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="装备名称" align="center" >
                        <template scope="scope">
                            <el-select v-model="scope.row.equipArg.name" value-key="id" @change="changeModel(scope.row.equipArg.name)"> 
                                <el-option
                                v-for="item in nameList"
                                :label="item"
                                :value="item"
                                :key="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                     <el-table-column label="装备型号" align="center" >
                        <template scope="scope">
                          <el-select v-model="scope.row.equipArg.model" value-key="id" @change="qaq(scope,$event,title)">
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

                <field-input v-model="form.remark" label="预案备注 :" width="9.6" type="textarea"></field-input>
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
    import {getPlanList, savePlan, delectPlan, searchPlan, getEquipList,updatePlan} from "api/plan"
    import api from 'gql/home.gql'

    export default {
        data() {
            return {
                inquire: '',
                paginator: {size: 6, page: 1, totalPages: 5, totalElements: 5},
                list: [],
                form: {
                    equipArgItemList: [{equipArg: '', location: {}}]
                },
                restaurants: [],
                title: '',
                delId: '',
                equipList:[],
                value:'',
                modelValue:'',
                nameList:[],
                modelList:[],
                params:{size: 6, page: 1,name:''}
            }
        },
        mixins: [formRulesMixin, transformMixin],
        components: {
            servicedialog
        },
        methods: {
            changePage(page) {
                this.paginator.page = page
                this.getList()
            },

            qaq(row, data,title) {
                console.log("title"+title)
                console.log("row")
                console.log(row)
                console.log("data")
                console.log(data);
                let tempData = JSON.parse(JSON.stringify(data))
                this.form.equipArgItemList[row] = data;
                
                this.form.equipArgItemList[row.$index].equipArg.model = data.model
                this.form.equipArgItemList[row.$index].equipArg.name = data.name
                this.form.equipArgItemList[row.$index].location = data.location
                if(title=='新增预案')
                {
                    if (row.$index === this.form.equipArgItemList.length - 1) {
                    this.form.equipArgItemList.push({equipArg: {name:'',model:''}, location: {}});
                }
                }
                if(title='编辑预案')
                {
                    if (row.$index === this.form.equipArgItemList.length - 1) {
                    this.form.equipArgItemList.push({equipArg: {name:''}, location: {}});
                }
                }

            },

            delqaq(row) {
                if (this.form.equipArgItemList.length > 1) {
                    this.form.equipArgItemList.splice(row.$index, 1);
                } else {
                    this.$message.error('不能删除最后一个');
                }
            },
            dialogShow(type, item) {
                if (type === 'add') {
                    this.title = '新增预案';
                    console.log(this.title)
                    this.$set(this.form,'name','');
                    this.$set(this.form,'remark','');
                    this.form['equipArgItemList'] = [{equipArg: {name:'',model:''}, location: {}}];
                    

                } else if (type === 'up') {
                    this.title = '编辑预案';
                    console.log(item);
                    this.form = JSON.parse(JSON.stringify(item));
                    this.form.equipArgItemList.push({equipArg: {name:''}, location: {}});
                    console.log("this.form.equipArgItemList");
                    console.log(this.form.equipArgItemList);
                   
                }
               this.getEquipInfo();
               this.$refs.dialog.show();
            },
            getList() {
                this.params.page=this.paginator.page
                this.params.size=this.paginator.size
                searchPlan(this.params).then(res => {
                    console.log("res++++++++++++++++++7")
                    
                    this.list = res.content;
                    console.log(this.list)
                    this.total = res.totalElements;
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                }).catch(err => {
                    console.log(err);
                })
            },
            changeModel(data){
                console.log("出发我")
                console.log(data);
                this.modelList=[]
               this.equipList.forEach(item=>{
                   if(data==item.name)
                   {
                       this.modelList.push(item)
                       console.log("this.modelList");
                       console.log(this.modelList);
                   }
               })
            },
            getEquipInfo() {
                getEquipList().then(res => {
                    console.log("这里是获得装备信息")
                    console.log(res);
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

                })

            },
            submit() {
                console.log("this.form.equipArgItemList")
                console.log(this.form.equipArgItemList)
                this.$refs.form.validate.then(res => {
                    if (this.form.equipArgItemList[this.form.equipArgItemList.length - 1].equipArg.name === ''&&this.form.equipArgItemList.length!=1) {
                        this.form.equipArgItemList.splice(this.form.equipArgItemList.length - 1, 1);
                    }
                    if (this.title === '新增预案' && this.form.equipArgItemList[0]) {
                       this.form.equipArgItemList.forEach(item=>{
                            console.log("this.form.equipArgItemList");
                            console.log(item)
                            if(item.equipArg.id==undefined)
                            {
                                this.equipList.forEach(it=>{
                                    if(item.equipArg.name==it.name&&item.equipArg.model==it.model)
                                    {
                                        item.equipArg=it;
                                    }
                                })
                            }
                        })
                        console.log("this.form")
                        console.log(this.form)
                        savePlan(this.form).then(item => {
                            this.$refs.dialog.hide();
                            this.getList();
                            this.$message.success('新增成功');
                        }).catch(err => {
                            this.$message.error(err.message);
                        })

                    } else if (this.title === '编辑预案' && this.form.equipArgItemList[0]) {
                        if (this.form.equipArgItemList[this.form.equipArgItemList.length - 1].equipArg.name === ''&&this.form.equipArgItemList.length!=1) {
                        this.form.equipArgItemList.splice(this.form.equipArgItemList.length - 1, 1);
                    }
                        console.log("this.form")
                        console.log(this.form)
                        //  this.form.equipArgItemList = this.form.equipArgItemList.map(res1 => {
                        //      console.log("map++++++++++++++++++")
                        //     console.log(res1);
                        //     if (res1.equipArg.id==undefined) {
                        //         this.equipList.forEach(item=>{
                        //             if(item.name==res1.equipArg.name&&item.name==res1.equipArg.model)
                        //             {
                        //                 return {equipArg:item}
                        //             }
                        //         })
                        //     }else{

                        //     }
                        //     console.log("neWres1")
                        //     console.log(res1)
                        // });
                        this.form.equipArgItemList.forEach(item=>{
                            console.log("this.form.equipArgItemList");
                            console.log(item)
                            if(item.equipArg.id==undefined)
                            {
                                this.equipList.forEach(it=>{
                                    if(item.equipArg.name==it.name&&item.equipArg.model==it.model)
                                    {
                                        item.equipArg=it;
                                    }
                                })
                            }
                        })
                        console.log("this.form")
                        console.log(this.form)
                        updatePlan(this.form).then(item => {
                            this.$refs.dialog.hide();
                            this.getList();
                            this.$message.success('编辑成功');
                        }).catch(err => {
                            console.log("err");
                            console.log(err);
                            this.$message.error(err.message);
                        })
                    } else {
                        this.$message.error('请选择装备');
                    }
                }).catch(err => {
                    console.log("err");
                            console.log(err);
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
          
            // modelValue()
            // {
            //   this.qaq()
            // },
            inquire(newVal, oldVal) {
            
                this.params.name = newVal;
                console.log(newVal);
                // if (newVal === '%%') {
                //     this.getList();
                // } else {
                //     console.log("触发我")
                //     searchPlan({page: this.paginator.page, size: this.paginator.size,name: newVal}).then(res => {
                //         console.log(res.content);
                //         this.list = res.content;
                //     })
                // }
                this.getList()
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
        margin: 0 auto;
        height: 720px;
        width:1100px;
        // padding: 0 0.3125rem;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;

        .pieceList {
           
            width:350px;
            height:280px;
            margin-left: 10px;
            background: rgb(255, 255, 255);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            margin-top: 0.1406rem;

            .top {
                // padding: 0.1042rem;
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
                // padding: 0 0.2604rem;
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
        .page{
            height: 50px;
            border: 1px solid black;
            width:480px;
            
        }
    }
</style>