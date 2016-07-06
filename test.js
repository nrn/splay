var test = require('tape')
var splay = require('./index')

function gt (a, b) { return a - b }

test('splay', function (t) {
  var tree = splay(gt)
  var orig = tree
  t.ok(tree.isEmpty(), 'Created the empty tree')
  t.equal(tree.value, undefined, 'empty tree value is undefined')
  tree = tree.insert(1)
  t.equal(tree.value, 1, 'returns node')
  var two = 2
  tree = tree.insert(two)
  t.equal(tree.value, 2, 'returns node again')
  t.equal(tree.left.value, 1, 'puts original value on left subtree')
  tree = tree.insert(3)
  t.equal(tree.left.left.value, 1, 'puts original value on left subtree')
  tree = tree.insert(4)
  t.equal(tree.left.left.left.value, 1, 'puts original value on left subtree')
  tree = tree.insert(5)
  t.equal(tree.left.left.left.left.value, 1, 'puts original value on left subtree')
  tree = tree.insert(0.5)
  t.equal(tree.right.value, 5, 'left-left tree')
  t.equal(tree.right.left.value, 3, 'left-left tree')
  t.ok(tree.split(2)[0].value < 2, 'left tree smaller')
  t.equal(tree.access(2).value, 2, 'two is there')
  t.same(tree.find(2), [2], 'finds a two')
  t.same(tree.find(2, 4), [2, 3, 4], 'finds 2 through 4')
  t.same(tree.find(2, 4, true), [4, 3, 2], 'also in reverse')
  // tree = tree.insert(2)
  tree = tree.remove(2)
  t.notEqual(tree.access(2).value, 2, 'two is not there')

  t.equal(
    tree.left.left.left.left.left.left.right.left.right.left.left.right.left,
    orig,
    'everything is empty at the end'
  )

  var res = []
  tree.forEach(function (item) {
    res.push(item)
  })
  orig.forEach(function (item) {
    // never called in empty tree
    throw new Error('Empty tree called foreach cb')
  })
  t.same(res, [0.5, 1, 3, 4, 5], 'sequential read')

  // Show working with multiple items with same comparison value.
  var strTree = splay()
  strTree = strTree.uInsert('1')
  strTree = strTree.uInsert('2')
  var oldStrTree = strTree = strTree.uInsert(3)
  strTree = strTree.uInsert('3')
  strTree = strTree.uInsert(2)
  var strVals = []
  strTree.forEach(function (item) {
    strVals.push(item)
  })
  var oldVals = []
  oldStrTree.forEach(function (item) {
    oldVals.push(item)
  })
  t.same(oldVals, ['1', '2', 3], 'sequential read of oldStrTree')
  t.same(strVals, ['1', 2, '3'], 'sequential read of strTree')

  t.end()
})
test('remove', function (t) {
  var tree1 = splay()
  tree1 = tree1.insert(1)
  tree1 = tree1.remove(1)
  t.ok(tree1.isEmpty(), 'remove single item')

  var tree2 = splay()
  tree2 = tree2.insert(2)
  tree2 = tree2.insert(2)
  tree2 = tree2.remove(2)
  var res = []
  tree2.forEach(function (v) {
    res.push(v)
  })
  t.same(res, [2])

  t.end()
})

test('deque', function (t) {
  var tree = splay().insert(1)
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
  var lotsB = new Array(j)
  lotsQ.forEach(function (val, i) {
    lotsB[i] = val
  })
  console.log('# ' + (Date.now() - time))
  time = Date.now()
  var tree = lots.reduce(function (root, value) {
    return root.insert(value)
  }, splay(gt))
  var lotsA = new Array(j)
  tree.forEach(function (val, i) {
    lotsA[i] = val
  })
  console.log('# ' + (Date.now() - time))
  t.same(lotsA, lotsQ, 'Sorts the same as native sort')

  t.end()
})
