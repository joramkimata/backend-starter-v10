import * as fs from 'fs/promises';
import * as path from 'path';
import * as moment from 'moment';
import * as fsx from 'fs-extra';

export const saveFileToDisk = (base64Image: string, fileName: string, ext: string): Promise<string> => {


    const dir = `${process.env.UPLOAD_PATH}${path.sep}${moment().unix()}`;

    if (!fsx.existsSync(dir)) {
        fsx.mkdirSync(dir);
    }

    const fullPath = `${dir}${path.sep}${fileName}.${ext}`;

    const promise: Promise<string> = new Promise(async (resolve, reject) => {
        try {
            await fs.writeFile(fullPath, base64Image, { encoding: 'base64' });

            resolve(fullPath)
        } catch (error) {
            reject(error);
        }
    })
    return promise;
}


export const deleteFileFromDisk = async (fullPath: string): Promise<void> => {
    const promise: Promise<void> = new Promise(async (resolve, reject) => {
        try {
            // Check if the file exists
            const fileExists = await fsx.promises.access(fullPath, fsx.constants.F_OK)
                .then(() => true)
                .catch(() => false);

            if (fileExists) {
                // Delete the file
                await fsx.promises.unlink(fullPath);

                // Get the folder containing the file
                const containingFolder = path.dirname(fullPath);

                // Check if the folder exists
                const folderExists = await fsx.pathExists(containingFolder);

                if (folderExists) {
                    // Delete the folder and its contents
                    await fsx.remove(containingFolder);
                }

                resolve();
            } else {
                // The file doesn't exist, so resolve without an error
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });

    return promise;
};






