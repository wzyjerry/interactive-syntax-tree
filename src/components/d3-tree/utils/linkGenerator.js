import * as d3 from 'd3';
const linkGenerator = d3.linkHorizontal()
  .x(function (d) {
    return d.y;
  })
  .y(function (d) {
    return d.x;
  });

export default linkGenerator;
