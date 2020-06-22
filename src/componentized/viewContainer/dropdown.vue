<template>
    <div class="dropdown-container" @mouseleave="showMenu=false">
        <span class="label" @click="showMenu=!showMenu">{{ label }}</span>
        <div class="menu" v-show="showMenu">
            
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showMenu: false
        }
    },
    props: {
        label: {
            default: '更多'
        }
    },
}
</script>

<style scoped>
.dropdown-container {
    display: inline-block;
    width: 50px;
    position: relative;
    text-align: center;
    z-index: 9999999999;
}
.label {
    cursor: pointer;
}
.menu {
    position: absolute;
    width: 100px;
    min-height: 100px;
    background-color: white;
    border: 1px solid #ebeef5;
    box-shadow:1px 3px 8px rgba(0,0,0,0.1);
    left: -50px;
}
.menu::before {
    content: '';
    position: absolute;
    bottom: 100%;
    right: 10%;
    width: 0;
    height: 0;
    border-width:5px;
    border-style:solid;
    border-color: transparent;
    border-bottom-width: 8px;
    border-bottom-color: currentColor;
    color: #FFFFFF;
}
</style>