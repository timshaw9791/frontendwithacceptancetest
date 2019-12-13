<template>
    <div class="maintenance_body">
        <div class="maintenance_body_table_box">
            <el-table class="maintenance_table" :data="list" fit
                      :row-class-name="tableRowClassName">
                <bos-table-column lable="装备名称" field="equipArg.name" :align="'left'"></bos-table-column>
                <bos-table-column lable="装备型号" field="equipArg.model" :align="'left'"></bos-table-column>
                <bos-table-column lable="供应商" field="equipArg.supplier.name" :align="'left'"></bos-table-column>
                <bos-table-column lable="联系人" field="equipArg.supplier.person" :align="'left'"></bos-table-column>
                <bos-table-column lable="联系方式" field="equipArg.supplier.phone" :align="'left'"></bos-table-column>
                <bos-table-column lable="保养周期" :filter="(row)=>milliToDay(row.equipArg.upkeepCycle)" :align="'left'"></bos-table-column>
                <bos-table-column lable="可用/领用"
                :filter="(row)=>row.inHouseCount+'/'+row.receiveHouseCount"
                :align="'left'"></bos-table-column>
                <bos-table-column lable="正在保养" field="keepingCount" :align="'left'"></bos-table-column>
                <bos-table-column lable="保养时长" :filter="(row)=>milliToDay(row.keepingTime)" :align="'left'"></bos-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div class="fold_box">
                            <div class="fold_title">
                                <div class="fold_title_item">装备位置</div>
                                <div class="fold_title_item">数量</div>
                            </div>
                            <div class="fold_body">
                                <div class="fold_item" v-for="(item,index) in props.row.equipCountByLocations" :style="index==0?'padding-left: 0.038rem;':''">
                                    <div class="fold_body_item" v-text="surface(item)"></div>
                                    <div class="fold_body_item"> {{item.number}}</div>
                                </div>

                            </div>
                            <!--<div class="fold">-->
                            <!--<div class="fold_title">-->
                            <!--装备位置-->
                            <!--</div>-->
                            <!--<div class="fold_body">-->
                            <!--<div class="fold_item" v-for="item in props.row.location">-->
                            <!--{{item.locations}}-->
                            <!--</div>-->
                            <!--</div>-->
                            <!--</div>-->
                            <div class="fold-line"></div>
                            <!--<div class="fold">-->
                            <!--<div class="fold_title">-->
                            <!--数量-->
                            <!--</div>-->
                            <!--<div class="fold_body">-->
                            <!--<div class="fold_item" v-for="item in props.row.location">-->
                            <!--{{item.number}}-->
                            <!--</div>-->
                            <!--</div>-->
                            <!--</div>-->
                        </div>
                    </template>
                </el-table-column>
                <!--<bos-table-column -->
                <!--lable="架体AB面" -->
                <!--:filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"-->
                <!--&gt;</bos-table-column>-->
                <!--<bos-table-column lable="保养周期/天" :filter="(row)=>milliToDay(row.upkeepCycle)"></bos-table-column>-->
                <!--<bos-table-column lable="上次保养时间" :filter="(row)=>$filterTime(row.lastUpkeepTime)"></bos-table-column>-->
                <!--<bos-table-column-->
                <!--lable="保养倒计时"-->
                <!--:filter="(row)=>countdown(row.lastUpkeepTime,row.upkeepCycle)"-->
                <!--&gt;</bos-table-column>-->
            </el-table>
        </div>
        <!--<el-table :data="list" v-loading.body="loading" element-loading-text="Loading"-->
                  <!--fit highlight-current-row-->
                  <!--@selection-change="handleSelectionChange" height="3.55rem">-->
            <!--<el-table-column-->
                    <!--type="selection"-->
                    <!--v-if="batch"-->
                    <!--width="55">-->
            <!--</el-table-column>-->
            <!--<bos-table-column lable="rfid" field="rfid"></bos-table-column>-->
            <!--<bos-table-column lable="装备名称" field="name"></bos-table-column>-->
            <!--<bos-table-column lable="装备序号" field="serial"></bos-table-column>-->
            <!--<bos-table-column lable="架体编号" field="location.number"></bos-table-column>-->
            <!--<bos-table-column lable="架体AB面"-->
                              <!--:filter="(row)=>surface(row.location?row.location.surface:'暂无')"></bos-table-column>-->

            <!--&lt;!&ndash;<bos-table-column lable="保养周期/天" field="equipArg.upkeepCycle"></bos-table-column>&ndash;&gt;-->

            <!--<bos-table-column lable="保养周期/天" :filter="(row)=>milliToDay(row.equipArg.upkeepCycle)"></bos-table-column>-->


        <!--</el-table>-->
        <div class="_contentBt" v-if="batch">
            <el-button @click="$emit('cancel',false)">取 消</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
        </div>
        <!--<bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage" />-->
      
       
      

        <!--<serviceDialog title="请确认入库装备清单" ref="StorageDialog" @confirm="submit" @cancel="cancelbatch" width="1040px">-->
            <!--<el-table :data="moreList" height="500" fit >-->
              <!--<el-table-column label="序号" width="60" align="center">-->
                <!--<template scope="scope">{{ scope.$index + 1 }}</template>-->
              <!--</el-table-column>-->
              <!--<bos-table-column lable="RFID" field="rfid"></bos-table-column>-->
              <!--<bos-table-column lable="装备名称" field="name"></bos-table-column>-->
              <!--<bos-table-column lable="装备序号" field="serial"></bos-table-column>-->
              <!--<bos-table-column lable="架体编号" field="location.number"></bos-table-column>-->
              <!--<bos-table-column-->
                <!--lable="架体AB面"-->
                <!--:filter="(row)=>surface(row.location?row.location.surface:'暂无')"-->
              <!--&gt;</bos-table-column>-->
            <!--</el-table>-->
        <!--</serviceDialog>-->

    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import serviceDialog from 'components/base/serviceDialog'
    import { getEquipsList, equipsReturn,findkeepingequips } from "api/operation"
    import {transformMixin} from 'common/js/transformMixin'

    export default {
        data() {
            return {
                moreList:[],
                equipList: [],
                list: [],
                loading: true,
                paginator: {page: 1, size: 10, totalPages: 5, totalElements: 5}
            }
        },
        mixins: [formRulesMixin, transformMixin],

        props: {
            batch: {
                type: [Boolean, String],
                default: false
            }
        },

        components: {
            serviceDialog
        },
        methods: {
            getList() {
                findkeepingequips().then(res=>{
                    this.list=res
                });
                // this.list = [{
                //     name: '金属手铐',
                //     model: '装备型号',
                //     approve: 3,
                //     neckband: 1,
                //     waiting: 1,
                //     interval: 30,
                //     supplier: '浙江华安安全设备有限公司'
                //     ,
                //     liaison: '周行行',
                //     phone: '18923453436',
                //     location: [{locations: '10架/A面/2节/6层', number: 10}, {
                //         locations: '10架/A面/2节/6层',
                //         number: 10
                //     }, {locations: '10架/A面/2节/6层', number: 10}, {
                //         locations: '10架/A面/2节/6层',
                //         number: 10
                //     }, {locations: '10架/A面/2节/6层', number: 10},]
                // },
                //     {
                //         name: '金属手铐',
                //         model: '装备型号',
                //         approve: 3,
                //         neckband: 1,
                //         waiting: 1,
                //         interval: 30,
                //         supplier: '浙江华安安全设备有限公司'
                //         ,
                //         liaison: '周行行',
                //         phone: '18923453436',
                //         location: [{locations: '10架/A面/2节/6层', number: 10}, {
                //             locations: '10架/A面/2节/6层',
                //             number: 10
                //         }, {locations: '10架/A面/2节/6层', number: 10}, {
                //             locations: '10架/A面/2节/6层',
                //             number: 10
                //         }, {locations: '10架/A面/2节/6层', number: 10}]
                //     },
                //     , {
                //         name: '金属手铐',
                //         model: '装备型号',
                //         approve: 3,
                //         neckband: 1,
                //         waiting: 1,
                //         interval: 30,
                //         supplier: '浙江华安安全设备有限公司'
                //         ,
                //         liaison: '周行行',
                //         phone: '18923453436',
                //         location: [{locations: '10架/A面/2节/6层', number: 10}, {
                //             locations: '10架/A面/2节/6层',
                //             number: 10
                //         }, {locations: '10架/A面/2节/6层', number: 10}]
                //     }]
                // let params = {
                //     page: this.paginator.page,
                //     size: this.paginator.size,
                //     state: "UPKEEP"
                // };
                // this.loading = true
                // getEquipsList(params).then(res => {
                //     this.list = JSON.parse(JSON.stringify(res.content))
                //     this.paginator.totalPages = res.totalPages
                //     this.paginator.totalElements = res.totalElements
                //     this.loading = false
                // }).catch(res => {
                //     this.loading = false
                // })
            },
            confirmWare(){
            this.$refs.isWarehouse.show();
            },
            tableRowClassName({row, rowIndex}) {
                return 'table-row';
            },
            submit() {
                if (0 in this.equipList) {
                    equipsReturn(this.equipList).then(res => {
                        this.$message.success("入库成功!")
                        this.equipList = []
                        this.getList()
                        this.$refs.StorageDialog.hide()
                    })
                } else {
                    this.$message.error('未选择装备!')
                }
                this.$emit("tobatch")
            },
            handleSelectionChange(val) {
                this.equipList = val.map((res) => {
                    console.log(res);
                    return res.id
                });
                this.moreList=val.map((res)=>{
                    return res
                })
               

            },
            DialogShow() {
                this.$refs.StorageDialog.show();
            },
            cancelbatch(){
                this.$emit('cancel',false)
            },
            changePage(page) {
                this.paginator.page = page
                this.getList()
            }
        },
        mounted() {
            this.getList()
        },
    }
