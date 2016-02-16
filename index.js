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
  return splay(place(root, node, fn))
}

function seqRead (root, cb) {
  var all = []
  root = splay(lowest(root))
  all.push(root)

  while (root = splay(higher(root))) {
    all.push(root)
  }
  return all
}

function splay (path) {
  if (!path) return null
  var newRoot = path.pop().copy()
  var par
  var gp
  var ggp
  var tmp
  while (true) {
    par = path.pop()
    if (!par) break
    par = par.copy()
    gp = path.pop()
    if (gp) {
      gp = gp.copy()
    }
    if (newRoot.same(par.right)) {
      tmp = newRoot.left
      newRoot.left = par
      par.right = tmp
      if (gp && par.same(gp.right)) {
        tmp = par.left
        par.left = gp
        gp.right = tmp
      } else if (gp) {
        tmp = newRoot.right
        newRoot.right = gp
        gp.left = tmp
      }
    } else {
      tmp = newRoot.right
      newRoot.right = par
      par.left = tmp
      if (gp && par.same(gp.left)) {
        tmp = par.right
        par.right = gp
        gp.left = tmp
      } else if (gp) {
        tmp = newRoot.left
        newRoot.left = gp
        gp.right = tmp
      }
    }
    gpp = path.pop()
    if (!ggp) break
    gpp = gpp.copy()
    if (gp.same(ggp.left)) {
      ggp.left = newRoot
    } else {
      ggp.right = newRoot
    }
    path.push(gpp)
  }

  return newRoot
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

function place (node, toInsert, compare) {
  var path = []
  var side = ''
  while (node) {
    path.push(node)
    if (compare(toInsert.value, node.value, toInsert.key, node.key) < 0) {
      side = 'left'
    } else {
      side = 'right'
    }
    node = node[side]
  }
  if (path.length) path[path.length - 1][side] = toInsert
  path.push(toInsert)
  return path
}

function lowest (node, path) {
  path || (path = [])
  path.push(node)
  while (node && node[L]) {
    node = node[L]
    path.push(node)
  }
  return path
}

function highest (node) {
  path || (path = [])
  path.push(node)
  while (node[R]) {
    node = node[R]
    path.push(node)
  }
  return path
}

function higher (tree) {
  var path = [tree]
  var node = tree[R]
  if (!node) return null
  return lowest(node, path)
}

function lower (tree) {
  var path = [tree]
  var node = tree[L]
  if (!node) return path
  return highest(node, path)
}

function Node (key, value, left, right, id) {
  this.value = value
  this.key = key
  this.left = left || null
  this.right = right || null
  this._id = id || Math.random()
}
Node.prototype.copy = function () {
  return new Node(this.key, this.value, this.left, this.right, this._id)
}
Node.prototype.same = function (node) {
  return node && node._id === this._id
}

