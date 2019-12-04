import {getEquipArgs} from 'api/process'
export const applyProcessMixin = {
    data() {
        return {
           mixinObject:{
               equipArgs:[]
           }
        }
    },
    methods: {
        mixinEquipArgs(){
            getEquipArgs().then(res=>{
                this.classify(res);
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
            this.$set(this.mixinObject,'equipArgs',classifyList);
            console.log(this.mixinObject.equipArgs)
        },

    }
};