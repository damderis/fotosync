'use client'

import { useState, useCallback } from 'react'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Folder, File, Upload, Share2, ArrowUp, Trash2 } from 'lucide-react'
import { useFolders } from '@/hooks/useFolders'
import type { Folder as FolderType } from '@/types/firebase'
import { useDropzone } from 'react-dropzone'

export default function Folders() {
  const { folders, createFolder, uploadFile, getFolderShareLink, deleteFolder } = useFolders()
  const [newFolderName, setNewFolderName] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFileToUpload(acceptedFiles[0])
      const objectUrl = URL.createObjectURL(acceptedFiles[0])
      setPreviewUrl(objectUrl)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  })

  const handleCreateFolder = () => {
    if (newFolderName) {
      createFolder(newFolderName)
      setNewFolderName('')
    }
  }

  const handleOpenFolder = (folder: FolderType) => {
    setSelectedFolder(folder)
    setIsModalOpen(true)
  }

  const handleUploadFile = async () => {
    if (selectedFolder && fileToUpload) {
      try {
        await uploadFile(selectedFolder.id, fileToUpload)
        setFileToUpload(null)
        setPreviewUrl(null)
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
  }

  const handleShare = (folderId: string) => {
    const link = getFolderShareLink(folderId)
    navigator.clipboard.writeText(link)
    alert('Share link copied to clipboard!')
  }

  return (
    <Layout>
      <div className="px-8 py-1">
        <h1 className="text-3xl font-bold mb-6">Client Folders</h1>
        <div className="flex space-x-2">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="max-w-xs"
          />
          <Button onClick={handleCreateFolder}>Create Folder</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-8 py-1 mt-4">
        {folders.map(folder => (
          <div
            key={folder.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow relative"
            onClick={() => handleOpenFolder(folder)}
          >
            <Folder className="w-16 h-16 text-primary mx-auto mb-2" />
            <p className="text-center text-sm font-medium truncate">{folder.name}</p>
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                deleteFolder(folder.id)
              }}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedFolder?.name}</DialogTitle>
          </DialogHeader>
          
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <div className="space-y-4">
                <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto" />
                <p className="text-sm text-gray-500">{fileToUpload?.name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p>Drag & drop an image here, or click to select</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => handleShare(selectedFolder?.id || '')}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            {fileToUpload && (
              <Button onClick={handleUploadFile} className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                Confirm Upload
              </Button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto mt-4">
            {selectedFolder?.files?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {selectedFolder.files.map((file) => (
                  <div key={file.id} className="relative group">
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No files uploaded
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

