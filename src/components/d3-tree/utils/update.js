import * as d3 from 'd3';
import states from '../states';
import { default as dragListener, ghostOver, ghostOut } from '../listener/drag';
import { default as click, watchable } from '../listener/click';
import dblClick from '../listener/dblClick';
import linkGenerator from './linkGenerator';

/**
 * 重新计算节点的高度和深度
 *
 * @param {*} d 节点
 * @param {*} depth 节点深度
 * @returns
 */
function updateHierachy(d, depth) {
  d.depth = depth;
  const children = d.children || d._children;
  if (children && children.length) {
    d.height = 1 + d3.max(children.map(function (child) {
      return updateHierachy(child, depth + 1);
    }));
  }
  else {
    d.height = 0;
  }
  return d.height;
}

/**
 * 从source出发更新树显示
 *
 * @export
 * @param {*} source 出发节点，取(x0, y0)作为动画初始位置
 */
export default function (source) {
  let root = states.root;
  updateHierachy(root, 0);
  const svgGroup = states.svgGroup;
  const duration = states.duration;
  // 获取节点数组和边数组
  const nodes = root.descendants();
  const links = root.links();
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
  root = tree(root);
  // 删除选中点
  svgGroup.selectAll('g.node .selectCircle').remove();
  /* 绘制节点 */
  const node = svgGroup.selectAll('g.node')
    .data(nodes, function(d) {
      return d.id || (d.id = ++states.index);
    });
  // Enter
  const nodeEnter = node.enter()
    .append('g')
    .call(dragListener)
    .attr('transform', function() {
      return `translate(${source.y0}, ${source.x0})`;
    })
    .on('click', click)
    .on('dblclick', dblClick);
  // 绘制初始节点
  nodeEnter.append('circle')
    .attr('r', 0);
  // 绘制初始文字
  nodeEnter.append('text')
    .style('fill-opacity', 0);
  // 绘制交互圈
  nodeEnter.filter(function(d) {
    return d.data.type !== 'content' && d.data.type !== 'root';
  })
    .append('circle')
    .attr('class', 'ghostCircle')
    .attr('r', 40)
    .attr('pointer-events', 'mouseover')
    .on('mouseover', ghostOver)
    .on('mouseout', ghostOut);
  // Update
  let nodeUpdate = nodeEnter.merge(node)
    .attr('class', function(d) {
      return `node ${d.data.type}${d._children ? ' collapsed' : ''}`;
    });
  // 绘制选中点
  nodeUpdate.filter(function(d) {
    return d === watchable.selectedNode;
  }).append('circle')
    .attr('class', 'selectCircle')
    .attr('r', 0.75);
  // 删除部分点的拖动事件
  nodeUpdate.filter(function(d) {
    return d.data.type in {
      'root': 1,
      'holder': 2,
      'intent': 3
    };
  }).on('.drag', null);
  // 立即更新文字位置
  nodeUpdate.select('text')
    .text(function(d) {
      return d.data.name || d.data.intent || d.data.type;
    })
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
    .duration(duration)
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
    .duration(duration)
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
  /* 绘制提示线 */
  svgGroup.selectAll('path.tipLink').remove();
  const tipLink = svgGroup.selectAll('path.tipLink')
    .data(states.route, 0);
  const tipLinkEnter = tipLink.enter()
    .insert('path', 'g')
    .attr('class', 'tipLink')
    .attr('d', 'M0,0A0,0 0 0,1 0,0');
  tipLinkEnter.merge(tipLink)
    .attr('d', d3.line()
      .x(function (d) {
        return d[1];
      })
      .y(function (d) {
        return d[0];
      })
      .curve(d3.curveNatural))
    .attr('marker-mid', 'url(#arrow)')
    .attr('marker-end', 'url(#arrow)');
  if (tipLinkEnter.node()) {
    const length = tipLinkEnter.node().getTotalLength();
    tipLinkEnter.style('stroke-dasharray', length)
      .style('stroke-dashoffset', length)
      .style('animation', `dash ${length / 200}s infinite`);
    const rule = `@keyframes dash {
      0% {
        stroke-dashoffset: ${length};
      }
      100% {
        stroke-dashoffset: 0;
      }
    }`;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = rule;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  /* 绘制边 */
  const link = svgGroup.selectAll('path.link')
    .data(links, function(d) {
      return d.target.id;
    });
  // Enter
  const linkEnter = link.enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('d', function() {
      const pos = {
        x: source.x0,
        y: source.y0
      };
      return linkGenerator({
        source: pos,
        target: pos
      });
    });
  // Update
  linkEnter.merge(link)
    .transition()
    .duration(duration)
    .attr('d', linkGenerator);
  // Exit
  link.exit()
    .transition()
    .duration(duration)
    .attr('d', function() {
      const pos = {
        x: source.x,
        y: source.y
      };
      return linkGenerator({
        source: pos,
        target: pos
      });
    })
    .remove();
  // 保存当前坐标
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}
