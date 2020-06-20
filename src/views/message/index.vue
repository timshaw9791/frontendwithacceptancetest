<template>
	<view-container :tabs="tabs">
		<bos-tabs :option="['contrast']" :contrastKey="['main', 'content']" :layoutRatio="['45%', '55%']" :header="false">
			<define-table :data="list" :pageInfo="fetchParams.pageInfo" @changePage="changePage" height="920px"
				:highLightCurrent="true" @changeCurrent="changeCurrent" slot="main" ref="leftTable">
				<define-column label="操作" field="opeare" width="60" v-slot="{ data }">
					<i class="iconfont iconxingbiaotianchong star" @click="messageStar(data.row,false)" v-if="data.row.newStar"></i>
					<i class="iconfont iconxingbiaoxianxing" @click="messageStar(data.row, true)" v-else></i>
				</define-column>
				<define-column label="消息状态" width="100" v-slot="{ data }">
					<span :class="['sign',{unread: !data.row.status}]">
						{{ data.row.status?'已读':'未读' }}
					</span>
				</define-column>
				<define-column label="通知时间" :filter="row => this.$filterTime(row.createTime)" width="200"></define-column>
				<define-column label="消息标题" :filter="row=>fixTitle(row.title)"></define-column>
			</define-table>
			<define-table :data="list[selectIndex]?list[selectIndex].messageItems:[]" :havePage="false" height="100%" slot="content">
				<define-column label="消息内容" field="content"></define-column>
			</define-table>
		</bos-tabs>
		<checkbox label="只显示星标" v-model="onlyShowStar" @change="fetchData(false, true)" :column="6" slot="button"></checkbox>
		<base-button label="刷新" type="text" @click="fetchData(true)" slot="button"></base-button>
		<base-button label="一键已读" type="text" @click="allMessageRead" slot="button"></base-button>
	</view-container>
</template>

<script>
import myHeader from 'components/base/header/header';
import { readMsg, markStar, allRead } from 'api/message'
import { bosMixin } from 'field/mixins/listMixin'
import { jsqlPage, bosEnums } from 'api/basic'
import bosTabs from '@/componentized/table/bosTabs'
export default {
	name: 'message',
	components: { myHeader, bosTabs },
	mixins: [bosMixin],
	data() {
		return {
			tabs: [{
				label: '',
				key: '',
				baseSearch: true,
				baseSearchName: '消息标题',
				baseSearchValue: ''
			}],
			list: [{messageItems:[]}],
			onlyShowStar: false,
			selectIndex: -1,
			enumerator: [], // 标题枚举对象
			fetchParams: {
				jpql: "select ms from Message ms where ms.userId = ?1 order by ms.createTime desc",
				returnType: "ARRAY",
				pageInfo: {
					direction: "DESC",
					page: 1,
					size: 10,
					totalPages: 1
				},
				params: [
					JSON.parse(localStorage.getItem('user')).id
				]
			},
			// showStarFetchParams: {
			// 	"jpql": "select ms from Message ms where ms.newStar = true and ms.userId = ?1",
			// 	"returnType": "ARRAY",
			// 	pageInfo: {
			// 		direction: "DESC",
			// 		page: 1,
			// 		size: 10,
			// 		totalPages: 1
			// 	},
			// 	params: [
			// 		JSON.parse(localStorage.getItem('user')).id
			// 	]
			// },
			userId: JSON.parse(localStorage.getItem('user')).id
		}
	},
	methods: {
		fetchData(tips=false, checkBox=false) {
			(tips || checkBox ) && (this.fetchParams.pageInfo.page = 1, this.selectIndex = -1);
			this.fetchParams.jpql = this.onlyShowStar?
				"select ms from Message ms where ms.newStar = true and ms.userId = ?1":
				"select ms from Message ms where ms.userId = ?1 order by ms.createTime desc";
			jsqlPage(this.fetchParams, tips).then(res => {
				this.list = this._.flatten(res.content);
				this.fetchParams.pageInfo.totalPages = res.totalPages;
			})
		},
		fetchEnumerator() {
			bosEnums({category: 'MessageTitleEnum'}).then(res => {
				this.enumerator = res;
			})
		},
		changeCurrent(data) {
			data.current && data.current.id && !data.current.status && readMsg({ids: [data.current.id]}).then(res => {
				data.current.status = true
				this.$message.success('标记已读');
			})
			this.selectIndex = data.index
		},
		fixTitle(value) {
			let tmp = this.enumerator.find(item => item.value == value)
			return tmp?tmp.chinese:''
		},
		messageStar(currentData, status) {
			markStar({id:currentData.id, status, userId: this.userId}, true).then(res => {
				currentData.newStar = status;
			})
		},
		allMessageRead() {
			allRead({userId: this.userId}, true).then(res => {
				this.list.forEach(item => item.status = true)
			})
		},
		changePage(page) {
			this.fetchParams.pageInfo.page = page;
			this.selectIndex = -1;
            this.fetchData();
        }
	},
	created() {
		this.fetchEnumerator();
	}
}
</script>

<style lang="scss" scoped>
	.sign {
		cursor: pointer;
		user-select: none;
	}
	.unread {
		color: red;
	}
	.star {
		color: #f8dc00;
	}
	.iconfont {
		font-size: 14px;
	}
</style>