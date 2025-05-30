// import React, { useState, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Plus, ChevronRight, FileText, Image as ImageIcon, FileBox, Upload, X, CheckCircle, Eye } from 'lucide-react';
// import { TreeItem } from '../ui/tree-view';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from '../ui/dialog';

// interface Category {
//   _id: string;
//   name: string;
//   type: string;
//   parentId?: string;
//   path: string[];
//   content?: {
//     imageUrls: string[];
//     pdfUrl?: string;
//     text?: string;
//   };
// }

// interface ParentCategory {
//   _id: string;
//   name: string;
//   path: string[];
// }

// interface UploadedFile {
//   file: File;
//   type: 'image' | 'pdf';
// }

// interface ContentResponse {
//   message: string;
//   content: {
//     imageUrls: string[];
//     pdfUrl?: string;
//     text?: string;
//   };
// }

// // Content Preview Dialog Component
// const ContentPreviewDialog = ({ 
//   category, 
//   isOpen, 
//   onClose 
// }: { 
//   category: Category | null;
//   isOpen: boolean;
//   onClose: () => void;
// }) => {
//   if (!category || !category.content) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[700px]">
//         <DialogHeader>
//           <DialogTitle>{category.name} - Content Preview</DialogTitle>
//           <DialogDescription>
//             Path: {category.path.join(' > ')}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
//           {/* Text Content */}
//           {category.content.text && (
//             <div className="space-y-2">
//               <h4 className="text-lg font-medium">Text Content</h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-gray-700 whitespace-pre-wrap">{category.content.text}</p>
//               </div>
//             </div>
//           )}

//           {/* Images */}
//           {category.content.imageUrls && category.content.imageUrls.length > 0 && (
//             <div className="space-y-2">
//               <h4 className="text-lg font-medium">Images</h4>
//               <div className="grid grid-cols-2 gap-4">
//                 {category.content.imageUrls.map((url, index) => (
//                   <div key={index} className="relative aspect-square">
//                     <img
//                       src={url}
//                       alt={`Content ${index + 1}`}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* PDF */}
//           {category.content.pdfUrl && (
//             <div className="space-y-2">
//               <h4 className="text-lg font-medium">PDF Document</h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <a
//                   href={category.content.pdfUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
//                 >
//                   <FileBox size={20} />
//                   View PDF Document
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>
//         <DialogFooter>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
//           >
//             Close
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // Custom Toast component
// const CustomToast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
//       type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//     }`}>
//       {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
//       <span>{message}</span>
//       <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
//         <X size={16} />
//       </button>
//     </div>
//   );
// };

// function Categories() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isLastCategory, setIsLastCategory] = useState(false);
//   const [showContentDialog, setShowContentDialog] = useState(false);
//   const [showPreviewDialog, setShowPreviewDialog] = useState(false);
//   const [previewCategory, setPreviewCategory] = useState<Category | null>(null);
//   const [contentType, setContentType] = useState<'text' | 'image' | 'pdf' | null>(null);
//   const [contentText, setContentText] = useState('');
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [uploadProgress, setUploadProgress] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
//   const [showMainCategoryDialog, setShowMainCategoryDialog] = useState(false);
//   const [mainCategoryName, setMainCategoryName] = useState('');

//   const token = localStorage.getItem('adminToken');

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: contentType === 'image' 
//       ? { 'image/*': ['.png', '.jpg', '.jpeg'] } 
//       : contentType === 'pdf' 
//         ? { 'application/pdf': ['.pdf'] } 
//         : {},
//     onDrop: (acceptedFiles) => {
//       if (contentType === 'image' || contentType === 'pdf') {
//         const newFiles = acceptedFiles.map(file => ({
//           file,
//           type: contentType === 'image' ? 'image' as const : 'pdf' as const
//         }));
//         setUploadedFiles(newFiles);
//       }
//     },
//     disabled: !contentType || contentType === 'text',
//     maxFiles: contentType === 'pdf' ? 1 : 5,
//   });

//   const removeFile = (index: number) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const handlePreviewClick = (category: Category, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setPreviewCategory(category);
//     setShowPreviewDialog(true);
//   };

//   const handleAddMainCategory = async () => {
//     if (!mainCategoryName.trim()) return;

//     try {
//       const response = await fetch('https://api.notesmarket.in/api/categories', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           name: mainCategoryName,
//           type: 'category'
//         })
//       });

//       if (response.ok) {
//         setToast({
//           show: true,
//           message: 'Main category created successfully',
//           type: 'success'
//         });
//         setMainCategoryName('');
//         setShowMainCategoryDialog(false);
//         fetchParentCategories();
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to create main category');
//       }
//     } catch (err) {
//       setError('Failed to create main category');
//     }
//   };

//   const fetchParentCategories = async () => {
//     try {
//       const response = await fetch('https://api.notesmarket.in/api/categories/parents', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       setParentCategories(data[0]?.parents || []);
//     } catch (err) {
//       setError('Failed to fetch parent categories');
//     }
//   };

//   const fetchCategories = async (parentId?: string) => {
//     try {
//       setLoading(true);
//       const url = parentId 
//         ? `https://api.notesmarket.in/api/categories/subcategories/${parentId}`
//         : 'https://api.notesmarket.in/api/categories';
      
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       const subcategories = parentId && data[0]?.subcategories ? data[0].subcategories : data || [];
//       setCategories(subcategories);
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to fetch categories');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchParentCategories();
//   }, []);

//   const handleCategoryClick = async (category: Category | ParentCategory) => {
//     setSelectedCategory(category as Category);
//     await fetchCategories(category._id);
//   };

//   const handleAddCategory = async () => {
//     if (!newCategoryName) return;

//     try {
//       const payload = {
//         name: newCategoryName,
//         type: isLastCategory ? 'content' : 'category',
//         ...(selectedCategory && { parentId: selectedCategory._id })
//       };

//       const response = await fetch('https://api.notesmarket.in/api/categories', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (response.ok) {
//         setNewCategoryName('');
//         if (selectedCategory) {
//           fetchCategories(selectedCategory._id);
//         } else {
//           fetchParentCategories();
//         }

//         const data = await response.json();
//         if (isLastCategory) {
//           setSelectedCategory(data);
//         }
//       } else {
//         setError('Failed to add category');
//       }
//     } catch (err) {
//       setError('Failed to add category');
//     }
//   };

//   const openContentDialog = (type: 'text' | 'image' | 'pdf') => {
//     setContentType(type);
//     setContentText('');
//     setUploadedFiles([]);
//     setShowContentDialog(true);
//   };

