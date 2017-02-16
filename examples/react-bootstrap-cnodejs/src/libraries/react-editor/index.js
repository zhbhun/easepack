const Draft = require('draft-js');
const draftToHtml = require('draftjs-to-html');
const draftToMarkdown = require('draftjs-to-markdown');
const { Editor: ReactDraftWYSIWYG } = require('react-draft-wysiwyg');

const ReactEditor = {
  Draft,
  draftToMarkdown,
  draftToHtml,
  ReactDraftWYSIWYG,
};
if (process.env.NODE_ENV === 'production') {
  module.exports = ReactEditor;
} else {
  module.exports = (callback) => {
    callback(ReactEditor);
  }
}
