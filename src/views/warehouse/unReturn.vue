<template>
   <view-container>
       <div class="body">
           <define-table :data="list">
               <define-column label="装备参数" field="equipArgs"></define-column>
               <define-column label="RFID" field="rfid"></define-column>
               <define-column label="装备序号" field="serial"></define-column>
               <define-column label="领取人员" field="operator"></define-column>
               <define-column label="领取时间" field="receiveTime"></define-column>
               <define-column label="逾期(天)" field="overDueTime"></define-column>
           </define-table>
       </div>
   </view-container>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import {listMixin} from "../../field/mixins/listMixin"
    import BosTabs from "../../componentized/table/bosTabs"
    import {unReturn} from "@/api/unReturnEquips"

    export default {
        name: "receiveOrderInfo",
        components: {
            BosTabs,
            myHeader,
            listMixin
        },
        mixins: [listMixin],
        data() {
            return {
                list: []
            }
        },
        methods: {
            fetchData() {
                unReturn().then(res => {
                    this.list = res.content
                    this.fixData()
                });
            },
            fixData() {
                this.list.forEach(item => {
                    item.equipArgs = item.equipName + "(" + item.equipModel + ")"
                    //计算逾期时间
                    item.overDueTime =  new Date() - item.receiveTime
                    //向上取整 不足一天算一天
                    item.overDueTime=Math.ceil(item.overDueTime/86400000)
                    // 时间戳转日期
                    item.receiveTime = this.$filterTime(parseInt(item.receiveTime))
                })
            },
        }
    }
</script>

<style scoped>
    .un-return-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 8px;
    }
</style>