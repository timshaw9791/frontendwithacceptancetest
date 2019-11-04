<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <span class="_card-title">{{$route.meta.title}}</span>
      </div>
      <div>
        <tabs :list="tabsList" :indexDefault="0" @selected="selected">
          <el-button type="text" class="_textBt" @click="maintenanceShow" v-if="show">
            <svg-icon icon-class="批量" />批量保养
          </el-button>
          <el-button type="text" class="_textBt" @click="batchstorage" v-else>
            <svg-icon icon-class="批量" />{{this.batch?"取消":"批量"}}入库
          </el-button>
          <div class="_buttons">
            <BosInput
              v-if="type==='需要保养'"
              placeholder="rfid/装备/序号/编号"
              suffix="el-icon-search"
              v-model="inquire"
              :wrapforlike="false"
              style=" width:285px;"
            ></BosInput>
          </div>
        </tabs>
        <div v-if="show">
          <el-table :data="list" fit highlight-current-row>
            <bos-table-column lable="RFID" field="equip.rfid"></bos-table-column>
            <bos-table-column lable="装备名称" field="equip.name"></bos-table-column>
            <bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>
            <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>
            <bos-table-column 
              lable="架体AB面" 
              :filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"
            ></bos-table-column>
            <bos-table-column lable="保养周期/天" :filter="(row)=>milliToDay(row.upkeepCycle)"></bos-table-column>
            <bos-table-column lable="上次保养时间" :filter="(row)=>$filterTime(row.lastUpkeepTime)"></bos-table-column>
            <bos-table-column
              lable="保养倒计时"
              :filter="(row)=>countdown(row.lastUpkeepTime,row.upkeepCycle)"
            ></bos-table-column>
          </el-table>

          <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage" v-if="this.list!=''" />

          <serviceDialog title="确认保养装备清单" ref="maintenanceDialog" @cancel="quit" @confirm="submit" width="5.4167rem">
              <el-table :data="maintenance.list" height="500" fit class="list maintenance-list-box">
                <el-table-column label="序号" width="60" align="center">
                  <template scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <bos-table-column lable="RFID" field="equip.rfid"></bos-table-column>
                <bos-table-column lable="装备名称" field="equip.name"></bos-table-column>
                <bos-table-column lable="装备序号" field="equip.serial"></bos-table-column>
                <bos-table-column lable="架体编号" field="equip.location.number"></bos-table-column>
                <bos-table-column
                  lable="架体AB面"
                  :filter="(row)=>surface(row.equip.location?row.equip.location.surface:'暂无')"
                ></bos-table-column>
                <el-table-column label width="60" align="center">
                  <template scope="scope">
                    <img
                      :src="haveImg"
                      title="点击取消保养该装备"
                      width="16px"
                      height="13px"
                      @click="cancelMaintenance(scope.row)"
                      v-show="scope.row.rfidConfirm == 1"
                      style="cursor: pointer"
                    />
                    <img
                      :src="noneImg"
                      width="3px"
                      height="17px"
                      v-show="scope.row.rfidConfirm == 0"
                    />
                  </template>
                </el-table-column>
              </el-table>
            <div class="bottom-tip">
              “<img :src="haveImg" width="16px" height="13px" /> ”为确定保养装备，
              “ <img :src="noneImg" width="3px" height="15px" /> ”为取消保养装备
            </div>
          </serviceDialog>

          <serviceDialog title="提示" ref="dialogButton" :secondary="false" @confirm="dialogConfim">
            <div class="_dialogDiv">您确定要取消保养该装备吗？</div>
          </serviceDialog>
        </div>

        <right :batch="batch" @cancel="cancel"  @tobatch="change" v-if="!show"></right>
       
      </div>
    </el-card>
  </div>
</template>

<script>
import tabs from "components/base/tabs/index";

import right from "./rightMaintenance";

import { formRulesMixin } from "field/common/mixinAxios";
import serviceDialog from "components/base/serviceDialog";
import api from "gql/operation.gql";
import { transformMixin } from "common/js/transformMixin";
import { getNeedUpkeep } from "api/needs";
var _ = require("lodash");
import { start, killProcess } from "common/js/rfidReader"

//const exec = window.require('child_process').exec;
//const spawn = window.require('child_process').spawn;
// import {killProcess} from "common/js/kill";

