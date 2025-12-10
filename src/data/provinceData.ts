export interface MunicipalityData {
  municipality: string;
  target: number;
  systemResult: number;
  systemVariance: number;
}

export interface ProvinceData {
  name: string;
  municipalities: MunicipalityData[];
  grandTotal: MunicipalityData;
}

export const antiqueData: ProvinceData = {
  name: "Antique",
  municipalities: [
    { municipality: "ANINI-Y", target: 20, systemResult: 21, systemVariance: -1 },
    { municipality: "BARBAZA", target: 28, systemResult: 13, systemVariance: 15 },
    { municipality: "BUGASONG", target: 162, systemResult: 85, systemVariance: 77 },
    { municipality: "CALUYA", target: 227, systemResult: 0, systemVariance: 227 },
    { municipality: "CULASI", target: 170, systemResult: 159, systemVariance: 11 },
    { municipality: "HAMTIC", target: 93, systemResult: 74, systemVariance: 19 },
    { municipality: "LAUA-AN", target: 51, systemResult: 33, systemVariance: 18 },
    { municipality: "LIBERTAD", target: 24, systemResult: 20, systemVariance: 4 },
    { municipality: "PANDAN", target: 24, systemResult: 21, systemVariance: 3 },
    { municipality: "PATNONGON", target: 122, systemResult: 110, systemVariance: 12 },
    { municipality: "SAN JOSE (Capital)", target: 153, systemResult: 96, systemVariance: 57 },
    { municipality: "SAN REMIGIO", target: 743, systemResult: 345, systemVariance: 398 },
    { municipality: "SEBASTE", target: 20, systemResult: 21, systemVariance: -1 },
    { municipality: "SIBALOM", target: 91, systemResult: 82, systemVariance: 9 },
    { municipality: "TIBIAO", target: 246, systemResult: 157, systemVariance: 89 },
    { municipality: "VALDERRAMA", target: 111, systemResult: 66, systemVariance: 45 },
  ],
  grandTotal: { municipality: "Grand Total", target: 2285, systemResult: 1303, systemVariance: 982 }
};

export const capizData: ProvinceData = {
  name: "Capiz",
  municipalities: [
    { municipality: "CUARTERO", target: 45, systemResult: 38, systemVariance: 7 },
    { municipality: "DAO", target: 68, systemResult: 55, systemVariance: 13 },
    { municipality: "DUMALAG", target: 52, systemResult: 45, systemVariance: 7 },
    { municipality: "DUMARAO", target: 85, systemResult: 70, systemVariance: 15 },
    { municipality: "IVISAN", target: 38, systemResult: 30, systemVariance: 8 },
    { municipality: "JAMINDAN", target: 72, systemResult: 60, systemVariance: 12 },
    { municipality: "MAAYON", target: 55, systemResult: 45, systemVariance: 10 },
    { municipality: "MAMBUSAO", target: 62, systemResult: 50, systemVariance: 12 },
    { municipality: "PANAY", target: 48, systemResult: 40, systemVariance: 8 },
    { municipality: "PANITAN", target: 58, systemResult: 48, systemVariance: 10 },
    { municipality: "PILAR", target: 42, systemResult: 35, systemVariance: 7 },
    { municipality: "PONTEVEDRA", target: 65, systemResult: 56, systemVariance: 9 },
    { municipality: "PRESIDENT ROXAS", target: 78, systemResult: 67, systemVariance: 11 },
    { municipality: "ROXAS CITY (Capital)", target: 125, systemResult: 108, systemVariance: 17 },
    { municipality: "SAPIAN", target: 35, systemResult: 30, systemVariance: 5 },
    { municipality: "SIGMA", target: 40, systemResult: 35, systemVariance: 5 },
    { municipality: "TAPAZ", target: 95, systemResult: 85, systemVariance: 10 },
  ],
  grandTotal: { municipality: "Grand Total", target: 1063, systemResult: 897, systemVariance: 166 }
};

export const iloiloData: ProvinceData = {
  name: "Iloilo",
  municipalities: [
    { municipality: "AJUY", target: 180, systemResult: 140, systemVariance: 40 },
    { municipality: "ALIMODIAN", target: 145, systemResult: 115, systemVariance: 30 },
    { municipality: "ANILAO", target: 92, systemResult: 75, systemVariance: 17 },
    { municipality: "BADIANGAN", target: 78, systemResult: 65, systemVariance: 13 },
    { municipality: "BALASAN", target: 125, systemResult: 100, systemVariance: 25 },
    { municipality: "BANATE", target: 88, systemResult: 72, systemVariance: 16 },
    { municipality: "BAROTAC NUEVO", target: 135, systemResult: 112, systemVariance: 23 },
    { municipality: "BAROTAC VIEJO", target: 105, systemResult: 88, systemVariance: 17 },
    { municipality: "BINGAWAN", target: 55, systemResult: 45, systemVariance: 10 },
    { municipality: "CABATUAN", target: 168, systemResult: 138, systemVariance: 30 },
    { municipality: "CALINOG", target: 195, systemResult: 162, systemVariance: 33 },
    { municipality: "CARLES", target: 142, systemResult: 120, systemVariance: 22 },
    { municipality: "CONCEPCION", target: 112, systemResult: 95, systemVariance: 17 },
    { municipality: "DINGLE", target: 98, systemResult: 82, systemVariance: 16 },
    { municipality: "DUEÑAS", target: 85, systemResult: 72, systemVariance: 13 },
    { municipality: "ILOILO CITY (Capital)", target: 320, systemResult: 268, systemVariance: 52 },
  ],
  grandTotal: { municipality: "Grand Total", target: 2123, systemResult: 1749, systemVariance: 374 }
};

export const provincesData: ProvinceData = {
  name: "All Provinces",
  municipalities: [
    { municipality: "Antique", target: 2285, systemResult: 1303, systemVariance: 982 },
    { municipality: "Capiz", target: 1063, systemResult: 897, systemVariance: 166 },
    { municipality: "Iloilo", target: 2123, systemResult: 1749, systemVariance: 374 },
  ],
  grandTotal: { municipality: "Grand Total", target: 5471, systemResult: 3949, systemVariance: 1522 }
};

export const allProvinces = {
  provinces: provincesData,
  antique: antiqueData,
  capiz: capizData,
  iloilo: iloiloData,
};
