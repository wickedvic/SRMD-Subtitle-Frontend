import React, { useState,useEffect, useRef } from 'react';
import $ from 'jquery';
import './details.css'

function EditableList() {
    const [items, setItems] = useState([
      {
        "start": "00:00:03.440",
        "end": "00:00:04.287",
        "text": "Get Inspired by new every",
      },
      {
        "start": "00:00:04.287",
        "end": "00:00:06.338",
        "text": "test sub title data",
      },
      {
        "start": "00:00:54.419",
        "end": "00:00:56.459",
        "text": "If someone comes to hit you, just remain like this.",
      },
      {
        "start": "00:00:56.459",
        "end": "00:00:58.759",
        "text": "that with non-violence...",
      },
      {
        "start": "00:00:58.759",
        "end": "00:01:00.720",
        "text": "If someone comes to hit you, just remain like this.",
      },
      {
        "start": "00:01:00.720",
        "end": "00:01:03.740",
        "text": "Don't defend yourself.",
      },
      {
        "start": "00:01:03.740",
        "end": "00:01:06.980",
        "text": "Don't hit but don't defend either.",
      },
      {
        "start": "00:01:06.980",
        "end": "00:01:09.379",
        "text": "Just stand like this and if someone hits you, fall down.",
      },
      {
        "start": "00:01:09.379",
        "end": "00:01:11.440",
        "text": "Who could ever think of...",
      },
      {
        "start": "00:01:11.440",
        "end": "00:01:16.900",
        "text": "And all were strong and brave-hearts,",
      },
      {
        "start": "00:01:16.900",
        "end": "00:01:21.379",
        "text": "and such that their blood was boiling!",
      },
      {
        "start": "00:01:21.379",
        "end": "00:01:23.839",
        "text": "But they got inspired by, they got convinced by Gandhi.",
      },
      {
        "start": "00:01:23.839",
        "end": "00:01:25.440",
        "text": "So Gandhi came out with his method of satyagraha, non-violence.",
      },
      {
        "start": "00:01:25.440",
        "end": "00:01:29.580",
        "text": "All these words never heard before.",
      },
      {
        "start": "00:01:29.580",
        "end": "00:01:32.005",
        "text": "Means they were...",
      },
      {
        "start": "00:01:32.005",
        "end": "00:01:33.620",
        "text": "we had known them, but not as a methodology.",
      },
      {
        "start": "00:01:33.620",
        "end": "00:01:36.300",
        "text": "And that too, to achieve?",
      },
      {
        "start": "00:01:36.300",
        "end": "00:01:38.440",
        "text": "Freedom.",
      },
      {
        "start": "00:01:38.440",
        "end": "00:01:40.239",
        "text": "From?",
      },
      {
        "start": "00:01:40.239",
        "end": "00:01:41.959",
        "text": "Means foreign rule.",
      },
      {
        "start": "00:01:41.959",
        "end": "00:01:46.900",
        "text": "Here, we don't need to say Britain.",
      },
      {
        "start": "00:01:46.900",
        "end": "00:01:50.319",
        "text": "From a foreign rule.",
      },
      {
        "start": "00:01:50.319",
        "end": "00:01:57.959",
        "text": "Where we don't have weapons, and they had tanks and cannons.",
      },
      {
        "start": "00:01:57.959",
        "end": "00:01:59.660",
        "text": "At that time, He spoke of non-violence.",
      },
      {
        "start": "00:01:59.660",
        "end": "00:02:02.005",
        "text": "For Buddha, the method of attaining enlightenment was Vipassana, meditation.",
      },
      {
        "start": "00:02:02.005",
        "end": "00:02:05.400",
        "text": "So that was his method.",
      },
      {
        "start": "00:02:05.400",
        "end": "00:02:10.240",
        "text": "They are clear in their method.",
      },
      {
        "start": "00:02:10.240",
        "end": "00:02:11.699",
        "text": "Inspired by everyone, but very clear in their method.",
      },
      {
        "start": "00:02:11.699",
        "end": "00:02:14.839",
        "text": "This is my methodology to attain what I need to attain.",
      },
      {
        "start": "00:02:14.839",
        "end": "00:02:16.440",
        "text": "Some said,",
      },
      {
        "start": "00:02:16.440",
        "end": "00:02:17.419",
        "text": "Abide in the Self, Buddha said.",
      },
      {
        "start": "00:02:17.419",
        "end": "00:02:21.000",
        "text": "Some said non-violence.",
      },
      {
        "start": "00:02:21.000",
        "end": "00:02:24.820",
        "text": "They...",
      },
      {
        "start": "00:02:24.820",
        "end": "00:02:28.339",
        "text": "somehow they wanted to achieve their goal is wrong.",
      },
      {
        "start": "00:02:28.339",
        "end": "00:02:32.500",
        "text": "Not somehow, they knew the way.",
      },
      {
        "start": "00:02:32.500",
        "end": "00:02:34.759",
        "text": "Show how, not somehow.",
      },
      {
        "start": "00:02:34.759",
        "end": "00:02:39.160",
        "text": "So, He says, I will attain liberation through pure love.",
      },
      {
        "start": "00:02:39.160",
        "end": "00:02:43.199",
        "text": "Then you can say supreme devotion or liberation.",
      },
      {
        "start": "00:02:43.199",
        "end": "00:02:48.003",
        "text": "I will attain liberation through meditation, say nirvana.",
      },
      {
        "start": "00:02:48.003",
        "end": "00:02:52.720",
        "text": "I will attain freedom through non-violence.",
      },
      {
        "start": "00:02:52.720",
        "end": "00:02:55.279",
        "text": "Not somehow, show how you will attain.",
      },
      {
        "start": "00:02:55.279",
        "end": "00:02:58.240",
        "text": "They had a methodology, they didn't fluctuate in the method.",
      },
      {
        "start": "00:02:58.240",
        "end": "00:02:59.279",
        "text": "Now I am unable to remain steady while meditating, let me sing devotional songs.",
      },
      {
        "start": "00:02:59.279",
        "end": "00:03:01.820",
        "text": "Now I am feeling tired while singing devotional songs, let me meditate.",
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
        "text": "The methodology was very, very clear."
      },
      {
        "start": "00:03:01.820",
        "end": "00:03:04.720",
        "text": "That's why they became great in their fields."
      }
    ]);
    const [caretPos, setCaretPos] = useState('');
    const stateStack = useRef([]);

    useEffect(() => {

      $('#editable-list').on('keydown', 'li', function(e) {
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
    
  }, []);


const handleKeyDown = (e, index, field) => {
  if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      const text = e.target.textContent;
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


const handleBlur = (e, index) => {
const newText = e.target.textContent.trim();
const itemslist = {
  "start": items[index].start,
  "end": items[index].end,
  "text": newText,
}

const newItems = [...items.slice(0, index), itemslist, ...items.slice(index + 1)];

setItems(newItems);
stateStack.current.push(newItems);
}

    return (
      <>
      <div className='listboxs'>
        <ul id="editable-list" style={{ listStyle: 'none' }}>
    {items.map((item, index) => (
        <li className="items" key={index}>
            <ul style={{ listStyle: 'none' }}>
                <li
                    contentEditable={true}
                    onKeyDown={(e) => handleKeyDown(e, index, 'start')}
                    onBlur={(e) => handleBlur(e, index, 'start')}
                    data-field="start"
                >
                    {item.start}
                </li>
                <li
                    contentEditable={true}
                    onKeyDown={(e) => handleKeyDown(e, index, 'end')}
                    onBlur={(e) => handleBlur(e, index, 'end')}
                    data-field="end"
                >
                    {item.end}
                </li>
                <li
                    contentEditable={true}
                    onKeyDown={(e) => handleKeyDown(e, index, 'text')}
                    onBlur={(e) => handleBlur(e, index, 'text')}
                    data-field="text"
                >
                    {item.text}
                </li>
            </ul>
        </li>
    ))}
</ul>
</div>

      </>
    );
}

export default EditableList;
