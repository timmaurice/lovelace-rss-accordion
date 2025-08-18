/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t$1.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$2="?"+h,n$1=`<${o$2}>`,r$2=document,l=()=>r$2.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r$2.createTreeWalker(r$2,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n$1:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$2)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r$2.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r$2).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r$2,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r$2.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t$1.litHtmlPolyfillSupport;j?.(N,R),(t$1.litHtmlVersions??=[]).push("3.3.1");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer((()=>{customElements.define(t,e);})):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

var editor$2={title:"Titel (Optional)",entity:"Feed-Entität",allow_multiple:"Erlaube das Öffnen mehrerer Einträge",initial_open:"Neuesten Eintrag bei Laden öffnen",max_items:"Maximale Einträge",max_items_placeholder:"Alle Einträge",new_pill_duration_hours:"Dauer für 'NEU'-Anzeige (Stunden)",strip_summary_images:"Bilder aus der Zusammenfassung entfernen (verwenden Sie dies, wenn Sie zwei Bilder sehen)"};var card$1={to_news_article:"Zum Nachrichtenartikel",new_pill:"NEU"};var de = {editor:editor$2,card:card$1};

var editor$1={title:"Title (Optional)",entity:"Feed Entity",allow_multiple:"Allow multiple items to be open",initial_open:"Open latest item on load",max_items:"Maximum Items",max_items_placeholder:"All items",new_pill_duration_hours:"Duration for 'NEW' pill (hours)",strip_summary_images:"Remove images from summary (use when you see two images)"};var card={to_news_article:"To the news article",new_pill:"NEW"};var en = {editor:editor$1,card:card};

const translations = {
    de,
    en,
};
const typedTranslations = translations;
function _getTranslation(language, keys) {
    let translation = typedTranslations[language];
    for (const key of keys) {
        if (typeof translation !== 'object' || translation === null) {
            return undefined;
        }
        translation = translation[key];
    }
    return typeof translation === 'string' ? translation : undefined;
}
function localize(hass, key, placeholders = {}) {
    const lang = hass.language || 'en';
    const translationKey = key.replace('component.rss-accordion.', '');
    const keyParts = translationKey.split('.');
    const translation = _getTranslation(lang, keyParts) ?? _getTranslation('en', keyParts);
    if (typeof translation === 'string') {
        let finalString = translation;
        for (const placeholder in placeholders) {
            finalString = finalString.replace(`{${placeholder}}`, String(placeholders[placeholder]));
        }
        return finalString;
    }
    return key;
}

const styles$1 = i$3`﻿.card-content{padding:16px}.warning{color:var(--error-color);padding:16px}.accordion-header{cursor:pointer;font-weight:bold;list-style:none;padding:12px 0;padding-left:20px;position:relative}.accordion-header::-webkit-details-marker{display:none}.accordion-header::before{content:"▸";left:0;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease-in-out}.accordion-header .header-main{align-items:center;display:flex;justify-content:space-between;width:100%}.accordion-header .header-main .title-link{color:var(--primary-text-color);cursor:default;pointer-events:none;text-decoration:none}.accordion-header .header-main .title-link:visited{color:var(--secondary-text-color)}.accordion-header .header-main .new-pill{background-color:var(--primary-color);border-radius:10px;color:var(--text-primary-color);flex-shrink:0;font-size:.7em;font-weight:bold;margin-left:8px;padding:2px 8px}.accordion-content{color:var(--secondary-text-color);font-size:.9em;max-height:0;overflow:hidden;padding:0 0 0 20px;transition:max-height .3s ease-in-out,padding-bottom .3s ease-in-out}.accordion-content .item-published{color:var(--secondary-text-color);font-size:1em;margin-bottom:8px;padding-top:12px}.accordion-content .item-image{border-radius:var(--ha-card-border-radius, 4px);display:block;height:auto;margin-bottom:8px;max-width:100%}.accordion-content .item-link{color:var(--primary-color);display:inline-block;font-weight:bold;margin-top:8px;text-decoration:none}.accordion-content .item-link:hover{text-decoration:underline}.accordion-item{border-bottom:1px solid var(--divider-color)}.accordion-item:last-of-type{border-bottom:none}.accordion-item[open]>.accordion-header::before{transform:translateY(-50%) rotate(90deg)}.accordion-item[open]>.accordion-content{padding-bottom:12px}.accordion-item.loading>.accordion-header .header-main .new-pill{display:none}.accordion-item.loading>.accordion-header .header-main::after{content:"";display:inline-block;width:16px;height:16px;border:2px solid var(--primary-color);border-top-color:rgba(0,0,0,0);border-radius:50%;animation:spin 1s linear infinite;margin-left:8px;flex-shrink:0}@keyframes spin{to{transform:rotate(360deg)}}`;

