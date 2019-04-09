<template>
    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false"></el-tree>
</template>

<script>
    export default {
        name: "field-tree",
        props:{
          treeData:{
              type:Object,
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
          console.log(this.treeData)
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