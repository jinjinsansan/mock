import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOTAL_RECORDS = 1900;

// 数字で始まる会社名プレフィックス（100個）
const numericPrefixes = [
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10",
  "11", "12", "24", "21", "22", "88", "99", "100", "101", "123",
  "247", "360", "365", "500", "777", "888", "999", "1000", "1st Class", "1st Choice",
  "1st Global", "1st Prime", "1st Rate", "1stEdge", "1stLine", "1stTier", "20/20", "21st Century",
  "24/7", "24Hour", "247Global", "2X", "3D", "3Sixty", "3X", "4Corners",
  "4Star", "4X", "5Star", "5X", "6Sigma", "7Seas", "7Star",
  "8Figure", "9to5", "A1", "AA", "AAA", "Alpha1", "Alpha7", "Alpha9",
  "Beta1", "Delta1", "First1", "First7", "First9", "Gamma1", "Number1", "One1",
  "Prime1", "Prime7", "Prime9", "Sigma1", "Top1", "Top10", "Top100", "Top7",
  "Top9", "Zeta1", "Zero1", "10x", "100x", "1stWorld", "20x", "24K",
  "24x", "2Point", "2x", "3Point", "3x", "40x", "4Point", "4x",
  "50x", "5Point", "5x", "60x", "6Point", "6x", "7Point", "7x",
  "80x", "8Point", "8x", "90x", "9Point", "9x", "A1Plus"
];

