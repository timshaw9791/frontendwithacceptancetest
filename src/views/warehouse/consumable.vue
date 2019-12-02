<template>
    <div class="safety">
        <el-card shadow="never">
            <div slot="header" data-test="title_box">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <div class="secondaryTitle">
                    <el-button type="text" class="in_button" @click="dialogShow('add')" data-test="button">
                        <svg-icon icon-class="加"/>
                        新增耗材
                    </el-button>
                    <el-button type="text" class="in_button" @click="dialogShow('supplement')" data-test="button">
                        <svg-icon icon-class="补充"/>
                        补充耗材
                    </el-button>
                    <el-button type="text" class="in_button" @click="dialogShow('receive')" data-test="button">
                        <svg-icon icon-class="领取"/>
                        领取耗材
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                placeholder="名称"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style="width:285px;">
                        </BosInput>
                    </div>
                </div>

                <el-table :data="list" v-loading.body="false" element-loading-text="Loading"
                        fit height="3.52rem" data-test="main_tabel">
                    <bos-table-column lable="耗材名称" field="name"></bos-table-column>
                    <bos-table-column lable="耗材数量" field="count"></bos-table-column>
                    <bos-table-column lable="耗材用途" field="describes"></bos-table-column>
                </el-table>
                <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <serviceDialog :title="title" ref="dialog" @confirm="submit" :secondary="false" :data-test="title">
            <form-container ref="form" :list="list">
                <field-select :list="ConsumableList" v-if="disabled" label="耗材名称" v-model="name" width="10"></field-select>
                <field-input v-else label="耗材名称" v-model="name" width="10"></field-input>
                <field-input label="耗材数量" v-model="count" width="10"></field-input>
                <field-input label="耗材用途" v-model="describes" :disabled="disabled" :type="'textarea'" width="10"></field-input>
                <field-input label="备注" v-model="remark" v-show="show" :type="'textarea'" width="10"></field-input>
            </form-container>
            
        </serviceDialog>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinTableRest';
    import serviceDialog from 'components/base/serviceDialog'
    import {getConsumableList,addConsumable,updateConsumable,receiveConsumable } from 'api/consumable'


    export default {
        data() {
            return {
                title: '',
                inquire: '',
                list: [],
                alllist: [],
                name:'',
                count:'',
                describes:'',
                name:'',
                remark:'',
                ConsumableList:[],
                paginator: {size: 9, page: 1, totalPages: 5, totalElements: 5},
                disabled:false,
                show:false,
                from:{},
            }
        },
        components: {
            serviceDialog
        },
        mixins: [formRulesMixin],
        methods: {
            getConsumableList() {
                console.log("111")
                let params = {page: this.paginator.page, size: this.paginator.size, search: this.inquire};
                getConsumableList(params).then(res => {
                    let result = JSON.parse(JSON.stringify(res));
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                    this.list = res.content
                })
            },
            changePage(data) {
                this.paginator.page = data;
                this.getConsumableList()
            },
            submit() {
                if(this.title == "新增耗材"){
                    if(this.name == '' || this.describes==''||this.count==''){
                        this.$message.error("请填写完整！")
                    }else{
                        this.from.name = this.name
                        this.from.describes = this.describes
                        this.from.count = this.count
                        let param = JSON.parse(JSON.stringify(this.from))
                        addConsumable(param).then((res)=>{
                            this.$message.success('操作成功')
                            this.$refs.dialog.hide();
                            this.getConsumableList()
                        }).catch(err=>{
                            this.$message.error(err.response.data.message)
                        });
                    }
                    
                }else if(this.title == "补充耗材"){
                    if(this.name == '' || this.count==''){
                        this.$message.error("请填写完整！")
                    }else{
                        this.from.name = this.name
                        this.from.describes = this.describes
                        this.from.count = this.count
                        let param = JSON.parse(JSON.stringify(this.from))
                        updateConsumable(param).then((res)=>{
                            this.$message.success('操作成功')
                            this.$refs.dialog.hide();
                            this.getConsumableList()
                        }).catch(err=>{
                            this.$message.error(err.response.data.message)
                        });
                    }
                }else if(this.title == "领取耗材"){
                    if(this.name == '' || this.count==''){
                        this.$message.error("请填写完整！")
                    }else{
                        this.from.name = this.name
                        this.from.describes = this.remark
                        this.from.count = this.count
                        let data = JSON.parse(JSON.stringify(this.from))
                        receiveConsumable(data).then((res)=>{
                            this.$message.success('操作成功')
                            this.$refs.dialog.hide();
                            this.getConsumableList()
                        }).catch(err=>{
                            this.$message.error(err.response.data.message)
                        });
                    }
                }
            },
            getallList(){
                getConsumableList().then(res => {
                    this.alllist = res.content
                    this.ConsumableList = []
                    for(let i in this.alllist){
                        this.ConsumableList.push(this.alllist[i].name)
                    }
                    console.log(this.ConsumableList)
                })
            },
            dialogShow(data) {
                console.log(data);
                if(data=="add"){
                    this.disabled = false
                    this.show = false
                    this.title = "新增耗材"
                }else if(data=="supplement"){
                    this.title = "补充耗材"
                    this.show = false
                    this.disabled = true
                    this.getallList()
                }else if(data=="receive"){
                    this.title = "领取耗材"
                    this.disabled = true
                    this.show = true
                    this.getallList()
                }
                // 显示弹框时清空数据
                this.name = ''
                this.count = ''
                this.describes = ''
                this.remark = ''
                this.$refs.dialog.show();
            }
        },
        mounted() {
            this.getConsumableList()
        },
        watch: {
            inquire(newVal, oldVal) {
                this.getConsumableList()
            },
            name(){
                if(this.disabled){
                    for(let i in this.alllist){
                        if(this.name == this.alllist[i].name){
                            this.describes = this.alllist[i].describes
                            this.from.id = this.alllist[i].id
                        }
                    }
                }

            }
        }

    }
</script>

<style lang="scss" scoped>
    .safety {
        font-size: 0.0833rem;
    }
    .secondaryTitle {
        position: relative;
        border-bottom: 1px solid #EBEEF5;
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        height: 0.2292rem;
    }

    .el-card {
        border: none !important;
    }
</style>