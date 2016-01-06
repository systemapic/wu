/*
 Copyright (c) 2012-2015 Norkart AS, all rights reserved
 http://www.norkart.no
 Contains significant portions of code from Leaflet under the simplified BSD license,
 (c) 2010-2015 Vladimir Agafonkin, (c) 2010-2011 CloudMade http://leafletjs.com
 Build date: Mon Jul 27 2015 15:52:05 GMT+0200 (W. Europe Daylight Time)
 DO NOT DOWNLOAD AND USE LOCALLY, ALWAYS LINK FROM WEBATLAS.NO!
*/
(function(e, t) {
    (function(e, t, n) {
        function i() {
            var t = e.L;
            r.noConflict = function() {
                return e.L = t, this
            }, e.L = r
        }
        var r = {
            version: "1.0-dev"
        };
        typeof module == "object" && typeof module.exports == "object" ? module.exports = r : typeof define == "function" && define.amd && define(r), typeof e != "undefined" && i(), r.Util = {
            extend: function(e) {
                var t, n, r, i;
                for (n = 1, r = arguments.length; n < r; n++) {
                    i = arguments[n];
                    for (t in i) e[t] = i[t]
                }
                return e
            },
            create: Object.create || function() {
                function e() {}
                return function(t) {
                    return e.prototype = t, new e
                }
            }(),
            bind: function(e, t) {
                var n = Array.prototype.slice;
                if (e.bind) return e.bind.apply(e, n.call(arguments, 1));
                var r = n.call(arguments, 2);
                return function() {
                    return e.apply(t, r.length ? r.concat(n.call(arguments)) : arguments)
                }
            },
            stamp: function(e) {
                return e._leaflet_id = e._leaflet_id || ++r.Util.lastId, e._leaflet_id
            },
            lastId: 0,
            throttle: function(e, t, n) {
                var r, i, s, o;
                return o = function() {
                    r = !1, i && (s.apply(n, i), i = !1)
                }, s = function() {
                    r ? i = arguments : (e.apply(n, arguments), setTimeout(o, t), r = !0)
                }, s
            },
            wrapNum: function(e, t, n) {
                var r = t[1],
                    i = t[0],
                    s = r - i;
                return e === r && n ? e : ((e - i) % s + s) % s + i
            },
            falseFn: function() {
                return !1
            },
            formatNum: function(e, t) {
                var n = Math.pow(10, t || 5);
                return Math.round(e * n) / n
            },
            trim: function(e) {
                return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
            },
            splitWords: function(e) {
                return r.Util.trim(e).split(/\s+/)
            },
            setOptions: function(e, t) {
                e.hasOwnProperty("options") || (e.options = e.options ? r.Util.create(e.options) : {});
                for (var n in t) e.options[n] = t[n];
                return e.options
            },
            getParamString: function(e, t, n) {
                var r = [];
                for (var i in e) r.push(encodeURIComponent(n ? i.toUpperCase() : i) + "=" + encodeURIComponent(e[i]));
                return (!t || t.indexOf("?") === -1 ? "?" : "&") + r.join("&")
            },
            template: function(e, t) {
                return e.replace(r.Util.templateRe, function(e, r) {
                    var i = t[r];
                    if (i === n) throw Error("No value provided for variable " + e);
                    return typeof i == "function" && (i = i(t)), i
                })
            },
            templateRe: /\{ *([\w_]+) *\}/g,
            isArray: Array.isArray || function(e) {
                return Object.prototype.toString.call(e) === "[object Array]"
            },
            indexOf: function(e, t) {
                for (var n = 0; n < e.length; n++)
                    if (e[n] === t) return n;
                return -1
            },
            emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
        },
        function() {
            function t(t) {
                return e["webkit" + t] || e["moz" + t] || e["ms" + t]
            }

            function i(t) {
                var r = +(new Date),
                    i = Math.max(0, 16 - (r - n));
                return n = r + i, e.setTimeout(t, i)
            }
            var n = 0,
                s = e.requestAnimationFrame || t("RequestAnimationFrame") || i,
                o = e.cancelAnimationFrame || t("CancelAnimationFrame") || t("CancelRequestAnimationFrame") || function(t) {
                    e.clearTimeout(t)
                };
            r.Util.requestAnimFrame = function(t, n, o) {
                if (!o || s !== i) return s.call(e, r.bind(t, n));
                t.call(n)
            }, r.Util.cancelAnimFrame = function(t) {
                t && o.call(e, t)
            }
        }(), r.extend = r.Util.extend, r.bind = r.Util.bind, r.stamp = r.Util.stamp, r.setOptions = r.Util.setOptions, r.Class = function() {}, r.Class.extend = function(e) {
            var t = function() {
                this.initialize && this.initialize.apply(this, arguments), this.callInitHooks()
            }, n = t.__super__ = this.prototype,
                i = r.Util.create(n);
            i.constructor = t, t.prototype = i;
            for (var s in this) this.hasOwnProperty(s) && s !== "prototype" && (t[s] = this[s]);
            return e.statics && (r.extend(t, e.statics), delete e.statics), e.includes && (r.Util.extend.apply(null, [i].concat(e.includes)), delete e.includes), i.options && (e.options = r.Util.extend(r.Util.create(i.options), e.options)), r.extend(i, e), i._initHooks = [], i.callInitHooks = function() {
                if (this._initHooksCalled) return;
                n.callInitHooks && n.callInitHooks.call(this), this._initHooksCalled = !0;
                for (var e = 0, t = i._initHooks.length; e < t; e++) i._initHooks[e].call(this)
            }, t
        }, r.Class.include = function(e) {
            r.extend(this.prototype, e)
        }, r.Class.mergeOptions = function(e) {
            r.extend(this.prototype.options, e)
        }, r.Class.addInitHook = function(e) {
            var t = Array.prototype.slice.call(arguments, 1),
                n = typeof e == "function" ? e : function() {
                    this[e].apply(this, t)
                };
            this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(n)
        }, r.Evented = r.Class.extend({
            on: function(e, t, n) {
                if (typeof e == "object")
                    for (var i in e) this._on(i, e[i], t);
                else {
                    e = r.Util.splitWords(e);
                    for (var s = 0, o = e.length; s < o; s++) this._on(e[s], t, n)
                }
                return this
            },
            off: function(e, t, n) {
                if (!e) delete this._events;
                else if (typeof e == "object")
                    for (var i in e) this._off(i, e[i], t);
                else {
                    e = r.Util.splitWords(e);
                    for (var s = 0, o = e.length; s < o; s++) this._off(e[s], t, n)
                }
                return this
            },
            _on: function(e, t, n) {
                var i = this._events = this._events || {}, s = n && n !== this && r.stamp(n);
                if (s) {
                    var o = e + "_idx",
                        u = e + "_len",
                        a = i[o] = i[o] || {}, f = r.stamp(t) + "_" + s;
                    a[f] || (a[f] = {
                        fn: t,
                        ctx: n
                    }, i[u] = (i[u] || 0) + 1)
                } else i[e] = i[e] || [], i[e].push({
                    fn: t
                })
            },
            _off: function(e, t, n) {
                var i = this._events,
                    s = e + "_idx",
                    o = e + "_len";
                if (!i) return;
                if (!t) {
                    delete i[e], delete i[s], delete i[o];
                    return
                }
                var u = n && n !== this && r.stamp(n),
                    a, f, l, c, h;
                if (u) h = r.stamp(t) + "_" + u, a = i[s], a && a[h] && (c = a[h], delete a[h], i[o]--);
                else {
                    a = i[e];
                    if (a)
                        for (f = 0, l = a.length; f < l; f++)
                            if (a[f].fn === t) {
                                c = a[f], a.splice(f, 1);
                                break
                            }
                }
                c && (c.fn = r.Util.falseFn)
            },
            fire: function(e, t, n) {
                if (!this.listens(e, n)) return this;
                var i = r.Util.extend({}, t, {
                    type: e,
                    target: this
                }),
                    s = this._events;
                if (s) {
                    var o = s[e + "_idx"],
                        u, a, f, l;
                    if (s[e]) {
                        f = s[e].slice();
                        for (u = 0, a = f.length; u < a; u++) f[u].fn.call(this, i)
                    }
                    for (l in o) o[l].fn.call(o[l].ctx, i)
                }
                return n && this._propagateEvent(i), this
            },
            listens: function(e, t) {
                var n = this._events;
                if (n && (n[e] || n[e + "_len"])) return !0;
                if (t)
                    for (var r in this._eventParents)
                        if (this._eventParents[r].listens(e, t)) return !0;
                return !1
            },
            once: function(e, t, n) {
                if (typeof e == "object") {
                    for (var i in e) this.once(i, e[i], t);
                    return this
                }
                var s = r.bind(function() {
                    this.off(e, t, n).off(e, s, n)
                }, this);
                return this.on(e, t, n).on(e, s, n)
            },
            addEventParent: function(e) {
                return this._eventParents = this._eventParents || {}, this._eventParents[r.stamp(e)] = e, this
            },
            removeEventParent: function(e) {
                return this._eventParents && delete this._eventParents[r.stamp(e)], this
            },
            _propagateEvent: function(e) {
                for (var t in this._eventParents) this._eventParents[t].fire(e.type, r.extend({
                    layer: e.target
                }, e), !0)
            }
        });
        var s = r.Evented.prototype;
        s.addEventListener = s.on, s.removeEventListener = s.clearAllEventListeners = s.off, s.addOneTimeEventListener = s.once, s.fireEvent = s.fire, s.hasEventListeners = s.listens, r.Mixin = {
            Events: s
        },
        function() {
            var n = navigator.userAgent.toLowerCase(),
                i = t.documentElement,
                s = "ActiveXObject" in e,
                o = n.indexOf("webkit") !== -1,
                u = n.indexOf("phantom") !== -1,
                a = n.search("android [23]") !== -1,
                f = n.indexOf("chrome") !== -1,
                l = n.indexOf("gecko") !== -1 && !o && !e.opera && !s,
                c = typeof orientation != "undefined" || n.indexOf("mobile") !== -1,
                h = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !e.PointerEvent,
                p = e.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints || h,
                d = s && "transition" in i.style,
                v = "WebKitCSSMatrix" in e && "m11" in new e.WebKitCSSMatrix && !a,
                m = "MozPerspective" in i.style,
                g = "OTransition" in i.style,
                y = !e.L_NO_TOUCH && !u && (p || "ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch);
            r.Browser = {
                ie: s,
                ielt9: s && !t.addEventListener,
                webkit: o,
                gecko: l,
                android: n.indexOf("android") !== -1,
                android23: a,
                chrome: f,
                safari: !f && n.indexOf("safari") !== -1,
                ie3d: d,
                webkit3d: v,
                gecko3d: m,
                opera12: g,
                any3d: !e.L_DISABLE_3D && (d || v || m) && !g && !u,
                mobile: c,
                mobileWebkit: c && o,
                mobileWebkit3d: c && v,
                mobileOpera: c && e.opera,
                mobileGecko: c && l,
                touch: !! y,
                msPointer: !! h,
                pointer: !! p,
                retina: (e.devicePixelRatio || e.screen.deviceXDPI / e.screen.logicalXDPI) > 1
            }
        }(), r.Point = function(e, t, n) {
            this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t
        }, r.Point.prototype = {
            clone: function() {
                return new r.Point(this.x, this.y)
            },
            add: function(e) {
                return this.clone()._add(r.point(e))
            },
            _add: function(e) {
                return this.x += e.x, this.y += e.y, this
            },
            subtract: function(e) {
                return this.clone()._subtract(r.point(e))
            },
            _subtract: function(e) {
                return this.x -= e.x, this.y -= e.y, this
            },
            divideBy: function(e) {
                return this.clone()._divideBy(e)
            },
            _divideBy: function(e) {
                return this.x /= e, this.y /= e, this
            },
            multiplyBy: function(e) {
                return this.clone()._multiplyBy(e)
            },
            _multiplyBy: function(e) {
                return this.x *= e, this.y *= e, this
            },
            scaleBy: function(e) {
                return new r.Point(this.x * e.x, this.y * e.y)
            },
            unscaleBy: function(e) {
                return new r.Point(this.x / e.x, this.y / e.y)
            },
            round: function() {
                return this.clone()._round()
            },
            _round: function() {
                return this.x = Math.round(this.x), this.y = Math.round(this.y), this
            },
            floor: function() {
                return this.clone()._floor()
            },
            _floor: function() {
                return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this
            },
            ceil: function() {
                return this.clone()._ceil()
            },
            _ceil: function() {
                return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this
            },
            distanceTo: function(e) {
                e = r.point(e);
                var t = e.x - this.x,
                    n = e.y - this.y;
                return Math.sqrt(t * t + n * n)
            },
            equals: function(e) {
                return e = r.point(e), e.x === this.x && e.y === this.y
            },
            contains: function(e) {
                return e = r.point(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y)
            },
            toString: function() {
                return "Point(" + r.Util.formatNum(this.x) + ", " + r.Util.formatNum(this.y) + ")"
            }
        }, r.point = function(e, t, i) {
            return e instanceof r.Point ? e : r.Util.isArray(e) ? new r.Point(e[0], e[1]) : e === n || e === null ? e : new r.Point(e, t, i)
        }, r.Bounds = function(e, t) {
            if (!e) return;
            var n = t ? [e, t] : e;
            for (var r = 0, i = n.length; r < i; r++) this.extend(n[r])
        }, r.Bounds.prototype = {
            extend: function(e) {
                return e = r.point(e), !this.min && !this.max ? (this.min = e.clone(), this.max = e.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(e.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(e.y, this.max.y)), this
            },
            getCenter: function(e) {
                return new r.Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, e)
            },
            getBottomLeft: function() {
                return new r.Point(this.min.x, this.max.y)
            },
            getTopRight: function() {
                return new r.Point(this.max.x, this.min.y)
            },
            getSize: function() {
                return this.max.subtract(this.min)
            },
            contains: function(e) {
                var t, n;
                return typeof e[0] == "number" || e instanceof r.Point ? e = r.point(e) : e = r.bounds(e), e instanceof r.Bounds ? (t = e.min, n = e.max) : t = n = e, t.x >= this.min.x && n.x <= this.max.x && t.y >= this.min.y && n.y <= this.max.y
            },
            intersects: function(e) {
                e = r.bounds(e);
                var t = this.min,
                    n = this.max,
                    i = e.min,
                    s = e.max,
                    o = s.x >= t.x && i.x <= n.x,
                    u = s.y >= t.y && i.y <= n.y;
                return o && u
            },
            overlaps: function(e) {
                e = r.bounds(e);
                var t = this.min,
                    n = this.max,
                    i = e.min,
                    s = e.max,
                    o = s.x > t.x && i.x < n.x,
                    u = s.y > t.y && i.y < n.y;
                return o && u
            },
            isValid: function() {
                return !!this.min && !! this.max
            }
        }, r.bounds = function(e, t) {
            return !e || e instanceof r.Bounds ? e : new r.Bounds(e, t)
        }, r.Transformation = function(e, t, n, r) {
            this._a = e, this._b = t, this._c = n, this._d = r
        }, r.Transformation.prototype = {
            transform: function(e, t) {
                return this._transform(e.clone(), t)
            },
            _transform: function(e, t) {
                return t = t || 1, e.x = t * (this._a * e.x + this._b), e.y = t * (this._c * e.y + this._d), e
            },
            untransform: function(e, t) {
                return t = t || 1, new r.Point((e.x / t - this._b) / this._a, (e.y / t - this._d) / this._c)
            }
        }, r.DomUtil = {
            get: function(e) {
                return typeof e == "string" ? t.getElementById(e) : e
            },
            getStyle: function(e, n) {
                var r = e.style[n] || e.currentStyle && e.currentStyle[n];
                if ((!r || r === "auto") && t.defaultView) {
                    var i = t.defaultView.getComputedStyle(e, null);
                    r = i ? i[n] : null
                }
                return r === "auto" ? null : r
            },
            create: function(e, n, r) {
                var i = t.createElement(e);
                return i.className = n, r && r.appendChild(i), i
            },
            remove: function(e) {
                var t = e.parentNode;
                t && t.removeChild(e)
            },
            empty: function(e) {
                while (e.firstChild) e.removeChild(e.firstChild)
            },
            toFront: function(e) {
                e.parentNode.appendChild(e)
            },
            toBack: function(e) {
                var t = e.parentNode;
                t.insertBefore(e, t.firstChild)
            },
            hasClass: function(e, t) {
                if (e.classList !== n) return e.classList.contains(t);
                var i = r.DomUtil.getClass(e);
                return i.length > 0 && RegExp("(^|\\s)" + t + "(\\s|$)").test(i)
            },
            addClass: function(e, t) {
                if (e.classList !== n) {
                    var i = r.Util.splitWords(t);
                    for (var s = 0, o = i.length; s < o; s++) e.classList.add(i[s])
                } else if (!r.DomUtil.hasClass(e, t)) {
                    var u = r.DomUtil.getClass(e);
                    r.DomUtil.setClass(e, (u ? u + " " : "") + t)
                }
            },
            removeClass: function(e, t) {
                e.classList !== n ? e.classList.remove(t) : r.DomUtil.setClass(e, r.Util.trim((" " + r.DomUtil.getClass(e) + " ").replace(" " + t + " ", " ")))
            },
            setClass: function(e, t) {
                e.className.baseVal === n ? e.className = t : e.className.baseVal = t
            },
            getClass: function(e) {
                return e.className.baseVal === n ? e.className : e.className.baseVal
            },
            setOpacity: function(e, t) {
                "opacity" in e.style ? e.style.opacity = t : "filter" in e.style && r.DomUtil._setOpacityIE(e, t)
            },
            _setOpacityIE: function(e, t) {
                var n = !1,
                    r = "DXImageTransform.Microsoft.Alpha";
                try {
                    n = e.filters.item(r)
                } catch (i) {
                    if (t === 1) return
                }
                t = Math.round(t * 100), n ? (n.Enabled = t !== 100, n.Opacity = t) : e.style.filter += " progid:" + r + "(opacity=" + t + ")"
            },
            testProp: function(e) {
                var n = t.documentElement.style;
                for (var r = 0; r < e.length; r++)
                    if (e[r] in n) return e[r];
                return !1
            },
            setTransform: function(e, t, n) {
                var i = t || new r.Point(0, 0);
                e.style[r.DomUtil.TRANSFORM] = "translate3d(" + i.x + "px," + i.y + "px" + ",0)" + (n ? " scale(" + n + ")" : "")
            },
            setPosition: function(e, t) {
                e._leaflet_pos = t, r.Browser.any3d ? r.DomUtil.setTransform(e, t) : (e.style.left = t.x + "px", e.style.top = t.y + "px")
            },
            getPosition: function(e) {
                return e._leaflet_pos
            }
        },
        function() {
            r.DomUtil.TRANSFORM = r.DomUtil.testProp(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]);
            var n = r.DomUtil.TRANSITION = r.DomUtil.testProp(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
            r.DomUtil.TRANSITION_END = n === "webkitTransition" || n === "OTransition" ? n + "End" : "transitionend";
            if ("onselectstart" in t) r.DomUtil.disableTextSelection = function() {
                r.DomEvent.on(e, "selectstart", r.DomEvent.preventDefault)
            }, r.DomUtil.enableTextSelection = function() {
                r.DomEvent.off(e, "selectstart", r.DomEvent.preventDefault)
            };
            else {
                var i = r.DomUtil.testProp(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]);
                r.DomUtil.disableTextSelection = function() {
                    if (i) {
                        var e = t.documentElement.style;
                        this._userSelect = e[i], e[i] = "none"
                    }
                }, r.DomUtil.enableTextSelection = function() {
                    i && (t.documentElement.style[i] = this._userSelect, delete this._userSelect)
                }
            }
            r.DomUtil.disableImageDrag = function() {
                r.DomEvent.on(e, "dragstart", r.DomEvent.preventDefault)
            }, r.DomUtil.enableImageDrag = function() {
                r.DomEvent.off(e, "dragstart", r.DomEvent.preventDefault)
            }, r.DomUtil.preventOutline = function(t) {
                while (t.tabIndex === -1) t = t.parentNode;
                if (!t) return;
                r.DomUtil.restoreOutline(), this._outlineElement = t, this._outlineStyle = t.style.outline, t.style.outline = "none", r.DomEvent.on(e, "keydown", r.DomUtil.restoreOutline, this)
            }, r.DomUtil.restoreOutline = function() {
                if (!this._outlineElement) return;
                this._outlineElement.style.outline = this._outlineStyle, delete this._outlineElement, delete this._outlineStyle, r.DomEvent.off(e, "keydown", r.DomUtil.restoreOutline, this)
            }
        }(), r.LatLng = function(e, t, r) {
            if (isNaN(e) || isNaN(t)) throw Error("Invalid LatLng object: (" + e + ", " + t + ")");
            this.lat = +e, this.lng = +t, r !== n && (this.alt = +r)
        }, r.LatLng.prototype = {
            equals: function(e, t) {
                if (!e) return !1;
                e = r.latLng(e);
                var i = Math.max(Math.abs(this.lat - e.lat), Math.abs(this.lng - e.lng));
                return i <= (t === n ? 1e-9 : t)
            },
            toString: function(e) {
                return "LatLng(" + r.Util.formatNum(this.lat, e) + ", " + r.Util.formatNum(this.lng, e) + ")"
            },
            distanceTo: function(e) {
                return r.CRS.Earth.distance(this, r.latLng(e))
            },
            wrap: function() {
                return r.CRS.Earth.wrapLatLng(this)
            },
            toBounds: function(e) {
                var t = 180 * e / 40075017,
                    n = t / Math.cos(Math.PI / 180 * this.lat);
                return r.latLngBounds([this.lat - t, this.lng - n], [this.lat + t, this.lng + n])
            },
            clone: function() {
                return new r.LatLng(this.lat, this.lng, this.alt)
            }
        }, r.latLng = function(e, t, i) {
            return e instanceof r.LatLng ? e : r.Util.isArray(e) && typeof e[0] != "object" ? e.length === 3 ? new r.LatLng(e[0], e[1], e[2]) : e.length === 2 ? new r.LatLng(e[0], e[1]) : null : e === n || e === null ? e : typeof e == "object" && "lat" in e ? new r.LatLng(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : t === n ? null : new r.LatLng(e, t, i)
        }, r.LatLngBounds = function(e, t) {
            if (!e) return;
            var n = t ? [e, t] : e;
            for (var r = 0, i = n.length; r < i; r++) this.extend(n[r])
        }, r.LatLngBounds.prototype = {
            extend: function(e) {
                var t = this._southWest,
                    n = this._northEast,
                    i, s;
                if (e instanceof r.LatLng) i = e, s = e;
                else {
                    if (!(e instanceof r.LatLngBounds)) return e ? this.extend(r.latLng(e) || r.latLngBounds(e)) : this;
                    i = e._southWest, s = e._northEast;
                    if (!i || !s) return this
                }
                return !t && !n ? (this._southWest = new r.LatLng(i.lat, i.lng), this._northEast = new r.LatLng(s.lat, s.lng)) : (t.lat = Math.min(i.lat, t.lat), t.lng = Math.min(i.lng, t.lng), n.lat = Math.max(s.lat, n.lat), n.lng = Math.max(s.lng, n.lng)), this
            },
            pad: function(e) {
                var t = this._southWest,
                    n = this._northEast,
                    i = Math.abs(t.lat - n.lat) * e,
                    s = Math.abs(t.lng - n.lng) * e;
                return new r.LatLngBounds(new r.LatLng(t.lat - i, t.lng - s), new r.LatLng(n.lat + i, n.lng + s))
            },
            getCenter: function() {
                return new r.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2)
            },
            getSouthWest: function() {
                return this._southWest
            },
            getNorthEast: function() {
                return this._northEast
            },
            getNorthWest: function() {
                return new r.LatLng(this.getNorth(), this.getWest())
            },
            getSouthEast: function() {
                return new r.LatLng(this.getSouth(), this.getEast())
            },
            getWest: function() {
                return this._southWest.lng
            },
            getSouth: function() {
                return this._southWest.lat
            },
            getEast: function() {
                return this._northEast.lng
            },
            getNorth: function() {
                return this._northEast.lat
            },
            contains: function(e) {
                typeof e[0] == "number" || e instanceof r.LatLng ? e = r.latLng(e) : e = r.latLngBounds(e);
                var t = this._southWest,
                    n = this._northEast,
                    i, s;
                return e instanceof r.LatLngBounds ? (i = e.getSouthWest(), s = e.getNorthEast()) : i = s = e, i.lat >= t.lat && s.lat <= n.lat && i.lng >= t.lng && s.lng <= n.lng
            },
            intersects: function(e) {
                e = r.latLngBounds(e);
                var t = this._southWest,
                    n = this._northEast,
                    i = e.getSouthWest(),
                    s = e.getNorthEast(),
                    o = s.lat >= t.lat && i.lat <= n.lat,
                    u = s.lng >= t.lng && i.lng <= n.lng;
                return o && u
            },
            overlaps: function(e) {
                e = r.latLngBounds(e);
                var t = this._southWest,
                    n = this._northEast,
                    i = e.getSouthWest(),
                    s = e.getNorthEast(),
                    o = s.lat > t.lat && i.lat < n.lat,
                    u = s.lng > t.lng && i.lng < n.lng;
                return o && u
            },
            toBBoxString: function() {
                return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",")
            },
            equals: function(e) {
                return e ? (e = r.latLngBounds(e), this._southWest.equals(e.getSouthWest()) && this._northEast.equals(e.getNorthEast())) : !1
            },
            isValid: function() {
                return !!this._southWest && !! this._northEast
            }
        }, r.latLngBounds = function(e, t) {
            return !e || e instanceof r.LatLngBounds ? e : new r.LatLngBounds(e, t)
        }, r.Projection = {}, r.Projection.LonLat = {
            project: function(e) {
                return new r.Point(e.lng, e.lat)
            },
            unproject: function(e) {
                return new r.LatLng(e.y, e.x)
            },
            bounds: r.bounds([-180, -90], [180, 90])
        }, r.Projection.SphericalMercator = {
            R: 6378137,
            project: function(e) {
                var t = Math.PI / 180,
                    n = 1 - 1e-15,
                    i = Math.max(Math.min(Math.sin(e.lat * t), n), -n);
                return new r.Point(this.R * e.lng * t, this.R * Math.log((1 + i) / (1 - i)) / 2)
            },
            unproject: function(e) {
                var t = 180 / Math.PI;
                return new r.LatLng((2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * t, e.x * t / this.R)
            },
            bounds: function() {
                var e = 6378137 * Math.PI;
                return r.bounds([-e, -e], [e, e])
            }()
        }, r.CRS = {
            latLngToPoint: function(e, t) {
                var n = this.projection.project(e),
                    r = this.scale(t);
                return this.transformation._transform(n, r)
            },
            pointToLatLng: function(e, t) {
                var n = this.scale(t),
                    r = this.transformation.untransform(e, n);
                return this.projection.unproject(r)
            },
            project: function(e) {
                return this.projection.project(e)
            },
            unproject: function(e) {
                return this.projection.unproject(e)
            },
            scale: function(e) {
                return 256 * Math.pow(2, e)
            },
            getProjectedBounds: function(e) {
                if (this.infinite) return null;
                var t = this.projection.bounds,
                    n = this.scale(e),
                    i = this.transformation.transform(t.min, n),
                    s = this.transformation.transform(t.max, n);
                return r.bounds(i, s)
            },
            wrapLatLng: function(e) {
                var t = this.wrapLng ? r.Util.wrapNum(e.lng, this.wrapLng, !0) : e.lng,
                    n = this.wrapLat ? r.Util.wrapNum(e.lat, this.wrapLat, !0) : e.lat,
                    i = e.alt;
                return r.latLng(n, t, i)
            }
        }, r.CRS.Simple = r.extend({}, r.CRS, {
            projection: r.Projection.LonLat,
            transformation: new r.Transformation(1, 0, -1, 0),
            scale: function(e) {
                return Math.pow(2, e)
            },
            distance: function(e, t) {
                var n = t.lng - e.lng,
                    r = t.lat - e.lat;
                return Math.sqrt(n * n + r * r)
            },
            infinite: !0
        }), r.CRS.Earth = r.extend({}, r.CRS, {
            wrapLng: [-180, 180],
            R: 6378137,
            distance: function(e, t) {
                var n = Math.PI / 180,
                    r = e.lat * n,
                    i = t.lat * n,
                    s = Math.sin(r) * Math.sin(i) + Math.cos(r) * Math.cos(i) * Math.cos((t.lng - e.lng) * n);
                return this.R * Math.acos(Math.min(s, 1))
            }
        }), r.CRS.EPSG3857 = r.extend({}, r.CRS.Earth, {
            code: "EPSG:3857",
            projection: r.Projection.SphericalMercator,
            transformation: function() {
                var e = .5 / (Math.PI * r.Projection.SphericalMercator.R);
                return new r.Transformation(e, .5, -e, .5)
            }()
        }), r.CRS.EPSG900913 = r.extend({}, r.CRS.EPSG3857, {
            code: "EPSG:900913"
        }), r.CRS.EPSG4326 = r.extend({}, r.CRS.Earth, {
            code: "EPSG:4326",
            projection: r.Projection.LonLat,
            transformation: new r.Transformation(1 / 180, 1, -1 / 180, .5)
        }), r.Map = r.Evented.extend({
            options: {
                crs: r.CRS.EPSG3857,
                fadeAnimation: !0,
                trackResize: !0,
                markerZoomAnimation: !0,
                maxBoundsViscosity: 0
            },
            initialize: function(e, t) {
                t = r.setOptions(this, t), this._initContainer(e), this._initLayout(), this._onResize = r.bind(this._onResize, this), this._initEvents(), t.maxBounds && this.setMaxBounds(t.maxBounds), t.zoom !== n && (this._zoom = this._limitZoom(t.zoom)), t.center && t.zoom !== n && this.setView(r.latLng(t.center), t.zoom, {
                    reset: !0
                }), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this.callInitHooks(), this._addLayers(this.options.layers)
            },
            setView: function(e, t) {
                return t = t === n ? this.getZoom() : t, this._resetView(r.latLng(e), t), this
            },
            setZoom: function(e, t) {
                return this._loaded ? this.setView(this.getCenter(), e, {
                    zoom: t
                }) : (this._zoom = e, this)
            },
            zoomIn: function(e, t) {
                return this.setZoom(this._zoom + (e || 1), t)
            },
            zoomOut: function(e, t) {
                return this.setZoom(this._zoom - (e || 1), t)
            },
            setZoomAround: function(e, t, n) {
                var i = this.getZoomScale(t),
                    s = this.getSize().divideBy(2),
                    o = e instanceof r.Point ? e : this.latLngToContainerPoint(e),
                    u = o.subtract(s).multiplyBy(1 - 1 / i),
                    a = this.containerPointToLatLng(s.add(u));
                return this.setView(a, t, {
                    zoom: n
                })
            },
            _getBoundsCenterZoom: function(e, t) {
                t = t || {}, e = e.getBounds ? e.getBounds() : r.latLngBounds(e);
                var n = r.point(t.paddingTopLeft || t.padding || [0, 0]),
                    i = r.point(t.paddingBottomRight || t.padding || [0, 0]),
                    s = this.getBoundsZoom(e, !1, n.add(i));
                s = t.maxZoom ? Math.min(t.maxZoom, s) : s;
                var o = i.subtract(n).divideBy(2),
                    u = this.project(e.getSouthWest(), s),
                    a = this.project(e.getNorthEast(), s),
                    f = this.unproject(u.add(a).divideBy(2).add(o), s);
                return {
                    center: f,
                    zoom: s
                }
            },
            fitBounds: function(e, t) {
                var n = this._getBoundsCenterZoom(e, t);
                return this.setView(n.center, n.zoom, t)
            },
            fitWorld: function(e) {
                return this.fitBounds([
                    [-90, -180],
                    [90, 180]
                ], e)
            },
            panTo: function(e, t) {
                return this.setView(e, this._zoom, {
                    pan: t
                })
            },
            panBy: function(e) {
                return this.fire("movestart"), this._rawPanBy(r.point(e)), this.fire("move"), this.fire("moveend")
            },
            setMaxBounds: function(e) {
                return e = r.latLngBounds(e), e ? (this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : this.off("moveend", this._panInsideMaxBounds)
            },
            setMinZoom: function(e) {
                return this.options.minZoom = e, this._loaded && this.getZoom() < this.options.minZoom ? this.setZoom(e) : this
            },
            setMaxZoom: function(e) {
                return this.options.maxZoom = e, this._loaded && this.getZoom() > this.options.maxZoom ? this.setZoom(e) : this
            },
            panInsideBounds: function(e, t) {
                var n = this.getCenter(),
                    i = this._limitCenter(n, this._zoom, r.latLngBounds(e));
                return n.equals(i) ? this : this.panTo(i, t)
            },
            invalidateSize: function(e) {
                if (!this._loaded) return this;
                e = r.extend({
                    animate: !1,
                    pan: !0
                }, e === !0 ? {
                    animate: !0
                } : e);
                var t = this.getSize();
                this._sizeChanged = !0, this._lastCenter = null;
                var n = this.getSize(),
                    i = t.divideBy(2).round(),
                    s = n.divideBy(2).round(),
                    o = i.subtract(s);
                return !o.x && !o.y ? this : (e.animate && e.pan ? this.panBy(o) : (e.pan && this._rawPanBy(o), this.fire("move"), e.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(r.bind(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
                    oldSize: t,
                    newSize: n
                }))
            },
            stop: function() {
                return r.Util.cancelAnimFrame(this._flyToFrame), this._panAnim && this._panAnim.stop(), this
            },
            addHandler: function(e, t) {
                if (!t) return this;
                var n = this[e] = new t(this);
                return this._handlers.push(n), this.options[e] && n.enable(), this
            },
            remove: function() {
                this._initEvents(!0);
                try {
                    delete this._container._leaflet
                } catch (e) {
                    this._container._leaflet = n
                }
                r.DomUtil.remove(this._mapPane), this._clearControlPos && this._clearControlPos(), this._clearHandlers(), this._loaded && this.fire("unload");
                for (var t in this._layers) this._layers[t].remove();
                return this
            },
            createPane: function(e, t) {
                var n = "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""),
                    i = r.DomUtil.create("div", n, t || this._mapPane);
                return e && (this._panes[e] = i), i
            },
            getCenter: function() {
                return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter : this.layerPointToLatLng(this._getCenterLayerPoint())
            },
            getZoom: function() {
                return this._zoom
            },
            getBounds: function() {
                var e = this.getPixelBounds(),
                    t = this.unproject(e.getBottomLeft()),
                    n = this.unproject(e.getTopRight());
                return new r.LatLngBounds(t, n)
            },
            getMinZoom: function() {
                return this.options.minZoom === n ? this._layersMinZoom || 0 : this.options.minZoom
            },
            getMaxZoom: function() {
                return this.options.maxZoom === n ? this._layersMaxZoom === n ? Infinity : this._layersMaxZoom : this.options.maxZoom
            },
            getBoundsZoom: function(e, t, n) {
                e = r.latLngBounds(e);
                var i = this.getMinZoom() - (t ? 1 : 0),
                    s = this.getMaxZoom(),
                    o = this.getSize(),
                    u = e.getNorthWest(),
                    a = e.getSouthEast(),
                    f = !0,
                    l;
                n = r.point(n || [0, 0]);
                do i++, l = this.project(a, i).subtract(this.project(u, i)).add(n).floor(), f = t ? l.x < o.x || l.y < o.y : o.contains(l); while (f && i <= s);
                return f && t ? null : t ? i : i - 1
            },
            getSize: function() {
                if (!this._size || this._sizeChanged) this._size = new r.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1;
                return this._size.clone()
            },
            getPixelBounds: function(e, t) {
                var n = this._getTopLeftPoint(e, t);
                return new r.Bounds(n, n.add(this.getSize()))
            },
            getPixelOrigin: function() {
                return this._checkIfLoaded(), this._pixelOrigin
            },
            getPixelWorldBounds: function(e) {
                return this.options.crs.getProjectedBounds(e === n ? this.getZoom() : e)
            },
            getPane: function(e) {
                return typeof e == "string" ? this._panes[e] : e
            },
            getPanes: function() {
                return this._panes
            },
            getContainer: function() {
                return this._container
            },
            getZoomScale: function(e, t) {
                var r = this.options.crs;
                return t = t === n ? this._zoom : t, r.scale(e) / r.scale(t)
            },
            getScaleZoom: function(e, t) {
                return t = t === n ? this._zoom : t, t + Math.log(e) / Math.LN2
            },
            project: function(e, t) {
                return t = t === n ? this._zoom : t, this.options.crs.latLngToPoint(r.latLng(e), t)
            },
            unproject: function(e, t) {
                return t = t === n ? this._zoom : t, this.options.crs.pointToLatLng(r.point(e), t)
            },
            layerPointToLatLng: function(e) {
                var t = r.point(e).add(this.getPixelOrigin());
                return this.unproject(t)
            },
            latLngToLayerPoint: function(e) {
                var t = this.project(r.latLng(e))._round();
                return t._subtract(this.getPixelOrigin())
            },
            wrapLatLng: function(e) {
                return this.options.crs.wrapLatLng(r.latLng(e))
            },
            distance: function(e, t) {
                return this.options.crs.distance(r.latLng(e), r.latLng(t))
            },
            containerPointToLayerPoint: function(e) {
                return r.point(e).subtract(this._getMapPanePos())
            },
            layerPointToContainerPoint: function(e) {
                return r.point(e).add(this._getMapPanePos())
            },
            containerPointToLatLng: function(e) {
                var t = this.containerPointToLayerPoint(r.point(e));
                return this.layerPointToLatLng(t)
            },
            latLngToContainerPoint: function(e) {
                return this.layerPointToContainerPoint(this.latLngToLayerPoint(r.latLng(e)))
            },
            mouseEventToContainerPoint: function(e) {
                return r.DomEvent.getMousePosition(e, this._container)
            },
            mouseEventToLayerPoint: function(e) {
                return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e))
            },
            mouseEventToLatLng: function(e) {
                return this.layerPointToLatLng(this.mouseEventToLayerPoint(e))
            },
            _initContainer: function(e) {
                var t = this._container = r.DomUtil.get(e);
                if (!t) throw Error("Map container not found.");
                if (t._leaflet) throw Error("Map container is already initialized.");
                r.DomEvent.addListener(t, "scroll", this._onScroll, this), t._leaflet = !0
            },
            _initLayout: function() {
                var e = this._container;
                this._fadeAnimated = this.options.fadeAnimation && r.Browser.any3d, r.DomUtil.addClass(e, "leaflet-container" + (r.Browser.touch ? " leaflet-touch" : "") + (r.Browser.retina ? " leaflet-retina" : "") + (r.Browser.ielt9 ? " leaflet-oldie" : "") + (r.Browser.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
                var t = r.DomUtil.getStyle(e, "position");
                t !== "absolute" && t !== "relative" && t !== "fixed" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos()
            },
            _initPanes: function() {
                var e = this._panes = {};
                this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), r.DomUtil.setPosition(this._mapPane, new r.Point(0, 0)), this.createPane("tilePane"), this.createPane("shadowPane"), this.createPane("overlayPane"), this.createPane("markerPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (r.DomUtil.addClass(e.markerPane, "leaflet-zoom-hide"), r.DomUtil.addClass(e.shadowPane, "leaflet-zoom-hide"))
            },
            _resetView: function(e, t) {
                r.DomUtil.setPosition(this._mapPane, new r.Point(0, 0));
                var n = !this._loaded;
                this._loaded = !0, t = this._limitZoom(t);
                var i = this._zoom !== t;
                this._moveStart(i)._move(e, t)._moveEnd(i), this.fire("viewreset"), n && this.fire("load")
            },
            _moveStart: function(e) {
                return e && this.fire("zoomstart"), this.fire("movestart")
            },
            _move: function(e, t, r) {
                t === n && (t = this._zoom);
                var i = this._zoom !== t;
                return this._zoom = t, this._lastCenter = e, this._pixelOrigin = this._getNewPixelOrigin(e), i && this.fire("zoom", r), this.fire("move", r)
            },
            _moveEnd: function(e) {
                return e && this.fire("zoomend"), this.fire("moveend")
            },
            _rawPanBy: function(e) {
                r.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(e))
            },
            _getZoomSpan: function() {
                return this.getMaxZoom() - this.getMinZoom()
            },
            _panInsideMaxBounds: function() {
                this.panInsideBounds(this.options.maxBounds)
            },
            _checkIfLoaded: function() {
                if (!this._loaded) throw Error("Set map center and zoom first.")
            },
            _initEvents: function(t) {
                if (!r.DomEvent) return;
                this._targets = {}, this._targets[r.stamp(this._container)] = this;
                var n = t ? "off" : "on";
                r.DomEvent[n](this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress", this._handleDOMEvent, this), this.options.trackResize && r.DomEvent[n](e, "resize", this._onResize, this)
            },
            _onResize: function() {
                r.Util.cancelAnimFrame(this._resizeRequest), this._resizeRequest = r.Util.requestAnimFrame(function() {
                    this.invalidateSize({
                        debounceMoveend: !0
                    })
                }, this, !1, this._container)
            },
            _onScroll: function() {
                this._container.scrollTop = 0, this._container.scrollLeft = 0
            },
            _findEventTargets: function(e, t, n) {
                var i = [],
                    s;
                while (e) {
                    s = this._targets[r.stamp(e)];
                    if (s && s.listens(t, !0)) {
                        i.push(s);
                        if (!n) break
                    }
                    if (e === this._container) break;
                    e = e.parentNode
                }
                return i
            },
            _handleDOMEvent: function(e) {
                if (!this._loaded || r.DomEvent._skipped(e)) return;
                var t = e.type === "keypress" && e.keyCode === 13 ? "click" : e.type;
                if (e.type === "click") {
                    var n = r.Util.extend({}, e);
                    n.type = "preclick", this._handleDOMEvent(n)
                }
                t === "mousedown" && r.DomUtil.preventOutline(e.target || e.srcElement), this._fireDOMEvent(e, t)
            },
            _fireDOMEvent: function(e, t, n) {
                t === "contextmenu" && r.DomEvent.preventDefault(e);
                var i = t === "mouseover" || t === "mouseout";
                n = (n || []).concat(this._findEventTargets(e.target || e.srcElement, t, !i));
                if (!n.length) {
                    n = [this];
                    if (i && !r.DomEvent._checkMouse(this._container, e)) return
                }
                var s = n[0];
                if (e.type === "click" && !e._simulated && this._draggableMoved(s)) return;
                var o = {
                    originalEvent: e
                };
                if (e.type !== "keypress") {
                    var u = s instanceof r.Marker;
                    o.containerPoint = u ? this.latLngToContainerPoint(s.getLatLng()) : this.mouseEventToContainerPoint(e), o.layerPoint = this.containerPointToLayerPoint(o.containerPoint), o.latlng = u ? s.getLatLng() : this.layerPointToLatLng(o.layerPoint)
                }
                for (var a = 0; a < n.length; a++) {
                    n[a].fire(t, o, !0);
                    if (o.originalEvent._stopped || n[a].options.nonBubblingEvents && r.Util.indexOf(n[a].options.nonBubblingEvents, t) !== -1) return
                }
            },
            _draggableMoved: function(e) {
                return e = e.options.draggable ? e : this, e.dragging && e.dragging.moved() || this.boxZoom && this.boxZoom.moved()
            },
            _clearHandlers: function() {
                for (var e = 0, t = this._handlers.length; e < t; e++) this._handlers[e].disable()
            },
            whenReady: function(e, t) {
                return this._loaded ? e.call(t || this, {
                    target: this
                }) : this.on("load", e, t), this
            },
            _getMapPanePos: function() {
                return r.DomUtil.getPosition(this._mapPane) || new r.Point(0, 0)
            },
            _moved: function() {
                var e = this._getMapPanePos();
                return e && !e.equals([0, 0])
            },
            _getTopLeftPoint: function(e, t) {
                var r = e && t !== n ? this._getNewPixelOrigin(e, t) : this.getPixelOrigin();
                return r.subtract(this._getMapPanePos())
            },
            _getNewPixelOrigin: function(e, t) {
                var n = this.getSize()._divideBy(2);
                return this.project(e, t)._subtract(n)._add(this._getMapPanePos())._round()
            },
            _latLngToNewLayerPoint: function(e, t, n) {
                var r = this._getNewPixelOrigin(n, t);
                return this.project(e, t)._subtract(r)
            },
            _getCenterLayerPoint: function() {
                return this.containerPointToLayerPoint(this.getSize()._divideBy(2))
            },
            _getCenterOffset: function(e) {
                return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint())
            },
            _limitCenter: function(e, t, n) {
                if (!n) return e;
                var i = this.project(e, t),
                    s = this.getSize().divideBy(2),
                    o = new r.Bounds(i.subtract(s), i.add(s)),
                    u = this._getBoundsOffset(o, n, t);
                return this.unproject(i.add(u), t)
            },
            _limitOffset: function(e, t) {
                if (!t) return e;
                var n = this.getPixelBounds(),
                    i = new r.Bounds(n.min.add(e), n.max.add(e));
                return e.add(this._getBoundsOffset(i, t))
            },
            _getBoundsOffset: function(e, t, n) {
                var i = this.project(t.getNorthWest(), n).subtract(e.min),
                    s = this.project(t.getSouthEast(), n).subtract(e.max),
                    o = this._rebound(i.x, -s.x),
                    u = this._rebound(i.y, -s.y);
                return new r.Point(o, u)
            },
            _rebound: function(e, t) {
                return e + t > 0 ? Math.round(e - t) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(t))
            },
            _limitZoom: function(e) {
                var t = this.getMinZoom(),
                    n = this.getMaxZoom();
                return r.Browser.any3d || (e = Math.round(e)), Math.max(t, Math.min(n, e))
            }
        }), r.map = function(e, t) {
            return new r.Map(e, t)
        }, r.Layer = r.Evented.extend({
            options: {
                pane: "overlayPane",
                nonBubblingEvents: []
            },
            addTo: function(e) {
                return e.addLayer(this), this
            },
            remove: function() {
                return this.removeFrom(this._map || this._mapToAdd)
            },
            removeFrom: function(e) {
                return e && e.removeLayer(this), this
            },
            getPane: function(e) {
                return this._map.getPane(e ? this.options[e] || e : this.options.pane)
            },
            addInteractiveTarget: function(e) {
                return this._map._targets[r.stamp(e)] = this, this
            },
            removeInteractiveTarget: function(e) {
                return delete this._map._targets[r.stamp(e)], this
            },
            isPopupOpen: function() {
                return this._popup.isOpen()
            },
            _layerAdd: function(e) {
                var t = e.target;
                if (!t.hasLayer(this)) return;
                this._map = t, this._zoomAnimated = t._zoomAnimated, this.onAdd(t), this.getAttribution && this._map.attributionControl && this._map.attributionControl.addAttribution(this.getAttribution()), this.getEvents && t.on(this.getEvents(), this), this.fire("add"), t.fire("layeradd", {
                    layer: this
                })
            }
        }), r.Map.include({
            addLayer: function(e) {
                var t = r.stamp(e);
                return this._layers[t] ? e : (this._layers[t] = e, e._mapToAdd = this, e.beforeAdd && e.beforeAdd(this), this.whenReady(e._layerAdd, e), this)
            },
            removeLayer: function(e) {
                var t = r.stamp(e);
                return this._layers[t] ? (this._loaded && e.onRemove(this), e.getAttribution && this.attributionControl && this.attributionControl.removeAttribution(e.getAttribution()), e.getEvents && this.off(e.getEvents(), e), delete this._layers[t], this._loaded && (this.fire("layerremove", {
                    layer: e
                }), e.fire("remove")), e._map = e._mapToAdd = null, this) : this
            },
            hasLayer: function(e) {
                return !!e && r.stamp(e) in this._layers
            },
            eachLayer: function(e, t) {
                for (var n in this._layers) e.call(t, this._layers[n]);
                return this
            },
            _addLayers: function(e) {
                e = e ? r.Util.isArray(e) ? e : [e] : [];
                for (var t = 0, n = e.length; t < n; t++) this.addLayer(e[t])
            },
            _addZoomLimit: function(e) {
                if (isNaN(e.options.maxZoom) || !isNaN(e.options.minZoom)) this._zoomBoundLayers[r.stamp(e)] = e, this._updateZoomLevels()
            },
            _removeZoomLimit: function(e) {
                var t = r.stamp(e);
                this._zoomBoundLayers[t] && (delete this._zoomBoundLayers[t], this._updateZoomLevels())
            },
            _updateZoomLevels: function() {
                var e = Infinity,
                    t = -Infinity,
                    r = this._getZoomSpan();
                for (var i in this._zoomBoundLayers) {
                    var s = this._zoomBoundLayers[i].options;
                    e = s.minZoom === n ? e : Math.min(e, s.minZoom), t = s.maxZoom === n ? t : Math.max(t, s.maxZoom)
                }
                this._layersMaxZoom = t === -Infinity ? n : t, this._layersMinZoom = e === Infinity ? n : e, r !== this._getZoomSpan() && this.fire("zoomlevelschange")
            }
        }), r.Projection.Mercator = {
            R: 6378137,
            R_MINOR: 6356752.314245179,
            bounds: r.bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),
            project: function(e) {
                var t = Math.PI / 180,
                    n = this.R,
                    i = e.lat * t,
                    s = this.R_MINOR / n,
                    o = Math.sqrt(1 - s * s),
                    u = o * Math.sin(i),
                    a = Math.tan(Math.PI / 4 - i / 2) / Math.pow((1 - u) / (1 + u), o / 2);
                return i = -n * Math.log(Math.max(a, 1e-10)), new r.Point(e.lng * t * n, i)
            },
            unproject: function(e) {
                var t = 180 / Math.PI,
                    n = this.R,
                    i = this.R_MINOR / n,
                    s = Math.sqrt(1 - i * i),
                    o = Math.exp(-e.y / n),
                    u = Math.PI / 2 - 2 * Math.atan(o);
                for (var a = 0, f = .1, l; a < 15 && Math.abs(f) > 1e-7; a++) l = s * Math.sin(u), l = Math.pow((1 - l) / (1 + l), s / 2), f = Math.PI / 2 - 2 * Math.atan(o * l) - u, u += f;
                return new r.LatLng(u * t, e.x * t / n)
            }
        }, r.CRS.EPSG3395 = r.extend({}, r.CRS.Earth, {
            code: "EPSG:3395",
            projection: r.Projection.Mercator,
            transformation: function() {
                var e = .5 / (Math.PI * r.Projection.Mercator.R);
                return new r.Transformation(e, .5, -e, .5)
            }()
        }), r.GridLayer = r.Layer.extend({
            options: {
                pane: "tilePane",
                tileSize: 256,
                opacity: 1,
                updateWhenIdle: r.Browser.mobile,
                updateInterval: 200,
                attribution: null,
                zIndex: null,
                bounds: null,
                minZoom: 0
            },
            initialize: function(e) {
                e = r.setOptions(this, e)
            },
            onAdd: function() {
                this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView(), this._update()
            },
            beforeAdd: function(e) {
                e._addZoomLimit(this)
            },
            onRemove: function(e) {
                r.DomUtil.remove(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = null
            },
            bringToFront: function() {
                return this._map && (r.DomUtil.toFront(this._container), this._setAutoZIndex(Math.max)), this
            },
            bringToBack: function() {
                return this._map && (r.DomUtil.toBack(this._container), this._setAutoZIndex(Math.min)), this
            },
            getAttribution: function() {
                return this.options.attribution
            },
            getContainer: function() {
                return this._container
            },
            setOpacity: function(e) {
                return this.options.opacity = e, this._updateOpacity(), this
            },
            setZIndex: function(e) {
                return this.options.zIndex = e, this._updateZIndex(), this
            },
            isLoading: function() {
                return this._loading
            },
            redraw: function() {
                return this._map && (this._removeAllTiles(), this._update()), this
            },
            getEvents: function() {
                var e = {
                    viewreset: this._resetAll,
                    zoom: this._resetView,
                    moveend: this._onMoveEnd
                };
                return this.options.updateWhenIdle || (this._onMove || (this._onMove = r.Util.throttle(this._onMoveEnd, this.options.updateInterval, this)), e.move = this._onMove), this._zoomAnimated && (e.zoomanim = this._animateZoom), e
            },
            createTile: function() {
                return t.createElement("div")
            },
            getTileSize: function() {
                var e = this.options.tileSize;
                return e instanceof r.Point ? e : new r.Point(e, e)
            },
            _updateZIndex: function() {
                this._container && this.options.zIndex !== n && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex)
            },
            _setAutoZIndex: function(e) {
                var t = this.getPane().children,
                    n = -e(-Infinity, Infinity);
                for (var r = 0, i = t.length, s; r < i; r++) s = t[r].style.zIndex, t[r] !== this._container && s && (n = e(n, +s));
                isFinite(n) && (this.options.zIndex = n + e(-1, 1), this._updateZIndex())
            },
            _updateOpacity: function() {
                if (!this._map) return;
                var e = this.options.opacity;
                if (!r.Browser.ielt9 && !this._map._fadeAnimated) {
                    r.DomUtil.setOpacity(this._container, e);
                    return
                }
                var t = +(new Date),
                    n = !1,
                    i = !1;
                for (var s in this._tiles) {
                    var o = this._tiles[s];
                    if (!o.current || !o.loaded) continue;
                    var u = Math.min(1, (t - o.loaded) / 200);
                    u < 1 ? (r.DomUtil.setOpacity(o.el, e * u), n = !0) : (r.DomUtil.setOpacity(o.el, e), o.active && (i = !0), o.active = !0)
                }
                i && this._pruneTiles(), n && (r.Util.cancelAnimFrame(this._fadeFrame), this._fadeFrame = r.Util.requestAnimFrame(this._updateOpacity, this))
            },
            _initContainer: function() {
                if (this._container) return;
                this._container = r.DomUtil.create("div", "leaflet-layer"), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container)
            },
            _updateLevels: function() {
                var e = this._tileZoom,
                    t = this.options.maxZoom;
                for (var n in this._levels) this._levels[n].el.children.length || n === e ? this._levels[n].el.style.zIndex = t - Math.abs(e - n) : (r.DomUtil.remove(this._levels[n].el), delete this._levels[n]);
                var i = this._levels[e],
                    s = this._map;
                return i || (i = this._levels[e] = {}, i.el = r.DomUtil.create("div", "leaflet-tile-container leaflet-zoom-animated", this._container), i.el.style.zIndex = t, i.origin = s.project(s.unproject(s.getPixelOrigin()), e).round(), i.zoom = e, this._setZoomTransform(i, s.getCenter(), s.getZoom()), r.Util.falseFn(i.el.offsetWidth)), this._level = i, i
            },
            _pruneTiles: function() {
                var e, t, n = this._map.getZoom();
                if (n > this.options.maxZoom || n < this.options.minZoom) return this._removeAllTiles();
                for (e in this._tiles) t = this._tiles[e], t.retain = t.current;
                for (e in this._tiles) {
                    t = this._tiles[e];
                    if (t.current && !t.active) {
                        var r = t.coords;
                        this._retainParent(r.x, r.y, r.z, r.z - 5) || this._retainChildren(r.x, r.y, r.z, r.z + 2)
                    }
                }
                for (e in this._tiles) this._tiles[e].retain || this._removeTile(e)
            },
            _removeAllTiles: function() {
                for (var e in this._tiles) this._removeTile(e)
            },
            _resetAll: function() {
                for (var e in this._levels) r.DomUtil.remove(this._levels[e].el), delete this._levels[e];
                this._removeAllTiles(), this._tileZoom = null, this._resetView()
            },
            _retainParent: function(e, t, n, r) {
                var i = Math.floor(e / 2),
                    s = Math.floor(t / 2),
                    o = n - 1,
                    u = i + ":" + s + ":" + o,
                    a = this._tiles[u];
                return a && a.active ? (a.retain = !0, !0) : (a && a.loaded && (a.retain = !0), o > r ? this._retainParent(i, s, o, r) : !1)
            },
            _retainChildren: function(e, t, n, r) {
                for (var i = 2 * e; i < 2 * e + 2; i++)
                    for (var s = 2 * t; s < 2 * t + 2; s++) {
                        var o = i + ":" + s + ":" + (n + 1),
                            u = this._tiles[o];
                        if (u && u.active) {
                            u.retain = !0;
                            continue
                        }
                        u && u.loaded && (u.retain = !0), n + 1 < r && this._retainChildren(i, s, n + 1, r)
                    }
            },
            _resetView: function(e) {
                var t = e && e.pinch;
                this._setView(this._map.getCenter(), this._map.getZoom(), t, t)
            },
            _animateZoom: function(e) {
                this._setView(e.center, e.zoom, !0, e.noUpdate)
            },
            _setView: function(e, t, n, i) {
                var s = Math.round(t),
                    o = this._tileZoom !== s;
                !i && o && (this._abortLoading && this._abortLoading(), this._tileZoom = s, this._updateLevels(), this._resetGrid(), r.Browser.mobileWebkit || this._update(e, s), n || this._pruneTiles()), this._setZoomTransforms(e, t)
            },
            _setZoomTransforms: function(e, t) {
                for (var n in this._levels) this._setZoomTransform(this._levels[n], e, t)
            },
            _setZoomTransform: function(e, t, n) {
                var i = this._map.getZoomScale(n, e.zoom),
                    s = e.origin.multiplyBy(i).subtract(this._map._getNewPixelOrigin(t, n)).round();
                r.Browser.any3d ? r.DomUtil.setTransform(e.el, s, i) : r.DomUtil.setPosition(e.el, s)
            },
            _resetGrid: function() {
                var e = this._map,
                    t = e.options.crs,
                    n = this._tileSize = this.getTileSize(),
                    r = this._tileZoom,
                    i = this._map.getPixelWorldBounds(this._tileZoom);
                i && (this._globalTileRange = this._pxBoundsToTileRange(i)), this._wrapX = t.wrapLng && [Math.floor(e.project([0, t.wrapLng[0]], r).x / n.x), Math.ceil(e.project([0, t.wrapLng[1]], r).x / n.y)], this._wrapY = t.wrapLat && [Math.floor(e.project([t.wrapLat[0], 0], r).y / n.x), Math.ceil(e.project([t.wrapLat[1], 0], r).y / n.y)]
            },
            _onMoveEnd: function() {
                if (!this._map) return;
                this._update(), this._pruneTiles()
            },
            _getTiledPixelBounds: function(e, t, n) {
                var i = this._map,
                    s = i.getZoomScale(t, n),
                    o = i.project(e, n).floor(),
                    u = i.getSize().divideBy(s * 2);
                return new r.Bounds(o.subtract(u), o.add(u))
            },
            _update: function(e, i) {
                var s = this._map;
                if (!s) return;
                e === n && (e = s.getCenter()), i === n && (i = s.getZoom());
                var o = Math.round(i);
                if (o > this.options.maxZoom || o < this.options.minZoom) return;
                var u = this._getTiledPixelBounds(e, i, o),
                    a = this._pxBoundsToTileRange(u),
                    f = a.getCenter(),
                    l = [];
                for (var c in this._tiles) this._tiles[c].current = !1;
                for (var h = a.min.y; h <= a.max.y; h++)
                    for (var p = a.min.x; p <= a.max.x; p++) {
                        var d = new r.Point(p, h);
                        d.z = o;
                        if (!this._isValidTile(d)) continue;
                        var v = this._tiles[this._tileCoordsToKey(d)];
                        v ? v.current = !0 : l.push(d)
                    }
                l.sort(function(e, t) {
                    return e.distanceTo(f) - t.distanceTo(f)
                });
                if (l.length !== 0) {
                    this._loading || (this._loading = !0, this.fire("loading"));
                    var m = t.createDocumentFragment();
                    for (p = 0; p < l.length; p++) this._addTile(l[p], m);
                    this._level.el.appendChild(m)
                }
            },
            _isValidTile: function(e) {
                var t = this._map.options.crs;
                if (!t.infinite) {
                    var n = this._globalTileRange;
                    if (!t.wrapLng && (e.x < n.min.x || e.x > n.max.x) || !t.wrapLat && (e.y < n.min.y || e.y > n.max.y)) return !1
                }
                if (!this.options.bounds) return !0;
                var i = this._tileCoordsToBounds(e);
                return r.latLngBounds(this.options.bounds).overlaps(i)
            },
            _keyToBounds: function(e) {
                return this._tileCoordsToBounds(this._keyToTileCoords(e))
            },
            _tileCoordsToBounds: function(e) {
                var t = this._map,
                    n = this.getTileSize(),
                    i = e.scaleBy(n),
                    s = i.add(n),
                    o = t.wrapLatLng(t.unproject(i, e.z)),
                    u = t.wrapLatLng(t.unproject(s, e.z));
                return new r.LatLngBounds(o, u)
            },
            _tileCoordsToKey: function(e) {
                return e.x + ":" + e.y + ":" + e.z
            },
            _keyToTileCoords: function(e) {
                var t = e.split(":"),
                    n = new r.Point(+t[0], +t[1]);
                return n.z = +t[2], n
            },
            _removeTile: function(e) {
                var t = this._tiles[e];
                if (!t) return;
                r.DomUtil.remove(t.el), delete this._tiles[e], this.fire("tileunload", {
                    tile: t.el,
                    coords: this._keyToTileCoords(e)
                })
            },
            _initTile: function(e) {
                r.DomUtil.addClass(e, "leaflet-tile");
                var t = this.getTileSize();
                e.style.width = t.x + "px", e.style.height = t.y + "px", e.onselectstart = r.Util.falseFn, e.onmousemove = r.Util.falseFn, r.Browser.ielt9 && this.options.opacity < 1 && r.DomUtil.setOpacity(e, this.options.opacity), r.Browser.android && !r.Browser.android23 && (e.style.WebkitBackfaceVisibility = "hidden")
            },
            _addTile: function(e, t) {
                var n = this._getTilePos(e),
                    i = this._tileCoordsToKey(e),
                    s = this.createTile(this._wrapCoords(e), r.bind(this._tileReady, this, e));
                this._initTile(s), this.createTile.length < 2 && setTimeout(r.bind(this._tileReady, this, e, null, s), 0), r.DomUtil.setPosition(s, n), this._tiles[i] = {
                    el: s,
                    coords: e,
                    current: !0
                }, t.appendChild(s), this.fire("tileloadstart", {
                    tile: s,
                    coords: e
                })
            },
            _tileReady: function(e, t, n) {
                if (!this._map) return;
                t && this.fire("tileerror", {
                    error: t,
                    tile: n,
                    coords: e
                });
                var i = this._tileCoordsToKey(e);
                n = this._tiles[i];
                if (!n) return;
                n.loaded = +(new Date), this._map._fadeAnimated ? (r.DomUtil.setOpacity(n.el, 0), r.Util.cancelAnimFrame(this._fadeFrame), this._fadeFrame = r.Util.requestAnimFrame(this._updateOpacity, this)) : (n.active = !0, this._pruneTiles()), r.DomUtil.addClass(n.el, "leaflet-tile-loaded"), this.fire("tileload", {
                    tile: n.el,
                    coords: e
                }), this._noTilesToLoad() && (this._loading = !1, this.fire("load"))
            },
            _getTilePos: function(e) {
                return e.scaleBy(this.getTileSize()).subtract(this._level.origin)
            },
            _wrapCoords: function(e) {
                var t = new r.Point(this._wrapX ? r.Util.wrapNum(e.x, this._wrapX) : e.x, this._wrapY ? r.Util.wrapNum(e.y, this._wrapY) : e.y);
                return t.z = e.z, t
            },
            _pxBoundsToTileRange: function(e) {
                var t = this.getTileSize();
                return new r.Bounds(e.min.unscaleBy(t).floor(), e.max.unscaleBy(t).ceil().subtract([1, 1]))
            },
            _noTilesToLoad: function() {
                for (var e in this._tiles)
                    if (!this._tiles[e].loaded) return !1;
                return !0
            }
        }), r.gridLayer = function(e) {
            return new r.GridLayer(e)
        }, r.TileLayer = r.GridLayer.extend({
            options: {
                maxZoom: 18,
                subdomains: "abc",
                errorTileUrl: "",
                zoomOffset: 0,
                maxNativeZoom: null,
                tms: !1,
                zoomReverse: !1,
                detectRetina: !1,
                crossOrigin: !1
            },
            initialize: function(e, t) {
                this._url = e, t = r.setOptions(this, t), t.detectRetina && r.Browser.retina && t.maxZoom > 0 && (t.tileSize = Math.floor(t.tileSize / 2), t.zoomOffset++, t.minZoom = Math.max(0, t.minZoom), t.maxZoom--), typeof t.subdomains == "string" && (t.subdomains = t.subdomains.split("")), r.Browser.android || this.on("tileunload", this._onTileRemove)
            },
            setUrl: function(e, t) {
                return this._url = e, t || this.redraw(), this
            },
            createTile: function(e, n) {
                var i = t.createElement("img");
                return i.onload = r.bind(this._tileOnLoad, this, n, i), i.onerror = r.bind(this._tileOnError, this, n, i), this.options.crossOrigin && (i.crossOrigin = ""), i.alt = "", i.src = this.getTileUrl(e), i
            },
            getTileUrl: function(e) {
                return r.Util.template(this._url, r.extend({
                    r: this.options.detectRetina && r.Browser.retina && this.options.maxZoom > 0 ? "@2x" : "",
                    s: this._getSubdomain(e),
                    x: e.x,
                    y: this.options.tms ? this._globalTileRange.max.y - e.y : e.y,
                    z: this._getZoomForUrl()
                }, this.options))
            },
            _tileOnLoad: function(e, t) {
                r.Browser.ielt9 ? setTimeout(r.bind(e, this, null, t), 0) : e(null, t)
            },
            _tileOnError: function(e, t, n) {
                var r = this.options.errorTileUrl;
                r && (t.src = r), e(n, t)
            },
            getTileSize: function() {
                var e = this._map,
                    t = r.GridLayer.prototype.getTileSize.call(this),
                    n = this._tileZoom + this.options.zoomOffset,
                    i = this.options.maxNativeZoom;
                return i !== null && n > i ? t.divideBy(e.getZoomScale(i, n)).round() : t
            },
            _onTileRemove: function(e) {
                e.tile.onload = null
            },
            _getZoomForUrl: function() {
                var e = this.options,
                    t = this._tileZoom;
                return e.zoomReverse && (t = e.maxZoom - t), t += e.zoomOffset, e.maxNativeZoom ? Math.min(t, e.maxNativeZoom) : t
            },
            _getSubdomain: function(e) {
                var t = Math.abs(e.x + e.y) % this.options.subdomains.length;
                return this.options.subdomains[t]
            },
            _abortLoading: function() {
                var e, t;
                for (e in this._tiles) t = this._tiles[e].el, t.onload = r.Util.falseFn, t.onerror = r.Util.falseFn, t.complete || (t.src = r.Util.emptyImageUrl, r.DomUtil.remove(t))
            }
        }), r.tileLayer = function(e, t) {
            return new r.TileLayer(e, t)
        }, r.TileLayer.WMS = r.TileLayer.extend({
            defaultWmsParams: {
                service: "WMS",
                request: "GetMap",
                version: "1.1.1",
                layers: "",
                styles: "",
                format: "image/jpeg",
                transparent: !1
            },
            options: {
                crs: null,
                uppercase: !1
            },
            initialize: function(e, t) {
                this._url = e;
                var n = r.extend({}, this.defaultWmsParams);
                for (var i in t) i in this.options || (n[i] = t[i]);
                t = r.setOptions(this, t), n.width = n.height = t.tileSize * (t.detectRetina && r.Browser.retina ? 2 : 1), this.wmsParams = n
            },
            onAdd: function(e) {
                this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
                var t = this._wmsVersion >= 1.3 ? "crs" : "srs";
                this.wmsParams[t] = this._crs.code, r.TileLayer.prototype.onAdd.call(this, e)
            },
            getTileUrl: function(e) {
                var t = this._tileCoordsToBounds(e),
                    n = this._crs.project(t.getNorthWest()),
                    i = this._crs.project(t.getSouthEast()),
                    s = (this._wmsVersion >= 1.3 && this._crs === r.CRS.EPSG4326 ? [i.y, n.x, n.y, i.x] : [n.x, i.y, i.x, n.y]).join(","),
                    o = r.TileLayer.prototype.getTileUrl.call(this, e);
                return o + r.Util.getParamString(this.wmsParams, o, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + s
            },
            setParams: function(e, t) {
                return r.extend(this.wmsParams, e), t || this.redraw(), this
            }
        }), r.tileLayer.wms = function(e, t) {
            return new r.TileLayer.WMS(e, t)
        }, r.ImageOverlay = r.Layer.extend({
            options: {
                opacity: 1,
                alt: "",
                interactive: !1
            },
            initialize: function(e, t, n) {
                this._url = e, this._bounds = r.latLngBounds(t), r.setOptions(this, n)
            },
            onAdd: function() {
                this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (r.DomUtil.addClass(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset()
            },
            onRemove: function() {
                r.DomUtil.remove(this._image), this.options.interactive && this.removeInteractiveTarget(this._image)
            },
            setOpacity: function(e) {
                return this.options.opacity = e, this._image && this._updateOpacity(), this
            },
            setStyle: function(e) {
                return e.opacity && this.setOpacity(e.opacity), this
            },
            bringToFront: function() {
                return this._map && r.DomUtil.toFront(this._image), this
            },
            bringToBack: function() {
                return this._map && r.DomUtil.toBack(this._image), this
            },
            setUrl: function(e) {
                return this._url = e, this._image && (this._image.src = e), this
            },
            getAttribution: function() {
                return this.options.attribution
            },
            getEvents: function() {
                var e = {
                    zoom: this._reset,
                    viewreset: this._reset
                };
                return this._zoomAnimated && (e.zoomanim = this._animateZoom), e
            },
            getBounds: function() {
                return this._bounds
            },
            getElement: function() {
                return this._image
            },
            _initImage: function() {
                var e = this._image = r.DomUtil.create("img", "leaflet-image-layer " + (this._zoomAnimated ? "leaflet-zoom-animated" : ""));
                e.onselectstart = r.Util.falseFn, e.onmousemove = r.Util.falseFn, e.onload = r.bind(this.fire, this, "load"), this.options.crossOrigin && (e.crossOrigin = ""), e.src = this._url, e.alt = this.options.alt
            },
            _animateZoom: function(e) {
                var t = this._map.getZoomScale(e.zoom),
                    n = this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center);
                r.DomUtil.setTransform(this._image, n, t)
            },
            _reset: function() {
                var e = this._image,
                    t = new r.Bounds(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
                    n = t.getSize();
                r.DomUtil.setPosition(e, t.min), e.style.width = n.x + "px", e.style.height = n.y + "px"
            },
            _updateOpacity: function() {
                r.DomUtil.setOpacity(this._image, this.options.opacity)
            }
        }), r.imageOverlay = function(e, t, n) {
            return new r.ImageOverlay(e, t, n)
        }, r.Icon = r.Class.extend({
            initialize: function(e) {
                r.setOptions(this, e)
            },
            createIcon: function(e) {
                return this._createIcon("icon", e)
            },
            createShadow: function(e) {
                return this._createIcon("shadow", e)
            },
            _createIcon: function(e, t) {
                var n = this._getIconUrl(e);
                if (!n) {
                    if (e === "icon") throw Error("iconUrl not set in Icon options (see the docs).");
                    return null
                }
                var r = this._createImg(n, t && t.tagName === "IMG" ? t : null);
                return this._setIconStyles(r, e), r
            },
            _setIconStyles: function(e, t) {
                var n = this.options,
                    i = r.point(n[t + "Size"]),
                    s = r.point(t === "shadow" && n.shadowAnchor || n.iconAnchor || i && i.divideBy(2, !0));
                e.className = "leaflet-marker-" + t + " " + (n.className || ""), s && (e.style.marginLeft = -s.x + "px", e.style.marginTop = -s.y + "px"), i && (e.style.width = i.x + "px", e.style.height = i.y + "px")
            },
            _createImg: function(e, n) {
                return n = n || t.createElement("img"), n.src = e, n
            },
            _getIconUrl: function(e) {
                return r.Browser.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"]
            }
        }), r.icon = function(e) {
            return new r.Icon(e)
        }, r.Icon.Default = r.Icon.extend({
            options: {
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            },
            _getIconUrl: function(e) {
                var t = e + "Url";
                if (this.options[t]) return this.options[t];
                var n = r.Icon.Default.imagePath;
                if (!n) throw Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
                return n + "/marker-" + e + (r.Browser.retina && e === "icon" ? "-2x" : "") + ".png"
            }
        }), r.Icon.Default.imagePath = function() {
            var e = t.getElementsByTagName("script"),
                n = /[\/^]webatlas[\-\._]?([\w\-\._]*)\.js\??/,
                r, i, s, o;
            for (r = 0, i = e.length; r < i; r++) {
                s = e[r].src;
                if (s.match(n)) return o = s.split(n)[0], (o ? o + "/" : "") + "images"
            }
        }(), r.Marker = r.Layer.extend({
            options: {
                pane: "markerPane",
                nonBubblingEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
                icon: new r.Icon.Default,
                interactive: !0,
                keyboard: !0,
                zIndexOffset: 0,
                opacity: 1,
                riseOffset: 250
            },
            initialize: function(e, t) {
                r.setOptions(this, t), this._latlng = r.latLng(e)
            },
            onAdd: function(e) {
                this._zoomAnimated = this._zoomAnimated && e.options.markerZoomAnimation, this._initIcon(), this.update()
            },
            onRemove: function() {
                this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), this._removeIcon(), this._removeShadow()
            },
            getEvents: function() {
                var e = {
                    zoom: this.update,
                    viewreset: this.update
                };
                return this._zoomAnimated && (e.zoomanim = this._animateZoom), e
            },
            getLatLng: function() {
                return this._latlng
            },
            setLatLng: function(e) {
                var t = this._latlng;
                return this._latlng = r.latLng(e), this.update(), this.fire("move", {
                    oldLatLng: t,
                    latlng: this._latlng
                })
            },
            setZIndexOffset: function(e) {
                return this.options.zIndexOffset = e, this.update()
            },
            setIcon: function(e) {
                return this.options.icon = e, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this
            },
            getElement: function() {
                return this._icon
            },
            update: function() {
                if (this._icon) {
                    var e = this._map.latLngToLayerPoint(this._latlng).round();
                    this._setPos(e)
                }
                return this
            },
            _initIcon: function() {
                var e = this.options,
                    t = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"),
                    n = e.icon.createIcon(this._icon),
                    i = !1;
                n !== this._icon && (this._icon && this._removeIcon(), i = !0, e.title && (n.title = e.title), e.alt && (n.alt = e.alt)), r.DomUtil.addClass(n, t), e.keyboard && (n.tabIndex = "0"), this._icon = n, this._initInteraction(), e.riseOnHover && this.on({
                    mouseover: this._bringToFront,
                    mouseout: this._resetZIndex
                });
                var s = e.icon.createShadow(this._shadow),
                    o = !1;
                s !== this._shadow && (this._removeShadow(), o = !0), s && r.DomUtil.addClass(s, t), this._shadow = s, e.opacity < 1 && this._updateOpacity(), i && this.getPane().appendChild(this._icon), s && o && this.getPane("shadowPane").appendChild(this._shadow)
            },
            _removeIcon: function() {
                this.options.riseOnHover && this.off({
                    mouseover: this._bringToFront,
                    mouseout: this._resetZIndex
                }), r.DomUtil.remove(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null
            },
            _removeShadow: function() {
                this._shadow && r.DomUtil.remove(this._shadow), this._shadow = null
            },
            _setPos: function(e) {
                r.DomUtil.setPosition(this._icon, e), this._shadow && r.DomUtil.setPosition(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex()
            },
            _updateZIndex: function(e) {
                this._icon.style.zIndex = this._zIndex + e
            },
            _animateZoom: function(e) {
                var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
                this._setPos(t)
            },
            _initInteraction: function() {
                if (!this.options.interactive) return;
                r.DomUtil.addClass(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon);
                if (r.Handler.MarkerDrag) {
                    var e = this.options.draggable;
                    this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new r.Handler.MarkerDrag(this), e && this.dragging.enable()
                }
            },
            setOpacity: function(e) {
                return this.options.opacity = e, this._map && this._updateOpacity(), this
            },
            _updateOpacity: function() {
                var e = this.options.opacity;
                r.DomUtil.setOpacity(this._icon, e), this._shadow && r.DomUtil.setOpacity(this._shadow, e)
            },
            _bringToFront: function() {
                this._updateZIndex(this.options.riseOffset)
            },
            _resetZIndex: function() {
                this._updateZIndex(0)
            }
        }), r.marker = function(e, t) {
            return new r.Marker(e, t)
        }, r.DivIcon = r.Icon.extend({
            options: {
                iconSize: [12, 12],
                className: "leaflet-div-icon",
                html: !1
            },
            createIcon: function(e) {
                var n = e && e.tagName === "DIV" ? e : t.createElement("div"),
                    r = this.options;
                return n.innerHTML = r.html !== !1 ? r.html : "", r.bgPos && (n.style.backgroundPosition = -r.bgPos.x + "px " + -r.bgPos.y + "px"), this._setIconStyles(n, "icon"), n
            },
            createShadow: function() {
                return null
            }
        }), r.divIcon = function(e) {
            return new r.DivIcon(e)
        }, r.Map.mergeOptions({
            closePopupOnClick: !0
        }), r.Popup = r.Layer.extend({
            options: {
                pane: "popupPane",
                minWidth: 50,
                maxWidth: 300,
                offset: [0, 7],
                autoPan: !0,
                autoPanPadding: [5, 5],
                closeButton: !0,
                autoClose: !0,
                zoomAnimation: !0
            },
            initialize: function(e, t) {
                r.setOptions(this, e), this._source = t
            },
            onAdd: function(e) {
                this._zoomAnimated = this._zoomAnimated && this.options.zoomAnimation, this._container || this._initLayout(), e._fadeAnimated && r.DomUtil.setOpacity(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && r.DomUtil.setOpacity(this._container, 1), e.fire("popupopen", {
                    popup: this
                }), this._source && this._source.fire("popupopen", {
                    popup: this
                }, !0)
            },
            openOn: function(e) {
                return e.openPopup(this), this
            },
            onRemove: function(e) {
                e._fadeAnimated ? (r.DomUtil.setOpacity(this._container, 0), this._removeTimeout = setTimeout(r.bind(r.DomUtil.remove, r.DomUtil, this._container), 200)) : r.DomUtil.remove(this._container), e.fire("popupclose", {
                    popup: this
                }), this._source && this._source.fire("popupclose", {
                    popup: this
                }, !0)
            },
            getLatLng: function() {
                return this._latlng
            },
            setLatLng: function(e) {
                return this._latlng = r.latLng(e), this._map && (this._updatePosition(), this._adjustPan()), this
            },
            getContent: function() {
                return this._content
            },
            setContent: function(e) {
                return this._content = e, this.update(), this
            },
            getElement: function() {
                return this._container
            },
            update: function() {
                if (!this._map) return;
                this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan()
            },
            getEvents: function() {
                var e = {
                    zoom: this._updatePosition,
                    viewreset: this._updatePosition
                };
                this._zoomAnimated && (e.zoomanim = this._animateZoom);
                if ("closeOnClick" in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) e.preclick = this._close;
                return this.options.keepInView && (e.moveend = this._adjustPan), e
            },
            isOpen: function() {
                return !!this._map && this._map.hasLayer(this)
            },
            _close: function() {
                this._map && this._map.closePopup(this)
            },
            _initLayout: function() {
                var e = "leaflet-popup",
                    t = this._container = r.DomUtil.create("div", e + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"));
                if (this.options.closeButton) {
                    var n = this._closeButton = r.DomUtil.create("a", e + "-close-button", t);
                    n.href = "#close", n.innerHTML = "&#215;", r.DomEvent.on(n, "click", this._onCloseButtonClick, this)
                }
                var i = this._wrapper = r.DomUtil.create("div", e + "-content-wrapper", t);
                this._contentNode = r.DomUtil.create("div", e + "-content", i), r.DomEvent.disableClickPropagation(i).disableScrollPropagation(this._contentNode).on(i, "contextmenu", r.DomEvent.stopPropagation), this._tipContainer = r.DomUtil.create("div", e + "-tip-container", t), this._tip = r.DomUtil.create("div", e + "-tip", this._tipContainer)
            },
            _updateContent: function() {
                if (!this._content) return;
                var e = this._contentNode,
                    t = typeof this._content == "function" ? this._content(this._source || this) : this._content;
                if (typeof t == "string") e.innerHTML = t;
                else {
                    while (e.hasChildNodes()) e.removeChild(e.firstChild);
                    e.appendChild(t)
                }
                this.fire("contentupdate")
            },
            _updateLayout: function() {
                var e = this._contentNode,
                    t = e.style;
                t.width = "", t.whiteSpace = "nowrap";
                var n = e.offsetWidth;
                n = Math.min(n, this.options.maxWidth), n = Math.max(n, this.options.minWidth), t.width = n + 1 + "px", t.whiteSpace = "", t.height = "";
                var i = e.offsetHeight,
                    s = this.options.maxHeight,
                    o = "leaflet-popup-scrolled";
                s && i > s ? (t.height = s + "px", r.DomUtil.addClass(e, o)) : r.DomUtil.removeClass(e, o), this._containerWidth = this._container.offsetWidth
            },
            _updatePosition: function() {
                if (!this._map) return;
                var e = this._map.latLngToLayerPoint(this._latlng),
                    t = r.point(this.options.offset);
                this._zoomAnimated ? r.DomUtil.setPosition(this._container, e) : t = t.add(e);
                var n = this._containerBottom = -t.y,
                    i = this._containerLeft = -Math.round(this._containerWidth / 2) + t.x;
                this._container.style.bottom = n + "px", this._container.style.left = i + "px"
            },
            _animateZoom: function(e) {
                var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
                r.DomUtil.setPosition(this._container, t)
            },
            _adjustPan: function() {
                if (!this.options.autoPan) return;
                var e = this._map,
                    t = this._container.offsetHeight,
                    n = this._containerWidth,
                    i = new r.Point(this._containerLeft, -t - this._containerBottom);
                this._zoomAnimated && i._add(r.DomUtil.getPosition(this._container));
                var s = e.layerPointToContainerPoint(i),
                    o = r.point(this.options.autoPanPadding),
                    u = r.point(this.options.autoPanPaddingTopLeft || o),
                    a = r.point(this.options.autoPanPaddingBottomRight || o),
                    f = e.getSize(),
                    l = 0,
                    c = 0;
                s.x + n + a.x > f.x && (l = s.x + n - f.x + a.x), s.x - l - u.x < 0 && (l = s.x - u.x), s.y + t + a.y > f.y && (c = s.y + t - f.y + a.y), s.y - c - u.y < 0 && (c = s.y - u.y), (l || c) && e.fire("autopanstart").panBy([l, c])
            },
            _onCloseButtonClick: function(e) {
                this._close(), r.DomEvent.stop(e)
            }
        }), r.popup = function(e, t) {
            return new r.Popup(e, t)
        }, r.Map.include({
            openPopup: function(e, t, n) {
                return e instanceof r.Popup || (e = (new r.Popup(n)).setContent(e)), t && e.setLatLng(t), this.hasLayer(e) ? this : (this._popup && this._popup.options.autoClose && this.closePopup(), this._popup = e, this.addLayer(e))
            },
            closePopup: function(e) {
                if (!e || e === this._popup) e = this._popup, this._popup = null;
                return e && this.removeLayer(e), this
            }
        }), r.Layer.include({
            bindPopup: function(e, t) {
                if (e instanceof r.Popup) r.setOptions(e, t), this._popup = e, e._source = this;
                else {
                    if (!this._popup || t) this._popup = new r.Popup(t, this);
                    this._popup.setContent(e)
                }
                return this._popupHandlersAdded || (this.on({
                    click: this._openPopup,
                    remove: this.closePopup,
                    move: this._movePopup
                }), this._popupHandlersAdded = !0), this._originalPopupOffset = this._popup.options.offset, this
            },
            unbindPopup: function() {
                return this._popup && (this.off({
                    click: this._openPopup,
                    remove: this.closePopup,
                    move: this._movePopup
                }), this._popupHandlersAdded = !1, this._popup = null), this
            },
            openPopup: function(e, t) {
                e instanceof r.Layer || (t = e, e = this);
                if (e instanceof r.FeatureGroup)
                    for (var n in this._layers) {
                        e = this._layers[n];
                        break
                    }
                return t || (t = e.getCenter ? e.getCenter() : e.getLatLng()), this._popup && this._map && (this._popup.options.offset = this._popupAnchor(e), this._popup._source = e, this._popup.update(), this._map.openPopup(this._popup, t)), this
            },
            closePopup: function() {
                return this._popup && this._popup._close(), this
            },
            togglePopup: function(e) {
                return this._popup && (this._popup._map ? this.closePopup() : this.openPopup(e)), this
            },
            setPopupContent: function(e) {
                return this._popup && this._popup.setContent(e), this
            },
            getPopup: function() {
                return this._popup
            },
            _openPopup: function(e) {
                var t = e.layer || e.target;
                if (!this._popup) return;
                if (!this._map) return;
                if (t instanceof r.Path) {
                    this.openPopup(e.layer || e.target, e.latlng);
                    return
                }
                this._map.hasLayer(this._popup) && this._popup._source === t ? this.closePopup() : this.openPopup(t, e.latlng)
            },
            _popupAnchor: function(e) {
                var t = e._getPopupAnchor ? e._getPopupAnchor() : [0, 0],
                    n = this._originalPopupOffset || r.Popup.prototype.options.offset;
                return r.point(t).add(n)
            },
            _movePopup: function(e) {
                this._popup.setLatLng(e.latlng)
            }
        }), r.Marker.include({
            _getPopupAnchor: function() {
                return this.options.icon.options.popupAnchor || [0, 0]
            }
        }), r.LayerGroup = r.Layer.extend({
            initialize: function(e) {
                this._layers = {};
                var t, n;
                if (e)
                    for (t = 0, n = e.length; t < n; t++) this.addLayer(e[t])
            },
            addLayer: function(e) {
                var t = this.getLayerId(e);
                return this._layers[t] = e, this._map && this._map.addLayer(e), this
            },
            removeLayer: function(e) {
                var t = e in this._layers ? e : this.getLayerId(e);
                return this._map && this._layers[t] && this._map.removeLayer(this._layers[t]), delete this._layers[t], this
            },
            hasLayer: function(e) {
                return !!e && (e in this._layers || this.getLayerId(e) in this._layers)
            },
            clearLayers: function() {
                for (var e in this._layers) this.removeLayer(this._layers[e]);
                return this
            },
            invoke: function(e) {
                var t = Array.prototype.slice.call(arguments, 1),
                    n, r;
                for (n in this._layers) r = this._layers[n], r[e] && r[e].apply(r, t);
                return this
            },
            onAdd: function(e) {
                for (var t in this._layers) e.addLayer(this._layers[t])
            },
            onRemove: function(e) {
                for (var t in this._layers) e.removeLayer(this._layers[t])
            },
            eachLayer: function(e, t) {
                for (var n in this._layers) e.call(t, this._layers[n]);
                return this
            },
            getLayer: function(e) {
                return this._layers[e]
            },
            getLayers: function() {
                var e = [];
                for (var t in this._layers) e.push(this._layers[t]);
                return e
            },
            setZIndex: function(e) {
                return this.invoke("setZIndex", e)
            },
            getLayerId: function(e) {
                return r.stamp(e)
            }
        }), r.layerGroup = function(e) {
            return new r.LayerGroup(e)
        }, r.FeatureGroup = r.LayerGroup.extend({
            addLayer: function(e) {
                return this.hasLayer(e) ? this : (e.addEventParent(this), r.LayerGroup.prototype.addLayer.call(this, e), this.fire("layeradd", {
                    layer: e
                }))
            },
            removeLayer: function(e) {
                return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.removeEventParent(this), r.LayerGroup.prototype.removeLayer.call(this, e), this.fire("layerremove", {
                    layer: e
                })) : this
            },
            setStyle: function(e) {
                return this.invoke("setStyle", e)
            },
            bringToFront: function() {
                return this.invoke("bringToFront")
            },
            bringToBack: function() {
                return this.invoke("bringToBack")
            },
            getBounds: function() {
                var e = new r.LatLngBounds;
                for (var t in this._layers) {
                    var n = this._layers[t];
                    e.extend(n.getBounds ? n.getBounds() : n.getLatLng())
                }
                return e
            }
        }), r.featureGroup = function(e) {
            return new r.FeatureGroup(e)
        }, r.Renderer = r.Layer.extend({
            options: {
                padding: .1
            },
            initialize: function(e) {
                r.setOptions(this, e), r.stamp(this)
            },
            onAdd: function() {
                this._container || (this._initContainer(), this._zoomAnimated && r.DomUtil.addClass(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update()
            },
            onRemove: function() {
                r.DomUtil.remove(this._container)
            },
            getEvents: function() {
                var e = {
                    viewreset: this._reset,
                    zoom: this._updateTransform,
                    moveend: this._update
                };
                return this._zoomAnimated && (e.zoomanim = this._animateZoom), e
            },
            _animateZoom: function(e) {
                var t = this._map.getZoomScale(e.zoom, this._zoom),
                    n = this._map._latLngToNewLayerPoint(this._topLeft, e.zoom, e.center);
                r.DomUtil.setTransform(this._container, n, t)
            },
            _updateTransform: function() {
                var e = this._map.getZoom(),
                    t = this._map.getCenter(),
                    n = this._map.getZoomScale(e, this._zoom),
                    i = this._map._latLngToNewLayerPoint(this._topLeft, e, t);
                r.DomUtil.setTransform(this._container, i, n)
            },
            _reset: function() {
                this._update(), this._updateTransform()
            },
            _update: function() {
                var e = this.options.padding,
                    t = this._map.getSize(),
                    n = this._map.containerPointToLayerPoint(t.multiplyBy(-e)).round();
                this._bounds = new r.Bounds(n, n.add(t.multiplyBy(1 + e * 2)).round()), this._topLeft = this._map.layerPointToLatLng(n), this._zoom = this._map.getZoom()
            }
        }), r.Map.include({
            getRenderer: function(e) {
                var t = e.options.renderer || this._getPaneRenderer(e.options.pane) || this.options.renderer || this._renderer;
                return t || (t = this._renderer = this.options.preferCanvas && r.canvas() || r.svg()), this.hasLayer(t) || this.addLayer(t), t
            },
            _getPaneRenderer: function(e) {
                if (e === "overlayPane" || e === n) return !1;
                var t = this._paneRenderers[e];
                return t === n && (t = r.SVG && r.svg({
                    pane: e
                }) || r.Canvas && r.canvas({
                    pane: e
                }), this._paneRenderers[e] = t), t
            }
        }), r.Path = r.Layer.extend({
            options: {
                stroke: !0,
                color: "#3388ff",
                weight: 3,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round",
                fillOpacity: .2,
                fillRule: "evenodd",
                interactive: !0
            },
            onAdd: function() {
                this._renderer = this._map.getRenderer(this), this._renderer._initPath(this), this._reset(), this._renderer._addPath(this)
            },
            onRemove: function() {
                this._renderer._removePath(this)
            },
            getEvents: function() {
                return {
                    zoomend: this._project,
                    moveend: this._update,
                    viewreset: this._reset
                }
            },
            redraw: function() {
                return this._map && this._renderer._updatePath(this), this
            },
            setStyle: function(e) {
                return r.setOptions(this, e), this._renderer && this._renderer._updateStyle(this), this
            },
            bringToFront: function() {
                return this._renderer && this._renderer._bringToFront(this), this
            },
            bringToBack: function() {
                return this._renderer && this._renderer._bringToBack(this), this
            },
            getElement: function() {
                return this._path
            },
            _reset: function() {
                this._project(), this._update()
            },
            _clickTolerance: function() {
                return (this.options.stroke ? this.options.weight / 2 : 0) + (r.Browser.touch ? 10 : 0)
            }
        }), r.LineUtil = {
            simplify: function(e, t) {
                if (!t || !e.length) return e.slice();
                var n = t * t;
                return e = this._reducePoints(e, n), e = this._simplifyDP(e, n), e
            },
            pointToSegmentDistance: function(e, t, n) {
                return Math.sqrt(this._sqClosestPointOnSegment(e, t, n, !0))
            },
            closestPointOnSegment: function(e, t, n) {
                return this._sqClosestPointOnSegment(e, t, n)
            },
            _simplifyDP: function(e, t) {
                var r = e.length,
                    i = typeof Uint8Array != n + "" ? Uint8Array : Array,
                    s = new i(r);
                s[0] = s[r - 1] = 1, this._simplifyDPStep(e, s, t, 0, r - 1);
                var o, u = [];
                for (o = 0; o < r; o++) s[o] && u.push(e[o]);
                return u
            },
            _simplifyDPStep: function(e, t, n, r, i) {
                var s = 0,
                    o, u, a;
                for (u = r + 1; u <= i - 1; u++) a = this._sqClosestPointOnSegment(e[u], e[r], e[i], !0), a > s && (o = u, s = a);
                s > n && (t[o] = 1, this._simplifyDPStep(e, t, n, r, o), this._simplifyDPStep(e, t, n, o, i))
            },
            _reducePoints: function(e, t) {
                var n = [e[0]];
                for (var r = 1, i = 0, s = e.length; r < s; r++) this._sqDist(e[r], e[i]) > t && (n.push(e[r]), i = r);
                return i < s - 1 && n.push(e[s - 1]), n
            },
            clipSegment: function(e, t, n, r, i) {
                var s = r ? this._lastCode : this._getBitCode(e, n),
                    o = this._getBitCode(t, n),
                    u, a, f;
                this._lastCode = o;
                for (;;) {
                    if (!(s | o)) return [e, t];
                    if (s & o) return !1;
                    u = s || o, a = this._getEdgeIntersection(e, t, u, n, i), f = this._getBitCode(a, n), u === s ? (e = a, s = f) : (t = a, o = f)
                }
            },
            _getEdgeIntersection: function(e, t, n, i, s) {
                var o = t.x - e.x,
                    u = t.y - e.y,
                    a = i.min,
                    f = i.max,
                    l, c;
                return n & 8 ? (l = e.x + o * (f.y - e.y) / u, c = f.y) : n & 4 ? (l = e.x + o * (a.y - e.y) / u, c = a.y) : n & 2 ? (l = f.x, c = e.y + u * (f.x - e.x) / o) : n & 1 && (l = a.x, c = e.y + u * (a.x - e.x) / o), new r.Point(l, c, s)
            },
            _getBitCode: function(e, t) {
                var n = 0;
                return e.x < t.min.x ? n |= 1 : e.x > t.max.x && (n |= 2), e.y < t.min.y ? n |= 4 : e.y > t.max.y && (n |= 8), n
            },
            _sqDist: function(e, t) {
                var n = t.x - e.x,
                    r = t.y - e.y;
                return n * n + r * r
            },
            _sqClosestPointOnSegment: function(e, t, n, i) {
                var s = t.x,
                    o = t.y,
                    u = n.x - s,
                    a = n.y - o,
                    f = u * u + a * a,
                    l;
                return f > 0 && (l = ((e.x - s) * u + (e.y - o) * a) / f, l > 1 ? (s = n.x, o = n.y) : l > 0 && (s += u * l, o += a * l)), u = e.x - s, a = e.y - o, i ? u * u + a * a : new r.Point(s, o)
            }
        }, r.Polyline = r.Path.extend({
            options: {
                smoothFactor: 1
            },
            initialize: function(e, t) {
                r.setOptions(this, t), this._setLatLngs(e)
            },
            getLatLngs: function() {
                return this._latlngs
            },
            setLatLngs: function(e) {
                return this._setLatLngs(e), this.redraw()
            },
            isEmpty: function() {
                return !this._latlngs.length
            },
            closestLayerPoint: function(e) {
                var t = Infinity,
                    n = null,
                    i = r.LineUtil._sqClosestPointOnSegment,
                    s, o;
                for (var u = 0, a = this._parts.length; u < a; u++) {
                    var f = this._parts[u];
                    for (var l = 1, c = f.length; l < c; l++) {
                        s = f[l - 1], o = f[l];
                        var h = i(e, s, o, !0);
                        h < t && (t = h, n = i(e, s, o))
                    }
                }
                return n && (n.distance = Math.sqrt(t)), n
            },
            getCenter: function() {
                var e, t, n, r, i, s, o, u = this._rings[0],
                    a = u.length;
                if (!a) return null;
                for (e = 0, t = 0; e < a - 1; e++) t += u[e].distanceTo(u[e + 1]) / 2;
                if (t === 0) return this._map.layerPointToLatLng(u[0]);
                for (e = 0, r = 0; e < a - 1; e++) {
                    i = u[e], s = u[e + 1], n = i.distanceTo(s), r += n;
                    if (r > t) return o = (r - t) / n, this._map.layerPointToLatLng([s.x - o * (s.x - i.x), s.y - o * (s.y - i.y)])
                }
            },
            getBounds: function() {
                return this._bounds
            },
            addLatLng: function(e, t) {
                return t = t || this._defaultShape(), e = r.latLng(e), t.push(e), this._bounds.extend(e), this.redraw()
            },
            _setLatLngs: function(e) {
                this._bounds = new r.LatLngBounds, this._latlngs = this._convertLatLngs(e)
            },
            _defaultShape: function() {
                return r.Polyline._flat(this._latlngs) ? this._latlngs : this._latlngs[0]
            },
            _convertLatLngs: function(e) {
                var t = [],
                    n = r.Polyline._flat(e);
                for (var i = 0, s = e.length; i < s; i++) n ? (t[i] = r.latLng(e[i]), this._bounds.extend(t[i])) : t[i] = this._convertLatLngs(e[i]);
                return t
            },
            _project: function() {
                this._rings = [], this._projectLatlngs(this._latlngs, this._rings);
                var e = this._clickTolerance(),
                    t = new r.Point(e, -e);
                this._bounds.isValid() && (this._pxBounds = new r.Bounds(this._map.latLngToLayerPoint(this._bounds.getSouthWest())._subtract(t), this._map.latLngToLayerPoint(this._bounds.getNorthEast())._add(t)))
            },
            _projectLatlngs: function(e, t) {
                var n = e[0] instanceof r.LatLng,
                    i = e.length,
                    s, o;
                if (n) {
                    o = [];
                    for (s = 0; s < i; s++) o[s] = this._map.latLngToLayerPoint(e[s]);
                    t.push(o)
                } else
                    for (s = 0; s < i; s++) this._projectLatlngs(e[s], t)
            },
            _clipPoints: function() {
                var e = this._renderer._bounds;
                this._parts = [];
                if (!this._pxBounds || !this._pxBounds.intersects(e)) return;
                if (this.options.noClip) {
                    this._parts = this._rings;
                    return
                }
                var t = this._parts,
                    n, i, s, o, u, a, f;
                for (n = 0, s = 0, o = this._rings.length; n < o; n++) {
                    f = this._rings[n];
                    for (i = 0, u = f.length; i < u - 1; i++) {
                        a = r.LineUtil.clipSegment(f[i], f[i + 1], e, i, !0);
                        if (!a) continue;
                        t[s] = t[s] || [], t[s].push(a[0]);
                        if (a[1] !== f[i + 1] || i === u - 2) t[s].push(a[1]), s++
                    }
                }
            },
            _simplifyPoints: function() {
                var e = this._parts,
                    t = this.options.smoothFactor;
                for (var n = 0, i = e.length; n < i; n++) e[n] = r.LineUtil.simplify(e[n], t)
            },
            _update: function() {
                if (!this._map) return;
                this._clipPoints(), this._simplifyPoints(), this._updatePath()
            },
            _updatePath: function() {
                this._renderer._updatePoly(this)
            }
        }), r.polyline = function(e, t) {
            return new r.Polyline(e, t)
        }, r.Polyline._flat = function(e) {
            return !r.Util.isArray(e[0]) || typeof e[0][0] != "object" && typeof e[0][0] != "undefined"
        }, r.PolyUtil = {}, r.PolyUtil.clipPolygon = function(e, t, n) {
            var i, s = [1, 4, 2, 8],
                o, u, a, f, l, c, h, p, d = r.LineUtil;
            for (o = 0, c = e.length; o < c; o++) e[o]._code = d._getBitCode(e[o], t);
            for (a = 0; a < 4; a++) {
                h = s[a], i = [];
                for (o = 0, c = e.length, u = c - 1; o < c; u = o++) f = e[o], l = e[u], f._code & h ? l._code & h || (p = d._getEdgeIntersection(l, f, h, t, n), p._code = d._getBitCode(p, t), i.push(p)) : (l._code & h && (p = d._getEdgeIntersection(l, f, h, t, n), p._code = d._getBitCode(p, t), i.push(p)), i.push(f));
                e = i
            }
            return e
        }, r.Polygon = r.Polyline.extend({
            options: {
                fill: !0
            },
            isEmpty: function() {
                return !this._latlngs.length || !this._latlngs[0].length
            },
            getCenter: function() {
                var e, t, n, r, i, s, o, u, a, f = this._rings[0],
                    l = f.length;
                if (!l) return null;
                s = o = u = 0;
                for (e = 0, t = l - 1; e < l; t = e++) n = f[e], r = f[t], i = n.y * r.x - r.y * n.x, o += (n.x + r.x) * i, u += (n.y + r.y) * i, s += i * 3;
                return s === 0 ? a = f[0] : a = [o / s, u / s], this._map.layerPointToLatLng(a)
            },
            _convertLatLngs: function(e) {
                var t = r.Polyline.prototype._convertLatLngs.call(this, e),
                    n = t.length;
                return n >= 2 && t[0] instanceof r.LatLng && t[0].equals(t[n - 1]) && t.pop(), t
            },
            _setLatLngs: function(e) {
                r.Polyline.prototype._setLatLngs.call(this, e), r.Polyline._flat(this._latlngs) && (this._latlngs = [this._latlngs])
            },
            _defaultShape: function() {
                return r.Polyline._flat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0]
            },
            _clipPoints: function() {
                var e = this._renderer._bounds,
                    t = this.options.weight,
                    n = new r.Point(t, t);
                e = new r.Bounds(e.min.subtract(n), e.max.add(n)), this._parts = [];
                if (!this._pxBounds || !this._pxBounds.intersects(e)) return;
                if (this.options.noClip) {
                    this._parts = this._rings;
                    return
                }
                for (var i = 0, s = this._rings.length, o; i < s; i++) o = r.PolyUtil.clipPolygon(this._rings[i], e, !0), o.length && this._parts.push(o)
            },
            _updatePath: function() {
                this._renderer._updatePoly(this, !0)
            }
        }), r.polygon = function(e, t) {
            return new r.Polygon(e, t)
        }, r.Rectangle = r.Polygon.extend({
            initialize: function(e, t) {
                r.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(e), t)
            },
            setBounds: function(e) {
                this.setLatLngs(this._boundsToLatLngs(e))
            },
            _boundsToLatLngs: function(e) {
                return e = r.latLngBounds(e), [e.getSouthWest(), e.getNorthWest(), e.getNorthEast(), e.getSouthEast()]
            }
        }), r.rectangle = function(e, t) {
            return new r.Rectangle(e, t)
        }, r.CircleMarker = r.Path.extend({
            options: {
                fill: !0,
                radius: 10
            },
            initialize: function(e, t) {
                r.setOptions(this, t), this._latlng = r.latLng(e), this._radius = this.options.radius
            },
            setLatLng: function(e) {
                return this._latlng = r.latLng(e), this.redraw(), this.fire("move", {
                    latlng: this._latlng
                })
            },
            getLatLng: function() {
                return this._latlng
            },
            setRadius: function(e) {
                return this.options.radius = this._radius = e, this.redraw()
            },
            getRadius: function() {
                return this._radius
            },
            setStyle: function(e) {
                var t = e && e.radius || this._radius;
                return r.Path.prototype.setStyle.call(this, e), this.setRadius(t), this
            },
            _project: function() {
                this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds()
            },
            _updateBounds: function() {
                var e = this._radius,
                    t = this._radiusY || e,
                    n = this._clickTolerance(),
                    i = [e + n, t + n];
                this._pxBounds = new r.Bounds(this._point.subtract(i), this._point.add(i))
            },
            _update: function() {
                this._map && this._updatePath()
            },
            _updatePath: function() {
                this._renderer._updateCircle(this)
            },
            _empty: function() {
                return this._radius && !this._renderer._bounds.intersects(this._pxBounds)
            }
        }), r.circleMarker = function(e, t) {
            return new r.CircleMarker(e, t)
        }, r.Circle = r.CircleMarker.extend({
            initialize: function(e, t, n) {
                r.setOptions(this, n), this._latlng = r.latLng(e), this._mRadius = t
            },
            setRadius: function(e) {
                return this._mRadius = e, this.redraw()
            },
            getRadius: function() {
                return this._mRadius
            },
            getBounds: function() {
                var e = [this._radius, this._radiusY];
                return new r.LatLngBounds(this._map.layerPointToLatLng(this._point.subtract(e)), this._map.layerPointToLatLng(this._point.add(e)))
            },
            setStyle: r.Path.prototype.setStyle,
            _project: function() {
                var e = this._latlng.lng,
                    t = this._latlng.lat,
                    n = this._map,
                    i = n.options.crs;
                if (i.distance === r.CRS.Earth.distance) {
                    var s = Math.PI / 180,
                        o = this._mRadius / r.CRS.Earth.R / s,
                        u = n.project([t + o, e]),
                        a = n.project([t - o, e]),
                        f = u.add(a).divideBy(2),
                        l = n.unproject(f).lat,
                        c = Math.acos((Math.cos(o * s) - Math.sin(t * s) * Math.sin(l * s)) / (Math.cos(t * s) * Math.cos(l * s))) / s;
                    this._point = f.subtract(n.getPixelOrigin()), this._radius = isNaN(c) ? 0 : Math.max(Math.round(f.x - n.project([l, e - c]).x), 1), this._radiusY = Math.max(Math.round(f.y - u.y), 1)
                } else {
                    var h = i.unproject(i.project(this._latlng).subtract([this._mRadius, 0]));
                    this._point = n.latLngToLayerPoint(this._latlng), this._radius = this._point.x - n.latLngToLayerPoint(h).x
                }
                this._updateBounds()
            }
        }), r.circle = function(e, t, n) {
            return new r.Circle(e, t, n)
        }, r.SVG = r.Renderer.extend({
            _initContainer: function() {
                this._container = r.SVG.create("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = r.SVG.create("g"), this._container.appendChild(this._rootGroup)
            },
            _update: function() {
                if (this._map._animatingZoom && this._bounds) return;
                r.Renderer.prototype._update.call(this);
                var e = this._bounds,
                    t = e.getSize(),
                    n = this._container;
                if (!this._svgSize || !this._svgSize.equals(t)) this._svgSize = t, n.setAttribute("width", t.x), n.setAttribute("height", t.y);
                r.DomUtil.setPosition(n, e.min), n.setAttribute("viewBox", [e.min.x, e.min.y, t.x, t.y].join(" "))
            },
            _initPath: function(e) {
                var t = e._path = r.SVG.create("path");
                e.options.className && r.DomUtil.addClass(t, e.options.className), e.options.interactive && r.DomUtil.addClass(t, "leaflet-interactive"), this._updateStyle(e)
            },
            _addPath: function(e) {
                this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path)
            },
            _removePath: function(e) {
                r.DomUtil.remove(e._path), e.removeInteractiveTarget(e._path)
            },
            _updatePath: function(e) {
                e._project(), e._update()
            },
            _updateStyle: function(e) {
                var t = e._path,
                    n = e.options;
                if (!t) return;
                n.stroke ? (t.setAttribute("stroke", n.color), t.setAttribute("stroke-opacity", n.opacity), t.setAttribute("stroke-width", n.weight), t.setAttribute("stroke-linecap", n.lineCap), t.setAttribute("stroke-linejoin", n.lineJoin), n.dashArray ? t.setAttribute("stroke-dasharray", n.dashArray) : t.removeAttribute("stroke-dasharray"), n.dashOffset ? t.setAttribute("stroke-dashoffset", n.dashOffset) : t.removeAttribute("stroke-dashoffset")) : t.setAttribute("stroke", "none"), n.fill ? (t.setAttribute("fill", n.fillColor || n.color), t.setAttribute("fill-opacity", n.fillOpacity), t.setAttribute("fill-rule", n.fillRule || "evenodd")) : t.setAttribute("fill", "none"), t.setAttribute("pointer-events", n.pointerEvents || (n.interactive ? "visiblePainted" : "none"))
            },
            _updatePoly: function(e, t) {
                this._setPath(e, r.SVG.pointsToPath(e._parts, t))
            },
            _updateCircle: function(e) {
                var t = e._point,
                    n = e._radius,
                    r = e._radiusY || n,
                    i = "a" + n + "," + r + " 0 1,0 ",
                    s = e._empty() ? "M0 0" : "M" + (t.x - n) + "," + t.y + i + n * 2 + ",0 " + i + -n * 2 + ",0 ";
                this._setPath(e, s)
            },
            _setPath: function(e, t) {
                e._path.setAttribute("d", t)
            },
            _bringToFront: function(e) {
                r.DomUtil.toFront(e._path)
            },
            _bringToBack: function(e) {
                r.DomUtil.toBack(e._path)
            }
        }), r.extend(r.SVG, {
            create: function(e) {
                return t.createElementNS("http://www.w3.org/2000/svg", e)
            },
            pointsToPath: function(e, t) {
                var n = "",
                    i, s, o, u, a, f;
                for (i = 0, o = e.length; i < o; i++) {
                    a = e[i];
                    for (s = 0, u = a.length; s < u; s++) f = a[s], n += (s ? "L" : "M") + f.x + " " + f.y;
                    n += t ? r.Browser.svg ? "z" : "x" : ""
                }
                return n || "M0 0"
            }
        }), r.Browser.svg = !! t.createElementNS && !! r.SVG.create("svg").createSVGRect, r.svg = function(e) {
            return r.Browser.svg || r.Browser.vml ? new r.SVG(e) : null
        }, r.Browser.vml = !r.Browser.svg && function() {
            try {
                var e = t.createElement("div");
                e.innerHTML = '<v:shape adj="1"/>';
                var n = e.firstChild;
                return n.style.behavior = "url(#default#VML)", n && typeof n.adj == "object"
            } catch (r) {
                return !1
            }
        }(), r.SVG.include(r.Browser.vml ? {
            _initContainer: function() {
                this._container = r.DomUtil.create("div", "leaflet-vml-container")
            },
            _update: function() {
                if (this._map._animatingZoom) return;
                r.Renderer.prototype._update.call(this)
            },
            _initPath: function(e) {
                var t = e._container = r.SVG.create("shape");
                r.DomUtil.addClass(t, "leaflet-vml-shape " + (this.options.className || "")), t.coordsize = "1 1", e._path = r.SVG.create("path"), t.appendChild(e._path), this._updateStyle(e)
            },
            _addPath: function(e) {
                var t = e._container;
                this._container.appendChild(t), e.options.interactive && e.addInteractiveTarget(t)
            },
            _removePath: function(e) {
                var t = e._container;
                r.DomUtil.remove(t), e.removeInteractiveTarget(t)
            },
            _updateStyle: function(e) {
                var t = e._stroke,
                    n = e._fill,
                    i = e.options,
                    s = e._container;
                s.stroked = !! i.stroke, s.filled = !! i.fill, i.stroke ? (t || (t = e._stroke = r.SVG.create("stroke"), s.appendChild(t)), t.weight = i.weight + "px", t.color = i.color, t.opacity = i.opacity, i.dashArray ? t.dashStyle = r.Util.isArray(i.dashArray) ? i.dashArray.join(" ") : i.dashArray.replace(/( *, *)/g, " ") : t.dashStyle = "", t.endcap = i.lineCap.replace("butt", "flat"), t.joinstyle = i.lineJoin) : t && (s.removeChild(t), e._stroke = null), i.fill ? (n || (n = e._fill = r.SVG.create("fill"), s.appendChild(n)), n.color = i.fillColor || i.color, n.opacity = i.fillOpacity) : n && (s.removeChild(n), e._fill = null)
            },
            _updateCircle: function(e) {
                var t = e._point.round(),
                    n = Math.round(e._radius),
                    r = Math.round(e._radiusY || n);
                this._setPath(e, e._empty() ? "M0 0" : "AL " + t.x + "," + t.y + " " + n + "," + r + " 0," + 23592600)
            },
            _setPath: function(e, t) {
                e._path.v = t
            },
            _bringToFront: function(e) {
                r.DomUtil.toFront(e._container)
            },
            _bringToBack: function(e) {
                r.DomUtil.toBack(e._container)
            }
        } : {}), r.Browser.vml && (r.SVG.create = function() {
            try {
                return t.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"),
                function(e) {
                    return t.createElement("<lvml:" + e + ' class="lvml">')
                }
            } catch (e) {
                return function(e) {
                    return t.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')
                }
            }
        }()), r.Canvas = r.Renderer.extend({
            onAdd: function() {
                r.Renderer.prototype.onAdd.call(this), this._layers = this._layers || {}, this._draw()
            },
            _initContainer: function() {
                var e = this._container = t.createElement("canvas");
                r.DomEvent.on(e, "mousemove", this._onMouseMove, this).on(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this).on(e, "mouseout", this._handleMouseOut, this), this._ctx = e.getContext("2d")
            },
            _update: function() {
                if (this._map._animatingZoom && this._bounds) return;
                r.Renderer.prototype._update.call(this);
                var e = this._bounds,
                    t = this._container,
                    n = e.getSize(),
                    i = r.Browser.retina ? 2 : 1;
                r.DomUtil.setPosition(t, e.min), t.width = i * n.x, t.height = i * n.y, t.style.width = n.x + "px", t.style.height = n.y + "px", r.Browser.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y)
            },
            _initPath: function(e) {
                this._layers[r.stamp(e)] = e
            },
            _addPath: r.Util.falseFn,
            _removePath: function(e) {
                e._removed = !0, this._requestRedraw(e)
            },
            _updatePath: function(e) {
                this._redrawBounds = e._pxBounds, this._draw(!0), e._project(), e._update(), this._draw(), this._redrawBounds = null
            },
            _updateStyle: function(e) {
                this._requestRedraw(e)
            },
            _requestRedraw: function(e) {
                if (!this._map) return;
                this._redrawBounds = this._redrawBounds || new r.Bounds, this._redrawBounds.extend(e._pxBounds.min).extend(e._pxBounds.max), this._redrawRequest = this._redrawRequest || r.Util.requestAnimFrame(this._redraw, this)
            },
            _redraw: function() {
                this._redrawRequest = null, this._draw(!0), this._draw(), this._redrawBounds = null
            },
            _draw: function(e) {
                this._clear = e;
                var t;
                for (var n in this._layers) t = this._layers[n], (!this._redrawBounds || t._pxBounds.intersects(this._redrawBounds)) && t._updatePath(), e && t._removed && (delete t._removed, delete this._layers[n])
            },
            _updatePoly: function(e, t) {
                var n, r, i, s, o = e._parts,
                    u = o.length,
                    a = this._ctx;
                if (!u) return;
                a.beginPath();
                for (n = 0; n < u; n++) {
                    for (r = 0, i = o[n].length; r < i; r++) s = o[n][r], a[r ? "lineTo" : "moveTo"](s.x, s.y);
                    t && a.closePath()
                }
                this._fillStroke(a, e)
            },
            _updateCircle: function(e) {
                if (e._empty()) return;
                var t = e._point,
                    n = this._ctx,
                    r = e._radius,
                    i = (e._radiusY || r) / r;
                i !== 1 && (n.save(), n.scale(1, i)), n.beginPath(), n.arc(t.x, t.y / i, r, 0, Math.PI * 2, !1), i !== 1 && n.restore(), this._fillStroke(n, e)
            },
            _fillStroke: function(e, t) {
                var n = this._clear,
                    r = t.options;
                e.globalCompositeOperation = n ? "destination-out" : "source-over", r.fill && (e.globalAlpha = n ? 1 : r.fillOpacity, e.fillStyle = r.fillColor || r.color, e.fill(r.fillRule || "evenodd")), r.stroke && r.weight !== 0 && (e.globalAlpha = n ? 1 : r.opacity, t._prevWeight = e.lineWidth = n ? t._prevWeight + 1 : r.weight, e.strokeStyle = r.color, e.lineCap = r.lineCap, e.lineJoin = r.lineJoin, e.stroke())
            },
            _onClick: function(e) {
                var t = this._map.mouseEventToLayerPoint(e);
                for (var n in this._layers) this._layers[n]._containsPoint(t) && (r.DomEvent._fakeStop(e), this._fireEvent(this._layers[n], e))
            },
            _onMouseMove: function(e) {
                if (!this._map || this._map._animatingZoom) return;
                var t = this._map.mouseEventToLayerPoint(e);
                this._handleMouseOut(e, t), this._handleMouseHover(e, t)
            },
            _handleMouseOut: function(e, t) {
                var n = this._hoveredLayer;
                n && (e.type === "mouseout" || !n._containsPoint(t)) && (r.DomUtil.removeClass(this._container, "leaflet-interactive"), this._fireEvent(n, e, "mouseout"), this._hoveredLayer = null)
            },
            _handleMouseHover: function(e, t) {
                var n, i;
                if (!this._hoveredLayer)
                    for (n in this._layers) {
                        i = this._layers[n];
                        if (i.options.interactive && i._containsPoint(t)) {
                            r.DomUtil.addClass(this._container, "leaflet-interactive"), this._fireEvent(i, e, "mouseover"), this._hoveredLayer = i;
                            break
                        }
                    }
                this._hoveredLayer && this._fireEvent(this._hoveredLayer, e)
            },
            _fireEvent: function(e, t, n) {
                this._map._fireDOMEvent(t, n || t.type, [e])
            },
            _bringToFront: r.Util.falseFn,
            _bringToBack: r.Util.falseFn
        }), r.Browser.canvas = function() {
            return !!t.createElement("canvas").getContext
        }(), r.canvas = function(e) {
            return r.Browser.canvas ? new r.Canvas(e) : null
        }, r.Polyline.prototype._containsPoint = function(e, t) {
            var n, i, s, o, u, a, f = this._clickTolerance();
            if (!this._pxBounds.contains(e)) return !1;
            for (n = 0, o = this._parts.length; n < o; n++) {
                a = this._parts[n];
                for (i = 0, u = a.length, s = u - 1; i < u; s = i++) {
                    if (!t && i === 0) continue;
                    if (r.LineUtil.pointToSegmentDistance(e, a[s], a[i]) <= f) return !0
                }
            }
            return !1
        }, r.Polygon.prototype._containsPoint = function(e) {
            var t = !1,
                n, i, s, o, u, a, f, l;
            if (!this._pxBounds.contains(e)) return !1;
            for (o = 0, f = this._parts.length; o < f; o++) {
                n = this._parts[o];
                for (u = 0, l = n.length, a = l - 1; u < l; a = u++) i = n[u], s = n[a], i.y > e.y != s.y > e.y && e.x < (s.x - i.x) * (e.y - i.y) / (s.y - i.y) + i.x && (t = !t)
            }
            return t || r.Polyline.prototype._containsPoint.call(this, e, !0)
        }, r.CircleMarker.prototype._containsPoint = function(e) {
            return e.distanceTo(this._point) <= this._radius + this._clickTolerance()
        }, r.GeoJSON = r.FeatureGroup.extend({
            initialize: function(e, t) {
                r.setOptions(this, t), this._layers = {}, e && this.addData(e)
            },
            addData: function(e) {
                var t = r.Util.isArray(e) ? e : e.features,
                    n, i, s;
                if (t) {
                    for (n = 0, i = t.length; n < i; n++) s = t[n], (s.geometries || s.geometry || s.features || s.coordinates) && this.addData(s);
                    return this
                }
                var o = this.options;
                if (o.filter && !o.filter(e)) return this;
                var u = r.GeoJSON.geometryToLayer(e, o);
                return u ? (u.feature = r.GeoJSON.asFeature(e), u.defaultOptions = u.options, this.resetStyle(u), o.onEachFeature && o.onEachFeature(e, u), this.addLayer(u)) : this
            },
            resetStyle: function(e) {
                return e.options = e.defaultOptions, this._setLayerStyle(e, this.options.style), this
            },
            setStyle: function(e) {
                return this.eachLayer(function(t) {
                    this._setLayerStyle(t, e)
                }, this)
            },
            _setLayerStyle: function(e, t) {
                typeof t == "function" && (t = t(e.feature)), e.setStyle && e.setStyle(t)
            }
        }), r.extend(r.GeoJSON, {
            geometryToLayer: function(e, t) {
                var n = e.type === "Feature" ? e.geometry : e,
                    i = n ? n.coordinates : null,
                    s = [],
                    o = t && t.pointToLayer,
                    u = t && t.coordsToLatLng || this.coordsToLatLng,
                    a, f, l, c;
                if (!i && !n) return null;
                switch (n.type) {
                    case "Point":
                        return a = u(i), o ? o(e, a) : new r.Marker(a);
                    case "MultiPoint":
                        for (l = 0, c = i.length; l < c; l++) a = u(i[l]), s.push(o ? o(e, a) : new r.Marker(a));
                        return new r.FeatureGroup(s);
                    case "LineString":
                    case "MultiLineString":
                        return f = this.coordsToLatLngs(i, n.type === "LineString" ? 0 : 1, u), new r.Polyline(f, t);
                    case "Polygon":
                    case "MultiPolygon":
                        return f = this.coordsToLatLngs(i, n.type === "Polygon" ? 1 : 2, u), new r.Polygon(f, t);
                    case "GeometryCollection":
                        for (l = 0, c = n.geometries.length; l < c; l++) {
                            var h = this.geometryToLayer({
                                geometry: n.geometries[l],
                                type: "Feature",
                                properties: e.properties
                            }, t);
                            h && s.push(h)
                        }
                        return new r.FeatureGroup(s);
                    default:
                        throw Error("Invalid GeoJSON object.")
                }
            },
            coordsToLatLng: function(e) {
                return new r.LatLng(e[1], e[0], e[2])
            },
            coordsToLatLngs: function(e, t, n) {
                var r = [];
                for (var i = 0, s = e.length, o; i < s; i++) o = t ? this.coordsToLatLngs(e[i], t - 1, n) : (n || this.coordsToLatLng)(e[i]), r.push(o);
                return r
            },
            latLngToCoords: function(e) {
                return e.alt !== n ? [e.lng, e.lat, e.alt] : [e.lng, e.lat]
            },
            latLngsToCoords: function(e, t, n) {
                var i = [];
                for (var s = 0, o = e.length; s < o; s++) i.push(t ? r.GeoJSON.latLngsToCoords(e[s], t - 1, n) : r.GeoJSON.latLngToCoords(e[s]));
                return !t && n && i.push(i[0]), i
            },
            getFeature: function(e, t) {
                return e.feature ? r.extend({}, e.feature, {
                    geometry: t
                }) : r.GeoJSON.asFeature(t)
            },
            asFeature: function(e) {
                return e.type === "Feature" ? e : {
                    type: "Feature",
                    properties: {},
                    geometry: e
                }
            }
        });
        var o = {
            toGeoJSON: function() {
                return r.GeoJSON.getFeature(this, {
                    type: "Point",
                    coordinates: r.GeoJSON.latLngToCoords(this.getLatLng())
                })
            }
        };
        r.Marker.include(o), r.Circle.include(o), r.CircleMarker.include(o), r.Polyline.prototype.toGeoJSON = function() {
            var e = !r.Polyline._flat(this._latlngs),
                t = r.GeoJSON.latLngsToCoords(this._latlngs, e ? 1 : 0);
            return r.GeoJSON.getFeature(this, {
                type: (e ? "Multi" : "") + "LineString",
                coordinates: t
            })
        }, r.Polygon.prototype.toGeoJSON = function() {
            var e = !r.Polyline._flat(this._latlngs),
                t = e && !r.Polyline._flat(this._latlngs[0]),
                n = r.GeoJSON.latLngsToCoords(this._latlngs, t ? 2 : e ? 1 : 0, !0);
            return e || (n = [n]), r.GeoJSON.getFeature(this, {
                type: (t ? "Multi" : "") + "Polygon",
                coordinates: n
            })
        }, r.LayerGroup.include({
            toMultiPoint: function() {
                var e = [];
                return this.eachLayer(function(t) {
                    e.push(t.toGeoJSON().geometry.coordinates)
                }), r.GeoJSON.getFeature(this, {
                    type: "MultiPoint",
                    coordinates: e
                })
            },
            toGeoJSON: function() {
                var e = this.feature && this.feature.geometry && this.feature.geometry.type;
                if (e === "MultiPoint") return this.toMultiPoint();
                var t = e === "GeometryCollection",
                    n = [];
                return this.eachLayer(function(e) {
                    if (e.toGeoJSON) {
                        var i = e.toGeoJSON();
                        n.push(t ? i.geometry : r.GeoJSON.asFeature(i))
                    }
                }), t ? r.GeoJSON.getFeature(this, {
                    geometries: n,
                    type: "GeometryCollection"
                }) : {
                    type: "FeatureCollection",
                    features: n
                }
            }
        }), r.geoJson = function(e, t) {
            return new r.GeoJSON(e, t)
        };
        var u = "_leaflet_events";
        r.DomEvent = {
            on: function(e, t, n, i) {
                if (typeof t == "object")
                    for (var s in t) this._on(e, s, t[s], n);
                else {
                    t = r.Util.splitWords(t);
                    for (var o = 0, u = t.length; o < u; o++) this._on(e, t[o], n, i)
                }
                return this
            },
            off: function(e, t, n, i) {
                if (typeof t == "object")
                    for (var s in t) this._off(e, s, t[s], n);
                else {
                    t = r.Util.splitWords(t);
                    for (var o = 0, u = t.length; o < u; o++) this._off(e, t[o], n, i)
                }
                return this
            },
            _on: function(t, n, i, s) {
                var o = n + r.stamp(i) + (s ? "_" + r.stamp(s) : "");
                if (t[u] && t[u][o]) return this;
                var a = function(n) {
                    return i.call(s || t, n || e.event)
                }, f = a;
                return r.Browser.pointer && n.indexOf("touch") === 0 ? this.addPointerListener(t, n, a, o) : r.Browser.touch && n === "dblclick" && this.addDoubleTapListener ? this.addDoubleTapListener(t, a, o) : "addEventListener" in t ? n === "mousewheel" ? (t.addEventListener("DOMMouseScroll", a, !1), t.addEventListener(n, a, !1)) : n === "mouseenter" || n === "mouseleave" ? (a = function(n) {
                    n = n || e.event, r.DomEvent._checkMouse(t, n) && f(n)
                }, t.addEventListener(n === "mouseenter" ? "mouseover" : "mouseout", a, !1)) : (n === "click" && r.Browser.android && (a = function(e) {
                    return r.DomEvent._filterClick(e, f)
                }), t.addEventListener(n, a, !1)) : "attachEvent" in t && t.attachEvent("on" + n, a), t[u] = t[u] || {}, t[u][o] = a, this
            },
            _off: function(e, t, n, i) {
                var s = t + r.stamp(n) + (i ? "_" + r.stamp(i) : ""),
                    o = e[u] && e[u][s];
                return o ? (r.Browser.pointer && t.indexOf("touch") === 0 ? this.removePointerListener(e, t, s) : r.Browser.touch && t === "dblclick" && this.removeDoubleTapListener ? this.removeDoubleTapListener(e, s) : "removeEventListener" in e ? t === "mousewheel" ? (e.removeEventListener("DOMMouseScroll", o, !1), e.removeEventListener(t, o, !1)) : e.removeEventListener(t === "mouseenter" ? "mouseover" : t === "mouseleave" ? "mouseout" : t, o, !1) : "detachEvent" in e && e.detachEvent("on" + t, o), e[u][s] = null, this) : this
            },
            stopPropagation: function(e) {
                return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, r.DomEvent._skipped(e), this
            },
            disableScrollPropagation: function(e) {
                return r.DomEvent.on(e, "mousewheel MozMousePixelScroll", r.DomEvent.stopPropagation)
            },
            disableClickPropagation: function(e) {
                var t = r.DomEvent.stopPropagation;
                return r.DomEvent.on(e, r.Draggable.START.join(" "), t), r.DomEvent.on(e, {
                    click: r.DomEvent._fakeStop,
                    dblclick: t
                })
            },
            preventDefault: function(e) {
                return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this
            },
            stop: function(e) {
                return r.DomEvent.preventDefault(e).stopPropagation(e)
            },
            getMousePosition: function(e, t) {
                if (!t) return new r.Point(e.clientX, e.clientY);
                var n = t.getBoundingClientRect();
                return new r.Point(e.clientX - n.left - t.clientLeft, e.clientY - n.top - t.clientTop)
            },
            getWheelDelta: function(e) {
                var t = 0;
                return e.wheelDelta && (t = e.wheelDelta / 120), e.detail && (t = -e.detail / 3), t
            },
            _skipEvents: {},
            _fakeStop: function(e) {
                r.DomEvent._skipEvents[e.type] = !0
            },
            _skipped: function(e) {
                var t = this._skipEvents[e.type];
                return this._skipEvents[e.type] = !1, t
            },
            _checkMouse: function(e, t) {
                var n = t.relatedTarget;
                if (!n) return !0;
                try {
                    while (n && n !== e) n = n.parentNode
                } catch (r) {
                    return !1
                }
                return n !== e
            },
            _filterClick: function(e, t) {
                var n = e.timeStamp || e.originalEvent.timeStamp,
                    i = r.DomEvent._lastClick && n - r.DomEvent._lastClick;
                if (i && i > 100 && i < 500 || e.target._simulatedClick && !e._simulated) {
                    r.DomEvent.stop(e);
                    return
                }
                r.DomEvent._lastClick = n, t(e)
            }
        }, r.DomEvent.addListener = r.DomEvent.on, r.DomEvent.removeListener = r.DomEvent.off, r.Draggable = r.Evented.extend({
            statics: {
                START: r.Browser.touch ? ["touchstart", "mousedown"] : ["mousedown"],
                END: {
                    mousedown: "mouseup",
                    touchstart: "touchend",
                    pointerdown: "touchend",
                    MSPointerDown: "touchend"
                },
                MOVE: {
                    mousedown: "mousemove",
                    touchstart: "touchmove",
                    pointerdown: "touchmove",
                    MSPointerDown: "touchmove"
                }
            },
            initialize: function(e, t, n) {
                this._element = e, this._dragStartTarget = t || e, this._preventOutline = n
            },
            enable: function() {
                if (this._enabled) return;
                r.DomEvent.on(this._dragStartTarget, r.Draggable.START.join(" "), this._onDown, this), this._enabled = !0
            },
            disable: function() {
                if (!this._enabled) return;
                r.DomEvent.off(this._dragStartTarget, r.Draggable.START.join(" "), this._onDown, this), this._enabled = !1, this._moved = !1
            },
            _onDown: function(e) {
                this._moved = !1;
                if (e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) return;
                r.DomEvent.stopPropagation(e), this._preventOutline && r.DomUtil.preventOutline(this._element);
                if (r.DomUtil.hasClass(this._element, "leaflet-zoom-anim")) return;
                r.DomUtil.disableImageDrag(), r.DomUtil.disableTextSelection();
                if (this._moving) return;
                this.fire("down");
                var n = e.touches ? e.touches[0] : e;
                this._startPoint = new r.Point(n.clientX, n.clientY), this._startPos = this._newPos = r.DomUtil.getPosition(this._element), r.DomEvent.on(t, r.Draggable.MOVE[e.type], this._onMove, this).on(t, r.Draggable.END[e.type], this._onUp, this)
            },
            _onMove: function(e) {
                if (e.touches && e.touches.length > 1) {
                    this._moved = !0;
                    return
                }
                var n = e.touches && e.touches.length === 1 ? e.touches[0] : e,
                    i = new r.Point(n.clientX, n.clientY),
                    s = i.subtract(this._startPoint);
                if (!s.x && !s.y) return;
                if (r.Browser.touch && Math.abs(s.x) + Math.abs(s.y) < 3) return;
                r.DomEvent.preventDefault(e), this._moved || (this.fire("dragstart"), this._moved = !0, this._startPos = r.DomUtil.getPosition(this._element).subtract(s), r.DomUtil.addClass(t.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, r.DomUtil.addClass(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(s), this._moving = !0, r.Util.cancelAnimFrame(this._animRequest), this._lastEvent = e, this._animRequest = r.Util.requestAnimFrame(this._updatePosition, this, !0, this._dragStartTarget)
            },
            _updatePosition: function() {
                var e = {
                    originalEvent: this._lastEvent
                };
                this.fire("predrag", e), r.DomUtil.setPosition(this._element, this._newPos), this.fire("drag", e)
            },
            _onUp: function() {
                r.DomUtil.removeClass(t.body, "leaflet-dragging"), this._lastTarget && (r.DomUtil.removeClass(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null);
                for (var e in r.Draggable.MOVE) r.DomEvent.off(t, r.Draggable.MOVE[e], this._onMove, this).off(t, r.Draggable.END[e], this._onUp, this);
                r.DomUtil.enableImageDrag(), r.DomUtil.enableTextSelection(), this._moved && this._moving && (r.Util.cancelAnimFrame(this._animRequest), this.fire("dragend", {
                    distance: this._newPos.distanceTo(this._startPos)
                })), this._moving = !1
            }
        }), r.Handler = r.Class.extend({
            initialize: function(e) {
                this._map = e
            },
            enable: function() {
                if (this._enabled) return;
                this._enabled = !0, this.addHooks()
            },
            disable: function() {
                if (!this._enabled) return;
                this._enabled = !1, this.removeHooks()
            },
            enabled: function() {
                return !!this._enabled
            }
        }), r.Map.mergeOptions({
            dragging: !0,
            inertia: !r.Browser.android23,
            inertiaDeceleration: 3400,
            inertiaMaxSpeed: Infinity,
            easeLinearity: .2,
            worldCopyJump: !1
        }), r.Map.Drag = r.Handler.extend({
            addHooks: function() {
                if (!this._draggable) {
                    var e = this._map;
                    this._draggable = new r.Draggable(e._mapPane, e._container), this._draggable.on({
                        down: this._onDown,
                        dragstart: this._onDragStart,
                        drag: this._onDrag,
                        dragend: this._onDragEnd
                    }, this), this._draggable.on("predrag", this._onPreDragLimit, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), e.on("zoomend", this._onZoomEnd, this), e.whenReady(this._onZoomEnd, this))
                }
                r.DomUtil.addClass(this._map._container, "leaflet-grab"), this._draggable.enable()
            },
            removeHooks: function() {
                r.DomUtil.removeClass(this._map._container, "leaflet-grab"), this._draggable.disable()
            },
            moved: function() {
                return this._draggable && this._draggable._moved
            },
            _onDown: function() {
                this._map.stop()
            },
            _onDragStart: function() {
                var e = this._map;
                if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
                    var t = r.latLngBounds(this._map.options.maxBounds);
                    this._offsetLimit = r.bounds(this._map.latLngToContainerPoint(t.getNorthWest()).multiplyBy(-1), this._map.latLngToContainerPoint(t.getSouthEast()).multiplyBy(-1).add(this._map.getSize())), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity))
                } else this._offsetLimit = null;
                e.fire("movestart").fire("dragstart"), e.options.inertia && (this._positions = [], this._times = [])
            },
            _onDrag: function(e) {
                if (this._map.options.inertia) {
                    var t = this._lastTime = +(new Date),
                        n = this._lastPos = this._draggable._absPos || this._draggable._newPos;
                    this._positions.push(n), this._times.push(t), t - this._times[0] > 50 && (this._positions.shift(), this._times.shift())
                }
                this._map.fire("move", e).fire("drag", e)
            },
            _onZoomEnd: function() {
                var e = this._map.getSize().divideBy(2),
                    t = this._map.latLngToLayerPoint([0, 0]);
                this._initialWorldOffset = t.subtract(e).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x
            },
            _viscousLimit: function(e, t) {
                return e - (e - t) * this._viscosity
            },
            _onPreDragLimit: function() {
                if (!this._viscosity || !this._offsetLimit) return;
                var e = this._draggable._newPos.subtract(this._draggable._startPos),
                    t = this._offsetLimit;
                e.x < t.min.x && (e.x = this._viscousLimit(e.x, t.min.x)), e.y < t.min.y && (e.y = this._viscousLimit(e.y, t.min.y)), e.x > t.max.x && (e.x = this._viscousLimit(e.x, t.max.x)), e.y > t.max.y && (e.y = this._viscousLimit(e.y, t.max.y)), this._draggable._newPos = this._draggable._startPos.add(e)
            },
            _onPreDragWrap: function() {
                var e = this._worldWidth,
                    t = Math.round(e / 2),
                    n = this._initialWorldOffset,
                    r = this._draggable._newPos.x,
                    i = (r - t + n) % e + t - n,
                    s = (r + t + n) % e - t - n,
                    o = Math.abs(i + n) < Math.abs(s + n) ? i : s;
                this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = o
            },
            _onDragEnd: function(e) {
                var t = this._map,
                    n = t.options,
                    i = !n.inertia || this._times.length < 2;
                t.fire("dragend", e);
                if (i) t.fire("moveend");
                else {
                    var s = this._lastPos.subtract(this._positions[0]),
                        o = (this._lastTime - this._times[0]) / 1e3,
                        u = n.easeLinearity,
                        a = s.multiplyBy(u / o),
                        f = a.distanceTo([0, 0]),
                        l = Math.min(n.inertiaMaxSpeed, f),
                        c = a.multiplyBy(l / f),
                        h = l / (n.inertiaDeceleration * u),
                        p = c.multiplyBy(-h / 2).round();
                    !p.x && !p.y ? t.fire("moveend") : (p = t._limitOffset(p, t.options.maxBounds), r.Util.requestAnimFrame(function() {
                        t.panBy(p, {
                            duration: h,
                            easeLinearity: u,
                            noMoveStart: !0,
                            animate: !0
                        })
                    }))
                }
            }
        }), r.Map.addInitHook("addHandler", "dragging", r.Map.Drag), r.Map.mergeOptions({
            doubleClickZoom: !0
        }), r.Map.DoubleClickZoom = r.Handler.extend({
            addHooks: function() {
                this._map.on("dblclick", this._onDoubleClick, this)
            },
            removeHooks: function() {
                this._map.off("dblclick", this._onDoubleClick, this)
            },
            _onDoubleClick: function(e) {
                var t = this._map,
                    n = t.getZoom(),
                    r = e.originalEvent.shiftKey ? Math.ceil(n) - 1 : Math.floor(n) + 1;
                t.options.doubleClickZoom === "center" ? t.setZoom(r) : t.setZoomAround(e.containerPoint, r)
            }
        }), r.Map.addInitHook("addHandler", "doubleClickZoom", r.Map.DoubleClickZoom), r.Map.mergeOptions({
            scrollWheelZoom: !0,
            wheelDebounceTime: 40
        }), r.Map.ScrollWheelZoom = r.Handler.extend({
            addHooks: function() {
                r.DomEvent.on(this._map._container, {
                    mousewheel: this._onWheelScroll,
                    MozMousePixelScroll: r.DomEvent.preventDefault
                }, this), this._delta = 0
            },
            removeHooks: function() {
                r.DomEvent.off(this._map._container, {
                    mousewheel: this._onWheelScroll,
                    MozMousePixelScroll: r.DomEvent.preventDefault
                }, this)
            },
            _onWheelScroll: function(e) {
                var t = r.DomEvent.getWheelDelta(e),
                    n = this._map.options.wheelDebounceTime;
                this._delta += t, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime || (this._startTime = +(new Date));
                var i = Math.max(n - (+(new Date) - this._startTime), 0);
                clearTimeout(this._timer), this._timer = setTimeout(r.bind(this._performZoom, this), i), r.DomEvent.stop(e)
            },
            _performZoom: function() {
                var e = this._map,
                    t = this._delta,
                    n = e.getZoom();
                e.stop(), t = t > 0 ? Math.ceil(t) : Math.floor(t), t = Math.max(Math.min(t, 4), -4), t = e._limitZoom(n + t) - n, this._delta = 0, this._startTime = null;
                if (!t) return;
                e.options.scrollWheelZoom === "center" ? e.setZoom(n + t) : e.setZoomAround(this._lastMousePos, n + t)
            }
        }), r.Map.addInitHook("addHandler", "scrollWheelZoom", r.Map.ScrollWheelZoom), r.extend(r.DomEvent, {
            _touchstart: r.Browser.msPointer ? "MSPointerDown" : r.Browser.pointer ? "pointerdown" : "touchstart",
            _touchend: r.Browser.msPointer ? "MSPointerUp" : r.Browser.pointer ? "pointerup" : "touchend",
            addDoubleTapListener: function(e, t, n) {
                function a(e) {
                    var t;
                    r.Browser.pointer ? t = r.DomEvent._pointersCount : t = e.touches.length;
                    if (t > 1) return;
                    var n = Date.now(),
                        a = n - (i || n);
                    s = e.touches ? e.touches[0] : e, o = a > 0 && a <= u, i = n
                }

                function f() {
                    if (o) {
                        if (r.Browser.pointer) {
                            var e = {}, n, u;
                            for (u in s) n = s[u], e[u] = n && n.bind ? n.bind(s) : n;
                            s = e
                        }
                        s.type = "dblclick", t(s), i = null
                    }
                }
                var i, s, o = !1,
                    u = 250,
                    l = "_leaflet_",
                    c = this._touchstart,
                    h = this._touchend;
                return e[l + c + n] = a, e[l + h + n] = f, e.addEventListener(c, a, !1), e.addEventListener(h, f, !1), this
            },
            removeDoubleTapListener: function(e, t) {
                var n = "_leaflet_",
                    r = e[n + this._touchend + t];
                return e.removeEventListener(this._touchstart, e[n + this._touchstart + t], !1), e.removeEventListener(this._touchend, r, !1), this
            }
        }), r.extend(r.DomEvent, {
            POINTER_DOWN: r.Browser.msPointer ? "MSPointerDown" : "pointerdown",
            POINTER_MOVE: r.Browser.msPointer ? "MSPointerMove" : "pointermove",
            POINTER_UP: r.Browser.msPointer ? "MSPointerUp" : "pointerup",
            POINTER_CANCEL: r.Browser.msPointer ? "MSPointerCancel" : "pointercancel",
            _pointers: {},
            _pointersCount: 0,
            addPointerListener: function(e, t, n, r) {
                return t === "touchstart" ? this._addPointerStart(e, n, r) : t === "touchmove" ? this._addPointerMove(e, n, r) : t === "touchend" && this._addPointerEnd(e, n, r), this
            },
            removePointerListener: function(e, t, n) {
                var r = e["_leaflet_" + t + n];
                return t === "touchstart" ? e.removeEventListener(this.POINTER_DOWN, r, !1) : t === "touchmove" ? e.removeEventListener(this.POINTER_MOVE, r, !1) : t === "touchend" && (e.removeEventListener(this.POINTER_UP, r, !1), e.removeEventListener(this.POINTER_CANCEL, r, !1)), this
            },
            _addPointerStart: function(e, n, i) {
                var s = r.bind(function(e) {
                    r.DomEvent.preventDefault(e), this._handlePointer(e, n)
                }, this);
                e["_leaflet_touchstart" + i] = s, e.addEventListener(this.POINTER_DOWN, s, !1);
                if (!this._pointerDocListener) {
                    var o = r.bind(this._globalPointerUp, this);
                    t.documentElement.addEventListener(this.POINTER_DOWN, r.bind(this._globalPointerDown, this), !0), t.documentElement.addEventListener(this.POINTER_MOVE, r.bind(this._globalPointerMove, this), !0), t.documentElement.addEventListener(this.POINTER_UP, o, !0), t.documentElement.addEventListener(this.POINTER_CANCEL, o, !0), this._pointerDocListener = !0
                }
            },
            _globalPointerDown: function(e) {
                this._pointers[e.pointerId] = e, this._pointersCount++
            },
            _globalPointerMove: function(e) {
                this._pointers[e.pointerId] && (this._pointers[e.pointerId] = e)
            },
            _globalPointerUp: function(e) {
                delete this._pointers[e.pointerId], this._pointersCount--
            },
            _handlePointer: function(e, t) {
                e.touches = [];
                for (var n in this._pointers) e.touches.push(this._pointers[n]);
                e.changedTouches = [e], t(e)
            },
            _addPointerMove: function(e, t, n) {
                var i = r.bind(function(e) {
                    if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === "mouse") && e.buttons === 0) return;
                    this._handlePointer(e, t)
                }, this);
                e["_leaflet_touchmove" + n] = i, e.addEventListener(this.POINTER_MOVE, i, !1)
            },
            _addPointerEnd: function(e, t, n) {
                var i = r.bind(function(e) {
                    this._handlePointer(e, t)
                }, this);
                e["_leaflet_touchend" + n] = i, e.addEventListener(this.POINTER_UP, i, !1), e.addEventListener(this.POINTER_CANCEL, i, !1)
            }
        }), r.Map.mergeOptions({
            touchZoom: r.Browser.touch && !r.Browser.android23,
            bounceAtZoomLimits: !0
        }), r.Map.TouchZoom = r.Handler.extend({
            addHooks: function() {
                r.DomEvent.on(this._map._container, "touchstart", this._onTouchStart, this)
            },
            removeHooks: function() {
                r.DomEvent.off(this._map._container, "touchstart", this._onTouchStart, this)
            },
            _onTouchStart: function(e) {
                var n = this._map;
                if (!e.touches || e.touches.length !== 2 || n._animatingZoom || this._zooming) return;
                var i = n.mouseEventToContainerPoint(e.touches[0]),
                    s = n.mouseEventToContainerPoint(e.touches[1]);
                this._centerPoint = n.getSize()._divideBy(2), this._startLatLng = n.containerPointToLatLng(this._centerPoint), n.options.touchZoom !== "center" && (this._pinchStartLatLng = n.containerPointToLatLng(i.add(s)._divideBy(2))), this._startDist = i.distanceTo(s), this._startZoom = n.getZoom(), this._moved = !1, this._zooming = !0, n.stop(), r.DomEvent.on(t, "touchmove", this._onTouchMove, this).on(t, "touchend", this._onTouchEnd, this), r.DomEvent.preventDefault(e)
            },
            _onTouchMove: function(e) {
                if (!e.touches || e.touches.length !== 2 || !this._zooming) return;
                var t = this._map,
                    n = t.mouseEventToContainerPoint(e.touches[0]),
                    i = t.mouseEventToContainerPoint(e.touches[1]),
                    s = n.distanceTo(i) / this._startDist;
                this._zoom = t.getScaleZoom(s, this._startZoom);
                if (t.options.touchZoom === "center") {
                    this._center = this._startLatLng;
                    if (s === 1) return
                } else {
                    var o = n._add(i)._divideBy(2)._subtract(this._centerPoint);
                    if (s === 1 && o.x === 0 && o.y === 0) return;
                    this._center = t.unproject(t.project(this._pinchStartLatLng).subtract(o))
                } if (!t.options.bounceAtZoomLimits)
                    if (this._zoom <= t.getMinZoom() && s < 1 || this._zoom >= t.getMaxZoom() && s > 1) return;
                this._moved || (t._moveStart(!0), this._moved = !0), r.Util.cancelAnimFrame(this._animRequest);
                var u = r.bind(t._move, t, this._center, this._zoom, {
                    pinch: !0,
                    round: !1
                });
                this._animRequest = r.Util.requestAnimFrame(u, this, !0, t._container), r.DomEvent.preventDefault(e)
            },
            _onTouchEnd: function() {
                if (!this._moved || !this._zooming) {
                    this._zooming = !1;
                    return
                }
                this._zooming = !1, r.Util.cancelAnimFrame(this._animRequest), r.DomEvent.off(t, "touchmove", this._onTouchMove).off(t, "touchend", this._onTouchEnd);
                var e = this._zoom;
                e = this._map._limitZoom(e - this._startZoom > 0 ? Math.ceil(e) : Math.floor(e)), this._map._animateZoom(this._center, e, !0, !0)
            }
        }), r.Map.addInitHook("addHandler", "touchZoom", r.Map.TouchZoom), r.Map.mergeOptions({
            tap: !0,
            tapTolerance: 15
        }), r.Map.Tap = r.Handler.extend({
            addHooks: function() {
                r.DomEvent.on(this._map._container, "touchstart", this._onDown, this)
            },
            removeHooks: function() {
                r.DomEvent.off(this._map._container, "touchstart", this._onDown, this)
            },
            _onDown: function(e) {
                if (!e.touches) return;
                r.DomEvent.preventDefault(e), this._fireClick = !0;
                if (e.touches.length > 1) {
                    this._fireClick = !1, clearTimeout(this._holdTimeout);
                    return
                }
                var n = e.touches[0],
                    i = n.target;
                this._startPos = this._newPos = new r.Point(n.clientX, n.clientY), i.tagName && i.tagName.toLowerCase() === "a" && r.DomUtil.addClass(i, "leaflet-active"), this._holdTimeout = setTimeout(r.bind(function() {
                    this._isTapValid() && (this._fireClick = !1, this._onUp(), this._simulateEvent("contextmenu", n))
                }, this), 1e3), this._simulateEvent("mousedown", n), r.DomEvent.on(t, {
                    touchmove: this._onMove,
                    touchend: this._onUp
                }, this)
            },
            _onUp: function(e) {
                clearTimeout(this._holdTimeout), r.DomEvent.off(t, {
                    touchmove: this._onMove,
                    touchend: this._onUp
                }, this);
                if (this._fireClick && e && e.changedTouches) {
                    var n = e.changedTouches[0],
                        i = n.target;
                    i && i.tagName && i.tagName.toLowerCase() === "a" && r.DomUtil.removeClass(i, "leaflet-active"), this._simulateEvent("mouseup", n), this._isTapValid() && this._simulateEvent("click", n)
                }
            },
            _isTapValid: function() {
                return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance
            },
            _onMove: function(e) {
                var t = e.touches[0];
                this._newPos = new r.Point(t.clientX, t.clientY)
            },
            _simulateEvent: function(n, r) {
                var i = t.createEvent("MouseEvents");
                i._simulated = !0, r.target._simulatedClick = !0, i.initMouseEvent(n, !0, !0, e, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), r.target.dispatchEvent(i)
            }
        }), r.Browser.touch && !r.Browser.pointer && r.Map.addInitHook("addHandler", "tap", r.Map.Tap), r.Map.mergeOptions({
            boxZoom: !0
        }), r.Map.BoxZoom = r.Handler.extend({
            initialize: function(e) {
                this._map = e, this._container = e._container, this._pane = e._panes.overlayPane
            },
            addHooks: function() {
                r.DomEvent.on(this._container, "mousedown", this._onMouseDown, this)
            },
            removeHooks: function() {
                r.DomEvent.off(this._container, "mousedown", this._onMouseDown, this)
            },
            moved: function() {
                return this._moved
            },
            _onMouseDown: function(e) {
                if (!e.shiftKey || e.which !== 1 && e.button !== 1) return !1;
                this._moved = !1, r.DomUtil.disableTextSelection(), r.DomUtil.disableImageDrag(), this._startPoint = this._map.mouseEventToContainerPoint(e), r.DomEvent.on(t, {
                    contextmenu: r.DomEvent.stop,
                    mousemove: this._onMouseMove,
                    mouseup: this._onMouseUp,
                    keydown: this._onKeyDown
                }, this)
            },
            _onMouseMove: function(e) {
                this._moved || (this._moved = !0, this._box = r.DomUtil.create("div", "leaflet-zoom-box", this._container), r.DomUtil.addClass(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
                var t = new r.Bounds(this._point, this._startPoint),
                    n = t.getSize();
                r.DomUtil.setPosition(this._box, t.min), this._box.style.width = n.x + "px", this._box.style.height = n.y + "px"
            },
            _finish: function() {
                this._moved && (r.DomUtil.remove(this._box), r.DomUtil.removeClass(this._container, "leaflet-crosshair")), r.DomUtil.enableTextSelection(), r.DomUtil.enableImageDrag(), r.DomEvent.off(t, {
                    contextmenu: r.DomEvent.stop,
                    mousemove: this._onMouseMove,
                    mouseup: this._onMouseUp,
                    keydown: this._onKeyDown
                }, this)
            },
            _onMouseUp: function(e) {
                if (e.which !== 1 && e.button !== 1) return;
                this._finish();
                if (!this._moved) return;
                var t = new r.LatLngBounds(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point));
                this._map.fitBounds(t).fire("boxzoomend", {
                    boxZoomBounds: t
                })
            },
            _onKeyDown: function(e) {
                e.keyCode === 27 && this._finish()
            }
        }), r.Map.addInitHook("addHandler", "boxZoom", r.Map.BoxZoom), r.Map.mergeOptions({
            keyboard: !0,
            keyboardPanOffset: 80,
            keyboardZoomOffset: 1
        }), r.Map.Keyboard = r.Handler.extend({
            keyCodes: {
                left: [37],
                right: [39],
                down: [40],
                up: [38],
                zoomIn: [187, 107, 61, 171],
                zoomOut: [189, 109, 54, 173]
            },
            initialize: function(e) {
                this._map = e, this._setPanOffset(e.options.keyboardPanOffset), this._setZoomOffset(e.options.keyboardZoomOffset)
            },
            addHooks: function() {
                var e = this._map._container;
                e.tabIndex === -1 && (e.tabIndex = "0"), r.DomEvent.on(e, {
                    focus: this._onFocus,
                    blur: this._onBlur,
                    mousedown: this._onMouseDown
                }, this), this._map.on({
                    focus: this._addHooks,
                    blur: this._removeHooks
                }, this)
            },
            removeHooks: function() {
                this._removeHooks(), r.DomEvent.off(this._map._container, {
                    focus: this._onFocus,
                    blur: this._onBlur,
                    mousedown: this._onMouseDown
                }, this), this._map.off({
                    focus: this._addHooks,
                    blur: this._removeHooks
                }, this)
            },
            _onMouseDown: function() {
                if (this._focused) return;
                var n = t.body,
                    r = t.documentElement,
                    i = n.scrollTop || r.scrollTop,
                    s = n.scrollLeft || r.scrollLeft;
                this._map._container.focus(), e.scrollTo(s, i)
            },
            _onFocus: function() {
                this._focused = !0, this._map.fire("focus")
            },
            _onBlur: function() {
                this._focused = !1, this._map.fire("blur")
            },
            _setPanOffset: function(e) {
                var t = this._panKeys = {}, n = this.keyCodes,
                    r, i;
                for (r = 0, i = n.left.length; r < i; r++) t[n.left[r]] = [-1 * e, 0];
                for (r = 0, i = n.right.length; r < i; r++) t[n.right[r]] = [e, 0];
                for (r = 0, i = n.down.length; r < i; r++) t[n.down[r]] = [0, e];
                for (r = 0, i = n.up.length; r < i; r++) t[n.up[r]] = [0, -1 * e]
            },
            _setZoomOffset: function(e) {
                var t = this._zoomKeys = {}, n = this.keyCodes,
                    r, i;
                for (r = 0, i = n.zoomIn.length; r < i; r++) t[n.zoomIn[r]] = e;
                for (r = 0, i = n.zoomOut.length; r < i; r++) t[n.zoomOut[r]] = -e
            },
            _addHooks: function() {
                r.DomEvent.on(t, "keydown", this._onKeyDown, this)
            },
            _removeHooks: function() {
                r.DomEvent.off(t, "keydown", this._onKeyDown, this)
            },
            _onKeyDown: function(e) {
                if (e.altKey || e.ctrlKey || e.metaKey) return;
                var t = e.keyCode,
                    n = this._map;
                if (t in this._panKeys) {
                    if (n._panAnim && n._panAnim._inProgress) return;
                    n.panBy(this._panKeys[t]), n.options.maxBounds && n.panInsideBounds(n.options.maxBounds)
                } else if (t in this._zoomKeys) n.setZoom(n.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[t]);
                else {
                    if (t !== 27) return;
                    n.closePopup()
                }
                r.DomEvent.stop(e)
            }
        }), r.Map.addInitHook("addHandler", "keyboard", r.Map.Keyboard), r.Handler.MarkerDrag = r.Handler.extend({
            initialize: function(e) {
                this._marker = e
            },
            addHooks: function() {
                var e = this._marker._icon;
                this._draggable || (this._draggable = new r.Draggable(e, e, !0)), this._draggable.on({
                    dragstart: this._onDragStart,
                    drag: this._onDrag,
                    dragend: this._onDragEnd
                }, this).enable(), r.DomUtil.addClass(e, "leaflet-marker-draggable")
            },
            removeHooks: function() {
                this._draggable.off({
                    dragstart: this._onDragStart,
                    drag: this._onDrag,
                    dragend: this._onDragEnd
                }, this).disable(), this._marker._icon && r.DomUtil.removeClass(this._marker._icon, "leaflet-marker-draggable")
            },
            moved: function() {
                return this._draggable && this._draggable._moved
            },
            _onDragStart: function() {
                this._marker.closePopup().fire("movestart").fire("dragstart")
            },
            _onDrag: function(e) {
                var t = this._marker,
                    n = t._shadow,
                    i = r.DomUtil.getPosition(t._icon),
                    s = t._map.layerPointToLatLng(i);
                n && r.DomUtil.setPosition(n, i), t._latlng = s, e.latlng = s, t.fire("move", e).fire("drag", e)
            },
            _onDragEnd: function(e) {
                this._marker.fire("moveend").fire("dragend", e)
            }
        }), r.Control = r.Class.extend({
            options: {
                position: "topright"
            },
            initialize: function(e) {
                r.setOptions(this, e)
            },
            getPosition: function() {
                return this.options.position
            },
            setPosition: function(e) {
                var t = this._map;
                return t && t.removeControl(this), this.options.position = e, t && t.addControl(this), this
            },
            getContainer: function() {
                return this._container
            },
            addTo: function(e) {
                this.remove(), this._map = e;
                var t = this._container = this.onAdd(e),
                    n = this.getPosition(),
                    i = e._controlCorners[n];
                return r.DomUtil.addClass(t, "leaflet-control"), n.indexOf("bottom") !== -1 ? i.insertBefore(t, i.firstChild) : i.appendChild(t), this
            },
            remove: function() {
                return this._map ? (r.DomUtil.remove(this._container), this.onRemove && this.onRemove(this._map), this._map = null, this) : this
            },
            _refocusOnMap: function(e) {
                this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus()
            }
        }), r.control = function(e) {
            return new r.Control(e)
        }, r.Map.include({
            addControl: function(e) {
                return e.addTo(this), this
            },
            removeControl: function(e) {
                return e.remove(), this
            },
            _initControlPos: function() {
                function i(i, s) {
                    var o = t + i + " " + t + s;
                    e[i + s] = r.DomUtil.create("div", o, n)
                }
                var e = this._controlCorners = {}, t = "leaflet-",
                    n = this._controlContainer = r.DomUtil.create("div", t + "control-container", this._container);
                i("top", "left"), i("top", "right"), i("bottom", "left"), i("bottom", "right")
            },
            _clearControlPos: function() {
                r.DomUtil.remove(this._controlContainer)
            }
        }), r.Control.Zoom = r.Control.extend({
            options: {
                position: "topleft",
                zoomInText: "+",
                zoomInTitle: "Zoom in",
                zoomOutText: "-",
                zoomOutTitle: "Zoom out"
            },
            onAdd: function(e) {
                var t = "leaflet-control-zoom",
                    n = r.DomUtil.create("div", t + " leaflet-bar"),
                    i = this.options;
                return this._zoomInButton = this._createButton(i.zoomInText, i.zoomInTitle, t + "-in", n, this._zoomIn), this._zoomOutButton = this._createButton(i.zoomOutText, i.zoomOutTitle, t + "-out", n, this._zoomOut), this._updateDisabled(), e.on("zoomend zoomlevelschange", this._updateDisabled, this), n
            },
            onRemove: function(e) {
                e.off("zoomend zoomlevelschange", this._updateDisabled, this)
            },
            disable: function() {
                return this._disabled = !0, this._updateDisabled(), this
            },
            enable: function() {
                return this._disabled = !1, this._updateDisabled(), this
            },
            _zoomIn: function(e) {
                this._disabled || this._map.zoomIn(e.shiftKey ? 3 : 1)
            },
            _zoomOut: function(e) {
                this._disabled || this._map.zoomOut(e.shiftKey ? 3 : 1)
            },
            _createButton: function(e, t, n, i, s) {
                var o = r.DomUtil.create("a", n, i);
                return o.innerHTML = e, o.href = "#", o.title = t, r.DomEvent.on(o, "mousedown dblclick", r.DomEvent.stopPropagation).on(o, "click", r.DomEvent.stop).on(o, "click", s, this).on(o, "click", this._refocusOnMap, this), o
            },
            _updateDisabled: function() {
                var e = this._map,
                    t = "leaflet-disabled";
                r.DomUtil.removeClass(this._zoomInButton, t), r.DomUtil.removeClass(this._zoomOutButton, t), (this._disabled || e._zoom === e.getMinZoom()) && r.DomUtil.addClass(this._zoomOutButton, t), (this._disabled || e._zoom === e.getMaxZoom()) && r.DomUtil.addClass(this._zoomInButton, t)
            }
        }), r.Map.mergeOptions({
            zoomControl: !0
        }), r.Map.addInitHook(function() {
            this.options.zoomControl && (this.zoomControl = new r.Control.Zoom, this.addControl(this.zoomControl))
        }), r.control.zoom = function(e) {
            return new r.Control.Zoom(e)
        }, r.Control.Attribution = r.Control.extend({
            options: {
                position: "bottomright",
                prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
            },
            initialize: function(e) {
                r.setOptions(this, e), this._attributions = {}
            },
            onAdd: function(e) {
                this._container = r.DomUtil.create("div", "leaflet-control-attribution"), r.DomEvent && r.DomEvent.disableClickPropagation(this._container);
                for (var t in e._layers) e._layers[t].getAttribution && this.addAttribution(e._layers[t].getAttribution());
                return this._update(), this._container
            },
            setPrefix: function(e) {
                return this.options.prefix = e, this._update(), this
            },
            addAttribution: function(e) {
                return e ? (this._attributions[e] || (this._attributions[e] = 0), this._attributions[e]++, this._update(), this) : this
            },
            removeAttribution: function(e) {
                return e ? (this._attributions[e] && (this._attributions[e]--, this._update()), this) : this
            },
            _update: function() {
                if (!this._map) return;
                var e = [];
                for (var t in this._attributions) this._attributions[t] && e.push(t);
                var n = [];
                this.options.prefix && n.push(this.options.prefix), e.length && n.push(e.join(", ")), this._container.innerHTML = n.join(" | ")
            }
        }), r.Map.mergeOptions({
            attributionControl: !0
        }), r.Map.addInitHook(function() {
            this.options.attributionControl && (this.attributionControl = (new r.Control.Attribution).addTo(this))
        }), r.control.attribution = function(e) {
            return new r.Control.Attribution(e)
        }, r.Control.Scale = r.Control.extend({
            options: {
                position: "bottomleft",
                maxWidth: 100,
                metric: !0,
                imperial: !0
            },
            onAdd: function(e) {
                var t = "leaflet-control-scale",
                    n = r.DomUtil.create("div", t),
                    i = this.options;
                return this._addScales(i, t + "-line", n), e.on(i.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), n
            },
            onRemove: function(e) {
                e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this)
            },
            _addScales: function(e, t, n) {
                e.metric && (this._mScale = r.DomUtil.create("div", t, n)), e.imperial && (this._iScale = r.DomUtil.create("div", t, n))
            },
            _update: function() {
                var e = this._map,
                    t = e.getSize().y / 2,
                    n = e.distance(e.containerPointToLatLng([0, t]), e.containerPointToLatLng([this.options.maxWidth, t]));
                this._updateScales(n)
            },
            _updateScales: function(e) {
                this.options.metric && e && this._updateMetric(e), this.options.imperial && e && this._updateImperial(e)
            },
            _updateMetric: function(e) {
                var t = this._getRoundNum(e),
                    n = t < 1e3 ? t + " m" : t / 1e3 + " km";
                this._updateScale(this._mScale, n, t / e)
            },
            _updateImperial: function(e) {
                var t = e * 3.2808399,
                    n, r, i;
                t > 5280 ? (n = t / 5280, r = this._getRoundNum(n), this._updateScale(this._iScale, r + " mi", r / n)) : (i = this._getRoundNum(t), this._updateScale(this._iScale, i + " ft", i / t))
            },
            _updateScale: function(e, t, n) {
                e.style.width = Math.round(this.options.maxWidth * n) + "px", e.innerHTML = t
            },
            _getRoundNum: function(e) {
                var t = Math.pow(10, (Math.floor(e) + "").length - 1),
                    n = e / t;
                return n = n >= 10 ? 10 : n >= 5 ? 5 : n >= 3 ? 3 : n >= 2 ? 2 : 1, t * n
            }
        }), r.control.scale = function(e) {
            return new r.Control.Scale(e)
        }, r.Control.Layers = r.Control.extend({
            options: {
                collapsed: !0,
                position: "topright",
                autoZIndex: !0,
                hideSingleBase: !1
            },
            initialize: function(e, t, n) {
                r.setOptions(this, n), this._layers = {}, this._lastZIndex = 0, this._handlingClick = !1;
                for (var i in e) this._addLayer(e[i], i);
                for (i in t) this._addLayer(t[i], i, !0)
            },
            onAdd: function() {
                return this._initLayout(), this._update(), this._container
            },
            addBaseLayer: function(e, t) {
                return this._addLayer(e, t), this._update()
            },
            addOverlay: function(e, t) {
                return this._addLayer(e, t, !0), this._update()
            },
            removeLayer: function(e) {
                return e.off("add remove", this._onLayerChange, this), delete this._layers[r.stamp(e)], this._update()
            },
            _initLayout: function() {
                var e = "leaflet-control-layers",
                    t = this._container = r.DomUtil.create("div", e);
                t.setAttribute("aria-haspopup", !0), r.Browser.touch ? r.DomEvent.on(t, "click", r.DomEvent.stopPropagation) : r.DomEvent.disableClickPropagation(t).disableScrollPropagation(t);
                var n = this._form = r.DomUtil.create("form", e + "-list");
                if (this.options.collapsed) {
                    r.Browser.android || r.DomEvent.on(t, {
                        mouseenter: this._expand,
                        mouseleave: this._collapse
                    }, this);
                    var i = this._layersLink = r.DomUtil.create("a", e + "-toggle", t);
                    i.href = "#", i.title = "Layers", r.Browser.touch ? r.DomEvent.on(i, "click", r.DomEvent.stop).on(i, "click", this._expand, this) : r.DomEvent.on(i, "focus", this._expand, this), r.DomEvent.on(n, "click", function() {
                        setTimeout(r.bind(this._onInputClick, this), 0)
                    }, this), this._map.on("click", this._collapse, this)
                } else this._expand();
                this._baseLayersList = r.DomUtil.create("div", e + "-base", n), this._separator = r.DomUtil.create("div", e + "-separator", n), this._overlaysList = r.DomUtil.create("div", e + "-overlays", n), t.appendChild(n)
            },
            _addLayer: function(e, t, n) {
                e.on("add remove", this._onLayerChange, this);
                var i = r.stamp(e);
                this._layers[i] = {
                    layer: e,
                    name: t,
                    overlay: n
                }, this.options.autoZIndex && e.setZIndex && (this._lastZIndex++, e.setZIndex(this._lastZIndex))
            },
            _update: function() {
                if (!this._container) return this;
                r.DomUtil.empty(this._baseLayersList), r.DomUtil.empty(this._overlaysList);
                var e, t, n, i, s = 0;
                for (n in this._layers) i = this._layers[n], this._addItem(i), t = t || i.overlay, e = e || !i.overlay, s += i.overlay ? 0 : 1;
                return this.options.hideSingleBase && (e = e && s > 1, this._baseLayersList.style.display = e ? "" : "none"), this._separator.style.display = t && e ? "" : "none", this
            },
            _onLayerChange: function(e) {
                this._handlingClick || this._update();
                var t = this._layers[r.stamp(e.target)].overlay,
                    n = t ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
                n && this._map.fire(n, e.target)
            },
            _createRadioElement: function(e, n) {
                var r = '<input type="radio" class="leaflet-control-layers-selector" name="' + e + '"' + (n ? ' checked="checked"' : "") + "/>",
                    i = t.createElement("div");
                return i.innerHTML = r, i.firstChild
            },
            _addItem: function(e) {
                var n = t.createElement("label"),
                    i = this._map.hasLayer(e.layer),
                    s;
                e.overlay ? (s = t.createElement("input"), s.type = "checkbox", s.className = "leaflet-control-layers-selector", s.defaultChecked = i) : s = this._createRadioElement("leaflet-base-layers", i), s.layerId = r.stamp(e.layer), r.DomEvent.on(s, "click", this._onInputClick, this);
                var o = t.createElement("span");
                o.innerHTML = " " + e.name;
                var u = t.createElement("div");
                n.appendChild(u), u.appendChild(s), u.appendChild(o);
                var a = e.overlay ? this._overlaysList : this._baseLayersList;
                return a.appendChild(n), n
            },
            _onInputClick: function() {
                var e = this._form.getElementsByTagName("input"),
                    t, n, r, i = [],
                    s = [];
                this._handlingClick = !0;
                for (var o = 0, u = e.length; o < u; o++) t = e[o], n = this._layers[t.layerId].layer, r = this._map.hasLayer(n), t.checked && !r ? i.push(n) : !t.checked && r && s.push(n);
                for (o = 0; o < s.length; o++) this._map.removeLayer(s[o]);
                for (o = 0; o < i.length; o++) this._map.addLayer(i[o]);
                this._handlingClick = !1, this._refocusOnMap()
            },
            _expand: function() {
                r.DomUtil.addClass(this._container, "leaflet-control-layers-expanded");
                var e = this._map._size.y - this._container.offsetTop * 4;
                e < this._form.clientHeight && (r.DomUtil.addClass(this._form, "leaflet-control-layers-scrollbar"), this._form.style.height = e + "px")
            },
            _collapse: function() {
                r.DomUtil.removeClass(this._container, "leaflet-control-layers-expanded")
            }
        }), r.control.layers = function(e, t, n) {
            return new r.Control.Layers(e, t, n)
        }, r.PosAnimation = r.Evented.extend({
            run: function(e, t, n, i) {
                this.stop(), this._el = e, this._inProgress = !0, this._duration = n || .25, this._easeOutPower = 1 / Math.max(i || .5, .2), this._startPos = r.DomUtil.getPosition(e), this._offset = t.subtract(this._startPos), this._startTime = +(new Date), this.fire("start"), this._animate()
            },
            stop: function() {
                if (!this._inProgress) return;
                this._step(!0), this._complete()
            },
            _animate: function() {
                this._animId = r.Util.requestAnimFrame(this._animate, this), this._step()
            },
            _step: function(e) {
                var t = +(new Date) - this._startTime,
                    n = this._duration * 1e3;
                t < n ? this._runFrame(this._easeOut(t / n), e) : (this._runFrame(1), this._complete())
            },
            _runFrame: function(e, t) {
                var n = this._startPos.add(this._offset.multiplyBy(e));
                t && n._round(), r.DomUtil.setPosition(this._el, n), this.fire("step")
            },
            _complete: function() {
                r.Util.cancelAnimFrame(this._animId), this._inProgress = !1, this.fire("end")
            },
            _easeOut: function(e) {
                return 1 - Math.pow(1 - e, this._easeOutPower)
            }
        }), r.Map.include({
            setView: function(e, t, i) {
                t = t === n ? this._zoom : this._limitZoom(t), e = this._limitCenter(r.latLng(e), t, this.options.maxBounds), i = i || {}, this.stop();
                if (this._loaded && !i.reset && i !== !0) {
                    i.animate !== n && (i.zoom = r.extend({
                        animate: i.animate
                    }, i.zoom), i.pan = r.extend({
                        animate: i.animate
                    }, i.pan));
                    var s = this._zoom !== t ? this._tryAnimatedZoom && this._tryAnimatedZoom(e, t, i.zoom) : this._tryAnimatedPan(e, i.pan);
                    if (s) return clearTimeout(this._sizeTimer), this
                }
                return this._resetView(e, t), this
            },
            panBy: function(e, t) {
                e = r.point(e).round(), t = t || {};
                if (!e.x && !e.y) return this;
                if (t.animate !== !0 && !this.getSize().contains(e)) return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
                this._panAnim || (this._panAnim = new r.PosAnimation, this._panAnim.on({
                    step: this._onPanTransitionStep,
                    end: this._onPanTransitionEnd
                }, this)), t.noMoveStart || this.fire("movestart");
                if (t.animate !== !1) {
                    r.DomUtil.addClass(this._mapPane, "leaflet-pan-anim");
                    var n = this._getMapPanePos().subtract(e);
                    this._panAnim.run(this._mapPane, n, t.duration || .25, t.easeLinearity)
                } else this._rawPanBy(e), this.fire("move").fire("moveend");
                return this
            },
            _onPanTransitionStep: function() {
                this.fire("move")
            },
            _onPanTransitionEnd: function() {
                r.DomUtil.removeClass(this._mapPane, "leaflet-pan-anim"), this.fire("moveend")
            },
            _tryAnimatedPan: function(e, t) {
                var n = this._getCenterOffset(e)._floor();
                return (t && t.animate) !== !0 && !this.getSize().contains(n) ? !1 : (this.panBy(n, t), (t && t.animate) !== !1)
            }
        }), r.Map.mergeOptions({
            zoomAnimation: !0,
            zoomAnimationThreshold: 4
        });
        var a = r.DomUtil.TRANSITION && r.Browser.any3d && !r.Browser.mobileOpera;
        a && r.Map.addInitHook(function() {
            this._zoomAnimated = this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), r.DomEvent.on(this._proxy, r.DomUtil.TRANSITION_END, this._catchTransitionEnd, this))
        }), r.Map.include(a ? {
            _createAnimProxy: function() {
                var e = this._proxy = r.DomUtil.create("div", "leaflet-proxy leaflet-zoom-animated");
                this._panes.mapPane.appendChild(e), this.on("zoomanim", function(t) {
                    var n = r.DomUtil.TRANSFORM,
                        i = e.style[n];
                    r.DomUtil.setTransform(e, this.project(t.center, t.zoom), this.getZoomScale(t.zoom, 1)), i === e.style[n] && this._animatingZoom && this._onZoomTransitionEnd()
                }, this), this.on("load moveend", function() {
                    var t = this.getCenter(),
                        n = this.getZoom();
                    r.DomUtil.setTransform(e, this.project(t, n), this.getZoomScale(n, 1))
                }, this)
            },
            _catchTransitionEnd: function(e) {
                this._animatingZoom && e.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd()
            },
            _nothingToAnimate: function() {
                return !this._container.getElementsByClassName("leaflet-zoom-animated").length
            },
            _tryAnimatedZoom: function(e, t, n) {
                if (this._animatingZoom) return !0;
                n = n || {};
                if (!this._zoomAnimated || n.animate === !1 || this._nothingToAnimate() || Math.abs(t - this._zoom) > this.options.zoomAnimationThreshold) return !1;
                var i = this.getZoomScale(t),
                    s = this._getCenterOffset(e)._divideBy(1 - 1 / i);
                return n.animate !== !0 && !this.getSize().contains(s) ? !1 : (r.Util.requestAnimFrame(function() {
                    this._moveStart(!0)._animateZoom(e, t, !0)
                }, this), !0)
            },
            _animateZoom: function(e, t, n, i) {
                n && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = t, r.DomUtil.addClass(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
                    center: e,
                    zoom: t,
                    noUpdate: i
                })
            },
            _onZoomTransitionEnd: function() {
                this._animatingZoom = !1, r.DomUtil.removeClass(this._mapPane, "leaflet-zoom-anim"), this._move(this._animateToCenter, this._animateToZoom)._moveEnd(!0)
            }
        } : {}), r.Map.include({
            flyTo: function(e, t, i) {
                function d(e) {
                    var t = (l * l - f * f + (e ? -1 : 1) * p * p * c * c) / (2 * (e ? l : f) * p * c);
                    return Math.log(Math.sqrt(t * t + 1) - t)
                }

                function v(e) {
                    return (Math.exp(e) - Math.exp(-e)) / 2
                }

                function m(e) {
                    return (Math.exp(e) + Math.exp(-e)) / 2
                }

                function g(e) {
                    return v(e) / m(e)
                }

                function b(e) {
                    return f * (m(y) / m(y + h * e))
                }

                function w(e) {
                    return f * (m(y) * g(y + h * e) - v(y)) / p
                }

                function E(e) {
                    return 1 - Math.pow(1 - e, 1.5)
                }

                function N() {
                    var n = (Date.now() - S) / T,
                        i = E(n) * x;
                    n <= 1 ? (this._flyToFrame = r.Util.requestAnimFrame(N, this), this._move(this.unproject(s.add(o.subtract(s).multiplyBy(w(i) / c)), a), this.getScaleZoom(f / b(i), a))) : this._move(e, t)._moveEnd(!0)
                }
                i = i || {};
                if (i.animate === !1 || !r.Browser.any3d) return this.setView(e, t, i);
                this.stop();
                var s = this.project(this.getCenter()),
                    o = this.project(e),
                    u = this.getSize(),
                    a = this._zoom;
                e = r.latLng(e), t = t === n ? a : t;
                var f = Math.max(u.x, u.y),
                    l = f * this.getZoomScale(a, t),
                    c = o.distanceTo(s),
                    h = 1.42,
                    p = h * h,
                    y = d(0),
                    S = Date.now(),
                    x = (d(1) - y) / h,
                    T = i.duration ? 1e3 * i.duration : 1e3 * x * .8;
                return this._moveStart(!0), N.call(this), this
            },
            flyToBounds: function(e, t) {
                var n = this._getBoundsCenterZoom(e, t);
                return this.flyTo(n.center, n.zoom, t)
            }
        }), r.Map.include({
            _defaultLocateOptions: {
                timeout: 1e4,
                watch: !1
            },
            locate: function(e) {
                e = this._locateOptions = r.extend({}, this._defaultLocateOptions, e);
                if ("geolocation" in navigator) {
                    var t = r.bind(this._handleGeolocationResponse, this),
                        n = r.bind(this._handleGeolocationError, this);
                    return e.watch ? this._locationWatchId = navigator.geolocation.watchPosition(t, n, e) : navigator.geolocation.getCurrentPosition(t, n, e), this
                }
                return this._handleGeolocationError({
                    code: 0,
                    message: "Geolocation not supported."
                }), this
            },
            stopLocate: function() {
                return navigator.geolocation && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this
            },
            _handleGeolocationError: function(e) {
                var t = e.code,
                    n = e.message || (t === 1 ? "permission denied" : t === 2 ? "position unavailable" : "timeout");
                this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
                    code: t,
                    message: "Geolocation error: " + n + "."
                })
            },
            _handleGeolocationResponse: function(e) {
                var t = e.coords.latitude,
                    n = e.coords.longitude,
                    i = new r.LatLng(t, n),
                    s = i.toBounds(e.coords.accuracy),
                    o = this._locateOptions;
                if (o.setView) {
                    var u = this.getBoundsZoom(s);
                    this.setView(i, o.maxZoom ? Math.min(u, o.maxZoom) : u)
                }
                var a = {
                    latlng: i,
                    bounds: s,
                    timestamp: e.timestamp
                };
                for (var f in e.coords) typeof e.coords[f] == "number" && (a[f] = e.coords[f]);
                this.fire("locationfound", a)
            }
        })
    })(e, document), L.TileLayer.WA = L.TileLayer.extend({
        options: {
            url: "//www.webatlas.no/maptiles/tiles/{tileset}/wa_grid/{z}/{x}/{y}.{ext}",
            tileset: {
                vector: "webatlas-standard-vektor",
                aerial: "webatlas-orto-newup",
                hybrid: "webatlas-standard-hybrid"
            },
            mapType: 0,
            maxZoom: 19,
            minZoom: 4
        },
        initialize: function(t) {
            L.Util.setOptions(this, t), e.location.protocol == "https:" ? this.options.url = "https:" + this.options.url : this.options.url = "http:" + this.options.url;
            switch (this.options.mapType) {
                case 0:
                    this.options.url = this.options.url.replace("{tileset}", this.options.tileset.vector).replace("{ext}", "png");
                case 1:
                    this.options.url = this.options.url.replace("{tileset}", this.options.tileset.aerial).replace("{ext}", "jpeg");
                case 2:
                    this.options.url = this.options.url.replace("{tileset}", this.options.tileset.hybrid).replace("{ext}", "jpeg")
            }
            this.setUrl(this.options.url)
        }
    }), L.TileLayer.WA.Type = {
        VECTOR: 0,
        AERIAL: 1,
        HYBRID: 2
    }, WebatlasMap = L.Map.extend({
        options: {
            decoration: !0,
            useTileCache: !0,
            attributionControl: !1,
            logUrl: "//www.webatlas.no/weblog/Log2.aspx?",
            tileset: {
                vector: "webatlas-standard-vektor",
                aerial: "webatlas-orto-newup",
                hybrid: "webatlas-standard-hybrid"
            },
            defaultTileLayer: L.TileLayer.WA.Type.VECTOR,
            maxZoom: 19,
            minZoom: 4
        },
        initialize: function(t, n) {
            L.Util.setOptions(this, n);
            if (!this.options.customer) throw Error("Need to specify a options value for: customer");
            e.location.protocol == "https:" ? this.options.logUrl = "https:" + this.options.logUrl : this.options.logUrl = "http:" + this.options.logUrl, L.Map.prototype.initialize.call(this, t), this._currentMapStyle = 0;
            if (this.options.useTileCache) {
                var r = new L.TileLayer.WA({
                    mapType: L.TileLayer.WA.Type.VECTOR,
                    https: this.options.https,
                    tileset: this.options.tileset,
                    maxZoom: this.options.maxZoom,
                    minZoom: this.options.minZoom
                }),
                    i = new L.TileLayer.WA({
                        mapType: L.TileLayer.WA.Type.AERIAL,
                        https: this.options.https,
                        tileset: this.options.tileset,
                        maxZoom: this.options.maxZoom,
                        minZoom: this.options.minZoom
                    }),
                    s = new L.TileLayer.WA({
                        mapType: L.TileLayer.WA.Type.HYBRID,
                        https: this.options.https,
                        tileset: this.options.tileset,
                        maxZoom: this.options.maxZoom,
                        minZoom: this.options.minZoom
                    }),
                    o = {
                        Kart: r,
                        Foto: i,
                        Hybrid: s
                    };
                this.setView(new L.LatLng(59.91627755707145, 10.74329126960798), 13, {
                    reset: !0
                }), this.options.defaultTileLayer == L.TileLayer.WA.Type.VECTOR ? r.addTo(this) : this.options.defaultTileLayer == L.TileLayer.WA.Type.AERIAL ? i.addTo(this) : s.addTo(this)
            }
            return this.options.decoration && (L.control.scale({
                imperial: !1,
                position: "bottomright"
            }).addTo(this), this.options.useTileCache && (L.control.waattribution().addTo(this), this.LayerControl = L.control.layers(o), this.LayerControl.addTo(this))), this.t_logTimer = null, this.on("moveend", L.Util.bind(this.onMapMoved, this)), this.on("baselayerchange", L.Util.bind(this.onBaseLayerChanged, this)), this.onMapMoved(), this
        },
        onMapMoved: function(e) {
            clearTimeout(this.t_logTimer), this.t_logTimer = setTimeout(L.Util.bind(this.logMapRequest, this), 350)
        },
        logMapRequest: function() {
            var e = this.getBounds(),
                t = e.getNorthWest().lng,
                n = e.getNorthWest().lat,
                r = e.getSouthEast().lng,
                i = e.getSouthEast().lat,
                s = document.createElement("img");
            s.src = this.options.logUrl + "WMS-REQUEST=BBOX=" + t + "," + i + "," + r + "," + n + "&MAPSTYLE=" + this._currentMapStyle + "&CUSTOMER=" + this.options.customer, "&SERVER=" + this.webatlasTileServerLowerBound, s = null
        },
        onBaseLayerChanged: function(e) {
            e.layer._mapType && (this._currentMapStyle = e.layer._mapType), this.onMapMoved()
        }
    }), L.Control.WAAttribution = L.Control.extend({
        options: {
            position: "bottomleft"
        },
        statics: {
            t_osloLat: [59.81691, 59.81734, 59.81813, 59.82537, 59.82484, 59.82298, 59.82343, 59.82494, 59.82588, 59.8262, 59.82367, 59.82349, 59.82954, 59.83053, 59.83929, 59.85107, 59.87719, 59.87593, 59.88371, 59.88441, 59.89462, 59.90941, 59.91071, 59.91407, 59.9147, 59.91405, 59.91468, 59.91632, 59.91732, 59.91797, 59.91771, 59.91876, 59.92173, 59.92246, 59.9235, 59.92441, 59.92518, 59.92709, 59.92786, 59.92963, 59.93123, 59.93255, 59.93459, 59.93579, 59.93925, 59.9424, 59.9428, 59.94566, 59.94784, 59.95187, 59.9523, 59.95303, 59.95354, 59.95371, 59.95626, 59.95723, 59.95856, 59.96163, 59.96267, 59.96483, 59.96634, 59.97051, 59.97432, 59.97661, 59.97698, 59.97671, 59.9777, 59.97674, 59.97686, 59.97754, 59.9786, 59.98552, 59.99223, 59.99403, 59.99639, 59.99672, 59.99462, 59.99365, 59.99552, 59.99804, 60.00064, 60.00014, 59.99932, 59.99977, 59.99991, 59.99936, 60.0085, 60.01579, 60.01726, 60.02602, 60.03843, 60.05177, 60.06503, 60.07624, 60.07728, 60.08286, 60.09214, 60.09394, 60.10068, 60.10983, 60.11678, 60.1287, 60.13162, 60.13459, 60.13518, 60.13277, 60.13353, 60.1258, 60.12586, 60.12531, 60.12519, 60.12286, 60.12117, 60.1194, 60.11991, 60.11966, 60.12019, 60.12059, 60.12154, 60.12172, 60.12365, 60.12504, 60.12573, 60.12526, 60.12326, 60.12303, 60.12161, 60.12081, 60.11833, 60.11285, 60.11218, 60.1118, 60.10609, 60.10496, 60.10103, 60.09955, 60.09917, 60.0986, 60.09856, 60.09777, 60.09268, 60.08689, 60.08659, 60.08403, 60.07893, 60.07827, 60.07714, 60.07484, 60.0706, 60.06755, 60.06689, 60.0661, 60.06575, 60.06421, 60.06467, 60.06436, 60.06515, 60.06489, 60.06429, 60.05371, 60.04309, 60.04054, 60.03783, 60.03693, 60.03563, 60.03328, 60.03026, 60.02976, 60.02912, 60.02736, 60.0211, 60.01813, 60.01788, 60.01734, 60.01791, 60.02211, 60.02327, 60.02315, 60.02148, 60.01985, 60.0178, 60.00969, 60.00846, 60.0061, 59.99799, 59.99815, 59.99714, 59.99964, 60.00179, 59.99616, 59.99552, 59.99566, 59.99491, 59.99301, 59.98677, 59.98558, 59.98442, 59.98078, 59.98053, 59.98072, 59.98023, 59.98099, 59.98398, 59.98455, 59.98372, 59.97712, 59.97705, 59.96955, 59.96552, 59.96286, 59.95484, 59.9526, 59.95321, 59.94924, 59.94803, 59.94694, 59.94778, 59.94687, 59.94598, 59.94572, 59.94318, 59.9418, 59.94116, 59.93486, 59.92653, 59.92045, 59.91937, 59.91228, 59.91162, 59.91127, 59.90041, 59.89682, 59.88496, 59.87528, 59.86989, 59.86475, 59.8601, 59.85206, 59.84493, 59.83684, 59.83631, 59.83489, 59.8317, 59.83133, 59.82693, 59.82773, 59.82776, 59.82679, 59.8271, 59.82629, 59.82609, 59.8262, 59.82548, 59.82368, 59.82204, 59.82102, 59.81815, 59.81703, 59.81575, 59.81434, 59.81216, 59.81104, 59.81204, 59.81297, 59.81306, 59.81232, 59.80946, 59.81198, 59.81529, 59.81685, 59.81616, 59.81699, 59.81691],
            t_osloLon: [10.83369, 10.83169, 10.81725, 10.81244, 10.8045, 10.79843, 10.7892, 10.78261, 10.78091, 10.77675, 10.77244, 10.77156, 10.76478, 10.76156, 10.744, 10.73995, 10.73097, 10.68893, 10.66064, 10.65808, 10.65387, 10.64777, 10.64253, 10.63988, 10.63553, 10.63506, 10.63304, 10.63298, 10.63427, 10.63309, 10.63123, 10.63006, 10.62936, 10.62578, 10.62532, 10.62596, 10.62746, 10.62543, 10.62708, 10.62647, 10.63107, 10.63299, 10.63402, 10.63531, 10.63161, 10.63341, 10.63289, 10.63581, 10.63561, 10.63387, 10.63304, 10.63403, 10.63353, 10.63205, 10.63083, 10.63175, 10.62995, 10.62758, 10.62357, 10.62444, 10.62051, 10.61817, 10.61395, 10.61045, 10.60385, 10.6037, 10.59622, 10.59395, 10.59165, 10.59027, 10.59025, 10.57878, 10.5657, 10.55948, 10.55692, 10.55585, 10.55218, 10.54912, 10.54526, 10.54399, 10.5338, 10.52968, 10.52841, 10.52754, 10.52266, 10.51795, 10.50366, 10.49021, 10.48916, 10.50276, 10.52201, 10.54276, 10.56337, 10.58077, 10.59731, 10.59278, 10.59184, 10.59212, 10.58836, 10.57999, 10.57278, 10.59522, 10.60081, 10.61047, 10.61906, 10.64515, 10.68032, 10.69737, 10.69842, 10.69986, 10.70447, 10.70493, 10.70385, 10.70726, 10.71477, 10.71615, 10.71703, 10.71688, 10.7198, 10.72497, 10.73165, 10.73248, 10.73712, 10.74026, 10.74418, 10.74689, 10.7483, 10.75123, 10.75232, 10.76785, 10.7684, 10.76621, 10.75711, 10.75593, 10.75475, 10.75534, 10.75762, 10.75796, 10.75916, 10.76205, 10.7671, 10.77063, 10.77233, 10.77481, 10.77796, 10.77902, 10.77864, 10.78232, 10.7847, 10.78802, 10.79385, 10.79691, 10.80157, 10.80937, 10.81045, 10.81208, 10.81561, 10.81927, 10.81976, 10.81656, 10.81803, 10.81696, 10.8181, 10.81464, 10.8128, 10.81205, 10.81316, 10.8124, 10.8134, 10.812, 10.81542, 10.81921, 10.82064, 10.82139, 10.82217, 10.8235, 10.82526, 10.82693, 10.82875, 10.82921, 10.83204, 10.83314, 10.83571, 10.83704, 10.83808, 10.8391, 10.84252, 10.84311, 10.84959, 10.85821, 10.86331, 10.86429, 10.86605, 10.86714, 10.87516, 10.8754, 10.88293, 10.89337, 10.90433, 10.90591, 10.9074, 10.91267, 10.91629, 10.9182, 10.92565, 10.93057, 10.93106, 10.93751, 10.93807, 10.93705, 10.94129, 10.94334, 10.94433, 10.95138, 10.94763, 10.94608, 10.94499, 10.94244, 10.94272, 10.94206, 10.94584, 10.94306, 10.94246, 10.92912, 10.92148, 10.91913, 10.91781, 10.91573, 10.91481, 10.91521, 10.91188, 10.91142, 10.90762, 10.90988, 10.90715, 10.90934, 10.91233, 10.92155, 10.92651, 10.93119, 10.93367, 10.9352, 10.9366, 10.933, 10.92716, 10.92303, 10.91703, 10.91477, 10.91326, 10.91079, 10.91094, 10.90679, 10.90105, 10.89649, 10.89677, 10.8918, 10.89157, 10.88907, 10.8876, 10.88294, 10.88188, 10.87985, 10.87885, 10.87378, 10.86889, 10.86313, 10.85584, 10.8479, 10.84604, 10.84597, 10.8373, 10.83566, 10.83369],
            t_norgeLat: [69.11, 69.09, 69.04, 69.04, 69.09, 69.1, 69.12, 69.18, 69.19, 69.2, 69.22, 69.23, 69.26, 69.27, 69.28, 69.28, 69.31, 69.3, 69.27, 69.24, 69.24, 69.15, 69.13, 69.13, 69.12, 69.11, 69.09, 69.02, 69.01, 68.96, 68.96, 68.93, 68.93, 68.91, 68.85, 68.83, 68.82, 68.8, 68.79, 68.75, 68.74, 68.72, 68.72, 68.72, 68.73, 68.74, 68.74, 68.74, 68.73, 68.71, 68.7, 68.69, 68.69, 68.69, 68.68, 68.68, 68.63, 68.63, 68.63, 68.64, 68.64, 68.64, 68.66, 68.66, 68.67, 68.67, 68.68, 68.69, 68.7, 68.7, 68.7, 68.7, 68.71, 68.71, 68.75, 68.78, 68.82, 68.84, 68.83, 68.83, 68.83, 68.81, 68.8, 68.79, 68.76, 68.76, 68.75, 68.74, 68.73, 68.73, 68.73, 68.71, 68.69, 68.68, 68.66, 68.65, 68.65, 68.66, 68.64, 68.63, 68.63, 68.62, 68.61, 68.59, 68.56, 68.56, 68.56, 68.55, 68.55, 68.56, 68.57, 68.58, 68.59, 68.59, 68.6, 68.61, 68.61, 68.61, 68.61, 68.62, 68.62, 68.62, 68.62, 68.62, 68.62, 68.62, 68.62, 68.62, 68.63, 68.63, 68.64, 68.64, 68.65, 68.66, 68.66, 68.67, 68.68, 68.69, 68.69, 68.7, 68.7, 68.71, 68.71, 68.72, 68.73, 68.74, 68.75, 68.8, 68.8, 68.8, 68.81, 68.82, 68.83, 68.84, 68.84, 68.85, 68.85, 68.86, 68.86, 68.86, 68.87, 68.88, 68.88, 68.88, 68.88, 68.89, 68.89, 68.89, 68.89, 68.9, 68.9, 68.9, 68.9, 68.9, 68.9, 68.89, 68.89, 68.89, 68.89, 68.89, 68.88, 68.88, 68.88, 68.89, 68.89, 68.89, 68.9, 68.9, 68.92, 68.93, 68.94, 68.94, 68.95, 68.99, 69, 69.01, 69.01, 69.02, 69.11, 69.12, 69.14, 69.15, 69.17, 69.18, 69.19, 69.2, 69.22, 69.23, 69.23, 69.25, 69.26, 69.27, 69.27, 69.28, 69.28, 69.29, 69.3, 69.3, 69.31, 69.31, 69.34, 69.34, 69.35, 69.36, 69.36, 69.37, 69.38, 69.39, 69.39, 69.4, 69.41, 69.42, 69.42, 69.43, 69.43, 69.44, 69.45, 69.46, 69.47, 69.48, 69.49, 69.51, 69.52, 69.53, 69.55, 69.56, 69.57, 69.58, 69.59, 69.61, 69.63, 69.65, 69.65, 69.65, 69.66, 69.67, 69.68, 69.68, 69.69, 69.7, 69.71, 69.72, 69.73, 69.73, 69.74, 69.74, 69.75, 69.75, 69.77, 69.8, 69.81, 69.82, 69.83, 69.85, 69.86, 69.88, 69.89, 69.9, 69.91, 69.92, 69.94, 69.96, 69.96, 69.95, 69.95, 69.95, 69.94, 69.95, 69.95, 69.96, 69.96, 69.95, 69.95, 69.94, 69.93, 69.93, 69.93, 69.93, 69.94, 69.94, 69.94, 69.93, 69.93, 69.92, 69.91, 69.91, 69.91, 69.92, 69.93, 69.93, 69.93, 69.95, 69.95, 69.95, 69.95, 69.96, 69.96, 69.97, 69.98, 69.98, 69.99, 69.99, 69.99, 70, 70.01, 70.02, 70.02, 70.02, 70.02, 70.03, 70.03, 70.04, 70.05, 70.06, 70.06, 70.07, 70.08, 70.07, 70.06, 70.06, 70.07, 70.07, 70.08, 70.09, 70.09, 70.09, 70.05, 70.04, 70.04, 70, 69.92, 69.9, 69.89, 69.88, 69.87, 69.87, 69.86, 69.85, 69.83, 69.82, 69.79, 69.78, 69.69, 69.69, 69.68, 69.67, 69.57, 69.55, 69.53, 69.52, 69.51, 69.49, 69.48, 69.47, 69.46, 69.41, 69.4, 69.31, 69.28, 69.23, 69.22, 69.19, 69.18, 69.16, 69.14, 69.13, 69.12, 69.11, 69.1, 69.09, 69.08, 69.06, 69.05, 69.04, 69.04, 69.02, 69.02, 69.01, 69.02, 69.02, 69.03, 69.03, 69.06, 69.07, 69.11, 69.12, 69.15, 69.18, 69.21, 69.23, 69.24, 69.24, 69.25, 69.25, 69.26, 69.27, 69.29, 69.3, 69.31, 69.31, 69.31, 69.31, 69.33, 69.33, 69.31, 69.32, 69.32, 69.33, 69.35, 69.37, 69.37, 69.39, 69.39, 69.4, 69.4, 69.41, 69.42, 69.42, 69.42, 69.42, 69.41, 69.41, 69.4, 69.41, 69.41, 69.41, 69.42, 69.43, 69.43, 69.43, 69.44, 69.45, 69.46, 69.47, 69.47, 69.47, 69.49, 69.51, 69.52, 69.52, 69.53, 69.53, 69.55, 69.56, 69.58, 69.59, 69.6, 69.62, 69.63, 69.64, 69.64, 69.64, 69.64, 69.65, 69.66, 69.67, 69.67, 69.65, 69.63, 69.63, 69.63, 69.62, 69.61, 69.59, 69.54, 69.54, 69.54, 69.54, 69.54, 69.54, 69.54, 69.54, 69.53, 69.53, 69.53, 69.56, 69.56, 69.57, 69.58, 69.59, 69.61, 69.64, 69.65, 69.66, 69.67, 69.68, 69.67, 69.67, 69.68, 69.69, 69.69, 69.7, 69.7, 69.71, 69.72, 69.72, 69.73, 69.78, 69.78, 69.79, 69.78, 69.78, 69.77, 69.77, 69.76, 69.76, 69.76, 69.79, 69.79, 69.79, 69.98, 70.01, 70.12, 70.12, 70.11, 70.14, 70.24, 70.35, 70.36, 70.4, 70.44, 70.47, 70.5, 70.54, 70.65, 70.67, 70.83, 70.87, 70.94, 70.95, 71.02, 71.12, 71.28, 71.3, 71.32, 71.33, 71.35, 71.36, 71.38, 71.38, 71.34, 71.31, 71.31, 71.3, 71.29, 71.27, 71.19, 71.11, 70.99, 70.98, 70.9, 70.85, 70.79, 70.7, 70.63, 70.56, 70.48, 70.39, 70.35, 70.17, 70.07, 69.99, 69.81, 69.75, 69.71, 69.7, 69.65, 69.6, 69.52, 69.51, 69.39, 69.35, 69.32, 69.25, 69.25, 69.18, 69.08, 69.07, 69, 68.9, 68.85, 68.76, 68.73, 68.61, 68.54, 68.46, 68.46, 68.4, 68.39, 68.34, 68.29, 68.24, 68.15, 68.12, 68.1, 68.01, 67.87, 67.82, 67.78, 67.7, 67.7, 67.62, 67.59, 67.54, 67.47, 67.44, 67.39, 67.34, 67.02, 66.82, 66.71, 66.67, 66.4, 66.19, 65.97, 65.7, 65.57, 65.54, 65.5, 65.47, 65.35, 65.27, 65.05, 64.99, 64.87, 64.78, 64.73, 64.55, 64.36, 64.24, 64.14, 64.04, 63.77, 63.7, 63.58, 63.43, 63.34, 63.31, 63.27, 63.26, 63.25, 63.19, 63.18, 63.15, 63.09, 63.02, 63, 62.97, 62.93, 62.81, 62.75, 62.67, 62.62, 62.47, 62.43, 62.38, 62.29, 62.18, 62.15, 62.03, 61.85, 61.78, 61.71, 61.68, 61.55, 61.54, 61.49, 61.35, 61.23, 61.16, 61.07, 61, 60.83, 60.81, 60.72, 60.69, 60.57, 60.51, 60.44, 60.41, 60.39, 60.31, 60.23, 60.17, 60.1, 60.07, 60.05, 59.91, 59.87, 59.79, 59.76, 59.72, 59.68, 59.67, 59.56, 59.56, 59.5, 59.44, 59.36, 59.31, 59.27, 59.22, 59.18, 59.14, 59.12, 59.07, 59.04, 59, 58.96, 58.92, 58.81, 58.78, 58.76, 58.65, 58.62, 58.6, 58.55, 58.53, 58.5, 58.44, 58.4, 58.36, 58.33, 58.28, 58.16, 58.08, 58.07, 58.06, 58.03, 58.02, 57.97, 57.91, 57.88, 57.88, 57.82, 57.79, 57.77, 57.76, 57.76, 57.76, 57.76, 57.77, 57.78, 57.79, 57.8, 57.83, 57.85, 57.9, 57.92, 57.94, 57.98, 58.02, 58.04, 58.08, 58.13, 58.15, 58.17, 58.25, 58.39, 58.42, 58.43, 58.52, 58.6, 58.67, 58.72, 58.72, 58.73, 58.74, 58.76, 58.77, 58.77, 58.76, 58.76, 58.89, 58.94, 58.96, 58.98, 58.99, 59.01, 59.08, 59.08, 59.09, 59.09, 59.09, 59.09, 59.1, 59.1, 59.1, 59.1, 59.1, 59.1, 59.1, 59.08, 59.08, 59.07, 59.06, 59.06, 59.04, 59.04, 59.03, 59.02, 59.01, 58.99, 58.99, 58.98, 58.97, 58.95, 58.94, 58.93, 58.92, 58.89, 58.89, 58.89, 58.89, 58.89, 58.88, 58.88, 58.88, 58.88, 58.88, 58.88, 58.88, 58.89, 58.89, 58.89, 58.88, 58.88, 58.89, 58.89, 58.89, 58.89, 58.9, 58.9, 58.9, 58.9, 58.9, 58.91, 58.92, 58.92, 58.93, 58.93, 58.94, 58.95, 58.96, 58.98, 58.99, 59.01, 59.01, 59.03, 59.03, 59.04, 59.05, 59.06, 59.07, 59.09, 59.09, 59.1, 59.11, 59.12, 59.12, 59.13, 59.14, 59.15, 59.16, 59.17, 59.18, 59.19, 59.2, 59.21, 59.22, 59.22, 59.23, 59.23, 59.24, 59.25, 59.27, 59.29, 59.31, 59.32, 59.32, 59.33, 59.34, 59.34, 59.35, 59.38, 59.4, 59.41, 59.42, 59.42, 59.43, 59.44, 59.46, 59.47, 59.48, 59.5, 59.51, 59.54, 59.55, 59.56, 59.57, 59.58, 59.59, 59.6, 59.61, 59.61, 59.62, 59.62, 59.63, 59.63, 59.64, 59.64, 59.64, 59.64, 59.64, 59.64, 59.65, 59.65, 59.66, 59.67, 59.68, 59.69, 59.69, 59.69, 59.69, 59.69, 59.69, 59.7, 59.71, 59.72, 59.73, 59.75, 59.75, 59.76, 59.77, 59.78, 59.79, 59.8, 59.82, 59.83, 59.83, 59.83, 59.84, 59.84, 59.85, 59.85, 59.86, 59.87, 59.87, 59.87, 59.88, 59.89, 59.89, 59.9, 59.9, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.89, 59.9, 59.9, 59.9, 59.91, 59.93, 59.93, 59.94, 59.94, 59.95, 59.96, 59.96, 59.97, 59.98, 59.98, 59.99, 60, 60.01, 60.02, 60.02, 60.03, 60.04, 60.05, 60.06, 60.07, 60.09, 60.13, 60.14, 60.15, 60.16, 60.19, 60.22, 60.23, 60.24, 60.25, 60.26, 60.28, 60.3, 60.31, 60.32, 60.33, 60.33, 60.34, 60.35, 60.36, 60.36, 60.37, 60.38, 60.39, 60.39, 60.4, 60.41, 60.43, 60.44, 60.48, 60.51, 60.52, 60.53, 60.54, 60.55, 60.57, 60.59, 60.6, 60.61, 60.61, 60.62, 60.63, 60.64, 60.65, 60.66, 60.67, 60.68, 60.7, 60.71, 60.73, 60.75, 60.79, 60.83, 60.84, 60.85, 60.86, 60.87, 60.88, 60.89, 60.9, 60.91, 60.92, 60.92, 60.94, 60.97, 60.98, 60.99, 61, 61.01, 61.03, 61.04, 61.04, 61.04, 61.04, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.05, 61.06, 61.06, 61.06, 61.07, 61.08, 61.09, 61.09, 61.1, 61.12, 61.14, 61.19, 61.22, 61.24, 61.26, 61.27, 61.29, 61.31, 61.32, 61.36, 61.37, 61.39, 61.4, 61.42, 61.43, 61.48, 61.53, 61.55, 61.57, 61.57, 61.57, 61.57, 61.57, 61.56, 61.56, 61.56, 61.58, 61.59, 61.6, 61.62, 61.62, 61.63, 61.69, 61.7, 61.72, 61.75, 61.75, 61.77, 61.8, 61.82, 61.83, 61.85, 61.87, 61.88, 61.89, 61.91, 62, 62.12, 62.15, 62.17, 62.18, 62.2, 62.22, 62.25, 62.26, 62.27, 62.27, 62.38, 62.39, 62.4, 62.41, 62.46, 62.52, 62.58, 62.59, 62.61, 62.62, 62.63, 62.66, 62.68, 62.69, 62.71, 62.71, 62.74, 62.76, 62.83, 62.84, 62.88, 62.9, 62.94, 62.96, 62.97, 62.98, 62.99, 63, 63, 63.01, 63.02, 63.04, 63.05, 63.12, 63.17, 63.26, 63.27, 63.28, 63.33, 63.33, 63.34, 63.34, 63.35, 63.35, 63.39, 63.48, 63.55, 63.56, 63.59, 63.63, 63.65, 63.72, 63.72, 63.73, 63.75, 63.76, 63.78, 63.79, 63.82, 63.83, 63.85, 63.85, 63.89, 63.93, 63.93, 63.96, 63.97, 63.99, 64, 64, 64.01, 64.03, 64.03, 64.04, 64.04, 64.05, 64.07, 64.08, 64.09, 64.09, 64.09, 64.09, 64.1, 64.07, 64.05, 64.05, 64.03, 64.03, 64.02, 64.01, 64.01, 64.03, 64.05, 64.06, 64.09, 64.11, 64.13, 64.15, 64.16, 64.19, 64.2, 64.2, 64.23, 64.3, 64.36, 64.37, 64.38, 64.38, 64.4, 64.44, 64.46, 64.48, 64.48, 64.5, 64.5, 64.55, 64.55, 64.57, 64.58, 64.61, 64.63, 64.71, 64.79, 64.81, 64.82, 64.84, 64.85, 64.86, 64.88, 64.91, 64.94, 64.96, 64.97, 64.98, 64.98, 65, 65.05, 65.07, 65.1, 65.12, 65.13, 65.14, 65.17, 65.19, 65.23, 65.25, 65.28, 65.3, 65.34, 65.36, 65.4, 65.43, 65.44, 65.45, 65.48, 65.49, 65.5, 65.51, 65.53, 65.58, 65.59, 65.63, 65.64, 65.66, 65.67, 65.69, 65.72, 65.73, 65.75, 65.79, 65.8, 65.81, 65.86, 65.87, 65.89, 65.9, 65.92, 65.95, 66.02, 66.07, 66.1, 66.13, 66.13, 66.14, 66.14, 66.14, 66.14, 66.14, 66.16, 66.18, 66.24, 66.24, 66.28, 66.32, 66.34, 66.35, 66.38, 66.4, 66.4, 66.43, 66.43, 66.45, 66.46, 66.47, 66.48, 66.5, 66.53, 66.53, 66.57, 66.58, 66.59, 66.61, 66.62, 66.62, 66.65, 66.66, 66.67, 66.68, 66.7, 66.78, 66.78, 66.85, 66.87, 66.88, 66.91, 66.93, 66.96, 66.96, 66.97, 66.98, 66.98, 66.99, 67.01, 67.02, 67.04, 67.04, 67.06, 67.14, 67.15, 67.16, 67.2, 67.2, 67.22, 67.24, 67.25, 67.27, 67.27, 67.28, 67.29, 67.35, 67.37, 67.41, 67.43, 67.45, 67.48, 67.49, 67.51, 67.52, 67.53, 67.53, 67.53, 67.56, 67.57, 67.57, 67.59, 67.6, 67.64, 67.66, 67.67, 67.69, 67.71, 67.73, 67.74, 67.74, 67.76, 67.77, 67.78, 67.79, 67.8, 67.81, 67.83, 67.84, 67.86, 67.87, 67.92, 67.93, 67.94, 67.94, 67.96, 67.96, 67.99, 68, 68.05, 68.05, 68.06, 68.07, 68.08, 68.08, 68.1, 68.11, 68.12, 68.12, 68.12, 68.11, 68.09, 68.08, 68.07, 68.05, 68.05, 68.01, 68.01, 68, 67.97, 67.97, 68.05, 68.06, 68.13, 68.15, 68.18, 68.19, 68.2, 68.22, 68.31, 68.32, 68.34, 68.36, 68.37, 68.41, 68.43, 68.52, 68.54, 68.55, 68.57, 68.58, 68.58, 68.54, 68.53, 68.51, 68.51, 68.52, 68.52, 68.52, 68.51, 68.5, 68.5, 68.5, 68.49, 68.47, 68.44, 68.42, 68.41, 68.38, 68.38, 68.37, 68.36, 68.35, 68.35, 68.39, 68.39, 68.4, 68.41, 68.42, 68.42, 68.44, 68.46, 68.49, 68.5, 68.52, 68.53, 68.55, 68.56, 68.57, 68.59, 68.59, 68.6, 68.61, 68.63, 68.67, 68.68, 68.7, 68.73, 68.74, 68.75, 68.76, 68.77, 68.77, 68.81, 68.85, 68.86, 68.88, 68.89, 68.91, 68.92, 68.92, 68.93, 68.93, 68.97, 69, 69, 69.03, 69.05, 69.06, 69.06, 69.06, 69.06, 69.06, 69.06, 69.05, 69.06, 69.06, 69.06, 69.06, 69.07, 69.11, 69.12, 69.1, 69.1],
            t_norgeLon: [20.78, 20.84, 21.06, 21.07, 21.13, 21.13, 21.07, 21.03, 21.03, 21.03, 21.03, 21.05, 21.11, 21.16, 21.18, 21.22, 21.29, 21.38, 21.65, 21.69, 21.7, 21.83, 21.87, 21.88, 21.89, 21.9, 21.95, 22.08, 22.09, 22.16, 22.17, 22.18, 22.19, 22.2, 22.3, 22.34, 22.34, 22.35, 22.35, 22.36, 22.37, 22.37, 22.38, 22.41, 22.44, 22.49, 22.52, 22.53, 22.57, 22.7, 22.73, 22.8, 23.02, 23.04, 23.06, 23.07, 23.16, 23.17, 23.2, 23.21, 23.22, 23.24, 23.31, 23.32, 23.34, 23.37, 23.39, 23.44, 23.51, 23.55, 23.59, 23.64, 23.64, 23.67, 23.72, 23.75, 23.77, 23.88, 23.93, 23.96, 24, 24.03, 24.05, 24.15, 24.14, 24.15, 24.19, 24.22, 24.24, 24.27, 24.31, 24.47, 24.62, 24.62, 24.67, 24.71, 24.72, 24.73, 24.78, 24.8, 24.79, 24.8, 24.81, 24.83, 24.85, 24.86, 24.87, 24.9, 24.91, 24.91, 24.91, 24.91, 24.91, 24.92, 24.92, 24.92, 24.93, 24.94, 24.95, 24.98, 24.99, 25, 25.01, 25.04, 25.05, 25.06, 25.07, 25.08, 25.08, 25.09, 25.12, 25.13, 25.13, 25.12, 25.13, 25.12, 25.11, 25.11, 25.12, 25.11, 25.12, 25.12, 25.14, 25.14, 25.13, 25.13, 25.13, 25.16, 25.17, 25.18, 25.21, 25.23, 25.24, 25.25, 25.26, 25.27, 25.29, 25.3, 25.31, 25.32, 25.36, 25.38, 25.39, 25.4, 25.41, 25.41, 25.42, 25.43, 25.45, 25.46, 25.47, 25.48, 25.49, 25.51, 25.52, 25.52, 25.53, 25.54, 25.55, 25.57, 25.58, 25.59, 25.61, 25.61, 25.63, 25.64, 25.65, 25.66, 25.68, 25.69, 25.69, 25.7, 25.71, 25.74, 25.76, 25.77, 25.78, 25.79, 25.74, 25.75, 25.76, 25.76, 25.74, 25.73, 25.72, 25.71, 25.72, 25.73, 25.72, 25.72, 25.73, 25.75, 25.74, 25.75, 25.76, 25.75, 25.76, 25.75, 25.76, 25.75, 25.76, 25.78, 25.79, 25.79, 25.81, 25.82, 25.82, 25.84, 25.85, 25.84, 25.83, 25.83, 25.81, 25.82, 25.81, 25.82, 25.83, 25.84, 25.85, 25.87, 25.86, 25.87, 25.89, 25.88, 25.86, 25.88, 25.92, 25.96, 25.97, 25.99, 25.98, 25.97, 25.95, 25.93, 25.92, 25.91, 25.92, 25.94, 25.95, 25.97, 25.99, 26, 26.05, 26.1, 26.13, 26.14, 26.16, 26.17, 26.2, 26.26, 26.26, 26.28, 26.31, 26.37, 26.4, 26.43, 26.43, 26.42, 26.45, 26.47, 26.47, 26.68, 26.69, 26.7, 26.71, 26.72, 26.72, 26.73, 26.74, 26.79, 26.85, 26.86, 26.85, 26.86, 26.86, 26.87, 26.88, 26.91, 26.93, 26.94, 26.96, 26.98, 27, 27.01, 27.02, 27.04, 27.06, 27.1, 27.15, 27.16, 27.17, 27.24, 27.28, 27.29, 27.3, 27.3, 27.29, 27.29, 27.28, 27.29, 27.3, 27.34, 27.36, 27.38, 27.4, 27.45, 27.46, 27.47, 27.53, 27.53, 27.54, 27.54, 27.56, 27.56, 27.57, 27.61, 27.67, 27.71, 27.74, 27.75, 27.76, 27.77, 27.89, 27.91, 27.95, 27.96, 27.98, 27.98, 27.99, 28.01, 28.16, 28.27, 28.3, 28.34, 28.34, 28.35, 28.35, 28.36, 28.42, 28.43, 28.62, 28.63, 29.13, 29.14, 29.14, 29.14, 29.25, 29.27, 29.29, 29.3, 29.32, 29.33, 29.34, 29.32, 29.31, 29.22, 29.2, 29.01, 28.94, 28.83, 28.83, 28.83, 28.83, 28.82, 28.82, 28.81, 28.81, 28.8, 28.82, 28.83, 28.86, 28.93, 28.95, 28.97, 29.01, 29.03, 29.04, 29.04, 29.05, 29.06, 29.08, 29.1, 29.16, 29.19, 29.24, 29.26, 29.28, 29.32, 29.32, 29.33, 29.33, 29.31, 29.31, 29.3, 29.31, 29.31, 29.31, 29.32, 29.35, 29.4, 29.43, 29.45, 29.49, 29.5, 29.55, 29.57, 29.58, 29.62, 29.67, 29.71, 29.72, 29.76, 29.77, 29.79, 29.81, 29.82, 29.84, 29.87, 29.89, 29.92, 29.93, 29.94, 29.95, 29.97, 29.98, 29.99, 30.02, 30.04, 30.05, 30.06, 30.07, 30.09, 30.12, 30.12, 30.13, 30.14, 30.15, 30.14, 30.15, 30.16, 30.18, 30.2, 30.2, 30.19, 30.19, 30.18, 30.16, 30.16, 30.16, 30.16, 30.15, 30.14, 30.11, 30.11, 30.12, 30.13, 30.15, 30.23, 30.3, 30.31, 30.32, 30.37, 30.36, 30.42, 30.51, 30.52, 30.54, 30.62, 30.67, 30.68, 30.72, 30.73, 30.72, 30.75, 30.82, 30.93, 30.94, 30.94, 30.95, 30.95, 30.95, 30.95, 30.94, 30.93, 30.93, 30.94, 30.94, 30.95, 30.95, 30.94, 30.93, 30.91, 30.9, 30.89, 30.88, 30.89, 30.9, 30.84, 30.83, 30.81, 30.8, 30.79, 30.77, 30.76, 30.72, 30.71, 30.69, 30.79, 30.83, 30.82, 31.11, 31.2, 31.51, 31.52, 31.52, 31.59, 31.64, 31.75, 31.76, 31.76, 31.75, 31.71, 31.66, 31.57, 31.22, 31.14, 30.61, 30.45, 30.05, 30.03, 29.57, 29.16, 28.47, 28.34, 27.98, 27.77, 27.06, 26.68, 25.96, 25.6, 24.92, 24.63, 24.34, 23.99, 23.77, 23.67, 23.25, 22.85, 22.3, 22.24, 21.91, 21.7, 21.17, 20.48, 19.88, 19.38, 18.82, 18.29, 18.18, 17.8, 17.61, 17.44, 17.16, 17.05, 16.9, 16.81, 16.57, 16.25, 15.79, 15.75, 15.29, 15.15, 15.02, 14.79, 14.78, 14.62, 14.37, 14.34, 14.19, 13.95, 13.84, 13.74, 13.7, 13.49, 13.39, 13.26, 13.23, 13.01, 13, 12.8, 12.67, 12.59, 12.47, 12.42, 12.39, 12.28, 12.16, 12.13, 11.99, 11.71, 11.7, 11.48, 11.41, 11.36, 11.31, 11.3, 11.31, 11.35, 11.66, 11.86, 11.63, 11.57, 11.3, 11.08, 10.95, 10.8, 10.67, 10.64, 10.61, 10.58, 10.45, 10.36, 10.15, 10.08, 10, 9.8, 9.7, 9.32, 8.94, 8.62, 8.36, 8.11, 7.65, 7.53, 7.36, 7.11, 6.97, 6.92, 6.86, 6.84, 6.8, 6.62, 6.6, 6.5, 6.34, 6.13, 6.06, 5.98, 5.89, 5.64, 5.51, 5.34, 5.25, 4.94, 4.89, 4.81, 4.68, 4.58, 4.55, 4.44, 4.28, 4.22, 4.17, 4.15, 4.13, 4.13, 4.13, 4.11, 4.1, 4.09, 4.09, 4.09, 4.18, 4.19, 4.24, 4.26, 4.33, 4.36, 4.4, 4.42, 4.43, 4.47, 4.51, 4.52, 4.55, 4.55, 4.56, 4.6, 4.62, 4.64, 4.65, 4.66, 4.67, 4.67, 4.61, 4.6, 4.57, 4.53, 4.48, 4.46, 4.45, 4.47, 4.5, 4.55, 4.6, 4.72, 4.8, 4.89, 4.96, 5.01, 5.05, 5.07, 5.08, 5.14, 5.16, 5.18, 5.22, 5.25, 5.28, 5.34, 5.4, 5.47, 5.52, 5.61, 5.87, 6.04, 6.07, 6.08, 6.15, 6.16, 6.27, 6.39, 6.48, 6.49, 6.77, 6.93, 7.1, 7.16, 7.26, 7.47, 7.59, 7.69, 7.77, 7.84, 7.88, 8.01, 8.09, 8.3, 8.37, 8.46, 8.54, 8.63, 8.68, 8.75, 8.85, 8.9, 8.94, 9.07, 9.3, 9.36, 9.37, 9.53, 9.67, 9.79, 9.97, 9.99, 10.01, 10.06, 10.15, 10.29, 10.36, 10.58, 10.59, 10.64, 10.92, 10.98, 11.07, 11.09, 11.12, 11.15, 11.21, 11.24, 11.26, 11.28, 11.3, 11.31, 11.32, 11.33, 11.34, 11.35, 11.36, 11.37, 11.38, 11.39, 11.39, 11.39, 11.4, 11.41, 11.42, 11.42, 11.43, 11.44, 11.46, 11.45, 11.46, 11.46, 11.46, 11.46, 11.46, 11.45, 11.45, 11.46, 11.47, 11.48, 11.49, 11.5, 11.51, 11.52, 11.53, 11.54, 11.55, 11.56, 11.55, 11.56, 11.57, 11.57, 11.58, 11.58, 11.59, 11.61, 11.62, 11.62, 11.63, 11.64, 11.65, 11.66, 11.66, 11.66, 11.67, 11.67, 11.68, 11.69, 11.69, 11.7, 11.7, 11.71, 11.71, 11.72, 11.72, 11.73, 11.74, 11.75, 11.76, 11.76, 11.78, 11.79, 11.79, 11.78, 11.77, 11.78, 11.79, 11.79, 11.79, 11.79, 11.79, 11.79, 11.8, 11.8, 11.8, 11.8, 11.81, 11.82, 11.83, 11.84, 11.84, 11.84, 11.83, 11.83, 11.84, 11.83, 11.83, 11.83, 11.82, 11.82, 11.8, 11.79, 11.79, 11.78, 11.77, 11.77, 11.77, 11.77, 11.77, 11.76, 11.75, 11.74, 11.72, 11.72, 11.71, 11.71, 11.7, 11.7, 11.71, 11.71, 11.72, 11.72, 11.73, 11.74, 11.75, 11.76, 11.77, 11.79, 11.82, 11.83, 11.84, 11.86, 11.87, 11.88, 11.88, 11.89, 11.9, 11.91, 11.92, 11.93, 11.94, 11.95, 11.95, 11.94, 11.94, 11.94, 11.94, 11.95, 11.95, 11.94, 11.95, 11.94, 11.94, 11.9, 11.9, 11.88, 11.87, 11.86, 11.85, 11.86, 11.87, 11.89, 11.89, 11.91, 11.92, 11.92, 11.93, 11.94, 11.98, 11.99, 12.02, 12.03, 12.04, 12.05, 12.07, 12.08, 12.11, 12.13, 12.15, 12.16, 12.17, 12.18, 12.19, 12.2, 12.21, 12.22, 12.24, 12.25, 12.26, 12.28, 12.31, 12.32, 12.34, 12.35, 12.36, 12.37, 12.38, 12.38, 12.39, 12.41, 12.43, 12.44, 12.45, 12.46, 12.47, 12.48, 12.5, 12.52, 12.52, 12.53, 12.53, 12.54, 12.53, 12.52, 12.52, 12.52, 12.52, 12.51, 12.5, 12.5, 12.5, 12.5, 12.52, 12.54, 12.55, 12.56, 12.57, 12.58, 12.58, 12.59, 12.6, 12.6, 12.61, 12.62, 12.62, 12.62, 12.62, 12.61, 12.61, 12.6, 12.59, 12.57, 12.55, 12.53, 12.53, 12.52, 12.52, 12.52, 12.52, 12.52, 12.51, 12.5, 12.48, 12.46, 12.43, 12.41, 12.4, 12.37, 12.35, 12.35, 12.34, 12.34, 12.34, 12.34, 12.33, 12.33, 12.33, 12.32, 12.31, 12.29, 12.28, 12.26, 12.26, 12.25, 12.23, 12.32, 12.37, 12.38, 12.4, 12.41, 12.44, 12.45, 12.47, 12.49, 12.54, 12.6, 12.61, 12.64, 12.65, 12.66, 12.67, 12.67, 12.68, 12.69, 12.69, 12.7, 12.7, 12.71, 12.71, 12.71, 12.71, 12.79, 12.81, 12.83, 12.84, 12.84, 12.85, 12.85, 12.86, 12.88, 12.86, 12.84, 12.82, 12.79, 12.78, 12.71, 12.64, 12.6, 12.58, 12.55, 12.52, 12.49, 12.47, 12.47, 12.46, 12.43, 12.39, 12.39, 12.36, 12.34, 12.33, 12.3, 12.2, 12.18, 12.14, 12.14, 12.15, 12.15, 12.16, 12.17, 12.17, 12.18, 12.18, 12.19, 12.19, 12.19, 12.22, 12.27, 12.28, 12.28, 12.29, 12.29, 12.3, 12.31, 12.32, 12.32, 12.31, 12.23, 12.22, 12.22, 12.21, 12.17, 12.13, 12.08, 12.07, 12.06, 12.06, 12.07, 12.09, 12.1, 12.1, 12.11, 12.12, 12.13, 12.14, 12.11, 12.11, 12.09, 12.08, 12.13, 12.18, 12.18, 12.2, 12.21, 12.22, 12.23, 12.22, 12.22, 12.2, 12.19, 12.13, 12.08, 12, 11.98, 12, 12.05, 12.06, 12.06, 12.07, 12.08, 12.07, 12.12, 12.22, 12.18, 12.18, 12.15, 12.24, 12.27, 12.34, 12.35, 12.35, 12.38, 12.4, 12.42, 12.44, 12.48, 12.5, 12.52, 12.51, 12.57, 12.62, 12.63, 12.66, 12.69, 12.74, 12.75, 12.76, 12.77, 12.84, 12.86, 12.88, 12.89, 12.92, 13.04, 13.09, 13.15, 13.16, 13.17, 13.2, 13.2, 13.5, 13.65, 13.66, 13.81, 13.83, 13.92, 13.92, 13.97, 13.99, 14.01, 14.03, 14.06, 14.07, 14.1, 14.11, 14.13, 14.16, 14.16, 14.14, 14.13, 14.13, 14.12, 14.12, 14.12, 14.13, 14.13, 14.12, 14.12, 14.09, 14.06, 13.95, 13.92, 13.78, 13.76, 13.7, 13.66, 13.69, 13.7, 13.8, 13.9, 13.92, 13.93, 13.96, 13.98, 13.99, 14.01, 14.06, 14.09, 14.11, 14.13, 14.14, 14.15, 14.17, 14.26, 14.28, 14.32, 14.35, 14.35, 14.36, 14.37, 14.37, 14.39, 14.4, 14.46, 14.52, 14.52, 14.51, 14.51, 14.51, 14.51, 14.51, 14.51, 14.51, 14.51, 14.51, 14.52, 14.52, 14.53, 14.53, 14.53, 14.54, 14.54, 14.54, 14.57, 14.58, 14.59, 14.62, 14.62, 14.63, 14.61, 14.6, 14.6, 14.59, 14.59, 14.58, 14.56, 14.54, 14.53, 14.52, 14.65, 14.83, 14.85, 14.95, 15, 15.03, 15.08, 15.14, 15.36, 15.37, 15.5, 15.49, 15.48, 15.47, 15.45, 15.44, 15.43, 15.42, 15.41, 15.4, 15.4, 15.39, 15.38, 15.42, 15.49, 15.5, 15.59, 15.61, 15.63, 15.65, 15.66, 15.67, 15.71, 15.72, 15.73, 15.75, 15.78, 15.88, 15.89, 15.98, 16.01, 16.02, 16.06, 16.11, 16.16, 16.17, 16.2, 16.23, 16.24, 16.26, 16.3, 16.32, 16.41, 16.4, 16.4, 16.41, 16.41, 16.41, 16.42, 16.41, 16.4, 16.36, 16.35, 16.33, 16.32, 16.31, 16.3, 16.22, 16.19, 16.14, 16.11, 16.12, 16.15, 16.15, 16.17, 16.17, 16.38, 16.4, 16.43, 16.46, 16.47, 16.49, 16.5, 16.52, 16.56, 16.58, 16.59, 16.61, 16.61, 16.62, 16.63, 16.64, 16.65, 16.65, 16.66, 16.66, 16.67, 16.68, 16.69, 16.7, 16.71, 16.72, 16.75, 16.77, 16.81, 16.85, 16.92, 16.93, 16.99, 17.03, 17.15, 17.16, 17.17, 17.19, 17.21, 17.22, 17.25, 17.27, 17.28, 17.29, 17.3, 17.33, 17.41, 17.48, 17.52, 17.63, 17.64, 17.76, 17.78, 17.82, 17.9, 17.91, 17.99, 18.01, 18.08, 18.09, 18.13, 18.15, 18.16, 18.16, 18.14, 18.13, 18.13, 18.13, 18.12, 18.11, 18.11, 18.13, 18.13, 18.21, 18.33, 18.38, 18.42, 18.52, 18.56, 18.62, 18.68, 18.95, 18.98, 18.99, 19.04, 19.08, 19.09, 19.1, 19.14, 19.29, 19.44, 19.54, 19.59, 19.76, 19.78, 19.82, 19.92, 19.96, 19.97, 20, 20.02, 20.05, 20.08, 20.09, 20.12, 20.17, 20.22, 20.27, 20.21, 20.1, 20.08, 20.01, 19.98, 20.01, 20.06, 20.07, 20.09, 20.11, 20.14, 20.21, 20.22, 20.23, 20.26, 20.27, 20.28, 20.29, 20.3, 20.31, 20.35, 20.35, 20.35, 20.34, 20.35, 20.35, 20.35, 20.34, 20.34, 20.33, 20.25, 20.2, 20.18, 20.13, 20.09, 20.07, 20.08, 20.11, 20.29, 20.31, 20.4, 20.41, 20.44, 20.47, 20.55, 20.56, 20.59, 20.69, 20.72, 20.77, 20.78]
        },
        initialize: function(e) {
            L.Util.setOptions(this, e), this._attributions = {}
        },
        onAdd: function(e) {
            return this._container = L.DomUtil.create("div", "leaflet-control-attribution"), L.DomEvent.disableClickPropagation(this._container), e.on("moveend", this._onMapMoved, this), this._onMapMoved(), this._container
        },
        onRemove: function(e) {
            e.off("moveend", this._onMapMoved)
        },
        setPrefix: function(e) {
            return this.options.prefix = e, this._update(), this
        },
        addAttribution: function(e) {
            if (!e) return;
            return this._attributions[e] || (this._attributions[e] = 0), this._attributions[e]++, this._update(), this
        },
        removeAttribution: function(e) {
            if (!e) return;
            return this._attributions[e]--, this._update(), this
        },
        _update: function(e) {
            if (!this._map) return;
            this._container.innerHTML = e
        },
        _onMapMoved: function(e) {
            var t = this._getCopyrightText();
            this._update(t)
        },
        _getCopyrightText: function() {
            var e = this._map.getCenter(),
                t = this._map.getZoom(),
                n = ["&copy; 2015 Norkart AS/Plan- og bygningsetaten, Oslo Kommune", "&copy; 2015 Norkart AS/Geovekst og kommunene/OpenStreetMap/NASA, Meti", "&copy; 2015 Norkart AS/Geovekst og kommunene/OpenStreetMap/NASA, Meti", "&copy; 2015 Norkart AS/OpenStreetMap/EEA CLC2006"];
            if (t >= 13) {
                if (t <= 14) try {
                    if (this.t_containsPoint(e, L.Control.WAAttribution.t_norgeLat, L.Control.WAAttribution.t_norgeLon)) return n[1]
                } catch (r) {} else {
                    try {
                        if (this.t_containsPoint(e, L.Control.WAAttribution.t_osloLat, L.Control.WAAttribution.t_osloLon)) return n[0]
                    } catch (r) {}
                    try {
                        if (this.t_containsPoint(e, L.Control.WAAttribution.t_norgeLat, L.Control.WAAttribution.t_norgeLon)) return n[1]
                    } catch (r) {}
                }
                return n[3]
            }
            try {
                return this.t_containsPoint(e, L.Control.WAAttribution.t_norgeLat, L.Control.WAAttribution.t_norgeLon) ? n[2] : n[3]
            } catch (r) {}
        },
        t_containsPoint: function(e, t, n) {
            var r, i = 0,
                s = t.length,
                o = !1;
            for (r = 0; r < s; r++) i++, i == s && (i = 0), (n[r] < e.lng && n[i] >= e.lng || n[i] < e.lng && n[r] >= e.lng) && t[r] + (e.lng - n[r]) / (n[i] - n[r]) * (t[i] - t[r]) < e.lat && (o = !o);
            return o
        }
    }), L.Map.mergeOptions({
        attributionControl: !0
    }), L.Map.addInitHook(function() {
        this.options.attributionControl && (this.attributionControl = (new L.Control.Attribution).addTo(this))
    }), L.control.waattribution = function(e) {
        return new L.Control.WAAttribution(e)
    }, L.TileLayer.WMSQueryable = L.TileLayer.WMS.extend({
        onAdd: function(e) {
            L.TileLayer.WMS.prototype.onAdd.call(this, e);
            var t = n.getInstance(e, this._url);
            t.registerLayer(this)
        },
        onRemove: function(e) {
            L.TileLayer.WMS.prototype.onRemove.call(this, e);
            var t = n.getInstance(e, this._url);
            t.unregisterLayer(this)
        }
    }), L.tileLayer.wmsqueryable = function(e, t) {
        return new L.TileLayer.WMSQueryable(e, t)
    };
    var n = function() {
        function e(e, t) {
            function o(t) {
                var n = "&X=" + t.containerPoint.x + "&Y=" + t.containerPoint.y,
                    s = "&BBOX=" + e.getBounds().toBBoxString(),
                    o = "";
                for (var u = 0; u < i.length; u++) i[u] && (o += i[u].wmsParams.layers);
                var a = r + "?REQUEST=GetFeatureInfo&SERVICE=WMS&SRS=EPSG:4326&VERSION=1.3&FORMAT=image/png&LAYERS=" + o + "&TRANSPARENT=true&WIDTH=" + e.getSize().x + "&HEIGHT=" + e.getSize().y + "&QUERY_LAYERS=" + o + "&INFO_FORMAT=text/html" + s + n,
                    f = new XMLHttpRequest;
                f.open("GET", a, !0), f.onreadystatechange = function() {
                    if (f.readyState != 4) return;
                    var n = f.responseText,
                        r = L.DomUtil.create("div", "gfi-container");
                    r.innerHTML = n;
                    var i = (new L.Popup).setLatLng(t.latlng).setContent(r).openOn(e)
                }, f.send(null)
            }
            var n = e,
                r = t,
                i = [],
                s = 0;
            return {
                registerLayer: function(e) {
                    s === 0 && n.on("click", o);
                    var t = L.Util.stamp(e);
                    if (i[t]) return;
                    i[t] = e, s++
                },
                unregisterLayer: function(e) {
                    var t = L.Util.stamp(e);
                    if (!i[t]) return;
                    delete i[t], s--, s == 0 && n.off("click", o)
                }
            }
        }
        var t;
        return {
            getInstance: function(n, r) {
                return t == null && (t = new e(n, r), t.constructor = null), t
            }
        }
    }();
    FerdRouting = L.Control.extend({
        options: {
            position: "bottomleft",
            longPressSupport: !0,
            toIcon: new L.Icon.Default,
            fromIcon: new L.Icon.Default,
            viaIcon: new L.Icon.Default,
            routePointIcon: new L.Icon.Default,
            serverUrl: "//www.webatlas.no/Ferd-2013-04-18/RoutePlannerService.svc/json/",
            graphName: "ta-norden-dynamic",
            costFunction: "time"
        },
        initialize: function(t) {
            L.Util.setOptions(this, t), e.location.protocol == "https:" ? this.options.serverUrl = "https:" + this.options.serverUrl : this.options.serverUrl = "http:" + this.options.serverUrl, this.markerFrom = null, this.markerTo = null, this.markersVia = [], this.markerAdhoc = null, this.markerAdhocHovering = !1, this.viaDragging = !1, this.markersVia = [], this.routeGeometryInner = null, this.routeGeometryOuter = null, this.routeTimer = null, this.fetchingRoute = !1
        },
        onAdd: function(e) {
            return this._map = e, this._map.on("contextmenu", this.onContextMenuClicked, this), this._map.on("moveend", this.setRouteTimeout, this), L.Browser.touch && this.options.longPressSupport && (this._map.on("mousedown", this.onMouseDown, this), this._map.on("mouseup movestart", this.onMouseUpOrMoveStart, this)), this._container = L.DomUtil.create("div", "leaflet-control-routelist"), L.DomEvent.disableClickPropagation(this._container), this._container
        },
        onContextMenuClicked: function(e) {
            this.createContextMenu(e.containerPoint, e.latlng)
        },
        onMouseDown: function(e) {
            clearTimeout(this.t_logTimer), this.t_logTimer = setTimeout(L.Util.bind(this.onLongPress, this), 750, e)
        },
        onMouseUpOrMoveStart: function(e) {
            clearTimeout(this.t_logTimer)
        },
        onLongPress: function(e) {
            this.createContextMenu(e.containerPoint, e.latlng)
        },
        createContextMenu: function(e, t) {
            var n = L.DomUtil.create("div", "context-menu"),
                r = L.DomUtil.create("button", "context-menu-item", n);
            r.innerHTML = START_POINT, r.onclick = L.Util.bind(this.addFromPointClicked, this);
            var i = L.DomUtil.create("button", "context-menu-item", n);
            i.innerHTML = END_POINT, i.onclick = L.Util.bind(this.addToPointClicked, this);
            var s = L.DomUtil.create("button", "context-menu-item", n);
            s.innerHTML = VIA_POINT, s.onclick = L.Util.bind(this.addViaPointClicked, this, t), this._menupopup = L.popup().setLatLng(t).setContent(n).openOn(this._map), this._menuposition = t
        },
        addToPointClicked: function(e) {
            this.markerTo && this._map.removeLayer(this.markerTo), this.markerTo = new L.Marker(this._menuposition, {
                draggable: "true",
                icon: this.options.toIcon,
                title: "to"
            }), this.markerTo.on("drag", this.setRouteTimeout, this), this.markerTo.on("dragend", this.retrieveRoute, this), this._map.addLayer(this.markerTo), this.markerTo.nodeTitle = "To:", this.retrieveRoute(), this.markerTo.on("click", L.Util.bind(this.createMarkerMenu, this, this.markerTo)), this._map.closePopup()
        },
        addFromPointClicked: function(e) {
            this.markerFrom && this._map.removeLayer(this.markerFrom), this.markerFrom = new L.Marker(this._menuposition, {
                draggable: "true",
                icon: this.options.fromIcon,
                title: "from"
            }), this.markerFrom.on("drag", this.setRouteTimeout, this), this.markerFrom.on("dragend", this.retrieveRoute, this), this._map.addLayer(this.markerFrom), this.markerFrom.nodeTitle = "From:", this.retrieveRoute(), this.markerFrom.on("click", L.Util.bind(this.createMarkerMenu, this, this.markerFrom)), this._map.closePopup()
        },
        addViaPointClicked: function(e) {
            this.createViaPoint(e), this._map.closePopup()
        },
        createViaPoint: function(e) {
            var t = (new L.Marker(e, {
                draggable: !0,
                icon: this.options.viaIcon,
                title: this.markersVia.length ? this.markersVia.length : "0"
            })).addTo(this._map);
            t.on("drag", L.Util.bind(function() {
                this.setRouteTimeout()
            }, this)), this.markersVia.push(t), this.retrieveRoute(), t.on("click", L.Util.bind(this.createMarkerMenu, this, t))
        },
        createMarkerMenu: function(e) {
            console.log(e);
            var t = L.DomUtil.create("div", "context-menu"),
                n = L.DomUtil.create("button", "context-menu-item", t);
            n.innerHTML = "Remove point", n.onclick = L.Util.bind(this.removeMarker, this, e), this._menupopup = L.popup().setLatLng(e.getLatLng()).setContent(t).openOn(this._map)
        },
        removeMarker: function(e) {
            this._map.removeLayer(e), this.markerFrom == e ? (this.markerFrom = null, this._map.removeLayer(e)) : this.markerTo == e ? (this.markerTo = null, this._map.removeLayer(e)) : this.removeVia(e.options.title), this._map.closePopup(), this.retrieveRoute()
        },
        retrieveRoute: function() {
            if (this.markerFrom == null || this.markerTo == null) {
                this.routeGeometryInner != null && (this._map.removeLayer(this.routeGeometryInner), this._map.removeLayer(this.routeGeometryOuter));
                return
            }
            var e = this.markerFrom.getLatLng(),
                t = this.markerTo.getLatLng(),
                n = "";
            n += "&p0=" + e.lng + "," + e.lat;
            if (this.markersVia.length > 0) {
                for (var r = 0; r < this.markersVia.length; r++) n += "&p" + (r + 1) + "=" + this.markersVia[r].getLatLng().lng + "," + this.markersVia[r].getLatLng().lat;
                this.markerAdhoc != null && this.viaDragging == 1 ? (n += "&p" + (this.markersVia.length + 1) + "=" + this.markerAdhoc.getLatLng().lng + "," + this.markerAdhoc.getLatLng().lat, n += "&p" + (this.markersVia.length + 2) + "=" + t.lng + "," + t.lat) : n += "&p" + (this.markersVia.length + 1) + "=" + t.lng + "," + t.lat
            } else this.markerAdhoc != null && this.viaDragging == 1 ? (n += "&p1=" + this.markerAdhoc.getLatLng().lng + "," + this.markerAdhoc.getLatLng().lat, n += "&p2=" + t.lng + "," + t.lat) : n += "&p1=" + t.lng + "," + t.lat;
            var i = "Terminal,Road,Poi,Junction,Roundabout,UTurn,Ferry",
                s = this._map.getBounds().getSouthWest().lng + "," + this._map.getBounds().getSouthWest().lat + "," + this._map.getBounds().getNorthEast().lng + "," + this._map.getBounds().getNorthEast().lat,
                o = this.options.serverUrl + "GetRoute?GraphName=" + this.options.graphName + "&srsName=EPSG:4326&costFunctionName=" + this.options.costFunction + "&routeFeatureList=" + i + "&routeCostList=time,distance-car&featureSnapRestrict0=ROAD&featureSnapRestrict1=ROAD&bbox=" + s + "&filterPolyLine=" + 10 + n,
                u = new XMLHttpRequest;
            u.open("GET", o, !0), u.onreadystatechange = L.Util.bind(function() {
                if (u.readyState != 4) return;
                this.fetchingRoute = !1;
                var e = JSON.parse(u.responseText);
                this.onRouteSuccess(e)
            }, this), u.send(null)
        },
        onRouteSuccess: function(e) {
            if (e.Points != null) {
                var t = [];
                for (var n = 0; n < e.Points.length; n++) {
                    var r = new L.LatLng(e.Points[n].Y, e.Points[n].X);
                    t.push(r)
                }
                this.routeGeometryInner != null && (this._map.removeLayer(this.routeGeometryInner), this._map.removeLayer(this.routeGeometryOuter)), this.routeGeometryInner = new L.polyline(t, {
                    color: "red",
                    weight: 7,
                    opacity: 1,
                    smoothFactor: 1
                }), this.routeGeometryOuter = (new L.polyline(t, {
                    color: "white",
                    weight: 13,
                    opacity: .5,
                    smoothFactor: 1
                })).on("mouseout", L.Util.bind(function(e) {
                    setTimeout(L.Util.bind(this.removeAdhocMarker, this), 250)
                }, this)).on("mouseover", L.Util.bind(function(e) {
                    this.markerAdhoc != null ? this.markerAdhoc.setLatLng(e.latlng) : this.markerAdhoc = (new L.Marker(e.latlng, {
                        draggable: !0,
                        icon: this.options.viaIcon
                    })).on("dragstart", L.Util.bind(function(e) {
                        this.viaDragging = !0
                    }, this)).on("drag", L.Util.bind(function() {
                        this.setRouteTimeout()
                    }, this)).on("mouseover", L.Util.bind(function() {
                        this.markerAdhocHovering = !0
                    }, this)).on("dragend", L.Util.bind(function(e) {
                        this._map.removeLayer(this.markerAdhoc), this.markerAdhoc = null, this.viaDragging = !1, this.createViaPoint(e.target.getLatLng())
                    }, this)).on("mouseout", L.Util.bind(function(e) {
                        this.markerAdhocHovering = !1, this.markerAdhoc != null && !this.viaDragging && (this._map.removeLayer(this.markerAdhoc), this.markerAdhoc = null)
                    }, this)).addTo(this._map)
                }, this)), this.drawRouteSegments || (this._map.addLayer(this.routeGeometryInner), this._map.addLayer(this.routeGeometryOuter), this.routeGeometryInner.bringToBack(), this.routeGeometryOuter.bringToBack()), this.formatRoute(e)
            }
        },
        removeAdhocMarker: function() {
            this.markerAdhoc != null && !this.viaDragging && !this.markerAdhocHovering && (this._map.removeLayer(this.markerAdhoc), this.markerAdhoc = null)
        },
        removeVia: function(e) {
            var t = null,
                n = null;
            for (var r = 0; r < this.markersVia.length; r++) this.markersVia[r].options.title == e && (t = r, n = this.markersVia[r]);
            n != null && (this.markersVia.splice(t, 1), this._map.removeLayer(n)), this.retrieveRoute()
        },
        setRouteTimeout: function() {
            this.fetchingRoute == 0 && (this.fetchingRoute = !0, this.routeTimer != null && clearTimeout(this.routeTimer), this.routeTimer = setTimeout(L.Util.bind(this.retrieveRoute, this), 500))
        },
        formatRoute: function(e, t) {
            var n = this._container.innerHTML;
            this._container.innerHTML = "";
            var r = L.DomUtil.create("ol", "routeList", this._container),
                i = [],
                s = {}, o = {}, u = {};
            for (var a = 0; a < e.Points.length; a++) {
                var s = {}, o = [],
                    u = [],
                    f = "",
                    l = [];
                s.index = e.Points[a].Index, s.latlng = new L.LatLng(e.Points[a].Y, e.Points[a].X);
                var u = e.Points[a].InfoList;
                if (u != null) {
                    for (var c = 0; c < u.length; c++) {
                        var h = u[c],
                            p = h.__type,
                            d = "RouteInfoType.INFO_ROAD",
                            v = "",
                            m = "",
                            g = "",
                            y = "",
                            b = 0,
                            w = "",
                            E = "",
                            S = "",
                            x = 0;
                        p == "RoadInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_ROAD", m = h.Route, v = h.Name, m != "" && l.push(m), v != "" && l.push(v)), p == "JunctionInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_JUNCTION", w = h.TurnAngle), p == "RoundaboutInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_ROUNDABOUT", E = h.ExitNumber), p == "TerminalInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_TERMINAL", S = h.TerminalIndex), p == "UTurnInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_UTURN"), p == "FerryInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_FERRY"), p == "PoiInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_CAMERA"), p == "TollInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_TOLL", g = h.Name), p == "FerryInfo:#WebGIS.RoutePlanner.Utils" && (d = "RouteInfoType.INFO_FERRY", x = h.EnterExit), s.type = p, s.name = v, s.routeId = m, s.turnAngle = w, s.exitNumber = E, s.terminalIndex = S, s.enterExit = x, s.tollName = g, s.names = l
                    }
                    f = this.buildDescription(s)
                }
                if (f != "") {
                    var T = L.DomUtil.create("li", "routeListElement", r);
                    T.onclick = L.Util.bind(this.moveToRoutePoint, this), T.setAttribute("lat", s.latlng.lat), T.setAttribute("lng", s.latlng.lng), T.innerHTML = f
                }
            }
            this.routePointMarker && this._container.innerHTML != n && this._map.removeLayer(this.routePointMarker)
        },
        buildDescription: function(e) {
            var t = "";
            e.exitNumber != "" ? (t += ROUTE_TAKE_TURNOFF_ROUNDABOUT.replace("%d", e.exitNumber), e.names.length != 0 && (t += ROUTE_ON_TO)) : e.type == "RouteInfoType.INFO_FERRY" ? enterExit == 0 ? t += ROUTE_FERRY_CONNECTION : (t += currentContext.getString(R.string.route_ferry_drive_off), e.names.length != 0 && (t += ROUTE_FERRY_DRIVE_OFF)) : e.type == "RouteInfoType.INFO_CAMERA" ? t += ROUTE_SPEED_TRAP : e.type == "RouteInfoType.INFO_TOLL" ? (t += ROUTE_TOLL_BOOTH, e.tollName.equals("") || (t += " - " + e.tollName)) : e.type == "RouteInfoType.INFO_UTURN" ? t += ROUTE_TURN_AROUND : e.turnAngle != "" ? e.turnAngle < -10 ? (t += ROUTE_TURN, e.turnAngle < -100 ? t += ROUTE_SHARP_TURN : e.turnAngle > -30 && (t += ROUTE_EASY_TURN), t += ROUTE_LEFT, e.names.length != 0 && (t += ROUTE_CONTINUE_IN_TO)) : e.turnAngle > 10 ? (t += ROUTE_TURN, e.turnAngle > 100 ? t += ROUTE_SHARP_TURN : e.turnAngle < 30 && (t += ROUTE_EASY_TURN), t += ROUTE_RIGHT, e.names.length != 0 && (t += ROUTE_CONTINUE_IN_TO)) : e.names.length != 0 ? t += ROUTE_CONTINUE_ON : t += ROUTE_CONTINUE : e.names.length != 0 ? t += ROUTE_CONTINUE_IN_TO : t += ROUTE_CONTINUE;
            if (e.names.length != 0) {
                var n = "";
                for (var r = 0; r < e.names.length; r++) r != e.names.length - 1 ? (n = e.names[r], e.names[r] != e.names[r + 1] ? t += e.names[r] + " / " : t += e.names[r]) : n != e.names[r] && (t += e.names[r])
            }
            return e.terminalIndex == "0" && (pointText = ROUTE_START), e.terminalIndex == "1" && (pointText = ROUTE_STOP), t
        },
        moveToRoutePoint: function(e) {
            var t = new L.LatLng(e.target.getAttribute("lat"), e.target.getAttribute("lng"));
            this._map.panTo(t), this.routePointMarker && this._map.removeLayer(this.routePointMarker), this.routePointMarker = L.marker(t, {
                icon: this.options.routePointIcon,
                title: e.target.innerHTML
            }).addTo(this._map)
        }
    })
})(this);
