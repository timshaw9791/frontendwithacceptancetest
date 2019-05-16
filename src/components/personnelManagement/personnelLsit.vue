<template>
    <div class="p-s-list-box">
        <div  v-for="item in list">
            <div @click="clickPersonnel(item)">
                <p_template :item="item"></p_template>
            </div>
        </div>
        <div class="paginator-box"><bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"></bos-paginator></div>
    </div>
</template>

<script>
    import p_template from './personnelTemplate'
    import {formRulesMixin} from 'field/common/mixinTable';
    export default {
        name: "personnelLsit",
        components:{
            p_template
        },
        mixins: [formRulesMixin],
        data(){
          return{
              param:this.personnel.graphqlTable.graphqlKey,
              partialPiginator: {totalPages: 10, totalElements: 10},//默认值
          }
        },
        props:{
            personnel:{
                type:Object
            }
        },
        apollo:{
            list() {
                return this.getEntityListWithPagintor(this.personnel.graphqlTable.graphqlApi);
            },
        },
        methods:{
            clickPersonnel(item){
                this.$emit('clickPersonnel',item);
            }
        }
    }
</script>

<style scoped>
.p-s-list-box{
    width: 100%;
    font-size: 16px;
    color: #707070;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 10px;
}
    .p-s-list-box .paginator-box{
        width: 100%;
    }
</style>