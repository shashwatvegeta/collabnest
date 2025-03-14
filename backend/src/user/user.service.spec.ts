import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserType } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = {
    _id: 'some-user-id',
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
    achievements: []
  };

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      jest.spyOn(mockUserModel, 'save').mockResolvedValueOnce(mockUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      jest.spyOn(mockUserModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(mockUserModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await service.findOne('some-user-id');
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      jest.spyOn(mockUserModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.findOne('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedUser),
      } as any);

      const result = await service.update('some-user-id', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(mockUserModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await service.remove('some-user-id');
      expect(result).toEqual(mockUser);
    });

    it('should return null when trying to remove non-existent user', async () => {
      jest.spyOn(mockUserModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.remove('non-existent-id');
      expect(result).toBeNull();
    });
  });
});