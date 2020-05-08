<template>
  <div :class="['bos-paginator-container',{border}]" v-if="paginationFlag">
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
      },
      border: {
        type: Boolean,
        default: false
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
 .bos-paginator-container {
   padding: 6px 0;
 }
  .pagination {
    text-align: center;
  }
  .border {
    border: 1px solid #ebeef5;
    border-top: none;
  }
</style>
