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
      const z = x.map(xVal => y.map(yVal => Math.sin(xVal) * Math.cos(yVal)));

      const data = [{
        z: z,
        x: x,
        y: y,
        type: 'surface',
        colorscale: 'Viridis',
        showscale: false // Hide the color scale
      }];

      const layout = {
        autosize: true,
        scene: {
          aspectmode: 'cube',
          xaxis: { visible: false, showgrid: false, zeroline: false, showline: false, showticklabels: false },
          yaxis: { visible: false, showgrid: false, zeroline: false, showline: false, showticklabels: false },
          zaxis: { visible: false, showgrid: false, zeroline: false, showline: false, showticklabels: false }
        },
        paper_bgcolor: 'rgba(0,0,0,0)', // Transparent background
        plot_bgcolor: 'rgba(0,0,0,0)', // Transparent background
        margin: { l: 0, r: 0, b: 0, t: 0 }
      };

      const config = {
        displayModeBar: false // Hide the mode bar
      };

      Plotly.newPlot(plotDiv, data, layout, config);

      const handleResize = () => {
        Plotly.Plots.resize(plotDiv);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        Plotly.purge(plotDiv);
      };
    };

    loadPlotly();
  }, []);

  return <div ref={plotRef} className="w-full h-[600px] flex items-center justify-center" />;
}
