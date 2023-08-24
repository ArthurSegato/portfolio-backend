import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        try {
            const projectInfo = await this.prisma.project.findMany({
                select: {
                    id: true,
                    name: true,
                    cardDescr: true,
                    cardImg: true
                }
            });
            return projectInfo;
        }
        catch (error) {
            throw error;
        }
    }

    async findOne(id) {
        try {
            const projectInfo = await this.prisma.project.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            delete projectInfo.cardDescr;
            delete projectInfo.cardImg;

            return projectInfo;
        }
        catch (error) {
            throw error;
        }
    }
}