// A-Zのプレフィックス（1800個）
const prefixGroups = {
  A: ["Acadia", "Acorn", "Advance", "Aegis", "Aether", "Affinity", "Agile", "Albatross", "Alcazar", "Alder", "Allegiance", "Alliance", "Alpine", "Altair", "Altitude", "Amber", "Ambit", "Anchor", "Anthem", "Apex", "Apollo", "Aquila", "Arbor", "Arcade", "Arcadia", "Arch", "Arctic", "Ardent", "Argent", "Argo", "Argonaut", "Aria", "Ariel", "Armada", "Arsenal", "Arrow", "Ascend", "Ashford", "Aspect", "Aspen", "Asset", "Astral", "Astute", "Athena", "Atlantic", "Atlas", "Auburn", "Aurora", "Austere", "Autumn", "Avalon", "Avenue", "Avery", "Avian", "Axiom", "Azure", "Acumen", "Admiral", "Advent", "Affinity", "Agate", "Agora", "Alloy", "Almanac", "Alchemy", "Aldrin", "Almond", "Altus", "Amaranth", "Ambient"],
  B: ["Ballast", "Baltic", "Banyan", "Barley", "Baron", "Barrel", "Basalt", "Basin", "Bastion", "Bay", "Bayline", "Beacon", "Bearing", "Bedford", "Beech", "Bellwether", "Benchmark", "Benefit", "Berkeley", "Beryl", "Birch", "Blackstone", "Blade", "Blaze", "Bloom", "Blossom", "Blue", "Bluefin", "Blueprint", "Boreal", "Boulder", "Boundary", "Bow", "Bradford", "Branch", "Brass", "Brassline", "Breakwater", "Breeze", "Brentwood", "Bridge", "Bridgeport", "Bright", "Brightwater", "Brilliant", "Brimstone", "Briny", "Bristol", "Broadreach", "Bronze", "Brook", "Buckle", "Bulwark", "Burnish", "Butte", "Buttonwood", "Byline", "Banner", "Barton", "Bayview", "Beacon", "Bedford", "Belmont", "Berwick", "Birchwood", "Blackwood", "Bluewater", "Bolton", "Bradford"],
  C: ["Cabin", "Cable", "Cadence", "Cairn", "Caldera", "Caliber", "Calm", "Cambridge", "Camden", "Canopy", "Canyon", "Cape", "Capital", "Capricorn", "Capstan", "Captain", "Caravel", "Cardinal", "Carlton", "Carmine", "Cascade", "Castle", "Catalyst", "Cedar", "Celsius", "Centric", "Century", "Cerulean", "Chain", "Chamber", "Channel", "Chapel", "Charter", "Chase", "Chimney", "Choice", "Chronicle", "Circuit", "Citadel", "Clarity", "Classic", "Clayton", "Clearwater", "Cliffside", "Clipper", "Cloud", "Clover", "Cobalt", "Cobblestone", "Cognac", "Coin", "Coleman", "Column", "Comet", "Compass", "Concord", "Condor", "Confluence", "Conifer", "Constellation", "Continental", "Coral", "Cornerstone", "Corona", "Corridor", "Cortex", "Cove", "Covenant", "Crestline", "Crimson", "Crownhaven", "Crystal"],
  D: ["Dagger", "Dale", "Damson", "Dartmouth", "Dawn", "Daybreak", "Deckhand", "Deepwater", "Delta", "Deltawing", "Denver", "Depot", "Depth", "Derby", "Destiny", "Devon", "Diamond", "Diction", "Dimension", "Diplomat", "Discovery", "Dockside", "Domain", "Dominion", "Dorsal", "Dover", "Downwind", "Drake", "Driftwood", "Drumline", "Dublin", "Duke", "Dune", "Duneward", "Dunmore", "Dusk", "Dusty", "Dynasty", "Danube", "Darcy", "Darden", "Darren", "Davison", "Dayton", "Deacon", "Dealer", "Decatur", "Decorum", "Deed", "Delaney", "Delmar", "Delphi", "Denali", "Derby", "Devonshire", "Dewey", "Dexter", "Diagonal", "Dialogue", "Dickson", "Diesel", "Digby", "Dillon", "Diploma", "Director", "Dixon", "Dobson", "Doctrine", "Dolphin"],
  E: ["Eagle", "Earl", "Earnest", "Earth", "Easel", "Eastern", "Eastward", "Eaton", "Ebbtide", "Ebony", "Echo", "Eclipse", "Eden", "Edge", "Edgewater", "Edison", "Edmond", "Edmund", "Egremont", "Elder", "Elderwood", "Electra", "Elegant", "Element", "Elevation", "Elgin", "Elite", "Elliot", "Elm", "Elmstone", "Eloquent", "Elwood", "Emerald", "Emerson", "Empire", "Empower", "Enclave", "Encore", "Endeavor", "Endurance", "Energy", "Ensemble", "Envoy", "Epic", "Epoch", "Equator", "Equity", "Equinox", "Era", "Erie", "Ernest", "Escarpment", "Essence", "Estate", "Estuary", "Eternal", "Eton", "Eureka", "Evercrest", "Everest", "Evergreen", "Evolution", "Excel", "Exchange", "Exchequer", "Executive", "Exeter", "Exponent", "Express"],
  F: ["Fabric", "Facade", "Fairfax", "Fairfield", "Fairmont", "Fairview", "Fairway", "Fairwind", "Falcon", "Fallbrook", "Fargo", "Farmhouse", "Fashion", "Fathom", "Favor", "Fenwick", "Fern", "Ferry", "Fidelity", "Field", "Fielding", "Fifteen", "Figure", "Finch", "Finnegan", "Fir", "Firelight", "First", "Fiscal", "Fisher", "Flagship", "Flagstone", "Flare", "Fleet", "Fleetline", "Fletcher", "Flint", "Flintstone", "Flotilla", "Flourish", "Floyd", "Flux", "Flynn", "Focal", "Folio", "Foothill", "Forbes", "Forecast", "Foremost", "Foremast", "Foreshore", "Forest", "Forge", "Formation", "Formula", "Forrest", "Forsyth", "Fortress", "Fortune", "Forum", "Forward", "Foundation", "Foundry", "Fountain", "Fourth", "Franklin", "Fraser", "Freedom", "Freeman", "Fremont", "Frontier"],
  G: ["Gabriel", "Gale", "Galleon", "Gallery", "Gamma", "Garden", "Garfield", "Garnet", "Garrison", "Gateway", "Gatsby", "Gauge", "Gavin", "Gemini", "Gemstone", "Genesis", "Geneva", "Gentry", "Geoffrey", "George", "Gerald", "Gibson", "Gilbert", "Gilded", "Gillette", "Glacier", "Glade", "Gladstone", "Glasgow", "Gleason", "Glendale", "Glimmer", "Globe", "Glory", "Gloucester", "Golden", "Goldman", "Goldsmith", "Gordon", "Gorge", "Gothic", "Governor", "Grace", "Gradient", "Graham", "Grain", "Grand", "Grandview", "Granite", "Grant", "Grantham", "Graph", "Gravel", "Greywater", "Greenwich", "Greenleaf", "Grenadier", "Griffin", "Grover", "Grovewind", "Guardian", "Guidelight", "Guild", "Guildford", "Gulf", "Gulfstream", "Gunwale", "Guthrie", "Grayson"],
  H: ["Habitat", "Hail", "Hailwind", "Halifax", "Halton", "Hamilton", "Hammond", "Hampton", "Hancock", "Hanover", "Harbor", "Harbourview", "Harding", "Hardy", "Harley", "Harold", "Harper", "Harris", "Harrison", "Hartford", "Hartley", "Harvard", "Harvey", "Hastings", "Hatchet", "Hathaway", "Haven", "Hawk", "Hawkins", "Hawthorn", "Hayes", "Hayward", "Hazel", "Headland", "Hearthstone", "Heath", "Heather", "Heavyweight", "Hector", "Hedge", "Heights", "Heir", "Helena", "Helios", "Helm", "Hemlock", "Henderson", "Henry", "Herald", "Herbert", "Heritage", "Herman", "Heron", "Hickory", "Highmark", "Highland", "Highline", "Highway", "Hilbert", "Hilltop", "Hilton", "Hinton", "Hobart", "Holdfast", "Holland", "Holmes", "Homer", "Horizon", "Howard", "Hudson"],
  I: ["Ibis", "Icon", "Ideal", "Identity", "Ignite", "Illuminate", "Illumine", "Imagery", "Imagine", "Immense", "Impact", "Imperial", "Implement", "Impress", "Improve", "Impulse", "Incentive", "Inception", "Index", "Indicate", "Indigo", "Industry", "Infinite", "Infinity", "Influence", "Inform", "Ingot", "Inherit", "Initial", "Initiative", "Ink", "Inland", "Inlet", "Innovate", "Input", "Insight", "Inspire", "Install", "Instinct", "Institute", "Instrument", "Insure", "Integral", "Integrate", "Integrity", "Intellect", "Intent", "Interface", "Interim", "Interior", "Interval", "Interview", "Intrigue", "Intrinsic", "Intuition", "Invest", "Investor", "Invoice", "Involve", "Inward", "Iridium", "Iron", "Ironclad", "Irongate", "Ironside", "Irwin", "Isaac", "Isaiah", "Islandview", "Islet", "Isthmus", "Ivory"],
  J: ["Jackal", "Jackson", "Jacob", "Jade", "Jadeview", "Jaguar", "James", "Jameson", "January", "Jarvis", "Jasmine", "Jasper", "Javelin", "Jefferson", "Jeffrey", "Jenkins", "Jensen", "Jerome", "Jersey", "Jesse", "Jetstream", "Jetty", "Jewel", "Jibstay", "Johnson", "Johnston", "Jonathan", "Jones", "Jordan", "Joseph", "Journey", "Journeyman", "Joy", "Jubilant", "Judge", "Judgment", "Julian", "Julius", "Junction", "June", "Junior", "Juniper", "Jupiter", "Justice", "Justin", "Jasper", "Jackpot", "Jacquard", "Jade", "Jagger", "Jamboree", "Jane", "Janet", "Jarrett", "Jayson", "Jefferson", "Jeremy", "Jericho", "Jerry", "Jessup", "Jeweler", "Jillian", "Jocelyn", "Joel", "Johan", "Johnny", "Jolly", "Jonas", "Jonquil", "Josiah"],
  K: ["Kaiser", "Kale", "Kane", "Kansas", "Kaplan", "Kappa", "Karat", "Karen", "Karl", "Karsten", "Kate", "Katherine", "Katie", "Kaufman", "Kay", "Keaton", "Keegan", "Keeler", "Keen", "Keeper", "Keith", "Keller", "Kelley", "Kelly", "Kelp", "Kelpline", "Kelsey", "Kelvin", "Kendall", "Kennedy", "Kenneth", "Kensington", "Kent", "Kenton", "Kenya", "Kerr", "Kestrel", "Kevin", "Keylight", "Keystone", "Kiley", "Kilpatrick", "Kimball", "Kimber", "Kimberly", "Kinetica", "Kindred", "Kingfisher", "Kingsguard", "Kingston", "Kinney", "Kinsley", "Kipling", "Kirby", "Kirk", "Kirkland", "Kirsten", "Kit", "Kite", "Kline", "Knight", "Knoll", "Knotsail", "Knox", "Knowles", "Knox", "Knotwood", "Keelstone", "Keyworth"],
  L: ["Label", "Labor", "Lace", "Ladder", "Lagoon", "Lake", "Lambert", "Lancaster", "Lancer", "Landfall", "Landmark", "Lane", "Langley", "Lantern", "Lanyard", "Larch", "Larkin", "Larry", "Laser", "Lassen", "Latch", "Latitude", "Lauder", "Launch", "Laurel", "Lavender", "Lawrence", "Lawson", "Layer", "Layout", "Leader", "League", "Leander", "Leather", "Ledger", "Lee", "Leeward", "Legacy", "Legal", "Legend", "Legion", "Leicester", "Leighton", "Leland", "Lemmon", "Lemon", "Leonard", "Leopold", "Leslie", "Lester", "Letter", "Level", "Lever", "Leverage", "Levine", "Lewis", "Lexington", "Liberty", "Library", "License", "Lido", "Lighthouse", "Lightning", "Linden", "Lindsay", "Linear", "Linen", "Lionel", "Liston", "Livingston", "Lloyd", "Loamcrest", "Lockhaven", "Lodestar", "Logan"],
  M: ["Mackenzie", "Madison", "Maestro", "Magazine", "Magenta", "Magnet", "Magnolia", "Magnus", "Mahogany", "Maiden", "Mainstay", "Mainland", "Majesty", "Major", "Malcolm", "Malibu", "Mallard", "Malone", "Maltese", "Manchester", "Mandate", "Manhattan", "Manifest", "Manning", "Manor", "Mansion", "Mantle", "Maple", "Marble", "Marcus", "Margate", "Margin", "Marigold", "Marina", "Mariner", "Maritime", "Market", "Markham", "Marlborough", "Marlin", "Marlow", "Marquee", "Marquis", "Mars", "Marshal", "Marshall", "Martha", "Martin", "Marvel", "Mason", "Master", "Matrix", "Matthew", "Maurice", "Maverick", "Maxim", "Maximum", "Maxwell", "Mayfair", "Maynard", "Mayor", "Meadow", "Measure", "Mecca", "Medal", "Medford", "Median", "Medina", "Medium", "Melrose", "Melville", "Memoir", "Memorial", "Memphis", "Menlo", "Mentor", "Merchant", "Mercury", "Meridian", "Merit", "Merlin", "Merrill", "Merritt", "Mesa", "Messina", "Metal", "Meteor", "Method", "Metro", "Meyer", "Michael", "Middleton", "Midland", "Midnight", "Midtown", "Midwatch", "Midway", "Milan", "Mildred", "Milestone", "Military", "Miller", "Millstone", "Milton", "Mineral", "Minimum", "Ministry", "Minor", "Minstrel", "Mint", "Minute", "Miracle", "Mirror", "Mission", "Mistral", "Mitchell", "Mobile", "Model", "Modern", "Modest", "Modular", "Momentum", "Monarch", "Monastery", "Monday", "Monetary", "Monitor", "Monkey", "Monroe", "Monsoon", "Montana", "Montclair", "Monte", "Monterey", "Montgomery", "Monument", "Moorland", "Moral", "Morgan", "Morning", "Morris", "Morrison", "Morse", "Morton", "Mosaic", "Moscow", "Moses", "Moss", "Motion", "Motive", "Motor", "Motto", "Mountain", "Mountaintop", "Mozart", "Mulberry", "Multiple", "Munich", "Murray", "Museum", "Music", "Mustang", "Mutual", "Mystery"],
  N: ["Nail", "Napier", "Naples", "Napoleon", "Narrow", "Nash", "Nathan", "National", "Native", "Natural", "Nature", "Nautical", "Nautilus", "Naval", "Navigate", "Navigator", "Navy", "Neal", "Nebraska", "Nebula", "Nectar", "Needle", "Nelson", "Neptune", "Nestor", "Network", "Nevada", "Nevins", "Newark", "Newbrook", "Newcastle", "Newhaven", "Newman", "Newport", "Newton", "Niagara", "Nicholas", "Nicholson", "Night", "Nightingale", "Nightwatch", "Nimbus", "Nina", "Noble", "Nobleline", "Nolan", "Nomad", "Noon", "Norcrest", "Nordic", "Norfolk", "Norman", "North", "Northampton", "Northeast", "Northern", "Northgate", "Northland", "Northstar", "Northwest", "Northwind", "Norton", "Norwich", "Notebook", "Notice", "Notion", "Nova", "Novel", "November", "Novice", "Nucleus", "Number", "Numeric", "Nurture"],
  O: ["Oak", "Oakdale", "Oakland", "Oakley", "Oakridge", "Oasis", "Oath", "Obelisk", "Object", "Obscure", "Observe", "Obsidian", "Obtain", "Obvious", "Occasion", "Occupy", "Ocean", "Oceanic", "October", "Octopus", "Odessa", "Odyssey", "Offer", "Office", "Officer", "Offshore", "Ogden", "Ohio", "Oilfield", "Oklahoma", "Olaf", "Oldham", "Oleander", "Olive", "Oliver", "Olympia", "Olympic", "Olympus", "Omega", "Omen", "Omni", "Onboard", "Onward", "Opal", "Opaline", "Open", "Opening", "Opera", "Operate", "Opinion", "Opportunity", "Opposite", "Optimal", "Option", "Opulence", "Oracle", "Orange", "Oratory", "Orbit", "Orchard", "Orchestra", "Order", "Ordinary", "Oregon", "Organic", "Orient", "Oriental", "Origin", "Original", "Orion", "Orlando", "Ornament", "Orpheus", "Orson", "Orville", "Oscar", "Oslo", "Osprey", "Oswald", "Otis", "Ottawa", "Otter", "Outback", "Outbound", "Outcome", "Outdoor", "Outer", "Outfit", "Outlet", "Outline", "Outlook", "Output", "Outreach", "Outrigger", "Outside", "Oval", "Ovation", "Oven", "Overture", "Owen", "Oxford", "Oxide", "Oxygen", "Oyster", "Ozark"],
  P: ["Pace", "Pacesetter", "Pacific", "Package", "Packard", "Pact", "Paddle", "Padlock", "Page", "Pageant", "Painted", "Palace", "Paladin", "Palette", "Palm", "Palmer", "Palo", "Panama", "Panel", "Panorama", "Panther", "Paper", "Parachute", "Parade", "Paradise", "Paragon", "Parallel", "Paramount", "Parcel", "Paris", "Parish", "Parker", "Parkland", "Parkside", "Parliament", "Parsley", "Parson", "Partner", "Passage", "Passenger", "Passion", "Passport", "Password", "Pastel", "Pastoral", "Pasture", "Patent", "Path", "Pathway", "Patience", "Patrick", "Patriot", "Patrol", "Patron", "Pattern", "Paul", "Pavilion", "Pawn", "Paxton", "Payment", "Payne", "Peace", "Peacock", "Peak", "Pearl", "Pearson", "Pebble", "Pedigree", "Pedro", "Peer", "Pegasus", "Pelican", "Pemberton", "Pembroke", "Pencil", "Pendant", "Pendleton", "Pendulum", "Peninsula", "Penn", "Pennant", "Penny", "Pension", "Pentagon", "Penthouse", "People", "Pepper", "Percent", "Perception", "Perch", "Perfect", "Perform", "Perfume", "Peregrine", "Peril", "Perimeter", "Period", "Permit", "Perry", "Perseus", "Persist", "Person", "Perspective", "Perth", "Peru", "Peter", "Peterson", "Petra", "Petroleum", "Phantom", "Phase", "Pheasant", "Phenomenon", "Philip", "Phillips", "Philosophy", "Phoenix", "Phone", "Photo", "Phrase", "Piano", "Picasso", "Pickering", "Pickup", "Picture", "Pierce", "Pierline", "Pierre", "Pigeon", "Pike", "Pilgrim", "Pillar", "Pilot", "Pine", "Pinecrest", "Pink", "Pinnacle", "Pioneer", "Piper", "Pipeline", "Pirate", "Pitch", "Pivot", "Pixel", "Pizza", "Place", "Placement", "Plain", "Plaintiff", "Planet", "Plank", "Planning", "Plant", "Plantation", "Planter", "Plasma", "Plastic", "Plate", "Plateau", "Platform", "Platinum", "Plato", "Plaza", "Pleasant", "Pledge", "Plenty", "Plot", "Plow", "Plum", "Plume", "Plural", "Plymouth", "Pocket", "Poem", "Poet", "Poetry", "Point", "Pointer", "Poison", "Poker", "Poland", "Polar", "Polaris", "Policy", "Polish", "Political", "Polk", "Pollock", "Polo", "Pomegranate", "Pomp", "Pond", "Ponder", "Pontiac", "Pool", "Pope", "Poplar", "Popular", "Porcelain", "Porch", "Porcupine", "Port", "Portal", "Porter", "Portfolio", "Portion", "Portland", "Portrait", "Portside", "Portugal", "Position", "Positive", "Possess", "Possible", "Postal", "Postcard", "Poster", "Postman", "Potential", "Potter", "Pottery", "Poultry", "Pound", "Powell", "Power", "Practical", "Practice", "Prairie", "Praise", "Praesidium", "Prayer", "Precinct", "Precious", "Precise", "Predict", "Prefer", "Prefix", "Premium", "Prepare", "Prescott", "Presence", "Present", "Preserve", "President", "Preston", "Prestige", "Pretext", "Pretty", "Prevail", "Prevent", "Preview", "Previous", "Price", "Pride", "Priest", "Prime", "Primrose", "Prince", "Princeton", "Principal", "Principle", "Print", "Prior", "Priority", "Prism", "Prison", "Private", "Prize", "Probable", "Problem", "Procedure", "Proceed", "Process", "Procure", "Produce", "Product", "Profession", "Professor", "Profile", "Profit", "Program", "Progress", "Project", "Promise", "Promote", "Prompt", "Proof", "Proper", "Property", "Prophet", "Proportion", "Proposal", "Propose", "Prospect", "Prosper", "Protect", "Protein", "Protest", "Protocol", "Proud", "Proverb", "Provide", "Province", "Provision", "Provoke", "Prowess", "Proxy", "Prudent", "Prune", "Public", "Publish", "Pudding", "Pueblo", "Puerto", "Pulse", "Puma", "Pump", "Pumpkin", "Punch", "Punctual", "Purchase", "Pure", "Purple", "Purpose", "Pursue", "Push", "Puzzle", "Pyramid"],
  Q: ["Quail", "Quaint", "Quake", "Qualification", "Quality", "Quantity", "Quantum", "Quarantine", "Quark", "Quarry", "Quarryview", "Quart", "Quarter", "Quarterdeck", "Quartet", "Quartz", "Quasar", "Quasi", "Quayside", "Quaysail", "Quebec", "Queen", "Queensland", "Quest", "Questline", "Question", "Queue", "Quick", "Quicksilver", "Quiet", "Quietwater", "Quill", "Quillon", "Quillstone", "Quilt", "Quincy", "Quinn", "Quint", "Quintet", "Quintessence", "Quirk", "Quit", "Quite", "Quiver", "Quiz", "Quorum", "Quota", "Quotation", "Quote", "Quotient"],
  R: ["Rabbit", "Raccoon", "Rachel", "Radar", "Radiance", "Radiant", "Radio", "Radium", "Radius", "Rafael", "Raft", "Rage", "Raid", "Rail", "Railroad", "Railway", "Rain", "Rainbow", "Rainforest", "Rainmaker", "Raleigh", "Rally", "Ralph", "Rambler", "Rampart", "Ramsey", "Ranch", "Randall", "Randolph", "Random", "Range", "Ranger", "Rank", "Ransom", "Rapid", "Rapids", "Rapport", "Rare", "Rascal", "Raven", "Ravenshore", "Ravine", "Raymond", "Razor", "Reach", "Reader", "Reading", "Reagan", "Realm", "Realty", "Reason", "Rebel", "Rebirth", "Recall", "Receipt", "Receive", "Recent", "Recipe", "Recital", "Reckless", "Reclaim", "Recognize", "Recon", "Record", "Recover", "Recruit", "Rectangle", "Rector", "Recycle", "Redeem", "Redford", "Redmond", "Redoubt", "Redstone", "Redwood", "Reed", "Reef", "Reel", "Reference", "Refine", "Reflect", "Reform", "Refresh", "Refuge", "Refund", "Regal", "Regatta", "Regent", "Regina", "Region", "Register", "Regret", "Regular", "Reign", "Reinforce", "Reject", "Relate", "Relay", "Release", "Relevant", "Reliable", "Reliance", "Relief", "Religion", "Relish", "Rely", "Remain", "Remark", "Remedy", "Remember", "Remind", "Remote", "Remove", "Render", "Renew", "Renovate", "Rental", "Repair", "Repeal", "Repeat", "Replace", "Reply", "Report", "Repose", "Represent", "Republic", "Repute", "Request", "Require", "Rescue", "Research", "Resemble", "Reserve", "Reside", "Residue", "Resign", "Resin", "Resist", "Resolute", "Resolve", "Resonance", "Resort", "Resource", "Respect", "Respond", "Response", "Restore", "Restrain", "Result", "Resume", "Retail", "Retain", "Retire", "Retreat", "Return", "Reunion", "Reveal", "Revenue", "Revere", "Reverse", "Review", "Revise", "Revival", "Revive", "Revolt", "Revolve", "Reward", "Rex", "Rhapsody", "Rhine", "Rhino", "Rhode", "Rhodes", "Rhyme", "Rhythm", "Ribbon", "Ricardo", "Rice", "Richard", "Richards", "Richardson", "Richmond", "Richter", "Rick", "Rickman", "Riddle", "Ridge", "Ridgeway", "Ridley", "Rifle", "Right", "Rigid", "Riley", "Rim", "Ring", "Ringo", "Rinse", "Rio", "Ripley", "Ripple", "Rise", "Rising", "Risk", "Ritual", "Rival", "River", "Riverstone", "Riviera", "Road", "Roadway", "Roanoke", "Roast", "Rob", "Robbie", "Robbins", "Robert", "Roberts", "Robertson", "Robin", "Robinson", "Robot", "Robust", "Rochester", "Rock", "Rockfall", "Rocket", "Rockford", "Rockwell", "Rocky", "Rod", "Rodeo", "Roderick", "Rodney", "Roger", "Rogers", "Roland", "Role", "Roll", "Roller", "Roman", "Romance", "Romano", "Rome", "Romeo", "Ronald", "Roof", "Rookie", "Room", "Rooster", "Root", "Rope", "Rosa", "Rosario", "Rose", "Rosemont", "Rosewood", "Ross", "Roster", "Rostrum", "Rotate", "Rotor", "Rouge", "Rough", "Round", "Roundtable", "Route", "Routine", "Rover", "Rowan", "Rowland", "Royal", "Royale", "Royalty", "Ruben", "Ruby", "Rudder", "Rudolph", "Rudy", "Ruffle", "Rugby", "Rugged", "Ruin", "Rule", "Ruler", "Rumble", "Rumor", "Runaway", "Runewood", "Runner", "Rural", "Rush", "Russ", "Russell", "Russia", "Rustic", "Rusty", "Ruth", "Rutherford", "Ryder", "Rye"],
  S: ["Saber", "Sable", "Sabrina", "Sacred", "Saddle", "Safari", "Safe", "Safety", "Saga", "Sage", "Sahara", "Sail", "Sailor", "Saint", "Sake", "Salem", "Salesman", "Salina", "Salmon", "Salon", "Salt", "Salvador", "Salvage", "Salvation", "Sam", "Samantha", "Samson", "Samuel", "San", "Sanchez", "Sanctuary", "Sand", "Sandal", "Sanders", "Sanderson", "Sandpiper", "Sandstone", "Sandy", "Sanford", "Santa", "Santiago", "Sapphire", "Sara", "Sarah", "Saratoga", "Sargent", "Satellite", "Satin", "Saturn", "Sauce", "Saul", "Saunders", "Savage", "Savanna", "Savannah", "Save", "Savings", "Savior", "Savoy", "Sawyer", "Saxon", "Saxophone", "Saybrook", "Scale", "Scan", "Scandal", "Scarborough", "Scarecrow", "Scarlet", "Scenario", "Scene", "Scenic", "Scent", "Schedule", "Scheme", "Scholar", "School", "Schooner", "Science", "Scissors", "Scope", "Score", "Scorpio", "Scotia", "Scotland", "Scott", "Scottish", "Scout", "Screen", "Screenplay", "Scribe", "Script", "Scroll", "Sculptor", "Sculpture", "Sea", "Seaboard", "Seabright", "Seacliff", "Seafarer", "Seagull", "Seal", "Seam", "Search", "Seashore", "Season", "Seat", "Seattle", "Sebastian", "Second", "Secret", "Secretary", "Section", "Sector", "Secure", "Security", "Sedan", "Sediment", "See", "Seed", "Seeker", "Segment", "Seize", "Selby", "Select", "Selection", "Selective", "Self", "Sell", "Seller", "Selma", "Semester", "Semi", "Seminar", "Senate", "Senator", "Send", "Senior", "Sensation", "Sense", "Sensible", "Sensitive", "Sensor", "Sentence", "Sentiment", "Sentinel", "Separate", "September", "Sequence", "Sequoia", "Serene", "Sergeant", "Serial", "Series", "Serious", "Sermon", "Serpent", "Servant", "Serve", "Server", "Service", "Session", "Seth", "Setting", "Settle", "Settlement", "Settler", "Seven", "Seventh", "Seventy", "Seville", "Seymour", "Shade", "Shadow", "Shaft", "Shake", "Shakespeare", "Shale", "Shallow", "Shane", "Shanghai", "Shannon", "Shape", "Shard", "Share", "Shareholder", "Shark", "Sharon", "Sharp", "Sharpe", "Shatter", "Shaw", "Shawn", "Shear", "Shed", "Sheen", "Sheep", "Sheer", "Sheet", "Sheffield", "Sheila", "Shelby", "Sheldon", "Shell", "Shelter", "Shelton", "Shepard", "Shepherd", "Sheridan", "Sheriff", "Sherman", "Sherwood", "Shield", "Shift", "Shine", "Ship", "Shipyard", "Shire", "Shirt", "Shock", "Shoe", "Shoot", "Shore", "Short", "Shoulder", "Shovel", "Show", "Showcase", "Shower", "Shrine", "Shrub", "Shuttle", "Sibling", "Sicily", "Side", "Sidney", "Sienna", "Sierra", "Sieve", "Sight", "Sigma", "Sign", "Signal", "Signature", "Significance", "Silence", "Silent", "Silhouette", "Silicon", "Silk", "Silly", "Silo", "Silver", "Silverline", "Silverton", "Similar", "Simmons", "Simon", "Simple", "Simpson", "Simulate", "Sincere", "Sinclair", "Sing", "Singapore", "Singer", "Single", "Singular", "Sinister", "Sink", "Siren", "Sister", "Site", "Situation", "Six", "Sixteen", "Sixth", "Sixty", "Size", "Skate", "Sketch", "Skill", "Skin", "Skip", "Skipper", "Skirt", "Sky", "Skyline", "Skyscraper", "Slate", "Slater", "Slaughter", "Slave", "Sleek", "Sleep", "Sleeve", "Slender", "Slice", "Slide", "Slight", "Slim", "Slip", "Slogan", "Slope", "Slot", "Slow", "Small", "Smart", "Smash", "Smell", "Smile", "Smith", "Smithfield", "Smoke", "Smooth", "Snake", "Snap", "Snapshot", "Snow", "Snowflake", "Snyder", "Soap", "Soar", "Sober", "Soccer", "Social", "Society", "Socket", "Socrates", "Soda", "Sodium", "Sofa", "Soft", "Software", "Soil", "Solar", "Soldier", "Sole", "Solemn", "Solid", "Solitary", "Solo", "Solomon", "Solution", "Solve", "Somerset", "Somers", "Something", "Somewhere", "Son", "Sonar", "Song", "Sonic", "Sonnet", "Sons", "Soon", "Soot", "Sophia", "Sophie", "Sophomore", "Soprano", "Sorrel", "Sort", "Soul", "Sound", "Soup", "Source", "South", "Southampton", "Southeast", "Southern", "Southgate", "Southland", "Southport", "Southwest", "Souvenir", "Sovereign", "Soviet", "Sow", "Space", "Spade", "Spain", "Span", "Spangle", "Spanish", "Spare", "Spark", "Sparkle", "Sparrow", "Sparta", "Spatial", "Speak", "Speaker", "Spear", "Special", "Specialist", "Species", "Specific", "Specimen", "Spectacle", "Spectacular", "Spectator", "Specter", "Spectrum", "Speech", "Speed", "Spell", "Spence", "Spencer", "Spend", "Sphere", "Sphinx", "Spice", "Spider", "Spike", "Spin", "Spindrift", "Spine", "Spiral", "Spirit", "Spiritual", "Splash", "Splendid", "Split", "Spokesman", "Sponsor", "Spontaneous", "Spool", "Spoon", "Sport", "Spot", "Spotlight", "Spouse", "Spray", "Spread", "Spring", "Springfield", "Springtide", "Sprint", "Spruce", "Spur", "Squad", "Squadron", "Square", "Squire", "Stable", "Stack", "Stadium", "Staff", "Stage", "Stain", "Stair", "Stairway", "Stake", "Stakeholder", "Stale", "Stalk", "Stallion", "Stamford", "Stamp", "Stan", "Stand", "Standard", "Standing", "Stanford", "Stanley", "Stanton", "Staple", "Star", "Starboard", "Starburst", "Starch", "Starfish", "Stark", "Starlight", "Starling", "Starr", "Start", "Startup", "State", "Statement", "Staten", "Static", "Station", "Stationary", "Statue", "Stature", "Status", "Statute", "Stay", "Steady", "Steak", "Steal", "Steam", "Steele", "Steep", "Steer", "Steering", "Stefan", "Stein", "Stella", "Stellar", "Stem", "Step", "Stephanie", "Stephen", "Stephens", "Stephenson", "Stereo", "Sterling", "Stern", "Steve", "Steven", "Stevens", "Stevenson", "Steward", "Stewart", "Stick", "Still", "Stillwater", "Stimulate", "Sting", "Stir", "Stitch", "Stock", "Stockbridge", "Stockton", "Stoic", "Stoke", "Stone", "Stonegate", "Stonewall", "Stony", "Stop", "Storage", "Store", "Storey", "Storm", "Stormline", "Story", "Stout", "Stove", "Straight", "Strain", "Strait", "Strand", "Strange", "Stranger", "Strap", "Strategic", "Strategy", "Stratford", "Straw", "Strawberry", "Stream", "Street", "Strength", "Stress", "Stretch", "Strict", "Stride", "Strike", "String", "Strip", "Stripe", "Strive", "Stroke", "Stroll", "Strong", "Stronghold", "Structure", "Struggle", "Stuart", "Stubborn", "Stucco", "Student", "Studio", "Study", "Stuff", "Stumble", "Stump", "Stun", "Stunning", "Stunt", "Stupid", "Sturdy", "Style", "Stylish", "Subject", "Sublime", "Submarine", "Submit", "Subscribe", "Subsequent", "Subsidiary", "Subsidy", "Substance", "Substitute", "Subtle", "Subtract", "Suburb", "Subway", "Succeed", "Success", "Successful", "Succession", "Successive", "Successor", "Such", "Sudden", "Sue", "Suffer", "Sufficient", "Suffix", "Sugar", "Suggest", "Suggestion", "Suit", "Suitable", "Suitcase", "Suite", "Sullivan", "Sultan", "Sum", "Summary", "Summer", "Summit", "Summon", "Sun", "Sunbeam", "Sunday", "Sundial", "Sundown", "Sunflower", "Sunlight", "Sunny", "Sunrise", "Sunset", "Sunshine", "Sunstone", "Super", "Superb", "Superior", "Superlative", "Superman", "Supermarket", "Supernatural", "Supervise", "Supervisor", "Supper", "Supplement", "Supplier", "Supply", "Support", "Suppose", "Supreme", "Sure", "Surface", "Surge", "Surgeon", "Surgery", "Surname", "Surplus", "Surprise", "Surrender", "Surrey", "Surround", "Survey", "Survival", "Survive", "Survivor", "Susan", "Suspect", "Suspend", "Suspense", "Suspension", "Sussex", "Sustain", "Sutherland", "Sutton", "Swallow", "Swamp", "Swan", "Swap", "Swarm", "Sway", "Swear", "Sweat", "Sweater", "Sweden", "Sweep", "Sweet", "Sweetwater", "Swell", "Swift", "Swim", "Swimmer", "Swimming", "Swindle", "Swing", "Swirl", "Swiss", "Switch", "Switzerland", "Sword", "Swordfish", "Sydney", "Sylvan", "Sylvester", "Sylvia", "Symbol", "Symmetric", "Symmetry", "Sympathy", "Symphony", "Symptom", "Synagogue", "Synchronize", "Syndicate", "Syndrome", "Synergy", "Synonym", "Synopsis", "Syntax", "Synthesis", "Synthetic", "Syracuse", "Syria", "Syringe", "Syrup", "System", "Systematic"],
  T: ["Table", "Tablet", "Tackle", "Tactic", "Tactical", "Tactile", "Taft", "Tag", "Tail", "Tailor", "Taint", "Taiwan", "Take", "Takeover", "Tale", "Talent", "Talisman", "Talk", "Tall", "Tallow", "Tally", "Talon", "Tambourine", "Tame", "Tampa", "Tan", "Tandem", "Tangent", "Tangle", "Tango", "Tank", "Tanner", "Tap", "Tape", "Tapestry", "Tar", "Target", "Tariff", "Tarnish", "Tarp", "Tartan", "Task", "Tasman", "Taste", "Tate", "Tattoo", "Taught", "Taurus", "Tavern", "Tavernier", "Tax", "Taxi", "Taylor", "Tea", "Teach", "Teacher", "Teak", "Team", "Teamwork", "Tear", "Tease", "Technical", "Technique", "Technology", "Teddy", "Teen", "Teenager", "Teeth", "Telegram", "Telegraph", "Telephone", "Telescope", "Television", "Tell", "Teller", "Temper", "Temperature", "Tempest", "Temple", "Tempo", "Temporal", "Temporary", "Tempt", "Ten", "Tenant", "Tend", "Tender", "Tendon", "Tennessee", "Tennis", "Tenor", "Tense", "Tension", "Tent", "Tentacle", "Tenth", "Tenure", "Term", "Terminal", "Terminate", "Terrace", "Terrain", "Terrible", "Terrier", "Terrific", "Territory", "Terror", "Terry", "Test", "Testament", "Testimony", "Texas", "Text", "Textbook", "Textile", "Texture", "Thames", "Thank", "Thanksgiving", "That", "Thatcher", "Thaw", "Theater", "Theatre", "Theft", "Their", "Them", "Theme", "Themselves", "Then", "Theology", "Theorem", "Theory", "Therapy", "There", "Thereafter", "Thereby", "Therefore", "Thermal", "Thermometer", "Thermos", "These", "Thesis", "Theta", "They", "Thick", "Thief", "Thigh", "Thin", "Thing", "Think", "Thinker", "Third", "Thirst", "Thirteen", "Thirty", "This", "Thistledown", "Thomas", "Thompson", "Thomson", "Thorn", "Thornton", "Thorough", "Thoroughfare", "Those", "Though", "Thought", "Thoughtful", "Thousand", "Thread", "Threat", "Three", "Threshold", "Thrift", "Thrill", "Thrive", "Throat", "Throne", "Through", "Throughout", "Throw", "Thrust", "Thumb", "Thunder", "Thunderbird", "Thursday", "Thus", "Thyme", "Tiara", "Tibet", "Ticket", "Tidal", "Tide", "Tidewater", "Tidy", "Tie", "Tier", "Tiger", "Tight", "Tile", "Till", "Tiller", "Tilt", "Tim", "Timber", "Timberland", "Timberline", "Time", "Timeless", "Timeline", "Timeout", "Timer", "Times", "Timetable", "Timid", "Timothy", "Tin", "Tina", "Tinder", "Tine", "Tinge", "Tinker", "Tint", "Tiny", "Tip", "Tiptoe", "Tire", "Tissue", "Titan", "Titanic", "Title", "Titus", "Toad", "Toast", "Tobacco", "Tobias", "Toby", "Today", "Todd", "Toe", "Toffee", "Together", "Toggle", "Toil", "Toilet", "Token", "Tokyo", "Toledo", "Tolerance", "Tolerate", "Toll", "Tollgate", "Tom", "Tomato", "Tomb", "Tombstone", "Tommy", "Tomorrow", "Ton", "Tone", "Tonga", "Tongue", "Tonight", "Tony", "Tool", "Toolkit", "Tooth", "Top", "Topaz", "Topic", "Topmast", "Topography", "Torch", "Torino", "Tornado", "Toronto", "Torpedo", "Torque", "Torrent", "Tortoise", "Torture", "Toss", "Total", "Totem", "Touch", "Touchdown", "Tough", "Tour", "Tourism", "Tourist", "Tournament", "Tow", "Toward", "Towards", "Towel", "Tower", "Town", "Township", "Townsend", "Toxic", "Toy", "Trace", "Track", "Tracker", "Tract", "Tractor", "Tracy", "Trade", "Trademark", "Trader", "Tradewind", "Trading", "Tradition", "Traditional", "Traffic", "Tragedy", "Tragic", "Trail", "Trailhead", "Trailer", "Train", "Trainer", "Training", "Trait", "Traitor", "Trajectory", "Tram", "Tramp", "Trampoline", "Trance", "Tranquil", "Transaction", "Transcend", "Transcript", "Transfer", "Transform", "Transit", "Transition", "Translate", "Translation", "Transmission", "Transmit", "Transparent", "Transport", "Trap", "Trapeze", "Trash", "Trauma", "Travel", "Traveler", "Traverse", "Travis", "Tray", "Tread", "Treason", "Treasure", "Treasurer", "Treasury", "Treat", "Treatment", "Treaty", "Tree", "Trek", "Tremble", "Tremendous", "Tremor", "Trench", "Trend", "Trent", "Trenton", "Trespass", "Trevor", "Trial", "Triangle", "Tribal", "Tribe", "Tribunal", "Tribune", "Tributary", "Tribute", "Trick", "Trident", "Tried", "Trigger", "Trilogy", "Trim", "Trinidad", "Trinity", "Trinket", "Trio", "Trip", "Triple", "Tripod", "Tristan", "Triumph", "Trivia", "Trivial", "Trolley", "Trombone", "Troop", "Trooper", "Trophy", "Tropic", "Tropical", "Tropics", "Trot", "Trouble", "Trough", "Trousers", "Trout", "Trowel", "Troy", "Truce", "Truck", "Trudge", "True", "Truffle", "Truly", "Truman", "Trumpet", "Trunk", "Trust", "Trustee", "Truth", "Try", "Tsar", "Tsunami", "Tub", "Tuba", "Tube", "Tucker", "Tudor", "Tuesday", "Tuft", "Tug", "Tugboat", "Tuition", "Tulip", "Tumble", "Tuna", "Tundra", "Tune", "Tunic", "Tunnel", "Turbo", "Turf", "Turin", "Turkey", "Turkish", "Turmoil", "Turn", "Turner", "Turning", "Turnip", "Turnover", "Turnpike", "Turquoise", "Turret", "Turtle", "Tuscan", "Tuscany", "Tusk", "Tussle", "Tutor", "Tutorial", "Tuxedo", "Tweed", "Twelfth", "Twelve", "Twentieth", "Twenty", "Twice", "Twig", "Twilight", "Twin", "Twine", "Twinkle", "Twins", "Twist", "Two", "Tyler", "Type", "Typewriter", "Typical", "Typist", "Typography", "Tyrant", "Tyson"],
  U: ["Ubiquitous", "Ugly", "Ukraine", "Ulrich", "Ultimate", "Ultimatum", "Ultra", "Ultramarine", "Ulysses", "Umber", "Umbrella", "Umpire", "Unable", "Unaware", "Unbiased", "Uncertain", "Uncle", "Uncommon", "Unconscious", "Uncover", "Under", "Underdog", "Undergo", "Underground", "Underleaf", "Underline", "Underlying", "Underneath", "Underscore", "Understand", "Undertake", "Undertaking", "Undertow", "Underwater", "Underway", "Underwood", "Underwrite", "Undo", "Undoubtedly", "Undulate", "Uneasy", "Unemployed", "Unequal", "Uneven", "Unexpected", "Unfair", "Unfold", "Unfortunate", "Unfriendly", "Unhappy", "Unicorn", "Uniform", "Unify", "Unilateral", "Unimportant", "Union", "Unique", "Unit", "Unitard", "Unite", "United", "Unity", "Universal", "Universe", "University", "Unjust", "Unknown", "Unleash", "Unless", "Unlike", "Unlikely", "Unlimited", "Unlock", "Unlucky", "Unmatched", "Unmistakable", "Unnecessary", "Unpack", "Unpleasant", "Unprecedented", "Unpredictable", "Unreal", "Unreasonable", "Unrest", "Unrivaled", "Unsafe", "Unseen", "Unstable", "Unsuccessful", "Unsuitable", "Unsure", "Until", "Untold", "Untouched", "Unusual", "Unveil", "Unwilling", "Unwind", "Unwrap", "Unwritten", "Upbeat", "Update", "Upgrade", "Upheaval", "Uphill", "Uphold", "Upland", "Uplift", "Upload", "Upon", "Upper", "Uppercase", "Upperwind", "Upright", "Uprising", "Uproar", "Upset", "Upside", "Upstairs", "Upstart", "Upstream", "Uptown", "Upturn", "Upward", "Upwards", "Upwind", "Uranium", "Urban", "Urbanite", "Urchin", "Urge", "Urgent", "Uriah", "Ursa", "Uruguay", "Usage", "Use", "Used", "Useful", "Useless", "User", "Usher", "Usual", "Usually", "Utah", "Utensil", "Utility", "Utilize", "Utmost", "Utopia", "Utter", "Utterly"],
  V: ["Vacancy", "Vacant", "Vacation", "Vaccine", "Vacuum", "Vague", "Vain", "Vale", "Valencia", "Valentine", "Valerie", "Valet", "Valiant", "Valid", "Validate", "Valley", "Valor", "Valuable", "Valuation", "Value", "Valve", "Valewood", "Van", "Vandal", "Vanguard", "Vanilla", "Vanish", "Vanity", "Vantage", "Vapor", "Variable", "Variance", "Variant", "Variation", "Varied", "Variety", "Various", "Varnish", "Varsity", "Vary", "Vase", "Vassal", "Vast", "Vat", "Vatican", "Vault", "Vector", "Vega", "Vegetable", "Vegetation", "Vehicle", "Veil", "Vein", "Velocity", "Velvet", "Vendor", "Veneer", "Venetian", "Venezuela", "Vengeance", "Venice", "Venom", "Vent", "Ventilate", "Venture", "Venturer", "Venue", "Venus", "Veranda", "Verb", "Verbal", "Verdict", "Verdant", "Verge", "Verify", "Veridian", "Veritable", "Vermillion", "Vermont", "Vernon", "Verona", "Versatile", "Verse", "Version", "Versus", "Vertebra", "Vertex", "Vertical", "Very", "Vessel", "Vest", "Veteran", "Veterinary", "Veto", "Vex", "Via", "Viable", "Viaduct", "Vibrant", "Vibrate", "Vicar", "Vice", "Vicinity", "Vicious", "Victim", "Victor", "Victoria", "Victorian", "Victory", "Video", "Vienna", "Vietnam", "View", "Viewpoint", "Vigilant", "Vigor", "Vigorous", "Viking", "Village", "Villain", "Vincent", "Vindicate", "Vine", "Vinegar", "Vineyard", "Vintage", "Vinyl", "Viola", "Violate", "Violence", "Violent", "Violet", "Violin", "Viper", "Viral", "Virgin", "Virginia", "Virgo", "Virtual", "Virtue", "Virus", "Visa", "Visceral", "Visible", "Vision", "Visionary", "Visit", "Visitor", "Visor", "Vista", "Visual", "Vital", "Vitality", "Vitamin", "Vivacious", "Vivid", "Vocabulary", "Vocal", "Vocation", "Vodka", "Vogue", "Voice", "Void", "Volatile", "Volcanic", "Volcano", "Volley", "Volleyball", "Volt", "Voltage", "Volume", "Voluntary", "Volunteer", "Vortex", "Vote", "Voter", "Vouch", "Voucher", "Vow", "Vowel", "Voyage", "Voyager", "Vulcan", "Vulnerable", "Vulture"],
  W: ["Wade", "Wage", "Wager", "Wagon", "Waist", "Wait", "Waiter", "Wake", "Walk", "Walker", "Wall", "Wallace", "Wallet", "Walnut", "Walsh", "Walter", "Walton", "Waltz", "Wander", "Want", "War", "Ward", "Warden", "Wardrobe", "Warehouse", "Warfare", "Warm", "Warmth", "Warn", "Warning", "Warp", "Warrant", "Warranty", "Warren", "Warrior", "Warsaw", "Warship", "Warwick", "Wash", "Washington", "Wasp", "Waste", "Watch", "Watchman", "Water", "Waterfall", "Waterfront", "Waterline", "Waterloo", "Waters", "Watershed", "Watson", "Watt", "Wave", "Wavecrest", "Wavelength", "Waver", "Wax", "Way", "Wayne", "Waypoint", "Wayside", "Weak", "Weakness", "Wealth", "Weapon", "Wear", "Weary", "Weather", "Weave", "Web", "Weber", "Webster", "Wedding", "Wedge", "Wednesday", "Weed", "Week", "Weekend", "Weekly", "Weigh", "Weight", "Weird", "Welcome", "Weld", "Welfare", "Well", "Wellington", "Wells", "Welsh", "Wendell", "Wendy", "Wesley", "West", "Westbrook", "Westerly", "Western", "Westfall", "Westfield", "Westminster", "Weston", "Westward", "Wet", "Whale", "Wharf", "Wharfside", "What", "Whatever", "Wheat", "Wheel", "Wheeler", "When", "Whenever", "Where", "Whereas", "Whereby", "Wherever", "Whether", "Which", "Whichever", "While", "Whim", "Whip", "Whirl", "Whiskey", "Whisper", "Whistle", "Whitaker", "White", "Whitefield", "Whitehall", "Whitman", "Whitney", "Whittaker", "Whole", "Wholesale", "Wholesome", "Whom", "Whose", "Why", "Wichita", "Wick", "Wicker", "Wide", "Widen", "Widespread", "Widow", "Width", "Wield", "Wife", "Wiggins", "Wilbur", "Wild", "Wilderness", "Wildlife", "Wildshore", "Wiley", "Wilfred", "Wilkinson", "Will", "Willard", "William", "Williams", "Williamson", "Willie", "Willis", "Willow", "Willowmere", "Wilma", "Wilmington", "Wilson", "Wilt", "Win", "Winch", "Winchester", "Wind", "Windfall", "Windmill", "Window", "Windsor", "Windward", "Windy", "Wine", "Winery", "Wing", "Winger", "Winkle", "Winner", "Winning", "Winona", "Winslow", "Winston", "Winter", "Winters", "Wintersun", "Winthrop", "Wipe", "Wire", "Wisdom", "Wise", "Wish", "Wishbone", "Wit", "Witch", "With", "Withdraw", "Withdrawal", "Wither", "Within", "Without", "Withstand", "Witness", "Wizard", "Wolf", "Wolfe", "Wolfgang", "Wolverine", "Woman", "Wonder", "Wonderful", "Wong", "Wood", "Woodbridge", "Wooden", "Woodland", "Woodrow", "Woods", "Woodward", "Woody", "Wool", "Woolen", "Worcester", "Word", "Wordsworth", "Work", "Worker", "Workflow", "Workforce", "Working", "Workman", "Workout", "Workshop", "World", "Worldwide", "Worm", "Worn", "Worried", "Worry", "Worse", "Worship", "Worst", "Worth", "Worthwhile", "Worthy", "Would", "Wound", "Woven", "Wrap", "Wrapper", "Wrath", "Wreath", "Wreck", "Wreckage", "Wren", "Wrench", "Wrestle", "Wrestler", "Wrestling", "Wright", "Wrigley", "Wrinkle", "Wrist", "Write", "Writer", "Writing", "Written", "Wrong", "Wyatt", "Wyman", "Wyoming"],
  X: ["Xanadu", "Xander", "Xanthus", "Xavier", "Xebec", "Xenia", "Xenith", "Xenon", "Xeric", "Xerox", "Xing", "Xplorer", "Xpress", "Xray", "Xylander", "Xylem", "Xyler", "Xylophone", "Xyphos"],
  Y: ["Yacht", "Yachtline", "Yale", "Yam", "Yankee", "Yard", "Yardarm", "Yarn", "Yarrow", "Yates", "Yawn", "Yawl", "Year", "Yearbook", "Yearling", "Yearly", "Yearn", "Yeast", "Yellow", "Yellowstone", "Yellowtail", "Yemen", "Yen", "Yes", "Yesterday", "Yield", "Yielding", "Yoke", "Yolk", "Yonder", "York", "Yosemite", "Young", "Younger", "Youngster", "Youngwind", "Your", "Yours", "Yourself", "Youth", "Youthful", "Yule", "Yuri", "Yves", "Yvette", "Yvonne"],
  Z: ["Zachary", "Zaffre", "Zagreb", "Zaire", "Zambia", "Zane", "Zanzibar", "Zeal", "Zealous", "Zealshore", "Zebra", "Zed", "Zedline", "Zenith", "Zephyr", "Zephyrus", "Zeppelin", "Zero", "Zest", "Zestline", "Zeus", "Zigzag", "Zimbabwe", "Zimmerman", "Zinc", "Zinnia", "Zion", "Zip", "Zipcode", "Zipper", "Zircon", "Zodiac", "Zombie", "Zone", "Zoo", "Zoom", "Zulu", "Zurich"]
};

