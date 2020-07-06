import * as tl from 'azure-pipelines-task-lib/task';
import * as os from 'os';
import * as path from 'path';

import { ToolRunner } from 'azure-pipelines-task-lib/toolrunner';

export function sleepFor(sleepDurationInMilliSeconds: number): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sleepDurationInMilliSeconds);
    });
}

/**
 * Build a path to file in local root.
 * @param localPathRoot Path to the folder where file should be located.
 * @param fileNameAndPath Path to the file which name should be taken.
 */
export function buildFilePath(localPathRoot: string, fileNameAndPath: string): string {
    const fileName = fileNameAndPath.split(/[\\\/]/).pop();
    const extractSource = path.join(localPathRoot, fileName);

    return extractSource;
}

/**
 * Run a tool with `sudo` on Linux and macOS.
 * Precondition: `toolName` executable is in PATH.
 */
export function sudo(toolName: string): ToolRunner {
    if (os.platform() === 'win32') {
        return tl.tool(toolName);
    } else {
        const toolPath = tl.which(toolName);
        return tl.tool('sudo').line(toolPath);
    }
}

/**
 * Attach a disk image.
 * Only for macOS.
 * @param sourceFile Path to a disk image file.
 */
export async function attach(sourceFile: string): Promise<number> {
    console.log(tl.loc('AttachDiskImage'));
    const hdiutil = sudo('hdiutil');
    hdiutil.line(`attach "${sourceFile}"`);
    return await hdiutil.exec();
}

/**
 * Detach a disk image.
 * @param volumePath Path to the attached disk image.
 */
export async function detach(volumePath: string): Promise<number> {
    console.log(tl.loc('DetachDiskImage'));
    const hdiutil = sudo('hdiutil');
    hdiutil.line(`detach "${volumePath}"`);
    return await hdiutil.exec();
}