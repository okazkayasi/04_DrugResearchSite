import { graphql } from "gatsby";
import React, { useState } from "react";
import IndicationComponent from "../components/IndicationComponent/IndicationComponent";
import Dropdown from "react-dropdown";
import styled from "styled-components";
import "react-dropdown/style.css";

const DropdownDiv = styled.div`
  max-width: 400px;
  width: 80%;
  margin: 30px auto;
`;

const BoxesWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px 50px;
  padding: 0 25px;
`;

const IndexComponent = (props) => {
  const [diseaseGroup, setDiseaseGroup] = useState("Allergy");
  console.log(diseaseGroup, "dg");
  const data = props.data.allDataCsv.edges
    .map((edge) => edge.node)
    .filter((node) => node.Disease_Group === diseaseGroup);
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
        <Dropdown
          options={distinctDiseaseGroups}
          onChange={(e) => setDiseaseGroup(e.value)}
          value={diseaseGroup}
          placeholder="Select an option"
        />
      </DropdownDiv>
      <p>{`${diseaseGroup} ${data.length}`}</p>
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