// すべてのプレフィックスをフラット化（数字 + アルファベット）
const allPrefixes = [...numericPrefixes, ...Object.values(prefixGroups).flat()];
console.log(`Total prefixes available: ${allPrefixes.length} (${numericPrefixes.length} numeric + ${Object.values(prefixGroups).flat().length} alphabetic)`);

if (allPrefixes.length < TOTAL_RECORDS) {
  throw new Error(`Not enough unique prefixes! Need ${TOTAL_RECORDS}, but only have ${allPrefixes.length}`);
}

// プレフィックスをシャッフル
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const shuffledPrefixes = shuffle(allPrefixes).slice(0, TOTAL_RECORDS);

const sectors = [
  "Capital", "Partners", "Holdings", "Investments", "Markets", "Trust", "Ventures",
  "Advisors", "Associates", "Consulting", "Services", "Management", "Group",
  "Securities", "Finance", "Strategies", "Advisory", "Brokers", "Operations",
  "Clearing", "Derivatives", "Liquidity", "Wealth", "Compliance", "Solutions",
  "Asset Management", "Risk", "Institutional", "Treasury", "Analytics"
];

const categories = [
  "Retail FX Brokerage",
  "Institutional FX Brokerage",
  "Multi-Asset Dealing Desk",
  "FX Liquidity Provision",
  "Commodities Brokerage",
  "Derivatives Advisory",
  "Wealth Management Services",
  "Payment and Remittance Services",
  "Treasury Outsourcing",
  "Corporate FX Risk Advisory"
];

