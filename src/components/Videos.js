import React, { useState, useEffect } from 'react';
import { Backdrop, Box, Button, CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';
import { FileUploader } from 'react-drag-drop-files';
import Swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment';
import { MaterialReactTable } from 'material-react-table';
import AddIcon from '@mui/icons-material/Add';
import '../App.css';

const Videos = () => {
    const [file, setFile] = useState(null);
    const fileTypes = ['MP4'];
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [fileUploading, setFileUploading] = useState(false);

    async function UploadFile() {
        setFileUploading(true);
        const new_file = new File([file], `${file.name.split('.mp4')[0]}-${Date.now()}.mp4`, {
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
            .post('https://speechtotexteditor.azurewebsites.net/api/v1/videos', {
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

    const handleClose = () => {
        setOpen(false);
        setFile(null);
    };

    useEffect(() => {
        axios
            .get('https://speechtotexteditor.azurewebsites.net/api/v1/videos')
            .then((response) => {
                console.log(response.data);
                setRows(response.data.reverse());
            })
            .catch((e) => {
                console.log('ERROR', e);
            });
    }, []);

    const videoColumns = [
        {
            header: 'Video URL',
            accessorKey: 'videoUrl',
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
                            {props.subtitleString === '' || props.status === 'PROCESSING' ? (
                                <Button disabled={true}>
                                    <EditIcon />
                                </Button>
                            ) : (
                                <Link
                                    to="/videos/edit"
                                    state={{ videoData: props }}
                                    onClick={(e) => {
                                        localStorage.removeItem('videoProps');
                                        localStorage.removeItem('subtitle');
                                        localStorage.removeItem('timelineProps');
                                        localStorage.removeItem('checkedForDelete');

                                        localStorage.setItem('videoProps', JSON.stringify(props));
                                        // window.location.href = "/videos/edit";
                                    }}
                                >
                                    <Button>
                                        <EditIcon />
                                    </Button>
                                </Link>
                            )}

                            <Button>
                                <DeleteIcon style={{ color: 'darkred' }} />
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];

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
