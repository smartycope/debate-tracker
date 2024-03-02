

export function getNodeCount(tree) {
    if (!tree.children || tree.children.length === 0) {
      // If the node has no children, it's a leaf node, count as 1
      return 1;
    }

    // Count the current node and recursively count nodes in its children
    return 1 + tree.children.reduce((count, child) => count + getNodeCount(child), 0);
  }

export function addToTree(tree, newNode, parentId) {
    if (tree.id === parentId) {
        // If the current node has the specified ID, add the new node as a child
        tree.children.push(newNode);
        return;
    }

    // If the current node has children, recursively search for the parent ID in its children
    if (tree.children && tree.children.length > 0) {
        tree.children.forEach(child => addToTree(child, newNode, parentId));
    }
  }
