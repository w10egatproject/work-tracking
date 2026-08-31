"use client"

import React from "react"
import { Image as ImageIcon, X } from "lucide-react"

interface TaskPhotoLightboxModalProps {
  isOpen: boolean
  title: string
  imageUrl?: string
  onClose: () => void
}

export default function TaskPhotoLightboxModal({
  isOpen,
  title,
  imageUrl,
  onClose,
}: TaskPhotoLightboxModalProps) {
  if (!isOpen || !imageUrl) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-xs text-slate-200 line-clamp-1">{title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 flex items-center justify-center bg-black/40">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}
