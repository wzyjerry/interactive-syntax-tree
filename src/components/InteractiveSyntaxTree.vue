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
            dragStarted: null,
            // 拖拽节点集合，包含节点的先根序列
            dragNodes: null,

            /* 镜头移动 */
            // 镜头移动边界
            panBoundary: 50,
            // 镜头移动速度
            panSpeed: 10.0,
            // 镜头移动计时器设置
            panTimer: false,

            /* 画布组件 */
            // 画布
            svg: null,
            // 交互树组件集合
            svgGroup: null,
            // 交互树偏移
            transform: d3.zoomIdentity,

            zoom: null,
            index: 0,
            duration: 750,
            nodes: [],
            links: [],
            treeData: null
        };
    },
    computed: {
        tree: function() {
            return d3.tree().size([this.height, this.width]);
        }
    },
    mounted: function() {
        const vue = this;
        this.width = 800;
        this.height = 400;
        this.svg = d3.select('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.drag = d3.drag()
            // 标记拖拽开始
            .on('start', function(d) {
                if (d === vue.root) {
                    return;
                }
                vue.dragStarted = true;
                vue.dragNodes = d.descendants();
                // 阻止事件传播 https://stackoverflow.com/questions/10095979/d3-click-and-drag-event-nesting
                d3.event.sourceEvent.stopPropagation();
            })
            // 拖拽中，处理镜头移动
            .on('drag', function(d) {
                if (d === vue.root) {
                    return;
                }
                if (vue.dragStarted) {
                    vue.initDrag(d, this);
                }
                // 获取相对画布的鼠标坐标
                const relCoords = d3.mouse($('svg').get(0));
                if (relCoords[0] < vue.panBoundary) {
                    vue.pan(this, 'left');
                }
                else if (relCoords[0] > $('svg').width() - vue.panBoundary) {
                    vue.pan(this, 'right');
                }
                else if (relCoords[1] < vue.panBoundary) {
                    vue.pan(this, 'up');
                }
                else if (relCoords[1] > $('svg').height() - vue.panBoundary) {
                    vue.pan(this, 'down');
                }
                else {
                    clearTimeout(vue.panTimer);
                }
                d.x0 += d3.event.dy;
                d.y0 += d3.event.dx;
                const node = d3.select(this);
                node.attr('transform', 'translate(' + d.y0 + ', ' + d.x0 + ')');
            })
            .on('end', function() {
                clearTimeout(vue.panTimer);
            });
        this.zoom = d3.zoom()
            .scaleExtent([1 / 2, 8])
            .on('zoom', this.zoomed);
        this.svg.call(this.zoom);
        this.svg = this.svg.append('g');
        this.svgGroup = this.svg;
        this.svgGroup.call(this.zoom.transform, this.transform);
        this.root = this.initDev();
        this.update(this.root);
    },
    methods: {
        // 镜头移动：当拖动元素到达边界区时
        pan: function(domNode, direction) {
            clearTimeout(this.panTimer);
            const panSpeed = this.panSpeed * this.transform.k;
            const vue = this;
            switch (direction) {
                case 'left':
                    this.transform.x += panSpeed;
                    break;
                case 'right':
                    this.transform.x -= panSpeed;
                    break;
                case 'up':
                    this.transform.y += panSpeed;
                    break;
                case 'down':
                    this.transform.y -= panSpeed;
                    break;
                default:
                    break;
            }
            this.svgGroup.call(this.zoom.transform, this.transform);
            this.panTimer = setTimeout(function() {
                vue.pan(domNode, direction);
            }, 50);
        },
        initDrag: function(d, domNode) {

            // this.svg.attr('transform', d3.event.transform);
            this.dragStarted = null;
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
                    this.centerNode(d);
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
        centerNode: function(node) {
            this.zoom.translateTo(this.svgGroup.transition().duration(this.duration), node.y0, node.x0);
        },
        zoomed: function() {
            this.transform = d3.event.transform;
            this.svg.attr('transform', this.transform);
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
