var L = 'left'
var R = 'right'
var not = {}
not[L] = R
not[R] = L

var gen = 0

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
  gen += 1
  return splay(place(root, node, fn))
}

function seqRead (root, cb) {
  gen += 1
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
  var tmp
  var first
  var second
  while (true) {
    second = path.pop()
    par = path.pop()
    if (!par) break
    par = par.copy()
    first = path.pop()
    gp = path.pop()
    if (gp) {
      gp = gp.copy()
    }
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
    // ggp[third] always gets thrown out on next iteration
    // third = path.pop()
    // ggp = path.pop()
    // if (!ggp) break
    // ggp = ggp.copy()
    // ggp[third] = newRoot
    // path.push(ggp)
    // path.push(third)
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

function highest (node) {
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
  this._generation = gen
}
Node.prototype.copy = function () {
  if (this._generation === gen) return this
  return new Node(this.key, this.value, this.left, this.right)
}
