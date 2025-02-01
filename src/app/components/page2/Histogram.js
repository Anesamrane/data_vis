"use client"; // Obligatoire pour Next.js (Client Component)

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function Histogram() {
  const [data, setData] = useState([]);

  // Fonction pour mettre à jour le graphique
  const updateChart = (data) => {
    // Convertir les notes en nombres
    const ratings = data.map((d) => +d.RATING).filter((d) => !isNaN(d));

    // Dimensions du graphique
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    // Supprimer l'ancien graphique
    d3.select("#RatingHistogram").select("svg").remove();

    // Créer le conteneur SVG
    const svg = d3
      .select("#RatingHistogram")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Échelle X (notes entre 0 et 10)
    const x = d3.scaleLinear().domain([0, 10]).range([0, width - margin.left - margin.right]);

    // Créer un histogramme avec 10 bins (0-1, 1-2, ..., 9-10)
    const histogram = d3.bin().domain(x.domain()).thresholds(10);
    const bins = histogram(ratings);

    // Échelle Y (nombre de films)
    const y = d3.scaleLinear().domain([0, d3.max(bins, (d) => d.length)]).range([height - margin.top - margin.bottom, 0]);

    // Ajouter les barres
    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.x0))
      .attr("y", (d) => y(d.length))
      .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
      .attr("height", (d) => height - margin.top - margin.bottom - y(d.length))
      .attr("fill", "steelblue");

    // Ajouter les axes
    svg.append("g").attr("transform", `translate(0,${height - margin.top - margin.bottom})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));
  };

  useEffect(() => {
    d3.csv("/movie.csv").then((data) => {
      setData(data);
      updateChart(data);
    });
  }, []);

  return (
    <div>
      <h1>Distribution des notes</h1>
      <div id="RatingHistogram"></div>
    </div>
  );
}
