import React from 'react';

const ArticleList = ({ articles }) => {
  if (!Array.isArray(articles) || articles.length === 0) {
    return <div>No articles available for this category.</div>;
  }

  return (
    <div>
      {articles.map((article, index) => (
        <div key={index}>
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
