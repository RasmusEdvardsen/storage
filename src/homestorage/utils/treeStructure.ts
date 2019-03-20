export function pathStringsToTreeStructure(paths: string[]) {
    const filtered: any = paths.reduce((acc: any, curr: string) => {
        if (curr.indexOf('/') !== -1) {
            const pathArr = curr.split('/');
            const firstPath = pathArr[0];
            if (acc.find((c: any) => c.id === firstPath)) {
                acc.find((c: any) => c.id === firstPath).children.push(pathArr.slice(1).join('/'));
            } else {
                acc.push({
                    id: firstPath,
                    name: firstPath,
                    children: [
                        pathArr.slice(1).join('/'),
                    ],
                });
            }
        } else if (curr.indexOf('.') !== -1) {
            acc.push({
                id: curr,
                name: curr,
                children: [],
            });
        }
        return acc;
    }, []);
    for (const key in filtered) {
        if (filtered.hasOwnProperty(key)) {
            const child = filtered[key];
            if (Object.keys(child).includes('children')) {
                child.children = pathStringsToTreeStructure(child.children);
            }
        }
    }
    return filtered;
}
