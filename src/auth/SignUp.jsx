
// import React, { useState } from 'react';
// import './index.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLock, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../firebase';

// const barangaysInCebu = [
//   "Apas", "Babag", "Bacayan", "Banilad", "Basak Pardo", "Basak San Nicolas", "Bonbon",
//   "Budlaan", "Bulacao", "Calamba", "Cambinocot", "Capitol Site", "Carreta", "Cogon Pardo",
//   "Cogon Ramos", "Day-as", "Duljo Fatima", "Ermita", "Guadalupe", "Guba", "Hipodromo",
//   "Inayawan", "Kalubihan", "Kamputhaw", "Kasambagan", "Kinasang-an Pardo", "Labangon",
//   "Lahug", "Lorega San Miguel", "Lusaran", "Mabolo", "Malubog", "Mambaling", "Pari-an",
//   "Pasil", "Pit-os", "Pung-ol Sibugay", "Pusok", "Punta Princesa", "Quiot Pardo",
//   "Sambag 1", "Sambag 2", "San Antonio", "San Jose", "San Nicolas Proper", "San Roque",
//   "Santa Cruz", "Sawang Calero", "Suba", "Sudlon 1", "Sudlon 2", "T. Padilla", "Talamban",
//   "Taptap", "Tejero", "Tinago", "Tisa", "Toong", "Zapatera"
// ];

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     role: '',
//     district: '',
//     barangay: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const validateForm = () => {
//     let tempErrors = {};
//     if (!formData.username) tempErrors.username = 'Username is required';
//     if (!formData.email) tempErrors.email = 'Email is required';
//     if (!formData.role) tempErrors.role = 'Role is required';
//     if (!formData.password) tempErrors.password = 'Password is required';
//     if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
//     if (formData.role === 'Authorities' && !formData.district) tempErrors.district = 'District is required';
//     if (formData.role === 'Barangay' && !formData.barangay) tempErrors.barangay = 'Barangay is required';

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       let customUsername = formData.username.toLowerCase().replace(/\s+/g, '');

//       if (formData.role === "Authorities" && formData.district) {
//         customUsername = `authD${formData.district}-${customUsername}`;
//       } else if (formData.role === "Barangay" && formData.barangay) {
//         customUsername = `brgy${formData.barangay.replace(/\s+/g, '')}-${customUsername}`;
//       } else if (formData.role === "Admin") {
//         customUsername = `ad-${customUsername}`;
//       }

//       const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
//       const user = userCredential.user;

//       await setDoc(doc(db, "users", customUsername), {
//         uid: user.uid,
//         username: customUsername,
//         email: formData.email,
//         role: formData.role,
//         district: formData.district || null,
//         barangay: formData.barangay || null,
//         createdAt: new Date(),
//       });

//       alert(`Registration successful! Your username is: ${customUsername}`);
//       navigate('/');
//     } catch (error) {
//       console.error("Error signing up:", error.message);
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="w-1/3 bg-[#242289] flex flex-col justify-center items-center text-white p-8">
//         <img src="/logo.png" alt="StreetSafe Logo" className="h-32 mb-4" />
//         <h1 className="text-3xl font-bold mb-8">SIGN UP</h1>

//         <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
//           <div className="relative">
//             <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               className="w-full p-3 pl-10 rounded-md text-black"
//               value={formData.username}
//               onChange={handleChange}
//             />
//             {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
//           </div>

//           <div className="relative">
//             <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter email address"
//               className="w-full p-3 pl-10 rounded-md text-black"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//           </div>

//           <select name='role' className="w-full p-3 rounded-md text-black" value={formData.role} onChange={handleChange}>
//             <option value="">Select Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Authorities">Authorities</option>
//             <option value="Barangay">Barangay</option>
//           </select>
//           {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

//           {formData.role === 'Authorities' && (
//             <select name="district" className="w-full p-3 rounded-md text-black" value={formData.district} onChange={handleChange}>
//               <option value="">Select District</option>
//               {[...Array(7)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>District {i + 1}</option>
//               ))}
//             </select>
//           )}

//           {formData.role === 'Barangay' && (
//             <select name="barangay" className="w-full p-3 rounded-md text-black" value={formData.barangay} onChange={handleChange}>
//               <option value="">Select Barangay</option>
//               {barangaysInCebu.map((brgy, index) => (
//                 <option key={index} value={brgy}>{brgy}</option>
//               ))}
//             </select>
//           )}
//           <div className="relative">
//           <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input type="password" name="password" placeholder="Enter password" className="w-full p-3 pl-10 rounded-md text-black" value={formData.password} onChange={handleChange} />
//           {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//           </div>

