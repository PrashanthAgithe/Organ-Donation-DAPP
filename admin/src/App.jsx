import React, { useState, useEffect } from 'react';
import { contractSigner } from './contract';
import './App.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [authorizedList, setAuthorizedList] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [removeAddress, setRemoveAddress] = useState('');
  const [owner, setOwner] = useState('');

  // Fetch authorized addresses and owner
  const fetchData = async () => {
    try {
      const addresses = await contractSigner.getAuthorized();
      setAuthorizedList(addresses);
      const ownerAddr = await contractSigner.owner();
      setOwner(ownerAddr);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    const toastId = toast.loading('Adding Authorized Address...', {
      position: 'bottom-right',
      style: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: '16px',
        borderRadius: '8px',
        padding: '12px 24px',
      },
    });
    if(newAddress===""){
      toast.update(toastId, {
        render: 'Error address field is empty',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    if (authorizedList.includes(newAddress)) {
      toast.update(toastId, {
        render: 'Address already authorized',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    try {
      const tx = await contractSigner.addAuthorized(newAddress);
      await tx.wait();
      setNewAddress('');
      fetchData();
      toast.update(toastId, {
        render: 'Address authorized successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: 'Error adding address. Make sure you are the owner.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  const handleRemove = async () => {
    const toastId = toast.loading('Removing Authorized Address...', {
      position: 'bottom-right',
      style: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: '16px',
        borderRadius: '8px',
        padding: '12px 24px',
      },
    });
    if(removeAddress===""){
      toast.update(toastId, {
        render: 'Error address field is empty',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    if (!authorizedList.includes(removeAddress)) {
      toast.update(toastId, {
        render: 'Address does not exist',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    try {
      const tx = await contractSigner.removeAuthorized(removeAddress);
      await tx.wait();
      setRemoveAddress('');
      fetchData();
      toast.update(toastId, {
        render: 'Address removed successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: 'Error adding address. Make sure you are the owner.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="main-container">
      <div style={{ padding: '2rem', fontFamily: 'Arial', width: '700px' }}>
        <h2 className="custom-heading">Authorized Access Control</h2>

        <div>
          <h3 className="custom-label">Add Authorized Address</h3>
          <input
            className="custom-input"
            type="text"
            placeholder="0x..."
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={handleAdd} className="button-79">
            Add
          </button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3 className="custom-label">Remove Authorized Address</h3>
          <input
            className="custom-input"
            type="text"
            placeholder="0x..."
            value={removeAddress}
            onChange={(e) => setRemoveAddress(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={handleRemove} className="button-79" role="button">
            Remove
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 className="custom-label">Authorized Addresses:</h3>
          <ul>
            {authorizedList.map((addr, idx) => (
              <li key={idx}>{addr}</li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
