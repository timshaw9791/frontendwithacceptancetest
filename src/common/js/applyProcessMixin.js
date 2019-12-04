import {getEquipArgs,getApplyLeader} from 'api/process'
export const applyProcessMixin = {
    data() {
        return {
           mixinObject:{
               equipArgs:[],
               leaderList:[],
               processConfigId:''
           }
        }
    },
    methods: {
        mixinEquipArgs(){
            getEquipArgs().then(res=>{
                this.classify(res);
            })
        },
        getLeader(data){
            getApplyLeader(data).then(res=>{
                let leader=[];
                res.auditors.forEach(item=>{
                    if(item.level===1){
                        leader.push({value:item.leader,label:item.leader.name})
                    }
                });
                this.mixinObject.processConfigId=res.id;
                this.$set(this.mixinObject,'leaderList',leader);
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
            console.log(this.mixinObject.equipArgs)
            this.$set(this.mixinObject,'equipArgs',classifyList);
        },

    }
};