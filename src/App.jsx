import { useState, useEffect, createContext, useContext, useRef } from "react";
const AppContext = createContext();
const useApp = () => useContext(AppContext);

const WHATSAPP = "573212412532";

const I={logo:"/img/logo.png",hero_bg:"/img/hero_bg.jpg",hero_video:"/img/hero_video.mp4",mini:"/img/mini.jpg",niebla:"/img/niebla.jpg",cacao:"/img/cacao.jpg",noches:"/img/noches.jpg",pal_sm:"/img/pal_sm.jpg",pal_md:"/img/pal_md.jpg",pal_lg:"/img/pal_lg.jpg",sl1:"/img/sl1.jpg",sl2:"/img/sl2.jpg",sl3:"/img/sl3.jpg",sl4:"/img/sl4.jpg",st1:"/img/st1.jpg",st2:"/img/st2.jpg",st3:"/img/st3.jpg",st4:"/img/st4.jpg",st5:"/img/st5.jpg",st6:"/img/st6.jpg"};
const PH={niebla:{xs:I.mini,sm:I.niebla,md:I.niebla,lg:I.niebla},palenquera:{xs:I.mini,sm:I.pal_sm,md:I.pal_md,lg:I.pal_lg},cacao:{xs:I.mini,sm:I.cacao,md:I.cacao,lg:I.cacao},noches:{xs:I.mini,sm:I.noches,md:I.noches,lg:I.noches}};
// Catalog cards: only the large/main photo
const CA={niebla:I.niebla,palenquera:I.pal_lg,cacao:I.cacao,noches:I.noches};
const SL=[I.sl1,I.sl2,I.sl3,I.sl4];
const ST=[I.st1,I.st2,I.st3,I.st4,I.st5,I.st6];

const SIZES=[{key:"xs",label:"Mini",weight:"70 g",g:70,hours:"12–15 hrs"},{key:"sm",label:"Pequeño",weight:"120 g",g:120,hours:"20–25 hrs"},{key:"md",label:"Mediano",weight:"220 g",g:220,hours:"35–40 hrs"},{key:"lg",label:"Grande",weight:"277 g",g:277,hours:"45–50 hrs"}];
const PRODUCTS=[
  {id:1,name:"Niebla del Páramo",slug:"niebla",region:"Boyacá · Páramo de Sumapaz",category:"Cítrica · Verde",stamp:"1830",number:"01",notes:["Bergamota","Limón","Hoja Verde","Almizcle Blanco"],description:"Del silencio de los frailejones y la niebla eterna del páramo colombiano. Una fragancia que celebra la resiliencia — la tierra que resiste, que guarda, que renace.",prices:{xs:28000,sm:42000,md:65000,lg:85000}},
  {id:2,name:"La Palenquera",slug:"palenquera",region:"Bolívar · Cartagena de Indias",category:"Frutal · Tropical",stamp:"1845",number:"02",notes:["Corozo","Coco","Cítrico"],description:"Inspirada en la elegancia de las palenqueras de la Ciudad Amurallada, esta fragancia celebra la abundancia del Caribe: limonada de corozo, coco y frutas tropicales que llenan el aire de frescura y luz.",prices:{xs:28000,sm:42000,md:65000,lg:85000}},
  {id:3,name:"Cacao de la Sierra",slug:"cacao",region:"Sierra Nevada · Edición Especial",category:"Gourmand · Maderosa",stamp:"1924",number:"03",notes:["Cacao","Limón","Madera"],description:"En las faldas de la Sierra Nevada nace el cacao que transforma nuestra tierra. Un homenaje a las manos que siembran esperanza y convierten cada semilla en un legado de paz.",prices:{xs:28000,sm:42000,md:65000,lg:85000}},
  {id:4,name:"Noches de Cartagena",slug:"noches",region:"Bolívar · Ciudad Amurallada",category:"Ámbar · Oriental",stamp:"1928",number:"04",notes:["Ámbar","Vainilla Francesa","Sándalo","Tonka"],description:"La noche desciende sobre la Ciudad Amurallada y Cartagena se convierte en misterio. Brisa cálida, luces doradas, calles de piedra. Una fragancia para las noches que no se olvidan.",prices:{xs:28000,sm:42000,md:65000,lg:85000}},
];
const fmt=(n)=>"$"+n.toLocaleString("es-CO");

// ─── Provider ────────────────────────────────────────────
function AppProvider({children}){
  const[page,setPage]=useState("home");const[product,setProduct]=useState(null);const[cart,setCart]=useState([]);const[user,setUser]=useState(null);const[users,setUsers]=useState([]);const[showCart,setShowCart]=useState(false);const[showAuth,setShowAuth]=useState(false);const[toast,setToast]=useState(null);
  const notify=(m)=>{setToast(m);setTimeout(()=>setToast(null),2500)};
  const addToCart=(p,size)=>{const ex=cart.find(i=>i.product.id===p.id&&i.size===size);if(ex)setCart(cart.map(i=>i===ex?{...i,qty:i.qty+1}:i));else setCart([...cart,{product:p,size,qty:1}]);notify(p.name+" agregada")};
  const removeFromCart=(idx)=>setCart(cart.filter((_,i)=>i!==idx));
  const updateQty=(idx,q)=>q<1?removeFromCart(idx):setCart(cart.map((it,i)=>i===idx?{...it,qty:q}:it));
  const cartTotal=cart.reduce((s,i)=>s+i.product.prices[i.size]*i.qty,0);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const register=(name,email,pw)=>{if(users.find(u=>u.email===email))return"Correo ya registrado";const u={name,email,password:pw};setUsers([...users,u]);setUser(u);return null};
  const login=(email,pw)=>{const u=users.find(u=>u.email===email&&u.password===pw);if(!u)return"Credenciales incorrectas";setUser(u);return null};
  const goProduct=(p)=>{setProduct(p);setPage("product")};const goCollection=()=>setPage("collection");const goHome=()=>setPage("home");
  const goCheckout=()=>{if(!user){setShowAuth(true);return}setShowCart(false);setPage("checkout")};
  return<AppContext.Provider value={{page,setPage,product,cart,user,showCart,showAuth,toast,setShowCart,setShowAuth,addToCart,removeFromCart,updateQty,cartTotal,cartCount,register,login,goProduct,goCollection,goHome,goCheckout,setUser,notify,setCart}}>{children}</AppContext.Provider>;
}

