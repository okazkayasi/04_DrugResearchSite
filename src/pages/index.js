import { graphql } from "gatsby";
import { Radio } from "antd";
import React, { useState, useEffect } from "react";
import IndicationComponent from "../components/IndicationComponent/IndicationComponent";
import styled from "styled-components";
import Select from "react-select";
import emojiFlags from "emoji-flags";
import "./index.css";

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
import MapLegend from "../components/MapLegend/MapLegend";

const FlexDiv = styled.div`
  display: flex;
`;

const MobileDiv = styled.div`
  display: none;
  width: 100%;
  @media (max-width: 666px) {
    display: block;
  }
`;

const HeaderWrapper = styled.div`
  margin: 20px auto;
  text-align: center;
`;

const HeaderDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  margin: 20px auto;
  text-align: left;
  @media (max-width: 666px) {
    display: none;
  }
`;

const DropdownWrapper = styled.div`
  width: 100%;
`;

const DropdownDiv = styled.div`
  max-width: 700px;
  margin: auto;
`;
const RadioDiv = styled.div`
  max-width: 700px;
  margin: 20px auto;
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
  @media (max-width: 666px) {
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
  const [alphabetic, setAlphabetic] = useState(false);
  const [diseaseGroupSelect, setDiseaseGroupSelect] = useState({
    value: "",
    label: "",
  });
  const [diseaseGroupText, setDiseaseGroupText] = useState([]);
  console.log(diseaseGroupSelect, "dg");

  useEffect(() => {
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
            ? "FDA Approved " + emojiFlags.countryCode("US").emoji || ""
            : node.Current_Phase === "Approved (Generic Competition)"
            ? "FDA Approved " +
              (emojiFlags.countryCode("US").emoji || "") +
              " Generic"
            : node.Current_Phase === "Approved in Europe"
            ? "EMA Approved " + emojiFlags.countryCode("EU").emoji || ""
            : node.Current_Phase === "Approved in other than U.S./E.U."
            ? "Approved, Non FDA/EMA"
            : node.Current_Phase;
      });

      // get disease groups and counts make them ready for Select
      const distinctDiseaseGroups = props.data.allDataCsv.distinct;
      const distinctDiseaseGroupCountData = distinctDiseaseGroups.map(
        (node) => ({
          name: node,
          count: [
            ...new Set(
              allData
                .filter((d) => d.Disease_Group === node)
                .map((d) => d.Indication_Name)
            ),
          ].length,
          drugCount: [
            ...new Set(
              allData
                .filter((d) => d.Disease_Group === node)
                .map((d) => d.Drug_Name)
            ),
          ].length,
        })
      );

      const diseaseGroupText = distinctDiseaseGroupCountData
        .sort((a, b) => b.count - a.count)
        .map((node) => ({
          value: node.name,
          label: (
            <FlexDiv>
              {iconSvgs.find((d) => d.name === node.name).icon}
              <p style={{ margin: "0 0 0 10px" }}>
                {node.name} ({node.drugCount} drugs across {node.count}{" "}
                indications)
              </p>
            </FlexDiv>
          ),
        }));
      setDiseaseGroupText(diseaseGroupText);
      setDiseaseGroupSelect(diseaseGroupText[0]);
      setAllData(allData);
    };
    getDistinctData();
  }, [props.data]);

  // data for the page (only one disease group)
  const data = allData.filter(
    (node) => node.Disease_Group === diseaseGroupSelect.value
  );

  // get indication names for this disease group and create data
  const indicationNames = data.map((node) => node.Indication_Name);
  const distinctIndicationNames = [...new Set(indicationNames)];
  const distintIndicationData = distinctIndicationNames.map((name) => {
    const indicationData = data.filter((node) => node.Indication_Name === name);
    return {
      name: name,
      data: indicationData,
      approvedCount: indicationData.filter((node) =>
        node.Current_Phase.toLowerCase().includes("approved")
      ).length,
    };
  });

  // create components for each indication data
  const boxes = distintIndicationData
    .sort((a, b) => {
      if (alphabetic) {
        return a.name.localeCompare(b.name);
      } else {
        return b.approvedCount - a.approvedCount;
      }
    })
    .map((x) => (
      <IndicationComponent name={x.name} data={x.data} key={x.name} />
    ));

  const onRadioChange = (e) => {
    console.log("radio checked", e.target.value);
    setAlphabetic(e.target.value);
  };

  return (
    <main>
      <MobileDiv>
        <h1>Please use desktop or tablet (landscape) to view this page.</h1>
      </MobileDiv>
      <HeaderWrapper>
        <h1>Peptide Therapeutics Landscape</h1>
        <h2>Non Blood Sugar and Infectious Diseases</h2>
        <HeaderDiv>
          <DropdownWrapper>
            <DropdownDiv>
              <h3>Disease Group</h3>
              <Select
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                options={diseaseGroupText}
                onChange={(e) =>
                  setDiseaseGroupSelect({ value: e.value, label: e.label })
                }
                value={diseaseGroupSelect}
              />
            </DropdownDiv>
            <RadioDiv>
              <h3>Sort Indications</h3>
              <Radio.Group
                defaultValue={false}
                // buttonStyle="solid"
                onChange={onRadioChange}
              >
                <Radio.Button value={false}>Most Approvals</Radio.Button>
                <Radio.Button value={true}>Alphabetical</Radio.Button>
              </Radio.Group>
            </RadioDiv>
          </DropdownWrapper>
          <MapLegend />
        </HeaderDiv>
      </HeaderWrapper>
      <div style={{ paddingBottom: "50px" }}>
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
