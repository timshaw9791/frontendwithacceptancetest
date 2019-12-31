<template>
    <div class="label">
        <div>
            <field-table :list="list" :labelList="table.labelList" :buttonState="buttonState"
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
                    size: 10
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
            },
            buttonState: {
                type: Boolean,
                default: false
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
            getAgain() { // 外部调用刷新
                this.getList()
            },
            getList(){
                let url=baseURL+this.table.url;
                let paramskey={page:this.paginator.page,size: this.paginator.size,search:this.table.search, direction: "DESC",properties: "updateTime"};
                let params={};
                params={...paramskey};
                request({
                    method:'get',
                    url: url,
                    params: params
                }).then(res=>{
                    this.list=[];
                    this.list=res.content.map(item => {
                        if(item.serial == '""') {
                            item = Object.assign({}, item, {serial: ''})
                        } else if(item.equipInOutHouseDetails) {
                            let arr = [], str = null;
                            item.equipInOutHouseDetails.forEach(item => {
                                arr.push(item.name)
                            })
                            //str = this._.truncate(this._.uniq(arr).join(','), {'length': 24,'separator': /,? +/})
                            item = Object.assign({}, item, {equips: this._.truncate(this._.uniq(arr).join(','), {'length': 9,'separator': /,?/})})
                        }
                        return item
                    });
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

<style lang="scss" scoped>
    .label{
        width: 100%;
        ::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(47,47,118,0.37);
            border-radius: 20px;
        }
    }
</style>