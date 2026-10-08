import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { ListStudentsQueryDto } from './dto/list-students-query.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { Student } from './student.entity.js';
import { SEED_STUDENTS } from './students.seed.js';

export interface StudentListResponse {
  items: Student[];
  total: number;
  page: number;
  limit: number;
}

const DUPLICATE_EMAIL = 'A student with this email already exists.';

@Injectable()
export class StudentsService implements OnModuleInit {
  constructor(@InjectRepository(Student) private readonly students: Repository<Student>) {}

  /** Fill an empty database with demo students (Render's free disk is wiped on every redeploy). */
  async onModuleInit(): Promise<void> {
    if (process.env.SEED_ON_START === 'false') return;
    if ((await this.students.count()) === 0) await this.seed();
  }

  async seed(): Promise<void> {
    // Insert in reverse so the first seed row gets the newest createdAt/id (shown first by default)
    for (const student of [...SEED_STUDENTS].reverse()) {
      await this.students.save(this.students.create(student));
    }
  }

  async findAll(query: ListStudentsQueryDto): Promise<StudentListResponse> {
    const qb = this.students.createQueryBuilder('s');

    if (query.search) {
      const term = `%${query.search.toLowerCase()}%`;
      qb.andWhere(
        new Brackets((where) => {
          where.where('LOWER(s.name) LIKE :term', { term }).orWhere('LOWER(s.email) LIKE :term', { term });
        }),
      );
    }
    if (query.course) qb.andWhere('s.course = :course', { course: query.course });
    if (query.status) qb.andWhere('s.status = :status', { status: query.status });

    const order = query.order === 'asc' ? 'ASC' : 'DESC';
    qb.orderBy(`s.${query.sortBy}`, order).addOrderBy('s.id', order);

    const [items, total] = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return { items, total, page: query.page, limit: query.limit };
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.students.findOneBy({ id });
    if (!student) throw new NotFoundException('Student not found. It may have been deleted.');
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    await this.assertEmailFree(dto.email);
    const { name, email, phone, course, status, enrolledOn, feesPaid } = dto;
    return this.students.save(
      this.students.create({ name, email, phone: phone ?? null, course, status, enrolledOn, feesPaid }),
    );
  }

  async update(id: number, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    if (dto.email && dto.email !== student.email) await this.assertEmailFree(dto.email);
    Object.assign(student, dto);
    return this.students.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.students.remove(student);
  }

  private async assertEmailFree(email: string): Promise<void> {
    if (await this.students.existsBy({ email })) {
      throw new ConflictException({ statusCode: 409, message: DUPLICATE_EMAIL, errors: { email: DUPLICATE_EMAIL } });
    }
  }
}
