<template>
    <div>
        <upload-file v-model="form.faceInformation" size="small" :disabled="true" margin="24px 0 15px 0"></upload-file>
        <div class="info">
            <span>{{form.name}}</span>
            <span>{{form.position}}</span>
            <span>{{form.organUnitName}}</span>
        </div>
    </div>
</template>

<script>
    import uploadFile from '@/componentized/uploadFile'
    export default {
        components:{uploadFile},
        data() {
            return {
                form: JSON.parse(localStorage.getItem('user'))
            }
        }
    }
</script>