<template>
  <view-container>
  <div class="frequency-container">
    <div class="frequency-body">
      <div class="frequency-body-left">
        <div class="frequency-body-left-top">
          <define-input label="小类" v-model="search"></define-input>
        </div>
        <div class="frequency-body-left-body">
          <define-tree
            @clickNode="clickNode"
            :search="search"
            :expandAll="false"
            :accordion="true"
            :data="tree.treeData"
            :options="options"
            @nodeClick="clickNode"
          ></define-tree>
        </div>
      </div>
      <div class="frequency-body-right">
        <div class="frequency-body-right-title">
          <div>
            <span
              v-text="`${show=='All'?'全部大类':show=='genres'||show=='singlePolice'?'装备大类：':show=='category'||show=='singlePoliceCategory'?'装备小类：':''}`"
            ></span>
            <span v-text="show!='All'?title:''"></span>
          </div>
          <div style="display:inline-block">
            <checkbox label="只统计公共库房" v-model="check" v-if="show=='All'"></checkbox>
          </div>

          <define-input
            :label="show=='genres'||show=='singlePolice'?'小类':'装备参数/供应商'"
            v-model="detailSearch"
            v-if="show!='All'&&show!='singlePolice'"
          ></define-input>
        </div>
        <div class="frequency-body-right-top">
          <span
            v-text="`历史库存：${addNum(1)}`"
            key="singleHistory"
            v-if="show!='singlePolice'&&show!='singlePoliceCategory'"
          ></span>
          <span
            v-text="`历史库存：${addNum(5)}`"
            key="commonHistory"
            v-if="show=='singlePolice'||show=='singlePoliceCategory'"
          ></span>
          <span v-text="`当前库存：${addNum(2)}`" key="nowKunCun" class="title_box"></span>
          <span v-text="`当前库存总价(￥)：${addNum(3)}`" key="nowKunCunPrice" class="title_box"></span>
          <span v-text="`使用次数：${addNum(4)}`" key="nowKuncunPIngci" class="title_box"></span>
        </div>
        <div class="frequency-body-right-body">
          <define-table
            :pageInfo="paginator"
            @changePage="changePage"
            :data="equipArg"
            height="3.75rem"
            ref="table"
            v-if="show!='singlePolice'&&show!='singlePoliceCategory'"
          >
            <define-column label="装备大类" field="genre" key="genre" v-if="show=='All'" />
            <define-column label="装备小类" field="category" key="category" v-if="show=='genres'" />
            <define-column
              label="装备参数"
              key="commonEquip"
              :filter="(row)=>`${row.category}(${row.model})`"
              v-if="show=='category'"
            />
            <define-column label="历史库存" key="commonStock" field="commonStock"></define-column>
            <define-column label="当前库存" key="totalCount" field="totalCount"></define-column>
            <define-column label="当前库存总价(￥)" key="totalPrice" field="totalPrice"></define-column>
            <define-column label="使用次数" key="count" field="count"></define-column>
            <define-column label="供应商" key="supplier" field="supplier" v-if="show=='category'"></define-column>
          </define-table>
          <define-table
            :pageInfo="paginator"
            @changePage="changePage"
            :data="equipArg"
            height="3.75srem"
            ref="table"
            v-if="show=='singlePolice'||show=='singlePoliceCategory'"
          >
            <define-column label="装备小类" field="cabinet" key="cabinet" v-if="show=='singlePolice'" />
            <define-column
              label="装备参数"
              :filter="(row)=>`${row.name}(${row.model})`"
              v-if="show=='singlePoliceCategory'"
              key="equipArgs"
            />
            <define-column label="历史库存"  key="cabinetStock" field="cabinetStock"></define-column>
            <define-column label="当前库存" key="cabnietTotalCount" field="totalCount"></define-column>
            <define-column label="当前库存总价(￥)" key="total" field="totalPrice"></define-column>
            <define-column label="使用次数" key="cabinetCount" field="count"></define-column>
            <define-column label="供应商" key="cabnietsupplier" field="supplier" v-if="show=='singlePoliceCategory'"></define-column>
          </define-table>
        </div>
        <div></div>
      </div>
    </div>
  </div>
  </view-container>
</template>

