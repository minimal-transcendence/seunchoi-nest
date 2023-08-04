import { Body, Controller, Get, UseGuards, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, UseInterceptors, UploadedFile, ParseFilePipeBuilder, Res, StreamableFile } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createReadStream } from 'fs';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/')
	getAllUser() : Promise<object[]> {
		return (this.userService.getAllUser());
	}

	@Get(':id')
	getOneUser(@Param('id', ParseIntPipe) id : number) : Promise<object> {
		return (this.userService.getUserById(id));
	}

	//TODO : error code & error msg customize
	//TODO : catch HttpException
	@UseInterceptors(FileInterceptor(
		'avatar',
		{
			dest: '/photo',	//없는 폴더면 자동 생성
		})
	)
	@Post(':id')
	async updateUserAvatar(
		@Req() req : any,
		@Param('id', ParseIntPipe) id : number,
		@UploadedFile(
			new ParseFilePipeBuilder()
			.addFileTypeValidator({
				fileType: '.(jpeg|jpg|png|gif)',
			})
			// .addMaxSizeValidator({ maxSize: 1024 * 1024 * 4 })	// 4mb?
			.build({
				fileIsRequired: true
			})
		) file : Express.Multer.File,
		@Body() data : Prisma.UserUpdateInput,
		) : Promise<any>{
		if (req.user.id != id)
			throw new HttpException("unauthorized action", HttpStatus.BAD_REQUEST);
		return this.userService.updateUserByIdWithAvatar(id, data, file);
	}

	@Patch(':id')
	async updateUser(
		@Param('id', ParseIntPipe) id : number,
		@Body() data : Prisma.UserUpdateInput) : Promise<Object> {
		return this.userService.updateUserById(id, data);
	}

	@Get(':id/friend')
	async getUserFriends(@Param('id', ParseIntPipe) id : number) : Promise<object> {
		return this.userService.getUserFriendsById(id);
	}

	//dto 검증 필요
	@Patch(':id/friend')
	updateUserFriends(
		@Req() req : any,
		@Param('id', ParseIntPipe) id : number,
		@Body() data : {
			friend: number ;
			isAdd : boolean ;
		}
		) : Promise<object> {
			if (req.user.id != id)
				throw new HttpException("unauthorized action", HttpStatus.BAD_REQUEST);
			return this.userService.updateFriendsById(id, data);
	}


	@Get(':id/matchhistory')
		async getUserMatchHistory(@Param('id', ParseIntPipe) id : number)
		 : Promise<object[]> {
			return this.userService.getUserMatchHistoryById(id);
	}
}

//TODO : discuss router & authorization
@Controller('photo/:img')
export class avatarController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAvatar(@Param('img') img : string) : StreamableFile {
		const file = createReadStream(join('/photo/' + img));
		return new StreamableFile(file);
	}

	// @Get()
	// display(
	// 	@Param('img') img : string,
	// 	@Res() res: any){
	// 	res.sendFile(img, { root: '/app/photo' })
	// }
}
