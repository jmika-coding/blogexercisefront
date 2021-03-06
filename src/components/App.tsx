import React, {FunctionComponent} from 'react';
import '../stylesheets/App.css';

import { State, Post, PostInfo, Comment, FunctionComment } from '../models/AppModel'

import { PostForm } from './PostForm'
import { CommentForm } from './CommentForm'

// TODO: problem, when delete a comment it deletes it and restore old value
// One of the commit before didn't have this problem, to check

// To convert the html code from comment and post, to text that will be view
// React doc says dangerous, expose users to cross-site scripting XSS attack
// TODO: maybe find another way to convert html code less risky
const convertHtmlToText = (post: string) => {return {__html: post} }

const ShowPostInfoOfAPost: FunctionComponent<PostInfo & FunctionComment> = ({showPostInfo, likes, comments, handleClickOnComment, handleMouseOverComment, handleMouseLeaveComment, postId, isDeleteComment, isUpdateComment}) => {
  if(!showPostInfo) { return null; }

  return (
    <div className="topBar">
      <div className="likes"><span role="img" aria-label="Likes">👍{likes}</span></div>

      <label className="commentTitle">Comments:</label>
        {comments?.length > 0 ? comments.map((comment:Comment) => (
        <div key={comment.id}
          className={(comment.isHoverComment && (isDeleteComment || isUpdateComment)) ? "hoverComment" : "comment"}
          onClick={(event:React.MouseEvent) => { if(isUpdateComment){ event.stopPropagation();} handleClickOnComment(postId, comment.id)} }
          onMouseOver={() => handleMouseOverComment(postId, comment.id)}
          onMouseLeave={() => handleMouseLeaveComment(postId, comment.id)}
        >
          <div dangerouslySetInnerHTML={convertHtmlToText(comment.comment)}/>
        </div>
      ))
      : <div className="italicTextComment">There is no comments</div>}
    </div>
)}

class App extends React.Component<{}, State> {
  mounted!: boolean;
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
      commentId: 0,
      isUpdatingComment: false
    };

    this.mounted = false;

    this.showPostInfo = this.showPostInfo.bind(this);
    this.handleDeleteApi = this.handleDeleteApi.bind(this);
    this.handleShowOrHide = this.handleShowOrHide.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleTextAreaChangeComment = this.handleTextAreaChangeComment.bind(this);

    this.handleClickOnComment = this.handleClickOnComment.bind(this);
  }

  // https://stackoverflow.com/questions/35537229/how-to-update-parents-state-in-react
  handleShowOrHide = () => this.setState({isActive: true, hideCRUDButtons: true})
  handleUpdate = () => this.setState({isUpdate: true, hideCRUDButtons: true})
  handleUpdateComment = (id: number) => this.setState(previousState => ({posts: previousState.posts.map(el => el.id === id ? {...el, isUpdateComment: true} : {...el, isUpdateComment: false}) }))
  handleDelete = () => this.setState({isDelete: !this.state.isDelete, hideCRUDButtons: true})
  handleDeleteComment = (id: number) => this.setState(previousState => ({posts: previousState.posts.map(el => el.id === id ? {...el, isDeleteComment: true} : {...el, isDeleteComment: false}) }))
  handleCancel = () => this.setState({title: "", post: "", isActive: false, isPostSelected: false, hideCRUDButtons: false})
  handleCancelCommentForm = (id: number) => this.setState(previousState => ({posts: previousState.posts.map(el => el.id === id ? {...el, showPostInfo: false, isUpdateComment: false, isDeleteComment: false, commentSelected: ""} : el), isUpdatingComment: false}))

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({title: event.target.value})
  handleTextAreaChange = (post: string) => this.setState({post: post})

  handleTextAreaChangeComment = (comment: string, postId: number) => { this.setState(previousState => ({posts: previousState.posts.map(post => post.id === postId ? {...post, commentSelected: comment} : post)}))}

  handleShowCRUDButtons = () => this.setState({hideCRUDButtons: false})

  handleMouseOverComment  = (postId: number, commentId: number) => this.setState((previousState:State) => ({posts: previousState.posts.map((post:Post) => post.id === postId ? {...post, comments: post.comments.map(comment => comment.id === commentId ? {...comment, isHoverComment: true}: comment)} : post )}) )
  handleMouseLeaveComment  = (postId: number, commentId: number) => this.setState((previousState:State) => ({posts: previousState.posts.map((post:Post) => post.id === postId ? { ...post, comments: post.comments.map(comment => comment.id === commentId ? {...comment, isHoverComment: false}: comment)} : post )}) )

  componentDidMount(){
    this.mounted = true;

    this.callApi().then((response: Post[]) => {
      if(this.mounted) {
        this.setState({posts: response});
      }
    })
  }

  componentWillUnmount(){
    this.mounted = false;
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
    const hasInfo = this.state.posts.find(post => post.id ===id)?.hasInfo
    if(!hasInfo) {
      this.getCommentsForAPost(id).then((comments:Comment[]) =>
        this.setState(previousState => ({
          posts: previousState.posts.map(
            el => el.id === id? {...el, comments: comments, hasInfo: true }: el
          )
        }))
      )
    }
    this.setState(previousState => ({posts: previousState.posts.map(el => el.id === id? {...el, showPostInfo: true}: el)}))
  }

