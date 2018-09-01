<template>
<div class="ist"></div>
</template>

<script>
import * as d3 from 'd3';
// const red = '#F2DEDE';
// const red_dark = '#D9534F';
// const blue = '#D9EDF7';
// const blue_dark = '#5BC0DE'
// const yellow = '#FCF8E3';
// const yellow_dark = '#F0AD4E';
// const green = '#DFF0D8';
// const green_dark = '#5CB85C';
export default {
    name: 'InteractiveSyntaxTree',
    data() {
        return {
            venue_data: require('@/assets/data/venue.json'),
            zoom: null,
            index: 0,
            duration: 750,
            root: null,
            nodes: [],
            links: [],
            treeData: null,
            margin: { top: 20, right: 150, bottom: 20, left: 150 }
        };
    },
    mounted() {
        this.width = 960 - this.margin.right - this.margin.left;
        this.height = 800 - this.margin.top - this.margin.bottom;
        this.svg = d3.select('.ist').append('svg')
                    .attr('class', 'tree')
                    .attr('width', this.width + this.margin.right + this.margin.left)
                    .attr('height', this.height + this.margin.top + this.margin.bottom)
        this.zoom = d3.zoom()
            .scaleExtent([1/2, 8])
            .on('zoom', this.zoomed);
        const transform = d3.zoomIdentity.translate(this.margin.left, this.margin.top).scale(1);
        this.svg.transition().duration(this.duration).call(this.zoom.transform, transform);
        this.svg.call(this.zoom);
        this.svg = this.svg.append('g');
        this.root = this.getRoot();
        this.update(this.root);
    },
    computed: {
        tree() {
            return d3.tree().size([this.height, this.width])
        }
    },
    methods: {
        getRoot() {
            let root = d3.hierarchy(this.venue_data, d => {
                return d.children;
            });
            root.x0 = this.height / 2;
            root.y0 = 0;
            return root;
        },
        toggle(d) {
            if (d.children || d._children) {
                if (d.children) {
                    this.$set(d, '_children', d.children);
                    d.children = null;
                }
                else {
                    this.$set(d, 'children', d._children);
                    d._children = null;
                }
                this.$nextTick(
                    () => {
                        this.update(d);
                    }
                );
            }
        },
        diagonal (s, d) {
            return `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`
        },
        getNodesAndLinks() {
            this.treeData = this.tree(this.root);
            this.nodes = this.treeData.descendants();
            this.links = this.nodes.slice(1);
        },
        update(source) {
            this.getNodesAndLinks();
            this.nodes.forEach(d => {
                d.y = d.depth * 180;
            });
            const svg = this.svg;
            
            let node = svg.selectAll('g.node')
                .data(this.nodes, d => {
                    return d.id || (d.id = ++this.index);
                });
            
            let nodeEnter = node.enter().append('g')
                .attr('class', function(d) {
                    return 'node ' + d.data.type;
                })
                .attr('transform', () => {
                    return 'translate(' + source.y0 + ', ' + source.x0 + ')';
                })
                .on('click', this.toggle);
            
            nodeEnter.append('circle')
                .attr('r', 1e-6)
            
            nodeEnter.append('text')
                .attr('x', function(d) {
                    return d.children || d._children ? -15 : 15;
                })
                .attr('dy', 5)
                .attr('text-anchor', function(d) {
                    return d.children || d._children ? 'end' : 'start';
                })
                .text(function(d) {
                    return d.data.name ? d.data.name : d.data.type;
                })
                .style('fill-opacity', 1e-6);

            let nodeUpdate = nodeEnter.merge(node)
                .transition()
                .duration(this.duration)
                .attr('transform', d => {
                    return 'translate(' + d.y + ', ' + d.x + ')';
                });

            nodeUpdate.select('circle')
                .attr('r', 10)
                .attr('class', d => {
                    return d._children ? 'collapsed' : ''
                });

            nodeUpdate.select('text')
                .style('fill-opacity', 1);
            
            let nodeExit = node.exit()
                .transition()
                .duration(this.duration)
                .attr('transform', () => {
                    return 'translate(' + source.y + ', ' + source.x + ')';
                })
                .remove();
            
            nodeExit.select('circle')
                .attr('r', 1e-6);
            
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);
            
            let link = this.svg.selectAll('path.link')
                .data(this.links, d => { return d.id; });
            
            let linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', d => {
                    let o = { x: source.x0, y: source.y0 };
                    return this.diagonal(o, o)
                });
            
            let linkUpdate = linkEnter.merge(link);
            
            linkUpdate.transition()
                .duration(this.duration)
                .attr('d', d => { return this.diagonal(d, d.parent) })
            
            link.exit().transition()
                .duration(this.duration)
                .attr('d', d => {
                    let o = { x: source.x, y: source.y };
                    return this.diagonal(o, o)
                })
                .remove();
            
            this.nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },
        zoomed() {
            this.svg.attr('transform', d3.event.transform);
        }
    }
};

</script>

<style>
circle {
    stroke-width: 1.5px;
}

.content circle {
    fill: #DFF0D8;
    stroke: #5CB85C;
}

.pickone circle {
    fill: #F2DEDE;
    stroke: #D9534F;
}

.order circle {
    fill: #D9EDF7;
    stroke: #5BC0DE;
}

.exchangeable circle {
    fill: #FCF8E3;
    stroke: #F0AD4E;
}

circle.collapsed {
    fill: #FFF;
}

.node {
    cursor: pointer;
}

.node text {
    font: 15px sans-serif;
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