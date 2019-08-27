<template>
    <div class="secondment-box">
        <my-header :title="'借用流程'" :searchFlag="false" :haveBlack="!viewStatus.flag" @h_black="black"></my-header>
        <!--<bills></bills>-->
        <div v-show="viewStatus.flag">
            <div class="single-box">
                <div class="single-box-item">
                    <span v-text="'借用申请单'" @click="clickSingle('apply')"></span>
                    <div class="single-box-item-line" v-if="viewStatus.singleFlag.apply"></div>
                </div>
                <div class="single-box-item" @click="clickSingle('secondment')">
                    <span v-text="'借用单'"></span>
                    <div class="single-box-item-line" v-if="viewStatus.singleFlag.secondment"></div>
                </div>
                <div class="single-box-item" @click="clickSingle('returns')">
                    <span v-text="'归还单'"></span>
                    <div class="single-box-item-line" v-if="viewStatus.singleFlag.returns"></div>
                </div>
            </div>
            <div class="action-box">
                <div style="width:117px; padding-left:18px;">
                    <tab-select :sizeHeight="'mini'"  :options="selectList" :indexDefault="indexDefault" @selected="selectValue"></tab-select>
                </div>
                <div style="margin-left: 38px;cursor: pointer" @click="addDirectAdjustment" v-if="viewStatus.singleFlag.apply">
                    <svg-icon icon-class='加' class="icon-search"></svg-icon>
                    <span>添加借用</span>
                </div>
                <div class="_buttons" style="margin-right: 18px" v-if="havePage">
                    <BosInput
                            placeholder="编号"
                            suffix="el-icon-search"
                            v-model="search"
                            style=" width:285px;">
                    </BosInput>
                </div>
            </div>
            <div class="secondment-body">
                <t_table ref="secondmentTable" :urlObject="urlObject.transferUrlObj" :typeSingle="select.typeSingle" :select="select.single" :havePage="havePage" :searchNumber="search" @toSee="toSee" ></t_table>
            </div>
        </div>
        <bills v-if="!viewStatus.flag" :billName="billName" :reSet="{unit:unit,restaurants:restaurants,myUnit:myUnit,house:house}" @closeBill="closeBill" :singleStatus="select.singleStatus" :billUrlObject="urlObject.billUrlObject" :typeSingle="select.typeSingle" :billData="billData" @toBack="haveBack"></bills>
        <add-apply ref="addDirectAdjustment" @sucessAdd="closeAddDialog" :myUnit="myUnit" :unit="unit" :house="house" @submit="submit"></add-apply>
    </div>
</template>

