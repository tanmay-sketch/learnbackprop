import React, { useEffect } from 'react';
import * as d3 from 'd3';

const MatricesGraphic = () => {
  useEffect(() => {
    // Set up the SVG canvas dimensions
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Remove the previous SVG if it exists
    d3.select('#matrixGraphic').select('svg').remove();

    // Create the SVG canvas
    const svg = d3.select('#matrixGraphic')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define the scales
    const xScale = d3.scaleBand()
      .domain(d3.range(3)) // 3 columns
      .range([0, width - margin.left - margin.right])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(d3.range(3)) // 3 rows
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);

    // Define the initial stacked data
    const initialData = [
      { initialIndex: 0, row: 0, col: 0, value: '0,0' },
      { initialIndex: 1, row: 1, col: 0, value: '1,0' },
      { initialIndex: 2, row: 2, col: 0, value: '2,0' },
      { initialIndex: 3, row: 0, col: 1, value: '0,1' },
      { initialIndex: 4, row: 1, col: 1, value: '1,1' },
      { initialIndex: 5, row: 2, col: 1, value: '2,1' },
      { initialIndex: 6, row: 0, col: 2, value: '0,2' },
      { initialIndex: 7, row: 1, col: 2, value: '1,2' },
      { initialIndex: 8, row: 2, col: 2, value: '2,2' },
    ];

    // Create the initial stacked elements
    const cells = svg.selectAll('rect')
      .data(initialData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(0))
      .attr('y', (d, i) => yScale(0) + i * yScale.bandwidth())
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', 'blue')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    // Add text labels to the stacked elements
    const labels = svg.selectAll('text')
      .data(initialData)
      .enter()
      .append('text')
      .attr('x', d => xScale(0) + xScale.bandwidth() / 2)
      .attr('y', (d, i) => yScale(0) + i * yScale.bandwidth() + yScale.bandwidth() / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.value)
      .style('fill', 'white')
      .style('font-size', '14px');

    // Animate the elements to their final positions in the matrix
    cells.transition()
      .duration(1000)
      .delay((d, i) => i * 500)
      .attr('x', d => xScale(d.col))
      .attr('y', d => yScale(d.row));

    labels.transition()
      .duration(1000)
      .delay((d, i) => i * 500)
      .attr('x', d => xScale(d.col) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.row) + yScale.bandwidth() / 2);

  }, []);

  return (
    <div id="matrixGraphic" className="w-full h-full flex justify-center items-center bg-black p-6">
      <svg width="100%" height="100%"></svg>
    </div>
  );
};

export default MatricesGraphic;
