import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { StudentCourse, StudentStatus } from './student.constants.js';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 30 })
  course: StudentCourse;

  @Column({ type: 'varchar', length: 20 })
  status: StudentStatus;

  /** ISO date, YYYY-MM-DD */
  @Column({ type: 'varchar', length: 10 })
  enrolledOn: string;

  /** Whole rupees */
  @Column({ type: 'integer' })
  feesPaid: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
