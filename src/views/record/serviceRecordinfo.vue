<template>
    <div class="opening-box" v-if="!show">
        <div class="action-bar">
            <div>
                {{this.$filterTime(parseInt(this.infolist.createTime))}}的维修装备详情
            </div>
            <div class="_buttons" style="margin-right: 18px">
                
                <BosInput
                        placeholder="RFID/装备名称/供应商"
                        suffix="el-icon-search"
                        v-model="table.search"
                        style="width:285px;">
                </BosInput>
            </div>
        </div>
        <field-table :list="list" :labelList="table.labelList" :havePage="false"
                     style="width: 100%">
        </field-table>
        <!-- <r_video ref="recordVideo" :src="address"></r_video> -->
    </div>
</template>
<script>
    import myHeader from 'components/base/header/header'
    import {findbyrfidandsupplierandequiplike} from "api/equiprecord"
    import {transformMixin} from "common/js/transformMixin";
    export default {
        name: "servicerecordinfo",
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
                    flag: false,
                    labelList: [
                        {lable: 'RFID', field: 'equipInfo.rfid',sort:false},
                        {lable: '装备序号', field: 'equipInfo.serial',sort:false},
                        {lable: '装备名称', field: 'equipInfo.equipName',sort:false},
                        {lable: '装备型号', field: 'equipInfo.model',sort:false},
                        {lable: '装备位置', field: 'equipInfo',filter: (ns) => this.fixposition(ns.equipInfo)},
                        {lable: '供应商', field: 'supplierInfo.supplierName',sort:false},
                        {lable: '联系人', field: 'supplierInfo.person',sort:false},
                        {lable: '联系方式', field: 'supplierInfo.phone',sort:false},
                    ],
                    search:'',
                },
                time:'',
            }
        },
        methods:{
            
        },
        watch:{
            'table.search':{
                handler(data){
                    console.log("data",data) 
                    this.list = this.infolist.recordDetailSet
                    if(data){    
                        let a =[]
                        for(let i in this.list){
                            if(this.list[i].equipInfo.rfid.indexOf(this.table.search)!=-1||
                            this.list[i].equipInfo.equipName.indexOf(this.table.search)!=-1||
                            this.list[i].supplierInfo.supplierName.indexOf(this.table.search)!=-1){
                                    a.push(this.list[i])
                            }
                        }
                        console.log("a",a)
                        this.list = a
                    }else{
                        this.list = this.infolist.recordDetailSet
                    }
                }
            },
            'show':{
                handler(){
                    this.list = this.infolist.recordDetailSet
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