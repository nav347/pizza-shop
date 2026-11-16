/* ALL shop details live here. Edit this one file; every page updates.
   Required: name, tagline, address, phone, hours (string), menu, currency, formatPrice.
   Optional (used by the richer pages): hoursList, lat/lon, orderUrl, special, story, quotes, faq,
   item.tags (any of "vegetarian", "vegan", "gluten-free", "spicy"). Prices are numbers in CAD. */
window.SHOP = {
  name: "Dough Re Mi",
  tagline: "Wood-fired. Hand-stretched. Slightly dramatic.",
  address: "123 Queen St W, Toronto, ON M5H 2M9",
  phone: "+1 (416) 555-0123",
  lat: 43.6534,   // for the map (Toronto, near Queen St W)
  lon: -79.3841,
  orderUrl: "https://example.com/order",   // placeholder: put the real online-ordering link here
  currency: "$",
  formatPrice: function (n) { return this.currency + Number(n).toFixed(2); },
  // hours: one plain string (works with data-shop="hours"); hoursList is the same info split by line
  hours: "Mon-Thu 11:30 am - 10 pm | Fri-Sat 11:30 am - 12 am | Sun 12 pm - 9 pm",
  hoursList: [
    { d: "Mon - Thu", t: "11:30 am - 10:00 pm" },
    { d: "Fri - Sat", t: "11:30 am - 12:00 am" },
    { d: "Sunday",    t: "12:00 pm - 9:00 pm" }
  ],
  special: { name: "Maple Bacon Smash", desc: "This week only: back bacon, caramelized onion, aged cheddar, a drizzle of Ontario maple.", price: 24.99 },
  story: [
    "Dough Re Mi started with one stubborn idea: pizza dough deserves 48 hours of patience. We ferment it slowly, stretch it by hand and bake it in a wood-fired oven that hits 450 degrees.",
    "Every sauce is made in-house each morning from ripe tomatoes, and we buy our cheese and produce from Ontario farms whenever we can. Every pizza leaves the oven a little charred, a little dramatic, and completely worth the wait."
  ],
  quotes: [
    { q: "The crust alone is worth the trip. Crisp outside, soft inside.", by: "Emily R." },
    { q: "Best Margherita downtown, no argument allowed.", by: "Marcus T." },
    { q: "We ordered once and now it is a Friday night tradition.", by: "The Singh family" }
  ],
  faq: [
    { q: "Do you deliver?", a: "Yes, within 5 km, or order for pickup. Use the online order button or call us and we will confirm the time." },
    { q: "Do you have vegetarian and vegan options?", a: "Plenty. Look for the V and VG tags on the menu; we also have a vegan cheese on request." },
    { q: "Can I book a table?", a: "Walk-ins are welcome. For groups of six or more, call us." },
    { q: "Do you do gluten-free bases?", a: "Yes, a 10-inch gluten-free base is available on any pizza for $3 extra (shared oven, so not for celiacs)." }
  ],
  menu: [
    { category: "Pizzas", items: [
      { name: "Margherita", desc: "San Marzano tomato, fresh mozzarella, basil, olive oil", price: 16.99, tags: ["vegetarian"] },
      { name: "Pepperoni Blaze", desc: "Spicy pepperoni, chilli oil, hot honey, extra cheese", price: 21.99, tags: ["spicy"] },
      { name: "Wild Mushroom", desc: "Roasted mushrooms, garlic, thyme, fontina, truffle oil", price: 22.99, tags: ["vegetarian"] },
      { name: "Garden Vegan", desc: "Roasted peppers, zucchini, olives, cashew cheese, arugula", price: 21.99, tags: ["vegan", "vegetarian"] },
      { name: "Four Cheese", desc: "Mozzarella, cheddar, parmesan, gorgonzola", price: 23.99, tags: ["vegetarian"] },
      { name: "The Canuck", desc: "Back bacon, pepperoni, mushroom, green pepper, mozzarella", price: 25.99, tags: [] }
    ]},
    { category: "Sides", items: [
      { name: "Garlic Bread", desc: "Toasted, buttery, a little too much garlic", price: 8.99, tags: ["vegetarian"] },
      { name: "Poutine Fries", desc: "Crisp fries, squeaky cheese curds, rich gravy", price: 11.99, tags: [] },
      { name: "Caesar Salad", desc: "Romaine, parmesan, croutons, lemon dressing", price: 12.99, tags: [] }
    ]},
    { category: "Pasta", items: [
      { name: "Spicy Arrabbiata", desc: "Penne in fiery tomato and garlic sauce", price: 17.99, tags: ["vegan", "vegetarian", "spicy"] },
      { name: "Fettuccine Alfredo", desc: "Creamy parmesan, herbs, black pepper", price: 18.99, tags: ["vegetarian"] }
    ]},
    { category: "Drinks & Sweets", items: [
      { name: "House Lemonade", desc: "Fresh lemon, mint, not too sweet", price: 4.99, tags: ["vegan", "vegetarian", "gluten-free"] },
      { name: "Cold Brew", desc: "Thick, chilled, not shy", price: 5.49, tags: ["vegan", "vegetarian", "gluten-free"] },
      { name: "Tiramisu", desc: "Espresso-soaked sponge, mascarpone, cocoa", price: 9.99, tags: ["vegetarian"] },
      { name: "Nutella Pizza Slice", desc: "Warm dessert pizza, hazelnut, sea salt", price: 8.99, tags: ["vegetarian"] }
    ]}
  ]
};
