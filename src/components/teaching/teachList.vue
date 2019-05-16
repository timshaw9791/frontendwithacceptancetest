<template>
    <div class="t-list-box">
        <div v-for="item in list" @click="clickCard(item)">
            <t_templates :item="item"></t_templates>
        </div>
    </div>
</template>

<script>
    import t_templates from './teachListTemplate'
    export default {
        name: "teachList",
        components:{
            t_templates
        },
        data(){
            return{

            }
        },
        props:{
          list:{
              type:Array,
              default:[
                  {name:'测试',src:'@/assets/logo.png'},
                  {name:'测试1',src:'@/assets/logo.png'},
                  {name:'测试2',src:'@/assets/logo.png'},
                  {name:'测试3',src:'@/assets/logo.png'},
                  {name:'测试4',src:'@/assets/logo.png'},
                  {name:'测试5',src:'@/assets/logo.png'}
              ]
          }
        },
        created(){

        },
        methods:{
            clickCard(data){
                this.$emit('clickCard',data)
            }
        }
    }
</script>

<style scoped>
    .t-list-box{
        display: flex;
        justify-content: flex-start;
        flex-wrap:wrap;
        align-items: center;
        padding-left: 11px;
        padding-right: 11px;
    }
</style>