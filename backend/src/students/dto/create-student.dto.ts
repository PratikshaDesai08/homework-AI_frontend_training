import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { STUDENT_COURSES, STUDENT_RULES, STUDENT_STATUSES, type StudentCourse, type StudentStatus } from '../student.constants.js';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

/** Real calendar date in YYYY-MM-DD, not in the future */
@ValidatorConstraint({ name: 'pastIsoDate' })
export class PastIsoDate implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    const isRealDate = date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
    const today = new Date().toISOString().slice(0, 10);
    return isRealDate && value <= today;
  }
  defaultMessage(): string {
    return 'Enrolled on must be a valid date that is not in the future.';
  }
}

export class CreateStudentDto {
  @ApiProperty({ example: 'Aarav Sharma', minLength: STUDENT_RULES.nameMin, maxLength: STUDENT_RULES.nameMax })
  @Transform(trim)
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @Length(STUDENT_RULES.nameMin, STUDENT_RULES.nameMax, {
    message: `Name must be ${STUDENT_RULES.nameMin} to ${STUDENT_RULES.nameMax} characters.`,
  })
  @Matches(/^[A-Za-z][A-Za-z .'-]*$/, {
    message: "Name can only contain letters, spaces, dots (.), apostrophes (') and hyphens (-).",
  })
  name: string;

  @ApiProperty({ example: 'aarav.sharma@example.com', maxLength: STUDENT_RULES.emailMax })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsNotEmpty({ message: 'Email is required.' })
  @MaxLength(STUDENT_RULES.emailMax, { message: `Email must be at most ${STUDENT_RULES.emailMax} characters.` })
  @IsEmail({}, { message: 'Enter a valid email address, like name@example.com.' })
  email: string;

  @ApiPropertyOptional({ example: '9820012345', nullable: true, description: 'Exactly 10 digits, or empty' })
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? null : typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @Matches(/^\d{10}$/, { message: `Phone must be exactly ${STUDENT_RULES.phoneLength} digits.` })
  phone?: string | null;

  @ApiProperty({ enum: STUDENT_COURSES })
  @IsIn(STUDENT_COURSES, { message: `Course must be one of: ${STUDENT_COURSES.join(', ')}.` })
  course: StudentCourse;

  @ApiProperty({ enum: STUDENT_STATUSES })
  @IsIn(STUDENT_STATUSES, { message: `Status must be one of: ${STUDENT_STATUSES.join(', ')}.` })
  status: StudentStatus;

  @ApiProperty({ example: '2026-08-12', description: 'YYYY-MM-DD, not in the future' })
  @IsNotEmpty({ message: 'Enrolled on is required.' })
  @Validate(PastIsoDate)
  enrolledOn: string;

  @ApiProperty({ example: 45000, minimum: 0, maximum: STUDENT_RULES.feesMax, description: 'Whole rupees' })
  @IsInt({ message: 'Fees paid must be a whole number.' })
  @Min(0, { message: 'Fees paid cannot be negative.' })
  @Max(STUDENT_RULES.feesMax, { message: 'Fees paid cannot be more than 10,000,000.' })
  feesPaid: number;
}
