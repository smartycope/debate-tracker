export function getNodeCount(tree) {
    if (!tree.children || tree.children.length === 0) {
      // If the node has no children, it's a leaf node, count as 1
      return 1;
    }

    // Count the current node and recursively count nodes in its children
    return 1 + tree.children.reduce((count, child) => count + getNodeCount(child), 0);
  }


export function addToTree(originalTree, newNode, parentId, sibling=false) {
    // Create a deep copy of the original tree using JSON.parse and JSON.stringify
    const treeCopy = JSON.parse(JSON.stringify(originalTree));

    function addToCopy(copy, node, id) {
      if (copy.id === id || (copy.children.map(child => child.id).includes(id) && sibling)) {
        // If the current node has the specified ID, add the new node as a child
        copy.children.push(node);
        return;
      }

      // If the current node has children, recursively search for the parent ID in its children
      if (copy.children && copy.children.length > 0) {
        copy.children.forEach(child => addToCopy(child, node, id));
      }
    }

    addToCopy(treeCopy, newNode, parentId);
    return treeCopy;
  }
