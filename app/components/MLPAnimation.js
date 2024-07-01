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
            .attr("stroke-width", 2)
            .attr("stroke-linecap", "round");

          connections.push({ connection, toLayer: layerIndex + 1, toNeuron: j });
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
          .attr("stroke-width", 2)
          .attr("filter", "url(#drop-shadow)");

        neurons.push(neuron);
      }
    });

    // Add drop shadow filter for a vectorized look
    svg.append("defs")
      .append("filter")
      .attr("id", "drop-shadow")
      .append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2)
      .attr("result", "blur");

    svg.select("filter")
      .append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

    svg.select("filter")
      .append("feMerge")
      .append("feMergeNode")
      .attr("in", "offsetBlur");

    svg.select("filter feMerge")
      .append("feMergeNode")
      .attr("in", "SourceGraphic");

    // Animate the forward and backward pass
    const animate = () => {
      let forwardIndex = 0;
      let backwardIndex = connections.length - 1;
      const transitionDuration = 200; // Reduced duration for faster animation

      const forwardPass = () => {
        if (forwardIndex < connections.length) {
          const { connection, toLayer, toNeuron } = connections[forwardIndex];
          connection
            .transition()
            .duration(transitionDuration)
            .attr("stroke", "orange")
            .transition()
            .duration(transitionDuration)
            .attr("stroke", "white")
            .on("end", forwardPass);

          if (toLayer === 1 || toLayer === 2) {
            const neuronIndex = toNeuron + layers.slice(0, toLayer).reduce((acc, curr) => acc + curr, 0);
            neurons[neuronIndex]
              .transition()
              .duration(transitionDuration)
              .attr("fill", "#7C3AED")
              .transition()
              .duration(transitionDuration)
              .attr("fill", "#C4B5FD");
          }

          forwardIndex++;
        } else {
          setTimeout(backwardPass, 1000); // Pause before starting backward pass
        }
      };

      const backwardPass = () => {
        if (backwardIndex >= 0) {
          const { connection } = connections[backwardIndex];
          connection
            .transition()
            .duration(transitionDuration)
            .attr("stroke", "blue")
            .transition()
            .duration(transitionDuration)
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
