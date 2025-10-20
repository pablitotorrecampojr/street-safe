
import districtsJson from '../constants/districts.json';
import municipalitiesJson from '../constants/municipalities.json';

//TODO: filter out if address 
export function findBarangayInMunicipality(address, municipality, barangay) {
    const municipalities = municipalitiesJson;
    if (!address || !municipality || !municipalities[municipality]) {
        return null;
    }

    const normalizedAddress = address.toLowerCase();
    const barangays = municipalities[municipality];

    const matchedBarangay = barangays.find(
        (b) => normalizedAddress.includes(b.toLowerCase())
    );

    if (!matchedBarangay) {
        return false;
    }

    return (matchedBarangay.toLowerCase() == barangay.toLowerCase());
}

export function findDistrict(address, district) {
    //TODO: filter out hazard that are not national flagged
    if (!address || !district) {
        return false;
    }

    const municipalities = municipalitiesJson;
    const authorityDistrict = districtsJson["districts"][district];
    const normalizedAddress = address.toLowerCase();
    
    //TODO: check address if within listed known municipalities
    const findMunicipality = Object.keys(municipalities).find(
        m => normalizedAddress.includes(m.toLowerCase())
    );
    if (!findMunicipality) {
        return false;
    }

    //TODO: check if municipality from address 
    const municipalityToDistrictMap = {
        "Cebu City": ["Cebu City North District", "Cebu City South District"],

        "Mandaue": "6th District",

        "Lapu Lapu": "7th District",

        "Carcar": "1st District",
        "Sibonga": "1st District",
        "Argao": "1st District",
        "Dalaguete": "1st District",
        "Alcoy": "1st District",
        "Boljoon": "1st District",
        "Oslob": "1st District",
        "Santander": "1st District",
        "Samboan": "1st District",
        "Ginatilan": "1st District",
        "Malabuyoc": "1st District",
        "Alegria": "1st District",
        "Badian": "1st District",
        "Moalboal": "1st District",

        "Naga": "2nd District",
        "San_Fernando": "2nd District",
        "Minglanilla": "2nd District",
        "Talisay": "2nd District",

        "Toledo": "3rd District",
        "Pinamungajan": "3rd District",
        "Aloguinsan": "3rd District",
        "Balamban": "3rd District",
        "Asturias": "3rd District",
        "Tuburan": "3rd District",

        "Danao": "4th District",
        "Compostela": "4th District",
        "Carmen": "4th District",
        "Catmon": "4th District",
        "Sogod": "4th District",
        "Borbon": "4th District",
        "Tabogon": "4th District",
        "Bogo": "4th District",
        "San_Remigio": "4th District",
        "Medellin": "4th District",
        "Tabuelan": "4th District",
        "Tuburan": "4th District", 
        "Daanbantayan": "4th District",
        "Bantayan": "4th District",
        "Madridejos": "4th District",
        "Santa_Fe": "4th District",

        "Danao": "5th District", 
        "Carmen": "5th District",
        "Catmon": "5th District",
        "Compostela": "5th District",
        "Liloan": "5th District",
        "Consolacion": "5th District",

        "Mandaue": "6th District",
        "Consolacion": "6th District", 

        "Dumanjug": "7th District",
        "Ronda": "7th District",
        "Alcantara": "7th District",
        "Moalboal": "7th District",
        "Badian": "7th District",
        "Alegria": "7th District",
        "Malabuyoc": "7th District",
        "Ginatilan": "7th District",
        "Samboan": "7th District",
        "Santander": "7th District",
        "Boljoon": "7th District",
        "Oslob": "7th District"
    };

    const districtName = municipalityToDistrictMap[findMunicipality];
    if (!districtName) {
        return false;
    }

    return authorityDistrict.district === districtName;
    
}


//TODO: count frequency based hazard type,
export function countFrequencyOnType(inputStringType, listOfTypes) {
    const counts = Object.fromEntries(listOfTypes.map(type => [type, 0]));

    inputStringType.forEach(str => {
        if (!str) return;
        const lowerStr = str.toLowerCase();
        listOfTypes.forEach(type => {
            const lowerType = type.toLowerCase();
            if (lowerStr.includes(lowerType) || lowerStr.includes(lowerType.slice(0, -1))) {
                counts[type]++;
            }
        });
    });

     return {
        byType:  counts,
        countsOnly: listOfTypes.map(type => counts[type])
     };
}