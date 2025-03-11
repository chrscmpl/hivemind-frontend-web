import { InjectionToken } from '@angular/core';
import { TuiEditorToolType } from '@taiga-ui/editor';

export const COMMENT_EDITOR_TOOLS = new InjectionToken<TuiEditorToolType[]>(
  'COMMENT_EDITOR_TOOLS',
  {
    providedIn: 'root',
    factory: () => [
      'undo',
      'bold',
      'italic',
      'clear',
      'code',
      'link',
      'list',
      'strikeThrough',
      'superscript',
      'subscript',
      'quote',
    ],
  },
);
