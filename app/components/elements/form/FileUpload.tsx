import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { FileUploader } from "react-drag-drop-files";
import UploadIcon from '../icons/UploadIcon';
import ArrowPathIcon from '../icons/ArrowPathIcon';

export type UploadedFileDetails = {
  file: File
  fileName: string
  fileExt: string
  fileSize: number
  fileSizeInBytes: number
  cloudinaryPublicUrl?: string
  publicUrl?: string
  uploadedFile: Record<string, unknown>
  uploadResponse: unknown
}

type FileUploadProps = {
  hasError?: string | boolean
  returnFileDetails: (details: UploadedFileDetails | null) => void
  fieldLabel?: string
  requiredField?: boolean
  preAddedFile?: string
  preAddedFileName?: string
  acceptedFormats?: string[]
  maxFileSize?: number
  uploadUrl: string
  uploadHeaders?: Record<string, string>
  onError?: (message: string) => void
}

const UploaderChildren = ({ hasFile, allowedFormats }: { hasFile: boolean; allowedFormats: string[] }) => (
  <div className='rounded-md text-center'>
    <UploadIcon className='w-6 h-6 text-gray-400 mx-auto' />
    <p className='text-xs text-gray-500 mb-1 mt-1'>Click or drop file here to {hasFile ? 'change' : 'upload'}</p>
    <p className='text-xs text-gray-400'>Allowed formats: {allowedFormats.join(', ')}</p>
  </div>
)

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message
  }
  return error instanceof Error ? error.message : 'File upload failed'
}

