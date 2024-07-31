import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DerivativesGraphic = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [functionType, setFunctionType] = useState('quadratic');
  const [step, setStep] = useState(0);
  const [deltaX, setDeltaX] = useState(1);
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

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = dimensions.width;
    const height = dimensions.height;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
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

    const drawFunction = (func, color, label) => {
      const line = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .curve(d3.curveMonotoneX);

      const points = d3.range(-5, 5.1, 0.1).map(x => [x, func(x)]);

      g.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line);

      addResponsiveText(label, 4.5, func(4.5), 12, color);
    };

    const functions = {
      quadratic: {
        f: x => x * x,
        derivative: x => 2 * x,
        label: 'f(x) = x²',
        derivativeLabel: "f'(x) = 2x"
      },
      sine: {
        f: x => Math.sin(x),
        derivative: x => Math.cos(x),
        label: 'f(x) = sin(x)',
        derivativeLabel: "f'(x) = cos(x)"
      },
      exponential: {
        f: x => Math.exp(x),
        derivative: x => Math.exp(x),
        label: 'f(x) = e^x',
        derivativeLabel: "f'(x) = e^x"
      }
    };

    const selectedFunction = functions[functionType];

    const addResponsiveText = (text, x, y, fontSize = 14, color = 'white') => {
      const scaleFactor = Math.min(width, height) / 400;
      g.append('text')
        .attr('x', xScale(x))
        .attr('y', yScale(y))
        .attr('fill', color)
        .attr('font-size', `${fontSize * scaleFactor}px`)
        .attr('font-weight', 'bold')
        .text(text);
    };

    const updateGraphic = () => {
      drawFunction(selectedFunction.f, '#4299E1', selectedFunction.label);

      if (step >= 1) {
        const x0 = 1;
        const y0 = selectedFunction.f(x0);
        const x1 = x0 + deltaX;
        const y1 = selectedFunction.f(x1);
        const slope = (y1 - y0) / (x1 - x0);

        const secantLine = x => slope * (x - x0) + y0;

        drawFunction(secantLine, '#48BB78', `Secant (Δx = ${deltaX.toFixed(2)})`);

        const addPoint = (x, y, label) => {
          g.append('circle')
            .attr('cx', xScale(x))
            .attr('cy', yScale(y))
            .attr('r', 3)
            .attr('fill', '#ECC94B');

          addResponsiveText(`${label}: (${x.toFixed(2)}, ${y.toFixed(2)})`, x + 0.2, y + 0.2, 10, '#ECC94B');
        };

        addPoint(x0, y0, 'x₀');
        addPoint(x1, y1, 'x₁');

        addResponsiveText(`Secant Slope = ${slope.toFixed(2)}`, -4.5, -3, 12);
      }

      if (step >= 2) {
        const x0 = 1;
        const y0 = selectedFunction.f(x0);
        const slope = selectedFunction.derivative(x0);

        const tangentLine = x => slope * (x - x0) + y0;

        drawFunction(tangentLine, '#F56565', `Tangent (derivative)`);

        addResponsiveText(`Derivative: ${selectedFunction.derivativeLabel}`, -4.5, -3.5, 12);
        addResponsiveText(`f'(${x0}) = ${slope.toFixed(2)}`, -4.5, -4, 12);

        addResponsiveText("As Δx → 0, secant → tangent", -4.5, 4, 12);
        addResponsiveText("Slope → derivative", -4.5, 3.5, 12);
      }
    };

    const xAxis = d3.axisBottom(xScale).ticks(Math.max(5, Math.floor(width / 100)));
    const yAxis = d3.axisLeft(yScale).ticks(Math.max(5, Math.floor(height / 60)));

    g.append('g')
      .attr('transform', `translate(0,${yScale(0)})`)
      .call(xAxis)
      .attr('color', 'white');

    g.append('g')
      .attr('transform', `translate(${xScale(0)},0)`)
      .call(yAxis)
      .attr('color', 'white');

    addResponsiveText('x', 0, -5.2, 14);
    addResponsiveText('y', -5.2, 0, 14);

    updateGraphic();

  }, [functionType, step, deltaX, dimensions]);

  const handleFunctionChange = (event) => {
    setFunctionType(event.target.value);
    setStep(0);
  };

  const handleDeltaXChange = (event) => {
    setDeltaX(parseFloat(event.target.value));
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-black p-4">
      <div className="w-full h-0 pb-[75%] relative">
        <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full"></svg>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
        <div className="flex items-center space-x-2">
          <label className="text-white text-sm">Function:</label>
          <select 
            value={functionType} 
            onChange={handleFunctionChange} 
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          >
            <option value="quadratic">x²</option>
            <option value="sine">sin(x)</option>
            <option value="exponential">e^x</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-white text-sm">Δx:</label>
          <input
            type="range"
            min="0.01"
            max="2"
            step="0.01"
            value={deltaX}
            onChange={handleDeltaXChange}
            className="w-24 sm:w-32"
          />
          <span className="text-white text-sm">{deltaX.toFixed(2)}</span>
        </div>
      </div>
      {step < 2 && (
        <button 
          onClick={() => setStep(prev => Math.min(prev + 1, 2))} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default DerivativesGraphic;
