<template>
    <div class="ming-xi-box">
        <div class="action-bar">
           <div class="download-box">
               <span v-text="'装备清单'" style="font-size:16px;"></span>
               <div style="margin-left: 30px;cursor:pointer;display: flex;align-items: center" @click="downloadDetails">
                   <a :href="downloadSrc" style="display: none" ref="downloadRefs">a标签</a>
                   <svg-icon icon-class="导出" style="font-size: 20px;margin-right: 5px"  ></svg-icon>
                   <span v-text="'导出'"></span>
               </div>
           </div>
            <div class="input-box">
                <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
                <input class="input" v-model="search" :placeholder="'大类/小类/型号/名称/供应商'"/>
            </div>
        </div>
        <div >
            <field-table :list="list" :labelList="labelList"
                         :tableAction="tableAction"  :pageInfo="paginator" @tableCurrentPageChanged="changePage" @clickTableCloum="clickTableCloum" style="width: 100%">
            </field-table>
        </div>
        <serviceDialog title="领还记录" ref="dialogLinghuan" width="766px" :button="false">
            <div class="table-box">
                <el-table
                        :data="tableData"
                        height="545"
                        border
                        align="center"
                        style="width: 100%">
                    <el-table-column
                            align="center"
                            label="装备名称">
                        <template slot-scope="scope">
                            {{tableEquipName}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="policeName"
                            label="操作人员">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="receiveTime"
                            label="操作时间">
                        <template slot-scope="scope">
                            {{ $filterTime(parseInt(scope.row.receiveTime)) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作状态">
                        <template slot-scope="scope">
                           {{'领取'}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import request from 'common/js/request'
    import {baseURL} from "../../api/config";
    import serviceDialog from 'components/base/gailiangban'
    export default {
        name: "equipDetails",
        components:{
            serviceDialog
        },
        data() {
            return {
                downloadSrc:baseURL+'/statistic/export-excel',
                search: '',
                list:[],
                paginator:{
                    page:1,
                    totalPages:10,
                    size:9
                },
                searchPage:'',
                tableAction:{
                    label:'领取记录',
                    button:[{name:'查看',type:'primary'}]
                },
                tableData: [],
                tableEquipName:'',
                labelList: [
                    {lable: '装备类型', field: 'genreName', sort: false},
                    {lable: '装备小类', field: 'categoryName', sort: false},
                    {lable: '装备名称', field: 'name',sort: false},
                    {lable: '装备型号', field: 'model', sort: false},
                    {lable: '装备总数', field: 'equipInfo.total', sort:false},
                    {lable: '在库数量', field: 'equipInfo.inHouseCount'},
                    {lable: '出库数量', field: 'equipInfo.outHouseCount'},
                    {lable: '装备总价', field: 'equipInfo.price'},
                    {lable: '供应商', field: 'supplierName'}
                ]
            }
        },
        watch: {
            'search': {
                handler(oldVal,newVal) {
                    this.paginator.page=1;
                    this.getList();
                }
            },
            'paginator.page':{
                handler(newval) {
                    this.getList();
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            filterPrice(s){
                return Number(s.equipInfo.price)/100
            },
            // toChange(data) {
            //     this.selectCategory = '';
            //     this.$emit('changeGener', data);
            // },
            // toChangeCategory(data) {
            //     this.$emit('changeCategory', data);
            // },
            // changeDate(date) {
            //     let flag=false;
            //     let startTime,endTime;
            //     let nowDate = new Date();
            //     let nowMonth = nowDate.getMonth();
            //     let nowYear = nowDate.getFullYear();
            //     let isSameMoth = this.isSameMoth(date);
            //     let isThisMonth = this.isThisMonth(date,nowMonth,nowYear);
            //     let isExceed = this.isExceed(date,nowMonth,nowYear);
            //     if(isExceed){
            //         if(isSameMoth){
            //             startTime=this.getStartTime(date);
            //             if(isThisMonth){
            //                 endTime=nowDate;
            //                 console.log('aaa',endTime);
            //             }else {
            //                 endTime=this.getEndTime(date);
            //             }
            //         }else {
            //             startTime=date[0];
            //             if(isThisMonth){
            //                 endTime=nowDate;
            //             }else {
            //                 let year = date[1].getFullYear();
            //                 let month= date[1].getMonth();
            //                 endTime=new Date(year,month+1,1,0);
            //             }
            //         }
            //         flag=true;
            //     }else {
            //         this.date=[];
            //         this.$message.error('不可超出当前时间')
            //     }
            //     if(flag){
            //         this.$emit('changeDate',{startTime:startTime,endTime:endTime})
            //     }
            //     //  let year = data.getFullYear();
            //     //  let month= data.getMonth();
            //     //  let flag = true
            //     //  let startTime,endTime;
            //     //  if(nowYear==year&&nowMonth==month){
            //     //      endTime = date;
            //     //  }else if(nowYear<year||nowMonth<month){
            //     //      this.$message.warning('不可超出当前时间');
            //     //      flag=false
            //     //  }else {
            //     //      endTime = new Date(year,month+1,1,0);
            //     //  }
            //     // if(flag){
            //     //     startTime = data;
            //     //     this.$emit('changeDate',{startTime:startTime,endTime:endTime})
            //     // }
            // },
            // getEndTime(date){
            //     let year = date[0].getFullYear();
            //     let month= date[0].getMonth();
            //     return new Date(year,month+1,1,0);
            // },
            // getStartTime(date){
            //     let year = date[0].getFullYear();
            //     let month= date[0].getMonth();
            //     return new Date(year,month,1,0);
            // },
            // isThisMonth(date,nowMonth,nowYear){
            //     let year = date[1].getFullYear();
            //     let month = date[1].getMonth();
            //     if(nowMonth==month&&nowYear==year){
            //         return true
            //     }else {
            //         return false
            //     }
            // },
            // isSameMoth(date) {
            //     let date0 = date[0].getMonth();
            //     let date1 = date[1].getMonth();
            //     if (date0 == date1) {
            //         return true
            //     } else {
            //         return false
            //     }
            // },
            // isExceed(date,nowMonth,nowYear) {
            //     let year = date[1].getFullYear();
            //     let month = date[1].getMonth();
            //     if(nowYear<year||(nowYear==year&&nowMonth<month)){
            //         return false
            //     }else {
            //         return true
            //     }
            // },
            // init() {
            //     if (this.title == '装备使用频次'||this.title == '装备损耗率'||this.title == '装备维修率') {
            //         let date0 = new Date();
            //         let date1 = new Date();
            //         this.date = [date0,date1];
            //         this.viewStatus.dateFlag = true
            //     }
            //     if (this.selectDefault != '') {
            //         let item = this.genre.filter(item => item.name == this.selectDefault);
            //         this.selectGener = item[0].name;
            //         this.$emit('changeGener', item[0].id);
            //     }
            //     if (this.title == '库存统计') {
            //     } else {
            //         this.viewStatus.flag = false
            //     }
            // }
            downloadDetails(){
                this.$refs.downloadRefs.click();
            },
            // filterTime(nS) {
            //     console.log(nS);
            //     return new Date(parseInt(nS.receiveTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            // },
            submit(){

            },
            changePage(data){
                this.paginator.page=data;
            },
            getList(){
                let url = baseURL+'/equip-arg-statistic';
                request({
                    method:'get',
                    url:url,
                    params:{page:this.paginator.page,size:this.paginator.size,search:this.search}
                }).then(res=>{
                    this.paginator.totalPages=res.totalPages;
                    this.list=res.content;
                    console.log(res);
                })
            },
            getLinghuanList(id){
              let url = baseURL+'/equip-arg-statistic/receive-equips-by-equip-arg';
                request({
                    method:'get',
                    url:url,
                    params:{equipArgId:id}
                }).then(res=>{
                   console.log('getLinghuanList',res);
                   this.tableData=[];
                   this.tableData=res;
                    this.$refs['dialogLinghuan'].show();

                })
            },
            clickTableCloum(data){
                this.tableEquipName=data.row.name;
                this.getLinghuanList(data.row.id);
                // this.$refs['dialogLinghuan'].show();
            },

        }
    }
</script>

<style scoped>

    .ming-xi-box {
        width: 100%;
    }
    .ming-xi-box .ming-xi-list {
        width: 100%;
        margin-top: 20.0064px;
    }

    .ming-xi-box .ming-xi-date {
        display: flex;
        align-items: center;
        padding-left: 0.0938rem;
        padding-top: 0.0885rem;

        color: #707070;
    }

    .ming-xi-list .ming-xi-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
    }

    .ming-xi-list .select-item {
        background: rgba(59, 134, 255, 0.31);
    }

    .ming-xi-box .action-bar {
        padding-right: 0.1198rem;
        margin-top: 8px;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        font-family: "PingFang SC";
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        padding-left: 18px;
        width: 100%;
        color: #707070;
    }

    .action-bar .download-box{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .action-bar .input-box {
        width: 285px;
        position: relative;
    }

    .input-box .input {
        width: 100%;
        height: 38px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(112, 112, 112, 1);
        opacity: 1;
        border-radius: 19px;
        padding-left: 15px;
        outline: medium;
        color: #707070;
    }

    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #BBBBBB;
    }

    .input-box .icon-search {
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }

    .ming-xi-box .ming-xi-select {
        display: flex;
        padding-top: 17px;
        padding-right: 23px;
        padding-left: 17px;
        color: #707070;
    }

    .ming-xi-select .select-type {
        margin-left: 18px;
    }
</style>