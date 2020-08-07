export interface StateCreatePost {
  title: string;
  post: string;
}

export interface Props {
  isActive: boolean;
  handleCancel: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  post: string;
}
