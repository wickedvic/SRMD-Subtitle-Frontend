import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { MaterialReactTable } from "material-react-table";
import "../App.css";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://speechtotexteditor.azurewebsites.net/api/v1/users")
      .then((response) => {
        setUsers(response.data.reverse());
      })
      .catch((e) => {
        console.log("ERROR", e);
      });
  }, []);

  const userColumns = [
    {
      header: "First Name",
      accessorKey: "firstName",
    },
    {
      header: "Last Name",
      accessorKey: "lastName",
      Cell: ({ cell }) => {
        const props = cell.row.original;
        return <>{moment(props.createdAt).format("MM/DD/YYYY hh:mm:ss A")}</>;
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      Cell: ({ cell }) => {
        const props = cell.row.original;
        return <>{moment(props.updatedAt).format("MM/DD/YYYY hh:mm:ss A")}</>;
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      Cell: ({ cell }) => {
        const props = cell.row.original;
        return <>{moment(props.createdAt).format("MM/DD/YYYY hh:mm:ss A")}</>;
      },
    },
  ];

  return (
    <div>
      <h2
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "1%",
        }}
      >
        Users
      </h2>

      <div style={{ margin: "1%" }}>
        <MaterialReactTable
          enableStickyHeader={true}
          muiTablePaperProps={{
            sx: {
              boxShadow: "none !important",
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: "#0D4B79",
              color: "white",
              borderLeft: "0.1px solid #CCC",
            },
          }}
          muiTableContainerProps={{
            sx: {
              boxShadow: "none !important",
              borderRadius: "7px",
              overflowX: "scroll",
              perspective: "1px",
            },
          }}
          muiTopToolbarProps={{
            sx: {
              backgroundColor: "#FFF !important",
            },
          }}
          muiBottomToolbarProps={{
            sx: {
              backgroundColor: "#FFF",
            },
          }}
          muiTableHeadCellColumnActionsButtonProps={{
            sx: {
              color: "white",
            },
          }}
          muiDataTablePagination={{
            styleOverrides: {
              root: {
                marginTop: 1,
                p: {
                  marginTop: 14,
                },
              },
            },
          }}
          enableColumnOrdering={false}
          enableRowSelection={false}
          enablePinning={false}
          enableSelectAll={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableColumnFilters={false}
          enableColumnActions={false}
          enableSorting={false}
          enableGlobalFilter={true}
          enablePagination={true}
          enableDensityToggle={true}
          columns={userColumns}
          data={users}
          selectAllMode="page"
          initialState={{
            pagination: { pageSize: 5, pageIndex: 0 },
          }}
          state={{ isLoading: users.length === 0 ? true : false }}
        />
      </div>
    </div>
  );
};

export default Users;
