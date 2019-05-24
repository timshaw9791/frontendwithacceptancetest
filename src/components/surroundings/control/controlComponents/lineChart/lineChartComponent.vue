<template>
    <div class="container">
        <svg id="visualisation" width="1040" :height="height"></svg>
    </div>
</template>
<script>
    export default {
        name: "lineChartComponent",
        data(){
            return{
                svgData:[{
                    "sale": 45,
                    "time": new Date(2019, 5, 22,15)
                }, {
                    "sale": 46,
                    "time": new Date(2019, 5, 22,17)
                }, {
                    "sale": 47,
                    "time": new Date(2019, 5, 22,19)
                }, {
                    "sale": 42,
                    "time": new Date(2019, 5, 22,21)
                }, {
                    "sale": 41,
                    "time": new Date(2019, 5, 22,23)
                }, {
                    "sale": 50,
                    "time": new Date(2019, 5, 23, 1)
                },{
                    "sale": 51,
                    "time": new Date(2019, 5, 23, 3)
                },{
                    "sale": 43,
                    "time": new Date(2019, 5, 23, 5)
                },{
                    "sale": 53,
                    "time": new Date(2019, 5, 23, 7)
                },{
                    "sale": 55,
                    "time": new Date(2019, 5, 23, 9)
                },{
                    "sale": 48,
                    "time": new Date(2019, 5, 23, 11)
                },{
                    "sale": 89,
                    "time": new Date(2019, 5, 23, 13)
                },{
                    "sale": 43,
                    "time": new Date(2019, 5, 23, 15)
                }
                ],
                xdata:['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
                initTime:15,
                height:460,
                yHeight:300,
                ticksNunber:5
            }
        },

        created(){

        },
        mounted(){
            var svg = d3.select("#visualisation"),
                margin = {top: 60, right: 50, bottom: 60, left: 70},
                width = +svg.attr("width") - margin.left - margin.right,
                height = +svg.attr("height") - margin.top - margin.bottom,
                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var formatNumber = d3.format(".1f");
            var time = d3.timeFormat("%I:%M");

            var x = d3.scaleTime()
                .domain([new Date(2019, 5, 22,15), new Date(2019, 5, 23,15)])
                .range([0, width-80]);


            var y = d3.scaleLinear()
                .domain([0, 80])
                .range([this.yHeight, 0]);
            let that = this;
            var xAxis = d3.axisBottom(x)
                .ticks(d3.timeHour.every(1))
                .tickSize(0)
                .tickFormat( function (d) {
                    let times='';
                   if((d.getHours()-that.initTime)%2==0){
                       times = d.getHours()+':00'
                   }
                   return this.parentNode.nextSibling? times:'当前'
                });

            var yAxis = d3.axisRight(y)
                .tickSize(width)
                .ticks(this.ticksNunber)
                .tickFormat( function (d) {

                    return d+'%'
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
                .text(d => d.sale+'%')
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