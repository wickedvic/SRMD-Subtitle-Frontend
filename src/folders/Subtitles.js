import styled from 'styled-components';
import React, { useState, useCallback, useEffect } from 'react';
import { Table } from 'react-virtualized';
import unescape from 'lodash/unescape';
import debounce from 'lodash/debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import MergeIcon from '@mui/icons-material/Merge';
import ChatIcon from '@mui/icons-material/Chat';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Button, Typography, Popover } from '@mui/material';

const Style = styled.div`
    position: relative;
    box-shadow: 0px 5px 25px 5px rgb(0 0 0 / 80%);
    background-color: rgb(0 0 0 / 100%);

    .ReactVirtualized__Table {
        .ReactVirtualized__Table__Grid {
            outline: none;
        }

        .ReactVirtualized__Table__row {
            .item {
                height: 100%;
                width: 100%;
                padding: 5px;
                display: flex;
                flex: 1 1 0%;
                flex-direction: row;

                .textarea {
                    border: none;
                    width: 100%;
                    height: 100%;
                    color: #fff;
                    font-size: 12px;
                    padding: 10px;
                    text-align: center;
                    background-color: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s ease;
                    resize: none;
                    outline: none;

                    &.highlight {
                        background-color: rgb(0 87 158);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        z-index: 100;
                    }

                    &.illegal {
                        background-color: rgb(123 29 0);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    }
                    &.cplYellow {
                        color: rgb(255, 255, 0);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    }
                    &.cplOrange {
                        color: rgb(218, 155, 0);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    }
                }

                .container ul {
                    padding: 0;
                    z-index: 100;
                    background-color: rgb(32, 32, 32);
                    margin-left: -50px;

                    li:first-of-type {
                        font-weight: bold;
                        color: white;
                        background-color: rgb(0 87 158);
                    }
                }
            }

            overflow: visible !important;
        }
    }
`;

