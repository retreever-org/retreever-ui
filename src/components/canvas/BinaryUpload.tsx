import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import { uploadFile, deleteFile, getFile } from "../../storage/file-storage";
import { useViewingDocStore } from "../../stores/viewing-doc-store";
import { DeleteIcon, DocumentIcon } from "../../svgs/svgs";

const BinaryUpload = () => {
  const { tabDoc, updateUiRequest } = useViewingDocStore();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!tabDoc) return;

    const id = await uploadFile(file);

    updateUiRequest({
      body: {
        ...tabDoc.uiRequest.body,
        binaryFileId: id,
      },
    });
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const onDrop = async (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  };

  const onRemove = async () => {
    const id = tabDoc?.uiRequest.body.binaryFileId;
    if (!id) return;

    await deleteFile(id);

    updateUiRequest({
      body: {
        ...tabDoc!.uiRequest.body,
        binaryFileId: undefined,
      },
    });
  };

  const fileId = tabDoc?.uiRequest.body.binaryFileId;

  const loadFileName = async () => {
    if (fileId) {
      const blob = await getFile(fileId);
      if (blob) {
        if (blob instanceof File) {
          setFileName(blob.name ?? fileId);
          return;
        }
      } else {
        setFileName(null);
      }
    }
  };

  useEffect(() => {
    loadFileName();
  }, []);

  return (
    <div
      className={`w-2/5 h-16 group ${
        fileId ? "bg-surface-800" : "bg-transparent"
      }`}
    >
      <span>{}</span>
      {fileId ? (
        <div
          className="
          flex items-center justify-between h-full px-4
          border border-surface-500/50
          rounded-md
          text-sm
        "
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-surface-200">
              <DocumentIcon />
            </span>
            <span className="truncate max-w-60">{fileName}</span>
          </div>

          <button
            onClick={onRemove}
            className="hidden group-hover:inline-flex text-red-400 hover:text-red-500"
          >
            <DeleteIcon />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="
            flex items-center justify-center
            cursor-pointer h-full
            border border-surface-500/50
            bg-transparent
            rounded-md
            text-sm text-muted-foreground
            focus-within:outline-2
            focus-within:outline-primary-400
        "
        >
          <input type="file" onChange={onChange} className="hidden" />
          Drag & drop file here or click to upload
        </label>
      )}
    </div>
  );
};

export default BinaryUpload;
