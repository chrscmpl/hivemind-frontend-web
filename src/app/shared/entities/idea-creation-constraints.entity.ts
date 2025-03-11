export interface IdeaCreationConstraintsEntity {
  title: { minLength: number; maxLength: number };
  content: { maxLength: number };
}
