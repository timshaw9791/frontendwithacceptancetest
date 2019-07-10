<template>
    <div class="directAdjustment-box">
        <div class="directAdjustment">
            <my-header :title="'直调调拨单'" :searchFlag="false" :haveBlack="!viewStatus.flag" @h_black="black"></my-header>
            <div class="directAdjustment-action-bar">
                <div v-show="viewStatus.flag" class="add">
                    <div class="add-directAdjustment">
                        <select-personel id="directAdjustment" :select="select.selectList" @selectRole="selectState" :havaDefault="true"></select-personel>
                        <svg-icon icon-class='加' style="margin-left: 38px" class="icon-search"></svg-icon>
                        <span @click="addDirectAdjustment">添加调拨</span>
                    </div>
                    <div class="input-box">
                        <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
                        <input class="input" v-model="search" :placeholder="'调拨单号'"></input>
                    </div>
                </div>
                <div class="transfer-directAdjustment">
                    <span v-text="'查看'"></span>
                    <div class="transfer-svg">
                        <a :href="downloadSrc" style="display: none" ref="aDownload">a标签</a>
                        <el-button type="text" class="_textBt" @click="download"><svg-icon icon-class="导出"></svg-icon>导出</el-button>
                    </div>
                </div>
                <!--<div class="modify" v-if="!viewStatus.flag">
                    <span>基础信息</span>
                    <div class="modify-box" v-if="type=='add'?false:true" @click="toModify">
                        <svg-icon icon-class="编辑" class="icon-modify"></svg-icon>
                        <span>{{disabled?'编辑':'取消编辑'}}</span>
                    </div>
                </div>-->
            </div>
        </div>
        <div class="directAdjustment-body">
            <d_table ref="directAdjustmentTable" :search="search" :state="tableState" @toSee="toSee" v-show="viewStatus.flag"></d_table>
            <d_details v-if="!viewStatus.flag" :direct="directDefault"></d_details>
        </div>
        <add-direct-adjustment ref="addDirectAdjustment" :status="viewStatus.add" :restaurants="restaurants" :unit="unit" :house="house" @submit="submit"></add-direct-adjustment>

    </div>
</template>

