import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from "class-validator";

export class SignInDto {
    @ApiProperty({
        example: 'test@tester.com',
    })
    @IsNotEmpty()
    @MaxLength(50)
    identifier: string;

    @ApiProperty({
        example: "Pa$Sw0rd",
    })
    @IsNotEmpty()
    @MaxLength(50)
    // @IsStrongPassword()
    password: string;
}

export class SignUpDto {
    @ApiProperty({
        example: 'Jane',
    })
    @IsNotEmpty()
    @MaxLength(50)
    firstName: string;

    @ApiProperty({
        example: 'Doe',
    })
    @IsNotEmpty()
    @MaxLength(50)
    lastName: string;

    @ApiProperty({
        example: 'test@tester.com',
    })
    @IsNotEmpty()
    @MaxLength(50)
    email: string;

    @ApiProperty({
        example: "Pa$Sw0rd",
    })
    @IsNotEmpty()
    @MaxLength(50)
    // @IsStrongPassword()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlkZW50aWZpZXIiOiJ0ZXN0QHRlc3Rlci5jb20iLCJpYXQiOjE3MjA2MTg2MDAsImV4cCI6MTcyNTgwMjYwMH0.DAQIdm3NZqU_I88Uu4MubwedzApzIHSghRCm2pG_Lek'
    })
    @IsString()
    @IsNotEmpty()
    @IsJWT()
    refreshToken: string;
}