export class GetProvincesQuery {}

export class GetDistrictsQuery {
  constructor(public readonly provinceId: number) {}
}

export class GetWardsQuery {
  constructor(public readonly districtId: number) {}
}
