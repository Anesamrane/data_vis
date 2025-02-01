"use client"; // Obligatoire pour Next.js (Client Component)

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function BoxPlot() {
  const [data, setData] = useState([]);

  // Fonction pour diviser les genres composés
  const splitGenres = (data) => {
    const expandedData = [];
    data.forEach((d) => {
      const genres = d.GENRE.split(",");
      genres.forEach((genre) => {
        expandedData.push({ ...d, GENRE: genre.trim(), RunTime: +d.RunTime });
      });
    });
    return expandedData;
  };

  // Fonction pour calculer les quartiles d'un tableau
  const computeBoxStats = (values) => {
    values.sort(d3.ascending);
    return {
      min: d3.min(values),
      q1: d3.quantile(values, 0.25),
      median: d3.median(values),
      q3: d3.quantile(values, 0.75),
      max: d3.max(values),
    };
  };

  // Fonction pour mettre à jour le graphique
  const updateChart = (data) => {
    const expandedData = splitGenres(data);

    // Regrouper les durées par genre
    const genreRunTimes = d3.rollups(
      expandedData,
      (v) => v.map((d) => d.RunTime),
      (d) => d.GENRE
    );

    // Trier par médiane des durées décroissante
    genreRunTimes.sort((a, b) => d3.median(b[1]) - d3.median(a[1]));

    // Sélectionner les 10 genres les plus courants
    const topGenres = genreRunTimes.slice(0, 10).map(([genre, RunTimes]) => ({
      genre,
      stats: computeBoxStats(RunTimes),
    }));

    // Dimensions du graphique
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 100 };

    // Supprimer l'ancien graphique
    d3.select("#BoxPlot").select("svg").remove();

    // Créer le conteneur SVG
    const svg = d3
      .select("#BoxPlot")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Échelles
    const x = d3
      .scaleBand()
      .domain(topGenres.map((d) => d.genre))
      .range([0, width - margin.left - margin.right])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(topGenres, (d) => d.stats.min),
        d3.max(topGenres, (d) => d.stats.max),
      ])
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    // Ajouter les boîtes à moustaches
    topGenres.forEach((d) => {
      const xPos = x(d.genre) + x.bandwidth() / 2;

      // Ligne verticale (min-max)
      svg
        .append("line")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", y(d.stats.min))
        .attr("y2", y(d.stats.max))
        .attr("stroke", "black");

      // Rectangle (q1-q3)
      svg
        .append("rect")
        .attr("x", x(d.genre))
        .attr("y", y(d.stats.q3))
        .attr("width", x.bandwidth())
        .attr("height", y(d.stats.q1) - y(d.stats.q3))
        .attr("stroke", "black")
        .attr("fill", "lightblue");

      // Ligne médiane
      svg
        .append("line")
        .attr("x1", x(d.genre))
        .attr("x2", x(d.genre) + x.bandwidth())
        .attr("y1", y(d.stats.median))
        .attr("y2", y(d.stats.median))
        .attr("stroke", "black");
    });

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
      <h1>Durée moyenne des films par genre</h1>
      <div id="BoxPlot"></div>
    </div>
  );
}
