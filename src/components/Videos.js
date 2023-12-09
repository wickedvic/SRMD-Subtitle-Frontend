import React, { useState, useEffect } from "react";
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
import { Link } from "react-router-dom";
import { BlobServiceClient } from "@azure/storage-blob";
import { FileUploader } from "react-drag-drop-files";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

const Videos = () => {
  const [file, setFile] = useState(null);
  const fileTypes = ["MP4"];
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);

  async function UploadFile() {
    const new_file = new File(
      [file],
      `${file.name.split(".mp4")[0]}-${Date.now()}.mp4`,
      { type: file.type, lastModified: file.lastModified }
    );

    // console.log(file);

    // console.log(new_file);

    // let storageAccountName = "srmdmediastorage";
    // let sasToken =
    //   "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-03-15T14:03:32Z&st=2023-12-09T07:03:32Z&spr=https&sig=WyQQ92Il4ugjfPpXhNSSFOb4N4Ij9%2FD%2Fx2%2BxL%2BzHh54%3D";
    // const blobService = new BlobServiceClient(
    //   `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    // );

    // const containerClient = blobService.getContainerClient("video");
    // await containerClient.createIfNotExists({
    //   access: "container",
    // });

    // const blobClient = containerClient.getBlockBlobClient(new_file.name);

    // const options = { blobHTTPHeaders: { blobContentType: new_file.type } };

    // await blobClient.uploadBrowserData(new_file, options);

    axios
      .post("https://speechtotexteditor.azurewebsites.net/api/v1/videos", {
        videoUrl: `https://srmdmediastorage.blob.core.windows.net/video/${new_file.name}`,
      })
      .then(function (response) {
        console.log(response);

        Swal.fire({
          title: "File Upload Successful!",
          text: "Your video has been uploaded!",
          icon: "success",
          confirmButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            setFile(null);
            window.location.reload();
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  useEffect(() => {
    axios
      .get("https://speechtotexteditor.azurewebsites.net/api/v1/videos")
      .then((response) => {
        console.log(response.data);
        setRows(response.data);
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
          <br></br>
          <FileUploader
            handleChange={(file) => {
              setFile(file);
            }}
            name="file"
            types={fileTypes}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={file === null}
            onClick={(e) => {
              UploadFile(e);
              setOpen(false);
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
                Created At
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Updated At
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Status
              </TableCell>
              <TableCell align="center" style={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{row.videoUrl}</TableCell>
                <TableCell align="center">
                  {moment(row.createdAt).format("MM/DD/YYYY hh:mm:ss A")}
                </TableCell>
                <TableCell align="center">
                  {moment(row.updatedAt).format("MM/DD/YYYY hh:mm:ss A")}
                </TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell align="center">
                  {row.subtitleString === "" || row.status === "PROCESSING" ? (
                    <Button disabled={true}>
                      <EditIcon />
                    </Button>
                  ) : (
                    <Link
                      to="/videos/edit"
                      state={{ videoData: row }}
                      onClick={(e) => {
                        localStorage.removeItem("timelineProps");
                        localStorage.removeItem("checkedForDelete");
                        // window.location.href = "/videos/edit";
                      }}
                    >
                      <Button>
                        <EditIcon />
                      </Button>
                    </Link>
                  )}

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
