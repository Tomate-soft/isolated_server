import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseKeyOrmEntity } from './entities/license-key.orm-entity';
import { TenantOrmEntity } from './entities/tenant.orm-entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url =
          configService.get<string>('POSTGRES_CONNECTION_STRING') ??
          configService.get<string>('POSTGRES_DATABASE_URL');

        if (!url) {
          throw new Error(
            'Missing POSTGRES_CONNECTION_STRING (or POSTGRES_DATABASE_URL) for Postgres connection.',
          );
        }

        return {
          type: 'postgres' as const,
          url,
          entities: [TenantOrmEntity, LicenseKeyOrmEntity],
          // Recomendación: manejar migraciones explícitas en vez de synchronize en prod.
          synchronize: false,
          logging: ['query', 'error'],
        };
      },
    }),
    TypeOrmModule.forFeature([TenantOrmEntity, LicenseKeyOrmEntity]),
  ],
  exports: [TypeOrmModule],
})
export class PostgresModule {}
