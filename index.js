var K = 'key'
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
  Node: Node,
  lower: lower,
  lowest: lowest,
  higher: higher,
  highest: highest,
  push: push,
  K: K,
  V: V,
  L: L,
  R: R
}

function insert (root, node, fn) {
  return splay(place(root, node, fn))
}

function remove (root, node, fn) {
  return splay(pluck(root, node, fn))
}

function seqRead (tree, cb) {
  tree = splay(lowest(tree))
  var quit = cb(tree)

  while (!quit && (tree = splay(higher(tree)))) {
    quit = cb(tree)
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
    path.push(node)
    if (compare(toInsert.value, node.value, toInsert.key, node.key) < 0) {
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
    path.push((node))
    if (compare(toDelete.value, node.value, toDelete.key, node.key) < 0) {
      side = L
    } else {
      side = R
    }
    node = node[side]
    if (node === toDelete) {
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

function push (tree, node) {
  if (!tree) return node
  var path = highest(tree)
  path.push(node)
  return splay(path)
}

function pop (tree) {
  var path = highest(tree)
  return splay(path)
}

function lowest (node, path) {
  path || (path = [])
  path.push(node)
  while (node && node[L]) {
    node = node[L]
    path.push(L)
    path.push(node)
  }
  return path
}

function highest (node, path) {
  path || (path = [])
  path.push(node)
  while (node[R]) {
    node = node[R]
    path.push(R)
    path.push(node)
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

function Node (key, value, left, right) {
  this.value = value
  this.key = key
  this.left = left || null
  this.right = right || null
}
