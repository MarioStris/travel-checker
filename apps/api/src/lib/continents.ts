const EUROPE = ['HR','DE','FR','IT','ES','PT','NL','BE','AT','CH','GB','IE','SE','NO','DK','FI','PL','CZ','SK','HU','RO','BG','GR','SI','RS','BA','ME','MK','AL','XK','EE','LV','LT','UA','MD','BY','IS','MT','CY','LU'];
const ASIA = ['JP','CN','KR','TH','VN','ID','MY','SG','PH','IN','LK','NP','MM','KH','LA','TW','HK','AE','IL','TR','GE','AM','JO','LB','QA','SA','OM','BH','KW','MN','UZ','KZ','KG','TJ'];
const AFRICA = ['MA','EG','ZA','KE','TZ','ET','NG','GH','SN','TN','MU','MG','RW','UG','MZ','NA','BW','ZW'];
const NORTH_AMERICA = ['US','CA','MX','CU','JM','DO','HT','PR','CR','PA','GT','HN','SV','NI','BZ'];
const SOUTH_AMERICA = ['BR','AR','CL','CO','PE','EC','VE','BO','PY','UY','GY','SR'];
const OCEANIA = ['AU','NZ','FJ','PG','WS','TO','VU','NC','PF'];

export function getContinent(countryCode: string): string {
  if (EUROPE.includes(countryCode)) return 'Europe';
  if (ASIA.includes(countryCode)) return 'Asia';
  if (AFRICA.includes(countryCode)) return 'Africa';
  if (NORTH_AMERICA.includes(countryCode)) return 'North America';
  if (SOUTH_AMERICA.includes(countryCode)) return 'South America';
  if (OCEANIA.includes(countryCode)) return 'Oceania';
  return 'Other';
}
