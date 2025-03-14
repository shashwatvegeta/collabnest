import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserType } from './user.schema';
import { Document, Model, Types } from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockObjectId = new Types.ObjectId('507f1f77bcf86cd799439011');

  // Create a proper mock Document implementation
  const mockMongooseDoc = {
    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
    $createModifiedPathsSnapshot: jest.fn(),
    $getAllSubdocs: jest.fn(),
    $getPopulatedDocs: jest.fn(),
    $ignore: jest.fn(),
    $inc: jest.fn(),
    $isDefault: jest.fn(),
    $isDeleted: jest.fn(),
    $isEmpty: jest.fn(),
    $isModified: jest.fn(),
    $isSelected: jest.fn(),
    $isValid: jest.fn(),
    $locals: {},
    $markValid: jest.fn(),
    $model: jest.fn(),
    $op: null,
    $parent: jest.fn(),
    $session: jest.fn(),
    $set: jest.fn(),
    $setIndex: jest.fn(),
    $unset: jest.fn(),
    $where: jest.fn(),
    collection: {},
    db: {},
    delete: jest.fn(),
    deleteOne: jest.fn(),
    depopulate: jest.fn(),
    directModifiedPaths: jest.fn(),
    equals: jest.fn(),
    errors: {},
    get: jest.fn(),
    getChanges: jest.fn(),
    increment: jest.fn(),
    init: jest.fn(),
    invalidate: jest.fn(),
    isDirectModified: jest.fn(),
    isDirectSelected: jest.fn(),
    isInit: jest.fn(),
    isModified: jest.fn(),
    isNew: false,
    isSelected: jest.fn(),
    markModified: jest.fn(),
    modifiedPaths: jest.fn(),
    overwrite: jest.fn(),
    populate: jest.fn(),
    populated: jest.fn(),
    remove: jest.fn(),
    replaceOne: jest.fn(),
    save: jest.fn(),
    schema: {},
    set: jest.fn(),
    toJSON: jest.fn(),
    toObject: jest.fn(),
    unmarkModified: jest.fn(),
    update: jest.fn(),
    updateOne: jest.fn(),
    validate: jest.fn(),
    validateSync: jest.fn(),
    $restoreModifiedPathsSnapshot: jest.fn(),
    model: ({} as unknown) as Model<unknown>,
    __v: 0
  };

  const mockUser = {
    _id: mockObjectId,
    username: 'testuser',
    password: 'password123',
    email: 'test@example.com',
    isVerified: false,
    roll_number: 'R123',
    notifications: [],
    projects: [],
    user_type: UserType.STUDENT,
    student_skills: [],
    certificates: [],
    project_application: [],
    rating: 0,
    achievements: [],
    ...mockMongooseDoc
  } as unknown as Document<unknown, {}, User> & User & Required<{ _id: Types.ObjectId }> & { __v: number };

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        roll_number: 'R123',
        user_type: UserType.STUDENT,
        student_skills: [],
        certificates: [],
        project_application: [],
        achievements: [],
        isVerified: false,
        notifications: [],
        projects: [],
        rating: 0
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne(mockObjectId.toString());
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockObjectId.toString());
    });

    it('should return null for non-existent user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await controller.findOne('non-existent-id');
      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
      };

      const updatedUser = {
        ...mockUser,
        username: updateUserDto.username
      } as Document<unknown, {}, User> & User & Required<{ _id: Types.ObjectId }> & { __v: number };

      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(mockObjectId.toString(), updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(mockObjectId.toString(), updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockUser);

      const result = await controller.remove(mockObjectId.toString());
      expect(result).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith(mockObjectId.toString());
    });

    it('should return null when trying to remove non-existent user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(null);

      const result = await controller.remove('non-existent-id');
      expect(result).toBeNull();
      expect(service.remove).toHaveBeenCalledWith('non-existent-id');
    });
  });
});