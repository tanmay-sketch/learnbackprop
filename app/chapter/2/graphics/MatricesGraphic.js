import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const MatricesGraphic = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const aspectRatio = 4 / 3; // Desired aspect ratio (width / height)
        let newWidth = width;
        let newHeight = width / aspectRatio;

        if (newHeight > height) {
          newHeight = height;
          newWidth = height * aspectRatio;
        }

        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = dimensions.width;
    const height = dimensions.height;

    // Remove the previous SVG if it exists
    d3.select(svgRef.current).selectAll('*').remove();

    // Create the SVG canvas
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
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
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('fill', 'rgba(0, 0, 0, 0.5)');

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
      .delay((d, i) => i * 100)
      .attr('x', d => xScale(d.col))
      .attr('y', d => yScale(d.row));

    labels.transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('x', d => xScale(d.col) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.row) + yScale.bandwidth() / 2);

  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-black p-6">
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default MatricesGraphic;
