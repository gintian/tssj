!function(t) {
  var n = {}

  function i(e) {
    if (n[e]) return n[e].exports
    var a = n[e] = { i: e, l: !1, exports: {} }
    return t[e].call(a.exports, a, a.exports, i), a.l = !0, a.exports
  }

  i.m = t, i.c = n, i.d = function(t, n, e) {
    i.o(t, n) || Object.defineProperty(t, n, { enumerable: !0, get: e })
  }, i.r = function(t) {
    'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(t, '__esModule', { value: !0 })
  }, i.t = function(t, n) {
    if (1 & n && (t = i(t)), 8 & n) return t
    if (4 & n && 'object' == typeof t && t && t.__esModule) return t
    var e = Object.create(null)
    if (i.r(e), Object.defineProperty(e, 'default', {
      enumerable: !0,
      value: t
    }), 2 & n && 'string' != typeof t) {
      for (var a in t) {
        i.d(e, a, function(n) {
          return t[n]
        }.bind(null, a))
      }
    }
    return e
  }, i.n = function(t) {
    var n = t && t.__esModule ? function() {
      return t.default
    } : function() {
      return t
    }
    return i.d(n, 'a', n), n
  }, i.o = function(t, n) {
    return Object.prototype.hasOwnProperty.call(t, n)
  }, i.p = '', i(i.s = 0)
}([function(t, n, i) {
  var e = i(1), a = i(3)
  window.L.CanvasIconLayer = a(L), window.rbush = e
}, function(t, n, i) {
  'use strict'
  t.exports = a, t.exports.default = a
  var e = i(2)

  function a(t, n) {
    if (!(this instanceof a)) return new a(t, n)
    this._maxEntries = Math.max(4, t || 9), this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)), n && this._initFormat(n), this.clear()
  }

  function o(t, n, i) {
    if (!i) return n.indexOf(t)
    for (var e = 0; e < n.length; e++) if (i(t, n[e])) return e
    return -1
  }

  function r(t, n) {
    s(t, 0, t.children.length, n, t)
  }

  function s(t, n, i, e, a) {
    a || (a = d(null)), a.minX = 1 / 0, a.minY = 1 / 0, a.maxX = -1 / 0, a.maxY = -1 / 0
    for (var o, r = n; r < i; r++) o = t.children[r], h(a, t.leaf ? e(o) : o)
    return a
  }

  function h(t, n) {
    return t.minX = Math.min(t.minX, n.minX), t.minY = Math.min(t.minY, n.minY), t.maxX = Math.max(t.maxX, n.maxX), t.maxY = Math.max(t.maxY, n.maxY), t
  }

  function c(t, n) {
    return t.minX - n.minX
  }

  function l(t, n) {
    return t.minY - n.minY
  }

  function m(t) {
    return (t.maxX - t.minX) * (t.maxY - t.minY)
  }

  function u(t) {
    return t.maxX - t.minX + (t.maxY - t.minY)
  }

  function _(t, n) {
    return t.minX <= n.minX && t.minY <= n.minY && n.maxX <= t.maxX && n.maxY <= t.maxY
  }

  function f(t, n) {
    return n.minX <= t.maxX && n.minY <= t.maxY && n.maxX >= t.minX && n.maxY >= t.minY
  }

  function d(t) {
    return { children: t, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 }
  }

  function p(t, n, i, a, o) {
    for (var r, s = [n, i]; s.length;) (i = s.pop()) - (n = s.pop()) <= a || (r = n + Math.ceil((i - n) / a / 2) * a, e(t, r, n, i, o), s.push(n, r, r, i))
  }

  a.prototype = {
    all: function() {
      return this._all(this.data, [])
    }, search: function(t) {
      var n = this.data, i = [], e = this.toBBox
      if (!f(t, n)) return i
      for (var a, o, r, s, h = []; n;) {
        for (a = 0, o = n.children.length; a < o; a++) r = n.children[a], f(t, s = n.leaf ? e(r) : r) && (n.leaf ? i.push(r) : _(t, s) ? this._all(r, i) : h.push(r))
        n = h.pop()
      }
      return i
    }, collides: function(t) {
      var n = this.data, i = this.toBBox
      if (!f(t, n)) return !1
      for (var e, a, o, r, s = []; n;) {
        for (e = 0, a = n.children.length; e < a; e++) {
          if (o = n.children[e], f(t, r = n.leaf ? i(o) : o)) {
            if (n.leaf || _(t, r)) return !0
            s.push(o)
          }
        }
        n = s.pop()
      }
      return !1
    }, load: function(t) {
      if (!t || !t.length) return this
      if (t.length < this._minEntries) {
        for (var n = 0, i = t.length; n < i; n++) this.insert(t[n])
        return this
      }
      var e = this._build(t.slice(), 0, t.length - 1, 0)
      if (this.data.children.length) {
        if (this.data.height === e.height) {
          this._splitRoot(this.data, e)
        } else {
          if (this.data.height < e.height) {
            var a = this.data
            this.data = e, e = a
          }
          this._insert(e, this.data.height - e.height - 1, !0)
        }
      } else {
        this.data = e
      }
      return this
    }, insert: function(t) {
      return t && this._insert(t, this.data.height - 1), this
    }, clear: function() {
      return this.data = d([]), this
    }, remove: function(t, n) {
      if (!t) return this
      for (var i, e, a, r, s = this.data, h = this.toBBox(t), c = [], l = []; s || c.length;) {
        if (s || (s = c.pop(), e = c[c.length - 1], i = l.pop(), r = !0), s.leaf && -1 !== (a = o(t, s.children, n))) return s.children.splice(a, 1), c.push(s), this._condense(c), this
        r || s.leaf || !_(s, h) ? e ? (i++, s = e.children[i], r = !1) : s = null : (c.push(s), l.push(i), i = 0, e = s, s = s.children[0])
      }
      return this
    }, toBBox: function(t) {
      return t
    }, compareMinX: c, compareMinY: l, toJSON: function() {
      return this.data
    }, fromJSON: function(t) {
      return this.data = t, this
    }, _all: function(t, n) {
      for (var i = []; t;) t.leaf ? n.push.apply(n, t.children) : i.push.apply(i, t.children), t = i.pop()
      return n
    }, _build: function(t, n, i, e) {
      var a, o = i - n + 1, s = this._maxEntries
      if (o <= s) return r(a = d(t.slice(n, i + 1)), this.toBBox), a
      e || (e = Math.ceil(Math.log(o) / Math.log(s)), s = Math.ceil(o / Math.pow(s, e - 1))), (a = d([])).leaf = !1, a.height = e
      var h, c, l, m, u = Math.ceil(o / s), _ = u * Math.ceil(Math.sqrt(s))
      for (p(t, n, i, _, this.compareMinX), h = n; h <= i; h += _) for (p(t, h, l = Math.min(h + _ - 1, i), u, this.compareMinY), c = h; c <= l; c += u) m = Math.min(c + u - 1, l), a.children.push(this._build(t, c, m, e - 1))
      return r(a, this.toBBox), a
    }, _chooseSubtree: function(t, n, i, e) {
      for (var a, o, r, s, h, c, l, u, _, f; e.push(n), !n.leaf && e.length - 1 !== i;) {
        for (l = u = 1 / 0, a = 0, o = n.children.length; a < o; a++) h = m(r = n.children[a]), _ = t, f = r, (c = (Math.max(f.maxX, _.maxX) - Math.min(f.minX, _.minX)) * (Math.max(f.maxY, _.maxY) - Math.min(f.minY, _.minY)) - h) < u ? (u = c, l = h < l ? h : l, s = r) : c === u && h < l && (l = h, s = r)
        n = s || n.children[0]
      }
      return n
    }, _insert: function(t, n, i) {
      var e = this.toBBox, a = i ? t : e(t), o = [], r = this._chooseSubtree(a, this.data, n, o)
      for (r.children.push(t), h(r, a); n >= 0 && o[n].children.length > this._maxEntries;) this._split(o, n), n--
      this._adjustParentBBoxes(a, o, n)
    }, _split: function(t, n) {
      var i = t[n], e = i.children.length, a = this._minEntries
      this._chooseSplitAxis(i, a, e)
      var o = this._chooseSplitIndex(i, a, e), s = d(i.children.splice(o, i.children.length - o))
      s.height = i.height, s.leaf = i.leaf, r(i, this.toBBox), r(s, this.toBBox), n ? t[n - 1].children.push(s) : this._splitRoot(i, s)
    }, _splitRoot: function(t, n) {
      this.data = d([t, n]), this.data.height = t.height + 1, this.data.leaf = !1, r(this.data, this.toBBox)
    }, _chooseSplitIndex: function(t, n, i) {
      var e, a, o, r, h, c, l, u, _, f, d, p, x, g
      for (c = l = 1 / 0, e = n; e <= i - n; e++) a = s(t, 0, e, this.toBBox), o = s(t, e, i, this.toBBox), _ = a, f = o, void 0, void 0, void 0, void 0, d = Math.max(_.minX, f.minX), p = Math.max(_.minY, f.minY), x = Math.min(_.maxX, f.maxX), g = Math.min(_.maxY, f.maxY), r = Math.max(0, x - d) * Math.max(0, g - p), h = m(a) + m(o), r < c ? (c = r, u = e, l = h < l ? h : l) : r === c && h < l && (l = h, u = e)
      return u
    }, _chooseSplitAxis: function(t, n, i) {
      var e = t.leaf ? this.compareMinX : c, a = t.leaf ? this.compareMinY : l
      this._allDistMargin(t, n, i, e) < this._allDistMargin(t, n, i, a) && t.children.sort(e)
    }, _allDistMargin: function(t, n, i, e) {
      t.children.sort(e)
      var a, o, r = this.toBBox, c = s(t, 0, n, r), l = s(t, i - n, i, r), m = u(c) + u(l)
      for (a = n; a < i - n; a++) o = t.children[a], h(c, t.leaf ? r(o) : o), m += u(c)
      for (a = i - n - 1; a >= n; a--) o = t.children[a], h(l, t.leaf ? r(o) : o), m += u(l)
      return m
    }, _adjustParentBBoxes: function(t, n, i) {
      for (var e = i; e >= 0; e--) h(n[e], t)
    }, _condense: function(t) {
      for (var n, i = t.length - 1; i >= 0; i--) 0 === t[i].children.length ? i > 0 ? (n = t[i - 1].children).splice(n.indexOf(t[i]), 1) : this.clear() : r(t[i], this.toBBox)
    }, _initFormat: function(t) {
      var n = ['return a', ' - b', ';']
      this.compareMinX = new Function('a', 'b', n.join(t[0])), this.compareMinY = new Function('a', 'b', n.join(t[1])), this.toBBox = new Function('a', 'return {minX: a' + t[0] + ', minY: a' + t[1] + ', maxX: a' + t[2] + ', maxY: a' + t[3] + '};')
    }
  }
}, function(t, n, i) {
  t.exports = function() {
    'use strict'

    function t(t, n, i) {
      var e = t[n]
      t[n] = t[i], t[i] = e
    }

    function n(t, n) {
      return t < n ? -1 : t > n ? 1 : 0
    }

    return function(i, e, a, o, r) {
      !function n(i, e, a, o, r) {
        for (; o > a;) {
          if (o - a > 600) {
            var s = o - a + 1, h = e - a + 1, c = Math.log(s), l = .5 * Math.exp(2 * c / 3),
              m = .5 * Math.sqrt(c * l * (s - l) / s) * (h - s / 2 < 0 ? -1 : 1),
              u = Math.max(a, Math.floor(e - h * l / s + m)), _ = Math.min(o, Math.floor(e + (s - h) * l / s + m))
            n(i, e, u, _, r)
          }
          var f = i[e], d = a, p = o
          for (t(i, a, e), r(i[o], f) > 0 && t(i, a, o); d < p;) {
            for (t(i, d, p), d++, p--; r(i[d], f) < 0;) d++
            for (; r(i[p], f) > 0;) p--
          }
          0 === r(i[a], f) ? t(i, a, p) : t(i, ++p, o), p <= e && (a = p + 1), e <= p && (o = p - 1)
        }
      }(i, e, a || 0, o || i.length - 1, r || n)
    }
  }()
}, function(t, n, i) {
  'use strict'
  t.exports = function(t) {
    var n = (t.Layer ? t.Layer : t.Class).extend({
      initialize: function(n) {
        t.setOptions(this, n), this._onClickListeners = [], this._onHoverListeners = []
      }, setOptions: function(n) {
        return t.setOptions(this, n), this.redraw()
      }, redraw: function() {
        this._redraw(!0)
      }, addMarkers: function(t) {
        var n = this, i = [], e = []
        t.forEach(function(t) {
          if ('markerPane' == t.options.pane && t.options.icon) {
            var a = t.getLatLng(), o = n._map.getBounds().contains(a), r = n._addMarker(t, a, o)
            !0 === o && i.push(r[0]), e.push(r[1])
          } else {
            console.error('Layer isn\'t a marker')
          }
        }), n._markers.load(i), n._latlngMarkers.load(e)
      }, addMarker: function(t) {
        var n = t.getLatLng(), i = this._map.getBounds().contains(n), e = this._addMarker(t, n, i)
        !0 === i && this._markers.insert(e[0]), this._latlngMarkers.insert(e[1])
      }, addLayer: function(t) {
        'markerPane' == t.options.pane && t.options.icon ? this.addMarker(t) : console.error('Layer isn\'t a marker')
      }, addLayers: function(t) {
        this.addMarkers(t)
      }, removeLayer: function(t) {
        this.removeMarker(t, !0)
      }, removeMarker: function(t, n) {
        t.minX && (t = t.data)
        var i = t.getLatLng(), e = this._map.getBounds().contains(i),
          a = { minX: i.lng, minY: i.lat, maxX: i.lng, maxY: i.lat, data: t }
        this._latlngMarkers.remove(a, function(t, n) {
          return t.data._leaflet_id === n.data._leaflet_id
        }), this._latlngMarkers.total--, this._latlngMarkers.dirty++, !0 === e && !0 === n && this._redraw(!0)
      }, onAdd: function(t) {
        this._map = t, this._canvas || this._initCanvas(), this.options.pane ? this.getPane().appendChild(this._canvas) : t._panes.overlayPane.appendChild(this._canvas), t.on('moveend', this._reset, this), t.on('resize', this._reset, this), t.on('click', this._executeListeners, this), t.on('mousemove', this._executeListeners, this), t._zoomAnimated && t.on('zoomanim', this._animateZoom, this)
      }, onRemove: function(t) {
        this.options.pane ? this.getPane().removeChild(this._canvas) : t.getPanes().overlayPane.removeChild(this._canvas), t.off('click', this._executeListeners, this), t.off('mousemove', this._executeListeners, this), t.off('moveend', this._reset, this), t.off('resize', this._reset, this), t._zoomAnimated && t.off('zoomanim', this._animateZoom, this)
      }, addTo: function(t) {
        return t.addLayer(this), this
      }, clearLayers: function() {
        this._latlngMarkers = null, this._markers = null, this._redraw(!0)
      }, _animateZoom: function(n) {
        var i = this._map.getZoomScale(n.zoom),
          e = this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), n.zoom, n.center).min
        t.DomUtil.setTransform(this._canvas, e, i)
      }, _addMarker: function(n, i, e) {
        n._map = this._map, this._markers || (this._markers = new rbush), this._latlngMarkers || (this._latlngMarkers = new rbush, this._latlngMarkers.dirty = 0, this._latlngMarkers.total = 0), t.Util.stamp(n)
        var a = this._map.latLngToContainerPoint(i), o = n.options.icon.options.iconSize, r = o[0] / 2, s = o[1] / 2,
          h = [{ minX: a.x - r, minY: a.y - s, maxX: a.x + r, maxY: a.y + s, data: n }, {
            minX: i.lng,
            minY: i.lat,
            maxX: i.lng,
            maxY: i.lat,
            data: n
          }]
        return this._latlngMarkers.dirty++, this._latlngMarkers.total++, !0 === e && this._drawMarker(n, a), h
      }, _drawMarker: function(t, n) {
        var i = this
        this._imageLookup || (this._imageLookup = {}), n || (n = i._map.latLngToContainerPoint(t.getLatLng()))
        var e = t.options.icon.options.iconUrl
        if (t.canvas_img) {
          i._drawImage(t, n)
        } else if (i._imageLookup[e]) {
          t.canvas_img = i._imageLookup[e][0], !1 === i._imageLookup[e][1] ? i._imageLookup[e][2].push([t, n]) : i._drawImage(t, n)
        } else {
          var a = new Image
          a.src = e, t.canvas_img = a, i._imageLookup[e] = [a, !1, [[t, n]]], a.onload = function() {
            i._imageLookup[e][1] = !0, i._imageLookup[e][2].forEach(function(t) {
              i._drawImage(t[0], t[1])
            })
          }
        }
      }, _drawDashLine_1: function([t, n], [i, e], a = 5) {
        const o = i - t, r = e - n, s = Math.floor(Math.sqrt(o * o + r * r) / a), h = o / s, c = r / s
        this._context.strokeStyle = '#C10802', this._context.beginPath(), this._context.lineWidth = 2
        for (let i = 0; i < s; i++) i % 2 == 0 ? this._context.moveTo(t, n) : this._context.lineTo(t, n), t += h, n += c
        this._context.lineTo(i, e)
      }, drawDashRect_1: function(t, n, i, e = 5) {
        var a = this._map.latLngToContainerPoint(t), o = i[0], r = i[1], s = a.x + n[0] - o / 2, h = a.y + n[1] - r / 2
        this._drawDashLine([s, h], [s + o, h], e), this._context.stroke(), this._drawDashLine([s + o, h], [s + o, h + r], e), this._context.stroke(), this._drawDashLine([s + o, h + r], [s, h + r], e), this._context.stroke(), this._drawDashLine([s, h + r], [s, h], e), this._context.stroke()
      }, drawDashRect: function(t, n, i, e = [2, 3]) {
        var a = this._map.latLngToContainerPoint(t), o = a.x, r = a.y, s = i.iconSize[0] + 1, h = i.iconSize[1] + 2
        this._context.save(), this._context.strokeStyle = '#C10802', this._context.translate(o, r), this._context.rotate(n * Math.PI / 180), this._context.translate(-i.iconAnchor[0], -i.iconAnchor[1] - 1), this._context.beginPath(), this._context.lineWidth = 2, this._drawDashLine(this._context, s, h, e), this._context.restore()
      }, _drawDashLine: function(t, n, i, e) {
        var a = 0, o = 0, r = 2 * e[0] - 1, s = 2 * e[1] - 1, h = Math.floor(n / r), c = Math.floor(i / s)
        for (let n = 0; n < 4; n++) {
          if (n % 2 == 0) {
            for (let n = 0; n < r; n++) n % 2 == 0 ? (t.moveTo(a, o), t.lineTo(a + h, o), a += h) : a += h
            h = -h
          } else {
            for (let n = 0; n < s; n++) n % 2 == 0 ? (t.moveTo(a, o), t.lineTo(a, o + c), o += c) : o += c
            c = -c
          }
        }
        t.stroke()
      }, _drawImage: function(t, n) {
        var i = t.options.icon.options, e = t.options.rotationAngle, a = n.x, o = n.y, r = i.iconSize[0],
          s = i.iconSize[1]
        e ? (this._context.save(), this._context.translate(a, o), this._context.rotate(e * Math.PI / 180), this._context.drawImage(t.canvas_img, -i.iconAnchor[0], -i.iconAnchor[1], r, s), this._context.restore()) : this._context.drawImage(t.canvas_img, n.x - i.iconAnchor[0], n.y - i.iconAnchor[1], i.iconSize[0], i.iconSize[1])
      }, _reset: function() {
        var n = this._map.containerPointToLayerPoint([0, 0])
        t.DomUtil.setPosition(this._canvas, n)
        var i = this._map.getSize()
        this._canvas.width = i.x, this._canvas.height = i.y, this._redraw()
      }, _redraw: function(t) {
        var n = this
        if (t && this._context.clearRect(0, 0, this._canvas.width, this._canvas.height), this._map && this._latlngMarkers) {
          var i = []
          n._latlngMarkers.dirty / n._latlngMarkers.total >= .1 && (n._latlngMarkers.all().forEach(function(t) {
            i.push(t)
          }), n._latlngMarkers.clear(), n._latlngMarkers.load(i), n._latlngMarkers.dirty = 0, i = [])
          var e = n._map.getBounds(),
            a = { minX: e.getWest(), minY: e.getSouth(), maxX: e.getEast(), maxY: e.getNorth() }
          n._latlngMarkers.search(a).forEach(function(t) {
            var e = n._map.latLngToContainerPoint(t.data.getLatLng()), a = t.data.options.icon.options.iconSize,
              o = a[0] / 2, r = a[1] / 2,
              s = { minX: e.x - o, minY: e.y - r, maxX: e.x + o, maxY: e.y + r, data: t.data }
            i.push(s), n._drawMarker(t.data, e)
          }), this._markers.clear(), this._markers.load(i)
        }
      }, _initCanvas: function() {
        this._canvas = t.DomUtil.create('canvas', 'leaflet-canvas-icon-layer leaflet-layer')
        var n = this._map.getSize()
        this._canvas.width = n.x, this._canvas.height = n.y, this._context = this._canvas.getContext('2d')
        var i = this._map.options.zoomAnimation && t.Browser.any3d
        t.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (i ? 'animated' : 'hide'))
      }, addOnClickListener: function(t) {
        this._onClickListeners.push(t)
      }, addOnHoverListener: function(t) {
        this._onHoverListeners.push(t)
      }, _executeListeners: function(t) {
        if (this._markers) {
          var n = this, i = t.containerPoint.x, e = t.containerPoint.y
          n._openToolTip && (n._openToolTip.closeTooltip(), delete n._openToolTip)
          var a = this._markers.search({ minX: i, minY: e, maxX: i, maxY: e })
          a && a.length > 0 ? (n._map._container.style.cursor = 'pointer', 'click' === t.type && (a[0].data.getPopup() && a[0].data.openPopup(), n._onClickListeners.forEach(function(n) {
            n(t, a)
          })), 'mousemove' === t.type && (a[0].data.getTooltip() && (n._openToolTip = a[0].data, a[0].data.openTooltip()), n._onHoverListeners.forEach(function(n) {
            n(t, a)
          }))) : n._map._container.style.cursor = ""
        }
      }
    });
    t.canvasIconLayer = function(t) {
      return new n(t)
    }
  }
}]);
