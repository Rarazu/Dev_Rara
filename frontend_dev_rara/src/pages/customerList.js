import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import L from "leaflet";
import * as XLSX from "xlsx";  
import { saveAs } from "file-saver"; 
import AddCustomer from "./addCustomer.js";
import EditCustomer from "./editCustomer.js";

export default function CustomerList() {
    let [list, setList] = useState([]); 
    let [allCustomers, setAllCustomers] = useState([]); 
    let [cityNames, setCityNames] = useState({});
    let [selectedLocation, setSelectedLocation] = useState([-7.9667, 112.6326]);
    let [zoomLevel, setZoomLevel] = useState(15);
    let [selectedName, setSelectedName] = useState("");
    let [entriesPerPage, setEntriesPerPage] = useState(10);
    let [currentPage, setCurrentPage] = useState(1);
    let navigate = useNavigate();

    let getData = () => {
        let endpoint = `http://localhost:8000/customer`;

        axios.get(endpoint)
            .then(result => {
                setList(result.data); 
                setAllCustomers(result.data); 
            })
            .catch(error => console.log(error));
    };

    const fetchCityName = (cityId) => {
        if (cityNames[cityId]) return cityNames[cityId];

        axios.get(`http://localhost:8000/city/${cityId}`)
            .then(response => {
                setCityNames(prevState => ({
                    ...prevState,
                    [cityId]: response.data.city_name
                }));
            })
            .catch(error => console.log(error));

        return 'Loading...';
    };

    useEffect(() => {
        getData();
    }, []);

    const handleItemClick = (latitude, longitude, name_city) => {
        if (latitude && longitude) {
            setSelectedLocation([parseFloat(latitude), parseFloat(longitude)]);
            setSelectedName(name_city);
        }
    };

    const customIcon = new L.Icon({
        iconUrl: "/placeholder.png",
        iconSize: [36, 36],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    function ChangeMapView() {
        const map = useMap();
        useEffect(() => {
            map.setView(selectedLocation, zoomLevel);
        }, [selectedLocation, zoomLevel]);

        return null;
    }

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(list);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const excelFile = new Blob([excelBuffer], { bookType: "xlsx", type: "application/octet-stream" });
        saveAs(excelFile, "customer-list.xlsx");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            axios.delete(`http://localhost:8000/customer/${id}`)
                .then(response => {
                    alert(response.data.message);
                    getData(); 
                })
                .catch(error => {
                    console.error("Error deleting customer:", error);
                    alert("Failed to delete customer.");
                });
        }
    };

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = list.slice(indexOfFirstEntry, indexOfLastEntry);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        if (searchQuery === "") {
            setList(allCustomers); 
        } else {
            setList(allCustomers.filter(item =>
                item.name.toLowerCase().includes(searchQuery) ||
                item.address.toLowerCase().includes(searchQuery)
            ));
        }
    };

    return (
        <div className="container mt-4">
            <MapContainer center={selectedLocation} zoom={zoomLevel} style={{ height: "300px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={selectedLocation}
                    icon={customIcon}
                >
                    <Popup>{selectedName}</Popup>
                </Marker>
                <ChangeMapView />
            </MapContainer>

            <div className="card mt-4">
                <div className="card-header bg-dark text-white">
                    <h4 className="mx-2">Customer List</h4>
                    <div className="container mt-3 my-2">
                        <nav className="d-flex justify-content-between">
                            <div>
                                <Link to="/addCustomer" className="btn btn-primary">Add Customer</Link>
                                <button onClick={exportToExcel} className="btn btn-success ms-2">Export to Excel</button>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    onChange={handleSearch}
                                />
                            </div>
                        </nav>
                    </div>
                    <div className="d-flex justify-content-end mx-3">
                        <label className="me-2">Entries per page:</label>
                        <select
                            className="form-select w-auto"
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                            value={entriesPerPage}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntries.map((item, index) => (
                                <tr key={item.customers_id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.code}</td>
                                    <td>{item.address}</td>
                                    <td>{fetchCityName(item.city_id)}</td>
                                    <td>
                                        <button
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => handleItemClick(item.latitude, item.longitude, item.name)}
                                        >
                                            Show on Map
                                        </button>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/editCustomer/${item.customers_id}`)}>
                                          Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.customers_id)}>
                                          Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination">
                        {[...Array(Math.ceil(list.length / entriesPerPage))].map((_, index) => (
                            <li className="page-item" key={index}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
