<template>
    <div class="entity-input-container" ref="entityInput" :style="`width:${fixWidth};margin:${fixMargin}`"
         :class="{'disabled':disabled&&!inTable,'border':!disabled||!inTable}">
        <!--在表格里就不显示label和*-->
        <div class="label" v-if="!inTable">
            {{ label }}
            <span class="required" v-if="required">*</span>
        </div>
        <input type="text" class="input" :disabled="disabled" v-model="insideValue"
               :style="`text-align:${fixInputTextAlign}`"
               readonly :placeholder="fixPlaceholder"/>
        <div class="icon">
            <i class="iconfont iconwenbenkuangshanchu" @click="clear"
               v-show="insideValue&&!disabled"></i>
            <i class="iconfont iconxuanze" @click="showSearch" v-show="search&&!disabled"></i>
            <i class="iconfont iconxiang" @click="showDetail" v-show="detail&&(inTable||disabled)"></i>
        </div>
        <service-dialog title="申请人员选择" ref="applicant" :button="false" :secondary="false">
            <applicant-select @select="selected" @cancel="$refs.applicant.hide()"></applicant-select>
        </service-dialog>
        <service-dialog title="位置信息选择" ref="locationSelect" :button="false" :secondary="false">
            <equip-location-select @select="selected" @cancel="$refs.locationSelect.hide()"></equip-location-select>
        </service-dialog>
        <service-dialog title="装备参数选择" ref="equipArgsSelect" width="1300px" :button="false" :secondary="false">
            <equip-args-select @select="selected" @cancel="$refs.equipArgsSelect.hide()"></equip-args-select>
        </service-dialog>
        <service-dialog title="机构选择" ref="organUnits" width="500px" :button="false" :secondary="false">
            <organ-units @select="selected" @cancel="$refs.organUnits.hide()"></organ-units>
        </service-dialog>
        <service-dialog title="供应商选择" ref="supplierSelect" width="500px" :button="false" :secondary="false">
            <supplier-select @select="selected" @cancel="$refs.supplierSelect.hide()"></supplier-select>
        </service-dialog>
        <service-dialog title="耗材选择" ref="consumableSelect" width="500px" :button="false" :secondary="false">
            <consumable-select @select="selected" @cancel="$refs.consumableSelect.hide()"></consumable-select>
        </service-dialog>
        <!-- 只读区 -->
        <service-dialog title="装备参数详情" ref="equipArgDetail" width="600px" :button="false" :secondary="false">
            <equip-arg-detail :detailParam="detailParam"></equip-arg-detail>
        </service-dialog>
    </div>
</template>

<script>
    import serviceDialog from "components/base/serviceDialog"
    import applicantSelect from "./select/applicantSelect"
    import equipArgsSelect from './select/equipArgsSelect'
    import equipLocationSelect from './select/equipLocationSelect'
    import organUnits from './select/organUnits'
    import supplierSelect from "./select/supplierSelect";
    import consumableSelect from "./select/consumableSelect";
    import equipArgDetail from './read/equipArgDetail'

    export default {
        name: 'entityInput',
        data() {
            return {
                insideValue: "",// 显示的内容
                inTable: false, // 是否为表格内联
                search: false,  // 是否显示搜索图标
                detail: false,  // 是否显示详情图标
            }
        },
        props: {
            label: {
                type: String,
                default: ""
            },
            value: {
                type: [String, Number, Object],
                default: ""
            },
            column: {
                type: Number,
                default: 3
            },
            height: {
                type: Number,
                default: 40
            },
            disabled: {
                type: Boolean,
                default: false
            },
            required: { // 是否必填
                type: Boolean,
                default: false
            },
            placeholder: {
                type: [Number, String],
                default: "--"
            },
            options: {
                type: Object,
                default() {
                    return {
                        search: 'applicant'
                    }
                }
            },
            format: {
                type: String,
                default: '[{policeSign}]{name}'
            },
            formatFunc: {
                type: [Function, Boolean],
                default: false
            },
            margin: {
                type: String,
                default: '3px 0.0521rem'
            },
            detailParam: {},
        },
        methods: {
            showSearch() {
                this.$refs[this.options.search].show();
            },
            showDetail() {
                this.$refs[this.options.detail].show();
            },
            selected(data) { // 联系组件完成
                this.fixValue(data.data);
                this.$refs[data.ref].hide();
            },
            fixValue(data) { // 整理显示的值 可接收函数(未)
                if (JSON.stringify(data) == '{}' || data.id == '') {
                    this.insideValue = "";
                    return;
                }
                if (this.formatFunc) {
                    this.insideValue = this.formatFunc(data);
                } else {
                    this.insideValue = this.format.replace(/{([a-zA-Z]+)}/g, (r, k) => data[k]);
                }
                this.$emit('input', data);
            },
            clear() { // 清空
                this.insideValue = "";
                this.$emit('input', "");
                this.$emit('clear');
            },
        },
        computed: {
            fixWidth() {
                return this.inTable ? `calc(100% - 0.1042rem)` : `calc(${8.33 * this.column}% - 0.1042rem)`;
            },
            fixMargin() {
                return this.inTable ? '0' : this.margin
            },
            fixInputTextAlign() {
                return this.inTable ? 'center' : 'left'
            },
            fixPlaceholder() {
                return this.disabled ? '--' : this.placeholder
            }
        },
        watch: {
            value: {
                handler(val) {
                    if (typeof val == 'object') {
                        this.fixValue(val);
                    } else {
                        this.insideValue = val
                    }
                },
                deep: true
            }
        },
        components: {
            serviceDialog,
            applicantSelect,
            equipArgsSelect,
            organUnits,
            equipLocationSelect,
            supplierSelect,
            equipArgDetail,
            consumableSelect
        },
        created() {
            if (typeof this.value == 'object') {
                this.fixValue(this.value);
            } else {
                this.insideValue = this.value
            }
        },
        mounted() {
            Object.keys(this.options).forEach(item => {
                this[item] = true
            })
            try {
                if (this.$refs.entityInput.parentNode.parentNode.nodeName === 'TD') {
                    this.inTable = true;
                }
            } catch (error) {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .entity-input-container {
        position: relative;
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 16px;
        // min-width: 298px;
        height: 40px;
        max-height: 40px;
        border-radius: 4px;
        box-sizing: border-box;
        margin: 0 0.0521rem;

        .iconwenbenkuangshanchu {
            display: inline-block;
        }

        .label {
            min-width: 55px;
            padding: 0 0 0 10px;
            color: #909399;
            overflow: hidden;
            flex-shrink: 0;
        }

        .required {
            color: red;
        }

        .input {
            width: auto;
            padding: 0 5px 0 10px;
            flex-grow: 1;
            height: 100%;
            font-size: 16px;
            outline-style: none;
            border-radius: 4px;
            border: 0px;
            background-color: transparent;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #707070;
        }

        input::-webkit-input-placeholder {
            color: #C0C4CC;
        }

        .icon {
            text-align: right;
            flex-grow: 1;
            min-width: 32px;
            padding: 0 3px 0 0;
            position: absolute;
            right: 0;
        }
    }

    .border {
        border: 1px solid #DCDFE6;
    }

    .error {
        border: 1px solid red;
    }

    .table-error {
        .input {
            color: red;
        }
    }

    .disabled {
        background: rgba(248, 249, 251, 1);
        border: 1px solid #DCDFE6;

        .input {
            color: rgba(192, 196, 204, 1);
        }
    }
</style>