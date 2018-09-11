import * as d3 from 'd3';
import update from '../utils/update';
import centerNode from '../utils/centerNode';

const callbacks = [];
function clickCallBack(fn) {
  callbacks.push(fn);
}

const watchable = {
  _selectedNode: undefined,
  get selectedNode() {
    return this._selectedNode;
  },
  set selectedNode(data) {
    this._selectedNode = data;
    callbacks.forEach(function (fn) {
      fn(data);
    });
    if (data !== undefined) {
      update(data);
      centerNode(data);
    }
  }
};

function unclick() {
  const node = watchable.selectedNode;
  watchable.selectedNode = undefined;
  update(node);
  centerNode(node);
}

export { clickCallBack, watchable, unclick };

export default function (d) {
  if (d3.event && d3.event.defaultPrevented) {
    return;
  }
  watchable.selectedNode = d;
}
