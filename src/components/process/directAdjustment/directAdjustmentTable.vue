<template>
    <div class="directAdjustmentTable">
        <div class="table">
            <field-table :list="list" :labelList="labelList"
                         :tableAction="tableAction" @sortChange="sortChange"  :pageInfo="paginator" @tableCurrentPageChanged="changePage" @clickTableCloum="clickTableCloum" style="width: 100%">
            </field-table>
        </div>
    </div>
</template>

<script>
    import request from 'common/js/request'
    import {baseURL} from "../../../api/config";

    export default {
        name: "directAdjustmentTable",
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
                    {lable: '调拨单号', field: 'number', sort: false},
                    {lable: '申请大类', field: 'type',filter: this.filterType, sort: false},
                    {lable: '申请装备', field: 'orderItems', filter: this.filterName, sort: false},
                    {lable: '申请人', field: 'applicant', sort: false},
                    {lable: '申请时间', field: 'applyTime', filter: this.filterTime},
                    {lable: '装备状态', field: 'state', filter: this.filterState}
                ]
            }
        },
        props:{
            search:{
              type:String
            },
            state:{
              type:String
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
          'search':{
              deep:true,
              handler(newVal){
                  this.paginator.page=1;
                  this.getList()
              }
          },
            'state':{
                handler(newVal){
                    this.paginator.page=1;
                    this.getList()
                }
            }
        },
        created(){
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
                let name='';
                s.orderItems.forEach(item=>{
                   name=name+','+item.model+item.name
                });
                return name.substr(1, name.length);
            },
            filterTime(nS) {
                return new Date(parseInt(nS.applyTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            filterState(s){
                if(s.state=='IN'){
                    return '未出库'
                }else {
                    return '已出库'
                }
            },
            filterType(s){
              if(s.type=='UP_TO_DOWN'){
                  return '直调'
              }else {
                  return '不知道'
              }
            },

            getList(){
                let page=this.paginator.page;
                let size=this.paginator.size;
                let likeByNumber=this.search;
                let param={};
                let url='';
                if(this.state!='ALL'&&this.state!=''){
                    url=baseURL+'/transfers/up-to-down/by-state';
                    param={likeByNumber:likeByNumber,size:size,page:page,state:this.state}
                }else {
                    url = baseURL+'/transfers/up-to-down';
                    param={likeByNumber:likeByNumber,size:size,page:page}
                }
                request({
                    method:'get',
                    url:url,
                    params:param
                }).then(res=>{
                    if(res){
                        this.paginator.totalPages=res.totalPages;
                        this.list=res.content;
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .directAdjustmentTable{
        width: 100%;
    }
    .directAdjustmentTable .table{

    }
</style>
