function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=t=>new o("string"==typeof t?t:t+"",void 0,s),a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},c=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return r(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:m}=Object,_=globalThis,f=_.trustedTypes,g=f?f.emptyScript:"",$=_.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),A={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=A){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(c(t))}else void 0!==t&&e.push(c(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,n=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??b)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,$?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E=globalThis,x=E.trustedTypes,S=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+k,O=`<${P}>`,U=document,T=()=>U.createComment(""),H=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,M="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,D=/>/g,j=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,I=/"/g,q=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),F=new WeakMap,Z=U.createTreeWalker(U,129);function Y(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===N?"!--"===c[1]?r=z:void 0!==c[1]?r=D:void 0!==c[2]?(q.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=j):void 0!==c[3]&&(r=j):r===j?">"===c[0]?(r=n??N,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?j:'"'===c[3]?I:L):r===I||r===L?r=j:r===z||r===D?r=N:(r=j,n=void 0);const d=r===j&&t[e+1].startsWith("/>")?" ":"";o+=r===N?i+O:l>=0?(s.push(a),i.slice(0,l)+C+i.slice(l)+k+d):i+k+(-2===l?e:d)}return[Y(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[c,l]=J(t,e);if(this.el=K.createElement(c,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=l[o++],i=s.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(q.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],T()),Z.nextNode(),a.push({type:2,index:++n});s.append(t[e],T())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const i=U.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,s){if(e===V)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=H(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=G(t,n._$AS(t,e.values),n,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??U).importNode(e,!0);Z.currentNode=s;let n=Z.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=Z.nextNode(),o++)}return Z.currentNode=U,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),H(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new K(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new X(this.O(T()),this.O(T()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=G(this,t,e,0),o=!H(t)||t!==this._$AH&&t!==V,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=G(this,s[i+r],e,r),a===V&&(a=this._$AH[r]),o||=!H(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends tt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??W)===V)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=E.litHtmlPolyfillSupport;ot?.(K,X),(E.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let at=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new X(e.insertBefore(T(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},dt=(t=ht,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return pt({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=1;let _t=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft="important",gt=" !"+ft,$t=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends _t{constructor(t){if(super(t),t.type!==mt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(gt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?ft:""):i[t]=s}}return V}});const yt={de:{editor:{title:"Titel (Optional)",entity:"Feed-Entität",allow_multiple:"Erlaube das Öffnen mehrerer Einträge",initial_open:"Neuesten Eintrag bei Laden öffnen",max_items:"Maximale Einträge",max_items_placeholder:"Alle Einträge",new_pill_duration_hours:"Dauer für 'NEU'-Anzeige (Stunden)",strip_summary_images:"Bilder aus der Zusammenfassung entfernen (verwenden Sie dies, wenn Sie zwei Bilder sehen)",image_ratio:"Bild-Seitenverhältnis (z.B. 16/9 oder 1.77)",image_ratio_validation_message:"Ungültiges Format. Beispiel: 'auto', '16/9' oder '1.77'."},card:{to_news_article:"Zum Nachrichtenartikel",new_pill:"NEU"}},en:{editor:{title:"Title (Optional)",entity:"Feed Entity",allow_multiple:"Allow multiple items to be open",initial_open:"Open latest item on load",max_items:"Maximum Items",max_items_placeholder:"All items",new_pill_duration_hours:"Duration for 'NEW' pill (hours)",strip_summary_images:"Remove images from summary (use when you see two images)",image_ratio:"Image aspect ratio (e.g. 16/9 or 1.77)",image_ratio_validation_message:"Invalid format. Use 'auto', '16/9', or '1.77'."},card:{to_news_article:"To the news article",new_pill:"NEW"}}};function vt(t,e){let i=yt[t];for(const t of e){if("object"!=typeof i||null===i)return;i=i[t]}return"string"==typeof i?i:void 0}function bt(t,e,i={}){const s=t.language||"en",n=e.replace("component.rss-accordion.","").split("."),o=vt(s,n)??vt("en",n);if("string"==typeof o){let t=o;for(const e in i)t=t.replace(`{${e}}`,String(i[e]));return t}return e}const At=a`﻿.card-content{padding:16px}.warning{color:var(--error-color);padding:16px}.accordion-header{cursor:pointer;font-weight:bold;list-style:none;padding:12px 0;padding-left:20px;position:relative}.accordion-header::-webkit-details-marker{display:none}.accordion-header::before{content:"▸";left:0;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease-in-out}.accordion-header .header-main{align-items:center;display:flex;justify-content:space-between;width:100%}.accordion-header .header-main .title-link{color:var(--primary-text-color);cursor:default;pointer-events:none;text-decoration:none}.accordion-header .header-main .title-link:visited{color:var(--secondary-text-color)}.accordion-header .header-main .new-pill{background-color:var(--primary-color);border-radius:10px;color:var(--text-primary-color);flex-shrink:0;font-size:.7em;font-weight:bold;margin-left:8px;padding:2px 8px}.accordion-content{color:var(--secondary-text-color);font-size:.9em;max-height:0;overflow:hidden;padding:0 0 0 20px;transition:max-height .3s ease-in-out,padding-bottom .3s ease-in-out}.accordion-content .item-published{color:var(--secondary-text-color);font-size:1em;margin-bottom:8px;padding-top:12px}.accordion-content .item-image{border-radius:var(--ha-card-border-radius, 4px);display:block;height:auto;margin-bottom:8px;max-width:100%;object-fit:cover}.accordion-content .item-link{color:var(--primary-color);display:inline-block;font-weight:bold;margin-top:8px;text-decoration:none}.accordion-content .item-link:hover{text-decoration:underline}.accordion-item{border-bottom:1px solid var(--divider-color)}.accordion-item:last-of-type{border-bottom:none}.accordion-item[open]>.accordion-header::before{transform:translateY(-50%) rotate(90deg)}.accordion-item[open]>.accordion-content{padding-bottom:12px}.accordion-item.loading>.accordion-header .header-main .new-pill{display:none}.accordion-item.loading>.accordion-header .header-main::after{content:"";display:inline-block;width:16px;height:16px;border:2px solid var(--primary-color);border-top-color:rgba(0,0,0,0);border-radius:50%;animation:spin 1s linear infinite;margin-left:8px;flex-shrink:0}@keyframes spin{to{transform:rotate(360deg)}}`,wt="rss-accordion",Et=`${wt}-editor`;console.info("%c RSS-ACCORDION %c 0.0.1 ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");let xt=class extends at{setConfig(t){if(!t||!t.entity)throw new Error("You need to define an entity");this._config=t}static async getConfigElement(){const t=window.loadCardHelpers;if(!t)throw new Error("This card requires Home Assistant 2023.4+ and `loadCardHelpers` is not available.");const e=await t(),i=await e.createCardElement({type:"entities",entities:[]});return await i.constructor.getConfigElement(),await Promise.resolve().then(function(){return Pt}),document.createElement(Et)}static getStubConfig(){return{entity:"sensor.your_rss_feed_sensor",max_items:5}}getCardSize(){if(!this.hass||!this._config?.entity)return 1;const t=this.hass.states[this._config.entity];if(!t)return 1;let e=0;if(t.attributes.entries&&Array.isArray(t.attributes.entries))e=t.attributes.entries.length;else if(this._config.entity.startsWith("event.")){const{title:i,link:s}=t.attributes;i&&s&&(e=1)}const i=this._config.max_items??e,s=Math.min(e,i);return(this._config.title?1:0)+(s||1)}connectedCallback(){super.connectedCallback(),this._resizeObserver||(this._resizeObserver=new ResizeObserver(()=>this._handleResize())),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver&&this._resizeObserver.disconnect()}_handleResize(){this.shadowRoot?.querySelectorAll(".accordion-item[open]").forEach(t=>{const e=t.querySelector(".accordion-content");if(e){const t=e.style.transition;e.style.transition="none",e.style.maxHeight=`${e.scrollHeight}px`,requestAnimationFrame(()=>{e.style.transition=t})}})}firstUpdated(){this._config?.initial_open&&setTimeout(()=>{const t=this.shadowRoot?.querySelector(".accordion-item");t&&!t.open&&this._openAccordion(t)},0)}async _onSummaryClick(t){t.preventDefault();const e=t.currentTarget.closest(".accordion-item");e&&(e.open?this._closeAccordion(e):await this._openAccordion(e))}_closeAccordion(t){t.classList.remove("loading");const e=t.querySelector(".accordion-content");if(!e)return;e.style.maxHeight="0px";const i=()=>{t.removeAttribute("open"),e.removeEventListener("transitionend",i)};e.addEventListener("transitionend",i)}async _openAccordion(t){const e=t.querySelector(".accordion-content");if(!e)return;this._config.allow_multiple||this.shadowRoot?.querySelectorAll(".accordion-item[open]").forEach(e=>{e!==t&&this._closeAccordion(e)}),t.setAttribute("open","");const i=Array.from(e.querySelectorAll("img")).filter(t=>!t.complete);i.length>0&&(t.classList.add("loading"),await Promise.all(i.map(t=>new Promise(e=>{t.addEventListener("load",e,{once:!0}),t.addEventListener("error",e,{once:!0})}))),t.classList.remove("loading")),requestAnimationFrame(()=>{e.style.maxHeight=`${e.scrollHeight}px`})}_getDateTimeFormatOptions(){const t={year:"numeric",month:"short",day:"2-digit",hour:"numeric",minute:"2-digit"};return this.hass.locale&&("12"===this.hass.locale.time_format?t.hour12=!0:"24"===this.hass.locale.time_format&&(t.hour12=!1)),t}_getFeedItems(){const t=this.hass.states[this._config.entity];if(!t)return[];if(t.attributes.entries&&Array.isArray(t.attributes.entries))return t.attributes.entries||[];if(this._config.entity.startsWith("event.")){const{title:e,link:i,summary:s,description:n,image:o}=t.attributes;if("string"==typeof e&&"string"==typeof i)return[{title:e,link:i,summary:s??void 0,description:n??void 0,image:o??void 0,published:t.state}]}return[]}render(){if(!this._config||!this.hass)return B``;if(!this.hass.states[this._config.entity])return B`
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">Entity not found: ${this._config.entity}</div>
        </ha-card>
      `;const t=this._getFeedItems(),e=this._config.max_items??t.length,i=t.slice(0,e);return 0===i.length?B`
        <ha-card .header=${this._config.title}>
          <div class="card-content"><i>No entries available.</i></div>
        </ha-card>
      `:B`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${i.map(t=>{const e=t.summary||t.description||"",i=this._config.strip_summary_images?e.replace(/<img[^>]*>/g,""):e,s=new Date(t.published),n=s.toLocaleString(this.hass.language,this._getDateTimeFormatOptions()),o=this._config.new_pill_duration_hours??1,r=((new Date).getTime()-s.getTime())/6e4,a=r>=0&&r<60*o,c={aspectRatio:this._config.image_ratio};return B`
              <details class="accordion-item">
                <summary class="accordion-header" @click=${this._onSummaryClick}>
                  <div class="header-main">
                    <a class="title-link" href="${t.link}" target="_blank" rel="noopener noreferrer">
                      ${t.title}
                    </a>
                    ${a?B`<span class="new-pill"
                          >${bt(this.hass,"component.rss-accordion.card.new_pill")}</span
                        >`:""}
                  </div>
                </summary>
                <div class="accordion-content">
                  <div class="item-published">${n}</div>
                  ${t.image?B`<img
                        class="item-image"
                        src="${t.image}"
                        alt="${t.title}"
                        style=${$t(c)}
                      />`:""}
                  <div class="item-summary" .innerHTML=${i}></div>
                  <a class="item-link" href="${t.link}" target="_blank" rel="noopener noreferrer">
                    ${bt(this.hass,"component.rss-accordion.card.to_news_article")}
                  </a>
                </div>
              </details>
            `})}
        </div>
      </ha-card>
    `}static{this.styles=a`
    ${r(At)}
  `}};t([pt({attribute:!1})],xt.prototype,"hass",void 0),t([ut()],xt.prototype,"_config",void 0),xt=t([lt(wt)],xt),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.push({type:wt,name:"RSS Accordion",description:"A card to display RSS feed items in an accordion style."}));const St=(t,e,i,s)=>{const n=new CustomEvent(e,{bubbles:!0,cancelable:!1,composed:!0,...s,detail:i});t.dispatchEvent(n)},Ct=a`.card-config{display:flex;flex-direction:column;gap:16px}`;let kt=class extends at{setConfig(t){this._config=t}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(!e.configValue)return;const i=e.configValue,s={...this._config},n="HA-SWITCH"===e.tagName?e.checked:e.value;""===n||!1===n||void 0===n?delete s[i]:s[i]="number"===e.type?Number(n):n,St(this,"config-changed",{config:s})}_entityChanged(t){if(!this._config||!this.hass)return;const e={...this._config,entity:t.detail.value};St(this,"config-changed",{config:e})}render(){return this.hass&&this._config?B`
      <ha-card>
        <div class="card-content card-config">
          <ha-textfield
            .label=${bt(this.hass,"component.rss-accordion.editor.title")}
            .value=${this._config.title||""}
            .configValue=${"title"}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-entity-picker
            .hass=${this.hass}
            .label=${bt(this.hass,"component.rss-accordion.editor.entity")}
            .value=${this._config.entity||""}
            .includeDomains=${["sensor","event"]}
            @value-changed=${this._entityChanged}
            allow-custom-entity
            required
          ></ha-entity-picker>
          <ha-textfield
            .label=${bt(this.hass,"component.rss-accordion.editor.max_items")}
            type="number"
            min="1"
            .value=${this._config.max_items||""}
            .configValue=${"max_items"}
            @input=${this._valueChanged}
            .placeholder=${bt(this.hass,"component.rss-accordion.editor.max_items_placeholder")}
          ></ha-textfield>
          <ha-textfield
            .label=${bt(this.hass,"component.rss-accordion.editor.new_pill_duration_hours")}
            type="number"
            min="1"
            .value=${this._config.new_pill_duration_hours||""}
            .configValue=${"new_pill_duration_hours"}
            @input=${this._valueChanged}
            .placeholder="1"
          ></ha-textfield>
          <ha-textfield
            .label=${bt(this.hass,"component.rss-accordion.editor.image_ratio")}
            .value=${this._config.image_ratio||""}
            .configValue=${"image_ratio"}
            @input=${this._valueChanged}
            .placeholder=${"auto"}
            .pattern=${"^auto$|^\\d+(\\.\\d+)?$|^\\d+(\\.\\d+)?\\s*\\/\\s*\\d+(\\.\\d+)?$"}
            .validationMessage=${bt(this.hass,"component.rss-accordion.editor.image_ratio_validation_message")}
          ></ha-textfield>
          <ha-formfield .label=${bt(this.hass,"component.rss-accordion.editor.initial_open")}>
            <ha-switch
              .checked=${!0===this._config.initial_open}
              .configValue=${"initial_open"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${bt(this.hass,"component.rss-accordion.editor.allow_multiple")}>
            <ha-switch
              .checked=${!0===this._config.allow_multiple}
              .configValue=${"allow_multiple"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${bt(this.hass,"component.rss-accordion.editor.strip_summary_images")}>
            <ha-switch
              .checked=${!0===this._config.strip_summary_images}
              .configValue=${"strip_summary_images"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>
      </ha-card>
    `:B``}static{this.styles=a`
    ${r(Ct)}
  `}};t([pt({attribute:!1})],kt.prototype,"hass",void 0),t([ut()],kt.prototype,"_config",void 0),kt=t([lt("rss-accordion-editor")],kt);var Pt=Object.freeze({__proto__:null,get RssAccordionEditor(){return kt}});export{xt as RssAccordion};
