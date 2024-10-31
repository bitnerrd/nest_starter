import axios from 'axios';
import { writeFile, mkdir } from 'fs/promises';
import { extname, join } from 'path';

export const downloadImage = async ({ url, outputPath }: { url: string, outputPath: string })=> {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const fileExtension = extname(url);
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}${fileExtension}`;
        const fullPath = join(outputPath, fileName);
        await mkdir(outputPath, { recursive: true });
        await writeFile(fullPath, response.data);
        return fullPath;
    } catch (error) {
        console.error('Failed to download image:', error.message);
    }
};