export default {
  data() {
    return {
      tabsList: ["需要保养", "正在保养"],
      type: "",
      inquire: "",
      batch: false, // 是否显示多选框(正在保养)
      show: true,
      title: "",
      equipList: [], // 保存确认保养的装备id
      param: {
        property: "lastUpkeepTime",
        direction: "ASC"
      },
      list: [], // 界面装备数据
      haveImg: require("@/assets/have.png"),
      noneImg: require("@/assets/none.png"),
      rfidList: [], // 扫描时，记录rfid
      process: {
        pid: "",
        index: 0 // 用以判断是否是第一条数据  {"status":"succeed"}
      },
      maintenance: {
        list: [],
        cancelZb: {} // 取消保养的装备
      } // 批量保养列表
    };
  },
  mixins: [formRulesMixin, transformMixin],

  methods: {
    batchstorage(){
    this.batch=!this.batch
    },
    selected(data) {
      console.log("触发到我了")
      console.log(data);
      this.type = data;
      if (data === "需要保养") {
        this.show = true;
          if (this.$route.query['name']) {
                        this.inquire = this.$route.query.name;
                    } else {
                        this.getList();
                    }
        // this.getList();
      } else if (data === "正在保养") {
        this.show = false;
      }
      this.batch = false;
    },

    cancel(data) {
      this.batch = data;

    },

    async getList() {
      this.list = await this.getAxiosList1(getNeedUpkeep);
    },
    /* 显示具体的保养列表 */
    maintenanceShow() {
      this.maintenance.list = this.list.map(item => {
        // -1为初始 无显示， 1为勾， 0为感叹号
        this.$set(item, "rfidConfirm", -1); // 对返回对象进行响应式属性添加
        return item;
      });
      this.$refs.maintenanceDialog.show();

      start("java -jar scan.jar", (data) => {
        data = data.replace(/[\r\n]/g, "") // 扫描值带有 "%0A" 后缀
        let noHave = true;
          this.maintenance.list.forEach(item => {
            if (item.equip.rfid == data) {
              item.rfidConfirm = 1;
              noHave = false
              this.equipList.push(item.equip.id);
              this.$message({
                message: "装备扫描成功！",
                type: "success"
              });
            }
          });
          if(noHave) {
            this.$message.error("该装备不属于装备保养清单！")
          }
      }, (fail) => {this.$message.error(fail)}, 
      (pid, err) => { pid?this.process.pid = pid: this.$message.error(err) })

      // const process = exec(`java -jar scan.jar 4`, { cwd: "C:\\Users\\10359" });

      // this.process.pid = process.pid;

      // process.stderr.on("data", err => {
      //   console.log(err);
      //   this.$message.error("设备故障请重新插拔!插入后请重新选择装备");
      //   killProcess();
      // });

      // process.stdout.on("data", (data) => {
      //   data = data.replace(/[\r\n]/g, "") // 扫描值带有 "%0A" 后缀
      //   let noHave = true;
      //   if (this.process.index == 1) {
      //     this.maintenance.list.forEach(item => {
      //       if (item.equip.rfid == data) {
      //         item.rfidConfirm = 1;
      //         noHave = false
      // this.equipList.push(item.equip.id);
      //         this.$message({
      //           message: "装备扫描成功！",
      //           type: "success"
      //         });
      //       }
      //     });
      //     if(noHave) {
      //       this.$message.error("该装备不属于装备保养清单！")
      //     }
      //   } else {
      //     let newData = JSON.parse(data);
      //     newData.status == "succeed"
      //       ? (this.process.index = 1)
      //       : (this.process.index = 0);
      //   }
      // });

      // process.on("exit", code => {
      //   if (this.index === 0) {
      //     this.$message.error("设备未插入或串口号错误,插入后请重新选择装备!");
      //   }
      //   console.log(`子进程退出，退出码 ${code}`);
      // });
    },
    /* 点击保养列表勾 */
    cancelMaintenance(item) {
      this.maintenance.cancelZb = item;
      this.$refs.dialogButton.show();
    },
    /* 放弃本次操作 */
    quit() {
      this.equipList = [];
      //spawn("taskkill", ["/PID", this.process.pid, "/T", "/F"]);
      killProcess(this.process.pid)

    },
    /* 确认取消保养该装备 */
    dialogConfim() {
      this.maintenance.cancelZb.rfidConfirm = 0;
      _.remove(this.equipList, item => {
        return item == this.maintenance.cancelZb.equip.id;
      });
      this.$refs.dialogButton.hide();
    },
    change(){
  
    this.batch=!this.batch
    },
    /* 确认保养 */
    submit() {
      if (0 in this.equipList) {
        this.gqlMutate(
          api.admin_upkeepEquips,
          {
            equipIdList: this.equipList
          },
          res => {
            this.$refs.maintenanceDialog.hide();
            this.$message.success("正在保养了!");
            //this.cancel(true);
            this.getList();
            this.equipList = [];
          }
        );
      } else {
        this.$message.error("未选择装备!");
      }
    },
    single(row) {
      this.$refs.dialogButton.show();
      this.equipList.push(row.equip.id);
    }
  },

  // mounted() {
  //   if (this.$route.query) {
  //     this.inquire = this.$route.query.name;
  //   }
  //   this.getList();
  // },

  watch: {
    inquire(newVal) {
      if (newVal) {
        this.$set(this.param, "search", newVal);
      }
       else {
                    this.$set(this.param, 'search', null);
                }
    }
  },

  components: {
    tabs,
    right,
    serviceDialog
  },
  beforeDestroy() {
            killProcess(this.process.pid)
        }
};
</script>

<style lang="scss" scoped>
.el-card {
  border: none !important;
  font-size: 16px;
}
.maintenance-list-box {
  border:1px solid rgba(112,112,112,1);
  border-radius: 5px;
}
.bottom-tip {
  margin-top: 0.0521rem;
  font-size: 0.0833rem;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 0.1042rem;
  color: rgba(112, 112, 112, 1);
}
</style>

<style>
::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: rgba(47, 47, 118, 0.27);
  border-radius: 22px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #fff;
}
</style>