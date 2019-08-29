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
                    {lable: '申请编号', field: 'variables.applyOrder.number', sort: false},
                    {lable: '申请类型', field: 'variables.applyOrder.type',filter: this.filterType, sort: false},
                    {lable: '申请装备', field: 'variables.applyOrder.applyNeedEquips', filter: this.filterName, sort: false},
                    {lable: '申请人', field: 'variables.applyOrder.applicant.name', sort: false},
                    {lable: '申请时间', field: 'variables.applyOrder.applyTime', filter: this.filterTime},
                    {lable: '审批状态', field: 'variables.applyOrder.state', filter: this.filterState}
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
            urlObject:{
                type:Object,
                default(){
                    return{
                        applyUrl:{
                            doing:'/task/by-user-and-process-definition',
                            history:'/transfer-apply-order/history',
                        },
                        billUrl:'/transfer-order/by-user-and-order-state',
                        urlParamsKey:{
                            processDefinitionKey:'transfer',
                            type:'DOWN_TO_UP'
                        }
                    }
                }
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
                          {lable: '申请编号', field: 'variables.applyOrder.number', sort: false},
                          {lable: '申请类型', field: 'variables.applyOrder.type',filter: this.filterType, sort: false},
                          {lable: '申请装备', field: 'variables.applyOrder.applyNeedEquips', filter: this.filterName, sort: false},
                          {lable: '申请人', field: 'variables.applyOrder.applicant.name', sort: false},
                          {lable: '申请时间', field: 'variables.applyOrder.applyTime', filter: this.filterTime},
                          {lable: '审批状态', field: 'variables.applyOrder.state', filter: this.filterState}
                      ]
                  }else if(newVal=='transfer'||newVal=='secondment'||newVal=='returns'){
                      let name='调拨单号';
                      if(newVal=='secondment'){
                          name='借调单号'
                      }else if(newVal=='returns'){
                          name='归还单号'
                      }
                      this.labelList= [
                          {lable: name, field: 'variables.applyOrder.number', sort: false},
                          {lable: '申请类型', field: 'variables.applyOrder.type',filter: this.filterType, sort: false},
                          {lable: '申请装备', field: 'variables.applyOrder.applyNeedEquips', filter: this.filterName, sort: false},
                          {lable: '申请人', field: 'variables.applyOrder.applicant.name', sort: false},
                          {lable: '申请时间', field: 'variables.applyOrder.applyTime', filter: this.filterTime},
                          {lable: '装备状态', field: 'variables.state', filter: this.filterTransferState}
                      ]
                  }
              }
            },
            'urlObject.billUrl':{
                deep:true,
                handler(newVal){
                    this.getList(this.select,this.searchNumber);
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
                let equipList=s.variables.applyOrder.applyNeedEquips;
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
                return new Date(parseInt(nS.variables.applyOrder.applyTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            filterState(s){
                let state= s.variables.applyOrder.state;
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
                let type=s.variables.applyOrder.type;
                if(type=='UP_TO_DOWN'){
                    return '直调'
                }else if(type=='DOWN_TO_UP'){
                    return '调拨'
                }else if(type=='BORROW'){
                    return '借调'
                }else {
                    return '不知道'
                }
            },
            getList(status,search){
                let url = baseBURL+this.urlObject.billUrl;
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
                    url=url+ this.urlObject.applyUrl.doing;
                    param={startUserId:id,processDefinitionKey:this.urlObject.urlParamsKey.processDefinitionKey};
                }else {
                    url=url+ this.urlObject.applyUrl.history;
                    param={userId:id,page:page,size:size,number:search,type:this.urlObject.urlParamsKey.type};
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
                            // res.forEach(item=>{
                            //     let items=item;
                            //     list.push(items)
                            // });
                            list=res;
                            list.sort(this.compare('createTime'))
                        }else {
                            res.content.forEach(item=>{
                                list.push({variables:{applyOrder:item}})
                            });
                            this.paginator.totalPages=res.totalPages;
                        }
                        this.list=list;
                    }
                })
            },
            compare(property){
                return function(a,b){
                    let value1 = a[property];
                    let value2 = b[property];
                    return value2 - value1;
                }
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
            //         url='http://192.168.50.14:8080/warehouse/transfers/up-to-down/by-state';
            //         param={likeByNumber:likeByNumber,size:size,page:page,state:this.state}
            //     }else {
            //         url = 'http://192.168.50.14:8080/warehouse/transfers/up-to-down';
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
