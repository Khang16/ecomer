export type ResponsePaginationType<Entity> = {
  data: Entity[];
  total: number;
  limit: number;
  page: number;
  totalPage: number;
};
