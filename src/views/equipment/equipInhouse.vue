<template>
    <div class="opening-box">
         <div class="apply-process-top" data-test="action_box">
                <define-input label="单号" v-model="orderNumber" :disabled="true" class="odd-number"></define-input>
                <define-input label="入库时间"  :disabled="true" class="odd-number"></define-input>
                <define-input label="入库人员" :disabled="true"  class="odd-number"></define-input>
            </div>
        <div class="data-list">
            <bos-tabs>
                        <template slot="slotHeader">
                            <base-button label="读取数据" align="right" :disabled="!select.selected" :width="96" @click="readData"></base-button>
                            <base-select label="硬件选择" v-model="select.selected" align="right" :selectList="select.handWareList"></base-select>
                        </template>
                        <define-table :data="list" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total">
                            <define-column label="操作" width="100" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                                <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="装备参数" v-slot="{ data }">
                                <!-- <entity-input v-model="data.row.equipArg" :options="{}" :disabled="true" format="{name}({model})"></entity-input> -->
                            </define-column>
                            <define-column label="装备位置" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="单价" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="生产日期" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                        </define-table>
                        <define-table :data="list" height="2.8646rem" :havePage="false" slot="detail">
                            <define-column label="操作" width="100" v-slot="{ data }">
                               <i class="iconfont icontianjialiang" @click="changeRow(true,data)"></i>
                               <i class="iconfont iconyichuliang" @click="changeRow(false,data)"></i>
                            </define-column>
                            <define-column label="RFID" field="rfid"></define-column>
                            <define-column label="装备序号" v-slot="{ data }">
                                <!-- <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input> -->
                            </define-column>
                        </define-table>
                    </bos-tabs>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import { getInhouseNumber} from "api/storage"
export default {
    components:{
            myHeader,
            textInput,
            defineInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            divTmp,
            bosTabs
        },
        data(){
            return{
               list:[],
               orderNumber:'————',
               paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
               select: {
                    handWareList: [{
                        label: "手持机",
                        value: 'handheld'
                    }, {
                        label: "读卡器",
                        value: "reader"
                    }],
                    selected: ""
                },
            }
        },
        methods:{
            selRow(){

            },
            sumFunc(){

            },
            getList(){
                
            },
            changePage(page) {
            this.paginator.page = page;
            }
        },
        created(){
            this.getList()
        }
}
</script>
<style lang="scss" scoped>
.opening-box{
    font-size: 16px;
    width: 100%;
    min-height: 4.4323rem;
    .btn_box{
    height:30px;
    border-top:1px solid rgba(112, 112, 112, 0.13);
    border-bottom:1px solid rgba(112, 112, 112, 0.13);
    }
    .data-list
    {
        padding: 0 10px;
        margin-top:15px;
        height:"2.8648rem";
        // border:1px solid rgba(112, 112, 112, 0.13)
    }
    .span-box{
        display:flex;
        justify-content: space-between;
    }
}

</style>