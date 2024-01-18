import FFmpeg from '@ffmpeg/ffmpeg';
import axios from 'axios';
import WebVTT from 'node-webvtt';
import React, { useCallback, useState } from 'react';
import { t, Translate } from 'react-i18nify';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import googleTranslate from '../libs/googleTranslate';
import languages from '../libs/languages';
import { sub2srt, sub2txt, sub2vtt } from '../libs/readSub';
import sub2ass from '../libs/readSub/sub2ass';
import { download } from '../utils';

import { Checkbox } from '@mui/material';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';

const Style = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 20px;
    position: relative;
    overflow: hidden;

    border-left: 1px solid rgb(255 255 255 / 20%);

    .operate {
        display: flex;
        justify-content: right;
        padding: 5px;
        border-bottom: 1px solid rgb(255 255 255 / 20%);

        .btn {
            position: relative;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
            width: 5%;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            background-color: #009688;
            transition: all 0.2s ease 0s;
            margin-right: 10px;
            &:hover {
                opacity: 1;
            }
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

    bookmarked,
    subtitleComment,
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

    useEffect(() => {
        const interval = setInterval(() => {
            const parsedSubtitle = {
                cues: [],
                valid: true,
            };
            subtitle.forEach((subtitle, index) => {
                const cue = {
                    identifier: '',
                    start: subtitle.start.split(':').reduce((acc, time) => 60 * acc + +time),
                    end: subtitle.end.split(':').reduce((acc, time) => 60 * acc + +time),
                    text: subtitle.text2,
                    styles: 'line:13 position:50% align:center size:80%',
                };
                parsedSubtitle.cues.push(cue);
            });

            const parsedSubtitleTrans = {
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
                parsedSubtitleTrans.cues.push(cue);
            });

            if (
                parsedSubtitle.cues[0].text !== parsedSubtitleTrans.cues[0].text &&
                parsedSubtitle.cues[1].text !== parsedSubtitleTrans.cues[1].text &&
                parsedSubtitle.cues[2].text !== parsedSubtitleTrans.cues[2].text &&
                parsedSubtitle.cues[3].text !== parsedSubtitleTrans.cues[3].text &&
                parsedSubtitle.cues[4].text !== parsedSubtitleTrans.cues[4].text
            ) {
                try {
                    const videoProps = JSON.parse(localStorage.getItem('videoProps'));
                    const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);
                    const modifiedSubtitleContentTrans = WebVTT.compile(parsedSubtitleTrans);

                    axios
                        .put(process.env.REACT_APP_API_URL+`/api/v1/videos/${videoProps.id}`, {
                            subtitleString: btoa(modifiedSubtitleContent),
                            metadataCheckFlag: bookmarked,
                            metadataComments: subtitleComment,
                            translatedString: btoa(encodeURIComponent(modifiedSubtitleContentTrans)),
                        })
                        .then(function (response) {
                            console.log(response.data);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } catch (error) {
                    console.log(error);
                }
            } else {
                try {
                    const videoProps = JSON.parse(localStorage.getItem('videoProps'));
                    const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);

                    axios
                        .put(process.env.REACT_APP_API_URL+`/api/v1/videos/${videoProps.id}`, {
                            subtitleString: btoa(modifiedSubtitleContent),
                            metadataCheckFlag: bookmarked,
                            metadataComments: subtitleComment,
                        })
                        .then(function (response) {
                            console.log(response.data);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } catch (error) {
                    console.log(error);
                }
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [bookmarked, subtitleComment, subtitle]);

    return (
        <Style className="tool">
            <div className="top">
                <div className="operate">
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
                                <Typography sx={{ p: 2 }}>
                                    <b>Play/Pause Video:</b> Tab (Outside Textbox)
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    <b>Left/Right Arrow Key:</b> Forward/Back 3 Seconds
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    <b>Show Video Controls:</b> Right Click On Video And Click Show Controls (Playback
                                    Speed, Volume, Etc)
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    {' '}
                                    <b>Undo:</b> Cmd + Z{' '}
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    {' '}
                                    <b>Copy:</b> Cmd + C
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    {' '}
                                    <b>Paste:</b> Cmd + V
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    {' '}
                                    <b>Transition Down From One Textbox To Another:</b> Tab (Within Textbox)
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    {' '}
                                    <b>Transition Up From One Textbox To Another:</b> Shift + Tab
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    {' '}
                                    <b>New Subtitle:</b> Drag on timeline
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    <b>Delete Subtitle:</b> Trash icon or right click timeline subtitle
                                </Typography>
                                <Typography sx={{ p: 2 }}>
                                    <b>Merge Subtitle:</b> Merge icon or right click timeline subtitle
                                </Typography>

                                <Typography sx={{ p: 2 }}>
                                    <b>Change Subtitle View (Once User Clicks Translation):</b> Click checkbox to see
                                    translated text/original text. Will render on video and timeline. As well as what is
                                    exported
                                </Typography>

                                <Typography sx={{ p: 2 }}>
                                    <b>CPS/CPL Color:</b> CPS above 24 and CPL above 45 turns yellow. CPS above 28 and
                                    CPL above 55 turns orange.
                                </Typography>
                            </Popover>
                        </div>

                        {window.localStorage.getItem('lang') === null ? null : (
                            <>
                                <label style={{ color: '#FFF', marginLeft: '20px' }}>Use Translated Text?</label>

                                <Checkbox
                                    onChange={() => {
                                        setViewEng(!viewEng);
                                    }}
                                    style={{ color: '#FFF', bottom: '3px' }}
                                />
                            </>
                        )}
                    </div>

                    <select
                        style={{
                            width: '15%',
                            marginRight: '10px',
                            height: '35px',
                            minHeight: '35px',
                            marginLeft: 'auto',
                        }}
                        value={tempTranslate}
                        onChange={(event) => setTempTranslate(event.target.value)}
                    >
                        {(languages[language] || languages.en).map((item) => (
                            <option key={item.key} value={item.key}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <div style={{ backgroundColor: '#673ab7', width: '10%' }} className="btn" onClick={onTranslate}>
                        <Translate value="TRANSLATE" />
                    </div>

                    <select
                        style={{
                            width: '15%',
                            marginRight: '10px',
                            height: '35px',
                            minHeight: '35px',
                            marginLeft: '1%',
                        }}
                        name="cars"
                        id="cars"
                        onChange={(e) => {
                            setExportValue(e.target.value);
                        }}
                    >
                        <option value="SRT">Export SRT</option>
                        <option value="VTT">Export VTT</option>
                        <option value="ASS">Export ASS</option>
                        <option value="TXT">Export TXT</option>
                    </select>

                    <div
                        style={{ backgroundColor: '#673ab7', width: '10%' }}
                        className="btn"
                        onClick={(e) => {
                            if (exportValue === 'SRT') {
                                downloadSub('srt');
                            } else if (exportValue === 'VTT') {
                                downloadSub('vtt');
                            } else if (exportValue === 'ASS') {
                                downloadSub('ass');
                            } else if (exportValue === 'TXT') {
                                downloadSub('txt');
                            }
                        }}
                    >
                        <Translate value="Export" />
                    </div>

                    <div
                        style={{ marginLeft: '2%' }}
                        className="btn"
                        onClick={() => {
                            if (window.confirm(t('CLEAR_TIP')) === true) {
                                clearSubs();

                                localStorage.removeItem('lang');
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
                            Swal.fire({
                                title: 'Do you want to save changes?',
                                showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: 'Save',
                                denyButtonText: `Don't save`,
                            }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
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
                                            text: subtitle.text2,
                                            styles: 'line:13 position:50% align:center size:80%',
                                        };
                                        parsedSubtitle.cues.push(cue);
                                    });

                                    const parsedSubtitleTrans = {
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
                                        parsedSubtitleTrans.cues.push(cue);
                                    });

                                    if (
                                        parsedSubtitle.cues[0].text !== parsedSubtitleTrans.cues[0].text &&
                                        parsedSubtitle.cues[1].text !== parsedSubtitleTrans.cues[1].text &&
                                        parsedSubtitle.cues[2].text !== parsedSubtitleTrans.cues[2].text &&
                                        parsedSubtitle.cues[3].text !== parsedSubtitleTrans.cues[3].text &&
                                        parsedSubtitle.cues[4].text !== parsedSubtitleTrans.cues[4].text
                                    ) {
                                        try {
                                            const videoProps = JSON.parse(localStorage.getItem('videoProps'));
                                            const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);
                                            const modifiedSubtitleContentTrans = WebVTT.compile(parsedSubtitleTrans);

                                            axios
                                                .put(process.env.REACT_APP_API_URL+`/api/v1/videos/${videoProps.id}`, {
                                                    subtitleString: btoa(modifiedSubtitleContent),
                                                    metadataCheckFlag: bookmarked,
                                                    metadataComments: subtitleComment,
                                                    translatedString: btoa(
                                                        encodeURIComponent(modifiedSubtitleContentTrans),
                                                    ),
                                                })
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
                                                            localStorage.setItem(
                                                                'videoProps',
                                                                JSON.stringify(response.data),
                                                            );

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
                                    } else {
                                        try {
                                            const videoProps = JSON.parse(localStorage.getItem('videoProps'));
                                            const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);

                                            axios
                                                .put(process.env.REACT_APP_API_URL+`/api/v1/videos/${videoProps.id}`, {
                                                    subtitleString: btoa(modifiedSubtitleContent),
                                                    metadataCheckFlag: bookmarked,
                                                    metadataComments: subtitleComment,
                                                })
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
                                                            localStorage.setItem(
                                                                'videoProps',
                                                                JSON.stringify(response.data),
                                                            );

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
                                    }
                                } else if (result.isDenied) {
                                    Swal.fire('Changes are not saved', '', 'info');
                                }
                            });
                        }}
                    >
                        <Translate value="Save" />
                    </div>
                </div>
            </div>
        </Style>
    );
}
