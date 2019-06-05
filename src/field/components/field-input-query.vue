<template>
    <el-autocomplete
            :size="size"
            v-model="copyVal"
            :placeholder="placeholder"
            :fetch-suggestions="querySearch"
            :disabled="cDisabled"
            @select="handleSelect"
    ></el-autocomplete>
</template>

<script>

    import {initmixinBosInput} from '../common/mixinBosInput';

    export default {
        data() {
            return {
            }
        },
        methods: {
            querySearch(queryString, cb) {
                var restaurants = this.inputList;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().includes(queryString.toLowerCase()));
                };
            },
            handleSelect(item) {
                this.$emit('select', item);
            },
        },
        computed: {
            cDisabled() {
                return this.transformBoolean(this.disabled);
            },
        },
        mixins: [initmixinBosInput],

        props: {
            size: {
                type: String,
            },
            placeholder: {
                type: String,
                default: '',
            },
            inputList: {
                type: [Array, Object],
                default: () => [],
            },
            disabled: {
                type: [Boolean, String],
                default: false
            },

        }
    }
</script>

<style scoped>

</style>