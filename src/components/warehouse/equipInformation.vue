<template>
    <div class="equipInformation">
        <form-container ref="form" :model="form">
            <field-input v-model="form.age" label="装备名称" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.require)" prop="age"></field-input>

            <field-input v-model="form.modelss" label="装备大类" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.require)" prop="modelss"></field-input>
            <field-input v-model="form.models" label="装备小类" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.require)" prop="models"></field-input>
            <field-input v-model="form.model" label="装备型号" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.require)" prop="model"></field-input>
            <field-input v-model="form.safeStock" label="标准库存" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.require)" prop="safeStock"></field-input>
            <field-input v-model="form.count" label="装备数量" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.require)" prop="count"></field-input>
            <field-input v-model="form.upkeepCycle" label="保养周期"  width="2.5" :disabled="disabled"
            ></field-input>
            <field-input v-model="form.chargeCycle" label="充电周期" width="2.5" :disabled="disabled"
            ></field-input>

            <!--M标识第三层-->

            <field-input v-model="form.manufacturerM" label="制造供应商" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.require)" prop="manufacturerM"></field-input>
            <field-input v-model="form.personM" label="联系人" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.require)" prop="personM"></field-input>
            <field-input v-model="form.phoneM" label="联系电话" width="2.5" :disabled="disabled"
                         :rules="r(true).all(R.mobile)" prop="phoneM"></field-input>
        </form-container>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    export default {
        name: "equipInformation",
        mixins: [formRulesMixin],
        data(){
            var checkAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('年龄不能为空'));
                }
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value < 18) {
                            callback(new Error('必须年满18岁'));
                        } else {
                            callback();
                        }
                    }
                }, 1000);
            };
            return{
                form:{},
                disabled:false,
                rules2: {
                    age: [
                        { validator: checkAge, trigger: 'blur' }
                    ]
                }
            }
        },
    }
</script>

<style scoped>
    .equipInformation{
        font-size: 16px;
        width: 100%;
        color: rgba(112, 112, 112, 1);
    }
</style>