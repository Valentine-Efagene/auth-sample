import 'dotenv/config';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import TestFunctions from './TestFunctions';
import DataEntryHelper from '../src/common/helpers/DataEntryHelper';
import { UserService } from '../src/user/user.service';
import { CreatePermissionDto } from '../src/permission/permission.dto';
import { PermissionsEnum } from '../src/permission/permission.enums';
import { AssignPermissionsDto, CreateRoleDto } from '../src/role/role.dto';
import { AssignRolesDto } from '@/user/user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    // Override environment variables for the test database
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '3306';
    process.env.DB_USERNAME = 'root';
    process.env.DB_PASSWORD = '';
    process.env.DB_NAME = process.env.DB_NAME_TEST;
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404)
      .expect('{"message":"Cannot GET /","error":"Not Found","statusCode":404}');
  });

  it('/users (POST)', () => {
    return TestFunctions.signUp(app)
  });

  it('creates, updates and retrieves a user', async () => {
    const updateDto = DataEntryHelper.updateUserDto

    const accessToken = await TestFunctions.signUp(app)

    const permissionDto: CreatePermissionDto = {
      name: PermissionsEnum.CAN_LIST_USERS
    }

    await request(app.getHttpServer())
      .post('/permissions')
      .send(permissionDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.CREATED)
      .expect(res => {
        expect(res.body.data.name).toBe(permissionDto.name)
        expect(res.body.statusCode).toBe(HttpStatus.CREATED);
      })

    const roleDto: CreateRoleDto = {
      name: 'ADMIN'
    }

    await request(app.getHttpServer())
      .post('/roles')
      .send(roleDto)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.CREATED)
      .expect(res => {
        expect(res.body.data.name).toBe(roleDto.name)
        expect(res.body.statusCode).toBe(HttpStatus.CREATED);
      })

    const assignPermissionsDto: AssignPermissionsDto = {
      permissionIds: [1]
    }

    await request(app.getHttpServer())
      .put('/roles/1/assign-permissions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(assignPermissionsDto)
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.data.name).toBe(roleDto.name)
        expect(res.body.statusCode).toBe(HttpStatus.OK);
      })

    const roleAssignmentDto: AssignRolesDto = {
      roleIds: [1]
    }

    await request(app.getHttpServer())
      .put('/users/1/assign-roles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(roleAssignmentDto)
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.statusCode).toBe(HttpStatus.OK);
      })

    await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.data.length).toBe(1)
        expect(res.body.statusCode).toBe(HttpStatus.OK);
      })

    await request(app.getHttpServer())
      .get('/users/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.data.name).toBe(updateDto.firstName)
        expect(res.body.statusCode).toBe(HttpStatus.OK);
      })
  })
})
