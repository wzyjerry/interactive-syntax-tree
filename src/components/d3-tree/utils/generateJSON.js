
/**
 * 生成当前节点对应的Tree
 *
 * @param {*} d 节点
 */
function generateTree(d) {
  const result = {};
  Object.assign(result, d.data);
  for (const key in result) {
    if (result[key] === null || result[key] === undefined || result[key] === '') {
      delete result[key];
    }
  }
  const children = d.children || d._children;
  if (children) {
    result.children = [];
    children.forEach(function(child) {
      result.children.push(generateTree(child));
    });
  }
  return result;
}

export default function (d) {
  return JSON.stringify(generateTree(d));
}
