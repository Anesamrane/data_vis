"use client"; 

import { useEffect, useState } from "react";
import * as d3 from "d3";

export default function BarchartPopulaire() {
  const [data, setData] = useState([]);

  const updateChart = (data) => {
    const topMovies = data
      .map((d) => ({
        MOVIES: d.MOVIES,
        VOTES: +d.VOTES.replace(/,/g, ""), // Supprime les virgules et convertit en nombre
      }))
      .filter((d) => !isNaN(d.VOTES))
      .sort((a, b) => b.VOTES - a.VOTES)
      .slice(0, 20); // Top 20

    const width = 700;
    const height = 600;
    const margin = { top: 20, right: 30, bottom: 50, left: 250 };

    d3.select("#TopMoviesBarChart").select("svg").remove();

    const svg = d3
      .select("#TopMoviesBarChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxVotes = d3.max(topMovies, (d) => d.VOTES);

    const x = d3.scaleLinear()
      .domain([0, maxVotes * 1.1]) // Ajoute une marge de 10%
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
      .domain(topMovies.map((d) => d.MOVIES))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.3);

    svg.selectAll("rect")
      .data(topMovies)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d.MOVIES))
      .attr("width", (d) => x(d.VOTES))
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

    svg.selectAll("text")
      .data(topMovies)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.VOTES) + 5)
      .attr("y", (d) => y(d.MOVIES) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text((d) => d.VOTES)
      .style("font-size", "14px") // Plus grand et plus lisible
      .style("font-weight", "bold")
      .style("fill", "black");

    svg.append("g").call(d3.axisLeft(y));
    svg.append("g").attr("transform", `translate(0,${height - margin.top - margin.bottom})`).call(d3.axisBottom(x));
  };

  useEffect(() => {
    d3.csv("/movie.csv").then((data) => {
      setData(data);
      updateChart(data);
    });
  }, []);

  return (
    <div>
      <h1>Top 20 Films les plus populaires</h1>
      <div id="TopMoviesBarChart"></div>
    </div>
  );
}
