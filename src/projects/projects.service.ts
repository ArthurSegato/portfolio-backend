import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
const fs = require("fs");

@Injectable()
export class ProjectsService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) {}

    /**
     * GET DATA SECTION
     */
    async findAll() {
        try {
            return await this.prisma.project.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    card: {
                        select: {
                            mimetype: true,
                            url: true,
                        },
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findOne(id) {
        try {
            const dbData = await this.prisma.project.findUnique({
                where: {
                    id,
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
                            url: true,
                        },
                    },
                    cover: {
                        select: {
                            mimetype: true,
                            url: true,
                        },
                    },
                    assets: {
                        select: {
                            mimetype: true,
                            url: true,
                            alt: true,
                        },
                    },
                    embeds: true,
                },
            });

            if (dbData === null) throw new NotFoundException("There is no projects with this ID");

            const githubUrlRegex = /^https:\/\/github\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/;
            const youtubeUrlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|youtu\.be\/|user\/\S+\/|user\/\S+\/videos\?v=)([a-zA-Z0-9_-]{11})/;
            const github = {
                stars: null,
                created_at: null,
                updated_at: null,
                size: dbData.size,
                size_unit: dbData.sizeUnit,
                licenses: null,
            };
            const youtube = {
                views: null,
                likes: null,
                comments: null,
            };

            for (let i = 0; i < dbData.links.length; i++) {
                if (githubUrlRegex.test(dbData.links[i].url)) {
                    await fetch(`https://api.github.com/repos/ArthurSegato/${dbData.links[i].url.match(/\/([^/]+)$/)[1]}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${this.config.get("GITHUB_API_KEY")} `,
                        },
                    })
                        .then((response) => {
                            if (response.ok) return response.json();
                        })
                        .then((data) => {
                            github.stars += data.stargazers_count;

                            if (data.license !== null) {
                                if (github.licenses === null) {
                                    github.licenses = [
                                        {
                                            name: data.license.spdx_id,
                                            url: `https://choosealicense.com/licenses/${data.license.key}`,
                                        },
                                    ];
                                } else {
                                    github.licenses.push({
                                        name: data.license.spdx_id,
                                        url: `https://choosealicense.com/licenses/${data.license.key}`,
                                    });
                                }
                            }

                            if (github.created_at === null || github.created_at < data.created_at) github.created_at = data.created_at.split("T")[0];

                            if (github.updated_at === null || github.created_at > data.created_at) github.updated_at = data.updated_at.split("T")[0];
                        });
                }
                if (youtubeUrlRegex.test(dbData.links[i].url)) {
                    await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${this.config.get("YOUTUBE_API_KEY")}&id=${dbData.links[i].url.match(youtubeUrlRegex)[1]}&part=statistics`, {
                        method: "GET",
                    })
                        .then((response) => {
                            if (response.ok) return response.json();
                        })
                        .then((data) => {
                            if (data.items.length > 0) {
                                youtube.views += parseInt(data.items[0].statistics.viewCount);
                                youtube.likes += parseInt(data.items[0].statistics.likeCount);
                                youtube.comments += parseInt(data.items[0].statistics.commentCount);
                            }
                        });
                }
            }

            return {
                name: dbData.name,
                long_description: dbData.longDescription,
                category: dbData.category,
                visits: dbData.visits,
                downloads: dbData.downloads,
                revenue: dbData.revenue,
                youtube: youtube,
                github: github,
                tech_stack: dbData.techStack,
                links: dbData.links,
                cover: dbData.cover,
                assets: dbData.assets,
                embeds: dbData.embeds,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * CREATE DATA SECTION
     */
    async create(project) {
        try {
            if (project.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

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
                            data: project.links,
                        },
                    },
                    embeds: project.embeds,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async uploadCard(file, data) {
        try {
            if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

            if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

            return await this.prisma.card.create({
                data: {
                    projectId: parseInt(data.projectId),
                    name: file.filename,
                    mimetype: file.mimetype,
                    url: `${this.config.get("API_PATH")}/${file.filename}`,
                },
            });
        } catch (error) {
            // Remove file on error
            removeFile(file.filename);
            switch (error.code) {
                case "P2002":
                    throw new ForbiddenException("A card image has already been set");
                case "P2003":
                    throw new NotFoundException("There are no projects with this ID");
                default:
                    throw error;
            }
        }
    }

    async uploadCover(file, data) {
        try {
            if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

            if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

            return await this.prisma.cover.create({
                data: {
                    projectId: parseInt(data.projectId),
                    name: file.filename,
                    mimetype: file.mimetype,
                    url: `${this.config.get("API_PATH")}/${file.filename}`,
                },
            });
        } catch (error) {
            // Remove file on error
            removeFile(file.filename);
            switch (error.code) {
                case "P2002":
                    throw new ForbiddenException("A cover image has already been set");
                case "P2003":
                    throw new NotFoundException("There are no projects with this ID");
                default:
                    throw error;
            }
        }
    }

    async uploadAsset(file, data) {
        try {
            if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

            if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

            return await this.prisma.asset.create({
                data: {
                    projectId: parseInt(data.projectId),
                    name: file.filename,
                    mimetype: file.mimetype,
                    url: `${this.config.get("API_PATH")}/${file.filename}`,
                    alt: data.alt,
                },
            });
        } catch (error) {
            // Remove file on error
            removeFile(file.filename);
            switch (error.code) {
                case "P2003":
                    throw new NotFoundException("There are no projects with this ID");
                default:
                    throw error;
            }
        }
    }

    /**
     * UPDATE DATA SECTION
     */
    async updateCard(file, data) {
        try {
            if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

            if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

            const oldFile = await this.prisma.card.findUnique({
                where: {
                    id: data.id,
                },
            });

            if (oldFile === null) throw new NotFoundException("There are no projects with this ID");

            removeFile(oldFile.name);

            return await this.prisma.card.update({
                where: {
                    id: parseInt(data.id),
                },
                data: {
                    name: file.filename,
                    mimetype: file.mimetype,
                    url: `${this.config.get("API_PATH")}/${file.filename}`,
                },
            });
        } catch (error) {
            // Remove file on error
            removeFile(file.filename);
            switch (error.code) {
                case "P2025":
                    throw new NotFoundException("There are no projects with this ID");
                default:
                    throw error;
            }
        }
    }

    async updateCover(file, data) {
        try {
            if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

            if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

            const oldFile = await this.prisma.cover.findUnique({
                where: {
                    id: data.id,
                },
            });

            if (oldFile === null) throw new NotFoundException("There are no projects with this ID");

            removeFile(oldFile.name);

            return await this.prisma.cover.update({
                where: {
                    id: parseInt(data.id),
                },
                data: {
                    name: file.filename,
                    mimetype: file.mimetype,
                    url: `${this.config.get("API_PATH")}/${file.filename}`,
                },
            });
        } catch (error) {
            // Remove file on error
            removeFile(file.filename);
            switch (error.code) {
                case "P2025":
                    throw new NotFoundException("There is no projects with this ID");
                default:
                    throw error;
            }
        }
    }

    async updateAsset(file, data) {
        try {
            if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

            if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

            const oldFile = await this.prisma.asset.findUnique({
                where: {
                    id: data.id,
                },
            });

            if (oldFile === null) throw new NotFoundException("There are no projects with this ID");

            removeFile(oldFile.name);

            return await this.prisma.asset.update({
                where: {
                    id: parseInt(data.id),
                },
                data: {
                    projectId: parseInt(data.projectId),
                    name: file.filename,
                    mimetype: file.mimetype,
                    url: `${this.config.get("API_PATH")}/${file.filename}`,
                    alt: data.alt,
                },
            });
        } catch (error) {
            // Remove file on error
            removeFile(file.filename);
            switch (error.code) {
                case "P2025":
                    throw new NotFoundException("There are no projects with this ID");
                default:
                    throw error;
            }
        }
    }
}

const removeFile = async (fileName) => {
    fs.unlink(`./public/${fileName}`, (unlinkErr) => {
        if (unlinkErr) throw unlinkErr;
    });
};