//           <input type="password" name="confirmPassword" placeholder="Confirm password" className="w-full p-3 rounded-md text-black" value={formData.confirmPassword} onChange={handleChange} />
//           {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

//           <button type="submit" className="bg-yellow-400 text-black py-2 px-14 rounded-full font-bold text-lg">Register</button>
//         </form>
//       </div>
//       <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}></div>
//     </div>
//   );
// };

// export default SignUp;










// import React, { useState } from 'react';
// import './index.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLock, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../firebase';

// const municipalities = {
//   Alcantara: ["Cabadiangan", "Cabil-isan", "Candabong", "Lawis", "Palanas", "Poblacion", "San Agustin"],
//   Alcoy: ["Atabay", "Daan-Lungsod", "Guiwang", "Nug-as", "Pasol", "Poblacion", "Pugalo", "San Agustin"],
//   Alegria: ["Ampongol", "Balaas", "Compostela", "Legaspi", "Lepanto", "Madridejos", "Montpeller", "Poblacion", "Santa Filomena", "Valencia"],
//   Aloguinsan: ["Angilan", "Bojo", "Bonbon", "Esperanza", "Kandingan", "Olango", "Poblacion", "Rosario", "Saksak", "Tampaan", "Zamora"],
//   Argao: ["Alambijud", "Anajao", "Apo", "Balaas", "Binlod", "Bogo", "Bugas", "Bulasa", "Calagasan", "Canbanua", "Casay", "Conalum", "Guiwanon", "Jampang", "Langtad", "Lapay", "Linut-od", "Mabasa", "Mandilikit", "Mompeller", "Poblacion", "Sua", "Talo-ot", "Tiguib", "Tulang", "Usmad"],
//   Asturias: ["Agtugop", "Banban", "Buli", "Kang-actol", "Looc Norte", "Looc Sur", "Lunas", "Manguiao", "Poblacion", "San Isidro", "San Roque", "Santa Lucia", "Tag-amakan"],
//   Badian: ["Banban", "Basak", "Bato", "Bugas", "Calangcang", "Candiis", "Doldol", "Malhiao", "Manduyong", "Matutinao", "Poblacion", "Santander", "Tiguib", "Zaragosa"],
//   Balamban: ["Abucayan", "Aliwanay", "Arpili", "Bayong", "Biasong", "Buanoy", "Cabagdalan", "Cambuhawe", "Cantibas", "Cansomoroy", "Ginatilan", "Hingatmonan", "Lamesa", "Liki", "Lucero", "Magsaysay", "Matun-og", "Nangka", "Pondol", "Singsing", "Sunog", "Vito"],
//   Bantayan: ["Atop-atop", "Baigad", "Binaobao", "Botigues", "Guiwanon", "Kabac", "Kangkaibe", "Lipayran", "Luyongbaybay", "Mojon", "Omagieca", "Patao", "Putian", "Sillon", "Suba"],
//   Barili: ["Bagakay", "Bolocboloc", "Boon", "Bugho", "Cagay", "Campangga", "Gunting", "Hilahilan", "Japitan", "Lupo", "Malolos", "Mantalongon", "Mayana", "Poblacion", "San Rafael", "Santa Ana", "Sayaw", "Tayong", "Tigbao"],
// };

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     role: '',
//     district: '',
//     municipality: '',
//     barangay: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (name === "municipality") {
//       setFormData({ ...formData, municipality: value, barangay: '' });
//     }
//   };

//   const validateForm = () => {
//     let tempErrors = {};
//     if (!formData.username) tempErrors.username = 'Username is required';
//     if (!formData.email) tempErrors.email = 'Email is required';
//     if (!formData.role) tempErrors.role = 'Role is required';
//     if (!formData.password) tempErrors.password = 'Password is required';
//     if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
//     if (formData.role === 'Authorities' && !formData.district) tempErrors.district = 'District is required';
//     if (formData.role === 'Barangay' && !formData.barangay) tempErrors.barangay = 'Barangay is required';

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       let customUsername = formData.username.toLowerCase().replace(/\s+/g, '');

