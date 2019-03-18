// ["aaa/bbb/maxresdefault.jpg", "aaa/ccc/maxresdefault(1).jpg", "aaa/ccc/maxresdefault.jpg", "ccc/bbb/LUNDBECK-logo-RGB.jpg"]
export function treeStructure(paths: string[]) {
    let filtered: string[][] = paths.reduce((acc, curr) => {
        console.log(curr);
        return [[""]]
    }, [[""]]);
    console.log(filtered);
}

// // ["aaa/bbb/maxresdefault.jpg", "aaa/ccc/maxresdefault(1).jpg", "aaa/ccc/maxresdefault.jpg", "ccc/bbb/LUNDBECK-logo-RGB.jpg"]
// export function treeStructure(paths: string[]) {
//     console.log(paths);
//     let tree = {
//         // Represents the "root" directory, like in a filesystem.
//         root: {
//             absolute_path: '',
//             files: [],
//         },
//     };

//     // ["aaa", "bbb", "maxresdefault.jpg"]
//     function buildTree(parts: string[]) {
//         console.log(parts);
//         let lastDir: string = 'root';
//         let abs_path: string = '';

//         // "aaa"
//         parts.forEach((name: string) => {
//             // It's a directory
//             if (name.indexOf('.') === -1) {
//                 lastDir = name;
//                 abs_path += lastDir + '/';

//                 if (!tree[name]) {
//                     tree[name] = {
//                         absolute_path: abs_path,
//                         files: [],
//                     };
//                 }
//             } else {
//                 tree[lastDir].files.push(name);
//             }
//         });
//     }

//     paths.forEach(function(path, index, array) {
//         buildTree(path.split('/'));
//     });

//     console.log(tree);
//     return tree;
// }
