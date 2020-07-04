<template>
    <view-container>
        <tool-bar v-if="!edit">
            <base-button label="一键开柜" type="text" slot="button"></base-button>
        </tool-bar>
        <div class="data-list" v-if="!edit">
            <bos-tabs :option="['contrast']" :layoutRatio="[60,40]" :contrastKey="['slot1', 'slot2']" :header="false">
                <define-table
                        :data="listData"
                        slot="slot1"
                        @changeCurrent="selRow"
                        :highLightCurrent="true"
                >
                    <define-column label="操作" width="150" v-slot="{ data }">
                        <div class="span-box">
                            <i class=" iconfont iconfenpei" @click="toAssign(data.row)" style="margin:8px"></i>
                            <i class=" iconfont iconkaigui" @click="opCabinet(data.row)" style="margin:8px"></i>
                        </div>
                    </define-column>
                    <define-column label="警柜类型" v-slot="{ data }">
                        <define-input v-model="data.row.category" :tableEdit="false"></define-input>
                    </define-column>
                    <define-column label="警柜编号" width="100" v-slot="{ data }">
                        <define-input v-model="data.row.cabinetNumber" type="Number" :tableEdit="false"></define-input>
                    </define-column>
                    <define-column label="所属人员" width="150" v-slot="{ data }">
                        <define-input v-model="data.row.name" :tableEdit="false"></define-input>
                    </define-column>
                </define-table>
                <define-table
                        :haveIndex="false"
                        slot="slot2"
                        :havePage="false"
                        :data="equipArg">
                    <define-column label="RFID" v-slot="{data}">
                        <define-input v-model="data.row.rfid" :tableEdit="false"></define-input>
                    </define-column>
                    <define-column label="装备序号" width="200" v-slot="{data}">
                        <define-input v-model="data.row.serial" :tableEdit="false"></define-input>
                    </define-column>
                    <define-column label="装备参数" field="equipArg"
                                   :filter="(row)=>{return `${row.equipArg.name}(${row.equipArg.model})`}"></define-column>
                </define-table>
            </bos-tabs>
        </div>
        <div class="edit-equip" v-if="edit">
            <base-select label="警柜类型" :column="10" v-model="select.selected"
                         align="left" :selectList="select.selectList"></base-select>
            <entity-input
                    label="所属人员"
                    v-model="people"
                    :column="10"
                    :options="{search:'applicant'}"
                    margin="15px 0"
                    format="{name}"
                    :tableEdit="true"
                    v-if="select.selected==='0'"
            ></entity-input>
            <div class="btn-box">
                <base-button
                        label="取消"
                        align="right"
                        :width="128"
                        :height="25"
                        :fontSize="20"
                        @click="$router.back()"
                ></base-button>
                <base-button
                        label="提交"
                        align="right"
                        :width="128"
                        :height="25"
                        :fontSize="20"
                        @click="confirm"
                ></base-button>
            </div>
        </div>
    </view-container>
</template>

<script>
    import serviceDialog from "components/base/serviceDialog/index";
    import bosTabs from "@/componentized/table/bosTabs";
    import {getPoliceCabinets, assignPeople, cabinetEquip} from "api/warehouse";

    export default {
        components: {
            serviceDialog,
            bosTabs
        },
        data() {
            console.log(this.$store.getters.enums.HouseCategory)
            let selectList =  this.$store.getters.enums.HouseCategory
            return {
                equipArg: [],
                listData: [],
                select:{
                    selectList,
                    selected:''
                },
                params: {
                    pageInfo: {
                        direction: "ASC",
                        page: 1
                    },
                    returnType: "ARRAY",
                        jpql:
                        "select e  from Equip e  left join PoliceCabinet pc on e.policeCabinet.id = pc.id where e.policeCabinet.id != null",
                    params: []
                },
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
                edit: false,
                people: "",
                policeCabnietId: ""
            };
        },
        methods: {
            toAssign(data) {
                this.select.selected = "";
                this.policeCabnietId = data.id;
                this.edit = !this.edit;
            },
            opCabinet() {

            },
            selRow(data) {
                this.equipArg = [];
                this.equipArg = this._.flatten(
                    this.listData.filter(
                        item => item[0].policeCabinet.id === data.current.id
                    )
                );
            },
            confirm() {
                if (this.select.selected === 0) {
                    if (this.people === "") {
                        this.$message.error("请选择人员");
                    } else {
                        assignPeople({
                            category: this.select.selected,
                            policeCabinetId: this.policeCabnietId,
                            userId: this.people.id
                        }).then(res => {
                            this.$message.success("警柜分配成功");
                            this.people = "";
                            this.black();
                        });
                    }
                } else {
                    assignPeople({
                        category: this.select.selected,
                        policeCabinetId: this.policeCabnietId,
                    }).then(res => {
                        this.$message.success("警柜分配成功");
                        this.black();
                    });
                }
            },
            getList() {
                getPoliceCabinets().then(res => {
                    res.content.forEach((elem) => {
                        elem.policeCabinetUserItems.length !== 0 && (elem.name = elem.policeCabinetUserItems[0].user.name)
                        elem.category = this.$store.getters.enumsObj.HouseCategory[elem.category]
                    })
                    this.listData = res.content
                })
            },
            getCabinetEquipList() {
                this.params.params = [];
                cabinetEquip(this.params).then(res => {
                    this.listData = this._.flatten(res);
                    this.listData = this._.map(
                        this._.groupBy(this.listData, item => `${item.policeCabinet.id}`)
                    );
                });
            },
            back() {
                this.edit = !this.edit;
                this.getList();
            }
        },
        created() {
            this.getList();
        }
    };
</script>
<style lang="scss" scoped>

</style>