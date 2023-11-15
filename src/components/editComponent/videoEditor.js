import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
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
import { parseSubs, parseVtt } from "frazy-parser";
import { Grid } from "@mui/material";
import VTTSubs from "../dummyFiles/dummyVTT.vtt";
import SubtitleEditor from "react-subtitle-editor";

const VideoEditor = ({ props }) => {
  let { state } = useLocation();

  let srt = `  
1
0:00:00.100 --> 0:00:04.560
Ramayana is the cultural backbone of the country.

2
0:00:04.880 --> 0:00:08.240
But let us not consider the story of Ramayana as just history.

3
0:00:11.230 --> 0:00:13.720
It has spirituality in it.

4
0:00:14.330 --> 0:00:16.230
And it starts from Navratri.

5
0:00:16.870 --> 0:00:20.810
For nine days, there was a fierce battle between Ram and Ravan. 

6
0:00:21.350 --> 0:00:24.130
And on the tenth day, Ravan dies.

7
0:00:24.670 --> 0:00:25.970
Which is called Dussehra.

8
0:00:25.970 --> 0:00:32.930
When Shri Ram was building a bridge to go to Lanka, Who was in the army?

9
0:00:34.830 --> 0:00:35.510
Squirrels.

10
0:00:35.790 --> 0:00:37.590
And in front of them were demons.

11
0:00:38.210 --> 0:00:39.550
It signifies something.

12
0:00:39.810 --> 0:00:41.510
What is your mind like?

13
0:00:42.320 --> 0:00:42.700
Like a monkey.

14
0:00:46.260 --> 0:00:48.160
And on the other side, what is your mind like?

15
0:00:48.360 --> 0:00:49.040
Like a demon.

16
0:00:49.580 --> 0:00:50.200
The battle between the two.

17
0:00:50.200 --> 0:00:51.580
the war between the two.

18
0:00:51.800 --> 0:00:57.040
And all these monkeys, monkeys, crickets, etc.

19
0:00:58.300 --> 0:00:59.040
were joined with Lord Ram.
`;

  const nodes = parseSubs(srt);
  let timelineData = nodes.map(({ start, end, body }) => {
    return { begin: start, end: end, text: body[0].text };
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

  const setAligns = (props) => {
    localStorage.setItem("timelineProps", JSON.stringify(props));
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "1%",
        }}
      >
        <h2>Video Editor for {state.videoData.vidURL}</h2>

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
            window.location.reload();
          }}
        >
          Reset Changes
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "green",
            height: "40px",
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: "1%",
          }}
          onClick={(e) => {
            window.location.reload();
          }}
        >
          Save Changes
        </Button>
      </div>
      <Grid
        container
        xs={12}
        md={12}
        lg={12}
        spacing={0}
        style={{ border: "5px solid gray" }}
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
            <div style={{ width: "100%", overflow: "scroll", height: "600px" }}>
              {(JSON.parse(localStorage.getItem("timelineProps")) === null
                ? timelineData
                : JSON.parse(localStorage.getItem("timelineProps"))
              ).map((node) => {
                return (
                  <Timeline
                    sx={{
                      [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                      },
                    }}
                  >
                    <TimelineItem>
                      <TimelineOppositeContent color="textSecondary">
                        <Stack
                          justifyContent="flex-end"
                          alignItems="flex-start"
                        >
                          <div
                            style={{
                              color: "#FFF",
                            }}
                          >
                            <FormControlLabel control={<Checkbox />} />
                          </div>
                          <div style={{ color: "#FFF" }}>
                            {new Date(node.begin * 1000)
                              .toISOString()
                              .slice(12, 23)}
                          </div>

                          <div style={{ color: "#FFF" }}>
                            {new Date(node.end * 1000)
                              .toISOString()
                              .slice(12, 23)}
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
                            console.log(e);
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
              style={{ backgroundColor: "#1C2938" }}
              width="100%"
              height="600px"
              ref={videoRef}
              src={
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              }
              controls
              onPlay={() => handleTimelineChangeStart()}
              onPause={() => handleTimelineChangePause()}
            >
              <track
                src={VTTSubs}
                label="English"
                kind="captions"
                srclang="en-us"
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
            src={
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            }
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
  );
};

export default VideoEditor;
