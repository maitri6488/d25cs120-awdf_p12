const request = require('supertest');
const app = require('../server');

describe('Task Management API - CI/CD Pipeline Tests', () => {

  // Test 1 (Lab Manual Step 2): Check GET /tasks returns status 200
  test('GET /tasks returns status 200 and a list of tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  // Test 2 (Supplementary Requirement): Check POST /tasks creates a new task
  test('POST /tasks creates a new task and returns status 201', async () => {
    const newTask = {
      title: 'Automated CI Test Task',
      description: 'Triggered by GitHub Actions runner',
      priority: 'high',
      assignedUser: 'Maitri Sheta (D25CS120)'
    };

    const res = await request(app)
      .post('/tasks')
      .send(newTask);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.task).toHaveProperty('title', newTask.title);
  });

  // Test 3: Validation test - title missing returns 400 Bad Request
  test('POST /tasks returns 400 Bad Request if title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ description: 'No title given' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Task title is required');
  });

  // Test 4: Health diagnostic check
  test('GET /api/health returns status 200 with pipeline metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('pipeline', 'GitHub Actions');
  });

});
