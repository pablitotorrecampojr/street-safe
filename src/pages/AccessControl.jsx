import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Aside from "../components/Aside";
import Navbar from "../components/NavBar";
import accountSetting from "../constants/account-setting.json";
import districtLists from "../constants/districts.json";
import { useTable } from "react-table";

const AccessControl = () => {
  const [userData, setUserData] = useState([]);

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "index",
      },
      {
        Header: "Name",
        accessor: "fullname",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }) => accountSetting.role[value] || "N/A",
      },
      {
        Header: "Municipality",
        accessor: "municipality",
        Cell: ({ row }) =>
          row.original.barangay ? row.original.municipality : "N/A",
      },
      {
        Header: "Barangay",
        accessor: "barangay",
        Cell: ({ value }) => value || "N/A",
      },
      {
        Header: "District",
        accessor: "district",
        Cell: ({ value }) =>
          value
            ? `${districtLists.districts[value]?.district || "N/A"} / ${
                districtLists.districts[value]?.code || "N/A"
              }`
            : "N/A",
      },
      {
        Header: "Registration Date",
        accessor: "createdAt",
        Cell: ({ value }) => {
          if (value) {
            const date = new Date(value);
            const month = date.toLocaleString("en-US", { month: "long" });
            const day = String(date.getDate()).padStart(2, "0");
            const year = date.getFullYear();
            return `${month} ${day}, ${year}`;
          }
          return "N/A";
        },
      },
    ],
    []
  );

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc, index) => ({
        index: index + 1,
        id: doc.id,
        ...doc.data(),
      }));
      setUserData(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: userData,
  });

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Aside />
        <div className="layout-page">
          <Navbar />

          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row">
                <div className="col-md-3 mb-4">
                  <h1 style={{ fontSize: "20px" }} className="fw-bold">
                    Access Control
                  </h1>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <table {...getTableProps()} className="table table-striped">
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr
                          key={headerGroup.id || Math.random()}
                          {...headerGroup.getHeaderGroupProps()}
                        >
                          {headerGroup.headers.map((column) => (
                            <th
                              key={column.id || column.accessor}
                              {...column.getHeaderProps()}
                            >
                              {column.render("Header")}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {rows.map((row) => {
                        prepareRow(row);
                        return (
                          <tr
                            key={row.id || row.original.id}
                            {...row.getRowProps()}
                          >
                            {row.cells.map((cell) => (
                              <td
                                key={cell.column.id || cell.column.accessor}
                                {...cell.getCellProps()}
                              >
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle"></div>
    </div>
  );
};

export default AccessControl;