import { TopBar } from '@/components/spreadsheet/TopBar';
import { Toolbar } from '@/components/spreadsheet/Toolbar';
import { ViewTabs } from '@/components/spreadsheet/ViewTabs';
import ExcelSpreadsheet from '@/components/spreadsheet/ExcelSpreadsheet';

const Index = () => (
  <div className="flex flex-col h-screen overflow-hidden bg-white">
    <TopBar />
    <Toolbar />
    <div className="flex-1 overflow-hidden">
      <ExcelSpreadsheet />
    </div>
    <ViewTabs />
  </div>
);

export default Index;
