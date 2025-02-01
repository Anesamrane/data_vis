"use client"; // Required for Next.js client-side rendering

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function HorizontalBarChart() {
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  // Fonction pour récupérer les 20 films les mieux notés
  const getTopRatedMovies = (data) => {
    // Filtrer les films ayant une note valide
    const filteredData = data.filter((d) => d.RATING && !isNaN(d.RATING));

    // Trier les films par note (de la plus haute à la plus basse) et prendre les 20 premiers
    const sortedData = filteredData
      .sort((a, b) => b.RATING - a.RATING)
      .slice(0, 20);

    return sortedData;
  };

  useEffect(() => {
    // Charger les données CSV et mettre à jour le graphique
    d3.csv("/movie.csv").then((data) => {
      // Récupérer les 20 films les mieux notés
      const topMovies = getTopRatedMovies(data);

      // Mettre à jour l'état des films
      setTopRatedMovies(topMovies);
    });
  }, []);

  useEffect(() => {
    if (topRatedMovies.length === 0) return; // S'assurer que les données sont présentes avant de créer le graphique

    // Paramètres du graphique
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 150 };

    const x = d3.scaleLinear()
      .domain([0, d3.max(topRatedMovies, (d) => +d.RATING)]) // Plage des notes
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(topRatedMovies.map((d) => d.MOVIES)) // Liste des titres de films
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Créer un SVG
    const svg = d3.select("#HorizontalBarChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Ajouter les barres
    svg.selectAll(".bar")
      .data(topRatedMovies)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("y", (d) => y(d.MOVIES))
      .attr("width", (d) => x(d.RATING) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

    // Ajouter les axes
    svg.append("g")
      .selectAll("text")
      .data(topRatedMovies)
      .join("text")
      .attr("x", (d) => x(d.RATING) + 5)
      .attr("y", (d) => y(d.MOVIES) + y.bandwidth() / 2)
      .text((d) => d.RATING)
      .style("font-size", "12px")

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [topRatedMovies]);

  return (
    <div>
      <h1>Top 20 Movies by Rating</h1>

      {/* Conteneur pour le graphique à barres horizontal */}
      <div id="HorizontalBarChart"></div>
    </div>
  );
}
