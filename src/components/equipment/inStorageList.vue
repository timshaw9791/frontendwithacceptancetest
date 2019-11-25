<template>
    <div class="storage-list">
        <el-card shadow="never" :body-style="{ padding:'0'}">
            <div slot="header" class="header">
                <span class="_card-title">{{ title }}</span>
                <div class="black" @click="black">
                <svg-icon icon-class="返回" class="svg-info"></svg-icon>
                <span v-text="'返回'"></span>
              </div>
            </div>
            
            <div class="storage-list-body">
              <div class="list-info" v-if="title.includes('装备')">
                <div class="hardware">
                  <div class="label">硬件选择： </div>
                  <el-select v-model="hardware.selected" @change="selectHardware" size="small" style="width: 220px">
                    <el-option v-for="item in hardware.selectArr" 
                      :label="item.key" :key="item.val" :value="item.val">
                    </el-option>
                  </el-select>
                  <div class="read" v-show="hardware.selected == 'Handheld'">读取</div>
                </div>
                <div class="operator">
                  <div class="label">操作人员： </div>
                  <el-input v-model="hardware.operator" :disabled="true" style="width: 220px"></el-input></div>
              </div>
              <div class="list-info" v-else>
                <div class="list-number">{{ typeName }}单号： {{ equipList.orderNumber }}</div>
                <div class="operator">操作人员： {{ equipList.operator }}</div>
                <div class="time"> {{ typeName }}时间： {{ equipList.createTime }}</div>
              </div>
              <div v-if="!title.includes('装备')">装备统计：</div>
              <el-table :data="list" height="529px" style="border: 1px solid #ccc; margin-top: 10px">
                <bos-table-column lable="装备名称" field="name"></bos-table-column>
                <bos-table-column lable="装备型号" field="model"></bos-table-column>
                <bos-table-column lable="装备位置" :filter="(row) => $filterFrame(row.locationInfo)"></bos-table-column>
                <bos-table-column lable="装备数量" :filter="(row) => 1"></bos-table-column>
              </el-table>
            </div>
            <div class="storage-list-footer">
              <el-button type="primary" @click="submit" v-if="title.includes('装备')">提交</el-button>
            </div>
        </el-card> 
    </div>
</template>

<script>
import { outHouse } from "api/storage"

    export default {
        data() {
            return {
                equipList: [],
                typeName: '', // 显示什么类型(入库/出库)
                hardware: {
                  selectArr: [{
                    val: 'Handheld', 
                    key: '手持机'
                  }, {
                    val: 'cardReader', 
                    key: '读卡器'
                  }],
                  selected: '', // 所选用的硬件
                  operator: ""
                },
                list: [],
                rfidList: ["11111111", "1132"],
            }
        },

        props: {
            title: {
              type: String,
              default: "入库单详情"
            },
            listNumber: {
              type: [Number, String],
              default: 0
            },
            equipData: {
              type: Object,
              default() {
                return {}
              }
            }
        },
        methods: {

            //离开页面以后为父组件抛出black 杀死进程
            black() {
              this.$emit('black', true);
              //killProcess();
            },
            // 切换硬件后
            selectHardware(val) {
              console.log(val);
            },
            submit() {
              if(this.list.length == 0) {
                this.$message.error("未扫入装备")
                return
              }
              outHouse({rfids: this.rfidList}).then(res => {
                console.log(res);
                this.$message.success("出库成功")
                // 关闭硬件

                setTimeout(() => {
                  this.$emit('black')
                }, 3000)
              })
            }
        },

        created() {
          this.typeName = this.title.slice(0, 2)
          this.hardware.operator = JSON.parse(localStorage.getItem('user')).username
          if(!this.title.includes("出库装备")) {
            this.equipList = {
              orderNumber: this.equipData.orderNumber,
              operator: this.equipData.operatorInfo?this.equipData.operatorInfo.operator: '',
              createTime: this.$filterTime(this.equipData.createTime),
            }
            this.list = this.equipData.equipInOutHouseDetails
          }
        },
        mounted() {
          this.list.push({
            rfid: "00001",
            name: "防暴服（快穿式）",
            model: "FBF-J-HH02",
            locationInfo: ""
          })
        },


    }
</script>

<style lang="scss" scoped>


    .storage-list {
        /* 可调整 */
        font-size: 16px;
        color: #707070;
        font-family:PingFang SC;

      .storage-list-body {
        width: 5.0781rem;
        min-width: 950px;
        margin: 70px auto;

        .list-info {
          display: flex;
          justify-content: space-between;
          line-height: 32px;
          height: 32px;
          margin-bottom: 32px;
          
          .hardware,
          .operator {
            .label {
              display: block;
              float: left;
            }
            .read {
              width: 64px;
              height: 32px;
              color: white;
              text-align: center;
              line-height: 32px;
              margin-left: 12px;
              float: right;
              background-color: #2F2F76;
              border-radius:4px;
              cursor: pointer;
            }
          }
        }
      }
    }

    .storage-list-footer {
      margin-top: -10px;
      text-align: center;
    }

    .el-card:not(:nth-last-child(2)) {
        border-bottom: none !important;
    }

    .el-card:first-child {

        border-top: none !important;
    }

    .black {
        /* 可调整 */
        font-size: 20px;
        display: flex;
        align-items: center;
        float: right;
    }

    .black .svg-info {
        height: 20px;
        width: 20px;
        margin-right: 0.0521rem;
    }
</style>
