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

const quarterMaker = (dateString) => {
  // console.log(dateString, "datestringg");
  if (dateString === "") return -1;
  const year = dateString.split("/")[2].slice(2);
  const month = parseInt(dateString.split("/")[0]);
  const quarter =
    month <= 3 ? "1Q" : month <= 6 ? "2Q" : month <= 9 ? "3Q" : "4Q";

  return quarter + year;
};

const quarterGet = (record) => {
  const dateList = [
    record.Phase_I_Date,
    record.Phase_I_Event_Date,
    record.Phase_II_Date,
    record.Phase_II_Event_Date,
    record.Phase_III_Date,
    record.Phase_III_Event_Date,
  ].filter((a) => a !== "");

  if (dateList.length === 0) return "-";
  // console.log(dateList, record.Ticker);

  const dateString = dateList.reduce((a, b) =>
    new Date(a.MeasureDate) > new Date(b.MeasureDate) ? a : b
  );

  if (!dateString) return "";
  return quarterMaker(dateString);
};

const quarterComparer = (record) => {
  const val = quarterGet(record);
  if (val === "-") return 0;
  const year = val.slice(2);
  const quarter = val[0];
  return parseInt(year + quarter);
};

const WrapperBox = styled.div`
  border: 1px solid #000000;
  border-radius: 20px;
  padding: 30px 10px;
  min-height: ${(props) => (props.large ? "1176px" : "unset")};
  h2 {
    text-align: center;
  }
`;

const TableContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
  else if (admin === "N/A") selectionSvg = <p>{`?`}</p>;
  else selectionSvg = admin;
  return selectionSvg || "?";
};

const IndicationComponent = (props) => {
  const dataSource = props.data.sort((a, b) => {
    if (a.Current_Phase.toLowerCase().includes("approved")) return -1;
    return 1;
    // -b.Current_Phase.includes("approved");
  });
  const newDataSource = props.newData.sort((a, b) => {
    if (a.Current_Phase.toLowerCase().includes("approved")) return -1;
    return 1;
    // -b.Current_Phase.includes("approved");
  });

  const columns = [
    {
      title: "Phase",
      dataIndex: "Current_Phase",
      key: "Current_Phase",
      width: "10px",
      filters: [...new Set(dataSource.map((a) => a.Current_Phase))].map(
        (item) => ({
          text: item,
          value: item,
        })
      ),
      onFilter: (value, record) => record.Current_Phase === value,
    },
    {
      title: "Latest Data",
      key: "Latest_Data",
      render: (text, record) => quarterGet(record),
      width: "10px",
      sorter: (a, b) => quarterComparer(a) - quarterComparer(b),
      sortDirections: ["descend", "ascend"],
      align: "center",
    },

    {
      title: "Molecule",
      dataIndex: "Molecule",
      key: "Molecule",
      width: "10px",
      filters: [...new Set(dataSource.map((a) => a.Molecule))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.Molecule === value,
      align: "center",
    },
    {
      title: "Admin",
      key: "Route_of_Administration",
      render: (text, record) => svgSelector(record.Route_of_Administration),
      width: "10px",
    },
    {
      title: "Target",
      render: (text, record) =>
        record.Target.length > 50
          ? record.Target.slice(0, 50) + "..."
          : record.Target,
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
      sorter: (a, b) => a.Ticker.localeCompare(b.Ticker),
      align: "center",
    },
  ];

  const columnsAdded = [
    ...columns,
    {
      title: "SAB",
      key: "SAB",
      render: (text, record) => (
        <ColoredDiv level={record.SAB}>
          <p>{record.SAB}</p>
        </ColoredDiv>
      ),
      width: "10px",
      sorter: (a, b) => a.SAB - b.SAB,
      align: "center",
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
      sorter: (a, b) => a.Venture_Funders - b.Venture_Funders,
      align: "center",
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
      sorter: (a, b) => a.Public_Holders - b.Public_Holders,
      align: "center",
    },
  ];

  return (
    <WrapperBox large={props.data.length > 10 ? true : false}>
      <h2>
        {props.name} ({props.data.length} drugs)
      </h2>
      <TableContainer>
        <div>
          <h3>Peptides and Peptidomimetics</h3>
          <Table
            dataSource={dataSource}
            columns={columnsAdded}
            rowClassName={(r, i) =>
              r.Current_Phase.toLowerCase().includes("approved")
                ? "approved"
                : null
            }
          />
        </div>
        {newDataSource.length > 0 && (
          <div>
            <h3>Other Modalities</h3>
            <Table
              dataSource={newDataSource}
              columns={columns}
              rowClassName={(r, i) =>
                r.Current_Phase.toLowerCase().includes("approved")
                  ? "approved"
                  : null
              }
            />
          </div>
        )}
      </TableContainer>
    </WrapperBox>
  );
};

export default IndicationComponent;
