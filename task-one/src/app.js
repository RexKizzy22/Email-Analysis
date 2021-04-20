import FileTree from './fileTree';

export function createFileTree(input) {
  const fileTree = new FileTree();

  const copy = JSON.parse(JSON.stringify(input));
  const wellOrdered = copy.splice(0,1);
  let parentId = wellOrdered[0].id;

  for (let _ of copy) {
    const childNode = copy.find(el => el.parentId === parentId);
    wellOrdered.push(childNode);
    parentId = childNode.id;
  }

  for (const inputNode of wellOrdered) {
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}