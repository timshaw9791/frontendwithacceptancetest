<template>
    <div class="open-gate-record-container">
        <my-header title="开柜记录"></my-header>
        <div class="header">
            <entity-input label="警柜"></entity-input>
        </div>
        <div class="body">
            <define-table :data="list" @changePage="changePage" >
                <define-column label="操作人员" field="operatorInfo"></define-column>
                <define-column label="开柜时间" field="rfid"></define-column>
                <define-column label="警柜" field="serial"></define-column>
                <define-column label="图片" field="operator"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from "../../components/base/header/header"
    import {openGateRecord} from "@/api/openrecord"
    export default {
        name: "openGate",
        components:{
            myHeader,
        },

        data(){
            return{
                list:[]
            }
        },

        methods:{
            fetchData(){
                openGateRecord().then((res)=>{
                    this.list = res.content
                })
                this.fixData()
            },
            fixData(){

            },
            changePage(){

            }
        },

        created() {
            this.fetchData()
        }

    }
</script>

<style scoped>
    .open-gate-record-container {
        font-size: 16px;
    }

    .header{
        padding: 16px 7px;
    }
</style>