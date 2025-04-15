import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyD7wUqCzkLVS2ELkAXdxgtW_O5IIC3Ct7g');

function LatestUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: '',
    readTime: '',
    content: '',
    isTop: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch latest updates
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.notesmarket.in/api/latest-updates');
        if (!response.ok) {
          throw new Error('Failed to fetch updates');
        }
        const result = await response.json();
        setUpdates(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Generate content using Google Generative AI
  const generateContent = async () => {
    if (!formData.title || !formData.subtitle) {
      setError('Please enter a title and subtitle to generate content');
      return;
    }

    setGeneratingContent(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      
      const prompt = `
Write an educational article using the following details:
Title: ${formData.title}
Subtitle: ${formData.subtitle}

Rules:
1. The content must always be educational and informative.
2. Do NOT include any sexual, violent, discriminatory, or otherwise harmful content.
3. The content must be appropriate for all audiences.
4. Use plain text only — no Markdown, HTML, bullet points, or special formatting.
5. Generate plain text content (not Markdown or HTML), approximately 200-300 words long.
6. Focus strictly on the topic implied by the title and subtitle.
7. Include relevant facts, real-world examples, and helpful insights.

Make sure the output is clear, engaging, and suitable for a general blog audience.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setFormData({
        ...formData,
        content: text
      });
    } catch (err) {
      setError(`Failed to generate content: ${err.message}`);
    } finally {
      setGeneratingContent(false);
    }
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  // Process the selected/dropped file
  const processFile = (file) => {
    if (file && file.type.match('image.*')) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      const data = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Append the image file if one is selected
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await fetch('https://api.notesmarket.in/api/latest/upload-update', {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        throw new Error('Failed to upload update');
      }

      // Reset form after successful submission
      setFormData({
        title: '',
        subtitle: '',
        date: '',
        readTime: '',
        content: '',
        isTop: false
      });
      setImageFile(null);
      setImagePreview(null);
      setSuccessMessage('Update added successfully!');
      
      // Refresh the updates list
      const updatedResponse = await fetch('https://api.notesmarket.in/api/latest-updates');
      const result = await updatedResponse.json();
      setUpdates(result.data || []);
      
      // Hide the form after successful submission
      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle pin status
  const togglePinStatus = async (id, currentIsTop) => {
    setActionInProgress(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.notesmarket.in/api/latest/update-isTop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id, 
          isTop: !currentIsTop 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update pin status');
      }
      
      // Update local state to reflect the change
      setUpdates(prevUpdates => 
        prevUpdates.map(update => 
          update._id === id ? { ...update, isTop: !currentIsTop } : update
        )
      );
      
      setSuccessMessage(`Update ${!currentIsTop ? 'pinned' : 'unpinned'} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setActionInProgress(false);
    }
  };
  
  // Delete update
  const deleteUpdate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this update?')) {
      return;
    }
    
    setActionInProgress(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.notesmarket.in/api/latest/delete-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete update');
      }
      
      // Remove the deleted update from local state
      setUpdates(prevUpdates => prevUpdates.filter(update => update._id !== id));
      
      // If the deleted update was selected in the modal, close the modal
      if (selectedUpdate && selectedUpdate._id === id) {
        closeModal();
      }
      
      setSuccessMessage('Update deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setActionInProgress(false);
    }
  };

  // Open modal with selected update
  const openReadMore = (update) => {
    setSelectedUpdate(update);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUpdate(null);
  };

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      // Reset form and messages when opening
      setFormData({
        title: '',
        subtitle: '',
        date: '',
        readTime: '',
        content: '',
        isTop: false
      });
      setImageFile(null);
      setImagePreview(null);
      setSuccessMessage('');
      setError(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Latest Educational Updates</h1>
        <button 
          onClick={toggleForm}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
        >
          {showForm ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Close Form
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Update
            </>
          )}
        </button>
      </div>
      
      {/* Success or error messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {/* Add new update form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6">Add New Update</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="subtitle">Subtitle</label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="date">Date</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="e.g., 6 March, 2025"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="readTime">Read Time</label>
                <input
                  type="text"
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 min read"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Image</label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="mb-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-md"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="mt-2 text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop an image here, or
                        <label className="mx-1 text-blue-600 hover:text-blue-800 cursor-pointer">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                        to select a file
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700" htmlFor="content">Content</label>
                  <button
                    type="button"
                    onClick={generateContent}
                    disabled={!formData.title || !formData.subtitle || generatingContent}
                    className={`${
                      !formData.title || !formData.subtitle || generatingContent
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                    } bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 px-4 rounded-md transition-all duration-300 text-sm flex items-center`}
                  >
                    {generatingContent ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM2 10a8 8 0 1116 0 8 8 0 01-16 0z"></path>
                          <path d="M10.5 5.5a.5.5 0 11-1 0 .5.5 0 011 0z"></path>
                          <path d="M10.5 14.5a.5.5 0 11-1 0 .5.5 0 011 0z"></path>
                          <path d="M5.5 10.5a.5.5 0 110-1 .5.5 0 010 1z"></path>
                          <path d="M14.5 10.5a.5.5 0 110-1 .5.5 0 010 1z"></path>
                        </svg>
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="8"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.title && formData.subtitle ? 
                    "Click 'Generate with AI' to automatically create content based on title and subtitle." : 
                    "Enter title and subtitle to enable AI content generation."}
                </p>
              </div>
              
              {/* Pin Status Option */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTop"
                    name="isTop"
                    checked={formData.isTop}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isTop" className="ml-2 block text-sm text-gray-700">
                    Pin this update to the top (featured update)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggleForm}
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`${
                  submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-2 px-6 rounded-md transition-colors duration-300 flex items-center justify-center`}
              >
                {submitting ? (
                  <>
                    <span className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></span>
                    Submitting...
                  </>
                ) : (
                  'Add Update'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Display pinned updates first */}
      {!loading && !error && updates.length > 0 && updates.some(update => update.isTop) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
            </svg>
            Featured Updates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.filter(update => update.isTop).map(update => (
              <div key={update._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-yellow-400">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={update.image} 
                    alt={update.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button 
                      onClick={() => togglePinStatus(update._id, update.isTop)}
                      disabled={actionInProgress}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-colors duration-300"
                      title="Unpin this update"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteUpdate(update._id)}
                      disabled={actionInProgress}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-300"
                      title="Delete this update"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{update.date}</span>
                    <span className="text-sm text-gray-500">{update.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-gray-800">{update.title}</h2>
                  <h3 className="text-md text-gray-600 mb-3">{update.subtitle}</h3>
                  <p className="text-gray-700 mb-4">
                    {update.content.length > 100 
                      ? `${update.content.substring(0, 100)}...` 
                      : update.content}
                  </p>
                  <button 
                    onClick={() => openReadMore(update)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display regular updates */}
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error && !successMessage ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      ) : updates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No updates available yet.</p>
        </div>
      ) : (
        <>
          {updates.some(update => !update.isTop) && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">All Updates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {updates.filter(update => !update.isTop).map(update => (
                  <div key={update._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={update.image} 
                        alt={update.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button 
                          onClick={() => togglePinStatus(update._id, update.isTop)}
                          disabled={actionInProgress}
                          className="bg-gray-200 hover:bg-yellow-500 text-gray-700 hover:text-white p-2 rounded-full transition-colors duration-300"
                          title="Pin this update"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={() => deleteUpdate(update._id)}
                          disabled={actionInProgress}
                          className="bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white p-2 rounded-full transition-colors duration-300"
                          title="Delete this update"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">{update.date}</span>
                        <span className="text-sm text-gray-500">{update.readTime}</span>
                      </div>
                      <h2 className="text-xl font-bold mb-2 text-gray-800">{update.title}</h2>
                      <h3 className="text-md text-gray-600 mb-3">{update.subtitle}</h3>
                      <p className="text-gray-700 mb-4">
                        {update.content.length > 100 
                          ? `${update.content.substring(0, 100)}...` 
                          : update.content}
                      </p>
                      <button 
                        onClick={() => openReadMore(update)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Read More Modal */}
      {/* Read More Modal */}
      {showModal && selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            {/* Fixed header with close button */}
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedUpdate.title}</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Scrollable content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                <span>{selectedUpdate.date}</span>
                <span>{selectedUpdate.readTime}</span>
              </div>
              
              <h3 className="text-xl text-gray-700 mb-4">{selectedUpdate.subtitle}</h3>
              
              <div className="mb-6">
                <img 
                  src={selectedUpdate.image} 
                  alt={selectedUpdate.title} 
                  className="w-full h-auto max-h-96 object-contain rounded-lg"
                />
              </div>
              
              <div className="prose max-w-none">
                {selectedUpdate.content.split('\n').map((paragraph, index) => (
                  paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
                ))}
              </div>
            </div>
            
            {/* Fixed footer */}
            <div className="p-4 border-t sticky bottom-0 bg-white z-10 flex justify-end">
              <button 
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LatestUpdates;