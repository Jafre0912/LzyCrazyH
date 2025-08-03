import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../pages/MessageSender.css';
import paperclipIcon from '../assets/imgicon.png';

// ✅ Corrected API URL setup
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const MESSAGE_API_URL = `${API_BASE_URL}/api/messages`;

const MessageSender = ({ type }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [numberList, setNumberList] = useState([]);
  const [target, setTarget] = useState('all');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.activeList) {
      const formattedData = location.state.activeList.map(num => ({
        phone: `+91${num}`,
        type: type,
        status: 'Valid',
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
      }));
      setNumberList(formattedData);
    }
  }, [location.state, type]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRowSelect = (phone) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(phone)) {
      newSelectedRows.delete(phone);
    } else {
      newSelectedRows.add(phone);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSendMessage = async () => {
    const phoneNumbersOnly = (target === 'all') 
      ? numberList.map(item => item.phone.replace('+', '')) // Ensure '+' is removed for Twilio if needed
      : Array.from(selectedRows).map(phone => phone.replace('+', ''));
    
    if (phoneNumbersOnly.length === 0) {
      alert(`Please select at least one number to send a message.`);
      return;
    }
    if (!message.trim()) {
      alert('Message cannot be empty!');
      return;
    }

    const formData = new FormData();
    formData.append('message', message);
    formData.append('numbers', JSON.stringify(phoneNumbersOnly));
    if (image) {
      formData.append('image', image);
    }

    try {
      alert('Sending message(s)...');
      // ✅ Use the correct API URL
      const response = await axios.post(`${MESSAGE_API_URL}/send`, formData);
      alert(response.data.message);
    } catch (error) {
      alert('Failed to send messages. See console for details.');
      console.error(error);
    }
  };

  return (
    <div className="message-panel">
      <div className="left-panel">
        <h3>{type} <span className="count">{numberList.length}</span></h3>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Phone Number</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {numberList.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.phone)}
                    onChange={() => handleRowSelect(item.phone)}
                  />
                </td>
                <td>{item.phone}</td>
                <td>{item.type}</td>
                <td>{item.status}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="right-panel">
        <textarea
          placeholder={`Hello 👋\n\nThis is [Your Name]...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="options1">
          <div className="options">
            <div className="attach-image">
              <label htmlFor="file-upload" className="image-upload-label">
                <img src={paperclipIcon} alt="Attach" className="icon" />
                Attach Image
              </label>
              <input type="file" id="file-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>
            <label>
              <input type="checkbox" /> Schedule
            </label>
          </div>
          <div className="target-options">
            <label>Target</label>
            <div>
              <label><input type="radio" name="target" value="all" checked={target === 'all'} onChange={() => setTarget('all')} /> All</label>
              <label><input type="radio" name="target" value="selected" checked={target === 'selected'} onChange={() => setTarget('selected')} /> Selected Only</label>
            </div>
          </div>
          {imagePreview && (
            <div className="preview">
              <p>Preview:</p>
              <img src={imagePreview} alt="Preview" className="preview-image" />
            </div>
          )}
          <button className="send-button" onClick={handleSendMessage}>
            Proceed to Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageSender;