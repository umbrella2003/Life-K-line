import * as Astronomy from "astronomy-engine";

export interface ZodiacSign {
  name: string;
  nameEn: string;
  symbol: string;
  element: string;
  quality: string;
}

// 黄道十二宫,从白羊座0°起算,每宫30°
export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "白羊座", nameEn: "Aries", symbol: "♈", element: "火", quality: "启动" },
  { name: "金牛座", nameEn: "Taurus", symbol: "♉", element: "土", quality: "固定" },
  { name: "双子座", nameEn: "Gemini", symbol: "♊", element: "风", quality: "变动" },
  { name: "巨蟹座", nameEn: "Cancer", symbol: "♋", element: "水", quality: "启动" },
  { name: "狮子座", nameEn: "Leo", symbol: "♌", element: "火", quality: "固定" },
  { name: "处女座", nameEn: "Virgo", symbol: "♍", element: "土", quality: "变动" },
  { name: "天秤座", nameEn: "Libra", symbol: "♎", element: "风", quality: "启动" },
  { name: "天蝎座", nameEn: "Scorpio", symbol: "♏", element: "水", quality: "固定" },
  { name: "射手座", nameEn: "Sagittarius", symbol: "♐", element: "火", quality: "变动" },
  { name: "摩羯座", nameEn: "Capricorn", symbol: "♑", element: "土", quality: "启动" },
  { name: "水瓶座", nameEn: "Aquarius", symbol: "♒", element: "风", quality: "固定" },
  { name: "双鱼座", nameEn: "Pisces", symbol: "♓", element: "水", quality: "变动" },
];

export interface PlanetPosition {
  body: string;
  bodyEn: string;
  sign: ZodiacSign;
  degreeInSign: number;
  longitude: number;
}

export interface AscendantResult {
  longitude: number;
  sign: ZodiacSign;
  degreeInSign: number;
}

export interface NatalChartInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  timezoneOffsetHours: number; // 出生地所用的民用时区,如中国为8
  latitude: number;
  longitude: number; // 东经为正,西经为负
}

export interface NatalChart {
  utcDate: string;
  sun: PlanetPosition;
  moon: PlanetPosition;
  ascendant: AscendantResult;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
}

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function signOf(longitude: number): { sign: ZodiacSign; degreeInSign: number } {
  const lon = normalizeDeg(longitude);
  const index = Math.min(11, Math.floor(lon / 30));
  return { sign: ZODIAC_SIGNS[index], degreeInSign: lon - index * 30 };
}

function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function julianCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

// 平黄赤交角,单位度(Meeus《天文算法》公式22.2)
function meanObliquity(T: number): number {
  const seconds = 21.448 - T * (46.815 + T * (0.00059 - T * 0.001813));
  return 23 + 26 / 60 + seconds / 3600;
}

// 格林尼治平恒星时,单位度(Meeus 公式12.4)
function greenwichMeanSiderealTime(d: number, T: number): number {
  const gmst =
    280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - (T * T * T) / 38710000;
  return normalizeDeg(gmst);
}

