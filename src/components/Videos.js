import React, { useState, useEffect } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import { Backdrop, Box, Button, CircularProgress, Tooltip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { MaterialReactTable } from 'material-react-table';
import moment from 'moment';
import { FileUploader } from 'react-drag-drop-files';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import AddIcon from '@mui/icons-material/Add';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import '../App.css';
import { Leftbar } from './Leftbar';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';

export const AppContext = React.createContext();

const Videos = () => {
    const navigate = useNavigate();
    const [folderStep, setFolderStep] = useState(0);
    const [folders, setFolders] = useState([]);
    const [filesStep0, setFilesStep0] = useState([]);
    const [folderName, setFolderName] = useState('');
    const [fileListAttr, setFileListAttr] = useState([]);
    const [file, setFile] = useState(null);
    const fileTypes = ['MP4'];
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [fileUploading, setFileUploading] = useState(false);

    async function UploadFile() {
        setFileUploading(true);
        const new_file = new File([file], `${file.name.split('.mp4')[0]}-${Date.now()}.mp4`.replace(/\s/g, ''), {
            type: file.type,
            lastModified: file.lastModified,
        });

        let storageAccountName = 'srmdmediastorage';
        let sasToken =
            'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-03-15T14:03:32Z&st=2023-12-09T07:03:32Z&spr=https&sig=WyQQ92Il4ugjfPpXhNSSFOb4N4Ij9%2FD%2Fx2%2BxL%2BzHh54%3D';
        const blobService = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net/?${sasToken}`);

        const containerClient = blobService.getContainerClient('video');
        await containerClient.createIfNotExists({
            access: 'container',
        });

        const blobClient = containerClient.getBlockBlobClient(new_file.name);

        const options = { blobHTTPHeaders: { blobContentType: new_file.type } };

        await blobClient.uploadBrowserData(new_file, options);

        axios
            .post(process.env.REACT_APP_API_URL + '/api/v1/videos', {
                videoUrl: `https://srmdmediastorage.blob.core.windows.net/video/${new_file.name}`,
            })
            .then(function (response) {
                setFileUploading(false);
                // console.log(response);

                Swal.fire({
                    title: 'File Upload Successful!',
                    text: 'Your video has been uploaded!',
                    icon: 'success',
                    confirmButtonText: 'Close',
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

    async function UploadFileUsers() {
        setFileUploading(true);
        const new_file = new File([file], `${file.name.split('.mp4')[0]}-${Date.now()}.mp4`.replace(/\s/g, ''), {
            type: file.type,
            lastModified: file.lastModified,
        });

        let storageAccountName = 'srmdmediastorage';
        let sasToken =
            'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-03-15T14:03:32Z&st=2023-12-09T07:03:32Z&spr=https&sig=WyQQ92Il4ugjfPpXhNSSFOb4N4Ij9%2FD%2Fx2%2BxL%2BzHh54%3D';
        const blobService = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net/?${sasToken}`);

        const containerClient = blobService.getContainerClient('video');
        await containerClient.createIfNotExists({
            access: 'container',
        });

        const blobClient = containerClient.getBlockBlobClient(new_file.name);

        const options = { blobHTTPHeaders: { blobContentType: new_file.type } };

        await blobClient.uploadBrowserData(new_file, options);

        let userData = JSON.parse(localStorage.getItem('authUser'));

        axios
            .post(process.env.REACT_APP_API_URL + '/api/v1/videos', {
                videoUrl: `https://srmdmediastorage.blob.core.windows.net/video/${new_file.name}`,
            })
            .then(function (response) {
                axios
                    .post(
                        process.env.REACT_APP_API_URL + `/api/v1/filesystem/${fileListAttr.name}`,
                        {
                            name: response.data.videoUrl,
                            isFolder: false,
                            data: response.data.id,
                        },

                        {
                            headers: { email: userData.email, access: userData.access },
                        },
                    )
                    .then(function (response) {
                        setFileUploading(false);
                        // console.log(response);

                        Swal.fire({
                            title: 'File Upload Successful!',
                            text: 'Your video has been uploaded!',
                            icon: 'success',
                            confirmButtonText: 'Close',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setFile(null);
                                window.location.reload();
                            }
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                        setFileUploading(false);
                    });
            })
            .catch(function (error) {
                console.log(error);
                setFileUploading(false);
            });
    }

    async function UploadFileUsersStep0() {
        setFileUploading(true);
        const new_file = new File([file], `${file.name.split('.mp4')[0]}-${Date.now()}.mp4`.replace(/\s/g, ''), {
            type: file.type,
            lastModified: file.lastModified,
        });

        let storageAccountName = 'srmdmediastorage';
        let sasToken =
            'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-03-15T14:03:32Z&st=2023-12-09T07:03:32Z&spr=https&sig=WyQQ92Il4ugjfPpXhNSSFOb4N4Ij9%2FD%2Fx2%2BxL%2BzHh54%3D';
        const blobService = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net/?${sasToken}`);

        const containerClient = blobService.getContainerClient('video');
        await containerClient.createIfNotExists({
            access: 'container',
        });

        const blobClient = containerClient.getBlockBlobClient(new_file.name);

        const options = { blobHTTPHeaders: { blobContentType: new_file.type } };

        await blobClient.uploadBrowserData(new_file, options);

        let userData = JSON.parse(localStorage.getItem('authUser'));

        await axios
            .post(process.env.REACT_APP_API_URL + '/api/v1/videos', {
                videoUrl: `https://srmdmediastorage.blob.core.windows.net/video/${new_file.name}`,
            })
            .then(async function (response) {
                await axios
                    .post(
                        process.env.REACT_APP_API_URL + `/api/v1/filesystem/`,
                        {
                            name: response.data.videoUrl,
                            isFolder: false,
                            data: response.data.id,
                        },

                        {
                            headers: { email: userData.email, access: userData.access },
                        },
                    )
                    .then(function (response) {
                        setFileUploading(false);
                        // console.log(response);

                        Swal.fire({
                            title: 'File Upload Successful!',
                            text: 'Your video has been uploaded!',
                            icon: 'success',
                            confirmButtonText: 'Close',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setFile(null);
                                window.location.reload();
                            }
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                        setFileUploading(false);
                    });
            })
            .catch(function (error) {
                console.log(error);
                setFileUploading(false);
            });
    }

    const handleClose = () => {
        setOpen(false);
        setFile(null);
        setFolderName('');
    };

    useEffect(() => {
        let userData = JSON.parse(localStorage.getItem('authUser'));

        if (userData.email === 'languages@srmd.org') {
            setFolderStep('Admin');
            axios
                .get(process.env.REACT_APP_API_URL + `/api/v1/videos`)
                .then((response) => {
                    setRows(response.data.reverse());
                })
                .catch((e) => {
                    console.log('ERROR', e);
                });
        } else {
            setFileUploading(true);
            axios
                .get(process.env.REACT_APP_API_URL + `/api/v1/filesystem/`, {
                    headers: { email: userData.email, access: userData.access },
                })
                .then((response) => {
                    let filteredData = response.data.filter((e) => e.isFolder === true);
                    setFolders(filteredData);

                    let files0Data = response.data.filter((e) => e.isFolder === false);

                    let idList = files0Data.map((e) => e.data);

                    if (idList.length > 0) {
                        axios
                            .get(process.env.REACT_APP_API_URL + `/api/v1/videos/all/${idList}`, {
                                headers: {
                                    email: userData.email,
                                    access: userData.access,
                                },
                            })
                            .then((response) => {
                                setFilesStep0(response.data);
                            })
                            .catch((e) => {
                                console.log('ERROR', e);
                            });
                    }

                    setFileUploading(false);
                })
                .catch((e) => {
                    console.log('ERROR', e);
                    setFileUploading(false);
                });
        }
    }, []);

    const folderColumns = [
        {
            header: 'Folder Name',
            accessorKey: 'name',
        },
        {
            header: 'Actions',
            accessorKey: 'actions',
            enableColumnActions: false,
            enableSorting: false,
            enableColumnFilter: false,
            size: 50, //min size enforced during resizing
            maxSize: 50,
            Cell: ({ cell }) => {
                const props = cell.row.original;
                return (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <Tooltip title="List Files">
                                <Button
                                    onClick={async (e) => {
                                        setFileUploading(true);
                                        let userData = JSON.parse(localStorage.getItem('authUser'));
                                        await axios
                                            .get(process.env.REACT_APP_API_URL + `/api/v1/filesystem/${props.name}`, {
                                                headers: { email: userData.email, access: userData.access },
                                            })
                                            .then(async (response) => {
                                                let idList = response.data.map((e) => e.data);

                                                if (idList.length > 0) {
                                                    await axios
                                                        .get(
                                                            process.env.REACT_APP_API_URL +
                                                                `/api/v1/videos/all/${idList}`,
                                                            {
                                                                headers: {
                                                                    email: userData.email,
                                                                    access: userData.access,
                                                                },
                                                            },
                                                        )
                                                        .then((response) => {
                                                            setRows(response.data.reverse());
                                                            setFileListAttr(props);
                                                            setFolderStep(1);
                                                        })
                                                        .catch((e) => {
                                                            console.log('ERROR', e);
                                                        });
                                                } else {
                                                    setRows([]);
                                                    setFileListAttr(props);
                                                    setFolderStep(1);
                                                }
                                            })

                                            .catch((e) => {
                                                console.log('ERROR', e);
                                            });

                                        setFileUploading(false);
                                    }}
                                >
                                    <FileCopyOutlinedIcon />
                                </Button>
                            </Tooltip>
                        </div>
                    </>
                );
            },
        },
    ];

    const videoColumns = [
        {
            header: 'Video Title',
            accessorKey: 'videoUrl',
            Cell: ({ cell }) => {
                const props = cell.row.original;
                return (
                    <>
                        {props.subtitleString === '' || props.status === 'PROCESSING' ? (
                            props.videoUrl.split('video/')[1]
                        ) : (
                            <Link
                                to="/videos/edit"
                                state={{ videoData: props }}
                                style={{ color: '#0000EE', cursor: 'pointer' }}
                                onClick={(e) => {
                                    localStorage.removeItem('videoProps');
                                    localStorage.removeItem('subtitle');
                                    localStorage.removeItem('timelineProps');
                                    localStorage.removeItem('checkedForDelete');
                                    localStorage.removeItem('lang');
                                    localStorage.setItem('videoProps', JSON.stringify(props));
                                    // window.location.href = "/videos/edit";
                                }}
                            >
                                {props.videoUrl.split('video/')[1]}
                            </Link>
                        )}
                    </>
                );
            },
        },
        {
            header: 'Created At',
            accessorKey: 'createdAt',
            Cell: ({ cell }) => {
                const props = cell.row.original;
                return <>{moment(props.createdAt).format('MM/DD/YYYY hh:mm:ss A')}</>;
            },
        },
        {
            header: 'Updated At',
            accessorKey: 'updatedAt',
            Cell: ({ cell }) => {
                const props = cell.row.original;
                return <>{moment(props.updatedAt).format('MM/DD/YYYY hh:mm:ss A')}</>;
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
        },

        {
            header: 'Actions',
            accessorKey: 'actions',
            enableColumnActions: false,
            enableSorting: false,
            enableColumnFilter: false,
            size: 50, //min size enforced during resizing
            maxSize: 400,
            Cell: ({ cell }) => {
                const props = cell.row.original;
                return (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <Button>
                                <DeleteIcon
                                    onClick={(e) => {
                                        Swal.fire({
                                            title: 'Do you want to delete the video?',
                                            showDenyButton: true,
                                            showCancelButton: true,
                                            confirmButtonText: 'Confirm',
                                            denyButtonText: `Don't Delete`,
                                        }).then((result) => {
                                            /* Read more about isConfirmed, isDenied below */
                                            if (result.isConfirmed) {
                                                setFileUploading(true);

                                                axios
                                                    .delete(
                                                        process.env.REACT_APP_API_URL + `/api/v1/videos/${props.id}`,
                                                    )
                                                    .then(function (response) {
                                                        setFileUploading(false);
                                                        // console.log(response);

                                                        Swal.fire({
                                                            title: 'Video Successfully Deleted!',
                                                            text: 'Your video has been deleted!',
                                                            icon: 'success',
                                                            confirmButtonText: 'Close',
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                window.location.reload();
                                                            }
                                                        });
                                                    })
                                                    .catch(function (error) {
                                                        console.log(error);
                                                        setFileUploading(false);
                                                    });
                                            } else if (result.isDenied) {
                                                Swal.fire('Video Not Deleted', '', 'info');
                                            }
                                        });
                                    }}
                                    style={{ color: 'darkred' }}
                                />
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];

    if (folderStep === 0) {
        return (
            <div>
                <Backdrop
                    sx={{
                        color: '#FFF',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={fileUploading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Upload A Video</DialogTitle>
                    <DialogContent>
                        <DialogContentText>To Add A Video Please Fill Out The Form And Click Upload</DialogContentText>
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
                                UploadFileUsersStep0(e);

                                setOpen(false);
                            }}
                        >
                            Upload
                        </Button>
                    </DialogActions>
                </Dialog>

                <div style={{ borderBottom: '1px solid #CCC' }}>
                    <button className="historyButton" onClick={(e) => {}} style={{ marginLeft: '1%', marginTop: '1%' }}>
                        MyDrive /
                    </button>

                    <br></br>
                </div>
                <Leftbar setOpenFileDialog={setOpen} openFileDialog={open} setFileUploading={setFileUploading} />

                <h4 style={{ marginLeft: '10px', fontWeight: 400 }}>Folders</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {folders.map((e) => (
                        <>
                            <Box
                                sx={{ border: 1, borderColor: 'divider' }}
                                className="folder"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    minWidth: '234px',
                                    maxWidth: '234px',
                                    height: '39px',
                                    borderRadius: '5px',
                                    marginRight: '10px',
                                    marginTop: '5px',
                                    marginLeft: '10px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                    width: 'fit-content',
                                }}
                                onClick={async () => {
                                    setFileUploading(true);
                                    let userData = JSON.parse(localStorage.getItem('authUser'));
                                    await axios
                                        .get(process.env.REACT_APP_API_URL + `/api/v1/filesystem/${e.name}`, {
                                            headers: { email: userData.email, access: userData.access },
                                        })
                                        .then(async (response) => {
                                            let idList = response.data.map((e) => e.data);

                                            if (idList.length > 0) {
                                                await axios
                                                    .get(
                                                        process.env.REACT_APP_API_URL + `/api/v1/videos/all/${idList}`,
                                                        {
                                                            headers: {
                                                                email: userData.email,
                                                                access: userData.access,
                                                            },
                                                        },
                                                    )
                                                    .then((response) => {
                                                        setRows(response.data.reverse());
                                                        setFileListAttr(e);
                                                        setFolderStep(1);
                                                    })
                                                    .catch((e) => {
                                                        console.log('ERROR', e);
                                                    });
                                            } else {
                                                setRows([]);
                                                setFileListAttr(e);
                                                setFolderStep(1);
                                            }
                                        })

                                        .catch((e) => {
                                            console.log('ERROR', e);
                                        });

                                    setFileUploading(false);
                                }}
                            >
                                <FolderIcon style={{ width: '20px', marginLeft: '9px' }} />
                                <p style={{ marginLeft: '9px', color: 'inherit' }}>{e.name}</p>
                            </Box>
                        </>
                    ))}
                </div>

                <h4 style={{ marginLeft: '10px', fontWeight: 400 }}>Files</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {filesStep0.map((e) => (
                        <>
                            {e.subtitleString === '' || e.status === 'PROCESSING' ? (
                                <Box
                                    sx={{ border: 1, borderColor: 'divider' }}
                                    className="folder"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        minWidth: '234px',
                                        height: '39px',
                                        borderRadius: '5px',
                                        marginRight: '10px',
                                        marginTop: '5px',
                                        marginLeft: '10px',
                                        marginBottom: '10px',
                                        opacity: 0.4,
                                        width: 'fit-content',
                                    }}
                                >
                                    <InsertDriveFileIcon style={{ width: '20px', marginLeft: '9px' }} />
                                    <p style={{ marginLeft: '9px', color: 'inherit' }}>
                                        {e.videoUrl.split('video/')[1]}
                                    </p>
                                </Box>
                            ) : (
                                <Box
                                    sx={{ border: 1, borderColor: 'divider' }}
                                    className="folder"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        minWidth: '234px',
                                        height: '39px',
                                        borderRadius: '5px',
                                        marginRight: '10px',
                                        marginTop: '5px',
                                        marginLeft: '10px',
                                        marginBottom: '10px',
                                        width: 'fit-content',
                                    }}
                                >
                                    <InsertDriveFileIcon style={{ width: '20px', marginLeft: '9px' }} />
                                    <p
                                        style={{ marginLeft: '9px', color: '#0000EE', cursor: 'pointer' }}
                                        onClick={async () => {
                                            navigate('/videos/edit');
                                            localStorage.removeItem('videoProps');
                                            localStorage.removeItem('subtitle');
                                            localStorage.removeItem('timelineProps');
                                            localStorage.removeItem('checkedForDelete');
                                            localStorage.removeItem('lang');
                                            localStorage.setItem('videoProps', JSON.stringify(e));
                                        }}
                                    >
                                        {e.videoUrl.split('video/')[1]}
                                    </p>

                                    <Button>
                                        <DeleteIcon
                                            onClick={() => {
                                                Swal.fire({
                                                    title: 'Do you want to delete the video?',
                                                    showDenyButton: true,
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Confirm',
                                                    denyButtonText: `Don't Delete`,
                                                }).then((result) => {
                                                    /* Read more about isConfirmed, isDenied below */
                                                    if (result.isConfirmed) {
                                                        setFileUploading(true);

                                                        axios
                                                            .delete(
                                                                process.env.REACT_APP_API_URL +
                                                                    `/api/v1/videos/${e.id}`,
                                                            )
                                                            .then(function (response) {
                                                                setFileUploading(false);
                                                                // console.log(response);

                                                                Swal.fire({
                                                                    title: 'Video Successfully Deleted!',
                                                                    text: 'Your video has been deleted!',
                                                                    icon: 'success',
                                                                    confirmButtonText: 'Close',
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        window.location.reload();
                                                                    }
                                                                });
                                                            })
                                                            .catch(function (error) {
                                                                console.log(error);
                                                                setFileUploading(false);
                                                            });
                                                    } else if (result.isDenied) {
                                                        Swal.fire('Video Not Deleted', '', 'info');
                                                    }
                                                });
                                            }}
                                            style={{ color: 'darkred', marginRight: '5px' }}
                                        />
                                    </Button>
                                </Box>
                            )}
                        </>
                    ))}
                </div>
            </div>
        );
    } else if (folderStep === 1) {
        return (
            <div>
                <Backdrop
                    sx={{
                        color: '#FFF',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={fileUploading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <div style={{ borderBottom: '1px solid #CCC' }}>
                    <button
                        className="historyButton"
                        onClick={(e) => {
                            setFolderStep(0);
                        }}
                        style={{ marginLeft: '1%', marginTop: '1%' }}
                    >
                        {fileListAttr.name} /
                    </button>
                    <button className="historyButton" style={{ cursor: 'default' }}>
                        Files
                    </button>

                    <br></br>
                </div>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Upload A Video</DialogTitle>
                    <DialogContent>
                        <DialogContentText>To Add A Video Please Fill Out The Form And Click Upload</DialogContentText>
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
                                UploadFileUsers(e);

                                setOpen(false);
                            }}
                        >
                            Upload
                        </Button>
                    </DialogActions>
                </Dialog>

                <div style={{ margin: '1%' }}>
                    <MaterialReactTable
                        enableStickyHeader={true}
                        muiTablePaperProps={{
                            sx: {
                                boxShadow: 'none !important',
                            },
                        }}
                        muiTableHeadCellProps={{
                            sx: {
                                backgroundColor: '#0D4B79',
                                color: 'white',
                                borderLeft: '0.1px solid #CCC',
                            },
                        }}
                        muiTableContainerProps={{
                            sx: {
                                boxShadow: 'none !important',
                                borderRadius: '7px',
                                overflowX: 'scroll',
                                perspective: '1px',
                            },
                        }}
                        muiTopToolbarProps={{
                            sx: {
                                backgroundColor: '#FFF !important',
                            },
                        }}
                        muiBottomToolbarProps={{
                            sx: {
                                backgroundColor: '#FFF',
                            },
                        }}
                        muiTableHeadCellColumnActionsButtonProps={{
                            sx: {
                                color: 'white',
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
                        renderTopToolbarCustomActions={({ table }) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    p: '0.5rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Button
                                    style={{
                                        backgroundColor: '#6D7888',
                                        color: 'white',
                                    }}
                                    onClick={() => setOpen(true)}
                                    startIcon={<AddIcon style={{ marginTop: '25%' }} />}
                                    variant="contained"
                                >
                                    Add A Video
                                </Button>
                            </Box>
                        )}
                        columns={videoColumns}
                        data={rows}
                        selectAllMode="page"
                        initialState={{
                            columnPinning: { right: ['actions'] },
                            pagination: { pageSize: 5, pageIndex: 0 },
                        }}
                    />
                </div>
            </div>
        );
    } else if (folderStep === 'Admin')
        return (
            <div>
                <Backdrop
                    sx={{
                        color: '#FFF',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={fileUploading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <h2
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginLeft: '1%',
                    }}
                >
                    Videos
                </h2>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Upload A Video</DialogTitle>
                    <DialogContent>
                        <DialogContentText>To Add A Video Please Fill Out The Form And Click Upload</DialogContentText>
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

                <div style={{ margin: '1%' }}>
                    <MaterialReactTable
                        enableStickyHeader={true}
                        muiTablePaperProps={{
                            sx: {
                                boxShadow: 'none !important',
                            },
                        }}
                        muiTableHeadCellProps={{
                            sx: {
                                backgroundColor: '#0D4B79',
                                color: 'white',
                                borderLeft: '0.1px solid #CCC',
                            },
                        }}
                        muiTableContainerProps={{
                            sx: {
                                boxShadow: 'none !important',
                                borderRadius: '7px',
                                overflowX: 'scroll',
                                perspective: '1px',
                            },
                        }}
                        muiTopToolbarProps={{
                            sx: {
                                backgroundColor: '#FFF !important',
                            },
                        }}
                        muiBottomToolbarProps={{
                            sx: {
                                backgroundColor: '#FFF',
                            },
                        }}
                        muiTableHeadCellColumnActionsButtonProps={{
                            sx: {
                                color: 'white',
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
                        renderTopToolbarCustomActions={({ table }) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '1rem',
                                    p: '0.5rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Button
                                    style={{
                                        backgroundColor: '#6D7888',
                                        color: 'white',
                                    }}
                                    onClick={() => setOpen(true)}
                                    startIcon={<AddIcon style={{ marginTop: '25%' }} />}
                                    variant="contained"
                                >
                                    Add A Video
                                </Button>
                            </Box>
                        )}
                        columns={videoColumns}
                        data={rows}
                        selectAllMode="page"
                        initialState={{
                            columnPinning: { right: ['actions'] },
                            pagination: { pageSize: 5, pageIndex: 0 },
                        }}
                        state={{ isLoading: rows.length === 0 ? true : false }}
                    />
                </div>
            </div>
        );
};

export default Videos;
