import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './students/student.entity.js';
import { StudentsModule } from './students/students.module.js';

// SQLite file. ":memory:" in tests. On Render the free disk is reset on redeploy; the seed refills it.
const databasePath = process.env.DATABASE_PATH ?? 'data/students.sqlite';
if (databasePath !== ':memory:') mkdirSync(dirname(databasePath), { recursive: true });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: databasePath,
      entities: [Student],
      synchronize: true, // creates the table from the entity (fine for a demo; use migrations in real projects)
    }),
    StudentsModule,
  ],
})
export class AppModule {}
