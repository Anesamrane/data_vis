"use client"; // Obligatoire pour Next.js (Client Component)

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function BarChart() {
  const [data, setData] = useState([]);

  // Fonction pour diviser les genres composés
  const splitGenres = (data) => {
    const expandedData = [];
    data.forEach((d) => {
      const genres = d.GENRE.split(",");
      genres.forEach((genre) => {
        expandedData.push({ ...d, GENRE: genre.trim() });
      });
    });
    return expandedData;
  };

  // Fonction pour mettre à jour le graphique
  const updateChart = (data) => {
    const expandedData = splitGenres(data);

    // Regrouper les votes par genre
    const genreVotes = d3.rollups(expandedData, 
      (v) => d3.sum(v, (d) => +d.VOTES), 
      (d) => d.GENRE
    );

    // Trier par nombre de votes décroissant
    genreVotes.sort((a, b) => b[1] - a[1]);

    // Garder les 10 premiers genres et regrouper les autres
    const topGenres = genreVotes.slice(0, 10);
    const otherVotes = genreVotes.slice(10).reduce((sum, d) => sum + d[1], 0);

    if (otherVotes > 0) {
      topGenres.push(["Autres genres", otherVotes]);
    }

    // Paramètres du graphique
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 100 };

    // Supprimer l'ancien graphique pour éviter les duplications
    d3.select("#BarChart").select("svg").remove();

    // Créer le conteneur SVG
    const svg = d3
      .select("#BarChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Définir les échelles
    const x = d3.scaleLinear()
      .domain([0, d3.max(topGenres, (d) => d[1])])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
      .domain(topGenres.map((d) => d[0]))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);

    // Ajouter les barres
    svg.selectAll(".bar")
      .data(topGenres)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => y(d[0]))
      .attr("width", (d) => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

    // Ajouter les labels
    svg.selectAll(".label")
      .data(topGenres)
      .enter()
      .append("text")
      .attr("x", (d) => x(d[1]) + 5)
      .attr("y", (d) => y(d[0]) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text((d) => d[1])
      .style("font-size", "12px");

    // Ajouter les axes
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));
  };

  useEffect(() => {
    d3.csv("/movie.csv").then((data) => {
      setData(data);
      updateChart(data);
    });
  }, []);

  return (
    <div>
      <h1>Nombre de votes par genre</h1>
      <div id="BarChart"></div>
    </div>
  );
}
