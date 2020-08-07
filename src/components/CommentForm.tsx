import React from 'react';
import '../stylesheets/App.css';

import { CommentProps, CommentState } from '../models/CommentFormModel'

export class CommentForm extends React.Component<CommentProps, CommentState> {
  constructor(props: CommentProps) {
    super(props)
    this.state = {
      comment: ""
    };

    this.handleSubmitComment = this.handleSubmitComment.bind(this);
  }

  handleSubmitComment = async () => {
    const requestOptions: any = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: this.state.comment })
    }

    await fetch("http://localhost:3000/comments?postId=" + this.props.postId, requestOptions);
  }

  handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({comment: event.target.value})

  render () {
    return (
      <div>
          <div hidden={!this.props.showPostInfo} className="createComment">
            <h4>Add comment</h4>
            <form onSubmit={this.handleSubmitComment} className="createCommentForm">
              <div className="labelTextArea">
                <label>Comment:</label>
                <textarea name="post" value={this.state.comment} onChange={this.handleTextAreaChange}/>
              </div>
              <div className="buttonCancelSubmitComment">
                <button type="button" value="Cancel" onClick={(event: React.MouseEvent) => { event.stopPropagation(); this.props.handleCancelCommentForm(this.props.postId); }}>Cancel</button>
                <button type="submit" value="Submit">Submit</button>
              </div>
            </form>
          </div>
      </div>
    );
  }

}
