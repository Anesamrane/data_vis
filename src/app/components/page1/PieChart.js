"use client"; // Required for Next.js client-side rendering

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function PieChart() {
  const [filteredData, setFilteredData] = useState([]);

  // Fonction pour diviser les genres composés
  const splitGenres = (data) => {
    const expandedData = [];
    data.forEach((d) => {
      // Si un film a plusieurs genres, le diviser et les ajouter séparément
      const genres = d.GENRE.split(","); // Divise les genres par la virgule
      genres.forEach((genre) => {
        // Nettoyer les espaces et ajouter le film avec un genre unique
        expandedData.push({ ...d, GENRE: genre.trim() });
      });
    });
    return expandedData;
  };

  // Fonction pour mettre à jour le graphique
  const updateChart = (data) => {
    // Diviser les genres composés en genres simples
    const expandedData = splitGenres(data);

    // Regrouper les films par genre
    const genreCounts = d3.rollups(expandedData, (v) => v.length, (d) => d.GENRE);

    // Trier les genres par nombre de films
    genreCounts.sort((a, b) => b[1] - a[1]);

    // Sélectionner les 6 genres les plus populaires et regrouper les autres sous "Autres genres"
    const topGenres = genreCounts.slice(0, 6);
    const otherGenresCount = genreCounts.slice(6).reduce((sum, current) => sum + current[1], 0);

    if (otherGenresCount > 0) {
      topGenres.push(["Autres genres", otherGenresCount]);
    }

    // Transformer les données pour le graphique en camembert
    const pieData = topGenres.map((item) => ({
      label: item[0],  // Genre
      value: item[1],  // Nombre de films
    }));

    // Paramètres du graphique
    const width = 400;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Supprimer l'ancien SVG pour éviter la duplication
    d3.select("#PieChart").select("svg").remove();

    // Créer le conteneur SVG
    const svg = d3
      .select("#PieChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Échelle de couleurs
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Création du graphique en camembert
    const pie = d3.pie().value((d) => d.value);

    // Générateur d'arc
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Création des arcs (tranches du camembert)
    const arcs = svg
      .selectAll("arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Ajout des chemins (tranches)
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label));

    // Ajouter des labels aux tranches
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => d.data.label)
      .style("font-size", "14px")
      .style("fill", "#fff");
  };

  useEffect(() => {
    // Charger les données CSV et mettre à jour le graphique
    d3.csv("/movie.csv").then((data) => {
      setFilteredData(data); // Stocker les données complètes dans l'état
      updateChart(data); // Mettre à jour le graphique avec les données nettoyées
    });
  }, []);

  return (
    <div>
      <h1>Top genre</h1>
      {/* Conteneur pour le graphique en camembert */}
      <div id="PieChart"></div>
    </div>
  );
}
