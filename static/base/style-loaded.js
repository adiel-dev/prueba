(function(d,w,a,_){
 "use strict";
var app = _.Sl("#app"),vnf = (t)=>{
	var ytm = _.Sl("ytm-watch"), cr = a.Cr("div","cover center"),token = "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"

	_.Sl("title").textContent = "- YouTube"
  cr.appendChild(a.Cr("div", "playability-status-message"))
	cr.firstElementChild.textContent = t ?? "Este video no está disponible.";
  ytm.firstElementChild.appendChild(cr)
  throw("Error video ID")

  return false;
},BT,hload = (mode)=>{
 var hbar = _.Sl("ytm-mobile-topbar-renderer"),h = _.Sl("header");
 var nsr = _.Crw("div",{class: "mobile-topbar-header-content non-search-mode cbox"});
 const QM = (t)=>{
  switch(t){
    case "search":
     _.SA(h,"data-mode","search")
     sarch()
     break;
    case "watch":
     _.SA(h,"data-mode","watch")
     wth()
     break;
    case "searching":
     _.SA(h,"data-mode","searching")
     ing()
     break;
    case "browse":
     _.SA(h,"data-mode","browse")
     browse();
     break;
    case "unknown":
     _.SA(h,"data-mode","unknown")
     know()
     break;
  }
 },_b = async function(e){
    e.preventDefault();
    if (BT === undefined || BT == "" || BT.length < 2 || !BT.trim()) return !1;
    _.H("results?search_query="+encodeURIComponent(BT).replace(/%20/g, "+"))

    d.title = BT+" - YouTube";
    
    clar() || hload("search") || rwat() || rsulst() || _.spiner(true);

    if (_.chi(hbar) > 1) hbar.removeChild(hbar.firstChild);
    if (_.chi(app.childNodes[1]) > 0) app.childNodes[1].removeChild(app.childNodes[1].firstChild)

    var s = await _._re(`s?q=${encodeURIComponent(BT)}`, true)
    pgecont("ytsearch", (s.items ?? false))

    e.stopPropagation()
 },R = ()=>{
  var sbox = _.Crw("ytm-searchbox", {"class": "mobile-topbar-header-content search-mode"},
  _.Crw("form",{action: "/results",class: "searchbox-form cbox"})),bx = _.Crw("div", {class: "searchbox-input-wrapper", "data-has-rounded-searchbox": true})
  _.Crw("input",{class: "searchbox-input title", name:"search", placeholder: "Buscar en YouTube", autocomplete: "off", autocorrect: "off", spellcheck: true, type: "text"},false,bx)
  _.Crw("input",{type: "submit", hidden: ""},false,bx);
  _.Crw("button", {class: "icon-button", "arial-label": "Buscar en YouTube"},
      _.Crw("c3-icon",false),bx);
  _.Ren(`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
        <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path>
      </svg>`,bx.childNodes[2].lastElementChild);
    sbox.childNodes[0]["appendChild"](bx)
  
  //console.log()

  _.ev(sbox.firstChild.lastElementChild.firstChild,"input", function(r){
    BT = r.target.value;
    
  })
  _.ev(sbox.firstChild.lastElementChild.firstChild, "click", function(L){
      L.stopPropagation();
  })

  _.ev(sbox.childNodes[1],"input", function(r){
    BT = r.target.value;
  })
  _.ev(sbox.childNodes[1],"click", function(l){
    l.stopPropagation()
  })
  _.ev(sbox.firstChild, "input", function(r){
    BT = r.originalTarget.value

    if (!BT.trim()) return !1;
    r.query = BT;
    
    var v;
    v = BT;

   return !1;
  })

_.ev(sbox.childNodes[0].firstChild.lastElementChild, "click",_b);

    return sbox;
 },sarch = ()=>{
   var ytmlgo = _.Crw("ytm-home-logo", false,
    _.Crw("button", {"class": "mobile-topbar-header-endpoint", "aria-label": "YouTube", role:"link"},
    _.Crw("c3-icon", {"class": "mobile-topbar-logo", id: "home-icon"}
   )));
   _.Ren(`<svg viewBox="0 0 67 60" fill="">
     <path d="M63 14.87a7.885 7.885 0 00-5.56-5.56C52.54 8 32.88 8 32.88 8S13.23 8 8.32 9.31c-2.7.72-4.83 2.85-5.56 5.56C1.45 19.77 1.45 30 1.45 30s0 10.23 1.31 15.13c.72 2.7 2.85 4.83 5.56 5.56C13.23 52 32.88 52 32.88 52s19.66 0 24.56-1.31c2.7-.72 4.83-2.85 5.56-5.56C64.31 40.23 64.31 30 64.31 30s0-10.23-1.31-15.13z"></path><path fill="#FFF" class="logo-arrow" d="M26.6 39.43L42.93 30 26.6 20.57z"></path>
    </svg>`,ytmlgo.childNodes[0].firstChild);

   _.Crw("div",{class: "search-bar rounded-container", "data-has-rounded-searchbox": true},_.Crw("button",{class: "title search-bar-text"}),nsr)
    _.ev(nsr.childNodes[0].firstChild,"click",function(){
     QM("searching")
   })
    _.Crw("button",{class: "yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button"},_.Crw("div", {class: "yt-spec-button-shape-next__icon", "aria-hidden": true},_.Crw("c3-icon")),nsr);
    _.Ren(`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
         <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z"></path>
        </svg>`, nsr.childNodes[1].lastElementChild.firstChild)
 //console.log(nsr.childNodes[0].firstChild)

 var bv = nsr.childNodes[0].firstChild

 if (BT != "") bv["textContent"] = BT

 h["append"](ytmlgo,R(),nsr)
 },wth = () => {

   var ytmlgo = _.Crw("ytm-home-logo", false,
    _.Crw("button", {"class": "mobile-topbar-header-endpoint"},
    _.Crw("c3-icon", {"class": "mobile-topbar-logo ringo-logo"}
   )));

   _.Ren(`<svg viewBox="0 0 380.9 85.1">
     <path fill="#ff0000" d="M 60.699219 0.30078125 C 60.699219 0.30078125 22.699219 0.30078125 13.199219 2.8007812 C 7.9992187 4.2007813 3.9 8.3 2.5 13.5 C 0 23 0 42.699219 0 42.699219 C 0 42.699219 0 62.500391 2.5 71.900391 C 3.9 77.100391 7.9992188 81.199609 13.199219 82.599609 C 22.699219 85.099609 60.699219 85.099609 60.699219 85.099609 C 60.699219 85.099609 98.699219 85.099609 108.19922 82.599609 C 113.39922 81.199609 117.50039 77.100391 118.90039 71.900391 C 121.40039 62.400391 121.40039 42.699219 121.40039 42.699219 C 121.40039 42.699219 121.40039 23 118.90039 13.5 C 117.50039 8.3 113.39922 4.2007812 108.19922 2.8007812 C 98.699219 0.30078125 60.699219 0.30078125 60.699219 0.30078125 z M 48.5 24.5 L 80.099609 42.800781 L 48.5 61 L 48.5 24.5 z "></path>
     <path id="triangle" fill="#ffffff" d="M 48.5,61 80.1,42.8 48.5,24.5 Z"></path><path d="M147.1 55.5L133.5 6.2h11.9l4.8 22.3c1.2 5.5 2.1 10.2 2.7 14.1h.3c.4-2.8 1.3-7.4 2.7-14l5-22.4h11.9L159 55.5v23.7h-11.8l-.1-23.7zm29.2 22.1c-2.4-1.6-4.1-4.1-5.1-7.6-1-3.4-1.5-8-1.5-13.6v-7.7c0-5.7.6-10.3 1.7-13.8 1.2-3.5 3-6 5.4-7.6 2.5-1.6 5.7-2.4 9.7-2.4 3.9 0 7.1.8 9.5 2.4s4.1 4.2 5.2 7.6 1.7 8 1.7 13.8v7.7c0 5.7-.5 10.2-1.6 13.7-1.1 3.4-2.8 6-5.2 7.6-2.4 1.6-5.7 2.4-9.8 2.4-4.3-.1-7.6-.9-10-2.5zm13.5-8.3c.7-1.7 1-4.6 1-8.5V44.2c0-3.8-.3-6.6-1-8.4s-1.8-2.6-3.5-2.6c-1.6 0-2.8.9-3.4 2.6-.7 1.8-1 4.6-1 8.4v16.6c0 3.9.3 6.8 1 8.5.6 1.7 1.8 2.6 3.5 2.6 1.5 0 2.7-.9 3.4-2.6zm51.7-43.4v53.3h-9.4l-1-6.5h-.3c-2.5 4.9-6.4 7.4-11.5 7.4-3.5 0-6.1-1.2-7.8-3.5-1.7-2.3-2.5-5.9-2.5-10.9V25.9h12V65c0 2.4.3 4.1.8 5.1s1.4 1.5 2.6 1.5c1 0 2-.3 3-1 1-.6 1.7-1.4 2.1-2.4V25.9h12z"></path>
     <path d="M274.1 15.9h-11.9v63.3h-11.7V16h-11.9V6.4h35.5v9.5z"></path>
     <path d="M303 25.9v53.3h-9.4l-1-6.5h-.3c-2.5 4.9-6.4 7.4-11.5 7.4-3.5 0-6.1-1.2-7.8-3.5-1.7-2.3-2.5-5.9-2.5-10.9V25.9h12V65c0 2.4.3 4.1.8 5.1s1.4 1.5 2.6 1.5c1 0 2-.3 3-1 1-.6 1.7-1.4 2.1-2.4V25.9h12zm39.7 8.5c-.7-3.4-1.9-5.8-3.5-7.3s-3.9-2.3-6.7-2.3c-2.2 0-4.3.6-6.2 1.9-1.9 1.2-3.4 2.9-4.4 4.9h-.1V3.5h-11.6v75.7h9.9l1.2-5h.3c.9 1.8 2.3 3.2 4.2 4.3 1.9 1 3.9 1.6 6.2 1.6 4.1 0 7-1.9 8.9-5.6 1.9-3.7 2.9-9.6 2.9-17.5v-8.4c0-6.2-.4-10.8-1.1-14.2zm-11 21.7c0 3.9-.2 6.9-.5 9.1-.3 2.2-.9 3.8-1.6 4.7-.8.9-1.8 1.4-3 1.4-1 0-1.9-.2-2.7-.7-.8-.5-1.5-1.2-2-2.1V38.3c.4-1.4 1.1-2.6 2.1-3.6 1-.9 2.1-1.4 3.2-1.4 1.2 0 2.2.5 2.8 1.4.7 1 1.1 2.6 1.4 4.8.3 2.3.4 5.5.4 9.6l-.1 7zm29.1.4v2.7c0 3.4.1 6 .3 7.7.2 1.7.6 3 1.3 3.7.6.8 1.6 1.2 3 1.2 1.8 0 3-.7 3.7-2.1.7-1.4 1-3.7 1.1-7l10.3.6c.1.5.1 1.1.1 1.9 0 4.9-1.3 8.6-4 11s-6.5 3.6-11.4 3.6c-5.9 0-10-1.9-12.4-5.6-2.4-3.7-3.6-9.4-3.6-17.2v-9.3c0-8 1.2-13.8 3.7-17.5s6.7-5.5 12.6-5.5c4.1 0 7.3.8 9.5 2.3s3.7 3.9 4.6 7c.9 3.2 1.3 7.6 1.3 13.2v9.1h-20.1v.2zm1.5-22.4c-.6.8-1 2-1.2 3.7s-.3 4.3-.3 7.8v3.8h8.8v-3.8c0-3.4-.1-6-.3-7.8-.2-1.8-.7-3-1.3-3.7-.6-.7-1.6-1.1-2.8-1.1-1.3 0-2.3.4-2.9 1.1z"></path>
    </svg>`,ytmlgo.childNodes[0].firstChild);

  _.Crw("button",{class: "icon-button topbar-menu-button-avatar-button"},false,nsr);
  _.Ren(`<c3-icon>
           <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
            <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path>
           </svg>
          </c3-icon>`,nsr.lastElementChild)

 _.ev(ytmlgo.firstElementChild, "click", function(){
   d.location.href = "/"
 })

 _.ev(nsr.childNodes[0],"click", function(){ QM("searching") })
 h.append(ytmlgo,R(),nsr)
 }, ing = function(x){
  //searching event
   h.setAttribute("data-mode","searching")
   var inp = h.childNodes[1].firstChild[0],b = _.Crw("button",{"class":"mobile-topbar-back-arrows","aria-label":"Cerrar búsqueda"}, _.Crw("c3-icon", {"flip-for-rtl": true})),cOver = _.Crw("c3-overlay", {class: " modern-overlay"},_.Crw("button", {class: "hidden-button","aria-label": "Cerrar búsqueda"}));
   _.Ren(`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
     <path d="M21,11v1H5.64l6.72,6.72l-0.71,0.71L3.72,11.5l7.92-7.92l0.71,0.71L5.64,11H21z"></path>
    </svg>`,b.childNodes[0])
    
    _.ev(_.Sl(".searchbox-input-wrapper").childNodes[1], "keyup", function(e){
      console.log(e.keyCodes)
     
    })
    _.ev(_.Sl(".searchbox-input-wrapper").childNodes[1], "click",_b);

    inp.focus()

    _.ev(h, "touchmove", function(e){
      e.preventDefault();
    })

    _.ev(cOver, "click", function(){
      _rc()
     return !1;
    })

    _.ev(cOver, "touchmove", function(e){
     e.preventDefault();
    })
    
    hbar.insertBefore(cOver,hbar.firstChild);


   h.replaceChild(b,h.childNodes[0])

   if (mode == "search") {
    nsr.removeChild(nsr.lastElementChild)
   }


  _.ev(b, "click", function(){
   //  hbar.removeChild(hbar.firstChild)

     _rc()
  })
 },know = function(){

 },browse = function(){

   wth();

 }, clar = function(){
   while(h.firstChild){
      h.removeChild(h.firstChild)
   }
 }, _rc = function(){
   if (_.chi(hbar) > 1) hbar.removeChild(hbar.firstChild)

   nsr.removeChild(nsr.firstChild)

   if (mode == "search"){
    clar()
    QM("search")
  } else if(mode == "watch"){
    clar()
    QM("watch")
  } else if(mode == "browse"){
    clar()
    QM("browse")
  }
 }

 QM(mode);
}, pgecont = (i,d)=>{
 var ct = _.Sl(".page-container")

 if(typeof i == "string" && i == "ytsearch" || typeof i == "string" && i == "ytbrowse"){
  _.ev(w, "scroll", function(){
    let scrollY =self.pageYOffset || (document.body.scrollTop+document.documentElement.scrollTop),as = _.Sl("ytm-mobile-topbar-renderer");

    if (scrollY > 52) {
      if (as.classList.length > 1) as.classList.replace("in", "out")
      as.classList.add("out")
    } else if (scrollY < 52) {
      as.classList.replace("out","in")
    }
   
  })
 }
 const ytbrowse = function(){
 var wlc = _.Crw("div",{class: "welcome"}, _.Crw("div",false,_.Crw("h1")),ct)
 _.Crw("p", false, false, wlc.childNodes[0])
 wlc.childNodes[0].firstChild.textContent = "YouTube - Developer kire dev"
 wlc.childNodes[0].lastElementChild.textContent = "This Youtube is still in development, it will be constantly updated, to offer a better experience."
 } ,ytwatch = function(){

  var m = _.Crw("ytm-watch")
   _.Crw("div", {class: "player-size player-placeholder"},false, m)

   let cinematic = _.sc(_.Crw("ytm-cinematic-container-renderer", false,_.As(_.Crw("div"),{
    position:"absolute",
    inset: "0px",
    pointerEvents: "none",
    transform: "scale(1.5, 2.5)"
   }),m),0)
   
   _.Crw("canvas",{style: "position: absolute; width: 100%; height: 100%;",width: "110", height: "75"},0,cinematic)
   //_.Crw("canvas",{style: "position: absolute; width: 100%; height: 100%; opacity: 1;",width: "110", height: "75"},0,cinematic)

   _.Crw("ytm-single-column-watch-next-results-renderer", {class: "watch-content full-bleed-wn-thumbs"}, false, m)
  ct["appendChild"](m)

  if (!d.full) {
    vnf()
    return false;
  }
  console.log(d)
  _.Re(m,d)

 }, ytsearch = function(){
  var m = _.Crw("ytm-search", false, _.Crw("ytm-section-list-renderer", {class: " no-bottom-separator"},_.Crw("lazy-list")),ct)
  let lazy = m.childNodes[0].firstChild
  


  //Sections videos
  let sect = _.Crw("ytm-item-section-renderer",{class: " ", "section-identifier": ""},_.Crw("lazy-list"), lazy);
  sect = sect.childNodes[0];

  const _item = function(t,v){
    v.url = "/"+(v.url["split"]("/")[3])
    let typ = _.Crw(`ytm-compact-${t}-renderer`, {class: "item"},
      _.Crw("div",{class: "compact-media-item", "data-has-subscribe-button": ""}), sect)["childNodes"][0]


    let thum = _.Crw("a", {class: "compact-media-item-image", "aria-hidden": true, href: v.url}, _.Crw("div", {class: "video-thumbnail-container-compact center video-thumbnail-container-compact-rounded"}), typ)["firstChild"]
    var xf =  (v.bestAvatar ?? v.thumbnails);xf = (xf.url || xf[0].url);xf = xf.split("/");
    xf = xf.filter(g=> g != "https:" && g != "//" && g!= "" && g!="yt3.googleusercontent.com" && g!="i.ytimg.com" && g!="yt3.ggpht.com")
    xf = BASE_URL+(xf.length > 2 ? "/i/":"/yt3/")+xf[0]+"/"+(xf.length > 2?xf[1]+"/"+xf[2]:xf[1])


    _.Crw("div", {class: "cover video-thumbnail-img video-thumbnail-bg"},false, thum)
    _.Crw("img", {class: "cover video-thumbnail-img", src: xf, alt: ""},false, thum)
    if(t != "channel"){
      let xe = _.Crw("div",{class: "video-thumbnail-overlay-bottom-left-right-group"}, _.Crw("div", {class: "video-thumbnail-overlay-left-right-group"},_.Crw("ytm-thumbnail-overlay-time-status-renderer", {class: " rounded-container", "data-style":"DEFAULT"}, _.Crw("span", {class: "icon-text"},_.Crw("font", {style: "vertical-align: inherit;"})))), thum)
      xe.childNodes[0].firstChild.lastElementChild.firstChild["textContent"] = (v.duration) 
     }

    let imdata = _.Crw("div", {class: "compact-media-item-metadata", "data-has-badges": false}, _.Crw("a", {class: "compact-media-item-metadata-content", href: v.url}), typ)["firstChild"]
    _.Crw("h4",{class: "compact-media-item-headline"},false,imdata).textContent = (v.name ?? v.title)

    let subh = _.Crw("div",{class: "subhead"},false,imdata)

    if (t=="channel") {
      _.Crw("div", {class: "compact-media-item-byline small-text"},false, subh).textContent = (v.subscribers)
      let qk =  _.Crw("div",{class: "compact-media-item-byline small-text"},false,subh)
      _.Crw("span", {class: "formatted-string-text", role: "text"}, false, qk).textContent = (v.videos > 1 ? v.videos + " videos": v.videos + " video")
    } else if(t=="video"){
      _.Crw("div", {class: "compact-media-item-byline small-text"},false, subh).textContent = (v.author.name)
      let vw = _.Crw("div", {class: "compact-media-item-stats small-text"},_.Crw("font", {style: "vertical-align: inherit;"}), subh)
      vw.firstElementChild["textContent"] = (_.pvw(v.short_view_count_text))

      let upl = _.Crw("div", {class: "compact-media-item-stats small-text"},_.Crw("font", {style: "vertical-align: inherit;"}), subh)
      upl.firstElementChild["textContent"] = (v.uploadedAt)
    }
  }

  d.forEach(z =>{
    z.type == "channel" && _item("channel", z)
    z.type == "video" && _item("video", z)

    if (z.type == "shelf") {
     z.items.forEach(q=>{
       _item("video", q)
     })
    }
      
   })


}

 switch(i){
  case "ytbrowse":
   ytbrowse()
  break;
    case "ytwatch":
   ytwatch()
  break;
    case "ytsearch":
   ytsearch()
  break;
 }
 
}, dfload = ()=>{
  var ba = _.Sl("#player-container-id") 
  _.Crw("div", {id: "player", class: "player-api player-size", "playable": false, loading: false},false,ba)
  _.Crw("div", {id: "player-control-container", playable: true},false,ba)

  _.Crw("div", {class:"spinner", hidden: true},false,app)
  _.Crw("panel-container", false, false, app);
}, rwat = ()=>{
 var ba = _.Sl("#player-container-id");

 var plyer = _.Crw("div", {id: "movie_player", class: "html5-video-player"})
  _.Crw("div", {class: "html5-video-container"},_.Crw("video", {class: "video-stream html5-main-video",tabindex: "-1", controlslist: "nodownload"}), plyer)
 var  thum = _.Crw("div", {class: "ytp-cued-thumbnail-overlay"}, false,plyer)
 _.Crw("div",{class:"ytp-cued-thumbnail-overlay-image"},false,thum)
 _.Crw("button",{class:"ytp-large-play-button ytp-button"},false,thum)
  _.Ren(`<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
         <path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path>
       </svg>`, thum.childNodes[1])

 if (ba.childNodes[1].childNodes.length > 0) {
   ba.childNodes[1].removeChild(ba.childNodes[1].firstChild);
   ba.childNodes[2].removeChild(ba.childNodes[2].firstChild)
 }

 ba.childNodes[1]["appendChild"](plyer)
_.Crw("ytm-custom-control",false,false,ba.childNodes[2])
}, rsulst = ()=>{
  var ba = _.Sl("#player-container-id")["childNodes"];
  _.SA(ba[1],"hidden","")
  _.SA(ba[2],"hidden",true)
  _.SA(ba[2],"loading",true)
}, rhome = ()=>{
  
}

//mode theme
(function(d){
 var mode = "white";
 
}(d))

const BASE_URL = "http://youtube.googleapis.com";

const home = ()=>{
  if (w.location.pathname === "/") {
   _.Sl("#app")["classList"].add("watch-container-allow-sticky");
   d.title = "Principal - YouTube";
   hload("browse") || dfload() || rhome();
   //add content
   pgecont("ytbrowse",false)
  }
},watch = async () => {
 if ( a.Rt("watch") != false ){
   var avlb = true;
   _.Sl("#app")["classList"].add("watch-container-allow-sticky");
   hload("watch") || dfload() || rwat();

   var rs = (await _._re(`w/${a.Rt("watch")}`,true)), player = _.Sl("#player"),video = _.Sl("video")
   pgecont("ytwatch",rs)
   _.SA(player, "playable", true)
  
   d.title = rs.videoDetails.title + " - YouTube";

   video.src = BASE_URL+"/s/"+ a.Rt("watch");

   _.As(_.Sl(".ytp-cued-thumbnail-overlay-image"),{
   	backgroundImage: _.url(_.Im(`/i/${rs.videoDetails.thumbnails.pop().url.slice(20)}`))
   })
   return true;
 }
}, results = async()=>{
   if (a.Rt("results") != false) {
   hload("search") || dfload() || rsulst();

   d.title  = a.Rt("q")+" - YouTube";

   _.Sl(".search-bar-text").textContent = a.Rt("q")
   var s = false;

   if (a.Rt("q").trim().length > 0) {
     s = await _._re(`s?q=${a.Rt("q")}`, true)
   }
  
   pgecont("ytsearch", (s.items ?? false))
   return true;
   }
}

home()
watch() 
results()

}(document,window,{
	Rt:(s)=>{
	 if (typeof s != "string") throw("Only string") 
     let u = new URLSearchParams(window.location.search);
     return {"/": "petro" ,"watch": u.get("v"),"results": u.get("search_query"), "q": u.get("search_query")}[s] ?? false;
	},
	Cr: (t,c)=>{
    let e = document.createElement(t)
    if (typeof c == "string") e.className = c;
    return e;
	},
	Rq: async(a)=>{
     return a;
	}
},{spiner: function(i){
  var s = this.Sl(".spinner");
  (i)? s.removeAttribute("hidden"):s.setAttribute("hidden","");
 },_re: async function(i,j){
   try{
   let fh = await fetch("http://youtube.googleapis.com"+"/"+i)
    if (fh.status === 200){
    this.spiner(false)
     return  (j? await fh.json():{"code": 200})
    }

    return ({"full": false,"code": fh.status});

   }catch(e){
    throw new Error(e)
   }
  },
  U: function(u){
    return "http://youtube.googleapis.com"+u;
  },
  Pt: (txt, def = null) => {
   if (typeof txt !== 'object') return def;
    if (Object.prototype.hasOwnProperty.call(txt, 'simpleText')) return txt.simpleText;
    if (Array.isArray(txt.runs)) {
     return txt.runs.map(a => a.text).join('');
    }
   return def;
  },
  SA: (e,a,v)=>{
    e.setAttribute(a,v)
    return true;
  },
  Crw: function(e,a,c,p){
    let cr = document.createElement(e)
    if(typeof a == "object"){
      Object.keys(a).forEach(v => {
       cr["setAttribute"](v,a[v])
      })
    }

    if (c!=undefined && c!=false){
     cr["appendChild"](c)
    }//else this.Sl("ytm-single-column-watch-next-results-renderer")["appendChild"](cr)
  
    if (p!=undefined && p!=false) {
     p["appendChild"](cr)
    }

    return cr;
  },
  Ren: function(v,e){
    if(e){
     e["innerHTML"]+=v
    } else this.Sl("ytm-single-column-watch-next-results-renderer")["innerHTML"]=v
  },sc: (a,c,t) => {
     if (typeof a != "object" || typeof c != "number") return false;

      var hk = a.childNodes[c] ?? a.childNodes[0];
       while(hk.firstChild) hk = hk.lastElementChild;

      if (t !="") hk["textContent"] = t;
       return hk;
  },
	Sl: (e)=>{
      return document.querySelector(e);
	},
	As: (e,o)=>{
      Object.assign(e.style,o)
      return e;
	},
  Er: function(msg){
    document.title = "Error";
    var z = this.Crw("div", {class: "cover center"}, this.Crw("div", {class: "playability-status-message"})),w = this.Sl("ytm-watch");

    z.firstElementChild["textContent"] = msg ?? "Este video no está disponible.";
    w.firstElementChild["appendChild"](z)
    
    throw("App stoped")
    return false;
  },
  KJ: function(){
   this.As(document.body,{top: "-570px"}) || this.SA(document.body,"modal-open-body","");

    var d = this.Crw("div",{class:"dialog-container"},0,document.body)

    let lg = this.Crw("dialog",{class:"dialog rounded-container modern-dialog", role:"dialog", "aria-modal":true},0,d)
     this.Crw("div",{class:"dialog-header","aria-live":"polite",tabindex:0},this.Crw("h2",{class:"player-settings-header"}),lg)
      this.sc(lg,0,"Configuración de reproducción")
     this.Crw("div",{class:"dialog-body user-text"},0,lg)
     this.Crw("div",{class:"dialog-buttons"},0,lg)

    this.Crw("c3-overlay",{class:"modern-overlay"},this.Crw("button",{class:"hidden-button","aria-label":"close"}),d)
  },
  chi: (p)=>{
    //count childs in parent
    if (typeof p != "object") throw("Error count childNodes")

    var c = p.childNodes;

    return c["length"] > 0 ? c["length"]: false;
  },
	url: (u)=>{
		return(`url(${u})`);
	},
	Im: (i)=>{
    return(`http://youtube.googleapis.com${i}`)
	},
	ev: (e,t,call)=>{
	 e ==null|| e.addEventListener(t,call)
	},
  Po: async function(id){
  function g(q){return "i/vi/"+(id.split("/")[4])+"/"+q+".jpg?"+(id.split("?")[1])}
  return (await this._re(g("hq720"),false)).code != 200 ? ( (this._re(g("hqdefault"),false)).code != 2000 ? "i/"+(id.slice(20)): g("hqdefault") ):g("hq720");
  },
  pvw: function(k){
      return k.includes("M") ? `${k.split(' ')[0]} de vistas`:`${k.split(' ')[0]} vistas`;
  },
  H: (p)=>{
   window.history.pushState("",false, p)
  },
  Ct: (n) =>{
     let c = {
      hours: Math.floor(n / 3600) ?? false,
      minutes: Math.floor(n / 60) % 60,
      seconds: Math.floor(n % 60),
     },cv = new Intl.NumberFormat(undefined,{minimumIntegerDigits:0x2});
     return !c["hours"] ? c["minutes"]+":"+cv.format(c["seconds"]):c["hours"]+":"+c["minutes"]+":"+cv.format(c["seconds"]);
  },
  Re: function(m,i){

    let x  = [
     i.videoDetails,
     i.response.contents.twoColumnWatchNextResults.results.results.contents,
     null
    ];

    switch(x[1].length){
      case 2:
       x[1] = (x[1])[0].videoPrimaryInfoRenderer;
       this.Er(`Por ahora los live no estan disponible. (CODE: ${2})`)
      break;
      case 3:
       x[2] = (x[1])[1].videoSecondaryInfoRenderer.owner.videoOwnerRenderer.subscriberCountText.simpleText;
       x[1] = (x[1])[0].videoPrimaryInfoRenderer;
      break;
      case 4:
      var zx;
       x[2] =  (zx = (x[1])[1].videoSecondaryInfoRenderer) ? zx.owner.videoOwnerRenderer.subscriberCountText.simpleText:(x[1])[2].videoSecondaryInfoRenderer.owner.videoOwnerRenderer.subscriberCountText.simpleText;
       x[1] = (x[1])[0].videoPrimaryInfoRenderer ?? (x[1])[1].videoPrimaryInfoRenderer;
      break;
      case 5:
      var zc;
       x[2] = (zc =  (x[1])[2].videoSecondaryInfoRenderer) ? zc.owner.videoOwnerRenderer.subscriberCountText.simpleText: x[1][1].videoSecondaryInfoRenderer.owner.videoOwnerRenderer.subscriberCountText.simpleText 
       x[1] = (x[1])[0].videoPrimaryInfoRenderer ?? (x[1])[1].videoPrimaryInfoRenderer
      break;
    };


    m = m.childNodes[2],sTl = false;

    let r = this.Crw("div",{class: "related-chips-slot-wrapper"}, false, m)
    this.Crw("ytm-slim-video-metadata-section-renderer",{class: "scwnr-content single-column-watch-next-modern-panels"},false,r)
    let y = this.Crw("ytm-slim-video-information-renderer", false, false, r.firstChild), o = this.Crw("ytm-slim-owner-renderer",{class: "ytm-slim-owner-renderer-modern"}, false, r.firstChild)
    
    if (x[1].superTitleLink != undefined) {
    sTl = true;
      this.Crw("div", {class: "slim-video-metadata-information-standalone-badge"},
        this.Crw("ytm-standalone-badge-supported-renderer", {class: "top-standalone-badge top-standalone-badge-modern"},
          this.Crw("ytm-standalone-collection-badge-renderer",false,
            this.Crw("ytm-badge", {class: "standalone-collection-badge rounded-container"}))), y);

      let hk = this.sc(y,0);
      x[1].superTitleLink.runs.map(e => e.text).filter(f => f != " ").forEach(i =>{
       (this.Crw("a", {tabindex: 0,"force-new-state": true, href: `/hashtag/${i.slice(1)}`},false, hk ))["textContent"] = i;
      })
    }

    let q = this.Crw("div", {class: "slim-video-metadata-header slim-video-metadata-header-modern"},
      this.Crw("div", {class: "slim-video-information-content slim-video-information-empty-badge"},
        this.Crw("div", {class: "slim-video-information-title-and-badges"})),y)

    if (sTl != false) q.classList.add("slim-video-metadata-header-with-standalone-badge") && q.firstChild.classList.remove("slim-video-information-empty-badge")

    this.ev(q, "click", (d)=>{
      if (!d.target.href) {
       //this.KJ()
      }
    })
    
    q = this.sc(y,1)
    
    this.Crw("h2",{class: "slim-video-information-title slim-video-metadata-title-modern"},false,q)["textContent"] = x[0].title;
    let d =this.Crw("div",false,false,q)
     this.Crw("span",{class:"secondary-text"},this.Crw("span", {class:"formatted-string-text"}),d);
     this.sc(d, 0, `${this.pvw(x[1].viewCount.videoViewCountRenderer.shortViewCount.simpleText)} · ${x[1].relativeDateText.simpleText}`)
     this.Crw("button", {class:"slim-video-information-show-more", "aria-label": "Mostrar más"},false,d)["textContent"] = "...más"


    let n = this.Crw("a",{class: "slim-owner-icon-and-title", "arial-label":"",href:"#undefined"},false,o);
     this.Crw("ytm-profile-icon", {class: "slim-owner-profile-icon"},
      this.Crw("img", {src: this.U(`/ytc/${x[0].author.thumbnails.pop().url.slice(21)}`)}),n);

    let z = this.Crw("div",{class: "slim-owner-bylines slim-owner-bylines-modern"},0,n)
     this.Crw("h3",{class:"slim-owner-channel-name", "aria-hidden": true},0,z)["textContent"] = x[0].ownerChannelName;
     this.Crw("div",{class:"subhead", "aria-hidden": true},0,z)["textContent"] = x[2]["split"](" ")[0];


    let s = this.Crw("div",{class: "slim-owner-subscribe-button cbox"},
      this.Crw("ytm-button-renderer",0,
        this.Crw("button",{class:"yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m"},
          this.Crw("div", {class:"cbox yt-spec-button-shape-next--button-text-content"},
            this.Crw("span",{class:"yt-core-attributed-string yt-core-attributed-string--white-space-no-wraps"})))), o);
    this.sc(s,0 ,"Suscribirse")


    let p = this.Crw("ytm-item-section-renderer",{class:"scwnr-content single-column-watch-next-modern-panels","data-content-type":"related"},
      this.Crw("lazy-list"), m)
     this.Crw("div",{class:"ytm-autonav-bar cbox"},this.Crw("h3",{class:"ytm-autonav-title"}),p.firstChild)
    this.sc(p,0,"A continuación")
    

    let k = p.firstChild;
    
    i.related_videos.forEach(async o =>{
     let qz = this.Crw("ytm-video-with-context-renderer",{class:"item"},this.Crw("ytm-media-item"),k),
      qk = this.Crw("a",{class: "media-item-thumbnail-container", href: "/watch?v="+o.id, "aria-hidden": true},
        this.Crw("div",{class: "video-thumbnail-container-large center rounded-thumbnail"}),qz.firstChild),
      qm = this.Crw("div",{class: "details"},0,qz.firstChild);
      qk = qk.firstChild;

      this.Crw("div",{class: "cover video-thumbnail-img video-thumbnail-bg"},0,qk)
      this.Crw("img",{class: "cover video-thumbnail-img yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image yt-core-image--content-mode-scale-aspect-fill yt-core-image--loaded", src: this.U(`/${await(this.Po(o.thumbnails.pop().url))}`)},0,qk)
      let ak = this.Crw("div",{class: "video-thumbnail-overlay-bottom-left-right-group"},
        this.Crw("div",{class:"video-thumbnail-overlay-left-right-group"},
          this.Crw("ytm-thumbnail-overlay-time-status-renderer",{class:"rounded-container"},this.Crw("span"))),qk)
      this.sc(ak, 0, this.Ct(o.length_seconds))

      this.Crw("div",{class: "media-channel"},this.Crw("ytm-channel-thumbnail-with-link-renderer",0,
        this.Crw("a", {href:"#undefined"},this.Crw("ytm-profile-icon",{class:"channel-thumbnail-icon"},this.Crw("img",{src:this.U(`/ytc${o.author.thumbnails.pop().url.slice(21)}`)})))),qm)
      let za = this.Crw("div",{class: "media-item-info cbox","no-channel-avatar":false},0,qm)
       this.Crw("div",{class:"media-item-metadata"},this.Crw("a",{href:"/watch?v="+o.id}),za);

       this.Ren(`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
         <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z"></path>
        </svg>`,this.sc(this.Crw("ytm-menu-renderer",{class:"media-item-menu"},this.Crw("ytm-menu",0,this.Crw("button",{class:"icon-button","aria-label":"Menú de acciones","aria-haspopup":true},
        this.Crw("c3-icon"))),za),0))
       
       za = this.sc(za, 0);
       this.Crw("h3",{class:"media-item-headline"},0,za)["textContent"] = o.title;
       let ab = this.Crw("div",{class:"","aria-hidden": true},this.Crw("ytm-badge-and-byline-renderer",{class:"", "data-is-all-badges":""}),za)
       ab = ab.firstChild;
        this.Crw("span",{class:"ytm-badge-and-byline-item-byline small-text"},0,ab)["textContent"] = o.author.name;
        this.Crw("span",{class:"ytm-badge-and-byline-separator"},0,ab)["textContent"] = "•"
        this.Crw("span",{class:"ytm-badge-and-byline-item-byline small-text"},0,ab)["textContent"] = this.pvw(o.short_view_count_text)
        this.Crw("span",{class:"ytm-badge-and-byline-separator"},0,ab)["textContent"] = "•"
        this.Crw("span",{class:"ytm-badge-and-byline-item-byline small-text"},0,ab)["textContent"] = o.published;
    })
}}));