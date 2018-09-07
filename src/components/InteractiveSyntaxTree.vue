<template>
  <svg
    height="100vh"
    width="80vw" />
</template>

<script>
import * as d3 from 'd3';
import $ from 'jquery';

/* TODO: 数据,之后由界面导入 */
const venue_data = require('@/assets/data/venue.json');
export default {
    name: 'InteractiveSyntaxTree',
    data: function() {
        return {
            /* 数据 */
            // 输入数据
            data: null,
            // 布局数据
            root: null,
            // 节点编号
            index: 0,

            /* 节点拖拽 */
            // 节点拖拽侦听
            dragListener: null,
            // 节点拖拽状态
            dragStarted: null,
            // 拖拽节点集合，包含节点的先根序列
            dragNodes: null,
            // 拖拽的节点
            draggingNode: null,
            // 目标节点
            selectedNode: null,

            /* 镜头移动 */
            // 镜头移动边界
            panBoundary: 50,
            // 镜头移动计时器设置
            panTimer: null,

            /* 画布组件 */
            // SVG画布
            baseSvg: null,
            // 交互树组件集合
            svgGroup: null,
            // 画布缩放侦听
            zoomListener: null,
            // 边产生器
            linkGenerator: null,

            /* 动画 */
            // 动画时长
            duration: 750
        };
    },
    mounted: function() {
        const vue = this;
        this.zoomListener = d3.zoom()
            .scaleExtent([0.5, 4])
            .on('zoom', this.zoom);
        this.baseSvg = d3.select('svg')
            .attr('class', 'overlay')
            .call(this.zoomListener)
            .on('dblclick.zoom', null);
        this.linkGenerator = d3.linkHorizontal()
            .x(function(d) {
                return d.y;
            })
            .y(function(d) {
                return d.x;
            });
        this.dragListener = d3.drag()
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
                    vue.dragStart(d, this);
                }
                // 获取相对画布的鼠标坐标
                const relCoords = d3.mouse($('svg').get(0));
                let direction = null;
                let panSpeed = null;
                if (relCoords[0] < vue.panBoundary) {
                    direction = 'left';
                    panSpeed = vue.panBoundary - relCoords[0];
                }
                else if (relCoords[0] > $('svg').width() - vue.panBoundary) {
                    direction = 'right';
                    panSpeed = relCoords[0] - $('svg').width() + vue.panBoundary;
                }
                else if (relCoords[1] < vue.panBoundary) {
                    direction = 'up';
                    panSpeed = vue.panBoundary - relCoords[1];
                }
                else if (relCoords[1] > $('svg').height() - vue.panBoundary) {
                    direction = 'down';
                    panSpeed = relCoords[1] - $('svg').height() + vue.panBoundary;
                }
                else {
                    clearTimeout(vue.panTimer);
                }
                if (direction !== null) {
                    panSpeed = d3.min([1000, panSpeed]);
                    vue.pan(direction, panSpeed / 10);
                }
                d.x0 += d3.event.dy;
                d.y0 += d3.event.dx;
                const node = d3.select(this);
                node.attr('transform', `translate(${d.y0}, ${d.x0})`);
                vue.updateTempConnector();
            })
            // 拖拽结束
            .on('end', function(d) {
                if (d === vue.root || vue.draggingNode === null) {
                    return;
                }
                if (vue.selectedNode) {
                    // 将节点从父节点上摘除，挂载到新节点上
                    const index = vue.draggingNode.parent.children.indexOf(vue.draggingNode);
                    if (index > -1) {
                        vue.draggingNode.parent.children.splice(index, 1);
                        if (!vue.draggingNode.parent.children.length) {
                            delete vue.draggingNode.parent.children;
                        }
                    }
                    if (vue.selectedNode.children) {
                        vue.selectedNode.children.push(vue.draggingNode);
                    }
                    else if (vue.selectedNode._children) {
                        vue.selectedNode._children.push(vue.draggingNode);
                    }
                    else {
                        vue.selectedNode.children = [];
                        vue.selectedNode.children.push(vue.draggingNode);
                    }
                    vue.draggingNode.parent = vue.selectedNode;
                    // 更新Node信息
                    vue.updateHierarchy();
                    vue.expand(vue.selectedNode);
                    vue.sortTree();
                }
                clearTimeout(vue.panTimer);
                vue.dragEnd(vue.draggingNode.parent, this);
            });
        this.svgGroup = this.baseSvg.append('g');
        this.data = venue_data;
        this.hierarchy();
        this.update(this.root);
        this.zoomListener.scaleTo(this.baseSvg, 2);
        this.centerNode(this.root);
    },
    methods: {
        updateHierarchy: function() {
            const update = function(d, depth) {
                d.depth = depth;
                const children = d.children || d._children;
                if (children && children.length) {
                    d.height = d3.max(children.map(function(child) {
                        return update(child, depth + 1);
                    })) + 1;
                }
                else {
                    d.height = 0;
                }
                return d.height;
            };
            update(this.root, 0);
        },
        // 排序树，按节点相对父节点的极坐标夹角排序
        sortTree: function() {
            this.root.sort(function(a, b) {
                const ax = a.x0 - a.parent.x0;
                const ay = Math.abs(a.y0 - a.parent.y0);
                const bx = b.x0 - b.parent.x0;
                const by = Math.abs(b.y0 - b.parent.y0);
                return (ax / ay) - (bx / by);
            });
        },
        // 镜头移动：当拖动元素到达边界区时
        pan: function(direction, panSpeed) {
            clearTimeout(this.panTimer);
            const vue = this;
            let dx = 0,
                dy = 0;
            switch (direction) {
                case 'left':
                    dx = +panSpeed;
                    break;
                case 'right':
                    dx = -panSpeed;
                    break;
                case 'up':
                    dy = +panSpeed;
                    break;
                case 'down':
                    dy = -panSpeed;
                    break;
                default:
                    break;
            }
            this.zoomListener.translateBy(this.baseSvg.transition().duration(50), dx, dy);
            this.panTimer = setTimeout(function() {
                vue.pan(direction, panSpeed);
            }, 50);
        },
        // 添加选中节点到拖拽节点的临时连线
        updateTempConnector: function() {
            let data = [];
            if (this.draggingNode !== null && this.selectedNode !== null) {
                data = [{
                    source: {
                        'x': this.selectedNode.x0,
                        'y': this.selectedNode.y0
                    },
                    target: {
                        'x': this.draggingNode.x0,
                        'y': this.draggingNode.y0
                    }
                }];
            }
            const link = this.svgGroup.selectAll('.tempLink').data(data);
            // Enter
            link.enter()
                .append('path')
                .attr('class', 'tempLink')
                .attr('d', this.linkGenerator)
                .attr('pointer-events', 'none');
            // Update
            link.attr('d', this.linkGenerator);
            // Exit
            link.exit()
                .remove();
        },
        // 计算层次化数据，供布局函数使用
        hierarchy: function() {
            this.root = d3.hierarchy(this.data);
            // 设置根节点初始坐标
            this.root.x0 = 0;
            this.root.y0 = 0;
        },
        // 展开节点
        expand: function(d) {
            if (d._children) {
                d.children = d._children;
                delete d._children;
            }
        },
        // 初始化拖动事件
        dragStart: function(d, domNode) {
            const vue = this;
            this.draggingNode = d;
            // 阻止拖拽节点的交互圈鼠标事件
            d3.select(domNode).select('.ghostCircle')
                .attr('pointer-events', 'none');
            // 添加交互圈show class
            d3.selectAll('.ghostCircle')
                .attr('class', 'ghostCircle show');
            // 添加拖拽节点的activeDrag class
            domNode.classList.add('activeDrag');
            // 将不是选中节点的节点下放
            this.svgGroup.selectAll('g.node')
                .sort(function(a) {
                    if (a.id !== vue.draggingNode.id) {
                        return 1;
                    }
                    return -1;
                });
            // 如果选中节点有子节点，删除边和节点
            if (this.dragNodes.length > 1) {
                // 删除边
                const links = d.links();
                this.svgGroup.selectAll('path.link')
                    .data(links, function(link) {
                        return link.target.id;
                    })
                    .remove();
                // 删除点
                this.svgGroup.selectAll('g.node')
                    .data(this.dragNodes.slice(1), function(node) {
                        return node.id;
                    })
                    .remove();
            }
            // 删除到父节点的连线
            this.svgGroup.selectAll('path.link')
                .filter(function(link) {
                    if (link.target.id === vue.draggingNode.id) {
                        return true;
                    }
                    return false;
                })
                .remove();
            this.dragStarted = null;
        },
        dragEnd: function(d, domNode) {
            this.selectedNode = null;
            // 去除交互圈show class
            d3.selectAll('.ghostCircle')
                .attr('class', 'ghostCircle');
            // 去除选中节点的activeDrag class
            domNode.classList.remove('activeDrag');
            // 恢复鼠标事件
            d3.select(domNode).select('.ghostCircle')
                .attr('pointer-events', '');
            this.updateTempConnector();
            if (this.draggingNode !== null) {
                this.update(d);
                this.centerNode(this.draggingNode);
                this.draggingNode = null;
            }
        },
        nodeClick: function(d) {
            if (d3.event.defaultPrevented) {
                return;
            }
            if (d.children || d._children) {
                if (d.children) {
                    d._children = d.children;
                    delete d.children;
                }
                else {
                    d.children = d._children;
                    delete d._children;
                }
                this.update(d);
                this.centerNode(d);
            }
        },
        // 移动到交互圈内
        ghostOver: function(node) {
            this.selectedNode = node;
            this.updateTempConnector();
        },
        // 移动出交互圈
        ghostOut: function() {
            this.selectedNode = null;
            this.updateTempConnector();
        },
        // 更新树数据
        updateData: function() {
            this.data = this.generateJSON(this.root);
            this.hierarchy();
        },
        // 更新树显示
        update: function(source) {
            // 保存外部this
            const vue = this;
            // 获取节点数组和边数组
            const nodes = vue.root.descendants();
            const links = vue.root.links();
            // 计算最大标签长度
            const labelLength = [];
            nodes.forEach(function(d) {
                labelLength.push((d.data.name || d.data.type).length);
            });
            const maxLabelLength = d3.max(labelLength);
            // 配置树布局产生器，节点高度根据最大标签长度计算，宽度固定为25像素
            const tree = d3.tree()
                .nodeSize([25, maxLabelLength * 8]);
            // 布局
            this.root = tree(this.root);
            /* 绘制节点 */
            const node = this.svgGroup.selectAll('g.node')
                .data(nodes, function(d) {
                    return d.id || (d.id = ++vue.index);
                });
            // Enter
            const nodeEnter = node.enter()
                .append('g')
                .call(this.dragListener)
                .attr('class', function(d) {
                    return `node ${d.data.type}`;
                })
                .attr('transform', function() {
                    return `translate(${source.y0}, ${source.x0})`;
                })
                .on('dblclick', this.nodeClick);
            // 绘制初始节点
            nodeEnter.append('circle')
                .attr('r', 0);
            // 绘制初始文字
            nodeEnter.append('text')
                .style('fill-opacity', 0)
                .text(function(d) {
                    return d.data.name || d.data.type;
                });
            // 绘制交互圈
            nodeEnter.filter(function(d) {
                return d.data.type !== 'content';
            })
                .append('circle')
                .attr('class', 'ghostCircle')
                .attr('r', 40)
                .attr('pointer-events', 'mouseover')
                .on('mouseover', this.ghostOver)
                .on('mouseout', this.ghostOut);
            // Update
            let nodeUpdate = nodeEnter.merge(node)
                .classed('collapsed', function(d) {
                    return d._children;
                });
            // 立即更新文字位置
            nodeUpdate.select('text')
                .attr('x', function(d) {
                    return d.children || d._children ? -8 : 8;
                })
                .attr('dy', function(d) {
                    return d.children || d._children ? -3.5 : 8.5;
                })
                .attr('class', function(d) {
                    return d.children || d._children ? 'internal' : 'leaf';
                });
            nodeUpdate = nodeUpdate.transition()
                .duration(this.duration)
                .attr('transform', function(d) {
                    return `translate(${d.y}, ${d.x})`;
                });
            // 调整节点大小
            nodeUpdate.select('circle')
                .attr('r', 5);
            // 调整文字透明度
            nodeUpdate.select('text')
                .style('fill-opacity', 1);
            // Exit
            const nodeExit = node.exit()
                .transition()
                .duration(this.duration)
                .attr('transform', function() {
                    return `translate(${source.y}, ${source.x})`;
                })
                .remove();
            // 缩小节点
            nodeExit.select('circle')
                .attr('r', 0);
            // 隐藏文字
            nodeExit.select('text')
                .style('fill-opacity', 0);

            /* 绘制边 */
            const link = this.svgGroup.selectAll('path.link')
                .data(links, function(d) {
                    return d.target.id;
                });
            // Enter
            const linkEnter = link.enter()
                .insert('path', 'g')
                .attr('class', 'link')
                .attr('d', function() {
                    const pos = {
                        'x': source.x0,
                        'y': source.y0
                    };
                    return vue.linkGenerator({
                        'source': pos,
                        'target': pos
                    });
                });
            // Update
            linkEnter.merge(link)
                .transition()
                .duration(this.duration)
                .attr('d', this.linkGenerator);
            // Exit
            link.exit()
                .transition()
                .duration(this.duration)
                .attr('d', function() {
                    const pos = {
                        'x': source.x,
                        'y': source.y
                    };
                    return vue.linkGenerator({
                        'source': pos,
                        'target': pos
                    });
                })
                .remove();
            // 保存当前坐标
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },
        // 将节点居中显示
        centerNode: function(node) {
            this.zoomListener.translateTo(this.baseSvg.transition().duration(this.duration), node.y0, node.x0);
        },
        // 缩放平移变换事件
        zoom: function() {
            this.svgGroup.attr('transform', d3.event.transform);
        },
        // 根据当前布局数据生成对应的JSON Object
        generateJSON: function(d) {
            const vue = this;
            const result = {};
            Object.assign(result, d.data);
            const children = d.children || d._children;
            if (children) {
                result.children = [];
                children.forEach(function(child) {
                    result.children.push(vue.generateJSON(child));
                });
            }
            return result;
        }
    }
};

</script>

<style lang="stylus">
.overlay
    background-color: #EEE
circle
    stroke-width: 1.5px
.content
    circle
        fill: #DFF0D8
        stroke: #5CB85C
.root
    circle
        fill: #DCB5FF
        stroke: #BE77FF
.pickone
    circle
        fill: #F2DEDE;
        stroke: #D9534F
.order
    circle
        fill: #D9EDF7;
        stroke: #5BC0DE
.exchangeable
    circle
        fill: #FCF8E3;
        stroke: #F0AD4E
.collapsed
    circle
        fill: #FFF
.node
    cursor: pointer
    text
        font: 10px sans-serif
        &.internal
            text-anchor: end
        &.leaf
            text-anchor: start
.link
    fill: none
    stroke: #555
    stroke-width: 1.5px
    stroke-opacity: 0.4
.tempLink
    fill: none
    stroke: red
    stroke-width: 3px
    stroke-opacity: 0.5
.ghostCircle
    &.show
        opacity: 0.2
        display: block
    display: none
.activeDrag
    .ghostCircle
        display: none
</style>
