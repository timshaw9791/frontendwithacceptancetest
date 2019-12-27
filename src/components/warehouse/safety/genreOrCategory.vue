<template>
    <div>
        <serviceDialog :title="title" ref="genreOrCategory" width="3.3021rem"
                       :button="false">
            <div class="add_genre_box">
                <div class="add_genre_body" v-if="type!=='unallocated'">
                    <div class="add_genre_item" style="margin-top:0.421875rem" v-if="title==='修改小类'">
                        <label style="width: 0.56875rem" v-text="'选择小类：'"></label>
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                                    v-for="item in genreData.categorySet"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="add_genre_item"
                         :style="title==='修改小类'?'margin-top: 0.1042rem':'margin-top:0.521875rem'">
                        <label style="width: 0.56875rem"
                               v-text="type==='tree'?'装备大类:':title==='修改小类'?'修改小类:':'装备小类:'"></label>
                        <bos-input width="1.2917rem" v-model="genre"></bos-input>
                    </div>
                </div>
                <div class="add_genre_body" v-if="type==='unallocated'">
                    <div class="add_genre_item" style="margin-top:0.421875rem">
                        <label style="width: 0.56875rem" v-text="'选择大类：'"></label>
                        <el-select v-model="select.selectGenre" placeholder="请选择" @change="changeGenre">
                            <el-option
                                    v-for="item in selectData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="add_genre_item" style="margin-top:0.221875rem">
                        <label style="width: 0.56875rem" v-text="'选择小类：'"></label>
                        <el-select v-model="select.selectCategory" placeholder="--" @change="changeCategory">
                            <el-option
                                    v-for="item in categroyList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="add_genre_foot">
                    <el-button @click="cancelDb" data-test="button">取 消</el-button>
                    <el-button style="margin-left: 0.1042rem" :disabled="disabled" type="primary" @click="dialogConfirm"
                               data-test="button">确 定
                    </el-button>
                </div>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import serviceDialog from 'components/base/gailiangban'
    import {categorySaveGenre, updateGenre, categorySaveCategory, updateCategory, relateCategories} from "api/warehouse"

    export default {
        name: "genreOrCategory",
        components: {serviceDialog},
        data() {
            return {
                genre: '',
                value: '',
                categroyList: [],
                select: {
                    selectGenre: '',
                    selectCategroy: ''
                }
            }
        },
        computed: {
            disabled() {
                if (this.type === 'unallocated') {
                    return false
                } else {
                    if (this.genre) {
                        return false
                    } else {
                        return true
                    }
                }
            },
        },
        created() {

        },
        activated() {
        },
        props: {
            title: {
                type: String
            },
            genreData: {
                type: Object
            },
            type: {
                type: String,
                default: 'genre'
            },
            selectData: {
                type: Array
            },
            checkBoxData: {
                type: Array
            }
        },
        methods: {
            show() {
                this.$set(this,'genre','');
                this.$set(this,'value','');
                this.$set(this,'select',{selectGenre: '', selectCategroy: ''});
                this.$refs.genreOrCategory.show()
            },
            result() {
                this.genre = '';
                this.value = '';
                this.select = {
                    selectGenre: '',
                    selectCategroy: '',
                }
            },
            cancelDb() {
                this.$refs.genreOrCategory.cancel();
            },
            changeGenre(data) {
                this.selectData.forEach(item => {
                    if (item.id === data) {
                        this.categroyList = item.categorySet;
                    }
                });
            },
            changeCategory(data) {
                this.select.selectCategroy = data
            },
            dialogConfirm() {
                if (this.title.indexOf('添加') != -1) {
                    if (this.type === 'tree') {
                        categorySaveGenre({name: this.genre}).then(res => {
                            this.$emit('sucess', res);
                            this.result();
                        }).catch(err=>{
                            this.$message.error(err.response.data.message);
                        })
                    } else {
                        categorySaveCategory({name: this.genre}, this.genreData.id).then(res => {
                            this.$emit('sucessUpdateCategory', {type:'add',res:{categorySet:res.categorySet,categoryName:this.genre}});
                            this.result();
                        }).catch(err=>{
                            this.$message.error(err.response.data.message);
                        })
                    }
                } else if (this.title !== '装备分配') {
                    if (this.genreData) {
                        let data = JSON.parse(JSON.stringify(this.genreData));
                        data.name = this.genre;
                        if (this.type === 'tree') {
                            updateGenre(data).then(res => {
                                this.$emit('sucess', res);
                                this.result();
                            }).catch(err=>{
                                this.$message.error(err.response.data.message);
                            })
                        } else {
                            let categoryData = {};
                            data.categorySet.forEach(item => {
                                if (item.id === this.value) {
                                    categoryData = item
                                }
                            });
                            categoryData.name = this.genre;
                            updateCategory(categoryData).then(res => {
                                this.$emit('sucessUpdateCategory', {type:'update',res:res});
                                this.result();
                            }).catch(err=>{
                                this.$message.error(err.response.data.message);
                            })
                        }

                    }
                } else {
                    let categoryId = this.select.selectCategroy;
                    let equipArgs = '';
                    this.checkBoxData.forEach(item => {
                        if (equipArgs == '') {
                            equipArgs = item.equipArg.id;
                        } else {
                            equipArgs = equipArgs + ',' + item.equipArg.id
                        }
                    });
                    relateCategories(categoryId, equipArgs).then(res => {
                        this.$emit('sucessDistribution', 'unallocated');
                        this.result();
                    }).catch(err=>{
                        this.$message.error(err.response.data.message);
                    })
                }

            }
        }
    }
</script>

<style scoped>
    .add_genre_box {
        width: 3.3021rem;
        height: 1.6302rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0.015625rem 0.03125rem rgba(0, 0, 0, 0.16);
        display: flex;
        justify-content: center;
        position: relative;
    }

    .add_genre_box .add_genre_body {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .add_genre_body .add_genre_item {
        width: 1.875rem;
        display: flex;
        flex-direction: row;
        height: 0.1667rem;
        align-items: center;
    }

    .add_genre_box .add_genre_foot {
        position: absolute;
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 0.1875rem;
    }
</style>