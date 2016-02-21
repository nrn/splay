var not = {
  right: 'left',
  left: 'right'
}

var empty = new SplayNode ()
empty.left = empty
empty.right = empty

if (typeof Object.freeze === 'function') {
  Object.freeze(empty)
}

createTree.SplayNode = SplayNode
createTree.empty = empty
createTree.createTree = createTree
module.exports = createTree

function createTree (value) {
  if (typeof value === 'undefined') {
    return empty
  }
  return new SplayNode(value)
}

function SplayNode (value, left, right) {
  this.value = value
  this.left = left || empty
  this.right = right || empty
}

SplayNode.prototype.insert = function insert (item, fn) {
  return this._splay(this._place(new SplayNode(item), fn))
}

SplayNode.prototype.remove = function remove (item, fn) {
  return this._splay(this._pluck(item, fn))
}

SplayNode.prototype.forEach = function forEach (cb) {
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

SplayNode.prototype.join = function join (right) {
  var left = this
  if (left === empty) {
    return right
  }
  var result = this._splay(left._highest())
  result.right = right
  return result
}

SplayNode.prototype.isEmpty = function isEmpty () {
  return this === empty
}

SplayNode.prototype.first = function first () {
  if (this.left === empty) {
    return this
  }
  return this._splay(this._lowest())
}

SplayNode.prototype.last = function last () {
  if (this.right === empty) {
    return this
  }
  return this._splay(this._highest())
}

SplayNode.prototype.unshift = function unshift (item) {
  var path = this._lowest()
  path.push('left')
  path.push(new SplayNode(item))
  return this._splay(path)
}

SplayNode.prototype.shift = function shift () {
  return this._splay(this._lowest()).right
}

SplayNode.prototype.pop = function pop () {
  return this._splay(this._highest()).left
}

SplayNode.prototype.push = function push (item) {
  var path = this._highest()
  path.push('right')
  path.push(new SplayNode(item))
  return this._splay(path)
}

SplayNode.prototype._splay = function _splay (path) {
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

SplayNode.prototype._place = function _place (toInsert, compare) {
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

SplayNode.prototype._pluck = function _pluck (toDelete, compare) {
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

SplayNode.prototype.copy = function copy () {
  return new SplayNode(this.value, this.left, this.right)
}

SplayNode.prototype._higher = function _higher () {
  var path = [this, 'right']
  var node = this.right
  if (node === empty) return empty
  return node._lowest(path)
}

SplayNode.prototype._lower = function _lower () {
  var path = [this, 'left']
  var node = this.left
  if (node === empty) return path
  return node._highest(path)
}

SplayNode.prototype._highest = function _highest (path) {
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

SplayNode.prototype._lowest = function _lowest (path) {
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

