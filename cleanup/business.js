/* Single source of truth for Maple Axis (details supplied by Naveen 2026-11-16, from the owner's own text). Every cleanup version reads window.BIZ.
   Rule: no invented prices, testimonials, insurance or certification claims. Add them only when the owner supplies them. */
window.BIZ = {
  logo: "assets/maple-axis-logo.png",
  name: "Maple Axis",
  legalLine: "Industrial & Commercial Services",
  tagline: "Raising the Standard in Industrial & Commercial Services",
  short: "Industrial and commercial services across the GTA",
  phone: "+1 (647) 936-2203",
  phoneRaw: "6479362203",
  email: "Info.mapleaxis@gmail.com",
  address: "North York, Toronto and the GTA",
  addressLines: ["North York, Toronto and the GTA"],
  area: "North York, Toronto and the GTA",
  cities: ["North York", "Toronto", "Etobicoke", "Scarborough", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill"],
  hours: "Call or email for availability",
  about: [
    "At Maple Axis, we believe every facility deserves a higher standard of care, performance and professionalism.",
    "We are an industrial and commercial services company committed to delivering dependable, efficient and high-quality solutions for businesses, commercial properties and industrial facilities.",
    "From specialized high-dusting and pressure washing to commercial facility maintenance and large-scale industrial cleaning projects, we bring the right equipment, attention to detail and a professional approach to every job.",
    "Our goal is simple: to help businesses maintain cleaner, safer and better-maintained environments while minimizing operational disruptions."
  ],
  commitment: [
    "At Maple Axis, we value reliability, consistency and building lasting business relationships.",
    "We understand that every facility has different operational requirements. That's why we approach every project with careful planning, attention to detail and a commitment to delivering results that meet our clients' expectations.",
    "Whether it's a scheduled maintenance contract or a specialized industrial project, we strive to deliver professional service from start to finish."
  ],
  /* Four short values for trust strips (no claims we cannot back up) */
  values: [
    { icon: "🛡️", title: "Reliable", text: "Dependable service you can plan around" },
    { icon: "🏢", title: "Commercial & Industrial", text: "Solutions for every facility" },
    { icon: "📍", title: "GTA Service Area", text: "Local, responsive, professional" },
    { icon: "🤝", title: "Lasting relationships", text: "Built on consistency and trust" }
  ],
  services: [
    { id: "contract", name: "Industrial & commercial contract services", desc: "Scheduled and project-based service contracts for businesses, commercial properties and industrial facilities, planned around your operations.", icon: "📑", from: null },
    { id: "highdust", name: "High-level dusting & overhead structure cleaning", desc: "Specialized cleaning of beams, ductwork, racking, lighting and other overhead structures, where dust builds up out of reach.", icon: "🏗️", from: null },
    { id: "pressure", name: "Commercial & industrial pressure washing", desc: "Pressure washing for loading docks, parking areas, building exteriors, equipment and heavily soiled surfaces.", icon: "💦", from: null },
    { id: "warehouse", name: "Warehouse & facility maintenance", desc: "Ongoing upkeep that keeps warehouses and commercial facilities clean, safe and in good working order.", icon: "🏭", from: null },
    { id: "floors", name: "Industrial floor scrubbing & surface cleaning", desc: "Machine floor scrubbing and surface cleaning for warehouses, plants, shops and large commercial spaces.", icon: "🧽", from: null },
    { id: "special", name: "Specialized cleaning & maintenance projects", desc: "Large-scale and one-off projects, including post-construction and post-drywall cleanup, planned and carried out to a clear scope.", icon: "🧹", from: null }
  ],
  process: [
    { step: "Reach out", desc: "Call or email us with your facility, the work and your timing." },
    { step: "Plan", desc: "We review the scope and requirements and plan the job around your operations." },
    { step: "Do the work", desc: "The right equipment and a careful, professional approach, with as little disruption as possible." },
    { step: "Hand over", desc: "We check the result against the scope and hand the space back clean and ready." }
  ],
  forContractors: {
    pitch: "General contractors, drywall crews and property managers: when your trade finishes, we clean up. Ask about project and contract work.",
    perks: [
      "Post-construction and post-drywall cleanup",
      "Scheduled maintenance contracts",
      "Planned around your site schedule",
      "Careful work that limits disruption"
    ]
  },
  faq: [
    { q: "What kinds of facilities do you work in?", a: "Businesses, commercial properties and industrial facilities, including warehouses and large commercial spaces." },
    { q: "Do you do one-off projects as well as contracts?", a: "Yes. We take scheduled maintenance contracts and specialized one-off industrial or commercial projects." },
    { q: "Can you clean after construction or drywall work?", a: "Yes, post-construction and post-drywall cleanup is part of our specialized cleaning projects." },
    { q: "How do I get a price?", a: "Call or email us with the location, the type of work and your timing, and we will respond with a quote. Pricing depends on the scope." },
    { q: "Which areas do you cover?", a: "North York, Toronto and the GTA." },
    { q: "How do I reach you?", a: "Phone +1 (647) 936-2203, or email Info.mapleaxis@gmail.com." }
  ],
  /* Real testimonials only. Empty until the owner supplies some: versions must hide the block when this is empty. */
  quotes: [],
  formatPrice: function (n) {
    if (n === null || n === undefined || isNaN(n)) return "Custom quote";
    return "$" + Number(n).toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " CAD";
  }
};