//       if (formData.role === "Authorities" && formData.district) {
//         customUsername = `authD${formData.district}-${customUsername}`;
//       } else if (formData.role === "Barangay" && formData.barangay) {
//         customUsername = `brgy${formData.barangay.replace(/\s+/g, '')}-${customUsername}`;
//       } else if (formData.role === "Admin") {
//         customUsername = `ad-${customUsername}`;
//       }

//       const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
//       const user = userCredential.user;

//       await setDoc(doc(db, "users", customUsername), {
//         uid: user.uid,
//         username: customUsername,
//         email: formData.email,
//         role: formData.role,
//         district: formData.district || null,
//         municipality: formData.municipality || null,
//         barangay: formData.barangay || null,
//         createdAt: new Date(),
//       });

//       alert(`Registration successful! Your username is: ${customUsername}`);
//       navigate('/');
//     } catch (error) {
//       console.error("Error signing up:", error.message);
//       alert(error.message);
//     }
//   };

//   return (
    // <div className="flex h-screen">
    //   <div className="w-1/3 bg-[#242289] flex flex-col justify-center items-center text-white p-8">
    //     <img src="/logo.png" alt="StreetSafe Logo" className="h-32 mb-4" />
    //     <h1 className="text-3xl font-bold mb-8">SIGN UP</h1>

//         <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
//           <div className="relative">
//             <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               className="w-full p-3 pl-10 rounded-md text-black"
//               value={formData.username}
//               onChange={handleChange}
//             />
//             {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
//           </div>

//           <div className="relative">
//             <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter email address"
//               className="w-full p-3 pl-10 rounded-md text-black"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//           </div>

//           <select name='role' className="w-full p-3 rounded-md text-black" value={formData.role} onChange={handleChange}>
//             <option value="">Select Role</option>
//             <option value="Admin">Admin</option>
//             <option value="Authorities">Authorities</option>
//             <option value="Barangay">Barangay</option>
//           </select>
//           {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

//           {formData.role === 'Authorities' && (
//             <select name="district" className="w-full p-3 rounded-md text-black" value={formData.district} onChange={handleChange}>
//               <option value="">Select District</option>
//               {[...Array(7)].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>District {i + 1}</option>
//               ))}
//             </select>
//           )}
      

//       {formData.municipality && (
//         <select name="barangay" className="w-full p-3 rounded-md text-black" value={formData.barangay} onChange={handleChange}>
//           <option value="">Select Barangay</option>
//           {municipalities[formData.municipality].map((barangay, index) => (
//             <option key={index} value={barangay}>{barangay}</option>
//           ))}
//         </select>
//       )}
//       <select name="municipality" className="w-full p-3 rounded-md text-black" value={formData.municipality} onChange={handleChange}>
//         <option value="">Select Municipality</option>
//         {Object.keys(municipalities).map((municipality, index) => (
//           <option key={index} value={municipality}>{municipality}</option>
//         ))}
//       </select>

//           {formData.role === 'Barangay' && (
//             <select name="barangay" className="w-full p-3 rounded-md text-black" value={formData.barangay} onChange={handleChange}>
//               <option value="">Select Barangay</option>
//               {municipalities.map((brgy, index) => (
//                 <option key={index} value={brgy}>{brgy}</option>
//               ))}
//             </select>
//           )}
//           <div className="relative">
//           <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input type="password" name="password" placeholder="Enter password" className="w-full p-3 pl-10 rounded-md text-black" value={formData.password} onChange={handleChange} />
//           {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//           </div>

//           <input type="password" name="confirmPassword" placeholder="Confirm password" className="w-full p-3 rounded-md text-black" value={formData.confirmPassword} onChange={handleChange} />
//           {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

//           <button type="submit" className="bg-yellow-400 text-black py-2 px-14 rounded-full font-bold text-lg">Register</button>
//         </form>
//       </div>
//       <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}></div>
//     </div>
//   );
// };

// export default SignUp;

 







import React, { useState } from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from "../firebase";

