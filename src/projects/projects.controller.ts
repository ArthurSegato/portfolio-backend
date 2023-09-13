import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsDto, CardCoverDto, AssetDto, CardCoverUpdateDto, AssetUpdateDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    /**
     * GET DATA SECTION
     */
    @Get('')
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.projectsService.findOne(+id);
    }

    /**
     * CREATE DATA SECTION
     */
    @HttpCode(HttpStatus.CREATED)
    @Post('')
    create(@Body() dto: ProjectsDto) {
        return this.projectsService.create(dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('card')
    @UseInterceptors(FileInterceptor('file'))
    uploadCard(@Body() dto: CardCoverDto, @UploadedFile() file: Express.Multer.File) {
        return this.projectsService.uploadCard(file, dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('cover')
    @UseInterceptors(FileInterceptor('file'))
    uploadCover(@Body() dto: CardCoverDto, @UploadedFile() file: Express.Multer.File) {
        return this.projectsService.uploadCover(file, dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('asset')
    @UseInterceptors(FileInterceptor('file'))
    uploadAsset(@Body() dto: AssetDto, @UploadedFile() file: Express.Multer.File) {
        return this.projectsService.uploadAsset(file, dto);
    }

    /**
     * UPDATE DATA SECTION
     */
    @HttpCode(HttpStatus.CREATED)
    @Put('card')
    @UseInterceptors(FileInterceptor('file'))
    updateCard(@Body() dto: CardCoverUpdateDto, @UploadedFile() file: Express.Multer.File) {
        return this.projectsService.updateCard(file, dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Put('cover')
    @UseInterceptors(FileInterceptor('file'))
    updateCover(@Body() dto: CardCoverUpdateDto, @UploadedFile() file: Express.Multer.File) {
        return this.projectsService.updateCover(file, dto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Put('asset')
    @UseInterceptors(FileInterceptor('file'))
    updateAsset(@Body() dto: AssetUpdateDto, @UploadedFile() file: Express.Multer.File) {
        return this.projectsService.updateAsset(file, dto);
    }
}