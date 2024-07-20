import React, { useEffect } from 'react';
import * as d3 from 'd3';

const DotProductGraphic = () => {
  useEffect(() => {
    // Set up the SVG canvas dimensions
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Remove the previous SVG if it exists
    d3.select('#dotProductGraphic').select('svg').remove();

    // Create the SVG canvas
    const svg = d3.select('#dotProductGraphic')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define the scales
    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([height - margin.top - margin.bottom, 0]);

    // Add the X and Y axes
    svg.append('g')
      .attr('transform', `translate(0,${yScale(0)})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${xScale(0)},0)`)
      .call(d3.axisLeft(yScale));

    // Define the vectors
    const u = { x: 3, y: 2 };
    const v = { x: -2, y: 1 };

    // Add the vectors as arrows
    const arrowU = svg.append('line')
      .attr('x1', xScale(0))
      .attr('y1', yScale(0))
      .attr('x2', xScale(u.x))
      .attr('y2', yScale(u.y))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowU)');

    const arrowV = svg.append('line')
      .attr('x1', xScale(0))
      .attr('y1', yScale(0))
      .attr('x2', xScale(v.x))
      .attr('y2', yScale(v.y))
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowV)');

    // Define the arrowhead markers
    svg.append('defs').append('marker')
      .attr('id', 'arrowU')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'blue');

    svg.append('defs').append('marker')
      .attr('id', 'arrowV')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'red');

    // Animate the vectors
    arrowU.attr('x2', xScale(0))
      .attr('y2', yScale(0))
      .transition()
      .duration(2000)
      .attr('x2', xScale(u.x))
      .attr('y2', yScale(u.y));

    arrowV.attr('x2', xScale(0))
      .attr('y2', yScale(0))
      .transition()
      .duration(2000)
      .attr('x2', xScale(v.x))
      .attr('y2', yScale(v.y));

  }, []);

  return (
    <div id="dotProductGraphic" className="w-full h-full flex justify-center items-center bg-black p-6">
      <svg width="100%" height="100%"></svg>
    </div>
  );
};

export default DotProductGraphic;
