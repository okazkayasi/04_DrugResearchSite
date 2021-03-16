import React from "react";
import styled from "styled-components";

import Drop from "../icons/drops";
import Inhaler from "../icons/inhaler";
import Injection from "../icons/injection";
import IV from "../icons/IV";
import Pill from "../icons/Pill";
import Spray from "../icons/spray";
import Topical from "../icons/topical";
import Standard from "../icons/standard";

const ColoredDiv = styled.div`
  background-color: ${(props) =>
    props.level === 3 ? "#34FF23" : props.level === 2 ? "#EAF990" : "#E84941"};
  border-radius: 2px;
  opacity: 1;
  max-width: 20px;
  height: 20px;
  text-align: center;
  margin: auto;
`;

const MapWrapper = styled.div`
  background-color: white;
  padding: 10px 20px;
  opacity: 1;

  th {
    border-bottom: 1px black solid;
  }
  th:first-child {
    padding-right: 20px;
  }
  td {
    padding-top: 5px;
    border-bottom: 1px black solid;
  }
  td:nth-child(2) {
    padding-left: 10px;
  }
  .empty {
    width: 10px;
    padding: 0;
    border: none;
  }
`;

const MapLegend = (props) => (
  <MapWrapper>
    <h2>MAP LEGEND</h2>
    <table>
      <tbody>
        <tr>
          <th colSpan={3}>ROUTE OF ADMINISTRATION</th>
          <th colSpan={2}>QUALITY OF SAB, VC FUNDERS & PUBLIC HOLDERS</th>
        </tr>
        <tr>
          <td>
            <Pill />
          </td>
          <td>Oral (PO)</td>
          <td className="empty"></td>
          <td>
            <ColoredDiv level={1}>
              <p>1</p>
            </ColoredDiv>
          </td>
          <td>Low Quality</td>
        </tr>
        <tr>
          <td>
            <Injection />
          </td>
          <td>Injection (including IM, SQ)</td>
          <td className="empty"></td>
          <td>
            <ColoredDiv level={2}>
              <p>2</p>
            </ColoredDiv>
          </td>
          <td>Average Quality</td>
        </tr>
        <tr>
          <td>
            <IV />
          </td>
          <td>Intravenous (IV)</td>
          <td className="empty"></td>
          <td>
            <ColoredDiv level={3}>
              <p>3</p>
            </ColoredDiv>
          </td>
          <td>High Quality</td>
        </tr>
        <tr>
          <td>
            <Spray />
          </td>
          <td>Intranasal</td>
          <td className="empty"></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>
            <Inhaler />
          </td>
          <td>Inhaled</td>
          <td className="empty"></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>
            <Topical />
          </td>
          <td>Topical</td>
          <td className="empty"></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>
            <Drop />
          </td>
          <td>Intraocular</td>
          <td className="empty"></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>
            <Standard />
          </td>
          <td>Standard of Care</td>
          <td className="empty"></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </MapWrapper>
);

export default MapLegend;
