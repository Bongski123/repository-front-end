import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { jwtDecode } from 'jwt-decode';
import { Container, FloatingLabel, Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { FaCloudUploadAlt } from 'react-icons/fa';
import './CSS/Upload.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([{ author_name: '', author_email: '' }]);
    const [category, setCategory] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [abstract, setAbstract] = useState('');
    const [categories, setCategories] = useState([]);
    const [keywordOptions, setKeywordOptions] = useState([]);
    const [isAuthorFieldEditable, setIsAuthorFieldEditable] = useState(false);

    // Fetch categories, keywords, and user details
    useEffect(() => {
        // Fetch categories
        axios.get('https://ccsrepo.onrender.com/categories/all')
            .then(response => setCategories(response.data.category || []))
            .catch(error => console.error('Error fetching categories:', error));

        // Fetch existing keywords
        axios.get('https://ccsrepo.onrender.com/keywords')
            .then(response => {
                const keywordsData = response.data.keywords || [];
                setKeywordOptions(keywordsData.map(kw => ({ value: kw.keyword_name, label: kw.keyword_name })));
            })
            .catch(error => console.error('Error fetching keywords:', error));

        // Decode token to get user details
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const firstName = decodedToken.firstName;
                const lastName = decodedToken.lastName;
                const roleId = decodedToken.roleId;
                const isAdmin = decodedToken.isAdmin;

                // Set initial author and check editability
                const fullName = `${firstName} ${lastName}`;
                setAuthors([{ author_name: fullName, author_email: '' }]);
                setIsAuthorFieldEditable(roleId === 1 || isAdmin);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    // Handle author changes
    const handleAuthorChange = (index, field, value) => {
        const updatedAuthors = [...authors];
        updatedAuthors[index][field] = value;
        setAuthors(updatedAuthors);
    };

    // Add or remove authors
    const handleAddAuthor = () => setAuthors([...authors, { author_name: '', author_email: '' }]);
    const handleRemoveAuthor = (index) => setAuthors(authors.filter((_, i) => i !== index));

    // Handle keyword changes
    const handleKeywordChange = (selectedOptions) => setKeywords(selectedOptions);
    const handleAddKeyword = () => {
        if (newKeyword.trim() === '') {
            Swal.fire('Warning', 'Keyword cannot be empty!', 'warning');
            return;
        }
        const isDuplicate = keywordOptions.some(kw => kw.value.toLowerCase() === newKeyword.toLowerCase());
        if (isDuplicate) {
            Swal.fire('Warning', 'Keyword already exists!', 'warning');
            return;
        }
        const newOption = { value: newKeyword, label: newKeyword };
        setKeywordOptions([...keywordOptions, newOption]);
        setKeywords([...keywords, newOption]);
        setNewKeyword('');
    };

    // File drop handling
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const uploaderId = decodedToken.userId;
            const roleId = decodedToken.roleId;
            const isAdmin = decodedToken.isAdmin;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('authors', authors.map(author => `${author.author_name} (${author.author_email})`).join(', '));
            formData.append('categories', category);
            formData.append('keywords', keywords.map(k => k.value).join(', '));
            formData.append('abstract', abstract);
            formData.append('uploader_id', uploaderId);

            // Auto-approve if roleId === 1 or user is admin
            formData.append('status', roleId === 1 || isAdmin ? 'approved' : 'pending');

            const response = await axios.post('https://ccsrepo.onrender.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                Swal.fire('Success!', 'Upload successful', 'success').then(() => {
                    // Clear form fields
                    setTitle('');
                    setAuthors([{ author_name: '', author_email: '' }]);
                    setCategory('');
                    setKeywords([]);
                    setAbstract('');
                    setFile(null);
    
                    // Reload the page after closing the swal notification
                    window.location.reload();
                });
            } else {
                Swal.fire('Failed!', response.data.error || 'Unknown error', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', error.response?.data?.error || error.message, 'error');
        }
    };

    return (
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
                        <Col xs={4}>
                            <FloatingLabel controlId={`author-${index}`} label={`Author ${index + 1} Name`}>
                                <Form.Control
                                    type="text"
                                    placeholder="Author Name"
                                    value={author.author_name}
                                    onChange={(e) => handleAuthorChange(index, 'author_name', e.target.value)}
                                    disabled={index === 0 && !isAuthorFieldEditable} // Disable first author field conditionally
                                    required
                                />
                            </FloatingLabel>
                        </Col>
                        <Col xs={4}>
                            <FloatingLabel controlId={`author-email-${index}`} label={`Author ${index + 1} Email`}>
                                <Form.Control
                                    type="email"
                                    placeholder="Author Email"
                                    value={author.author_email}
                                    onChange={(e) => handleAuthorChange(index, 'author_email', e.target.value)}
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
                    <div className="d-flex align-items-center mt-2">
                        <Form.Control
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="New Keyword"
                        />
                        <Button variant="outline-primary" onClick={handleAddKeyword} className="ms-2">Add</Button>
                    </div>
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

                <Button type="submit" className="upload-button">Upload</Button>
            </Form>
        </Container>
    );
};

export default Upload;
