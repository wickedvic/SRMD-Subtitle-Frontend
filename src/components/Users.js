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

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://speechtotexteditor.azurewebsites.net/api/v1/users")
      .then((response) => {
        console.log("USE EFFECT", response.data);
        setUsers(response.data);
      })
      .catch((e) => {
        console.log("ERROR", e);
      });
  }, []);

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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 700 }}>First Name</TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Last Name
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Email
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Created At
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{row.firstName}</TableCell>
                <TableCell align="center">{row.lastName}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">
                  {moment(row.createdAt).format("MM/DD/YYYY hh:mm:ss A")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
