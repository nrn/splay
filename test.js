var test = require('tape')
var splay = require('./index')

function gt (a, b) { return a - b }

test('splay', function (t) {
  var tree = splay.insert(null, new splay.Node(1, 1), gt)
  t.equal(tree[splay.V], 1, 'returns node')
  var two = new splay.Node(2, 2)
  tree = splay.insert(tree, two, gt)
  t.equal(tree[splay.V], 2, 'returns node again')
  t.equal(tree[splay.L][splay.V], 1, 'puts original value on left subtree')
  tree = splay.insert(tree, new splay.Node(3, 3), gt)
  t.equal(tree[splay.L][splay.L][splay.V], 1, 'puts original value on left subtree')
  tree = splay.insert(tree, new splay.Node(4, 4), gt)
  t.equal(tree[splay.L][splay.L][splay.L][splay.V], 1, 'puts original value on left subtree')
  tree = splay.insert(tree, new splay.Node(5, 5), gt)
  t.equal(tree[splay.L][splay.L][splay.L][splay.L][splay.V], 1, 'puts original value on left subtree')
  tree = splay.insert(tree, new splay.Node(0.5, 0.5), gt)
  t.equal(tree[splay.R][splay.V], 5, 'left-left tree')
  t.equal(tree[splay.R][splay.L][splay.V], 3, 'left-left tree')

  var res = []
  splay.seqRead(tree, function (node) {
    res.push(node[splay.V])
  })
  t.same(res, [0.5, 1, 2, 3, 4, 5], 'sequential read')


  t.end()
})

test('deque', function (t) {
  var tree = splay.push(null, new splay.Node(1, 1))
  t.equal(tree[splay.V], 1, 'returns node')
  t.end()
})
