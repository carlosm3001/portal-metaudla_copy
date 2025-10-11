import React from 'react';

const DEMO = [
  { id:1, name:"GeoAventura", techs:["React","Node.js"], image:"/assets/demo/demo1.jpg" },
  { id:2, name:"Fuerza y Movimiento", techs:["JS"], image:"/assets/demo/demo2.jpg" },
  { id:3, name:"Quiz Bio", techs:["Vue"], image:"/assets/demo/demo3.jpg" },
  { id:4, name:"SimuLab", techs:["Django"], image:"/assets/demo/demo4.jpg" },
  { id:5, name:"DataVis", techs:["Three.js"], image:"/assets/demo/demo5.jpg" },
  { id:6, name:"Campus App", techs:["Flutter"], image:"/assets/demo/demo6.jpg" },
];

export default function CommunityShowcase({ items = DEMO }) {
  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(4, minmax(220px,1fr))" }}>
      {items.slice(0,8).map(p => (
        <article key={p.id} className="card overflow-hidden project-mini hover:translate-y-[-2px] transition">
          <div className="bg-brand-50">
            {p.imageUrl ? (
              <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:3001/${p.imageUrl}`} alt={p.name} className="w-full object-cover" style={{aspectRatio:'4/3'}} loading="lazy"/>
            ) : (
              <div className="w-full grid place-items-center text-muted" style={{aspectRatio:'4/3'}}>Sin imagen</div>
            )}
          </div>
          <div className="p-3">
            <h5 className="font-semibold text-ink truncate">{p.name}</h5>
            <div className="mt-2 flex flex-wrap gap-2">
              {(p.technologies ? p.technologies.split(',').map(t => t.trim()) : []).slice(0,2).map(t=> <span key={t} className="pill pill-sm">{t}</span>)}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}