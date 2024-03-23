import React, { useState } from 'react';
import { Editor, EditorState, ContentState } from 'draft-js';

const DraftEditor = ({ initialContent, onChange }) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(initialContent))
  );

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    onChange(newEditorState.getCurrentContent().getPlainText());
  };

  return (
    <Editor
      editorState={editorState}
      onChange={handleEditorChange}
    />
  );
};

export default DraftEditor;
