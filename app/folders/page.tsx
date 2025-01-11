'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Folder, File, Upload, Link, Trash2 } from 'lucide-react'

interface FolderType {
  id: number
  name: string
  files: FileType[]
}

interface FileType {
  id: number
  name: string
  type: 'image' | 'video'
  url: string
}

export default function Folders() {
  const [folders, setFolders] = useState<FolderType[]>([])
  const [newFolderName, setNewFolderName] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateFolder = () => {
    if (newFolderName) {
      setFolders([...folders, { id: Date.now(), name: newFolderName, files: [] }])
      setNewFolderName('')
    }
  }

  const handleOpenFolder = (folder: FolderType) => {
    setSelectedFolder(folder)
    setIsModalOpen(true)
  }

  const handleShareLink = () => {
    if (selectedFolder) {
      // In a real application, you would generate a unique sharing link here
      const sharingLink = `https://yourdomain.com/share/${selectedFolder.id}`
      alert(`Sharing link for ${selectedFolder.name}: ${sharingLink}`)
    }
  }

  const handleDeleteFolder = (id: number) => {
    setFolders(folders.filter(folder => folder.id !== id))
    setIsModalOpen(false)
  }

  const handleUploadFile = () => {
    // In a real application, you would implement file upload functionality here
    alert('File upload functionality would be implemented here')
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Client Folders</h1>
      <div className="mb-6">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {folders.map(folder => (
          <div
            key={folder.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow relative"
            onClick={() => handleOpenFolder(folder)}
          >
            <Folder className="w-16 h-16 text-blue-500 mx-auto mb-2" />
            <p className="text-center text-sm font-medium truncate">{folder.name}</p>
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteFolder(folder.id)
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
          <div className="flex justify-between items-center mb-4">
            <Button onClick={handleUploadFile} className="flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button onClick={handleShareLink} className="flex items-center">
              <Link className="w-4 h-4 mr-2" />
              Share Folder
            </Button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {selectedFolder && selectedFolder.files.length > 0 ? (
              selectedFolder.files.map(file => (
                <div key={file.id} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    {file.type === 'image' ? (
                      <File className="w-5 h-5 mr-2 text-green-500" />
                    ) : (
                      <File className="w-5 h-5 mr-2 text-blue-500" />
                    )}
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No files uploaded</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

