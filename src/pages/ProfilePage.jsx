import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPersonal, setEditingPersonal] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    mobileNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    type: "HOME",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile");
      setUserData({
        name: response.data.user.name,
        email: response.data.user.email,
        password: "************",
        mobileNo: response.data.user.mobileNo || "",
      });
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updateData = {
        name: userData.name,
        email: userData.email,
        mobileNo: userData.mobileNo,
      };
      if (userData.password !== "************") {
        updateData.password = userData.password;
      }
      await api.put("/profile", updateData);
      alert("Profile updated successfully!");
      setEditingPersonal(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address._id);
    setNewAddress({
      fullName: address.fullName,
      mobileNo: address.mobileNo,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
    });
    setShowAddressForm(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      fullName: userData.name,
      mobileNo: userData.mobileNo,
      street: "",
      city: "",
      state: "",
      pincode: "",
      type: "HOME",
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        await api.put(`/address/${editingAddress}`, newAddress);
        alert("Address updated successfully!");
      } else {
        await api.post("/address", newAddress);
        alert("Address added successfully!");
      }
      fetchUserProfile();
      setShowAddressForm(false);
      setNewAddress({ 
        fullName: "", 
        mobileNo: "", 
        street: "", 
        city: "", 
        state: "", 
        pincode: "", 
        type: "HOME" 
      });
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="section-header">
          <h2 className="profile-title">Personal Details</h2>
          <button
            className="btn-edit-profile"
            onClick={() => setEditingPersonal(!editingPersonal)}
          >
            {editingPersonal ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="form-control"
              disabled={!editingPersonal}
            />
          </div>

          <div className="form-group">
            <label>Email Id</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="form-control"
              disabled={!editingPersonal}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="form-control"
              disabled={!editingPersonal}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              value={userData.mobileNo}
              onChange={(e) =>
                setUserData({ ...userData, mobileNo: e.target.value })
              }
              className="form-control"
              disabled={!editingPersonal}
            />
          </div>

          {editingPersonal && (
            <button className="btn-save-profile" onClick={handleUpdateProfile}>
              Save Changes
            </button>
          )}
        </div>

        <div className="address-section">
          <div className="address-header">
            <h3>Address Details</h3>
            <button className="btn-add-address" onClick={handleAddNewAddress}>
              Add New Address
            </button>
          </div>

          {addresses.map((address, index) => (
            <div key={address._id} className="address-card">
              <div className="address-card-header">
                <h4>
                  {index + 1}.{address.type}
                </h4>
                <button
                  className="btn-edit"
                  onClick={() => handleEditAddress(address)}
                >
                  Edit
                </button>
              </div>

              <div className="address-details">
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={address.street}
                    readOnly
                    className="form-control"
                    rows="3"
                  />
                </div>

                <div className="address-row">
                  <div className="form-group">
                    <label>city/town</label>
                    <input
                      type="text"
                      value={address.city}
                      readOnly
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={address.state}
                      readOnly
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={address.type === "Home"}
                        readOnly
                      />
                      <span>Home</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={address.type === "Work"}
                        readOnly
                      />
                      <span>Work</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={address.type === "Other"}
                        readOnly
                      />
                      <span>Other</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddressForm && (
          <div
            className="modal-overlay"
            onClick={() => setShowAddressForm(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>

              <div className="address-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, fullName: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={newAddress.mobileNo}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, mobileNo: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="form-control"
                  rows="3"
                />
              </div>

              <div className="address-row">
                <div className="form-group">
                  <label>city/town</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="address-row">
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={newAddress.type === "HOME"}
                        onChange={() =>
                          setNewAddress({ ...newAddress, type: "HOME" })
                        }
                      />
                      <span>Home</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        checked={newAddress.type === "WORK"}
                        onChange={() =>
                          setNewAddress({ ...newAddress, type: "WORK" })
                        }
                      />
                      <span>Work</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </button>
                <button className="btn-save" onClick={handleSaveAddress}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
