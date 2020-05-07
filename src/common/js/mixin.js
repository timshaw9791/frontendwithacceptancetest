import {getHistoryPage, setHistoryPage, removeHistoryPage} from 'common/js/auth';

export const historyPageMixin = {
  data() {
    return {
      param: {
        namelike: '%%'
      },
      oldName: '',
      oldPage: '',
      savePage: null
    }
  },
  created() {
    this.oldData = JSON.parse(JSON.stringify(this.param));
    this.$router.beforeEach((to, from, next) => {
      if (to.matched[0].name === from.matched[0].name) {
        this.savePage = true;
        next();
      } else {
        this.savePage = false;
        next();
      }
    })

  },
  destroyed() {
    if (!this.savePage) {
      removeHistoryPage();
    } else {

    }
  },
  methods: {
    changePage(page) {
      this.param.paginator.page = page;
      // this.saveHistoryPage(page);
    },
    getHistoryPage() {
      return getHistoryPage();
    },
    saveHistoryPage(page) {
      setHistoryPage(page);
    },
    // refetch() {
    //   // if (this.$apollo.queries['list']) this.$apollo.queries['list'].refetch();
    // },
    callback(message) {
      this.$message.success(message);
      this.refetch();
    },
    formatTime(time) {
      if (time == null) return;
      return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
    },
  }
};
