<template>
    <el-input :type="type" v-model="copyVal"
              :suffix-icon="suffix"
              :placeholder="placeholder"
              :readonly="cReadonly" :disabled="cDisabled"
              :autofocus="cAutofocus"
              @change="change" @blur="blur" @focus="focus"
    ></el-input>
</template>

<script>
    import {initmixinBosInput} from '../common/mixinBosInput';

    var likerHandler = {
        strip: function (value) {
            var str = (value ? value.toString() : "");
            str = str.startsWith("%") ? str.substr(1) : str;
            str = str.endsWith("%") ? str.substr(0, str.length - 1) : str;
            return str;
        },
        wrap: function (value) {
            var str = (value ? value.toString() : "");
            str = (str.startsWith("%") ? str : ("%" + str));
            str = (str.endsWith("%") ? str : (str + "%"));
            if (str === "%") {
                str = "%%";
            }
            return str;
        }
    };

    export default {
        mixins: [initmixinBosInput],

        data() {
            return {

                defaultHandler: {
                    strip: function (value) {
                        return this.wrapforlike ? likerHandler.strip(value) : value;
                    },
                    wrap: function (value) {
                        return this.wrapforlike ? likerHandler.wrap(value) : value;
                    }
                }
            };
        },
        props: {
            autofocus: {
                type: [Boolean, String],
                default: false
            },
            placeholder: {
                type: String,
                default: ''
            },
            readonly: {
                type: [Boolean, String],
                default: false
            },
            disabled: {
                type: [Boolean, String],
                default: false
            },
            rows: {
                type: [Number, String],
                default: 2
            },
            type: {
                type: String,
                default: 'text'
            },
            suffix: {
                type: String,
            },
            //对于字符串，我们需要要一些这样的处理，比如说like前后加上%等。
            wrapforlike: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            cAutofocus() {
                return this.transformBoolean(this.autofocus);
            },
            cDisabled() {
                return this.transformBoolean(this.disabled);
            },
            cReadonly() {
                return this.transformBoolean(this.readonly, true);
            },
        }
    }
</script>


