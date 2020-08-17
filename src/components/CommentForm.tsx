import React from 'react';
import '../stylesheets/App.css';

import { CommentProps, CommentState } from '../models/CommentFormModel'

export class CommentForm extends React.Component<CommentProps, CommentState> {
  constructor(props: CommentProps) {
    super(props)
    this.state = {};

    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.handleUpdateComment = this.handleUpdateComment.bind(this);
  }

  handleSubmitComment = async () => {
    const requestOptions: any = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: this.props.commentSelected })
    }

    await fetch("http://localhost:3000/comments?postId=" + this.props.postId, requestOptions);
  }

  handleUpdateComment = async () => {
    const requestOptions: any = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: this.props.commentSelected })
    }

    await fetch("http://localhost:3000/comments/" + this.props.commentId, requestOptions);
  }

  render () {
    return (
      <div onClick={(event: React.MouseEvent) => {if(!this.props.isUpdateOrDelete){event.stopPropagation();}}}>
          <div hidden={!this.props.showPostInfo} className="createComment">
            <h4>{this.props.isUpdateComment ? "Update comment" : "Add comment"}</h4>
            <form onSubmit={this.props.isUpdateComment ? this.handleUpdateComment : this.handleSubmitComment} className="createCommentForm">
              <div className="labelTextArea">
                <label>Comment:</label>
                <textarea name="post" value={this.props.commentSelected} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => this.props.handleTextAreaChangeComment(event, this.props.postId)}/>
              </div>
              <div className="buttonCancelSubmitComment">
                <button type="button" value="Cancel" onClick={() => this.props.handleCancelCommentForm(this.props.postId)}>Cancel</button>
                <button type="submit" value="Submit">{this.props.isUpdateComment ? "Update" : "Submit"}</button>
              </div>
            </form>
          </div>
      </div>
    );
  }

}