// ─── Scrolling Stamps Band (full opacity) ────────────────
function StampsBand(){
  const items=[...ST,...ST,...ST,...ST];
  return(<div className="stamps-band"><div className="stamps-track">{items.map((s,i)=><img key={i} src={s} alt=""/>)}</div></div>);
}

// ─── 3D Carousel ─────────────────────────────────────────
function SlidesSection(){
  const[idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%4),5000);return()=>clearInterval(t)},[]);
  const prev=(idx-1+4)%4,next=(idx+1)%4;
  return(
    <section className="slides-sec">
      <div className="carousel3d">
        {SL.map((s,i)=>{let cls="car-slide";if(i===idx)cls+=" car-active";else if(i===prev)cls+=" car-prev";else if(i===next)cls+=" car-next";else cls+=" car-hidden";return<div key={i} className={cls}><img src={s} alt=""/></div>})}
      </div>
      <div className="slides-dots">{SL.map((_,i)=><button key={i} className={`sdot ${i===idx?"act":""}`} onClick={()=>setIdx(i)}/>)}</div>
    </section>
  );
}

// ─── Zoom Image ──────────────────────────────────────────
function ZoomImage({src,alt}){
  const[zoom,setZoom]=useState(false);const[pos,setPos]=useState({x:50,y:50});const ref=useRef(null);
  const onMove=(e)=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();setPos({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100})};
  return(
    <div className="zoom-container" ref={ref} onMouseEnter={()=>setZoom(true)} onMouseLeave={()=>setZoom(false)} onMouseMove={onMove}>
      <img src={src} alt={alt} className="zoom-img"/>
      {zoom&&<div className="zoom-circle" style={{left:`${pos.x}%`,top:`${pos.y}%`,backgroundImage:`url(${src})`,backgroundPosition:`${pos.x}% ${pos.y}%`}}/>}
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────
function Nav(){
  const{goHome,goCollection,cartCount,setShowCart,setShowAuth,user,setUser,setPage}=useApp();
  return(<>
    <div className="ban">Envío gratuito en pedidos sobre $150.000 COP · Hecho a mano en Colombia</div>
    <nav className="nav">
      <div className="nvl"><button className="nl" onClick={goCollection}>Colección</button><button className="nl" onClick={()=>setPage("atelier")}>Atelier</button></div>
      <button className="nlogo" onClick={goHome}><img src={I.logo} alt="Avalea" className="nav-bird"/><span>A V A L E A</span></button>
      <div className="nvr">
        <button className="nl" onClick={()=>setPage("ritual")}>El Ritual</button>
        {user?<div style={{display:"flex",alignItems:"center",gap:12}}><span className="uhi">Hola, <b>{user.name.split(" ")[0]}</b></span><button className="lout" onClick={()=>setUser(null)}>Salir</button></div>
        :<button className="nl" onClick={()=>setShowAuth(true)}>Cuenta</button>}
        <button className="nl cbtn" onClick={()=>setShowCart(true)}>Carrito{cartCount>0&&<span className="bdg">{cartCount}</span>}</button>
      </div>
    </nav>
  </>);
}

function Hero(){const{goCollection}=useApp();return(<section className="hero"><img className="hero-ibg" src={I.hero_bg} alt=""/><video autoPlay loop muted playsInline src={I.hero_video} className="hero-vid"/><div className="hvig"/><div className="hgr"/><div className="hct"><div><div className="hlb">Primera Edición · MMXXVI</div><h1 className="ht">Aromas<br/><em>que viajan</em><br/>como cartas.</h1><p className="hsub">Una colección filatélica de velas artesanales inspiradas en los paisajes, personajes y memorias de Colombia.</p><div className="hbtns"><button className="btn bgd" onClick={goCollection}>Ver la Colección</button><button className="btn bot">Conocer el Atelier</button></div></div><div className="hr"><img src={I.logo} alt=""/><div className="hr-b">C O L O M B I A</div><div className="hr-e">N.º 01 — IV Piezas</div></div></div><div className="scr"><div/><span>Explorar</span></div></section>)}
function Features(){return<div className="feat"><span>Cera de soja 100%</span><span>Mecha de algodón</span><span>40–50 hrs de quemado</span><span>Hecho a mano · Bogotá</span><span>Edición numerada</span></div>}
function PCard({p}){const{goProduct}=useApp();return(<div className="pc" onClick={()=>goProduct(p)}><img className="pc-img" src={CA[p.slug]} alt={p.name}/><div className="pc-b"><div className="pc-top"><span className="pc-num">N.º {p.number} / 04</span><span className="pc-yr">{p.stamp}</span></div><div className="pc-cat">{p.category}</div><h3 className="pc-name">{p.name}</h3><div className="pc-reg">{p.region}</div><div className="pc-dv"/><div className="pc-nt">{p.notes.join(" · ")}</div><div className="pc-ft"><div><div className="pc-pl">Desde</div><div className="pc-pr">{fmt(p.prices.xs)}</div></div><span className="pc-cta">Ver Detalle →</span></div></div></div>)}
function CollectionSec(){return(<section className="sec"><div className="slb">La Colección</div><h2 className="st">Cuatro destinos,<br/><em>cuatro memorias.</em></h2><p className="sd">Cada vela es una pequeña carta sellada. Cera de soja vegetal, mecha de algodón puro y aromas que evocan los rincones más bellos de Colombia.</p><div className="pgr">{PRODUCTS.map(p=><PCard key={p.id} p={p}/>)}</div></section>)}

function ProductDetail(){
  const{product:p,addToCart,goCollection}=useApp();const[size,setSize]=useState("sm");const[qty,setQty]=useState(1);
  if(!p)return null;const sd=SIZES.find(s=>s.key===size);
  return(<section className="pd"><div className="pd-v"><div className="pd-vl">N.° {p.number} / Primera Edición</div><div className="pd-seal"><div className="pd-st">{p.region.split("·")[0].trim()}<br/>{p.stamp}</div></div><ZoomImage src={PH[p.slug][size]} alt={p.name} key={size}/></div><div className="pd-i"><button className="back-btn" onClick={goCollection}>← Volver a la Colección</button><div className="pd-cat">{p.category}</div><h1 className="pd-nm">{p.name}</h1><div className="pd-rg">{p.region}</div><div className="pd-sep"/><p className="pd-ds">{p.description}</p><div className="pd-nlb">Notas Olfativas</div><div className="pd-nl">{p.notes.map(n=><span key={n} className="pd-nc">{n}</span>)}</div><div className="pd-slb"><span>Selecciona Tamaño</span><span>Quema: {sd.hours}</span></div><div className="pd-szs">{SIZES.map(s=>(<button key={s.key} className={`pd-sz ${size===s.key?"act":""}`} onClick={()=>setSize(s.key)}><div className="pd-szw">{s.g}<small> g</small></div><div className="pd-szl">{s.label}</div><div className="pd-szp">{fmt(p.prices[s.key])}</div></button>))}</div><div className="pd-ar"><div className="pd-qt"><button onClick={()=>setQty(Math.max(1,qty-1))}>−</button><span>{qty}</span><button onClick={()=>setQty(qty+1)}>+</button></div><button className="btn bgd pd-ab" onClick={()=>{for(let i=0;i<qty;i++)addToCart(p,size);setQty(1)}}><span>Añadir al Carrito</span><span>{fmt(p.prices[size]*qty)}</span></button></div><div className="pd-dt"><div><div className="pd-dl">Material</div><div className="pd-dv2">Cera de soja 100%</div></div><div><div className="pd-dl">Mecha</div><div className="pd-dv2">Algodón puro</div></div><div><div className="pd-dl">Origen</div><div className="pd-dv2">Bogotá, Colombia</div></div><div><div className="pd-dl">Edición</div><div className="pd-dv2">Numerada · 2026</div></div></div></div></section>);
}

function AtelierSec(){return(<section className="atl"><div className="atl-in"><div><div className="slb">El Atelier</div><h2 className="st">Cada vela,<br/><em>una carta de amor</em><br/>a Colombia.</h2></div><div><p className="atl-d">avalea nació en un taller pequeño en Bogotá, donde una colección de estampillas heredadas inspiró la idea: ¿y si pudiéramos enviar un aroma como quien envía una carta?</p><p className="atl-d">Cada pieza se elabora a mano con cera de soja vegetal, mecha de algodón puro y aceites esenciales seleccionados uno a uno. Lo lento, lo hecho con tiempo, es nuestro lujo.</p><div className="atl-sts"><div><div className="atl-sv">04</div><div className="atl-sl">Estampillas</div></div><div><div className="atl-sv">100%</div><div className="atl-sl">Cera de soja</div></div><div><div className="atl-sv">50h</div><div className="atl-sl">Hasta de quema</div></div></div></div></div></section>)}

function RitualSec(){
  const{goHome}=useApp();
  const r=[{n:"01",t:"La Primera Quema",x:"Permite que la cera derrita uniformemente hasta los bordes. Esto evita el túnel y prolonga la vida de tu vela."},{n:"02",t:"La Mecha",x:"Recorta la mecha a 5 mm antes de cada encendido. Una mecha bien recortada quema limpio y sin humo."},{n:"03",t:"El Espacio",x:"Coloca tu vela lejos de corrientes y fuentes de aire. Que la llama danse, pero quieta."},{n:"04",t:"El Reposo",x:"Disfruta entre 2 y 4 horas, no más. Apaga con tapa o apagavelas para preservar el aroma."}];
  return(<section className="sec"><button className="back-btn" onClick={goHome}>← Inicio</button><div className="slb">El Ritual</div><h2 className="st">Cómo cuidar<br/><em>tu carta de aroma.</em></h2><div className="rit-g">{r.map((item,idx)=>(<div key={item.n} className="rit-c">{idx%2===0?<img className="rit-stamp-tr" src={ST[idx%6]} alt=""/>:<img className="rit-stamp-br" src={ST[idx%6]} alt=""/>}<div className="rit-n">{item.n}</div><div className="rit-ct">{item.t}</div><div className="rit-cx">{item.x}</div></div>))}</div></section>);
}

function CartDrawer(){const{showCart,setShowCart,cart,removeFromCart,updateQty,cartTotal,goCheckout}=useApp();const sl=(s)=>SIZES.find(z=>z.key===s)?.label||s;const sw=(s)=>SIZES.find(z=>z.key===s)?.weight||"";return(<><div className={`co ${showCart?"open":""}`} onClick={()=>setShowCart(false)}/><div className={`cd ${showCart?"open":""}`}><div className="cd-h"><span className="cd-t">Tu Carrito</span><button className="cd-x" onClick={()=>setShowCart(false)}>×</button></div><div className="cd-b">{cart.length===0?<div className="cd-em"><p style={{fontSize:36,opacity:.2,marginBottom:12}}>◇</p><p>Tu carrito está vacío</p></div>:cart.map((it,i)=>(<div key={i} className="cd-it"><div className="cd-stp"><img src={PH[it.product.slug][it.size]} alt=""/></div><div className="cd-ii"><div className="cd-in">{it.product.name}</div><div className="cd-is">{sl(it.size)} · {sw(it.size)}</div><div className="cd-ic"><button className="qb" onClick={()=>updateQty(i,it.qty-1)}>−</button><span className="cd-iq">{it.qty}</span><button className="qb" onClick={()=>updateQty(i,it.qty+1)}>+</button><button className="cd-ir" onClick={()=>removeFromCart(i)}>Eliminar</button></div></div><div className="cd-ip">{fmt(it.product.prices[it.size]*it.qty)}</div></div>))}</div>{cart.length>0&&<div className="cd-f"><div className="cd-tr"><span className="cd-tl">Total</span><span className="cd-tv">{fmt(cartTotal)}</span></div><div className="cd-sn">{cartTotal>=150000?"✓ Envío gratuito":"Envío gratis desde "+fmt(150000)}</div><button className="btn bgd cd-cb" onClick={goCheckout}>Finalizar Compra</button></div>}</div></>)}
function AuthModal(){const{showAuth,setShowAuth,register,login,notify}=useApp();const[mode,setMode]=useState("login");const[n,setN]=useState("");const[e,setE]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const go=()=>{setErr("");if(mode==="register"){if(!n||!e||!pw){setErr("Completa todos los campos");return}const r=register(n,e,pw);if(r){setErr(r);return}notify("¡Bienvenido/a!")}else{if(!e||!pw){setErr("Completa todos los campos");return}const r=login(e,pw);if(r){setErr(r);return}notify("¡Hola de nuevo!")}setShowAuth(false);setN("");setE("");setPw("")};return(<div className={`ao ${showAuth?"open":""}`} onClick={()=>setShowAuth(false)}><div className="am" onClick={ev=>ev.stopPropagation()}><button className="am-x" onClick={()=>setShowAuth(false)}>×</button><h2 className="am-t">{mode==="login"?"Bienvenido":"Crear Cuenta"}</h2><p className="am-s">{mode==="login"?"Ingresa a tu cuenta":"Únete a Avalea"}</p>{mode==="register"&&<div className="fg"><label className="fl">Nombre</label><input className="fi" value={n} onChange={ev=>setN(ev.target.value)} placeholder="Tu nombre"/></div>}<div className="fg"><label className="fl">Correo</label><input className="fi" type="email" value={e} onChange={ev=>setE(ev.target.value)} placeholder="tu@correo.com"/></div><div className="fg"><label className="fl">Contraseña</label><input className="fi" type="password" value={pw} onChange={ev=>setPw(ev.target.value)} placeholder="••••••••"/></div>{err&&<div className="fe">{err}</div>}<button className="btn bgd" style={{width:"100%",marginTop:14}} onClick={go}>{mode==="login"?"Iniciar Sesión":"Crear Cuenta"}</button><div className="as">{mode==="login"?<>¿No tienes cuenta? <button onClick={()=>{setMode("register");setErr("")}}>Regístrate</button></>:<>¿Ya tienes cuenta? <button onClick={()=>{setMode("login");setErr("")}}>Inicia Sesión</button></>}</div></div></div>)}
function Checkout(){const{cart,cartTotal,user,goHome,setCart}=useApp();const[pm,setPm]=useState("card");const[ok,setOk]=useState(false);const sl=(s)=>SIZES.find(z=>z.key===s)?.label||s;const ship=cartTotal>=150000?0:12000;if(ok)return(<div className="suc-o"><div className="suc-m"><div className="suc-chk">✓</div><h2 className="suc-t">¡Pedido Confirmado!</h2><p className="suc-x">Gracias, {user?.name.split(" ")[0]}. Tu carta de aroma está en camino.</p><button className="btn bdk" onClick={()=>{setCart([]);goHome()}}>Volver al Inicio</button></div></div>);return(<section className="ck"><button className="back-btn" onClick={goHome}>← Volver</button><h1 className="ck-t">Finalizar Pedido</h1><div className="ck-g"><div><h3 className="ck-st">Dirección de Envío</h3><div className="ck-row"><div className="fg"><label className="fl">Nombre</label><input className="fi" defaultValue={user?.name||""}/></div><div className="fg"><label className="fl">Teléfono</label><input className="fi" placeholder="+57 300 000 0000"/></div></div><div className="fg"><label className="fl">Dirección</label><input className="fi" placeholder="Calle, número, apto"/></div><div className="ck-row"><div className="fg"><label className="fl">Ciudad</label><input className="fi" placeholder="Bogotá"/></div><div className="fg"><label className="fl">Departamento</label><input className="fi" placeholder="Cundinamarca"/></div></div><h3 className="ck-st" style={{marginTop:36}}>Método de Pago</h3><div className="pm">{["card","pse","nequi","efecty"].map(m=><button key={m} className={`pm-b ${pm===m?"act":""}`} onClick={()=>setPm(m)}>{m==="card"?"Tarjeta":m==="pse"?"PSE":m==="nequi"?"Nequi":"Efecty"}</button>)}</div>{pm==="card"&&<><div className="fg"><label className="fl">Número de tarjeta</label><input className="fi" placeholder="0000 0000 0000 0000"/></div><div className="ck-row"><div className="fg"><label className="fl">Vencimiento</label><input className="fi" placeholder="MM / AA"/></div><div className="fg"><label className="fl">CVV</label><input className="fi" placeholder="000"/></div></div></>}{pm==="pse"&&<div className="fg"><label className="fl">Banco</label><input className="fi" placeholder="Selecciona tu banco"/></div>}{pm==="nequi"&&<div className="fg"><label className="fl">Número Nequi</label><input className="fi" placeholder="+57 300 000 0000"/></div>}{pm==="efecty"&&<div className="fg"><label className="fl">Cédula</label><input className="fi" placeholder="Tu número de cédula"/></div>}<button className="btn bgd" style={{width:"100%",marginTop:20}} onClick={()=>setOk(true)}>Confirmar Pedido — {fmt(cartTotal+ship)}</button></div><div><div className="ck-sum"><h3 className="ck-st" style={{marginTop:0}}>Resumen</h3>{cart.map((it,i)=><div key={i} className="ck-si"><span>{it.product.name} <span style={{color:"var(--tx2)",fontSize:11}}>×{it.qty} · {sl(it.size)}</span></span><span style={{fontFamily:"var(--sf)",fontSize:15}}>{fmt(it.product.prices[it.size]*it.qty)}</span></div>)}<div className="ck-sr"><span>Subtotal</span><span>{fmt(cartTotal)}</span></div><div className="ck-sr"><span>Envío</span><span>{ship===0?"Gratis":fmt(ship)}</span></div><div className="ck-stot"><span className="ck-stl">Total</span><span className="ck-stv">{fmt(cartTotal+ship)}</span></div></div></div></div></section>)}
function Footer(){const{goHome,goCollection}=useApp();return(<footer className="ft"><div className="ft-in"><div><div className="ft-br">A V A L E A</div><div className="ft-tag">Aromas que viajan como cartas.<br/>Hechos a mano en Colombia, con tiempo y con calma.</div></div><div><div className="ft-ct">Tienda</div><button className="ft-l" onClick={goCollection}>Colección</button><button className="ft-l">Mini (70g)</button><button className="ft-l">Pequeño (120g)</button><button className="ft-l">Mediano (220g)</button><button className="ft-l">Grande (277g)</button></div><div><div className="ft-ct">Casa</div><button className="ft-l">El Atelier</button><button className="ft-l">El Ritual</button><button className="ft-l">Mayoristas</button><button className="ft-l">Regalos Corporativos</button></div><div><div className="ft-ct">Cartas Mensuales</div><div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:10}}>Recibe cada nueva edición directamente en tu correo.</div><div className="ft-ni"><input placeholder="tu correo"/><button>Enviar →</button></div></div></div><div className="ft-bot"><span>© MMXXVI Avalea · Bogotá, Colombia</span><span>Términos · Privacidad · Envíos · Instagram</span></div><div className="ft-dev">Desarrollado por <span>Brik Systems</span></div></footer>)}
function WhatsAppBtn(){return(<a className="wa-btn" href={`https://wa.me/${WHATSAPP}?text=Hola%20Avalea%2C%20me%20interesa%20su%20colección`} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>)}
function Toast(){const{toast}=useApp();return<div className={`toast ${toast?"show":""}`}>{toast}</div>}

