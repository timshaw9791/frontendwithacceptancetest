<template>
    <service-dialog ref="copyRfid" width="400px" title="复制RFID" confirmInfo="写 入" @confirm="writeRFID"
                    @firstCancel="cancel"
                    :secondary="false">
        <define-input label="RFID" v-model=rfid :disabled="true"></define-input>
    </service-dialog>
</template>

<script>
    import serviceDialog from './base/serviceDialog/index'
    import {startOne} from "../common/js/rfidReader";

    export default {
        name: "copyRfid",
        components: {
            serviceDialog
        },
        props: {
            rfid: {
                type: String,
                default: ''
            },
            isShow: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            writeRFID() {
                startOne("java -jar writing.jar ", (data) => {
                    data = this._.trim(data,'\n')
                    data = data.split("\n")
                    console.log(data)
                    if (data.length === 2) {
                        JSON.parse(data[1]).status === 'succeed' ? this.$message.success('写入成功') : this.$message.error('写入失败')
                    } else if (data.length === 1) {
                        JSON.parse(data[0]).status === 'succeed' ? this.$message.success('读写器连接成功') : this.$message.error('读写器连接失败')
                    }
                }, this.rfid)
            },
            cancel() {
                this.$emit('cancel')
                this.isShow = false
                this.rfid = ''
                console.log(this)
                this.$refs.copyRfid.hide()
            },
        },
        watch: {
            'isShow': {
                handler(newData) {
                    console.log(newData);
                    if (!!newData) this.$refs.copyRfid.show()
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>