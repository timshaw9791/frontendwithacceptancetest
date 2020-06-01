<template>
  <div class="amount-container">
    <my-header title="装备金额统计" :haveBlack="false"></my-header>
    <div class="amount-body">
      <div class="amount-body-left">
        <div class="amount-body-left-top">
          <define-input label="小类" v-model="search"></define-input>
        </div>
        <div class="amount-body-left-body">
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
      <div class="amount-body-right">
        <div class="amount-body-right-title">
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
            v-if="show!='All'"
          ></define-input>
        </div>
        <div class="amount-body-right-top">
          <span v-text="`当前库存：${addNum(1)}`" ></span>
          <span v-text="`可用数量：${addNum(2)}`" class="title_box" v-if="title!='单警柜装备'"></span>
          <span v-text="`领用数量：${addNum(3)}`" class="title_box" v-if="title!='单警柜装备'"></span>
          <span v-text="`当前库存总价(￥)：${addNum(4)}`" class="title_box"></span>
        </div>
        <div class="amount-body-right-body">
          <define-table
            :pageInfo="paginator"
            @changePage="changePage"
            :data="equipArg"
            height="3.75rem"
            ref="table"
            v-if="show!='singlePolice'&&show!='singlePoliceCategory'"
          >
            <define-column label="装备大类" field="genre" v-if="show=='All'" />
            <define-column label="装备小类" field="category" v-if="show=='genres'" />
            <define-column
              label="装备参数"
              :filter="(row)=>`${row.name}(${row.model})`"
              v-if="show=='category'"
              key='equipArgs'
            />
            <define-column label="当前库存" key="totalCount" field="totalCount"></define-column>
            <define-column label="当前库存总价(￥)" key="totalPrice" field="totalPrice"></define-column>
            <define-column label="可用数量" key="inHouseCount" field="inHouseCount"></define-column>
            <define-column label="领用数量" key="receiveUseCount" field="receiveUseCount"></define-column>
            <define-column label="供应商" field="supplier" key="supplier" v-if="show=='category'"></define-column>
          </define-table>
          <define-table
            :pageInfo="paginator"
            @changePage="changePage"
            :data="equipArg"
            height="3.75srem"
            ref="table"
            v-if="show=='singlePolice'||show=='singlePoliceCategory'"
          >
            <define-column label="装备小类" field="cabinet" key="cabniet" v-if="show=='singlePolice'" />
            <define-column
              label="装备参数"
              key="singlePoliceCategoryEquips"
              :filter="(row)=>`${row.name}(${row.model})`"
              v-if="show=='singlePoliceCategory'"
            />
            <define-column label="当前库存" key="cabnietTotalCount" field="totalCount"></define-column>
            <define-column label="当前库存总价(￥)" key="cabniettotalPrice" field="totalPrice"></define-column>
            <define-column label="可用数量" key="cabnietinHouseCount" :filter="(row)=>{return (title=='单警柜装备'||row.inHouseCount===null)?'--':row.inHouseCount}"></define-column>
            <define-column label="领用数量" key="cabnietreceiveUseCount" :filter="(row)=>{return (title=='单警柜装备'||row.receiveUseCount===null)?'--':row.receiveUseCount}"></define-column>
            <define-column label="供应商" field="supplier" key="cabnietsupplier" v-if="show=='singlePoliceCategory'"></define-column>
          </define-table>
        </div>
        <div></div>
      </div>
    </div>
  </div>
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
import { findEquipMoneyStatistics } from "api/report";
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
          findEquipMoneyStatistics({
            categories: 3,
            level: "ALL",
            search: ""
          }).then(res => {
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
          ? v + k.totalCount
          : item == 2
          ? v + k.inHouseCount
          : item == 3
          ? v + k.receiveUseCount
          : item==4
          ?v + k.totalPrice
          :v + k.cabinetStock;
      }, 0);
    },
    addPolice() {
      allPoliceStatistic().then(res => {
        let tabList = {
          commStock: res.reduce((v, k) => v + k.cabinetStock, 0),
          totalCount: res.reduce((v, k) => v + k.totalCount, 0),
          inHouseCount: res.reduce((v, k) => v + k.inHouseCount, 0),
          genre: "单警装备",
          receiveUseCount: res.reduce((v, k) => v + k.receiveUseCount, 0),
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
      this.detailSearch=''
      this.$nextTick(() => {
        this.$refs.table.refreshLayout();
      });
      this.show = data.data.show;
      this.title = data.data.name;
      this.id = data.data.id;
      if (this.show == "genres") {
        findEquipMoneyStatistics({
          categories: 3,
          id: data.data.id,
          level: "GENRE",
          search: this.detailSearch
        }).then(res => {
          this.equipArg = res;
          //   this.paginator.totalPages = res.totalPages;
          //   this.paginator.totalElements = res.totalElements;
        });
      } else if (this.show == "All") {
        findEquipMoneyStatistics({
          categories: 3,
          level: "ALL",
          search: this.detailSearch
        }).then(res => {
          this.equipArg = res;
          //   this.paginator.totalPages = res.totalPages;
          //   this.paginator.totalElements = res.totalElements;
          if (!this.check) {
            this.addPolice();
          }
        });
      } else if (this.show == "category") {
        findEquipMoneyStatistics({
          categories: 3,
          id: data.data.id,
          level: "CATEGORY",
          search: this.detailSearch
        }).then(res => {
          this.equipArg = res;
          this.equipArg.forEach(item => {
            item.equipArgs = `${item.name}(${item.model})`;
          });
          //   this.paginator.totalPages = res.totalPages;
          //   this.paginator.totalElements = res.totalElements;
        });
      } else if (this.show == "singlePolice") {
        allPoliceStatistic().then(res => {
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
        allPoliceStatisticCategories(data.data.id).then(res => {
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
          findEquipMoneyStatistics({
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
          console.log(allPoliceStatisticCategories);
          allPoliceStatisticCategories(this.id, newval).then(res => {
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
.amount-container {
  font-size: 16px;
  height: 900px;
  //   border: 1px solid black;
}
.amount-body {
  height: 870px;
  margin-top: 5px;
  //   border: 1px solid black;
  .amount-body-left {
    width: 2rem;
    height: 840px;
    float: left;
    border: 1px solid rgba(236, 236, 236, 1);
    .amount-body-left-top {
      width: 1.99rem;
      margin-top:5px;
      height: 50px;
      //   border: 1px solid blue;
    }
    .amount-body-left-body {
      overflow-y: auto;
      width: 1.99rem;
      height: 780px;
      //   border: 1px solid blue;
    }
  }
  .amount-body-right {
    width: 6rem;
    height:  840px;
    float: left;
    margin-left: 30px;
    border: 1px solid rgba(236, 236, 236, 1);
    .amount-body-right-top {
      background: rgba(249, 249, 249, 1);
      width: 5.99rem;
      height: 20px;
      //   border: 1px solid blue;
      .title_box {
        margin-left: 25px;
      }
    }
    .amount-body-right-title {
      background: rgba(249, 249, 249, 1);
      width: 5.99rem;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      //   border: 1px solid blue;
    }
    .amount-body-right-body {
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
   background:rgba(178,178,204,1);
   border-radius: 20px;
  }
}
</style>