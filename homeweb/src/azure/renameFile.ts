import { post } from "@/web/web";

export default async function renameFile(containerName: string, names: any[]): Promise<number> {
    try {
        await post("https://homestoragefunc.azurewebsites.net/api/RenameBlobs", {names, containerName});
        return 200;
    } catch (error) {
        return 500;
    }
}
