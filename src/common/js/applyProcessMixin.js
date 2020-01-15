import {getEquipArgs,getApplyLeader,getPlatformHouse,getUser} from 'api/process'
export const applyProcessMixin = {
    data() {
        return {
           mixinObject:{
               equipArgs:[],
               leaderList:[],
               processConfigId:'',
               houseList:[],
               userList:[]
           }
        }
    },
    methods: {
        mixinEquipArgs(){
            getEquipArgs().then(res=>{
                this.classify(res);
            })
        },
        mixinGetUser(id){
            getUser(id).then(res=>{
                this.mixinObject.userList=res;
            })
        },
        mixinGetHouse(id){
            getPlatformHouse(id).then(res=>{
                this.mixinObject.houseList=res;
            })
        },
        mixiGetLeader(data){
            getApplyLeader(data).then(res=>{
                let leader=[];
                res.auditors.forEach(item=>{
                    if(item.level===1){
                        leader.push(item.leader)
                    }
                });
                this.mixinObject.processConfigId=res.id;
                this.$set(this.mixinObject,'leaderList',leader);
                console.log('this.mixinObject',this.mixinObject)
            })
        },
        classify(data){
            let classifyList=[];
            data.forEach(item=>{
                if(classifyList.length===0){
                    item.equipArgModels=[item];
                    classifyList.push({value:item,label:item.name});
                }else {
                   let flag=true;
                    classifyList.forEach(classItem=>{
                        if (classItem.value.name===item.name){
                            classItem.value.equipArgModels.push(item);
                            flag=false
                        }
                    });
                    if (flag){
                        item.equipArgModels=[item];
                        classifyList.push({value:item,label:item.name});
                    }
                }
            });
            console.log(this.mixinObject.equipArgs);
            this.$set(this.mixinObject,'equipArgs',classifyList);
        },

    }
};