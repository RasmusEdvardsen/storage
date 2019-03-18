// takes in children of root objcet.

//  for each path
    //  split on /
    //  concat on top-level path
    //  for each concat paths
        //  rec(paths)

export function treeStructure(paths: string[]) {
    console.log(paths);
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
            acc['asd'] = curr;
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
    console.log(filtered);
    return filtered;
    // console.log(filtered);
}