// ─── Collection Page with VISIBLE back button ────────────
function CollectionPage(){
  const{goHome}=useApp();
  return(<>
    <div className="coll-header">
      <button className="back-btn-big" onClick={goHome}>← Volver al Inicio</button>
      <div className="slb" style={{justifyContent:"center"}}>La Colección</div>
      <h1 className="st" style={{textAlign:"center"}}>Cuatro destinos,<br/><em>cuatro memorias.</em></h1>
    </div>
    <div style={{padding:"0 48px 80px",maxWidth:1200,margin:"0 auto"}}><div className="pgr">{PRODUCTS.map(p=><PCard key={p.id} p={p}/>)}</div></div>
  </>);
}

function Content(){
  const{page}=useApp();useEffect(()=>{window.scrollTo(0,0)},[page]);
  const P=()=>{switch(page){
    case"home":return<><Hero/><Features/><StampsBand/><CollectionSec/><SlidesSection/><AtelierSec/><StampsBand/><RitualSec/></>;
    case"collection":return<CollectionPage/>;
    case"product":return<ProductDetail/>;
    case"checkout":return<Checkout/>;
    case"atelier":return<><AtelierSec/><Features/></>;
    case"ritual":return<RitualSec/>;
    default:return<><Hero/><Features/><StampsBand/><CollectionSec/><SlidesSection/><AtelierSec/><StampsBand/><RitualSec/></>;
  }};
  return<div className="app"><style>{CSS}</style><Nav/><P/><Footer/><CartDrawer/><AuthModal/><Toast/><WhatsAppBtn/></div>;
}
export default function App(){return<AppProvider><Content/></AppProvider>}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
:root{--cr:#F5F0E8;--cr2:#EDE6D8;--gd:#B8963E;--gl:#D4B66A;--gdd:#8A6E2F;--dk:#1A1A1A;--tx:#3A3530;--tx2:#7A7570;--wh:#FDFCFA;--bd:#E0D8CC;--sf:'Cormorant Garamond',Georgia,serif;--sn:'Jost','Helvetica Neue',sans-serif}
*{margin:0;padding:0;box-sizing:border-box}
.app{min-height:100vh;background:var(--cr);color:var(--tx);font-family:var(--sn);-webkit-font-smoothing:antialiased;overflow-x:hidden}
.ban{background:var(--dk);color:var(--gl);text-align:center;padding:10px 20px;font-size:11px;letter-spacing:3px;text-transform:uppercase}
.nav{display:flex;align-items:center;justify-content:space-between;padding:16px 48px;background:var(--cr);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:100}
.nvl{display:flex;gap:28px}.nl{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--tx);background:none;border:none;cursor:pointer;font-family:var(--sn);transition:color .3s}.nl:hover{color:var(--gd)}
.nlogo{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}.nav-bird{height:40px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.15))}.nlogo span{font-family:var(--sf);font-size:18px;letter-spacing:7px;color:var(--dk)}
.nvr{display:flex;gap:18px;align-items:center}.cbtn{position:relative}.bdg{position:absolute;top:-8px;right:-14px;background:var(--gd);color:var(--wh);font-size:9px;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600}
.uhi{font-size:12px;color:var(--tx2)}.uhi b{color:var(--dk);font-weight:500}.lout{background:none;border:none;font-size:11px;color:var(--tx2);cursor:pointer;text-decoration:underline;font-family:var(--sn)}
.back-btn{display:inline-flex;align-items:center;gap:8px;background:none;border:none;font-size:12px;letter-spacing:1.5px;color:var(--gd);cursor:pointer;font-family:var(--sn);margin-bottom:32px;padding:0;transition:color .3s}.back-btn:hover{color:var(--gdd)}
.back-btn-big{display:inline-flex;align-items:center;gap:8px;background:var(--gd);color:var(--wh);border:none;font-size:13px;letter-spacing:2px;cursor:pointer;font-family:var(--sn);margin-bottom:32px;padding:12px 28px;transition:background .3s;text-transform:uppercase}.back-btn-big:hover{background:var(--gdd)}
.coll-header{text-align:center;padding:50px 48px 40px;max-width:700px;margin:0 auto}
.hero{position:relative;height:85vh;min-height:500px;overflow:hidden;background:#1a1a1a}
.hero-ibg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}.hero-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.hvig{position:absolute;inset:0;background:radial-gradient(ellipse,transparent 40%,rgba(15,13,10,.4) 100%);z-index:2}.hgr{position:absolute;bottom:0;left:0;right:0;height:55%;background:linear-gradient(to top,rgba(15,13,10,.75),rgba(15,13,10,.3) 50%,transparent);z-index:2}
.hct{position:absolute;bottom:0;left:0;right:0;padding:60px;display:flex;justify-content:space-between;align-items:flex-end;z-index:3}
.hlb{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(212,182,106,.8);margin-bottom:14px;display:flex;align-items:center;gap:14px}.hlb::before{content:'';width:36px;height:1px;background:rgba(212,182,106,.5)}
.ht{font-family:var(--sf);font-size:clamp(40px,6vw,68px);line-height:1.05;font-weight:300;color:var(--wh);margin-bottom:14px}.ht em{color:var(--gl);font-style:italic}
.hsub{font-size:15px;color:rgba(253,252,250,.5);line-height:1.7;max-width:440px;margin-bottom:28px}.hbtns{display:flex;gap:14px}
.hr{text-align:right}.hr img{width:70px;margin-bottom:8px;filter:brightness(1.15);opacity:.85}.hr-b{font-family:var(--sf);font-size:16px;letter-spacing:6px;color:rgba(253,252,250,.6)}.hr-e{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(212,182,106,.45);margin-top:3px}
.scr{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:6px}.scr div{width:1px;height:28px;background:linear-gradient(to bottom,rgba(212,182,106,.5),transparent);animation:sp 2s ease-in-out infinite}.scr span{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(253,252,250,.25)}
@keyframes sp{0%,100%{opacity:.3;transform:scaleY(.7)}50%{opacity:.8;transform:scaleY(1)}}
.btn{padding:15px 36px;font-family:var(--sn);font-size:11px;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;transition:all .3s;font-weight:400;border:none}.bdk{background:var(--dk);color:var(--wh)}.bdk:hover{background:var(--gdd)}.bgd{background:var(--gd);color:var(--wh)}.bgd:hover{background:var(--gdd)}.bot{background:transparent;color:var(--wh);border:1px solid rgba(253,252,250,.3)}.bot:hover{background:rgba(253,252,250,.08)}
.feat{display:flex;justify-content:center;gap:48px;padding:28px 48px;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);background:var(--wh);flex-wrap:wrap}.feat span{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--tx2)}

