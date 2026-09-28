var W=["entity","name","image","velocidade","altitude","condition"];function Y(r){if(!r||typeof r!="object"||Array.isArray(r))return{entity:"",name:"",image:"",image_rotated:"",velocidade:"",altitude:"",condition:"",rastro:!1,rastro_duracao_min:null,rastro_pontos_por_min:null,rastro_cor:"",rastro_max_pontos:null};try{let t=Object.keys(r).filter(e=>/^\d+$/.test(e)),o={entity:r.entity||"",name:r.name||"",image:r.image||"",image_rotated:r.image_rotated||"",velocidade:r.velocidade||"",altitude:r.altitude||"",condition:r.condition||"",rastro:r.rastro===!0,rastro_duracao_min:typeof r.rastro_duracao_min=="number"?r.rastro_duracao_min:null,rastro_pontos_por_min:typeof r.rastro_pontos_por_min=="number"?r.rastro_pontos_por_min:null,rastro_cor:r.rastro_cor||"",rastro_max_pontos:typeof r.rastro_max_pontos=="number"?r.rastro_max_pontos:null};return Object.keys(r).forEach(e=>{!/^\d+$/.test(e)&&o[e]===void 0&&(o[e]=r[e])}),t.length>0&&t.forEach(e=>{let i=Number(e);if(isNaN(i)||i<0||i>=W.length)return;let s=W[i];s&&o[s]===""&&r[e]&&(o[s]=r[e])}),o}catch(t){return console.error("Erro ao normalizar entidade:",t,r),{entity:r.entity||"",name:r.name||"",image:r.image||"",image_rotated:r.image_rotated||"",velocidade:r.velocidade||"",altitude:r.altitude||"",condition:r.condition||"",rastro:r.rastro===!0,rastro_duracao_min:typeof r.rastro_duracao_min=="number"?r.rastro_duracao_min:null,rastro_pontos_por_min:typeof r.rastro_pontos_por_min=="number"?r.rastro_pontos_por_min:null,rastro_cor:r.rastro_cor||"",rastro_max_pontos:typeof r.rastro_max_pontos=="number"?r.rastro_max_pontos:null,...r}}}function A(r){return Array.isArray(r)?r.filter(t=>t&&typeof t=="object").map(t=>{try{return Y(t)}catch(o){return console.error("Erro ao normalizar entidade:",o,t),t}}):[]}var S=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._styleElement=document.createElement("style"),this.shadowRoot.appendChild(this._styleElement),this.controlsContainer=document.createElement("div"),this.controlsContainer.className="map-controls",this.shadowRoot.appendChild(this.controlsContainer),this.mapShell=document.createElement("div"),this.mapShell.className="map-shell",this.shadowRoot.appendChild(this.mapShell),this.mapContainer=document.createElement("div"),this.mapContainer.id="map",this.mapShell.appendChild(this.mapContainer),this.fullscreenButton=document.createElement("button"),this.fullscreenButton.type="button",this.fullscreenButton.className="fullscreen-button",this.fullscreenButton.addEventListener("click",()=>this._toggleFullscreen()),this.mapShell.appendChild(this.fullscreenButton),this.fullscreenDialog=document.createElement("dialog"),this.fullscreenDialog.className="fullscreen-dialog",this.fullscreenDialog.addEventListener("close",()=>this._closeFullscreen()),this.shadowRoot.appendChild(this.fullscreenDialog),this._updateFullscreenButton(),this.followCountdownElement=document.createElement("div"),this.followCountdownElement.className="follow-countdown",this.followCountdownElement.title="Clique para retomar o seguir";let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("class","follow-countdown-circle"),t.setAttribute("viewBox","0 0 44 44");let o=document.createElementNS("http://www.w3.org/2000/svg","circle");o.setAttribute("class","follow-countdown-bg"),o.setAttribute("cx","22"),o.setAttribute("cy","22"),o.setAttribute("r","19"),t.appendChild(o),this.followCountdownProgressCircle=document.createElementNS("http://www.w3.org/2000/svg","circle"),this.followCountdownProgressCircle.setAttribute("class","follow-countdown-progress"),this.followCountdownProgressCircle.setAttribute("cx","22"),this.followCountdownProgressCircle.setAttribute("cy","22"),this.followCountdownProgressCircle.setAttribute("r","19");let e=2*Math.PI*19;this.followCountdownProgressCircle.setAttribute("stroke-dasharray",e),this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",e),t.appendChild(this.followCountdownProgressCircle),this.followCountdownElement.appendChild(t);let i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttribute("class","follow-countdown-icon"),i.setAttribute("viewBox","0 0 24 24"),i.setAttribute("width","18"),i.setAttribute("height","18");let s=document.createElementNS("http://www.w3.org/2000/svg","path");s.setAttribute("d","M12 2v4m0 12v4M2 12h4m12 0h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"),s.setAttribute("stroke","white"),s.setAttribute("stroke-width","2"),s.setAttribute("stroke-linecap","round"),s.setAttribute("fill","none"),i.appendChild(s),this.followCountdownElement.appendChild(i),this.followCountdownElement.addEventListener("click",a=>{a.stopPropagation(),a.preventDefault(),this._resumeFollowImmediately()}),this.shadowRoot.appendChild(this.followCountdownElement),this.markers={},this.infoBoxes={},this.lastPositions={},this._motion={},this._motionFrame=null,this.trails={},this.trailPolylines={},this._lastMapTypeOptions=null,this._lastMapControlsOptions=null,this._historyLoaded={},this._uiState={trafficEnabled:!1,nightModeEnabled:!1,followEnabled:!1,trafficOverride:!1,nightModeOverride:!1,followOverride:!1,rotateImageEnabled:!1,arrowEnabled:!0,motionEnabled:!0,motionOverride:!1,followZoomOffset:0,followZoomOverride:!1,entityVisibility:{}},this._followPausedByUser=!1,this._followResumeTimer=null,this._followResumeTime=null,this._followCountdownInterval=null,this._isPerformingProgrammaticMove=!1,this._lastProgrammaticMoveTime=null,this._optionsMenuOpen=!1,this._updateStyles()}_updateFullscreenButton(){let t=this.fullscreenDialog.open;this.fullscreenButton.title=t?"Sair da tela cheia":"Abrir em tela cheia",this.fullscreenButton.setAttribute("aria-label",this.fullscreenButton.title),this.fullscreenButton.setAttribute("aria-pressed",String(t)),this.fullscreenButton.innerHTML=t?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v6H3m12-6v6h6M3 15h6v6m12-6h-6v6"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9V3h6m6 0h6v6M3 15v6h6m12-6v6h-6"/></svg>'}_toggleFullscreen(){if(this.fullscreenDialog.open){this.fullscreenDialog.close();return}this.fullscreenDialog.appendChild(this.mapShell);try{this.fullscreenDialog.showModal(),this._updateFullscreenButton(),this._resizeMap()}catch(t){this.shadowRoot.insertBefore(this.mapShell,this.fullscreenDialog),console.error("Nao foi possivel abrir o mapa em tela cheia:",t)}}_closeFullscreen(){this.shadowRoot.insertBefore(this.mapShell,this.fullscreenDialog),this._updateFullscreenButton(),this._resizeMap()}_resizeMap(){requestAnimationFrame(()=>{this._map&&google.maps.event.trigger(this._map,"resize")})}_updateStyles(){var u,m,h,d,p;let t=((u=this._config)==null?void 0:u.max_height)||null,o=((m=this._config)==null?void 0:m.max_width)||null,e="450px",i="600px",s=t?`${t}px`:e,a=t?`${t}px`:i,l=o?`max-width: ${o}px;`:"",n=((h=this._config)==null?void 0:h.mostrar_menu)!==!1,c=((d=this._config)==null?void 0:d.ocultar_creditos)===!0;this._styleElement.textContent=`
      :host {
        display: block;
        position: relative;
        ${l}
      }
      .map-shell {
        position: relative;
      }
      .fullscreen-button {
        display: ${((p=this._config)==null?void 0:p.mostrar_tela_cheia)===!1?"none":"grid"};
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 2;
        place-items: center;
        width: 40px;
        height: 40px;
        padding: 8px;
        border: 0;
        border-radius: 4px;
        background: #fff;
        color: #333;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        cursor: pointer;
      }
      .fullscreen-button svg {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .fullscreen-dialog {
        inset: 0;
        width: 100vw;
        max-width: none;
        height: 100vh;
        height: 100dvh;
        max-height: none;
        padding: 0;
        border: 0;
        margin: 0;
        overflow: hidden;
      }
      .fullscreen-dialog::backdrop {
        background: rgba(0, 0, 0, 0.75);
      }
      .fullscreen-dialog .map-shell,
      .fullscreen-dialog #map {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
      .fullscreen-dialog .fullscreen-button {
        top: max(10px, env(safe-area-inset-top));
        right: max(10px, env(safe-area-inset-right));
      }
      #map {
        width: 100%;
        height: ${s};
        border-radius: 0 0 6px 6px;
        overflow: hidden;
      }

      @media (min-width: 768px) {
        #map {
          height: ${a};
        }
      }
      .info-box {
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 2px 5px;
        border-radius: 3px;
        display: inline-block;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        position: absolute;
        text-align: center;
        /* Permitir cliques na info box se necessario */
        pointer-events: none; 
      }
      .info-box .arrow-box {
        font-size: 15px;
      }
      .info-box .velocidade {
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
      }
      .info-box .altitude {
        font-size: 12px;
      }
      .map-controls {
        display: flex;
        ${n?"":"display: none;"}
        justify-content: space-between;
        align-items: center;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 8px 12px;
        border-radius: 6px 6px 0 0;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        margin-bottom: 0;
        position: relative;
      }
      .map-controls-left {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }
      .map-controls-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .entity-icon-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.1);
      }
      .entity-icon-button:hover {
        border-color: #fff;
        transform: scale(1.1);
      }
      .entity-icon-button.inactive {
        opacity: 0.4;
        filter: grayscale(100%);
      }
      .options-button {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .options-button:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .options-button.active {
        background: rgba(255, 255, 255, 0.3);
      }
      .options-menu {
        position: absolute;
        top: 100%;
        right: 12px;
        margin-top: 4px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        padding: 12px;
        min-width: 200px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: none;
      }
      .options-menu.open {
        display: block;
      }
      .options-menu label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        white-space: nowrap;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.2s ease;
      }
      .options-menu label:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .options-menu input[type="checkbox"] {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }
      .options-menu input[type="number"] {
        width: 56px;
        margin-left: auto;
        padding: 4px;
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        font: inherit;
      }
      .options-menu-separator {
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
        margin: 8px 0;
      }
      .follow-countdown {
        position: absolute;
        bottom: 12px;
        left: 12px;
        width: 44px;
        height: 44px;
        z-index: 100;
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        padding: 2px;
        cursor: pointer;
      }
      .follow-countdown.visible {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
      }
      .follow-countdown:hover {
        background: rgba(0, 0, 0, 0.85);
        transform: scale(1.1);
      }
      .follow-countdown:active {
        transform: scale(0.95);
      }
      .follow-countdown::after {
        content: "Clique para retomar";
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-8px);
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
      }
      .follow-countdown:hover::after {
        opacity: 1;
      }
      .follow-countdown-circle {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
      .follow-countdown-bg {
        fill: none;
        stroke: rgba(255, 255, 255, 0.2);
        stroke-width: 2.5;
      }
      .follow-countdown-progress {
        fill: none;
        stroke: #4CAF50;
        stroke-width: 2.5;
        stroke-linecap: round;
        transition: stroke-dashoffset 0.1s linear;
      }
      .follow-countdown-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
        pointer-events: none;
      }
      @media (max-width: 768px) {
        .map-controls {
          padding: 6px 8px;
        }
        .entity-icon-button {
          width: 35px;
          height: 35px;
        }
        .options-menu {
          right: 8px;
          left: 8px;
          min-width: auto;
        }
      }
      ${c?`
      /* Oculta barra inferior/termos/creditos do Google Maps */
      .gm-style-cc,
      .gmnoprint,
      .gm-style a[href^="https://maps.google.com/maps"],
      .gm-style a[href^="https://www.google.com/intl/"],
      .gm-style .gm-style-cc {
        display: none !important;
      }`:""}
    `}_getStorageKey(){return!this._config||!this._config.entities?"google-maps-car-card-cadu-default":`google-maps-car-card-cadu-${this._config.entities.map(o=>o.entity).sort().join(",")}`}_loadUIState(){try{let t=this._getStorageKey(),o=localStorage.getItem(t);if(o){let e=JSON.parse(o);e&&typeof e=="object"&&(this._uiState={trafficEnabled:e.trafficEnabled===!0,nightModeEnabled:e.nightModeEnabled===!0,followEnabled:e.followEnabled===!0,trafficOverride:e.trafficOverride===!0,nightModeOverride:e.nightModeOverride===!0,followOverride:e.followOverride===!0,rotateImageEnabled:e.rotateImageEnabled===!0,arrowEnabled:e.arrowEnabled!==!1,motionEnabled:e.motionEnabled!==!1,motionOverride:e.motionOverride===!0,followZoomOffset:Number.isFinite(Number(e.followZoomOffset))?Number(e.followZoomOffset):0,followZoomOverride:e.followZoomOverride===!0,entityVisibility:e.entityVisibility||{}})}}catch(t){console.error("Erro ao carregar estado do UI do localStorage:",t)}}_saveUIState(){try{let t=this._getStorageKey();localStorage.setItem(t,JSON.stringify(this._uiState))}catch(t){console.error("Erro ao salvar estado do UI no localStorage:",t)}}async _loadHistoryForEntities(){var o;if(!this._hass||!((o=this._config)!=null&&o.entities))return;let t=Date.now();for(let e of this._config.entities){let i=e.entity;if(!i||this._config.historico_somente_rastro!==!1&&e.rastro!==!0||this._historyLoaded[i]===!0)continue;this._historyLoaded[i]=!0;let s=Number.isFinite(e.rastro_duracao_min)?e.rastro_duracao_min:60,a=new Date(t-s*60*1e3).toISOString();try{let l=await this._hass.callApi("GET",`history/period/${a}?filter_entity_id=${i}&significant_changes_only=0`),n=Array.isArray(l)?l[0]:[],c=[];Array.isArray(n)&&n.forEach(d=>{var b,v;let p=(b=d==null?void 0:d.attributes)==null?void 0:b.latitude,f=(v=d==null?void 0:d.attributes)==null?void 0:v.longitude;if(typeof p=="number"&&typeof f=="number"){let g=new Date(d.last_updated||d.last_changed||d.timestamp).getTime();c.push({lat:p,lng:f,ts:g})}}),c.sort((d,p)=>d.ts-p.ts);let u=Number.isFinite(this._config.historico_limite_pontos)?this._config.historico_limite_pontos:null,m=u?this._sampleHistoryPoints(c,u):c;this.trails[i]=m;let h=this._findLastSignificantRotation(m);if(h!==null){let d=m[m.length-1];this.lastPositions[i]={lat:d.lat,lng:d.lng,rotation:h}}this._renderTrail(i,e)}catch(l){console.error("Erro ao carregar hist\xF3rico do HA:",l,i)}}}_getTrailConfig(t){return{enabled:t.rastro===!0,durationMin:Number.isFinite(t.rastro_duracao_min)?t.rastro_duracao_min:60,maxPerMin:Number.isFinite(t.rastro_pontos_por_min)?t.rastro_pontos_por_min:10,color:this._normalizeTrailColor(t.rastro_cor),maxPoints:Number.isFinite(t.rastro_max_pontos)?t.rastro_max_pontos:600}}_normalizeTrailColor(t){if(Array.isArray(t)&&t.length>=3){let[o,e,i]=t,s=a=>Math.max(0,Math.min(255,Number(a)||0)).toString(16).padStart(2,"0");return`#${s(o)}${s(e)}${s(i)}`}return typeof t=="string"&&t.trim()!==""?t.trim():"#00aaff"}_sampleHistoryPoints(t,o){if(!Array.isArray(t)||t.length<=o)return t;let e=Math.ceil(t.length/o),i=[];for(let a=0;a<t.length;a+=e)i.push(t[a]);let s=t[t.length-1];return i[i.length-1]!==s&&i.push(s),i}_findLastSignificantRotation(t){if(!Array.isArray(t)||t.length<2)return null;for(let o=t.length-1;o>0;o-=1){let e=t[o],i=t[o-1],s=e.lng-i.lng,a=e.lat-i.lat;if(Math.abs(s)>1e-5||Math.abs(a)>1e-5)return Math.atan2(a,s)*(180/Math.PI)}return null}_pruneTrail(t,o,e){let i=Date.now(),s=t.filter(a=>i-a.ts<=o);return s.length>e&&(s=s.slice(s.length-e)),s}_reduceTrailDensity(t,o){let e=Date.now(),i=t.slice(),s=l=>l.filter(n=>e-n.ts<=6e4).length,a=0;for(;s(i)>o&&i.length>2&&a<5;)i=i.filter((l,n)=>n%2===0||n===i.length-1),a+=1;return i}_recordTrailPoint(t,o,e){let i=this._getTrailConfig(e),s=Array.isArray(this.trails[t])?this.trails[t]:[],a=s[s.length-1],l=a?Math.abs(o.lng()-a.lng):1/0,n=a?Math.abs(o.lat()-a.lat):1/0;if(a&&l<=1e-5&&n<=1e-5)return;let c=s.concat([{lat:o.lat(),lng:o.lng(),ts:Date.now()}]),u=i.durationMin*60*1e3,m=this._pruneTrail(c,u,i.maxPoints);m=this._reduceTrailDensity(m,i.maxPerMin),this.trails[t]=m}_clearTrail(t){let o=this.trailPolylines[t];Array.isArray(o)&&o.forEach(e=>e.setMap(null)),delete this.trailPolylines[t]}_renderTrail(t,o){let e=this._getTrailConfig(o);if(!e.enabled){this._clearTrail(t);return}let i=this.trails[t];if(!Array.isArray(i)||i.length<2){this._clearTrail(t);return}this._clearTrail(t);let s=[],a=.9,l=.1,n=i.length-1;for(let c=1;c<i.length;c++){let u=c/n,m=l+u*(a-l),h=new google.maps.Polyline({path:[{lat:i[c-1].lat,lng:i[c-1].lng},{lat:i[c].lat,lng:i[c].lng}],geodesic:!0,strokeColor:e.color,strokeOpacity:m,strokeWeight:3,map:this._map});s.push(h)}this.trailPolylines[t]=s}set hass(t){this._hass=t,this._map&&this._config&&(this._updateMap(),this._applyMapTypeOptions(),this._applyNightMode(),this._toggleTrafficLayer())}disconnectedCallback(){this._motionFrame!==null&&(cancelAnimationFrame(this._motionFrame),this._motionFrame=null)}connectedCallback(){this._config&&Object.keys(this._motion).length&&this._scheduleMotionFrame()}_distanceMeters(t,o){let e=(t.lat+o.lat)/2*Math.PI/180,i=(o.lat-t.lat)*111320,s=(o.lng-t.lng)*111320*Math.cos(e);return Math.hypot(i,s)}_positionForMotion(t,o){if(!this._isMotionEnabled())return t.real;let e=Math.max(0,o-t.receivedAt),s=t.heading!==null&&t.speed>3?Math.min(t.speed/3.6*Math.min(e,4e3)/1e3,80):0,a=t.real.lat+s*Math.sin(t.heading)/111320,l=t.real.lng+s*Math.cos(t.heading)/(111320*Math.max(.01,Math.cos(t.real.lat*Math.PI/180))),n={lat:a,lng:l};if(!t.from||e>=800)return n;let c=e/800;return{lat:t.from.lat+(n.lat-t.from.lat)*c,lng:t.from.lng+(n.lng-t.from.lng)*c}}_setDisplayedPosition(t,o){let e=this._motion[t];e&&(e.displayed=o);let i=this.markers[t],s=new google.maps.LatLng(o.lat,o.lng);i instanceof google.maps.Marker?i.setPosition(s):i&&(i.position=s,i.draw());let a=this.infoBoxes[t];a&&(a.position=s,a.draw())}_scheduleMotionFrame(){this._motionFrame!==null||!this.isConnected||!this._isMotionEnabled()||(this._motionFrame=requestAnimationFrame(()=>{if(this._motionFrame=null,!this.isConnected||!this._isMotionEnabled())return;let t=Date.now(),o=!1;Object.entries(this._motion).forEach(([e,i])=>{if(!this.markers[e])return;let s=t-i.receivedAt;s>4e3&&s>800||(this._setDisplayedPosition(e,this._positionForMotion(i,t)),s<4e3&&(i.heading!==null&&i.speed>3||s<800)&&(o=!0))}),o&&this._scheduleMotionFrame()}))}_updateMotion(t,o,e,i){var x,y;let s={lat:o.lat(),lng:o.lng()},a=this._motion[t],l=Date.now();if(!(!a||this._distanceMeters(a.real,s)>.5)){if(!this._isMotionEnabled())return a.displayed=s,s;let E=e.velocidade&&this._hass.states[e.velocidade],w=((x=E==null?void 0:E.attributes)==null?void 0:x.unit_of_measurement)==="m/s"?Number(E.state)*3.6:Number(E==null?void 0:E.state);return a.speed>3&&w<=3&&(a.from=a.displayed,a.receivedAt=l,a.heading=null,a.speed=0,this._scheduleMotionFrame()),a.displayed||s}let c=e.velocidade&&this._hass.states[e.velocidade],m=((y=c==null?void 0:c.attributes)==null?void 0:y.unit_of_measurement)==="m/s"?Number(c.state)*3.6:Number(c==null?void 0:c.state),h=Date.parse((c==null?void 0:c.last_updated)||""),d=Number.isFinite(h)&&l-h<3e4,p=a?this._distanceMeters(a.real,s):0,f=a&&p>=5&&p<=500?Math.atan2(s.lat-a.real.lat,(s.lng-a.real.lng)*Math.cos(s.lat*Math.PI/180)):null,b=Date.parse(i.last_updated||""),v=Number.isFinite(b)&&l-b<1e4,g=a!=null&&a.displayed&&p<=250?a.displayed:null;return this._motion[t]={real:s,displayed:g||s,from:this._isMotionEnabled()?g:null,receivedAt:l,heading:v&&d?f:null,speed:d&&Number.isFinite(m)&&m>0&&m<=160?m:0},this._isMotionEnabled()&&this._scheduleMotionFrame(),this._motion[t].displayed}_isMotionEnabled(){return this._config.mostrar_menu!==!1&&this._uiState.motionOverride?this._uiState.motionEnabled:this._config.prever_movimento!==!1}_getFollowZoomOffset(){return this._config.mostrar_menu!==!1&&this._uiState.followZoomOverride?this._uiState.followZoomOffset:this._config.ajuste_zoom_seguir}setConfig(t){try{let o=this._normalizeConfig(t||{});if(this._config=o,(!this._config.entities||!this._config.api_key)&&console.warn("Configuracao incompleta: api_key ou entities ausentes"),this._config={...this._config,transito:typeof this._config.transito=="string"?this._config.transito:null,modo_noturno:typeof this._config.modo_noturno=="string"?this._config.modo_noturno:null,follow_entity:typeof this._config.follow_entity=="string"?this._config.follow_entity:null,rotate_image:this._config.rotate_image===!0,mostrar_menu:this._config.mostrar_menu!==!1,mostrar_tipo_mapa:this._config.mostrar_tipo_mapa!==!1,tipo_mapa:typeof this._config.tipo_mapa=="string"?this._config.tipo_mapa:"roadmap",mostrar_tela_cheia:this._config.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:this._config.mostrar_controles_navegacao!==!1,ocultar_creditos:this._config.ocultar_creditos===!0,transito_on:this._config.transito_on===!0,modo_noturno_on:this._config.modo_noturno_on===!0,seguir_on:this._config.seguir_on===!0,ajuste_zoom_seguir:Number.isFinite(Number(this._config.ajuste_zoom_seguir))?Number(this._config.ajuste_zoom_seguir):0,rotacao_on:this._config.rotacao_on===!0,prever_movimento:this._config.prever_movimento!==!1,historico_somente_rastro:this._config.historico_somente_rastro!==!1,historico_carregar_no_start:this._config.historico_carregar_no_start!==!1,historico_recarregar:this._config.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(this._config.historico_limite_pontos)?this._config.historico_limite_pontos:null},this._loadUIState(),this._uiState.trafficEnabled===void 0&&(this._uiState.trafficEnabled=!1),this._uiState.nightModeEnabled===void 0&&(this._uiState.nightModeEnabled=!1),this._uiState.followEnabled===void 0&&(this._uiState.followEnabled=!1),this._uiState.trafficOverride===void 0&&(this._uiState.trafficOverride=!1),this._uiState.nightModeOverride===void 0&&(this._uiState.nightModeOverride=!1),this._uiState.followOverride===void 0&&(this._uiState.followOverride=!1),this._uiState.rotateImageEnabled===void 0&&(this._uiState.rotateImageEnabled=!1),this._uiState.arrowEnabled===void 0&&(this._uiState.arrowEnabled=!0),this._config.mostrar_menu===!1&&(this._config.transito||(this._uiState.trafficEnabled=this._config.transito_on===!0),this._config.modo_noturno||(this._uiState.nightModeEnabled=this._config.modo_noturno_on===!0),this._config.follow_entity||(this._uiState.followEnabled=this._config.seguir_on===!0),this._uiState.rotateImageEnabled=this._config.rotacao_on===!0),this._initializeEntityVisibility(),!this._config.mostrar_tela_cheia&&this.fullscreenDialog.open&&this.fullscreenDialog.close(),this._updateStyles(),this._map&&this.controlsContainer&&(this._renderControls(),requestAnimationFrame(()=>{this._applyNightMode(),this._toggleTrafficLayer(),this._applyMapTypeOptions(),this._applyMapControlsOptions()})),this._map&&this._config.historico_recarregar===!0&&(this._historyLoaded={},this._loadHistoryForEntities()),!this._config.api_key){this.mapContainer.innerHTML='<div style="padding: 20px; color: white;">Configure a API Key do Google Maps</div>';return}if(this._map){this._updateMap();return}if(!window.google||!window.google.maps){let e=document.createElement("script");e.src=`https://maps.googleapis.com/maps/api/js?key=${this._config.api_key}`,e.onload=()=>{this._initializeMap()},document.head.appendChild(e)}else this._initializeMap()}catch(o){console.error("Erro ao definir configura\xE7\xE3o no card:",o)}}_normalizeConfig(t){if(!t||typeof t!="object")return{api_key:"",follow_entity:"",entities:[]};try{let o=A(t.entities||[]);return{...t,entities:o}}catch(o){return t}}_applyMapTypeOptions(){if(!this._map)return;let t=this._config.tipo_mapa||"roadmap",o=this._config.mostrar_tipo_mapa!==!1,e=`${t}|${o}`;this._lastMapTypeOptions!==e&&(this._lastMapTypeOptions=e,this._map.setOptions({mapTypeId:t,mapTypeControl:o}))}_applyMapControlsOptions(){if(!this._map)return;let t=this._config.mostrar_controles_navegacao!==!1,o=`${t}`;this._lastMapControlsOptions!==o&&(this._lastMapControlsOptions=o,this._map.setOptions({fullscreenControl:!1,zoomControl:t}))}getCardSize(){return 6}_initializeMap(){this.mapContainer&&(this._map=new google.maps.Map(this.mapContainer,{center:{lat:-30.0277,lng:-51.2287},zoom:17,isFractionalZoomEnabled:!0,streetViewControl:!1,mapTypeControl:this._config.mostrar_tipo_mapa!==!1,mapTypeId:this._config.tipo_mapa||"roadmap",fullscreenControl:!1,zoomControl:this._config.mostrar_controles_navegacao!==!1}),this._setupMapInteractionListeners(),this._renderControls(),setTimeout(()=>{this._applyNightMode()},50),this._config.historico_carregar_no_start!==!1&&this._loadHistoryForEntities().then(()=>{this._config.entities&&this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)})}),this._config.entities&&this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)}),this._shouldFollow()&&this._fitMapBounds(),this.trafficLayer=new google.maps.TrafficLayer,this._toggleTrafficLayer())}_updateMap(){this._config.entities&&(this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)}),this._shouldFollow()&&this._fitMapBounds())}_shouldFollow(){if(this._followPausedByUser)return!1;if(this._config.follow_entity&&this._config.follow_entity!==""){let t=this._hass.states[this._config.follow_entity];if(!this._uiState.followOverride)return t&&t.state==="on"}return this._config.mostrar_menu===!1&&!this._config.follow_entity?this._config.seguir_on===!0:this._uiState.followEnabled}_setupMapInteractionListeners(){if(!this._map)return;let t=null,o=e=>{e.target.closest(".map-controls")||e.target.closest(".follow-countdown")||e.target.closest(".options-menu")||t||(t=setTimeout(()=>{t=null},100),this._handleUserInteraction())};this.mapContainer.addEventListener("mousedown",o),this.mapContainer.addEventListener("touchstart",o,{passive:!0}),this.mapContainer.addEventListener("wheel",o,{passive:!0})}_handleUserInteraction(){var e,i,s;if(this._isPerformingProgrammaticMove||!(this._config.follow_entity&&this._config.follow_entity!==""?((s=(i=(e=this._hass)==null?void 0:e.states)==null?void 0:i[this._config.follow_entity])==null?void 0:s.state)==="on"&&!this._uiState.followOverride:this._config.mostrar_menu===!1&&!this._config.follow_entity?this._config.seguir_on===!0:this._uiState.followEnabled))return;this._followResumeTimer&&clearTimeout(this._followResumeTimer),this._followCountdownInterval&&clearInterval(this._followCountdownInterval);let o=this._followPausedByUser;this._followPausedByUser=!0,this._followResumeTime=Date.now()+1e4,o||this._updateFollowCountdown(),this._followCountdownInterval=setInterval(()=>{this._updateFollowCountdown()},100),this._followResumeTimer=setTimeout(()=>{this._followPausedByUser=!1,this._followResumeTimer=null,this._followResumeTime=null,this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()},1e4)}_updateFollowCountdown(){if(!this.followCountdownElement||!this._followResumeTime||!this.followCountdownProgressCircle)return;let t=1e4,o=this._followResumeTime-Date.now();if(o<=0){this._hideFollowCountdown();return}let e=1-o/t,s=2*Math.PI*19*(1-e);this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",s),this.followCountdownElement.classList.add("visible")}_hideFollowCountdown(){if(this.followCountdownElement&&(this.followCountdownElement.classList.remove("visible"),this.followCountdownProgressCircle)){let t=2*Math.PI*19;this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",t)}}_resumeFollowImmediately(){this._followResumeTimer&&(clearTimeout(this._followResumeTimer),this._followResumeTimer=null),this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._followPausedByUser=!1,this._followResumeTime=null,this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()}_applyNightMode(){var i;if(!this._map)return;if(!this._hass&&this._config.modo_noturno&&typeof this._config.modo_noturno=="string"&&this._config.modo_noturno!==""){setTimeout(()=>this._applyNightMode(),100);return}let t=[{elementType:"geometry",stylers:[{color:"#212121"}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{elementType:"labels.text.stroke",stylers:[{color:"#212121"}]},{featureType:"administrative",elementType:"geometry",stylers:[{color:"#757575"}]},{featureType:"administrative.country",elementType:"labels.text.fill",stylers:[{color:"#9e9e9e"}]},{featureType:"administrative.land_parcel",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#bdbdbd"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#181818"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"poi.park",elementType:"labels.text.stroke",stylers:[{color:"#1b1b1b"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#2c2c2c"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#8a8a8a"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#373737"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#3c3c3c"}]},{featureType:"road.highway.controlled_access",elementType:"geometry",stylers:[{color:"#4e4e4e"}]},{featureType:"road.local",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"transit",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#000000"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#3d3d3d"}]}],o=this._config.modo_noturno,e=this._uiState.nightModeEnabled;typeof o=="string"&&o!==""&&!this._uiState.nightModeOverride?e=((i=this._hass.states[o])==null?void 0:i.state)==="on":!o&&this._config.mostrar_menu===!1&&this._config.modo_noturno_on===!0&&(e=!0),this._map.setOptions({styles:e?t:[]})}_toggleTrafficLayer(){var e;if(!this.trafficLayer)return;let t=this._config.transito,o=this._uiState.trafficEnabled;typeof t=="string"&&t!==""&&!this._uiState.trafficOverride?o=((e=this._hass.states[t])==null?void 0:e.state)==="on":!t&&this._config.mostrar_menu===!1&&this._config.transito_on===!0&&(o=!0),o?this.trafficLayer.setMap(this._map):this.trafficLayer.setMap(null)}_addOrUpdateMarker(t){if(!this._hass||!this._hass.states)return;let o=this._hass.states[t.entity],e=t.condition?this._hass.states[t.condition]:null,i=t.condition?e&&e.state==="on":this._uiState.entityVisibility[t.entity]!==!1;if(o&&o.state!=="unavailable"&&i){if(!o.attributes.latitude||!o.attributes.longitude)return;let s=new google.maps.LatLng(o.attributes.latitude,o.attributes.longitude),a=this._updateMotion(t.entity,s,t,o),l=new google.maps.LatLng(a.lat,a.lng),n=this.markers[t.entity],c=this._getInfoBoxText(t),u,m=this.lastPositions[t.entity],h=0,d=0;m?(h=s.lng()-m.lng,d=s.lat()-m.lat,Math.abs(h)>1e-5||Math.abs(d)>1e-5?u=Math.atan2(d,h)*(180/Math.PI):u=m.rotation!==999?m.rotation:999):u=999;let p=this._getArrowFromRotation(u);this.lastPositions[t.entity]={lat:s.lat(),lng:s.lng(),rotation:u},this._recordTrailPoint(t.entity,s,t);let f=this._getEntityDisplayName(t,o),b=this._uiState.rotateImageEnabled===!0;if(b?n&&n instanceof google.maps.Marker&&(n.setMap(null),n=null):n&&typeof n.draw=="function"&&!(n instanceof google.maps.Marker)&&(n.setMap(null),n=null),b){let g=0;u!==999?g=180-u:g=0;let x=t.image_rotated||t.image||o.attributes.entity_picture||"";if(n){n.position=l,n.rotation=g;let y=x;n.imageUrl!==y&&(n.imageUrl=y,n.img_&&(n.img_.src=y)),n.draw()}else{let y=x,E=document.createElement("img");E.src=y,E.style.width="60px",E.style.height="60px",E.style.transform=`rotate(${g}deg)`,n=new google.maps.OverlayView,n.position=l,n.rotation=g,n.imageUrl=y,n.onAdd=function(){let w=document.createElement("div");w.style.position="absolute",w.style.width="60px",w.style.height="60px",w.style.cursor="pointer";let M=document.createElement("img");M.src=this.imageUrl,M.style.width="100%",M.style.height="100%",M.style.position="absolute",M.style.top="0",M.style.left="0",w.appendChild(M),this.div_=w,this.img_=M,this.getPanes().overlayLayer.appendChild(w)},n.draw=function(){let w=this.getProjection();if(!w||!this.position)return;let M=w.fromLatLngToDivPixel(this.position),T=this.div_;T&&(T.style.left=M.x-30+"px",T.style.top=M.y-30+"px",T.style.transform=`rotate(${this.rotation}deg)`)},n.onRemove=function(){this.div_&&(this.div_.parentNode.removeChild(this.div_),this.div_=null)},n.getPosition=function(){return this.position},n.setMap(this._map),this.markers[t.entity]=n}}else if(n)n.setPosition(l),n.setTitle(f);else{let g={url:t.image||o.attributes.entity_picture||"",scaledSize:new google.maps.Size(60,60),anchor:new google.maps.Point(30,30)};n=new google.maps.Marker({position:l,map:this._map,title:f,icon:g}),this.markers[t.entity]=n}this.infoBoxes[t.entity]&&this.infoBoxes[t.entity].setMap(null);let v=new google.maps.OverlayView;v.position=l,v.onAdd=function(){let g=document.createElement("div");g.className="info-box";let x=this._parent._uiState.arrowEnabled?`<div class="arrow-box">${p} <!-- seta --></div>`:"";g.innerHTML=`
          ${x}
          ${c}
        `,this.div_=g,this.getPanes().overlayLayer.appendChild(g)},v._parent=this,v.draw=function(){let x=this.getProjection().fromLatLngToDivPixel(this.position),y=this.div_,E=0,w=-50;if(b&&(w=-65),b&&u!==999){let M=180-u,T=65,C=T,F=M*(Math.PI/180);E=T*Math.sin(F),w=-C*Math.cos(F)}y.style.left=`${x.x+E}px`,y.style.top=`${x.y+w}px`,y.style.transform="translate(-50%, -50%)"},v.onRemove=function(){this.div_.parentNode.removeChild(this.div_),this.div_=null},v.setMap(this._map),this.infoBoxes[t.entity]=v,this._renderTrail(t.entity,t),this._shouldFollow()&&this._centerOnMarkerWithPadding(s)}else delete this._motion[t.entity],this.markers[t.entity]&&(this.markers[t.entity].setMap(null),delete this.markers[t.entity]),this.infoBoxes[t.entity]&&(this.infoBoxes[t.entity].setMap(null),delete this.infoBoxes[t.entity]),this._clearTrail(t.entity)}_initializeEntityVisibility(){!this._config||!this._config.entities||this._config.entities.forEach(t=>{t.entity in this._uiState.entityVisibility||(this._uiState.entityVisibility[t.entity]=!0)})}_renderControls(){var y,E,w,M,T,C,F,B,R;if(!this.controlsContainer||(this.controlsContainer.innerHTML="",this._config.mostrar_menu===!1))return;let t=document.createElement("div");t.className="map-controls-left",this._config.entities&&this._config.entities.forEach(_=>{var D,H,Z;if(_.condition)return;let k=(H=(D=this._hass)==null?void 0:D.states)==null?void 0:H[_.entity],I=this._uiState.entityVisibility[_.entity]!==!1,U=_.image||((Z=k==null?void 0:k.attributes)==null?void 0:Z.entity_picture)||"";if(U){let P=document.createElement("img");P.className=`entity-icon-button${I?"":" inactive"}`,P.src=U,P.title=this._getEntityDisplayName(_,k),P.addEventListener("click",q=>{q.stopPropagation(),q.preventDefault(),this._uiState.entityVisibility[_.entity]=!I,this._saveUIState(),this._renderControls(),this._addOrUpdateMarker(_)}),t.appendChild(P)}});let o=document.createElement("div");o.className="map-controls-right";let e=document.createElement("button");e.className=`options-button${this._optionsMenuOpen?" active":""}`,e.innerHTML="\u2699\uFE0F Op\xE7\xF5es",e.addEventListener("click",_=>{_.stopPropagation(),_.preventDefault(),this._optionsMenuOpen=!this._optionsMenuOpen,this._renderControls()}),o.appendChild(e);let i=document.createElement("div");i.className=`options-menu${this._optionsMenuOpen?" open":""}`;let s=document.createElement("label"),a=document.createElement("input");a.type="checkbox",typeof this._config.transito=="string"&&this._config.transito!==""&&!this._uiState.trafficOverride?a.checked=((w=(E=(y=this._hass)==null?void 0:y.states)==null?void 0:E[this._config.transito])==null?void 0:w.state)==="on":a.checked=this._uiState.trafficEnabled,a.addEventListener("change",_=>{_.stopPropagation(),this._uiState.trafficOverride=!0,this._uiState.trafficEnabled=a.checked,this._saveUIState(),this._toggleTrafficLayer()}),a.addEventListener("click",_=>{_.stopPropagation()}),s.appendChild(a),s.appendChild(document.createTextNode("Tr\xE2nsito")),s.addEventListener("click",_=>{_.stopPropagation()}),i.appendChild(s);let l=document.createElement("label"),n=document.createElement("input");n.type="checkbox",typeof this._config.modo_noturno=="string"&&this._config.modo_noturno!==""&&!this._uiState.nightModeOverride?n.checked=((C=(T=(M=this._hass)==null?void 0:M.states)==null?void 0:T[this._config.modo_noturno])==null?void 0:C.state)==="on":n.checked=this._uiState.nightModeEnabled,n.addEventListener("change",_=>{_.stopPropagation(),this._uiState.nightModeOverride=!0,this._uiState.nightModeEnabled=n.checked,this._saveUIState(),this._applyNightMode()}),n.addEventListener("click",_=>{_.stopPropagation()}),l.appendChild(n),l.appendChild(document.createTextNode("Modo Noturno")),l.addEventListener("click",_=>{_.stopPropagation()}),i.appendChild(l);let c=document.createElement("label"),u=document.createElement("input");u.type="checkbox",typeof this._config.follow_entity=="string"&&this._config.follow_entity!==""&&!this._uiState.followOverride?u.checked=((R=(B=(F=this._hass)==null?void 0:F.states)==null?void 0:B[this._config.follow_entity])==null?void 0:R.state)==="on":u.checked=this._uiState.followEnabled,u.addEventListener("change",_=>{_.stopPropagation(),this._uiState.followOverride=!0,this._uiState.followEnabled=u.checked,this._saveUIState(),this._followPausedByUser=!1,this._followResumeTimer&&(clearTimeout(this._followResumeTimer),this._followResumeTimer=null),this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._followResumeTime=null,this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()}),u.addEventListener("click",_=>{_.stopPropagation()}),c.appendChild(u),c.appendChild(document.createTextNode("Seguir")),c.addEventListener("click",_=>{_.stopPropagation()}),i.appendChild(c);let m=document.createElement("label"),h=document.createElement("input");h.type="number",h.min="-10",h.max="10",h.step="0.25",h.value=String(this._getFollowZoomOffset()),h.setAttribute("aria-label","Zoom relativo ao seguir"),h.addEventListener("change",_=>{_.stopPropagation();let k=Number(h.value);if(!Number.isFinite(k)){h.value=String(this._getFollowZoomOffset());return}let I=Math.max(-10,Math.min(10,Math.round(k*4)/4));h.value=String(I),this._uiState.followZoomOverride=!0,this._uiState.followZoomOffset=I,this._saveUIState(),this._shouldFollow()&&this._fitMapBounds()}),m.appendChild(document.createTextNode("Zoom relativo")),m.appendChild(h),i.appendChild(m);let d=document.createElement("div");d.className="options-menu-separator",i.appendChild(d);let p=document.createElement("label"),f=document.createElement("input");f.type="checkbox",f.checked=this._isMotionEnabled(),f.addEventListener("change",_=>{_.stopPropagation(),this._uiState.motionOverride=!0,this._uiState.motionEnabled=f.checked,this._saveUIState(),this._motionFrame!==null&&(cancelAnimationFrame(this._motionFrame),this._motionFrame=null),this._motion={},this._updateMap()}),p.appendChild(f),p.appendChild(document.createTextNode("Prever movimento")),i.appendChild(p);let b=document.createElement("label"),v=document.createElement("input");v.type="checkbox",v.checked=this._uiState.rotateImageEnabled,v.addEventListener("change",_=>{_.stopPropagation(),this._uiState.rotateImageEnabled=v.checked,this._saveUIState(),this._config.entities&&this._config.entities.forEach(k=>{this._addOrUpdateMarker(k)})}),v.addEventListener("click",_=>{_.stopPropagation()}),b.appendChild(v),b.appendChild(document.createTextNode("Rota\xE7\xE3o")),b.addEventListener("click",_=>{_.stopPropagation()}),i.appendChild(b);let g=document.createElement("label"),x=document.createElement("input");x.type="checkbox",x.checked=this._uiState.arrowEnabled,x.addEventListener("change",_=>{_.stopPropagation(),this._uiState.arrowEnabled=x.checked,this._saveUIState(),this._config.entities&&this._config.entities.forEach(k=>{this._addOrUpdateMarker(k)})}),x.addEventListener("click",_=>{_.stopPropagation()}),g.appendChild(x),g.appendChild(document.createTextNode("Seta")),g.addEventListener("click",_=>{_.stopPropagation()}),i.appendChild(g),this.controlsContainer.appendChild(t),this.controlsContainer.appendChild(o),this.controlsContainer.appendChild(i),i.addEventListener("click",_=>{_.stopPropagation()}),this._optionsMenuOpen&&setTimeout(()=>{let _=k=>{!k.target.closest(".options-menu")&&!k.target.closest(".options-button")&&this._closeOptionsMenu()};document.addEventListener("click",_,{once:!0})},0)}_closeOptionsMenu(){this._optionsMenuOpen=!1,this._renderControls()}_getArrowFromRotation(t){return t>=-22.5&&t<22.5?"&rarr;":t>=22.5&&t<67.5?"&nearr;":t>=67.5&&t<112.5?"&uarr;":t>=112.5&&t<157.5?"&nwarr;":t>=157.5&&t<500||t<-157.5?"&larr;":t>=-157.5&&t<-112.5?"&swarr;":t>=-112.5&&t<-67.5?"&darr;":t>=-67.5&&t<-22.5?"&searr;":"&bull;"}_getEntityDisplayName(t,o){var e;return t.name?t.name:((e=o==null?void 0:o.attributes)==null?void 0:e.friendly_name)||t.entity}_getInfoBoxText(t){let o="";if(t.velocidade&&this._hass&&this._hass.states[t.velocidade]){let e=parseFloat(this._hass.states[t.velocidade].state).toFixed(0);o+=`<div class="velocidade"> ${e} km/h</div>`}if(t.altitude&&this._hass&&this._hass.states[t.altitude]){let e=parseFloat(this._hass.states[t.altitude].state).toFixed(0);o+=`<div class="altitude"> &#9650; ${e} m</div>`}return o}_fitMapBounds(){if(!this._map||!this.markers||Object.keys(this.markers).length===0)return;this._isPerformingProgrammaticMove=!0;let t=new google.maps.LatLngBounds;Object.values(this.markers).forEach(e=>{t.extend(e.getPosition())});let o=this._shouldFollow()?{top:100,right:50,bottom:50,left:50}:0;this._map.fitBounds(t,o),google.maps.event.addListenerOnce(this._map,"bounds_changed",()=>{this._applyFollowZoomAdjustment()}),google.maps.event.addListenerOnce(this._map,"idle",()=>{this._isPerformingProgrammaticMove=!1})}_applyFollowZoomAdjustment(){let t=Math.min(this._map.getZoom(),18),o=this._shouldFollow()?this._getFollowZoomOffset():0,e=Math.max(0,Math.min(22,t+o));this._map.getZoom()!==e&&this._map.setZoom(e)}_centerOnMarkerWithPadding(t){if(!this._map)return;this._isPerformingProgrammaticMove=!0,this._lastProgrammaticMoveTime=Date.now();let o=new google.maps.LatLngBounds;o.extend(t);let e=.002,i=.001;o.extend(new google.maps.LatLng(t.lat()+e,t.lng())),o.extend(new google.maps.LatLng(t.lat()-e*.3,t.lng())),o.extend(new google.maps.LatLng(t.lat(),t.lng()+i)),o.extend(new google.maps.LatLng(t.lat(),t.lng()-i)),this._map.fitBounds(o,{top:100,right:50,bottom:50,left:50}),google.maps.event.addListenerOnce(this._map,"bounds_changed",()=>{this._applyFollowZoomAdjustment(),setTimeout(()=>{this._isPerformingProgrammaticMove=!1,this._lastProgrammaticMoveTime=Date.now()},500)})}};var z=class extends HTMLElement{constructor(){super(),this._updating=!1}setConfig(t){try{let o=this._normalizeConfig(t||{});this._config=o,this._rendered&&this._hass?this._syncFormData():!this._rendered&&this._hass&&this._render()}catch(o){console.error("Erro ao definir configura\xE7\xE3o:",o,t),this._config=t||{},this._rendered&&this._hass&&this._syncFormData()}}set hass(t){this._hass=t,this._hass&&(this._rendered&&!this._updating?this._syncFormData():!this._rendered&&this._config&&this._render())}_render(){if(!this._hass)return;this._rendered=!0,this.innerHTML="";let t=document.createElement("ha-form");t.hass=this._hass;let o=this._normalizeConfig(this._config||{}),e;try{e=JSON.parse(JSON.stringify(o))}catch(i){console.error("Erro ao criar c\xF3pia dos dados:",i),e={...o}}e.api_key=e.api_key||"",e.follow_entity=e.follow_entity||"",e.modo_noturno=e.modo_noturno||"",e.transito=e.transito||"",e.mostrar_menu=e.mostrar_menu!==!1,e.mostrar_tipo_mapa=e.mostrar_tipo_mapa!==!1,e.tipo_mapa=e.tipo_mapa||"roadmap",e.mostrar_tela_cheia=e.mostrar_tela_cheia!==!1,e.mostrar_controles_navegacao=e.mostrar_controles_navegacao!==!1,e.ocultar_creditos=e.ocultar_creditos===!0,e.transito_on=e.transito_on===!0,e.modo_noturno_on=e.modo_noturno_on===!0,e.seguir_on=e.seguir_on===!0,e.ajuste_zoom_seguir=Number.isFinite(Number(e.ajuste_zoom_seguir))?Number(e.ajuste_zoom_seguir):0,e.rotacao_on=e.rotacao_on===!0,e.prever_movimento=e.prever_movimento!==!1,e.historico_somente_rastro=e.historico_somente_rastro!==!1,e.historico_carregar_no_start=e.historico_carregar_no_start!==!1,e.historico_recarregar=e.historico_recarregar===!0,e.historico_limite_pontos=Number.isFinite(e.historico_limite_pontos)?e.historico_limite_pontos:null,e.max_height=e.max_height||null,e.max_width=e.max_width||null,e.entities=e.entities||[],t.schema=this._buildSchema(),t.computeLabel=i=>i.label||i.name,t.data=e,t.addEventListener("value-changed",i=>{if(!this._updating)try{this._updating=!0,this._dispatchConfigChanged(i.detail.value)}catch(s){console.error("Erro ao processar mudan\xE7a de valor:",s)}finally{setTimeout(()=>{this._updating=!1},100)}}),this.appendChild(t),this._form=t,requestAnimationFrame(()=>{this._form&&this._form.data!==e&&(this._form.data=e)})}_syncFormData(){if(this._form&&!this._updating&&this._hass)try{this._updating=!0,this._form.hass=this._hass;let t=this._normalizeConfig(this._config||{}),o;try{o=JSON.parse(JSON.stringify(t))}catch(e){o={...t}}this._form.data=o}catch(t){console.error("Erro ao sincronizar dados do form:",t,this._config)}finally{setTimeout(()=>{this._updating=!1},50)}}_buildSchema(){return[{name:"api_key",label:"Google Maps API Key",required:!0,selector:{text:{}}},{name:"follow_entity",label:"Entidade para seguir (booleana, opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"modo_noturno",label:"Entidade modo noturno (opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"transito",label:"Entidade transito (opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"transito_on",label:"Transito ligado (sem entidade)",selector:{boolean:{}}},{name:"mostrar_menu",label:"Mostrar menu superior (opcional)",selector:{boolean:{}}},{name:"mostrar_tipo_mapa",label:"Mostrar bot\xF5es Mapa/Sat\xE9lite (opcional)",selector:{boolean:{}}},{name:"mostrar_tela_cheia",label:"Mostrar bot\xE3o tela cheia (opcional)",selector:{boolean:{}}},{name:"mostrar_controles_navegacao",label:"Mostrar controles de navega\xE7\xE3o (opcional)",selector:{boolean:{}}},{name:"ocultar_creditos",label:"Ocultar cr\xE9ditos/termos do mapa (opcional)",selector:{boolean:{}}},{name:"historico_somente_rastro",label:"Hist\xF3rico: carregar s\xF3 se rastro ativo",selector:{boolean:{}}},{name:"historico_carregar_no_start",label:"Hist\xF3rico: carregar ao iniciar",selector:{boolean:{}}},{name:"historico_recarregar",label:"Hist\xF3rico: recarregar ao alterar config",selector:{boolean:{}}},{name:"historico_limite_pontos",label:"Hist\xF3rico: limite de pontos (opcional)",selector:{number:{min:10,max:1e4,step:10}}},{name:"modo_noturno_on",label:"Modo noturno ligado (sem entidade)",selector:{boolean:{}}},{name:"seguir_on",label:"Seguir ligado (sem entidade)",selector:{boolean:{}}},{name:"ajuste_zoom_seguir",label:"Ajuste do zoom ao seguir (+ aproxima, - afasta)",selector:{number:{min:-10,max:10,step:1}}},{name:"rotacao_on",label:"Rota\xE7\xE3o ligada (sem menu)",selector:{boolean:{}}},{name:"prever_movimento",label:"Suavizar e prever movimento do carro",selector:{boolean:{}}},{name:"tipo_mapa",label:"Tipo de mapa (opcional)",selector:{select:{options:[{label:"Mapa",value:"roadmap"},{label:"Sat\xE9lite",value:"satellite"},{label:"H\xEDbrido",value:"hybrid"},{label:"Terreno",value:"terrain"}]}}},{name:"max_height",label:"Altura m\xE1xima do mapa em pixels (opcional)",selector:{number:{min:100,max:2e3,step:10,unit_of_measurement:"px"}}},{name:"max_width",label:"Largura m\xE1xima do mapa em pixels (opcional)",selector:{number:{min:100,max:2e3,step:10,unit_of_measurement:"px"}}},{name:"entities",label:"Entidades",selector:{object:{multiple:!0,label_field:"entity",fields:{entity:{label:"Entidade",required:!0,selector:{entity:{}}},name:{label:"Nome personalizado (opcional)",selector:{text:{}}},image:{label:"Imagem (opcional)",selector:{text:{}}},image_rotated:{label:"Imagem Rotacionada (opcional, beta)",selector:{text:{}}},rastro:{label:"Rastro (opcional)",selector:{boolean:{}}},rastro_duracao_min:{label:"Rastro: dura\xE7\xE3o em minutos (opcional)",selector:{number:{min:1,max:1440,step:1,unit_of_measurement:"min"}}},rastro_pontos_por_min:{label:"Rastro: pontos por minuto (opcional)",selector:{number:{min:1,max:120,step:1}}},rastro_max_pontos:{label:"Rastro: m\xE1ximo de pontos (opcional)",selector:{number:{min:10,max:1e4,step:10}}},rastro_cor:{label:"Rastro: cor (opcional)",selector:{color_rgb:{}}},velocidade:{label:"Sensor de velocidade (opcional)",selector:{entity:{}}},altitude:{label:"Sensor de altitude (opcional)",selector:{entity:{}}},condition:{label:"Condicao (opcional)",selector:{entity:{domain:"input_boolean"}}}}}}}]}_normalizeConfig(t){if(!t||typeof t!="object")return{api_key:"",follow_entity:"",max_height:null,max_width:null,entities:[]};try{let o=A(t.entities||[]),e={api_key:t.api_key||"",follow_entity:t.follow_entity||"",modo_noturno:t.modo_noturno||"",transito:t.transito||"",mostrar_menu:t.mostrar_menu!==!1,mostrar_tipo_mapa:t.mostrar_tipo_mapa!==!1,tipo_mapa:t.tipo_mapa||"roadmap",mostrar_tela_cheia:t.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:t.mostrar_controles_navegacao!==!1,ocultar_creditos:t.ocultar_creditos===!0,transito_on:t.transito_on===!0,modo_noturno_on:t.modo_noturno_on===!0,seguir_on:t.seguir_on===!0,ajuste_zoom_seguir:Number.isFinite(Number(t.ajuste_zoom_seguir))?Number(t.ajuste_zoom_seguir):0,rotacao_on:t.rotacao_on===!0,prever_movimento:t.prever_movimento!==!1,historico_somente_rastro:t.historico_somente_rastro!==!1,historico_carregar_no_start:t.historico_carregar_no_start!==!1,historico_recarregar:t.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(t.historico_limite_pontos)?t.historico_limite_pontos:null,max_height:t.max_height||null,max_width:t.max_width||null,entities:o};return Object.keys(t).forEach(i=>{e.hasOwnProperty(i)||(e[i]=t[i])}),e}catch(o){return console.error("Erro ao normalizar configura\xE7\xE3o:",o,t),{api_key:t.api_key||"",follow_entity:t.follow_entity||"",modo_noturno:t.modo_noturno||"",transito:t.transito||"",mostrar_menu:t.mostrar_menu!==!1,mostrar_tipo_mapa:t.mostrar_tipo_mapa!==!1,tipo_mapa:t.tipo_mapa||"roadmap",mostrar_tela_cheia:t.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:t.mostrar_controles_navegacao!==!1,ocultar_creditos:t.ocultar_creditos===!0,transito_on:t.transito_on===!0,modo_noturno_on:t.modo_noturno_on===!0,seguir_on:t.seguir_on===!0,ajuste_zoom_seguir:Number.isFinite(Number(t.ajuste_zoom_seguir))?Number(t.ajuste_zoom_seguir):0,rotacao_on:t.rotacao_on===!0,historico_somente_rastro:t.historico_somente_rastro!==!1,historico_carregar_no_start:t.historico_carregar_no_start!==!1,historico_recarregar:t.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(t.historico_limite_pontos)?t.historico_limite_pontos:null,max_height:t.max_height||null,max_width:t.max_width||null,entities:Array.isArray(t.entities)?t.entities:[]}}}_dispatchConfigChanged(t){if(!(!t||typeof t!="object"))try{let o=this._normalizeConfig(t);this._config=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}catch(o){console.error("Erro ao despachar mudan\xE7a de configura\xE7\xE3o:",o),this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}}};customElements.get("google-maps-car-card-cadu")||customElements.define("google-maps-car-card-cadu",S);customElements.get("google-maps-car-card-cadu-editor")||customElements.define("google-maps-car-card-cadu-editor",z);S.getConfigElement=function(){return document.createElement("google-maps-car-card-cadu-editor")};S.getStubConfig=function(){return{api_key:"",follow_entity:"",entities:[]}};window.customCards=window.customCards||[];window.customCards.push({type:"google-maps-car-card-cadu",name:"Google Maps Car Card Cadu",description:"Exibe dispositivos no Google Maps com InfoBox personalizado."});var K=["entity","name","icon","show_state","show_condition","position","decimals","background_color","background_color_opacity","border_width","border_color","text_color","tap_action"];function N(r){var i;if(!r)return"";let t=s=>Math.max(0,Math.min(255,Number(s)||0)),o=s=>t(s).toString(16).padStart(2,"0"),e=s=>{if(s==null||s==="")return null;let a=Number(s);return Number.isFinite(a)?a>1?Math.max(0,Math.min(1,a/100)):Math.max(0,Math.min(1,a)):null};if(Array.isArray(r)&&r.length>=3){let[s,a,l]=r;return`#${o(s)}${o(a)}${o(l)}`}if(typeof r=="object"){let s=e((i=r.alpha)!=null?i:r.opacity),a=r.color;if(!a&&["r","g","b"].every(l=>l in r)&&(a={r:r.r,g:r.g,b:r.b}),Array.isArray(a)&&a.length>=3){let[l,n,c]=a;return s===null?`#${o(l)}${o(n)}${o(c)}`:`rgba(${t(l)}, ${t(n)}, ${t(c)}, ${s})`}if(a&&typeof a=="object"){let{r:l,g:n,b:c}=a;return s===null?`#${o(l)}${o(n)}${o(c)}`:`rgba(${t(l)}, ${t(n)}, ${t(c)}, ${s})`}}if(typeof r=="string"&&r.trim()!==""){let s=r.trim(),a=s.match(/^#([0-9a-fA-F]{8})$/);if(a){let l=a[1],n=parseInt(l.slice(0,2),16),c=parseInt(l.slice(2,4),16),u=parseInt(l.slice(4,6),16),m=parseInt(l.slice(6,8),16)/255;return`rgba(${n}, ${c}, ${u}, ${m})`}return s}return""}function J(r){if(!r||typeof r!="object"||Array.isArray(r))return{entity:"",name:"",icon:"",show_state:!1,show_condition:"",position:"bottom",decimals:1,background_color:"",background_color_opacity:null,border_width:0,border_color:"",text_color:"",tap_action:{}};try{let t=Object.keys(r).filter(s=>/^\d+$/.test(s)),o=r.background_color_opacity,e=r.border_width,i={entity:r.entity||"",name:r.name||"",icon:r.icon||"",show_state:r.show_state===!0,show_condition:typeof r.show_condition=="string"?r.show_condition:"",position:r.position||"bottom",decimals:Number.isFinite(r.decimals)?r.decimals:1,background_color:N(r.background_color),background_color_opacity:o!=null&&Number.isFinite(Number(o))?Math.max(0,Math.min(100,Number(o))):null,border_width:e!=null&&Number.isFinite(Number(e))?Math.max(0,Math.min(2,Number(e))):0,border_color:N(r.border_color),text_color:N(r.text_color),tap_action:r.tap_action||{}};return Object.keys(r).forEach(s=>{!/^\d+$/.test(s)&&i[s]===void 0&&(i[s]=r[s])}),t.length>0&&t.forEach(s=>{let a=Number(s);if(isNaN(a)||a<0||a>=K.length)return;let l=K[a];l&&i[l]===""&&r[s]&&(i[l]=r[s])}),i}catch(t){console.error("Erro ao normalizar entidade:",t,r);let o=r.background_color_opacity,e=r.border_width;return{entity:r.entity||"",name:r.name||"",icon:r.icon||"",show_state:r.show_state===!0,show_condition:typeof r.show_condition=="string"?r.show_condition:"",position:r.position||"bottom",decimals:Number.isFinite(r.decimals)?r.decimals:1,background_color:N(r.background_color),background_color_opacity:o!=null&&Number.isFinite(Number(o))?Math.max(0,Math.min(100,Number(o))):null,border_width:e!=null&&Number.isFinite(Number(e))?Math.max(0,Math.min(2,Number(e))):0,border_color:N(r.border_color),text_color:N(r.text_color),tap_action:r.tap_action||{},...r}}}function j(r,t){if(!r||typeof r!="string")return r||"";let o=Number(t);if(!Number.isFinite(o))return r;let e=Math.max(0,Math.min(1,o/100)),i=n=>Math.max(0,Math.min(255,Number(n)||0)),s=r.match(/^#([0-9a-fA-F]{6})$/);if(s){let n=s[1];return`rgba(${parseInt(n.slice(0,2),16)}, ${parseInt(n.slice(2,4),16)}, ${parseInt(n.slice(4,6),16)}, ${e})`}let a=r.match(/^#([0-9a-fA-F]{8})$/);if(a){let n=a[1];return`rgba(${parseInt(n.slice(0,2),16)}, ${parseInt(n.slice(2,4),16)}, ${parseInt(n.slice(4,6),16)}, ${e})`}let l=r.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/);return l?`rgba(${l[1]}, ${l[2]}, ${l[3]}, ${e})`:r}function G(r){if(Array.isArray(r))return r.filter(t=>t!=null).map(t=>{try{return J(typeof t=="string"?{entity:t}:t)}catch(o){return console.error("Erro ao normalizar entidade:",o,t),t}});if(r&&typeof r=="object"){let o=Object.keys(r).filter(e=>/^\d+$/.test(e)).sort((e,i)=>Number(e)-Number(i)).map(e=>r[e]);if(o.length>0)return G(o)}return[]}function L(r){if(!r||typeof r!="object")return{title:"",title_icon:"",title_secondary:"",subtitle:"",image:"",image_media_content_id:"",image_entity:"",aspect_ratio:"1.5",fit_mode:"cover",camera_view:"auto",tap_action:{action:"more-info"},entities:[]};try{let t=a=>typeof a=="string"?a:a&&typeof a=="object"&&(a.icon||a.value)||"",o=G(r.entities||[]),e="";r.image&&typeof r.image=="object"&&(e=r.image.media_content_id||""),r.image_media_content_id&&(e=r.image_media_content_id);let i=e?{media_content_id:e}:typeof r.image=="string"?r.image:"",s={title:r.title||"",title_icon:t(r.title_icon),title_secondary:r.title_secondary||"",subtitle:r.subtitle||"",image:i,image_media_content_id:e,image_entity:r.image_entity||"",aspect_ratio:r.aspect_ratio||"1.5",fit_mode:r.fit_mode||"cover",camera_view:r.camera_view||"auto",tap_action:r.tap_action||{action:"more-info"},entities:o};return Object.keys(r).forEach(a=>{s.hasOwnProperty(a)||(s[a]=r[a])}),s}catch(t){console.error("Erro ao normalizar configura\xE7\xE3o:",t,r);let o=s=>typeof s=="string"?s:s&&typeof s=="object"&&(s.icon||s.value)||"",e="";r.image&&typeof r.image=="object"&&(e=r.image.media_content_id||""),r.image_media_content_id&&(e=r.image_media_content_id);let i=e?{media_content_id:e}:typeof r.image=="string"?r.image:"";return{title:r.title||"",title_icon:o(r.title_icon),title_secondary:r.title_secondary||"",subtitle:r.subtitle||"",image:i,image_media_content_id:e,image_entity:r.image_entity||"",aspect_ratio:r.aspect_ratio||"1.5",fit_mode:r.fit_mode||"cover",camera_view:r.camera_view||"auto",tap_action:r.tap_action||{action:"more-info"},entities:Array.isArray(r.entities)?r.entities:[]}}}var O=class r extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._styleElement=document.createElement("style"),this.shadowRoot.appendChild(this._styleElement),this._rendered=!1,this._templateCache=new Map,this._templateRequests=new Map}setConfig(t){this._config=L(t||{}),this._rendered?this._updateCard():this._hass&&this._initialRender()}set hass(t){this._hass=t,this._rendered?this._updateCard():this._config&&this._initialRender()}getCardSize(){return 3}_initialRender(){var u,m,h;if(!this.shadowRoot||!this._hass||!this._config||this._rendered)return;let t=this._parseAspectRatio((u=this._config)==null?void 0:u.aspect_ratio),o=((m=this._config)==null?void 0:m.fit_mode)||"cover";this._styleElement.textContent=`
      :host {
        display: block;
      }
      ha-card {
        border-radius: 10px;
        overflow: hidden;
      }
      .picture-wrapper {
        position: relative;
        width: 100%;
        cursor: pointer;
        border-radius: inherit;
        overflow: hidden;
      }
      .picture-spacer {
        display: block;
        padding-top: calc(100% / var(--po-aspect-ratio));
      }
      .picture-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: var(--po-fit-mode);
      }
      .overlay {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 10px 12px;
        gap: 12px;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 0 0 6px 6px;
        pointer-events: none;
        transition: background 0.2s ease-in-out;
      }
      .overlay-top {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
        padding: 8px 12px;
        pointer-events: none;
      }
      .overlay-title-container {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .overlay-title {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
      }
      .overlay-title ha-icon {
        --mdc-icon-size: 18px;
      }
      .overlay-title-secondary {
        color: rgba(255, 255, 255, 0.9);
        font-size: 13px;
        font-weight: 400;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        margin-left: 4px;
      }
      .overlay-subtitle {
        color: rgba(255, 255, 255, 0.85);
        font-size: 13px;
        font-weight: 400;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      }
      .overlay-entities {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
      }
      .overlay-entity {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.25);
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        pointer-events: auto;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
      }
      .overlay-entity:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: scale(1.02);
      }
      .overlay-entity:active {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0.98);
      }
      .picture-wrapper:hover .overlay {
        background: rgba(0, 0, 0, 0.5);
      }
      .overlay-entity ha-icon,
      .overlay-entity ha-state-icon {
        --mdc-icon-size: 18px;
      }
      .picture-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        font-size: 14px;
      }
    `;let e=document.createElement("ha-card"),i=document.createElement("div");i.className="picture-wrapper",i.style.setProperty("--po-aspect-ratio",String(t)),i.style.setProperty("--po-fit-mode",o),i.addEventListener("click",()=>{var d;this._handleAction((d=this._config)==null?void 0:d.tap_action,this._getPrimaryEntityId())});let s=document.createElement("div");s.className="picture-spacer",i.appendChild(s);let a=document.createElement("img");a.className="picture-image",a.alt=((h=this._config)==null?void 0:h.title)||"Imagem",a.loading="eager",a.decoding="async",i.appendChild(a);let l=document.createElement("div");l.className="picture-placeholder",l.textContent="Configure image ou image_entity",l.style.display="none",i.appendChild(l);let n=document.createElement("div");n.className="overlay-top",i.appendChild(n);let c=document.createElement("div");c.className="overlay",i.appendChild(c),e.appendChild(i),this.shadowRoot.appendChild(e),this._elements={card:e,pictureWrapper:i,img:a,placeholder:l,overlayTop:n,overlay:c},this._rendered=!0,this._updateCard()}_updateCard(){var c,u;if(!this._rendered||!this._elements)return;let{img:t,placeholder:o,overlayTop:e,overlay:i}=this._elements,s=this._getImageUrl(),a=!!((c=this._config)!=null&&c.image_entity),l=((u=this._config)==null?void 0:u.image_entity)||"",n=(s||"")!==(t.src||"");if(a&&!s){let m=this._getImageEntityCache(l);m?(t.src=m,t.style.display="block",o.style.display="none"):(t.src="",t.style.display="none",o.textContent="Carregando imagem\u2026",o.style.display="flex")}else if(n)if(s){let m=t.src&&t.complete&&t.naturalWidth>0,h=a?this._getImageEntityCache(l):null,d=()=>a&&this._saveImageEntityCache(l,s),p=()=>{t.style.display="block",o.style.display="none",d()};if(a&&h)if(t.onload=null,t.onerror=null,t.src=h,t.style.display="block",o.style.display="none",h!==s&&this._pendingImageUrl!==s){this._pendingImageUrl=s;let f=new Image;f.onload=()=>{var b;this._pendingImageUrl===s&&((b=this._elements)!=null&&b.img)&&(this._elements.img.src=s,p()),this._pendingImageUrl=null},f.onerror=()=>{this._pendingImageUrl=null},f.src=s}else h===s&&(t.complete&&t.naturalWidth?d():t.onload=d);else if(a&&m&&this._pendingImageUrl!==s){this._pendingImageUrl=s;let f=new Image;f.onload=()=>{var b;this._pendingImageUrl===s&&((b=this._elements)!=null&&b.img)&&(this._elements.img.src=s,p()),this._pendingImageUrl=null},f.onerror=()=>{this._pendingImageUrl=null},f.src=s}else a&&m||(t.onload=null,t.onerror=null,a?(o.textContent="Carregando imagem\u2026",o.style.display="flex",t.style.display="none",t.onload=()=>{o.style.display="none",t.style.display="block",d()},t.onerror=()=>{o.textContent="Erro ao carregar imagem",o.style.display="flex",t.style.display="none"}):(o.style.display="none",t.style.display="block"),t.src=s,a&&t.complete&&t.naturalWidth&&(o.style.display="none",t.style.display="block",d()))}else this._pendingImageUrl=null,t.src="",t.style.display="none",o.textContent="Configure image ou image_entity",o.style.display="flex";this._updateOverlayTop(e),this._updateOverlayBottom(i)}_isEntityVisible(t){let o=t==null?void 0:t.show_condition;if(!o||typeof o!="string"||o.trim()==="")return!0;let e=this._renderTemplate(o),i=String(e).trim().toLowerCase();return!(i===""||i==="false"||i==="no"||i==="0")}_updateOverlayTop(t){let e=this._getOverlayEntityConfigs().filter(i=>(i.position||"bottom")==="top").filter(i=>this._isEntityVisible(i));t.innerHTML="",e.length!==0&&e.forEach(i=>{let s=document.createElement("div");s.className="overlay-entity";let a=i.background_color||"rgba(255, 255, 255, 0.25)",l=i.background_color_opacity!=null?j(a,i.background_color_opacity):a,n=i.text_color||"#fff";s.style.background=l,s.style.color=n;let c=Number(i.border_width);c>0&&(s.style.borderWidth=`${c}px`,s.style.borderStyle="solid",s.style.borderColor=i.border_color||"rgba(255,255,255,0.5)"),s.addEventListener("click",m=>{var d;m.stopPropagation();let h=i.tap_action||((d=this._config)==null?void 0:d.tap_action);this._handleAction(h,i.entity)});let u=this._createEntityIcon(i);if(this._applyEntityIconOnOffColor(u,i.entity),s.appendChild(u),i.show_state===!0){let m=document.createElement("div");m.textContent=this._getEntityState(i.entity,i),s.appendChild(m)}t.appendChild(s)})}_updateOverlayBottom(t){var n,c,u,m;let o=((n=this._config)==null?void 0:n.title)||"",e=((c=this._config)==null?void 0:c.title_secondary)||"",i=this._renderTemplate(((u=this._config)==null?void 0:u.subtitle)||""),s=((m=this._config)==null?void 0:m.title_icon)||"",l=this._getOverlayEntityConfigs().filter(h=>(h.position||"bottom")==="bottom").filter(h=>this._isEntityVisible(h));if(t.innerHTML="",t.style.display=o||i||l.length>0?"flex":"none",o||i){let h=document.createElement("div");if(h.className="overlay-title-container",o){let d=document.createElement("div");if(d.className="overlay-title",s){let f=document.createElement("ha-icon");f.icon=s,d.appendChild(f)}let p=document.createElement("span");if(p.textContent=o,d.appendChild(p),e){let f=document.createElement("span");f.className="overlay-title-secondary",f.textContent=e,d.appendChild(f)}h.appendChild(d)}if(i){let d=document.createElement("div");d.className="overlay-subtitle",d.textContent=i,s?d.style.paddingLeft="24px":d.style.paddingLeft="0",h.appendChild(d)}t.appendChild(h)}else{let h=document.createElement("div");h.style.flex="1",t.appendChild(h)}if(l.length>0){let h=document.createElement("div");h.className="overlay-entities",l.forEach(d=>{let p=document.createElement("div");p.className="overlay-entity";let f=d.background_color||"rgba(255, 255, 255, 0.25)",b=d.background_color_opacity!=null?j(f,d.background_color_opacity):f,v=d.text_color||"#fff";p.style.background=b,p.style.color=v;let g=Number(d.border_width);g>0&&(p.style.borderWidth=`${g}px`,p.style.borderStyle="solid",p.style.borderColor=d.border_color||"rgba(255,255,255,0.5)"),p.addEventListener("click",y=>{var w;y.stopPropagation();let E=d.tap_action||((w=this._config)==null?void 0:w.tap_action);this._handleAction(E,d.entity)});let x=this._createEntityIcon(d);if(this._applyEntityIconOnOffColor(x,d.entity),p.appendChild(x),d.show_state===!0){let y=document.createElement("div");y.textContent=this._getEntityState(d.entity,d),p.appendChild(y)}h.appendChild(p)}),t.appendChild(h)}}_renderTemplate(t){if(!t||typeof t!="string")return"";if(!t.includes("{%")&&!t.includes("{{"))return t;try{if(!this._hass||!this._hass.connection)return"";let o=Date.now(),e=this._templateCache.get(t);if(e&&o-e.ts<1e3)return e.value;if(!this._templateRequests.has(t)){let i=this._hass.connection.subscribeMessage(s=>{let a=(s==null?void 0:s.result)||"";this._templateCache.set(t,{value:String(a),ts:Date.now()}),this._templateRequests.delete(t),i&&i(),requestAnimationFrame(()=>this._updateCard())},{type:"render_template",template:t});this._templateRequests.set(t,i)}return e?e.value:""}catch(o){return console.warn("Erro ao renderizar template:",o),""}}_parseAspectRatio(t){if(!t||typeof t!="string")return 1.5;let o=t.trim();if(o.includes(":")){let[i,s]=o.split(":").map(a=>Number(a));if(Number.isFinite(i)&&Number.isFinite(s)&&i>0&&s>0)return i/s}let e=Number(o);return Number.isFinite(e)&&e>0?e:1.5}_getImageUrl(){var o,e,i,s,a,l;let t="";if((o=this._config)!=null&&o.image)typeof this._config.image=="string"?t=this._config.image:typeof this._config.image=="object"&&(t=this._config.image.media_content_id||"");else{let n=(e=this._config)==null?void 0:e.image_entity;if(n&&this._hass){let c=(i=this._hass.states)==null?void 0:i[n];if(c)if(((s=this._config)==null?void 0:s.camera_view)==="live"&&n.startsWith("camera.")){let u=`/api/camera_proxy_stream/${n}`;t=this._resolveUrl(u)||u}else t=((a=c.attributes)==null?void 0:a.entity_picture)||((l=c.attributes)==null?void 0:l.image)||(typeof c.state=="string"?c.state:"")}}return this._resolveUrl(t)||t}_resolveUrl(t){if(!t||typeof t!="string")return"";let o=t.trim();return o.startsWith("/")&&this._hass&&typeof this._hass.hassUrl=="function"?this._hass.hassUrl(o):o}static _imageCacheKey(t){return"picture-overview-cadu-img-"+(t||"")}_getImageEntityCache(t){if(!t||typeof t!="string")return null;try{return localStorage.getItem(r._imageCacheKey(t))||null}catch(o){return null}}_saveImageEntityCache(t,o){if(!(!t||typeof t!="string"||!o))try{localStorage.setItem(r._imageCacheKey(t),String(o))}catch(e){}}_getPrimaryEntityId(){var o;let t=Array.isArray((o=this._config)==null?void 0:o.entities)?this._config.entities:[];return t.length>0?t[0].entity:null}_getOverlayEntityConfigs(){var o;return Array.isArray((o=this._config)==null?void 0:o.entities)?this._config.entities:[]}_getEntityName(t){var e,i,s;if(t!=null&&t.name)return t.name;let o=(i=(e=this._hass)==null?void 0:e.states)==null?void 0:i[t.entity];return((s=o==null?void 0:o.attributes)==null?void 0:s.friendly_name)||t.entity}_createEntityIcon(t){var s,a;let o=t==null?void 0:t.icon,e=(a=(s=this._hass)==null?void 0:s.states)==null?void 0:a[t.entity];if(e){let l=document.createElement("ha-state-icon");if(l.hass=this._hass,l.stateObj=e,o&&o!=="")l.icon=o;else{let n=this._getEntityIconFromState(e);n&&(l.icon=n)}return l}let i=document.createElement("ha-icon");return i.icon=o&&o!==""?o:"mdi:checkbox-blank-circle-outline",i}_getEntityIconFromState(t){var i,s;if(!t)return"";let o=(i=t.attributes)==null?void 0:i.icon;return o||(((s=t.attributes)==null?void 0:s.device_class)==="temperature"?"mdi:thermometer":"")}_applyEntityIconOnOffColor(t,o){var s,a;if(!t||!o||!((a=(s=this._hass)==null?void 0:s.states)!=null&&a[o]))return;let e=this._hass.states[o],i=String(e.state||"").toLowerCase();i==="on"?t.style.color="var(--state-icon-active-color, var(--state-active-color, #fdd835))":i==="off"||i==="unavailable"?t.style.color="var(--state-icon-inactive-color, var(--state-inactive-color, #9e9e9e))":t.style.color=""}_getEntityState(t,o=null){var n,c,u;let e=(c=(n=this._hass)==null?void 0:n.states)==null?void 0:c[t];if(!e)return"unavailable";let i=(u=e.attributes)==null?void 0:u.unit_of_measurement,s=Number.isFinite(o==null?void 0:o.decimals)?o.decimals:1,a=typeof e.state=="string"?e.state.replace(",","."):e.state,l=Number.parseFloat(a);if(Number.isFinite(l)){let m=l.toFixed(s);return i?`${m} ${i}`:m}return i?`${e.state} ${i}`:e.state}_handleAction(t,o){if(!t||t.action==="none")return;let e=t.action||"more-info";if(e==="more-info"){let i=t.entity||o;i&&this._fireEvent("hass-more-info",{entityId:i});return}if(e==="navigate"&&t.navigation_path){history.pushState(null,"",t.navigation_path),window.dispatchEvent(new Event("location-changed"));return}if(e==="url"&&t.url_path){window.location.href=t.url_path;return}if(e==="toggle"&&o&&this._hass){this._hass.callService("homeassistant","toggle",{entity_id:o});return}if(e==="call-service"&&t.service&&this._hass){let[i,s]=t.service.split(".");i&&s&&this._hass.callService(i,s,t.service_data||{})}}_fireEvent(t,o){this.dispatchEvent(new CustomEvent(t,{detail:o,bubbles:!0,composed:!0}))}};var $=class extends HTMLElement{constructor(){super(),this._updating=!1}setConfig(t){this._config=L(t||{}),this._rendered&&this._hass?this._syncFormData():!this._rendered&&this._hass&&this._render()}set hass(t){this._hass=t,this._hass&&(this._rendered&&!this._updating?this._syncFormData():!this._rendered&&this._config&&this._render())}_render(){if(!this._hass)return;if(this._rendered){this._form&&(this._form.hass=this._hass);return}this._rendered=!0,this.innerHTML="";let t=document.createElement("ha-form");t.hass=this._hass;let o=L(this._config||{});o=this._ensureEntitiesArray(o),t.schema=this._buildSchema(),t.computeLabel=e=>e.label||e.name,t.data=o,t.addEventListener("value-changed",e=>{JSON.stringify(this._config)!==JSON.stringify(e.detail.value)&&(this._config=e.detail.value,this._debounce&&clearTimeout(this._debounce),this._debounce=setTimeout(()=>{this._dispatchConfigChanged(this._config)},500))}),this.appendChild(t),this._form=t}_syncFormData(){}_ensureEntitiesArray(t){if(!t||typeof t!="object"||Array.isArray(t.entities))return t;if(t.entities&&typeof t.entities=="object"){let o=Object.keys(t.entities).filter(e=>/^\d+$/.test(e)).sort((e,i)=>Number(e)-Number(i)).map(e=>t.entities[e]);return{...t,entities:o}}return{...t,entities:[]}}_buildSchema(){return[{name:"title",label:"Titulo",selector:{text:{}}},{name:"title_icon",label:"Icone do titulo (opcional)",selector:{icon:{}}},{name:"title_secondary",label:"Titulo secundario (ao lado, menor)",selector:{text:{}}},{name:"subtitle",label:"Subtitulo (opcional, aceita template jinja)",selector:{template:{}}},{name:"image",label:"Imagem (url/local)",selector:{text:{}}},{name:"image_media_content_id",label:"Imagem (media_content_id)",selector:{text:{}}},{name:"image_entity",label:"Entidade de imagem (opcional)",selector:{entity:{}}},{name:"aspect_ratio",label:"Aspect ratio (ex: 1.5 ou 16:9)",selector:{text:{}}},{name:"fit_mode",label:"Fit mode",selector:{select:{options:[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"}]}}},{name:"camera_view",label:"Camera view",selector:{select:{options:[{label:"Auto",value:"auto"},{label:"Live",value:"live"}]}}},{name:"tap_action",label:"Tap action do card",selector:{ui_action:{}}},{name:"entities",label:"Entidades",selector:{object:{multiple:!0,label_field:"entity",fields:{entity:{label:"Entidade",required:!0,selector:{entity:{}}},name:{label:"Nome (opcional)",selector:{text:{}}},icon:{label:"Icone (opcional)",selector:{icon:{}}},show_state:{label:"Mostrar estado",selector:{boolean:{}}},show_condition:{label:"Condicao (template Jinja: true exibe, false oculta)",selector:{template:{}}},position:{label:"Posicao do overlay",selector:{select:{options:[{label:"Inferior",value:"bottom"},{label:"Superior direita",value:"top"}]}}},decimals:{label:"Casas decimais (padrao 1)",selector:{number:{min:0,max:4,step:1}}},background_color:{label:"Cor de fundo",selector:{color_rgb:{}}},background_color_opacity:{label:"Opacidade do fundo (%) \u2014 0 transparente, 100 opaco",selector:{number:{min:0,max:100,step:5,unit_of_measurement:"%"}}},border_width:{label:"Borda (px) \u2014 0 sem borda, 0.1 a 2",selector:{number:{min:0,max:2,step:.1,unit_of_measurement:"px"}}},border_color:{label:"Cor da borda (opcional)",selector:{color_rgb:{}}},text_color:{label:"Cor do texto (opcional)",selector:{color_rgb:{}}},tap_action:{label:"Tap action da entidade (opcional)",selector:{ui_action:{}}}}}}}]}_dispatchConfigChanged(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}};customElements.get("picture-overview-cadu")||customElements.define("picture-overview-cadu",O);customElements.get("picture-overview-cadu-editor")||customElements.define("picture-overview-cadu-editor",$);O.getConfigElement=function(){return document.createElement("picture-overview-cadu-editor")};O.getStubConfig=function(){return{title:"Picture Overview",aspect_ratio:"1.5",fit_mode:"cover",entities:[]}};window.customCards=window.customCards||[];window.customCards.push({type:"picture-overview-cadu",name:"Picture Overview Cadu",description:"Imagem com entities e tap_action estilo picture-glance."});
