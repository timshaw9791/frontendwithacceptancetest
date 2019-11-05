<template>
    <div>
        <el-table :data="list" v-loading.body="loading" element-loading-text="Loading"
                  fit highlight-current-row
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    v-if="batch"
                    width="55">
            </el-table-column>
            <bos-table-column lable="rfid" field="rfid"></bos-table-column>
            <bos-table-column lable="装备名称" field="name"></bos-table-column>
            <bos-table-column lable="装备序号" field="serial"></bos-table-column>
            <bos-table-column lable="架体编号" field="location.number"></bos-table-column>
            <bos-table-column lable="架体AB面"
                              :filter="(row)=>surface(row.location?row.location.surface:'暂无')"></bos-table-column>

            <!--<bos-table-column lable="保养周期/天" field="equipArg.upkeepCycle"></bos-table-column>-->

            <bos-table-column lable="保养周期/天" :filter="(row)=>milliToDay(row.equipArg.upkeepCycle)"></bos-table-column>


        </el-table>
        <div class="_contentBt" v-if="batch">
            <el-button @click="$emit('cancel',false)">取 消</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
        </div>
        <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage" />
      
       
      

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
    import { getEquipsList, equipsReturn } from "api/operation"
    import {transformMixin} from 'common/js/transformMixin'

    export default {
        data() {
            return {
                moreList:[],
                equipList: [],
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
                let params = {
                    page: this.paginator.page,
                    size: this.paginator.size,
                    state: "UPKEEP"
                };
                this.loading = true
                getEquipsList(params).then(res => {
                    this.list = JSON.parse(JSON.stringify(res.content))
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                    this.loading = false
                }).catch(res => {
                    this.loading = false
                })
            },
            confirmWare(){
            this.$refs.isWarehouse.show();
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

<style scoped>
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  height: 20px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background: rgba(47, 47, 118, 0.37);
  border-radius: 22px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #fff;
}
</style>