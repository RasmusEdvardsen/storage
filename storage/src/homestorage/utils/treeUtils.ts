import uuid from "uuid";

export function pathStringsToTreeStructure(paths: string[], parentFullPath: string = "") {
    const filtered: any = paths.reduce((acc: any, curr: string) => {
        if (curr.indexOf("/") !== -1) {
            const pathArr = curr.split("/");
            const firstPath = pathArr[0];
            if (acc.find((c: any) => c.name === firstPath)) {
                acc.find((c: any) => c.name === firstPath).children.push(pathArr.slice(1).join("/"));
            } else {
                acc.push({
                    id: uuid.v4(),
                    name: firstPath,
                    fullPath: parentFullPath.length > 0 ? (parentFullPath + "/" + firstPath) : firstPath,
                    children: [
                        pathArr.slice(1).join("/"),
                    ],
                });
            }
        } else if (curr.indexOf(".") !== -1) {
            acc.push({
                id: uuid.v4(),
                name: curr,
                fullPath: parentFullPath.length > 0 ? (parentFullPath + "/" + curr) : curr,
            });
        }
        return acc;
    }, []);
    for (const key in filtered) {
        if (filtered.hasOwnProperty(key)) {
            const child = filtered[key];
            if (Object.keys(child).includes("children")) {
                child.children = pathStringsToTreeStructure(child.children, child.fullPath);
            }
        }
    }
    return filtered;
}
