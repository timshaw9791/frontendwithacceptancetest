<template>
    <div class="transfer-box">
        <my-header :title="'调拨流程'" :searchFlag="false" :haveBlack="!viewStatus.flag" @h_black="black"></my-header>
        <!--<bills></bills>-->
        <div v-show="viewStatus.flag">
            <div class="single-box">
                <div class="single-box-item">
                    <span v-text="'调拨申请单'" @click="clickSingle('apply')"></span>
                    <div class="single-box-item-line" v-if="viewStatus.singleFlag.apply"></div>
                </div>
                <div class="single-box-item" @click="clickSingle('transfer')">
                    <span v-text="'调拨单'"></span>
                    <div class="single-box-item-line" v-if="viewStatus.singleFlag.transfer"></div>
                </div>
            </div>
            <div class="action-box">
                <div style="width:117px; padding-left:18px;">
                    <tab-select :sizeHeight="'mini'"  :options="selectList" :indexDefault="indexDefault" @selected="selectValue"></tab-select>
                </div>
                <div style="margin-left: 38px;cursor: pointer" @click="addDirectAdjustment" v-if="viewStatus.singleFlag.apply">
                    <svg-icon icon-class='加' class="icon-search"></svg-icon>
                    <span>添加调拨</span>
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
            <div class="transfer-body">
                <t_table ref="transferTable" :processInstanceId="processInstanceId" :typeSingle="select.typeSingle" :select="select.single" :havePage="havePage" :searchNumber="search" @toSee="toSee" ></t_table>
            </div>
        </div>
        <bills v-if="!viewStatus.flag" :reSet="{unit:unit,restaurants:restaurants,myUnit:myUnit,house:house}" @closeBill="closeBill" :singleStatus="select.singleStatus" :typeSingle="select.typeSingle" :billData="billData" @toBack="haveBack"></bills>
        <add-direct-adjustment ref="addDirectAdjustment" @sucessAdd="closeAddDialog" :restaurants="restaurants" :myUnit="myUnit" :unit="unit" :house="house" @submit="submit"></add-direct-adjustment>
    </div>
</template>

<script>
    import bills from './bill'
    import myHeader from 'components/base/header/header'
    import tabSelect from 'components/base/tableSelect'
    import t_table from 'components/process/transfer/transferTable'
    import addDirectAdjustment from 'components/process/directAdjustment/addDirectAdjustment'
    import api from 'gql/home.gql'
    import transferApi from 'gql/transfer.gql'
    import {fetchMixin} from 'field/common/mixinFetch'
    import request from 'common/js/request'
    import {baseBURL,baseURL} from "../../api/config";
    export default {
        name: "transfer",
        components:{
            bills,
            myHeader,
            tabSelect,
            t_table,
            addDirectAdjustment
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
                select:{
                    single:'进行中',
                    typeSingle:'apply',
                    singleStatus:'',
                    selectModel:{
                        apply:[{label:'进行中',value:'进行中'},
                            {label:'已结束',value:'已结束'}],
                        transfer:[{label:'全部',value:'All'},
                            {label:'已出库',value:'OUT_HOUSE'},{label:'已入库',value:'IN_HOUSE'},{label:'未出库',value:'WITHOUT_OUT_HOUSE'}]
                    }
                },
                indexDefault:'进行中',
                search:'',
                processInstanceId:'',
                restaurants:[],
                myUnit:{},
                billData:{},
                viewStatus:{
                    flag:true,
                    add:false,
                    singleFlag:{
                        apply:true,
                        transfer:false
                    }
                },
            }
        },
        created(){
            // this.getEquipInfo();
            this.defaultList();
            console.log('query',this.$route.query);
            if(this.$route.query.state!=null){

            }
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
            defaultList(){
                if(this.$route.query.state!=null){
                    if(this.$route.query.state=='UNDER_REVIEW'||this.$route.query.state=='REJECTED'){
                        this.getOnGoingList(this.$route.query)
                    }else {
                        this.getOverList(this.$route.query)
                    }
                }
            },
            getOverList(query){
                this.indexDefault='已结束';
                this.search=query.number;
            },
            getOnGoingList(query){
                this.indexDefault='进行中';
                this.processInstanceId=query.processInstanceId;
            },
            closeBill(){
                this.viewStatus.flag=!this.viewStatus.flag;
                this.$refs.transferTable.getList(this.$refs.transferTable.select,this.$refs.transferTable.searchNumber)
            },
            closeAddDialog(){
                this.$refs.addDirectAdjustment.cancel();
                this.$refs.transferTable.getList(this.$refs.transferTable.select,this.$refs.transferTable.searchNumber)
            },
            addDirectAdjustment(){
                if(this.myUnit.level!="MUNICIPAL"){
                    this.$refs.addDirectAdjustment.showAdd()
                }else {
                    this.$message.info('市局无法发起调拨！')
                }

            },
            getUnitAndHouse(){
                this.gqlQuery(transferApi.getOrganUnit, {
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
                                this.getRestaurants(res.id)
                            })
                        }
                }, true);
                let url=baseURL+'/house';
                request({
                    method:'get',
                    url:baseBURL+ '/architecture/houseByOrganUnitId',
                    params:{organUnitId:JSON.parse(localStorage.getItem('user')).unitId}
                }).then(res=>{
                    this.house.id= res[0].id;
                    this.house.name=res[0].name;
                });
            },
            getRestaurants(houseId){
                request({
                    method: 'get',
                    url: baseBURL + '/equip-arg/by-houseIds/list',
                    params: {
                        houseIds:houseId
                    }
                }).then(res => {
                    this.restaurants=[];
                    let list=res;
                    list.forEach(item=>{
                        this.restaurants.push({
                            value:item.model,
                            key:item
                        })
                    });
                    console.log('this.restaurants',this.restaurants)
                })
            },
            haveBack(data){
                this.viewStatus.flag=!this.viewStatus.flag;
                this.$refs.transferTable.getApplyList('doing','');
            },
            submit(data){
                console.log(data);
                // let dataSubmit = data;
                // let index =dataSubmit.orderItems.length-1
                // if(dataSubmit.orderItems[index].model==''){
                //     dataSubmit.orderItems.splice(index,1)
                // }
                // let url = baseURL+'/transfers/up-to-down';
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
                // this.downloadSrc=baseURL+'/transfers/up-to-down/export-excel'+'?transferOrderId='+this.directDefault.id;
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
                this.processInstanceId='';
                if(type=='apply'){
                    this.indexDefault='进行中';
                    this.selectList=this.select.selectModel.apply;
                    if(this.viewStatus.singleFlag.apply){}else {
                        this.viewStatus.singleFlag.apply=true;
                        this.viewStatus.singleFlag.transfer=false
                    }
                }else {
                    this.indexDefault='全部';
                    this.selectList=this.select.selectModel.transfer;
                    if(this.viewStatus.singleFlag.transfer){}else {
                        this.viewStatus.singleFlag.transfer=true;
                        this.viewStatus.singleFlag.apply=false
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .transfer-box{
        width: 100%;
        color: #707070;
    }
    .transfer-box .transfer-body {
        width: 100%;
    }
    .transfer-box .single-box{
        width: 100%;
        height: 57px;
        display: flex;
        border-top: 1px solid rgba(112,112,112,0.13);
        border-bottom: 1px solid rgba(112,112,112,0.13);
        padding-left: 18px;
    }
    .transfer-box .action-box{
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
