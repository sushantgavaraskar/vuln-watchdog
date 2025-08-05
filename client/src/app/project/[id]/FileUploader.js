"use client";
export default function FileUploader({ onChange }) {
  return <input type="file" accept=".json,.txt" onChange={onChange} />;
}