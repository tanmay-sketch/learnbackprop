import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const VectorGraphic = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [vector, setVector] = useState({ x: 3, y: 2 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const aspectRatio = 4 / 3;
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

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = dimensions.width;
    const height = dimensions.height;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([height - margin.top - margin.bottom, 0]);

    g.append('g')
      .attr('transform', `translate(0,${yScale(0)})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .attr('color', 'white');

    g.append('g')
      .attr('transform', `translate(${xScale(0)},0)`)
      .call(d3.axisLeft(yScale).ticks(10))
      .attr('color', 'white');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom / 3)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '16px')
      .text('X-axis');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', margin.left / 3)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '16px')
      .text('Y-axis');

    const drawVector = (vector, color, label) => {
      g.append('line')
        .attr('x1', xScale(0))
        .attr('y1', yScale(0))
        .attr('x2', xScale(vector.x))
        .attr('y2', yScale(vector.y))
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('marker-end', `url(#arrow${label})`);

      g.append('text')
        .attr('x', xScale(vector.x) + 10)
        .attr('y', yScale(vector.y) - 10)
        .attr('fill', 'white')
        .text(`(${vector.x}, ${vector.y})`);
    };

    svg.append('defs').append('marker')
      .attr('id', 'arrowVector')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'blue');

    drawVector(vector, 'blue', 'Vector');

    g.append('circle')
      .attr('cx', xScale(vector.x))
      .attr('cy', yScale(vector.y))
      .attr('r', 4)
      .attr('fill', 'red');

  }, [vector, dimensions]);

  const handleVectorChange = (component, value) => {
    const newValue = Math.max(-5, Math.min(5, parseInt(value) || 0));
    setVector(prev => ({ ...prev, [component]: newValue }));
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-black p-6">
      <div style={{ width: '100%', height: '0', paddingBottom: '75%', position: 'relative' }}>
        <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></svg>
      </div>
      <div className="flex items-center space-x-2">
        <label className="text-white">Vector v:</label>
        <input 
          type="number" 
          value={vector.x} 
          onChange={(e) => handleVectorChange('x', e.target.value)} 
          className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
          min="-5"
          max="5"
          step="1"
        />
        <input 
          type="number" 
          value={vector.y} 
          onChange={(e) => handleVectorChange('y', e.target.value)} 
          className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
          min="-5"
          max="5"
          step="1"
        />
      </div>
    </div>
  );
};

export default VectorGraphic;