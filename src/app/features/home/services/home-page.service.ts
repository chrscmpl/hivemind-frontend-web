import { Injectable } from '@angular/core';
import { IdeaAgeEnum } from '@app/shared/enums/idea-age.enum';
import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  public lastSort: IdeaSortEnum = IdeaSortEnum.CONTROVERSIAL;
  public lastAge: IdeaAgeEnum = IdeaAgeEnum.ONE_WEEK;

  public lastYPositions: Record<string, number> = {};
}
