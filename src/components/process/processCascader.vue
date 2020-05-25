 <template>
    <div class="process-cascader">
        <el-cascader
                :options="cascader.options"
                v-model="value"
                :props="cascader.prop"
                change-on-select
                :show-all-levels="false"
                @change="handleUnitChange">
        </el-cascader>
    </div>
</template>

<script>
    export default {
        name: "processCascader",
        data() {
            return {
                value: [],
                cascader: {
                    options: [],
                    prop: {value: 'value', label: 'name', children: 'lowers'}
                }
            }
        },
        created() {
            this.getUnitList()
        },
        methods: {
            handleUnitChange(data) {
                this.$emit('handleUnitChange', data)
            },
            getUnitList() {
                this.cascader.options = [];
                function fs(item) {
                    item.value={
                        name:item.name,
                        id:item.id,
                        level:item.level
                    };
                    if(item.lowers!==null){
                        item.lowers.forEach(lowerItem=>{
                            fs(lowerItem);
                        })
                    }

                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .process-cascader {
        /deep/ .el-input__inner {
            height: 0.1667rem;
        }

        /deep/ .el-input__icon {
            width: 0.1302rem;
            line-height: 0.1667rem;
        }
    }
</style>