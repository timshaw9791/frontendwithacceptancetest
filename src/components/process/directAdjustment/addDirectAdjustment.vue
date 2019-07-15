<template>
    <div>
        <a_dialog :width="1040" ref="dialog" :title="'调拨申请'">
            <div class="addDirectAdjustment">
                <div class="addDirectAdjustment-label">
                    <div class="label">
                        <span v-text="'所在机构：'"></span>
                        <div class="default-span"><span v-text="unit.name"></span></div>
                    </div>
                    <div class="label">
                        <span v-text="'所在库房：'"></span>
                        <div class="default-span"><span v-text="house.name"></span></div>
                    </div>
                    <div class="label">
                        <span v-text="'指定库房：'"></span>
                        <el-input class="input" v-model="inHouseName"></el-input>
                    </div>
                </div>
                <div class="addDirectAdjustment-table">
                    <form-container ref="form" :model="form" style="width: 100%">
                            <el-table :data="form.orderItems" height="490">
                                <el-table-column label="序号" align="center">
                                    <template scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="装备型号" align="center">
                                    <template scope="scope">
                                        <field-input-query size="small" v-model="scope.row.model"
                                                           :inputList="restaurants"
                                                           @select="getEquipName(scope,$event)"></field-input-query>
                                    </template>
                                </el-table-column>

                                <el-table-column label="装备名称" align="center">
                                    <template scope="scope">
                                        {{scope.row.name}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="装备数量" align="center">
                                    <template scope="scope">
                                       <el-input v-model="scope.row.count" size="small" @input="changeCount(scope,$event)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="120">
                                    <template scope="scope">
                                        <el-button type="danger" @click="delqaq(scope)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                    </form-container>
                    <div class="addDirectAdjustment-bottom">
                        <el-button class="cancel" @click="cancel">取消</el-button><el-button style="margin-left: 34px" class="submit" @click="submit">提交</el-button>
                    </div>
                </div>
            </div>
        </a_dialog>
    </div>
</template>

<script>
    function debounce(fun, delay) {
        return function (args) {
            let that = this;
            let _args = args;
            clearTimeout(fun.id);
            fun.id = setTimeout(function () {
                fun.call(that, _args)
            }, delay)
        }
    }
    import a_dialog from 'components/surroundings/surroundingDialog'
    export default {
        name: "addDirectAdjustment",
        components:{
            a_dialog
        },
        props:{
            status:{
                type:Boolean
            },
            restaurants:{
                type:Array
            },
            unit:{
                type:Object
            },
            house:{
                type:Object
            }
        },
        data(){
            return{
                form:{},
                inHouseName:'',
                lastTime:'',
                nowTime:0,
                nowRow:{},
                nowCount:''
            }
        },
        created(){

        },
        watch:{
            'status':{
                handler(newVal){
                    if(newVal){
                        this.form = {};
                        this.form['orderItems'] = [{model: ''}];
                        this.$refs.dialog.show();
                    }
                }
            },
            'inHouseName':{
                handler(newVal){
                    this.$emit('getInHouse',newVal)
                }
            },
            'nowCount':{
                handler(newVal){
                    this.throttle(this.addRow,1000)
                }
            }
        },
        methods:{
            submit(){
                let transferOrder={};
                transferOrder.applicant=JSON.parse(localStorage.getItem('user')).name;
                transferOrder.inHouseName=this.inHouseName;
                transferOrder.outHouseName=this.house.name;
                transferOrder.orderItems = this.form.orderItems;
                this.$emit('submit',transferOrder)

            },
            addRow(){
                if (this.nowRow.$index === this.form.orderItems.length - 1) {
                    this.form.orderItems.push({model: ''});
                }
            },
            delqaq(data){
                if (this.form.orderItems.length > 1) {
                    this.form.orderItems.splice(data.$index, 1);
                } else {
                    this.$message.error('不能删除最后一个');
                }
            },
            close(){
                this.$refs.dialog.close();
            },
            cancel(){
            },
            getEquipName(row, data) {
               this.form.orderItems[row.$index].name = data.key.name;
            },
            changeCount(row,event){
                this.nowRow=row;
                this.nowCount=event
            },
            throttle(method,context){
                clearTimeout(method.tId);
                method.tId = setTimeout(function(){
                    method.call(context)
                },1000)
            }
        }
    }
</script>

<style  scoped>
    .addDirectAdjustment {
        height: 697px;
        padding:33px;
    }
    .addDirectAdjustment-bottom{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 21px;
    }
    .addDirectAdjustment-bottom .cancel{
        width:70px;
        height:30px;
        background:rgba(255,255,255,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        border-radius:6px;
        line-height: 0px;
    }
    .addDirectAdjustment-bottom .submit{
        width:70px;
        height:30px;
        background:rgba(47,47,118,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        border-radius:6px;
        color: white;
        line-height: 0px;
    }
    .addDirectAdjustment-table{
        width:974px;
        height:492px;
        margin-top: 30px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(112,112,112,1);
        opacity:1;
    }
    .addDirectAdjustment-label{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
    }
    .addDirectAdjustment-label .label{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }
    .label .default-span{
        width:217px;
        height:100%;
        background:rgba(235,235,235,1);
        opacity:1;
        display: flex;
        font-size: 16px;
        padding-left: 9px;
        color: #cccccc;
        align-items: center;
    }
    .label .input{
        width:217px;
        line-height:30px;
        background:rgba(255,255,255,1);
        opacity:1;
        font-size: 16px;
    }
</style>