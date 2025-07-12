
import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Code,
  Globe,
  Package,
  Upload
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import ExportService from '../lib/exportUtils';


interface ExportDropdownProps {}

function ExportDropdown({}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  // ExportService is stateless, so can be instantiated once per render
  const exportService = React.useMemo(() => new ExportService(), []);

  /**
   * Handles export actions for each format.
   * @param {string} format - The export format (json, csv, txt, html, backup)
   */
  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      switch (format) {
        case 'json':
          await exportService.exportAsJSON();
          break;
        case 'csv':
          await exportService.exportAsCSV();
          break;
        case 'txt':
          await exportService.exportAsText();
          break;
        case 'html':
          await exportService.exportAsHTML();
          break;
        case 'backup':
          await exportService.exportCompleteBackup();
          break;
        default:
          // Defensive: should never happen
          console.error('Unknown export format:', format);
      }
    } catch (error) {
      console.error('Export failed:', error);
      window.alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Handles import action for JSON backup files.
   */
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const count = await exportService.importFromJSON(file);
        window.alert(`Successfully imported ${count} books!`);
        // Refresh the page to show imported books
        window.location.reload();
      } catch (error) {
        console.error('Import failed:', error);
        window.alert('Import failed. Please check the file format and try again.');
      }
    };
    input.click();
  };

  // Export options for the dropdown
  const exportOptions = [
    {
      id: 'json',
      label: 'JSON',
      description: 'Raw data format',
      icon: Code,
    },
    {
      id: 'csv',
      label: 'CSV',
      description: 'Spreadsheet format',
      icon: FileSpreadsheet,
    },
    {
      id: 'txt',
      label: 'Text',
      description: 'Plain text format',
      icon: FileText,
    },
    {
      id: 'html',
      label: 'HTML',
      description: 'Web page format',
      icon: Globe,
    },
    {
      id: 'backup',
      label: 'Complete Backup',
      description: 'Full backup with metadata',
      icon: Package,
    },
  ];


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting} aria-label="Export or import library data">
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Library</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {exportOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleExport(option.id)}
              className="cursor-pointer"
              aria-label={`Export as ${option.label}`}
              disabled={isExporting}
            >
              <IconComponent className="h-4 w-4 mr-2" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleImport}
          className="cursor-pointer"
          aria-label="Import from backup"
          disabled={isExporting}
        >
          <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="font-medium">Import</span>
            <span className="text-xs text-muted-foreground">Restore from backup</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default ExportDropdown;

