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
        body: JSON.stringify({ comment: this.props.comment })
    }

    await fetch("http://localhost:3000/comments?postId=" + this.props.postId, requestOptions);
  }

  handleUpdateComment = async () => {
    const requestOptions: any = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: this.props.comment })
    }

    await fetch("http://localhost:3000/comments/" + this.props.commentId, requestOptions);
  }

  render () {
    return (
      <div onClick={(event: React.MouseEvent) => event.stopPropagation()}>
          <div hidden={!this.props.showPostInfo} className="createComment">
            <h4>{this.props.isUpdate ? "Update comment" : "Add comment"}</h4>
            <form onSubmit={this.props.isUpdate ? this.handleUpdateComment : this.handleSubmitComment} className="createCommentForm">
              <div className="labelTextArea">
                <label>Comment:</label>
                <textarea name="post" value={this.props.comment} onChange={this.props.handleTextAreaChangeComment}/>
              </div>
              <div className="buttonCancelSubmitComment">
                <button type="button" value="Cancel" onClick={() => this.props.handleCancelCommentForm(this.props.postId)}>Cancel</button>
                <button type="submit" value="Submit">{this.props.isUpdate ? "Update" : "Submit"}</button>
              </div>
            </form>
          </div>
      </div>
    );
  }

}
