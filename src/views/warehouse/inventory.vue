<template>
    <div class="inventory">
        <my-header :title="'盘点'" :searchFlag="false"></my-header>
        <div class="action-bar">
            <el-button type="text" class="in_button" @click="toInventory">
                <svg-icon icon-class="加"/>
                开始盘点
            </el-button>
        </div>
        <i_inventory :tableData="inventoryObj.inventoryData.inventoryItems" ref="inventoryComponent"
                     :overview="inventoryObj.inventoryData.inventory" :size="size" @handleSubmission="handleSubmission"
                     @newNote="getNote"></i_inventory>
        <i_dialog ref="inventory_dialog" :rfList="inventoryObj.rflist" :size="size" @submit="submit"></i_dialog>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import i_inventory from 'components/inventory/inventoryComponent'
    import i_dialog from 'components/inventory/inventoryDialog'
    // import inventoryData from './inventoryData'
    import {getToken} from "../../common/js/auth";
    import request from 'common/js/request'

    // import {handheld} from 'common/js/pda'
    //
    // const fs = window.require('fs');
    // const path = window.require('path');
    // const newFile_path = 'C:\\Users\\Administrator\\inventory.json';


    /*Melanie Dunne supernova*/
    export default {
        name: "inventory",
        components: {
            myHeader,
            i_inventory,
            i_dialog
        },
        data() {
            return {
                inventoryObj: {
                    rflist: [],
                    inventoryData: {
                        inventory: {},
                        inventoryItems: []
                    },
                    getInventory: {},
                },
                size: '',
            }
        },
        created() {

        },
        methods: {
            toInventory() {
                this.inventoryObj.rflist = [];
                handheld().then(data => {
                    this.getInventoryRf(JSON.parse(data));
                });
                // this.getInventoryRf();
                // this.getInventoryRfCopy();
                //todo 记得合并前换回来
                this.$refs['inventory_dialog'].show();
            },
            getNote(data) {
                if (Object.keys(this.inventoryObj.inventoryData.inventory).length != 0) {
                    this.inventoryObj.inventoryData.inventory.note = data
                } else {
                    this.$message.warning('请先进行盘点')
                }
            },
            handleSubmission(data) {
                if (data) {
                    if (Object.keys(this.inventoryObj.inventoryData.inventory).length != 0) {
                        let url = 'http://10.128.4.152:8080/warehouse/inventories';
                        let data = this.inventoryObj.inventoryData;
                        request({
                            method: 'post',
                            url: url,
                            data: data
                        }).then((res) => {
                            this.$message.success('操作成功');
                            this.$refs.inventoryComponent.remark = '';
                            this.inventoryObj = {
                                rflist: [],
                                inventoryData: {
                                    inventory: {},
                                    inventoryItems: []
                                },
                                getInventory: {},
                            };
                            this.size = ''
                        }).catch(err => {
                            this.$message.error(err);
                        });
                    }
                }
            },
            submit(data) {
                let url = 'http://10.128.4.152:8080/warehouse/inventories/calculate';
                let rfidC = [];
                this.inventoryObj.rflist.forEach(item => {
                    rfidC.push(item.rfId);
                });
                let rfid = this.getString(rfidC);
                if (data) {
                    /* request({
                         url:url,
                         method:'get',
                     })*/
                    request({
                        method: 'post',
                        url: url,
                        params: {rfidList: rfid}
                    }).then((res) => {
                        /*res.inventoryItems.forEach((item,index)=>{
                            let num = index+1;
                            if(num<10){
                                num='0'+num;
                            }
                           item.number=num
                        });*/
                        /*this.overview.outCount=res.inventory.outCount;
                        this.overview.withoutRfidCount=res.inventory.withoutRfidCount;
                        this.overview.startTime=this.inventory.inventoryData.startTime;
                         this.overview.endTime=this.inventory.inventoryData.endTime;
                         this.overview.name=JSON.parse(localStorage.getItem('user')).name;
                         this.overview.size=this.inventory.inventoryData.size*/
                        this.inventoryObj.inventoryData = res;
                        this.inventoryObj.inventoryData.inventory.outCount = res.inventory.outCount;
                        this.inventoryObj.inventoryData.inventory.withoutRfidCount = res.inventory.withoutRfidCount;
                        this.inventoryObj.inventoryData.inventory.startTime = this.inventoryObj.getInventory.startTime;
                        this.inventoryObj.inventoryData.inventory.endTime = this.inventoryObj.getInventory.endTime;
                        this.inventoryObj.inventoryData.inventory.adminName = JSON.parse(localStorage.getItem('user')).name;
                        this.inventoryObj.inventoryData.inventory.adminId = JSON.parse(localStorage.getItem('user')).id;
                        this.inventoryObj.inventoryData.inventory.rfidCount=res.inventory.rfidCount;
                        this.deleteFile();
                    }).catch(err => {
                        this.$message.error(err);
                    });
                }
            },
            deleteFile() {
                fs.unlink(newFile_path, function (error) {
                    if (error) {
                        return false;
                    }
                })

            },
            getString(data) {
                let str = '';
                data.forEach(item => {
                    str = str + ',' + item
                });
                return str.substring(1, str.length);
            },
            getInventoryRf(data) {
                this.inventoryObj.getInventory = data;
                this.size = String(data.size);
                data.rfid.forEach((item, index) => {
                    this.inventoryObj.rflist.push({
                        rfId: item
                    })
                });
                // this.inventory.endTime=data.endTime;
                // this.inventory.startTime=data.startTime;
                // this.inventory.size=data.size;
            },
            // getInventoryRfCopy(){
            //     this.inventoryObj.rflist=[];
            //     this.inventoryObj.getInventory=inventoryData;
            //     this.size=String(inventoryData.size);
            //     inventoryData.rfid.forEach((item,index)=>{
            //         this.inventoryObj.rflist.push({
            //             rfId:item
            //         })
            //     });
            //
            // }
        }
    }
</script>

<style scoped>
    .inventory {
        width: 100%;
    }

    .inventory .action-bar {
        height: 58px;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        border-top: 1px solid rgba(112, 112, 112, 0.13);
        padding-left: 18px;
    }

    .action-bar .in_button {
        color: #2F2F76;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