//   const handleAddContent = async () => {
//     if (!selectedCategory || !contentType) return;
//     setUploadProgress(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('categoryid', selectedCategory._id);
      
//       if (contentType === 'text' && contentText.trim()) {
//         formData.append('text', contentText);
//       } else if (contentType === 'image') {
//         uploadedFiles.forEach(({ file }) => {
//           formData.append('images', file);
//         });
//       } else if (contentType === 'pdf' && uploadedFiles.length > 0) {
//         formData.append('pdf', uploadedFiles[0].file);
//       }

//       const response = await fetch('https://api.notesmarket.in/api/categories/content', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (response.ok) {
//         const data: ContentResponse = await response.json();
//         setToast({
//           show: true,
//           message: data.message || `${contentType} content added successfully`,
//           type: 'success'
//         });
        
//         setShowContentDialog(false);
//         setContentType(null);
//         setContentText('');
//         setUploadedFiles([]);
        
//         if (selectedCategory.parentId) {
//           fetchCategories(selectedCategory.parentId);
//         } else {
//           fetchParentCategories();
//         }
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to add content');
//       }
//     } catch (err) {
//       setError('Failed to add content');
//     } finally {
//       setUploadProgress(false);
//     }
//   };

//   const isContentCategory = (category: Category) => {
//     return category.type === 'content';
//   };

//   const hasContent = (category: Category) => {
//     return category.content && (
//       category.content.text ||
//       (category.content.imageUrls && category.content.imageUrls.length > 0) ||
//       category.content.pdfUrl
//     );
//   };

//   return (
//     <div className="flex gap-6">
//       {/* Tree View Sidebar */}
//       <div className="w-64 bg-white rounded-lg shadow-md p-4">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold">Categories</h2>
//           <button
//             onClick={() => setShowMainCategoryDialog(true)}
//             className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
//           >
//             <Plus size={16} />
//             <span>Main</span>
//           </button>
//         </div>
//         <div className="space-y-1">
//           {parentCategories.map((parent) => (
//             <TreeItem
//               key={parent._id}
//               label={parent.name}
//               defaultExpanded={selectedCategory?._id === parent._id}
//               onClick={() => handleCategoryClick(parent)}
//             >
//               {categories.map((category) => (
//                 <TreeItem
//                   key={category._id}
//                   label={category.name}
//                   onClick={() => handleCategoryClick(category)}
//                 />
//               ))}
//             </TreeItem>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 space-y-6">
//         {/* Add Category Form */}
//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-4">
//               <input
//                 type="text"
//                 value={newCategoryName}
//                 onChange={(e) => setNewCategoryName(e.target.value)}
//                 placeholder="Enter category name"
//                 className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 onClick={handleAddCategory}
//                 className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 flex items-center gap-2 transition-all"
//               >
//                 <Plus size={20} />
//                 Add SubCategory
//               </button>
//             </div>
//             {selectedCategory && (
//               <label className="flex items-center gap-2 text-sm text-gray-600">
//                 <input
//                   type="checkbox"
//                   checked={isLastCategory}
//                   onChange={(e) => setIsLastCategory(e.target.checked)}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span>This is a final category (will contain content)</span>
//               </label>
//             )}
//           </div>
//         </div>

//         {/* Selected Category Content */}
//         {selectedCategory && (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-xl font-semibold mb-2">{selectedCategory.name}</h2>
//             <p className="text-sm text-gray-500 mb-6">
//               Path: {selectedCategory.path.join(' > ')}
//             </p>
            
//             {/* Add Content Buttons for Final Categories */}
//             {isContentCategory(selectedCategory) && (
//               <div className="mb-6 flex gap-2">
//                 <button 
//                   onClick={() => openContentDialog('text')}
//                   className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
//                 >
//                   <FileText size={18} />
//                   Add Text
//                 </button>
//                 <button 
//                   onClick={() => openContentDialog('image')}
//                   className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-200 transition-colors"
//                 >
//                   <ImageIcon size={18} />
//                   Add Images
//                 </button>
//                 <button 
//                   onClick={() => openContentDialog('pdf')}
//                   className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-colors"
//                 >
//                   <FileBox size={18} />
//                   Add PDF
//                 </button>
//               </div>
//             )}
            
//             {/* Category Content Grid */}
//             {loading ? (
//               <div className="text-center py-8">Loading...</div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {categories.map((category) => (
//                   <div
//                     key={category._id}
//                     onClick={() => handleCategoryClick(category)}
//                     className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-100 relative"
//                   >
//                     <div className="flex flex-col">
//                       <h3 className="font-semibold text-lg">{category.name}</h3>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Type: {category.type}
//                       </p>
//                       <div className="flex justify-between items-center mt-2">
//                         <div className="flex gap-2">
//                           {category.type === 'content' && category.content && (
//                             <>
//                               {category.content.text && <FileText size={18} className="text-gray-600" />}
//                               {category.content.imageUrls?.length > 0 && (
//                                 <ImageIcon size={18} className="text-gray-600" />
//                               )}
//                               {category.content.pdfUrl && <FileBox size={18} className="text-gray-600" />}
//                             </>
//                           )}
//                         </div>
//                         {hasContent(category) && (
//                           <button
//                             onClick={(e) => handlePreviewClick(category, e)}
//                             className="absolute top-2 right-2 p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
//                             title="Preview Content"
//                           >
//                             <Eye size={18} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* Main Category Dialog */}
//       <Dialog open={showMainCategoryDialog} onOpenChange={setShowMainCategoryDialog}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Create Main Category</DialogTitle>
//             <DialogDescription>
//               Add a new main category to organize your content
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Category Name</label>
//               <input
//                 type="text"
//                 value={mainCategoryName}
//                 onChange={(e) => setMainCategoryName(e.target.value)}
//                 placeholder="Enter main category name"
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <button
//               onClick={() => setShowMainCategoryDialog(false)}
//               className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddMainCategory}
//               disabled={!mainCategoryName.trim()}
//               className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50"
//             >
//               Create Category
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Content Upload Dialog */}
//       <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>
//               {contentType === 'text' ? 'Add Text Content' : 
//                contentType === 'image' ? 'Add Images' : 
//                contentType === 'pdf' ? 'Add PDF Document' : 
//                'Add Content'} to {selectedCategory?.name}
//             </DialogTitle>
//             <DialogDescription>
//               {contentType === 'text' ? 'Add text content to this category' : 
//                contentType === 'image' ? 'Upload image files (JPG, PNG)' : 
//                contentType === 'pdf' ? 'Upload a PDF document' : 
//                'Add content to this category'}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             {contentType === 'text' && (
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Text Content</label>
//                 <textarea
//                   value={contentText}
//                   onChange={(e) => setContentText(e.target.value)}
//                   className="w-full min-h-[200px] rounded-lg border border-gray-300 p-2"
//                   placeholder="Enter text content..."
//                 />
//               </div>
//             )}
            
