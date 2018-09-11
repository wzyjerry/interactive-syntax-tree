import states from '../states';
import zoomListener from '../listener/zoom';
/**
 * 将节点居中并缩放到2倍显示
 *
 * @export
 * @param {*} node 节点
 */
export default function (node) {
  states.baseSvg.transition()
    .duration(states.duration)
    .call(zoomListener.translateTo, node.y0, node.x0)
    .transition()
    .call(zoomListener.scaleTo, 2);
}
