// nestjs import
import { Module, Global } from '@nestjs/common';

// redis
import { createClient } from 'redis';

// configurations
import { Configuration } from 'src/config/configuration';

const redisClient = createClient({ url: Configuration.REDIS_URL });

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect();

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: redisClient,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