/* Scrolling Stamps Band - FULL OPACITY */
.stamps-band{overflow:hidden;padding:16px 0;background:var(--cr2);border-top:1px solid var(--bd);border-bottom:1px solid var(--bd)}
.stamps-track{display:flex;gap:40px;animation:stampScroll 25s linear infinite;width:max-content}
.stamps-track img{height:100px;border-radius:2px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
@keyframes stampScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

.sec{padding:90px 48px;max-width:1200px;margin:0 auto;position:relative}
.slb{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--gd);margin-bottom:20px;display:flex;align-items:center;gap:14px}.slb::before{content:'';width:36px;height:1px;background:var(--gd)}
.st{font-family:var(--sf);font-size:clamp(36px,4.5vw,52px);line-height:1.1;font-weight:300;color:var(--dk);margin-bottom:14px}.st em{color:var(--gd);font-style:italic}
.sd{font-size:15px;line-height:1.8;color:var(--tx2);max-width:480px;margin-bottom:50px}
.pgr{display:grid;grid-template-columns:repeat(2,1fr);gap:32px}
.pc{background:var(--wh);border:1px solid var(--bd);cursor:pointer;transition:all .4s;overflow:hidden}.pc:hover{border-color:var(--gd);box-shadow:0 8px 36px rgba(0,0,0,.06);transform:translateY(-3px)}
.pc-img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:var(--cr2)}.pc-b{padding:28px 32px}.pc-top{display:flex;justify-content:space-between;margin-bottom:16px}
.pc-num{font-family:var(--sf);font-size:12px;letter-spacing:2px;color:var(--gd)}.pc-yr{font-family:var(--sf);font-size:12px;color:var(--tx2)}
.pc-cat{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--tx2);margin-bottom:6px}.pc-name{font-family:var(--sf);font-size:26px;color:var(--dk);margin-bottom:3px}
.pc-reg{font-size:13px;color:var(--tx2);font-style:italic;margin-bottom:16px}.pc-dv{width:36px;height:1px;background:var(--gd);margin-bottom:12px}
.pc-nt{font-size:13px;color:var(--tx);margin-bottom:20px}.pc-ft{display:flex;justify-content:space-between;align-items:center}
.pc-pl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--tx2)}.pc-pr{font-family:var(--sf);font-size:22px;color:var(--dk)}
.pc-cta{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gd);font-weight:500}

