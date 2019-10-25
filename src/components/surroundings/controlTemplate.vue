<template>
    <div class="c_template" @click="handleConctrol">
        <svg-icon :icon-class="templateData.flag?templateData.svg:templateData.notSvg" class="svg"></svg-icon>
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
        height: 0.6875rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-bottom:1px solid rgba(112,112,112,0.13);
        border-left:1px solid rgba(112,112,112,0.13);
    }
    .c_template .svg{
        width: 0.3125rem;
        height: 0.3125rem;
    }
    .c_template .span{
        font-size:0.0833rem;
        line-height:0.1042rem;
        margin-top: 0.0521rem;
        color: #707070
    }
</style>