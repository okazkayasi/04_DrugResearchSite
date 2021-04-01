import React, { useEffect } from "react";
import * as d3 from "d3";

import "./GraphComponent.css";

const margin = { top: 20, right: 20, bottom: 30, left: 100 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const chartBuilder = (data, field) => {
  data.forEach((item) => {
    const stRevenue = (item.Revenue + "").startsWith("$")
      ? item.Revenue.slice(1).split(",").join("")
      : item.Revenue;
    item.Revenue = parseInt(stRevenue);

    item.xVals = parseInt(item[field].slice(0, item[field].length - 1)) / 100;
  });

  const id = "#chart" + field;
  const svg = d3
    .select(id)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((x) => 0.3))])
    .range([0, width]);
  const y = d3
    .scaleLog()
    .domain([10, d3.max(data.map((x) => 10000))])
    .range([height, 0]);

  console.log(y(200));

  const xAxis2 = d3.axisBottom(x).ticks(6);
  const yAxis2 = d3.axisLeft(y).ticks(3);

  svg
    .append("g")
    .attr("class", "grid grid-x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2.tickSize(-height).tickFormat(""));

  svg
    .append("g")
    .attr("class", "grid grid-y")
    .call(yAxis2.tickSize(-width).tickFormat(""));

  svg.select(".grid-y").select("path").remove();

  svg.selectAll(".grid").selectAll("line").attr("stroke", "lightgray");

  svg
    .append("g")
    .call(d3.axisLeft(y).ticks(3, (d) => "$" + d3.format(",.0f")(d) + "M"));

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(6, ".0%"));

  // svg.selectAll(".tick").selectAll("line").remove();

  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.xVals))
    .attr("cy", (d) => y(d.Revenue))
    .attr("r", 2.5)
    .style("fill", "blue");
};

const GraphComponent = ({ data, field }) => {
  // data.Revenue = data.Revenue.map(x=>)
  useEffect(() => {
    chartBuilder(data, field);
  }, [data, field]);

  return (
    <div className="graph-container">
      <h2>{field}</h2>
      <div className="graph-wrapper" id={"chart" + field}></div>
    </div>
  );
};

export default GraphComponent;
