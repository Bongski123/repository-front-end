import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { jwtDecode } from 'jwt-decode';
import { Container, FloatingLabel, Form, Button, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { FaCloudUploadAlt } from 'react-icons/fa';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css'; 
import './CSS/Upload.css';
import { Quill } from 'react-quill';
import GoogleFontsLoader from './Pages/GoogleFontsLoader';

const BlockMath = Quill.import('formats/blockquote');
Quill.register('formats/math', BlockMath);

const Upload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([{ author_name: '', author_email: '' }]);
    const [category, setCategory] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [abstract, setAbstract] = useState(''); // Abstract now uses Quill
    const [categories, setCategories] = useState([]);
    const [keywordOptions, setKeywordOptions] = useState([]);
    const [isAuthorFieldEditable, setIsAuthorFieldEditable] = useState(false);

    const badWords = [
        // Profanity list remains the same...
    ];

    const containsProfanity = (text) => {
        const words = text.toLowerCase().split(/\s+/);
        return words.some(word => badWords.includes(word));
    };

    useEffect(() => {
        axios.get('https://ccsrepo.onrender.com/categories/all')
            .then(response => setCategories(response.data.category || []))
            .catch(error => console.error('Error fetching categories:', error));

        axios.get('https://ccsrepo.onrender.com/keywords')
            .then(response => {
                const keywordsData = response.data.keywords || [];
                setKeywordOptions(keywordsData.map(kw => ({ value: kw.keyword_name, label: kw.keyword_name })));
            })
            .catch(error => console.error('Error fetching keywords:', error));

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const fullName = `${decodedToken.firstName} ${decodedToken.lastName}`;
                setAuthors([{ author_name: fullName, author_email: decodedToken.email }]);
                setIsAuthorFieldEditable(decodedToken.roleId === 1 || decodedToken.isAdmin);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleAuthorChange = (index, field, value) => {
        const updatedAuthors = [...authors];
        updatedAuthors[index][field] = value;
        setAuthors(updatedAuthors);
    };

    const handleAddAuthor = () => setAuthors([...authors, { author_name: '', author_email: '' }]);

    const handleRemoveAuthor = (index) => setAuthors(authors.filter((_, i) => i !== index));

    const handleKeywordChange = (selectedOptions) => setKeywords(selectedOptions);

    const handleAddKeyword = () => {
        if (newKeyword.trim() === '') {
            Swal.fire('Warning', 'Keyword cannot be empty!', 'warning');
            return;
        }
        if (containsProfanity(newKeyword)) {
            Swal.fire('Warning', 'Keyword contains inappropriate language!', 'warning');
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

    const handleDrop = (acceptedFiles) => {
        const uploadedFile = acceptedFiles[0];
        if (uploadedFile?.type === 'application/pdf') {
            setFile(uploadedFile);
        } else {
            Swal.fire('Invalid File', 'Only PDF files are allowed.', 'warning');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: 'application/pdf',
        maxFiles: 1,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (containsProfanity(title) || containsProfanity(abstract)) {
            Swal.fire('Error', 'Your submission contains inappropriate language!', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('authors', authors.map(author => `${author.author_name} (${author.author_email})`).join(', '));
            formData.append('categories', category);
            formData.append('keywords', keywords.map(k => k.value).join(', '));
            formData.append('abstract', abstract); // Send abstract as HTML
            formData.append('uploader_id', decodedToken.userId);

            const response = await axios.post('https://ccsrepo.onrender.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                Swal.fire('Success', 'Upload successful!', 'success').then(() => window.location.reload());
            } else {
                Swal.fire('Error', response.data.error || 'Upload failed', 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Something went wrong!', 'error');
        }
    };

    return (
        <Container className="up-container">
              <GoogleFontsLoader/> {/* Ensure Google Fonts are loaded */}
            <Form onSubmit={handleSubmit} className="p-3 shadow-sm bg-white rounded">
                <FloatingLabel controlId="researchTitle" label="Research Title" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Enter the title of the research paper"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </FloatingLabel>

                {authors.map((author, index) => (
                    <Row key={index} className="mb-3 align-items-center">
                        <Col xs={5}>
                            <FloatingLabel controlId={`authorName-${index}`} label={`Author ${index + 1} Name`}>
                                <Form.Control
                                    type="text"
                                    placeholder="Author Name"
                                    value={author.author_name}
                                    onChange={(e) => handleAuthorChange(index, 'author_name', e.target.value)}
                                    disabled={index === 0 && !isAuthorFieldEditable}
                                    required
                                />
                            </FloatingLabel>
                        </Col>
                        <Col xs={5}>
                            <FloatingLabel controlId={`authorEmail-${index}`} label={`Author ${index + 1} Email`}>
                                <Form.Control
                                    type="email"
                                    placeholder="Author Email"
                                    value={author.author_email}
                                    onChange={(e) => handleAuthorChange(index, 'author_email', e.target.value)}
                                    disabled={index === 0 && !isAuthorFieldEditable}
                                    required
                                />
                            </FloatingLabel>
                        </Col>
                        <Col xs="auto">
                            {index === 0 ? (
                                <Button variant="outline-secondary" onClick={handleAddAuthor} className="mt-3">
                                    +
                                </Button>
                            ) : (
                                <Button variant="outline-danger" onClick={() => handleRemoveAuthor(index)}>
                                    Remove
                                </Button>
                            )}
                        </Col>
                    </Row>
                ))}

                <div className="mb-3">
                    <label>Abstract</label>
                  
                    <ReactQuill
    value={abstract}
    onChange={setAbstract}
    placeholder="Enter the abstract"
    modules={{
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': []}], // Add more fonts here
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'size': ['small', 'medium', 'large', 'huge'] }],
            ['blockquote', 'code-block'],
            ['clean'],
            [{ 'math': 'inline' }, { 'math': 'block' }] // Adds support for KaTeX
        ],
          theme: 'snow'
    }}
    style={{
        height: '500px',
        marginBottom: '70px',
    }}
/>

                </div>

                <FloatingLabel controlId="category" label="Category" className="mb-3">
                    <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="">Select a category</option>
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
                        <Button variant="outline-success" onClick={handleAddKeyword} className="ms-2">
                            Add
                        </Button>
                    </div>
                </div>

                <div {...getRootProps({ className: `file-dropzone ${isDragActive ? 'active' : ''}` })} className="file-drop-button square mb-3 p-3 text-center">
                    <FaCloudUploadAlt className="cloud-icon" />
                    <input {...getInputProps()} />
                    {file ? <p>{file.name}</p> : <p>Drag and drop a PDF file here, or click to select one</p>}
                </div>

                <Button type="submit" className="upload-button" style={{ backgroundColor: '#185519', color: 'white' }}>
                    Upload
                </Button>
            </Form>
        </Container>
    );
};

export default Upload;