const municipalities = {
  Alcantara: ["Cabadiangan", "Cabil-isan", "Candabong", "Lawis", "Palanas", "Poblacion", "San Agustin"],
  Alcoy: ["Atabay", "Daan-Lungsod", "Guiwang", "Nug-as", "Pasol", "Poblacion", "Pugalo", "San Agustin"],
  Alegria: ["Ampongol", "Balaas", "Compostela", "Legaspi", "Lepanto", "Madridejos", "Montpeller", "Poblacion", "Santa Filomena", "Valencia"],
  Aloguinsan: ["Angilan", "Bojo", "Bonbon", "Esperanza", "Kandingan", "Olango", "Poblacion", "Rosario", "Saksak", "Tampaan", "Zamora"],
  Argao: ["Alambijud", "Anajao", "Apo", "Balaas", "Binlod", "Bogo", "Bugas", "Bulasa", "Calagasan", "Canbanua", "Casay", "Conalum", "Guiwanon", "Jampang", "Langtad", "Lapay", "Linut-od", "Mabasa", "Mandilikit", "Mompeller", "Poblacion", "Sua", "Talo-ot", "Tiguib", "Tulang", "Usmad"],
  Asturias: ["Agtugop", "Bago", "Bairan", "Banban", "Baye", "Bog-o", "Buli", "Kaluangan", "Kambayog", "Kan-ipa", "Lanao", "Langub", "Looc Norte", "Looc Sur", "Lunas", "Magcalape", "Manguiao", "New Bago", "Owak", "Poblacion", "Saksak", "San Isidro", "San Roque", "Santa Lucia", "Tag-amakan", "Tubigagmanok"],
  Badian: ["Banhigan", "Basak", "Basiao", "Bato", "Bugas", "Calangcang", "Candiis", "Doldol", "Ginablan", "Lambug", "Malabago", "Malhiao", "Manduyong", "Matutinao", "Patong", "Poblacion", "Santicon", "Sohoton", "Talayong", "Tiguib", "Tingko", "Tupas"],
  Balamban: ["Abucayan", "Aliwanay", "Arpili", "Baliwagan", "Bayong", "Biasong", "Buanoy", "Cabagdalan", "Cambuhawe", "Cantuod", "Cantu-od", "Gaas", "Ginatilan", "Hingatmonan", "Lamesa", "Liki", "Lupo", "Magsaysay", "Matun-og", "Nangka", "Pondol", "Prenza", "Santa Cruz", "Singsing", "Sumon", "Sunog", "Vito"],
  Bantayan: ["Atop-atop", "Baigad", "Binaobao", "Botigues", "Cabacongan", "Kabangi", "Cabayugan", "Guiwanon", "Lipayran", "Madridejos", "Maalat", "Omagieca", "Poblacion", "Sillon", "Suba", "Sulangan", "Tami-ao", "Ticad"],
  Barili: ["Bagakay", "Bolocboloc", "Bugtong Kawayan", "Cadamitan", "Campangga", "Can-aban", "Cawayan", "Dakitan", "Guintabo-an", "Gunting", "Hilasgasan", "Japitan", "Luhod", "Mantayupan", "Mantalongon", "Mayana", "Nangka", "Pitalo", "Poblacion", "San Rafael", "Santa Ana", "Santa Lucia", "Sibonga", "Talaga", "Tayasan"],
  Boljoon: ["Arbor", "Balian", "El Pardo", "Granada", "Lunop", "Lower Becerril", "Nangka", "Poblacion", "San Antonio", "San Isidro", "San Miguel", "Upper Becerril"],
  Bogo: [
    "Anonang Norte", "Anonang Sur", "Banban", "Binabag", "Cayang", "Cogon", "Dakit",
    "Gairan", "Guadalupe", "La Paz", "Lapaz", "Libertad", "Libaong", "Malingin",
    "Maria Rosario", "Marangog", "Nailon", "Pandan", "Polambato", "San Vicente",
    "Santo Rosario", "Siocon", "Sudlonon", "Taytayan"
  ],
  Borbon: ["Bagacay", "Bagtic", "Bangka", "Bili", "Bongdo", "Bongoyan", "Cadaruhan", "Calambua", "Cambang-ug", "Can-ambay", "Clavera", "Dakit", "Duyan", "Gabi", "Ginatilan", "Lalay", "Liki", "Luan-luan", "Poblacion", "Sagay", "San Jose", "San Juan", "San Vicente", "Tabunan", "Tagnucan"],
  Carmen: ["Baring", "Cogon East", "Cogon West", "Corte", "Duwangon", "Hagnaya", "Ilihan", "Luyang", "Lower Natimao-an", "Poblacion", "Triumfo", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao-an", "Upper Natimao"],
  Carcar: [
    "Bolocboloc", "Buenavista", "Calidngan", "Can-asujan", "Guadalupe", "Liburon",
    "Napo", "Ocana", "Perrelos", "Poblacion I", "Poblacion II", "Poblacion III",
    "Poblacion IV", "Poblacion V", "Poblacion VI", "Poblacion VII", "Tuyom",
    "Valencia", "Valladolid"
  ],
  Catmon: ["Agsuwao", "Amancion", "Anapog", "Bactas", "Binongkalan", "Buenavista", "Cabunga-an", "Cambangkaya", "Can-ibuang", "Catmondaan", "Duyan", "Flores", "Ginabasan", "Macaas", "Poblacion", "Tabili", "Tinabyonan"],
  Cebu_City: [
    "Adlaon", "Agsungot", "Apas", "Babag", "Bacayan", "Banilad", "Basak Pardo",
    "Basak San Nicolas", "Binaliw", "Bonbon", "Budlaan", "Buhisan", "Bulacao", 
    "Buot", "Busay", "Calamba", "Cambinocot", "Capitol Site", "Carreta",
    "Cogon Pardo", "Duljo-Fatima", "Ermita", "Guadalupe", "Guba", "Hipodromo",
    "Inayawan", "Kalunasan", "Kamagayan", "Kasambagan", "Kinasang-an Pardo",
    "Labangon", "Lahug", "Lorega San Miguel", "Lusaran", "Mabini", "Mabolo",
    "Malubog", "Mambaling", "Pahina Central", "Pahina San Nicolas", "Pardo",
    "Parian", "Pit-os", "Pulangbato", "Pung-ol Sibugay", "Quiot", "Sambag I",
    "Sambag II", "San Antonio", "San Jose", "San Nicolas Proper", "San Roque",
    "Santa Cruz", "Santo Niño", "Sapangdaku", "Sawang Calero", "Sinsin", 
    "Suba", "Sudlon I", "Sudlon II", "T. Padilla", "Tabunan", "Tagbao", 
    "Talamban", "Taptap", "Tejero", "Tinago", "To-ong", "Zapatera"
  ],
  Compostela: ["Bagalnga", "Basak", "Buluang", "Cabadiangan", "Cambayog", "Canamucan", "Cogon", "Dapdap", "Estaca", "Lupa", "Magay", "Mulao", "Panangban", "Poblacion", "Tag-ube", "Tamiao"],
  Consolacion: ["Cabangahan", "Cabasagan", "Canao-an", "Casili", "Danglag", "Garing", "Jugan", "Lanipga", "Lamac", "Lapay", "Polog", "Pulpogan", "Poblacion Occidental", "Poblacion Oriental", "Sacsac", "Tayud", "Tilha-ong", "Tolotolo"],
  Cordova: ["Alegria", "Bangbang", "Buagsong", "Catarman", "Cogon", "Day-as", "Gabi", "Gilutongan", "Ibabao", "Pilipog", "Poblacion", "San Miguel"],
  Danao: ["Baliang", "Binaliw", "Cabungahan", "Cagat", "Cahumayan", "Cambubho", "Cambuhawe", "Cogon-Cruz", "Danasan", "Guimbawian", "Kantangkas", "Langub", "Licos", "Looc", "Magtagobtob", "Magtubog", "Mantalongon", "Masaba", "Matun-og", "Nangka", "Panadtaran", "Poblacion", "Quisol", "Rizal", "Sabang", "Sacsac", "San Roque", "Santa Rosa", "Santo Niño", "Santican", "Sibacan", "Tabok", "Tag-ubi", "Taytay", "Tuburan", "Tuburan Sur", "Tuburan Norte", "Tungkop", "Tuyom", "Ubujan"],
  Daanbantayan: ["Agujo", "Bagay", "Bakhawan", "Bitoon", "Carnaza", "Dalingding", "Dalingding Sur", "Lanao", "Lungos", "Macaas", "Malbago", "Malingin", "Maya", "Pajo", "Poblacion", "Tapilon", "Tinubdan", "Tominjao"],
  Dalaguete: ["Balud", "Banhigan", "Batikala", "Caliongan", "Cawayan", "Cawayan East", "Corro", "Dalinaw", "Dawis", "Garbosa", "Lanao", "Lumbang", "Mantalongon", "Manlapay", "Mantalongon Proper", "Obong", "Poblacion", "Tabon", "Tapon"],
  Dumanjug: ["Bitoon", "Bulatukan", "Bullogan", "Cambuhawe", "Candabong", "Cantabugon", "Cogon", "Kabalaasnan", "Kang-actol", "Kanghalo", "Kangwayan", "Lambug", "Maalat", "Manlapay", "Matutinao", "Panlaan", "Poblacion", "Tapon", "Tubod", "Zaragosa"],
  Ginatilan: ["Anao", "Bonbon", "Calabawan", "Cañorong", "Guiwanon", "Looc", "Malatbo", "Palaka", "Poblacion", "San Roque"],
  LapuLapu: [
    "Agus", "Babag", "Bankal", "Baring", "Basak", "Buaya", "Calawisan", "Canjulao",
    "Caw-oy", "Cawhagan", "Gun-ob", "Ibo", "Looc", "Mactan", "Maribago", "Marigondon",
    "Pajac", "Pajo", "Pangan-an", "Poblacion", "Pusok", "Sabang", "San Vicente",
    "Santa Rosa", "Subabasbas", "Talima", "Tingo"
  ],
  Liloan: ["Cabadiangan", "Calero", "Catarman", "Cotcot", "Jubay", "Lataban", "Mulao", "Poblacion", "San Roque", "San Vicente", "Santa Cruz", "Tayud", "Yati"],
  Mandaue: [
    "Alang-alang", "Bakilid", "Banilad", "Basak", "Cabancalan", "Cambaro", "Canduman",
    "Casili", "Centro", "Cubacub", "Guizo", "Ibabao-Estancia", "Jagobiao", "Labogon",
    "Looc", "Maguikay", "Mantuyong", "Opao", "Pakna-an", "Pagsabungan", "Subangdaku",
    "Tabok", "Tawason", "Tingub", "Tipolo", "Umapad"
  ],
  Madridejos: ["Bunakan", "Kangwayan", "Kaongkod", "Maalat", "Malbago", "Poblacion", "San Agustin", "Talangnan", "Tarong", "Tugas"],
  Malabuyoc: ["Aranzana", "Balikmaya", "Biasong", "Bonbon", "Cansayahon", "Looc", "Mahanlud", "Mindanao", "Poblacion", "Salmeron"],
  Medellin: ["Antipolo", "Caputatan Norte", "Caputatan Sur", "Curva", "Daanlungsod", "Dayhagon", "Don Virgilio Gonzales", "Kawit", "Lamintak Norte", "Lamintak Sur", "Luy-a", "Mahawak", "Maharuhay", "Poblacion", "Tindog", "Tominjao"],
  Minglanilla: ["Cabadiangan", "Calajo-an", "Camp 7", "Cuanos", "Guindaruhan", "Linao", "Manduwang", "Pakigne", "Poblacion Ward 1", "Poblacion Ward 2", "Poblacion Ward 3", "Poblacion Ward 4", "Tulay", "Tungkop", "Tubod"],
  Moalboal: ["Agbalanga", "Bala", "Basdiot", "Bugho", "Busay", "Lanao", "Poblacion East", "Poblacion West", "Saavedra", "Tomonoy", "Tuble"],
  Naga: [
    "Balirong", "Cantao-an", "Central Poblacion", "Cogon", "Colon", "East Poblacion",
    "Inayagan", "Inoburan", "Jagobiao", "Langtad", "Lutac", "Mainit", "North Poblacion",
    "Patag", "South Poblacion", "Tinaan", "Tungkop", "Uling", "West Poblacion"
  ],
  Oslob: ["Alo", "Caloon", "Canangca-an", "Cancawas", "Canjaway", "Cansaloay", "Daanlungsod", "Hagdan", "Looc", "Luka", "Mainit", "Nueva Caceres", "Poblacion", "Tan-awan", "Tumalog"],
  Pilar: ["Bagakay", "Cagcagan", "Cansuhay", "Dapdap", "Esperanza", "Lanao", "Montaña", "Moabog", "Poblacion", "San Isidro", "San Vicente", "Suba", "Umak"],
  Pinamungajan: ["Anislag", "Basak", "Binabag", "Busay", "Butong", "Cabiangon", "Camugao", "Da-an Lungsod", "Duangan", "Lamac", "Lut-od", "Mangoto", "Opao", "Poblacion", "Sacsac", "Sibago", "Tangub", "Tajao", "Tutay"],
  Poro: ["Adela", "Cagcagan", "Cansabusab", "Cantucong", "Daan Paz", "Esperanza", "Libertad", "Macapaya", "Mercedes", "Poblacion", "Punay", "Rizal", "Santo Niño", "San Jose", "Santa Rita", "Sohoton", "Sumon"],
  Ronda: ["Ilaya", "Langin", "Libo", "Malalay", "Palanas", "Poblacion", "Santa Cruz", "Tampaan"],
  Samboan: ["Banlot", "Basak", "Bonbon", "Bulangsuran", "Calatagan", "Cambigong", "Canorong", "Colase", "Javier", "Poblacion", "San Sebastian", "Santa Monica", "Suba"],
  San_Fernando: ["Balud", "Balungag", "Basak", "Bugho", "Cabatbatan", "Greenhills", "Ilaya", "Lantawan", "Liburon", "Magsico", "North Poblacion", "Panadtaran", "San Isidro", "South Poblacion", "Tabionan", "Tananas", "Tonggo", "Tubod", "Tulay"],
  San_Francisco: ["Cabunga-an", "Cagcagan", "Campo", "Consuelo", "Esperanza", "Himarco", "Northern Poblacion", "San Isidro", "Santa Cruz", "Santiago", "Sonog", "Southern Poblacion", "Union", "Western Poblacion"],
  San_Remigio: ["Argawanon", "Bagtic", "Bancasan", "Batad", "Busogon", "Calambua", "Cambanog", "Canagahan", "Dapdap", "Gawaygaway", "Hagnaya", "Kilawan", "Lambusan", "Lawis", "Looc", "Luyang", "Poblacion", "Punta", "San Miguel", "Tacup"],
  Santa_Fe: ["Balidbid", "Hagnaya", "Hilantagaan", "Kinatarkan", "Langub", "Maricaban", "Okoy", "Poblacion", "Pooc", "Talisay"],
  Santander: ["Bongi", "Cabutongan", "Canlumacad", "Candamiang", "Liloan", "Lip-tong", "Looc", "Pasil", "Poblacion", "Talisay"],
  Sibonga: ["Abugon", "Bagacay", "Bahay", "Banlot", "Basak", "Bato", "Bugho", "Buli", "Candaguit", "Dugyan", "Guimbangco-an", "Lagunao", "Lipayran", "Lutac", "Magcagong", "Manatad", "Papan", "Poblacion", "Sabang", "San Isidro", "Simala", "Taytayan"],
  Sogod: ["Ampongol", "Bagatayam", "Bawo", "Cabalawan", "Calumboyan", "Damolog", "Ibabao", "Liki", "Luyang", "Magsuhot", "Mohon", "Nahus-an", "Pansoy", "Poblacion", "Tabunok"],
  Tabogon: ["Aroma", "Bagatayam", "Caduawan", "Camoboan", "Canlumacad", "Daan Lungsod", "Kal-anan", "Libjo", "Loong", "Manlagtang", "Maslog", "Pio", "Salag", "San Isidro", "Santo Niño", "Somosa", "Tabunok", "Taytayan"],
  Tabuelan: ["Bongon", "Bunakan", "Kanluhangon", "Kanlim-ao", "Kantubaon", "Libo", "Mabunao", "Maravilla", "Olivo", "Poblacion", "Tabunok"],
  Talisay: ["Biasong", "Bulacao", "Camp IV", "Cansojong", "Dumlog", "Jaclupan", "Lagtang", "Lawaan I", "Lawaan II", "Lawaan III", "Linao", "Maghaway", "Manipis", "Mohon", "Poblacion", "Pooc", "San Isidro", "San Roque", "Tabunok", "Tangke", "Tapul"],
  Toledo: ["Awihao", "Bagakay", "Bato", "Biga", "Bulongan", "Cabitoonan", "Calongcalong", "Canlumampao", "Cantabaco", "Capitan Claudio", "Carmen", "Daan Lungsod", "Don Andres Soriano", "Dumlog", "General Climaco", "Ibo", "Ilihan", "Landahan", "Luray II", "Magdugo", "Manguiao", "Media Once", "Poblacion", "Poog", "Putingbato", "Sagay", "Sam-ang", "Sangi", "Subayon", "Tungkay", "Tubod", "Tungkay", "Tubod", "Ubogon"],
  Tuburan: [
    "Alegria", "Amatugan", "Antipolo", "Apalan", "Bagasawe", "Bakyawan", "Bangkito",
    "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", 
    "Barangay VI", "Barangay VII", "Barangay VIII", "Bulwang", "Caridad", "Carmelo",
    "Cogon", "Colonia", "Daan Lungsod", "Fortaliza", "Ga-ang", "Gimama-a", "Jagbuaya",
    "Kabangkalan", "Kabkaban", "Kagba-o", "Kalangahan", "Kamansi", "Kampoot", "Kan-an",
    "Kanlunsing", "Kansi", "Kaorasan", "Libo", "Lusong", "Macupa", "Mag-alwa", "Mag-antoy",
    "Mag-atubang", "Maghan-ay", "Mangga", "Marmol", "Molobolo", "Montealegre", "Putat",
    "San Juan", "Sandayong", "Santo Niño", "Siotes", "Sumon", "Tominjao", "Tomugpa"
  ]


};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    district: "",
    municipality: "",
    barangay: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });

  //   if (name === "municipality") {
  //     setFormData({ ...formData, municipality: value, barangay: "" });
  //   }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
  
      // Reset fields when switching roles
      if (name === "role") {
        updatedData = {
          ...updatedData,
          district: value === "Authorities" ? prevData.district : "",
          municipality: value === "Municipalities" ? prevData.municipality : "",
          barangay: value === "Municipalities" ? prevData.barangay : "",
        };
      }
  
      // Reset barangay if municipality changes
      if (name === "municipality") {
        updatedData.barangay = "";
      }
  
      return updatedData;
    });
  };
  



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      let customUsername = formData.username.toLowerCase().replace(/\s+/g, '');
  
      if (formData.role === "Authorities" && formData.district) {
        customUsername = `authD${formData.district}-${customUsername}`;
      } else if (formData.role === "Barangay" && formData.barangay) {
        customUsername = `brgy${formData.barangay.replace(/\s+/g, '')}-${customUsername}`;
      } else if (formData.role === "Admin") {
        customUsername = `ad-${customUsername}`;
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", customUsername), {
        uid: user.uid,
        username: customUsername,
        email: formData.email,
        role: formData.role,
        district: formData.district || null,
        municipality: formData.municipality || null,
        barangay: formData.barangay || null,
        createdAt: new Date(),
      });
  
      alert(`Registration successful! Your username is: ${customUsername}`);
      navigate('/');
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };
  

  return (
    <div className="flex h-screen">
    <div className="w-1/3 bg-[#242289] flex flex-col justify-center items-center text-white p-8">
      <img src="/logo.png" alt="StreetSafe Logo" className="h-32 mb-4" />
      <h1 className="text-3xl font-bold mb-8">SIGN UP</h1>
        <form className="w-full max-w-sm items-center space-y-4" onSubmit={handleSubmit}>
           <div className="relative">
             <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-3 pl-10 rounded-md text-black"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div className="relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              className="w-full p-3 pl-10 rounded-md text-black"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <select name="role" className="w-full p-3 rounded-md text-black" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Authorities">Authorities</option>
            <option value="Municipalities">Municipalities</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

          {formData.role === "Authorities" && (
            <select name="district" className="w-full p-3 rounded-md text-black" value={formData.district} onChange={handleChange}>
              <option value="">Select District</option>
              {[...Array(7)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  District {i + 1}
                </option>
              ))}
            </select>
          )}

          {formData.role === "Municipalities" && (
            <select name="municipality" className="w-full p-3 rounded-md text-black" value={formData.municipality} onChange={handleChange}>
              <option value="">Select Municipality</option>
              {Object.keys(municipalities).map((municipality, index) => (
                <option key={index} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          )}

          {formData.municipality && (
            <select name="barangay" className="w-full p-3 rounded-md text-black" value={formData.barangay} onChange={handleChange}>
              <option value="">Select Barangay</option>
              {municipalities[formData.municipality].map((barangay, index) => (
                <option key={index} value={barangay}>
                  {barangay}
                </option>
              ))}
            </select>
          )}

        <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="password" name="password" placeholder="Enter password" className="w-full p-3 pl-10 rounded-md text-black" value={formData.password} onChange={handleChange} />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>


                  <div className="relative"> 
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="password" name="confirmPassword" placeholder="Confirm password" className="w-full p-3 pl-10 rounded-md text-black" value={formData.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                  </div>
                  

                  <button type="submit" className="bg-yellow-400 text-black py-2 px-14 rounded-full font-bold text-lg">
            Register
          </button>
        </form>
      </div>
      <div className="w-2/3 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }}></div>
    </div>
  );
};

export default SignUp;
