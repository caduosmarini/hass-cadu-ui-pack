var B=["entity","name","image","velocidade","altitude","condition"];function q(s){if(!s||typeof s!="object"||Array.isArray(s))return{entity:"",name:"",image:"",image_rotated:"",velocidade:"",altitude:"",condition:"",rastro:!1,rastro_duracao_min:null,rastro_pontos_por_min:null,rastro_cor:"",rastro_max_pontos:null};try{let t=Object.keys(s).filter(o=>/^\d+$/.test(o)),e={entity:s.entity||"",name:s.name||"",image:s.image||"",image_rotated:s.image_rotated||"",velocidade:s.velocidade||"",altitude:s.altitude||"",condition:s.condition||"",rastro:s.rastro===!0,rastro_duracao_min:typeof s.rastro_duracao_min=="number"?s.rastro_duracao_min:null,rastro_pontos_por_min:typeof s.rastro_pontos_por_min=="number"?s.rastro_pontos_por_min:null,rastro_cor:s.rastro_cor||"",rastro_max_pontos:typeof s.rastro_max_pontos=="number"?s.rastro_max_pontos:null};return Object.keys(s).forEach(o=>{!/^\d+$/.test(o)&&e[o]===void 0&&(e[o]=s[o])}),t.length>0&&t.forEach(o=>{let i=Number(o);if(isNaN(i)||i<0||i>=B.length)return;let r=B[i];r&&e[r]===""&&s[o]&&(e[r]=s[o])}),e}catch(t){return console.error("Erro ao normalizar entidade:",t,s),{entity:s.entity||"",name:s.name||"",image:s.image||"",image_rotated:s.image_rotated||"",velocidade:s.velocidade||"",altitude:s.altitude||"",condition:s.condition||"",rastro:s.rastro===!0,rastro_duracao_min:typeof s.rastro_duracao_min=="number"?s.rastro_duracao_min:null,rastro_pontos_por_min:typeof s.rastro_pontos_por_min=="number"?s.rastro_pontos_por_min:null,rastro_cor:s.rastro_cor||"",rastro_max_pontos:typeof s.rastro_max_pontos=="number"?s.rastro_max_pontos:null,...s}}}function A(s){return Array.isArray(s)?s.filter(t=>t&&typeof t=="object").map(t=>{try{return q(t)}catch(e){return console.error("Erro ao normalizar entidade:",e,t),t}}):[]}var M=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._styleElement=document.createElement("style"),this.shadowRoot.appendChild(this._styleElement),this.controlsContainer=document.createElement("div"),this.controlsContainer.className="map-controls",this.shadowRoot.appendChild(this.controlsContainer),this.mapContainer=document.createElement("div"),this.mapContainer.id="map",this.shadowRoot.appendChild(this.mapContainer),this.followCountdownElement=document.createElement("div"),this.followCountdownElement.className="follow-countdown",this.followCountdownElement.title="Clique para retomar o seguir";let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("class","follow-countdown-circle"),t.setAttribute("viewBox","0 0 44 44");let e=document.createElementNS("http://www.w3.org/2000/svg","circle");e.setAttribute("class","follow-countdown-bg"),e.setAttribute("cx","22"),e.setAttribute("cy","22"),e.setAttribute("r","19"),t.appendChild(e),this.followCountdownProgressCircle=document.createElementNS("http://www.w3.org/2000/svg","circle"),this.followCountdownProgressCircle.setAttribute("class","follow-countdown-progress"),this.followCountdownProgressCircle.setAttribute("cx","22"),this.followCountdownProgressCircle.setAttribute("cy","22"),this.followCountdownProgressCircle.setAttribute("r","19");let o=2*Math.PI*19;this.followCountdownProgressCircle.setAttribute("stroke-dasharray",o),this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",o),t.appendChild(this.followCountdownProgressCircle),this.followCountdownElement.appendChild(t);let i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttribute("class","follow-countdown-icon"),i.setAttribute("viewBox","0 0 24 24"),i.setAttribute("width","18"),i.setAttribute("height","18");let r=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("d","M12 2v4m0 12v4M2 12h4m12 0h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"),r.setAttribute("stroke","white"),r.setAttribute("stroke-width","2"),r.setAttribute("stroke-linecap","round"),r.setAttribute("fill","none"),i.appendChild(r),this.followCountdownElement.appendChild(i),this.followCountdownElement.addEventListener("click",()=>{this._resumeFollowImmediately()}),this.shadowRoot.appendChild(this.followCountdownElement),this.markers={},this.infoBoxes={},this.lastPositions={},this.trails={},this.trailPolylines={},this._lastMapTypeOptions=null,this._lastMapControlsOptions=null,this._historyLoaded={},this._uiState={trafficEnabled:!1,nightModeEnabled:!1,followEnabled:!1,trafficOverride:!1,nightModeOverride:!1,followOverride:!1,rotateImageEnabled:!1,arrowEnabled:!0,entityVisibility:{}},this._followPausedByUser=!1,this._followResumeTimer=null,this._followResumeTime=null,this._followCountdownInterval=null,this._isPerformingProgrammaticMove=!1,this._lastProgrammaticMoveTime=null,this._optionsMenuOpen=!1,this._updateStyles()}_updateStyles(){var m,h,_,c;let t=((m=this._config)==null?void 0:m.max_height)||null,e=((h=this._config)==null?void 0:h.max_width)||null,o="450px",i="600px",r=t?`${t}px`:o,a=t?`${t}px`:i,n=e?`max-width: ${e}px;`:"",l=((_=this._config)==null?void 0:_.mostrar_menu)!==!1,d=((c=this._config)==null?void 0:c.ocultar_creditos)===!0;this._styleElement.textContent=`
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
    `}_getStorageKey(){return!this._config||!this._config.entities?"google-maps-car-card-cadu-default":`google-maps-car-card-cadu-${this._config.entities.map(e=>e.entity).sort().join(",")}`}_loadUIState(){try{let t=this._getStorageKey(),e=localStorage.getItem(t);if(e){let o=JSON.parse(e);o&&typeof o=="object"&&(this._uiState={trafficEnabled:o.trafficEnabled===!0,nightModeEnabled:o.nightModeEnabled===!0,followEnabled:o.followEnabled===!0,trafficOverride:o.trafficOverride===!0,nightModeOverride:o.nightModeOverride===!0,followOverride:o.followOverride===!0,rotateImageEnabled:o.rotateImageEnabled===!0,arrowEnabled:o.arrowEnabled!==!1,entityVisibility:o.entityVisibility||{}})}}catch(t){console.error("Erro ao carregar estado do UI do localStorage:",t)}}_saveUIState(){try{let t=this._getStorageKey();localStorage.setItem(t,JSON.stringify(this._uiState))}catch(t){console.error("Erro ao salvar estado do UI no localStorage:",t)}}async _loadHistoryForEntities(){var e;if(!this._hass||!((e=this._config)!=null&&e.entities))return;let t=Date.now();for(let o of this._config.entities){let i=o.entity;if(!i||this._config.historico_somente_rastro!==!1&&o.rastro!==!0||this._historyLoaded[i]===!0)continue;this._historyLoaded[i]=!0;let r=Number.isFinite(o.rastro_duracao_min)?o.rastro_duracao_min:60,a=new Date(t-r*60*1e3).toISOString();try{let n=await this._hass.callApi("GET",`history/period/${a}?filter_entity_id=${i}&significant_changes_only=0`),l=Array.isArray(n)?n[0]:[],d=[];Array.isArray(l)&&l.forEach(c=>{var f,w;let p=(f=c==null?void 0:c.attributes)==null?void 0:f.latitude,u=(w=c==null?void 0:c.attributes)==null?void 0:w.longitude;if(typeof p=="number"&&typeof u=="number"){let b=new Date(c.last_updated||c.last_changed||c.timestamp).getTime();d.push({lat:p,lng:u,ts:b})}}),d.sort((c,p)=>c.ts-p.ts);let m=Number.isFinite(this._config.historico_limite_pontos)?this._config.historico_limite_pontos:null,h=m?this._sampleHistoryPoints(d,m):d;this.trails[i]=h;let _=this._findLastSignificantRotation(h);if(_!==null){let c=h[h.length-1];this.lastPositions[i]={lat:c.lat,lng:c.lng,rotation:_}}this._renderTrail(i,o)}catch(n){console.error("Erro ao carregar hist\xF3rico do HA:",n,i)}}}_getTrailConfig(t){return{enabled:t.rastro===!0,durationMin:Number.isFinite(t.rastro_duracao_min)?t.rastro_duracao_min:60,maxPerMin:Number.isFinite(t.rastro_pontos_por_min)?t.rastro_pontos_por_min:10,color:this._normalizeTrailColor(t.rastro_cor),maxPoints:Number.isFinite(t.rastro_max_pontos)?t.rastro_max_pontos:600}}_normalizeTrailColor(t){if(Array.isArray(t)&&t.length>=3){let[e,o,i]=t,r=a=>Math.max(0,Math.min(255,Number(a)||0)).toString(16).padStart(2,"0");return`#${r(e)}${r(o)}${r(i)}`}return typeof t=="string"&&t.trim()!==""?t.trim():"#00aaff"}_sampleHistoryPoints(t,e){if(!Array.isArray(t)||t.length<=e)return t;let o=Math.ceil(t.length/e),i=[];for(let a=0;a<t.length;a+=o)i.push(t[a]);let r=t[t.length-1];return i[i.length-1]!==r&&i.push(r),i}_findLastSignificantRotation(t){if(!Array.isArray(t)||t.length<2)return null;for(let e=t.length-1;e>0;e-=1){let o=t[e],i=t[e-1],r=o.lng-i.lng,a=o.lat-i.lat;if(Math.abs(r)>1e-5||Math.abs(a)>1e-5)return Math.atan2(a,r)*(180/Math.PI)}return null}_pruneTrail(t,e,o){let i=Date.now(),r=t.filter(a=>i-a.ts<=e);return r.length>o&&(r=r.slice(r.length-o)),r}_reduceTrailDensity(t,e){let o=Date.now(),i=t.slice(),r=n=>n.filter(l=>o-l.ts<=6e4).length,a=0;for(;r(i)>e&&i.length>2&&a<5;)i=i.filter((n,l)=>l%2===0||l===i.length-1),a+=1;return i}_recordTrailPoint(t,e,o){let i=this._getTrailConfig(o),r=Array.isArray(this.trails[t])?this.trails[t]:[],a=r[r.length-1],n=a?Math.abs(e.lng()-a.lng):1/0,l=a?Math.abs(e.lat()-a.lat):1/0;if(a&&n<=1e-5&&l<=1e-5)return;let d=r.concat([{lat:e.lat(),lng:e.lng(),ts:Date.now()}]),m=i.durationMin*60*1e3,h=this._pruneTrail(d,m,i.maxPoints);h=this._reduceTrailDensity(h,i.maxPerMin),this.trails[t]=h}_clearTrail(t){let e=this.trailPolylines[t];Array.isArray(e)&&e.forEach(o=>o.setMap(null)),delete this.trailPolylines[t]}_renderTrail(t,e){let o=this._getTrailConfig(e);if(!o.enabled){this._clearTrail(t);return}let i=this.trails[t];if(!Array.isArray(i)||i.length<2){this._clearTrail(t);return}this._clearTrail(t);let r=[],a=.9,n=.1,l=i.length-1;for(let d=1;d<i.length;d++){let m=d/l,h=n+m*(a-n),_=new google.maps.Polyline({path:[{lat:i[d-1].lat,lng:i[d-1].lng},{lat:i[d].lat,lng:i[d].lng}],geodesic:!0,strokeColor:o.color,strokeOpacity:h,strokeWeight:3,map:this._map});r.push(_)}this.trailPolylines[t]=r}set hass(t){this._hass=t,this._map&&this._config&&(this._updateMap(),this._applyMapTypeOptions(),this._applyNightMode(),this._toggleTrafficLayer())}setConfig(t){try{let e=this._normalizeConfig(t||{});if(this._config=e,(!this._config.entities||!this._config.api_key)&&console.warn("Configuracao incompleta: api_key ou entities ausentes"),this._config={...this._config,transito:typeof this._config.transito=="string"?this._config.transito:null,modo_noturno:typeof this._config.modo_noturno=="string"?this._config.modo_noturno:null,follow_entity:typeof this._config.follow_entity=="string"?this._config.follow_entity:null,rotate_image:this._config.rotate_image===!0,mostrar_menu:this._config.mostrar_menu!==!1,mostrar_tipo_mapa:this._config.mostrar_tipo_mapa!==!1,tipo_mapa:typeof this._config.tipo_mapa=="string"?this._config.tipo_mapa:"roadmap",mostrar_tela_cheia:this._config.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:this._config.mostrar_controles_navegacao!==!1,ocultar_creditos:this._config.ocultar_creditos===!0,transito_on:this._config.transito_on===!0,modo_noturno_on:this._config.modo_noturno_on===!0,seguir_on:this._config.seguir_on===!0,rotacao_on:this._config.rotacao_on===!0,historico_somente_rastro:this._config.historico_somente_rastro!==!1,historico_carregar_no_start:this._config.historico_carregar_no_start!==!1,historico_recarregar:this._config.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(this._config.historico_limite_pontos)?this._config.historico_limite_pontos:null},this._loadUIState(),this._uiState.trafficEnabled===void 0&&(this._uiState.trafficEnabled=!1),this._uiState.nightModeEnabled===void 0&&(this._uiState.nightModeEnabled=!1),this._uiState.followEnabled===void 0&&(this._uiState.followEnabled=!1),this._uiState.trafficOverride===void 0&&(this._uiState.trafficOverride=!1),this._uiState.nightModeOverride===void 0&&(this._uiState.nightModeOverride=!1),this._uiState.followOverride===void 0&&(this._uiState.followOverride=!1),this._uiState.rotateImageEnabled===void 0&&(this._uiState.rotateImageEnabled=!1),this._uiState.arrowEnabled===void 0&&(this._uiState.arrowEnabled=!0),this._config.mostrar_menu===!1&&(this._config.transito||(this._uiState.trafficEnabled=this._config.transito_on===!0),this._config.modo_noturno||(this._uiState.nightModeEnabled=this._config.modo_noturno_on===!0),this._config.follow_entity||(this._uiState.followEnabled=this._config.seguir_on===!0),this._uiState.rotateImageEnabled=this._config.rotacao_on===!0),this._initializeEntityVisibility(),this._updateStyles(),this._map&&this.controlsContainer&&(this._renderControls(),requestAnimationFrame(()=>{this._applyNightMode(),this._toggleTrafficLayer(),this._applyMapTypeOptions(),this._applyMapControlsOptions()})),this._map&&this._config.historico_recarregar===!0&&(this._historyLoaded={},this._loadHistoryForEntities()),!this._config.api_key){this.mapContainer.innerHTML='<div style="padding: 20px; color: white;">Configure a API Key do Google Maps</div>';return}if(!window.google||!window.google.maps){let o=document.createElement("script");o.src=`https://maps.googleapis.com/maps/api/js?key=${this._config.api_key}`,o.onload=()=>{this._initializeMap()},document.head.appendChild(o)}else this._initializeMap()}catch(e){console.error("Erro ao definir configura\xE7\xE3o no card:",e)}}_normalizeConfig(t){if(!t||typeof t!="object")return{api_key:"",follow_entity:"",entities:[]};try{let e=A(t.entities||[]);return{...t,entities:e}}catch(e){return t}}_applyMapTypeOptions(){if(!this._map)return;let t=this._config.tipo_mapa||"roadmap",e=this._config.mostrar_tipo_mapa!==!1,o=`${t}|${e}`;this._lastMapTypeOptions!==o&&(this._lastMapTypeOptions=o,this._map.setOptions({mapTypeId:t,mapTypeControl:e}))}_applyMapControlsOptions(){if(!this._map)return;let t=this._config.mostrar_tela_cheia!==!1,e=this._config.mostrar_controles_navegacao!==!1,o=`${t}|${e}`;this._lastMapControlsOptions!==o&&(this._lastMapControlsOptions=o,this._map.setOptions({fullscreenControl:t,zoomControl:e}))}getCardSize(){return 6}_initializeMap(){this.mapContainer&&(this._map=new google.maps.Map(this.mapContainer,{center:{lat:-30.0277,lng:-51.2287},zoom:17,streetViewControl:!1,mapTypeControl:this._config.mostrar_tipo_mapa!==!1,mapTypeId:this._config.tipo_mapa||"roadmap",fullscreenControl:this._config.mostrar_tela_cheia!==!1,zoomControl:this._config.mostrar_controles_navegacao!==!1}),this._setupMapInteractionListeners(),this._renderControls(),setTimeout(()=>{this._applyNightMode()},50),this._config.historico_carregar_no_start!==!1&&this._loadHistoryForEntities().then(()=>{this._config.entities&&this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)})}),this._config.entities&&this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)}),this._shouldFollow()&&this._fitMapBounds(),this.trafficLayer=new google.maps.TrafficLayer,this._toggleTrafficLayer())}_updateMap(){this._config.entities&&(this._config.entities.forEach(t=>{this._addOrUpdateMarker(t)}),this._shouldFollow()&&this._fitMapBounds())}_shouldFollow(){if(this._followPausedByUser)return!1;if(this._config.follow_entity&&this._config.follow_entity!==""){let t=this._hass.states[this._config.follow_entity];if(!this._uiState.followOverride)return t&&t.state==="on"}return this._config.mostrar_menu===!1&&!this._config.follow_entity?this._config.seguir_on===!0:this._uiState.followEnabled}_setupMapInteractionListeners(){if(!this._map)return;let t=null,e=()=>{t||(t=setTimeout(()=>{t=null},100),this._handleUserInteraction())};this.mapContainer.addEventListener("mousedown",e),this.mapContainer.addEventListener("touchstart",e,{passive:!0}),this.mapContainer.addEventListener("wheel",e,{passive:!0})}_handleUserInteraction(){var o,i,r;if(this._isPerformingProgrammaticMove||!(this._config.follow_entity&&this._config.follow_entity!==""?((r=(i=(o=this._hass)==null?void 0:o.states)==null?void 0:i[this._config.follow_entity])==null?void 0:r.state)==="on"&&!this._uiState.followOverride:this._config.mostrar_menu===!1&&!this._config.follow_entity?this._config.seguir_on===!0:this._uiState.followEnabled))return;this._followResumeTimer&&clearTimeout(this._followResumeTimer),this._followCountdownInterval&&clearInterval(this._followCountdownInterval);let e=this._followPausedByUser;this._followPausedByUser=!0,this._followResumeTime=Date.now()+1e4,e||this._updateFollowCountdown(),this._followCountdownInterval=setInterval(()=>{this._updateFollowCountdown()},100),this._followResumeTimer=setTimeout(()=>{this._followPausedByUser=!1,this._followResumeTimer=null,this._followResumeTime=null,this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()},1e4)}_updateFollowCountdown(){if(!this.followCountdownElement||!this._followResumeTime||!this.followCountdownProgressCircle)return;let t=1e4,e=this._followResumeTime-Date.now();if(e<=0){this._hideFollowCountdown();return}let o=1-e/t,r=2*Math.PI*19*(1-o);this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",r),this.followCountdownElement.classList.add("visible")}_hideFollowCountdown(){if(this.followCountdownElement&&(this.followCountdownElement.classList.remove("visible"),this.followCountdownProgressCircle)){let t=2*Math.PI*19;this.followCountdownProgressCircle.setAttribute("stroke-dashoffset",t)}}_resumeFollowImmediately(){this._followResumeTimer&&(clearTimeout(this._followResumeTimer),this._followResumeTimer=null),this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._followPausedByUser=!1,this._followResumeTime=null,this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()}_applyNightMode(){var i;if(!this._map)return;if(!this._hass&&this._config.modo_noturno&&typeof this._config.modo_noturno=="string"&&this._config.modo_noturno!==""){setTimeout(()=>this._applyNightMode(),100);return}let t=[{elementType:"geometry",stylers:[{color:"#212121"}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{elementType:"labels.text.stroke",stylers:[{color:"#212121"}]},{featureType:"administrative",elementType:"geometry",stylers:[{color:"#757575"}]},{featureType:"administrative.country",elementType:"labels.text.fill",stylers:[{color:"#9e9e9e"}]},{featureType:"administrative.land_parcel",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#bdbdbd"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#181818"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"poi.park",elementType:"labels.text.stroke",stylers:[{color:"#1b1b1b"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#2c2c2c"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#8a8a8a"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#373737"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#3c3c3c"}]},{featureType:"road.highway.controlled_access",elementType:"geometry",stylers:[{color:"#4e4e4e"}]},{featureType:"road.local",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"transit",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#000000"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#3d3d3d"}]}],e=this._config.modo_noturno,o=this._uiState.nightModeEnabled;typeof e=="string"&&e!==""&&!this._uiState.nightModeOverride?o=((i=this._hass.states[e])==null?void 0:i.state)==="on":!e&&this._config.mostrar_menu===!1&&this._config.modo_noturno_on===!0&&(o=!0),this._map.setOptions({styles:o?t:[]})}_toggleTrafficLayer(){var o;if(!this.trafficLayer)return;let t=this._config.transito,e=this._uiState.trafficEnabled;typeof t=="string"&&t!==""&&!this._uiState.trafficOverride?e=((o=this._hass.states[t])==null?void 0:o.state)==="on":!t&&this._config.mostrar_menu===!1&&this._config.transito_on===!0&&(e=!0),e?this.trafficLayer.setMap(this._map):this.trafficLayer.setMap(null)}_addOrUpdateMarker(t){if(!this._hass||!this._hass.states)return;let e=this._hass.states[t.entity],o=t.condition?this._hass.states[t.condition]:null,i=t.condition?o&&o.state==="on":this._uiState.entityVisibility[t.entity]!==!1;if(e&&e.state!=="unavailable"&&i){if(!e.attributes.latitude||!e.attributes.longitude)return;let r=new google.maps.LatLng(e.attributes.latitude,e.attributes.longitude),a=this.markers[t.entity],n=this._getInfoBoxText(t),l,d=this.lastPositions[t.entity],m=0,h=0;d?(m=r.lng()-d.lng,h=r.lat()-d.lat,Math.abs(m)>1e-5||Math.abs(h)>1e-5?l=Math.atan2(h,m)*(180/Math.PI):l=d.rotation!==999?d.rotation:999):l=999;let _=this._getArrowFromRotation(l);this.lastPositions[t.entity]={lat:r.lat(),lng:r.lng(),rotation:l},this._recordTrailPoint(t.entity,r,t);let c=this._getEntityDisplayName(t,e),p=this._uiState.rotateImageEnabled===!0;if(p?a&&a instanceof google.maps.Marker&&(a.setMap(null),a=null):a&&typeof a.draw=="function"&&!(a instanceof google.maps.Marker)&&(a.setMap(null),a=null),p){let f=0;l!==999?f=180-l:f=0;let w=t.image_rotated||t.image||e.attributes.entity_picture||"";if(a){a.position=r,a.rotation=f;let b=w;a.imageUrl!==b&&(a.imageUrl=b,a.img_&&(a.img_.src=b)),a.draw()}else{let b=w,x=document.createElement("img");x.src=b,x.style.width="60px",x.style.height="60px",x.style.transform=`rotate(${f}deg)`,a=new google.maps.OverlayView,a.position=r,a.rotation=f,a.imageUrl=b,a.onAdd=function(){let g=document.createElement("div");g.style.position="absolute",g.style.width="60px",g.style.height="60px",g.style.cursor="pointer";let y=document.createElement("img");y.src=this.imageUrl,y.style.width="100%",y.style.height="100%",y.style.position="absolute",y.style.top="0",y.style.left="0",g.appendChild(y),this.div_=g,this.img_=y,this.getPanes().overlayLayer.appendChild(g)},a.draw=function(){let g=this.getProjection();if(!g||!this.position)return;let y=g.fromLatLngToDivPixel(this.position),v=this.div_;v&&(v.style.left=y.x-30+"px",v.style.top=y.y-30+"px",v.style.transform=`rotate(${this.rotation}deg)`)},a.onRemove=function(){this.div_&&(this.div_.parentNode.removeChild(this.div_),this.div_=null)},a.getPosition=function(){return this.position},a.setMap(this._map),this.markers[t.entity]=a}}else if(a)a.setPosition(r),a.setTitle(c);else{let f={url:t.image||e.attributes.entity_picture||"",scaledSize:new google.maps.Size(60,60),anchor:new google.maps.Point(30,30)};a=new google.maps.Marker({position:r,map:this._map,title:c,icon:f}),this.markers[t.entity]=a}this.infoBoxes[t.entity]&&this.infoBoxes[t.entity].setMap(null);let u=new google.maps.OverlayView;u.onAdd=function(){let f=document.createElement("div");f.className="info-box";let w=this._parent._uiState.arrowEnabled?`<div class="arrow-box">${_} <!-- seta --></div>`:"";f.innerHTML=`
          ${w}
          ${n}
        `,this.div_=f,this.getPanes().overlayLayer.appendChild(f)},u._parent=this,u.draw=function(){let w=this.getProjection().fromLatLngToDivPixel(r),b=this.div_,x=0,g=-50;if(p&&(g=-65),p&&l!==999){let y=180-l,v=65,N=v,S=y*(Math.PI/180);x=v*Math.sin(S),g=-N*Math.cos(S)}b.style.left=`${w.x+x}px`,b.style.top=`${w.y+g}px`,b.style.transform="translate(-50%, -50%)"},u.onRemove=function(){this.div_.parentNode.removeChild(this.div_),this.div_=null},u.setMap(this._map),this.infoBoxes[t.entity]=u,this._renderTrail(t.entity,t),this._shouldFollow()&&this._centerOnMarkerWithPadding(r)}else this.markers[t.entity]&&(this.markers[t.entity].setMap(null),delete this.markers[t.entity]),this.infoBoxes[t.entity]&&(this.infoBoxes[t.entity].setMap(null),delete this.infoBoxes[t.entity]),this._clearTrail(t.entity)}_initializeEntityVisibility(){!this._config||!this._config.entities||this._config.entities.forEach(t=>{t.entity in this._uiState.entityVisibility||(this._uiState.entityVisibility[t.entity]=!0)})}_renderControls(){var f,w,b,x,g,y,v,N,S;if(!this.controlsContainer||(this.controlsContainer.innerHTML="",this._config.mostrar_menu===!1))return;let t=document.createElement("div");t.className="map-controls-left",this._config.entities&&this._config.entities.forEach(E=>{var U,R,j;if(E.condition)return;let C=(R=(U=this._hass)==null?void 0:U.states)==null?void 0:R[E.entity],z=this._uiState.entityVisibility[E.entity]!==!1,F=E.image||((j=C==null?void 0:C.attributes)==null?void 0:j.entity_picture)||"";if(F){let I=document.createElement("img");I.className=`entity-icon-button${z?"":" inactive"}`,I.src=F,I.title=this._getEntityDisplayName(E,C),I.addEventListener("click",()=>{this._uiState.entityVisibility[E.entity]=!z,this._saveUIState(),this._renderControls(),this._addOrUpdateMarker(E)}),t.appendChild(I)}});let e=document.createElement("div");e.className="map-controls-right";let o=document.createElement("button");o.className=`options-button${this._optionsMenuOpen?" active":""}`,o.innerHTML="\u2699\uFE0F Op\xE7\xF5es",o.addEventListener("click",E=>{E.stopPropagation(),this._optionsMenuOpen=!this._optionsMenuOpen,this._renderControls()}),e.appendChild(o);let i=document.createElement("div");i.className=`options-menu${this._optionsMenuOpen?" open":""}`;let r=document.createElement("label"),a=document.createElement("input");a.type="checkbox",typeof this._config.transito=="string"&&this._config.transito!==""&&!this._uiState.trafficOverride?a.checked=((b=(w=(f=this._hass)==null?void 0:f.states)==null?void 0:w[this._config.transito])==null?void 0:b.state)==="on":a.checked=this._uiState.trafficEnabled,a.addEventListener("change",()=>{this._uiState.trafficOverride=!0,this._uiState.trafficEnabled=a.checked,this._saveUIState(),this._toggleTrafficLayer()}),r.appendChild(a),r.appendChild(document.createTextNode("Tr\xE2nsito")),i.appendChild(r);let n=document.createElement("label"),l=document.createElement("input");l.type="checkbox",typeof this._config.modo_noturno=="string"&&this._config.modo_noturno!==""&&!this._uiState.nightModeOverride?l.checked=((y=(g=(x=this._hass)==null?void 0:x.states)==null?void 0:g[this._config.modo_noturno])==null?void 0:y.state)==="on":l.checked=this._uiState.nightModeEnabled,l.addEventListener("change",()=>{this._uiState.nightModeOverride=!0,this._uiState.nightModeEnabled=l.checked,this._saveUIState(),this._applyNightMode()}),n.appendChild(l),n.appendChild(document.createTextNode("Modo Noturno")),i.appendChild(n);let d=document.createElement("label"),m=document.createElement("input");m.type="checkbox",typeof this._config.follow_entity=="string"&&this._config.follow_entity!==""&&!this._uiState.followOverride?m.checked=((S=(N=(v=this._hass)==null?void 0:v.states)==null?void 0:N[this._config.follow_entity])==null?void 0:S.state)==="on":m.checked=this._uiState.followEnabled,m.addEventListener("change",()=>{this._uiState.followOverride=!0,this._uiState.followEnabled=m.checked,this._saveUIState(),this._followPausedByUser=!1,this._followResumeTimer&&(clearTimeout(this._followResumeTimer),this._followResumeTimer=null),this._followCountdownInterval&&(clearInterval(this._followCountdownInterval),this._followCountdownInterval=null),this._followResumeTime=null,this._hideFollowCountdown(),this._shouldFollow()&&this._fitMapBounds()}),d.appendChild(m),d.appendChild(document.createTextNode("Seguir")),i.appendChild(d);let h=document.createElement("div");h.className="options-menu-separator",i.appendChild(h);let _=document.createElement("label"),c=document.createElement("input");c.type="checkbox",c.checked=this._uiState.rotateImageEnabled,c.addEventListener("change",()=>{this._uiState.rotateImageEnabled=c.checked,this._saveUIState(),this._config.entities&&this._config.entities.forEach(E=>{this._addOrUpdateMarker(E)})}),_.appendChild(c),_.appendChild(document.createTextNode("Rota\xE7\xE3o")),i.appendChild(_);let p=document.createElement("label"),u=document.createElement("input");u.type="checkbox",u.checked=this._uiState.arrowEnabled,u.addEventListener("change",()=>{this._uiState.arrowEnabled=u.checked,this._saveUIState(),this._config.entities&&this._config.entities.forEach(E=>{this._addOrUpdateMarker(E)})}),p.appendChild(u),p.appendChild(document.createTextNode("Seta")),i.appendChild(p),this.controlsContainer.appendChild(t),this.controlsContainer.appendChild(e),this.controlsContainer.appendChild(i),this._optionsMenuOpen&&setTimeout(()=>{document.addEventListener("click",this._closeOptionsMenu.bind(this),{once:!0})},0)}_closeOptionsMenu(){this._optionsMenuOpen=!1,this._renderControls()}_getArrowFromRotation(t){return t>=-22.5&&t<22.5?"&rarr;":t>=22.5&&t<67.5?"&nearr;":t>=67.5&&t<112.5?"&uarr;":t>=112.5&&t<157.5?"&nwarr;":t>=157.5&&t<500||t<-157.5?"&larr;":t>=-157.5&&t<-112.5?"&swarr;":t>=-112.5&&t<-67.5?"&darr;":t>=-67.5&&t<-22.5?"&searr;":"&bull;"}_getEntityDisplayName(t,e){var o;return t.name?t.name:((o=e==null?void 0:e.attributes)==null?void 0:o.friendly_name)||t.entity}_getInfoBoxText(t){let e="";if(t.velocidade&&this._hass&&this._hass.states[t.velocidade]){let o=parseFloat(this._hass.states[t.velocidade].state).toFixed(0);e+=`<div class="velocidade"> ${o} km/h</div>`}if(t.altitude&&this._hass&&this._hass.states[t.altitude]){let o=parseFloat(this._hass.states[t.altitude].state).toFixed(0);e+=`<div class="altitude"> &#9650; ${o} m</div>`}return e}_fitMapBounds(){if(!this._map||!this.markers||Object.keys(this.markers).length===0)return;this._isPerformingProgrammaticMove=!0;let t=new google.maps.LatLngBounds;Object.values(this.markers).forEach(o=>{t.extend(o.getPosition())});let e=this._shouldFollow()?{top:100,right:50,bottom:50,left:50}:0;this._map.fitBounds(t,e),google.maps.event.addListenerOnce(this._map,"bounds_changed",()=>{this._map.getZoom()>18&&this._map.setZoom(18)}),google.maps.event.addListenerOnce(this._map,"idle",()=>{this._isPerformingProgrammaticMove=!1})}_centerOnMarkerWithPadding(t){if(!this._map)return;this._isPerformingProgrammaticMove=!0,this._lastProgrammaticMoveTime=Date.now();let e=new google.maps.LatLngBounds;e.extend(t);let o=.002,i=.001;e.extend(new google.maps.LatLng(t.lat()+o,t.lng())),e.extend(new google.maps.LatLng(t.lat()-o*.3,t.lng())),e.extend(new google.maps.LatLng(t.lat(),t.lng()+i)),e.extend(new google.maps.LatLng(t.lat(),t.lng()-i)),this._map.fitBounds(e,{top:100,right:50,bottom:50,left:50}),google.maps.event.addListenerOnce(this._map,"bounds_changed",()=>{this._map.getZoom()>18&&this._map.setZoom(18),setTimeout(()=>{this._isPerformingProgrammaticMove=!1,this._lastProgrammaticMoveTime=Date.now()},500)})}};var P=class extends HTMLElement{constructor(){super(),this._updating=!1}setConfig(t){try{let e=this._normalizeConfig(t||{});this._config=e,this._rendered&&this._hass?this._syncFormData():!this._rendered&&this._hass&&this._render()}catch(e){console.error("Erro ao definir configura\xE7\xE3o:",e,t),this._config=t||{},this._rendered&&this._hass&&this._syncFormData()}}set hass(t){this._hass=t,this._hass&&(this._rendered&&!this._updating?this._syncFormData():!this._rendered&&this._config&&this._render())}_render(){if(!this._hass)return;this._rendered=!0,this.innerHTML="";let t=document.createElement("ha-form");t.hass=this._hass;let e=this._normalizeConfig(this._config||{}),o;try{o=JSON.parse(JSON.stringify(e))}catch(i){console.error("Erro ao criar c\xF3pia dos dados:",i),o={...e}}o.api_key=o.api_key||"",o.follow_entity=o.follow_entity||"",o.modo_noturno=o.modo_noturno||"",o.transito=o.transito||"",o.mostrar_menu=o.mostrar_menu!==!1,o.mostrar_tipo_mapa=o.mostrar_tipo_mapa!==!1,o.tipo_mapa=o.tipo_mapa||"roadmap",o.mostrar_tela_cheia=o.mostrar_tela_cheia!==!1,o.mostrar_controles_navegacao=o.mostrar_controles_navegacao!==!1,o.ocultar_creditos=o.ocultar_creditos===!0,o.transito_on=o.transito_on===!0,o.modo_noturno_on=o.modo_noturno_on===!0,o.seguir_on=o.seguir_on===!0,o.rotacao_on=o.rotacao_on===!0,o.historico_somente_rastro=o.historico_somente_rastro!==!1,o.historico_carregar_no_start=o.historico_carregar_no_start!==!1,o.historico_recarregar=o.historico_recarregar===!0,o.historico_limite_pontos=Number.isFinite(o.historico_limite_pontos)?o.historico_limite_pontos:null,o.max_height=o.max_height||null,o.max_width=o.max_width||null,o.entities=o.entities||[],t.schema=this._buildSchema(),t.computeLabel=i=>i.label||i.name,t.data=o,t.addEventListener("value-changed",i=>{if(!this._updating)try{this._updating=!0,this._dispatchConfigChanged(i.detail.value)}catch(r){console.error("Erro ao processar mudan\xE7a de valor:",r)}finally{setTimeout(()=>{this._updating=!1},100)}}),this.appendChild(t),this._form=t,requestAnimationFrame(()=>{this._form&&this._form.data!==o&&(this._form.data=o)})}_syncFormData(){if(this._form&&!this._updating&&this._hass)try{this._updating=!0,this._form.hass=this._hass;let t=this._normalizeConfig(this._config||{}),e;try{e=JSON.parse(JSON.stringify(t))}catch(o){e={...t}}this._form.data=e}catch(t){console.error("Erro ao sincronizar dados do form:",t,this._config)}finally{setTimeout(()=>{this._updating=!1},50)}}_buildSchema(){return[{name:"api_key",label:"Google Maps API Key",required:!0,selector:{text:{}}},{name:"follow_entity",label:"Entidade para seguir (booleana, opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"modo_noturno",label:"Entidade modo noturno (opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"transito",label:"Entidade transito (opcional)",selector:{entity:{domain:"input_boolean"}}},{name:"transito_on",label:"Transito ligado (sem entidade)",selector:{boolean:{}}},{name:"mostrar_menu",label:"Mostrar menu superior (opcional)",selector:{boolean:{}}},{name:"mostrar_tipo_mapa",label:"Mostrar bot\xF5es Mapa/Sat\xE9lite (opcional)",selector:{boolean:{}}},{name:"mostrar_tela_cheia",label:"Mostrar bot\xE3o tela cheia (opcional)",selector:{boolean:{}}},{name:"mostrar_controles_navegacao",label:"Mostrar controles de navega\xE7\xE3o (opcional)",selector:{boolean:{}}},{name:"ocultar_creditos",label:"Ocultar cr\xE9ditos/termos do mapa (opcional)",selector:{boolean:{}}},{name:"historico_somente_rastro",label:"Hist\xF3rico: carregar s\xF3 se rastro ativo",selector:{boolean:{}}},{name:"historico_carregar_no_start",label:"Hist\xF3rico: carregar ao iniciar",selector:{boolean:{}}},{name:"historico_recarregar",label:"Hist\xF3rico: recarregar ao alterar config",selector:{boolean:{}}},{name:"historico_limite_pontos",label:"Hist\xF3rico: limite de pontos (opcional)",selector:{number:{min:10,max:1e4,step:10}}},{name:"modo_noturno_on",label:"Modo noturno ligado (sem entidade)",selector:{boolean:{}}},{name:"seguir_on",label:"Seguir ligado (sem entidade)",selector:{boolean:{}}},{name:"rotacao_on",label:"Rota\xE7\xE3o ligada (sem menu)",selector:{boolean:{}}},{name:"tipo_mapa",label:"Tipo de mapa (opcional)",selector:{select:{options:[{label:"Mapa",value:"roadmap"},{label:"Sat\xE9lite",value:"satellite"},{label:"H\xEDbrido",value:"hybrid"},{label:"Terreno",value:"terrain"}]}}},{name:"max_height",label:"Altura m\xE1xima do mapa em pixels (opcional)",selector:{number:{min:100,max:2e3,step:10,unit_of_measurement:"px"}}},{name:"max_width",label:"Largura m\xE1xima do mapa em pixels (opcional)",selector:{number:{min:100,max:2e3,step:10,unit_of_measurement:"px"}}},{name:"entities",label:"Entidades",selector:{object:{multiple:!0,label_field:"entity",fields:{entity:{label:"Entidade",required:!0,selector:{entity:{}}},name:{label:"Nome personalizado (opcional)",selector:{text:{}}},image:{label:"Imagem (opcional)",selector:{text:{}}},image_rotated:{label:"Imagem Rotacionada (opcional, beta)",selector:{text:{}}},rastro:{label:"Rastro (opcional)",selector:{boolean:{}}},rastro_duracao_min:{label:"Rastro: dura\xE7\xE3o em minutos (opcional)",selector:{number:{min:1,max:1440,step:1,unit_of_measurement:"min"}}},rastro_pontos_por_min:{label:"Rastro: pontos por minuto (opcional)",selector:{number:{min:1,max:120,step:1}}},rastro_max_pontos:{label:"Rastro: m\xE1ximo de pontos (opcional)",selector:{number:{min:10,max:1e4,step:10}}},rastro_cor:{label:"Rastro: cor (opcional)",selector:{color_rgb:{}}},velocidade:{label:"Sensor de velocidade (opcional)",selector:{entity:{}}},altitude:{label:"Sensor de altitude (opcional)",selector:{entity:{}}},condition:{label:"Condicao (opcional)",selector:{entity:{domain:"input_boolean"}}}}}}}]}_normalizeConfig(t){if(!t||typeof t!="object")return{api_key:"",follow_entity:"",max_height:null,max_width:null,entities:[]};try{let e=A(t.entities||[]),o={api_key:t.api_key||"",follow_entity:t.follow_entity||"",modo_noturno:t.modo_noturno||"",transito:t.transito||"",mostrar_menu:t.mostrar_menu!==!1,mostrar_tipo_mapa:t.mostrar_tipo_mapa!==!1,tipo_mapa:t.tipo_mapa||"roadmap",mostrar_tela_cheia:t.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:t.mostrar_controles_navegacao!==!1,ocultar_creditos:t.ocultar_creditos===!0,transito_on:t.transito_on===!0,modo_noturno_on:t.modo_noturno_on===!0,seguir_on:t.seguir_on===!0,rotacao_on:t.rotacao_on===!0,historico_somente_rastro:t.historico_somente_rastro!==!1,historico_carregar_no_start:t.historico_carregar_no_start!==!1,historico_recarregar:t.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(t.historico_limite_pontos)?t.historico_limite_pontos:null,max_height:t.max_height||null,max_width:t.max_width||null,entities:e};return Object.keys(t).forEach(i=>{o.hasOwnProperty(i)||(o[i]=t[i])}),o}catch(e){return console.error("Erro ao normalizar configura\xE7\xE3o:",e,t),{api_key:t.api_key||"",follow_entity:t.follow_entity||"",modo_noturno:t.modo_noturno||"",transito:t.transito||"",mostrar_menu:t.mostrar_menu!==!1,mostrar_tipo_mapa:t.mostrar_tipo_mapa!==!1,tipo_mapa:t.tipo_mapa||"roadmap",mostrar_tela_cheia:t.mostrar_tela_cheia!==!1,mostrar_controles_navegacao:t.mostrar_controles_navegacao!==!1,ocultar_creditos:t.ocultar_creditos===!0,transito_on:t.transito_on===!0,modo_noturno_on:t.modo_noturno_on===!0,seguir_on:t.seguir_on===!0,rotacao_on:t.rotacao_on===!0,historico_somente_rastro:t.historico_somente_rastro!==!1,historico_carregar_no_start:t.historico_carregar_no_start!==!1,historico_recarregar:t.historico_recarregar===!0,historico_limite_pontos:Number.isFinite(t.historico_limite_pontos)?t.historico_limite_pontos:null,max_height:t.max_height||null,max_width:t.max_width||null,entities:Array.isArray(t.entities)?t.entities:[]}}}_dispatchConfigChanged(t){if(!(!t||typeof t!="object"))try{let e=this._normalizeConfig(t);this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}catch(e){console.error("Erro ao despachar mudan\xE7a de configura\xE7\xE3o:",e),this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}}};customElements.get("google-maps-car-card-cadu")||customElements.define("google-maps-car-card-cadu",M);customElements.get("google-maps-car-card-cadu-editor")||customElements.define("google-maps-car-card-cadu-editor",P);M.getConfigElement=function(){return document.createElement("google-maps-car-card-cadu-editor")};M.getStubConfig=function(){return{api_key:"",follow_entity:"",entities:[]}};window.customCards=window.customCards||[];window.customCards.push({type:"google-maps-car-card-cadu",name:"Google Maps Car Card Cadu",description:"Exibe dispositivos no Google Maps com InfoBox personalizado."});var H=["entity","name","icon","show_state","show_condition","position","decimals","background_color","background_color_opacity","border_width","border_color","text_color","tap_action"];function T(s){var i;if(!s)return"";let t=r=>Math.max(0,Math.min(255,Number(r)||0)),e=r=>t(r).toString(16).padStart(2,"0"),o=r=>{if(r==null||r==="")return null;let a=Number(r);return Number.isFinite(a)?a>1?Math.max(0,Math.min(1,a/100)):Math.max(0,Math.min(1,a)):null};if(Array.isArray(s)&&s.length>=3){let[r,a,n]=s;return`#${e(r)}${e(a)}${e(n)}`}if(typeof s=="object"){let r=o((i=s.alpha)!=null?i:s.opacity),a=s.color;if(!a&&["r","g","b"].every(n=>n in s)&&(a={r:s.r,g:s.g,b:s.b}),Array.isArray(a)&&a.length>=3){let[n,l,d]=a;return r===null?`#${e(n)}${e(l)}${e(d)}`:`rgba(${t(n)}, ${t(l)}, ${t(d)}, ${r})`}if(a&&typeof a=="object"){let{r:n,g:l,b:d}=a;return r===null?`#${e(n)}${e(l)}${e(d)}`:`rgba(${t(n)}, ${t(l)}, ${t(d)}, ${r})`}}if(typeof s=="string"&&s.trim()!==""){let r=s.trim(),a=r.match(/^#([0-9a-fA-F]{8})$/);if(a){let n=a[1],l=parseInt(n.slice(0,2),16),d=parseInt(n.slice(2,4),16),m=parseInt(n.slice(4,6),16),h=parseInt(n.slice(6,8),16)/255;return`rgba(${l}, ${d}, ${m}, ${h})`}return r}return""}function D(s){if(!s||typeof s!="object"||Array.isArray(s))return{entity:"",name:"",icon:"",show_state:!1,show_condition:"",position:"bottom",decimals:1,background_color:"",background_color_opacity:null,border_width:0,border_color:"",text_color:"",tap_action:{}};try{let t=Object.keys(s).filter(r=>/^\d+$/.test(r)),e=s.background_color_opacity,o=s.border_width,i={entity:s.entity||"",name:s.name||"",icon:s.icon||"",show_state:s.show_state===!0,show_condition:typeof s.show_condition=="string"?s.show_condition:"",position:s.position||"bottom",decimals:Number.isFinite(s.decimals)?s.decimals:1,background_color:T(s.background_color),background_color_opacity:e!=null&&Number.isFinite(Number(e))?Math.max(0,Math.min(100,Number(e))):null,border_width:o!=null&&Number.isFinite(Number(o))?Math.max(0,Math.min(2,Number(o))):0,border_color:T(s.border_color),text_color:T(s.text_color),tap_action:s.tap_action||{}};return Object.keys(s).forEach(r=>{!/^\d+$/.test(r)&&i[r]===void 0&&(i[r]=s[r])}),t.length>0&&t.forEach(r=>{let a=Number(r);if(isNaN(a)||a<0||a>=H.length)return;let n=H[a];n&&i[n]===""&&s[r]&&(i[n]=s[r])}),i}catch(t){console.error("Erro ao normalizar entidade:",t,s);let e=s.background_color_opacity,o=s.border_width;return{entity:s.entity||"",name:s.name||"",icon:s.icon||"",show_state:s.show_state===!0,show_condition:typeof s.show_condition=="string"?s.show_condition:"",position:s.position||"bottom",decimals:Number.isFinite(s.decimals)?s.decimals:1,background_color:T(s.background_color),background_color_opacity:e!=null&&Number.isFinite(Number(e))?Math.max(0,Math.min(100,Number(e))):null,border_width:o!=null&&Number.isFinite(Number(o))?Math.max(0,Math.min(2,Number(o))):0,border_color:T(s.border_color),text_color:T(s.text_color),tap_action:s.tap_action||{},...s}}}function $(s,t){if(!s||typeof s!="string")return s||"";let e=Number(t);if(!Number.isFinite(e))return s;let o=Math.max(0,Math.min(1,e/100)),i=l=>Math.max(0,Math.min(255,Number(l)||0)),r=s.match(/^#([0-9a-fA-F]{6})$/);if(r){let l=r[1];return`rgba(${parseInt(l.slice(0,2),16)}, ${parseInt(l.slice(2,4),16)}, ${parseInt(l.slice(4,6),16)}, ${o})`}let a=s.match(/^#([0-9a-fA-F]{8})$/);if(a){let l=a[1];return`rgba(${parseInt(l.slice(0,2),16)}, ${parseInt(l.slice(2,4),16)}, ${parseInt(l.slice(4,6),16)}, ${o})`}let n=s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/);return n?`rgba(${n[1]}, ${n[2]}, ${n[3]}, ${o})`:s}function W(s){if(Array.isArray(s))return s.filter(t=>t!=null).map(t=>{try{return D(typeof t=="string"?{entity:t}:t)}catch(e){return console.error("Erro ao normalizar entidade:",e,t),t}});if(s&&typeof s=="object"){let e=Object.keys(s).filter(o=>/^\d+$/.test(o)).sort((o,i)=>Number(o)-Number(i)).map(o=>s[o]);if(e.length>0)return W(e)}return[]}function O(s){if(!s||typeof s!="object")return{title:"",title_icon:"",title_secondary:"",subtitle:"",image:"",image_media_content_id:"",image_entity:"",aspect_ratio:"1.5",fit_mode:"cover",camera_view:"auto",tap_action:{action:"more-info"},entities:[]};try{let t=a=>typeof a=="string"?a:a&&typeof a=="object"&&(a.icon||a.value)||"",e=W(s.entities||[]),o="";s.image&&typeof s.image=="object"&&(o=s.image.media_content_id||""),s.image_media_content_id&&(o=s.image_media_content_id);let i=o?{media_content_id:o}:typeof s.image=="string"?s.image:"",r={title:s.title||"",title_icon:t(s.title_icon),title_secondary:s.title_secondary||"",subtitle:s.subtitle||"",image:i,image_media_content_id:o,image_entity:s.image_entity||"",aspect_ratio:s.aspect_ratio||"1.5",fit_mode:s.fit_mode||"cover",camera_view:s.camera_view||"auto",tap_action:s.tap_action||{action:"more-info"},entities:e};return Object.keys(s).forEach(a=>{r.hasOwnProperty(a)||(r[a]=s[a])}),r}catch(t){console.error("Erro ao normalizar configura\xE7\xE3o:",t,s);let e=r=>typeof r=="string"?r:r&&typeof r=="object"&&(r.icon||r.value)||"",o="";s.image&&typeof s.image=="object"&&(o=s.image.media_content_id||""),s.image_media_content_id&&(o=s.image_media_content_id);let i=o?{media_content_id:o}:typeof s.image=="string"?s.image:"";return{title:s.title||"",title_icon:e(s.title_icon),title_secondary:s.title_secondary||"",subtitle:s.subtitle||"",image:i,image_media_content_id:o,image_entity:s.image_entity||"",aspect_ratio:s.aspect_ratio||"1.5",fit_mode:s.fit_mode||"cover",camera_view:s.camera_view||"auto",tap_action:s.tap_action||{action:"more-info"},entities:Array.isArray(s.entities)?s.entities:[]}}}var k=class s extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._styleElement=document.createElement("style"),this.shadowRoot.appendChild(this._styleElement),this._rendered=!1,this._templateCache=new Map,this._templateRequests=new Map}setConfig(t){this._config=O(t||{}),this._rendered?this._updateCard():this._hass&&this._initialRender()}set hass(t){this._hass=t,this._rendered?this._updateCard():this._config&&this._initialRender()}getCardSize(){return 3}_initialRender(){var m,h,_;if(!this.shadowRoot||!this._hass||!this._config||this._rendered)return;let t=this._parseAspectRatio((m=this._config)==null?void 0:m.aspect_ratio),e=((h=this._config)==null?void 0:h.fit_mode)||"cover";this._styleElement.textContent=`
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
    `;let o=document.createElement("ha-card"),i=document.createElement("div");i.className="picture-wrapper",i.style.setProperty("--po-aspect-ratio",String(t)),i.style.setProperty("--po-fit-mode",e),i.addEventListener("click",()=>{var c;this._handleAction((c=this._config)==null?void 0:c.tap_action,this._getPrimaryEntityId())});let r=document.createElement("div");r.className="picture-spacer",i.appendChild(r);let a=document.createElement("img");a.className="picture-image",a.alt=((_=this._config)==null?void 0:_.title)||"Imagem",a.loading="eager",a.decoding="async",i.appendChild(a);let n=document.createElement("div");n.className="picture-placeholder",n.textContent="Configure image ou image_entity",n.style.display="none",i.appendChild(n);let l=document.createElement("div");l.className="overlay-top",i.appendChild(l);let d=document.createElement("div");d.className="overlay",i.appendChild(d),o.appendChild(i),this.shadowRoot.appendChild(o),this._elements={card:o,pictureWrapper:i,img:a,placeholder:n,overlayTop:l,overlay:d},this._rendered=!0,this._updateCard()}_updateCard(){var d,m;if(!this._rendered||!this._elements)return;let{img:t,placeholder:e,overlayTop:o,overlay:i}=this._elements,r=this._getImageUrl(),a=!!((d=this._config)!=null&&d.image_entity),n=((m=this._config)==null?void 0:m.image_entity)||"",l=(r||"")!==(t.src||"");if(a&&!r){let h=this._getImageEntityCache(n);h?(t.src=h,t.style.display="block",e.style.display="none"):(t.src="",t.style.display="none",e.textContent="Carregando imagem\u2026",e.style.display="flex")}else if(l)if(r){let h=t.src&&t.complete&&t.naturalWidth>0,_=a?this._getImageEntityCache(n):null,c=()=>a&&this._saveImageEntityCache(n,r),p=()=>{t.style.display="block",e.style.display="none",c()};if(a&&_)if(t.onload=null,t.onerror=null,t.src=_,t.style.display="block",e.style.display="none",_!==r&&this._pendingImageUrl!==r){this._pendingImageUrl=r;let u=new Image;u.onload=()=>{var f;this._pendingImageUrl===r&&((f=this._elements)!=null&&f.img)&&(this._elements.img.src=r,p()),this._pendingImageUrl=null},u.onerror=()=>{this._pendingImageUrl=null},u.src=r}else _===r&&(t.complete&&t.naturalWidth?c():t.onload=c);else if(a&&h&&this._pendingImageUrl!==r){this._pendingImageUrl=r;let u=new Image;u.onload=()=>{var f;this._pendingImageUrl===r&&((f=this._elements)!=null&&f.img)&&(this._elements.img.src=r,p()),this._pendingImageUrl=null},u.onerror=()=>{this._pendingImageUrl=null},u.src=r}else a&&h||(t.onload=null,t.onerror=null,a?(e.textContent="Carregando imagem\u2026",e.style.display="flex",t.style.display="none",t.onload=()=>{e.style.display="none",t.style.display="block",c()},t.onerror=()=>{e.textContent="Erro ao carregar imagem",e.style.display="flex",t.style.display="none"}):(e.style.display="none",t.style.display="block"),t.src=r,a&&t.complete&&t.naturalWidth&&(e.style.display="none",t.style.display="block",c()))}else this._pendingImageUrl=null,t.src="",t.style.display="none",e.textContent="Configure image ou image_entity",e.style.display="flex";this._updateOverlayTop(o),this._updateOverlayBottom(i)}_isEntityVisible(t){let e=t==null?void 0:t.show_condition;if(!e||typeof e!="string"||e.trim()==="")return!0;let o=this._renderTemplate(e),i=String(o).trim().toLowerCase();return!(i===""||i==="false"||i==="no"||i==="0")}_updateOverlayTop(t){let o=this._getOverlayEntityConfigs().filter(i=>(i.position||"bottom")==="top").filter(i=>this._isEntityVisible(i));t.innerHTML="",o.length!==0&&o.forEach(i=>{let r=document.createElement("div");r.className="overlay-entity";let a=i.background_color||"rgba(255, 255, 255, 0.25)",n=i.background_color_opacity!=null?$(a,i.background_color_opacity):a,l=i.text_color||"#fff";r.style.background=n,r.style.color=l;let d=Number(i.border_width);d>0&&(r.style.borderWidth=`${d}px`,r.style.borderStyle="solid",r.style.borderColor=i.border_color||"rgba(255,255,255,0.5)"),r.addEventListener("click",h=>{var c;h.stopPropagation();let _=i.tap_action||((c=this._config)==null?void 0:c.tap_action);this._handleAction(_,i.entity)});let m=this._createEntityIcon(i);if(this._applyEntityIconOnOffColor(m,i.entity),r.appendChild(m),i.show_state===!0){let h=document.createElement("div");h.textContent=this._getEntityState(i.entity,i),r.appendChild(h)}t.appendChild(r)})}_updateOverlayBottom(t){var l,d,m,h;let e=((l=this._config)==null?void 0:l.title)||"",o=((d=this._config)==null?void 0:d.title_secondary)||"",i=this._renderTemplate(((m=this._config)==null?void 0:m.subtitle)||""),r=((h=this._config)==null?void 0:h.title_icon)||"",n=this._getOverlayEntityConfigs().filter(_=>(_.position||"bottom")==="bottom").filter(_=>this._isEntityVisible(_));if(t.innerHTML="",t.style.display=e||i||n.length>0?"flex":"none",e||i){let _=document.createElement("div");if(_.className="overlay-title-container",e){let c=document.createElement("div");if(c.className="overlay-title",r){let u=document.createElement("ha-icon");u.icon=r,c.appendChild(u)}let p=document.createElement("span");if(p.textContent=e,c.appendChild(p),o){let u=document.createElement("span");u.className="overlay-title-secondary",u.textContent=o,c.appendChild(u)}_.appendChild(c)}if(i){let c=document.createElement("div");c.className="overlay-subtitle",c.textContent=i,r?c.style.paddingLeft="24px":c.style.paddingLeft="0",_.appendChild(c)}t.appendChild(_)}else{let _=document.createElement("div");_.style.flex="1",t.appendChild(_)}if(n.length>0){let _=document.createElement("div");_.className="overlay-entities",n.forEach(c=>{let p=document.createElement("div");p.className="overlay-entity";let u=c.background_color||"rgba(255, 255, 255, 0.25)",f=c.background_color_opacity!=null?$(u,c.background_color_opacity):u,w=c.text_color||"#fff";p.style.background=f,p.style.color=w;let b=Number(c.border_width);b>0&&(p.style.borderWidth=`${b}px`,p.style.borderStyle="solid",p.style.borderColor=c.border_color||"rgba(255,255,255,0.5)"),p.addEventListener("click",g=>{var v;g.stopPropagation();let y=c.tap_action||((v=this._config)==null?void 0:v.tap_action);this._handleAction(y,c.entity)});let x=this._createEntityIcon(c);if(this._applyEntityIconOnOffColor(x,c.entity),p.appendChild(x),c.show_state===!0){let g=document.createElement("div");g.textContent=this._getEntityState(c.entity,c),p.appendChild(g)}_.appendChild(p)}),t.appendChild(_)}}_renderTemplate(t){if(!t||typeof t!="string")return"";if(!t.includes("{%")&&!t.includes("{{"))return t;try{if(!this._hass||!this._hass.connection)return"";let e=Date.now(),o=this._templateCache.get(t);if(o&&e-o.ts<1e3)return o.value;if(!this._templateRequests.has(t)){let i=this._hass.connection.subscribeMessage(r=>{let a=(r==null?void 0:r.result)||"";this._templateCache.set(t,{value:String(a),ts:Date.now()}),this._templateRequests.delete(t),i&&i(),requestAnimationFrame(()=>this._updateCard())},{type:"render_template",template:t});this._templateRequests.set(t,i)}return o?o.value:""}catch(e){return console.warn("Erro ao renderizar template:",e),""}}_parseAspectRatio(t){if(!t||typeof t!="string")return 1.5;let e=t.trim();if(e.includes(":")){let[i,r]=e.split(":").map(a=>Number(a));if(Number.isFinite(i)&&Number.isFinite(r)&&i>0&&r>0)return i/r}let o=Number(e);return Number.isFinite(o)&&o>0?o:1.5}_getImageUrl(){var e,o,i,r,a,n;let t="";if((e=this._config)!=null&&e.image)typeof this._config.image=="string"?t=this._config.image:typeof this._config.image=="object"&&(t=this._config.image.media_content_id||"");else{let l=(o=this._config)==null?void 0:o.image_entity;if(l&&this._hass){let d=(i=this._hass.states)==null?void 0:i[l];if(d)if(((r=this._config)==null?void 0:r.camera_view)==="live"&&l.startsWith("camera.")){let m=`/api/camera_proxy_stream/${l}`;t=this._resolveUrl(m)||m}else t=((a=d.attributes)==null?void 0:a.entity_picture)||((n=d.attributes)==null?void 0:n.image)||(typeof d.state=="string"?d.state:"")}}return this._resolveUrl(t)||t}_resolveUrl(t){if(!t||typeof t!="string")return"";let e=t.trim();return e.startsWith("/")&&this._hass&&typeof this._hass.hassUrl=="function"?this._hass.hassUrl(e):e}static _imageCacheKey(t){return"picture-overview-cadu-img-"+(t||"")}_getImageEntityCache(t){if(!t||typeof t!="string")return null;try{return localStorage.getItem(s._imageCacheKey(t))||null}catch(e){return null}}_saveImageEntityCache(t,e){if(!(!t||typeof t!="string"||!e))try{localStorage.setItem(s._imageCacheKey(t),String(e))}catch(o){}}_getPrimaryEntityId(){var e;let t=Array.isArray((e=this._config)==null?void 0:e.entities)?this._config.entities:[];return t.length>0?t[0].entity:null}_getOverlayEntityConfigs(){var e;return Array.isArray((e=this._config)==null?void 0:e.entities)?this._config.entities:[]}_getEntityName(t){var o,i,r;if(t!=null&&t.name)return t.name;let e=(i=(o=this._hass)==null?void 0:o.states)==null?void 0:i[t.entity];return((r=e==null?void 0:e.attributes)==null?void 0:r.friendly_name)||t.entity}_createEntityIcon(t){var r,a;let e=t==null?void 0:t.icon,o=(a=(r=this._hass)==null?void 0:r.states)==null?void 0:a[t.entity];if(o){let n=document.createElement("ha-state-icon");if(n.hass=this._hass,n.stateObj=o,e&&e!=="")n.icon=e;else{let l=this._getEntityIconFromState(o);l&&(n.icon=l)}return n}let i=document.createElement("ha-icon");return i.icon=e&&e!==""?e:"mdi:checkbox-blank-circle-outline",i}_getEntityIconFromState(t){var i,r;if(!t)return"";let e=(i=t.attributes)==null?void 0:i.icon;return e||(((r=t.attributes)==null?void 0:r.device_class)==="temperature"?"mdi:thermometer":"")}_applyEntityIconOnOffColor(t,e){var r,a;if(!t||!e||!((a=(r=this._hass)==null?void 0:r.states)!=null&&a[e]))return;let o=this._hass.states[e],i=String(o.state||"").toLowerCase();i==="on"?t.style.color="var(--state-icon-active-color, var(--state-active-color, #fdd835))":i==="off"||i==="unavailable"?t.style.color="var(--state-icon-inactive-color, var(--state-inactive-color, #9e9e9e))":t.style.color=""}_getEntityState(t,e=null){var l,d,m;let o=(d=(l=this._hass)==null?void 0:l.states)==null?void 0:d[t];if(!o)return"unavailable";let i=(m=o.attributes)==null?void 0:m.unit_of_measurement,r=Number.isFinite(e==null?void 0:e.decimals)?e.decimals:1,a=typeof o.state=="string"?o.state.replace(",","."):o.state,n=Number.parseFloat(a);if(Number.isFinite(n)){let h=n.toFixed(r);return i?`${h} ${i}`:h}return i?`${o.state} ${i}`:o.state}_handleAction(t,e){if(!t||t.action==="none")return;let o=t.action||"more-info";if(o==="more-info"){let i=t.entity||e;i&&this._fireEvent("hass-more-info",{entityId:i});return}if(o==="navigate"&&t.navigation_path){history.pushState(null,"",t.navigation_path),window.dispatchEvent(new Event("location-changed"));return}if(o==="url"&&t.url_path){window.location.href=t.url_path;return}if(o==="toggle"&&e&&this._hass){this._hass.callService("homeassistant","toggle",{entity_id:e});return}if(o==="call-service"&&t.service&&this._hass){let[i,r]=t.service.split(".");i&&r&&this._hass.callService(i,r,t.service_data||{})}}_fireEvent(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}};var L=class extends HTMLElement{constructor(){super(),this._updating=!1}setConfig(t){this._config=O(t||{}),this._rendered&&this._hass?this._syncFormData():!this._rendered&&this._hass&&this._render()}set hass(t){this._hass=t,this._hass&&(this._rendered&&!this._updating?this._syncFormData():!this._rendered&&this._config&&this._render())}_render(){if(!this._hass)return;if(this._rendered){this._form&&(this._form.hass=this._hass);return}this._rendered=!0,this.innerHTML="";let t=document.createElement("ha-form");t.hass=this._hass;let e=O(this._config||{});e=this._ensureEntitiesArray(e),t.schema=this._buildSchema(),t.computeLabel=o=>o.label||o.name,t.data=e,t.addEventListener("value-changed",o=>{JSON.stringify(this._config)!==JSON.stringify(o.detail.value)&&(this._config=o.detail.value,this._debounce&&clearTimeout(this._debounce),this._debounce=setTimeout(()=>{this._dispatchConfigChanged(this._config)},500))}),this.appendChild(t),this._form=t}_syncFormData(){}_ensureEntitiesArray(t){if(!t||typeof t!="object"||Array.isArray(t.entities))return t;if(t.entities&&typeof t.entities=="object"){let e=Object.keys(t.entities).filter(o=>/^\d+$/.test(o)).sort((o,i)=>Number(o)-Number(i)).map(o=>t.entities[o]);return{...t,entities:e}}return{...t,entities:[]}}_buildSchema(){return[{name:"title",label:"Titulo",selector:{text:{}}},{name:"title_icon",label:"Icone do titulo (opcional)",selector:{icon:{}}},{name:"title_secondary",label:"Titulo secundario (ao lado, menor)",selector:{text:{}}},{name:"subtitle",label:"Subtitulo (opcional, aceita template jinja)",selector:{template:{}}},{name:"image",label:"Imagem (url/local)",selector:{text:{}}},{name:"image_media_content_id",label:"Imagem (media_content_id)",selector:{text:{}}},{name:"image_entity",label:"Entidade de imagem (opcional)",selector:{entity:{}}},{name:"aspect_ratio",label:"Aspect ratio (ex: 1.5 ou 16:9)",selector:{text:{}}},{name:"fit_mode",label:"Fit mode",selector:{select:{options:[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"}]}}},{name:"camera_view",label:"Camera view",selector:{select:{options:[{label:"Auto",value:"auto"},{label:"Live",value:"live"}]}}},{name:"tap_action",label:"Tap action do card",selector:{ui_action:{}}},{name:"entities",label:"Entidades",selector:{object:{multiple:!0,label_field:"entity",fields:{entity:{label:"Entidade",required:!0,selector:{entity:{}}},name:{label:"Nome (opcional)",selector:{text:{}}},icon:{label:"Icone (opcional)",selector:{icon:{}}},show_state:{label:"Mostrar estado",selector:{boolean:{}}},show_condition:{label:"Condicao (template Jinja: true exibe, false oculta)",selector:{template:{}}},position:{label:"Posicao do overlay",selector:{select:{options:[{label:"Inferior",value:"bottom"},{label:"Superior direita",value:"top"}]}}},decimals:{label:"Casas decimais (padrao 1)",selector:{number:{min:0,max:4,step:1}}},background_color:{label:"Cor de fundo",selector:{color_rgb:{}}},background_color_opacity:{label:"Opacidade do fundo (%) \u2014 0 transparente, 100 opaco",selector:{number:{min:0,max:100,step:5,unit_of_measurement:"%"}}},border_width:{label:"Borda (px) \u2014 0 sem borda, 0.1 a 2",selector:{number:{min:0,max:2,step:.1,unit_of_measurement:"px"}}},border_color:{label:"Cor da borda (opcional)",selector:{color_rgb:{}}},text_color:{label:"Cor do texto (opcional)",selector:{color_rgb:{}}},tap_action:{label:"Tap action da entidade (opcional)",selector:{ui_action:{}}}}}}}]}_dispatchConfigChanged(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}};customElements.get("picture-overview-cadu")||customElements.define("picture-overview-cadu",k);customElements.get("picture-overview-cadu-editor")||customElements.define("picture-overview-cadu-editor",L);k.getConfigElement=function(){return document.createElement("picture-overview-cadu-editor")};k.getStubConfig=function(){return{title:"Picture Overview",aspect_ratio:"1.5",fit_mode:"cover",entities:[]}};window.customCards=window.customCards||[];window.customCards.push({type:"picture-overview-cadu",name:"Picture Overview Cadu",description:"Imagem com entities e tap_action estilo picture-glance."});
