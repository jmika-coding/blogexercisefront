export interface StateCreatePost {
}

export interface Props {
  handleCancel: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleShowCRUDButtons: (event: React.MouseEvent<HTMLFormElement>) => void;

  isPostSelected: boolean;
  isActive: boolean;
  isUpdate: boolean;

  title: string;
  post: string;
  likes: number;
  postId: number;
}
