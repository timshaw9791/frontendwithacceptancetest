<template>
    <div class="opening-box">
        <my-header :title="'到期报废'" :searchFlag="false"  ></my-header>
        <div >
            <div class="action-bar">
                <div class="readata">
                    <svg-icon icon-class='读取' style="margin-left: 38px;line-height: 57px;" class="icon-search"></svg-icon>
                    <span style="color: #2F2F76;line-height: 57px" @click="read" data-test="button" >读取数据</span>
                </div>
                <div class="_buttons" style="margin-right: 18px">
                    <BosInput
                            placeholder="装备名称"
                            suffix="el-icon-search"
                            v-model="table.search"
                            style="width:285px;">
                    </BosInput>
                </div>
            </div>
            <field-table :list="list" :labelList="table.labelList"
                        :tableAction="table.tableAction"  :pageInfo="paginator" @tableCurrentPageChanged="changePage" style="width: 100%">
            </field-table>
            <service-dialog title="报废装备清单" ref="dialog1" :secondary="true" @confirm="expriedEquip">
                <div style="height:0.3438rem;">
                    <div style="height:0.3438rem;margin:0 auto;text-align:center;width:3.75rem;background:rgba(224,224,224,1);align:center">  
                        <div style="font-size:24px;margin:0 auto;text-align:center;color:rgba(239,69,69,1);line-height:0.3438rem;">
                            本次报废装备合计：{{this.count}}(件)
                        </div>
                    </div>
                </div>
                <field-table :list="equiplist.inventoryModels" :labelList="equip"
                            :havePage="false" style="width: 100%">
                </field-table>
            </service-dialog>
        </div>
        
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {findScarEquipByNameLike,scrap} from'api/expired.js'
    import serviceDialog from 'components/base/gailiangban'
    import { handheld, modifyFileName } from 'common/js/rfidReader'

    export default {
        name: "expired",
        components:{
            myHeader,
            serviceDialog,
        },
        data(){
            return{
                table: {
                    flag: false,
                    labelList: [
                        {lable: 'RFID', field: 'rfid',sort:false},
                        {lable: '装备序号', field: 'serial',sort:false},
                        {lable: '装备名称', field: 'equipName',sort:false},
                        {lable: '装备型号', field: 'model',sort:false},
                        {lable: '供应商', field: 'supplierName',sort:false},
                        {lable: '联系人', field: 'person',sort:false},
                        {lable: '联系方式', field: 'phone',sort:false},
                        {lable: '到期时间', field: 'scarTime' ,filter: (ns) => this.$filterTime(parseInt(ns.scarTime))},
                    ],
                    search:'',
                },
                time:'',
                list:[],
                paginator: {
                    page: 1,
                    totalPages: 10,
                    size: 10,
                    search:''
                },
                equiplist:[],
                equip:[
                    {lable: '装备名称', field: 'equipName',sort:false},
                    {lable: '装备型号', field: 'equipModel',sort:false},
                    {lable: '装备数量', field: 'currentProgress',sort:false},
                ],
                rfidlist:[],
                count:0
            }
        },
        methods:{
            
            getList(data){
                let params = this.paginator
                console.log("params",params)
                if(data){
                    params.search=data.search
                }
                findScarEquipByNameLike(params).then(res=>{
                    this.list=[];
                    this.list=res.content;
                    this.paginator.totalPages=res.totalPages
                    console.log("res",res)
                    console.log("list",this.list)
                })
            },
            changePage(data){
                this.paginator.page = data
                this.getList()

            },
            read(){
                console.log("获取数据")
                this.equiplist=[]
                modifyFileName('scrap.json')
                handheld((err) => this.$message.error(err)).then(data => {
                    this.equiplist=JSON.parse(data);
                    let test=[]
                    this.rfidlist=[]
                    this.count=0
                    for(let i in this.equiplist.inventoryModels){
                        console.log("this.equiplist.inventoryModels[i].rfids",this.equiplist.inventoryModels[i].rfids)
                        if(this.equiplist.inventoryModels[i].rfids!=''){
                            console.log("进入"+i)
                            for (let j in this.equiplist.inventoryModels[i].rfids){
                                this.rfidlist.push({
                                    rfids:this.equiplist.inventoryModels[i].rfids[j]
                                })
                                test.push(this.equiplist.inventoryModels[i])
                                console.log("test",test)
                            }
                        }
                        this.count+=this.equiplist.inventoryModels[i].currentProgress
                    }
                    this.equiplist.inventoryModels=JSON.parse(JSON.stringify(test))
                    console.log("this.equiplist",this.equiplist)
                    console.log("this.rfidlist1",this.rfidlist)
                    this.$refs.dialog1.show();
                });
            },
            getString(data) {
                let str = '';
                data.forEach(item => {
                    str = str + ',' + item
                });
                return str.substring(1, str.length);
            },
            expriedEquip(){
                console.log("报废")
                let rfidC = [];
                this.rfidlist.forEach(item => {
                    rfidC.push(item.rfids);
                });
                console.log("rfidC",rfidC)
                scrap({rfids:rfidC}).then(res=>{
                    this.$message.success('操作成功')
                    this.$refs.dialog1.hide();
                }).catch((error) => {
                    console.error(error);  //服务器错误或者网络状态问题
                    this.$message.error(`${error}`);
                })
            }
        },
        created(){
            this.getList()
        },
        watch:{
            'table.search':{
                handler(data){
                    let params = {search:data}
                    console.log("params",params)
                    this.getList(params)
                }
            },
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
    /* border-top: rgba(112, 112, 112, 0.13) solid 1px; */
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
.action-bar .readata{
        display: flex;
        align-items: center;
        justify-content: left;
        flex-direction: row;
        cursor: pointer;
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
