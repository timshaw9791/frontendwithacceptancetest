<template>
    <div>
        <div class="equipArgs-container">
            <my-header :title="showData.title" :have-black="showData.haveBack" @h_black="back"></my-header>
            <div class="equipArgs-body">
                <equip-args-list @showFun="showFun" v-if="!showData.isEdit" ></equip-args-list>
                <equip-args-edit @showFun="showFun" v-if="showData.isEdit" ></equip-args-edit>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from "../../components/base/header/header"
    import equipArgsEdit from "./equipArgsEdit";
    import equipArgsList from "./equipArgsList";
    const def = {
        title: "装备参数",
        isEdit:false,
        haveBack:false,
        equipArgs:{}
    }
    export default {
        name:"equipArgs",
        components: {
            myHeader,
            equipArgsEdit,
            equipArgsList
        },
        data() {
            return {
                showData:def,
            }
        },
        methods: {
            showFun(data) {
                this.showData=data
            },
            back(){
                this.showData = def
            }
        },

    }
</script>
<style lang="scss" scoped>
    .equipArgs-container {
        color: #707070FF;
        font-size: 16px;
    }
</style>