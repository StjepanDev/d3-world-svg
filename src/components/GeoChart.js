import React, { useRef, useEffect, useState } from 'react';
import { select, geoPath, geoMercator, min, max, scaleLinear } from 'd3';
import useResizeObserver from '../useResizeObserver';

function GeoChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const svg = select(svgRef.current);

    const minProp = min(
      data.features,
      (feature) => feature.properties[property]
    );
    const maxProp = max(
      data.features,
      (feature) => feature.properties[property]
    );
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(['#ccc', 'red']);

    //use resized dimensions or fall back  if no dimensions yet ..first render react thing
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const projection = geoMercator()
      .fitSize(
        [width, height], // projects geo coord from sphere 2  d2 plane

        selectedCountry || data
      )
      .precision(100);
    // console.log(selectedCountry);

    //takes geojson data,transforms that into the d attr of a path element
    const pathGenerator = geoPath().projection(projection);

    //general update patteren  renders countries:
    svg
      .selectAll('.country')
      .data(data.features)
      .join('path')
      .on('click', (e, d) => {
        setSelectedCountry(selectedCountry === d ? null : d);
      })
      .attr('class', 'country')
      .transition()
      .duration(1000)
      .attr('fill', (d) => colorScale(d.properties[property]))
      .attr('d', (d) => pathGenerator(d));

    //general update patteren  renders info text:
    svg
      .selectAll('.label')
      .data([selectedCountry])
      .join('text')
      .attr('class', 'label')
      .text(
        (d) =>
          d &&
          d.properties.name + ': ' + d.properties[property].toLocaleString()
      )
      .attr('x', 10)
      .attr('y', 25);
  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default GeoChart;
