import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();
const sslEnabled = configService.get<string>('DATABASE_SSL') === 'true';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [__dirname + '/common/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/common/migrations/*{.ts,.js}'],
  synchronize: false,
  ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

// cái này dùng để chạy migration
