function e(e,t,i,o){var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r}console.groupCollapsed("%c🗞️ RSS ACCORDION%cv0.11.0","color: orange; font-weight: bold; background: black; padding: 2px 4px; border-radius: 2px 0 0 2px;","color: white; font-weight: bold; background: dimgray; padding: 2px 4px; border-radius: 0 2px 2px 0;"),console.info("A custom Lovelace card for Home Assistant to display RSS feed items in an accordion style."),console.info("Github:  https://github.com/timmaurice/lovelace-rss-accordion.git"),console.info("Sponsor: https://buymeacoffee.com/timmaurice"),console.groupEnd(),"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}};const r=e=>new s("string"==typeof e?e:e+"",void 0,o),a=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new s(i,e,o)},l=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return r(t)})(e):e,{is:c,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:u,getOwnPropertySymbols:_,getPrototypeOf:p}=Object,m=globalThis,g=m.trustedTypes,f=g?g.emptyScript:"",v=m.reactiveElementPolyfillSupport,y=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!c(e,t),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&d(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:n}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const s=o?.call(this);n?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...u(e),..._(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(i)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of o){const o=document.createElement("style"),n=t.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=o;const s=n.fromAttribute(t,e.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(e,t,i,o=!1,n){if(void 0!==e){const s=this.constructor;if(!1===o&&(n=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??$)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==n||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[y("elementProperties")]=new Map,k[y("finalized")]=new Map,v?.({ReactiveElement:k}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,A=e=>e,S=x.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+T,O=`<${P}>`,M=document,I=()=>M.createComment(""),L=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,z="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,R=/>/g,D=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,j=/"/g,K=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),V=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,J=M.createTreeWalker(M,129);function Z(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}class G{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let n=0,s=0;const r=e.length-1,a=this.parts,[l,c]=((e,t)=>{const i=e.length-1,o=[];let n,s=2===t?"<svg>":3===t?"<math>":"",r=U;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===U?"!--"===l[1]?r=H:void 0!==l[1]?r=R:void 0!==l[2]?(K.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=D):void 0!==l[3]&&(r=D):r===D?">"===l[0]?(r=n??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?D:'"'===l[3]?j:B):r===j||r===B?r=D:r===H||r===R?r=U:(r=D,n=void 0);const h=r===D&&e[t+1].startsWith("/>")?" ":"";s+=r===U?i+O:c>=0?(o.push(a),i.slice(0,c)+C+i.slice(c)+T+h):i+T+(-2===c?t:h)}return[Z(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]})(e,t);if(this.el=G.createElement(l,i),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=J.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(C)){const t=c[s++],i=o.getAttribute(e).split(T),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?te:"?"===r[1]?ie:"@"===r[1]?oe:ee}),o.removeAttribute(e)}else e.startsWith(T)&&(a.push({type:6,index:n}),o.removeAttribute(e));if(K.test(o.tagName)){const e=o.textContent.split(T),t=e.length-1;if(t>0){o.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],I()),J.nextNode(),a.push({type:2,index:++n});o.append(e[t],I())}}}else if(8===o.nodeType)if(o.data===P)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=o.data.indexOf(T,e+1));)a.push({type:7,index:n}),e+=T.length-1}n++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,o){if(t===V)return t;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const s=L(t)?void 0:t._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(e),n._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(t=Y(e,n._$AS(e,t.values),n,o)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??M).importNode(t,!0);J.currentNode=o;let n=J.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let t;2===a.type?t=new X(n,n.nextSibling,this,e):1===a.type?t=new a.ctor(n,a.name,a.strings,this,e):6===a.type&&(t=new ne(n,this,e)),this._$AV.push(t),a=i[++r]}s!==a?.index&&(n=J.nextNode(),s++)}return J.currentNode=M,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),L(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&L(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=G.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new Q(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new G(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const n of e)o===t.length?t.push(i=new X(this.O(I()),this.O(I()),this,this.options)):i=t[o],i._$AI(n),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,n){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(e,t=this,i,o){const n=this.strings;let s=!1;if(void 0===n)e=Y(this,e,t,0),s=!L(e)||e!==this._$AH&&e!==V,s&&(this._$AH=e);else{const o=e;let r,a;for(e=n[0],r=0;r<n.length-1;r++)a=Y(this,o[i+r],t,r),a===V&&(a=this._$AH[r]),s||=!L(a)||a!==this._$AH[r],a===q?e=q:e!==q&&(e+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class oe extends ee{constructor(e,t,i,o,n){super(e,t,i,o,n),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??q)===V)return;const i=this._$AH,o=e===q&&i!==q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==q&&(i===q||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const se={I:X},re=x.litHtmlPolyfillSupport;re?.(G,X),(x.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let le=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let n=o._$litPart$;if(void 0===n){const e=i?.renderBefore??null;o._$litPart$=n=new X(t.insertBefore(I(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};le._$litElement$=!0,le.finalized=!0,ae.litElementHydrateSupport?.({LitElement:le});const ce=ae.litElementPolyfillSupport;ce?.({LitElement:le}),(ae.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:$},he=(e=de,t,i)=>{const{kind:o,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,n,e,!0,i)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];t.call(this,i),this.requestUpdate(o,n,e,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ue(e){return(t,i)=>"object"==typeof i?he(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _e(e){return ue({...e,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pe=1,me=2,ge=e=>(...t)=>({_$litDirective$:e,values:t});let fe=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ve="important",ye=" !"+ve,be=ge(class extends fe{constructor(e){if(super(e),e.type!==pe||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const o=e[i];return null==o?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const o=t[e];if(null!=o){this.ft.add(e);const t="string"==typeof o&&o.endsWith(ye);e.includes("-")||t?i.setProperty(e,t?o.slice(0,-11):o,t?ve:""):i[e]=o}}return V}}),{I:$e}=se,we=e=>e,ke=()=>document.createComment(""),xe=(e,t,i)=>{const o=e._$AA.parentNode,n=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=o.insertBefore(ke(),n),s=o.insertBefore(ke(),n);i=new $e(t,s,e,e.options)}else{const t=i._$AB.nextSibling,s=i._$AM,r=s!==e;if(r){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==s._$AU&&i._$AP(t)}if(t!==n||r){let e=i._$AA;for(;e!==t;){const t=we(e).nextSibling;we(o).insertBefore(e,n),e=t}}}return i},Ae=(e,t,i=e)=>(e._$AI(t,i),e),Se={},Ee=(e,t=Se)=>e._$AH=t,Ce=e=>{e._$AR(),e._$AA.remove()},Te=(e,t,i)=>{const o=new Map;for(let n=t;n<=i;n++)o.set(e[n],n);return o},Pe=ge(class extends fe{constructor(e){if(super(e),e.type!==me)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let o;void 0===i?i=t:void 0!==t&&(o=t);const n=[],s=[];let r=0;for(const t of e)n[r]=o?o(t,r):r,s[r]=i(t,r),r++;return{values:s,keys:n}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,o]){const n=(e=>e._$AH)(e),{values:s,keys:r}=this.dt(t,i,o);if(!Array.isArray(n))return this.ut=r,s;const a=this.ut??=[],l=[];let c,d,h=0,u=n.length-1,_=0,p=s.length-1;for(;h<=u&&_<=p;)if(null===n[h])h++;else if(null===n[u])u--;else if(a[h]===r[_])l[_]=Ae(n[h],s[_]),h++,_++;else if(a[u]===r[p])l[p]=Ae(n[u],s[p]),u--,p--;else if(a[h]===r[p])l[p]=Ae(n[h],s[p]),xe(e,l[p+1],n[h]),h++,p--;else if(a[u]===r[_])l[_]=Ae(n[u],s[_]),xe(e,n[h],n[u]),u--,_++;else if(void 0===c&&(c=Te(r,_,p),d=Te(a,h,u)),c.has(a[h]))if(c.has(a[u])){const t=d.get(r[_]),i=void 0!==t?n[t]:null;if(null===i){const t=xe(e,n[h]);Ae(t,s[_]),l[_]=t}else l[_]=Ae(i,s[_]),xe(e,n[h],i),n[t]=null;_++}else Ce(n[u]),u--;else Ce(n[h]),h++;for(;_<=p;){const t=xe(e,l[p+1]);Ae(t,s[_]),l[_++]=t}for(;h<=u;){const e=n[h++];null!==e&&Ce(e)}return this.ut=r,Ee(e,l),V}});
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oe={de:{editor:{groups:{core:"Grundeinstellungen",feed:"Feed-Einträge & Verhalten",item_images:"Bilder der Einträge",channel:"Kanalinformationen"},title:"Titel (Optional)",entity:"Feed-Entität",allow_multiple:"Erlaube das Öffnen mehrerer Einträge",open_behavior:"Standard-Öffnungsverhalten",open_behavior_options:{none:"Alle geschlossen",latest:"Neuesten Eintrag öffnen",all:"Alle Einträge öffnen"},max_items:"Maximale Einträge (Gesamt)",max_items_placeholder:"Alle Einträge",max_items_per_entity:"Maximale Einträge (Pro Feed)",max_items_per_entity_placeholder:"Alle Einträge",new_pill_duration_hours:"Dauer für 'NEU'-Anzeige (Stunden)",refresh_interval:"Aktualisierungsintervall (Minuten)",refresh_interval_placeholder:"30",image_ratio:"Bild-Seitenverhältnis (z.B. 16/9 oder 1.77)",image_ratio_validation_message:"Ungültiges Format. Beispiel: 'auto', '16/9' oder '1.77'.",image_fit_mode:"Bild-Anpassung",image_fit_mode_options:{cover:"Ausfüllen (Cover)",contain:"Einfassen (Contain)"},show_channel_info:"Kanal-Infos anzeigen (vom 'channel'-Attribut)",show_channel_published_date:"Letzte Aktualisierung des Kanals anzeigen",crop_channel_image:"Kanalbild als zugeschnittenen Kreis anzeigen",show_channel_description:"Kanalbeschreibung anzeigen",max_channel_description_length:"Maximale Länge der Kanalbeschreibung",show_audio_player:"Audio-Player anzeigen",audio_target:"Abspielen auf (optional, sonst in diesem Browser)",show_item_image:"Bilder der Einträge anzeigen",show_bookmarks:"Lesezeichen für Einträge aktivieren",use_multiple_entities:"Mehrere Entitäten verwenden",show_source:"Feed-Quelle anzeigen",add_entity:"Entität hinzufügen",remove_entity:"Entität entfernen"},card:{to_news_article:"Zum Nachrichtenartikel",new_pill:"NEU",untitled:"Eintrag ohne Titel",visit_channel:"Kanal besuchen",last_updated:"Zuletzt aktualisiert",listened:"Angehört",listened_on:"Angehört am: {date}",entity_not_found:"Entität nicht gefunden: {entity}",no_entries:"Keine Einträge im Feed verfügbar.",entity_unavailable:"Entität nicht verfügbar: {entity}",entity_no_feed:"Entität enthält keine Feed-Einträge: {entity}",no_bookmarked_entries:"Sie haben keine Lesezeichen.",channel_image_alt:"Kanalbild",add_bookmark:"Lesezeichen hinzufügen",remove_bookmark:"Lesezeichen entfernen",show_bookmarked:"Lesezeichen anzeigen",no_bookmarks_yet_tooltip:"Markieren Sie einen Eintrag als Lesezeichen, um diesen Filter zu aktivieren",source:"Quelle",show_more:"Mehr anzeigen",show_less:"Weniger anzeigen",play:"Abspielen",pause:"Pause",rewind:"15 Sekunden zurück",forward:"30 Sekunden vor",seek:"Wiedergabeposition",audio_target_unavailable:"Lautsprecher nicht verfügbar: {entity}"}},en:{editor:{groups:{core:"Core Configuration",feed:"Feed Items & Behavior",item_images:"Item Images",channel:"Channel Information"},title:"Title (Optional)",entity:"Feed Entity",allow_multiple:"Allow multiple items to be open",open_behavior:"Default Open Behavior",open_behavior_options:{none:"Keep all closed",latest:"Open latest item",all:"Open all items"},max_items:"Maximum Items (Overall)",max_items_placeholder:"All items",max_items_per_entity:"Maximum Items (Per Feed)",max_items_per_entity_placeholder:"All items",new_pill_duration_hours:"Duration for 'NEW' pill (hours)",refresh_interval:"Refresh Interval (minutes)",refresh_interval_placeholder:"30",image_ratio:"Image aspect ratio (e.g. 16/9 or 1.77)",image_ratio_validation_message:"Invalid format. Use 'auto', '16/9', or '1.77'.",image_fit_mode:"Image Fit Mode",image_fit_mode_options:{cover:"Cover (fill & crop)",contain:"Contain (fit inside)"},show_channel_info:"Show Channel Info (from 'channel' attribute)",show_channel_published_date:"Show channel's last update time",crop_channel_image:"Display channel image as a cropped circle",show_channel_description:"Show channel description",max_channel_description_length:"Maximum channel description length",show_audio_player:"Show Audio Player",audio_target:"Play on (optional, otherwise in this browser)",show_item_image:"Show Item Images",show_bookmarks:"Enable bookmarking for items",use_multiple_entities:"Use multiple entities",show_source:"Show item source",add_entity:"Add Entity",remove_entity:"Remove Entity"},card:{to_news_article:"To the news article",new_pill:"NEW",untitled:"Untitled entry",visit_channel:"Visit channel",last_updated:"Last updated",listened:"Listened",listened_on:"Listened on: {date}",entity_not_found:"Entity not found: {entity}",no_entries:"No entries available in feed.",entity_unavailable:"Entity unavailable: {entity}",entity_no_feed:"Entity has no feed entries: {entity}",no_bookmarked_entries:"You have no bookmarked items.",channel_image_alt:"Channel Image",add_bookmark:"Bookmark item",remove_bookmark:"Remove bookmark",show_bookmarked:"Show Bookmarked",no_bookmarks_yet_tooltip:"Bookmark an item to enable this filter",source:"Source",show_more:"Show more",show_less:"Show less",play:"Play",pause:"Pause",rewind:"Back 15 seconds",forward:"Forward 30 seconds",seek:"Playback position",audio_target_unavailable:"Speaker unavailable: {entity}"}},fr:{editor:{groups:{core:"Configuration de base",feed:"Éléments du flux et comportement",item_images:"Images des éléments",channel:"Informations sur le canal"},title:"Titre (Optionnel)",entity:"Entité du flux",allow_multiple:"Autoriser l'ouverture de plusieurs éléments",open_behavior:"Comportement d'ouverture par défaut",open_behavior_options:{none:"Tous fermés",latest:"Ouvrir le dernier élément",all:"Tout ouvrir"},max_items:"Nombre maximum d'éléments (Global)",max_items_placeholder:"Tous les éléments",max_items_per_entity:"Nombre maximum d'éléments (Par flux)",max_items_per_entity_placeholder:"Tous les éléments",new_pill_duration_hours:"Durée d'affichage de la pastille 'NOUVEAU' (heures)",refresh_interval:"Intervalle d'actualisation (minutes)",refresh_interval_placeholder:"30",image_ratio:"Ratio d'aspect de l'image (ex: 16/9 ou 1.77)",image_ratio_validation_message:"Format invalide. Utilisez 'auto', '16/9', ou '1.77'.",image_fit_mode:"Mode d'ajustement de l'image",image_fit_mode_options:{cover:"Couvrir (remplir et rogner)",contain:"Contenir (ajuster à l'intérieur)"},show_channel_info:"Afficher les informations du canal (de l'attribut 'channel')",show_channel_published_date:"Afficher la dernière heure de mise à jour du canal",crop_channel_image:"Afficher l'image du canal sous forme de cercle rogné",show_channel_description:"Afficher la description du canal",max_channel_description_length:"Longueur maximale de la description du canal",show_audio_player:"Afficher le lecteur audio",audio_target:"Lire sur (facultatif, sinon dans ce navigateur)",show_item_image:"Afficher les images des éléments",show_bookmarks:"Activer les favoris pour les éléments",use_multiple_entities:"Utiliser plusieurs entités",show_source:"Afficher la source",add_entity:"Ajouter une entité",remove_entity:"Supprimer l'entité"},card:{to_news_article:"Vers l'article",new_pill:"NOUVEAU",untitled:"Entrée sans titre",visit_channel:"Visiter le canal",last_updated:"Dernière mise à jour",listened:"Écouté",listened_on:"Écouté le : {date}",entity_not_found:"Entité non trouvée : {entity}",no_entries:"Aucun élément disponible dans le flux.",entity_unavailable:"Entité indisponible : {entity}",entity_no_feed:"L'entité ne contient aucune entrée de flux : {entity}",no_bookmarked_entries:"Vous n'avez aucun favori.",channel_image_alt:"Image du canal",add_bookmark:"Ajouter aux favoris",remove_bookmark:"Retirer des favoris",show_bookmarked:"Afficher les favoris",no_bookmarks_yet_tooltip:"Ajoutez un élément aux favoris pour activer ce filtre",source:"Source",show_more:"Voir plus",show_less:"Voir moins",play:"Lire",pause:"Pause",rewind:"Reculer de 15 secondes",forward:"Avancer de 30 secondes",seek:"Position de lecture",audio_target_unavailable:"Enceinte indisponible : {entity}"}}};function Me(e,t){let i=Oe[e];for(const e of t){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function Ie(e,t,i={}){const o=e.language||"en",n=t.replace("component.rss-accordion.","").split("."),s=Me(o,n)??Me("en",n);if("string"==typeof s){let e=s;for(const t in i)e=e.replace(`{${t}}`,String(i[t]));return e}return t}const Le=new Set(["a","abbr","b","blockquote","br","caption","code","dd","div","dl","dt","em","figcaption","figure","h1","h2","h3","h4","h5","h6","hr","i","img","li","ol","p","pre","q","s","small","span","strong","sub","sup","table","tbody","td","tfoot","th","thead","tr","u","ul"]),Ne=new Set(["applet","audio","base","button","canvas","embed","form","frame","frameset","iframe","input","link","math","meta","noscript","object","option","script","select","slot","style","svg","template","textarea","title","video"]),ze={"*":new Set(["title","dir","lang"]),a:new Set(["href"]),img:new Set(["src","alt","width","height"]),td:new Set(["colspan","rowspan"]),th:new Set(["colspan","rowspan","scope"]),ol:new Set(["start"])},Ue=new Set(["href","src"]),He=new Set(["http:","https:","mailto:","tel:"]),Re=/^data:image\/(?:png|jpe?g|gif|webp|avif|bmp);base64,[a-z0-9+/=\s]+$/i;function De(e,t=!1){if(!e)return!1;const i=e.trim();if(!i)return!1;if(t&&Re.test(i))return!0;try{const e=new URL(i,document.baseURI);return He.has(e.protocol)}catch{return!1}}function Be(e){const t=e.tagName.toLowerCase(),i=ze[t],o=ze["*"];for(const n of[...e.attributes]){const s=n.name.toLowerCase();i?.has(s)||o.has(s)?Ue.has(s)&&!De(n.value,"img"===t)&&e.removeAttribute(n.name):e.removeAttribute(n.name)}"a"===t&&e.hasAttribute("href")&&(e.setAttribute("target","_blank"),e.setAttribute("rel","noopener noreferrer")),"img"!==t||e.hasAttribute("src")||e.remove()}function je(e){for(const t of[...e.childNodes]){if(t.nodeType===Node.TEXT_NODE)continue;if(t.nodeType!==Node.ELEMENT_NODE){t.parentNode?.removeChild(t);continue}const e=t,i=e.tagName.toLowerCase();Ne.has(i)?e.remove():(je(e),Le.has(i)?Be(e):e.replaceWith(...e.childNodes))}}function Ke(e){if(!e)return"";const t=(new DOMParser).parseFromString(String(e),"text/html");return je(t.body),t.body.innerHTML}const Fe=(e,t,i,o)=>{const n=new CustomEvent(t,{bubbles:!0,cancelable:!1,composed:!0,...o,detail:i});e.dispatchEvent(n)};function Ve(e,t){const i=new Date(e);if(isNaN(i.getTime()))return"";const o={year:"numeric",month:"short",day:"2-digit",hour:"numeric",minute:"2-digit"};return t.locale&&("12"===t.locale.time_format?o.hour12=!0:"24"===t.locale.time_format&&(o.hour12=!1)),i.toLocaleString(t.language,o)}function qe(e){const t=Number.isFinite(e)&&e>0?Math.floor(e):0,i=Math.floor(t/3600),o=Math.floor(t%3600/60),n=String(t%60).padStart(2,"0");return i>0?`${i}:${String(o).padStart(2,"0")}:${n}`:`${o}:${n}`}class We{constructor(e){this.audioStoragePrefix=`rss-accordion-progress-${e}-`,this.bookmarkStoragePrefix=`rss-accordion-bookmark-${e}-`}getAudioProgress(e){try{const t=localStorage.getItem(`${this.audioStoragePrefix}${e}`);return t?JSON.parse(t):null}catch(e){return console.error("Error reading audio progress from localStorage",e),null}}setAudioProgress(e,t){try{localStorage.setItem(`${this.audioStoragePrefix}${e}`,JSON.stringify(t))}catch(e){console.error("Error saving audio progress to localStorage",e)}}getBookmarkKey(e){return`${e.link}|${e.published}`}isBookmarked(e){const t=this.getBookmarkKey(e);return null!==localStorage.getItem(`${this.bookmarkStoragePrefix}${t}`)}setBookmark(e,t){const i=this.getBookmarkKey(e);t?localStorage.setItem(`${this.bookmarkStoragePrefix}${i}`,JSON.stringify(e)):localStorage.removeItem(`${this.bookmarkStoragePrefix}${i}`)}getBookmarkedItems(){const e=[];for(let t=0;t<localStorage.length;t++){const i=localStorage.key(t);if(i?.startsWith(this.bookmarkStoragePrefix))try{const t=JSON.parse(localStorage.getItem(i));e.push(t)}catch(e){console.error(`Error parsing bookmarked item from localStorage for key: ${i}`,e)}}return e}}class Je extends EventTarget{constructor(e=new Audio){super(),this._audio=e,this._audio.preload="metadata";const t=()=>{this.dispatchEvent(new Event("change"))};for(const e of["play","pause","durationchange","seeked","emptied"])this._audio.addEventListener(e,t);this._audio.addEventListener("loadedmetadata",()=>{this._restoreProgress(),t()}),this._audio.addEventListener("timeupdate",()=>{this._saveProgress(),t()}),this._audio.addEventListener("ended",()=>{this._markCompleted(),t()})}get state(){const e=this._audio.duration;return{url:this._track?.url,playing:!!this._track&&!this._audio.paused&&!this._audio.ended,position:this._audio.currentTime||0,duration:Number.isFinite(e)?e:0}}async play(e){this._track?.url!==e.url?(this._track=e,this._lastSave=void 0,this._audio.src=e.url):this._track=e,this._updateMediaSession();try{await this._audio.play()}catch(e){console.warn("rss-accordion: playback failed",e)}}pause(){this._audio.pause()}seek(e){if(!this._track)return;const t=this.state.duration;this._audio.currentTime=Math.max(0,t?Math.min(e,t):e),this._lastSave=void 0,this._saveProgress()}_restoreProgress(){if(!this._track)return;const e=this._track.storage.getAudioProgress(this._track.url);e&&!e.completed&&e.currentTime>0&&(this._audio.currentTime=e.currentTime)}_saveProgress(){if(!this._track)return;const e=Date.now();if(void 0!==this._lastSave&&e-this._lastSave<=5e3)return;if(0===this._audio.currentTime)return;const{storage:t,url:i}=this._track,o=t.getAudioProgress(i)||{currentTime:0,completed:!1};o.completed||(t.setAudioProgress(i,{...o,currentTime:this._audio.currentTime,duration:this.state.duration||o.duration}),this._lastSave=e)}_markCompleted(){if(!this._track)return;const{storage:e,url:t}=this._track,i=e.getAudioProgress(t)||{currentTime:0,completed:!1};e.setAudioProgress(t,{...i,currentTime:0,completed:!0,completedAt:(new Date).toISOString()})}_updateMediaSession(){if(!this._track||"undefined"==typeof navigator||!("mediaSession"in navigator))return;const e=navigator.mediaSession;"undefined"!=typeof MediaMetadata&&(e.metadata=new MediaMetadata({title:this._track.title,artist:this._track.artist??"",artwork:this._track.artwork?[{src:this._track.artwork}]:[]}));const t=[["play",()=>{this._audio.play()}],["pause",()=>this.pause()],["seekbackward",e=>this.seek(this.state.position-(e.seekOffset??15))],["seekforward",e=>this.seek(this.state.position+(e.seekOffset??30))],["seekto",e=>void 0!==e.seekTime&&this.seek(e.seekTime)]];for(const[i,o]of t)try{e.setActionHandler(i,o)}catch{}}}const Ze=Symbol.for("rss-accordion.audio-player");function Ge(){const e=window;return e[Ze]??=new Je}function Ye(e,t=Date.now()){if(!e)return{playing:!1,position:0,duration:0};const i=e.attributes,o="playing"===e.state,n=Number(i.media_duration)||0;let s=Number(i.media_position)||0;const r=Date.parse(i.media_position_updated_at);return o&&Number.isFinite(r)&&(s+=Math.max(0,(t-r)/1e3)),n&&(s=Math.min(s,n)),{url:i.media_content_id,playing:o,position:s,duration:n}}const Qe=a`﻿:host{display:flex;flex-direction:column;height:100%}ha-card{display:flex;flex:1;flex-direction:column;height:100%}.card-content{flex:1;min-height:0;overflow-y:auto;padding:16px}.warning{color:var(--error-color);padding:16px}.channel-info{align-items:center;border-bottom:1px solid var(--divider-color);display:flex;gap:16px;margin-bottom:8px;padding-bottom:16px}.channel-info .channel-image{border-radius:0;height:auto;object-fit:contain;width:calc(25% - 8px)}.channel-info .channel-text{display:flex;flex-direction:column;flex-grow:1;justify-content:center;min-width:0}.channel-info .channel-title{color:var(--primary-text-color);font-size:1.2em;font-weight:bold;margin:0 0 4px 0}.channel-info .channel-description-container{display:flex;flex-direction:column;gap:4px;margin:0 0 8px 0;position:relative;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1)}.channel-info .channel-description-container .channel-description{color:var(--secondary-text-color);font-size:.9em;line-height:1.5;margin:0;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1)}.channel-info .channel-description-container .toggle-description{align-items:center;align-self:flex-start;background:none;border:none;color:var(--primary-color);cursor:pointer;display:flex;font-size:.85em;font-weight:bold;gap:4px;padding:4px 0;transition:all .2s ease}.channel-info .channel-description-container .toggle-description::after{content:"▸";display:inline-block;font-size:.8em;transform:rotate(90deg);transition:transform .3s ease}.channel-info .channel-description-container .toggle-description:hover{opacity:.8}.channel-info .channel-description-container .toggle-description:active{transform:scale(0.98)}.channel-info .channel-description-container:not(.expanded) .channel-description{overflow:hidden}.channel-info .channel-description-container.expanded .channel-description{color:var(--primary-text-color)}.channel-info .channel-description-container.expanded .toggle-description::after{transform:rotate(-90deg)}.channel-info .channel-published{color:var(--secondary-text-color);font-size:.85em;margin:-4px 0 8px 0}.channel-info .channel-published .label{font-weight:bold;margin-right:4px}.channel-info .channel-actions{align-items:center;container-type:inline-size;display:flex;gap:8px;justify-content:space-between;margin-top:8px}.channel-info .channel-link{color:var(--primary-color);flex-shrink:0;font-weight:bold;text-decoration:none}.channel-info .channel-link:hover{text-decoration:underline}.channel-info.cropped-image{align-items:center;flex-direction:row}.channel-info.cropped-image .channel-image{border-radius:50%;flex-shrink:0;height:60px;margin-bottom:0;object-fit:cover;width:60px}.accordion-header{cursor:pointer;font-weight:bold;list-style:none;padding:12px 0;padding-left:20px;position:relative}.accordion-header::-webkit-details-marker{display:none}.accordion-header::before{content:"▸";left:0;position:absolute;top:50%;transform:translateY(-50%);transition:transform .2s ease-in-out}.accordion-header .header-main{align-items:center;display:grid;gap:8px;grid-template-columns:1fr auto;width:100%}.accordion-header .header-main .header-badges{align-items:center;display:flex;gap:8px}.accordion-header .header-main .title-link{color:var(--primary-text-color);cursor:default;overflow-wrap:break-word;pointer-events:none;text-decoration:none;white-space:normal}.accordion-header .header-main .title-link:visited{color:var(--secondary-text-color)}.accordion-header .header-main .new-pill{background-color:var(--primary-color);border-radius:10px;color:var(--text-primary-color);font-size:.7em;font-weight:bold;padding:2px 8px}.accordion-header .header-main .bookmark-button{--mdc-icon-button-size: 24px;color:var(--accent-color);cursor:pointer}.accordion-content{color:var(--secondary-text-color);font-size:.9em;max-height:0;overflow:hidden;padding:0 0 0 20px;transition:max-height .3s ease-in-out,padding-bottom .3s ease-in-out}.accordion-content .item-published{color:var(--secondary-text-color);font-size:1em;margin-bottom:1em}.accordion-content .item-source{color:var(--secondary-text-color);font-size:.9em;font-weight:500;margin-bottom:8px}.accordion-content .item-image{border-radius:var(--ha-card-border-radius, 4px);display:block;height:auto;margin-bottom:1em;max-width:100%}.accordion-content .item-link{color:var(--primary-color);display:inline-block;font-weight:bold;margin-top:8px;text-decoration:none}.accordion-content .item-link:hover{text-decoration:underline}.accordion-item{border-bottom:1px solid var(--divider-color)}.accordion-item:last-of-type{border-bottom:none}.accordion-item[open]>.accordion-header::before{transform:translateY(-50%) rotate(90deg)}.accordion-item[open]>.accordion-content{padding-bottom:12px}.accordion-item.loading>.accordion-header .header-main .new-pill{display:none}.accordion-item.loading>.accordion-header .header-main::after{animation:spin 1s linear infinite;border:2px solid var(--primary-color);border-radius:50%;border-top-color:rgba(0,0,0,0);content:"";display:inline-block;flex-shrink:0;height:16px;margin-left:8px;width:16px}@keyframes spin{to{transform:rotate(360deg)}}.audio-player-container{margin-bottom:1em}.audio-player{align-items:center;background:var(--secondary-background-color);border-radius:28px;display:flex;gap:4px;padding:6px 8px 6px 6px}.audio-button{align-items:center;background:none;border:none;border-radius:50%;color:var(--primary-text-color);cursor:pointer;display:inline-flex;flex:none;height:36px;justify-content:center;padding:0;width:36px}.audio-button:hover:not(:disabled){background:rgba(127,127,127,.15)}.audio-button:disabled{color:var(--disabled-text-color);cursor:default}.audio-button.audio-play{background:var(--primary-color);color:var(--text-primary-color, #fff)}.audio-button.audio-play:hover:not(:disabled){background:var(--primary-color);filter:brightness(1.1)}.audio-button.audio-play:disabled{background:var(--disabled-text-color)}.audio-track{display:flex;flex:1 1 auto;flex-direction:column;gap:2px;min-width:0;padding:0 4px}.audio-seek{accent-color:var(--primary-color);margin:0;width:100%}.audio-time{color:var(--secondary-text-color);display:flex;font-size:.8em;font-variant-numeric:tabular-nums;justify-content:space-between;line-height:1.2}.audio-target{align-items:center;color:var(--secondary-text-color);display:flex;font-size:.85em;gap:4px;margin-top:4px}.audio-target ha-icon{--mdc-icon-size: 16px}.audio-target.unavailable{color:var(--error-color)}.listened-icon{color:var(--primary-color);vertical-align:middle}.bookmark-filter-button{--mdc-button-outline-color: var(--divider-color);--mdc-theme-primary: var(--primary-text-color);--ha-font-size-m: 12px;--icon-color: var(--primary-text-color);--mdc-typography-button-font-size: 0.8rem}.bookmark-filter-button ha-icon{--mdc-icon-size: 12px;margin-right:.5em;transform:translate(0, -1px)}.bookmark-filter-button.active{--mdc-theme-primary: var(--text-primary-color);--button-color-fill-loud-hover: var(--accent-color);--wa-color-fill-loud: var(--accent-color);--icon-color: var(--text-primary-color);--mdc-button-outline-color: var(--accent-color)}.bookmark-filter-button[disabled]{--mdc-button-outline-color: var(--disabled-text-color);color:var(--disabled-text-color);cursor:not-allowed}@container (max-width: 245px){.bookmark-filter-button ha-icon{--mdc-icon-size: 14px;margin-right:0;transform:none}.bookmark-filter-button .button-text{display:none}}img.image-failed{display:none}`,Xe="rss-accordion",et=`${Xe}-editor`;function tt(e,t){if(t.startsWith("event."))return!0;const i=e?.[t]?.attributes;return Array.isArray(i?.entries||i?.events||i?.items)}class it extends le{constructor(){super(...arguments),this._showOnlyBookmarks=!1,this._isDescriptionExpanded=!1,this._entities=[],this._renderedAudioUrls=new Set,this._targetSeenMidway=new Set,this._openKeys=new Set,this._seenKeys=new Set,this._onPlayerChange=()=>{if(this._config?.audio_target)return;const e=Ge().state.url,t=this._lastPlayerUrl;this._lastPlayerUrl=e,(e&&this._renderedAudioUrls.has(e)||t&&this._renderedAudioUrls.has(t))&&this.requestUpdate()}}setConfig(e){if(!e||!e.entity&&(!e.entities||0===e.entities.length))throw new Error("You need to define an entity or a list of entities");this._config=e,e.entities&&e.entities.length>0?this._entities=[...e.entities]:e.entity?this._entities=[e.entity]:this._entities=[];const t=this._entities.slice().sort().join(",");this._storageHelper=new We(t),this._startRefreshTimer()}static async getConfigElement(){const e=window.loadCardHelpers;if(!e)throw new Error("This card requires Home Assistant 2026.4+ and `loadCardHelpers` is not available.");const t=await e(),i=await t.createCardElement({type:"entities",entities:[]});return await i.constructor.getConfigElement(),await Promise.resolve().then(function(){return rt}),document.createElement(et)}static getStubConfig(e,t){return{entity:(t?.length?t:Object.keys(e?.states??{})).find(t=>tt(e?.states,t))??"sensor.your_rss_feed_sensor",max_items:5}}getCardSize(){if(!this.hass||0===this._entities.length)return 1;const e=this._getAllDisplayableItems().length,t=this._config.max_items??e,i=Math.min(e,t);let o=(this._config.title?1:0)+(i||1);const n=this._entities.length>0?this.hass.states[this._entities[0]]:void 0,s=n?.attributes.channel;return this._shouldRenderChannelInfo(s)&&(o+=2),o}getGridOptions(){return{columns:"full",min_columns:6,rows:"auto",min_rows:1}}getLayoutOptions(){return{grid_rows:3,grid_columns:12,grid_min_rows:1,grid_min_columns:6}}connectedCallback(){super.connectedCallback(),this._resizeObserver||(this._resizeObserver=new ResizeObserver(()=>this._handleResize())),this._resizeObserver.observe(this),this._startRefreshTimer(),Ge().addEventListener("change",this._onPlayerChange)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver&&this._resizeObserver.disconnect(),this._stopRefreshTimer(),this._stopTargetTicker(),Ge().removeEventListener("change",this._onPlayerChange)}_startRefreshTimer(){this._stopRefreshTimer(),this._config&&this._config.refresh_interval&&this._config.refresh_interval>0&&(this._refreshTimer=window.setInterval(()=>{this._refreshEntities()},60*this._config.refresh_interval*1e3))}_stopRefreshTimer(){this._refreshTimer&&(clearInterval(this._refreshTimer),this._refreshTimer=void 0)}async _refreshEntities(){if(this.hass&&this._entities&&0!==this._entities.length)try{await Promise.all(this._entities.map(e=>this.hass.callService("homeassistant","update_entity",{entity_id:e})))}catch(e){console.error("Failed to refresh RSS feed entities:",e)}}_handleResize(){this.shadowRoot?.querySelectorAll(".accordion-item[open]").forEach(e=>{this._measureOpenPanel(e,!1)})}async _measureOpenPanel(e,t){const i=e.querySelector(".accordion-content");if(!i)return;const o=Array.from(i.querySelectorAll("img")).filter(e=>!e.complete);o.length>0&&(e.classList.add("loading"),await Promise.all(o.map(e=>new Promise(t=>{e.addEventListener("load",t,{once:!0}),e.addEventListener("error",t,{once:!0})}))),e.classList.remove("loading"));const n=e.dataset.key;(void 0===n||this._openKeys.has(n))&&(t||(i.style.transition="none"),requestAnimationFrame(()=>{i.style.maxHeight=`${i.scrollHeight}px`,t||requestAnimationFrame(()=>i.style.removeProperty("transition"))}))}shouldUpdate(e){if(e.has("_config"))return!0;const t=e.get("hass");if(t){let e=!1;for(const i of this._entities)if(t.states[i]!==this.hass.states[i]){e=!0;break}const i=this._config.audio_target;return i&&t.states[i]!==this.hass.states[i]&&(e=!0),!(!e&&t.language===this.hass.language)}return!0}_openBehavior(){return this._config?.open_behavior||(this._config?.initial_open?"latest":"none")}updated(e){if(super.updated(e),!this._config)return;this._syncTarget();const t="all"===this._openBehavior();this._pruneKeys(),this._enforceSingleOpen(),this.shadowRoot?.querySelectorAll(".accordion-item").forEach(e=>{const i=e.dataset.key;if(void 0===i)return;const o=!this._seenKeys.has(i);if(this._seenKeys.add(i),t&&o)return void this._openAccordion(e);const n=e.querySelector(".accordion-content");n&&(this._openKeys.has(i)?(e.setAttribute("open",""),this._measureOpenPanel(e,!1)):e.open&&!e.classList.contains("closing")&&(e.removeAttribute("open"),n.style.maxHeight="0px"))})}_pruneKeys(){const e=this._getAllDisplayableItems();if(0===e.length)return;const t=new Set(e.map(e=>this._storageHelper.getBookmarkKey(e)));for(const e of[this._openKeys,this._seenKeys])for(const i of e)t.has(i)||e.delete(i)}_enforceSingleOpen(){if(this._config.allow_multiple||"all"===this._openBehavior()||this._openKeys.size<=1)return;const e=[...this._openKeys];this._openKeys=new Set([e[e.length-1]])}firstUpdated(){"latest"===this._openBehavior()&&setTimeout(()=>{const e=this.shadowRoot?.querySelector(".accordion-item");e&&!e.open&&this._openAccordion(e)},0)}async _onSummaryClick(e){const t=e.target;if(t.closest&&t.closest("a.title-link"))return;e.preventDefault();const i=e.currentTarget.closest(".accordion-item");i&&(i.open?this._closeAccordion(i):await this._openAccordion(i))}_closeAccordion(e){e.classList.remove("loading");const t=e.dataset.key;t&&this._openKeys.delete(t);const i=e.querySelector(".accordion-content");if(!i)return;i.style.maxHeight="0px",e.classList.add("closing");const o=()=>{e.classList.remove("closing"),e.removeAttribute("open"),i.removeEventListener("transitionend",o)};i.addEventListener("transitionend",o)}async _openAccordion(e){if(!e.querySelector(".accordion-content"))return;const t=this._config.open_behavior||(this._config.initial_open?"latest":"none");this._config.allow_multiple||"all"===t||this.shadowRoot?.querySelectorAll(".accordion-item[open]").forEach(t=>{t!==e&&this._closeAccordion(t)}),e.classList.remove("closing"),e.setAttribute("open","");const i=e.dataset.key;i&&(this._openKeys.delete(i),this._openKeys.add(i)),await this._measureOpenPanel(e,!0)}_targetStateObj(){const e=this._config?.audio_target;return e?this.hass?.states[e]:void 0}_playbackFor(e){const t=this._config.audio_target,i=this._targetStateObj(),o=t?Ye(i):Ge().state,n=!t||function(e){return!!e&&"unavailable"!==e.state&&"unknown"!==e.state}(i);if(o.url===e)return{...o,active:!0,available:n,canSeek:n&&(!t||this._targetCanSeek())};const s=this._storageHelper.getAudioProgress(e);return{url:e,playing:!1,position:s&&!s.completed?s.currentTime:0,duration:s?.duration??0,active:!1,available:n,canSeek:!1}}_togglePlay(e,t){this._playbackFor(t).playing?this._pauseEpisode():this._playEpisode(e,t)}_playEpisode(e,t){const i=this._getItemImage(e),o={url:t,title:e.title?.trim()||Ie(this.hass,"component.rss-accordion.card.untitled"),artist:this._getItemSourceName(e)||void 0,artwork:De(i,!0)?i:void 0,storage:this._storageHelper};if(!this._config.audio_target)return void Ge().play(o);const n=this._targetStateObj();if(Ye(n).url===t&&"paused"===n?.state)return void this._callTarget("media_play");const s=this._storageHelper.getAudioProgress(t);this._pendingTargetSeek=s&&!s.completed&&s.currentTime>0?{url:t,position:s.currentTime,until:Date.now()+3e4}:void 0,this._lastTargetSave=void 0,this._targetStartedAt={url:t,at:Date.now()},this._targetSeenMidway.delete(t),this._callTarget("play_media",{media_content_id:t,media_content_type:"music",extra:{title:o.title,...o.artwork?{thumb:o.artwork}:{}}})}_pauseEpisode(){this._config.audio_target?this._callTarget("media_pause"):Ge().pause()}_seekEpisode(e,t){const i=this._playbackFor(e);if(!i.active||!i.canSeek)return;const o=Math.max(0,i.duration?Math.min(t,i.duration):t);this._config.audio_target?this._seekTarget(o,!0):Ge().seek(o)}_skipEpisode(e,t){this._seekEpisode(e,this._playbackFor(e).position+t)}_onSeekInput(e,t){this._scrub={url:t,value:Number(e.target.value)}}_onSeekChange(e,t){this._scrub=void 0,this._seekEpisode(t,Number(e.target.value))}_callTarget(e,t={},i=!0){const o=this._config.audio_target;return o&&this.hass?this.hass.callService("media_player",e,{entity_id:o,...t},void 0,i).then(()=>!0).catch(t=>(console.error(`rss-accordion: media_player.${e} on ${o} failed`,t),!1)):Promise.resolve(!1)}_targetCanSeek(){const e=this._config.audio_target;return!!e&&this._seekFailedOn!==e&&(t=this._targetStateObj(),!!(2&(Number(t?.attributes.supported_features)||0)));var t}_seekTarget(e,t){const i=this._config.audio_target;this._callTarget("media_seek",{seek_position:e},t).then(e=>{!e&&i&&(this._seekFailedOn=i,this.requestUpdate())})}_syncTarget(){const e=Ye(this._targetStateObj()),t=this._pendingTargetSeek;t&&Date.now()>t.until?this._pendingTargetSeek=void 0:t&&e.url===t.url&&e.playing&&(this._pendingTargetSeek=void 0,this._targetCanSeek()&&e.position<t.position-2&&(this._seekTarget(t.position,!1),this._lastTargetSave=Date.now()));const i=!!e.url&&this._renderedAudioUrls.has(e.url);this._config.audio_target&&i&&e.playing&&this.isConnected?this._startTargetTicker():this._stopTargetTicker()}_startTargetTicker(){void 0===this._targetTicker&&(this._targetTicker=window.setInterval(()=>{this._saveTargetProgress(),this.requestUpdate()},1e3))}_stopTargetTicker(){void 0!==this._targetTicker&&(clearInterval(this._targetTicker),this._targetTicker=void 0)}_saveTargetProgress(){const e=this._targetStateObj(),t=Ye(e),i=t.url;if(!i||!t.playing||!this._renderedAudioUrls.has(i))return;const o=Date.parse(e?.attributes.media_position_updated_at),n=this._targetStartedAt;if(n?.url===i&&!(o>=n.at))return;if(t.duration&&Number(e?.attributes.media_position)>t.duration+1)return;const s=!!t.duration&&t.position>=t.duration-10;if(s||this._targetSeenMidway.add(i),this._pendingTargetSeek?.url===i)return;const r=Date.now();if(void 0!==this._lastTargetSave&&r-this._lastTargetSave<=5e3)return;this._lastTargetSave=r;const a=this._storageHelper.getAudioProgress(i)||{currentTime:0,completed:!1};a.completed||(s&&this._targetSeenMidway.has(i)?this._storageHelper.setAudioProgress(i,{...a,currentTime:0,completed:!0,completedAt:(new Date).toISOString(),duration:t.duration}):!s&&t.position>0&&this._storageHelper.setAudioProgress(i,{...a,currentTime:t.position,duration:t.duration||a.duration}))}_renderAudioControls(e,t){const i=(e,t)=>Ie(this.hass,`component.rss-accordion.card.${e}`,t),o=this._playbackFor(t),n=this._scrub?.url===t?this._scrub.value:o.position,s=this._config.audio_target,r=this._targetStateObj(),a=r?.attributes.friendly_name||s;return F`
      <div class="audio-player ${o.active?"active":""}">
        <button
          class="audio-button audio-play"
          ?disabled=${!o.available}
          aria-label=${o.playing?i("pause"):i("play")}
          title=${o.playing?i("pause"):i("play")}
          @click=${()=>this._togglePlay(e,t)}
        >
          <ha-icon icon=${o.playing?"mdi:pause":"mdi:play"}></ha-icon>
        </button>
        <button
          class="audio-button audio-rewind"
          ?disabled=${!o.canSeek}
          aria-label=${i("rewind")}
          title=${i("rewind")}
          @click=${()=>this._skipEpisode(t,-15)}
        >
          <ha-icon icon="mdi:rewind-15"></ha-icon>
        </button>
        <div class="audio-track">
          <input
            class="audio-seek"
            type="range"
            min="0"
            max=${Math.floor(o.duration)||0}
            step="1"
            .value=${String(Math.floor(n))}
            ?disabled=${!o.canSeek||!o.duration}
            aria-label=${i("seek")}
            @input=${e=>this._onSeekInput(e,t)}
            @change=${e=>this._onSeekChange(e,t)}
          />
          <div class="audio-time">
            <span class="audio-position">${qe(n)}</span>
            <span class="audio-duration">${o.duration?qe(o.duration):"--:--"}</span>
          </div>
        </div>
        <button
          class="audio-button audio-forward"
          ?disabled=${!o.canSeek}
          aria-label=${i("forward")}
          title=${i("forward")}
          @click=${()=>this._skipEpisode(t,30)}
        >
          <ha-icon icon="mdi:fast-forward-30"></ha-icon>
        </button>
      </div>
      ${s?F`<div class="audio-target ${o.available?"":"unavailable"}">
              <ha-icon icon=${o.available?"mdi:speaker":"mdi:speaker-off"}></ha-icon>
              <span> ${o.available?a:i("audio_target_unavailable",{entity:s})} </span>
            </div>`:""}
    `}_toggleBookmark(e,t){e.stopPropagation(),e.preventDefault();const i=this._storageHelper.isBookmarked(t);this._storageHelper.setBookmark(t,!i),this.requestUpdate()}_getAllDisplayableItems(){const e=new Map;if(this._config.show_bookmarks){const t=this._storageHelper.getBookmarkedItems();for(const i of t)e.set(this._storageHelper.getBookmarkKey(i),i)}const t=this._getFeedItems();for(const i of t)e.set(this._storageHelper.getBookmarkKey(i),i);const i=Array.from(e.values());return i.sort((e,t)=>{const i=e.published||e.updated||"",o=t.published||t.updated||"";return new Date(o).getTime()-new Date(i).getTime()}),i}_getFeedItems(){const e=[];for(const t of this._entities){const i=this.hass.states[t];if(!i)continue;const o=i.attributes.entries||i.attributes.events||i.attributes.items;if(o&&Array.isArray(o)){let i=[...o||[]];i.sort((e,t)=>{const i=e.published||e.updated||"",o=t.published||t.updated||"";return new Date(o).getTime()-new Date(i).getTime()}),this._config.max_items_per_entity&&(i=i.slice(0,this._config.max_items_per_entity));const n=i.map(e=>({...e,source_entity_id:t}));e.push(...n)}else if(t.startsWith("event.")){const{title:o,link:n,summary:s,description:r,image:a}=i.attributes;"string"==typeof o&&"string"==typeof n&&e.push({title:o,link:n,summary:s??void 0,description:r??void 0,image:a??void 0,published:i.state,source_entity_id:t})}}return e}_getEntityName(e){const t=this.hass.states[e];return t?.attributes.friendly_name||e}_getItemSourceName(e){const t=e.source_entity_id?this._getEntityName(e.source_entity_id):"";let i="";return e.source&&"string"==typeof e.source?i=e.source:e.category&&("string"==typeof e.category&&(i=e.category),Array.isArray(e.category)&&(i=e.category.join(", "))),this._entities.length>1?i?`${t} (${i})`:t:i||t}_getItemImage(e){return e.image}_shouldRenderChannelInfo(e){return!(!this._config.show_channel_info||!e)&&!!(e.title||!1!==this._config.show_channel_description&&(e.description||e.subtitle)||e.image||e.link||this._config.show_published_date&&(e.published||e.updated))}_renderChannelActions(e,t){return F`
      <div class="channel-actions">
        ${e&&De(e)?F`<a class="channel-link" href="${e}" target="_blank" rel="noopener noreferrer"
                >${Ie(this.hass,"component.rss-accordion.card.visit_channel")}</a
              >`:""}
        ${this._renderBookmarkFilter(t)}
      </div>
    `}_renderChannelInfo(e,t){if(!e)return F``;const i=e.title,o=e.link,n=e.description||e.subtitle,s=e.image,r=De(s,!0)?s:void 0,a=void 0!==r&&this._failedChannelImage===r,l=e.published||e.updated,c=l?Ve(l,this.hass):void 0;return F`
      <div class="channel-info ${this._config.crop_channel_image&&!a?"cropped-image":""}">
        ${r?F`<img
                class="channel-image"
                src="${r}"
                alt="${i||Ie(this.hass,"component.rss-accordion.card.channel_image_alt")}"
                @error=${this._onChannelImageError}
                @load=${this._onChannelImageLoad}
              />`:""}
        <div class="channel-text">
          ${i?F`<h2 class="channel-title">${i}</h2>`:""}
          ${this._config.show_published_date&&c?F`<p class="channel-published">
                  <span class="label">${Ie(this.hass,"component.rss-accordion.card.last_updated")}:</span>
                  ${c}
                </p>`:""}
          ${!1!==this._config.show_channel_description&&n?F`<div
                  class="channel-description-container ${this._isDescriptionExpanded?"expanded":""}"
                  style="${this._isDescriptionExpanded?"max-height: 1000px":""}"
                >
                  <p class="channel-description">
                    ${this._isDescriptionExpanded?n:(d=n,h=this._config.max_channel_description_length??180,d.length<=h?d:d.substring(0,h).trim()+"...")}
                  </p>
                  ${n.length>(this._config.max_channel_description_length??180)?F`<button class="toggle-description" @click=${this._toggleDescription}>
                          ${Ie(this.hass,this._isDescriptionExpanded?"component.rss-accordion.card.show_less":"component.rss-accordion.card.show_more")}
                        </button>`:""}
                </div>`:""}
          ${this._renderChannelActions(o,t)}
        </div>
      </div>
    `;var d,h}_onImageError(e){e.target.classList.add("image-failed")}_onImageLoad(e){e.target.classList.remove("image-failed")}_onChannelImageError(e){const t=e.target;t.classList.add("image-failed"),this._failedChannelImage=t.getAttribute("src")??void 0}_onChannelImageLoad(e){e.target.classList.remove("image-failed"),this._failedChannelImage=void 0}_toggleDescription(){this._isDescriptionExpanded=!this._isDescriptionExpanded}_renderItem(e){const t=this._getItemImage(e),i=e.summary||e.description||"",o=!1!==this._config.show_item_image&&De(t,!0),n=o?i.replace(/<img[^>]*>/gi,""):i,s=e.published||e.updated||"",r=new Date(s),a=Ve(r,this.hass),l=this._config.new_pill_duration_hours??1,c=((new Date).getTime()-r.getTime())/6e4,d=c>=0&&c<60*l,h=this._storageHelper.isBookmarked(e),u=e.audio;u&&!1!==this._config.show_audio_player&&this._renderedAudioUrls.add(u);const _=u?this._storageHelper.getAudioProgress(u):null,p=_?.completed??!1;let m=Ie(this.hass,"component.rss-accordion.card.listened");if(p&&_?.completedAt){const e=Ve(_.completedAt,this.hass);e&&(m=Ie(this.hass,"component.rss-accordion.card.listened_on",{date:e}))}const g={aspectRatio:this._config.image_ratio,objectFit:this._config.image_fit_mode||"cover"},f=e.title?.trim()||Ie(this.hass,"component.rss-accordion.card.untitled");return F`
      <details class="accordion-item" data-key=${this._storageHelper.getBookmarkKey(e)}>
        <summary class="accordion-header" @click=${this._onSummaryClick}>
          <div class="header-main">
            ${De(e.link)?F`<a class="title-link" href="${e.link}" target="_blank" rel="noopener noreferrer">
                    ${f}
                  </a>`:F`<span class="title-link">${f}</span>`}
            <div class="header-badges">
              ${this._config.show_bookmarks?F`<span
                      class="bookmark-button"
                      role="button"
                      tabindex="0"
                      title="${Ie(this.hass,h?"component.rss-accordion.card.remove_bookmark":"component.rss-accordion.card.add_bookmark")}"
                      @click=${t=>this._toggleBookmark(t,e)}
                      ><ha-icon icon=${h?"mdi:star":"mdi:star-outline"}></ha-icon
                    ></span>`:""}
              ${d?F`<span class="new-pill">${Ie(this.hass,"component.rss-accordion.card.new_pill")}</span>`:""}
              ${u&&p?F`<ha-icon
                      class="listened-icon"
                      icon="mdi:check-circle-outline"
                      title="${m}"
                    ></ha-icon>`:""}
            </div>
          </div>
        </summary>
        <div class="accordion-content">
          ${(void 0!==this._config.show_source?this._config.show_source:this._entities.length>1)&&(e.source_entity_id||e.category||e.source)?F`<div class="item-source">
                  ${Ie(this.hass,"component.rss-accordion.card.source")}: ${this._getItemSourceName(e)}
                </div>`:""}
          ${a?F`<div class="item-published">${a}</div>`:""}
          ${o?F`<img
                  class="item-image"
                  src="${t}"
                  alt="${f}"
                  style=${be(g)}
                  @error=${this._onImageError}
                  @load=${this._onImageLoad}
                />`:""}
          ${!1!==this._config.show_audio_player&&e.audio?F`
                  <div class="audio-player-container">${this._renderAudioControls(e,u)}</div>
                `:""}
          <div class="item-summary" .innerHTML=${Ke(n)}></div>
          ${De(e.link)?F`<a class="item-link" href="${e.link}" target="_blank" rel="noopener noreferrer">
                  ${Ie(this.hass,"component.rss-accordion.card.to_news_article")}
                </a>`:""}
        </div>
      </details>
    `}render(){if(this._renderedAudioUrls.clear(),!this._config||!this.hass)return F``;if(0===this._entities.length)return F`
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">
            ${Ie(this.hass,"component.rss-accordion.card.entity_not_found",{entity:"No entity configured"})}
          </div>
        </ha-card>
      `;if(!this._entities.some(e=>this.hass.states[e]))return F`
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">
            ${Ie(this.hass,"component.rss-accordion.card.entity_not_found",{entity:this._entities.join(", ")})}
          </div>
        </ha-card>
      `;const e=this.hass.states[this._entities[0]],t=e?.attributes.channel;let i=this._getAllDisplayableItems();const o=!(!this._config.show_bookmarks||!i.some(e=>this._storageHelper.isBookmarked(e))),n=this._shouldRenderChannelInfo(t);this._config.show_bookmarks&&this._showOnlyBookmarks&&(i=i.filter(e=>this._storageHelper.isBookmarked(e)));const s=this._config.max_items??i.length,r=i.slice(0,s);return 0===r.length?this._showOnlyBookmarks?F`
          <ha-card .header=${this._config.title}>
            <div class="card-content">
              ${n?this._renderChannelInfo(t,o):this._renderChannelActions(void 0,o)}
              <i>${Ie(this.hass,"component.rss-accordion.card.no_bookmarked_entries")}</i>
            </div>
          </ha-card>
        `:F`<ha-card .header=${this._config.title}>${this._renderEmptyState()}</ha-card>`:F`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${n?this._renderChannelInfo(t,o):this._renderChannelActions(void 0,o)}
          ${Pe(r,e=>this._storageHelper.getBookmarkKey(e),e=>this._renderItem(e))}
        </div>
      </ha-card>
    `}_hasFeedAttribute(e){return tt(this.hass.states,e)}_renderEmptyState(){const e=this._entities.filter(e=>this.hass.states[e]),t=e.filter(e=>["unavailable","unknown"].includes(this.hass.states[e].state));if(t.length===e.length)return F`<div class="card-content warning">
        ${Ie(this.hass,"component.rss-accordion.card.entity_unavailable",{entity:t.join(", ")})}
      </div>`;const i=e.filter(e=>!this._hasFeedAttribute(e));return i.length===e.length?F`<div class="card-content warning">
        ${Ie(this.hass,"component.rss-accordion.card.entity_no_feed",{entity:i.join(", ")})}
      </div>`:F`<div class="card-content">
      <i>${Ie(this.hass,"component.rss-accordion.card.no_entries")}</i>
    </div>`}_buttonSize(){const e=this.hass?.config?.version,t=/^(\d+)\.(\d+)/.exec(e??"");if(!t)return"s";const[i,o]=[Number(t[1]),Number(t[2])];return i>2026||2026===i&&o>=7?"s":"small"}_renderBookmarkFilter(e){return this._config.show_bookmarks?F`
      <ha-button
        outlined
        class="bookmark-filter-button ${this._showOnlyBookmarks?"active":""}"
        ?disabled=${!e}
        size=${this._buttonSize()}
        title="${Ie(this.hass,e?"component.rss-accordion.card.show_bookmarked":"component.rss-accordion.card.no_bookmarks_yet_tooltip")}"
        @click=${()=>{e&&(this._showOnlyBookmarks=!this._showOnlyBookmarks)}}
      >
        <ha-icon icon="mdi:star"></ha-icon>
        <span class="button-text">${Ie(this.hass,"component.rss-accordion.card.show_bookmarked")}</span>
      </ha-button>
    `:F``}static{this.styles=[a`
      ${r(Qe)}
    `]}}e([ue({attribute:!1})],it.prototype,"hass",void 0),e([_e()],it.prototype,"_config",void 0),e([_e()],it.prototype,"_showOnlyBookmarks",void 0),e([_e()],it.prototype,"_isDescriptionExpanded",void 0),e([_e()],it.prototype,"_failedChannelImage",void 0),e([_e()],it.prototype,"_entities",void 0),e([_e()],it.prototype,"_scrub",void 0),customElements.get(Xe)||customElements.define(Xe,it),"undefined"!=typeof window&&(window.customCards=window.customCards||[],window.customCards.some(e=>e.type===Xe)||window.customCards.push({type:Xe,name:"RSS Accordion",description:"A card to display RSS feed items in an accordion style.",documentationURL:"https://github.com/timmaurice/lovelace-rss-accordion"}));const ot=a`.card-config{display:flex;flex-direction:column;gap:16px}.group{border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius, 4px);display:flex;flex-direction:column;gap:8px;padding:16px}.group-header{color:var(--primary-text-color);font-size:1.1em;font-weight:bold;margin-bottom:8px}.row{align-items:flex-start;display:flex;flex-direction:row;gap:16px}.row>*{flex:1 1 50%;min-width:0}ha-formfield{padding-bottom:8px}.entities-list{display:flex;flex-direction:column;gap:8px}.entity-row{align-items:flex-end;display:flex;flex-direction:row;gap:8px}.entity-row ha-entity-picker{flex:1}.entity-row ha-icon-button{flex-shrink:0;margin-bottom:4px}.dropdown-wrapper{width:100%}.dropdown-wrapper ha-dropdown{width:100%}.dropdown-trigger{width:100%}.dropdown-textfield{width:100%}`,nt="rss-accordion-editor";class st extends le{setConfig(e){this._config=e}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;if(!t.configValue)return;const i=t.configValue,o={...this._config};let n="HA-SWITCH"===t.tagName?t.checked:t.value;if("image_fit_mode"===i&&"cover"===n&&(n=void 0),"show_item_image"===i)n?delete o.show_item_image:(o.show_item_image=!1,delete o.image_ratio,delete o.image_fit_mode);else if("show_audio_player"===i)n?delete o.show_audio_player:(o.show_audio_player=!1,delete o.audio_target);else if("show_channel_description"===i)n?delete o.show_channel_description:(o.show_channel_description=!1,delete o.max_channel_description_length);else if("open_behavior"===i)"none"===n?delete o.open_behavior:o.open_behavior=n,delete o.initial_open;else if("show_source"===i){n===this._getEntities().length>1?delete o.show_source:o.show_source=n}else""===n||!1===n||void 0===n?(delete o[i],"show_channel_info"===i&&(delete o.show_published_date,delete o.crop_channel_image,delete o.show_channel_description,delete o.max_channel_description_length)):o[i]="number"===t.type?Number(n):n;"image_ratio"===i&&(o.image_ratio&&"auto"!==o.image_ratio||delete o.image_fit_mode),Fe(this,"config-changed",{config:o})}_getEntities(){return this._config.entities&&this._config.entities.length>0?this._config.entities:this._config.entity?[this._config.entity]:[]}_isMultiEntityMode(){return!!(this._config.entities&&this._config.entities.length>0)}_toggleMultiEntityMode(e){if(!this._config||!this.hass)return;const t=e.target.checked,i=this._getEntities(),o={...this._config};t?(o.entities=i.length>0?i:[""],delete o.entity,delete o.show_channel_info,delete o.crop_channel_image,delete o.show_published_date,delete o.show_channel_description,delete o.max_channel_description_length):(o.entity=i[0]||"",delete o.entities),Fe(this,"config-changed",{config:o})}_singleEntityChanged(e){if(!this._config||!this.hass)return;const t=e.detail.value,i={...this._config,entity:t},o=t?this.hass.states[t]:void 0,n=o?.attributes.channel;n?(n.published||delete i.show_published_date,n.image||delete i.crop_channel_image,n.description||n.subtitle||(delete i.show_channel_description,delete i.max_channel_description_length)):(delete i.show_channel_info,delete i.crop_channel_image,delete i.show_published_date,delete i.show_channel_description,delete i.max_channel_description_length);const s=o?.attributes.entries??[];!!o?.attributes.audio||s.some(e=>!!e.audio)||(delete i.show_audio_player,delete i.audio_target),Fe(this,"config-changed",{config:i})}_entityChanged(e,t){if(!this._config||!this.hass)return;const i=t.detail.value,o=[...this._getEntities()];o[e]=i;const n={...this._config,entities:o};delete n.entity,delete n.show_channel_info,delete n.crop_channel_image,delete n.show_published_date,delete n.show_channel_description,delete n.max_channel_description_length;let s=!1;for(const e of o){const t=this.hass.states[e],i=t?.attributes.entries??[];if(t?.attributes.audio||i.some(e=>!!e.audio)){s=!0;break}}s||(delete n.show_audio_player,delete n.audio_target),Fe(this,"config-changed",{config:n})}_audioTargetChanged(e){if(!this._config||!this.hass)return;const t=e.detail.value;if((t||void 0)===this._config.audio_target)return;const i={...this._config};t?i.audio_target=t:delete i.audio_target,Fe(this,"config-changed",{config:i})}_addEntity(){const e=[...this._getEntities(),""],t={...this._config,entities:e};delete t.entity,Fe(this,"config-changed",{config:t})}_removeEntity(e){const t=[...this._getEntities()];t.splice(e,1);const i={...this._config,entities:t};delete i.entity,Fe(this,"config-changed",{config:i})}render(){if(!this.hass||!this._config)return F``;const e=this._getEntities(),t=e[0],i=t?this.hass.states[t]:void 0,o=i?.attributes.channel,n=o?.image,s=o?.published;let r=!1;for(const t of e){const e=this.hass.states[t],i=e?.attributes.entries??[];if(e?.attributes.audio||i.some(e=>!!e.audio)){r=!0;break}}const a=this._config.open_behavior||(this._config.initial_open?"latest":"none"),l=Ie(this.hass,"all"===a?"component.rss-accordion.editor.open_behavior_options.all":"latest"===a?"component.rss-accordion.editor.open_behavior_options.latest":"component.rss-accordion.editor.open_behavior_options.none"),c=this._config.image_fit_mode||"cover",d=Ie(this.hass,"contain"===c?"component.rss-accordion.editor.image_fit_mode_options.contain":"component.rss-accordion.editor.image_fit_mode_options.cover");return F`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${Ie(this.hass,"component.rss-accordion.editor.groups.core")}</div>
            <ha-input
              .label=${Ie(this.hass,"component.rss-accordion.editor.title")}
              .value=${this._config.title||""}
              .configValue=${"title"}
              @input=${this._valueChanged}
            ></ha-input>
            <ha-formfield .label=${Ie(this.hass,"component.rss-accordion.editor.use_multiple_entities")}>
              <ha-switch .checked=${this._isMultiEntityMode()} @change=${this._toggleMultiEntityMode}></ha-switch>
            </ha-formfield>
            ${this._isMultiEntityMode()?F`
                    <div class="entities-list">
                      ${this._getEntities().map((e,t)=>F`
                          <div class="entity-row">
                            <ha-entity-picker
                              .hass=${this.hass}
                              .label=${Ie(this.hass,"component.rss-accordion.editor.entity")}
                              .value=${e}
                              .includeDomains=${["sensor","event"]}
                              @value-changed=${e=>this._entityChanged(t,e)}
                              allow-custom-entity
                              required
                            ></ha-entity-picker>
                            <ha-icon-button
                              .label=${Ie(this.hass,"component.rss-accordion.editor.remove_entity")}
                              .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                              @click=${()=>this._removeEntity(t)}
                            ></ha-icon-button>
                          </div>
                        `)}
                      <ha-button @click=${this._addEntity}>
                        ${Ie(this.hass,"component.rss-accordion.editor.add_entity")}
                      </ha-button>
                    </div>
                  `:F`
                    <ha-entity-picker
                      .hass=${this.hass}
                      .label=${Ie(this.hass,"component.rss-accordion.editor.entity")}
                      .value=${this._config.entity||""}
                      .includeDomains=${["sensor","event"]}
                      @value-changed=${this._singleEntityChanged}
                      allow-custom-entity
                      required
                    ></ha-entity-picker>
                  `}
          </div>

          <div class="group">
            <div class="group-header">${Ie(this.hass,"component.rss-accordion.editor.groups.feed")}</div>
            <div class="row">
              <ha-input
                .label=${Ie(this.hass,"component.rss-accordion.editor.max_items")}
                type="number"
                min="1"
                .value=${this._config.max_items||""}
                .configValue=${"max_items"}
                @input=${this._valueChanged}
                .placeholder=${Ie(this.hass,"component.rss-accordion.editor.max_items_placeholder")}
              ></ha-input>
              <ha-input
                .label=${Ie(this.hass,"component.rss-accordion.editor.max_items_per_entity")}
                type="number"
                min="1"
                .value=${this._config.max_items_per_entity||""}
                .configValue=${"max_items_per_entity"}
                @input=${this._valueChanged}
                .placeholder=${Ie(this.hass,"component.rss-accordion.editor.max_items_per_entity_placeholder")}
              ></ha-input>
            </div>
            <div class="row">
              <ha-input
                .label=${Ie(this.hass,"component.rss-accordion.editor.new_pill_duration_hours")}
                type="number"
                min="1"
                .value=${this._config.new_pill_duration_hours||""}
                .configValue=${"new_pill_duration_hours"}
                @input=${this._valueChanged}
                .placeholder="1"
              ></ha-input>
              <ha-input
                .label=${Ie(this.hass,"component.rss-accordion.editor.refresh_interval")}
                type="number"
                min="0"
                .value=${this._config.refresh_interval||""}
                .configValue=${"refresh_interval"}
                @input=${this._valueChanged}
                .placeholder=${Ie(this.hass,"component.rss-accordion.editor.refresh_interval_placeholder")}
              ></ha-input>
            </div>
            <div class="dropdown-wrapper">
              <ha-dropdown
                @wa-select=${e=>{const t={configValue:"open_behavior",value:e.detail.item.value};this._valueChanged({target:t})}}
                @closed=${e=>e.stopPropagation()}
                fixedMenuPosition
                naturalMenuWidth
              >
                <div slot="trigger" class="dropdown-trigger">
                  <ha-input
                    readonly
                    .label=${Ie(this.hass,"component.rss-accordion.editor.open_behavior")}
                    .value=${l}
                    class="dropdown-textfield"
                  >
                    <ha-icon slot="end" icon="mdi:menu-down"></ha-icon>
                  </ha-input>
                </div>
                <ha-dropdown-item value="none"
                  >${Ie(this.hass,"component.rss-accordion.editor.open_behavior_options.none")}</ha-dropdown-item
                >
                <ha-dropdown-item value="latest"
                  >${Ie(this.hass,"component.rss-accordion.editor.open_behavior_options.latest")}</ha-dropdown-item
                >
                <ha-dropdown-item value="all"
                  >${Ie(this.hass,"component.rss-accordion.editor.open_behavior_options.all")}</ha-dropdown-item
                >
              </ha-dropdown>
            </div>
            <ha-formfield .label=${Ie(this.hass,"component.rss-accordion.editor.allow_multiple")}>
              <ha-switch
                .checked=${!!this._config.allow_multiple}
                .configValue=${"allow_multiple"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            ${r?F`
                    <ha-formfield .label=${Ie(this.hass,"component.rss-accordion.editor.show_audio_player")}>
                      <ha-switch
                        .checked=${!1!==this._config.show_audio_player}
                        .configValue=${"show_audio_player"}
                        @change=${this._valueChanged}
                      ></ha-switch>
                    </ha-formfield>
                    ${!1!==this._config.show_audio_player?F`<ha-entity-picker
                            .hass=${this.hass}
                            .label=${Ie(this.hass,"component.rss-accordion.editor.audio_target")}
                            .value=${this._config.audio_target||""}
                            .includeDomains=${["media_player"]}
                            @value-changed=${this._audioTargetChanged}
                          ></ha-entity-picker>`:""}
                  `:""}
            <ha-formfield .label=${Ie(this.hass,"component.rss-accordion.editor.show_bookmarks")}>
              <ha-switch
                .checked=${!!this._config.show_bookmarks}
                .configValue=${"show_bookmarks"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield .label=${Ie(this.hass,"component.rss-accordion.editor.show_source")}>
              <ha-switch
                .checked=${void 0!==this._config.show_source?this._config.show_source:this._getEntities().length>1}
                .configValue=${"show_source"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield .label=${Ie(this.hass,"component.rss-accordion.editor.show_item_image")}>
              <ha-switch
                .checked=${!1!==this._config.show_item_image}
                .configValue=${"show_item_image"}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${!1!==this._config.show_item_image?F`
                  <div class="group">
                    <div class="group-header">
                      ${Ie(this.hass,"component.rss-accordion.editor.groups.item_images")}
                    </div>
                    <div class="row">
                      <ha-input
                        .label=${Ie(this.hass,"component.rss-accordion.editor.image_ratio")}
                        .value=${this._config.image_ratio||""}
                        .configValue=${"image_ratio"}
                        @input=${this._valueChanged}
                        .placeholder=${"auto"}
                        .pattern=${"^auto$|^\\d+(\\.\\d+)?$|^\\d+(\\.\\d+)?\\s*\\/\\s*\\d+(\\.\\d+)?$"}
                        .validationMessage=${Ie(this.hass,"component.rss-accordion.editor.image_ratio_validation_message")}
                      ></ha-input>
                      ${this._config.image_ratio&&"auto"!==this._config.image_ratio?F`
                              <div class="dropdown-wrapper">
                                <ha-dropdown
                                  @wa-select=${e=>{const t={configValue:"image_fit_mode",value:e.detail.item.value};this._valueChanged({target:t})}}
                                  @closed=${e=>e.stopPropagation()}
                                  fixedMenuPosition
                                  naturalMenuWidth
                                >
                                  <div slot="trigger" class="dropdown-trigger">
                                    <ha-input
                                      readonly
                                      .label=${Ie(this.hass,"component.rss-accordion.editor.image_fit_mode")}
                                      .value=${d}
                                      class="dropdown-textfield"
                                    >
                                      <ha-icon slot="end" icon="mdi:menu-down"></ha-icon>
                                    </ha-input>
                                  </div>
                                  <ha-dropdown-item value="cover"
                                    >${Ie(this.hass,"component.rss-accordion.editor.image_fit_mode_options.cover")}</ha-dropdown-item
                                  >
                                  <ha-dropdown-item value="contain"
                                    >${Ie(this.hass,"component.rss-accordion.editor.image_fit_mode_options.contain")}</ha-dropdown-item
                                  >
                                </ha-dropdown>
                              </div>
                            `:""}
                    </div>
                  </div>
                `:""}
          ${o&&!this._isMultiEntityMode()?F`
                  <div class="group">
                    <div class="group-header">
                      ${Ie(this.hass,"component.rss-accordion.editor.groups.channel")}
                    </div>
                    <ha-formfield .label=${Ie(this.hass,"component.rss-accordion.editor.show_channel_info")}>
                      <ha-switch
                        .checked=${!!this._config.show_channel_info}
                        .configValue=${"show_channel_info"}
                        @change=${this._valueChanged}
                      ></ha-switch>
                    </ha-formfield>
                    ${this._config.show_channel_info&&n?F`
                            <ha-formfield
                              .label=${Ie(this.hass,"component.rss-accordion.editor.crop_channel_image")}
                            >
                              <ha-switch
                                .checked=${!!this._config.crop_channel_image}
                                .configValue=${"crop_channel_image"}
                                @change=${this._valueChanged}
                              ></ha-switch>
                            </ha-formfield>
                          `:""}
                    ${this._config.show_channel_info&&s?F`
                            <ha-formfield
                              .label=${Ie(this.hass,"component.rss-accordion.editor.show_channel_published_date")}
                            >
                              <ha-switch
                                .checked=${!!this._config.show_published_date}
                                .configValue=${"show_published_date"}
                                @change=${this._valueChanged}
                              ></ha-switch>
                            </ha-formfield>
                          `:""}
                    ${this._config.show_channel_info&&(o.description||o.subtitle)?F`
                            <ha-formfield
                              .label=${Ie(this.hass,"component.rss-accordion.editor.show_channel_description")}
                            >
                              <ha-switch
                                .checked=${!1!==this._config.show_channel_description}
                                .configValue=${"show_channel_description"}
                                @change=${this._valueChanged}
                              ></ha-switch>
                            </ha-formfield>
                            ${this._config.show_channel_description??!0?F`
                                    <ha-input
                                      .label=${Ie(this.hass,"component.rss-accordion.editor.max_channel_description_length")}
                                      type="number"
                                      min="1"
                                      .value=${this._config.max_channel_description_length||""}
                                      .configValue=${"max_channel_description_length"}
                                      @input=${this._valueChanged}
                                      .placeholder="180"
                                    ></ha-input>
                                  `:""}
                          `:""}
                  </div>
                `:""}
        </div>
      </ha-card>
    `}static{this.styles=a`
    ${r(ot)}
  `}}e([ue({attribute:!1})],st.prototype,"hass",void 0),e([_e()],st.prototype,"_config",void 0),customElements.get(nt)||customElements.define(nt,st);var rt=Object.freeze({__proto__:null,RssAccordionEditor:st});export{it as RssAccordion};
