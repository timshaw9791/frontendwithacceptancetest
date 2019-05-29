<template>
    <div class="teaching">
        <my-header :title="'教学培训'"  :searchFlag="false" :haveBlack="true" @h_black="black"></my-header>
        <div class="action-bar">
            <span v-text="title"></span>
            <div class="input-box" v-if="viewStatus.searchFlag">
                <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
                <input class="input" v-model="search" :placeholder="'装备名称'" ></input>
            </div>
        </div>
        <div class="t-body">
            <list @clickCard="clickCard" :list="list" v-show="viewStatus.listFlag"></list>
            <resources-material v-show="viewStatus.rMFlag" @handleClick="instructional"></resources-material>
            <instructional v-if="viewStatus.insFlag" :ins="insData"></instructional>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import list from 'components/teaching/teachList'
    import resourcesMaterial from 'components/teaching/resourcesMaterial'
    import instructional from 'components/teaching/instructional'
    import teaching from 'gql/teaching.gql'
    import {fetchMixin} from 'field/common/mixinFetch'
    export default {
        name: "index",
        components:{
          myHeader,
            list,
            resourcesMaterial,
            instructional
        },
        mixins: [fetchMixin],
        data(){
            return{
                title:'装备的使用',
                search:'',
                condition:[],
                list:[],
                gqlList:[],
                insData:{},
                viewStatus:{
                    listFlag:true,
                    rMFlag:false,
                    insFlag:false,
                    searchFlag:true
                }
            }
        },
        watch: {
            'search':{
                handler(newval){
                    let qfilter={qfilter:{
                            key:'name',
                            operator:'LIKE',
                            value:'%'+newval+'%'
                        }};
                    this.getListGql(qfilter);
                }
            }
        },
        created(){
          let qfilter={qfilter:{
                  key:'id',
                  operator:'LIKE',
                  value:'%%'
              }};
          this.getListGql(qfilter);
        },
        methods:{
            clickCard(data){
                if (this.condition.length==0){
                    this.viewStatus.searchFlag=false;
                    this.list = data.modelList
                }else {
                    this.title=data.name+'-'+data.model;
                    this.viewStatus.listFlag=false;
                    this.viewStatus.rMFlag=true;
                }
                this.condition.push(data);
            },
            black(data){
                if(data){
                    this.condition.splice(this.condition.length-1,1);
                    if(this.condition.length==0){
                        this.viewStatus.searchFlag=true;
                        this.list=this.gqlList
                    }else if(this.condition.length==1){
                        this.title='装备的使用';
                        this.list =this.condition[0].modelList;
                        this.viewStatus.listFlag=true;
                        this.viewStatus.rMFlag=false;
                    }else {
                        let deletAll = (source, willDeleted) => {
                            willDeleted = willDeleted.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
                            return source.replace(new RegExp(willDeleted,"g"),"");
                        };
                        this.title=deletAll(this.title,'的使用方法');
                        this.viewStatus.rMFlag=true;
                        this.viewStatus.insFlag=false
                    }
                }
            },

            instructional(data){
                this.insData=data;
                this.title=this.title+'的使用方法';
                this.viewStatus.rMFlag=false;
                this.viewStatus.insFlag=true;
                this.condition.push(data);
            },
            getListGql(qfilter){
                this.gqlQuery(teaching.getEquipArgList,qfilter, (data) => {
                    this.gqlList=this.inintList(data);
                    this.list=this.gqlList;
                }, true)
            },
            inintList(list){
                let newList=[];
                let type=[];
                list.forEach(item=>{
                    if(type.length==0){
                        type.push(item.name);
                        newList.push({
                            name:item.name,
                            src:item.name,
                            modelList:[item]
                        })
                    }else {
                        let typeIndex=type.findIndex(typeName=>typeName===item.name)
                        if(typeIndex==-1){
                            type.push(item.name);
                            newList.push({
                                name:item.name,
                                src:item.name,
                                modelList:[item]
                            })
                        }else {
                            newList[typeIndex].modelList.push(item)
                        }
                    }
                });
               return newList
            }
        }
    }
</script>

<style scoped>
    .teaching {
        display: flex;
        width: 100%;
        flex-direction: column;
        font-size: 16px;
        color: rgba(112, 112, 112, 1);
    }
    .teaching .action-bar {
        margin-top: 8px;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        padding-left: 20px;
        width: 100%;
    }
    .teaching .t-body{
        width: 100%;
    }
    .action-bar .input-box{
        width:285px;
        position: relative;
    }
    .input-box .input{
        width: 100%;
        height:38px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(112,112,112,1);
        opacity:1;
        border-radius:19px;
        padding-left: 15px;
        outline:medium;
    }
    .input-box .icon-search{
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }
</style>