<template>
  <div class="entity-input-container" ref="entityInput" :style="'width:'+fixWidth"
              @mouseover="changeEditState(true)"
              @mouseout="changeEditState(false)">
    <div :class="{'entity-input':true,'entity-input-border':tableEdit&&edit}">
      <el-input :placeholder="placeholder"
                :disabled="disabled"
                v-model="insideValue"
                readonly>
          <div slot="prepend" :class="{'prefix': true, 'disabled': disabled}" v-if="!inTable">
            {{ label }}
            <span class="required" v-if="required">*</span>
          </div>
            <i slot="suffix" class="iconfont iconwenbenkuangshanchu" @click="clear" v-show="insideValue&&!disabled&&tableEdit&&edit"></i>
            <i slot="suffix" class="iconfont iconsousuo" @click="showSearch" v-show="search&&!disabled&&tableEdit&&edit"></i>
            <i slot="suffix" class="iconfont iconxiang" @click="showDetail" v-show="detail&&!disabled&&tableEdit&&edit"></i>
      </el-input>
    </div>
    <service-dialog title="申请人员选择" ref="applicant" :button="false" :secondary="false">
      <applicant-select @select="selected"></applicant-select>
    </service-dialog>
    <service-dialog title="装备参数选择" ref="equipParam" width="1300px" :button="false" :secondary="false">
      <equip-params @select="selected"></equip-params>
    </service-dialog>
  </div>
</template>

<script>
import serviceDialog from "components/base/serviceDialog"
import applicantSelect from "./applicantSelect"
import equipParams from './equipParams'
export default {
    name: 'textInput',
    data() {
      return {
          inputPrePt: null,
          insideValue: "",
          inTable: false, // 是否为表格内联
          edit: true, // 内部是否可编辑
          search: false, // 是否显示搜索图标
          detail: false, // 是否显示详情图标
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
            default: 5
        },
        height: {
            type: Number,
            default: 40
        },
        disabled: {
            type: Boolean,
            default: false
        },
        tableEdit: { // 是否为表格编辑状态
          type: Boolean,
          default: true
        },
        required: { // 是否必填
            type: Boolean,
            default: false
        },
        placeholder: {
            type: [Number, String],
            default: ""
        },
        options: {
          type: Object,
          default() {
            return {
              search: 'applicant',
            }
          }
        },
        format: {
          type: String,
          default: '[{policeSign}{name}]'
        }
    },
    methods: {
        changePreStyle(state=true) {
            this.inputPrePt.style.background = state?'#f5f7fa':'white';
            this.inputPrePt.style.cursor = state?'not-allowed':'auto';
        },
        showSearch() {
          this.$refs[this.options.search].show();
        },
        showDetail() {
          this.$refs.equipParam.show();
        },
        selected(data) { // 联系组件完成
          this.fixValue(data.data)
          this.$refs[data.ref].hide();
        },
        fixValue(data) { // 整理显示的值 可接收函数(未)
          if(JSON.stringify(data) == '{}' || data.id == '') {
            this.insideValue = "";
            return;
          }
          this.insideValue = this.format.replace(/{([a-zA-Z]+)}/g, (r, k) => data[k]);
          this.$emit('input', data);
        },
        clear() { // 清空
          this.insideValue = "";
          this.$emit('input', "");
        },
        changeEditState(state) {
          if(!this.inTable) return;
          this.edit = state
        }
    },
    computed: {
      fixWidth() {
        return this.inTable?`calc(100% - 0.1042rem)`:`calc(${8.33*this.column}% - 0.1042rem)`;
      }  
    },
    watch: {
        disabled: {
            handler(val) {
                this.changePreStyle(val);
            },
        },
        value: {
          handler(val) {
            if(typeof this.value == 'object') {
              this.fixValue(this.value);
            } else {
              this.insideValue = this.value
            }
          },
          deep: true
        }
    },
    components: {
      serviceDialog,
      applicantSelect,
      equipParams
    },
    created() {
      if(typeof this.value == 'object') {
        this.fixValue(this.value);
      } else {
        this.insideValue = this.value
      }
    },
    mounted() {
        this.inputPrePt = document.querySelector('.el-input-group__prepend');
        Object.keys(this.options).forEach(item => {
          this[item] = true
        })
        try {
          if(this.$refs.entityInput.parentNode.parentNode.nodeName == 'TD') {
            this.inTable = true;
            this.edit = false;
          }
        } catch (error) {
          
        }
    }
}
</script>

<style lang="scss" scoped> 
    /deep/ .el-input {
        font-size: 16px;
        .el-input-group__prepend {
            // background-color: white;
            // padding: 9px 0 9px 10px;
            padding: 0;
            border: none;
            line-height: 20px;
        }
        .el-input__inner {
            border: none;
            height: 38px !important;
        }
        /* error类要放在这里，因为el-input为组件，其样式不在该层(scoped封住了) */
        .error {
            border-color: red;
        }
    }
    .entity-input-container {
      margin: 0 0.0521rem;
      display: inline-block;
		  box-sizing: border-box;
    }
    .entity-input {
        border-radius:4px;
        font-size: 16px;
    }
    .entity-input:hover {
        border-color: #409EFF;
    }
    .entity-input-border {
      border: 1px solid #DCDFE6;
    }

    .required {
      position: absolute;
        font-size: 16px;
        color: red;
    }
    .error {
        border-color: red;
    }
    .prefix {
        width: auto;
        height: 37px;
        line-height: 37px !important;
        padding-left: 10px;
        background-color: white;
    }
    .prefix:hover {
        border-color: #409EFF;
    }
    .disabled {
        background-color: #f5f7fa !important;
    }

    .iconfont {
      line-height: 40px;
      margin-right: 5px;
    }
</style>