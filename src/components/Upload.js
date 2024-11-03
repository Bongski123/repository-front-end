import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import { Container, FloatingLabel, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select'; // Import react-select for multi-select functionality

const Upload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState(['']); // Array to store multiple authors
    const [category, setCategory] = useState('');
    const [keywords, setKeywords] = useState([]); // Array to store multiple keyword objects
    const [abstract, setAbstract] = useState('');
    const [categories, setCategories] = useState([]);
    const [keywordOptions, setKeywordOptions] = useState([]); // Store the list of available keywords

    useEffect(() => {
        // Fetch categories
        axios.get('http://localhost:9000/categories/all')
            .then(response => {
                const data = response.data.category;
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error('Categories data is not an array:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        // Fetch keywords
        axios.get('http://localhost:9000/keywords')
            .then(response => {
                const data = response.data.keywords;
                if (Array.isArray(data)) {
                    // Map keyword options to a format compatible with react-select
                    const options = data.map(kw => ({
                        value: kw.keyword_name,
                        label: kw.keyword_name
                    }));
                    setKeywordOptions(options);
                } else {
                    console.error('Keywords data is not an array:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching keywords:', error);
                setKeywordOptions([]); // Set an empty array if there’s an error
            });
    }, []);

    const handleAuthorChange = (index, value) => {
        const updatedAuthors = [...authors];
        updatedAuthors[index] = value;
        setAuthors(updatedAuthors);
    };

    const handleAddAuthor = () => {
        setAuthors([...authors, '']);
    };

    const handleRemoveAuthor = (index) => {
        const updatedAuthors = [...authors];
        updatedAuthors.splice(index, 1);
        setAuthors(updatedAuthors);
    };

    const handleKeywordChange = (selectedOptions) => {
        setKeywords(selectedOptions); // Update selected keywords
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Get token from local storage

            // Decode the token
            const decodedToken = jwtDecode(token);
            const uploaderId = decodedToken.userId; // Extract user_id from token

            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('authors', authors.join(', ')); // Join authors array into a string
            formData.append('categories', category); // Single category
            formData.append('keywords', keywords.map(k => k.value).join(', ')); // Join keyword values into a string
            formData.append('abstract', abstract);
            formData.append('uploader_id', uploaderId); // Add uploader_id to FormData

            const paperResponse = await axios.post('http://localhost:9000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Include token in headers
                }
            });

            if (paperResponse.status === 201) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Upload successful',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Reset form or navigate to another page
                    setTitle('');
                    setAuthors(['']);
                    setCategory('');
                    setKeywords([]);
                    setAbstract('');
                    setFile(null);
                });
            } else {
                Swal.fire({
                    title: 'Failed!',
                    text: `Upload failed: ${paperResponse.data.error || 'Unknown error'}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            Swal.fire({
                title: 'Error!',
                text: `An error occurred: ${errorMessage}`,
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
            </Container>

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

                    {authors.map((author, index) => (
                        <div key={index} className="mb-2 d-flex align-items-center">
                            <FloatingLabel
                                controlId={`author-${index}`}
                                label="Author Name"
                                className="mb-2 flex-grow-1"
                            >
                                <Form.Control
                                    type="text"
                                    name={`author-${index}`}
                                    placeholder="John Doe"
                                    value={author}
                                    onChange={(e) => handleAuthorChange(index, e.target.value)}
                                    required
                                    style={{ height: '40px' }}
                                />
                            </FloatingLabel>
                            {index === 0 && (
                                <Button
                                    variant="secondary"
                                    onClick={handleAddAuthor}
                                    className="ms-2"
                                >
                                    +
                                </Button>
                            )}
                            {index > 0 && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleRemoveAuthor(index)}
                                    className="ms-2"
                                >
                                    Remove Author
                                </Button>
                            )}
                        </div>
                    ))}

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
                            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option key="" value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.category_id} value={cat.category_name}>{cat.category_name}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    ) : (
                        <p>Loading categories...</p>
                    )}

                    <div className="mb-2">
                        <label>Keywords</label>
                        <Select
                            isMulti
                            value={keywords}
                            onChange={handleKeywordChange}
                            options={keywordOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>

                    <FloatingLabel controlId="file" label="Please select a PDF file." className="mb-2">
                        <Form.Control 
                            type="file" 
                            name="file" 
                            accept=".pdf" 
                            onChange={(e) => setFile(e.target.files[0])} 
                            required 
                        />
                    </FloatingLabel>
                    <Button type="submit" className="btn btn-primary">Upload</Button>
                </Form>
            </Container>
        </section>
    );
};

export default Upload;