/* 3D Carousel */
.slides-sec{position:relative;max-width:1100px;margin:0 auto;padding:60px 48px}.carousel3d{position:relative;height:400px;perspective:1200px;display:flex;align-items:center;justify-content:center}
.car-slide{position:absolute;width:70%;max-width:700px;transition:all .8s cubic-bezier(.25,.46,.45,.94);border:1px solid var(--bd);overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08)}
.car-slide img{width:100%;height:100%;object-fit:cover;display:block}
.car-active{transform:translateX(0) scale(1);opacity:1;z-index:3}.car-prev{transform:translateX(-75%) scale(.75);opacity:.4;z-index:2;filter:brightness(.8)}.car-next{transform:translateX(75%) scale(.75);opacity:.4;z-index:2;filter:brightness(.8)}.car-hidden{transform:scale(.5);opacity:0;z-index:1}
.slides-dots{display:flex;justify-content:center;gap:10px;margin-top:24px}.sdot{width:8px;height:8px;border-radius:50%;border:1px solid var(--gd);background:transparent;cursor:pointer;transition:all .3s;padding:0}.sdot.act{background:var(--gd)}

/* Product Detail */
.pd{padding:48px;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:start}
.pd-v{position:relative;background:var(--cr2);padding:24px;min-height:550px;overflow:visible}.pd-vl{position:absolute;top:24px;left:28px;font-size:12px;letter-spacing:2px;color:var(--tx2);z-index:2}
.pd-seal{position:absolute;top:20px;right:28px;width:60px;height:60px;border:1.5px solid var(--bd);border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2}.pd-st{font-family:var(--sf);font-size:9px;letter-spacing:1.5px;color:var(--tx2);text-transform:uppercase;text-align:center;line-height:1.2}

