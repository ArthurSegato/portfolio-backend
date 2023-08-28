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
                    shortDescr: true,
                    assets: {
                        select: {
                            path: true,
                            hash: true
                        },
                        where: {
                            role: 'Card'
                        }
                    }
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
                },
                include: {
                    links: true,
                    assets: true
                }
            });

            delete projectInfo.shortDescr;
            return projectInfo;
        }
        catch (error) {
            throw error;
        }
    }
}
