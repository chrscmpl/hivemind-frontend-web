import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';

export interface FeedDescriptorEntity {
  sort: IdeaSortEnum;
  fetch?: boolean;
}
