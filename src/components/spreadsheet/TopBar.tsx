import React from 'react';

interface TopBarProps {
  className?: string;
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ className = "", onSearch, searchTerm = "" }) => {
  // Debounce search to avoid too many updates
  const debounceTimeout = React.useRef<NodeJS.Timeout>();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('TopBar: Search input changed:', value);
    
   
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

 
    debounceTimeout.current = setTimeout(() => {
      console.log('TopBar: Search executed with term:', value);
      onSearch?.(value);
    }, 300);
  };

  const handleWorkspaceClick = () => {
    console.log('TopBar: Workspace navigation clicked');
  };

  const handleFolder2Click = () => {
    console.log('TopBar: Folder 2 navigation clicked');
  };

  const handleEditClick = () => {
    console.log('TopBar: Sheet name edit button clicked');
  };

  const handleNotificationsClick = () => {
    console.log('TopBar: Notifications button clicked');
  };

  const handleProfileClick = () => {
    console.log('TopBar: User profile section clicked');
  };

  return (
    <header className={`justify-between items-center flex w-full gap-[40px_100px] overflow-hidden flex-wrap bg-white px-4 py-2 border-b-[#EEE] border-b border-solid max-md:max-w-full ${className}`}>
      <nav className="self-stretch flex min-w-60 items-center gap-4 justify-center my-auto">
        <img
          src="/icons/homeicon.png"
          className="aspect-[1/1] object-contain w-6 self-stretch shrink-0 my-auto cursor-pointer"
          alt="Home icon"
          onClick={() => console.log('TopBar: Home icon clicked')}
        />
        <div className="self-stretch flex min-w-60 items-center gap-1 my-auto">
          <div 
            className="self-stretch flex items-center gap-2 text-sm text-[#AFAFAF] font-medium whitespace-nowrap leading-none justify-center my-auto cursor-pointer hover:text-[#8F8F8F]"
            onClick={handleWorkspaceClick}
          >
            <div className="text-[#AFAFAF] self-stretch my-auto">
              Workspace
            </div>
          </div>
          <img
            src="/icons/breadcrumbseperator.png"
            className="aspect-[1] object-contain w-3 self-stretch shrink-0 my-auto"
            alt="Breadcrumb separator"
          />
          <div 
            className="self-stretch flex items-center gap-2 text-sm text-[#AFAFAF] font-medium leading-none justify-center my-auto cursor-pointer hover:text-[#8F8F8F]"
            onClick={handleFolder2Click}
          >
            <div className="text-[#AFAFAF] self-stretch my-auto">
              Folder 2
            </div>
          </div>
          <img
            src="/icons/breadcrumbseperator.png"
            className="aspect-[1] object-contain w-3 self-stretch shrink-0 my-auto"
            alt="Breadcrumb separator"
          />
          <div className="self-stretch flex items-center gap-2 justify-center my-auto">
            <div className="text-[#121212] text-sm font-medium leading-none self-stretch my-auto">
              Excel Sheet
            </div>
            <div 
              className="rounded self-stretch flex min-h-6 items-center gap-2 justify-center w-6 my-auto cursor-pointer"
              onClick={handleEditClick}
            >
              <img
                src="/icons/editicon.png"
                className="aspect-[1] object-contain w-5 self-stretch my-auto"
                alt="Edit icon"
              />
            </div>
          </div>
        </div>
      </nav>
      <div className="self-stretch flex min-w-60 items-center gap-1 font-normal my-auto">
        <div className="items-center self-stretch flex gap-2 overflow-hidden text-xs text-[#757575] leading-none bg-[#F6F6F6] my-auto p-3 rounded-md">
          <img
            src="/icons/searchicon.png"
            className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
            alt="Search icon"
          />
          <input
            type="text"
            placeholder="Search within sheet"
            className="text-[#757575] text-ellipsis self-stretch my-auto bg-transparent border-none outline-none"
            onChange={handleSearchChange}
            defaultValue={searchTerm}
          />
        </div>
        <button 
          className="items-center self-stretch flex gap-3 text-[10px] text-[#F6F6F6] font-medium whitespace-nowrap leading-[1.6] w-10 h-10 bg-white my-auto pl-2 pr-0.5 py-2 rounded-lg hover:bg-[#F6F6F6] cursor-pointer"
          onClick={handleNotificationsClick}
        >
          <div className="justify-center items-center self-stretch flex min-h-4 w-4 flex-col h-4 bg-[#4B6A4F] my-auto rounded-[100px] border-2 border-solid border-white">
            <div className="text-[#F6F6F6]">
              2
            </div>
          </div>
        </button>
        <div 
          className="items-center self-stretch flex gap-2 bg-white my-auto pl-2 pr-3 py-1.5 rounded-lg hover:bg-[#F6F6F6] cursor-pointer"
          onClick={handleProfileClick}
        >
          <img
            src="/icons/useravatar.png"
            className="aspect-[1] object-contain w-7 self-stretch shrink-0 my-auto rounded-[50%]"
            alt="User avatar"
          />
          <div className="self-stretch w-14 max-w-[120px] my-auto">
            <div className="text-[#121212] text-xs leading-none">
              John Doe
            </div>
            <div className="text-[#757575] text-ellipsis text-[10px] leading-[1.2]">
              john.doe@companyname.com
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
