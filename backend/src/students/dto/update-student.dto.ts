import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto.js';

// PATCH: every field optional, same rules when present
export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
