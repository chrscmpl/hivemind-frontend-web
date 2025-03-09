import { UserDto } from './user.dto';

export interface CommentDto {
  id: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: UserDto;
}
