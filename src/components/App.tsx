import React, {FunctionComponent} from 'react';
import '../stylesheets/App.css';

import { State, Post, PostInfo, Comment } from '../models/AppModel'

import { CreatePost } from './CreatePost'
import { UpdatePost } from './UpdatePost'


const ShowPostInfoOfAPost: FunctionComponent<PostInfo> = ({showPostInfo, likes, comments}) => {
  if(!showPostInfo) { return null; }

  return (
    <div>
      <div className="likes"><span role="img" aria-label="Likes">👍{likes}</span></div>

      <label className="commentTitle">Comments:</label>
      {comments.map((comment:Comment) => (<div key={comment.id} className="comment">{comment.comment}</div>))}
    </div>
)}

class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      posts: [{
        id: 0,
        title: "",
        post: "",
        likes: 0,
        comments: [{id:0, postId:0, comment:""}],
        showPostInfo: false
      }],
      isActive: false,
      isUpdate: false,
      isDelete: false,
      hideCRUDButtons: false,
      isPostSelected: false,
      title: "",
      post: "",
      likes: 0,
      postId: 0
    };

    this.showPostInfo = this.showPostInfo.bind(this);
    this.handleDeleteApi = this.handleDeleteApi.bind(this);
    this.handleShowOrHide = this.handleShowOrHide.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
  }

  // https://stackoverflow.com/questions/35537229/how-to-update-parents-state-in-react
  handleShowOrHide = () => this.setState({isActive: !this.state.isActive, hideCRUDButtons: true})
  handleUpdate = () => this.setState({isUpdate: !this.state.isUpdate, hideCRUDButtons: true})
  handleDelete = () => this.setState({isDelete: !this.state.isDelete, hideCRUDButtons: true})
  handleCancel = () => this.setState({title: "", post: "", isActive: !this.state.isActive, hideCRUDButtons: false})
  handleCancelUpdate = () => this.setState({title: "", post: "", isPostSelected: !this.state.isPostSelected, hideCRUDButtons: false})

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({title: event.target.value})
  handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({post: event.target.value})

  handleShowCRUDButtons = () => this.setState({hideCRUDButtons: false})

  componentDidMount(){
    this.callApi().then((response: Post[]) => {
      this.setState({posts: response});
    })
  }

  callApi = async() => {
    const response = await fetch("http://localhost:3000/posts");
    const body = await response.json();
    if(response.status !== 200) throw Error(body.message);

    return body;
  }

  getCommentsForAPost = async(postId: number) => {
    const response = await fetch("http://localhost:3000/comments?postId=" + postId);
    const body:Comment[] = await response.json();
    return body;
  }

  // https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
  showPostInfo = (id:number) => {
  this.getCommentsForAPost(id).then((comments:Comment[]) =>
    this.setState(previousState => ({
      posts: previousState.posts.map(
        el => el.id === id? {...el, comments: comments, showPostInfo: true }: el
      )
    }))
  )}

handleDeleteApi = async (postId: number) => {
  const requestOptions: any = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
  }

  await fetch("http://localhost:3000/posts/" + postId, requestOptions);
}

clickOnPost = (id:number) => {
  if(this.state.isUpdate) { // UPDATE
    const post:Post = this.state.posts.find(el => el.id === id)
      || {title: this.state.title, post: this.state.post, likes: this.state.likes, id: id, comments: [], showPostInfo: false};

    this.setState({title: post.title})
    this.setState({post: post.post})
    this.setState({likes: post.likes})
    this.setState({postId: post.id})
    this.setState({isPostSelected: true})
  }
  else if(this.state.isDelete){ // DELETE
    if(window.confirm("Do you really want to delete this post ?")) {
      this.handleDeleteApi(id);
      this.setState(previousState => ({
        posts: previousState.posts.filter(
          el => el.id !== id
        )
      }))
    }
    this.setState({hideCRUDButtons: false})
  }
  else { // GET / SHOW INFOS
    this.showPostInfo(id);
  }
  this.setState({isActive: false, isUpdate: false, isDelete: false})
}

render() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1 className="headerH1">Blog</h1>
        </div>
      </header>

      <div>
      {this.state.posts.map((post2:Post) => (
        <div key={post2.id} className="post" onClick={(() => this.clickOnPost(post2.id))}>
          <div className="aPost">{post2.title}</div>
          <div>{post2.post}</div>

          <ShowPostInfoOfAPost showPostInfo={post2.showPostInfo} likes={post2.likes} comments={post2.comments}/>
        </div>
      ))}
      </div>

      <CreatePost handleShowOrHide={this.handleShowOrHide} handleCancel={this.handleCancel} isDelete={this.state.isDelete} isActive={this.state.isActive} title="" post=""/>
      <div className="buttonsCRUD">
        <button onClick={this.handleShowOrHide} hidden={this.state.hideCRUDButtons} className="buttonCreatePost">Create a post</button>
        <button onClick={this.handleUpdate} hidden={this.state.hideCRUDButtons} className="buttonCreatePost">Update a Post</button>
        <button onClick={this.handleDelete} hidden={this.state.hideCRUDButtons} className="buttonCreatePost">Delete a Post</button>
      </div>
      <h1 hidden={!this.state.isUpdate && !this.state.isDelete} className="centerText">Select a post</h1>

      <UpdatePost handleInputChange={this.handleInputChange} handleTextAreaChange={this.handleTextAreaChange} handleShowCRUDButtons={this.handleShowCRUDButtons} handleShowOrHide={this.handleShowOrHide} handleCancelUpdate={this.handleCancelUpdate} /*handleUpdateTitle={this.handleUpdateTitle}*/ isDelete={this.state.isDelete} isActive={this.state.isActive} isUpdate={this.state.isUpdate} isPostSelected={this.state.isPostSelected} title={this.state.title} post={this.state.post} likes={this.state.likes} postId={this.state.postId}/>

    </div>
  );}
}

export default App;