/* Zoom - magnifying circle that follows cursor */
.zoom-container{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;cursor:crosshair;min-height:480px}
.zoom-img{max-height:500px;max-width:100%;object-fit:contain;filter:drop-shadow(0 8px 24px rgba(0,0,0,.1))}
.zoom-circle{position:absolute;width:180px;height:180px;border-radius:50%;border:3px solid var(--gd);background-size:800%;background-repeat:no-repeat;box-shadow:0 4px 24px rgba(0,0,0,.2);z-index:10;pointer-events:none;transform:translate(-50%,-50%)}

.pd-i{padding-top:8px}.pd-cat{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--tx2);margin-bottom:8px;display:flex;align-items:center;gap:12px}.pd-cat::before{content:'';width:28px;height:1px;background:var(--gd)}
.pd-nm{font-family:var(--sf);font-size:clamp(32px,4vw,46px);color:var(--dk);margin-bottom:4px;font-weight:400}.pd-rg{font-size:14px;color:var(--tx2);font-style:italic;margin-bottom:28px}
.pd-sep{width:100%;height:1px;background:var(--bd);margin-bottom:28px}.pd-ds{font-size:15px;line-height:1.8;color:var(--tx2);margin-bottom:32px}
.pd-nlb{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--tx);margin-bottom:10px}.pd-nl{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px}
.pd-nc{padding:8px 16px;border:1px solid var(--bd);font-size:13px;color:var(--tx);background:var(--wh)}
.pd-slb{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--tx2);margin-bottom:10px;display:flex;justify-content:space-between}
.pd-szs{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:28px}
.pd-sz{padding:16px 8px;border:1px solid var(--bd);background:var(--wh);cursor:pointer;text-align:center;transition:all .3s;font-family:var(--sn)}.pd-sz.act{border-color:var(--gd);background:rgba(184,150,62,.04)}
.pd-szw{font-family:var(--sf);font-size:28px;color:var(--dk);font-weight:300;line-height:1}.pd-szw small{font-size:14px}
.pd-szl{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--tx2);margin:4px 0}.pd-szp{font-size:13px;color:var(--dk);font-weight:500}
.pd-ar{display:flex;gap:12px;margin-bottom:28px}.pd-qt{display:flex;align-items:center;border:1px solid var(--bd)}.pd-qt button{width:44px;height:52px;background:var(--wh);border:none;font-size:16px;cursor:pointer;color:var(--tx);font-family:var(--sn)}.pd-qt span{width:32px;text-align:center;font-size:15px;color:var(--dk)}
.pd-ab{flex:1;display:flex;justify-content:space-between;align-items:center;padding:0 28px}
.pd-dt{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding-top:28px;border-top:1px solid var(--bd)}.pd-dl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--tx2)}.pd-dv2{font-size:13px;color:var(--dk);margin-top:2px}

