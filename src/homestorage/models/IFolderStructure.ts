export default interface IFolderStructure {
    id: string;
    name: string;
    children: IFolderStructure[] | string[];
}
