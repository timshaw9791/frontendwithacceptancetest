<template>
  <div class="entity-input-container">
    <div class="entity-input" :style="'width:'+fixWidth+';height:'+height+'px'">
      <el-input :placeholder="placeholder"
                :disabled="disabled"
                v-model="insideValue"
                readonly>
          <div slot="prepend" :class="{'prefix': true, 'disabled': disabled}">{{ label }}</div>
          <span slot="prepend" class="required" v-if="required">*</span>
          <i slot="suffix" class="iconfont iconwenbenkuangshanchu clear" @click="clear" v-show="insideValue"></i>
          <i slot="suffix" class="iconfont iconsousuo" @click="showConnect"></i>
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
      }
    },
    props: {
        label: {
            type: String,
            default: "标题"
        },
        value: {
            type: [String, Number, Object],
            default: ""
        },
        width: {
            type: [Number, String],
            default: 288
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
            default: "请输入内容"
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
        selected(data) {
          this.fixValue(data)
          this.$refs.applicant.hide();
        },
        fixValue(data) {
          if(data == {}) return;
          if(data.id == '') return;
          this.insideValue = `[${data.policeSign}]${data.name}`;
          this.$emit('input', data)
        },
        clear() {
          this.insideValue = "";
          this.$emit('input', "");
        }
    },
    computed: {
      fixWidth() {
          if(isNaN(this.width)) {
              return this.width;
          } else {
              return this.width + 'px';
          }
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
    .entity-input {
        border: 1px solid #DCDFE6;
        border-radius:4px;
        font-size: 16px;
    }
    .entity-input:hover {
        border-color: #409EFF;
    }
    .required {
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
      cursor: pointer;
    }
    .clear {
      color: red;
      margin-right: 5px;
    }
</style>