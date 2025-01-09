import React from 'react';

const Article = ({ title, description, url, source }) => {
  return (
    <div className="article">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Read more
      </a>
      <p><strong>Source:</strong> {source}</p>
    </div>
  );
};

export default Article;
