
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RefreshTokenDto, SignInDto, SignUpDto } from './auth.dto';
import { User } from '../user/user.entity';
import { IAccessTokenPayload, IAuthTokensAndUser, IJwtConfig } from './auth.type';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';
import { accessTokenConfig, refreshTokenConfig } from './auth.constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
    ) { }

    async validateUser(identifier: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.userService.findOneByEmail(identifier);

        if (!user) {
            return null
        }

        const match = await bcrypt.compare(password, user.password)

        if (match) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async signUp(user: SignUpDto): Promise<IAuthTokensAndUser> {
        const existingUser = await this.userService.findOneByEmail(user.email);

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUserDto = { ...user, password: hashedPassword };
        const newUser = await this.userService.create(newUserDto);

        return this.signIn({
            identifier: newUser.email,
            password: user.password
        });
    }

    async generateJWT(payload: IAccessTokenPayload, config: IJwtConfig) {
        return this.jwtService.sign(payload, {
            secret: config.secret,
            expiresIn: config.expiresIn,
        });
    }

    async refreshToken(
        user: User,
        dto: RefreshTokenDto,
    ): Promise<{ accessToken: string }> {
        const refreshToken = await this.refreshTokenService.findOneByToken(dto.refreshToken);

        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        const payload: IAccessTokenPayload = {
            sub: user.id,
            identifier: user.email,
        };

        const accessToken = await this.generateJWT(payload, accessTokenConfig());
        await this.refreshTokenService.replaceToken({
            token: accessToken,
            userId: user.id
        })

        return {
            accessToken,
        };
    }

    async signIn(dto: SignInDto): Promise<IAuthTokensAndUser> {
        const user = await this.validateUser(dto.identifier, dto.password)

        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }

        const payload: IAccessTokenPayload = {
            sub: user.id,
            identifier: user.email,
        };

        const accessToken = await this.generateJWT(payload, accessTokenConfig());
        const refreshToken = await this.generateJWT(payload, refreshTokenConfig());

        const doc = await this.refreshTokenService.findOneByUserId(user.id)

        if (doc) {
            await this.refreshTokenService.replaceToken({ token: refreshToken, userId: user.id });

            return {
                accessToken,
                refreshToken,
                user
            };
        }

        await this.refreshTokenService.create({
            userId: user.id,
            token: refreshToken,
        });

        return {
            accessToken,
            refreshToken,
            user
        };
    }
}
