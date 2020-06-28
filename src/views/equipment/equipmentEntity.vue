<template>
    <view-container>
        <tool-bar>
            <base-button label="位置变更" type="text" slot="button" v-if="!isEdit"
                         @click="toAllocation"></base-button>
        </tool-bar>
            <define-table :data="list" height="928px"  :pageInfo="this.paginator"
                          :highLightCurrent="true"
                          @changePage="changePage" :haveIndex="false" v-if="inList">
                <define-column label="序号" fixed columnType="index" width="65"></define-column>
                <define-column label="操作" width="180" v-slot="{ data }" fixed>
                    <i class=" iconfont iconbianji" @click="edit(data.row)" style="margin:8px"></i>
                    <i class=" iconfont iconlishi" @click="show(data.row.id)" style="margin:8px"></i>
                    <i class=" iconfont iconfuzhiRFID" @click="copyRfid(data.row.rfid)" style="margin:8px"></i>
                </define-column>
                <define-column label="图片" width="120" v-slot="{ data }" fixed>
                    <el-popover
                            placement="right"
                            title=""
                            trigger="hover"
                            transition="fade-in-linear"

                            >
                        <img class="img" slot="reference" :src="imgsrc(data.row.equipArg.image)" :onerror="noImgUrl" style="height:30px;width:30px;"/>
                        <img class="img"  :src="imgsrc(data.row.equipArg.image)" :onerror="noImgUrl" style="height:100px;width:100px;"/>
                    </el-popover>
                </define-column>
                <define-column label="RFID" fixed width="200" v-slot="{ data }">
                    <define-input v-model="data.row.rfid" type="Number" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备序号" field="serial" width="100" fixed/>
                <define-column label="装备名称" width="200" field="equipArg.name" fixed/>
                <define-column label="装备型号" field="equipArg.model" fixed/>
                <define-column label="质保期(天)" :filter="(row)=>milliToDay(row.equipArg.shelfLife)"/>
                <define-column label="充电周期(天)" :filter="(row)=>milliToDay(row.equipArg.chargeCycle)"/>
                <define-column label="保养周期(天)" :filter="(row)=>milliToDay(row.equipArg.upkeepCycle)"/>
                <define-column label="供应商" field="equipArg.supplier.name" width="200"/>
                <define-column label="联系人" width="100" field="equipArg.supplier.person"/>
                <define-column label="联系方式" width="150" field="equipArg.supplier.phone"/>
                <define-column label="生产日期" width="200" :filter="(row)=>$filterTime(row.productDate)"/>
                <define-column label="装备位置" width="300" v-slot="{data}">
                    <entity-input v-model="data.row" :formatFunc="$formatFuncOrderLoc"
                                  :tableEdit="false"></entity-input>
                </define-column>
                <define-column label="单价" field="price"/>
            </define-table>
<!--            <equipment-edit v-if="isEdit" @cancel="cancel" :editList="editList"></equipment-edit>-->
            <copy-rfid :rfid="rfid" :isShow="isShowDialog" @cancel="copyCancel"></copy-rfid>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import entityInput from '@/componentized/entity/entityInput'
    import imgUp from 'components/base/axiosImgUp';
    import equipAllocation from './equipAllocation'
    import {baseURL} from 'api/config'
    import equipmentEdit from './equipmentEdit'
    import serviceDialog from 'components/base/serviceDialog/index'
    import {equipsAll} from 'api/storage'
    import CopyRfid from "../../components/copyRfid";

    export default {
        components: {
            CopyRfid,
            myHeader,
            entityInput,
            serviceDialog,
            imgUp,
            equipAllocation,
            equipmentEdit
        },
        data() {
            return {
                rfid: '',
                isShowDialog:false,
                list: [],
                newLocation: '',
                editList: {},
                search: '',
                inAllocation: false,
                copyList: '',
                isEdit: false,
                inList: true,
                params: {size: 10, page: 1},
                paginator: {size: 10, page: 1, totalPages: 1, totalElements: 5},
                noImgUrl: 'this.src="' + require('../../assets/noImg.png') + '"'
            }
        },
        methods: {
            getList() {
                this.params.page = this.paginator.page
                this.params.size = this.paginator.size
                equipsAll(this.params).then(res => {
                    this.list = res.content;
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                }).catch(err => {
                    this.$message.error(err.response.data.message)
                })
            },
            show(data) {
                this.$router.push({name: 'equiphistoryOrder', query: {id: data}})
            },
            changePage(page) {
                this.paginator.page = page
                this.getList()
            },
            edit(data) {
                this.copyList = data
                data.equipArg.shelfLife = this.milliToDay(data.equipArg.shelfLife)
                this.$router.push({name:'equipedit',query:{data:JSON.parse(JSON.stringify(data))}})
                // this.editList = JSON.parse(JSON.stringify(data))
                this.isEdit = true
                this.inList = false
            },
            imgsrc(data) {
                return baseURL + '/images/' + data
            },
            black() {
                this.isEdit = this.isEdit ? !this.isEdit : this.isEdit
                this.inAllocation = this.inAllocation ? !this.inAllocation : this.inAllocation
                this.inList = true
            },
            cancel() {
                this.isEdit = this.isEdit ? !this.isEdit : this.isEdit
                this.inAllocation = this.inAllocation ? !this.inAllocation : this.inAllocation
                this.inList = true
                this.getList()
            },
            confirm() {
                if (this.isEdit) {
                    this.$refs.historyDialog.hide()
                } else {
                    this.editList.location = this.newLocation
                    this.isEdit = !this.isEdit
                }
            },
            current(data) {
                this.newLocation = data.name
            },
            toAllocation() {
                this.$router.push({name: 'equipAllocation',query:{title:'装备实体/位置变更'}})
            },
            milliToDay(data) {
                let date = JSON.parse(JSON.stringify(data));
                let day = Math.round(date / 24 / 60 / 60 / 1000);
                if (day < 1) {
                    return day = '--';
                } else {
                    return day
                }
            },
            copyRfid(data) {
                this.rfid = data
                this.isShowDialog = true
            },
            copyCancel(){
                this.isShowDialog = false
            }
        },
        created() {
            this.getList();
        }
    }
</script>
<style lang="scss" scoped>

</style>