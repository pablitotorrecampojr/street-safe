
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
    
}

export function checkLocation(fullLocationString) {
    const municipalities = municipalitiesJson;
    const districts = districtsJson;
    const normalized = fullLocationString.toLowerCase();

    let foundMunicipality= null;
    let foundDistrict= null;
    let foundBarangay = null;

    //TODO: search for municipality in the address string
    for (const [municipality, barangays] of Object.entries(municipalities)) {
        if (normalized.includes(municipality.toLowerCase())) {
            foundMunicipality = municipality;
            for (const barangay of barangays) {
                if (normalized.includes(barangay.toLowerCase())) {
                    foundBarangay = barangay;
                    break;
                }
            }
            break;
        }
    }

    //TODO: Determine district based on municipality
    if (foundMunicipality) {
        for (const [districtName, districtInfo] of Object.entries(districts)) {
            const municipalities = districtInfo.municipalities || [];
            if (municipalities.includes(foundMunicipality)) {
                foundDistrict = districtInfo.name || districtName;
                break;
            }
        }
    }

    return {
        barangay: foundBarangay || null,
        municipality: foundMunicipality || null,
        district: foundDistrict || "Unknown District",
    };
}