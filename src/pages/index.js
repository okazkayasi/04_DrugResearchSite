import { graphql } from "gatsby";
import React, { useState, useEffect } from "react";
import IndicationComponent from "../components/IndicationComponent/IndicationComponent";
import styled from "styled-components";
import Select from "react-select";

const DropdownDiv = styled.div`
  max-width: 400px;
  width: 80%;
  margin: 30px auto;
`;

const BoxesWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px 25px;
  margin: auto;
  width: 95vw;
`;

const IndexComponent = (props) => {
  const [allData, setAllData] = useState([]);
  const [diseaseGroupSelect, setDiseaseGroupSelect] = useState({
    value: "",
    label: "",
  });
  const [diseaseGroupText, setDiseaseGroupText] = useState([]);
  console.log(diseaseGroupSelect, "dg");

  const getDistinctData = () => {
    // all data we get
    const allData = props.data.allDataCsv.edges.map((edge) => edge.node);

    // make modifications on data
    allData.forEach((node) => {
      node.SAB = Math.floor(Math.random() * 4);
      node.Venture_Funders = Math.floor(Math.random() * 4);
      node.Public_Holders = Math.floor(Math.random() * 4);
      node.Target = node.Target.split(",").join(", ");
      node.Current_Phase =
        node.Current_Phase === "Approved"
          ? "FDA Approved 🇺🇸"
          : node.Current_Phase === "Approved (Generic Competition)"
          ? "FDA Approved 🇺🇸 Generic"
          : node.Current_Phase === "Approved in Europe"
          ? "EMA Approved 🇪🇺"
          : node.Current_Phase === "Approved in other than U.S./E.U."
          ? "Approved, Non FDA/EMA"
          : node.Current_Phase;
    });

    // get disease groups and counts make them ready for Select
    const distinctDiseaseGroups = props.data.allDataCsv.distinct;
    const distinctDiseaseGroupCountData = distinctDiseaseGroups.map((node) => ({
      name: node,
      count: [
        ...new Set(
          allData
            .filter((d) => d.Disease_Group === node)
            .map((d) => d.Indication_Name)
        ),
      ].length,
    }));
    const diseaseGroupText = distinctDiseaseGroupCountData.map((node) => ({
      value: node.name,
      label: `${node.name} (${node.count} indications)`,
    }));
    setDiseaseGroupText(diseaseGroupText);
    setDiseaseGroupSelect(diseaseGroupText[0]);
    setAllData(allData);
  };
  useEffect(() => {
    getDistinctData();
  }, []);

  // data for the page (only one disease group)
  const data = allData.filter(
    (node) => node.Disease_Group === diseaseGroupSelect.value
  );

  // get indication names for this disease group and create data
  const indicationNames = data.map((node) => node.Indication_Name);
  const distinctIndicationNames = [...new Set(indicationNames)];
  const distintIndicationData = distinctIndicationNames.map((name) => ({
    name: name,
    data: data.filter((node) => node.Indication_Name === name),
  }));

  // create components for each indication data
  const boxes = distintIndicationData.map((x) => (
    <IndicationComponent name={x.name} data={x.data} key={x.name} />
  ));

  return (
    <div>
      <DropdownDiv>
        <Select
          options={diseaseGroupText}
          onChange={(e) =>
            setDiseaseGroupSelect({ value: e.value, label: e.label })
          }
          value={diseaseGroupSelect}
        />
      </DropdownDiv>
      <BoxesWrapper>{boxes}</BoxesWrapper>
    </div>
  );
};

export default IndexComponent;

export const IndexQuery = graphql`
  query MyQuery1 {
    allDataCsv {
      edges {
        node {
          Disease_Group
          Indication_Name
          Phase_I_Date
          Phase_I_Event_Date
          Phase_II_Date
          Phase_II_Event_Date
          Phase_III_Date
          Phase_III_Event_Date
          Current_Phase
          Molecule
          Route_of_Administration
          Target
          Lead_Company_Name
          Drug_Name
          Ticker
        }
      }
      distinct(field: Disease_Group)
    }
  }
`;
