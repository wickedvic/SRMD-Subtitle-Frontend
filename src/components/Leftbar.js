import React, { useState } from 'react';
import '../css/leftbar.css';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    TextField,
} from '@mui/material';

import Swal from 'sweetalert2';
import axios from 'axios';

export const Leftbar = ({ setOpenFileDialog, openFileDialog, setFileUploading }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const [filenameinput, setFilenameinput] = useState(`New Folder ${Math.floor(Math.random() * 100)}`);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    async function fileCreateHandle() {
        setOpenDialog(false);
        setFileUploading(true);
        let userData = JSON.parse(localStorage.getItem('authUser'));

        await axios
            .post(
                process.env.REACT_APP_API_URL + `/api/v1/filesystem/`,
                {
                    name: filenameinput,
                    isFolder: true,
                    data: '',
                },

                {
                    headers: { email: userData.email, access: userData.access },
                },
            )
            .then(function (response) {
                setFileUploading(false);
                Swal.fire({
                    title: 'Folder Successfully Created!',
                    text: 'Your folder has been created!',
                    icon: 'success',
                    confirmButtonText: 'Close',
                }).then((result) => {
                    if (result.isConfirmed) {
                        setFilenameinput(`New Folder ${Math.floor(Math.random() * 100)}`);

                        window.location.reload();
                    }
                });
            })
            .catch(function (error) {
                setFileUploading(false);
                console.log(error);
            });
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div className="leftbar">
            <button
                onClick={handleClick}
                style={{
                    width: '8%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F0F5FF',
                    outline: 'none',
                    border: 'none',
                    height: '39px',
                    borderRadius: '32px',
                    marginLeft: '22px',
                    cursor: 'pointer',
                    marginBottom: '17px',
                    marginTop: '15px',
                    color: 'inherit',
                }}
            >
                <AddIcon style={{ width: '27px', height: '25px', marginRight: '6px', marginLeft: '-9px' }} />
                New
            </button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Comic Neue',
                    }}
                    onClick={() => {
                        handleClickOpenDialog();
                        handleClose();
                    }}
                >
                    <CreateNewFolderIcon style={{ width: '21px', height: '20px', marginRight: '15px' }} />
                    <p>New Folder</p>
                </MenuItem>

                <label htmlFor="fileup">
                    <MenuItem
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'Comic Neue',
                        }}
                        onClick={(e) => {
                            setOpenFileDialog(true);
                            handleClose();
                        }}
                    >
                        <UploadFileIcon style={{ width: '21px', height: '20px', marginRight: '15px' }} />
                        <p>File Upload</p>
                    </MenuItem>
                </label>
            </Menu>
            <Dialog fullWidth open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle sx={{ fontFamily: 'Roboto Flex' }}>
                    <p style={{ fontFamily: 'Roboto Flex' }}>New Folder</p>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <TextField
                        InputProps={{ style: { fontSize: 13.9, fontFamily: 'Roboto Flex' } }}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Folder Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={filenameinput}
                        onChange={(e) => setFilenameinput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <button
                        onClick={handleCloseDialog}
                        style={{
                            width: '18%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#F0F5FF',
                            outline: 'none',
                            border: 'none',
                            height: '39px',
                            borderRadius: '32px',
                            marginLeft: '22px',
                            cursor: 'pointer',
                            marginBottom: '17px',
                            marginTop: '15px',
                            color: 'inherit',
                        }}
                    >
                        <p>Cancel</p>
                    </button>
                    <button
                        onClick={fileCreateHandle}
                        style={{
                            width: '18%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#F0F5FF',
                            outline: 'none',
                            border: 'none',
                            height: '39px',
                            borderRadius: '32px',
                            marginLeft: '22px',
                            cursor: 'pointer',
                            marginBottom: '17px',
                            marginTop: '15px',
                            color: 'inherit',
                            marginRight: '9px',
                        }}
                    >
                        <p>Create</p>
                    </button>
                </DialogActions>
            </Dialog>
            {/* <NavLink
                to="/mydrive"
                className={'tags lightactive'}
                style={{
                    marginLeft: '22px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: '7px',
                    marginTop: '7px',
                    textDecoration: 'none',
                    height: '35px',
                    paddingLeft: '9px',
                    borderRadius: '3px 25px 25px 3px',
                    textDecorationColor: 'none',
                    color: 'inherit',
                    fontSize: '12.5px',
                }}
            >
                <AddToDriveOutlinedIcon style={{ width: '23px', height: '22px', marginRight: '15px' }} />
                My Drive
            </NavLink> */}
        </div>
    );
};
