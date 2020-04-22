<template>
    <div class="opening-box">
        <div class="data-list">
            <bos-tabs :label="label">
                        <define-table :data="surfaceList" height="2.8646rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total">
                            <define-column label="仓位名称" v-slot="{ data }">
                                 <define-input v-model="data.row.name"  :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="仓位代码" v-slot="{ data }">
                                <define-input v-model="data.row.number" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
                        <define-table :data="policeList" height="2.8646rem" :havePage="false" slot="detail">
                           
                            <define-column label="警柜类型" v-slot="{ data }">
                                <define-input v-model="data.row.category" type="String" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="警柜编号" v-slot="{ data }">
                                <define-input v-model="data.row.number" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="所属人员" v-slot="{ data }">
                                <define-input v-model="data.row.people" type="String" :tableEdit="false"></define-input>
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
               selectLocation:'',
               label:[{label: '仓位',key: 'total'}, {label: '警柜',key: 'detail'}],
               surfaceList:[{name:'10架/A面/10层/10节',number:'10-A-10-10'}],
               policeList:[{category:'单警柜',number:'1-01',people:'张三'},{category:'备用柜',number:'2-01',people:'李四'},{category:'公共柜',number:'3-01',people:'王五'}]
            }
        },
        methods:{
            selRow(current){
                if(!current) return; // 避免切换数据时报错
                console.log(current);
                // this.detailTable.list = [];
                // this.rowData = current;
                // if(current.rfid == undefined) return;
                // for(let rfid of current.rfid) {
                //     this.detailTable.list.push({
                //         rfid: rfid
                //     })
                
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
    // min-height: 4.4323rem;
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