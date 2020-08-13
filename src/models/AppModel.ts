export interface State {
  posts: Post[];
  isActive: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  hideCRUDButtons: boolean;
  title: string;
  post: string;
  likes: number;
  postId: number;
  isPostSelected: boolean;
  isCancelComment: boolean;
}

export interface Post {
  id: number;
  title: string;
  post: string;
  likes: number;
  comments: Comment[];
  showPostInfo: boolean;
  isHoverPost: boolean;
  isDeleteComment: boolean;
}

export interface PostInfo {
  likes: number;
  comments: Comment[];
  showPostInfo: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  comment: string;
  isHoverComment: boolean;
}

export interface FunctionComment {
  handleClickOnComment: (postId:  number, commentId: number) => void;
  handleMouseOverComment: (postId:  number, commentId: number) => void;
  handleMouseLeaveComment: (postId:  number, commentId: number) => void;
  postId: number;
  isDeleteComment: boolean;
}
