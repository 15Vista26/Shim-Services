import React, { useState, useEffect } from 'react';  
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SuccessPopup from '../Components/SuccessPopup';


const BecomeServiceProviderForm = () => {
  const { currentUser,setCurrentUser } = useAuth();
  const [selectedDays, setSelectedDays] = useState([]);
  const [cities, setCities] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: '',
    country:'',
    city: '',
    pincode:'',
    address: '',
    serviceCategory: '',
    subCategories: [], // Added to store selected subcategories
    experience: '',
    languages: [],
    governmentID: '',
    termsAccepted: false,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        ...formData,
        fullName: currentUser.U_Name || '',
        email: currentUser.U_Email || '',
        phone: currentUser.U_Phone || '',
        
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:4002/cities');
        // Sort the cities in ascending order by name
        const sortedCities = response.data.sort((a, b) => a.City_Name.localeCompare(b.City_Name));
        setCities(sortedCities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
  
    fetchCities();
  }, []);
  

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const onClose = () => {
    // Navigate to homepage when Cancel is clicked
    if(setCurrentUser && currentUser){
      setCurrentUser({ ...currentUser, is_SP: 0 });
    }
    navigate('/');
  };

  const handleDaySelect = (e) => {
    const day = e.target.value;
    if (day && !selectedDays.includes(day)) {
      setSelectedDays((prevDays) => [...prevDays, day]);
    }
  };

  const handleCityChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'city') {
      // Find the selected city from the cities list
      const selectedCity = cities.find((city) => city.City_Name === value);
  
      // Update formData with the selected city's details
      setFormData((prevData) => ({
        ...prevData,
        city: value,
        pincode: selectedCity ? selectedCity.City_PIN : '', 
        state: selectedCity ? selectedCity.City_State : '', 
        country: selectedCity ? selectedCity.City_Country : 'India', 
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const removeDay = (day) => {
    setSelectedDays((prevDays) => prevDays.filter((d) => d !== day));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'serviceCategory') {
      // Reset subcategories based on selected category
      setFormData({
        ...formData,
        [name]: value,
        subCategories: categoryToSubCategories[value] || [], // Updated here
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      languages: selectedOptions.map(option => option.value),
    });
  };

  const handleSubCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData({
      ...formData,
      subCategories: checked
        ? [...formData.subCategories, value]
        : formData.subCategories.filter((item) => item !== value),
    });
  };



  const handleSubmit = async (e) => {  // Mark the function as async
    e.preventDefault();
    currentUser.is_SP=1;

    console.log('Form data submitted:', formData);
    const formDataToSend = {
      SP_Email: formData.email,
      SP_PIN: formData.pincode,
      Monday: selectedDays.includes('Monday') ? 'Available' : 'Not Available',
      Tuesday: selectedDays.includes('Tuesday') ? 'Available' : 'Not Available',
      Wednesday: selectedDays.includes('Wednesday') ? 'Available' : 'Not Available',
      Thursday: selectedDays.includes('Thursday') ? 'Available' : 'Not Available',
      Friday: selectedDays.includes('Friday') ? 'Available' : 'Not Available',
      Saturday: selectedDays.includes('Saturday') ? 'Available' : 'Not Available',
      Sunday: selectedDays.includes('Sunday') ? 'Available' : 'Not Available',
      LanguageSpoken: formData.languages.join(', '),
      GovernmentID: formData.governmentID,
      CityName: formData.city,
      State: formData.state,
      Country: 'India' // or use formData.country if you add it to your state
    };

    const serviceDataToSend = {
      SP_Email: formData.email,
      Service_Category: formData.subCategories.length > 0 ? formData.subCategories.join(', ') : formData.serviceCategory,
      Service_Name: formData.serviceCategory,
      Service_Experience: formData.experience
    };
    console.log("sp_date",serviceDataToSend);
    
    
    // Proceed with sending formDataToSend to your API
    
  
    try {
      const response = await fetch('http://localhost:4002/serviceproviders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

  
      const result = await response.json();
  
      if (response.ok) {

      console.log('Service provider added successfully:', result);


      // POST request to the second API (sp_services)
      const serviceResponse = await fetch('http://localhost:4002/sp_services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceDataToSend),
      });

      const serviceResult = await serviceResponse.json();

      if (serviceResponse.ok) {
        console.log('Service details added successfully:', serviceResult);
        setIsPopupOpen(true);
        //navigate('/');
        if (setCurrentUser && currentUser) {
          setCurrentUser({ ...currentUser, is_SP: 1 });
          // /customers/:userId
          const updateIsSP = async () => {
            try {
              const response = await axios.put(`http://localhost:4002/customers/${currentUser.U_Email}`, {
                is_SP: 1
              });
              console.log('Update successful:', response.data);
            } catch (error) {
              console.error('Error updating is_SP:', error);
            }
          };
          
          // Call the function when you need to update
          updateIsSP();
          
        }
      } else {
        console.error('Error adding service details:', serviceResult);
      }

    } else {
      console.error('Error adding service provider:', result);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

const onClosePopup = () => {
  setIsPopupOpen(false);
  // Use a timeout to ensure popup is closed before navigating
  setTimeout(() => {
    navigate('/');
  }, 500); // Add a small delay before navigating
};


  const [subCategories, setSubCategories] = useState([]); // State for subcategories

  const categoryToSubCategories = {
    'Appliance Repair': [
      'Appliance Installation', 'Appliance Servicing', 'Appliance Gas Refill',
      'Compressor Repair', 'Filter Replacement', 'Duct Cleaning',
      'Thermostat Replacement', 'Evaporator Coil Cleaning',
    ],
    'Automobile Services': [
      'Brake Repair', 'Car Detailing', 'Engine Tune-Up', 'Oil Change', 'Tire Rotation'
    ],
    'Beauty Services': [
      'Body Waxing', 'Bridal Makeup', 'Eyebrow Threading', 'Eyelash Extensions', 'Facial Treatment',
      'Hair Styling', 'Manicure/Pedicure', 'Skin Care Treatment'
    ],
    'Carpentry': [
      'Cabinet Installation', 'Custom Furniture Building', 'Deck Construction', 'Door Repair',
      'Flooring Installation', 'Furniture Repair', 'Shelving Installation', 'Trim Installation'
    ],
    'Electrical Repair': [
      'Ceiling Fan Installation', 'Electrical Safety Check Inspection', 'Fuse Box Replacement',
      'Generator Installation', 'Light Fixture Installation', 'Outlet Replacement', 'Wiring Installation'
    ],
    'Gardening Services': [
      'Garden Design', 'Hedge Trimming', 'Lawn Mowing', 'Tree Pruning', 'Weed Control'
    ],
    'House Cleaning': [
      'Bathroom Cleaning', 'Carpet Cleaning', 'Deep Cleaning', 'Kitchen Cleaning', 
      'Post-Construction Cleaning', 'Regular Cleaning', 'Window Cleaning'
    ],
    'Network Services': [
      'Network Installation', 'Network Security Audit', 'Network Troubleshooting', 'Wireless Network Setup'
    ],
    'Painting Services': [
      'Cabinet Refinishing', 'Exterior Painting', 'Interior Painting', 'Wallpaper Installation'
    ],
    'Pest Control Services': [
      'Ant Control', 'Bed Bug Extermination', 'Insect Control', 'Mosquito Treatment', 
      'Rodent Control', 'Termite Treatment'
    ],
    'Plumbing Services': [
      'Faucet Repair', 'Leak Detection', 'Pipe Repair', 'Septic Tank Cleaning', 
      'Toilet Repair', 'Water Heater Installation'
    ]
  };

  // const cities = [
  //   'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
  //   'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 
  //   'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam','Faridabad','Ludhiana','Ghaziabad','Varanasi','Meerut','Agra','Rajkot','Vadodara','Vasai-Vihar','Pimrpi-Chinchwad','Nashik','Chhindwara','Patna','Ranchi'
  // ];

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Bengali', label: 'Bengali' },
  ];

  const customStyles = {
    multiValue: (base) => ({
      ...base,
      borderRadius: '20px',
      backgroundColor: '#f0f0f0',
      margin: '2px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#333',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#e60000',
      ':hover': {
        backgroundColor: '#e60000',
        color: 'white',
      },
    }),
  };

  useEffect(() => {
    // Update subCategories when serviceCategory changes
    setSubCategories(categoryToSubCategories[formData.serviceCategory] || []);
  }, [formData.serviceCategory]);


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-serif font-bold mb-6 text-center">
        Become a Service Provider
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex items-center gap-4">
          <div className="flex-1">
    <label className="block font-medium">City</label>
    <select
      name="city"
      value={formData.city}
      onChange={handleCityChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded"
      required
    >
      <option value="">Select City</option>
      {cities.map((city) => (
        <option key={city.City_Name} value={city.City_Name}>
          {city.City_Name}
        </option>
      ))}
    </select>
  </div>

  {/* Pincode Field */}
  <div className="flex-1">
    <label className="block font-medium">Pincode</label>
    <input
      type="text"
      name="pincode"
      value={formData.pincode}
      onChange={handleChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded"
      required
    />
  </div>

</div>
  <div className="flex items-center gap-4">
  <div className="flex-1">
    <label className="block font-medium">State</label>
    <input
      type="text"
      name="state"
      value={formData.state}
      onChange={handleCityChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded"
      required
    />
  </div>
  <div className="flex-1">
    <label className="block font-medium">Country</label>
    <input
      type="text"
      name="country"
      value={formData.country}
      onChange={handleCityChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded"
      required
    />
  </div>
</div>


<div>
  <label className="block font-medium">Address</label>
  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleChange}
    className="mt-1 block w-full p-2 border border-gray-300 rounded"
    required
  />
</div>


          <div>
            <label className="block font-medium">Select Service Category</label>
            <select
              name="serviceCategory"
              value={formData.serviceCategory}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="Appliance Repair">Appliance Repair</option>
              <option value="Automobile Services">Automobile Services</option>
              <option value="Beauty Services">Beauty Services</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Electrical Repair">Electrical Repair</option>
              <option value="Gardening Services">Gardening Services</option>
              <option value="House Cleaning">House Cleaning</option>
              <option value="Network Services">Network Services</option>
              <option value="Painting Services">Painting Services</option>
              <option value="Pest Control Services">Pest Control Services</option>
              <option value="Plumbing Services">Plumbing Services</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Select Subcategories</label>
            {subCategories.length > 0 ? (
              <div>
                {subCategories.map((subCategory) => (
                  <div key={subCategory}>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={subCategory}
                        checked={formData.subCategories.includes(subCategory)}
                        onChange={handleSubCategoryChange}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{subCategory}</span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No subcategories available for this category</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Experience(in years)</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              rows="3"
              required
            />
          </div>


          <div>
            <label className="block font-medium">Languages</label>
            <Select
              isMulti
              options={languageOptions}
              value={languageOptions.filter(option => formData.languages.includes(option.value))}
              onChange={handleSelectChange}
              className="mt-1"
              styles={customStyles}
            />
          </div>

          <label className="block font-medium">Availability</label>
      {/* Dropdown for selecting days */}
      <select
        onChange={handleDaySelect}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        defaultValue=""
      >
        <option value="" disabled>
          Select a day
        </option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>

      {/* Display selected days as boxes */}
      <div className="flex flex-wrap gap-2">
        {selectedDays.map((day, index) => (
          <div
            key={index}
            className="bg-blue-200 text-black px-3 py-1 rounded-md flex items-center space-x-2"
          >
            <span>{day}</span>
            <button
              onClick={() => removeDay(day)}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

          <div>
            <label className="block font-medium">Government ID</label>
            <input
              type="text"
              name="governmentID"
              value={formData.governmentID}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
  <label className="inline-flex items-center">
    <input
      type="checkbox"  // Ensures it's a checkbox
      className="form-checkbox h-5 w-5 text-blue-600"
      required  // Makes it required
    />
    <span className="ml-2 text-gray-700">I accept the terms and conditions</span>
  </label>
</div>

          <div className="text-center flex justify-around">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
            <button
            onClick={onClose}
            className="bg-red-600  text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Cancel
          </button>
          </div>
        </div>
      </form>
      {/* Success Popup */}
      {isPopupOpen && (
      <SuccessPopup isOpen={isPopupOpen} onClose={onClosePopup} />
    )}

    </div>
  );
};

export default BecomeServiceProviderForm;

