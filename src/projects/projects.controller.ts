import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsDto, CardCoverDto, AssetDto } from './dto/projects.dto';
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Get('')
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.projectsService.findOne(+id);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('')
    create(@Body() dto: ProjectsDto) {
        return this.projectsService.create(dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('card')
    @UseInterceptors(FileInterceptor('file'))
    updateCard(@Body() dto: CardCoverDto, @UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /^(image\/avif|video\/mp4)$/,
            })
            .build({
                errorHttpStatusCode: HttpStatus.FORBIDDEN
            })) file: Express.Multer.File) {
        return this.projectsService.updateCard(file, dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Patch('card')
    @UseInterceptors(FileInterceptor('file'))
    uploadCard(@Body() dto: CardCoverDto, @UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /^(image\/avif|video\/mp4)$/,
            })
            .build({
                errorHttpStatusCode: HttpStatus.FORBIDDEN
            })) file: Express.Multer.File) {
        return this.projectsService.uploadCard(file, dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('cover')
    @UseInterceptors(FileInterceptor('file'))
    uploadCover(@Body() dto: CardCoverDto, @UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /^(image\/avif|video\/mp4)$/,
            })
            .build({
                errorHttpStatusCode: HttpStatus.FORBIDDEN
            })) file: Express.Multer.File) {
        return this.projectsService.uploadCover(file, dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('asset')
    @UseInterceptors(FileInterceptor('file'))
    uploadAsset(@Body() dto: AssetDto, @UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /^(image\/avif|video\/mp4)$/,
            })
            .build({
                errorHttpStatusCode: HttpStatus.FORBIDDEN
            })) file: Express.Multer.File) {
        return this.projectsService.uploadAsset(file, dto);
    }
}