import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';

const PartialDerivative3DGraphic = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: -20, y: 30 });
  const [isRotating, setIsRotating] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const updateDimensions = useCallback(() => {
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
      setIsSmallScreen(width < 768); // Adjust this breakpoint as needed
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const debouncedResize = debounce(updateDimensions, 250);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [updateDimensions]);

  const f = useCallback((x, y) => Math.sin(Math.PI * x) * Math.cos(Math.PI * y), []);

  const generateData = useCallback((density) => {
    const data = [];
    for (let x = -1; x <= 1; x += 1 / density) {
      const line = [];
      for (let y = -1; y <= 1; y += 1 / density) {
        line.push([x, y, f(x, y)]);
      }
      data.push(line);
    }
    return data;
  }, [f]);

  const lowResData = useMemo(() => generateData(20), [generateData]);
  const highResData = useMemo(() => generateData(40), [generateData]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear().domain([-1, 1]).range([-width / 2, width / 2]);
    const yScale = d3.scaleLinear().domain([-1, 1]).range([-height / 2, height / 2]);
    const zScale = d3.scaleLinear().domain([-1, 1]).range([-150, 150]);

    // Create color scale
    const colorScale = d3.scaleSequential(d3.interpolatePlasma)
      .domain([-1, 1]);

    // Create 3D projection
    const project = (d) => {
      const scale = 0.7;
      let x = xScale(d[0]) * scale;
      let y = yScale(d[1]) * scale;
      let z = zScale(d[2]) * scale;

      const cos = Math.cos;
      const sin = Math.sin;
      const rx = rotation.x * Math.PI / 180;
      const ry = rotation.y * Math.PI / 180;

      const x1 = cos(ry) * x - sin(ry) * z;
      const y1 = sin(rx) * sin(ry) * x + cos(rx) * y + sin(rx) * cos(ry) * z;
      const z1 = cos(rx) * sin(ry) * x - sin(rx) * y + cos(rx) * cos(ry) * z;

      return [x1 + width / 2, y1 + height / 2, z1];
    };

    // Create line generator
    const line = d3.line()
      .x(d => project(d)[0])
      .y(d => project(d)[1]);

    // Draw surface
    const drawSurface = (data) => {
      svg.selectAll('.surface-line').remove();
      svg.selectAll('.surface-line')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'surface-line')
        .attr('d', line)
        .attr('stroke', d => colorScale(d[0][2]))
        .attr('stroke-width', 1.5)
        .attr('fill', 'none');
    };

    // Initial draw with high-res data
    drawSurface(highResData);

    // Add axes
    const drawAxis = (start, end, color, label) => {
      const [x1, y1] = project(start);
      const [x2, y2] = project(end);
      
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', color)
        .attr('stroke-width', 2);

      // Add arrow
      const angle = Math.atan2(y2 - y1, x2 - x1);
      svg.append('path')
        .attr('d', `M${x2},${y2} L${x2 - 10 * Math.cos(angle - Math.PI / 6)},${y2 - 10 * Math.sin(angle - Math.PI / 6)} L${x2 - 10 * Math.cos(angle + Math.PI / 6)},${y2 - 10 * Math.sin(angle + Math.PI / 6)} Z`)
        .attr('fill', color);

      // Add label
      svg.append('text')
        .attr('x', x2 + 10 * Math.cos(angle))
        .attr('y', y2 + 10 * Math.sin(angle))
        .attr('fill', color)
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(label);
    };

    drawAxis([-1, 0, 0], [1, 0, 0], 'red', 'x');
    drawAxis([0, -1, 0], [0, 1, 0], 'green', 'y');
    drawAxis([0, 0, -1], [0, 0, 1], 'blue', 'z');

    // Function to draw partial derivative
    const drawPartialDerivative = (x0, y0) => {
      const h = 0.01;
      const z0 = f(x0, y0);

      const zx = f(x0 + h, y0);
      const slopeX = (zx - z0) / h;

      const zy = f(x0, y0 + h);
      const slopeY = (zy - z0) / h;

      svg.selectAll('.derivative-line, .derivative-text, .tangent-plane').remove();

      const [x1, y1, z1] = project([x0, y0, z0]);
      const [x2, y2, z2] = project([x0 + 0.2, y0, z0 + 0.2 * slopeX]);
      const [x3, y3, z3] = project([x0, y0 + 0.2, z0 + 0.2 * slopeY]);

      // Draw derivative lines
      svg.append('line')
        .attr('class', 'derivative-line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', 'red')
        .attr('stroke-width', 3);

      svg.append('line')
        .attr('class', 'derivative-line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x3)
        .attr('y2', y3)
        .attr('stroke', 'green')
        .attr('stroke-width', 3);

      // Draw tangent plane
      const planePath = d3.path();
      planePath.moveTo(x1, y1);
      planePath.lineTo(x2, y2);
      planePath.lineTo(x3, y3);
      planePath.closePath();

      svg.append('path')
        .attr('class', 'tangent-plane')
        .attr('d', planePath.toString())
        .attr('fill', 'rgba(255, 255, 255, 0.2)')
        .attr('stroke', 'white')
        .attr('stroke-width', 1);

      // Add text for partial derivatives
      svg.append('text')
        .attr('class', 'derivative-text')
        .attr('x', x1 + 10)
        .attr('y', y1 - 20)
        .text(`∂f/∂x = ${slopeX.toFixed(2)}`)
        .attr('fill', 'white')
        .attr('font-size', '14px');

      svg.append('text')
        .attr('class', 'derivative-text')
        .attr('x', x1 + 10)
        .attr('y', y1 - 40)
        .text(`∂f/∂y = ${slopeY.toFixed(2)}`)
        .attr('fill', 'white')
        .attr('font-size', '14px');
    };

    // Automatic animation for partial derivatives
    const animateDerivatives = () => {
      let t = 0;
      d3.timer((elapsed) => {
        t = (elapsed % 5000) / 5000; // Reset every 5 seconds
        const x = Math.cos(2 * Math.PI * t) * 0.8;
        const y = Math.sin(2 * Math.PI * t) * 0.8;
        drawPartialDerivative(x, y);
        return false; // Keep the timer running
      });
    };

    animateDerivatives();

    // Touch rotation for small screens and mouse rotation for larger screens
    const interactionLayer = svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

    if (isSmallScreen) {
      let lastX, lastY;
      
      interactionLayer
        .on('touchstart', (event) => {
          event.preventDefault();
          const touch = event.touches[0];
          lastX = touch.clientX;
          lastY = touch.clientY;
          setIsRotating(true);
        })
        .on('touchmove', (event) => {
          event.preventDefault();
          if (isRotating) {
            const touch = event.touches[0];
            const dx = touch.clientX - lastX;
            const dy = touch.clientY - lastY;
            setRotation(prev => ({
              x: prev.x + dy / 2,
              y: prev.y - dx / 2
            }));
            lastX = touch.clientX;
            lastY = touch.clientY;
          }
        })
        .on('touchend', () => {
          setIsRotating(false);
          drawSurface(highResData);
        });
    } else {
      interactionLayer
        .call(d3.drag()
          .on('start', () => setIsRotating(true))
          .on('drag', (event) => {
            setRotation(prev => ({
              x: prev.x + event.dy / 2,
              y: prev.y - event.dx / 2
            }));
          })
          .on('end', () => {
            setIsRotating(false);
            drawSurface(highResData);
          }));
    }

  }, [dimensions, currentPoint, rotation, f, lowResData, highResData, isRotating, isSmallScreen]);

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-black p-6">
      <div style={{ width: '100%', height: '0', paddingBottom: '75%', position: 'relative' }}>
        <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></svg>
      </div>
      <div className="text-white">
        {isSmallScreen ? 'Touch and drag to rotate. Partial derivatives are automatically animated.' : 'Move your mouse over the surface to see partial derivatives. Drag to rotate.'}
      </div>
    </div>
  );
};

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default PartialDerivative3DGraphic;