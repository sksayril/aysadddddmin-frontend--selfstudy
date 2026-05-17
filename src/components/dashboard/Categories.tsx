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
//                   {...getPdfRootProps()}
//                   className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
//                 >
//                   <input {...getPdfInputProps()} />
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
        
//         {loadingParents ? (
//           <SidebarCategoriesSkeleton />
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
//                   {...getPdfRootProps()}
//                   className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
//                 >
//                   <input {...getPdfInputProps()} />
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
import { Plus, ChevronRight, FileText, Image as ImageIcon, FileBox, Upload, X, CheckCircle, Eye, Trash2, AlertTriangle, ArrowLeft, Link, Folder, Pencil } from 'lucide-react';
import { TreeItem } from '../ui/tree-view';
import { cn } from '../../lib/utils';
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
  type: 'image';
}

function parseImageUrls(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
      }
    } catch {
      // fall through to line/comma split
    }
  }
  return trimmed.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

function appendImagesToFormData(formData: FormData, files: UploadedFile[], urlInput: string) {
  files.forEach(({ file }) => formData.append('images', file));
  const urls = parseImageUrls(urlInput);
  if (urls.length === 0) return;
  if (urls.length === 1) {
    formData.append('images', urls[0]);
  } else {
    formData.append('images', JSON.stringify(urls));
  }
}

interface ContentResponse {
  message: string;
  content: {
    imageUrls: string[];
    pdfUrl?: string;
    text?: string;
  };
}

function ContentBadges({ content }: { content?: Category['content'] }) {
  if (!content) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {content.text && (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
          <FileText size={12} /> Text
        </span>
      )}
      {content.imageUrls && content.imageUrls.length > 0 && (
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
          <ImageIcon size={12} /> {content.imageUrls.length} image{content.imageUrls.length > 1 ? 's' : ''}
        </span>
      )}
      {content.pdfUrl && (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
          <FileBox size={12} /> PDF
        </span>
      )}
    </div>
  );
}

function SkeletonBone({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200/90', className)} aria-hidden />;
}

function SidebarCategoriesSkeleton() {
  return (
    <div className="space-y-3 py-1" aria-label="Loading categories">
      {[72, 88, 64].map((width, i) => (
        <div key={i} className="flex items-center gap-2 pl-1">
          <SkeletonBone className="h-4 w-4 shrink-0 rounded" />
          <SkeletonBone className="h-4" style={{ width: `${width}%` }} />
        </div>
      ))}
      <div className="ml-4 space-y-2.5 border-l border-gray-100 pl-3 pt-1">
        {[90, 75, 82].map((width, i) => (
          <SkeletonBone key={i} className="h-3.5" style={{ width: `${width}%` }} />
        ))}
      </div>
    </div>
  );
}

function CategoryDetailHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <SkeletonBone className="h-10 w-20 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBone className="h-7 w-48 max-w-full" />
          <SkeletonBone className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <SkeletonBone className="h-10 w-24 shrink-0 rounded-lg" />
    </div>
  );
}

function CategoryCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-label="Loading subcategories">
      <SkeletonBone className="h-4 w-28" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 space-y-3">
            <div className="flex items-start gap-3">
              <SkeletonBone className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <SkeletonBone className="h-5 w-3/4" />
                <SkeletonBone className="h-3 w-16" />
                <div className="flex gap-1.5 pt-1">
                  <SkeletonBone className="h-5 w-12 rounded-full" />
                  <SkeletonBone className="h-5 w-14 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentPanelSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden" aria-label="Loading content">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="space-y-2">
          <SkeletonBone className="h-5 w-24" />
          <div className="flex gap-2">
            <SkeletonBone className="h-5 w-14 rounded-full" />
            <SkeletonBone className="h-5 w-12 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonBone className="h-9 w-24 rounded-lg" />
          <SkeletonBone className="h-9 w-20 rounded-lg" />
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <SkeletonBone className="h-3 w-12" />
          <SkeletonBone className="h-4 w-full" />
          <SkeletonBone className="h-4 w-5/6" />
          <SkeletonBone className="h-4 w-2/3" />
        </div>
        <SkeletonBone className="h-10 w-32 rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBone key={i} className="h-16 w-16 shrink-0 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

