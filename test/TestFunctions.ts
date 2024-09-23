import * as request from 'supertest';
import { CreateUserDto } from "src/user/user.dto";
import DataEntry from "../src/common/helpers/DataEntryHelper";
import { UserService } from '../src/user/user.service';
import { HttpStatus, INestApplication } from "@nestjs/common";
import { ResponseMessage } from '../src/common/common.enum';
import { SignUpDto } from '../src/auth/auth.dto';

export default class TestFunctions {
    public static async createUserWithService(userService: UserService) {
        const createUserDto = DataEntry.buildCreateUserDto()
        const user = await userService.create(createUserDto)

        expect(user).toBeDefined();
        expect(user.firstName).toEqual(createUserDto.firstName);
    }

    public static async createUser(app: INestApplication<any>) {

        const createDto: CreateUserDto = DataEntry.buildCreateUserDto()

        await request(app.getHttpServer())
            .post('/users')
            .send(createDto)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                expect(res.body).toHaveProperty('data');
                expect(res.body.message).toBe(ResponseMessage.CREATED)
                expect(res.body.statusCode).toBe(HttpStatus.CREATED);
            });
    }

    public static async signUp(app: INestApplication<any>) {
        let token: string
        const dto: SignUpDto = DataEntry.signUpDto

        await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(dto)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                expect(res.body).toHaveProperty('data');
                token = res.body.data.accessToken
                expect(res.body.message).toBe(ResponseMessage.CREATED)
                expect(res.body.statusCode).toBe(HttpStatus.CREATED);
            });

        return token
    }
}