<template>
    <div class="opening-box">
        <div class="data-list">
            <bos-tabs :label="label">
                        <define-table :data="surfaceList" height="1.8rem" @changeCurrent="selRow" :havePage="false"
                            :highLightCurrent="true"  slot="total">
                            <define-column label="仓位名称" v-slot="{ data }">
                                <define-input  v-model="data.row.name" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="仓位代码" v-slot="{ data }">
                                <define-input v-model="data.row.number" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
                        <define-table :data="list" height="1.8rem" :havePage="false" slot="detail" @changeCurrent="selRow">
                           
                            <define-column label="警柜类型" v-slot="{ data }">
                                <define-input v-model="data.row.category" type="String" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="警柜编号" v-slot="{ data }">
                                <define-input v-model="data.row.cabinetNumber" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="所属人员" v-slot="{ data }">
                                <define-input v-model="data.row.name" type="String" :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
                    </bos-tabs>
        </div>
        <div class="footer">
            <base-button label="取消" type="none" @click="cancel"></base-button>
            <base-button label="确定" @click="selected"></base-button>
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
    import {getPoliceCabinets} from "api/warehouse"
    import {getLocation} from "api/storage"
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
        name: "equipLocationSelect",
        data(){
            return{
               list:[],
               orderNumber:'————',
               selectLocation:'',
               currentSel:'',
               label:[{label: '仓位',key: 'total'}, {label: '警柜',key: 'detail'}],
               surfaceList:[],
               policeList:[]
            }
        },
        methods:{
            selRow(current){
                if(!current) return; // 避免切换数据时报错
                console.log(current);
                 this.currentSel = current.current;
            },
            cancel() {
                this.$emit('cancel');
            },
            selected() {
                if(!this.currentSel) {
                    this.$message.warning("请选择装备位置");
                } else {
                    this.$emit('select', {data: this.currentSel, ref: 'locationSelect'});
                }
            },
            getList(){
                getLocation().then(res=>{
                    this.surfaceList=res.content
                    console.log(this.surfaceList);
                    this.surfaceList.forEach(item=>{
                   item.name=item.frameNumber+'架/'+item.surface+'面/'+item.section+'节/'+item.floor+'层'
                   item.number=item.frameNumber+'-'+item.surface+'-'+item.section+'-'+item.floor
                  })
                }).catch(err => {
                    this.$message.error(err.response.data.message)
                })
                getPoliceCabinets().then(res=>{
                    console.log(res);
                    this.list=res
                    this.list.forEach(item=>{
                        if(item.policeCabinetUserItems.length!=0)
                        {
                            item.name=item.policeCabinetUserItems[0].user.name
                        }
                        if(item.category=='SPARE_CABINET')
                        {item.category='备用柜'}
                        else if(item.category=='SINGLE_POLICE')
                        {
                            item.category='单警柜'
                        }
                        else if(item.category=='COMMON_CABINET'){
                            item.category='公共柜'}
                    })
                }).catch(err => {
                    this.$message.error(err.response.data.message)
                })
             

            },
            changePage(page) {
            this.paginator.page = page;
            },
            milliLocation(data)
            {
                return data.frameNumber+'架/'+data.section
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
    .footer {
    margin-top:15px;
    text-align: center;
    }
}

</style>