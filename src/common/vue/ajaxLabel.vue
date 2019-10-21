<template>
    <div class="label">
        <div>
            <field-table :list="list" :labelList="table.labelList"
                         :tableAction="table.tableAction"  :pageInfo="paginator" @tableCurrentPageChanged="changePage" @clickTableCloum="clickTableCloum" style="width: 100%">
            </field-table>
        </div>
    </div>
</template>

<script>
    import {baseURL} from "../../api/config";
    import request from 'common/js/request'
    export default {
        name: "labels",
        data(){
            return{
                list:[],
                paginator: {
                    page: 1,
                    totalPages: 10,
                    size: 9
                }
            }
        },
        props:{
            table:{
                type:Object
            },
            tableFlag:{
                type:Boolean,
                default:true
            }
        },
        watch:{
            'table.search':{
                deep:true,
                handler(newVal,oldVal) {
                    if(this.paginator.page!=1){
                        this.paginator.page=1
                    }else {
                        this.getList()
                    }
                }
            },
            'paginator.page':{
                deep:true,
                handler(newVal,oldVal) {
                    this.getList()
                }
            },

        },
        mounted(){
            if(this.table.flag){}else {
                this.getList()
            }
        },
        methods:{
            getList(){
                let url=baseURL+this.table.url;
                let paramskey={page:this.paginator.page,size: this.paginator.size,search:this.table.search};
                let params={};
                if(this.table.params!=null){
                    params={...paramskey,...this.table.params};
                }else {
                    params={...paramskey};
                }
                request({
                    method:'get',
                    url: url,
                    params: params
                }).then(res=>{
                    this.list=[];
                    this.list=res.content;
                    this.paginator.totalPages=res.totalPages
                })
            },
            changePage(data) {
                this.paginator.page = data;
            },
            clickTableCloum(data){
                this.$emit('clickTable',data);
            }
        }
    }
</script>

<style scoped>
    .label{
        width: 100%;
    }
</style>