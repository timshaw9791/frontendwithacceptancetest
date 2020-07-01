<template>
    <div @click="toggleClick">
        <svg-icon class="hamburger"  :class="{'is-active':isActive}" icon-class="展开"></svg-icon>
    </div>
</template>

<script>
    export default {
        name: 'hamburger',
        props: {
            isActive: {
                type: Boolean,
                default: false
            },
            toggleClick: {
                type: Function,
                default: null
            }
        }
    }
</script>

<style scoped>
    .hamburger {
        display: block;
        cursor: pointer;
        width: 0.1042rem;
        height: 0.2604rem;
        transform: rotate(90deg);
        transition: .38s;
        transform-origin: 50% 50%;
    }

    .hamburger.is-active {
        transform: rotate(0deg);
    }
</style>
