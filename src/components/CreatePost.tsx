import React from 'react';
import '../stylesheets/App.css';

import {StateCreatePost, Props} from '../models/CreatePostModel'

export class CreatePost extends React.Component<Props, StateCreatePost> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isActive: false,
      isUpdate: false,
      isDelete: false,
      title: props.title,
      post: props.post
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event:React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      title: event.target.value
    });
  }

  handleTextAreaChange(event:React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      post: event.target.value
    });
  }

  handleSubmit = async () => {
    const requestOptions: any = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: this.state.title, post: this.state.post, likes:0 })
    }

    await fetch("http://localhost:3000/posts", requestOptions);
  }

  render () {
    return (
      <div>
          <div hidden={!this.props.isActive} className="createPost">
            <h3>Create a post</h3>
            <form onSubmit={this.handleSubmit} className="createPostForm">
              <label>Title: <input type="text" name="title" value={this.state.title} onChange={this.handleInputChange} className="titleInput"/></label><br/>
              <div className="labelTextArea">
                <label>Post:</label>
                <textarea name="post" value={this.state.post} onChange={this.handleTextAreaChange}/>
              </div>
              <div className="buttonCancelSubmit">
                <input type="button" value="Cancel" onClick={this.props.handleCancel}/>
                <input type="submit" value="Submit"/>
              </div>
            </form>
          </div>
      </div>
    );
  }
}
