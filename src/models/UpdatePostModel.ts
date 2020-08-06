export interface StateUpdatePost {
  isActive: boolean;
  isDelete: boolean;
}

export interface PropsUpdate {
  isActive: boolean;
  handleShowOrHide: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleCancelUpdate: (event: React.MouseEvent<HTMLInputElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleShowCRUDButtons: (event: React.MouseEvent<HTMLFormElement>) => void;
  isDelete: boolean;
  isUpdate: boolean;
  isPostSelected: boolean;
  title: string;
  post: string;
  likes: number;
  postId: number;
}
