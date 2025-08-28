function e(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const r=e=>new n("string"==typeof e?e:e+"",void 0,s),a=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new n(i,e,s)},c=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return r(t)})(e):e,{is:l,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:_}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",$=m.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&h(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const n=s?.call(this);o?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=_(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...p(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(c(e))}else void 0!==e&&t.push(c(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=s;const n=o.fromAttribute(t,e.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const s=this.constructor,o=this[e];if(i??=s.getPropertyOptions(e),!((i.hasChanged??b)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[v("elementProperties")]=new Map,A[v("finalized")]=new Map,$?.({ReactiveElement:A}),(m.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,E=x.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+k,O=`<${P}>`,U=document,M=()=>U.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,H=Array.isArray,R="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,I=/>/g,j=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,D=/"/g,V=/^(?:script|style|textarea|title)$/i,q=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),F=new WeakMap,K=U.createTreeWalker(U,129);function Z(e,t){if(!H(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Y=(e,t)=>{const i=e.length-1,s=[];let o,n=2===t?"<svg>":3===t?"<math>":"",r=z;for(let t=0;t<i;t++){const i=e[t];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===z?"!--"===c[1]?r=N:void 0!==c[1]?r=I:void 0!==c[2]?(V.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=j):void 0!==c[3]&&(r=j):r===j?">"===c[0]?(r=o??z,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?j:'"'===c[3]?D:L):r===D||r===L?r=j:r===N||r===I?r=z:(r=j,o=void 0);const d=r===j&&e[t+1].startsWith("/>")?" ":"";n+=r===z?i+O:l>=0?(s.push(a),i.slice(0,l)+C+i.slice(l)+k+d):i+k+(-2===l?t:d)}return[Z(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class J{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,n=0;const r=e.length-1,a=this.parts,[c,l]=Y(e,t);if(this.el=J.createElement(c,i),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=K.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(C)){const t=l[n++],i=s.getAttribute(e).split(k),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?te:"?"===r[1]?ie:"@"===r[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(k)&&(a.push({type:6,index:o}),s.removeAttribute(e));if(V.test(s.tagName)){const e=s.textContent.split(k),t=e.length-1;if(t>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],M()),K.nextNode(),a.push({type:2,index:++o});s.append(e[t],M())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(k,e+1));)a.push({type:7,index:o}),e+=k.length-1}o++}}static createElement(e,t){const i=U.createElement("template");return i.innerHTML=e,i}}function G(e,t,i=e,s){if(t===B)return t;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=T(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(t=G(e,o._$AS(e,t.values),o,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??U).importNode(t,!0);K.currentNode=s;let o=K.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new X(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new oe(o,this,e)),this._$AV.push(t),a=i[++r]}n!==a?.index&&(o=K.nextNode(),n++)}return K.currentNode=U,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=G(this,e,t),T(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>H(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(U.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=F.get(e.strings);return void 0===t&&F.set(e.strings,t=new J(e)),t}k(e){H(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const o of e)s===t.length?t.push(i=new X(this.O(M()),this.O(M()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,s){const o=this.strings;let n=!1;if(void 0===o)e=G(this,e,t,0),n=!T(e)||e!==this._$AH&&e!==B,n&&(this._$AH=e);else{const s=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=G(this,s[i+r],t,r),a===B&&(a=this._$AH[r]),n||=!T(a)||a!==this._$AH[r],a===W?e=W:e!==W&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class se extends ee{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=G(this,e,t,0)??W)===B)return;const i=this._$AH,s=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){G(this,e)}}const ne=x.litHtmlPolyfillSupport;ne?.(J,X),(x.litHtmlVersions??=[]).push("3.3.1");const re=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ae=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=i?.renderBefore??null;s._$litPart$=o=new X(t.insertBefore(M(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}};ae._$litElement$=!0,ae.finalized=!0,re.litElementHydrateSupport?.({LitElement:ae});const ce=re.litElementPolyfillSupport;ce?.({LitElement:ae}),(re.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},de=(e=he,t,i)=>{const{kind:s,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,o,e)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];t.call(this,i),this.requestUpdate(s,o,e)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pe(e){return(t,i)=>"object"==typeof i?de(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return pe({...e,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _e=1;let me=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fe="important",ge=" !"+fe,$e=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends me{constructor(e){if(super(e),e.type!==_e||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const s=e[i];return null==s?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const s=t[e];if(null!=s){this.ft.add(e);const t="string"==typeof s&&s.endsWith(ge);e.includes("-")||t?i.setProperty(e,t?s.slice(0,-11):s,t?fe:""):i[e]=s}}return B}});const ve={de:{editor:{groups:{core:"Grundeinstellungen",feed:"Feed-Einträge & Verhalten",item_images:"Bilder der Einträge",channel:"Kanalinformationen"},title:"Titel (Optional)",entity:"Feed-Entität",allow_multiple:"Erlaube das Öffnen mehrerer Einträge",initial_open:"Neuesten Eintrag bei Laden öffnen",max_items:"Maximale Einträge",max_items_placeholder:"Alle Einträge",new_pill_duration_hours:"Dauer für 'NEU'-Anzeige (Stunden)",image_ratio:"Bild-Seitenverhältnis (z.B. 16/9 oder 1.77)",image_ratio_validation_message:"Ungültiges Format. Beispiel: 'auto', '16/9' oder '1.77'.",image_fit_mode:"Bild-Anpassung",image_fit_mode_options:{cover:"Ausfüllen (Cover)",contain:"Einfassen (Contain)"},show_channel_info:"Kanal-Infos anzeigen (vom 'channel'-Attribut)",show_channel_published_date:"Letzte Aktualisierung des Kanals anzeigen",crop_channel_image:"Kanalbild als zugeschnittenen Kreis anzeigen",show_audio_player:"Audio-Player anzeigen",show_item_image:"Bilder der Einträge anzeigen"},card:{to_news_article:"Zum Nachrichtenartikel",new_pill:"NEU",visit_channel:"Kanal besuchen",last_updated:"Zuletzt aktualisiert"}},en:{editor:{groups:{core:"Core Configuration",feed:"Feed Items & Behavior",item_images:"Item Images",channel:"Channel Information"},title:"Title (Optional)",entity:"Feed Entity",allow_multiple:"Allow multiple items to be open",initial_open:"Open latest item on load",max_items:"Maximum Items",max_items_placeholder:"All items",new_pill_duration_hours:"Duration for 'NEW' pill (hours)",image_ratio:"Image aspect ratio (e.g. 16/9 or 1.77)",image_ratio_validation_message:"Invalid format. Use 'auto', '16/9', or '1.77'.",image_fit_mode:"Image Fit Mode",image_fit_mode_options:{cover:"Cover (fill & crop)",contain:"Contain (fit inside)"},show_channel_info:"Show Channel Info (from 'channel' attribute)",show_channel_published_date:"Show channel's last update time",crop_channel_image:"Display channel image as a cropped circle",show_audio_player:"Show Audio Player",show_item_image:"Show Item Images"},card:{to_news_article:"To the news article",new_pill:"NEW",visit_channel:"Visit channel",last_updated:"Last updated"}}};function ye(e,t){let i=ve[e];for(const e of t){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function be(e,t,i={}){const s=e.language||"en",o=t.replace("component.rss-accordion.","").split("."),n=ye(s,o)??ye("en",o);if("string"==typeof n){let e=n;for(const t in i)e=e.replace(`{${t}}`,String(i[t]));return e}return t}const we=(e,t,i,s)=>{const o=new CustomEvent(t,{bubbles:!0,cancelable:!1,composed:!0,...s,detail:i});e.dispatchEvent(o)};function Ae(e,t){const i=new Date(e),s={year:"numeric",month:"short",day:"2-digit",hour:"numeric",minute:"2-digit"};return t.locale&&("12"===t.locale.time_format?s.hour12=!0:"24"===t.locale.time_format&&(s.hour12=!1)),i.toLocaleString(t.language,s)}const xe=a`﻿.card-content{padding:16px}.warning{color:var(--error-color);padding:16px}.channel-info{align-items:center;border-bottom:1px solid var(--divider-color);display:flex;gap:16px;margin-bottom:8px;padding-bottom:16px}.channel-info .channel-image{border-radius:0;height:auto;object-fit:contain;width:calc(50% - 8px)}.channel-info .channel-text{display:flex;flex-direction:column;justify-content:center;min-width:0}.channel-info .channel-title{color:var(--primary-text-color);font-size:1.2em;font-weight:bold;margin:0 0 4px 0}.channel-info .channel-description{color:var(--secondary-text-color);font-size:.9em;margin:0 0 8px 0}.channel-info .channel-published{color:var(--secondary-text-color);font-size:.85em;margin:-4px 0 8px 0}.channel-info .channel-published .label{font-weight:bold;margin-right:4px}.channel-info .channel-link{color:var(--primary-color);font-weight:bold;text-decoration:none}.channel-info .channel-link:hover{text-decoration:underline}.channel-info.cropped-image{align-items:center;flex-direction:row}.channel-info.cropped-image .channel-image{border-radius:50%;flex-shrink:0;height:60px;margin-bottom:0;object-fit:cover;width:60px}.accordion-header{cursor:pointer;font-weight:bold;list-style:none;padding:12px 0;padding-left:20px;position:relative}.accordion-header::-webkit-details-marker{display:none}.accordion-header::before{content:"▸";left:0;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease-in-out}.accordion-header .header-main{align-items:center;display:flex;justify-content:space-between;width:100%}.accordion-header .header-main .header-badges{align-items:center;display:flex;flex-shrink:0;gap:8px;margin-left:8px}.accordion-header .header-main .title-link{color:var(--primary-text-color);cursor:default;pointer-events:none;text-decoration:none;white-space:normal}.accordion-header .header-main .title-link:visited{color:var(--secondary-text-color)}.accordion-header .header-main .new-pill{background-color:var(--primary-color);border-radius:10px;color:var(--text-primary-color);font-size:.7em;font-weight:bold;padding:2px 8px}.accordion-content{color:var(--secondary-text-color);font-size:.9em;max-height:0;overflow:hidden;padding:0 0 0 20px;transition:max-height .3s ease-in-out,padding-bottom .3s ease-in-out}.accordion-content .item-published{color:var(--secondary-text-color);font-size:1em;margin-bottom:8px}.accordion-content .item-image{border-radius:var(--ha-card-border-radius, 4px);display:block;height:auto;margin-bottom:8px;max-width:100%}.accordion-content .item-link{color:var(--primary-color);display:inline-block;font-weight:bold;margin-top:8px;text-decoration:none}.accordion-content .item-link:hover{text-decoration:underline}.accordion-item{border-bottom:1px solid var(--divider-color)}.accordion-item:last-of-type{border-bottom:none}.accordion-item[open]>.accordion-header::before{transform:translateY(-50%) rotate(90deg)}.accordion-item[open]>.accordion-content{padding-bottom:12px}.accordion-item.loading>.accordion-header .header-main .new-pill{display:none}.accordion-item.loading>.accordion-header .header-main::after{animation:spin 1s linear infinite;border:2px solid var(--primary-color);border-radius:50%;border-top-color:rgba(0,0,0,0);content:"";display:inline-block;flex-shrink:0;height:16px;margin-left:8px;width:16px}@keyframes spin{to{transform:rotate(360deg)}}.audio-player-container{margin-bottom:1em}.audio-player-container audio{border-radius:50px;height:40px;width:100%}`,Ee="rss-accordion",Se=`${Ee}-editor`;console.info("%c RSS-ACCORDION %c 0.3.0 ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");let Ce=class extends ae{setConfig(e){if(!e||!e.entity)throw new Error("You need to define an entity");this._config=e}static async getConfigElement(){const e=window.loadCardHelpers;if(!e)throw new Error("This card requires Home Assistant 2023.4+ and `loadCardHelpers` is not available.");const t=await e(),i=await t.createCardElement({type:"entities",entities:[]});return await i.constructor.getConfigElement(),await Promise.resolve().then(function(){return Oe}),document.createElement(Se)}static getStubConfig(){return{entity:"sensor.your_rss_feed_sensor",max_items:5}}getCardSize(){if(!this.hass||!this._config?.entity)return 1;const e=this._getFeedItems().length,t=this._config.max_items??e,i=Math.min(e,t);let s=(this._config.title?1:0)+(i||1);const o=this.hass.states[this._config.entity],n=o?.attributes.channel;return this._config.show_channel_info&&n&&(n.title||n.description||n.subtitle||n.image||n.link||this._config.show_published_date&&n.published)&&(s+=2),s}connectedCallback(){super.connectedCallback(),this._resizeObserver||(this._resizeObserver=new ResizeObserver(()=>this._handleResize())),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver&&this._resizeObserver.disconnect()}_handleResize(){this.shadowRoot?.querySelectorAll(".accordion-item[open]").forEach(e=>{const t=e.querySelector(".accordion-content");if(t){const e=t.style.transition;t.style.transition="none",t.style.maxHeight=`${t.scrollHeight}px`,requestAnimationFrame(()=>{t.style.transition=e})}})}firstUpdated(){this._config?.initial_open&&setTimeout(()=>{const e=this.shadowRoot?.querySelector(".accordion-item");e&&!e.open&&this._openAccordion(e)},0)}async _onSummaryClick(e){const t=e.target;if(t.closest&&t.closest("a.title-link"))return;e.preventDefault();const i=e.currentTarget.closest(".accordion-item");i&&(i.open?this._closeAccordion(i):await this._openAccordion(i))}_closeAccordion(e){e.classList.remove("loading");const t=e.querySelector(".accordion-content");if(!t)return;t.style.maxHeight="0px";const i=()=>{e.removeAttribute("open"),t.removeEventListener("transitionend",i)};t.addEventListener("transitionend",i)}async _openAccordion(e){const t=e.querySelector(".accordion-content");if(!t)return;this._config.allow_multiple||this.shadowRoot?.querySelectorAll(".accordion-item[open]").forEach(t=>{t!==e&&this._closeAccordion(t)}),e.setAttribute("open","");const i=Array.from(t.querySelectorAll("img")).filter(e=>!e.complete);i.length>0&&(e.classList.add("loading"),await Promise.all(i.map(e=>new Promise(t=>{e.addEventListener("load",t,{once:!0}),e.addEventListener("error",t,{once:!0})}))),e.classList.remove("loading")),requestAnimationFrame(()=>{t.style.maxHeight=`${t.scrollHeight}px`})}_getFeedItems(){const e=this.hass.states[this._config.entity];if(!e)return[];if(e.attributes.entries&&Array.isArray(e.attributes.entries))return e.attributes.entries||[];if(this._config.entity.startsWith("event.")){const{title:t,link:i,summary:s,description:o,image:n}=e.attributes;if("string"==typeof t&&"string"==typeof i)return[{title:t,link:i,summary:s??void 0,description:o??void 0,image:n??void 0,published:e.state}]}return[]}_getItemImage(e){return e.image}_renderChannelInfo(e,t,i,s,o,n){return this._config.show_channel_info&&(e||t||i||s||this._config.show_published_date&&o)?q`
      <div class="channel-info ${this._config.crop_channel_image?"cropped-image":""}">
        ${this._config.show_channel_info&&i?q`<img class="channel-image" src="${i}" alt="${e||"Channel Image"}" />`:""}
        <div class="channel-text">
          ${this._config.show_channel_info&&e?q`<h2 class="channel-title">${e}</h2>`:""}
          ${this._config.show_published_date&&n?q`<p class="channel-published">
                <span class="label">${be(this.hass,"component.rss-accordion.card.last_updated")}:</span>
                ${n}
              </p>`:""}
          ${this._config.show_channel_info&&t?q`<p class="channel-description">${t}</p>`:""}
          ${this._config.show_channel_info&&s?q`<a class="channel-link" href="${s}" target="_blank" rel="noopener noreferrer"
                >${be(this.hass,"component.rss-accordion.card.visit_channel")}</a
              >`:""}
        </div>
      </div>
    `:q``}_renderItem(e){const t=this._getItemImage(e),i=e.summary||e.description||"",s=!1!==this._config.show_item_image&&!!t,o=s?i.replace(/<img[^>]*>/gi,""):i,n=new Date(e.published),r=Ae(n,this.hass),a=this._config.new_pill_duration_hours??1,c=((new Date).getTime()-n.getTime())/6e4,l=c>=0&&c<60*a,h={aspectRatio:this._config.image_ratio,objectFit:this._config.image_fit_mode||"cover"};return q`
      <details class="accordion-item">
        <summary class="accordion-header" @click=${this._onSummaryClick}>
          <div class="header-main">
            <a class="title-link" href="${e.link}" target="_blank" rel="noopener noreferrer"> ${e.title} </a>
            <div class="header-badges">
              ${l?q`<span class="new-pill">${be(this.hass,"component.rss-accordion.card.new_pill")}</span>`:""}
            </div>
          </div>
        </summary>
        <div class="accordion-content">
          <div class="item-published">${r}</div>
          ${s?q`<img
                class="item-image"
                src="${t}"
                alt="${e.title}"
                style=${$e(h)}
              />`:""}
          ${!1!==this._config.show_audio_player&&e.audio?q`
                <div class="audio-player-container">
                  <audio controls .src=${e.audio}></audio>
                </div>
              `:""}
          <div class="item-summary" .innerHTML=${o}></div>
          <a class="item-link" href="${e.link}" target="_blank" rel="noopener noreferrer">
            ${be(this.hass,"component.rss-accordion.card.to_news_article")}
          </a>
        </div>
      </details>
    `}render(){if(!this._config||!this.hass)return q``;const e=this.hass.states[this._config.entity];if(!e)return q`
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">Entity not found: ${this._config.entity}</div>
        </ha-card>
      `;const t=e.attributes.channel,i=t?.title,s=t?.link,o=t?.description||t?.subtitle,n=t?.image,r=t?.published,a=r?Ae(r,this.hass):void 0,c=this._getFeedItems(),l=this._config.max_items??c.length,h=c.slice(0,l);return 0===h.length?q`
        <ha-card .header=${this._config.title}>
          <div class="card-content"><i>No entries available.</i></div>
        </ha-card>
      `:q`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${this._renderChannelInfo(i,o,n,s,r,a)}
          ${h.map(e=>this._renderItem(e))}
        </div>
      </ha-card>
    `}static{this.styles=a`
    ${r(xe)}
  `}};e([pe({attribute:!1})],Ce.prototype,"hass",void 0),e([ue()],Ce.prototype,"_config",void 0),Ce=e([le(Ee)],Ce),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:Ee,name:"RSS Accordion",description:"A card to display RSS feed items in an accordion style.",documentationURL:"https://github.com/timmaurice/lovelace-rss-accordion"}));const ke=a`.card-config{display:flex;flex-direction:column;gap:16px}.group{border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 4px);display:flex;flex-direction:column;gap:8px;padding:16px}.group-header{color:var(--primary-text-color);font-size:1.1em;font-weight:bold;margin-bottom:8px}.row{align-items:flex-start;display:flex;flex-direction:row;gap:16px}.row>*{flex:1 1 50%;min-width:0}ha-formfield{padding-bottom:8px}`;let Pe=class extends ae{setConfig(e){this._config=e}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;if(!t.configValue)return;const i=t.configValue,s={...this._config};let o="HA-SWITCH"===t.tagName?t.checked:t.value;"image_fit_mode"===i&&"cover"===o&&(o=void 0),"show_item_image"===i?o?delete s.show_item_image:(s.show_item_image=!1,delete s.image_ratio,delete s.image_fit_mode):"show_audio_player"===i?o?delete s.show_audio_player:s.show_audio_player=!1:""===o||!1===o||void 0===o?(delete s[i],"show_channel_info"===i&&(delete s.show_published_date,delete s.crop_channel_image)):s[i]="number"===t.type?Number(o):o,"image_ratio"===i&&(s.image_ratio&&"auto"!==s.image_ratio||delete s.image_fit_mode),we(this,"config-changed",{config:s})}_entityChanged(e){if(!this._config||!this.hass)return;const t=e.detail.value,i={...this._config,entity:t},s=t?this.hass.states[t]:void 0,o=s?.attributes.channel;o?(o.published||delete i.show_published_date,o.image||delete i.crop_channel_image):(delete i.show_channel_info,delete i.crop_channel_image,delete i.show_published_date);const n=s?.attributes.entries??[];!!s?.attributes.audio||n.some(e=>!!e.audio)||delete i.show_audio_player,we(this,"config-changed",{config:i})}render(){if(!this.hass||!this._config)return q``;const e=this._config.entity?this.hass.states[this._config.entity]:void 0,t=e?.attributes.channel,i=t?.image,s=t?.published,o=e?.attributes.entries??[],n=!!e?.attributes.audio||o.some(e=>!!e.audio);return q`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${be(this.hass,"component.rss-accordion.editor.groups.core")}</div>
            <ha-textfield
              .label=${be(this.hass,"component.rss-accordion.editor.title")}
              .value=${this._config.title||""}
              .configValue=${"title"}
              @input=${this._valueChanged}
            ></ha-textfield>
            <ha-entity-picker
              .hass=${this.hass}
              .label=${be(this.hass,"component.rss-accordion.editor.entity")}
              .value=${this._config.entity||""}
              .includeDomains=${["sensor","event"]}
              @value-changed=${this._entityChanged}
              allow-custom-entity
              required
            ></ha-entity-picker>
          </div>

          <div class="group">
            <div class="group-header">${be(this.hass,"component.rss-accordion.editor.groups.feed")}</div>
            <div class="row">
              <ha-textfield
                .label=${be(this.hass,"component.rss-accordion.editor.max_items")}
                type="number"
                min="1"
                .value=${this._config.max_items||""}
                .configValue=${"max_items"}
                @input=${this._valueChanged}
                .placeholder=${be(this.hass,"component.rss-accordion.editor.max_items_placeholder")}
              ></ha-textfield>
              <ha-textfield
                .label=${be(this.hass,"component.rss-accordion.editor.new_pill_duration_hours")}
                type="number"
                min="1"
                .value=${this._config.new_pill_duration_hours||""}
                .configValue=${"new_pill_duration_hours"}
                @input=${this._valueChanged}
                .placeholder="1"
              ></ha-textfield>
            </div>
            <ha-formfield .label=${be(this.hass,"component.rss-accordion.editor.initial_open")}>
              <ha-switch
                .checked=${!!this._config.initial_open}
                .configValue=${"initial_open"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield .label=${be(this.hass,"component.rss-accordion.editor.allow_multiple")}>
              <ha-switch
                .checked=${!!this._config.allow_multiple}
                .configValue=${"allow_multiple"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            ${n?q`
                  <ha-formfield .label=${be(this.hass,"component.rss-accordion.editor.show_audio_player")}>
                    <ha-switch
                      .checked=${!1!==this._config.show_audio_player}
                      .configValue=${"show_audio_player"}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                `:""}
            <ha-formfield .label=${be(this.hass,"component.rss-accordion.editor.show_item_image")}>
              <ha-switch
                .checked=${!1!==this._config.show_item_image}
                .configValue=${"show_item_image"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${!1!==this._config.show_item_image?q`
                <div class="group">
                  <div class="group-header">
                    ${be(this.hass,"component.rss-accordion.editor.groups.item_images")}
                  </div>
                  <div class="row">
                    <ha-textfield
                      .label=${be(this.hass,"component.rss-accordion.editor.image_ratio")}
                      .value=${this._config.image_ratio||""}
                      .configValue=${"image_ratio"}
                      @input=${this._valueChanged}
                      .placeholder=${"auto"}
                      .pattern=${"^auto$|^\\d+(\\.\\d+)?$|^\\d+(\\.\\d+)?\\s*\\/\\s*\\d+(\\.\\d+)?$"}
                      .validationMessage=${be(this.hass,"component.rss-accordion.editor.image_ratio_validation_message")}
                    ></ha-textfield>
                    ${this._config.image_ratio&&"auto"!==this._config.image_ratio?q`
                          <ha-select
                            .label=${be(this.hass,"component.rss-accordion.editor.image_fit_mode")}
                            .value=${this._config.image_fit_mode||"cover"}
                            .configValue=${"image_fit_mode"}
                            @selected=${this._valueChanged}
                            @closed=${e=>e.stopPropagation()}
                            fixedMenuPosition
                            naturalMenuWidth
                          >
                            <mwc-list-item value="cover"
                              >${be(this.hass,"component.rss-accordion.editor.image_fit_mode_options.cover")}</mwc-list-item
                            >
                            <mwc-list-item value="contain"
                              >${be(this.hass,"component.rss-accordion.editor.image_fit_mode_options.contain")}</mwc-list-item
                            >
                          </ha-select>
                        `:""}
                  </div>
                </div>
              `:""}
          ${t?q`
                <div class="group">
                  <div class="group-header">
                    ${be(this.hass,"component.rss-accordion.editor.groups.channel")}
                  </div>
                  <ha-formfield .label=${be(this.hass,"component.rss-accordion.editor.show_channel_info")}>
                    <ha-switch
                      .checked=${!!this._config.show_channel_info}
                      .configValue=${"show_channel_info"}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                  ${this._config.show_channel_info&&i?q`
                        <ha-formfield
                          .label=${be(this.hass,"component.rss-accordion.editor.crop_channel_image")}
                        >
                          <ha-switch
                            .checked=${!!this._config.crop_channel_image}
                            .configValue=${"crop_channel_image"}
                            @change=${this._valueChanged}
                          ></ha-switch>
                        </ha-formfield>
                      `:""}
                  ${this._config.show_channel_info&&s?q`
                        <ha-formfield
                          .label=${be(this.hass,"component.rss-accordion.editor.show_channel_published_date")}
                        >
                          <ha-switch
                            .checked=${!!this._config.show_published_date}
                            .configValue=${"show_published_date"}
                            @change=${this._valueChanged}
                          ></ha-switch>
                        </ha-formfield>
                      `:""}
                </div>
              `:""}
        </div>
      </ha-card>
    `}static{this.styles=a`
    ${r(ke)}
  `}};e([pe({attribute:!1})],Pe.prototype,"hass",void 0),e([ue()],Pe.prototype,"_config",void 0),Pe=e([le("rss-accordion-editor")],Pe);var Oe=Object.freeze({__proto__:null,get RssAccordionEditor(){return Pe}});export{Ce as RssAccordion};
