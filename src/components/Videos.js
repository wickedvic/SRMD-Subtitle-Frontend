import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, TextField } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VideoEditor from "./editComponent/videoEditor";
import { Link } from "react-router-dom";

const Videos = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function createData(vidURL, srtURL, orginalLanguage) {
    return { vidURL, srtURL, orginalLanguage };
  }

  const rows = [
    createData("xyz.com", "srt123.com", "English"),
    createData("satsang123.com", "srt456.com", "Gujarati"),
    createData("satsangxyz.com", "srtxyz.com", "English"),
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
        Videos
      </h2>

      <Button
        variant="contained"
        style={{
          marginLeft: "1%",
          backgroundColor: "green",
        }}
        onClick={handleClickOpen}
      >
        Add A Video
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload A Video</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To Add A Video Please Fill Out The Form And Click Upload
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Video URL"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="English SRT URL"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Original Language"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={(e) => {
              console.log("Upload");
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 700 }}>Video URL</TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                English SRT File{" "}
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Original Language
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.vidURL}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{row.vidURL}</TableCell>
                <TableCell align="center">{row.srtURL}</TableCell>
                <TableCell align="center">{row.orginalLanguage}</TableCell>
                <TableCell align="center">
                  <Link
                    to="/videos/edit"
                    state={{ videoData: row }}
                    // to={{
                    //   pathname: "/videos/edit",
                    //   state: { name: "abc" },
                    // }}
                  >
                    <Button>
                      <EditIcon />
                    </Button>
                  </Link>
                  <Button>
                    <DeleteIcon style={{ color: "darkred" }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Videos;
