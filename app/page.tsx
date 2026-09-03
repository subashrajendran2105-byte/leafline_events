'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const sections = [
  ['01', 'The idea', 'Every event begins with a leaf of faith.'],
  ['02', 'Who we are', 'We turn concepts, celebrations and brand moments into experiences people remember.'],
  ['03', 'What we do', 'Strategy, planning, creative design, production, hospitality and on-ground execution.'],
  ['04', 'The work', 'Corporate events, intimate weddings, brand activations and private celebrations.'],
  ['05', 'The journey', 'You bring the idea. We shape it. We plan it. 50% advance. Then we bring it to life.'],
  ['06', 'Let’s create', 'Your idea. Your budget. Our creativity. Let’s make something worth remembering.'],
]

function TreeScene() {
  const mount = useRef<HTMLDivElement>(null)
  const leaf = useRef<THREE.Mesh>(null)
  const tree = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!mount.current) return
    const host = mount.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#030604')

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 2.1, 8.8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setSize(host.clientWidth, host.clientHeight)
    host.appendChild(renderer.domElement)

    const ambient = new THREE.HemisphereLight(0x8bcf7b, 0x071008, 2.2)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xcfffc8, 4)
    key.position.set(-4, 7, 5)
    scene.add(key)

    const group = new THREE.Group()
    tree.current = group
    scene.add(group)

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x171d16, roughness: 0.9 })
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x203f24, roughness: 0.8 })
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x6ee66a, emissive: 0x163d16, emissiveIntensity: 0.7, roughness: 0.45 })

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.72, 4.8, 14), trunkMat)
    trunk.position.y = -0.8
    group.add(trunk)

    const branches = [
      [0, 1.0, -0.3, 2.1, 0.35], [-1.0, 1.8, -0.2, 1.9, -0.7], [1.0, 2.0, -0.2, 1.8, 0.65],
      [-1.7, 2.65, 0, 1.5, -0.9], [1.7, 2.8, 0, 1.45, 0.9], [-0.7, 3.2, 0, 1.55, -0.25], [0.75, 3.35, 0, 1.5, 0.25]
    ]
    branches.forEach(([x, y, z, len, rot]) => {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.25, len, 10), trunkMat)
      b.position.set(x, y, z)
      b.rotation.z = rot
      group.add(b)
    })

    const crown = new THREE.Group()
    group.add(crown)
    ;[
      [-1.7,3.1,0,1.7],[-0.6,3.8,0,1.9],[0.6,3.9,0,2.0],[1.7,3.3,0,1.6],[0,3.0,0.2,2.0],[-1.1,2.65,0.1,1.5],[1.15,2.75,0.1,1.5]
    ].forEach(([x,y,z,s]) => {
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 2), greenMat)
      c.position.set(x,y,z)
      c.scale.y = 0.78
      crown.add(c)
    })

    const falling: THREE.Mesh[] = []
    const leafGeo = new THREE.PlaneGeometry(0.16, 0.28)
    for (let i = 0; i < 32; i++) {
      const m = new THREE.Mesh(leafGeo, greenMat)
      m.position.set((Math.random()-0.5)*5.5, 1.4 + Math.random()*4.5, (Math.random()-0.5)*1.5)
      m.rotation.set(Math.random()*2, Math.random()*2, Math.random()*6)
      m.userData = { baseX:m.position.x, speed:0.2+Math.random()*0.35, phase:Math.random()*6 }
      scene.add(m); falling.push(m)
    }

    const heroLeaf = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.7), accentMat)
    heroLeaf.position.set(0.7, 3.5, 1.4)
    heroLeaf.rotation.z = -0.5
    leaf.current = heroLeaf
    scene.add(heroLeaf)

    let targetProgress = 0
    let currentProgress = 0
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      targetProgress = Math.min(1, Math.max(0, window.scrollY / max))
    }
    window.addEventListener('scroll', onScroll, { passive:true })

    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return
      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(host.clientWidth, host.clientHeight)
    }
    window.addEventListener('resize', resize)

    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      const t = clock.getElapsedTime()
      currentProgress += (targetProgress-currentProgress)*0.055
      const p = currentProgress
      camera.position.x = Math.sin(p*Math.PI*1.6)*1.25
      camera.position.y = 2.1 + p*1.2
      camera.position.z = 8.8 - p*3.15
      camera.lookAt(0, 2.25 + p*0.8, 0)
      group.rotation.y = Math.sin(p*Math.PI)*0.18
      group.position.y = p*0.35
      if (leaf.current) {
        const l = leaf.current
        l.position.x = 0.7 - p*2.4 + Math.sin(p*18)*0.18
        l.position.y = 3.5 - p*4.9
        l.position.z = 1.4 + p*1.8
        l.rotation.z = -0.5 + p*8
        const s = 1 + p*1.25
        l.scale.set(s,s,s)
      }
      falling.forEach((m) => {
        m.position.y -= m.userData.speed*0.016
        m.position.x = m.userData.baseX + Math.sin(t+m.userData.phase)*0.32
        m.rotation.z += 0.012
        if (m.position.y < 0.1) m.position.y = 4.8 + Math.random()*1.5
      })
      renderer.render(scene,camera)
      raf=requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mount} className="scene-canvas" aria-hidden="true" />
}

