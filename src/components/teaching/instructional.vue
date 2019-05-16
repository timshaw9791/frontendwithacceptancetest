<template>
    <div>
        <div id="pdf-viewer" v-if="getFlag()"></div>
        <div id="vide" v-if="!getFlag()"></div>
    </div>
</template>

<script>
    import PDFJS from 'pdfjs-dist'
    export default {
        name: "instructional",
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
        methods:{
            getFlag(){
                return this.ins.typeName=='PDF'?true:false
            },
            extractPdfContent() {
                let pdfContainer = document.getElementById('pdf-viewer');
                PDFJS.getDocument('http://115.159.154.194/warehouse/images/1.pdf').then(function(pdf) {
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

</style>