const ELEMENT_NAME = 'rss-accordion';
const EDITOR_ELEMENT_NAME = `${ELEMENT_NAME}-editor`;
console.info(`%c RSS-ACCORDION %c 0.0.1 `, 'color: orange; font-weight: bold; background: black', 'color: white; font-weight: bold; background: dimgray');
let RssAccordion = class RssAccordion extends i {
    setConfig(config) {
        if (!config || !config.entity) {
            throw new Error('You need to define an entity');
        }
        this._config = config;
    }
    static async getConfigElement() {
        // Ensure that the required Home Assistant components are loaded before creating the editor
        // by loading a core editor that uses them. This card requires Home Assistant 2023.4+
        // which provides `loadCardHelpers`.
        const loadHelpers = window.loadCardHelpers;
        if (!loadHelpers) {
            throw new Error('This card requires Home Assistant 2023.4+ and `loadCardHelpers` is not available.');
        }
        const helpers = await loadHelpers();
        // This is a trick to load the editor dependencies (e.g., ha-entity-picker)
        // by creating an instance of an entities card and triggering its editor to load.
        const entitiesCard = await helpers.createCardElement({ type: 'entities', entities: [] });
        await entitiesCard.constructor.getConfigElement();
        await Promise.resolve().then(function () { return editor; });
        return document.createElement(EDITOR_ELEMENT_NAME);
    }
    static getStubConfig() {
        return {
            entity: 'sensor.your_rss_feed_sensor',
            max_items: 5,
        };
    }
    getCardSize() {
        if (!this.hass || !this._config?.entity) {
            return 1;
        }
        const stateObj = this.hass.states[this._config.entity];
        if (!stateObj) {
            return 1;
        }
        let numItems = 0;
        if (stateObj.attributes.entries && Array.isArray(stateObj.attributes.entries)) {
            numItems = stateObj.attributes.entries.length;
        }
        else if (this._config.entity.startsWith('event.')) {
            const { title, link } = stateObj.attributes;
            if (title && link) {
                numItems = 1;
            }
        }
        const maxItems = this._config.max_items ?? numItems;
        const displayItems = Math.min(numItems, maxItems);
        return (this._config.title ? 1 : 0) + (displayItems || 1);
    }
    connectedCallback() {
        super.connectedCallback();
        // Using ResizeObserver is more performant than a window resize event listener
        // as it only triggers when the element's size actually changes.
        if (!this._resizeObserver) {
            this._resizeObserver = new ResizeObserver(() => this._handleResize());
        }
        this._resizeObserver.observe(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
    }
    _handleResize() {
        this.shadowRoot?.querySelectorAll('.accordion-item[open]').forEach((details) => {
            const content = details.querySelector('.accordion-content');
            if (content) {
                // Temporarily disable transitions to avoid animating the height change on resize.
                const originalTransition = content.style.transition;
                content.style.transition = 'none';
                // Recalculate and apply the new max-height.
                // The scrollHeight property gives the full height of the content, even if it's overflowing.
                content.style.maxHeight = `${content.scrollHeight}px`;
                // Restore the transition after the browser has applied the new height.
                // requestAnimationFrame is used to ensure this happens in the next frame.
                requestAnimationFrame(() => {
                    content.style.transition = originalTransition;
                });
            }
        });
    }
    firstUpdated() {
        if (this._config?.initial_open) {
            // We need to wait for the DOM to be fully settled before we can measure scrollHeight for the animation.
            // A timeout of 0 pushes this to the end of the event queue, after the current render cycle.
            setTimeout(() => {
                const firstItem = this.shadowRoot?.querySelector('.accordion-item');
                if (firstItem && !firstItem.open) {
                    this._openAccordion(firstItem);
                }
            }, 0);
        }
    }
    async _onSummaryClick(e) {
        e.preventDefault();
        const details = e.currentTarget.closest('.accordion-item');
        if (!details)
            return;
        if (details.open) {
            this._closeAccordion(details);
        }
        else {
            await this._openAccordion(details);
        }
    }
    _closeAccordion(details) {
        details.classList.remove('loading'); // Ensure loading class is removed on close
        const content = details.querySelector('.accordion-content');
        if (!content)
            return;
        content.style.maxHeight = '0px';
        const onTransitionEnd = () => {
            details.removeAttribute('open');
            content.removeEventListener('transitionend', onTransitionEnd);
        };
        content.addEventListener('transitionend', onTransitionEnd);
    }
    async _openAccordion(details) {
        const content = details.querySelector('.accordion-content');
        if (!content)
            return;
        if (!this._config.allow_multiple) {
            this.shadowRoot?.querySelectorAll('.accordion-item[open]').forEach((openDetails) => {
                if (openDetails !== details) {
                    this._closeAccordion(openDetails);
                }
            });
        }
        details.setAttribute('open', '');
        const images = Array.from(content.querySelectorAll('img'));
        const imagesToLoad = images.filter((img) => !img.complete);
        if (imagesToLoad.length > 0) {
            details.classList.add('loading');
            await Promise.all(imagesToLoad.map((img) => new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true }); // Also resolve on error
            })));
            details.classList.remove('loading');
        }
        // Use requestAnimationFrame to ensure the browser has painted the final content
        // (with loaded images) before we measure its height.
        requestAnimationFrame(() => {
            content.style.maxHeight = `${content.scrollHeight}px`;
        });
    }
    _getDateTimeFormatOptions() {
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
        };
        // Respect the user's 12/24 hour format setting from Home Assistant
        if (this.hass.locale) {
            // hass.locale.time_format can be '12', '24', or 'system'.
            // Let's be explicit. 'system' will fallback to browser default which is what we want.
            if (this.hass.locale.time_format === '12') {
                options.hour12 = true;
            }
            else if (this.hass.locale.time_format === '24') {
                options.hour12 = false;
            }
        }
        return options;
    }
    _getFeedItems() {
        const stateObj = this.hass.states[this._config.entity];
        if (!stateObj) {
            return [];
        }
        // Handle sensor entities with an 'entries' attribute
        if (stateObj.attributes.entries && Array.isArray(stateObj.attributes.entries)) {
            return stateObj.attributes.entries || [];
        }
        // Handle event entities which represent a single item
        if (this._config.entity.startsWith('event.')) {
            const { title, link, summary, description, image } = stateObj.attributes;
            if (typeof title === 'string' && typeof link === 'string') {
                return [
                    {
                        title,
                        link,
                        summary: summary ?? undefined,
                        description: description ?? undefined,
                        image: image ?? undefined,
                        published: stateObj.state,
                    },
                ];
            }
        }
        return [];
    }
    render() {
        if (!this._config || !this.hass) {
            return x ``;
        }
        const stateObj = this.hass.states[this._config.entity];
        if (!stateObj) {
            return x `
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">Entity not found: ${this._config.entity}</div>
        </ha-card>
      `;
        }
        const allEntries = this._getFeedItems();
        const maxItems = this._config.max_items ?? allEntries.length;
        const itemsToDisplay = allEntries.slice(0, maxItems);
        if (itemsToDisplay.length === 0) {
            return x `
        <ha-card .header=${this._config.title}>
          <div class="card-content"><i>No entries available.</i></div>
        </ha-card>
      `;
        }
        return x `
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${itemsToDisplay.map((item) => {
            const content = item.summary || item.description || '';
            const processedContent = this._config.strip_summary_images ? content.replace(/<img[^>]*>/g, '') : content;
            const publishedDate = new Date(item.published);
            const formattedDate = publishedDate.toLocaleString(this.hass.language, this._getDateTimeFormatOptions());
            const newPillDurationHours = this._config.new_pill_duration_hours ?? 1;
            const ageInMinutes = (new Date().getTime() - publishedDate.getTime()) / (1000 * 60);
            const isNew = ageInMinutes >= 0 && ageInMinutes < newPillDurationHours * 60;
            return x `
              <details class="accordion-item">
                <summary class="accordion-header" @click=${this._onSummaryClick}>
                  <div class="header-main">
                    <a class="title-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                      ${item.title}
                    </a>
                    ${isNew
                ? x `<span class="new-pill"
                          >${localize(this.hass, 'component.rss-accordion.card.new_pill')}</span
                        >`
                : ''}
                  </div>
                </summary>
                <div class="accordion-content">
                  <div class="item-published">${formattedDate}</div>
                  ${item.image ? x `<img class="item-image" src="${item.image}" alt="${item.title}" />` : ''}
                  <div class="item-summary" .innerHTML=${processedContent}></div>
                  <a class="item-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                    ${localize(this.hass, 'component.rss-accordion.card.to_news_article')}
                  </a>
                </div>
              </details>
            `;
        })}
        </div>
      </ha-card>
    `;
    }
    static { this.styles = i$3 `
    ${r$4(styles$1)}
  `; }
};
__decorate([
    n({ attribute: false })
], RssAccordion.prototype, "hass", void 0);
__decorate([
    r()
], RssAccordion.prototype, "_config", void 0);
RssAccordion = __decorate([
    t(ELEMENT_NAME)
], RssAccordion);
if (typeof window !== 'undefined') {
    window.customCards = window.customCards || [];
    window.customCards.push({
        type: ELEMENT_NAME,
        name: 'RSS Accordion',
        description: 'A card to display RSS feed items in an accordion style.',
    });
}

