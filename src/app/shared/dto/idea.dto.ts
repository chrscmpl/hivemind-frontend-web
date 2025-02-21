import { UserDto } from '@shared/dto/user.dto';

export interface IdeaDto {
  readonly id: number;
  readonly title?: string;
  readonly content?: string;
  readonly upvoteCount?: number;
  readonly downvoteCount?: number;
  readonly commentCount?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly user?: UserDto;
  readonly myVote?: 'up' | 'down';
}
