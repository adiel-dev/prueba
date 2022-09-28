/*
@Author: Kire Dev 😃
App: Unknown
*/
(function(w,d,r){
  "use strict"
  const button = (p,f) => {
    let icon_btn = ['.icon-search','.icon-back','.btn-sub'],e = d.querySelector(icon_btn[p]);
   if(icon_btn[p] === undefined) throw new Error(`No existe la posición: ${p} en el array`);
   (e === null || e.addEventListener('click',f));
  }
  
  const addClass = (c,ar,m) => {
   let addStyle = ['.screen-opacity-true','#root','.headers .var_1','.headers .var_2'],e = d.querySelector(addStyle[c]);
   (ar)?(e.classList.add(m)):(e.classList.remove(m));
  }
  
  const loading = (hidden) =>{
    let el = d.querySelector('.loading');
    (hidden)?(el.classList.add('hidden')):el.classList.remove('hidden');
  }
  
  const ytsearch = async (s) => {
    const template = (video) =>{
    let vi = (v) =>{
      return `
  <div class="video-query">
   <div class="video-related">
     <a href="#" class="media-item-thumbnail">
      <div class="content-miniature">
        <div class="cover"></div>
        <img src="${v.thumbnails[0].url}" alt=""/>
        <div class="video-thumbnails-overlay">
           <div class="overlay-time-status">
             <span>${v.duration}</span>
           </div>
         </div>
      </div>
     </a>
   </div>
   <div class="video-content">
     <div class="avatar-channel">
       <div class="avatar">
       <img src="${v.author.avatars[0].url}" alt="">
      </div>
     </div>
     <div class="video-info">
     <div class="title-video">${v.title}</div>
     <div class="channel-visits-date">
       ${v.author.name} • 9 visitas ${v.uploadedAt == null?'':'• '+v.uploadedAt}
     </div>
     </div>
   </div>
 </div>`;
    }
    
    if(video.type === 'shelf'){
  // video.items.push('j');
    console.log(video.title);
    console.log(video.items);
  
    let d = '';
    video.items.forEach(item=>{
     d += vi(item);
   // console.log(item)
    });
    // div class="shelf-latest-from"><div>${video.title}</div></div>
    return `<div class="shelf-latest-from"><div>${video.title}</div></div>${d}`;
    
   } else if(video.type === 'video'){
     return vi(video);
   } else return '';
  }
 
    const ele = d.querySelector('#load-video');

   const se = await re(s);
    se.items.forEach(video => {
      ele.innerHTML += template(video);
    })
  }
  
  button(0x0,(e) => {
  loading(0x1);
  const screen = (e) => {
    if(e == 'hidden' && typeof e === 'string'){
      addClass(0x0,0x0,'opacity-true');
      addClass(0x1,0x0,'hidden-b');
      addClass(0x2,0x0,'hidden');
      addClass(0x3,0x1,'hidden');
    } else {
      addClass(0x0,0x1,'opacity-true');
      addClass(0x1,0x1,'hidden-b');
      addClass(0x2,0x1,'hidden');
      addClass(0x3,0x0,'hidden');
    }
  },form=d.querySelector('form');
   screen();
     form[0x0].select();
     if(form[0x0].value.length > 0){
       d.querySelector('#load-video').innerHTML = '';
      ytsearch(form[0].value)
      form[0x0].value = '';
       screen('hidden');
     };
     
      button(0x1,()=>{
        form[0x0].value = ''
        screen('hidden');
      });
    })

  button(0x2,()=>{
    console.warn('%cThis not available', 'color:red;');
  })
      //load videos
    const re = async (s)=>{
      try{
       loading(0x0)
      let x = await fetch(`http://159.223.125.177/s?q=${s}`);
       if (x.status == 200) {
         loading(0x1)
       } else if(x.status == 500){
         throw new Error('Error server response');
       }
       return await x.json();
      }catch(e){
       throw new Error('Error server')
      }
    }
    
  w.onload =  () =>{
   ytsearch('noticas de México');
  }
}((typeof globalThis != 'object' || window),document,new URLSearchParams(window.location.search)))
