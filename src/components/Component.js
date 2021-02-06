import { graphql, useStaticQuery } from "gatsby";
import React, { useState, useEffect } from "react"

const Component = ({ diseaseGroup }) => {
  console.log(diseaseGroup, "pr");
  // query MyQuery ($diseaseGroup: String){
  //   allDataCsv (filter: {Disease_Group: {eq: $diseaseGroup } ){
  const data2 = useStaticQuery(graphql`
    query MyQuery {
      allDataCsv {
        edges {
          node {
            Target
            Event_Phase
            Designations
          }
        }
      }
    }
  `);
  console.log(data2, "d2");

  return null;
};

export default Component;
