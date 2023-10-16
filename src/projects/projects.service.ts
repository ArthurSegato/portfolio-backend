import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { put } from "@vercel/blob";

@Injectable()
export class ProjectsService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) {}

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

    // async uploadFiles(data, files) {
    //     try {
    //         if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

    //         if (files.length === 0) throw new BadRequestException("Must have files to upload");

    //         files.forEach((file) => {
    //             if (file.fieldname === "card") {
    //                 if (file.mimetype != "image/avif") throw new BadRequestException("'card' must be of type 'image/avif'");
    //             }
    //             if (file.fieldname === "googleUrl") {
    //                 if (file.mimetype != "image/avif") throw new BadRequestException("'googleUrl' must be of type 'image/avif'");
    //             }
    //             if (file.fieldname === "poster") {
    //                 if (file.mimetype != "image/avif") throw new BadRequestException("'poster' must be of type 'image/avif'");
    //             }
    //             if (file.fieldname === "facebookUrl") {
    //                 if (file.mimetype != "image/gif") throw new BadRequestException("'facebookUrl' must be of type 'image/gif'");
    //             }
    //             if (file.fieldname === "twitterUrl") {
    //                 if (file.mimetype != "image/gif") throw new BadRequestException("'twitterUrl' must be of type 'image/gif'");
    //             }
    //             if (file.fieldname === "cover") {
    //                 if (file.mimetype != "video/mp4") throw new BadRequestException("'cover' must be of type 'im/mp4'");
    //             }
    //         });

    //         const hasImages = await this.prisma.project.findUnique({
    //             where: {
    //                 id: data.projectId,
    //             },
    //             select: {
    //                 card: true,
    //                 cover: {
    //                     select: {
    //                         url: true,
    //                     },
    //                 },
    //                 metaImages: {
    //                     select: {
    //                         facebookUrl: true,
    //                         twitterUrl: true,
    //                         googleUrl: true,
    //                     },
    //                 },
    //             },
    //         });

    //         if (hasImages.card !== null || hasImages.cover !== null || hasImages.metaImages !== null) throw new ForbiddenException("Files already set");

    //         for (let i = 0; i < files.length; i++) {
    //             if (files[i].fieldname === "card") {
    //                 const card = await put(files[0].originalname, files[0].buffer, { access: "public" });
    //             }
    //             if (file.fieldname === "googleUrl") {
    //                 if (file.mimetype != "image/avif") throw new BadRequestException("'googleUrl' must be of type 'image/avif'");
    //             }
    //             if (file.fieldname === "poster") {
    //                 if (file.mimetype != "image/avif") throw new BadRequestException("'poster' must be of type 'image/avif'");
    //             }
    //             if (file.fieldname === "facebookUrl") {
    //                 if (file.mimetype != "image/gif") throw new BadRequestException("'facebookUrl' must be of type 'image/gif'");
    //             }
    //             if (file.fieldname === "twitterUrl") {
    //                 if (file.mimetype != "image/gif") throw new BadRequestException("'twitterUrl' must be of type 'image/gif'");
    //             }
    //             if (file.fieldname === "cover") {
    //                 if (file.mimetype != "video/mp4") throw new BadRequestException("'cover' must be of type 'im/mp4'");
    //             }
    //         }

    //         // return await this.prisma.card.create({
    //         //     data: {
    //         //         projectId: parseInt(data.projectId),
    //         //         url: blob.url,
    //         //     },
    //         // });
    //     } catch (error) {
    //         switch (error.code) {
    //             case "P2002":
    //                 throw new ForbiddenException("A card image has already been set");
    //             case "P2003":
    //                 throw new NotFoundException("There are no projects with this ID");
    //             default:
    //                 throw error;
    //         }
    //     }
    // }

    // async uploadCover(file, data) {
    //     try {
    //         if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

    //         if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

    //         return await this.prisma.cover.create({
    //             data: {
    //                 projectId: parseInt(data.projectId),
    //                 url: `${this.config.get("API_PATH")}/${file.filename}`,
    //                 poster: data.poster,
    //             },
    //         });
    //     } catch (error) {
    //         switch (error.code) {
    //             case "P2002":
    //                 throw new ForbiddenException("A cover image has already been set");
    //             case "P2003":
    //                 throw new NotFoundException("There are no projects with this ID");
    //             default:
    //                 throw error;
    //         }
    //     }
    // }

    // async uploadAsset(file, data) {
    //     try {
    //         if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

    //         if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

    //         return await this.prisma.asset.create({
    //             data: {
    //                 projectId: parseInt(data.projectId),
    //                 mimetype: file.mimetype,
    //                 url: `${this.config.get("API_PATH")}/${file.filename}`,
    //                 alt: data.alt,
    //                 title: data.title,
    //             },
    //         });
    //     } catch (error) {
    //         // Remove file on error
    //         removeFile(file.filename);
    //         switch (error.code) {
    //             case "P2003":
    //                 throw new NotFoundException("There are no projects with this ID");
    //             default:
    //                 throw error;
    //         }
    //     }
    // }

    // /**
    //  * UPDATE DATA SECTION
    //  */
    // async updateCard(file, data) {
    //     try {
    //         if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

    //         if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

    //         const oldFile = await this.prisma.card.findUnique({
    //             where: {
    //                 id: data.id,
    //             },
    //         });

    //         if (oldFile === null) throw new NotFoundException("There are no projects with this ID");

    //         return await this.prisma.card.update({
    //             where: {
    //                 id: parseInt(data.id),
    //             },
    //             data: {
    //                 url: `${this.config.get("API_PATH")}/${file.filename}`,
    //             },
    //         });
    //     } catch (error) {
    //         switch (error.code) {
    //             case "P2025":
    //                 throw new NotFoundException("There are no projects with this ID");
    //             default:
    //                 throw error;
    //         }
    //     }
    // }

    // async updateCover(file, data) {
    //     try {
    //         if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

    //         if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

    //         const oldFile = await this.prisma.cover.findUnique({
    //             where: {
    //                 id: data.id,
    //             },
    //         });

    //         if (oldFile === null) throw new NotFoundException("There are no projects with this ID");

    //         return await this.prisma.cover.update({
    //             where: {
    //                 id: parseInt(data.id),
    //             },
    //             data: {
    //                 url: `${this.config.get("API_PATH")}/${file.filename}`,
    //             },
    //         });
    //     } catch (error) {
    //         switch (error.code) {
    //             case "P2025":
    //                 throw new NotFoundException("There is no projects with this ID");
    //             default:
    //                 throw error;
    //         }
    //     }
    // }

    // async updateAsset(file, data) {
    //     try {
    //         if (data.key !== this.config.get("PASSWORD")) throw new ForbiddenException("Invalid key");

    //         if (!file.mimetype.match(/^(image\/avif|video\/mp4)$/)) throw new ForbiddenException("Invalid file format, it must be 'image/avif' or 'video/mp4'");

    //         const oldFile = await this.prisma.asset.findUnique({
    //             where: {
    //                 id: data.id,
    //             },
    //         });

    //         if (oldFile === null) throw new NotFoundException("There are no projects with this ID");

    //         return await this.prisma.asset.update({
    //             where: {
    //                 id: parseInt(data.id),
    //             },
    //             data: {
    //                 projectId: parseInt(data.projectId),
    //                 mimetype: file.mimetype,
    //                 url: `${this.config.get("API_PATH")}/${file.filename}`,
    //                 alt: data.alt,
    //             },
    //         });
    //     } catch (error) {
    //         switch (error.code) {
    //             case "P2025":
    //                 throw new NotFoundException("There are no projects with this ID");
    //             default:
    //                 throw error;
    //         }
    //     }
    // }
}
