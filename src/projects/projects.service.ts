import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
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
                    description: true,
                    assets: {
                        select: {
                            path: true,
                        },
                        where: {
                            role: 'CARD'
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


            return projectInfo;
        }
        catch (error) {
            throw error;
        }
    }

    async create(project) {
        try {
            const projectModel = await this.prisma.project.create({
                data: {
                    name: project.name,
                    description: project.description,
                    longDescription: project.longDescription,
                    category: project.category,
                    visits: project.visits,
                    downloads: project.downloads,
                    revenue: project.revenue,
                    stars: project.stars,
                    techStack: project.techStack,
                    license: project.license,
                    size: project.size,
                    sizeUnit: project.sizeUnit,
                    createdAt: project.createdAt,
                    updatedAt: project.updatedAt,
                    links: {
                        createMany: {
                            data: project.links
                        }
                    }
                }
            });

            return { message: "Project created!" }
        }
        catch (error) {
            throw error;
        }
    }

    async uploadImages(files, dto) {
        try {
            const dbQuery = await this.prisma.asset.createMany({
                data: []
            })
            return files;
        }
        catch (error) {
            throw error;
        }
    }

    async getImages() {
    }
}
