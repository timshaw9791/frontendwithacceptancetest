<template>
    <div class="equip-details-box">
        <div class="action-bar">
            <span v-text="title" style="font-size:16px;"></span>
            <div class="input-box">
                <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
                <input class="input" v-model="search" :placeholder="'装备名称'"/>
            </div>
        </div>
        <div class="equip-details-select" v-if="viewStatus.flag">
            <div class="select-category">
                <span v-text="'装备类型：'" style="font-size: 16px"></span>
                <el-select v-model="selectGener" placeholder="请选择" style="width: 217px" @change="toChange">
                    <el-option
                            v-for="item in genre"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    >
                    </el-option>
                </el-select>
            </div>
            <div class="select-type">
                <span v-text="'装备小类：'" style="font-size: 16px"></span>
                <el-select v-model="selectCategory" placeholder="-" size="medium" style="width: 217px"
                           @change="toChangeCategory">
                    <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="equip-details-date" v-if="viewStatus.dateFlag">
            <span v-text="'时间选择：'"></span>
            <!--<el-date-picker-->
            <!--v-model="date"-->
            <!--type="month"-->
            <!--placeholder="选择时间" style="width: 200px!important;" @change="changeDate">-->
            <!--</el-date-picker>-->
            <el-date-picker
                    v-model="date"
                    type="monthrange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    style="width: 600px!important;"
                    :picker-options="pickerOptions"
                    @change="changeDate"
            >
            </el-date-picker>
        </div>
        <div class="equip-details-list">
            <div :class="item.select?'equip-details-item select-item':'equip-details-item'" v-for="item in detailsList">
                <equip-progress :width="500" :detailItem="item" :status="title=='装备使用频次'?false:true"
                                 :havePrice="viewStatus.flag">
                    <span v-text="toolTip[0]+'：'+item.allCount" style="margin-top: 8px"></span>
                    <span v-text="toolTip[1]+'：'+item.number" style="margin-top: 8px"></span>
                    <span v-text="toolTip[2]+'：'+item.percentage+'%'" style="margin-top: 8px"
                          v-if="toolTip[2]!=undefined"></span>
                </equip-progress>
            </div>
        </div>
    </div>
</template>

