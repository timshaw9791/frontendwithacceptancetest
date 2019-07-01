<template>
    <div class="report-box">
        <my-header :title="'统计报表'" :searchFlag="false" :haveBlack="viewStatus.backFlag" @h_black="black"></my-header>
        <div class="report-body" v-if="!viewStatus.backFlag">
            <div class="report-top">
                <div class="report-top-title">
                    <span v-text="'库存统计'" class="r_t_title-left"></span>
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
                    <equip-report :equipData="scrap" :title="'装备损耗率'" :toolTip="['装备数量','损耗数量','使用率']"></equip-report>
                </div>
                <div  @click="toDetails('装备使用频次')">
                    <equip-report :equipData="useCount" :title="'装备使用频次'"
                                  :toolTip="['装备名称','使用次数','使用率']"></equip-report>
                </div>
            </div>
        </div>
        <equip-details v-if="viewStatus.backFlag" @changeCategory="handleChangeCategory" @changeGener="handleChangeGener" :genre="equipDetails.genre" :selectDefault="equipDetails.selectDefault" :detailsList="equipDetails.list"
                       @changeDate="handleDate" :categoryList="equipDetails.categoryList" :title="equipDetails.title" :toolTip="equipDetails.toolTip" @handleSearch="toSearch"></equip-details>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import warehoused from 'components/report/warehousing'
    import equipReport from 'components/report/equipReport'
    import equipDetails from 'components/report/equipDetails'
    import report from 'gql/report.gql'
    import {fetchMixin} from 'field/common/mixinFetch'

    export default {
        name: "index",
        mixins: [fetchMixin],
        components: {
            myHeader,
            warehoused,
            equipReport,
            equipDetails
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
                    backFlag: false
                }
            }
        },
        created() {
            this.getWareHouse();
            this.getMaintain(data=>{
                this.maintenance = data
            });
            this.getScrap(data=>{
                this.scrap = data
            });
            this.getUseCount('',(data)=>{
                this.useCount = data
            });
            this.getGenreList();
        },
        methods: {
            toSearch(data){
                this.equipDetails.list.forEach(item=>{
                    if(data!=''){
                        if(item.name.indexOf(data)!=-1){
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
                this.equipDetails.selectDefault='';
                this.equipDetails.categoryList=[];
                this.equipDetails.list=[];
                this.equipDetails.toolTip=[];
            },
            toDetails(data) {
                this.equipDetails.title=data;
                if(data=='装备维修率'){
                    this.getMaintain(data=>{
                        this.$set(this.equipDetails,'list',data);
                    });
                    this.equipDetails.toolTip=['装备数量','维修数量','维修率']
                }else if(data=='装备损耗率'){
                    this.getScrap(data=>{
                        this.$set(this.equipDetails,'list',data);
                    });
                    this.equipDetails.toolTip=['装备数量','损耗数量','使用率']
                }else {
                    this.getUseCount('',(data)=>{
                        this.$set(this.equipDetails,'list',data);
                    });
                    this.equipDetails.toolTip=['装备名称','使用次数']
                }
                this.viewStatus.backFlag = !this.viewStatus.backFlag;
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
             this.getUseCount(date,(res)=>{
                    this.$set(this.equipDetails,'list',res);
                })
            },
            handleChangeGener(data){
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
                    let list=[];
                    res.data[api].forEach(item=>{
                        list.push({
                            name:item.name,
                            number:item.outHouseCount,
                            percentage: Math.round(((item.outHouseCount / (item.inHouseCount + item.outHouseCount)) * 100)),
                            allCount:item.inHouseCount + item.outHouseCount,
                            select:false
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
                }, true)
            },
            responseInventory(data) {
                this.equipDetails.title='库存统计';
                this.equipDetails.selectDefault=data.name;
                this.equipDetails.toolTip=['装备数量','出库数量','出库率'];
                this.viewStatus.backFlag = !this.viewStatus.backFlag
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
                        sCallback.call(this, res.data);
                    }
                    /*this.useCount.list = userCountList*/
                });
            },
            getScrap(sCallback) {
                this.ajax('/statistic/scrap','', (res) => {
                    let scrapList = [];
                    res.data.forEach(item => {
                        scrapList.push({
                            name: item.name,
                            number: item.scrapCount,
                            percentage: Math.round(((item.scrapCount / (item.inHouseCount + item.scrapCount)) * 100)),
                            allCount: item.inHouseCount + item.scrapCount,
                            select:false
                        })
                    });
                    scrapList.sort(function (a, b) {
                        return b.percentage > a.percentage ? 1 : -1;
                    });
                    sCallback.call(this,scrapList);
                  /*  this.scrap.list = scrapList;
                    console.log(this.scrap.list);*/
                });
            },
            getMaintain(sCallback) {
                this.ajax('/statistic/maintain','', (res) => {
                    let maintenanceList = [];
                    res.data.forEach(item => {
                        maintenanceList.push({
                            name: item.name,
                            number: item.maintainCount,
                            percentage: Math.round(((item.maintainCount / item.count) * 100)),
                            allCount: item.count,
                            select:false
                        })
                    });
                    maintenanceList.sort(function (a, b) {
                        return b.percentage > a.percentage ? 1 : -1;
                    });
                    sCallback.call(this,maintenanceList)
                })
            },
            ajax(url,params, sCallback) {
                if(params!=''){
                    this.$ajax({
                        method: 'get',
                        params:params,
                        url: 'http://10.128.4.152:8080/warehouse' + url,
                    }).then((res) => {
                        sCallback.call(this, res);
                    }).catch(err => {
                        this.$message.error(err);
                    })
                }else {
                    this.$ajax({
                        method: 'get',
                        url: 'http://10.128.4.152:8080/warehouse' + url,
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