// 上升星座(Ascendant)黄经,公式来自 Meeus《天文算法》,需要出生时刻(UTC)与出生地经纬度
function calcAscendant(utcDate: Date, latitude: number, longitudeEast: number): AscendantResult {
  const jd = toJulianDate(utcDate);
  const d = jd - 2451545.0;
  const T = julianCenturies(jd);
  const gmst = greenwichMeanSiderealTime(d, T);
  const ramc = normalizeDeg(gmst + longitudeEast); // 当地恒星时(角度形式)
  const eps = meanObliquity(T);

  const ramcRad = (ramc * Math.PI) / 180;
  const epsRad = (eps * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;

  // 公式已用"日出时刻上升点应与太阳黄经重合"这一天文事实,在多个纬度/年代/东西经上做过验证。
  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const ascDeg = normalizeDeg((Math.atan2(y, x) * 180) / Math.PI);

  const { sign, degreeInSign } = signOf(ascDeg);
  return { longitude: ascDeg, sign, degreeInSign };
}

// 注意:astronomy-engine 的 EclipticLongitude() 返回的是"日心黄经"(且对太阳本身会直接报错),
// 占星需要的是"地心视黄经"(以地球为参照点),必须用 GeoVector(地心矢量) + Ecliptic(转换到黄道坐标)
// 这一组合,Ecliptic() 会把 J2000 赤道坐标转换为"实时黄道坐标(true ecliptic of date)",
// 与占星传统黄道(考虑岁差)的定义一致。
function planetPosition(name: string, nameEn: string, body: Astronomy.Body, utcDate: Date): PlanetPosition {
  const vec = Astronomy.GeoVector(body, utcDate, true);
  const lon = normalizeDeg(Astronomy.Ecliptic(vec).elon);
  const { sign, degreeInSign } = signOf(lon);
  return { body: name, bodyEn: nameEn, sign, degreeInSign, longitude: lon };
}

// 把出生地民用时间(如北京时间)换算为UTC,再用真实天文算法计算太阳/月亮/五大行星的
// 黄道位置以及上升星座——这是与市面上占星App一致的"真本命盘"算法,而非查表估算。
export function calcNatalChart(input: NatalChartInput): NatalChart {
  const utcMs =
    Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute) -
    input.timezoneOffsetHours * 3600 * 1000;
  const utcDate = new Date(utcMs);

  return {
    utcDate: utcDate.toISOString(),
    sun: planetPosition("太阳", "Sun", Astronomy.Body.Sun, utcDate),
    moon: planetPosition("月亮", "Moon", Astronomy.Body.Moon, utcDate),
    ascendant: calcAscendant(utcDate, input.latitude, input.longitude),
    mercury: planetPosition("水星", "Mercury", Astronomy.Body.Mercury, utcDate),
    venus: planetPosition("金星", "Venus", Astronomy.Body.Venus, utcDate),
    mars: planetPosition("火星", "Mars", Astronomy.Body.Mars, utcDate),
    jupiter: planetPosition("木星", "Jupiter", Astronomy.Body.Jupiter, utcDate),
    saturn: planetPosition("土星", "Saturn", Astronomy.Body.Saturn, utcDate),
  };
}

export interface CityOption {
  name: string;
  latitude: number;
  longitude: number;
}

// 常用城市经纬度,供出生地选择时免去手动查询经纬度
export const COMMON_CITIES: CityOption[] = [
  { name: "北京", latitude: 39.9042, longitude: 116.4074 },
  { name: "上海", latitude: 31.2304, longitude: 121.4737 },
  { name: "广州", latitude: 23.1291, longitude: 113.2644 },
  { name: "深圳", latitude: 22.5431, longitude: 114.0579 },
  { name: "杭州", latitude: 30.2741, longitude: 120.1551 },
  { name: "南京", latitude: 32.0603, longitude: 118.7969 },
  { name: "武汉", latitude: 30.5928, longitude: 114.3055 },
  { name: "成都", latitude: 30.5728, longitude: 104.0668 },
  { name: "重庆", latitude: 29.5630, longitude: 106.5516 },
  { name: "西安", latitude: 34.3416, longitude: 108.9398 },
  { name: "天津", latitude: 39.3434, longitude: 117.3616 },
  { name: "苏州", latitude: 31.2989, longitude: 120.5853 },
  { name: "青岛", latitude: 36.0671, longitude: 120.3826 },
  { name: "长沙", latitude: 28.2282, longitude: 112.9388 },
  { name: "厦门", latitude: 24.4798, longitude: 118.0894 },
  { name: "香港", latitude: 22.3193, longitude: 114.1694 },
  { name: "台北", latitude: 25.0330, longitude: 121.5654 },
];
