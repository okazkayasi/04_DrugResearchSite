import React from "react";
import styled from "styled-components";
import { Table } from "antd";
import "./IndicationComponent.css";

import Drop from "../icons/drops";
import Inhaler from "../icons/inhaler";
import Injection from "../icons/injection";
import IV from "../icons/IV";
import Pill from "../icons/Pill";
import Spray from "../icons/spray";
import Topical from "../icons/topical";

const WrapperBox = styled.div`
  border: 1px solid #000000;
  border-radius: 20px;
  padding: 30px 10px;
  min-height: ${(props) => (props.large ? "1176px" : "unset")};
`;

const ColoredDiv = styled.div`
  background-color: ${(props) =>
    props.level === 3 ? "#34FF23" : props.level === 2 ? "#EAF990" : "#E84941"};
  border-radius: 2px;
  width: 20px;
  height: 20px;
  text-align: center;
  margin: auto;
`;

const svgSelector = (admin) => {
  const dropList = [
    "Intraocular",
    "Intraocular/Subretinal/Subconjunctival",
    "Subconjunctival",
    "Subretinal",
  ];
  const inhalerList = ["Inhaled"];
  const injectionList = [
    "Injection",
    "Intramuscular (IM)",
    "Subcutaneous (SQ)",
    "Intradermal",
    "Intraarticular",
    "Intrathecal",
    "Intratracheal",
    "Intratumoral",
    "Intratympanic",
    "Percutaneous Catheter",
    "Percutaneous Catheter/Injection",
  ];
  const ivList = ["Intravenous (IV)"];
  const pillList = [
    "Oral (PO)",
    "Oral Transmucosal",
    "Sublingual (SL)",
    "Sublingual (SL)/Oral Transmucosal",
  ];
  const sprayList = ["Intranasal"];
  const topicalList = ["Topical"];

  let selectionSvg;
  if (admin.split(", ").find((ad) => dropList.includes(ad)))
    selectionSvg = <Drop />;
  else if (admin.split(", ").find((ad) => inhalerList.includes(ad)))
    selectionSvg = <Inhaler />;
  else if (admin.split(", ").find((ad) => injectionList.includes(ad)))
    selectionSvg = <Injection />;
  else if (admin.split(", ").find((ad) => ivList.includes(ad)))
    selectionSvg = <IV />;
  else if (admin.split(", ").find((ad) => pillList.includes(ad)))
    selectionSvg = <Pill />;
  else if (admin.split(", ").find((ad) => sprayList.includes(ad)))
    selectionSvg = <Spray />;
  else if (admin.split(", ").find((ad) => topicalList.includes(ad)))
    selectionSvg = <Topical />;
  else if (admin === "N/A") selectionSvg = <p>{`-`}</p>;
  else selectionSvg = admin;
  return selectionSvg || "-----";
};

const IndicationComponent = (props) => {
  const dataSource = props.data;

  const columns = [
    {
      title: "Phase",
      dataIndex: "Current_Phase",
      key: "Current_Phase",
      width: "10px",
    },
    {
      title: "Molecule",
      dataIndex: "Molecule",
      key: "Molecule",
      width: "10px",
    },
    {
      title: "Admin",
      key: "Route_of_Administration",
      render: (text, record) => svgSelector(record.Route_of_Administration),
      width: "10px",
    },
    {
      title: "Target",
      dataIndex: "Target",
      key: "Target",
      width: 10,
    },
    {
      title: "Company and Asset",
      key: "Company_Asset",
      render: (text, record) => (
        <p>
          {record.Lead_Company_Name} <b>({record.Drug_Name})</b>
        </p>
      ),
      width: "10px",
    },
    {
      title: "Ticker",
      dataIndex: "Ticker",
      key: "Ticker",
      width: "10px",
    },
    {
      title: "SAB",
      key: "SAB",
      render: (text, record) => (
        <ColoredDiv level={record.SAB}>
          <p>{record.SAB}</p>
        </ColoredDiv>
      ),
      width: "10px",
    },
    {
      title: "Venture Funders",
      key: "Venture_Funders",
      render: (text, record) => (
        <ColoredDiv level={record.Venture_Funders}>
          <p>{record.Venture_Funders}</p>
        </ColoredDiv>
      ),
      width: "10px",
    },
    {
      title: "Public Holders",
      key: "Public_Holders",
      render: (text, record) => (
        <ColoredDiv level={record.Public_Holders}>
          <p>{record.Public_Holders}</p>
        </ColoredDiv>
      ),
      width: "10px",
    },
  ];

  return (
    <WrapperBox large={props.data.length > 10 ? true : false}>
      <h2>{props.name}</h2>
      <Table dataSource={dataSource} columns={columns} />
    </WrapperBox>
  );
};

export default IndicationComponent;
