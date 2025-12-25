import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Storage, ID } from 'node-appwrite';

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name);
    private client: Client;
    private storage: Storage;
    private bucketId: string;
    private endpoint: string;
    private projectId: string;

    constructor(private configService: ConfigService) {
        this.endpoint = this.configService.get<string>('appwrite.endpoint') || 'https://cloud.appwrite.io/v1';
        this.projectId = this.configService.get<string>('appwrite.projectId') || '';
        const apiKey = this.configService.get<string>('appwrite.apiKey') || '';
        this.bucketId = this.configService.get<string>('appwrite.bucketId') || '';

        this.client = new Client()
            .setEndpoint(this.endpoint)
            .setProject(this.projectId)
            .setKey(apiKey);

        this.storage = new Storage(this.client);

        this.logger.log(`Appwrite configured: ${this.endpoint}`);
    }

    async uploadFile(file: Express.Multer.File, folder?: string): Promise<{ fileId: string; url: string }> {
        const fileId = ID.unique();
        const fileName = folder ? `${folder}_${fileId}_${file.originalname}` : `${fileId}_${file.originalname}`;

        try {
            // Create a File object from the buffer for node-appwrite v21+
            // Convert Buffer to Uint8Array for Blob compatibility
            const uint8Array = new Uint8Array(file.buffer);
            const blob = new Blob([uint8Array], { type: file.mimetype });
            const uploadFile = new File([blob], fileName, { type: file.mimetype });

            const result = await this.storage.createFile(
                this.bucketId,
                fileId,
                uploadFile,
            );

            const url = `${this.endpoint}/storage/buckets/${this.bucketId}/files/${result.$id}/view?project=${this.projectId}`;

            this.logger.log(`File uploaded: ${result.$id}`);

            return {
                fileId: result.$id,
                url,
            };
        } catch (error) {
            this.logger.error(`Failed to upload file: ${error}`);
            throw error;
        }
    }

    async deleteFile(fileId: string): Promise<void> {
        try {
            await this.storage.deleteFile(this.bucketId, fileId);
            this.logger.log(`File deleted: ${fileId}`);
        } catch (error) {
            this.logger.error(`Failed to delete file: ${error}`);
            throw error;
        }
    }

    getFileUrl(fileId: string): string {
        return `${this.endpoint}/storage/buckets/${this.bucketId}/files/${fileId}/view?project=${this.projectId}`;
    }
}
