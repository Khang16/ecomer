import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from 'src/common/entities/province.entity';
import { District } from 'src/common/entities/district.entity';
import { Ward } from 'src/common/entities/ward.entity';
import { SeedLocationCommand } from '../implements/seed-location.command';

@CommandHandler(SeedLocationCommand)
export class SeedLocationHandler implements ICommandHandler<SeedLocationCommand> {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
  ) {}

  async execute(command: SeedLocationCommand): Promise<any> {
    const response = await fetch('https://provinces.open-api.vn/api/?depth=3');
    const provincesData = await response.json();

    // console.log(`Starting seed: ${provincesData.length} provinces found.`);

    for (const pData of provincesData) {
      // 1. Save Province
      let province = await this.provinceRepository.findOne({
        where: { name: pData.name },
      });
      if (!province) {
        province = this.provinceRepository.create({ name: pData.name });
        province = await this.provinceRepository.save(province);
      }

      const districtsData = pData.districts || [];
      for (const dData of districtsData) {
        // 2. Save District
        let district = await this.districtRepository.findOne({
          where: { name: dData.name, province_id: province.id },
        });
        if (!district) {
          district = this.districtRepository.create({
            name: dData.name,
            province_id: province.id,
          });
          district = await this.districtRepository.save(district);
        }

        const wardsData = dData.wards || [];
        const wardEntities: Ward[] = [];

        for (const wData of wardsData) {
          // Check if ward already exists to avoid duplicates
          const exists = await this.wardRepository.findOne({
            where: {
              name: wData.name,
              district_id: district.id,
              province_id: province.id,
            },
          });

          if (!exists) {
            wardEntities.push(
              this.wardRepository.create({
                name: wData.name,
                district_id: district.id,
                province_id: province.id,
              }),
            );
          }
        }

        if (wardEntities.length > 0) {
          await this.wardRepository.save(wardEntities);
        }
      }
      console.log(`Finished seeding province: ${pData.name}`);
    }

    return { message: 'Seeding completed successfully' };
  }
}
