import * as d3 from 'd3';
import states from '../states';
import linkGenerator from './linkGenerator';

export default function (source, vue) {
  let root = states.root;
  const margin = states.margin;
  const height = states.baseSvg.node().clientHeight - (2 * margin);
  const width = states.baseSvg.node().clientWidth;
  const svgGroup = states.svgGroup.attr('transform', `translate(0, ${margin})`);
  const duration = states.duration;
  // 获取节点数组和边数组
  const nodes = root.descendants();
  const links = root.links();
  // 配置聚类布局产生器，节点宽度根据最大标签长度计算，高度固定为25像素
  const cluster = d3.cluster()
    .size([width, height]);
  // 布局
  root = cluster(root);
  /* 绘制节点 */
  const node = svgGroup.selectAll('g.node')
    .data(nodes, function (d) {
      return d.data.index;
    });
  // Enter
  const nodeEnter = node.enter()
    .append('g')
    .attr('transform', function () {
      return `translate(${source.x0}, ${source.y0})`;
    });
  // 绘制初始节点
  nodeEnter.append('circle')
    .attr('r', 0);
  // 绘制初始文字
  nodeEnter.append('text')
    .style('fill-opacity', 0);
  // 绘制intent
  nodeEnter.filter(function (d) {
    return d.parent === null;
  }).append('text')
    .text(`intent: ${states.data.children[0].intent}`)
    .attr('dy', -20)
    .attr('class', 'text');
  // Update
  let nodeUpdate = nodeEnter.merge(node)
    .attr('class', function (d) {
      return `node ${d.data.type}`;
    })
    .on('click', vue.sentenceClick);
  // 立即更新文字位置
  nodeUpdate.select('text')
    .text(function (d) {
      return d.data.text || d.data.name || d.data.type;
    })
    .attr('dy', function (d) {
      return d.children ? -8 : 16;
    })
    .attr('class', 'text');
  nodeUpdate = nodeUpdate.transition()
    .duration(duration)
    .attr('transform', function (d) {
      return `translate(${d.x}, ${d.y})`;
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
    .attr('transform', function () {
      return `translate(${source.x}, ${source.y})`;
    })
    .remove();
  // 缩小节点
  nodeExit.select('circle')
    .attr('r', 0);
  // 隐藏文字
  nodeExit.select('text')
    .style('fill-opacity', 0);

  /* 绘制边 */
  const link = svgGroup.selectAll('path.link')
    .data(links, function (d) {
      return d.target.data.index;
    });
  // Enter
  const linkEnter = link.enter()
    .insert('path', 'g')
    .attr('d', function () {
      const pos = {
        'x': source.x0,
        'y': source.y0
      };
      return linkGenerator({
        'source': pos,
        'target': pos
      });
    });
  // Update
  linkEnter.merge(link)
    .attr('class', function (d) {
      let flag = false;
      d.source.ancestors().forEach(pa => {
        flag |= pa.data.index === states.selectedNode;
      });
      return `link${flag ? ' selected' : ''}`;
    })
    .transition()
    .duration(duration)
    .attr('d', linkGenerator);
  // Exit
  link.exit()
    .transition()
    .duration(duration)
    .attr('d', function () {
      const pos = {
        'x': source.x,
        'y': source.y
      };
      return linkGenerator({
        'source': pos,
        'target': pos
      });
    })
    .remove();
}
