import * as d3 from 'd3';
import update from '../utils/update';
import centerNode from '../utils/centerNode';

export default function (d) {
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
    update(d);
    centerNode(d);
  }
}
