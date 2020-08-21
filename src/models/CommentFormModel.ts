export interface CommentProps {
  showPostInfo: boolean;
  postId: number;
  handleCancelCommentForm: (id: number) => void;
  handleTextAreaChangeComment: (comment: string, postId: number) => void;
  commentSelected: string;
  commentId: number;
  isUpdateComment: boolean;
  isUpdateOrDelete: boolean;
}

export interface CommentState {
}
