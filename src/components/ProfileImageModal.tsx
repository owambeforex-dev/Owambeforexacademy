import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Camera, Upload, User, Check, 
  RefreshCw, Image as ImageIcon, ChevronRight,
  ArrowLeft, Trash2
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../lib/imageUtils';

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (image: string) => void;
  currentImage?: string | null;
}

import { AVATARS } from '../constants/avatars';

type View = 'options' | 'camera' | 'avatar' | 'crop';

export default function ProfileImageModal({ isOpen, onClose, onSave, currentImage }: ProfileImageModalProps) {
  const [view, setView] = useState<View>('options');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  
  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    stopCamera();
    setView('options');
    setSelectedImage(null);
    setCapturedPhoto(null);
    setSelectedAvatarId(null);
    onClose();
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    setIsUploading(true);
    try {
      const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
      if (croppedImage) {
        onSave(croppedImage);
        handleClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setView('crop');
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setView('camera');
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photo = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(photo);
        stopCamera();
      }
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      setSelectedImage(capturedPhoto);
      setView('crop');
    }
  };

  const handleAvatarSelect = (url: string, id: string) => {
    setSelectedAvatarId(id);
    setTimeout(() => {
      onSave(url);
      handleClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-bg-primary border-t sm:border border-border-base rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-border-base flex items-center justify-between bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {view !== 'options' && (
              <button 
                onClick={() => {
                  if (view === 'camera') stopCamera();
                  setView('options');
                  setCapturedPhoto(null);
                }}
                className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-text-secondary" />
              </button>
            )}
            <h2 className="text-lg font-bold text-text-primary">
              {view === 'options' && 'Profile Picture'}
              {view === 'camera' && 'Take Photo'}
              {view === 'avatar' && 'Choose Avatar'}
              {view === 'crop' && 'Crop Image'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {view === 'options' && (
              <motion.div
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Current Image Preview */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-bg-secondary border-4 border-brand-primary/20 flex items-center justify-center overflow-hidden">
                      {currentImage ? (
                        <img src={currentImage} alt="Current Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={64} className="text-text-muted" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-between p-4 bg-surface hover:bg-surface-hover border border-border-base rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-text-primary">Upload from device</h3>
                        <p className="text-[10px] text-text-muted">JPG, PNG or WEBP (Max 2MB)</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-text-muted" />
                  </button>

                  <button 
                    onClick={startCamera}
                    className="flex items-center justify-between p-4 bg-surface hover:bg-surface-hover border border-border-base rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-text-primary">Take a photo</h3>
                        <p className="text-[10px] text-text-muted">Use your device camera</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-text-muted" />
                  </button>

                  <button 
                    onClick={() => setView('avatar')}
                    className="flex items-center justify-between p-4 bg-surface hover:bg-surface-hover border border-border-base rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImageIcon size={24} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-text-primary">Choose from avatars</h3>
                        <p className="text-[10px] text-text-muted">Select a pre-generated character</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-text-muted" />
                  </button>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </motion.div>
            )}

            {view === 'camera' && (
              <motion.div
                key="camera"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative w-full aspect-square max-w-sm rounded-3xl overflow-hidden bg-black border-2 border-border-base">
                  {!capturedPhoto ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover mirror"
                    />
                  ) : (
                    <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex items-center gap-4 w-full max-w-sm">
                  {!capturedPhoto ? (
                    <button 
                      onClick={takePhoto}
                      className="flex-1 py-4 bg-brand-primary text-brand-dark rounded-2xl font-bold shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                    >
                      <Camera size={20} /> Capture
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setCapturedPhoto(null);
                          startCamera();
                        }}
                        className="flex-1 py-4 bg-bg-secondary text-text-primary rounded-2xl font-bold flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={20} /> Retake
                      </button>
                      <button 
                        onClick={handleConfirmPhoto}
                        className="flex-1 py-4 bg-brand-primary text-brand-dark rounded-2xl font-bold flex items-center justify-center gap-2"
                      >
                        <Check size={20} /> Use Photo
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'avatar' && (
              <motion.div
                key="avatar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleAvatarSelect(avatar.url, avatar.id)}
                      className={`relative group aspect-square rounded-2xl bg-surface border transition-all overflow-hidden p-1 ${
                        selectedAvatarId === avatar.id ? 'border-brand-primary ring-2 ring-brand-primary/20 scale-95' : 'border-border-base hover:border-brand-primary'
                      }`}
                    >
                      <img src={avatar.url} alt="Avatar" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors" />
                      {selectedAvatarId === avatar.id && (
                        <div className="absolute inset-0 bg-brand-primary/10 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center shadow-lg">
                            <Check size={18} />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-center text-[10px] text-text-muted">
                  Select a premium 3D avatar to use as your profile picture.
                </p>
              </motion.div>
            )}

            {view === 'crop' && (
              <motion.div
                key="crop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6"
              >
                <div className="relative w-full aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden bg-black border-2 border-border-base">
                  {selectedImage && (
                    <Cropper
                      image={selectedImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      cropShape="round"
                      showGrid={false}
                    />
                  )}
                </div>

                <div className="space-y-4 w-full max-w-sm mx-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-text-muted uppercase">
                      <span>Zoom</span>
                      <span>{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setView('options')}
                      className="flex-1 py-4 bg-bg-secondary text-text-primary rounded-2xl font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveCrop}
                      disabled={isUploading}
                      className="flex-1 py-4 bg-brand-primary text-brand-dark rounded-2xl font-bold shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isUploading ? <RefreshCw className="animate-spin" size={20} /> : <><Check size={20} /> Save Image</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #eab308;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid #111;
        }
      `}</style>
    </div>
  );
}