<script>
import myHeader from "components/base/header/header";
import baseButton from "@/componentized/buttonBox/baseButton";
import entityInput from "@/componentized/entity/entityInput";
import defineInput from "@/componentized/textBox/defineInput";
import bosTabs from "@/componentized/table/bosTabs";
import serviceDialog from "components/base/serviceDialog";
import defineTree from "@/componentized/defineTree";
import { equipmentAmount } from "api/statistics";
import { findEquipFrequencyStatistics } from "api/report";
import {
  allPoliceFrequency,
  allPoliceFrequencyCategories
} from "api/warehouse";
import {
  allPoliceStatistic,
  allPoliceStatisticCategories
} from "api/warehouse";
import { getgenresList, getcategories, getequipArg } from "api/safety";
export default {
  data() {
    return {
      tree: {
        treeData: [{ name: "全部", show: "All", children: [] }],
        genres: [],
        categories: []
      },
      search: "",
      show: "All",
      title: "",
      detailSearch: "",
      options: {
        label: "name",
        children: "children"
      },
      id: "",
      check: "",
      equipArg: []
    };
  },
  methods: {
    fetchData() {
      getgenresList()
        .then(res => {
          this.tree.genres = res.content;
          return this.buildTree();
        })
        .then(res => {
          for (let elem of this.tree.genres.values()) {
            this.tree.treeData.push(elem);
          }
          this.tree.treeData.push({
            name: "单警装备",
            show: "singlePolice",
            children: [
              { name: "公共柜装备", id: 1, show: "singlePoliceCategory" },
              { name: "备用柜装备", id: 2, show: "singlePoliceCategory" },
              { name: "单警柜装备", id: 0, show: "singlePoliceCategory" }
            ]
          });
          findEquipFrequencyStatistics({
            categories: 3,
            level: "ALL",
            search: ""
          }).then(res => {
            res.forEach(item => {
              item.commonStock = item.commonStock + item.totalCount;
            });
            this.equipArg = res;
            // this.paginator.totalPages = res.totalPages;
            // this.paginator.totalElements = res.totalElements;
            this.addPolice();
          });
        });
    },
    addNum(item) {
      return this.equipArg.reduce((v, k) => {
        return item == 1
          ? v + k.commonStock
          : item == 2
          ? v + k.totalCount
          : item == 3
          ? v + k.totalPrice
          : item == 4
          ? v + k.count
          : v + k.cabinetStock;
      }, 0);
    },
    addPolice() {
      allPoliceFrequency().then(res => {
        let tabList = {
          commonStock: res.reduce(
            (v, k) => v + k.cabinetStock + k.totalCount,
            0
          ),
          totalCount: res.reduce((v, k) => v + k.totalCount, 0),
          genre: "单警装备",
          count: res.reduce((v, k) => v + k.count, 0),
          totalPrice: res.reduce((v, k) => v + k.totalPrice, 0)
        };
        this.equipArg.push(tabList);
      });
    },
    async buildTree() {
      for (let elem of this.tree.genres.values()) {
        elem.show = "genres";
        elem.children = [];
        await getcategories(elem.id).then(res => {
          let categories = res;
          categories.forEach(item => {
            item.show = "category";
            elem.children.push(item);
          });
        });
      }
    },
    changePage() {},
    clickNode(data) {
      this.$nextTick(() => {
        this.$refs.table.refreshLayout();
      });
      this.show = data.data.show;
      this.title = data.data.name;
      this.id = data.data.id;
      if (this.show == "genres") {
        findEquipFrequencyStatistics({
          categories: 3,
          id: data.data.id,
          level: "GENRE",
          search: this.detailSearch
        }).then(res => {
          res.forEach(item => {
            item.commonStock = item.commonStock + item.totalCount;
          });
          this.equipArg = res;
          //   this.paginator.totalPages = res.totalPages;
          //   this.paginator.totalElements = res.totalElements;
        });
      } else if (this.show == "All") {
        findEquipFrequencyStatistics({
          categories: 3,
          level: "ALL",
          search: this.detailSearch
        }).then(res => {
          res.forEach(item => {
            item.commonStock = item.commonStock + item.totalCount;
          });
          this.equipArg = res;
          //   this.paginator.totalPages = res.totalPages;
          //   this.paginator.totalElements = res.totalElements;
          if (!this.check) {
            this.addPolice();
          }
        });
      } else if (this.show == "category") {
        findEquipFrequencyStatistics({
          categories: 3,
          id: data.data.id,
          level: "CATEGORY",
          search: this.detailSearch
        }).then(res => {
          res.forEach(item => {
            item.commonStock = item.commonStock + item.totalCount;
          });
          this.equipArg = res;
          this.equipArg.forEach(item => {
            item.equipArgs = `${item.name}(${item.model})`;
          });
          //   this.paginator.totalPages = res.totalPages;
          //   this.paginator.totalElements = res.totalElements;
        });
      } else if (this.show == "singlePolice") {
        allPoliceFrequency().then(res => {
          res.forEach(item => {
            item.cabinetStock = item.cabinetStock + item.totalCount;
          });
          this.equipArg = res;
          this.equipArg.forEach(item => {
            if (item.cabinet == 0) item.cabinet = "单警柜装备";
            if (item.cabinet == 1) item.cabinet = "公共柜装备";
            if (item.cabinet == 2) item.cabinet = "备用柜装备";
          });
          //   this.paginator.totalPages = res.totalPages;
          //   this.paginator.totalElements = res.totalElements;
        });
      } else if (this.show == "singlePoliceCategory") {
        allPoliceFrequencyCategories(data.data.id).then(res => {
          res.forEach(item => {
            item.cabinetStock = item.cabinetStock + item.totalCount;
          });
          this.equipArg = res;
          //   this.paginator.totalPages = res.totalPages;
          //   this.paginator.totalElements = res.totalElements;
        });
      }
    }
  },
  watch: {
    check: {
      handler(newval) {
        if (newval) {
          this.equipArg.pop();
        } else {
          this.addPolice();
        }
      }
    },
    detailSearch: {
      handler(newval) {
        if (this.show == "category" || this.show == "genres") {
          let searchI = "";
          if (this.show == "genres") searchI = "GENRE";
          if (this.show == "category") searchI = "CATEGORY";
          findEquipFrequencyStatistics({
            categories: 3,
            id: this.id,
            level: searchI,
            search: newval
          }).then(res => {
            this.equipArg = res;
            this.equipArg.forEach(item => {
              item.equipArgs = `${item.name}(${item.model})`;
            });
            // this.paginator.totalPages = res.totalPages;
            // this.paginator.totalElements = res.totalElements;
          });
        } else if (this.show == "singlePoliceCategory") {
          allPoliceFrequencyCategories(this.id, newval).then(res => {
            this.equipArg = res;
            // this.paginator.totalPages = res.totalPages;
            // this.paginator.totalElements = res.totalElements;
          });
        }
      }
    }
  },
  components: {
    myHeader,
    baseButton,
    entityInput,
    bosTabs,
    defineInput,
    serviceDialog,
    defineTree
  },
  created() {
    this.fetchData();
  }
};
</script>
<style lang="scss" scoped>
.frequency-container {
  font-size: 16px;
  height: 900px;
  //   border: 1px solid black;
}
.frequency-body {
  height: 870px;
  margin-top: 5px;
  //   border: 1px solid black;
  .frequency-body-left {
    width: 2rem;
    height: 840px;
    float: left;
    border: 1px solid rgba(236, 236, 236, 1);
    .frequency-body-left-top {
      width: 1.99rem;
      margin-top: 5px;
      height: 50px;
      //   border: 1px solid blue;
    }
    .frequency-body-left-body {
      overflow-y: auto;
      width: 1.99rem;
      height: 780px;
      //   border: 1px solid blue;
    }
  }
  .frequency-body-right {
    width: 6rem;
    height: 840px;
    float: left;
    margin-left: 30px;
    border: 1px solid rgba(236, 236, 236, 1);
    .frequency-body-right-top {
      background: rgba(249, 249, 249, 1);
      width: 5.99rem;
      height: 20px;
      //   border: 1px solid blue;
      .title_box {
        margin-left: 25px;
      }
    }
    .frequency-body-right-title {
      background: rgba(249, 249, 249, 1);
      width: 5.99rem;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      //   border: 1px solid blue;
    }
    .frequency-body-right-body {
      width: 5.99rem;
      height: 770px;
      //   border: 1px solid palegoldenrod;
    }
  }
  ::-webkit-scrollbar {
    display: block;
    width: 6px;
    height: 10px;
  }
  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background: rgba(178, 178, 204, 1);
    border-radius: 20px;
  }
}
</style>