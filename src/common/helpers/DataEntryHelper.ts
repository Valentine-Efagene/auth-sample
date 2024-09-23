import { faker } from '@faker-js/faker';
import { CreateUserDto, UpdateUserDto } from "../../user/user.dto";
import { SignUpDto } from '../../auth/auth.dto';

export default class DataEntryHelper {
    public static createUserDto: CreateUserDto = {
        firstName: "Jane",
        lastName: "Doe",
        email: 'janedoe@testmail.com',
        password: 'password'
    };

    public static signUpDto: SignUpDto = {
        firstName: "Jane",
        lastName: "Doe",
        email: 'janedoe@testmail.com',
        password: 'password'
    };

    public static updateUserDto: UpdateUserDto = {
        lastName: "Doe",
    };

    public static buildCreateUserDto: () => CreateUserDto = () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        const data: CreateUserDto = {
            firstName,
            lastName,
            email: `${firstName}${lastName}@testmail.com`,
            password: 'password'
        }

        return data
    };
}