import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { bookAPI } from '@/lib/api';

interface ExportMenuProps {}

function ExportMenu({}: ExportMenuProps) {
  const [exportFormats, setExportFormats] = useState<Record<string, any>>({});
  const [isExportingState, setIsExporting] = useState<boolean>(false);

  // Load available export formats on mount
  useEffect(() => {
    // TODO: Replace with backend-supported export formats if available
    setExportFormats({
      json: { name: 'JSON', description: 'Raw data format', available: true },
      csv: { name: 'CSV', description: 'Spreadsheet format', available: true },
      txt: { name: 'Text', description: 'Plain text format', available: true },
      html: { name: 'HTML', description: 'Web page format', available: true },
    });
  }, []);

  /**
   * Handles export for a given format.
   * @param {string} format - The export format key
   */
  const exportBooksMutation = useMutation({
    mutationFn: (format: string) => Promise.resolve(`Exported ${format}`), // TODO: implement bookAPI.exportBooks(format)
    onError: (error: any) => window.alert(`Export failed: ${error.message}`),
  });
  const exportCompleteMutation = useMutation({
    mutationFn: () => Promise.resolve('Export complete'), // TODO: implement bookAPI.exportComplete()
    onError: (error: any) =>
      window.alert(`Backup export failed: ${error.message}`),
  });
  const isExporting =
    exportBooksMutation.isPending || exportCompleteMutation.isPending;

  const handleExport = (format: string) => {
    exportBooksMutation.mutate(format);
  };

  /**
   * Handles export of a complete backup (ZIP file).
   */
  const handleBackupExport = () => {
    exportCompleteMutation.mutate();
  };

  /**
   * Returns the appropriate icon for a given export format.
   * @param {string} format
   * @returns {JSX.Element}
   */
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json':
        return <File className="h-4 w-4" aria-hidden="true" />;
      case 'csv':
      case 'xlsx':
        return <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />;
      case 'txt':
      case 'pdf':
        return <FileText className="h-4 w-4" aria-hidden="true" />;
      default:
        return <File className="h-4 w-4" aria-hidden="true" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isExporting}
          aria-label="Export library data"
        >
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Library</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(exportFormats).map(([format, info]) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
            disabled={!info.available || isExporting}
            className="cursor-pointer"
            aria-label={`Export as ${info.name}`}
          >
            <div className="flex items-center w-full">
              {getFormatIcon(format)}
              <div className="ml-2 flex-1">
                <div className="font-medium">{info.name}</div>
                <div className="text-xs text-muted-foreground">
                  {info.description}
                </div>
              </div>
              {!info.available && (
                <span className="text-xs text-muted-foreground">N/A</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleBackupExport}
          disabled={isExporting}
          className="cursor-pointer"
          aria-label="Export complete backup"
        >
          <Package className="h-4 w-4 mr-2" aria-hidden="true" />
          <div>
            <div className="font-medium">Complete Backup</div>
            <div className="text-xs text-muted-foreground">
              ZIP file with all data and images
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export default at end of file (single export only)

export default ExportMenu;
