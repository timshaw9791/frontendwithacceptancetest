import {getPlatformHouse} from 'api/process'
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
        },
        mixinGetUser(id){
        },
        mixinGetHouse(id){
            getPlatformHouse(id).then(res=>{
                this.mixinObject.houseList=res;
            })
        },
        mixiGetLeader(data){
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