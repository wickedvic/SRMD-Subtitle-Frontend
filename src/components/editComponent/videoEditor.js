import React from "react";
import { useLocation } from "react-router-dom";

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
import { parseSubs } from "frazy-parser";
import { Grid } from "@mui/material";
import ReactPlayer from "react-player/lazy";
import VTTSubs from "../dummyFiles/dummyVTT.vtt";

const VideoEditor = ({ props }) => {
  let { state } = useLocation();

  let srt = `  
1
0:00:00.100 --> 0:00:04.560 line:70% fontSize: 14pt
Ramayana is the cultural backbone of the country.

2
0:00:04.880 --> 0:00:08.240 line:70%
But let us not consider the story of Ramayana as just history.

3
0:00:11.230 --> 0:00:13.720 line:70%
It has spirituality in it.

4
0:00:14.330 --> 0:00:16.230 line:70%
And it starts from Navratri.

5
0:00:16.870 --> 0:00:20.810 line:70%
For nine days, there was a fierce battle between Ram and Ravan. 

6
0:00:21.350 --> 0:00:24.130 line:70%
And on the tenth day, Ravan dies.

7
0:00:24.670 --> 0:00:25.970 line:70%
Which is called Dussehra.

8
0:00:25.970 --> 0:00:32.930 line:70%
When Shri Ram was building a bridge to go to Lanka, Who was in the army?

9
0:00:34.830 --> 0:00:35.510 line:70%
Squirrels.

10
0:00:35.790 --> 0:00:37.590 line:70%
And in front of them were demons.

11
0:00:38.210 --> 0:00:39.550 line:70%
It signifies something.

12
0:00:39.810 --> 0:00:41.510 line:70%
What is your mind like?

13
0:00:42.320 --> 0:00:42.700 line:70%
Like a monkey.

14
0:00:46.260 --> 0:00:48.160 line:70%
And on the other side, what is your mind like?

15
0:00:48.360 --> 0:00:49.040 line:70%
Like a demon.

16
0:00:49.580 --> 0:00:50.200 line:70%
The battle between the two.

17
0:00:50.200 --> 0:00:51.580 line:70%
the war between the two.

18
0:00:51.800 --> 0:00:57.040 line:70%
And all these monkeys, monkeys, crickets, etc.

19
0:00:58.300 --> 0:00:59.040 line:70%
were joined with Lord Ram.
`;

  const nodes = parseSubs(srt);

  return (
    <div>
      <h2
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "1%",
        }}
      >
        Video Editor for {state.videoData.vidURL}
      </h2>

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
              {nodes.map((node) => {
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
                            {new Date(node.start * 1000)
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
                          {node.body[0].text}
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
            <ReactPlayer
              config={{
                file: {
                  attributes: {
                    crossOrigin: "true",
                  },
                  tracks: [
                    {
                      kind: "subtitles",
                      src: VTTSubs,
                      srcLang: "English",
                      default: true,
                      color: "orange",
                    },
                  ],
                },
              }}
              onReady={() => console.log("ready")}
              onStart={() => console.log("onStart")}
              onPause={() => console.log("onPause")}
              onEnded={() => console.log("onEnded")}
              onError={() => console.log("onError")}
              onPlay={() => {
                console.log("onPlay");
              }}
              url={
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              }
              playing={false}
              width="100%"
              height="600px"
              controls={true}
              style={{ backgroundColor: "#1C2938" }}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default VideoEditor;
