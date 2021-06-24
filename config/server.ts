import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
export const port = 8080;

export const jdbc: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Akon0076wagy',
  database: 'CRUD',
  synchronize: false, // 是否同步实体 为ture时会使用entities创建表
  keepConnectionAlive: true, // 是否保持连接状态，如果为false，热更新会导致AlreadyHasActiveConnectionError
};

export const dbUrl = {
  development: `mysql://${jdbc.host}:${jdbc.port}/${jdbc.database}?user=${jdbc.username}&password=${jdbc.password}`,
  production: `mysql://${jdbc.host}:${jdbc.port}/${jdbc.database}?user=${jdbc.username}&password=${jdbc.password}`,
};
