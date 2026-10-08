import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';

// Fresh in-memory database with the 25 seed students for every run
process.env.DATABASE_PATH = ':memory:';

const valid = {
  name: 'Test Student',
  email: 'test.student@example.com',
  phone: '9876543210',
  course: 'Data Science',
  status: 'Active',
  enrolledOn: '2026-01-15',
  feesPaid: 25000,
};

describe('Students API (e2e)', () => {
  let app: INestApplication<App>;
  const api = () => request(app.getHttpServer());

  beforeAll(async () => {
    // Imported after DATABASE_PATH is set
    const { AppModule } = await import('../src/app.module.js');
    const { configureApp } = await import('../src/common/configure-app.js');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /students', () => {
    it('returns the first page of 10 with the total', async () => {
      const res = await api().get('/api/v1/students').expect(200);
      expect(res.body.total).toBe(25);
      expect(res.body.items).toHaveLength(10);
      expect(res.body).toMatchObject({ page: 1, limit: 10 });
      expect(res.body.items[0].name).toBe('Aarav Sharma');
    });

    it('searches name and email, case-insensitive', async () => {
      const byName = await api().get('/api/v1/students?search=MEERA').expect(200);
      expect(byName.body.items.map((s: { name: string }) => s.name)).toEqual(['Meera Joshi']);
      const byEmail = await api().get('/api/v1/students?search=rohan.mehta@').expect(200);
      expect(byEmail.body.total).toBe(1);
    });

    it('filters by course and status', async () => {
      const res = await api().get('/api/v1/students?status=Graduated&course=Data%20Science').expect(200);
      expect(res.body.total).toBe(1);
      expect(res.body.items[0].name).toBe('Priya Venkatesh');
    });

    it('pages and sorts', async () => {
      const page3 = await api().get('/api/v1/students?page=3').expect(200);
      expect(page3.body.items).toHaveLength(5);
      const byFees = await api().get('/api/v1/students?sortBy=feesPaid&order=desc&limit=1').expect(200);
      expect(byFees.body.items[0].feesPaid).toBe(1250000);
    });

    it('rejects bad paging values', async () => {
      const res = await api().get('/api/v1/students?limit=500').expect(400);
      expect(res.body.errors.limit).toBeDefined();
    });
  });

  describe('create → read → update → delete', () => {
    let id: number;

    it('creates a student (201)', async () => {
      const res = await api().post('/api/v1/students').send(valid).expect(201);
      id = res.body.id;
      expect(res.body).toMatchObject(valid);
    });

    it('reads it back (200)', async () => {
      const res = await api().get(`/api/v1/students/${id}`).expect(200);
      expect(res.body.email).toBe(valid.email);
    });

    it('updates it (200)', async () => {
      const res = await api().patch(`/api/v1/students/${id}`).send({ status: 'Graduated', feesPaid: 30000 }).expect(200);
      expect(res.body).toMatchObject({ status: 'Graduated', feesPaid: 30000, name: valid.name });
    });

    it('deletes it (204), then 404', async () => {
      await api().delete(`/api/v1/students/${id}`).expect(204);
      const res = await api().get(`/api/v1/students/${id}`).expect(404);
      expect(res.body.message).toBe('Student not found. It may have been deleted.');
    });
  });

  describe('validation (400 with one message per field)', () => {
    it.each([
      ['name', { name: '' }, 'Name is required.'],
      ['name', { name: 'A' }, 'Name must be 2 to 50 characters.'],
      ['name', { name: 'x'.repeat(51) }, 'Name must be 2 to 50 characters.'],
      ['name', { name: 'Robert 123' }, "Name can only contain letters, spaces, dots (.), apostrophes (') and hyphens (-)."],
      ['email', { email: 'not-an-email' }, 'Enter a valid email address, like name@example.com.'],
      ['phone', { phone: '12345' }, 'Phone must be exactly 10 digits.'],
      ['course', { course: 'Cooking' }, 'Course must be one of: Full Stack Web, Data Science, UI/UX Design, Cloud & DevOps, Mobile Development.'],
      ['status', { status: 'Paused' }, 'Status must be one of: Active, Inactive, Graduated.'],
      ['enrolledOn', { enrolledOn: '2099-01-01' }, 'Enrolled on must be a valid date that is not in the future.'],
      ['enrolledOn', { enrolledOn: '2026-02-30' }, 'Enrolled on must be a valid date that is not in the future.'],
      ['course', { course: '' }, 'Course is required.'],
      ['status', { status: undefined }, 'Status is required.'],
      ['enrolledOn', { enrolledOn: '' }, 'Enrolled on is required.'],
      ['feesPaid', { feesPaid: null }, 'Fees paid is required.'],
      ['feesPaid', { feesPaid: -1 }, 'Fees paid cannot be negative.'],
      ['feesPaid', { feesPaid: 10.5 }, 'Fees paid must be a whole number.'],
      ['feesPaid', { feesPaid: 10_000_001 }, 'Fees paid cannot be more than 10,000,000.'],
    ])('%s: %j → %s', async (field, override, message) => {
      const res = await api().post('/api/v1/students').send({ ...valid, ...override }).expect(400);
      expect(res.body.message).toBe('Please fix the highlighted fields.');
      expect(res.body.errors[field]).toBe(message);
    });

    it('accepts an empty phone as "no phone"', async () => {
      const res = await api()
        .post('/api/v1/students')
        .send({ ...valid, email: 'no.phone@example.com', phone: '' })
        .expect(201);
      expect(res.body.phone).toBeNull();
    });

    it('rejects a duplicate email with 409 (any letter case)', async () => {
      const res = await api()
        .post('/api/v1/students')
        .send({ ...valid, email: 'AARAV.SHARMA@example.com' })
        .expect(409);
      expect(res.body.errors.email).toBe('A student with this email already exists.');
    });

    it('rejects unknown fields', async () => {
      await api().post('/api/v1/students').send({ ...valid, email: 'x.y@example.com', role: 'admin' }).expect(400);
    });
  });
});
