import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DotProductGraphic = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [vectorU, setVectorU] = useState({ x: 4, y: 2 });
  const [vectorV, setVectorV] = useState({ x: -2, y: 1 });
  const [step, setStep] = useState(0);
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

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
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

    // Function to draw a vector
    const drawVector = (vector, color, label) => {
      const arrow = g.append('line')
        .attr('x1', xScale(0))
        .attr('y1', yScale(0))
        .attr('x2', xScale(vector.x))
        .attr('y2', yScale(vector.y))
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('marker-end', `url(#arrow${label})`);

      g.append('text')
        .attr('x', xScale(Math.max(-4.5, Math.min(4.5, vector.x * 1.1))))
        .attr('y', yScale(Math.max(-4.5, Math.min(4.5, vector.y * 1.1))))
        .attr('fill', color)
        .text(label);

      return arrow;
    };

    // Define the arrowhead markers
    ['U', 'V', 'Proj'].forEach(label => {
      svg.append('defs').append('marker')
        .attr('id', `arrow${label}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', label === 'U' ? 'blue' : label === 'V' ? 'red' : 'green');
    });

    // Draw the vectors
    drawVector(vectorU, 'blue', 'u');
    drawVector(vectorV, 'red', 'v');

    // Function to update the graphic based on the current step
    const updateGraphic = () => {
      if (step >= 1) {
        // Show angle between vectors
        const angle = Math.acos((vectorU.x * vectorV.x + vectorU.y * vectorV.y) / 
          (Math.sqrt(vectorU.x * vectorU.x + vectorU.y * vectorU.y) * 
           Math.sqrt(vectorV.x * vectorV.x + vectorV.y * vectorV.y))) * (180 / Math.PI);

        g.append('text')
          .attr('x', xScale(3))
          .attr('y', yScale(4))
          .attr('fill', 'white')
          .text(`Angle: ${angle.toFixed(2)}°`)
          .style('opacity', 0)
          .transition()
          .duration(1000)
          .style('opacity', 1);
      }

      if (step >= 2) {
        // Show projection
        const dotProduct = vectorU.x * vectorV.x + vectorU.y * vectorV.y;
        const uMagnitudeSquared = vectorU.x * vectorU.x + vectorU.y * vectorU.y;
        const scalarProjection = dotProduct / Math.sqrt(uMagnitudeSquared);
        const projection = { 
          x: scalarProjection * (vectorU.x / Math.sqrt(uMagnitudeSquared)), 
          y: scalarProjection * (vectorU.y / Math.sqrt(uMagnitudeSquared)) 
        };

        const projectionLine = g.append('line')
          .attr('x1', xScale(vectorV.x))
          .attr('y1', yScale(vectorV.y))
          .attr('x2', xScale(vectorV.x))
          .attr('y2', yScale(vectorV.y))
          .attr('stroke', 'green')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,5');

        projectionLine.transition()
          .duration(1000)
          .attr('x2', xScale(projection.x))
          .attr('y2', yScale(projection.y));

        drawVector(projection, 'green', 'proj')
          .style('opacity', 0)
          .transition()
          .delay(1000)
          .duration(1000)
          .style('opacity', 1);
      }

      if (step >= 3) {
        // Show dot product
        const dotProduct = vectorU.x * vectorV.x + vectorU.y * vectorV.y;
        g.append('text')
          .attr('x', xScale(3))
          .attr('y', yScale(3))
          .attr('fill', 'white')
          .text(`Dot Product: ${dotProduct.toFixed(2)}`)
          .style('opacity', 0)
          .transition()
          .duration(1000)
          .style('opacity', 1);
      }
    };

    updateGraphic();

  }, [vectorU, vectorV, step, dimensions]);

  const handleVectorChange = (vector, component, value) => {
    const newValue = Math.max(-5, Math.min(5, parseInt(value, 10) || 0));
    const newVector = { ...vector, [component]: newValue };
    if (vector === vectorU) {
      setVectorU(newVector);
    } else {
      setVectorV(newVector);
    }
    setStep(0);  // Reset steps when vectors change
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <svg ref={svgRef} className="w-full h-auto max-h-[80vh]" />
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-white">u:</label>
          <input 
            type="number" 
            value={vectorU.x} 
            onChange={(e) => handleVectorChange(vectorU, 'x', e.target.value)} 
            className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
            min="-5"
            max="5"
            step="1"
          />
          <input 
            type="number" 
            value={vectorU.y} 
            onChange={(e) => handleVectorChange(vectorU, 'y', e.target.value)} 
            className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
            min="-5"
            max="5"
            step="1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-white">v:</label>
          <input 
            type="number" 
            value={vectorV.x} 
            onChange={(e) => handleVectorChange(vectorV, 'x', e.target.value)} 
            className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
            min="-5"
            max="5"
            step="1"
          />
          <input 
            type="number" 
            value={vectorV.y} 
            onChange={(e) => handleVectorChange(vectorV, 'y', e.target.value)} 
            className="w-16 bg-gray-700 text-white px-2 py-1 rounded"
            min="-5"
            max="5"
            step="1"
          />
        </div>
      </div>
      <button 
        onClick={() => setStep(prev => Math.min(prev + 1, 3))} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Next Step
      </button>
    </div>
  );
};

export default DotProductGraphic;