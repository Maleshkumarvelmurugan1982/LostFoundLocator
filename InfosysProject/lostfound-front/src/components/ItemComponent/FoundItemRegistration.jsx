import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveFoundItem } from "../../services/FoundItemService";
import "./found.css"; // ✅ external CSS

const FoundItemRegistration = () => {
  const navigate = useNavigate();

  const [foundItem, setFoundItem] = useState({
    itemName: "",
    brand: "",
    category: "",
    description: "",
    location: "",
    date: "",
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    if (name === "imageFile") {
      const file = event.target.files[0];
      setFoundItem(values => ({ ...values, imageFile: file }));
      setFileName(file ? file.name : "");
    } else {
      setFoundItem(values => ({ ...values, [name]: event.target.value }));
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!foundItem.itemName.trim()) { tempErrors.itemName = "Item name is required"; isValid = false; }
    if (!foundItem.brand.trim()) { tempErrors.brand = "Brand is required"; isValid = false; }
    if (!foundItem.location.trim()) { tempErrors.location = "Location is required"; isValid = false; }
    if (!foundItem.date.trim()) { tempErrors.date = "Date is required"; isValid = false; }
    if (!foundItem.imageFile) { tempErrors.imageFile = "Please upload an image"; isValid = false; }

    setErrors(tempErrors);
    if (isValid) { createFoundItem(); }
  };

  const createFoundItem = () => {
    saveFoundItem(foundItem)
      .then(() => {
        setSuccess(true);
        handleReset();
      })
      .catch(() => alert("Error saving found item"));
  };

  const handleReset = () => {
    setFoundItem({ itemName: "", brand: "", category: "", description: "", location: "", date: "", imageFile: null });
    setFileName("");
    setErrors({});
  };

  const ip = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" };

  return (
    <>
      {/* Background layers */}
      <div className="fir-bg" />
      <div className="fir-overlay" />
      <div className="fir-noise" />

      <div className="fir-page">

        {/* HEADER */}
        <div className="fir-header">
          <div className="fir-header-left">
            <div className="fir-eyebrow">
              <div className="fir-eyebrow-line" />
              <span className="fir-eyebrow-text">Found Item Portal</span>
            </div>
            <h1 className="fir-title">Report <em>Found</em> Item</h1>
            <p className="fir-subtitle">Help someone find what they've lost. Report it here.</p>
          </div>
          <button className="fir-back-btn" type="button" onClick={() => navigate("/student-menu")}>
            <svg {...ip}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* MAIN */}
        <div className="fir-container">
          {!success ? (
            <div className="fir-form-card">
              <div className="fir-card-accent" />
              <div className="fir-card-body">
                <form onSubmit={handleValidation}>

                  <div className="fir-form-row">
                    <div className="fir-form-group">
                      <label className="fir-label">Item Name <span className="required">*</span></label>
                      <input type="text" className="fir-input" name="itemName"
                        placeholder="e.g., Laptop, Keys, Phone"
                        value={foundItem.itemName} onChange={onChangeHandler} />
                      {errors.itemName && <p className="fir-error">{errors.itemName}</p>}
                    </div>

                    <div className="fir-form-group">
                      <label className="fir-label">Brand <span className="required">*</span></label>
                      <input type="text" className="fir-input" name="brand"
                        placeholder="e.g., Apple, Samsung, Dell"
                        value={foundItem.brand} onChange={onChangeHandler} />
                      {errors.brand && <p className="fir-error">{errors.brand}</p>}
                    </div>
                  </div>

                  <div className="fir-form-row">
                    <div className="fir-form-group">
                      <label className="fir-label">Category</label>
                      <select className="fir-select" name="category"
                        value={foundItem.category} onChange={onChangeHandler}>
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Documents">Documents</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="fir-form-group">
                      <label className="fir-label">Date Found <span className="required">*</span></label>
                      <input type="date" className="fir-input" name="date"
                        value={foundItem.date} onChange={onChangeHandler} />
                      {errors.date && <p className="fir-error">{errors.date}</p>}
                    </div>
                  </div>

                  <div className="fir-form-group">
                    <label className="fir-label">Location <span className="required">*</span></label>
                    <input type="text" className="fir-input" name="location"
                      placeholder="Where did you find the item?"
                      value={foundItem.location} onChange={onChangeHandler} />
                    {errors.location && <p className="fir-error">{errors.location}</p>}
                  </div>

                  <div className="fir-form-group">
                    <label className="fir-label">Description</label>
                    <textarea className="fir-textarea" name="description"
                      placeholder="Provide details..."
                      value={foundItem.description} onChange={onChangeHandler} />
                  </div>

                  <div className="fir-divider" />

                  <div className="fir-form-group">
                    <label className="fir-label">Upload Image <span className="required">*</span></label>
                    <input type="file" className="fir-file-input" name="imageFile"
                      accept="image/*" onChange={onChangeHandler} />
                    {fileName && <p className="fir-file-name">{fileName}</p>}
                    {errors.imageFile && <p className="fir-error">{errors.imageFile}</p>}
                  </div>

                  <div className="fir-button-group">
                    <button type="reset" className="fir-btn fir-btn-reset" onClick={handleReset}>
                      Reset
                    </button>
                    <button type="submit" className="fir-btn fir-btn-submit">
                      Submit Report
                    </button>
                  </div>

                </form>
              </div>
            </div>
          ) : (
            <div className="fir-success-card">
              <div className="fir-success-accent" />
              <div className="fir-success-body">
                <h3 className="fir-success-title">Found Item Registered!</h3>
                <p className="fir-success-text">
                  Your found item has been posted successfully.
                </p>
                <div className="fir-success-actions">
                  <button className="fir-btn fir-btn-another" onClick={() => setSuccess(false)}>
                    Submit Another
                  </button>
                  <button className="fir-btn fir-btn-back-success" onClick={() => navigate("/student-menu")}>
                    Back to Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FoundItemRegistration;
