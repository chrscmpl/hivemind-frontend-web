import { UserEntity } from '@app/users/entities/user.entity';

export class IdeaEntity {
  private readonly id: number;
  private readonly title?: string;
  private readonly content?: string;
  private readonly upvoteCount?: number;
  private readonly downvoteCount?: number;
  private readonly commentCount?: number;
  private readonly createdAt?: string;
  private readonly updatedAt?: string;
  private readonly user?: UserEntity;
  private readonly myVote?: boolean;

  public constructor(data: Partial<IdeaEntity> & { id: number }) {
    this.id = data.id;
    Object.assign(this, data);
  }
}
