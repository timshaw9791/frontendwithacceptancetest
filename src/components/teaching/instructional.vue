<template>
    <div class="instructional-box">
        <div id="pdf-viewer" v-if="getFlag()"></div>
        <div v-if="!getFlag()" class="instructional-video">
            <my-new-video :src="mp4Src" :autoplay="true"></my-new-video>
        </div>
    </div>
</template>

<script>
    import PDFJS from 'pdfjs-dist'
    import myNewVideo from '@/components/videoPlayer/newLive'
    import {baseURL} from "../../api/config";

    export default {
        name: "instructional",
        components:{
            myNewVideo
        },
        props:{
            ins:{
                type:Object
            }
        },
        mounted(){
            if(this.ins.typeName=='PDF'){
                this.extractPdfContent();
            }
        },
        data(){
            return{
                src:baseURL+'/pdfs/',
                mp4:baseURL+'/videos/'
            }
        },
        computed:{
            mp4Src(){
                console.log(this.mp4+this.ins.key)
                return this.mp4+this.ins.key
            }
        },
        methods:{
            getFlag(){
                return this.ins.typeName=='PDF'?true:false
            },
            getSrc(){
                return   this.src+this.ins.key
            },
            extractPdfContent() {
                let url = this.getSrc();
                let pdfContainer = document.getElementById('pdf-viewer');
                PDFJS.getDocument(url).then(function(pdf) {
                    // you can now use *pdf* here
                    let arr = [];
                    for(let i = 1; i<= pdf.numPages;i++) {
                        arr.push(pdf.getPage(i))
                    }
                    //这里的处理是为了避免pdf渲染乱序
                    Promise.all(arr).then(function(pages) {
                        for(let j = 0; j< pdf.numPages;j++) {
                            let page = pages[j]
                            var viewport = page.getViewport(2.0);
                            var canvasNew = document.createElement('canvas');
                            canvasNew.style.width = '100%';
                            canvasNew.id = `pdf_${page.pageNumber}`;
                            canvasNew.height = viewport.height;
                            canvasNew.width = viewport.width;

                            page.render({
                                canvasContext: canvasNew.getContext('2d'),
                                viewport: viewport
                            });
                            pdfContainer.appendChild(canvasNew)
                        }
                    });
                })
            }
        }
    }
</script>

<style scoped>
    .instructional-box{
        width: 100%;
        height: 4.1667rem;
        overflow:auto
    }
    .instructional-box .instructional-video{
        margin: auto;
        width: 80%;
    }
</style>
