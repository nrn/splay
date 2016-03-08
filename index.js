var not = {
  right: 'left',
  left: 'right'
}

var empty = new SplayNode ()
empty.left = empty.right = empty
SplayNode.prototype.empty = empty

if (typeof Object.freeze === 'function') {
  Object.freeze(empty)
}

module.exports = createTree

function createTree (compare) {
  if (!compare) return empty

  function SpecificSplay (value, left, right) {
    this.value = value
    this.left = left || root
    this.right = right || root
  }
  SpecificSplay.prototype = new SplayNode()
  SpecificSplay.prototype.constructor = SpecificSplay
  SpecificSplay.prototype._compare = compare

  var root = new SpecificSplay()
  root.left = root.right = root
  SpecificSplay.prototype.empty = root


  if (typeof Object.freeze === 'function') {
    Object.freeze(root)
  }


  return root

}

function SplayNode (value, left, right) {
  this.value = value
  this.left = left || empty
  this.right = right || empty
}

SplayNode.prototype._compare = defCompare

SplayNode.prototype.access = function access (item) {
  var path = this._pathTo(item)
  return this._splay(path)
}

SplayNode.prototype._pathTo = function pathTo (item) {
  var node = this
  var path = []
  var side = ''
  var comp
  path.push(node.copy())
  while (!node.isEmpty()) {
    comp = this._compare(item, node.value)
    if (comp === 0) {
      break
    }
    if (comp < 0) {
      side = 'left'
    } else {
      side = 'right'
    }
    node = node[side]
    if (node.isEmpty()) {
      break
    }
    path.push(side)
    path.push(node.copy())
  }
  return path
}

SplayNode.prototype.insert = function insert (item) {
  return this._splay(this._place(new this.constructor(item)))
}

SplayNode.prototype.remove = function remove (item, fn) {
  return this._splay(this._pluck(item))
}

SplayNode.prototype.forEach = function forEach (cb) {
  var idx = 0
  var tree = this.first()
  cb(tree.value, idx++)

  tree = tree.right
  while (!tree.isEmpty()) {
    tree = tree.first()
    cb(tree.value, idx++)
    tree = tree.right
  }
}

SplayNode.prototype.join = function join (right) {
  var left = this
  if (left.isEmpty()) {
    return right
  }
  var result = this._splay(left._highest())
  result.right = right
  return result
}

SplayNode.prototype.split = function (item) {
  var more = this.access(item)
  var less = more.left
  more.left = this.empty
  return [ less, more ]
}

SplayNode.prototype.uInsert = function (item) {
  var root = this.access(item)
  if (this._compare(item, root.value) === 0) {
    root.value = item
    return root
  } else {
    return this.insert(item)
  }
}

SplayNode.prototype.isEmpty = function isEmpty () {
  return (this === this.right && this === this.left)
}

SplayNode.prototype.first = function first () {
  if (this.left.isEmpty()) {
    return this
  }
  return this._splay(this._lowest())
}

SplayNode.prototype.last = function last () {
  if (this.right.isEmpty()) {
    return this
  }
  return this._splay(this._highest())
}

SplayNode.prototype.unshift = function unshift (item) {
  var path = this._lowest()
  path.push('left')
  path.push(new this.constructor(item))
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
  path.push(new this.constructor(item))
  return this._splay(path)
}

SplayNode.prototype._splay = function _splay (path) {
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

SplayNode.prototype._place = function _place (toInsert) {
  var path = []
  var side = ''
  var node = this
  while (!node.isEmpty()) {
    path.push(node.copy())
    if (this._compare(toInsert.value, node.value) < 0) {
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

SplayNode.prototype._pluck = function _pluck (toDelete) {
  var node = this
  var path = []
  var side = ''
  while (!node.isEmpty()) {
    path.push(node.copy())
    if (this._compare(toDelete, node.value) < 0) {
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
  return new this.constructor(this.value, this.left, this.right)
}

SplayNode.prototype._higher = function _higher () {
  var path = [this.copy(), 'right']
  var node = this.right
  if (node.isEmpty()) return this
  path.push(this.right.copy())
  return node._lowest(path)
}

SplayNode.prototype._lower = function _lower () {
  var path = [this.copy(), 'left']
  var node = this.left
  if (node.isEmpty()) return path
  return node._highest(path)
}

SplayNode.prototype._highest = function _highest (path) {
  var node = this
  path || (path = [])
  path.push(this.copy())
  while (!node.right.isEmpty()) {
    node = node.right
    path.push('right')
    path.push(node.copy())
  }
  return path
}

SplayNode.prototype._lowest = function _lowest (path) {
  path || (path = [ this.copy() ])
  var node = path[path.length - 1]
  while (!node.left.isEmpty()) {
    node = node.left
    path.push('left')
    path.push(node.copy())
  }
  return path
}

function defCompare (a, b) {
  var stringA = String(a)
  var stringB = String(b)
  if (stringA === stringB) {
    return 0
  }
  return stringA > stringB ? 1 : - 1
}

