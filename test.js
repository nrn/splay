var test = require('tape')
var splay = require('./index')

function gt (a, b) { return a - b }

test('splay', function (t) {
  var tree = splay.insert(null, 1, gt)
  t.equal(tree[splay.V], 1, 'returns node')
  var two = 2
  tree = splay.insert(tree, two, gt)
  t.equal(tree[splay.V], 2, 'returns node again')
  t.equal(tree[splay.L][splay.V], 1, 'puts original value on left subtree')
  tree = splay.insert(tree, 3, gt)
  t.equal(tree[splay.L][splay.L][splay.V], 1, 'puts original value on left subtree')
  tree = splay.insert(tree, 4, gt)
  t.equal(tree[splay.L][splay.L][splay.L][splay.V], 1, 'puts original value on left subtree')
  tree = splay.insert(tree, 5, gt)
  t.equal(tree[splay.L][splay.L][splay.L][splay.L][splay.V], 1, 'puts original value on left subtree')
  tree = splay.insert(tree, 0.5, gt)
  t.equal(tree[splay.R][splay.V], 5, 'left-left tree')
  t.equal(tree[splay.R][splay.L][splay.V], 3, 'left-left tree')

  var res = []
  splay.forEach(tree, function (item) {
    res.push(item)
  })
  t.same(res, [0.5, 1, 2, 3, 4, 5], 'sequential read')

  t.end()
})

test('deque', function (t) {
  var tree = splay.push(null, 1)
  t.equal(tree[splay.V], 1, 'returns node')
  tree = splay.push(tree, 2)
  tree = splay.push(tree, 3)
  tree = splay.push(tree, 4)
  tree = splay.push(tree, 5)
  t.equal(tree[splay.V], 5, 'returns node')
  tree = splay.first(tree)
  t.equal(tree[splay.V], 1, 'returns node')
  tree = splay.pop(tree)
  tree = splay.last(tree)
  t.equal(tree[splay.V], 4, 'returns node')
  tree = splay.first(tree)
  t.equal(tree[splay.V], 1, 'returns node')
  tree = splay.shift(tree)
  tree = splay.first(tree)
  t.equal(tree[splay.V], 2, 'returns node')

  t.end()
})