//             {(contentType === 'image' || contentType === 'pdf') && (
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">
//                   {contentType === 'image' ? 'Upload Images' : 'Upload PDF Document'}
//                 </label>
//                 <div
//                   {...getRootProps()}
//                   className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
//                 >
//                   <input {...getInputProps()} />
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-2 text-sm text-gray-600">
//                     Drag & drop {contentType === 'image' ? 'images' : 'PDF file'} here, or click to select
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {contentType === 'image' ? 'Supports: PNG, JPG, JPEG' : 'Supports: PDF files only'}
//                   </p>
//                 </div>
                
//                 {uploadedFiles.length > 0 && (
//                   <div className="mt-4">
//                     {contentType === 'image' && (
//                       <div className="mb-4">
//                         <h4 className="text-sm font-medium mb-2">Images ({uploadedFiles.length})</h4>
//                         <ul className="space-y-2">
//                           {uploadedFiles.map((file, index) => (
//                             <li key={`img-${index}`} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded">
//                               <div className="flex items-center gap-2">
//                                 <ImageIcon size={16} />
//                                 {file.file.name}
//                               </div>
//                               <button
//                                 onClick={() => removeFile(index)}
//                                 className="text-gray-400 hover:text-red-500 transition-colors"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {contentType === 'pdf' && (
//                       <div>
//                         <h4 className="text-sm font-medium mb-2">PDF Document</h4>
//                         <ul className="space-y-2">
//                           {uploadedFiles.map((file, index) => (
//                             <li key={`pdf-${index}`} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded">
//                               <div className="flex items-center gap-2">
//                                 <FileBox size={16} />
//                                 {file.file.name}
//                               </div>
//                               <button
//                                 onClick={() => removeFile(index)}
//                                 className="text-gray-400 hover:text-red-500 transition-colors"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <button
//               onClick={() => setShowContentDialog(false)}
//               className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddContent}
//               disabled={uploadProgress || 
//                 (contentType === 'text' && !contentText.trim()) || 
//                 ((contentType === 'image' || contentType === 'pdf') && uploadedFiles.length === 0)}
//               className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50"
//             >
//               {uploadProgress ? 'Uploading...' : `Save ${contentType === 'text' ? 'Text' : contentType === 'image' ? 'Images' : 'PDF'}`}
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Content Preview Dialog */}
//       <ContentPreviewDialog
//         category={previewCategory}
//         isOpen={showPreviewDialog}
//         onClose={() => {
//           setShowPreviewDialog(false);
//           setPreviewCategory(null);
//         }}
//       />

//       {/* Custom Toast Notification */}
//       {toast.show && (
//         <CustomToast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}
//     </div>
//   );
// }

// export default Categories;
// import React, { useState, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Plus, ChevronRight, FileText, Image as ImageIcon, FileBox, Upload, X, CheckCircle, Eye, Trash2, AlertTriangle } from 'lucide-react';
// import { TreeItem } from '../ui/tree-view';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from '../ui/dialog';

// interface Category {
//   _id: string;
//   name: string;
//   type: string;
//   parentId?: string;
//   path: string[];
//   content?: {
//     imageUrls: string[];
//     pdfUrl?: string;
//     text?: string;
//   };
// }

// interface ParentCategory {
//   _id: string;
//   name: string;
//   path: string[];
// }

// interface UploadedFile {
//   file: File;
//   type: 'image' | 'pdf';
// }

// interface ContentResponse {
//   message: string;
//   content: {
//     imageUrls: string[];
//     pdfUrl?: string;
//     text?: string;
//   };
// }

// // Content Preview Dialog Component
// const ContentPreviewDialog = ({ 
//   category, 
//   isOpen, 
//   onClose 
// }: { 
//   category: Category | null;
//   isOpen: boolean;
//   onClose: () => void;
// }) => {
//   if (!category || !category.content) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[700px]">
//         <DialogHeader>
//           <DialogTitle>{category.name} - Content Preview</DialogTitle>
//           <DialogDescription>
//             Path: {category.path.join(' > ')}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
//           {/* Text Content */}
//           {category.content.text && (
//             <div className="space-y-2">
//               <h4 className="text-lg font-medium">Text Content</h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-gray-700 whitespace-pre-wrap">{category.content.text}</p>
//               </div>
//             </div>
//           )}

//           {/* Images */}
//           {category.content.imageUrls && category.content.imageUrls.length > 0 && (
//             <div className="space-y-2">
//               <h4 className="text-lg font-medium">Images</h4>
//               <div className="grid grid-cols-2 gap-4">
//                 {category.content.imageUrls.map((url, index) => (
//                   <div key={index} className="relative aspect-square">
//                     <img
//                       src={url}
//                       alt={`Content ${index + 1}`}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* PDF */}
//           {category.content.pdfUrl && (
//             <div className="space-y-2">
//               <h4 className="text-lg font-medium">PDF Document</h4>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <a
//                   href={category.content.pdfUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
//                 >
//                   <FileBox size={20} />
//                   View PDF Document
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>
//         <DialogFooter>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
//           >
//             Close
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // Confirmation Dialog Component
// const ConfirmationDialog = ({ 
//   isOpen, 
//   onClose, 
//   onConfirm, 
//   title, 
//   description 
// }: { 
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   title: string;
//   description: string;
// }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[400px]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <AlertTriangle className="text-amber-500" size={20} />
//             {title}
//           </DialogTitle>
//           <DialogDescription>
//             {description}
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter className="mt-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
//           >
//             Delete
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // Custom Toast component
// const CustomToast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
//       type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//     }`}>
//       {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
//       <span>{message}</span>
//       <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
//         <X size={16} />
//       </button>
//     </div>
//   );
// };

