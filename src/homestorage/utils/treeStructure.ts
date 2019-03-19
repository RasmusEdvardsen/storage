export function treeStructure(paths: string[]) {
    const filtered: any = paths.reduce((acc: any, curr: string) => {
        if (curr.indexOf('/') !== -1) {
            let pathArr = curr.split('/')
            let firstPath = pathArr[0];
            if (Object.keys(acc).includes(firstPath)) {
                acc[firstPath].children.push(pathArr.slice(1).join('/'))
            } else {
                acc[firstPath] = {
                    id: firstPath,
                    name: firstPath,
                    children: [
                        pathArr.slice(1).join('/')
                    ]
                }
            }
        } else if (curr.indexOf('.') !== -1) {
            acc['files'] = curr;
        }
        return acc;
    }, {});
    for (const key in filtered) {
        if (filtered.hasOwnProperty(key)) {
            const child = filtered[key];
            if (Object.keys(child).includes('children')) {
                child['children'] = treeStructure(child['children']);
            }
        }
    }
    return filtered;
}
