<template>
    <div class="opening-box">
          <my-header :title="$route.meta.title" :haveBlack="true" @h_black="cancel"></my-header>
        <div class="data-list">
           <bos-tabs :option="['contrast']" :layoutRatio="[2,1]" :contrastKey="['slot1', 'slot2']">
            <define-table :data="list" slot="slot1" height="4rem" @changeCurrent="selRow" :havePage="false"  >
                            <define-column label="操作" width="150" v-slot="{ data }">
                                <i class="iconfont icontianjialiang" ></i>
                                <i class="iconfont iconyichuliang" ></i>
                            </define-column>
                            <define-column label="位置修改"  v-slot="{ data }">
                                 <entity-input v-model="data.row.location"  :options="{search:'locationSelect'}" :formatFunc="$formatFuncLoc" :tableEdit="true" ></entity-input>
                            </define-column>
                            <define-column label="装备数量" v-slot="{ data }">
                                <define-input v-model="data.row.count" type="Number" :tableEdit="false"></define-input>
                            </define-column>
                            <define-column label="所属人员" v-slot="{ data }">
                                <define-input v-model="data.row.people"  :tableEdit="false"></define-input>
                            </define-column>
                        </define-table>
            <define-table :haveIndex="false"  slot="slot2" :havePage="false" :data="equipArg" height="4rem" >
                <define-column label="RFID"  v-slot="{data}">
                    <define-input v-model="data.row.rfid"  :tableEdit="false" ></define-input>
                </define-column>
                <define-column label="装备序号"  v-slot="{data}">
                    <define-input v-model="data.row.serial" :tableEdit="false" ></define-input>
                </define-column>
                <define-column label="装备参数" v-slot="{data}">
                    <entity-input v-model="data.row.equipArg" format="{name}({model})" :tableEdit="false" :options="{}"></entity-input>
                </define-column>
                <define-column label="原位置" v-slot="{data}">
                    <entity-input v-model="data.row.equipArg" format="{name}({model})" :tableEdit="false" :options="{}"></entity-input>
                </define-column>
                <define-column label="操作" v-slot="{data}">
                    <base-button label="删除" size="mini"></base-button>
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
               list:[{location:'',count:0,people:''}],
               orderNumber:'————',
               paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
               select: {
                    handWareList: [{
                        label: "手持机",
                        value: 'handheld'
                    }, {
                        label: "读写器",
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