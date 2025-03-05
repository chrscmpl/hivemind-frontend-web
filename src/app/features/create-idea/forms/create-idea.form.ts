import { FormControl } from '@angular/forms';

export interface CreateIdeaForm {
  title: FormControl<string | null>;
  content: FormControl<string | null>;
}
