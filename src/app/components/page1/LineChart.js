"use client"; // Required for Next.js client-side rendering

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function LineChart() {
  const [data, setData] = useState([]);

  // Fonction pour regrouper les films par année
  const groupByYear = (data) => {
    const yearCounts = d3.rollups(data, (v) => v.length, (d) => d.YEAR);
    return yearCounts.sort((a, b) => a[0] - b[0]); // Trier par année croissante
  };

  useEffect(() => {
    // Charger les données CSV et mettre à jour le graphique
    d3.csv("/movie.csv").then((data) => {
      // Filtrer les données pour s'assurer que l'année existe
      const filteredData = data.filter((d) => d.YEAR && !isNaN(d.YEAR));

      // Regrouper les films par année
      const groupedData = groupByYear(filteredData);

      // Mettre à jour l'état des données
      setData(groupedData);
    });
  }, []);

  useEffect(() => {
    if (data.length === 0) return; // S'assurer que les données sont présentes avant de créer le graphique

    // Paramètres du graphique
    const width = 420;
    const height = 350;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const x = d3.scaleLinear()
      .domain(d3.extent(data, (d) => d[0])) // Plage des années
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d[1])]) // Plage du nombre de films
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Créer un SVG
    const svg = d3.select("#LineChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Ajouter les axes
    svg.append("g")
      .selectAll("text")
      .data(data)
      .attr("x", (d) => x(d[0])) 
      .attr("y", (d) => y(d[1]))
      .text((d) => d[1]);

    // Créer une ligne
    const line = d3.line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Ajouter des axes X et Y
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return (
    <div>
        <h1> distrubution des films par anner</h1>
      {/* Conteneur pour le graphique en ligne */}
      <div id="LineChart"></div>
    </div>
  );
}
