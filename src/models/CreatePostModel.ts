export interface StateCreatePost {
  isActive: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  title: string;
  post: string;
}

export interface Props {
  isActive: boolean;
  handleShowOrHide: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleCancel: (event: React.MouseEvent<HTMLInputElement>) => void;
  isDelete: boolean;
  title: string;
  post: string;
}
