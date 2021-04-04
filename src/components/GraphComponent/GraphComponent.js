import React, { useEffect } from "react";
import * as d3 from "d3";

import "./GraphComponent.css";

const margin = { top: 20, right: 20, bottom: 80, left: 100 },
  width = 960 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

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

  const xAxis2 = d3.axisBottom(x).ticks(6);
  const yAxis2 = d3.axisLeft(y).ticks(3);

  // text label for the x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
    )
    .style("text-anchor", "middle")
    .style("font-size", 28)
    .style("fill", "#BE2033")
    .text(() =>
      field !== "AE1"
        ? "Percent of patients with AE's in active arm (more than placebo)"
        : "Percent of patients in active arm with AE’s"
    );

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("font-size", 28)
    .style("fill", "#BE2033")
    .style("text-anchor", "middle")
    .text("Worldwide revenue (log scale)");

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
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.xVals))
    .attr("cy", (d) => {
      const getY = y(d.Revenue);
      if (isNaN(getY)) return height;
      return y(d.Revenue);
    })
    .attr("r", 4)
    .style("fill", "blue");

  svg
    .append("g")
    .selectAll(".line")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "line")
    .attr("x1", (d) => x(d.xVals))
    .attr("x2", (d) => x(d.xVals) + 15)
    .attr("y1", (d) => {
      if (isNaN(y(d.Revenue))) return height;
      return y(d.Revenue);
    })
    .attr("y2", (d) => {
      if (isNaN(y(d.Revenue))) return height - 15;
      return y(d.Revenue) - 15;
    })
    .attr("stroke", "gray");

  svg
    .append("g")
    .selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "text")
    .attr("x", (d) => x(d.xVals) + 5)
    .attr("y", (d) => {
      if (isNaN(y(d.Revenue))) return height - 15;
      return y(d.Revenue) - 15;
    })
    .attr("dx", ".71em")
    .attr("dy", ".35em")
    .text((d) => d.Drug_Name);

  const blackBoxData = data.filter((x) => x["Black_Box"] === "Yes");
  const remsData = data.filter((x) => x["REMS"] === "Yes");

  const boxLen = 14;
  svg
    .append("g")
    .selectAll("rect")
    .data(blackBoxData)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.xVals) - boxLen / 2)
    .attr("y", (d) => {
      if (isNaN(y(d.Revenue))) return height - boxLen / 2;
      return y(d.Revenue) - boxLen / 2;
    })
    .attr("width", boxLen)
    .attr("height", boxLen)
    .style("fill", "black");

  svg
    .append("g")
    .selectAll(".rems")
    .data(remsData)
    .enter()
    .append("circle")
    .attr("class", "rems")
    .attr("cx", (d) => x(d.xVals))
    .attr("cy", (d) => {
      if (isNaN(y(d.Revenue))) return height;
      return y(d.Revenue);
    })
    .attr("r", boxLen / 2 - 1)
    .attr("stroke", "#E84941")
    .style("stroke-width", 2);
};

const legendBuilder = () => {};

const GraphComponent = ({ data, field }) => {
  // data.Revenue = data.Revenue.map(x=>)
  useEffect(() => {
    chartBuilder(data, field);
    legendBuilder();
  }, [data, field]);

  return (
    <div className="graph-container">
      <h2>{field}</h2>
      <div className="graph-wrapper" id={"chart" + field}></div>
      <div className="legend-wrapper">
        <table>
          <tbody>
            <tr>
              <th colSpan="2">Legend</th>
            </tr>
            <tr>
              <td>
                <img src="/images/BlackREM.svg" alt="black rem" />
              </td>
              <td>Black Box & REMS</td>
            </tr>
            <tr>
              <td>
                <img src="/images/Black.svg" alt="black" />
              </td>
              <td>Black Box</td>
            </tr>
            <tr>
              <td>
                <img src="/images/REM.svg" alt="rem" />
              </td>
              <td>REMS</td>
            </tr>
            <tr>
              <td>
                <img src="/images/BlueDot.svg" alt="bluedot" />
              </td>
              <td>No Black Box or REMS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GraphComponent;