const categoryCodeMap = {
  "Retail FX Brokerage": "FX",
  "Institutional FX Brokerage": "IX",
  "Multi-Asset Dealing Desk": "MD",
  "FX Liquidity Provision": "LP",
  "Commodities Brokerage": "CB",
  "Derivatives Advisory": "DA",
  "Wealth Management Services": "WM",
  "Payment and Remittance Services": "PR",
  "Treasury Outsourcing": "TO",
  "Corporate FX Risk Advisory": "CR",
};

const notes = [
  "Maintains quarterly compliance updates with the Boa Vista Financial Authority.",
  "Underwent enhanced due diligence during the most recent supervisory cycle.",
  "Submitted revised capital adequacy statement in the last reporting period.",
  "Implements mandatory client asset segregation with monthly reconciliations.",
  "Participates in cross-border information sharing with Lusophone regulators.",
  "Filed updated disaster recovery plan incorporating offshore redundancy.",
  "Completed independent AML/CTF audit with satisfactory findings.",
  "Subject to annual prudential assessment focusing on liquidity buffers.",
  "Maintains bilingual client disclosures in Portuguese and English.",
  "Operates under conditional approval pending technology platform migration."
];

const descriptions = [
  "delivers currency execution and settlement solutions to the Cape Verdean hospitality and tourism sector",
  "supports regional exporters with hedging strategies against Euro and USD volatility",
  "specialises in low-latency order routing for diaspora remittance channels",
  "partners with local banks to provide treasury outsourcing and liquidity management",
  "offers portfolio diversification tools for high-net-worth investors across West Africa",
  "focuses on sustainable finance instruments linked to island infrastructure projects",
  "implements disciplined risk management tailored to maritime shipping clients",
  "provides onboarding support for fintech entrants expanding into Lusophone markets",
  "operates bespoke FX solutions for renewable energy initiatives throughout Boa Vista",
  "maintains correspondent networks facilitating cross-border commodity trades"
];

