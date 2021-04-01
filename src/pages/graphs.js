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
  * {
    flex-grow: 1;
  }
`;

const GraphPage = (props) => {
  // allChartdataCsv
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const chartData = props.data.allChartdataCsv.edges.map((edge) => edge.node);
    setChartData(chartData);
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
        <h1>Graphs</h1>
      </HeaderWrapper>
      <GraphsWrapper>
        <GraphComponent data={ae1data} field="AE1" />
        <GraphComponent data={ae2data} field="AE2" />
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
        }
      }
    }
  }
`;
