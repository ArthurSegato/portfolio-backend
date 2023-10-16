import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectsDto, FilesDto, AssetDto, FilesUpdateDto, AssetUpdateDto } from "./dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller("projects")
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post("")
    create(@Body() dto: ProjectsDto) {
        return this.projectsService.create(dto);
    }

    // @HttpCode(HttpStatus.CREATED)
    // @Post("files")
    // @UseInterceptors(AnyFilesInterceptor())
    // uploadFiles(@Body() dto: FilesDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    //     return this.projectsService.uploadFiles(dto, files);
    // }

    // @HttpCode(HttpStatus.CREATED)
    // @Post("cover")
    // @UseInterceptors(FileInterceptor("file"))
    // uploadCover(@Body() dto: CardCoverDto, @UploadedFile() file: Express.Multer.File) {
    //     return this.projectsService.uploadCover(file, dto);
    // }

    // @HttpCode(HttpStatus.CREATED)
    // @Post("asset")
    // @UseInterceptors(FileInterceptor("file"))
    // uploadAsset(@Body() dto: AssetDto, @UploadedFile() file: Express.Multer.File) {
    //     return this.projectsService.uploadAsset(file, dto);
    // }

    // /**
    //  * UPDATE DATA SECTION
    //  */
    // @HttpCode(HttpStatus.CREATED)
    // @Put("card")
    // @UseInterceptors(FileInterceptor("file"))
    // updateCard(@Body() dto: CardCoverUpdateDto, @UploadedFile() file: Express.Multer.File) {
    //     return this.projectsService.updateCard(file, dto);
    // }

    // @HttpCode(HttpStatus.CREATED)
    // @Put("cover")
    // @UseInterceptors(FileInterceptor("file"))
    // updateCover(@Body() dto: CardCoverUpdateDto, @UploadedFile() file: Express.Multer.File) {
    //     return this.projectsService.updateCover(file, dto);
    // }

    // @HttpCode(HttpStatus.CREATED)
    // @Put("asset")
    // @UseInterceptors(FileInterceptor("file"))
    // updateAsset(@Body() dto: AssetUpdateDto, @UploadedFile() file: Express.Multer.File) {
    //     return this.projectsService.updateAsset(file, dto);
    // }
}
