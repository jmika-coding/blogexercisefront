import React from 'react';
import '../stylesheets/App.css';

import {StateCreatePost, Props} from '../models/PostFormModel'

import JoditEditor from 'jodit-react';

export class PostForm extends React.Component<Props, StateCreatePost> {
  constructor(props: Props) {
    super(props)
    this.state = {};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleSubmit = async () => {
    const requestOptions: any = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: this.props.title, post: this.props.post, likes:0 })
    }

    await fetch("http://localhost:3000/posts", requestOptions);
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
          <div hidden={!this.props.isActive} className="createPost">
            <h3>{(this.props.isPostSelected ? "Update" : "Create") + " a post"}</h3>
            <form onSubmit={this.props.isPostSelected ? this.handleUpdate : this.handleSubmit} className="createPostForm" aria-label="postForm">
              <label>Title: <input type="text" name="title" value={this.props.title} onChange={this.props.handleInputChange} className="titleInput"/></label><br/>
              <div className="labelTextArea">
                <label>Post:</label>
                <div className="JoditEditorPost">
                  <JoditEditor value={this.props.post} onChange={this.props.handleTextAreaChange} aria-label="textarea-post"/>
                </div>
              </div>
              <div className="buttonCancelSubmit">
                <button type="button" value="Cancel" onClick={this.props.handleCancel}>Cancel</button>
                <button type="submit" value="Submit">{this.props.isPostSelected ? "Update": "Submit"}</button>
              </div>
            </form>
          </div>
      </div>
    );
  }
}
