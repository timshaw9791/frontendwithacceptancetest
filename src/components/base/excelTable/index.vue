<template>
  <div class="excel-table-box">
    <table border="1" id="table" ref="excelTable">
      <tr>
        <th :colspan="colspan">{{ tableHeader.bigTitle }}</th>
      </tr>
      <tr>
        <td :colspan="colspan">{{ tableHeader.smallTitle }}</td>
      </tr>
      <tr v-if="tableHeader.info">
        <td :colspan="colspan">{{ tableHeader.info}}</td>
      </tr>
      <tr>
        <td v-for="(item, i) in tableHeader.lableList" :key="i + 'header'">{{ item.lable }}</td>
      </tr>
      <tr v-for="(item, i) in list" :key="i">
        <td v-for="n in colspan">{{ item[tableHeader.lableList[n-1].field] }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  name: "exceltable",
  data() {
    return {}
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    tableHeader: {
      type: Object,
      default() {
        return {
          bigTitle: "",
          smallTitle: "",
          info: "",
          lableList: []
        }
      }
    },
    tableType: {
      type: String,
      default: 'gold'
    },
    fileName: {
      type: String,
      default: "sheet"
    }
  },
  computed: {
    colspan() {
      return this.tableHeader.lableList.length
    }
  },
  methods: {
    exportExcel() {
      console.log('exportExcel',this.fileName);
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(this.$refs.excelTable);
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          `${this.fileName}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
};
</script>


<style lang="scss">
</style>