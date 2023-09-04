import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService, private config: ConfigService) { }

    async findAll() {
        try {
            return await this.prisma.project.findMany({
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
        }
        catch (error) {
            throw error;
        }
    }

    async findOne(id) {
        try {
            return await this.prisma.project.findUnique({
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
                    licenses: {
                        select: {
                            name: true,
                            url: true
                        }
                    },
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
        }
        catch (error) {
            throw error;
        }
    }

    async create(project) {
        try {
            if (project.key !== this.config.get('KEY')) throw new ForbiddenException('Invalid key');

            return this.prisma.project.create({
                data: {
                    name: project.name,
                    description: project.description,
                    longDescription: project.longDescription,
                    category: project.category,
                    visits: project.visits != null ? project.visits : undefined,
                    downloads: project.downloads != null ? project.downloads : undefined,
                    revenue: project.revenue != null ? project.revenue : undefined,
                    stars: undefined,
                    techStack: project.techStack != null ? project.techStack : undefined,
                    licenses: undefined,
                    size: project.size != null ? project.size : undefined,
                    sizeUnit: project.sizeUnit != null ? project.sizeUnit : undefined,
                    createdAt: project.createdAt,
                    updatedAt: undefined,
                    links: {
                        createMany: {
                            data: project.links
                        }
                    }
                }
            });
        }
        catch (error) {
            throw error;
        }
    }

    async uploadAssets(file, data) {
        try {
            if (data.key !== this.config.get('KEY')) throw new ForbiddenException('Invalid key');
            return this.prisma.asset.create({
                data: {
                    projectId: parseInt(data.projectId),
                    mimetype: file.mimetype,
                    name: file.filename,
                    role: data.role,
                    alt: data.alt
                }
            })
        }
        catch (error) {
            throw error;
        }
    }
}