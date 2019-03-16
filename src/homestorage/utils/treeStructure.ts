export function treeStructure(paths) {
    let tree = {
        // Represents the "root" directory, like in a filesystem.
        root: {
            absolute_path: '',
            files: [],
        },
    };

    function buildTree(parts) {
        let lastDir = 'root';
        let abs_path = '';

        parts.forEach(function(name) {
            // It's a directory
            if (name.indexOf('.') === -1) {
                lastDir = name;
                abs_path += lastDir + '/';

                if (!tree[name]) {
                    tree[name] = {
                        absolute_path: abs_path,
                        files: [],
                    };
                }
            } else {
                tree[lastDir].files.push(name);
            }
        });
    }

    paths.forEach(function(path, index, array) {
        buildTree(path.split('/'));
    });

    console.log(tree);
    return tree;
}
