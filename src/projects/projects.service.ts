import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
                    card: true
                }
            });
        }
        catch (error) {
            throw error;
        }
    }

    async findOne(id) {
        try {
            const dbData = await this.prisma.project.findUnique({
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
                    techStack: true,
                    size: true,
                    sizeUnit: true,
                    links: {
                        select: {
                            name: true,
                            url: true
                        }
                    },
                    cover: {
                        select: {
                            mimetype: true,
                            url: true
                        }
                    },
                    assets: {
                        select: {
                            mimetype: true,
                            url: true,
                            alt: true
                        },
                    }
                }
            });

            if (dbData === null) throw new NotFoundException('There is no projects with this ID');

            const githubUrlRegex = /^https:\/\/github\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/;
            const youtubeUrlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|youtu\.be\/|user\/\S+\/|user\/\S+\/videos\?v=)([a-zA-Z0-9_-]{11})/;
            const github = {
                stars: 0,
                created_at: null,
                updated_at: null,
                size: dbData.size,
                size_unit: dbData.sizeUnit,
                licenses: [],
            }
            const youtube = {
                views: 0,
                likes: 0,
                comments: 0
            }

            for (let i = 0; i < dbData.links.length; i++) {
                if (githubUrlRegex.test(dbData.links[i].url)) {
                    await fetch(`https://api.github.com/repos/ArthurSegato/${dbData.links[i].url.match(/\/([^/]+)$/)[1]}`, {
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${this.config.get('GITHUB_API_KEY')} `
                        }
                    }).then((response) => {
                        if (response.ok) return response.json()
                    }).then((data) => {
                        github.stars += data.stargazers_count;

                        if (data.license !== null) {
                            github.licenses.push({
                                name: data.license.spdx_id,
                                url: `https://choosealicense.com/licenses/${data.license.key}`
                            })
                        }

                        if (github.created_at === null || github.created_at < data.created_at) github.created_at = data.created_at.split('T')[0];

                        if (github.updated_at === null || github.created_at > data.created_at) github.updated_at = data.updated_at.split('T')[0];
                    })
                }
                if (youtubeUrlRegex.test(dbData.links[i].url)) {
                    await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${this.config.get('YOUTUBE_API_KEY')}&id=${dbData.links[i].url.match(youtubeUrlRegex)[1]}&part=statistics`, {
                        method: 'GET'
                    }).then((response) => {
                        if (response.ok) return response.json()
                    }).then((data) => {
                        if (data.items.length > 0) {
                            youtube.views += data.items[0].statistics.viewCount;
                            youtube.likes += data.items[0].statistics.likeCount;
                            youtube.comments += data.items[0].statistics.commentCount;
                        }
                    })
                }
            };

            return {
                name: dbData.name,
                long_description: dbData.longDescription,
                category: dbData.category,
                visits: dbData.visits,
                downloads: dbData.downloads,
                revenue: dbData.revenue === null ? 0.0 : dbData.revenue,
                youtube: youtube,
                github: github,
                tech_stack: dbData.techStack,
                links: dbData.links,
                cover: dbData.cover,
                assets: dbData.assets
            };
        }
        catch (error) {
            throw error;
        }
    }

    async create(project) {
        try {
            if (project.key !== this.config.get('PASSWORD')) throw new ForbiddenException('Invalid key');

            return await this.prisma.project.create({
                data: {
                    name: project.name,
                    description: project.description,
                    longDescription: project.longDescription,
                    category: project.category,
                    visits: project.visits != null ? project.visits : undefined,
                    downloads: project.downloads != null ? project.downloads : undefined,
                    revenue: project.revenue != null ? project.revenue : undefined,
                    techStack: project.techStack != null ? project.techStack : undefined,
                    size: project.size != null ? project.size : undefined,
                    sizeUnit: project.sizeUnit != null ? project.sizeUnit : undefined,
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
            if (data.key !== this.config.get('PASSWORD')) throw new ForbiddenException('Invalid key');

            const apiPath = this.config.get('API_PATH')

            if (data.role === "card") return await this.prisma.card.create({
                data: {
                    projectId: parseInt(data.projectId),
                    mimetype: file.mimetype,
                    url: `${apiPath}/${file.filename}`,
                }
            });

            if (data.role === "cover") return await this.prisma.cover.create({
                data: {
                    projectId: parseInt(data.projectId),
                    mimetype: file.mimetype,
                    url: `${apiPath}/${file.filename}`,
                }
            });

            else return await this.prisma.asset.create({
                data: {
                    projectId: parseInt(data.projectId),
                    mimetype: file.mimetype,
                    url: `${apiPath}/${file.filename}`,
                    alt: data.alt
                }
            })
        }
        catch (error) {
            throw error;
        }
    }
}