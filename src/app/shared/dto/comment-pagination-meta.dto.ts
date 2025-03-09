export interface CommentPaginationMetaDto {
  totalItems?: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages?: number;
  currentPage: number;
  after?: string;
  includes?: string;
}
