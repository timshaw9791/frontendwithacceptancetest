<template>
    <div class="opening-box" v-if="!show">
        <div class="action-bar">
            <div>
                {{this.$filterTime(parseInt(this.infolist.createTime))}}的保养装备详情
            </div>
        </div>
        <div width="6.4895rem">
            <el-table :data="list">
                <!-- <bos-table-column  v-for="item in table.labelList" 
                                    :lable="item.lable" :sort="item.sort" 
                                    :field="item.field" :filter="item.filter"
                ></bos-table-column> -->
                <bos-table-column lable="装备名称" field="equipInfo.equipName"
                ></bos-table-column>
                <bos-table-column lable="装备型号" field="equipInfo.model"
                ></bos-table-column>
                <bos-table-column lable="供应商" field="supplierInfo.supplierName"
                ></bos-table-column>
                <bos-table-column lable="联系人" field="supplierInfo.person"
                ></bos-table-column>
                <bos-table-column lable="联系方式" field="supplierInfo.phone"
                ></bos-table-column>
                <bos-table-column lable="保养周期" field="equipInfo.duration":filter="(ns) => parseInt((ns.equipInfo.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))+'小时'"
                ></bos-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div class="fold_title">
                            <div class="fold_title_item">装备位置</div>
                            <div class="fold_title_item">数量</div>
                        </div>
                        <div class="fold_body">
                            <div v-for="(item,index) in props.row.equipCountByLocations"
                                    :style="index==0?'padding-left: 0.038rem;':''">
                                <div class="fold_body_item" v-text="surface(item)"></div>
                                <div class="fold_body_item"> {{item.number}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
    </div>
</template>
<script>
    import myHeader from 'components/base/header/header'
    import {findbyrfidandsupplierandequiplike} from "api/equiprecord"
    import {transformMixin} from "common/js/transformMixin";
    export default {
        name: "maintenanceRecordinfo",
        components:{
            myHeader,
        },
        props:{
            infolist:{
                type:Object,
            },
            show:{
                type:Boolean,
                default:false,
            },
        },
        mixins: [transformMixin],
        data(){
            return{
                table: {
                    search:'',
                },
                form:{},
                time:'',
                paginator: {
                    page: 1,
                    totalPages: 10,
                    size: 9
                },
                list:[]
            }
        },
        methods:{
            changePage(data){
                this.paginator.page = data
                this.getList()

            },
        },
        watch:{
            'show':{
                handler(){
                    this.list = this.infolist.recordDetailSet
                    console.log("list",this.list)
                }
            }
        }
        
    }
</script>
<style scoped>
    .opening-box{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
}
.action-bar {
    padding-right: 23px;
    margin-top: 8px;
    border-top: rgba(112, 112, 112, 0.13) solid 1px;
    border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
    font-size: 16px;
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
.action-bar .input-box{
    width:285.0048px;
    position: relative;
}
.input-box .input{
    width: 100%;
    height:38px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(112,112,112,1);
    opacity:1;
    border-radius:19px;
    padding-left: 15px;
    outline:medium;
    color: #707070;
}
::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: #BBBBBB;
}
.input-box .icon-search{
    position: absolute;
    right: 10px;
    z-index: 1;
    top: 50%; /*偏移*/
    width: 25px;
    height: 25px;
    transform: translateY(-50%);
}
</style>