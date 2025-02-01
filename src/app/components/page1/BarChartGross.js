"use client"; // Obligatoire pour Next.js (Client Component)

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function BarChartGross() {
  const [data, setData] = useState([]);

  // Fonction pour diviser les genres composés
  const splitGenres = (data) => {
    const expandedData = [];
    data.forEach((d) => {
      const genres = d.GENRE.split(",");
      genres.forEach((genre) => {
        expandedData.push({ ...d, GENRE: genre.trim(), GROSS: +d.GROSS || 0 });
      });
    });
    return expandedData;
  };

  // Fonction pour mettre à jour le graphique
  const updateChart = (data) => {
    const expandedData = splitGenres(data);

    // Regrouper les recettes par genre
    const genreGross = d3.rollups(
      expandedData,
      (v) => d3.sum(v, (d) => d.GROSS),
      (d) => d.GENRE
    );

    // Trier par recette décroissante
    genreGross.sort((a, b) => b[1] - a[1]);

    // Sélectionner les 10 genres les plus rentables
    const topGenres = genreGross.slice(0, 10);

    // Dimensions du graphique
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 100 };

    // Supprimer l'ancien graphique
    d3.select("#GrossBarChart").select("svg").remove();

    // Créer le conteneur SVG
    const svg = d3
      .select("#GrossBarChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Échelles
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(topGenres, (d) => d[1])])
      .range([0, width - margin.left - margin.right]);

    const y = d3
      .scaleBand()
      .domain(topGenres.map((d) => d[0]))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.2);

    // Ajouter les barres
    svg
      .selectAll("rect")
      .data(topGenres)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d[0]))
      .attr("width", (d) => x(d[1]))
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

    // Ajouter les labels de valeurs
    svg
      .selectAll("text")
      .data(topGenres)
      .enter()
      .append("text")
      .attr("x", (d) => x(d[1]) + 5)
      .attr("y", (d) => y(d[0]) + y.bandwidth() / 2)
      .attr("alignment-baseline", "middle")
      .text((d) => `$${d3.format(".2s")(d[1])}`)
      .style("fill", "black");

    // Ajouter les axes
    svg.append("g").attr("transform", `translate(0,0)`).call(d3.axisLeft(y));
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d) => `$${d3.format(".2s")(d)}`));
  };

  useEffect(() => {
    d3.csv("/movie.csv").then((data) => {
      setData(data);
      updateChart(data);
    });
  }, []);

  return (
    <div>
      <h1>Recette totale par genre</h1>
      <div id="GrossBarChart"></div>
    </div>
  );
}
