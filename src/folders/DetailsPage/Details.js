import React, { useState, useRef } from 'react';
import $ from 'jquery';
import './details.css'

function EditableList() {
    const [items, setItems] = useState([
      {
        "start": "00:00:03.440",
        "end": "00:00:04.287",
        "text": "Get Inspired by new every",
        "text2": "Get Inspired by new every",
      },
      {
        "start": "00:00:04.287",
        "end": "00:00:06.338",
        "text": "test sub title data",
        "text2": "test sub title data",
      },
      {
        "start": "00:00:54.419",
        "end": "00:00:56.459",
        "text": "If someone comes to hit you, just remain like this.",
        "text2": "If someone comes to hit you, just remain like this.",
      },
      {
        "start": "00:00:56.459",
        "end": "00:00:58.759",
        "text": "that with non-violence...",
        "text2": "that with non-violence...",
      },
      {
        "start": "00:00:58.759",
        "end": "00:01:00.720",
        "text": "If someone comes to hit you, just remain like this.",
        "text2": "If someone comes to hit you, just remain like this.",
      },
      {
        "start": "00:01:00.720",
        "end": "00:01:03.740",
        "text": "Don't defend yourself.",
        "text2": "Don't defend yourself.",
      },
      {
        "start": "00:01:03.740",
        "end": "00:01:06.980",
        "text": "Don't hit but don't defend either.",
        "text2": "Don't hit but don't defend either.",
      },
      {
        "start": "00:01:06.980",
        "end": "00:01:09.379",
        "text": "Just stand like this and if someone hits you, fall down.",
        "text2": "Just stand like this and if someone hits you, fall down.",
      },
      {
        "start": "00:01:09.379",
        "end": "00:01:11.440",
        "text": "Who could ever think of...",
        "text2": "Who could ever think of...",
      },
      {
        "start": "00:01:11.440",
        "end": "00:01:16.900",
        "text": "And all were strong and brave-hearts,",
        "text2": "And all were strong and brave-hearts,",
      },
      {
        "start": "00:01:16.900",
        "end": "00:01:21.379",
        "text": "and such that their blood was boiling!",
        "text2": "and such that their blood was boiling!",
      },
      {
        "start": "00:01:21.379",
        "end": "00:01:23.839",
        "text": "But they got inspired by, they got convinced by Gandhi.",
        "text2": "But they got inspired by, they got convinced by Gandhi.",
      },
      {
        "start": "00:01:23.839",
        "end": "00:01:25.440",
        "text": "So Gandhi came out with his method of satyagraha, non-violence.",
        "text2": "So Gandhi came out with his method of satyagraha, non-violence.",
      },
      {
        "start": "00:01:25.440",
        "end": "00:01:29.580",
        "text": "All these words never heard before.",
        "text2": "All these words never heard before.",
      },
      {
        "start": "00:01:29.580",
        "end": "00:01:32.005",
        "text": "Means they were...",
        "text2": "Means they were...",
      },      
    ]);
    const stateStack = useRef([]);

    const handleKeyDown = (e, index, field) => {
      if (e.shiftKey && e.key === 'Enter') {
          e.preventDefault();

          if(field==='text' || field==='text2')
          {

          const text = e.target.value;
          const caretOffset = e.target.selectionStart;
          const newTextBefore = text.substring(0, caretOffset).trim();
          const newTextAfter = text.substring(caretOffset).trim();
          const newItems = [
              ...items.slice(0, index),
              { ...items[index], ['text']: newTextBefore, ['text2']: newTextBefore },
              { ...items[index], ['text']: newTextAfter, ['text2']: newTextAfter },
              ...items.slice(index + 1)
          ];
          setItems(newItems);
          stateStack.current.push(newItems);
        }
      } else if (e.key === 'ArrowUp' && index > 0) {
          e.preventDefault();
          document.querySelectorAll('.item')[index - 1].querySelector(`[data-field="${field}"]`).focus();
      } else if (e.key === 'ArrowDown' && index < items.length - 1) {
          e.preventDefault();
          document.querySelectorAll('.item')[index + 1].querySelector(`[data-field="${field}"]`).focus();
      }
    };

    const handleChangeText = (e, index, field) => {
      const text = e.target.value;
      const newItems = [...items];
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
      setItems(newItems);
    };

    return (
      <>
      <div className='listboxs'>
        <div id="editablelist" style={{ listStyle: 'none' }}>
    {items.map((item, index) => (
        <div className="itemsalist" key={index}>
            <div className='item'>
                <textarea className='test'
                    onKeyDown={(e) => handleKeyDown(e, index, 'start')}
                    onChange={(e) => handleChangeText(e, index, 'start')}
                    data-field="start"
                    value={item.start}
                >
                </textarea>
                <textarea className='test'
                    onKeyDown={(e) => handleKeyDown(e, index, 'end')}
                    onChange={(e) => handleChangeText(e, index, 'end')}
                    data-field="end"
                    value={item.end}
                >
                </textarea>
                <textarea className='test'
                    onKeyDown={(e) => handleKeyDown(e, index, 'text')}
                    onChange={(e) => handleChangeText(e, index, 'text')}
                    data-field="text"
                    value={item.text}
                >
                </textarea>
                <textarea className='test'
                    onKeyDown={(e) => handleKeyDown(e, index, 'text2')}
                    onChange={(e) => handleChangeText(e, index, 'text2')}
                    data-field="text2"
                    value={item.text2}
                >
                </textarea>
            </div>
        </div>
    ))}
</div>
</div>

      </>
    );
}

export default EditableList;
