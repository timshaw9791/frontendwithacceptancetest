<template>
    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false"></el-tree>
</template>

<script>
    export default {
        name: "field-tree",
        props:{
          treeData:{
              type:Array,
              require:true
          },
          defaultProps:{
              type:Object,
              require:true
          }
        },
        data(){
            return{

            }
        },
        created(){

        },
        methods:{
            handleNodeClick(data) {
                this.$emit('node',data)
            }
        }
    }
</script>

<style scoped>

</style>