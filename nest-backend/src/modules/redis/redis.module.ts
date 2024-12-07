// redis imports
import { Module } from '@nestjs/common';
// import { RedisModule as NestRedisModule } from 'nestjs-redis';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';

// configurations
import { Configuration } from 'src/config/configuration';

@Module({
  imports: [
    NestRedisModule.forRoot({
      config: {
        url: Configuration.REDIS_URL, // You can use either URL or host/port
        // host: Configuration.REDIS_HOST, // Redis host from config
        // port: Configuration.REDIS_PORT, // Redis port from config
        // db: Configuration.REDIS_DB, // Redis DB index from config
        // password: Configuration.REDIS_PASSWORD, // Optional password for Redis
        // keyPrefix: Configuration.REDIS_PRIFIX, // Optional key prefix for Redis
      },
    }),
  ],
  exports: [NestRedisModule],
})
export class RedisModule {}
