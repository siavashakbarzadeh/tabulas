
import FileImportIcon from "../../icons/FileImport";
import FileCheckIcon from "../../icons/FileCheck";

function FileInput({
  id,
  onChange,
  file = null,
  label = null,
  input_label = null,
}) {
  return (
    <>
      {label && (
        <label htmlFor={id} className="text-sm text-zinc-900 mb-1 font-medium">
          {label}
        </label>
      )}
      <label className="w-full relative block p-4 rounded-md text-sm bg-white cursor-pointer">
        <input
          type="file"
          id={id}
          onChange={onChange}
          className="w-0 h-0 opacity-0 absolute left-0 top-0"
        />
        <div className="w-full flex items-center gap-3 p-3 border border-dashed border-zinc-300 rounded-lg text-zinc-500">
          {file ? (
            <FileCheckIcon className="size-6 text-green-700" />
          ) : (
            <FileImportIcon className="size-6 text-zinc-500" />
          )}
          <span className="text-sm">
            {file ? file.name : input_label ? input_label : "Choose a file"}
          </span>
        </div>
      </label>
    </>
  );
}

export default FileInput;
