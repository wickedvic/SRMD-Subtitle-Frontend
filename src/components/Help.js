import React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Help = () => {
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            <h2
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginLeft: '1%',
                }}
            >
                Help
            </h2>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Videos Section</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <ol>
                            <li>Videos that are still "PROCESSING"" will have a disabled pencil icon next to it.</li>
                            <li>
                                When a video has a status of "READY", click the pencil icon. This will take you to the
                                video editor section.
                            </li>
                            <li>Here you can edit your video subtitles.</li>
                            <li>To Play/Pause the video either click directly on the video, or use the space bar.</li>
                            <li>
                                To edit a subtitle box, you can either do it directly in the text box or hover over the
                                subtitle on the video player and edit there. You can also split a subtitle by hovering
                                on the video player subtitle, putting your cursor where you want and clicking "Split
                                Subtitle".
                            </li>
                            <li>
                                To delete a subtitle box, right click on it on the bottom timeline. Then click "Delete
                                Subtitle".
                            </li>
                            <li>
                                To merge a subtitle box, right click on it on the bottom timeline. Then click "Merge
                                Next". This will merge with the subtitle box directly next to it.
                            </li>
                            <li>
                                To revert any changes you have made click "Clear". Becareful as this will completely
                                reset any and all changes you have made.
                            </li>
                            <li>To undo any changes you have made click "Undo" or use Ctrl + Z.</li>
                            <li>
                                When you have finished editing all your subtitles make sure you click "Save" and export
                                your video either as a VTT or SRT file. If the video editor detects any time overlaps
                                you will have an error thrown at you asking to make fixes before saving to the server.
                            </li>
                        </ol>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography>Users Section</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <ol>
                            <li>See all Users we currently have in our system.</li>
                            <li>Editing user features will come in the future.</li>
                        </ol>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            {/* <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Step #3</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion> */}
        </div>
    );
};

export default Help;
