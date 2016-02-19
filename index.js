var V = 'value'
var L = 'left'
var R = 'right'

var not = {}
not[L] = R
not[R] = L

// delete
// join

createTree.Node = Node
createTree.V = V
createTree.L = L
createTree.R = R
module.exports = createTree

function createTree (value) {
  return new Node(value)
}

function Node (value, left, right) {
  this.value = value
  this.left = left || null
  this.right = right || null
}

Node.prototype.insert = function insert (item, fn) {
  return splay(this.place(new Node(item), fn))
}

Node.prototype.remove = function remove (item, fn) {
  return splay(this.pluck(item, fn))
}

Node.prototype.forEach = function forEach (cb) {
  var idx = 0
  tree = this.first()
  cb(tree[V], idx++)

  while (tree = tree[R]) {
    tree = tree.first()
    cb(tree[V], idx++)
  }
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

Node.prototype.place = function place (toInsert, compare) {
  var path = []
  var side = ''
  var node = this
  while (node) {
    path.push(node.copy())
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

Node.prototype.pluck = function pluck (toDelete, compare) {
  var node = this
  var path = []
  var side = ''
  while (node) {
    path.push(node.copy())
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
  var result = splay(left.highest())
  result[R] = right
  return result
}

Node.prototype.unshift = function unshift (item) {
  var node = new Node(item)
  var path = this.lowest()
  path.push(L)
  path.push(node)
  return splay(path)
}

Node.prototype.shift = function shift () {
  return splay(this.lowest())[R]
}

Node.prototype.copy = function copy () {
  return new Node(this[V], this[L], this[R])
}

Node.prototype.higher = function higher () {
  var path = [this, R]
  var node = this[R]
  if (!node) return null
  return node.lowest(path)
}

Node.prototype.lower = function lower () {
  var path = [this, L]
  var node = this[L]
  if (!node) return path
  return node.highest(path)
}

Node.prototype.highest = function highest (path) {
  var node = this
  path || (path = [])
  path.push(this.copy())
  while (node[R]) {
    node = node[R]
    path.push(R)
    path.push(node.copy())
  }
  return path
}

Node.prototype.lowest = function lowest (path) {
  var node = this
  path || (path = [])
  path.push(node.copy())
  while (node && node[L]) {
    node = node[L]
    path.push(L)
    path.push(node.copy())
  }
  return path
}

Node.prototype.pop = function pop () {
  return splay(this.highest())[L]
}

Node.prototype.push = function push (item) {
  var node = new Node(item)
  var path = this.highest()
  path.push(R)
  path.push(node)
  return splay(path)
}

Node.prototype.first = function first () {
  if (this[L] == null) {
    return this
  }
  return splay(this.lowest())
}

Node.prototype.last = function last () {
  if (this[R] == null) {
    return this
  }
  return splay(this.highest())
}

Node.prototype.l = function () {
  return this.left
}

Node.prototype.r = function () {
  return this.right
}

Node.prototype.v = function () {
  return this.value
}

