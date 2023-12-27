import styled from 'styled-components';
import React, { useState, useCallback, useEffect } from 'react';
import { Table } from 'react-virtualized';
import unescape from 'lodash/unescape';
import debounce from 'lodash/debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import MergeIcon from '@mui/icons-material/Merge';

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
}) {
    const [height, setHeight] = useState(100);

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

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {window.localStorage.getItem('lang') === null ? (
                        <>
                            <div style={{ marginLeft: '9%' }}>CPS/CPL</div>

                            <div style={{ marginRight: '35%' }}>Original Text</div>
                        </>
                    ) : (
                        <>
                            <div style={{ marginLeft: '6%' }}>CPS/CPL</div>
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
                                            <DeleteIcon
                                                style={{ fontSize: '18px', marginRight: '10px', cursor: 'pointer' }}
                                                onClick={() => removeSub(props.rowData)}
                                            />
                                            <MergeIcon
                                                style={{ fontSize: '18px', marginRight: '10px', cursor: 'pointer' }}
                                                onClick={() => mergeSub(props.rowData)}
                                            />
                                        </div>

                                        <textarea
                                            disabled={true}
                                            style={{
                                                width: '150px',
                                                textAlign: 'center',
                                                paddingTop: '35px',
                                            }}
                                            spellCheck={false}
                                            className={[
                                                'textarea',
                                                currentIndex === props.index ? 'highlight' : '',
                                                checkSub(props.rowData) ? 'illegal' : '',
                                            ]
                                                .join(' ')
                                                .trim()}
                                            value={
                                                viewEng
                                                    ? `${(props.rowData.text.length / props.rowData.duration).toFixed(
                                                          0,
                                                      )} / ${props.rowData.text.length}`
                                                    : `${(props.rowData.text2.length / props.rowData.duration).toFixed(
                                                          0,
                                                      )} / ${props.rowData.text2.length}`
                                            }
                                            onChange={(event) => {
                                                updateSub(props.rowData, {
                                                    text: event.target.value,
                                                });
                                            }}
                                        />

                                        {window.localStorage.getItem('lang') === null ? null : (
                                            <textarea
                                                spellCheck={false}
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
                                            spellCheck={false}
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
