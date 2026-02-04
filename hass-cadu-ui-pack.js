var D=["entity","name","image","velocidade","altitude","condition"];function K(a){if(!a||typeof a!="object"||Array.isArray(a))return{entity:"",name:"",image:"",image_rotated:"",velocidade:"",altitude:"",condition:"",rastro:!1,rastro_duracao_min:null,rastro_pontos_por_min:null,rastro_cor:"",rastro_max_pontos:null};try{let t=Object.keys(a).filter(e=>/^\d+$/.test(e)),o={entity:a.entity||"",name:a.name||"",image:a.image||"",image_rotated:a.image_rotated||"",velocidade:a.velocidade||"",altitude:a.altitude||"",condition:a.condition||"",rastro:a.rastro===!0,rastro_duracao_min:typeof a.rastro_duracao_min=="number"?a.rastro_duracao_min:null,rastro_pontos_por_min:typeof a.rastro_pontos_por_min=="number"?a.rastro_pontos_por_min:null,rastro_cor:a.rastro_cor||"",rastro_max_pontos:typeof a.rastro_max_pontos=="number"?a.rastro_max_pontos:null};return Object.keys(a).forEach(e=>{!/^\d+$/.test(e)&&o[e]===void 0&&(o[e]=a[e])}),t.length>0&&t.forEach(e=>{let i=Number(e);if(isNaN(i)||i<0||i>=D.length)return;let r=D[i];r&&o[r]===""&&a[e]&&(o[r]=a[e])}),o}catch(t){return console.error("Erro ao normalizar entidade:",t,a),{entity:a.entity||"",name:a.name||"",image:a.image||"",image_rotated:a.image_rotated||"",velocidade:a.velocidade||"",altitude:a.altitude||"",condition:a.condition||"",rastro:a.rastro===!0,rastro_duracao_min:typeof a.rastro_duracao_min=="number"?a.rastro_duracao_min:null,rastro_pontos_por_min:typeof a.rastro_pontos_por_min=="number"?a.rastro_pontos_por_min:null,rastro_cor:a.rastro_cor||"",rastro_max_pontos:typeof a.rastro_max_pontos=="number"?a.rastro_max_pontos:null,...a}}}function L(a){return Array.isArray(a)?a.filter(t=>t&&typeof t=="object").map(t=>{try{return K(t)}catch(o){return console.error("Erro ao normalizar entidade:",o,t),t}}):[]}var k=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._styleElement=document.createElement("style"),this.shadowRoot.appendChild(this._styleElement),this.controlsContainer=document.createElement("div"),this.controlsContainer.className="map-controls",this.shadowRoot.appendChild(this.controlsContainer),this.mapContainer=document.createElement("div"),this.mapContainer.id="map",this.shadowRoot.appendChild(this.mapContainer),this.followCountdownElement=document.createElement("div"),this.followCountdownElement.className="follow-countdown",this.followCountdownElement.title="Clique para retomar o seguir";let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("class","follow-countdown-circle"),t.setAttribute("viewBox","0 0 44 44");let o=document.createElementNS("http://www.w3.org/2000/svg","circle");o.setAttribute("class","follow-countdown-bg"),o.setAttribute("cx","22"),o.setAttribute("cy","22"),o.setAttribute("r","19"),t.appendChild(o),this.followCountdownProgressCircle=document.createElementNS("http://www.w3.org/2000/svg","circle"),this.followCountdownProgressCircle.setAttribute("class","follow-countdown-progress"),this.followCountdownProgressCircle.setAttribute("cx","22"),this.followCountdownProgressCircle.setAttribute("cy","22"),this.followCountdownProgressCircle.setAttribute("r","19");let e=2*Math.PI*19;this.followCountdownProgressCircle.setAttribute("stroke-dasharray",e),this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",e),t.appendChild(this.followCountdownProgressCircle),this.followCountdownElement.appendChild(t);let i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttribute("class","follow-countdown-icon"),i.setAttribute("viewBox","0 0 24 24"),i.setAttribute("width","18"),i.setAttribute("height","18");let r=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("d","M12 2v4m0 12v4M2 12h4m12 0h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"),r.setAttribute("stroke","white"),r.setAttribute("stroke-width","2"),r.setAttribute("stroke-linecap","round"),r.setAttribute("fill","none"),i.appendChild(r),this.followCountdownElement.appendChild(i),this.followCountdownElement.addEventListener("click",s=>{s.stopPropagation(),s.preventDefault(),this._resumeFollowImmediately()}),this.shadowRoot.appendChild(this.followCountdownElement),this.markers={},this.infoBoxes={},this.lastPositions={},this.trails={},this.trailPolylines={},this._lastMapTypeOptions=null,this._lastMapControlsOptions=null,this._historyLoaded={},this._uiState={trafficEnabled:!1,nightModeEnabled:!1,followEnabled:!1,trafficOverride:!1,nightModeOverride:!1,followOverride:!1,rotateImageEnabled:!1,arrowEnabled:!0,entityVisibility:{}},this._followPausedByUser=!1,this._followResumeTimer=null,this._followResumeTime=null,this._followCountdownInterval=null,this._isPerformingProgrammaticMove=!1,this._lastProgrammaticMoveTime=null,this._optionsMenuOpen=!1,this._updateStyles()}_updateStyles(){var _,m,p,c;let t=((_=this._config)==null?void 0:_.max_height)||null,o=((m=this._config)==null?void 0:m.max_width)||null,e="450px",i="600px",r=t?`${t}px`:e,s=t?`${t}px`:i,n=o?`max-width: ${o}px;`:"",l=((p=this._config)==null?void 0:p.mostrar_menu)!==!1,d=((c=this._config)==null?void 0:c.ocultar_creditos)===!0;this._styleElement.textContent=`
      :host {
        display: block;
        position: relative;
        ${n}
      }
      #map {
        width: 100%;
        height: ${r};
        border-radius: 0 0 6px 6px;
        overflow: hidden;
      }

      @media (min-width: 768px) {
        #map {
          height: ${s};
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
        ${l?"":"display: none;"}
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
      ${d?`
      /* Oculta barra inferior/termos/creditos do Google Maps */
      .gm-style-cc,
      .gmnoprint,
      .gm-style a[href^="https://maps.google.com/maps"],
      .gm-style a[href^="https://www.google.com/intl/"],
      .gm-style .gm-style-cc {
        display: none !important;
      }`:""}
    `}_getStorageKey(){return!this._config||!this._config.entities?"google-maps-car-card-cadu-default":`google-maps-car-card-cadu-${this._config.entities.map(o=>o.entity).sort().join(",")}`}_loadUIState(){try{let t=this._getStorageKey(),o=localStorage.getItem(t);if(o){let e=JSON.parse(o);e&&typeof e=="object"&&(this._uiState={trafficEnabled:e.trafficEnabled===!0,nightModeEnabled:e.nightModeEnabled===!0,followEnabled:e.followEnabled===!0,trafficOverride:e.trafficOverride===!0,nightModeOverride:e.nightModeOverride===!0,followOverride:e.followOverride===!0,rotateImageEnabled:e.rotateImageEnabled===!0,arrowEnabled:e.arrowEnabled!==!1,entityVisibility:e.entityVisibility||{}})}}catch(t){console.error("Erro ao carregar estado do UI do localStorage:",t)}}_saveUIState(){try{let t=this._getStorageKey();localStorage.setItem(t,JSON.stringify(this._uiState))}catch(t){console.error("Erro ao salvar estado do UI no localStorage:",t)}}async _loadHistoryForEntities(){var o;if(!this._hass||!((o=this._config)!=null&&o.entities))return;let t=Date.now();for(let e of this._config.entities){let i=e.entity;if(!i||this._config.historico_somente_rastro!==!1&&e.rastro!==!0||this._historyLoaded[i]===!0)continue;this._historyLoaded[i]=!0;let r=Number.isFinite(e.rastro_duracao_min)?e.rastro_duracao_min:60,s=new Date(t-r*60*1e3).toISOString();try{let n=await this._hass.callApi("GET",`history/period/${s}?filter_entity_id=${i}&significant_changes_only=0`),l=Array.isArray(n)?n[0]:[],d=[];Array.isArray(l)&&l.forEach(c=>{var g,v;let f=(g=c==null?void 0:c.attributes)==null?void 0:g.latitude,u=(v=c==null?void 0:c.attributes)==null?void 0:v.longitude;if(typeof f=="number"&&typeof u=="number"){let y=new Date(c.last_updated||c.last_changed||c.timestamp).getTime();d.push({lat:f,lng:u,ts:y})}}),d.sort((c,f)=>c.ts-f.ts);let _=Number.isFinite(this._config.historico_limite_pontos)?this._config.historico_limite_pontos:null,m=_?this._sampleHistoryPoints(d,_):d;this.trails[i]=m;let p=this._findLastSignificantRotation(m);if(p!==null){let c=m[m.length-1];this.lastPositions[i]={lat:c.lat,lng:c.lng,rotation:p}}this._renderTrail(i,e)}catch(n){console.error("Erro ao carregar hist\xF3rico do HA:",n,i)}}}_getTrailConfig(t){return{enabled:t.rastro===!0,durationMin:Number.isFinite(t.rastro_duracao_min)?t.rastro_duracao_min:60,maxPerMin:Number.isFinite(t.rastro_pontos_por_min)?t.rastro_pontos_por_min:10,color:this._normalizeTrailColor(t.rastro_cor),maxPoints:Number.isFinite(t.rastro_max_pontos)?t.rastro_max_pontos:600}}_normalizeTrailColor(t){if(Array.isArray(t)&&t.length>=3){let[o,e,i]=t,r=s=>Math.max(0,Math.min(255,Number(s)||0)).toString(16).padStart(2,"0");return`#${r(o)}${r(e)}${r(i)}`}return typeof t=="string"&&t.trim()!==""?t.trim():"#00aaff"}_sampleHistoryPoints(t,o){if(!Array.isArray(t)||t.length<=o)return t;let e=Math.ceil(t.length/o),i=[];for(let s=0;s<t.length;s+=e)i.push(t[s]);let r=t[t.length-1];return i[i.length-1]!==r&&i.push(r),i}_findLastSignificantRotation(t){if(!Array.isArray(t)||t.length<2)return null;for(let o=t.length-1;o>0;o-=1){let e=t[o],i=t[o-1],r=e.lng-i.lng,s=e.lat-i.lat;if(Math.abs(r)>1e-5||Math.abs(s)>1e-5)return Math.atan2(s,r)*(180/Math.PI)}return null}_pruneTrail(t,o,e){let i=Date.now(),r=t.filter(s=>i-s.ts<=o);return r.length>e&&(r=r.slice(r.length-e)),r}_reduceTrailDensity(t,o){let e=Date.now(),i=t.slice(),r=n=>n.filter(l=>e-l.ts<=6e4).length,s=0;for(;r(i)>o&&i.length>2&&s<5;)i=i.filter((n,l)=>l%2===0||l===i.length-1),s+=1;return i}_recordTrailPoint(t,o,e){let i=this._getTrailConfig(e),r=Array.isArray(this.trails[t])?this.trails[t]:[],s=r[r.length-1],n=s?Math.abs(o.lng()-s.lng):1/0,l=s?Math.abs(o.lat()-s.lat):1/0;if(s&&n<=1e-5&&l<=1e-5)return;let d=r.concat([{lat:o.lat(),lng:o.lng(),ts:Date.now()}]),_=i.durationMin*60*1e3,m=this._pruneTrail(d,_,i.maxPoints);m=this._reduceTrailDensity(m,i.maxPerMin),this.trails[t]=m}_clearTrail(t){let o=this.trailPolylines[t];Array.isArray(o)&&o.forEach(e=>e.setMap(null)),delete this.trailPolylines[t]}_renderTrail(t,o){let e=this._getTrailConfig(o);if(!e.enabled){this._clearTrail(t);return}let i=this.trails[t];if(!Array.isArray(i)||i.length<2){this._clearTrail(t);return}this._clearTrail(t);let r=[],s=.9,n=.1,l=i.length-1;for(let d=1;d<i.length;d++){let _=d/l,m=n+_*(s-n),p=new google.maps.Polyline({path:[{lat:i[d-1].lat,lng:i[d-1].lng},{lat:i[d].lat,lng:i[d].lng}],geodesic:!0,strokeColor:e.color,strokeOpacity:m,strokeWeight:3,map:this._map});r.push(p)}this.trailPolylines[t]=r}set hass(t){this._hass=t,this._map&&this._config&&(this._updateMap(),this._applyMapTypeOptions(),this._applyNightMode(),this._toggleTrafficLayer())}setConfig(t){try{let o=this._normalizeConfig(t||{});if(this._config=o,(!this._config.entities||!this._config.api_key)&&console.warn("Configuracao incompleta: api_key ou entities ausentes"),this._config={...this._config,transito:typeof this._config.transito=="string"?this._config.transito:null,modo_noturno:typeof this._config.modo_noturno=="string"?this._config.modo_noturno:null,follow_entity:typeof this._config.follow_entity=="string"?this._config.follow_entity:null,rotate_image:this._config.rotate_image===!0,mostrar_menu:this._config.mostrar_menu!==!1,mostrar_tipo_mapa:this._config.mostrar_tipo_mapa!==!1,tipo_mapa:typeof this._config.tipo_mapa=="string"?this._config.tipo_mapa:"roadmap",mostrar_tela_cheia:this._config.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:this._config.mostrar_controles_navegacao!==!1,ocultar_creditos:this._config.ocultar_creditos===!0,transito_on:this._config.transito_on===!0,modo_noturno_on:this._config.modo_noturno_on===!0,seguir_on:this._config.seguir_on===!0,rotacao_on:this._config.rotacao_on===!0,historico_somente_rastro:this._config.historico_somente_rastro!==!1,historico_carregar_no_start:this._config.historico_carregar_no_start!==!1,historico_recarregar:this._config.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(this._config.historico_limite_pontos)?this._config.historico_limite_pontos:null},this._loadUIState(),this._uiState.trafficEnabled===void 0&&(this._uiState.trafficEnabled=!1),this._uiState.nightModeEnabled===void 0&&(this._uiState.nightModeEnabled=!1),this._uiState.followEnabled===void 0&&(this._uiState.followEnabled=!1),this._uiState.trafficOverride===void 0&&(this._uiState.trafficOverride=!1),this._uiState.nightModeOverride===void 0&&(this._uiState.nightModeOverride=!1),this._uiState.followOverride===void 0&&(this._uiState.followOverride=!1),this._uiState.rotateImageEnabled===void 0&&(this._uiState.rotateImageEnabled=!1),this._uiState.arrowEnabled===void 0&&(this._uiState.arrowEnabled=!0),this._config.mostrar_menu===!1&&(this._config.transito||(this._uiState.trafficEnabled=this._config.transito_on===!0),this._config.modo_noturno||(this._uiState.nightModeEnabled=this._config.modo_noturno_on===!0),this._config.follow_entity||(this._uiState.followEnabled=this._config.seguir_on===!0),this._uiState.rotateImageEnabled=this._config.rotacao_on===!0),this._initializeEntityVisibility(),this._updateStyles(),this._map&&this.controlsContainer&&(this._renderControls(),requestAnimationFrame(()=>{this._applyNightMode(),this._toggleTrafficLayer(),this._applyMapTypeOptions(),this._applyMapControlsOptions()})),this._map&&this._config.historico_recarregar===!0&&(this._historyLoaded={},this._loadHistoryForEntities()),!this._config.api_key){this.mapContainer.innerHTML='<div style="padding: 20px; color: white;">Configure a API Key do Google Maps</div>';return}if(!window.google||!window.google.maps){let e=document.createElement("script");e.src=`https://maps.googleapis.com/maps/api/js?key=${this._config.api_key}`,e.onload=()=>{this._initializeMap()},document.head.appendChild(e)}else this._initializeMap()}catch(o){console.error("Erro ao definir configura\xE7\xE3o no card:",o)}}_normalizeConfig(t){if(!t||typeof t!="object")return{api_key:"",follow_entity:"",entities:[]};try{let o=L(t.entities||[]);return{...t,entities:o}}catch(o){return t}}_applyMapTypeOptions(){if(!this._map)return;let t=this._config.tipo_mapa||"roadmap",o=this._config.mostrar_tipo_mapa!==!1,e=`${t}|${o}`;this._lastMapTypeOptions!==e&&(this._lastMapTypeOptions=e,this._map.setOptions({mapTypeId:t,mapTypeControl:o}))}_applyMapControlsOptions(){if(!this._map)return;let t=this._config.mostrar_tela_cheia!==!1,o=this._config.mostrar_controles_navegacao!==!1,e=`${t}|${o}`;this._lastMapControlsOptions!==e&&(this._lastMapControlsOptions=e,this._map.setOptions({fullscreenControl:t,zoomControl:o}))}getCardSize(){return 6}_initializeMap(){this.mapContainer&&(this._map=new google.maps.Map(this.mapContainer,{center:{lat:-30.0277,lng:-51.2287},zoom:17,streetViewControl:!1,mapTypeControl:this._config.mostrar_tipo_mapa!==!1,mapTypeId:this._config.tipo_mapa||"roadmap",fullscreenControl:this._config.mostrar_tela_cheia!==!1,zoomControl:this._config.mostrar_controles_navegacao!==!1}),this._setupMapInteractionListeners(),this._renderControls(),setTimeout(()=>{this._applyNightMode()},50),this._config.historico_carregar_no_start!==!1&&this._loadHistoryForEntities().then(()=>{this._config.entities&&this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)})}),this._config.entities&&this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)}),this._shouldFollow()&&this._fitMapBounds(),this.trafficLayer=new google.maps.TrafficLayer,this._toggleTrafficLayer())}_updateMap(){this._config.entities&&(this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)}),this._shouldFollow()&&this._fitMapBounds())}_shouldFollow(){if(this._followPausedByUser)return!1;if(this._config.follow_entity&&this._config.follow_entity!==""){let t=this._hass.states[this._config.follow_entity];if(!this._uiState.followOverride)return t&&t.state==="on"}return this._config.mostrar_menu===!1&&!this._config.follow_entity?this._config.seguir_on===!0:this._uiState.followEnabled}_setupMapInteractionListeners(){if(!this._map)return;let t=null,o=e=>{e.target.closest(".map-controls")||e.target.closest(".follow-countdown")||e.target.closest(".options-menu")||t||(t=setTimeout(()=>{t=null},100),this._handleUserInteraction())};this.mapContainer.addEventListener("mousedown",o),this.mapContainer.addEventListener("touchstart",o,{passive:!0}),this.mapContainer.addEventListener("wheel",o,{passive:!0})}_handleUserInteraction(){var e,i,r;if(this._isPerformingProgrammaticMove||!(this._config.follow_entity&&this._config.follow_entity!==""?((r=(i=(e=this._hass)==null?void 0:e.states)==null?void 0:i[this._config.follow_entity])==null?void 0:r.state)==="on"&&!this._uiState.followOverride:this._config.mostrar_menu===!1&&!this._config.follow_entity?this._config.seguir_on===!0:this._uiState.followEnabled))return;this._followResumeTimer&&clearTimeout(this._followResumeTimer),this._followCountdownInterval&&clearInterval(this._followCountdownInterval);let o=this._followPausedByUser;this._followPausedByUser=!0,this._followResumeTime=Date.now()+1e4,o||this._updateFollowCountdown(),this._followCountdownInterval=setInterval(()=>{this._updateFollowCountdown()},100),this._followResumeTimer=setTimeout(()=>{this._followPausedByUser=!1,this._followResumeTimer=null,this._followResumeTime=null,this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()},1e4)}_updateFollowCountdown(){if(!this.followCountdownElement||!this._followResumeTime||!this.followCountdownProgressCircle)return;let t=1e4,o=this._followResumeTime-Date.now();if(o<=0){this._hideFollowCountdown();return}let e=1-o/t,r=2*Math.PI*19*(1-e);this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",r),this.followCountdownElement.classList.add("visible")}_hideFollowCountdown(){if(this.followCountdownElement&&(this.followCountdownElement.classList.remove("visible"),this.followCountdownProgressCircle)){let t=2*Math.PI*19;this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",t)}}_resumeFollowImmediately(){this._followResumeTimer&&(clearTimeout(this._followResumeTimer),this._followResumeTimer=null),this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._followPausedByUser=!1,this._followResumeTime=null,this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()}_applyNightMode(){var i;if(!this._map)return;if(!this._hass&&this._config.modo_noturno&&typeof this._config.modo_noturno=="string"&&this._config.modo_noturno!==""){setTimeout(()=>this._applyNightMode(),100);return}let t=[{elementType:"geometry",stylers:[{color:"#212121"}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{elementType:"labels.text.stroke",stylers:[{color:"#212121"}]},{featureType:"administrative",elementType:"geometry",stylers:[{color:"#757575"}]},{featureType:"administrative.country",elementType:"labels.text.fill",stylers:[{color:"#9e9e9e"}]},{featureType:"administrative.land_parcel",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#bdbdbd"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#181818"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"poi.park",elementType:"labels.text.stroke",stylers:[{color:"#1b1b1b"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#2c2c2c"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#8a8a8a"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#373737"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#3c3c3c"}]},{featureType:"road.highway.controlled_access",elementType:"geometry",stylers:[{color:"#4e4e4e"}]},{featureType:"road.local",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"transit",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#000000"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#3d3d3d"}]}],o=this._config.modo_noturno,e=this._uiState.nightModeEnabled;typeof o=="string"&&o!==""&&!this._uiState.nightModeOverride?e=((i=this._hass.states[o])==null?void 0:i.state)==="on":!o&&this._config.mostrar_menu===!1&&this._config.modo_noturno_on===!0&&(e=!0),this._map.setOptions({styles:e?t:[]})}_toggleTrafficLayer(){var e;if(!this.trafficLayer)return;let t=this._config.transito,o=this._uiState.trafficEnabled;typeof t=="string"&&t!==""&&!this._uiState.trafficOverride?o=((e=this._hass.states[t])==null?void 0:e.state)==="on":!t&&this._config.mostrar_menu===!1&&this._config.transito_on===!0&&(o=!0),o?this.trafficLayer.setMap(this._map):this.trafficLayer.setMap(null)}_addOrUpdateMarker(t){if(!this._hass||!this._hass.states)return;let o=this._hass.states[t.entity],e=t.condition?this._hass.states[t.condition]:null,i=t.condition?e&&e.state==="on":this._uiState.entityVisibility[t.entity]!==!1;if(o&&o.state!=="unavailable"&&i){if(!o.attributes.latitude||!o.attributes.longitude)return;let r=new google.maps.LatLng(o.attributes.latitude,o.attributes.longitude),s=this.markers[t.entity],n=this._getInfoBoxText(t),l,d=this.lastPositions[t.entity],_=0,m=0;d?(_=r.lng()-d.lng,m=r.lat()-d.lat,Math.abs(_)>1e-5||Math.abs(m)>1e-5?l=Math.atan2(m,_)*(180/Math.PI):l=d.rotation!==999?d.rotation:999):l=999;let p=this._getArrowFromRotation(l);this.lastPositions[t.entity]={lat:r.lat(),lng:r.lng(),rotation:l},this._recordTrailPoint(t.entity,r,t);let c=this._getEntityDisplayName(t,o),f=this._uiState.rotateImageEnabled===!0;if(f?s&&s instanceof google.maps.Marker&&(s.setMap(null),s=null):s&&typeof s.draw=="function"&&!(s instanceof google.maps.Marker)&&(s.setMap(null),s=null),f){let g=0;l!==999?g=180-l:g=0;let v=t.image_rotated||t.image||o.attributes.entity_picture||"";if(s){s.position=r,s.rotation=g;let y=v;s.imageUrl!==y&&(s.imageUrl=y,s.img_&&(s.img_.src=y)),s.draw()}else{let y=v,E=document.createElement("img");E.src=y,E.style.width="60px",E.style.height="60px",E.style.transform=`rotate(${g}deg)`,s=new google.maps.OverlayView,s.position=r,s.rotation=g,s.imageUrl=y,s.onAdd=function(){let b=document.createElement("div");b.style.position="absolute",b.style.width="60px",b.style.height="60px",b.style.cursor="pointer";let w=document.createElement("img");w.src=this.imageUrl,w.style.width="100%",w.style.height="100%",w.style.position="absolute",w.style.top="0",w.style.left="0",b.appendChild(w),this.div_=b,this.img_=w,this.getPanes().overlayLayer.appendChild(b)},s.draw=function(){let b=this.getProjection();if(!b||!this.position)return;let w=b.fromLatLngToDivPixel(this.position),x=this.div_;x&&(x.style.left=w.x-30+"px",x.style.top=w.y-30+"px",x.style.transform=`rotate(${this.rotation}deg)`)},s.onRemove=function(){this.div_&&(this.div_.parentNode.removeChild(this.div_),this.div_=null)},s.getPosition=function(){return this.position},s.setMap(this._map),this.markers[t.entity]=s}}else if(s)s.setPosition(r),s.setTitle(c);else{let g={url:t.image||o.attributes.entity_picture||"",scaledSize:new google.maps.Size(60,60),anchor:new google.maps.Point(30,30)};s=new google.maps.Marker({position:r,map:this._map,title:c,icon:g}),this.markers[t.entity]=s}this.infoBoxes[t.entity]&&this.infoBoxes[t.entity].setMap(null);let u=new google.maps.OverlayView;u.onAdd=function(){let g=document.createElement("div");g.className="info-box";let v=this._parent._uiState.arrowEnabled?`<div class="arrow-box">${p} <!-- seta --></div>`:"";g.innerHTML=`
          ${v}
          ${n}
        `,this.div_=g,this.getPanes().overlayLayer.appendChild(g)},u._parent=this,u.draw=function(){let v=this.getProjection().fromLatLngToDivPixel(r),y=this.div_,E=0,b=-50;if(f&&(b=-65),f&&l!==999){let w=180-l,x=65,P=x,I=w*(Math.PI/180);E=x*Math.sin(I),b=-P*Math.cos(I)}y.style.left=`${v.x+E}px`,y.style.top=`${v.y+b}px`,y.style.transform="translate(-50%, -50%)"},u.onRemove=function(){this.div_.parentNode.removeChild(this.div_),this.div_=null},u.setMap(this._map),this.infoBoxes[t.entity]=u,this._renderTrail(t.entity,t),this._shouldFollow()&&this._centerOnMarkerWithPadding(r)}else this.markers[t.entity]&&(this.markers[t.entity].setMap(null),delete this.markers[t.entity]),this.infoBoxes[t.entity]&&(this.infoBoxes[t.entity].setMap(null),delete this.infoBoxes[t.entity]),this._clearTrail(t.entity)}_initializeEntityVisibility(){!this._config||!this._config.entities||this._config.entities.forEach(t=>{t.entity in this._uiState.entityVisibility||(this._uiState.entityVisibility[t.entity]=!0)})}_renderControls(){var g,v,y,E,b,w,x,P,I;if(!this.controlsContainer||(this.controlsContainer.innerHTML="",this._config.mostrar_menu===!1))return;let t=document.createElement("div");t.className="map-controls-left",this._config.entities&&this._config.entities.forEach(h=>{var U,R,j;if(h.condition)return;let M=(R=(U=this._hass)==null?void 0:U.states)==null?void 0:R[h.entity],z=this._uiState.entityVisibility[h.entity]!==!1,F=h.image||((j=M==null?void 0:M.attributes)==null?void 0:j.entity_picture)||"";if(F){let O=document.createElement("img");O.className=`entity-icon-button${z?"":" inactive"}`,O.src=F,O.title=this._getEntityDisplayName(h,M),O.addEventListener("click",B=>{B.stopPropagation(),B.preventDefault(),this._uiState.entityVisibility[h.entity]=!z,this._saveUIState(),this._renderControls(),this._addOrUpdateMarker(h)}),t.appendChild(O)}});let o=document.createElement("div");o.className="map-controls-right";let e=document.createElement("button");e.className=`options-button${this._optionsMenuOpen?" active":""}`,e.innerHTML="\u2699\uFE0F Op\xE7\xF5es",e.addEventListener("click",h=>{h.stopPropagation(),h.preventDefault(),this._optionsMenuOpen=!this._optionsMenuOpen,this._renderControls()}),o.appendChild(e);let i=document.createElement("div");i.className=`options-menu${this._optionsMenuOpen?" open":""}`;let r=document.createElement("label"),s=document.createElement("input");s.type="checkbox",typeof this._config.transito=="string"&&this._config.transito!==""&&!this._uiState.trafficOverride?s.checked=((y=(v=(g=this._hass)==null?void 0:g.states)==null?void 0:v[this._config.transito])==null?void 0:y.state)==="on":s.checked=this._uiState.trafficEnabled,s.addEventListener("change",h=>{h.stopPropagation(),this._uiState.trafficOverride=!0,this._uiState.trafficEnabled=s.checked,this._saveUIState(),this._toggleTrafficLayer()}),s.addEventListener("click",h=>{h.stopPropagation()}),r.appendChild(s),r.appendChild(document.createTextNode("Tr\xE2nsito")),r.addEventListener("click",h=>{h.stopPropagation()}),i.appendChild(r);let n=document.createElement("label"),l=document.createElement("input");l.type="checkbox",typeof this._config.modo_noturno=="string"&&this._config.modo_noturno!==""&&!this._uiState.nightModeOverride?l.checked=((w=(b=(E=this._hass)==null?void 0:E.states)==null?void 0:b[this._config.modo_noturno])==null?void 0:w.state)==="on":l.checked=this._uiState.nightModeEnabled,l.addEventListener("change",h=>{h.stopPropagation(),this._uiState.nightModeOverride=!0,this._uiState.nightModeEnabled=l.checked,this._saveUIState(),this._applyNightMode()}),l.addEventListener("click",h=>{h.stopPropagation()}),n.appendChild(l),n.appendChild(document.createTextNode("Modo Noturno")),n.addEventListener("click",h=>{h.stopPropagation()}),i.appendChild(n);let d=document.createElement("label"),_=document.createElement("input");_.type="checkbox",typeof this._config.follow_entity=="string"&&this._config.follow_entity!==""&&!this._uiState.followOverride?_.checked=((I=(P=(x=this._hass)==null?void 0:x.states)==null?void 0:P[this._config.follow_entity])==null?void 0:I.state)==="on":_.checked=this._uiState.followEnabled,_.addEventListener("change",h=>{h.stopPropagation(),this._uiState.followOverride=!0,this._uiState.followEnabled=_.checked,this._saveUIState(),this._followPausedByUser=!1,this._followResumeTimer&&(clearTimeout(this._followResumeTimer),this._followResumeTimer=null),this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._followResumeTime=null,this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()}),_.addEventListener("click",h=>{h.stopPropagation()}),d.appendChild(_),d.appendChild(document.createTextNode("Seguir")),d.addEventListener("click",h=>{h.stopPropagation()}),i.appendChild(d);let m=document.createElement("div");m.className="options-menu-separator",i.appendChild(m);let p=document.createElement("label"),c=document.createElement("input");c.type="checkbox",c.checked=this._uiState.rotateImageEnabled,c.addEventListener("change",h=>{h.stopPropagation(),this._uiState.rotateImageEnabled=c.checked,this._saveUIState(),this._config.entities&&this._config.entities.forEach(M=>{this._addOrUpdateMarker(M)})}),c.addEventListener("click",h=>{h.stopPropagation()}),p.appendChild(c),p.appendChild(document.createTextNode("Rota\xE7\xE3o")),p.addEventListener("click",h=>{h.stopPropagation()}),i.appendChild(p);let f=document.createElement("label"),u=document.createElement("input");u.type="checkbox",u.checked=this._uiState.arrowEnabled,u.addEventListener("change",h=>{h.stopPropagation(),this._uiState.arrowEnabled=u.checked,this._saveUIState(),this._config.entities&&this._config.entities.forEach(M=>{this._addOrUpdateMarker(M)})}),u.addEventListener("click",h=>{h.stopPropagation()}),f.appendChild(u),f.appendChild(document.createTextNode("Seta")),f.addEventListener("click",h=>{h.stopPropagation()}),i.appendChild(f),this.controlsContainer.appendChild(t),this.controlsContainer.appendChild(o),this.controlsContainer.appendChild(i),i.addEventListener("click",h=>{h.stopPropagation()}),this._optionsMenuOpen&&setTimeout(()=>{let h=M=>{!M.target.closest(".options-menu")&&!M.target.closest(".options-button")&&this._closeOptionsMenu()};document.addEventListener("click",h,{once:!0})},0)}_closeOptionsMenu(){this._optionsMenuOpen=!1,this._renderControls()}_getArrowFromRotation(t){return t>=-22.5&&t<22.5?"&rarr;":t>=22.5&&t<67.5?"&nearr;":t>=67.5&&t<112.5?"&uarr;":t>=112.5&&t<157.5?"&nwarr;":t>=157.5&&t<500||t<-157.5?"&larr;":t>=-157.5&&t<-112.5?"&swarr;":t>=-112.5&&t<-67.5?"&darr;":t>=-67.5&&t<-22.5?"&searr;":"&bull;"}_getEntityDisplayName(t,o){var e;return t.name?t.name:((e=o==null?void 0:o.attributes)==null?void 0:e.friendly_name)||t.entity}_getInfoBoxText(t){let o="";if(t.velocidade&&this._hass&&this._hass.states[t.velocidade]){let e=parseFloat(this._hass.states[t.velocidade].state).toFixed(0);o+=`<div class="velocidade"> ${e} km/h</div>`}if(t.altitude&&this._hass&&this._hass.states[t.altitude]){let e=parseFloat(this._hass.states[t.altitude].state).toFixed(0);o+=`<div class="altitude"> &#9650; ${e} m</div>`}return o}_fitMapBounds(){if(!this._map||!this.markers||Object.keys(this.markers).length===0)return;this._isPerformingProgrammaticMove=!0;let t=new google.maps.LatLngBounds;Object.values(this.markers).forEach(e=>{t.extend(e.getPosition())});let o=this._shouldFollow()?{top:100,right:50,bottom:50,left:50}:0;this._map.fitBounds(t,o),google.maps.event.addListenerOnce(this._map,"bounds_changed",()=>{this._map.getZoom()>18&&this._map.setZoom(18)}),google.maps.event.addListenerOnce(this._map,"idle",()=>{this._isPerformingProgrammaticMove=!1})}_centerOnMarkerWithPadding(t){if(!this._map)return;this._isPerformingProgrammaticMove=!0,this._lastProgrammaticMoveTime=Date.now();let o=new google.maps.LatLngBounds;o.extend(t);let e=.002,i=.001;o.extend(new google.maps.LatLng(t.lat()+e,t.lng())),o.extend(new google.maps.LatLng(t.lat()-e*.3,t.lng())),o.extend(new google.maps.LatLng(t.lat(),t.lng()+i)),o.extend(new google.maps.LatLng(t.lat(),t.lng()-i)),this._map.fitBounds(o,{top:100,right:50,bottom:50,left:50}),google.maps.event.addListenerOnce(this._map,"bounds_changed",()=>{this._map.getZoom()>18&&this._map.setZoom(18),setTimeout(()=>{this._isPerformingProgrammaticMove=!1,this._lastProgrammaticMoveTime=Date.now()},500)})}};var C=class extends HTMLElement{constructor(){super(),this._updating=!1}setConfig(t){try{let o=this._normalizeConfig(t||{});this._config=o,this._rendered&&this._hass?this._syncFormData():!this._rendered&&this._hass&&this._render()}catch(o){console.error("Erro ao definir configura\xE7\xE3o:",o,t),this._config=t||{},this._rendered&&this._hass&&this._syncFormData()}}set hass(t){this._hass=t,this._hass&&(this._rendered&&!this._updating?this._syncFormData():!this._rendered&&this._config&&this._render())}_render(){if(!this._hass)return;this._rendered=!0,this.innerHTML="";let t=document.createElement("ha-form");t.hass=this._hass;let o=this._normalizeConfig(this._config||{}),e;try{e=JSON.parse(JSON.stringify(o))}catch(i){console.error("Erro ao criar c\xF3pia dos dados:",i),e={...o}}e.api_key=e.api_key||"",e.follow_entity=e.follow_entity||"",e.modo_noturno=e.modo_noturno||"",e.transito=e.transito||"",e.mostrar_menu=e.mostrar_menu!==!1,e.mostrar_tipo_mapa=e.mostrar_tipo_mapa!==!1,e.tipo_mapa=e.tipo_mapa||"roadmap",e.mostrar_tela_cheia=e.mostrar_tela_cheia!==!1,e.mostrar_controles_navegacao=e.mostrar_controles_navegacao!==!1,e.ocultar_creditos=e.ocultar_creditos===!0,e.transito_on=e.transito_on===!0,e.modo_noturno_on=e.modo_noturno_on===!0,e.seguir_on=e.seguir_on===!0,e.rotacao_on=e.rotacao_on===!0,e.historico_somente_rastro=e.historico_somente_rastro!==!1,e.historico_carregar_no_start=e.historico_carregar_no_start!==!1,e.historico_recarregar=e.historico_recarregar===!0,e.historico_limite_pontos=Number.isFinite(e.historico_limite_pontos)?e.historico_limite_pontos:null,e.max_height=e.max_height||null,e.max_width=e.max_width||null,e.entities=e.entities||[],t.schema=this._buildSchema(),t.computeLabel=i=>i.label||i.name,t.data=e,t.addEventListener("value-changed",i=>{if(!this._updating)try{this._updating=!0,this._dispatchConfigChanged(i.detail.value)}catch(r){console.error("Erro ao processar mudan\xE7a de valor:",r)}finally{setTimeout(()=>{this._updating=!1},100)}}),this.appendChild(t),this._form=t,requestAnimationFrame(()=>{this._form&&this._form.data!==e&&(this._form.data=e)})}_syncFormData(){if(this._form&&!this._updating&&this._hass)try{this._updating=!0,this._form.hass=this._hass;let t=this._normalizeConfig(this._config||{}),o;try{o=JSON.parse(JSON.stringify(t))}catch(e){o={...t}}this._form.data=o}catch(t){console.error("Erro ao sincronizar dados do form:",t,this._config)}finally{setTimeout(()=>{this._updating=!1},50)}}_buildSchema(){return[{name:"api_key",label:"Google Maps API Key",required:!0,selector:{text:{}}},{name:"follow_entity",label:"Entidade para seguir (booleana, opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"modo_noturno",label:"Entidade modo noturno (opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"transito",label:"Entidade transito (opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"transito_on",label:"Transito ligado (sem entidade)",selector:{boolean:{}}},{name:"mostrar_menu",label:"Mostrar menu superior (opcional)",selector:{boolean:{}}},{name:"mostrar_tipo_mapa",label:"Mostrar bot\xF5es Mapa/Sat\xE9lite (opcional)",selector:{boolean:{}}},{name:"mostrar_tela_cheia",label:"Mostrar bot\xE3o tela cheia (opcional)",selector:{boolean:{}}},{name:"mostrar_controles_navegacao",label:"Mostrar controles de navega\xE7\xE3o (opcional)",selector:{boolean:{}}},{name:"ocultar_creditos",label:"Ocultar cr\xE9ditos/termos do mapa (opcional)",selector:{boolean:{}}},{name:"historico_somente_rastro",label:"Hist\xF3rico: carregar s\xF3 se rastro ativo",selector:{boolean:{}}},{name:"historico_carregar_no_start",label:"Hist\xF3rico: carregar ao iniciar",selector:{boolean:{}}},{name:"historico_recarregar",label:"Hist\xF3rico: recarregar ao alterar config",selector:{boolean:{}}},{name:"historico_limite_pontos",label:"Hist\xF3rico: limite de pontos (opcional)",selector:{number:{min:10,max:1e4,step:10}}},{name:"modo_noturno_on",label:"Modo noturno ligado (sem entidade)",selector:{boolean:{}}},{name:"seguir_on",label:"Seguir ligado (sem entidade)",selector:{boolean:{}}},{name:"rotacao_on",label:"Rota\xE7\xE3o ligada (sem menu)",selector:{boolean:{}}},{name:"tipo_mapa",label:"Tipo de mapa (opcional)",selector:{select:{options:[{label:"Mapa",value:"roadmap"},{label:"Sat\xE9lite",value:"satellite"},{label:"H\xEDbrido",value:"hybrid"},{label:"Terreno",value:"terrain"}]}}},{name:"max_height",label:"Altura m\xE1xima do mapa em pixels (opcional)",selector:{number:{min:100,max:2e3,step:10,unit_of_measurement:"px"}}},{name:"max_width",label:"Largura m\xE1xima do mapa em pixels (opcional)",selector:{number:{min:100,max:2e3,step:10,unit_of_measurement:"px"}}},{name:"entities",label:"Entidades",selector:{object:{multiple:!0,label_field:"entity",fields:{entity:{label:"Entidade",required:!0,selector:{entity:{}}},name:{label:"Nome personalizado (opcional)",selector:{text:{}}},image:{label:"Imagem (opcional)",selector:{text:{}}},image_rotated:{label:"Imagem Rotacionada (opcional, beta)",selector:{text:{}}},rastro:{label:"Rastro (opcional)",selector:{boolean:{}}},rastro_duracao_min:{label:"Rastro: dura\xE7\xE3o em minutos (opcional)",selector:{number:{min:1,max:1440,step:1,unit_of_measurement:"min"}}},rastro_pontos_por_min:{label:"Rastro: pontos por minuto (opcional)",selector:{number:{min:1,max:120,step:1}}},rastro_max_pontos:{label:"Rastro: m\xE1ximo de pontos (opcional)",selector:{number:{min:10,max:1e4,step:10}}},rastro_cor:{label:"Rastro: cor (opcional)",selector:{color_rgb:{}}},velocidade:{label:"Sensor de velocidade (opcional)",selector:{entity:{}}},altitude:{label:"Sensor de altitude (opcional)",selector:{entity:{}}},condition:{label:"Condicao (opcional)",selector:{entity:{domain:"input_boolean"}}}}}}}]}_normalizeConfig(t){if(!t||typeof t!="object")return{api_key:"",follow_entity:"",max_height:null,max_width:null,entities:[]};try{let o=L(t.entities||[]),e={api_key:t.api_key||"",follow_entity:t.follow_entity||"",modo_noturno:t.modo_noturno||"",transito:t.transito||"",mostrar_menu:t.mostrar_menu!==!1,mostrar_tipo_mapa:t.mostrar_tipo_mapa!==!1,tipo_mapa:t.tipo_mapa||"roadmap",mostrar_tela_cheia:t.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:t.mostrar_controles_navegacao!==!1,ocultar_creditos:t.ocultar_creditos===!0,transito_on:t.transito_on===!0,modo_noturno_on:t.modo_noturno_on===!0,seguir_on:t.seguir_on===!0,rotacao_on:t.rotacao_on===!0,historico_somente_rastro:t.historico_somente_rastro!==!1,historico_carregar_no_start:t.historico_carregar_no_start!==!1,historico_recarregar:t.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(t.historico_limite_pontos)?t.historico_limite_pontos:null,max_height:t.max_height||null,max_width:t.max_width||null,entities:o};return Object.keys(t).forEach(i=>{e.hasOwnProperty(i)||(e[i]=t[i])}),e}catch(o){return console.error("Erro ao normalizar configura\xE7\xE3o:",o,t),{api_key:t.api_key||"",follow_entity:t.follow_entity||"",modo_noturno:t.modo_noturno||"",transito:t.transito||"",mostrar_menu:t.mostrar_menu!==!1,mostrar_tipo_mapa:t.mostrar_tipo_mapa!==!1,tipo_mapa:t.tipo_mapa||"roadmap",mostrar_tela_cheia:t.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:t.mostrar_controles_navegacao!==!1,ocultar_creditos:t.ocultar_creditos===!0,transito_on:t.transito_on===!0,modo_noturno_on:t.modo_noturno_on===!0,seguir_on:t.seguir_on===!0,rotacao_on:t.rotacao_on===!0,historico_somente_rastro:t.historico_somente_rastro!==!1,historico_carregar_no_start:t.historico_carregar_no_start!==!1,historico_recarregar:t.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(t.historico_limite_pontos)?t.historico_limite_pontos:null,max_height:t.max_height||null,max_width:t.max_width||null,entities:Array.isArray(t.entities)?t.entities:[]}}}_dispatchConfigChanged(t){if(!(!t||typeof t!="object"))try{let o=this._normalizeConfig(t);this._config=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}catch(o){console.error("Erro ao despachar mudan\xE7a de configura\xE7\xE3o:",o),this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}}};customElements.get("google-maps-car-card-cadu")||customElements.define("google-maps-car-card-cadu",k);customElements.get("google-maps-car-card-cadu-editor")||customElements.define("google-maps-car-card-cadu-editor",C);k.getConfigElement=function(){return document.createElement("google-maps-car-card-cadu-editor")};k.getStubConfig=function(){return{api_key:"",follow_entity:"",entities:[]}};window.customCards=window.customCards||[];window.customCards.push({type:"google-maps-car-card-cadu",name:"Google Maps Car Card Cadu",description:"Exibe dispositivos no Google Maps com InfoBox personalizado."});var H=["entity","name","icon","show_state","show_condition","position","decimals","background_color","background_color_opacity","border_width","border_color","text_color","tap_action"];function T(a){var i;if(!a)return"";let t=r=>Math.max(0,Math.min(255,Number(r)||0)),o=r=>t(r).toString(16).padStart(2,"0"),e=r=>{if(r==null||r==="")return null;let s=Number(r);return Number.isFinite(s)?s>1?Math.max(0,Math.min(1,s/100)):Math.max(0,Math.min(1,s)):null};if(Array.isArray(a)&&a.length>=3){let[r,s,n]=a;return`#${o(r)}${o(s)}${o(n)}`}if(typeof a=="object"){let r=e((i=a.alpha)!=null?i:a.opacity),s=a.color;if(!s&&["r","g","b"].every(n=>n in a)&&(s={r:a.r,g:a.g,b:a.b}),Array.isArray(s)&&s.length>=3){let[n,l,d]=s;return r===null?`#${o(n)}${o(l)}${o(d)}`:`rgba(${t(n)}, ${t(l)}, ${t(d)}, ${r})`}if(s&&typeof s=="object"){let{r:n,g:l,b:d}=s;return r===null?`#${o(n)}${o(l)}${o(d)}`:`rgba(${t(n)}, ${t(l)}, ${t(d)}, ${r})`}}if(typeof a=="string"&&a.trim()!==""){let r=a.trim(),s=r.match(/^#([0-9a-fA-F]{8})$/);if(s){let n=s[1],l=parseInt(n.slice(0,2),16),d=parseInt(n.slice(2,4),16),_=parseInt(n.slice(4,6),16),m=parseInt(n.slice(6,8),16)/255;return`rgba(${l}, ${d}, ${_}, ${m})`}return r}return""}function W(a){if(!a||typeof a!="object"||Array.isArray(a))return{entity:"",name:"",icon:"",show_state:!1,show_condition:"",position:"bottom",decimals:1,background_color:"",background_color_opacity:null,border_width:0,border_color:"",text_color:"",tap_action:{}};try{let t=Object.keys(a).filter(r=>/^\d+$/.test(r)),o=a.background_color_opacity,e=a.border_width,i={entity:a.entity||"",name:a.name||"",icon:a.icon||"",show_state:a.show_state===!0,show_condition:typeof a.show_condition=="string"?a.show_condition:"",position:a.position||"bottom",decimals:Number.isFinite(a.decimals)?a.decimals:1,background_color:T(a.background_color),background_color_opacity:o!=null&&Number.isFinite(Number(o))?Math.max(0,Math.min(100,Number(o))):null,border_width:e!=null&&Number.isFinite(Number(e))?Math.max(0,Math.min(2,Number(e))):0,border_color:T(a.border_color),text_color:T(a.text_color),tap_action:a.tap_action||{}};return Object.keys(a).forEach(r=>{!/^\d+$/.test(r)&&i[r]===void 0&&(i[r]=a[r])}),t.length>0&&t.forEach(r=>{let s=Number(r);if(isNaN(s)||s<0||s>=H.length)return;let n=H[s];n&&i[n]===""&&a[r]&&(i[n]=a[r])}),i}catch(t){console.error("Erro ao normalizar entidade:",t,a);let o=a.background_color_opacity,e=a.border_width;return{entity:a.entity||"",name:a.name||"",icon:a.icon||"",show_state:a.show_state===!0,show_condition:typeof a.show_condition=="string"?a.show_condition:"",position:a.position||"bottom",decimals:Number.isFinite(a.decimals)?a.decimals:1,background_color:T(a.background_color),background_color_opacity:o!=null&&Number.isFinite(Number(o))?Math.max(0,Math.min(100,Number(o))):null,border_width:e!=null&&Number.isFinite(Number(e))?Math.max(0,Math.min(2,Number(e))):0,border_color:T(a.border_color),text_color:T(a.text_color),tap_action:a.tap_action||{},...a}}}function $(a,t){if(!a||typeof a!="string")return a||"";let o=Number(t);if(!Number.isFinite(o))return a;let e=Math.max(0,Math.min(1,o/100)),i=l=>Math.max(0,Math.min(255,Number(l)||0)),r=a.match(/^#([0-9a-fA-F]{6})$/);if(r){let l=r[1];return`rgba(${parseInt(l.slice(0,2),16)}, ${parseInt(l.slice(2,4),16)}, ${parseInt(l.slice(4,6),16)}, ${e})`}let s=a.match(/^#([0-9a-fA-F]{8})$/);if(s){let l=s[1];return`rgba(${parseInt(l.slice(0,2),16)}, ${parseInt(l.slice(2,4),16)}, ${parseInt(l.slice(4,6),16)}, ${e})`}let n=a.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/);return n?`rgba(${n[1]}, ${n[2]}, ${n[3]}, ${e})`:a}function q(a){if(Array.isArray(a))return a.filter(t=>t!=null).map(t=>{try{return W(typeof t=="string"?{entity:t}:t)}catch(o){return console.error("Erro ao normalizar entidade:",o,t),t}});if(a&&typeof a=="object"){let o=Object.keys(a).filter(e=>/^\d+$/.test(e)).sort((e,i)=>Number(e)-Number(i)).map(e=>a[e]);if(o.length>0)return q(o)}return[]}function N(a){if(!a||typeof a!="object")return{title:"",title_icon:"",title_secondary:"",subtitle:"",image:"",image_media_content_id:"",image_entity:"",aspect_ratio:"1.5",fit_mode:"cover",camera_view:"auto",tap_action:{action:"more-info"},entities:[]};try{let t=s=>typeof s=="string"?s:s&&typeof s=="object"&&(s.icon||s.value)||"",o=q(a.entities||[]),e="";a.image&&typeof a.image=="object"&&(e=a.image.media_content_id||""),a.image_media_content_id&&(e=a.image_media_content_id);let i=e?{media_content_id:e}:typeof a.image=="string"?a.image:"",r={title:a.title||"",title_icon:t(a.title_icon),title_secondary:a.title_secondary||"",subtitle:a.subtitle||"",image:i,image_media_content_id:e,image_entity:a.image_entity||"",aspect_ratio:a.aspect_ratio||"1.5",fit_mode:a.fit_mode||"cover",camera_view:a.camera_view||"auto",tap_action:a.tap_action||{action:"more-info"},entities:o};return Object.keys(a).forEach(s=>{r.hasOwnProperty(s)||(r[s]=a[s])}),r}catch(t){console.error("Erro ao normalizar configura\xE7\xE3o:",t,a);let o=r=>typeof r=="string"?r:r&&typeof r=="object"&&(r.icon||r.value)||"",e="";a.image&&typeof a.image=="object"&&(e=a.image.media_content_id||""),a.image_media_content_id&&(e=a.image_media_content_id);let i=e?{media_content_id:e}:typeof a.image=="string"?a.image:"";return{title:a.title||"",title_icon:o(a.title_icon),title_secondary:a.title_secondary||"",subtitle:a.subtitle||"",image:i,image_media_content_id:e,image_entity:a.image_entity||"",aspect_ratio:a.aspect_ratio||"1.5",fit_mode:a.fit_mode||"cover",camera_view:a.camera_view||"auto",tap_action:a.tap_action||{action:"more-info"},entities:Array.isArray(a.entities)?a.entities:[]}}}var S=class a extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._styleElement=document.createElement("style"),this.shadowRoot.appendChild(this._styleElement),this._rendered=!1,this._templateCache=new Map,this._templateRequests=new Map}setConfig(t){this._config=N(t||{}),this._rendered?this._updateCard():this._hass&&this._initialRender()}set hass(t){this._hass=t,this._rendered?this._updateCard():this._config&&this._initialRender()}getCardSize(){return 3}_initialRender(){var _,m,p;if(!this.shadowRoot||!this._hass||!this._config||this._rendered)return;let t=this._parseAspectRatio((_=this._config)==null?void 0:_.aspect_ratio),o=((m=this._config)==null?void 0:m.fit_mode)||"cover";this._styleElement.textContent=`
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
    `;let e=document.createElement("ha-card"),i=document.createElement("div");i.className="picture-wrapper",i.style.setProperty("--po-aspect-ratio",String(t)),i.style.setProperty("--po-fit-mode",o),i.addEventListener("click",()=>{var c;this._handleAction((c=this._config)==null?void 0:c.tap_action,this._getPrimaryEntityId())});let r=document.createElement("div");r.className="picture-spacer",i.appendChild(r);let s=document.createElement("img");s.className="picture-image",s.alt=((p=this._config)==null?void 0:p.title)||"Imagem",s.loading="eager",s.decoding="async",i.appendChild(s);let n=document.createElement("div");n.className="picture-placeholder",n.textContent="Configure image ou image_entity",n.style.display="none",i.appendChild(n);let l=document.createElement("div");l.className="overlay-top",i.appendChild(l);let d=document.createElement("div");d.className="overlay",i.appendChild(d),e.appendChild(i),this.shadowRoot.appendChild(e),this._elements={card:e,pictureWrapper:i,img:s,placeholder:n,overlayTop:l,overlay:d},this._rendered=!0,this._updateCard()}_updateCard(){var d,_;if(!this._rendered||!this._elements)return;let{img:t,placeholder:o,overlayTop:e,overlay:i}=this._elements,r=this._getImageUrl(),s=!!((d=this._config)!=null&&d.image_entity),n=((_=this._config)==null?void 0:_.image_entity)||"",l=(r||"")!==(t.src||"");if(s&&!r){let m=this._getImageEntityCache(n);m?(t.src=m,t.style.display="block",o.style.display="none"):(t.src="",t.style.display="none",o.textContent="Carregando imagem\u2026",o.style.display="flex")}else if(l)if(r){let m=t.src&&t.complete&&t.naturalWidth>0,p=s?this._getImageEntityCache(n):null,c=()=>s&&this._saveImageEntityCache(n,r),f=()=>{t.style.display="block",o.style.display="none",c()};if(s&&p)if(t.onload=null,t.onerror=null,t.src=p,t.style.display="block",o.style.display="none",p!==r&&this._pendingImageUrl!==r){this._pendingImageUrl=r;let u=new Image;u.onload=()=>{var g;this._pendingImageUrl===r&&((g=this._elements)!=null&&g.img)&&(this._elements.img.src=r,f()),this._pendingImageUrl=null},u.onerror=()=>{this._pendingImageUrl=null},u.src=r}else p===r&&(t.complete&&t.naturalWidth?c():t.onload=c);else if(s&&m&&this._pendingImageUrl!==r){this._pendingImageUrl=r;let u=new Image;u.onload=()=>{var g;this._pendingImageUrl===r&&((g=this._elements)!=null&&g.img)&&(this._elements.img.src=r,f()),this._pendingImageUrl=null},u.onerror=()=>{this._pendingImageUrl=null},u.src=r}else s&&m||(t.onload=null,t.onerror=null,s?(o.textContent="Carregando imagem\u2026",o.style.display="flex",t.style.display="none",t.onload=()=>{o.style.display="none",t.style.display="block",c()},t.onerror=()=>{o.textContent="Erro ao carregar imagem",o.style.display="flex",t.style.display="none"}):(o.style.display="none",t.style.display="block"),t.src=r,s&&t.complete&&t.naturalWidth&&(o.style.display="none",t.style.display="block",c()))}else this._pendingImageUrl=null,t.src="",t.style.display="none",o.textContent="Configure image ou image_entity",o.style.display="flex";this._updateOverlayTop(e),this._updateOverlayBottom(i)}_isEntityVisible(t){let o=t==null?void 0:t.show_condition;if(!o||typeof o!="string"||o.trim()==="")return!0;let e=this._renderTemplate(o),i=String(e).trim().toLowerCase();return!(i===""||i==="false"||i==="no"||i==="0")}_updateOverlayTop(t){let e=this._getOverlayEntityConfigs().filter(i=>(i.position||"bottom")==="top").filter(i=>this._isEntityVisible(i));t.innerHTML="",e.length!==0&&e.forEach(i=>{let r=document.createElement("div");r.className="overlay-entity";let s=i.background_color||"rgba(255, 255, 255, 0.25)",n=i.background_color_opacity!=null?$(s,i.background_color_opacity):s,l=i.text_color||"#fff";r.style.background=n,r.style.color=l;let d=Number(i.border_width);d>0&&(r.style.borderWidth=`${d}px`,r.style.borderStyle="solid",r.style.borderColor=i.border_color||"rgba(255,255,255,0.5)"),r.addEventListener("click",m=>{var c;m.stopPropagation();let p=i.tap_action||((c=this._config)==null?void 0:c.tap_action);this._handleAction(p,i.entity)});let _=this._createEntityIcon(i);if(this._applyEntityIconOnOffColor(_,i.entity),r.appendChild(_),i.show_state===!0){let m=document.createElement("div");m.textContent=this._getEntityState(i.entity,i),r.appendChild(m)}t.appendChild(r)})}_updateOverlayBottom(t){var l,d,_,m;let o=((l=this._config)==null?void 0:l.title)||"",e=((d=this._config)==null?void 0:d.title_secondary)||"",i=this._renderTemplate(((_=this._config)==null?void 0:_.subtitle)||""),r=((m=this._config)==null?void 0:m.title_icon)||"",n=this._getOverlayEntityConfigs().filter(p=>(p.position||"bottom")==="bottom").filter(p=>this._isEntityVisible(p));if(t.innerHTML="",t.style.display=o||i||n.length>0?"flex":"none",o||i){let p=document.createElement("div");if(p.className="overlay-title-container",o){let c=document.createElement("div");if(c.className="overlay-title",r){let u=document.createElement("ha-icon");u.icon=r,c.appendChild(u)}let f=document.createElement("span");if(f.textContent=o,c.appendChild(f),e){let u=document.createElement("span");u.className="overlay-title-secondary",u.textContent=e,c.appendChild(u)}p.appendChild(c)}if(i){let c=document.createElement("div");c.className="overlay-subtitle",c.textContent=i,r?c.style.paddingLeft="24px":c.style.paddingLeft="0",p.appendChild(c)}t.appendChild(p)}else{let p=document.createElement("div");p.style.flex="1",t.appendChild(p)}if(n.length>0){let p=document.createElement("div");p.className="overlay-entities",n.forEach(c=>{let f=document.createElement("div");f.className="overlay-entity";let u=c.background_color||"rgba(255, 255, 255, 0.25)",g=c.background_color_opacity!=null?$(u,c.background_color_opacity):u,v=c.text_color||"#fff";f.style.background=g,f.style.color=v;let y=Number(c.border_width);y>0&&(f.style.borderWidth=`${y}px`,f.style.borderStyle="solid",f.style.borderColor=c.border_color||"rgba(255,255,255,0.5)"),f.addEventListener("click",b=>{var x;b.stopPropagation();let w=c.tap_action||((x=this._config)==null?void 0:x.tap_action);this._handleAction(w,c.entity)});let E=this._createEntityIcon(c);if(this._applyEntityIconOnOffColor(E,c.entity),f.appendChild(E),c.show_state===!0){let b=document.createElement("div");b.textContent=this._getEntityState(c.entity,c),f.appendChild(b)}p.appendChild(f)}),t.appendChild(p)}}_renderTemplate(t){if(!t||typeof t!="string")return"";if(!t.includes("{%")&&!t.includes("{{"))return t;try{if(!this._hass||!this._hass.connection)return"";let o=Date.now(),e=this._templateCache.get(t);if(e&&o-e.ts<1e3)return e.value;if(!this._templateRequests.has(t)){let i=this._hass.connection.subscribeMessage(r=>{let s=(r==null?void 0:r.result)||"";this._templateCache.set(t,{value:String(s),ts:Date.now()}),this._templateRequests.delete(t),i&&i(),requestAnimationFrame(()=>this._updateCard())},{type:"render_template",template:t});this._templateRequests.set(t,i)}return e?e.value:""}catch(o){return console.warn("Erro ao renderizar template:",o),""}}_parseAspectRatio(t){if(!t||typeof t!="string")return 1.5;let o=t.trim();if(o.includes(":")){let[i,r]=o.split(":").map(s=>Number(s));if(Number.isFinite(i)&&Number.isFinite(r)&&i>0&&r>0)return i/r}let e=Number(o);return Number.isFinite(e)&&e>0?e:1.5}_getImageUrl(){var o,e,i,r,s,n;let t="";if((o=this._config)!=null&&o.image)typeof this._config.image=="string"?t=this._config.image:typeof this._config.image=="object"&&(t=this._config.image.media_content_id||"");else{let l=(e=this._config)==null?void 0:e.image_entity;if(l&&this._hass){let d=(i=this._hass.states)==null?void 0:i[l];if(d)if(((r=this._config)==null?void 0:r.camera_view)==="live"&&l.startsWith("camera.")){let _=`/api/camera_proxy_stream/${l}`;t=this._resolveUrl(_)||_}else t=((s=d.attributes)==null?void 0:s.entity_picture)||((n=d.attributes)==null?void 0:n.image)||(typeof d.state=="string"?d.state:"")}}return this._resolveUrl(t)||t}_resolveUrl(t){if(!t||typeof t!="string")return"";let o=t.trim();return o.startsWith("/")&&this._hass&&typeof this._hass.hassUrl=="function"?this._hass.hassUrl(o):o}static _imageCacheKey(t){return"picture-overview-cadu-img-"+(t||"")}_getImageEntityCache(t){if(!t||typeof t!="string")return null;try{return localStorage.getItem(a._imageCacheKey(t))||null}catch(o){return null}}_saveImageEntityCache(t,o){if(!(!t||typeof t!="string"||!o))try{localStorage.setItem(a._imageCacheKey(t),String(o))}catch(e){}}_getPrimaryEntityId(){var o;let t=Array.isArray((o=this._config)==null?void 0:o.entities)?this._config.entities:[];return t.length>0?t[0].entity:null}_getOverlayEntityConfigs(){var o;return Array.isArray((o=this._config)==null?void 0:o.entities)?this._config.entities:[]}_getEntityName(t){var e,i,r;if(t!=null&&t.name)return t.name;let o=(i=(e=this._hass)==null?void 0:e.states)==null?void 0:i[t.entity];return((r=o==null?void 0:o.attributes)==null?void 0:r.friendly_name)||t.entity}_createEntityIcon(t){var r,s;let o=t==null?void 0:t.icon,e=(s=(r=this._hass)==null?void 0:r.states)==null?void 0:s[t.entity];if(e){let n=document.createElement("ha-state-icon");if(n.hass=this._hass,n.stateObj=e,o&&o!=="")n.icon=o;else{let l=this._getEntityIconFromState(e);l&&(n.icon=l)}return n}let i=document.createElement("ha-icon");return i.icon=o&&o!==""?o:"mdi:checkbox-blank-circle-outline",i}_getEntityIconFromState(t){var i,r;if(!t)return"";let o=(i=t.attributes)==null?void 0:i.icon;return o||(((r=t.attributes)==null?void 0:r.device_class)==="temperature"?"mdi:thermometer":"")}_applyEntityIconOnOffColor(t,o){var r,s;if(!t||!o||!((s=(r=this._hass)==null?void 0:r.states)!=null&&s[o]))return;let e=this._hass.states[o],i=String(e.state||"").toLowerCase();i==="on"?t.style.color="var(--state-icon-active-color, var(--state-active-color, #fdd835))":i==="off"||i==="unavailable"?t.style.color="var(--state-icon-inactive-color, var(--state-inactive-color, #9e9e9e))":t.style.color=""}_getEntityState(t,o=null){var l,d,_;let e=(d=(l=this._hass)==null?void 0:l.states)==null?void 0:d[t];if(!e)return"unavailable";let i=(_=e.attributes)==null?void 0:_.unit_of_measurement,r=Number.isFinite(o==null?void 0:o.decimals)?o.decimals:1,s=typeof e.state=="string"?e.state.replace(",","."):e.state,n=Number.parseFloat(s);if(Number.isFinite(n)){let m=n.toFixed(r);return i?`${m} ${i}`:m}return i?`${e.state} ${i}`:e.state}_handleAction(t,o){if(!t||t.action==="none")return;let e=t.action||"more-info";if(e==="more-info"){let i=t.entity||o;i&&this._fireEvent("hass-more-info",{entityId:i});return}if(e==="navigate"&&t.navigation_path){history.pushState(null,"",t.navigation_path),window.dispatchEvent(new Event("location-changed"));return}if(e==="url"&&t.url_path){window.location.href=t.url_path;return}if(e==="toggle"&&o&&this._hass){this._hass.callService("homeassistant","toggle",{entity_id:o});return}if(e==="call-service"&&t.service&&this._hass){let[i,r]=t.service.split(".");i&&r&&this._hass.callService(i,r,t.service_data||{})}}_fireEvent(t,o){this.dispatchEvent(new CustomEvent(t,{detail:o,bubbles:!0,composed:!0}))}};var A=class extends HTMLElement{constructor(){super(),this._updating=!1}setConfig(t){this._config=N(t||{}),this._rendered&&this._hass?this._syncFormData():!this._rendered&&this._hass&&this._render()}set hass(t){this._hass=t,this._hass&&(this._rendered&&!this._updating?this._syncFormData():!this._rendered&&this._config&&this._render())}_render(){if(!this._hass)return;if(this._rendered){this._form&&(this._form.hass=this._hass);return}this._rendered=!0,this.innerHTML="";let t=document.createElement("ha-form");t.hass=this._hass;let o=N(this._config||{});o=this._ensureEntitiesArray(o),t.schema=this._buildSchema(),t.computeLabel=e=>e.label||e.name,t.data=o,t.addEventListener("value-changed",e=>{JSON.stringify(this._config)!==JSON.stringify(e.detail.value)&&(this._config=e.detail.value,this._debounce&&clearTimeout(this._debounce),this._debounce=setTimeout(()=>{this._dispatchConfigChanged(this._config)},500))}),this.appendChild(t),this._form=t}_syncFormData(){}_ensureEntitiesArray(t){if(!t||typeof t!="object"||Array.isArray(t.entities))return t;if(t.entities&&typeof t.entities=="object"){let o=Object.keys(t.entities).filter(e=>/^\d+$/.test(e)).sort((e,i)=>Number(e)-Number(i)).map(e=>t.entities[e]);return{...t,entities:o}}return{...t,entities:[]}}_buildSchema(){return[{name:"title",label:"Titulo",selector:{text:{}}},{name:"title_icon",label:"Icone do titulo (opcional)",selector:{icon:{}}},{name:"title_secondary",label:"Titulo secundario (ao lado, menor)",selector:{text:{}}},{name:"subtitle",label:"Subtitulo (opcional, aceita template jinja)",selector:{template:{}}},{name:"image",label:"Imagem (url/local)",selector:{text:{}}},{name:"image_media_content_id",label:"Imagem (media_content_id)",selector:{text:{}}},{name:"image_entity",label:"Entidade de imagem (opcional)",selector:{entity:{}}},{name:"aspect_ratio",label:"Aspect ratio (ex: 1.5 ou 16:9)",selector:{text:{}}},{name:"fit_mode",label:"Fit mode",selector:{select:{options:[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"}]}}},{name:"camera_view",label:"Camera view",selector:{select:{options:[{label:"Auto",value:"auto"},{label:"Live",value:"live"}]}}},{name:"tap_action",label:"Tap action do card",selector:{ui_action:{}}},{name:"entities",label:"Entidades",selector:{object:{multiple:!0,label_field:"entity",fields:{entity:{label:"Entidade",required:!0,selector:{entity:{}}},name:{label:"Nome (opcional)",selector:{text:{}}},icon:{label:"Icone (opcional)",selector:{icon:{}}},show_state:{label:"Mostrar estado",selector:{boolean:{}}},show_condition:{label:"Condicao (template Jinja: true exibe, false oculta)",selector:{template:{}}},position:{label:"Posicao do overlay",selector:{select:{options:[{label:"Inferior",value:"bottom"},{label:"Superior direita",value:"top"}]}}},decimals:{label:"Casas decimais (padrao 1)",selector:{number:{min:0,max:4,step:1}}},background_color:{label:"Cor de fundo",selector:{color_rgb:{}}},background_color_opacity:{label:"Opacidade do fundo (%) \u2014 0 transparente, 100 opaco",selector:{number:{min:0,max:100,step:5,unit_of_measurement:"%"}}},border_width:{label:"Borda (px) \u2014 0 sem borda, 0.1 a 2",selector:{number:{min:0,max:2,step:.1,unit_of_measurement:"px"}}},border_color:{label:"Cor da borda (opcional)",selector:{color_rgb:{}}},text_color:{label:"Cor do texto (opcional)",selector:{color_rgb:{}}},tap_action:{label:"Tap action da entidade (opcional)",selector:{ui_action:{}}}}}}}]}_dispatchConfigChanged(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}};customElements.get("picture-overview-cadu")||customElements.define("picture-overview-cadu",S);customElements.get("picture-overview-cadu-editor")||customElements.define("picture-overview-cadu-editor",A);S.getConfigElement=function(){return document.createElement("picture-overview-cadu-editor")};S.getStubConfig=function(){return{title:"Picture Overview",aspect_ratio:"1.5",fit_mode:"cover",entities:[]}};window.customCards=window.customCards||[];window.customCards.push({type:"picture-overview-cadu",name:"Picture Overview Cadu",description:"Imagem com entities e tap_action estilo picture-glance."});
