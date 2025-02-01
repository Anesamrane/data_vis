"use client"; // Obligatoire pour Next.js (Client Component)

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function ScatterPlot() {
  const [data, setData] = useState([]);

  // Fonction pour mettre à jour le graphique
  const updateChart = (data) => {
    // Filtrer les données valides (avec durée et note)
    const filteredData = data
      .map((d) => ({
        RunTime: +d.RunTime,
        rating: +d.RATING,
      }))
      .filter((d) => !isNaN(d.RunTime) && !isNaN(d.rating));

    // Dimensions du graphique
    const width = 600;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 80, left: 50 };

    // Supprimer l'ancien graphique
    d3.select("#RunTimeVsRatingChart").select("svg").remove();

    // Créer le conteneur SVG
    const svg = d3
      .select("#RunTimeVsRatingChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Échelle X (Durée du film)
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.RunTime)])
      .range([0, width - margin.left - margin.right]);

    // Échelle Y (Note du film)
    const y = d3
      .scaleLinear()
      .domain([0, 10]) // Les notes vont de 0 à 10
      .range([height - margin.top - margin.bottom, 0]);

    // Ajouter les points
    svg
      .selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.RunTime))
      .attr("cy", (d) => y(d.rating))
      .attr("r", 5)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7);

    // Ajouter les axes
    svg.append("g").attr("transform", `translate(0,${height - margin.top - margin.bottom})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    // Ajouter labels des axes
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 80)
      .style("text-anchor", "middle")
      .text("Durée du film (minutes)");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -20)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Note du film");
  };

  useEffect(() => {
    d3.csv("/movie.csv").then((data) => {
      setData(data);
      updateChart(data);
    });
  }, []);

  return (
    <div>
      <h1>Relation entre la durée et la note des films</h1>
      <div id="RunTimeVsRatingChart"></div>
    </div>
  );
}