// function Categories() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isLastCategory, setIsLastCategory] = useState(false);
//   const [showContentDialog, setShowContentDialog] = useState(false);
//   const [showPreviewDialog, setShowPreviewDialog] = useState(false);
//   const [previewCategory, setPreviewCategory] = useState<Category | null>(null);
//   const [contentType, setContentType] = useState<'text' | 'image' | 'pdf' | null>(null);
//   const [contentText, setContentText] = useState('');
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [uploadProgress, setUploadProgress] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
//   const [showMainCategoryDialog, setShowMainCategoryDialog] = useState(false);
//   const [mainCategoryName, setMainCategoryName] = useState('');
//   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState<Category | ParentCategory | null>(null);
//   const [deletingCategory, setDeletingCategory] = useState(false);

//   const token = localStorage.getItem('adminToken');
//   const apiBaseUrl = 'https://api.notesmarket.in/api';

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: contentType === 'image' 
//       ? { 'image/*': ['.png', '.jpg', '.jpeg'] } 
//       : contentType === 'pdf' 
//         ? { 'application/pdf': ['.pdf'] } 
//         : {},
//     onDrop: (acceptedFiles) => {
//       if (contentType === 'image' || contentType === 'pdf') {
//         const newFiles = acceptedFiles.map(file => ({
//           file,
//           type: contentType === 'image' ? 'image' as const : 'pdf' as const
//         }));
//         setUploadedFiles(newFiles);
//       }
//     },
//     disabled: !contentType || contentType === 'text',
//     maxFiles: contentType === 'pdf' ? 1 : 5,
//   });

//   const removeFile = (index: number) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const handlePreviewClick = (category: Category, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setPreviewCategory(category);
//     setShowPreviewDialog(true);
//   };

//   const handleDeleteClick = (category: Category | ParentCategory, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setCategoryToDelete(category);
//     setShowDeleteConfirmation(true);
//   };

//   const deleteCategory = async () => {
//     if (!categoryToDelete) return;
    
//     setDeletingCategory(true);
    
//     try {
//       const response = await fetch(`${apiBaseUrl}/categories/${categoryToDelete._id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.ok) {
//         setToast({
//           show: true,
//           message: `${categoryToDelete.name} deleted successfully`,
//           type: 'success'
//         });
        
//         // If deleting current selected category, reset selection
//         if (selectedCategory && selectedCategory._id === categoryToDelete._id) {
//           setSelectedCategory(null);
//         }
        
//         // Refresh the appropriate list
//         if ('parentId' in categoryToDelete && categoryToDelete.parentId) {
//           // It's a subcategory
//           fetchCategories(categoryToDelete.parentId);
//         } else {
//           // It's a main category
//           fetchParentCategories();
//           setCategories([]);
//         }
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to delete category');
//         setToast({
//           show: true,
//           message: `Failed to delete: ${errorData.message || 'Unknown error'}`,
//           type: 'error'
//         });
//       }
//     } catch (err) {
//       setError('Failed to delete category');
//       setToast({
//         show: true,
//         message: 'Failed to delete category due to a network error',
//         type: 'error'
//       });
//     } finally {
//       setDeletingCategory(false);
//       setShowDeleteConfirmation(false);
//       setCategoryToDelete(null);
//     }
//   };

//   const handleAddMainCategory = async () => {
//     if (!mainCategoryName.trim()) return;

//     try {
//       const response = await fetch(`${apiBaseUrl}/categories`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           name: mainCategoryName,
//           type: 'category'
//         })
//       });

//       if (response.ok) {
//         setToast({
//           show: true,
//           message: 'Main category created successfully',
//           type: 'success'
//         });
//         setMainCategoryName('');
//         setShowMainCategoryDialog(false);
//         fetchParentCategories();
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to create main category');
//       }
//     } catch (err) {
//       setError('Failed to create main category');
//     }
//   };

//   const fetchParentCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${apiBaseUrl}/categories/parents`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch parent categories');
//       }
      
//       const data = await response.json();
//       setParentCategories(data[0]?.parents || []);
//     } catch (err) {
//       setError('Failed to fetch parent categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async (parentId?: string) => {
//     try {
//       setLoading(true);
//       const url = parentId 
//         ? `${apiBaseUrl}/categories/subcategories/${parentId}`
//         : `${apiBaseUrl}/categories`;
      
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch categories');
//       }
      
//       const data = await response.json();
//       const subcategories = parentId && data[0]?.subcategories ? data[0].subcategories : data || [];
//       setCategories(subcategories);
//     } catch (err) {
//       setError('Failed to fetch categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchParentCategories();
//   }, []);

//   const handleCategoryClick = async (category: Category | ParentCategory) => {
//     setSelectedCategory(category as Category);
//     await fetchCategories(category._id);
//   };

//   const handleAddCategory = async () => {
//     if (!newCategoryName) return;

//     try {
//       const payload = {
//         name: newCategoryName,
//         type: isLastCategory ? 'content' : 'category',
//         ...(selectedCategory && { parentId: selectedCategory._id })
//       };

//       const response = await fetch(`${apiBaseUrl}/categories`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (response.ok) {
//         setToast({
//           show: true,
//           message: `${newCategoryName} added successfully`,
//           type: 'success'
//         });
        
//         setNewCategoryName('');
//         if (selectedCategory) {
//           fetchCategories(selectedCategory._id);
//         } else {
//           fetchParentCategories();
//         }

//         const data = await response.json();
//         if (isLastCategory) {
//           setSelectedCategory(data);
//         }
//       } else {
//         setError('Failed to add category');
//       }
//     } catch (err) {
//       setError('Failed to add category');
//     }
//   };

//   const openContentDialog = (type: 'text' | 'image' | 'pdf') => {
//     setContentType(type);
//     setContentText('');
//     setUploadedFiles([]);
//     setShowContentDialog(true);
//   };

//   const handleAddContent = async () => {
//     if (!selectedCategory || !contentType) return;
//     setUploadProgress(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('categoryid', selectedCategory._id);
      
//       if (contentType === 'text' && contentText.trim()) {
//         formData.append('text', contentText);
//       } else if (contentType === 'image') {
//         uploadedFiles.forEach(({ file }) => {
//           formData.append('images', file);
//         });
//       } else if (contentType === 'pdf' && uploadedFiles.length > 0) {
//         formData.append('pdf', uploadedFiles[0].file);
//       }

//       const response = await fetch(`${apiBaseUrl}/categories/content`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (response.ok) {
//         const data: ContentResponse = await response.json();
//         setToast({
//           show: true,
//           message: data.message || `${contentType} content added successfully`,
//           type: 'success'
//         });
        
//         setShowContentDialog(false);
//         setContentType(null);
//         setContentText('');
//         setUploadedFiles([]);
        