const firstNames = [
  "Ana", "Bruno", "Carla", "Daniel", "Elisa", "Fabio", "Helena", "Igor", "Joana", "Luis",
  "Marta", "Nuno", "Olivia", "Paulo", "Rita", "Sergio", "Teresa", "Vasco", "Wilma", "Yuri",
  "Andre", "Beatriz", "Clara", "Dario", "Eduardo", "Fernanda", "Gabriel", "Henrique",
  "Ines", "Joaquim", "Larissa", "Mateus", "Noelia", "Pedro", "Rafaela", "Salvador",
  "Tatiana", "Ulisses", "Valeria", "Ximena"
];

const lastNames = [
  "Almeida", "Barbosa", "Cardoso", "Delgado", "Esteves", "Fernandes", "Gomes", "Henriques",
  "Lima", "Macedo", "Neves", "Oliveira", "Pereira", "Quintino", "Ramos", "Silva",
  "Tavares", "Vidal", "Xavier", "Zamora"
];

const roles = [
  "Managing Director", "Chief Compliance Officer", "Head of Trading", "Risk Management Lead",
  "Operations Supervisor", "Client Relations Principal", "Chief Technology Officer",
  "Treasury Controller", "AML Programme Lead", "Market Surveillance Officer",
  "Institutional Liaison", "Settlement Supervisor", "Chief Financial Officer",
  "Director of Operations", "Senior Risk Analyst", "Compliance Manager",
  "Trading Desk Manager", "Head of Settlement", "Chief Risk Officer",
  "Director of Compliance", "Head of Operations", "Senior Portfolio Manager"
];

