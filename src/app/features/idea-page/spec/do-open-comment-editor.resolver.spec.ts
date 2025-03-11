import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { doOpenCommentEditorResolver } from '../resolvers/do-open-comment-editor.resolver';

describe('doOpenCommentEditorResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      doOpenCommentEditorResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
