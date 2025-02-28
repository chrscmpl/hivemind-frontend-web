import { InjectionToken } from '@angular/core';
import { TuiEditorToolType } from '@taiga-ui/editor';

export const EDITOR_TOOLS = new InjectionToken<TuiEditorToolType[]>(
  'EDITOR_TOOLS',
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
    ],
  },
);
