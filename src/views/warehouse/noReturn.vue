<template>
    <div class="charging">
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div class="action-bar">
            <div class="_buttons" style="margin-right: 18px">
            <BosInput
                    placeholder="开门人员"
                    suffix="el-icon-search"
                    v-model="search"
                    style="width:285px;">

            </BosInput>
        </div>
             </div>
            <div class="main_table">
                <div >
                    <el-table :data="list" fit highlight-current-row height="3.55rem">
                        <bos-table-column lable="RFID" field="rfid"></bos-table-column>
                        <bos-table-column lable="装备序号" field="serial"></bos-table-column>
                        <bos-table-column lable="装备名称" field="equip_name"></bos-table-column>
                        <bos-table-column lable="装备型号" field="model"></bos-table-column>
                        <bos-table-column lable="领取人员" field="operator"></bos-table-column>

                        <bos-table-column lable="领取时间" field="create_time" :filter="(row)=>$filterTime(parseInt(row.create_time))"></bos-table-column>

    
                    </el-table>

                    <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>

                </div>


                
            </div>
        </el-card>

    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import {formRulesMixin} from 'field/common/mixinAxios';
    import {transformMixin} from 'common/js/transformMixin'
    import {findNoReturn} from "api/equiprecord";


    export default {
        data() {
            return {
              list:[],
              search:'',
              paginator: {
                    page: 1,
                    totalPages: 10,
                    size: 9
                },
            }
        },
        mixins: [formRulesMixin, transformMixin],
        methods: {
            
             getList(name) {
                 let params = {page: this.paginator.page, size: this.paginator.size,name:name};
                 findNoReturn(params).then(res=>{
                     console.log("res")
                     console.log(res)
                     this.list = res.content
                     console.log("this.list");
                     console.log(this.list);
                });
            }
        },


        watch: {
            search(newVal){
                this.getList(newVal)
            }
        },
        created(){
        this.getList('')
        },
        components: {
          
        }
    }
</script>

<style lang="scss"  scoped>
    .charging {
        font-size: 16px;
    }
    .el-card {
        border: none !important;
    }

  .main_table{
      
  }
  .action-bar{
      height: 50px;
      width:400px;
     
  }
</style>