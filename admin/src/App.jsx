import React, { useState, useEffect } from 'react';
import { contractSigner } from './contract';
import './App.css'
const App = () => {
  const [authorizedList, setAuthorizedList] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [removeAddress, setRemoveAddress] = useState('');
  const [owner, setOwner] = useState('');
  // const [currentAccount, setCurrentAccount] = useState('');

  // Fetch authorized addresses and owner
  const fetchData = async () => {
    try {
      const addresses = await contractSigner.getAuthorized();
      setAuthorizedList(addresses);
      // console.log(addresses);
      const ownerAddr = await contractSigner.owner();
      setOwner(ownerAddr);

      // const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      // setCurrentAccount(accounts[0]);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if(authorizedList.includes(newAddress)){
      alert('Address already authorized');
      return;
    }
    try {
      const tx = await contractSigner.addAuthorized(newAddress);
      await tx.wait();
      setNewAddress('');
      fetchData();
      alert('Address authorized successfully');
    } catch (err) {
      alert('Error adding address. Make sure you are the owner.');
      console.error(err);
    }
  };

  const handleRemove = async () => {
    if(!authorizedList.includes(removeAddress)){
      alert('Address does not exists')
      return;
    }
    try {
      const tx = await contractSigner.removeAuthorized(removeAddress);
      await tx.wait();
      setRemoveAddress('');
      fetchData();
      alert('Address removed successfully');
    } catch (err) {
      alert('Error removing address. Make sure you are the owner.');
      console.error(err);
    }
  };

  return (
    <div className='main-container'>
    <div style={{ padding: '2rem', fontFamily: 'Arial' ,width:'700px'}}>
      <h2 className='custom-heading'>Authorized Access Control</h2>
      <div>
        <h3 className='custom-label'>Add Authorized Address</h3>
        <input className='custom-input'
          type="text"
          placeholder="0x..."
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <button onClick={handleAdd} className='button-79'>Add</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3 className='custom-label'>Remove Authorized Address</h3>
        <input className='custom-input'
          type="text"
          placeholder="0x..."
          value={removeAddress}
          onChange={(e) => setRemoveAddress(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <button onClick={handleRemove} className='button-79' role='button'>Remove</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 className='custom-label'>Authorized Addresses:</h3>
        <ul>
          {authorizedList.map((addr, idx) => (
            <li key={idx}>{addr}</li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default App;
