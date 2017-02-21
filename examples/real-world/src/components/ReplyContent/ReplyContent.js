import React from 'react';

export default function ReplyContent({ html = '' }) {
  return (
    <div
      className="ReplyContent"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
