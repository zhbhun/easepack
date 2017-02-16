import React, { Component } from 'react';

let ReactEditor = null;
let ReactEditorLoading = false;
const loadReactEditor = () => {
  ReactEditorLoading = true;
  const waitForChunk = require('react-editor');
  waitForChunk((chunk) => {
    ReactEditor = chunk;
    ReactEditorLoading = true;
  });
}

class Editor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: !!ReactEditor,
      editorState: undefined,
    };

    this.editorLoader = null;
  }

  componentWillMount() {
    if (!this.state.loaded && !ReactEditorLoading) {
      loadReactEditor();
    }
  }

  componentDidMount() {
    this.checkEditorLoader();
  }

  componentWillUnmount() {
    if (this.editorLoader) {
      clearInterval(this.editorLoader);
    }
  }

  getMarkdownText = () => {
    const { editorState } = this.state;
    if (!editorState) {
      return '';
    }
    const {
      Draft: { convertToRaw },
      draftToMarkdown,
    } = ReactEditor;
    return draftToMarkdown(convertToRaw(editorState.getCurrentContent())).trim();
  }

  getHtmlText = () => {
    const { editorState } = this.state;
    if (!editorState) {
      return '';
    }
    const {
      Draft: { convertToRaw },
      draftToHtml,
    } = ReactEditor;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }

  checkEditorLoader = () => {
    this.editorLoader = setInterval(() => {
      if (ReactEditor) {
        clearInterval(this.editorLoader);
        delete this.editorLoader;
        this.setState(({ loaded: true }));
      }
    }, 100);
  }

  clear = () => {
    this.setState({ editorState: undefined });
  }

  setPlainText = (text) => {
    const {
      Draft: { ContentState, EditorState },
    } = ReactEditor;
    const contentState = ContentState.createFromText(text);
    const editorState = EditorState.createWithContent(contentState);
    this.setState({ editorState });
  }

  handleEditorStateChange = (editorState) => {
    this.setState({ editorState });
  }

  render = () => {
    const { loaded, editorState } = this.state;
    if (!loaded) {
      return <div>loading...</div>;
    }
    const {
      ReactDraftWYSIWYG,
    } = ReactEditor;
    return (
      <ReactDraftWYSIWYG
        editorState={editorState}
        toolbar={{ options: ['blockType', 'list', 'inline', 'link', 'emoji', 'image'] }}
        onEditorStateChange={this.handleEditorStateChange}
      />
    );
  }
}

export default Editor;
