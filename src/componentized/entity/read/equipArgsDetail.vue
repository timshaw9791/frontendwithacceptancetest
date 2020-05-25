<template>
    <div class="equip-args-container">
        <upload-file align="right" v-model="equipArgs.image" :disabled="true"></upload-file>
        <define-input label="装备名称" v-model="equipArgs.name" margin="5px 0" :disabled="true"></define-input>
        <define-input label="装备型号" v-model="equipArgs.model" margin="5px 0" :disabled="true"></define-input>
        <date-input label="保质期(天)" v-model="equipArgs.shelfLife" margin="5px 0" :disabled="true"></date-input>
        <date-input label="充电周期(天)" v-model="equipArgs.upkeepCycle" margin="5px 0" :disabled="true"></date-input>
        <date-input label="保养周期(天)" v-model="equipArgs.chargeCycle" margin="5px 0" :disabled="true"></date-input>
        <entity-input label="供应商" v-model="equipArgs.supplier" format="{name}" margin="5px 0" :disabled="true"></entity-input>
        <define-input label="联系人员" v-model="equipArgs.supplier.person" margin="5px 0" :disabled="true"></define-input>
        <define-input label="联系方式" v-model="equipArgs.supplier.phone" margin="5px 0" :disabled="true"></define-input>
    </div>
</template>

<script>
import uploadFile from '@/componentized/uploadFile'
import {getBosEntity} from '@/api/basic'
export default {
    name: 'equipArgsDetail',
    data() {
        return {
            equipArgs: {
                name: '',
                model: '',
                shelfLife: 0,
                upkeepCycle: 0,
                chargeCycle: 0,
                supplier: {},
                image: '',
            }
        }
    },
    props: ['detailParam'],
    components: { uploadFile },
    methods:{
        fetchData(){
            getBosEntity(this.detailParam.id).then((res)=>{
                    this.equipArgs = res.content
            })
        },
        fixData(){

        }
    },
    created() {
        this.fetchData()
    }
}
</script>

<style scoped>
</style>