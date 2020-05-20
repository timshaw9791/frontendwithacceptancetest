<template>
  <div class="app-wrapper" :class="classObj">
    <navbar></navbar>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <app-main></app-main>
    </div>
    <div class="information">
        <span>&copy; 2019 - 2020 警用装备智能管理系统</span>
        <span style="margin-left: 10px">技术支持：浙江华安安全设备有限公司</span>
        <span style="margin-left: 20px">服务热线:400-8265186</span>
      </div>
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
      <div class="main-bottom">
        &copy; 2019 - 2020 警用装备智能管理系统
        <span style="margin-left: 10px">技术支持：浙江华安安全设备有限公司</span>
      </div>
    </div> -->
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~common/css/mixin.scss";

.app-wrapper {
  // @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-size: 16px;
  .information {
      font-size: 12px;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  .main-container {
    
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
