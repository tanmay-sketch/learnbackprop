"use client";
import React, { useEffect } from 'react';
import * as d3 from 'd3';

const MLPAnimation = () => {
  useEffect(() => {
    // Clear previous SVG if it exists
    d3.select("#mlp-animation").selectAll("*").remove();

    const svg = d3.select("#mlp-animation")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 800)
      .attr("viewBox", "0 0 1000 800")
      .attr("preserveAspectRatio", "xMidYMid meet");

    const layers = [3, 4, 2];  // 3 input neurons, 4 hidden neurons, 2 output neurons
    const layerDistance = 300;
    const neuronRadius = 40;

    // Add lines (weights) between neurons of adjacent layers
    const connections = [];
    layers.slice(1).forEach((layerSize, layerIndex) => {
      const prevLayerSize = layers[layerIndex];
      const yOffsetCurrent = (800 - (layerSize * (2 * neuronRadius + 50))) / 2;
      const yOffsetPrev = (800 - (prevLayerSize * (2 * neuronRadius + 50))) / 2;

      for (let i = 0; i < prevLayerSize; i++) {
        for (let j = 0; j < layerSize; j++) {
          const connection = svg.append("line")
            .attr("x1", layerIndex * layerDistance + 150)
            .attr("y1", yOffsetPrev + i * (2 * neuronRadius + 50) + neuronRadius)
            .attr("x2", (layerIndex + 1) * layerDistance + 150)
            .attr("y2", yOffsetCurrent + j * (2 * neuronRadius + 50) + neuronRadius)
            .attr("stroke", "white")
            .attr("stroke-width", 2);

          connections.push(connection);
        }
      }
    });

    // Create neurons for each layer
    const neurons = [];
    layers.forEach((layerSize, layerIndex) => {
      const yOffset = (800 - (layerSize * (2 * neuronRadius + 50))) / 2;

      for (let i = 0; i < layerSize; i++) {
        const neuron = svg.append("circle")
          .attr("cx", layerIndex * layerDistance + 150)
          .attr("cy", yOffset + i * (2 * neuronRadius + 50) + neuronRadius)
          .attr("r", neuronRadius + 2)  // Larger background circle to cover lines
          .attr("fill", "#C4B5FD")  // Light purple color
          .attr("stroke", "white")
          .attr("stroke-width", 1);

        neurons.push(neuron);
      }
    });

    // Animate the forward and backward pass
    const animate = () => {
      let forwardIndex = 0;
      let backwardIndex = connections.length - 1;

      const forwardPass = () => {
        if (forwardIndex < connections.length) {
          const connection = connections[forwardIndex];
          connection
            .transition()
            .duration(500)
            .attr("stroke", "orange")
            .transition()
            .duration(500)
            .attr("stroke", "white")
            .on("end", forwardPass);

          const toLayerIndex = Math.floor((forwardIndex % layers.slice(1).reduce((a, b) => a + b)) / layers[forwardIndex % layers.length]);
          const toNeuronIndex = forwardIndex % layers[toLayerIndex];

          if (toLayerIndex === 1 || toLayerIndex === 2) {
            const toNeuronTotalIndex = toNeuronIndex + layers.slice(0, toLayerIndex).reduce((a, b) => a + b, 0);
            neurons[toNeuronTotalIndex]
              .transition()
              .duration(500)
              .attr("fill", "#7C3AED")
              .transition()
              .duration(500)
              .attr("fill", "#C4B5FD");
          }

          forwardIndex++;
        } else {
          backwardPass();
        }
      };

      const backwardPass = () => {
        if (backwardIndex >= 0) {
          const connection = connections[backwardIndex];
          connection
            .transition()
            .duration(500)
            .attr("stroke", "orange")
            .transition()
            .duration(500)
            .attr("stroke", "white")
            .on("end", backwardPass);

          backwardIndex--;
        } else {
          setTimeout(animate, 1000); // Pause before starting again
        }
      };

      forwardPass();
    };

    animate();
  }, []);

  return <div id="mlp-animation" className="mlp-animation-container"></div>;
};

export default MLPAnimation;
