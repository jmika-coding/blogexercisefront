import React, {FunctionComponent} from 'react';
import '../stylesheets/App.css';

import { State, Post, PostInfo, Comment } from '../models/AppModel'

import { CreatePost } from './CreatePost'
import { UpdatePost } from './UpdatePost'
import { CommentForm } from './CommentForm'


const ShowPostInfoOfAPost: FunctionComponent<PostInfo> = ({showPostInfo, likes, comments}) => {
  if(!showPostInfo) { return null; }

  return (
    <div className="topBar">
      <div className="likes"><span role="img" aria-label="Likes">👍{likes}</span></div>

      <label className="commentTitle">Comments:</label>
      {comments.map((comment:Comment) => (<div key={comment.id} className="comment">{comment.comment}</div>))}
    </div>
)}

class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      posts: [],
      isActive: false,
      isUpdate: false,
      isDelete: false,
      hideCRUDButtons: false,
      isPostSelected: false,
      title: "",
      post: "",
      likes: 0,
      postId: 0,
      isCancelComment: false
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
  handleCancelCommentForm = (id: number) => this.setState(previousState => ({posts: previousState.posts.map(el => el.id === id ? {...el, showPostInfo: false} : el), isCancelComment: true}))

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
      || {title: this.state.title, post: this.state.post, likes: this.state.likes, id: id, comments: [], showPostInfo: false, isHoverPost: false};

    this.setState({title: post.title})
    this.setState({post: post.post})
    this.setState({likes: post.likes})
    this.setState({postId: post.id})
    this.setState({isPostSelected: true})
  }
  else if(this.state.isDelete){ // DELETE
    if(window.confirm("Do you really want to delete this post ?")) {
      this.handleDeleteApi(id);
      // Remove from list of post to update the page with the removed post
      this.setState(previousState => ({
        posts: previousState.posts.filter(
          el => el.id !== id
        )
      }))
    }
    this.setState({hideCRUDButtons: false})
  }
  else {// GET / SHOW INFOS
    this.showPostInfo(id);
    this.setState({hideCRUDButtons: false})
  }
  this.setState({isActive: false, isUpdate: false, isDelete: false, isCancelComment: false})
}

// https://upmostly.com/tutorials/changing-the-background-color-in-react
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
        <div key={post2.id}
          className={post2.isHoverPost && (this.state.isUpdate || this.state.isDelete) ? "hoverPost" : "post"}
          onClick={(() => this.clickOnPost(post2.id))}
          onMouseOver={() => this.setState(previousState => ({posts: previousState.posts.map(post => post.id === post2.id ? {...post, isHoverPost: true} : post ) }))}
          onMouseLeave={() => this.setState(previousState => ({posts: previousState.posts.map(post => post.id === post2.id ? {...post, isHoverPost: false} : post ) }))}>
          <h2 className="aPost">{post2.title}</h2>
          <p>{post2.post}</p>

          <ShowPostInfoOfAPost showPostInfo={post2.showPostInfo} likes={post2.likes} comments={post2.comments}/>
          <CommentForm showPostInfo={post2.showPostInfo} postId={post2.id} handleCancelCommentForm={() => this.handleCancelCommentForm(post2.id)}/>
        </div>
      ))}
      </div>

      <CreatePost handleCancel={this.handleCancel} isActive={this.state.isActive} title="" post=""/>
      <div className="buttonsCRUD">
        <button onClick={this.handleShowOrHide} hidden={this.state.hideCRUDButtons} className="buttonCreatePost">Create a post</button>
        <button onClick={this.handleUpdate} hidden={this.state.hideCRUDButtons} className="buttonCreatePostUpdate">Update a Post</button>
        <button onClick={this.handleDelete} hidden={this.state.hideCRUDButtons} className="buttonCreatePostDelete">Delete a Post</button>
      </div>
      <h1 hidden={!this.state.isUpdate && !this.state.isDelete} className="centerText">Select a post</h1>

      <UpdatePost handleInputChange={this.handleInputChange} handleTextAreaChange={this.handleTextAreaChange}
        handleShowCRUDButtons={this.handleShowCRUDButtons} handleCancelUpdate={this.handleCancelUpdate}
        isPostSelected={this.state.isPostSelected} title={this.state.title} post={this.state.post}
        likes={this.state.likes} postId={this.state.postId}/>

    </div>
  );}
}

export default App;
