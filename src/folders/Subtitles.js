import styled from 'styled-components';
import React, { useState,useEffect, useCallback, useRef } from 'react';

import { Table } from 'react-virtualized';
import unescape from 'lodash/unescape';
import debounce from 'lodash/debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import MergeIcon from '@mui/icons-material/Merge';
import ChatIcon from '@mui/icons-material/Chat';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

import $ from 'jquery';

const Style = styled.div`
    position: relative;
    box-shadow: 0px 5px 25px 5px rgb(0 0 0 / 80%);
    background-color: rgb(0 0 0 / 100%);

    .ReactVirtualized__Table {
        .ReactVirtualized__Table__Grid {
            outline: none;
        }

        .public-DraftStyleDefault-block span {
            color: rgb(255, 255, 255);
            font-size: 16px !important;
            text-align: center !important;
            line-height: 22px !important;
            display: block !important;
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
    numEditors,
}) {

    const [items, setItems] = useState([]);
    const [caretPos, setCaretPos] = useState('');
    const stateStack = useRef([]);

    const [height, setHeight] = useState(100);

    const [anchorIndex, setAnchorIndex] = useState(null);

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

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
        setItems(subtitle);

        
      $('#editable-list').on('keydown', '.itemsalist', function(e) {
        if (e.shiftKey && e.which === 13) {
            e.preventDefault();
            var posCaret = getCaretCharacterOffsetWithin(this);
            setCaretPos(posCaret);
        }
      });

      function getCaretCharacterOffsetWithin(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection !== 'undefined') {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type !== 'Control') {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint('EndToEnd', textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
      }


    }, [resize, subtitle]);
    const videoProps = JSON.parse(localStorage.getItem('videoProps'));

    const handleKeyDown = (e, index, field) => {
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            const text = e.target.value;
            const selection = window.getSelection();
            const caretOffset = selection.anchorOffset;
            const newTextBefore = text.substring(0, caretOffset).trim();
            const newTextAfter = text.substring(caretOffset).trim();
            const newItems = [
                ...items.slice(0, index),
                { ...items[index], [field]: newTextBefore },
                { ...items[index], [field]: newTextAfter },
                ...items.slice(index + 1)
            ];
            setItems(newItems);
            stateStack.current.push(newItems);
        } else if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault();
            document.querySelectorAll('.items')[index - 1].querySelector(`[data-field="${field}"]`).focus();
        } else if (e.key === 'ArrowDown' && index < items.length - 1) {
            e.preventDefault();
            document.querySelectorAll('.items')[index + 1].querySelector(`[data-field="${field}"]`).focus();
        }
      };
      
      
      const handleBlur = (e, index, field) => {
      const newText = e.target.value.trim();
      
      const itemslist = {
        "start": items[index].start,
        "end": items[index].end,
        "text": field==="text" ? newText: items[index].text,
        "text2": field==="text2" ? newText: items[index].text2,
      }
      
      const newItems = [...items.slice(0, index), itemslist, ...items.slice(index + 1)];
      
      setItems(newItems);
      stateStack.current.push(newItems);
      }

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
                    <Table id='editable-list'
                        headerHeight={20}
                        width={750}
                        height={height}
                        rowHeight={100}
                        scrollToIndex={currentIndex}
                        rowCount={items.length}
                        rowGetter={({ index }) => items[index]}
                        headerRowRenderer={() => null}
                        rowRenderer={(props) => {
                            console.log(props)
                            return (
                                <div 
                                    key={props.key}
                                    className={`${props.className} itemsalist`}
                                    style={props.style}
                                    onClick={() => {
                                        if (!open) {
                                            if (player) {
                                                player.play();
                                                if (player.duration >= props.rowData.startTime) 
                                                {
                                                    player.currentTime = props.rowData.startTime + 0.001;
                                                }
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
                                                    setOpen(true);
                                                    setAnchorIndex(props.index);
                                                }}
                                            />

                                            <Dialog
                                                BackdropProps={{
                                                    style: { opacity: 0.1 },
                                                }}
                                                open={open}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogContent>
                                                    <textarea
                                                        placeholder={'Enter a comment.'}
                                                        style={{ minWidth: '300px', minHeight: '100px' }}
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
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button
                                                        onClick={(e) => {
                                                            handleClose();
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
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
                                                </DialogActions>
                                            </Dialog>

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
                                            onKeyDown={(e) => handleKeyDown(e, props.index, 'text')}
                                            onBlur={(e) => handleBlur(e, props.index, 'text')}
                                            data-field="text"
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

                                            onKeyDown={(e) => handleKeyDown(e, props.index, 'text2')}
                                            onBlur={(e) => handleBlur(e, props.index, 'text2')}
                                            data-field="text2"
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
