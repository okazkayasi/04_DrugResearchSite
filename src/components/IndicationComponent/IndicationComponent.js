import React from "react";
import styled from "styled-components";
import { Table } from "antd";

const WrapperBox = styled.div`
  border: 1px solid #000000;
  border-radius: 20px;
  padding: 30px;
`;

const IndicationComponent = (props) => {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  return (
    <WrapperBox>
      <h2>{props.name}</h2>
      <Table dataSource={dataSource} columns={columns} />;
    </WrapperBox>
  );
};

export default IndicationComponent;
