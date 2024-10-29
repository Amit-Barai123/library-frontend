import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from './server';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', author: '', publication: '', year: '' });

  const fetchBooks = async () => {
    // const response = await axios.get('http://localhost:5000/books');
    const response = await axios.get(`${server}/books`);
    setBooks(response.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      // await axios.put(`http://localhost:5000/books/${editingId}`, formData);
      await axios.put(`${server}/books/${editingId}`, formData);
      setIsEditing(false);
      setEditingId(null);
    } else {
      // await axios.post('http://localhost:5000/books', formData);
      await axios.post(`${server}/books`, formData);
    }
    
    setFormData({ name: '', author: '', publication: '', year: '' });
    fetchBooks();
  };

  const handleDelete = async (id) => {
    // await axios.delete(`http://localhost:5000/books/${id}`);
    await axios.delete(`${server}/books/${id}`);
    fetchBooks();
  };

  const handleEdit = (book) => {
    setFormData({
      name: book.name,
      author: book.author,
      publication: book.publication,
      year: book.year,
    });
    setIsEditing(true);
    setEditingId(book._id);
  };

  return (
    <div>
      <h2>Book Management</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Book Name"
          value={formData.name}
          onChange={handleChange}
          className="form-control my-2"
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="form-control my-2"
        />
        <input
          type="text"
          name="publication"
          placeholder="Publication"
          value={formData.publication}
          onChange={handleChange}
          className="form-control my-2"
        />
        <input
          type="date"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          className="form-control my-2"
        />
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Book" : "Add Book"}
        </button>
      </form>

      <table className="table table-bordered table-hover mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Publication</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.name}</td>
              <td>{book.author}</td>
              <td>{book.publication}</td>
              <td>{new Date(book.year).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(book._id)}
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

export default Books;
