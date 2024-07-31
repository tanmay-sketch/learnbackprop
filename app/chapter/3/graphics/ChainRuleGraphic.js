import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ChainRuleGraphic = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [x, setX] = useState(Math.PI / 4);
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
      .domain([-Math.PI, Math.PI])
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-1.5, 1.5])
      .range([height - margin.top - margin.bottom, 0]);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${yScale(0)})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .attr('color', 'white');

    g.append('g')
      .attr('transform', `translate(${xScale(0)},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .attr('color', 'white');

    // Add labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom / 3)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '16px')
      .text('x');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', margin.left / 3)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '16px')
      .text('y');

    const drawFunction = (func, color, label) => {
      const line = d3.line()
        .x(d => xScale(d))
        .y(d => yScale(func(d)))
        .curve(d3.curveMonotoneX);

      const points = d3.range(-Math.PI, Math.PI, 0.1);

      g.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line);

      g.append('text')
        .attr('x', xScale(Math.PI - 0.5))
        .attr('y', yScale(func(Math.PI - 0.5)))
        .attr('fill', color)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(label);
    };

    const gFunc = x => Math.sin(x);
    const f = x => x * x;
    const composite = x => f(gFunc(x));

    drawFunction(gFunc, 'blue', 'g(x) = sin(x)');
    drawFunction(composite, 'red', 'f(g(x)) = sin²(x)');

    // Visualization of chain rule at point x
    const gx = gFunc(x);
    const fgx = composite(x);

    // Draw points
    const drawPoint = (x, y, color, label) => {
      g.append('circle')
        .attr('cx', xScale(x))
        .attr('cy', yScale(y))
        .attr('r', 4)
        .attr('fill', color);

      g.append('text')
        .attr('x', xScale(x) + 10)
        .attr('y', yScale(y) - 10)
        .attr('fill', color)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(label);
    };

    drawPoint(x, gx, 'yellow', 'A');
    drawPoint(x, fgx, 'orange', 'B');

    // Draw tangent lines
    const drawTangentLine = (x, y, slope, color, length = 0.5) => {
      const x1 = x - length / 2;
      const x2 = x + length / 2;
      const y1 = y - slope * length / 2;
      const y2 = y + slope * length / 2;

      g.append('line')
        .attr('x1', xScale(x1))
        .attr('y1', yScale(y1))
        .attr('x2', xScale(x2))
        .attr('y2', yScale(y2))
        .attr('stroke', color)
        .attr('stroke-width', 2);
    };

    // Draw tangent for g(x)
    const gSlope = Math.cos(x);
    drawTangentLine(x, gx, gSlope, 'yellow', 1);

    // Draw tangent for f(g(x))
    const fgSlope = 2 * gx * gSlope;
    drawTangentLine(x, fgx, fgSlope, 'orange', 1);

    // Explanation text
    const addExplanationText = (text, yOffset, color) => {
      g.append('text')
        .attr('x', xScale(-Math.PI + 0.2))
        .attr('y', yScale(yOffset))
        .attr('fill', color)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(text);
    };

    addExplanationText("Chain Rule:", 1.4, 'white');
    addExplanationText("1. g(x) = sin(x) [blue]", 1.2, 'blue');
    addExplanationText("2. f(g(x)) = sin²(x) [red]", 1.0, 'red');
    addExplanationText("3. A: (x, g(x)) [yellow]", 0.8, 'yellow');
    addExplanationText("4. B: (x, f(g(x))) [orange]", 0.6, 'orange');
    addExplanationText(`d/dx [f(g(x))] = f'(g(x)) * g'(x)`, -1.0, 'white');
    addExplanationText(`= 2sin(${x.toFixed(2)}) * cos(${x.toFixed(2)})`, -1.2, 'white');
    addExplanationText(`= ${(2 * Math.sin(x) * Math.cos(x)).toFixed(4)}`, -1.4, 'white');

  }, [dimensions, x]);

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-black p-6">
      <div style={{ width: '100%', height: '0', paddingBottom: '75%', position: 'relative' }}>
        <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></svg>
      </div>
      <div className="w-full flex flex-col items-center">
        <input
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step={0.01}
          value={x}
          onChange={(e) => setX(parseFloat(e.target.value))}
          className="w-full mt-4"
        />
        <p className="text-white mt-2">x = {x.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ChainRuleGraphic;