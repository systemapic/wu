/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) lodash.com/license | Underscore.js 1.5.2 underscorejs.org/LICENSE
 * Build: `lodash modern -o ./dist/lodash.js`
 */
;(function(){function n(n,t,e){e=(e||0)-1;for(var r=n?n.length:0;++e<r;)if(n[e]===t)return e;return-1}function t(t,e){var r=typeof e;if(t=t.l,"boolean"==r||null==e)return t[e]?0:-1;"number"!=r&&"string"!=r&&(r="object");var u="number"==r?e:m+e;return t=(t=t[r])&&t[u],"object"==r?t&&-1<n(t,e)?0:-1:t?0:-1}function e(n){var t=this.l,e=typeof n;if("boolean"==e||null==n)t[n]=true;else{"number"!=e&&"string"!=e&&(e="object");var r="number"==e?n:m+n,t=t[e]||(t[e]={});"object"==e?(t[r]||(t[r]=[])).push(n):t[r]=true
}}function r(n){return n.charCodeAt(0)}function u(n,t){for(var e=n.m,r=t.m,u=-1,o=e.length;++u<o;){var i=e[u],a=r[u];if(i!==a){if(i>a||typeof i=="undefined")return 1;if(i<a||typeof a=="undefined")return-1}}return n.n-t.n}function o(n){var t=-1,r=n.length,u=n[0],o=n[r/2|0],i=n[r-1];if(u&&typeof u=="object"&&o&&typeof o=="object"&&i&&typeof i=="object")return false;for(u=f(),u["false"]=u["null"]=u["true"]=u.undefined=false,o=f(),o.k=n,o.l=u,o.push=e;++t<r;)o.push(n[t]);return o}function i(n){return"\\"+U[n]
}function a(){return h.pop()||[]}function f(){return g.pop()||{k:null,l:null,m:null,"false":false,n:0,"null":false,number:null,object:null,push:null,string:null,"true":false,undefined:false,o:null}}function l(n){n.length=0,h.length<_&&h.push(n)}function c(n){var t=n.l;t&&c(t),n.k=n.l=n.m=n.object=n.number=n.string=n.o=null,g.length<_&&g.push(n)}function p(n,t,e){t||(t=0),typeof e=="undefined"&&(e=n?n.length:0);var r=-1;e=e-t||0;for(var u=Array(0>e?0:e);++r<e;)u[r]=n[t+r];return u}function s(e){function h(n,t,e){if(!n||!V[typeof n])return n;
t=t&&typeof e=="undefined"?t:tt(t,e,3);for(var r=-1,u=V[typeof n]&&Fe(n),o=u?u.length:0;++r<o&&(e=u[r],false!==t(n[e],e,n)););return n}function g(n,t,e){var r;if(!n||!V[typeof n])return n;t=t&&typeof e=="undefined"?t:tt(t,e,3);for(r in n)if(false===t(n[r],r,n))break;return n}function _(n,t,e){var r,u=n,o=u;if(!u)return o;for(var i=arguments,a=0,f=typeof e=="number"?2:i.length;++a<f;)if((u=i[a])&&V[typeof u])for(var l=-1,c=V[typeof u]&&Fe(u),p=c?c.length:0;++l<p;)r=c[l],"undefined"==typeof o[r]&&(o[r]=u[r]);
return o}function U(n,t,e){var r,u=n,o=u;if(!u)return o;var i=arguments,a=0,f=typeof e=="number"?2:i.length;if(3<f&&"function"==typeof i[f-2])var l=tt(i[--f-1],i[f--],2);else 2<f&&"function"==typeof i[f-1]&&(l=i[--f]);for(;++a<f;)if((u=i[a])&&V[typeof u])for(var c=-1,p=V[typeof u]&&Fe(u),s=p?p.length:0;++c<s;)r=p[c],o[r]=l?l(o[r],u[r]):u[r];return o}function H(n){var t,e=[];if(!n||!V[typeof n])return e;for(t in n)me.call(n,t)&&e.push(t);return e}function J(n){return n&&typeof n=="object"&&!Te(n)&&me.call(n,"__wrapped__")?n:new Q(n)
}function Q(n,t){this.__chain__=!!t,this.__wrapped__=n}function X(n){function t(){if(r){var n=p(r);be.apply(n,arguments)}if(this instanceof t){var o=nt(e.prototype),n=e.apply(o,n||arguments);return wt(n)?n:o}return e.apply(u,n||arguments)}var e=n[0],r=n[2],u=n[4];return $e(t,n),t}function Z(n,t,e,r,u){if(e){var o=e(n);if(typeof o!="undefined")return o}if(!wt(n))return n;var i=ce.call(n);if(!K[i])return n;var f=Ae[i];switch(i){case T:case F:return new f(+n);case W:case P:return new f(n);case z:return o=f(n.source,C.exec(n)),o.lastIndex=n.lastIndex,o
}if(i=Te(n),t){var c=!r;r||(r=a()),u||(u=a());for(var s=r.length;s--;)if(r[s]==n)return u[s];o=i?f(n.length):{}}else o=i?p(n):U({},n);return i&&(me.call(n,"index")&&(o.index=n.index),me.call(n,"input")&&(o.input=n.input)),t?(r.push(n),u.push(o),(i?St:h)(n,function(n,i){o[i]=Z(n,t,e,r,u)}),c&&(l(r),l(u)),o):o}function nt(n){return wt(n)?ke(n):{}}function tt(n,t,e){if(typeof n!="function")return Ut;if(typeof t=="undefined"||!("prototype"in n))return n;var r=n.__bindData__;if(typeof r=="undefined"&&(De.funcNames&&(r=!n.name),r=r||!De.funcDecomp,!r)){var u=ge.call(n);
De.funcNames||(r=!O.test(u)),r||(r=E.test(u),$e(n,r))}if(false===r||true!==r&&1&r[1])return n;switch(e){case 1:return function(e){return n.call(t,e)};case 2:return function(e,r){return n.call(t,e,r)};case 3:return function(e,r,u){return n.call(t,e,r,u)};case 4:return function(e,r,u,o){return n.call(t,e,r,u,o)}}return Mt(n,t)}function et(n){function t(){var n=f?i:this;if(u){var h=p(u);be.apply(h,arguments)}return(o||c)&&(h||(h=p(arguments)),o&&be.apply(h,o),c&&h.length<a)?(r|=16,et([e,s?r:-4&r,h,null,i,a])):(h||(h=arguments),l&&(e=n[v]),this instanceof t?(n=nt(e.prototype),h=e.apply(n,h),wt(h)?h:n):e.apply(n,h))
}var e=n[0],r=n[1],u=n[2],o=n[3],i=n[4],a=n[5],f=1&r,l=2&r,c=4&r,s=8&r,v=e;return $e(t,n),t}function rt(e,r){var u=-1,i=st(),a=e?e.length:0,f=a>=b&&i===n,l=[];if(f){var p=o(r);p?(i=t,r=p):f=false}for(;++u<a;)p=e[u],0>i(r,p)&&l.push(p);return f&&c(r),l}function ut(n,t,e,r){r=(r||0)-1;for(var u=n?n.length:0,o=[];++r<u;){var i=n[r];if(i&&typeof i=="object"&&typeof i.length=="number"&&(Te(i)||yt(i))){t||(i=ut(i,t,e));var a=-1,f=i.length,l=o.length;for(o.length+=f;++a<f;)o[l++]=i[a]}else e||o.push(i)}return o
}function ot(n,t,e,r,u,o){if(e){var i=e(n,t);if(typeof i!="undefined")return!!i}if(n===t)return 0!==n||1/n==1/t;if(n===n&&!(n&&V[typeof n]||t&&V[typeof t]))return false;if(null==n||null==t)return n===t;var f=ce.call(n),c=ce.call(t);if(f==D&&(f=q),c==D&&(c=q),f!=c)return false;switch(f){case T:case F:return+n==+t;case W:return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case z:case P:return n==oe(t)}if(c=f==$,!c){var p=me.call(n,"__wrapped__"),s=me.call(t,"__wrapped__");if(p||s)return ot(p?n.__wrapped__:n,s?t.__wrapped__:t,e,r,u,o);
if(f!=q)return false;if(f=n.constructor,p=t.constructor,f!=p&&!(dt(f)&&f instanceof f&&dt(p)&&p instanceof p)&&"constructor"in n&&"constructor"in t)return false}for(f=!u,u||(u=a()),o||(o=a()),p=u.length;p--;)if(u[p]==n)return o[p]==t;var v=0,i=true;if(u.push(n),o.push(t),c){if(p=n.length,v=t.length,(i=v==p)||r)for(;v--;)if(c=p,s=t[v],r)for(;c--&&!(i=ot(n[c],s,e,r,u,o)););else if(!(i=ot(n[v],s,e,r,u,o)))break}else g(t,function(t,a,f){return me.call(f,a)?(v++,i=me.call(n,a)&&ot(n[a],t,e,r,u,o)):void 0}),i&&!r&&g(n,function(n,t,e){return me.call(e,t)?i=-1<--v:void 0
});return u.pop(),o.pop(),f&&(l(u),l(o)),i}function it(n,t,e,r,u){(Te(t)?St:h)(t,function(t,o){var i,a,f=t,l=n[o];if(t&&((a=Te(t))||Pe(t))){for(f=r.length;f--;)if(i=r[f]==t){l=u[f];break}if(!i){var c;e&&(f=e(l,t),c=typeof f!="undefined")&&(l=f),c||(l=a?Te(l)?l:[]:Pe(l)?l:{}),r.push(t),u.push(l),c||it(l,t,e,r,u)}}else e&&(f=e(l,t),typeof f=="undefined"&&(f=t)),typeof f!="undefined"&&(l=f);n[o]=l})}function at(n,t){return n+he(Re()*(t-n+1))}function ft(e,r,u){var i=-1,f=st(),p=e?e.length:0,s=[],v=!r&&p>=b&&f===n,h=u||v?a():s;
for(v&&(h=o(h),f=t);++i<p;){var g=e[i],y=u?u(g,i,e):g;(r?!i||h[h.length-1]!==y:0>f(h,y))&&((u||v)&&h.push(y),s.push(g))}return v?(l(h.k),c(h)):u&&l(h),s}function lt(n){return function(t,e,r){var u={};e=J.createCallback(e,r,3),r=-1;var o=t?t.length:0;if(typeof o=="number")for(;++r<o;){var i=t[r];n(u,i,e(i,r,t),t)}else h(t,function(t,r,o){n(u,t,e(t,r,o),o)});return u}}function ct(n,t,e,r,u,o){var i=1&t,a=4&t,f=16&t,l=32&t;if(!(2&t||dt(n)))throw new ie;f&&!e.length&&(t&=-17,f=e=false),l&&!r.length&&(t&=-33,l=r=false);
var c=n&&n.__bindData__;return c&&true!==c?(c=p(c),c[2]&&(c[2]=p(c[2])),c[3]&&(c[3]=p(c[3])),!i||1&c[1]||(c[4]=u),!i&&1&c[1]&&(t|=8),!a||4&c[1]||(c[5]=o),f&&be.apply(c[2]||(c[2]=[]),e),l&&we.apply(c[3]||(c[3]=[]),r),c[1]|=t,ct.apply(null,c)):(1==t||17===t?X:et)([n,t,e,r,u,o])}function pt(n){return Be[n]}function st(){var t=(t=J.indexOf)===Wt?n:t;return t}function vt(n){return typeof n=="function"&&pe.test(n)}function ht(n){var t,e;return n&&ce.call(n)==q&&(t=n.constructor,!dt(t)||t instanceof t)?(g(n,function(n,t){e=t
}),typeof e=="undefined"||me.call(n,e)):false}function gt(n){return We[n]}function yt(n){return n&&typeof n=="object"&&typeof n.length=="number"&&ce.call(n)==D||false}function mt(n,t,e){var r=Fe(n),u=r.length;for(t=tt(t,e,3);u--&&(e=r[u],false!==t(n[e],e,n)););return n}function bt(n){var t=[];return g(n,function(n,e){dt(n)&&t.push(e)}),t.sort()}function _t(n){for(var t=-1,e=Fe(n),r=e.length,u={};++t<r;){var o=e[t];u[n[o]]=o}return u}function dt(n){return typeof n=="function"}function wt(n){return!(!n||!V[typeof n])
}function jt(n){return typeof n=="number"||n&&typeof n=="object"&&ce.call(n)==W||false}function kt(n){return typeof n=="string"||n&&typeof n=="object"&&ce.call(n)==P||false}function xt(n){for(var t=-1,e=Fe(n),r=e.length,u=Xt(r);++t<r;)u[t]=n[e[t]];return u}function Ct(n,t,e){var r=-1,u=st(),o=n?n.length:0,i=false;return e=(0>e?Ie(0,o+e):e)||0,Te(n)?i=-1<u(n,t,e):typeof o=="number"?i=-1<(kt(n)?n.indexOf(t,e):u(n,t,e)):h(n,function(n){return++r<e?void 0:!(i=n===t)}),i}function Ot(n,t,e){var r=true;t=J.createCallback(t,e,3),e=-1;
var u=n?n.length:0;if(typeof u=="number")for(;++e<u&&(r=!!t(n[e],e,n)););else h(n,function(n,e,u){return r=!!t(n,e,u)});return r}function Nt(n,t,e){var r=[];t=J.createCallback(t,e,3),e=-1;var u=n?n.length:0;if(typeof u=="number")for(;++e<u;){var o=n[e];t(o,e,n)&&r.push(o)}else h(n,function(n,e,u){t(n,e,u)&&r.push(n)});return r}function It(n,t,e){t=J.createCallback(t,e,3),e=-1;var r=n?n.length:0;if(typeof r!="number"){var u;return h(n,function(n,e,r){return t(n,e,r)?(u=n,false):void 0}),u}for(;++e<r;){var o=n[e];
if(t(o,e,n))return o}}function St(n,t,e){var r=-1,u=n?n.length:0;if(t=t&&typeof e=="undefined"?t:tt(t,e,3),typeof u=="number")for(;++r<u&&false!==t(n[r],r,n););else h(n,t);return n}function Et(n,t,e){var r=n?n.length:0;if(t=t&&typeof e=="undefined"?t:tt(t,e,3),typeof r=="number")for(;r--&&false!==t(n[r],r,n););else{var u=Fe(n),r=u.length;h(n,function(n,e,o){return e=u?u[--r]:--r,t(o[e],e,o)})}return n}function Rt(n,t,e){var r=-1,u=n?n.length:0;if(t=J.createCallback(t,e,3),typeof u=="number")for(var o=Xt(u);++r<u;)o[r]=t(n[r],r,n);
else o=[],h(n,function(n,e,u){o[++r]=t(n,e,u)});return o}function At(n,t,e){var u=-1/0,o=u;if(typeof t!="function"&&e&&e[t]===n&&(t=null),null==t&&Te(n)){e=-1;for(var i=n.length;++e<i;){var a=n[e];a>o&&(o=a)}}else t=null==t&&kt(n)?r:J.createCallback(t,e,3),St(n,function(n,e,r){e=t(n,e,r),e>u&&(u=e,o=n)});return o}function Dt(n,t,e,r){if(!n)return e;var u=3>arguments.length;t=J.createCallback(t,r,4);var o=-1,i=n.length;if(typeof i=="number")for(u&&(e=n[++o]);++o<i;)e=t(e,n[o],o,n);else h(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o)
});return e}function $t(n,t,e,r){var u=3>arguments.length;return t=J.createCallback(t,r,4),Et(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o)}),e}function Tt(n){var t=-1,e=n?n.length:0,r=Xt(typeof e=="number"?e:0);return St(n,function(n){var e=at(0,++t);r[t]=r[e],r[e]=n}),r}function Ft(n,t,e){var r;t=J.createCallback(t,e,3),e=-1;var u=n?n.length:0;if(typeof u=="number")for(;++e<u&&!(r=t(n[e],e,n)););else h(n,function(n,e,u){return!(r=t(n,e,u))});return!!r}function Bt(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=-1;
for(t=J.createCallback(t,e,3);++o<u&&t(n[o],o,n);)r++}else if(r=t,null==r||e)return n?n[0]:v;return p(n,0,Se(Ie(0,r),u))}function Wt(t,e,r){if(typeof r=="number"){var u=t?t.length:0;r=0>r?Ie(0,u+r):r||0}else if(r)return r=zt(t,e),t[r]===e?r:-1;return n(t,e,r)}function qt(n,t,e){if(typeof t!="number"&&null!=t){var r=0,u=-1,o=n?n.length:0;for(t=J.createCallback(t,e,3);++u<o&&t(n[u],u,n);)r++}else r=null==t||e?1:Ie(0,t);return p(n,r)}function zt(n,t,e,r){var u=0,o=n?n.length:u;for(e=e?J.createCallback(e,r,1):Ut,t=e(t);u<o;)r=u+o>>>1,e(n[r])<t?u=r+1:o=r;
return u}function Pt(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=typeof t!="function"&&r&&r[t]===n?null:t,t=false),null!=e&&(e=J.createCallback(e,r,3)),ft(n,t,e)}function Kt(){for(var n=1<arguments.length?arguments:arguments[0],t=-1,e=n?At(Ve(n,"length")):0,r=Xt(0>e?0:e);++t<e;)r[t]=Ve(n,t);return r}function Lt(n,t){var e=-1,r=n?n.length:0,u={};for(t||!r||Te(n[0])||(t=[]);++e<r;){var o=n[e];t?u[o]=t[e]:o&&(u[o[0]]=o[1])}return u}function Mt(n,t){return 2<arguments.length?ct(n,17,p(arguments,2),null,t):ct(n,1,null,null,t)
}function Vt(n,t,e){function r(){c&&ve(c),i=c=p=v,(g||h!==t)&&(s=Ue(),a=n.apply(l,o),c||i||(o=l=null))}function u(){var e=t-(Ue()-f);0<e?c=_e(u,e):(i&&ve(i),e=p,i=c=p=v,e&&(s=Ue(),a=n.apply(l,o),c||i||(o=l=null)))}var o,i,a,f,l,c,p,s=0,h=false,g=true;if(!dt(n))throw new ie;if(t=Ie(0,t)||0,true===e)var y=true,g=false;else wt(e)&&(y=e.leading,h="maxWait"in e&&(Ie(t,e.maxWait)||0),g="trailing"in e?e.trailing:g);return function(){if(o=arguments,f=Ue(),l=this,p=g&&(c||!y),false===h)var e=y&&!c;else{i||y||(s=f);var v=h-(f-s),m=0>=v;
m?(i&&(i=ve(i)),s=f,a=n.apply(l,o)):i||(i=_e(r,v))}return m&&c?c=ve(c):c||t===h||(c=_e(u,t)),e&&(m=true,a=n.apply(l,o)),!m||c||i||(o=l=null),a}}function Ut(n){return n}function Gt(n,t,e){var r=true,u=t&&bt(t);t&&(e||u.length)||(null==e&&(e=t),o=Q,t=n,n=J,u=bt(t)),false===e?r=false:wt(e)&&"chain"in e&&(r=e.chain);var o=n,i=dt(o);St(u,function(e){var u=n[e]=t[e];i&&(o.prototype[e]=function(){var t=this.__chain__,e=this.__wrapped__,i=[e];if(be.apply(i,arguments),i=u.apply(n,i),r||t){if(e===i&&wt(i))return this;
i=new o(i),i.__chain__=t}return i})})}function Ht(){}function Jt(n){return function(t){return t[n]}}function Qt(){return this.__wrapped__}e=e?Y.defaults(G.Object(),e,Y.pick(G,A)):G;var Xt=e.Array,Yt=e.Boolean,Zt=e.Date,ne=e.Function,te=e.Math,ee=e.Number,re=e.Object,ue=e.RegExp,oe=e.String,ie=e.TypeError,ae=[],fe=re.prototype,le=e._,ce=fe.toString,pe=ue("^"+oe(ce).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),se=te.ceil,ve=e.clearTimeout,he=te.floor,ge=ne.prototype.toString,ye=vt(ye=re.getPrototypeOf)&&ye,me=fe.hasOwnProperty,be=ae.push,_e=e.setTimeout,de=ae.splice,we=ae.unshift,je=function(){try{var n={},t=vt(t=re.defineProperty)&&t,e=t(n,n,n)&&t
}catch(r){}return e}(),ke=vt(ke=re.create)&&ke,xe=vt(xe=Xt.isArray)&&xe,Ce=e.isFinite,Oe=e.isNaN,Ne=vt(Ne=re.keys)&&Ne,Ie=te.max,Se=te.min,Ee=e.parseInt,Re=te.random,Ae={};Ae[$]=Xt,Ae[T]=Yt,Ae[F]=Zt,Ae[B]=ne,Ae[q]=re,Ae[W]=ee,Ae[z]=ue,Ae[P]=oe,Q.prototype=J.prototype;var De=J.support={};De.funcDecomp=!vt(e.a)&&E.test(s),De.funcNames=typeof ne.name=="string",J.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:N,variable:"",imports:{_:J}},ke||(nt=function(){function n(){}return function(t){if(wt(t)){n.prototype=t;
var r=new n;n.prototype=null}return r||e.Object()}}());var $e=je?function(n,t){M.value=t,je(n,"__bindData__",M)}:Ht,Te=xe||function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&ce.call(n)==$||false},Fe=Ne?function(n){return wt(n)?Ne(n):[]}:H,Be={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},We=_t(Be),qe=ue("("+Fe(We).join("|")+")","g"),ze=ue("["+Fe(Be).join("")+"]","g"),Pe=ye?function(n){if(!n||ce.call(n)!=q)return false;var t=n.valueOf,e=vt(t)&&(e=ye(t))&&ye(e);return e?n==e||ye(n)==e:ht(n)
}:ht,Ke=lt(function(n,t,e){me.call(n,e)?n[e]++:n[e]=1}),Le=lt(function(n,t,e){(me.call(n,e)?n[e]:n[e]=[]).push(t)}),Me=lt(function(n,t,e){n[e]=t}),Ve=Rt,Ue=vt(Ue=Zt.now)&&Ue||function(){return(new Zt).getTime()},Ge=8==Ee(d+"08")?Ee:function(n,t){return Ee(kt(n)?n.replace(I,""):n,t||0)};return J.after=function(n,t){if(!dt(t))throw new ie;return function(){return 1>--n?t.apply(this,arguments):void 0}},J.assign=U,J.at=function(n){for(var t=arguments,e=-1,r=ut(t,true,false,1),t=t[2]&&t[2][t[1]]===n?1:r.length,u=Xt(t);++e<t;)u[e]=n[r[e]];
return u},J.bind=Mt,J.bindAll=function(n){for(var t=1<arguments.length?ut(arguments,true,false,1):bt(n),e=-1,r=t.length;++e<r;){var u=t[e];n[u]=ct(n[u],1,null,null,n)}return n},J.bindKey=function(n,t){return 2<arguments.length?ct(t,19,p(arguments,2),null,n):ct(t,3,null,null,n)},J.chain=function(n){return n=new Q(n),n.__chain__=true,n},J.compact=function(n){for(var t=-1,e=n?n.length:0,r=[];++t<e;){var u=n[t];u&&r.push(u)}return r},J.compose=function(){for(var n=arguments,t=n.length;t--;)if(!dt(n[t]))throw new ie;
return function(){for(var t=arguments,e=n.length;e--;)t=[n[e].apply(this,t)];return t[0]}},J.constant=function(n){return function(){return n}},J.countBy=Ke,J.create=function(n,t){var e=nt(n);return t?U(e,t):e},J.createCallback=function(n,t,e){var r=typeof n;if(null==n||"function"==r)return tt(n,t,e);if("object"!=r)return Jt(n);var u=Fe(n),o=u[0],i=n[o];return 1!=u.length||i!==i||wt(i)?function(t){for(var e=u.length,r=false;e--&&(r=ot(t[u[e]],n[u[e]],null,true)););return r}:function(n){return n=n[o],i===n&&(0!==i||1/i==1/n)
}},J.curry=function(n,t){return t=typeof t=="number"?t:+t||n.length,ct(n,4,null,null,null,t)},J.debounce=Vt,J.defaults=_,J.defer=function(n){if(!dt(n))throw new ie;var t=p(arguments,1);return _e(function(){n.apply(v,t)},1)},J.delay=function(n,t){if(!dt(n))throw new ie;var e=p(arguments,2);return _e(function(){n.apply(v,e)},t)},J.difference=function(n){return rt(n,ut(arguments,true,true,1))},J.filter=Nt,J.flatten=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=typeof t!="function"&&r&&r[t]===n?null:t,t=false),null!=e&&(n=Rt(n,e,r)),ut(n,t)
},J.forEach=St,J.forEachRight=Et,J.forIn=g,J.forInRight=function(n,t,e){var r=[];g(n,function(n,t){r.push(t,n)});var u=r.length;for(t=tt(t,e,3);u--&&false!==t(r[u--],r[u],n););return n},J.forOwn=h,J.forOwnRight=mt,J.functions=bt,J.groupBy=Le,J.indexBy=Me,J.initial=function(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=u;for(t=J.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else r=null==t||e?1:t||r;return p(n,0,Se(Ie(0,u-r),u))},J.intersection=function(){for(var e=[],r=-1,u=arguments.length,i=a(),f=st(),p=f===n,s=a();++r<u;){var v=arguments[r];
(Te(v)||yt(v))&&(e.push(v),i.push(p&&v.length>=b&&o(r?e[r]:s)))}var p=e[0],h=-1,g=p?p.length:0,y=[];n:for(;++h<g;){var m=i[0],v=p[h];if(0>(m?t(m,v):f(s,v))){for(r=u,(m||s).push(v);--r;)if(m=i[r],0>(m?t(m,v):f(e[r],v)))continue n;y.push(v)}}for(;u--;)(m=i[u])&&c(m);return l(i),l(s),y},J.invert=_t,J.invoke=function(n,t){var e=p(arguments,2),r=-1,u=typeof t=="function",o=n?n.length:0,i=Xt(typeof o=="number"?o:0);return St(n,function(n){i[++r]=(u?t:n[t]).apply(n,e)}),i},J.keys=Fe,J.map=Rt,J.mapValues=function(n,t,e){var r={};
return t=J.createCallback(t,e,3),h(n,function(n,e,u){r[e]=t(n,e,u)}),r},J.max=At,J.memoize=function(n,t){function e(){var r=e.cache,u=t?t.apply(this,arguments):m+arguments[0];return me.call(r,u)?r[u]:r[u]=n.apply(this,arguments)}if(!dt(n))throw new ie;return e.cache={},e},J.merge=function(n){var t=arguments,e=2;if(!wt(n))return n;if("number"!=typeof t[2]&&(e=t.length),3<e&&"function"==typeof t[e-2])var r=tt(t[--e-1],t[e--],2);else 2<e&&"function"==typeof t[e-1]&&(r=t[--e]);for(var t=p(arguments,1,e),u=-1,o=a(),i=a();++u<e;)it(n,t[u],r,o,i);
return l(o),l(i),n},J.min=function(n,t,e){var u=1/0,o=u;if(typeof t!="function"&&e&&e[t]===n&&(t=null),null==t&&Te(n)){e=-1;for(var i=n.length;++e<i;){var a=n[e];a<o&&(o=a)}}else t=null==t&&kt(n)?r:J.createCallback(t,e,3),St(n,function(n,e,r){e=t(n,e,r),e<u&&(u=e,o=n)});return o},J.omit=function(n,t,e){var r={};if(typeof t!="function"){var u=[];g(n,function(n,t){u.push(t)});for(var u=rt(u,ut(arguments,true,false,1)),o=-1,i=u.length;++o<i;){var a=u[o];r[a]=n[a]}}else t=J.createCallback(t,e,3),g(n,function(n,e,u){t(n,e,u)||(r[e]=n)
});return r},J.once=function(n){var t,e;if(!dt(n))throw new ie;return function(){return t?e:(t=true,e=n.apply(this,arguments),n=null,e)}},J.pairs=function(n){for(var t=-1,e=Fe(n),r=e.length,u=Xt(r);++t<r;){var o=e[t];u[t]=[o,n[o]]}return u},J.partial=function(n){return ct(n,16,p(arguments,1))},J.partialRight=function(n){return ct(n,32,null,p(arguments,1))},J.pick=function(n,t,e){var r={};if(typeof t!="function")for(var u=-1,o=ut(arguments,true,false,1),i=wt(n)?o.length:0;++u<i;){var a=o[u];a in n&&(r[a]=n[a])
}else t=J.createCallback(t,e,3),g(n,function(n,e,u){t(n,e,u)&&(r[e]=n)});return r},J.pluck=Ve,J.property=Jt,J.pull=function(n){for(var t=arguments,e=0,r=t.length,u=n?n.length:0;++e<r;)for(var o=-1,i=t[e];++o<u;)n[o]===i&&(de.call(n,o--,1),u--);return n},J.range=function(n,t,e){n=+n||0,e=typeof e=="number"?e:+e||1,null==t&&(t=n,n=0);var r=-1;t=Ie(0,se((t-n)/(e||1)));for(var u=Xt(t);++r<t;)u[r]=n,n+=e;return u},J.reject=function(n,t,e){return t=J.createCallback(t,e,3),Nt(n,function(n,e,r){return!t(n,e,r)
})},J.remove=function(n,t,e){var r=-1,u=n?n.length:0,o=[];for(t=J.createCallback(t,e,3);++r<u;)e=n[r],t(e,r,n)&&(o.push(e),de.call(n,r--,1),u--);return o},J.rest=qt,J.shuffle=Tt,J.sortBy=function(n,t,e){var r=-1,o=Te(t),i=n?n.length:0,p=Xt(typeof i=="number"?i:0);for(o||(t=J.createCallback(t,e,3)),St(n,function(n,e,u){var i=p[++r]=f();o?i.m=Rt(t,function(t){return n[t]}):(i.m=a())[0]=t(n,e,u),i.n=r,i.o=n}),i=p.length,p.sort(u);i--;)n=p[i],p[i]=n.o,o||l(n.m),c(n);return p},J.tap=function(n,t){return t(n),n
},J.throttle=function(n,t,e){var r=true,u=true;if(!dt(n))throw new ie;return false===e?r=false:wt(e)&&(r="leading"in e?e.leading:r,u="trailing"in e?e.trailing:u),L.leading=r,L.maxWait=t,L.trailing=u,Vt(n,t,L)},J.times=function(n,t,e){n=-1<(n=+n)?n:0;var r=-1,u=Xt(n);for(t=tt(t,e,1);++r<n;)u[r]=t(r);return u},J.toArray=function(n){return n&&typeof n.length=="number"?p(n):xt(n)},J.transform=function(n,t,e,r){var u=Te(n);if(null==e)if(u)e=[];else{var o=n&&n.constructor;e=nt(o&&o.prototype)}return t&&(t=J.createCallback(t,r,4),(u?St:h)(n,function(n,r,u){return t(e,n,r,u)
})),e},J.union=function(){return ft(ut(arguments,true,true))},J.uniq=Pt,J.values=xt,J.where=Nt,J.without=function(n){return rt(n,p(arguments,1))},J.wrap=function(n,t){return ct(t,16,[n])},J.xor=function(){for(var n=-1,t=arguments.length;++n<t;){var e=arguments[n];if(Te(e)||yt(e))var r=r?ft(rt(r,e).concat(rt(e,r))):e}return r||[]},J.zip=Kt,J.zipObject=Lt,J.collect=Rt,J.drop=qt,J.each=St,J.eachRight=Et,J.extend=U,J.methods=bt,J.object=Lt,J.select=Nt,J.tail=qt,J.unique=Pt,J.unzip=Kt,Gt(J),J.clone=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=t,t=false),Z(n,t,typeof e=="function"&&tt(e,r,1))
},J.cloneDeep=function(n,t,e){return Z(n,true,typeof t=="function"&&tt(t,e,1))},J.contains=Ct,J.escape=function(n){return null==n?"":oe(n).replace(ze,pt)},J.every=Ot,J.find=It,J.findIndex=function(n,t,e){var r=-1,u=n?n.length:0;for(t=J.createCallback(t,e,3);++r<u;)if(t(n[r],r,n))return r;return-1},J.findKey=function(n,t,e){var r;return t=J.createCallback(t,e,3),h(n,function(n,e,u){return t(n,e,u)?(r=e,false):void 0}),r},J.findLast=function(n,t,e){var r;return t=J.createCallback(t,e,3),Et(n,function(n,e,u){return t(n,e,u)?(r=n,false):void 0
}),r},J.findLastIndex=function(n,t,e){var r=n?n.length:0;for(t=J.createCallback(t,e,3);r--;)if(t(n[r],r,n))return r;return-1},J.findLastKey=function(n,t,e){var r;return t=J.createCallback(t,e,3),mt(n,function(n,e,u){return t(n,e,u)?(r=e,false):void 0}),r},J.has=function(n,t){return n?me.call(n,t):false},J.identity=Ut,J.indexOf=Wt,J.isArguments=yt,J.isArray=Te,J.isBoolean=function(n){return true===n||false===n||n&&typeof n=="object"&&ce.call(n)==T||false},J.isDate=function(n){return n&&typeof n=="object"&&ce.call(n)==F||false
},J.isElement=function(n){return n&&1===n.nodeType||false},J.isEmpty=function(n){var t=true;if(!n)return t;var e=ce.call(n),r=n.length;return e==$||e==P||e==D||e==q&&typeof r=="number"&&dt(n.splice)?!r:(h(n,function(){return t=false}),t)},J.isEqual=function(n,t,e,r){return ot(n,t,typeof e=="function"&&tt(e,r,2))},J.isFinite=function(n){return Ce(n)&&!Oe(parseFloat(n))},J.isFunction=dt,J.isNaN=function(n){return jt(n)&&n!=+n},J.isNull=function(n){return null===n},J.isNumber=jt,J.isObject=wt,J.isPlainObject=Pe,J.isRegExp=function(n){return n&&typeof n=="object"&&ce.call(n)==z||false
},J.isString=kt,J.isUndefined=function(n){return typeof n=="undefined"},J.lastIndexOf=function(n,t,e){var r=n?n.length:0;for(typeof e=="number"&&(r=(0>e?Ie(0,r+e):Se(e,r-1))+1);r--;)if(n[r]===t)return r;return-1},J.mixin=Gt,J.noConflict=function(){return e._=le,this},J.noop=Ht,J.now=Ue,J.parseInt=Ge,J.random=function(n,t,e){var r=null==n,u=null==t;return null==e&&(typeof n=="boolean"&&u?(e=n,n=1):u||typeof t!="boolean"||(e=t,u=true)),r&&u&&(t=1),n=+n||0,u?(t=n,n=0):t=+t||0,e||n%1||t%1?(e=Re(),Se(n+e*(t-n+parseFloat("1e-"+((e+"").length-1))),t)):at(n,t)
},J.reduce=Dt,J.reduceRight=$t,J.result=function(n,t){if(n){var e=n[t];return dt(e)?n[t]():e}},J.runInContext=s,J.size=function(n){var t=n?n.length:0;return typeof t=="number"?t:Fe(n).length},J.some=Ft,J.sortedIndex=zt,J.template=function(n,t,e){var r=J.templateSettings;n=oe(n||""),e=_({},e,r);var u,o=_({},e.imports,r.imports),r=Fe(o),o=xt(o),a=0,f=e.interpolate||S,l="__p+='",f=ue((e.escape||S).source+"|"+f.source+"|"+(f===N?x:S).source+"|"+(e.evaluate||S).source+"|$","g");n.replace(f,function(t,e,r,o,f,c){return r||(r=o),l+=n.slice(a,c).replace(R,i),e&&(l+="'+__e("+e+")+'"),f&&(u=true,l+="';"+f+";\n__p+='"),r&&(l+="'+((__t=("+r+"))==null?'':__t)+'"),a=c+t.length,t
}),l+="';",f=e=e.variable,f||(e="obj",l="with("+e+"){"+l+"}"),l=(u?l.replace(w,""):l).replace(j,"$1").replace(k,"$1;"),l="function("+e+"){"+(f?"":e+"||("+e+"={});")+"var __t,__p='',__e=_.escape"+(u?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+l+"return __p}";try{var c=ne(r,"return "+l).apply(v,o)}catch(p){throw p.source=l,p}return t?c(t):(c.source=l,c)},J.unescape=function(n){return null==n?"":oe(n).replace(qe,gt)},J.uniqueId=function(n){var t=++y;return oe(null==n?"":n)+t
},J.all=Ot,J.any=Ft,J.detect=It,J.findWhere=It,J.foldl=Dt,J.foldr=$t,J.include=Ct,J.inject=Dt,Gt(function(){var n={};return h(J,function(t,e){J.prototype[e]||(n[e]=t)}),n}(),false),J.first=Bt,J.last=function(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=u;for(t=J.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else if(r=t,null==r||e)return n?n[u-1]:v;return p(n,Ie(0,u-r))},J.sample=function(n,t,e){return n&&typeof n.length!="number"&&(n=xt(n)),null==t||e?n?n[at(0,n.length-1)]:v:(n=Tt(n),n.length=Se(Ie(0,t),n.length),n)
},J.take=Bt,J.head=Bt,h(J,function(n,t){var e="sample"!==t;J.prototype[t]||(J.prototype[t]=function(t,r){var u=this.__chain__,o=n(this.__wrapped__,t,r);return u||null!=t&&(!r||e&&typeof t=="function")?new Q(o,u):o})}),J.VERSION="2.4.1",J.prototype.chain=function(){return this.__chain__=true,this},J.prototype.toString=function(){return oe(this.__wrapped__)},J.prototype.value=Qt,J.prototype.valueOf=Qt,St(["join","pop","shift"],function(n){var t=ae[n];J.prototype[n]=function(){var n=this.__chain__,e=t.apply(this.__wrapped__,arguments);
return n?new Q(e,n):e}}),St(["push","reverse","sort","unshift"],function(n){var t=ae[n];J.prototype[n]=function(){return t.apply(this.__wrapped__,arguments),this}}),St(["concat","slice","splice"],function(n){var t=ae[n];J.prototype[n]=function(){return new Q(t.apply(this.__wrapped__,arguments),this.__chain__)}}),J}var v,h=[],g=[],y=0,m=+new Date+"",b=75,_=40,d=" \t\x0B\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",w=/\b__p\+='';/g,j=/\b(__p\+=)''\+/g,k=/(__e\(.*?\)|\b__t\))\+'';/g,x=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,C=/\w*$/,O=/^\s*function[ \n\r\t]+\w/,N=/<%=([\s\S]+?)%>/g,I=RegExp("^["+d+"]*0+(?=.$)"),S=/($^)/,E=/\bthis\b/,R=/['\n\r\t\u2028\u2029\\]/g,A="Array Boolean Date Function Math Number Object RegExp String _ attachEvent clearTimeout isFinite isNaN parseInt setTimeout".split(" "),D="[object Arguments]",$="[object Array]",T="[object Boolean]",F="[object Date]",B="[object Function]",W="[object Number]",q="[object Object]",z="[object RegExp]",P="[object String]",K={};
K[B]=false,K[D]=K[$]=K[T]=K[F]=K[W]=K[q]=K[z]=K[P]=true;var L={leading:false,maxWait:0,trailing:false},M={configurable:false,enumerable:false,value:null,writable:false},V={"boolean":false,"function":true,object:true,number:false,string:false,undefined:false},U={"\\":"\\","'":"'","\n":"n","\r":"r","\t":"t","\u2028":"u2028","\u2029":"u2029"},G=V[typeof window]&&window||this,H=V[typeof exports]&&exports&&!exports.nodeType&&exports,J=V[typeof module]&&module&&!module.nodeType&&module,Q=J&&J.exports===H&&H,X=V[typeof global]&&global;!X||X.global!==X&&X.window!==X||(G=X);
var Y=s();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(G._=Y, define(function(){return Y})):H&&J?Q?(J.exports=Y)._=Y:H._=Y:G._=Y}).call(this);
;(function () {
	var isCommonJS = typeof module !== 'undefined' && module.exports;
	var isNode = !(typeof window !== 'undefined' && this === window);
	var setImmediate = setImmediate || function (cb) {
		setTimeout(cb, 0);
	};
	var Worker = isNode ? require(__dirname + '/Worker.js') : self.Worker;
	var URL = typeof self !== 'undefined' ? (self.URL ? self.URL : self.webkitURL) : null;
	var _supports = (isNode || self.Worker) ? true : false; // node always supports parallel

	function extend(from, to) {
		if (!to) to = {};
		for (var i in from) {
			if (to[i] === undefined) to[i] = from[i];
		}
		return to;
	}

	function Operation() {
		this._callbacks = [];
		this._errCallbacks = [];

		this._resolved = 0;
		this._result = null;
	}

	Operation.prototype.resolve = function (err, res) {
		if (!err) {
			this._resolved = 1;
			this._result = res;

			for (var i = 0; i < this._callbacks.length; ++i) {
				this._callbacks[i](res);
			}
		} else {
			this._resolved = 2;
			this._result = err;

			for (var iE = 0; iE < this._errCallbacks.length; ++iE) {
				this._errCallbacks[iE](res);
			}
		}

		this._callbacks = [];
		this._errCallbacks = [];
	};

	Operation.prototype.then = function (cb, errCb) {
		if (this._resolved === 1) { // result
			if (cb) {
				cb(this._result);
			}

			return;
		} else if (this._resolved === 2) { // error
			if (errCb) {
				errCb(this._result);
			}
			return;
		}

		if (cb) {
			this._callbacks[this._callbacks.length] = cb;
		}

		if (errCb) {
			this._errCallbacks[this._errCallbacks.length] = errCb;
		}
		return this;
	};

	var defaults = {
		evalPath: isNode ? __dirname + '/eval.js' : null,
		maxWorkers: isNode ? require('os').cpus().length : 4,
		synchronous: true,
		env: {},
		envNamespace: 'env'
	};

	function Parallel(data, options) {
		this.data = data;
		this.options = extend(defaults, options);
		this.operation = new Operation();
		this.operation.resolve(null, this.data);
		this.requiredScripts = [];
		this.requiredFunctions = [];
	}

	// static method
	Parallel.isSupported=function(){ return _supports; }
	
	Parallel.prototype.getWorkerSource = function (cb, env) {
		var that = this;
		var preStr = '';
		var i = 0;
		if (!isNode && this.requiredScripts.length !== 0) {
			preStr += 'importScripts("' + this.requiredScripts.join('","') + '");\r\n';
		}

		for (i = 0; i < this.requiredFunctions.length; ++i) {
			if (this.requiredFunctions[i].name) {
				preStr += 'var ' + this.requiredFunctions[i].name + ' = ' + this.requiredFunctions[i].fn.toString() + ';';
			} else {
				preStr += this.requiredFunctions[i].fn.toString();
			}
		}

		env = JSON.stringify(env || {});

		var ns = this.options.envNamespace;

		if (isNode) {
			return preStr + 'process.on("message", function(e) {global.' + ns + ' = ' + env + ';process.send(JSON.stringify((' + cb.toString() + ')(JSON.parse(e).data)))})';
		} else {
			return preStr + 'self.onmessage = function(e) {var global = {}; global.' + ns + ' = ' + env + ';self.postMessage((' + cb.toString() + ')(e.data))}';
		}
	};

	Parallel.prototype.require = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			func;

		for (var i = 0; i < args.length; i++) {
			func = args[i];

			if (typeof func === 'string') {
				this.requiredScripts.push(func);
			} else if (typeof func === 'function') {
				this.requiredFunctions.push({ fn: func });
			} else if (typeof func === 'object') {
				this.requiredFunctions.push(func);
			}
		}

		return this;
	};

	Parallel.prototype._spawnWorker = function (cb, env) {
		var wrk;
		var src = this.getWorkerSource(cb, env);
		if (isNode) {
			wrk = new Worker(this.options.evalPath);
			wrk.postMessage(src);
		} else {
			if (Worker === undefined) {
				return undefined;
			}

			try {
				if (this.requiredScripts.length !== 0) {
					if (this.options.evalPath !== null) {
						wrk = new Worker(this.options.evalPath);
						wrk.postMessage(src);
					} else {
						throw new Error('Can\'t use required scripts without eval.js!');
					}
				} else if (!URL) {
					throw new Error('Can\'t create a blob URL in this browser!');
				} else {
					var blob = new Blob([src], { type: 'text/javascript' });
					var url = URL.createObjectURL(blob);

					wrk = new Worker(url);
				}
			} catch (e) {
				if (this.options.evalPath !== null) { // blob/url unsupported, cross-origin error
					wrk = new Worker(this.options.evalPath);
					wrk.postMessage(src);
				} else {
					throw e;
				}
			}
		}

		return wrk;
	};

	Parallel.prototype.spawn = function (cb, env) {
		var that = this;
		var newOp = new Operation();

		env = extend(this.options.env, env || {});

		this.operation.then(function () {
			var wrk = that._spawnWorker(cb, env);
			if (wrk !== undefined) {
				wrk.onmessage = function (msg) {
					wrk.terminate();
					that.data = msg.data;
					newOp.resolve(null, that.data);
				};
				wrk.postMessage(that.data);
			} else if (that.options.synchronous) {
				setImmediate(function () {
					that.data = cb(that.data);
					newOp.resolve(null, that.data);
				});
			} else {
				throw new Error('Workers do not exist and synchronous operation not allowed!');
			}
		});
		this.operation = newOp;
		return this;
	};

	Parallel.prototype._spawnMapWorker = function (i, cb, done, env) {
		var that = this;
		var wrk = that._spawnWorker(cb, env);
		if (wrk !== undefined) {
			wrk.onmessage = function (msg) {
				wrk.terminate();
				that.data[i] = msg.data;
				done();
			};
			wrk.postMessage(that.data[i]);
		} else if (that.options.synchronous) {
			setImmediate(function () {
				that.data[i] = cb(that.data[i]);
				done();
			});
		} else {
			throw new Error('Workers do not exist and synchronous operation not allowed!');
		}
	};

	Parallel.prototype.map = function (cb, env) {
		env = extend(this.options.env, env || {});

		if (!this.data.length) {
			return this.spawn(cb, env);
		}

		var that = this;
		var startedOps = 0;
		var doneOps = 0;
		function done() {
			if (++doneOps === that.data.length) {
				newOp.resolve(null, that.data);
			} else if (startedOps < that.data.length) {
				that._spawnMapWorker(startedOps++, cb, done, env);
			}
		}

		var newOp = new Operation();
		this.operation.then(function () {
			for (; startedOps - doneOps < that.options.maxWorkers && startedOps < that.data.length; ++startedOps) {
				that._spawnMapWorker(startedOps, cb, done, env);
			}
		});
		this.operation = newOp;
		return this;
	};

	Parallel.prototype._spawnReduceWorker = function (data, cb, done, env) {
		var that = this;
		var wrk = that._spawnWorker(cb, env);
		if (wrk !== undefined) {
			wrk.onmessage = function (msg) {
				wrk.terminate();
				that.data[that.data.length] = msg.data;
				done();
			};
			wrk.postMessage(data);
		} else if (that.options.synchronous) {
			setImmediate(function () {
				that.data[that.data.length] = cb(data);
				done();
			});
		} else {
			throw new Error('Workers do not exist and synchronous operation not allowed!');
		}
	};

	Parallel.prototype.reduce = function (cb, env) {
		env = extend(this.options.env, env || {});

		if (!this.data.length) {
			throw new Error('Can\'t reduce non-array data');
		}

		var runningWorkers = 0;
		var that = this;
		function done(data) {
			--runningWorkers;
			if (that.data.length === 1 && runningWorkers === 0) {
				that.data = that.data[0];
				newOp.resolve(null, that.data);
			} else if (that.data.length > 1) {
				++runningWorkers;
				that._spawnReduceWorker([that.data[0], that.data[1]], cb, done, env);
				that.data.splice(0, 2);
			}
		}

		var newOp = new Operation();
		this.operation.then(function () {
			if (that.data.length === 1) {
				newOp.resolve(null, that.data[0]);
			} else {
				for (var i = 0; i < that.options.maxWorkers && i < Math.floor(that.data.length / 2); ++i) {
					++runningWorkers;
					that._spawnReduceWorker([that.data[i * 2], that.data[i * 2 + 1]], cb, done, env);
				}

				that.data.splice(0, i * 2);
			}
		});
		this.operation = newOp;
		return this;
	};

	Parallel.prototype.then = function (cb, errCb) {
		var that = this;
		var newOp = new Operation();
		this.operation.then(function () {
			var retData = cb(that.data);
			if (retData !== undefined) {
				that.data = retData;
			}
			newOp.resolve(null, that.data);
		}, errCb);
		this.operation = newOp;
		return this;
	};

	if (isCommonJS) {
		module.exports = Parallel;
	} else {
		self.Parallel = Parallel;
	}
})();
;/*
 Leaflet 0.8-dev (f83915a), a JS library for interactive maps. http://leafletjs.com
 (c) 2010-2014 Vladimir Agafonkin, (c) 2010-2011 CloudMade
*/
(function (window, document, undefined) {
var L = {
	version: '0.8-dev'
};

function expose() {
	var oldL = window.L;

	L.noConflict = function () {
		window.L = oldL;
		return this;
	};

	window.L = L;
}

// define Leaflet for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = L;

// define Leaflet as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(L);

// define Leaflet as a global L variable, saving the original L to restore later if needed
} else {
	expose();
}


/*
 * L.Util contains various utility functions used throughout Leaflet code.
 */

L.Util = {
	// extend an object with properties of one or more other objects
	extend: function (dest) {
		var i, j, len, src;

		for (j = 1, len = arguments.length; j < len; j++) {
			src = arguments[j];
			for (i in src) {
				dest[i] = src[i];
			}
		}
		return dest;
	},

	// create an object from a given prototype
	create: Object.create || (function () {
		function F() {}
		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})(),

	// bind a function to be called with a given context
	bind: function (fn, obj) {
		var slice = Array.prototype.slice;

		if (fn.bind) {
			return fn.bind.apply(fn, slice.call(arguments, 1));
		}

		var args = slice.call(arguments, 2);

		return function () {
			return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
		};
	},

	// return unique ID of an object
	stamp: function (obj) {
		// jshint camelcase: false
		obj._leaflet_id = obj._leaflet_id || ++L.Util.lastId;
		return obj._leaflet_id;
	},

	lastId: 0,

	// return a function that won't be called more often than the given interval
	throttle: function (fn, time, context) {
		var lock, args, wrapperFn, later;

		later = function () {
			// reset lock and call if queued
			lock = false;
			if (args) {
				wrapperFn.apply(context, args);
				args = false;
			}
		};

		wrapperFn = function () {
			if (lock) {
				// called too soon, queue to call later
				args = arguments;

			} else {
				// call and lock until later
				fn.apply(context, arguments);
				setTimeout(later, time);
				lock = true;
			}
		};

		return wrapperFn;
	},

	// wrap the given number to lie within a certain range (used for wrapping longitude)
	wrapNum: function (x, range, includeMax) {
		var max = range[1],
		    min = range[0],
		    d = max - min;
		return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
	},

	// do nothing (used as a noop throughout the code)
	falseFn: function () { return false; },

	// round a given number to a given precision
	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},

	// trim whitespace from both sides of a string
	trim: function (str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},

	// split a string into words
	splitWords: function (str) {
		return L.Util.trim(str).split(/\s+/);
	},

	// set options to an object, inheriting parent's options as well
	setOptions: function (obj, options) {
		if (!obj.hasOwnProperty('options')) {
			obj.options = obj.options ? L.Util.create(obj.options) : {};
		}
		for (var i in options) {
			obj.options[i] = options[i];
		}
		return obj.options;
	},

	// make an URL with GET parameters out of a set of properties/values
	getParamString: function (obj, existingUrl, uppercase) {
		var params = [];
		for (var i in obj) {
			params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
		}
		return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
	},

	// super-simple templating facility, used for TileLayer URLs
	template: function (str, data) {
		return str.replace(L.Util.templateRe, function (str, key) {
			var value = data[key];

			if (value === undefined) {
				throw new Error('No value provided for variable ' + str);

			} else if (typeof value === 'function') {
				value = value(data);
			}
			return value;
		});
	},

	templateRe: /\{ *([\w_]+) *\}/g,

	isArray: Array.isArray || function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	},

	// minimal image URI, set to an image when disposing to flush memory
	emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
};

(function () {
	// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	function getPrefixed(name) {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	var lastTime = 0;

	// fallback for IE 7-8
	function timeoutDefer(fn) {
		var time = +new Date(),
		    timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;
		return window.setTimeout(fn, timeToCall);
	}

	var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer,
	    cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
	               getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };


	L.Util.requestAnimFrame = function (fn, context, immediate) {
		if (immediate && requestFn === timeoutDefer) {
			fn.call(context);
		} else {
			return requestFn.call(window, L.bind(fn, context));
		}
	};

	L.Util.cancelAnimFrame = function (id) {
		if (id) {
			cancelFn.call(window, id);
		}
	};
})();

// shortcuts for most used utility functions
L.extend = L.Util.extend;
L.bind = L.Util.bind;
L.stamp = L.Util.stamp;
L.setOptions = L.Util.setOptions;


/*
 * L.Class powers the OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */

L.Class = function () {};

L.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		if (this._initHooks.length) {
			this.callInitHooks();
		}
	};

	// jshint camelcase: false
	var parentProto = NewClass.__super__ = this.prototype;

	var proto = L.Util.create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		L.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		L.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = L.Util.extend(L.Util.create(proto.options), props.options);
	}

	// mix given properties into the prototype
	L.extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};


// method for adding properties to prototype
L.Class.include = function (props) {
	L.extend(this.prototype, props);
};

// merge new default options to the Class
L.Class.mergeOptions = function (options) {
	L.extend(this.prototype.options, options);
};

// add a constructor hook
L.Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
};


/*
 * L.Evented is a base class that Leaflet classes inherit from to handle custom events.
 */

L.Evented = L.Class.extend({

	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types = L.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	off: function (types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = L.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {

		var events = this._events = this._events || {},
		    contextId = context && context !== this && L.stamp(context);

		if (contextId) {
			// store listeners with custom context in a separate hash (if it has an id);
			// gives a major performance boost when firing and removing events (e.g. on map object)

			var indexKey = type + '_idx',
			    indexLenKey = type + '_len',
			    typeIndex = events[indexKey] = events[indexKey] || {},
			    id = L.stamp(fn) + '_' + contextId;

			if (!typeIndex[id]) {
				typeIndex[id] = {fn: fn, ctx: context};

				// keep track of the number of keys in the index to quickly check if it's empty
				events[indexLenKey] = (events[indexLenKey] || 0) + 1;
			}

		} else {
			// individual layers mostly use "this" for context and don't fire listeners too often
			// so simple array makes the memory footprint better while not degrading performance

			events[type] = events[type] || [];
			events[type].push({fn: fn});
		}
	},

	_off: function (type, fn, context) {
		var events = this._events,
		    indexKey = type + '_idx',
		    indexLenKey = type + '_len';

		if (!events) { return; }

		if (!fn) {
			// clear all listeners for a type if function isn't specified
			delete events[type];
			delete events[indexKey];
			delete events[indexLenKey];
			return;
		}

		var contextId = context && context !== this && L.stamp(context),
		    listeners, i, len, listener, id;

		if (contextId) {
			id = L.stamp(fn) + '_' + contextId;
			listeners = events[indexKey];

			if (listeners && listeners[id]) {
				listener = listeners[id];
				delete listeners[id];
				events[indexLenKey]--;
			}

		} else {
			listeners = events[type];

			if (listeners) {
				for (i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i].fn === fn) {
						listener = listeners[i];
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}

		// set the removed listener to noop so that's not called if remove happens in fire
		if (listener) {
			listener.fn = L.Util.falseFn;
		}
	},

	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = L.Util.extend({}, data, {type: type, target: this}),
		    events = this._events;

		if (events) {
		    var typeIndex = events[type + '_idx'],
		        i, len, listeners, id;

			if (events[type]) {
				// make sure adding/removing listeners inside other listeners won't cause infinite loop
				listeners = events[type].slice();

				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].fn.call(this, event);
				}
			}

			// fire event for the context-indexed listeners as well
			for (id in typeIndex) {
				typeIndex[id].fn.call(typeIndex[id].ctx, event);
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	listens: function (type, propagate) {
		var events = this._events;

		if (events && (events[type] || events[type + '_len'])) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	once: function (types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = L.bind(function () {
			this
			    .off(types, fn, context)
			    .off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this
		    .on(types, fn, context)
		    .on(types, handler, context);
	},

	// adds a parent to propagate events to (when you fire with true as a 3rd argument)
	addEventParent: function (obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[L.stamp(obj)] = obj;
		return this;
	},

	removeEventParent: function (obj) {
		if (this._eventParents) {
			delete this._eventParents[L.stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, L.extend({layer: e.target}, e), true);
		}
	}
});

var proto = L.Evented.prototype;

// aliases; we should ditch those eventually
proto.addEventListener = proto.on;
proto.removeEventListener = proto.clearAllEventListeners = proto.off;
proto.addOneTimeEventListener = proto.once;
proto.fireEvent = proto.fire;
proto.hasEventListeners = proto.listens;

L.Mixin = {Events: proto};


/*
 * L.Browser handles different browser and feature detections for internal Leaflet use.
 */

(function () {

	var ua = navigator.userAgent.toLowerCase(),
	    doc = document.documentElement,

	    ie = 'ActiveXObject' in window,

	    webkit    = ua.indexOf('webkit') !== -1,
	    phantomjs = ua.indexOf('phantom') !== -1,
	    android23 = ua.search('android [23]') !== -1,
	    chrome    = ua.indexOf('chrome') !== -1,

	    mobile = typeof orientation !== 'undefined',
	    msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
	    pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer,

	    ie3d = ie && ('transition' in doc.style),
	    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
	    gecko3d = 'MozPerspective' in doc.style,
	    opera3d = 'OTransition' in doc.style;


	var retina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;

	if (!retina && 'matchMedia' in window) {
		var matches = window.matchMedia('(min-resolution:144dpi)');
		retina = matches && matches.matches;
	}

	var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window ||
			(window.DocumentTouch && document instanceof window.DocumentTouch));

	L.Browser = {
		ie: ie,
		ielt9: ie && !document.addEventListener,
		webkit: webkit,
		gecko: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		android: ua.indexOf('android') !== -1,
		android23: android23,
		chrome: chrome,
		safari: !chrome && ua.indexOf('safari') !== -1,

		ie3d: ie3d,
		webkit3d: webkit3d,
		gecko3d: gecko3d,
		opera3d: opera3d,
		any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs,

		mobile: mobile,
		mobileWebkit: mobile && webkit,
		mobileWebkit3d: mobile && webkit3d,
		mobileOpera: mobile && window.opera,

		touch: !!touch,
		msPointer: !!msPointer,
		pointer: !!pointer,

		retina: !!retina
	};

}());


/*
 * L.Point represents a point with x and y coordinates.
 */

L.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

L.Point.prototype = {

	clone: function () {
		return new L.Point(this.x, this.y);
	},

	// non-destructive, returns a new point
	add: function (point) {
		return this.clone()._add(L.point(point));
	},

	// destructive, used directly for performance in situations where it's safe to modify existing point
	_add: function (point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	subtract: function (point) {
		return this.clone()._subtract(L.point(point));
	},

	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	divideBy: function (num) {
		return this.clone()._divideBy(num);
	},

	_divideBy: function (num) {
		this.x /= num;
		this.y /= num;
		return this;
	},

	multiplyBy: function (num) {
		return this.clone()._multiplyBy(num);
	},

	_multiplyBy: function (num) {
		this.x *= num;
		this.y *= num;
		return this;
	},

	round: function () {
		return this.clone()._round();
	},

	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	floor: function () {
		return this.clone()._floor();
	},

	_floor: function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},

	ceil: function () {
		return this.clone()._ceil();
	},

	_ceil: function () {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	},

	distanceTo: function (point) {
		point = L.point(point);

		var x = point.x - this.x,
		    y = point.y - this.y;

		return Math.sqrt(x * x + y * y);
	},

	equals: function (point) {
		point = L.point(point);

		return point.x === this.x &&
		       point.y === this.y;
	},

	contains: function (point) {
		point = L.point(point);

		return Math.abs(point.x) <= Math.abs(this.x) &&
		       Math.abs(point.y) <= Math.abs(this.y);
	},

	toString: function () {
		return 'Point(' +
		        L.Util.formatNum(this.x) + ', ' +
		        L.Util.formatNum(this.y) + ')';
	}
};

L.point = function (x, y, round) {
	if (x instanceof L.Point) {
		return x;
	}
	if (L.Util.isArray(x)) {
		return new L.Point(x[0], x[1]);
	}
	if (x === undefined || x === null) {
		return x;
	}
	return new L.Point(x, y, round);
};


/*
 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
 */

L.Bounds = function (a, b) { //(Point, Point) or Point[]
	if (!a) { return; }

	var points = b ? [a, b] : a;

	for (var i = 0, len = points.length; i < len; i++) {
		this.extend(points[i]);
	}
};

L.Bounds.prototype = {
	// extend the bounds to contain the given point
	extend: function (point) { // (Point)
		point = L.point(point);

		if (!this.min && !this.max) {
			this.min = point.clone();
			this.max = point.clone();
		} else {
			this.min.x = Math.min(point.x, this.min.x);
			this.max.x = Math.max(point.x, this.max.x);
			this.min.y = Math.min(point.y, this.min.y);
			this.max.y = Math.max(point.y, this.max.y);
		}
		return this;
	},

	getCenter: function (round) { // (Boolean) -> Point
		return new L.Point(
		        (this.min.x + this.max.x) / 2,
		        (this.min.y + this.max.y) / 2, round);
	},

	getBottomLeft: function () { // -> Point
		return new L.Point(this.min.x, this.max.y);
	},

	getTopRight: function () { // -> Point
		return new L.Point(this.max.x, this.min.y);
	},

	getSize: function () {
		return this.max.subtract(this.min);
	},

	contains: function (obj) { // (Bounds) or (Point) -> Boolean
		var min, max;

		if (typeof obj[0] === 'number' || obj instanceof L.Point) {
			obj = L.point(obj);
		} else {
			obj = L.bounds(obj);
		}

		if (obj instanceof L.Bounds) {
			min = obj.min;
			max = obj.max;
		} else {
			min = max = obj;
		}

		return (min.x >= this.min.x) &&
		       (max.x <= this.max.x) &&
		       (min.y >= this.min.y) &&
		       (max.y <= this.max.y);
	},

	intersects: function (bounds) { // (Bounds) -> Boolean
		bounds = L.bounds(bounds);

		var min = this.min,
		    max = this.max,
		    min2 = bounds.min,
		    max2 = bounds.max,
		    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
		    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

		return xIntersects && yIntersects;
	},

	isValid: function () {
		return !!(this.min && this.max);
	}
};

L.bounds = function (a, b) { // (Bounds) or (Point, Point) or (Point[])
	if (!a || a instanceof L.Bounds) {
		return a;
	}
	return new L.Bounds(a, b);
};


/*
 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
 */

L.Transformation = function (a, b, c, d) {
	this._a = a;
	this._b = b;
	this._c = c;
	this._d = d;
};

L.Transformation.prototype = {
	transform: function (point, scale) { // (Point, Number) -> Point
		return this._transform(point.clone(), scale);
	},

	// destructive transform (faster)
	_transform: function (point, scale) {
		scale = scale || 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	},

	untransform: function (point, scale) {
		scale = scale || 1;
		return new L.Point(
		        (point.x / scale - this._b) / this._a,
		        (point.y / scale - this._d) / this._c);
	}
};


/*
 * L.DomUtil contains various utility functions for working with DOM.
 */

L.DomUtil = {
	get: function (id) {
		return typeof id === 'string' ? document.getElementById(id) : id;
	},

	getStyle: function (el, style) {

		var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

		if ((!value || value === 'auto') && document.defaultView) {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}

		return value === 'auto' ? null : value;
	},

	create: function (tagName, className, container) {

		var el = document.createElement(tagName);
		el.className = className;

		if (container) {
			container.appendChild(el);
		}

		return el;
	},

	remove: function (el) {
		var parent = el.parentNode;
		if (parent) {
			parent.removeChild(el);
		}
	},

	empty: function (el) {
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
	},

	toFront: function (el) {
		el.parentNode.appendChild(el);
	},

	toBack: function (el) {
		var parent = el.parentNode;
		parent.insertBefore(el, parent.firstChild);
	},

	hasClass: function (el, name) {
		if (el.classList !== undefined) {
			return el.classList.contains(name);
		}
		var className = L.DomUtil.getClass(el);
		return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
	},

	addClass: function (el, name) {
		if (el.classList !== undefined) {
			var classes = L.Util.splitWords(name);
			for (var i = 0, len = classes.length; i < len; i++) {
				el.classList.add(classes[i]);
			}
		} else if (!L.DomUtil.hasClass(el, name)) {
			var className = L.DomUtil.getClass(el);
			L.DomUtil.setClass(el, (className ? className + ' ' : '') + name);
		}
	},

	removeClass: function (el, name) {
		if (el.classList !== undefined) {
			el.classList.remove(name);
		} else {
			L.DomUtil.setClass(el, L.Util.trim((' ' + L.DomUtil.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
		}
	},

	setClass: function (el, name) {
		if (el.className.baseVal === undefined) {
			el.className = name;
		} else {
			// in case of SVG element
			el.className.baseVal = name;
		}
	},

	getClass: function (el) {
		return el.className.baseVal === undefined ? el.className : el.className.baseVal;
	},

	setOpacity: function (el, value) {

		if ('opacity' in el.style) {
			el.style.opacity = value;

		} else if ('filter' in el.style) {

			var filter = false,
			    filterName = 'DXImageTransform.Microsoft.Alpha';

			// filters collection throws an error if we try to retrieve a filter that doesn't exist
			try {
				filter = el.filters.item(filterName);
			} catch (e) {
				// don't set opacity to 1 if we haven't already set an opacity,
				// it isn't needed and breaks transparent pngs.
				if (value === 1) { return; }
			}

			value = Math.round(value * 100);

			if (filter) {
				filter.Enabled = (value !== 100);
				filter.Opacity = value;
			} else {
				el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
			}
		}
	},

	testProp: function (props) {

		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	},

	setTransform: function (el, offset, scale) {
		var pos = offset || new L.Point(0, 0);

		el.style[L.DomUtil.TRANSFORM] =
			'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
	},

	setPosition: function (el, point, no3d) { // (HTMLElement, Point[, Boolean])

		// jshint camelcase: false
		el._leaflet_pos = point;

		if (L.Browser.any3d && !no3d) {
			L.DomUtil.setTransform(el, point);
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		// this method is only used for elements previously positioned using setPosition,
		// so it's safe to cache the position for performance

		// jshint camelcase: false
		return el._leaflet_pos;
	}
};


(function () {
	// prefix style property names

	L.DomUtil.TRANSFORM = L.DomUtil.testProp(
			['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);


	// webkitTransition comes first because some browser versions that drop vendor prefix don't do
	// the same for the transitionend event, in particular the Android 4.1 stock browser

	var transition = L.DomUtil.TRANSITION = L.DomUtil.testProp(
			['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

	L.DomUtil.TRANSITION_END =
			transition === 'webkitTransition' || transition === 'OTransition' ? transition + 'End' : 'transitionend';


	if ('onselectstart' in document) {
		L.DomUtil.disableTextSelection = function () {
			L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
		};
		L.DomUtil.enableTextSelection = function () {
			L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
		};

	} else {
		var userSelectProperty = L.DomUtil.testProp(
			['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

		L.DomUtil.disableTextSelection = function () {
			if (userSelectProperty) {
				var style = document.documentElement.style;
				this._userSelect = style[userSelectProperty];
				style[userSelectProperty] = 'none';
			}
		};
		L.DomUtil.enableTextSelection = function () {
			if (userSelectProperty) {
				document.documentElement.style[userSelectProperty] = this._userSelect;
				delete this._userSelect;
			}
		};
	}

	L.DomUtil.disableImageDrag = function () {
		L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
	};
	L.DomUtil.enableImageDrag = function () {
		L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
	};
})();


/*
 * L.LatLng represents a geographical point with latitude and longitude coordinates.
 */

L.LatLng = function (lat, lng, alt) {
	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	}

	this.lat = +lat;
	this.lng = +lng;

	if (alt !== undefined) {
		this.alt = +alt;
	}
};

L.LatLng.prototype = {
	equals: function (obj, maxMargin) {
		if (!obj) { return false; }

		obj = L.latLng(obj);

		var margin = Math.max(
		        Math.abs(this.lat - obj.lat),
		        Math.abs(this.lng - obj.lng));

		return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
	},

	toString: function (precision) {
		return 'LatLng(' +
		        L.Util.formatNum(this.lat, precision) + ', ' +
		        L.Util.formatNum(this.lng, precision) + ')';
	},

	distanceTo: function (other) {
		return L.CRS.Earth.distance(this, L.latLng(other));
	},

	wrap: function () {
		return L.CRS.Earth.wrapLatLng(this);
	}
};


// constructs LatLng with different signatures
// (LatLng) or ([Number, Number]) or (Number, Number) or (Object)

L.latLng = function (a, b) {
	if (a instanceof L.LatLng) {
		return a;
	}
	if (L.Util.isArray(a) && typeof a[0] !== 'object') {
		if (a.length === 3) {
			return new L.LatLng(a[0], a[1], a[2]);
		}
		return new L.LatLng(a[0], a[1]);
	}
	if (a === undefined || a === null) {
		return a;
	}
	if (typeof a === 'object' && 'lat' in a) {
		return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
	}
	if (b === undefined) {
		return null;
	}
	return new L.LatLng(a, b);
};



/*
 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

L.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
	if (!southWest) { return; }

	var latlngs = northEast ? [southWest, northEast] : southWest;

	for (var i = 0, len = latlngs.length; i < len; i++) {
		this.extend(latlngs[i]);
	}
};

L.LatLngBounds.prototype = {

	// extend the bounds to contain the given point or bounds
	extend: function (obj) { // (LatLng) or (LatLngBounds)
		var sw = this._southWest,
			ne = this._northEast,
			sw2, ne2;

		if (obj instanceof L.LatLng) {
			sw2 = obj;
			ne2 = obj;

		} else if (obj instanceof L.LatLngBounds) {
			sw2 = obj._southWest;
			ne2 = obj._northEast;

			if (!sw2 || !ne2) { return this; }

		} else {
			return obj ? this.extend(L.latLng(obj) || L.latLngBounds(obj)) : this;
		}

		if (!sw && !ne) {
			this._southWest = new L.LatLng(sw2.lat, sw2.lng);
			this._northEast = new L.LatLng(ne2.lat, ne2.lng);
		} else {
			sw.lat = Math.min(sw2.lat, sw.lat);
			sw.lng = Math.min(sw2.lng, sw.lng);
			ne.lat = Math.max(ne2.lat, ne.lat);
			ne.lng = Math.max(ne2.lng, ne.lng);
		}

		return this;
	},

	// extend the bounds by a percentage
	pad: function (bufferRatio) { // (Number) -> LatLngBounds
		var sw = this._southWest,
		    ne = this._northEast,
		    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
		    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

		return new L.LatLngBounds(
		        new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
		        new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
	},

	getCenter: function () { // -> LatLng
		return new L.LatLng(
		        (this._southWest.lat + this._northEast.lat) / 2,
		        (this._southWest.lng + this._northEast.lng) / 2);
	},

	getSouthWest: function () {
		return this._southWest;
	},

	getNorthEast: function () {
		return this._northEast;
	},

	getNorthWest: function () {
		return new L.LatLng(this.getNorth(), this.getWest());
	},

	getSouthEast: function () {
		return new L.LatLng(this.getSouth(), this.getEast());
	},

	getWest: function () {
		return this._southWest.lng;
	},

	getSouth: function () {
		return this._southWest.lat;
	},

	getEast: function () {
		return this._northEast.lng;
	},

	getNorth: function () {
		return this._northEast.lat;
	},

	contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
		if (typeof obj[0] === 'number' || obj instanceof L.LatLng) {
			obj = L.latLng(obj);
		} else {
			obj = L.latLngBounds(obj);
		}

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2, ne2;

		if (obj instanceof L.LatLngBounds) {
			sw2 = obj.getSouthWest();
			ne2 = obj.getNorthEast();
		} else {
			sw2 = ne2 = obj;
		}

		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	},

	intersects: function (bounds) { // (LatLngBounds)
		bounds = L.latLngBounds(bounds);

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2 = bounds.getSouthWest(),
		    ne2 = bounds.getNorthEast(),

		    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
		    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

		return latIntersects && lngIntersects;
	},

	toBBoxString: function () {
		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
	},

	equals: function (bounds) { // (LatLngBounds)
		if (!bounds) { return false; }

		bounds = L.latLngBounds(bounds);

		return this._southWest.equals(bounds.getSouthWest()) &&
		       this._northEast.equals(bounds.getNorthEast());
	},

	isValid: function () {
		return !!(this._southWest && this._northEast);
	}
};

//TODO International date line?

L.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
	if (!a || a instanceof L.LatLngBounds) {
		return a;
	}
	return new L.LatLngBounds(a, b);
};


/*
 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
 */

L.Projection = {};

L.Projection.LonLat = {
	project: function (latlng) {
		return new L.Point(latlng.lng, latlng.lat);
	},

	unproject: function (point) {
		return new L.LatLng(point.y, point.x);
	},

	bounds: L.bounds([-180, -90], [180, 90])
};


/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */

L.Projection.SphericalMercator = {

	R: 6378137,

	project: function (latlng) {
		var d = Math.PI / 180,
		    max = 1 - 1E-15,
		    sin = Math.max(Math.min(Math.sin(latlng.lat * d), max), -max);

		return new L.Point(
				this.R * latlng.lng * d,
				this.R * Math.log((1 + sin) / (1 - sin)) / 2);
	},

	unproject: function (point) {
		var d = 180 / Math.PI;

		return new L.LatLng(
			(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
			point.x * d / this.R);
	},

	bounds: (function () {
		var d = 6378137 * Math.PI;
		return L.bounds([-d, -d], [d, d]);
	})()
};


/*
 * L.CRS is the base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
 */

L.CRS = {
	// converts geo coords to pixel ones
	latLngToPoint: function (latlng, zoom) {
		var projectedPoint = this.projection.project(latlng),
		    scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	},

	// converts pixel coords to geo coords
	pointToLatLng: function (point, zoom) {
		var scale = this.scale(zoom),
		    untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	},

	// converts geo coords to projection-specific coords (e.g. in meters)
	project: function (latlng) {
		return this.projection.project(latlng);
	},

	// converts projected coords to geo coords
	unproject: function (point) {
		return this.projection.unproject(point);
	},

	// defines how the world scales with zoom
	scale: function (zoom) {
		return 256 * Math.pow(2, zoom);
	},

	// returns the bounds of the world in projected coords if applicable
	getProjectedBounds: function (zoom) {
		if (this.infinite) { return null; }

		var b = this.projection.bounds,
		    s = this.scale(zoom),
		    min = this.transformation.transform(b.min, s),
		    max = this.transformation.transform(b.max, s);

		return L.bounds(min, max);
	},

	// whether a coordinate axis wraps in a given range (e.g. longitude from -180 to 180); depends on CRS
	// wrapLng: [min, max],
	// wrapLat: [min, max],

	// if true, the coordinate space will be unbounded (infinite in all directions)
	// infinite: false,

	// wraps geo coords in certain ranges if applicable
	wrapLatLng: function (latlng) {
		var lng = this.wrapLng ? L.Util.wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
		    lat = this.wrapLat ? L.Util.wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat;

		return L.latLng(lat, lng);
	}
};


/*
 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
 */

L.CRS.Simple = L.extend({}, L.CRS, {
	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1, 0, -1, 0),

	scale: function (zoom) {
		return Math.pow(2, zoom);
	},

	distance: function (latlng1, latlng2) {
		var dx = latlng2.lng - latlng1.lng,
		    dy = latlng2.lat - latlng1.lat;

		return Math.sqrt(dx * dx + dy * dy);
	},

	infinite: true
});


/*
 * L.CRS.Earth is the base class for all CRS representing Earth.
 */

L.CRS.Earth = L.extend({}, L.CRS, {
	wrapLng: [-180, 180],

	R: 6378137,

	// distane between two geographical points using spherical law of cosines approximation
	distance: function (latlng1, latlng2) {
		var rad = Math.PI / 180,
		    lat1 = latlng1.lat * rad,
		    lat2 = latlng2.lat * rad,
		    a = Math.sin(lat1) * Math.sin(lat2) +
		        Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);

		return this.R * Math.acos(Math.min(a, 1));
	}
});


/*
 * L.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping and is used by Leaflet by default.
 */

L.CRS.EPSG3857 = L.extend({}, L.CRS.Earth, {
	code: 'EPSG:3857',
	projection: L.Projection.SphericalMercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * L.Projection.SphericalMercator.R);
		return new L.Transformation(scale, 0.5, -scale, 0.5);
	}())
});

L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, {
	code: 'EPSG:900913'
});


/*
 * L.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
 */

L.CRS.EPSG4326 = L.extend({}, L.CRS.Earth, {
	code: 'EPSG:4326',
	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1 / 180, 1, -1 / 180, 0.5)
});


/*
 * L.Map is the central class of the API - it is used to create a map.
 */

L.Map = L.Evented.extend({

	options: {
		crs: L.CRS.EPSG3857,

		/*
		center: LatLng,
		zoom: Number,
		layers: Array,
		*/

		fadeAnimation: true,
		trackResize: true,
		markerZoomAnimation: true
	},

	initialize: function (id, options) { // (HTMLElement or String, Object)
		options = L.setOptions(this, options);

		this._initContainer(id);
		this._initLayout();

		// hack for https://github.com/Leaflet/Leaflet/issues/1980
		this._onResize = L.bind(this._onResize, this);

		this._initEvents();

		if (options.maxBounds) {
			this.setMaxBounds(options.maxBounds);
		}

		if (options.zoom !== undefined) {
			this._zoom = this._limitZoom(options.zoom);
		}

		if (options.center && options.zoom !== undefined) {
			this.setView(L.latLng(options.center), options.zoom, {reset: true});
		}

		this._handlers = [];
		this._layers = {};
		this._zoomBoundLayers = {};

		this.callInitHooks();

		this._addLayers(this.options.layers);
	},


	// public methods that modify map state

	// replaced by animation-powered implementation in Map.PanAnimation.js
	setView: function (center, zoom) {
		zoom = zoom === undefined ? this.getZoom() : zoom;
		this._resetView(L.latLng(center), this._limitZoom(zoom));
		return this;
	},

	setZoom: function (zoom, options) {
		if (!this._loaded) {
			this._zoom = this._limitZoom(zoom);
			return this;
		}
		return this.setView(this.getCenter(), zoom, {zoom: options});
	},

	zoomIn: function (delta, options) {
		return this.setZoom(this._zoom + (delta || 1), options);
	},

	zoomOut: function (delta, options) {
		return this.setZoom(this._zoom - (delta || 1), options);
	},

	setZoomAround: function (latlng, zoom, options) {
		var scale = this.getZoomScale(zoom),
		    viewHalf = this.getSize().divideBy(2),
		    containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),

		    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
		    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

		return this.setView(newCenter, zoom, {zoom: options});
	},

	fitBounds: function (bounds, options) {

		options = options || {};
		bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

		var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
		    paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

		    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

		zoom = options.maxZoom ? Math.min(options.maxZoom, zoom) : zoom;

		var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

		    swPoint = this.project(bounds.getSouthWest(), zoom),
		    nePoint = this.project(bounds.getNorthEast(), zoom),
		    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

		return this.setView(center, zoom, options);
	},

	fitWorld: function (options) {
		return this.fitBounds([[-90, -180], [90, 180]], options);
	},

	panTo: function (center, options) { // (LatLng)
		return this.setView(center, this._zoom, {pan: options});
	},

	panBy: function (offset) { // (Point)
		// replaced with animated panBy in Map.PanAnimation.js
		this.fire('movestart');

		this._rawPanBy(L.point(offset));

		this.fire('move');
		return this.fire('moveend');
	},

	setMaxBounds: function (bounds) {
		bounds = L.latLngBounds(bounds);

		this.options.maxBounds = bounds;

		if (!bounds) {
			return this.off('moveend', this._panInsideMaxBounds);
		}

		if (this._loaded) {
			this._panInsideMaxBounds();
		}

		return this.on('moveend', this._panInsideMaxBounds);
	},

	panInsideBounds: function (bounds, options) {
		var center = this.getCenter(),
			newCenter = this._limitCenter(center, this._zoom, bounds);

		if (center.equals(newCenter)) { return this; }

		return this.panTo(newCenter, options);
	},

	invalidateSize: function (options) {
		if (!this._loaded) { return this; }

		options = L.extend({
			animate: false,
			pan: true
		}, options === true ? {animate: true} : options);

		var oldSize = this.getSize();
		this._sizeChanged = true;
		this._initialCenter = null;

		var newSize = this.getSize(),
		    oldCenter = oldSize.divideBy(2).round(),
		    newCenter = newSize.divideBy(2).round(),
		    offset = oldCenter.subtract(newCenter);

		if (!offset.x && !offset.y) { return this; }

		if (options.animate && options.pan) {
			this.panBy(offset);

		} else {
			if (options.pan) {
				this._rawPanBy(offset);
			}

			this.fire('move');

			if (options.debounceMoveend) {
				clearTimeout(this._sizeTimer);
				this._sizeTimer = setTimeout(L.bind(this.fire, this, 'moveend'), 200);
			} else {
				this.fire('moveend');
			}
		}

		return this.fire('resize', {
			oldSize: oldSize,
			newSize: newSize
		});
	},

	// TODO handler.addTo
	addHandler: function (name, HandlerClass) {
		if (!HandlerClass) { return this; }

		var handler = this[name] = new HandlerClass(this);

		this._handlers.push(handler);

		if (this.options[name]) {
			handler.enable();
		}

		return this;
	},

	remove: function () {

		this._initEvents('off');

		try {
			// throws error in IE6-8
			delete this._container._leaflet;
		} catch (e) {
			this._container._leaflet = undefined;
		}

		L.DomUtil.remove(this._mapPane);

		if (this._clearControlPos) {
			this._clearControlPos();
		}

		this._clearHandlers();

		if (this._loaded) {
			this.fire('unload');
		}

		return this;
	},

	createPane: function (name, container) {
		var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
		    pane = L.DomUtil.create('div', className, container || this._mapPane);

		if (name) {
			this._panes[name] = pane;
		}
		return pane;
	},


	// public methods for getting map state

	getCenter: function () { // (Boolean) -> LatLng
		this._checkIfLoaded();

		if (this._initialCenter && !this._moved()) {
			return this._initialCenter;
		}
		return this.layerPointToLatLng(this._getCenterLayerPoint());
	},

	getZoom: function () {
		return this._zoom;
	},

	getBounds: function () {
		var bounds = this.getPixelBounds(),
		    sw = this.unproject(bounds.getBottomLeft()),
		    ne = this.unproject(bounds.getTopRight());

		return new L.LatLngBounds(sw, ne);
	},

	getMinZoom: function () {
		return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
	},

	getMaxZoom: function () {
		return this.options.maxZoom === undefined ?
			(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
			this.options.maxZoom;
	},

	getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
		bounds = L.latLngBounds(bounds);

		var zoom = this.getMinZoom() - (inside ? 1 : 0),
		    maxZoom = this.getMaxZoom(),
		    size = this.getSize(),

		    nw = bounds.getNorthWest(),
		    se = bounds.getSouthEast(),

		    zoomNotFound = true,
		    boundsSize;

		padding = L.point(padding || [0, 0]);

		do {
			zoom++;
			boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding);
			zoomNotFound = !inside ? size.contains(boundsSize) : boundsSize.x < size.x || boundsSize.y < size.y;

		} while (zoomNotFound && zoom <= maxZoom);

		if (zoomNotFound && inside) {
			return null;
		}

		return inside ? zoom : zoom - 1;
	},

	getSize: function () {
		if (!this._size || this._sizeChanged) {
			this._size = new L.Point(
				this._container.clientWidth,
				this._container.clientHeight);

			this._sizeChanged = false;
		}
		return this._size.clone();
	},

	getPixelBounds: function () {
		var topLeftPoint = this._getTopLeftPoint();
		return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
	},

	getPixelOrigin: function () {
		this._checkIfLoaded();
		return this._initialTopLeftPoint;
	},

	getPixelWorldBounds: function () {
		return this.options.crs.getProjectedBounds(this.getZoom());
	},

	getPane: function (pane) {
		return typeof pane === 'string' ? this._panes[pane] : pane;
	},

	getPanes: function () {
		return this._panes;
	},

	getContainer: function () {
		return this._container;
	},


	// TODO replace with universal implementation after refactoring projections

	getZoomScale: function (toZoom) {
		var crs = this.options.crs;
		return crs.scale(toZoom) / crs.scale(this._zoom);
	},

	getScaleZoom: function (scale) {
		return this._zoom + (Math.log(scale) / Math.LN2);
	},


	// conversion methods

	project: function (latlng, zoom) { // (LatLng[, Number]) -> Point
		zoom = zoom === undefined ? this._zoom : zoom;
		return this.options.crs.latLngToPoint(L.latLng(latlng), zoom);
	},

	unproject: function (point, zoom) { // (Point[, Number]) -> LatLng
		zoom = zoom === undefined ? this._zoom : zoom;
		return this.options.crs.pointToLatLng(L.point(point), zoom);
	},

	layerPointToLatLng: function (point) { // (Point)
		var projectedPoint = L.point(point).add(this.getPixelOrigin());
		return this.unproject(projectedPoint);
	},

	latLngToLayerPoint: function (latlng) { // (LatLng)
		var projectedPoint = this.project(L.latLng(latlng))._round();
		return projectedPoint._subtract(this.getPixelOrigin());
	},

	wrapLatLng: function (latlng) {
		return this.options.crs.wrapLatLng(L.latLng(latlng));
	},

	distance: function (latlng1, latlng2) {
		return this.options.crs.distance(L.latLng(latlng1), L.latLng(latlng2));
	},

	containerPointToLayerPoint: function (point) { // (Point)
		return L.point(point).subtract(this._getMapPanePos());
	},

	layerPointToContainerPoint: function (point) { // (Point)
		return L.point(point).add(this._getMapPanePos());
	},

	containerPointToLatLng: function (point) {
		var layerPoint = this.containerPointToLayerPoint(L.point(point));
		return this.layerPointToLatLng(layerPoint);
	},

	latLngToContainerPoint: function (latlng) {
		return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));
	},

	mouseEventToContainerPoint: function (e) { // (MouseEvent)
		return L.DomEvent.getMousePosition(e, this._container);
	},

	mouseEventToLayerPoint: function (e) { // (MouseEvent)
		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
	},

	mouseEventToLatLng: function (e) { // (MouseEvent)
		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
	},


	// map initialization methods

	_initContainer: function (id) {
		var container = this._container = L.DomUtil.get(id);

		if (!container) {
			throw new Error('Map container not found.');
		} else if (container._leaflet) {
			throw new Error('Map container is already initialized.');
		}

		container._leaflet = true;
	},

	_initLayout: function () {
		var container = this._container;

		this._fadeAnimated = this.options.fadeAnimation && L.Browser.any3d;

		L.DomUtil.addClass(container, 'leaflet-container' +
			(L.Browser.touch ? ' leaflet-touch' : '') +
			(L.Browser.retina ? ' leaflet-retina' : '') +
			(L.Browser.ielt9 ? ' leaflet-oldie' : '') +
			(L.Browser.safari ? ' leaflet-safari' : '') +
			(this._fadeAnimated ? ' leaflet-fade-anim' : ''));

		var position = L.DomUtil.getStyle(container, 'position');

		if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
			container.style.position = 'relative';
		}

		this._initPanes();

		if (this._initControlPos) {
			this._initControlPos();
		}
	},

	_initPanes: function () {
		var panes = this._panes = {};

		this._mapPane = this.createPane('mapPane', this._container);

		this.createPane('tilePane');
		this.createPane('shadowPane');
		this.createPane('overlayPane');
		this.createPane('markerPane');
		this.createPane('popupPane');

		if (!this.options.markerZoomAnimation) {
			L.DomUtil.addClass(panes.markerPane, 'leaflet-zoom-hide');
			L.DomUtil.addClass(panes.shadowPane, 'leaflet-zoom-hide');
		}
	},


	// private methods that modify map state

	_resetView: function (center, zoom, preserveMapOffset, afterZoomAnim) {

		var zoomChanged = (this._zoom !== zoom);

		if (!afterZoomAnim) {
			this.fire('movestart');

			if (zoomChanged) {
				this.fire('zoomstart');
			}
		}

		this._zoom = zoom;
		this._initialCenter = center;

		this._initialTopLeftPoint = this._getNewTopLeftPoint(center);

		if (!preserveMapOffset) {
			L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
		} else {
			this._initialTopLeftPoint._add(this._getMapPanePos());
		}

		var loading = !this._loaded;
		this._loaded = true;

		this.fire('viewreset', {hard: !preserveMapOffset});

		if (loading) {
			this.fire('load');
		}

		this.fire('move');

		if (zoomChanged || afterZoomAnim) {
			this.fire('zoomend');
		}

		this.fire('moveend', {hard: !preserveMapOffset});
	},

	_rawPanBy: function (offset) {
		L.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
	},

	_getZoomSpan: function () {
		return this.getMaxZoom() - this.getMinZoom();
	},

	_panInsideMaxBounds: function () {
		this.panInsideBounds(this.options.maxBounds);
	},

	_checkIfLoaded: function () {
		if (!this._loaded) {
			throw new Error('Set map center and zoom first.');
		}
	},

	// map events

	_initEvents: function (onOff) {
		if (!L.DomEvent) { return; }

		onOff = onOff || 'on';

		L.DomEvent[onOff](this._container,
			'click dblclick mousedown mouseup mouseenter mouseleave mousemove contextmenu',
			this._handleMouseEvent, this);

		if (this.options.trackResize) {
			L.DomEvent[onOff](window, 'resize', this._onResize, this);
		}
	},

	_onResize: function () {
		L.Util.cancelAnimFrame(this._resizeRequest);
		this._resizeRequest = L.Util.requestAnimFrame(
		        function () { this.invalidateSize({debounceMoveend: true}); }, this, false, this._container);
	},

	_handleMouseEvent: function (e) {
		if (!this._loaded) { return; }

		this._fireMouseEvent(this, e,
				e.type === 'mouseenter' ? 'mouseover' :
				e.type === 'mouseleave' ? 'mouseout' : e.type);
	},

	_fireMouseEvent: function (obj, e, type, propagate, latlng) {
		type = type || e.type;

		if (L.DomEvent._skipped(e)) { return; }
		if (type === 'click') {
			var draggableObj = obj.options.draggable === true ? obj : this;
			if (!e._simulated && ((draggableObj.dragging && draggableObj.dragging.moved()) ||
			                      (this.boxZoom && this.boxZoom.moved()))) { return; }
			obj.fire('preclick');
		}

		if (!obj.listens(type, propagate)) { return; }

		if (type === 'contextmenu') {
			L.DomEvent.preventDefault(e);
		}
		if (type === 'click' || type === 'dblclick' || type === 'contextmenu') {
			L.DomEvent.stopPropagation(e);
		}

		var data = {
			originalEvent: e,
			containerPoint: this.mouseEventToContainerPoint(e)
		};

		data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
		data.latlng = latlng || this.layerPointToLatLng(data.layerPoint);

		obj.fire(type, data, propagate);
	},

	_clearHandlers: function () {
		for (var i = 0, len = this._handlers.length; i < len; i++) {
			this._handlers[i].disable();
		}
	},

	whenReady: function (callback, context) {
		if (this._loaded) {
			callback.call(context || this, {target: this});
		} else {
			this.on('load', callback, context);
		}
		return this;
	},


	// private methods for getting map state

	_getMapPanePos: function () {
		return L.DomUtil.getPosition(this._mapPane);
	},

	_moved: function () {
		var pos = this._getMapPanePos();
		return pos && !pos.equals([0, 0]);
	},

	_getTopLeftPoint: function () {
		return this.getPixelOrigin().subtract(this._getMapPanePos());
	},

	_getNewTopLeftPoint: function (center, zoom) {
		var viewHalf = this.getSize()._divideBy(2);
		// TODO round on display, not calculation to increase precision?
		return this.project(center, zoom)._subtract(viewHalf)._round();
	},

	_latLngToNewLayerPoint: function (latlng, newZoom, newCenter) {
		var topLeft = this._getNewTopLeftPoint(newCenter, newZoom).add(this._getMapPanePos());
		return this.project(latlng, newZoom)._subtract(topLeft);
	},

	// layer point of the current center
	_getCenterLayerPoint: function () {
		return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
	},

	// offset of the specified place to the current center in pixels
	_getCenterOffset: function (latlng) {
		return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
	},

	// adjust center for view to get inside bounds
	_limitCenter: function (center, zoom, bounds) {

		if (!bounds) { return center; }

		var centerPoint = this.project(center, zoom),
		    viewHalf = this.getSize().divideBy(2),
		    viewBounds = new L.Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
		    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

		return this.unproject(centerPoint.add(offset), zoom);
	},

	// adjust offset for view to get inside bounds
	_limitOffset: function (offset, bounds) {
		if (!bounds) { return offset; }

		var viewBounds = this.getPixelBounds(),
		    newBounds = new L.Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

		return offset.add(this._getBoundsOffset(newBounds, bounds));
	},

	// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
	_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
		var nwOffset = this.project(maxBounds.getNorthWest(), zoom).subtract(pxBounds.min),
		    seOffset = this.project(maxBounds.getSouthEast(), zoom).subtract(pxBounds.max),

		    dx = this._rebound(nwOffset.x, -seOffset.x),
		    dy = this._rebound(nwOffset.y, -seOffset.y);

		return new L.Point(dx, dy);
	},

	_rebound: function (left, right) {
		return left + right > 0 ?
			Math.round(left - right) / 2 :
			Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
	},

	_limitZoom: function (zoom) {
		var min = this.getMinZoom(),
		    max = this.getMaxZoom();

		return Math.max(min, Math.min(max, zoom));
	}
});

L.map = function (id, options) {
	return new L.Map(id, options);
};



L.Layer = L.Evented.extend({

	options: {
		pane: 'overlayPane'
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	remove: function () {
		return this.removeFrom(this._map || this._mapToAdd);
	},

	removeFrom: function (obj) {
		if (obj) {
			obj.removeLayer(this);
		}
		return this;
	},

	getPane: function (name) {
		return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
	},

	_layerAdd: function (e) {
		var map = e.target;

		// check in case layer gets added and then removed before the map is ready
		if (!map.hasLayer(this)) { return; }

		this._map = map;
		this._zoomAnimated = map._zoomAnimated;

		this.onAdd(map);

		if (this.getAttribution && this._map.attributionControl) {
			this._map.attributionControl.addAttribution(this.getAttribution());
		}

		if (this.getEvents) {
			map.on(this.getEvents(), this);
		}

		this.fire('add');
		map.fire('layeradd', {layer: this});
	}
});


L.Map.include({
	addLayer: function (layer) {
		console.log('addLayuer:', layer);
		var id = L.stamp(layer);
		if (this._layers[id]) { return layer; }
		this._layers[id] = layer;

		layer._mapToAdd = this;

		if (layer.beforeAdd) {
			layer.beforeAdd(this);
		}

		this.whenReady(layer._layerAdd, layer);

		return this;
	},

	removeLayer: function (layer) {
		var id = L.stamp(layer);

		if (!this._layers[id]) { return this; }

		if (this._loaded) {
			layer.onRemove(this);
		}

		if (layer.getAttribution && this.attributionControl) {
			this.attributionControl.removeAttribution(layer.getAttribution());
		}

		if (layer.getEvents) {
			this.off(layer.getEvents(), layer);
		}

		delete this._layers[id];

		if (this._loaded) {
			this.fire('layerremove', {layer: layer});
			layer.fire('remove');
		}

		layer._map = layer._mapToAdd = null;

		return this;
	},

	hasLayer: function (layer) {
		return !!layer && (L.stamp(layer) in this._layers);
	},

	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	_addLayers: function (layers) {
		layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

		for (var i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},

	_addZoomLimit: function (layer) {
		if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
			this._zoomBoundLayers[L.stamp(layer)] = layer;
			this._updateZoomLevels();
		}
	},

	_removeZoomLimit: function (layer) {
		var id = L.stamp(layer);

		if (this._zoomBoundLayers[id]) {
			delete this._zoomBoundLayers[id];
			this._updateZoomLevels();
		}
	},

	_updateZoomLevels: function () {
		var minZoom = Infinity,
			maxZoom = -Infinity,
			oldZoomSpan = this._getZoomSpan();

		for (var i in this._zoomBoundLayers) {
			var options = this._zoomBoundLayers[i].options;

			minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
			maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
		}

		this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
		this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

		if (oldZoomSpan !== this._getZoomSpan()) {
			this.fire('zoomlevelschange');
		}
	}
});


/*
 * Mercator projection that takes into account that the Earth is not a perfect sphere.
 * Less popular than spherical mercator; used by projections like EPSG:3395.
 */

L.Projection.Mercator = {
	R: 6378137,
	R_MINOR: 6356752.314245179,

	bounds: L.bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

	project: function (latlng) {
		var d = Math.PI / 180,
		    r = this.R,
		    y = latlng.lat * d,
		    tmp = this.R_MINOR / r,
		    e = Math.sqrt(1 - tmp * tmp),
		    con = e * Math.sin(y);

		var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
		y = -r * Math.log(Math.max(ts, 1E-10));

		return new L.Point(latlng.lng * d * r, y);
	},

	unproject: function (point) {
		var d = 180 / Math.PI,
		    r = this.R,
		    tmp = this.R_MINOR / r,
		    e = Math.sqrt(1 - tmp * tmp),
		    ts = Math.exp(-point.y / r),
		    phi = Math.PI / 2 - 2 * Math.atan(ts);

		for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
			con = e * Math.sin(phi);
			con = Math.pow((1 - con) / (1 + con), e / 2);
			dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
			phi += dphi;
		}

		return new L.LatLng(phi * d, point.x * d / r);
	}
};


/*
 * L.CRS.EPSG3857 (World Mercator) CRS implementation.
 */

L.CRS.EPSG3395 = L.extend({}, L.CRS.Earth, {
	code: 'EPSG:3395',
	projection: L.Projection.Mercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * L.Projection.Mercator.R);
		return new L.Transformation(scale, 0.5, -scale, 0.5);
	}())
});


/*
 * L.GridLayer is used as base class for grid-like layers like TileLayer.
 */

L.GridLayer = L.Layer.extend({

	options: {
		pane: 'tilePane',

		tileSize: 256,
		opacity: 1,

		unloadInvisibleTiles: L.Browser.mobile,
		updateWhenIdle: L.Browser.mobile,
		updateInterval: 150

		/*
		minZoom: <Number>,
		maxZoom: <Number>,
		attribution: <String>,
		zIndex: <Number>,
		bounds: <LatLngBounds>
		*/
	},

	initialize: function (options) {
		options = L.setOptions(this, options);
	},

	onAdd: function () {
		this._initContainer();

		if (!this.options.updateWhenIdle) {
			// update tiles on move, but not more often than once per given interval
			this._update = L.Util.throttle(this._update, this.options.updateInterval, this);
		}

		this._reset();
		this._update();
	},

	beforeAdd: function (map) {
		map._addZoomLimit(this);
	},

	onRemove: function (map) {
		this._clearBgBuffer();
		L.DomUtil.remove(this._container);

		map._removeZoomLimit(this);

		this._container = null;
	},

	bringToFront: function () {
		if (this._map) {
			L.DomUtil.toFront(this._container);
			this._setAutoZIndex(Math.max);
		}
		return this;
	},

	bringToBack: function () {
		if (this._map) {
			L.DomUtil.toBack(this._container);
			this._setAutoZIndex(Math.min);
		}
		return this;
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	getContainer: function () {
		return this._container;
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._map) {
			this._updateOpacity();
		}
		return this;
	},

	setZIndex: function (zIndex) {
		this.options.zIndex = zIndex;
		this._updateZIndex();

		return this;
	},

	redraw: function () {
		if (this._map) {
			this._reset({hard: true});
			this._update();
		}
		return this;
	},

	getEvents: function () {
		var events = {
			viewreset: this._reset,
			moveend: this._update
		};

		if (!this.options.updateWhenIdle) {
			events.move = this._update;
		}

		if (this._zoomAnimated) {
			events.zoomstart = this._startZoomAnim;
			events.zoomanim = this._animateZoom;
			events.zoomend = this._endZoomAnim;
		}

		return events;
	},

	_updateZIndex: function () {
		if (this._container && this.options.zIndex !== undefined) {
			this._container.style.zIndex = this.options.zIndex;
		}
	},

	_setAutoZIndex: function (compare) {
		// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

		var layers = this.getPane().children,
		    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

		for (var i = 0, len = layers.length, zIndex; i < len; i++) {

			zIndex = layers[i].style.zIndex;

			if (layers[i] !== this._container && zIndex) {
				edgeZIndex = compare(edgeZIndex, +zIndex);
			}
		}

		if (isFinite(edgeZIndex)) {
			this.options.zIndex = edgeZIndex + compare(-1, 1);
			this._updateZIndex();
		}
	},

	_updateOpacity: function () {
		var opacity = this.options.opacity;

		if (L.Browser.ielt9) {
			// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
			for (var i in this._tiles) {
				L.DomUtil.setOpacity(this._tiles[i], opacity);
			}
		} else {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	_initContainer: function () {
		if (this._container) { return; }

		this._container = L.DomUtil.create('div', 'leaflet-layer');
		this._updateZIndex();

		if (this._zoomAnimated) {
			var className = 'leaflet-tile-container leaflet-zoom-animated';

			this._bgBuffer = L.DomUtil.create('div', className, this._container);
			this._tileContainer = L.DomUtil.create('div', className, this._container);

			L.DomUtil.setTransform(this._tileContainer);

		} else {
			this._tileContainer = this._container;
		}

		if (this.options.opacity < 1) {
			this._updateOpacity();
		}

		this.getPane().appendChild(this._container);
	},

	_reset: function (e) {
		for (var key in this._tiles) {
			this.fire('tileunload', {
				tile: this._tiles[key]
			});
		}

		if (this._abortLoading) {
			this._abortLoading();
		}

		this._tiles = {};
		this._tilesToLoad = 0;
		this._tilesTotal = 0;

		L.DomUtil.empty(this._tileContainer);

		if (this._zoomAnimated && e && e.hard) {
			this._clearBgBuffer();
		}

		this._tileNumBounds = this._getTileNumBounds();
		this._resetWrap();
	},

	_resetWrap: function () {
		var map = this._map,
		    crs = map.options.crs;

		if (crs.infinite) { return; }

		var tileSize = this._getTileSize();

		if (crs.wrapLng) {
			this._wrapLng = [
				Math.floor(map.project([0, crs.wrapLng[0]]).x / tileSize),
				Math.ceil(map.project([0, crs.wrapLng[1]]).x / tileSize)
			];
		}

		if (crs.wrapLat) {
			this._wrapLat = [
				Math.floor(map.project([crs.wrapLat[0], 0]).y / tileSize),
				Math.ceil(map.project([crs.wrapLat[1], 0]).y / tileSize)
			];
		}
	},

	_getTileSize: function () {
		return this.options.tileSize;
	},

	_update: function () {

		if (!this._map) { return; }

		var bounds = this._map.getPixelBounds(),
		    zoom = this._map.getZoom(),
		    tileSize = this._getTileSize();

		if (zoom > this.options.maxZoom ||
		    zoom < this.options.minZoom) { 
			this._clearBgBuffer();
			return; 
		}

		// tile coordinates range for the current view
		var tileBounds = L.bounds(
			bounds.min.divideBy(tileSize).floor(),
			bounds.max.divideBy(tileSize).floor());

		this._addTiles(tileBounds);

		if (this.options.unloadInvisibleTiles) {
			this._removeOtherTiles(tileBounds);
		}
	},

	_addTiles: function (bounds) {
		var queue = [],
		    center = bounds.getCenter(),
		    zoom = this._map.getZoom();

		var j, i, coords;

		// create a queue of coordinates to load tiles from
		for (j = bounds.min.y; j <= bounds.max.y; j++) {
			for (i = bounds.min.x; i <= bounds.max.x; i++) {

				coords = new L.Point(i, j);
				coords.z = zoom;

				// add tile to queue if it's not in cache or out of bounds
				if (!(this._tileCoordsToKey(coords) in this._tiles) && this._isValidTile(coords)) {
					queue.push(coords);
				}
			}
		}

		var tilesToLoad = queue.length;

		if (tilesToLoad === 0) { return; }

		// if its the first batch of tiles to load
		if (!this._tilesToLoad) {
			this.fire('loading');
		}

		this._tilesToLoad += tilesToLoad;
		this._tilesTotal += tilesToLoad;

		// sort tile queue to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(center) - b.distanceTo(center);
		});

		// create DOM fragment to append tiles in one batch
		var fragment = document.createDocumentFragment();

		for (i = 0; i < tilesToLoad; i++) {
			this._addTile(queue[i], fragment);
		}

		this._tileContainer.appendChild(fragment);
	},

	_isValidTile: function (coords) {
		var crs = this._map.options.crs;

		if (!crs.infinite) {
			// don't load tile if it's out of bounds and not wrapped
			var bounds = this._tileNumBounds;
			if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
			    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
		}

		if (!this.options.bounds) { return true; }

		// don't load tile if it doesn't intersect the bounds in options
		var tileBounds = this._tileCoordsToBounds(coords);
		return L.latLngBounds(this.options.bounds).intersects(tileBounds);
	},

	// converts tile coordinates to its geographical bounds
	_tileCoordsToBounds: function (coords) {

		var map = this._map,
		    tileSize = this._getTileSize(),

		    nwPoint = coords.multiplyBy(tileSize),
		    sePoint = nwPoint.add([tileSize, tileSize]),

		    nw = map.wrapLatLng(map.unproject(nwPoint, coords.z)),
		    se = map.wrapLatLng(map.unproject(sePoint, coords.z));

		return new L.LatLngBounds(nw, se);
	},

	// converts tile coordinates to key for the tile cache
	_tileCoordsToKey: function (coords) {
		return coords.x + ':' + coords.y;
	},

	// converts tile cache key to coordinates
	_keyToTileCoords: function (key) {
		var kArr = key.split(':'),
		    x = parseInt(kArr[0], 10),
		    y = parseInt(kArr[1], 10);

		return new L.Point(x, y);
	},

	// remove any present tiles that are off the specified bounds
	_removeOtherTiles: function (bounds) {
		for (var key in this._tiles) {
			if (!bounds.contains(this._keyToTileCoords(key))) {
				this._removeTile(key);
			}
		}
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];

		L.DomUtil.remove(tile);

		delete this._tiles[key];

		this.fire('tileunload', {tile: tile});
	},

	_initTile: function (tile) {
		var size = this._getTileSize();

		L.DomUtil.addClass(tile, 'leaflet-tile');

		tile.style.width = size + 'px';
		tile.style.height = size + 'px';

		tile.onselectstart = L.Util.falseFn;
		tile.onmousemove = L.Util.falseFn;

		// update opacity on tiles in IE7-8 because of filter inheritance problems
		if (L.Browser.ielt9 && this.options.opacity < 1) {
			L.DomUtil.setOpacity(tile, this.options.opacity);
		}

		// without this hack, tiles disappear after zoom on Chrome for Android
		// https://github.com/Leaflet/Leaflet/issues/2078
		if (L.Browser.android && !L.Browser.android23) {
			tile.style.WebkitBackfaceVisibility = 'hidden';
		}
	},

	_addTile: function (coords, container) {
		var tilePos = this._getTilePos(coords);

		// wrap tile coords if necessary (depending on CRS)
		this._wrapCoords(coords);

		var tile = this.createTile(coords, L.bind(this._tileReady, this));

		this._initTile(tile);

		// if createTile is defined with a second argument ("done" callback),
		// we know that tile is async and will be ready later; otherwise
		if (this.createTile.length < 2) {
			// mark tile as ready, but delay one frame for opacity animation to happen
			setTimeout(L.bind(this._tileReady, this, null, tile), 0);
		}

		// we prefer top/left over translate3d so that we don't create a HW-accelerated layer from each tile
		// which is slow, and it also fixes gaps between tiles in Safari
		L.DomUtil.setPosition(tile, tilePos, true);

		// save tile in cache
		this._tiles[this._tileCoordsToKey(coords)] = tile;

		container.appendChild(tile);
		this.fire('tileloadstart', {tile: tile});
	},

	_tileReady: function (err, tile) {
		if (err) {
			this.fire('tileerror', {
				error: err,
				tile: tile
			});
		}

		L.DomUtil.addClass(tile, 'leaflet-tile-loaded');

		this.fire('tileload', {tile: tile});

		this._tilesToLoad--;

		if (this._tilesToLoad === 0) {
			this._visibleTilesReady();
		}
	},

	_visibleTilesReady: function () {
		this.fire('load');

		if (this._zoomAnimated) {
			// clear scaled tiles after all new tiles are loaded (for performance)
			clearTimeout(this._clearBgBufferTimer);
			this._clearBgBufferTimer = setTimeout(L.bind(this._clearBgBuffer, this), 300);
		}
	},

	_getTilePos: function (coords) {
		return coords
				.multiplyBy(this._getTileSize())
				.subtract(this._map.getPixelOrigin());
	},

	_wrapCoords: function (coords) {
		coords.x = this._wrapLng ? L.Util.wrapNum(coords.x, this._wrapLng) : coords.x;
		coords.y = this._wrapLat ? L.Util.wrapNum(coords.y, this._wrapLat) : coords.y;
	},

	// get the global tile coordinates range for the current zoom
	_getTileNumBounds: function () {
		var bounds = this._map.getPixelWorldBounds(),
			size = this._getTileSize();

		return bounds ? L.bounds(
				bounds.min.divideBy(size).floor(),
				bounds.max.divideBy(size).ceil().subtract([1, 1])) : null;
	},

	_startZoomAnim: function () {
		this._prepareBgBuffer();
		this._prevTranslate = this._translate || new L.Point(0, 0);
		this._prevScale = this._scale;
	},

	_animateZoom: function (e) {
		// avoid stacking transforms by calculating cumulating translate/scale sequence
		this._translate = this._prevTranslate.multiplyBy(e.scale).add(e.origin.multiplyBy(1 - e.scale));
		this._scale = this._prevScale * e.scale;

		L.DomUtil.setTransform(this._bgBuffer, this._translate, this._scale);
	},

	_endZoomAnim: function () {
		var front = this._tileContainer;
		front.style.visibility = '';
		L.DomUtil.toFront(front); // bring to front
	},

	_clearBgBuffer: function () {
		var map = this._map,
			bg = this._bgBuffer;

		if (map && !map._animatingZoom && !map.touchZoom._zooming && bg) {
			L.DomUtil.empty(bg);
			L.DomUtil.setTransform(bg);
		}
	},

	_prepareBgBuffer: function () {

		var front = this._tileContainer,
		    bg = this._bgBuffer;

		if (this._abortLoading) {
			this._abortLoading();
		}

		if (this._tilesToLoad / this._tilesTotal > 0.5) {
			// if foreground layer doesn't have many tiles loaded,
			// keep the existing bg layer and just zoom it some more
			front.style.visibility = 'hidden';
			return;
		}

		// prepare the buffer to become the front tile pane
		bg.style.visibility = 'hidden';
		L.DomUtil.setTransform(bg);

		// switch out the current layer to be the new bg layer (and vice-versa)
		this._tileContainer = bg;
		this._bgBuffer = front;

		// reset bg layer transform info
		this._translate = new L.Point(0, 0);
		this._scale = 1;

		// prevent bg buffer from clearing right after zoom
		clearTimeout(this._clearBgBufferTimer);
	}
});

L.gridLayer = function (options) {
	return new L.GridLayer(options);
};


/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */

L.TileLayer = L.GridLayer.extend({

	options: {
		minZoom: 0,
		maxZoom: 18,

		subdomains: 'abc',
		// errorTileUrl: '',
		zoomOffset: 0

		/*
		maxNativeZoom: <Number>,
		tms: <Boolean>,
		zoomReverse: <Number>,
		detectRetina: <Boolean>,
		crossOrigin: <Boolean>,
		*/
	},

	initialize: function (url, options) {

		this._url = url;

		options = L.setOptions(this, options);

		// detecting retina displays, adjusting tileSize and zoom levels
		if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

			options.tileSize = Math.floor(options.tileSize / 2);
			options.zoomOffset++;

			options.minZoom = Math.max(0, options.minZoom);
			options.maxZoom--;
		}

		if (typeof options.subdomains === 'string') {
			options.subdomains = options.subdomains.split('');
		}
	},

	setUrl: function (url, noRedraw) {
		this._url = url;

		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},

	createTile: function (coords, done) {
		var tile = document.createElement('img');

		tile.onload = L.bind(this._tileOnLoad, this, done, tile);
		tile.onerror = L.bind(this._tileOnError, this, done, tile);
		
		if (this.options.crossOrigin) {
			tile.crossOrigin = '';
		}
		
		/*
		 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
		 http://www.w3.org/TR/WCAG20-TECHS/H67
		*/
		tile.alt = '';

		tile.src = this.getTileUrl(coords);

		return tile;
	},

	getTileUrl: function (coords) {
		return L.Util.template(this._url, L.extend({
			r: this.options.detectRetina && L.Browser.retina && this.options.maxZoom > 0 ? '@2x' : '',
			s: this._getSubdomain(coords),
			x: coords.x,
			y: this.options.tms ? this._tileNumBounds.max.y - coords.y : coords.y,
			z: this._getZoomForUrl()
		}, this.options));
	},

	_tileOnLoad: function (done, tile) {
		done(null, tile);
	},

	_tileOnError: function (done, tile, e) {
		var errorUrl = this.options.errorTileUrl;
		if (errorUrl) {
			tile.src = errorUrl;
		}
		done(e, tile);
	},

	_getTileSize: function () {
		var map = this._map,
		    options = this.options,
		    zoom = map.getZoom() + options.zoomOffset,
		    zoomN = options.maxNativeZoom;

		// increase tile size when overscaling
		return zoomN && zoom > zoomN ?
				Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * options.tileSize) :
				options.tileSize;
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];

		L.GridLayer.prototype._removeTile.call(this, key);

		// for https://github.com/Leaflet/Leaflet/issues/137
		if (!L.Browser.android) {
			tile.onload = null;
			tile.src = L.Util.emptyImageUrl;
		}
	},

	_getZoomForUrl: function () {

		var options = this.options,
		    zoom = this._map.getZoom();

		if (options.zoomReverse) {
			zoom = options.maxZoom - zoom;
		}

		zoom += options.zoomOffset;

		return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
	},

	_getSubdomain: function (tilePoint) {
		var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
		return this.options.subdomains[index];
	},

	// stops loading all tiles in the background layer
	_abortLoading: function () {
		var i, tile;
		for (i in this._tiles) {
			tile = this._tiles[i];

			tile.onload = L.Util.falseFn;
			tile.onerror = L.Util.falseFn;

			if (!tile.complete) {
				tile.src = L.Util.emptyImageUrl;
				L.DomUtil.remove(tile);
			}
		}
	}
});

L.tileLayer = function (url, options) {
	return new L.TileLayer(url, options);
};


/*
 * L.TileLayer.WMS is used for WMS tile layers.
 */

L.TileLayer.WMS = L.TileLayer.extend({

	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',
		version: '1.1.1',
		layers: '',
		styles: '',
		format: 'image/jpeg',
		transparent: false
	},

	initialize: function (url, options) {

		this._url = url;

		var wmsParams = L.extend({}, this.defaultWmsParams);

		// all keys that are not TileLayer options go to WMS params
		for (var i in options) {
			if (!this.options.hasOwnProperty(i) &&
					i !== 'crs' &&
					i !== 'uppercase') {
				wmsParams[i] = options[i];
			}
		}

		options = L.setOptions(this, options);

		wmsParams.width = wmsParams.height =
				options.tileSize * (options.detectRetina && L.Browser.retina ? 2 : 1);

		this.wmsParams = wmsParams;
	},

	onAdd: function (map) {

		this._crs = this.options.crs || map.options.crs;
		this._uppercase = this.options.uppercase || false;

		this._wmsVersion = parseFloat(this.wmsParams.version);

		var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = this._crs.code;

		L.TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl: function (coords) {

		var tileBounds = this._tileCoordsToBounds(coords),
		    nw = this._crs.project(tileBounds.getNorthWest()),
		    se = this._crs.project(tileBounds.getSouthEast()),

		    bbox = (this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
			    [se.y, nw.x, nw.y, se.x] :
			    [nw.x, se.y, se.x, nw.y]).join(','),

		    url = L.TileLayer.prototype.getTileUrl.call(this, coords);

		return url +
			L.Util.getParamString(this.wmsParams, url, this._uppercase) +
			(this._uppercase ? '&BBOX=' : '&bbox=') + bbox;
	},

	setParams: function (params, noRedraw) {

		L.extend(this.wmsParams, params);

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	}
});

L.tileLayer.wms = function (url, options) {
	return new L.TileLayer.WMS(url, options);
};


/*
 * L.ImageOverlay is used to overlay images over the map (to specific geographical bounds).
 */

L.ImageOverlay = L.Layer.extend({

	options: {
		opacity: 1,
		alt: ''
	},

	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
		this._url = url;
		this._bounds = L.latLngBounds(bounds);

		L.setOptions(this, options);
	},

	onAdd: function () {
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

		this.getPane().appendChild(this._image);

		this._reset();
	},

	onRemove: function () {
		L.DomUtil.remove(this._image);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._image) {
			this._updateOpacity();
		}
		return this;
	},

	bringToFront: function () {
		if (this._map) {
			L.DomUtil.toFront(this._image);
		}
		return this;
	},

	bringToBack: function () {
		if (this._map) {
			L.DomUtil.toBack(this._image);
		}
		return this;
	},

	setUrl: function (url) {
		this._url = url;

		if (this._image) {
			this._image.src = url;
		}
		return this;
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	getEvents: function () {
		var events = {
			viewreset: this._reset
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},
	
	getBounds: function() {
		return this._bounds;
	},

	_initImage: function () {
		var img = this._image = L.DomUtil.create('img',
				'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

		img.onselectstart = L.Util.falseFn;
		img.onmousemove = L.Util.falseFn;

		img.onload = L.bind(this.fire, this, 'load');
		img.src = this._url;
		img.alt = this.options.alt;
	},

	_animateZoom: function (e) {
		var topLeft = this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
		    size = this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center).subtract(topLeft),
		    offset = topLeft.add(size._multiplyBy((1 - 1 / e.scale) / 2));

		L.DomUtil.setTransform(this._image, offset, e.scale);
	},

	_reset: function () {
		var image = this._image,
		    bounds = new L.Bounds(
		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		L.DomUtil.setPosition(image, bounds.min);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	}
});

L.imageOverlay = function (url, bounds, options) {
	return new L.ImageOverlay(url, bounds, options);
};


/*
 * L.Icon is an image-based icon class that you can use with L.Marker for custom markers.
 */

L.Icon = L.Class.extend({
	/*
	options: {
		iconUrl: (String) (required)
		iconRetinaUrl: (String) (optional, used for retina devices if detected)
		iconSize: (Point) (can be set through CSS)
		iconAnchor: (Point) (centered by default, can be set in CSS with negative margins)
		popupAnchor: (Point) (if not specified, popup opens in the anchor point)
		shadowUrl: (String) (no shadow by default)
		shadowRetinaUrl: (String) (optional, used for retina devices if detected)
		shadowSize: (Point)
		shadowAnchor: (Point)
		className: (String)
	},
	*/

	initialize: function (options) {
		L.setOptions(this, options);
	},

	createIcon: function (oldIcon) {
		return this._createIcon('icon', oldIcon);
	},

	createShadow: function (oldIcon) {
		return this._createIcon('shadow', oldIcon);
	},

	_createIcon: function (name, oldIcon) {
		var src = this._getIconUrl(name);

		if (!src) {
			if (name === 'icon') {
				throw new Error('iconUrl not set in Icon options (see the docs).');
			}
			return null;
		}

		var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
		this._setIconStyles(img, name);

		return img;
	},

	_setIconStyles: function (img, name) {
		var options = this.options,
		    size = L.point(options[name + 'Size']),
		    anchor = L.point(name === 'shadow' && options.shadowAnchor || options.iconAnchor ||
		            size && size.divideBy(2, true));

		img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

		if (anchor) {
			img.style.marginLeft = (-anchor.x) + 'px';
			img.style.marginTop  = (-anchor.y) + 'px';
		}

		if (size) {
			img.style.width  = size.x + 'px';
			img.style.height = size.y + 'px';
		}
	},

	_createImg: function (src, el) {
		el = el || document.createElement('img');
		el.src = src;
		return el;
	},

	_getIconUrl: function (name) {
		return L.Browser.retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
	}
});

L.icon = function (options) {
	return new L.Icon(options);
};


/*
 * L.Icon.Default is the blue marker icon used by default in Leaflet.
 */

L.Icon.Default = L.Icon.extend({

	options: {
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		shadowSize:  [41, 41]
	},

	_getIconUrl: function (name) {
		var key = name + 'Url';

		if (this.options[key]) {
			return this.options[key];
		}

		var path = L.Icon.Default.imagePath;

		if (!path) {
			throw new Error('Couldn\'t autodetect L.Icon.Default.imagePath, set it manually.');
		}

		return path + '/marker-' + name + (L.Browser.retina && name === 'icon' ? '-2x' : '') + '.png';
	}
});

L.Icon.Default.imagePath = (function () {
	var scripts = document.getElementsByTagName('script'),
	    leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;

	var i, len, src, path;

	for (i = 0, len = scripts.length; i < len; i++) {
		src = scripts[i].src;

		if (src.match(leafletRe)) {
			path = src.split(leafletRe)[0];
			return (path ? path + '/' : '') + 'images';
		}
	}
}());


/*
 * L.Marker is used to display clickable/draggable icons on the map.
 */

L.Marker = L.Layer.extend({

	options: {
		pane: 'markerPane',

		icon: new L.Icon.Default(),
		// title: '',
		// alt: '',
		interactive: true,
		// draggable: false,
		keyboard: true,
		zIndexOffset: 0,
		opacity: 1,
		// riseOnHover: false,
		riseOffset: 250
	},

	initialize: function (latlng, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
	},

	onAdd: function (map) {
		this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

		this._initIcon();
		this.update();
	},

	onRemove: function () {
		if (this.dragging) {
			this.dragging.disable();
		}

		this._removeIcon();
		this._removeShadow();
	},

	getEvents: function () {
		var events = {viewreset: this.update};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	getLatLng: function () {
		return this._latlng;
	},

	setLatLng: function (latlng) {
		var oldLatLng = this._latlng;
		this._latlng = L.latLng(latlng);
		this.update();
		return this.fire('move', { oldLatLng: oldLatLng, latlng: this._latlng });
	},

	setZIndexOffset: function (offset) {
		this.options.zIndexOffset = offset;
		return this.update();
	},

	setIcon: function (icon) {

		this.options.icon = icon;

		if (this._map) {
			this._initIcon();
			this.update();
		}

		if (this._popup) {
			this.bindPopup(this._popup, this._popup.options);
		}

		return this;
	},

	update: function () {

		if (this._icon) {
			var pos = this._map.latLngToLayerPoint(this._latlng).round();
			this._setPos(pos);
		}

		return this;
	},

	_initIcon: function () {
		var options = this.options,
		    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

		var icon = options.icon.createIcon(this._icon),
			addIcon = false;

		// if we're not reusing the icon, remove the old one and init new one
		if (icon !== this._icon) {
			if (this._icon) {
				this._removeIcon();
			}
			addIcon = true;

			if (options.title) {
				icon.title = options.title;
			}
			if (options.alt) {
				icon.alt = options.alt;
			}
		}

		L.DomUtil.addClass(icon, classToAdd);

		if (options.keyboard) {
			icon.tabIndex = '0';
		}

		this._icon = icon;
		this._initInteraction();

		if (options.riseOnHover) {
			L.DomEvent.on(icon, {
				mouseover: this._bringToFront,
				mouseout: this._resetZIndex
			}, this);
		}

		var newShadow = options.icon.createShadow(this._shadow),
			addShadow = false;

		if (newShadow !== this._shadow) {
			this._removeShadow();
			addShadow = true;
		}

		if (newShadow) {
			L.DomUtil.addClass(newShadow, classToAdd);
		}
		this._shadow = newShadow;


		if (options.opacity < 1) {
			this._updateOpacity();
		}


		if (addIcon) {
			this.getPane().appendChild(this._icon);
		}
		if (newShadow && addShadow) {
			this.getPane('shadowPane').appendChild(this._shadow);
		}
	},

	_removeIcon: function () {
		if (this.options.riseOnHover) {
			L.DomEvent.off(this._icon, {
				mouseover: this._bringToFront,
			    mouseout: this._resetZIndex
			}, this);
		}

		L.DomUtil.remove(this._icon);

		this._icon = null;
	},

	_removeShadow: function () {
		if (this._shadow) {
			L.DomUtil.remove(this._shadow);
		}
		this._shadow = null;
	},

	_setPos: function (pos) {
		L.DomUtil.setPosition(this._icon, pos);

		if (this._shadow) {
			L.DomUtil.setPosition(this._shadow, pos);
		}

		this._zIndex = pos.y + this.options.zIndexOffset;

		this._resetZIndex();
	},

	_updateZIndex: function (offset) {
		this._icon.style.zIndex = this._zIndex + offset;
	},

	_animateZoom: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

		this._setPos(pos);
	},

	_initInteraction: function () {

		if (!this.options.interactive) { return; }

		L.DomUtil.addClass(this._icon, 'leaflet-interactive');

		L.DomEvent.on(this._icon, 'click dblclick mousedown mouseup mouseover mousemove mouseout contextmenu keypress',
				this._fireMouseEvent, this);

		if (L.Handler.MarkerDrag) {
			if (this.dragging) {
				this.dragging.disable();
			}
			
			this.dragging = new L.Handler.MarkerDrag(this);

			if (this.options.draggable) {
				this.dragging.enable();
			}
		}
	},

	_fireMouseEvent: function (e, type) {
		// to prevent outline when clicking on keyboard-focusable marker
		if (e.type === 'mousedown') {
			L.DomEvent.preventDefault(e);
		}

		if (e.type === 'keypress' && e.keyCode === 13) {
			type = 'click';
		}

		if (this._map) {
			this._map._fireMouseEvent(this, e, type, true, this._latlng);
		}
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		if (this._map) {
			this._updateOpacity();
		}

		return this;
	},

	_updateOpacity: function () {
		var opacity = this.options.opacity;

		L.DomUtil.setOpacity(this._icon, opacity);

		if (this._shadow) {
			L.DomUtil.setOpacity(this._shadow, opacity);
		}
	},

	_bringToFront: function () {
		this._updateZIndex(this.options.riseOffset);
	},

	_resetZIndex: function () {
		this._updateZIndex(0);
	}
});

L.marker = function (latlng, options) {
	return new L.Marker(latlng, options);
};


/*
 * L.DivIcon is a lightweight HTML-based icon class (as opposed to the image-based L.Icon)
 * to use with L.Marker.
 */

L.DivIcon = L.Icon.extend({
	options: {
		iconSize: [12, 12], // also can be set through CSS
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		html: (String)
		bgPos: (Point)
		*/
		className: 'leaflet-div-icon',
		html: false
	},

	createIcon: function (oldIcon) {
		var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
		    options = this.options;

		div.innerHTML = options.html !== false ? options.html : '';

		if (options.bgPos) {
			div.style.backgroundPosition = (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
		}
		this._setIconStyles(div, 'icon');

		return div;
	},

	createShadow: function () {
		return null;
	}
});

L.divIcon = function (options) {
	return new L.DivIcon(options);
};


/*
 * L.Popup is used for displaying popups on the map.
 */

L.Map.mergeOptions({
	closePopupOnClick: true
});

L.Popup = L.Layer.extend({

	options: {
		pane: 'popupPane',

		minWidth: 50,
		maxWidth: 300,
		// maxHeight: <Number>,
		offset: [0, 7],

		autoPan: true,
		autoPanPadding: [5, 5],
		// autoPanPaddingTopLeft: <Point>,
		// autoPanPaddingBottomRight: <Point>,

		closeButton: true,
		// keepInView: false,
		// className: '',
		zoomAnimation: true
	},

	initialize: function (options, source) {
		L.setOptions(this, options);

		this._source = source;
	},

	onAdd: function (map) {
		this._zoomAnimated = this._zoomAnimated && this.options.zoomAnimation;

		if (!this._container) {
			this._initLayout();
		}

		if (map._fadeAnimated) {
			L.DomUtil.setOpacity(this._container, 0);
		}

		clearTimeout(this._removeTimeout);
		this.getPane().appendChild(this._container);
		this.update();

		if (map._fadeAnimated) {
			L.DomUtil.setOpacity(this._container, 1);
		}

		map.fire('popupopen', {popup: this});

		if (this._source) {
			this._source.fire('popupopen', {popup: this}, true);
		}
	},

	openOn: function (map) {
		map.openPopup(this);
		return this;
	},

	onRemove: function (map) {
		if (map._fadeAnimated) {
			L.DomUtil.setOpacity(this._container, 0);
			this._removeTimeout = setTimeout(L.bind(L.DomUtil.remove, L.DomUtil, this._container), 200);
		} else {
			L.DomUtil.remove(this._container);
		}

		map.fire('popupclose', {popup: this});

		if (this._source) {
			this._source.fire('popupclose', {popup: this}, true);
		}
	},

	getLatLng: function () {
		return this._latlng;
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		if (this._map) {
			this._updatePosition();
			this._adjustPan();
		}
		return this;
	},

	getContent: function () {
		return this._content;
	},

	setContent: function (content) {
		this._content = content;
		this.update();
		return this;
	},

	update: function () {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	getEvents: function () {
		var events = {viewreset: this._updatePosition},
		    options = this.options;

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}
		if ('closeOnClick' in options ? options.closeOnClick : this._map.options.closePopupOnClick) {
			events.preclick = this._close;
		}
		if (options.keepInView) {
			events.moveend = this._adjustPan;
		}
		return events;
	},
	
	isOpen: function () {
		return !!this._map && this._map.hasLayer(this);
	},

	_close: function () {
		if (this._map) {
			this._map.closePopup(this);
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-popup',
		    container = this._container = L.DomUtil.create('div',
			prefix + ' ' + (this.options.className || '') +
			' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide'));

		if (this.options.closeButton) {
			var closeButton = this._closeButton = L.DomUtil.create('a', prefix + '-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';

			L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
		}

		var wrapper = this._wrapper = L.DomUtil.create('div', prefix + '-content-wrapper', container);
		this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);

		L.DomEvent
			.disableClickPropagation(wrapper)
			.disableScrollPropagation(this._contentNode)
			.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

		this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
		this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
	},

	_updateContent: function () {
		if (!this._content) { return; }

		var node = this._contentNode;

		if (typeof this._content === 'string') {
			node.innerHTML = this._content;
		} else {
			while (node.hasChildNodes()) {
				node.removeChild(node.firstChild);
			}
			node.appendChild(this._content);
		}
		this.fire('contentupdate');
	},

	_updateLayout: function () {
		var container = this._contentNode,
		    style = container.style;

		style.width = '';
		style.whiteSpace = 'nowrap';

		var width = container.offsetWidth;
		width = Math.min(width, this.options.maxWidth);
		width = Math.max(width, this.options.minWidth);

		style.width = (width + 1) + 'px';
		style.whiteSpace = '';

		style.height = '';

		var height = container.offsetHeight,
		    maxHeight = this.options.maxHeight,
		    scrolledClass = 'leaflet-popup-scrolled';

		if (maxHeight && height > maxHeight) {
			style.height = maxHeight + 'px';
			L.DomUtil.addClass(container, scrolledClass);
		} else {
			L.DomUtil.removeClass(container, scrolledClass);
		}

		this._containerWidth = this._container.offsetWidth;
	},

	_updatePosition: function () {
		if (!this._map) { return; }

		var pos = this._map.latLngToLayerPoint(this._latlng),
		    offset = L.point(this.options.offset);

		if (this._zoomAnimated) {
			L.DomUtil.setPosition(this._container, pos);
		} else {
			offset = offset.add(pos);
		}

		var bottom = this._containerBottom = -offset.y,
		    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		// bottom position the popup in case the height of the popup changes (images loading etc)
		this._container.style.bottom = bottom + 'px';
		this._container.style.left = left + 'px';
	},

	_animateZoom: function (e) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
		L.DomUtil.setPosition(this._container, pos);
	},

	_adjustPan: function () {
		if (!this.options.autoPan) { return; }

		var map = this._map,
		    containerHeight = this._container.offsetHeight,
		    containerWidth = this._containerWidth,
		    layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);

		if (this._zoomAnimated) {
			layerPos._add(L.DomUtil.getPosition(this._container));
		}

		var containerPos = map.layerPointToContainerPoint(layerPos),
		    padding = L.point(this.options.autoPanPadding),
		    paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
		    paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
		    size = map.getSize(),
		    dx = 0,
		    dy = 0;

		if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
			dx = containerPos.x + containerWidth - size.x + paddingBR.x;
		}
		if (containerPos.x - dx - paddingTL.x < 0) { // left
			dx = containerPos.x - paddingTL.x;
		}
		if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
			dy = containerPos.y + containerHeight - size.y + paddingBR.y;
		}
		if (containerPos.y - dy - paddingTL.y < 0) { // top
			dy = containerPos.y - paddingTL.y;
		}

		if (dx || dy) {
			map
			    .fire('autopanstart')
			    .panBy([dx, dy]);
		}
	},

	_onCloseButtonClick: function (e) {
		this._close();
		L.DomEvent.stop(e);
	}
});

L.popup = function (options, source) {
	return new L.Popup(options, source);
};


L.Map.include({
	openPopup: function (popup, latlng, options) { // (Popup) or (String || HTMLElement, LatLng[, Object])
		if (!(popup instanceof L.Popup)) {
			var content = popup;

			popup = new L.Popup(options).setContent(content);
		}

		if (latlng) {
			popup.setLatLng(latlng);
		}

		if (this.hasLayer(popup)) {
			return this;
		}

		this.closePopup();
		this._popup = popup;
		return this.addLayer(popup);
	},

	closePopup: function (popup) {
		if (!popup || popup === this._popup) {
			popup = this._popup;
			this._popup = null;
		}
		if (popup) {
			this.removeLayer(popup);
		}
		return this;
	}
});


/*
 * Adds popup-related methods to all layers.
 */

L.Layer.include({

	bindPopup: function (content, options) {

		if (content instanceof L.Popup) {
			this._popup = content;
			content._source = this;
		} else {
			if (!this._popup || options) {
				this._popup = new L.Popup(options, this);
			}
			this._popup.setContent(content);
		}

		if (!this._popupHandlersAdded) {
			this.on({
				click: this._openPopup,
				remove: this.closePopup,
				move: this._movePopup
			});
			this._popupHandlersAdded = true;
		}

		return this;
	},

	unbindPopup: function () {
		if (this._popup) {
			this.on({
			    click: this._openPopup,
			    remove: this.closePopup,
			    move: this._movePopup
			});
			this._popupHandlersAdded = false;
			this._popup = null;
		}
		return this;
	},

	openPopup: function (latlng) {
		if (this._popup && this._map) {
			this._map.openPopup(this._popup, latlng || this._latlng || this.getCenter());
		}
		return this;
	},

	closePopup: function () {
		if (this._popup) {
			this._popup._close();
		}
		return this;
	},

	togglePopup: function () {
		if (this._popup) {
			if (this._popup._map) {
				this.closePopup();
			} else {
				this.openPopup();
			}
		}
		return this;
	},

	setPopupContent: function (content) {
		if (this._popup) {
			this._popup.setContent(content);
		}
		return this;
	},

	getPopup: function () {
		return this._popup;
	},

	_openPopup: function (e) {
		this._map.openPopup(this._popup, e.latlng);
	},

	_movePopup: function (e) {
		this._popup.setLatLng(e.latlng);
	}
});


/*
 * Popup extension to L.Marker, adding popup-related methods.
 */

L.Marker.include({
	bindPopup: function (content, options) {
		var anchor = L.point(this.options.icon.options.popupAnchor || [0, 0])
			.add(L.Popup.prototype.options.offset);

		options = L.extend({offset: anchor}, options);

		return L.Layer.prototype.bindPopup.call(this, content, options);
	},

	_openPopup: L.Layer.prototype.togglePopup
});


/*
 * L.LayerGroup is a class to combine several layers into one so that
 * you can manipulate the group (e.g. add/remove it) as one layer.
 */

L.LayerGroup = L.Layer.extend({

	initialize: function (layers) {
		this._layers = {};

		var i, len;

		if (layers) {
			for (i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		}
	},

	addLayer: function (layer) {
		var id = this.getLayerId(layer);

		this._layers[id] = layer;

		if (this._map) {
			this._map.addLayer(layer);
		}

		return this;
	},

	removeLayer: function (layer) {
		var id = layer in this._layers ? layer : this.getLayerId(layer);

		if (this._map && this._layers[id]) {
			this._map.removeLayer(this._layers[id]);
		}

		delete this._layers[id];

		return this;
	},

	hasLayer: function (layer) {
		return !!layer && (layer in this._layers || this.getLayerId(layer) in this._layers);
	},

	clearLayers: function () {
		for (var i in this._layers) {
			this.removeLayer(this._layers[i]);
		}
		return this;
	},

	invoke: function (methodName) {
		var args = Array.prototype.slice.call(arguments, 1),
		    i, layer;

		for (i in this._layers) {
			layer = this._layers[i];

			if (layer[methodName]) {
				layer[methodName].apply(layer, args);
			}
		}

		return this;
	},

	onAdd: function (map) {
		for (var i in this._layers) {
			map.addLayer(this._layers[i]);
		}
	},

	onRemove: function (map) {
		for (var i in this._layers) {
			map.removeLayer(this._layers[i]);
		}
	},

	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	getLayer: function (id) {
		return this._layers[id];
	},

	getLayers: function () {
		var layers = [];

		for (var i in this._layers) {
			layers.push(this._layers[i]);
		}
		return layers;
	},

	setZIndex: function (zIndex) {
		return this.invoke('setZIndex', zIndex);
	},

	getLayerId: function (layer) {
		return L.stamp(layer);
	}
});

L.layerGroup = function (layers) {
	return new L.LayerGroup(layers);
};


/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
 * shared between a group of interactive layers (like vectors or markers).
 */

L.FeatureGroup = L.LayerGroup.extend({

	addLayer: function (layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		layer.addEventParent(this);

		L.LayerGroup.prototype.addLayer.call(this, layer);

		if (this._popupContent && layer.bindPopup) {
			layer.bindPopup(this._popupContent, this._popupOptions);
		}

		return this.fire('layeradd', {layer: layer});
	},

	removeLayer: function (layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (layer in this._layers) {
			layer = this._layers[layer];
		}

		layer.removeEventParent(this);

		L.LayerGroup.prototype.removeLayer.call(this, layer);

		if (this._popupContent) {
			this.invoke('unbindPopup');
		}

		return this.fire('layerremove', {layer: layer});
	},

	bindPopup: function (content, options) {
		this._popupContent = content;
		this._popupOptions = options;
		return this.invoke('bindPopup', content, options);
	},

	openPopup: function (latlng) {
		// open popup on the first layer
		for (var id in this._layers) {
			this._layers[id].openPopup(latlng);
			break;
		}
		return this;
	},

	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	bringToFront: function () {
		return this.invoke('bringToFront');
	},

	bringToBack: function () {
		return this.invoke('bringToBack');
	},

	getBounds: function () {
		var bounds = new L.LatLngBounds();

		this.eachLayer(function (layer) {
			bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
		});

		return bounds;
	}
});

L.featureGroup = function (layers) {
	return new L.FeatureGroup(layers);
};


/*
 * L.Renderer is a base class for renderer implementations (SVG, Canvas);
 * handles renderer container, bounds and zoom animation.
 */

L.Renderer = L.Layer.extend({

	options: {
		// how much to extend the clip area around the map view (relative to its size)
		// e.g. 0.1 would be 10% of map view in each direction; defaults to clip with the map view
		padding: 0
	},

	initialize: function (options) {
		L.setOptions(this, options);
		L.stamp(this);
	},

	onAdd: function () {
		if (!this._container) {
			this._initContainer(); // defined by renderer implementations

			if (this._zoomAnimated) {
				L.DomUtil.addClass(this._container, 'leaflet-zoom-animated');
			}
		}

		this.getPane().appendChild(this._container);
		this._update();
	},

	onRemove: function () {
		L.DomUtil.remove(this._container);
	},

	getEvents: function () {
		var events = {
			moveend: this._update
		};
		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}
		return events;
	},

	_animateZoom: function (e) {
		var origin = e.origin.subtract(this._map._getCenterLayerPoint()),
		    offset = this._bounds.min.add(origin.multiplyBy(1 - e.scale));

		L.DomUtil.setTransform(this._container, offset, e.scale);
	},

	_update: function () {
		// update pixel bounds of renderer container (for positioning/sizing/clipping later)
		var p = this.options.padding,
		    size = this._map.getSize(),
		    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

		this._bounds = new L.Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());
	}
});


L.Map.include({
	// used by each vector layer to decide which renderer to use
	getRenderer: function (layer) {
		var renderer = layer.options.renderer || this.options.renderer || this._renderer;

		if (!renderer) {
			renderer = this._renderer = (L.SVG && L.svg()) || (L.Canvas && L.canvas());
		}

		if (!this.hasLayer(renderer)) {
			this.addLayer(renderer);
		}
		return renderer;
	}
});


/*
 * L.Path is the base class for all Leaflet vector layers like polygons and circles.
 */

L.Path = L.Layer.extend({

	options: {
		stroke: true,
		color: '#3388ff',
		weight: 3,
		opacity: 1,
		lineCap: 'round',
		lineJoin: 'round',
		// dashArray: null
		// dashOffset: null

		// fill: false
		// fillColor: same as color by default
		fillOpacity: 0.2,

		// className: ''
		interactive: true
	},

	onAdd: function () {
		this._renderer = this._map.getRenderer(this);
		this._renderer._initPath(this);

		// defined in children classes
		this._project();
		this._update();

		this._renderer._addPath(this);
	},

	onRemove: function () {
		this._renderer._removePath(this);
	},

	getEvents: function () {
		return {
			viewreset: this._project,
			moveend: this._update
		};
	},

	redraw: function () {
		if (this._map) {
			this._renderer._updatePath(this);
		}
		return this;
	},

	setStyle: function (style) {
		L.setOptions(this, style);
		if (this._renderer) {
			this._renderer._updateStyle(this);
		}
		return this;
	},

	bringToFront: function () {
		this._renderer._bringToFront(this);
		return this;
	},

	bringToBack: function () {
		this._renderer._bringToBack(this);
		return this;
	},

	_fireMouseEvent: function (e, type) {
		this._map._fireMouseEvent(this, e, type, true);
	},

	_clickTolerance: function () {
		// used when doing hit detection for Canvas layers
		return (this.options.stroke ? this.options.weight / 2 : 0) + (L.Browser.touch ? 10 : 0);
	}
});


/*
 * L.LineUtil contains different utility functions for line segments
 * and polylines (clipping, simplification, distances, etc.)
 */

/*jshint bitwise:false */ // allow bitwise operations for this file

L.LineUtil = {

	// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
	// Improves rendering performance dramatically by lessening the number of points to draw.

	simplify: function (/*Point[]*/ points, /*Number*/ tolerance) {
		if (!tolerance || !points.length) {
			return points.slice();
		}

		var sqTolerance = tolerance * tolerance;

		// stage 1: vertex reduction
		points = this._reducePoints(points, sqTolerance);

		// stage 2: Douglas-Peucker simplification
		points = this._simplifyDP(points, sqTolerance);

		return points;
	},

	// distance from a point to a segment between two points
	pointToSegmentDistance:  function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
	},

	closestPointOnSegment: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return this._sqClosestPointOnSegment(p, p1, p2);
	},

	// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	_simplifyDP: function (points, sqTolerance) {

		var len = points.length,
		    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
		    markers = new ArrayConstructor(len);

		markers[0] = markers[len - 1] = 1;

		this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

		var i,
		    newPoints = [];

		for (i = 0; i < len; i++) {
			if (markers[i]) {
				newPoints.push(points[i]);
			}
		}

		return newPoints;
	},

	_simplifyDPStep: function (points, markers, sqTolerance, first, last) {

		var maxSqDist = 0,
		    index, i, sqDist;

		for (i = first + 1; i <= last - 1; i++) {
			sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);

			if (sqDist > maxSqDist) {
				index = i;
				maxSqDist = sqDist;
			}
		}

		if (maxSqDist > sqTolerance) {
			markers[index] = 1;

			this._simplifyDPStep(points, markers, sqTolerance, first, index);
			this._simplifyDPStep(points, markers, sqTolerance, index, last);
		}
	},

	// reduce points that are too close to each other to a single point
	_reducePoints: function (points, sqTolerance) {
		var reducedPoints = [points[0]];

		for (var i = 1, prev = 0, len = points.length; i < len; i++) {
			if (this._sqDist(points[i], points[prev]) > sqTolerance) {
				reducedPoints.push(points[i]);
				prev = i;
			}
		}
		if (prev < len - 1) {
			reducedPoints.push(points[len - 1]);
		}
		return reducedPoints;
	},

	// Cohen-Sutherland line clipping algorithm.
	// Used to avoid rendering parts of a polyline that are not currently visible.

	clipSegment: function (a, b, bounds, useLastCode) {
		var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
		    codeB = this._getBitCode(b, bounds),

		    codeOut, p, newCode;

		// save 2nd code to avoid calculating it on the next segment
		this._lastCode = codeB;

		while (true) {
			// if a,b is inside the clip window (trivial accept)
			if (!(codeA | codeB)) {
				return [a, b];
			// if a,b is outside the clip window (trivial reject)
			} else if (codeA & codeB) {
				return false;
			// other cases
			} else {
				codeOut = codeA || codeB;
				p = this._getEdgeIntersection(a, b, codeOut, bounds);
				newCode = this._getBitCode(p, bounds);

				if (codeOut === codeA) {
					a = p;
					codeA = newCode;
				} else {
					b = p;
					codeB = newCode;
				}
			}
		}
	},

	_getEdgeIntersection: function (a, b, code, bounds) {
		var dx = b.x - a.x,
		    dy = b.y - a.y,
		    min = bounds.min,
		    max = bounds.max,
		    x, y;

		if (code & 8) { // top
			x = a.x + dx * (max.y - a.y) / dy;
			y = max.y;

		} else if (code & 4) { // bottom
			x = a.x + dx * (min.y - a.y) / dy;
			y = min.y;

		} else if (code & 2) { // right
			x = max.x;
			y = a.y + dy * (max.x - a.x) / dx;

		} else if (code & 1) { // left
			x = min.x;
			y = a.y + dy * (min.x - a.x) / dx;
		}

		return new L.Point(x, y, true);
	},

	_getBitCode: function (/*Point*/ p, bounds) {
		var code = 0;

		if (p.x < bounds.min.x) { // left
			code |= 1;
		} else if (p.x > bounds.max.x) { // right
			code |= 2;
		}

		if (p.y < bounds.min.y) { // bottom
			code |= 4;
		} else if (p.y > bounds.max.y) { // top
			code |= 8;
		}

		return code;
	},

	// square distance (to avoid unnecessary Math.sqrt calls)
	_sqDist: function (p1, p2) {
		var dx = p2.x - p1.x,
		    dy = p2.y - p1.y;
		return dx * dx + dy * dy;
	},

	// return closest point on segment or distance to that point
	_sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
		var x = p1.x,
		    y = p1.y,
		    dx = p2.x - x,
		    dy = p2.y - y,
		    dot = dx * dx + dy * dy,
		    t;

		if (dot > 0) {
			t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

			if (t > 1) {
				x = p2.x;
				y = p2.y;
			} else if (t > 0) {
				x += dx * t;
				y += dy * t;
			}
		}

		dx = p.x - x;
		dy = p.y - y;

		return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
	}
};


/*
 * L.Polyline implements polyline vector layer (a set of points connected with lines)
 */

L.Polyline = L.Path.extend({

	options: {
		// how much to simplify the polyline on each zoom level
		// more = better performance and smoother look, less = more accurate
		smoothFactor: 1.0
		// noClip: false
	},

	initialize: function (latlngs, options) {
		L.setOptions(this, options);
		this._setLatLngs(latlngs);
	},

	getLatLngs: function () {
		// TODO rings
		return this._latlngs;
	},

	setLatLngs: function (latlngs) {
		this._setLatLngs(latlngs);
		return this.redraw();
	},

	addLatLng: function (latlng) {
		// TODO rings
		latlng = L.latLng(latlng);
		this._latlngs.push(latlng);
		this._bounds.extend(latlng);
		return this.redraw();
	},

	spliceLatLngs: function () {
		// TODO rings
		var removed = [].splice.apply(this._latlngs, arguments);
		this._setLatLngs(this._latlngs);
		this.redraw();
		return removed;
	},

	closestLayerPoint: function (p) {
		var minDistance = Infinity,
		    minPoint = null,
		    closest = L.LineUtil._sqClosestPointOnSegment,
		    p1, p2;

		for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
			var points = this._parts[j];

			for (var i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];

				var sqDist = closest(p, p1, p2, true);

				if (sqDist < minDistance) {
					minDistance = sqDist;
					minPoint = closest(p, p1, p2);
				}
			}
		}
		if (minPoint) {
			minPoint.distance = Math.sqrt(minDistance);
		}
		return minPoint;
	},

	getCenter: function () {
		var i, halfDist, segDist, dist, p1, p2, ratio,
		    points = this._rings[0],
		    len = points.length;

		// polyline centroid algorithm; only uses the first ring if there are multiple

		for (i = 0, halfDist = 0; i < len - 1; i++) {
			halfDist += points[i].distanceTo(points[i + 1]) / 2;
		}

		for (i = 0, dist = 0; i < len - 1; i++) {
			p1 = points[i];
			p2 = points[i + 1];
			segDist = p1.distanceTo(p2);
			dist += segDist;

			if (dist > halfDist) {
				ratio = (dist - halfDist) / segDist;
				return this._map.layerPointToLatLng([
					p2.x - ratio * (p2.x - p1.x),
					p2.y - ratio * (p2.y - p1.y)
				]);
			}
		}
	},

	getBounds: function () {
		return this._bounds;
	},

	_setLatLngs: function (latlngs) {
		this._bounds = new L.LatLngBounds();
		this._latlngs = this._convertLatLngs(latlngs);
	},

	// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
	_convertLatLngs: function (latlngs) {
		var result = [],
		    flat = this._flat(latlngs);

		for (var i = 0, len = latlngs.length; i < len; i++) {
			if (flat) {
				result[i] = L.latLng(latlngs[i]);
				this._bounds.extend(result[i]);
			} else {
				result[i] = this._convertLatLngs(latlngs[i]);
			}
		}

		return result;
	},

	_flat: function (latlngs) {
		// true if it's a flat array of latlngs; false if nested
		return !L.Util.isArray(latlngs[0]) || typeof latlngs[0][0] !== 'object';
	},

	_project: function () {
		this._rings = [];
		this._projectLatlngs(this._latlngs, this._rings);

		// project bounds as well to use later for Canvas hit detection/etc.
		var w = this._clickTolerance(),
			p = new L.Point(w, -w);

		if (this._latlngs.length) {
			this._pxBounds = new L.Bounds(
				this._map.latLngToLayerPoint(this._bounds.getSouthWest())._subtract(p),
				this._map.latLngToLayerPoint(this._bounds.getNorthEast())._add(p));
		}
	},

	// recursively turns latlngs into a set of rings with projected coordinates
	_projectLatlngs: function (latlngs, result) {

		var flat = latlngs[0] instanceof L.LatLng,
		    len = latlngs.length,
		    i, ring;

		if (flat) {
			ring = [];
			for (i = 0; i < len; i++) {
				ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
			}
			result.push(ring);
		} else {
			for (i = 0; i < len; i++) {
				this._projectLatlngs(latlngs[i], result);
			}
		}
	},

	// clip polyline by renderer bounds so that we have less to render for performance
	_clipPoints: function () {
		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		this._parts = [];

		var parts = this._parts,
		    bounds = this._renderer._bounds,
		    i, j, k, len, len2, segment, points;

		for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
			points = this._rings[i];

			for (j = 0, len2 = points.length; j < len2 - 1; j++) {
				segment = L.LineUtil.clipSegment(points[j], points[j + 1], bounds, j);

				if (!segment) { continue; }

				parts[k] = parts[k] || [];
				parts[k].push(segment[0]);

				// if segment goes out of screen, or it's the last one, it's the end of the line part
				if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
					parts[k].push(segment[1]);
					k++;
				}
			}
		}
	},

	// simplify each clipped part of the polyline for performance
	_simplifyPoints: function () {
		var parts = this._parts,
			tolerance = this.options.smoothFactor;

		for (var i = 0, len = parts.length; i < len; i++) {
			parts[i] = L.LineUtil.simplify(parts[i], tolerance);
		}
	},

	_update: function () {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();
		this._updatePath();
	},

	_updatePath: function () {
		this._renderer._updatePoly(this);
	}
});

L.polyline = function (latlngs, options) {
	return new L.Polyline(latlngs, options);
};


/*
 * L.PolyUtil contains utility functions for polygons (clipping, etc.).
 */

/*jshint bitwise:false */ // allow bitwise operations here

L.PolyUtil = {};

/*
 * Sutherland-Hodgeman polygon clipping algorithm.
 * Used to avoid rendering parts of a polygon that are not currently visible.
 */
L.PolyUtil.clipPolygon = function (points, bounds) {
	var clippedPoints,
	    edges = [1, 4, 2, 8],
	    i, j, k,
	    a, b,
	    len, edge, p,
	    lu = L.LineUtil;

	for (i = 0, len = points.length; i < len; i++) {
		points[i]._code = lu._getBitCode(points[i], bounds);
	}

	// for each edge (left, bottom, right, top)
	for (k = 0; k < 4; k++) {
		edge = edges[k];
		clippedPoints = [];

		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
			a = points[i];
			b = points[j];

			// if a is inside the clip window
			if (!(a._code & edge)) {
				// if b is outside the clip window (a->b goes out of screen)
				if (b._code & edge) {
					p = lu._getEdgeIntersection(b, a, edge, bounds);
					p._code = lu._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
				clippedPoints.push(a);

			// else if b is inside the clip window (a->b enters the screen)
			} else if (!(b._code & edge)) {
				p = lu._getEdgeIntersection(b, a, edge, bounds);
				p._code = lu._getBitCode(p, bounds);
				clippedPoints.push(p);
			}
		}
		points = clippedPoints;
	}

	return points;
};


/*
 * L.Polygon implements polygon vector layer (closed polyline with a fill inside).
 */

L.Polygon = L.Polyline.extend({

	options: {
		fill: true
	},

	getCenter: function () {
		var i, j, len, p1, p2, f, area, x, y,
		    points = this._rings[0];

		// polygon centroid algorithm; only uses the first ring if there are multiple

		area = x = y = 0;

		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
			p1 = points[i];
			p2 = points[j];

			f = p1.y * p2.x - p2.y * p1.x;
			x += (p1.x + p2.x) * f;
			y += (p1.y + p2.y) * f;
			area += f * 3;
		}

		return this._map.layerPointToLatLng([x / area, y / area]);
	},

	_convertLatLngs: function (latlngs) {
		var result = L.Polyline.prototype._convertLatLngs.call(this, latlngs),
		    len = result.length;

		// remove last point if it equals first one
		if (len >= 2 && result[0] instanceof L.LatLng && result[0].equals(result[len - 1])) {
			result.pop();
		}
		return result;
	},

	_clipPoints: function () {
		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		// polygons need a different clipping algorithm so we redefine that

		var bounds = this._renderer._bounds,
		    w = this.options.weight,
		    p = new L.Point(w, w);

		// increase clip padding by stroke width to avoid stroke on clip edges
		bounds = new L.Bounds(bounds.min.subtract(p), bounds.max.add(p));

		this._parts = [];

		for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
			clipped = L.PolyUtil.clipPolygon(this._rings[i], bounds);
			if (clipped.length) {
				this._parts.push(clipped);
			}
		}
	},

	_updatePath: function () {
		this._renderer._updatePoly(this, true);
	}
});

L.polygon = function (latlngs, options) {
	return new L.Polygon(latlngs, options);
};


/*
 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
 */

L.Rectangle = L.Polygon.extend({
	initialize: function (latLngBounds, options) {
		L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
	},

	setBounds: function (latLngBounds) {
		this.setLatLngs(this._boundsToLatLngs(latLngBounds));
	},

	_boundsToLatLngs: function (latLngBounds) {
		latLngBounds = L.latLngBounds(latLngBounds);
		return [
			latLngBounds.getSouthWest(),
			latLngBounds.getNorthWest(),
			latLngBounds.getNorthEast(),
			latLngBounds.getSouthEast()
		];
	}
});

L.rectangle = function (latLngBounds, options) {
	return new L.Rectangle(latLngBounds, options);
};


/*
 * L.CircleMarker is a circle overlay with a permanent pixel radius.
 */

L.CircleMarker = L.Path.extend({

	options: {
		fill: true,
		radius: 10
	},

	initialize: function (latlng, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
		this._radius = this.options.radius;
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		this.redraw();
		return this.fire('move', {latlng: this._latlng});
	},

	getLatLng: function () {
		return this._latlng;
	},

	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._radius;
	},

	setStyle : function (options) {
		var radius = options && options.radius || this._radius;
		L.Path.prototype.setStyle.call(this, options);
		this.setRadius(radius);
		return this;
	},

	_project: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._updateBounds();
	},

	_updateBounds: function () {
		var r = this._radius,
		    r2 = this._radiusY || r,
		    w = this._clickTolerance(),
		    p = [r + w, r2 + w];
		this._pxBounds = new L.Bounds(this._point.subtract(p), this._point.add(p));
	},

	_update: function () {
		if (this._map) {
			this._updatePath();
		}
	},

	_updatePath: function () {
		this._renderer._updateCircle(this);
	},

	_empty: function () {
		return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
	}
});

L.circleMarker = function (latlng, options) {
	return new L.CircleMarker(latlng, options);
};


/*
 * L.Circle is a circle overlay (with a certain radius in meters).
 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion)
 */

L.Circle = L.CircleMarker.extend({

	initialize: function (latlng, radius, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
		this._mRadius = radius;
	},

	setRadius: function (radius) {
		this._mRadius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._mRadius;
	},

	getBounds: function () {
		var half = [this._radius, this._radiusY];

		return new L.LatLngBounds(
			this._map.layerPointToLatLng(this._point.subtract(half)),
			this._map.layerPointToLatLng(this._point.add(half)));
	},

	setStyle: L.Path.prototype.setStyle,

	_project: function () {

		var lng = this._latlng.lng,
		    lat = this._latlng.lat,
		    map = this._map,
		    crs = map.options.crs;

		if (crs.distance === L.CRS.Earth.distance) {
			var d = Math.PI / 180,
			    latR = (this._mRadius / L.CRS.Earth.R) / d,
			    top = map.project([lat + latR, lng]),
			    bottom = map.project([lat - latR, lng]),
			    p = top.add(bottom).divideBy(2),
			    lat2 = map.unproject(p).lat,
			    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
			            (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

			this._point = p.subtract(map.getPixelOrigin());
			this._radius = isNaN(lngR) ? 0 : Math.max(Math.round(p.x - map.project([lat2, lng - lngR]).x), 1);
			this._radiusY = Math.max(Math.round(p.y - top.y), 1);

		} else {
			var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

			this._point = map.latLngToLayerPoint(this._latlng);
			this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
		}

		this._updateBounds();
	}
});

L.circle = function (latlng, radius, options) {
	return new L.Circle(latlng, radius, options);
};


/*
 * L.SVG renders vector layers with SVG. All SVG-specific code goes here.
 */

L.SVG = L.Renderer.extend({

	_initContainer: function () {
		this._container = L.SVG.create('svg');

		this._paths = {};
		this._initEvents();

		// makes it possible to click through svg root; we'll reset it back in individual paths
		this._container.setAttribute('pointer-events', 'none');
	},

	_update: function () {
		if (this._map._animatingZoom && this._bounds) { return; }

		L.Renderer.prototype._update.call(this);

		var b = this._bounds,
		    size = b.getSize(),
		    container = this._container,
		    pane = this.getPane();

		// hack to make flicker on drag end on mobile webkit less irritating
		if (L.Browser.mobileWebkit) {
			pane.removeChild(container);
		}

		L.DomUtil.setPosition(container, b.min);

		// set size of svg-container if changed
		if (!this._svgSize || !this._svgSize.equals(size)) {
			this._svgSize = size;
			container.setAttribute('width', size.x);
			container.setAttribute('height', size.y);
		}

		// movement: update container viewBox so that we don't have to change coordinates of individual layers
		L.DomUtil.setPosition(container, b.min);
		container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));
		
		if (L.Browser.mobileWebkit) {
			pane.appendChild(container);
		}
	},

	// methods below are called by vector layers implementations

	_initPath: function (layer) {
		var path = layer._path = L.SVG.create('path');

		if (layer.options.className) {
			L.DomUtil.addClass(path, layer.options.className);
		}

		if (layer.options.interactive) {
			L.DomUtil.addClass(path, 'leaflet-interactive');
		}

		this._updateStyle(layer);
	},

	_addPath: function (layer) {
		var path = layer._path;
		this._container.appendChild(path);
		this._paths[L.stamp(path)] = layer;
	},

	_removePath: function (layer) {
		var path = layer._path;
		L.DomUtil.remove(path);
		delete this._paths[L.stamp(path)];
	},

	_updatePath: function (layer) {
		layer._project();
		layer._update();
	},

	_updateStyle: function (layer) {
		var path = layer._path,
			options = layer.options;

		if (!path) { return; }

		if (options.stroke) {
			path.setAttribute('stroke', options.color);
			path.setAttribute('stroke-opacity', options.opacity);
			path.setAttribute('stroke-width', options.weight);
			path.setAttribute('stroke-linecap', options.lineCap);
			path.setAttribute('stroke-linejoin', options.lineJoin);

			if (options.dashArray) {
				path.setAttribute('stroke-dasharray', options.dashArray);
			} else {
				path.removeAttribute('stroke-dasharray');
			}

			if (options.dashOffset) {
				path.setAttribute('stroke-dashoffset', options.dashOffset);
			} else {
				path.removeAttribute('stroke-dashoffset');
			}
		} else {
			path.setAttribute('stroke', 'none');
		}

		if (options.fill) {
			path.setAttribute('fill', options.fillColor || options.color);
			path.setAttribute('fill-opacity', options.fillOpacity);
			path.setAttribute('fill-rule', 'evenodd');
		} else {
			path.setAttribute('fill', 'none');
		}

		path.setAttribute('pointer-events', options.pointerEvents || (options.interactive ? 'visiblePainted' : 'none'));
	},

	_updatePoly: function (layer, closed) {
		this._setPath(layer, L.SVG.pointsToPath(layer._parts, closed));
	},

	_updateCircle: function (layer) {
		var p = layer._point,
		    r = layer._radius,
		    r2 = layer._radiusY || r,
		    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

		// drawing a circle with two half-arcs
		var d = layer._empty() ? 'M0 0' :
				'M' + (p.x - r) + ',' + p.y +
				arc +  (r * 2) + ',0 ' +
				arc + (-r * 2) + ',0 ';

		this._setPath(layer, d);
	},

	_setPath: function (layer, path) {
		layer._path.setAttribute('d', path);
	},

	// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
	_bringToFront: function (layer) {
		L.DomUtil.toFront(layer._path);
	},

	_bringToBack: function (layer) {
		L.DomUtil.toBack(layer._path);
	},

	// TODO remove duplication with L.Map
	_initEvents: function () {
		L.DomEvent.on(this._container, 'click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu',
				this._fireMouseEvent, this);
	},

	_fireMouseEvent: function (e) {
		var path = this._paths[L.stamp(e.target || e.srcElement)];
		if (path) {
			path._fireMouseEvent(e);
		}
	}
});


L.extend(L.SVG, {
	create: function (name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	},

	// generates SVG path string for multiple rings, with each ring turning into "M..L..L.." instructions
	pointsToPath: function (rings, closed) {
		var str = '',
			i, j, len, len2, points, p;

		for (i = 0, len = rings.length; i < len; i++) {
			points = rings[i];

			for (j = 0, len2 = points.length; j < len2; j++) {
				p = points[j];
				str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
			}

			// closes the ring for polygons; "x" is VML syntax
			str += closed ? (L.Browser.svg ? 'z' : 'x') : '';
		}

		// SVG complains about empty path strings
		return str || 'M0 0';
	}
});

L.Browser.svg = !!(document.createElementNS && L.SVG.create('svg').createSVGRect);

L.svg = function (options) {
	return L.Browser.svg || L.Browser.vml ? new L.SVG(options) : null;
};


/*
 * Vector rendering for IE7-8 through VML.
 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
 */

L.Browser.vml = !L.Browser.svg && (function () {
	try {
		var div = document.createElement('div');
		div.innerHTML = '<v:shape adj="1"/>';

		var shape = div.firstChild;
		shape.style.behavior = 'url(#default#VML)';

		return shape && (typeof shape.adj === 'object');

	} catch (e) {
		return false;
	}
}());

// redefine some SVG methods to handle VML syntax which is similar but with some differences
L.SVG.include(!L.Browser.vml ? {} : {

	_initContainer: function () {
		this._container = L.DomUtil.create('div', 'leaflet-vml-container');

		this._paths = {};
		this._initEvents();
	},

	_update: function () {
		if (this._map._animatingZoom) { return; }
		L.Renderer.prototype._update.call(this);
	},

	_initPath: function (layer) {
		var container = layer._container = L.SVG.create('shape');

		L.DomUtil.addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));

		container.coordsize = '1 1';

		layer._path = L.SVG.create('path');
		container.appendChild(layer._path);

		this._updateStyle(layer);
	},

	_addPath: function (layer) {
		var container = layer._container;
		this._container.appendChild(container);
		this._paths[L.stamp(container)] = layer;
	},

	_removePath: function (layer) {
		var container = layer._container;
		L.DomUtil.remove(container);
		delete this._paths[L.stamp(container)];
	},

	_updateStyle: function (layer) {
		var stroke = layer._stroke,
		    fill = layer._fill,
		    options = layer.options,
		    container = layer._container;

		container.stroked = !!options.stroke;
		container.filled = !!options.fill;

		if (options.stroke) {
			if (!stroke) {
				stroke = layer._stroke = L.SVG.create('stroke');
				container.appendChild(stroke);
			}
			stroke.weight = options.weight + 'px';
			stroke.color = options.color;
			stroke.opacity = options.opacity;

			if (options.dashArray) {
				stroke.dashStyle = L.Util.isArray(options.dashArray) ?
				    options.dashArray.join(' ') :
				    options.dashArray.replace(/( *, *)/g, ' ');
			} else {
				stroke.dashStyle = '';
			}
			stroke.endcap = options.lineCap.replace('butt', 'flat');
			stroke.joinstyle = options.lineJoin;

		} else if (stroke) {
			container.removeChild(stroke);
			layer._stroke = null;
		}

		if (options.fill) {
			if (!fill) {
				fill = layer._fill = L.SVG.create('fill');
				container.appendChild(fill);
			}
			fill.color = options.fillColor || options.color;
			fill.opacity = options.fillOpacity;

		} else if (fill) {
			container.removeChild(fill);
			layer._fill = null;
		}
	},

	_updateCircle: function (layer) {
		var p = layer._point.round(),
		    r = Math.round(layer._radius),
		    r2 = Math.round(layer._radiusY || r);

		this._setPath(layer, layer._empty() ? 'M0 0' :
				'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + (65535 * 360));
	},

	_setPath: function (layer, path) {
		layer._path.v = path;
	}
});

if (L.Browser.vml) {
	L.SVG.create = (function () {
		try {
			document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
			return function (name) {
				return document.createElement('<lvml:' + name + ' class="lvml">');
			};
		} catch (e) {
			return function (name) {
				return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
			};
		}
	})();
}


/*
 * L.Canvas handles Canvas vector layers rendering and mouse events handling. All Canvas-specific code goes here.
 */

L.Canvas = L.Renderer.extend({

	onAdd: function () {
		L.Renderer.prototype.onAdd.call(this);

		this._layers = this._layers || {};

		// redraw vectors since canvas is cleared upon removal
		this._draw();
	},

	_initContainer: function () {
		var container = this._container = document.createElement('canvas');

		L.DomEvent
			.on(container, 'mousemove', this._onMouseMove, this)
			.on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this);

		this._ctx = container.getContext('2d');
	},

	_update: function () {
		if (this._map._animatingZoom && this._bounds) { return; }

		L.Renderer.prototype._update.call(this);

		var b = this._bounds,
		    container = this._container,
		    size = b.getSize(),
		    m = L.Browser.retina ? 2 : 1;

		L.DomUtil.setPosition(container, b.min);

		// set canvas size (also clearing it); use double size on retina
		container.width = m * size.x;
		container.height = m * size.y;
		container.style.width = size.x + 'px';
		container.style.height = size.y + 'px';

		if (L.Browser.retina) {
			this._ctx.scale(2, 2);
		}

		// translate so we use the same path coordinates after canvas element moves
		this._ctx.translate(-b.min.x, -b.min.y);
	},

	_initPath: function (layer) {
		this._layers[L.stamp(layer)] = layer;
	},

	_addPath: L.Util.falseFn,

	_removePath: function (layer) {
		layer._removed = true;
		this._requestRedraw(layer);
	},

	_updatePath: function (layer) {
		this._redrawBounds = layer._pxBounds;
		this._draw(true);
		layer._project();
		layer._update();
		this._draw();
		this._redrawBounds = null;
	},

	_updateStyle: function (layer) {
		this._requestRedraw(layer);
	},

	_requestRedraw: function (layer) {
		if (!this._map) { return; }

		this._redrawBounds = this._redrawBounds || new L.Bounds();
		this._redrawBounds.extend(layer._pxBounds.min).extend(layer._pxBounds.max);

		this._redrawRequest = this._redrawRequest || L.Util.requestAnimFrame(this._redraw, this);
	},

	_redraw: function () {
		this._redrawRequest = null;

		this._draw(true); // clear layers in redraw bounds
		this._draw(); // draw layers

		this._redrawBounds = null;
	},

	_draw: function (clear) {
		this._clear = clear;
		var layer;

		for (var id in this._layers) {
			layer = this._layers[id];
			if (!this._redrawBounds || layer._pxBounds.intersects(this._redrawBounds)) {
				layer._updatePath();
			}
			if (clear && layer._removed) {
				delete layer._removed;
				delete this._layers[id];
			}
		}
	},

	_updatePoly: function (layer, closed) {

		var i, j, len2, p,
		    parts = layer._parts,
		    len = parts.length,
		    ctx = this._ctx;

	    if (!len) { return; }

		ctx.beginPath();

		for (i = 0; i < len; i++) {
			for (j = 0, len2 = parts[i].length; j < len2; j++) {
				p = parts[i][j];
				ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
			}
			if (closed) {
				ctx.closePath();
			}
		}

		this._fillStroke(ctx, layer);

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	_updateCircle: function (layer) {

		if (layer._empty()) { return; }

		var p = layer._point,
		    ctx = this._ctx,
		    r = layer._radius,
		    s = (layer._radiusY || r) / r;

		if (s !== 1) {
			ctx.save();
			ctx.scale(1, s);
		}

		ctx.beginPath();
		ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

		if (s !== 1) {
			ctx.restore();
		}

		this._fillStroke(ctx, layer);
	},

	_fillStroke: function (ctx, layer) {
		var clear = this._clear,
		    options = layer.options;

		ctx.globalCompositeOperation = clear ? 'destination-out' : 'source-over';

		if (options.fill) {
			ctx.globalAlpha = clear ? 1 : options.fillOpacity;
			ctx.fillStyle = options.fillColor || options.color;
			ctx.fill('evenodd');
		}

		if (options.stroke) {
			ctx.globalAlpha = clear ? 1 : options.opacity;

			// if clearing shape, do it with the previously drawn line width
			layer._prevWeight = ctx.lineWidth = clear ? layer._prevWeight + 1 : options.weight;

			ctx.strokeStyle = options.color;
			ctx.lineCap = options.lineCap;
			ctx.lineJoin = options.lineJoin;
			ctx.stroke();
		}
	},

	// Canvas obviously doesn't have mouse events for individual drawn objects,
	// so we emulate that by calculating what's under the mouse on mousemove/click manually

	_onClick: function (e) {
		var point = this._map.mouseEventToLayerPoint(e);

		for (var id in this._layers) {
			if (this._layers[id]._containsPoint(point)) {
				this._layers[id]._fireMouseEvent(e);
			}
		}
	},

	_onMouseMove: function (e) {
		if (!this._map || this._map._animatingZoom) { return; }

		var point = this._map.mouseEventToLayerPoint(e);

		// TODO don't do on each move event, throttle since it's expensive
		for (var id in this._layers) {
			this._handleHover(this._layers[id], e, point);
		}
	},

	_handleHover: function (layer, e, point) {
		if (!layer.options.interactive) { return; }

		if (layer._containsPoint(point)) {
			// if we just got inside the layer, fire mouseover
			if (!layer._mouseInside) {
				L.DomUtil.addClass(this._container, 'leaflet-interactive'); // change cursor
				layer._fireMouseEvent(e, 'mouseover');
				layer._mouseInside = true;
			}
			// fire mousemove
			layer._fireMouseEvent(e);

		} else if (layer._mouseInside) {
			// if we're leaving the layer, fire mouseout
			L.DomUtil.removeClass(this._container, 'leaflet-interactive');
			layer._fireMouseEvent(e, 'mouseout');
			layer._mouseInside = false;
		}
	},

	// TODO _bringToFront & _bringToBack, pretty tricky

	_bringToFront: L.Util.falseFn,
	_bringToBack: L.Util.falseFn
});

L.Browser.canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

L.canvas = function (options) {
	return L.Browser.canvas ? new L.Canvas(options) : null;
};

L.Polyline.prototype._containsPoint = function (p, closed) {
	var i, j, k, len, len2, part,
	    w = this._clickTolerance();

	if (!this._pxBounds.contains(p)) { return false; }

	// hit detection for polylines
	for (i = 0, len = this._parts.length; i < len; i++) {
		part = this._parts[i];

		for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
			if (!closed && (j === 0)) { continue; }

			if (L.LineUtil.pointToSegmentDistance(p, part[k], part[j]) <= w) {
				return true;
			}
		}
	}
	return false;
};

L.Polygon.prototype._containsPoint = function (p) {
	var inside = false,
	    part, p1, p2, i, j, k, len, len2;

	if (!this._pxBounds.contains(p)) { return false; }

	// ray casting algorithm for detecting if point is in polygon
	for (i = 0, len = this._parts.length; i < len; i++) {
		part = this._parts[i];

		for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
			p1 = part[j];
			p2 = part[k];

			if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
				inside = !inside;
			}
		}
	}

	// also check if it's on polygon stroke
	return inside || L.Polyline.prototype._containsPoint.call(this, p, true);
};

L.CircleMarker.prototype._containsPoint = function (p) {
	return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
};


/*
 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
 */

L.GeoJSON = L.FeatureGroup.extend({

	initialize: function (geojson, options) {
		L.setOptions(this, options);

		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	addData: function (geojson) {
		var features = L.Util.isArray(geojson) ? geojson : geojson.features,
		    i, len, feature;

		if (features) {
			for (i = 0, len = features.length; i < len; i++) {
				// Only add this if geometry or geometries are set and not null
				feature = features[i];
				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
					this.addData(feature);
				}
			}
			return this;
		}

		var options = this.options;

		if (options.filter && !options.filter(geojson)) { return; }

		var layer = L.GeoJSON.geometryToLayer(geojson, options);
		layer.feature = L.GeoJSON.asFeature(geojson);

		layer.defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}

		return this.addLayer(layer);
	},

	resetStyle: function (layer) {
		// reset any custom styles
		layer.options = layer.defaultOptions;
		this._setLayerStyle(layer, this.options.style);
		return this;
	},

	setStyle: function (style) {
		return this.eachLayer(function (layer) {
			this._setLayerStyle(layer, style);
		}, this);
	},

	_setLayerStyle: function (layer, style) {
		if (typeof style === 'function') {
			style = style(layer.feature);
		}
		if (layer.setStyle) {
			layer.setStyle(style);
		}
	}
});

L.extend(L.GeoJSON, {
	geometryToLayer: function (geojson, options) {

		var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
		    coords = geometry.coordinates,
		    layers = [],
		    pointToLayer = options && options.pointToLayer,
		    coordsToLatLng = options && options.coordsToLatLng || this.coordsToLatLng,
		    latlng, latlngs, i, len;

		switch (geometry.type) {
		case 'Point':
			latlng = coordsToLatLng(coords);
			return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);

		case 'MultiPoint':
			for (i = 0, len = coords.length; i < len; i++) {
				latlng = coordsToLatLng(coords[i]);
				layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
			}
			return new L.FeatureGroup(layers);

		case 'LineString':
		case 'MultiLineString':
			latlngs = this.coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, coordsToLatLng);
			return new L.Polyline(latlngs, options);

		case 'Polygon':
		case 'MultiPolygon':
			latlngs = this.coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, coordsToLatLng);
			return new L.Polygon(latlngs, options);

		case 'GeometryCollection':
			for (i = 0, len = geometry.geometries.length; i < len; i++) {

				layers.push(this.geometryToLayer({
					geometry: geometry.geometries[i],
					type: 'Feature',
					properties: geojson.properties
				}, options));
			}
			return new L.FeatureGroup(layers);

		default:
			throw new Error('Invalid GeoJSON object.');
		}
	},

	coordsToLatLng: function (coords) {
		return new L.LatLng(coords[1], coords[0], coords[2]);
	},

	coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) {
		var latlngs = [];

		for (var i = 0, len = coords.length, latlng; i < len; i++) {
			latlng = levelsDeep ?
			        this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
			        (coordsToLatLng || this.coordsToLatLng)(coords[i]);

			latlngs.push(latlng);
		}

		return latlngs;
	},

	latLngToCoords: function (latlng) {
		return latlng.alt !== undefined ?
				[latlng.lng, latlng.lat, latlng.alt] :
				[latlng.lng, latlng.lat];
	},

	latLngsToCoords: function (latlngs, levelsDeep, closed) {
		var coords = [];

		for (var i = 0, len = latlngs.length; i < len; i++) {
			coords.push(levelsDeep ?
				L.GeoJSON.latLngsToCoords(latlngs[i], levelsDeep - 1, closed):
				L.GeoJSON.latLngToCoords(latlngs[i]));
		}

		if (!levelsDeep && closed) {
			coords.push(coords[0]);
		}

		return coords;
	},

	getFeature: function (layer, newGeometry) {
		return layer.feature ?
				L.extend({}, layer.feature, {geometry: newGeometry}) :
				L.GeoJSON.asFeature(newGeometry);
	},

	asFeature: function (geoJSON) {
		if (geoJSON.type === 'Feature') {
			return geoJSON;
		}

		return {
			type: 'Feature',
			properties: {},
			geometry: geoJSON
		};
	}
});

var PointToGeoJSON = {
	toGeoJSON: function () {
		return L.GeoJSON.getFeature(this, {
			type: 'Point',
			coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
		});
	}
};

L.Marker.include(PointToGeoJSON);
L.Circle.include(PointToGeoJSON);
L.CircleMarker.include(PointToGeoJSON);

L.Polyline.prototype.toGeoJSON = function () {
	var multi = !this._flat(this._latlngs);

	var coords = L.GeoJSON.latLngsToCoords(this._latlngs, multi ? 1 : 0);

	return L.GeoJSON.getFeature(this, {
		type: (multi ? 'Multi' : '') + 'LineString',
		coordinates: coords
	});
};

L.Polygon.prototype.toGeoJSON = function () {
	var holes = !this._flat(this._latlngs),
	    multi = holes && !this._flat(this._latlngs[0]);

	var coords = L.GeoJSON.latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true);

	if (holes && this._latlngs.length === 1) {
		multi = true;
		coords = [coords];
	}
	if (!holes) {
		coords = [coords];
	}

	return L.GeoJSON.getFeature(this, {
		type: (multi ? 'Multi' : '') + 'Polygon',
		coordinates: coords
	});
};


L.LayerGroup.include({
	toMultiPoint: function () {
		var coords = [];

		this.eachLayer(function (layer) {
			coords.push(layer.toGeoJSON().geometry.coordinates);
		});

		return L.GeoJSON.getFeature(this, {
			type: 'MultiPoint',
			coordinates: coords
		});
	},

	toGeoJSON: function () {

		var type = this.feature && this.feature.geometry && this.feature.geometry.type;

		if (type === 'MultiPoint') {
			return this.toMultiPoint();
		}

		var isGeometryCollection = type === 'GeometryCollection',
			jsons = [];

		this.eachLayer(function (layer) {
			if (layer.toGeoJSON) {
				var json = layer.toGeoJSON();
				jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json));
			}
		});

		if (isGeometryCollection) {
			return L.GeoJSON.getFeature(this, {
				geometries: jsons,
				type: 'GeometryCollection'
			});
		}

		return {
			type: 'FeatureCollection',
			features: jsons
		};
	}
});

L.geoJson = function (geojson, options) {
	return new L.GeoJSON(geojson, options);
};


/*
 * L.DomEvent contains functions for working with DOM events.
 * Inspired by John Resig, Dean Edwards and YUI addEvent implementations.
 */

var eventsKey = '_leaflet_events';

L.DomEvent = {

	on: function (obj, types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this._on(obj, type, types[type], fn);
			}
		} else {
			types = L.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(obj, types[i], fn, context);
			}
		}

		return this;
	},

	off: function (obj, types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this._off(obj, type, types[type], fn);
			}
		} else {
			types = L.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(obj, types[i], fn, context);
			}
		}

		return this;
	},

	_on: function (obj, type, fn, context) {
		var id = type + L.stamp(fn) + (context ? '_' + L.stamp(context) : '');

		if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

		var handler = function (e) {
			return fn.call(context || obj, e || window.event);
		};

		var originalHandler = handler;

		if (L.Browser.pointer && type.indexOf('touch') === 0) {
			return this.addPointerListener(obj, type, handler, id);
		}
		if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		}

		if ('addEventListener' in obj) {

			if (type === 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false);
				obj.addEventListener(type, handler, false);

			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				handler = function (e) {
					e = e || window.event;
					if (!L.DomEvent._checkMouse(obj, e)) { return; }
					return originalHandler(e);
				};
				obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

			} else {
				if (type === 'click' && L.Browser.android) {
					handler = function (e) {
						return L.DomEvent._filterClick(e, originalHandler);
					};
				}
				obj.addEventListener(type, handler, false);
			}

		} else if ('attachEvent' in obj) {
			obj.attachEvent('on' + type, handler);
		}

		obj[eventsKey] = obj[eventsKey] || {};
		obj[eventsKey][id] = handler;

		return this;
	},

	_off: function (obj, type, fn, context) {

		var id = type + L.stamp(fn) + (context ? '_' + L.stamp(context) : ''),
		    handler = obj[eventsKey] && obj[eventsKey][id];

		if (!handler) { return this; }

		if (L.Browser.pointer && type.indexOf('touch') === 0) {
			this.removePointerListener(obj, type, id);

		} else if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);

		} else if ('removeEventListener' in obj) {

			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);

			} else {
				obj.removeEventListener(
					type === 'mouseenter' ? 'mouseover' :
					type === 'mouseleave' ? 'mouseout' : type, handler, false);
			}

		} else if ('detachEvent' in obj) {
			obj.detachEvent('on' + type, handler);
		}

		obj[eventsKey][id] = null;

		return this;
	},

	stopPropagation: function (e) {

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
		L.DomEvent._skipped(e);

		return this;
	},

	disableScrollPropagation: function (el) {
		return L.DomEvent.on(el, 'mousewheel MozMousePixelScroll', L.DomEvent.stopPropagation);
	},

	disableClickPropagation: function (el) {
		var stop = L.DomEvent.stopPropagation;

		L.DomEvent.on(el, L.Draggable.START.join(' '), stop);

		return L.DomEvent.on(el, {
			click: L.DomEvent._fakeStop,
			dblclick: stop
		});
	},

	preventDefault: function (e) {

		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
		return this;
	},

	stop: function (e) {
		return L.DomEvent
			.preventDefault(e)
			.stopPropagation(e);
	},

	getMousePosition: function (e, container) {
		if (!container) {
			return new L.Point(e.clientX, e.clientY);
		}

		var rect = container.getBoundingClientRect();

		return new L.Point(
			e.clientX - rect.left - container.clientLeft,
			e.clientY - rect.top - container.clientTop);
	},

	getWheelDelta: function (e) {

		var delta = 0;

		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	},

	_skipEvents: {},

	_fakeStop: function (e) {
		// fakes stopPropagation by setting a special event flag, checked/reset with L.DomEvent._skipped(e)
		L.DomEvent._skipEvents[e.type] = true;
	},

	_skipped: function (e) {
		var skipped = this._skipEvents[e.type];
		// reset when checking, as it's only used in map container and propagates outside of the map
		this._skipEvents[e.type] = false;
		return skipped;
	},

	// check if element really left/entered the event target (for mouseenter/mouseleave)
	_checkMouse: function (el, e) {

		var related = e.relatedTarget;

		if (!related) { return true; }

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}
		return (related !== el);
	},

	// this is a horrible workaround for a bug in Android where a single touch triggers two click events
	_filterClick: function (e, handler) {
		var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
			elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);

		// are they closer together than 500ms yet more than 100ms?
		// Android typically triggers them ~300ms apart while multiple listeners
		// on the same event should be triggered far faster;
		// or check if click is simulated on the element, and if it is, reject any non-simulated events

		if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
			L.DomEvent.stop(e);
			return;
		}
		L.DomEvent._lastClick = timeStamp;

		return handler(e);
	}
};

L.DomEvent.addListener = L.DomEvent.on;
L.DomEvent.removeListener = L.DomEvent.off;


/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Evented.extend({

	statics: {
		START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
		END: {
			mousedown: 'mouseup',
			touchstart: 'touchend',
			pointerdown: 'touchend',
			MSPointerDown: 'touchend'
		},
		MOVE: {
			mousedown: 'mousemove',
			touchstart: 'touchmove',
			pointerdown: 'touchmove',
			MSPointerDown: 'touchmove'
		}
	},

	initialize: function (element, dragStartTarget) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
	},

	enable: function () {
		if (this._enabled) { return; }

		L.DomEvent.on(this._dragStartTarget, L.Draggable.START.join(' '), this._onDown, this);

		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) { return; }

		L.DomEvent.off(this._dragStartTarget, L.Draggable.START.join(' '), this._onDown, this);

		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		this._moved = false;

		if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

		L.DomEvent.stopPropagation(e);

		if (L.Draggable._disabled) { return; }

		L.DomUtil.disableImageDrag();
		L.DomUtil.disableTextSelection();

		if (this._moving) { return; }

		this.fire('down');

		var first = e.touches ? e.touches[0] : e;

		this._startPoint = new L.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

		L.DomEvent
		    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
		    .on(document, L.Draggable.END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) {
			this._moved = true;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    newPoint = new L.Point(first.clientX, first.clientY),
		    offset = newPoint.subtract(this._startPoint);

		if (!offset.x && !offset.y) { return; }
		if (L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }

		L.DomEvent.preventDefault(e);

		if (!this._moved) {
			this.fire('dragstart');

			this._moved = true;
			this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);

			L.DomUtil.addClass(document.body, 'leaflet-dragging');

			this._lastTarget = e.target || e.srcElement;
			L.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},

	_updatePosition: function () {
		this.fire('predrag');
		L.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag');
	},

	_onUp: function () {
		L.DomUtil.removeClass(document.body, 'leaflet-dragging');

		if (this._lastTarget) {
			L.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
			this._lastTarget = null;
		}

		for (var i in L.Draggable.MOVE) {
			L.DomEvent
			    .off(document, L.Draggable.MOVE[i], this._onMove, this)
			    .off(document, L.Draggable.END[i], this._onUp, this);
		}

		L.DomUtil.enableImageDrag();
		L.DomUtil.enableTextSelection();

		if (this._moved && this._moving) {
			// ensure drag is not fired after dragend
			L.Util.cancelAnimFrame(this._animRequest);

			this.fire('dragend', {
				distance: this._newPos.distanceTo(this._startPos)
			});
		}

		this._moving = false;
	}
});


/*
	L.Handler is a base class for handler classes that are used internally to inject
	interaction features like dragging to classes like Map and Marker.
*/

L.Handler = L.Class.extend({
	initialize: function (map) {
		this._map = map;
	},

	enable: function () {
		if (this._enabled) { return; }

		this._enabled = true;
		this.addHooks();
	},

	disable: function () {
		if (!this._enabled) { return; }

		this._enabled = false;
		this.removeHooks();
	},

	enabled: function () {
		return !!this._enabled;
	}
});


/*
 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
 */

L.Map.mergeOptions({
	dragging: true,

	inertia: !L.Browser.android23,
	inertiaDeceleration: 3400, // px/s^2
	inertiaMaxSpeed: Infinity, // px/s
	inertiaThreshold: L.Browser.touch ? 32 : 18, // ms
	easeLinearity: 0.25,

	// TODO refactor, move to CRS
	worldCopyJump: false
});

L.Map.Drag = L.Handler.extend({
	addHooks: function () {
		if (!this._draggable) {
			var map = this._map;

			this._draggable = new L.Draggable(map._mapPane, map._container);

			this._draggable.on({
				down: this._onDown,
				dragstart: this._onDragStart,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this);

			if (map.options.worldCopyJump) {
				this._draggable.on('predrag', this._onPreDrag, this);
				map.on('viewreset', this._onViewReset, this);

				map.whenReady(this._onViewReset, this);
			}
		}
		this._draggable.enable();
	},

	removeHooks: function () {
		this._draggable.disable();
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDown: function () {
		if (this._map._panAnim) {
			this._map._panAnim.stop();
		}
	},

	_onDragStart: function () {
		var map = this._map;

		map
		    .fire('movestart')
		    .fire('dragstart');

		if (map.options.inertia) {
			this._positions = [];
			this._times = [];
		}
	},

	_onDrag: function () {
		if (this._map.options.inertia) {
			var time = this._lastTime = +new Date(),
			    pos = this._lastPos = this._draggable._newPos;

			this._positions.push(pos);
			this._times.push(time);

			if (time - this._times[0] > 200) {
				this._positions.shift();
				this._times.shift();
			}
		}

		this._map
		    .fire('move')
		    .fire('drag');
	},

	_onViewReset: function () {
		var pxCenter = this._map.getSize().divideBy(2),
		    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
		this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
	},

	_onPreDrag: function () {
		// TODO refactor to be able to adjust map pane position after zoom
		var worldWidth = this._worldWidth,
		    halfWidth = Math.round(worldWidth / 2),
		    dx = this._initialWorldOffset,
		    x = this._draggable._newPos.x,
		    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
		    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
		    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

		this._draggable._newPos.x = newX;
	},

	_onDragEnd: function (e) {
		var map = this._map,
		    options = map.options,
		    delay = +new Date() - this._lastTime,

		    noInertia = !options.inertia || delay > options.inertiaThreshold || !this._positions[0];

		map.fire('dragend', e);

		if (noInertia) {
			map.fire('moveend');

		} else {

			var direction = this._lastPos.subtract(this._positions[0]),
			    duration = (this._lastTime + delay - this._times[0]) / 1000,
			    ease = options.easeLinearity,

			    speedVector = direction.multiplyBy(ease / duration),
			    speed = speedVector.distanceTo([0, 0]),

			    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
			    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

			    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
			    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

			if (!offset.x || !offset.y) {
				map.fire('moveend');

			} else {
				offset = map._limitOffset(offset, map.options.maxBounds);

				L.Util.requestAnimFrame(function () {
					map.panBy(offset, {
						duration: decelerationDuration,
						easeLinearity: ease,
						noMoveStart: true
					});
				});
			}
		}
	}
});

L.Map.addInitHook('addHandler', 'dragging', L.Map.Drag);


/*
 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
 */

L.Map.mergeOptions({
	doubleClickZoom: true
});

L.Map.DoubleClickZoom = L.Handler.extend({
	addHooks: function () {
		this._map.on('dblclick', this._onDoubleClick, this);
	},

	removeHooks: function () {
		this._map.off('dblclick', this._onDoubleClick, this);
	},

	_onDoubleClick: function (e) {
		var map = this._map,
		    zoom = map.getZoom() + (e.originalEvent.shiftKey ? -1 : 1);

		if (map.options.doubleClickZoom === 'center') {
			map.setZoom(zoom);
		} else {
			map.setZoomAround(e.containerPoint, zoom);
		}
	}
});

L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);


/*
 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
 */

L.Map.mergeOptions({
	scrollWheelZoom: true,
	wheelDebounceTime: 40
});

L.Map.ScrollWheelZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, {
			mousewheel: this._onWheelScroll,
			MozMousePixelScroll: L.DomEvent.preventDefault
		}, this);

		this._delta = 0;
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, {
			mousewheel: this._onWheelScroll,
			MozMousePixelScroll: L.DomEvent.preventDefault
		}, this);
	},

	_onWheelScroll: function (e) {
		var delta = L.DomEvent.getWheelDelta(e);
		var debounce = this._map.options.wheelDebounceTime;

		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		if (!this._startTime) {
			this._startTime = +new Date();
		}

		var left = Math.max(debounce - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(L.bind(this._performZoom, this), left);

		L.DomEvent.stop(e);
	},

	_performZoom: function () {
		var map = this._map,
		    delta = this._delta,
		    zoom = map.getZoom();

		delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
		delta = Math.max(Math.min(delta, 4), -4);
		delta = map._limitZoom(zoom + delta) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta) { return; }

		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta);
		} else {
			map.setZoomAround(this._lastMousePos, zoom + delta);
		}
	}
});

L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);


/*
 * Extends the event handling code with double tap support for mobile browsers.
 */

L.extend(L.DomEvent, {

	_touchstart: L.Browser.msPointer ? 'MSPointerDown' : L.Browser.pointer ? 'pointerdown' : 'touchstart',
	_touchend: L.Browser.msPointer ? 'MSPointerUp' : L.Browser.pointer ? 'pointerup' : 'touchend',

	// inspired by Zepto touch code by Thomas Fuchs
	addDoubleTapListener: function (obj, handler, id) {
		var last, touch,
		    doubleTap = false,
		    delay = 250,
		    trackedTouches = [];

		function onTouchStart(e) {
			var count;

			if (L.Browser.pointer) {
				trackedTouches.push(e.pointerId);
				count = trackedTouches.length;
			} else {
				count = e.touches.length;
			}

			if (count > 1) { return; }

			var now = Date.now(),
			    delta = now - (last || now);

			touch = e.touches ? e.touches[0] : e;
			doubleTap = (delta > 0 && delta <= delay);
			last = now;
		}

		function onTouchEnd(e) {
			if (L.Browser.pointer) {
				var idx = trackedTouches.indexOf(e.pointerId);
				if (idx === -1) { return; }
				trackedTouches.splice(idx, 1);
			}

			if (doubleTap) {
				if (L.Browser.pointer) {
					// work around .type being readonly with MSPointer* events
					var newTouch = {},
						prop, i;

					for (i in touch) {
						prop = touch[i];
						newTouch[i] = prop && prop.bind ? prop.bind(touch) : prop;
					}
					touch = newTouch;
				}
				touch.type = 'dblclick';
				handler(touch);
				last = null;
			}
		}

		var pre = '_leaflet_',
		    touchstart = this._touchstart,
		    touchend = this._touchend;

		obj[pre + touchstart + id] = onTouchStart;
		obj[pre + touchend + id] = onTouchEnd;

		// on pointer we need to listen on the document, otherwise a drag starting on the map and moving off screen
		// will not come through to us, so we will lose track of how many touches are ongoing
		var endElement = L.Browser.pointer ? document.documentElement : obj;

		obj.addEventListener(touchstart, onTouchStart, false);

		endElement.addEventListener(touchend, onTouchEnd, false);
		if (L.Browser.pointer) {
			endElement.addEventListener(L.DomEvent.POINTER_CANCEL, onTouchEnd, false);
		}

		return this;
	},

	removeDoubleTapListener: function (obj, id) {
		var pre = '_leaflet_',
		    endElement = L.Browser.pointer ? document.documentElement : obj,
		    touchend = obj[pre + this._touchend + id];

		obj.removeEventListener(this._touchstart, obj[pre + this._touchstart + id], false);

		endElement.removeEventListener(this._touchend, touchend, false);
		if (L.Browser.pointer) {
			endElement.removeEventListener(L.DomEvent.POINTER_CANCEL, touchend, false);
		}

		return this;
	}
});


/*
 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
 */

L.extend(L.DomEvent, {

	POINTER_DOWN:   L.Browser.msPointer ? 'MSPointerDown'   : 'pointerdown',
	POINTER_MOVE:   L.Browser.msPointer ? 'MSPointerMove'   : 'pointermove',
	POINTER_UP:     L.Browser.msPointer ? 'MSPointerUp'     : 'pointerup',
	POINTER_CANCEL: L.Browser.msPointer ? 'MSPointerCancel' : 'pointercancel',

	_pointers: {},

	// Provides a touch events wrapper for (ms)pointer events.
	// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

	addPointerListener: function (obj, type, handler, id) {

		if (type === 'touchstart') {
			this._addPointerStart(obj, handler, id);

		} else if (type === 'touchmove') {
			this._addPointerMove(obj, handler, id);

		} else if (type === 'touchend') {
			this._addPointerEnd(obj, handler, id);
		}

		return this;
	},

	removePointerListener: function (obj, type, id) {
		var handler = obj['_leaflet_' + type + id];

		if (type === 'touchstart') {
			obj.removeEventListener(this.POINTER_DOWN, handler, false);

		} else if (type === 'touchmove') {
			obj.removeEventListener(this.POINTER_MOVE, handler, false);

		} else if (type === 'touchend') {
			obj.removeEventListener(this.POINTER_UP, handler, false);
			obj.removeEventListener(this.POINTER_CANCEL, handler, false);
		}

		return this;
	},

	_addPointerStart: function (obj, handler, id) {
		var onDown = L.bind(function (e) {
			L.DomEvent.preventDefault(e);

			this._pointers[e.pointerId] = e;
			this._handlePointer(e, handler);
		}, this);

		obj['_leaflet_touchstart' + id] = onDown;
		obj.addEventListener(this.POINTER_DOWN, onDown, false);

		// need to also listen for end events to keep the _pointers object accurate
		if (!this._pointerDocListener) {
			var removePointer = L.bind(function (e) {
				delete this._pointers[e.pointerId];
			}, this);

			// we listen documentElement as any drags that end by moving the touch off the screen get fired there
			document.documentElement.addEventListener(this.POINTER_UP, removePointer, false);
			document.documentElement.addEventListener(this.POINTER_CANCEL, removePointer, false);

			this._pointerDocListener = true;
		}
	},

	_handlePointer: function (e, handler) {
		e.touches = [];
		for (var i in this._pointers) {
			e.touches.push(this._pointers[i]);
		}
		e.changedTouches = [e];

		handler(e);
	},

	_addPointerMove: function (obj, handler, id) {
		var onMove = L.bind(function (e) {
			// don't fire touch moves when mouse isn't down
			if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

			this._pointers[e.pointerId] = e;
			this._handlePointer(e, handler);
		}, this);

		obj['_leaflet_touchmove' + id] = onMove;
		obj.addEventListener(this.POINTER_MOVE, onMove, false);
	},

	_addPointerEnd: function (obj, handler, id) {
		var onUp = L.bind(function (e) {
			delete this._pointers[e.pointerId];
			this._handlePointer(e, handler);
		}, this);

		obj['_leaflet_touchend' + id] = onUp;
		obj.addEventListener(this.POINTER_UP, onUp, false);
		obj.addEventListener(this.POINTER_CANCEL, onUp, false);
	}
});


/*
 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
 */

L.Map.mergeOptions({
	touchZoom: L.Browser.touch && !L.Browser.android23,
	bounceAtZoomLimits: true
});

L.Map.TouchZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		var map = this._map;

		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

		var p1 = map.mouseEventToLayerPoint(e.touches[0]),
		    p2 = map.mouseEventToLayerPoint(e.touches[1]),
		    viewCenter = map._getCenterLayerPoint();

		this._startCenter = p1.add(p2)._divideBy(2);
		this._startDist = p1.distanceTo(p2);

		this._moved = false;
		this._zooming = true;

		this._centerOffset = viewCenter.subtract(this._startCenter);

		if (map._panAnim) {
			map._panAnim.stop();
		}

		L.DomEvent
		    .on(document, 'touchmove', this._onTouchMove, this)
		    .on(document, 'touchend', this._onTouchEnd, this);

		L.DomEvent.preventDefault(e);
	},

	_onTouchMove: function (e) {
		if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

		var map = this._map,
		    p1 = map.mouseEventToLayerPoint(e.touches[0]),
		    p2 = map.mouseEventToLayerPoint(e.touches[1]);

		this._scale = p1.distanceTo(p2) / this._startDist;
		this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter);

		if (!map.options.bounceAtZoomLimits) {
			var currentZoom = map.getScaleZoom(this._scale);
			if ((currentZoom <= map.getMinZoom() && this._scale < 1) ||
		     (currentZoom >= map.getMaxZoom() && this._scale > 1)) { return; }
		}

		if (!this._moved) {
			map
			    .fire('movestart')
			    .fire('zoomstart');

			this._moved = true;
		}

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updateOnMove, this, true, this._map._container);

		L.DomEvent.preventDefault(e);
	},

	_updateOnMove: function () {
		var map = this._map;

		if (map.options.touchZoom === 'center') {
			this._center = map.getCenter();
		} else {
			this._center = map.layerPointToLatLng(this._getTargetCenter());
		}
		this._zoom = map.getScaleZoom(this._scale);

		map._animateZoom(this._center, this._zoom);
	},

	_onTouchEnd: function () {
		if (!this._moved || !this._zooming) {
			this._zooming = false;
			return;
		}

		this._zooming = false;
		L.Util.cancelAnimFrame(this._animRequest);

		L.DomEvent
		    .off(document, 'touchmove', this._onTouchMove)
		    .off(document, 'touchend', this._onTouchEnd);

		var map = this._map,
		    oldZoom = map.getZoom(),
		    zoomDelta = this._zoom - oldZoom,
		    finalZoom = map._limitZoom(oldZoom + (zoomDelta > 0 ? Math.ceil(zoomDelta) : Math.floor(zoomDelta)));

		map._animateZoom(this._center, finalZoom, true);
	},

	_getTargetCenter: function () {
		var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale);
		return this._startCenter.add(centerOffset);
	}
});

L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);


/*
 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
 */

L.Map.mergeOptions({
	tap: true,
	tapTolerance: 15
});

L.Map.Tap = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, 'touchstart', this._onDown, this);
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'touchstart', this._onDown, this);
	},

	_onDown: function (e) {
		if (!e.touches) { return; }

		L.DomEvent.preventDefault(e);

		this._fireClick = true;

		// don't simulate click or track longpress if more than 1 touch
		if (e.touches.length > 1) {
			this._fireClick = false;
			clearTimeout(this._holdTimeout);
			return;
		}

		var first = e.touches[0],
		    el = first.target;

		this._startPos = this._newPos = new L.Point(first.clientX, first.clientY);

		// if touching a link, highlight it
		if (el.tagName && el.tagName.toLowerCase() === 'a') {
			L.DomUtil.addClass(el, 'leaflet-active');
		}

		// simulate long hold but setting a timeout
		this._holdTimeout = setTimeout(L.bind(function () {
			if (this._isTapValid()) {
				this._fireClick = false;
				this._onUp();
				this._simulateEvent('contextmenu', first);
			}
		}, this), 1000);
		
		this._simulateEvent('mousedown', first);

		L.DomEvent.on(document, {
			touchmove: this._onMove,
			touchend: this._onUp
		}, this);
	},

	_onUp: function (e) {
		clearTimeout(this._holdTimeout);

		L.DomEvent.off(document, {
			touchmove: this._onMove,
			touchend: this._onUp
		}, this);

		if (this._fireClick && e && e.changedTouches) {

			var first = e.changedTouches[0],
			    el = first.target;

			if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
				L.DomUtil.removeClass(el, 'leaflet-active');
			}
			
			this._simulateEvent('mouseup', first);

			// simulate click if the touch didn't move too much
			if (this._isTapValid()) {
				this._simulateEvent('click', first);
			}
		}
	},

	_isTapValid: function () {
		return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
	},

	_onMove: function (e) {
		var first = e.touches[0];
		this._newPos = new L.Point(first.clientX, first.clientY);
	},

	_simulateEvent: function (type, e) {
		var simulatedEvent = document.createEvent('MouseEvents');

		simulatedEvent._simulated = true;
		e.target._simulatedClick = true;

		simulatedEvent.initMouseEvent(
		        type, true, true, window, 1,
		        e.screenX, e.screenY,
		        e.clientX, e.clientY,
		        false, false, false, false, 0, null);

		e.target.dispatchEvent(simulatedEvent);
	}
});

if (L.Browser.touch && !L.Browser.pointer) {
	L.Map.addInitHook('addHandler', 'tap', L.Map.Tap);
}


/*
 * L.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
  * (zoom to a selected bounding box), enabled by default.
 */

L.Map.mergeOptions({
	boxZoom: true
});

L.Map.BoxZoom = L.Handler.extend({
	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
	},

	addHooks: function () {
		L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
	},

	removeHooks: function () {
		L.DomEvent.off(this._container, 'mousedown', this._onMouseDown, this);
	},

	moved: function () {
		return this._moved;
	},

	_onMouseDown: function (e) {
		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

		this._moved = false;

		L.DomUtil.disableTextSelection();
		L.DomUtil.disableImageDrag();

		this._startPoint = this._map.mouseEventToContainerPoint(e);

		L.DomEvent.on(document, {
			contextmenu: L.DomEvent.stop,
			mousemove: this._onMouseMove,
			mouseup: this._onMouseUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onMouseMove: function (e) {
		if (!this._moved) {
			this._moved = true;

			this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._container);
			L.DomUtil.addClass(this._container, 'leaflet-crosshair');

			this._map.fire('boxzoomstart');
		}

		this._point = this._map.mouseEventToContainerPoint(e);

		var bounds = new L.Bounds(this._point, this._startPoint),
		    size = bounds.getSize();

		L.DomUtil.setPosition(this._box, bounds.min);

		this._box.style.width  = size.x + 'px';
		this._box.style.height = size.y + 'px';
	},

	_finish: function () {
		if (this._moved) {
			L.DomUtil.remove(this._box);
			L.DomUtil.removeClass(this._container, 'leaflet-crosshair');
		}

		L.DomUtil.enableTextSelection();
		L.DomUtil.enableImageDrag();

		L.DomEvent.off(document, {
			contextmenu: L.DomEvent.stop,
			mousemove: this._onMouseMove,
			mouseup: this._onMouseUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onMouseUp: function (e) {
		if ((e.which !== 1) && (e.button !== 1)) { return false; }

		this._finish();

		if (!this._moved) { return; }

		var bounds = new L.LatLngBounds(
		        this._map.containerPointToLatLng(this._startPoint),
		        this._map.containerPointToLatLng(this._point));

		this._map
			.fitBounds(bounds)
			.fire('boxzoomend', {boxZoomBounds: bounds});
	},

	_onKeyDown: function (e) {
		if (e.keyCode === 27) {
			this._finish();
		}
	}
});

L.Map.addInitHook('addHandler', 'boxZoom', L.Map.BoxZoom);


/*
 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
 */

L.Map.mergeOptions({
	keyboard: true,
	keyboardPanOffset: 80,
	keyboardZoomOffset: 1
});

L.Map.Keyboard = L.Handler.extend({

	keyCodes: {
		left:    [37],
		right:   [39],
		down:    [40],
		up:      [38],
		zoomIn:  [187, 107, 61, 171],
		zoomOut: [189, 109, 173]
	},

	initialize: function (map) {
		this._map = map;

		this._setPanOffset(map.options.keyboardPanOffset);
		this._setZoomOffset(map.options.keyboardZoomOffset);
	},

	addHooks: function () {
		var container = this._map._container;

		// make the container focusable by tabbing
		if (container.tabIndex === -1) {
			container.tabIndex = '0';
		}

		L.DomEvent.on(container, {
		    focus: this._onFocus,
		    blur: this._onBlur,
		    mousedown: this._onMouseDown
		}, this);

		this._map.on({
			focus: this._addHooks,
		    blur: this._removeHooks
		}, this);
	},

	removeHooks: function () {
		this._removeHooks();

		L.DomEvent.off(this._map._container, {
		    focus: this._onFocus,
		    blur: this._onBlur,
		    mousedown: this._onMouseDown
		}, this);

		this._map.off({
			focus: this._addHooks,
		    blur: this._removeHooks
		}, this);
	},

	_onMouseDown: function () {
		if (this._focused) { return; }

		var body = document.body,
		    docEl = document.documentElement,
		    top = body.scrollTop || docEl.scrollTop,
		    left = body.scrollLeft || docEl.scrollLeft;

		this._map._container.focus();

		window.scrollTo(left, top);
	},

	_onFocus: function () {
		this._focused = true;
		this._map.fire('focus');
	},

	_onBlur: function () {
		this._focused = false;
		this._map.fire('blur');
	},

	_setPanOffset: function (pan) {
		var keys = this._panKeys = {},
		    codes = this.keyCodes,
		    i, len;

		for (i = 0, len = codes.left.length; i < len; i++) {
			keys[codes.left[i]] = [-1 * pan, 0];
		}
		for (i = 0, len = codes.right.length; i < len; i++) {
			keys[codes.right[i]] = [pan, 0];
		}
		for (i = 0, len = codes.down.length; i < len; i++) {
			keys[codes.down[i]] = [0, pan];
		}
		for (i = 0, len = codes.up.length; i < len; i++) {
			keys[codes.up[i]] = [0, -1 * pan];
		}
	},

	_setZoomOffset: function (zoom) {
		var keys = this._zoomKeys = {},
		    codes = this.keyCodes,
		    i, len;

		for (i = 0, len = codes.zoomIn.length; i < len; i++) {
			keys[codes.zoomIn[i]] = zoom;
		}
		for (i = 0, len = codes.zoomOut.length; i < len; i++) {
			keys[codes.zoomOut[i]] = -zoom;
		}
	},

	_addHooks: function () {
		L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
	},

	_removeHooks: function () {
		L.DomEvent.off(document, 'keydown', this._onKeyDown, this);
	},

	_onKeyDown: function (e) {
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		var key = e.keyCode,
		    map = this._map;

		if (key in this._panKeys) {

			if (map._panAnim && map._panAnim._inProgress) { return; }

			map.panBy(this._panKeys[key]);

			if (map.options.maxBounds) {
				map.panInsideBounds(map.options.maxBounds);
			}

		} else if (key in this._zoomKeys) {
			map.setZoom(map.getZoom() + this._zoomKeys[key]);

		} else {
			return;
		}

		L.DomEvent.stop(e);
	}
});

L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);


/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */

L.Handler.MarkerDrag = L.Handler.extend({
	initialize: function (marker) {
		this._marker = marker;
	},

	addHooks: function () {
		var icon = this._marker._icon;

		if (!this._draggable) {
			this._draggable = new L.Draggable(icon, icon);
		}

		this._draggable.on({
			dragstart: this._onDragStart,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).enable();

		L.DomUtil.addClass(icon, 'leaflet-marker-draggable');
	},

	removeHooks: function () {
		this._draggable.off({
			dragstart: this._onDragStart,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).disable();

		L.DomUtil.removeClass(this._marker._icon, 'leaflet-marker-draggable');
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function () {
		this._marker
		    .closePopup()
		    .fire('movestart')
		    .fire('dragstart');
	},

	_onDrag: function () {
		var marker = this._marker,
		    shadow = marker._shadow,
		    iconPos = L.DomUtil.getPosition(marker._icon),
		    latlng = marker._map.layerPointToLatLng(iconPos);

		// update shadow position
		if (shadow) {
			L.DomUtil.setPosition(shadow, iconPos);
		}

		marker._latlng = latlng;

		marker
		    .fire('move', {latlng: latlng})
		    .fire('drag');
	},

	_onDragEnd: function (e) {
		this._marker
		    .fire('moveend')
		    .fire('dragend', e);
	}
});


/*
 * L.Control is a base class for implementing map controls. Handles positioning.
 * All other controls extend from this class.
 */

L.Control = L.Class.extend({
	options: {
		position: 'topright'
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	getPosition: function () {
		return this.options.position;
	},

	setPosition: function (position) {
		var map = this._map;

		if (map) {
			map.removeControl(this);
		}

		this.options.position = position;

		if (map) {
			map.addControl(this);
		}

		return this;
	},

	getContainer: function () {
		return this._container;
	},

	addTo: function (map) {
		this._map = map;

		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		L.DomUtil.addClass(container, 'leaflet-control');

		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}

		return this;
	},

	remove: function () {
		L.DomUtil.remove(this._container);

		if (this.onRemove) {
			this.onRemove(this._map);
		}

		this._map = null;

		return this;
	},

	_refocusOnMap: function () {
		if (this._map) {
			this._map.getContainer().focus();
		}
	}
});

L.control = function (options) {
	return new L.Control(options);
};


// adds control-related methods to L.Map

L.Map.include({
	addControl: function (control) {
		control.addTo(this);
		return this;
	},

	removeControl: function (control) {
		control.remove();
		return this;
	},

	_initControlPos: function () {
		var corners = this._controlCorners = {},
		    l = 'leaflet-',
		    container = this._controlContainer =
		            L.DomUtil.create('div', l + 'control-container', this._container);

		function createCorner(vSide, hSide) {
			var className = l + vSide + ' ' + l + hSide;

			corners[vSide + hSide] = L.DomUtil.create('div', className, container);
		}

		createCorner('top', 'left');
		createCorner('top', 'right');
		createCorner('bottom', 'left');
		createCorner('bottom', 'right');
	},

	_clearControlPos: function () {
		L.DomUtil.remove(this._controlContainer);
	}
});


/*
 * L.Control.Zoom is used for the default zoom buttons on the map.
 */

L.Control.Zoom = L.Control.extend({
	options: {
		position: 'topleft',
		zoomInText: '+',
		zoomInTitle: 'Zoom in',
		zoomOutText: '-',
		zoomOutTitle: 'Zoom out'
	},

	onAdd: function (map) {
		var zoomName = 'leaflet-control-zoom',
		    container = L.DomUtil.create('div', zoomName + ' leaflet-bar'),
		    options = this.options;

		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
		        zoomName + '-in',  container, this._zoomIn);
		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
		        zoomName + '-out', container, this._zoomOut);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	_zoomIn: function (e) {
		this._map.zoomIn(e.shiftKey ? 3 : 1);
	},

	_zoomOut: function (e) {
		this._map.zoomOut(e.shiftKey ? 3 : 1);
	},

	_createButton: function (html, title, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		L.DomEvent
		    .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
		    .on(link, 'click', L.DomEvent.stop)
		    .on(link, 'click', fn, this)
		    .on(link, 'click', this._refocusOnMap, this);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
			className = 'leaflet-disabled';

		L.DomUtil.removeClass(this._zoomInButton, className);
		L.DomUtil.removeClass(this._zoomOutButton, className);

		if (map._zoom === map.getMinZoom()) {
			L.DomUtil.addClass(this._zoomOutButton, className);
		}
		if (map._zoom === map.getMaxZoom()) {
			L.DomUtil.addClass(this._zoomInButton, className);
		}
	}
});

L.Map.mergeOptions({
	zoomControl: true
});

L.Map.addInitHook(function () {
	if (this.options.zoomControl) {
		this.zoomControl = new L.Control.Zoom();
		this.addControl(this.zoomControl);
	}
});

L.control.zoom = function (options) {
	return new L.Control.Zoom(options);
};



/*
 * L.Control.Attribution is used for displaying attribution on the map (added by default).
 */

L.Control.Attribution = L.Control.extend({
	options: {
		position: 'bottomright',
		prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
	},

	initialize: function (options) {
		L.setOptions(this, options);

		this._attributions = {};
	},

	onAdd: function (map) {
		this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
		L.DomEvent.disableClickPropagation(this._container);

		// TODO ugly, refactor
		for (var i in map._layers) {
			if (map._layers[i].getAttribution) {
				this.addAttribution(map._layers[i].getAttribution());
			}
		}

		this._update();

		return this._container;
	},

	setPrefix: function (prefix) {
		this.options.prefix = prefix;
		this._update();
		return this;
	},

	addAttribution: function (text) {
		if (!text) { return; }

		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;

		this._update();

		return this;
	},

	removeAttribution: function (text) {
		if (!text) { return; }

		if (this._attributions[text]) {
			this._attributions[text]--;
			this._update();
		}

		return this;
	},

	_update: function () {
		if (!this._map) { return; }

		var attribs = [];

		for (var i in this._attributions) {
			if (this._attributions[i]) {
				attribs.push(i);
			}
		}

		var prefixAndAttribs = [];

		if (this.options.prefix) {
			prefixAndAttribs.push(this.options.prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' | ');
	}
});

L.Map.mergeOptions({
	attributionControl: true
});

L.Map.addInitHook(function () {
	if (this.options.attributionControl) {
		this.attributionControl = (new L.Control.Attribution()).addTo(this);
	}
});

L.control.attribution = function (options) {
	return new L.Control.Attribution(options);
};


/*
 * L.Control.Scale is used for displaying metric/imperial scale on the map.
 */

L.Control.Scale = L.Control.extend({
	options: {
		position: 'bottomleft',
		maxWidth: 100,
		metric: true,
		imperial: true
		// updateWhenIdle: false
	},

	onAdd: function (map) {
		var className = 'leaflet-control-scale',
		    container = L.DomUtil.create('div', className),
		    options = this.options;

		this._addScales(options, className + '-line', container);

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		map.whenReady(this._update, this);

		return container;
	},

	onRemove: function (map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	},

	_addScales: function (options, className, container) {
		if (options.metric) {
			this._mScale = L.DomUtil.create('div', className, container);
		}
		if (options.imperial) {
			this._iScale = L.DomUtil.create('div', className, container);
		}
	},

	_update: function () {
		var map = this._map,
		    y = map.getSize().y / 2;

		var maxMeters = L.CRS.Earth.distance(
				map.containerPointToLatLng([0, y]),
				map.containerPointToLatLng([this.options.maxWidth, y]));

		this._updateScales(maxMeters);
	},

	_updateScales: function (maxMeters) {
		if (this.options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}
		if (this.options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}
	},

	_updateMetric: function (maxMeters) {
		var meters = this._getRoundNum(maxMeters),
		    label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

		this._updateScale(this._mScale, label, meters / maxMeters);
	},

	_updateImperial: function (maxMeters) {
		var maxFeet = maxMeters * 3.2808399,
		    maxMiles, miles, feet;

		if (maxFeet > 5280) {
			maxMiles = maxFeet / 5280;
			miles = this._getRoundNum(maxMiles);
			this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);

		} else {
			feet = this._getRoundNum(maxFeet);
			this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
		}
	},

	_updateScale: function (scale, text, ratio) {
		scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
		scale.innerHTML = text;
	},

	_getRoundNum: function (num) {
		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
		    d = num / pow10;

		d = d >= 10 ? 10 :
		    d >= 5 ? 5 :
		    d >= 3 ? 3 :
		    d >= 2 ? 2 : 1;

		return pow10 * d;
	}
});

L.control.scale = function (options) {
	return new L.Control.Scale(options);
};


/*
 * L.Control.Layers is a control to allow users to switch between different layers on the map.
 */

L.Control.Layers = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		autoZIndex: true
	},

	initialize: function (baseLayers, overlays, options) {
		L.setOptions(this, options);

		this._layers = {};
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
	},

	onAdd: function () {
		this._initLayout();
		this._update();

		return this._container;
	},

	addBaseLayer: function (layer, name) {
		this._addLayer(layer, name);
		return this._update();
	},

	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
		return this._update();
	},

	removeLayer: function (layer) {
		layer.off('add remove', this._onLayerChange, this);

		delete this._layers[L.stamp(layer)];
		return this._update();
	},

	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = L.DomUtil.create('div', className);

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
			if (!L.Browser.android) {
				L.DomEvent.on(container, {
					mouseenter: this._expand,
					mouseleave: this._collapse
				}, this);
			}

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
				L.DomEvent
				    .on(link, 'click', L.DomEvent.stop)
				    .on(link, 'click', this._expand, this);
			} else {
				L.DomEvent.on(link, 'focus', this._expand, this);
			}

			// work around for Firefox Android issue https://github.com/Leaflet/Leaflet/issues/2033
			L.DomEvent.on(form, 'click', function () {
				setTimeout(L.bind(this._onInputClick, this), 0);
			}, this);

			this._map.on('click', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			this._expand();
		}

		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', className + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

		container.appendChild(form);
	},

	_addLayer: function (layer, name, overlay) {
		layer.on('add remove', this._onLayerChange, this);

		var id = L.stamp(layer);

		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay
		};

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}
	},

	_update: function () {
		if (!this._container) { return; }

		L.DomUtil.empty(this._baseLayersList);
		L.DomUtil.empty(this._overlaysList);

		var baseLayersPresent, overlaysPresent, i, obj;

		for (i in this._layers) {
			obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
		}

		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

		return this;
	},

	_onLayerChange: function (e) {
		if (!this._handlingClick) {
			this._update();
		}

		var overlay = this._layers[L.stamp(e.target)].overlay;

		var type = overlay ?
			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
			(e.type === 'add' ? 'baselayerchange' : null);

		if (type) {
			this._map.fire(type, e.target);
		}
	},

	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},

	_addItem: function (obj) {
		var label = document.createElement('label'),
		    checked = this._map.hasLayer(obj.layer),
		    input;

		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

		input.layerId = L.stamp(obj.layer);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		label.appendChild(input);
		label.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);

		return label;
	},

	_onInputClick: function () {
		var inputs = this._form.getElementsByTagName('input'),
		    input, layer, hasLayer;

		this._handlingClick = true;

		for (var i = 0, len = inputs.length; i < len; i++) {
			input = inputs[i];
			layer = this._layers[input.layerId].layer;
			hasLayer = this._map.hasLayer(layer);

			if (input.checked && !hasLayer) {
				this._map.addLayer(layer);

			} else if (!input.checked && hasLayer) {
				this._map.removeLayer(layer);
			}
		}

		this._handlingClick = false;

		this._refocusOnMap();
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
	},

	_collapse: function () {
		L.DomUtil.removeClass(this._container, 'leaflet-control-layers-expanded');
	}
});

L.control.layers = function (baseLayers, overlays, options) {
	return new L.Control.Layers(baseLayers, overlays, options);
};


/*
 * L.PosAnimation is used by Leaflet internally for pan animations.
 */

L.PosAnimation = L.Evented.extend({

	run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
		this.stop();

		this._el = el;
		this._inProgress = true;
		this._newPos = newPos;

		this.fire('start');

		el.style[L.DomUtil.TRANSITION] = 'all ' + (duration || 0.25) +
		        's cubic-bezier(0,0,' + (easeLinearity || 0.5) + ',1)';

		L.DomEvent.on(el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
		L.DomUtil.setPosition(el, newPos);

		// there's no native way to track value updates of transitioned properties, so we imitate this
		this._stepTimer = setInterval(L.bind(this._onStep, this), 50);
	},

	stop: function () {
		if (!this._inProgress) { return; }

		// if we just removed the transition property, the element would jump to its final position,
		// so we need to make it stay at the current position

                // Only setPosition if _getPos actually returns a valid position.
		this._newPos = this._getPos();
		if (this._newPos) {
		    L.DomUtil.setPosition(this._el, this._newPos);
		}

		this._onTransitionEnd();
		L.Util.falseFn(this._el.offsetWidth); // force reflow in case we are about to start a new animation
	},

	_onStep: function () {
		var stepPos = this._getPos();
		if (!stepPos) {
			this._onTransitionEnd();
			return;
		}
		// jshint camelcase: false
		// make L.DomUtil.getPosition return intermediate position value during animation
		this._el._leaflet_pos = stepPos;

		this.fire('step');
	},

	// you can't easily get intermediate values of properties animated with CSS3 Transitions,
	// we need to parse computed style (in case of transform it returns matrix string)

	_transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,

	_getPos: function () {
		var left, top, matches,
		    el = this._el,
		    style = window.getComputedStyle(el);

		if (L.Browser.any3d) {
			matches = style[L.DomUtil.TRANSFORM].match(this._transformRe);
			if (!matches) { return; }
			left = parseFloat(matches[1]);
			top  = parseFloat(matches[2]);
		} else {
			left = parseFloat(style.left);
			top  = parseFloat(style.top);
		}

		return new L.Point(left, top, true);
	},

	_onTransitionEnd: function () {
		L.DomEvent.off(this._el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);

		if (!this._inProgress) { return; }
		this._inProgress = false;

		this._el.style[L.DomUtil.TRANSITION] = '';

		// jshint camelcase: false
		// make sure L.DomUtil.getPosition returns the final position value after animation
		this._el._leaflet_pos = this._newPos;

		clearInterval(this._stepTimer);

		this.fire('step').fire('end');
	}

});


/*
 * Extends L.Map to handle panning animations.
 */

L.Map.include({

	setView: function (center, zoom, options) {

		zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
		center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
		options = options || {};

		if (this._panAnim) {
			this._panAnim.stop();
		}

		if (this._loaded && !options.reset && options !== true) {

			if (options.animate !== undefined) {
				options.zoom = L.extend({animate: options.animate}, options.zoom);
				options.pan = L.extend({animate: options.animate}, options.pan);
			}

			// try animating pan or zoom
			var animated = (this._zoom !== zoom) ?
				this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
				this._tryAnimatedPan(center, options.pan);

			if (animated) {
				// prevent resize handler call, the view will refresh after animation anyway
				clearTimeout(this._sizeTimer);
				return this;
			}
		}

		// animation didn't start, just reset the map view
		this._resetView(center, zoom);

		return this;
	},

	panBy: function (offset, options) {
		offset = L.point(offset).round();
		options = options || {};

		if (!offset.x && !offset.y) {
			return this;
		}
		//If we pan too far then chrome gets issues with tiles
		// and makes them disappear or appear in the wrong place (slightly offset) #2602
		if (options.animate !== true && !this.getSize().contains(offset)) {
			return this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
		}

		if (!this._panAnim) {
			this._panAnim = new L.PosAnimation();

			this._panAnim.on({
				'step': this._onPanTransitionStep,
				'end': this._onPanTransitionEnd
			}, this);
		}

		// don't fire movestart if animating inertia
		if (!options.noMoveStart) {
			this.fire('movestart');
		}

		// animate pan unless animate: false specified
		if (options.animate !== false) {
			L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');

			var newPos = this._getMapPanePos().subtract(offset);
			this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
		} else {
			this._rawPanBy(offset);
			this.fire('move').fire('moveend');
		}

		return this;
	},

	_onPanTransitionStep: function () {
		this.fire('move');
	},

	_onPanTransitionEnd: function () {
		L.DomUtil.removeClass(this._mapPane, 'leaflet-pan-anim');
		this.fire('moveend');
	},

	_tryAnimatedPan: function (center, options) {
		// difference between the new and current centers in pixels
		var offset = this._getCenterOffset(center)._floor();

		// don't animate too far unless animate: true specified in options
		if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

		this.panBy(offset, options);

		return true;
	}
});


/*
 * L.PosAnimation fallback implementation that powers Leaflet pan animations
 * in browsers that don't support CSS3 Transitions.
 */

L.PosAnimation = L.DomUtil.TRANSITION ? L.PosAnimation : L.PosAnimation.extend({

	run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
		this.stop();

		this._el = el;
		this._inProgress = true;
		this._duration = duration || 0.25;
		this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

		this._startPos = L.DomUtil.getPosition(el);
		this._offset = newPos.subtract(this._startPos);
		this._startTime = +new Date();

		this.fire('start');

		this._animate();
	},

	stop: function () {
		if (!this._inProgress) { return; }

		this._step();
		this._complete();
	},

	_animate: function () {
		// animation loop
		this._animId = L.Util.requestAnimFrame(this._animate, this);
		this._step();
	},

	_step: function () {
		var elapsed = (+new Date()) - this._startTime,
		    duration = this._duration * 1000;

		if (elapsed < duration) {
			this._runFrame(this._easeOut(elapsed / duration));
		} else {
			this._runFrame(1);
			this._complete();
		}
	},

	_runFrame: function (progress) {
		var pos = this._startPos.add(this._offset.multiplyBy(progress));
		L.DomUtil.setPosition(this._el, pos);

		this.fire('step');
	},

	_complete: function () {
		L.Util.cancelAnimFrame(this._animId);

		this._inProgress = false;
		this.fire('end');
	},

	_easeOut: function (t) {
		return 1 - Math.pow(1 - t, this._easeOutPower);
	}
});


/*
 * Extends L.Map to handle zoom animations.
 */

L.Map.mergeOptions({
	zoomAnimation: true,
	zoomAnimationThreshold: 4
});

var zoomAnimated = L.DomUtil.TRANSITION && L.Browser.any3d && !L.Browser.mobileOpera;

if (zoomAnimated) {

	L.Map.addInitHook(function () {
		// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
		this._zoomAnimated = this.options.zoomAnimation;

		// zoom transitions run with the same duration for all layers, so if one of transitionend events
		// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
		if (this._zoomAnimated) {
			L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
		}
	});
}

L.Map.include(!zoomAnimated ? {} : {

	_catchTransitionEnd: function (e) {
		if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
			this._onZoomTransitionEnd();
		}
	},

	_nothingToAnimate: function () {
		return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
	},

	_tryAnimatedZoom: function (center, zoom, options) {

		if (this._animatingZoom) { return true; }

		options = options || {};

		// don't animate if disabled, not supported or zoom difference is too large
		if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
		        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

		// offset is the pixel coords of the zoom origin relative to the current center
		var scale = this.getZoomScale(zoom),
		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

		// don't animate if the zoom origin isn't within one screen from the current center, unless forced
		if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

		L.Util.requestAnimFrame(function () {
			this
			    .fire('movestart')
			    .fire('zoomstart')
			    ._animateZoom(center, zoom, true);
		}, this);

		return true;
	},

	_animateZoom: function (center, zoom, startAnim) {
		if (startAnim) {
			this._animatingZoom = true;

			// remember what center/zoom to set after animation
			this._animateToCenter = center;
			this._animateToZoom = zoom;

			// disable any dragging during animation
			if (L.Draggable) {
				L.Draggable._disabled = true;
			}

			L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');
		}

		var scale = this.getZoomScale(zoom),
			origin = this._getCenterLayerPoint().add(this._getCenterOffset(center)._divideBy(1 - 1 / scale));

		this.fire('zoomanim', {
			center: center,
			zoom: zoom,
			origin: origin,
			scale: scale
		});
	},

	_onZoomTransitionEnd: function () {

		this._animatingZoom = false;

		L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');

		this._resetView(this._animateToCenter, this._animateToZoom, true, true);

		if (L.Draggable) {
			L.Draggable._disabled = false;
		}
	}
});


/*
 * Provides L.Map with convenient shortcuts for using browser geolocation features.
 */

L.Map.include({
	_defaultLocateOptions: {
		timeout: 10000,
		watch: false
		// setView: false
		// maxZoom: <Number>
		// maximumAge: 0
		// enableHighAccuracy: false
	},

	locate: function (/*Object*/ options) {

		options = this._locateOptions = L.extend(this._defaultLocateOptions, options);

		if (!navigator.geolocation) {
			this._handleGeolocationError({
				code: 0,
				message: 'Geolocation not supported.'
			});
			return this;
		}

		var onResponse = L.bind(this._handleGeolocationResponse, this),
			onError = L.bind(this._handleGeolocationError, this);

		if (options.watch) {
			this._locationWatchId =
			        navigator.geolocation.watchPosition(onResponse, onError, options);
		} else {
			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
		}
		return this;
	},

	stopLocate: function () {
		if (navigator.geolocation) {
			navigator.geolocation.clearWatch(this._locationWatchId);
		}
		if (this._locateOptions) {
			this._locateOptions.setView = false;
		}
		return this;
	},

	_handleGeolocationError: function (error) {
		var c = error.code,
		    message = error.message ||
		            (c === 1 ? 'permission denied' :
		            (c === 2 ? 'position unavailable' : 'timeout'));

		if (this._locateOptions.setView && !this._loaded) {
			this.fitWorld();
		}

		this.fire('locationerror', {
			code: c,
			message: 'Geolocation error: ' + message + '.'
		});
	},

	_handleGeolocationResponse: function (pos) {
		var lat = pos.coords.latitude,
		    lng = pos.coords.longitude,
		    latlng = new L.LatLng(lat, lng),

		    latAccuracy = 180 * pos.coords.accuracy / 40075017,
		    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * lat),

		    bounds = L.latLngBounds(
		            [lat - latAccuracy, lng - lngAccuracy],
		            [lat + latAccuracy, lng + lngAccuracy]),

		    options = this._locateOptions;

		if (options.setView) {
			var zoom = this.getBoundsZoom(bounds);
			this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
		}

		var data = {
			latlng: latlng,
			bounds: bounds,
			timestamp: pos.timestamp
		};

		for (var i in pos.coords) {
			if (typeof pos.coords[i] === 'number') {
				data[i] = pos.coords[i];
			}
		}

		this.fire('locationfound', data);
	}
});


}(window, document));;!function t(e,n,o){function i(a,s){if(!n[a]){if(!e[a]){var l="function"==typeof require&&require;if(!s&&l)return l(a,!0);if(r)return r(a,!0);throw new Error("Cannot find module '"+a+"'")}var c=n[a]={exports:{}};e[a][0].call(c.exports,function(t){var n=e[a][1][t];return i(n?n:t)},c,c.exports,t,e,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(t,e){function n(t,e,n){function o(t){return t>=200&&300>t||304===t}function i(){void 0===s.status||o(s.status)?e.call(s,null,s):e.call(s,s,null)}var r=!1;if("undefined"==typeof window.XMLHttpRequest)return e(Error("Browser not supported"));if("undefined"==typeof n){var a=t.match(/^\s*https?:\/\/[^\/]*/);n=a&&a[0]!==location.protocol+"//"+location.domain+(location.port?":"+location.port:"")}var s=new window.XMLHttpRequest;if(n&&!("withCredentials"in s)){s=new window.XDomainRequest;var l=e;e=function(){if(r)l.apply(this,arguments);else{var t=this,e=arguments;setTimeout(function(){l.apply(t,e)},0)}}}return"onload"in s?s.onload=i:s.onreadystatechange=function(){4===s.readyState&&i()},s.onerror=function(t){e.call(this,t||!0,null),e=function(){}},s.onprogress=function(){},s.ontimeout=function(t){e.call(this,t,null),e=function(){}},s.onabort=function(t){e.call(this,t,null),e=function(){}},s.open("GET",t,!0),s.send(null),r=!0,s}"undefined"!=typeof e&&(e.exports=n)},{}],2:[function(t,e,n){!function(t,e){if("object"==typeof n&&n)e(n);else{var o={};e(o),"function"==typeof define&&define.amd?define(o):t.Mustache=o}}(this,function(t){function e(t,e){return y.call(t,e)}function n(t){return!e(g,t)}function o(t){return"function"==typeof t}function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function r(t){return String(t).replace(/[&<>"'\/]/g,function(t){return E[t]})}function a(t){this.string=t,this.tail=t,this.pos=0}function s(t,e){this.view=null==t?{}:t,this.parent=e,this._cache={".":this.view}}function l(){this.clearCache()}function c(e,n,i,r){function a(t){return n.render(t,i)}for(var s,l,u,h="",p=0,d=e.length;d>p;++p)switch(s=e[p],l=s[1],s[0]){case"#":if(u=i.lookup(l),"object"==typeof u||"string"==typeof u)if(T(u))for(var m=0,f=u.length;f>m;++m)h+=c(s[4],n,i.push(u[m]),r);else u&&(h+=c(s[4],n,i.push(u),r));else if(o(u)){var g=null==r?null:r.slice(s[3],s[5]);u=u.call(i.view,g,a),null!=u&&(h+=u)}else u&&(h+=c(s[4],n,i,r));break;case"^":u=i.lookup(l),(!u||T(u)&&0===u.length)&&(h+=c(s[4],n,i,r));break;case">":u=n.getPartial(l),o(u)&&(h+=u(i));break;case"&":u=i.lookup(l),null!=u&&(h+=u);break;case"name":u=i.lookup(l),null!=u&&(h+=t.escape(u));break;case"text":h+=l}return h}function u(t){for(var e,n=[],o=n,i=[],r=0,a=t.length;a>r;++r)switch(e=t[r],e[0]){case"#":case"^":i.push(e),o.push(e),o=e[4]=[];break;case"/":var s=i.pop();s[5]=e[2],o=i.length>0?i[i.length-1][4]:n;break;default:o.push(e)}return n}function h(t){for(var e,n,o=[],i=0,r=t.length;r>i;++i)e=t[i],e&&("text"===e[0]&&n&&"text"===n[0]?(n[1]+=e[1],n[3]=e[3]):(n=e,o.push(e)));return o}function p(t){return[new RegExp(i(t[0])+"\\s*"),new RegExp("\\s*"+i(t[1]))]}function d(e,o){function r(){if(x&&!M)for(;w.length;)delete C[w.pop()];else w=[];x=!1,M=!1}if(e=e||"",o=o||t.tags,"string"==typeof o&&(o=o.split(f)),2!==o.length)throw new Error("Invalid tags: "+o.join(", "));for(var s,l,c,d,g,y,b=p(o),T=new a(e),E=[],C=[],w=[],x=!1,M=!1;!T.eos();){if(s=T.pos,c=T.scanUntil(b[0]))for(var k=0,S=c.length;S>k;++k)d=c.charAt(k),n(d)?w.push(C.length):M=!0,C.push(["text",d,s,s+1]),s+=1,"\n"==d&&r();if(!T.scan(b[0]))break;if(x=!0,l=T.scan(v)||"name",T.scan(m),"="===l?(c=T.scanUntil(_),T.scan(_),T.scanUntil(b[1])):"{"===l?(c=T.scanUntil(new RegExp("\\s*"+i("}"+o[1]))),T.scan(L),T.scanUntil(b[1]),l="&"):c=T.scanUntil(b[1]),!T.scan(b[1]))throw new Error("Unclosed tag at "+T.pos);if(g=[l,c,s,T.pos],C.push(g),"#"===l||"^"===l)E.push(g);else if("/"===l){if(y=E.pop(),!y)throw new Error('Unopened section "'+c+'" at '+s);if(y[1]!==c)throw new Error('Unclosed section "'+y[1]+'" at '+s)}else if("name"===l||"{"===l||"&"===l)M=!0;else if("="===l){if(o=c.split(f),2!==o.length)throw new Error("Invalid tags at "+s+": "+o.join(", "));b=p(o)}}if(y=E.pop())throw new Error('Unclosed section "'+y[1]+'" at '+T.pos);return u(h(C))}var m=/\s*/,f=/\s+/,g=/\S/,_=/\s*=/,L=/\s*\}/,v=/#|\^|\/|>|\{|&|=|!/,y=RegExp.prototype.test,b=Object.prototype.toString,T=Array.isArray||function(t){return"[object Array]"===b.call(t)},E={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};a.prototype.eos=function(){return""===this.tail},a.prototype.scan=function(t){var e=this.tail.match(t);if(e&&0===e.index){var n=e[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n}return""},a.prototype.scanUntil=function(t){var e,n=this.tail.search(t);switch(n){case-1:e=this.tail,this.tail="";break;case 0:e="";break;default:e=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=e.length,e},s.make=function(t){return t instanceof s?t:new s(t)},s.prototype.push=function(t){return new s(t,this)},s.prototype.lookup=function(t){var e;if(t in this._cache)e=this._cache[t];else{for(var n=this;n;){if(t.indexOf(".")>0){e=n.view;for(var i=t.split("."),r=0;null!=e&&r<i.length;)e=e[i[r++]]}else e=n.view[t];if(null!=e)break;n=n.parent}this._cache[t]=e}return o(e)&&(e=e.call(this.view)),e},l.prototype.clearCache=function(){this._cache={},this._partialCache={}},l.prototype.compile=function(e,n){var o=this._cache[e];if(!o){var i=t.parse(e,n);o=this._cache[e]=this.compileTokens(i,e)}return o},l.prototype.compilePartial=function(t,e,n){var o=this.compile(e,n);return this._partialCache[t]=o,o},l.prototype.getPartial=function(t){return t in this._partialCache||!this._loadPartial||this.compilePartial(t,this._loadPartial(t)),this._partialCache[t]},l.prototype.compileTokens=function(t,e){var n=this;return function(i,r){if(r)if(o(r))n._loadPartial=r;else for(var a in r)n.compilePartial(a,r[a]);return c(t,n,s.make(i),e)}},l.prototype.render=function(t,e,n){return this.compile(t)(e,n)},t.name="mustache.js",t.version="0.7.3",t.tags=["{{","}}"],t.Scanner=a,t.Context=s,t.Writer=l,t.parse=d,t.escape=r;var C=new l;t.clearCache=function(){return C.clearCache()},t.compile=function(t,e){return C.compile(t,e)},t.compilePartial=function(t,e,n){return C.compilePartial(t,e,n)},t.compileTokens=function(t,e){return C.compileTokens(t,e)},t.render=function(t,e,n){return C.render(t,e,n)},t.to_html=function(e,n,i,r){var a=t.render(e,n,i);return o(r)?(r(a),void 0):a}})},{}],3:[function(t,e){function n(t){"use strict";return/^https?/.test(t.getScheme())?t.toString():/^mailto?/.test(t.getScheme())?t.toString():"data"==t.getScheme()&&/^image/.test(t.getPath())?t.toString():void 0}function o(t){return t}var i=t("./sanitizer-bundle.js");e.exports=function(t){return t?i(t,n,o):""}},{"./sanitizer-bundle.js":4}],4:[function(t,e){var n=function(){function t(t){var e=(""+t).match(d);return e?new l(c(e[1]),c(e[2]),c(e[3]),c(e[4]),c(e[5]),c(e[6]),c(e[7])):null}function e(t,e,r,a,s,c,u){var h=new l(o(t,m),o(e,m),n(r),a>0?a.toString():null,o(s,f),null,n(u));return c&&("string"==typeof c?h.setRawQuery(c.replace(/[^?&=0-9A-Za-z_\-~.%]/g,i)):h.setAllParameters(c)),h}function n(t){return"string"==typeof t?encodeURIComponent(t):null}function o(t,e){return"string"==typeof t?encodeURI(t).replace(e,i):null}function i(t){var e=t.charCodeAt(0);return"%"+"0123456789ABCDEF".charAt(e>>4&15)+"0123456789ABCDEF".charAt(15&e)}function r(t){return t.replace(/(^|\/)\.(?:\/|$)/g,"$1").replace(/\/{2,}/g,"/")}function a(t){if(null===t)return null;for(var e,n=r(t),o=h;(e=n.replace(o,"$1"))!=n;n=e);return n}function s(t,e){var n=t.clone(),o=e.hasScheme();o?n.setRawScheme(e.getRawScheme()):o=e.hasCredentials(),o?n.setRawCredentials(e.getRawCredentials()):o=e.hasDomain(),o?n.setRawDomain(e.getRawDomain()):o=e.hasPort();var i=e.getRawPath(),r=a(i);if(o)n.setPort(e.getPort()),r=r&&r.replace(p,"");else if(o=!!i){if(47!==r.charCodeAt(0)){var s=a(n.getRawPath()||"").replace(p,""),l=s.lastIndexOf("/")+1;r=a((l?s.substring(0,l):"")+a(i)).replace(p,"")}}else r=r&&r.replace(p,""),r!==i&&n.setRawPath(r);return o?n.setRawPath(r):o=e.hasQuery(),o?n.setRawQuery(e.getRawQuery()):o=e.hasFragment(),o&&n.setRawFragment(e.getRawFragment()),n}function l(t,e,n,o,i,r,a){this.scheme_=t,this.credentials_=e,this.domain_=n,this.port_=o,this.path_=i,this.query_=r,this.fragment_=a,this.paramCache_=null}function c(t){return"string"==typeof t&&t.length>0?t:null}var u=new RegExp("(/|^)(?:[^./][^/]*|\\.{2,}(?:[^./][^/]*)|\\.{3,}[^/]*)/\\.\\.(?:/|$)"),h=new RegExp(u),p=/^(?:\.\.\/)*(?:\.\.$)?/;l.prototype.toString=function(){var t=[];return null!==this.scheme_&&t.push(this.scheme_,":"),null!==this.domain_&&(t.push("//"),null!==this.credentials_&&t.push(this.credentials_,"@"),t.push(this.domain_),null!==this.port_&&t.push(":",this.port_.toString())),null!==this.path_&&t.push(this.path_),null!==this.query_&&t.push("?",this.query_),null!==this.fragment_&&t.push("#",this.fragment_),t.join("")},l.prototype.clone=function(){return new l(this.scheme_,this.credentials_,this.domain_,this.port_,this.path_,this.query_,this.fragment_)},l.prototype.getScheme=function(){return this.scheme_&&decodeURIComponent(this.scheme_).toLowerCase()},l.prototype.getRawScheme=function(){return this.scheme_},l.prototype.setScheme=function(t){return this.scheme_=o(t,m),this},l.prototype.setRawScheme=function(t){return this.scheme_=t?t:null,this},l.prototype.hasScheme=function(){return null!==this.scheme_},l.prototype.getCredentials=function(){return this.credentials_&&decodeURIComponent(this.credentials_)},l.prototype.getRawCredentials=function(){return this.credentials_},l.prototype.setCredentials=function(t){return this.credentials_=o(t,m),this},l.prototype.setRawCredentials=function(t){return this.credentials_=t?t:null,this},l.prototype.hasCredentials=function(){return null!==this.credentials_},l.prototype.getDomain=function(){return this.domain_&&decodeURIComponent(this.domain_)},l.prototype.getRawDomain=function(){return this.domain_},l.prototype.setDomain=function(t){return this.setRawDomain(t&&encodeURIComponent(t))},l.prototype.setRawDomain=function(t){return this.domain_=t?t:null,this.setRawPath(this.path_)},l.prototype.hasDomain=function(){return null!==this.domain_},l.prototype.getPort=function(){return this.port_&&decodeURIComponent(this.port_)},l.prototype.setPort=function(t){if(t){if(t=Number(t),t!==(65535&t))throw new Error("Bad port number "+t);this.port_=""+t}else this.port_=null;return this},l.prototype.hasPort=function(){return null!==this.port_},l.prototype.getPath=function(){return this.path_&&decodeURIComponent(this.path_)},l.prototype.getRawPath=function(){return this.path_},l.prototype.setPath=function(t){return this.setRawPath(o(t,f))},l.prototype.setRawPath=function(t){return t?(t=String(t),this.path_=!this.domain_||/^\//.test(t)?t:"/"+t):this.path_=null,this},l.prototype.hasPath=function(){return null!==this.path_},l.prototype.getQuery=function(){return this.query_&&decodeURIComponent(this.query_).replace(/\+/g," ")},l.prototype.getRawQuery=function(){return this.query_},l.prototype.setQuery=function(t){return this.paramCache_=null,this.query_=n(t),this},l.prototype.setRawQuery=function(t){return this.paramCache_=null,this.query_=t?t:null,this},l.prototype.hasQuery=function(){return null!==this.query_},l.prototype.setAllParameters=function(t){if("object"==typeof t&&!(t instanceof Array)&&(t instanceof Object||"[object Array]"!==Object.prototype.toString.call(t))){var e=[],n=-1;for(var o in t){var i=t[o];"string"==typeof i&&(e[++n]=o,e[++n]=i)}t=e}this.paramCache_=null;for(var r=[],a="",s=0;s<t.length;){var o=t[s++],i=t[s++];r.push(a,encodeURIComponent(o.toString())),a="&",i&&r.push("=",encodeURIComponent(i.toString()))}return this.query_=r.join(""),this},l.prototype.checkParameterCache_=function(){if(!this.paramCache_){var t=this.query_;if(t){for(var e=t.split(/[&\?]/),n=[],o=-1,i=0;i<e.length;++i){var r=e[i].match(/^([^=]*)(?:=(.*))?$/);n[++o]=decodeURIComponent(r[1]).replace(/\+/g," "),n[++o]=decodeURIComponent(r[2]||"").replace(/\+/g," ")}this.paramCache_=n}else this.paramCache_=[]}},l.prototype.setParameterValues=function(t,e){"string"==typeof e&&(e=[e]),this.checkParameterCache_();for(var n=0,o=this.paramCache_,i=[],r=0;r<o.length;r+=2)t===o[r]?n<e.length&&i.push(t,e[n++]):i.push(o[r],o[r+1]);for(;n<e.length;)i.push(t,e[n++]);return this.setAllParameters(i),this},l.prototype.removeParameter=function(t){return this.setParameterValues(t,[])},l.prototype.getAllParameters=function(){return this.checkParameterCache_(),this.paramCache_.slice(0,this.paramCache_.length)},l.prototype.getParameterValues=function(t){this.checkParameterCache_();for(var e=[],n=0;n<this.paramCache_.length;n+=2)t===this.paramCache_[n]&&e.push(this.paramCache_[n+1]);return e},l.prototype.getParameterMap=function(){this.checkParameterCache_();for(var t={},e=0;e<this.paramCache_.length;e+=2){var n=this.paramCache_[e++],o=this.paramCache_[e++];n in t?t[n].push(o):t[n]=[o]}return t},l.prototype.getParameterValue=function(t){this.checkParameterCache_();for(var e=0;e<this.paramCache_.length;e+=2)if(t===this.paramCache_[e])return this.paramCache_[e+1];return null},l.prototype.getFragment=function(){return this.fragment_&&decodeURIComponent(this.fragment_)},l.prototype.getRawFragment=function(){return this.fragment_},l.prototype.setFragment=function(t){return this.fragment_=t?encodeURIComponent(t):null,this},l.prototype.setRawFragment=function(t){return this.fragment_=t?t:null,this},l.prototype.hasFragment=function(){return null!==this.fragment_};var d=new RegExp("^(?:([^:/?#]+):)?(?://(?:([^/?#]*)@)?([^/?#:@]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$"),m=/[#\/\?@]/g,f=/[\#\?]/g;return l.parse=t,l.create=e,l.resolve=s,l.collapse_dots=a,l.utils={mimeTypeOf:function(e){var n=t(e);return/\.html$/.test(n.getPath())?"text/html":"application/javascript"},resolve:function(e,n){return e?s(t(e),t(n)).toString():""+n}},l}(),o={};if(o.atype={NONE:0,URI:1,URI_FRAGMENT:11,SCRIPT:2,STYLE:3,HTML:12,ID:4,IDREF:5,IDREFS:6,GLOBAL_NAME:7,LOCAL_NAME:8,CLASSES:9,FRAME_TARGET:10,MEDIA_QUERY:13},o.atype=o.atype,o.ATTRIBS={"*::class":9,"*::dir":0,"*::draggable":0,"*::hidden":0,"*::id":4,"*::inert":0,"*::itemprop":0,"*::itemref":6,"*::itemscope":0,"*::lang":0,"*::onblur":2,"*::onchange":2,"*::onclick":2,"*::ondblclick":2,"*::onfocus":2,"*::onkeydown":2,"*::onkeypress":2,"*::onkeyup":2,"*::onload":2,"*::onmousedown":2,"*::onmousemove":2,"*::onmouseout":2,"*::onmouseover":2,"*::onmouseup":2,"*::onreset":2,"*::onscroll":2,"*::onselect":2,"*::onsubmit":2,"*::onunload":2,"*::spellcheck":0,"*::style":3,"*::title":0,"*::translate":0,"a::accesskey":0,"a::coords":0,"a::href":1,"a::hreflang":0,"a::name":7,"a::onblur":2,"a::onfocus":2,"a::shape":0,"a::tabindex":0,"a::target":10,"a::type":0,"area::accesskey":0,"area::alt":0,"area::coords":0,"area::href":1,"area::nohref":0,"area::onblur":2,"area::onfocus":2,"area::shape":0,"area::tabindex":0,"area::target":10,"audio::controls":0,"audio::loop":0,"audio::mediagroup":5,"audio::muted":0,"audio::preload":0,"bdo::dir":0,"blockquote::cite":1,"br::clear":0,"button::accesskey":0,"button::disabled":0,"button::name":8,"button::onblur":2,"button::onfocus":2,"button::tabindex":0,"button::type":0,"button::value":0,"canvas::height":0,"canvas::width":0,"caption::align":0,"col::align":0,"col::char":0,"col::charoff":0,"col::span":0,"col::valign":0,"col::width":0,"colgroup::align":0,"colgroup::char":0,"colgroup::charoff":0,"colgroup::span":0,"colgroup::valign":0,"colgroup::width":0,"command::checked":0,"command::command":5,"command::disabled":0,"command::icon":1,"command::label":0,"command::radiogroup":0,"command::type":0,"data::value":0,"del::cite":1,"del::datetime":0,"details::open":0,"dir::compact":0,"div::align":0,"dl::compact":0,"fieldset::disabled":0,"font::color":0,"font::face":0,"font::size":0,"form::accept":0,"form::action":1,"form::autocomplete":0,"form::enctype":0,"form::method":0,"form::name":7,"form::novalidate":0,"form::onreset":2,"form::onsubmit":2,"form::target":10,"h1::align":0,"h2::align":0,"h3::align":0,"h4::align":0,"h5::align":0,"h6::align":0,"hr::align":0,"hr::noshade":0,"hr::size":0,"hr::width":0,"iframe::align":0,"iframe::frameborder":0,"iframe::height":0,"iframe::marginheight":0,"iframe::marginwidth":0,"iframe::width":0,"img::align":0,"img::alt":0,"img::border":0,"img::height":0,"img::hspace":0,"img::ismap":0,"img::name":7,"img::src":1,"img::usemap":11,"img::vspace":0,"img::width":0,"input::accept":0,"input::accesskey":0,"input::align":0,"input::alt":0,"input::autocomplete":0,"input::checked":0,"input::disabled":0,"input::inputmode":0,"input::ismap":0,"input::list":5,"input::max":0,"input::maxlength":0,"input::min":0,"input::multiple":0,"input::name":8,"input::onblur":2,"input::onchange":2,"input::onfocus":2,"input::onselect":2,"input::placeholder":0,"input::readonly":0,"input::required":0,"input::size":0,"input::src":1,"input::step":0,"input::tabindex":0,"input::type":0,"input::usemap":11,"input::value":0,"ins::cite":1,"ins::datetime":0,"label::accesskey":0,"label::for":5,"label::onblur":2,"label::onfocus":2,"legend::accesskey":0,"legend::align":0,"li::type":0,"li::value":0,"map::name":7,"menu::compact":0,"menu::label":0,"menu::type":0,"meter::high":0,"meter::low":0,"meter::max":0,"meter::min":0,"meter::value":0,"ol::compact":0,"ol::reversed":0,"ol::start":0,"ol::type":0,"optgroup::disabled":0,"optgroup::label":0,"option::disabled":0,"option::label":0,"option::selected":0,"option::value":0,"output::for":6,"output::name":8,"p::align":0,"pre::width":0,"progress::max":0,"progress::min":0,"progress::value":0,"q::cite":1,"select::autocomplete":0,"select::disabled":0,"select::multiple":0,"select::name":8,"select::onblur":2,"select::onchange":2,"select::onfocus":2,"select::required":0,"select::size":0,"select::tabindex":0,"source::type":0,"table::align":0,"table::bgcolor":0,"table::border":0,"table::cellpadding":0,"table::cellspacing":0,"table::frame":0,"table::rules":0,"table::summary":0,"table::width":0,"tbody::align":0,"tbody::char":0,"tbody::charoff":0,"tbody::valign":0,"td::abbr":0,"td::align":0,"td::axis":0,"td::bgcolor":0,"td::char":0,"td::charoff":0,"td::colspan":0,"td::headers":6,"td::height":0,"td::nowrap":0,"td::rowspan":0,"td::scope":0,"td::valign":0,"td::width":0,"textarea::accesskey":0,"textarea::autocomplete":0,"textarea::cols":0,"textarea::disabled":0,"textarea::inputmode":0,"textarea::name":8,"textarea::onblur":2,"textarea::onchange":2,"textarea::onfocus":2,"textarea::onselect":2,"textarea::placeholder":0,"textarea::readonly":0,"textarea::required":0,"textarea::rows":0,"textarea::tabindex":0,"textarea::wrap":0,"tfoot::align":0,"tfoot::char":0,"tfoot::charoff":0,"tfoot::valign":0,"th::abbr":0,"th::align":0,"th::axis":0,"th::bgcolor":0,"th::char":0,"th::charoff":0,"th::colspan":0,"th::headers":6,"th::height":0,"th::nowrap":0,"th::rowspan":0,"th::scope":0,"th::valign":0,"th::width":0,"thead::align":0,"thead::char":0,"thead::charoff":0,"thead::valign":0,"tr::align":0,"tr::bgcolor":0,"tr::char":0,"tr::charoff":0,"tr::valign":0,"track::default":0,"track::kind":0,"track::label":0,"track::srclang":0,"ul::compact":0,"ul::type":0,"video::controls":0,"video::height":0,"video::loop":0,"video::mediagroup":5,"video::muted":0,"video::poster":1,"video::preload":0,"video::width":0},o.ATTRIBS=o.ATTRIBS,o.eflags={OPTIONAL_ENDTAG:1,EMPTY:2,CDATA:4,RCDATA:8,UNSAFE:16,FOLDABLE:32,SCRIPT:64,STYLE:128,VIRTUALIZED:256},o.eflags=o.eflags,o.ELEMENTS={a:0,abbr:0,acronym:0,address:0,applet:272,area:2,article:0,aside:0,audio:0,b:0,base:274,basefont:274,bdi:0,bdo:0,big:0,blockquote:0,body:305,br:2,button:0,canvas:0,caption:0,center:0,cite:0,code:0,col:2,colgroup:1,command:2,data:0,datalist:0,dd:1,del:0,details:0,dfn:0,dialog:272,dir:0,div:0,dl:0,dt:1,em:0,fieldset:0,figcaption:0,figure:0,font:0,footer:0,form:0,frame:274,frameset:272,h1:0,h2:0,h3:0,h4:0,h5:0,h6:0,head:305,header:0,hgroup:0,hr:2,html:305,i:0,iframe:4,img:2,input:2,ins:0,isindex:274,kbd:0,keygen:274,label:0,legend:0,li:1,link:274,map:0,mark:0,menu:0,meta:274,meter:0,nav:0,nobr:0,noembed:276,noframes:276,noscript:276,object:272,ol:0,optgroup:0,option:1,output:0,p:1,param:274,pre:0,progress:0,q:0,s:0,samp:0,script:84,section:0,select:0,small:0,source:2,span:0,strike:0,strong:0,style:148,sub:0,summary:0,sup:0,table:0,tbody:1,td:1,textarea:8,tfoot:1,th:1,thead:1,time:0,title:280,tr:1,track:2,tt:0,u:0,ul:0,"var":0,video:0,wbr:2},o.ELEMENTS=o.ELEMENTS,o.ELEMENT_DOM_INTERFACES={a:"HTMLAnchorElement",abbr:"HTMLElement",acronym:"HTMLElement",address:"HTMLElement",applet:"HTMLAppletElement",area:"HTMLAreaElement",article:"HTMLElement",aside:"HTMLElement",audio:"HTMLAudioElement",b:"HTMLElement",base:"HTMLBaseElement",basefont:"HTMLBaseFontElement",bdi:"HTMLElement",bdo:"HTMLElement",big:"HTMLElement",blockquote:"HTMLQuoteElement",body:"HTMLBodyElement",br:"HTMLBRElement",button:"HTMLButtonElement",canvas:"HTMLCanvasElement",caption:"HTMLTableCaptionElement",center:"HTMLElement",cite:"HTMLElement",code:"HTMLElement",col:"HTMLTableColElement",colgroup:"HTMLTableColElement",command:"HTMLCommandElement",data:"HTMLElement",datalist:"HTMLDataListElement",dd:"HTMLElement",del:"HTMLModElement",details:"HTMLDetailsElement",dfn:"HTMLElement",dialog:"HTMLDialogElement",dir:"HTMLDirectoryElement",div:"HTMLDivElement",dl:"HTMLDListElement",dt:"HTMLElement",em:"HTMLElement",fieldset:"HTMLFieldSetElement",figcaption:"HTMLElement",figure:"HTMLElement",font:"HTMLFontElement",footer:"HTMLElement",form:"HTMLFormElement",frame:"HTMLFrameElement",frameset:"HTMLFrameSetElement",h1:"HTMLHeadingElement",h2:"HTMLHeadingElement",h3:"HTMLHeadingElement",h4:"HTMLHeadingElement",h5:"HTMLHeadingElement",h6:"HTMLHeadingElement",head:"HTMLHeadElement",header:"HTMLElement",hgroup:"HTMLElement",hr:"HTMLHRElement",html:"HTMLHtmlElement",i:"HTMLElement",iframe:"HTMLIFrameElement",img:"HTMLImageElement",input:"HTMLInputElement",ins:"HTMLModElement",isindex:"HTMLUnknownElement",kbd:"HTMLElement",keygen:"HTMLKeygenElement",label:"HTMLLabelElement",legend:"HTMLLegendElement",li:"HTMLLIElement",link:"HTMLLinkElement",map:"HTMLMapElement",mark:"HTMLElement",menu:"HTMLMenuElement",meta:"HTMLMetaElement",meter:"HTMLMeterElement",nav:"HTMLElement",nobr:"HTMLElement",noembed:"HTMLElement",noframes:"HTMLElement",noscript:"HTMLElement",object:"HTMLObjectElement",ol:"HTMLOListElement",optgroup:"HTMLOptGroupElement",option:"HTMLOptionElement",output:"HTMLOutputElement",p:"HTMLParagraphElement",param:"HTMLParamElement",pre:"HTMLPreElement",progress:"HTMLProgressElement",q:"HTMLQuoteElement",s:"HTMLElement",samp:"HTMLElement",script:"HTMLScriptElement",section:"HTMLElement",select:"HTMLSelectElement",small:"HTMLElement",source:"HTMLSourceElement",span:"HTMLSpanElement",strike:"HTMLElement",strong:"HTMLElement",style:"HTMLStyleElement",sub:"HTMLElement",summary:"HTMLElement",sup:"HTMLElement",table:"HTMLTableElement",tbody:"HTMLTableSectionElement",td:"HTMLTableDataCellElement",textarea:"HTMLTextAreaElement",tfoot:"HTMLTableSectionElement",th:"HTMLTableHeaderCellElement",thead:"HTMLTableSectionElement",time:"HTMLTimeElement",title:"HTMLTitleElement",tr:"HTMLTableRowElement",track:"HTMLTrackElement",tt:"HTMLElement",u:"HTMLElement",ul:"HTMLUListElement","var":"HTMLElement",video:"HTMLVideoElement",wbr:"HTMLElement"},o.ELEMENT_DOM_INTERFACES=o.ELEMENT_DOM_INTERFACES,o.ueffects={NOT_LOADED:0,SAME_DOCUMENT:1,NEW_DOCUMENT:2},o.ueffects=o.ueffects,o.URIEFFECTS={"a::href":2,"area::href":2,"blockquote::cite":0,"command::icon":1,"del::cite":0,"form::action":2,"img::src":1,"input::src":1,"ins::cite":0,"q::cite":0,"video::poster":1},o.URIEFFECTS=o.URIEFFECTS,o.ltypes={UNSANDBOXED:2,SANDBOXED:1,DATA:0},o.ltypes=o.ltypes,o.LOADERTYPES={"a::href":2,"area::href":2,"blockquote::cite":2,"command::icon":1,"del::cite":2,"form::action":2,"img::src":1,"input::src":1,"ins::cite":2,"q::cite":2,"video::poster":1},o.LOADERTYPES=o.LOADERTYPES,"i"!=="I".toLowerCase())throw"I/i problem";var i=function(t){function e(t){if(R.hasOwnProperty(t))return R[t];var e=t.match(D);if(e)return String.fromCharCode(parseInt(e[1],10));if(e=t.match(A))return String.fromCharCode(parseInt(e[1],16));if(P&&U.test(t)){P.innerHTML="&"+t+";";var n=P.textContent;return R[t]=n,n}return"&"+t+";"}function o(t,n){return e(n)}function i(t){return t.replace(O,"")}function r(t){return t.replace(j,o)}function a(t){return(""+t).replace(N,"&amp;").replace(q,"&lt;").replace(F,"&gt;").replace(B,"&#34;")}function s(t){return t.replace(z,"&amp;$1").replace(q,"&lt;").replace(F,"&gt;")}function l(t){var e={cdata:t.cdata||t.cdata,comment:t.comment||t.comment,endDoc:t.endDoc||t.endDoc,endTag:t.endTag||t.endTag,pcdata:t.pcdata||t.pcdata,rcdata:t.rcdata||t.rcdata,startDoc:t.startDoc||t.startDoc,startTag:t.startTag||t.startTag};return function(t,n){return c(t,e,n)}}function c(t,e,n){var o=p(t),i={noMoreGT:!1,noMoreEndComments:!1};h(e,o,0,i,n)}function u(t,e,n,o,i){return function(){h(t,e,n,o,i)}}function h(e,n,o,i,r){try{e.startDoc&&0==o&&e.startDoc(r);for(var a,s,l,c=o,h=n.length;h>c;){var p=n[c++],g=n[c];switch(p){case"&":I.test(g)?(e.pcdata&&e.pcdata("&"+g,r,$,u(e,n,c,i,r)),c++):e.pcdata&&e.pcdata("&amp;",r,$,u(e,n,c,i,r));break;case"</":(a=/^([-\w:]+)[^\'\"]*/.exec(g))?a[0].length===g.length&&">"===n[c+1]?(c+=2,l=a[1].toLowerCase(),e.endTag&&e.endTag(l,r,$,u(e,n,c,i,r))):c=d(n,c,e,r,$,i):e.pcdata&&e.pcdata("&lt;/",r,$,u(e,n,c,i,r));break;case"<":if(a=/^([-\w:]+)\s*\/?/.exec(g))if(a[0].length===g.length&&">"===n[c+1]){c+=2,l=a[1].toLowerCase(),e.startTag&&e.startTag(l,[],r,$,u(e,n,c,i,r));var _=t.ELEMENTS[l];if(_&Z){var L={name:l,next:c,eflags:_};c=f(n,L,e,r,$,i)}}else c=m(n,c,e,r,$,i);else e.pcdata&&e.pcdata("&lt;",r,$,u(e,n,c,i,r));break;case"<!--":if(!i.noMoreEndComments){for(s=c+1;h>s&&(">"!==n[s]||!/--$/.test(n[s-1]));s++);if(h>s){if(e.comment){var v=n.slice(c,s).join("");e.comment(v.substr(0,v.length-2),r,$,u(e,n,s+1,i,r))}c=s+1}else i.noMoreEndComments=!0}i.noMoreEndComments&&e.pcdata&&e.pcdata("&lt;!--",r,$,u(e,n,c,i,r));break;case"<!":if(/^\w/.test(g)){if(!i.noMoreGT){for(s=c+1;h>s&&">"!==n[s];s++);h>s?c=s+1:i.noMoreGT=!0}i.noMoreGT&&e.pcdata&&e.pcdata("&lt;!",r,$,u(e,n,c,i,r))}else e.pcdata&&e.pcdata("&lt;!",r,$,u(e,n,c,i,r));break;case"<?":if(!i.noMoreGT){for(s=c+1;h>s&&">"!==n[s];s++);h>s?c=s+1:i.noMoreGT=!0}i.noMoreGT&&e.pcdata&&e.pcdata("&lt;?",r,$,u(e,n,c,i,r));break;case">":e.pcdata&&e.pcdata("&gt;",r,$,u(e,n,c,i,r));break;case"":break;default:e.pcdata&&e.pcdata(p,r,$,u(e,n,c,i,r))}}e.endDoc&&e.endDoc(r)}catch(y){if(y!==$)throw y}}function p(t){var e=/(<\/|<\!--|<[!?]|[&<>])/g;if(t+="",J)return t.split(e);for(var n,o=[],i=0;null!==(n=e.exec(t));)o.push(t.substring(i,n.index)),o.push(n[0]),i=n.index+n[0].length;return o.push(t.substring(i)),o}function d(t,e,n,o,i,r){var a=g(t,e);return a?(n.endTag&&n.endTag(a.name,o,i,u(n,t,e,r,o)),a.next):t.length}function m(t,e,n,o,i,r){var a=g(t,e);return a?(n.startTag&&n.startTag(a.name,a.attrs,o,i,u(n,t,a.next,r,o)),a.eflags&Z?f(t,a,n,o,i,r):a.next):t.length}function f(e,n,o,i,r,a){var l=e.length;Q.hasOwnProperty(n.name)||(Q[n.name]=new RegExp("^"+n.name+"(?:[\\s\\/]|$)","i"));for(var c=Q[n.name],h=n.next,p=n.next+1;l>p&&("</"!==e[p-1]||!c.test(e[p]));p++);l>p&&(p-=1);var d=e.slice(h,p).join("");if(n.eflags&t.eflags.CDATA)o.cdata&&o.cdata(d,i,r,u(o,e,p,a,i));else{if(!(n.eflags&t.eflags.RCDATA))throw new Error("bug");o.rcdata&&o.rcdata(s(d),i,r,u(o,e,p,a,i))}return p}function g(e,n){var o=/^([-\w:]+)/.exec(e[n]),i={};i.name=o[1].toLowerCase(),i.eflags=t.ELEMENTS[i.name];for(var r=e[n].substr(o[0].length),a=n+1,s=e.length;s>a&&">"!==e[a];a++)r+=e[a];if(a>=s)return void 0;for(var l=[];""!==r;)if(o=G.exec(r)){if(o[4]&&!o[5]||o[6]&&!o[7]){for(var c=o[4]||o[6],u=!1,h=[r,e[a++]];s>a;a++){if(u){if(">"===e[a])break}else 0<=e[a].indexOf(c)&&(u=!0);h.push(e[a])}if(a>=s)break;r=h.join("");continue}var p=o[1].toLowerCase(),d=o[2]?_(o[3]):"";l.push(p,d),r=r.substr(o[0].length)}else r=r.replace(/^[\s\S][^a-z\s]*/,"");return i.attrs=l,i.next=a+1,i}function _(t){var e=t.charCodeAt(0);return(34===e||39===e)&&(t=t.substr(1,t.length-2)),r(i(t))}function L(e){var n,o,i=function(t,e){o||e.push(t)};return l({startDoc:function(){n=[],o=!1},startTag:function(i,r,s){if(!o&&t.ELEMENTS.hasOwnProperty(i)){var l=t.ELEMENTS[i];if(!(l&t.eflags.FOLDABLE)){var c=e(i,r);if(!c)return o=!(l&t.eflags.EMPTY),void 0;if("object"!=typeof c)throw new Error("tagPolicy did not return object (old API?)");if(!("attribs"in c))throw new Error("tagPolicy gave no attribs");r=c.attribs;var u,h;if("tagName"in c?(h=c.tagName,u=t.ELEMENTS[h]):(h=i,u=l),l&t.eflags.OPTIONAL_ENDTAG){var p=n[n.length-1];!p||p.orig!==i||p.rep===h&&i===h||s.push("</",p.rep,">")}l&t.eflags.EMPTY||n.push({orig:i,rep:h}),s.push("<",h);for(var d=0,m=r.length;m>d;d+=2){var f=r[d],g=r[d+1];null!==g&&void 0!==g&&s.push(" ",f,'="',a(g),'"')}s.push(">"),l&t.eflags.EMPTY&&!(u&t.eflags.EMPTY)&&s.push("</",h,">")}}},endTag:function(e,i){if(o)return o=!1,void 0;if(t.ELEMENTS.hasOwnProperty(e)){var r=t.ELEMENTS[e];if(!(r&(t.eflags.EMPTY|t.eflags.FOLDABLE))){var a;if(r&t.eflags.OPTIONAL_ENDTAG)for(a=n.length;--a>=0;){var s=n[a].orig;if(s===e)break;if(!(t.ELEMENTS[s]&t.eflags.OPTIONAL_ENDTAG))return}else for(a=n.length;--a>=0&&n[a].orig!==e;);if(0>a)return;for(var l=n.length;--l>a;){var c=n[l].rep;t.ELEMENTS[c]&t.eflags.OPTIONAL_ENDTAG||i.push("</",c,">")}a<n.length&&(e=n[a].rep),n.length=a,i.push("</",e,">")}}},pcdata:i,rcdata:i,cdata:i,endDoc:function(t){for(;n.length;n.length--)t.push("</",n[n.length-1].rep,">")}})}function v(t,e,o,i,r){if(!r)return null;try{var a=n.parse(""+t);if(a&&(!a.hasScheme()||Y.test(a.getScheme()))){var s=r(a,e,o,i);return s?s.toString():null}}catch(l){return null}return null}function y(t,e,n,o,i){if(n||t(e+" removed",{change:"removed",tagName:e}),o!==i){var r="changed";o&&!i?r="removed":!o&&i&&(r="added"),t(e+"."+n+" "+r,{change:r,tagName:e,attribName:n,oldValue:o,newValue:i})}}function b(t,e,n){var o;return o=e+"::"+n,t.hasOwnProperty(o)?t[o]:(o="*::"+n,t.hasOwnProperty(o)?t[o]:void 0)}function T(e,n){return b(t.LOADERTYPES,e,n)}function E(e,n){return b(t.URIEFFECTS,e,n)}function C(e,n,o,i,r){for(var a=0;a<n.length;a+=2){var s,l=n[a],c=n[a+1],u=c,h=null;if(s=e+"::"+l,(t.ATTRIBS.hasOwnProperty(s)||(s="*::"+l,t.ATTRIBS.hasOwnProperty(s)))&&(h=t.ATTRIBS[s]),null!==h)switch(h){case t.atype.NONE:break;case t.atype.SCRIPT:c=null,r&&y(r,e,l,u,c);break;case t.atype.STYLE:if("undefined"==typeof k){c=null,r&&y(r,e,l,u,c);break}var p=[];k(c,{declaration:function(e,n){var i=e.toLowerCase(),r=H[i];r&&(S(i,r,n,o?function(e){return v(e,t.ueffects.SAME_DOCUMENT,t.ltypes.SANDBOXED,{TYPE:"CSS",CSS_PROP:i},o)}:null),p.push(e+": "+n.join(" ")))}}),c=p.length>0?p.join(" ; "):null,r&&y(r,e,l,u,c);break;case t.atype.ID:case t.atype.IDREF:case t.atype.IDREFS:case t.atype.GLOBAL_NAME:case t.atype.LOCAL_NAME:case t.atype.CLASSES:c=i?i(c):c,r&&y(r,e,l,u,c);break;case t.atype.URI:c=v(c,E(e,l),T(e,l),{TYPE:"MARKUP",XML_ATTR:l,XML_TAG:e},o),r&&y(r,e,l,u,c);break;case t.atype.URI_FRAGMENT:c&&"#"===c.charAt(0)?(c=c.substring(1),c=i?i(c):c,null!==c&&void 0!==c&&(c="#"+c)):c=null,r&&y(r,e,l,u,c);break;default:c=null,r&&y(r,e,l,u,c)}else c=null,r&&y(r,e,l,u,c);n[a+1]=c}return n}function w(e,n,o){return function(i,r){return t.ELEMENTS[i]&t.eflags.UNSAFE?(o&&y(o,i,void 0,void 0,void 0),void 0):{attribs:C(i,r,e,n,o)}}}function x(t,e){var n=[];return L(e)(t,n),n.join("")}function M(t,e,n,o){var i=w(e,n,o);return x(t,i)}var k,S,H;"undefined"!=typeof window&&(k=window.parseCssDeclarations,S=window.sanitizeCssProperty,H=window.cssSchema);var R={lt:"<",LT:"<",gt:">",GT:">",amp:"&",AMP:"&",quot:'"',apos:"'",nbsp:"Â "},D=/^#(\d+)$/,A=/^#x([0-9A-Fa-f]+)$/,U=/^[A-Za-z][A-za-z0-9]+$/,P="undefined"!=typeof window&&window.document?window.document.createElement("textarea"):null,O=/\0/g,j=/&(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/g,I=/^(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/,N=/&/g,z=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi,q=/[<]/g,F=/>/g,B=/\"/g,G=new RegExp("^\\s*([-.:\\w]+)(?:\\s*(=)\\s*((\")[^\"]*(\"|$)|(')[^']*('|$)|(?=[a-z][-\\w]*\\s*=)|[^\"'\\s]*))?","i"),J=3==="a,b".split(/(,)/).length,Z=t.eflags.CDATA|t.eflags.RCDATA,$={},Q={},Y=/^(?:https?|mailto|data)$/i,V={};
return V.escapeAttrib=V.escapeAttrib=a,V.makeHtmlSanitizer=V.makeHtmlSanitizer=L,V.makeSaxParser=V.makeSaxParser=l,V.makeTagPolicy=V.makeTagPolicy=w,V.normalizeRCData=V.normalizeRCData=s,V.sanitize=V.sanitize=M,V.sanitizeAttribs=V.sanitizeAttribs=C,V.sanitizeWithPolicy=V.sanitizeWithPolicy=x,V.unescapeEntities=V.unescapeEntities=r,V}(o),r=i.sanitize;o.ATTRIBS["*::style"]=0,o.ELEMENTS.style=0,o.ATTRIBS["a::target"]=0,o.ELEMENTS.video=0,o.ATTRIBS["video::src"]=0,o.ATTRIBS["video::poster"]=0,o.ATTRIBS["video::controls"]=0,o.ELEMENTS.audio=0,o.ATTRIBS["audio::src"]=0,o.ATTRIBS["video::autoplay"]=0,o.ATTRIBS["video::controls"]=0,"undefined"!=typeof e&&(e.exports=r)},{}],5:[function(t,e){e.exports={author:"Mapbox",name:"mapbox.js",description:"mapbox javascript api",version:"2.1.2",homepage:"http://mapbox.com/",repository:{type:"git",url:"git://github.com/mapbox/mapbox.js.git"},main:"src/index.js",dependencies:{leaflet:"0.7.3",mustache:"0.7.3",corslite:"0.0.6","sanitize-caja":"0.1.2"},scripts:{test:"jshint src/*.js && mocha-phantomjs test/index.html"},devDependencies:{"leaflet-hash":"0.2.1","leaflet-fullscreen":"0.0.0","uglify-js":"2.4.8",mocha:"1.17.1","expect.js":"0.3.1",sinon:"1.10.2","mocha-phantomjs":"3.1.6",happen:"0.1.3",browserify:"3.23.1",jshint:"2.4.4","clean-css":"~2.0.7",minimist:"0.0.5",marked:"~0.3.0"},optionalDependencies:{},engines:{node:"*"}}},{}],6:[function(t,e){"use strict";e.exports={HTTP_URL:"http://a.tiles.mapbox.com/v4",HTTPS_URL:"https://a.tiles.mapbox.com/v4",FORCE_HTTPS:!1,REQUIRE_ACCESS_TOKEN:!0}},{}],7:[function(t,e){"use strict";var n=t("./util"),o=t("./url"),i=t("./request"),r=t("./marker"),a=t("./simplestyle"),s=L.FeatureGroup.extend({options:{filter:function(){return!0},sanitizer:t("sanitize-caja"),style:a.style,popupOptions:{closeButton:!1}},initialize:function(t,e){L.setOptions(this,e),this._layers={},"string"==typeof t?n.idUrl(t,this):t&&"object"==typeof t&&this.setGeoJSON(t)},setGeoJSON:function(t){return this._geojson=t,this.clearLayers(),this._initialize(t),this},getGeoJSON:function(){return this._geojson},loadURL:function(t){return this._request&&"abort"in this._request&&this._request.abort(),this._request=i(t,L.bind(function(e,o){this._request=null,e&&"abort"!==e.type?(n.log("could not load features at "+t),this.fire("error",{error:e})):o&&(this.setGeoJSON(o),this.fire("ready"))},this)),this},loadID:function(t){return this.loadURL(o("/"+t+"/features.json",this.options.accessToken))},setFilter:function(t){return this.options.filter=t,this._geojson&&(this.clearLayers(),this._initialize(this._geojson)),this},getFilter:function(){return this.options.filter},_initialize:function(t){var e,n,o=L.Util.isArray(t)?t:t.features;if(o)for(e=0,n=o.length;n>e;e++)(o[e].geometries||o[e].geometry||o[e].features)&&this._initialize(o[e]);else if(this.options.filter(t)){var i={accessToken:this.options.accessToken},s=L.GeoJSON.geometryToLayer(t,function(t,e){return r.style(t,e,i)}),l=r.createPopup(t,this.options.sanitizer);"setStyle"in s&&s.setStyle(a.style(t)),s.feature=t,l&&s.bindPopup(l,this.options.popupOptions),this.addLayer(s)}}});e.exports.FeatureLayer=s,e.exports.featureLayer=function(t,e){return new s(t,e)}},{"./marker":18,"./request":19,"./simplestyle":21,"./url":23,"./util":24,"sanitize-caja":3}],8:[function(t,e){"use strict";var n=t("./util"),o=t("./url"),i=t("./request");e.exports=function(t,e){var r={};return n.strict(t,"string"),-1===t.indexOf("/")&&(t=o("/geocode/"+t+"/{query}.json",e&&e.accessToken)),r.getURL=function(){return t},r.queryURL=function(t){if("string"!=typeof t){for(var e=[],n=0;n<t.length;n++)e[n]=encodeURIComponent(t[n]);return L.Util.template(r.getURL(),{query:e.join(";")})}return L.Util.template(r.getURL(),{query:encodeURIComponent(t)})},r.query=function(t,e){return n.strict(e,"function"),i(r.queryURL(t),function(t,o){if(o&&(o.length||o.features)){var i={results:o};o.features&&o.features.length&&(i.latlng=[o.features[0].center[1],o.features[0].center[0]],o.features[0].bbox&&(i.bounds=o.features[0].bbox,i.lbounds=n.lbounds(i.bounds))),e(null,i)}else e(t||!0)}),r},r.reverseQuery=function(t,e){function n(t){return void 0!==t.lat&&void 0!==t.lng?t.lng+","+t.lat:void 0!==t.lat&&void 0!==t.lon?t.lon+","+t.lat:t[0]+","+t[1]}var o="";if(t.length&&t[0].length){for(var a=0,s=[];a<t.length;a++)s.push(n(t[a]));o=s.join(";")}else o=n(t);return i(r.queryURL(o),function(t,n){e(t,n)}),r},r}},{"./request":19,"./url":23,"./util":24}],9:[function(t,e){"use strict";var n=t("./geocoder"),o=t("./util"),i=L.Control.extend({includes:L.Mixin.Events,options:{position:"topleft",pointZoom:16,keepOpen:!1,autocomplete:!1},initialize:function(t,e){L.Util.setOptions(this,e),this.setURL(t),this._updateSubmit=L.bind(this._updateSubmit,this),this._updateAutocomplete=L.bind(this._updateAutocomplete,this),this._chooseResult=L.bind(this._chooseResult,this)},setURL:function(t){return this.geocoder=n(t,{accessToken:this.options.accessToken}),this},getURL:function(){return this.geocoder.getURL()},setID:function(t){return this.setURL(t)},setTileJSON:function(t){return this.setURL(t.geocoder)},_toggle:function(t){t&&L.DomEvent.stop(t),L.DomUtil.hasClass(this._container,"active")?(L.DomUtil.removeClass(this._container,"active"),this._results.innerHTML="",this._input.blur()):(L.DomUtil.addClass(this._container,"active"),this._input.focus(),this._input.select())},_closeIfOpen:function(){L.DomUtil.hasClass(this._container,"active")&&!this.options.keepOpen&&(L.DomUtil.removeClass(this._container,"active"),this._results.innerHTML="",this._input.blur())},onAdd:function(t){var e=L.DomUtil.create("div","leaflet-control-mapbox-geocoder leaflet-bar leaflet-control"),n=L.DomUtil.create("a","leaflet-control-mapbox-geocoder-toggle mapbox-icon mapbox-icon-geocoder",e),o=L.DomUtil.create("div","leaflet-control-mapbox-geocoder-results",e),i=L.DomUtil.create("div","leaflet-control-mapbox-geocoder-wrap",e),r=L.DomUtil.create("form","leaflet-control-mapbox-geocoder-form",i),a=L.DomUtil.create("input","",r);return n.href="#",n.innerHTML="&nbsp;",a.type="text",a.setAttribute("placeholder","Search"),L.DomEvent.addListener(r,"submit",this._geocode,this),L.DomEvent.addListener(a,"keyup",this._autocomplete,this),L.DomEvent.disableClickPropagation(e),this._map=t,this._results=o,this._input=a,this._form=r,this.options.keepOpen?L.DomUtil.addClass(e,"active"):(this._map.on("click",this._closeIfOpen,this),L.DomEvent.addListener(n,"click",this._toggle,this)),e},_updateSubmit:function(t,e){if(L.DomUtil.removeClass(this._container,"searching"),this._results.innerHTML="",t||!e)this.fire("error",{error:t});else{var n=[];e.results&&e.results.features&&(n=e.results.features),1===n.length?(this.fire("autoselect",{feature:n[0]}),this.fire("found",{results:e.results}),this._chooseResult(n[0]),this._closeIfOpen()):n.length>1?(this.fire("found",{results:e.results}),this._displayResults(n)):this._displayResults(n)}},_updateAutocomplete:function(t,e){if(this._results.innerHTML="",t||!e)this.fire("error",{error:t});else{var n=[];e.results&&e.results.features&&(n=e.results.features),this._displayResults(n)}},_displayResults:function(t){for(var e=0,n=Math.min(t.length,5);n>e;e++){var o=t[e],i=o.place_name;if(i.length){var r=L.DomUtil.create("a","",this._results),a="innerText"in r?"innerText":"textContent";r[a]=i,r.href="#",L.bind(function(t){L.DomEvent.addListener(r,"click",function(e){this._chooseResult(t),L.DomEvent.stop(e),this.fire("select",{feature:t})},this)},this)(o)}}if(t.length>5){var s=L.DomUtil.create("span","",this._results);s.innerHTML="Top 5 of "+t.length+"  results"}},_chooseResult:function(t){t.bbox?this._map.fitBounds(o.lbounds(t.bbox)):t.center&&this._map.setView([t.center[1],t.center[0]],void 0===this._map.getZoom()?this.options.pointZoom:Math.max(this._map.getZoom(),this.options.pointZoom))},_geocode:function(t){return L.DomEvent.preventDefault(t),""===this._input.value?this._updateSubmit():(L.DomUtil.addClass(this._container,"searching"),this.geocoder.query(this._input.value,this._updateSubmit),void 0)},_autocomplete:function(){return this.options.autocomplete?""===this._input.value?this._updateAutocomplete():(this.geocoder.query(this._input.value,this._updateAutocomplete),void 0):void 0}});e.exports.GeocoderControl=i,e.exports.geocoderControl=function(t,e){return new i(t,e)}},{"./geocoder":8,"./util":24}],10:[function(t,e){"use strict";function n(t){return t>=93&&t--,t>=35&&t--,t-32}e.exports=function(t){return function(e,o){if(t){var i=n(t.grid[o].charCodeAt(e)),r=t.keys[i];return t.data[r]}}}},{}],11:[function(t,e){"use strict";var n=t("./util"),o=t("mustache"),i=L.Control.extend({options:{pinnable:!0,follow:!1,sanitizer:t("sanitize-caja"),touchTeaser:!0,location:!0},_currentContent:"",_pinned:!1,initialize:function(t,e){L.Util.setOptions(this,e),n.strict_instance(t,L.Class,"L.mapbox.gridLayer"),this._layer=t},setTemplate:function(t){return n.strict(t,"string"),this.options.template=t,this},_template:function(t,e){if(e){var n=this.options.template||this._layer.getTileJSON().template;if(n){var i={};return i["__"+t+"__"]=!0,this.options.sanitizer(o.to_html(n,L.extend(i,e)))}}},_show:function(t,e){t!==this._currentContent&&(this._currentContent=t,this.options.follow?(this._popup.setContent(t).setLatLng(e.latLng),this._map._popup!==this._popup&&this._popup.openOn(this._map)):(this._container.style.display="block",this._contentWrapper.innerHTML=t))},hide:function(){return this._pinned=!1,this._currentContent="",this._map.closePopup(),this._container.style.display="none",this._contentWrapper.innerHTML="",L.DomUtil.removeClass(this._container,"closable"),this},_mouseover:function(t){if(t.data?L.DomUtil.addClass(this._map._container,"map-clickable"):L.DomUtil.removeClass(this._map._container,"map-clickable"),!this._pinned){var e=this._template("teaser",t.data);e?this._show(e,t):this.hide()}},_mousemove:function(t){this._pinned||this.options.follow&&this._popup.setLatLng(t.latLng)},_navigateTo:function(t){window.top.location.href=t},_click:function(t){var e=this._template("location",t.data);if(this.options.location&&e&&0===e.search(/^https?:/))return this._navigateTo(this._template("location",t.data));if(this.options.pinnable){var n=this._template("full",t.data);!n&&this.options.touchTeaser&&L.Browser.touch&&(n=this._template("teaser",t.data)),n?(L.DomUtil.addClass(this._container,"closable"),this._pinned=!0,this._show(n,t)):this._pinned&&(L.DomUtil.removeClass(this._container,"closable"),this._pinned=!1,this.hide())}},_onPopupClose:function(){this._currentContent=null,this._pinned=!1},_createClosebutton:function(t,e){var n=L.DomUtil.create("a","close",t);return n.innerHTML="close",n.href="#",n.title="close",L.DomEvent.on(n,"click",L.DomEvent.stopPropagation).on(n,"mousedown",L.DomEvent.stopPropagation).on(n,"dblclick",L.DomEvent.stopPropagation).on(n,"click",L.DomEvent.preventDefault).on(n,"click",e,this),n},onAdd:function(t){this._map=t;var e="leaflet-control-grid map-tooltip",n=L.DomUtil.create("div",e),o=L.DomUtil.create("div","map-tooltip-content");return n.style.display="none",this._createClosebutton(n,this.hide),n.appendChild(o),this._contentWrapper=o,this._popup=new L.Popup({autoPan:!1,closeOnClick:!1}),t.on("popupclose",this._onPopupClose,this),L.DomEvent.disableClickPropagation(n).addListener(n,"mousewheel",L.DomEvent.stopPropagation),this._layer.on("mouseover",this._mouseover,this).on("mousemove",this._mousemove,this).on("click",this._click,this),n},onRemove:function(t){t.off("popupclose",this._onPopupClose,this),this._layer.off("mouseover",this._mouseover,this).off("mousemove",this._mousemove,this).off("click",this._click,this)}});e.exports.GridControl=i,e.exports.gridControl=function(t,e){return new i(t,e)}},{"./util":24,mustache:2,"sanitize-caja":3}],12:[function(t,e){"use strict";var n=t("./util"),o=t("./request"),i=t("./grid"),r=L.Class.extend({includes:[L.Mixin.Events,t("./load_tilejson")],options:{template:function(){return""}},_mouseOn:null,_tilejson:{},_cache:{},initialize:function(t,e){L.Util.setOptions(this,e),this._loadTileJSON(t)},_setTileJSON:function(t){return n.strict(t,"object"),L.extend(this.options,{grids:t.grids,minZoom:t.minzoom,maxZoom:t.maxzoom,bounds:t.bounds&&n.lbounds(t.bounds)}),this._tilejson=t,this._cache={},this._update(),this},getTileJSON:function(){return this._tilejson},active:function(){return!!(this._map&&this.options.grids&&this.options.grids.length)},addTo:function(t){return t.addLayer(this),this},onAdd:function(t){this._map=t,this._update(),this._map.on("click",this._click,this).on("mousemove",this._move,this).on("moveend",this._update,this)},onRemove:function(){this._map.off("click",this._click,this).off("mousemove",this._move,this).off("moveend",this._update,this)},getData:function(t,e){if(this.active()){var n=this._map,o=n.project(t.wrap()),i=256,r=4,a=Math.floor(o.x/i),s=Math.floor(o.y/i),l=n.options.crs.scale(n.getZoom())/i;return a=(a+l)%l,s=(s+l)%l,this._getTile(n.getZoom(),a,s,function(t){var n=Math.floor((o.x-a*i)/r),l=Math.floor((o.y-s*i)/r);e(t(n,l))}),this}},_click:function(t){this.getData(t.latlng,L.bind(function(e){this.fire("click",{latLng:t.latlng,data:e})},this))},_move:function(t){this.getData(t.latlng,L.bind(function(e){e!==this._mouseOn?(this._mouseOn&&this.fire("mouseout",{latLng:t.latlng,data:this._mouseOn}),this.fire("mouseover",{latLng:t.latlng,data:e}),this._mouseOn=e):this.fire("mousemove",{latLng:t.latlng,data:e})},this))},_getTileURL:function(t){var e=this.options.grids,n=(t.x+t.y)%e.length,o=e[n];return L.Util.template(o,t)},_update:function(){if(this.active()){var t=this._map.getPixelBounds(),e=this._map.getZoom(),n=256;if(!(e>this.options.maxZoom||e<this.options.minZoom))for(var o=L.bounds(t.min.divideBy(n)._floor(),t.max.divideBy(n)._floor()),i=this._map.options.crs.scale(e)/n,r=o.min.x;r<=o.max.x;r++)for(var a=o.min.y;a<=o.max.y;a++)this._getTile(e,(r%i+i)%i,(a%i+i)%i)}},_getTile:function(t,e,n,r){var a=t+"_"+e+"_"+n,s=L.point(e,n);if(s.z=t,this._tileShouldBeLoaded(s)){if(a in this._cache){if(!r)return;return"function"==typeof this._cache[a]?r(this._cache[a]):this._cache[a].push(r),void 0}this._cache[a]=[],r&&this._cache[a].push(r),o(this._getTileURL(s),L.bind(function(t,e){var n=this._cache[a];this._cache[a]=i(e);for(var o=0;o<n.length;++o)n[o](this._cache[a])},this))}},_tileShouldBeLoaded:function(t){if(t.z>this.options.maxZoom||t.z<this.options.minZoom)return!1;if(this.options.bounds){var e=256,n=t.multiplyBy(e),o=n.add(new L.Point(e,e)),i=this._map.unproject(n),r=this._map.unproject(o),a=new L.LatLngBounds([i,r]);if(!this.options.bounds.intersects(a))return!1}return!0}});e.exports.GridLayer=r,e.exports.gridLayer=function(t,e){return new r(t,e)}},{"./grid":10,"./load_tilejson":15,"./request":19,"./util":24}],13:[function(t,e){"use strict";var n=L.Control.extend({options:{position:"bottomright",sanitizer:t("sanitize-caja")},initialize:function(t){L.setOptions(this,t),this._info={}},onAdd:function(t){this._container=L.DomUtil.create("div","mapbox-control-info mapbox-small"),this._content=L.DomUtil.create("div","map-info-container",this._container);var e=L.DomUtil.create("a","mapbox-info-toggle mapbox-icon mapbox-icon-info",this._container);e.href="#",L.DomEvent.addListener(e,"click",this._showInfo,this),L.DomEvent.disableClickPropagation(this._container);for(var n in t._layers)t._layers[n].getAttribution&&this.addInfo(t._layers[n].getAttribution());return t.on("layeradd",this._onLayerAdd,this).on("layerremove",this._onLayerRemove,this),this._update(),this._container},onRemove:function(t){t.off("layeradd",this._onLayerAdd,this).off("layerremove",this._onLayerRemove,this)},addInfo:function(t){return t?(this._info[t]||(this._info[t]=0),this._info[t]=!0,this._update()):this},removeInfo:function(t){return t?(this._info[t]&&(this._info[t]=!1),this._update()):this},_showInfo:function(t){return L.DomEvent.preventDefault(t),this._active===!0?this._hidecontent():(L.DomUtil.addClass(this._container,"active"),this._active=!0,this._update(),void 0)},_hidecontent:function(){this._content.innerHTML="",this._active=!1,L.DomUtil.removeClass(this._container,"active")},_update:function(){if(!this._map)return this;this._content.innerHTML="";var t="none",e=[];for(var n in this._info)this._info.hasOwnProperty(n)&&this._info[n]&&(e.push(this.options.sanitizer(n)),t="block");return this._content.innerHTML+=e.join(" | "),this._container.style.display=t,this},_onLayerAdd:function(t){t.layer.getAttribution&&t.layer.getAttribution()?this.addInfo(t.layer.getAttribution()):"on"in t.layer&&t.layer.getAttribution&&t.layer.on("ready",L.bind(function(){this.addInfo(t.layer.getAttribution())},this))},_onLayerRemove:function(t){t.layer.getAttribution&&this.removeInfo(t.layer.getAttribution())}});e.exports.InfoControl=n,e.exports.infoControl=function(t){return new n(t)}},{"sanitize-caja":3}],14:[function(t,e){"use strict";var n=L.Control.extend({options:{position:"bottomright",sanitizer:t("sanitize-caja")},initialize:function(t){L.setOptions(this,t),this._legends={}},onAdd:function(){return this._container=L.DomUtil.create("div","map-legends wax-legends"),L.DomEvent.disableClickPropagation(this._container),this._update(),this._container},addLegend:function(t){return t?(this._legends[t]||(this._legends[t]=0),this._legends[t]++,this._update()):this},removeLegend:function(t){return t?(this._legends[t]&&this._legends[t]--,this._update()):this},_update:function(){if(!this._map)return this;this._container.innerHTML="";var t="none";for(var e in this._legends)if(this._legends.hasOwnProperty(e)&&this._legends[e]){var n=L.DomUtil.create("div","map-legend wax-legend",this._container);n.innerHTML=this.options.sanitizer(e),t="block"}return this._container.style.display=t,this}});e.exports.LegendControl=n,e.exports.legendControl=function(t){return new n(t)}},{"sanitize-caja":3}],15:[function(t,e){"use strict";var n=t("./request"),o=t("./url"),i=t("./util");e.exports={_loadTileJSON:function(t){"string"==typeof t?(t=o.tileJSON(t,this.options&&this.options.accessToken),n(t,L.bind(function(e,n){e?(i.log("could not load TileJSON at "+t),this.fire("error",{error:e})):n&&(this._setTileJSON(n),this.fire("ready"))},this))):t&&"object"==typeof t&&this._setTileJSON(t)}}},{"./request":19,"./url":23,"./util":24}],16:[function(t,e){"use strict";function n(t,e){return!e||t.accessToken?t:L.extend({accessToken:e},t)}var o=(t("./util"),t("./tile_layer").tileLayer),i=t("./feature_layer").featureLayer,r=t("./grid_layer").gridLayer,a=t("./grid_control").gridControl,s=t("./info_control").infoControl,l=t("./share_control").shareControl,c=t("./legend_control").legendControl,u=L.Map.extend({includes:[t("./load_tilejson")],options:{tileLayer:{},featureLayer:{},gridLayer:{},legendControl:{},gridControl:{},infoControl:!1,shareControl:!1},_tilejson:{},initialize:function(t,e,u){L.Map.prototype.initialize.call(this,t,L.extend({},L.Map.prototype.options,u)),this.attributionControl&&this.attributionControl.setPrefix(""),this.options.tileLayer&&(this.tileLayer=o(void 0,n(this.options.tileLayer,this.options.accessToken)),this.addLayer(this.tileLayer)),this.options.featureLayer&&(this.featureLayer=i(void 0,n(this.options.featureLayer,this.options.accessToken)),this.addLayer(this.featureLayer)),this.options.gridLayer&&(this.gridLayer=r(void 0,n(this.options.gridLayer,this.options.accessToken)),this.addLayer(this.gridLayer)),this.options.gridLayer&&this.options.gridControl&&(this.gridControl=a(this.gridLayer,this.options.gridControl),this.addControl(this.gridControl)),this.options.infoControl&&(this.infoControl=s(this.options.infoControl),this.addControl(this.infoControl)),this.options.legendControl&&(this.legendControl=c(this.options.legendControl),this.addControl(this.legendControl)),this.options.shareControl&&(this.shareControl=l(void 0,n(this.options.shareControl,this.options.accessToken)),this.addControl(this.shareControl)),this._loadTileJSON(e)},addLayer:function(t){return"on"in t&&t.on("ready",L.bind(function(){this._updateLayer(t)},this)),L.Map.prototype.addLayer.call(this,t)},_setTileJSON:function(t){return this._tilejson=t,this._initialize(t),this},getTileJSON:function(){return this._tilejson},_initialize:function(t){if(this.tileLayer&&(this.tileLayer._setTileJSON(t),this._updateLayer(this.tileLayer)),this.featureLayer&&!this.featureLayer.getGeoJSON()&&t.data&&t.data[0]&&this.featureLayer.loadURL(t.data[0]),this.gridLayer&&(this.gridLayer._setTileJSON(t),this._updateLayer(this.gridLayer)),this.infoControl&&t.attribution&&this.infoControl.addInfo(t.attribution),this.legendControl&&t.legend&&this.legendControl.addLegend(t.legend),this.shareControl&&this.shareControl._setTileJSON(t),!this._loaded&&t.center){var e=void 0!==this.getZoom()?this.getZoom():t.center[2],n=L.latLng(t.center[1],t.center[0]);this.setView(n,e)}},_editLink:function(){if(this._controlContainer.getElementsByClassName){var t=this._controlContainer.getElementsByClassName("mapbox-improve-map");if(t.length&&this._loaded)for(var e=this.getCenter().wrap(),n=this._tilejson||{},o=n.id||"",i=0;i<t.length;i++)t[i].href=t[i].href.split("#")[0]+"#"+o+"/"+e.lng.toFixed(3)+"/"+e.lat.toFixed(3)+"/"+this.getZoom()}},_updateLayer:function(t){t.options&&(this.infoControl&&this._loaded&&this.infoControl.addInfo(t.options.infoControl),this.attributionControl&&this._loaded&&t.getAttribution&&this.attributionControl.addAttribution(t.getAttribution()),this.on("moveend",this._editLink,this),L.stamp(t)in this._zoomBoundLayers||!t.options.maxZoom&&!t.options.minZoom||(this._zoomBoundLayers[L.stamp(t)]=t),this._editLink(),this._updateZoomLevels())}});e.exports.Map=u,e.exports.map=function(t,e,n){return new u(t,e,n)}},{"./feature_layer":7,"./grid_control":11,"./grid_layer":12,"./info_control":13,"./legend_control":14,"./load_tilejson":15,"./share_control":20,"./tile_layer":22,"./util":24}],17:[function(t,e){"use strict";var n=t("./geocoder_control"),o=t("./grid_control"),i=t("./feature_layer"),r=t("./legend_control"),a=t("./share_control"),s=t("./tile_layer"),l=t("./info_control"),c=t("./map"),u=t("./grid_layer");L.mapbox=e.exports={VERSION:t("../package.json").version,geocoder:t("./geocoder"),marker:t("./marker"),simplestyle:t("./simplestyle"),tileLayer:s.tileLayer,TileLayer:s.TileLayer,infoControl:l.infoControl,InfoControl:l.InfoControl,shareControl:a.shareControl,ShareControl:a.ShareControl,legendControl:r.legendControl,LegendControl:r.LegendControl,geocoderControl:n.geocoderControl,GeocoderControl:n.GeocoderControl,gridControl:o.gridControl,GridControl:o.GridControl,gridLayer:u.gridLayer,GridLayer:u.GridLayer,featureLayer:i.featureLayer,FeatureLayer:i.FeatureLayer,map:c.map,Map:c.Map,config:t("./config"),sanitize:t("sanitize-caja"),template:t("mustache").to_html},window.L.Icon.Default.imagePath=("https:"==document.location.protocol||"http:"==document.location.protocol?"":"https:")+"//api.tiles.mapbox.com/mapbox.js/v"+t("../package.json").version+"/images"},{"../package.json":5,"./config":6,"./feature_layer":7,"./geocoder":8,"./geocoder_control":9,"./grid_control":11,"./grid_layer":12,"./info_control":13,"./legend_control":14,"./map":16,"./marker":18,"./share_control":20,"./simplestyle":21,"./tile_layer":22,mustache:2,"sanitize-caja":3}],18:[function(t,e){"use strict";function n(t,e){t=t||{};var n={small:[20,50],medium:[30,70],large:[35,90]},o=t["marker-size"]||"medium",i="marker-symbol"in t&&""!==t["marker-symbol"]?"-"+t["marker-symbol"]:"",a=(t["marker-color"]||"7e7e7e").replace("#","");return L.icon({iconUrl:r("/marker/pin-"+o.charAt(0)+i+"+"+a+(L.Browser.retina?"@2x":"")+".png",e&&e.accessToken),iconSize:n[o],iconAnchor:[n[o][0]/2,n[o][1]/2],popupAnchor:[0,-n[o][1]/2]})}function o(t,e,o){return L.marker(e,{icon:n(t.properties,o),title:a.strip_tags(s(t.properties&&t.properties.title||""))})}function i(t,e){if(!t||!t.properties)return"";var n="";return t.properties.title&&(n+='<div class="marker-title">'+t.properties.title+"</div>"),t.properties.description&&(n+='<div class="marker-description">'+t.properties.description+"</div>"),(e||s)(n)}var r=t("./url"),a=t("./util"),s=t("sanitize-caja");e.exports={icon:n,style:o,createPopup:i}},{"./url":23,"./util":24,"sanitize-caja":3}],19:[function(t,e){"use strict";var n=t("corslite"),o=t("./util").strict,i=t("./config"),r=/^(https?:)?(?=\/\/(.|api)\.tiles\.mapbox\.com\/)/;e.exports=function(t,e){function a(t,n){!t&&n&&(n=JSON.parse(n.responseText)),e(t,n)}return o(t,"string"),o(e,"function"),t=t.replace(r,function(t,e){return"withCredentials"in new window.XMLHttpRequest?"https:"===e||"https:"===document.location.protocol||i.FORCE_HTTPS?"https:":"http:":document.location.protocol}),n(t,a)}},{"./config":6,"./util":24,corslite:1}],20:[function(t,e){"use strict";var n=t("./url"),o=L.Control.extend({includes:[t("./load_tilejson")],options:{position:"topleft",url:""},initialize:function(t,e){L.setOptions(this,e),this._loadTileJSON(t)},_setTileJSON:function(t){this._tilejson=t},onAdd:function(t){this._map=t;var e=L.DomUtil.create("div","leaflet-control-mapbox-share leaflet-bar"),n=L.DomUtil.create("a","mapbox-share mapbox-icon mapbox-icon-share",e);return n.href="#",this._modal=L.DomUtil.create("div","mapbox-modal",this._map._container),this._mask=L.DomUtil.create("div","mapbox-modal-mask",this._modal),this._content=L.DomUtil.create("div","mapbox-modal-content",this._modal),L.DomEvent.addListener(n,"click",this._shareClick,this),L.DomEvent.disableClickPropagation(e),this._map.on("mousedown",this._clickOut,this),e},_clickOut:function(t){return this._sharing?(L.DomEvent.preventDefault(t),L.DomUtil.removeClass(this._modal,"active"),this._content.innerHTML="",this._sharing=null,void 0):void 0},_shareClick:function(t){if(L.DomEvent.stop(t),this._sharing)return this._clickOut(t);var e=this._tilejson||this._map._tilejson||{},o=encodeURIComponent(this.options.url||e.webpage||window.location),i=encodeURIComponent(e.name),r=n("/"+e.id+"/"+this._map.getCenter().lng+","+this._map.getCenter().lat+","+this._map.getZoom()+"/600x600.png",this.options.accessToken),a=n("/"+e.id+".html",this.options.accessToken),s="//twitter.com/intent/tweet?status="+i+" "+o,l="//www.facebook.com/sharer.php?u="+o+"&t="+encodeURIComponent(e.name),c="//www.pinterest.com/pin/create/button/?url="+o+"&media="+r+"&description="+e.name,u="<h3>Share this map</h3><div class='mapbox-share-buttons'><a class='mapbox-button mapbox-button-icon mapbox-icon-facebook' target='_blank' href='{{facebook}}'>Facebook</a><a class='mapbox-button mapbox-button-icon mapbox-icon-twitter' target='_blank' href='{{twitter}}'>Twitter</a><a class='mapbox-button mapbox-button-icon mapbox-icon-pinterest' target='_blank' href='{{pinterest}}'>Pinterest</a></div>".replace("{{twitter}}",s).replace("{{facebook}}",l).replace("{{pinterest}}",c),h='<iframe width="100%" height="500px" frameBorder="0" src="{{embed}}"></iframe>'.replace("{{embed}}",a),p="Copy and paste this <strong>HTML code</strong> into documents to embed this map on web pages.";L.DomUtil.addClass(this._modal,"active"),this._sharing=L.DomUtil.create("div","mapbox-modal-body",this._content),this._sharing.innerHTML=u;var d=L.DomUtil.create("input","mapbox-embed",this._sharing);d.type="text",d.value=h;var m=L.DomUtil.create("label","mapbox-embed-description",this._sharing);m.innerHTML=p;var f=L.DomUtil.create("a","leaflet-popup-close-button",this._sharing);f.href="#",L.DomEvent.disableClickPropagation(this._sharing),L.DomEvent.addListener(f,"click",this._clickOut,this),L.DomEvent.addListener(d,"click",function(t){t.target.focus(),t.target.select()})}});e.exports.ShareControl=o,e.exports.shareControl=function(t,e){return new o(t,e)}},{"./load_tilejson":15,"./url":23}],21:[function(t,e){"use strict";function n(t,e){var n={};for(var o in e)n[o]=void 0===t[o]?e[o]:t[o];return n}function o(t){for(var e={},n=0;n<a.length;n++)e[a[n][1]]=t[a[n][0]];return e}function i(t){return o(n(t.properties||{},r))}var r={stroke:"#555555","stroke-width":2,"stroke-opacity":1,fill:"#555555","fill-opacity":.5},a=[["stroke","color"],["stroke-width","weight"],["stroke-opacity","opacity"],["fill","fillColor"],["fill-opacity","fillOpacity"]];e.exports={style:i,defaults:r}},{}],22:[function(t,e){"use strict";var n=t("./util"),o=L.TileLayer.extend({includes:[t("./load_tilejson")],options:{format:"png"},formats:["png","png32","png64","png128","png256","jpg70","jpg80","jpg90"],scalePrefix:"@2x.",initialize:function(t,e){L.TileLayer.prototype.initialize.call(this,void 0,e),this._tilejson={},e&&e.format&&n.strict_oneof(e.format,this.formats),this._loadTileJSON(t)},setFormat:function(t){return n.strict(t,"string"),this.options.format=t,this.redraw(),this},setUrl:null,_setTileJSON:function(t){return n.strict(t,"object"),L.extend(this.options,{tiles:t.tiles,attribution:t.attribution,minZoom:t.minzoom||0,maxZoom:t.maxzoom||18,tms:"tms"===t.scheme,bounds:t.bounds&&n.lbounds(t.bounds)}),this._tilejson=t,this.redraw(),this},getTileJSON:function(){return this._tilejson},getTileUrl:function(t){var e=this.options.tiles,n=Math.floor(Math.abs(t.x+t.y)%e.length),o=e[n],i=L.Util.template(o,t);return i?i.replace(".png",(L.Browser.retina?this.scalePrefix:".")+this.options.format):i},_update:function(){this.options.tiles&&L.TileLayer.prototype._update.call(this)}});e.exports.TileLayer=o,e.exports.tileLayer=function(t,e){return new o(t,e)}},{"./load_tilejson":15,"./util":24}],23:[function(t,e){"use strict";var n=t("./config"),o=t("../package.json").version;e.exports=function(t,e){if(e=e||L.mapbox.accessToken,!e&&n.REQUIRE_ACCESS_TOKEN)throw new Error("An API access token is required to use Mapbox.js. See https://www.mapbox.com/mapbox.js/api/v"+o+"/api-access-tokens/");var i="https:"===document.location.protocol||n.FORCE_HTTPS?n.HTTPS_URL:n.HTTP_URL;if(i+=t,i+=-1!==i.indexOf("?")?"&access_token=":"?access_token=",n.REQUIRE_ACCESS_TOKEN){if("s"===e[0])throw new Error("Use a public access token (pk.*) with Mapbox.js, not a secret access token (sk.*). See https://www.mapbox.com/mapbox.js/api/v"+o+"/api-access-tokens/");i+=e}return i},e.exports.tileJSON=function(t,n){if(-1!==t.indexOf("/"))return t;var o=e.exports("/"+t+".json",n);return 0===o.indexOf("https")&&(o+="&secure"),o}},{"../package.json":5,"./config":6}],24:[function(t,e){"use strict";function n(t,e){if(!e||!e.length)return!1;for(var n=0;n<e.length;n++)if(e[n]==t)return!0;return!1}e.exports={idUrl:function(t,e){-1==t.indexOf("/")?e.loadID(t):e.loadURL(t)},log:function(t){"object"==typeof console&&"function"==typeof console.error&&console.error(t)},strict:function(t,e){if(typeof t!==e)throw new Error("Invalid argument: "+e+" expected")},strict_instance:function(t,e,n){if(!(t instanceof e))throw new Error("Invalid argument: "+n+" expected")},strict_oneof:function(t,e){if(!n(t,e))throw new Error("Invalid argument: "+t+" given, valid values are "+e.join(", "))},strip_tags:function(t){return t.replace(/<[^<]+>/g,"")},lbounds:function(t){return new L.LatLngBounds([[t[1],t[0]],[t[3],t[2]]])}}},{}]},{},[17]);;!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.omnivore=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){var xhr=_dereq_("corslite"),csv2geojson=_dereq_("csv2geojson"),wellknown=_dereq_("wellknown"),topojson=_dereq_("topojson"),toGeoJSON=_dereq_("togeojson");module.exports.geojson=geojsonLoad;module.exports.topojson=topojsonLoad;module.exports.topojson.parse=topojsonParse;module.exports.csv=csvLoad;module.exports.csv.parse=csvParse;module.exports.gpx=gpxLoad;module.exports.gpx.parse=gpxParse;module.exports.kml=kmlLoad;module.exports.kml.parse=kmlParse;module.exports.wkt=wktLoad;module.exports.wkt.parse=wktParse;function addData(l,d){if("addData"in l)l.addData(d);if("setGeoJSON"in l)l.setGeoJSON(d)}function geojsonLoad(url,options,customLayer){var layer=customLayer||L.geoJson();xhr(url,function(err,response){if(err)return layer.fire("error",{error:err});addData(layer,JSON.parse(response.responseText));layer.fire("ready")});return layer}function topojsonLoad(url,options,customLayer){var layer=customLayer||L.geoJson();xhr(url,onload);function onload(err,response){if(err)return layer.fire("error",{error:err});addData(layer,topojsonParse(response.responseText));layer.fire("ready")}return layer}function csvLoad(url,options,customLayer){var layer=customLayer||L.geoJson();xhr(url,onload);function onload(err,response){var error;if(err)return layer.fire("error",{error:err});function avoidReady(){error=true}layer.on("error",avoidReady);csvParse(response.responseText,options,layer);layer.off("error",avoidReady);if(!error)layer.fire("ready")}return layer}function gpxLoad(url,options,customLayer){var layer=customLayer||L.geoJson();xhr(url,onload);function onload(err,response){var error;if(err)return layer.fire("error",{error:err});function avoidReady(){error=true}layer.on("error",avoidReady);gpxParse(response.responseXML||response.responseText,options,layer);layer.off("error",avoidReady);if(!error)layer.fire("ready")}return layer}function kmlLoad(url,options,customLayer){var layer=L.geoJson();xhr(url,onload);function onload(err,response){var error;if(err)return layer.fire("error",{error:err});function avoidReady(){error=true}layer.on("error",avoidReady);kmlParse(response.responseXML||response.responseText,options,layer);layer.off("error",avoidReady);if(!error)layer.fire("ready")}return layer}function wktLoad(url,options,customLayer){var layer=customLayer||L.geoJson();xhr(url,onload);function onload(err,response){if(err)return layer.fire("error",{error:err});wktParse(response.responseText,options,layer);layer.fire("ready")}return layer}function topojsonParse(data){var o=typeof data==="string"?JSON.parse(data):data;var features=[];for(var i in o.objects){var ft=topojson.feature(o,o.objects[i]);if(ft.features)features=features.concat(ft.features);else features=features.concat([ft])}return features}function csvParse(csv,options,layer){layer=layer||L.geoJson();options=options||{};csv2geojson.csv2geojson(csv,options,onparse);function onparse(err,geojson){if(err)return layer.fire("error",{error:err});addData(layer,geojson)}return layer}function gpxParse(gpx,options,layer){var xml=parseXML(gpx);if(!xml)return layer.fire("error",{error:"Could not parse GPX"});layer=layer||L.geoJson();var geojson=toGeoJSON.gpx(xml);addData(layer,geojson);return layer}function kmlParse(gpx,options,layer){var xml=parseXML(gpx);if(!xml)return layer.fire("error",{error:"Could not parse GPX"});layer=layer||L.geoJson();var geojson=toGeoJSON.kml(xml);addData(layer,geojson);return layer}function wktParse(wkt,options,layer){layer=layer||L.geoJson();var geojson=wellknown(wkt);addData(layer,geojson);return layer}function parseXML(str){if(typeof str==="string"){return(new DOMParser).parseFromString(str,"text/xml")}else{return str}}},{corslite:5,csv2geojson:6,togeojson:9,topojson:10,wellknown:41}],2:[function(_dereq_,module,exports){},{}],3:[function(_dereq_,module,exports){module.exports=_dereq_(2)},{}],4:[function(_dereq_,module,exports){var process=module.exports={};process.nextTick=function(){var canSetImmediate=typeof window!=="undefined"&&window.setImmediate;var canPost=typeof window!=="undefined"&&window.postMessage&&window.addEventListener;if(canSetImmediate){return function(f){return window.setImmediate(f)}}if(canPost){var queue=[];window.addEventListener("message",function(ev){var source=ev.source;if((source===window||source===null)&&ev.data==="process-tick"){ev.stopPropagation();if(queue.length>0){var fn=queue.shift();fn()}}},true);return function nextTick(fn){queue.push(fn);window.postMessage("process-tick","*")}}return function nextTick(fn){setTimeout(fn,0)}}();process.title="browser";process.browser=true;process.env={};process.argv=[];process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return"/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")}},{}],5:[function(_dereq_,module,exports){function xhr(url,callback,cors){var sent=false;if(typeof window.XMLHttpRequest==="undefined"){return callback(Error("Browser not supported"))}if(typeof cors==="undefined"){var m=url.match(/^\s*https?:\/\/[^\/]*/);cors=m&&m[0]!==location.protocol+"//"+location.domain+(location.port?":"+location.port:"")}var x;function isSuccessful(status){return status>=200&&status<300||status===304}if(cors&&(typeof window.XDomainRequest==="object"||typeof window.XDomainRequest==="function")){x=new window.XDomainRequest;var original=callback;callback=function(){if(sent){original.apply(this,arguments)}else{var that=this,args=arguments;setTimeout(function(){original.apply(that,args)},0)}}}else{x=new window.XMLHttpRequest}function loaded(){if(x.status===undefined||isSuccessful(x.status))callback.call(x,null,x);else callback.call(x,x,null)}if("onload"in x){x.onload=loaded}else{x.onreadystatechange=function readystate(){if(x.readyState===4){loaded()}}}x.onerror=function error(evt){callback.call(this,evt||true,null);callback=function(){}};x.onprogress=function(){};x.ontimeout=function(evt){callback.call(this,evt,null);callback=function(){}};x.onabort=function(evt){callback.call(this,evt,null);callback=function(){}};x.open("GET",url,true);x.send(null);sent=true;return x}if(typeof module!=="undefined")module.exports=xhr},{}],6:[function(_dereq_,module,exports){var dsv=_dereq_("dsv"),sexagesimal=_dereq_("sexagesimal");function isLat(f){return!!f.match(/(Lat)(itude)?/gi)}function isLon(f){return!!f.match(/(L)(on|ng)(gitude)?/i)}function keyCount(o){return typeof o=="object"?Object.keys(o).length:0}function autoDelimiter(x){var delimiters=[",",";","	","|"];var results=[];delimiters.forEach(function(delimiter){var res=dsv(delimiter).parse(x);if(res.length>=1){var count=keyCount(res[0]);for(var i=0;i<res.length;i++){if(keyCount(res[i])!==count)return}results.push({delimiter:delimiter,arity:Object.keys(res[0]).length})}});if(results.length){return results.sort(function(a,b){return b.arity-a.arity})[0].delimiter}else{return null}}function auto(x){var delimiter=autoDelimiter(x);if(!delimiter)return null;return dsv(delimiter).parse(x)}function csv2geojson(x,options,callback){if(!callback){callback=options;options={}}options.delimiter=options.delimiter||",";var latfield=options.latfield||"",lonfield=options.lonfield||"";var features=[],featurecollection={type:"FeatureCollection",features:features};if(options.delimiter==="auto"&&typeof x=="string"){options.delimiter=autoDelimiter(x);if(!options.delimiter)return callback({type:"Error",message:"Could not autodetect delimiter"})}var parsed=typeof x=="string"?dsv(options.delimiter).parse(x):x;if(!parsed.length)return callback(null,featurecollection);if(!latfield||!lonfield){for(var f in parsed[0]){if(!latfield&&isLat(f))latfield=f;if(!lonfield&&isLon(f))lonfield=f}if(!latfield||!lonfield){var fields=[];for(var k in parsed[0])fields.push(k);return callback({type:"Error",message:"Latitude and longitude fields not present",data:parsed,fields:fields})}}var errors=[];for(var i=0;i<parsed.length;i++){if(parsed[i][lonfield]!==undefined&&parsed[i][lonfield]!==undefined){var lonk=parsed[i][lonfield],latk=parsed[i][latfield],lonf,latf,a;a=sexagesimal(lonk,"EW");if(a)lonk=a;a=sexagesimal(latk,"NS");if(a)latk=a;lonf=parseFloat(lonk);latf=parseFloat(latk);if(isNaN(lonf)||isNaN(latf)){errors.push({message:"A row contained an invalid value for latitude or longitude",row:parsed[i]})}else{if(!options.includeLatLon){delete parsed[i][lonfield];delete parsed[i][latfield]}features.push({type:"Feature",properties:parsed[i],geometry:{type:"Point",coordinates:[parseFloat(lonf),parseFloat(latf)]}})}}}callback(errors.length?errors:null,featurecollection)}function toLine(gj){var features=gj.features;var line={type:"Feature",geometry:{type:"LineString",coordinates:[]}};for(var i=0;i<features.length;i++){line.geometry.coordinates.push(features[i].geometry.coordinates)}line.properties=features[0].properties;return{type:"FeatureCollection",features:[line]}}function toPolygon(gj){var features=gj.features;var poly={type:"Feature",geometry:{type:"Polygon",coordinates:[[]]}};for(var i=0;i<features.length;i++){poly.geometry.coordinates[0].push(features[i].geometry.coordinates)}poly.properties=features[0].properties;return{type:"FeatureCollection",features:[poly]}}module.exports={isLon:isLon,isLat:isLat,csv:dsv.csv.parse,tsv:dsv.tsv.parse,dsv:dsv,auto:auto,csv2geojson:csv2geojson,toLine:toLine,toPolygon:toPolygon}},{dsv:7,sexagesimal:8}],7:[function(_dereq_,module,exports){var fs=_dereq_("fs");module.exports=new Function('dsv.version = "0.0.3";\n\ndsv.tsv = dsv("\\t");\ndsv.csv = dsv(",");\n\nfunction dsv(delimiter) {\n  var dsv = {},\n      reFormat = new RegExp("[\\"" + delimiter + "\\n]"),\n      delimiterCode = delimiter.charCodeAt(0);\n\n  dsv.parse = function(text, f) {\n    var o;\n    return dsv.parseRows(text, function(row, i) {\n      if (o) return o(row, i - 1);\n      var a = new Function("d", "return {" + row.map(function(name, i) {\n        return JSON.stringify(name) + ": d[" + i + "]";\n      }).join(",") + "}");\n      o = f ? function(row, i) { return f(a(row), i); } : a;\n    });\n  };\n\n  dsv.parseRows = function(text, f) {\n    var EOL = {}, // sentinel value for end-of-line\n        EOF = {}, // sentinel value for end-of-file\n        rows = [], // output rows\n        N = text.length,\n        I = 0, // current character index\n        n = 0, // the current line number\n        t, // the current token\n        eol; // is the current token followed by EOL?\n\n    function token() {\n      if (I >= N) return EOF; // special case: end of file\n      if (eol) return eol = false, EOL; // special case: end of line\n\n      // special case: quotes\n      var j = I;\n      if (text.charCodeAt(j) === 34) {\n        var i = j;\n        while (i++ < N) {\n          if (text.charCodeAt(i) === 34) {\n            if (text.charCodeAt(i + 1) !== 34) break;\n            ++i;\n          }\n        }\n        I = i + 2;\n        var c = text.charCodeAt(i + 1);\n        if (c === 13) {\n          eol = true;\n          if (text.charCodeAt(i + 2) === 10) ++I;\n        } else if (c === 10) {\n          eol = true;\n        }\n        return text.substring(j + 1, i).replace(/""/g, "\\"");\n      }\n\n      // common case: find next delimiter or newline\n      while (I < N) {\n        var c = text.charCodeAt(I++), k = 1;\n        if (c === 10) eol = true; // \\n\n        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \\r|\\r\\n\n        else if (c !== delimiterCode) continue;\n        return text.substring(j, I - k);\n      }\n\n      // special case: last token before EOF\n      return text.substring(j);\n    }\n\n    while ((t = token()) !== EOF) {\n      var a = [];\n      while (t !== EOL && t !== EOF) {\n        a.push(t);\n        t = token();\n      }\n      if (f && !(a = f(a, n++))) continue;\n      rows.push(a);\n    }\n\n    return rows;\n  };\n\n  dsv.format = function(rows) {\n    if (Array.isArray(rows[0])) return dsv.formatRows(rows); // deprecated; use formatRows\n    var fieldSet = {}, fields = [];\n\n    // Compute unique fields in order of discovery.\n    rows.forEach(function(row) {\n      for (var field in row) {\n        if (!(field in fieldSet)) {\n          fields.push(fieldSet[field] = field);\n        }\n      }\n    });\n\n    return [fields.map(formatValue).join(delimiter)].concat(rows.map(function(row) {\n      return fields.map(function(field) {\n        return formatValue(row[field]);\n      }).join(delimiter);\n    })).join("\\n");\n  };\n\n  dsv.formatRows = function(rows) {\n    return rows.map(formatRow).join("\\n");\n  };\n\n  function formatRow(row) {\n    return row.map(formatValue).join(delimiter);\n  }\n\n  function formatValue(text) {\n    return reFormat.test(text) ? "\\"" + text.replace(/\\"/g, "\\"\\"") + "\\"" : text;\n  }\n\n  return dsv;\n}\n'+";return dsv")()},{fs:2}],8:[function(_dereq_,module,exports){module.exports=function(x,dims){if(!dims)dims="NSEW";if(typeof x!=="string")return null;var r=/^([0-9.]+)°? *(?:([0-9.]+)['’′‘] *)?(?:([0-9.]+)(?:''|"|”|″) *)?([NSEW])?/,m=x.match(r);if(!m)return null;else if(m[4]&&dims.indexOf(m[4])===-1)return null;else return((m[1]?parseFloat(m[1]):0)+(m[2]?parseFloat(m[2])/60:0)+(m[3]?parseFloat(m[3])/3600:0))*(m[4]&&m[4]==="S"||m[4]==="W"?-1:1)}},{}],9:[function(_dereq_,module,exports){(function(process){toGeoJSON=function(){"use strict";var removeSpace=/\s*/g,trimSpace=/^\s*|\s*$/g,splitSpace=/\s+/;function okhash(x){if(!x||!x.length)return 0;for(var i=0,h=0;i<x.length;i++){h=(h<<5)-h+x.charCodeAt(i)|0}return h}function get(x,y){return x.getElementsByTagName(y)}function attr(x,y){return x.getAttribute(y)}function attrf(x,y){return parseFloat(attr(x,y))}function get1(x,y){var n=get(x,y);return n.length?n[0]:null}function norm(el){if(el.normalize){el.normalize()}return el}function numarray(x){for(var j=0,o=[];j<x.length;j++)o[j]=parseFloat(x[j]);return o}function clean(x){var o={};for(var i in x)if(x[i])o[i]=x[i];return o}function nodeVal(x){if(x){norm(x)}return x&&x.firstChild&&x.firstChild.nodeValue}function coord1(v){return numarray(v.replace(removeSpace,"").split(","))}function coord(v){var coords=v.replace(trimSpace,"").split(splitSpace),o=[];for(var i=0;i<coords.length;i++){o.push(coord1(coords[i]))}return o}function coordPair(x){var ll=[attrf(x,"lon"),attrf(x,"lat")],ele=get1(x,"ele");if(ele)ll.push(parseFloat(nodeVal(ele)));return ll}function fc(){return{type:"FeatureCollection",features:[]}}var serializer;if(typeof XMLSerializer!=="undefined"){serializer=new XMLSerializer}else if(typeof exports==="object"&&typeof process==="object"&&!process.browser){serializer=new(_dereq_("xmldom").XMLSerializer)}function xml2str(str){return serializer.serializeToString(str)}var t={kml:function(doc,o){o=o||{};var gj=fc(),styleIndex={},geotypes=["Polygon","LineString","Point","Track"],placemarks=get(doc,"Placemark"),styles=get(doc,"Style");for(var k=0;k<styles.length;k++){styleIndex["#"+attr(styles[k],"id")]=okhash(xml2str(styles[k])).toString(16)}for(var j=0;j<placemarks.length;j++){gj.features=gj.features.concat(getPlacemark(placemarks[j]))}function gxCoord(v){return numarray(v.split(" "))}function gxCoords(root){var elems=get(root,"coord","gx"),coords=[];for(var i=0;i<elems.length;i++)coords.push(gxCoord(nodeVal(elems[i])));return coords}function getGeometry(root){var geomNode,geomNodes,i,j,k,geoms=[];if(get1(root,"MultiGeometry"))return getGeometry(get1(root,"MultiGeometry"));if(get1(root,"MultiTrack"))return getGeometry(get1(root,"MultiTrack"));for(i=0;i<geotypes.length;i++){geomNodes=get(root,geotypes[i]);if(geomNodes){for(j=0;j<geomNodes.length;j++){geomNode=geomNodes[j];if(geotypes[i]=="Point"){geoms.push({type:"Point",coordinates:coord1(nodeVal(get1(geomNode,"coordinates")))})}else if(geotypes[i]=="LineString"){geoms.push({type:"LineString",coordinates:coord(nodeVal(get1(geomNode,"coordinates")))})}else if(geotypes[i]=="Polygon"){var rings=get(geomNode,"LinearRing"),coords=[];for(k=0;k<rings.length;k++){coords.push(coord(nodeVal(get1(rings[k],"coordinates"))))}geoms.push({type:"Polygon",coordinates:coords})}else if(geotypes[i]=="Track"){geoms.push({type:"LineString",coordinates:gxCoords(geomNode)})}}}}return geoms}function getPlacemark(root){var geoms=getGeometry(root),i,properties={},name=nodeVal(get1(root,"name")),styleUrl=nodeVal(get1(root,"styleUrl")),description=nodeVal(get1(root,"description")),timeSpan=get1(root,"TimeSpan"),extendedData=get1(root,"ExtendedData");if(!geoms.length)return[];if(name)properties.name=name;if(styleUrl&&styleIndex[styleUrl]){properties.styleUrl=styleUrl;properties.styleHash=styleIndex[styleUrl]}if(description)properties.description=description;if(timeSpan){var begin=nodeVal(get1(timeSpan,"begin"));var end=nodeVal(get1(timeSpan,"end"));properties.timespan={begin:begin,end:end}}if(extendedData){var datas=get(extendedData,"Data"),simpleDatas=get(extendedData,"SimpleData");for(i=0;i<datas.length;i++){properties[datas[i].getAttribute("name")]=nodeVal(get1(datas[i],"value"))}for(i=0;i<simpleDatas.length;i++){properties[simpleDatas[i].getAttribute("name")]=nodeVal(simpleDatas[i])}}return[{type:"Feature",geometry:geoms.length===1?geoms[0]:{type:"GeometryCollection",geometries:geoms},properties:properties}]}return gj},gpx:function(doc,o){var i,tracks=get(doc,"trk"),routes=get(doc,"rte"),waypoints=get(doc,"wpt"),gj=fc();for(i=0;i<tracks.length;i++){gj.features.push(getLinestring(tracks[i],"trkpt"))}for(i=0;i<routes.length;i++){gj.features.push(getLinestring(routes[i],"rtept"))}for(i=0;i<waypoints.length;i++){gj.features.push(getPoint(waypoints[i]))}function getLinestring(node,pointname){var j,pts=get(node,pointname),line=[];for(j=0;j<pts.length;j++){line.push(coordPair(pts[j]))}return{type:"Feature",properties:getProperties(node),geometry:{type:"LineString",coordinates:line}}}function getPoint(node){var prop=getProperties(node);prop.sym=nodeVal(get1(node,"sym"));return{type:"Feature",properties:prop,geometry:{type:"Point",coordinates:coordPair(node)}}}function getProperties(node){var meta=["name","desc","author","copyright","link","time","keywords"],prop={},k;for(k=0;k<meta.length;k++){prop[meta[k]]=nodeVal(get1(node,meta[k]))}return clean(prop)}return gj}};return t}();if(typeof module!=="undefined")module.exports=toGeoJSON}).call(this,_dereq_("/Users/tmcw/src/leaflet-omnivore/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))},{"/Users/tmcw/src/leaflet-omnivore/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":4,xmldom:3}],10:[function(_dereq_,module,exports){var topojson=module.exports=_dereq_("./topojson");topojson.topology=_dereq_("./lib/topojson/topology");topojson.simplify=_dereq_("./lib/topojson/simplify");topojson.clockwise=_dereq_("./lib/topojson/clockwise");topojson.filter=_dereq_("./lib/topojson/filter");topojson.prune=_dereq_("./lib/topojson/prune");topojson.bind=_dereq_("./lib/topojson/bind");topojson.stitch=_dereq_("./lib/topojson/stitch");topojson.scale=_dereq_("./lib/topojson/scale")},{"./lib/topojson/bind":11,"./lib/topojson/clockwise":14,"./lib/topojson/filter":18,"./lib/topojson/prune":22,"./lib/topojson/scale":24,"./lib/topojson/simplify":25,"./lib/topojson/stitch":27,"./lib/topojson/topology":28,"./topojson":40}],11:[function(_dereq_,module,exports){var type=_dereq_("./type"),topojson=_dereq_("../../");module.exports=function(topology,propertiesById){var bind=type({geometry:function(geometry){var properties0=geometry.properties,properties1=propertiesById[geometry.id];if(properties1){if(properties0)for(var k in properties1)properties0[k]=properties1[k];else for(var k in properties1){geometry.properties=properties1;break}}this.defaults.geometry.call(this,geometry)},LineString:noop,MultiLineString:noop,Point:noop,MultiPoint:noop,Polygon:noop,MultiPolygon:noop});for(var key in topology.objects){bind.object(topology.objects[key])}};function noop(){}},{"../../":10,"./type":39}],12:[function(_dereq_,module,exports){module.exports=function(objects){var x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;function boundGeometry(geometry){if(geometry&&boundGeometryType.hasOwnProperty(geometry.type))boundGeometryType[geometry.type](geometry)}var boundGeometryType={GeometryCollection:function(o){o.geometries.forEach(boundGeometry)},Point:function(o){boundPoint(o.coordinates)},MultiPoint:function(o){o.coordinates.forEach(boundPoint)},LineString:function(o){boundLine(o.coordinates)},MultiLineString:function(o){o.coordinates.forEach(boundLine)},Polygon:function(o){o.coordinates.forEach(boundLine)},MultiPolygon:function(o){o.coordinates.forEach(boundMultiLine)}};function boundPoint(coordinates){var x=coordinates[0],y=coordinates[1];if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}function boundLine(coordinates){coordinates.forEach(boundPoint)}function boundMultiLine(coordinates){coordinates.forEach(boundLine)}for(var key in objects){boundGeometry(objects[key])}return[x0,y0,x1,y1]}},{}],13:[function(_dereq_,module,exports){exports.name="cartesian";exports.formatDistance=formatDistance;exports.ringArea=ringArea;exports.absoluteArea=Math.abs;exports.triangleArea=triangleArea;exports.distance=distance;function formatDistance(d){return d.toString()}function ringArea(ring){var i=-1,n=ring.length,a,b=ring[n-1],area=0;while(++i<n){a=b;b=ring[i];area+=a[0]*b[1]-a[1]*b[0]}return area*.5}function triangleArea(triangle){return Math.abs((triangle[0][0]-triangle[2][0])*(triangle[1][1]-triangle[0][1])-(triangle[0][0]-triangle[1][0])*(triangle[2][1]-triangle[0][1]))}function distance(x0,y0,x1,y1){var dx=x0-x1,dy=y0-y1;return Math.sqrt(dx*dx+dy*dy)}},{}],14:[function(_dereq_,module,exports){var type=_dereq_("./type"),systems=_dereq_("./coordinate-systems"),topojson=_dereq_("../../");module.exports=function(object,options){if(object.type==="Topology")clockwiseTopology(object,options);else clockwiseGeometry(object,options)};function clockwiseGeometry(object,options){var system=null;if(options)"coordinate-system"in options&&(system=systems[options["coordinate-system"]]);var clockwisePolygon=clockwisePolygonSystem(system.ringArea,reverse);type({LineString:noop,MultiLineString:noop,Point:noop,MultiPoint:noop,Polygon:function(polygon){clockwisePolygon(polygon.coordinates)},MultiPolygon:function(multiPolygon){multiPolygon.coordinates.forEach(clockwisePolygon)}}).object(object);function reverse(array){array.reverse()}}function clockwiseTopology(topology,options){var system=null;if(options)"coordinate-system"in options&&(system=systems[options["coordinate-system"]]);var clockwisePolygon=clockwisePolygonSystem(ringArea,reverse);var clockwise=type({LineString:noop,MultiLineString:noop,Point:noop,MultiPoint:noop,Polygon:function(polygon){clockwisePolygon(polygon.arcs)},MultiPolygon:function(multiPolygon){multiPolygon.arcs.forEach(clockwisePolygon)}});for(var key in topology.objects){clockwise.object(topology.objects[key])}function ringArea(ring){return system.ringArea(topojson.feature(topology,{type:"Polygon",arcs:[ring]}).geometry.coordinates[0])}function reverse(ring){var i=-1,n=ring.length;ring.reverse();while(++i<n)ring[i]=~ring[i]}}function clockwisePolygonSystem(ringArea,reverse){return function(rings){if(!(n=rings.length))return;var n,areas=new Array(n),max=-Infinity,best,area,t;for(var i=0;i<n;++i){var area=Math.abs(areas[i]=ringArea(rings[i]));if(area>max)max=area,best=i}if(best){t=rings[best],rings[best]=rings[0],rings[0]=t;t=areas[best],areas[best]=areas[0],areas[0]=t}if(areas[0]<0)reverse(rings[0]);for(var i=1;i<n;++i){if(areas[i]>0)reverse(rings[i])}}}function noop(){}},{"../../":10,"./coordinate-systems":16,"./type":39}],15:[function(_dereq_,module,exports){module.exports=function(objects,id){if(arguments.length<2)id=function(d){return d.id};function idObject(object){if(object&&idObjectType.hasOwnProperty(object.type))idObjectType[object.type](object)}function idFeature(feature){var i=id(feature);if(i==null)delete feature.id;else feature.id=i}var idObjectType={Feature:idFeature,FeatureCollection:function(collection){collection.features.forEach(idFeature)}};for(var key in objects){idObject(objects[key])}return objects}},{}],16:[function(_dereq_,module,exports){module.exports={cartesian:_dereq_("./cartesian"),spherical:_dereq_("./spherical")}},{"./cartesian":13,"./spherical":26}],17:[function(_dereq_,module,exports){module.exports=function(topology){var arcs=topology.arcs,i=-1,n=arcs.length;while(++i<n){var arc=arcs[i],j=0,m=arc.length,point=arc[0],x0=point[0],y0=point[1],x1,y1;while(++j<m){point=arc[j];x1=point[0];y1=point[1];arc[j]=[x1-x0,y1-y0];x0=x1;y0=y1}}return topology}},{}],18:[function(_dereq_,module,exports){var type=_dereq_("./type"),prune=_dereq_("./prune"),clockwise=_dereq_("./clockwise"),systems=_dereq_("./coordinate-systems"),topojson=_dereq_("../../");module.exports=function(topology,options){var system=null,forceClockwise=true,preserveAttached=true,preserveRing=preserveNone,minimumArea;if(options)"coordinate-system"in options&&(system=systems[options["coordinate-system"]]),"minimum-area"in options&&(minimumArea=+options["minimum-area"]),"preserve-attached"in options&&(preserveAttached=!!options["preserve-attached"]),"force-clockwise"in options&&(forceClockwise=!!options["force-clockwise"]);if(forceClockwise)clockwise(topology,options);if(!(minimumArea>0))minimumArea=Number.MIN_VALUE;if(preserveAttached){var uniqueRingByArc={},ringIndex=0;var checkAttachment=type({LineString:noop,MultiLineString:noop,Point:noop,MultiPoint:noop,MultiPolygon:function(multiPolygon){var arcs=multiPolygon.arcs,i=-1,n=arcs.length;while(++i<n)this.polygon(arcs[i])},Polygon:function(polygon){this.polygon(polygon.arcs)},polygon:function(arcs){for(var i=0,n=arcs.length;i<n;++i,++ringIndex){for(var ring=arcs[i],j=0,m=ring.length;j<m;++j){var arc=ring[j];if(arc<0)arc=~arc;var uniqueRing=uniqueRingByArc[arc];if(uniqueRing>=0&&uniqueRing!==ringIndex)uniqueRingByArc[arc]=-1;else uniqueRingByArc[arc]=ringIndex}}}});preserveRing=function(ring){for(var j=0,m=ring.length;j<m;++j){var arc=ring[j];if(uniqueRingByArc[arc<0?~arc:arc]<0){return true}}};for(var key in topology.objects){checkAttachment.object(topology.objects[key])}}var filter=type({LineString:noop,MultiLineString:noop,Point:noop,MultiPoint:noop,Polygon:function(polygon){polygon.arcs=filterPolygon(polygon.arcs);if(!polygon.arcs||!polygon.arcs.length){polygon.type=null;delete polygon.arcs}},MultiPolygon:function(multiPolygon){multiPolygon.arcs=multiPolygon.arcs.map(filterPolygon).filter(function(polygon){return polygon&&polygon.length});if(!multiPolygon.arcs.length){multiPolygon.type=null;delete multiPolygon.arcs}},GeometryCollection:function(collection){this.defaults.GeometryCollection.call(this,collection);collection.geometries=collection.geometries.filter(function(geometry){return geometry.type!=null});if(!collection.geometries.length){collection.type=null;delete collection.geometries}}});for(var key in topology.objects){filter.object(topology.objects[key])}prune(topology,options);function filterPolygon(arcs){return arcs.length&&filterExteriorRing(arcs[0])?[arcs.shift()].concat(arcs.filter(filterInteriorRing)):null}function filterExteriorRing(ring){return preserveRing(ring)||system.absoluteArea(ringArea(ring))>=minimumArea}function filterInteriorRing(ring){return preserveRing(ring)||system.absoluteArea(-ringArea(ring))>=minimumArea}function ringArea(ring){return system.ringArea(topojson.feature(topology,{type:"Polygon",arcs:[ring]}).geometry.coordinates[0])}};function noop(){}function preserveNone(){return false}},{"../../":10,"./clockwise":14,"./coordinate-systems":16,"./prune":22,"./type":39}],19:[function(_dereq_,module,exports){module.exports=function(objects){function geomifyObject(object){return(object&&geomifyObjectType.hasOwnProperty(object.type)?geomifyObjectType[object.type]:geomifyGeometry)(object)}function geomifyFeature(feature){var geometry=feature.geometry;if(geometry==null){feature.type=null}else{geomifyGeometry(geometry);feature.type=geometry.type;if(geometry.geometries)feature.geometries=geometry.geometries;else if(geometry.coordinates)feature.coordinates=geometry.coordinates}delete feature.geometry;return feature}function geomifyGeometry(geometry){if(!geometry)return{type:null};if(geomifyGeometryType.hasOwnProperty(geometry.type))geomifyGeometryType[geometry.type](geometry);return geometry}var geomifyObjectType={Feature:geomifyFeature,FeatureCollection:function(collection){collection.type="GeometryCollection";collection.geometries=collection.features;collection.features.forEach(geomifyFeature);delete collection.features;return collection}};var geomifyGeometryType={GeometryCollection:function(o){var geometries=o.geometries,i=-1,n=geometries.length;while(++i<n)geometries[i]=geomifyGeometry(geometries[i])},MultiPoint:function(o){if(!o.coordinates.length){o.type=null;delete o.coordinates}else if(o.coordinates.length<2){o.type="Point";o.coordinates=o.coordinates[0]}},LineString:function(o){if(!o.coordinates.length){o.type=null;delete o.coordinates}},MultiLineString:function(o){for(var lines=o.coordinates,i=0,N=0,n=lines.length;i<n;++i){var line=lines[i];if(line.length)lines[N++]=line}if(!N){o.type=null;delete o.coordinates}else if(N<2){o.type="LineString";o.coordinates=lines[0]}else{o.coordinates.length=N}},Polygon:function(o){for(var rings=o.coordinates,i=0,N=0,n=rings.length;i<n;++i){var ring=rings[i];if(ring.length)rings[N++]=ring}if(!N){o.type=null;delete o.coordinates}else{o.coordinates.length=N}},MultiPolygon:function(o){for(var polygons=o.coordinates,j=0,M=0,m=polygons.length;j<m;++j){for(var rings=polygons[j],i=0,N=0,n=rings.length;i<n;++i){var ring=rings[i];if(ring.length)rings[N++]=ring}if(N){rings.length=N;polygons[M++]=rings}}if(!M){o.type=null;delete o.coordinates}else if(M<2){o.type="Polygon";o.coordinates=polygons[0]}else{polygons.length=M}}};for(var key in objects){objects[key]=geomifyObject(objects[key])}return objects}},{}],20:[function(_dereq_,module,exports){var quantize=_dereq_("./quantize");module.exports=function(topology,Q0,Q1){if(Q0){if(Q1===Q0||!topology.bbox.every(isFinite))return topology;var k=Q1/Q0,q=quantize(0,0,k,k);topology.transform.scale[0]/=k;topology.transform.scale[1]/=k}else{var bbox=topology.bbox,x0=isFinite(bbox[0])?bbox[0]:0,y0=isFinite(bbox[1])?bbox[1]:0,x1=isFinite(bbox[2])?bbox[2]:0,y1=isFinite(bbox[3])?bbox[3]:0,kx=x1-x0?(Q1-1)/(x1-x0):1,ky=y1-y0?(Q1-1)/(y1-y0):1,q=quantize(-x0,-y0,kx,ky);topology.transform=q.transform}function quantizeGeometry(geometry){if(geometry&&quantizeGeometryType.hasOwnProperty(geometry.type))quantizeGeometryType[geometry.type](geometry)}var quantizeGeometryType={GeometryCollection:function(o){o.geometries.forEach(quantizeGeometry)},Point:function(o){q.point(o.coordinates)},MultiPoint:function(o){o.coordinates.forEach(q.point)}};for(var key in topology.objects){quantizeGeometry(topology.objects[key])}topology.arcs=topology.arcs.map(function(arc){q.line(arc=arc.map(function(point){return point.slice()}));if(arc.length<2)arc.push(arc[0]);return arc});return topology}},{"./quantize":23}],21:[function(_dereq_,module,exports){var quantize=_dereq_("./quantize");module.exports=function(objects,bbox,Q0,Q1){if(arguments.length<4)Q1=Q0;var x0=isFinite(bbox[0])?bbox[0]:0,y0=isFinite(bbox[1])?bbox[1]:0,x1=isFinite(bbox[2])?bbox[2]:0,y1=isFinite(bbox[3])?bbox[3]:0,kx=x1-x0?(Q1-1)/(x1-x0)*Q0/Q1:1,ky=y1-y0?(Q1-1)/(y1-y0)*Q0/Q1:1,q=quantize(-x0,-y0,kx,ky);
function quantizeGeometry(geometry){if(geometry&&quantizeGeometryType.hasOwnProperty(geometry.type))quantizeGeometryType[geometry.type](geometry)}var quantizeGeometryType={GeometryCollection:function(o){o.geometries.forEach(quantizeGeometry)},Point:function(o){q.point(o.coordinates)},MultiPoint:function(o){o.coordinates.forEach(q.point)},LineString:function(o){var line=o.coordinates;q.line(line);if(line.length<2)line[1]=line[0]},MultiLineString:function(o){for(var lines=o.coordinates,i=0,n=lines.length;i<n;++i){var line=lines[i];q.line(line);if(line.length<2)line[1]=line[0]}},Polygon:function(o){for(var rings=o.coordinates,i=0,n=rings.length;i<n;++i){var ring=rings[i];q.line(ring);while(ring.length<4)ring.push(ring[0])}},MultiPolygon:function(o){for(var polygons=o.coordinates,i=0,n=polygons.length;i<n;++i){for(var rings=polygons[i],j=0,m=rings.length;j<m;++j){var ring=rings[j];q.line(ring);while(ring.length<4)ring.push(ring[0])}}}};for(var key in objects){quantizeGeometry(objects[key])}return q.transform}},{"./quantize":23}],22:[function(_dereq_,module,exports){module.exports=function(topology,options){var verbose=false,objects=topology.objects,oldArcs=topology.arcs,oldArcCount=oldArcs.length,newArcs=topology.arcs=[],newArcCount=0,newIndexByOldIndex=new Array(oldArcs.length);if(options)"verbose"in options&&(verbose=!!options["verbose"]);function pruneGeometry(geometry){if(geometry&&pruneGeometryType.hasOwnProperty(geometry.type))pruneGeometryType[geometry.type](geometry)}var pruneGeometryType={GeometryCollection:function(o){o.geometries.forEach(pruneGeometry)},LineString:function(o){pruneArcs(o.arcs)},MultiLineString:function(o){o.arcs.forEach(pruneArcs)},Polygon:function(o){o.arcs.forEach(pruneArcs)},MultiPolygon:function(o){o.arcs.forEach(pruneMultiArcs)}};function pruneArcs(arcs){for(var i=0,n=arcs.length;i<n;++i){var oldIndex=arcs[i],oldReverse=oldIndex<0&&(oldIndex=~oldIndex,true),newIndex;if((newIndex=newIndexByOldIndex[oldIndex])==null){newIndexByOldIndex[oldIndex]=newIndex=newArcCount++;newArcs[newIndex]=oldArcs[oldIndex]}arcs[i]=oldReverse?~newIndex:newIndex}}function pruneMultiArcs(arcs){arcs.forEach(pruneArcs)}for(var key in objects){pruneGeometry(objects[key])}if(verbose)console.warn("prune: retained "+newArcCount+" / "+oldArcCount+" arcs ("+Math.round(newArcCount/oldArcCount*100)+"%)");return topology};function noop(){}},{}],23:[function(_dereq_,module,exports){module.exports=function(dx,dy,kx,ky){function quantizePoint(coordinates){coordinates[0]=Math.round((coordinates[0]+dx)*kx);coordinates[1]=Math.round((coordinates[1]+dy)*ky);return coordinates}function quantizeLine(coordinates){var i=0,j=1,n=coordinates.length,pi=quantizePoint(coordinates[0]),pj,px=pi[0],py=pi[1],x,y;while(++i<n){pi=quantizePoint(coordinates[i]);x=pi[0];y=pi[1];if(x!==px||y!==py){pj=coordinates[j++];pj[0]=px=x;pj[1]=py=y}}coordinates.length=j}return{point:quantizePoint,line:quantizeLine,transform:{scale:[1/kx,1/ky],translate:[-dx,-dy]}}}},{}],24:[function(_dereq_,module,exports){var type=_dereq_("./type");module.exports=function(topology,options){var width,height,margin=0,invert=true;if(options)"width"in options&&(width=+options["width"]),"height"in options&&(height=+options["height"]),"margin"in options&&(margin=+options["margin"]),"invert"in options&&(invert=!!options["invert"]);var bx=topology.bbox,dx=bx[2]-bx[0],dy=bx[3]-bx[1],cx=(bx[2]+bx[0])/2,cy=(bx[3]+bx[1])/2,kx;width=Math.max(0,width-margin*2);height=Math.max(0,height-margin*2);if(width&&height){kx=Math.min(width/dx,height/dy)}else if(width){kx=width/dx;height=kx*dy}else{kx=height/dy;width=kx*dx}var ky=invert?-kx:kx,lt=scalePoint([bx[0],bx[1]]),rb=scalePoint([bx[2],bx[3]]),tx;topology.bbox=invert?[lt[0],rb[1],rb[0],lt[1]]:[lt[0],lt[1],rb[0],rb[1]];function scalePoint(point){return[point[0]*kx+(width/2-cx*kx)+margin,point[1]*ky+(height/2-cy*ky)+margin]}if(tx=topology.transform){tx.scale[0]*=kx;tx.scale[1]*=ky;tx.translate[0]=width/2+margin-(cx-tx.translate[0])*kx;tx.translate[1]=height/2+margin-(cy-tx.translate[1])*ky}else{var scale=type({LineString:noop,MultiLineString:noop,Point:function(point){point.coordinates=scalePoint(point.coordinates)},MultiPoint:function(multipoint){multipoint.coordinates=multipoint.coordinates.map(scalePoint)},Polygon:noop,MultiPolygon:noop});for(var key in topology.objects){scale.object(topology.objects[key])}topology.arcs=topology.arcs.map(function(arc){return arc.map(scalePoint)})}return topology};function noop(){}},{"./type":39}],25:[function(_dereq_,module,exports){var topojson=_dereq_("../../"),systems=_dereq_("./coordinate-systems");module.exports=function(topology,options){var minimumArea=0,retainProportion,verbose=false,system=null,N=topology.arcs.reduce(function(p,v){return p+v.length},0),M=0;if(options)"minimum-area"in options&&(minimumArea=+options["minimum-area"]),"coordinate-system"in options&&(system=systems[options["coordinate-system"]]),"retain-proportion"in options&&(retainProportion=+options["retain-proportion"]),"verbose"in options&&(verbose=!!options["verbose"]);topojson.presimplify(topology,system.triangleArea);if(retainProportion){var areas=[];topology.arcs.forEach(function(arc){arc.forEach(function(point){if(isFinite(point[2]))areas.push(point[2])})});options["minimum-area"]=minimumArea=N?areas.sort(function(a,b){return b-a})[Math.ceil((N-1)*retainProportion)]:0;if(verbose)console.warn("simplification: effective minimum area "+minimumArea.toPrecision(3))}topology.arcs.forEach(topology.transform?function(arc){var dx=0,dy=0,i=-1,j=-1,n=arc.length,source,target;while(++i<n){source=arc[i];if(source[2]>=minimumArea){target=arc[++j];target[0]=source[0]+dx;target[1]=source[1]+dy;dx=dy=0}else{dx+=source[0];dy+=source[1]}}arc.length=++j}:function(arc){var i=-1,j=-1,n=arc.length,point;while(++i<n){point=arc[i];if(point[2]>=minimumArea){arc[++j]=point}}arc.length=++j});topology.arcs.forEach(topology.transform?function(arc){var i=0,j=0,n=arc.length,p=arc[0];p.length=2;while(++i<n){p=arc[i];p.length=2;if(p[0]||p[1])arc[++j]=p}M+=arc.length=(j||1)+1}:function(arc){var i=0,j=0,n=arc.length,p=arc[0],x0=p[0],y0=p[1],x1,y1;p.length=2;while(++i<n){p=arc[i],x1=p[0],y1=p[1];p.length=2;if(x0!==x1||y0!==y1)arc[++j]=p,x0=x1,y0=y1}M+=arc.length=(j||1)+1});if(verbose)console.warn("simplification: retained "+M+" / "+N+" points ("+Math.round(M/N*100)+"%)");return topology}},{"../../":10,"./coordinate-systems":16}],26:[function(_dereq_,module,exports){var π=Math.PI,π_4=π/4,radians=π/180;exports.name="spherical";exports.formatDistance=formatDistance;exports.ringArea=ringArea;exports.absoluteArea=absoluteArea;exports.triangleArea=triangleArea;exports.distance=haversinDistance;function formatDistance(k){var km=k*radians*6371;return(km>1?km.toFixed(3)+"km":(km*1e3).toPrecision(3)+"m")+" ("+k.toPrecision(3)+"°)"}function ringArea(ring){if(!ring.length)return 0;var area=0,p=ring[0],λ=p[0]*radians,φ=p[1]*radians/2+π_4,λ0=λ,cosφ0=Math.cos(φ),sinφ0=Math.sin(φ);for(var i=1,n=ring.length;i<n;++i){p=ring[i],λ=p[0]*radians,φ=p[1]*radians/2+π_4;var dλ=λ-λ0,cosφ=Math.cos(φ),sinφ=Math.sin(φ),k=sinφ0*sinφ,u=cosφ0*cosφ+k*Math.cos(dλ),v=k*Math.sin(dλ);area+=Math.atan2(v,u);λ0=λ,cosφ0=cosφ,sinφ0=sinφ}return 2*(area>π?area-2*π:area<-π?area+2*π:area)}function absoluteArea(a){return a<0?a+4*π:a}function triangleArea(t){var a=distance(t[0],t[1]),b=distance(t[1],t[2]),c=distance(t[2],t[0]),s=(a+b+c)/2;return 4*Math.atan(Math.sqrt(Math.max(0,Math.tan(s/2)*Math.tan((s-a)/2)*Math.tan((s-b)/2)*Math.tan((s-c)/2))))}function distance(a,b){var Δλ=(b[0]-a[0])*radians,sinΔλ=Math.sin(Δλ),cosΔλ=Math.cos(Δλ),sinφ0=Math.sin(a[1]*radians),cosφ0=Math.cos(a[1]*radians),sinφ1=Math.sin(b[1]*radians),cosφ1=Math.cos(b[1]*radians),_;return Math.atan2(Math.sqrt((_=cosφ1*sinΔλ)*_+(_=cosφ0*sinφ1-sinφ0*cosφ1*cosΔλ)*_),sinφ0*sinφ1+cosφ0*cosφ1*cosΔλ)}function haversinDistance(x0,y0,x1,y1){x0*=radians,y0*=radians,x1*=radians,y1*=radians;return 2*Math.asin(Math.sqrt(haversin(y1-y0)+Math.cos(y0)*Math.cos(y1)*haversin(x1-x0)))}function haversin(x){return(x=Math.sin(x/2))*x}},{}],27:[function(_dereq_,module,exports){var type=_dereq_("./type");module.exports=function(objects,transform){var ε=.01,x0=-180,x0e=x0+ε,x1=180,x1e=x1-ε,y0=-90,y0e=y0+ε,y1=90,y1e=y1-ε;if(transform){var kx=transform.scale[0],ky=transform.scale[1],dx=transform.translate[0],dy=transform.translate[1];x0=Math.round((x0-dx)/kx);x1=Math.round((x1-dx)/kx);y0=Math.round((y0-dy)/ky);y1=Math.round((y1-dy)/ky);x0e=Math.round((x0e-dx)/kx);x1e=Math.round((x1e-dx)/kx);y0e=Math.round((y0e-dy)/ky);y1e=Math.round((y1e-dy)/ky)}function normalizePoint(y){return y<=y0e?[0,y0]:y>=y1e?[0,y1]:[x0,y]}function stitchPolygons(polygons){var fragments=[];for(var p=0,np=polygons.length;p<np;++p){var polygon=polygons[p];for(var j=0,m=polygon.length;j<m;++j){var ring=polygon[j];ring.polygon=polygon;fragments.push(ring);for(var i=0,n=ring.length;i<n;++i){var point=ring[i],x=point[0],y=point[1];if(x<=x0e||x>=x1e||y<=y0e||y>=y1e){for(var k=i+1;k<n;++k){var pointk=ring[k],xk=pointk[0],yk=pointk[1];if(xk>x0e&&xk<x1e&&yk>y0e&&yk<y1e)break}if(k===i+1)continue;if(i){var fragmentBefore=ring.slice(0,i+1);fragmentBefore.polygon=polygon;fragmentBefore[fragmentBefore.length-1]=normalizePoint(y);fragments[fragments.length-1]=fragmentBefore}else{fragments.pop()}if(k>=n)break;fragments.push(ring=ring.slice(k-1));ring[0]=normalizePoint(ring[0][1]);ring.polygon=polygon;i=-1;n=ring.length}}}polygon.length=0}var fragmentByStart={},fragmentByEnd={};for(var i=0,n=fragments.length;i<n;++i){var fragment=fragments[i],start=fragment[0],end=fragment[fragment.length-1];if(start[0]===end[0]&&start[1]===end[1]){fragment.polygon.push(fragment);fragments[i]=null;continue}fragment.index=i;fragmentByStart[start]=fragmentByEnd[end]=fragment}for(var i=0;i<n;++i){var fragment=fragments[i];if(fragment){var start=fragment[0],end=fragment[fragment.length-1],startFragment=fragmentByEnd[start],endFragment=fragmentByStart[end];delete fragmentByStart[start];delete fragmentByEnd[end];if(start[0]===end[0]&&start[1]===end[1]){fragment.polygon.push(fragment);continue}if(startFragment){delete fragmentByEnd[start];delete fragmentByStart[startFragment[0]];startFragment.pop();fragments[startFragment.index]=null;fragment=startFragment.concat(fragment);fragment.polygon=startFragment.polygon;if(startFragment===endFragment){fragment.polygon.push(fragment)}else{fragment.index=n++;fragments.push(fragmentByStart[fragment[0]]=fragmentByEnd[fragment[fragment.length-1]]=fragment)}}else if(endFragment){delete fragmentByStart[end];delete fragmentByEnd[endFragment[endFragment.length-1]];fragment.pop();fragment=fragment.concat(endFragment);fragment.polygon=endFragment.polygon;fragment.index=n++;fragments[endFragment.index]=null;fragments.push(fragmentByStart[fragment[0]]=fragmentByEnd[fragment[fragment.length-1]]=fragment)}else{fragment.push(fragment[0]);fragment.polygon.push(fragment)}}}}var stitch=type({Polygon:function(polygon){stitchPolygons([polygon.coordinates])},MultiPolygon:function(multiPolygon){stitchPolygons(multiPolygon.coordinates)}});for(var key in objects){stitch.object(objects[key])}}},{"./type":39}],28:[function(_dereq_,module,exports){var type=_dereq_("./type"),stitch=_dereq_("./stitch"),systems=_dereq_("./coordinate-systems"),topologize=_dereq_("./topology/index"),delta=_dereq_("./delta"),geomify=_dereq_("./geomify"),prequantize=_dereq_("./pre-quantize"),postquantize=_dereq_("./post-quantize"),bounds=_dereq_("./bounds"),computeId=_dereq_("./compute-id"),transformProperties=_dereq_("./transform-properties");var ε=1e-6;module.exports=function(objects,options){var Q0=1e4,Q1=1e4,id=function(d){return d.id},propertyTransform=function(){},transform,minimumArea=0,stitchPoles=true,verbose=false,system=null;if(options)"verbose"in options&&(verbose=!!options["verbose"]),"stitch-poles"in options&&(stitchPoles=!!options["stitch-poles"]),"coordinate-system"in options&&(system=systems[options["coordinate-system"]]),"minimum-area"in options&&(minimumArea=+options["minimum-area"]),"quantization"in options&&(Q0=Q1=+options["quantization"]),"pre-quantization"in options&&(Q0=+options["pre-quantization"]),"post-quantization"in options&&(Q1=+options["post-quantization"]),"id"in options&&(id=options["id"]),"property-transform"in options&&(propertyTransform=options["property-transform"]);if(Q0/Q1%1)throw new Error("post-quantization is not a divisor of pre-quantization");if(Q0&&!Q1)throw new Error("post-quantization is required when input is already quantized");computeId(objects,id);transformProperties(objects,propertyTransform);geomify(objects);var bbox=bounds(objects);var oversize=bbox[0]<-180-ε||bbox[1]<-90-ε||bbox[2]>180+ε||bbox[3]>90+ε;if(!system){system=systems[oversize?"cartesian":"spherical"];if(options)options["coordinate-system"]=system.name}if(system===systems.spherical){if(oversize)throw new Error("spherical coordinates outside of [±180°, ±90°]");if(bbox[0]<-180+ε)bbox[0]=-180;if(bbox[1]<-90+ε)bbox[1]=-90;if(bbox[2]>180-ε)bbox[2]=180;if(bbox[3]>90-ε)bbox[3]=90}if(verbose){console.warn("bounds: "+bbox.join(" ")+" ("+system.name+")")}if(Q0){transform=prequantize(objects,bbox,Q0,Q1);if(verbose){console.warn("pre-quantization: "+transform.scale.map(function(k){return system.formatDistance(k)}).join(" "))}}if(system===systems.spherical&&stitchPoles){stitch(objects,transform)}var topology=topologize(objects);if(Q0)topology.transform=transform;topology.bbox=bbox;if(verbose){console.warn("topology: "+topology.arcs.length+" arcs, "+topology.arcs.reduce(function(p,v){return p+v.length},0)+" points")}if(Q1&&Q1!==Q0){postquantize(topology,Q0,Q1);transform=topology.transform;if(verbose){console.warn("post-quantization: "+transform.scale.map(function(k){return system.formatDistance(k)}).join(" "))}}if(Q1){delta(topology)}return topology}},{"./bounds":12,"./compute-id":15,"./coordinate-systems":16,"./delta":17,"./geomify":19,"./post-quantize":20,"./pre-quantize":21,"./stitch":27,"./topology/index":34,"./transform-properties":38,"./type":39}],29:[function(_dereq_,module,exports){var join=_dereq_("./join");module.exports=function(topology){var junctions=join(topology),coordinates=topology.coordinates,lines=topology.lines,rings=topology.rings;for(var i=0,n=lines.length;i<n;++i){var line=lines[i],lineMid=line[0],lineEnd=line[1];while(++lineMid<lineEnd){if(junctions.has(coordinates[lineMid])){var next={0:lineMid,1:line[1]};line[1]=lineMid;line=line.next=next}}}for(var i=0,n=rings.length;i<n;++i){var ring=rings[i],ringStart=ring[0],ringMid=ringStart,ringEnd=ring[1],ringFixed=junctions.has(coordinates[ringStart]);while(++ringMid<ringEnd){if(junctions.has(coordinates[ringMid])){if(ringFixed){var next={0:ringMid,1:ring[1]};ring[1]=ringMid;ring=ring.next=next}else{rotateArray(coordinates,ringStart,ringEnd,ringEnd-ringMid);coordinates[ringEnd]=coordinates[ringStart];ringFixed=true;ringMid=ringStart}}}}return topology};function rotateArray(array,start,end,offset){reverse(array,start,end);reverse(array,start,start+offset);reverse(array,start+offset,end)}function reverse(array,start,end){for(var mid=start+(end-- -start>>1),t;start<mid;++start,--end){t=array[start],array[start]=array[end],array[end]=t}}},{"./join":35}],30:[function(_dereq_,module,exports){var join=_dereq_("./join"),hashmap=_dereq_("./hashmap"),hashPoint=_dereq_("./point-hash"),equalPoint=_dereq_("./point-equal");module.exports=function(topology){var coordinates=topology.coordinates,lines=topology.lines,rings=topology.rings,arcCount=lines.length+rings.length;delete topology.lines;delete topology.rings;for(var i=0,n=lines.length;i<n;++i){var line=lines[i];while(line=line.next)++arcCount}for(var i=0,n=rings.length;i<n;++i){var ring=rings[i];while(ring=ring.next)++arcCount}var arcsByEnd=hashmap(arcCount*2*1.4,hashPoint,equalPoint),arcs=topology.arcs=[];for(var i=0,n=lines.length;i<n;++i){var line=lines[i];do{dedupLine(line)}while(line=line.next)}for(var i=0,n=rings.length;i<n;++i){var ring=rings[i];if(ring.next){do{dedupLine(ring)}while(ring=ring.next)}else{dedupRing(ring)}}function dedupLine(arc){var startPoint,endPoint,startArcs,endArcs;if(startArcs=arcsByEnd.get(startPoint=coordinates[arc[0]])){for(var i=0,n=startArcs.length;i<n;++i){var startArc=startArcs[i];if(equalLine(startArc,arc)){arc[0]=startArc[0];arc[1]=startArc[1];return}}}if(endArcs=arcsByEnd.get(endPoint=coordinates[arc[1]])){for(var i=0,n=endArcs.length;i<n;++i){var endArc=endArcs[i];if(reverseEqualLine(endArc,arc)){arc[1]=endArc[0];arc[0]=endArc[1];return}}}if(startArcs)startArcs.push(arc);else arcsByEnd.set(startPoint,[arc]);if(endArcs)endArcs.push(arc);else arcsByEnd.set(endPoint,[arc]);arcs.push(arc)}function dedupRing(arc){var endPoint,endArcs;if(endArcs=arcsByEnd.get(endPoint=coordinates[arc[0]])){for(var i=0,n=endArcs.length;i<n;++i){var endArc=endArcs[i];if(equalRing(endArc,arc)){arc[0]=endArc[0];arc[1]=endArc[1];return}if(reverseEqualRing(endArc,arc)){arc[0]=endArc[1];arc[1]=endArc[0];return}}}if(endArcs=arcsByEnd.get(endPoint=coordinates[arc[0]+findMinimumOffset(arc)])){for(var i=0,n=endArcs.length;i<n;++i){var endArc=endArcs[i];if(equalRing(endArc,arc)){arc[0]=endArc[0];arc[1]=endArc[1];return}if(reverseEqualRing(endArc,arc)){arc[0]=endArc[1];arc[1]=endArc[0];return}}}if(endArcs)endArcs.push(arc);else arcsByEnd.set(endPoint,[arc]);arcs.push(arc)}function equalLine(arcA,arcB){var ia=arcA[0],ib=arcB[0],ja=arcA[1],jb=arcB[1];if(ia-ja!==ib-jb)return false;for(;ia<=ja;++ia,++ib)if(!equalPoint(coordinates[ia],coordinates[ib]))return false;return true}function reverseEqualLine(arcA,arcB){var ia=arcA[0],ib=arcB[0],ja=arcA[1],jb=arcB[1];if(ia-ja!==ib-jb)return false;for(;ia<=ja;++ia,--jb)if(!equalPoint(coordinates[ia],coordinates[jb]))return false;return true}function equalRing(arcA,arcB){var ia=arcA[0],ib=arcB[0],ja=arcA[1],jb=arcB[1],n=ja-ia;if(n!==jb-ib)return false;var ka=findMinimumOffset(arcA),kb=findMinimumOffset(arcB);for(var i=0;i<n;++i){if(!equalPoint(coordinates[ia+(i+ka)%n],coordinates[ib+(i+kb)%n]))return false}return true}function reverseEqualRing(arcA,arcB){var ia=arcA[0],ib=arcB[0],ja=arcA[1],jb=arcB[1],n=ja-ia;if(n!==jb-ib)return false;var ka=findMinimumOffset(arcA),kb=n-findMinimumOffset(arcB);for(var i=0;i<n;++i){if(!equalPoint(coordinates[ia+(i+ka)%n],coordinates[jb-(i+kb)%n]))return false}return true}function findMinimumOffset(arc){var start=arc[0],end=arc[1],mid=start,minimum=mid,minimumPoint=coordinates[mid];while(++mid<end){var point=coordinates[mid];if(point[0]<minimumPoint[0]||point[0]===minimumPoint[0]&&point[1]<minimumPoint[1]){minimum=mid;minimumPoint=point}}return minimum-start}return topology}},{"./hashmap":32,"./join":35,"./point-equal":36,"./point-hash":37}],31:[function(_dereq_,module,exports){module.exports=function(objects){var index=-1,lines=[],rings=[],coordinates=[];function extractGeometry(geometry){if(geometry&&extractGeometryType.hasOwnProperty(geometry.type))extractGeometryType[geometry.type](geometry)}var extractGeometryType={GeometryCollection:function(o){o.geometries.forEach(extractGeometry)},LineString:function(o){o.arcs=extractLine(o.coordinates);delete o.coordinates},MultiLineString:function(o){o.arcs=o.coordinates.map(extractLine);delete o.coordinates},Polygon:function(o){o.arcs=o.coordinates.map(extractRing);delete o.coordinates},MultiPolygon:function(o){o.arcs=o.coordinates.map(extractMultiRing);delete o.coordinates}};function extractLine(line){for(var i=0,n=line.length;i<n;++i)coordinates[++index]=line[i];var arc={0:index-n+1,1:index};lines.push(arc);return arc}function extractRing(ring){for(var i=0,n=ring.length;i<n;++i)coordinates[++index]=ring[i];var arc={0:index-n+1,1:index};rings.push(arc);return arc}function extractMultiRing(rings){return rings.map(extractRing)}for(var key in objects){extractGeometry(objects[key])}return{type:"Topology",coordinates:coordinates,lines:lines,rings:rings,objects:objects}}},{}],32:[function(_dereq_,module,exports){module.exports=function(size,hash,equal,keyType,keyEmpty,valueType){if(arguments.length===3){keyType=valueType=Array;keyEmpty=null}var keystore=new keyType(size=1<<Math.max(4,Math.ceil(Math.log(size)/Math.LN2))),valstore=new valueType(size),mask=size-1,free=size;for(var i=0;i<size;++i){keystore[i]=keyEmpty}function set(key,value){var index=hash(key)&mask,matchKey=keystore[index],collisions=0;while(matchKey!=keyEmpty){if(equal(matchKey,key))return valstore[index]=value;if(++collisions>=size)throw new Error("full hashmap");matchKey=keystore[index=index+1&mask]}keystore[index]=key;valstore[index]=value;--free;return value}function maybeSet(key,value){var index=hash(key)&mask,matchKey=keystore[index],collisions=0;while(matchKey!=keyEmpty){if(equal(matchKey,key))return valstore[index];if(++collisions>=size)throw new Error("full hashmap");matchKey=keystore[index=index+1&mask]}keystore[index]=key;valstore[index]=value;--free;return value}function get(key,missingValue){var index=hash(key)&mask,matchKey=keystore[index],collisions=0;while(matchKey!=keyEmpty){if(equal(matchKey,key))return valstore[index];if(++collisions>=size)break;matchKey=keystore[index=index+1&mask]}return missingValue}function keys(){var keys=[];for(var i=0,n=keystore.length;i<n;++i){var matchKey=keystore[i];if(matchKey!=keyEmpty)keys.push(matchKey)}return keys}return{set:set,maybeSet:maybeSet,get:get,keys:keys}}},{}],33:[function(_dereq_,module,exports){module.exports=function(size,hash,equal,type,empty){if(arguments.length===3){type=Array;empty=null}var store=new type(size=1<<Math.max(4,Math.ceil(Math.log(size)/Math.LN2))),mask=size-1,free=size;for(var i=0;i<size;++i){store[i]=empty}function add(value){var index=hash(value)&mask,match=store[index],collisions=0;while(match!=empty){if(equal(match,value))return true;if(++collisions>=size)throw new Error("full hashset");match=store[index=index+1&mask]}store[index]=value;--free;return true}function has(value){var index=hash(value)&mask,match=store[index],collisions=0;while(match!=empty){if(equal(match,value))return true;if(++collisions>=size)break;match=store[index=index+1&mask]}return false}function values(){var values=[];for(var i=0,n=store.length;i<n;++i){var match=store[i];if(match!=empty)values.push(match)}return values}return{add:add,has:has,values:values}}},{}],34:[function(_dereq_,module,exports){var hashmap=_dereq_("./hashmap"),extract=_dereq_("./extract"),cut=_dereq_("./cut"),dedup=_dereq_("./dedup");module.exports=function(objects){var topology=dedup(cut(extract(objects))),coordinates=topology.coordinates,indexByArc=hashmap(topology.arcs.length*1.4,hashArc,equalArc);objects=topology.objects;topology.arcs=topology.arcs.map(function(arc,i){indexByArc.set(arc,i);return coordinates.slice(arc[0],arc[1]+1)});delete topology.coordinates;coordinates=null;function indexGeometry(geometry){if(geometry&&indexGeometryType.hasOwnProperty(geometry.type))indexGeometryType[geometry.type](geometry)}var indexGeometryType={GeometryCollection:function(o){o.geometries.forEach(indexGeometry)},LineString:function(o){o.arcs=indexArcs(o.arcs)},MultiLineString:function(o){o.arcs=o.arcs.map(indexArcs)},Polygon:function(o){o.arcs=o.arcs.map(indexArcs)},MultiPolygon:function(o){o.arcs=o.arcs.map(indexMultiArcs)}};function indexArcs(arc){var indexes=[];do{var index=indexByArc.get(arc);indexes.push(arc[0]<arc[1]?index:~index)}while(arc=arc.next);return indexes}function indexMultiArcs(arcs){return arcs.map(indexArcs)}for(var key in objects){indexGeometry(objects[key])}return topology};function hashArc(arc){var i=arc[0],j=arc[1],t;if(j<i)t=i,i=j,j=t;return i+31*j}function equalArc(arcA,arcB){var ia=arcA[0],ja=arcA[1],ib=arcB[0],jb=arcB[1],t;if(ja<ia)t=ia,ia=ja,ja=t;if(jb<ib)t=ib,ib=jb,jb=t;return ia===ib&&ja===jb}},{"./cut":29,"./dedup":30,"./extract":31,"./hashmap":32}],35:[function(_dereq_,module,exports){var hashset=_dereq_("./hashset"),hashmap=_dereq_("./hashmap"),hashPoint=_dereq_("./point-hash"),equalPoint=_dereq_("./point-equal");module.exports=function(topology){var coordinates=topology.coordinates,lines=topology.lines,rings=topology.rings,indexes=index(),visitedByIndex=new Int32Array(coordinates.length),leftByIndex=new Int32Array(coordinates.length),rightByIndex=new Int32Array(coordinates.length),junctionByIndex=new Int8Array(coordinates.length),junctionCount=0;for(var i=0,n=coordinates.length;i<n;++i){visitedByIndex[i]=leftByIndex[i]=rightByIndex[i]=-1}for(var i=0,n=lines.length;i<n;++i){var line=lines[i],lineStart=line[0],lineEnd=line[1],previousIndex,currentIndex=indexes[lineStart],nextIndex=indexes[++lineStart];++junctionCount,junctionByIndex[currentIndex]=1;while(++lineStart<=lineEnd){sequence(i,previousIndex=currentIndex,currentIndex=nextIndex,nextIndex=indexes[lineStart])}++junctionCount,junctionByIndex[nextIndex]=1}for(var i=0,n=coordinates.length;i<n;++i){visitedByIndex[i]=-1}for(var i=0,n=rings.length;i<n;++i){var ring=rings[i],ringStart=ring[0]+1,ringEnd=ring[1],previousIndex=indexes[ringEnd-1],currentIndex=indexes[ringStart-1],nextIndex=indexes[ringStart];sequence(i,previousIndex,currentIndex,nextIndex);while(++ringStart<=ringEnd){sequence(i,previousIndex=currentIndex,currentIndex=nextIndex,nextIndex=indexes[ringStart])}}function sequence(i,previousIndex,currentIndex,nextIndex){if(visitedByIndex[currentIndex]===i)return;visitedByIndex[currentIndex]=i;var leftIndex=leftByIndex[currentIndex];if(leftIndex>=0){var rightIndex=rightByIndex[currentIndex];if((leftIndex!==previousIndex||rightIndex!==nextIndex)&&(leftIndex!==nextIndex||rightIndex!==previousIndex)){++junctionCount,junctionByIndex[currentIndex]=1}}else{leftByIndex[currentIndex]=previousIndex;rightByIndex[currentIndex]=nextIndex}}function index(){var indexByPoint=hashmap(coordinates.length*1.4,hashIndex,equalIndex,Int32Array,-1,Int32Array),indexes=new Int32Array(coordinates.length);for(var i=0,n=coordinates.length;i<n;++i){indexes[i]=indexByPoint.maybeSet(i,i)}return indexes}function hashIndex(i){return hashPoint(coordinates[i])}function equalIndex(i,j){return equalPoint(coordinates[i],coordinates[j])}visitedByIndex=leftByIndex=rightByIndex=null;var junctionByPoint=hashset(junctionCount*1.4,hashPoint,equalPoint);for(var i=0,n=coordinates.length,j;i<n;++i){if(junctionByIndex[j=indexes[i]]){junctionByPoint.add(coordinates[j])}}return junctionByPoint}},{"./hashmap":32,"./hashset":33,"./point-equal":36,"./point-hash":37}],36:[function(_dereq_,module,exports){module.exports=function(pointA,pointB){return pointA[0]===pointB[0]&&pointA[1]===pointB[1]}},{}],37:[function(_dereq_,module,exports){var buffer=new ArrayBuffer(16),floats=new Float64Array(buffer),uints=new Uint32Array(buffer);module.exports=function(point){floats[0]=point[0];floats[1]=point[1];var hash=uints[0]^uints[1];hash=hash<<5^hash>>7^uints[2]^uints[3];return hash&2147483647}},{}],38:[function(_dereq_,module,exports){module.exports=function(objects,propertyTransform){if(arguments.length<2)propertyTransform=function(){};function transformObject(object){if(object&&transformObjectType.hasOwnProperty(object.type))transformObjectType[object.type](object)}function transformFeature(feature){if(feature.properties){var properties0=feature.properties,properties1={},empty=true;for(var key0 in properties0){if(propertyTransform(properties1,key0,properties0[key0])){empty=false}}if(empty)delete feature.properties;else feature.properties=properties1}}var transformObjectType={Feature:transformFeature,FeatureCollection:function(collection){collection.features.forEach(transformFeature)}};for(var key in objects){transformObject(objects[key])}return objects}},{}],39:[function(_dereq_,module,exports){module.exports=function(types){for(var type in typeDefaults){if(!(type in types)){types[type]=typeDefaults[type]}}types.defaults=typeDefaults;return types};var typeDefaults={Feature:function(feature){if(feature.geometry)this.geometry(feature.geometry)},FeatureCollection:function(collection){var features=collection.features,i=-1,n=features.length;while(++i<n)this.Feature(features[i])},GeometryCollection:function(collection){var geometries=collection.geometries,i=-1,n=geometries.length;while(++i<n)this.geometry(geometries[i])},LineString:function(lineString){this.line(lineString.coordinates)},MultiLineString:function(multiLineString){var coordinates=multiLineString.coordinates,i=-1,n=coordinates.length;while(++i<n)this.line(coordinates[i])},MultiPoint:function(multiPoint){var coordinates=multiPoint.coordinates,i=-1,n=coordinates.length;while(++i<n)this.point(coordinates[i])},MultiPolygon:function(multiPolygon){var coordinates=multiPolygon.coordinates,i=-1,n=coordinates.length;while(++i<n)this.polygon(coordinates[i])},Point:function(point){this.point(point.coordinates)},Polygon:function(polygon){this.polygon(polygon.coordinates)},object:function(object){return object==null?null:typeObjects.hasOwnProperty(object.type)?this[object.type](object):this.geometry(object)},geometry:function(geometry){return geometry==null?null:typeGeometries.hasOwnProperty(geometry.type)?this[geometry.type](geometry):null},point:function(){},line:function(coordinates){var i=-1,n=coordinates.length;while(++i<n)this.point(coordinates[i])},polygon:function(coordinates){var i=-1,n=coordinates.length;while(++i<n)this.line(coordinates[i])}};var typeGeometries={LineString:1,MultiLineString:1,MultiPoint:1,MultiPolygon:1,Point:1,Polygon:1,GeometryCollection:1};var typeObjects={Feature:1,FeatureCollection:1}},{}],40:[function(_dereq_,module,exports){!function(){var topojson={version:"1.6.8",mesh:function(topology){return object(topology,meshArcs.apply(this,arguments))},meshArcs:meshArcs,merge:function(topology){return object(topology,mergeArcs.apply(this,arguments))},mergeArcs:mergeArcs,feature:featureOrCollection,neighbors:neighbors,presimplify:presimplify};function stitchArcs(topology,arcs){var stitchedArcs={},fragmentByStart={},fragmentByEnd={},fragments=[],emptyIndex=-1;arcs.forEach(function(i,j){var arc=topology.arcs[i<0?~i:i],t;if(arc.length<3&&!arc[1][0]&&!arc[1][1]){t=arcs[++emptyIndex],arcs[emptyIndex]=i,arcs[j]=t}});arcs.forEach(function(i){var e=ends(i),start=e[0],end=e[1],f,g;if(f=fragmentByEnd[start]){delete fragmentByEnd[f.end];f.push(i);f.end=end;if(g=fragmentByStart[end]){delete fragmentByStart[g.start];var fg=g===f?f:f.concat(g);fragmentByStart[fg.start=f.start]=fragmentByEnd[fg.end=g.end]=fg}else{fragmentByStart[f.start]=fragmentByEnd[f.end]=f}}else if(f=fragmentByStart[end]){delete fragmentByStart[f.start];f.unshift(i);f.start=start;if(g=fragmentByEnd[start]){delete fragmentByEnd[g.end];var gf=g===f?f:g.concat(f);fragmentByStart[gf.start=g.start]=fragmentByEnd[gf.end=f.end]=gf}else{fragmentByStart[f.start]=fragmentByEnd[f.end]=f}}else{f=[i];fragmentByStart[f.start=start]=fragmentByEnd[f.end=end]=f}});function ends(i){var arc=topology.arcs[i<0?~i:i],p0=arc[0],p1;if(topology.transform)p1=[0,0],arc.forEach(function(dp){p1[0]+=dp[0],p1[1]+=dp[1]});else p1=arc[arc.length-1];return i<0?[p1,p0]:[p0,p1]}function flush(fragmentByEnd,fragmentByStart){for(var k in fragmentByEnd){var f=fragmentByEnd[k];delete fragmentByStart[f.start];delete f.start;delete f.end;f.forEach(function(i){stitchedArcs[i<0?~i:i]=1});fragments.push(f)}}flush(fragmentByEnd,fragmentByStart);flush(fragmentByStart,fragmentByEnd);arcs.forEach(function(i){if(!stitchedArcs[i<0?~i:i])fragments.push([i])});return fragments}function meshArcs(topology,o,filter){var arcs=[];if(arguments.length>1){var geomsByArc=[],geom;function arc(i){var j=i<0?~i:i;(geomsByArc[j]||(geomsByArc[j]=[])).push({i:i,g:geom})}function line(arcs){arcs.forEach(arc)}function polygon(arcs){arcs.forEach(line)}function geometry(o){if(o.type==="GeometryCollection")o.geometries.forEach(geometry);else if(o.type in geometryType)geom=o,geometryType[o.type](o.arcs)}var geometryType={LineString:line,MultiLineString:polygon,Polygon:polygon,MultiPolygon:function(arcs){arcs.forEach(polygon)}};geometry(o);geomsByArc.forEach(arguments.length<3?function(geoms){arcs.push(geoms[0].i)}:function(geoms){if(filter(geoms[0].g,geoms[geoms.length-1].g))arcs.push(geoms[0].i)})}else{for(var i=0,n=topology.arcs.length;i<n;++i)arcs.push(i)
}return{type:"MultiLineString",arcs:stitchArcs(topology,arcs)}}function mergeArcs(topology,objects){var polygonsByArc={},polygons=[],components=[];objects.forEach(function(o){if(o.type==="Polygon")register(o.arcs);else if(o.type==="MultiPolygon")o.arcs.forEach(register)});function register(polygon){polygon.forEach(function(ring){ring.forEach(function(arc){(polygonsByArc[arc=arc<0?~arc:arc]||(polygonsByArc[arc]=[])).push(polygon)})});polygons.push(polygon)}function exterior(ring){return cartesianRingArea(object(topology,{type:"Polygon",arcs:[ring]}).coordinates[0])>0}polygons.forEach(function(polygon){if(!polygon._){var component=[],neighbors=[polygon];polygon._=1;components.push(component);while(polygon=neighbors.pop()){component.push(polygon);polygon.forEach(function(ring){ring.forEach(function(arc){polygonsByArc[arc<0?~arc:arc].forEach(function(polygon){if(!polygon._){polygon._=1;neighbors.push(polygon)}})})})}}});polygons.forEach(function(polygon){delete polygon._});return{type:"MultiPolygon",arcs:components.map(function(polygons){var arcs=[];polygons.forEach(function(polygon){polygon.forEach(function(ring){ring.forEach(function(arc){if(polygonsByArc[arc<0?~arc:arc].length<2){arcs.push(arc)}})})});arcs=stitchArcs(topology,arcs);if((n=arcs.length)>1){var sgn=exterior(polygons[0][0]);for(var i=0,t;i<n;++i){if(sgn===exterior(arcs[i])){t=arcs[0],arcs[0]=arcs[i],arcs[i]=t;break}}}return arcs})}}function featureOrCollection(topology,o){return o.type==="GeometryCollection"?{type:"FeatureCollection",features:o.geometries.map(function(o){return feature(topology,o)})}:feature(topology,o)}function feature(topology,o){var f={type:"Feature",id:o.id,properties:o.properties||{},geometry:object(topology,o)};if(o.id==null)delete f.id;return f}function object(topology,o){var absolute=transformAbsolute(topology.transform),arcs=topology.arcs;function arc(i,points){if(points.length)points.pop();for(var a=arcs[i<0?~i:i],k=0,n=a.length,p;k<n;++k){points.push(p=a[k].slice());absolute(p,k)}if(i<0)reverse(points,n)}function point(p){p=p.slice();absolute(p,0);return p}function line(arcs){var points=[];for(var i=0,n=arcs.length;i<n;++i)arc(arcs[i],points);if(points.length<2)points.push(points[0].slice());return points}function ring(arcs){var points=line(arcs);while(points.length<4)points.push(points[0].slice());return points}function polygon(arcs){return arcs.map(ring)}function geometry(o){var t=o.type;return t==="GeometryCollection"?{type:t,geometries:o.geometries.map(geometry)}:t in geometryType?{type:t,coordinates:geometryType[t](o)}:null}var geometryType={Point:function(o){return point(o.coordinates)},MultiPoint:function(o){return o.coordinates.map(point)},LineString:function(o){return line(o.arcs)},MultiLineString:function(o){return o.arcs.map(line)},Polygon:function(o){return polygon(o.arcs)},MultiPolygon:function(o){return o.arcs.map(polygon)}};return geometry(o)}function reverse(array,n){var t,j=array.length,i=j-n;while(i<--j)t=array[i],array[i++]=array[j],array[j]=t}function bisect(a,x){var lo=0,hi=a.length;while(lo<hi){var mid=lo+hi>>>1;if(a[mid]<x)lo=mid+1;else hi=mid}return lo}function neighbors(objects){var indexesByArc={},neighbors=objects.map(function(){return[]});function line(arcs,i){arcs.forEach(function(a){if(a<0)a=~a;var o=indexesByArc[a];if(o)o.push(i);else indexesByArc[a]=[i]})}function polygon(arcs,i){arcs.forEach(function(arc){line(arc,i)})}function geometry(o,i){if(o.type==="GeometryCollection")o.geometries.forEach(function(o){geometry(o,i)});else if(o.type in geometryType)geometryType[o.type](o.arcs,i)}var geometryType={LineString:line,MultiLineString:polygon,Polygon:polygon,MultiPolygon:function(arcs,i){arcs.forEach(function(arc){polygon(arc,i)})}};objects.forEach(geometry);for(var i in indexesByArc){for(var indexes=indexesByArc[i],m=indexes.length,j=0;j<m;++j){for(var k=j+1;k<m;++k){var ij=indexes[j],ik=indexes[k],n;if((n=neighbors[ij])[i=bisect(n,ik)]!==ik)n.splice(i,0,ik);if((n=neighbors[ik])[i=bisect(n,ij)]!==ij)n.splice(i,0,ij)}}}return neighbors}function presimplify(topology,triangleArea){var absolute=transformAbsolute(topology.transform),relative=transformRelative(topology.transform),heap=minAreaHeap(),maxArea=0,triangle;if(!triangleArea)triangleArea=cartesianTriangleArea;topology.arcs.forEach(function(arc){var triangles=[];arc.forEach(absolute);for(var i=1,n=arc.length-1;i<n;++i){triangle=arc.slice(i-1,i+2);triangle[1][2]=triangleArea(triangle);triangles.push(triangle);heap.push(triangle)}arc[0][2]=arc[n][2]=Infinity;for(var i=0,n=triangles.length;i<n;++i){triangle=triangles[i];triangle.previous=triangles[i-1];triangle.next=triangles[i+1]}});while(triangle=heap.pop()){var previous=triangle.previous,next=triangle.next;if(triangle[1][2]<maxArea)triangle[1][2]=maxArea;else maxArea=triangle[1][2];if(previous){previous.next=next;previous[2]=triangle[2];update(previous)}if(next){next.previous=previous;next[0]=triangle[0];update(next)}}topology.arcs.forEach(function(arc){arc.forEach(relative)});function update(triangle){heap.remove(triangle);triangle[1][2]=triangleArea(triangle);heap.push(triangle)}return topology}function cartesianRingArea(ring){var i=-1,n=ring.length,a,b=ring[n-1],area=0;while(++i<n){a=b;b=ring[i];area+=a[0]*b[1]-a[1]*b[0]}return area*.5}function cartesianTriangleArea(triangle){var a=triangle[0],b=triangle[1],c=triangle[2];return Math.abs((a[0]-c[0])*(b[1]-a[1])-(a[0]-b[0])*(c[1]-a[1]))}function compareArea(a,b){return a[1][2]-b[1][2]}function minAreaHeap(){var heap={},array=[],size=0;heap.push=function(object){up(array[object._=size]=object,size++);return size};heap.pop=function(){if(size<=0)return;var removed=array[0],object;if(--size>0)object=array[size],down(array[object._=0]=object,0);return removed};heap.remove=function(removed){var i=removed._,object;if(array[i]!==removed)return;if(i!==--size)object=array[size],(compareArea(object,removed)<0?up:down)(array[object._=i]=object,i);return i};function up(object,i){while(i>0){var j=(i+1>>1)-1,parent=array[j];if(compareArea(object,parent)>=0)break;array[parent._=i]=parent;array[object._=i=j]=object}}function down(object,i){while(true){var r=i+1<<1,l=r-1,j=i,child=array[j];if(l<size&&compareArea(array[l],child)<0)child=array[j=l];if(r<size&&compareArea(array[r],child)<0)child=array[j=r];if(j===i)break;array[child._=i]=child;array[object._=i=j]=object}}return heap}function transformAbsolute(transform){if(!transform)return noop;var x0,y0,kx=transform.scale[0],ky=transform.scale[1],dx=transform.translate[0],dy=transform.translate[1];return function(point,i){if(!i)x0=y0=0;point[0]=(x0+=point[0])*kx+dx;point[1]=(y0+=point[1])*ky+dy}}function transformRelative(transform){if(!transform)return noop;var x0,y0,kx=transform.scale[0],ky=transform.scale[1],dx=transform.translate[0],dy=transform.translate[1];return function(point,i){if(!i)x0=y0=0;var x1=(point[0]-dx)/kx|0,y1=(point[1]-dy)/ky|0;point[0]=x1-x0;point[1]=y1-y0;x0=x1;y0=y1}}function noop(){}if(typeof define==="function"&&define.amd)define(topojson);else if(typeof module==="object"&&module.exports)module.exports=topojson;else this.topojson=topojson}()},{}],41:[function(_dereq_,module,exports){module.exports=parse;function parse(_){var i=0;function $(re){var match=_.substring(i).match(re);if(!match)return null;else{i+=match[0].length;return match[0]}}function white(){$(/^\s*/)}function multicoords(){white();var depth=0,rings=[],pointer=rings,elem;while(elem=$(/^(\()/)||$(/^(\))/)||$(/^(\,)/)||coords()){if(elem=="("){depth++}else if(elem==")"){depth--;if(depth==0)break}else if(elem&&Array.isArray(elem)&&elem.length){pointer.push(elem)}else if(elem===","){}white()}if(depth!==0)return null;return rings}function coords(){var list=[],item,pt;while(pt=$(/^[-+]?([0-9]*\.[0-9]+|[0-9]+)/)||$(/^(\,)/)){if(pt==","){list.push(item);item=[]}else{if(!item)item=[];item.push(parseFloat(pt))}white()}if(item)list.push(item);return list.length?list:null}function point(){if(!$(/^(point)/i))return null;white();if(!$(/^(\()/))return null;var c=coords();white();if(!$(/^(\))/))return null;return{type:"Point",coordinates:c[0]}}function multipoint(){if(!$(/^(multipoint)/i))return null;white();var c=multicoords();white();return{type:"MultiPoint",coordinates:c[0]}}function multilinestring(){if(!$(/^(multilinestring)/i))return null;white();var c=multicoords();white();return{type:"MultiLineString",coordinates:c}}function linestring(){if(!$(/^(linestring)/i))return null;white();if(!$(/^(\()/))return null;var c=coords();if(!$(/^(\))/))return null;return{type:"LineString",coordinates:c}}function polygon(){if(!$(/^(polygon)/i))return null;white();return{type:"Polygon",coordinates:multicoords()}}function multipolygon(){if(!$(/^(multipolygon)/i))return null;white();return{type:"MultiPolygon",coordinates:multicoords()}}function geometrycollection(){var geometries=[],geometry;if(!$(/^(geometrycollection)/i))return null;white();if(!$(/^(\()/))return null;while(geometry=root()){geometries.push(geometry);white();$(/^(\,)/);white()}if(!$(/^(\))/))return null;return{type:"GeometryCollection",geometries:geometries}}function root(){return point()||linestring()||polygon()||multipoint()||multilinestring()||multipolygon()||geometrycollection()}return root()}},{}]},{},[1])(1)});;/*
 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
 * 
 * 			ArkGis Custom Build, complete file.
 *
 */


L.GeoJSON = L.FeatureGroup.extend({

	initialize: function (geojson, options) {
		L.setOptions(this, options);
		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	addData: function (geojson) {
			
		var features = L.Util.isArray(geojson) ? geojson : geojson.features,
		    i, len, feature;
		
		if (features) {
			for (i = 0, len = features.length; i < len; i++) {
				// Only add this if geometry or geometries are set and not null
				feature = features[i];
				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
					this.addData(features[i]);
				}
			}
			return this;
		}

		var options = this.options;
		if (options.filter && !options.filter(geojson)) { return; }

		var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
		layer.feature = L.GeoJSON.asFeature(geojson);

		layer.defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}

		return this.addLayer(layer);
	},

	resetStyle: function (layer) {
		var style = this.options.style;
		if (style) {
			// reset any custom styles
			L.Util.extend(layer.options, layer.defaultOptions);

			this._setLayerStyle(layer, style);
		}
	},

	setStyle: function (style) {
		this.eachLayer(function (layer) {
			this._setLayerStyle(layer, style);
		}, this);
	},

	_setLayerStyle: function (layer, style) {
		if (typeof style === 'function') {
			style = style(layer.feature);
		}
		if (layer.setStyle) {
			layer.setStyle(style);
		}
	}
});



L.extend(L.GeoJSON, {
	geometryToLayer: function (geojson, pointToLayer, coordsToLatLng, vectorOptions) {

		var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
		    coords = geometry.coordinates,
		    layers = [],
		    latlng, latlngs, i, len;

		coordsToLatLng = coordsToLatLng || this.coordsToLatLng;
		
		switch (geometry.type) {
		
			case 'Point':
				latlng = coordsToLatLng(coords);
				return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);
	
			case 'MultiPoint':
				for (i = 0, len = coords.length; i < len; i++) {
					latlng = coordsToLatLng(coords[i]);
					layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
				}
				return new L.FeatureGroup(layers);
	
			case 'LineString':
				latlngs = this.coordsToLatLngs(coords, 0, coordsToLatLng);
				return new L.Polyline(latlngs, vectorOptions);
	
			case 'Polygon':
				if (coords.length === 2 && !coords[1].length) {
					throw new Error('Invalid GeoJSON object.');
				}
				latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
				return new L.Polygon(latlngs, vectorOptions);
	
			case 'MultiLineString':
				latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
				return new L.MultiPolyline(latlngs, vectorOptions);
	
			case 'MultiPolygon':
				latlngs = this.coordsToLatLngs(coords, 2, coordsToLatLng);
				return new L.MultiPolygon(latlngs, vectorOptions);
	
			case 'GeometryCollection':
				for (i = 0, len = geometry.geometries.length; i < len; i++) {
					layers.push(this.geometryToLayer({
						geometry: geometry.geometries[i],
						type: 'Feature',
						properties: geojson.properties
					}, pointToLayer, coordsToLatLng, vectorOptions));
				}
				return new L.FeatureGroup(layers);
	
			case 'Circle':
				var coord = coords[0];
				latlng = new L.LatLng(coord[1], coord[0]);
				return new L.Circle(latlng, geometry.radius);
	
			default:
				throw new Error('Invalid GeoJSON object.');
			}
	},

	coordsToLatLng: function (coords) { // (Array[, Boolean]) -> LatLng
		return new L.LatLng(coords[1], coords[0], coords[2]);
	},

	coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) { // (Array[, Number, Function]) -> Array
		var latlng, i, len,
		    latlngs = [];

		for (i = 0, len = coords.length; i < len; i++) {
			latlng = levelsDeep ?
			        this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
			        (coordsToLatLng || this.coordsToLatLng)(coords[i]);

			latlngs.push(latlng);
		}

		return latlngs;
	},

	latLngToCoords: function (latlng) {
		var coords = [latlng.lng, latlng.lat];

		if (latlng.alt !== undefined) {
			coords.push(latlng.alt);
		}
		return coords;
	},

	latLngsToCoords: function (latLngs) {
		var coords = [];

		for (var i = 0, len = latLngs.length; i < len; i++) {
			coords.push(L.GeoJSON.latLngToCoords(latLngs[i]));
		}

		return coords;
	},

	getFeature: function (layer, newGeometry) {
		return layer.feature ? L.extend({}, layer.feature, {geometry: newGeometry}) : L.GeoJSON.asFeature(newGeometry);
	},

	asFeature: function (geoJSON) {
		if (geoJSON.type === 'Feature') {
			return geoJSON;
		}

		return {
			type: 'Feature',
			properties: {},
			geometry: geoJSON
		};
	}
});

var PointToGeoJSON = {
	toGeoJSON: function () {
		return L.GeoJSON.getFeature(this, {
			type: 'Point',
			coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
		});
	}
};

L.Marker.include(PointToGeoJSON);
//L.Circle.include(PointToGeoJSON);
L.CircleMarker.include(PointToGeoJSON);

L.Circle.include({
	toGeoJSON: function () {
		return {
			type: 'Circle',
			coordinates: [[this.getLatLng().lng, this.getLatLng().lat]],
			radius: this.getRadius()
		}
	}
});

L.Polyline.include({
	toGeoJSON: function () {
		return L.GeoJSON.getFeature(this, {
			type: 'LineString',
			coordinates: L.GeoJSON.latLngsToCoords(this.getLatLngs())
		});
	}
});

L.Polygon.include({
	toGeoJSON: function () {
		var coords = [L.GeoJSON.latLngsToCoords(this.getLatLngs())],
		    i, len, hole;

		coords[0].push(coords[0][0]);

		if (this._holes) {
			for (i = 0, len = this._holes.length; i < len; i++) {
				hole = L.GeoJSON.latLngsToCoords(this._holes[i]);
				hole.push(hole[0]);
				coords.push(hole);
			}
		}

		return L.GeoJSON.getFeature(this, {
			type: 'Polygon',
			coordinates: coords
		});
	}
});

(function () {
	function multiToGeoJSON(type) {
		return function () {
			var coords = [];

			this.eachLayer(function (layer) {
				coords.push(layer.toGeoJSON().geometry.coordinates);
			});

			return L.GeoJSON.getFeature(this, {
				type: type,
				coordinates: coords
			});
		};
	}

	// L.MultiPolyline.include({toGeoJSON: multiToGeoJSON('MultiLineString')});
	// L.MultiPolygon.include({toGeoJSON: multiToGeoJSON('MultiPolygon')});

	L.LayerGroup.include({
		toGeoJSON: function () {

			var geometry = this.feature && this.feature.geometry,
				jsons = [],
				json;

			if (geometry && geometry.type === 'MultiPoint') {
				return multiToGeoJSON('MultiPoint').call(this);
			}

			var isGeometryCollection = geometry && geometry.type === 'GeometryCollection';

			this.eachLayer(function (layer) {
				if (layer.toGeoJSON) {
					json = layer.toGeoJSON();
					jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json));
				}
			});

			if (isGeometryCollection) {
				return L.GeoJSON.getFeature(this, {
					geometries: jsons,
					type: 'GeometryCollection'
				});
			}

			return {
				type: 'FeatureCollection',
				features: jsons
			};
		}
	});
}());

L.geoJson = function (geojson, options) {
	return new L.GeoJSON(geojson, options);
};;/*
	Leaflet.draw, a plugin that adds drawing and editing tools to Leaflet powered maps.
	(c) 2012-2013, Jacob Toye, Smartrak

	https://github.com/Leaflet/Leaflet.draw
	http://leafletjs.com
	https://github.com/jacobtoye
*/
(function(t,e){L.drawVersion="0.2.3-dev",L.drawLocal={draw:{toolbar:{actions:{title:"Cancel drawing",text:"Cancel"},buttons:{polyline:"Draw a polyline",polygon:"Draw a polygon",rectangle:"Draw a rectangle",circle:"Draw a circle",marker:"Draw a marker"}},handlers:{circle:{tooltip:{start:"Click and drag to draw circle."}},marker:{tooltip:{start:"Click map to place marker."}},polygon:{tooltip:{start:"Click to start drawing shape.",cont:"Click to continue drawing shape.",end:"Click first point to close this shape."}},polyline:{error:"<strong>Error:</strong> shape edges cannot cross!",tooltip:{start:"Click to start drawing line.",cont:"Click to continue drawing line.",end:"Click last point to finish line."}},rectangle:{tooltip:{start:"Click and drag to draw rectangle."}},simpleshape:{tooltip:{end:"Release mouse to finish drawing."}}}},edit:{toolbar:{actions:{save:{title:"Save changes.",text:"Save"},cancel:{title:"Cancel editing, discards all changes.",text:"Cancel"}},buttons:{edit:"Edit layers.",editDisabled:"No layers to edit.",remove:"Delete layers.",removeDisabled:"No layers to delete."}},handlers:{edit:{tooltip:{text:"Drag handles, or marker to edit feature.",subtext:"Click cancel to undo changes."}},remove:{tooltip:{text:"Click on a feature to remove"}}}}},L.Draw={},L.Draw.Feature=L.Handler.extend({includes:L.Mixin.Events,initialize:function(t,e){this._map=t,this._container=t._container,this._overlayPane=t._panes.overlayPane,this._popupPane=t._panes.popupPane,e&&e.shapeOptions&&(e.shapeOptions=L.Util.extend({},this.options.shapeOptions,e.shapeOptions)),L.setOptions(this,e)},enable:function(){this._enabled||(L.Handler.prototype.enable.call(this),this.fire("enabled",{handler:this.type}),this._map.fire("draw:drawstart",{layerType:this.type}))},disable:function(){this._enabled&&(L.Handler.prototype.disable.call(this),this.fire("disabled",{handler:this.type}),this._map.fire("draw:drawstop",{layerType:this.type}))},addHooks:function(){var t=this._map;t&&(L.DomUtil.disableTextSelection(),t.getContainer().focus(),this._tooltip=new L.Tooltip(this._map),L.DomEvent.addListener(this._container,"keyup",this._cancelDrawing,this))},removeHooks:function(){this._map&&(L.DomUtil.enableTextSelection(),this._tooltip.dispose(),this._tooltip=null,L.DomEvent.removeListener(this._container,"keyup",this._cancelDrawing))},setOptions:function(t){L.setOptions(this,t)},_fireCreatedEvent:function(t){this._map.fire("draw:created",{layer:t,layerType:this.type})},_cancelDrawing:function(t){27===t.keyCode&&this.disable()}}),L.Draw.Polyline=L.Draw.Feature.extend({statics:{TYPE:"polyline"},Poly:L.Polyline,options:{allowIntersection:!0,repeatMode:!1,drawError:{color:"#b00b00",timeout:2500},icon:new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon"}),guidelineDistance:20,shapeOptions:{stroke:!0,color:"#f06eaa",weight:4,opacity:.5,fill:!1,clickable:!0},metric:!0,showLength:!0,zIndexOffset:2e3},initialize:function(t,e){this.options.drawError.message=L.drawLocal.draw.handlers.polyline.error,e&&e.drawError&&(e.drawError=L.Util.extend({},this.options.drawError,e.drawError)),this.type=L.Draw.Polyline.TYPE,L.Draw.Feature.prototype.initialize.call(this,t,e)},addHooks:function(){L.Draw.Feature.prototype.addHooks.call(this),this._map&&(this._markers=[],this._markerGroup=new L.LayerGroup,this._map.addLayer(this._markerGroup),this._poly=new L.Polyline([],this.options.shapeOptions),this._tooltip.updateContent(this._getTooltipText()),this._mouseMarker||(this._mouseMarker=L.marker(this._map.getCenter(),{icon:L.divIcon({className:"leaflet-mouse-marker",iconAnchor:[20,20],iconSize:[40,40]}),opacity:0,zIndexOffset:this.options.zIndexOffset})),this._mouseMarker.on("click",this._onClick,this).addTo(this._map),this._map.on("mousemove",this._onMouseMove,this).on("zoomend",this._onZoomEnd,this))},removeHooks:function(){L.Draw.Feature.prototype.removeHooks.call(this),this._clearHideErrorTimeout(),this._cleanUpShape(),this._map.removeLayer(this._markerGroup),delete this._markerGroup,delete this._markers,this._map.removeLayer(this._poly),delete this._poly,this._mouseMarker.off("click",this._onClick,this),this._map.removeLayer(this._mouseMarker),delete this._mouseMarker,this._clearGuides(),this._map.off("mousemove",this._onMouseMove,this).off("zoomend",this._onZoomEnd,this)},_finishShape:function(){var t=this._poly.newLatLngIntersects(this._poly.getLatLngs()[0],!0);return!this.options.allowIntersection&&t||!this._shapeIsValid()?(this._showErrorTooltip(),undefined):(this._fireCreatedEvent(),this.disable(),this.options.repeatMode&&this.enable(),undefined)},_shapeIsValid:function(){return!0},_onZoomEnd:function(){this._updateGuide()},_onMouseMove:function(t){var e=t.layerPoint,i=t.latlng;this._currentLatLng=i,this._updateTooltip(i),this._updateGuide(e),this._mouseMarker.setLatLng(i),L.DomEvent.preventDefault(t.originalEvent)},_onClick:function(t){var e=t.target.getLatLng(),i=this._markers.length;return i>0&&!this.options.allowIntersection&&this._poly.newLatLngIntersects(e)?(this._showErrorTooltip(),undefined):(this._errorShown&&this._hideErrorTooltip(),this._markers.push(this._createMarker(e)),this._poly.addLatLng(e),2===this._poly.getLatLngs().length&&this._map.addLayer(this._poly),this._updateFinishHandler(),this._vertexAdded(e),this._clearGuides(),this._updateTooltip(),undefined)},_updateFinishHandler:function(){var t=this._markers.length;t>1&&this._markers[t-1].on("click",this._finishShape,this),t>2&&this._markers[t-2].off("click",this._finishShape,this)},_createMarker:function(t){var e=new L.Marker(t,{icon:this.options.icon,zIndexOffset:2*this.options.zIndexOffset});return this._markerGroup.addLayer(e),e},_updateGuide:function(t){var e=this._markers.length;e>0&&(t=t||this._map.latLngToLayerPoint(this._currentLatLng),this._clearGuides(),this._drawGuide(this._map.latLngToLayerPoint(this._markers[e-1].getLatLng()),t))},_updateTooltip:function(t){var e=this._getTooltipText();t&&this._tooltip.updatePosition(t),this._errorShown||this._tooltip.updateContent(e)},_drawGuide:function(t,e){var i,o,a,s,r=Math.floor(Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2)));for(this._guidesContainer||(this._guidesContainer=L.DomUtil.create("div","leaflet-draw-guides",this._overlayPane)),i=this.options.guidelineDistance;r>i;i+=this.options.guidelineDistance)o=i/r,a={x:Math.floor(t.x*(1-o)+o*e.x),y:Math.floor(t.y*(1-o)+o*e.y)},s=L.DomUtil.create("div","leaflet-draw-guide-dash",this._guidesContainer),s.style.backgroundColor=this._errorShown?this.options.drawError.color:this.options.shapeOptions.color,L.DomUtil.setPosition(s,a)},_updateGuideColor:function(t){if(this._guidesContainer)for(var e=0,i=this._guidesContainer.childNodes.length;i>e;e++)this._guidesContainer.childNodes[e].style.backgroundColor=t},_clearGuides:function(){if(this._guidesContainer)for(;this._guidesContainer.firstChild;)this._guidesContainer.removeChild(this._guidesContainer.firstChild)},_getTooltipText:function(){var t,e,i=this.options.showLength;return 0===this._markers.length?t={text:L.drawLocal.draw.handlers.polyline.tooltip.start}:(e=i?this._getMeasurementString():"",t=1===this._markers.length?{text:L.drawLocal.draw.handlers.polyline.tooltip.cont,subtext:e}:{text:L.drawLocal.draw.handlers.polyline.tooltip.end,subtext:e}),t},_getMeasurementString:function(){var t,e=this._currentLatLng,i=this._markers[this._markers.length-1].getLatLng();return t=this._measurementRunningTotal+e.distanceTo(i),L.GeometryUtil.readableDistance(t,this.options.metric)},_showErrorTooltip:function(){this._errorShown=!0,this._tooltip.showAsError().updateContent({text:this.options.drawError.message}),this._updateGuideColor(this.options.drawError.color),this._poly.setStyle({color:this.options.drawError.color}),this._clearHideErrorTimeout(),this._hideErrorTimeout=setTimeout(L.Util.bind(this._hideErrorTooltip,this),this.options.drawError.timeout)},_hideErrorTooltip:function(){this._errorShown=!1,this._clearHideErrorTimeout(),this._tooltip.removeError().updateContent(this._getTooltipText()),this._updateGuideColor(this.options.shapeOptions.color),this._poly.setStyle({color:this.options.shapeOptions.color})},_clearHideErrorTimeout:function(){this._hideErrorTimeout&&(clearTimeout(this._hideErrorTimeout),this._hideErrorTimeout=null)},_vertexAdded:function(t){1===this._markers.length?this._measurementRunningTotal=0:this._measurementRunningTotal+=t.distanceTo(this._markers[this._markers.length-2].getLatLng())},_cleanUpShape:function(){this._markers.length>1&&this._markers[this._markers.length-1].off("click",this._finishShape,this)},_fireCreatedEvent:function(){var t=new this.Poly(this._poly.getLatLngs(),this.options.shapeOptions);L.Draw.Feature.prototype._fireCreatedEvent.call(this,t)}}),L.Draw.Polygon=L.Draw.Polyline.extend({statics:{TYPE:"polygon"},Poly:L.Polygon,options:{showArea:!1,shapeOptions:{stroke:!0,color:"#f06eaa",weight:4,opacity:.5,fill:!0,fillColor:null,fillOpacity:.2,clickable:!0}},initialize:function(t,e){L.Draw.Polyline.prototype.initialize.call(this,t,e),this.type=L.Draw.Polygon.TYPE},_updateFinishHandler:function(){var t=this._markers.length;1===t&&this._markers[0].on("click",this._finishShape,this),t>2&&(this._markers[t-1].on("dblclick",this._finishShape,this),t>3&&this._markers[t-2].off("dblclick",this._finishShape,this))},_getTooltipText:function(){var t,e;return 0===this._markers.length?t=L.drawLocal.draw.handlers.polygon.tooltip.start:3>this._markers.length?t=L.drawLocal.draw.handlers.polygon.tooltip.cont:(t=L.drawLocal.draw.handlers.polygon.tooltip.end,e=this._getMeasurementString()),{text:t,subtext:e}},_getMeasurementString:function(){var t=this._area;return t?L.GeometryUtil.readableArea(t,this.options.metric):null},_shapeIsValid:function(){return this._markers.length>=3},_vertexAdded:function(){if(!this.options.allowIntersection&&this.options.showArea){var t=this._poly.getLatLngs();this._area=L.GeometryUtil.geodesicArea(t)}},_cleanUpShape:function(){var t=this._markers.length;t>0&&(this._markers[0].off("click",this._finishShape,this),t>2&&this._markers[t-1].off("dblclick",this._finishShape,this))}}),L.SimpleShape={},L.Draw.SimpleShape=L.Draw.Feature.extend({options:{repeatMode:!1},initialize:function(t,e){this._endLabelText=L.drawLocal.draw.handlers.simpleshape.tooltip.end,L.Draw.Feature.prototype.initialize.call(this,t,e)},addHooks:function(){L.Draw.Feature.prototype.addHooks.call(this),this._map&&(this._map.dragging.disable(),this._container.style.cursor="crosshair",this._tooltip.updateContent({text:this._initialLabelText}),this._map.on("mousedown",this._onMouseDown,this).on("mousemove",this._onMouseMove,this))},removeHooks:function(){L.Draw.Feature.prototype.removeHooks.call(this),this._map&&(this._map.dragging.enable(),this._container.style.cursor="",this._map.off("mousedown",this._onMouseDown,this).off("mousemove",this._onMouseMove,this),L.DomEvent.off(e,"mouseup",this._onMouseUp),this._shape&&(this._map.removeLayer(this._shape),delete this._shape)),this._isDrawing=!1},_onMouseDown:function(t){this._isDrawing=!0,this._startLatLng=t.latlng,L.DomEvent.on(e,"mouseup",this._onMouseUp,this).preventDefault(t.originalEvent)},_onMouseMove:function(t){var e=t.latlng;this._tooltip.updatePosition(e),this._isDrawing&&(this._tooltip.updateContent({text:this._endLabelText}),this._drawShape(e))},_onMouseUp:function(){this._shape&&this._fireCreatedEvent(),this.disable(),this.options.repeatMode&&this.enable()}}),L.Draw.Rectangle=L.Draw.SimpleShape.extend({statics:{TYPE:"rectangle"},options:{shapeOptions:{stroke:!0,color:"#f06eaa",weight:4,opacity:.5,fill:!0,fillColor:null,fillOpacity:.2,clickable:!0}},initialize:function(t,e){this.type=L.Draw.Rectangle.TYPE,this._initialLabelText=L.drawLocal.draw.handlers.rectangle.tooltip.start,L.Draw.SimpleShape.prototype.initialize.call(this,t,e)},_drawShape:function(t){this._shape?this._shape.setBounds(new L.LatLngBounds(this._startLatLng,t)):(this._shape=new L.Rectangle(new L.LatLngBounds(this._startLatLng,t),this.options.shapeOptions),this._map.addLayer(this._shape))},_fireCreatedEvent:function(){var t=new L.Rectangle(this._shape.getBounds(),this.options.shapeOptions);L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this,t)}}),L.Draw.Circle=L.Draw.SimpleShape.extend({statics:{TYPE:"circle"},options:{shapeOptions:{stroke:!0,color:"#f06eaa",weight:4,opacity:.5,fill:!0,fillColor:null,fillOpacity:.2,clickable:!0},showRadius:!0,metric:!0},initialize:function(t,e){this.type=L.Draw.Circle.TYPE,this._initialLabelText=L.drawLocal.draw.handlers.circle.tooltip.start,L.Draw.SimpleShape.prototype.initialize.call(this,t,e)},_drawShape:function(t){this._shape?this._shape.setRadius(this._startLatLng.distanceTo(t)):(this._shape=new L.Circle(this._startLatLng,this._startLatLng.distanceTo(t),this.options.shapeOptions),this._map.addLayer(this._shape))},_fireCreatedEvent:function(){var t=new L.Circle(this._startLatLng,this._shape.getRadius(),this.options.shapeOptions);L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this,t)},_onMouseMove:function(t){var e,i=t.latlng,o=(this.options.metric,this.options.showRadius),a=this.options.metric;this._tooltip.updatePosition(i),this._isDrawing&&(this._drawShape(i),e=this._shape.getRadius().toFixed(1),this._tooltip.updateContent({text:this._endLabelText,subtext:o?"Radius: "+L.GeometryUtil.readableDistance(e,a):""}))}}),L.Draw.Marker=L.Draw.Feature.extend({statics:{TYPE:"marker"},options:{icon:new L.Icon.Default,repeatMode:!1,zIndexOffset:2e3},initialize:function(t,e){this.type=L.Draw.Marker.TYPE,L.Draw.Feature.prototype.initialize.call(this,t,e)},addHooks:function(){L.Draw.Feature.prototype.addHooks.call(this),this._map&&(this._tooltip.updateContent({text:L.drawLocal.draw.handlers.marker.tooltip.start}),this._mouseMarker||(this._mouseMarker=L.marker(this._map.getCenter(),{icon:L.divIcon({className:"leaflet-mouse-marker",iconAnchor:[20,20],iconSize:[40,40]}),opacity:0,zIndexOffset:this.options.zIndexOffset})),this._mouseMarker.on("click",this._onClick,this).addTo(this._map),this._map.on("mousemove",this._onMouseMove,this))},removeHooks:function(){L.Draw.Feature.prototype.removeHooks.call(this),this._map&&(this._marker&&(this._marker.off("click",this._onClick,this),this._map.off("click",this._onClick,this).removeLayer(this._marker),delete this._marker),this._mouseMarker.off("click",this._onClick,this),this._map.removeLayer(this._mouseMarker),delete this._mouseMarker,this._map.off("mousemove",this._onMouseMove,this))},_onMouseMove:function(t){var e=t.latlng;this._tooltip.updatePosition(e),this._mouseMarker.setLatLng(e),this._marker?(e=this._mouseMarker.getLatLng(),this._marker.setLatLng(e)):(this._marker=new L.Marker(e,{icon:this.options.icon,zIndexOffset:this.options.zIndexOffset}),this._marker.on("click",this._onClick,this),this._map.on("click",this._onClick,this).addLayer(this._marker))},_onClick:function(){this._fireCreatedEvent(),this.disable(),this.options.repeatMode&&this.enable()},_fireCreatedEvent:function(){var t=new L.Marker(this._marker.getLatLng(),{icon:this.options.icon});L.Draw.Feature.prototype._fireCreatedEvent.call(this,t)}}),L.Edit=L.Edit||{},L.Edit.Poly=L.Handler.extend({options:{icon:new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon"})},initialize:function(t,e){this._poly=t,L.setOptions(this,e)},addHooks:function(){this._poly._map&&(this._markerGroup||this._initMarkers(),this._poly._map.addLayer(this._markerGroup))},removeHooks:function(){this._poly._map&&(this._poly._map.removeLayer(this._markerGroup),delete this._markerGroup,delete this._markers)},updateMarkers:function(){this._markerGroup.clearLayers(),this._initMarkers()},_initMarkers:function(){this._markerGroup||(this._markerGroup=new L.LayerGroup),this._markers=[];var t,e,i,o,a=this._poly._latlngs;for(t=0,i=a.length;i>t;t++)o=this._createMarker(a[t],t),o.on("click",this._onMarkerClick,this),this._markers.push(o);var s,r;for(t=0,e=i-1;i>t;e=t++)(0!==t||L.Polygon&&this._poly instanceof L.Polygon)&&(s=this._markers[e],r=this._markers[t],this._createMiddleMarker(s,r),this._updatePrevNext(s,r))},_createMarker:function(t,e){var i=new L.Marker(t,{draggable:!0,icon:this.options.icon});return i._origLatLng=t,i._index=e,i.on("drag",this._onMarkerDrag,this),i.on("dragend",this._fireEdit,this),this._markerGroup.addLayer(i),i},_removeMarker:function(t){var e=t._index;this._markerGroup.removeLayer(t),this._markers.splice(e,1),this._poly.spliceLatLngs(e,1),this._updateIndexes(e,-1),t.off("drag",this._onMarkerDrag,this).off("dragend",this._fireEdit,this).off("click",this._onMarkerClick,this)},_fireEdit:function(){this._poly.edited=!0,this._poly.fire("edit")},_onMarkerDrag:function(t){var e=t.target;L.extend(e._origLatLng,e._latlng),e._middleLeft&&e._middleLeft.setLatLng(this._getMiddleLatLng(e._prev,e)),e._middleRight&&e._middleRight.setLatLng(this._getMiddleLatLng(e,e._next)),this._poly.redraw()},_onMarkerClick:function(t){var e=L.Polygon&&this._poly instanceof L.Polygon?4:3,i=t.target;e>this._poly._latlngs.length||(this._removeMarker(i),this._updatePrevNext(i._prev,i._next),i._middleLeft&&this._markerGroup.removeLayer(i._middleLeft),i._middleRight&&this._markerGroup.removeLayer(i._middleRight),i._prev&&i._next?this._createMiddleMarker(i._prev,i._next):i._prev?i._next||(i._prev._middleRight=null):i._next._middleLeft=null,this._fireEdit())},_updateIndexes:function(t,e){this._markerGroup.eachLayer(function(i){i._index>t&&(i._index+=e)})},_createMiddleMarker:function(t,e){var i,o,a,s=this._getMiddleLatLng(t,e),r=this._createMarker(s);r.setOpacity(.6),t._middleRight=e._middleLeft=r,o=function(){var o=e._index;r._index=o,r.off("click",i,this).on("click",this._onMarkerClick,this),s.lat=r.getLatLng().lat,s.lng=r.getLatLng().lng,this._poly.spliceLatLngs(o,0,s),this._markers.splice(o,0,r),r.setOpacity(1),this._updateIndexes(o,1),e._index++,this._updatePrevNext(t,r),this._updatePrevNext(r,e)},a=function(){r.off("dragstart",o,this),r.off("dragend",a,this),this._createMiddleMarker(t,r),this._createMiddleMarker(r,e)},i=function(){o.call(this),a.call(this),this._fireEdit()},r.on("click",i,this).on("dragstart",o,this).on("dragend",a,this),this._markerGroup.addLayer(r)},_updatePrevNext:function(t,e){t&&(t._next=e),e&&(e._prev=t)},_getMiddleLatLng:function(t,e){var i=this._poly._map,o=i.project(t.getLatLng()),a=i.project(e.getLatLng());return i.unproject(o._add(a)._divideBy(2))}}),L.Polyline.addInitHook(function(){this.editing||(L.Edit.Poly&&(this.editing=new L.Edit.Poly(this),this.options.editable&&this.editing.enable()),this.on("add",function(){this.editing&&this.editing.enabled()&&this.editing.addHooks()}),this.on("remove",function(){this.editing&&this.editing.enabled()&&this.editing.removeHooks()}))}),L.Edit=L.Edit||{},L.Edit.SimpleShape=L.Handler.extend({options:{moveIcon:new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon leaflet-edit-move"}),resizeIcon:new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon leaflet-edit-resize"})},initialize:function(t,e){this._shape=t,L.Util.setOptions(this,e)},addHooks:function(){this._shape._map&&(this._map=this._shape._map,this._markerGroup||this._initMarkers(),this._map.addLayer(this._markerGroup))},removeHooks:function(){if(this._shape._map){this._unbindMarker(this._moveMarker);for(var t=0,e=this._resizeMarkers.length;e>t;t++)this._unbindMarker(this._resizeMarkers[t]);this._resizeMarkers=null,this._map.removeLayer(this._markerGroup),delete this._markerGroup}this._map=null},updateMarkers:function(){this._markerGroup.clearLayers(),this._initMarkers()},_initMarkers:function(){this._markerGroup||(this._markerGroup=new L.LayerGroup),this._createMoveMarker(),this._createResizeMarker()},_createMoveMarker:function(){},_createResizeMarker:function(){},_createMarker:function(t,e){var i=new L.Marker(t,{draggable:!0,icon:e,zIndexOffset:10});return this._bindMarker(i),this._markerGroup.addLayer(i),i},_bindMarker:function(t){t.on("dragstart",this._onMarkerDragStart,this).on("drag",this._onMarkerDrag,this).on("dragend",this._onMarkerDragEnd,this)},_unbindMarker:function(t){t.off("dragstart",this._onMarkerDragStart,this).off("drag",this._onMarkerDrag,this).off("dragend",this._onMarkerDragEnd,this)},_onMarkerDragStart:function(t){var e=t.target;e.setOpacity(0)},_fireEdit:function(){this._shape.edited=!0,this._shape.fire("edit")},_onMarkerDrag:function(t){var e=t.target,i=e.getLatLng();e===this._moveMarker?this._move(i):this._resize(i),this._shape.redraw()},_onMarkerDragEnd:function(t){var e=t.target;e.setOpacity(1),this._fireEdit()},_move:function(){},_resize:function(){}}),L.Edit=L.Edit||{},L.Edit.Rectangle=L.Edit.SimpleShape.extend({_createMoveMarker:function(){var t=this._shape.getBounds(),e=t.getCenter();this._moveMarker=this._createMarker(e,this.options.moveIcon)},_createResizeMarker:function(){var t=this._getCorners();this._resizeMarkers=[];for(var e=0,i=t.length;i>e;e++)this._resizeMarkers.push(this._createMarker(t[e],this.options.resizeIcon)),this._resizeMarkers[e]._cornerIndex=e},_onMarkerDragStart:function(t){L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this,t);var e=this._getCorners(),i=t.target,o=i._cornerIndex;this._oppositeCorner=e[(o+2)%4],this._toggleCornerMarkers(0,o)},_onMarkerDragEnd:function(t){var e,i,o=t.target;o===this._moveMarker&&(e=this._shape.getBounds(),i=e.getCenter(),o.setLatLng(i)),this._toggleCornerMarkers(1),this._repositionCornerMarkers(),L.Edit.SimpleShape.prototype._onMarkerDragEnd.call(this,t)},_move:function(t){for(var e,i=this._shape.getLatLngs(),o=this._shape.getBounds(),a=o.getCenter(),s=[],r=0,n=i.length;n>r;r++)e=[i[r].lat-a.lat,i[r].lng-a.lng],s.push([t.lat+e[0],t.lng+e[1]]);this._shape.setLatLngs(s),this._repositionCornerMarkers()},_resize:function(t){var e;this._shape.setBounds(L.latLngBounds(t,this._oppositeCorner)),e=this._shape.getBounds(),this._moveMarker.setLatLng(e.getCenter())},_getCorners:function(){var t=this._shape.getBounds(),e=t.getNorthWest(),i=t.getNorthEast(),o=t.getSouthEast(),a=t.getSouthWest();return[e,i,o,a]},_toggleCornerMarkers:function(t){for(var e=0,i=this._resizeMarkers.length;i>e;e++)this._resizeMarkers[e].setOpacity(t)},_repositionCornerMarkers:function(){for(var t=this._getCorners(),e=0,i=this._resizeMarkers.length;i>e;e++)this._resizeMarkers[e].setLatLng(t[e])}}),L.Rectangle.addInitHook(function(){L.Edit.Rectangle&&(this.editing=new L.Edit.Rectangle(this),this.options.editable&&this.editing.enable())}),L.Edit=L.Edit||{},L.Edit.Circle=L.Edit.SimpleShape.extend({_createMoveMarker:function(){var t=this._shape.getLatLng();this._moveMarker=this._createMarker(t,this.options.moveIcon)},_createResizeMarker:function(){var t=this._shape.getLatLng(),e=this._getResizeMarkerPoint(t);this._resizeMarkers=[],this._resizeMarkers.push(this._createMarker(e,this.options.resizeIcon))},_getResizeMarkerPoint:function(t){var e=this._shape._radius*Math.cos(Math.PI/4),i=this._map.project(t);return this._map.unproject([i.x+e,i.y-e])},_move:function(t){var e=this._getResizeMarkerPoint(t);this._resizeMarkers[0].setLatLng(e),this._shape.setLatLng(t)},_resize:function(t){var e=this._moveMarker.getLatLng(),i=e.distanceTo(t);this._shape.setRadius(i)}}),L.Circle.addInitHook(function(){L.Edit.Circle&&(this.editing=new L.Edit.Circle(this),this.options.editable&&this.editing.enable()),this.on("add",function(){this.editing&&this.editing.enabled()&&this.editing.addHooks()}),this.on("remove",function(){this.editing&&this.editing.enabled()&&this.editing.removeHooks()})}),L.LatLngUtil={cloneLatLngs:function(t){for(var e=[],i=0,o=t.length;o>i;i++)e.push(this.cloneLatLng(t[i]));return e},cloneLatLng:function(t){return L.latLng(t.lat,t.lng)}},L.GeometryUtil=L.extend(L.GeometryUtil||{},{geodesicArea:function(t){var e,i,o=t.length,a=0,s=L.LatLng.DEG_TO_RAD;if(o>2){for(var r=0;o>r;r++)e=t[r],i=t[(r+1)%o],a+=(i.lng-e.lng)*s*(2+Math.sin(e.lat*s)+Math.sin(i.lat*s));a=6378137*6378137*a/2}return Math.abs(a)},readableArea:function(t,e){var i;return e?i=t>=1e4?(1e-4*t).toFixed(2)+" ha":t.toFixed(2)+" m&sup2;":(t*=.836127,i=t>=3097600?(t/3097600).toFixed(2)+" mi&sup2;":t>=4840?(t/4840).toFixed(2)+" acres":Math.ceil(t)+" yd&sup2;"),i},readableDistance:function(t,e){var i;return e?i=t>1e3?(t/1e3).toFixed(2)+" km":Math.ceil(t)+" m":(t*=1.09361,i=t>1760?(t/1760).toFixed(2)+" miles":Math.ceil(t)+" yd"),i}}),L.Util.extend(L.LineUtil,{segmentsIntersect:function(t,e,i,o){return this._checkCounterclockwise(t,i,o)!==this._checkCounterclockwise(e,i,o)&&this._checkCounterclockwise(t,e,i)!==this._checkCounterclockwise(t,e,o)},_checkCounterclockwise:function(t,e,i){return(i.y-t.y)*(e.x-t.x)>(e.y-t.y)*(i.x-t.x)}}),L.Polyline.include({intersects:function(){var t,e,i,o=this._originalPoints,a=o?o.length:0;if(this._tooFewPointsForIntersection())return!1;for(t=a-1;t>=3;t--)if(e=o[t-1],i=o[t],this._lineSegmentsIntersectsRange(e,i,t-2))return!0;return!1},newLatLngIntersects:function(t,e){return this._map?this.newPointIntersects(this._map.latLngToLayerPoint(t),e):!1},newPointIntersects:function(t,e){var i=this._originalPoints,o=i?i.length:0,a=i?i[o-1]:null,s=o-2;return this._tooFewPointsForIntersection(1)?!1:this._lineSegmentsIntersectsRange(a,t,s,e?1:0)},_tooFewPointsForIntersection:function(t){var e=this._originalPoints,i=e?e.length:0;return i+=t||0,!this._originalPoints||3>=i},_lineSegmentsIntersectsRange:function(t,e,i,o){var a,s,r=this._originalPoints;o=o||0;for(var n=i;n>o;n--)if(a=r[n-1],s=r[n],L.LineUtil.segmentsIntersect(t,e,a,s))return!0;return!1}}),L.Polygon.include({intersects:function(){var t,e,i,o,a,s=this._originalPoints;return this._tooFewPointsForIntersection()?!1:(t=L.Polyline.prototype.intersects.call(this))?!0:(e=s.length,i=s[0],o=s[e-1],a=e-2,this._lineSegmentsIntersectsRange(o,i,a,1))}}),L.Control.Draw=L.Control.extend({options:{position:"topleft",draw:{},edit:!1},initialize:function(t){if("0.7">L.version)throw Error("Leaflet.draw 0.2.3+ requires Leaflet 0.7.0+. Download latest from https://github.com/Leaflet/Leaflet/");L.Control.prototype.initialize.call(this,t);var e,i;this._toolbars={},L.DrawToolbar&&this.options.draw&&(i=new L.DrawToolbar(this.options.draw),e=L.stamp(i),this._toolbars[e]=i,this._toolbars[e].on("enable",this._toolbarEnabled,this)),L.EditToolbar&&this.options.edit&&(i=new L.EditToolbar(this.options.edit),e=L.stamp(i),this._toolbars[e]=i,this._toolbars[e].on("enable",this._toolbarEnabled,this))},onAdd:function(t){var e,i=L.DomUtil.create("div","leaflet-draw"),o=!1,a="leaflet-draw-toolbar-top";for(var s in this._toolbars)this._toolbars.hasOwnProperty(s)&&(e=this._toolbars[s].addToolbar(t),o||(L.DomUtil.hasClass(e,a)||L.DomUtil.addClass(e.childNodes[0],a),o=!0),i.appendChild(e));return i},onRemove:function(){for(var t in this._toolbars)this._toolbars.hasOwnProperty(t)&&this._toolbars[t].removeToolbar()},setDrawingOptions:function(t){for(var e in this._toolbars)this._toolbars[e]instanceof L.DrawToolbar&&this._toolbars[e].setOptions(t)},_toolbarEnabled:function(t){var e=""+L.stamp(t.target);for(var i in this._toolbars)this._toolbars.hasOwnProperty(i)&&i!==e&&this._toolbars[i].disable()}}),L.Map.mergeOptions({drawControlTooltips:!0,drawControl:!1}),L.Map.addInitHook(function(){this.options.drawControl&&(this.drawControl=new L.Control.Draw,this.addControl(this.drawControl))}),L.Toolbar=L.Class.extend({includes:[L.Mixin.Events],initialize:function(t){L.setOptions(this,t),this._modes={},this._actionButtons=[],this._activeMode=null},enabled:function(){return null!==this._activeMode},disable:function(){this.enabled()&&this._activeMode.handler.disable()},removeToolbar:function(){for(var t in this._modes)this._modes.hasOwnProperty(t)&&(this._disposeButton(this._modes[t].button,this._modes[t].handler.enable),this._modes[t].handler.disable(),this._modes[t].handler.off("enabled",this._handlerActivated,this).off("disabled",this._handlerDeactivated,this));this._modes={};for(var e=0,i=this._actionButtons.length;i>e;e++)this._disposeButton(this._actionButtons[e].button,this._actionButtons[e].callback);this._actionButtons=[],this._actionsContainer=null},_initModeHandler:function(t,e,i,o,a){var s=t.type;this._modes[s]={},this._modes[s].handler=t,this._modes[s].button=this._createButton({title:a,className:o+"-"+s,container:e,callback:this._modes[s].handler.enable,context:this._modes[s].handler}),this._modes[s].buttonIndex=i,this._modes[s].handler.on("enabled",this._handlerActivated,this).on("disabled",this._handlerDeactivated,this)},_createButton:function(t){var e=L.DomUtil.create("a",t.className||"",t.container);return e.href="#",t.text&&(e.innerHTML=t.text),t.title&&(e.title=t.title),L.DomEvent.on(e,"click",L.DomEvent.stopPropagation).on(e,"mousedown",L.DomEvent.stopPropagation).on(e,"dblclick",L.DomEvent.stopPropagation).on(e,"click",L.DomEvent.preventDefault).on(e,"click",t.callback,t.context),e},_disposeButton:function(t,e){L.DomEvent.off(t,"click",L.DomEvent.stopPropagation).off(t,"mousedown",L.DomEvent.stopPropagation).off(t,"dblclick",L.DomEvent.stopPropagation).off(t,"click",L.DomEvent.preventDefault).off(t,"click",e)},_handlerActivated:function(t){this._activeMode&&this._activeMode.handler.enabled()&&this._activeMode.handler.disable(),this._activeMode=this._modes[t.handler],L.DomUtil.addClass(this._activeMode.button,"leaflet-draw-toolbar-button-enabled"),this._showActionsToolbar(),this.fire("enable")},_handlerDeactivated:function(){this._hideActionsToolbar(),L.DomUtil.removeClass(this._activeMode.button,"leaflet-draw-toolbar-button-enabled"),this._activeMode=null,this.fire("disable")},_createActions:function(t){for(var e,i,o=L.DomUtil.create("ul","leaflet-draw-actions"),a=t.length,s=0;a>s;s++)e=L.DomUtil.create("li","",o),i=this._createButton({title:t[s].title,text:t[s].text,container:e,callback:t[s].callback,context:t[s].context}),this._actionButtons.push({button:i,callback:t[s].callback});return o},_showActionsToolbar:function(){var t=this._activeMode.buttonIndex,e=this._lastButtonIndex,i=26,o=1,a=t*i+t*o-1;this._actionsContainer.style.top=a+"px",0===t&&(L.DomUtil.addClass(this._toolbarContainer,"leaflet-draw-toolbar-notop"),L.DomUtil.addClass(this._actionsContainer,"leaflet-draw-actions-top")),t===e&&(L.DomUtil.addClass(this._toolbarContainer,"leaflet-draw-toolbar-nobottom"),L.DomUtil.addClass(this._actionsContainer,"leaflet-draw-actions-bottom")),this._actionsContainer.style.display="block"},_hideActionsToolbar:function(){this._actionsContainer.style.display="none",L.DomUtil.removeClass(this._toolbarContainer,"leaflet-draw-toolbar-notop"),L.DomUtil.removeClass(this._toolbarContainer,"leaflet-draw-toolbar-nobottom"),L.DomUtil.removeClass(this._actionsContainer,"leaflet-draw-actions-top"),L.DomUtil.removeClass(this._actionsContainer,"leaflet-draw-actions-bottom")}}),L.Tooltip=L.Class.extend({initialize:function(t){this._map=t,this._popupPane=t._panes.popupPane,this._container=t.options.drawControlTooltips?L.DomUtil.create("div","leaflet-draw-tooltip",this._popupPane):null,this._singleLineLabel=!1},dispose:function(){this._container&&(this._popupPane.removeChild(this._container),this._container=null)},updateContent:function(t){return this._container?(t.subtext=t.subtext||"",0!==t.subtext.length||this._singleLineLabel?t.subtext.length>0&&this._singleLineLabel&&(L.DomUtil.removeClass(this._container,"leaflet-draw-tooltip-single"),this._singleLineLabel=!1):(L.DomUtil.addClass(this._container,"leaflet-draw-tooltip-single"),this._singleLineLabel=!0),this._container.innerHTML=(t.subtext.length>0?'<span class="leaflet-draw-tooltip-subtext">'+t.subtext+"</span>"+"<br />":"")+"<span>"+t.text+"</span>",this):this},updatePosition:function(t){var e=this._map.latLngToLayerPoint(t),i=this._container;return this._container&&(i.style.visibility="inherit",L.DomUtil.setPosition(i,e)),this},showAsError:function(){return this._container&&L.DomUtil.addClass(this._container,"leaflet-error-draw-tooltip"),this},removeError:function(){return this._container&&L.DomUtil.removeClass(this._container,"leaflet-error-draw-tooltip"),this
}}),L.DrawToolbar=L.Toolbar.extend({options:{polyline:{},polygon:{},rectangle:{},circle:{},marker:{}},initialize:function(t){for(var e in this.options)this.options.hasOwnProperty(e)&&t[e]&&(t[e]=L.extend({},this.options[e],t[e]));L.Toolbar.prototype.initialize.call(this,t)},addToolbar:function(t){var e=L.DomUtil.create("div","leaflet-draw-section"),i=0,o="leaflet-draw-draw";return this._toolbarContainer=L.DomUtil.create("div","leaflet-draw-toolbar leaflet-bar"),this.options.polyline&&this._initModeHandler(new L.Draw.Polyline(t,this.options.polyline),this._toolbarContainer,i++,o,L.drawLocal.draw.toolbar.buttons.polyline),this.options.polygon&&this._initModeHandler(new L.Draw.Polygon(t,this.options.polygon),this._toolbarContainer,i++,o,L.drawLocal.draw.toolbar.buttons.polygon),this.options.rectangle&&this._initModeHandler(new L.Draw.Rectangle(t,this.options.rectangle),this._toolbarContainer,i++,o,L.drawLocal.draw.toolbar.buttons.rectangle),this.options.circle&&this._initModeHandler(new L.Draw.Circle(t,this.options.circle),this._toolbarContainer,i++,o,L.drawLocal.draw.toolbar.buttons.circle),this.options.marker&&this._initModeHandler(new L.Draw.Marker(t,this.options.marker),this._toolbarContainer,i++,o,L.drawLocal.draw.toolbar.buttons.marker),this._lastButtonIndex=--i,this._actionsContainer=this._createActions([{title:L.drawLocal.draw.toolbar.actions.title,text:L.drawLocal.draw.toolbar.actions.text,callback:this.disable,context:this}]),e.appendChild(this._toolbarContainer),e.appendChild(this._actionsContainer),e},setOptions:function(t){L.setOptions(this,t);for(var e in this._modes)this._modes.hasOwnProperty(e)&&t.hasOwnProperty(e)&&this._modes[e].handler.setOptions(t[e])}}),L.EditToolbar=L.Toolbar.extend({options:{edit:{selectedPathOptions:{color:"#fe57a1",opacity:.6,dashArray:"10, 10",fill:!0,fillColor:"#fe57a1",fillOpacity:.1}},remove:{},featureGroup:null},initialize:function(t){t.edit&&(t.edit.selectedPathOptions===undefined&&(t.edit.selectedPathOptions=this.options.edit.selectedPathOptions),t.edit=L.extend({},this.options.edit,t.edit)),t.remove&&(t.remove=L.extend({},this.options.remove,t.remove)),L.Toolbar.prototype.initialize.call(this,t),this._selectedFeatureCount=0},addToolbar:function(t){var e=L.DomUtil.create("div","leaflet-draw-section"),i=0,o="leaflet-draw-edit",a=this.options.featureGroup;return this._toolbarContainer=L.DomUtil.create("div","leaflet-draw-toolbar leaflet-bar"),this._map=t,this.options.edit&&this._initModeHandler(new L.EditToolbar.Edit(t,{featureGroup:a,selectedPathOptions:this.options.edit.selectedPathOptions}),this._toolbarContainer,i++,o,L.drawLocal.edit.toolbar.buttons.edit),this.options.remove&&this._initModeHandler(new L.EditToolbar.Delete(t,{featureGroup:a}),this._toolbarContainer,i++,o,L.drawLocal.edit.toolbar.buttons.remove),this._lastButtonIndex=--i,this._actionsContainer=this._createActions([{title:L.drawLocal.edit.toolbar.actions.save.title,text:L.drawLocal.edit.toolbar.actions.save.text,callback:this._save,context:this},{title:L.drawLocal.edit.toolbar.actions.cancel.title,text:L.drawLocal.edit.toolbar.actions.cancel.text,callback:this.disable,context:this}]),e.appendChild(this._toolbarContainer),e.appendChild(this._actionsContainer),this._checkDisabled(),a.on("layeradd layerremove",this._checkDisabled,this),e},removeToolbar:function(){L.Toolbar.prototype.removeToolbar.call(this),this.options.featureGroup.off("layeradd layerremove",this._checkDisabled,this)},disable:function(){this.enabled()&&(this._activeMode.handler.revertLayers(),L.Toolbar.prototype.disable.call(this))},_save:function(){this._activeMode.handler.save(),this._activeMode.handler.disable()},_checkDisabled:function(){var t,e=this.options.featureGroup,i=0!==e.getLayers().length;this.options.edit&&(t=this._modes[L.EditToolbar.Edit.TYPE].button,i?L.DomUtil.removeClass(t,"leaflet-disabled"):L.DomUtil.addClass(t,"leaflet-disabled"),t.setAttribute("title",i?L.drawLocal.edit.toolbar.buttons.edit:L.drawLocal.edit.toolbar.buttons.editDisabled)),this.options.remove&&(t=this._modes[L.EditToolbar.Delete.TYPE].button,i?L.DomUtil.removeClass(t,"leaflet-disabled"):L.DomUtil.addClass(t,"leaflet-disabled"),t.setAttribute("title",i?L.drawLocal.edit.toolbar.buttons.remove:L.drawLocal.edit.toolbar.buttons.removeDisabled))}}),L.EditToolbar.Edit=L.Handler.extend({statics:{TYPE:"edit"},includes:L.Mixin.Events,initialize:function(t,e){if(L.Handler.prototype.initialize.call(this,t),this._selectedPathOptions=e.selectedPathOptions,this._featureGroup=e.featureGroup,!(this._featureGroup instanceof L.FeatureGroup))throw Error("options.featureGroup must be a L.FeatureGroup");this._uneditedLayerProps={},this.type=L.EditToolbar.Edit.TYPE},enable:function(){!this._enabled&&this._hasAvailableLayers()&&(L.Handler.prototype.enable.call(this),this._featureGroup.on("layeradd",this._enableLayerEdit,this).on("layerremove",this._disableLayerEdit,this),this.fire("enabled",{handler:this.type}),this._map.fire("draw:editstart",{handler:this.type}))},disable:function(){this._enabled&&(this.fire("disabled",{handler:this.type}),this._map.fire("draw:editstop",{handler:this.type}),this._featureGroup.off("layeradd",this._enableLayerEdit,this).off("layerremove",this._disableLayerEdit,this),L.Handler.prototype.disable.call(this))},addHooks:function(){var t=this._map;t&&(t.getContainer().focus(),this._featureGroup.eachLayer(this._enableLayerEdit,this),this._tooltip=new L.Tooltip(this._map),this._tooltip.updateContent({text:L.drawLocal.edit.handlers.edit.tooltip.text,subtext:L.drawLocal.edit.handlers.edit.tooltip.subtext}),this._map.on("mousemove",this._onMouseMove,this))},removeHooks:function(){this._map&&(this._featureGroup.eachLayer(this._disableLayerEdit,this),this._uneditedLayerProps={},this._tooltip.dispose(),this._tooltip=null,this._map.off("mousemove",this._onMouseMove,this))},revertLayers:function(){this._featureGroup.eachLayer(function(t){this._revertLayer(t)},this)},save:function(){var t=new L.LayerGroup;this._featureGroup.eachLayer(function(e){e.edited&&(t.addLayer(e),e.edited=!1)}),this._map.fire("draw:edited",{layers:t})},_backupLayer:function(t){var e=L.Util.stamp(t);this._uneditedLayerProps[e]||(this._uneditedLayerProps[e]=t instanceof L.Polyline||t instanceof L.Polygon||t instanceof L.Rectangle?{latlngs:L.LatLngUtil.cloneLatLngs(t.getLatLngs())}:t instanceof L.Circle?{latlng:L.LatLngUtil.cloneLatLng(t.getLatLng()),radius:t.getRadius()}:{latlng:L.LatLngUtil.cloneLatLng(t.getLatLng())})},_revertLayer:function(t){var e=L.Util.stamp(t);t.edited=!1,this._uneditedLayerProps.hasOwnProperty(e)&&(t instanceof L.Polyline||t instanceof L.Polygon||t instanceof L.Rectangle?t.setLatLngs(this._uneditedLayerProps[e].latlngs):t instanceof L.Circle?(t.setLatLng(this._uneditedLayerProps[e].latlng),t.setRadius(this._uneditedLayerProps[e].radius)):t.setLatLng(this._uneditedLayerProps[e].latlng))},_toggleMarkerHighlight:function(t){if(t._icon){var e=t._icon;e.style.display="none",L.DomUtil.hasClass(e,"leaflet-edit-marker-selected")?(L.DomUtil.removeClass(e,"leaflet-edit-marker-selected"),this._offsetMarker(e,-4)):(L.DomUtil.addClass(e,"leaflet-edit-marker-selected"),this._offsetMarker(e,4)),e.style.display=""}},_offsetMarker:function(t,e){var i=parseInt(t.style.marginTop,10)-e,o=parseInt(t.style.marginLeft,10)-e;t.style.marginTop=i+"px",t.style.marginLeft=o+"px"},_enableLayerEdit:function(t){var e,i=t.layer||t.target||t,o=i instanceof L.Marker;(!o||i._icon)&&(this._backupLayer(i),this._selectedPathOptions&&(e=L.Util.extend({},this._selectedPathOptions),o?this._toggleMarkerHighlight(i):(i.options.previousOptions=i.options,i instanceof L.Circle||i instanceof L.Polygon||i instanceof L.Rectangle||(e.fill=!1),i.setStyle(e))),o?(i.dragging.enable(),i.on("dragend",this._onMarkerDragEnd)):i.editing.enable())},_disableLayerEdit:function(t){var e=t.layer||t.target||t;e.edited=!1,this._selectedPathOptions&&(e instanceof L.Marker?this._toggleMarkerHighlight(e):(e.setStyle(e.options.previousOptions),delete e.options.previousOptions)),e instanceof L.Marker?(e.dragging.disable(),e.off("dragend",this._onMarkerDragEnd,this)):e.editing.disable()},_onMarkerDragEnd:function(t){var e=t.target;e.edited=!0},_onMouseMove:function(t){this._tooltip.updatePosition(t.latlng)},_hasAvailableLayers:function(){return 0!==this._featureGroup.getLayers().length}}),L.EditToolbar.Delete=L.Handler.extend({statics:{TYPE:"remove"},includes:L.Mixin.Events,initialize:function(t,e){if(L.Handler.prototype.initialize.call(this,t),L.Util.setOptions(this,e),this._deletableLayers=this.options.featureGroup,!(this._deletableLayers instanceof L.FeatureGroup))throw Error("options.featureGroup must be a L.FeatureGroup");this.type=L.EditToolbar.Delete.TYPE},enable:function(){!this._enabled&&this._hasAvailableLayers()&&(L.Handler.prototype.enable.call(this),this._deletableLayers.on("layeradd",this._enableLayerDelete,this).on("layerremove",this._disableLayerDelete,this),this.fire("enabled",{handler:this.type}),this._map.fire("draw:editstart",{handler:this.type}))},disable:function(){this._enabled&&(L.Handler.prototype.disable.call(this),this._deletableLayers.off("layeradd",this._enableLayerDelete,this).off("layerremove",this._disableLayerDelete,this),this.fire("disabled",{handler:this.type}),this._map.fire("draw:editstop",{handler:this.type}))},addHooks:function(){var t=this._map;t&&(t.getContainer().focus(),this._deletableLayers.eachLayer(this._enableLayerDelete,this),this._deletedLayers=new L.layerGroup,this._tooltip=new L.Tooltip(this._map),this._tooltip.updateContent({text:L.drawLocal.edit.handlers.remove.tooltip.text}),this._map.on("mousemove",this._onMouseMove,this))},removeHooks:function(){this._map&&(this._deletableLayers.eachLayer(this._disableLayerDelete,this),this._deletedLayers=null,this._tooltip.dispose(),this._tooltip=null,this._map.off("mousemove",this._onMouseMove,this))},revertLayers:function(){this._deletedLayers.eachLayer(function(t){this._deletableLayers.addLayer(t)},this)},save:function(){this._map.fire("draw:deleted",{layers:this._deletedLayers})},_enableLayerDelete:function(t){var e=t.layer||t.target||t;e.on("click",this._removeLayer,this)},_disableLayerDelete:function(t){var e=t.layer||t.target||t;e.off("click",this._removeLayer,this),this._deletedLayers.removeLayer(e)},_removeLayer:function(t){var e=t.layer||t.target||t;this._deletableLayers.removeLayer(e),this._deletedLayers.addLayer(e)},_onMouseMove:function(t){this._tooltip.updatePosition(t.latlng)},_hasAvailableLayers:function(){return 0!==this._deletableLayers.getLayers().length}})})(this,document);;/* Leaflet.Draw.Note Plugin  (depends on Leaflet.Draw)
   @kosjoli — 2013 MIT Licence						   */


L.Draw.Note = L.Draw.Rectangle.extend({
	statics: {
		TYPE: 'note'
	},

	options: {
		shapeOptions: {
			stroke: true,
			color: '#fff',
			weight: 10,
			opacity: 0.2,
			fill: true,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
			clickable: true
		},
		
		noteOptions: {}	
			
	},

	initialize: function (map, options) {

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
		
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Note.TYPE;
		this._name = 'L.Draw.Note';
		
		this._initialLabelText = L.drawLocal.draw.handlers.note.tooltip.start;

			

	},

	_drawShape: function (latlng) {

		if (!this._shape) {
			this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
		}
		

	},
	
	_fireCreatedEvent: function () {
		var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);		
		var note = new L.Note(this, this._map, this._shape.getBounds(), this.options.noteOptions, rectangle);	

		console.log('map.LeafletDrawEditEnabled = false 1');
		//map.LeafletDrawEditEnabled = false;
				
		this._map.fire('draw:note:created', { rectangleLayer: rectangle, noteLayer: note, layerType: this.type });
	}
		
});





L.Note = L.Handler.extend({
	includes: L.Mixin.Events,

	options: {
		fontFamily: 'Helvetica Neue',
		fontSize: 1.1,
		color: 'black',
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		opacity: 1,
		fontWeight: 200,
		margin: 0,
		paddingLeft: '10px',
		paddingRight: '10px',
		paddingTop: '10px',
		border: 0,
		position: 'absolute',
		borderRadius: '3px',
		boxShadow: '0 0 15px 0 rgba(0,0,0,0.3)',
		overflow: 'hidden',
		resize: 'none',
		zIndex: 10
	},
	
	initialize: function (thisParent, map, latLngBounds, options, rectangle) {

		this._rectangle = rectangle;
		this._rectangle._note = this;
		this._parent = thisParent;
		this._map = map;
		this._latLngBounds = latLngBounds;
		this._latlng = new L.LatLng(latLngBounds._northEast.lat, latLngBounds._southWest.lng);
		this._container = this._map._container;
		this._overlayPane = this._map._panes.overlayPane;
		this._popupPane = this._map._panes.popupPane;
		this._name = 'L.Note';
		this._initialZoom = rectangle._initialZoom || this._map.getZoom();

		// Merge default shapeOptions options with custom shapeOptions
		if (this.options && options.noteOptions) {
			options = L.Util.extend({}, this.options, options.noteOptions);
		}

		L.setOptions(this, options);

		L.Handler.prototype.initialize.call(this, this._map, options); // was L.Draw.Simpleshape...
		 
	},
	
	onAdd: function (map) {

		// create a DOM element and put it into one of the map panes
	        this._el = L.DomUtil.create('textarea', 'leaflet-draw-note-container');

	        // add styles from options
	        for (o in this.options) {
        		if (o === 'fontSize') { this._el.style[o] = this.options[o] + 'em'; continue; }	// add px to font-size value
        		if (o === 'value') { this._el.value = this.options[o]};
	       		
	       		try {
	       			this._el.style[o] = this.options[o];
	   		} catch(e) {
		   		console.log('IE8 style error:');
		   		console.log(o);
		   		if (o == 'backgroundColor') {
			   		this._el.style[o] = '#FFF';
			   		this._el.style.filter = 'alpha(opacity=80)';
		   		}
	   		}
	        }
	        
	        // disable by default, enable on edit
	        this._el.disabled = true; // works!
	        
	        // append to overlayPane
	        this._map.getPanes().overlayPane.appendChild(this._el);
	
	        // add a viewreset event listener for updating layer's position, do the latter
	        this._map.on('viewreset', this._reset, this);
	        this._map.on('zoomstart', this._zoomStart, this);
	        this._reset();
			
		// block popups when creating new note
		Wu.DomEvent.on(this._el, 'mousemove', function (e) {
			if (this._map._popup) { this._map._popup._close() };
		}, this);
		
		// add hooks
		this.addHooks();
			
	},

    	onRemove: function (map) {
	        // remove layer's DOM elements and listeners
	        this._map.getPanes().overlayPane.removeChild(this._el);
	        this._map.off('viewreset', this._reset, this);
    	},

	_zoomStart: function () {
		// fade out				
		this._el.style.opacity = 0;
		
	},

    	_reset: function () {
		// get fresh latlngs if edited	    
			this._latlng = this._rectangle._latlngs[1] || this._latlng;
		this._latLngBounds = this._rectangle.getBounds() || this._latLngBounds;
		
		// update layer's size
		var ne = this._map.latLngToLayerPoint(this._latLngBounds._northEast);
        	var sw = this._map.latLngToLayerPoint(this._latLngBounds._southWest);
		this._width = ne.x - sw.x;
		this._height = sw.y - ne.y;
        	this._el.style.height = this._height + 'px';
		this._el.style.width = this._width + 'px';

		// set zoomOffset
		this._zoomOffset = this._initialZoom - this._map.getZoom(); // either 0, -1 or +1 (if ±2, note not shown)

		// update layer's font-size
		if (this._zoomOffset == 0) {
			// then font-size should be default 
			this._fontScale = this.options.fontSize;
		}
		
		if (this._zoomOffset == -1) {
			// then font-size should be x2
			this._fontScale = this.options.fontSize * 2;
		}
		
		if (this._zoomOffset == 1) {
			// then font-size should be /2
			this._fontScale = this.options.fontSize / 2;
		}

		this._el.style.fontSize = this._fontScale + 'em';
		this._el.style.lineHeight = 1;
		
		// update layer's position
	        var pos = this._map.latLngToLayerPoint(this._latlng);
	        L.DomUtil.setPosition(this._el, pos);
			
		var dis = this;
		window.setTimeout( function () {	// javascript DOM bug hack
			dis._updateOpacity();
		}, 10);
			
			
			
			
			
    	},

	_updateOpacity: function () {
		
		// update layer opacity
		if (this._zoomOffset == 0) { 
				
			// fade in
			this._el.style.opacity = 1; 
			try {
				var pat = this;
				
				pat._rectangle._path.style.opacity = 1;
			} catch (e) { 
				window.dummy = this;
				window.dummy._rectangle._path.style.opacity = 1;
		
			};
		} else {
			
			var ofs = Math.abs(this._zoomOffset);
			ofs = ofs * 4;
			var op = (1 / (ofs));
			if (op < 0.2) { op = 0;}
			
			this._el.style.opacity = op;
									
			try {
				this._rectangle._path.style.opacity = op;
			} catch (e) { console.log(e);};				
		}

	},
	
	enable: function () {
		if (this._enabled) return; 

		L.Handler.prototype.enable.call(this);

		this.fire('enabled', { handler: this.type });

		this._map.fire('draw:drawstart', { layerType: this.type });
	},

	disable: function () {
		if (!this._enabled) return; 

		L.Handler.prototype.disable.call(this);

		this.fire('disabled', { handler: this.type });

		this._map.fire('draw:drawstop', { layerType: this.type });
	},

	addHooks: function () {
		var map = this._map;

		if (this._map) {
			L.DomUtil.disableTextSelection();

			this._map.getContainer().focus();

			this._tooltip = new L.Tooltip(this._map);

			L.DomEvent.addListener(this._container, 'keyup', this._cancelDrawing, this);
		}
	},

	removeHooks: function () {
		if (this._map) {
			L.DomUtil.enableTextSelection();

			this._tooltip.dispose();
			this._tooltip = null;

			L.DomEvent.removeListener(this._container, 'keyup', this._cancelDrawing);
		}
	},

	setOptions: function (options) {
		L.setOptions(this, options);
	},

	_fireCreatedEvent: function (layer) {
	},

	// Cancel drawing when the escape key is pressed
	_cancelDrawing: function (e) {
		if (e.keyCode === 27) this.disable();
	}
});






L.Edit = L.Edit || {};

L.Edit.Rectangle = L.Edit.SimpleShape.extend({
		
	options: {
                moveIcon: new L.DivIcon({
                        iconSize: new L.Point(8, 8),
                        className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move leaflet-edit-move-note'
                }),
                resizeIcon: new L.DivIcon({
                        iconSize: new L.Point(8, 8),
                        className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize leaflet-edit-resize-note'
                })
        },
		
        _createMoveMarker: function () {
                var bounds = this._shape.getBounds(),
                        center = bounds.getCenter();

                this._moveMarker = this._createMarker(center, this.options.moveIcon);
        },

        _createResizeMarker: function () {
                var corners = this._getCorners();

                this._resizeMarkers = [];

                for (var i = 0, l = corners.length; i < l; i++) {
                        this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
                        // Monkey in the corner index as we will need to know this for dragging
                        this._resizeMarkers[i]._cornerIndex = i;
                }
        },

        _onMarkerDragStart: function (e) {
        		
                L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this, e);

                // Save a reference to the opposite point
                var corners = this._getCorners(),
                        marker = e.target,
                        currentCornerIndex = marker._cornerIndex;

                this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];

                this._toggleCornerMarkers(0, currentCornerIndex);
        },

        _onMarkerDragEnd: function (e) {
                var marker = e.target,
                        bounds, center;

                // Reset move marker position to the center
                if (marker === this._moveMarker) {
                        bounds = this._shape.getBounds();
                        center = bounds.getCenter();

                        marker.setLatLng(center);
                }

                this._toggleCornerMarkers(1);

                this._repositionCornerMarkers();

                L.Edit.SimpleShape.prototype._onMarkerDragEnd.call(this, e);
        },

        _move: function (newCenter) {
                var latlngs = this._shape.getLatLngs(),
                        bounds = this._shape.getBounds(),
                        center = bounds.getCenter(),
                        offset, newLatLngs = [];

                // Offset the latlngs to the new center
                for (var i = 0, l = latlngs.length; i < l; i++) {
                        offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
                        newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
                }

                this._shape.setLatLngs(newLatLngs);

                // Reposition the resize markers
                this._repositionCornerMarkers();

                if (this._shape._note) {
		                
        		// Reposition Note textarea
			var corners = this._getCorners();
			var noteTopLeft = map.latLngToLayerPoint(corners[0]);
			L.DomUtil.setPosition(this._shape._note._el, noteTopLeft);
		}

        },

        _resize: function (latlng) {
                var bounds;

                // Update the shape based on the current position of this corner and the opposite point
                this._shape.setBounds(L.latLngBounds(latlng, this._oppositeCorner));

                // Reposition the move marker
                bounds = this._shape.getBounds();
                this._moveMarker.setLatLng(bounds.getCenter());
                
                
                if (this._shape._note) {
                	// Reposition Note textarea
			var corners = this._getCorners();
			var noteTopLeft = this._map.latLngToLayerPoint(corners[0]);
			var noteBottomRight = this._map.latLngToLayerPoint(corners[2]);
			var noteHeight = noteBottomRight.y - noteTopLeft.y;
			var noteWidth = noteBottomRight.x - noteTopLeft.x;

			this._shape._note._el.style.height = noteHeight + 'px';
			this._shape._note._el.style.width = noteWidth + 'px';
			L.DomUtil.setPosition(this._shape._note._el, noteTopLeft);
		}    
                
        },

        _getCorners: function () {
                var bounds = this._shape.getBounds(),
                        nw = bounds.getNorthWest(),
                        ne = bounds.getNorthEast(),
                        se = bounds.getSouthEast(),
                        sw = bounds.getSouthWest();

                return [nw, ne, se, sw];
        },

        _toggleCornerMarkers: function (opacity) {
                for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
                        this._resizeMarkers[i].setOpacity(opacity);
                }
        },

        _repositionCornerMarkers: function () {
                var corners = this._getCorners();

                for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
                        this._resizeMarkers[i].setLatLng(corners[i]);
                }
        }
});


L.Rectangle.addInitHook(function () {
        if (L.Edit.Rectangle) {
                this.editing = new L.Edit.Rectangle(this);

                if (this.options.editable) {
                        this.editing.enable();
                        console.log('map.LeafletDrawEditEnabled = true 7');
                        map.LeafletDrawEditEnabled = true;
                }
        }
        
        this.rectangle = true;
});







// add tooltip text to Note
L.drawLocal.draw.toolbar.buttons.note = 'Place a note';


L.drawLocal.draw.handlers.note = { tooltip : { start: 'Click map to place note' } }

// add Note to DrawToolbar
L.DrawToolbar.prototype.options.note = {};
L.DrawToolbar.prototype.addToolbar = function (map) {
		var container = L.DomUtil.create('div', 'leaflet-draw-section'),
				buttonIndex = 0,
				buttonClassPrefix = 'leaflet-draw-draw';

		this._toolbarContainer = L.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');

		if (this.options.polyline) {
				this._initModeHandler(
						new L.Draw.Polyline(map, this.options.polyline),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.polyline
				);
		}

		if (this.options.polygon) {
				this._initModeHandler(
						new L.Draw.Polygon(map, this.options.polygon),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.polygon
				);
		}

		if (this.options.rectangle) {
				this._initModeHandler(
						new L.Draw.Rectangle(map, this.options.rectangle),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.rectangle
				);
		}

		if (this.options.circle) {
				this._initModeHandler(
						new L.Draw.Circle(map, this.options.circle),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.circle
				);
		}

		if (this.options.marker) {
				this._initModeHandler(
						new L.Draw.Marker(map, this.options.marker),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.marker
				);
		}

		// added: note
		if (this.options.note) {
				this._initModeHandler(
						new L.Draw.Note(map, this.options.note),
						this._toolbarContainer,
						buttonIndex++,
						buttonClassPrefix,
						L.drawLocal.draw.toolbar.buttons.note
				);
		}

		// Save button index of the last button, -1 as we would have ++ after the last button
		this._lastButtonIndex = --buttonIndex;

		// Create the actions part of the toolbar
		this._actionsContainer = this._createActions([
				{
						title: L.drawLocal.draw.toolbar.actions.title,
						text: L.drawLocal.draw.toolbar.actions.text,
						callback: this.disable,
						context: this
				}
		]);

		// Add draw and cancel containers to the control container
		container.appendChild(this._toolbarContainer);
		container.appendChild(this._actionsContainer);

		return container;
}








L.EditToolbar.Edit = L.Handler.extend({
        statics: {
                TYPE: 'edit'
        },

        includes: L.Mixin.Events,

        initialize: function (map, options) {

        	L.Draw._editshortcut = this;	// in order to enable on Note add
        		
                L.Handler.prototype.initialize.call(this, map);

                // Set options to the default unless already set
                this._selectedPathOptions = options.selectedPathOptions;

                // Store the selectable layer group for ease of access
                this._featureGroup = options.featureGroup;

                if (!(this._featureGroup instanceof L.FeatureGroup)) {
                        throw new Error('options.featureGroup must be a L.FeatureGroup');
                }

                this._uneditedLayerProps = {};

                // Save the type so super can fire, need to do this as cannot do this.TYPE :(
                this.type = L.EditToolbar.Edit.TYPE;

        },

        enable: function () {
                if (this._enabled || !this._hasAvailableLayers()) {
                        return;
                }
                
		map.LeafletDrawEditEnabled = true;
                L.Handler.prototype.enable.call(this);

                this._featureGroup
                        .on('layeradd', this._enableLayerEdit, this)
                        .on('layerremove', this._disableLayerEdit, this);

                this.fire('enabled', {handler: this.type});
                this._map.fire('draw:editstart', { handler: this.type });
                
        },

        disable: function () {
                if (!this._enabled) return; 
                
                this.fire('disabled', {handler: this.type});
                this._map.fire('draw:editstop', { handler: this.type });

                this._featureGroup
                        .off('layeradd', this._enableLayerEdit, this)
                        .off('layerremove', this._disableLayerEdit, this);
				
                L.Handler.prototype.disable.call(this);
                
        },

        addHooks: function () {
                var map = this._map;

                if (map) {
                        map.getContainer().focus();

                        this._featureGroup.eachLayer(this._enableLayerEdit, this);

                        this._tooltip = new L.Tooltip(this._map);
                        this._tooltip.updateContent({
                                text: L.drawLocal.edit.handlers.edit.tooltip.text,
                                subtext: L.drawLocal.edit.handlers.edit.tooltip.subtext
                        });

                        this._map.on('mousemove', this._onMouseMove, this);
                }
        },

        removeHooks: function () {
                if (this._map) {
                        // Clean up selected layers.
                        this._featureGroup.eachLayer(this._disableLayerEdit, this);

                        // Clear the backups of the original layers
                        this._uneditedLayerProps = {};

                        this._tooltip.dispose();
                        this._tooltip = null;

                        this._map.off('mousemove', this._onMouseMove, this);
                }
        },

        revertLayers: function () {
                this._featureGroup.eachLayer(function (layer) {
                        this._revertLayer(layer);
                }, this);
        },

        save: function () {
                var editedLayers = new L.LayerGroup();
                this._featureGroup.eachLayer(function (layer) {
                        if (layer.edited) {
                                editedLayers.addLayer(layer);
                                layer.edited = false;
                        }
                });
                this._map.fire('draw:edited', {layers: editedLayers});
        },

        _backupLayer: function (layer) {
                var id = L.Util.stamp(layer);

                if (!this._uneditedLayerProps[id]) {
                        // Polyline, Polygon or Rectangle
                        if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                                this._uneditedLayerProps[id] = {
                                        latlngs: L.LatLngUtil.cloneLatLngs(layer.getLatLngs())
                                };
                        } else if (layer instanceof L.Circle) {
                                this._uneditedLayerProps[id] = {
                                        latlng: L.LatLngUtil.cloneLatLng(layer.getLatLng()),
                                        radius: layer.getRadius()
                                };
                        } else if (layer instanceof L.Note) {
								// todo?
                        } else if (layer instanceof L.GeoJSON) {

                        	console.log('is geojson, no backup');	//TODO!

                        } else { // Marker
                        	try {
                                this._uneditedLayerProps[id] = {
                                        latlng: L.LatLngUtil.cloneLatLng(layer.getLatLng())
                                };
                        	} catch (e) { console.log('cloenLatN', e)};
                        }
                }
        },

        _revertLayer: function (layer) {
                var id = L.Util.stamp(layer);
                layer.edited = false;
                if (this._uneditedLayerProps.hasOwnProperty(id)) {
                        // Polyline, Polygon or Rectangle
                        if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                                layer.setLatLngs(this._uneditedLayerProps[id].latlngs);
                        } else if (layer instanceof L.Circle) {
                                layer.setLatLng(this._uneditedLayerProps[id].latlng);
                                layer.setRadius(this._uneditedLayerProps[id].radius);
                        } else if (layer instanceof L.Note) {
                        
                        } else { // Marker
                                layer.setLatLng(this._uneditedLayerProps[id].latlng);
                        }
                }
        },

        _toggleMarkerHighlight: function (marker) {
                if (!marker._icon) return;
                
                // This is quite naughty, but I don't see another way of doing it. (short of setting a new icon)
                var icon = marker._icon;

                icon.style.display = 'none';

                if (L.DomUtil.hasClass(icon, 'leaflet-edit-marker-selected')) {
                        L.DomUtil.removeClass(icon, 'leaflet-edit-marker-selected');
                        // Offset as the border will make the icon move.
                        this._offsetMarker(icon, -4);

                } else {
                        L.DomUtil.addClass(icon, 'leaflet-edit-marker-selected');
                        // Offset as the border will make the icon move.
                        this._offsetMarker(icon, 4);
                }

                icon.style.display = '';
        },

        _offsetMarker: function (icon, offset) {
                var iconMarginTop = parseInt(icon.style.marginTop, 10) - offset,
                        iconMarginLeft = parseInt(icon.style.marginLeft, 10) - offset;

                icon.style.marginTop = iconMarginTop + 'px';
                icon.style.marginLeft = iconMarginLeft + 'px';
        },

        _enableLayerEdit: function (e) {
        
        	map.LeafletDrawEditEnabled = true;
        
                var layer = e.layer || e.target || e,
                        isMarker = layer instanceof L.Marker,
                        pathOptions;

                // Don't do anything if this layer is a marker but doesn't have an icon. Markers
                // should usually have icons. If using Leaflet.draw with Leafler.markercluster there
                // is a chance that a marker doesn't.				// or if L.Note
                if (isMarker && !layer._icon ) return;
                
				
		// enable textarea
		if (layer instanceof L.Note) {
			e._el.disabled = false;
			return;
		}
		
		
                // Back up this layer (if haven't before)
                this._backupLayer(layer);

                // Update layer style so appears editable
                if (this._selectedPathOptions) {
                        pathOptions = L.Util.extend({}, this._selectedPathOptions);

                        // market
                        if (isMarker) {
                                this._toggleMarkerHighlight(layer);

                        // geojson layer (with multiple _layers)
                        } else if (layer instanceof L.GeoJSON) {
                        	
                        	for (l in layer._layers) {
					
                        		// save styles
					var geolayer = layer._layers[l];
					geolayer.options.previousStyle = geolayer.getStyle();

					// set edit styyle
					geolayer.setStyle(pathOptions);
				}

                        } else {
                                layer.options.previousOptions = layer.options;

                                // Make sure that Polylines are not filled
                                if (!(layer instanceof L.Circle) && !(layer instanceof L.Polygon) && !(layer instanceof L.Rectangle)) {
                                        pathOptions.fill = false;
                                }

                                layer.setStyle(pathOptions);
                        }
                }

                if (isMarker) {
                        layer.dragging.enable();
                        layer.on('dragend', this._onMarkerDragEnd);
          
                } else if (layer instanceof L.GeoJSON && layer._layers) {
                	for (l in layer._layers) {
                		layer._layers[l].editing.enable();
                	}	
        	
        	} else {
                        layer.editing.enable();
                }
        },

        _disableLayerEdit: function (e) {
        	
                var layer = e.layer || e.target || e;
                layer.edited = false;

		// disable textarea
		if (layer instanceof L.Note) {
			e._el.disabled = true;
			return;
		}

                // Reset layer styles to that of before select
                if (this._selectedPathOptions) {
                        if (layer instanceof L.Marker) {
                                this._toggleMarkerHighlight(layer);
                        
                        } else if (layer instanceof L.GeoJSON && layer._layers) {
                        	console.log('reverting geojson styles!', layer);

                        	for (l in layer._layers) {
					var geolayer = layer._layers[l];
					geolayer.setStyle(geolayer.options.previousStyle);
					delete geolayer.options.previousStyle;
				}
                        	
                        } else {
                                // reset the layer style to what is was before being selected
                                layer.setStyle(layer.options.previousOptions);
                                // remove the cached options for the layer object
                                delete layer.options.previousOptions;
                        }
                }

                if (layer instanceof L.Marker) {
                        layer.dragging.disable();
                        layer.off('dragend', this._onMarkerDragEnd, this);
                
                } else if (layer instanceof L.GeoJSON && layer._layers) {
        		for (l in layer._layers) {
        			layer._layers[l].editing.disable();                			
        		}
                	
                } else {
                	
                        layer.editing.disable();
                }
        },

        _onMarkerDragEnd: function (e) {
                var layer = e.target;
                layer.edited = true;
        },

        _onMouseMove: function (e) {
                this._tooltip.updatePosition(e.latlng);
        },

        _hasAvailableLayers: function () {
                return this._featureGroup.getLayers().length !== 0;
        }
});






L.EditToolbar.Delete = L.Handler.extend({
        statics: {
                TYPE: 'remove' // not delete as delete is reserved in js
        },

        includes: L.Mixin.Events,

        initialize: function (map, options) {
                L.Handler.prototype.initialize.call(this, map);

                L.Util.setOptions(this, options);

                // Store the selectable layer group for ease of access
                this._deletableLayers = this.options.featureGroup;

                if (!(this._deletableLayers instanceof L.FeatureGroup)) {
                        throw new Error('options.featureGroup must be a L.FeatureGroup');
                }

                // Save the type so super can fire, need to do this as cannot do this.TYPE :(
                this.type = L.EditToolbar.Delete.TYPE;
        },

        enable: function () {
                if (this._enabled) { return; }

                L.Handler.prototype.enable.call(this);

                this._deletableLayers
                        .on('layeradd', this._enableLayerDelete, this)
                        .on('layerremove', this._disableLayerDelete, this);

                this.fire('enabled', { handler: this.type});
        },

        disable: function () {
                if (!this._enabled) { return; }

                L.Handler.prototype.disable.call(this);

                this._deletableLayers
                        .off('layeradd', this._enableLayerDelete, this)
                        .off('layerremove', this._disableLayerDelete, this);

                this.fire('disabled', { handler: this.type});
        },

        addHooks: function () {
                if (this._map) {
                        this._deletableLayers.eachLayer(this._enableLayerDelete, this);
                        this._deletedLayers = new L.layerGroup();

                        this._tooltip = new L.Tooltip(this._map);
                        this._tooltip.updateContent({ text: L.drawLocal.edit.handlers.remove.tooltip.text });

                        this._map.on('mousemove', this._onMouseMove, this);
                }
        },

        removeHooks: function () {
                if (this._map) {
                        this._deletableLayers.eachLayer(this._disableLayerDelete, this);
                        this._deletedLayers = null;

                        this._tooltip.dispose();
                        this._tooltip = null;

                        this._map.off('mousemove', this._onMouseMove, this);
                }
        },

        revertLayers: function () {
                // Iterate of the deleted layers and add them back into the featureGroup
                this._deletedLayers.eachLayer(function (layer) {
                        this._deletableLayers.addLayer(layer);
                }, this);
        },

        save: function () {
                this._map.fire('draw:deleted', { layers: this._deletedLayers });
                try { this._svgparent.style.zIndex = ''; } catch (e) {}
        },

        _enableLayerDelete: function (e) {
                var layer = e.layer || e.target || e;

		if (e._note) this._hideNote(e); 				
				
                layer.on('click', this._removeLayer, this);
        },
        
        _hideNote: function (e) {
		e._note._el.style.opacity = 0;	
		e._note._el.style.zIndex = 0;
		this._svgparent = e._path.parentNode.parentNode;
		this._svgparent.style.zIndex = 1;
        },
        
        _unhideNote: function (e) {	      
		e._note._el.style.opacity = 1;	
		e._note._el.style.zIndex = 1;
		e._path.parentNode.parentNode.style.zIndex = '';
        },

        _disableLayerDelete: function (e) {
                var layer = e.layer || e.target || e;
				
		if (e._note) {
				this._unhideNote(e);
				this._deletedLayers.removeLayer(e._note);
		}				
				
                layer.off('click', this._removeLayer, this);

                // Remove from the deleted layers so we can't accidently revert if the user presses cancel
                this._deletedLayers.removeLayer(layer);
        },

        _removeLayer: function (e) {

		if (e.target._note) {
			this._deletableLayers.removeLayer(e.target._note);
			this._deletedLayers.addLayer(e.target._note);
		}				
       		
                var layer = e.layer || e.target || e;

                this._deletableLayers.removeLayer(layer);

                this._deletedLayers.addLayer(layer);
        },

	_removeAllLayers: function (e) {
		var drawControl = Wu.app.MapPane._drawControlLayers;

		for (layer in map.myDrawnItems._layers) {			
			drawControl._deletableLayers.removeLayer(map.myDrawnItems._layers[layer]);
			drawControl._deletedLayers.addLayer(map.myDrawnItems._layers[layer]);
		}
		
	},
		
        _onMouseMove: function (e) {
                this._tooltip.updatePosition(e.latlng);
        }
});


L.Draw.Feature.prototype.enable = function () {

		map.LeafletDrawEditEnabled = true;
		
		if (this._enabled) { return; }

		L.Handler.prototype.enable.call(this);

		this.fire('enabled', { handler: this.type });

		this._map.fire('draw:drawstart', { layerType: this.type });
};

L.Draw.Feature.prototype.disable = function () {

		if (!this._enabled) { return; }

		L.Handler.prototype.disable.call(this);
		
		this.fire('disabled', { handler: this.type });
		
		this._map.fire('draw:drawstop', { layerType: this.type });	
};    


// add StyleEditor action to toolbar
L.Toolbar.prototype.getModeHandlers = function (map) {
	var featureGroup = this.options.featureGroup;
	return [
		{
			enabled: this.options.edit,
			handler: new L.EditToolbar.Edit(map, {
				featureGroup: featureGroup,
				selectedPathOptions: this.options.edit.selectedPathOptions
			}),
			title: L.drawLocal.edit.toolbar.buttons.edit
		},
		{
			enabled: this.options.remove,
			handler: new L.EditToolbar.Delete(map, {
				featureGroup: featureGroup
			}),
			title: L.drawLocal.edit.toolbar.buttons.remove
		},

		{
			enabled: true,
			handler: new L.EditToolbar.Style(map, {
				featureGroup: featureGroup,
				selectedPathOptions: this.options.edit.selectedPathOptions
			}),
			title: 'Style'

		}
	];
}

L.Toolbar.prototype.editStyle = function () {
	console.log('edit style!!!');

}

L.EditToolbar.Style = L.Handler.extend({

	initialize : function (map, options) {

		console.log('initialize Style');
		L.Handler.prototype.initialize.call(this, map);
	},

	enable : function () {

		console.log('enable style1');
	},

	disable : function () {

		console.log('disable style');

	}

});

// SVG includes:
// L.Path.getStyle
L.Path.include({
	getStyle : function () {
		
		if (this._renderer) return this._renderer._getStyle(this);		
		return this._getStyle(this);		
	},

	_getStyle : function (layer) {
		var path = layer._path,
		   style = {};

		style.color = path.getAttribute('stroke');
		style.opacity = parseFloat(path.getAttribute('stroke-opacity'));
		style.strokeWidth = parseFloat(path.getAttribute('stroke-width'));
		style.lineCap = path.getAttribute('stroke-linecap');
		style.lineJoin = path.getAttribute('stroke-linejoin');
		style.dashArray = path.getAttribute('stroke-dasharray');
		style.dashOffset = path.getAttribute('stroke-dashoffset');
		style.fill = true;
		style.fillColor = path.getAttribute('fill');
		style.fillOpacity = parseFloat(path.getAttribute('fill-opacity'));
		style.fillRule = path.getAttribute('fill-rule');
		style.pointerEvents = path.getAttribute('pointer-events');
		
		return style;
	}
});

	
;L.Map.include({

	// refresh map container size
	reframe: function (options) {
		if (!this._loaded) { return this; }
		this._sizeChanged = true;
		this.fire('moveend');
	}
});
;L.Control.StyleEditor = L.Control.extend({

    options: {
        position: 'topleft',
        enabled: false,
        colorRamp: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'],
        markerApi: 'http://api.tiles.mapbox.com/v3/marker/',
        markers: ['circle-stroked', 'circle', 'square-stroked', 'square', 'triangle-stroked', 'triangle', 'star-stroked', 'star', 'cross', 'marker-stroked', 'marker', 'religious-jewish', 'religious-christian', 'religious-muslim', 'cemetery', 'rocket', 'airport', 'heliport', 'rail', 'rail-metro', 'rail-light', 'bus', 'fuel', 'parking', 'parking-garage', 'airfield', 'roadblock', 'ferry', 'harbor', 'bicycle', 'park', 'park2', 'museum', 'lodging', 'monument', 'zoo', 'garden', 'campsite', 'theatre', 'art-gallery', 'pitch', 'soccer', 'america-football', 'tennis', 'basketball', 'baseball', 'golf', 'swimming', 'cricket', 'skiing', 'school', 'college', 'library', 'post', 'fire-station', 'town-hall', 'police', 'prison', 'embassy', 'beer', 'restaurant', 'cafe', 'shop', 'fast-food', 'bar', 'bank', 'grocery', 'cinema', 'pharmacy', 'hospital', 'danger', 'industrial', 'warehouse', 'commercial', 'building', 'place-of-worship', 'alcohol-shop', 'logging', 'oil-well', 'slaughterhouse', 'dam', 'water', 'wetland', 'disability', 'telephone', 'emergency-telephone', 'toilets', 'waste-basket', 'music', 'land-use', 'city', 'town', 'village', 'farm', 'bakery', 'dog-park', 'lighthouse', 'clothing-store', 'polling-place', 'playground', 'entrance', 'heart', 'london-underground', 'minefield', 'rail-underground', 'rail-above', 'camera', 'laundry', 'car', 'suitcase', 'hairdresser', 'chemist', 'mobilephone', 'scooter'],
        editlayers: [],
        openOnLeafletDraw: false,
        showTooltip: true
    },

    onAdd: function(map) {
        this.options.map = map;
        return this.createUi();
    },

    // added by ko.     todo: refactor into separate file, for unbreaking changes
    onRemove : function (map) {
        L.DomEvent.off(this.options.controlDiv, 'click', this.clickHandler, this);
        L.DomEvent.off(this.options.styleEditorDiv, 'mouseenter', this.disableLeafletActions, this);
        L.DomEvent.off(this.options.styleEditorDiv, 'mouseleave', this.enableLeafletActions, this);        
        this.disable();
        if (L.Control.Draw && this.options.openOnLeafletDraw) {
                this.options.map.off('draw:created', function(layer) {
                    this.initChangeStyle({
                        "target": layer.layer
                    });
                }, this);
        }
    },

    createUi: function() {
        var controlDiv = this.options.controlDiv = L.DomUtil.create('div', 'leaflet-control-styleeditor');
        var controlUI = this.options.controlUI = L.DomUtil.create('div', 'leaflet-control-styleeditor-interior', controlDiv);
        controlUI.title = 'Style Editor';

        var styleEditorDiv = this.options.styleEditorDiv = L.DomUtil.create('div', 'leaflet-styleeditor', this.options.map._container);
        this.options.styleEditorHeader = L.DomUtil.create('div', 'leaflet-styleeditor-header', styleEditorDiv);

        this.options.styleEditorUi = L.DomUtil.create('div', 'leaflet-styleeditor-interior', styleEditorDiv);

        this.addDomEvents();
        this.addLeafletDrawEvents();
        this.addButtons();

        return controlDiv;
    },

    addDomEvents: function() {
        L.DomEvent.on(this.options.controlDiv, 'click', this.clickHandler, this);
        L.DomEvent.on(this.options.styleEditorDiv, 'mouseenter', this.disableLeafletActions, this);
        L.DomEvent.on(this.options.styleEditorDiv, 'mouseleave', this.enableLeafletActions, this);
    },

    addLeafletDrawEvents: function() {
        if (L.Control.Draw) {
            if (this.options.openOnLeafletDraw) {
                this.options.map.on('draw:created', function(layer) {
                    this.initChangeStyle({
                        "target": layer.layer
                    });
                }, this);
            }
        }
    },

    addButtons: function() {
        var closeBtn = L.DomUtil.create('button', 'leaflet-styleeditor-button styleeditor-closeBtn', this.options.styleEditorHeader);
        var sizeToggleBtn = this.options.sizeToggleBtn = L.DomUtil.create('button', 'leaflet-styleeditor-button styleeditor-inBtn', this.options.styleEditorHeader);

        L.DomEvent.addListener(closeBtn, 'click', this.hideEditor, this);
        L.DomEvent.addListener(sizeToggleBtn, 'click', this.toggleEditorSize, this);
    },


    clickHandler: function(e) {
        this.options.enabled = !this.options.enabled;

        if (this.options.enabled) {
            this.enable();
        } else {
            L.DomUtil.removeClass(this.options.controlUI, 'enabled');
            this.disable();
        }
    },

    disableLeafletActions: function() {
        this.options.map.dragging.disable();
        this.options.map.touchZoom.disable();
        this.options.map.doubleClickZoom.disable();
        this.options.map.scrollWheelZoom.disable();
        this.options.map.boxZoom.disable();
        this.options.map.keyboard.disable();
    },

    enableLeafletActions: function() {
        this.options.map.dragging.enable();
        this.options.map.touchZoom.enable();
        this.options.map.doubleClickZoom.enable();
        this.options.map.scrollWheelZoom.enable();
        this.options.map.boxZoom.enable();
        this.options.map.keyboard.enable();
    },

    enable: function() {
        L.DomUtil.addClass(this.options.controlUI, "enabled");
        this.options.map.eachLayer(this.addEditClickEvents, this);

        this.createMouseTooltip();
    },

    disable: function() {
        this.options.editlayers.forEach(this.removeEditClickEvents, this);
        this.options.editlayers = [];
        this.hideEditor();

        this.removeMouseTooltip();
    },

    addEditClickEvents: function(layer) {
        if (layer._latlng || layer._latlngs) {
            var evt = layer.on('click', this.initChangeStyle, this);
            this.options.editlayers.push(evt);
        }
    },

    removeEditClickEvents: function(layer) {
        layer.off('click', this.initChangeStyle, this);
    },

    hideEditor: function() {
        L.DomUtil.removeClass(this.options.styleEditorDiv, 'editor-enabled');
    },

    toggleEditorSize: function() {
        if (L.DomUtil.hasClass(this.options.styleEditorDiv, 'leaflet-styleeditor-full')) {
            L.DomUtil.removeClass(this.options.styleEditorDiv, 'leaflet-styleeditor-full');
            L.DomUtil.removeClass(this.options.styleEditorUi, 'leaflet-styleeditor-full');
            L.DomUtil.removeClass(this.options.sizeToggleBtn, 'styleeditor-outBtn');
            L.DomUtil.addClass(this.options.sizeToggleBtn, 'styleeditor-inBtn');

        } else {
            L.DomUtil.addClass(this.options.styleEditorDiv, 'leaflet-styleeditor-full');
            L.DomUtil.addClass(this.options.styleEditorUi, 'leaflet-styleeditor-full');
            L.DomUtil.removeClass(this.options.sizeToggleBtn, 'styleeditor-inBtn');
            L.DomUtil.addClass(this.options.sizeToggleBtn, 'styleeditor-outBtn');
        }
    },

    showEditor: function() {
        var editorDiv = this.options.styleEditorDiv;
        if (!L.DomUtil.hasClass(editorDiv, 'editor-enabled')) {
            L.DomUtil.addClass(editorDiv, 'editor-enabled');
        }
    },

    initChangeStyle: function(e) {
        this.options.currentElement = e;

        this.showEditor();
        this.removeMouseTooltip();

        var layer = e.target;

        if (layer instanceof L.Marker) {
            //marker
            this.createMarkerForm(layer);
        } else {
            //geometry with normal styles
            this.createGeometryForm(layer);
        }

    },

    createGeometryForm: function(layer) {
        var styleForms = new L.StyleForms({
            colorRamp: this.options.colorRamp,
            styleEditorUi: this.options.styleEditorUi,
            currentElement: this.options.currentElement
        });

        styleForms.createGeometryForm();
    },

    createMarkerForm: function(layer) {
        var styleForms = new L.StyleForms({
            colorRamp: this.options.colorRamp,
            styleEditorUi: this.options.styleEditorUi,
            currentElement: this.options.currentElement,
            markerApi: this.options.markerApi,
            markers: this.options.markers
        });

        styleForms.createMarkerForm();
    },

    createMouseTooltip: function() {
        if (this.options.showTooltip) {
            var mouseTooltip = this.options.mouseTooltip = L.DomUtil.create('div', 'leaflet-styleeditor-mouseTooltip', document.body);
            mouseTooltip.innerHTML = 'Click on the element you want to style';

            L.DomEvent.addListener(window, 'mousemove', this.moveMouseTooltip, this);
        }

    },

    removeMouseTooltip: function() {
        L.DomEvent.removeListener(window, 'mousemove', this.moveMouseTooltip);

        if (this.options.mouseTooltip && this.options.mouseTooltip.parentNode) {
            this.options.mouseTooltip.parentNode.removeChild(this.options.mouseTooltip);
        }
    },

    moveMouseTooltip: function(e) {
        var x = e.clientX,
            y = e.clientY;
        this.options.mouseTooltip.style.top = (y + 15) + 'px';
        this.options.mouseTooltip.style.left = (x) + 'px';
    }


});

L.control.styleEditor = function(options) {
    return new L.Control.StyleEditor(options);
};
;/*
Style options based on:
- path: http://leafletjs.com/reference.html#path-options
- icon: http://leafletjs.com/reference.html#icon

Markers from:
- Maki Markers from mapbox: https://www.mapbox.com/maki/
*/

L.StyleForms = L.Class.extend({
    options: {
        currentMarkerStyle: {
            size: 'm',
            color: '48a'
        }
    },

    initialize: function(options) {
        L.setOptions(this, options);
    },

    clearForm: function() {
        this.options.styleEditorUi.innerHTML = '';
    },

    createGeometryForm: function() {
        this.clearForm();

        this.createColor();
        this.createOpacity();
        this.createStroke();

        //Polygons, Circles get the fill options
        if (this.options.currentElement.target instanceof L.Polygon){

            this.createFillColor();
            this.createFillOpacity();
        }

    },



    createMarkerForm: function() {
        this.clearForm();

        this.createIconUrl();
        this.createMarkerColor();
        this.createMarkerSize();
    },

    setNewMarker: function() {
        var markerStyle = this.options.currentMarkerStyle;

        if (markerStyle.size && markerStyle.icon && markerStyle.color) {
            var iconSize;
            switch (markerStyle.size) {
                case 's':
                    iconSize = [20, 50];
                    break;
                case 'm':
                    iconSize = [30, 70];
                    break;
                case 'l':
                    iconSize = [35, 90];
                    break;

            }

            var newIcon = new L.Icon({
                iconUrl: this.options.markerApi + 'pin-' + markerStyle.size + '-' + markerStyle.icon + '+' + markerStyle.color + '.png',
                iconSize: iconSize
            });
            var currentElement = this.options.currentElement.target;
            currentElement.setIcon(newIcon);
            this.fireChangeEvent(currentElement);
        }
    },

    createIconUrl: function() {
        var label = L.DomUtil.create('label', 'leaflet-styleeditor-label', this.options.styleEditorUi);
        label.innerHTML = 'Icon:';

        this.createSelectInput(this.options.styleEditorUi, function(e) {
            var value = e.target.value;
            this.options.currentMarkerStyle.icon = value;
            this.setNewMarker();
        }.bind(this), this.options.markers);

    },

    createMarkerColor: function() {
        var label = L.DomUtil.create('label', 'leaflet-styleeditor-label', this.options.styleEditorUi);
        label.innerHTML = 'Color:';

        this.createColorPicker(this.options.styleEditorUi, function(e) {
            var color = this.rgbToHex(e.target.style.backgroundColor);
            this.options.currentMarkerStyle.color = color.replace("#", "");
            this.setNewMarker();
        }.bind(this));

    },

    createMarkerSize: function() {

        var label = L.DomUtil.create('label', 'leaflet-styleeditor-label', this.options.styleEditorUi);
        label.innerHTML = 'Size:';

        var s = L.DomUtil.create('div', 'leaflet-styleeditor-sizeicon sizeicon-small', this.options.styleEditorUi);
        var m = L.DomUtil.create('div', 'leaflet-styleeditor-sizeicon sizeicon-medium', this.options.styleEditorUi);
        var l = L.DomUtil.create('div', 'leaflet-styleeditor-sizeicon sizeicon-large', this.options.styleEditorUi);

        L.DomEvent.addListener(s, 'click', function() {
            this.options.currentMarkerStyle.size = 's';
            this.setNewMarker();
        }, this);

        L.DomEvent.addListener(m, 'click', function() {
            this.options.currentMarkerStyle.size = 'm';
            this.setNewMarker();
        }, this);

        L.DomEvent.addListener(l, 'click', function() {
            this.options.currentMarkerStyle.size = 'l';
            this.setNewMarker();
        }, this);

    },

    createColor: function() {
        var label = L.DomUtil.create('label', 'leaflet-styleeditor-label', this.options.styleEditorUi);
        label.innerHTML = 'Color:';

        this.createColorPicker(this.options.styleEditorUi, function(e) {
            var color = this.rgbToHex(e.target.style.backgroundColor);
            this.setStyle('color', color);
        }.bind(this));
    },

    createStroke: function() {
        var label = L.DomUtil.create('label', 'leaflet-styleeditor-label', this.options.styleEditorUi);
        label.innerHTML = 'Line Stroke:';

        var stroke1 = L.DomUtil.create('div', 'leaflet-styleeditor-stroke', this.options.styleEditorUi);
        stroke1.style.backgroundPosition = "0px -75px";

        var stroke2 = L.DomUtil.create('div', 'leaflet-styleeditor-stroke', this.options.styleEditorUi);
        stroke2.style.backgroundPosition = "0px -95px";

        var stroke3 = L.DomUtil.create('div', 'leaflet-styleeditor-stroke', this.options.styleEditorUi);
        stroke3.style.backgroundPosition = "0px -115px";

        L.DomUtil.create('br', 'bla', this.options.styleEditorUi);

        L.DomEvent.addListener(stroke1, 'click', function(e) {
            this.setStyle('dashArray', '1');
        }, this);
        L.DomEvent.addListener(stroke2, 'click', function(e) {
            this.setStyle('dashArray', '10,10');
        }, this);
        L.DomEvent.addListener(stroke3, 'click', function(e) {
            this.setStyle('dashArray', '15, 10, 1, 10');
        }, this);
    },



    createOpacity: function() {
        var label = L.DomUtil.create('label', 'leaflet-styleeditor-label', this.options.styleEditorUi);
        label.innerHTML = 'Opacity:';

        this.createNumberInput(this.options.styleEditorUi, function(e) {
            var value = e.target.value;
            this.setStyle('opacity', value);
        }.bind(this), this.options.currentElement.target.options.opacity, 0, 1, 0.1);
    },

    createFillColor: function() {
        var label = L.DomUtil.create('label', 'leaflet-styleeditor-label', this.options.styleEditorUi);
        label.innerHTML = 'Fill Color:';

        this.createColorPicker(this.options.styleEditorUi, function(e) {
            var color = this.rgbToHex(e.target.style.backgroundColor);
            this.setStyle('fillColor', color);
        }.bind(this));
    },

    createFillOpacity: function() {
        var label = L.DomUtil.create('label', 'leaflet-styleeditor-label', this.options.styleEditorUi);
        label.innerHTML = 'Fill Opacity:';

        this.createNumberInput(this.options.styleEditorUi, function(e) {
            var value = e.target.value;
            this.setStyle('fillOpacity', value);
        }.bind(this), this.options.currentElement.target.options.fillOpacity, 0, 1, 0.1);

    },

    createColorPicker: function(parentDiv, callback) {
        var colorPickerDiv = L.DomUtil.create('div', 'leaflet-styleeditor-colorpicker', parentDiv);
        this.options.colorRamp.forEach(function(color) {
            var elem = L.DomUtil.create('div', 'leaflet-styleeditor-color', colorPickerDiv);
            elem.style.backgroundColor = color;

            L.DomEvent.addListener(elem, "click", callback, this);
        }, this);

        L.DomUtil.create('br', '', parentDiv);
        L.DomUtil.create('br', '', parentDiv);

        return colorPickerDiv;
    },

    createNumberInput: function(parentDiv, callback, value, min, max, step) {
        var numberInput = L.DomUtil.create('input', 'leaflet-styleeditor-input', parentDiv);
        numberInput.setAttribute('type', 'number');
        numberInput.setAttribute('value', value);
        numberInput.setAttribute('min', min);
        numberInput.setAttribute('max', max);
        numberInput.setAttribute('step', step);

        L.DomEvent.addListener(numberInput, 'change', callback, this);
        L.DomEvent.addListener(numberInput, 'keyup', callback, this);

        L.DomUtil.create('br', '', parentDiv);
        L.DomUtil.create('br', '', parentDiv);

        return numberInput;
    },

    createSelectInput: function(parentDiv, callback, options) {
        var selectBox = L.DomUtil.create('select', 'leaflet-styleeditor-select', parentDiv);

        options.forEach(function(option) {
            var selectOption = L.DomUtil.create('option', 'leaflet-styleeditor-option', selectBox);
            selectOption.setAttribute('value', option);
            selectOption.innerHTML = option;
        }, this);

        L.DomEvent.addListener(selectBox, 'change', callback, this);

        return selectBox;
    },

    setStyle: function(option, value) {
        var newStyle = {};
        newStyle[option] = value;
        var currentElement = this.options.currentElement.target;
        currentElement.setStyle(newStyle);
        this.fireChangeEvent(currentElement);
    },
    
    fireChangeEvent: function(element){
        this.options.currentElement.target._map.fireEvent('styleeditor:changed', element);
    },

    componentToHex: function(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    },

    rgbToHex: function(rgb) {
        rgb = rgb.substring(4).replace(")", "").split(",");
        return "#" + this.componentToHex(parseInt(rgb[0], 10)) + this.componentToHex(parseInt(rgb[1], 10)) + this.componentToHex(parseInt(rgb[2], 10));
    },



});
;!function(){function a(b){var c=a.modules[b];if(!c)throw new Error('failed to require "'+b+'"');return"exports"in c||"function"!=typeof c.definition||(c.client=c.component=!0,c.definition.call(this,c.exports={},c),delete c.definition),c.exports}a.modules={},a.register=function(b,c){a.modules[b]={definition:c}},a.define=function(b,c){a.modules[b]={exports:c}},a.register("component~emitter@1.1.2",function(a,b){function c(a){return a?d(a):void 0}function d(a){for(var b in c.prototype)a[b]=c.prototype[b];return a}b.exports=c,c.prototype.on=c.prototype.addEventListener=function(a,b){return this._callbacks=this._callbacks||{},(this._callbacks[a]=this._callbacks[a]||[]).push(b),this},c.prototype.once=function(a,b){function c(){d.off(a,c),b.apply(this,arguments)}var d=this;return this._callbacks=this._callbacks||{},c.fn=b,this.on(a,c),this},c.prototype.off=c.prototype.removeListener=c.prototype.removeAllListeners=c.prototype.removeEventListener=function(a,b){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var c=this._callbacks[a];if(!c)return this;if(1==arguments.length)return delete this._callbacks[a],this;for(var d,e=0;e<c.length;e++)if(d=c[e],d===b||d.fn===b){c.splice(e,1);break}return this},c.prototype.emit=function(a){this._callbacks=this._callbacks||{};var b=[].slice.call(arguments,1),c=this._callbacks[a];if(c){c=c.slice(0);for(var d=0,e=c.length;e>d;++d)c[d].apply(this,b)}return this},c.prototype.listeners=function(a){return this._callbacks=this._callbacks||{},this._callbacks[a]||[]},c.prototype.hasListeners=function(a){return!!this.listeners(a).length}}),a.register("dropzone",function(b,c){c.exports=a("dropzone/lib/dropzone.js")}),a.register("dropzone/lib/dropzone.js",function(b,c){(function(){var b,d,e,f,g,h,i,j,k={}.hasOwnProperty,l=function(a,b){function c(){this.constructor=a}for(var d in b)k.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},m=[].slice;d="undefined"!=typeof Emitter&&null!==Emitter?Emitter:a("component~emitter@1.1.2"),i=function(){},b=function(a){function b(a,d){var e,f,g;if(this.element=a,this.version=b.version,this.defaultOptions.previewTemplate=this.defaultOptions.previewTemplate.replace(/\n*/g,""),this.clickableElements=[],this.listeners=[],this.files=[],"string"==typeof this.element&&(this.element=document.querySelector(this.element)),!this.element||null==this.element.nodeType)throw new Error("Invalid dropzone element.");if(this.element.dropzone)throw new Error("Dropzone already attached.");if(b.instances.push(this),this.element.dropzone=this,e=null!=(g=b.optionsForElement(this.element))?g:{},this.options=c({},this.defaultOptions,e,null!=d?d:{}),this.options.forceFallback||!b.isBrowserSupported())return this.options.fallback.call(this);if(null==this.options.url&&(this.options.url=this.element.getAttribute("action")),!this.options.url)throw new Error("No URL provided.");if(this.options.acceptedFiles&&this.options.acceptedMimeTypes)throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");this.options.acceptedMimeTypes&&(this.options.acceptedFiles=this.options.acceptedMimeTypes,delete this.options.acceptedMimeTypes),this.options.method=this.options.method.toUpperCase(),(f=this.getExistingFallback())&&f.parentNode&&f.parentNode.removeChild(f),this.previewsContainer=this.options.previewsContainer?b.getElement(this.options.previewsContainer,"previewsContainer"):this.element,this.options.clickable&&(this.clickableElements=this.options.clickable===!0?[this.element]:b.getElements(this.options.clickable,"clickable")),this.init()}var c;return l(b,a),b.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached"],b.prototype.defaultOptions={url:null,method:"post",withCredentials:!1,parallelUploads:2,uploadMultiple:!1,maxFilesize:256,paramName:"file",createImageThumbnails:!0,maxThumbnailFilesize:10,thumbnailWidth:100,thumbnailHeight:100,maxFiles:null,params:{},clickable:!0,ignoreHiddenFiles:!0,acceptedFiles:null,acceptedMimeTypes:null,autoProcessQueue:!0,addRemoveLinks:!1,previewsContainer:null,dictDefaultMessage:"Drop files here to upload",dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",dictFallbackText:"Please use the fallback form below to upload your files like in the olden days.",dictFileTooBig:"File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",dictInvalidFileType:"You can't upload files of this type.",dictResponseError:"Server responded with {{statusCode}} code.",dictCancelUpload:"Cancel upload",dictCancelUploadConfirmation:"Are you sure you want to cancel this upload?",dictRemoveFile:"Remove file",dictRemoveFileConfirmation:null,dictMaxFilesExceeded:"You can not upload any more files.",accept:function(a,b){return b()},init:function(){return i},forceFallback:!1,fallback:function(){var a,c,d,e,f,g;for(this.element.className=""+this.element.className+" dz-browser-not-supported",g=this.element.getElementsByTagName("div"),e=0,f=g.length;f>e;e++)a=g[e],/(^| )dz-message($| )/.test(a.className)&&(c=a,a.className="dz-message");return c||(c=b.createElement('<div class="dz-message"><span></span></div>'),this.element.appendChild(c)),d=c.getElementsByTagName("span")[0],d&&(d.textContent=this.options.dictFallbackMessage),this.element.appendChild(this.getFallbackForm())},resize:function(a){var b,c,d;return b={srcX:0,srcY:0,srcWidth:a.width,srcHeight:a.height},c=a.width/a.height,d=this.options.thumbnailWidth/this.options.thumbnailHeight,a.height<this.options.thumbnailHeight||a.width<this.options.thumbnailWidth?(b.trgHeight=b.srcHeight,b.trgWidth=b.srcWidth):c>d?(b.srcHeight=a.height,b.srcWidth=b.srcHeight*d):(b.srcWidth=a.width,b.srcHeight=b.srcWidth/d),b.srcX=(a.width-b.srcWidth)/2,b.srcY=(a.height-b.srcHeight)/2,b},drop:function(){return this.element.classList.remove("dz-drag-hover")},dragstart:i,dragend:function(){return this.element.classList.remove("dz-drag-hover")},dragenter:function(){return this.element.classList.add("dz-drag-hover")},dragover:function(){return this.element.classList.add("dz-drag-hover")},dragleave:function(){return this.element.classList.remove("dz-drag-hover")},paste:i,reset:function(){return this.element.classList.remove("dz-started")},addedfile:function(a){var c,d,e,f,g,h,i,j,k,l,m,n,o;for(this.element===this.previewsContainer&&this.element.classList.add("dz-started"),a.previewElement=b.createElement(this.options.previewTemplate.trim()),a.previewTemplate=a.previewElement,this.previewsContainer.appendChild(a.previewElement),l=a.previewElement.querySelectorAll("[data-dz-name]"),f=0,i=l.length;i>f;f++)c=l[f],c.textContent=a.name;for(m=a.previewElement.querySelectorAll("[data-dz-size]"),g=0,j=m.length;j>g;g++)c=m[g],c.innerHTML=this.filesize(a.size);for(this.options.addRemoveLinks&&(a._removeLink=b.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'+this.options.dictRemoveFile+"</a>"),a.previewElement.appendChild(a._removeLink)),d=function(c){return function(d){return d.preventDefault(),d.stopPropagation(),a.status===b.UPLOADING?b.confirm(c.options.dictCancelUploadConfirmation,function(){return c.removeFile(a)}):c.options.dictRemoveFileConfirmation?b.confirm(c.options.dictRemoveFileConfirmation,function(){return c.removeFile(a)}):c.removeFile(a)}}(this),n=a.previewElement.querySelectorAll("[data-dz-remove]"),o=[],h=0,k=n.length;k>h;h++)e=n[h],o.push(e.addEventListener("click",d));return o},removedfile:function(a){var b;return null!=(b=a.previewElement)&&b.parentNode.removeChild(a.previewElement),this._updateMaxFilesReachedClass()},thumbnail:function(a,b){var c,d,e,f,g;for(a.previewElement.classList.remove("dz-file-preview"),a.previewElement.classList.add("dz-image-preview"),f=a.previewElement.querySelectorAll("[data-dz-thumbnail]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],c.alt=a.name,g.push(c.src=b);return g},error:function(a,b){var c,d,e,f,g;for(a.previewElement.classList.add("dz-error"),"String"!=typeof b&&b.error&&(b=b.error),f=a.previewElement.querySelectorAll("[data-dz-errormessage]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.textContent=b);return g},errormultiple:i,processing:function(a){return a.previewElement.classList.add("dz-processing"),a._removeLink?a._removeLink.textContent=this.options.dictCancelUpload:void 0},processingmultiple:i,uploadprogress:function(a,b){var c,d,e,f,g;for(f=a.previewElement.querySelectorAll("[data-dz-uploadprogress]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.style.width=""+b+"%");return g},totaluploadprogress:i,sending:i,sendingmultiple:i,success:function(a){return a.previewElement.classList.add("dz-success")},successmultiple:i,canceled:function(a){return this.emit("error",a,"Upload canceled.")},canceledmultiple:i,complete:function(a){return a._removeLink?a._removeLink.textContent=this.options.dictRemoveFile:void 0},completemultiple:i,maxfilesexceeded:i,maxfilesreached:i,previewTemplate:'<div class="dz-preview dz-file-preview">\n  <div class="dz-details">\n    <div class="dz-filename"><span data-dz-name></span></div>\n    <div class="dz-size" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-success-mark"><span>✔</span></div>\n  <div class="dz-error-mark"><span>✘</span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n</div>'},c=function(){var a,b,c,d,e,f,g;for(d=arguments[0],c=2<=arguments.length?m.call(arguments,1):[],f=0,g=c.length;g>f;f++){b=c[f];for(a in b)e=b[a],d[a]=e}return d},b.prototype.getAcceptedFiles=function(){var a,b,c,d,e;for(d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.accepted&&e.push(a);return e},b.prototype.getRejectedFiles=function(){var a,b,c,d,e;for(d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.accepted||e.push(a);return e},b.prototype.getQueuedFiles=function(){var a,c,d,e,f;for(e=this.files,f=[],c=0,d=e.length;d>c;c++)a=e[c],a.status===b.QUEUED&&f.push(a);return f},b.prototype.getUploadingFiles=function(){var a,c,d,e,f;for(e=this.files,f=[],c=0,d=e.length;d>c;c++)a=e[c],a.status===b.UPLOADING&&f.push(a);return f},b.prototype.init=function(){var a,c,d,e,f,g,h;for("form"===this.element.tagName&&this.element.setAttribute("enctype","multipart/form-data"),this.element.classList.contains("dropzone")&&!this.element.querySelector(".dz-message")&&this.element.appendChild(b.createElement('<div class="dz-default dz-message"><span>'+this.options.dictDefaultMessage+"</span></div>")),this.clickableElements.length&&(d=function(a){return function(){return a.hiddenFileInput&&document.body.removeChild(a.hiddenFileInput),a.hiddenFileInput=document.createElement("input"),a.hiddenFileInput.setAttribute("type","file"),(null==a.options.maxFiles||a.options.maxFiles>1)&&a.hiddenFileInput.setAttribute("multiple","multiple"),a.hiddenFileInput.className="dz-hidden-input",null!=a.options.acceptedFiles&&a.hiddenFileInput.setAttribute("accept",a.options.acceptedFiles),a.hiddenFileInput.style.visibility="hidden",a.hiddenFileInput.style.position="absolute",a.hiddenFileInput.style.top="0",a.hiddenFileInput.style.left="0",a.hiddenFileInput.style.height="0",a.hiddenFileInput.style.width="0",document.body.appendChild(a.hiddenFileInput),a.hiddenFileInput.addEventListener("change",function(){var b,c,e,f;if(c=a.hiddenFileInput.files,c.length)for(e=0,f=c.length;f>e;e++)b=c[e],a.addFile(b);return d()})}}(this))(),this.URL=null!=(g=window.URL)?g:window.webkitURL,h=this.events,e=0,f=h.length;f>e;e++)a=h[e],this.on(a,this.options[a]);return this.on("uploadprogress",function(a){return function(){return a.updateTotalUploadProgress()}}(this)),this.on("removedfile",function(a){return function(){return a.updateTotalUploadProgress()}}(this)),this.on("canceled",function(a){return function(b){return a.emit("complete",b)}}(this)),this.on("complete",function(a){return function(){return 0===a.getUploadingFiles().length&&0===a.getQueuedFiles().length?setTimeout(function(){return a.emit("queuecomplete")},0):void 0}}(this)),c=function(a){return a.stopPropagation(),a.preventDefault?a.preventDefault():a.returnValue=!1},this.listeners=[{element:this.element,events:{dragstart:function(a){return function(b){return a.emit("dragstart",b)}}(this),dragenter:function(a){return function(b){return c(b),a.emit("dragenter",b)}}(this),dragover:function(a){return function(b){var d;try{d=b.dataTransfer.effectAllowed}catch(e){}return b.dataTransfer.dropEffect="move"===d||"linkMove"===d?"move":"copy",c(b),a.emit("dragover",b)}}(this),dragleave:function(a){return function(b){return a.emit("dragleave",b)}}(this),drop:function(a){return function(b){return c(b),a.drop(b)}}(this),dragend:function(a){return function(b){return a.emit("dragend",b)}}(this)}}],this.clickableElements.forEach(function(a){return function(c){return a.listeners.push({element:c,events:{click:function(d){return c!==a.element||d.target===a.element||b.elementInside(d.target,a.element.querySelector(".dz-message"))?a.hiddenFileInput.click():void 0}}})}}(this)),this.enable(),this.options.init.call(this)},b.prototype.destroy=function(){var a;return this.disable(),this.removeAllFiles(!0),(null!=(a=this.hiddenFileInput)?a.parentNode:void 0)&&(this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),this.hiddenFileInput=null),delete this.element.dropzone,b.instances.splice(b.instances.indexOf(this),1)},b.prototype.updateTotalUploadProgress=function(){var a,b,c,d,e,f,g,h;if(d=0,c=0,a=this.getAcceptedFiles(),a.length){for(h=this.getAcceptedFiles(),f=0,g=h.length;g>f;f++)b=h[f],d+=b.upload.bytesSent,c+=b.upload.total;e=100*d/c}else e=100;return this.emit("totaluploadprogress",e,c,d)},b.prototype.getFallbackForm=function(){var a,c,d,e;return(a=this.getExistingFallback())?a:(d='<div class="dz-fallback">',this.options.dictFallbackText&&(d+="<p>"+this.options.dictFallbackText+"</p>"),d+='<input type="file" name="'+this.options.paramName+(this.options.uploadMultiple?"[]":"")+'" '+(this.options.uploadMultiple?'multiple="multiple"':void 0)+' /><input type="submit" value="Upload!"></div>',c=b.createElement(d),"FORM"!==this.element.tagName?(e=b.createElement('<form action="'+this.options.url+'" enctype="multipart/form-data" method="'+this.options.method+'"></form>'),e.appendChild(c)):(this.element.setAttribute("enctype","multipart/form-data"),this.element.setAttribute("method",this.options.method)),null!=e?e:c)},b.prototype.getExistingFallback=function(){var a,b,c,d,e,f;for(b=function(a){var b,c,d;for(c=0,d=a.length;d>c;c++)if(b=a[c],/(^| )fallback($| )/.test(b.className))return b},f=["div","form"],d=0,e=f.length;e>d;d++)if(c=f[d],a=b(this.element.getElementsByTagName(c)))return a},b.prototype.setupEventListeners=function(){var a,b,c,d,e,f,g;for(f=this.listeners,g=[],d=0,e=f.length;e>d;d++)a=f[d],g.push(function(){var d,e;d=a.events,e=[];for(b in d)c=d[b],e.push(a.element.addEventListener(b,c,!1));return e}());return g},b.prototype.removeEventListeners=function(){var a,b,c,d,e,f,g;for(f=this.listeners,g=[],d=0,e=f.length;e>d;d++)a=f[d],g.push(function(){var d,e;d=a.events,e=[];for(b in d)c=d[b],e.push(a.element.removeEventListener(b,c,!1));return e}());return g},b.prototype.disable=function(){var a,b,c,d,e;for(this.clickableElements.forEach(function(a){return a.classList.remove("dz-clickable")}),this.removeEventListeners(),d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(this.cancelUpload(a));return e},b.prototype.enable=function(){return this.clickableElements.forEach(function(a){return a.classList.add("dz-clickable")}),this.setupEventListeners()},b.prototype.filesize=function(a){var b;return a>=109951162777.6?(a/=109951162777.6,b="TiB"):a>=107374182.4?(a/=107374182.4,b="GiB"):a>=104857.6?(a/=104857.6,b="MiB"):a>=102.4?(a/=102.4,b="KiB"):(a=10*a,b="b"),"<strong>"+Math.round(a)/10+"</strong> "+b},b.prototype._updateMaxFilesReachedClass=function(){return null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(this.getAcceptedFiles().length===this.options.maxFiles&&this.emit("maxfilesreached",this.files),this.element.classList.add("dz-max-files-reached")):this.element.classList.remove("dz-max-files-reached")},b.prototype.drop=function(a){var b,c;a.dataTransfer&&(this.emit("drop",a),b=a.dataTransfer.files,b.length&&(c=a.dataTransfer.items,c&&c.length&&null!=c[0].webkitGetAsEntry?this._addFilesFromItems(c):this.handleFiles(b)))},b.prototype.paste=function(a){var b,c;if(null!=(null!=a&&null!=(c=a.clipboardData)?c.items:void 0))return this.emit("paste",a),b=a.clipboardData.items,b.length?this._addFilesFromItems(b):void 0},b.prototype.handleFiles=function(a){var b,c,d,e;for(e=[],c=0,d=a.length;d>c;c++)b=a[c],e.push(this.addFile(b));return e},b.prototype._addFilesFromItems=function(a){var b,c,d,e,f;for(f=[],d=0,e=a.length;e>d;d++)c=a[d],f.push(null!=c.webkitGetAsEntry&&(b=c.webkitGetAsEntry())?b.isFile?this.addFile(c.getAsFile()):b.isDirectory?this._addFilesFromDirectory(b,b.name):void 0:null!=c.getAsFile?null==c.kind||"file"===c.kind?this.addFile(c.getAsFile()):void 0:void 0);return f},b.prototype._addFilesFromDirectory=function(a,b){var c,d;return c=a.createReader(),d=function(a){return function(c){var d,e,f;for(e=0,f=c.length;f>e;e++)d=c[e],d.isFile?d.file(function(c){return a.options.ignoreHiddenFiles&&"."===c.name.substring(0,1)?void 0:(c.fullPath=""+b+"/"+c.name,a.addFile(c))}):d.isDirectory&&a._addFilesFromDirectory(d,""+b+"/"+d.name)}}(this),c.readEntries(d,function(a){return"undefined"!=typeof console&&null!==console&&"function"==typeof console.log?console.log(a):void 0})},b.prototype.accept=function(a,c){return a.size>1024*this.options.maxFilesize*1024?c(this.options.dictFileTooBig.replace("{{filesize}}",Math.round(a.size/1024/10.24)/100).replace("{{maxFilesize}}",this.options.maxFilesize)):b.isValidFile(a,this.options.acceptedFiles)?null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(c(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}",this.options.maxFiles)),this.emit("maxfilesexceeded",a)):this.options.accept.call(this,a,c):c(this.options.dictInvalidFileType)},b.prototype.addFile=function(a){return a.upload={progress:0,total:a.size,bytesSent:0},this.files.push(a),a.status=b.ADDED,this.emit("addedfile",a),this._enqueueThumbnail(a),this.accept(a,function(b){return function(c){return c?(a.accepted=!1,b._errorProcessing([a],c)):b.enqueueFile(a),b._updateMaxFilesReachedClass()}}(this))},b.prototype.enqueueFiles=function(a){var b,c,d;for(c=0,d=a.length;d>c;c++)b=a[c],this.enqueueFile(b);return null},b.prototype.enqueueFile=function(a){if(a.accepted=!0,a.status!==b.ADDED)throw new Error("This file can't be queued because it has already been processed or was rejected.");return a.status=b.QUEUED,this.options.autoProcessQueue?setTimeout(function(a){return function(){return a.processQueue()}}(this),0):void 0},b.prototype._thumbnailQueue=[],b.prototype._processingThumbnail=!1,b.prototype._enqueueThumbnail=function(a){return this.options.createImageThumbnails&&a.type.match(/image.*/)&&a.size<=1024*this.options.maxThumbnailFilesize*1024?(this._thumbnailQueue.push(a),setTimeout(function(a){return function(){return a._processThumbnailQueue()}}(this),0)):void 0},b.prototype._processThumbnailQueue=function(){return this._processingThumbnail||0===this._thumbnailQueue.length?void 0:(this._processingThumbnail=!0,this.createThumbnail(this._thumbnailQueue.shift(),function(a){return function(){return a._processingThumbnail=!1,a._processThumbnailQueue()}}(this)))},b.prototype.removeFile=function(a){return a.status===b.UPLOADING&&this.cancelUpload(a),this.files=j(this.files,a),this.emit("removedfile",a),0===this.files.length?this.emit("reset"):void 0},b.prototype.removeAllFiles=function(a){var c,d,e,f;for(null==a&&(a=!1),f=this.files.slice(),d=0,e=f.length;e>d;d++)c=f[d],(c.status!==b.UPLOADING||a)&&this.removeFile(c);return null},b.prototype.createThumbnail=function(a,b){var c;return c=new FileReader,c.onload=function(d){return function(){var e;return e=document.createElement("img"),e.onload=function(){var c,f,g,i,j,k,l,m;return a.width=e.width,a.height=e.height,g=d.options.resize.call(d,a),null==g.trgWidth&&(g.trgWidth=d.options.thumbnailWidth),null==g.trgHeight&&(g.trgHeight=d.options.thumbnailHeight),c=document.createElement("canvas"),f=c.getContext("2d"),c.width=g.trgWidth,c.height=g.trgHeight,h(f,e,null!=(j=g.srcX)?j:0,null!=(k=g.srcY)?k:0,g.srcWidth,g.srcHeight,null!=(l=g.trgX)?l:0,null!=(m=g.trgY)?m:0,g.trgWidth,g.trgHeight),i=c.toDataURL("image/png"),d.emit("thumbnail",a,i),null!=b?b():void 0},e.src=c.result}}(this),c.readAsDataURL(a)},b.prototype.processQueue=function(){var a,b,c,d;if(b=this.options.parallelUploads,c=this.getUploadingFiles().length,a=c,!(c>=b)&&(d=this.getQueuedFiles(),d.length>0)){if(this.options.uploadMultiple)return this.processFiles(d.slice(0,b-c));for(;b>a;){if(!d.length)return;this.processFile(d.shift()),a++}}},b.prototype.processFile=function(a){return this.processFiles([a])},b.prototype.processFiles=function(a){var c,d,e;for(d=0,e=a.length;e>d;d++)c=a[d],c.processing=!0,c.status=b.UPLOADING,this.emit("processing",c);return this.options.uploadMultiple&&this.emit("processingmultiple",a),this.uploadFiles(a)},b.prototype._getFilesWithXhr=function(a){var b,c;return c=function(){var c,d,e,f;for(e=this.files,f=[],c=0,d=e.length;d>c;c++)b=e[c],b.xhr===a&&f.push(b);return f}.call(this)},b.prototype.cancelUpload=function(a){var c,d,e,f,g,h,i;if(a.status===b.UPLOADING){for(d=this._getFilesWithXhr(a.xhr),e=0,g=d.length;g>e;e++)c=d[e],c.status=b.CANCELED;for(a.xhr.abort(),f=0,h=d.length;h>f;f++)c=d[f],this.emit("canceled",c);this.options.uploadMultiple&&this.emit("canceledmultiple",d)}else((i=a.status)===b.ADDED||i===b.QUEUED)&&(a.status=b.CANCELED,this.emit("canceled",a),this.options.uploadMultiple&&this.emit("canceledmultiple",[a]));return this.options.autoProcessQueue?this.processQueue():void 0},b.prototype.uploadFile=function(a){return this.uploadFiles([a])},b.prototype.uploadFiles=function(a){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;for(s=new XMLHttpRequest,t=0,x=a.length;x>t;t++)d=a[t],d.xhr=s;s.open(this.options.method,this.options.url,!0),s.withCredentials=!!this.options.withCredentials,p=null,f=function(b){return function(){var c,e,f;for(f=[],c=0,e=a.length;e>c;c++)d=a[c],f.push(b._errorProcessing(a,p||b.options.dictResponseError.replace("{{statusCode}}",s.status),s));return f}}(this),q=function(b){return function(c){var e,f,g,h,i,j,k,l,m;if(null!=c)for(f=100*c.loaded/c.total,g=0,j=a.length;j>g;g++)d=a[g],d.upload={progress:f,total:c.total,bytesSent:c.loaded};else{for(e=!0,f=100,h=0,k=a.length;k>h;h++)d=a[h],(100!==d.upload.progress||d.upload.bytesSent!==d.upload.total)&&(e=!1),d.upload.progress=f,d.upload.bytesSent=d.upload.total;if(e)return}for(m=[],i=0,l=a.length;l>i;i++)d=a[i],m.push(b.emit("uploadprogress",d,f,d.upload.bytesSent));return m}}(this),s.onload=function(c){return function(d){var e;if(a[0].status!==b.CANCELED&&4===s.readyState){if(p=s.responseText,s.getResponseHeader("content-type")&&~s.getResponseHeader("content-type").indexOf("application/json"))try{p=JSON.parse(p)}catch(g){d=g,p="Invalid JSON response from server."}return q(),200<=(e=s.status)&&300>e?c._finished(a,p,d):f()}}}(this),s.onerror=function(){return function(){return a[0].status!==b.CANCELED?f():void 0}}(this),o=null!=(D=s.upload)?D:s,o.onprogress=q,i={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&c(i,this.options.headers);for(g in i)h=i[g],s.setRequestHeader(g,h);if(e=new FormData,this.options.params){E=this.options.params;for(m in E)r=E[m],e.append(m,r)}for(u=0,y=a.length;y>u;u++)d=a[u],this.emit("sending",d,s,e);if(this.options.uploadMultiple&&this.emit("sendingmultiple",a,s,e),"FORM"===this.element.tagName)for(F=this.element.querySelectorAll("input, textarea, select, button"),v=0,z=F.length;z>v;v++)if(j=F[v],k=j.getAttribute("name"),l=j.getAttribute("type"),"SELECT"===j.tagName&&j.hasAttribute("multiple"))for(G=j.options,w=0,A=G.length;A>w;w++)n=G[w],n.selected&&e.append(k,n.value);else(!l||"checkbox"!==(H=l.toLowerCase())&&"radio"!==H||j.checked)&&e.append(k,j.value);for(C=0,B=a.length;B>C;C++)d=a[C],e.append(""+this.options.paramName+(this.options.uploadMultiple?"[]":""),d,d.name);return s.send(e)},b.prototype._finished=function(a,c,d){var e,f,g;for(f=0,g=a.length;g>f;f++)e=a[f],e.status=b.SUCCESS,this.emit("success",e,c,d),this.emit("complete",e);return this.options.uploadMultiple&&(this.emit("successmultiple",a,c,d),this.emit("completemultiple",a)),this.options.autoProcessQueue?this.processQueue():void 0},b.prototype._errorProcessing=function(a,c,d){var e,f,g;for(f=0,g=a.length;g>f;f++)e=a[f],e.status=b.ERROR,this.emit("error",e,c,d),this.emit("complete",e);return this.options.uploadMultiple&&(this.emit("errormultiple",a,c,d),this.emit("completemultiple",a)),this.options.autoProcessQueue?this.processQueue():void 0},b}(d),b.version="3.8.5",b.options={},b.optionsForElement=function(a){return a.getAttribute("id")?b.options[e(a.getAttribute("id"))]:void 0},b.instances=[],b.forElement=function(a){if("string"==typeof a&&(a=document.querySelector(a)),null==(null!=a?a.dropzone:void 0))throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");return a.dropzone},b.autoDiscover=!0,b.discover=function(){var a,c,d,e,f,g;for(document.querySelectorAll?d=document.querySelectorAll(".dropzone"):(d=[],a=function(a){var b,c,e,f;for(f=[],c=0,e=a.length;e>c;c++)b=a[c],f.push(/(^| )dropzone($| )/.test(b.className)?d.push(b):void 0);return f},a(document.getElementsByTagName("div")),a(document.getElementsByTagName("form"))),g=[],e=0,f=d.length;f>e;e++)c=d[e],g.push(b.optionsForElement(c)!==!1?new b(c):void 0);return g},b.blacklistedBrowsers=[/opera.*Macintosh.*version\/12/i],b.isBrowserSupported=function(){var a,c,d,e,f;if(a=!0,window.File&&window.FileReader&&window.FileList&&window.Blob&&window.FormData&&document.querySelector)if("classList"in document.createElement("a"))for(f=b.blacklistedBrowsers,d=0,e=f.length;e>d;d++)c=f[d],c.test(navigator.userAgent)&&(a=!1);else a=!1;else a=!1;return a},j=function(a,b){var c,d,e,f;for(f=[],d=0,e=a.length;e>d;d++)c=a[d],c!==b&&f.push(c);return f},e=function(a){return a.replace(/[\-_](\w)/g,function(a){return a.charAt(1).toUpperCase()})},b.createElement=function(a){var b;return b=document.createElement("div"),b.innerHTML=a,b.childNodes[0]},b.elementInside=function(a,b){if(a===b)return!0;for(;a=a.parentNode;)if(a===b)return!0;return!1},b.getElement=function(a,b){var c;if("string"==typeof a?c=document.querySelector(a):null!=a.nodeType&&(c=a),null==c)throw new Error("Invalid `"+b+"` option provided. Please provide a CSS selector or a plain HTML element.");return c},b.getElements=function(a,b){var c,d,e,f,g,h,i,j;if(a instanceof Array){e=[];try{for(f=0,h=a.length;h>f;f++)d=a[f],e.push(this.getElement(d,b))}catch(k){c=k,e=null}}else if("string"==typeof a)for(e=[],j=document.querySelectorAll(a),g=0,i=j.length;i>g;g++)d=j[g],e.push(d);else null!=a.nodeType&&(e=[a]);if(null==e||!e.length)throw new Error("Invalid `"+b+"` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");return e},b.confirm=function(a,b,c){return window.confirm(a)?b():null!=c?c():void 0},b.isValidFile=function(a,b){var c,d,e,f,g;if(!b)return!0;for(b=b.split(","),d=a.type,c=d.replace(/\/.*$/,""),f=0,g=b.length;g>f;f++)if(e=b[f],e=e.trim(),"."===e.charAt(0)){if(-1!==a.name.toLowerCase().indexOf(e.toLowerCase(),a.name.length-e.length))return!0}else if(/\/\*$/.test(e)){if(c===e.replace(/\/.*$/,""))return!0}else if(d===e)return!0;return!1},"undefined"!=typeof jQuery&&null!==jQuery&&(jQuery.fn.dropzone=function(a){return this.each(function(){return new b(this,a)})}),"undefined"!=typeof c&&null!==c?c.exports=b:window.Dropzone=b,b.ADDED="added",b.QUEUED="queued",b.ACCEPTED=b.QUEUED,b.UPLOADING="uploading",b.PROCESSING=b.UPLOADING,b.CANCELED="canceled",b.ERROR="error",b.SUCCESS="success",g=function(a){var b,c,d,e,f,g,h,i,j,k;for(h=a.naturalWidth,g=a.naturalHeight,c=document.createElement("canvas"),c.width=1,c.height=g,d=c.getContext("2d"),d.drawImage(a,0,0),e=d.getImageData(0,0,1,g).data,k=0,f=g,i=g;i>k;)b=e[4*(i-1)+3],0===b?f=i:k=i,i=f+k>>1;return j=i/g,0===j?1:j},h=function(a,b,c,d,e,f,h,i,j,k){var l;return l=g(b),a.drawImage(b,c,d,e,f,h,i,j,k/l)},f=function(a,b){var c,d,e,f,g,h,i,j,k;if(e=!1,k=!0,d=a.document,j=d.documentElement,c=d.addEventListener?"addEventListener":"attachEvent",i=d.addEventListener?"removeEventListener":"detachEvent",h=d.addEventListener?"":"on",f=function(c){return"readystatechange"!==c.type||"complete"===d.readyState?(("load"===c.type?a:d)[i](h+c.type,f,!1),!e&&(e=!0)?b.call(a,c.type||c):void 0):void 0},g=function(){var a;try{j.doScroll("left")}catch(b){return a=b,void setTimeout(g,50)}return f("poll")},"complete"!==d.readyState){if(d.createEventObject&&j.doScroll){try{k=!a.frameElement}catch(l){}k&&g()}return d[c](h+"DOMContentLoaded",f,!1),d[c](h+"readystatechange",f,!1),a[c](h+"load",f,!1)}},b._autoDiscoverFunction=function(){return b.autoDiscover?b.discover():void 0},f(window,b._autoDiscoverFunction)}).call(this)}),"object"==typeof exports?module.exports=a("dropzone"):"function"==typeof define&&define.amd?define([],function(){return a("dropzone")}):this.Dropzone=a("dropzone")}();
;(function(){var r,v=Object.prototype.toString;Array.isArray=Array.isArray||function(a){return"[object Array]"==v.call(a)};var s=String.prototype.trim,l;if(s)l=function(a){return null==a?"":s.call(a)};else{var n,p;/\S/.test("\u00a0")?(n=/^[\s\xA0]+/,p=/[\s\xA0]+$/):(n=/^\s+/,p=/\s+$/);l=function(a){return null==a?"":a.toString().replace(n,"").replace(p,"")}}var w={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},t={},u=function(){};u.prototype={otag:"{{",ctag:"}}",pragmas:{},buffer:[],pragmas_implemented:{"IMPLICIT-ITERATOR":!0},
context:{},render:function(a,c,b,d){d||(this.context=c,this.buffer=[]);if(this.includes("",a)){a=this.render_pragmas(a);var e=this.render_section(a,c,b);!1===e&&(e=this.render_tags(a,c,b,d));if(d)return e;this.sendLines(e)}else{if(d)return a;this.send(a)}},send:function(a){""!==a&&this.buffer.push(a)},sendLines:function(a){if(a){a=a.split("\n");for(var c=0;c<a.length;c++)this.send(a[c])}},render_pragmas:function(a){if(!this.includes("%",a))return a;var c=this,b=this.getCachedRegex("render_pragmas",
function(a,b){return RegExp(a+"%([\\w-]+) ?([\\w]+=[\\w]+)?"+b,"g")});return a.replace(b,function(a,b,g){if(!c.pragmas_implemented[b])throw{message:"This implementation of mustache doesn't understand the '"+b+"' pragma"};c.pragmas[b]={};g&&(a=g.split("="),c.pragmas[b][a[0]]=a[1]);return""})},render_partial:function(a,c,b){a=l(a);if(!b||void 0===b[a])throw{message:"unknown_partial '"+a+"'"};return!c||"object"!=typeof c[a]?this.render(b[a],c,b,!0):this.render(b[a],c[a],b,!0)},render_section:function(a,
c,b){if(!this.includes("#",a)&&!this.includes("^",a))return!1;var d=this,e=this.getCachedRegex("render_section",function(a,b){return RegExp("^([\\s\\S]*?)"+a+"(\\^|\\#)\\s*(.+)\\s*"+b+"\n*([\\s\\S]*?)"+a+"\\/\\s*\\3\\s*"+b+"\\s*([\\s\\S]*)$","g")});return a.replace(e,function(a,e,j,f,k,m){a=e?d.render_tags(e,c,b,!0):"";m=m?d.render(m,c,b,!0):"";var q;f=d.find(f,c);"^"===j?q=!f||Array.isArray(f)&&0===f.length?d.render(k,c,b,!0):"":"#"===j&&(q=Array.isArray(f)?d.map(f,function(a){return d.render(k,
d.create_context(a),b,!0)}).join(""):d.is_object(f)?d.render(k,d.create_context(f),b,!0):"function"==typeof f?f.call(c,k,function(a){return d.render(a,c,b,!0)}):f?d.render(k,c,b,!0):"");return a+q+m})},render_tags:function(a,c,b,d){var e=this,g=function(){return e.getCachedRegex("render_tags",function(a,b){return RegExp(a+"(=|!|>|&|\\{|%)?([^#\\^]+?)\\1?"+b+"+","g")})},h=g(),j=function(a,d,f){switch(d){case "!":return"";case "=":return e.set_delimiters(f),h=g(),"";case ">":return e.render_partial(f,
c,b);case "{":case "&":return e.find(f,c);default:return a=e.find(f,c),String(a).replace(/&(?!\w+;)|[<>"']/g,function(a){return w[a]||a})}};a=a.split("\n");for(var f=0;f<a.length;f++)a[f]=a[f].replace(h,j,this),d||this.send(a[f]);if(d)return a.join("\n")},set_delimiters:function(a){a=a.split(" ");this.otag=this.escape_regex(a[0]);this.ctag=this.escape_regex(a[1])},escape_regex:function(a){arguments.callee.sRE||(arguments.callee.sRE=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)","g"));
return a.replace(arguments.callee.sRE,"\\$1")},find:function(a,c){a=l(a);var b;if(a.match(/([a-z_]+)\./ig)){var d=this.walk_context(a,c);(!1===d||0===d||d)&&(b=d)}else!1===c[a]||0===c[a]||c[a]?b=c[a]:(!1===this.context[a]||0===this.context[a]||this.context[a])&&(b=this.context[a]);return"function"==typeof b?b.apply(c):void 0!==b?b:""},walk_context:function(a,c){for(var b=a.split("."),d=void 0!=c[b[0]]?c:this.context,e=d[b.shift()];void 0!=e&&0<b.length;)d=e,e=e[b.shift()];return"function"==typeof e?
e.apply(d):e},includes:function(a,c){return-1!=c.indexOf(this.otag+a)},create_context:function(a){if(this.is_object(a))return a;var c=".";this.pragmas["IMPLICIT-ITERATOR"]&&(c=this.pragmas["IMPLICIT-ITERATOR"].iterator);var b={};b[c]=a;return b},is_object:function(a){return a&&"object"==typeof a},map:function(a,c){if("function"==typeof a.map)return a.map(c);for(var b=[],d=a.length,e=0;e<d;e++)b.push(c(a[e]));return b},getCachedRegex:function(a,c){var b=t[this.otag];b||(b=t[this.otag]={});var d=b[this.ctag];
d||(d=b[this.ctag]={});(b=d[a])||(b=d[a]=c(this.otag,this.ctag));return b}};r={name:"mustache.js",version:"0.4.0",to_html:function(a,c,b,d){var e=new u;d&&(e.send=d);e.render(a,c||{},b);if(!d)return e.buffer.join("\n")}};(function(){function a(a){return"".trim?a.trim():a.replace(/^\s+/,"").replace(/\s+$/,"")}var c={VERSION:"0.10.2",templates:{},$:"undefined"!==typeof window?window.jQuery||window.Zepto||null:null,addTemplate:function(b,d){if("object"===typeof b)for(var e in b)this.addTemplate(e,b[e]);
else c[b]?console.error("Invalid name: "+b+"."):c.templates[b]?console.error('Template "'+b+'  " exists'):(c.templates[b]=d,c[b]=function(d,e){d=d||{};var j=r.to_html(c.templates[b],d,c.templates);return c.$&&!e?c.$(a(j)):j})},clearAll:function(){for(var a in c.templates)delete c[a];c.templates={}},refresh:function(){c.clearAll();c.grabTemplates()},grabTemplates:function(){var b,d,e=document.getElementsByTagName("script"),g,h=[];b=0;for(d=e.length;b<d;b++)if((g=e[b])&&g.innerHTML&&g.id&&("text/html"===
g.type||"text/x-icanhaz"===g.type))c.addTemplate(g.id,a(g.innerHTML)),h.unshift(g);b=0;for(d=h.length;b<d;b++)h[b].parentNode.removeChild(h[b])}};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=c),exports.ich=c):this.ich=c;"undefined"!==typeof document&&(c.$?c.$(function(){c.grabTemplates()}):document.addEventListener("DOMContentLoaded",function(){c.grabTemplates()},!0))})()})();
;!function(){function a(b,c,d){var e=a.resolve(b);if(null==e){d=d||b,c=c||"root";var f=new Error('Failed to require "'+d+'" from "'+c+'"');throw f.path=d,f.parent=c,f.require=!0,f}var g=a.modules[e];if(!g._resolving&&!g.exports){var h={};h.exports={},h.client=h.component=!0,g._resolving=!0,g.call(this,h.exports,a.relative(e),h),delete g._resolving,g.exports=h.exports}return g.exports}a.modules={},a.aliases={},a.resolve=function(b){"/"===b.charAt(0)&&(b=b.slice(1));for(var c=[b,b+".js",b+".json",b+"/index.js",b+"/index.json"],d=0;d<c.length;d++){var b=c[d];if(a.modules.hasOwnProperty(b))return b;if(a.aliases.hasOwnProperty(b))return a.aliases[b]}},a.normalize=function(a,b){var c=[];if("."!=b.charAt(0))return b;a=a.split("/"),b=b.split("/");for(var d=0;d<b.length;++d)".."==b[d]?a.pop():"."!=b[d]&&""!=b[d]&&c.push(b[d]);return a.concat(c).join("/")},a.register=function(b,c){a.modules[b]=c},a.alias=function(b,c){if(!a.modules.hasOwnProperty(b))throw new Error('Failed to alias "'+b+'", it does not exist');a.aliases[c]=b},a.relative=function(b){function c(a,b){for(var c=a.length;c--;)if(a[c]===b)return c;return-1}function d(c){var e=d.resolve(c);return a(e,b,c)}var e=a.normalize(b,"..");return d.resolve=function(d){var f=d.charAt(0);if("/"==f)return d.slice(1);if("."==f)return a.normalize(e,d);var g=b.split("/"),h=c(g,"deps")+1;return h||(h=0),d=g.slice(0,h+1).join("/")+"/deps/"+d},d.exists=function(b){return a.modules.hasOwnProperty(d.resolve(b))},d},a.register("component-classes/index.js",function(a,b,c){function d(a){if(!a)throw new Error("A DOM element reference is required");this.el=a,this.list=a.classList}var e=b("indexof"),f=/\s+/,g=Object.prototype.toString;c.exports=function(a){return new d(a)},d.prototype.add=function(a){if(this.list)return this.list.add(a),this;var b=this.array(),c=e(b,a);return~c||b.push(a),this.el.className=b.join(" "),this},d.prototype.remove=function(a){if("[object RegExp]"==g.call(a))return this.removeMatching(a);if(this.list)return this.list.remove(a),this;var b=this.array(),c=e(b,a);return~c&&b.splice(c,1),this.el.className=b.join(" "),this},d.prototype.removeMatching=function(a){for(var b=this.array(),c=0;c<b.length;c++)a.test(b[c])&&this.remove(b[c]);return this},d.prototype.toggle=function(a,b){return this.list?("undefined"!=typeof b?b!==this.list.toggle(a,b)&&this.list.toggle(a):this.list.toggle(a),this):("undefined"!=typeof b?b?this.add(a):this.remove(a):this.has(a)?this.remove(a):this.add(a),this)},d.prototype.array=function(){var a=this.el.className.replace(/^\s+|\s+$/g,""),b=a.split(f);return""===b[0]&&b.shift(),b},d.prototype.has=d.prototype.contains=function(a){return this.list?this.list.contains(a):!!~e(this.array(),a)}}),a.register("segmentio-extend/index.js",function(a,b,c){c.exports=function(a){for(var b,c=Array.prototype.slice.call(arguments,1),d=0;b=c[d];d++)if(b)for(var e in b)a[e]=b[e];return a}}),a.register("component-indexof/index.js",function(a,b,c){c.exports=function(a,b){if(a.indexOf)return a.indexOf(b);for(var c=0;c<a.length;++c)if(a[c]===b)return c;return-1}}),a.register("component-event/index.js",function(a){var b=window.addEventListener?"addEventListener":"attachEvent",c=window.removeEventListener?"removeEventListener":"detachEvent",d="addEventListener"!==b?"on":"";a.bind=function(a,c,e,f){return a[b](d+c,e,f||!1),e},a.unbind=function(a,b,e,f){return a[c](d+b,e,f||!1),e}}),a.register("timoxley-to-array/index.js",function(a,b,c){function d(a){return"[object Array]"===Object.prototype.toString.call(a)}c.exports=function(a){if("undefined"==typeof a)return[];if(null===a)return[null];if(a===window)return[window];if("string"==typeof a)return[a];if(d(a))return a;if("number"!=typeof a.length)return[a];if("function"==typeof a&&a instanceof Function)return[a];for(var b=[],c=0;c<a.length;c++)(Object.prototype.hasOwnProperty.call(a,c)||c in a)&&b.push(a[c]);return b.length?b:[]}}),a.register("javve-events/index.js",function(a,b){var c=b("event"),d=b("to-array");a.bind=function(a,b,e,f){a=d(a);for(var g=0;g<a.length;g++)c.bind(a[g],b,e,f)},a.unbind=function(a,b,e,f){a=d(a);for(var g=0;g<a.length;g++)c.unbind(a[g],b,e,f)}}),a.register("javve-get-by-class/index.js",function(a,b,c){c.exports=function(){return document.getElementsByClassName?function(a,b,c){return c?a.getElementsByClassName(b)[0]:a.getElementsByClassName(b)}:document.querySelector?function(a,b,c){return b="."+b,c?a.querySelector(b):a.querySelectorAll(b)}:function(a,b,c){var d=[],e="*";null==a&&(a=document);for(var f=a.getElementsByTagName(e),g=f.length,h=new RegExp("(^|\\s)"+b+"(\\s|$)"),i=0,j=0;g>i;i++)if(h.test(f[i].className)){if(c)return f[i];d[j]=f[i],j++}return d}}()}),a.register("javve-get-attribute/index.js",function(a,b,c){c.exports=function(a,b){var c=a.getAttribute&&a.getAttribute(b)||null;if(!c)for(var d=a.attributes,e=d.length,f=0;e>f;f++)void 0!==b[f]&&b[f].nodeName===b&&(c=b[f].nodeValue);return c}}),a.register("javve-natural-sort/index.js",function(a,b,c){c.exports=function(a,b,c){var d,e,f=/(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,g=/(^[ ]*|[ ]*$)/g,h=/(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,i=/^0x[0-9a-f]+$/i,j=/^0/,c=c||{},k=function(a){return c.insensitive&&(""+a).toLowerCase()||""+a},l=k(a).replace(g,"")||"",m=k(b).replace(g,"")||"",n=l.replace(f,"\x00$1\x00").replace(/\0$/,"").replace(/^\0/,"").split("\x00"),o=m.replace(f,"\x00$1\x00").replace(/\0$/,"").replace(/^\0/,"").split("\x00"),p=parseInt(l.match(i))||1!=n.length&&l.match(h)&&Date.parse(l),q=parseInt(m.match(i))||p&&m.match(h)&&Date.parse(m)||null,r=c.desc?-1:1;if(q){if(q>p)return-1*r;if(p>q)return 1*r}for(var s=0,t=Math.max(n.length,o.length);t>s;s++){if(d=!(n[s]||"").match(j)&&parseFloat(n[s])||n[s]||0,e=!(o[s]||"").match(j)&&parseFloat(o[s])||o[s]||0,isNaN(d)!==isNaN(e))return isNaN(d)?1:-1;if(typeof d!=typeof e&&(d+="",e+=""),e>d)return-1*r;if(d>e)return 1*r}return 0}}),a.register("javve-to-string/index.js",function(a,b,c){c.exports=function(a){return a=void 0===a?"":a,a=null===a?"":a,a=a.toString()}}),a.register("component-type/index.js",function(a,b,c){var d=Object.prototype.toString;c.exports=function(a){switch(d.call(a)){case"[object Date]":return"date";case"[object RegExp]":return"regexp";case"[object Arguments]":return"arguments";case"[object Array]":return"array";case"[object Error]":return"error"}return null===a?"null":void 0===a?"undefined":a!==a?"nan":a&&1===a.nodeType?"element":typeof a.valueOf()}}),a.register("list.js/index.js",function(a,b,c){!function(a,d){"use strict";var e=a.document,f=b("get-by-class"),g=b("extend"),h=b("indexof"),i=function(a,c,i){var j,k=this,l=b("./src/item")(k),m=b("./src/add-async")(k),n=b("./src/parse")(k);j={start:function(){k.listClass="list",k.searchClass="search",k.sortClass="sort",k.page=200,k.i=1,k.items=[],k.visibleItems=[],k.matchingItems=[],k.searched=!1,k.filtered=!1,k.handlers={updated:[]},k.plugins={},k.helpers={getByClass:f,extend:g,indexOf:h},g(k,c),k.listContainer="string"==typeof a?e.getElementById(a):a,k.listContainer&&(k.list=f(k.listContainer,k.listClass,!0),k.templater=b("./src/templater")(k),k.search=b("./src/search")(k),k.filter=b("./src/filter")(k),k.sort=b("./src/sort")(k),this.items(),k.update(),this.plugins())},items:function(){n(k.list),i!==d&&k.add(i)},plugins:function(){for(var a=0;a<k.plugins.length;a++){var b=k.plugins[a];k[b.name]=b,b.init(k)}}},this.add=function(a,b){if(b)return m(a,b),void 0;var c=[],e=!1;a[0]===d&&(a=[a]);for(var f=0,g=a.length;g>f;f++){var h=null;a[f]instanceof l?(h=a[f],h.reload()):(e=k.items.length>k.page?!0:!1,h=new l(a[f],d,e)),k.items.push(h),c.push(h)}return k.update(),c},this.show=function(a,b){return this.i=a,this.page=b,k.update(),k},this.remove=function(a,b,c){for(var d=0,e=0,f=k.items.length;f>e;e++)k.items[e].values()[a]==b&&(k.templater.remove(k.items[e],c),k.items.splice(e,1),f--,e--,d++);return k.update(),d},this.get=function(a,b){for(var c=[],d=0,e=k.items.length;e>d;d++){var f=k.items[d];f.values()[a]==b&&c.push(f)}return c},this.size=function(){return k.items.length},this.clear=function(){return k.templater.clear(),k.items=[],k},this.on=function(a,b){return k.handlers[a].push(b),k},this.off=function(a,b){var c=k.handlers[a],d=h(c,b);return d>-1&&c.splice(d,1),k},this.trigger=function(a){for(var b=k.handlers[a].length;b--;)k.handlers[a][b](k);return k},this.reset={filter:function(){for(var a=k.items,b=a.length;b--;)a[b].filtered=!1;return k},search:function(){for(var a=k.items,b=a.length;b--;)a[b].found=!1;return k}},this.update=function(){var a=k.items,b=a.length;k.visibleItems=[],k.matchingItems=[],k.templater.clear();for(var c=0;b>c;c++)a[c].matching()&&k.matchingItems.length+1>=k.i&&k.visibleItems.length<k.page?(a[c].show(),k.visibleItems.push(a[c]),k.matchingItems.push(a[c])):a[c].matching()?(k.matchingItems.push(a[c]),a[c].hide()):a[c].hide();return k.trigger("updated"),k},j.start()};c.exports=i}(window)}),a.register("list.js/src/search.js",function(a,b,c){var d=b("events"),e=b("get-by-class"),f=b("to-string");c.exports=function(a){var b,c,g,h,i={resetList:function(){a.i=1,a.templater.clear(),h=void 0},setOptions:function(a){2==a.length&&a[1]instanceof Array?c=a[1]:2==a.length&&"function"==typeof a[1]?h=a[1]:3==a.length&&(c=a[1],h=a[2])},setColumns:function(){c=void 0===c?i.toArray(a.items[0].values()):c},setSearchString:function(a){a=f(a).toLowerCase(),a=a.replace(/[-[\]{}()*+?.,\\^$|#]/g,"\\$&"),g=a},toArray:function(a){var b=[];for(var c in a)b.push(c);return b}},j={list:function(){for(var b=0,c=a.items.length;c>b;b++)j.item(a.items[b])},item:function(a){a.found=!1;for(var b=0,d=c.length;d>b;b++)if(j.values(a.values(),c[b]))return a.found=!0,void 0},values:function(a,c){return a.hasOwnProperty(c)&&(b=f(a[c]).toLowerCase(),""!==g&&b.search(g)>-1)?!0:!1},reset:function(){a.reset.search(),a.searched=!1}},k=function(b){return a.trigger("searchStart"),i.resetList(),i.setSearchString(b),i.setOptions(arguments),i.setColumns(),""===g?j.reset():(a.searched=!0,h?h(g,c):j.list()),a.update(),a.trigger("searchComplete"),a.visibleItems};return a.handlers.searchStart=a.handlers.searchStart||[],a.handlers.searchComplete=a.handlers.searchComplete||[],d.bind(e(a.listContainer,a.searchClass),"keyup",function(b){var c=b.target||b.srcElement,d=""===c.value&&!a.searched;d||k(c.value)}),d.bind(e(a.listContainer,a.searchClass),"input",function(a){var b=a.target||a.srcElement;""===b.value&&k("")}),a.helpers.toString=f,k}}),a.register("list.js/src/sort.js",function(a,b,c){var d=b("natural-sort"),e=b("classes"),f=b("events"),g=b("get-by-class"),h=b("get-attribute");c.exports=function(a){a.sortFunction=a.sortFunction||function(a,b,c){return c.desc="desc"==c.order?!0:!1,d(a.values()[c.valueName],b.values()[c.valueName],c)};var b={els:void 0,clear:function(){for(var a=0,c=b.els.length;c>a;a++)e(b.els[a]).remove("asc"),e(b.els[a]).remove("desc")},getOrder:function(a){var b=h(a,"data-order");return"asc"==b||"desc"==b?b:e(a).has("desc")?"asc":e(a).has("asc")?"desc":"asc"},getInSensitive:function(a,b){var c=h(a,"data-insensitive");b.insensitive="true"===c?!0:!1},setOrder:function(a){for(var c=0,d=b.els.length;d>c;c++){var f=b.els[c];if(h(f,"data-sort")===a.valueName){var g=h(f,"data-order");"asc"==g||"desc"==g?g==a.order&&e(f).add(a.order):e(f).add(a.order)}}}},c=function(){a.trigger("sortStart"),options={};var c=arguments[0].currentTarget||arguments[0].srcElement||void 0;c?(options.valueName=h(c,"data-sort"),b.getInSensitive(c,options),options.order=b.getOrder(c)):(options=arguments[1]||options,options.valueName=arguments[0],options.order=options.order||"asc",options.insensitive="undefined"==typeof options.insensitive?!0:options.insensitive),b.clear(),b.setOrder(options),options.sortFunction=options.sortFunction||a.sortFunction,a.items.sort(function(a,b){return options.sortFunction(a,b,options)}),a.update(),a.trigger("sortComplete")};return a.handlers.sortStart=a.handlers.sortStart||[],a.handlers.sortComplete=a.handlers.sortComplete||[],b.els=g(a.listContainer,a.sortClass),f.bind(b.els,"click",c),a.on("searchStart",b.clear),a.on("filterStart",b.clear),a.helpers.classes=e,a.helpers.naturalSort=d,a.helpers.events=f,a.helpers.getAttribute=h,c}}),a.register("list.js/src/item.js",function(a,b,c){c.exports=function(a){return function(b,c,d){var e=this;this._values={},this.found=!1,this.filtered=!1;var f=function(b,c,d){if(void 0===c)d?e.values(b,d):e.values(b);else{e.elm=c;var f=a.templater.get(e,b);e.values(f)}};this.values=function(b,c){if(void 0===b)return e._values;for(var d in b)e._values[d]=b[d];c!==!0&&a.templater.set(e,e.values())},this.show=function(){a.templater.show(e)},this.hide=function(){a.templater.hide(e)},this.matching=function(){return a.filtered&&a.searched&&e.found&&e.filtered||a.filtered&&!a.searched&&e.filtered||!a.filtered&&a.searched&&e.found||!a.filtered&&!a.searched},this.visible=function(){return e.elm.parentNode==a.list?!0:!1},f(b,c,d)}}}),a.register("list.js/src/templater.js",function(a,b,c){var d=b("get-by-class"),e=function(a){function b(b){if(void 0===b){for(var c=a.list.childNodes,d=0,e=c.length;e>d;d++)if(void 0===c[d].data)return c[d];return null}if(-1!==b.indexOf("<")){var f=document.createElement("div");return f.innerHTML=b,f.firstChild}return document.getElementById(a.item)}var c=b(a.item),e=this;this.get=function(a,b){e.create(a);for(var c={},f=0,g=b.length;g>f;f++){var h=d(a.elm,b[f],!0);c[b[f]]=h?h.innerHTML:""}return c},this.set=function(a,b){if(!e.create(a))for(var c in b)if(b.hasOwnProperty(c)){var f=d(a.elm,c,!0);f&&("IMG"===f.tagName&&""!==b[c]?f.src=b[c]:f.innerHTML=b[c])}},this.create=function(a){if(void 0!==a.elm)return!1;var b=c.cloneNode(!0);return b.removeAttribute("id"),a.elm=b,e.set(a,a.values()),!0},this.remove=function(b){a.list.removeChild(b.elm)},this.show=function(b){e.create(b),a.list.appendChild(b.elm)},this.hide=function(b){void 0!==b.elm&&b.elm.parentNode===a.list&&a.list.removeChild(b.elm)},this.clear=function(){if(a.list.hasChildNodes())for(;a.list.childNodes.length>=1;)a.list.removeChild(a.list.firstChild)}};c.exports=function(a){return new e(a)}}),a.register("list.js/src/filter.js",function(a,b,c){c.exports=function(a){return a.handlers.filterStart=a.handlers.filterStart||[],a.handlers.filterComplete=a.handlers.filterComplete||[],function(b){if(a.trigger("filterStart"),a.i=1,a.reset.filter(),void 0===b)a.filtered=!1;else{a.filtered=!0;for(var c=a.items,d=0,e=c.length;e>d;d++){var f=c[d];f.filtered=b(f)?!0:!1}}return a.update(),a.trigger("filterComplete"),a.visibleItems}}}),a.register("list.js/src/add-async.js",function(a,b,c){c.exports=function(a){return function(b,c,d){var e=b.splice(0,100);d=d||[],d=d.concat(a.add(e)),b.length>0?setTimeout(function(){addAsync(b,c,d)},10):(a.update(),c(d))}}}),a.register("list.js/src/parse.js",function(a,b,c){c.exports=function(a){var c=b("./item")(a),d=function(a){for(var b=a.childNodes,c=[],d=0,e=b.length;e>d;d++)void 0===b[d].data&&c.push(b[d]);return c},e=function(b,d){for(var e=0,f=b.length;f>e;e++)a.items.push(new c(d,b[e]))},f=function(b,c){var d=b.splice(0,100);e(d,c),b.length>0?setTimeout(function(){init.items.indexAsync(b,c)},10):a.update()};return function(){var b=d(a.list),c=a.valueNames;a.indexAsync?f(b,c):e(b,c)}}}),a.alias("component-classes/index.js","list.js/deps/classes/index.js"),a.alias("component-classes/index.js","classes/index.js"),a.alias("component-indexof/index.js","component-classes/deps/indexof/index.js"),a.alias("segmentio-extend/index.js","list.js/deps/extend/index.js"),a.alias("segmentio-extend/index.js","extend/index.js"),a.alias("component-indexof/index.js","list.js/deps/indexof/index.js"),a.alias("component-indexof/index.js","indexof/index.js"),a.alias("javve-events/index.js","list.js/deps/events/index.js"),a.alias("javve-events/index.js","events/index.js"),a.alias("component-event/index.js","javve-events/deps/event/index.js"),a.alias("timoxley-to-array/index.js","javve-events/deps/to-array/index.js"),a.alias("javve-get-by-class/index.js","list.js/deps/get-by-class/index.js"),a.alias("javve-get-by-class/index.js","get-by-class/index.js"),a.alias("javve-get-attribute/index.js","list.js/deps/get-attribute/index.js"),a.alias("javve-get-attribute/index.js","get-attribute/index.js"),a.alias("javve-natural-sort/index.js","list.js/deps/natural-sort/index.js"),a.alias("javve-natural-sort/index.js","natural-sort/index.js"),a.alias("javve-to-string/index.js","list.js/deps/to-string/index.js"),a.alias("javve-to-string/index.js","list.js/deps/to-string/index.js"),a.alias("javve-to-string/index.js","to-string/index.js"),a.alias("javve-to-string/index.js","javve-to-string/index.js"),a.alias("component-type/index.js","list.js/deps/type/index.js"),a.alias("component-type/index.js","type/index.js"),"object"==typeof exports?module.exports=a("list.js"):"function"==typeof define&&define.amd?define(function(){return a("list.js")}):this.List=a("list.js")}();;/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */


(function (factory){
	"use strict";

	if( typeof define === "function" && define.amd ){
		define(factory);
	}
	else if( typeof module != "undefined" && typeof module.exports != "undefined" ){
		module.exports = factory();
	}
	else {
		window["Sortable"] = factory();
	}
})(function (){
	"use strict";

	var
		  dragEl
		, ghostEl
		, rootEl
		, nextEl

		, lastEl
		, lastCSS
		, lastRect

		, activeGroup

		, tapEvt
		, touchEvt

		, expando = 'Sortable' + (new Date).getTime()

		, win = window
		, document = win.document
		, parseInt = win.parseInt
		, supportIEdnd = !!document.createElement('div').dragDrop

		, _silent = false

		, _createEvent = function (event/**String*/, item/**HTMLElement*/){
			var evt = document.createEvent('Event');
			evt.initEvent(event, true, true);
			evt.item = item;
			return evt;
		}

		, noop = function (){}
		, slice = [].slice

		, touchDragOverListeners = []
	;


	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}  [options]
	 * @constructor
	 */
	function Sortable(el, options){
		this.el = el; // root element
		this.options = options = (options || {});


		// Defaults
		options.group = options.group || Math.random();
		options.handle = options.handle || null;
		options.draggable = options.draggable || el.children[0] && el.children[0].nodeName || (/[uo]l/i.test(el.nodeName) ? 'li' : '*');
		options.ghostClass = options.ghostClass || 'sortable-ghost';

		options.onAdd = _bind(this, options.onAdd || noop);
		options.onUpdate = _bind(this, options.onUpdate || noop);
		options.onRemove = _bind(this, options.onRemove || noop);


		// Export group name
		el[expando] = options.group;


		// Bind all private methods
		for( var fn in this ){
			if( fn.charAt(0) === '_' ){
				this[fn] = _bind(this, this[fn]);
			}
		}


		// Bind events
		_on(el, 'add', options.onAdd);
		_on(el, 'update', options.onUpdate);
		_on(el, 'remove', options.onRemove);

		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		supportIEdnd && _on(el, 'selectstart', this._onTapStart);

		_on(el, 'dragover', this._onDragOver);
		_on(el, 'dragenter', this._onDragOver);

		touchDragOverListeners.push(this._onDragOver);
	}


	Sortable.prototype = {
		constructor: Sortable,


		_applyEffects: function (){
			_toggleClass(dragEl, this.options.ghostClass, true);
		},


		_onTapStart: function (evt/**Event|TouchEvent*/){
			console.log('_onTapStart', evt);
			var
				  touch = evt.touches && evt.touches[0]
				, target = (touch || evt).target
				, options =  this.options
				, el = this.el
			;

			console.log('el: ', el);



			if( options.handle ){
				target = _closest(target, options.handle, el);
				console.log('_onTapStart2');
			}
			console.log('_onTapStart3');

			if (options.targetWrapped) {
				console.log('targetWrapped!')
				target = target.parentNode;
			} else {
				target = _closest(target, options.draggable, el);
			}
			// IE 9 Support
			if( target && evt.type == 'selectstart' ){
				if( target.tagName != 'A' && target.tagName != 'IMG'){
					target.dragDrop();
				}
			}
			console.log('_onTapStart4');
			console.log('targert: ', target);
			console.log('dragEl: ', dragEl);
			console.log('el: ', el);
			console.log('target.parentNode: ', target.parentNode);

			if( target && !dragEl && (target.parentNode === el) ){
				console.log('_onTapStart5');
				tapEvt = evt;
				target.draggable = true;


				// Disable "draggable"
				_find(target, 'a', _disableDraggable);
				_find(target, 'img', _disableDraggable);


				if( touch ){
					// Touch device support
					tapEvt = {
						  target:  target
						, clientX: touch.clientX
						, clientY: touch.clientY
					};
					this._onDragStart(tapEvt, true);
					evt.preventDefault();
				}

				console.log('register dragstart listener');
				_on(this.el, 'dragstart', this._onDragStart);
				_on(this.el, 'dragend', this._onDrop);
				_on(document, 'dragover', _globalDragOver);


				try {
					if( document.selection ){
						document.selection.empty();
					} else {
						window.getSelection().removeAllRanges()
					}
				} catch (err){ }
			}
		},


		_emulateDragOver: function (){
			if( touchEvt ){
				_css(ghostEl, 'display', 'none');

				var
					  target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY)
					, parent = target
					, group = this.options.group
					, i = touchDragOverListeners.length
				;

				if( parent ){
					do {
						if( parent[expando] === group ){
							while( i-- ){
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}
							break;
						}

						target = parent; // store last element
					}
					while( parent = parent.parentNode );
				}

				_css(ghostEl, 'display', '');
			}
		},


		_onTouchMove: function (evt/**TouchEvent*/){
			if( tapEvt ){
				var
					  touch = evt.touches[0]
					, dx = touch.clientX - tapEvt.clientX
					, dy = touch.clientY - tapEvt.clientY
				;

				touchEvt = touch;
				_css(ghostEl, 'webkitTransform', 'translate3d('+dx+'px,'+dy+'px,0)');
			}
		},


		_onDragStart: function (evt/**Event*/, isTouch/**Boolean*/){
			console.log('_onDragStart');
			var
				  target = evt.target
				, dataTransfer = evt.dataTransfer
			;

			rootEl = this.el;
			dragEl = target;
			nextEl = target.nextSibling;
			activeGroup = this.options.group;

			if( isTouch ){
				var
					  rect = target.getBoundingClientRect()
					, css = _css(target)
					, ghostRect
				;

				ghostEl = target.cloneNode(true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');

				rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width*2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height*2 - ghostRect.height);

				// Bind touch events
				_on(document, 'touchmove', this._onTouchMove);
				_on(document, 'touchend', this._onDrop);

				this._loopId = setInterval(this._emulateDragOver, 150);
			}
			else {
				dataTransfer.effectAllowed = 'move';
				dataTransfer.setData('Text', target.textContent);

				_on(document, 'drop', this._onDrop);
			}

			setTimeout(this._applyEffects);
		},


		_onDragOver: function (evt/**Event*/){
			
			if( !_silent && (activeGroup === this.options.group) && (evt.rootEl === void 0 || evt.rootEl === this.el) ){
				var el = this.el;
				var target = _closest(evt.target, this.options.draggable, el);
				
				console.log('_onDragOver2');
				if( el.children.length === 0 || el.children[0] === ghostEl || (el === evt.target) && _ghostInBottom(el, evt) ){
					el.appendChild(dragEl);
				}
				else if( target && target !== dragEl && (target.parentNode[expando] !== void 0) ){
					if( lastEl !== target ){
						lastEl = target;
						lastCSS = _css(target);
						lastRect = target.getBoundingClientRect();
					}


					var
						  rect = lastRect
						, width = rect.right - rect.left
						, height = rect.bottom - rect.top
						, floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display)
						, skew = (floating ? (evt.clientX - rect.left)/width : (evt.clientY - rect.top)/height) > .5
						, isWide = (target.offsetWidth > dragEl.offsetWidth)
						, isLong = (target.offsetHeight > dragEl.offsetHeight)
						, nextSibling = target.nextSibling
						, after
					;

					_silent = true;
					setTimeout(_unsilent, 30);

					if( floating ){
						after = (target.previousElementSibling === dragEl) && !isWide || (skew > .5) && isWide
					} else {
						after = (target.nextElementSibling !== dragEl) && !isLong || (skew > .5) && isLong;
					}

					if( after && !nextSibling ){
						el.appendChild(dragEl);
					} else {
						target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
					}
				}
			}
		},


		_onDrop: function (evt/**Event*/){
			clearInterval(this._loopId);

			// Unbind events
			_off(document, 'drop', this._onDrop);
			_off(document, 'dragover', _globalDragOver);

			_off(this.el, 'dragend', this._onDrop);
			_off(this.el, 'dragstart', this._onDragStart);
			_off(this.el, 'selectstart', this._onTapStart);

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'touchend', this._onDrop);


			if( evt ){
				evt.preventDefault();
				evt.stopPropagation();

				if( ghostEl ){
					ghostEl.parentNode.removeChild(ghostEl);
				}

				if( dragEl ){
					_disableDraggable(dragEl);
					_toggleClass(dragEl, this.options.ghostClass, false);

					if( !rootEl.contains(dragEl) ){
						// Remove event
						rootEl.dispatchEvent(_createEvent('remove', dragEl));

						// Add event
						dragEl.dispatchEvent(_createEvent('add', dragEl));
					}
					else if( dragEl.nextSibling !== nextEl ){
						// Update event
						dragEl.dispatchEvent(_createEvent('update', dragEl));
					}
				}

				// Set NULL
				rootEl =
				dragEl =
				ghostEl =
				nextEl =

				tapEvt =
				touchEvt =

				lastEl =
				lastCSS =

				activeGroup = null;
			}
		},


		destroy: function (){
			var el = this.el, options = this.options;

			_off(el, 'add', options.onAdd);
			_off(el, 'update', options.onUpdate);
			_off(el, 'remove', options.onRemove);

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'selectstart', this._onTapStart);

			_off(el, 'dragover', this._onDragOver);
			_off(el, 'dragenter', this._onDragOver);

			//remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function(el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = null;
		}
	};


	function _bind(ctx, fn){
		var args = slice.call(arguments, 2);
		return	fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function (){
			return fn.apply(ctx, args.concat(slice.call(arguments)));
		};
	}


	function _closest(el, selector, ctx){
		if( selector === '*' ){
			return el;
		}
		else if( el ){
			ctx = ctx || document;
			selector = selector.split('.');

			var
				  tag = selector.shift().toUpperCase()
				, re = new RegExp('\\s('+selector.join('|')+')\\s', 'g')
			;

			do {
				if(
					   (tag === '' || el.nodeName == tag)
					&& (!selector.length || ((' '+el.className+' ').match(re) || []).length == selector.length)
				){
					return	el;
				}
			}
			while( el !== ctx && (el = el.parentNode) );
		}

		return	null;
	}


	function _globalDragOver(evt){
		evt.dataTransfer.dropEffect = 'move';
		evt.preventDefault();
	}


	function _on(el, event, fn){
		el.addEventListener(event, fn, false);
	}


	function _off(el, event, fn){
		el.removeEventListener(event, fn, false);
	}


	function _toggleClass(el, name, state){
		if( el ){
			if( el.classList ){
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' '+el.className+' ').replace(/\s+/g, ' ').replace(' '+name+' ', '');
				el.className = className + (state ? ' '+name : '')
			}
		}
	}


	function _css(el, prop, val){
		if( el && el.style ){
			if( val === void 0 ){
				if( document.defaultView && document.defaultView.getComputedStyle ){
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if( el.currentStyle ){
					val	= el.currentStyle;
				}
				return	prop === void 0 ? val : val[prop];
			} else {
				el.style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator){
		if( ctx ){
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
			if( iterator ){
				for( ; i < n; i++ ){
					iterator(list[i], i);
				}
			}
			return	list;
		}
		return	[];
	}


	function _disableDraggable(el){
		return el.draggable = false;
	}


	function _unsilent(){
		_silent = false;
	}


	function _ghostInBottom(el, evt){
		var last = el.lastElementChild.getBoundingClientRect();
		return evt.clientY - (last.top + last.height) > 5; // min delta
	}



	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		bind: _bind,
		closest: _closest,
		toggleClass: _toggleClass
	};


	Sortable.version = '0.1.9';

	// Export
	return	Sortable;
});
;(function(){function e(t,s,n){var i=e.resolve(t);if(null==i){n=n||t,s=s||"root";var o=Error('Failed to require "'+n+'" from "'+s+'"');throw o.path=n,o.parent=s,o.require=!0,o}var r=e.modules[i];if(!r._resolving&&!r.exports){var a={};a.exports={},a.client=a.component=!0,r._resolving=!0,r.call(this,a.exports,e.relative(i),a),delete r._resolving,r.exports=a.exports}return r.exports}e.modules={},e.aliases={},e.resolve=function(t){"/"===t.charAt(0)&&(t=t.slice(1));for(var s=[t,t+".js",t+".json",t+"/index.js",t+"/index.json"],n=0;s.length>n;n++){var t=s[n];if(e.modules.hasOwnProperty(t))return t;if(e.aliases.hasOwnProperty(t))return e.aliases[t]}},e.normalize=function(e,t){var s=[];if("."!=t.charAt(0))return t;e=e.split("/"),t=t.split("/");for(var n=0;t.length>n;++n)".."==t[n]?e.pop():"."!=t[n]&&""!=t[n]&&s.push(t[n]);return e.concat(s).join("/")},e.register=function(t,s){e.modules[t]=s},e.alias=function(t,s){if(!e.modules.hasOwnProperty(t))throw Error('Failed to alias "'+t+'", it does not exist');e.aliases[s]=t},e.relative=function(t){function s(e,t){for(var s=e.length;s--;)if(e[s]===t)return s;return-1}function n(s){var i=n.resolve(s);return e(i,t,s)}var i=e.normalize(t,"..");return n.resolve=function(n){var o=n.charAt(0);if("/"==o)return n.slice(1);if("."==o)return e.normalize(i,n);var r=t.split("/"),a=s(r,"deps")+1;return a||(a=0),n=r.slice(0,a+1).join("/")+"/deps/"+n},n.exists=function(t){return e.modules.hasOwnProperty(n.resolve(t))},n},e.register("component-event/index.js",function(e){var t=window.addEventListener?"addEventListener":"attachEvent",s=window.removeEventListener?"removeEventListener":"detachEvent",n="addEventListener"!==t?"on":"";e.bind=function(e,s,i,o){return e[t](n+s,i,o||!1),i},e.unbind=function(e,t,i,o){return e[s](n+t,i,o||!1),i}}),e.register("component-query/index.js",function(e,t,s){function n(e,t){return t.querySelector(e)}e=s.exports=function(e,t){return t=t||document,n(e,t)},e.all=function(e,t){return t=t||document,t.querySelectorAll(e)},e.engine=function(t){if(!t.one)throw Error(".one callback required");if(!t.all)throw Error(".all callback required");return n=t.one,e.all=t.all,e}}),e.register("component-matches-selector/index.js",function(e,t,s){function n(e,t){if(r)return r.call(e,t);for(var s=i.all(t,e.parentNode),n=0;s.length>n;++n)if(s[n]==e)return!0;return!1}var i=t("query"),o=Element.prototype,r=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.msMatchesSelector||o.oMatchesSelector;s.exports=n}),e.register("discore-closest/index.js",function(e,t,s){var n=t("matches-selector");s.exports=function(e,t,s,i){for(e=s?{parentNode:e}:e,i=i||document;(e=e.parentNode)&&e!==document;){if(n(e,t))return e;if(e===i)return}}}),e.register("component-delegate/index.js",function(e,t){var s=t("closest"),n=t("event");e.bind=function(e,t,i,o,r){return n.bind(e,i,function(n){var i=n.target||n.srcElement;n.delegateTarget=s(i,t,!0,e),n.delegateTarget&&o.call(e,n)},r)},e.unbind=function(e,t,s,i){n.unbind(e,t,s,i)}}),e.register("component-events/index.js",function(e,t,s){function n(e,t){if(!(this instanceof n))return new n(e,t);if(!e)throw Error("element required");if(!t)throw Error("object required");this.el=e,this.obj=t,this._events={}}function i(e){var t=e.split(/ +/);return{name:t.shift(),selector:t.join(" ")}}var o=t("event"),r=t("delegate");s.exports=n,n.prototype.sub=function(e,t,s){this._events[e]=this._events[e]||{},this._events[e][t]=s},n.prototype.bind=function(e,t){function s(){var e=[].slice.call(arguments).concat(h);l[t].apply(l,e)}var n=i(e),a=this.el,l=this.obj,c=n.name,t=t||"on"+c,h=[].slice.call(arguments,2);return n.selector?s=r.bind(a,n.selector,c,s):o.bind(a,c,s),this.sub(c,t,s),s},n.prototype.unbind=function(e,t){if(0==arguments.length)return this.unbindAll();if(1==arguments.length)return this.unbindAllOf(e);var s=this._events[e];if(s){var n=s[t];n&&o.unbind(this.el,e,n)}},n.prototype.unbindAll=function(){for(var e in this._events)this.unbindAllOf(e)},n.prototype.unbindAllOf=function(e){var t=this._events[e];if(t)for(var s in t)this.unbind(e,s)}}),e.register("component-indexof/index.js",function(e,t,s){s.exports=function(e,t){if(e.indexOf)return e.indexOf(t);for(var s=0;e.length>s;++s)if(e[s]===t)return s;return-1}}),e.register("component-classes/index.js",function(e,t,s){function n(e){if(!e)throw Error("A DOM element reference is required");this.el=e,this.list=e.classList}var i=t("indexof"),o=/\s+/,r=Object.prototype.toString;s.exports=function(e){return new n(e)},n.prototype.add=function(e){if(this.list)return this.list.add(e),this;var t=this.array(),s=i(t,e);return~s||t.push(e),this.el.className=t.join(" "),this},n.prototype.remove=function(e){if("[object RegExp]"==r.call(e))return this.removeMatching(e);if(this.list)return this.list.remove(e),this;var t=this.array(),s=i(t,e);return~s&&t.splice(s,1),this.el.className=t.join(" "),this},n.prototype.removeMatching=function(e){for(var t=this.array(),s=0;t.length>s;s++)e.test(t[s])&&this.remove(t[s]);return this},n.prototype.toggle=function(e,t){return this.list?(t!==void 0?t!==this.list.toggle(e,t)&&this.list.toggle(e):this.list.toggle(e),this):(t!==void 0?t?this.add(e):this.remove(e):this.has(e)?this.remove(e):this.add(e),this)},n.prototype.array=function(){var e=this.el.className.replace(/^\s+|\s+$/g,""),t=e.split(o);return""===t[0]&&t.shift(),t},n.prototype.has=n.prototype.contains=function(e){return this.list?this.list.contains(e):!!~i(this.array(),e)}}),e.register("component-emitter/index.js",function(e,t,s){function n(e){return e?i(e):void 0}function i(e){for(var t in n.prototype)e[t]=n.prototype[t];return e}s.exports=n,n.prototype.on=n.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks[e]=this._callbacks[e]||[]).push(t),this},n.prototype.once=function(e,t){function s(){n.off(e,s),t.apply(this,arguments)}var n=this;return this._callbacks=this._callbacks||{},s.fn=t,this.on(e,s),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=n.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var s=this._callbacks[e];if(!s)return this;if(1==arguments.length)return delete this._callbacks[e],this;for(var n,i=0;s.length>i;i++)if(n=s[i],n===t||n.fn===t){s.splice(i,1);break}return this},n.prototype.emit=function(e){this._callbacks=this._callbacks||{};var t=[].slice.call(arguments,1),s=this._callbacks[e];if(s){s=s.slice(0);for(var n=0,i=s.length;i>n;++n)s[n].apply(this,t)}return this},n.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks[e]||[]},n.prototype.hasListeners=function(e){return!!this.listeners(e).length}}),e.register("ui-component-mouse/index.js",function(e,t,s){function n(e,t){this.obj=t||{},this.el=e}var i=t("emitter"),o=t("event");s.exports=function(e,t){return new n(e,t)},i(n.prototype),n.prototype.bind=function(){function e(i){s.onmouseup&&s.onmouseup(i),o.unbind(document,"mousemove",t),o.unbind(document,"mouseup",e),n.emit("up",i)}function t(e){s.onmousemove&&s.onmousemove(e),n.emit("move",e)}var s=this.obj,n=this;return n.down=function(i){s.onmousedown&&s.onmousedown(i),o.bind(document,"mouseup",e),o.bind(document,"mousemove",t),n.emit("down",i)},o.bind(this.el,"mousedown",n.down),this},n.prototype.unbind=function(){o.unbind(this.el,"mousedown",this.down),this.down=null}}),e.register("abpetkov-percentage-calc/percentage-calc.js",function(e){e.isNumber=function(e){return"number"==typeof e?!0:!1},e.of=function(t,s){return e.isNumber(t)&&e.isNumber(s)?t/100*s:void 0},e.from=function(t,s){return e.isNumber(t)&&e.isNumber(s)?100*(t/s):void 0}}),e.register("abpetkov-closest-num/closest-num.js",function(e){e.find=function(e,t){var s=null,n=null,o=t[0];for(i=0;t.length>i;i++)s=Math.abs(e-o),n=Math.abs(e-t[i]),s>n&&(o=t[i]);return o}}),e.register("vesln-super/lib/super.js",function(e,t,s){function n(){var t=i.call(arguments);if(t.length)return"function"!=typeof t[0]?e.merge(t):(e.inherits.apply(null,t),void 0)}var i=Array.prototype.slice,e=s.exports=n;e.extend=function(t,s){var n=this,i=function(){return n.apply(this,arguments)};return e.merge([i,this]),e.inherits(i,this),t&&e.merge([i.prototype,t]),s&&e.merge([i,s]),i.extend=this.extend,i},e.inherits=function(e,t){e.super_=t,Object.create?e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}):(e.prototype=new t,e.prototype.constructor=e)},e.merge=function(e){for(var t=2===e.length?e.shift():{},s=null,n=0,i=e.length;i>n;n++){s=e[n];for(var o in s)s.hasOwnProperty(o)&&(t[o]=s[o])}return t}}),e.register("powerange/lib/powerange.js",function(e,t,s){var n=(t("./main"),t("./horizontal")),i=t("./vertical"),o={callback:function(){},decimal:!1,disable:!1,disableOpacity:.5,hideRange:!1,klass:"",min:0,max:100,start:null,step:null,vertical:!1};s.exports=function(e,t){t=t||{};for(var s in o)null==t[s]&&(t[s]=o[s]);return t.vertical?new i(e,t):new n(e,t)}}),e.register("powerange/lib/main.js",function(e,t,s){function n(e,t){return this instanceof n?(this.element=e,this.options=t||{},this.slider=this.create("span","range-bar"),null!==this.element&&"text"===this.element.type&&this.init(),void 0):new n(e,t)}var o=t("mouse"),r=t("events"),a=t("classes"),l=t("percentage-calc");s.exports=n,n.prototype.bindEvents=function(){this.handle=this.slider.querySelector(".range-handle"),this.touch=r(this.handle,this),this.touch.bind("touchstart","onmousedown"),this.touch.bind("touchmove","onmousemove"),this.touch.bind("touchend","onmouseup"),this.mouse=o(this.handle,this),this.mouse.bind()},n.prototype.hide=function(){this.element.style.display="none"},n.prototype.append=function(){var e=this.generate();this.insertAfter(this.element,e)},n.prototype.generate=function(){var e={handle:{type:"span",selector:"range-handle"},min:{type:"span",selector:"range-min"},max:{type:"span",selector:"range-max"},quantity:{type:"span",selector:"range-quantity"}};for(var t in e)if(e.hasOwnProperty(t)){var s=this.create(e[t].type,e[t].selector);this.slider.appendChild(s)}return this.slider},n.prototype.create=function(e,t){var s=document.createElement(e);return s.className=t,s},n.prototype.insertAfter=function(e,t){e.parentNode.insertBefore(t,e.nextSibling)},n.prototype.extraClass=function(e){this.options.klass&&a(this.slider).add(e)},n.prototype.setRange=function(e,t){"number"!=typeof e||"number"!=typeof t||this.options.hideRange||(this.slider.querySelector(".range-min").innerHTML=e,this.slider.querySelector(".range-max").innerHTML=t)},n.prototype.setValue=function(e,t){var s=l.from(parseFloat(e),t),n=l.of(s,this.options.max-this.options.min)+this.options.min,i=!1;n=this.options.decimal?Math.round(100*n)/100:Math.round(n),i=this.element.value!=n?!0:!1,this.element.value=n,this.options.callback(),i&&this.changeEvent()},n.prototype.step=function(e,t){var s=e-t,n=l.from(this.checkStep(this.options.step),this.options.max-this.options.min),o=l.of(n,s),r=[];for(i=0;s>=i;i+=o)r.push(i);return this.steps=r,this.steps},n.prototype.checkValues=function(e){this.options.min>e&&(this.options.start=this.options.min),e>this.options.max&&(this.options.start=this.options.max),this.options.min>=this.options.max&&(this.options.min=this.options.max)},n.prototype.checkStep=function(e){return 0>e&&(e=Math.abs(e)),this.options.step=e,this.options.step},n.prototype.disable=function(){(this.options.min==this.options.max||this.options.min>this.options.max||this.options.disable)&&(this.mouse.unbind(),this.touch.unbind(),this.slider.style.opacity=this.options.disableOpacity,a(this.handle).add("range-disabled"))},n.prototype.unselectable=function(e,t){a(this.slider).has("unselectable")||t!==!0?a(this.slider).remove("unselectable"):a(this.slider).add("unselectable")},n.prototype.changeEvent=function(){if("function"!=typeof Event&&document.fireEvent)this.element.fireEvent("onchange");else{var e=document.createEvent("HTMLEvents");e.initEvent("change",!1,!0),this.element.dispatchEvent(e)}},n.prototype.init=function(){this.hide(),this.append(),this.bindEvents(),this.extraClass(this.options.klass),this.checkValues(this.options.start),this.setRange(this.options.min,this.options.max),this.disable()}}),e.register("powerange/lib/horizontal.js",function(e,t,s){function n(){a.apply(this,arguments),this.options.step&&this.step(this.slider.offsetWidth,this.handle.offsetWidth),this.setStart(this.options.start)}var i=t("super"),o=t("closest-num"),r=t("percentage-calc"),a=t("./main");s.exports=n,i(n,a),n.prototype.setStart=function(e){var t=null===e?this.options.min:e,s=r.from(t-this.options.min,this.options.max-this.options.min)||0,n=r.of(s,this.slider.offsetWidth-this.handle.offsetWidth),i=this.options.step?o.find(n,this.steps):n;this.setPosition(i),this.setValue(this.handle.style.left,this.slider.offsetWidth-this.handle.offsetWidth)},n.prototype.setPosition=function(e){this.handle.style.left=e+"px",this.slider.querySelector(".range-quantity").style.width=e+"px"},n.prototype.onmousedown=function(e){e.touches&&(e=e.touches[0]),this.startX=e.clientX,this.handleOffsetX=this.handle.offsetLeft,this.restrictHandleX=this.slider.offsetWidth-this.handle.offsetWidth,this.unselectable(this.slider,!0)},n.prototype.onmousemove=function(e){e.preventDefault(),e.touches&&(e=e.touches[0]);var t=this.handleOffsetX+e.clientX-this.startX,s=this.steps?o.find(t,this.steps):t;0>=t?this.setPosition(0):t>=this.restrictHandleX?this.setPosition(this.restrictHandleX):this.setPosition(s),this.setValue(this.handle.style.left,this.slider.offsetWidth-this.handle.offsetWidth)},n.prototype.onmouseup=function(){this.unselectable(this.slider,!1)}}),e.register("powerange/lib/vertical.js",function(e,t,s){function n(){l.apply(this,arguments),o(this.slider).add("vertical"),this.options.step&&this.step(this.slider.offsetHeight,this.handle.offsetHeight),this.setStart(this.options.start)}var i=t("super"),o=t("classes"),r=t("closest-num"),a=t("percentage-calc"),l=t("./main");s.exports=n,i(n,l),n.prototype.setStart=function(e){var t=null===e?this.options.min:e,s=a.from(t-this.options.min,this.options.max-this.options.min)||0,n=a.of(s,this.slider.offsetHeight-this.handle.offsetHeight),i=this.options.step?r.find(n,this.steps):n;this.setPosition(i),this.setValue(this.handle.style.bottom,this.slider.offsetHeight-this.handle.offsetHeight)},n.prototype.setPosition=function(e){this.handle.style.bottom=e+"px",this.slider.querySelector(".range-quantity").style.height=e+"px"},n.prototype.onmousedown=function(e){e.touches&&(e=e.touches[0]),this.startY=e.clientY,this.handleOffsetY=this.slider.offsetHeight-this.handle.offsetHeight-this.handle.offsetTop,this.restrictHandleY=this.slider.offsetHeight-this.handle.offsetHeight,this.unselectable(this.slider,!0)},n.prototype.onmousemove=function(e){e.preventDefault(),e.touches&&(e=e.touches[0]);var t=this.handleOffsetY+this.startY-e.clientY,s=this.steps?r.find(t,this.steps):t;0>=t?this.setPosition(0):t>=this.restrictHandleY?this.setPosition(this.restrictHandleY):this.setPosition(s),this.setValue(this.handle.style.bottom,this.slider.offsetHeight-this.handle.offsetHeight)},n.prototype.onmouseup=function(){this.unselectable(this.slider,!1)}}),e.alias("component-events/index.js","powerange/deps/events/index.js"),e.alias("component-events/index.js","events/index.js"),e.alias("component-event/index.js","component-events/deps/event/index.js"),e.alias("component-delegate/index.js","component-events/deps/delegate/index.js"),e.alias("discore-closest/index.js","component-delegate/deps/closest/index.js"),e.alias("discore-closest/index.js","component-delegate/deps/closest/index.js"),e.alias("component-matches-selector/index.js","discore-closest/deps/matches-selector/index.js"),e.alias("component-query/index.js","component-matches-selector/deps/query/index.js"),e.alias("discore-closest/index.js","discore-closest/index.js"),e.alias("component-event/index.js","component-delegate/deps/event/index.js"),e.alias("component-classes/index.js","powerange/deps/classes/index.js"),e.alias("component-classes/index.js","classes/index.js"),e.alias("component-indexof/index.js","component-classes/deps/indexof/index.js"),e.alias("ui-component-mouse/index.js","powerange/deps/mouse/index.js"),e.alias("ui-component-mouse/index.js","mouse/index.js"),e.alias("component-emitter/index.js","ui-component-mouse/deps/emitter/index.js"),e.alias("component-event/index.js","ui-component-mouse/deps/event/index.js"),e.alias("abpetkov-percentage-calc/percentage-calc.js","powerange/deps/percentage-calc/percentage-calc.js"),e.alias("abpetkov-percentage-calc/percentage-calc.js","powerange/deps/percentage-calc/index.js"),e.alias("abpetkov-percentage-calc/percentage-calc.js","percentage-calc/index.js"),e.alias("abpetkov-percentage-calc/percentage-calc.js","abpetkov-percentage-calc/index.js"),e.alias("abpetkov-closest-num/closest-num.js","powerange/deps/closest-num/closest-num.js"),e.alias("abpetkov-closest-num/closest-num.js","powerange/deps/closest-num/index.js"),e.alias("abpetkov-closest-num/closest-num.js","closest-num/index.js"),e.alias("abpetkov-closest-num/closest-num.js","abpetkov-closest-num/index.js"),e.alias("vesln-super/lib/super.js","powerange/deps/super/lib/super.js"),e.alias("vesln-super/lib/super.js","powerange/deps/super/index.js"),e.alias("vesln-super/lib/super.js","super/index.js"),e.alias("vesln-super/lib/super.js","vesln-super/index.js"),e.alias("powerange/lib/powerange.js","powerange/index.js"),"object"==typeof exports?module.exports=e("powerange"):"function"==typeof define&&define.amd?define([],function(){return e("powerange")}):this.Powerange=e("powerange")})();;// The MIT License (MIT)

// Copyright (c) 2014 Vladimir Agafonkin. Original: https://github.com/Leaflet/Leaflet/tree/master/src/core
// Copyright (c) 2014 @kosjoli            Fork: https://github.com/knutole/grande.js/

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// _______grande.js____________________________________________________________________________ 
// G.Class powers the OOP facilities of the library. 
// Taken from Class.js in Leaflet.js by Vladimir Agafonkin, @LeafletJS

G = {};
G.Class = function () {};
G.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		if (this._initHooks.length) {
			this.callInitHooks();
		}
	};

	// jshint camelcase: false
	var parentProto = NewClass.__super__ = this.prototype;

	var proto = G.Util.create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		G.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		G.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = G.Util.extend(G.Util.create(proto.options), props.options);
	}

	// mix given properties into the prototype
	G.extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};

G.Util = {
	// extend an object with properties of one or more other objects
	extend: function (dest) {
		var sources = Array.prototype.slice.call(arguments, 1),
		    i, j, len, src;

		for (j = 0, len = sources.length; j < len; j++) {
			src = sources[j];
			for (i in src) {
				dest[i] = src[i];
			}
		}
		return dest;
	},

	// create an object from a given prototype
	create: Object.create || (function () {
		function F() {}
		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})(),

	// bind a function to be called with a given context
	bind: function (fn, obj) {
		var slice = Array.prototype.slice;

		if (fn.bind) {
			return fn.bind.apply(fn, slice.call(arguments, 1));
		}

		var args = slice.call(arguments, 2);

		return function () {
			return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
		};
	},

	// set options to an object, inheriting parent's options as well
	setOptions: function (obj, options) {
		if (!obj.hasOwnProperty('options')) {
			obj.options = obj.options ? G.Util.create(obj.options) : {};
		}
		for (var i in options) {
			obj.options[i] = options[i];
		}
		return obj.options;
	},

	isArray: Array.isArray || function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	},

	castArray : function (array) {
		if (this.isArray(array)) return array;
		return [array];
	},

	
}
G.extend = G.Util.extend;
G.setOptions = G.Util.setOptions;
/*
 * G.Evented is a base class that Grande classes inherit from to handle custom events.
 */
G.Evented = G.Class.extend({

	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types = G.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	off: function (types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = G.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {

		var events = this._events = this._events || {},
		    contextId = context && context !== this && G.stamp(context);

		if (contextId) {
			// store listeners with custom context in a separate hash (if it has an id);
			// gives a major performance boost when firing and removing events (e.g. on map object)

			var indexKey = type + '_idx',
			    indexLenKey = type + '_len',
			    typeIndex = events[indexKey] = events[indexKey] || {},
			    id = G.stamp(fn) + '_' + contextId;

			if (!typeIndex[id]) {
				typeIndex[id] = {fn: fn, ctx: context};

				// keep track of the number of keys in the index to quickly check if it's empty
				events[indexLenKey] = (events[indexLenKey] || 0) + 1;
			}

		} else {
			// individual layers mostly use "this" for context and don't fire listeners too often
			// so simple array makes the memory footprint better while not degrading performance

			events[type] = events[type] || [];
			events[type].push({fn: fn});
		}
	},

	_off: function (type, fn, context) {
		var events = this._events,
		    indexKey = type + '_idx',
		    indexLenKey = type + '_len';

		if (!events) { return; }

		if (!fn) {
			// clear all listeners for a type if function isn't specified
			delete events[type];
			delete events[indexKey];
			delete events[indexLenKey];
			return;
		}

		var contextId = context && context !== this && G.stamp(context),
		    listeners, i, len, listener, id;

		if (contextId) {
			id = G.stamp(fn) + '_' + contextId;
			listeners = events[indexKey];

			if (listeners && listeners[id]) {
				listener = listeners[id];
				delete listeners[id];
				events[indexLenKey]--;
			}

		} else {
			listeners = events[type];

			if (listeners) {
				for (i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i].fn === fn) {
						listener = listeners[i];
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}

		// set the removed listener to noop so that's not called if remove happens in fire
		if (listener) {
			listener.fn = G.Util.falseFn;
		}
	},

	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = G.Util.extend({}, data, {type: type, target: this}),
		    events = this._events;

		if (events) {
		    var typeIndex = events[type + '_idx'],
		        i, len, listeners, id;

			if (events[type]) {
				// make sure adding/removing listeners inside other listeners won't cause infinite loop
				listeners = events[type].slice();

				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].fn.call(this, event);
				}
			}

			// fire event for the context-indexed listeners as well
			for (id in typeIndex) {
				typeIndex[id].fn.call(typeIndex[id].ctx, event);
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	listens: function (type, propagate) {
		var events = this._events;

		if (events && (events[type] || events[type + '_len'])) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	once: function (types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = G.bind(function () {
			this
			    .off(types, fn, context)
			    .off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this
		    .on(types, fn, context)
		    .on(types, handler, context);
	},

	// adds a parent to propagate events to (when you fire with true as a 3rd argument)
	addEventParent: function (obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[G.stamp(obj)] = obj;
		return this;
	},

	removeEventParent: function (obj) {
		if (this._eventParents) {
			delete this._eventParents[G.stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, G.extend({layer: e.target}, e), true);
		}
	}
});

var proto = G.Evented.prototype;

// aliases; we should ditch those eventually
proto.addEventListener = proto.on;
proto.removeEventListener = proto.clearAllEventListeners = proto.off;
proto.addOneTimeEventListener = proto.once;
proto.fireEvent = proto.fire;
proto.hasEventListeners = proto.listens;
G.Mixin = {Events: proto};;// The MIT License (MIT)

// Copyright (c) 2013 Matt DuVall Original: https://github.com/mduvall/grande.js/
// Copyright (c) 2014 @kosjoli    Fork: https://github.com/knutole/grande.js/

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// _______grande.js____________________________________________________________________________ 
// This is a small Javascript library that implements features from Medium's editing experience.
// Dependencies: grande.class.js

G.Rande = G.Class.extend({

	EDGE : -999,

	editNode : document.querySelectorAll(".g-body article")[0], // TODO: cross el support for imageUpload
	
	isFirefox : navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
	
	options : {
		animate: true,
		imageUpload : true,
		events : {
			// fired on changes to text. should be overridden by user, like G.rande.events.change = fn();
			change : function (e) { 
				console.log('change options.event!', e); 
			}
		}

	},
	
	tagClassMap : {
		"b": "bold",
		"i": "italic",
		"h1": "header1",
		"h2": "header2",
		"a": "url",
		"blockquote": "quote"
	},
	
	events : {
		// fired on changes to text. should be overridden by user, like G.rande.events.change = fn();
		change : function (e) { 
			console.log('change event!', e); 
		}
	},

	initialize : function (options, nodes) {

		// cheatcode
		G.r = this;

		// set options
		G.setOptions(this, options);

		// create toolbar
		this.initToolbarLayout();
		
		// init plugins
		this.initPlugins();

		// bind nodes
		if (nodes) this.bind(nodes);
		
		return this;
	},

	bind : function(nodes) {

		// get nodes
		this.editableNodes = G.Util.castArray(nodes) || document.querySelectorAll(".g-body article");
		
		// add event listeners
		this.addHooks();	
	},

	unbind : function () {

		// remove event listeners
		this.removeHooks();

		// fire remove on plugins
		this.removePlugins();
	},

	addToolbarButton : function (button) {
		// append next to last in buttonsContainer
		this.buttonsContainer.insertBefore(button, this.buttonsContainer.lastChild);
	},

	initPlugins : function (fn, context) {
		
		// get plugins from options
		this.plugins = this.options.plugins;

		// plug in plugins
		for (p in this.plugins) {
			var plugin = this.plugins[p];
			plugin.plugin(this);
		}

	},
	
	select: function() {
		this.triggerTextSelection();
	},

	addToOptions : function (div) {
		this.optionsNode.appendChild(div);
	},

	addHooks : function () {
		this._setHooks(true);
	},

	removeHooks : function () {
		this._setHooks(false);
	},

	_setHooks : function (on) {
		on = (on) ? 'addEventListener' : 'removeEventListener';

		// bind interaction to document
		document[on]('mousedown', this.triggerTextSelection, false);
		document[on]('keydown', this.preprocessKeyDown, false);
		document[on]('keyup', this.handleKeyUp, false);

		// bind resize to window
		window[on]('resize', this.triggerTextSelection, false);

		// bind blur to urlInput
		this.urlInput[on]('blur', this.triggerUrlBlur, false);
		this.urlInput[on]('keydown', this.triggerUrlSet, false);

		// bind image upload
		if (this.options.allowImages) {
			this.imageTooltip[on]('mousedown', this.triggerImageUpload, false);
			this.imageInput[on]('change', this.uploadImage, false);
			document[on]('mousemove', this.triggerOverlayStyling, false);
		}

		// bind nodes
		for (var i = 0, len = this.editableNodes.length; i < len; i++) {
			var node = this.editableNodes[i];
			node.contentEditable = true;
			node[on]('mousedown', this.triggerTextSelection, false);
			node[on]('mouseup', this.triggerTextSelection, false);
			node[on]('keyup', this.triggerTextSelection, false);
		}

		// bind text styling events, ie. toolbar button clicks
		var that = this;
		this.iterateTextMenuButtons(function(node) {
			node[on]('mousedown', function(event) {
				that.triggerTextStyling(node);
			}, false);
		});
	},

	initToolbarLayout : function () {

		// create toolbar container
		this.toolbarContainer = document.createElement("div");
		this.toolbarContainer.className = "g-body";
		document.body.appendChild(this.toolbarContainer);

		// create image tooltip
		this.imageTooltipTemplate = document.createElement("div");
		this.imageTooltipTemplate.innerHTML = "<div class='pos-abs file-label'>Insert image</div> \																				<input class='file-hidden pos-abs' type='file' id='files' name='files[]' accept='image/*' multiple/>";
		this.imageTooltipTemplate.className = "image-tooltip hide";

		// create toolbar template
		this.toolbarTemplate = "<div class='options'> \
			<span class='no-overflow'> \
				<span class='ui-inputs'> \
					<button class='bold'>B</button> \
					<button class='italic'>i</button> \
					<button class='header1'>h1</button> \
					<button class='header2'>h2</button> \
					<button class='quote'>&rdquo;</button> \
					<button class='url useicons'>&#xe001;</button> \
					<input class='url-input' type='text' placeholder='Paste or type a link'/> \
				</span> \
			</span> \
		</div>";
		
		// create toolbar wrapper
		var div = document.createElement("div");
		div.className = "text-menu hide";
		div.innerHTML = this.toolbarTemplate;

		// append to container
		if (document.querySelectorAll(".text-menu").length === 0) {
			this.toolbarContainer.appendChild(div);
			this.toolbarContainer.appendChild(this.imageTooltipTemplate);
		}

		// get elems
		this.imageInput 	= document.querySelectorAll(".file-label + input")[0];
		this.imageTooltip 	= document.querySelectorAll(".image-tooltip")[0];
		this.textMenu 		= document.querySelectorAll(".text-menu")[0];
		this.optionsNode 	= document.querySelectorAll(".text-menu .options")[0];
		this.urlInput 		= document.querySelectorAll(".text-menu .url-input")[0];
		this.uiInputs 		= document.querySelectorAll(".ui-inputs")[0];
		this.buttons 		= this.uiInputs.childNodes;
		this.buttonsContainer   = this.uiInputs;

	},

	handleKeyUp : function (event) {
		var that = G.r;
		var sel = window.getSelection();

		// FF will return sel.anchorNode to be the parentNode when the triggered keyCode is 13
		if (sel.anchorNode && sel.anchorNode.nodeName !== "ARTICLE") {
			that.triggerNodeAnalysis(event);
			if (sel.isCollapsed) {
				that.triggerTextParse(event);
			}
		}
	},

	triggerOverlayStyling : function (event) {
		this.toggleImageTooltip(event, event.target);
	},

	triggerImageUpload : function (event) {
		// Cache the bound that was originally clicked on before the image upload
		var childrenNodes = editNode.children
		var editBounds = editNode.getBoundingClientRect();
		this.imageBound = this.getHorizontalBounds(childrenNodes, editBounds, event);
	},

	triggerNodeAnalysis : function (event) {
		var sel = window.getSelection(),
		    anchorNode,
		    parentParagraph;

		if (event.keyCode === 13) {

			// Enters should replace it's parent <div> with a <p>
			if (sel.anchorNode.nodeName === "DIV") {
				this.toggleFormatBlock("p");
			}

			parentParagraph = this.getParentWithTag(sel.anchorNode, "p");

			if (parentParagraph) {
				this.insertHorizontalRule(parentParagraph);
			}
		}
	},

	triggerTextParse : function (event) {
		var sel = window.getSelection(),
		    textProp,
		    subject,
		    insertedNode,
		    unwrap,
		    node,
		    parent,
		    range;

		// FF will return sel.anchorNode to be the parentNode when the triggered keyCode is 13
		if (!sel.isCollapsed || !sel.anchorNode || sel.anchorNode.nodeName === "ARTICLE") {
			return;
		}

		textProp = this.getTextProp(sel.anchorNode);
		subject = sel.anchorNode[textProp];

		if (subject.match(/^[-*]\s/) && sel.anchorNode.parentNode.nodeName !== "LI") {
			insertedNode = insertListOnSelection(sel, textProp, "ul");
		}

		if (subject.match(/^1\.\s/) && sel.anchorNode.parentNode.nodeName !== "LI") {
			insertedNode = insertListOnSelection(sel, textProp, "ol");
		}

		unwrap = insertedNode &&
			 ["ul", "ol"].indexOf(insertedNode.nodeName.toLocaleLowerCase()) >= 0 &&
			 ["p", "div"].indexOf(insertedNode.parentNode.nodeName.toLocaleLowerCase()) >= 0;

		if (unwrap) {
			node = sel.anchorNode;
			parent = insertedNode.parentNode;
			parent.parentNode.insertBefore(insertedNode, parent);
			parent.parentNode.removeChild(parent);
			this.moveCursorToBeginningOfSelection(sel, node);
		}
	},

	triggerTextStyling : function (node) {

		var className = node.className,
		    sel = window.getSelection(),
		    selNode = sel.anchorNode,
		    tagClass,
		    reTag;

		for (var tag in this.tagClassMap) {
			tagClass = this.tagClassMap[tag];
			reTag = new RegExp(tagClass);

			if (reTag.test(className)) {
				
				switch(tag) {
				
					case "b": return document.execCommand(tagClass, false);
					case "i": return document.execCommand(tagClass, false);
					case "h1":
					case "h2":
					case "h3":
					case "blockquote": return this.toggleFormatBlock(tag);
					case "a":
						this.toggleUrlInput();
						this.optionsNode.className = "options url-mode";
						return;
				
				}
			}
		}
	},


	triggerUrlBlur : function (event) {

		// set global scope, as 'this' is event context here
		var that = G.r;

		// get url
		var url = that.urlInput.value;

		// clear url-mode
		that.optionsNode.className = "options";
	
		// return if no url
		if (url === "") return that.removeLink();

		// add http to links
		if (!url.match("^(http://|https://|mailto:)")) url = "http://" + url;
		
		// create link
		that.createLink(url)

		// clear input
		that.urlInput.value = "";
	},

	
	triggerUrlSet : function (event) {
		var that = G.r;
		if (event.keyCode === 13) {
			event.preventDefault();
			event.stopPropagation();
			that.urlInput.blur();
		}
	},


	// listen for text selection on every mousedown 
	triggerTextSelection : function (e, f) {
		var that = G.r;
		var selectedText = window.getSelection(),
		    target = e.target || e.srcElement;

		// if target is one of buttons, reload menu state
		var buttons = that.buttons;
		for (var n = 0; n < buttons.length; n++) {
			if (buttons[n] == target) return that.reloadMenuState();
		}
		
		// if target is buttons wrapper, reload menu state
		if (target == that.optionsNode) return that.reloadMenuState();
		
		// if target is anything not editable, hide buttons
		if (!target.isContentEditable) {

			that.hideToolbar();
			that.textMenu.className = "text-menu hide";
			that.reloadMenuState();
			
			// fire change event
			return that.options.events.change();
			
		}

		// if selected text is collapsed, hide buttons
		if (selectedText.isCollapsed) {

			that.hideToolbar();
			that.textMenu.className = "text-menu hide";	
			that.reloadMenuState();		
			return;
		}
		
		// get selected text and move menu
		that.showToolbar(selectedText);

		// refresh buttons
		that.reloadMenuState();

		// fire change event
		that.options.events.change();		
	},

	showToolbar : function (selectedText) {
		var range = selectedText.getRangeAt(0);
		var clientRectBounds = range.getBoundingClientRect();
		this.setTextMenuPosition(
			clientRectBounds.top - 45 + window.pageYOffset,
			(clientRectBounds.left + clientRectBounds.right) / 2
		);

		// bool
		this.toolbarOpen = true;
	},

	hideToolbar : function () {

		// bool
		if (!this.toolbarOpen) return;
		this.toolbarOpen = false;

		// hide toolbar
		this.setTextMenuPosition(this.EDGE, this.EDGE);
		
		// fire hide event to plugins
		this._fireHiddenToolbar();
		
	},

	_fireHiddenToolbar : function () {

		// get plugins from options
		var plugins = this.plugins;

		// fire event on plugins
		for (p in plugins) {
			var plugin = plugins[p];
			plugin.onToolbarHide();
		}


	},

	createLink : function (url) {

		// clear existing
		this.removeLink();

		// create link
		document.execCommand("createLink", false, url);
	},

	removeLink : function () {

		// get previosly selected text
		var prev = this.previouslySelectedText;
		if (!prev) return;

		// get selection
		window.getSelection().addRange(prev);

		// clear prev link
		document.execCommand("unlink", false);
	},

	getHorizontalBounds : function (nodes, target, event) {
		var bounds = [],
		    bound,
		    i,
		    len,
		    preNode,
		    postNode,
		    bottomBound,
		    topBound,
		    coordY;

		// Compute top and bottom bounds for each child element
		for (i = 0, len = nodes.length - 1; i < len; i++) {
			preNode = nodes[i];
			postNode = nodes[i+1] || null;

			bottomBound = preNode.getBoundingClientRect().bottom - 5;
			topBound = postNode.getBoundingClientRect().top;

			bounds.push({
				top: topBound,
				bottom: bottomBound,
				topElement: preNode,
				bottomElement: postNode,
				index: i+1
			});
		}

		coordY = event.pageY - root.scrollY;

		// Find if there is a range to insert the image tooltip between two elements
		for (i = 0, len = bounds.length; i < len; i++) {
			bound = bounds[i];
			if (coordY < bound.top && coordY > bound.bottom) {
				return bound;
			}
		}

		return null;
	},

	getTextProp : function (el) {
		var textProp;

		if (el.nodeType === Node.TEXT_NODE) {
			textProp = "data";
		} else if (this.isFirefox) {
			textProp = "textContent";
		} else {
			textProp = "innerText";
		}

		return textProp;
	},

	getFocusNode : function () {
		return window.getSelection().focusNode;
	},

	getParent : function (node, condition, returnCallback) {
		if (node === null) {
			return;
		}

		while (node.parentNode) {
			if (condition(node)) {
				return returnCallback(node);
			}

			node = node.parentNode;
		}
	},

	getParentWithTag : function (node, nodeType) {
		var checkNodeType = function(node) { return node.nodeName.toLowerCase() === nodeType; }
		var returnNode = function(node) { return node; };
		return this.getParent(node, checkNodeType, returnNode);
	},

	getParentHref : function (node) {
		var checkHref = function(node) { return typeof node.href !== "undefined"; };
		var returnHref = function(node) { return node.href; };
		return this.getParent(node, checkHref, returnHref);
	},

	hasParentWithTag : function (node, nodeType) {
		return !!this.getParentWithTag(node, nodeType);
	},

	toggleFormatBlock : function (tag) {

		if (this.hasParentWithTag(this.getFocusNode(), tag)) {
			document.execCommand("formatBlock", false, "p");
			document.execCommand("outdent");
		} else {
			document.execCommand("formatBlock", false, tag);
		}
	},

	toggleUrlInput : function () {
		var that = this;
		setTimeout(function() {
			var url = that.getParentHref(that.getFocusNode());

			if (typeof url !== "undefined") {
				that.urlInput.value = url;
			} 

			that.previouslySelectedText = window.getSelection().getRangeAt(0);
			that.urlInput.focus();
		}, 150);
	},

	toggleImageTooltip : function (event, element) {
		var childrenNodes = editNode.children;
		var editBounds = editNode.getBoundingClientRect();
		var bound = getHorizontalBounds(childrenNodes, editBounds, event);

		if (bound) {
			this.imageTooltip.style.left = (editBounds.left - 90 ) + "px";
			this.imageTooltip.style.top = (bound.top - 17) + "px";
		} else {
			this.imageTooltip.style.left = EDGE + "px";
			this.imageTooltip.style.top = EDGE + "px";
		}
	},

	setTextMenuPosition : function (top, left) {

		this.textMenu.style.top = top + "px";
		this.textMenu.style.left = left + "px";

		if (this.options.animate) {
			if (top === this.EDGE) {
				this.textMenu.className = "text-menu hide";
			} else {
				this.textMenu.className = "text-menu active";
			}
		}
	},

	insertHorizontalRule : function (parentParagraph) {
		var prevSibling,
		    prevPrevSibling,
		    hr;

		prevSibling = parentParagraph.previousSibling;
		prevPrevSibling = prevSibling;

		while (prevPrevSibling) {
			if (prevPrevSibling.nodeType != Node.TEXT_NODE) {
				break;
			}

			prevPrevSibling = prevPrevSibling.previousSibling;
		}

		if (!prevSibling || !prevPrevSibling) return;
		if (prevSibling.nodeName === "P" && !prevSibling.textContent.length && prevPrevSibling.nodeName !== "HR") {

			hr = document.createElement("hr");
			hr.contentEditable = false;
			parentParagraph.parentNode.replaceChild(hr, prevSibling);
		}
	},

	insertListOnSelection : function (sel, textProp, listType) {
		var execListCommand = listType === "ol" ? "insertOrderedList" : "insertUnorderedList",
		    nodeOffset = listType === "ol" ? 3 : 2;

		document.execCommand(this[execListCommand]);
		sel.anchorNode[textProp] = sel.anchorNode[textProp].substring(nodeOffset);

		return this.getParentWithTag(sel.anchorNode, listType);
	},

	insertImage : function (url) {

		var image = document.createElement('img');
		image.src = url;
		image.style.width = '200px';
		image.style.height = 'auto';

		var range = window.getSelection().getRangeAt(0);
		range.collapse(true);
		range.insertNode(image);

	},

	reloadMenuState : function () {

		var className,
		    focusNode = this.getFocusNode(),
		    tagClass,
		    reTag,
		    that = this;


		this.iterateTextMenuButtons(function(node) {
			className = node.className;

			for (var tag in that.tagClassMap) {
				tagClass = that.tagClassMap[tag];
				reTag = new RegExp(tagClass);

				if (reTag.test(className)) {
					// console.log('if has parent etc: focusNode, tag', focusNode, tag);
					if (that.hasParentWithTag(focusNode, tag)) {
						node.className = tagClass + " active";
					} else {
						node.className = tagClass;
					}

					break;
				}
			}
		});

	},

	preprocessKeyDown : function (event) {

		var that = G.r;
		var sel = window.getSelection(),
		    parentParagraph = that.getParentWithTag(sel.anchorNode, "p"),
		    p,
		    isHr;

		if (event.keyCode === 13 && parentParagraph) {
			prevSibling = parentParagraph.previousSibling;
			isHr = prevSibling && prevSibling.nodeName === "HR" &&
				!parentParagraph.textContent.length;

			// Stop enters from creating another <p> after a <hr> on enter
			if (isHr) event.preventDefault();
		}
	},

	iterateTextMenuButtons : function (callback) {
		var textMenuButtons = document.querySelectorAll(".text-menu button"),
		    i,
		    len,
		    node,
		    fnCallback = function(n) {
		    	callback(n);
		    };
    
		for (i = 0, len = textMenuButtons.length; i < len; i++) {
			node = textMenuButtons[i];
			fnCallback(node);
		}
	},

	moveCursorToBeginningOfSelection : function (selection, node) {
		range = document.createRange();
		range.setStart(node, 0);
		range.setEnd(node, 0);
		selection.removeAllRanges();
		selection.addRange(range);
	},

	uploadImage : function (event) {
		// Only allow uploading of 1 image for now, this is the first file
		var file = this.files[0],
				reader = new FileReader(),
				figEl;

		reader.onload = (function(f) {
			return function(e) {
				figEl = document.createElement("figure");
				figEl.innerHTML = "<img src=\"" + e.target.result + "\"/>";
				editNode.insertBefore(figEl, imageBound.bottomElement);
			};
		}(file));

		reader.readAsDataURL(file);
	},

}); 

// grande shorthand
G.rande = function (nodes, options) {
	return new G.Rande(options, nodes);
};;// The MIT License (MIT)

// Copyright (c) 2014 @kosjoli https://github.com/knutole/grande.js/

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// _______grande.js attachments plugin_________________________________________________________ 
// Adds possibility to create link from list of files, or to embed images into text.
// Dependencies: grande.js, grande.class.js

G.Attachments = G.Class.extend({

	name : 'Attachments',

	initialize : function (source, options) {

		// set options
		G.setOptions(this, options);

		// set source
		this.source = source;
		
	},

	_initialize : function () {

		// create layout
		this.initLayout();

		// add hooks
		this.addHooks();

		// mark initialized
		this.initialized = true;

	},

	// hack cause i dont get it
	plugin : function (grande) {
		
		// attach grande
		this.grande = grande;
		this._initialize();
	},

	initLayout : function () {

		// create button and append to ui container
		this.button = this.createButton();
		
		// add to toolbar buttons container		
		this.grande.addToolbarButton(this.button);

	},

	createButton : function () {
		var button = document.createElement('button');
		button.className = 'attachment';
		button.innerHTML = 'F';
		return button;
	},

	addHooks : function () {
		var that = this;
		this.button.addEventListener('mousedown', function (e) {
			that.toggleButton(e, that);
		}, false);
	},

	removeHooks : function () {
		var that = this;
		this.button.removeEventListener('mousedown', function (e) {
			that.toggleButton(e, that);
		}, false);
	},

	toggleButton : function (e, that) {
		var button = e.target;
		Wu.DomEvent.stop(e);

		if (button.active) {
			that.closePopup();
			button.active = false;
			button.className = 'attachment';
		} else {
			that.openPopup();
			button.active = true;
			button.className = 'attachment active';
		}
	},

	closePopup : function () {
	
		// remove popup
		this.destroyPopup();

	},

	openPopup : function () {

		// create popup
		this.createPopup();

	},

	createPopup : function () {

		// get project
		this.project = app.activeProject;

		// get sources
		var sources = this.source;

		// create source div
		var container = this._popup = Wu.DomUtil.create('div', 'grande-sources-container');
		var topwrapper = Wu.DomUtil.create('div', 'grande-sources-topwrap', container);
		sources.forEach(function (source) {
			this._createSource(source, container);
		}, this);

		// add to options container
		this.grande.addToOptions(container);

	},


	_createSource : function (source, container) {

		// create divs
		var title = source.title;
		var wrap = Wu.DomUtil.create('div', 'grande-sources-source', container);
		var icon = Wu.DomUtil.create('div', 'grande-sources-source-icon', wrap);
		var name = Wu.DomUtil.create('div', 'grande-sources-source-title', wrap, title);

		// set icon
		Wu.DomUtil.addClass(icon, source.type);
		
		// add thumbnail if available
		if (source.thumbnail) {
			var thumb = Wu.DomUtil.create('img', 'grande-sources-source-thumb', wrap);
			thumb.src = source.thumbnail;
		} 

		// add select event
		Wu.DomEvent.on(wrap, 'mousedown', function () {
			if (this.options.embedImage) {
				
				this.embedImage(source.url);
			} else {
				this.selectSource(source);
			}
			
		}, this);
	},

	destroyPopup : function () {
		if (!this._popup) return;
		this._remove(this._popup);
		this._popup = null;		// events should now be gc'd. todo: check
	},

	embedImage : function (image) {
		this.grande.insertImage(image);
	},

	selectSource : function (source) {

		// add link to text selection
		var url = source.url;

		// create link
		this.grande.createLink(url);
		
	},

	_remove: function (el) {
		var parent = el.parentNode;
		if (parent) {
		    parent.removeChild(el);
		}
	},


	// fired on grande.unbind();
	destroy : function () {
		this.removeHooks();
	},

	// fired on grande.hideToolbar();
	onToolbarHide : function () {
		this.closePopup();
	},

});