handleDeleteApi = async (postId: number) => {
  const requestOptions: any = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
  }

  await fetch("http://localhost:3000/posts/" + postId, requestOptions);
}

clickOnPost = (id:number) => {
  if(this.state.isUpdate) { // UPDATE
    const post = this.state.posts.find(post => post.id === id) || {title: "", post: "", likes: 0, id: 0, isPostSelected: false};
    this.setState({title: post.title, post: post.post, likes: post.likes, postId: post.id, isPostSelected: true})
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
    if(!this.state.isUpdatingComment) {
      this.setState(previousState => ({
        posts: previousState.posts.map(post =>
          post.id === id ? {...post, commentSelected: ""} : post
        ),
        hideCRUDButtons: false, isPostSelected: false, isUpdatingComment: false,
      }))
    }
  }
  this.setState({isActive: false, isUpdate: false, isDelete: false})
}

handleDeleteApiComment = async (commentId: number) => {
  const requestOptions: any = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
  }

  await fetch("http://localhost:3000/comments/" + commentId, requestOptions);
}

handleClickOnComment = (postId: number, commentId:number) => {
  const post = this.state.posts.find(post => post.id === postId);

  this.setState({commentId: commentId || 0})

  if(post?.isUpdateComment){ // UPDATE
    this.setState(previousState => ({
      posts: previousState.posts.map(post => post.id === postId ? {...post, isUpdateComment: false, commentSelected: post.comments.find(comment => comment.id === commentId)?.comment || ""} : post),
      isUpdatingComment: true
    }))
  }
  else if(post?.isDeleteComment){ // DELETE
    if(window.confirm("Do you really want to delete this comment ?")) {
      // Delete it with call to Api
      this.handleDeleteApiComment(commentId);
      // Remove from list of comment to update the page with the removed comment
      this.setState(previousState => ({posts: previousState.posts.map(post => post.id === postId ? {...post, comments: post.comments.filter(comment => comment.id !== commentId)} : post)}))
    }
    this.setState(previousState => ({posts: previousState.posts.map(el => el.id === postId ? {...el, isUpdateComment: false, isDeleteComment: false} : el)}))
  }
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
          onClick={() => this.clickOnPost(post2.id)}
          onMouseOver={() => this.setState(previousState => ({posts: previousState.posts.map(post => post.id === post2.id ? {...post, isHoverPost: true} : post ) }))}
          onMouseLeave={() => this.setState(previousState => ({posts: previousState.posts.map(post => post.id === post2.id ? {...post, isHoverPost: false} : post ) }))}>
          <h2 className="aPost">{post2.title}</h2>
          <div dangerouslySetInnerHTML={convertHtmlToText(post2.post)}/>

          <ShowPostInfoOfAPost showPostInfo={post2.showPostInfo} likes={post2.likes} comments={post2.comments} handleClickOnComment={this.handleClickOnComment} handleMouseOverComment={this.handleMouseOverComment} handleMouseLeaveComment={this.handleMouseLeaveComment} postId={post2.id} isDeleteComment={post2.isDeleteComment} isUpdateComment={post2.isUpdateComment}/>
          <CommentForm showPostInfo={post2.showPostInfo} postId={post2.id} handleCancelCommentForm={() => this.handleCancelCommentForm(post2.id)} handleTextAreaChangeComment={(comment: string) => this.handleTextAreaChangeComment(comment, post2.id)} commentSelected={post2.commentSelected} commentId={this.state.commentId} isUpdateOrDelete={this.state.isUpdate || this.state.isDelete} isUpdateComment={this.state.posts.find(post => post.id === post2.id)?.isUpdateComment || this.state.isUpdatingComment}/>
          <div className="buttonsCRUD">
            <button onClick={() => this.handleUpdateComment(post2.id)} hidden={!post2.showPostInfo || post2.isDeleteComment || post2.isUpdateComment || post2.comments?.length === 0} className="buttonCreatePostUpdate">Update a Comment</button>
            <button onClick={() => this.handleDeleteComment(post2.id)} hidden={!post2.showPostInfo || post2.isDeleteComment || post2.isUpdateComment || post2.comments?.length === 0} className="buttonCreatePostDelete">Delete a Comment</button>
          </div>
        </div>
      ))}
      </div>

      <PostForm handleCancel={this.handleCancel} handleInputChange={this.handleInputChange} handleTextAreaChange={this.handleTextAreaChange} handleShowCRUDButtons={this.handleShowCRUDButtons}
        title={this.state.title} post={this.state.post} likes={this.state.likes} postId={this.state.postId}
        isActive={this.state.isActive || this.state.isPostSelected} isPostSelected={this.state.isPostSelected} isUpdate={this.state.isUpdate}/>
      <div className="buttonsCRUD">
        <button onClick={this.handleShowOrHide} hidden={this.state.hideCRUDButtons} className="buttonCreatePost">Create a post</button>
        <button onClick={this.handleUpdate} hidden={this.state.hideCRUDButtons} className="buttonCreatePostUpdate">Update a Post</button>
        <button onClick={this.handleDelete} hidden={this.state.hideCRUDButtons} className="buttonCreatePostDelete">Delete a Post</button>
      </div>
      <h1 hidden={!this.state.isUpdate && !this.state.isDelete} className="centerText">Select a post</h1>

    </div>
  );}
}

export default App;
