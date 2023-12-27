import styled from 'styled-components';
import languages from '../libs/languages';
import { t, Translate } from 'react-i18nify';
import React, { useState, useCallback } from 'react';
import { download } from '../utils';
import { sub2vtt, sub2srt, sub2txt } from '../libs/readSub';
import sub2ass from '../libs/readSub/sub2ass';
import googleTranslate from '../libs/googleTranslate';
import FFmpeg from '@ffmpeg/ffmpeg';
import WebVTT from 'node-webvtt';
import axios from 'axios';
import Swal from 'sweetalert2';

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Style = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 20px;
    position: relative;
    overflow: hidden;

    border-left: 1px solid rgb(255 255 255 / 20%);

    .import {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 48%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #3f51b5;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }

        .file {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }

    .burn {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 100%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #673ab7;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .export {
        display: flex;
        justify-content: space-around;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 45%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #009688;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .operate {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 30%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #009688;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .translate {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        select {
            width: 65%;
            outline: none;
            padding: 0 5px;
            border-radius: 3px;
        }

        .btn {
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 33%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #673ab7;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .export1 {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        select {
            width: 65%;
            outline: none;
            padding: 0 5px;
            border-radius: 3px;
        }

        .btn {
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 33%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #673ab7;
            transition: all 0.2s ease 0s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .hotkey {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        line-height: 0px;
        span {
            width: 49%;
            font-size: 13px;
            padding: 20px 0;
            border-radius: 3px;
            text-align: center;
            color: rgb(255 255 255 / 75%);
            background-color: rgb(255 255 255 / 20%);
        }
    }

    .bottom {
        padding: 10px;
        a {
            display: flex;
            flex-direction: column;
            border: 1px solid rgb(255 255 255 / 30%);
            text-decoration: none;

            .title {
                color: #ffeb3b;
                padding: 5px 10px;
                animation: animation 3s infinite;
                border-bottom: 1px solid rgb(255 255 255 / 30%);
            }

            @keyframes animation {
                50% {
                    color: #00bcd4;
                }
            }

            img {
                max-width: 100%;
            }
        }
    }

    .progress {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        z-index: 9;
        height: 2px;
        background-color: rgb(0 0 0 / 50%);

        span {
            display: inline-block;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 0;
            height: 100%;
            background-color: #ff9800;
            transition: all 0.2s ease 0s;
        }
    }
`;

FFmpeg.createFFmpeg({ log: true }).load();

export default function Header({
    undoSubs,
    clearSubs,
    language,
    subtitle,
    setLoading,
    formatSub,
    setSubtitle,
    notify,
    translate,
    setTranslate,

    viewEng,
    setViewEng,
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [tempTranslate, setTempTranslate] = useState(translate);
    const [exportValue, setExportValue] = useState('SRT');

    const downloadSub = useCallback(
        (type) => {
            let text = '';
            const name = `${Date.now()}.${type}`;
            switch (type) {
                case 'vtt':
                    text = sub2vtt(subtitle, viewEng);
                    break;
                case 'srt':
                    text = sub2srt(subtitle, viewEng);
                    break;
                case 'ass':
                    text = sub2ass(subtitle, viewEng);
                    break;
                case 'txt':
                    text = sub2txt(subtitle, viewEng);
                    break;
                case 'json':
                    text = JSON.stringify(subtitle);
                    break;
                default:
                    break;
            }
            const url = URL.createObjectURL(new Blob([text]));
            download(url, name);
        },
        [subtitle, viewEng],
    );

    const onTranslate = useCallback(() => {
        window.localStorage.setItem('lang', JSON.stringify(tempTranslate));
        setTranslate(tempTranslate);
        setLoading(t('TRANSLATING'));
        googleTranslate(formatSub(subtitle), tempTranslate)
            .then((res) => {
                setSubtitle(formatSub(res));
                notify({
                    message: t('TRANSLAT_SUCCESS'),
                    level: 'success',
                });

                setLoading('');
            })
            .catch((err) => {
                setLoading('');
                notify({
                    message: err.message,
                    level: 'error',
                });
            });
    }, [subtitle, setLoading, formatSub, setSubtitle, tempTranslate, setTranslate, notify]);

    return (
        <Style className="tool">
            <div className="top">
                <div className="toggle" style={{ display: 'flex', justifyContent: 'left', marginLeft: '10px' }}>
                    <div>
                        <Button
                            aria-describedby={id}
                            variant="outlined"
                            onClick={handleClick}
                            style={{ color: '#009688', borderColor: '#009688' }}
                        >
                            View Shortcuts
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Typography sx={{ p: 2 }}>Play/Pause Video: Spacebar</Typography>
                            <Typography sx={{ p: 2 }}>Undo: Ctrl + Z</Typography>
                            <Typography sx={{ p: 2 }}>Copy: Ctrl + C</Typography>
                            <Typography sx={{ p: 2 }}>Paste: Ctrl + V</Typography>
                        </Popover>
                    </div>

                    <label style={{ color: '#FFF', marginLeft: '10px', marginRight: '5px' }}>
                        Use Original Subtitles?
                    </label>
                    <input
                        type="checkbox"
                        onChange={() => {
                            setViewEng(!viewEng);
                        }}
                        autoComplete="off"
                    />
                </div>

                <div className="operate">
                    <div
                        className="btn"
                        onClick={() => {
                            if (window.confirm(t('CLEAR_TIP')) === true) {
                                clearSubs();
                                window.location.reload();
                            }
                        }}
                    >
                        <Translate value="CLEAR" />
                    </div>
                    <div className="btn" onClick={undoSubs}>
                        <Translate value="UNDO" />
                    </div>

                    <div
                        className="btn"
                        onClick={(e) => {
                            setLoading(t('UPDATING'));
                            const parsedSubtitle = {
                                cues: [],
                                valid: true,
                            };
                            subtitle.forEach((subtitle, index) => {
                                const cue = {
                                    identifier: '',
                                    start: subtitle.start.split(':').reduce((acc, time) => 60 * acc + +time),
                                    end: subtitle.end.split(':').reduce((acc, time) => 60 * acc + +time),
                                    text: subtitle.text,
                                    styles: 'line:13 position:50% align:center size:80%',
                                };
                                parsedSubtitle.cues.push(cue);
                            });
                            console.log(parsedSubtitle);

                            try {
                                const videoProps = JSON.parse(localStorage.getItem('videoProps'));
                                const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);

                                axios
                                    .put(
                                        `https://speechtotexteditor.azurewebsites.net/api/v1/videos/${videoProps.id}`,
                                        {
                                            subtitleString: btoa(modifiedSubtitleContent),
                                        },
                                    )
                                    .then(function (response) {
                                        setLoading('');

                                        Swal.fire({
                                            title: 'Success!',
                                            text: 'Your changes have been saved!',
                                            icon: 'success',
                                            confirmButtonText: 'Close',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                localStorage.removeItem('subtitle');
                                                localStorage.setItem('videoProps', JSON.stringify(response.data));

                                                window.location.reload();
                                            }
                                        });
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            } catch (error) {
                                setLoading('');
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'Subtitle Timings Overlap. Please fix and try again!',
                                    icon: 'error',
                                    confirmButtonText: 'Close',
                                });
                            }
                        }}
                    >
                        <Translate value="Save" />
                    </div>
                </div>

                <div className="export1">
                    <select
                        name="cars"
                        id="cars"
                        onChange={(e) => {
                            setExportValue(e.target.value);
                        }}
                    >
                        <option value="SRT">Export SRT</option>
                        <option value="VTT">Export VTT</option>
                    </select>

                    <div
                        className="btn"
                        onClick={(e) => {
                            if (exportValue === 'SRT') {
                                downloadSub('srt');
                            } else if (exportValue === 'VTT') {
                                downloadSub('vtt');
                            }
                        }}
                    >
                        <Translate value="Export" />
                    </div>
                </div>

                <div className="translate">
                    <select value={tempTranslate} onChange={(event) => setTempTranslate(event.target.value)}>
                        {(languages[language] || languages.en).map((item) => (
                            <option key={item.key} value={item.key}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <div className="btn" onClick={onTranslate}>
                        <Translate value="TRANSLATE" />
                    </div>
                </div>
            </div>
        </Style>
    );
}
