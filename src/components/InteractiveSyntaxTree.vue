<template>
<div class="main-svg"></div>
</template>

<script>
import * as d3 from 'd3';
const node_pickone = '#F2DEDE';
const node_order = '#D9EDF7';
const node_exchangeable = '#FCF8E3';
const node_content = '#DFF0D8';
export default {
    name: 'InteractiveSyntaxTree',
    data() {
        return {
            venue_data: require('@/assets/data/venue.json')
        };
    },
    mounted() {
        this.initTree();
    },
    methods: {
        initTree() {
            let venue = d3.hierarchy(this.venue_data)
                        .sum(function(d) {
                            return d.value ? 1 : 0
                        });
            let width = 960;
            let height = 2000;
            
            let svg = d3.select('.main-svg')
                        .append('svg')
                        .attr('width', width)
                        .attr('height', height);
            let tree = d3.tree()
                    .nodeSize([40, 40])
                    .separation(function(a, b) {
                        return (a.parent === b.parent ? 1 : 2);
                    });
            let treeData = tree(venue);
            let nodes = treeData.descendants();
            let links = treeData.links();
            const bezier_curve_generator = d3.linkHorizontal()
                                            .x(function(d) { return d.y; })
                                            .y(function(d) { return d.x; });
            var g = svg.append("g")
            .attr('transform', 'translate(200,300)');
            g.append('g')
            .selectAll('path')
            .data(links)
            .enter()
            .append('path')
            .attr('d', function(d) {
                let start = {
                    x: d.source.x,
                    y: d.source.y
                };
                let end = {
                    x: d.target.x,
                    y:d.target.y
                };
                return bezier_curve_generator({
                    source: start,
                    target: end
                });
            })
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

            let gs = g.append("g")
                    .selectAll("g")
                    .data(nodes)
                    .enter()
                    .append("g")
                    .attr("transform",function(d){
                        var cx = d.x;
                        var cy= d.y;
                        return "translate("+cy+","+cx+")";
                    });
                //绘制节点
                gs.append("circle")
                    .attr("r",6)
                    .attr("fill", function(d) {
                        switch (d.data.type) {
                            case 'pickone':
                                return node_pickone;
                            case 'order':
                                return node_order;
                            case 'exchangeable':
                                return node_exchangeable;
                            case 'content':
                                return node_content;
                        }
                    })
                    .attr("stroke","blue")
                    .attr("stroke-width",1);
    		
                //文字
                gs.append("text")
                    .attr("x",function(d){
                        return d.children?-130:8;
                    })
                    .attr("y",-5)
                    .attr("dy",10)
                    .text(function(d){
                        return d.data.name;
                    })
                }
    }
};

</script>

<style scoped>
</style>
