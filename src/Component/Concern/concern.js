import React, { useState, useEffect } from "react";
import { Dropdown, Table, Button } from "react-bootstrap";
import { GetRaisedConcernsNetworkForSidebar } from "../../api/api";

function Concern() {
  const [invoicesData, setInvoicesData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(invoicesData, "get raise concern");
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await GetRaisedConcernsNetworkForSidebar();
        if (Array.isArray(data.dataItems)) {
          setInvoicesData(data.dataItems);
        } else {
          setInvoicesData([]);
        }
      } catch (err) {
        console.error("Failed to load invoice data", err);
        setInvoicesData([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div>
      {" "}
      <div className="container mt-4">
        <div className="netwrok_table_main_content">
         <h5 className="fw-bold my-3">Concerns Cases</h5>
          <div className="table-responsive">
            <Table className="bg-white text-center border-0 network_table">
              <thead style={{ backgroundColor: "#EEF4FF" }}>
                <tr className="text-dark fw-semibold table_th_border">
                  <th className="border-start" style={{ whiteSpace: "nowrap" }}>
                    Customer Name
                  </th>
                   <th style={{ whiteSpace: "nowrap" }}>SRN no</th>
                  <th style={{ whiteSpace: "nowrap" }}>Created Date</th>
                  <th style={{ whiteSpace: "nowrap" }}>Time</th>
                  <th style={{ whiteSpace: "nowrap" }}>Status</th>
                  <th style={{ whiteSpace: "nowrap" }}>Remark Category</th>
                  <th style={{ whiteSpace: "nowrap" }}>Remark Issue</th>
                  <th style={{ whiteSpace: "nowrap" }}>Image</th>
                 
                </tr>
              </thead>
              <tbody>
                {invoicesData.length > 0 ? (
                  invoicesData.map((item, index) => (
                    <tr
                      key={index}
                      className="text-center border-bottom network_td_item"
                    >
                      <td className="border-start align-middle">
                        Customer {index + 1}
                      </td>
                      <td className="align-middle">{item.srN_No}</td>
                      <td className="align-middle">
                        {item.created_Date ?? "--"}
                      </td>
                      <td className="align-middle">{item.time ?? "--"} </td>
                      <td className="align-middle">{item.status ?? "--"}</td>
                      <td className="align-middle">
                        {item.remarkCategory ?? "--"}
                      </td>
                      <td className="align-middle">
                        {item.remarkIssue ?? "--"}
                      </td>
                      <td className="align-middle  border-end" >
                        <img
                          src={`https://mintflix.live:8086/uploads/${item.image}`}
                          alt="Concern"
                          style={{
                            width: "60px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      {loading ? "Loading..." : "No data available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Concern;
