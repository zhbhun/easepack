import React from 'react';

export default function TopicContent({ html = '' }) {
  return (
    <div
      className="TopicContent"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
