var test = require('tape')
var splay = require('./index')

function gt (a, b) { return a - b }

test('splay', function (t) {
  var tree = splay.insert(null, new splay.Node(1, 1), gt)
  t.equal(tree.value, 1, 'returns node')
  tree = splay.insert(tree, new splay.Node(2, 2), gt)
  t.equal(tree.value, 2, 'returns node again')
  t.equal(tree.left.value, 1, 'puts original value on left subtree')
  tree = splay.insert(tree, new splay.Node(3, 3), gt)
  t.equal(tree.left.left.value, 1, 'puts original value on left subtree')
  tree = splay.insert(tree, new splay.Node(0.5, 0.5), gt)
  t.equal(tree.right.value, 1, 'left-left tree')
  t.equal(tree.right.right.value, 2, 'left-left tree')

  splay.seqRead(tree).map(function (root) {
    return splay.seqRead(root)
  }).reduce(function (last, next) {
    t.same(last, next, 'all elements in the seqRead reprsent the same tree')
    return next
  })
  t.end()
})
