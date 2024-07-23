import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const VectorGraphic = () => {
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
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define the scales
    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([height - margin.top - margin.bottom, 0]);

    // Add the X and Y axes
    g.append('g')
      .attr('transform', `translate(0,${yScale(0)})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .attr('color', 'white');

    g.append('g')
      .attr('transform', `translate(${xScale(0)},0)`)
      .call(d3.axisLeft(yScale).ticks(10))
      .attr('color', 'white');

    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .text('X-axis');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .text('Y-axis');

    // Define the vector
    const vector = { x: 3, y: 2 };

    // Add the vector as an arrow
    const arrow = g.append('line')
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
    const circle = g.append('circle')
      .attr('cx', xScale(vector.x))
      .attr('cy', yScale(vector.y))
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    // Add text for vector coordinates
    g.append('text')
      .attr('x', xScale(vector.x) + 5)
      .attr('y', yScale(vector.y) - 5)
      .attr('fill', 'white')
      .text(`(${vector.x}, ${vector.y})`);

    // Add text for vector label
    g.append('text')
      .attr('x', xScale(vector.x * 0.5))
      .attr('y', yScale(vector.y * 0.5) - 10)
      .attr('fill', 'blue')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text('Vector');

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

  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-black p-6">
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
};

export default VectorGraphic;
