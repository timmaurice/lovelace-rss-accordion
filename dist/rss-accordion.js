function e(e,t,i,o){var s,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(n<3?s(r):n>3?s(t,i,r):s(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}console.groupCollapsed("%cRSS ACCORDION%cv0.4.1","color: orange; font-weight: bold; background: black; padding: 2px 4px; border-radius: 2px 0 0 2px;","color: white; font-weight: bold; background: dimgray; padding: 2px 4px; border-radius: 0 2px 2px 0;"),console.info("A custom Lovelace card for Home Assistant to display RSS feed items in an accordion style."),console.info("Github:  https://github.com/timmaurice/lovelace-rss-accordion.git"),console.info("Sponsor: https://buymeacoffee.com/timmaurice"),console.groupEnd(),"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const r=e=>new n("string"==typeof e?e:e+"",void 0,o),a=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new n(i,e,o)},c=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return r(t)})(e):e,{is:l,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:m,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,f=g?g.emptyScript:"",$=_.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&h(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:s}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const n=o?.call(this);s?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...m(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(c(e))}else void 0!==e&&t.push(c(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(i)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of o){const o=document.createElement("style"),s=t.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=o;const n=s.fromAttribute(t,e.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(e,t,i){if(void 0!==e){const o=this.constructor,s=this[e];if(i??=o.getPropertyOptions(e),!((i.hasChanged??y)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[b("elementProperties")]=new Map,k[b("finalized")]=new Map,$?.({ReactiveElement:k}),(_.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,x=A.trustedTypes,S=x?x.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,O=`<${P}>`,H=document,U=()=>H.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,I="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,B=/>/g,N=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,D=/"/g,j=/^(?:script|style|textarea|title)$/i,V=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),K=new WeakMap,W=H.createTreeWalker(H,129);function J(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,o=[];let s,n=2===t?"<svg>":3===t?"<math>":"",r=R;for(let t=0;t<i;t++){const i=e[t];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===R?"!--"===c[1]?r=M:void 0!==c[1]?r=B:void 0!==c[2]?(j.test(c[2])&&(s=RegExp("</"+c[2],"g")),r=N):void 0!==c[3]&&(r=N):r===N?">"===c[0]?(r=s??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?N:'"'===c[3]?D:L):r===D||r===L?r=N:r===M||r===B?r=R:(r=N,s=void 0);const d=r===N&&e[t+1].startsWith("/>")?" ":"";n+=r===R?i+O:l>=0?(o.push(a),i.slice(0,l)+E+i.slice(l)+C+d):i+C+(-2===l?t:d)}return[J(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class Y{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let s=0,n=0;const r=e.length-1,a=this.parts,[c,l]=Z(e,t);if(this.el=Y.createElement(c,i),W.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=W.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(E)){const t=l[n++],i=o.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?te:"?"===r[1]?ie:"@"===r[1]?oe:ee}),o.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:s}),o.removeAttribute(e));if(j.test(o.tagName)){const e=o.textContent.split(C),t=e.length-1;if(t>0){o.textContent=x?x.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],U()),W.nextNode(),a.push({type:2,index:++s});o.append(e[t],U())}}}else if(8===o.nodeType)if(o.data===P)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=o.data.indexOf(C,e+1));)a.push({type:7,index:s}),e+=C.length-1}s++}}static createElement(e,t){const i=H.createElement("template");return i.innerHTML=e,i}}function G(e,t,i=e,o){if(t===q)return t;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=z(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(t=G(e,s._$AS(e,t.values),s,o)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??H).importNode(t,!0);W.currentNode=o;let s=W.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new X(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new se(s,this,e)),this._$AV.push(t),a=i[++r]}n!==a?.index&&(s=W.nextNode(),n++)}return W.currentNode=H,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=G(this,e,t),z(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new Q(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new Y(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const s of e)o===t.length?t.push(i=new X(this.O(U()),this.O(U()),this,this.options)):i=t[o],i._$AI(s),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,s){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(e,t=this,i,o){const s=this.strings;let n=!1;if(void 0===s)e=G(this,e,t,0),n=!z(e)||e!==this._$AH&&e!==q,n&&(this._$AH=e);else{const o=e;let r,a;for(e=s[0],r=0;r<s.length-1;r++)a=G(this,o[i+r],t,r),a===q&&(a=this._$AH[r]),n||=!z(a)||a!==this._$AH[r],a===F?e=F:e!==F&&(e+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class oe extends ee{constructor(e,t,i,o,s){super(e,t,i,o,s),this.type=5}_$AI(e,t=this){if((e=G(this,e,t,0)??F)===q)return;const i=this._$AH,o=e===F&&i!==F||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==F&&(i===F||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){G(this,e)}}const ne=A.litHtmlPolyfillSupport;ne?.(Y,X),(A.litHtmlVersions??=[]).push("3.3.1");const re=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ae=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let s=o._$litPart$;if(void 0===s){const e=i?.renderBefore??null;o._$litPart$=s=new X(t.insertBefore(U(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};ae._$litElement$=!0,ae.finalized=!0,re.litElementHydrateSupport?.({LitElement:ae});const ce=re.litElementPolyfillSupport;ce?.({LitElement:ae}),(re.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},de=(e=he,t,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,s,e)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];t.call(this,i),this.requestUpdate(o,s,e)}}throw Error("Unsupported decorator location: "+o)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function me(e){return(t,i)=>"object"==typeof i?de(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pe(e){return me({...e,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=1;let _e=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ge="important",fe=" !"+ge,$e=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends _e{constructor(e){if(super(e),e.type!==ue||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const o=e[i];return null==o?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const o=t[e];if(null!=o){this.ft.add(e);const t="string"==typeof o&&o.endsWith(fe);e.includes("-")||t?i.setProperty(e,t?o.slice(0,-11):o,t?ge:""):i[e]=o}}return q}});const be={de:{editor:{groups:{core:"Grundeinstellungen",feed:"Feed-Einträge & Verhalten",item_images:"Bilder der Einträge",channel:"Kanalinformationen"},title:"Titel (Optional)",entity:"Feed-Entität",allow_multiple:"Erlaube das Öffnen mehrerer Einträge",initial_open:"Neuesten Eintrag bei Laden öffnen",max_items:"Maximale Einträge",max_items_placeholder:"Alle Einträge",new_pill_duration_hours:"Dauer für 'NEU'-Anzeige (Stunden)",image_ratio:"Bild-Seitenverhältnis (z.B. 16/9 oder 1.77)",image_ratio_validation_message:"Ungültiges Format. Beispiel: 'auto', '16/9' oder '1.77'.",image_fit_mode:"Bild-Anpassung",image_fit_mode_options:{cover:"Ausfüllen (Cover)",contain:"Einfassen (Contain)"},show_channel_info:"Kanal-Infos anzeigen (vom 'channel'-Attribut)",show_channel_published_date:"Letzte Aktualisierung des Kanals anzeigen",crop_channel_image:"Kanalbild als zugeschnittenen Kreis anzeigen",show_audio_player:"Audio-Player anzeigen",show_item_image:"Bilder der Einträge anzeigen",show_bookmarks:"Lesezeichen für Einträge aktivieren"},card:{to_news_article:"Zum Nachrichtenartikel",new_pill:"NEU",visit_channel:"Kanal besuchen",last_updated:"Zuletzt aktualisiert",listened:"Angehört",listened_on:"Angehört am: {date}",entity_not_found:"Entität nicht gefunden: {entity}",no_entries:"Keine Einträge im Feed verfügbar.",no_bookmarked_entries:"Sie haben keine Lesezeichen.",channel_image_alt:"Kanalbild",add_bookmark:"Lesezeichen hinzufügen",remove_bookmark:"Lesezeichen entfernen",show_bookmarked:"Lesezeichen anzeigen",no_bookmarks_yet_tooltip:"Markieren Sie einen Eintrag als Lesezeichen, um diesen Filter zu aktivieren"}},en:{editor:{groups:{core:"Core Configuration",feed:"Feed Items & Behavior",item_images:"Item Images",channel:"Channel Information"},title:"Title (Optional)",entity:"Feed Entity",allow_multiple:"Allow multiple items to be open",initial_open:"Open latest item on load",max_items:"Maximum Items",max_items_placeholder:"All items",new_pill_duration_hours:"Duration for 'NEW' pill (hours)",image_ratio:"Image aspect ratio (e.g. 16/9 or 1.77)",image_ratio_validation_message:"Invalid format. Use 'auto', '16/9', or '1.77'.",image_fit_mode:"Image Fit Mode",image_fit_mode_options:{cover:"Cover (fill & crop)",contain:"Contain (fit inside)"},show_channel_info:"Show Channel Info (from 'channel' attribute)",show_channel_published_date:"Show channel's last update time",crop_channel_image:"Display channel image as a cropped circle",show_audio_player:"Show Audio Player",show_item_image:"Show Item Images",show_bookmarks:"Enable bookmarking for items"},card:{to_news_article:"To the news article",new_pill:"NEW",visit_channel:"Visit channel",last_updated:"Last updated",listened:"Listened",listened_on:"Listened on: {date}",entity_not_found:"Entity not found: {entity}",no_entries:"No entries available in feed.",no_bookmarked_entries:"You have no bookmarked items.",channel_image_alt:"Channel Image",add_bookmark:"Bookmark item",remove_bookmark:"Remove bookmark",show_bookmarked:"Show Bookmarked",no_bookmarks_yet_tooltip:"Bookmark an item to enable this filter"}},fr:{editor:{groups:{core:"Configuration de base",feed:"Éléments du flux et comportement",item_images:"Images des éléments",channel:"Informations sur le canal"},title:"Titre (Optionnel)",entity:"Entité du flux",allow_multiple:"Autoriser l'ouverture de plusieurs éléments",initial_open:"Ouvrir le dernier élément au chargement",max_items:"Nombre maximum d'éléments",max_items_placeholder:"Tous les éléments",new_pill_duration_hours:"Durée d'affichage de la pastille 'NOUVEAU' (heures)",image_ratio:"Ratio d'aspect de l'image (ex: 16/9 ou 1.77)",image_ratio_validation_message:"Format invalide. Utilisez 'auto', '16/9', ou '1.77'.",image_fit_mode:"Mode d'ajustement de l'image",image_fit_mode_options:{cover:"Couvrir (remplir et rogner)",contain:"Contenir (ajuster à l'intérieur)"},show_channel_info:"Afficher les informations du canal (de l'attribut 'channel')",show_channel_published_date:"Afficher la dernière heure de mise à jour du canal",crop_channel_image:"Afficher l'image du canal sous forme de cercle rogné",show_audio_player:"Afficher le lecteur audio",show_item_image:"Afficher les images des éléments",show_bookmarks:"Activer les favoris pour les éléments"},card:{to_news_article:"Vers l'article",new_pill:"NOUVEAU",visit_channel:"Visiter le canal",last_updated:"Dernière mise à jour",listened:"Écouté",listened_on:"Écouté le : {date}",entity_not_found:"Entité non trouvée : {entity}",no_entries:"Aucun élément disponible dans le flux.",no_bookmarked_entries:"Vous n'avez aucun favori.",channel_image_alt:"Image du canal",add_bookmark:"Ajouter aux favoris",remove_bookmark:"Retirer des favoris",show_bookmarked:"Afficher les favoris",no_bookmarks_yet_tooltip:"Ajoutez un élément aux favoris pour activer ce filtre"}}};function ve(e,t){let i=be[e];for(const e of t){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function ye(e,t,i={}){const o=e.language||"en",s=t.replace("component.rss-accordion.","").split("."),n=ve(o,s)??ve("en",s);if("string"==typeof n){let e=n;for(const t in i)e=e.replace(`{${t}}`,String(i[t]));return e}return t}const we=(e,t,i,o)=>{const s=new CustomEvent(t,{bubbles:!0,cancelable:!1,composed:!0,...o,detail:i});e.dispatchEvent(s)};function ke(e,t){const i=new Date(e),o={year:"numeric",month:"short",day:"2-digit",hour:"numeric",minute:"2-digit"};return t.locale&&("12"===t.locale.time_format?o.hour12=!0:"24"===t.locale.time_format&&(o.hour12=!1)),i.toLocaleString(t.language,o)}class Ae{constructor(e){this.audioStoragePrefix=`rss-accordion-progress-${e}-`,this.bookmarkStoragePrefix=`rss-accordion-bookmark-${e}-`}getAudioProgress(e){try{const t=localStorage.getItem(`${this.audioStoragePrefix}${e}`);return t?JSON.parse(t):null}catch(e){return console.error("Error reading audio progress from localStorage",e),null}}setAudioProgress(e,t){try{localStorage.setItem(`${this.audioStoragePrefix}${e}`,JSON.stringify(t))}catch(e){console.error("Error saving audio progress to localStorage",e)}}getBookmarkKey(e){return`${e.link}|${e.published}`}isBookmarked(e){const t=this.getBookmarkKey(e);return null!==localStorage.getItem(`${this.bookmarkStoragePrefix}${t}`)}setBookmark(e,t){const i=this.getBookmarkKey(e);t?localStorage.setItem(`${this.bookmarkStoragePrefix}${i}`,JSON.stringify(e)):localStorage.removeItem(`${this.bookmarkStoragePrefix}${i}`)}getBookmarkedItems(){const e=[];for(let t=0;t<localStorage.length;t++){const i=localStorage.key(t);if(i?.startsWith(this.bookmarkStoragePrefix))try{const t=JSON.parse(localStorage.getItem(i));e.push(t)}catch(e){console.error(`Error parsing bookmarked item from localStorage for key: ${i}`,e)}}return e}}const xe=a`﻿.card-content{padding:16px}.warning{color:var(--error-color);padding:16px}.channel-info{align-items:center;border-bottom:1px solid var(--divider-color);display:flex;gap:16px;margin-bottom:8px;padding-bottom:16px}.channel-info .channel-image{border-radius:0;height:auto;object-fit:contain;width:calc(25% - 8px)}.channel-info .channel-text{display:flex;flex-direction:column;flex-grow:1;justify-content:center;min-width:0}.channel-info .channel-title{color:var(--primary-text-color);font-size:1.2em;font-weight:bold;margin:0 0 4px 0}.channel-info .channel-description{color:var(--secondary-text-color);font-size:.9em;margin:0 0 8px 0}.channel-info .channel-published{color:var(--secondary-text-color);font-size:.85em;margin:-4px 0 8px 0}.channel-info .channel-published .label{font-weight:bold;margin-right:4px}.channel-info .channel-actions{align-items:center;display:flex;container-type:inline-size;gap:8px;justify-content:space-between;margin-top:8px}.channel-info .channel-link{color:var(--primary-color);flex-shrink:0;font-weight:bold;text-decoration:none}.channel-info .channel-link:hover{text-decoration:underline}.channel-info.cropped-image{align-items:center;flex-direction:row}.channel-info.cropped-image .channel-image{border-radius:50%;flex-shrink:0;height:60px;margin-bottom:0;object-fit:cover;width:60px}.accordion-header{cursor:pointer;font-weight:bold;list-style:none;padding:12px 0;padding-left:20px;position:relative}.accordion-header::-webkit-details-marker{display:none}.accordion-header::before{content:"▸";left:0;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease-in-out}.accordion-header .header-main{align-items:center;display:grid;gap:8px;grid-template-columns:1fr auto;width:100%}.accordion-header .header-main .header-badges{align-items:center;display:flex;gap:8px}.accordion-header .header-main .title-link{color:var(--primary-text-color);cursor:default;overflow-wrap:break-word;pointer-events:none;text-decoration:none;white-space:normal}.accordion-header .header-main .title-link:visited{color:var(--secondary-text-color)}.accordion-header .header-main .new-pill{background-color:var(--primary-color);border-radius:10px;color:var(--text-primary-color);font-size:.7em;font-weight:bold;padding:2px 8px}.accordion-header .header-main .bookmark-button{--mdc-icon-button-size: 24px;color:var(--accent-color)}.accordion-content{color:var(--secondary-text-color);font-size:.9em;max-height:0;overflow:hidden;padding:0 0 0 20px;transition:max-height .3s ease-in-out,padding-bottom .3s ease-in-out}.accordion-content .item-published{color:var(--secondary-text-color);font-size:1em;margin-bottom:1em}.accordion-content .item-image{border-radius:var(--ha-card-border-radius, 4px);display:block;height:auto;margin-bottom:1em;max-width:100%}.accordion-content .item-link{color:var(--primary-color);display:inline-block;font-weight:bold;margin-top:8px;text-decoration:none}.accordion-content .item-link:hover{text-decoration:underline}.accordion-item{border-bottom:1px solid var(--divider-color)}.accordion-item:last-of-type{border-bottom:none}.accordion-item[open]>.accordion-header::before{transform:translateY(-50%) rotate(90deg)}.accordion-item[open]>.accordion-content{padding-bottom:12px}.accordion-item.loading>.accordion-header .header-main .new-pill{display:none}.accordion-item.loading>.accordion-header .header-main::after{animation:spin 1s linear infinite;border:2px solid var(--primary-color);border-radius:50%;border-top-color:rgba(0,0,0,0);content:"";display:inline-block;flex-shrink:0;height:16px;margin-left:8px;width:16px}@keyframes spin{to{transform:rotate(360deg)}}.audio-player-container{line-height:0;margin-bottom:1em}.audio-player-container audio{border-radius:50px;height:40px;width:100%}.listened-icon{color:var(--primary-color);vertical-align:middle}.bookmark-filter-button{--mdc-button-outline-color: var(--divider-color);--mdc-theme-primary: var(--primary-text-color);--ha-font-size-m: 12px;--icon-color: var(--primary-text-color);--mdc-typography-button-font-size: 0.8rem}.bookmark-filter-button ha-icon{--mdc-icon-size: 12px;margin-right:.5em;transform:translate(0, -1px)}@container (max-width: 245px){.bookmark-filter-button ha-icon{--mdc-icon-size: 14px;margin-right:0;transform:none}.bookmark-filter-button .button-text{display:none}}.bookmark-filter-button.active{--mdc-theme-primary: var(--text-primary-color);--button-color-fill-loud-hover: var(--accent-color);--wa-color-fill-loud: var(--accent-color);--icon-color: var(--text-primary-color);--mdc-button-outline-color: var(--accent-color)}.bookmark-filter-button[disabled]{--mdc-button-outline-color: var(--disabled-text-color);color:var(--disabled-text-color);cursor:not-allowed}`,Se="rss-accordion",Ee=`${Se}-editor`;let Ce=class extends ae{constructor(){super(...arguments),this._showOnlyBookmarks=!1,this._lastAudioSave=new Map}setConfig(e){if(!e||!e.entity)throw new Error("You need to define an entity");this._config=e,this._storageHelper=new Ae(e.entity)}static async getConfigElement(){const e=window.loadCardHelpers;if(!e)throw new Error("This card requires Home Assistant 2023.4+ and `loadCardHelpers` is not available.");const t=await e(),i=await t.createCardElement({type:"entities",entities:[]});return await i.constructor.getConfigElement(),await Promise.resolve().then(function(){return He}),document.createElement(Ee)}static getStubConfig(){return{entity:"sensor.your_rss_feed_sensor",max_items:5}}getCardSize(){if(!this.hass||!this._config?.entity)return 1;const e=this._getAllDisplayableItems().length,t=this._config.max_items??e,i=Math.min(e,t);let o=(this._config.title?1:0)+(i||1);const s=this.hass.states[this._config.entity],n=s?.attributes.channel;return this._shouldRenderChannelInfo(n)&&(o+=2),o}connectedCallback(){super.connectedCallback(),this._resizeObserver||(this._resizeObserver=new ResizeObserver(()=>this._handleResize())),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver&&this._resizeObserver.disconnect()}_handleResize(){this.shadowRoot?.querySelectorAll(".accordion-item[open]").forEach(e=>{const t=e.querySelector(".accordion-content");if(t){const e=t.style.transition;t.style.transition="none",t.style.maxHeight=`${t.scrollHeight}px`,requestAnimationFrame(()=>{t.style.transition=e})}})}shouldUpdate(e){if(e.has("_config"))return!0;const t=e.get("hass");return!t||(t.states[this._config.entity]!==this.hass.states[this._config.entity]||t.language!==this.hass.language)}firstUpdated(){this._config?.initial_open&&setTimeout(()=>{const e=this.shadowRoot?.querySelector(".accordion-item");e&&!e.open&&this._openAccordion(e)},0)}async _onSummaryClick(e){const t=e.target;if(t.closest&&t.closest("a.title-link"))return;e.preventDefault();const i=e.currentTarget.closest(".accordion-item");i&&(i.open?this._closeAccordion(i):await this._openAccordion(i))}_closeAccordion(e){e.classList.remove("loading");const t=e.querySelector(".accordion-content");if(!t)return;t.style.maxHeight="0px";const i=()=>{e.removeAttribute("open"),t.removeEventListener("transitionend",i)};t.addEventListener("transitionend",i)}async _openAccordion(e){const t=e.querySelector(".accordion-content");if(!t)return;this._config.allow_multiple||this.shadowRoot?.querySelectorAll(".accordion-item[open]").forEach(t=>{t!==e&&this._closeAccordion(t)}),e.setAttribute("open","");const i=Array.from(t.querySelectorAll("img")).filter(e=>!e.complete);i.length>0&&(e.classList.add("loading"),await Promise.all(i.map(e=>new Promise(t=>{e.addEventListener("load",t,{once:!0}),e.addEventListener("error",t,{once:!0})}))),e.classList.remove("loading")),requestAnimationFrame(()=>{t.style.maxHeight=`${t.scrollHeight}px`})}_onAudioLoaded(e,t){const i=e.target,o=this._storageHelper.getAudioProgress(t);o&&!o.completed&&(i.currentTime=o.currentTime)}_onAudioTimeUpdate(e,t){const i=Date.now(),o=this._lastAudioSave.get(t);if(void 0===o||i-o>5e3){const s=e.target;if(void 0===o&&0===s.currentTime)return void this._lastAudioSave.set(t,i);const n=this._storageHelper.getAudioProgress(t)||{currentTime:0,completed:!1};if(n.completed)return;n.currentTime=s.currentTime,this._storageHelper.setAudioProgress(t,n),this._lastAudioSave.set(t,i)}}_onAudioEnded(e,t){const i=this._storageHelper.getAudioProgress(t)||{currentTime:0,completed:!1};this._storageHelper.setAudioProgress(t,{...i,currentTime:0,completed:!0,completedAt:(new Date).toISOString()}),this.requestUpdate()}_toggleBookmark(e,t){e.stopPropagation(),e.preventDefault();const i=this._storageHelper.isBookmarked(t);this._storageHelper.setBookmark(t,!i),this.requestUpdate()}_getAllDisplayableItems(){const e=new Map;if(this._config.show_bookmarks){const t=this._storageHelper.getBookmarkedItems();for(const i of t)e.set(this._storageHelper.getBookmarkKey(i),i)}const t=this._getFeedItems();for(const i of t)e.set(this._storageHelper.getBookmarkKey(i),i);const i=Array.from(e.values());return i.sort((e,t)=>new Date(t.published).getTime()-new Date(e.published).getTime()),i}_getFeedItems(){const e=this.hass.states[this._config.entity];if(!e)return[];if(e.attributes.entries&&Array.isArray(e.attributes.entries))return e.attributes.entries||[];if(this._config.entity.startsWith("event.")){const{title:t,link:i,summary:o,description:s,image:n}=e.attributes;if("string"==typeof t&&"string"==typeof i)return[{title:t,link:i,summary:o??void 0,description:s??void 0,image:n??void 0,published:e.state}]}return[]}_getItemImage(e){return e.image}_shouldRenderChannelInfo(e){return!(!this._config.show_channel_info||!e)&&!!(e.title||e.description||e.subtitle||e.image||e.link||this._config.show_published_date&&e.published)}_renderChannelActions(e){const t=this._getAllDisplayableItems(),i=!(!this._config.show_bookmarks||!t.some(e=>this._storageHelper.isBookmarked(e)));return V`
      <div class="channel-actions">
        ${e?V`<a class="channel-link" href="${e}" target="_blank" rel="noopener noreferrer"
              >${ye(this.hass,"component.rss-accordion.card.visit_channel")}</a
            >`:""}
        ${this._renderBookmarkFilter(i)}
      </div>
    `}_renderChannelInfo(e){if(!e)return V``;const t=e.title,i=e.link,o=e.description||e.subtitle,s=e.image,n=e.published,r=n?ke(n,this.hass):void 0;return V`
      <div class="channel-info ${this._config.crop_channel_image?"cropped-image":""}">
        ${s?V`<img
              class="channel-image"
              src="${s}"
              alt="${t||ye(this.hass,"component.rss-accordion.card.channel_image_alt")}"
            />`:""}
        <div class="channel-text">
          ${t?V`<h2 class="channel-title">${t}</h2>`:""}
          ${this._config.show_published_date&&r?V`<p class="channel-published">
                <span class="label">${ye(this.hass,"component.rss-accordion.card.last_updated")}:</span>
                ${r}
              </p>`:""}
          ${o?V`<p class="channel-description">${o}</p>`:""}
          ${this._renderChannelActions(i)}
        </div>
      </div>
    `}_renderItem(e){const t=this._getItemImage(e),i=e.summary||e.description||"",o=!1!==this._config.show_item_image&&!!t,s=o?i.replace(/<img[^>]*>/gi,""):i,n=new Date(e.published),r=ke(n,this.hass),a=this._config.new_pill_duration_hours??1,c=((new Date).getTime()-n.getTime())/6e4,l=c>=0&&c<60*a,h=this._storageHelper.isBookmarked(e),d=e.audio,m=d?this._storageHelper.getAudioProgress(d):null,p=m?.completed??!1;let u=ye(this.hass,"component.rss-accordion.card.listened");if(p&&m?.completedAt){const e=ke(m.completedAt,this.hass);u=ye(this.hass,"component.rss-accordion.card.listened_on",{date:e})}const _={aspectRatio:this._config.image_ratio,objectFit:this._config.image_fit_mode||"cover"};return V`
      <details class="accordion-item">
        <summary class="accordion-header" @click=${this._onSummaryClick}>
          <div class="header-main">
            <a class="title-link" href="${e.link}" target="_blank" rel="noopener noreferrer"> ${e.title} </a>
            <div class="header-badges">
              ${this._config.show_bookmarks?V`<span
                    class="bookmark-button"
                    role="button"
                    tabindex="0"
                    title="${ye(this.hass,h?"component.rss-accordion.card.remove_bookmark":"component.rss-accordion.card.add_bookmark")}"
                    @click=${t=>this._toggleBookmark(t,e)}
                    ><ha-icon icon=${h?"mdi:star":"mdi:star-outline"}></ha-icon
                  ></span>`:""}
              ${l?V`<span class="new-pill">${ye(this.hass,"component.rss-accordion.card.new_pill")}</span>`:""}
              ${d&&p?V`<ha-icon
                    class="listened-icon"
                    icon="mdi:check-circle-outline"
                    title="${u}"
                  ></ha-icon>`:""}
            </div>
          </div>
        </summary>
        <div class="accordion-content">
          <div class="item-published">${r}</div>
          ${o?V`<img
                class="item-image"
                src="${t}"
                alt="${e.title}"
                style=${$e(_)}
              />`:""}
          ${!1!==this._config.show_audio_player&&e.audio?V`
                <div class="audio-player-container">
                  <audio
                    controls
                    .src=${d}
                    @loadedmetadata=${e=>this._onAudioLoaded(e,d)}
                    @timeupdate=${e=>this._onAudioTimeUpdate(e,d)}
                    @ended=${e=>this._onAudioEnded(e,d)}
                  ></audio>
                </div>
              `:""}
          <div class="item-summary" .innerHTML=${s}></div>
          <a class="item-link" href="${e.link}" target="_blank" rel="noopener noreferrer">
            ${ye(this.hass,"component.rss-accordion.card.to_news_article")}
          </a>
        </div>
      </details>
    `}render(){if(!this._config||!this.hass)return V``;const e=this.hass.states[this._config.entity];if(!e)return V`
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">
            ${ye(this.hass,"component.rss-accordion.card.entity_not_found",{entity:this._config.entity})}
          </div>
        </ha-card>
      `;const t=e.attributes.channel;let i=this._getAllDisplayableItems();const o=!(!this._config.show_bookmarks||!i.some(e=>this._storageHelper.isBookmarked(e)));this._config.show_bookmarks&&this._showOnlyBookmarks&&(i=i.filter(e=>this._storageHelper.isBookmarked(e)));const s=this._config.max_items??i.length,n=i.slice(0,s);return 0===n.length?this._showOnlyBookmarks?V`
          <ha-card .header=${this._config.title}>
            <div class="card-content">
              ${this._shouldRenderChannelInfo(t)?this._renderChannelInfo(t):""}
              ${this._renderBookmarkFilter(o)}
              <i>${ye(this.hass,"component.rss-accordion.card.no_bookmarked_entries")}</i>
            </div>
          </ha-card>
        `:V`
        <ha-card .header=${this._config.title}>
          <div class="card-content"><i>${ye(this.hass,"component.rss-accordion.card.no_entries")}</i></div>
        </ha-card>
      `:V`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${this._shouldRenderChannelInfo(t)?this._renderChannelInfo(t):this._renderBookmarkFilter(o)}
          ${n.map(e=>this._renderItem(e))}
        </div>
      </ha-card>
    `}_renderBookmarkFilter(e){return this._config.show_bookmarks?V`
      <ha-button
        outlined
        class="bookmark-filter-button ${this._showOnlyBookmarks?"active":""}"
        ?disabled=${!e}
        size="small"
        title="${ye(this.hass,e?"component.rss-accordion.card.show_bookmarked":"component.rss-accordion.card.no_bookmarks_yet_tooltip")}"
        @click=${()=>{e&&(this._showOnlyBookmarks=!this._showOnlyBookmarks)}}
      >
        <ha-icon icon="mdi:star"></ha-icon>
        <span class="button-text">${ye(this.hass,"component.rss-accordion.card.show_bookmarked")}</span>
      </ha-button>
    `:V``}static{this.styles=[a`
      ${r(xe)}
    `,a`
      .bookmark-button {
        cursor: pointer;
      }
    `]}};e([me({attribute:!1})],Ce.prototype,"hass",void 0),e([pe()],Ce.prototype,"_config",void 0),e([pe()],Ce.prototype,"_showOnlyBookmarks",void 0),Ce=e([le(Se)],Ce),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:Se,name:"RSS Accordion",description:"A card to display RSS feed items in an accordion style.",documentationURL:"https://github.com/timmaurice/lovelace-rss-accordion"}));const Pe=a`.card-config{display:flex;flex-direction:column;gap:16px}.group{border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 4px);display:flex;flex-direction:column;gap:8px;padding:16px}.group-header{color:var(--primary-text-color);font-size:1.1em;font-weight:bold;margin-bottom:8px}.row{align-items:flex-start;display:flex;flex-direction:row;gap:16px}.row>*{flex:1 1 50%;min-width:0}ha-formfield{padding-bottom:8px}`;let Oe=class extends ae{setConfig(e){this._config=e}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;if(!t.configValue)return;const i=t.configValue,o={...this._config};let s="HA-SWITCH"===t.tagName?t.checked:t.value;"image_fit_mode"===i&&"cover"===s&&(s=void 0),"show_item_image"===i?s?delete o.show_item_image:(o.show_item_image=!1,delete o.image_ratio,delete o.image_fit_mode):"show_audio_player"===i?s?delete o.show_audio_player:o.show_audio_player=!1:""===s||!1===s||void 0===s?(delete o[i],"show_channel_info"===i&&(delete o.show_published_date,delete o.crop_channel_image)):o[i]="number"===t.type?Number(s):s,"image_ratio"===i&&(o.image_ratio&&"auto"!==o.image_ratio||delete o.image_fit_mode),we(this,"config-changed",{config:o})}_entityChanged(e){if(!this._config||!this.hass)return;const t=e.detail.value,i={...this._config,entity:t},o=t?this.hass.states[t]:void 0,s=o?.attributes.channel;s?(s.published||delete i.show_published_date,s.image||delete i.crop_channel_image):(delete i.show_channel_info,delete i.crop_channel_image,delete i.show_published_date);const n=o?.attributes.entries??[];!!o?.attributes.audio||n.some(e=>!!e.audio)||delete i.show_audio_player,we(this,"config-changed",{config:i})}render(){if(!this.hass||!this._config)return V``;const e=this._config.entity?this.hass.states[this._config.entity]:void 0,t=e?.attributes.channel,i=t?.image,o=t?.published,s=e?.attributes.entries??[],n=!!e?.attributes.audio||s.some(e=>!!e.audio);return V`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${ye(this.hass,"component.rss-accordion.editor.groups.core")}</div>
            <ha-textfield
              .label=${ye(this.hass,"component.rss-accordion.editor.title")}
              .value=${this._config.title||""}
              .configValue=${"title"}
              @input=${this._valueChanged}
            ></ha-textfield>
            <ha-entity-picker
              .hass=${this.hass}
              .label=${ye(this.hass,"component.rss-accordion.editor.entity")}
              .value=${this._config.entity||""}
              .includeDomains=${["sensor","event"]}
              @value-changed=${this._entityChanged}
              allow-custom-entity
              required
            ></ha-entity-picker>
          </div>

          <div class="group">
            <div class="group-header">${ye(this.hass,"component.rss-accordion.editor.groups.feed")}</div>
            <div class="row">
              <ha-textfield
                .label=${ye(this.hass,"component.rss-accordion.editor.max_items")}
                type="number"
                min="1"
                .value=${this._config.max_items||""}
                .configValue=${"max_items"}
                @input=${this._valueChanged}
                .placeholder=${ye(this.hass,"component.rss-accordion.editor.max_items_placeholder")}
              ></ha-textfield>
              <ha-textfield
                .label=${ye(this.hass,"component.rss-accordion.editor.new_pill_duration_hours")}
                type="number"
                min="1"
                .value=${this._config.new_pill_duration_hours||""}
                .configValue=${"new_pill_duration_hours"}
                @input=${this._valueChanged}
                .placeholder="1"
              ></ha-textfield>
            </div>
            <ha-formfield .label=${ye(this.hass,"component.rss-accordion.editor.initial_open")}>
              <ha-switch
                .checked=${!!this._config.initial_open}
                .configValue=${"initial_open"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield .label=${ye(this.hass,"component.rss-accordion.editor.allow_multiple")}>
              <ha-switch
                .checked=${!!this._config.allow_multiple}
                .configValue=${"allow_multiple"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            ${n?V`
                  <ha-formfield .label=${ye(this.hass,"component.rss-accordion.editor.show_audio_player")}>
                    <ha-switch
                      .checked=${!1!==this._config.show_audio_player}
                      .configValue=${"show_audio_player"}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                `:""}
            <ha-formfield .label=${ye(this.hass,"component.rss-accordion.editor.show_bookmarks")}>
              <ha-switch
                .checked=${!!this._config.show_bookmarks}
                .configValue=${"show_bookmarks"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield .label=${ye(this.hass,"component.rss-accordion.editor.show_item_image")}>
              <ha-switch
                .checked=${!1!==this._config.show_item_image}
                .configValue=${"show_item_image"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${!1!==this._config.show_item_image?V`
                <div class="group">
                  <div class="group-header">
                    ${ye(this.hass,"component.rss-accordion.editor.groups.item_images")}
                  </div>
                  <div class="row">
                    <ha-textfield
                      .label=${ye(this.hass,"component.rss-accordion.editor.image_ratio")}
                      .value=${this._config.image_ratio||""}
                      .configValue=${"image_ratio"}
                      @input=${this._valueChanged}
                      .placeholder=${"auto"}
                      .pattern=${"^auto$|^\\d+(\\.\\d+)?$|^\\d+(\\.\\d+)?\\s*\\/\\s*\\d+(\\.\\d+)?$"}
                      .validationMessage=${ye(this.hass,"component.rss-accordion.editor.image_ratio_validation_message")}
                    ></ha-textfield>
                    ${this._config.image_ratio&&"auto"!==this._config.image_ratio?V`
                          <ha-select
                            .label=${ye(this.hass,"component.rss-accordion.editor.image_fit_mode")}
                            .value=${this._config.image_fit_mode||"cover"}
                            .configValue=${"image_fit_mode"}
                            @selected=${this._valueChanged}
                            @closed=${e=>e.stopPropagation()}
                            fixedMenuPosition
                            naturalMenuWidth
                          >
                            <mwc-list-item value="cover"
                              >${ye(this.hass,"component.rss-accordion.editor.image_fit_mode_options.cover")}</mwc-list-item
                            >
                            <mwc-list-item value="contain"
                              >${ye(this.hass,"component.rss-accordion.editor.image_fit_mode_options.contain")}</mwc-list-item
                            >
                          </ha-select>
                        `:""}
                  </div>
                </div>
              `:""}
          ${t?V`
                <div class="group">
                  <div class="group-header">
                    ${ye(this.hass,"component.rss-accordion.editor.groups.channel")}
                  </div>
                  <ha-formfield .label=${ye(this.hass,"component.rss-accordion.editor.show_channel_info")}>
                    <ha-switch
                      .checked=${!!this._config.show_channel_info}
                      .configValue=${"show_channel_info"}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                  ${this._config.show_channel_info&&i?V`
                        <ha-formfield
                          .label=${ye(this.hass,"component.rss-accordion.editor.crop_channel_image")}
                        >
                          <ha-switch
                            .checked=${!!this._config.crop_channel_image}
                            .configValue=${"crop_channel_image"}
                            @change=${this._valueChanged}
                          ></ha-switch>
                        </ha-formfield>
                      `:""}
                  ${this._config.show_channel_info&&o?V`
                        <ha-formfield
                          .label=${ye(this.hass,"component.rss-accordion.editor.show_channel_published_date")}
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
    ${r(Pe)}
  `}};e([me({attribute:!1})],Oe.prototype,"hass",void 0),e([pe()],Oe.prototype,"_config",void 0),Oe=e([le("rss-accordion-editor")],Oe);var He=Object.freeze({__proto__:null,get RssAccordionEditor(){return Oe}});export{Ce as RssAccordion};
