// SEO Cities Configuration for ShiftMyHome (Scotland Focus)
// Expandable to cover entire UK

export interface SeoCity {
  id: string;
  slug: string;
  name: string;
  region: string;
  county: string;
  population: number;
  lat: number;
  lng: number;
  isPopular: boolean;
  postcodeArea: string[];
  nearbyAreas: string[];
  description: string;
}

// Scotland Cities - Primary focus
export const scotlandCities: SeoCity[] = [
  {
    id: 'edinburgh',
    slug: 'edinburgh',
    name: 'Edinburgh',
    region: 'Lothian',
    county: 'City of Edinburgh',
    population: 524000,
    lat: 55.9533,
    lng: -3.1883,
    isPopular: true,
    postcodeArea: ['EH1', 'EH2', 'EH3', 'EH4', 'EH5', 'EH6', 'EH7', 'EH8', 'EH9', 'EH10'],
    nearbyAreas: ['Leith', 'Portobello', 'Morningside', 'Corstorphine', 'Cramond', 'Newington', 'Stockbridge'],
    description: 'the historic capital city with its stunning castle, Royal Mile, and vibrant cultural scene'
  },
  {
    id: 'glasgow',
    slug: 'glasgow',
    name: 'Glasgow',
    region: 'Strathclyde',
    county: 'Glasgow City',
    population: 635000,
    lat: 55.8642,
    lng: -4.2518,
    isPopular: true,
    postcodeArea: ['G1', 'G2', 'G3', 'G4', 'G5', 'G11', 'G12', 'G13', 'G20', 'G31'],
    nearbyAreas: ['West End', 'Southside', 'East End', 'Pollokshields', 'Hillhead', 'Partick', 'Govan'],
    description: 'Scotland\'s largest city, known for its impressive Victorian architecture, thriving arts scene, and friendly locals'
  },
  {
    id: 'aberdeen',
    slug: 'aberdeen',
    name: 'Aberdeen',
    region: 'Aberdeenshire',
    county: 'Aberdeen City',
    population: 198000,
    lat: 57.1497,
    lng: -2.0943,
    isPopular: true,
    postcodeArea: ['AB10', 'AB11', 'AB12', 'AB15', 'AB16', 'AB21', 'AB22', 'AB23', 'AB24', 'AB25'],
    nearbyAreas: ['Old Aberdeen', 'Torry', 'Dyce', 'Westhill', 'Portlethen', 'Bridge of Don', 'Cove Bay'],
    description: 'the Granite City, famous for its stunning architecture, bustling harbour, and gateway to Royal Deeside'
  },
  {
    id: 'dundee',
    slug: 'dundee',
    name: 'Dundee',
    region: 'Tayside',
    county: 'Dundee City',
    population: 148000,
    lat: 56.4620,
    lng: -2.9707,
    isPopular: true,
    postcodeArea: ['DD1', 'DD2', 'DD3', 'DD4', 'DD5'],
    nearbyAreas: ['Broughty Ferry', 'West End', 'Lochee', 'Stobswell', 'Downfield'],
    description: 'the City of Discovery, home to the V&A Museum, vibrant waterfront, and Scotland\'s sunniest city'
  },
  {
    id: 'inverness',
    slug: 'inverness',
    name: 'Inverness',
    region: 'Highlands',
    county: 'Highland',
    population: 70000,
    lat: 57.4778,
    lng: -4.2247,
    isPopular: false,
    postcodeArea: ['IV1', 'IV2', 'IV3'],
    nearbyAreas: ['Culloden', 'Westhill', 'Cradlehall', 'Smithton', 'Balloch'],
    description: 'the capital of the Highlands, gateway to Loch Ness and stunning Highland landscapes'
  },
  {
    id: 'stirling',
    slug: 'stirling',
    name: 'Stirling',
    region: 'Central',
    county: 'Stirling',
    population: 36000,
    lat: 56.1165,
    lng: -3.9369,
    isPopular: false,
    postcodeArea: ['FK7', 'FK8', 'FK9'],
    nearbyAreas: ['Bridge of Allan', 'Bannockburn', 'Cambusbarron', 'Cornton', 'Causewayhead'],
    description: 'the historic gateway to the Highlands, crowned by its magnificent castle and rich heritage'
  },
  {
    id: 'perth',
    slug: 'perth',
    name: 'Perth',
    region: 'Perthshire',
    county: 'Perth and Kinross',
    population: 47000,
    lat: 56.3950,
    lng: -3.4308,
    isPopular: false,
    postcodeArea: ['PH1', 'PH2'],
    nearbyAreas: ['Scone', 'Crieff', 'Blairgowrie', 'Kinross', 'Pitlochry'],
    description: 'the Fair City, nestled on the banks of the River Tay with stunning countryside surroundings'
  },
  {
    id: 'paisley',
    slug: 'paisley',
    name: 'Paisley',
    region: 'Renfrewshire',
    county: 'Renfrewshire',
    population: 77000,
    lat: 55.8456,
    lng: -4.4237,
    isPopular: false,
    postcodeArea: ['PA1', 'PA2', 'PA3'],
    nearbyAreas: ['Johnstone', 'Renfrew', 'Erskine', 'Elderslie', 'Linwood'],
    description: 'renowned for its Abbey, textile heritage, and close proximity to Glasgow'
  },
  {
    id: 'east-kilbride',
    slug: 'east-kilbride',
    name: 'East Kilbride',
    region: 'South Lanarkshire',
    county: 'South Lanarkshire',
    population: 75000,
    lat: 55.7600,
    lng: -4.2200,
    isPopular: false,
    postcodeArea: ['G74', 'G75'],
    nearbyAreas: ['Hamilton', 'Blantyre', 'Strathaven', 'Eaglesham', 'Thorntonhall'],
    description: 'Scotland\'s first and largest new town, offering excellent transport links to Glasgow'
  },
  {
    id: 'livingston',
    slug: 'livingston',
    name: 'Livingston',
    region: 'West Lothian',
    county: 'West Lothian',
    population: 57000,
    lat: 55.8818,
    lng: -3.5221,
    isPopular: false,
    postcodeArea: ['EH54'],
    nearbyAreas: ['Bathgate', 'Broxburn', 'Whitburn', 'Armadale', 'West Calder'],
    description: 'a vibrant new town with excellent shopping, dining, and transport connections'
  },
  {
    id: 'hamilton',
    slug: 'hamilton',
    name: 'Hamilton',
    region: 'South Lanarkshire',
    county: 'South Lanarkshire',
    population: 54000,
    lat: 55.7772,
    lng: -4.0377,
    isPopular: false,
    postcodeArea: ['ML3'],
    nearbyAreas: ['Motherwell', 'Blantyre', 'Larkhall', 'Bothwell', 'Uddingston'],
    description: 'a historic market town with the famous Hamilton Palace grounds and great community spirit'
  },
  {
    id: 'kirkcaldy',
    slug: 'kirkcaldy',
    name: 'Kirkcaldy',
    region: 'Fife',
    county: 'Fife',
    population: 50000,
    lat: 56.1107,
    lng: -3.1674,
    isPopular: false,
    postcodeArea: ['KY1', 'KY2'],
    nearbyAreas: ['Glenrothes', 'Leven', 'Burntisland', 'Dysart', 'Kinghorn'],
    description: 'the Lang Toun, stretching along the Fife coast with beautiful beaches and rich industrial heritage'
  },
  {
    id: 'dunfermline',
    slug: 'dunfermline',
    name: 'Dunfermline',
    region: 'Fife',
    county: 'Fife',
    population: 54000,
    lat: 56.0719,
    lng: -3.4393,
    isPopular: false,
    postcodeArea: ['KY11', 'KY12'],
    nearbyAreas: ['Rosyth', 'Inverkeithing', 'Cowdenbeath', 'Crossgates', 'Kincardine'],
    description: 'Scotland\'s ancient capital, home to the magnificent Abbey and Robert the Bruce\'s final resting place'
  },
  {
    id: 'falkirk',
    slug: 'falkirk',
    name: 'Falkirk',
    region: 'Falkirk',
    county: 'Falkirk',
    population: 35000,
    lat: 56.0019,
    lng: -3.7839,
    isPopular: false,
    postcodeArea: ['FK1', 'FK2'],
    nearbyAreas: ['Grangemouth', 'Bo\'ness', 'Larbert', 'Stenhousemuir', 'Polmont'],
    description: 'home to the iconic Falkirk Wheel and Kelpies sculptures, perfectly positioned between Edinburgh and Glasgow'
  },
  {
    id: 'ayr',
    slug: 'ayr',
    name: 'Ayr',
    region: 'Ayrshire',
    county: 'South Ayrshire',
    population: 46000,
    lat: 55.4586,
    lng: -4.6292,
    isPopular: false,
    postcodeArea: ['KA7', 'KA8'],
    nearbyAreas: ['Prestwick', 'Troon', 'Maybole', 'Alloway', 'Doonfoot'],
    description: 'the birthplace of Robert Burns, featuring sandy beaches, championship golf courses, and rich literary heritage'
  },
  {
    id: 'dumfries',
    slug: 'dumfries',
    name: 'Dumfries',
    region: 'Dumfries & Galloway',
    county: 'Dumfries and Galloway',
    population: 33000,
    lat: 55.0709,
    lng: -3.6051,
    isPopular: false,
    postcodeArea: ['DG1', 'DG2'],
    nearbyAreas: ['Annan', 'Lockerbie', 'Castle Douglas', 'Dalbeattie', 'Moffat'],
    description: 'the Queen of the South, a charming market town on the River Nith with Burns connections'
  },
  {
    id: 'carlisle',
    slug: 'carlisle',
    name: 'Carlisle',
    region: 'Cumbria (Border)',
    county: 'Cumbria',
    population: 75000,
    lat: 54.8925,
    lng: -2.9329,
    isPopular: false,
    postcodeArea: ['CA1', 'CA2', 'CA3'],
    nearbyAreas: ['Brampton', 'Longtown', 'Penrith', 'Haltwhistle', 'Wigton'],
    description: 'a historic border city with its impressive castle, cathedral, and gateway to Scotland'
  }
];

// Helper functions
export function getCityBySlug(slug: string): SeoCity | undefined {
  return scotlandCities.find(c => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return scotlandCities.map(c => c.slug);
}

export function getPopularCities(): SeoCity[] {
  return scotlandCities.filter(c => c.isPopular);
}

export function getCitiesByRegion(region: string): SeoCity[] {
  return scotlandCities.filter(c => c.region === region);
}
