<template>
  <div class="entity-input-container" ref="entityInput" :style="'width:'+fixWidth">
    <div class="entity-input">
      <el-input :placeholder="placeholder"
                :disabled="disabled"
                v-model="insideValue"
                readonly>
          <div slot="prepend" :class="{'prefix': true, 'disabled': disabled}" v-if="!inTable">
            {{ label }}
            <span class="required" v-if="required">*</span>
          </div>
            <i slot="suffix" class="iconfont iconwenbenkuangshanchu" @click="clear" v-show="insideValue&&!disabled&&!tableEdit"></i>
            <i slot="suffix" class="iconfont iconsousuo" @click="showConnect" v-show="!disabled&&!tableEdit"></i>
            <i slot="suffix" class="iconfont iconxiang" v-show="!disabled&&!tableEdit"></i>
      </el-input>
    </div>
    <service-dialog title="申请人员选择" ref="applicant" :button="false">
      <applicant-select @select="selected"></applicant-select>
    </service-dialog>
  </div>
</template>

<script>
import serviceDialog from "components/base/serviceDialog"
import applicantSelect from "./applicantSelect"
export default {
    name: 'textInput',
    data() {
      return {
          inputPrePt: null,
          insideValue: "",
          inTable: false, // 是否为表格内联
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
          default: false
        },
        required: { // 是否必填
            type: Boolean,
            default: false
        },
        placeholder: {
            type: [Number, String],
            default: ""
        },
        fixData: {
          type: Array,
          default() {
            return ['policeSign', 'name']
          }
        }
    },
    methods: {
        changePreStyle(state=true) {
            this.inputPrePt.style.background = state?'#f5f7fa':'white';
            this.inputPrePt.style.cursor = state?'not-allowed':'auto';
        },
        showConnect() {
          this.$refs.applicant.show();
        },
        selected(data) { // 联系组件完成
          this.fixValue(data)
          this.$refs.applicant.hide();
        },
        fixValue(data) { // 整理显示的值 可接收函数(未)
          if(data == {}) return;
          if(data.id == '') return;
          this.insideValue = `[${data.policeSign}]${data.name}`;
          this.$emit('input', data)
        },
        clear() { // 清空
          this.insideValue = "";
          this.$emit('input', "");
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
        }
    },
    components: {
      serviceDialog,
      applicantSelect
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
        // console.log(this.$refs.a.parentNode.parentNode.nodeName);
        try {
          if(this.$refs.entityInput.parentNode.parentNode.nodeName == 'TD') {
            this.inTable = true;
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
        border: 1px solid #DCDFE6;
        border-radius:4px;
        font-size: 16px;
    }
    .entity-input:hover {
        border-color: #409EFF;
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