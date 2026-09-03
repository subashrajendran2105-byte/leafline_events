const leafField=document.getElementById('leafField');
const leaves=['🍂','🍃','🍁','🍃','🍂','🍃'];
leaves.forEach((leaf,i)=>{const el=document.createElement('span');el.className='leaf';el.textContent=leaf;el.style.left=(5+i*17+Math.random()*10)+'%';el.style.animationDuration=(8+Math.random()*7)+'s';el.style.animationDelay=(-Math.random()*12)+'s';el.style.fontSize=(12+Math.random()*13)+'px';leafField.appendChild(el)});

const nav=document.getElementById('nav');
const bar=document.getElementById('progressBar');
window.addEventListener('scroll',()=>{
 const y=window.scrollY, max=document.documentElement.scrollHeight-window.innerHeight;
 bar.style.width=(max?y/max*100:0)+'%';
 nav.classList.toggle('scrolled',y>60);
},{passive:true});

const observer=new IntersectionObserver((entries)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const countObserver=new IntersectionObserver((entries)=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return;
 const el=entry.target, target=Number(el.dataset.count), start=performance.now(), duration=1400;
 const tick=(now)=>{const p=Math.min((now-start)/duration,1), eased=1-Math.pow(1-p,3);el.textContent=Math.floor(target*eased);if(p<1)requestAnimationFrame(tick)};
 requestAnimationFrame(tick);countObserver.unobserve(el);
}),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>countObserver.observe(el));

// Replace the share-style WhatsApp URL below with your Leafline business number when ready.
// Example: https://wa.me/919876543210?text=...
document.querySelectorAll('.whatsapp').forEach(link=>link.addEventListener('click',()=>{link.style.transform='scale(.98)';setTimeout(()=>link.style.transform='',160)}));
