export class GetListUserAddressQuery {
  constructor(
    public readonly id?: number,
    public readonly name?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
