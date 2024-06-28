"use client";
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Plotly without SSR
const Plotly = dynamic(() => import('plotly.js-dist-min'), { ssr: false });

export default function Graph3D() {
  const plotRef = useRef(null);

  useEffect(() => {
    const plotDiv = plotRef.current;

    const loadPlotly = async () => {
      const Plotly = await import('plotly.js-dist-min');

      // Generate data for the surface plot
      const size = 50;
      const x = Array.from({ length: size }, (_, i) => (i - size / 2) / 5);
      const y = Array.from({ length: size }, (_, i) => (i - size / 2) / 5);
      const z = x.map(xVal => y.map(yVal => xVal ** 2 + yVal ** 2)); // example loss function

      const surfaceData = {
        z: z,
        x: x,
        y: y,
        type: 'surface',
        colorscale: 'Blues',
        opacity: 0.8, // Make the surface a little transparent
        showscale: false // Hide the color scale
      };

      // Optimization algorithms
      const init = [1.6, 1.6]; // initial x and y coordinates on the surface
      const learningRate = 0.1; // learning rate
      const epochs = 12; // number of iterations

      const vanillaGradientDescent = (init) => {
        let pts = [init];
        let losses = [init[0] ** 2 + init[1] ** 2];
        for (let i = 0; i < epochs; i++) {
          const grad = [2 * pts[i][0], 2 * pts[i][1]];
          const newX = pts[i][0] - learningRate * grad[0];
          const newY = pts[i][1] - learningRate * grad[1];
          pts.push([newX, newY]);
          losses.push(newX ** 2 + newY ** 2);
        }
        return { pts, losses };
      };

      const momentumInit = [1.6, -1.6];
      const momentumGradientDescent = (init, momentum = 0.9) => {
        let pts = [momentumInit];
        let losses = [momentumInit[0] ** 2 + momentumInit[1] ** 2];
        let v = [0, 0];
        for (let i = 0; i < epochs; i++) {
          const grad = [2 * pts[i][0], 2 * pts[i][1]];
          v = [momentum * v[0] - learningRate * grad[0], momentum * v[1] - learningRate * grad[1]];
          const newX = pts[i][0] + v[0];
          const newY = pts[i][1] + v[1];
          pts.push([newX, newY]);
          losses.push(newX ** 2 + newY ** 2);
        }
        return { pts, losses };
      };

      const sgdInit = [0, -1.8];
      const sgd = (init, beta = 0.9, epsilon = 1e-8) => {
        let pts = [sgdInit];
        let losses = [sgdInit[0] ** 2 + sgdInit[1] ** 2];
        for (let i = 0; i < epochs; i++) {
          const grad = [2 * pts[i][0], 2 * pts[i][1]];
          const newX = pts[i][0] - learningRate * grad[0];
          const newY = pts[i][1] - learningRate * grad[1];
          pts.push([newX, newY]);
          losses.push(newX ** 2 + newY ** 2);
        }
        return { pts, losses };
      };

      const vanillaPath = vanillaGradientDescent([...init]);
      const momentumPath = momentumGradientDescent([...init]);
      const sgdPath = sgd([...init]);

      const pathData = [
        {
          type: 'scatter3d',
          mode: 'lines+markers',
          x: vanillaPath.pts.map(p => p[0]),
          y: vanillaPath.pts.map(p => p[1]),
          z: vanillaPath.losses,
          marker: { size: 4 },
          line: { width: 4 },
          name: 'Vanilla Gradient Descent',
          showlegend: false
        },
        {
          type: 'scatter3d',
          mode: 'lines+markers',
          x: momentumPath.pts.map(p => p[0]),
          y: momentumPath.pts.map(p => p[1]),
          z: momentumPath.losses,
          marker: { size: 4 },
          line: { width: 4 },
          name: 'Momentum Gradient Descent',
          showlegend: false
        },
        {
          type: 'scatter3d',
          mode: 'lines+markers',
          x: sgdPath.pts.map(p => p[0]),
          y: sgdPath.pts.map(p => p[1]),
          z: sgdPath.losses,
          marker: { size: 4 },
          line: { width: 4 },
          name: 'SGD',
          showlegend: false
        }
      ];

      const layout = {
        autosize: true,
        scene: {
          aspectmode: 'cube',
          xaxis: { range: [-2, 2], visible: false, showgrid: false, zeroline: false, showline: false, showticklabels: false },
          yaxis: { range: [-2, 2], visible: false, showgrid: false, zeroline: false, showline: false, showticklabels: false },
          zaxis: { range: [0, 10], visible: false, showgrid: false, zeroline: false, showline: false, showticklabels: false }
        },
        paper_bgcolor: 'rgba(0,0,0,0)', // Transparent background
        plot_bgcolor: 'rgba(0,0,0,0)', // Transparent background
        margin: { l: 0, r: 0, b: 0, t: 0, pad: 10 }
      };

      const config = {
        displayModeBar: false // Hide the mode bar
      };

      Plotly.newPlot(plotDiv, [surfaceData, ...pathData], layout, config);

      const handleResize = () => {
        if (plotDiv && plotDiv.offsetParent !== null) {
          Plotly.Plots.resize(plotDiv);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    loadPlotly();
  }, []);

  return <div ref={plotRef} className="w-full h-[600px] flex items-center justify-center z-10" />;
}
