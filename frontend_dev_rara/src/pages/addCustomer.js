import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddCustomerPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        address: "",
        city_id: "", 
    });
    const [cityList, setCityList] = useState([]); 
    const [suggestions, setSuggestions] = useState([]); 
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/city")
            .then(response => {
                setCityList(response.data); 
            })
            .catch(error => {
                console.error("Error fetching city list:", error);
            });
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        if (name === "address" && value.length > 2) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error("Error fetching address suggestions:", error);
            }
        } else {
            setSuggestions([]); 
        }
    };

    const handleSelectAddress = (selectedAddress) => {
        setFormData((prevData) => ({
            ...prevData,
            address: selectedAddress.display_name
        }));
        setSuggestions([]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        console.log(formData);

        try {
            const response = await axios.post("http://localhost:8000/customer", formData);

            if (response.data.message === "Invalid address. Please enter a valid location.") {
                setErrorMessage("Alamat tidak valid. Silakan masukkan alamat yang benar.");
                return;
            }

            alert("Customer berhasil ditambahkan!");
            
            navigate("/");
            window.location.reload(); 

        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Terjadi kesalahan saat menambahkan customer.");
        }
    };

    return (
        <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "600px" }}>
               <div className="card-header bg-dark text-white my-2">
                    <h2 className="text-center mb-4 mt-3">Add Customer</h2>
               </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="code" className="form-label">Code</label>
                        <input
                            type="text"
                            className="form-control"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />

                        {suggestions.length > 0 && (
                            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                                {suggestions.map((item, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSelectAddress(item)}
                                    >
                                        {item.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="city_id" className="form-label">City</label>
                        <select
                            className="form-select"
                            id="city_id"
                            name="city_id"
                            value={formData.city_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a City</option>
                            {cityList.map((city) => (
                                <option key={city.city_id} value={city.city_id}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-success">Save</button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
