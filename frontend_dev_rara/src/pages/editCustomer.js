import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditCustomerPage() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [address, setAddress] = useState("");
    const [city_id, setCityId] = useState("");
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

    useEffect(() => {
        console.log("Customer ID from URL:", id);
        if (id) {
            axios.get(`http://localhost:8000/customer/${id}`)
                .then(response => {
                    console.log("Data customer:", response.data);
                    const customer = response.data;
                    setName(customer.name);
                    setCode(customer.code);
                    setAddress(customer.address);
                    setCityId(customer.city_id);
                })
                .catch(error => {
                    console.error("Error fetching customer data:", error);
                    setErrorMessage("Terjadi kesalahan saat memuat data customer.");
                });
        }
    }, [id]);
    

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "name") {
            setName(value);
        } else if (name === "code") {
            setCode(value);
        } else if (name === "address") {
            setAddress(value);

            if (value.length > 2) {
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
        } else if (name === "city_id") {
            setCityId(value);
        }
    };

    const handleSelectAddress = (selectedAddress) => {
        setAddress(selectedAddress.display_name);
        setSuggestions([]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.put(`http://localhost:8000/customer/${id}`, {
                name,
                code,
                address,
                city_id,
            });

            if (response.data.message === "Invalid address. Please enter a valid location.") {
                setErrorMessage("Alamat tidak valid. Silakan masukkan alamat yang benar.");
                return;
            }

            alert("Customer berhasil diperbarui!");
            navigate("/");

        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Terjadi kesalahan saat memperbarui customer.");
        }
    };

    return (
        <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "600px" }}>
                <div className="card-header bg-dark text-white my-2">
                    <h2 className="text-center mb-4 mt-3">Edit Customer</h2>
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
                            value={name}
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
                            value={code}
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
                            value={address}
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
                            value={city_id}
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
