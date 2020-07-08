<template>
    <div class="equip-arg-detail-container">
        <upload-file align="right" v-model="equipArgs.image" :disabled="true"></upload-file>
        <define-input label="装备名称" v-model="equipArgs.name" :disabled="true"></define-input>
        <define-input label="装备型号" v-model="equipArgs.model" :disabled="true"></define-input>
        <date-input label="保质期(天)" v-model="equipArgs.shelfLife" :disabled="true"></date-input>
        <date-input label="充电周期(天)" v-model="equipArgs.upkeepCycle" :disabled="true"></date-input>
        <date-input label="保养周期(天)" v-model="equipArgs.chargeCycle" :disabled="true"></date-input>
        <define-input label="供应商" v-model="equipArgs.supplier.name" :disabled="true"></define-input>
        <define-input label="联系人员" v-model="equipArgs.supplier.person" :disabled="true"></define-input>
        <define-input label="联系方式" v-model="equipArgs.supplier.phone" :disabled="true"></define-input>
    </div>
</template>

<script>
    import uploadFile from '@/componentized/uploadFile'
    import {getBosEntity} from '@/api/basic'

    export default {
        name: 'equipArgDetail',
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
        components: {uploadFile},
        methods: {
            fetchData() {
                getBosEntity(this.detailParam.id).then((res) => {
                    this.equipArgs = res.content
                })
            },
            fixData() {

            }
        },
        created() {
            this.fetchData()
        }
    }
</script>

<style scoped>
    .equip-arg-detail-container{
        width: 600px;
        height: 600px;
    }
</style>