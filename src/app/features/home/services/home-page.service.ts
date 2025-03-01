import { Injectable } from '@angular/core';
import { IdeaAgeEnum } from '@app/shared/enums/idea-age.enum';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  public lastAge?: IdeaAgeEnum;
}
