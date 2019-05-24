<template>
    <div class="c_template" @click="handleConctrol">
        <svg-icon :icon-class="templateData.svg" class="svg"></svg-icon>
        <span v-text="templateData.text" class="span"></span>
    </div>
</template>

<script>
    export default {
        name: "controlTemplate",
        props:{
            templateData:{
                type:Object
            }
        },
        methods:{
            handleConctrol(){
                this.$emit('handleConctrol',this.templateData);
            }
        }
    }
</script>

<style scoped>
    .c_template{
        width: 50%;
        height: 132px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-bottom:1px solid rgba(112,112,112,0.13);
        border-left:1px solid rgba(112,112,112,0.13);
    }
    .c_template .svg{
        width: 60px;
        height: 60px;
    }
    .c_template .span{
        font-size:16px;
        line-height:20px;
        margin-top: 10px;
        color: #707070
    }
</style>