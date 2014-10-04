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
;!function t(e,n,o){function i(a,s){if(!n[a]){if(!e[a]){var l="function"==typeof require&&require;if(!s&&l)return l(a,!0);if(r)return r(a,!0);throw new Error("Cannot find module '"+a+"'")}var c=n[a]={exports:{}};e[a][0].call(c.exports,function(t){var n=e[a][1][t];return i(n?n:t)},c,c.exports,t,e,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(t,e){function n(t,e,n){function o(t){return t>=200&&300>t||304===t}function i(){void 0===s.status||o(s.status)?e.call(s,null,s):e.call(s,s,null)}var r=!1;if("undefined"==typeof window.XMLHttpRequest)return e(Error("Browser not supported"));if("undefined"==typeof n){var a=t.match(/^\s*https?:\/\/[^\/]*/);n=a&&a[0]!==location.protocol+"//"+location.domain+(location.port?":"+location.port:"")}var s=new window.XMLHttpRequest;if(n&&!("withCredentials"in s)){s=new window.XDomainRequest;var l=e;e=function(){if(r)l.apply(this,arguments);else{var t=this,e=arguments;setTimeout(function(){l.apply(t,e)},0)}}}return"onload"in s?s.onload=i:s.onreadystatechange=function(){4===s.readyState&&i()},s.onerror=function(t){e.call(this,t||!0,null),e=function(){}},s.onprogress=function(){},s.ontimeout=function(t){e.call(this,t,null),e=function(){}},s.onabort=function(t){e.call(this,t,null),e=function(){}},s.open("GET",t,!0),s.send(null),r=!0,s}"undefined"!=typeof e&&(e.exports=n)},{}],2:[function(t,e,n){!function(t,e){if("object"==typeof n&&n)e(n);else{var o={};e(o),"function"==typeof define&&define.amd?define(o):t.Mustache=o}}(this,function(t){function e(t,e){return y.call(t,e)}function n(t){return!e(g,t)}function o(t){return"function"==typeof t}function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function r(t){return String(t).replace(/[&<>"'\/]/g,function(t){return E[t]})}function a(t){this.string=t,this.tail=t,this.pos=0}function s(t,e){this.view=null==t?{}:t,this.parent=e,this._cache={".":this.view}}function l(){this.clearCache()}function c(e,n,i,r){function a(t){return n.render(t,i)}for(var s,l,u,h="",p=0,d=e.length;d>p;++p)switch(s=e[p],l=s[1],s[0]){case"#":if(u=i.lookup(l),"object"==typeof u||"string"==typeof u)if(T(u))for(var m=0,f=u.length;f>m;++m)h+=c(s[4],n,i.push(u[m]),r);else u&&(h+=c(s[4],n,i.push(u),r));else if(o(u)){var g=null==r?null:r.slice(s[3],s[5]);u=u.call(i.view,g,a),null!=u&&(h+=u)}else u&&(h+=c(s[4],n,i,r));break;case"^":u=i.lookup(l),(!u||T(u)&&0===u.length)&&(h+=c(s[4],n,i,r));break;case">":u=n.getPartial(l),o(u)&&(h+=u(i));break;case"&":u=i.lookup(l),null!=u&&(h+=u);break;case"name":u=i.lookup(l),null!=u&&(h+=t.escape(u));break;case"text":h+=l}return h}function u(t){for(var e,n=[],o=n,i=[],r=0,a=t.length;a>r;++r)switch(e=t[r],e[0]){case"#":case"^":i.push(e),o.push(e),o=e[4]=[];break;case"/":var s=i.pop();s[5]=e[2],o=i.length>0?i[i.length-1][4]:n;break;default:o.push(e)}return n}function h(t){for(var e,n,o=[],i=0,r=t.length;r>i;++i)e=t[i],e&&("text"===e[0]&&n&&"text"===n[0]?(n[1]+=e[1],n[3]=e[3]):(n=e,o.push(e)));return o}function p(t){return[new RegExp(i(t[0])+"\\s*"),new RegExp("\\s*"+i(t[1]))]}function d(e,o){function r(){if(x&&!M)for(;w.length;)delete C[w.pop()];else w=[];x=!1,M=!1}if(e=e||"",o=o||t.tags,"string"==typeof o&&(o=o.split(f)),2!==o.length)throw new Error("Invalid tags: "+o.join(", "));for(var s,l,c,d,g,y,b=p(o),T=new a(e),E=[],C=[],w=[],x=!1,M=!1;!T.eos();){if(s=T.pos,c=T.scanUntil(b[0]))for(var k=0,S=c.length;S>k;++k)d=c.charAt(k),n(d)?w.push(C.length):M=!0,C.push(["text",d,s,s+1]),s+=1,"\n"==d&&r();if(!T.scan(b[0]))break;if(x=!0,l=T.scan(v)||"name",T.scan(m),"="===l?(c=T.scanUntil(_),T.scan(_),T.scanUntil(b[1])):"{"===l?(c=T.scanUntil(new RegExp("\\s*"+i("}"+o[1]))),T.scan(L),T.scanUntil(b[1]),l="&"):c=T.scanUntil(b[1]),!T.scan(b[1]))throw new Error("Unclosed tag at "+T.pos);if(g=[l,c,s,T.pos],C.push(g),"#"===l||"^"===l)E.push(g);else if("/"===l){if(y=E.pop(),!y)throw new Error('Unopened section "'+c+'" at '+s);if(y[1]!==c)throw new Error('Unclosed section "'+y[1]+'" at '+s)}else if("name"===l||"{"===l||"&"===l)M=!0;else if("="===l){if(o=c.split(f),2!==o.length)throw new Error("Invalid tags at "+s+": "+o.join(", "));b=p(o)}}if(y=E.pop())throw new Error('Unclosed section "'+y[1]+'" at '+T.pos);return u(h(C))}var m=/\s*/,f=/\s+/,g=/\S/,_=/\s*=/,L=/\s*\}/,v=/#|\^|\/|>|\{|&|=|!/,y=RegExp.prototype.test,b=Object.prototype.toString,T=Array.isArray||function(t){return"[object Array]"===b.call(t)},E={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};a.prototype.eos=function(){return""===this.tail},a.prototype.scan=function(t){var e=this.tail.match(t);if(e&&0===e.index){var n=e[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n}return""},a.prototype.scanUntil=function(t){var e,n=this.tail.search(t);switch(n){case-1:e=this.tail,this.tail="";break;case 0:e="";break;default:e=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=e.length,e},s.make=function(t){return t instanceof s?t:new s(t)},s.prototype.push=function(t){return new s(t,this)},s.prototype.lookup=function(t){var e;if(t in this._cache)e=this._cache[t];else{for(var n=this;n;){if(t.indexOf(".")>0){e=n.view;for(var i=t.split("."),r=0;null!=e&&r<i.length;)e=e[i[r++]]}else e=n.view[t];if(null!=e)break;n=n.parent}this._cache[t]=e}return o(e)&&(e=e.call(this.view)),e},l.prototype.clearCache=function(){this._cache={},this._partialCache={}},l.prototype.compile=function(e,n){var o=this._cache[e];if(!o){var i=t.parse(e,n);o=this._cache[e]=this.compileTokens(i,e)}return o},l.prototype.compilePartial=function(t,e,n){var o=this.compile(e,n);return this._partialCache[t]=o,o},l.prototype.getPartial=function(t){return t in this._partialCache||!this._loadPartial||this.compilePartial(t,this._loadPartial(t)),this._partialCache[t]},l.prototype.compileTokens=function(t,e){var n=this;return function(i,r){if(r)if(o(r))n._loadPartial=r;else for(var a in r)n.compilePartial(a,r[a]);return c(t,n,s.make(i),e)}},l.prototype.render=function(t,e,n){return this.compile(t)(e,n)},t.name="mustache.js",t.version="0.7.3",t.tags=["{{","}}"],t.Scanner=a,t.Context=s,t.Writer=l,t.parse=d,t.escape=r;var C=new l;t.clearCache=function(){return C.clearCache()},t.compile=function(t,e){return C.compile(t,e)},t.compilePartial=function(t,e,n){return C.compilePartial(t,e,n)},t.compileTokens=function(t,e){return C.compileTokens(t,e)},t.render=function(t,e,n){return C.render(t,e,n)},t.to_html=function(e,n,i,r){var a=t.render(e,n,i);return o(r)?(r(a),void 0):a}})},{}],3:[function(t,e){function n(t){"use strict";return/^https?/.test(t.getScheme())?t.toString():/^mailto?/.test(t.getScheme())?t.toString():"data"==t.getScheme()&&/^image/.test(t.getPath())?t.toString():void 0}function o(t){return t}var i=t("./sanitizer-bundle.js");e.exports=function(t){return t?i(t,n,o):""}},{"./sanitizer-bundle.js":4}],4:[function(t,e){var n=function(){function t(t){var e=(""+t).match(d);return e?new l(c(e[1]),c(e[2]),c(e[3]),c(e[4]),c(e[5]),c(e[6]),c(e[7])):null}function e(t,e,r,a,s,c,u){var h=new l(o(t,m),o(e,m),n(r),a>0?a.toString():null,o(s,f),null,n(u));return c&&("string"==typeof c?h.setRawQuery(c.replace(/[^?&=0-9A-Za-z_\-~.%]/g,i)):h.setAllParameters(c)),h}function n(t){return"string"==typeof t?encodeURIComponent(t):null}function o(t,e){return"string"==typeof t?encodeURI(t).replace(e,i):null}function i(t){var e=t.charCodeAt(0);return"%"+"0123456789ABCDEF".charAt(e>>4&15)+"0123456789ABCDEF".charAt(15&e)}function r(t){return t.replace(/(^|\/)\.(?:\/|$)/g,"$1").replace(/\/{2,}/g,"/")}function a(t){if(null===t)return null;for(var e,n=r(t),o=h;(e=n.replace(o,"$1"))!=n;n=e);return n}function s(t,e){var n=t.clone(),o=e.hasScheme();o?n.setRawScheme(e.getRawScheme()):o=e.hasCredentials(),o?n.setRawCredentials(e.getRawCredentials()):o=e.hasDomain(),o?n.setRawDomain(e.getRawDomain()):o=e.hasPort();var i=e.getRawPath(),r=a(i);if(o)n.setPort(e.getPort()),r=r&&r.replace(p,"");else if(o=!!i){if(47!==r.charCodeAt(0)){var s=a(n.getRawPath()||"").replace(p,""),l=s.lastIndexOf("/")+1;r=a((l?s.substring(0,l):"")+a(i)).replace(p,"")}}else r=r&&r.replace(p,""),r!==i&&n.setRawPath(r);return o?n.setRawPath(r):o=e.hasQuery(),o?n.setRawQuery(e.getRawQuery()):o=e.hasFragment(),o&&n.setRawFragment(e.getRawFragment()),n}function l(t,e,n,o,i,r,a){this.scheme_=t,this.credentials_=e,this.domain_=n,this.port_=o,this.path_=i,this.query_=r,this.fragment_=a,this.paramCache_=null}function c(t){return"string"==typeof t&&t.length>0?t:null}var u=new RegExp("(/|^)(?:[^./][^/]*|\\.{2,}(?:[^./][^/]*)|\\.{3,}[^/]*)/\\.\\.(?:/|$)"),h=new RegExp(u),p=/^(?:\.\.\/)*(?:\.\.$)?/;l.prototype.toString=function(){var t=[];return null!==this.scheme_&&t.push(this.scheme_,":"),null!==this.domain_&&(t.push("//"),null!==this.credentials_&&t.push(this.credentials_,"@"),t.push(this.domain_),null!==this.port_&&t.push(":",this.port_.toString())),null!==this.path_&&t.push(this.path_),null!==this.query_&&t.push("?",this.query_),null!==this.fragment_&&t.push("#",this.fragment_),t.join("")},l.prototype.clone=function(){return new l(this.scheme_,this.credentials_,this.domain_,this.port_,this.path_,this.query_,this.fragment_)},l.prototype.getScheme=function(){return this.scheme_&&decodeURIComponent(this.scheme_).toLowerCase()},l.prototype.getRawScheme=function(){return this.scheme_},l.prototype.setScheme=function(t){return this.scheme_=o(t,m),this},l.prototype.setRawScheme=function(t){return this.scheme_=t?t:null,this},l.prototype.hasScheme=function(){return null!==this.scheme_},l.prototype.getCredentials=function(){return this.credentials_&&decodeURIComponent(this.credentials_)},l.prototype.getRawCredentials=function(){return this.credentials_},l.prototype.setCredentials=function(t){return this.credentials_=o(t,m),this},l.prototype.setRawCredentials=function(t){return this.credentials_=t?t:null,this},l.prototype.hasCredentials=function(){return null!==this.credentials_},l.prototype.getDomain=function(){return this.domain_&&decodeURIComponent(this.domain_)},l.prototype.getRawDomain=function(){return this.domain_},l.prototype.setDomain=function(t){return this.setRawDomain(t&&encodeURIComponent(t))},l.prototype.setRawDomain=function(t){return this.domain_=t?t:null,this.setRawPath(this.path_)},l.prototype.hasDomain=function(){return null!==this.domain_},l.prototype.getPort=function(){return this.port_&&decodeURIComponent(this.port_)},l.prototype.setPort=function(t){if(t){if(t=Number(t),t!==(65535&t))throw new Error("Bad port number "+t);this.port_=""+t}else this.port_=null;return this},l.prototype.hasPort=function(){return null!==this.port_},l.prototype.getPath=function(){return this.path_&&decodeURIComponent(this.path_)},l.prototype.getRawPath=function(){return this.path_},l.prototype.setPath=function(t){return this.setRawPath(o(t,f))},l.prototype.setRawPath=function(t){return t?(t=String(t),this.path_=!this.domain_||/^\//.test(t)?t:"/"+t):this.path_=null,this},l.prototype.hasPath=function(){return null!==this.path_},l.prototype.getQuery=function(){return this.query_&&decodeURIComponent(this.query_).replace(/\+/g," ")},l.prototype.getRawQuery=function(){return this.query_},l.prototype.setQuery=function(t){return this.paramCache_=null,this.query_=n(t),this},l.prototype.setRawQuery=function(t){return this.paramCache_=null,this.query_=t?t:null,this},l.prototype.hasQuery=function(){return null!==this.query_},l.prototype.setAllParameters=function(t){if("object"==typeof t&&!(t instanceof Array)&&(t instanceof Object||"[object Array]"!==Object.prototype.toString.call(t))){var e=[],n=-1;for(var o in t){var i=t[o];"string"==typeof i&&(e[++n]=o,e[++n]=i)}t=e}this.paramCache_=null;for(var r=[],a="",s=0;s<t.length;){var o=t[s++],i=t[s++];r.push(a,encodeURIComponent(o.toString())),a="&",i&&r.push("=",encodeURIComponent(i.toString()))}return this.query_=r.join(""),this},l.prototype.checkParameterCache_=function(){if(!this.paramCache_){var t=this.query_;if(t){for(var e=t.split(/[&\?]/),n=[],o=-1,i=0;i<e.length;++i){var r=e[i].match(/^([^=]*)(?:=(.*))?$/);n[++o]=decodeURIComponent(r[1]).replace(/\+/g," "),n[++o]=decodeURIComponent(r[2]||"").replace(/\+/g," ")}this.paramCache_=n}else this.paramCache_=[]}},l.prototype.setParameterValues=function(t,e){"string"==typeof e&&(e=[e]),this.checkParameterCache_();for(var n=0,o=this.paramCache_,i=[],r=0;r<o.length;r+=2)t===o[r]?n<e.length&&i.push(t,e[n++]):i.push(o[r],o[r+1]);for(;n<e.length;)i.push(t,e[n++]);return this.setAllParameters(i),this},l.prototype.removeParameter=function(t){return this.setParameterValues(t,[])},l.prototype.getAllParameters=function(){return this.checkParameterCache_(),this.paramCache_.slice(0,this.paramCache_.length)},l.prototype.getParameterValues=function(t){this.checkParameterCache_();for(var e=[],n=0;n<this.paramCache_.length;n+=2)t===this.paramCache_[n]&&e.push(this.paramCache_[n+1]);return e},l.prototype.getParameterMap=function(){this.checkParameterCache_();for(var t={},e=0;e<this.paramCache_.length;e+=2){var n=this.paramCache_[e++],o=this.paramCache_[e++];n in t?t[n].push(o):t[n]=[o]}return t},l.prototype.getParameterValue=function(t){this.checkParameterCache_();for(var e=0;e<this.paramCache_.length;e+=2)if(t===this.paramCache_[e])return this.paramCache_[e+1];return null},l.prototype.getFragment=function(){return this.fragment_&&decodeURIComponent(this.fragment_)},l.prototype.getRawFragment=function(){return this.fragment_},l.prototype.setFragment=function(t){return this.fragment_=t?encodeURIComponent(t):null,this},l.prototype.setRawFragment=function(t){return this.fragment_=t?t:null,this},l.prototype.hasFragment=function(){return null!==this.fragment_};var d=new RegExp("^(?:([^:/?#]+):)?(?://(?:([^/?#]*)@)?([^/?#:@]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$"),m=/[#\/\?@]/g,f=/[\#\?]/g;return l.parse=t,l.create=e,l.resolve=s,l.collapse_dots=a,l.utils={mimeTypeOf:function(e){var n=t(e);return/\.html$/.test(n.getPath())?"text/html":"application/javascript"},resolve:function(e,n){return e?s(t(e),t(n)).toString():""+n}},l}(),o={};if(o.atype={NONE:0,URI:1,URI_FRAGMENT:11,SCRIPT:2,STYLE:3,HTML:12,ID:4,IDREF:5,IDREFS:6,GLOBAL_NAME:7,LOCAL_NAME:8,CLASSES:9,FRAME_TARGET:10,MEDIA_QUERY:13},o.atype=o.atype,o.ATTRIBS={"*::class":9,"*::dir":0,"*::draggable":0,"*::hidden":0,"*::id":4,"*::inert":0,"*::itemprop":0,"*::itemref":6,"*::itemscope":0,"*::lang":0,"*::onblur":2,"*::onchange":2,"*::onclick":2,"*::ondblclick":2,"*::onfocus":2,"*::onkeydown":2,"*::onkeypress":2,"*::onkeyup":2,"*::onload":2,"*::onmousedown":2,"*::onmousemove":2,"*::onmouseout":2,"*::onmouseover":2,"*::onmouseup":2,"*::onreset":2,"*::onscroll":2,"*::onselect":2,"*::onsubmit":2,"*::onunload":2,"*::spellcheck":0,"*::style":3,"*::title":0,"*::translate":0,"a::accesskey":0,"a::coords":0,"a::href":1,"a::hreflang":0,"a::name":7,"a::onblur":2,"a::onfocus":2,"a::shape":0,"a::tabindex":0,"a::target":10,"a::type":0,"area::accesskey":0,"area::alt":0,"area::coords":0,"area::href":1,"area::nohref":0,"area::onblur":2,"area::onfocus":2,"area::shape":0,"area::tabindex":0,"area::target":10,"audio::controls":0,"audio::loop":0,"audio::mediagroup":5,"audio::muted":0,"audio::preload":0,"bdo::dir":0,"blockquote::cite":1,"br::clear":0,"button::accesskey":0,"button::disabled":0,"button::name":8,"button::onblur":2,"button::onfocus":2,"button::tabindex":0,"button::type":0,"button::value":0,"canvas::height":0,"canvas::width":0,"caption::align":0,"col::align":0,"col::char":0,"col::charoff":0,"col::span":0,"col::valign":0,"col::width":0,"colgroup::align":0,"colgroup::char":0,"colgroup::charoff":0,"colgroup::span":0,"colgroup::valign":0,"colgroup::width":0,"command::checked":0,"command::command":5,"command::disabled":0,"command::icon":1,"command::label":0,"command::radiogroup":0,"command::type":0,"data::value":0,"del::cite":1,"del::datetime":0,"details::open":0,"dir::compact":0,"div::align":0,"dl::compact":0,"fieldset::disabled":0,"font::color":0,"font::face":0,"font::size":0,"form::accept":0,"form::action":1,"form::autocomplete":0,"form::enctype":0,"form::method":0,"form::name":7,"form::novalidate":0,"form::onreset":2,"form::onsubmit":2,"form::target":10,"h1::align":0,"h2::align":0,"h3::align":0,"h4::align":0,"h5::align":0,"h6::align":0,"hr::align":0,"hr::noshade":0,"hr::size":0,"hr::width":0,"iframe::align":0,"iframe::frameborder":0,"iframe::height":0,"iframe::marginheight":0,"iframe::marginwidth":0,"iframe::width":0,"img::align":0,"img::alt":0,"img::border":0,"img::height":0,"img::hspace":0,"img::ismap":0,"img::name":7,"img::src":1,"img::usemap":11,"img::vspace":0,"img::width":0,"input::accept":0,"input::accesskey":0,"input::align":0,"input::alt":0,"input::autocomplete":0,"input::checked":0,"input::disabled":0,"input::inputmode":0,"input::ismap":0,"input::list":5,"input::max":0,"input::maxlength":0,"input::min":0,"input::multiple":0,"input::name":8,"input::onblur":2,"input::onchange":2,"input::onfocus":2,"input::onselect":2,"input::placeholder":0,"input::readonly":0,"input::required":0,"input::size":0,"input::src":1,"input::step":0,"input::tabindex":0,"input::type":0,"input::usemap":11,"input::value":0,"ins::cite":1,"ins::datetime":0,"label::accesskey":0,"label::for":5,"label::onblur":2,"label::onfocus":2,"legend::accesskey":0,"legend::align":0,"li::type":0,"li::value":0,"map::name":7,"menu::compact":0,"menu::label":0,"menu::type":0,"meter::high":0,"meter::low":0,"meter::max":0,"meter::min":0,"meter::value":0,"ol::compact":0,"ol::reversed":0,"ol::start":0,"ol::type":0,"optgroup::disabled":0,"optgroup::label":0,"option::disabled":0,"option::label":0,"option::selected":0,"option::value":0,"output::for":6,"output::name":8,"p::align":0,"pre::width":0,"progress::max":0,"progress::min":0,"progress::value":0,"q::cite":1,"select::autocomplete":0,"select::disabled":0,"select::multiple":0,"select::name":8,"select::onblur":2,"select::onchange":2,"select::onfocus":2,"select::required":0,"select::size":0,"select::tabindex":0,"source::type":0,"table::align":0,"table::bgcolor":0,"table::border":0,"table::cellpadding":0,"table::cellspacing":0,"table::frame":0,"table::rules":0,"table::summary":0,"table::width":0,"tbody::align":0,"tbody::char":0,"tbody::charoff":0,"tbody::valign":0,"td::abbr":0,"td::align":0,"td::axis":0,"td::bgcolor":0,"td::char":0,"td::charoff":0,"td::colspan":0,"td::headers":6,"td::height":0,"td::nowrap":0,"td::rowspan":0,"td::scope":0,"td::valign":0,"td::width":0,"textarea::accesskey":0,"textarea::autocomplete":0,"textarea::cols":0,"textarea::disabled":0,"textarea::inputmode":0,"textarea::name":8,"textarea::onblur":2,"textarea::onchange":2,"textarea::onfocus":2,"textarea::onselect":2,"textarea::placeholder":0,"textarea::readonly":0,"textarea::required":0,"textarea::rows":0,"textarea::tabindex":0,"textarea::wrap":0,"tfoot::align":0,"tfoot::char":0,"tfoot::charoff":0,"tfoot::valign":0,"th::abbr":0,"th::align":0,"th::axis":0,"th::bgcolor":0,"th::char":0,"th::charoff":0,"th::colspan":0,"th::headers":6,"th::height":0,"th::nowrap":0,"th::rowspan":0,"th::scope":0,"th::valign":0,"th::width":0,"thead::align":0,"thead::char":0,"thead::charoff":0,"thead::valign":0,"tr::align":0,"tr::bgcolor":0,"tr::char":0,"tr::charoff":0,"tr::valign":0,"track::default":0,"track::kind":0,"track::label":0,"track::srclang":0,"ul::compact":0,"ul::type":0,"video::controls":0,"video::height":0,"video::loop":0,"video::mediagroup":5,"video::muted":0,"video::poster":1,"video::preload":0,"video::width":0},o.ATTRIBS=o.ATTRIBS,o.eflags={OPTIONAL_ENDTAG:1,EMPTY:2,CDATA:4,RCDATA:8,UNSAFE:16,FOLDABLE:32,SCRIPT:64,STYLE:128,VIRTUALIZED:256},o.eflags=o.eflags,o.ELEMENTS={a:0,abbr:0,acronym:0,address:0,applet:272,area:2,article:0,aside:0,audio:0,b:0,base:274,basefont:274,bdi:0,bdo:0,big:0,blockquote:0,body:305,br:2,button:0,canvas:0,caption:0,center:0,cite:0,code:0,col:2,colgroup:1,command:2,data:0,datalist:0,dd:1,del:0,details:0,dfn:0,dialog:272,dir:0,div:0,dl:0,dt:1,em:0,fieldset:0,figcaption:0,figure:0,font:0,footer:0,form:0,frame:274,frameset:272,h1:0,h2:0,h3:0,h4:0,h5:0,h6:0,head:305,header:0,hgroup:0,hr:2,html:305,i:0,iframe:4,img:2,input:2,ins:0,isindex:274,kbd:0,keygen:274,label:0,legend:0,li:1,link:274,map:0,mark:0,menu:0,meta:274,meter:0,nav:0,nobr:0,noembed:276,noframes:276,noscript:276,object:272,ol:0,optgroup:0,option:1,output:0,p:1,param:274,pre:0,progress:0,q:0,s:0,samp:0,script:84,section:0,select:0,small:0,source:2,span:0,strike:0,strong:0,style:148,sub:0,summary:0,sup:0,table:0,tbody:1,td:1,textarea:8,tfoot:1,th:1,thead:1,time:0,title:280,tr:1,track:2,tt:0,u:0,ul:0,"var":0,video:0,wbr:2},o.ELEMENTS=o.ELEMENTS,o.ELEMENT_DOM_INTERFACES={a:"HTMLAnchorElement",abbr:"HTMLElement",acronym:"HTMLElement",address:"HTMLElement",applet:"HTMLAppletElement",area:"HTMLAreaElement",article:"HTMLElement",aside:"HTMLElement",audio:"HTMLAudioElement",b:"HTMLElement",base:"HTMLBaseElement",basefont:"HTMLBaseFontElement",bdi:"HTMLElement",bdo:"HTMLElement",big:"HTMLElement",blockquote:"HTMLQuoteElement",body:"HTMLBodyElement",br:"HTMLBRElement",button:"HTMLButtonElement",canvas:"HTMLCanvasElement",caption:"HTMLTableCaptionElement",center:"HTMLElement",cite:"HTMLElement",code:"HTMLElement",col:"HTMLTableColElement",colgroup:"HTMLTableColElement",command:"HTMLCommandElement",data:"HTMLElement",datalist:"HTMLDataListElement",dd:"HTMLElement",del:"HTMLModElement",details:"HTMLDetailsElement",dfn:"HTMLElement",dialog:"HTMLDialogElement",dir:"HTMLDirectoryElement",div:"HTMLDivElement",dl:"HTMLDListElement",dt:"HTMLElement",em:"HTMLElement",fieldset:"HTMLFieldSetElement",figcaption:"HTMLElement",figure:"HTMLElement",font:"HTMLFontElement",footer:"HTMLElement",form:"HTMLFormElement",frame:"HTMLFrameElement",frameset:"HTMLFrameSetElement",h1:"HTMLHeadingElement",h2:"HTMLHeadingElement",h3:"HTMLHeadingElement",h4:"HTMLHeadingElement",h5:"HTMLHeadingElement",h6:"HTMLHeadingElement",head:"HTMLHeadElement",header:"HTMLElement",hgroup:"HTMLElement",hr:"HTMLHRElement",html:"HTMLHtmlElement",i:"HTMLElement",iframe:"HTMLIFrameElement",img:"HTMLImageElement",input:"HTMLInputElement",ins:"HTMLModElement",isindex:"HTMLUnknownElement",kbd:"HTMLElement",keygen:"HTMLKeygenElement",label:"HTMLLabelElement",legend:"HTMLLegendElement",li:"HTMLLIElement",link:"HTMLLinkElement",map:"HTMLMapElement",mark:"HTMLElement",menu:"HTMLMenuElement",meta:"HTMLMetaElement",meter:"HTMLMeterElement",nav:"HTMLElement",nobr:"HTMLElement",noembed:"HTMLElement",noframes:"HTMLElement",noscript:"HTMLElement",object:"HTMLObjectElement",ol:"HTMLOListElement",optgroup:"HTMLOptGroupElement",option:"HTMLOptionElement",output:"HTMLOutputElement",p:"HTMLParagraphElement",param:"HTMLParamElement",pre:"HTMLPreElement",progress:"HTMLProgressElement",q:"HTMLQuoteElement",s:"HTMLElement",samp:"HTMLElement",script:"HTMLScriptElement",section:"HTMLElement",select:"HTMLSelectElement",small:"HTMLElement",source:"HTMLSourceElement",span:"HTMLSpanElement",strike:"HTMLElement",strong:"HTMLElement",style:"HTMLStyleElement",sub:"HTMLElement",summary:"HTMLElement",sup:"HTMLElement",table:"HTMLTableElement",tbody:"HTMLTableSectionElement",td:"HTMLTableDataCellElement",textarea:"HTMLTextAreaElement",tfoot:"HTMLTableSectionElement",th:"HTMLTableHeaderCellElement",thead:"HTMLTableSectionElement",time:"HTMLTimeElement",title:"HTMLTitleElement",tr:"HTMLTableRowElement",track:"HTMLTrackElement",tt:"HTMLElement",u:"HTMLElement",ul:"HTMLUListElement","var":"HTMLElement",video:"HTMLVideoElement",wbr:"HTMLElement"},o.ELEMENT_DOM_INTERFACES=o.ELEMENT_DOM_INTERFACES,o.ueffects={NOT_LOADED:0,SAME_DOCUMENT:1,NEW_DOCUMENT:2},o.ueffects=o.ueffects,o.URIEFFECTS={"a::href":2,"area::href":2,"blockquote::cite":0,"command::icon":1,"del::cite":0,"form::action":2,"img::src":1,"input::src":1,"ins::cite":0,"q::cite":0,"video::poster":1},o.URIEFFECTS=o.URIEFFECTS,o.ltypes={UNSANDBOXED:2,SANDBOXED:1,DATA:0},o.ltypes=o.ltypes,o.LOADERTYPES={"a::href":2,"area::href":2,"blockquote::cite":2,"command::icon":1,"del::cite":2,"form::action":2,"img::src":1,"input::src":1,"ins::cite":2,"q::cite":2,"video::poster":1},o.LOADERTYPES=o.LOADERTYPES,"i"!=="I".toLowerCase())throw"I/i problem";var i=function(t){function e(t){if(R.hasOwnProperty(t))return R[t];var e=t.match(D);if(e)return String.fromCharCode(parseInt(e[1],10));if(e=t.match(A))return String.fromCharCode(parseInt(e[1],16));if(P&&U.test(t)){P.innerHTML="&"+t+";";var n=P.textContent;return R[t]=n,n}return"&"+t+";"}function o(t,n){return e(n)}function i(t){return t.replace(O,"")}function r(t){return t.replace(j,o)}function a(t){return(""+t).replace(N,"&amp;").replace(q,"&lt;").replace(F,"&gt;").replace(B,"&#34;")}function s(t){return t.replace(z,"&amp;$1").replace(q,"&lt;").replace(F,"&gt;")}function l(t){var e={cdata:t.cdata||t.cdata,comment:t.comment||t.comment,endDoc:t.endDoc||t.endDoc,endTag:t.endTag||t.endTag,pcdata:t.pcdata||t.pcdata,rcdata:t.rcdata||t.rcdata,startDoc:t.startDoc||t.startDoc,startTag:t.startTag||t.startTag};return function(t,n){return c(t,e,n)}}function c(t,e,n){var o=p(t),i={noMoreGT:!1,noMoreEndComments:!1};h(e,o,0,i,n)}function u(t,e,n,o,i){return function(){h(t,e,n,o,i)}}function h(e,n,o,i,r){try{e.startDoc&&0==o&&e.startDoc(r);for(var a,s,l,c=o,h=n.length;h>c;){var p=n[c++],g=n[c];switch(p){case"&":I.test(g)?(e.pcdata&&e.pcdata("&"+g,r,$,u(e,n,c,i,r)),c++):e.pcdata&&e.pcdata("&amp;",r,$,u(e,n,c,i,r));break;case"</":(a=/^([-\w:]+)[^\'\"]*/.exec(g))?a[0].length===g.length&&">"===n[c+1]?(c+=2,l=a[1].toLowerCase(),e.endTag&&e.endTag(l,r,$,u(e,n,c,i,r))):c=d(n,c,e,r,$,i):e.pcdata&&e.pcdata("&lt;/",r,$,u(e,n,c,i,r));break;case"<":if(a=/^([-\w:]+)\s*\/?/.exec(g))if(a[0].length===g.length&&">"===n[c+1]){c+=2,l=a[1].toLowerCase(),e.startTag&&e.startTag(l,[],r,$,u(e,n,c,i,r));var _=t.ELEMENTS[l];if(_&Z){var L={name:l,next:c,eflags:_};c=f(n,L,e,r,$,i)}}else c=m(n,c,e,r,$,i);else e.pcdata&&e.pcdata("&lt;",r,$,u(e,n,c,i,r));break;case"<!--":if(!i.noMoreEndComments){for(s=c+1;h>s&&(">"!==n[s]||!/--$/.test(n[s-1]));s++);if(h>s){if(e.comment){var v=n.slice(c,s).join("");e.comment(v.substr(0,v.length-2),r,$,u(e,n,s+1,i,r))}c=s+1}else i.noMoreEndComments=!0}i.noMoreEndComments&&e.pcdata&&e.pcdata("&lt;!--",r,$,u(e,n,c,i,r));break;case"<!":if(/^\w/.test(g)){if(!i.noMoreGT){for(s=c+1;h>s&&">"!==n[s];s++);h>s?c=s+1:i.noMoreGT=!0}i.noMoreGT&&e.pcdata&&e.pcdata("&lt;!",r,$,u(e,n,c,i,r))}else e.pcdata&&e.pcdata("&lt;!",r,$,u(e,n,c,i,r));break;case"<?":if(!i.noMoreGT){for(s=c+1;h>s&&">"!==n[s];s++);h>s?c=s+1:i.noMoreGT=!0}i.noMoreGT&&e.pcdata&&e.pcdata("&lt;?",r,$,u(e,n,c,i,r));break;case">":e.pcdata&&e.pcdata("&gt;",r,$,u(e,n,c,i,r));break;case"":break;default:e.pcdata&&e.pcdata(p,r,$,u(e,n,c,i,r))}}e.endDoc&&e.endDoc(r)}catch(y){if(y!==$)throw y}}function p(t){var e=/(<\/|<\!--|<[!?]|[&<>])/g;if(t+="",J)return t.split(e);for(var n,o=[],i=0;null!==(n=e.exec(t));)o.push(t.substring(i,n.index)),o.push(n[0]),i=n.index+n[0].length;return o.push(t.substring(i)),o}function d(t,e,n,o,i,r){var a=g(t,e);return a?(n.endTag&&n.endTag(a.name,o,i,u(n,t,e,r,o)),a.next):t.length}function m(t,e,n,o,i,r){var a=g(t,e);return a?(n.startTag&&n.startTag(a.name,a.attrs,o,i,u(n,t,a.next,r,o)),a.eflags&Z?f(t,a,n,o,i,r):a.next):t.length}function f(e,n,o,i,r,a){var l=e.length;Q.hasOwnProperty(n.name)||(Q[n.name]=new RegExp("^"+n.name+"(?:[\\s\\/]|$)","i"));for(var c=Q[n.name],h=n.next,p=n.next+1;l>p&&("</"!==e[p-1]||!c.test(e[p]));p++);l>p&&(p-=1);var d=e.slice(h,p).join("");if(n.eflags&t.eflags.CDATA)o.cdata&&o.cdata(d,i,r,u(o,e,p,a,i));else{if(!(n.eflags&t.eflags.RCDATA))throw new Error("bug");o.rcdata&&o.rcdata(s(d),i,r,u(o,e,p,a,i))}return p}function g(e,n){var o=/^([-\w:]+)/.exec(e[n]),i={};i.name=o[1].toLowerCase(),i.eflags=t.ELEMENTS[i.name];for(var r=e[n].substr(o[0].length),a=n+1,s=e.length;s>a&&">"!==e[a];a++)r+=e[a];if(a>=s)return void 0;for(var l=[];""!==r;)if(o=G.exec(r)){if(o[4]&&!o[5]||o[6]&&!o[7]){for(var c=o[4]||o[6],u=!1,h=[r,e[a++]];s>a;a++){if(u){if(">"===e[a])break}else 0<=e[a].indexOf(c)&&(u=!0);h.push(e[a])}if(a>=s)break;r=h.join("");continue}var p=o[1].toLowerCase(),d=o[2]?_(o[3]):"";l.push(p,d),r=r.substr(o[0].length)}else r=r.replace(/^[\s\S][^a-z\s]*/,"");return i.attrs=l,i.next=a+1,i}function _(t){var e=t.charCodeAt(0);return(34===e||39===e)&&(t=t.substr(1,t.length-2)),r(i(t))}function L(e){var n,o,i=function(t,e){o||e.push(t)};return l({startDoc:function(){n=[],o=!1},startTag:function(i,r,s){if(!o&&t.ELEMENTS.hasOwnProperty(i)){var l=t.ELEMENTS[i];if(!(l&t.eflags.FOLDABLE)){var c=e(i,r);if(!c)return o=!(l&t.eflags.EMPTY),void 0;if("object"!=typeof c)throw new Error("tagPolicy did not return object (old API?)");if(!("attribs"in c))throw new Error("tagPolicy gave no attribs");r=c.attribs;var u,h;if("tagName"in c?(h=c.tagName,u=t.ELEMENTS[h]):(h=i,u=l),l&t.eflags.OPTIONAL_ENDTAG){var p=n[n.length-1];!p||p.orig!==i||p.rep===h&&i===h||s.push("</",p.rep,">")}l&t.eflags.EMPTY||n.push({orig:i,rep:h}),s.push("<",h);for(var d=0,m=r.length;m>d;d+=2){var f=r[d],g=r[d+1];null!==g&&void 0!==g&&s.push(" ",f,'="',a(g),'"')}s.push(">"),l&t.eflags.EMPTY&&!(u&t.eflags.EMPTY)&&s.push("</",h,">")}}},endTag:function(e,i){if(o)return o=!1,void 0;if(t.ELEMENTS.hasOwnProperty(e)){var r=t.ELEMENTS[e];if(!(r&(t.eflags.EMPTY|t.eflags.FOLDABLE))){var a;if(r&t.eflags.OPTIONAL_ENDTAG)for(a=n.length;--a>=0;){var s=n[a].orig;if(s===e)break;if(!(t.ELEMENTS[s]&t.eflags.OPTIONAL_ENDTAG))return}else for(a=n.length;--a>=0&&n[a].orig!==e;);if(0>a)return;for(var l=n.length;--l>a;){var c=n[l].rep;t.ELEMENTS[c]&t.eflags.OPTIONAL_ENDTAG||i.push("</",c,">")}a<n.length&&(e=n[a].rep),n.length=a,i.push("</",e,">")}}},pcdata:i,rcdata:i,cdata:i,endDoc:function(t){for(;n.length;n.length--)t.push("</",n[n.length-1].rep,">")}})}function v(t,e,o,i,r){if(!r)return null;try{var a=n.parse(""+t);if(a&&(!a.hasScheme()||Y.test(a.getScheme()))){var s=r(a,e,o,i);return s?s.toString():null}}catch(l){return null}return null}function y(t,e,n,o,i){if(n||t(e+" removed",{change:"removed",tagName:e}),o!==i){var r="changed";o&&!i?r="removed":!o&&i&&(r="added"),t(e+"."+n+" "+r,{change:r,tagName:e,attribName:n,oldValue:o,newValue:i})}}function b(t,e,n){var o;return o=e+"::"+n,t.hasOwnProperty(o)?t[o]:(o="*::"+n,t.hasOwnProperty(o)?t[o]:void 0)}function T(e,n){return b(t.LOADERTYPES,e,n)}function E(e,n){return b(t.URIEFFECTS,e,n)}function C(e,n,o,i,r){for(var a=0;a<n.length;a+=2){var s,l=n[a],c=n[a+1],u=c,h=null;if(s=e+"::"+l,(t.ATTRIBS.hasOwnProperty(s)||(s="*::"+l,t.ATTRIBS.hasOwnProperty(s)))&&(h=t.ATTRIBS[s]),null!==h)switch(h){case t.atype.NONE:break;case t.atype.SCRIPT:c=null,r&&y(r,e,l,u,c);break;case t.atype.STYLE:if("undefined"==typeof k){c=null,r&&y(r,e,l,u,c);break}var p=[];k(c,{declaration:function(e,n){var i=e.toLowerCase(),r=H[i];r&&(S(i,r,n,o?function(e){return v(e,t.ueffects.SAME_DOCUMENT,t.ltypes.SANDBOXED,{TYPE:"CSS",CSS_PROP:i},o)}:null),p.push(e+": "+n.join(" ")))}}),c=p.length>0?p.join(" ; "):null,r&&y(r,e,l,u,c);break;case t.atype.ID:case t.atype.IDREF:case t.atype.IDREFS:case t.atype.GLOBAL_NAME:case t.atype.LOCAL_NAME:case t.atype.CLASSES:c=i?i(c):c,r&&y(r,e,l,u,c);break;case t.atype.URI:c=v(c,E(e,l),T(e,l),{TYPE:"MARKUP",XML_ATTR:l,XML_TAG:e},o),r&&y(r,e,l,u,c);break;case t.atype.URI_FRAGMENT:c&&"#"===c.charAt(0)?(c=c.substring(1),c=i?i(c):c,null!==c&&void 0!==c&&(c="#"+c)):c=null,r&&y(r,e,l,u,c);break;default:c=null,r&&y(r,e,l,u,c)}else c=null,r&&y(r,e,l,u,c);n[a+1]=c}return n}function w(e,n,o){return function(i,r){return t.ELEMENTS[i]&t.eflags.UNSAFE?(o&&y(o,i,void 0,void 0,void 0),void 0):{attribs:C(i,r,e,n,o)}}}function x(t,e){var n=[];return L(e)(t,n),n.join("")}function M(t,e,n,o){var i=w(e,n,o);return x(t,i)}var k,S,H;"undefined"!=typeof window&&(k=window.parseCssDeclarations,S=window.sanitizeCssProperty,H=window.cssSchema);var R={lt:"<",LT:"<",gt:">",GT:">",amp:"&",AMP:"&",quot:'"',apos:"'",nbsp:"Â "},D=/^#(\d+)$/,A=/^#x([0-9A-Fa-f]+)$/,U=/^[A-Za-z][A-za-z0-9]+$/,P="undefined"!=typeof window&&window.document?window.document.createElement("textarea"):null,O=/\0/g,j=/&(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/g,I=/^(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/,N=/&/g,z=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi,q=/[<]/g,F=/>/g,B=/\"/g,G=new RegExp("^\\s*([-.:\\w]+)(?:\\s*(=)\\s*((\")[^\"]*(\"|$)|(')[^']*('|$)|(?=[a-z][-\\w]*\\s*=)|[^\"'\\s]*))?","i"),J=3==="a,b".split(/(,)/).length,Z=t.eflags.CDATA|t.eflags.RCDATA,$={},Q={},Y=/^(?:https?|mailto|data)$/i,V={};
return V.escapeAttrib=V.escapeAttrib=a,V.makeHtmlSanitizer=V.makeHtmlSanitizer=L,V.makeSaxParser=V.makeSaxParser=l,V.makeTagPolicy=V.makeTagPolicy=w,V.normalizeRCData=V.normalizeRCData=s,V.sanitize=V.sanitize=M,V.sanitizeAttribs=V.sanitizeAttribs=C,V.sanitizeWithPolicy=V.sanitizeWithPolicy=x,V.unescapeEntities=V.unescapeEntities=r,V}(o),r=i.sanitize;o.ATTRIBS["*::style"]=0,o.ELEMENTS.style=0,o.ATTRIBS["a::target"]=0,o.ELEMENTS.video=0,o.ATTRIBS["video::src"]=0,o.ATTRIBS["video::poster"]=0,o.ATTRIBS["video::controls"]=0,o.ELEMENTS.audio=0,o.ATTRIBS["audio::src"]=0,o.ATTRIBS["video::autoplay"]=0,o.ATTRIBS["video::controls"]=0,"undefined"!=typeof e&&(e.exports=r)},{}],5:[function(t,e){e.exports={author:"Mapbox",name:"mapbox.js",description:"mapbox javascript api",version:"2.1.2",homepage:"http://mapbox.com/",repository:{type:"git",url:"git://github.com/mapbox/mapbox.js.git"},main:"src/index.js",dependencies:{leaflet:"0.7.3",mustache:"0.7.3",corslite:"0.0.6","sanitize-caja":"0.1.2"},scripts:{test:"jshint src/*.js && mocha-phantomjs test/index.html"},devDependencies:{"leaflet-hash":"0.2.1","leaflet-fullscreen":"0.0.0","uglify-js":"2.4.8",mocha:"1.17.1","expect.js":"0.3.1",sinon:"1.10.2","mocha-phantomjs":"3.1.6",happen:"0.1.3",browserify:"3.23.1",jshint:"2.4.4","clean-css":"~2.0.7",minimist:"0.0.5",marked:"~0.3.0"},optionalDependencies:{},engines:{node:"*"}}},{}],6:[function(t,e){"use strict";e.exports={HTTP_URL:"http://a.tiles.mapbox.com/v4",HTTPS_URL:"https://a.tiles.mapbox.com/v4",FORCE_HTTPS:!1,REQUIRE_ACCESS_TOKEN:!0}},{}],7:[function(t,e){"use strict";var n=t("./util"),o=t("./url"),i=t("./request"),r=t("./marker"),a=t("./simplestyle"),s=L.FeatureGroup.extend({options:{filter:function(){return!0},sanitizer:t("sanitize-caja"),style:a.style,popupOptions:{closeButton:!1}},initialize:function(t,e){L.setOptions(this,e),this._layers={},"string"==typeof t?n.idUrl(t,this):t&&"object"==typeof t&&this.setGeoJSON(t)},setGeoJSON:function(t){return this._geojson=t,this.clearLayers(),this._initialize(t),this},getGeoJSON:function(){return this._geojson},loadURL:function(t){return this._request&&"abort"in this._request&&this._request.abort(),this._request=i(t,L.bind(function(e,o){this._request=null,e&&"abort"!==e.type?(n.log("could not load features at "+t),this.fire("error",{error:e})):o&&(this.setGeoJSON(o),this.fire("ready"))},this)),this},loadID:function(t){return this.loadURL(o("/"+t+"/features.json",this.options.accessToken))},setFilter:function(t){return this.options.filter=t,this._geojson&&(this.clearLayers(),this._initialize(this._geojson)),this},getFilter:function(){return this.options.filter},_initialize:function(t){var e,n,o=L.Util.isArray(t)?t:t.features;if(o)for(e=0,n=o.length;n>e;e++)(o[e].geometries||o[e].geometry||o[e].features)&&this._initialize(o[e]);else if(this.options.filter(t)){var i={accessToken:this.options.accessToken},s=L.GeoJSON.geometryToLayer(t,function(t,e){return r.style(t,e,i)}),l=r.createPopup(t,this.options.sanitizer);"setStyle"in s&&s.setStyle(a.style(t)),s.feature=t,l&&s.bindPopup(l,this.options.popupOptions),this.addLayer(s)}}});e.exports.FeatureLayer=s,e.exports.featureLayer=function(t,e){return new s(t,e)}},{"./marker":18,"./request":19,"./simplestyle":21,"./url":23,"./util":24,"sanitize-caja":3}],8:[function(t,e){"use strict";var n=t("./util"),o=t("./url"),i=t("./request");e.exports=function(t,e){var r={};return n.strict(t,"string"),-1===t.indexOf("/")&&(t=o("/geocode/"+t+"/{query}.json",e&&e.accessToken)),r.getURL=function(){return t},r.queryURL=function(t){if("string"!=typeof t){for(var e=[],n=0;n<t.length;n++)e[n]=encodeURIComponent(t[n]);return L.Util.template(r.getURL(),{query:e.join(";")})}return L.Util.template(r.getURL(),{query:encodeURIComponent(t)})},r.query=function(t,e){return n.strict(e,"function"),i(r.queryURL(t),function(t,o){if(o&&(o.length||o.features)){var i={results:o};o.features&&o.features.length&&(i.latlng=[o.features[0].center[1],o.features[0].center[0]],o.features[0].bbox&&(i.bounds=o.features[0].bbox,i.lbounds=n.lbounds(i.bounds))),e(null,i)}else e(t||!0)}),r},r.reverseQuery=function(t,e){function n(t){return void 0!==t.lat&&void 0!==t.lng?t.lng+","+t.lat:void 0!==t.lat&&void 0!==t.lon?t.lon+","+t.lat:t[0]+","+t[1]}var o="";if(t.length&&t[0].length){for(var a=0,s=[];a<t.length;a++)s.push(n(t[a]));o=s.join(";")}else o=n(t);return i(r.queryURL(o),function(t,n){e(t,n)}),r},r}},{"./request":19,"./url":23,"./util":24}],9:[function(t,e){"use strict";var n=t("./geocoder"),o=t("./util"),i=L.Control.extend({includes:L.Mixin.Events,options:{position:"topleft",pointZoom:16,keepOpen:!1,autocomplete:!1},initialize:function(t,e){L.Util.setOptions(this,e),this.setURL(t),this._updateSubmit=L.bind(this._updateSubmit,this),this._updateAutocomplete=L.bind(this._updateAutocomplete,this),this._chooseResult=L.bind(this._chooseResult,this)},setURL:function(t){return this.geocoder=n(t,{accessToken:this.options.accessToken}),this},getURL:function(){return this.geocoder.getURL()},setID:function(t){return this.setURL(t)},setTileJSON:function(t){return this.setURL(t.geocoder)},_toggle:function(t){t&&L.DomEvent.stop(t),L.DomUtil.hasClass(this._container,"active")?(L.DomUtil.removeClass(this._container,"active"),this._results.innerHTML="",this._input.blur()):(L.DomUtil.addClass(this._container,"active"),this._input.focus(),this._input.select())},_closeIfOpen:function(){L.DomUtil.hasClass(this._container,"active")&&!this.options.keepOpen&&(L.DomUtil.removeClass(this._container,"active"),this._results.innerHTML="",this._input.blur())},onAdd:function(t){var e=L.DomUtil.create("div","leaflet-control-mapbox-geocoder leaflet-bar leaflet-control"),n=L.DomUtil.create("a","leaflet-control-mapbox-geocoder-toggle mapbox-icon mapbox-icon-geocoder",e),o=L.DomUtil.create("div","leaflet-control-mapbox-geocoder-results",e),i=L.DomUtil.create("div","leaflet-control-mapbox-geocoder-wrap",e),r=L.DomUtil.create("form","leaflet-control-mapbox-geocoder-form",i),a=L.DomUtil.create("input","",r);return n.href="#",n.innerHTML="&nbsp;",a.type="text",a.setAttribute("placeholder","Search"),L.DomEvent.addListener(r,"submit",this._geocode,this),L.DomEvent.addListener(a,"keyup",this._autocomplete,this),L.DomEvent.disableClickPropagation(e),this._map=t,this._results=o,this._input=a,this._form=r,this.options.keepOpen?L.DomUtil.addClass(e,"active"):(this._map.on("click",this._closeIfOpen,this),L.DomEvent.addListener(n,"click",this._toggle,this)),e},_updateSubmit:function(t,e){if(L.DomUtil.removeClass(this._container,"searching"),this._results.innerHTML="",t||!e)this.fire("error",{error:t});else{var n=[];e.results&&e.results.features&&(n=e.results.features),1===n.length?(this.fire("autoselect",{feature:n[0]}),this.fire("found",{results:e.results}),this._chooseResult(n[0]),this._closeIfOpen()):n.length>1?(this.fire("found",{results:e.results}),this._displayResults(n)):this._displayResults(n)}},_updateAutocomplete:function(t,e){if(this._results.innerHTML="",t||!e)this.fire("error",{error:t});else{var n=[];e.results&&e.results.features&&(n=e.results.features),this._displayResults(n)}},_displayResults:function(t){for(var e=0,n=Math.min(t.length,5);n>e;e++){var o=t[e],i=o.place_name;if(i.length){var r=L.DomUtil.create("a","",this._results),a="innerText"in r?"innerText":"textContent";r[a]=i,r.href="#",L.bind(function(t){L.DomEvent.addListener(r,"click",function(e){this._chooseResult(t),L.DomEvent.stop(e),this.fire("select",{feature:t})},this)},this)(o)}}if(t.length>5){var s=L.DomUtil.create("span","",this._results);s.innerHTML="Top 5 of "+t.length+"  results"}},_chooseResult:function(t){t.bbox?this._map.fitBounds(o.lbounds(t.bbox)):t.center&&this._map.setView([t.center[1],t.center[0]],void 0===this._map.getZoom()?this.options.pointZoom:Math.max(this._map.getZoom(),this.options.pointZoom))},_geocode:function(t){return L.DomEvent.preventDefault(t),""===this._input.value?this._updateSubmit():(L.DomUtil.addClass(this._container,"searching"),this.geocoder.query(this._input.value,this._updateSubmit),void 0)},_autocomplete:function(){return this.options.autocomplete?""===this._input.value?this._updateAutocomplete():(this.geocoder.query(this._input.value,this._updateAutocomplete),void 0):void 0}});e.exports.GeocoderControl=i,e.exports.geocoderControl=function(t,e){return new i(t,e)}},{"./geocoder":8,"./util":24}],10:[function(t,e){"use strict";function n(t){return t>=93&&t--,t>=35&&t--,t-32}e.exports=function(t){return function(e,o){if(t){var i=n(t.grid[o].charCodeAt(e)),r=t.keys[i];return t.data[r]}}}},{}],11:[function(t,e){"use strict";var n=t("./util"),o=t("mustache"),i=L.Control.extend({options:{pinnable:!0,follow:!1,sanitizer:t("sanitize-caja"),touchTeaser:!0,location:!0},_currentContent:"",_pinned:!1,initialize:function(t,e){L.Util.setOptions(this,e),n.strict_instance(t,L.Class,"L.mapbox.gridLayer"),this._layer=t},setTemplate:function(t){return n.strict(t,"string"),this.options.template=t,this},_template:function(t,e){if(e){var n=this.options.template||this._layer.getTileJSON().template;if(n){var i={};return i["__"+t+"__"]=!0,this.options.sanitizer(o.to_html(n,L.extend(i,e)))}}},_show:function(t,e){t!==this._currentContent&&(this._currentContent=t,this.options.follow?(this._popup.setContent(t).setLatLng(e.latLng),this._map._popup!==this._popup&&this._popup.openOn(this._map)):(this._container.style.display="block",this._contentWrapper.innerHTML=t))},hide:function(){return this._pinned=!1,this._currentContent="",this._map.closePopup(),this._container.style.display="none",this._contentWrapper.innerHTML="",L.DomUtil.removeClass(this._container,"closable"),this},_mouseover:function(t){if(t.data?L.DomUtil.addClass(this._map._container,"map-clickable"):L.DomUtil.removeClass(this._map._container,"map-clickable"),!this._pinned){var e=this._template("teaser",t.data);e?this._show(e,t):this.hide()}},_mousemove:function(t){this._pinned||this.options.follow&&this._popup.setLatLng(t.latLng)},_navigateTo:function(t){window.top.location.href=t},_click:function(t){var e=this._template("location",t.data);if(this.options.location&&e&&0===e.search(/^https?:/))return this._navigateTo(this._template("location",t.data));if(this.options.pinnable){var n=this._template("full",t.data);!n&&this.options.touchTeaser&&L.Browser.touch&&(n=this._template("teaser",t.data)),n?(L.DomUtil.addClass(this._container,"closable"),this._pinned=!0,this._show(n,t)):this._pinned&&(L.DomUtil.removeClass(this._container,"closable"),this._pinned=!1,this.hide())}},_onPopupClose:function(){this._currentContent=null,this._pinned=!1},_createClosebutton:function(t,e){var n=L.DomUtil.create("a","close",t);return n.innerHTML="close",n.href="#",n.title="close",L.DomEvent.on(n,"click",L.DomEvent.stopPropagation).on(n,"mousedown",L.DomEvent.stopPropagation).on(n,"dblclick",L.DomEvent.stopPropagation).on(n,"click",L.DomEvent.preventDefault).on(n,"click",e,this),n},onAdd:function(t){this._map=t;var e="leaflet-control-grid map-tooltip",n=L.DomUtil.create("div",e),o=L.DomUtil.create("div","map-tooltip-content");return n.style.display="none",this._createClosebutton(n,this.hide),n.appendChild(o),this._contentWrapper=o,this._popup=new L.Popup({autoPan:!1,closeOnClick:!1}),t.on("popupclose",this._onPopupClose,this),L.DomEvent.disableClickPropagation(n).addListener(n,"mousewheel",L.DomEvent.stopPropagation),this._layer.on("mouseover",this._mouseover,this).on("mousemove",this._mousemove,this).on("click",this._click,this),n},onRemove:function(t){t.off("popupclose",this._onPopupClose,this),this._layer.off("mouseover",this._mouseover,this).off("mousemove",this._mousemove,this).off("click",this._click,this)}});e.exports.GridControl=i,e.exports.gridControl=function(t,e){return new i(t,e)}},{"./util":24,mustache:2,"sanitize-caja":3}],12:[function(t,e){"use strict";var n=t("./util"),o=t("./request"),i=t("./grid"),r=L.Class.extend({includes:[L.Mixin.Events,t("./load_tilejson")],options:{template:function(){return""}},_mouseOn:null,_tilejson:{},_cache:{},initialize:function(t,e){L.Util.setOptions(this,e),this._loadTileJSON(t)},_setTileJSON:function(t){return n.strict(t,"object"),L.extend(this.options,{grids:t.grids,minZoom:t.minzoom,maxZoom:t.maxzoom,bounds:t.bounds&&n.lbounds(t.bounds)}),this._tilejson=t,this._cache={},this._update(),this},getTileJSON:function(){return this._tilejson},active:function(){return!!(this._map&&this.options.grids&&this.options.grids.length)},addTo:function(t){return t.addLayer(this),this},onAdd:function(t){this._map=t,this._update(),this._map.on("click",this._click,this).on("mousemove",this._move,this).on("moveend",this._update,this)},onRemove:function(){this._map.off("click",this._click,this).off("mousemove",this._move,this).off("moveend",this._update,this)},getData:function(t,e){if(this.active()){var n=this._map,o=n.project(t.wrap()),i=256,r=4,a=Math.floor(o.x/i),s=Math.floor(o.y/i),l=n.options.crs.scale(n.getZoom())/i;return a=(a+l)%l,s=(s+l)%l,this._getTile(n.getZoom(),a,s,function(t){var n=Math.floor((o.x-a*i)/r),l=Math.floor((o.y-s*i)/r);e(t(n,l))}),this}},_click:function(t){this.getData(t.latlng,L.bind(function(e){this.fire("click",{latLng:t.latlng,data:e})},this))},_move:function(t){this.getData(t.latlng,L.bind(function(e){e!==this._mouseOn?(this._mouseOn&&this.fire("mouseout",{latLng:t.latlng,data:this._mouseOn}),this.fire("mouseover",{latLng:t.latlng,data:e}),this._mouseOn=e):this.fire("mousemove",{latLng:t.latlng,data:e})},this))},_getTileURL:function(t){var e=this.options.grids,n=(t.x+t.y)%e.length,o=e[n];return L.Util.template(o,t)},_update:function(){if(this.active()){var t=this._map.getPixelBounds(),e=this._map.getZoom(),n=256;if(!(e>this.options.maxZoom||e<this.options.minZoom))for(var o=L.bounds(t.min.divideBy(n)._floor(),t.max.divideBy(n)._floor()),i=this._map.options.crs.scale(e)/n,r=o.min.x;r<=o.max.x;r++)for(var a=o.min.y;a<=o.max.y;a++)this._getTile(e,(r%i+i)%i,(a%i+i)%i)}},_getTile:function(t,e,n,r){var a=t+"_"+e+"_"+n,s=L.point(e,n);if(s.z=t,this._tileShouldBeLoaded(s)){if(a in this._cache){if(!r)return;return"function"==typeof this._cache[a]?r(this._cache[a]):this._cache[a].push(r),void 0}this._cache[a]=[],r&&this._cache[a].push(r),o(this._getTileURL(s),L.bind(function(t,e){var n=this._cache[a];this._cache[a]=i(e);for(var o=0;o<n.length;++o)n[o](this._cache[a])},this))}},_tileShouldBeLoaded:function(t){if(t.z>this.options.maxZoom||t.z<this.options.minZoom)return!1;if(this.options.bounds){var e=256,n=t.multiplyBy(e),o=n.add(new L.Point(e,e)),i=this._map.unproject(n),r=this._map.unproject(o),a=new L.LatLngBounds([i,r]);if(!this.options.bounds.intersects(a))return!1}return!0}});e.exports.GridLayer=r,e.exports.gridLayer=function(t,e){return new r(t,e)}},{"./grid":10,"./load_tilejson":15,"./request":19,"./util":24}],13:[function(t,e){"use strict";var n=L.Control.extend({options:{position:"bottomright",sanitizer:t("sanitize-caja")},initialize:function(t){L.setOptions(this,t),this._info={}},onAdd:function(t){this._container=L.DomUtil.create("div","mapbox-control-info mapbox-small"),this._content=L.DomUtil.create("div","map-info-container",this._container);var e=L.DomUtil.create("a","mapbox-info-toggle mapbox-icon mapbox-icon-info",this._container);e.href="#",L.DomEvent.addListener(e,"click",this._showInfo,this),L.DomEvent.disableClickPropagation(this._container);for(var n in t._layers)t._layers[n].getAttribution&&this.addInfo(t._layers[n].getAttribution());return t.on("layeradd",this._onLayerAdd,this).on("layerremove",this._onLayerRemove,this),this._update(),this._container},onRemove:function(t){t.off("layeradd",this._onLayerAdd,this).off("layerremove",this._onLayerRemove,this)},addInfo:function(t){return t?(this._info[t]||(this._info[t]=0),this._info[t]=!0,this._update()):this},removeInfo:function(t){return t?(this._info[t]&&(this._info[t]=!1),this._update()):this},_showInfo:function(t){return L.DomEvent.preventDefault(t),this._active===!0?this._hidecontent():(L.DomUtil.addClass(this._container,"active"),this._active=!0,this._update(),void 0)},_hidecontent:function(){this._content.innerHTML="",this._active=!1,L.DomUtil.removeClass(this._container,"active")},_update:function(){if(!this._map)return this;this._content.innerHTML="";var t="none",e=[];for(var n in this._info)this._info.hasOwnProperty(n)&&this._info[n]&&(e.push(this.options.sanitizer(n)),t="block");return this._content.innerHTML+=e.join(" | "),this._container.style.display=t,this},_onLayerAdd:function(t){t.layer.getAttribution&&t.layer.getAttribution()?this.addInfo(t.layer.getAttribution()):"on"in t.layer&&t.layer.getAttribution&&t.layer.on("ready",L.bind(function(){this.addInfo(t.layer.getAttribution())},this))},_onLayerRemove:function(t){t.layer.getAttribution&&this.removeInfo(t.layer.getAttribution())}});e.exports.InfoControl=n,e.exports.infoControl=function(t){return new n(t)}},{"sanitize-caja":3}],14:[function(t,e){"use strict";var n=L.Control.extend({options:{position:"bottomright",sanitizer:t("sanitize-caja")},initialize:function(t){L.setOptions(this,t),this._legends={}},onAdd:function(){return this._container=L.DomUtil.create("div","map-legends wax-legends"),L.DomEvent.disableClickPropagation(this._container),this._update(),this._container},addLegend:function(t){return t?(this._legends[t]||(this._legends[t]=0),this._legends[t]++,this._update()):this},removeLegend:function(t){return t?(this._legends[t]&&this._legends[t]--,this._update()):this},_update:function(){if(!this._map)return this;this._container.innerHTML="";var t="none";for(var e in this._legends)if(this._legends.hasOwnProperty(e)&&this._legends[e]){var n=L.DomUtil.create("div","map-legend wax-legend",this._container);n.innerHTML=this.options.sanitizer(e),t="block"}return this._container.style.display=t,this}});e.exports.LegendControl=n,e.exports.legendControl=function(t){return new n(t)}},{"sanitize-caja":3}],15:[function(t,e){"use strict";var n=t("./request"),o=t("./url"),i=t("./util");e.exports={_loadTileJSON:function(t){"string"==typeof t?(t=o.tileJSON(t,this.options&&this.options.accessToken),n(t,L.bind(function(e,n){e?(i.log("could not load TileJSON at "+t),this.fire("error",{error:e})):n&&(this._setTileJSON(n),this.fire("ready"))},this))):t&&"object"==typeof t&&this._setTileJSON(t)}}},{"./request":19,"./url":23,"./util":24}],16:[function(t,e){"use strict";function n(t,e){return!e||t.accessToken?t:L.extend({accessToken:e},t)}var o=(t("./util"),t("./tile_layer").tileLayer),i=t("./feature_layer").featureLayer,r=t("./grid_layer").gridLayer,a=t("./grid_control").gridControl,s=t("./info_control").infoControl,l=t("./share_control").shareControl,c=t("./legend_control").legendControl,u=L.Map.extend({includes:[t("./load_tilejson")],options:{tileLayer:{},featureLayer:{},gridLayer:{},legendControl:{},gridControl:{},infoControl:!1,shareControl:!1},_tilejson:{},initialize:function(t,e,u){L.Map.prototype.initialize.call(this,t,L.extend({},L.Map.prototype.options,u)),this.attributionControl&&this.attributionControl.setPrefix(""),this.options.tileLayer&&(this.tileLayer=o(void 0,n(this.options.tileLayer,this.options.accessToken)),this.addLayer(this.tileLayer)),this.options.featureLayer&&(this.featureLayer=i(void 0,n(this.options.featureLayer,this.options.accessToken)),this.addLayer(this.featureLayer)),this.options.gridLayer&&(this.gridLayer=r(void 0,n(this.options.gridLayer,this.options.accessToken)),this.addLayer(this.gridLayer)),this.options.gridLayer&&this.options.gridControl&&(this.gridControl=a(this.gridLayer,this.options.gridControl),this.addControl(this.gridControl)),this.options.infoControl&&(this.infoControl=s(this.options.infoControl),this.addControl(this.infoControl)),this.options.legendControl&&(this.legendControl=c(this.options.legendControl),this.addControl(this.legendControl)),this.options.shareControl&&(this.shareControl=l(void 0,n(this.options.shareControl,this.options.accessToken)),this.addControl(this.shareControl)),this._loadTileJSON(e)},addLayer:function(t){return"on"in t&&t.on("ready",L.bind(function(){this._updateLayer(t)},this)),L.Map.prototype.addLayer.call(this,t)},_setTileJSON:function(t){return this._tilejson=t,this._initialize(t),this},getTileJSON:function(){return this._tilejson},_initialize:function(t){if(this.tileLayer&&(this.tileLayer._setTileJSON(t),this._updateLayer(this.tileLayer)),this.featureLayer&&!this.featureLayer.getGeoJSON()&&t.data&&t.data[0]&&this.featureLayer.loadURL(t.data[0]),this.gridLayer&&(this.gridLayer._setTileJSON(t),this._updateLayer(this.gridLayer)),this.infoControl&&t.attribution&&this.infoControl.addInfo(t.attribution),this.legendControl&&t.legend&&this.legendControl.addLegend(t.legend),this.shareControl&&this.shareControl._setTileJSON(t),!this._loaded&&t.center){var e=void 0!==this.getZoom()?this.getZoom():t.center[2],n=L.latLng(t.center[1],t.center[0]);this.setView(n,e)}},_editLink:function(){if(this._controlContainer.getElementsByClassName){var t=this._controlContainer.getElementsByClassName("mapbox-improve-map");if(t.length&&this._loaded)for(var e=this.getCenter().wrap(),n=this._tilejson||{},o=n.id||"",i=0;i<t.length;i++)t[i].href=t[i].href.split("#")[0]+"#"+o+"/"+e.lng.toFixed(3)+"/"+e.lat.toFixed(3)+"/"+this.getZoom()}},_updateLayer:function(t){t.options&&(this.infoControl&&this._loaded&&this.infoControl.addInfo(t.options.infoControl),this.attributionControl&&this._loaded&&t.getAttribution&&this.attributionControl.addAttribution(t.getAttribution()),this.on("moveend",this._editLink,this),L.stamp(t)in this._zoomBoundLayers||!t.options.maxZoom&&!t.options.minZoom||(this._zoomBoundLayers[L.stamp(t)]=t),this._editLink(),this._updateZoomLevels())}});e.exports.Map=u,e.exports.map=function(t,e,n){return new u(t,e,n)}},{"./feature_layer":7,"./grid_control":11,"./grid_layer":12,"./info_control":13,"./legend_control":14,"./load_tilejson":15,"./share_control":20,"./tile_layer":22,"./util":24}],17:[function(t,e){"use strict";var n=t("./geocoder_control"),o=t("./grid_control"),i=t("./feature_layer"),r=t("./legend_control"),a=t("./share_control"),s=t("./tile_layer"),l=t("./info_control"),c=t("./map"),u=t("./grid_layer");L.mapbox=e.exports={VERSION:t("../package.json").version,geocoder:t("./geocoder"),marker:t("./marker"),simplestyle:t("./simplestyle"),tileLayer:s.tileLayer,TileLayer:s.TileLayer,infoControl:l.infoControl,InfoControl:l.InfoControl,shareControl:a.shareControl,ShareControl:a.ShareControl,legendControl:r.legendControl,LegendControl:r.LegendControl,geocoderControl:n.geocoderControl,GeocoderControl:n.GeocoderControl,gridControl:o.gridControl,GridControl:o.GridControl,gridLayer:u.gridLayer,GridLayer:u.GridLayer,featureLayer:i.featureLayer,FeatureLayer:i.FeatureLayer,map:c.map,Map:c.Map,config:t("./config"),sanitize:t("sanitize-caja"),template:t("mustache").to_html},window.L.Icon.Default.imagePath=("https:"==document.location.protocol||"http:"==document.location.protocol?"":"https:")+"//api.tiles.mapbox.com/mapbox.js/v"+t("../package.json").version+"/images"},{"../package.json":5,"./config":6,"./feature_layer":7,"./geocoder":8,"./geocoder_control":9,"./grid_control":11,"./grid_layer":12,"./info_control":13,"./legend_control":14,"./map":16,"./marker":18,"./share_control":20,"./simplestyle":21,"./tile_layer":22,mustache:2,"sanitize-caja":3}],18:[function(t,e){"use strict";function n(t,e){t=t||{};var n={small:[20,50],medium:[30,70],large:[35,90]},o=t["marker-size"]||"medium",i="marker-symbol"in t&&""!==t["marker-symbol"]?"-"+t["marker-symbol"]:"",a=(t["marker-color"]||"7e7e7e").replace("#","");return L.icon({iconUrl:r("/marker/pin-"+o.charAt(0)+i+"+"+a+(L.Browser.retina?"@2x":"")+".png",e&&e.accessToken),iconSize:n[o],iconAnchor:[n[o][0]/2,n[o][1]/2],popupAnchor:[0,-n[o][1]/2]})}function o(t,e,o){return L.marker(e,{icon:n(t.properties,o),title:a.strip_tags(s(t.properties&&t.properties.title||""))})}function i(t,e){if(!t||!t.properties)return"";var n="";return t.properties.title&&(n+='<div class="marker-title">'+t.properties.title+"</div>"),t.properties.description&&(n+='<div class="marker-description">'+t.properties.description+"</div>"),(e||s)(n)}var r=t("./url"),a=t("./util"),s=t("sanitize-caja");e.exports={icon:n,style:o,createPopup:i}},{"./url":23,"./util":24,"sanitize-caja":3}],19:[function(t,e){"use strict";var n=t("corslite"),o=t("./util").strict,i=t("./config"),r=/^(https?:)?(?=\/\/(.|api)\.tiles\.mapbox\.com\/)/;e.exports=function(t,e){function a(t,n){!t&&n&&(n=JSON.parse(n.responseText)),e(t,n)}return o(t,"string"),o(e,"function"),t=t.replace(r,function(t,e){return"withCredentials"in new window.XMLHttpRequest?"https:"===e||"https:"===document.location.protocol||i.FORCE_HTTPS?"https:":"http:":document.location.protocol}),n(t,a)}},{"./config":6,"./util":24,corslite:1}],20:[function(t,e){"use strict";var n=t("./url"),o=L.Control.extend({includes:[t("./load_tilejson")],options:{position:"topleft",url:""},initialize:function(t,e){L.setOptions(this,e),this._loadTileJSON(t)},_setTileJSON:function(t){this._tilejson=t},onAdd:function(t){this._map=t;var e=L.DomUtil.create("div","leaflet-control-mapbox-share leaflet-bar"),n=L.DomUtil.create("a","mapbox-share mapbox-icon mapbox-icon-share",e);return n.href="#",this._modal=L.DomUtil.create("div","mapbox-modal",this._map._container),this._mask=L.DomUtil.create("div","mapbox-modal-mask",this._modal),this._content=L.DomUtil.create("div","mapbox-modal-content",this._modal),L.DomEvent.addListener(n,"click",this._shareClick,this),L.DomEvent.disableClickPropagation(e),this._map.on("mousedown",this._clickOut,this),e},_clickOut:function(t){return this._sharing?(L.DomEvent.preventDefault(t),L.DomUtil.removeClass(this._modal,"active"),this._content.innerHTML="",this._sharing=null,void 0):void 0},_shareClick:function(t){if(L.DomEvent.stop(t),this._sharing)return this._clickOut(t);var e=this._tilejson||this._map._tilejson||{},o=encodeURIComponent(this.options.url||e.webpage||window.location),i=encodeURIComponent(e.name),r=n("/"+e.id+"/"+this._map.getCenter().lng+","+this._map.getCenter().lat+","+this._map.getZoom()+"/600x600.png",this.options.accessToken),a=n("/"+e.id+".html",this.options.accessToken),s="//twitter.com/intent/tweet?status="+i+" "+o,l="//www.facebook.com/sharer.php?u="+o+"&t="+encodeURIComponent(e.name),c="//www.pinterest.com/pin/create/button/?url="+o+"&media="+r+"&description="+e.name,u="<h3>Share this map</h3><div class='mapbox-share-buttons'><a class='mapbox-button mapbox-button-icon mapbox-icon-facebook' target='_blank' href='{{facebook}}'>Facebook</a><a class='mapbox-button mapbox-button-icon mapbox-icon-twitter' target='_blank' href='{{twitter}}'>Twitter</a><a class='mapbox-button mapbox-button-icon mapbox-icon-pinterest' target='_blank' href='{{pinterest}}'>Pinterest</a></div>".replace("{{twitter}}",s).replace("{{facebook}}",l).replace("{{pinterest}}",c),h='<iframe width="100%" height="500px" frameBorder="0" src="{{embed}}"></iframe>'.replace("{{embed}}",a),p="Copy and paste this <strong>HTML code</strong> into documents to embed this map on web pages.";L.DomUtil.addClass(this._modal,"active"),this._sharing=L.DomUtil.create("div","mapbox-modal-body",this._content),this._sharing.innerHTML=u;var d=L.DomUtil.create("input","mapbox-embed",this._sharing);d.type="text",d.value=h;var m=L.DomUtil.create("label","mapbox-embed-description",this._sharing);m.innerHTML=p;var f=L.DomUtil.create("a","leaflet-popup-close-button",this._sharing);f.href="#",L.DomEvent.disableClickPropagation(this._sharing),L.DomEvent.addListener(f,"click",this._clickOut,this),L.DomEvent.addListener(d,"click",function(t){t.target.focus(),t.target.select()})}});e.exports.ShareControl=o,e.exports.shareControl=function(t,e){return new o(t,e)}},{"./load_tilejson":15,"./url":23}],21:[function(t,e){"use strict";function n(t,e){var n={};for(var o in e)n[o]=void 0===t[o]?e[o]:t[o];return n}function o(t){for(var e={},n=0;n<a.length;n++)e[a[n][1]]=t[a[n][0]];return e}function i(t){return o(n(t.properties||{},r))}var r={stroke:"#555555","stroke-width":2,"stroke-opacity":1,fill:"#555555","fill-opacity":.5},a=[["stroke","color"],["stroke-width","weight"],["stroke-opacity","opacity"],["fill","fillColor"],["fill-opacity","fillOpacity"]];e.exports={style:i,defaults:r}},{}],22:[function(t,e){"use strict";var n=t("./util"),o=L.TileLayer.extend({includes:[t("./load_tilejson")],options:{format:"png"},formats:["png","png32","png64","png128","png256","jpg70","jpg80","jpg90"],scalePrefix:"@2x.",initialize:function(t,e){L.TileLayer.prototype.initialize.call(this,void 0,e),this._tilejson={},e&&e.format&&n.strict_oneof(e.format,this.formats),this._loadTileJSON(t)},setFormat:function(t){return n.strict(t,"string"),this.options.format=t,this.redraw(),this},setUrl:null,_setTileJSON:function(t){return n.strict(t,"object"),L.extend(this.options,{tiles:t.tiles,attribution:t.attribution,minZoom:t.minzoom||0,maxZoom:t.maxzoom||18,tms:"tms"===t.scheme,bounds:t.bounds&&n.lbounds(t.bounds)}),this._tilejson=t,this.redraw(),this},getTileJSON:function(){return this._tilejson},getTileUrl:function(t){var e=this.options.tiles,n=Math.floor(Math.abs(t.x+t.y)%e.length),o=e[n],i=L.Util.template(o,t);return i?i.replace(".png",(L.Browser.retina?this.scalePrefix:".")+this.options.format):i},_update:function(){this.options.tiles&&L.TileLayer.prototype._update.call(this)}});e.exports.TileLayer=o,e.exports.tileLayer=function(t,e){return new o(t,e)}},{"./load_tilejson":15,"./util":24}],23:[function(t,e){"use strict";var n=t("./config"),o=t("../package.json").version;e.exports=function(t,e){if(e=e||L.mapbox.accessToken,!e&&n.REQUIRE_ACCESS_TOKEN)throw new Error("An API access token is required to use Mapbox.js. See https://www.mapbox.com/mapbox.js/api/v"+o+"/api-access-tokens/");var i="https:"===document.location.protocol||n.FORCE_HTTPS?n.HTTPS_URL:n.HTTP_URL;if(i+=t,i+=-1!==i.indexOf("?")?"&access_token=":"?access_token=",n.REQUIRE_ACCESS_TOKEN){if("s"===e[0])throw new Error("Use a public access token (pk.*) with Mapbox.js, not a secret access token (sk.*). See https://www.mapbox.com/mapbox.js/api/v"+o+"/api-access-tokens/");i+=e}return i},e.exports.tileJSON=function(t,n){if(-1!==t.indexOf("/"))return t;var o=e.exports("/"+t+".json",n);return 0===o.indexOf("https")&&(o+="&secure"),o}},{"../package.json":5,"./config":6}],24:[function(t,e){"use strict";function n(t,e){if(!e||!e.length)return!1;for(var n=0;n<e.length;n++)if(e[n]==t)return!0;return!1}e.exports={idUrl:function(t,e){-1==t.indexOf("/")?e.loadID(t):e.loadURL(t)},log:function(t){"object"==typeof console&&"function"==typeof console.error&&console.error(t)},strict:function(t,e){if(typeof t!==e)throw new Error("Invalid argument: "+e+" expected")},strict_instance:function(t,e,n){if(!(t instanceof e))throw new Error("Invalid argument: "+n+" expected")},strict_oneof:function(t,e){if(!n(t,e))throw new Error("Invalid argument: "+t+" given, valid values are "+e.join(", "))},strip_tags:function(t){return t.replace(/<[^<]+>/g,"")},lbounds:function(t){return new L.LatLngBounds([[t[1],t[0]],[t[3],t[2]]])}}},{}]},{},[17]);;L.Map.include({

	// refresh map container size
	reframe: function (options) {
		if (!this._loaded) { return this; }
		this._sizeChanged = true;
		this.fire('moveend');
	}
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
