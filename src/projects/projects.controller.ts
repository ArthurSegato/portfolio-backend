import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsDto, FileUploadDto } from './dto/projects.dto';
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
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadAssets(@Body() dto: FileUploadDto, @UploadedFile() file: Express.Multer.File) {
        return this.projectsService.uploadAssets(file, dto);
    }
}