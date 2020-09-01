import React from 'react';
import '../stylesheets/App.css';

import { CommentProps, CommentState } from '../models/CommentFormModel'

import JoditEditor from "jodit-react"

export class CommentForm extends React.Component<CommentProps, CommentState> {
  constructor(props: CommentProps) {
    super(props)
    this.state = {};

    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.handleUpdateComment = this.handleUpdateComment.bind(this);
  }

  checkIfCommentSelectedEmptyAndCallApiIfNot = async (event: React.FormEvent<HTMLFormElement>, callApi:any) => this.props.commentSelected === "" ? (() => { event.preventDefault(); window.alert("Comment is empty. Nothing will be done.");})() : await callApi();

  handleSubmitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    this.checkIfCommentSelectedEmptyAndCallApiIfNot(event, async () => {
      const requestOptions: any = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: this.props.commentSelected })
      }

      await fetch("http://localhost:3000/comments?postId=" + this.props.postId, requestOptions);
    });

  }

  handleUpdateComment = async (event: React.FormEvent<HTMLFormElement>) => {
    this.checkIfCommentSelectedEmptyAndCallApiIfNot(event, async () => {
      const requestOptions: any = {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: this.props.commentSelected })
      }

      await fetch("http://localhost:3000/comments/" + this.props.commentId, requestOptions);
    });
  }

  render () {
    return (
      <div onClick={(event: React.MouseEvent) => {if(!this.props.isUpdateOrDelete){event.stopPropagation();}}}>
          <div hidden={!this.props.showPostInfo} className="createComment">
            <h4>{this.props.isUpdateComment ? "Update comment" : "Add comment"}</h4>
            <form onSubmit={this.props.isUpdateComment ? this.handleUpdateComment : this.handleSubmitComment} className="createCommentForm">
              <div className="labelTextArea">
                <label>Comment:</label>
                <div className="JoditEditorComment">
                  <JoditEditor value={this.props.commentSelected} onChange={(comment) => this.props.handleTextAreaChangeComment(comment, this.props.postId)}/>
                </div>
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
