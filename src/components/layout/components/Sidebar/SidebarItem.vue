<template>
    <div class="menu-wrapper">
        <template v-for="item in routes" v-if="!item.hidden&&item.children&&item.name!=='overview'">
            <!-- 只有一个子级菜单，并且没有更下级，则显示为单层 -->
            <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
                         :to="item.path+'/'+item.children[0].path"
                         :key="item.children[0].name"
                         :data-test="item.children[0].meta.title">
                <el-menu-item :index="item.path+'/'+item.children[0].path"
                              :class="{'submenu-title-noDropdown':!isNest}">
                    <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon"
                              :icon-class="item.children[0].meta.icon"></svg-icon>
                    <span v-if="item.children[0].meta&&item.children[0].meta.title"
                          slot="title">{{item.children[0].meta.title}}</span>
                </el-menu-item>
            </router-link>
            <el-submenu v-else :index="item.name||item.path" :key="item.name" :data-test="item.meta.title">
                <template slot="title">
                    <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                    <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
                </template>
                <template v-for="child in item.children" v-if="!child.hidden">
                    <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0"
                                  :routes="[child]" :key="child.path"></sidebar-item>
                    <router-link v-else :to="item.path+'/'+child.path" :key="child.name" :data-test="child.meta.title">
                        <el-menu-item :index="item.path+'/'+child.path">
                            <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                            <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
        </template>
    </div>
</template>

<script>
    import Layout from 'components/layout/Layout'
    export default {
        name: 'SidebarItem',
        props: {
            routes: {
                type: Array
            },
            isNest: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            hasOneShowingChildren(children) {
                return children.filter(item => !item.hidden).length == 1; // 子菜单就一个，就显示为单层
            }
        }
    }
</script>
