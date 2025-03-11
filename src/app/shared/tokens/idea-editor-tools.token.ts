import { InjectionToken } from '@angular/core';
import { TuiEditorToolType } from '@taiga-ui/editor';

export const IDEA_EDITOR_TOOLS = new InjectionToken<TuiEditorToolType[]>(
  'IDEA_EDITOR_TOOLS',
  {
    providedIn: 'root',
    factory: () => [
      'undo',
      'bold',
      'italic',
      'anchor',
      'clear',
      'code',
      'link',
      'list',
      'strikeThrough',
      'superscript',
      'subscript',
      'quote',
      'insertHorizontalRule',
      'insertTable',
    ],
  },
);
