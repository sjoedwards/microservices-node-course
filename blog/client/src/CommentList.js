import React from "react";
import propTypes from "prop-types";

const CommentList = ({ comments = [] }) => {
  const renderedComments = comments.map((comment) => {
    const content = (() => {
      switch (comment.status) {
        case "pending":
          return "This comment is sill being reviewed";
        case "rejected":
          return "This comment has been rejected";
        case "approved":
          return comment.content;
      }
    })();
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

CommentList.propTypes = {
  postId: propTypes.string.isRequired,
  comments: propTypes.array,
};

export default CommentList;
