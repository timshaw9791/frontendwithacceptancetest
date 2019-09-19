<template>
    <div class="report-box">
        <my-header :title="'统计报表'" :searchFlag="false" :haveBlack="viewStatus.backFlag" @h_black="black"></my-header>
        <div class="report-body" v-show="!viewStatus.backFlag">
            <div class="report-top">
                <div class="report-top-title">
                    <div class="r_t_title-left">
                        <span v-text="'库存统计'"></span>
                        <div style="margin-left: 30px;cursor:pointer;display: flex;align-items: center" @click="getMing">
                            <!--<a :href="mingXiSrc" style="display: none" ref="mingXiDownload">a标签</a>-->
                            <svg-icon icon-class="明细" style="font-size: 20px;margin-right: 5px"  ></svg-icon>
                            <span v-text="'装备明细'"></span>
                        </div>
                    </div>
                    <div class="r_t_title-right">
                        <div class="title-right">
                            <div class="content">
                                <span v-text="allOutHouseCount" style="font-size:25px"></span>
                                <span v-text="'出库总数'" style="margin-top: 4px;font-size: 14px"></span>
                            </div>
                            <img src="../../components/icons/svg/柱形图蓝.png" class="title-img"/>
                        </div>
                        <div class="title-right" style="margin-left: 32px">
                            <div class="content">
                                <span v-text="allInHouseCount" style="font-size:25px"></span>
                                <span v-text="'在库总数'" style="margin-top: 4px;font-size: 14px"></span>
                            </div>
                            <img src="../../components/icons/svg/柱形图灰.png" class="title-img"/>
                        </div>
                    </div>
                </div>
                <warehoused :warehouseList="warehouseList"  @responseInventory="responseInventory"></warehoused>
            </div>
            <div class="report-bottom">
                <div @click="toDetails('装备维修率')">
                    <equip-report :equipData="maintenance" :title="'装备维修率'"></equip-report>
                </div>
                <div @click="toDetails('装备损耗率')">
                    <equip-report :equipData="scrap" :title="'装备损耗率'" :toolTip="['装备名称','损耗数量','损耗率']"></equip-report>
                </div>
                <div  @click="toDetails('装备使用频次')">
                    <equip-report :equipData="useCount" :title="'装备使用频次'"
                                  :toolTip="['装备名称','使用次数']"></equip-report>
                </div>
            </div>
        </div>
        <equip-details v-if="viewStatus.detailesFlag" @changeCategory="handleChangeCategory" @changeGener="handleChangeGener" :genre="equipDetails.genre" :selectDefault="equipDetails.selectDefault" :detailsList="equipDetails.list"
                       @changeDate="handleDate" :categoryList="equipDetails.categoryList" :title="equipDetails.title" :toolTip="equipDetails.toolTip" @handleSearch="toSearch"></equip-details>
        <ming-xi v-if="viewStatus.mingXiFlag"></ming-xi>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import warehoused from 'components/report/warehousing'
    import equipReport from 'components/report/equipReport'
    import equipDetails from 'components/report/equipDetails'
    import mingXi from 'components/report/mingXi'
    import report from 'gql/report.gql'
    import {fetchMixin} from 'field/common/mixinFetch'
    import {baseURL} from "../../api/config";

    export default {
        name: "index",
        mixins: [fetchMixin],
        components: {
            myHeader,
            warehoused,
            equipReport,
            equipDetails,
            mingXi
        },
        data() {
            return {
                warehouseList: [],
                maintenance: [],
                allInHouseCount:'',
                allOutHouseCount:'',
                equipDetails: {
                    list: [],
                    title: '',
                    genre:[],
                    categoryList:[],
                    selectDefault:'',
                    toolTip:[]
                },
                useCount:[],
                scrap:[],
                viewStatus: {
                    backFlag: false,
                    detailesFlag:false,
                    mingXiFlag:false
                }
            }
        },
        created() {
            this.getWareHouse();
            this.getMaintain('',data=>{
                this.maintenance = data
            });
            this.getScrap('',data=>{
                this.scrap = data
            });
            this.getUseCount('',(data)=>{
                this.useCount = data
            });
            this.getGenreList();
        },
        methods: {
            getMing() {
                this.viewStatus.backFlag = !this.viewStatus.backFlag;
                this.viewStatus.mingXiFlag = !this.viewStatus.mingXiFlag;
            },
            toSearch(data){
                console.log(data);
                this.equipDetails.list.forEach(item=>{
                    if(data!=''){
                        if(String(item.name).indexOf(data)!=-1){
                            item.select=true;
                        }else {
                            item.select=false;
                        }
                    }else {
                        item.select=false;
                    }
                })
            },
            black(){
                this.viewStatus.backFlag = !this.viewStatus.backFlag;
                this.viewStatus.detailesFlag=false;
                this.viewStatus.mingXiFlag=false;
                this.equipDetails.selectDefault='';
                this.equipDetails.categoryList=[];
                this.equipDetails.list=[];
                this.equipDetails.toolTip=[];
            },
            toDetails(data) {
                this.equipDetails.title=data;
                if(data=='装备维修率'){
                    this.getMaintain('',data=>{
                        this.$set(this.equipDetails,'list',data);
                    });
                    this.equipDetails.toolTip=['装备名称','维修数量','维修率']
                }else if(data=='装备损耗率'){
                    this.getScrap('',data=>{
                        this.$set(this.equipDetails,'list',data);
                    });
                    this.equipDetails.toolTip=['装备名称','损耗数量','损耗率']
                }else {
                    this.getUseCount('',(data)=>{
                        this.$set(this.equipDetails,'list',data);
                    });
                    this.equipDetails.toolTip=['装备名称','使用次数']
                }
                this.viewStatus.backFlag = !this.viewStatus.backFlag;
                this.viewStatus.detailesFlag = !this.viewStatus.detailesFlag;
            },
            getGenreList() {
                this.gqlQuery(report.getGenreList, '', (data) => {
                    this.equipDetails.genre=data;
                }, true)
            },
            handleDate(data){
             let date;
             date={
                 startTime:data.startTime.valueOf(),
                 endTime:data.endTime.valueOf()
             };
             if(this.equipDetails.title=='装备维修率'){
                 this.getMaintain(date,res=>{
                     this.$set(this.equipDetails,'list',res);
                 });
             }else if(this.equipDetails.title=='装备损耗率'){
                 this.getScrap(date,res=>{
                     this.$set(this.equipDetails,'list',res);
                 });
             }else {
                 this.getUseCount(date,(res)=>{
                     this.$set(this.equipDetails,'list',res);
                 })
             }
            },
            handleChangeGener(data){
                console.log(data)
                let src ='/statistic/genres/'+data;
                this.getCategory(data);
                this.getCategoryGener(src,'categoryStatisticList');
            },
            handleChangeCategory(data){
                let src ='/statistic/categories/'+data;
                this.getCategoryGener(src,'equipArgStatisticList');
            },
            getCategoryGener(url,api){
                this.ajax(url,'', (res) => {
                    console.log(res);
                    let list=[];
                    res.data[api].forEach(item=>{
                        let percentage=0;
                        if(item.count!=0&&item.count!=null){
                            percentage=Math.round(((item.outHouseCount / item.count) * 100));
                        }
                        list.push({
                            name:item.name,
                            number:item.outHouseCount,
                            percentage: percentage,
                            allCount:item.count,
                            select:false,
                            price:item.price
                        })
                    });
                    list.sort(function (a, b) {
                        return b.percentage > a.percentage ? 1 : -1;
                    });
                    this.$set(this.equipDetails,'list',list);
                });
            },
            getCategory(data){
                this.gqlQuery(report.getCategoryList, {id:data}, (data) => {
                   this.$set(this.equipDetails,'categoryList',data)
                   console.log(this.equipDetails.categoryList)
                }, true)
            },
            responseInventory(data) {
                this.equipDetails.title='库存统计';
                this.equipDetails.selectDefault=data.name;
                this.equipDetails.toolTip=['装备数量','出库数量','出库率'];
                this.viewStatus.backFlag = !this.viewStatus.backFlag;
                this.viewStatus.detailesFlag = !this.viewStatus.detailesFlag;
            },
            getWareHouse() {
                this.ajax('/statistic/genres/total','', (res) => {
                    this.allInHouseCount=res.data.inHouseCount;
                    this.allOutHouseCount=res.data.outHouseCount;
                    this.warehouseList = res.data.genreStatisticList;
                });
            },
            getUseCount(params,sCallback) {
                let param;
                if(params==''){
                    let newDate = new Date();
                    let month = newDate.getMonth();
                    let year = newDate.getFullYear();
                     param={
                        startTime:new Date(year,month,1,0).valueOf(),
                        endTime:newDate.valueOf()
                    };
                }else {
                    param=params
                }
                this.ajax('/statistic/use-count',param,(res)=>{

                    if(res.data.length!=0){
                        let somoe = res.data.sort(function (a, b) {
                            return b.count > a.count ? 1 : -1
                        });
                        let rate = somoe[0].count;
                        let userCountList = [];
                        somoe.forEach(item => {
                            userCountList.push({
                                name: item.name,
                                count: item.count,
                                allCount:item.name,
                                number:item.count,
                                percentage: Math.round(((item.count / rate) * 100)),
                                select:false
                            })
                        });
                        sCallback.call(this, userCountList);
                    }else {
                        sCallback.call(this,[{
                            name: 1,
                            count:2,
                            allCount:3,
                            number:2,
                            percentage: Math.round(((2 / 10) * 100)),
                            select:false}]);
                    }
                    /*this.useCount.list = userCountList*/
                });
            },
            getScrap(params,sCallback) {
                let param;
                if(params==''){
                    let newDate = new Date();
                    let month = newDate.getMonth();
                    let year = newDate.getFullYear();
                    param={
                        endMonth:month+1,
                        endYear:year,
                        startMonth:month+1,
                        startYear:year,
                        v:2
                    };
                }else {
                    let endTime=new Date(params.endTime);
                    let startTime=new Date(params.startTime);
                    param={
                        endMonth:endTime.getMonth()+1,
                        endYear:endTime.getFullYear(),
                        startMonth:startTime.getMonth()+1,
                        startYear:startTime.getFullYear(),
                        v:2
                    }
                }
                this.ajax('/statistic/scrap',param, (res) => {
                    if(res.data.length!=0){
                        let scrapList = [];
                        res.data.forEach(item => {
                            scrapList.push({
                                name: item.name,
                                number: item.damageCount,
                                percentage: Number((item.damageRate * 100).toFixed(1)),
                                allCount: item.name,
                                select:false
                            })
                        });
                        scrapList.sort(function (a, b) {
                            return b.percentage > a.percentage ? 1 : -1;
                        });
                        sCallback.call(this,scrapList);
                    }else {
                        sCallback.call(this,[{
                            name: 1,
                            allCount:1,
                            number:3,
                            percentage: Number((0.454545 * 100).toFixed(1)),
                            select:false}]);
                    }

                  /*  this.scrap.list = scrapList;
                    console.log(this.scrap.list);*/
                });
            },
            getMaintain(params,sCallback) {
                let param;
                if(params==''){
                    let newDate = new Date();
                    let month = newDate.getMonth();
                    let year = newDate.getFullYear();
                    param={
                        endMonth:month+1,
                        endYear:year,
                        startMonth:month+1,
                        startYear:year,
                        v:2
                    };
                }else {
                    let endTime=new Date(params.endTime);
                    let startTime=new Date(params.startTime);
                    param={
                        endMonth:endTime.getMonth()+1,
                        endYear:endTime.getFullYear(),
                        startMonth:startTime.getMonth()+1,
                        startYear:startTime.getFullYear(),
                        v:2
                    }
                }
                this.ajax('/statistic/maintain',param, (res) => {
                    if(res.data.length!=0){
                        let maintenanceList = [];
                        res.data.forEach(item => {
                            maintenanceList.push({
                                name: item.name,
                                number: item.maintainCount,
                                percentage: Number((item.maintainRate*100).toFixed(1)),
                                allCount: item.name,
                                select:false
                            })
                        });
                        maintenanceList.sort(function (a, b) {
                            return b.percentage > a.percentage ? 1 : -1;
                        });
                        sCallback.call(this,maintenanceList)
                    }else {
                        sCallback.call(this,[{
                            name: 1,
                            allCount:1,
                            number:3,
                            percentage: Number((0.23456*100).toFixed(1)),
                            select:false}]);
                    }
                })
            },
            ajax(url,params, sCallback) {
                if(params!=''){
                    this.$ajax({
                        method: 'get',
                        params:params,
                        url: baseURL + url,
                    }).then((res) => {
                        sCallback.call(this, res);
                    }).catch(err => {
                        this.$message.error(err);
                    })
                }else {
                    this.$ajax({
                        method: 'get',
                        url:baseURL + url,
                    }).then((res) => {
                        sCallback.call(this, res);
                    }).catch(err => {
                        this.$message.error(err);
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .report-box {
        width: 100%;
    }

    .report-box .report-body {
        border-top: 1px solid rgba(112, 112, 112, 0.13);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .report-body .report-top {
        width: 1508px;
        height: 494px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        margin-top: 45px;
    }

    .report-top .report-top-title {
        padding-left: 17px;
        padding-right: 36px;
        padding-top: 18px;
        display: flex;
        justify-content: space-between;
    }

    .report-top-title .r_t_title-left {
        font-size: 18px;
        height: 20px;
        display: flex;
        align-items: center;
        color: rgba(112, 112, 112, 1);
    }

    .report-top-title .r_t_title-right {
        color: #4D4F5C;
        display: flex;
        flex-direction: row;
    }

    .r_t_title-right .title-right {
        display: flex;
        height: 60px;
        align-items: center;
    }

    .title-right .content {
        height: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 24px;
        font-weight: bold;
    }

    .title-right .title-img {
        margin-top: 4px;
    }

    .report-body .report-bottom {
        width: 1508px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 51px;
        padding-bottom: 5px;
    }
</style>