export default function Subtitles({
    currentIndex,
    subtitle,
    checkSub,
    player,
    updateSub,
    translate,
    sub,
    removeSub,
    mergeSub,
    viewEng,
    bookmarked,
    setBookmarked,
    subtitleComment,
    setSubtitleComment,
}) {
    const [height, setHeight] = useState(100);

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorIndex, setAnchorIndex] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const resize = useCallback(() => {
        setHeight(document.body.clientHeight - 170);
    }, [setHeight]);

    useEffect(() => {
        resize();
        if (!resize.init) {
            resize.init = true;
            const debounceResize = debounce(resize, 500);
            window.addEventListener('resize', debounceResize);
        }
    }, [resize]);
    const videoProps = JSON.parse(localStorage.getItem('videoProps'));

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {window.localStorage.getItem('lang') === null &&
                    (videoProps.translatedString === null ||
                        videoProps.translatedString === 'null' ||
                        videoProps.translatedString === ' ' ||
                        videoProps.translatedString === '') ? (
                        <>
                            <div style={{ marginLeft: '13%' }}>CPS/CPL</div>

                            <div style={{ marginRight: '35%' }}>Original Text</div>
                        </>
                    ) : (
                        <>
                            <div style={{ marginLeft: '10%' }}>CPS/CPL</div>
                            <div style={{ marginRight: '18%' }}>Translated Text</div>
                            <div style={{ marginRight: '18%' }}>Original Text</div>
                        </>
                    )}
                </div>
                <Style className="subtitles">
                    <Table
                        headerHeight={20}
                        width={750}
                        height={height}
                        rowHeight={100}
                        scrollToIndex={currentIndex}
                        rowCount={subtitle.length}
                        rowGetter={({ index }) => subtitle[index]}
                        headerRowRenderer={() => null}
                        rowRenderer={(props) => {
                            return (
                                <div
                                    key={props.key}
                                    className={props.className}
                                    style={props.style}
                                    onClick={() => {
                                        if (player) {
                                            player.pause();
                                            if (player.duration >= props.rowData.startTime) {
                                                player.currentTime = props.rowData.startTime + 0.001;
                                            }
                                        }
                                    }}
                                >
                                    <div className="item">
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-evenly',
                                            }}
                                        >
                                            <ChatIcon
                                                style={{
                                                    fontSize: '19px',
                                                    marginRight: '10px',
                                                    cursor: 'pointer',
                                                    color:
                                                        subtitleComment.find((o) => o.index === props.index) ===
                                                        undefined
                                                            ? null
                                                            : 'green',
                                                }}
                                                onClick={(event) => {
                                                    setAnchorEl(event.currentTarget);
                                                    setAnchorIndex(props.index);
                                                }}
                                            />

                                            <Popover
                                                id={id}
                                                open={open}
                                                anchorEl={anchorEl}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                            >
                                                <Typography sx={{ p: 2 }}>
                                                    <textarea
                                                        placeholder={'Enter a comment.'}
                                                        style={{ minWidth: '200px', minHeight: '100px' }}
                                                        defaultValue={
                                                            subtitleComment.find((el) => el.index === anchorIndex) ===
                                                            undefined
                                                                ? ''
                                                                : subtitleComment.find((el) => el.index === anchorIndex)
                                                                      .comments
                                                        }
                                                        onChange={(e) => {
                                                            const element = subtitleComment.find(
                                                                (el) => el.index === anchorIndex,
                                                            );

                                                            if (element === undefined) {
                                                                setSubtitleComment((comment) => [
                                                                    ...comment,
                                                                    { index: anchorIndex, comments: e.target.value },
                                                                ]);
                                                            } else {
                                                                element.comments = e.target.value;
                                                            }
                                                        }}
                                                    />
                                                    <br></br>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="contained"
                                                            style={{ backgroundColor: '#048377', width: '80px' }}
                                                            onClick={(e) => {
                                                                let filteredComments = subtitleComment
                                                                    .filter((o) => o.comments !== '')
                                                                    .sort(function (a, b) {
                                                                        return a.index - b.index;
                                                                    });

                                                                setSubtitleComment(filteredComments);
                                                                handleClose();
                                                            }}
                                                        >
                                                            Save
                                                        </Button>
                                                    </div>
                                                </Typography>
                                            </Popover>

                                            <MergeIcon
                                                style={{ fontSize: '19px', marginRight: '10px', cursor: 'pointer' }}
                                                onClick={() => mergeSub(props.rowData)}
                                            />
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-evenly',
                                            }}
                                        >
                                            <BookmarkIcon
                                                style={{
                                                    fontSize: '19px',
                                                    marginRight: '10px',
                                                    cursor: 'pointer',
                                                    color:
                                                        bookmarked.find((o) => o.index === props.index) === undefined
                                                            ? null
                                                            : 'orange',
                                                }}
                                                onClick={() => {
                                                    const element = bookmarked.find((el) => el.index === props.index);

                                                    if (element === undefined) {
                                                        setBookmarked((data) => [
                                                            ...data,
                                                            { index: props.index, flag: 'Y' },
                                                        ]);
                                                    } else {
                                                        const filtered = bookmarked.filter(function (el) {
                                                            return el.index !== props.index;
                                                        });

                                                        setBookmarked(filtered);
                                                    }
                                                }}
                                            />

                                            <DeleteIcon
                                                style={{ fontSize: '19px', marginRight: '10px', cursor: 'pointer' }}
                                                onClick={() => removeSub(props.rowData)}
                                            />
                                        </div>

                                        <textarea
                                            disabled={true}
                                            style={{
                                                width: '150px',
                                                textAlign: 'center',
                                                paddingTop: '5px',
                                                fontSize: '12px',
                                            }}
                                            spellCheck={false}
                                            className={[
                                                'textarea',
                                                currentIndex === props.index ? 'highlight' : '',
                                                checkSub(props.rowData) ? 'illegal' : '',

                                                viewEng &&
                                                ((props?.rowData?.text?.length / props?.rowData?.duration).toFixed(0) >
                                                    28 ||
                                                    props?.rowData?.text?.split('\n')?.map((e) => e.length) > 55)
                                                    ? 'cplOrange'
                                                    : '',

                                                !viewEng &&
                                                ((props?.rowData?.text2?.length / props?.rowData?.duration).toFixed(0) >
                                                    28 ||
                                                    props?.rowData?.text2?.split('\n')?.map((e) => e.length) > 55)
                                                    ? 'cplOrange'
                                                    : '',

                                                viewEng &&
                                                ((props?.rowData?.text?.length / props?.rowData?.duration).toFixed(0) >
                                                    24 ||
                                                    props?.rowData?.text?.split('\n')?.map((e) => e.length) > 45)
                                                    ? 'cplYellow'
                                                    : '',

                                                !viewEng &&
                                                ((props?.rowData?.text2?.length / props?.rowData?.duration).toFixed(0) >
                                                    24 ||
                                                    props?.rowData?.text2?.split('\n')?.map((e) => e.length) > 45)
                                                    ? 'cplYellow'
                                                    : '',
                                            ]
                                                .join(' ')
                                                .trim()}
                                            value={
                                                props?.rowData?.text === undefined ||
                                                props?.rowData?.text2 === undefined
                                                    ? `0/0`
                                                    : viewEng
                                                    ? `${props.rowData.startTime.toFixed(
                                                          2,
                                                      )} - ${props.rowData.endTime.toFixed(2)} seconds
                                                    ${(props?.rowData?.text?.length / props?.rowData?.duration).toFixed(
                                                        0,
                                                    )} / ${props?.rowData?.text?.split('\n')?.map((e) => e.length)}`
                                                    : `${props.rowData.startTime.toFixed(
                                                          2,
                                                      )} - ${props.rowData.endTime.toFixed(2)} seconds
                                                    ${(
                                                        props?.rowData?.text2?.length / props?.rowData?.duration
                                                    ).toFixed(0)} / ${props?.rowData?.text2
                                                          ?.split('\n')
                                                          ?.map((e) => e.length)}`
                                            }
                                            onChange={(event) => {
                                                updateSub(props.rowData, {
                                                    text: event.target.value,
                                                });
                                            }}
                                        />

                                        {window.localStorage.getItem('lang') === null &&
                                        (videoProps.translatedString === null ||
                                            videoProps.translatedString === 'null' ||
                                            videoProps.translatedString === ' ' ||
                                            videoProps.translatedString === '') ? null : (
                                            <textarea
                                                style={{
                                                    fontSize: '16px',
                                                }}
                                                spellcheck="true"
                                                className={[
                                                    'textarea',
                                                    currentIndex === props.index ? 'highlight' : '',
                                                    checkSub(props.rowData) ? 'illegal' : '',
                                                ]
                                                    .join(' ')
                                                    .trim()}
                                                value={unescape(props.rowData.text)}
                                                onChange={(event) => {
                                                    updateSub(props.rowData, {
                                                        text: event.target.value,
                                                    });
                                                }}
                                            />
                                        )}

                                        <textarea
                                            style={{
                                                fontSize: '16px',
                                            }}
                                            spellcheck="true"
                                            className={[
                                                'textarea',
                                                currentIndex === props.index ? 'highlight' : '',
                                                checkSub(props.rowData) ? 'illegal' : '',
                                            ]
                                                .join(' ')
                                                .trim()}
                                            value={unescape(props.rowData.text2)}
                                            onChange={(event) => {
                                                updateSub(props.rowData, {
                                                    text2: event.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    ></Table>
                </Style>
            </div>
        </>
    );
}
