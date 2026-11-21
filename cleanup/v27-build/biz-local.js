/* v16 wording overrides. Loaded right after ../business.js on every page, so these win over the shared data.
   Real contact details (phone, email, address, area, cities) are NOT changed here: they still come from ../business.js.
   Anything marked PLACEHOLDER is sample content for the demo and must be confirmed by Adarsh (see WORDING-TO-CONFIRM.md). */
(function (B) {
  if (!B) return;
  B.logo = "assets/maple-axis-logo.svg";
  B.legalLine = "Industrial, Commercial & Residential Services";
  B.tagline = "Keeping Commercial & Industrial Spaces Running at Their Best.";
  /* v24: the street address is removed from the whole site, including shared FAQ text */
  B.address = "";
  B.faq = (B.faq || []).map(function (f) {
    return { q: f.q, a: String(f.a).replace(/\s*We are at [^.]*\./, "").replace(/\d+-\d+\s+Lawr\w+\s+Ave\w*\.?\s+W\w*,?( North York,?)?( ON)?( M5M\s*1C3)?/gi, "North York") };
  });
  B.short = "Industrial, commercial and residential services across the GTA";

  /* copy, do not mutate the shared arrays in place */
  B.values = [
    { title: "Reliable", text: "Dependable service you can plan around" },
    { title: "Industrial, Commercial & Residential", text: "From plants and offices to homes" },
    { title: "GTA Service Area", text: "Local, responsive, professional" },
    { title: "Lasting relationships", text: "Built on consistency and trust" }
  ];
  B.about = B.about.slice();
  B.about[1] = "We are an industrial, commercial and residential services company committed to delivering dependable, efficient and high-quality solutions for businesses, commercial properties, industrial facilities and homes.";
  B.about[3] = "Our goal is simple: to help businesses and homeowners maintain cleaner, safer and better-maintained spaces while minimizing disruption.";
  B.process = [
    { step: "Reach out", desc: "Call or email us with your property, the work and your timing." },
    { step: "Plan", desc: "We review the scope and requirements and plan the job around your operations or your household." },
    B.process[2],
    B.process[3]
  ];

  /* PLACEHOLDER: residential service lines, adapted from the real business services. Prices are samples, shown with a "Sample price" tag. */
  B.residential = [
    { id: "r-reno", name: "Post-renovation & post-drywall cleanup", desc: "Fine dust removed from floors, walls, vents, windows and fixtures after a renovation or drywall job, so the rooms are ready to live in.", from: "From $350", base: "special" },
    { id: "r-exterior", name: "Driveway, deck & exterior pressure washing", desc: "Pressure washing for driveways, walkways, patios, decks, siding and garage pads.", from: "From $180", base: "pressure" },
    { id: "r-high", name: "High ceilings & hard-to-reach dusting", desc: "Careful dusting of high ceilings, beams, fans, light fixtures and tall windows that are out of reach.", from: "From $150", base: "highdust" },
    { id: "r-garage", name: "Garage & basement floor cleaning", desc: "Machine scrubbing and surface cleaning for garage and basement floors, including concrete and sealed surfaces.", from: "From $160", base: "floors" },
    { id: "r-move", name: "Move-in & move-out deep cleaning", desc: "A top-to-bottom clean of an empty home before you move in or after you move out.", from: "From $300", base: null },
    { id: "r-seasonal", name: "Seasonal home maintenance", desc: "Scheduled spring and fall visits for exterior washing, high dusting and the jobs that are easy to put off.", from: "Custom quote", base: "contract" }
  ];

  /* PLACEHOLDER: sample testimonials. No real names. Each one shows a "Sample content" tag on the page. */
  B.sampleQuotes = []; /* v27: no real testimonials yet, so the block stays hidden */

  /* PLACEHOLDER: residential FAQ answers. */
  B.residentialFaq = [
    { q: "Do you work in houses and condos, not just commercial buildings?", a: "Yes. We take residential jobs in houses, townhomes and condos across the GTA, as well as commercial and industrial work." },
    { q: "Can you clean up after my renovation contractor finishes?", a: "Yes. Post-renovation and post-drywall cleanup is one of our most requested home services. Tell us when the trades finish and we will plan around it." },
    { q: "Do I need to be home during the job?", a: "Not always. For exterior work we only need access to water and the areas to be washed. For indoor work we agree access with you when we book." },
    { q: "How do I get a price for my home?", a: "Choose Residential on the quote form, or call or email us with your address, the work and your timing. Photos help us quote faster." }
  ];
})(window.BIZ);
