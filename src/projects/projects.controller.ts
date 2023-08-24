import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Get('')
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    findOne(@Param() params: any) {
        return this.projectsService.findOne(params.id);
    }
}
