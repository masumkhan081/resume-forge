import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: vi.fn().mockResolvedValue({ get: vi.fn() }),
}));

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

vi.mock('@/lib/mongodb', () => ({
  connectMongo: vi.fn().mockResolvedValue(null),
}));

const authMock = vi.fn();
vi.mock('@/auth', () => ({
  auth: () => authMock(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const resumeFind = vi.fn();
const resumeFindById = vi.fn();
const resumeFindByIdAndUpdate = vi.fn();
const resumeCountDocuments = vi.fn();
const resumeCreate = vi.fn();
const resumeUpdateOne = vi.fn();
const resumeDeleteOne = vi.fn();

vi.mock('@/lib/models/resume', () => ({
  Resume: {
    find: (...args: unknown[]) => resumeFind(...args),
    findById: (...args: unknown[]) => resumeFindById(...args),
    findByIdAndUpdate: (...args: unknown[]) => resumeFindByIdAndUpdate(...args),
    countDocuments: (...args: unknown[]) => resumeCountDocuments(...args),
    create: (...args: unknown[]) => resumeCreate(...args),
    updateOne: (...args: unknown[]) => resumeUpdateOne(...args),
    deleteOne: (...args: unknown[]) => resumeDeleteOne(...args),
  },
}));

vi.mock('mongoose', () => {
  class ObjectId {
    public value: string;
    constructor(value: string) {
      this.value = value;
    }
    toString() {
      return this.value;
    }
    static isValid(value: unknown) {
      return typeof value === 'string' && value.length > 0;
    }
  }
  return {
    default: { Types: { ObjectId } },
    Types: { ObjectId },
    Schema: class MockSchema {
      static Types = { ObjectId: 'ObjectId', Mixed: 'Mixed' };
      index() {
        return this;
      }
    },
    model: vi.fn(),
    models: {},
  };
});

import {
  autosaveResumeAction,
  createResumeAction,
  deleteResumeAction,
  getResumeAction,
  listResumesAction,
  renameResumeAction,
} from '@/lib/actions/resume-actions';
import { sampleResume } from '@/lib/data/default-resume';

const SESSION_USER = { user: { id: 'user-1', email: 'a@example.com', name: 'A' } };

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

function chainable<T>(value: T) {
  const builder = {
    sort: () => builder,
    skip: () => builder,
    limit: () => builder,
    select: () => builder,
    lean: () => Promise.resolve(value),
    session: () => Promise.resolve(value),
  };
  return builder;
}

describe('listResumesAction', () => {
  it('returns UNAUTHORIZED without session', async () => {
    authMock.mockResolvedValueOnce(null);
    const result = await listResumesAction();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNAUTHORIZED');
  });

  it('returns paginated items for the current user', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeFind.mockReturnValue(
      chainable([
        {
          _id: { toString: () => 'r1' },
          name: 'A',
          template: 'classic-teal',
          updatedAt: new Date(),
        },
        {
          _id: { toString: () => 'r2' },
          name: 'B',
          template: 'minimal-mono',
          updatedAt: new Date(),
        },
      ]),
    );
    resumeCountDocuments.mockResolvedValue(2);

    const result = await listResumesAction();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.items).toHaveLength(2);
      expect(result.data.total).toBe(2);
      expect(result.data.hasMore).toBe(false);
    }
  });
});

describe('getResumeAction', () => {
  it('returns NOT_FOUND when the resume id is malformed', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    const result = await getResumeAction('');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('NOT_FOUND');
  });

  it('returns NOT_FOUND when the resume belongs to a different user (ownership)', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeFindById.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: { toString: () => 'r1' },
          userId: { toString: () => 'someone-else' },
          name: 'X',
          template: 'classic-teal',
          data: sampleResume,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    });
    const result = await getResumeAction('valid-id');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('NOT_FOUND');
  });

  it('returns the resume for the owner', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeFindById.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: { toString: () => 'r1' },
          userId: { toString: () => 'user-1' },
          name: 'Mine',
          template: 'classic-teal',
          data: sampleResume,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    });
    const result = await getResumeAction('valid-id');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.name).toBe('Mine');
  });
});

describe('createResumeAction', () => {
  it('returns UNAUTHORIZED without session', async () => {
    authMock.mockResolvedValueOnce(null);
    const result = await createResumeAction({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNAUTHORIZED');
  });

  it('creates with default name + template when no input given', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeCreate.mockResolvedValue({ _id: { toString: () => 'r-new' } });
    const result = await createResumeAction({});
    expect(result.ok).toBe(true);
    expect(resumeCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Untitled resume',
        template: 'classic-teal',
      }),
    );
  });
});

describe('autosaveResumeAction', () => {
  it('returns UNAUTHORIZED without session', async () => {
    authMock.mockResolvedValueOnce(null);
    const result = await autosaveResumeAction({
      id: 'valid',
      data: sampleResume,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects malformed input (empty id)', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    const result = await autosaveResumeAction({
      id: '',
      data: sampleResume,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('INVALID_INPUT');
  });

  it('rejects when the resume belongs to a different user (ownership)', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeFindById.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: { toString: () => 'r1' },
          userId: { toString: () => 'someone-else' },
          name: 'X',
          template: 'classic-teal',
          data: sampleResume,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    });
    const result = await autosaveResumeAction({
      id: 'valid-id',
      data: sampleResume,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('NOT_FOUND');
  });

  it('persists data + template for the owner', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeFindById.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: { toString: () => 'r1' },
          userId: { toString: () => 'user-1' },
          name: 'Mine',
          template: 'classic-teal',
          data: sampleResume,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    });
    resumeFindByIdAndUpdate.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: { toString: () => 'r1' },
          updatedAt: new Date(),
        }),
    });

    const result = await autosaveResumeAction({
      id: 'valid-id',
      data: sampleResume,
      template: 'minimal-mono',
    });
    expect(result.ok).toBe(true);
    expect(resumeFindByIdAndUpdate).toHaveBeenCalledWith(
      'valid-id',
      expect.objectContaining({ template: 'minimal-mono' }),
      expect.any(Object),
    );
  });
});

describe('renameResumeAction + deleteResumeAction (ownership)', () => {
  it('renameResumeAction rejects other user\'s resume', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeFindById.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: { toString: () => 'r1' },
          userId: { toString: () => 'someone-else' },
          name: 'X',
          template: 'classic-teal',
          data: sampleResume,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    });
    const result = await renameResumeAction({ id: 'valid-id', name: 'New' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('NOT_FOUND');
  });

  it('deleteResumeAction rejects other user\'s resume', async () => {
    authMock.mockResolvedValue(SESSION_USER);
    resumeFindById.mockReturnValue({
      lean: () =>
        Promise.resolve({
          _id: { toString: () => 'r1' },
          userId: { toString: () => 'someone-else' },
          name: 'X',
          template: 'classic-teal',
          data: sampleResume,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    });
    const result = await deleteResumeAction({ id: 'valid-id' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('NOT_FOUND');
  });
});

