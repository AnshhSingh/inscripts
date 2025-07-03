import React, { useRef, useState } from 'react';
import { TopBar } from '@/components/spreadsheet/TopBar';
import { Toolbar } from '@/components/spreadsheet/Toolbar';
import { ViewTabs } from '@/components/spreadsheet/ViewTabs';
import ExcelSpreadsheet from '@/components/spreadsheet/ExcelSpreadsheet';

const Index = () => {
  const spreadsheetRef = useRef<{ handleExport: () => void; handleImport: (file: File) => Promise<void> }>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = () => {
    // Call the export function on the spreadsheet component
    if (spreadsheetRef.current) {
      spreadsheetRef.current.handleExport();
    }
  };

  const handleImport = async (file: File) => {
    // Call the import function on the spreadsheet component
    if (spreadsheetRef.current) {
      await spreadsheetRef.current.handleImport(file);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <TopBar onSearch={handleSearch} searchTerm={searchTerm} />
      <Toolbar onExport={handleExport} onImport={handleImport} />
      <div className="flex-1 overflow-hidden">
        <ExcelSpreadsheet ref={spreadsheetRef} searchTerm={searchTerm} />
      </div>
      <ViewTabs />
    </div>
  );
};

export default Index;
