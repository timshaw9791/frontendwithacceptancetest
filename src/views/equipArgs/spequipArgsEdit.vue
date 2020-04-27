<template>
    <div class="equip-args-edit-container">
        <my-header :title=title :have-black="true" @h_black="$emit('back')"></my-header>
        <div class="body">
            <define-input label="装备名称" v-model="equipArgs.name" :disabled="disabled"></define-input>
            <define-input label="装备型号" v-model="equipArgs.model" :disabled="disabled"></define-input>
            <br><br><br>
            <upload-file margin="-50px 150px 0 0" v-model="equipArgs.image" align="right" :disabled="disabled"></upload-file>
            <date-input label="质保期(天)" filter="toDay" v-model="equipArgs.shelfLife" :disabled="disabled"></date-input>
            <date-input label="充电周期(天)" filter="toDay" v-model="equipArgs.chargeCycle" :disabled="disabled"></date-input>
            <br><br><br>
            <date-input label="保养周期(天)" filter="toDay" v-model="equipArgs.upkeepCycle" :disabled="disabled"></date-input>
            <entity-input label="供应商" :disabled="disabled" v-model="equipArgs.supplier" format="{name}" :options="{search:'supplierSelect'}"></entity-input>
            <number-input v-model="test"></number-input>
        </div>
        <div class="footer">
            <base-button label="确定" v-show="!disabled||isAdd" @click="submit()"></base-button>
            <base-button label="编辑" v-show="disabled&&!isAdd" @click="disabled=false"></base-button>
        </div>
    </div>
</template>

<script>
import myHeader from "@/components/base/header/header"
import uploadFile from '@/componentized/uploadFile'
import { saveEquipArg, editEquipArg } from 'api/equipArgs'
export default {
    name: 'equipArgsEdit',
    data() {
        return {
            disabled: true,
            test: '11223',
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
    props:['isAdd', 'equipData'],
    computed: {
        title() {
            return this.isAdd?'新增装备参数':this.edit?'编辑装备参数':'装备参数详情';
        }
    },
    methods: {
        submit() {
            if(this.isAdd) {
                saveEquipArg(this.equipArgs).then(res => {
                    this.$message.success('新增成功');
                    this.$emit('back');
                })
            } else {
                editEquipArg(this.equipArgs.id, this.equipArgs).then(res => {
                    this.$message.success('修改成功');
                    this.$emit('back');
                })
            }
        }
    },
    created() {
        if(this.equipData) this.equipArgs = JSON.parse(JSON.stringify(this.equipData));
        this.disabled = !this.isAdd;
    },
    components: { myHeader, uploadFile }
}
</script>

<style lang="scss" scoped>
.equip-args-edit-container {
    font-size: 16px;
}
.body {
    width:  1300px;
    margin: 50px auto;
}
.footer {
    text-align: center;
}
</style>