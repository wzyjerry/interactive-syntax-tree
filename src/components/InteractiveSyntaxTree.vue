<template>
  <svg/>
</template>

<script>
import * as d3 from 'd3';
import * as $ from 'jquery';

/* TODO: 数据,之后由界面导入 */
const venue_data = require('@/assets/data/venue.json');

export default {
    name: 'InteractiveSyntaxTree',
    data: function() {
        return {
            /* 超根节点，用于维护全部根节点。可生成py代码的树只包含唯一模拟器子节点。 */
            root: null,

            /* 节点拖拽 */
            // this.drag 节点拖拽事件
            drag: null,
            // 节点拖拽状态
            dragStarted: false,
            // 拖拽节点集合，包含节点的先根序列
            dragNodes: null,

            /* 镜头移动 */
            // 镜头移动边界
            panBoundary: 50,
            // 镜头移动速度
            panSpeed: 120,

            zoom: null,
            index: 0,
            duration: 750,
            nodes: [],
            links: [],
            treeData: null,
            margin: {
                top: 20,
                right: 150,
                bottom: 20,
                left: 150
            }
        };
    },
    computed: {
        tree: function() {
            return d3.tree().size([this.height, this.width]);
        }
    },
    mounted: function() {
        this.width = 960 - this.margin.right - this.margin.left;
        this.height = $(document).height() - this.margin.top - this.margin.bottom - 20;
        this.svg = d3.select('svg')
            .attr('width', this.width + this.margin.right + this.margin.left)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        this.drag = d3.drag()
            // 标记拖拽开始
            .on('start', d => {
                if (d === this.root) {
                    return;
                }
                this.dragStarted = true;
                this.dragNodes = d.descendants();
                // 阻止事件传播 https://stackoverflow.com/questions/10095979/d3-click-and-drag-event-nesting
                d3.event.sourceEvent.stopPropagation();
            })
            // 拖拽中，处理镜头移动
            .on('drag', (d) => {
                if (d === this.root) {
                    return;
                }
                if (this.dragStarted) {
                    const domNode = d3.event.target;
                    this.initDrag(d, domNode);
                }
                // 获取相对画布的鼠标坐标
                const relCoords = d3.mouse($('svg').get(0));
            });
        this.zoom = d3.zoom()
            .scaleExtent([1 / 2, 8])
            .on('zoom', this.zoomed);
        const transform = d3.zoomIdentity.translate(this.margin.left, this.margin.top).scale(1);
        this.svg.transition().duration(this.duration)
            .call(this.zoom.transform, transform);
        this.svg.call(this.zoom);
        this.svg = this.svg.append('g');
        this.root = this.initDev();
        this.update(this.root);
    },
    methods: {
        // 镜头移动：当拖动元素到达边界区时
        pan: (domNode, direction) => {
            let translateCoords = d3.transform()
            if (direction === 'left'
                || direction === 'right') {
                    // TODO
                }
        },
        initDrag: function(d, domNode) {

        },
        initDev: function() {
            const rootData = {
                'type': 'root',
                'children': [venue_data]
            };
            const root = d3.hierarchy(rootData);
            root.x0 = this.height / 2;
            root.y0 = 0;
            return root;
        },
        toggle: function(d) {
            if (d.children || d._children) {
                if (d.children) {
                    this.$set(d, '_children', d.children);
                    d.children = null;
                }
                else {
                    this.$set(d, 'children', d._children);
                    d._children = null;
                }
                this.$nextTick(() => {
                    this.update(d);
                });
            }
        },
        diagonal: function (s, d) {
            return `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`;
        },
        getNodesAndLinks: function() {
            this.treeData = this.tree(this.root);
            this.nodes = this.treeData.descendants();
            this.links = this.nodes.slice(1);
        },
        update: function(source) {
            this.getNodesAndLinks();
            this.nodes.forEach(d => {
                d.y = d.depth * 180;
            });
            const svg = this.svg;

            const node = svg.selectAll('g.node')
                .data(this.nodes, d => {
                    return d.id || (d.id = ++this.index);
                });

            const nodeEnter = node.enter().append('g')
                .call(this.drag)
                .attr('class', function(d) {
                    return 'node ' + d.data.type;
                })
                .attr('transform', () => {
                    return 'translate(' + source.y0 + ', ' + source.x0 + ')';
                })
                .on('click', this.toggle);

            nodeEnter.append('circle')
                .attr('r', 1e-6);

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

            const nodeUpdate = nodeEnter.merge(node)
                .transition()
                .duration(this.duration)
                .attr('transform', d => {
                    return 'translate(' + d.y + ', ' + d.x + ')';
                });

            nodeUpdate.select('circle')
                .attr('r', 10)
                .attr('class', d => {
                    return d._children ? 'collapsed' : '';
                });

            nodeUpdate.select('text')
                .style('fill-opacity', 1);

            const nodeExit = node.exit()
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

            const link = this.svg.selectAll('path.link')
                .data(this.links, d => {
                    return d.id;
                });

            const linkEnter = link.enter().insert('path', 'g')
                .attr('class', 'link')
                .attr('d', () => {
                    const o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return this.diagonal(o, o);
                });

            const linkUpdate = linkEnter.merge(link);

            linkUpdate.transition()
                .duration(this.duration)
                .attr('d', d => {
                    return this.diagonal(d, d.parent);
                });

            link.exit().transition()
                .duration(this.duration)
                .attr('d', () => {
                    const o = {
                        x: source.x,
                        y: source.y
                    };
                    return this.diagonal(o, o);
                })
                .remove();

            this.nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },
        zoomed: function() {
            this.svg.attr('transform', d3.event.transform);
        }
    }
};

</script>

<style>
circle {
    stroke-width: 1.5px;
}

.root circle {
    fill: #DCB5FF;
    stroke: #BE77FF;
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
