var not = {
  left: 'right',
  right: 'left'
}

var L = 'left'
var R = 'right'

// function L (node) {
//   return node.left
// }
// function R (node) {
//   return node.right
// }

// delete
// join

module.exports = {
  insert: insert,
  seqRead: seqRead,
  Node: Node,
  lower: lower,
  lowest: lowest,
  higher: higher,
  highest: highest
}

function insert (root, node, fn) {
  node.left = null
  node.right = null
  return splay(root, node, fn)
}

function seqRead (node, cb, compare) {
  var nextNode = lowest(node)
  console.log(nextNode)
  node = splay(node, nextNode, compare)
  console.log(node)
  cb(node)

  while (nextNode = higher(node)) {
    node = splay(node, nextNode, compare)
    cb(node)
  }
}


function splay (gp, node, compare) {
  var tmp
  var par
  var nextGp
  var first
  var second
  node.left = null
  node.right = null
  while (gp) {
    tmp = par = nextGp = null
    first = second = ''
    if (compare(node.value, gp.value, node.key, gp.key) < 0) {
      first = L
    } else {
      first = R
    }
    par = gp[first]
    if (par === node) break
    if (!par) {
      zig(first, node, gp)
      gp = null
    } else {
      if (compare(node.value, par.value, node.key, par.key) < 0) {
        second = L
      } else {
        second = R
      }

      nextGp = par[second]

      if (first === second) {
        tmp = par[not[first]]
        par[not[first]] = gp
        gp[first] = tmp

        zig(first, node, par)
      } else {
        zig(first, node, gp)
        zig(second, node, par)
      }
      gp = nextGp
      if (gp === node) break
    }
  }
  return node
}
function zig (dir, state, node) {
  node[dir] = null
  if (state[not[dir]]) {
    var branch = state[not[dir]]
    while (branch[dir]) {
      branch = branch[dir]
    }
    branch[dir] = node
  } else {
    state[not[dir]] = node
  }
}

function place (key, val, compare, node, path) {
  var side = ''
  while (node) {
    path.push(node)
    if (compare(val, node.value, key, node.key) < 0) {
      side = 'left'
    } else {
      side = 'right'
    }
    node = node[side]
  }
  node = new Node(key, val)
  if (path.length) path[path.length - 1][side] = node
  path.push(node)
  return node
}

function lowest (node) {
  while (node && node[L]) {
    node = node[L]
  }
  return node
}

function highest (node) {
  while (node[R]) {
    node = node[R]
  }
  return node
}

function higher (tree) {
  var node = tree[R]
  if (!node) return node
  return lowest(node)
}

function lower (tree) {
  var node = tree[L]
  if (!node) return node
  return highest(node)
}

function Node (key, value, left, right) {
  this.value = value
  this.key = key
  this.left = left || null
  this.right = right || null
}
Node.prototype.copy = function () {
  return new Node(this.key, this.value, this.left, this.right)
}

// function splay (path, root) {
//   var par
//   var gp
//   var ggp
//   var tmp
//   while (true) {
//     par = path.pop()
//     gp = path.pop()
//     ggp = path[path.length - 1]
//     if (!par) break
//     if (root === par.right) {
//       tmp = root.left
//       root.left = par
//       par.right = tmp
//       if (gp && par === gp.right) {
//         tmp = par.left
//         par.left = gp
//         gp.right = tmp
//       } else if (gp) {
//         tmp = root.right
//         root.right = gp
//         gp.left = tmp
//       }
//     } else {
//       tmp = root.right
//       root.right = par
//       par.left = tmp
//       if (gp && par === gp.left) {
//         tmp = par.right
//         par.right = gp
//         gp.left = tmp
//       } else if (gp) {
//         tmp = root.left
//         root.left = gp
//         gp.right = tmp
//       }
//     }
//     if (!ggp) break
//     if (ggp.left === gp) {
//       ggp.left = root
//     } else {
//       ggp.right = root
//     }
//   }

//   return root
// }
