<template>
    <div class="container">
        <svg id="visualisation" width="1500" :height="height"></svg>
    </div>
</template>
<script>
    import * as d3 from 'd3';
    export default {
        name: "lineChartComponent",
        data(){
            return{

            }
        },
        props:{
            svgData:{
                type:Array
            },
            height:{
                type:Number
            },
            yHeight:{
                type:Number
            },
            ticksNumber:{
                type:Number
            },
            initTime:{
                type:[Number,Date]
            },
            characterType:{
                type:String
            },
            region:{
                type:Array
            },
            threshold:{
                type:Object
            },
            timeType:{
                type:String,
                default:'hour'
            }
        },
        created(){

        },
        mounted(){
            let that = this;
            let ticks;
            if(this.timeType=='hour'){
                ticks=d3.timeHour.every(1);
            }else {
                ticks=d3.timeDay.every(1);
            }
            var svg = d3.select("#visualisation"),
                margin = {top: 60, right: 50, bottom: 60, left: 70},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var formatNumber = d3.format(".1f");
            var time = d3.timeFormat("%I:%M");

            var x = d3.scaleTime()
                .domain(that.region)
                .range([0, width-80]);

            var y = d3.scaleLinear()
                .domain([that.threshold.min, that.threshold.max])
                .range([this.yHeight, 0]);
            var xAxis = d3.axisBottom(x)
                .ticks(ticks)
                .tickSize(0)
                .tickFormat( function (d) {
                   if(that.timeType=='hour'){
                       let times='';
                       if((d.getHours()-that.initTime)%2==0){
                           times = d.getHours()+':00'
                       }
                       return this.parentNode.nextSibling? times:'当前'
                   }else {
                       let times='';
                       let day= d.getDate();
                       times=day+'日';
                       return  times
                   }
                });

            var yAxis = d3.axisRight(y)
                .tickSize(width)
                .ticks(Number(that.ticksNumber))
                .tickFormat( function (d) {
                    return d+that.characterType
                });

            g.append("g")
                .attr("transform", "translate(40," + this.yHeight + ")")
                .call(customXAxis);

            g.append("g")
                .call(customYAxis);

            var lineGen = d3.line()
                .x(function(d) {
                    return x(d.time);
                })
                .y(function(d) {
                    return y(d.sale);
                });
            svg.append('svg:path')
                .attr('d', lineGen(this.svgData))
                .attr("transform", "translate("+(margin.left+40)+"," +margin.top+ ")")
                .attr('stroke', '#2F2F76')
                .attr('stroke-width', 1)
                .attr('fill', 'none');

            var g = svg.selectAll('circle')
                .data(this.svgData)
                .enter()
                .append('g');
                g.append("circle")
                .attr("transform", "translate("+(margin.left+40)+"," +margin.top+ ")")
                .attr("cx", function(d) {
                    return x(d.time);
                })
                .attr("cy", function(d) {
                    return y(d.sale);
                })
                .attr("r",3)
                .attr("fill",'#2F2F76');
            g.append('text')
                .data(this.svgData)
                .attr('class', 'text')
                .attr('x', (d, i) => x(d.time) + (margin.left+40))
                .attr('y', d => y(d.sale) + margin.top-5)
                .text(d => d.sale+that.characterType)
                .attr("font-size", "14px")
                .attr("fill", "#2F2F76");

            function customXAxis(g) {
                g.call(xAxis);
                g.select(".domain").remove();
                g.selectAll(".tick text").attr("font-size",'14px').attr("fill",'rgba(112,112,112,1)').attr("dy",28);
            }

            function customYAxis(g) {
                g.call(yAxis);
                g.select(".domain").remove();
                g.selectAll(".tick line").attr("stroke", "rgba(112,112,112,0.13)");
                g.selectAll(".tick text").attr("x", -38).attr("dy", 4).attr("font-size","14px").attr("fill",'rgba(112,112,112,1)');
            }

        },
        methods:{

        }
    }
</script>

<style scoped>
    .container{
        text-align: center;
    }
    .axis {
        color: #FF0000;
    }
    .axis line {
        fill: none;
        stroke: black;
        shape-rendering: crispEdges;
    }

    .text {
        font-family: "PingFang SC";
        color: rgba(112,112,112,1);
        font-size: 14px;
    }
</style>