<script>
    import bills from './bill'
    import myHeader from 'components/base/header/header'
    import tabSelect from 'components/base/tableSelect'
    import t_table from 'components/process/transfer/transferTable'
    import addApply from 'components/process/secondment/addSecondment'
    import api from 'gql/home.gql'
    import secondmentApi from 'gql/transfer.gql'
    import {fetchMixin} from 'field/common/mixinFetch'
    import request from 'common/js/request'
    import {baseBURL} from "../../api/config";
    export default {
        name: "secondment",
        components:{
            bills,
            myHeader,
            tabSelect,
            t_table,
            addApply
        },
        mixins: [fetchMixin],
        data(){
            return{
                selectList:[
                    {label:'进行中',value:'进行中'},
                    {label:'已结束',value:'已结束'}
                ],
                unit:{
                    name:'',
                    id:''
                },
                house:{
                    id:'',name:''
                },
                billName:'借用',
                urlObject:{
                    transferUrlObj:{
                        applyUrl:{
                            doing:'/task/by-user-and-process-definition',
                            history:'/borrow-apply-orders/history',
                        },
                        billUrl:'/borrow-orders/by-user-and-order-state',
                        urlParamsKey:{
                            processDefinitionKey:'borrow',
                            type:'BORROW'
                        }
                    },
                    billUrlObject:{
                        histroyApprovalUrl:'/history-leader-approval/',
                        confirmREJECTED:'/borrow',
                        downloadSrcUrl:'/borrow-orders/export-excel',
                        billEquipUrl:{
                            inHouseUrl:'/order-equips/equips-in-house/group',
                            outHouseUrl:'/order-equips/equips-out-house/group'
                        }
                    }
                },
                select:{
                    single:'进行中',
                    typeSingle:'apply',
                    singleStatus:'',
                    selectModel:{
                        apply:[{label:'进行中',value:'进行中'},
                            {label:'已结束',value:'已结束'}],
                        secondment:[{label:'全部',value:'All'},
                            {label:'已出库',value:'OUT_HOUSE'},{label:'已入库',value:'IN_HOUSE'},{label:'未出库',value:'WITHOUT_OUT_HOUSE'}]
                    }
                },
                indexDefault:'进行中',
                search:'',
                restaurants:[],
                myUnit:{},
                billData:{},
                viewStatus:{
                    flag:true,
                    add:false,
                    singleFlag:{
                        apply:true,
                        secondment:false,
                        returns:false
                    }
                },
            }
        },
        created(){
            this.getEquipInfo();
            this.getUnitAndHouse();
        },
        computed:{
            havePage(){
                let flag;
                if(this.viewStatus.singleFlag.apply&&this.select.single=='进行中'){
                    flag=false
                }else {
                    flag=true
                }
                return flag
            }
        },
        methods:{
            closeBill(){
                this.viewStatus.flag=!this.viewStatus.flag;
                this.$refs.secondmentTable.getList(this.$refs.secondmentTable.select,this.$refs.secondmentTable.searchNumber)
            },
            closeAddDialog(){
                this.$refs.addDirectAdjustment.cancel();
                this.$refs.secondmentTable.getList(this.$refs.secondmentTable.select,this.$refs.secondmentTable.searchNumber)
            },
            addDirectAdjustment(){
                this.$refs.addDirectAdjustment.showAdd()
            },
            getUnitAndHouse(){
                this.gqlQuery(secondmentApi.getOrganUnit, {
                    key: 'id',
                    value: JSON.parse(localStorage.getItem('user')).unitId
                }, (data) => {
                    this.myUnit=data[0];
                    if(this.myUnit.level!="MUNICIPAL"){
                        request({
                            method:'get',
                            url:baseBURL+'/architecture/findById',
                            params:{id:data[0].upperId}
                        }).then(res=>{
                            this.unit={
                                name:res.name,
                                id:res.id
                            };
                        })
                    }
                }, true);
                let url='http://192.168.50.15:8080/warehouse/house';
                request({
                    method:'get',
                    url:url,
                }).then(res=>{
                    this.house.id= res.id;
                    this.house.name=res.name;
                })
            },
            haveBack(data){
                this.viewStatus.flag=!this.viewStatus.flag;
                this.$refs.secondmentTable.getApplyList('doing','');
            },
            submit(data){
                console.log(data);
                // let dataSubmit = data;
                // let index =dataSubmit.orderItems.length-1
                // if(dataSubmit.orderItems[index].model==''){
                //     dataSubmit.orderItems.splice(index,1)
                // }
                // let url = 'http://192.168.50.15:8080/warehouse/secondments/up-to-down';
                // request({
                //     method:'post',
                //     url:url,
                //     data:dataSubmit
                // }).then(res=>{
                //     if(res){
                //         this.$message.success('操作成功');
                //         this.$refs.addDirectAdjustment.close();
                //         this.$refs.directAdjustmentTable.getList();
                //     }
                // })
            },
            getEquipInfo() {
                this.gqlQuery(api.getEquipList1, '', (res) => {
                    let newData = res;
                    let eqName = newData.map(res => {
                        return res.name
                    });
                    let endData = [];
                    eqName = Array.from(new Set(eqName));
                    eqName.forEach(item => {
                        newData.some(item1 => {
                            if (item === item1.name) {
                                endData.push({
                                    value: item1.equipArg.model,
                                    key: {
                                        name: item1.name,
                                        model: item1.equipArg.model,
                                    }
                                });
                                return true
                            }
                        })
                    });
                    this.restaurants = endData;
                },true)
            },
            toSee(data){
                // this.directDefault=data.row;
                // this.downloadSrc='http://192.168.50.15:8080/warehouse/secondments/up-to-down/export-excel'+'?secondmentOrderId='+this.directDefault.id;
                // this.viewStatus.flag=!this.viewStatus.flag
                this.billData=data.row.variables;
                this.select.singleStatus=this.select.single;

                if(data.row.taskId!=null){
                    this.$set(this.billData,'taskId',data.row.taskId)
                }
                if(data.row.processInstanceId!=undefined){
                    this.$set(this.billData,'processInstanceId',data.row.processInstanceId)
                }
                this.viewStatus.flag=!this.viewStatus.flag
            },
            black(data){
                this.viewStatus.flag=!this.viewStatus.flag
            },
            selectValue(data) {
                this.select.single = data;
            },
            clickSingle(type){
                this.select.typeSingle=type;
                this.search='';
                if(type=='apply'){
                    this.indexDefault='进行中';
                    this.billName='借用'
                    this.selectList=this.select.selectModel.apply;
                    if(this.viewStatus.singleFlag.apply){}else {
                        this.viewStatus.singleFlag.apply=true;
                        this.viewStatus.singleFlag.secondment=false;
                        this.viewStatus.singleFlag.returns=false
                    }
                }else if (type=='secondment'){
                    this.indexDefault='全部';
                    this.billName='借用';
                    this.urlObject.transferUrlObj.billUrl='/borrow-orders/by-user-and-order-state';
                    this.urlObject.billUrlObject.downloadSrcUrl='/borrow-orders/export-excel';
                    console.log( this.urlObject.transferUrlObj.billUrl)
                    this.selectList=this.select.selectModel.secondment;
                    if(this.viewStatus.singleFlag.secondment){}else {
                        this.viewStatus.singleFlag.secondment=true;
                        this.viewStatus.singleFlag.apply=false;
                        this.viewStatus.singleFlag.returns=false
                    }
                }else {
                    this.indexDefault='全部';
                    this.billName='归还';
                    this.urlObject.transferUrlObj.billUrl='/return-orders/by-user-and-order-state';
                    this.urlObject.billUrlObject.downloadSrcUrl='/return-orders/export-excel';
                    this.selectList=this.select.selectModel.secondment;
                    if(this.viewStatus.singleFlag.returns){}else {
                        this.viewStatus.singleFlag.secondment=false;
                        this.viewStatus.singleFlag.apply=false;
                        this.viewStatus.singleFlag.returns=true
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .secondment-box{
        width: 100%;
        color: #707070;
    }
    .secondment-box .secondment-body {
        width: 100%;
    }
    .secondment-box .single-box{
        width: 100%;
        height: 57px;
        display: flex;
        border-top: 1px solid rgba(112,112,112,0.13);
        border-bottom: 1px solid rgba(112,112,112,0.13);
        padding-left: 18px;
    }
    .secondment-box .action-box{
        display: flex;
        height: 57px;
        width: 100%;
        align-items: center;
        padding-right: 18px;
        border-bottom: 1px solid rgba(112,112,112,0.13);
    }
    .single-box .single-box-item{
        height: 100%;
        display: flex;
        position: relative;
        align-items: center;
        margin-right: 34px;
        cursor: pointer;
    }
    .single-box-item .single-box-item-line{
        width: 100%;
        position: absolute;
        bottom: 0px;
        height:5px;
        background:rgba(112,112,112,1);
        opacity:1;
        border-radius:16px;
    }
</style>
