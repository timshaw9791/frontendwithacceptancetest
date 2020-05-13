const listMixin = {
    methods: {
        fetchData() {},
    },
    created() {
        this.fetchData();
    }
};
const listTableMixin = {
    data() {
        return {
            paginator: {size: 10, page: 1, totalElements: 0, totalPages: 1},
        }
    },
    methods: {
        fetchData() {},
        changePage(page) {
            this.paginator.page = page;
            this.fetchData();
        }
    },
    created() {
        this.fetchData();
    }
}

const bosMixin = {
    data() {
        return {
            fetchParams: {
				pageInfo: {
					page: 1,
					size: 10,
					totalPages: 1
				},
			}
        }
    },
    methods: {
        fetchData() {},
        changePage(page) {
            this.fetchParams.pageInfo.page = page;
            this.fetchData();
        }
    },
    created() {
        this.fetchData()
    }
}

export { listMixin, listTableMixin, bosMixin }