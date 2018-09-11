import * as d3 from 'd3';
import $ from 'jquery';
import states from '../states';
import centerNode from '../utils/centerNode';
import expand from '../utils/expand';
import linkGenerator from '../utils/linkGenerator';
import update from '../utils/update';
import zoomListener from './zoom';

let dragStarted;
let source;
let target;
let panTimer;

/**
 * 初始化拖动
 *
 * @param {*} d       拖动节点的Node
 * @param {*} domNode 拖动节点的DOM
 */
function dragStart(d, domNode) {
  const svgGroup = states.svgGroup;
  source = d;
  // 阻止拖拽节点的交互圈鼠标事件，添加拖拽节点的activeDrag class
  d3.select(domNode)
    .classed('activeDrag', true)
    .select('.ghostCircle')
    .attr('pointer-events', 'none');
  // 添加交互圈show class
  d3.selectAll('.ghostCircle')
    .attr('class', 'ghostCircle show');
  // 将不是选中节点的节点下放
  svgGroup.selectAll('g.node')
    .sort(function (a) {
      if (a.id !== source.id) {
        return 1;
      }
      return -1;
    });
  const dragNodes = source.descendants();
  // 如果选中节点有子节点，删除边和节点
  if (dragNodes.length > 1) {
    // 删除边
    const links = source.links();
    svgGroup.selectAll('path.link')
      .data(links, function (link) {
        return link.target.id;
      })
      .remove();
    // 删除点
    svgGroup.selectAll('g.node')
      .data(dragNodes.slice(1), function (node) {
        return node.id;
      })
      .remove();
  }
  // 删除到父节点的连线
  svgGroup.selectAll('path.link')
    .filter(function (link) {
      if (link.target.id === source.id) {
        return true;
      }
      return false;
    })
    .remove();
  // 初始化完成
  dragStarted = undefined;
}

/**
 * 添加选中节点到拖拽节点的临时连线
 *
 */
function updateTempConnector () {
  let data = [];
  if (source !== undefined && target !== undefined) {
    data = [{
      source: {
        x: target.x0,
        y: target.y0
      },
      target: {
        x: source.x0,
        y: source.y0
      }
    }];
  }
  const link = states.svgGroup.selectAll('.tempLink').data(data);
  // Enter
  link.enter()
    .append('path')
    .attr('class', 'tempLink')
    .attr('d', linkGenerator)
    .attr('pointer-events', 'none');
  // Update
  link.attr('d', linkGenerator);
  // Exit
  link.exit()
    .remove();
}

// 镜头移动：当拖动元素到达边界区时
function pan(direction, panSpeed) {
  clearTimeout(panTimer);
  let dx = 0;
  let dy = 0;
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
  states.baseSvg.transition()
    .duration(50)
    .call(zoomListener.translateBy, dx, dy);
  panTimer = setTimeout(function () {
    pan(direction, panSpeed);
  }, 50);
}

function dragEnd(domNode) {
  target = undefined;
  // 去除交互圈show class
  d3.selectAll('.ghostCircle')
    .attr('class', 'ghostCircle');
  // 恢复鼠标事件，去除选中节点的activeDrag class
  d3.select(domNode)
    .classed('activeDrag', false)
    .select('.ghostCircle')
    .attr('pointer-events', '');
  updateTempConnector();
  if (source !== undefined) {
    update(source.parent);
    centerNode(source);
    source = undefined;
  }
}

/**
 * 移入交互圈
 *
 * @param {*} d 交互圈节点
 */
function ghostOver(d) {
  target = d;
  updateTempConnector();
}

/**
 * 移出交互圈
 *
 */
function ghostOut() {
  target = undefined;
  updateTempConnector();
}

export { ghostOver, ghostOut };

const drag = d3.drag()
  // 拖拽开始
  .on('start', function () {
    // 准备初始化拖拽
    dragStarted = true;
    // 阻止事件传播 https://stackoverflow.com/questions/10095979/d3-click-and-drag-event-nesting
    d3.event.sourceEvent.stopPropagation();
  })
  // 拖拽中
  .on('drag', function (d) {
    const panBoundary = states.panBoundary;
    // 初始化拖拽
    if (dragStarted) {
      dragStart(d, this);
    }
    // 处理镜头移动
    const relCoords = d3.mouse($('#d3-tree-overlay').get(0));

    let direction;
    let panSpeed;
    if (relCoords[0] < panBoundary) {
      direction = 'left';
      panSpeed = panBoundary - relCoords[0];
    }
    else if (relCoords[0] > $('#d3-tree-overlay').width() - panBoundary) {
      direction = 'right';
      panSpeed = relCoords[0] - $('#d3-tree-overlay').width() + panBoundary;
    }
    else if (relCoords[1] < panBoundary) {
      direction = 'up';
      panSpeed = panBoundary - relCoords[1];
    }
    else if (relCoords[1] > $('#d3-tree-overlay').height() - panBoundary) {
      direction = 'down';
      panSpeed = relCoords[1] - $('#d3-tree-overlay').height() + panBoundary;
    }
    else {
      clearTimeout(panTimer);
    }
    if (direction !== undefined) {
      panSpeed = d3.min([1000, panSpeed]);
      pan(direction, panSpeed / 10);
    }
    d.x0 += d3.event.dy;
    d.y0 += d3.event.dx;
    const node = d3.select(this);
    node.attr('transform', `translate(${d.y0}, ${d.x0})`);
    updateTempConnector();
  })
  // 拖拽结束
  .on('end', function () {
    const root = states.root;
    if (source === undefined) {
      return;
    }
    if (target) {
      // 将节点从父节点上摘除，挂载到新节点上
      const index = source.parent.children.indexOf(source);
      if (index > -1) {
        source.parent.children.splice(index, 1);
        if (!source.parent.children.length) {
          delete source.parent.children;
        }
      }
      expand(target);
      if (target.children) {
        target.children.push(source);
      }
      else {
        target.children = [source];
      }
      source.parent = target;
      // 按与父节点的夹角排序树
      root.sort(function(a, b) {
        const ax = a.x0 - a.parent.x0;
        const ay = Math.abs(a.y0 - a.parent.y0);
        const bx = b.x0 - b.parent.x0;
        const by = Math.abs(b.y0 - b.parent.y0);
        return (ax / ay) - (bx / by);
      });
    }
    clearTimeout(panTimer);
    dragEnd(this);
  });

export default drag;
