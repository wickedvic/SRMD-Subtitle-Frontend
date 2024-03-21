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

        .imputs input {
            width: 100% !important;
            display: block !important;
            background: transparent !important;
            border: medium !important;
            color: rgb(255, 255, 255) !important;
            text-align: center;
        }
        .textarea.imputs * {
            line-height: normal;
            display: block;
        }
        .imputs {
            display: block !important;
            overflow: hidden;
            overflow-y: auto;
            width: 220px !important;
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
    setSubtitle,
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
    
    //const stateStack = useRef([]);

    const [height, setHeight] = useState(100);

    const [anchorIndex, setAnchorIndex] = useState(null);

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const resize = useCallback(() => {
        setHeight(document.body.clientHeight - 170);
    }, [setHeight]);

    useEffect(() => 
    {
        resize();
        if (!resize.init) {
            resize.init = true;
            const debounceResize = debounce(resize, 500);
            window.addEventListener('resize', debounceResize);
        }
        

        $('#editable-list').on('keydown', '.itemsalist textarea', function(e) {
       
            var curentnode = $(this).parent().parent();
            var nextnode = $(this).parent().parent().next();
            var prevnode = $(this).parent().parent().prev();
            
            if (e.keyCode===40) {
                    $('.itemsalist .textarea').removeClass('highlight');
                    nextnode.find('.textarea').addClass('highlight');
                    nextnode.find('textarea[data-field="text2"]').focus();
                    nextnode.find('textarea[data-field="text2"]').click();               
            }

            if (e.keyCode===38) {
                if ($(curentnode).hasClass("item_1")) 
                {
                }
                else 
                {
                    $('.itemsalist .textarea').removeClass('highlight');
                    prevnode.find('.textarea').addClass('highlight');
                    prevnode.find('textarea[data-field="text2"]').focus();
                    prevnode.find('textarea[data-field="text2"]').click();
                }
            }
        });

        // $('#editable-list').on('click', '.itemsalist .textarea', function(e) 
        // {
        //     var curentnode = $(this).parent().parent();            
        //     $('.itemsalist .textarea').removeClass('highlight');
        //     curentnode.find('.textarea').addClass('highlight');
        // });

    }, [resize, subtitle]);
    const videoProps = JSON.parse(localStorage.getItem('videoProps'));

    const handleKeyDown = (e, index, field) => 
    {
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
  
            if(field==='text' || field==='text2')
            {
  
            const text = e.target.value;
            const caretOffset = e.target.selectionStart;
            const newTextBefore = text.substring(0, caretOffset).trim();
            const newTextAfter = text.substring(caretOffset).trim();
            const newItems = [
                ...subtitle.slice(0, index),
                { ...subtitle[index], ['text']: newTextBefore, ['text2']: newTextBefore },
                { ...subtitle[index], ['text']: newTextAfter, ['text2']: newTextAfter },
                ...subtitle.slice(index + 1)
            ];
            setSubtitle(newItems);
            //stateStack.current.push(newItems);
          }
        }
    };
  
    const handleChangeText = (e, index, field) => 
    {
        const text = e.target.value;
        const newItems = [...subtitle];
        if(field==='text' || field==='text2')
        {
          newItems[index] = { ...newItems[index], text: text,  text2: text };
        }
  
        if(field==='start')
        {
          newItems[index] = { ...newItems[index], start: text};
        }
  
        if(field==='end')
        {
          newItems[index] = { ...newItems[index], end: text};
        }
        setSubtitle(newItems);
    };

    

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
                        rowCount={subtitle.length}
                        rowGetter={({ index }) => subtitle[index]}
                        headerRowRenderer={() => null}
                        rowRenderer={(props) => {
                            console.log(props)
                            return (
                                <div 
                                    key={props.key}
                                    className={`${props.className} itemsalist item_${props.index+1}`}
                                    style={props.style}
                                    onClick={() => {
                                        if (!open) {
                                            if (player) {
                                                player.play();
                                                //player.pause();
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

                                        <div className={[
                                                'textarea imputs',
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
                                                style={{
                                                width: '150px',
                                                textAlign: 'center',
                                                paddingTop: '5px',
                                                fontSize: '12px',
                                            }}
                                                >
                                                        <input type='text' 
                                                             data-field="start"
                                                            onKeyDown={(e) => handleKeyDown(e, props.index, 'start')}
                                                            value={props.rowData.start.replace('00:00:', '').replace('00:', '')} 
                                                            onChange={(event) => {
                                                                updateSub(props.rowData, {
                                                                    start: event.target.value,                                                                    
                                                                });
                                                            }}
                                                        />
                                                        <span>-</span> 
                                                        <input type='text' 
                                                            data-field="end"
                                                            onKeyDown={(e) => handleKeyDown(e, props.index, 'end')}
                                                            value={props.rowData.end.replace('00:00:', '').replace('00:', '')} 
                                                            onChange={(event) => {
                                                                updateSub(props.rowData, {
                                                                    end: event.target.value,                                                                    
                                                                });
                                                            }}
                                                        />
                                                        <span>seconds</span>
                                                    </div>
                                               

                                        {/* <textarea
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
                                                props?.rowData?.startTime === undefined ||
                                                props?.rowData?.endTime === undefined ||
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
                                        /> */}

                                        {window.localStorage.getItem('lang') === null &&
                                        (videoProps.translatedString === null ||
                                            videoProps.translatedString === 'null' ||
                                            videoProps.translatedString === ' ' ||
                                            videoProps.translatedString === '') ? null : (

                                            <textarea style={{fontSize: '16px',}}
                                            spellCheck="true"
                                            className={['textarea',currentIndex === props.index ? 'highlight' : '',checkSub(props.rowData) ? 'illegal' : '',].join(' ').trim()}
                                        
                                            onKeyDown={(e) => handleKeyDown(e, props.index, 'text')}
                                            data-field="text"
                                            value={unescape(props.rowData.text)}
                                            onChange={(event) => {
                                                updateSub(props.rowData, {
                                                    text: event.target.value,
                                                    text2: event.target.value,
                                                });
                                            }}
                                        /> 
                                        )}
                                            
                                         <textarea style={{fontSize: '16px',}}
                                            spellCheck="true"
                                            className={['textarea',currentIndex === props.index ? 'highlight' : '',checkSub(props.rowData) ? 'illegal' : '',].join(' ').trim()}

                                            onKeyDown={(e) => handleKeyDown(e, props.index, 'text2')}
                                            data-field="text2"
                                            value={unescape(props.rowData.text2)}
                                            onChange={(event) => {
                                                updateSub(props.rowData, {
                                                    text: event.target.value,
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
