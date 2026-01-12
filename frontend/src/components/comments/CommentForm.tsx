import { useState, useRef } from "react";
import { Button } from "../ui/Button";
import { TextInput } from "../ui/TextInput";
import { Colors } from "../../constants/colors";
import { Image as ImageIcon, X } from "lucide-react";

interface CommentFormProps {
  onSubmit?: (value: string, image?: File) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  onSubmit,
  onCancel,
  placeholder = "Add a comment",
  autoFocus = false,
}: CommentFormProps) {
  const [value, setValue] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!value.trim() && !uploadedImage) return;
    onSubmit?.(value.trim(), uploadedImage || undefined);
    setValue("");
    setUploadedImage(null);
    setImagePreview(null);
  };

  const handleCancel = () => {
    if (!value.trim() && !uploadedImage) return;
    setValue("");
    setUploadedImage(null);
    setImagePreview(null);
    onCancel?.();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setUploadedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <TextInput
          pill={false}
          className="w-full px-3 pr-10"
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          style={{
            borderColor: Colors.Grey[20],
            backgroundColor: Colors.Grey.White,
          }}
          autoFocus={autoFocus}
        />
        {/* TODO: Add image upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-[#F6F7F8] transition"
          title="Upload image"
        >
          <ImageIcon className="h-4 w-4 text-[#7c7c7c]" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {imagePreview && (
        <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: Colors.Grey[20] }}>
          <div className="relative w-full h-48 bg-[#F6F7F8]">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md hover:bg-red-50 transition"
            style={{ border: `1px solid ${Colors.Grey[20]}` }}
          >
            <X className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          color="grey"
          size="sm"
          type="button"
          onClick={handleCancel}
          disabled={!value.trim() && !uploadedImage}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          type="button"
          onClick={handleSubmit}
          disabled={!value.trim() && !uploadedImage}
        >
          Comment
        </Button>
      </div>
    </div>
  );
}