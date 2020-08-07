export interface CommentProps {
  showPostInfo: boolean;
  postId: number;
  handleCancelCommentForm: (id: number) => void;
}

export interface CommentState {
  comment: string;
}
