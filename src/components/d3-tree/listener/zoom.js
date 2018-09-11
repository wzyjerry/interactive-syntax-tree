import * as d3 from 'd3';
import states from '../states';
const zoomListener = d3.zoom()
  .scaleExtent([0.5, 4])
  .on('zoom', () => {
    states.svgGroup.attr('transform', d3.event.transform);
  });

export default zoomListener;
