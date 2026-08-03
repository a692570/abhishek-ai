const DIRS=["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left"];
const LB="/abhishek-ai/profile/nobg/";const DB="/abhishek-ai/profile/nobg/black-";
export function initFace(){
  if(typeof document==="undefined")return;
  const w=document.getElementById("avatar-wrap");if(!w)return;
  const la=document.querySelector(".avatar-light");const da=document.querySelector(".avatar-dark");
  if(!la||!da)return;
  DIRS.forEach(d=>{new Image().src=LB+d+".png";new Image().src=DB+d+".png";});
  w.style.cursor="pointer";
  const tg=document.getElementById("theme-toggle");
  w.addEventListener("click",()=>tg?.click());
  let cur="center";
  function cd(x,y){const r=w.getBoundingClientRect();const cx=r.left+r.width/2;const cy=r.top+r.height/2;const dx=x-cx;const dy=y-cy;if(Math.sqrt(dx*dx+dy*dy)<60)return"center";const a=Math.atan2(dy,dx)*180/Math.PI;if(a>=-22.5&&a<22.5)return"right";if(a>=22.5&&a<67.5)return"bottom-right";if(a>=67.5&&a<112.5)return"bottom";if(a>=112.5&&a<157.5)return"bottom-left";if(a>=157.5||a<-157.5)return"left";if(a>=-157.5&&a<-112.5)return"top-left";if(a>=-112.5&&a<-67.5)return"top";if(a>=-67.5&&a<-22.5)return"top-right";return"center";}
  function sd(d){if(d===cur)return;cur=d;la.src=LB+d+".png";da.src=DB+d+".png";}
  document.addEventListener("mousemove",e=>sd(cd(e.clientX,e.clientY)));
  document.addEventListener("mouseleave",()=>sd("center"));
}
