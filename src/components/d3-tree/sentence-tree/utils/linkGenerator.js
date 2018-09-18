import * as d3 from 'd3';
const linkGenerator = d3.linkVertical()
  .x(function (d) {
    return d.x;
  })
  .y(function (d) {
    return d.y;
  });

export default linkGenerator;
