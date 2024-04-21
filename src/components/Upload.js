import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, FloatingLabel, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';




const Upload = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publish_date, setPublicationDate] = useState('');
    const [abstract, setAbstract] = useState('');
    const [file, setFile] = useState(null);
    const [category_id, setCategory] = useState('');
    const [doctype_id, setDoctype] = useState(1);
    const [department_id, setDepartment] = useState('');
    const [course_id, setCourse] = useState('');
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);



    useEffect(() => {
      // Fetch categories
      axios.get('http://127.0.0.1:9000/categories')
          .then(response => {
              if (Array.isArray(response.data)) {
                  setCategories(response.data);
              } else {
                  console.error('Categories data is not an array:', response.data);
                  // Handle non-array response
              }
          })
          .catch(error => {
              console.error('Error fetching categories:', error);
          });
    
      // Fetch departments
      axios.get('http://127.0.0.1:9000/departments')
          .then(response => {
              if (Array.isArray(response.data)) {
                  setDepartments(response.data);
              } else {
                  console.error('Departments data is not an array:', response.data);
                  // Handle non-array response
              }
          })
          .catch(error => {
              console.error('Error fetching departments:', error);
          });
    
      // Fetch courses
      axios.get('http://127.0.0.1:9000/courses')
          .then(response => {
              if (Array.isArray(response.data)) {
                  setCourses(response.data);
              } else {
                  console.error('Courses data is not an array:', response.data);
                  // Handle non-array response
              }
          })
          .catch(error => {
              console.error('Error fetching courses:', error);
          });
    }, []);
    



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('author', author);
            formData.append('publish_date', publish_date);
            formData.append('abstract', abstract);
            formData.append('file', file);
            formData.append('category_id', category_id);
            formData.append('doctype_id', 1);
            formData.append('department_id', department_id);
            formData.append('course_id', course_id);
   
            const paperResponse = await axios.post('http://127.0.0.1:9000/documents/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
   
            if (paperResponse.data.status === 'Success') {
                Swal.fire({
                    title: 'Success!',
                    text: 'Upload successful',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Failed!',
                    text: 'Upload failed: ' + paperResponse.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred: ' + error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.error('Error:', error);
        }
    };




    return (
      <section id="upload" className="block categories-block">
      <Container fluid className="upload-container">
        <div className="title-bar">
          <h1 className="title1">Upload</h1>
        </div>
      </Container >




      <Container className="up-container">




        <Form onSubmit={handleSubmit}>
          <FloatingLabel
            controlId="exampleForm.ControlInput"
            label="Research Title"
            className="mb-2"
          >
            <Form.Control
              type="text"
              name="title"
              placeholder="Title of the Research Paper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
 
            />
          </FloatingLabel>




          <FloatingLabel
            controlId="floatingName"
            label="Author Name"
            className="mb-2"
          >
            <Form.Control
              type="text"
              name="author"
              placeholder="John Doe"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              style={{ height: '40px' }} // Adjust the height here
            />
          </FloatingLabel>








          <FloatingLabel
            controlId="floatingDate"
            label="Published Date"
            className="mb-2"
          >
            <Form.Control
              type="date"
              name="publish_date"
              placeholder="yyyy-mm-dd"
              value={publish_date}
              onChange={(e) => setPublicationDate(e.target.value)}
              required
            />
          </FloatingLabel>








          <FloatingLabel
            controlId="floatingTextarea2"
            label="Abstract of the Paper"
            className="mb-3"
          >
            <Form.Control
              as="textarea"
              rows={3}
              name="abstract"
              placeholder="A brief overview of the research paper."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </FloatingLabel>


          {categories && categories.length > 0 ? (
  <FloatingLabel controlId="categoryDropdown" label="Category" className="mb-3">
    <Form.Select value={category_id} onChange={(e) => setCategory(e.target.value)} required>
      <option key="" value="">Select Category</option>
      {categories.map(category => (
        <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
      ))}
    </Form.Select>
  </FloatingLabel>
) : (
  <p>Loading categories...</p>
)}


{departments && departments.length > 0 ? (
  <FloatingLabel controlId="departmentDropdown" label="Department" className="mb-2">
    <Form.Select value={department_id} onChange={(e) => setDepartment(e.target.value)} required>
      <option key="" value="">Select Department</option>
      {departments.map(department => (
        <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
      ))}
    </Form.Select>
  </FloatingLabel>
) : (
  <p>Loading departments...</p>
)}


{courses && courses.length > 0 ? (
  <FloatingLabel controlId="courseDropdown" label="Course" className="mb-2">
    <Form.Select value={course_id} onChange={(e) => setCourse(e.target.value)} required>
      <option key="" value="">Select Course</option>
      {courses.map(course => (
        <option key={course.course_id} value={course.course_id}>{course.course_name}</option>
      ))}
    </Form.Select>
  </FloatingLabel>
) : (
  <p>Loading courses...</p>
)}


                    {/* File Upload */}
                    <FloatingLabel controlId="file" label="Please select a PDF file." className="mb-2">
                        <Form.Control type="file" name="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
                    </FloatingLabel>
                    <Button type="submit" className="btn btn-primary">Upload</Button>
                </Form>
            </Container>
        </section>
    );
};




export default Upload;