/**
 * Dispatches a custom event with an optional detail value.
 *
 * @param node The element to dispatch the event from.
 * @param type The name of the event.
 * @param detail The detail value to pass with the event.
 * @param options The options for the event.
 */
const fireEvent = (node, type, detail, options) => {
    const event = new CustomEvent(type, { bubbles: true, cancelable: false, composed: true, ...options, detail });
    node.dispatchEvent(event);
};

const styles = i$3`.card-config{display:flex;flex-direction:column;gap:16px}`;

let RssAccordionEditor = class RssAccordionEditor extends i {
    setConfig(config) {
        this._config = config;
    }
    _valueChanged(ev) {
        if (!this._config || !this.hass) {
            return;
        }
        const target = ev.target;
        if (!target.configValue) {
            return;
        }
        const configValue = target.configValue;
        const newConfig = { ...this._config };
        const value = target.tagName === 'HA-SWITCH' ? target.checked : target.value;
        if (value === '' || value === false || value === undefined) {
            delete newConfig[configValue];
        }
        else {
            newConfig[configValue] = target.type === 'number' ? Number(value) : value;
        }
        fireEvent(this, 'config-changed', { config: newConfig });
    }
    _entityChanged(ev) {
        if (!this._config || !this.hass) {
            return;
        }
        const newConfig = {
            ...this._config,
            entity: ev.detail.value,
        };
        fireEvent(this, 'config-changed', { config: newConfig });
    }
    render() {
        if (!this.hass || !this._config) {
            return x ``;
        }
        return x `
      <ha-card>
        <div class="card-content card-config">
          <ha-textfield
            .label=${localize(this.hass, 'component.rss-accordion.editor.title')}
            .value=${this._config.title || ''}
            .configValue=${'title'}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-entity-picker
            .hass=${this.hass}
            .label=${localize(this.hass, 'component.rss-accordion.editor.entity')}
            .value=${this._config.entity || ''}
            .includeDomains=${['sensor', 'event']}
            @value-changed=${this._entityChanged}
            allow-custom-entity
            required
          ></ha-entity-picker>
          <ha-textfield
            .label=${localize(this.hass, 'component.rss-accordion.editor.max_items')}
            type="number"
            min="1"
            .value=${this._config.max_items || ''}
            .configValue=${'max_items'}
            @input=${this._valueChanged}
            .placeholder=${localize(this.hass, 'component.rss-accordion.editor.max_items_placeholder')}
          ></ha-textfield>
          <ha-textfield
            .label=${localize(this.hass, 'component.rss-accordion.editor.new_pill_duration_hours')}
            type="number"
            min="1"
            .value=${this._config.new_pill_duration_hours || ''}
            .configValue=${'new_pill_duration_hours'}
            @input=${this._valueChanged}
            .placeholder="1"
          ></ha-textfield>
          <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.initial_open')}>
            <ha-switch
              .checked=${this._config.initial_open === true}
              .configValue=${'initial_open'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.allow_multiple')}>
            <ha-switch
              .checked=${this._config.allow_multiple === true}
              .configValue=${'allow_multiple'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.strip_summary_images')}>
            <ha-switch
              .checked=${this._config.strip_summary_images === true}
              .configValue=${'strip_summary_images'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>
      </ha-card>
    `;
    }
    static { this.styles = i$3 `
    ${r$4(styles)}
  `; }
};
__decorate([
    n({ attribute: false })
], RssAccordionEditor.prototype, "hass", void 0);
__decorate([
    r()
], RssAccordionEditor.prototype, "_config", void 0);
RssAccordionEditor = __decorate([
    t('rss-accordion-editor')
], RssAccordionEditor);

var editor = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get RssAccordionEditor () { return RssAccordionEditor; }
});

export { RssAccordion };
