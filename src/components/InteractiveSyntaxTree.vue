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
            let width = 600,
                height = 400,
                svg = d3.select('.main-svg')
                        .append('svg')
                        .attr('width', width)
                        .attr('height', height),
                g = svg.append('g')
                    .attr('transform', 'translate(150, 0)');
                    
            let tree = d3.tree()
                    .size([height, width - 300]);

            let venue = d3.hierarchy(this.venue_data)
                        .sum(function(d) {
                            return d.value ? 1 : 0
                        });
            let link = g.selectAll('.link')
                    .data(tree(venue).links())
                    .enter()
                    .append('path')
                    .attr('class', 'link')
                    .attr('d', d3.linkHorizontal()
                        .x(function(d) { return d.y; })
                        .y(function(d) { return d.x; }));

            let node = g.selectAll('.node')
                    .data(venue.descendants())
                    .enter()
                    .append('g')
                    .attr('class', function(d) {
                        return d.data.type;
                    })
                    .attr('transform', function(d) {
                        return 'translate(' + d.y + ', ' + d.x + ")";
                    });
                    
            node.append('circle')
                .attr('r', 2.5)
            
            node.append('text')
                .attr('dy', 3)
                .attr('x', function(d) {
                    return d.children ? -8 : 8;
                })
                .style('text-anchor', function(d) {
                    return d.children ? 'end' : 'start';
                })
                .text(function(d) {
                    return d.data.name ? d.data.name : d.data.type;
                });
        }
    }
};

</script>

<style>

.node circle {
  fill: #999;
}

.node text {
  font: 10px sans-serif;
}

.node--internal circle {
  fill: #555;
}

.node--internal text {
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}

.link {
  fill: none;
  stroke: #555;
  stroke-opacity: 0.4;
  stroke-width: 1.5px;
}

</style>