<script>
   import selectPersonel from 'components/personnelManagement/personnelSelect'
   import myHeader from 'components/base/header/header'
   import addDirectAdjustment from 'components/process/directAdjustment/addDirectAdjustment'
   import {fetchMixin} from 'field/common/mixinFetch'
   import api from 'gql/home.gql'
   import directAdjustment from 'gql/directAdjustment.gql'
   import request from 'common/js/request'
   import d_table from 'components/process/directAdjustment/directAdjustmentTable'
   import d_details from 'components/process/directAdjustment/directAdjustmentDetails'
    export default {
        name:'directAdjustment',
        mixins: [fetchMixin],
        components: {

            myHeader,
            selectPersonel,
            addDirectAdjustment,
            d_table,
            d_details
        },
        data() {
            return {
                /*inquire: '',
                list: [],
                page: 1,
                size: 4,
                total: 10,
                form: {
                    planEquips: [{equipModel: '', location: {}}]
                },
                restaurants: [{value: 'wdnm', key: '2'}],
                title: '',
                delId: '',*/
                viewStatus:{
                    flag:true,
                    add:false
                },
                select:{
                    selectList:[{label: '全部', value: 'ALL'},{label:'已出库',value:'OUT'},{label:'未出库',value:'IN'}]
                },
                tableState:'',
                search:'',
                unit:{
                  name:'',
                  id:''
                },
                house:{
                    id:'',name:''
                },
                directDefault:{},
                restaurants:[],
                downloadSrc:''
            }
        },
        created(){
          this.getEquipInfo();
          this.getUnitAndHouse();
        },
        methods:{
            black(data){
                this.viewStatus.flag=!this.viewStatus.flag
            },
            download(){
                console.log('aDownload');
              this.$refs.aDownload.click();
            },
            toSee(data){
               this.directDefault=data.row;
               this.downloadSrc='http://10.128.4.152:8080/warehouse/transfers/up-to-down/export-excel'+'?transferOrderId='+this.directDefault.id;
               this.viewStatus.flag=!this.viewStatus.flag
            },
            addDirectAdjustment(){
                this.$set(this.viewStatus,'add',!this.viewStatus.add);
            },
            selectState(data){
                this.tableState=data
            },
            transferClick(){
                let url='http://10.128.4.152:8080/warehouse/transfers/up-to-down/export-excel'+'?transferOrderId='+this.directDefault.id;
                request({
                    method:'post',
                    url:url
                }).then(res=>{
                    if(res){
                       console.log(res);
                    }
                })
            },
            submit(data){
                let dataSubmit = data;
                let index =dataSubmit.orderItems.length-1
                if(dataSubmit.orderItems[index].model==''){
                    dataSubmit.orderItems.splice(index,1)
                }
                let url = 'http://10.128.4.152:8080/warehouse/transfers/up-to-down';
                request({
                    method:'post',
                    url:url,
                    data:dataSubmit
                }).then(res=>{
                   if(res){
                       this.$message.success('操作成功');
                       this.$refs.addDirectAdjustment.close();
                       this.$refs.directAdjustmentTable.getList();
                   }
                })
            },
            getUnitAndHouse(){
             this.gqlQuery(directAdjustment.getUser,{id:JSON.parse(localStorage.getItem('user')).unitId},res=>{
                 this.unit.id=res.id;
                 this.unit.name=res.location+res.name
             },true);
             let url='http://10.128.4.152:8080/warehouse/house';
                request({
                    method:'get',
                    url:url,
                }).then(res=>{
                    this.house.id= res.id;
                    this.house.name=res.name;
                })
            },
            getEquipInfo() {
                    this.gqlQuery(api.getEquipList1, '', (res) => {
                    let newData = res
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

        },
       /* mixins: [formRulesMixin, transformMixin],*/
       /* methods: {
            paginationChange(val) {
                console.log(val);
                this.page = val;
                this.getList();
            },

            qaq(row, data) {

                this.form.planEquips[row.$index] = data.key;
                console.log(this.form.planEquips);

                if (row.$index === this.form.planEquips.length - 1) {
                    this.form.planEquips.push({equipModel: '', location: {}});
                }
            },

            delqaq(row) {
                if (this.form.planEquips.length > 1) {
                    this.form.planEquips.splice(row.$index, 1);
                } else {
                    this.$message.error('不能删除最后一个');
                }
            },
            dialogShow(type, item) {
                if (type === 'add') {
                    this.title = '新增预案';
                    this.form = {};
                    this.form['planEquips'] = [{equipModel: '', location: {}}];
                } else if (type === 'up') {
                    this.title = '编辑预案';
                    console.log(item);
                    this.form = item;
                }
                this.getEquipInfo();

                this.$refs.dialog.show();
            },
            getList() {
                getPlanList(this.getPagination(this.page, this.size)).then(res => {
                    this.list = res.content;
                    this.total = res.totalElements;
                }).catch(err => {
                    console.log(err);
                })
            },
            getPagination(page, size) {
                return {
                    size: size,
                    page: page
                }
            },
            getEquipInfo() {
                this.gqlQuery(api.getEquipList1, {}, (res) => {
                    let newData = JSON.parse(JSON.stringify(res.data.EquipList.content));
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
                                        location: {
                                            number: item1.location.number,
                                            surface: item1.location.surface,
                                        },
                                        equipName: item1.name,
                                        equipModel: item1.equipArg.model,
                                    }
                                });
                                return true
                            }
                        })
                    });
                    this.restaurants = endData;
                })
            },
            submit() {
                this.$refs.form.validate.then(res => {
                    if (this.form.planEquips[this.form.planEquips.length - 1].equipModel === '') {
                        this.form.planEquips.splice(this.form.planEquips.length - 1, 1);
                    }
                    if (this.title === '新增预案' && this.form.planEquips[0]) {
                        this.form.planEquips = this.form.planEquips.map(res1 => {
                            console.log(res1);
                            if (res1.equipModel) {
                                return {equipModel: res1.equipModel}
                            }
                        });
                        savePlan(this.form).then(item => {
                            console.log(item);
                            this.$refs.dialog.hide();
                            this.getList();
                            this.$message.success('新增成功');
                        }).catch(err => {
                            this.$message.error(err.message);
                        })

                    } else if (this.title === '编辑预案' && this.form.planEquips[0]) {
                        savePlan(this.form).then(item => {
                            this.$refs.dialog.hide();
                            this.getList();
                            this.$message.success('编辑成功');
                        }).catch(err => {
                            this.$message.error(err.message);
                        })
                    } else {
                        this.$message.error('请选择装备');
                    }
                }).catch(err => {
                    this.$message.error('未通过检验');
                })
            },
            submit1() {
                delectPlan(this.delId).then(res => {
                    this.$refs.dialog1.hide();
                    this.$message.success('删除成功');
                    this.getList();
                }).catch(err => {
                    this.$message.error(err.message);
                })
            },
            delList(row) {
                console.log(row);
                this.delId = row.id;
                this.$refs.dialog1.show();
            }
        },*/
        /*mounted() {
            this.getList();
        },*/
       /* watch: {
            inquire(newVal, oldVal) {
                console.log(newVal);
                if (newVal === '%%') {
                    this.getList();
                } else {
                    searchPlan({name: newVal}).then(res => {
                        console.log(res);
                        this.list = res;
                    })
                }
            }
        }*/
    }
</script>

<style>
    #directAdjustment  .el-select {
        width: 97px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
    }
    #directAdjustment .el-input__icon{
        line-height: 32px;
        color: white;
    }
    #directAdjustment .el-input__inner{
        width: 97px;
        height: 32px;
        background:rgba(47,47,118,1);
        opacity:1;
        border-radius:16px;
        text-align: center;
        color: white;
    }
    .directAdjustment-box{
        width: 100%;
        height: 965px;
    }
    .directAdjustment-box .directAdjustment{
        display: flex;
        width: 100%;
        flex-direction: column;
        font-size: 16px;
        color: rgba(112, 112, 112, 1);
    }
    .directAdjustment-box .directAdjustment-body {
        width: 100%;
    }
    .directAdjustment .directAdjustment-action-bar {
        margin-top: 8px;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        height: 57px;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
    }
    .directAdjustment-action-bar .transfer-directAdjustment{
        width: 100%;
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
    }
    .transfer-directAdjustment .transfer-svg{
        font-size: 16px;
        display: flex;
        align-items: center;
        margin-right: 5px;
        justify-content: center;
        vertical-align: middle;
    }
    .directAdjustment-action-bar .modify {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 57px;
        justify-content: left;
    }
    .modify .modify-box{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
    }
    .modify-box .icon-modify{
        margin-left: 67px;
    }
    .directAdjustment .add{
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
    }
    .add .add-directAdjustment{
        display: flex;
        align-items: center;
        justify-content: left;
        flex-direction: row;
    }
    .directAdjustment .input-box {
        width: 285px;
        position: relative;
    }

    .input-box .input {
        width: 100%;
        height: 38px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(112, 112, 112, 1);
        opacity: 1;
        border-radius: 19px;
        padding-left: 15px;
        outline: medium;
    }

    .input-box .icon-search {
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }
    /*.el-card {
        border: none !important;
    }

    .dialogList {
        width: 90%;
        margin: 3% auto;
        max-height: 38vh;
        border: 1px solid #EBEEF5;
        border-bottom: 0 !important;
    }


    .secondaryTitle {
        position: relative;
        border-bottom: 1px solid #EBEEF5;
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        height: 44px;
    }

    .bodyContent {
        padding: 30px 60px 0 60px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .pieceList {
            width: 710px;
            height: 343px;
            background: rgb(255, 255, 255);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            margin-bottom: 38px;

            .top {
                padding: 20px;
                height: 40px;
                width: 100%;
                display: flex;
                align-items: center;
                font-size: 16px;
                color: rgba(112, 112, 112, 1);
            }

            .list {
                .scroll-bar {
                    max-height: 250px;
                    min-height: 250px;
                    width: 100%;
                    padding: 0 8%;
                }
            }

            .bottom {
                display: flex;
                margin-top: 10px;
                height: 40px;
                padding: 0 50px;
                color: rgba(112, 112, 112, 1);

                .bottomInfo {
                    width: 80%;
                    height: 38px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
            }
        }
    }*/
</style>
