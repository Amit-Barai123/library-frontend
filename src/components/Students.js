import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { server } from './server';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    class: '',
    photo: null,
    video: null,
  });

  // Refs for file inputs to allow clearing files
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const response = await axios.get(`${server}/students` );
    setStudents(response.data);
    console.log(`The students data is ${JSON.stringify(response.data)}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('class', formData.class);
    if (formData.photo) form.append('photo', formData.photo);
    if (formData.video) form.append('video', formData.video);

    try {
      if (isEditing) {
        // await axios.put(`http://localhost:5000/students/${editingId}`, form);
        await axios.put(`${server}/students/${editingId}`, form);
        setIsEditing(false);
        setEditingId(null);
      } else {
        // await axios.post('http://localhost:5000/students' , form);
        await axios.post(`${server}/students` , form);
        
      }
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error('Error uploading student data:', error.response || error.message);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      class: student.class,
      photo: student.photo,
      video: student.video,
    });
    setIsEditing(true);
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    // await axios.delete(`http://localhost:5000/students/${id}`);
    await axios.delete(`${server}/students/${id}`);
    fetchStudents();
  };

  const resetForm = () => {
    setFormData({ name: '', class: '', photo: null, video: null });
    setIsEditing(false);
    setEditingId(null);

    // Clear file inputs
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  return (
    <div className="container">
      <h2>Student Management</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="form-control my-2"
        />
        <input
          type="text"
          name="class"
          placeholder="Class"
          value={formData.class}
          onChange={handleInputChange}
          className="form-control my-2"
        />
        <input
          type="file"
          name="photo"
          onChange={handleFileChange}
          className="form-control my-2"
          ref={photoInputRef} 
        />
        <input
          type="file"
          name="video"
          onChange={handleFileChange}
          className="form-control my-2"
          ref={videoInputRef} 
        />
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Student' : 'Add Student'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ml-2"
          onClick={resetForm}
        >
          Cancel
        </button>
      </form>
      <table className="table table-bordered table-hover mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Photo</th>
            <th>Video</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>
                {student.photo && (
                  <img
                    src={`${server}/${student.photo}`}
                    alt="student"
                    width="50"
                    height="50"
                  />
                )}
              </td>
              <td>
                {student.video && (
                  <video
                    src={`${server}/${student.video}`}
                    width="100"
                    height="50"
                    controls
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
