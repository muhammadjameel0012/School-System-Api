/**
 * OpenAPI 3.0 specification for School Management System API.
 * Served at /api-docs when the application is running.
 */

const basePath = '/api/v1';

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'School Management System API',
    version: '1.0.0',
    description: 'API for managing school staff, students, academics, exams and results.',
  },
  // Use relative URL so "Try it out" always targets the same origin (avoids timeout from wrong host/port)
  servers: [
    { url: '/', description: 'Current server' },
  ],
  tags: [
    { name: 'Admins', description: 'Admin authentication and management' },
    { name: 'Teachers', description: 'Teacher authentication and management' },
    { name: 'Students', description: 'Student authentication and management' },
    { name: 'Academic Years', description: 'Academic year CRUD' },
    { name: 'Academic Terms', description: 'Academic term CRUD' },
    { name: 'Class Levels', description: 'Class level CRUD' },
    { name: 'Programs', description: 'Program CRUD' },
    { name: 'Subjects', description: 'Subject CRUD' },
    { name: 'Year Groups', description: 'Year group CRUD' },
    { name: 'Exams', description: 'Exam management' },
    { name: 'Questions', description: 'Exam questions' },
    { name: 'Exam Results', description: 'Exam results and publishing' },
  ],
  paths: {
    // ==================== ADMINS ====================
    [`${basePath}/admins/signup`]: {
      post: {
        tags: ['Admins'],
        summary: 'Register admin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'passwordConfirm'],
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  passwordConfirm: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Admin created' }, 400: { description: 'Validation error' } },
      },
    },
    [`${basePath}/admins/login`]: {
      post: {
        tags: ['Admins'],
        summary: 'Admin login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login success' }, 401: { description: 'Invalid credentials' } },
      },
    },
    [`${basePath}/admins`]: {
      get: {
        tags: ['Admins'],
        summary: 'Get all admins',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of admins' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/admins/updateAdmin`]: {
      patch: {
        tags: ['Admins'],
        summary: 'Update current admin profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/admins/updateMyPassword`]: {
      patch: {
        tags: ['Admins'],
        summary: 'Update current admin password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'passwordConfirm'],
                properties: {
                  password: { type: 'string', minLength: 6 },
                  passwordConfirm: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Password updated' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/admins/{id}`]: {
      get: {
        tags: ['Admins'],
        summary: 'Get admin by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Admin details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },

    // ==================== TEACHERS ====================
    [`${basePath}/teachers/login`]: {
      post: {
        tags: ['Teachers'],
        summary: 'Teacher login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login success' }, 401: { description: 'Invalid credentials' } },
      },
    },
    [`${basePath}/teachers/signup-teacher`]: {
      post: {
        tags: ['Teachers'],
        summary: 'Register teacher (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  dateEmployed: { type: 'string', format: 'date-time' },
                  teacherId: { type: 'string' },
                  subject: { type: 'string' },
                  program: { type: 'string' },
                  classLevel: { type: 'string' },
                  academicYear: { type: 'string' },
                  academicTerm: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Teacher created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/teachers`]: {
      get: {
        tags: ['Teachers'],
        summary: 'Get all teachers (admin only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of teachers' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/teachers/profile`]: {
      get: {
        tags: ['Teachers'],
        summary: 'Get current teacher profile',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Teacher profile' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/teachers/updateMyPassword`]: {
      patch: {
        tags: ['Teachers'],
        summary: 'Update current teacher password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'passwordConfirm'],
                properties: {
                  password: { type: 'string', minLength: 6 },
                  passwordConfirm: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Password updated' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/teachers/{teacherId}`]: {
      get: {
        tags: ['Teachers'],
        summary: 'Get teacher by ID (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'teacherId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Teacher details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },
    [`${basePath}/teachers/{teacherId}/update`]: {
      patch: {
        tags: ['Teachers'],
        summary: 'Update current teacher profile (teacher only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'teacherId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/teachers/{teacherId}/update/admin`]: {
      patch: {
        tags: ['Teachers'],
        summary: 'Update teacher (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'teacherId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  dateEmployed: { type: 'string', format: 'date-time' },
                  subject: { type: 'string' },
                  program: { type: 'string' },
                  classLevel: { type: 'string' },
                  academicYear: { type: 'string' },
                  academicTerm: { type: 'string' },
                  isWithdrawn: { type: 'boolean' },
                  isSuspended: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Teacher updated' }, 401: { description: 'Unauthorized' } },
      },
    },

    // ==================== STUDENTS ====================
    [`${basePath}/students/login`]: {
      post: {
        tags: ['Students'],
        summary: 'Student login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login success' }, 401: { description: 'Invalid credentials' } },
      },
    },
    [`${basePath}/students/signup-student`]: {
      post: {
        tags: ['Students'],
        summary: 'Register student (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'passwordConfirm'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  passwordConfirm: { type: 'string' },
                  studentId: { type: 'string' },
                  classLevels: { type: 'array', items: { type: 'string' } },
                  academicYear: { type: 'string' },
                  program: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Student created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/students`]: {
      get: {
        tags: ['Students'],
        summary: 'Get all students (admin only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of students' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/students/profile`]: {
      get: {
        tags: ['Students'],
        summary: 'Get current student profile',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Student profile' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/students/updateMyPassword`]: {
      patch: {
        tags: ['Students'],
        summary: 'Update current student password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'passwordConfirm'],
                properties: {
                  password: { type: 'string', minLength: 6 },
                  passwordConfirm: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Password updated' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/students/exam/{examId}/write`]: {
      post: {
        tags: ['Students'],
        summary: 'Submit exam answers (student only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'examId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'Answers keyed by question ID or array of answers',
              },
            },
          },
        },
        responses: { 200: { description: 'Exam submitted' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/students/{studentId}`]: {
      get: {
        tags: ['Students'],
        summary: 'Get student by ID (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Student details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },
    [`${basePath}/students/{studentId}/update`]: {
      patch: {
        tags: ['Students'],
        summary: 'Update current student profile (student only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/students/{studentId}/update/admin`]: {
      patch: {
        tags: ['Students'],
        summary: 'Update student (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'studentId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  classLevels: { type: 'array', items: { type: 'string' } },
                  academicYear: { type: 'string' },
                  program: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Student updated' }, 401: { description: 'Unauthorized' } },
      },
    },

    // ==================== ACADEMIC YEARS ====================
    [`${basePath}/academic-years`]: {
      get: {
        tags: ['Academic Years'],
        summary: 'Get all academic years',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of academic years' }, 401: { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Academic Years'],
        summary: 'Create academic year',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'fromYear', 'toYear', 'createdBy'],
                properties: {
                  name: { type: 'string' },
                  fromYear: { type: 'string', format: 'date-time' },
                  toYear: { type: 'string', format: 'date-time' },
                  isCurrent: { type: 'boolean' },
                  createdBy: { type: 'string' },
                  students: { type: 'array', items: { type: 'string' } },
                  teachers: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Academic year created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/academic-years/{id}`]: {
      get: {
        tags: ['Academic Years'],
        summary: 'Get academic year by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Academic year details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Academic Years'],
        summary: 'Update academic year',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Academic year updated' }, 401: { description: 'Unauthorized' } },
      },
      delete: {
        tags: ['Academic Years'],
        summary: 'Delete academic year',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Academic year deleted' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },

    // ==================== ACADEMIC TERMS ====================
    [`${basePath}/academic-terms`]: {
      get: {
        tags: ['Academic Terms'],
        summary: 'Get all academic terms',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of academic terms' }, 401: { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Academic Terms'],
        summary: 'Create academic term',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'createdBy'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  duration: { type: 'string' },
                  createdBy: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Academic term created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/academic-terms/{id}`]: {
      get: {
        tags: ['Academic Terms'],
        summary: 'Get academic term by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Academic term details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Academic Terms'],
        summary: 'Update academic term',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Academic term updated' }, 401: { description: 'Unauthorized' } },
      },
      delete: {
        tags: ['Academic Terms'],
        summary: 'Delete academic term',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Academic term deleted' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },

    // ==================== CLASS LEVELS ====================
    [`${basePath}/class-levels`]: {
      get: {
        tags: ['Class Levels'],
        summary: 'Get all class levels',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of class levels' }, 401: { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Class Levels'],
        summary: 'Create class level',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'createdBy'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  createdBy: { type: 'string' },
                  students: { type: 'array', items: { type: 'string' } },
                  subjects: { type: 'array', items: { type: 'string' } },
                  teachers: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Class level created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/class-levels/{id}`]: {
      get: {
        tags: ['Class Levels'],
        summary: 'Get class level by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Class level details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Class Levels'],
        summary: 'Update class level',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Class level updated' }, 401: { description: 'Unauthorized' } },
      },
      delete: {
        tags: ['Class Levels'],
        summary: 'Delete class level',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Class level deleted' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },

    // ==================== PROGRAMS ====================
    [`${basePath}/programs`]: {
      get: {
        tags: ['Programs'],
        summary: 'Get all programs',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of programs' }, 401: { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Programs'],
        summary: 'Create program',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'createdBy'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  duration: { type: 'string' },
                  code: { type: 'string' },
                  createdBy: { type: 'string' },
                  teachers: { type: 'array', items: { type: 'string' } },
                  students: { type: 'array', items: { type: 'string' } },
                  subjects: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Program created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/programs/{id}`]: {
      get: {
        tags: ['Programs'],
        summary: 'Get program by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Program details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Programs'],
        summary: 'Update program',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Program updated' }, 401: { description: 'Unauthorized' } },
      },
      delete: {
        tags: ['Programs'],
        summary: 'Delete program',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Program deleted' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },

    // ==================== SUBJECTS ====================
    [`${basePath}/subjects`]: {
      get: {
        tags: ['Subjects'],
        summary: 'Get all subjects',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of subjects' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/subjects/{programId}`]: {
      post: {
        tags: ['Subjects'],
        summary: 'Create subject for program',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'programId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'academicTerm', 'createdBy'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  teacher: { type: 'string' },
                  academicTerm: { type: 'string' },
                  createdBy: { type: 'string' },
                  duration: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Subject created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/subjects/{id}`]: {
      get: {
        tags: ['Subjects'],
        summary: 'Get subject by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Subject details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Subjects'],
        summary: 'Update subject',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Subject updated' }, 401: { description: 'Unauthorized' } },
      },
      delete: {
        tags: ['Subjects'],
        summary: 'Delete subject',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Subject deleted' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },

    // ==================== YEAR GROUPS ====================
    [`${basePath}/year-groups`]: {
      get: {
        tags: ['Year Groups'],
        summary: 'Get all year groups',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of year groups' }, 401: { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Year Groups'],
        summary: 'Create year group',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'createdBy', 'academicYear'],
                properties: {
                  name: { type: 'string' },
                  createdBy: { type: 'string' },
                  academicYear: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Year group created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/year-groups/{id}`]: {
      get: {
        tags: ['Year Groups'],
        summary: 'Get year group by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Year group details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Year Groups'],
        summary: 'Update year group',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Year group updated' }, 401: { description: 'Unauthorized' } },
      },
      delete: {
        tags: ['Year Groups'],
        summary: 'Delete year group',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Year group deleted' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },

    // ==================== EXAMS ====================
    [`${basePath}/exams`]: {
      get: {
        tags: ['Exams'],
        summary: 'Get all exams (teacher only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of exams' }, 401: { description: 'Unauthorized' } },
      },
      post: {
        tags: ['Exams'],
        summary: 'Create exam (teacher only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'subject', 'program', 'passMark', 'totalMark', 'academicTerm', 'duration', 'examDate', 'examTime', 'examType', 'examStatus', 'classLevel', 'createdBy', 'academicYear'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  subject: { type: 'string' },
                  program: { type: 'string' },
                  passMark: { type: 'number' },
                  totalMark: { type: 'number' },
                  academicTerm: { type: 'string' },
                  duration: { type: 'string' },
                  examDate: { type: 'string', format: 'date-time' },
                  examTime: { type: 'string' },
                  examType: { type: 'string' },
                  examStatus: { type: 'string', enum: ['pending', 'live'] },
                  classLevel: { type: 'string' },
                  academicYear: { type: 'string' },
                  createdBy: { type: 'string' },
                  questions: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Exam created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/exams/{id}`]: {
      get: {
        tags: ['Exams'],
        summary: 'Get exam by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Exam details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Exams'],
        summary: 'Update exam',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 3, maxLength: 50 },
                  description: { type: 'string' },
                  subject: { type: 'string' },
                  program: { type: 'string' },
                  academicTerm: { type: 'string' },
                  duration: { type: 'string' },
                  examDate: { type: 'string', format: 'date-time' },
                  examTime: { type: 'string' },
                  examType: { type: 'string' },
                  classLevel: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Exam updated' }, 401: { description: 'Unauthorized' } },
      },
    },

    // ==================== QUESTIONS ====================
    [`${basePath}/questions`]: {
      get: {
        tags: ['Questions'],
        summary: 'Get all questions (teacher only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of questions' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/questions/{examId}`]: {
      post: {
        tags: ['Questions'],
        summary: 'Create question for exam (teacher only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'examId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'createdBy'],
                properties: {
                  question: { type: 'string' },
                  optionA: { type: 'string' },
                  optionB: { type: 'string' },
                  optionC: { type: 'string' },
                  optionD: { type: 'string' },
                  correctAnswer: { type: 'string' },
                  isCorrect: { type: 'boolean' },
                  createdBy: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Question created' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/questions/{id}`]: {
      get: {
        tags: ['Questions'],
        summary: 'Get question by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Question details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Questions'],
        summary: 'Update question',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  question: { type: 'string', minLength: 3, maxLength: 500 },
                  optionA: { type: 'string' },
                  optionB: { type: 'string' },
                  optionC: { type: 'string' },
                  optionD: { type: 'string' },
                  correctAnswer: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Question updated' }, 401: { description: 'Unauthorized' } },
      },
    },

    // ==================== EXAM RESULTS ====================
    [`${basePath}/exam-results`]: {
      get: {
        tags: ['Exam Results'],
        summary: 'Get all exam results (student only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of exam results' }, 401: { description: 'Unauthorized' } },
      },
    },
    [`${basePath}/exam-results/{id}/checking`]: {
      get: {
        tags: ['Exam Results'],
        summary: 'Check exam result by ID (student only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Exam result details' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },
    [`${basePath}/exam-results/{id}/admin-toggle-publish`]: {
      patch: {
        tags: ['Exam Results'],
        summary: 'Toggle publish status of exam result (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Publish status toggled' }, 401: { description: 'Unauthorized' }, 404: { description: 'Not found' } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from login/signup response',
      },
    },
  },
};
