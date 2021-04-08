import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import styled from "styled-components";
import GraphComponent from "../components/GraphComponent/GraphComponent";

const HeaderWrapper = styled.div`
  margin: 20px auto;
  text-align: center;
`;
const GraphsWrapper = styled.div`
  display: flex;
  width: 100%;
  div {
    &:not(:first-child) {
      margin-left: 50px;
    }
    flex-grow: 1;
  }
`;

const GraphPage = (props) => {
  // allChartdataCsv
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const chartDataMap = {};

    const chartData = props.data.allChartdataCsv.edges.map((edge) => edge.node);
    chartData.forEach((d) => {
      chartDataMap[d.Drug_Name] = d;
      chartDataMap[d.Drug_Name]["Disease_Group"] = [];
      chartDataMap[d.Drug_Name]["Indication_Name"] = [];
      chartDataMap[d.Drug_Name]["Route_of_Administration"] = [];
    });
    const otherdata = props.data.allOtherdataCsv.edges.map((edge) => edge.node);
    otherdata.forEach((d) => {
      d.Disease_Group &&
        chartDataMap[d.Drug_Name]["Disease_Group"].indexOf(d.Disease_Group) ===
          -1 &&
        chartDataMap[d.Drug_Name]["Disease_Group"].push(d.Disease_Group);
      d.Indication_Name &&
        chartDataMap[d.Drug_Name]["Indication_Name"].indexOf(
          d.Indication_Name
        ) === -1 &&
        chartDataMap[d.Drug_Name]["Indication_Name"].push(d.Indication_Name);
      d.Route_of_Administration &&
        chartDataMap[d.Drug_Name]["Route_of_Administration"].indexOf(
          d.Route_of_Administration
        ) === -1 &&
        chartDataMap[d.Drug_Name]["Route_of_Administration"].push(
          d.Route_of_Administration
        );
    });
    const newChartData = [];
    for (const data in chartDataMap) {
      newChartData.push(chartDataMap[data]);
    }
    // console.log(chartDataMap);
    // console.log(otherdata);
    console.log(newChartData);
    setChartData(newChartData);
  }, [props.data.allChartdataCsv.edges]);

  const ae1data = chartData.filter((x) => x.AE1 !== "" && x.AE1 !== "NoData");
  const ae2data = chartData.filter((x) => x.AE2 !== "" && x.AE2 !== "NoData");
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Peptide Therapeutics Landscape</title>
      </Helmet>
      <HeaderWrapper>
        <h1>Revenue and AE Rates for Approved Drugs with Cell Membrane Targets</h1>
      </HeaderWrapper>
      <GraphsWrapper>
        {chartData.length > 0 ? (
          <>
            <GraphComponent
              title="Absolute Measure (FDA label data)"
              data={[...ae1data]}
              field="AE1"
            />
            <GraphComponent
              title="Relative Measure (FDA label data)"
              data={[...ae2data]}
              field="AE2"
            />
          </>
        ) : (
          <></>
        )}
      </GraphsWrapper>
    </div>
  );
};

export default GraphPage;

export const IndexQuery = graphql`
  query MyQuery2 {
    allChartdataCsv {
      edges {
        node {
          Company_Name
          Drug_Name
          Drug_ID
          Black_Box
          Label_URL
          REMS
          Revenue
          AE1
          AE2
          Target_1
          Target_2
          Target_3
          Target_4
          Modality
        }
      }
    }
    allOtherdataCsv {
      edges {
        node {
          Drug_Name
          Disease_Group
          Indication_Name
          Route_of_Administration
        }
      }
    }
  }
`;