export default function Home() {
  return (
    <main>
      <div className="progress" />
      <header className="nav"><div className="logo"><i />LEAFLINE <small>events</small></div><nav><a href="#about">About</a><a href="#services">Services</a><a href="#work">Work</a><a href="#quote">Quote</a></nav><a className="navButton" href="#quote">Start a conversation ↗</a></header>

      <section className="hero">
        <TreeScene />
        <div className="heroShade" />
        <div className="heroText"><p className="kicker">A FULL-SERVICE EVENT MANAGEMENT COMPANY</p><h1>Every event begins<br />with a <em>leaf of faith.</em></h1><p>From concept to creation — we grow your vision into experiences worth remembering.</p><a className="cta" href="#about">Begin the journey <span>↓</span></a></div>
        <div className="heroBottom"><span>CHENNAI · INDIA</span><span>SCROLL TO EXPLORE</span></div>
      </section>

      <section className="journey intro" id="about"><div className="copy"><p className="kicker">THE LEAFLINE IDEA</p><h2>An event has a venue.<br />An <em>experience</em> has a feeling.</h2><p>Leafline Events was born from a simple conviction: every great story deserves an extraordinary stage. We build worlds — from the first spark of an idea to the final standing ovation.</p></div></section>

      <section className="dark stats"><p className="kicker">THE JOURNEY SO FAR</p><h2>Ideas that grew<br />into <em>memories.</em></h2><div className="statGrid"><div><b>100<span>+</span></b><small>Experiences</small></div><div><b>50<span>+</span></b><small>Brands & clients</small></div><div><b>01</b><small>Team behind every detail</small></div></div></section>

      <section className="services dark" id="services"><p className="kicker">WHAT WE PROVIDE</p><h2>One team.<br /><em>Every detail.</em></h2><div className="serviceList"><article><span>01</span><h3>Event Strategy & Planning</h3><p>Goals, budget, timeline, venue and logistics — shaped before the first detail is placed.</p></article><article><span>02</span><h3>Creative Design & Decor</h3><p>Theme integration, floral and table design, spatial styling and atmosphere.</p></article><article><span>03</span><h3>Technical Production & AV</h3><p>Sound, lighting, stage production, LED screens and visual effects.</p></article><article><span>04</span><h3>Entertainment & Talent</h3><p>Performers, speakers, DJs, interactive stations and day-of management.</p></article><article><span>05</span><h3>Gifting & Guest Management</h3><p>Curated favors, branded swag, invitations, registration and guest experience.</p></article></div></section>

      <section className="work" id="work"><p className="kicker">THE WORK</p><h2>From concept<br />to <em>creation.</em></h2><div className="workGrid"><div className="workCard tall"><div className="workVisual wedding" /><h3>Weddings & Private Celebrations</h3></div><div className="workCard"><div className="workVisual brand" /><h3>Brand Activations</h3></div><div className="workCard"><div className="workVisual corporate" /><h3>Corporate Experiences</h3></div></div></section>

      <section className="process dark"><div><p className="kicker">HOW IT WORKS</p><h2>A simple journey.<br /><em>A serious result.</em></h2></div><div className="steps">{sections.slice(0,5).map(([n,t,d]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></section>

      <section className="quote dark" id="quote"><p className="kicker">LET’S TALK</p><h2>Got an event<br /><em>in mind?</em></h2><p>Curious what your idea could cost? Let’s test the budget, explore the possibilities, and see what we can create together.</p><div className="quoteLine"><b>Your idea.</b><b>Your budget.</b><b>Our creativity.</b></div><a className="cta" href="https://wa.me/919600065771?text=Hi%20Leafline%20Events!%20I%20have%20an%20event%20I%27d%20like%20to%20discuss." target="_blank" rel="noreferrer">Get my quote on WhatsApp ↗</a><small>50% advance is required to confirm the project and begin work.</small></section>

      <footer><div className="logo"><i />LEAFLINE <small>events</small></div><p>Bring together your moments with Leafline Events.</p><div><a href="#about">About</a><a href="#services">Services</a><a href="#work">Work</a><a href="#quote">WhatsApp</a></div></footer>
    </main>
  )
}
