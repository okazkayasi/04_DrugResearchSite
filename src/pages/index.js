import { graphql } from "gatsby";
import React, { useState, useEffect } from "react";
import IndicationComponent from "../components/IndicationComponent/IndicationComponent";
import styled from "styled-components";
import Select from "react-select";

import AutoImmune from "../components/icons/autoimmune";
import Cardiovascular from "../components/icons/cardiovascular";
import Dermatology from "../components/icons/dermatology";
import Endoctrine from "../components/icons/endoctine";
import EntDenial from "../components/icons/ent-denial";
import Gastroenterology from "../components/icons/gastroenterology";
import Hematology from "../components/icons/hematology";
import Infectious from "../components/icons/infectious";
import Metabolic from "../components/icons/metabolic";
import Neurology from "../components/icons/neurology";
import Obstetrics from "../components/icons/obstetrics";
import Oncology from "../components/icons/oncology";
import Ophthalmology from "../components/icons/ophthalmology";
import Psychiatry from "../components/icons/psychiatry";
import Renal from "../components/icons/renal";
import Respiratory from "../components/icons/respiratory";
import Rheumatology from "../components/icons/rheumatology";
import Urology from "../components/icons/urology";
import urology from "../components/icons/urology";

const FlexDiv = styled.div`
  display: flex;
`;

const MobileDiv = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const DropdownDiv = styled.div`
  max-width: 400px;
  width: 80%;
  margin: 30px auto;
  @media (max-width: 768px) {
    display: none;
  }
`;

const BoxesWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px 25px;
  margin: auto;
  width: 95vw;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const iconSvgs = [
  { name: "Allergy", icon: null },
  { name: "Autoimmune/immunology", icon: <AutoImmune /> },
  { name: "Cardiovascular", icon: <Cardiovascular /> },
  { name: "Dermatology", icon: <Dermatology /> },
  { name: "ENT/Dental", icon: <EntDenial /> },
  { name: "Endocrine", icon: <Endoctrine /> },
  {
    name: "Gastroenterology (Non Inflammatory Bowel Disease)",
    icon: <Gastroenterology />,
  },
  { name: "Hematology", icon: <Hematology /> },
  { name: "Infectious Disease", icon: <Infectious /> },
  { name: "Metabolic", icon: <Metabolic /> },
  { name: "Neurology", icon: <Neurology /> },
  { name: "Not Specified", icon: null },
  { name: "Obstetrics/Gynecology", icon: <Obstetrics /> },
  { name: "Oncology", icon: <Oncology /> },
  { name: "Ophthalmology", icon: <Ophthalmology /> },
  { name: "Orthopedics", icon: null },
  { name: "Psychiatry", icon: <Psychiatry /> },
  { name: "Renal", icon: <Renal /> },
  { name: "Respiratory", icon: <Respiratory /> },
  { name: "Rheumatology (Non Autoimmune)", icon: <Rheumatology /> },
  { name: "Urology", icon: <Urology /> },
];

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
      label: (
        <FlexDiv>
          {iconSvgs.find((d) => d.name === node.name).icon}
          <p style={{ margin: "0 0 0 10px" }}>
            {node.name} ({node.count} indications)
          </p>
        </FlexDiv>
      ),
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
    <main>
      <MobileDiv>
        <h1>Please use desktop or tablet (landscape) to view this page.</h1>
      </MobileDiv>
      <div style={{ paddingBottom: "50px" }}>
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
    </main>
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
