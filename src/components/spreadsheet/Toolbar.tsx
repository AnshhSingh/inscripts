import React from 'react';

interface ToolbarProps {
  className?: string;
  onExport?: () => void;
  onImport?: (file: File) => Promise<void>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ className = "a", onExport, onImport }) => {
  // Create a hidden file input for Excel import
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
      await onImport(file);
      // Clear the input so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleToolbarMenuClick = () => {
    console.log('Toolbar: Menu button clicked');
  };

  const handleHideFieldsClick = () => {
    console.log('Toolbar: Hide fields button clicked');
  };

  const handleSortClick = () => {
    console.log('Toolbar: Sort button clicked');
  };

  const handleFilterClick = () => {
    console.log('Toolbar: Filter button clicked');
  };

  const handleCellViewClick = () => {
    console.log('Toolbar: Cell view button clicked');
  };

  const handleShareClick = () => {
    console.log('Toolbar: Share button clicked');
  };

  const handleNewActionClick = () => {
    console.log('Toolbar: New action button clicked');
  };

  return (
    <div className={`items-center flex w-full gap-2 text-sm leading-none flex-wrap bg-white px-2 py-1.5 border-b-[#EEE] border-b border-solid max-md:max-w-full ${className}`}>
      <button 
        className="justify-center items-center rounded self-stretch flex gap-1 text-[#121212] font-normal bg-white my-auto p-2 hover:bg-gray-50 transition-colors"
        onClick={handleToolbarMenuClick}
      >
        <div className="text-[#121212] self-stretch my-auto">
          Tool bar
        </div>
        <img
          src="/icons/toolbaricon.png"
          className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
          alt="Dropdown arrow"
        />
      </button>
      <div className="self-stretch flex w-px shrink-0 h-6 bg-[#EEE] my-auto" />
      <div className="self-stretch flex min-w-60 items-center gap-1 text-[#121212] font-normal flex-wrap flex-1 shrink basis-4 my-auto max-md:max-w-full">
        <button 
          className="items-center self-stretch flex gap-1 bg-white my-auto pl-2 pr-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
          onClick={handleHideFieldsClick}
        >
          <img
            src="/icons/hideicon.png"
            className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
            alt="Hide fields icon"
          />
          <div className="text-[#121212] self-stretch my-auto">
            Hide fields
          </div>
        </button>
        <button 
          className="items-center self-stretch flex gap-1 whitespace-nowrap bg-white my-auto pl-2 pr-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
          onClick={handleSortClick}
        >
          <img
            src="/icons/sorticon.png"
            className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
            alt="Sort icon"
          />
          <div className="text-[#121212] self-stretch my-auto">
            Sort
          </div>
        </button>
        <button 
          className="items-center self-stretch flex gap-1 whitespace-nowrap bg-white my-auto pl-2 pr-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
          onClick={handleFilterClick}
        >
          <img
            src="/icons/filtericon.png"
            className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
            alt="Filter icon"
          />
          <div className="text-[#121212] self-stretch my-auto">
            Filter
          </div>
        </button>
        <button 
          className="items-center self-stretch flex gap-1 bg-white my-auto pl-2 pr-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
          onClick={handleCellViewClick}
        >
          <img
            src="/icons/cellviewicon.png"
            className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
            alt="Cell view icon"
          />
          <div className="text-[#121212] self-stretch my-auto">
            Cell view
          </div>
        </button>
      </div>
      <div className="self-stretch flex min-w-60 items-center gap-2 my-auto max-md:max-w-full">
        <div className="self-stretch flex min-w-60 gap-2 text-[#545454] font-normal whitespace-nowrap my-auto">
          <button 
            onClick={handleImportClick}
            className="items-center border flex gap-1 bg-white pl-2 pr-3 py-2 rounded-md border-solid border-[#EEE] hover:bg-gray-50 transition-colors"
          >
            <img
              src="/icons/importicon.png"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Import icon"
            />
            <div className="text-[#545454] self-stretch my-auto">
              Import
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <button 
            onClick={onExport} 
            className="items-center border flex gap-1 bg-white pl-2 pr-3 py-2 rounded-md border-solid border-[#EEE] hover:bg-gray-50 transition-colors"
          >
            <img
              src="/icons/exporticon.png"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Export icon"
            />
            <div className="text-[#545454] self-stretch my-auto">
              Export
            </div>
          </button>
          <button 
            className="items-center border flex gap-1 bg-white pl-2 pr-3 py-2 rounded-md border-solid border-[#EEE] hover:bg-gray-50 transition-colors"
            onClick={handleShareClick}
          >
            <img
              src="/icons/shareicon.png"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Share icon"
            />
            <div className="text-[#545454] self-stretch my-auto">
              Share
            </div>
          </button>
        </div>
        <button 
          className="justify-center items-center self-stretch flex gap-1 overflow-hidden text-white font-medium bg-[#4B6A4F] my-auto px-6 py-2 rounded-md max-md:px-5 hover:bg-[#3E5741] transition-colors"
          onClick={handleNewActionClick}
        >
          <img
            src="/icons/newactionicon.png"
            className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
            alt="New action icon"
          />
          <div className="text-white text-ellipsis self-stretch my-auto">
            New Action
          </div>
        </button>
      </div>
    </div>
  );
};
