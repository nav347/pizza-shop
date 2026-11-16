/* Single source of truth for "Maple Axis" (placeholder name). Every cleanup version reads window.BIZ. */
window.BIZ = {
  logo: "assets/maple-axis-logo.png",
  name: "Maple Axis",
  tagline: "Post-drywall cleanup and commercial services, GTA",
  phone: "+1 (416) 555-0188",
  email: "hello@example.com",
  area: "Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Pickering and Ajax",
  cities: ["Toronto", "Etobicoke", "North York", "Scarborough", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Pickering", "Ajax"],
  hours: "Mon to Sat 7:00 am to 7:00 pm. Sunday by arrangement. Same-day quotes.",
  services: [
    { id: "dust", name: "Fine-dust HEPA vacuuming", desc: "Every surface vacuumed with HEPA-filtered machines so sanding dust is removed, not pushed into the air: walls, ceilings, ledges, trim, window tracks and inside closets.", icon: "🧹", from: 220 },
    { id: "wipe", name: "Wall, ceiling & trim wipe-down", desc: "Damp microfibre wipe of walls, ceilings, baseboards, door frames and sills so paint and primer bond to a clean surface.", icon: "🧽", from: 180 },
    { id: "debris", name: "Debris & offcut haul-away", desc: "Drywall offcuts, buckets, compound pails, packaging and mud droppings bagged and taken away. Disposal handled at licensed transfer stations.", icon: "🚚", from: 150 },
    { id: "floors", name: "Floor cleaning", desc: "Vacuum, then damp mop or scrub for hardwood, tile, vinyl, concrete and subfloor. Dried joint compound lifted without scratching.", icon: "🪣", from: 140 },
    { id: "air", name: "Air scrubbing", desc: "HEPA air scrubbers run during and after cleaning to capture the fine dust still floating in the air. Ideal for occupied homes and basements.", icon: "💨", from: 160 },
    { id: "vents", name: "Vent & duct-register cleaning", desc: "Registers, returns and visible duct openings vacuumed and wiped. Drywall dust in your furnace is the reason it clogs filters in a week.", icon: "🌀", from: 120 },
    { id: "film", name: "Protective-film & tape removal", desc: "Poly sheeting, zip walls, floor protection, painter's tape and corner guards removed and disposed of with no residue left behind.", icon: "🎭", from: 90 },
    { id: "paintprep", name: "Paint-ready prep", desc: "A final detail pass so painters can start the same day: dust-free walls, clean ceilings and tacked trim ready for primer.", icon: "🎨", from: 200 },
    { id: "contractor", name: "Contractor subcontract partnerships", desc: "A dedicated crew on your schedule: flat per-job pricing, insured, invoiced to your company, ready within 24 hours of your drywall finish.", icon: "🤝", from: null }
  ],
  process: [
    { step: "Book", desc: "Call, text or send the form. Tell us the address, the size and when the drywall crew finishes. You get a quote the same day." },
    { step: "Walkthrough", desc: "We look at the space (or review photos), flag stairs, finishes and problem areas, and confirm a fixed price before we start." },
    { step: "Clean", desc: "Top to bottom: ceilings, walls, trim, vents, then floors last. HEPA vacuums and air scrubbers keep the dust from settling twice." },
    { step: "Inspection", desc: "We walk it with you or the site lead, fix anything missed on the spot, and hand the room over paint-ready." }
  ],
  forContractors: {
    pitch: "Your drywall crew finishes, we clean up. Stop pulling your tapers off the next job to sweep. We show up within 24 hours, work to your schedule and leave the site paint-ready.",
    perks: [
      "Flat per-job or per-sq-ft pricing, agreed before the job",
      "Fully insured, WSIB clearance certificate available",
      "24 hour turnaround after you call it complete",
      "Photo report sent to you and the homeowner",
      "Monthly invoicing with your company name on it",
      "We never approach your client for other work"
    ]
  },
  faq: [
    { q: "How soon can you come after the drywall is finished?", a: "Usually within 24 hours, and often the same day for smaller jobs. For contractors we hold crew time for your regular schedule." },
    { q: "How much does a post-drywall cleanup cost?", a: "Most Toronto-area homes run from $220 for a small room to $900 or more for a full basement or whole house. We quote a fixed price after a walkthrough or photos, not an open hourly rate." },
    { q: "Do you use HEPA vacuums?", a: "Yes. Drywall dust is extremely fine and standard vacuums blow it back into the room. All our vacuums and air scrubbers use HEPA filtration." },
    { q: "Will you do the work before painting?", a: "That is the best time. Our paint-ready prep pass leaves walls, ceilings and trim clean enough for primer. If the dust is not removed, it shows through the paint." },
    { q: "Are you insured?", a: "Yes. We carry commercial general liability coverage and can provide a certificate of insurance and WSIB clearance for your site." },
    { q: "Do I need to be home?", a: "No, as long as we have access (lockbox, concierge or the contractor on site). We send photos when the job is done." },
    { q: "Do you take away the waste?", a: "Yes. Offcuts, buckets and packaging are included in debris haul-away. Large bin loads are priced separately before we start." },
    { q: "Which areas do you cover?", a: "Toronto and the GTA: Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Pickering and Ajax. Ask us about Hamilton, Barrie and Durham." }
  ],
  quotes: [
    { text: "Our tapers finished Friday and the house was paint-ready Saturday morning. No dust on the windowsills, none in the vents.", who: "Priya N., homeowner, Etobicoke" },
    { text: "We use Maple Axis on every basement finish now. It frees my crew for the next drywall job and clients love the photo report.", who: "Marco D., drywall contractor, Vaughan" },
    { text: "As a property manager I need units turned over fast. They cleaned six suites after drywall repairs in two days.", who: "Jennifer L., property manager, Mississauga" }
  ],
  formatPrice: function (n) {
    if (n === null || n === undefined || isNaN(n)) return "Custom quote";
    return "$" + Number(n).toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " CAD";
  }
};
