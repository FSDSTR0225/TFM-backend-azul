require("dotenv").config();
const mongoose = require("mongoose");
const Game = require("../models/gameModel");
const Platform = require("../models/platformModel");

const games = [
  { name: "Counter-Strike 2", steamAppId: 730, platforms: ["PC"] },
  { name: "Dota 2", steamAppId: 570, platforms: ["PC"] },
  {
    name: "PUBG: BATTLEGROUNDS",
    steamAppId: 578080,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  { name: "Schedule I", steamAppId: 3164500, platforms: ["PC"] },
  { name: "Path of Exile 2", steamAppId: 2694490, platforms: ["PC"] },
  {
    name: "Marvel Rivals",
    steamAppId: 2767030,
    platforms: ["PC", "PS5", "Xbox"],
  },
  { name: "Bongo Cat", steamAppId: 3419430, platforms: ["PC"] },
  { name: "R.E.P.O.", steamAppId: 3241660, platforms: ["PC"] },
  { name: "Banana", steamAppId: 2923300, platforms: ["PC"] },
  { name: "Source SDK Base 2007", steamAppId: 218, platforms: ["PC"] },
  {
    name: "Apex Legends",
    steamAppId: 1172470,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  },
  { name: "Spacewar", steamAppId: 480, platforms: ["PC"] },
  {
    name: "Call of Duty®",
    steamAppId: 1938090,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "Grand Theft Auto V Legacy",
    steamAppId: 271590,
    platforms: ["PC", "PS3", "PS4", "PS5", "Xbox"],
  },
  {
    name: "Monster Hunter Wilds",
    steamAppId: 2246340,
    platforms: ["PC", "PS5", "Xbox"],
  },
  {
    name: "War Thunder",
    steamAppId: 236390,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  { name: "Wallpaper Engine", steamAppId: 431960, platforms: ["PC"] },
  {
    name: "Tom Clancy's Rainbow Six Siege",
    steamAppId: 359550,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "EA SPORTS FC 25",
    steamAppId: 2669320,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "Football Manager 2024",
    steamAppId: 1904540,
    platforms: ["PC", "Nintendo Switch"],
  },
  {
    name: "Baldur's Gate 3",
    steamAppId: 1086940,
    platforms: ["PC", "PS5", "Xbox"],
  },
  {
    name: "Dead by Daylight",
    steamAppId: 381210,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Warframe",
    steamAppId: 230410,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  },
  { name: "Crosshair X", steamAppId: 223344, platforms: ["PC"] }, ////
  {
    name: "Stardew Valley",
    steamAppId: 413150,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "DayZ",
    steamAppId: 221100,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "Team Fortress 2",
    steamAppId: 440,
    platforms: ["PC", "PS3", "Xbox 360"],
  },
  {
    name: "Red Dead Redemption 2",
    steamAppId: 1174180,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "Delta Force",
    steamAppId: 334455,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Mobile"],
  },
  {
    name: "Euro Truck Simulator 2",
    steamAppId: 227300,
    platforms: ["PC"],
  },
  {
    name: "Hearts of Iron IV",
    steamAppId: 394360,
    platforms: ["PC"],
  },
  {
    name: "Grand Theft Auto V Enhanced",
    steamAppId: 271590,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "ELDEN RING",
    steamAppId: 1245620,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  },
  {
    name: "The Sims™ 4",
    steamAppId: 1222670,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "VRChat",
    steamAppId: 438100,
    platforms: ["PC", "Mobile"],
  },
  {
    name: "Terraria",
    steamAppId: 105600,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "tModLoader",
    steamAppId: 1281930,
    platforms: ["PC"],
  },
  {
    name: "HELLDIVERS™ 2",
    steamAppId: 987321,
    platforms: ["PC", "PS5"],
  },
  {
    name: "Sid Meier's Civilization VI",
    steamAppId: 289070,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "Crab Game",
    steamAppId: 1782210,
    platforms: ["PC"],
  },
  {
    name: "Valheim",
    steamAppId: 892970,
    platforms: ["PC", "Xbox"],
  },
  {
    name: "Soundpad",
    steamAppId: 629520,
    platforms: ["PC"],
  },
  {
    name: "Total War: WARHAMMER III",
    steamAppId: 1142710,
    platforms: ["PC"],
  },
  {
    name: "ARK: Survival Evolved",
    steamAppId: 346110,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  },
  {
    name: "NARAKA: BLADEPOINT",
    steamAppId: 1203220,
    platforms: ["PC", "PS5", "Xbox"],
  }, //////
  {
    name: "THRONE AND LIBERTY",
    steamAppId: 2429640,
    platforms: ["PC"],
  },
  {
    name: "Cyberpunk 2077",
    steamAppId: 1091500,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "Geometry Dash",
    steamAppId: 322170,
    platforms: ["PC", "Mobile"],
  },
  {
    name: "7 Days to Die",
    steamAppId: 251570,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Garry's Mod",
    steamAppId: 4000,
    platforms: ["PC"],
  },
  {
    name: "RimWorld",
    steamAppId: 294100,
    platforms: ["PC"],
  },
  {
    name: "Farming Simulator 25",
    steamAppId: 2300320,
    platforms: ["PC", "PS5", "Xbox"],
  },
  {
    name: "Waifu",
    steamAppId: 3109050,
    platforms: ["PC"],
  },
  {
    name: "The Elder Scrolls V: Skyrim Special Edition",
    steamAppId: 489830,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Palworld",
    steamAppId: 1623730,
    platforms: ["PC"],
  },
  {
    name: "Rocket League",
    steamAppId: 252950,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Project Zomboid",
    steamAppId: 108600,
    platforms: ["PC"],
  },
  {
    name: "Kingdom Come: Deliverance II",
    steamAppId: 1771300,
    platforms: ["PC"],
  },
  {
    name: "The Binding of Isaac: Rebirth",
    steamAppId: 250900,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Once Human",
    steamAppId: 2139460,
    platforms: ["PC"],
  },
  {
    name: "Satisfactory",
    steamAppId: 526870,
    platforms: ["PC"],
  },
  {
    name: "Destiny 2",
    steamAppId: 1085660,
    platforms: ["PC", "PS4", "PS5", "Xbox"],
  },
  {
    name: "BeamNG.drive",
    steamAppId: 284160,
    platforms: ["PC"],
  },
  {
    name: "FINAL FANTASY XIV Online",
    steamAppId: 39210,
    platforms: ["PC", "PS4", "PS5"],
  },
  {
    name: "Overwatch® 2",
    steamAppId: null,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Don't Starve Together",
    steamAppId: 322330,
    platforms: ["PC", "PS4", "Xbox"],
  }, ////
  {
    name: "Age of Empires II: Definitive Edition",
    steamAppId: 813780,
    platforms: ["PC", "Xbox", "PS5"],
  },
  {
    name: "Factorio",
    steamAppId: 427520,
    platforms: ["PC", "Nintendo Switch"],
  },
  {
    name: "Mount & Blade II: Bannerlord",
    steamAppId: 261550,
    platforms: ["PC", "PS5", "PS4", "Xbox"],
  },
  {
    name: "Among Us",
    steamAppId: 945360,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "Phasmophobia",
    steamAppId: 739630,
    platforms: ["PC", "PS5", "Xbox"],
  },
  { name: "Left 4 Dead 2", steamAppId: 550, platforms: ["PC", "Xbox"] },
  {
    name: "The Witcher 3: Wild Hunt",
    steamAppId: 292030,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Fallout 4",
    steamAppId: 377160,
    platforms: ["PC", "PS5", "PS4", "Xbox"],
  },
  {
    name: "Dark Souls III",
    steamAppId: 374320,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Sekiro™: Shadows Die Twice",
    steamAppId: 814380,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Hades",
    steamAppId: 1145360,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Hollow Knight",
    steamAppId: 367520,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Portal 2",
    steamAppId: 620,
    platforms: ["PC", "Xbox", "Nintendo Switch"],
  },
  {
    name: "DOOM Eternal",
    steamAppId: 782330,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "No Man's Sky",
    steamAppId: 275850,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Borderlands 3",
    steamAppId: 397540,
    platforms: ["PC", "PS5", "PS4", "Xbox"],
  },
  {
    name: "Dead Cells",
    steamAppId: 588650,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch", "Mobile"],
  },
  { name: "Cyber Hunter", steamAppId: 1000000, platforms: ["PC", "Mobile"] },
  {
    name: "Warhammer: Vermintide 2",
    steamAppId: 552500,
    platforms: ["PC", "PS4", "Xbox"],
  },
  { name: "The Forest", steamAppId: 242760, platforms: ["PC", "PS4"] },
  {
    name: "Subnautica",
    steamAppId: 264710,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch"],
  },
  { name: "Raft", steamAppId: 648800, platforms: ["PC"] },
  {
    name: "The Long Dark",
    steamAppId: 305620,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  { name: "Oxygen Not Included", steamAppId: 457140, platforms: ["PC"] },
  {
    name: "Slay the Spire",
    steamAppId: 646570,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "Deep Rock Galactic",
    steamAppId: 548430,
    platforms: ["PC", "PS5", "PS4", "Xbox"],
  }, //////

  {
    name: "Don't Starve",
    steamAppId: 219740,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "Euro Truck Simulator 2",
    steamAppId: 227300,
    platforms: ["PC"],
  },
  {
    name: "The Binding of Isaac: Rebirth",
    steamAppId: 250900,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Slay the Spire",
    steamAppId: 646570,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "Cities: Skylines",
    steamAppId: 255710,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Total War: WARHAMMER III",
    steamAppId: 1142710,
    platforms: ["PC"],
  },
  {
    name: "RimWorld",
    steamAppId: 294100,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Project Zomboid",
    steamAppId: 108600,
    platforms: ["PC"],
  },
  {
    name: "7 Days to Die",
    steamAppId: 251570,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Oxygen Not Included",
    steamAppId: 457140,
    platforms: ["PC"],
  },
  {
    name: "Factorio",
    steamAppId: 427520,
    platforms: ["PC", "Nintendo Switch"],
  },
  {
    name: "Dark Souls: Remastered",
    steamAppId: 570940,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Dark Souls II: Scholar of the First Sin",
    steamAppId: 335300,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Dark Souls: Prepare To Die Edition",
    steamAppId: 211420,
    platforms: ["PC"],
  },
  {
    name: "Cuphead",
    steamAppId: 268910,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Celeste",
    steamAppId: 504230,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Dead Cells",
    steamAppId: 588650,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "Hollow Knight: Silksong",
    steamAppId: 367520,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Stardew Valley",
    steamAppId: 413150,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    name: "The Binding of Isaac: Afterbirth+",
    steamAppId: 570660,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "The Binding of Isaac: Repentance",
    steamAppId: 1426300,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Hades II",
    steamAppId: 1145360,
    platforms: ["PC"],
  },
  {
    name: "Vampire Survivors",
    steamAppId: 1794680,
    platforms: ["PC", "Xbox", "Mobile"],
  },
  {
    name: "Loop Hero",
    steamAppId: 1282730,
    platforms: ["PC", "Nintendo Switch"],
  },
  {
    name: "Return of the Obra Dinn",
    steamAppId: 653530,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Outer Wilds",
    steamAppId: 753640,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Disco Elysium",
    steamAppId: 632470,
    platforms: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch"],
  }, /////////////////
  {
    name: "Inscryption",
    steamAppId: 1092790,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "The Stanley Parable: Ultra Deluxe",
    steamAppId: 1703340,
    platforms: ["PC", "PS5", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Portal: Companion Collection",
    steamAppId: 400,
    platforms: ["PC", "Nintendo Switch"],
  },
  {
    name: "Portal",
    steamAppId: 400,
    platforms: ["PC", "Xbox", "PS4", "Nintendo Switch"],
  },
  { name: "Half-Life", steamAppId: 70, platforms: ["PC"] },
  { name: "Half-Life: Blue Shift", steamAppId: 130, platforms: ["PC"] },
  { name: "Half-Life: Opposing Force", steamAppId: 50, platforms: ["PC"] },
  { name: "Black Mesa", steamAppId: 362890, platforms: ["PC"] },
  { name: "Doki Doki Literature Club!", steamAppId: 698780, platforms: ["PC"] },
  {
    name: "Undertale",
    steamAppId: 391540,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "OMORI",
    steamAppId: 1150690,
    platforms: ["PC", "PS4", "Nintendo Switch"],
  },
  {
    name: "OneShot",
    steamAppId: 420530,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "To the Moon",
    steamAppId: 206440,
    platforms: ["PC", "Nintendo Switch", "Mobile"],
  },
  {
    name: "Finding Paradise",
    steamAppId: 397410,
    platforms: ["PC", "Nintendo Switch", "Mobile"],
  },
  {
    name: "A Short Hike",
    steamAppId: 1055540,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Firewatch",
    steamAppId: 383870,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "What Remains of Edith Finch",
    steamAppId: 501300,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Gone Home",
    steamAppId: 232430,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  },
  {
    name: "Life is Strange™",
    steamAppId: 319630,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Life is Strange: Before the Storm",
    steamAppId: 554620,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Life is Strange 2",
    steamAppId: 532210,
    platforms: ["PC", "PS4", "Xbox"],
  },
  { name: "Tell Me Why", steamAppId: 1180660, platforms: ["PC", "Xbox"] },
  {
    name: "Detroit: Become Human",
    steamAppId: 1222140,
    platforms: ["PC", "PS4"],
  },
  { name: "Heavy Rain", steamAppId: 960990, platforms: ["PC", "PS4"] },
  { name: "Beyond: Two Souls", steamAppId: 960990, platforms: ["PC", "PS4"] },
  {
    name: "The Walking Dead",
    steamAppId: 207610,
    platforms: ["PC", "PS4", "Xbox", "Nintendo Switch"],
  }, /////
  {
    name: "The Wolf Among Us",
    steamAppId: 250320,
    platforms: ["PC", "PS4", "Xbox", "Mobile"],
  },
  {
    name: "Tales from the Borderlands",
    steamAppId: 330830,
    platforms: ["PC", "PS4", "Xbox", "Switch"],
  },
  {
    name: "Batman: The Telltale Series",
    steamAppId: 498240,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "Batman: The Enemy Within",
    steamAppId: 675260,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "The Walking Dead: Season Two",
    steamAppId: 261030,
    platforms: ["PC", "PS4", "Xbox", "Mobile"],
  },
  {
    name: "The Walking Dead: A New Frontier",
    steamAppId: 536220,
    platforms: ["PC", "PS4", "Xbox"],
  },
  {
    name: "The Walking Dead: The Final Season",
    steamAppId: 866800,
    platforms: ["PC", "PS4", "Xbox", "Switch"],
  },
  {
    name: "The Walking Dead: Michonne",
    steamAppId: 429570,
    platforms: ["PC", "PS4", "Xbox", "Mobile"],
  },
  {
    name: "Game of Thrones - A Telltale Games Series",
    steamAppId: 330840,
    platforms: ["PC", "PS4", "Xbox", "Mobile"],
  },
  {
    name: "The Wolf Among Us 2",
    steamAppId: null,
    platforms: ["PC", "PS5", "Xbox"],
  },
  { name: "Tales of Monkey Island", steamAppId: 31160, platforms: ["PC"] },
  {
    name: "Sam & Max: Save the World",
    steamAppId: 901390,
    platforms: ["PC", "Switch"],
  },
  {
    name: "Sam & Max: Beyond Time and Space",
    steamAppId: 901400,
    platforms: ["PC", "Switch"],
  },
  {
    name: "Sam & Max: The Devil’s Playhouse",
    steamAppId: 901410,
    platforms: ["PC"],
  },
  {
    name: "Back to the Future: The Game",
    steamAppId: 31290,
    platforms: ["PC", "PS4"],
  },
  {
    name: "Jurassic Park: The Game",
    steamAppId: 201830,
    platforms: ["PC", "PS3", "Xbox 360"],
  },
  {
    name: "Poker Night at the Inventory",
    steamAppId: 31280,
    platforms: ["PC"],
  },
  { name: "Poker Night 2", steamAppId: 234710, platforms: ["PC"] },
  {
    name: "The Walking Dead: Saints & Sinners",
    steamAppId: 751780,
    platforms: ["PC"],
  },
  { name: "Bone: Out from Boneville", steamAppId: 8310, platforms: ["PC"] },
  { name: "The Great Cow Race", steamAppId: 8320, platforms: ["PC"] },
  {
    name: "Strong Bad's Cool Game for Attractive People",
    steamAppId: 8340,
    platforms: ["PC"],
  },
  {
    name: "Wallace & Gromit's Grand Adventures",
    steamAppId: 31100,
    platforms: ["PC"],
  },
  {
    name: "Nelson Tethers: Puzzle Agent",
    steamAppId: 31280,
    platforms: ["PC"],
  },
  {
    name: "Nelson Tethers: Puzzle Agent 2",
    steamAppId: 94500,
    platforms: ["PC"],
  },
  { name: "Puzzle Agent", steamAppId: 31280, platforms: ["PC"] },
  { name: "Puzzle Agent 2", steamAppId: 94500, platforms: ["PC"] },
  {
    name: "The Cave",
    steamAppId: 221810,
    platforms: ["PC", "PS3", "Xbox 360", "Wii U"],
  },
  {
    name: "Broken Age",
    steamAppId: 232790,
    platforms: ["PC", "PS4", "Mobile"],
  },
  {
    name: "Grim Fandango Remastered",
    steamAppId: 316790,
    platforms: ["PC", "PS4", "Switch"],
  },
  {
    name: "Day of the Tentacle Remastered",
    steamAppId: 388210,
    platforms: ["PC", "PS4", "Switch"],
  },
  {
    name: "Full Throttle Remastered",
    steamAppId: 228280,
    platforms: ["PC", "PS4", "Switch"],
  },
  {
    name: "Thimbleweed Park",
    steamAppId: 569860,
    platforms: ["PC", "PS4", "Xbox", "Switch", "Mobile"],
  },
  {
    name: "Return to Monkey Island",
    steamAppId: 2060130,
    platforms: ["PC", "Switch", "PS5", "Xbox"],
  },
  {
    name: "Monkey Island 2 Special Edition: LeChuck's Revenge",
    steamAppId: 32460,
    platforms: ["PC", "Xbox 360"],
  },
  {
    name: "The Secret of Monkey Island: Special Edition",
    steamAppId: 32360,
    platforms: ["PC", "Xbox 360"],
  },
  {
    name: "Indiana Jones and the Fate of Atlantis",
    steamAppId: 6010,
    platforms: ["PC"],
  },
  { name: "The Dig", steamAppId: 6040, platforms: ["PC"] },
  { name: "Loom", steamAppId: 32340, platforms: ["PC"] },
  {
    name: "Machinarium",
    steamAppId: 40700,
    platforms: ["PC", "PS4", "Switch", "Mobile"],
  },
  {
    name: "Bastion",
    steamAppId: 107100,
    platforms: ["PC", "PS4", "Switch", "Mobile"],
  },
  {
    name: "Transistor",
    steamAppId: 237930,
    platforms: ["PC", "PS4", "Switch", "Mobile"],
  },
  { name: "Pyre", steamAppId: 462770, platforms: ["PC", "PS4"] },
  {
    name: "Spiritfarer®: Farewell Edition",
    steamAppId: 972660,
    platforms: ["PC", "PS4", "Switch", "Xbox"],
  },
  { name: "Eastward", steamAppId: 977880, platforms: ["PC", "Switch"] },
  {
    name: "A Space for the Unbound",
    steamAppId: 1201270,
    platforms: ["PC", "PS4", "PS5", "Switch", "Xbox"],
  },
  { name: "Norco", steamAppId: 1221250, platforms: ["PC"] },
  {
    name: "Lake",
    steamAppId: 1110070,
    platforms: ["PC", "Xbox", "PS4", "PS5"],
  }, //////
  {
    name: "Road 96",
    steamAppId: 1466640,
    platforms: ["PC", "Nintendo Switch", "PS4", "Xbox"],
  },
  {
    name: "Coffee Talk",
    steamAppId: 914800,
    platforms: ["PC", "Nintendo Switch", "PS4", "Xbox"],
  },
  {
    name: "Bear and Breakfast",
    steamAppId: 1134970,
    platforms: ["PC", "Nintendo Switch"],
  },
  {
    name: "Beacon Pines",
    steamAppId: 1269640,
    platforms: ["PC", "Nintendo Switch"],
  },
  {
    name: "Season: A Letter to the Future",
    steamAppId: 695330,
    platforms: ["PC", "PS5", "Xbox"],
  },
  { name: "Astro Bot", platforms: ["PS5"], steamAppId: null },
  { name: "Final Fantasy VII Rebirth", platforms: ["PS5"], steamAppId: null },
  { name: "Helldivers 2", steamAppId: 553850, platforms: ["PS5", "PC"] },
  { name: "Marvel's Spider-Man 2", platforms: ["PS5"], steamAppId: null },
  { name: "Stellar Blade", platforms: ["PS5"], steamAppId: null },
  {
    name: "Call of Duty: Black Ops 6",
    steamAppId: 1962663,
    platforms: ["PS5", "Xbox", "PC"],
  },
  { name: "Tekken 8", platforms: ["PS5", "Xbox", "PC"], steamAppId: 1778820 },
  {
    name: "Resident Evil 4 Remake",
    platforms: ["PS5", "Xbox", "PC"],
    steamAppId: 2050650,
  },
  {
    name: "Elden Ring: Shadow of the Erdtree",
    platforms: ["PS5", "Xbox", "PC"],
    steamAppId: 1245620,
  },
  {
    name: "The Last of Us Part II Remastered",
    platforms: ["PS5"],
    steamAppId: null,
  },
  {
    name: "Horizon Forbidden West",
    platforms: ["PS5", "PS4"],
    steamAppId: null,
  },
  { name: "God of War Ragnarök", platforms: ["PS5", "PS4"], steamAppId: null },
  {
    name: "Assassin's Creed Shadows",
    platforms: ["PS5", "Xbox", "PC"],
    steamAppId: 2208920,
  },
  {
    name: "Dragon's Dogma 2",
    platforms: ["PS5", "Xbox", "PC"],
    steamAppId: 2054970,
  },
  {
    name: "Street Fighter 6",
    platforms: ["PS5", "Xbox", "PC"],
    steamAppId: 1364780,
  },
  { name: "Gran Turismo 7", platforms: ["PS5", "PS4"], steamAppId: null },
  { name: "Demon's Souls Remake", platforms: ["PS5"], steamAppId: null },
  { name: "Returnal", platforms: ["PS5", "PC"], steamAppId: 1649240 },
  {
    name: "Ratchet & Clank: Rift Apart",
    platforms: ["PS5", "PC"],
    steamAppId: 1895880,
  },
  {
    name: "Sackboy: A Big Adventure",
    platforms: ["PS5", "PS4", "PC"],
    steamAppId: 1599660,
  }, /////////////////////////////////////
  {
    name: "Fortnite",
    platforms: ["PS5", "PC", "Xbox", "Switch", "Mobile"],
    steamAppId: null,
  },
  { name: "Marvel Rivals", platforms: ["PS5", "PC"], steamAppId: 123456 },
  {
    name: "Call of Duty: Modern Warfare II",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 1938090,
  },
  {
    name: "Grand Theft Auto V",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 271590,
  },
  {
    name: "Roblox",
    platforms: ["PS5", "PC", "Xbox", "Mobile"],
    steamAppId: null,
  },
  {
    name: "EA SPORTS FC 25",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 123457,
  },
  {
    name: "Tom Clancy's Rainbow Six Siege",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 359550,
  },
  {
    name: "Minecraft",
    platforms: ["PS5", "PC", "Xbox", "Switch", "Mobile"],
    steamAppId: null,
  },
  { name: "Ghost of Yōtei", platforms: ["PS5"], steamAppId: null },
  {
    name: "Death Stranding 2: On The Beach",
    platforms: ["PS5"],
    steamAppId: null,
  },
  {
    name: "Elden Ring: Nightreign",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 1245620,
  },
  {
    name: "Split Fiction",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 234567,
  },
  {
    name: "Monster Hunter Wilds",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 234568,
  },
  {
    name: "Assassin's Creed Shadows",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 2208920,
  },
  { name: "WWE 2K25", platforms: ["PS5", "PC", "Xbox"], steamAppId: 234569 },
  {
    name: "Madden NFL 25",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 234570,
  },
  { name: "NBA 2K25", platforms: ["PS5", "PC", "Xbox"], steamAppId: 234571 },
  {
    name: "College Football 25",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: 234572,
  },
  { name: "Gran Turismo 7", platforms: ["PS5"], steamAppId: null },
  { name: "Demon's Souls Remake", platforms: ["PS5"], steamAppId: null }, ///////////////////
  { name: "Blue Prince", platforms: ["PS5", "PC", "Xbox"], steamAppId: null },
  { name: "Split Fiction", platforms: ["PS5", "PC", "Xbox"], steamAppId: null },
  {
    name: "Kingdom Come: Deliverance II",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "Indiana Jones and the Great Circle",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  { name: "Avowed", platforms: ["PS5", "PC", "Xbox"], steamAppId: null },
  { name: "Ghost of Yōtei", platforms: ["PS5"], steamAppId: null },
  {
    name: "Death Stranding 2: On the Beach",
    platforms: ["PS5"],
    steamAppId: null,
  },
  {
    name: "Elden Ring: Nightreign",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "Monster Hunter Wilds",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "Assassin's Creed Shadows",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  { name: "NBA 2K25", platforms: ["PS5", "PC", "Xbox"], steamAppId: null },
  { name: "Madden NFL 25", platforms: ["PS5", "PC", "Xbox"], steamAppId: null },
  {
    name: "EA SPORTS FC 25",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "College Football 25",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  { name: "Gran Turismo 7", platforms: ["PS5"], steamAppId: null },
  { name: "Demon's Souls Remake", platforms: ["PS5"], steamAppId: null },
  { name: "Returnal", platforms: ["PS5", "PC"], steamAppId: null },
  {
    name: "Ratchet & Clank: Rift Apart",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  {
    name: "Sackboy: A Big Adventure",
    platforms: ["PS5", "PS4", "PC"],
    steamAppId: null,
  },
  {
    name: "Hogwarts Legacy",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  }, //////////////////////
  { name: "Astro Bot", platforms: ["PS5"], steamAppId: null },
  {
    name: "Still Wakes the Deep",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  { name: "Helldivers 2", platforms: ["PS5", "PC"], steamAppId: null },
  {
    name: "Balatro",
    platforms: ["PS5", "PC", "Xbox", "Switch"],
    steamAppId: null,
  },
  {
    name: "Thank Goodness You're Here!",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  {
    name: "Senua's Saga: Hellblade II",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "Lost Records: Bloom & Rage - Tape 2",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  {
    name: "Citizen Sleeper 2",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "The Talos Principle Reawakened",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  { name: "Baldur's Gate 3", platforms: ["PS5", "PC"], steamAppId: null },
  {
    name: "Cocoon",
    platforms: ["PS5", "PC", "Xbox", "Switch"],
    steamAppId: null,
  },
  { name: "Final Fantasy VII Rebirth", platforms: ["PS5"], steamAppId: null },
  { name: "God of War: Ragnarök", platforms: ["PS5", "PS4"], steamAppId: null },
  {
    name: "Horizon Forbidden West",
    platforms: ["PS5", "PS4"],
    steamAppId: null,
  },
  {
    name: "Ratchet & Clank: Rift Apart",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  { name: "Returnal", platforms: ["PS5", "PC"], steamAppId: null },
  {
    name: "Sackboy: A Big Adventure",
    platforms: ["PS5", "PS4", "PC"],
    steamAppId: null,
  },
  {
    name: "Hogwarts Legacy",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "MLB The Show 25",
    platforms: ["PS5", "PS4", "Xbox", "Switch"],
    steamAppId: null,
  },
  { name: "PGA TOUR 2K25", platforms: ["PS5", "PC", "Xbox"], steamAppId: null }, ////////////////
  {
    name: "Assassin's Creed Shadows",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  { name: "Split Fiction", platforms: ["PS5", "PC", "Xbox"], steamAppId: null },
  {
    name: "Monster Hunter Wilds",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  { name: "Blue Prince", platforms: ["PS5", "PC", "Xbox"], steamAppId: null },
  { name: "Astro Bot", platforms: ["PS5"], steamAppId: null },
  {
    name: "Still Wakes the Deep",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  { name: "Helldivers 2", platforms: ["PS5", "PC"], steamAppId: null },
  {
    name: "Balatro",
    platforms: ["PS5", "PC", "Xbox", "Switch"],
    steamAppId: null,
  },
  {
    name: "Thank Goodness You're Here!",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  {
    name: "Senua's Saga: Hellblade II",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "Lost Records: Bloom & Rage - Tape 2",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  {
    name: "Citizen Sleeper 2",
    platforms: ["PS5", "PC", "Xbox"],
    steamAppId: null,
  },
  {
    name: "The Talos Principle Reawakened",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  { name: "Baldur's Gate 3", platforms: ["PS5", "PC"], steamAppId: null },
  {
    name: "Cocoon",
    platforms: ["PS5", "PC", "Xbox", "Switch"],
    steamAppId: null,
  },
  { name: "Final Fantasy VII Rebirth", platforms: ["PS5"], steamAppId: null },
  { name: "God of War: Ragnarök", platforms: ["PS5", "PS4"], steamAppId: null },
  {
    name: "Horizon Forbidden West",
    platforms: ["PS5", "PS4"],
    steamAppId: null,
  },
  {
    name: "Ratchet & Clank: Rift Apart",
    platforms: ["PS5", "PC"],
    steamAppId: null,
  },
  { name: "Returnal", platforms: ["PS5", "PC"], steamAppId: null }, ///
  { name: "Fable", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Avowed", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "South of Midnight", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "33 Immortals", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Replaced", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Sniper Elite: Resistance",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Atomfall", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Splitgate 2", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Capcom Fighting Collection 2",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  {
    name: "Tales of Graces f Remastered",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  {
    name: "Like a Dragon: Pirate Yakuza in Hawaii",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  {
    name: "Elden Ring: Nightreign",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  {
    name: "Star Wars: Episode I - Jedi Power Battles",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Army Moves Overdrive", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Space Adventure Cobra - The Awakening",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  {
    name: "Lunar Remastered Collection",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Atelier Yumia", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Football Manager 2025 Console",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Tomb Raider IV-VI", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Sid Meier's Civilization VII",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  }, ////
  { name: "Alan Wake 2", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "Starfield", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Hi-Fi Rush", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Ori and the Will of the Wisps",
    platforms: ["Xbox", "PC", "Switch"],
    steamAppId: null,
  },
  { name: "Sea of Thieves", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Psychonauts 2", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "Forza Horizon 5", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Halo Infinite", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "The Outer Worlds 2", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Indiana Jones and the Great Circle",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Doom: The Dark Ages", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Borderlands 4", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Zenless Zone Zero",
    platforms: ["Xbox", "PC", "PS5", "iOS", "Android"],
    steamAppId: null,
  },
  { name: "Rematch", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Inazuma Eleven: Victory Road",
    platforms: ["Xbox", "PC", "PS5", "Switch"],
    steamAppId: null,
  },
  { name: "Marathon", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Dead Space Remake",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Dragon Age: The Veilguard",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Like a Dragon: Infinite Wealth",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Persona 5 Tactica",
    platforms: ["Xbox", "PC", "PS5", "Switch"],
    steamAppId: null,
  }, ////
  { name: "Split Fiction", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Kingdom Come: Deliverance 2",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Two Point Museum", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Assassin's Creed Shadows",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  { name: "WWE 2K25", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "Ninja Gaiden 2 Black", platforms: ["Xbox"], steamAppId: null },
  {
    name: "Lost Records: Bloom & Rage - Tape 1",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Dynasty Warriors: Origins",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  { name: "PGA Tour 2K25", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "South of Midnight", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "The First Berserker: Khazan",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Tails of Iron 2",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  { name: "Eternal Strands", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Atomfall", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Gears of War: E-Day", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Perfect Dark", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "State of Decay 3", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "ARK 2", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Blue Prince", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Zenless Zone Zero",
    platforms: ["Xbox", "PC", "PS5", "iOS", "Android"],
    steamAppId: null,
  }, ///
  {
    name: "Star Wars: Zero Company",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Tony Hawk's Pro Skater 3 + 4",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Dead Rising Deluxe Remaster",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Devil May Cry 5 Special Edition",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  { name: "Neva", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Lonely Mountains: Snow Riders",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  { name: "Blue Prince", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "Rematch", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Inazuma Eleven: Victory Road",
    platforms: ["Xbox", "PC", "PS5", "Switch"],
    steamAppId: null,
  },
  { name: "Marathon", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Dragon Age: The Veilguard",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Like a Dragon: Infinite Wealth",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Persona 5 Tactica",
    platforms: ["Xbox", "PC", "PS5", "Switch"],
    steamAppId: null,
  },
  { name: "Split Fiction", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Kingdom Come: Deliverance 2",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Two Point Museum", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Assassin's Creed Shadows",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  { name: "WWE 2K25", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "Ninja Gaiden 2 Black", platforms: ["Xbox"], steamAppId: null },
  {
    name: "Lost Records: Bloom & Rage - Tape 1",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  }, ///

  { name: "Avowed", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "33 Immortals", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Fable", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Gears of War: E-Day",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Perfect Dark", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "State of Decay 3", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "ARK 2", platforms: ["Xbox", "PC"], steamAppId: null },
  { name: "Blue Prince", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "Rematch", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Inazuma Eleven: Victory Road",
    platforms: ["Xbox", "PC", "PS5", "Switch"],
    steamAppId: null,
  },
  { name: "Marathon", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  {
    name: "Dragon Age: The Veilguard",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Like a Dragon: Infinite Wealth",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  {
    name: "Persona 5 Tactica",
    platforms: ["Xbox", "PC", "PS5", "Switch"],
    steamAppId: null,
  },
  { name: "Split Fiction", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Kingdom Come: Deliverance 2",
    platforms: ["Xbox", "PC"],
    steamAppId: null,
  },
  { name: "Two Point Museum", platforms: ["Xbox", "PC"], steamAppId: null },
  {
    name: "Assassin's Creed Shadows",
    platforms: ["Xbox", "PC", "PS5"],
    steamAppId: null,
  },
  { name: "WWE 2K25", platforms: ["Xbox", "PC", "PS5"], steamAppId: null },
  { name: "Ninja Gaiden 2 Black", platforms: ["Xbox"], steamAppId: null },
  {
    name: "The Legend of Zelda: Echoes of Wisdom",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Super Mario Bros. Wonder",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Metroid Prime Remastered",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Luigi's Mansion 3",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Fire Emblem Engage",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Pikmin 4", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Bayonetta Origins: Cereza and the Lost Demon",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Super Mario RPG", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Princess Peach: Showtime!",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Mario vs. Donkey Kong",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Mario & Luigi: Brothership",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Donkey Kong Country: Tropical Freeze",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Kirby and the Forgotten Land",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Super Mario 3D World + Bowser’s Fury",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Super Mario Maker 2",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Yoshi’s Crafted World",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Miitopia", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Ring Fit Adventure",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Nintendo Switch Sports",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "WarioWare: Get It Together!",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Super Mario Party",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Mario Party Superstars",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Mario Strikers: Battle League",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Mario Golf: Super Rush",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Mario Tennis Aces",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Paper Mario: The Origami King",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "New Pokémon Snap",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Pokémon Quest", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Pokémon Café ReMix",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Pokémon Unite", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Pokémon Mystery Dungeon: Rescue Team DX",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Pokémon Legends: Arceus",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "Pokémon Sword and Shield",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Splatoon 3", platforms: ["Nintendo Switch"], steamAppId: null },
  { name: "Splatoon 2", platforms: ["Nintendo Switch"], steamAppId: null },
  { name: "Tetris 99", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Super Kirby Clash",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Ninjala", platforms: ["Nintendo Switch"], steamAppId: null },
  { name: "Fall Guys", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Disney Dreamlight Valley",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Fortnite", platforms: ["Nintendo Switch"], steamAppId: null },
  { name: "Rocket League", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Asphalt 9: Legends",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Dauntless", platforms: ["Nintendo Switch"], steamAppId: null },
  { name: "Warframe", platforms: ["Nintendo Switch"], steamAppId: null },
  { name: "Brawlhalla", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Yu-Gi-Oh! Master Duel",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  { name: "Arena of Valor", platforms: ["Nintendo Switch"], steamAppId: null },
  {
    name: "Sky: Children of the Light",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "World of Tanks Blitz",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  },
  {
    name: "The Elder Scrolls: Blades",
    platforms: ["Nintendo Switch"],
    steamAppId: null,
  }, ///
  { name: "Whiteout Survival", platforms: ["Mobile"], steamAppId: null },
  { name: "Royal Match", platforms: ["Mobile"], steamAppId: null },
  { name: "Candy Crush Saga", platforms: ["Mobile"], steamAppId: null },
  { name: "Monster Strike", platforms: ["Mobile"], steamAppId: null },
  { name: "Honor of Kings", platforms: ["Mobile"], steamAppId: null },
  { name: "Fate/Grand Order", platforms: ["Mobile"], steamAppId: null },
  { name: "MONOPOLY GO!", platforms: ["Mobile"], steamAppId: null },
  { name: "Gardenscapes", platforms: ["Mobile"], steamAppId: null },
  { name: "Block Blast!", platforms: ["Mobile"], steamAppId: null },
  { name: "Subway Surfers", platforms: ["Mobile"], steamAppId: null },
  { name: "8 Ball Pool", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Free Fire x NARUTO SHIPPUDEN",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Cat Chaos: Prankster", platforms: ["Mobile"], steamAppId: null },
  { name: "My Talking Tom 2", platforms: ["Mobile"], steamAppId: null },
  { name: "Ludo King®", platforms: ["Mobile"], steamAppId: null },
  { name: "Pizza Ready!", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Jelly Master: Mukbang ASMR",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "Offline Games - No Wifi Games",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "Mini Relaxing Game - Pop It",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "My Talking Angela 2", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Stickman Party 234 MiniGames",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "EA SPORTS FC™ Mobile Soccer",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "Spider Fighter 3: Action Game",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "Mobile Legends: Bang Bang",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Vita Mahjong", platforms: ["Mobile"], steamAppId: null },
  { name: "Super Bear Adventure", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Worms Zone .io - Hungry Snake",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Snake Clash!", platforms: ["Mobile"], steamAppId: null },
  {
    name: "My Supermarket Simulator 3D",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "My Talking Tom Friends", platforms: ["Mobile"], steamAppId: null },
  { name: "Balatro", platforms: ["Mobile"], steamAppId: null },
  { name: "Vampire Survivors", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Red's First Flight (Angry Birds)",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Oxenfree", platforms: ["Mobile"], steamAppId: null },
  { name: "Sonic Rumble", platforms: ["Mobile", "PC"], steamAppId: null },
  { name: "Snaky Cat", platforms: ["Mobile"], steamAppId: null },
  { name: "Cassette Beasts", platforms: ["Mobile"], steamAppId: null },
  { name: "Bright Memory: Infinite", platforms: ["Mobile"], steamAppId: null },
  { name: "Ananta", platforms: ["Mobile"], steamAppId: null },
  { name: "Valorant Mobile", platforms: ["Mobile"], steamAppId: null },
  { name: "Delta Force", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Need for Speed: No Limits",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Call of Duty: Mobile", platforms: ["Mobile"], steamAppId: null },
  { name: "Dawn of Ages", platforms: ["Mobile"], steamAppId: null },
  { name: "Grimguard", platforms: ["Mobile"], steamAppId: null },
  { name: "Wild Rift", platforms: ["Mobile"], steamAppId: null },
  { name: "War Thunder Mobile", platforms: ["Mobile"], steamAppId: null },
  { name: "Arcane Quest Legends 2", platforms: ["Mobile"], steamAppId: null },
  { name: "Zombastic", platforms: ["Mobile"], steamAppId: null },
  { name: "Free Fire", platforms: ["Mobile"], steamAppId: null },
  { name: "PUBG Mobile", platforms: ["Mobile"], steamAppId: null },
  { name: "Call of Duty: Mobile", platforms: ["Mobile"], steamAppId: null },
  { name: "Candy Crush Saga", platforms: ["Mobile"], steamAppId: null },
  { name: "Roblox", platforms: ["Mobile", "PC", "Xbox"], steamAppId: null },
  {
    name: "Genshin Impact",
    platforms: ["Mobile", "PC", "PS4", "PS5"],
    steamAppId: null,
  },
  { name: "Honor of Kings", platforms: ["Mobile"], steamAppId: null },
  { name: "Monopoly GO!", platforms: ["Mobile"], steamAppId: null },
  { name: "Royal Match", platforms: ["Mobile"], steamAppId: null },
  { name: "Last War: Survival", platforms: ["Mobile"], steamAppId: null },
  { name: "Whiteout Survival", platforms: ["Mobile"], steamAppId: null },
  { name: "Coin Master", platforms: ["Mobile"], steamAppId: null },
  { name: "Brawl Stars", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Honkai: Star Rail",
    platforms: ["Mobile", "PC", "PS5"],
    steamAppId: null,
  },
  { name: "Pokémon GO", platforms: ["Mobile"], steamAppId: null },
  { name: "Gardenscapes", platforms: ["Mobile"], steamAppId: null },
  { name: "Pokémon TCG Pocket", platforms: ["Mobile"], steamAppId: null },
  { name: "Peridot", platforms: ["Mobile"], steamAppId: null },
  {
    name: "TMNT: Shredder's Revenge",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  {
    name: "Return to Monkey Island",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  { name: "Diablo Immortal", platforms: ["Mobile", "PC"], steamAppId: null },
  {
    name: "League of Legends: Wild Rift",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "Asphalt 9: Legends",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  {
    name: "Dead Cells",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  {
    name: "Final Fantasy VII: Ever Crisis",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "Loop Hero",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  { name: "Marvel Snap", platforms: ["Mobile", "PC"], steamAppId: null },
  {
    name: "Stardew Valley",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  { name: "Thumper: Pocket Edition", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Vampire Survivors",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  {
    name: "Among Us",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  {
    name: "Minecraft",
    platforms: ["Mobile", "PC", "Consoles"],
    steamAppId: null,
  },
  { name: "Subway Surfers", platforms: ["Mobile"], steamAppId: null },
  { name: "8 Ball Pool", platforms: ["Mobile"], steamAppId: null },
  { name: "Ludo King®", platforms: ["Mobile"], steamAppId: null },
  { name: "My Talking Tom 2", platforms: ["Mobile"], steamAppId: null },
  { name: "My Talking Angela 2", platforms: ["Mobile"], steamAppId: null },
  { name: "My Talking Tom Friends", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Stickman Party 234 MiniGames",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "EA SPORTS FC™ Mobile Soccer",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "Spider Fighter 3: Action Game",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  {
    name: "Mobile Legends: Bang Bang",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Super Bear Adventure", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Worms Zone .io - Hungry Snake",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Snake Clash!", platforms: ["Mobile"], steamAppId: null },
  {
    name: "My Supermarket Simulator 3D",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Balatro", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Red's First Flight (Angry Birds)",
    platforms: ["Mobile"],
    steamAppId: null,
  },
  { name: "Oxenfree", platforms: ["Mobile"], steamAppId: null },
  {
    name: "Sonic Rumble",
    platforms: ["Mobile", "PC"],
    steamAppId: null,
  },
];

const loadGames = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Game.deleteMany(); // Elimina lo que haya en la base de datos en "games",lo uso para actualizar(1º elimino y luego añado)

    const allGames = []; // Para almacenar los juegos

    for (let i = 0; i < games.length; i++) {
      // Bucle para iterar en games,cada iteracion coge un juego y lo guarda.
      const game = games[i];

      const platformIds = await Platform.find({
        //buscamos en Platform las plataformas con el name = a las plataformas de los juegos incluidos en el array(game.platform) y seleccionamos su id
        name: { $in: game.platforms },
      }).select("_id");

      allGames.push({
        name: game.name,
        steamAppId: game.steamAppId,
        platforms: platformIds, //Crea el juego con el nombre dado,el steamAppId dado y la plataforma/s asociada al id antes obtenido.
      });
    }

    await Game.insertMany(allGames); // insertMany() es para isnertar varias cosas a la vez,igual que create() pero con create seria 1 a 1.
    console.log("Juegos insertados con éxito");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error al insertar juegos:", error.message);
    mongoose.connection.close();
  }
};

loadGames();
