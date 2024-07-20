import React, { useEffect } from 'react';
import * as d3 from 'd3';

const VectorGraphic = () => {
  useEffect(() => {
    // Set up the SVG canvas dimensions
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Remove the previous SVG if it exists
    d3.select('#vectorGraphic').select('svg').remove();

    // Create the SVG canvas
    const svg = d3.select('#vectorGraphic')
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

    // Define the vector
    const vector = { x: 3, y: 2 };

    // Add the vector as an arrow
    const arrow = svg.append('line')
      .attr('x1', xScale(0))
      .attr('y1', yScale(0))
      .attr('x2', xScale(vector.x))
      .attr('y2', yScale(vector.y))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    // Define the arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'blue');

    // Add a circle to the end of the vector
    const circle = svg.append('circle')
      .attr('cx', xScale(vector.x))
      .attr('cy', yScale(vector.y))
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    // Animate the vector and circle
    arrow.attr('x2', xScale(0))
      .attr('y2', yScale(0))
      .transition()
      .duration(2000)
      .attr('x2', xScale(vector.x))
      .attr('y2', yScale(vector.y));

    circle.attr('cx', xScale(0))
      .attr('cy', yScale(0))
      .transition()
      .duration(2000)
      .attr('cx', xScale(vector.x))
      .attr('cy', yScale(vector.y));

  }, []);

  return (
    <div id="vectorGraphic" className="w-full h-full flex justify-center items-center bg-black p-6">
      <svg width="100%" height="100%"></svg>
    </div>
  );
};

export default VectorGraphic;
