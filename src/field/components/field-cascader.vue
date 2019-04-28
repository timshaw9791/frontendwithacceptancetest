<template>
    <form-item :label="label" :prop="prop" :width="width" :rules="cRules">
        <el-cascader
                :disabled="cDisabled"
                :options="options"
                v-model="copyVal"
                filterable
                @change="change">
        </el-cascader>
    </form-item>
</template>

<script>
    import FormItem from './form-item.vue';
    import {initmixinBosInput} from '../common/mixinBosInput';

    export default {
        mixins: [initmixinBosInput],
        components: {
            FormItem
        },
        props: {
            options: {
                type: Array,
                default: [],
            },
            disabled: {
                type: [Boolean, String],
                default: false
            }
        },
        computed: {
            cDisabled() {
                return this.transformBoolean(this.disabled, true);
            },
        }

    }
</script>

<style scoped>

</style>