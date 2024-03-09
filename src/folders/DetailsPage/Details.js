import React, { useState, useRef, useEffect } from 'react';

const Details = () => {
    const [items, setItems] = useState([]); 
    const textAreaRefs = useRef([]);
    const data = [
        {
          "start": "00:00:03.440",
          "end": "00:00:04.287",
          "text": "Get Inspired by new every\none, anyone",
          "text2": "Get Inspired by new every\none, anyone"
        },
        {
          "start": "00:00:04.287",
          "end": "00:00:06.338",
          "text": "test sub title data",
          "text2": "4.29 - 6.34 seconds\n16 / 32"
        },
        {
          "start": "00:00:09.300",
          "end": "00:00:14.439",
          "text": "4.29 - 6.34 seconds\n 16 / 32",
          "text2": "9.30 - 14.44 seconds\n 11 / 59"
        },
        {
          "start": "00:00:14.439",
          "end": "00:00:23.159",
          "text": "6.00 - 9.30 seconds\n 5 / 16",
          "text2": "14.44 - 23.16 seconds\n 8 / 74"
        },
        {
          "start": "00:00:23.159",
          "end": "00:00:25.159",
          "text": "9.30 - 14.44 seconds\n 11 / 59",
          "text2": "23.16 - 25.16 seconds\n 12 / 23"
        },
        {
          "start": "00:00:25.159",
          "end": "00:00:28.899",
          "text": "14.44 - 23.16 seconds\n 8 / 74",
          "text2": "And I do get inspired, so I'm not saying this alone is right."},
        {
          "start": "00:00:28.899",
          "end": "00:00:30.819",
          "text": "23.16 - 25.16 seconds\n 12 / 23",
          "text2": "28.90 - 30.82 seconds\n 16 / 31"
        },
        {
          "start": "00:00:30.819",
          "end": "00:00:34.400",
          "text": "25.16 - 28.90 seconds\n  16 / 61",
          "text2": "30.82 - 34.40  seconds\n 8 / 27"
        },
        {
          "start": "00:00:34.400",
          "end": "00:00:38.580",
          "text": "28.90 - 30.82 seconds\n 16 / 31",
          "text2": "but I will create my methodology."
        },
        {
          "start": "00:00:38.580",
          "end": "00:00:42.319",
          "text": "30.82 - 34.40 seconds\n 8 / 27",
          "text2": "38.58 - 4d2.32 seconds\n 11 / 42"
        },
        {
          "start": "00:00:42.319",
          "end": "00:00:46.240",
          "text": "34.40 - 38.58 seconds\n                                                    8 / 33",
          "text2": "42.32 - 46.24 seconds\n                                                    14 / 55"
        },
        {
          "start": "00:00:46.240",
          "end": "00:00:48.659",
          "text": "38.58 - 42.32 seconds\n                                                    11 / 42",
          "text2": "46.24 - 48.66 seconds\n                                                    21 / 52"
        },
        {
          "start": "00:00:48.659",
          "end": "00:00:52.880",
          "text": "42.32 - 46.24 seconds\n                                                    14 / 55",
          "text2": "48.66 - 52.88 seconds\n                                                    15 / 62"
        },
        {
          "start": "00:00:52.880",
          "end": "00:00:54.419",
          "text": "46.24 - 48.66 seconds\n                                                    21 / 52",
          "text2": "that with non-violence..."
        },
        {
          "start": "00:00:54.419",
          "end": "00:00:56.459",
          "text": "48.66 - 52.88 seconds\n                                                    15 / 62",
          "text2": "If someone comes to hit you, just remain like this."
        },
        {
          "start": "00:00:56.459",
          "end": "00:00:58.759",
          "text": "that with non-violence...",
          "text2": "Don't defend yourself."
        },
        {
          "start": "00:00:58.759",
          "end": "00:01:00.720",
          "text": "If someone comes to hit you, just remain like this.",
          "text2": "Don't hit bu\nt don't defend either."
        },
        {
          "start": "00:01:00.720",
          "end": "00:01:03.740",
          "text": "Don't defend yourself.",
          "text2": "Just stand like this and if someone hits you, fall down."
        },
        {
          "start": "00:01:03.740",
          "end": "00:01:06.980",
          "text": "Don't hit but don't defend either.",
          "text2": "Who could ever think of..."
        },
        {
          "start": "00:01:06.980",
          "end": "00:01:09.379",
          "text": "Just stand like this and if someone hits you, fall down.",
          "text2": "And all were strong and brave-hearts,"
        },
        {
          "start": "00:01:09.379",
          "end": "00:01:11.440",
          "text": "Who could ever think of...",
          "text2": "and such that their blood was boiling!"
        },
        {
          "start": "00:01:11.440",
          "end": "00:01:16.900",
          "text": "And all were strong and brave-hearts,",
          "text2": "But they got inspired by, they got convinced by Gandhi."
        },
        {
          "start": "00:01:16.900",
          "end": "00:01:21.379",
          "text": "and such that their blood was boiling!",
          "text2": "So Gandhi came out with his method of satyagraha, non-violence."
        },
        {
          "start": "00:01:21.379",
          "end": "00:01:23.839",
          "text": "But they got inspired by, they got convinced by Gandhi.",
          "text2": "All these words never heard before."
        },
        {
          "start": "00:01:23.839",
          "end": "00:01:25.440",
          "text": "So Gandhi came out with his method of satyagraha, non-violence.",
          "text2": "Means they were..."
        },
        {
          "start": "00:01:25.440",
          "end": "00:01:29.580",
          "text": "All these words never heard before.",
          "text2": "we had known them, but not as a methodology."
        },
        {
          "start": "00:01:29.580",
          "end": "00:01:32.005",
          "text": "Means they were...",
          "text2": "And that too, to achieve?"
        },
        {
          "start": "00:01:32.005",
          "end": "00:01:33.620",
          "text": "we had known them, but not as a methodology.",
          "text2": "Freedom."
        },
        {
          "start": "00:01:33.620",
          "end": "00:01:36.300",
          "text": "And that too, to achieve?",
          "text2": "From?"
        },
        {
          "start": "00:01:36.300",
          "end": "00:01:38.440",
          "text": "Freedom.",
          "text2": "Means foreign rule."
        },
        {
          "start": "00:01:38.440",
          "end": "00:01:40.239",
          "text": "From?",
          "text2": "Here, we don't need to say Britain."
        },
        {
          "start": "00:01:40.239",
          "end": "00:01:41.959",
          "text": "Means foreign rule.",
          "text2": "From a foreign rule."
        },
        {
          "start": "00:01:41.959",
          "end": "00:01:46.900",
          "text": "Here, we don't need to say Britain.",
          "text2": "Where we don't have weapons, and they had tanks and cannons."
        },
        {
          "start": "00:01:46.900",
          "end": "00:01:50.319",
          "text": "From a foreign rule.",
          "text2": "At that time, He spoke of non-violence."
        },
        {
          "start": "00:01:50.319",
          "end": "00:01:57.959",
          "text": "Where we don't have weapons, and they had tanks and cannons.",
          "text2": "For Buddha, the method of attaining enlightenment was sVipassana, meditation."
        },
        {
          "start": "00:01:57.959",
          "end": "00:01:59.660",
          "text": "At that time, He spoke of non-violence.",
          "text2": "So that was his method."
        },
        {
          "start": "00:01:59.660",
          "end": "00:02:02.005",
          "text": "For Buddha, the method of attaining enlightenment was Vipassana, meditation.",
          "text2": "They are clear in their method."
        },
        {
          "start": "00:02:02.005",
          "end": "00:02:05.400",
          "text": "So that was his method.",
          "text2": "Inspired by everyone, but very clear in their method."
        },
        {
          "start": "00:02:05.400",
          "end": "00:02:10.240",
          "text": "They are clear in their method.",
          "text2": "This is my methodology to attain what I need to attain."
        },
        {
          "start": "00:02:10.240",
          "end": "00:02:11.699",
          "text": "Inspired by everyone, but very clear in their method.",
          "text2": "Some said,"
        },
        {
          "start": "00:02:11.699",
          "end": "00:02:14.839",
          "text": "This is my methodology to attain what I need to attain.",
          "text2": "Abide in the Self, Buddha said."
        },
        {
          "start": "00:02:14.839",
          "end": "00:02:16.440",
          "text": "Some said,",
          "text2": "Some said non-violence."
        },
        {
          "start": "00:02:16.440",
          "end": "00:02:17.419",
          "text": "Abide in the Self, Buddha said.",
          "text2": "They..."
        },
        {
          "start": "00:02:17.419",
          "end": "00:02:21.000",
          "text": "Some said non-violence.",
          "text2": "somehow they wanted to achieve their goal is wrong."
        },
        {
          "start": "00:02:21.000",
          "end": "00:02:24.820",
          "text": "They...",
          "text2": "Not somehow, they knew the way."
        },
        {
          "start": "00:02:24.820",
          "end": "00:02:28.339",
          "text": "somehow they wanted to achieve their goal is wrong.",
          "text2": "Show how, not somehow."
        },
        {
          "start": "00:02:28.339",
          "end": "00:02:32.500",
          "text": "Not somehow, they knew the way.",
          "text2": "So, He says, I will attain liberation through pure love."
        },
        {
          "start": "00:02:32.500",
          "end": "00:02:34.759",
          "text": "Show how, not somehow.",
          "text2": "Then you can say supreme devotion or liberation."
        },
        {
          "start": "00:02:34.759",
          "end": "00:02:39.160",
          "text": "So, He says, I will attain liberation through pure love.",
          "text2": "I will attain liberation through meditation, say nirvana."
        },
        {
          "start": "00:02:39.160",
          "end": "00:02:43.199",
          "text": "Then you can say supreme devotion or liberation.",
          "text2": "I will attain freedom through non-violence."
        },
        {
          "start": "00:02:43.199",
          "end": "00:02:48.003",
          "text": "I will attain liberation through meditation, say nirvana.",
          "text2": "Not somehow, show how you will attain."
        },
        {
          "start": "00:02:48.003",
          "end": "00:02:52.720",
          "text": "I will attain freedom through non-violence.",
          "text2": "They had a methodology, they didn't fluctuate in the method."
        },
        {
          "start": "00:02:52.720",
          "end": "00:02:55.279",
          "text": "Not somehow, show how you will attain.",
          "text2": "Now I am unable to remain steady while meditating, let me sing devotional songs."
        },
        {
          "start": "00:02:55.279",
          "end": "00:02:58.240",
          "text": "They had a methodology, they didn't fluctuate in the method.",
          "text2": "Now I am feeling tired while singing devotional songs, let me meditate."
        },
        {
          "start": "00:02:58.240",
          "end": "00:02:59.279",
          "text": "Now I am unable to remain steady while meditating, let me sing devotional songs.",
          "text2": "Not like that."
        },
        {
          "start": "00:02:59.279",
          "end": "00:03:01.820",
          "text": "Now I am feeling tired while singing devotional songs, let me meditate.",
          "text2": "The methodology was very, very clear."
        },
        {
          "start": "00:03:01.820",
          "end": "00:03:04.720",
          "text": "Not like that.",
          "text2": "That's why they became great in their fields."
        },
        {
          "start": "00:02:59.279",
          "end": "00:03:01.820",
          "text": "The methodology was very, very clear.",
          "text2": "The methodology was very, very clear."
        },
        {
          "start": "00:03:01.820",
          "end": "00:03:04.720",
          "text": "That's why they became great in their fields.",
          "text2": "That's why they became great in their fields."
        }
      ]


      useEffect(() => {
        textAreaRefs.current = items.map(() => React.createRef());
        setItems(data);
    }, [items]);

    const focusOnNextTextArea = (index) => {
        if (textAreaRefs.current[index + 1]) {
          setTimeout(() => textAreaRefs.current[index + 1].current.focus(), 0);
        }
      };
    
      const handleKeyPress = (event, index) => {
        if (event.key === 'Enter' && event.shiftKey) {
          event.preventDefault();
          const newItems = [...items];
          newItems.splice(index + 1, 0, '');
          setItems(newItems);
          focusOnNextTextArea(index);
        } else if (event.key === 'Enter') {
          event.preventDefault();
          const currentTextArea = textAreaRefs.current[index].current;
          const cursorPos = currentTextArea.selectionStart;
          const newItems = [...items];
          newItems[index] =
            items[index].substring(0, cursorPos) +
            '\n' +
            items[index].substring(cursorPos);
          setItems(newItems);
          focusOnNextTextArea(index);
        }
      };
    
      const handleTextAreaChange = (event, index) => {
        const newItems = [...items];
        newItems[index] = event.target.value;
        setItems(newItems);
      };
  

  return (
    <>
        

        {items.map((item, index) => (
        <textarea
          key={index}
          ref={textAreaRefs.current[index]}
          defaultValue={item.text2}
          onChange={(e) => handleTextAreaChange(e, index)}
          onKeyDown={(e) => handleKeyPress(e, index)}
        />
      ))}
    </>
  )
}

export default Details
