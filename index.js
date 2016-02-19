var V = 'value'
var L = 'left'
var R = 'right'

var not = {}
not[L] = R
not[R] = L

// delete
// join

module.exports = {
  insert: insert,
  remove: remove,
  seqRead: seqRead,
  forEach: seqRead,
  Node: Node,
  lower: lower,
  lowest: lowest,
  higher: higher,
  highest: highest,
  last: last,
  first: first,
  push: push,
  pop: pop,
  shift: shift,
  unshift: unshift,
  V: V,
  L: L,
  R: R
}

function insert (root, item, fn) {
  return splay(place(root, new Node(item), fn))
}

function remove (root, item, fn) {
  return splay(pluck(root, item, fn))
}

function seqRead (tree, cb) {
  tree = splay(lowest(tree))
  var quit = cb(tree[V])

  while (!quit && (tree = splay(higher(tree)))) {
    quit = cb(tree[V])
  }
  return tree
}

function splay (path) {
  if (!path) return null
  var newRoot = path.pop()
  var par
  var gp
  var tmp
  var first
  var second
  while (true) {
    second = path.pop()
    par = path.pop()
    if (!par) break
    first = path.pop()
    gp = path.pop()
    tmp = newRoot[not[second]]
    newRoot[not[second]] = par
    par[second] = tmp
    if (first === second) {
      tmp = par[not[first]]
      par[not[first]] = gp
      gp[first] = tmp
    } else if (first === not[second]) {
      tmp = newRoot[not[first]]
      newRoot[not[first]] = gp
      gp[first] = tmp
    }
  }

  return newRoot
}

function place (node, toInsert, compare) {
  var path = []
  var side = ''
  while (node) {
    path.push(copyNode(node))
    if (compare(toInsert[V], node[V]) < 0) {
      side = L
    } else {
      side = R
    }
    node = node[side]
    path.push(side)
  }
  path.push(toInsert)
  return path
}

function pluck (node, toDelete, compare) {
  var path = []
  var side = ''
  while (node) {
    path.push(copyNode(node))
    if (compare(toDelete, node.value) < 0) {
      side = L
    } else {
      side = R
    }
    node = node[side]
    if (toDelete === node.value) {
      break
    }
    path.push(side)
  }
  path[path.length -1][side] = join(node[L], node[R])
  return path
}

function join (left, right) {
  if (!left) {
    return right
  }
  var result = splay(highest(left))
  result[R] = right
  return result
}

function push (tree, item) {
  var node = new Node(item)
  if (!tree) return node
  var path = highest(tree)
  path.push(R)
  path.push(node)
  return splay(path)
}

function pop (tree) {
  return splay(highest(tree))[L]
}

function unshift (tree, item) {
  var node = new Node(item)
  if (!tree) return node
  var path = lowest(tree)
  path.push(L)
  path.push(node)
  return splay(path)
}

function shift (tree) {
  return splay(lowest(tree))[R]
}

function lowest (node, path) {
  path || (path = [])
  path.push(copyNode(node))
  while (node && node[L]) {
    node = node[L]
    path.push(L)
    path.push(copyNode(node))
  }
  return path
}

function last (tree) {
  if (tree[R] == null) {
    return tree
  }
  return splay(highest(tree))
}

function first (tree) {
  if (tree[L] == null) {
    return tree
  }
  return splay(lowest(tree))
}

function highest (node, path) {
  path || (path = [])
  path.push(copyNode(node))
  while (node[R]) {
    node = node[R]
    path.push(R)
    path.push(copyNode(node))
  }
  return path
}

function higher (tree) {
  var path = [tree, R]
  var node = tree[R]
  if (!node) return null
  return lowest(node, path)
}

function lower (tree) {
  var path = [tree, L]
  var node = tree[L]
  if (!node) return path
  return highest(node, path)
}

function Node (value, left, right) {
  this.value = value
  this.left = left || null
  this.right = right || null
}
function copyNode (node) {
  if (node == null) return node
  return new Node(node[V], node[L], node[R])
}

