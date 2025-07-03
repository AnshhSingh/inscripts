import React, { useState } from 'react';

interface ViewTabsProps {
  className?: string;
}

const tabs = [
  { id: 'all', label: 'All Orders', active: true },
  { id: 'pending', label: 'Pending', active: false },
  { id: 'reviewed', label: 'Reviewed', active: false },
  { id: 'arrived', label: 'Arrived', active: false }
];

export const ViewTabs: React.FC<ViewTabsProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className={`items-center flex w-full gap-6 bg-white pl-8 pr-4 pt-1 border-t-[#EEE] border-t border-solid max-md:max-w-full max-md:pl-5 ${className}`}>
      <nav className="self-stretch flex min-w-60 my-auto max-md:max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 text-base font-medium px-4 py-2.5 transition-colors ${
              activeTab === tab.id
                ? 'text-[#3E5741] font-semibold bg-[#E8F0E9] border-t-2 border-t-[#4B6A4F] border-solid justify-center'
                : 'text-[#757575] whitespace-nowrap justify-center hover:text-[#3E5741] hover:bg-gray-50'
            }`}
          >
            <div className="self-stretch my-auto">
              {tab.label}
            </div>
          </button>
        ))}
        <div className="self-stretch flex items-center gap-1 justify-center h-full w-9 px-1 py-2">
          <button className="items-center rounded self-stretch flex w-7 gap-2 h-7 bg-white my-auto p-1 hover:bg-gray-100 transition-colors">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/551a8f05afdac7e697c1ca17445b7dad15adc5cb?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-5 self-stretch my-auto"
              alt="More options"
            />
          </button>
        </div>
      </nav>
    </div>
  );
};
