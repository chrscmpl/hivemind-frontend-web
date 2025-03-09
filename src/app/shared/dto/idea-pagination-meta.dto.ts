export interface IdeaPaginationMetaDto {
  totalItems?: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages?: number;
  currentPage: number;
  sorting?: string;
  after?: string;
  includes?: string;
}
