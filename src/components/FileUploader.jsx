import { useState, useCallback } from "react";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export function FileUploader({ 
  onFileSelect, 
  acceptedTypes = [".json", ".txt", ".lock"], 
  maxSize = 10 
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidType = acceptedTypes.some(type => 
      extension === type || file.name.toLowerCase().includes(type.replace(".", ""))
    );
    
    if (!isValidType) {
      return `File type must be one of: ${acceptedTypes.join(", ")}`;
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect, maxSize, acceptedTypes]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            isDragOver 
              ? "border-primary bg-primary/5 scale-105" 
              : "border-border hover:border-primary/50",
            error && "border-destructive bg-destructive/5"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <input
            type="file"
            onChange={handleInputChange}
            accept={acceptedTypes.join(",")}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-8 h-8 text-secure" />
                <div className="text-left">
                  <p className="font-medium text-secure">File selected successfully</p>
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className={cn(
                "w-12 h-12 mx-auto transition-colors",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )} />
              <div>
                <p className="text-lg font-medium">
                  Drop your dependency file here
                </p>
                <p className="text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Supported files: package.json, requirements.txt, Pipfile.lock, etc.</p>
                <p>Maximum file size: {maxSize}MB</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="mt-4 flex gap-2">
            <Button className="flex-1" size="lg">
              Start Vulnerability Scan
            </Button>
            <Button variant="outline" onClick={clearFile}>
              Choose Different File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}