const emailLocalParts = [
  "registry", "compliance", "contact", "info", "support", "inquiries",
  "operations", "filings", "oversight", "clientdesk", "licensing", "hello",
  "admin", "office", "desk", "central", "team", "service"
];

const statusPool = [
  "Active", "Active", "Active", "Active", "Active",
  "Under Review", "Under Review",
  "Suspended",
  "Lapsed"
];

const bureauPrefix = "BVP";
const checkSuffixChars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomBlock(seed) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = seed;
  let block = "";
  for (let i = 0; i < 4; i++) {
    value = (value * 9301 + 49297) % 233280;
    block += chars.charAt(value % chars.length);
  }
  return block;
}

function checkSuffix(seed) {
  let value = seed;
  let suffix = "";
  for (let i = 0; i < 2; i++) {
    value = (value * 241 + 37) % 127;
    suffix += checkSuffixChars.charAt(value % checkSuffixChars.length);
  }
  return suffix;
}

function createRng(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad(num, size) {
  return num.toString().padStart(size, "0");
}

function formatDate(year, month, day) {
  return `${year}-${pad(month, 2)}-${pad(day, 2)}`;
}

const licenses = [];
const usedSlugs = new Set();

for (let index = 0; index < TOTAL_RECORDS; index++) {
  const rng = createRng((index + 1) * 9187);
  
  // ユニークなプレフィックスを使用
  const prefix = shuffledPrefixes[index];
  const sector = sectors[Math.floor(rng() * sectors.length)];
  const companyName = `${prefix} ${sector}`;
  
  let slug = toSlug(companyName);
  let attempts = 0;
  while (usedSlugs.has(slug) && attempts < 10) {
    slug = `${toSlug(companyName)}-${attempts + 1}`;
    attempts++;
  }
  usedSlugs.add(slug);

  const businessCategory = categories[Math.floor(rng() * categories.length)];
  const year = 2010 + Math.floor(rng() * 15);
  const month = Math.floor(rng() * 12) + 1;
  const day = Math.floor(rng() * 28) + 1;
  const issueDate = formatDate(year, month, day);
  const status = statusPool[Math.floor(rng() * statusPool.length)];

  let expiryDate;
  if (status === "Active" || status === "Under Review") {
    expiryDate = formatDate(year + 4 + Math.floor(rng() * 4), month, day);
  } else if (status === "Suspended") {
    expiryDate = formatDate(year + 2 + Math.floor(rng() * 2), month, day);
  } else {
    expiryDate = rng() > 0.5 ? formatDate(year + 1 + Math.floor(rng() * 2), month, day) : "N/A";
  }

  const note = notes[Math.floor(rng() * notes.length)];
  const description = `Founded in ${year}, ${companyName} ${descriptions[Math.floor(rng() * descriptions.length)]}.`;

  const quarter = Math.floor((month - 1) / 3) + 1;
  const categoryCode = categoryCodeMap[businessCategory] ?? "FX";
  const randomSegmentSeed = (index + 1) * 7919 + Math.floor(rng() * 997);
  const randomSegment = randomBlock(randomSegmentSeed);
  const suffixSeed = randomSegmentSeed + quarter * 31 + Math.floor(rng() * 149);
  const suffixCode = checkSuffix(suffixSeed);
  const licenseNumber = `${bureauPrefix}-${categoryCode}-${String(year).slice(-2)}Q${quarter}-${randomSegment}-${suffixCode}`;

  const emailLocal = emailLocalParts[Math.floor(rng() * emailLocalParts.length)];
  const contactEmail = `${emailLocal}@${slug}.cv`;

  const personCount = 2 + Math.floor(rng() * 2);
  const seenPersons = new Set();
  const selectedPersons = [];
  while (selectedPersons.length < personCount) {
    const first = firstNames[Math.floor(rng() * firstNames.length)];
    const last = lastNames[Math.floor(rng() * lastNames.length)];
    const fullName = `${first} ${last}`;
    if (seenPersons.has(fullName)) continue;
    seenPersons.add(fullName);
    const role = roles[Math.floor(rng() * roles.length)];
    selectedPersons.push({ name: fullName, role });
  }

  licenses.push({
    id: index + 1,
    slug,
    companyName,
    licenseNumber,
    issueDate,
    expiryDate,
    status,
    registeredAddress: "Boa Vista, Republic of Cabo Verde",
    contactEmail,
    businessCategory,
    complianceNotes: note,
    description,
    keyPersons: selectedPersons,
  });
}

const outputDir = join(__dirname, "../src/data");
mkdirSync(outputDir, { recursive: true });

const interfaceDefinition = `// Auto-generated by scripts/generate-licenses-1800.mjs
// Do not edit directly. Update the generator if changes are required.

export interface LicenseRecord {
  id: number;
  slug: string;
  companyName: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  registeredAddress: string;
  contactEmail: string;
  businessCategory: string;
  complianceNotes: string;
  description: string;
  keyPersons: { name: string; role: string }[];
}

export const licenses: LicenseRecord[] = ${JSON.stringify(licenses, null, 2)};

export function getLicenseBySlug(slug: string): LicenseRecord | undefined {
  return licenses.find((license) => license.slug === slug);
}
`;

writeFileSync(join(outputDir, "licenses.ts"), interfaceDefinition, "utf8");

console.log(`Generated ${licenses.length} license records at ${join(outputDir, "licenses.ts")}`);
console.log(`Total file size: ${Math.round(interfaceDefinition.length / 1024)} KB`);