.atl{background:var(--dk);padding:100px 48px;position:relative;overflow:hidden}
.atl-in{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
.atl .slb{color:var(--gl)}.atl .slb::before{background:var(--gl)}.atl .st{color:var(--wh)}
.atl-d{font-size:15px;line-height:1.9;color:rgba(255,255,255,.55);margin-bottom:20px}
.atl-sts{display:flex;gap:44px;padding-top:28px;border-top:1px solid rgba(255,255,255,.1)}.atl-sv{font-family:var(--sf);font-size:32px;color:var(--gl);font-weight:300}.atl-sl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:3px}

/* Ritual - stamps FULL OPACITY */
.rit-g{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:50px}
.rit-c{padding:28px 20px;border:1px solid var(--bd);background:var(--wh);position:relative;overflow:hidden}
.rit-stamp-tr{position:absolute;top:-10px;right:-10px;height:100px;opacity:1;transform:rotate(8deg);z-index:0}
.rit-stamp-br{position:absolute;bottom:-8px;right:-8px;height:90px;opacity:1;transform:rotate(-12deg);z-index:0}
.rit-n{font-family:var(--sf);font-size:36px;color:var(--gl);font-weight:300;margin-bottom:12px;position:relative;z-index:1}
.rit-ct{font-family:var(--sf);font-size:18px;color:var(--dk);margin-bottom:10px;position:relative;z-index:1}.rit-cx{font-size:13px;line-height:1.7;color:var(--tx2);position:relative;z-index:1}

