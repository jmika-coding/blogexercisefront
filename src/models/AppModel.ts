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
}

export interface Post {
  id: number;
  title: string;
  post: string;
  likes: number;
  comments: Comment[];
  showPostInfo: boolean;
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
}
