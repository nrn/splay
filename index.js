var not = {
  right: 'left',
  left: 'right'
}

var empty = new Node ()
empty.left = empty
empty.right = empty

if (typeof Object.freeze === 'function') {
  Object.freeze(empty)
}

createTree.Node = Node
createTree.empty = empty
module.exports = createTree

function createTree (value) {
  if (typeof value === 'undefined') {
    return empty
  }
  return new Node(value)
}

function Node (value, left, right) {
  this.value = value
  this.left = left || empty
  this.right = right || empty
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
  cb(tree.value, idx++)

  tree = tree.right
  while (tree !== empty) {
    tree = tree.first()
    cb(tree.value, idx++)
    tree = tree.right
  }
}

function splay (path) {
  if (!path) return empty
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
  while (node !== empty) {
    path.push(node.copy())
    if (compare(toInsert.value, node.value) < 0) {
      side = 'left'
    } else {
      side = 'right'
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
  while (node !== empty) {
    path.push(node.copy())
    if (compare(toDelete, node.value) < 0) {
      side = 'left'
    } else {
      side = 'right'
    }
    node = node[side]
    if (toDelete === node.value) {
      break
    }
    path.push(side)
  }
  path[path.length -1][side] = node.left.join(node.right)
  return path
}

Node.prototype.join = function join (right) {
  var left = this
  if (left === empty) {
    return right
  }
  var result = splay(left.highest())
  result.right = right
  return result
}

Node.prototype.unshift = function unshift (item) {
  var node = new Node(item)
  var path = this.lowest()
  path.push('left')
  path.push(node)
  return splay(path)
}

Node.prototype.shift = function shift () {
  return splay(this.lowest()).right
}

Node.prototype.copy = function copy () {
  return new Node(this.value, this.left, this.right)
}

Node.prototype.higher = function higher () {
  var path = [this, 'right']
  var node = this.right
  if (node === empty) return empty
  return node.lowest(path)
}

Node.prototype.lower = function lower () {
  var path = [this, 'left']
  var node = this.left
  if (node === empty) return path
  return node.highest(path)
}

Node.prototype.highest = function highest (path) {
  var node = this
  path || (path = [])
  path.push(this.copy())
  while (node.right !== empty) {
    node = node.right
    path.push('right')
    path.push(node.copy())
  }
  return path
}

Node.prototype.lowest = function lowest (path) {
  var node = this
  path || (path = [])
  path.push(node.copy())
  while (node.left !== empty) {
    node = node.left
    path.push('left')
    path.push(node.copy())
  }
  return path
}

Node.prototype.pop = function pop () {
  return splay(this.highest()).left
}

Node.prototype.push = function push (item) {
  var node = new Node(item)
  var path = this.highest()
  path.push('right')
  path.push(node)
  return splay(path)
}

Node.prototype.first = function first () {
  if (this.left === empty) {
    return this
  }
  return splay(this.lowest())
}

Node.prototype.last = function last () {
  if (this.right === empty) {
    return this
  }
  return splay(this.highest())
}

