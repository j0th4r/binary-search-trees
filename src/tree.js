import Node from './node.js'

export default class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const arr = [...new Set(array)].sort((a, b) => a - b);
    
    const build = (arr) => {
        if (arr.length === 0) return null;
        const mid = Math.floor(arr.length / 2);
        const node = new Node(arr[mid]);
        node.left = build(arr.slice(0, mid));
        node.right = build(arr.slice(mid + 1));
        return node;
    };

    return build(arr);
  }

  insert(value) {
    const insertNode = (node, value) => {
      if (node === null) {
          return new Node(value);
      }
      if (value < node.data) {
          node.left = insertNode(node.left, value);
      } else if (value > node.data) {
          node.right = insertNode(node.right, value);
      }
      return node;
    };
    this.root = insertNode(this.root, value);
  }

  deleteItem(value) {
    const deleteNode = (node, value) => {
      if (node === null) {
        return null;
      }

      if (value < node.data) {
        node.left = deleteNode(node.left, value);
      } else if (value > node.data) {
        node.right = deleteNode(node.right, value);
      } else {
        if (node.right === null && node.left === null) {
          return null;
        } else if (node.left === null) {
          return node.right
        } else if (node.right === null) {
          return node.left
        } else {
          let successor = node.right;
          while (successor.left !== null) {
            successor = successor.left;
          }
          node.data = successor.data
          node.right = deleteNode(node.right, successor.data)
        }
      }
      return node
    }

    this.root = deleteNode(this.root, value)
  }

  find(value) {
    const findNode = (node, value) => {
      if (node === null || node.data === value) {
          return node;
      }
      if (value < node.data) {
          return findNode(node.left, value);
      } else if (value > node.data) {
          return findNode(node.right, value);
      }
      return node;
    };
    return findNode(this.root, value);
  }

  levelOrder(callback) {
    if (!callback) {
      throw new Error("Callback is required");
    }

    const queue = [this.root];
    while (queue.length > 0) {
        const node = queue.shift();
        callback(node);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
  }

  inOrder(callback) {
    if (!callback) throw new Error("Callback is required");

    function traverse(node) {
        if (!node) return;
        traverse(node.left);
        callback(node);
        traverse(node.right);
    }

    traverse(this.root);
  }

  preOrder(callback) {
    if (!callback) throw new Error("Callback is required");

    function traverse(node) {
        if (!node) return;
        callback(node);
        traverse(node.left);
        traverse(node.right);
    }

    traverse(this.root);
  }

  postOrder(callback) {
    if (!callback) throw new Error("Callback is required");

    function traverse(node) {
        if (!node) return;
        traverse(node.left);
        traverse(node.right);
        callback(node);
    }

    traverse(this.root);
  }

  height(value) {
    const node = this.find(value)

    const height = (node) => {
      if(!node) {
        return -1; 
      }
      return Math.max(height(node.left), height(node.right)) + 1;
    }

    return height(node);
  }

  depth(value) {
    const node = this.find(value)
    if(!node) {
      return null; 
    }

    let current = this.root;
    let depthCount = 0;

    const findDepth = (current, target)=> {
      if(!current) {
        return -1;
      } 
      if(current.data === target) {
        return depthCount;
      }

      depthCount++;


      if (target < current.data) {
        return findDepth(current.left, target);
      } else {
        return findDepth(current.right, target);
      }
    }

    return findDepth(this.root, value);
  }


  isBalanced() {
    const checkBalance = (node) => {
        if (!node) {
            return { height: -1, balanced: true }; 
        }

        const left = checkBalance(node.left); 
        const right = checkBalance(node.right); 

        const height = Math.max(left.height, right.height) + 1; 
        const balanced = left.balanced && right.balanced && Math.abs(left.height - right.height) <= 1; 

        return { height, balanced };
    };

    return checkBalance(this.root).balanced; 
  }

  rebalance() {
    const values = [];
    
    this.inOrder((node) => {
        values.push(node.data);
    });

  
    this.root = this.buildTree(values);
  }


}