function BreadcrumbNav({ path }: { path: string[] }) {
  if (!path.length) return null;
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm mb-5" aria-label="Breadcrumb">
      {path.map((segment, i) => (
        <React.Fragment key={`${segment}-${i}`}>
          {i > 0 && <ChevronRight size={14} className="text-gray-300 shrink-0" />}
          <span
            className={
              i === path.length - 1
                ? 'text-gray-900 font-semibold'
                : 'text-gray-500'
            }
          >
            {segment}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}

function LeafContentPanel({
  category,
  onEdit,
  onPreview,
}: {
  category: Category;
  onEdit: () => void;
  onPreview: () => void;
}) {
  const hasAny =
    category.content &&
    (category.content.text ||
      category.content.pdfUrl ||
      (category.content.imageUrls && category.content.imageUrls.length > 0));

  if (!hasAny) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/80 p-10 text-center">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-800 mb-1">No content yet</h3>
        <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
          Add notes, a PDF, and images for this topic. You can upload files or paste URLs.
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Upload size={18} />
          Add content
        </button>
      </div>
    );
  }

  const { content } = category;
  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white/80">
        <div>
          <h3 className="font-semibold text-gray-900">Content</h3>
          <ContentBadges content={content} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {content?.text && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
              {content.text}
            </p>
          </div>
        )}
        {content?.pdfUrl && (
          <a
            href={content.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors w-fit"
          >
            <FileBox size={16} />
            Open PDF
          </a>
        )}
        {content?.imageUrls && content.imageUrls.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {content.imageUrls.slice(0, 4).map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="h-16 w-16 rounded-lg object-cover border border-gray-200 shrink-0"
              />
            ))}
            {content.imageUrls.length > 4 && (
              <span className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600 shrink-0">
                +{content.imageUrls.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
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
  const [loadingParents, setLoadingParents] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [error, setError] = useState('');
  const [isLastCategory, setIsLastCategory] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewCategory, setPreviewCategory] = useState<Category | null>(null);
  const [contentType, setContentType] = useState<'text' | 'image' | 'pdf' | null>(null);
  const [contentText, setContentText] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageUrlsInput, setImageUrlsInput] = useState('');
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

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => ({ file, type: 'image' as const })),
      ].slice(0, 5));
    },
    disabled: !showContentDialog,
    maxFiles: 5,
  });

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setPdfFile(acceptedFiles[0]);
        setPdfUrl('');
      }
    },
    disabled: !showContentDialog,
    maxFiles: 1,
  });

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetContentForm = () => {
    setContentType(null);
    setContentText('');
    setPdfUrl('');
    setPdfFile(null);
    setImageUrlsInput('');
    setUploadedFiles([]);
  };

  const hasContentToSubmit = () => {
    if (contentText.trim()) return true;
    if (pdfFile || pdfUrl.trim()) return true;
    if (uploadedFiles.length > 0 || parseImageUrls(imageUrlsInput).length > 0) return true;
    return false;
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
      setLoadingParents(true);
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
      setLoadingParents(false);
    }
  };

  const fetchCategories = async (parentId?: string) => {
    try {
      setLoadingChildren(true);
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
      setLoadingChildren(false);
    }
  };

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchCategoryById = async (id: string): Promise<Category | null> => {
    try {
      const response = await fetch(`${apiBaseUrl}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // ignore
    }
    return null;
  };

  const handleCategoryClick = async (category: Category | ParentCategory) => {
    setError('');
    setLoadingChildren(true);
    if (selectedCategory && selectedCategory._id !== category._id) {
      setCategoryStack((prev) => [...prev, selectedCategory]);
    }

    const full = await fetchCategoryById(category._id);
    const next = full ?? (category as Category);
    setSelectedCategory(next);
    setIsLastCategory(next.type === 'content');
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

  const openContentDialog = (type?: 'text' | 'image' | 'pdf') => {
    resetContentForm();
    setContentType(type ?? null);
    if (selectedCategory?.content) {
      setContentText(selectedCategory.content.text ?? '');
      setPdfUrl(selectedCategory.content.pdfUrl ?? '');
      if (selectedCategory.content.imageUrls?.length) {
        setImageUrlsInput(JSON.stringify(selectedCategory.content.imageUrls));
      }
    }
    setShowContentDialog(true);
  };

  const buildContentFormData = (): FormData | null => {
    if (!selectedCategory) return null;

    const isLeaf = isContentCategory(selectedCategory);
    const formData = new FormData();
    formData.append('categoryid', selectedCategory._id);

    const hasText = contentText.trim().length > 0;
    const hasImages = uploadedFiles.length > 0 || parseImageUrls(imageUrlsInput).length > 0;

    if (!isLeaf && contentType) {
      if (contentType === 'text' && hasText) {
        formData.append('text', contentText.trim());
      } else if (contentType === 'pdf') {
        if (pdfFile) formData.append('pdf', pdfFile);
        else if (pdfUrl.trim()) formData.append('pdf', pdfUrl.trim());
      } else if (contentType === 'image') {
        appendImagesToFormData(formData, uploadedFiles, imageUrlsInput);
      }
      return formData;
    }

    if (hasText) formData.append('text', contentText.trim());
    if (pdfFile) formData.append('pdf', pdfFile);
    else if (pdfUrl.trim()) formData.append('pdf', pdfUrl.trim());
    if (hasImages) appendImagesToFormData(formData, uploadedFiles, imageUrlsInput);

    return formData;
  };

  const handleAddContent = async () => {
    if (!selectedCategory) return;

    const isLeaf = isContentCategory(selectedCategory);
    if (!isLeaf && !contentType) return;
    if (!hasContentToSubmit()) return;

    if (!isLeaf && contentType) {
      const typesProvided = [
        contentText.trim() ? 'text' : null,
        pdfFile || pdfUrl.trim() ? 'pdf' : null,
        uploadedFiles.length > 0 || parseImageUrls(imageUrlsInput).length > 0 ? 'images' : null,
      ].filter(Boolean);
      if (typesProvided.length > 1) {
        setError('Non-leaf categories accept only one content type per request (text, pdf, or images).');
        return;
      }
    }

    setUploadProgress(true);
    setError('');

    try {
      const formData = buildContentFormData();
      if (!formData) return;

      const response = await fetch(`${apiBaseUrl}/categories/content`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data: ContentResponse = await response.json();
        setToast({
          show: true,
          message: data.message || 'Content saved successfully',
          type: 'success',
        });

        setShowContentDialog(false);
        resetContentForm();

        const refreshed = await fetchCategoryById(selectedCategory._id);
        if (refreshed) {
          setSelectedCategory(refreshed);
        }

        if (selectedCategory.parentId) {
          fetchCategories(selectedCategory.parentId);
        } else {
          fetchParentCategories();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to add content');
      }
    } catch {
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

  const childCategories = selectedCategory
    ? categories.filter((c) => c._id !== selectedCategory._id)
    : categories;

  const canAddSubcategory = selectedCategory && !isContentCategory(selectedCategory);

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
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
        
        {loadingParents ? (
          <SidebarCategoriesSkeleton />
        ) : (
          <div className="space-y-1">
            {parentCategories.map((parent) => (
              <div key={parent._id} className="relative group">
                <TreeItem
                  label={parent.name}
                  isSelected={selectedCategory?._id === parent._id}
                  defaultExpanded={
                    selectedCategory?.path?.[0] === parent.name ||
                    selectedCategory?._id === parent._id
                  }
                  onClick={() => handleCategoryClick(parent)}
                >
                  {categories.map((category) => (
                    <div key={category._id} className="relative group">
                      <TreeItem
                        label={category.name}
                        isSelected={selectedCategory?._id === category._id}
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
        {(!selectedCategory || canAddSubcategory) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Folder size={18} className="text-blue-600" />
              {selectedCategory ? 'Add subcategory' : 'Add main category'}
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && newCategoryName.trim() && handleAddCategory()}
                placeholder={selectedCategory ? 'Subcategory name' : 'Main category name'}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm font-medium shrink-0"
              >
                <Plus size={18} />
                Add category
              </button>
            </div>
            {selectedCategory && canAddSubcategory && (
              <label className="mt-3 flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLastCategory}
                  onChange={(e) => setIsLastCategory(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  <strong className="text-gray-900">Final category</strong> — holds notes, PDF, and images (no further subcategories).
                </span>
              </label>
            )}
          </div>
        )}


        {!selectedCategory && (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <Folder className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Select a category</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Choose a category from the sidebar to manage subcategories or upload content.
            </p>
          </div>
        )}

        {selectedCategory && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {loadingChildren ? (
              <>
                <CategoryDetailHeaderSkeleton />
                <SkeletonBone className="h-4 w-48 max-w-full mb-5 rounded" />
                {isContentCategory(selectedCategory) ? (
                  <ContentPanelSkeleton />
                ) : (
                  <CategoryCardsSkeleton />
                )}
              </>
            ) : (
              <>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
              <div className="flex items-center gap-3 min-w-0">
                <button type="button" onClick={handleGoBack} className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 shrink-0">
                  <ArrowLeft size={18} />
                  <span className="text-sm hidden sm:inline">Back</span>
                </button>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">{selectedCategory.name}</h2>
                  <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${isContentCategory(selectedCategory) ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-700'}`}>
                    {isContentCategory(selectedCategory) ? 'Content topic' : 'Folder'}
                  </span>
                </div>
              </div>
              <button type="button" onClick={(e) => handleDeleteClick(selectedCategory, e)} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 shrink-0">
                <Trash2 size={18} />
                <span className="text-sm">Delete</span>
              </button>
            </div>
            <BreadcrumbNav path={selectedCategory.path} />
            {isContentCategory(selectedCategory) ? (
              <LeafContentPanel category={selectedCategory} onEdit={() => openContentDialog()} onPreview={() => { setPreviewCategory(selectedCategory); setShowPreviewDialog(true); }} />
            ) : childCategories.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                <Folder className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No subcategories yet</p>
                <p className="text-sm text-gray-500 mt-1">Use the form above to add one.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">{childCategories.length} subcategor{childCategories.length === 1 ? 'y' : 'ies'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {childCategories.map((category) => (
                    <article key={category._id} className="group relative rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer" onClick={() => handleCategoryClick(category)}>
                      <div className="flex items-start gap-3 pr-16">
                        <div className={`p-2 rounded-lg shrink-0 ${category.type === 'content' ? 'bg-violet-50' : 'bg-blue-50'}`}>
                          {category.type === 'content' ? <FileText size={20} className="text-violet-600" /> : <Folder size={20} className="text-blue-600" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">{category.type}</p>
                          {category.type === 'content' && <ContentBadges content={category.content} />}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1">
                        {hasContent(category) && <button type="button" onClick={(e) => handlePreviewClick(category, e)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Preview"><Eye size={16} /></button>}
                        <button type="button" onClick={(e) => handleDeleteClick(category, e)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
              </>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl flex items-center gap-2">
            <AlertTriangle size={20} className="shrink-0" />
            <span className="text-sm">{error}</span>
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
      <Dialog
        open={showContentDialog}
        onOpenChange={(open) => {
          setShowContentDialog(open);
          if (!open) resetContentForm();
        }}
      >
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Content</DialogTitle>
            <DialogDescription>
              Add or update notes, a PDF (upload or link), and images (upload or links). All fields are optional.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <section className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText size={16} className="text-blue-600" />
                Notes / description <span className="text-gray-400 font-normal">(text)</span>
              </label>
              <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="e.g. Chapter 1 – Motion"
                className="w-full h-28 rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </section>

            <section className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileBox size={16} className="text-red-600" />
                PDF <span className="text-gray-400 font-normal">(pdf — file or URL)</span>
              </label>
              <div
                {...getPdfRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  pdfFile ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input {...getPdfInputProps()} />
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {pdfFile ? pdfFile.name : 'Drop a PDF here or click to browse'}
                </p>
                {pdfFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPdfFile(null);
                    }}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    Remove file
                  </button>
                )}
              </div>
              <div className="relative">
                <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => {
                    setPdfUrl(e.target.value);
                    if (e.target.value.trim()) setPdfFile(null);
                  }}
                  disabled={Boolean(pdfFile)}
                  placeholder="https://example.com/notes/chapter1.pdf"
                  className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </section>

            <section className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ImageIcon size={16} className="text-green-600" />
                Images <span className="text-gray-400 font-normal">(images — files or URLs)</span>
              </label>
              <div
                {...getImageRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  uploadedFiles.length > 0 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input {...getImageInputProps()} />
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drop images here or click to browse (max 5)</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG, WebP</p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0">
                        <ImageIcon size={18} className="text-green-600 shrink-0" />
                        <span className="text-sm truncate">{file.file.name}</span>
                        <span className="text-xs text-gray-500 shrink-0">
                          ({(file.file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded-full shrink-0"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Image URLs — one per line, comma-separated, or JSON array
                </label>
                <textarea
                  value={imageUrlsInput}
                  onChange={(e) => setImageUrlsInput(e.target.value)}
                  placeholder='["https://example.com/thumb1.jpg","https://example.com/thumb2.jpg"]'
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </section>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setShowContentDialog(false);
                resetContentForm();
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddContent}
              disabled={!hasContentToSubmit() || uploadProgress}
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
                  Save Content
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
          categoryToDelete && 'type' in categoryToDelete && categoryToDelete.type !== 'content'
            ? ' and all its subcategories'
            : ''
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