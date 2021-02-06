import { graphql } from "gatsby";
import React, { useState } from "react";
import IndicationComponent from "../components/IndicationComponent/IndicationComponent";
import styled from "styled-components";
import "react-dropdown/style.css";
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
  const [diseaseGroupSelect, setDiseaseGroupSelect] = useState({
    value: "Allergy",
    label: "Allergy",
  });

  console.log(diseaseGroupSelect, "dg");
  const data = props.data.allDataCsv.edges
    .map((edge) => edge.node)
    .filter((node) => node.Disease_Group === diseaseGroupSelect.value);
  data.forEach((node) => {
    node.SAB = Math.floor(Math.random() * 4);
    node.Venture_Funders = Math.floor(Math.random() * 4);
    node.Public_Holders = Math.floor(Math.random() * 4);
    node.Target = node.Target.split(",").join(", ");
  });
  const distinctDiseaseGroups = props.data.allDataCsv.distinct;
  console.log(data);

  const indicationNames = data.map((node) => node.Indication_Name);
  const distinctIndicationNames = [...new Set(indicationNames)];

  const distintIndicationData = distinctIndicationNames.map((name) => ({
    name: name,
    data: data.filter((node) => node.Indication_Name === name),
  }));

  const boxes = distintIndicationData.map((x) => (
    <IndicationComponent name={x.name} data={x.data} />
  ));

  return (
    <div>
      <DropdownDiv>
        {/* <Dropdown
          options={distinctDiseaseGroups}
          onChange={(e) => setDiseaseGroup(e.value)}
          value={diseaseGroup}
          placeholder="Select an option"
        /> */}
        <Select
          options={distinctDiseaseGroups.map((node) => ({
            value: node,
            label: node,
          }))}
          onChange={(e) =>
            setDiseaseGroupSelect({ value: e.value, label: e.value })
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
