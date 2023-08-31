import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsDto, FileUploadDto } from './dto/projects.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express'

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Get('')
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(+id);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('')
    create(@Body() dto: ProjectsDto) {
        return this.projectsService.create(dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('upload')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'card', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
        { name: 'media', maxCount: 10 }
    ]))
    uploadImages(@Body() dto: FileUploadDto, @UploadedFiles() files: { card: Express.Multer.File[], banner: Express.Multer.File[], media: Express.Multer.File[] }) {
        return this.projectsService.uploadImages(files, dto);
    }

    @Get('images')
    getImages() {
        return this.projectsService.getImages()
    }
}