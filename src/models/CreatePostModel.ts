export interface StateCreatePost {
  title: string;
  post: string;
}

export interface Props {
  isActive: boolean;
  handleCancel: (event: React.MouseEvent<HTMLInputElement>) => void;
  title: string;
  post: string;
}
