<template>
    <div class="resourcesMaterial">
        <div v-for="item in list">
            <div @click="handleClick(item)">
                <r_m_template :item="item" ></r_m_template>
            </div>
        </div>
    </div>
</template>

<script>
    import r_m_template from './resourcesMaterialTemplate'
    export default {
        name: "resourcesMaterial",
        components: {
            r_m_template
        },
        data(){
            return{
                list:[
                    {typeName:'MP4', name:'测试视频1.MP4'},
                    {typeName:'PDF', name:'测试PDF1.pdf'},
                    {typeName:'MP4', name:'测试视频2.MP4'},
                    {typeName:'PDF', name:'测试PDF2.pdf'}
                ],
                fileName:'',
                file:{},
                uniqueId:''
            }
        },
        created(){

        },
        mounted(){
        },
        methods:{
            handleClick(item){
                this.$emit('handleClick',item);
            }
            /*onInputFileChange() {
                let url ="/Users/gy/Movies/1.mp4";
                document.getElementById("audio_id").src = url;
            }*/
        }
    }
</script>

<style scoped>
    .resourcesMaterial{
        display: flex;
        flex-direction: row;
        flex-wrap:wrap;
    }
    .resourcesMaterial .inputfile{
        color: black;
    }
</style>