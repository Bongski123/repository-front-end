import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import { Container, FloatingLabel, Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select';
import './CSS/Upload.css';
import { FaCloudUploadAlt } from 'react-icons/fa';


const Upload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState(['']);
    const [category, setCategory] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [abstract, setAbstract] = useState('');
    const [categories, setCategories] = useState([]);
    const [keywordOptions, setKeywordOptions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:10121/categories/all')
            .then(response => setCategories(response.data.category || []))
            .catch(error => console.error('Error fetching categories:', error));

        axios.get('http://localhost:10121/keywords')
            .then(response => {
                const keywordsData = response.data.keywords || [];
                setKeywordOptions(keywordsData.map(kw => ({ value: kw.keyword_name, label: kw.keyword_name })));
            })
            .catch(error => console.error('Error fetching keywords:', error));
    }, []);

    const handleAuthorChange = (index, value) => {
        const updatedAuthors = [...authors];
        updatedAuthors[index] = value;
        setAuthors(updatedAuthors);
    };

    const handleAddAuthor = () => setAuthors([...authors, '']);
    const handleRemoveAuthor = (index) => setAuthors(authors.filter((_, i) => i !== index));
    const handleKeywordChange = (selectedOptions) => setKeywords(selectedOptions);

    const handleDrop = (acceptedFiles) => {
        const uploadedFile = acceptedFiles[0];
        if (uploadedFile?.type === 'application/pdf') {
            setFile(uploadedFile);
        } else {
            Swal.fire({
                title: 'Invalid File',
                text: 'Only PDF files are allowed.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: 'application/pdf',
        maxFiles: 1,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const uploaderId = decodedToken.userId;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('authors', authors.join(', '));
            formData.append('categories', category);
            formData.append('keywords', keywords.map(k => k.value).join(', '));
            formData.append('abstract', abstract);
            formData.append('uploader_id', uploaderId);

            const response = await axios.post('http://localhost:9000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                Swal.fire('Success!', 'Upload successful', 'success');
                setTitle('');
                setAuthors(['']);
                setCategory('');
                setKeywords([]);
                setAbstract('');
                setFile(null);
            } else {
                Swal.fire('Failed!', response.data.error || 'Unknown error', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', error.response?.data?.error || error.message, 'error');
        }
    };

    return (
        <section id="upload" className="block categories-block">
            <Container fluid className="upload-container">
                <div className="title-bar">
                    <h1 className="title">Upload </h1>
                </div>
            </Container>

            <Container className="up-container">
                <Form onSubmit={handleSubmit} className="p-3 shadow-sm bg-light rounded">
                    <FloatingLabel controlId="exampleForm.ControlInput" label="Research Title" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Title of the Research Paper"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </FloatingLabel>

                    {authors.map((author, index) => (
                        <Row key={index} className="mb-3 align-items-center">
                            <Col xs={10}>
                                <FloatingLabel controlId={`author-${index}`} label="Author Name">
                                    <Form.Control
                                        type="text"
                                        placeholder="Author Name"
                                        value={author}
                                        onChange={(e) => handleAuthorChange(index, e.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                                {index === 0 ? (
                                    <Button variant="outline-secondary" onClick={handleAddAuthor}>+</Button>
                                ) : (
                                    <Button variant="outline-danger" onClick={() => handleRemoveAuthor(index)}>
                                        Remove
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ))}

                    <FloatingLabel controlId="floatingTextarea2" label="Abstract of the Paper" className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="A brief overview of the research paper."
                            value={abstract}
                            onChange={(e) => setAbstract(e.target.value)}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="categoryDropdown" label="Category" className="mb-3">
                        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_name}>{cat.category_name}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>

                    <div className="mb-3">
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

                    <div {...getRootProps({ className: `file-dropzone ${isDragActive ? 'active' : ''}` })} className="file-drop-button square mb-3 p-3 text-center">
    <FaCloudUploadAlt className="cloud-icon" />


                        <input {...getInputProps()} />
                        {file ? (
    <p>{file.name}</p>
) : (
    <p className="upload-text">Drag and drop a PDF file here, or click to select one</p>
)}

                    </div>

                    <button type="submit" className="upload-button">Upload</button>
                </Form>
            </Container>
        </section>
    );
};

export default Upload;
