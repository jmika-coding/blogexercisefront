export interface CommentProps {
  showPostInfo: boolean;
  postId: number;
  handleCancelCommentForm: (id: number) => void;
  handleTextAreaChangeComment: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  comment: string;
  commentId: number;
  isUpdate: boolean;
}

export interface CommentState {
}
