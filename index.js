var not = {
  left: 'right',
  right: 'left'
}

module.exports = {
  insert: insert,
  seqRead: seqRead,
  Node: Node
}

function insert (root, node, fn) {
  var state = split(root, node, fn, { left: null, right: null })
  node.left = state.left
  node.right = state.right
  return node
}

function seqRead (root, fn) {
  var node = root
  var path = []

  while (node.left) {
    path.push(node)
    node = node.left
  }
  node = splay(path, node)
  fn(node)

  while (node.right) {
    path = [node]
    node = node.right
    while (node.left) {
      path.push(node)
      node = node.left
    }
    node = splay(path, node)
    fn(node)
  }
}

function splay (path, root) {
  var par
  var gp
  var ggp
  var tmp
  while (true) {
    par = path.pop()
    gp = path.pop()
    ggp = path[path.length - 1]
    if (!par) break
    if (root === par.right) {
      tmp = root.left
      root.left = par
      par.right = tmp
      if (gp && par === gp.right) {
        tmp = par.left
        par.left = gp
        gp.right = tmp
      } else if (gp) {
        tmp = root.right
        root.right = gp
        gp.left = tmp
      }
    } else {
      tmp = root.right
      root.right = par
      par.left = tmp
      if (gp && par === gp.left) {
        tmp = par.right
        par.right = gp
        gp.left = tmp
      } else if (gp) {
        tmp = root.left
        root.left = gp
        gp.right = tmp
      }
    }
    if (!ggp) break
    if (ggp.left === gp) {
      ggp.left = root
    } else {
      ggp.right = root
    }
  }

  return root
}

function split (gp, i, compare, state) {
  var tmp
  var par
  var node
  var first
  var second
  while (gp) {
    tmp = par = node = null
    first = second = ''
    if (compare(i.value, gp.value, i.key, gp.key) < 0) {
      first = 'left'
    } else {
      first = 'right'
    }
    par = gp[first]
    if (!par) {
      zig(first, state, gp)
      gp = null
    } else {
      if (compare(i.value, par.value, i.key, par.key) < 0) {
        second = 'left'
      } else {
        second = 'right'
      }

      node = par[second]

      if (first === second) {
        tmp = par[not[first]]
        par[not[first]] = gp
        gp[first] = tmp

        zig(first, state, par)
      } else {
        zig(first, state, gp)
        zig(second, state, par)
      }
      gp = node
    }
  }
  return state
}
function zig (dir, state, node) {
  node[dir] = null
  if (state[not[dir]]) {
    var branch = state[not[dir]]
    while (branch[dir]) {
      branch = branch[dir]
    }
    branch[dir] = node
  } else {
    state[not[dir]] = node
  }
}

function place (key, val, compare, node, path) {
  var side = ''
  while (node) {
    path.push(node)
    if (compare(val, node.value, key, node.key) < 0) {
      side = 'left'
    } else {
      side = 'right'
    }
    node = node[side]
  }
  node = new Node(key, val)
  if (path.length) path[path.length - 1][side] = node
  path.push(node)
  return node
}

function Node (key, value) {
  this.value = value
  this.key = key
  this.left = null
  this.right = null
}
