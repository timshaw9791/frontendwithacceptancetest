<template>
    <div>
        <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
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
            <el-button type="primary" @click="DialogShow">提 交</el-button>
        </div>
        <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>


        <serviceDialog title="提示" ref="dialogButton" @confirm="dialogSubmit">
            <div class="_dialogDiv">
                您确定要保养此装备吗!?
            </div>
        </serviceDialog>

        <serviceDialog title="请确认入库装备清单" ref="StorageDialog" @confirm="submit" width="1040px">
            <el-table :data="list" height="500" fit >
              <el-table-column label="序号" width="60" align="center">
                <template scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <bos-table-column lable="RFID" field="rfid"></bos-table-column>
              <bos-table-column lable="装备名称" field="name"></bos-table-column>
              <bos-table-column lable="装备序号" field="serial"></bos-table-column>
              <bos-table-column lable="架体编号" field="location.number"></bos-table-column>
              <bos-table-column
                lable="架体AB面"
                :filter="(row)=>surface(row.location?row.location.surface:'暂无')"
              ></bos-table-column>
            </el-table>
        </serviceDialog>

    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import serviceDialog from 'components/base/serviceDialog'
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'

    export default {
        data() {
            return {
                equipList: [],
                param: {
                    qfilter: {
                        "key": "state",
                        "operator": "EQUEAL",
                        "value": "UPKEEP"
                    },
                },
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
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipList);
            },
        },
        methods: {
            submit() {
                if (0 in this.equipList) {
                    this.gqlMutate(api.houseUser_returnEquip, {
                        equipIds: this.equipList,
                    }, (res) => {
                        console.log(res);
                        this.callback('入库成功!');
                        this.equipList = [];
                    })
                } else {
                    this.$message.error('未选择装备!')
                }
            },
            dialogSubmit() {
                if (0 in this.equipList) {
                    this.gqlMutate(api.admin_upkeepEquips, {
                        equipIdList: this.equipList,
                    }, (res) => {
                        console.log(res);
                        this.$refs.dialogButton.hide();
                        this.callback('正在保养了!');
                        this.equipList = [];
                    })
                } else {
                    this.$message.error('未选择装备!')
                }
            },

            handleSelectionChange(val) {
                this.equipList = val.map((res) => {
                    console.log(res);
                    return res.id
                });

            },
            DialogShow() {
                // this.$message.error("该装备不属于装备保养清单！")
                console.log(this.list)
                console.log(this.list.equip)
                this.list = this.list.map(item => {
                    // return Object.assign(item, {rfidConfirm: -1}) // -1为初始 无显示， 1为勾， 0为感叹号
                    this.$set(item, "rfidConfirm", -1); // 对返回对象进行响应式属性添加
                    return item;
                });
                console.log(this.list)
                console.log(this.list.equip)
                this.$refs.StorageDialog.show();
                setTimeout(() => {
                    this.startRfid("19080011");
                }, 5000);
            },
        }
    }
</script>

<style scoped>

</style>