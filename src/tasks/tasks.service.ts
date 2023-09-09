import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
const fs = require('fs');
const path = require('path');

const removeFiles = async (prisma) => {
    try {
        const folderPath = './public';
        const fileNames = [];
        const dbData = await prisma.project.findMany({
            select: {
                card: {
                    select: {
                        name: true
                    }
                },
                cover: {
                    select: {
                        name: true
                    }
                },
                assets: {
                    select: {
                        name: true
                    }
                }
            }
        });

        dbData.forEach(element => {
            if (element.card !== null) fileNames.push(element.card.name);
            if (element.cover !== null) fileNames.push(element.cover.name);
            if (element.assets.length > 0) {
                element.assets.forEach(asset => {
                    if (asset.name !== null) fileNames.push(asset.name);
                });
            }
        });


        if (fileNames.length > 0) {
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    console.error('Error reading folder:', err);
                    return;
                }

                files.forEach((file) => {
                    if (!fileNames.includes(file)) {
                        const filePath = path.join(folderPath, file);

                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error removing file:', unlinkErr);
                            }
                        });
                    }
                });
            });
        }
    }
    catch (error) {
        throw error;
    }
}

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    @Cron('* * 1 * * *')
    handleCron() {
        removeFiles(this.prisma);
    }
}