<script>
    import equipProgress from './reportComponents/equipProgress'

    export default {
        name: "equipDetails",
        components: {
            equipProgress
        },
        props: {
            genre: {
                type: Array,
            },
            categoryList: {
                type: Array
            },
            title: {
                type: String
            },
            selectDefault: {
                type: String,
                default: ''
            },
            detailsList: {
                type: Array
            },
            toolTip: {
                type: Array
            }
        },
        data() {
            return {
                search: '',
                selectGener: '',
                selectCategory: '',
                viewStatus: {
                    flag: true,
                    dateFlag: false
                },
                date: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '本月',
                        onClick(picker) {
                            picker.$emit('pick', [new Date(), new Date()]);
                        }
                    }, {
                        text: '今年至今',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(new Date().getFullYear(), 0);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近六个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setMonth(start.getMonth() - 6);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        watch: {
            'search': {
                handler(newval) {
                    this.$emit('handleSearch', newval)
                }
            }
        },
        created() {
            this.init()
        },
        methods: {
            toChange(data) {
                this.selectCategory = '';
                this.$emit('changeGener', data);
            },
            toChangeCategory(data) {
                this.$emit('changeCategory', data);
            },
            changeDate(date) {
                let flag=false;
                let startTime,endTime;
                let nowDate = new Date();
                let nowMonth = nowDate.getMonth();
                let nowYear = nowDate.getFullYear();
                let isSameMoth = this.isSameMoth(date);
                let isThisMonth = this.isThisMonth(date,nowMonth,nowYear);
                let isExceed = this.isExceed(date,nowMonth,nowYear);
                if(isExceed){
                    if(isSameMoth){
                        startTime=this.getStartTime(date);
                        if(isThisMonth){
                            endTime=nowDate;
                            console.log('aaa',endTime);
                        }else {
                            endTime=this.getEndTime(date);
                        }
                    }else {
                        startTime=date[0];
                        if(isThisMonth){
                            endTime=nowDate;
                        }else {
                            let year = date[1].getFullYear();
                            let month= date[1].getMonth();
                           endTime=new Date(year,month+1,1,0);
                        }
                    }
                    flag=true;
                }else {
                    this.date=[];
                    this.$message.error('不可超出当前时间')
                }
                if(flag){
                    this.$emit('changeDate',{startTime:startTime,endTime:endTime})
                }
                //  let year = data.getFullYear();
                //  let month= data.getMonth();
                //  let flag = true
                //  let startTime,endTime;
                //  if(nowYear==year&&nowMonth==month){
                //      endTime = date;
                //  }else if(nowYear<year||nowMonth<month){
                //      this.$message.warning('不可超出当前时间');
                //      flag=false
                //  }else {
                //      endTime = new Date(year,month+1,1,0);
                //  }
                // if(flag){
                //     startTime = data;
                //     this.$emit('changeDate',{startTime:startTime,endTime:endTime})
                // }
            },
            getEndTime(date){
                let year = date[0].getFullYear();
                let month= date[0].getMonth();
                return new Date(year,month+1,1,0);
            },
            getStartTime(date){
                 let year = date[0].getFullYear();
                 let month= date[0].getMonth();
                 return new Date(year,month,1,0);
            },
            isThisMonth(date,nowMonth,nowYear){
                let year = date[1].getFullYear();
                let month = date[1].getMonth();
                if(nowMonth==month&&nowYear==year){
                    return true
                }else {
                    return false
                }
            },
            isSameMoth(date) {
                let date0 = date[0].getMonth();
                let date1 = date[1].getMonth();
                if (date0 == date1) {
                    return true
                } else {
                    return false
                }
            },
            isExceed(date,nowMonth,nowYear) {
                let year = date[1].getFullYear();
                let month = date[1].getMonth();
                 if(nowYear<year||(nowYear==year&&nowMonth<month)){
                    return false
                 }else {
                     return true
                 }
            },
            init() {
                if (this.title == '装备使用频次'||this.title == '装备损耗率'||this.title == '装备维修率') {
                    let date0 = new Date();
                    let date1 = new Date();
                    this.date = [date0,date1];
                    this.viewStatus.dateFlag = true
                }
                if (this.selectDefault != '') {
                    let item = this.genre.filter(item => item.name == this.selectDefault);
                    this.selectGener = item[0].name;
                    this.$emit('changeGener', item[0].id);
                }
                if (this.title == '库存统计') {
                } else {
                    this.viewStatus.flag = false
                }
            }
        }
    }
</script>

<style scoped>
    .equip-details-box {
        width: 100%;
    }

    .equip-details-box .equip-details-list {
        width: 90%;
        margin-top: 20px;
    }

    .equip-details-box .equip-details-date {
        display: flex;
        align-items: center;
        padding-left: 18px;
        padding-top: 17px;

        color: #707070;
    }

    .equip-details-list .equip-details-item {
        width: 70%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
    }

    .equip-details-list .select-item {
        background: rgba(59, 134, 255, 0.31);
    }

    .equip-details-box .action-bar {
        padding-right: 23px;
        margin-top: 8px;
        border-top: rgba(112, 112, 112, 0.13) solid 1px;
        border-bottom: rgba(112, 112, 112, 0.13) solid 1px;
        font-family: "PingFang SC";
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        padding-left: 18px;
        width: 100%;
        color: #707070;
    }

    .action-bar .input-box {
        width: 285px;
        position: relative;
    }

    .input-box .input {
        width: 100%;
        height: 38px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(112, 112, 112, 1);
        opacity: 1;
        border-radius: 19px;
        padding-left: 15px;
        outline: medium;
        color: #707070;
    }

    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #BBBBBB;
    }

    .input-box .icon-search {
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }

    .equip-details-box .equip-details-select {
        display: flex;
        padding-top: 17px;
        padding-right: 23px;
        padding-left: 17px;
        color: #707070;
    }

    .equip-details-select .select-type {
        margin-left: 18px;
    }
</style>