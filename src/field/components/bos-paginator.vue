<template>
  <div style="margin: 8% auto" v-if="paginationFlag">
    <el-pagination
      class="pagination"
      background
      layout="prev,pager,next"
      :page-count="pageInfo.totalPages"
      :current-page="pageInfo.page"
      @current-change="handleCurrentChangeInner">
    </el-pagination>
  </div>
</template>


<script>

  export default {
    data(){
      return {
        labelWidth: '120px',
          paginationFlag:true,
      }
    },
    props: {
      pageInfo: {
        type: Object,
        default: null,
      }
    },
    watch:{
       'pageInfo.page':{
           handler(newVal){
               this.paginationFlag=!this.paginationFlag;
               setTimeout(()=>{
                   this.paginationFlag=!this.paginationFlag;
               },100)
           }
       }
    },
    methods:{
      handleCurrentChangeInner(newPageIndex){
        this.$emit("bosCurrentPageChanged",newPageIndex);
      }
    }

  }
</script>


<style>
  .pagination {
    text-align: center;
  }
</style>
