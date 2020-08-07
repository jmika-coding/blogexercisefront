import React from 'react';
import '../stylesheets/App.css';

import { StateUpdatePost, PropsUpdate } from '../models/UpdatePostModel'

export class UpdatePost extends React.Component<PropsUpdate, StateUpdatePost> {
  constructor(props: PropsUpdate) {
    super(props)
    this.state = {};
  }

  handleUpdate = async (event: React.MouseEvent<HTMLFormElement>) => {
    const requestOptions: any = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: this.props.title, post: this.props.post, likes:this.props.likes })
    }

    await fetch("http://localhost:3000/posts/" + this.props.postId, requestOptions);
    this.props.handleShowCRUDButtons(event);
  }

  render () {
    return (
      <div>
          <div hidden={!this.props.isPostSelected} className="createPost">
            <h3>Update a post</h3>
            <form onSubmit={this.handleUpdate} className="createPostForm">
              <label>Title: <input type="text" name="title" value={this.props.title} onChange={this.props.handleInputChange} className="titleInput"/></label><br/>
              <div className="labelTextArea">
                <label>Post:</label>
                <textarea name="post" value={this.props.post} onChange={this.props.handleTextAreaChange}/>
              </div>
              <div className="buttonCancelSubmit">
                <button type="button" value="Cancel" onClick={this.props.handleCancelUpdate}>Cancel</button>
                <button type="submit" value="Submit">Submit</button>
              </div>
            </form>
          </div>
      </div>
    );
  }
}
