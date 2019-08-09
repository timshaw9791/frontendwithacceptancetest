<template>
    <div class="p_l_template">
        <div class="t_header">
            <img :src="getSrc()" class="t_h_img"></img>
            <span class="t_h_span" v-text="item.name"></span>
        </div>
        <div class="t_body">
            <div class="t_b_box"><span v-text="'性别:'"></span><span class="t_b_span" v-text="item.gender"></span></div>
            <div class="t_b_box"><span v-text="'角色:'"></span><span class="t_b_span" v-text="item.role.roleDescribe"></span></div>
            <div class="t_b_box"><span v-text="'职位:'"></span><span class="t_b_span" v-text="item.position"></span></div>
            <div class="t_b_box"><span v-text="'警号:'"></span><span class="t_b_span" v-text="item.policeSign"></span></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "personnelTemplate",
        props:{
            item:{
                type:Object
            }
        },
        data(){
            return{
                src:'http://10.128.4.152:8080/warehouse/images/',
            }
        },
        methods:{
            getRoleName(roleItems){
                let name='';
                roleItems.forEach(item=>{
                    name=name+item.roleDescribe+'/'
                });
                name=name.substr(0,name.length-1)
                return name
            },
            getSrc(){
                let srcs;
                if(this.item.faceInformation){
                    srcs=this.src+this.item.faceInformation
                }else {
                    srcs='./timg.png'
                }
                return srcs

            }
        }
    }
</script>

<style scoped>
.p_l_template{
    width:220px;
    height:340px;
    background:rgba(255,255,255,1);
    box-shadow:1px 3px 6px rgba(0,0,0,0.16);
    opacity:1;
    display: flex;
    flex-direction: column;
    margin-left: 23px;
    margin-right: 23px;
    margin-top: 16px;
    margin-bottom: 16px;
}
    .p_l_template .t_header{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .t_header .t_h_img{
        width: 90px;
        height: 90px;
        margin-top: 33px;
    }
    .t_header .t_h_span{
        margin-top: 15px;
        font-size: 20px;
    }
    .p_l_template .t_body{
        margin-top: 17px;
        padding-left: 24px;
        display: flex;
        flex-direction: column;
    }
    .t_body .t_b_box{
        margin-top: 11px;
    }
    .t_b_span{
        margin-left: 16px;
    }

</style>
