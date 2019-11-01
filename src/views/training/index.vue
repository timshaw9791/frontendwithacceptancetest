<template>
    <div class="teaching">
        <my-header :title="'教学培训'"  :searchFlag="false" :haveBlack="viewStatus.hasBlack" @h_black="black"></my-header>
        <div class="action-bar">
            <span v-text="title"></span>
            <div class="input-box" v-if="viewStatus.searchFlag">
                <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
                <input class="input" v-model="search" :placeholder="'装备名称'" ></input>
            </div>
        </div>
        <div class="t-body">
            <list @clickCard="clickCard" :list="list" v-show="viewStatus.listFlag"></list>
            <resources-material v-show="viewStatus.rMFlag" :rList="resourcesList" @handleClick="instructional"></resources-material>
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
                resourcesList:[],
                viewStatus:{
                    listFlag:true,
                    rMFlag:false,
                    insFlag:false,
                    searchFlag:true,
                    hasBlack:false
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
            clickCard(data){ // 这里点击后，组件/页面没有变化，只是数据变化
            console.log(data)
                if (this.condition.length==0){
                    this.viewStatus.searchFlag=false;
                    this.list = data.modelList;
                    this.viewStatus.hasBlack=!this.viewStatus.hasBlack
                }else {
                    let rList=[];
                    if(data.videoAddresses!=null&&data.videoAddresses!=''){
                        data.videoAddresses.forEach(item=>{
                            if(item!='')
                            {
                            rList.push({
                                typeName:'MP4',
                                name:item,
                                key:item
                            })
                           
                            }
                            
                        })
                    }
                    if(data.documentAddresses!=null&&data.documentAddresses!=''){
                        data.documentAddresses.forEach(item=>{
                            if(item!='')
                            {
                            rList.push({
                                typeName:'PDF',
                                name:item,
                                key:item
                            })
                            }
                            
                        })
                    }
                    this.resourcesList=rList;
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
                        this.list=this.gqlList;
                        this.viewStatus.hasBlack=!this.viewStatus.hasBlack
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
                    this.list.forEach(item=>{
                        item.modelList.forEach(modelItem=>{
                            if(modelItem.videoAddresses!=null&&modelItem.videoAddresses!=''){
                                modelItem.videoAddresses=modelItem.videoAddresses.split(',');

                            }
                            if(modelItem.documentAddresses!=null&&modelItem.documentAddresses!=''){
                                modelItem.documentAddresses=modelItem.documentAddresses.split(',')
                            }
                        })
                    })
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
                            imageAddress:item.imageAddress,
                            modelList:[item]
                        })
                    }else {
                        let typeIndex=type.findIndex(typeName=>typeName===item.name)
                        if(typeIndex==-1){
                            type.push(item.name);
                            newList.push({
                                name:item.name,
                                src:item.name,
                                imageAddress:item.imageAddress,
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
    .teaching .t-body{
        width: 100%;
    }
    .teaching .action-bar {
        margin-top: 0.0417rem;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        height: 0.2969rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        padding-left: 0.1042rem;
        width: 100%;
    }
    .action-bar .input-box{
        width:1.4844rem;
        position: relative;
    }
    .input-box .input{
        width: 100%;
        height:0.1979rem;
        background:rgba(255,255,255,1);
        border:1px solid rgba(112,112,112,1);
        opacity:1;
        border-radius:19px;
        padding-left: 0.0781rem;
        outline:medium;
    }
    .input-box .icon-search{
        position: absolute;
        right: 0.0521rem;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 0.1302rem;
        height: 0.1302rem;
        transform: translateY(-50%);
    }
</style>