</script>
<style lang="scss" scoped>
    /deep/ .el-table .table-row {
        background: #FAEEDA;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: rgba(255, 255, 255, 0) !important;
    }

    /deep/ .el-table__expanded-cell[class*=cell] {
        padding: 0px 0px;
    }

    .el-card {
        border: none !important;
        font-size: 16px;
    }

   .maintenance_body {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 34px
    }

    .maintenance_body .maintenance_body_table_box {
        width: 7.8698rem;
        height: 3.55rem
    }

    .maintenance_body_table_box .maintenance_table {
        width: 7.8698rem;
        border: 1px solid rgba(112, 112, 112, 0.13)
    }

    .maintenance_table .fold_box {
        width: 7.8698rem;
        height: 0.4323rem;
        display: flex;
        flex-direction: row;
        color: black;
        position: relative;
        background:  #F5F5F5;
    }

    .fold_box .fold-line {
        height: 1px;
        width: 100%;
        background: rgba(112, 112, 112, 0.15);
        position: absolute;
        margin-top:calc(0.4323rem/2);
    }

    .fold_box .fold {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
    }

    .fold_box .fold_title {
        min-width: calc(7.6198rem / 8);
        height: 100%;
        margin-left: 0.023rem;
    }
    .fold_title .fold_title_item{
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 0.032rem;
    }
    .fold_box .fold_body {
        max-width: calc(7.8698rem / 8 * 7);
        min-width: calc(7.8698rem / 8 * 7);
        height: 100%;
        display: flex;
        overflow: auto;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .fold_body::-webkit-scrollbar {
        width: 2px;
        height: 5px;

    }
    .fold_body::-webkit-scrollbar-thumb {
        background-color:rgba(144, 147, 153, 0.1);
    }
    .fold_body::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: #F5F5F5;
        border-radius: 10px;
        background: #F5F5F5;
    }
    .fold_body::-webkit-scrollbar-thumb:hover {
        background: rgba(144, 147, 153, 0.3);
    }

    .fold_item .fold_body_item{
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: left;
    }
    .fold_body .fold_item {
        display: flex;
        min-width: calc(7.6198rem / 8 * 2);
        flex-direction: column;
        height: 100%;
    }

    .maintenance-list-box {
        border: 1px solid rgba(112, 112, 112, 1);
        border-radius: 5px;
    }

    .bottom-tip {
        margin-top: 0.0521rem;
        font-size: 0.0833rem;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 0.1042rem;
        color: rgba(112, 112, 112, 1);
    }
</style>
<style scoped>
/*::-webkit-scrollbar {*/
  /*width: 10px;*/
  /*height: 10px;*/
/*}*/
/*::-webkit-scrollbar-thumb {*/
  /*height: 20px;*/
  /*box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);*/
  /*background: rgba(47, 47, 118, 0.37);*/
  /*border-radius: 22px;*/
/*}*/
/*::-webkit-scrollbar-track {*/
  /*box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);*/
  /*border-radius: 10px;*/
  /*background-color: #fff;*/
/*}*/
</style>