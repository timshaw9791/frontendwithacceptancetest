<template>
    <div class="transferTable">
        <div class="table">
            <field-table :list="list" :labelList="labelList"
                         :tableAction="tableAction" :havePage="havePage" @sortChange="sortChange"  :pageInfo="paginator" @tableCurrentPageChanged="changePage" @clickTableCloum="clickTableCloum" style="width: 100%">
            </field-table>
        </div>
    </div>
</template>

<script>
    import request from 'common/js/request'
    import transferComponent from './transferTableComponent'
    import {baseBURL} from "../../../api/config";

    export default {
        name: "transferTable",
        components:{
            transferComponent
        },
        data(){
            return{
                list:[],
                paginator:{
                    page:1,
                    totalPages:10,
                    size:9
                },
                tableAction:{
                    label:'操作',
                    button:['查看']
                },
                labelList: [
                    {lable: '申请编号', field: 'variables.transferApplyOrder.number', sort: false},
                    {lable: '申请类型', field: 'variables.transferApplyOrder.type',filter: this.filterType, sort: false},
                    {lable: '申请装备', field: 'variables.transferApplyOrder.transferNeedEquip', filter: this.filterName, sort: false},
                    {lable: '申请人', field: 'variables.transferApplyOrder.applicant.name', sort: false},
                    {lable: '申请时间', field: 'variables.transferApplyOrder.applyTime', filter: this.filterTime},
                    {lable: '审批状态', field: 'variables.transferApplyOrder.state', filter: this.filterState}
                ]
            }
        },
        props:{
            searchNumber:{
                type:String,
                default:''
            },
            state:{
                type:String
            },
            havePage:{
              type:Boolean,
              default:true
            },
            select:{
              type:String
            },
            typeSingle:{
              type:String
            },
            indexDefault:{
              type:String,
            },
            table:{
                type:Object,
                default(){
                    return{
                        configure:[
                            {prop:'id',lable:'RFID',sortable:false,formatter:false},
                            {prop:'name',lable:'装备名称',sortable:false,formatter:false},
                            {prop:'number',lable:'装备序列',sortable:false,formatter:false},
                            {prop:'user',lable:'操作人员',sortable:false,formatter:false},
                            {prop:'timer',lable:'操作时间',sortable:true,formatter:false},
                            {prop:'state',lable:'装备状态',sortable:false,formatter:false}
                        ]
                    }
                }
            }
        },
        watch:{
            'searchNumber':{
                deep:true,
                handler(newVal,oldVal){
                    this.paginator.page=1;
                    // this.getList()
                    if(newVal==''&&oldVal!=''){
                        this.getList(this.select,newVal);
                    }else if(newVal!=''){
                        this.getList(this.select,newVal);
                    }

                }
            },
            'state':{
                handler(newVal){
                    this.paginator.page=1;
                    // this.getList()
                }
            },
            'havePage':{
                handler(newVal){
                    this.paginator.page=1;
                }

            },
            // 'indexDefault':{
            //   handler(newVal){
            //       if(newVal=='进行中'){
            //
            //       }
            //   }
            // },
            'typeSingle':{
              handler(newVal){
                  if(newVal=='apply'){
                      this.labelList= [
                          {lable: '申请编号', field: 'variables.transferApplyOrder.number', sort: false},
                          {lable: '申请类型', field: 'variables.transferApplyOrder.type',filter: this.filterType, sort: false},
                          {lable: '申请装备', field: 'variables.transferApplyOrder.transferNeedEquip', filter: this.filterName, sort: false},
                          {lable: '申请人', field: 'variables.transferApplyOrder.applicant.name', sort: false},
                          {lable: '申请时间', field: 'variables.transferApplyOrder.applyTime', filter: this.filterTime},
                          {lable: '审批状态', field: 'variables.transferApplyOrder.state', filter: this.filterState}
                      ]
                  }else if(newVal=='transfer'){
                      this.labelList= [
                          {lable: '调拨单号', field: 'variables.transferApplyOrder.number', sort: false},
                          {lable: '申请类型', field: 'variables.transferApplyOrder.type',filter: this.filterType, sort: false},
                          {lable: '申请装备', field: 'variables.transferApplyOrder.transferNeedEquip', filter: this.filterName, sort: false},
                          {lable: '申请人', field: 'variables.transferApplyOrder.applicant.name', sort: false},
                          {lable: '申请时间', field: 'variables.transferApplyOrder.applyTime', filter: this.filterTime},
                          {lable: '装备状态', field: 'variables.state', filter: this.filterTransferState}
                      ]
                  }
              }
            },
            'select':{
                handler(newVal){
                    // let url = baseBURL+'/transfer-order/by-user-and-order-state';
                    // if(newVal=='进行中'){
                    //     this.getApplyList('doing');
                    // }else if(newVal=='已结束'){
                    //     this.getApplyList('end');
                    // }else if(newVal=='全部'||newVal=='All'){
                    //     this.getTransferList('all',url)
                    // }else {
                    //     this.getTransferList(newVal,url)
                    // }
                    this.getList(newVal,this.searchNumber);
                }
            }
        },
        created(){
            this.getApplyList('doing','');
        },
        methods: {
            sortChange(data){
                /*this.$emit('sortCondition',data)*/
            },
            changePage(data){
                this.paginator.page=data;
            },
            clickTableCloum(data){
                this.$emit('toSee',data)
            },
            filterName(s){
                let equipList=s.variables.transferApplyOrder.transferNeedEquip;
                let name='';
                equipList.forEach(item=>{
                    let small=item.model+item.name;
                    if(name==''){
                        name=small
                    }else {
                        name=name+','+small
                    }
                });
                if(name.length>12){

                    name=name.substring(0, 11)+'...'
                }
                return name
                // let name='';
                // s.orderItems.forEach(item=>{
                //     name=name+','+item.model+item.name
                // });
                // return name.substr(1, name.length);
            },
            filterTime(nS) {
                return new Date(parseInt(nS.variables.transferApplyOrder.applyTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            filterState(s){
                let state= s.variables.transferApplyOrder.state;
                if(state=='UNDER_REVIEW'){
                    return '审核中'
                }else if(state=='REJECTED'){
                    return '已驳回'
                } else if(state=='PASS'){
                    return '已通过'
                }else {
                    return '作废'
                }
            },
            filterTransferState(s){
                let state= s.variables.state;
                if(state=='WITHOUT_OUT_HOUSE'){
                    return '未出库'
                }else if(state=='OUT_HOUSE'){
                    return '已出库'
                } else if(state=='IN_HOUSE'){
                    return '已入库'
                }
            },
            filterType(s){
                let type=s.variables.transferApplyOrder.type;
                if(type=='UP_TO_DOWN'){
                    return '直调'
                }else if(type=='DOWN_TO_UP'){
                    return '调拨'
                }else {
                    return '不知道'
                }
            },
            getList(status,search){
                let url = baseBURL+'/transfer-order/by-user-and-order-state';
                if(status=='进行中'){
                    this.getApplyList('doing','');
                }else if(status=='已结束'){
                    this.getApplyList('end',search);
                }else if(status=='全部'||status=='All'){
                    this.getTransferList('all',url,search)
                }else {
                    this.getTransferList(status,url,search)
                }
            },
            getApplyList(status,search){
                let page=this.paginator.page;
                let size=this.paginator.size;
                let id=JSON.parse(localStorage.getItem('user')).id;
                let param={};
                let url=baseBURL;
                if(status=='doing'){
                    url=url+ '/task/by-user-and-process-definition';
                    param={startUserId:id,processDefinitionKey:'transfer'};
                }else {
                    url=url+ '/transfer-apply-order/history';
                    param={userId:id,page:page,size:size,number:search,transferType:'DOWN_TO_UP'};
                }
                request({
                    method:'get',
                    url:url,
                    params:param
                }).then(res=>{
                    if(res){
                        let list=[];
                        // this.paginator.totalPages=res.totalPages;
                        if(status=='doing'){
                            res.forEach(item=>{
                                let items=item;
                                list.push(items)
                            });
                        }else {
                            res.content.forEach(item=>{
                                list.push({variables:{transferApplyOrder:item}})
                            });
                            this.paginator.totalPages=res.totalPages;
                        }
                        this.list=list;
                    }
                })
            },
            getTransferList(status,url,search){
                let page=this.paginator.page;
                let size=this.paginator.size;
                let id=JSON.parse(localStorage.getItem('user')).id;
                let param={};
                if (status == 'all'){
                    if(this.search==''){
                        param={page:page,size:size,userId:id};
                    }else {
                        param={number:search,page:page,size:size,userId:id};
                    }
                }else {
                    param={number:search,page:page,size:size,userId:id,state:status};
                }

                // if(status=='doing'){
                //     url=url+'/task/by-user-and-process-definition';
                //     param={userId:JSON.parse(localStorage.getItem('user')).id,processDefinitionKey:'transfer'};
                // }else {
                //     url=url+'/transfer-apply-order/by-user-and-number-like';
                //     param={userId:JSON.parse(localStorage.getItem('user')).id,page:page,size:size,number:'201907305038'};
                // }
                request({
                    method:'get',
                    url:url,
                    params:param
                }).then(res=>{
                    if(res){
                        let list=[];
                        // this.paginator.totalPages=res.totalPages;
                        if(status=='doing'){
                            list=res;
                        }else {
                            res.content.forEach(item=>{
                                list.push({variables:item})
                            });
                            this.paginator.totalPages=res.totalPages;
                        }
                        this.list=list;
                    }
                })
            },
            // getList(){
            //     let page=this.paginator.page;
            //     let size=this.paginator.size;
            //     let likeByNumber=this.search;
            //     let param={};
            //     let url='';
            //     if(this.state!='ALL'&&this.state!=''){
            //         url='http://192.168.125.117:8080/warehouse/transfers/up-to-down/by-state';
            //         param={likeByNumber:likeByNumber,size:size,page:page,state:this.state}
            //     }else {
            //         url = 'http://192.168.125.117:8080/warehouse/transfers/up-to-down';
            //         param={likeByNumber:likeByNumber,size:size,page:page}
            //     }
            //     request({
            //         method:'get',
            //         url:url,
            //         params:param
            //     }).then(res=>{
            //         if(res){
            //             this.paginator.totalPages=res.totalPages;
            //             this.list=res.content;
            //         }
            //     })
            // }
        }
    }
</script>

<style scoped>
    .transferTable{
        width: 100%;
    }
    .transferTable .table{

    }
</style>
