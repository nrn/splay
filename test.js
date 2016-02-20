var test = require('tape')
var splay = require('./index')

function gt (a, b) { return a - b }

test('splay', function (t) {
  var tree = splay()
  t.equal(tree, splay.empty, 'Created the empty tree')
  t.equal(tree.value, undefined, 'empty tree value is undefined')
  tree = tree.insert(1, gt)
  t.equal(tree.value, 1, 'returns node')
  var two = 2
  tree = tree.insert(two, gt)
  t.equal(tree.value, 2, 'returns node again')
  t.equal(tree.left.value, 1, 'puts original value on left subtree')
  tree = tree.insert(3, gt)
  t.equal(tree.left.left.value, 1, 'puts original value on left subtree')
  tree = tree.insert(4, gt)
  t.equal(tree.left.left.left.value, 1, 'puts original value on left subtree')
  tree = tree.insert(5, gt)
  t.equal(tree.left.left.left.left.value, 1, 'puts original value on left subtree')
  tree = tree.insert(0.5, gt)
  t.equal(tree.right.value, 5, 'left-left tree')
  t.equal(tree.right.left.value, 3, 'left-left tree')
  tree = tree.remove(2, gt)

  t.equal(
    tree.left.left.left.left.left.left.right.left.right.left.left.right.left,
    splay.empty,
    'everything is empty at the end'
  )

  var res = []
  tree.forEach(function (item) {
    res.push(item)
  })
  t.same(res, [0.5, 1, 3, 4, 5], 'sequential read')

  t.end()
})

test('deque', function (t) {
  var tree = splay(1)
  t.equal(tree.value, 1, 'returns node')
  tree = tree.push(2)
  tree = tree.push(3)
  tree = tree.push(4)
  tree = tree.push(5)
  t.equal(tree.value, 5, 'returns node')
  tree = tree.first()
  t.equal(tree.value, 1, 'returns node')
  tree = tree.pop()
  tree = tree.last()
  t.equal(tree.value, 4, 'returns node')
  tree = tree.first()
  t.equal(tree.value, 1, 'returns node')
  tree = tree.shift()
  tree = tree.first()
  t.equal(tree.value, 2, 'returns node')

  t.end()
})

test('perf', function (t) {
  var j = 300000
  // 1350 @300k
  var lots = new Array(j)
  var lotsQ = new Array(j)
  for (var i = 0; i < j; i++) {
    lotsQ[i] = lots[i] = Math.random() * j
  }
  var time = Date.now()
  lotsQ.sort(function (a, b) { return a - b })
  console.log('# ' + (Date.now() - time))
  time = Date.now()
  var tree = lots.reduce(function (root, value) {
    if (!root) return splay(value)
    return root.insert(value, gt)
  }, null)
  var lotsA = new Array(j)
  tree.forEach(function (val, i) {
    lotsA[i] = val
  })
  console.log('# ' + (Date.now() - time))
  t.same(lotsA, lotsQ, 'Sorts the same as native sort')

  t.end()
})
