import type { StudentCourse, StudentStatus } from './student.constants.js';

type SeedStudent = {
  name: string;
  email: string;
  phone: string | null;
  course: StudentCourse;
  status: StudentStatus;
  enrolledOn: string;
  feesPaid: number;
};

// 25 demo students, inserted when the database is empty (first start, or after a redeploy on Render).
export const SEED_STUDENTS: SeedStudent[] = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '9820012345', course: 'Full Stack Web', status: 'Active', enrolledOn: '2026-08-12', feesPaid: 45000 },
  { name: 'Diya Kulkarni', email: 'diya.kulkarni@example.com', phone: '9820012346', course: 'Data Science', status: 'Active', enrolledOn: '2026-07-28', feesPaid: 62500 },
  { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', phone: null, course: 'UI/UX Design', status: 'Graduated', enrolledOn: '2026-01-09', feesPaid: 38000 },
  { name: 'Ananya Iyer', email: 'ananya.iyer@example.com', phone: '9820012348', course: 'Cloud & DevOps', status: 'Active', enrolledOn: '2026-09-02', feesPaid: 54000 },
  { name: 'Kabir Singh', email: 'kabir.singh@example.com', phone: '9820012349', course: 'Mobile Development', status: 'Inactive', enrolledOn: '2026-03-15', feesPaid: 12000 },
  { name: 'Meera Joshi', email: 'meera.joshi@example.com', phone: null, course: 'Data Science', status: 'Active', enrolledOn: '2026-08-30', feesPaid: 62500 },
  { name: 'Vihaan Reddy', email: 'vihaan.reddy@example.com', phone: '9820012351', course: 'Full Stack Web', status: 'Graduated', enrolledOn: '2025-12-04', feesPaid: 105000 },
  { name: 'Isha Deshpande', email: 'isha.deshpande@example.com', phone: '9820012352', course: 'UI/UX Design', status: 'Active', enrolledOn: '2026-09-18', feesPaid: 19000 },
  { name: 'Arjun Nair', email: 'arjun.nair@example.com', phone: null, course: 'Cloud & DevOps', status: 'Inactive', enrolledOn: '2026-02-21', feesPaid: 0 },
  { name: 'Sara Thomas', email: 'sara.thomas@example.com', phone: '9820012354', course: 'Mobile Development', status: 'Active', enrolledOn: '2026-09-25', feesPaid: 27500 },
  { name: 'Nikhil Bhosale', email: 'nikhil.bhosale@example.com', phone: '9820012355', course: 'Full Stack Web', status: 'Active', enrolledOn: '2026-06-11', feesPaid: 90000 },
  { name: 'Priya Venkatesh', email: 'priya.venkatesh@example.com', phone: null, course: 'Data Science', status: 'Graduated', enrolledOn: '2025-11-20', feesPaid: 125000 },
  { name: 'Siddharth Rao', email: 'siddharth.rao@example.com', phone: '9820012357', course: 'Cloud & DevOps', status: 'Active', enrolledOn: '2026-05-06', feesPaid: 48000 },
  { name: 'Tanvi Patwardhan', email: 'tanvi.patwardhan@example.com', phone: '9820012358', course: 'UI/UX Design', status: 'Inactive', enrolledOn: '2026-04-17', feesPaid: 8500 },
  { name: 'Yash Agarwal', email: 'yash.agarwal@example.com', phone: null, course: 'Mobile Development', status: 'Active', enrolledOn: '2026-07-03', feesPaid: 33000 },
  { name: 'Kavya Menon', email: 'kavya.menon@example.com', phone: '9820012360', course: 'Full Stack Web', status: 'Active', enrolledOn: '2026-09-29', feesPaid: 15000 },
  { name: 'Aditya Chavan', email: 'aditya.chavan@example.com', phone: '9820012361', course: 'Data Science', status: 'Inactive', enrolledOn: '2026-01-27', feesPaid: 20000 },
  { name: 'Riya Kapoor', email: 'riya.kapoor@example.com', phone: null, course: 'Cloud & DevOps', status: 'Graduated', enrolledOn: '2025-10-14', feesPaid: 72000 },
  { name: 'Harsh Pandey', email: 'harsh.pandey@example.com', phone: '9820012363', course: 'Mobile Development', status: 'Active', enrolledOn: '2026-08-08', feesPaid: 41000 },
  { name: 'Neha Gokhale', email: 'neha.gokhale@example.com', phone: '9820012364', course: 'UI/UX Design', status: 'Active', enrolledOn: '2026-06-22', feesPaid: 36000 },
  { name: 'Omkar Shinde', email: 'omkar.shinde@example.com', phone: null, course: 'Full Stack Web', status: 'Inactive', enrolledOn: '2026-02-02', feesPaid: 5000 },
  { name: 'Pooja Hegde', email: 'pooja.hegde@example.com', phone: '9820012366', course: 'Data Science', status: 'Active', enrolledOn: '2026-09-10', feesPaid: 31250 },
  { name: 'Rahul Banerjee', email: 'rahul.banerjee@example.com', phone: '9820012367', course: 'Cloud & DevOps', status: 'Active', enrolledOn: '2026-07-19', feesPaid: 54000 },
  { name: 'Sneha Pillai', email: 'sneha.pillai@example.com', phone: null, course: 'Mobile Development', status: 'Graduated', enrolledOn: '2025-09-30', feesPaid: 66000 },
  { name: 'Varun Malhotra-Krishnamurthy', email: 'varun.malhotra.krishnamurthy@example.com', phone: '9820012369', course: 'Full Stack Web', status: 'Active', enrolledOn: '2026-10-01', feesPaid: 1250000 },
];
