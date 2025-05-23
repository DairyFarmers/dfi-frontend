import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AddInventoryForm from '../forms/AddInventoryForm';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../api/axios';
import { inventory_add_path } from '../../api/config';
import Toast from '../ui/Toast';

const AddInventoryItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [operationStatus, setOperationStatus] = useState(false);
  const [operationStatusMsg, setOperationStatusMsg] = useState('');

  const addInventoryItem = async (item) => {
      try {
        const response = await axiosPrivate.post(inventory_add_path, {
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price
        });
  
        if (response.status === 201) {
          setOperationStatus(true);
          setOperationStatusMsg('Item added successfully');
        } else {
          setOperationStatusMsg('Failed to add item. Please try again');
        }
      } catch (error) {
          navigate("/error", { replace: true });
      }
  };

  return (
    <div className="container mt-5">
      {operationStatus && (
        <Toast message={operationStatusMsg} type="success" onClose={() => setOperationStatus(false)} />
      )}
      <AddInventoryForm onAddItem={addInventoryItem} />
    </div>
  );
};

export default AddInventoryItem;