//         if (selectedCategory.parentId) {
//           fetchCategories(selectedCategory.parentId);
//         } else {
//           fetchParentCategories();
//         }
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || 'Failed to add content');
//       }
//     } catch (err) {
//       setError('Failed to add content');
//     } finally {
//       setUploadProgress(false);
//     }
//   };

//   const isContentCategory = (category: Category) => {
//     return category.type === 'content';
//   };

//   const hasContent = (category: Category) => {
//     return category.content && (
//       category.content.text ||
//       (category.content.imageUrls && category.content.imageUrls.length > 0) ||
//       category.content.pdfUrl
//     );
//   };

//   return (
//     <div className="flex gap-6">
//       {/* Tree View Sidebar */}
//       <div className="w-64 bg-white rounded-lg shadow-md p-4">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold">Categories</h2>
//           <button
//             onClick={() => setShowMainCategoryDialog(true)}
//             className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
//           >
//             <Plus size={16} />
//             <span>Main</span>
//           </button>
//         </div>
        
//         {loading && parentCategories.length === 0 ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-pulse text-gray-400">Loading categories...</div>
//           </div>
//         ) : (
//           <div className="space-y-1">
//             {parentCategories.map((parent) => (
//               <div key={parent._id} className="relative group">
//                 <TreeItem
//                   label={
//                     <div className="flex items-center justify-between w-full pr-8">
//                       <span>{parent.name}</span>
//                     </div>
//                   }
//                   defaultExpanded={selectedCategory?._id === parent._id}
//                   onClick={() => handleCategoryClick(parent)}
//                 >
//                   {categories.map((category) => (
//                     <div key={category._id} className="relative group">
//                       <TreeItem
//                         label={
//                           <div className="flex items-center justify-between w-full pr-8">
//                             <span>{category.name}</span>
//                           </div>
//                         }
//                         onClick={() => handleCategoryClick(category)}
//                       />
//                       <button
//                         onClick={(e) => handleDeleteClick(category, e)}
//                         className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
//                         title="Delete category"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   ))}
//                 </TreeItem>
//                 <button
//                   onClick={(e) => handleDeleteClick(parent, e)}
//                   className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
//                   title="Delete category"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 space-y-6">
//         {/* Add Category Form */}
//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center gap-4">
//               <input
//                 type="text"
//                 value={newCategoryName}
//                 onChange={(e) => setNewCategoryName(e.target.value)}
//                 placeholder="Enter category name"
//                 className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 onClick={handleAddCategory}
//                 disabled={!newCategoryName.trim()}
//                 className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 flex items-center gap-2 transition-all disabled:opacity-50"
//               >
//                 <Plus size={20} />
//                 Add {selectedCategory ? 'Sub' : ''}Category
//               </button>
//             </div>
//             {selectedCategory && (
//               <label className="flex items-center gap-2 text-sm text-gray-600">
//                 <input
//                   type="checkbox"
//                   checked={isLastCategory}
//                   onChange={(e) => setIsLastCategory(e.target.checked)}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span>This is a final category (will contain content)</span>
//               </label>
//             )}
//           </div>
//         </div>

//         {/* Selected Category Content */}
//         {selectedCategory && (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-xl font-semibold">{selectedCategory.name}</h2>
//               <button
//                 onClick={(e) => handleDeleteClick(selectedCategory, e)}
//                 className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1"
//                 title="Delete this category"
//               >
//                 <Trash2 size={18} />
//                 <span>Delete</span>
//               </button>
//             </div>
//             <p className="text-sm text-gray-500 mb-6">
//               Path: {selectedCategory.path.join(' > ')}
//             </p>
            
//             {/* Add Content Buttons for Final Categories */}
//             {isContentCategory(selectedCategory) && (
//               <div className="mb-6 flex gap-2">
//                 <button 
//                   onClick={() => openContentDialog('text')}
//                   className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
//                 >
//                   <FileText size={18} />
//                   Add Text
//                 </button>
//                 <button 
//                   onClick={() => openContentDialog('image')}
//                   className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-200 transition-colors"
//                 >
//                   <ImageIcon size={18} />
//                   Add Images
//                 </button>
//                 <button 
//                   onClick={() => openContentDialog('pdf')}
//                   className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-colors"
//                 >
//                   <FileBox size={18} />
//                   Add PDF
//                 </button>
//               </div>
//             )}
            
