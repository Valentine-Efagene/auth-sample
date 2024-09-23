
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto, SignInDto, SignUpDto } from './auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { StandardApiResponse } from '../common/common.dto';
import { ResponseMessage } from '../common/common.enum';
import { SerializeUser } from './decorator';
import { User } from '../user/user.entity';
import { SwaggerAuth } from '../common/guard/swagger-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IAuthTokensAndUser } from './auth.type';

@ApiTags('Auth')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Throttle({
        default: {
            limit: 3,
            ttl: 60000
        }
    })
    @Post('sign-in')
    async signIn(
        @Body() dto: SignInDto,
    ): Promise<StandardApiResponse<IAuthTokensAndUser>> {
        const response = await this.authService.signIn(dto);
        return new StandardApiResponse(HttpStatus.OK, ResponseMessage.AUTHENTICATED, response)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up')
    async signUp(@Body() dto: SignUpDto): Promise<StandardApiResponse<IAuthTokensAndUser>> {
        const response = await this.authService.signUp(dto);
        return new StandardApiResponse(HttpStatus.CREATED, ResponseMessage.CREATED, response)
    }

    @SwaggerAuth()
    @Post('refresh')
    async refreshToken(@SerializeUser() user: User, @Body() dto: RefreshTokenDto): Promise<StandardApiResponse<{ accessToken: string }>> {
        const tokens = await this.authService.refreshToken(user, dto)
        return new StandardApiResponse(HttpStatus.OK, ResponseMessage.CREATED, tokens);
    }
}