.co{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;opacity:0;pointer-events:none;transition:opacity .3s}.co.open{opacity:1;pointer-events:all}
.cd{position:fixed;top:0;right:0;width:420px;max-width:100vw;height:100vh;background:var(--wh);z-index:201;transform:translateX(100%);transition:transform .4s cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column}.cd.open{transform:translateX(0)}
.cd-h{display:flex;justify-content:space-between;align-items:center;padding:22px 28px;border-bottom:1px solid var(--bd)}.cd-t{font-family:var(--sf);font-size:22px;color:var(--dk)}.cd-x{background:none;border:none;font-size:22px;cursor:pointer;color:var(--tx2);line-height:1}
.cd-b{flex:1;overflow-y:auto;padding:20px 28px}.cd-em{text-align:center;padding:50px 0;color:var(--tx2)}
.cd-it{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid var(--bd)}.cd-stp{width:60px;height:72px;background:var(--cr2);border:1px solid var(--bd);flex-shrink:0;overflow:hidden}.cd-stp img{height:100%;object-fit:cover}
.cd-ii{flex:1}.cd-in{font-family:var(--sf);font-size:17px;color:var(--dk);margin-bottom:3px}.cd-is{font-size:11px;color:var(--tx2);margin-bottom:10px}
.cd-ic{display:flex;align-items:center;gap:10px}.qb{width:26px;height:26px;border:1px solid var(--bd);background:var(--wh);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;color:var(--tx)}.qb:hover{border-color:var(--gd)}
.cd-iq{font-size:13px;color:var(--dk);min-width:18px;text-align:center}.cd-ir{background:none;border:none;font-size:10px;color:var(--tx2);cursor:pointer;margin-left:auto;text-decoration:underline;font-family:var(--sn)}
.cd-ip{font-family:var(--sf);font-size:17px;color:var(--dk);text-align:right}.cd-f{padding:22px 28px;border-top:1px solid var(--bd)}.cd-tr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.cd-tl{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--tx2)}.cd-tv{font-family:var(--sf);font-size:26px;color:var(--dk)}
.cd-sn{font-size:11px;color:var(--tx2);text-align:center;margin-bottom:14px}.cd-cb{width:100%}
.ao{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s}.ao.open{opacity:1;pointer-events:all}
.am{background:var(--wh);width:420px;max-width:90vw;padding:44px;position:relative}.am-x{position:absolute;top:18px;right:18px;background:none;border:none;font-size:18px;cursor:pointer;color:var(--tx2)}
.am-t{font-family:var(--sf);font-size:30px;color:var(--dk);margin-bottom:6px}.am-s{font-size:13px;color:var(--tx2);margin-bottom:28px}
.fg{margin-bottom:18px}.fl{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--tx2);margin-bottom:7px}
.fi{width:100%;padding:13px 15px;border:1px solid var(--bd);background:var(--cr);font-family:var(--sn);font-size:14px;color:var(--dk);outline:none;transition:border-color .3s}.fi:focus{border-color:var(--gd)}
.fe{color:#c44;font-size:12px;margin-top:5px}.as{text-align:center;margin-top:20px;font-size:13px;color:var(--tx2)}.as button{background:none;border:none;color:var(--gd);cursor:pointer;font-family:var(--sn);font-size:13px;font-weight:500}
.ck{padding:48px;max-width:1000px;margin:0 auto}.ck-t{font-family:var(--sf);font-size:36px;color:var(--dk);margin-bottom:36px}
.ck-g{display:grid;grid-template-columns:1.2fr .8fr;gap:52px}.ck-st{font-family:var(--sf);font-size:20px;color:var(--dk);margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid var(--bd)}
.ck-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}.ck-sum{background:var(--wh);border:1px solid var(--bd);padding:28px}
.ck-si{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--bd);font-size:13px}.ck-sr{display:flex;justify-content:space-between;padding:10px 0;font-size:13px;color:var(--tx2)}
.ck-stot{display:flex;justify-content:space-between;padding-top:14px;border-top:1px solid var(--bd);margin-top:6px}.ck-stl{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--tx2)}.ck-stv{font-family:var(--sf);font-size:26px;color:var(--dk)}
.pm{display:flex;gap:10px;margin-bottom:20px}.pm-b{flex:1;padding:13px;border:1px solid var(--bd);background:var(--cr);cursor:pointer;text-align:center;font-size:12px;color:var(--tx);transition:all .3s;font-family:var(--sn)}.pm-b.act{border-color:var(--gd);background:rgba(184,150,62,.07)}
.suc-o{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:400;display:flex;align-items:center;justify-content:center}.suc-m{background:var(--wh);padding:52px;text-align:center;max-width:460px}
.suc-chk{width:58px;height:58px;border:2px solid var(--gd);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:26px;color:var(--gd)}.suc-t{font-family:var(--sf);font-size:28px;color:var(--dk);margin-bottom:10px}.suc-x{font-size:14px;color:var(--tx2);line-height:1.7;margin-bottom:28px}
.ft{background:var(--dk);padding:70px 48px 36px}.ft-in{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.2fr .8fr .8fr 1.2fr;gap:40px;margin-bottom:50px}
.ft-br{font-family:var(--sf);font-size:20px;letter-spacing:6px;color:var(--wh);margin-bottom:12px}.ft-tag{font-size:13px;color:rgba(255,255,255,.35);font-style:italic;line-height:1.6}
.ft-ct{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gl);margin-bottom:16px}
.ft-l{display:block;font-size:13px;color:rgba(255,255,255,.45);margin-bottom:10px;cursor:pointer;background:none;border:none;font-family:var(--sn);text-align:left;padding:0;transition:color .3s}.ft-l:hover{color:var(--wh)}
.ft-ni{display:flex;border:1px solid rgba(255,255,255,.12);margin-top:10px}.ft-ni input{flex:1;background:transparent;border:none;padding:11px 14px;color:var(--wh);font-family:var(--sn);font-size:13px;outline:none}.ft-ni input::placeholder{color:rgba(255,255,255,.25)}
.ft-ni button{background:transparent;border:none;border-left:1px solid rgba(255,255,255,.12);padding:11px 18px;color:var(--gl);font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:var(--sn)}
.ft-bot{max-width:1200px;margin:0 auto;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.25)}
.ft-dev{text-align:center;padding:16px;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;margin-top:12px;color:rgba(255,255,255,.3)}.ft-dev span{color:var(--gl);font-weight:600;font-size:13px}
.wa-btn{position:fixed;bottom:28px;right:28px;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:150;box-shadow:0 4px 16px rgba(37,211,102,.4);transition:transform .3s,box-shadow .3s;text-decoration:none}.wa-btn:hover{transform:scale(1.1);box-shadow:0 6px 24px rgba(37,211,102,.5)}
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--dk);color:var(--wh);padding:14px 28px;font-size:13px;z-index:500;transition:transform .4s cubic-bezier(.16,1,.3,1);white-space:nowrap}.toast.show{transform:translateX(-50%) translateY(0)}
@media(max-width:768px){.nav{padding:14px 16px}.nvl{display:none}.hero{height:60vh}.hct{padding:28px 20px}.ht{font-size:32px}.pgr{grid-template-columns:1fr}.pd{grid-template-columns:1fr;padding:24px 16px;gap:32px}.pd-szs{grid-template-columns:repeat(2,1fr)}.atl-in{grid-template-columns:1fr}.rit-g{grid-template-columns:1fr 1fr}.ck-g{grid-template-columns:1fr}.ft-in{grid-template-columns:1fr 1fr}.sec{padding:50px 16px}.atl{padding:50px 16px}.feat{gap:16px;padding:16px}.carousel3d{height:250px}.car-slide{width:85%}.zoom-circle{display:none}.stamps-track img{height:70px}}
`;