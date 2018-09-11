/**
 * 展开节点
 *
 * @export
 * @param {*} d 节点
 */
export default function (d) {
  if (d._children) {
    d.children = d._children;
    delete d._children;
  }
}
