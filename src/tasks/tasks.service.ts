import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    @Cron('30 * * * * *')
    async updateProjectData() {
        try {

            const githubLinks = [];

            const githubUrlRegex = /^https:\/\/github\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/;

            const projectsList = await this.prisma.project.findMany({
                select: {
                    id: true,
                    links: {
                        select: {
                            url: true
                        }
                    }
                }
            });

            projectsList.forEach(element => {
                element.links.forEach(link => {
                    if (githubUrlRegex.test(link.url)) {
                        if (githubLinks.some(el => el.id === element.id)) {
                            githubLinks[githubLinks.findIndex(el => el.id == element.id)].repo_name.push(link.url.match(/\/([^/]+)$/)[1])
                        } else {
                            githubLinks.push({
                                id: element.id,
                                repo_name: [link.url.match(/\/([^/]+)$/)[1]],
                                licenses: [],
                                stars: 0,
                                createdAt: undefined,
                                updatedAt: undefined
                            })
                        }
                    }
                });
            });

            for (let i = 0; i < githubLinks.length; i++) {
                for (let j = 0; j < githubLinks[i].repo_name.length; j++) {
                    const fetchData = await fetch(`https://api.github.com/repos/ArthurSegato/${githubLinks[i].repo_name[j]}`, {
                        method: 'GET',
                    }).then((response) => {
                        if (response.ok) return response.json()
                    }).then((data) => {
                        if (data.license !== null) {
                            if (!githubLinks[i].licenses.some(el => el.name === data.license.spdx_id)) {
                                githubLinks[i].licenses.push({
                                    name: data.license.spdx_id,
                                    url: `https://choosealicense.com/licenses/${data.license.key}`
                                })
                            }
                        }

                        githubLinks[i].stars += data.stargazers_count;

                        if (githubLinks[i].createdAt === undefined) {
                            githubLinks[i].createdAt = new Date(data.created_at);
                        } else {
                            githubLinks[i].createdAt = githubLinks[i].createdAt < new Date(data.created_at) ? githubLinks[i].createdAt : new Date(data.created_at);
                        }

                        if (githubLinks[i].updatedAt === undefined) {
                            githubLinks[i].updatedAt = new Date(data.updated_at);
                        } else {
                            githubLinks[i].updatedAt = githubLinks[i].updatedAt > new Date(data.updated_at) ? githubLinks[i].updatedAt : new Date(data.updated_at);
                        }
                    })
                }
            }


            for (const element of githubLinks) {
                const projectsData = await this.prisma.project.update({
                    where: {
                        id: element.id
                    },
                    data: {
                        stars: element.stars,
                        createdAt: element.createdAt,
                        updatedAt: element.updatedAt,
                        licenses: {
                            createMany: {
                                data: element.licenses
                            }
                        }
                    }
                })
            };
        }
        catch (error) {
            throw error;
        }
    }
}