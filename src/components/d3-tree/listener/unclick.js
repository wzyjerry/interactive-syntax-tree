import states from '../states';
import update from '../utils/update';
import centerNode from '../utils/centerNode';

export default function (d) {
  states.selectedNode = null;
  update(d);
  centerNode(d);
}