const FileUpload = ({
  hasError,
  returnFileDetails,
  fieldLabel,
  requiredField,
  preAddedFile,
  preAddedFileName = '',
  acceptedFormats,
  maxFileSize,
  uploadUrl,
  uploadHeaders,
  onError,
}: FileUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileExt, setFileExt] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const uploadedFileRef = useRef<string | null>(null)

  const allowedFormats = acceptedFormats ? acceptedFormats : ['jpg', 'jpeg', 'png', 'pdf']
  const maxUploadSizeInMB = maxFileSize ? (maxFileSize > 1000 ? maxFileSize / (1024 * 1024) : maxFileSize) : 4

  useEffect(() => {
    uploadedFileRef.current = uploadedFile
  }, [uploadedFile])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()

      if (uploadedFileRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedFileRef.current)
      }
    }
  }, [])

  const uploadSelectedFile = async (addedFile: File) => {

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    if (uploadedFile && uploadedFile.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedFile)
    }

    const localPreviewUrl = URL.createObjectURL(addedFile)
    const parsedFileExt = addedFile.name.split('.').pop() ?? ''
    const parsedFileName = addedFile.name.split('.').slice(0, -1).join('.') || addedFile.name
    const parsedFileSize = addedFile.size / 1000000

    setUploadedFile(localPreviewUrl)
    setFileSize(parsedFileSize)
    setFileName(parsedFileName)
    setFileExt(parsedFileExt)
    setUploadError(null)
    setUploadProgress(0)
    setIsUploading(true)
    setSelectedFile(addedFile)

    try {
      const formData = new FormData()
      formData.append('file', addedFile)

      const response = await axios.post(uploadUrl, formData, {
        headers: { ...uploadHeaders, 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) {
            return
          }

          const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentComplete)
        }
      })

      const uploadedPayload: Record<string, unknown> = response?.data?.data || response?.data || {}
      const cloudinaryPublicUrl =
        typeof uploadedPayload.file === 'string' ? uploadedPayload.file : undefined
      const uploadedFileDetails = {
        file: addedFile,
        fileName: addedFile.name,
        fileExt: parsedFileExt,
        fileSize: parsedFileSize,
        fileSizeInBytes: addedFile.size,
        cloudinaryPublicUrl,
        publicUrl: cloudinaryPublicUrl,
        uploadedFile: uploadedPayload,
        uploadResponse: response?.data
      }

      setUploadProgress(100)
      returnFileDetails(uploadedFileDetails)
    } catch (error) {
      if (axios.isCancel(error)) {
        setUploadError('Upload canceled')
        setUploadProgress(0)
        return
      }

      const errorMessage = getErrorMessage(error)

      setUploadError(errorMessage)
      setUploadProgress(0)
      onError?.(errorMessage)
    } finally {
      abortControllerRef.current = null
      setIsUploading(false)
    }
  }

  const handleFile = (added: File | File[]) => {
    const addedFile = Array.isArray(added) ? added[0] : added
    if (addedFile) {
      void uploadSelectedFile(addedFile)
    }
  }

  const cancelUpload = () => {
    abortControllerRef.current?.abort()
  }

  const retryUpload = () => {
    if (!selectedFile || isUploading) {
      return
    }

    void uploadSelectedFile(selectedFile)
  }

  const toggleChange = () => {
    if (uploadedFile || preAddedFile) {
      setUploadedFile(null)
      setFileName(null)
      setFileExt(null)
      setFileSize(null)
      setUploadProgress(0)
      setIsUploading(false)
      setUploadError(null)
      setSelectedFile(null)

      returnFileDetails(null)
    }
  }

  return (
    <div className='relative'>
      {!preAddedFile &&<div className="flex items-center justify-between">
          <label
              className={`text-sm lg:text-md cursor-text z-10 relative py-1 transition mb-1 block duration-200  
              ${hasError ? 'text-red-400' : 'text-gray-500 dark:text-gray-300'}`}
          >
              {fieldLabel} {requiredField && <span className='text-red-400'>*</span>}
          </label>
          <span className='text-xs text-red-400'>{typeof hasError === 'string' ? hasError : ''}</span>
      </div>}
      <div className={`${hasError ? 'border-red-400' : 'border-gray-400'} border-dashed my-1 rounded block border bg-transparent items-center relative w-full p-4`}>

          {!isUploading && !uploadedFile && !preAddedFile && <FileUploader
            multiple={false}
            handleChange={handleFile}
            name="file"
            types={allowedFormats}
            label='Click to upload or drop a file here'
            hoverTitle=""
            onTypeError={(error) => onError?.(error)}
            maxSize={maxUploadSizeInMB}
            onSizeError={(error) => onError?.(error)}
            classes="border-gray-200 block w-full flex items-center justify-center"
          >
            <UploaderChildren hasFile={Boolean(uploadedFile || preAddedFile)} allowedFormats={allowedFormats} />
          </FileUploader>}          


          {(preAddedFile || uploadedFile) && 
          <>
            <button type='button' aria-label='Change file' onClick={toggleChange} className="text-xs font-medium absolute top-3 right-3"><ArrowPathIcon className="w-4 h-4" /></button>
            <div className='mt-1 flex flex-row items-start gap-x-2 lg:w-inherit relative box-border w-full'>
              {uploadedFile &&  (
                  fileExt === 'jpeg' || fileExt === 'png' || fileExt === 'jpg' 
                  ?
                  <img alt="" className="h-12 shadow-lg shadow-at-black/5" src={uploadedFile} /> 
                  :
                  <div className='h-10 mb-3 w-10s flex items-center justify-center border-2 border-white shadow-lg'>
                      <p className='text-sm font-space font-medium text-at-dark-gray dark:text-slate-200'>.{fileExt}</p>
                  </div>
              )}
              {preAddedFile && !uploadedFile && (
                  preAddedFileName.split('.').pop() === 'jpeg' || preAddedFileName.split('.').pop() === 'png' || preAddedFileName.split('.').pop() === 'jpg' 
                  ?
                  <>
                    <a href={preAddedFile} target="_blank" rel="noreferrer">
                      <img alt="" className="h-12" src={preAddedFile} /> 
                    </a>
                    <p className="text-xs px-0 mt-3 lg:px-4 text-at-dark-gray dark:text-slate-200 w-full">
                      File name: <span className='font-medium'>{preAddedFileName.split('/').pop()}</span>
                    </p> 
                  </>
                  :
                  <a href={preAddedFile} target="_blank" className='h-12 w-10 border-l-2 border-t-2 border-b-2 border-black flex items-center justify-center' rel="noreferrer">
                      <p className='text-sm font-space font-medium text-at-dark-gray dark:text-slate-200'>.{preAddedFileName.split('.').pop()}</p>
                  </a>
              )}
                {fileName && 
                <p className="text-xs px-4 text-at-dark-gray dark:text-slate-200 w-full">
                    Size: {fileSize?.toLocaleString()} MB<br />
                    File name: <span className='font-medium'>{fileName.substring(0,25)}{fileName.length > 25 && '...'} </span>
                </p> }
            </div>
          </>}

          {(isUploading || uploadProgress > 0) && (
            <div className='mt-3'>
              <div className='w-full h-0.5 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden'>
                <div
                  className='h-full bg-green-500 transition-all duration-200'
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className='flex items-center justify-between mt-1'>
                <p className='text-xs text-gray-500 mt-1'>
                  {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload complete'}
                </p>

                <div className='flex items-center gap-2 mt-2'>
                  {isUploading && (
                    <button
                      className='text-xs rounded font-medium text-red-500 hover:text-red-700 dark:hover:text-red-300 transition duration-200'
                      onClick={cancelUpload}
                      type='button'
                    >
                      Cancel
                    </button>
                  )}

                  {!isUploading && uploadError && selectedFile && (
                    <button
                      className='text-xs rounded dark:text-gray-100 text-gray-700 transition duration-200'
                      onClick={retryUpload}
                      type='button'
                    >
                      Retry upload
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {uploadError && <p className='text-xs text-red-400 mt-2'>{uploadError}</p>}
      </div>
    </div>
  )
}

export default FileUpload