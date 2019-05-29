<template>
    <div class="report-box">
        <my-header :title="'统计报表'" :searchFlag="false" :haveBlackTwo="false"></my-header>
        <div class="report-body">
            <div class="report-top">
                <div class="report-top-title">
                    <span v-text="'库存统计'" class="r_t_title-left"></span>
                    <div class="r_t_title-right">
                        <div class="title-right">
                            <div class="content">
                                <span v-text="'600'" style="font-size:25px"></span>
                                <span v-text="'出库总数'" style="margin-top: 4px;font-size: 14px"></span>
                            </div>

                            <img src="../../components/icons/svg/柱形图蓝.png" class="title-img"/>
                        </div>
                        <div class="title-right" style="margin-left: 32px">
                            <div class="content">
                                <span v-text="'1260'" style="font-size:25px"></span>
                                <span v-text="'在库总数'" style="margin-top: 4px;font-size: 14px"></span>
                            </div>
                            <img src="../../components/icons/svg/柱形图灰.png" class="title-img"/>
                        </div>
                    </div>
                </div>
                <warehoused :warehouseList="warehouseList"></warehoused>
            </div>
            <div class="report-bottom">
                <equip-report :equipData="maintenance" :title="'装备维修率'"></equip-report>
                <equip-report :equipData="maintenance" :title="'装备损耗率'"></equip-report>
                <equip-report :equipData="maintenance" :title="'装备使用率'"></equip-report>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import warehoused from 'components/report/warehousing'
    import equipReport from 'components/report/equipReport'
    export default {
        name: "index",
        components: {
            myHeader,
            warehoused,
            equipReport
        },
        data(){
            return{
                warehouseList:[],
                maintenance:[]
            }
        },
        created(){
            this.getWareHouse();
            this.getMaintain();
        },
        methods:{
            getWareHouse(){
              this.ajax('/statistic/genres/total',(res)=>{
                 this.warehouseList=res.data.genreStatisticList;

                  /*维修率
                  Maintenance rate*/
              })
            },
            getMaintain(){
                this.ajax('/statistic/maintain',(res)=>{
                    let maintenanceList=[];
                    res.data.forEach(item=>{
                        maintenanceList.push({
                            name:item.name,
                            maintainCount:item.maintainCount,
                            maintenanceRate:Math.round(((item.maintainCount/item.count)*100))
                        })
                    });
                    maintenanceList.sort(function(a, b) {
                        return b.maintenanceRate> a.maintenanceRate ? 1 : -1;
                    });
                    this.maintenance=maintenanceList
                })
            },
            ajax(url,sCallback) {
                this.$ajax({
                    method:'get',
                    url:'http://115.159.154.194/warehouse'+url,
                }).then((res)=>{
                    sCallback.call(this,res);
                }).catch(err=>{
                    this.$message.error(err);
                })
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