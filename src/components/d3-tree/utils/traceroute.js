function getLink(nodes) {
  const links = [];
  nodes.forEach(function(d, i, arr) {
    if (i > 0) {
      links.push({
        source: {
          x: arr[i - 1][0],
          y: arr[i - 1][1]
        },
        target: {
          x: d[0],
          y: d[1]
        }
      });
    }
  });
  return links;
}

export { getLink };

function traceroute(node, data, index, reach = false) {
  const reached = reach || (data.index === index);
  let route = [];
  if (reached) {
    route.push([node.x, node.y]);
    if (data.text !== undefined) {
      node.data.text = data.text;
    }
  }
  if (data.children !== undefined) {
    data.children.forEach(function(d_c) {
      node.children.forEach(function(n_c) {
        if (n_c.data.index === d_c.index) {
          route = route.concat(traceroute(n_c, d_c, index, reached));
        }
      });
    });
  }
  return route;
}

export default traceroute;
