import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService, private config: ConfigService) { }

    async findAll() {
        try {
            const projectsList = await this.prisma.project.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    assets: {
                        select: {
                            name: true,
                            alt: true
                        },
                        where: {
                            role: 'CARD'
                        }
                    }
                }
            });
            return projectsList;
        }
        catch (error) {
            throw error;
        }
    }

    async findOne(id) {
        try {
            const projectData = await this.prisma.project.findUnique({
                where: {
                    id
                },
                select: {
                    name: true,
                    longDescription: true,
                    category: true,
                    visits: true,
                    downloads: true,
                    revenue: true,
                    stars: true,
                    techStack: true,
                    license: true,
                    size: true,
                    sizeUnit: true,
                    createdAt: true,
                    updatedAt: true,
                    links: {
                        select: {
                            name: true,
                            url: true
                        }
                    },
                    assets: {
                        select: {
                            mimetype: true,
                            name: true,
                            alt: true,
                            role: true
                        },
                        where: {
                            NOT: {
                                role: "CARD"
                            }
                        }
                    }
                }
            });

            return projectData;
        }
        catch (error) {
            throw error;
        }
    }

    async create(project) {
        try {
            if (project.key !== this.config.get('KEY')) throw new ForbiddenException('Invalid key');

            const projectData = this.prisma.project.create({
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

            return projectData
        }
        catch (error) {
            throw error;
        }
    }

    async uploadAssets(file, data) {
        try {
            if (data.key !== this.config.get('KEY')) throw new ForbiddenException('Invalid key');
            const projectAsset = this.prisma.asset.create({
                data: {
                    projectId: parseInt(data.projectId),
                    mimetype: file.mimetype,
                    name: file.filename,
                    role: data.role,
                    alt: data.alt
                }
            })
            return projectAsset;
        }
        catch (error) {
            throw error;
        }
    }
}
