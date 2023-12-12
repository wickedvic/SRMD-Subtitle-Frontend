import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import { Grid } from "@mui/material";
import SubtitleEditor from "react-subtitle-editor";
import WebVTT from "node-webvtt";
import Swal from "sweetalert2";
import axios from "axios";

const VideoEditor = ({ props }) => {
  let { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const subtitleData = atob(state.videoData.subtitleString);

  // console.log("Base64 Data", subtitleData);

  // console.log("Parsed Data", WebVTT.parse(subtitleData, { strict: false }));

  // const nodes = parseSubs(srt);

  const nodes = WebVTT.parse(subtitleData, { strict: false });

  var checkedArray = [];

  let timelineData = nodes.cues.map(({ start, end, text }) => {
    return { begin: start.toFixed(3), end: end.toFixed(3), text: text };
  });

  const videoRef = useRef();
  const timelineRef = useRef();

  function handleTimelineChangeStart(e) {
    videoRef.current.currentTime = timelineRef.current.currentTime;

    timelineRef.current.play();
    videoRef.current.play();
  }

  function handleTimelineChangePause(e) {
    videoRef.current.currentTime = timelineRef.current.currentTime;

    timelineRef.current.pause();
    videoRef.current.pause();
  }

  document.onkeydown = function (event) {
    var video = document.getElementById("v-5417");

    switch (event.keyCode) {
      case 32:
        event.preventDefault();
        if (video.paused) {
          handleTimelineChangeStart();
        } else {
          handleTimelineChangePause();
        }
        break;
    }
  };

  const setAligns = (props) => {
    let fixTimeProps = props.map(({ begin, end, text }) => {
      return { begin: begin + 0.01, end: end + 0.01, text: text };
    });

    localStorage.setItem("timelineProps", JSON.stringify(fixTimeProps));
    timelineData = JSON.parse(localStorage.getItem("timelineProps"));
  };

  const changeAreaShow = () => {};
  const changeShift = () => {};
  const changeZoomLevel = () => {};

  useEffect(() => {
    const video = videoRef.current;
    const timeline = timelineRef.current;

    function handleTimeUpdate() {
      timeline.currentTime = video.currentTime;
    }

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  return (
    <>
      <Backdrop
        sx={{
          color: "#FFF",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div
        style={{
          backgroundColor: "#1C2938",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "1%",
          }}
        >
          <h2 style={{ color: "white" }}>Video Editor</h2>

          <Button
            variant="contained"
            style={{
              backgroundColor: "darkred",
              height: "40px",
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "1%",
            }}
            onClick={(e) => {
              localStorage.removeItem("timelineProps");
              localStorage.removeItem("checkedForDelete");
              window.location.reload();
            }}
          >
            Reset Changes
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "darkgreen",
              height: "40px",
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "1%",
            }}
            onClick={(e) => {
              setLoading(true);
              // console.log(atob(state.videoData.subtitleString));
              const parsedSubtitle = {
                cues: [],
                valid: true,
              };
              (JSON.parse(localStorage.getItem("timelineProps")) === null
                ? timelineData
                : JSON.parse(localStorage.getItem("timelineProps"))
              ).forEach((subtitle, index) => {
                const cue = {
                  identifier: "",
                  start: subtitle.begin,
                  end: subtitle.end,
                  text: subtitle.text,
                  styles: "line:13 position:50% align:center size:80%",
                };
                parsedSubtitle.cues.push(cue);
              });

              const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);

              axios
                .put(
                  `https://speechtotexteditor.azurewebsites.net/api/v1/videos/${state.videoData.id}`,
                  {
                    subtitleString: btoa(modifiedSubtitleContent),
                  }
                )
                .then(function (response) {
                  // console.log(response.data);
                  setLoading(false);

                  Swal.fire({
                    title: "Success!",
                    text: "Your changes have been saved!",
                    icon: "success",
                    confirmButtonText: "Close",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.reload();
                    }
                  });
                })
                .catch(function (error) {
                  console.log(error);
                });
            }}
          >
            Save Changes
          </Button>

          <Button
            variant="contained"
            onClick={(e) => {
              if (
                JSON.parse(localStorage.getItem("checkedForDelete")) === null ||
                JSON.parse(localStorage.getItem("checkedForDelete")) === "[]"
              ) {
              } else {
                const updatedTimelineProps = (
                  JSON.parse(localStorage.getItem("timelineProps")) === null
                    ? timelineData
                    : JSON.parse(localStorage.getItem("timelineProps"))
                ).filter(function (value, index) {
                  return (
                    JSON.parse(
                      localStorage.getItem("checkedForDelete")
                    ).indexOf(index) === -1
                  );
                });
                localStorage.removeItem("timelineProps");
                localStorage.setItem(
                  "timelineProps",
                  JSON.stringify(updatedTimelineProps)
                );

                localStorage.removeItem("checkedForDelete");
                window.location.reload();
              }
            }}
            style={{
              backgroundColor: "#1876D2",
              height: "40px",
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "1%",
            }}
          >
            Delete Checked Subtitles
          </Button>

          <Button
            variant="contained"
            style={{
              backgroundColor: "#1876D2",
              height: "40px",
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "1%",
            }}
            onClick={(e) => {
              const parsedSubtitle = {
                cues: [],
                valid: true,
              };

              (JSON.parse(localStorage.getItem("timelineProps")) === null
                ? timelineData
                : JSON.parse(localStorage.getItem("timelineProps"))
              ).forEach((subtitle, index) => {
                const cue = {
                  identifier: (index + 1).toString(),
                  start: subtitle.begin,
                  end: subtitle.end,
                  text: subtitle.text,
                  styles: "",
                };
                parsedSubtitle.cues.push(cue);
              });

              const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);

              const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], {
                type: "text/vtt",
              });
              const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
              const a = document.createElement("a");
              a.href = downloadLink;
              a.download = "subtitles.vtt";
              a.click();
            }}
          >
            Export To VTT
          </Button>

          <Button
            variant="contained"
            style={{
              backgroundColor: "#1876D2",
              height: "40px",
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "1%",
            }}
            onClick={(e) => {
              const modifiedSubtitleContent = (
                JSON.parse(localStorage.getItem("timelineProps")) === null
                  ? timelineData
                  : JSON.parse(localStorage.getItem("timelineProps"))
              ).map(({ begin, end, text }) => {
                return {
                  startTime: begin.toFixed(3),
                  endTime: end.toFixed(3),
                  text: text,
                };
              });

              let updatedModifiedSubtitleContent = modifiedSubtitleContent.map(
                (item, index) => ({
                  ...item,
                  id: index + 1,
                })
              );

              // var srt_string = parser.toSrt(timelineData1);

              const modifiedSubtitleBlob = new Blob(
                [JSON.stringify(updatedModifiedSubtitleContent)],
                {
                  type: "text/srt",
                }
              );
              const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
              const a = document.createElement("a");
              a.href = downloadLink;
              a.download = "subtitles.srt";
              a.click();
            }}
          >
            Export To SRT
          </Button>
        </div>
        <Grid
          container
          xs={12}
          md={12}
          lg={12}
          spacing={0}
          style={{
            borderTop: "1px solid gray",
            borderBottom: "2px solid gray",
          }}
        >
          <Grid xs={6} lg={8}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#1C2938",
              }}
            >
              <div
                style={{ width: "100%", overflow: "scroll", height: "600px" }}
              >
                {(JSON.parse(localStorage.getItem("timelineProps")) === null
                  ? timelineData
                  : JSON.parse(localStorage.getItem("timelineProps"))
                ).map((node, index) => {
                  return (
                    <Timeline
                      sx={{
                        [`& .${timelineOppositeContentClasses.root}`]: {
                          flex: 0.2,
                        },
                      }}
                    >
                      <TimelineItem style={{ height: "90px" }}>
                        <TimelineOppositeContent color="textSecondary">
                          <Stack
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              flexDirection: "row",
                            }}
                          >
                            <div
                              style={{
                                color: "#FFF",
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        checkedArray.push(index);
                                        localStorage.setItem(
                                          "checkedForDelete",
                                          JSON.stringify(checkedArray)
                                        );
                                      } else {
                                        checkedArray = checkedArray.filter(
                                          (item) => item !== index
                                        );

                                        localStorage.setItem(
                                          "checkedForDelete",
                                          JSON.stringify(checkedArray)
                                        );
                                      }
                                    }}
                                  />
                                }
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div style={{ color: "#FFF" }} id="startTime">
                                {new Date(node.begin * 1000)
                                  .toISOString()
                                  .slice(12, 23)}
                              </div>

                              <div style={{ color: "#FFF" }} id="endTime">
                                {new Date(node.end * 1000)
                                  .toISOString()
                                  .slice(12, 23)}
                              </div>
                            </div>
                          </Stack>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <textarea
                            style={{
                              marginLeft: "auto",
                              width: "100%",
                              resize: "none",
                              borderRadius: "5px",
                              paddingLeft: "2%",
                              backgroundColor: "#2C3D50",
                              borderColor: "#34475B",
                              color: "white",
                            }}
                            onChange={(e) => {
                              const updateTextData =
                                JSON.parse(
                                  localStorage.getItem("timelineProps")
                                ) === null
                                  ? timelineData
                                  : JSON.parse(
                                      localStorage.getItem("timelineProps")
                                    );

                              updateTextData[index].text = e.target.value;
                              // localStorage.removeItem("timelineProps");

                              setTimeout(
                                () =>
                                  localStorage.setItem(
                                    "timelineProps",
                                    JSON.stringify(updateTextData)
                                  ),
                                1000
                              );
                            }}
                          >
                            {node.text}
                          </textarea>
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  );
                })}
              </div>
            </div>
          </Grid>
          <Grid xs={6} lg={4}>
            <Box
              id="right-panel"
              sx={{ fontSize: "12px", textTransform: "uppercase" }}
            >
              <video
                id="v-5417"
                style={{ backgroundColor: "#1C2938" }}
                width="100%"
                height="600px"
                ref={videoRef}
                src={state.videoData.videoUrl}
                controls
                onPlay={() => handleTimelineChangeStart()}
                onPause={() => handleTimelineChangePause()}
              >
                <track
                  src={`data:text/txt;base64,${state.videoData.subtitleString}`}
                  label="English"
                  kind="captions"
                  srcLang="en-us"
                  default
                ></track>
              </video>
            </Box>
          </Grid>
        </Grid>

        <div style={{ padding: "10px", backgroundColor: "#2C3D50" }}>
          <div>
            <SubtitleEditor
              changeAreaShow={changeAreaShow}
              changeZoomLevel={changeZoomLevel}
              changeShift={changeShift}
              setAligns={setAligns}
              audioRef={timelineRef}
              src={state.videoData.videoUrl}
              data={
                JSON.parse(localStorage.getItem("timelineProps")) === null
                  ? timelineData
                  : JSON.parse(localStorage.getItem("timelineProps"))
              }
              autoScroll
              paddingLeft={"10px"}
              colors={{
                background: "#2C3D50",
                box: "#c2c9d6",
                boxHover: "#80add6",
                selectedBox: "#1890ff",
                playingBox: "#f0523f",
                text: "#212b33",
                selectedText: "white",
                tooltipBackground: "#474e54",
                tooltipText: "white",
                scrollBarBackground: "#f1f3f9",
                scrollBar: "#c2c9d6",
                scrollBarHover: "#5e636e",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoEditor;
