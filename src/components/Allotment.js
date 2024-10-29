import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from './server';

const Allotment = () => {
  const [allotments, setAllotments] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', bookId: '', startDate: '', endDate: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingAllotmentId, setEditingAllotmentId] = useState(null);
  

  const fetchAllotments = async () => {
    // const response = await axios.get('http://localhost:5000/allotments' );
    const response = await axios.get(`${server}/allotments`);
    setAllotments(response?.data);
  };

  const fetchStudents = async () => {
    // const response = await axios.get('http://localhost:5000/students');
    const response = await axios.get(`${server}/students` );
    setStudents(response?.data);
  };

  const fetchBooks = async () => {
    // const response = await axios.get('http://localhost:5000/books'); 
    const response = await axios.get(`${server}/books`); 
    
    setBooks(response.data);
  };

  useEffect(() => {
    fetchAllotments();
    fetchStudents();
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // await axios.put(`http://localhost:5000/allotments/${editingAllotmentId}`, formData);
        await axios.put(`${server}/allotments/${editingAllotmentId}`, formData);
        setIsEditing(false);
        setEditingAllotmentId(null);
      } else {
        // await axios.post('http://localhost:5000/allotments', formData);
        await axios.post(`${server}/allotments`, formData);
      }

      // Reset form
      setFormData({ studentId: '', bookId: '', startDate: '', endDate: '' });
      fetchAllotments();
    } catch (err) {
      console.error("Error uploading allotment data", err);
    }
  };

  const handleEdit = (allotment) => {
    setFormData({
      studentId: allotment?.studentId?._id,  
      bookId: allotment?.bookId?._id,        
      startDate: allotment?.startDate?.split('T')[0],
      endDate: allotment?.endDate?.split('T')[0]
    });
    setIsEditing(true);
    setEditingAllotmentId(allotment?._id);
  };

  const handleDelete = async (id) => {
    // await axios.delete(`http://localhost:5000/allotments/${id}`);
    await axios.delete(`${server}/allotments/${id}`);
    fetchAllotments();
  };

  

  return (
    <div>
      <h2>Book Allotment Management</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <select name="studentId" value={formData.studentId} onChange={handleChange} className="form-control my-2">
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student?._id} value={student?._id}>{student?.name}</option>
          ))}
        </select>

        <select name="bookId" value={formData.bookId} onChange={handleChange} className="form-control my-2">
          <option value="">Select Book</option>
          {books.map(book => (
            <option key={book?._id} value={book?._id}>{book?.name}</option>
          ))}
        </select>

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="form-control my-2"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="form-control my-2"
        />
        <button type="submit" className="btn btn-primary mr-2">
          {isEditing ? 'Update Allotment' : 'Add Allotment'}
        </button>
      </form>

      <table className="table table-bordered table-hover mt-3">
        <thead>
          <tr>
            <th>Student</th>
            <th>Book</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allotments.map(allotment => (
            <tr key={allotment?._id}>
              <td>{allotment?.studentId.name}</td> 
              <td>{allotment?.bookId?.name}</td> 
              <td>{new Date(allotment?.startDate).toISOString().split("T")[0]}</td>
              <td>{new Date(allotment?.endDate).toISOString().split("T")[0]}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(allotment)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(allotment?._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Allotment;
