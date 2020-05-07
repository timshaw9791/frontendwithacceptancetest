<template>
    <div>
        <serviceDialog :title="title" ref="safetyDialog" width="3.3021rem"
                       :button="false">
        <div v-if="dialogData.type=='add'">

        </div>
        <base-select label="选择大类"></base-select>
        </serviceDialog>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import { } from "api/safety"

    export default {
        name: "safetyDialog",
        components: {
            serviceDialog,
            baseSelect
        },
        data() {
            return {
                title:""
            }
        },
        computed: {
            disabled() {
                if (this.type === 'unallocated') {
                    return false
                } else {
                    if (this.genre) {
                        return false
                    } else {
                        return true
                    }
                }
            },
        },
        created() {

        },
        activated() {
        },
        props: {
            dialogData: {
                type: Object
            },
        },
        methods: {
            titleShow(){
                if(this.dialogData.type == "edit"){
                    if(this.dialogData.data == "genres"){
                        this.title = "编辑大类"
                    }else if(this.dialogData.data == "category"){
                        this.title = "编辑小类"
                    }
                }else if(this.dialogData.type == "add"){
                    if(this.dialogData.data == "genres"){
                        this.title = "新增大类"
                    }else if(this.dialogData.data == "category"){
                        this.title = "新增小类"
                    }
                }
                this.$refs.safetyDialog.show()
            }
        }
    }
</script>

<style scoped>

</style>