//             {/* Category Content Grid */}
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-pulse text-gray-400">Loading content...</div>
//               </div>
//             ) : categories.length === 0 ? (
//               <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
//                 <p className="text-gray-500">No subcategories found</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   Add a new {selectedCategory.type === 'content' ? 'content' : 'subcategory'} using the form above
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {categories.map((category) => (
//                   <div
//                     key={category._id}
//                     className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-100 relative group"
//                   >
//                     <div className="flex flex-col" onClick={() => handleCategoryClick(category)}>
//                       <h3 className="font-semibold text-lg">{category.name}</h3>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Type: {category.type}
//                       </p>
//                       <div className="flex gap-2 mt-2">
//                         {category.type === 'content' && category.content && (
//                           <>
//                             {category.content.text && (
//                               <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
//                                 <FileText size={14} className="mr-1" /> Text
//                               </span>
//                             )}
//                             {category.content.imageUrls?.length > 0 && (
//                               <span className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
//                                 <ImageIcon size={14} className="mr-1" /> Images ({category.content.imageUrls.length})
//                               </span>
//                             )}
//                             {category.content.pdfUrl && (
//                               <span className="inline-flex items-center bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
//                                 <FileBox size={14} className="mr-1" /> PDF
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="absolute top-2 right-2 flex gap-1">
//                       {hasContent(category) && (
//                         <button
//                           onClick={(e) => handlePreviewClick(category, e)}
//                           className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
//                           title="Preview Content"
//                         >
//                           <Eye size={16} />
//                         </button>
//                       )}
//                       <button
//                         onClick={(e) => handleDeleteClick(category, e)}
//                         className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
//                         title="Delete Category"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
//             <AlertTriangle size={20} />
//             {error}
//           </div>
//         )}
//       </div>

//       {/* Main Category Dialog */}
//       <Dialog open={showMainCategoryDialog} onOpenChange={setShowMainCategoryDialog}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Create Main Category</DialogTitle>
//             <DialogDescription>
//               Add a new main category to organize your content
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Category Name</label>
//               <input
//                 type="text"
//                 value={mainCategoryName}
//                 onChange={(e) => setMainCategoryName(e.target.value)}
//                 placeholder="Enter main category name"
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <button
//               onClick={() => setShowMainCategoryDialog(false)}
//               className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddMainCategory}
//               disabled={!mainCategoryName.trim()}
//               className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50"
//             >
//               Create Category
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Content Upload Dialog */}
//       <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>
//               {contentType === 'text' ? 'Add Text Content' : 
//                contentType === 'image' ? 'Add Images' : 
//                contentType === 'pdf' ? 'Add PDF Document' : 
//                'Add Content'} to {selectedCategory?.name}
//             </DialogTitle>
//             <DialogDescription>
//               {contentType === 'text' ? 'Add text content to this category' : 
//                contentType === 'image' ? 'Upload image files (JPG, PNG)' : 
//                contentType === 'pdf' ? 'Upload a PDF document' : 
//                'Add content to this category'}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             {contentType === 'text' && (
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Text Content</label>
//                 <textarea
//                   value={contentText}
//                   onChange={(e) => setContentText(e.target.value)}
//                   className="w-full min-h-[200px] rounded-lg border border-gray-300 p-2"
//                   placeholder="Enter text content..."
//                 />
//               </div>
//             )}
            
//             {(contentType === 'image' || contentType === 'pdf') && (
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">
//                   {contentType === 'image' ? 'Upload Images' : 'Upload PDF Document'}
//                 </label>
//                 <div
//                   {...getRootProps()}
//                   className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
//                 >
//                   <input {...getInputProps()} />
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-2 text-sm text-gray-600">
//                     Drag & drop {contentType === 'image' ? 'images' : 'PDF file'} here, or click to select
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {contentType === 'image' ? 'Supports: PNG, JPG, JPEG' : 'Supports: PDF files only'}
//                   </p>
//                 </div>
                
//                 {uploadedFiles.length > 0 && (
//                   <div className="mt-4">
//                     {contentType === 'image' && (
//                       <div className="mb-4">
//                         <h4 className="text-sm font-medium mb-2">Images ({uploadedFiles.length})</h4>
//                         <ul className="space-y-2">
//                           {uploadedFiles.map((file, index) => (
//                             <li key={`img-${index}`} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded">
//                               <div className="flex items-center gap-2">
//                                 <ImageIcon size={16} />
//                                 {file.file.name}
//                               </div>
//                               <button
//                                 onClick={() => removeFile(index)}
//                                 className="text-gray-400 hover:text-red-500 transition-colors"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
                    
//                     {contentType === 'pdf' && (
//                       <div>
//                         <h4 className="text-sm font-medium mb-2">PDF Document</h4>
//                         <ul className="space-y-2">
//                           {uploadedFiles.map((file, index) => (
//                             <li key={`pdf-${index}`} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded">
//                               <div className="flex items-center gap-2">
//                                 <FileBox size={16} />
//                                 {file.file.name}
//                               </div>
//                               <button
//                                 onClick={() => removeFile(index)}
//                                 className="text-gray-400 hover:text-red-500 transition-colors"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <button
//               onClick={() => setShowContentDialog(false)}
//               className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddContent}
//               disabled={uploadProgress || 
//                 (contentType === 'text' && !contentText.trim()) || 
//                 ((contentType === 'image' || contentType === 'pdf') && uploadedFiles.length === 0)}
//               className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50"
//             >
//               {uploadProgress ? 'Uploading...' : `Save ${contentType === 'text' ? 'Text' : contentType === 'image' ? 'Images' : 'PDF'}`}
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Content Preview Dialog */}
//       <ContentPreviewDialog
//         category={previewCategory}
//         isOpen={showPreviewDialog}
//         onClose={() => {
//           setShowPreviewDialog(false);
//           setPreviewCategory(null);
//         }}
//       />

//       {/* Delete Confirmation Dialog */}
//       <ConfirmationDialog
//         isOpen={showDeleteConfirmation}
//         onClose={() => {
//           setShowDeleteConfirmation(false);
//           setCategoryToDelete(null);
//         }}
//         onConfirm={deleteCategory}
//         title="Delete Category"
//         description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone${
//           categoryToDelete && !('parentId' in categoryToDelete) ? ' and will delete all subcategories.' : '.'
//         }`}
//       />

//       {/* Custom Toast Notification */}
//       {toast.show && (
//         <CustomToast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}
//     </div>
//   );
// }

// export default Categories;
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, ChevronRight, FileText, Image as ImageIcon, FileBox, Upload, X, CheckCircle, Eye, Trash2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { TreeItem } from '../ui/tree-view';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';

interface Category {
  _id: string;
  name: string;
  type: string;
  parentId?: string;
  path: string[];
  content?: {
    imageUrls: string[];
    pdfUrl?: string;
    text?: string;
  };
}

interface ParentCategory {
  _id: string;
  name: string;
  path: string[];
}

interface UploadedFile {
  file: File;
  type: 'image' | 'pdf';
}

interface ContentResponse {
  message: string;
  content: {
    imageUrls: string[];
    pdfUrl?: string;
    text?: string;
  };
}

// Content Preview Dialog Component
const ContentPreviewDialog = ({ 
  category, 
  isOpen, 
  onClose 
}: { 
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!category || !category.content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{category.name} - Content Preview</DialogTitle>
          <DialogDescription>
            Path: {category.path.join(' > ')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
          {/* Text Content */}
          {category.content.text && (
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Text Content</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{category.content.text}</p>
              </div>
            </div>
          )}

          {/* Images */}
          {category.content.imageUrls && category.content.imageUrls.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Images</h4>
              <div className="grid grid-cols-2 gap-4">
                {category.content.imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Content ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF */}
          {category.content.pdfUrl && (
            <div className="space-y-2">
              <h4 className="text-lg font-medium">PDF Document</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <a
                  href={category.content.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <FileBox size={20} />
                  View PDF Document
                </a>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Confirmation Dialog Component
const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Custom Toast component
const CustomToast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
        <X size={16} />
      </button>
    </div>
  );
};

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [previousCategory, setPreviousCategory] = useState<Category | null>(null);
  const [categoryStack, setCategoryStack] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLastCategory, setIsLastCategory] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewCategory, setPreviewCategory] = useState<Category | null>(null);
  const [contentType, setContentType] = useState<'text' | 'image' | 'pdf' | null>(null);
  const [contentText, setContentText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  const [showMainCategoryDialog, setShowMainCategoryDialog] = useState(false);
  const [mainCategoryName, setMainCategoryName] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | ParentCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  const token = localStorage.getItem('adminToken');
  const apiBaseUrl = 'https://api.notesmarket.in/api';

  const { getRootProps, getInputProps } = useDropzone({
    accept: contentType === 'image' 
      ? { 'image/*': ['.png', '.jpg', '.jpeg'] } 
      : contentType === 'pdf' 
        ? { 'application/pdf': ['.pdf'] } 
        : {},
    onDrop: (acceptedFiles) => {
      if (contentType === 'image' || contentType === 'pdf') {
        const newFiles = acceptedFiles.map(file => ({
          file,
          type: contentType === 'image' ? 'image' as const : 'pdf' as const
        }));
        setUploadedFiles(newFiles);
      }
    },
    disabled: !contentType || contentType === 'text',
    maxFiles: contentType === 'pdf' ? 1 : 5,
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreviewClick = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewCategory(category);
    setShowPreviewDialog(true);
  };

  const handleDeleteClick = (category: Category | ParentCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryToDelete(category);
    setShowDeleteConfirmation(true);
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    
    setDeletingCategory(true);
    
    try {
      const response = await fetch(`${apiBaseUrl}/categories/${categoryToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setToast({
          show: true,
          message: `${categoryToDelete.name} deleted successfully`,
          type: 'success'
        });
        
        // If deleting current selected category, reset selection
        if (selectedCategory && selectedCategory._id === categoryToDelete._id) {
          setSelectedCategory(null);
        }
        
        // Refresh the appropriate list
        if ('parentId' in categoryToDelete && categoryToDelete.parentId) {
          // It's a subcategory
          fetchCategories(categoryToDelete.parentId);
        } else {
          // It's a main category
          fetchParentCategories();
          setCategories([]);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete category');
        setToast({
          show: true,
          message: `Failed to delete: ${errorData.message || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (err) {
      setError('Failed to delete category');
      setToast({
        show: true,
        message: 'Failed to delete category due to a network error',
        type: 'error'
      });
    } finally {
      setDeletingCategory(false);
      setShowDeleteConfirmation(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddMainCategory = async () => {
    if (!mainCategoryName.trim()) return;

    try {
      const response = await fetch(`${apiBaseUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: mainCategoryName,
          type: 'category'
        })
      });

      if (response.ok) {
        setToast({
          show: true,
          message: 'Main category created successfully',
          type: 'success'
        });
        setMainCategoryName('');
        setShowMainCategoryDialog(false);
        fetchParentCategories();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create main category');
      }
    } catch (err) {
      setError('Failed to create main category');
    }
  };

  const fetchParentCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/categories/parents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch parent categories');
      }
      
      const data = await response.json();
      setParentCategories(data[0]?.parents || []);
    } catch (err) {
      setError('Failed to fetch parent categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (parentId?: string) => {
    try {
      setLoading(true);
      const url = parentId 
        ? `${apiBaseUrl}/categories/subcategories/${parentId}`
        : `${apiBaseUrl}/categories`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      const subcategories = parentId && data[0]?.subcategories ? data[0].subcategories : data || [];
      setCategories(subcategories);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const handleCategoryClick = async (category: Category | ParentCategory) => {
    // Save previous category for back navigation
    if (selectedCategory) {
      // Add current category to stack before changing
      setCategoryStack(prev => [...prev, selectedCategory as Category]);
    }
    
    setSelectedCategory(category as Category);
    await fetchCategories(category._id);
  };

  const handleGoBack = async () => {
    if (categoryStack.length > 0) {
      // Get the last category from stack
      const prevCategory = categoryStack[categoryStack.length - 1];
      
      // Remove the last category from stack
      setCategoryStack(prev => prev.slice(0, -1));
      
      // If it's a main category, clear the stack
      if (!prevCategory.parentId) {
        setCategoryStack([]);
      }
      
      // Set as selected category
      setSelectedCategory(prevCategory);
      
      // If it has a parent, fetch its siblings
      if (prevCategory.parentId) {
        await fetchCategories(prevCategory.parentId);
      } else {
        // If it's a main category, fetch its subcategories
        await fetchCategories(prevCategory._id);
        // Also refresh parent categories
        fetchParentCategories();
      }
    } else {
      // If stack is empty but we have a selected category with parentId
      if (selectedCategory && selectedCategory.parentId) {
        // Get the parent category
        try {
          const response = await fetch(`${apiBaseUrl}/categories/${selectedCategory.parentId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const parentCategory = await response.json();
            setSelectedCategory(parentCategory);
            
            // If parent has a parent, fetch siblings
            if (parentCategory.parentId) {
              await fetchCategories(parentCategory.parentId);
            } else {
              // If parent is a main category, fetch its subcategories
              await fetchCategories(parentCategory._id);
              fetchParentCategories();
            }
          }
        } catch (err) {
          setError('Failed to fetch parent category');
        }
      } else {
        // Reset to top level view
        setSelectedCategory(null);
        setCategories([]);
        fetchParentCategories();
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;

    try {
      const payload = {
        name: newCategoryName,
        type: isLastCategory ? 'content' : 'category',
        ...(selectedCategory && { parentId: selectedCategory._id })
      };

      const response = await fetch(`${apiBaseUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setToast({
          show: true,
          message: `${newCategoryName} added successfully`,
          type: 'success'
        });
        
        setNewCategoryName('');
        if (selectedCategory) {
          fetchCategories(selectedCategory._id);
        } else {
          fetchParentCategories();
        }

        const data = await response.json();
        if (isLastCategory) {
          setSelectedCategory(data);
        }
      } else {
        setError('Failed to add category');
      }
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const openContentDialog = (type: 'text' | 'image' | 'pdf') => {
    setContentType(type);
    setContentText('');
    setUploadedFiles([]);
    setShowContentDialog(true);
  };

  const handleAddContent = async () => {
    if (!selectedCategory || !contentType) return;
    setUploadProgress(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('categoryid', selectedCategory._id);
      
      if (contentType === 'text' && contentText.trim()) {
        formData.append('text', contentText);
      } else if (contentType === 'image') {
        uploadedFiles.forEach(({ file }) => {
          formData.append('images', file);
        });
      } else if (contentType === 'pdf' && uploadedFiles.length > 0) {
        formData.append('pdf', uploadedFiles[0].file);
      }

      const response = await fetch(`${apiBaseUrl}/categories/content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data: ContentResponse = await response.json();
        setToast({
          show: true,
          message: data.message || `${contentType} content added successfully`,
          type: 'success'
        });
        
        setShowContentDialog(false);
        setContentType(null);
        setContentText('');
        setUploadedFiles([]);
        
        if (selectedCategory.parentId) {
          fetchCategories(selectedCategory.parentId);
        } else {
          fetchParentCategories();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add content');
      }
    } catch (err) {
      setError('Failed to add content');
    } finally {
      setUploadProgress(false);
    }
  };

  const isContentCategory = (category: Category) => {
    return category.type === 'content';
  };

  const hasContent = (category: Category) => {
    return category.content && (
      category.content.text ||
      (category.content.imageUrls && category.content.imageUrls.length > 0) ||
      category.content.pdfUrl
    );
  };

  return (
    <div className="flex gap-6">
      {/* Tree View Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <button
            onClick={() => setShowMainCategoryDialog(true)}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
          >
            <Plus size={16} />
            <span>Main</span>
          </button>
        </div>
        
        {loading && parentCategories.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-gray-400">Loading categories...</div>
          </div>
        ) : (
          <div className="space-y-1">
            {parentCategories.map((parent) => (
              <div key={parent._id} className="relative group">
                <TreeItem
                  label={
                    <div className="flex items-center justify-between w-full pr-8">
                      <span>{parent.name}</span>
                    </div>
                  }
                  defaultExpanded={selectedCategory?._id === parent._id}
                  onClick={() => handleCategoryClick(parent)}
                >
                  {categories.map((category) => (
                    <div key={category._id} className="relative group">
                      <TreeItem
                        label={
                          <div className="flex items-center justify-between w-full pr-8">
                            <span>{category.name}</span>
                          </div>
                        }
                        onClick={() => handleCategoryClick(category)}
                      />
                      <button
                        onClick={(e) => handleDeleteClick(category, e)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </TreeItem>
                <button
                  onClick={(e) => handleDeleteClick(parent, e)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Add Category Form */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Plus size={20} />
                Add {selectedCategory ? 'Sub' : ''}Category
              </button>
            </div>
            {selectedCategory && (
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={isLastCategory}
                  onChange={(e) => setIsLastCategory(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>This is a final category (will contain content)</span>
              </label>
            )}
          </div>
        </div>

        {/* Selected Category Content */}
        {selectedCategory && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              {/* Back button added here */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                  title="Go back to previous category"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <h2 className="text-xl font-semibold">{selectedCategory.name}</h2>
              </div>
              <button
                onClick={(e) => handleDeleteClick(selectedCategory, e)}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1"
                title="Delete this category"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Path: {selectedCategory.path.join(' > ')}
            </p>
            
            {/* Add Content Buttons for Final Categories */}
            {isContentCategory(selectedCategory) && (
              <div className="mb-6 flex gap-2">
                <button 
                  onClick={() => openContentDialog('text')}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-colors"
                >
                  <FileText size={18} />
                  Add Text
                </button>
                <button 
                  onClick={() => openContentDialog('image')}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-200 transition-colors"
                >
                  <ImageIcon size={18} />
                  Add Images
                </button>
                <button 
                  onClick={() => openContentDialog('pdf')}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-colors"
                >
                  <FileBox size={18} />
                  Add PDF
                </button>
              </div>
            )}
            
            {/* Category Content Grid */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-gray-400">Loading content...</div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No subcategories found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add a new {selectedCategory.type === 'content' ? 'content' : 'subcategory'} using the form above
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-100 relative group"
                  >
                    <div className="flex flex-col" onClick={() => handleCategoryClick(category)}>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Type: {category.type}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {category.type === 'content' && category.content && (
                          <>
                            {category.content.text && (
                              <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                <FileText size={14} className="mr-1" /> Text
                              </span>
                            )}
                            {category.content.imageUrls?.length > 0 && (
                              <span className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                                <ImageIcon size={14} className="mr-1" /> Images ({category.content.imageUrls.length})
                              </span>
                            )}
                            {category.content.pdfUrl && (
                              <span className="inline-flex items-center bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
                                <FileBox size={14} className="mr-1" /> PDF
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 flex gap-1">
                      {hasContent(category) && (
                        <button
                          onClick={(e) => handlePreviewClick(category, e)}
                          className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Preview Content"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteClick(category, e)}
                        className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}
      </div>

      {/* Main Category Dialog */}
      <Dialog open={showMainCategoryDialog} onOpenChange={setShowMainCategoryDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create Main Category</DialogTitle>
            <DialogDescription>
              Add a new top-level category that will be displayed in the sidebar.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <input
              type="text"
              value={mainCategoryName}
              onChange={(e) => setMainCategoryName(e.target.value)}
              placeholder="Enter main category name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setShowMainCategoryDialog(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMainCategory}
              disabled={!mainCategoryName.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              Create
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Add {contentType === 'text' ? 'Text' : contentType === 'image' ? 'Images' : 'PDF'} Content
            </DialogTitle>
            <DialogDescription>
              {contentType === 'text' 
                ? 'Add text content to this category' 
                : contentType === 'image' 
                  ? 'Upload images (maximum 5)' 
                  : 'Upload a PDF document'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {contentType === 'text' ? (
              <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Enter text content here..."
                className="w-full h-64 rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed ${
                  uploadedFiles.length > 0 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                } rounded-lg p-8 text-center cursor-pointer hover:bg-gray-100 transition-colors`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="text-gray-600">
                    Drag & drop {contentType === 'image' ? 'images' : 'a PDF file'} here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    {contentType === 'image' 
                      ? 'Supports: PNG, JPG, JPEG (max 5 files)' 
                      : 'Supports: PDF format (1 file)'}
                  </p>
                </div>
              </div>
            )}

            {/* File Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} selected:
                </h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        {file.type === 'image' ? (
                          <ImageIcon size={18} className="text-green-600" />
                        ) : (
                          <FileBox size={18} className="text-red-600" />
                        )}
                        <span className="text-sm truncate max-w-xs">{file.file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowContentDialog(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleAddContent}
              disabled={
                (contentType === 'text' && !contentText.trim()) ||
                (contentType !== 'text' && uploadedFiles.length === 0) ||
                uploadProgress
              }
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {uploadProgress ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Content
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <ContentPreviewDialog
        category={previewCategory}
        isOpen={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={deleteCategory}
        title={`Delete ${categoryToDelete?.name}?`}
        description={`This will permanently delete the category${
          categoryToDelete?.type !== 'content' ? ' and all its subcategories' : ''
        }. This action cannot be undone.`}
      />

      {/* Toast notification */}
      {toast.show && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default Categories;